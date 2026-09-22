# The book of the HP sheet — ITR-1 SAHAJ, A.Y. 2026-27

Read row by row from the utility's **HP** sheet (**SCH HP — Details of Income
from House Property**) and confirmed against the CBDT ITR-1 schema block
**PropertyDetails** (`section_map.json` → section `hp`; `schema_tree.md` §7.3, VBA
lines 33819-34192). ITR-1 allows income (or loss) from **house property**; this
sheet captures up to two properties, each with its address, ownership and
co-ownership, tenant details, the annual-value working and the section-24(b)
interest sub-grid, and the head total that feeds B2 on the Income Details sheet.
Nothing here is invented; the appendices list every schema leaf of
`PropertyDetails`, every live row verbatim, and every dropdown value.

---

## 1 · Purpose and shape

Two property blocks — **1A** (rows 4-39) and **1B** (rows 40-75) — of identical
shape, then a head total (**B2**, row 76) and a PAN/Aadhaar note (row 77). Each
block is one element of the repeating array `PropertyDetails[]`.

A property block holds: the address (`AddressDetailWithZipCode`), the owner and
co-ownership grid (`PropertyOwner`, `PropCoOwnedFlg`, `AsseseeShareProperty`,
`CoOwners[]`), the let-out flag and tenant grid (`ifLetOut`, `TenantDetails[]`),
and the rent working (`Rentdetails`) with the nested section-24(b) loan grid
(`Rentdetails.Section24B.Section24BDtls[]`).

---

## 2 · The annual-value working (rows 21-39, mirrored 57-75)

| Row (1A / 1B) | Label | Schema key |
|---|---|---|
| 21 / 57 (a) | Gross rent received/ receivable/ lettable value during the year | `Rentdetails.AnnualLetableValue` |
| 22 / 58 (b) | The amount of rent which cannot be realized | `Rentdetails.RentNotRealized` |
| 23 / 59 (c) | Tax paid to local authorities | `Rentdetails.LocalTaxes` |
| 24 / 60 (d) | Total (1b + 1c) | `Rentdetails.TotalUnrealizedAndTax` |
| 25 / 61 (e) | Annual value (1a – 1d) | `Rentdetails.BalanceALV` |
| 26 / 62 (f) | Annual value of the property owned (own percentage share × 1e) | `Rentdetails.AnnualOfPropOwned` |
| 27 / 63 (g) | 30% of Annual Value (30% × 1f) | `Rentdetails.ThirtyPercentOfBalance` |
| 28 / 64 (h) | Interest payable on borrowed capital | `Rentdetails.IntOnBorwCap` |
| 37 / 73 (i) | Total (1g + 1h) | `Rentdetails.TotalDeduct` |
| 38 / 74 (j) | Arrears/Unrealised Rent received during the year Less 30% | `Rentdetails.ArrearsUnrealizedRentRcvd` |
| 39 / 75 (k) | Income from house property (1f − 1i + 1j) | `Rentdetails.IncomeOfHP` |

The **Type of House property** dropdown (Self Occupied / Let Out / Deemed Let
Out) drives whether the annual value is nil (self-occupied) and whether the
30% standard deduction and interest apply. For a self-occupied property the
annual value is nil and only interest under section 24(b) is deductible
(capped at Rs. 2,00,000).

## 3 · Section 24(b) interest sub-grid (rows 30-36, mirrored 66-72)

Each loan row maps to `Rentdetails.Section24B.Section24BDtls[]`: **Loan taken
from** (`LoanTknFrom`, Bank / Other than Bank), **Name of the bank / Institution
/ Person** (`BankOrInstnName`), **Loan Account number** (`LoanAccNoOfBankOrInstnRefNo`),
**Date of sanction of loan** (`DateofLoan`), **Total amount of loan**
(`TotalLoanAmt`), **Loan outstanding** (`LoanOutstndngAmt`) and **Interest on
Borrowed capital u/s 24(b)** (`InterestUs24B`); the row-total is
`Section24B.TotalInterestUs24B`.

## 4 · Owner, co-owners and tenants

**Owner of the Property** (`PropertyOwner`: Self / Minor / Spouse / Others; free
text `PropertyOwnerOther` if Others). **Is the property co-owned** (`PropCoOwnedFlg`
YES/NO) and **Your percentage of share** (`AsseseeShareProperty`); each other
co-owner (`CoOwners[]`) carries name, PAN, Aadhaar and percentage share. If let
out, each tenant (`TenantDetails[]`) carries name, PAN, Aadhaar and PAN/TAN.
**Furnishing of PAN/Aadhaar No. of the tenant is mandatory if tax is deducted
under section 194-IB.**

## 5 · Cross-sheet feeds

**Out:** the sum of each block's income-from-house-property (row 39 / 75) →
**B2** on Income Details (`ITR1_IncomeDeductions.TotalIncomeChargeableUnHP`).
Loss (negative) flows through with the figure in negative.

**In:** the section-24(b) interest total feeds row 28/64 (interest payable on
borrowed capital); the hidden "Schedule 24(b)" helper sheet supplies the loan
grid when housing-loan interest is claimed.

---

## Appendix · Every schema leaf of block PropertyDetails (full paths)
`*` = schema-required.
```
  PropertyDetails[] array (repeating; one per property)
* PropertyDetails[].HPSNo int
* PropertyDetails[].AddressDetailWithZipCode.AddrDetail string
* PropertyDetails[].AddressDetailWithZipCode.CityOrTownOrDistrict string
  PropertyDetails[].AddressDetailWithZipCode.StateCode enum(StateCode)
  PropertyDetails[].AddressDetailWithZipCode.CountryCode enum
  PropertyDetails[].AddressDetailWithZipCode.PinCode int (cond, CountryCode 91)
  PropertyDetails[].AddressDetailWithZipCode.ZipCode string (cond, foreign)
* PropertyDetails[].PropertyOwner enum(PropertyOwner)
  PropertyDetails[].PropertyOwnerOther string
* PropertyDetails[].PropCoOwnedFlg enum(YES/NO)
* PropertyDetails[].AsseseeShareProperty int (default 100)
  PropertyDetails[].CoOwners[].CoOwnersSNo int
  PropertyDetails[].CoOwners[].NameCoOwner string
  PropertyDetails[].CoOwners[].PAN_CoOwner string
  PropertyDetails[].CoOwners[].Aadhaar_CoOwner string
  PropertyDetails[].CoOwners[].PercentShareProperty number
* PropertyDetails[].ifLetOut enum(ifLetOut)
  PropertyDetails[].TenantDetails[].TenantSNo int
  PropertyDetails[].TenantDetails[].NameofTenant string
  PropertyDetails[].TenantDetails[].PANofTenant string
  PropertyDetails[].TenantDetails[].AadhaarofTenant string
  PropertyDetails[].TenantDetails[].PANTANofTenant string
* PropertyDetails[].Rentdetails.AnnualLetableValue int
* PropertyDetails[].Rentdetails.RentNotRealized int
* PropertyDetails[].Rentdetails.LocalTaxes int
* PropertyDetails[].Rentdetails.TotalUnrealizedAndTax int
* PropertyDetails[].Rentdetails.BalanceALV int
* PropertyDetails[].Rentdetails.AnnualOfPropOwned int
* PropertyDetails[].Rentdetails.ThirtyPercentOfBalance int
* PropertyDetails[].Rentdetails.IntOnBorwCap int
  PropertyDetails[].Rentdetails.Section24B.Section24BDtls[].LoanTknFrom enum(LoanTknFrom)
  PropertyDetails[].Rentdetails.Section24B.Section24BDtls[].BankOrInstnName string
  PropertyDetails[].Rentdetails.Section24B.Section24BDtls[].LoanAccNoOfBankOrInstnRefNo string
  PropertyDetails[].Rentdetails.Section24B.Section24BDtls[].DateofLoan date
  PropertyDetails[].Rentdetails.Section24B.Section24BDtls[].TotalLoanAmt int
  PropertyDetails[].Rentdetails.Section24B.Section24BDtls[].LoanOutstndngAmt int
  PropertyDetails[].Rentdetails.Section24B.Section24BDtls[].InterestUs24B int
  PropertyDetails[].Rentdetails.Section24B.TotalInterestUs24B int
* PropertyDetails[].Rentdetails.TotalDeduct int
  PropertyDetails[].Rentdetails.ArrearsUnrealizedRentRcvd int
* PropertyDetails[].Rentdetails.IncomeOfHP int
* ITR1_IncomeDeductions.TotalIncomeChargeableUnHP int
```

## Appendix · Every live row of the sheet, verbatim
```
r   3 : [C3] SCH HP  |  [F3] Details of Income from House Property
r   4 : [D4] 1A  |  [F4] Address of Property 1
r   5 : [F5] Address  |  [G5] Town/ City  |  [H5] State  |  [I5] Country  |  [J5] PIN Code  |  [K5] ZIP Code
r   6 : [H6] (Select)  |  [I6] 91-INDIA
r   7 : [F7] Owner of the Property  |  [G7] (Select)  |  [I7] Is the property co-owned (if “YES” please enter following details)  |  [J7] (Select)  |  [K7] Your percentage of share in the Property(%)
r   8 : [F8] S.No  |  [G8] Name of Other Co-owner(s)  |  [H8] PAN of Other Co-owner(s)  |  [I8] Aadhaar No. of Other Co-owner(s)  |  [J8] Percentage share of other co-owner(s) in property (%)
r  16 : [F16] Type of House property?  |  [H16] (Select)
r  17 : [F17] S.No  |  [G17] Name(s) of Tenant (if let out)  |  [H17] PAN of Tenant(s) (if available)  |  [I17] Aadhaar No. of Tenant(s) (if available)  |  [J17] PAN/TAN of Tenant(s) (if TDS credit is claimed)
r  21 : [E21] a  |  [F21] Gross rent received/ receivable/ lettable value during the year  |  [J21] a
r  22 : [E22] b  |  [F22] The amount of rent which cannot be realized
r  23 : [E23] c  |  [F23] Tax paid to local authorities
r  24 : [E24] d  |  [F24] Total (1b + 1c)
r  25 : [E25] e  |  [F25] Annual value (1a – 1d) (nil, if self -occupied etc. as per section 23(2)of the Act)  |  [J25] e
r  26 : [E26] f  |  [F26] Annual value of the property owned (own percentage share x 1e)  |  [J26] f
r  27 : [E27] g  |  [F27] 30% of Annual Value (30% *1f)
r  28 : [E28] h  |  [F28] Interest payable on borrowed capital
r  29 : [D29] Section 24(b)  |  [E29] Interest on borrowed capital
r  30 : [D30] Sl. No.  |  [E30] Loan taken from  |  [F30] Name of the bank / Institution / Person from which the loan is taken  |  [G30] Loan Account number of the Bank/ Institution  |  [H30] Date of sanction of loan  |  [I30] Total amount of loan  |  [J30] Loan outstanding as on last date of financial year  |  [K30] Interest on Borrowed capital u/s 24(b)
r  31 : [E31] i  |  [F31] ii  |  [G31] iii  |  [H31] iv  |  [I31] v  |  [J31] vi  |  [K31] vii
r  36 : [D36] Total Interest on borrowed capital u/s 24(b)
r  37 : [E37] i  |  [F37] Total (1g+1h)  |  [J37] i
r  38 : [E38] j  |  [F38] Arrears/Unrealized Rent received during the year Less 30%  |  [J38] j
r  39 : [E39] k  |  [F39] Income from house property 1 (1f-1i + 1j)  |  [J39] k
r  40 : [F40] Address Of Property 2
r  41 : [D41] 1B  |  [F41] Address  |  [G41] Town/ City  |  [H41] State  |  [I41] Country  |  [J41] PIN Code  |  [K41] Zip Code
r  42 : [I42] 91-INDIA
r  43 : [F43] Owner of the Property (Please specify if others is selected )  |  [I43] Is the property co-owned?  |  [K43] Your percentage of share in the property%
r  44 : [F44] S.No  |  [G44] Name of Other Co-owner(s)  |  [H44] PAN of Other Co-owner(s)  |  [I44] Aadhaar No. of Other Co-owner(s)  |  [J44] Percentage share of other co-owner(s) in property (%)
r  52 : [F52] Type Of House Property?  |  [H52] (Select)
r  53 : [F53] S.No  |  [G53] Name(s) of Tenant (s) (if let out)  |  [H53] PAN of Tenant(s) (if available)  |  [I53] Aadhaar Number of Tenant (s)  |  [J53] PAN/TAN of Tenant(s) (if TDS credit is claimed)
r  57 : [E57] a  |  [F57] Gross rent received/ receivable/ lettable value during the year  |  [J57] a
r  58 : [E58] b  |  [F58] The amount of rent which cannot be realized
r  59 : [E59] c  |  [F59] Tax paid to local authorities
r  60 : [E60] d  |  [F60] Total (1b + 1c)
r  61 : [E61] e  |  [F61] Annual value (1a – 1d) (nil, if self -occupied etc. as per section 23(2)of the Act)  |  [J61] e
r  62 : [E62] f  |  [F62] Annual value of the property owned (own percentage share x 1e)  |  [J62] f
r  63 : [E63] g  |  [F63] 30% of Annual Value (30% *1f)
r  64 : [E64] h  |  [F64] Interest payable on borrowed capital
r  65 : [D65] Section 24(b)  |  [E65] Interest on borrowed capital
r  66 : [D66] Sl. No.  |  [E66] Loan taken from  |  [F66] Name of the bank / Institution / Person from which the loan is taken  |  [G66] Loan Account number of the Bank/ Institution  |  [H66] Date of sanction of loan  |  [I66] Total amount of loan  |  [J66] Loan outstanding as on last date of financial year  |  [K66] Interest on Borrowed capital u/s 24(b)
r  67 : [E67] i  |  [F67] ii  |  [G67] iii  |  [H67] iv  |  [I67] v  |  [J67] vi  |  [K67] vii
r  72 : [D72] Total Interest on borrowed capital u/s 24(b)
r  73 : [E73] i  |  [F73] Total (1g+1h)  |  [J73] i
r  74 : [E74] j  |  [F74] Arrears/Unrealized Rent received during the year Less 30%  |  [J74] j
r  75 : [E75] k  |  [F75] Income from house property 2 (1f – 1i + 1j)  |  [J75] k
r  76 : [C76] B2  |  [D76] Income chargeable under the head ‘House Property’ ( Ʃ1k ) (If loss, put the figure in negative) Note
r  77 : [C77] Note: Furnishing of PAN/ Aadhaar No. of tenant is mandatory, if tax is deducted under section 194-IB
```

## Appendix · Every dropdown value, verbatim

**Cells `G43 G7`** — source `HP.OwnerPropertyDropdown` — 5 values:
```
(Select) | Self | Minor | Spouse | Others
```

**Cells `I42 I6`** — source `CountList` — 251 values:
```
(Select) | 93-AFGHANISTAN | 1001-ALAND ISLANDS | 355-ALBANIA | 213-ALGERIA | 684-AMERICAN SAMOA | 376-ANDORRA | 244-ANGOLA | 1264-ANGUILLA | 1010-ANTARCTICA | 1268-ANTIGUA AND BARBUDA | 54-ARGENTINA | 374-ARMENIA | 297-ARUBA | 61-AUSTRALIA | 43-AUSTRIA | 994-AZERBAIJAN | 1242-BAHAMAS | 973-BAHRAIN | 880-BANGLADESH | 1246-BARBADOS | 375-BELARUS | 32-BELGIUM | 501-BELIZE | 229-BENIN | 1441-BERMUDA | 975-BHUTAN | 591-BOLIVIA (PLURINATIONAL STATE OF) | 1002-BONAIRE, SINT EUSTATIUS AND SABA | 387-BOSNIA AND HERZEGOVINA | 267-BOTSWANA | 1003-BOUVET ISLAND | 55-BRAZIL | 1014-BRITISH INDIAN OCEAN TERRITORY | 673-BRUNEI DARUSSALAM | 359-BULGARIA | 226-BURKINA FASO | 257-BURUNDI | 238-CABO VERDE | 855-CAMBODIA | 237-CAMEROON | 1-CANADA | 1345-CAYMAN ISLANDS | 236-CENTRAL AFRICAN REPUBLIC | 235-CHAD | 56-CHILE | 86-CHINA | 9-CHRISTMAS ISLAND | 672-COCOS (KEELING) ISLANDS | 57-COLOMBIA | 270-COMOROS | 242-CONGO | 243-CONGO (DEMOCRATIC REPUBLIC OF THE) | 682-COOK ISLANDS | 506-COSTA RICA | 225-CÔTE D'IVOIRE | 385-CROATIA | 53-CUBA | 1015-CURAÇAO | 357-CYPRUS | 420-CZECHIA | 45-DENMARK | 253-DJIBOUTI | 1767-DOMINICA | 1809-DOMINICAN REPUBLIC | 593-ECUADOR | 20-EGYPT | 503-EL SALVADOR | 240-EQUATORIAL GUINEA | 291-ERITREA | 372-ESTONIA | 251-ETHIOPIA | 500-FALKLAND ISLANDS (MALVINAS) | 298-FAROE ISLANDS | 679-FIJI | 358-FINLAND | 33-FRANCE | 594-FRENCH GUIANA | 689-FRENCH POLYNESIA | 1004-FRENCH SOUTHERN TERRITORIES | 241-GABON | 220-GAMBIA | 995-GEORGIA | 49-GERMANY | 233-GHANA | 350-GIBRALTAR | 30-GREECE | 299-GREENLAND | 1473-GRENADA | 590-GUADELOUPE | 1671-GUAM | 502-GUATEMALA | 1481-GUERNSEY | 224-GUINEA | 245-GUINEA-BISSAU | 592-GUYANA | 509-HAITI | 1005-HEARD ISLAND AND MCDONALD ISLANDS | 6-HOLY SEE | 504-HONDURAS | 852-HONG KONG | 36-HUNGARY | 354-ICELAND | 91-INDIA | 62-INDONESIA | 98-IRAN (ISLAMIC REPUBLIC OF) | 964-IRAQ | 353-IRELAND | 1624-ISLE OF MAN | 972-ISRAEL | 5-ITALY | 1876-JAMAICA | 81-JAPAN | 1534-JERSEY | 962-JORDAN | 7-KAZAKHSTAN | 254-KENYA | 686-KIRIBATI | 850-KOREA (DEMOCRATIC PEOPLE'S REPUBLIC OF) | 82-KOREA (REPUBLIC OF) | 965-KUWAIT | 996-KYRGYZSTAN | 856-LAO PEOPLE'S DEMOCRATIC REPUBLIC | 371-LATVIA | 961-LEBANON | 266-LESOTHO | 231-LIBERIA | 218-LIBYA | 423-LIECHTENSTEIN | 370-LITHUANIA | 352-LUXEMBOURG | 853-MACAO | 389-MACEDONIA (THE FORMER YUGOSLAV REPUBLIC OF) | 261-MADAGASCAR | 265-MALAWI | 60-MALAYSIA | 960-MALDIVES | 223-MALI | 356-MALTA | 692-MARSHALL ISLANDS | 596-MARTINIQUE | 222-MAURITANIA | 230-MAURITIUS | 269-MAYOTTE | 52-MEXICO | 691-MICRONESIA (FEDERATED STATES OF) | 373-MOLDOVA (REPUBLIC OF) | 377-MONACO | 976-MONGOLIA | 382-MONTENEGRO | 1664-MONTSERRAT | 212-MOROCCO | 258-MOZAMBIQUE | 95-MYANMAR | 264-NAMIBIA | 674-NAURU | 977-NEPAL | 31-NETHERLANDS | 687-NEW CALEDONIA | 64-NEW ZEALAND | 505-NICARAGUA | 227-NIGER | 234-NIGERIA | 683-NIUE | 15-NORFOLK ISLAND | 1670-NORTHERN MARIANA ISLANDS | 47-NORWAY | 968-OMAN | 92-PAKISTAN | 680-PALAU | 970-PALESTINE, STATE OF | 507-PANAMA | 675-PAPUA NEW GUINEA | 595-PARAGUAY | 51-PERU | 63-PHILIPPINES | 1011-PITCAIRN | 48-POLAND | 14-PORTUGAL | 1787-PUERTO RICO | 974-QATAR | 262-RÉUNION | 40-ROMANIA | 8-RUSSIAN FEDERATION | 250-RWANDA | 1006-SAINT BARTHÉLEMY | 290-SAINT HELENA, ASCENSION AND TRISTAN DA CUNHA | 1869-SAINT KITTS AND NEVIS | 1758-SAINT LUCIA | 1007-SAINT MARTIN (FRENCH PART) | 508-SAINT PIERRE AND MIQUELON | 1784-SAINT VINCENT AND THE GRENADINES | 685-SAMOA | 378-SAN MARINO | 239-SAO TOME AND PRINCIPE | 966-SAUDI ARABIA | 221-SENEGAL | 381-SERBIA | 248-SEYCHELLES | 232-SIERRA LEONE | 65-SINGAPORE | 1721-SINT MAARTEN (DUTCH PART) | 421-SLOVAKIA | 386-SLOVENIA | 677-SOLOMON ISLANDS | 252-SOMALIA | 28-SOUTH AFRICA | 1008-SOUTH GEORGIA AND THE SOUTH SANDWICH ISLANDS | 211-SOUTH SUDAN | 35-SPAIN | 94-SRI LANKA | 249-SUDAN | 597-SURINAME | 1012-SVALBARD AND JAN MAYEN | 268-SWAZILAND | 46-SWEDEN | 41-SWITZERLAND | 963-SYRIAN ARAB REPUBLIC | 886-TAIWAN | 992-TAJIKISTAN | 255-TANZANIA, UNITED REPUBLIC OF | 66-THAILAND | 670-TIMOR-LESTE (EAST TIMOR) | 228-TOGO | 690-TOKELAU | 676-TONGA | 1868-TRINIDAD AND TOBAGO | 216-TUNISIA | 90-TURKEY | 993-TURKMENISTAN | 1649-TURKS AND CAICOS ISLANDS | 688-TUVALU | 256-UGANDA | 380-UKRAINE | 971-UNITED ARAB EMIRATES | 44-UNITED KINGDOM OF GREAT BRITAIN AND NORTHERN IRELAND | 2-UNITED STATES OF AMERICA | 1009-UNITED STATES MINOR OUTLYING ISLANDS | 598-URUGUAY | 998-UZBEKISTAN | 678-VANUATU | 58-VENEZUELA (BOLIVARIAN REPUBLIC OF) | 84-VIET NAM | 1284-VIRGIN ISLANDS (BRITISH) | 1340-VIRGIN ISLANDS (U.S.) | 681-WALLIS AND FUTUNA | 1013-WESTERN SAHARA | 967-YEMEN | 260-ZAMBIA | 263-ZIMBABWE | 9999-OTHERS
```

**Cells `H52 H16`** — source `"(Select),Self Occupied, Let Out, Deemed Let Out"` — 4 values:
```
(Select) | Self Occupied | Let Out | Deemed Let Out
```

**Cells `J7 J43`** — source `PortugueseCode` — 3 values:
```
(Select) | Yes | No
```

**Cells `H42 H6`** — source `StateList` — 39 values:
```
(Select) | 01-ANDAMAN AND NICOBAR ISLANDS | 02-ANDHRA PRADESH | 03-ARUNACHAL PRADESH | 04-ASSAM | 05-BIHAR | 06-CHANDIGARH | 07-DADRA NAGAR AND HAVELI | 08-DAMAN AND DIU | 09-DELHI | 10-GOA | 11-GUJARAT | 12-HARYANA | 13-HIMACHAL PRADESH | 14-JAMMU AND KASHMIR | 15-KARNATAKA | 16-KERALA | 17-LAKHSWADEEP | 18-MADHYA PRADESH | 19-MAHARASHTRA | 20-MANIPUR | 21-MEGHALAYA | 22-MIZORAM | 23-NAGALAND | 24-ODISHA | 25-PUDUCHERRY | 26-PUNJAB | 27-RAJASTHAN | 28-SIKKIM | 29-TAMILNADU | 30-TRIPURA | 31-UTTAR PRADESH | 32-WEST BENGAL | 33-CHHATTISGARH | 34-UTTARAKHAND | 35-JHARKHAND | 36-TELANGANA | 37-LADAKH | 99-FOREIGN
```

**Cells `E32:E35 E68:E71`** — source `"(Select),Bank , Other than Bank"` — 3 values:
```
(Select) | Bank | Other than Bank
```

