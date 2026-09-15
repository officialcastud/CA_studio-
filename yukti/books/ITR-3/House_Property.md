# The book of Schedule HP — Income from House Property · ITR-3, A.Y. 2026-27

Read row by row from the ITR-3 utility's **House Property** sheet (269 rows,
46 with content, 114 hidden spare rows), its formulas, its dropdowns and the
VBA validators, and confirmed against the CBDT ITR-3 schema block **ScheduleHP**
and the numbering in `books/ITR-3/rules.json`. Nothing here is invented; every
figure and rule is quoted from ITR-3's own sources. The ITR-2 book of the same
sheet was read for **style only**.

---

## The shape

Schedule HP is a **repeating property block** followed by two whole-head lines.
The sheet ships **two** property blocks (rows 4–38 and rows 39–73); the VBA's
`AddProperty` / `HousePropertySectionCount` loop unhides further blocks on
demand and the schema's `PropertyDetails` array has **no maximum**. Each block
carries the address, ownership, co-owner table, house-property type, tenant
table, the rent working **a–k**, and — inside the block — the **Section 24(b)**
loan table that feeds item **h**. After the last block come item **2** (pass
through income/loss) and item **3**, the income under the head. There is no
separate 24(b) schedule and no HRA working here.

---

## The items

### Block 1 — property block (rows 4–38; block 2 repeats it at rows 39–73)

| Sheet ref | Field label | Type | Schema key | Rule / notes |
|---|---|---|---|---|
| C3/F3 | **Details of Income from House Property** (Fields marked in RED must not be left Blank) | header | — | section banner |
| — | (property serial) | computed | `PropertyDetails[].HPSNo` | required; auto serial |
| F4 | **Address Of Property** (Note : Do not leave address blank) | text, max 200 | `AddressDetailWithZipCode.AddrDetail` | required |
| G4 | **Town/ City** | text, max 50 | `AddressDetailWithZipCode.CityOrTownOrDistrict` | required |
| H4/H5 | **State** | dropdown (38 codes) | `AddressDetailWithZipCode.StateCode` | required |
| I4/I5 | **Country** | dropdown (250 codes) | `AddressDetailWithZipCode.CountryCode` | required, max 4 |
| J4 | **PIN Code** | integer 100000–999999 | `AddressDetailWithZipCode.PinCode` | for India |
| K4 | **Zip Code** | text, max 8 | `AddressDetailWithZipCode.ZipCode` | for property abroad |
| F6 | **Owner of the Property** (Please specify if others is selected) | dropdown | `PropertyOwner` | required — SE/MI/SP/OT |
| F6 (Others) | *specify if Others* | text, max 50 | `PropertyOwnerOther` | opens on OT |
| I6 | **Is the property co-owned?** | dropdown Yes/No | `PropCoOwnedFlg` | required — YES/NO |
| K6 | **Your percentage of share in the property.%** | number 0–100 | `AsseseeShareProperty` | 100 if not co-owned; must NOT be 100 if co-owned |
| F7 | S.No (co-owner) | computed | `CoOwners[].CoOwnersSNo` | required in row |
| G7 | **Name of co owner(s)** | text, max 125 | `CoOwners[].NameCoOwner` | required in row |
| H7 | **PAN of Co-owner(s)** | text, max 10 | `CoOwners[].PAN_CoOwner` | 5 alpha+4 digit+1 alpha; cannot equal assessee PAN |
| I7 | **Aadhaar Number of the Co-owner(s)** | 12 digits | `CoOwners[].Aadhaar_CoOwner` | |
| J7 | **Percentage share of other co-owner(s) in property%** | number 0–100 | `CoOwners[].PercentShareProperty` | owner + co-owners must total 100 |
| F15/H15 | **Type Of House Property?** | dropdown | `ifLetOut` | required — L/D/S |
| F16/G16 | **Name(s) of Tenant (s) (if let out)** | text, max 125 | `TenantDetails[].NameofTenant` | required in row (S.No = `TenantDetails[].TenantSNo`) |
| H16 | **PAN of Tenant(s) (if available)** | text | `TenantDetails[].PANofTenant` | |
| I16 | **Aadhaar Number of Tenant (s)** | text | `TenantDetails[].AadhaarofTenant` | |
| J16 | **PAN / TAN of Tenant(s) (if TDS credit is claimed)** | text | `TenantDetails[].PANTANofTenant` | needed to match Schedule TDS |
| **1a** | **Gross Rent received or receivable or letable value** | amount | `Rentdetails.AnnualLetableValue` | required; nil for self-occupied; >0 if let out / deemed let out |
| **1b** | **The amount of rent which cannot be realized** | amount | `Rentdetails.RentNotRealized` | |
| **1c** | **Tax paid to local authorities** | amount | `Rentdetails.LocalTaxes` | not allowed if 1a is zero/null |
| **1d** | **Total (b + c)** | computed | `Rentdetails.TotalUnrealizedAndTax` | =1b+1c |
| **1e** | **Annual value (a – d) (nil, if self -occupied etc. as per section 23(2) of the Act)** | computed | `Rentdetails.BalanceALV` | =MAX(0, 1a−1d) |
| **1f** | **Annual value of the property owned (own percentage share x e)** | computed | `Rentdetails.AnnualOfPropOwned` | =share% × 1e |
| **1g** | **30% of f** | computed | `Rentdetails.ThirtyPercentOfBalance` | standard deduction |
| **1h** | **Interest payable on borrowed capital** — *Cannot exceed 2 lacs if not let out* | computed | `Rentdetails.IntOnBorwCap` | = total of the 24(b) table |
| **1i** | **Total (g + h)** | computed | `Rentdetails.TotalDeduct` | =1g+1h |
| **1j** | **Arrears/Unrealized Rent received during the year Less 30%** | amount | `Rentdetails.ArrearsUnrealizedRentRcvd` | 70% taken |
| **1k** | **Income from house property (f – i + j)** *(fill up details separately for each property)* | computed | `Rentdetails.IncomeOfHP` | =1f−1i+1j |
| **2** | **Pass through income/Loss if any \*** | amount | `PassThroghIncome` | from Schedule PTI |
| **3** | **Income under the head "Income from house property" (∑1k + 2)** (if negative take the figure to 2i of Schedule CYLA) | computed | `TotalIncomeChargeableUnHP` | the only key required on the schedule |

### Section 24(b) — Interest on borrowed capital (loan table inside each block; rows 28–35, block 2 at 63–70)

One table per property, 4 rows shipped (`i`–`vii` columns), unlimited via VBA.
The schema array is `Rentdetails.Section24B.Section24BDtls`; every column is
required on every row.

| Column (i–vii) | Field label | Type | Schema key |
|---|---|---|---|
| Sl. No. | serial | computed | (row index) |
| i / **Loan taken from** | dropdown Bank / Other than Bank | string | `Section24BDtls[].LoanTknFrom` |
| ii / **Name of the bank / Institution / Person from which the loan is taken** | text | string | `Section24BDtls[].BankOrInstnName` |
| iii / **Loan Account number of the Bank/ Institution** | text | string | `Section24BDtls[].LoanAccNoOfBankOrInstnRefNo` |
| iv / **Date of sanction of loan** | DD/MM/YYYY | string | `Section24BDtls[].DateofLoan` |
| v / **Total amount of loan** | amount | integer | `Section24BDtls[].TotalLoanAmt` |
| vi / **Loan outstanding as on last date of financial year** | amount | integer | `Section24BDtls[].LoanOutstndngAmt` |
| vii / **Interest on Borrowed capital u/s 24(b)** | amount | integer | `Section24BDtls[].InterestUs24B` |
| — | **Total Interest on borrowed capital u/s 24(b)** | computed | `Section24B.TotalInterestUs24B` |

---

## The rules the sheet computes

- **[I23] `= SUM(I21:I22)`** — item **1d** Total = 1b + 1c (block 2: **[I58] `= SUM(I56:I57)`**).
- **[K24] `= MAX(0,(K20-I23))`** — item **1e** Annual value = MAX(0, 1a − 1d); floored at zero (block 2: **[K59] `= MAX(0,(K55-I58))`**).
- **[K25] `= MAX(0,ROUND(((K7/100)*K24),0))`** — item **1f** = your share% × 1e; this is where co-ownership share bites (block 2: **[K60] `= MAX(0,ROUND(((K42/100)*K59),0))`**).
- **[I26] `= ROUND(IF(((30/100)*K25) < 0,0,(30/100*K25)),0)`** — item **1g** = 30% of 1f (block 2: **[I61]**).
- **[K35] `= SUM(Intrst.24b1)`** — Total interest u/s 24(b) = sum of the loan rows; feeds item **1h** (block 2: **[K70] `= SUM(K66:K67:K68:K69)`**).
- **[K36] `= SUM(I26,I27)`** — item **1i** Total = 1g + 1h (block 2: **[K71] `= SUM(I61,I62)`**).
- **[K38] `= (K25-K36+K37)`** — item **1k** Income from house property = 1f − 1i + 1j (block 2: **[K73] `= (K60-K71+K72)`**).
- **[N74] `= IF(bacValue=1,0,MAX(HP.TotalIncomeChargeableUnHP,-200000))`** — the set-off cap: an HP loss set off against other heads is capped at ₹2,00,000, and is **nil under the new regime** (`bacValue=1`).
- **[N75] `= MAX(0,(-HP.TotalIncomeChargeableUnHP-200000))`** — the HP loss remaining after the ₹2,00,000 set-off, carried forward to Schedule CFL.
- **[H27]/[H62]** carry the on-line note *"Cannot exceed 2 lacs if not let out"* — self-occupied interest ceiling of ₹2,00,000 (rules.json: self-occupied max interest ₹2,00,000).
- **[F9]/[F18]/[F19]/[F44]/[F53]/[F54] `= Fn+1`**, **[D32]/[D33]/[D67]/[D68] `= Dn+1`** — helper serial counters (not items).
- **[C31]/[C32]/[C66]/[C67] `= TRIM(F..)&"_"&TRIM(G..)&…`** — helper combination keys for the 24(b) rows (not items).

**Cross-schedule rules (from rules.json):**
- Schedule HP Sl.No. 3 = 1k + 2 (deduction of interest available only under Old regime).
- CYLA HP income = Sl.No. 3 of Schedule HP; under New regime an HP loss cannot be set off (2ii–2xii) or carried forward (2xvii); max HP loss set-off is ₹2,00,000.
- CFL House Property loss = loss remaining after set-off at CYLA.
- Standard deduction must equal 30% of annual value.
- If co-owned, assessee + co-owner shares must total 100%; sum of other co-owners' share must be less than 100%; assessee cannot claim interest if his share of a co-owned property is zero.
- Interest on borrowed capital = Total Interest u/s 24(b); details of loan mandatory to claim; deduction u/s 80EE/80EEA loans must also appear in Table 24(b).

---

## Dropdowns

- **Owner of the Property** (`H7 K6 H42 K41`, list `HP.OwnerPropertyDropdown`): (Select) · Self · Minor · Spouse · Others — schema codes **SE / MI / SP / OT**.
- **Is the property co-owned?** (`J6 J41`): (Select) · Yes · No — schema **YES / NO**.
- **Type Of House Property?** (`H15 H50`): (Select) · Self Occupied ·  Let Out ·  Deemed Let Out — schema codes **S / L / D**.
- **Loan taken from** (`E31:E34 E66:E69`): (Select) · Bank ·  Other than Bank — schema **B / I**.
- **State** (`H5 H40`, 38 codes + Foreign): 01-ANDAMAN AND NICOBAR ISLANDS · 02-ANDHRA PRADESH · 03-ARUNACHAL PRADESH · 04-ASSAM · 05-BIHAR · 06-CHANDIGARH · 07-Dadra Nagar and Haveli · 08-Daman and Diu · 09-DELHI · 10-GOA · 11-GUJARAT · 12-HARYANA · 13-HIMACHAL PRADESH · 14-JAMMU AND KASHMIR · 15-KARNATAKA · 16-KERALA · 17-LAKHSWADEEP · 18-MADHYA PRADESH · 19-MAHARASHTRA · 20-MANIPUR · 21-MEGHALAYA · 22-MIZORAM · 23-NAGALAND · 24-ODISHA · 25-PUDUCHERRY · 26-PUNJAB · 27-RAJASTHAN · 28-SIKKIM · 29-TAMIL NADU · 30-TRIPURA · 31-UTTAR PRADESH · 32-WEST BENGAL · 33-CHHATTISGARH · 34-UTTARAKHAND · 35-JHARKHAND · 36-TELANGANA · 37-LADAKH · 99-Foreign
- **Country** (`I5 I40`, 250 codes): (Select), 93-AFGHANISTAN, 1001-ALAND ISLANDS, 355-ALBANIA, 213-ALGERIA, 684-AMERICAN SAMOA, 376-ANDORRA, 244-ANGOLA, 1264-ANGUILLA, 1010-ANTARCTICA, 1268-ANTIGUA AND BARBUDA, 54-ARGENTINA, 374-ARMENIA, 297-ARUBA, 61-AUSTRALIA, 43-AUSTRIA, 994-AZERBAIJAN, 1242-BAHAMAS, 973-BAHRAIN, 880-BANGLADESH, 1246-BARBADOS, 375-BELARUS, 32-BELGIUM, 501-BELIZE, 229-BENIN, 1441-BERMUDA, 975-BHUTAN, 591-BOLIVIA (PLURINATIONAL STATE OF), 1002-BONAIRE, SINT EUSTATIUS AND SABA, 387-BOSNIA AND HERZEGOVINA, 267-BOTSWANA, 1003-BOUVET ISLAND, 55-BRAZIL, 1014-BRITISH INDIAN OCEAN TERRITORY, 673-BRUNEI DARUSSALAM, 359-BULGARIA, 226-BURKINA FASO, 257-BURUNDI, 238-CABO VERDE, 855-CAMBODIA, 237-CAMEROON, 1-CANADA, 1345-CAYMAN ISLANDS, 236-CENTRAL AFRICAN REPUBLIC, 235-CHAD, 56-CHILE, 86-CHINA, 9-CHRISTMAS ISLAND, 672-COCOS (KEELING) ISLANDS, 57-COLOMBIA, 270-COMOROS, 242-CONGO, 243-CONGO (DEMOCRATIC REPUBLIC OF THE), 682-COOK ISLANDS, 506-COSTA RICA, 225-COTE DIVOIRE, 385-CROATIA, 53-CUBA, 1015-CURACAO, 357-CYPRUS, 420-CZECHIA, 45-DENMARK, 253-DJIBOUTI, 1767-DOMINICA, 1809-DOMINICAN REPUBLIC, 593-ECUADOR, 20-EGYPT, 503-EL SALVADOR, 240-EQUATORIAL GUINEA, 291-ERITREA, 372-ESTONIA, 251-ETHIOPIA, 500-FALKLAND ISLANDS (MALVINAS), 298-FAROE ISLANDS, 679-FIJI, 358-FINLAND, 33-FRANCE, 594-FRENCH GUIANA, 689-FRENCH POLYNESIA, 1004-FRENCH SOUTHERN TERRITORIES, 241-GABON, 220-GAMBIA, 995-GEORGIA, 49-GERMANY, 233-GHANA, 350-GIBRALTAR, 30-GREECE, 299-GREENLAND, 1473-GRENADA, 590-GUADELOUPE, 1671-GUAM, 502-GUATEMALA, 1481-GUERNSEY, 224-GUINEA, 245-GUINEA-BISSAU, 592-GUYANA, 509-HAITI, 1005-HEARD ISLAND AND MCDONALD ISLANDS, 6-HOLY SEE, 504-HONDURAS, 852-HONG KONG, 36-HUNGARY, 354-ICELAND, 91-INDIA, 62-INDONESIA, 98-IRAN (ISLAMIC REPUBLIC OF), 964-IRAQ, 353-IRELAND, 1624-ISLE OF MAN, 972-ISRAEL, 5-ITALY, 1876-JAMAICA, 81-JAPAN, 1534-JERSEY, 962-JORDAN, 7-KAZAKHSTAN, 254-KENYA, 686-KIRIBATI, 850-KOREA (DEMOCRATIC PEOPLES REPUBLIC OF), 82-KOREA (REPUBLIC OF), 965-KUWAIT, 996-KYRGYZSTAN, 856-LAO PEOPLES DEMOCRATIC REPUBLIC, 371-LATVIA, 961-LEBANON, 266-LESOTHO, 231-LIBERIA, 218-LIBYA, 423-LIECHTENSTEIN, 370-LITHUANIA, 352-LUXEMBOURG, 853-MACAO, 389-MACEDONIA (THE FORMER YUGOSLAV REPUBLIC OF), 261-MADAGASCAR, 265-MALAWI, 60-MALAYSIA, 960-MALDIVES, 223-MALI, 356-MALTA, 692-MARSHALL ISLANDS, 596-MARTINIQUE, 222-MAURITANIA, 230-MAURITIUS, 269-MAYOTTE, 52-MEXICO, 691-MICRONESIA (FEDERATED STATES OF), 373-MOLDOVA (REPUBLIC OF), 377-MONACO, 976-MONGOLIA, 382-MONTENEGRO, 1664-MONTSERRAT, 212-MOROCCO, 258-MOZAMBIQUE, 95-MYANMAR, 264-NAMIBIA, 674-NAURU, 977-NEPAL, 31-NETHERLANDS, 687-NEW CALEDONIA, 64-NEW ZEALAND, 505-NICARAGUA, 227-NIGER, 234-NIGERIA, 683-NIUE, 15-NORFOLK ISLAND, 1670-NORTHERN MARIANA ISLANDS, 47-NORWAY, 968-OMAN, 92-PAKISTAN, 680-PALAU, 970-PALESTINE, STATE OF, 507-PANAMA, 675-PAPUA NEW GUINEA, 595-PARAGUAY, 51-PERU, 63-PHILIPPINES, 1011-PITCAIRN, 48-POLAND, 14-PORTUGAL, 1787-PUERTO RICO, 974-QATAR, 262-REUNION, 40-ROMANIA, 8-RUSSIAN FEDERATION, 250-RWANDA, 1006-SAINT BARTHELEMY, 290-SAINT HELENA, ASCENSION AND TRISTAN DA CUNHA, 1869-SAINT KITTS AND NEVIS, 1758-SAINT LUCIA, 1007-SAINT MARTIN (FRENCH PART), 508-SAINT PIERRE AND MIQUELON, 1784-SAINT VINCENT AND THE GRENADINES, 685-SAMOA, 378-SAN MARINO, 239-SAO TOME AND PRINCIPE, 966-SAUDI ARABIA, 221-SENEGAL, 381-SERBIA, 248-SEYCHELLES, 232-SIERRA LEONE, 65-SINGAPORE, 1721-SINT MAARTEN (DUTCH PART), 421-SLOVAKIA, 386-SLOVENIA, 677-SOLOMON ISLANDS, 252-SOMALIA, 28-SOUTH AFRICA, 1008-SOUTH GEORGIA AND THE SOUTH SANDWICH ISLANDS, 211-SOUTH SUDAN, 35-SPAIN, 94-SRI LANKA, 249-SUDAN, 597-SURINAME, 1012-SVALBARD AND JAN MAYEN, 268-SWAZILAND, 46-SWEDEN, 41-SWITZERLAND, 963-SYRIAN ARAB REPUBLIC, 886-TAIWAN, 992-TAJIKISTAN, 255-TANZANIA, UNITED REPUBLIC OF, 66-THAILAND, 670-TIMOR-LESTE(EAST TIMOR), 228-TOGO, 690-TOKELAU, 676-TONGA, 1868-TRINIDAD AND TOBAGO, 216-TUNISIA, 90-TURKEY, 993-TURKMENISTAN, 1649-TURKS AND CAICOS ISLANDS, 688-TUVALU, 256-UGANDA, 380-UKRAINE, 971-UNITED ARAB EMIRATES, 44-UNITED KINGDOM OF GREAT BRITAIN AND NORTHERN IRELAND, 2-UNITED STATES OF AMERICA, 1009-UNITED STATES MINOR OUTLYING ISLANDS, 598-URUGUAY, 998-UZBEKISTAN, 678-VANUATU, 58-VENEZUELA (BOLIVARIAN REPUBLIC OF), 84-VIET NAM, 1284-VIRGIN ISLANDS (BRITISH), 1340-VIRGIN ISLANDS (U.S.), 681-WALLIS AND FUTUNA, 967-YEMEN, 263-ZIMBABWE, 260-ZAMBIA, 1013-WESTERN SAHARA, 9999-OTHERS

---

## What repeats and what is one figure

| Where | Repeatable? |
|---|---|
| Property blocks (`PropertyDetails`) | **yes — unlimited** (2 shipped, VBA adds more, schema no maximum) |
| Co-owners inside a block (`CoOwners`) | yes, unlimited (7 rows shipped: rows 8–14 / 43–49) |
| Tenants inside a block (`TenantDetails`) | yes, unlimited (3 rows shipped: rows 17–19 / 52–54) |
| Section 24(b) loans (`Section24BDtls`) | yes, unlimited (4 rows shipped: rows 31–34 / 66–69) |
| Item 2 Pass through income/Loss (`PassThroghIncome`) | one figure |
| Item 3 Income under the head (`TotalIncomeChargeableUnHP`) | one figure |

---

## Mandatory

The schema marks **`TotalIncomeChargeableUnHP`** as the only key required on
`ScheduleHP` itself. Within each `PropertyDetails` item the required keys are:
`HPSNo`, `AddrDetail`, `CityOrTownOrDistrict`, `StateCode`, `CountryCode`,
`PropertyOwner`, `PropCoOwnedFlg`, `ifLetOut`, and in the rent working
`AnnualLetableValue`, `TotalUnrealizedAndTax`, `BalanceALV`, `AnnualOfPropOwned`,
`ThirtyPercentOfBalance`, `IntOnBorwCap`, `TotalDeduct`, `IncomeOfHP`. On every
co-owner row: `CoOwnersSNo`, `NameCoOwner`. On every tenant row: `TenantSNo`,
`NameofTenant`. On every 24(b) loan row all seven are required: `LoanTknFrom`,
`BankOrInstnName`, `LoanAccNoOfBankOrInstnRefNo`, `DateofLoan`, `TotalLoanAmt`,
`LoanOutstndngAmt`, `InterestUs24B`, plus `TotalInterestUs24B` and the array
`Section24BDtls`.

Optional (written only when carrying a value): `PinCode`, `ZipCode`,
`PropertyOwnerOther`, `AsseseeShareProperty`, `PAN_CoOwner`, `Aadhaar_CoOwner`,
`PercentShareProperty`, `PANofTenant`, `AadhaarofTenant`, `PANTANofTenant`,
`RentNotRealized`, `LocalTaxes`, `ArrearsUnrealizedRentRcvd`, `PassThroghIncome`.

---

## Hidden rows — not built

The dump flags **no labelled row as hidden (H)**: every one of the 46 rows with
content is visible. The sheet's 114 hidden rows are **blank spare rows** — the
extra co-owner, tenant and 24(b) loan rows within a block, and the additional
property blocks 3, 4, … that the VBA (`HousePropertySectionCount` /
`AddProperty`) unhides on demand. They carry no labels and no schema keys of
their own; they are the repeat capacity of the arrays above and are built as
"add another" affordances, not as separate items. The helper cells
**`tempPercentagecountValue` [T9]**, the serial counters (`F9`, `D32`, …) and
the combination keys (`C31`, `C32`, `C66`, `C67`) are helper columns, not items.

---

## What this means for the build

1. **One collapsible block per property, unlimited**, each with a dustbin,
   collapsing to a one-line summary (address · type · 1k).
2. **Type (`ifLetOut`) drives the working** — Self Occupied (S) forces 1a nil
   and leaves only interest capped at ₹2,00,000 (nil under the new regime);
   Let Out (L) / Deemed Let Out (D) run the full a–k and require 1a > 0.
3. **The 24(b) loan table lives inside the block**, all seven columns mandatory
   per row, summing into item 1h — no separate schedule.
4. **Co-owner and tenant tables open on their triggers** — co-owner on "Yes",
   tenant on a let-out type; owner + co-owner shares must total 100 and the
   assessee's own share must not be 100 when co-owned.
5. **The share is applied at 1f, not at 1a** — rent, unrealised rent and local
   taxes are entered in full for the property.
6. **The loss goes to CYLA with the ₹2,00,000 cap** (`N74`), the balance to CFL
   (`N75`); under the new regime (`bacValue=1`) it goes nowhere.
7. **A third self-occupied property becomes deemed let out** — no more than two
   houses may be self-occupied (rules.json).
8. **The HRA / 10(13A) working is not part of HP** — it belongs to salary.


## Additional visible rows — verbatim from the sheet (completeness)
Rows present on the utility sheet and captured here verbatim so every visible label is in the book:

- PAN of Co-owner(s)
- tempPercentagecountValue
- Total (b + c)
- Total (g + h)
