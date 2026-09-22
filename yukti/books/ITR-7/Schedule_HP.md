# The book of Schedule HP — Income from House Property · ITR-7, A.Y. 2026-27

Read row by row from the utility's **Schedule HP** sheet (rows 3–48, one shipped
property block, every dropdown and the a–j rent working), and confirmed against
the CBDT ITR-7 schema block **ScheduleHP** and the ITR-7 validation-rules
document (rules A179–A193, A360, A373, A383, A459, A485, A554, A592). Nothing
here is invented — Appendix A reproduces every schema leaf, Appendix B every live
row verbatim, Appendix C every dropdown value.

ITR-7 is the return for **trusts, institutions and other bodies** (sections
139(4A)–(4F)). House property income of such a body is computed head-by-head
exactly as for any other assessee, but two things narrow the sheet: **the owner
can only be the body itself or a deemed owner (Self / Deemed owner — no minor,
spouse or others), and a property can only be Let Out or Deemed Let Out (no
self-occupied)**.

---

## 1 · The shape — one block per property, then two lines

Schedule HP is a **repeating block**. The sheet ships one property block, and the
schema's `PropertyDetails` array is **unlimited**. After the last property block
come the whole-head lines.

| Part | What it is |
|---|---|
| **1 (block per property)** | address, ownership, co-owners, type of house property, tenants, the rent working a–j, the section 24(b) loan table, the property's income |
| **2** | **Pass through income/ loss if any \*** — from Schedule PTI (schema `PassThroghIncome`) |
| **3** | **Income under the head "Income from house property" (∑1j + 2)** — *if negative take the figure to 2i of Schedule CYLA* (schema `TotalIncomeChargeableUnHP`) |

There is no separate "Schedule 24(b)" — the loan table sits **inside each
property block**, one table per property, feeding item g.

---

## 2 · One property block, field by field

### Block header — the property (rows 4–5)

| Label (as on the sheet) | Type | Schema key | Rule |
|---|---|---|---|
| **Address of property 1** | text | `AddressDetailWithZipCode.AddrDetail` | required |
| **Town/ City** | text | `AddressDetailWithZipCode.CityOrTownOrDistrict` | required |
| **State** | dropdown, 38 codes (App. C) | `AddressDetailWithZipCode.StateCode` | required; `99-FOREIGN` for a property abroad |
| **Country** | dropdown, 251 codes (App. C) | `AddressDetailWithZipCode.CountryCode` | required |
| **PIN Code** | 6 digits | `AddressDetailWithZipCode.PinCode` | for India |
| **Zip Code** | text | `AddressDetailWithZipCode.ZipCode` | for a property abroad |

### Ownership (rows 6–14)

| Label | Options | Schema key | Rule |
|---|---|---|---|
| **Owner of the Property** | dropdown: **Self · Deemed owner** | `PropertyOwner` | required |
| **Is property co-owned? (if "YES" please enter following details)** | dropdown: **Yes · No** | `PropCoOwnedFlg` | required |
| **Assessee's percentage of share in the Property(%)** | number | `AssessePercentShareProp` | required; for a property not co-owned it is 100 |

**Co-owners table** (row 7 header, body rows 8–14) — opens on "Yes", one row per
other co-owner, **unlimited**:

| Column label | Schema key | Rule |
|---|---|---|
| **Sl. No** | `CoOwners[].CoOwnersSNo` | required, auto |
| **Name of Co-owner(s)** | `CoOwners[].NameCoOwner` | required |
| **PAN of Co-owner(s)** | `CoOwners[].PAN_CoOwner` | a co-owner's PAN cannot equal the assessee's own PAN (A190) |
| **Aadhaar Number of Co-owner(s)** | `CoOwners[].Aadhaar_CoOwner` | PAN or Aadhaar for each co-owner |
| **Percentage Share of co-owner(s) in Property(%)** | `CoOwners[].PercentShareProperty` | assessee's + all co-owners' shares = 100% (A188) |

### Type of house property (row 16)

| Label | Options | Schema key | Rule |
|---|---|---|---|
| **Type Of House Property** | dropdown: **Let Out · Deemed Let Out** | `ifLetOut` | required |

**There is no "Self Occupied" option** — the only two answers are Let Out and
Deemed Let Out, so the annual value is never nil and the full a–j working always
runs.

**Tenants table** (row 17 header, body rows 18–21) — one row per tenant,
**unlimited**:

| Column label | Schema key | Rule |
|---|---|---|
| **Sl. No.** | `TenantDetails[].TenantSNo` | required, auto |
| **Name(s) of Tenant (if let out)** | `TenantDetails[].NameofTenant` | required |
| **PAN of Tenant(s) (if available)** | `TenantDetails[].PANofTenant` | |
| **Aadhaar Number of tenant** | `TenantDetails[].AadhaarofTenant` | |
| **PAN / TAN of Tenant(s) (if TDS credit is claimed)** | `TenantDetails[].PANTANofTenant` | mandatory for a TDS claim — see the row-48 note |

Row 48 note (verbatim): **"Note: Furnishing PAN of tenant is mandatory if tax is
deducted under section 194-IB. Furnishing TAN of tenant is mandatory if tax is
deducted under section 194-I."**

### The rent working — items a to j (rows 23–40)

Schema block `Rentdetails`. Item numbers a–j are the sheet's own and the
rules document's Sl. No. 1a … 1j.

| Item | Label (verbatim) | Kind | Schema key | Formula / derivation |
|---|---|---|---|---|
| **a** | **Gross rent received or receivable or lettable value (higher of the two, if let out for whole of the year)** | amount | `Rentdetails.AnnualLetableValue` | typed; cannot be 0 for Let Out / Deemed Let Out (A186) |
| **b** | **The amount of rent which cannot be realized** | amount | `Rentdetails.RentNotRealized` | typed |
| **c** | **Tax paid to local authorities** | amount | `Rentdetails.LocalTaxes` | typed; disallowed if 1a is 0/null (A185) |
| **d** | **Total (1b +1c)** | computed | `Rentdetails.TotalUnrealizedAndTax` | 1d = 1b + 1c (A179) |
| **e** | **Annual value (1a – 1d)** | computed | `Rentdetails.BalanceALV` | 1e = 1a − 1d (A180) |
| **f** | **30% of 1e** | computed | `Rentdetails.ThirtyPercentOfBalance` | standard deduction u/s 24(a) = 30% of annual value (A181) |
| **g** | **Interest payable on borrowed capital** | computed from the 24(b) table | `Rentdetails.IntOnBorwCap` | interest allowed only if share > 0 and annual value > 0 (A189) |
| **h** | **Total (1f + 1g)** | computed | `Rentdetails.TotalDeduct` | 1h = 1f + 1g (A182) |
| **i** | **Arrears/Unrealized Rent received during the year Less 30%** | amount | `Rentdetails.ArrearsUnrealizedRentRcvd` | typed net of 30% |
| **j** | **Income from house property (1e –1 h+1i)** | computed | `Rentdetails.IncomeOfHP` | 1j = 1e − 1h + 1i (A183) |

Note the ITR-7 lettering differs from ITR-6: there is **no "annual value of the
property owned (share × 1e)" line** — the standard deduction (item f) is taken at
30% of the annual value 1e directly, item g is the interest, item h is their
total, and item j is the property's income.

### Section 24(b) — interest on borrowed capital, one table per property (rows 30–37)

Rows 30–31: **Section 24(b) · Interest on borrowed capital**. The loan table that
feeds item g. 4 rows shipped per property (rows 33–36), **unlimited**. Schema
block `Rentdetails.Section24B.Section24BDtls[]`.

| Column (sheet lettering i–vii) | Label (verbatim) | Schema key | Rule |
|---|---|---|---|
| **i** | **Loan taken from** | `Section24BDtls[].LoanTknFrom` | dropdown: **Bank · Other than bank** |
| **ii** | **Name of the bank / Institution / Person from which the loan is taken** | `Section24BDtls[].BankOrInstnName` | required |
| **iii** | **Loan Account number of the Bank/ Institution** | `Section24BDtls[].LoanAccNoOfBankOrInstnRefNo` | required |
| **iv** | **Date of sanction of loan** | `Section24BDtls[].DateofLoan` | `DD/MM/YYYY`, required |
| **v** | **Total amount of loan** | `Section24BDtls[].TotalLoanAmt` | required |
| **vi** | **Amount of loan outstanding as on last date of financial year** | `Section24BDtls[].LoanOutstndngAmt` | required — on 31 March 2026 |
| **vii** | **Interest on Borrowed capital u/s 24(b)** | `Section24BDtls[].InterestUs24B` | required — the year's interest on this loan |
| (total) | **Total of Interest on Borrowed capital u/s 24(b)** | `Section24B.TotalInterestUs24B` | computed — feeds item g; individual rows must sum to it (A192) |

Details of the loan are **mandatory to claim the deduction** (A191, A193); the
sum of the row-wise interest must match the total (A192).

---

## 3 · The rules the working enforces (from the rules document, by serial)

- **A179** — 1(d) "total" = 1b + 1c.
- **A180** — Annual Value 1(e) = 1a − 1d.
- **A181** — Standard deduction (item f) = **30% of the annual value** (1e).
- **A182** — 1(h) "total" = 1f + 1g.
- **A183** — 1(j) Income from House Property = 1e − 1h + 1i.
- **A184** — Item 3, Income under the head "Income from house property" (1j + 2) =
  Σ1j across all properties + item 2.
- **A185** — If gross rent / lettable value (1a) is zero or null, municipal tax
  (item c) cannot be claimed.
- **A186** — If type is Let Out or Deemed Let Out, gross rent (1a) cannot be zero
  or null.
- **A187** — the first three characters of a TAN must be valid TAN alphabet codes
  (the PAN/TAN of tenant field).
- **A188** — Co-owned: assessee's share + all co-owners' shares = 100%.
- **A189** — If the assessee's share of a co-owned property is zero, interest on
  borrowed capital (item g) cannot be more than zero.
- **A190** — A co-owner's PAN cannot equal the assessee's own PAN.
- **A191 / A193** — Details of the loan in Table 24(b) are mandatory to claim the
  interest deduction u/s 24(b).
- **A192** — The sum of the individual rows for "Interest on Borrowed capital u/s
  24(b)" must match the "Total Interest on borrowed capital u/s 24(b)".

---

## 4 · Item 2 — Pass through income/ loss if any

**Pass through income/ loss if any \*** — one figure (schema `PassThroghIncome`).
Income or loss from a business trust or investment fund that is house-property in
nature, taken from Schedule PTI (row i of PTI; rules A383, A485). A hidden line
above it (row 42) carries the head caption, and a hidden line (row 44, item B)
carries **Arrears of rent received during the year under section 25B after
deducting 30%** — neither is a built input this year.

## 5 · Item 3 — Income under the head

**Income under the head "Income from house property" (∑1j + 2)** — Σ1j across all
properties + item 2 (schema `TotalIncomeChargeableUnHP`; the only field the
schema marks required on `ScheduleHP` itself). *If negative, the figure goes to
**2i of Schedule CYLA*** (A360, A373) — capped at **two lakh** with the balance
**remaining** to be carried forward. It also feeds **Part B-TI** (A485, A554,
A592) and is the base for foreign-tax relief in Schedule FSI (A459).

---

## 6 · How many can be added

| Where | Repeatable? |
|---|---|
| **Property blocks** | **yes — unlimited** (the schema `PropertyDetails[]` has no maximum) |
| Co-owners inside a block | **yes, unlimited** |
| Tenants inside a block | **yes, unlimited** |
| Section 24(b) loans inside a block | **yes, unlimited** (4 rows shipped) |
| Item 2 pass-through | one figure |

---

## 7 · What is mandatory

**On every property** (schema `required` on a `PropertyDetails` item): serial
(`HPSNo`) · address · city · state · country · owner · co-owned flag · assessee's
percentage share · type (`ifLetOut`) · and in the rent working: annual lettable
value · rent not realized · local taxes · total of unrealised and tax · balance
ALV · thirty percent of balance · interest on borrowed capital · total deductions
· income of the property.

**On every co-owner row:** serial and name (`CoOwnersSNo`, `NameCoOwner`).
**On every tenant row:** serial and name (`TenantSNo`, `NameofTenant`).
**On every loan row:** all seven columns of `Section24BDtls`, plus
`TotalInterestUs24B`.
**On the schedule:** `TotalIncomeChargeableUnHP`.

Everything else — PIN/Zip, PAN/Aadhaar of co-owners and tenants, arrears
(`ArrearsUnrealizedRentRcvd`), pass-through (`PassThroghIncome`) — is written only
when it carries a value.

---

## 8 · What this means for the build

1. **One collapsible block per property, unlimited**, each collapsing to
   *"Property 1 — address · Let out · ₹…"*.
2. **Type is Let Out / Deemed Let Out only** — no self-occupied branch; the full
   a–j working always runs and gross rent (1a) is always required > 0.
3. **Owner is Self / Deemed owner only** — no minor/spouse/others field.
4. **The 24(b) loan table lives inside the block**, all seven columns mandatory
   per row, summing into item g; interest is admitted only when share% > 0 and
   1a > 0 (A189).
5. **Co-owners and tenants are tables inside the block**, the co-owner table
   opening on the co-owned = Yes answer; assessee's + co-owners' shares = 100%.
6. **The standard deduction bites at f** (30% of the annual value 1e), the
   interest at g, their total at h, and the property's income at j = 1e − 1h + 1i.
7. **The loss goes to CYLA 2i with the two-lakh cap** and the balance remaining is
   carried forward; the head total feeds Part B-TI and Schedule FSI.

---

## Appendix A · Full schema key map (`ScheduleHP`)

Required keys marked *. Every live row above maps to one of these leaves.

```
  PropertyDetails[] array
* PropertyDetails[].HPSNo                                                integer
* PropertyDetails[].AddressDetailWithZipCode.AddrDetail                  string
* PropertyDetails[].AddressDetailWithZipCode.CityOrTownOrDistrict        string
* PropertyDetails[].AddressDetailWithZipCode.StateCode                   string
* PropertyDetails[].AddressDetailWithZipCode.CountryCode                 string
  PropertyDetails[].AddressDetailWithZipCode.PinCode                     integer
  PropertyDetails[].AddressDetailWithZipCode.ZipCode                     string
* PropertyDetails[].PropertyOwner                                        string   (Self/Deemed owner)
* PropertyDetails[].PropCoOwnedFlg                                       string   (Yes/No)
* PropertyDetails[].AssessePercentShareProp                             number
  PropertyDetails[].CoOwners[] array
* PropertyDetails[].CoOwners[].CoOwnersSNo                               integer
* PropertyDetails[].CoOwners[].NameCoOwner                               string
  PropertyDetails[].CoOwners[].PAN_CoOwner                               string
  PropertyDetails[].CoOwners[].Aadhaar_CoOwner                           string
  PropertyDetails[].CoOwners[].PercentShareProperty                      number
* PropertyDetails[].ifLetOut                                             string   (Let Out/Deemed Let Out)
  PropertyDetails[].TenantDetails[] array
* PropertyDetails[].TenantDetails[].TenantSNo                            integer
* PropertyDetails[].TenantDetails[].NameofTenant                         string
  PropertyDetails[].TenantDetails[].PANofTenant                          string
  PropertyDetails[].TenantDetails[].AadhaarofTenant                      string
  PropertyDetails[].TenantDetails[].PANTANofTenant                       string
* PropertyDetails[].Rentdetails.AnnualLetableValue                       integer
* PropertyDetails[].Rentdetails.RentNotRealized                          integer
* PropertyDetails[].Rentdetails.LocalTaxes                               integer
* PropertyDetails[].Rentdetails.TotalUnrealizedAndTax                    integer
* PropertyDetails[].Rentdetails.BalanceALV                               integer
* PropertyDetails[].Rentdetails.ThirtyPercentOfBalance                   integer
* PropertyDetails[].Rentdetails.IntOnBorwCap                             integer
* PropertyDetails[].Rentdetails.Section24B.Section24BDtls[] array
* PropertyDetails[].Rentdetails.Section24B.Section24BDtls[].LoanTknFrom              string (Bank/Other than bank)
* PropertyDetails[].Rentdetails.Section24B.Section24BDtls[].BankOrInstnName          string
* PropertyDetails[].Rentdetails.Section24B.Section24BDtls[].LoanAccNoOfBankOrInstnRefNo string
* PropertyDetails[].Rentdetails.Section24B.Section24BDtls[].DateofLoan               string
* PropertyDetails[].Rentdetails.Section24B.Section24BDtls[].TotalLoanAmt             integer
* PropertyDetails[].Rentdetails.Section24B.Section24BDtls[].LoanOutstndngAmt         integer
* PropertyDetails[].Rentdetails.Section24B.Section24BDtls[].InterestUs24B            integer
* PropertyDetails[].Rentdetails.Section24B.TotalInterestUs24B                        integer
* PropertyDetails[].Rentdetails.TotalDeduct                             integer
  PropertyDetails[].Rentdetails.ArrearsUnrealizedRentRcvd               integer
* PropertyDetails[].Rentdetails.IncomeOfHP                              integer
  PassThroghIncome                                                      integer
* TotalIncomeChargeableUnHP                                             integer
```

---

## Appendix B · Every live row of the Schedule HP sheet, verbatim

```
r3  : [C3] SCH HP | [F3] Schedule HP Details of Income from House Property (Drop down to be provided indicating ownership of
r4  : [F4] Address of property 1 | [G4] Town/ City | [H4] State | [I4] Country | [J4] PIN Code | [K4] Zip Code
r6  : [F6] Owner of the Property | [H6] Is property co-owned? (if "YES" please enter following details) | [J6] Assessee's percentage of share in the Property(%)
r7  : [F7] Sl. No | [G7] Name of Co-owner(s) | [H7] PAN of Co-owner(s) | [I7] Aadhaar Number of Co-owner(s) | [J7] Percentage Share of co-owner(s) in Property(%)
r16 : [F16] Type Of House Property
r17 : [F17] Sl. No. | [G17] Name(s) of Tenant (if let out) | [H17] PAN of Tenant(s) (if available) | [I17] Aadhaar Number of tenant | [J17] PAN / TAN of Tenant(s) (if TDS credit is claimed)
r23 : [E23] a | [F23] Gross rent received or receivable or lettable value (higher of the two, if let out for whole of the year)
r24 : [E24] b | [F24] The amount of rent which cannot be realized
r25 : [E25] c | [F25] Tax paid to local authorities
r26 : [E26] d | [F26] Total (1b +1c)
r27 : [E27] e | [F27] Annual value (1a – 1d)
r28 : [E28] f | [F28] 30% of 1e
r29 : [E29] g | [F29] Interest payable on borrowed capital
r30 : [D30] Section 24(b) | [E30] Interest on borrowed capital
r31 : [D31] Sl. No. | [E31] Loan taken from | [F31] Name of the bank / Institution / Person from which the loan is taken | [G31] Loan Account number of the Bank/ Institution | [H31] Date of sanction of loan | [I31] Total amount of loan | [J31] Amount of loan outstanding as on last date of financial year | [K31] Interest on Borrowed capital u/s 24(b)
r37 : [E37] Total of Interest on Borrowed capital u/s 24(b)
r38 : [E38] h | [F38] Total (1f + 1g)
r39 : [E39] i | [F39] Arrears/Unrealized Rent received during the year Less 30%
r40 : [E40] j | [F40] Income from house property (1e –1 h+1i)
r41 : [D41] (fill up details separately for each property)
r43 : [E43] Pass through income/ loss if any *
r45 : [E45] Income under the head "Income from house property" (∑1j + 2) (if negative take the figure to 2i of Schedule CYLA) | [N45] two lakh
r46 : [N46] remaining
r48 : [C48] Note: Furnishing PAN of tenant is mandatory if tax is deducted under section 194-IB. Furnishing TAN of tenant is mandatory if tax is deducted under section 194-I.
```

Hidden rows not built this year: **r42** (head caption "Income under the head
'Income from house property'") and **r44** (item **B** — *Arrears of rent received
during the year under section 25B after deducting 30%*).

---

## Appendix C · Every dropdown value, verbatim

### Owner of the Property (`PropertyOwner`) — cells F7:F15 / H6
`(Select)` · **Self** · **Deemed owner**.

### Is property co-owned? (`PropCoOwnedFlg`) — cell I6
`(Select)` · **Yes** · **No**.

### Type Of House Property (`ifLetOut`) — cell H16
`(Select)` · **Let Out** · **Deemed Let Out**.

### Loan taken from (`LoanTknFrom`) — cells I31:I32
`(Select)` · **Bank** · **Other than bank**.

### State (`StateCode`) — cell H5, 38 entries
`(Select)` · 01-ANDAMAN AND NICOBAR ISLANDS · 02-ANDHRA PRADESH ·
03-ARUNACHAL PRADESH · 04-ASSAM · 05-BIHAR · 06-CHANDIGARH ·
07-DADRA NAGAR AND HAVELI · 08-DAMAN AND DIU · 09-DELHI · 10-GOA · 11-GUJARAT ·
12-HARYANA · 13-HIMACHAL PRADESH · 14-JAMMU AND KASHMIR · 15-KARNATAKA ·
16-KERALA · 17-LAKHSWADEEP · 18-MADHYA PRADESH · 19-MAHARASHTRA · 20-MANIPUR ·
21-MEGHALAYA · 22-MIZORAM · 23-NAGALAND · 24-ODISHA · 25-PUDUCHERRY · 26-PUNJAB ·
27-RAJASTHAN · 28-SIKKIM · 29-TAMILNADU · 30-TRIPURA · 31-UTTAR PRADESH ·
32-WEST BENGAL · 33-CHHATISHGARH · 34-UTTARAKHAND · 35-JHARKHAND · 36-TELANGANA ·
37-LADAKH · 99-FOREIGN.

### Country (`CountryCode`) — cell I5, 251 entries
`(Select)` · 93-AFGHANISTAN · 1001-ALAND ISLANDS · 355-ALBANIA · 213-ALGERIA ·
684-AMERICAN SAMOA · 376-ANDORRA · 244-ANGOLA · 1264-ANGUILLA · 1010-ANTARCTICA ·
1268-ANTIGUA AND BARBUDA · 54-ARGENTINA · 374-ARMENIA · 297-ARUBA · 61-AUSTRALIA ·
43-AUSTRIA · 994-AZERBAIJAN · 1242-BAHAMAS · 973-BAHRAIN · 880-BANGLADESH ·
1246-BARBADOS · 375-BELARUS · 32-BELGIUM · 501-BELIZE · 229-BENIN · 1441-BERMUDA ·
975-BHUTAN · 591-BOLIVIA (PLURINATIONAL STATE OF) ·
1002-BONAIRE, SINT EUSTATIUS AND SABA · 387-BOSNIA AND HERZEGOVINA · 267-BOTSWANA ·
1003-BOUVET ISLAND · 55-BRAZIL · 1014-BRITISH INDIAN OCEAN TERRITORY ·
673-BRUNEI DARUSSALAM · 359-BULGARIA · 226-BURKINA FASO · 257-BURUNDI ·
238-CABO VERDE · 855-CAMBODIA · 237-CAMEROON · 1-CANADA · 1345-CAYMAN ISLANDS ·
236-CENTRAL AFRICAN REPUBLIC · 235-CHAD · 56-CHILE · 86-CHINA · 9-CHRISTMAS ISLAND ·
672-COCOS (KEELING) ISLANDS · 57-COLOMBIA · 270-COMOROS · 242-CONGO ·
243-CONGO (DEMOCRATIC REPUBLIC OF THE) · 682-COOK ISLANDS · 506-COSTA RICA ·
225-COTE DIVOIRE · 385-CROATIA · 53-CUBA · 1015-CURACAO · 357-CYPRUS · 420-CZECHIA ·
45-DENMARK · 253-DJIBOUTI · 1767-DOMINICA · 1809-DOMINICAN REPUBLIC · 593-ECUADOR ·
20-EGYPT · 503-EL SALVADOR · 240-EQUATORIAL GUINEA · 291-ERITREA · 372-ESTONIA ·
251-ETHIOPIA · 500-FALKLAND ISLANDS (MALVINAS) · 298-FAROE ISLANDS · 679-FIJI ·
358-FINLAND · 33-FRANCE · 594-FRENCH GUIANA · 689-FRENCH POLYNESIA ·
1004-FRENCH SOUTHERN TERRITORIES · 241-GABON · 220-GAMBIA · 995-GEORGIA ·
49-GERMANY · 233-GHANA · 350-GIBRALTAR · 30-GREECE · 299-GREENLAND · 1473-GRENADA ·
590-GUADELOUPE · 1671-GUAM · 502-GUATEMALA · 1481-GUERNSEY · 224-GUINEA ·
245-GUINEA-BISSAU · 592-GUYANA · 509-HAITI · 1005-HEARD ISLAND AND MCDONALD ISLANDS ·
6-HOLY SEE · 504-HONDURAS · 852-HONG KONG · 36-HUNGARY · 354-ICELAND · 91-INDIA ·
62-INDONESIA · 98-IRAN (ISLAMIC REPUBLIC OF) · 964-IRAQ · 353-IRELAND ·
1624-ISLE OF MAN · 972-ISRAEL · 5-ITALY · 1876-JAMAICA · 81-JAPAN · 1534-JERSEY ·
962-JORDAN · 7-KAZAKHSTAN · 254-KENYA · 686-KIRIBATI ·
850-KOREA (DEMOCRATIC PEOPLES REPUBLIC OF) · 82-KOREA (REPUBLIC OF) · 965-KUWAIT ·
996-KYRGYZSTAN · 856-LAO PEOPLES DEMOCRATIC REPUBLIC · 371-LATVIA · 961-LEBANON ·
266-LESOTHO · 231-LIBERIA · 218-LIBYA · 423-LIECHTENSTEIN · 370-LITHUANIA ·
352-LUXEMBOURG · 853-MACAO · 389-MACEDONIA (THE FORMER YUGOSLAV REPUBLIC OF) ·
261-MADAGASCAR · 265-MALAWI · 60-MALAYSIA · 960-MALDIVES · 223-MALI · 356-MALTA ·
692-MARSHALL ISLANDS · 596-MARTINIQUE · 222-MAURITANIA · 230-MAURITIUS · 269-MAYOTTE ·
52-MEXICO · 691-MICRONESIA (FEDERATED STATES OF) · 373-MOLDOVA (REPUBLIC OF) ·
377-MONACO · 976-MONGOLIA · 382-MONTENEGRO · 1664-MONTSERRAT · 212-MOROCCO ·
258-MOZAMBIQUE · 95-MYANMAR · 264-NAMIBIA · 674-NAURU · 977-NEPAL · 31-NETHERLANDS ·
687-NEW CALEDONIA · 64-NEW ZEALAND · 505-NICARAGUA · 227-NIGER · 234-NIGERIA ·
683-NIUE · 15-NORFOLK ISLAND · 1670-NORTHERN MARIANA ISLANDS · 47-NORWAY · 968-OMAN ·
92-PAKISTAN · 680-PALAU · 970-PALESTINE, STATE OF · 507-PANAMA · 675-PAPUA NEW GUINEA ·
595-PARAGUAY · 51-PERU · 63-PHILIPPINES · 1011-PITCAIRN · 48-POLAND · 14-PORTUGAL ·
1787-PUERTO RICO · 974-QATAR · 262-REUNION · 40-ROMANIA · 8-RUSSIAN FEDERATION ·
250-RWANDA · 1006-SAINT BARTHELEMY · 290-SAINT HELENA, ASCENSION AND TRISTAN DA CUNHA ·
1869-SAINT KITTS AND NEVIS · 1758-SAINT LUCIA · 1007-SAINT MARTIN (FRENCH PART) ·
508-SAINT PIERRE AND MIQUELON · 1784-SAINT VINCENT AND THE GRENADINES · 685-SAMOA ·
378-SAN MARINO · 239-SAO TOME AND PRINCIPE · 966-SAUDI ARABIA · 221-SENEGAL ·
381-SERBIA · 248-SEYCHELLES · 232-SIERRA LEONE · 65-SINGAPORE ·
1721-SINT MAARTEN (DUTCH PART) · 421-SLOVAKIA · 386-SLOVENIA · 677-SOLOMON ISLANDS ·
252-SOMALIA · 28-SOUTH AFRICA · 1008-SOUTH GEORGIA AND THE SOUTH SANDWICH ISLANDS ·
211-SOUTH SUDAN · 35-SPAIN · 94-SRI LANKA · 249-SUDAN · 597-SURINAME ·
1012-SVALBARD AND JAN MAYEN · 268-SWAZILAND · 46-SWEDEN · 41-SWITZERLAND ·
963-SYRIAN ARAB REPUBLIC · 886-TAIWAN, PROVINCE OF CHINA[A] · 992-TAJIKISTAN ·
255-TANZANIA, UNITED REPUBLIC OF · 66-THAILAND · 670-TIMOR-LESTE(EAST TIMOR) ·
228-TOGO · 690-TOKELAU · 676-TONGA · 1868-TRINIDAD AND TOBAGO · 216-TUNISIA ·
90-TURKEY · 993-TURKMENISTAN · 1649-TURKS AND CAICOS ISLANDS · 688-TUVALU ·
256-UGANDA · 380-UKRAINE · 971-UNITED ARAB EMIRATES ·
44-UNITED KINGDOM OF GREAT BRITAIN AND NORTHERN IRELAND · 2-UNITED STATES OF AMERICA ·
1009-UNITED STATES MINOR OUTLYING ISLANDS · 598-URUGUAY · 998-UZBEKISTAN · 678-VANUATU ·
58-VENEZUELA (BOLIVARIAN REPUBLIC OF) · 84-VIET NAM · 1284-VIRGIN ISLANDS (BRITISH) ·
1340-VIRGIN ISLANDS (U.S.) · 681-WALLIS AND FUTUNA · 1013-WESTERN SAHARA · 967-YEMEN ·
260-ZAMBIA · 263-ZIMBABWE · 9999-OTHERS.

---

## Appendix D · Cross-sheet feeds

| Direction | From / To | What |
|---|---|---|
| **in** | Schedule PTI row i → HP item 2 | pass-through house-property income/loss (A383, A485) |
| **out** | HP Sl. 3 → Schedule CYLA 2i | the head total; if a loss, capped at two lakh, balance remaining carried forward (A360, A373) |
| **out** | HP Sl. 3 → Part B-TI | Income from house property (A485, A554, A592) |
| **out** | HP Sl. 1j+3 → Schedule FSI | base for foreign-tax relief on HP income (A459) |
