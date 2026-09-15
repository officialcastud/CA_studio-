# The book of Schedule FSI — income from outside India and tax relief · ITR-3, A.Y. 2026-27

Read row by row from the utility's **FSI** sheet (rows 3–30, no hidden rows),
with its formulas and dropdowns, and confirmed against the schema block
`ScheduleFSI`. The ITR-2 FSI book is a style model only; every figure, item
number and rule below comes from ITR-3's own sources.

## The shape

Schedule FSI is *"Details of Income from outside India and tax relief
(available only in case of resident)"* — one repeatable block **per country**,
each block carrying the country's code and taxpayer identification number and
then a fixed set of head-of-income rows. Unlike ITR-2 (four heads), ITR-3's FSI
has **five** heads — Salary, House Property, **Business or Profession**, Capital
Gains, Other Sources — plus a Total row. The sheet ships **four country blocks**
(rows 7–12, 13–18, 19–24, 25–30) and the VBA `Block Count` cell (R7) lets the
utility add more; it is a repeatable array, not a fixed count. FSI does not add
income — the amounts in column (b) are already in Part B-TI; the schedule
identifies that slice and computes the foreign-tax relief on it.

## The items

Header note on the country column (E5): *"Country Code (Note : If no entry is
made in this column, then other columns will not be considered ...)"*. Row 4 is
the caption **"Details of Income included in Total Income in Part-B-TI above"**.
The per-block Sl No auto-increments (D13 = D7+1, D19 = D13+1, D25 = D19+1).

### Per-country header (one per block)

| Sheet cell | Field label | Type | Schema key | Rule / notes |
|---|---|---|---|---|
| E7/E13/E19/E25 | Country Code | dropdown (string) | `ScheduleFSIDtls[].CountryCodeExcludingIndia` | required; the 249-code list, India excluded. Country **name** is stored in `ScheduleFSIDtls[].CountryName` |
| F7/F13/F19/F25 | Taxpayer Identification number | string, max 75 | `ScheduleFSIDtls[].TaxIdentificationNo` | required |

### The five heads + Total (one set per country block)

Columns: Head of Income (a) · Income from outside India (included in PART
B-TI) (b) · Tax paid outside India (c) · Tax payable on such income
under normal provisions in India (d)** · **Tax relief available in India (e)= (c)
or (d) whichever is lower** · **Relevant article of DTAA if relief claimed u/s 90
or 90A (f)**.

| Sl. | Head (a) | Schema object | (b) → | (c) → | (d) → | (e) → | (f) → |
|---|---|---|---|---|---|---|---|
| i | Salary | `IncFromSal` | `.IncFrmOutsideInd` | `.TaxPaidOutsideInd` | `.TaxPayableinInd` | `.TaxReliefinInd` (computed) | `.DTAAReliefUs90or90A` |
| ii | House Property | `IncFromHP` | `.IncFrmOutsideInd` | `.TaxPaidOutsideInd` | `.TaxPayableinInd` | `.TaxReliefinInd` (computed) | `.DTAAReliefUs90or90A` |
| iii | Business or Profession | `IncFromBusiness` | `.IncFrmOutsideInd` | `.TaxPaidOutsideInd` | `.TaxPayableinInd` | `.TaxReliefinInd` (computed) | `.DTAAReliefUs90or90A` |
| iv | Capital Gains | `IncCapGain` | `.IncFrmOutsideInd` | `.TaxPaidOutsideInd` | `.TaxPayableinInd` | `.TaxReliefinInd` (computed) | `.DTAAReliefUs90or90A` |
| v | Other Sources | `IncOthSrc` | `.IncFrmOutsideInd` | `.TaxPaidOutsideInd` | `.TaxPayableinInd` | `.TaxReliefinInd` (computed) | `.DTAAReliefUs90or90A` |
| | Total | `TotalCountryWise` | `.IncFrmOutsideInd` (computed) | `.TaxPaidOutsideInd` (computed) | `.TaxPayableinInd` (computed) | `.TaxReliefinInd` (computed) | — |

Each of the six objects (`IncFromSal`, `IncFromHP`, `IncFromBusiness`,
`IncCapGain`, `IncOthSrc`, `TotalCountryWise`) has the four leaf integers
`IncFrmOutsideInd`, `TaxPaidOutsideInd`, `TaxPayableinInd`, `TaxReliefinInd`
(each min 0, max 99999999999999). Only the five head objects carry the optional
string `DTAAReliefUs90or90A` (max 16); `TotalCountryWise` has no DTAA leaf.

## The rules the sheet computes

- **[L7]=MIN(J7,K7)** (and L8–L11, L13–L17, L19–L23, L25–L29): column (e), tax
  relief available in India, is **the lower of (c) tax paid outside India and
  (d) tax payable in India** on that head. Rules doc: *"In schedule FSI, column e
  should be lower of column c or column d."*
- **[I12]=SUM(I7:I11)**, **[J12]=SUM(J7:J11)**, **[K12]=SUM(K7:K11)**,
  **[L12]=SUM(L7:L11)** (and the same for rows 18, 24, 30): the Total row is the
  sum of the five heads (i+ii+iii+iv+v) for each of columns b, c, d, e. Rules
  doc: *"Total should be equal to sum of Sl. No. (i+ii+iii+iv+v) for b,c,d,e
  column."*
- **[D13]=D7+1**, **[D19]=D13+1**, **[D25]=D19+1**: the country Sl No
  auto-increments from block to block.
- **[R7] Block Count**: VBA cell governing how many country blocks exist; the
  schedule is a repeatable array.
- Cross-schedule (rules doc): Schedule FSI is **not applicable if residential
  status is non resident**. Relief claimed against a head requires the income
  already declared in that head's own schedule to be **not less** than the FSI
  amount (Salary → Gross salary; House Property → Sl.no 1k+2; Business or
  Profession → Sl.no. D of Trading Account + positive Sl.no.14 of P&L / no-books;
  Capital Gains; Other Sources). Schedule TR Col C and its total tax relief must
  equal the totals of FSI columns (c) and (e) per country.

## Dropdowns

**Country Code** (E7, E13, E19, E25) — source `FSI_newcountrycod`, 250 entries
(the "(Select)" placeholder plus 249 countries as `NAME:code`, India excluded):

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

The other flagged cells (I7/I13/I19/I25 income, M7/M13/M19/M25 DTAA article, the
Total-row ranges, F/A1 text cells) carry input/format masks only (`source` 0 or
75 = max length 75), not value lists.

## What repeats and what is one figure

- **Repeats:** `ScheduleFSIDtls[]` — one element per country, unlimited (four
  blocks on screen, VBA `Block Count` adds more). Each element repeats the full
  header + five heads + Total.
- **One figure per country block:** the header (CountryName, country code, TIN)
  and each of the six head/total objects — single objects, not arrays.

## Mandatory

Schema `required` per `ScheduleFSIDtls[]` element: `CountryName`,
`CountryCodeExcludingIndia`, `TaxIdentificationNo`, and the objects `IncFromSal`,
`IncFromHP`, `IncFromBusiness`, `IncCapGain`, `IncOthSrc`, `TotalCountryWise`.
Within each object, `IncFrmOutsideInd`, `TaxPaidOutsideInd`, `TaxPayableinInd`,
`TaxReliefinInd` are required; `DTAAReliefUs90or90A` is optional. The
`ScheduleFSIDtls` array itself is not required at the block root (a resident with
no foreign income omits the schedule).

## Hidden rows — not built

None. The FSI dump shows no `H`-flagged rows; rows 3–30 are all visible. Rows
6 and blank spacer lines carry no label. The four on-screen blocks (rows 7–12,
13–18, 19–24, 25–30) are visible template blocks, not hidden rows — they realise
the repeatable `ScheduleFSIDtls[]` array.

## What this means for the build

1. A repeatable country block: **Country Code** dropdown (249 countries, India
   excluded) + **Taxpayer Identification number** (max 75), then five typed head
   rows — Salary, House Property, **Business or Profession**, Capital Gains,
   Other Sources — with (b), (c), (d) typed and (f) DTAA-article text, and (e)
   computed as `MIN(c,d)`; a Total row summing i+ii+iii+iv+v for b, c, d, e.
2. Note the ITR-3 difference: **five heads including Business or Profession**
   (`IncFromBusiness`), which ITR-2's FSI does not have. Item numbering i–v.
3. Gate the whole schedule to a **resident** (not applicable to non-resident).
4. Column (d), tax payable in India, comes from the tax engine at the average
   rate; (e) feeds Schedule TR (Col C = total of (c), total relief = total of
   (e) per country) and thence Part B-TTI relief lines.
5. Export `ScheduleFSI.ScheduleFSIDtls[]` — one element per country with all six
   objects; the four required integer leaves in each; `DTAAReliefUs90or90A` only
   where relief is under 90/90A.


## Additional visible rows — verbatim from the sheet (completeness)
Rows present on the utility sheet and captured here verbatim so every visible label is in the book:

- Head of Income (a)
