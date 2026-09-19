# The book of Schedule HP — Income from House Property · ITR-6, A.Y. 2026-27

Read row by row from the utility's **HOUSE PROPERTY** sheet (rows 3–76, both
shipped property blocks, every dropdown, every formula and the helper P-column)
and confirmed against the CBDT ITR-6 schema's `ScheduleHP` block and the ITR-6
validation-rules document (rules A175–A194, A198, A503, A526, A704, A750). The
VBA (`vbaProject.bin`) is compressed; only its searchable named-range and macro
strings were read (`AddProperty`, `AddHP`, `CoOwner`, `Tenant`, `24b`, and the
`HP.*` named ranges) — see §11. Nothing here is invented.

This is a **company** return, so two things differ from ITR-2's House Property
and drive the whole schedule: **the owner can only be the company itself or a
deemed owner (no minor / spouse / others), and a property can only be Let Out
or Deemed Let Out (no self-occupied)** — a company cannot occupy a residence.

---

## 1 · The shape — one block per property, then two lines

Schedule HP is a **repeating block**. The sheet ships two property blocks —
rows 4–36 (property 1) and rows 37–69 (property 2) — and the VBA adds more
(`AddProperty`). The schema's `PropertyDetails` array is **unlimited**. After
the last block come two whole-head lines.

| Part | What it is |
|---|---|
| **1 (block per property)** | address, ownership, co-owners, type, tenants, the rent working a–k, the section 24(b) loan table, the property's income |
| **2** | Pass through income/loss if any — from Schedule PTI (schema `PassThroghIncome`, marked **A** in the sheet's K column) |
| **3** | **Income under the head "Income from house property" (Ʃ1K+2)** — *if negative take the figure to 2i of schedule CYLA* (schema `TotalIncomeChargeableUnHP`, marked **B** in the K column) |

There is no separate "Schedule 24(b)" — the loan table sits **inside each
property block**, one table per property, feeding item h.

---

## 2 · One property block, field by field

### Block header — the property (rows 4–5, 37–38)

| Label (as on the sheet) | Type | Schema key | Rule |
|---|---|---|---|
| **Address of property (NOTE : DO NOT LEAVE ADDRESS BLANK )** | text | `AddressDetailWithZipCode.AddrDetail` | required |
| **Town/ City** | text | `AddressDetailWithZipCode.CityOrTownOrDistrict` | required |
| **State** | dropdown, 38 codes (§10) | `AddressDetailWithZipCode.StateCode` | required; `99-Foreign` for a property abroad |
| **Country** | dropdown, 251 codes (§10) | `AddressDetailWithZipCode.CountryCode` | required |
| **PIN Code** | 6 digits | `AddressDetailWithZipCode.PinCode` | for India |
| **Zip Code** | text | `AddressDetailWithZipCode.ZipCode` | for a property abroad |

### Ownership (rows 6–13, 39–46)

| Label | Options | Schema key | Rule |
|---|---|---|---|
| **Owner of the Property** | dropdown: **Self · Deemed Owner** — schema `SE` / `DO` | `PropertyOwner` | required |
| **Is the property co-owned?** | dropdown: **Yes · No** — schema `YES` / `NO` | `PropCoOwnedFlg` | required |
| **Assessee's percentage of share in the property (%)** | computed number | `AssessePercentShareProp` | see formula below |

The assessee's share (cell I7 / I40) is **computed**, not typed:
`= IF(MID(CoOwned,1,1)="Y", 100 − SUM(co-owners' shares), IF(="N", 100, 0))`.
So for a property that is not co-owned it is **100**; for a co-owned property it
is 100 minus the sum of the other co-owners' shares.

**Co-owners table** (rows 8–13, 41–46) — opens on "Yes", one row per other
co-owner, **unlimited** (5 rows shipped per block, S.No auto-increments `F10=F9+1`):

| Column label | Schema key | Rule |
|---|---|---|
| **S.No** | `CoOwners[].CoOwnersSNo` | required, auto |
| **Name of other co-owner(s)** | `CoOwners[].NameCoOwner` | required |
| **PAN of other co-owner(s)** | `CoOwners[].PAN_CoOwner` | required when co-owned (A176); cannot equal the assessee's own PAN (A189) |
| **Aadhar of Other Co-owner(s)** | `CoOwners[].Aadhaar_CoOwner` | PAN **or** Aadhaar must be given (A176) |
| **Percentage share of other co-owner(s) in property (%)** | `CoOwners[].PercentShareProperty` | each < 100 (A192); all shares + assessee's = 100 (A176) |

### Type of house property (rows 14, 47)

| Label | Options | Schema key | Rule |
|---|---|---|---|
| **Type of House property** | dropdown: **Let Out · Deemed Let Out** — schema `Y` / `D` | `ifLetOut` | required |

**There is no "Self Occupied" option on ITR-6** — a company cannot self-occupy a
residence, so the annual value is never nil under section 23(2). The only two
answers are Let Out (`Y`) and Deemed Let Out (`D`). This is the single largest
difference from ITR-2's House Property (which has S / L / D).

**Tenants table** (rows 15–17, 48–50) — one row per tenant, **unlimited**
(S.No auto-increments `F17=F16+1`):

| Column label | Schema key | Rule |
|---|---|---|
| **S.NO** | `TenantDetails[].TenantSNo` | required, auto |
| **NAME(S) OF TENANTS(S) (IF LET OUT)** | `TenantDetails[].NameofTenant` | |
| **PAN of Tenants (if available)** | `TenantDetails[].PANofTenant` | |
| **Aadhar of Tenants (If available)** | `TenantDetails[].AadhaarofTenant` | |
| **PAN/TAN of Tenant(s) (if TDS credit is claimed)** | `TenantDetails[].PANTANofTenant` | mandatory if TDS is deducted — see the note at row 76 |

Row 76 note (verbatim): **"NOTE: Furnishing PAN/Aadhaar of tenant is mandatory,
if tax is deducted under section 194-IB. Furnishing TAN of tenant is mandatory,
if tax is deducted under section 194-I."**

### The rent working — items a to k (rows 18–36, 51–69)

Schema block `Rentdetails`. Item numbers are the sheet's own a–k and the rules
document's Sl. No. 1a … 1k.

| Item | Label (verbatim) | Kind | Schema key | Formula / derivation |
|---|---|---|---|---|
| **a** | **Gross rent received or receivable or lettable value** | amount | `Rentdetails.AnnualLetableValue` | typed; **cannot be 0** for Let Out / Deemed Let Out (A181) |
| **b** | **The amount of rent which cannot be realized** | amount | `Rentdetails.RentNotRealized` | typed; ≤ 1a (A194) |
| **c** | **Tax paid to local authorities** | amount | `Rentdetails.LocalTaxes` | typed; disallowed if 1a is 0/null (A179) |
| **d** | **Total (1b + 1c)** | computed | `Rentdetails.TotalUnrealizedAndTax` | `J21 = SUM(J19:J20)` → 1d = 1b + 1c (A183) |
| **e** | **Annual value(1a – 1d)** | computed | `Rentdetails.BalanceALV` | `L22 = MAX(0, L18 − J21)` → 1e = 1a − 1d (A182) |
| **f** | **Annual value of the property owned (own percentage share x 1e)** | computed | `Rentdetails.AnnualOfPropOwned` | `L23 = MAX(0, ROUND(L22 × I7/100, 0))` → 1f = 1e × share% (A177) |
| **g** | **30% of 1f** | computed | `Rentdetails.ThirtyPercentOfBalance` | `J24 = MAX(ROUND(0.3 × 1f, 0), 0)` → standard deduction u/s 24(a) = 30% of annual value (A175) |
| **h** | **Interest payable on borrowed capital** | computed from the 24(b) table | `Rentdetails.IntOnBorwCap` | `J25 = MAX(0, IF(AND(share%>0, 1a>0), Total 24(b) interest, 0))` — interest allowed only if share > 0 and annual value > 0 (A178). The sheet's note on this line: *"Cannot Exceed 2 lacs if not let out"* |
| **i** | **Total (1g +1h)** | computed | `Rentdetails.TotalDeduct` | `L34 = SUM(J24:J25)` → 1i = 1g + 1h (A184) |
| **j** | **Arrears/Unrealized Rent received during the year Less 30%** | amount | `Rentdetails.ArrearsUnrealizedRentRcvd` | typed net of 30% |
| **k** | **Income from house property (1f-1i+1j)** | computed | `Rentdetails.IncomeOfHP` | `L36 = L23 − L34 + L35` → 1k = 1f − 1i + 1j (A185) |

### Section 24(b) — interest on borrowed capital, one table per property (rows 26–33, 59–66)

Rows: **Section 24(b) · Interest on borrowed capital**. The loan table that
feeds item h. 4 rows shipped per property (Sl. No. auto-increments `D30=D29+1`),
**unlimited**. Schema block `Rentdetails.Section24B.Section24BDtls[]`.

| Column (sheet lettering i–vii) | Label (verbatim) | Schema key | Rule |
|---|---|---|---|
| (Sl. No.) | **Sl. No.** | — | auto |
| **i** | **Loan taken from** | `Section24BDtls[].LoanTknFrom` | dropdown: **Bank · Other than Bank** — schema `B` / `I` |
| **ii** | **Name of the bank / Institution / Person from which the loan is taken** | `Section24BDtls[].BankOrInstnName` | required |
| **iii** | **Loan Account number of the Bank/ Institution** | `Section24BDtls[].LoanAccNoOfBankOrInstnRefNo` | required |
| **iv** | **Date of sanction of loan** | `Section24BDtls[].DateofLoan` | `DD/MM/YYYY`, required |
| **v** | **Total amount of loan** | `Section24BDtls[].TotalLoanAmt` | required |
| **vi** | **Loan outstanding as on last date of financial year** | `Section24BDtls[].LoanOutstndngAmt` | required — on 31 March 2026 |
| **vii** | **Interest on Borrowed capital u/s 24(b)** | `Section24BDtls[].InterestUs24B` | required — the year's interest on this loan |
| (total) | **Total Interest on borrowed capital u/s 24(b)** | `Section24B.TotalInterestUs24B` | computed `K33 = SUM(Intrst.24b)` — feeds item h; individual rows must sum to it (A191) |

Every column of every loan row is required — the schema marks all seven of the
`Section24BDtls` item required.

---

## 3 · The rules the working enforces (from the rules document, by serial)

- **A175** — Standard deduction (item g) = **30% of the annual value** (1f).
- **A176 / A189** — Co-owned: assessee's + all co-owners' shares = 100%; each
  co-owner's PAN or Aadhaar must be given; a co-owner's PAN **cannot equal** the
  assessee's own PAN.
- **A177** — 1f = own percentage share × annual value (1e).
- **A178** — If the assessee's share is zero, interest on borrowed capital
  (item h) cannot be more than zero. (Enforced by the `AND(share%>0, …)` guard.)
- **A179** — If the annual lettable value (1a) is zero/null, municipal tax
  (item c) cannot be claimed.
- **A180** — The head total (item 3) must equal the total of the individual
  property values.
- **A181** — If type is Let Out or Deemed Let Out, gross rent at Sl. No. "a"
  cannot be 0. (On ITR-6 every property is one of these two.)
- **A182 / A183 / A184 / A185 / A190** — the arithmetic of the working:
  1e = 1a − 1d · 1d = 1b + 1c · 1i = 1g + 1h · 1k = 1f − 1i + 1j · 3 = Σ1k + 2.
- **A186** — Item 2 (pass-through) = the net income/loss of HP in Schedule PTI.
- **A187** — **Standard deduction u/s 24(a) is not allowed if the company has
  opted for taxation u/s 115BAB.**
- **A188** — **Interest u/s 24(b) is not allowed if the company has opted for
  taxation u/s 115BAB.**
- **A192** — If co-owned = Yes, each other co-owner's share < 100%.
- **A193** — If not co-owned, the assessee's share = 100%.
- **A194** — Rent which cannot be realised (1b) ≤ gross rent (1a).

### The 115BAB restriction — the ITR-6 analogue of ITR-2's new-regime bar
Where ITR-2 disallows the house-property working under the individual's new
regime (115BAC), ITR-6 disallows **both the 30% standard deduction (24(a)) and
the interest (24(b))** when the company has opted for the manufacturing-company
concessional rate under **section 115BAB** (rules A187, A188). The utility reads
the chosen filing section from `sheet1.ReturnFileSec` (helper cell `P22 =
MID(sheet1.ReturnFileSec,1,6)`) and drives this from it.

### The loss cap — section 71(3A), computed on the helper P-column
Column P (helper columns are rules) computes the ₹2,00,000 set-off cap:
- `P70 = IF(TotalIncomeChargeableUnHP < 0, MAX(TotalIncomeChargeableUnHP, −200000), 0)`
  — the house-property loss allowed to be set off this year (capped at ₹2 lakh),
  which goes to **2i of Schedule CYLA** (A503).
- `P71 = MAX(0, (−TotalIncomeChargeableUnHP − 200000))` — the excess loss beyond
  ₹2 lakh, carried forward under Schedule CFL.

---

## 4 · Item 2 — Pass through income/loss if any

**Pass through income/loss if any *** — one figure (schema `PassThroghIncome`,
marked **A** in the K column). Income or loss from a business trust or
investment fund that is house property in nature, taken from Schedule PTI
(A186).

## 5 · Item 3 — Income under the head

**Income under the head "Income from house property" (Ʃ1K+2)** — Σ1k across all
properties + item 2 (schema `TotalIncomeChargeableUnHP`; the only field the
schema marks required on `ScheduleHP` itself). *If negative, the figure goes to
2i of Schedule CYLA* (A503, A526). It also feeds **item 1 of Part B-TI** (A750)
and is the base for any foreign tax relief in Schedule FSI (A704).

---

## 6 · How many can be added

| Where | Repeatable? |
|---|---|
| **Property blocks** | **yes — unlimited** (the sheet ships 2, the VBA `AddProperty` adds more, the schema `PropertyDetails[]` has no maximum) |
| Co-owners inside a block | **yes, unlimited** (5 rows shipped) |
| Tenants inside a block | **yes, unlimited** |
| Section 24(b) loans inside a block | **yes, unlimited** (4 rows shipped) |
| Item 2 pass-through | one figure |

---

## 7 · What is mandatory

**On every property** (schema `required` on a `PropertyDetails` item):
serial (`HPSNo`) · address · city · state · country · owner · co-owned flag ·
assessee's percentage share · type (`ifLetOut`, Y/D) · and in the rent working:
annual lettable value · rent not realized · local taxes · total of unrealised
and tax · balance ALV · annual value of the property owned · 30% · interest on
borrowed capital · total deductions · arrears/unrealised rent · income of the
property.

**On every co-owner row:** serial and name (`CoOwnersSNo`, `NameCoOwner`).
**On every tenant row:** serial (`TenantSNo`).
**On every loan row:** all seven columns of `Section24BDtls`, plus
`TotalInterestUs24B`.
**On the schedule:** `TotalIncomeChargeableUnHP`.

Everything else — PIN/Zip, PAN/Aadhaar of co-owners and tenants, the PAN/TAN for
a TDS claim, pass-through — is written only when it carries a value.

---

## 8 · What ITR-6's House Property has (or lacks) versus ITR-2's

| | ITR-2 | ITR-6 |
|---|---|---|
| Owner of the property | Self / Minor / Spouse / Others (+specify) | **Self / Deemed Owner only** — no minor, spouse, others |
| Type of property | Self Occupied / Let Out / Deemed Let Out (S/L/D) | **Let Out / Deemed Let Out only (Y/D)** — no self-occupied |
| Section 23(2) nil annual value | applies to self-occupied | **never** — no self-occupied on a company |
| Regime bar on the working | new regime 115BAC disallows the loss | **115BAB disallows both 24(a) and 24(b)** (A187/A188) |
| Number of properties | unlimited | unlimited |
| Co-owners / tenants / 24(b) tables | full tables | full tables (identical shape) |
| Pass-through (item 2) | present | present |

---

## 9 · What this means for the build

1. **One collapsible block per property, unlimited**, each with a dustbin,
   collapsing to *"Property 1 — address · Let out · ₹45,600"*.
2. **Type is Let Out / Deemed Let Out only** — no self-occupied branch, so the
   full a–k working always runs and gross rent (1a) is always required > 0.
3. **Owner is Self / Deemed Owner only** — no minor/spouse/others "specify"
   field.
4. **The 24(b) loan table lives inside the block**, all seven columns mandatory
   per row, summing into item h; interest is admitted only when share% > 0 and
   1a > 0.
5. **Co-owners and tenants are tables inside the block**, opening on the
   co-owned answer and populated for a let-out property; the assessee's share
   (I7/I40) is computed = 100 − Σ(co-owners' shares).
6. **The share is applied at f, not at a** — rent, unrealised rent and local
   taxes are entered in full for the property; the share bites once at item f.
7. **115BAB switches off the working** — when the company files under 115BAB,
   both the 30% deduction and the 24(b) interest are disallowed (read
   `sheet1.ReturnFileSec`).
8. **The loss goes to CYLA 2i with the ₹2 lakh cap** (helper P70) and the excess
   to CFL (helper P71); the head total feeds Part B-TI item 1.

---

## 10 · The dropdowns (every value, for the seed and the enum)

### Owner of the Property (`PropertyOwner`)
`(Select)` · **Self** (`SE`) · **Deemed Owner** (`DO`). *(Schema description
reads "Deemed Ownwer" — a typo in the source schema; see §12.)*

### Is the property co-owned? (`PropCoOwnedFlg`)
`(Select)` · **Yes** (`YES`) · No (`NO`).

### Type of House property (`ifLetOut`)
`(Select)` · **Let Out** (`Y`) · **Deemed Let Out** (`D`).

### Loan taken from (`LoanTknFrom`)
`(Select)` · **Bank** (`B`) · **Other than Bank** (`I`).

### State (`StateCode`) — 38 entries
`(Select)` · 01-Andaman and Nicobar islands · 02-Andhra Pradesh ·
03-Arunachal Pradesh · 04-Assam · 05-Bihar · 06-Chandigarh ·
07-The Dadra And Nagar Haveli And Daman And Diu · 09-Delhi · 10-Goa ·
11-Gujarat · 12-Haryana · 13-Himachal Pradesh · 14-Jammu and Kashmir ·
15-Karnataka · 16-Kerala · 17-Lakshadweep · 18-Madhya Pradesh · 19-Maharashtra ·
20-Manipur · 21-Meghalaya · 22-Mizoram · 23-Nagaland · 24-Odisha ·
25-Puducherry · 26-Punjab · 27-Rajasthan · 28-Sikkim · 29-Tamil Nadu ·
30-Tripura · 31-Uttar Pradesh · 32-West Bengal · 33-Chattisgarh ·
34-Uttarakhand · 35-Jharkhand · 36-Telangana · 37-Ladakh · 99-Foreign.

### Country (`CountryCode`) — 251 entries
`(select)` · 93-AFGHANISTAN · 1001-ALAND ISLANDS · 355-ALBANIA · 213-ALGERIA ·
684-AMERICAN SAMOA · 376-ANDORRA · 244-ANGOLA · 1264-ANGUILLA · 1010-ANTARCTICA ·
1268-ANTIGUA AND BARBUDA · 54-ARGENTINA · 374-ARMENIA · 297-ARUBA ·
61-AUSTRALIA · 43-AUSTRIA · 994-AZERBAIJAN · 1242-BAHAMAS · 973-BAHRAIN ·
880-BANGLADESH · 1246-BARBADOS · 375-BELARUS · 32-BELGIUM · 501-BELIZE ·
229-BENIN · 1441-BERMUDA · 975-BHUTAN · 591-BOLIVIA (PLURINATIONAL STATE OF) ·
1002-BONAIRE, SINT EUSTATIUS AND SABA · 387-BOSNIA AND HERZEGOVINA ·
267-BOTSWANA · 1003-BOUVET ISLAND · 55-BRAZIL ·
1014-BRITISH INDIAN OCEAN TERRITORY · 673-BRUNEI DARUSSALAM · 359-BULGARIA ·
226-BURKINA FASO · 257-BURUNDI · 238-CABO VERDE · 855-CAMBODIA · 237-CAMEROON ·
1-CANADA · 1345-CAYMAN ISLANDS · 236-CENTRAL AFRICAN REPUBLIC · 235-CHAD ·
56-CHILE · 86-CHINA · 9-CHRISTMAS ISLAND · 672-COCOS (KEELING) ISLANDS ·
57-COLOMBIA · 270-COMOROS · 242-CONGO · 243-CONGO (DEMOCRATIC REPUBLIC OF THE) ·
682-COOK ISLANDS · 506-COSTA RICA · 225-COTE DIVOIRE · 385-CROATIA · 53-CUBA ·
1015-CURACAO · 357-CYPRUS · 420-CZECHIA · 45-DENMARK · 253-DJIBOUTI ·
1767-DOMINICA · 1809-DOMINICAN REPUBLIC · 593-ECUADOR · 20-EGYPT ·
503-EL SALVADOR · 240-EQUATORIAL GUINEA · 291-ERITREA · 372-ESTONIA ·
251-ETHIOPIA · 500-FALKLAND ISLANDS (MALVINAS) · 298-FAROE ISLANDS · 679-FIJI ·
358-FINLAND · 33-FRANCE · 594-FRENCH GUIANA · 689-FRENCH POLYNESIA ·
1004-FRENCH SOUTHERN TERRITORIES · 241-GABON · 220-GAMBIA · 995-GEORGIA ·
49-GERMANY · 233-GHANA · 350-GIBRALTAR · 30-GREECE · 299-GREENLAND ·
1473-GRENADA · 590-GUADELOUPE · 1671-GUAM · 502-GUATEMALA · 1481-GUERNSEY ·
224-GUINEA · 245-GUINEA-BISSAU · 592-GUYANA · 509-HAITI ·
1005-HEARD ISLAND AND MCDONALD ISLANDS · 6-HOLY SEE · 504-HONDURAS ·
852-HONG KONG · 36-HUNGARY · 354-ICELAND · 91-INDIA · 62-INDONESIA ·
98-IRAN (ISLAMIC REPUBLIC OF) · 964-IRAQ · 353-IRELAND · 1624-ISLE OF MAN ·
972-ISRAEL · 5-ITALY · 1876-JAMAICA · 81-JAPAN · 1534-JERSEY · 962-JORDAN ·
7-KAZAKHSTAN · 254-KENYA · 686-KIRIBATI ·
850-KOREA (DEMOCRATIC PEOPLES REPUBLIC OF) · 82-KOREA (REPUBLIC OF) ·
965-KUWAIT · 996-KYRGYZSTAN · 856-LAO PEOPLES DEMOCRATIC REPUBLIC · 371-LATVIA ·
961-LEBANON · 266-LESOTHO · 231-LIBERIA · 218-LIBYA · 423-LIECHTENSTEIN ·
370-LITHUANIA · 352-LUXEMBOURG · 853-MACAO ·
389-MACEDONIA (THE FORMER YUGOSLAV REPUBLIC OF) · 261-MADAGASCAR · 265-MALAWI ·
60-MALAYSIA · 960-MALDIVES · 223-MALI · 356-MALTA · 692-MARSHALL ISLANDS ·
596-MARTINIQUE · 222-MAURITANIA · 230-MAURITIUS · 269-MAYOTTE · 52-MEXICO ·
691-MICRONESIA (FEDERATED STATES OF) · 373-MOLDOVA (REPUBLIC OF) · 377-MONACO ·
976-MONGOLIA · 382-MONTENEGRO · 1664-MONTSERRAT · 212-MOROCCO · 258-MOZAMBIQUE ·
95-MYANMAR · 264-NAMIBIA · 674-NAURU · 977-NEPAL · 31-NETHERLANDS ·
687-NEW CALEDONIA · 64-NEW ZEALAND · 505-NICARAGUA · 227-NIGER · 234-NIGERIA ·
683-NIUE · 15-NORFOLK ISLAND · 1670-NORTHERN MARIANA ISLANDS · 47-NORWAY ·
968-OMAN · 92-PAKISTAN · 680-PALAU · 970-PALESTINE, STATE OF · 507-PANAMA ·
675-PAPUA NEW GUINEA · 595-PARAGUAY · 51-PERU · 63-PHILIPPINES · 1011-PITCAIRN ·
48-POLAND · 14-PORTUGAL · 1787-PUERTO RICO · 974-QATAR · 262-REUNION ·
40-ROMANIA · 8-RUSSIAN FEDERATION · 250-RWANDA · 1006-SAINT BARTHELEMY ·
290-SAINT HELENA, ASCENSION AND TRISTAN DA CUNHA · 1869-SAINT KITTS AND NEVIS ·
1758-SAINT LUCIA · 1007-SAINT MARTIN (FRENCH PART) ·
508-SAINT PIERRE AND MIQUELON · 1784-SAINT VINCENT AND THE GRENADINES ·
685-SAMOA · 378-SAN MARINO · 239-SAO TOME AND PRINCIPE · 966-SAUDI ARABIA ·
221-SENEGAL · 381-SERBIA · 248-SEYCHELLES · 232-SIERRA LEONE · 65-SINGAPORE ·
1721-SINT MAARTEN (DUTCH PART) · 421-SLOVAKIA · 386-SLOVENIA ·
677-SOLOMON ISLANDS · 252-SOMALIA · 28-SOUTH AFRICA ·
1008-SOUTH GEORGIA AND THE SOUTH SANDWICH ISLANDS · 211-SOUTH SUDAN · 35-SPAIN ·
94-SRI LANKA · 249-SUDAN · 597-SURINAME · 1012-SVALBARD AND JAN MAYEN ·
268-SWAZILAND · 46-SWEDEN · 41-SWITZERLAND · 963-SYRIAN ARAB REPUBLIC ·
886-TAIWAN · 992-TAJIKISTAN · 255-TANZANIA, UNITED REPUBLIC OF · 66-THAILAND ·
670-TIMOR-LESTE(EAST TIMOR) · 228-TOGO · 690-TOKELAU · 676-TONGA ·
1868-TRINIDAD AND TOBAGO · 216-TUNISIA · 90-TURKEY · 993-TURKMENISTAN ·
1649-TURKS AND CAICOS ISLANDS · 688-TUVALU · 256-UGANDA · 380-UKRAINE ·
971-UNITED ARAB EMIRATES ·
44-UNITED KINGDOM OF GREAT BRITAIN AND NORTHERN IRELAND ·
2-UNITED STATES OF AMERICA · 1009-UNITED STATES MINOR OUTLYING ISLANDS ·
598-URUGUAY · 998-UZBEKISTAN · 678-VANUATU ·
58-VENEZUELA (BOLIVARIAN REPUBLIC OF) · 84-VIET NAM ·
1284-VIRGIN ISLANDS (BRITISH) · 1340-VIRGIN ISLANDS (U.S.) ·
681-WALLIS AND FUTUNA · 1013-WESTERN SAHARA · 967-YEMEN · 260-ZAMBIA ·
263-ZIMBABWE · 9999-OTHERS.

---

## 11 · Sources read, and what was unreadable

- **Utility sheet HOUSE PROPERTY** — rows 3–76, all visible (no hidden rows in
  this sheet), read with labels, formulas, dropdowns and the helper P-column.
- **Schema** — `ScheduleHP` block, all leaf keys (§12), enum codes.
- **Rules document** — A175–A194, A198, A503, A526, A704, A750.
- **VBA (`vbaProject.bin`)** — the module stream is compressed; only searchable
  strings were recoverable, which confirm the repeat macros and named ranges
  (`AddProperty` ×15, `AddHP` ×6, `CoOwner` ×69, `Tenant` ×314, `24b` ×282,
  `Co.Share`, `Intrst.24b`, `AnnualLetableValue`, `SharePercent`,
  `IncomeOfHPInOwnHand`, `TotalIncomeChargeableUnHP`, `ReturnFileSec`,
  `115BAB` ×106). The decompiled macro bodies were **not readable** — the
  computation is taken from the visible cell formulas, not guessed from the VBA.

---

## 12 · Full schema key map (`ScheduleHP`)

Required keys marked *. Every live row above maps to one of these.

```
* PropertyDetails[].HPSNo                                                integer
* PropertyDetails[].AddressDetailWithZipCode.AddrDetail                  string
* PropertyDetails[].AddressDetailWithZipCode.CityOrTownOrDistrict        string
* PropertyDetails[].AddressDetailWithZipCode.StateCode                   string
* PropertyDetails[].AddressDetailWithZipCode.CountryCode                 string
  PropertyDetails[].AddressDetailWithZipCode.PinCode                     integer
  PropertyDetails[].AddressDetailWithZipCode.ZipCode                     string
* PropertyDetails[].PropertyOwner                                        string   (SE/DO)
* PropertyDetails[].PropCoOwnedFlg                                       string   (YES/NO)
* PropertyDetails[].AssessePercentShareProp                             number
  PropertyDetails[].CoOwners[].CoOwnersSNo                               integer  *
  PropertyDetails[].CoOwners[].NameCoOwner                               string   *
  PropertyDetails[].CoOwners[].PAN_CoOwner                               string
  PropertyDetails[].CoOwners[].Aadhaar_CoOwner                           string
  PropertyDetails[].CoOwners[].PercentShareProperty                      number
* PropertyDetails[].ifLetOut                                             string   (Y/D)
  PropertyDetails[].TenantDetails[].TenantSNo                            integer  *
  PropertyDetails[].TenantDetails[].NameofTenant                         string
  PropertyDetails[].TenantDetails[].PANofTenant                          string
  PropertyDetails[].TenantDetails[].AadhaarofTenant                      string
  PropertyDetails[].TenantDetails[].PANTANofTenant                       string
* PropertyDetails[].Rentdetails.AnnualLetableValue                       integer
* PropertyDetails[].Rentdetails.RentNotRealized                          integer
* PropertyDetails[].Rentdetails.LocalTaxes                               integer
* PropertyDetails[].Rentdetails.TotalUnrealizedAndTax                    integer
* PropertyDetails[].Rentdetails.BalanceALV                               integer
* PropertyDetails[].Rentdetails.AnnualOfPropOwned                        integer
* PropertyDetails[].Rentdetails.ThirtyPercentOfBalance                   integer
* PropertyDetails[].Rentdetails.IntOnBorwCap                             integer
* PropertyDetails[].Rentdetails.Section24B.Section24BDtls[].LoanTknFrom              string (B/I)
* PropertyDetails[].Rentdetails.Section24B.Section24BDtls[].BankOrInstnName          string
* PropertyDetails[].Rentdetails.Section24B.Section24BDtls[].LoanAccNoOfBankOrInstnRefNo string
* PropertyDetails[].Rentdetails.Section24B.Section24BDtls[].DateofLoan               string
* PropertyDetails[].Rentdetails.Section24B.Section24BDtls[].TotalLoanAmt             integer
* PropertyDetails[].Rentdetails.Section24B.Section24BDtls[].LoanOutstndngAmt         integer
* PropertyDetails[].Rentdetails.Section24B.Section24BDtls[].InterestUs24B            integer
* PropertyDetails[].Rentdetails.Section24B.TotalInterestUs24B                        integer
* PropertyDetails[].Rentdetails.TotalDeduct                             integer
* PropertyDetails[].Rentdetails.ArrearsUnrealizedRentRcvd               integer
* PropertyDetails[].Rentdetails.IncomeOfHP                              integer
  PassThroghIncome                                                      integer
* TotalIncomeChargeableUnHP                                             integer
```

### Inconsistencies noted across the three sources
1. **`LoanTknFrom` enum description is garbled in the schema** —
   `[["B","Bank, I: Other than Bank"],["I","Other than Bank"]]`. The B option's
   description has the I row's text merged into it. The utility dropdown is clean
   ("Bank" / "Other than Bank"); the codes B/I are correct.
2. **`PropertyOwner` schema description has a typo** — `"Deemed Ownwer"` (should
   read "Deemed Owner"); the utility dropdown reads "Deemed Owner". Code `DO`.
3. **No self-occupied on ITR-6** — the schema `ifLetOut` enum has only Y/D and
   the utility dropdown only Let Out / Deemed Let Out, agreeing with each other
   and against the individual forms; there is no "S" code here.
```
```

---

## 13 · Cross-sheet feeds

| Direction | From / To | What |
|---|---|---|
| **in** | Schedule PTI → HP item 2 | pass-through house-property income/loss (A186) |
| **in** | Schedule BP Sl. A3 → HP receipts | receipts reduced from BP and offered under HP (A198) |
| **out** | HP Sl. 3 → Schedule CYLA 2i | the head total; if a loss, capped at ₹2 lakh (A503, A526, helper P70/P71) |
| **out** | HP Sl. 3 → Part B-TI item 1 | Income from house property (A750) |
| **out** | HP Sl. 1k+2 → Schedule FSI | base for foreign tax relief on HP income (A704) |
