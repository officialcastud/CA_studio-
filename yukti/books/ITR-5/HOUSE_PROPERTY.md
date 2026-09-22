# HOUSE_PROPERTY — Schedule HP (ITR-5, A.Y. 2026-27)

Sheet: `HOUSE_PROPERTY`. Section: `hp`. Schema block: **ScheduleHP** (`section_map.json`: `{"section":"hp","blocks":["ScheduleHP"]}`).
Every source line below is quoted from `tools/dump.py` (rows / `--formulas` / `--dropdowns` / `--schema` / `--leaves`) and `books/ITR-5/rules.json`.

## The shape

Schedule HP is a **repeating per-property block**. The schema top is:

```
== ScheduleHP == required: ['TotalIncomeChargeableUnHP']
 PropertyDetails [array]         <- one entry per house property
   ...
 PassThroghIncome [integer]      <- one figure for the whole schedule
 TotalIncomeChargeableUnHP [integer]  <- one figure (required)
```

Inside each `PropertyDetails[]` entry there are three nested repeating tables — **CoOwners[]**, **TenantDetails[]**, **Section24BDtls[]** — and one **Rentdetails** object holding the a–k income computation. The sheet lays one property out on rows 4–37; rows 40–42 are the schedule totals.

The utility sheet is a **single-property wireframe** (rows for property #1 only, with co-owner rows 8–12, tenant rows 16–17, loan rows 30–33). The build repeats the whole rows-4-to-37 group per property.

## The items

### Block ScheduleHP — property address & ownership (rows 4–7)

| Cell | Field (verbatim from sheet) | Type | Schema key | Rule |
|------|------|------|-----------|------|
| E4 | `Address of property` | text | `PropertyDetails[].AddressDetailWithZipCode.AddrDetail` | maxLength 200; required |
| F4 | `Town/ City` | text | `PropertyDetails[].AddressDetailWithZipCode.CityOrTownOrDistrict` | maxLength 50; required |
| G4/G5 | `State` (dropdown) | enum | `PropertyDetails[].AddressDetailWithZipCode.StateCode` | enum[38] code, required |
| H4/H5 | `Country` (dropdown) | enum | `PropertyDetails[].AddressDetailWithZipCode.CountryCode` | enum[250] code, required |
| I4 | `PIN Code` | integer | `PropertyDetails[].AddressDetailWithZipCode.PinCode` | min 100000, max 999999 |
| J4 | `Zip Code` | string | `PropertyDetails[].AddressDetailWithZipCode.ZipCode` | maxLength 8 |
| E6/F6 | `Owner of the Property` (dropdown) | enum | `PropertyDetails[].PropertyOwner` | enum SE, DO; required |
| G6/H6 | `Is property co-owned (if “YES” please enter following details)` (dropdown) | enum | `PropertyDetails[].PropCoOwnedFlg` | enum YES, NO; required |
| I6 | `Assessee’s percentage of share in the Property (%)` | number | `PropertyDetails[].AssessePercentShareProp` | min 0, max 100 |

`HPSNo` (`PropertyDetails[].HPSNo`, integer, required, max 99999999999999) is the property serial number for the array entry.

### Block ScheduleHP → CoOwners[] — other co-owners (rows 7–12)

| Cell | Field (verbatim) | Type | Schema key | Rule |
|------|------|------|-----------|------|
| E7 | `Sl.No` | integer | `PropertyDetails[].CoOwners[].CoOwnersSNo` | required, max 99999999999999 |
| F7 | `Name of Other co-owner(s)` | text | `PropertyDetails[].CoOwners[].NameCoOwner` | maxLength 125; required |
| G7 | `PAN of Other co-owner(s)` | string | `PropertyDetails[].CoOwners[].PAN_CoOwner` | — |
| H7 | `Aadhaar No. of Other co-owner(s)` | string | `PropertyDetails[].CoOwners[].Aadhaar_CoOwner` | — |
| I7 | `Percentage share of other Co-owner(s) in property(%)` | number | `PropertyDetails[].CoOwners[].PercentShareProperty` | min 0, max 100 |

### Block ScheduleHP → type of property & TenantDetails[] (rows 14–17)

| Cell | Field (verbatim) | Type | Schema key | Rule |
|------|------|------|-----------|------|
| E14/I14 | `Type of House property?` (dropdown) | enum | `PropertyDetails[].ifLetOut` | enum Y, D; required |
| E15 | `Sl.No` | integer | `PropertyDetails[].TenantDetails[].TenantSNo` | required, max 99999999999999 |
| F15 | `Name(s) of Tenant(s) (if let out)` | text | `PropertyDetails[].TenantDetails[].NameofTenant` | maxLength 125; required |
| G15 | `PAN of Tenant(s) (if available)` | string | `PropertyDetails[].TenantDetails[].PANofTenant` | — |
| H15 | `Aadhaar No. of tenant(s)` | string | `PropertyDetails[].TenantDetails[].AadhaarofTenant` | — |
| I15 | `PAN/TAN of Tenant(s) (if TDS credit is claimed)` | string | `PropertyDetails[].TenantDetails[].PANTANofTenant` | — |

### Block ScheduleHP → Rentdetails — the a–k computation (rows 19–37)

| Cell | Sl. | Field (verbatim) | Type | Schema key | Rule |
|------|-----|------|------|-----------|------|
| J19 | 1a | `Gross rent received or receivable or letable value (higher of the two, if let out for whole of the y` | integer | `PropertyDetails[].Rentdetails.AnnualLetableValue` | min 0; required |
| H20 | 1b | `The amount of rent which cannot be realized` | integer | `PropertyDetails[].Rentdetails.RentNotRealized` | min 0; required |
| H21 | 1c | `Tax paid to local authorities` | integer | `PropertyDetails[].Rentdetails.LocalTaxes` | min 0; required |
| H22 | 1d | `Total (1b + 1c)` | integer | `PropertyDetails[].Rentdetails.TotalUnrealizedAndTax` | computed `SUM(H20:H21)`; required |
| J23 | 1e | `Annual value (1a – 1d)` | integer | `PropertyDetails[].Rentdetails.BalanceALV` | computed `MAX(0,J19-H22)`; required |
| J24 | 1f | `Annual value of the property owned (own percentage share x 1e)` | integer | `PropertyDetails[].Rentdetails.AnnualOfPropOwned` | computed `ROUND(J23*J6/100,0)`; required |
| H25 | 1g | `30% of f` | integer | `PropertyDetails[].Rentdetails.ThirtyPercentOfBalance` | computed `MAX(ROUND(0.3*J24,0),0)`; min 0; required |
| H26 | 1h | `Interest payable on borrowed capital` | integer | `PropertyDetails[].Rentdetails.IntOnBorwCap` | computed `TotAmt.24b1`; min 0; required |
| J35 | 1i | `Total (1g+1h)` | integer | `PropertyDetails[].Rentdetails.TotalDeduct` | computed `SUM(H25:H26)`; min 0; required |
| J36 | 1j | `Arrears/Unrealised rent received during the year less 30%` | integer | `PropertyDetails[].Rentdetails.ArrearsUnrealizedRentRcvd` | min 0 |
| J37 | 1k | `Income from house property (1f-1i+1j) (in case of let out, for wireframes)` | integer | `PropertyDetails[].Rentdetails.IncomeOfHP` | computed `J24-J35+J36`; min -99999999999999, max 99999999999999; required |

### Block ScheduleHP → Rentdetails.Section24B / Section24BDtls[] — interest on borrowed capital (rows 26–34)

Header rows 27 `Section 24(b)` / `Interest on borrowed capital`.

| Cell | Field (verbatim) | Type | Schema key | Rule |
|------|------|------|-----------|------|
| C28 | `Sl. No.` | integer | (array index) | — |
| D30:D33 | `Loan taken from` (dropdown) | enum | `PropertyDetails[].Rentdetails.Section24B.Section24BDtls[].LoanTknFrom` | required |
| E30:E33 | `Name of the bank / Institution / Person from which the loan is taken` | text | `PropertyDetails[].Rentdetails.Section24B.Section24BDtls[].BankOrInstnName` | maxLength 125; required |
| F30:F33 | `Loan Account number of the Bank/ Institution` | string | `PropertyDetails[].Rentdetails.Section24B.Section24BDtls[].LoanAccNoOfBankOrInstnRefNo` | required |
| G30:G33 | `Date of sanction of loan` | date | `PropertyDetails[].Rentdetails.Section24B.Section24BDtls[].DateofLoan` | required |
| H30:H33 | `Total amount of loan` | integer | `PropertyDetails[].Rentdetails.Section24B.Section24BDtls[].TotalLoanAmt` | required |
| I30:I33 | `Amount of loan outstanding as on last date of financial year` | integer | `PropertyDetails[].Rentdetails.Section24B.Section24BDtls[].LoanOutstndngAmt` | required |
| J30:J33 | `Interest on Borrowed capital u/s 24(b)` | integer | `PropertyDetails[].Rentdetails.Section24B.Section24BDtls[].InterestUs24B` | required |
| J34 | `Total Interest on borrowed capital u/s 24(b)` | integer | `PropertyDetails[].Rentdetails.Section24B.TotalInterestUs24B` | computed `SUM(Intrst.24b1)`; min 0; required |

### Block ScheduleHP — schedule totals (rows 40–42)

| Cell | Sl. | Field (verbatim) | Type | Schema key | Rule |
|------|-----|------|------|-----------|------|
| D40 | — | `Income under the head “Income from house property”` | (heading) | — | sum of all `1k` |
| E41 | 2 | `Pass through income/ loss if any *` | integer | `PassThroghIncome` | min -99999999999999, max 99999999999999 |
| E42 | 3 | `Income under the head “Income from house property” (∑1k + 2) (if negative take the figure to 2i of s` | integer | `TotalIncomeChargeableUnHP` | **required**; = Σ1k + 2 |

Row 3 helper columns (loss-adjustment scratch, not entry fields):
- `[F3] Details of Income from House Property`
- `[M3] HP loss for 2 lakh adjustment`
- `[Q3] HP loss remaining after adjustment`

Row 43 note: `[C43] Note :` / `[E43] Furnishing of PAN/Aadhaar No. of tenant is mandatory, if tax is deducted under section 194-IB. Furni` (guidance text, not a field).

## The rules the sheet computes (with cell references)

- **1d Total** `[H22]= SUM(H20:H21)` — 1d = 1b + 1c (rules.json #200: "Sl.no 1d Total should be output of SL.no (1b+1c)").
- **1e Annual value** `[J23]= MAX(0,J19-H22)` — 1e = max(0, 1a − 1d) (rules.json #199: "Annual Value of 1(e) should be equal to the sum of (1a – 1d)").
- **1f Annual value of property owned** `[J24]= ROUND(J23*J6/100,0)` — 1e × own percentage share (rules.json #194: "annual value of the property owned should be equal to own percentage share *annual value").
- **1g 30% of f** `[H25]= MAX(ROUND(0.3*J24,0),0)` — 30% of 1f (rules.json #192: "1g should be equals to 30% of Annual value at 1f").
- **1h Interest payable** `[H26]= TotAmt.24b1` — pulled from the Section 24(b) loan-table total.
- **Total interest u/s 24(b)** `[J34]= SUM(Intrst.24b1)` — sum of `InterestUs24B` across loan rows (rules.json #205: "Sum of Interest on borrowed capital entered in table Section 24(b) ... equal to Interest on borrowed capital").
- **1i Total** `[J35]= SUM(H25:H26)` — 1i = 1g + 1h (rules.json #201: "1(i) total should be equal to the sum of (1g + 1h)").
- **1k Income from HP** `[J37]= J24-J35+J36` — 1k = 1f − 1i + 1j (rules.json #202: "in 1(k) ... should be equal to (1f – 1i + 1j)").
- **Own-share %** `[J6]= IF(MID(HP.CoOwnedYN1,1,1)="Y",100-SUM(HP.Co.Share1),IF(MID(HP.CoOwnedYN1,1,1)="N",100,0))` — if co-owned "Y", own share = 100 − Σ co-owner shares; if "N", 100; else 0. (rules.json #193/#194: "assessee's share and co-owner(s) share should be equal to 100 %"; #207/#208: co-owned Yes → other co-owners' share < 100%.)
- **Serial auto-increment** `[E9]=E8+1 … [E12]=E11+1` (co-owner rows), `[E17]=E16+1` (tenant rows), `[C31]=C30+1 … [C32]=C31+1` (loan rows), `[D42]=D41+1`.
- **2-lakh HP-loss cap (schedule totals scratch)** `[P3]= MAX(HP.TotalIncomeChargeableUnHP,-200000)` (loss allowed for adjustment, floored at −2,00,000) and `[T3]= MAX(0,(-HP.TotalIncomeChargeableUnHP-200000))` (loss remaining after the 2-lakh set-off). Feeds Schedule CYLA (rules.json #2540/#2545: HP loss set off to a maximum of Rs.200000).

Other department rules that bind this sheet (rules.json, cat A): #195 no interest if own share is zero; #196 no municipal tax if gross rent is zero/null; #197 total of HP = total of individual values; #198 let-out/deemed-let-out ⇒ gross rent cannot be zero/null; #203/#204 pass-through income ties to Schedule PTI; #204 assessee PAN ≠ co-owner PAN; #206 Section 24(b) details mandatory to claim the deduction; #208 rent-not-realised ≤ gross rent; #209 amount reduced in Schedule BP A3a ≤ income offered in HP.

## Dropdowns (every value)

- **F6 `Owner of the Property`** — source `"(Select),Self,Deemed Owner"`; codes SE, DO: `(Select)`, `Self`, `Deemed Owner`.
- **H6 `Is property co-owned`** — source `"(Select),Yes,No"`; codes YES, NO: `(Select)`, `Yes`, `No`.
- **I14 `Type of House property?`** — source `"(Select), Let Out, Deemed Let Out"`; codes Y, D: `(Select)`, ` Let Out`, ` Deemed Let Out`.
- **D30:D33 `Loan taken from`** — source `"(Select),Bank,Other than Bank"`: `(Select)`, `Bank`, `Other than Bank`.
- **G5 `State`** — enum[38] StateCode, 39 list values:

```
(Select), 01-Andaman and Nicobar Islands, 02-Andhra Pradesh, 03-Arunachal Pradesh, 04-Assam, 05-Bihar, 06-Chandigarh, 07-Dadra Nagar and Haveli, 08-Daman and Diu, 09-Delhi, 10-Goa, 11-Gujarat, 12-Haryana, 13-Himachal Pradesh, 14-Jammu and Kashmir, 15-Karnataka, 16-Kerala, 17-Lakshadweep, 18-Madhya Pradesh, 19-Maharashtra, 20-Manipur, 21-Meghalaya, 22-Mizoram, 23-Nagaland, 24-Odisha, 25-Puducherry, 26-Punjab, 27-Rajasthan, 28-Sikkim, 29-Tamil Nadu, 30-Tripura, 31-Uttar Pradesh, 32-West Bengal, 33-Chhattisgarh, 34-Uttarakhand, 35-Jharkhand, 36-Telangana, 37-Ladakh, 99-Foreign
```

- **H5 `Country`** — enum[250] CountryCode, 251 list values:

```
(select), 93-AFGHANISTAN, 1001-ALAND ISLANDS, 355-ALBANIA, 213-ALGERIA, 684-AMERICAN SAMOA, 376-ANDORRA, 244-ANGOLA, 1264-ANGUILLA, 1010-ANTARCTICA, 1268-ANTIGUA AND BARBUDA, 54-ARGENTINA, 374-ARMENIA, 297-ARUBA, 61-AUSTRALIA, 43-AUSTRIA, 994-AZERBAIJAN, 1242-BAHAMAS, 973-BAHRAIN, 880-BANGLADESH, 1246-BARBADOS, 375-BELARUS, 32-BELGIUM, 501-BELIZE, 229-BENIN, 1441-BERMUDA, 975-BHUTAN, 591-BOLIVIA (PLURINATIONAL STATE OF), 1002-BONAIRE, SINT EUSTATIUS AND SABA, 387-BOSNIA AND HERZEGOVINA, 267-BOTSWANA, 1003-BOUVET ISLAND, 55-BRAZIL, 1014-BRITISH INDIAN OCEAN TERRITORY, 673-BRUNEI DARUSSALAM, 359-BULGARIA, 226-BURKINA FASO, 257-BURUNDI, 238-CABO VERDE, 855-CAMBODIA, 237-CAMEROON, 1-CANADA, 1345-CAYMAN ISLANDS, 236-CENTRAL AFRICAN REPUBLIC, 235-CHAD, 56-CHILE, 86-CHINA, 9-CHRISTMAS ISLAND, 672-COCOS (KEELING) ISLANDS, 57-COLOMBIA, 270-COMOROS, 242-CONGO, 243-CONGO (DEMOCRATIC REPUBLIC OF THE), 682-COOK ISLANDS, 506-COSTA RICA, 225-COTE DIVOIRE, 385-CROATIA, 53-CUBA, 1015-CURACAO, 357-CYPRUS, 420-CZECHIA, 45-DENMARK, 253-DJIBOUTI, 1767-DOMINICA, 1809-DOMINICAN REPUBLIC, 593-ECUADOR, 20-EGYPT, 503-EL SALVADOR, 240-EQUATORIAL GUINEA, 291-ERITREA, 372-ESTONIA, 251-ETHIOPIA, 500-FALKLAND ISLANDS (MALVINAS), 298-FAROE ISLANDS, 679-FIJI, 358-FINLAND, 33-FRANCE, 594-FRENCH GUIANA, 689-FRENCH POLYNESIA, 1004-FRENCH SOUTHERN TERRITORIES, 241-GABON, 220-GAMBIA, 995-GEORGIA, 49-GERMANY, 233-GHANA, 350-GIBRALTAR, 30-GREECE, 299-GREENLAND, 1473-GRENADA, 590-GUADELOUPE, 1671-GUAM, 502-GUATEMALA, 1481-GUERNSEY, 224-GUINEA, 245-GUINEA-BISSAU, 592-GUYANA, 509-HAITI, 1005-HEARD ISLAND AND MCDONALD ISLANDS, 6-HOLY SEE, 504-HONDURAS, 852-HONG KONG, 36-HUNGARY, 354-ICELAND, 91-INDIA, 62-INDONESIA, 98-IRAN (ISLAMIC REPUBLIC OF), 964-IRAQ, 353-IRELAND, 1624-ISLE OF MAN, 972-ISRAEL, 5-ITALY, 1876-JAMAICA, 81-JAPAN, 1534-JERSEY, 962-JORDAN, 7-KAZAKHSTAN, 254-KENYA, 686-KIRIBATI, 850-KOREA (DEMOCRATIC PEOPLES REPUBLIC OF), 82-KOREA (REPUBLIC OF), 965-KUWAIT, 996-KYRGYZSTAN, 856-LAO PEOPLES DEMOCRATIC REPUBLIC, 371-LATVIA, 961-LEBANON, 266-LESOTHO, 231-LIBERIA, 218-LIBYA, 423-LIECHTENSTEIN, 370-LITHUANIA, 352-LUXEMBOURG, 853-MACAO, 389-MACEDONIA (THE FORMER YUGOSLAV REPUBLIC OF), 261-MADAGASCAR, 265-MALAWI, 60-MALAYSIA, 960-MALDIVES, 223-MALI, 356-MALTA, 692-MARSHALL ISLANDS, 596-MARTINIQUE, 222-MAURITANIA, 230-MAURITIUS, 269-MAYOTTE, 52-MEXICO, 691-MICRONESIA (FEDERATED STATES OF), 373-MOLDOVA (REPUBLIC OF), 377-MONACO, 976-MONGOLIA, 382-MONTENEGRO, 1664-MONTSERRAT, 212-MOROCCO, 258-MOZAMBIQUE, 95-MYANMAR, 264-NAMIBIA, 674-NAURU, 977-NEPAL, 31-NETHERLANDS, 687-NEW CALEDONIA, 64-NEW ZEALAND, 505-NICARAGUA, 227-NIGER, 234-NIGERIA, 683-NIUE, 15-NORFOLK ISLAND, 1670-NORTHERN MARIANA ISLANDS, 47-NORWAY, 968-OMAN, 92-PAKISTAN, 680-PALAU, 970-PALESTINE, STATE OF, 507-PANAMA, 675-PAPUA NEW GUINEA, 595-PARAGUAY, 51-PERU, 63-PHILIPPINES, 1011-PITCAIRN, 48-POLAND, 14-PORTUGAL, 1787-PUERTO RICO, 974-QATAR, 262-REUNION, 40-ROMANIA, 8-RUSSIAN FEDERATION, 250-RWANDA, 1006-SAINT BARTHELEMY, 290-SAINT HELENA, ASCENSION AND TRISTAN DA CUNHA, 1869-SAINT KITTS AND NEVIS, 1758-SAINT LUCIA, 1007-SAINT MARTIN (FRENCH PART), 508-SAINT PIERRE AND MIQUELON, 1784-SAINT VINCENT AND THE GRENADINES, 685-SAMOA, 378-SAN MARINO, 239-SAO TOME AND PRINCIPE, 966-SAUDI ARABIA, 221-SENEGAL, 381-SERBIA, 248-SEYCHELLES, 232-SIERRA LEONE, 65-SINGAPORE, 1721-SINT MAARTEN (DUTCH PART), 421-SLOVAKIA, 386-SLOVENIA, 677-SOLOMON ISLANDS, 252-SOMALIA, 28-SOUTH AFRICA, 1008-SOUTH GEORGIA AND THE SOUTH SANDWICH ISLANDS, 211-SOUTH SUDAN, 35-SPAIN, 94-SRI LANKA, 249-SUDAN, 597-SURINAME, 1012-SVALBARD AND JAN MAYEN, 268-SWAZILAND, 46-SWEDEN, 41-SWITZERLAND, 963-SYRIAN ARAB REPUBLIC, 886-TAIWAN, PROVINCE OF CHINA[A], 992-TAJIKISTAN, 255-TANZANIA, UNITED REPUBLIC OF, 66-THAILAND, 670-TIMOR-LESTE(EAST TIMOR), 228-TOGO, 690-TOKELAU, 676-TONGA, 1868-TRINIDAD AND TOBAGO, 216-TUNISIA, 90-TURKEY, 993-TURKMENISTAN, 1649-TURKS AND CAICOS ISLANDS, 688-TUVALU, 256-UGANDA, 380-UKRAINE, 971-UNITED ARAB EMIRATES, 44-UNITED KINGDOM OF GREAT BRITAIN AND NORTHERN IRELAND, 2-UNITED STATES OF AMERICA, 1009-UNITED STATES MINOR OUTLYING ISLANDS, 598-URUGUAY, 998-UZBEKISTAN, 678-VANUATU, 58-VENEZUELA (BOLIVARIAN REPUBLIC OF), 84-VIET NAM, 1284-VIRGIN ISLANDS (BRITISH), 1340-VIRGIN ISLANDS (U.S.), 681-WALLIS AND FUTUNA, 1013-WESTERN SAHARA, 967-YEMEN, 260-ZAMBIA, 263-ZIMBABWE, 9999-OTHERS
```

## What repeats and what is one figure

**Repeats:**
- `PropertyDetails[]` — the whole property block (address, ownership, type, rent a–k) repeats per house property.
- `CoOwners[]` — sheet rows 8–12 (up to 5 co-owner rows shown); repeats within a property.
- `TenantDetails[]` — sheet rows 16–17 (2 tenant rows shown); repeats within a property.
- `Section24BDtls[]` — sheet rows 30–33 (up to 4 loan rows shown); repeats within a property.

**One figure (whole schedule):**
- `PassThroghIncome` (row 41, Sl. 2).
- `TotalIncomeChargeableUnHP` (row 42, Sl. 3) — the schedule total = Σ1k + 2.

## Mandatory (schema `required`)

Schedule top: **`TotalIncomeChargeableUnHP`** (the only schedule-level required key).

Within each `PropertyDetails[]` (starred in `--leaves`): `HPSNo`, `AddressDetailWithZipCode.AddrDetail`, `AddressDetailWithZipCode.CityOrTownOrDistrict`, `AddressDetailWithZipCode.StateCode`, `AddressDetailWithZipCode.CountryCode`, `PropertyOwner`, `PropCoOwnedFlg`, `ifLetOut`, `Rentdetails.AnnualLetableValue`, `Rentdetails.RentNotRealized`, `Rentdetails.LocalTaxes`, `Rentdetails.TotalUnrealizedAndTax`, `Rentdetails.BalanceALV`, `Rentdetails.AnnualOfPropOwned`, `Rentdetails.ThirtyPercentOfBalance`, `Rentdetails.IntOnBorwCap`, `Rentdetails.TotalDeduct`, `Rentdetails.IncomeOfHP`.

Within `CoOwners[]` (when present): `CoOwnersSNo`, `NameCoOwner`.
Within `TenantDetails[]` (when present): `TenantSNo`, `NameofTenant`.
Within `Section24B`: `Section24BDtls` (array) and `TotalInterestUs24B`.
Within each `Section24BDtls[]` (when present): `LoanTknFrom`, `BankOrInstnName`, `LoanAccNoOfBankOrInstnRefNo`, `DateofLoan`, `TotalLoanAmt`, `LoanOutstndngAmt`, `InterestUs24B`.

Non-required: `PinCode`, `ZipCode`, `AssessePercentShareProp`, `PAN_CoOwner`, `Aadhaar_CoOwner`, `PercentShareProperty`, `PANofTenant`, `AadhaarofTenant`, `PANTANofTenant`, `ArrearsUnrealizedRentRcvd`, `PassThroghIncome`.

## Hidden rows — not built

**None.** No row in `HOUSE_PROPERTY` is marked `H` by `tools/dump.py` (checked: `dump.py ... | grep -E '^r *[0-9]+H'` → no matches). Rows 8–13, 16–18, 38–39 carry no label/formula content (data-entry continuation or spacer rows) and are not hidden.

## What this means for the build

- Build one repeating property block (rows 4–37) mapped to `PropertyDetails[]`, with three nested repeat tables (`CoOwners[]`, `TenantDetails[]`, `Section24BDtls[]`) and the `Rentdetails` object.
- Wire the computed cells exactly: 1d = 1b+1c, 1e = max(0,1a−1d), 1f = round(1e×own%/100), 1g = max(round(0.3×1f),0), 1i = 1g+1h, 1k = 1f−1i+1j; 1h = total interest from Section 24(b) table (`SUM(Section24BDtls[].InterestUs24B)` → `TotalInterestUs24B` → `IntOnBorwCap`).
- Own-share % (`AssessePercentShareProp`, cell J6): if co-owned = Yes, own share = 100 − Σ co-owner shares and co-owners must total < 100; if No, own share = 100.
- Schedule total `TotalIncomeChargeableUnHP` = Σ per-property `IncomeOfHP` (1k) + `PassThroghIncome`. When negative, it flows to Schedule CYLA sl.no 2i (with the −2,00,000 set-off cap tracked by the row-3 P3/T3 scratch formulas).
- `StateCode`/`CountryCode` store the numeric code before the dash (e.g. `19` for Maharashtra, `91` for India); `PropertyOwner` stores SE/DO, `PropCoOwnedFlg` YES/NO, `ifLetOut` Y/D.
- Validation to enforce: 194-IB tenant PAN/Aadhaar mandatory when TDS deducted; Section 24(b) loan details mandatory to claim interest; no municipal tax if gross rent is zero; let-out/deemed-let-out requires non-zero gross rent; rent-not-realised ≤ gross rent; assessee PAN ≠ co-owner PAN.
