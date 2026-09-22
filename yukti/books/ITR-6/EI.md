# The book of Schedule EI — Exempt income · ITR-6, A.Y. 2026-27

Read row by row from the utility's **EI** sheet, with the hidden-row flags,
and confirmed against the schema block `ScheduleEI` and the validation-rules
document (serials A646–A660, A739). Item numbers below are the rules
document's own Sl. Nos., never a count of rows.

*"Details of Exempt Income (Income not to be included in Total Income or not
chargeable to tax)."* Nothing here is taxed; but two lines here **affect the
tax** — net agricultural income (Sl. No. 2v) is added for rate purposes
(Part B-TI Sl. No. 16, rule A739), and the pass-through exempt line (Sl. No. 5)
reconciles to Schedule PTI (rule A646). On a company return Sl. No. 2(iv) also
ties back to Schedule BP Sl. No. 40 (rule A649).

---

## 1 · The shape — six numbered lines and three tables

| Sl. No. | Field | Kind | Schema key |
|---|---|---|---|
| **1** | Interest Income | one figure | `InterestInc` |
| — | *Dividend Income* | **hidden** — dividend is taxable now | *(no schema key)* |
| **2** | Agricultural income — the working, i to vi | figures + a land table | *(see §2)* |
| — | *Net Agriculture income (other than income to be excluded under rule 7, 7A, 7B or 8)* | **hidden** | *(no schema key)* |
| — | *Share in the total income of firm/AOP etc. in which partner (PAN + amount)* | **hidden** — reported in Schedule IF, not here | *(no schema key)* |
| **3** | Other exempt income (please specify) — sub-table (a) Income u/s… | a two-dropdown table | `OthersInc.OthersIncDtls[]`, `Others` |
| — | *(b) Any other Income (specify nature) — Dividend Income, Share of profit from Firm* | **hidden** — sub-table not on this filing | *(no schema key)* |
| **4** | Income claimed as not chargeable to tax as per DTAA (Non-residents only) | a table | `IncNotChrgblAsPerDTAA...`, `IncChrgblAsPerDTAA` |
| **5** | Pass through income claimed as not chargeable to tax (Schedule PTI) | one figure | `PassThrIncNotChrgblTax` |
| **6** | **Total (1 + 2v + 3 + 4 + 5)** | computed | `TotalExemptInc` |

The utility's total (cell J58) is
`MAX(0, SUM(InterestInc, DividendInc, NetAgriculturalIncome(2v), Others, Others3a, DTAA-total, Pass-Through))`.
The filed total `TotalExemptInc` follows rule **A647**: Sl. No. 6 = Sl. No. 1 + 2(v) + 3 + 4 + 5.

---

## 2 · Sl. No. 2 — Agricultural income (rows 6–30)

Full label of the head (row 3, F3): *"Details of Exempt Income (Income not to
be included in Total Income or not chargeable to tax)."* Sl. No. 1 (row 4) is
**Interest Income**.

| Item | Row | Label (verbatim) | Type | Schema key | Formula / derivation |
|---|---|---|---|---|---|
| **2(i)** | 6 | Gross Agricultural receipts (other than income to be excluded under rule 7A, 7B or 8 of I.T. Rules) | integer, ≥0 | `GrossAgriRecpt` | input |
| **2(ii)** | 7 | Expenditure incurred on agriculture | integer, ≥0 | `ExpIncAgri` | input |
| **2(iii)** | 8 | Unabsorbed agricultural loss of previous eight assessment years | integer, ≥0 | `UnabAgriLossPrev8` | input |
| **2(iv)** | 9 | Agricultural income portion relating to Rule 7, 7A, 7B(1), 7B(1A) and 8 (from Sl. No.39 of Sch. BP) | integer, ≥0 | `NetAgriIncRelateToRule7` | **fed** — cell H9 `= BP.40`; rule **A649**: = Sl. No. 40 of Schedule BP |
| **2(v)** | 10 | Net Agricultural income for the year (i – ii – iii + iv) (enter nil if loss) | integer, ≥0, **required** | `NetAgriIncOrOthrIncRule7` | computed — cell H10 `= MAX(0, i − ii − iii + iv)`; rule **A648** |

Note ITR-6 differs from ITR-2 here: **2(iv) is a live row** (the Rule 7/7A/7B/8
composite-income portion, fed from Schedule BP Sl. No. 40), and the net at
2(v) therefore **adds** iv: `i − ii − iii + iv`, floored at nil.

### 2(vi) — the land table (rows 16–30)

Row 16 label (verbatim): *"In case the net agricultural income for the year
exceeds Rs.5 lakh, please furnish the following details"*. **Mandatory when
Sl. No. 2v exceeds Rs.5,00,000** (rules **A654 / A655**). Schema:
`ExcNetAgriInc.ExcNetAgriIncDtls[]` — one row per parcel, every column required.

| Col | Header (verbatim, row 17) | Type / enum | Schema key |
|---|---|---|---|
| a | Name of district along with pin code in which agricultural land is located a | text (max 125) + PIN | `NameOfDistrict` + `PinCode` |
| — | Name of district / Pin code (row 18 sub-headers) | text · integer 100000–999999 | `NameOfDistrict` · `PinCode` |
| b | Measurement of agricultural land in Acre b | number (max 999999999) | `MeasurementOfLand` |
| c | Whether the agricultural land is owned or held on lease c | dropdown → `AgriLandOwnedFlag` enum **O / H** | `AgriLandOwnedFlag` |
| d | Whether the agricultural land is irrigated or rain-fed d | dropdown → `AgriLandIrrigatedFlag` enum **IRG / RF** | `AgriLandIrrigatedFlag` |

Dropdown display values as the utility presents them:

Owned/lease (cells I19:I30):
```
(select)
Owned
Head On Lease
```
Irrigated/rain-fed (cells J19:J30):
```
(Select)
Irrigated
Rain-Fed
```
The schema stores the coded flags — **O** (Owned) / **H** (Head On Lease) for
`AgriLandOwnedFlag`, **IRG** (Irrigated) / **RF** (Rain-Fed) for
`AgriLandIrrigatedFlag`.

### The rate effect

Net agricultural income (Sl. No. 2v) is carried to **Part B-TI Sl. No. 16**,
*"Net agricultural income / any other income for rate purpose"* — rule **A739**
requires Part B-TI Sl. No. 16 = Sl. No. 2v of Schedule EI. Where it exceeds
Rs.5,000 and non-agricultural total income is above the basic exemption, it is
added to total income for the purpose of computing the rate (partial
integration), and the rebate is worked in Part B-TTI. A company return has no
basic-exemption slab, so the rate effect is carried but does not change the
flat rate.

---

## 3 · Sl. No. 3 — Other exempt income (rows 32–39)

Row 32 label (verbatim): *"Other exempt income,(please specify)"*. The live
sub-table is **(a) Income u/s…** (row 33 label is hidden; header row 34 and
total row 39 are visible). Driven by **two dependent dropdowns** —
Category first, Sub-category filtered from it, exactly as the utility does.

| Col (row 34, verbatim) | Type / enum | Schema key |
|---|---|---|
| Sl.No. | row index | — |
| Category | dropdown → `Category` enum (10 codes) | `OthersInc.OthersIncDtls[].Category` |
| Sub-category | dropdown → `SubCategory` enum (73 codes), filtered by Category | `OthersInc.OthersIncDtls[].SubCategory` |
| Description | free text (max 125) | `OthersInc.OthersIncDtls[].Description` |
| Amount | integer ≥0, **required** | `OthersInc.OthersIncDtls[].OthAmount` |
| Total (row 39) | computed — cell G39 `= MAX(0, SUM(Amount))`; rule **A650** | `Others` (**required**) |

### The ten categories (schema `Category` enum)

| Code | Category |
|---|---|
| AGRI | Agricultural and related incomes |
| GOVC | Compensation or sums from government or approved entities |
| ISI | Income from specified investments |
| SSRA | Specified sums received by armed-forces personnel |
| SRPC | Sums received from policies or contributions |
| OTH | Other incomes |
| OTHN | Other exempt income for non-residents |
| ICSB | Income of specified companies / statutory bodies |
| IOI | Income of institutions and other entities |
| EIFE | Exempt income of foreign entities |

The category dropdown (cells F35:F37) is itself dependent — the utility picks
the source list by residential status and domestic-company flag
(`PART4_Nature_TP_Res`, `PART4_Nature_TP`, `PART4_Nature_TP_Res_Domestic`,
`PART4_Nature_TP_Domestic`); the tool cannot resolve those named ranges, so the
ten codes above come from the schema enum, not a resolved dropdown.

### The 73 sub-categories — dropdown display values (cells G35, `PART4_Sub_Category`)

These are the exact strings the utility shows in the Sub-category dropdown:
```
(Select)
10(30)-subsidy received from or through the Tea Board
10(31)-Subsidy received for Rubber/Coffee/Tea  replantation, replacement, rejuvenation etc.
10(17A)-Award instituted by Government
10(15)-Interest on specified securities/investments
10(23FBB)-income referred to in section 115UB, accruing or arising to, or received by, a unit holder of an investment fund
10(23FD)Unit holder income from Business Trust (certain parts)
10(35)-Income from specified Mutual Funds
10(23FBC) Any income from a unit holder from a specified fund or on transfer of units in a specified fund
10(33) Income from transfer of capital asset being a unit of the Unit Scheme, 1964
10(4C)-Interest on Rupee denominated bonds (specific window)
10(4E)-Non-deliverable forwards/ODI/OTC with IFSC OBU
10(36)-LTCG on certain listed shares (public issue)
10(23AA)-Sum received by any person on behalf of any Fund established by the armed forces
10(10D)-Any sum received under a life insurance policy, including the sum allocated by way of bonus on such policy except sum as mentioned in sub-clause (a) to (d) of Sec.10(10D)
10(8A)-Remuneration or any other income of Consultant
10(4)(i)-Interest on specified bonds
10(4F)-Royalty/interest on lease of aircraft/ship by IFSC unit
10(4G)-Portfolio income managed in IFSC OBU accruing outside India
10(6B)-Tax paid under Govt/international agreements (non-salary)
10(6D)-Royalty/FTS to non-resident for services to NTRO
10(4H)-Income from business of leasing of an aircraft
10(2A)-Partner’s share in firm/LLP
10(6BB)-Tax paid on consideration for aircraft/engine leases (approved by CG)
10(23FF)-Capital Gains on transfer of shares from wholly owned special purpose vehicle to the resultant fund in relocation
10(15A)-Lease payments for foreign aircraft
10(4D)-Income of specified fund (IFSC) on certain transfers/securities
10(34B)-Income of a Unit of any International Financial Services Centre, primarily engaged in the business of leasing of an aircraft
10(39)Specified income from international sports events
10(40)-Income of specified subsidiary companies by way of grant or otherwise received from indian holding company
10(21)-Income of approved research associations
10(22B)-Income of specified news agencies
10(23A)-Income of professional regulatory bodies
10(23AAA)-Income of approved employee welfare funds
10(23AAB)-Income of approved pension funds
10(23B)-Income of approved khadi institutions
10(23BBA)-Religious and charitable trust board income
10(23BBB)-Income of European Economic Community
10(23BBC)-Any income of the SAARC Fund for Regional Projects set up by Colombo Declaration
10(23BBE)-Income of the Insurance Regulatory and Development Authority
10(23BBG)-Income of Central Electricity Regulatory Commission
10(23C)-Income of specified funds/educational/medical/charitable institutions
10(23D)-Income of specified Mutual Funds
10(23EA)-Contributions received from recognised stock exchanges
10(23EC)-Income of specific Investor protection fund
10(23ED)-Income of a business trust's unit holder under specific circumstances
10(23EE)-Specified income of Core settlement guarantee fund
10(23F)-Dividends or long-term capital gains of a venture capital fund or a venture capital company from investments made by way of equity shares in a venture capital undertaking
10(23FA)-Dividends, other than dividends referred to in section 115-O, or long-term capital gains of a venture capital fund or a venture capital company from investments made by way of equity shares in a venture capital undertaking
10(23FB)-Income of Venture Capital Company/Fund from investment in Venture Capital undertaking
10(23FBA)-Any income of an  Investment Fund
10(23FE)-Specified sovereign wealth/pension funds—income from infrastructure investments
10(26B)-Income promoting the interest of the SC/ST
10(26BB)-Income promoting interest of the Minority Community
10(26BBB)-Income of ex‑servicemen welfare corporations
10(29A)-Income accruing or arising to specific commodity boards
10(42)-Specified income of treaty‑based international bodies
10(46B)-Specific tax exemption for NCGTC
10(48D)-Income of infrastructure financing institutions
10(48E)-Income of RBI‑licensed development finance institutions
10(6A)-Tax on income of foreign company by way of royalty or fees for technical services received from Government or an Indian concern under older approved agreements
10(6C)-Income to notified foreign company by way of royalty or fees for technical services in projects connected with security of India
10(15B)-Income of Foreign Company from lease rentals of cruise ships, received from a specified company which operates such ship or ships in India and are subsidiaries of the same holding company
10(48)-Income received in India in Indian currency by a foreign company on account of sale of crude oil, any other goods or rendering of services
10(48A)- Income accruing or arising to a foreign company on account of storage of crude oil in India and sale of crude oil to a person resident in India
10(48B)- Any income accruing or arising to a foreign company on account of sale of leftover stock of crude oil
10(48C)- Any income accruing or arising to the Indian Strategic Petroleum Reserves Limited, being a wholly owned subsidiary of the Oil Industry Development Board under the Ministry of Petroleum and Natural Gas
Income exempt as per CBDT Circular
Receipts not in the nature of income
Income exempt as per CBDT Notification
```
The schema's `SubCategory` enum carries the coded serials
(`10(30)`, `10(31)`, `10(17A)`, `10(15)`, `10(23FBB)`, `10(23FD)`, `10(35)`,
`10(23FBC)`, `10(33)`, `10(4C)`, `10(4E)`, `10(36)`, `10(23AA)`, `10(10D)`,
`10(8A)`, `10(4)(i)`, `10(4F)`, `10(4G)`, `10(6B)`, `10(6D)`, `10(4H)`,
`10(2A)`, `10(6BB)`, `10(23FF)`, `10(15A)`, `10(4D)`, `10(34B)`, `10(39)`,
`10(40)`, `10(21)`, `10(22B)`, `10(23A)`, `10(23AAA)`, `10(23AAB)`, `10(23B)`,
`10(23BBA)`, `10(23BBB)`, `10(23BBC)`, `10(23BBE)`, `10(23BBG)`, `10(23C)`,
`10(23D)`, `10(23EA)`, `10(23EC)`, `10(23ED)`, `10(23EE)`, `10(23F)`,
`10(23FA)`, `10(23FB)`, `10(23FBA)`, `10(23FE)`, `10(26B)`, `10(26BB)`,
`10(26BBB)`, `10(29A)`, `10(42)`, `10(46B)`, `10(48D)`, `10(48E)`, `10(6A)`,
`10(6C)`, `10(15B)`, `10(48)`, `10(48A)`, `10(48B)`, `10(48C)`,
`Incmexmptcircular`, `Incmexmptnotification`, `Receiptnotincme`, `Anyother1`,
`Anyother2`, `Anyother3`, `Anyother4`); the build filters the list by the chosen
Category exactly as the utility's dependent dropdown does.

### The rules on Sl. No. 3

- **A650** — the total must equal the sum of the individual amount columns.
- **A659** — selection of Category and sub-category is mandatory where the amount is more than zero.
- **A658** — Description is mandatory where amount > 0 and the sub-category is *"Income exempt as per CBDT Circular"*, *"Income exempt as per CBDT Notification"*, or *"Receipts not in the nature of Income"*.
- **A660** — where amount > 0 under any sub-category other than those three, a Description must not be the only entry (the coded section governs).
- **A652** — if the amount for section 10(23FF) is more than zero, Form 10-II must be filed.
- **A653** — if the amount for section 10(4D) is more than zero, Form 10-IG or Form 10-IK must be filed.
- **A656** — exempt income u/s 10(4)(i), 10(4E), 10(4F), 10(4G), 10(6BB), 10(8A) and 10(15A) cannot be reported by Residents.
- **A657 / A658** — exempt income u/s 10(4C), 10(6A), 10(6B), 10(6C), 10(6D), 10(15B), 10(48), 10(48A) and 10(48B) cannot be reported by a Domestic company.
- **A655 (tail)** — any sub-category at Sl. No. 3 cannot be selected more than once.

---

## 4 · Sl. No. 4 — Income claimed as not chargeable to tax as per DTAA (rows 49–56)

Row 49 label (verbatim): *"Income claimed as not chargeable to tax as per DTAA
(Applicable for Non-residents only)"*. A table, unlimited rows. Schema:
`IncNotChrgblAsPerDTAA.IncNotChrgblAsPerDTAADtls[]`.

| Col (row 50, verbatim) | Type / enum | Schema key |
|---|---|---|
| Sl.No. | row index | — |
| Amount of Income | integer ≥0, **required** | `AmountOfIncome` |
| Nature of Income | free text (max 75) | `NatureOfIncome` |
| Country name & code | text (max 55) + coded country | `CountryName` + `CountryCodeExcludingIndia` |
| Article of DTAA | text (max 16) | `ArticleOfDTAA` |
| Head of Income | dropdown → `HeadOfIncome` enum **HP / BP / CG / OS**, **required** | `HeadOfIncome` |
| Whether TRC obtained | dropdown → `TRCFlag` enum **Y / N** | `TRCFlag` |
| Total (row 56) | computed — cell J56 `= MAX(0, SUM(Amount of Income))`; rule **A651** | `IncChrgblAsPerDTAA` (**required**) |

Note the required total's schema key is **`IncChrgblAsPerDTAA`** (the wrapper
object is `IncNotChrgblAsPerDTAA`); rule **A651** ties it to the sum of the
"Amount of Income" column.

Head-of-income dropdown (cells J51:J54) display values:
```
(Select)
House Property
Business and Profession
Capital Gain
Income from Other sources
```
Head codes stored: **HP** (House Property), **BP** (Business and Profession),
**CG** (Capital Gain), **OS** (Income from Other sources). Note ITR-6's head
list carries **BP** where ITR-2 carried **SA (Salary)** — a company has no
salary head.

TRC dropdown (cells K51:K54) display values:
```
(Select)
Yes
No
```
stored as `TRCFlag` **Y / N**.

Country dropdown (cells H51:H54, named range `Country_Less_India`) — the code
list with **India excluded**. Display values verbatim:
```
(select)
93-AFGHANISTAN
1001-ALAND ISLANDS
355-ALBANIA
213-ALGERIA
684-AMERICAN SAMOA
376-ANDORRA
244-ANGOLA
1264-ANGUILLA
1010-ANTARCTICA
1268-ANTIGUA AND BARBUDA
54-ARGENTINA
374-ARMENIA
297-ARUBA
61-AUSTRALIA
43-AUSTRIA
994-AZERBAIJAN
1242-BAHAMAS
973-BAHRAIN
880-BANGLADESH
1246-BARBADOS
375-BELARUS
32-BELGIUM
501-BELIZE
229-BENIN
1441-BERMUDA
975-BHUTAN
591-BOLIVIA (PLURINATIONAL STATE OF)
1002-BONAIRE, SINT EUSTATIUS AND SABA
387-BOSNIA AND HERZEGOVINA
267-BOTSWANA
1003-BOUVET ISLAND
55-BRAZIL
1014-BRITISH INDIAN OCEAN TERRITORY
673-BRUNEI DARUSSALAM
359-BULGARIA
226-BURKINA FASO
257-BURUNDI
238-CABO VERDE
855-CAMBODIA
237-CAMEROON
1-CANADA
1345-CAYMAN ISLANDS
236-CENTRAL AFRICAN REPUBLIC
235-CHAD
56-CHILE
86-CHINA
9-CHRISTMAS ISLAND
672-COCOS (KEELING) ISLANDS
57-COLOMBIA
270-COMOROS
242-CONGO
243-CONGO (DEMOCRATIC REPUBLIC OF THE)
682-COOK ISLANDS
506-COSTA RICA
225-COTE DIVOIRE
385-CROATIA
53-CUBA
1015-CURACAO
357-CYPRUS
420-CZECHIA
45-DENMARK
253-DJIBOUTI
1767-DOMINICA
1809-DOMINICAN REPUBLIC
593-ECUADOR
20-EGYPT
503-EL SALVADOR
240-EQUATORIAL GUINEA
291-ERITREA
372-ESTONIA
251-ETHIOPIA
500-FALKLAND ISLANDS (MALVINAS)
298-FAROE ISLANDS
679-FIJI
358-FINLAND
33-FRANCE
594-FRENCH GUIANA
689-FRENCH POLYNESIA
1004-FRENCH SOUTHERN TERRITORIES
241-GABON
220-GAMBIA
995-GEORGIA
49-GERMANY
233-GHANA
350-GIBRALTAR
30-GREECE
299-GREENLAND
1473-GRENADA
590-GUADELOUPE
1671-GUAM
502-GUATEMALA
1481-GUERNSEY
224-GUINEA
245-GUINEA-BISSAU
592-GUYANA
509-HAITI
1005-HEARD ISLAND AND MCDONALD ISLANDS
6-HOLY SEE
504-HONDURAS
852-HONG KONG
36-HUNGARY
354-ICELAND
62-INDONESIA
98-IRAN (ISLAMIC REPUBLIC OF)
964-IRAQ
353-IRELAND
1624-ISLE OF MAN
972-ISRAEL
5-ITALY
1876-JAMAICA
81-JAPAN
1534-JERSEY
962-JORDAN
7-KAZAKHSTAN
254-KENYA
686-KIRIBATI
850-KOREA (DEMOCRATIC PEOPLES REPUBLIC OF)
82-KOREA (REPUBLIC OF)
965-KUWAIT
996-KYRGYZSTAN
856-LAO PEOPLES DEMOCRATIC REPUBLIC
371-LATVIA
961-LEBANON
266-LESOTHO
231-LIBERIA
218-LIBYA
423-LIECHTENSTEIN
370-LITHUANIA
352-LUXEMBOURG
853-MACAO
389-MACEDONIA (THE FORMER YUGOSLAV REPUBLIC OF)
261-MADAGASCAR
265-MALAWI
60-MALAYSIA
960-MALDIVES
223-MALI
356-MALTA
692-MARSHALL ISLANDS
596-MARTINIQUE
222-MAURITANIA
230-MAURITIUS
269-MAYOTTE
52-MEXICO
691-MICRONESIA (FEDERATED STATES OF)
373-MOLDOVA (REPUBLIC OF)
377-MONACO
976-MONGOLIA
382-MONTENEGRO
1664-MONTSERRAT
212-MOROCCO
258-MOZAMBIQUE
95-MYANMAR
264-NAMIBIA
674-NAURU
977-NEPAL
31-NETHERLANDS
687-NEW CALEDONIA
64-NEW ZEALAND
505-NICARAGUA
227-NIGER
234-NIGERIA
683-NIUE
15-NORFOLK ISLAND
1670-NORTHERN MARIANA ISLANDS
47-NORWAY
968-OMAN
92-PAKISTAN
680-PALAU
970-PALESTINE, STATE OF
507-PANAMA
675-PAPUA NEW GUINEA
595-PARAGUAY
51-PERU
63-PHILIPPINES
1011-PITCAIRN
48-POLAND
14-PORTUGAL
1787-PUERTO RICO
974-QATAR
262-REUNION
40-ROMANIA
8-RUSSIAN FEDERATION
250-RWANDA
1006-SAINT BARTHELEMY
290-SAINT HELENA, ASCENSION AND TRISTAN DA CUNHA
1869-SAINT KITTS AND NEVIS
1758-SAINT LUCIA
1007-SAINT MARTIN (FRENCH PART)
508-SAINT PIERRE AND MIQUELON
1784-SAINT VINCENT AND THE GRENADINES
685-SAMOA
378-SAN MARINO
239-SAO TOME AND PRINCIPE
966-SAUDI ARABIA
221-SENEGAL
381-SERBIA
248-SEYCHELLES
232-SIERRA LEONE
65-SINGAPORE
1721-SINT MAARTEN (DUTCH PART)
421-SLOVAKIA
386-SLOVENIA
677-SOLOMON ISLANDS
252-SOMALIA
28-SOUTH AFRICA
1008-SOUTH GEORGIA AND THE SOUTH SANDWICH ISLANDS
211-SOUTH SUDAN
35-SPAIN
94-SRI LANKA
249-SUDAN
597-SURINAME
1012-SVALBARD AND JAN MAYEN
268-SWAZILAND
46-SWEDEN
41-SWITZERLAND
963-SYRIAN ARAB REPUBLIC
886-TAIWAN
992-TAJIKISTAN
255-TANZANIA, UNITED REPUBLIC OF
66-THAILAND
670-TIMOR-LESTE(EAST TIMOR)
228-TOGO
690-TOKELAU
676-TONGA
1868-TRINIDAD AND TOBAGO
216-TUNISIA
90-TURKEY
993-TURKMENISTAN
1649-TURKS AND CAICOS ISLANDS
688-TUVALU
256-UGANDA
380-UKRAINE
971-UNITED ARAB EMIRATES
44-UNITED KINGDOM OF GREAT BRITAIN AND NORTHERN IRELAND
2-UNITED STATES OF AMERICA
1009-UNITED STATES MINOR OUTLYING ISLANDS
598-URUGUAY
998-UZBEKISTAN
678-VANUATU
58-VENEZUELA (BOLIVARIAN REPUBLIC OF)
84-VIET NAM
1284-VIRGIN ISLANDS (BRITISH)
1340-VIRGIN ISLANDS (U.S.)
681-WALLIS AND FUTUNA
1013-WESTERN SAHARA
967-YEMEN
260-ZAMBIA
263-ZIMBABWE
9999-OTHERS
```
The schema stores the numeric code in `CountryCodeExcludingIndia` (enum of 249
codes, India excluded).

This is the *not chargeable at all* case. The *chargeable at a special treaty
rate* case lives in Schedule OS / Schedule CG and Schedule SI — not here.

---

## 5 · Sl. No. 5 — Pass through income claimed as not chargeable (row 57)

Row 57 label (verbatim): *"Pass through income claimed as not chargeable to tax
(Schedule PTI)"*. One figure — `PassThrIncNotChrgblTax` — the exempt line from
Schedule PTI. Rule **A646**: Sl. No. 5 must equal the exempt income in
Schedule PTI.

---

## 6 · Sl. No. 6 — Total (row 58)

Row 58 label (verbatim): *"Total (1 + 2v + 3+ 4 + 5 )"*. Computed —
`TotalExemptInc` (**required**), cell J58. Rule **A647**: Sl. No. 6 = 1 + 2(v)
+ 3 + 4 + 5. Feeds the exempt-income line of Part B-TI.

---

## 7 · Hidden rows — read, not built (rule: never build a hidden row)

| Row | Label | Why excluded |
|---|---|---|
| 5 | Dividend Income | hidden — dividend is taxable now; no schema key |
| 11 | Net Agriculture income (other than income to be excluded under rule 7, 7A, 7B or 8) | hidden — internal working line |
| 12 | Share in the total income of firm/AOP etc. in which partner (Mention PAN of the firm/AOP and amount) | hidden — partner's share is reported in Schedule IF, not in EI |
| 13 | PAN | hidden — belongs to the hidden firm/AOP line |
| 15 | Total (of the hidden firm/AOP block) | hidden |
| 33 | a  Income u/s….. (the sub-label) | hidden label; the table itself (rows 34–39) is live |
| 40–48 | b  Any other Income (Specify nature) — Nature of Income, Amount, Dividend Income, Share of profit from Firm, Total | hidden — this sub-table is not on this filing; no schema key |

None of these carry a schema key that this filing writes, so each is logged as
excluded, not built.

---

## 8 · What is mandatory (schema `required`)

`NetAgriIncOrOthrIncRule7` (2v), `Others` (3-total), `IncChrgblAsPerDTAA`
(4-total) and `TotalExemptInc` (6-total) — the four computed totals, present
even at zero whenever the schedule is written. On every row of the three
tables, the columns marked required above (`NameOfDistrict`, `PinCode`,
`MeasurementOfLand`, `AgriLandOwnedFlag`, `AgriLandIrrigatedFlag`; `OthAmount`;
`AmountOfIncome`, `CountryName`, `CountryCodeExcludingIndia`, `HeadOfIncome`).

## 9 · What repeats

The land table (only when Sl. No. 2v exceeds Rs.5 lakh), the other-exempt table
(each sub-category once — rule A655 tail), and the DTAA table — all unlimited.

## 10 · Cross-sheet feeds

| Direction | Line | Other sheet |
|---|---|---|
| **in** | 2(iv) `NetAgriIncRelateToRule7` ← | Schedule BP Sl. No. 40 (cell `H9 = BP.40`; rule A649) |
| **out** | 2(v) `NetAgriIncOrOthrIncRule7` → | Part B-TI Sl. No. 16 (rate purpose; rule A739) |
| **in** | 5 `PassThrIncNotChrgblTax` ← | Schedule PTI exempt income (rule A646) |
| **out** | 6 `TotalExemptInc` → | Part B-TI exempt-income line |
| **cross-check** | 3 total of exempt income | Schedule BP Sl. No. 8b / Column amount (rules A227, A232) |

---

## 11 · What ITR-6's EI has that ITR-2's does not

| | ITR-2 | ITR-6 |
|---|---|---|
| Sl. No. 2(iv) Rule 7/7A/7B/8 portion | hidden (business) | **live**, fed from Schedule BP Sl. No. 40 |
| Net agri formula (2v) | i − ii − iii | **i − ii − iii + iv** |
| Category enum | 9 codes (incl. SRSC, SRST) | **10 codes** (ICSB, IOI, EIFE; no SRSC/SRST) |
| Sub-category enum | 52 codes | **73 codes** |
| DTAA Head of Income | SA · HP · CG · OS | **HP · BP · CG · OS** (BP replaces Salary) |
| DTAA-total schema key | `IncNotChrgblToTax` | **`IncChrgblAsPerDTAA`** |
| Other-exempt array / amount key | `Others[]` / `Amount` | **`OthersInc.OthersIncDtls[]` / `OthAmount`** |

## 12 · What this means for the build

1. **Sl. No. 2 is a working of five inputs** — with 2(iv) fed from Schedule BP
   Sl. No. 40, and 2(v) computed as `MAX(0, i − ii − iii + iv)`; the land table
   appears only above Rs.5 lakh with its two dropdowns.
2. **Sl. No. 3 is the two-dropdown table** — Category first, Sub-category
   filtered from it; the per-sub-category form triggers (A652/A653) and the
   resident / domestic-company bars (A656/A657) are checks, not fields.
3. **Sl. No. 4 is the DTAA table**, non-residents only, India-excluded country
   list, Head enum HP/BP/CG/OS; the required total exports as
   `IncChrgblAsPerDTAA`.
4. **Sl. No. 5 reads Schedule PTI**; **Sl. No. 6** is the guarded total.
5. **Export** — `ScheduleEI` with the four required totals present even at zero,
   and each table block written only when it has rows.

---

## 13 · Sources — agreement and notes

- **Utility**, schema block `ScheduleEI`, and rules A646–A660 / A739 agree on
  the six Sl. Nos. and the 2(v) = i − ii − iii + iv formula.
- The category dropdown's source lists (`PART4_Nature_TP*`) are dependent named
  ranges the dump tool cannot resolve to values; the ten Category codes are
  taken from the schema enum. This is a tooling limit, not a source conflict.
- The utility total (J58) also sums `DividendInc` and `Others3a`, which are
  hidden-row / internal named ranges with no filed schema key; the filed total
  `TotalExemptInc` follows rule A647 (1 + 2v + 3 + 4 + 5).
