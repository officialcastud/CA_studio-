# The book of Schedule IE-3 — Income & Expenditure (regime 3) · ITR-7, A.Y. 2026-27

Read row by row from the utility's **IE-3** sheet (rows 3–5 header, entry rows
6–10) and confirmed against the CBDT ITR-7 schema block **ScheduleIE_III**. This
is the **Income & Expenditure statement, per institution**, for wholly or
substantially government-financed educational/medical institutions — sections
**10(23C)(iiiab)** and **10(23C)(iiiac)**. Per its head note it is *applicable for
assessees claiming exemption under sections 10(23C)(iiiab) or 10(23C)(iiiac)
(please fill up address for each institution separately): {Exemption is subject
to Government grants exceeding fifty per cent of the total receipts including
voluntary contribution}*. Nothing is invented: Appendix 2 lists every schema
leaf, Appendix 3 reproduces every live row verbatim, Appendix 1 the State
dropdown.

---

## 1 · Purpose and shape

An **institution-by-institution table** (`ScheduleIEIIIDtls[]`, one row per
institution, entry rows 6–10). Each row states the institution's objective, its
full address, and four money columns: total receipts, government grants out of
those receipts, amount applied, and balance accumulated. The **"government grants
exceeding 50% of total receipts"** test is the exemption condition (helper column
W4 "OS condition").

| Col | Header (verbatim) | Type / enum | Schema key |
|---|---|---|---|
| 1 | Objective of the institution (drop down to be provided - Educational / Medical) | dropdown Educational/Medical | `ScheduleIEIIIDtls[].ObjectiveOfInstitution` |
| 2 | Addresses where activity is carrying out | address group (cols below) | — |
| 2 | Flat/Door/Block No. | text (max 50) | `ScheduleIEIIIDtls[].FlatDoorBlockNumber` |
| 2 | Name of Premises/Building/Village | text (max 50) | `ScheduleIEIIIDtls[].PremisesBuildingName` |
| 2 | Road/Street/Post Office | text (max 50) | `ScheduleIEIIIDtls[].RoadStreetPostOffice` |
| 2 | Area/locality | text (max 50) | `ScheduleIEIIIDtls[].AreaLocality` |
| 2 | Town/City/District | text (max 50) | `ScheduleIEIIIDtls[].TownCityDistrict` |
| 2 | State | dropdown (state code) | `ScheduleIEIIIDtls[].StateCode` |
| 2 | PIN Code | integer (100000–999999) | `ScheduleIEIIIDtls[].PinCode` |
| 3 | Total receipts including any voluntary contribution | integer | `ScheduleIEIIIDtls[].TotRcptVoluntaryContr` |
| 4 | Government Grants out of Sl no 3 above | integer | `ScheduleIEIIIDtls[].GovtGrants` |
| 5 | Amount applied for objective | integer | `ScheduleIEIIIDtls[].AmountAppliedObj` |
| 6 | Balance accumulated | integer | `ScheduleIEIIIDtls[].BalanceAccumulated` |

---

## 2 · The law and computation the section-builder must encode

Sections **10(23C)(iiiab)** (any university or other educational institution
existing solely for education and not for profit, **wholly or substantially
financed by the Government**) and **10(23C)(iiiac)** (any hospital or other
institution for the reception and treatment of persons, wholly or substantially
financed by the Government) grant exemption **subject to Government grants
exceeding fifty per cent of the total receipts** including voluntary
contribution. "Substantially financed by the Government" is met when the
government grant of a previous year exceeds the prescribed percentage (50%) of
total receipts — the sheet's helper column W4 ("OS condition") enforces exactly
this test, comparing **GovtGrants** (column 4) against **TotRcptVoluntaryContr**
(column 3).

Per institution the section-builder captures:
- **Objective of the institution** (`ObjectiveOfInstitution`) — a dropdown whose
  choices are **Educational / Medical**; the utility picks the source list by the
  return's ExemptionClaimed (10(23C)(iiiab) → Education list, else Medical). The
  dump exposes the objective source as a formula, so the two display values are
  Educational and Medical.
- **Address** — Flat/Door/Block No. (`FlatDoorBlockNumber`, required), Name of
  Premises/Building/Village (`PremisesBuildingName`), Road/Street/Post Office
  (`RoadStreetPostOffice`), Area/locality (`AreaLocality`, required),
  Town/City/District (`TownCityDistrict`, required), **State** (`StateCode`,
  required — the coded state dropdown), and **PIN Code** (`PinCode`, required
  integer). Address for **each institution separately**.
- **Money columns** — Total receipts including any voluntary contribution
  (`TotRcptVoluntaryContr`), Government Grants out of Sl no 3 above (`GovtGrants`),
  Amount applied for objective (`AmountAppliedObj`), and Balance accumulated
  (`BalanceAccumulated`). Balance accumulated is receipts less amount applied.

All money columns and the required address/objective columns must be present on
every institution row; the array itself repeats once per institution.

---

## 3 · Dropdowns

- **State** (K6:K10, named range `StateIE3`) — the 37-state/UT coded list, values
  reproduced verbatim in Appendix 1.
- **Objective** (E6:E10) — source is a formula
  `IF(sheet1.ExemptionClaimed="Section 10(23C)(iiiab)",Dropdown_Education,Dropdown_Medical)`;
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

## Appendix 2 · Every schema leaf of block ScheduleIE_III (full paths)
`*` = required.
```
  ScheduleIEIIIDtls[] array
* ScheduleIEIIIDtls[].ObjectiveOfInstitution string
* ScheduleIEIIIDtls[].FlatDoorBlockNumber string
  ScheduleIEIIIDtls[].PremisesBuildingName string
  ScheduleIEIIIDtls[].RoadStreetPostOffice string
* ScheduleIEIIIDtls[].AreaLocality string
* ScheduleIEIIIDtls[].TownCityDistrict string
* ScheduleIEIIIDtls[].StateCode string
* ScheduleIEIIIDtls[].PinCode integer
* ScheduleIEIIIDtls[].TotRcptVoluntaryContr integer
* ScheduleIEIIIDtls[].GovtGrants integer
* ScheduleIEIIIDtls[].AmountAppliedObj integer
* ScheduleIEIIIDtls[].BalanceAccumulated integer
```

---

## Appendix 3 · Every live row of the sheet, verbatim
```
[C3] Schedule IE-3  |  [E3] Income & Expenditure statement (applicable for assessees claiming exemption under sections 10(23C)(iiiab) or 10(23C)(iiiac) (please fill up address for each institution separately): {Exemption is subject to Government grants exceeding fifty per cent of the total receipts including voluntary contribu
[D4] Sl.No.  |  [E4] Objective of the institution (drop down to be provided - Educational / Medical) 1  |  [F4] Addresses where activity is carrying out 2  |  [M4] Total receipts including any voluntary contribution 3  |  [N4] Government Grants out of Sl no 3 above 4  |  [O4] Amount applied for objective 5  |  [P4] Balance accumulated 6  |  [W4] OS condition 6
[F5] Flat/Door/Block No.  |  [G5] Name of Premises/Building/Village  |  [H5] Road/Street/Post Office  |  [I5] Area/locality  |  [J5] Town/City/District  |  [K5] State  |  [L5] PIN Code
```
