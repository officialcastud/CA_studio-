# The book of Schedule FSI — foreign-source income and tax relief · ITR-7, A.Y. 2026-27

Read row by row from the utility's **Schedule FSI** sheet (block **`ScheduleFSI`**),
with the hidden-row flags, and confirmed against the schema block **`ScheduleFSI`**
and the validation-rules document. This is the ITR-7 form — filed by trusts,
institutions, political parties, and other persons required to furnish return
under sections 139(4A)/(4B)/(4C)/(4D). Schedule FSI is *"available only in case of
resident"*.

> **Read every head from this sheet.** The head list on the ITR-7 FSI sheet is
> **House Property · Business or Profession · Capital Gains · Other Sources** —
> there is **no Salary head**. Nothing about the head list transfers from another
> form.

## The shape

Row 4 (D4): *"Details of Income from outside India and tax relief (available only
in case of resident)."* One block per **country/region**, four fixed head rows
per block plus a per-country **Total** row. The sheet ships **three** country
blocks visible (rows 8–12, 13–17, 18–22); the VBA adds more on demand. One
repeatable array in the schema: `ScheduleFSI.ScheduleFSIDtls[]`.

The sheet's note (C3-style, on the country column): a country code is the key of
the block; *if no entry is made in the Country Code column, the other columns are
not considered for that country*.

## The items

### Per-country header (row 6, one set of columns per block)

| Sheet col | Item / lettering | Label (verbatim from the sheet) | Type / enum | Schema key | Formula / derivation | Hidden? |
|---|---|---|---|---|---|---|
| D | Sl No | Sl No | auto integer | (index of `ScheduleFSIDtls[]`) | serial per block | no |
| E | — | Country Code | dropdown — country/region list, India excluded | `CountryCodeExcludingIndia` (+ `CountryName`) | from the `FSI_newcountrycod` list | no |
| F | — | Taxpayer Identification number | text | `TaxIdentificationNo` | typed | no |
| G | Sl. | Sl. (i–iv within the block) | label | — | — | no |
| H | (a) | Head of Income (a) | label | — | — | no |
| I | (b) | Income from outside India (included in PART B-TI) (b) | integer (₹) | `<head>.IncFrmOutsideInd` | typed — income already in Part B-TI | no |
| J | (c) | Tax paid outside India (c) | integer (₹) | `<head>.TaxPaidOutsideInd` | typed | no |
| K | (d) | Tax payable on such income under normal provisions in India (d) | integer (₹) | `<head>.TaxPayableinInd` | typed (Indian tax on that slice at the average rate) | no |
| L | (e) | Tax relief available in India (e)= (c) or (d) whichever is lower ( e) | integer (₹), computed | `<head>.TaxReliefinInd` | `L = MIN(J,K)` | no |
| M | (f) | Relevant article of DTAA if relief claimed u/s 90 or 90A (f) | text | `<head>.DTAAReliefUs90or90A` | typed, only when relief under 90/90A | no |

### The four head rows + Total, per country block (rows 8–12, repeated 13–17, 18–22 …)

| G (Sl.) | H — Head of Income | Schema object under `ScheduleFSIDtls[]` |
|---|---|---|
| i | House Property | `IncFromHP` |
| ii | Business or Profession | `IncFromBusiness` |
| iii | Capital Gains | `IncCapGain` |
| iv | Other Sources | `IncOthSrc` |
| — | Total | `TotalCountryWise` |

Each of the five objects (`IncFromHP`, `IncFromBusiness`, `IncCapGain`,
`IncOthSrc`, `TotalCountryWise`) carries the same five leaves: `IncFrmOutsideInd`
(b), `TaxPaidOutsideInd` (c), `TaxPayableinInd` (d), `TaxReliefinInd` (e), and
(except on the Total) `DTAAReliefUs90or90A` (f).

## The rules the sheet computes

- **Column (e), per head — `L = MIN(J,K)`:** the relief is **the lower of foreign
  tax paid (c) and Indian tax payable (d)** on the same income — the section
  90 / 91 rule.
- **Total row — `SUM` down each column:** columns (b)(c)(d)(e) of the Total row
  are the sum of the four head rows above.
- Column (b) is income **already included in Part B-TI** — FSI does not add
  income; it identifies the foreign slice of income the return already carries.
- Column (d), tax payable in India, is the Indian tax on that slice at the
  person's average rate (income × total Indian tax ÷ total income).
- Column (f), the DTAA article, matters for Schedule TR: relief under **90/90A**
  (treaty) needs the article; relief under **91** (no treaty) does not.

## What repeats and what is one figure

- **Repeats:** the whole country block (`ScheduleFSIDtls[]`) — country code, TIN,
  and the four head objects plus the country-wise Total — one per country.
- **One figure per block:** each head's (b)(c)(d)(e)(f) and the Total row.

## What the schema marks mandatory (`ScheduleFSI`)

`ScheduleFSIDtls[]` — required per country: `CountryName`,
`CountryCodeExcludingIndia`, `TaxIdentificationNo`; and for **each** of
`IncFromHP`, `IncFromBusiness`, `IncCapGain`, `IncOthSrc` and `TotalCountryWise`
the leaves `IncFrmOutsideInd`, `TaxPaidOutsideInd`, `TaxPayableinInd`,
`TaxReliefinInd` are required. `DTAAReliefUs90or90A` is optional
(`TotalCountryWise` has no DTAA leaf).

## Cross-sheet feeds

- **In:** column (b) per head is the foreign portion of income the return already
  carries — House Property from Schedule HP, Business from the P&L/BP chain,
  Capital Gains from Schedule CG, Other Sources from Schedule OS — all summed into
  Part B-TI. Column (d) uses the total Indian tax and total income.
- **Out:** the country-wise **(c)** and **(e)** totals feed **Schedule TR** (block
  `ScheduleTR1`; its columns (c) and (d) are "total of (c)/(e) of Schedule FSI in
  respect of each country"). Relief (e) ultimately reduces tax in Part B-TTI via
  TR.

## What it means for the build

1. A repeatable country block: country code + TIN, then the four fixed head rows
   (HP, Business, CG, OS) with (b)(c)(d)(f) typed and **(e) computed as
   `MIN(c,d)`**; (d) worked at the average rate from the tax engine; the Total
   row `SUM`-ing each column.
2. Export `ScheduleFSI.ScheduleFSIDtls[]` with all five objects per country and
   all required leaves; block written only when a country code is present.
3. Feed (c) and (e) country totals to Schedule TR (`ScheduleTR1`).

---

## Appendix A — every live-row label (verbatim)

```
r4  : [C4] FSI  |  [D4] Details of Income from outside India and tax relief (available only in case of resident)
r6  : [D6] Sl No  |  [E6] Country Code  |  [F6] Taxpayer Identification number  |  [G6] Sl.  |  [H6] Head of Income (a)  |  [I6] Income from outside India (included in PART B-TI) (b)  |  [J6] Tax paid outside India (c)  |  [K6] Tax payable on such income under normal provisions in India (d)  |  [L6] Tax relief available in India (e)= (c) or (d) whichever is lower ( e)  |  [M6] Relevant article of DTAA if relief claimed u/s 90 or 90A (f)
r8  : [G8] i  |  [H8] House Property
r9  : [G9] ii  |  [H9] Business or Profession
r10 : [G10] iii  |  [H10] Capital Gains
r11 : [G11] iv  |  [H11] Other Sources
r12 : [G12] Total
r13 : [G13] i  |  [H13] House Property
r14 : [G14] ii  |  [H14] Business or Profession
r15 : [G15] iii  |  [H15] Capital Gains
r16 : [G16] iv  |  [H16] Other Sources
r17 : [G17] Total
r18 : [G18] i  |  [H18] House Property
r19 : [G19] ii  |  [H19] Business or Profession
r20 : [G20] iii  |  [H20] Capital Gains
r21 : [G21] iv  |  [H21] Other Sources
r22 : [G22] Total
```

## Appendix B — every schema leaf of `ScheduleFSI` (`*` = required)

```
  ScheduleFSIDtls[] array
* ScheduleFSIDtls[].CountryName string
* ScheduleFSIDtls[].CountryCodeExcludingIndia string
* ScheduleFSIDtls[].TaxIdentificationNo string
* ScheduleFSIDtls[].IncFromHP.IncFrmOutsideInd integer
* ScheduleFSIDtls[].IncFromHP.TaxPaidOutsideInd integer
* ScheduleFSIDtls[].IncFromHP.TaxPayableinInd integer
* ScheduleFSIDtls[].IncFromHP.TaxReliefinInd integer
  ScheduleFSIDtls[].IncFromHP.DTAAReliefUs90or90A string
* ScheduleFSIDtls[].IncFromBusiness.IncFrmOutsideInd integer
* ScheduleFSIDtls[].IncFromBusiness.TaxPaidOutsideInd integer
* ScheduleFSIDtls[].IncFromBusiness.TaxPayableinInd integer
* ScheduleFSIDtls[].IncFromBusiness.TaxReliefinInd integer
  ScheduleFSIDtls[].IncFromBusiness.DTAAReliefUs90or90A string
* ScheduleFSIDtls[].IncCapGain.IncFrmOutsideInd integer
* ScheduleFSIDtls[].IncCapGain.TaxPaidOutsideInd integer
* ScheduleFSIDtls[].IncCapGain.TaxPayableinInd integer
* ScheduleFSIDtls[].IncCapGain.TaxReliefinInd integer
  ScheduleFSIDtls[].IncCapGain.DTAAReliefUs90or90A string
* ScheduleFSIDtls[].IncOthSrc.IncFrmOutsideInd integer
* ScheduleFSIDtls[].IncOthSrc.TaxPaidOutsideInd integer
* ScheduleFSIDtls[].IncOthSrc.TaxPayableinInd integer
* ScheduleFSIDtls[].IncOthSrc.TaxReliefinInd integer
  ScheduleFSIDtls[].IncOthSrc.DTAAReliefUs90or90A string
* ScheduleFSIDtls[].TotalCountryWise.IncFrmOutsideInd integer
* ScheduleFSIDtls[].TotalCountryWise.TaxPaidOutsideInd integer
* ScheduleFSIDtls[].TotalCountryWise.TaxPayableinInd integer
* ScheduleFSIDtls[].TotalCountryWise.TaxReliefinInd integer
```

## Appendix C — Country/Region code dropdown `FSI_newcountrycod` (cells E8, E13, E18)

India is excluded. Format is **`NAME:code`**. 250 entries (including the leading
`(Select)` and trailing `OTHERS:9999`):

```
(Select)
AFGHANISTAN:93
ALAND ISLANDS:1001
ALBANIA:355
ALGERIA:213
AMERICAN SAMOA:684
ANDORRA:376
ANGOLA:244
ANGUILLA:1264
ANTARCTICA:1010
ANTIGUA AND BARBUDA:1268
ARGENTINA:54
ARMENIA:374
ARUBA:297
AUSTRALIA:61
AUSTRIA:43
AZERBAIJAN:994
BAHAMAS:1242
BAHRAIN:973
BANGLADESH:880
BARBADOS:1246
BELARUS:375
BELGIUM:32
BELIZE:501
BENIN:229
BERMUDA:1441
BHUTAN:975
BOLIVIA (PLURINATIONAL STATE OF):591
BONAIRE, SINT EUSTATIUS AND SABA:1002
BOSNIA AND HERZEGOVINA:387
BOTSWANA:267
BOUVET ISLAND:1003
BRAZIL:55
BRITISH INDIAN OCEAN TERRITORY:1014
BRUNEI DARUSSALAM:673
BULGARIA:359
BURKINA FASO:226
BURUNDI:257
CABO VERDE:238
CAMBODIA:855
CAMEROON:237
CANADA:1
CAYMAN ISLANDS:1345
CENTRAL AFRICAN REPUBLIC:236
CHAD:235
CHILE:56
CHINA:86
CHRISTMAS ISLAND:9
COCOS (KEELING) ISLANDS:672
COLOMBIA:57
COMOROS:270
CONGO:242
CONGO (DEMOCRATIC REPUBLIC OF THE):243
COOK ISLANDS:682
COSTA RICA:506
COTE DIVOIRE:225
CROATIA:385
CUBA:53
CURACAO:1015
CYPRUS:357
CZECHIA:420
DENMARK:45
DJIBOUTI:253
DOMINICA:1767
DOMINICAN REPUBLIC:1809
ECUADOR:593
EGYPT:20
EL SALVADOR:503
EQUATORIAL GUINEA:240
ERITREA:291
ESTONIA:372
ETHIOPIA:251
FALKLAND ISLANDS (MALVINAS):500
FAROE ISLANDS:298
FIJI:679
FINLAND:358
FRANCE:33
FRENCH GUIANA:594
FRENCH POLYNESIA:689
FRENCH SOUTHERN TERRITORIES:1004
GABON:241
GAMBIA:220
GEORGIA:995
GERMANY:49
GHANA:233
GIBRALTAR:350
GREECE:30
GREENLAND:299
GRENADA:1473
GUADELOUPE:590
GUAM:1671
GUATEMALA:502
GUERNSEY:1481
GUINEA:224
GUINEA-BISSAU:245
GUYANA:592
HAITI:509
HEARD ISLAND AND MCDONALD ISLANDS:1005
HOLY SEE:6
HONDURAS:504
HONG KONG:852
HUNGARY:36
ICELAND:354
INDONESIA:62
IRAN (ISLAMIC REPUBLIC OF):98
IRAQ:964
IRELAND:353
ISLE OF MAN:1624
ISRAEL:972
ITALY:5
JAMAICA:1876
JAPAN:81
JERSEY:1534
JORDAN:962
KAZAKHSTAN:7
KENYA:254
KIRIBATI:686
KOREA (DEMOCRATIC PEOPLES REPUBLIC OF):850
KOREA (REPUBLIC OF):82
KUWAIT:965
KYRGYZSTAN:996
LAO PEOPLES DEMOCRATIC REPUBLIC:856
LATVIA:371
LEBANON:961
LESOTHO:266
LIBERIA:231
LIBYA:218
LIECHTENSTEIN:423
LITHUANIA:370
LUXEMBOURG:352
MACAO:853
MACEDONIA (THE FORMER YUGOSLAV REPUBLIC OF):389
MADAGASCAR:261
MALAWI:265
MALAYSIA:60
MALDIVES:960
MALI:223
MALTA:356
MARSHALL ISLANDS:692
MARTINIQUE:596
MAURITANIA:222
MAURITIUS:230
MAYOTTE:269
MEXICO:52
MICRONESIA (FEDERATED STATES OF):691
MOLDOVA (REPUBLIC OF):373
MONACO:377
MONGOLIA:976
MONTENEGRO:382
MONTSERRAT:1664
MOROCCO:212
MOZAMBIQUE:258
MYANMAR:95
NAMIBIA:264
NAURU:674
NEPAL:977
NETHERLANDS:31
NEW CALEDONIA:687
NEW ZEALAND:64
NICARAGUA:505
NIGER:227
NIGERIA:234
NIUE:683
NORFOLK ISLAND:15
NORTHERN MARIANA ISLANDS:1670
NORWAY:47
OMAN:968
PAKISTAN:92
PALAU:680
PALESTINE, STATE OF:970
PANAMA:507
PAPUA NEW GUINEA:675
PARAGUAY:595
PERU:51
PHILIPPINES:63
PITCAIRN:1011
POLAND:48
PORTUGAL:14
PUERTO RICO:1787
QATAR:974
REUNION:262
ROMANIA:40
RUSSIAN FEDERATION:8
RWANDA:250
SAINT BARTHELEMY:1006
SAINT HELENA, ASCENSION AND TRISTAN DA CUNHA:290
SAINT KITTS AND NEVIS:1869
SAINT LUCIA:1758
SAINT MARTIN (FRENCH PART):1007
SAINT PIERRE AND MIQUELON:508
SAINT VINCENT AND THE GRENADINES:1784
SAMOA:685
SAN MARINO:378
SAO TOME AND PRINCIPE:239
SAUDI ARABIA:966
SENEGAL:221
SERBIA:381
SEYCHELLES:248
SIERRA LEONE:232
SINGAPORE:65
SINT MAARTEN (DUTCH PART):1721
SLOVAKIA:421
SLOVENIA:386
SOLOMON ISLANDS:677
SOMALIA:252
SOUTH AFRICA:28
SOUTH GEORGIA AND THE SOUTH SANDWICH ISLANDS:1008
SOUTH SUDAN:211
SPAIN:35
SRI LANKA:94
SUDAN:249
SURINAME:597
SVALBARD AND JAN MAYEN:1012
SWAZILAND:268
SWEDEN:46
SWITZERLAND:41
SYRIAN ARAB REPUBLIC:963
TAIWAN, PROVINCE OF CHINA[A]:886
TAJIKISTAN:992
TANZANIA, UNITED REPUBLIC OF:255
THAILAND:66
TIMOR-LESTE (EAST TIMOR):670
TOGO:228
TOKELAU:690
TONGA:676
TRINIDAD AND TOBAGO:1868
TUNISIA:216
TURKEY:90
TURKMENISTAN:993
TURKS AND CAICOS ISLANDS:1649
TUVALU:688
UGANDA:256
UKRAINE:380
UNITED ARAB EMIRATES:971
UNITED KINGDOM OF GREAT BRITAIN AND NORTHERN IRELAND:44
UNITED STATES OF AMERICA:2
UNITED STATES MINOR OUTLYING ISLANDS:1009
URUGUAY:598
UZBEKISTAN:998
VANUATU:678
VENEZUELA (BOLIVARIAN REPUBLIC OF):58
VIET NAM:84
VIRGIN ISLANDS (BRITISH):1284
VIRGIN ISLANDS (U.S.):1340
WALLIS AND FUTUNA:681
WESTERN SAHARA:1013
YEMEN:967
ZAMBIA:260
ZIMBABWE:263
OTHERS:9999
```
