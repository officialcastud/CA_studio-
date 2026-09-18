# Schedule FSI — Details of Income from outside India and tax relief

Form: **ITR-5**, A.Y. 2026-27. Sheet: **FSI**. Section: `foreign`. Block: **ScheduleFSI**.
Source: `python tools/dump.py --form ITR-5 --sheet "FSI"` (rows / `--formulas` / `--dropdowns "FSI"`) and `--schema ScheduleFSI` / `--leaves ScheduleFSI`; rules from `books/ITR-5/rules.json`; country enum from `books/ITR-5/enums.json`; validator text from `sources/ITR-5/vba_text.txt`; cell↔named-range map from `books/ITR-5/sheet_map.json`. Quotes are verbatim from those sources, never from memory.

## The shape

Schedule FSI is a **repeating per-country block**. For every country in which foreign income was earned, the taxpayer fills a Country Code + Taxpayer Identification Number header, then **four fixed head-of-income rows** (i House Property, ii Business or Profession, iii Capital Gains, iv Other Sources) and a **computed Total row**. Each head row carries five columns (b)–(f); column (e) Tax relief is computed as the lower of (c) and (d).

The block title `[C3]` = **"Schedule FSI"**; the banner `[F3]` (verbatim): **"Details of Income from outside India and tax relief (available only in case of resident)"**. Sub-caption `[D4]`: **"Details of Income included in Total Income in Part-B-TI above"**. The schedule is **available only to residents** — see rules A765/A825 and the VBA `ResidentialStatus1` guard (`Mid(...,1,2)<>"NR"`) below.

The utility ships **two visible country blocks** as templates:
- **Country 1** — header at `[F15]`/`[G15]`, head rows **15–18**, Total row **19**.
- **Country 2** — header at `[F20]`/`[G20]`, head rows **20–23**, Total row **24**.

`[E15]` = Sl. No. 1; `[E20]= 1+E15` (auto serial 2). More countries are added by the add-row control `Button_FSI` (`[E26]`, named range `Button_FSI = FSI!$E$26`) — build it as an **unbounded repeating array**, not a fixed two. The wide staging rows **7–10** are **hidden (H)** report-form backing cells — see "Hidden rows — not built".

The column header row `[E13]..[N13]` and the letter row `[I14]..[N14]` define the columns:

- `[E13]` = **"Sl. No."** — country serial (auto; `E20 = 1+E15`); not a schema field.
- `[F13]` = **"Country Code"** — dropdown `FSI_newcountrycode` ("NAME:code"); splits into schema keys `CountryName` + `CountryCodeExcludingIndia`.
- `[G13]` = **"Taxpayer Identification number"** — text → `TaxIdentificationNo`.
- `[H13]` = **"Sl. No."** — the i/ii/iii/iv head index (fixed rows); not a field.
- `[I13]` = **"Head Of Income"** — fixed labels (House Property / Business or Profession / Capital Gains / Other Sources).
- `[J13]` col **(b)** `[J14]` = **"Income from outside India (included in PART B-TI)"** → `IncFrmOutsideInd`.
- `[K13]` col **(c)** `[K14]` = **"Tax paid outside India"** → `TaxPaidOutsideInd`.
- `[L13]` col **(d)** `[L14]` = **"Tax payable on such income under normal provisions in India"** → `TaxPayableinInd`.
- `[M13]` col **(e)** `[M14]` = **"Tax relief available in India (e)= (c) or (d) whichever is lower"** (computed) → `TaxReliefinInd`.
- `[N13]` col **(f)** `[N14]` = **"Relevant article of DTAA if relief claimed u/s 90 or 90A"** → `DTAAReliefUs90or90A`.

Note `[C28]`/`[D28]` (verbatim): **"Note : Please refer to the instructions for filling out this schedule"**.

## The items

### Block `ScheduleFSI` → `ScheduleFSIDtls[]` (array — one object per country)

Per-country header:

| Field | Type | Schema key | Cell (country 1 / 2) | Rule |
|---|---|---|---|---|
| Country Name | string (≤55) | `ScheduleFSIDtls[].CountryName` | name part of `[F15]` / `[F20]` | mandatory; chars `< > & ' "` not allowed (VBA) |
| Country Code | string, enum[249] | `ScheduleFSIDtls[].CountryCodeExcludingIndia` | code part of `[F15]` / `[F20]` | same country code allowed only once (VBA) |
| Taxpayer Identification number | string (≤75) | `ScheduleFSIDtls[].TaxIdentificationNo` | `[G15]` / `[G20]` | mandatory; same TIN allowed only once (VBA) |

Per-country head rows — five columns (b)–(f) each. Country 1 rows 15–18 (cells `J..N`); country 2 rows 20–23:

| Sl `[H]` | Head `[I]` | (b) Income `[J]` | (c) Tax paid outside `[K]` | (d) Tax payable India `[L]` | (e) Relief `[M]` | (f) DTAA art. `[N]` | Schema object |
|---|---|---|---|---|---|---|---|
| i | House Property | `IncFrmOutsideInd` | `TaxPaidOutsideInd` | `TaxPayableinInd` | `TaxReliefinInd` (=MIN(c,d)) | `DTAAReliefUs90or90A` | `IncFromHP` |
| ii | Business or Profession | `IncFrmOutsideInd` | `TaxPaidOutsideInd` | `TaxPayableinInd` | `TaxReliefinInd` (=MIN(c,d)) | `DTAAReliefUs90or90A` | `IncFromBusiness` |
| iii | Capital Gains | `IncFrmOutsideInd` | `TaxPaidOutsideInd` | `TaxPayableinInd` | `TaxReliefinInd` (=MIN(c,d)) | `DTAAReliefUs90or90A` | `IncCapGain` |
| iv | Other Sources | `IncFrmOutsideInd` | `TaxPaidOutsideInd` | `TaxPayableinInd` | `TaxReliefinInd` (=MIN(c,d)) | `DTAAReliefUs90or90A` | `IncOthSrc` |
| Total | (row 19 / 24) | `IncFrmOutsideInd` (=SUM b) | `TaxPaidOutsideInd` (=SUM c) | `TaxPayableinInd` (=SUM d) | `TaxReliefinInd` (=SUM e) | — | `TotalCountryWise` |

Column types: (b)(c)(d)(e) are **integer ≥ 0, max 99999999999999**; (f) DTAA article is **string ≤16**. `TotalCountryWise` has **no** DTAA article key.

Cell map for country 1 (from `sheet_map.json` named ranges, all `FSI!$…`, suffix `1` = country 1, `2` = country 2):

| Object.leaf | HP | BP | CapGain | OthSrc | Total |
|---|---|---|---|---|---|
| IncFrmOutsideInd (b) | `J15` (FSI_IncFromHP1) | `J16` (FSI_IncFromBP1) | `J17` (FSI_IncCapGain1) | `J18` (FSI_IncOthSrc1) | `J19` (FSI_IncT1) |
| TaxPaidOutsideInd (c) | `K15` (FSI_TXNOHP1) | `K16` (FSI_TXNOBP1) | `K17` (FSI_TXNOCapGain1) | `K18` (FSI_TXNOOthSrc1) | `K19` (FSI_TXNOT1) |
| TaxPayableinInd (d) | `L15` (FSI_TXNIHP1) | `L16` (FSI_TXNIBP1) | `L17` (FSI_TXnICapGain1) | `L18` (FSI_TXNIOthSrc1) | `L19` (FSI_TXNIT1) |
| TaxReliefinInd (e) | `M15` (FSI_TXRHP1) | `M16` (FSI_TXRBP1) | `M17` (FSI_TXRCapGain1) | `M18` (FSI_TXROthSrc1) | `M19` (FSI_TXRT1) |
| DTAAReliefUs90or90A (f) | `N15` (FSI_DTAAHP1) | `N16` (FSI_DTAABP1) | `N17` (FSI_DTAACapGain1) | `N18` (FSI_DTAAOthSrc1) | — |

(`FSI_TXNO*` = tax **paid outside** col c; `FSI_TXNI*` = tax payable **in India** col d; `FSI_TXR*` = tax **relief** col e.)

**Full leaf paths (verbatim schema keys):**
- `ScheduleFSIDtls[].CountryName` (string, ≤55) — required
- `ScheduleFSIDtls[].CountryCodeExcludingIndia` (string, enum 249) — required
- `ScheduleFSIDtls[].TaxIdentificationNo` (string, ≤75) — required
- `ScheduleFSIDtls[].IncFromHP.IncFrmOutsideInd` / `.TaxPaidOutsideInd` / `.TaxPayableinInd` / `.TaxReliefinInd` (integer, required) · `.DTAAReliefUs90or90A` (string ≤16, optional)
- `ScheduleFSIDtls[].IncFromBusiness.IncFrmOutsideInd` / `.TaxPaidOutsideInd` / `.TaxPayableinInd` / `.TaxReliefinInd` (integer, required) · `.DTAAReliefUs90or90A` (string ≤16, optional)
- `ScheduleFSIDtls[].IncCapGain.IncFrmOutsideInd` / `.TaxPaidOutsideInd` / `.TaxPayableinInd` / `.TaxReliefinInd` (integer, required) · `.DTAAReliefUs90or90A` (string ≤16, optional)
- `ScheduleFSIDtls[].IncOthSrc.IncFrmOutsideInd` / `.TaxPaidOutsideInd` / `.TaxPayableinInd` / `.TaxReliefinInd` (integer, required) · `.DTAAReliefUs90or90A` (string ≤16, optional)
- `ScheduleFSIDtls[].TotalCountryWise.IncFrmOutsideInd` / `.TaxPaidOutsideInd` / `.TaxPayableinInd` / `.TaxReliefinInd` (integer, required; no DTAA key)

## The rules the sheet computes (with cell references)

- **Relief per head = lower of (c) and (d)** — `[M15]= MIN(K15,L15)` (repeats M15:M18 for country 1, M20:M23 for country 2). i.e. `TaxReliefinInd = MIN(TaxPaidOutsideInd, TaxPayableinInd)`. Matches rules.json **A764/A765**: *"In schedule FSI, Tax relief available (Column e) should be lower of tax paid outside India (column c) or Tax payable on such income under normal provisions in India (Column d)"*.
- **Country total = sum of the four head rows** — `[J19]= SUM(J15:J18)`, `[K19]= SUM(K15:K18)`, `[L19]= SUM(L15:L18)`, `[M19]= SUM(M15:M18)` (and J24/K24/L24/M24 for country 2). Matches rules.json **A766**: *"In Schedule FSI, Total should be equal to sum of Sl. No. (i+ii+iii+iv) for Column d, c b and e"*.
- **Country serial auto-increment** — `[E20]= 1+E15`. Col E (Sl. No.) is generated, not input.
- **Resident-only** — rules.json **A765**: *"Schedule FSI is not applicable for non residents"*; VBA guards on `sheet1.ResidentialStatus1` (`Mid(...,1,2)<>"NR"`) and warns *"Residents may claim DTAA benefit under Schedule TR and FSI."*

### Income-floor cross rules (rules.json)

- **A767** — *"Income against house property shown in schedule FSI should be minimum amount income shown in Sl.no 1k+3 under … house property"* (col b HP ≤ HP-head income).
- **A768/A769** — *"Income against Business or profession shown in schedule FSI should be mimimun income shown in (Sl.no.D of Trading Account + Positive values of Sl.no. 14 of schedule Profit and loss)"*.
- **A769** — *"Income against Capital gains shown in schedule FSI cannot be less than income shown under the head … capital gains"* (note the "cannot be less than" wording).
- **A770** — *"Income against other sources shown in schedule FSI cannot be less than income shown under the head … other sources"*.

### Tie to Schedule TR and Part B-TTI (rules.json)

- **A771/A772** — Schedule TR Sl.no.2 (*"Total Tax relief available in respect of country where DTAA is applicable"*) = **Total of column 1(d) of TR where section = "90"/"90A"** at col 1(e). The section 90/90A vs 91 selection lives in **Schedule TR col 1(e)**, not in FSI (FSI only records the DTAA article in col (f)).
- **A773** — Schedule TR Sl.no.3 (*"…where DTAA is not applicable"*) = total of col 1(d) where section = **"91"**; and TR Sl.no.2+3 = total of column 1(d).
- **A775** — *"In Schedule TR, Col c Total taxes paid outside India … equal to total of Col. C of Schedule FSI in respect of each country"* (TR col c ← FSI col (c) `TaxPaidOutsideInd`).
- **A776** — *"In Schedule TR, Col d Total tax relief available should be equal to total of Col. e of Schedule FSI in respect of each country"* (TR col d ← FSI col (e) `TaxReliefinInd`).
- **A826** — Part B-TTI Sl.no.6a *"Section 90/90A"* = TR Sl.no.2; **A827** — Part B-TTI 6b *"Section 91"* = TR Sl.no.3 (so FSI feeds relief up through TR into Part B-TTI 6a/6b/6c).

### VBA validators (`sources/ITR-5/vba_text.txt`)

- *"The same TIN should be allowed only once."* and *"The same Country code should be allowed only once."* (dedup on `FSI_TaxIdentificationNo` / `FSI_CountryCode`, lines ~3175–3176, 3215).
- *"Details of Country in Sch FSI are mandatory"*; *"CountryName at Sr. No. … in Sheet FSI is mandatory"* and *"characters < > & ' \" … are not allowed"* (line ~11555).
- *"TaxIdentificationNo at Sr. No. … in Sheet FSI is mandatory"* (same char restriction).
- *"BP at Sr. No. … Income from outside India offered for tax in India is mandatory in Schedule FSI"* (line ~11558).

## Dropdowns

`python tools/dump.py --form ITR-5 --dropdowns "FSI"`:

- **`F7:F10 F15 F20`** (Country Code) — source `FSI_newcountrycode` (`DB!$AA$1:$AA$250`), **250 values** in "NAME:code" form. The schema enum `CountryCodeExcludingIndia` holds the **249** codes (the "(Select)" placeholder excluded). Full value list (verbatim):
  `(Select)` · `AFGHANISTAN:93` · `ALAND ISLANDS:1001` · `ALBANIA:355` · `ALGERIA:213` · `AMERICAN SAMOA:684` · `ANDORRA:376` · `ANGOLA:244` · `ANGUILLA:1264` · `ANTARCTICA:1010` · `ANTIGUA AND BARBUDA:1268` · `ARGENTINA:54` · `ARMENIA:374` · `ARUBA:297` · `AUSTRALIA:61` · `AUSTRIA:43` · `AZERBAIJAN:994` · `BAHAMAS:1242` · `BAHRAIN:973` · `BANGLADESH:880` · `BARBADOS:1246` · `BELARUS:375` · `BELGIUM:32` · `BELIZE:501` · `BENIN:229` · `BERMUDA:1441` · `BHUTAN:975` · `BOLIVIA (PLURINATIONAL STATE OF):591` · `BONAIRE, SINT EUSTATIUS AND SABA:1002` · `BOSNIA AND HERZEGOVINA:387` · `BOTSWANA:267` · `BOUVET ISLAND:1003` · `BRAZIL:55` · `BRITISH INDIAN OCEAN TERRITORY:1014` · `BRUNEI DARUSSALAM:673` · `BULGARIA:359` · `BURKINA FASO:226` · `BURUNDI:257` · `CABO VERDE:238` · `CAMBODIA:855` · `CAMEROON:237` · `CANADA:1` · `CAYMAN ISLANDS:1345` · `CENTRAL AFRICAN REPUBLIC:236` · `CHAD:235` · `CHILE:56` · `CHINA:86` · `CHRISTMAS ISLAND:9` · `COCOS (KEELING) ISLANDS:672` · `COLOMBIA:57` · `COMOROS:270` · `CONGO:242` · `CONGO (DEMOCRATIC REPUBLIC OF THE):243` · `COOK ISLANDS:682` · `COSTA RICA:506` · `COTE DIVOIRE:225` · `CROATIA:385` · `CUBA:53` · `CURACAO:1015` · `CYPRUS:357` · `CZECHIA:420` · `DENMARK:45` · `DJIBOUTI:253` · `DOMINICA:1767` · `DOMINICAN REPUBLIC:1809` · `ECUADOR:593` · `EGYPT:20` · `EL SALVADOR:503` · `EQUATORIAL GUINEA:240` · `ERITREA:291` · `ESTONIA:372` · `ETHIOPIA:251` · `FALKLAND ISLANDS (MALVINAS):500` · `FAROE ISLANDS:298` · `FIJI:679` · `FINLAND:358` · `FRANCE:33` · `FRENCH GUIANA:594` · `FRENCH POLYNESIA:689` · `FRENCH SOUTHERN TERRITORIES:1004` · `GABON:241` · `GAMBIA:220` · `GEORGIA:995` · `GERMANY:49` · `GHANA:233` · `GIBRALTAR:350` · `GREECE:30` · `GREENLAND:299` · `GRENADA:1473` · `GUADELOUPE:590` · `GUAM:1671` · `GUATEMALA:502` · `GUERNSEY:1481` · `GUINEA:224` · `GUINEA-BISSAU:245` · `GUYANA:592` · `HAITI:509` · `HEARD ISLAND AND MCDONALD ISLANDS:1005` · `HOLY SEE:6` · `HONDURAS:504` · `HONG KONG:852` · `HUNGARY:36` · `ICELAND:354` · `INDONESIA:62` · `IRAN (ISLAMIC REPUBLIC OF):98` · `IRAQ:964` · `IRELAND:353` · `ISLE OF MAN:1624` · `ISRAEL:972` · `ITALY:5` · `JAMAICA:1876` · `JAPAN:81` · `JERSEY:1534` · `JORDAN:962` · `KAZAKHSTAN:7` · `KENYA:254` · `KIRIBATI:686` · `KOREA (DEMOCRATIC PEOPLES REPUBLIC OF):850` · `KOREA (REPUBLIC OF):82` · `KUWAIT:965` · `KYRGYZSTAN:996` · `LAO PEOPLES DEMOCRATIC REPUBLIC:856` · `LATVIA:371` · `LEBANON:961` · `LESOTHO:266` · `LIBERIA:231` · `LIBYA:218` · `LIECHTENSTEIN:423` · `LITHUANIA:370` · `LUXEMBOURG:352` · `MACAO:853` · `MACEDONIA (THE FORMER YUGOSLAV REPUBLIC OF):389` · `MADAGASCAR:261` · `MALAWI:265` · `MALAYSIA:60` · `MALDIVES:960` · `MALI:223` · `MALTA:356` · `MARSHALL ISLANDS:692` · `MARTINIQUE:596` · `MAURITANIA:222` · `MAURITIUS:230` · `MAYOTTE:269` · `MEXICO:52` · `MICRONESIA (FEDERATED STATES OF):691` · `MOLDOVA (REPUBLIC OF):373` · `MONACO:377` · `MONGOLIA:976` · `MONTENEGRO:382` · `MONTSERRAT:1664` · `MOROCCO:212` · `MOZAMBIQUE:258` · `MYANMAR:95` · `NAMIBIA:264` · `NAURU:674` · `NEPAL:977` · `NETHERLANDS:31` · `NEW CALEDONIA:687` · `NEW ZEALAND:64` · `NICARAGUA:505` · `NIGER:227` · `NIGERIA:234` · `NIUE:683` · `NORFOLK ISLAND:15` · `NORTHERN MARIANA ISLANDS:1670` · `NORWAY:47` · `OMAN:968` · `PAKISTAN:92` · `PALAU:680` · `PALESTINE, STATE OF:970` · `PANAMA:507` · `PAPUA NEW GUINEA:675` · `PARAGUAY:595` · `PERU:51` · `PHILIPPINES:63` · `PITCAIRN:1011` · `POLAND:48` · `PORTUGAL:14` · `PUERTO RICO:1787` · `QATAR:974` · `REUNION:262` · `ROMANIA:40` · `RUSSIAN FEDERATION:8` · `RWANDA:250` · `SAINT BARTHELEMY:1006` · `SAINT HELENA, ASCENSION AND TRISTAN DA CUNHA:290` · `SAINT KITTS AND NEVIS:1869` · `SAINT LUCIA:1758` · `SAINT MARTIN (FRENCH PART):1007` · `SAINT PIERRE AND MIQUELON:508` · `SAINT VINCENT AND THE GRENADINES:1784` · `SAMOA:685` · `SAN MARINO:378` · `SAO TOME AND PRINCIPE:239` · `SAUDI ARABIA:966` · `SENEGAL:221` · `SERBIA:381` · `SEYCHELLES:248` · `SIERRA LEONE:232` · `SINGAPORE:65` · `SINT MAARTEN (DUTCH PART):1721` · `SLOVAKIA:421` · `SLOVENIA:386` · `SOLOMON ISLANDS:677` · `SOMALIA:252` · `SOUTH AFRICA:28` · `SOUTH GEORGIA AND THE SOUTH SANDWICH ISLANDS:1008` · `SOUTH SUDAN:211` · `SPAIN:35` · `SRI LANKA:94` · `SUDAN:249` · `SURINAME:597` · `SVALBARD AND JAN MAYEN:1012` · `SWAZILAND:268` · `SWEDEN:46` · `SWITZERLAND:41` · `SYRIAN ARAB REPUBLIC:963` · `TAIWAN, PROVINCE OF CHINA[A]:886` · `TAJIKISTAN:992` · `TANZANIA, UNITED REPUBLIC OF:255` · `THAILAND:66` · `TIMOR-LESTE(EAST TIMOR):670` · `TOGO:228` · `TOKELAU:690` · `TONGA:676` · `TRINIDAD AND TOBAGO:1868` · `TUNISIA:216` · `TURKEY:90` · `TURKMENISTAN:993` · `TURKS AND CAICOS ISLANDS:1649` · `TUVALU:688` · `UGANDA:256` · `UKRAINE:380` · `UNITED ARAB EMIRATES:971` · `UNITED KINGDOM OF GREAT BRITAIN AND NORTHERN IRELAND:44` · `UNITED STATES OF AMERICA:2` · `UNITED STATES MINOR OUTLYING ISLANDS:1009` · `URUGUAY:598` · `UZBEKISTAN:998` · `VANUATU:678` · `VENEZUELA (BOLIVARIAN REPUBLIC OF):58` · `VIET NAM:84` · `VIRGIN ISLANDS (BRITISH):1284` · `VIRGIN ISLANDS (U.S.):1340` · `WALLIS AND FUTUNA:681` · `WESTERN SAHARA:1013` · `YEMEN:967` · `ZAMBIA:260` · `ZIMBABWE:263` · `OTHERS:9999`
- **All other listed ranges are numeric/text input cells, not value lists** (`source: "0"`, values `null`) — the (b)/(c)/(d)/(e) amount columns, the DTAA-article text columns, and the Total cells (`J19:M19`, `J24:M24`, etc.). `G7:G10` (source `"16"`) and `G15/G20` (source `"75"`) are text-length constraints on the TIN, not dropdowns.

## What repeats and what is one figure

- **Repeats:** `ScheduleFSIDtls[]` — one object per country, driven by `Button_FSI` (`[E26]`). The utility ships two template blocks (rows 15–19 and 20–24); build it as an **unbounded repeating array**, not a fixed two. Within each object, the four head sub-objects (`IncFromHP`, `IncFromBusiness`, `IncCapGain`, `IncOthSrc`) and `TotalCountryWise` are fixed, one each.
- **One figure each (per country object):** `CountryName`, `CountryCodeExcludingIndia`, `TaxIdentificationNo`, and the `TotalCountryWise` sums (b/c/d/e). No sheet-level grand total exists in this block (the grand totals live in Schedule TR).

## Mandatory

- Schema top-level `required`: none declared at `ScheduleFSI` (the block is optional — fill only when foreign income exists).
- Within each `ScheduleFSIDtls[]` object, the **required** keys (from `--leaves`, marked `*`): `CountryName`, `CountryCodeExcludingIndia`, `TaxIdentificationNo`; and in every head object (`IncFromHP`, `IncFromBusiness`, `IncCapGain`, `IncOthSrc`) and `TotalCountryWise`: `IncFrmOutsideInd`, `TaxPaidOutsideInd`, `TaxPayableinInd`, `TaxReliefinInd`. **`DTAAReliefUs90or90A` is optional** in every head object; `TotalCountryWise` has no DTAA key.
- VBA additionally enforces: Country details mandatory, CountryName mandatory, TaxIdentificationNo mandatory, BP income-from-outside mandatory, and TIN/Country-code uniqueness.

## Hidden rows — not built

Rows **7, 8, 9, 10** are marked **H** (hidden) — the wide report-form (`fsirptfrm`) staging area spanning columns `F..AE`, backing the add-row control. **Do not build these as form fields.** They hold:
- `[F7:F10]` (Select) — staging Country Code (`FSI_CountryCode = FSI!$F$7:$F$10`), plus `FSI_TaxIdentificationNo`, `FSI_IncFromHP`, `FSI_TXNOHP`…`FSI_TXRT` staging ranges at rows 7–10.
- Staging MIN formulas: `[K7]= MIN(I7,J7)`, `[P7]= MIN(N7,O7)`, `[U7]= MIN(S7,T7)` (repeat rows 8–10) — the same relief-lower-of logic mirrored in the hidden staging columns; the **visible** computation is `M15= MIN(K15,L15)` (rows 15–24), which is what the build uses.

These hidden cells are the utility's internal marshalling for the repeating array; the visible rows 15–24 (and the `Button_FSI` add-row) are the build surface.

## What this means for the build

- Model `ScheduleFSIDtls` as an **unbounded array**, one object per country: header (`CountryName` + `CountryCodeExcludingIndia` from the "NAME:code" dropdown split, `TaxIdentificationNo`), four head objects each with columns (b)–(f), and a computed `TotalCountryWise`.
- **Compute column (e) per head** as `MIN(TaxPaidOutsideInd, TaxPayableinInd)` and **compute `TotalCountryWise`** as the column sums of the four heads. Do not accept user input for these.
- **Split the country dropdown**: the "NAME:code" value feeds `CountryName` (name) and `CountryCodeExcludingIndia` (code, enum-validated against the 249 codes).
- **Resident-only**: gate the whole schedule on residential status (not `NR`); enforce **unique TIN** and **unique Country code** across rows, and the char restriction (`< > & ' "`) on CountryName/TIN.
- **Wire the cross-ties**: FSI col (c) total → Schedule TR col c (A775); FSI col (e) total → Schedule TR col d (A776); TR Sl.2/Sl.3 (by section 90/90A vs 91, selected in TR col 1(e)) → Part B-TTI 6a/6b (A826/A827). Section 90/90A/91 is **not** an FSI field — FSI only records the DTAA article in col (f); the section is chosen in Schedule TR.
- Enforce the income-floor checks A767–A770 (FSI head income vs the corresponding head of income in the return).
- Do **not** build hidden rows 7–10.
