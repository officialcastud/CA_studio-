# The book of Schedule TR — summary of tax relief claimed · ITR-7, A.Y. 2026-27

Read row by row from the utility's **Schedule TR** sheet, with the hidden-row
flags, and confirmed against the schema block **`ScheduleTR1`** and the
validation-rules document. This is the ITR-7 form; the tax-relief block is
**`ScheduleTR1`** (not `ScheduleTR`). The country reference list lives in hidden
rows 7–255 of this sheet (the source for the Country Code column).

> *"Summary of tax relief claimed for Taxes Paid outside India (available only in
> case of resident)."* One row per country, **generated from Schedule FSI**.

## The shape

Row 3 note (C3): *"(Note : If no entry is made in the Country Code column, then
other columns will not be considered for that row)."* — the country code is the
key of the row. Row 4 (D4): *"Details Summary of tax relief claimed for Taxes Paid
outside India (available only in case of resident)."* Row 5 (E5): *"Details of Tax
relief claimed."* The per-country table sits at rows 7–255 (row 6 is the header);
the summary lines are rows 257–262.

## The items — the per-country table (row 6 headers)

| Sheet col | Item / lettering | Label (verbatim) | Type / enum | Schema key | Derivation |
|---|---|---|---|---|---|
| E | (a) | Country Code (a) | dropdown — country list (rows 7–255) | `CountryCodeExcludingIndia` (+ `CountryName`) | from FSI |
| F | (b) | Taxpayer Identification Number (b) | text | `TaxIdentificationNo` | from FSI |
| G | (c) | Total taxes paid outside India (total of (c) of Schedule FSI in respect of each country) ( c) | integer (₹), computed | `TaxPaidOutsideIndia` | sum of FSI col (c) for that country |
| H | (d) | Total tax relief available (total of (e) of Schedule FSI in respect of each country) (d) | integer (₹), computed | `TaxReliefOutsideIndia` | sum of FSI col (e) for that country |
| I | (e) | Section under which relief claimed (specify 90, 90A or 91) (e) | dropdown — 90 · 90A · 91 | `ReliefClaimedUsSection` | typed |

## The summary lines (rows 257–262)

| Row | Label (verbatim) | Type | Schema key | Derivation |
|---|---|---|---|---|
| 257 | Total of Column (c) and (d) | integer (₹), computed | `TotalTaxOutsideIndia` (col c) / `TotalTaxReliefOutsideIndia` (col d) | totals across countries |
| 259 | Total Tax relief available in respect of country where DTAA is applicable (section 90/90A) (Part of total of 1(d)) | integer (₹), computed | `TaxReliefOutsideIndiaDTAA` | sum of (d) where section = 90 or 90A |
| 260 | Total Tax relief available in respect of country where DTAA is not applicable (section 91) (Part of total of 1(d)) | integer (₹), computed | `TaxReliefOutsideIndiaNotDTAA` | sum of (d) where section = 91 |
| 261 | Whether any tax paid outside India, on which tax relief was allowed in India, has been refunded/credited by the foreign tax authority during the year? If yes, provide the details below | dropdown — YES · NO | `TaxPaidOutsideIndFlg` | typed |
| 262 (E) | Amount of tax refunded | integer (₹) | `AmtTaxRefunded` | typed when YES |
| 262 (G) | b) Assessment year in which tax relief allowed in India | text (AY) | `AssmtYrTaxRelief` | typed when YES |

Plus the block totals: `TotalTaxOutsideIndia` (total of column (c) across
countries) and `TotalTaxReliefOutsideIndia` (total of column (d) across countries),
both drawn from row 257.

## What the schema marks mandatory (`ScheduleTR1`)

`ScheduleTR[]` — required: `CountryName`, `CountryCodeExcludingIndia`,
`TaxIdentificationNo`, `TaxPaidOutsideIndia`, `TaxReliefOutsideIndia`
(`ReliefClaimedUsSection` optional). Block-level required: `TotalTaxOutsideIndia`,
`TotalTaxReliefOutsideIndia`, `TaxReliefOutsideIndiaDTAA`,
`TaxReliefOutsideIndiaNotDTAA`, and **`TaxPaidOutsideIndFlg`** (the refund flag is
**required** on ITR-7). Optional: `AmtTaxRefunded`, `AssmtYrTaxRelief`.

> **ITR-7 schema note — read, do not port:** the grand total of taxes paid is
> `TotalTaxOutsideIndia` on this form. The refund flag `TaxPaidOutsideIndFlg` is
> **mandatory** here (it is optional on ITR-6). Use this form's keys.

## Cross-sheet feeds

- **In:** columns (c) and (d) are the per-country totals of Schedule FSI's columns
  (c) and (e); TIN and country from FSI.
- **Out:** `TaxReliefOutsideIndiaDTAA` (90/90A) and `TaxReliefOutsideIndiaNotDTAA`
  (91) go to **Part B-TTI** as two separate relief lines. The refund flag
  (261/262) is a clawback: relief allowed earlier on foreign tax later refunded
  must be given up (the AY names when it was allowed).

## What it means for the build

1. **TR (`ScheduleTR1`)** — generated from FSI, one row per country: country + TIN
   from FSI, (c) and (d) the per-country FSI totals, the 90/90A/91 dropdown, then
   the two DTAA totals (`TaxReliefOutsideIndiaDTAA`, `TaxReliefOutsideIndiaNotDTAA`)
   and the grand totals (`TotalTaxOutsideIndia`, `TotalTaxReliefOutsideIndia`); the
   YES/NO refund clawback with amount and AY.
2. The two DTAA totals feed Part B-TTI. **Set `TaxPaidOutsideIndFlg` always — it is
   mandatory.**

---

## Appendix A — every live-row (non-hidden) label (verbatim)

```
r3   : [C3] (Note : If no entry is made in the Country Code column, then other columns will not be considered for that row)
r4   : [C4] Schedule TR  |  [D4] Details Summary of tax relief claimed for Taxes Paid outside India (available only in case of resident)
r5   : [E5] Details of Tax relief claimed
r6   : [E6] Country Code (a)  |  [F6] Taxpayer Identification Number (b)  |  [G6] Total taxes paid outside India (total of (c) of Schedule FSI in respect of each country) ( c)  |  [H6] Total tax relief available (total of (e) of Schedule FSI in respect of each country) (d)  |  [I6] Section under which relief claimed (specify 90, 90A or 91) (e)
r257 : [F257] Total of Column (c) and (d)
r259 : [E259] Total Tax relief available in respect of country where DTAA is applicable (section 90/90A) (Part of total of 1(d))
r260 : [E260] Total Tax relief available in respect of country where DTAA is not applicable (section 91) (Part of total of 1(d))
r261 : [E261] Whether any tax paid outside India, on which tax relief was allowed in India, has been refunded/credited by the foreign tax authority during the year? If yes, provide the details below
r262 : [D262] a  |  [E262] Amount of tax refunded  |  [G262] b) Assessment year in which tax relief allowed in India
```

## Appendix B — every schema leaf of `ScheduleTR1` (`*` = required)

```
  ScheduleTR[] array
* ScheduleTR[].CountryName string
* ScheduleTR[].CountryCodeExcludingIndia string
* ScheduleTR[].TaxIdentificationNo string
* ScheduleTR[].TaxPaidOutsideIndia integer
* ScheduleTR[].TaxReliefOutsideIndia integer
  ScheduleTR[].ReliefClaimedUsSection string
* TotalTaxOutsideIndia integer
* TotalTaxReliefOutsideIndia integer
* TaxReliefOutsideIndiaDTAA integer
* TaxReliefOutsideIndiaNotDTAA integer
* TaxPaidOutsideIndFlg string
  AmtTaxRefunded integer
  AssmtYrTaxRelief string
```

## Appendix C — dropdown values

### Section under which relief claimed — col (e), cells I7:I255

```
(Select)
90
90A
91
```

### Refund flag — cell J261

```
(Select)
YES
NO
```

### Country/Region code — Country Code column (a), cells E7:E255 (hidden reference list)

India excluded. Format **`NAME:code`**, 249 entries (`AFGHANISTAN:93` …
`OTHERS:9999`). This list is the source of the Country Code selection; the on-sheet
dropdown prepends `(Select)`:

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
TIMOR-LESTE (EAST TIMOR):670
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
