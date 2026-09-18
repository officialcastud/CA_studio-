# HP — Details of Income from House Property (ITR-4)

## The shape
In ITR-4 there is no standalone Schedule HP in the return JSON: the house-property figures live inside the **IncomeDeductions** block as a `PropertyDetails` array (maxItems 2), with the head total surfaced as `TotalIncomeChargeableUnHP`. The utility sheet **SCH HP** lays out two identical property blocks — Property 1 (1A, rows 4–44) and Property 2 (1B, rows 45–85) — each capturing address, ownership/co-ownership, tenant details, rent/annual-value computation, and interest on borrowed capital u/s 24(b), then rolls up to B3 "Income chargeable under the head 'House Property'". Each property computes annual value, 30% standard deduction, interest u/s 24(b), and income of that property; the two are summed with the aggregate loss floored at −2,00,000.

## The items

### PropertyDetails[] — one entry per house property (Property 1 = rows 4–44, Property 2 = rows 45–85; schema `maxItems 2`)

| Sheet item | Field label | Type | Schema key | Rule / notes |
|---|---|---|---|---|
| 1A / 1B | Address of Property 1 / Address of Property 2 | header | (array element) | Two property blocks, identical layout |
| S.No | property serial number | integer | `PropertyDetails[].HPSNo` | required |
| — | Address | string | `PropertyDetails[].AddressDetailWithZipCode.AddrDetail` | required, maxLength 50 |
| — | Town/ City | string | `PropertyDetails[].AddressDetailWithZipCode.CityOrTownOrDistrict` | required, maxLength 50 |
| — | State | string(enum) | `PropertyDetails[].AddressDetailWithZipCode.StateCode` | required, enum of 38 state codes |
| — | Country | string(enum) | `PropertyDetails[].AddressDetailWithZipCode.CountryCode` | required, enum of 250 country codes; defaults 91-INDIA |
| — | PIN Code | integer | `PropertyDetails[].AddressDetailWithZipCode.PinCode` | 100000–999999 |
| — | Zip Code | string | `PropertyDetails[].AddressDetailWithZipCode.ZipCode` | maxLength 8 (foreign) |
| — | Owner of the Property | string(enum) | `PropertyDetails[].PropertyOwner` | required, enum SE/MI/SP/OT |
| — | Owner of the Property (Please specify if others is selected) | string | `PropertyDetails[].PropertyOwnerOther` | maxLength 50, used when OT |
| — | Is the property co-owned | string(enum) | `PropertyDetails[].PropCoOwnedFlg` | required, enum YES/NO |
| — | Your percentage of share in the Property(%) | number | `PropertyDetails[].AsseseeShareProperty` | 0–100 |
| S.No | Name of Other Co-owner(s) | array | `PropertyDetails[].CoOwners[]` | co-owner table |
| — | Co-owner S.No | integer | `PropertyDetails[].CoOwners[].CoOwnersSNo` | required, min 1 |
| — | Name of Other Co-owner(s) | string | `PropertyDetails[].CoOwners[].NameCoOwner` | required, maxLength 125 |
| — | PAN of Other Co-owner(s) | string | `PropertyDetails[].CoOwners[].PAN_CoOwner` | maxLength 10 |
| — | Aadhaar No. of Other Co-owner(s) | string | `PropertyDetails[].CoOwners[].Aadhaar_CoOwner` | |
| — | Percentage share of other co-owner(s) in property (%) | number | `PropertyDetails[].CoOwners[].PercentShareProperty` | 0–100 |
| — | Type of House property? | string(enum) | `PropertyDetails[].ifLetOut` | required, enum L/D/S |
| S.No | Name(s) of Tenant (if let out) | array | `PropertyDetails[].TenantDetails[]` | tenant table |
| — | Tenant S.No | integer | `PropertyDetails[].TenantDetails[].TenantSNo` | required, min 1 |
| — | Name(s) of Tenant (if let out) | string | `PropertyDetails[].TenantDetails[].NameofTenant` | required, maxLength 125 |
| — | PAN of Tenant(s) (if available) | string | `PropertyDetails[].TenantDetails[].PANofTenant` | |
| — | Aadhaar No. of Tenant(s) (if available) | string | `PropertyDetails[].TenantDetails[].AadhaarofTenant` | |
| — | PAN / TAN of Tenant(s) (if TDS credit is claimed) | string | `PropertyDetails[].TenantDetails[].PANTANofTenant` | mandatory if TDS u/s 194-IB |
| a | Gross rent received/ receivable/ lettable value during the year | integer | `PropertyDetails[].Rentdetails.AnnualLetableValue` | required |
| b | The amount of rent which cannot be realized | integer | `PropertyDetails[].Rentdetails.RentNotRealized` | |
| c | Tax paid to local authorities | integer | `PropertyDetails[].Rentdetails.LocalTaxes` | not allowed for Self-Occupied |
| d | Total (1b + 1c) | integer | `PropertyDetails[].Rentdetails.TotalUnrealizedAndTax` | required, = sum(b,c) |
| e | Annual value (1a – 1d) (nil, if self-occupied etc. as per section 23(2) of the Act) | integer | `PropertyDetails[].Rentdetails.BalanceALV` | required |
| f | Annual value of the property owned (own percentage share x 1e) | integer | `PropertyDetails[].Rentdetails.AnnualOfPropOwned` | required |
| g | 30% of Annual Value (30% *1f) | integer | `PropertyDetails[].Rentdetails.ThirtyPercentOfBalance` | required, standard deduction |
| h | Interest payable on borrowed capital | integer | `PropertyDetails[].Rentdetails.IntOnBorwCap` | required; cannot exceed 2 lacs if not let out |
| Section 24(b) | Interest on borrowed capital | array | `PropertyDetails[].Rentdetails.Section24B.Section24BDtls[]` | loan detail table |
| Sl. No. / i | Loan taken from | string | `PropertyDetails[].Rentdetails.Section24B.Section24BDtls[].LoanTknFrom` | required, enum Bank / Other than Bank |
| ii | Name of the bank / Institution / Person from which the loan is taken | string | `PropertyDetails[].Rentdetails.Section24B.Section24BDtls[].BankOrInstnName` | required |
| iii | Loan Account number of the Bank/ Institution | string | `PropertyDetails[].Rentdetails.Section24B.Section24BDtls[].LoanAccNoOfBankOrInstnRefNo` | required |
| iv | Date of sanction of loan | string | `PropertyDetails[].Rentdetails.Section24B.Section24BDtls[].DateofLoan` | required |
| v | Total amount of loan | integer | `PropertyDetails[].Rentdetails.Section24B.Section24BDtls[].TotalLoanAmt` | required |
| vi | Loan outstanding as on last date of financial year | integer | `PropertyDetails[].Rentdetails.Section24B.Section24BDtls[].LoanOutstndngAmt` | required |
| vii | Interest on Borrowed capital u/s 24(b) | integer | `PropertyDetails[].Rentdetails.Section24B.Section24BDtls[].InterestUs24B` | required |
| — | Total Interest on borrowed capital u/s 24(b) | integer | `PropertyDetails[].Rentdetails.Section24B.TotalInterestUs24B` | required, = sum of loan rows |
| i | Total (1g+1h) | integer | `PropertyDetails[].Rentdetails.TotalDeduct` | required, interest plus 30% of balance |
| j | Arrears/Unrealized Rent received during the year Less 30% | integer | `PropertyDetails[].Rentdetails.ArrearsUnrealizedRentRcvd` | |
| k | Income from house property (1f – 1i + 1j) | integer | `PropertyDetails[].Rentdetails.IncomeOfHP` | required, may be negative |
| B3 | Income chargeable under the head 'House Property' (Ʃ1k) (If loss, put the figure in negative) | integer | `TotalIncomeChargeableUnHP` | required, House Property income; aggregate loss floored at −2,00,000 |

## The rules the sheet computes
- **[I28] / [I69]** `= SUM(I26:I27)` — Total (1b + 1c) = rent-not-realized + tax paid to local authorities.
- **[K29] / [K70]** `= MAX((K25-I28),0)` — Annual value (1a − 1d), floored at 0.
- **[K30] / [K71]** `= MAX(0,ROUND(((K8/100)*K29),0))` — Annual value of property owned = assessee % share × annual value, floored at 0.
- **[I31] / [I72]** `= MAX(ROUND(IF(((30/100)*K30) < 0,0,(30/100*K30)),0),0)` — 30% of annual value (standard deduction), floored at 0.
- **[K41] / [K82]** `= SUM(Intrst.24b1)` / `= SUM(Intrst.24b2)` — Total interest on borrowed capital u/s 24(b) across loan rows.
- **[K42] / [K83]** `= SUM(I31,I32)` / `= SUM(I72,I73)` — Total (1g + 1h) = 30% deduction + interest payable.
- **[K44] / [K85]** `= K30-K42+K43` / `= K71-K83+K84` — Income from house property = annual value owned − total deduction + arrears/unrealized rent.
- **[K87]** `= MAX(-200000,HP.IncomeOfHP1+HP.IncomeOfHP2)` — B3 head total = sum of both properties' income, with aggregate loss capped at −2,00,000.
- **[H73]** label rule: "Cannot exceed 2 lacs if not let out" — interest cap for self-occupied property.
- **[D37]/[D38]/[D78]/[D79]** `= D+1` — loan Sl. No. auto-increment; **[F10]/[F11]/[F22]/[F23]/[F51]/[F52]/[F63]/[F64]** `= F+1` — co-owner/tenant S.No auto-increment.
- **[R36]/[R37]/[R77]/[R78]** `= TRIM(F)&"_"&TRIM(G)&"_"&TRIM(H)&"_"&TRIM(I)` — duplicate-loan key builder.
- **[S45]** `= IF(AND(HP.CountryCode2<>"",...<>"91-INDIA"),"Data","NoData")` and **[O46]–[V46], [P48], [Q48], [S48]/[T48], [S49]/[T49]** — presence/completeness detectors for Property 2 block and co-owner name/share row counts.
- Note (row 88): Furnishing of PAN/ Aadhaar No. of tenant is mandatory, if tax is deducted under section 194-IB.

## Dropdowns
- **Owner of the Property** (`G7`, `G48`, `HP.OwnerPropertyDropdown`): (Select), Self, Minor, Spouse, Others
- **Is the property co-owned** (`J7`, `J48`): (Select), Yes, No
- **Type of House property?** (`H19`, `H60`): (Select), Self Occupied, Let Out, Deemed Let Out
- **Loan taken from** (`E36:E40`, `E77:E81`): (Select), Bank , Other than Bank
- **State** (`H6`, `H47`): (Select), 01-Andaman and Nicobar islands, 02-Andhra Pradesh, 03-Arunachal Pradesh, 04-Assam, 05-Bihar, 06-Chandigarh, 07-THE DADRA AND NAGAR HAVELI AND DAMAN AND DIU, 09-Delhi, 10-Goa, 11-Gujarat, 12-Haryana, 13-Himachal Pradesh, 14-Jammu and Kashmir, 15-Karnataka, 16-Kerala, 17-Lakshadweep, 18-Madhya Pradesh, 19-Maharashtra, 20-Manipur, 21-Meghalaya, 22-Mizoram, 23-Nagaland, 24-Odisha, 25-Puducherry, 26-Punjab, 27-Rajasthan, 28-Sikkim, 29-Tamil Nadu, 30-Tripura, 31-Uttar Pradesh, 32-West Bengal, 33-Chattisgarh, 34-Uttarakhand, 35-Jharkhand, 36-Telangana, 37-Ladakh, 99-Foreign
- **Country** (`I6`, `I47`): (Select), 93-AFGHANISTAN, 1001-ALAND ISLANDS, 355-ALBANIA, 213-ALGERIA, 684-AMERICAN SAMOA, 376-ANDORRA, 244-ANGOLA, 1264-ANGUILLA, 1010-ANTARCTICA, 1268-ANTIGUA AND BARBUDA, 54-ARGENTINA, 374-ARMENIA, 297-ARUBA, 61-AUSTRALIA, 43-AUSTRIA, 994-AZERBAIJAN, 1242-BAHAMAS, 973-BAHRAIN, 880-BANGLADESH, 1246-BARBADOS, 375-BELARUS, 32-BELGIUM, 501-BELIZE, 229-BENIN, 1441-BERMUDA, 975-BHUTAN, 591-BOLIVIA (PLURINATIONAL STATE OF), 1002-BONAIRE, SINT EUSTATIUS AND SABA, 387-BOSNIA AND HERZEGOVINA, 267-BOTSWANA, 1003-BOUVET ISLAND, 55-BRAZIL, 1014-BRITISH INDIAN OCEAN TERRITORY, 673-BRUNEI DARUSSALAM, 359-BULGARIA, 226-BURKINA FASO, 257-BURUNDI, 238-CABO VERDE, 855-CAMBODIA, 237-CAMEROON, 1-CANADA, 1345-CAYMAN ISLANDS, 236-CENTRAL AFRICAN REPUBLIC, 235-CHAD, 56-CHILE, 86-CHINA, 9-CHRISTMAS ISLAND, 672-COCOS (KEELING) ISLANDS, 57-COLOMBIA, 270-COMOROS, 242-CONGO, 243-CONGO (DEMOCRATIC REPUBLIC OF THE), 682-COOK ISLANDS, 506-COSTA RICA, 225-CÔTE D'IVOIRE, 385-CROATIA, 53-CUBA, 1015-CURAÇAO, 357-CYPRUS, 420-CZECHIA, 45-DENMARK, 253-DJIBOUTI, 1767-DOMINICA, 1809-DOMINICAN REPUBLIC, 593-ECUADOR, 20-EGYPT, 503-EL SALVADOR, 240-EQUATORIAL GUINEA, 291-ERITREA, 372-ESTONIA, 251-ETHIOPIA, 500-FALKLAND ISLANDS (MALVINAS), 298-FAROE ISLANDS, 679-FIJI, 358-FINLAND, 33-FRANCE, 594-FRENCH GUIANA, 689-FRENCH POLYNESIA, 1004-FRENCH SOUTHERN TERRITORIES, 241-GABON, 220-GAMBIA, 995-GEORGIA, 49-GERMANY, 233-GHANA, 350-GIBRALTAR, 30-GREECE, 299-GREENLAND, 1473-GRENADA, 590-GUADELOUPE, 1671-GUAM, 502-GUATEMALA, 1481-GUERNSEY, 224-GUINEA, 245-GUINEA-BISSAU, 592-GUYANA, 509-HAITI, 1005-HEARD ISLAND AND MCDONALD ISLANDS, 6-HOLY SEE, 504-HONDURAS, 852-HONG KONG, 36-HUNGARY, 354-ICELAND, 91-INDIA, 62-INDONESIA, 98-IRAN (ISLAMIC REPUBLIC OF), 964-IRAQ, 353-IRELAND, 1624-ISLE OF MAN, 972-ISRAEL, 5-ITALY, 1876-JAMAICA, 81-JAPAN, 1534-JERSEY, 962-JORDAN, 7-KAZAKHSTAN, 254-KENYA, 686-KIRIBATI, 850-KOREA (DEMOCRATIC PEOPLE'S REPUBLIC OF), 82-KOREA (REPUBLIC OF), 965-KUWAIT, 996-KYRGYZSTAN, 856-LAO PEOPLE'S DEMOCRATIC REPUBLIC, 371-LATVIA, 961-LEBANON, 266-LESOTHO, 231-LIBERIA, 218-LIBYA, 423-LIECHTENSTEIN, 370-LITHUANIA, 352-LUXEMBOURG, 853-MACAO, 389-MACEDONIA (THE FORMER YUGOSLAV REPUBLIC OF), 261-MADAGASCAR, 265-MALAWI, 60-MALAYSIA, 960-MALDIVES, 223-MALI, 356-MALTA, 692-MARSHALL ISLANDS, 596-MARTINIQUE, 222-MAURITANIA, 230-MAURITIUS, 269-MAYOTTE, 52-MEXICO, 691-MICRONESIA (FEDERATED STATES OF), 373-MOLDOVA (REPUBLIC OF), 377-MONACO, 976-MONGOLIA, 382-MONTENEGRO, 1664-MONTSERRAT, 212-MOROCCO, 258-MOZAMBIQUE, 95-MYANMAR, 264-NAMIBIA, 674-NAURU, 977-NEPAL, 31-NETHERLANDS, 687-NEW CALEDONIA, 64-NEW ZEALAND, 505-NICARAGUA, 227-NIGER, 234-NIGERIA, 683-NIUE, 15-NORFOLK ISLAND, 1670-NORTHERN MARIANA ISLANDS, 47-NORWAY, 968-OMAN, 92-PAKISTAN, 680-PALAU, 970-PALESTINE, STATE OF, 507-PANAMA, 675-PAPUA NEW GUINEA, 595-PARAGUAY, 51-PERU, 63-PHILIPPINES, 1011-PITCAIRN, 48-POLAND, 14-PORTUGAL, 1787-PUERTO RICO, 974-QATAR, 262-RÉUNION, 40-ROMANIA, 8-RUSSIAN FEDERATION, 250-RWANDA, 1006-SAINT BARTHÉLEMY, 290-SAINT HELENA, ASCENSION AND TRISTAN DA CUNHA, 1869-SAINT KITTS AND NEVIS, 1758-SAINT LUCIA, 1007-SAINT MARTIN (FRENCH PART), 508-SAINT PIERRE AND MIQUELON, 1784-SAINT VINCENT AND THE GRENADINES, 685-SAMOA, 378-SAN MARINO, 239-SAO TOME AND PRINCIPE, 966-SAUDI ARABIA, 221-SENEGAL, 381-SERBIA, 248-SEYCHELLES, 232-SIERRA LEONE, 65-SINGAPORE, 1721-SINT MAARTEN (DUTCH PART), 421-SLOVAKIA, 386-SLOVENIA, 677-SOLOMON ISLANDS, 252-SOMALIA, 28-SOUTH AFRICA, 1008-SOUTH GEORGIA AND THE SOUTH SANDWICH ISLANDS, 211-SOUTH SUDAN, 35-SPAIN, 94-SRI LANKA, 249-SUDAN, 597-SURINAME, 1012-SVALBARD AND JAN MAYEN, 268-SWAZILAND, 46-SWEDEN, 41-SWITZERLAND, 963-SYRIAN ARAB REPUBLIC, 886-TAIWAN, 992-TAJIKISTAN, 255-TANZANIA, UNITED REPUBLIC OF, 66-THAILAND, 670-TIMOR-LESTE (EAST TIMOR), 228-TOGO, 690-TOKELAU, 676-TONGA, 1868-TRINIDAD AND TOBAGO, 216-TUNISIA, 90-TURKEY, 993-TURKMENISTAN, 1649-TURKS AND CAICOS ISLANDS, 688-TUVALU, 256-UGANDA, 380-UKRAINE, 971-UNITED ARAB EMIRATES, 44-UNITED KINGDOM OF GREAT BRITAIN AND NORTHERN IRELAND, 2-UNITED STATES OF AMERICA, 1009-UNITED STATES MINOR OUTLYING ISLANDS, 598-URUGUAY, 998-UZBEKISTAN, 678-VANUATU, 58-VENEZUELA (BOLIVARIAN REPUBLIC OF), 84-VIET NAM, 1284-VIRGIN ISLANDS (BRITISH), 1340-VIRGIN ISLANDS (U.S.), 681-WALLIS AND FUTUNA, 1013-WESTERN SAHARA, 967-YEMEN, 260-ZAMBIA, 263-ZIMBABWE, 9999-OTHERS

Schema enum codings (not shown as dropdown text, for the builder's mapping): `PropertyOwner` = SE (Self), MI (Minor), SP (Spouse), OT (Others); `PropCoOwnedFlg` = YES, NO; `ifLetOut` = L (Let Out), D (Deemed Let Out), S (Self Occupied).

## What repeats and what is one figure
- **Repeats (arrays):** `PropertyDetails[]` (up to 2 properties); within each — `CoOwners[]` (co-owner rows, sheet rows 8–18 / 49–59), `TenantDetails[]` (tenant rows 20–24 / 61–65), and `Section24B.Section24BDtls[]` (loan rows 36–40 / 77–81).
- **One figure per property:** the whole `Rentdetails` object (AnnualLetableValue through IncomeOfHP), the address object, ownership fields, and `Section24B.TotalInterestUs24B`.
- **One figure for the head:** `TotalIncomeChargeableUnHP` (B3), a single aggregate for the return.

## Mandatory
The HP-relevant required (`*`) leaf keys within `PropertyDetails[]` and the head total: `HPSNo`, `AddrDetail`, `CityOrTownOrDistrict`, `StateCode`, `CountryCode`, `PropertyOwner`, `PropCoOwnedFlg`, `CoOwnersSNo`, `NameCoOwner`, `ifLetOut`, `TenantSNo`, `NameofTenant`, `AnnualLetableValue`, `TotalUnrealizedAndTax`, `BalanceALV`, `AnnualOfPropOwned`, `ThirtyPercentOfBalance`, `IntOnBorwCap`, `Section24BDtls`, `LoanTknFrom`, `BankOrInstnName`, `LoanAccNoOfBankOrInstnRefNo`, `DateofLoan`, `TotalLoanAmt`, `LoanOutstndngAmt`, `InterestUs24B`, `TotalInterestUs24B`, `TotalDeduct`, `IncomeOfHP`, `TotalIncomeChargeableUnHP`.

The **IncomeDeductions** block (the parent schema object that carries HP) also declares these required keys, owned by other sheets but listed here for completeness of the block: `IncomeFromBusinessProf`, `GrossSalary`, `SalNatureDesc`, `SalOthAmount`, `TotalAllwncExemptUs10`, `NetSalary`, `DeductionUs16`, `IncomeFromSal`, `IncomeOthSrc`, `OthSrcNatureDesc`, `OthSrcOthAmount`, `Upto15Of6`, `Upto15Of9`, `Up16Of9To15Of12`, `Up16Of12To15Of3`, `Up16Of3To31Of3`, `GrossTotIncome`, `GrossTotIncomeIncLTCG112A`, `Section80C`, `Section80CCC`, `TypeofIdentifier`, `NameofIdentifier`, `Amount`, `Section80CCDEmployeeOrSE`, `Section80CCD1B`, `Section80CCDEmployer`, `Section80D`, `Section80DD`, `Section80DDB`, `Section80E`, `Section80G`, `Section80GG`, `Section80GGC`, `Section80U`, `Section80TTA`, `Section80TTB`, `AnyOthSec80CCH`, `TotalChapVIADeductions`, `TotalIncome`. (Under `UsrDeductUndChapVIA` and `DeductUndChapVIA`.)

## Hidden rows — not built
- **Row 86H — [E86] "Pass through income/Loss if any *"**: HIDDEN in the utility (business-trust/investment-fund pass-through line). ITR-4 does not build this HP line; there is no schema key for pass-through HP income in `PropertyDetails`. Not rendered as an item.

## What this means for the build
- No standalone Schedule HP in the return: write HP into `IncomeDeductions.PropertyDetails[]` (max 2 entries) and set `IncomeDeductions.TotalIncomeChargeableUnHP` to the B3 head total.
- Two identical property blocks in the sheet map to the two array elements; render the second only when Property 2 data is present (the sheet's `S45`/`O46`–`V46` detectors gate the second block).
- Compute per property in this order: d = b + c; e = MAX(a − d, 0); f = MAX(round(share% × e), 0); g = 30% of f; TotalInterestUs24B = sum of Section24B loan rows = h (IntOnBorwCap); TotalDeduct (i) = g + h; IncomeOfHP (k) = f − i + j (arrears less 30%).
- Cap: for a property that is not let out (Self Occupied / Deemed), interest cannot exceed Rs 2 lacs; at head level the aggregate HP loss is floored at −2,00,000 (`MAX(-200000, HP1+HP2)`).
- Self-Occupied specifics: annual value is nil per section 23(2); "Tax paid to local authorities" is not allowed for Self-Occupied. Under the new tax regime, interest on borrowed capital for Self-Occupied must be zero.
- Type of House Property is mandatory whenever interest u/s 24(b) is claimed; the "interest payable on borrowed capital" value must equal the total interest paid u/s 24(b) from the Section 24(b) loan table.
- Tenant PAN/Aadhaar is mandatory when TDS is deducted u/s 194-IB (row 88 note); capture `PANTANofTenant` for TDS-credit claims.
- Co-ownership: when `PropCoOwnedFlg` = YES, capture the `CoOwners[]` table; assessee PAN and any co-owner PAN cannot be the same; annual value owned uses the assessee's own share %.
