# The book of Schedule IE-4 — Income & Expenditure (regime 4) · ITR-7, A.Y. 2026-27

Read row by row from the utility's **IE-4** sheet (rows 3–5 header, entry rows
6–10, total row 12) and confirmed against the CBDT ITR-7 schema block
**ScheduleIE_IV**. This is the **Income & Expenditure statement, per
institution**, for small educational/medical institutions under the gross-receipt
threshold — sections **10(23C)(iiiad)** and **10(23C)(iiiae)**. Per its head note
it is *applicable for assessees claiming exemption under sections 10(23C)(iiiad)
or 10(23C)(iiiae) (please fill address for each institution separately):
{Exemption is subject to total receipts from all the institutions/universities
not exceeding five crore rupees}*. Nothing is invented: Appendix 2 lists every
schema leaf, Appendix 3 reproduces every live row verbatim, Appendix 1 the State
dropdown.

---

## 1 · Purpose and shape

An **institution-by-institution table** (`ScheduleIEIVDtls[]`, one row per
institution, entry rows 6–10) closed by a grand total (row 12). Each row states
the institution's objective, its full address, and three money columns: gross
annual receipts, amount applied, and balance accumulated. Unlike IE-3 there is no
government-grant column; instead the **aggregate gross receipts** are totalled and
tested against the **₹5 crore** ceiling.

| Col | Header (verbatim) | Type / enum | Schema key |
|---|---|---|---|
| 1 | Objective of the institution (drop down to be provided - Educational / Medical) | dropdown Educational/Medical | `ScheduleIEIVDtls[].ObjectiveOfInstitution` |
| 2 | Addresses where activity is carrying out | address group (cols below) | — |
| 2 | Flat/Door/Block No. | text (max 50) | `ScheduleIEIVDtls[].FlatDoorBlockNumber` |
| 2 | Name of Premises/Building/Village | text (max 50) | `ScheduleIEIVDtls[].PremisesBuildingName` |
| 2 | Road/Street/Post Office | text (max 50) | `ScheduleIEIVDtls[].RoadStreetPostOffice` |
| 2 | Area/locality | text (max 50) | `ScheduleIEIVDtls[].AreaLocality` |
| 2 | Town/City/District | text (max 50) | `ScheduleIEIVDtls[].TownCityDistrict` |
| 2 | State | dropdown (state code) | `ScheduleIEIVDtls[].StateCode` |
| 2 | PIN Code | integer (100000–999999) | `ScheduleIEIVDtls[].PinCode` |
| 3 | Gross Annual receipts | integer | `ScheduleIEIVDtls[].GrossAnnualReceipts` |
| 4 | Amount applied for objective | integer | `ScheduleIEIVDtls[].AmountAppliedObj` |
| 5 | Balance accumulated | integer | `ScheduleIEIVDtls[].BalanceAccumulated` |
| — | Sum of Gross Annual receipts (Sum of Sl. No. 3) | integer (computed) | `SumGrossAnnualReceipts` |

---

## 2 · The law and computation the section-builder must encode

Sections **10(23C)(iiiad)** (any university or other educational institution
existing solely for education and not for profit) and **10(23C)(iiiae)** (any
hospital or institution for the reception and treatment of persons) grant
exemption where the **aggregate annual receipts of all such institutions do not
exceed ₹5 crore**. The exemption is thus threshold-based, not application-based:
the sheet totals the gross annual receipts across every institution row and tests
that sum against the five-crore ceiling.

Per institution the section-builder captures:
- **Objective of the institution** (`ObjectiveOfInstitution`) — a dropdown whose
  choices are **Educational / Medical**; the utility picks the source list by the
  return's ExemptionClaimed (10(23C)(iiiad) → Education list, else Medical).
- **Address** — Flat/Door/Block No. (`FlatDoorBlockNumber`, required), Name of
  Premises/Building/Village (`PremisesBuildingName`), Road/Street/Post Office
  (`RoadStreetPostOffice`), Area/locality (`AreaLocality`, required),
  Town/City/District (`TownCityDistrict`, required), **State** (`StateCode`,
  required — the coded state dropdown), and **PIN Code** (`PinCode`, required
  integer). Address for **each institution separately**.
- **Money columns** — Gross Annual receipts (`GrossAnnualReceipts`), Amount
  applied for objective (`AmountAppliedObj`), and Balance accumulated
  (`BalanceAccumulated`). Balance accumulated is gross receipts less amount
  applied.

**Row 12 — the aggregate.** `SumGrossAnnualReceipts` = **Sum of Gross Annual
receipts (Sum of Sl. No. 3)** across all institution rows — the figure compared
to the ₹5 crore ceiling. The detail array is required (at least one institution
row), and the sum is a required computed integer.

---

## 3 · Dropdowns

- **State** (K6:K10, named range `StateIE3`) — the 37-state/UT coded list, values
  reproduced verbatim in Appendix 1.
- **Objective** (E6:E10) — source is a formula
  `IF(sheet1.ExemptionClaimed="Section 10(23C)(iiiad)",Dropdown_Education,Dropdown_Medical)`;
  the two display values are **Educational** and **Medical** (the dump cannot
  resolve the named source to a value list).

---

## Appendix 1 · Dropdown values (verbatim)

**State (K6:K10, `StateIE3`):**
```
(Select)
01-ANDAMAN AND NICOBAR ISLANDS
02-ANDHRA PRADESH
03-ARUNACHAL PRADESH
04-ASSAM
05-BIHAR
06-CHANDIGARH
07-DADRA AND NAGAR HAVELI
08-DAMAN AND DIU
09-DELHI
10-GOA
11-GUJARAT
12-HARYANA
13-HIMACHAL PRADESH
14-JAMMU AND KASHMIR
15-KARNATAKA
16-KERALA
17-LAKHSWADEEP
18-MADHYA PRADESH
19-MAHARASHTRA
20-MANIPUR
21-MEGHALAYA
22-MIZORAM
23-NAGALAND
24-ODISHA
25-PUDUCHERRY
26-PUNJAB
27-RAJASTHAN
28-SIKKIM
29-TAMILNADU
30-TRIPURA
31-UTTAR PRADESH
32-WEST BENGAL
33-CHHATISHGARH
34-UTTARAKHAND
35-JHARKHAND
36-TELANGANA
37-LADAKH
```

**Objective (E6:E10, formula source):**
```
Educational
Medical
```

---

## Appendix 2 · Every schema leaf of block ScheduleIE_IV (full paths)
`*` = required.
```
* ScheduleIEIVDtls[] array
* ScheduleIEIVDtls[].ObjectiveOfInstitution string
* ScheduleIEIVDtls[].FlatDoorBlockNumber string
  ScheduleIEIVDtls[].PremisesBuildingName string
  ScheduleIEIVDtls[].RoadStreetPostOffice string
* ScheduleIEIVDtls[].AreaLocality string
* ScheduleIEIVDtls[].TownCityDistrict string
* ScheduleIEIVDtls[].StateCode string
* ScheduleIEIVDtls[].PinCode integer
* ScheduleIEIVDtls[].GrossAnnualReceipts integer
* ScheduleIEIVDtls[].AmountAppliedObj integer
* ScheduleIEIVDtls[].BalanceAccumulated integer
* SumGrossAnnualReceipts integer
```

---

## Appendix 3 · Every live row of the sheet, verbatim
```
[C3] Schedule IE-4  |  [E3] Income & Expenditure statement (applicable for assessees claiming exemption under sections 10(23C)(iiiad) or 10(23C)(iiiae) (please fill address for each institution separately):{Exemption is subject to total receipts from all the institutions/universities not exceeding five crore rupees}
[D4] Sl.No.  |  [E4] Objective of the institution (drop down to be provided - Educational / Medical) 1  |  [F4] Addresses where activity is carrying out 2  |  [M4] Gross Annual receipts 3  |  [N4] Amount applied for objective 4  |  [O4] Balance accumulated 5
[F5] Flat/Door/Block No.  |  [G5] Name of Premises/Building/Village  |  [H5] Road/Street/Post Office  |  [I5] Area/locality  |  [J5] Town/City/District  |  [K5] State  |  [L5] PIN Code
[E12] Sum of Gross Annual receipts (Sum of Sl. No. 3)
```
