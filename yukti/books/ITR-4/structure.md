# ITR-4 — the structure (the continuous sheet)

AY 2026-27. ITR-4 is **Sugam**: the presumptive-income return for a Resident individual, HUF
or firm (other than LLP) with total income up to Rs 50 lakh — presumptive business/profession
(44AD / 44ADA / 44AE), salary, up to two house properties, other sources, Chapter VI-A
deductions, and (new this year) LTCG u/s 112A up to Rs 1.25 lakh not chargeable to tax. It has
**no** capital-gains schedule beyond the 112A reporting line, no business books of account, no
CYLA/BFLA/CFL loss chain, and no AMT. So it is far flatter than ITR-3 — **eight screen
sections**, ordered by how often a filer needs them. One continuous sheet, a left index that
scrolls to a section, collapse-and-open at every level.

The utility packs almost the whole return onto one sheet, **Income Details**. That one sheet
carries four schema blocks and is shown across four screen sections:
- **PART A GENERAL INFORMATION** (name, address, email, contact) → block `PersonalInfo` → shown under `who`;
- **FILING STATUS** (nature of employment, filed u/s, old/new regime & Form 10-IEA, seventh proviso, representative assessee) → block `FilingStatus` → shown under `ret`;
- **Part B Gross Total Income** (B1 salary, B2 business/profession, B3 house property, B4 other sources, B5 GTI) and **Part C Deductions** (C1–C19) → block `IncomeDeductions` → the income rows under `inc`, the Chapter VI-A rows under `ded`;
- **Part D Tax computations** (D1–D12, rebate 87A, cess, relief 89, interest 234A/B/C, fee 234F) → block `TaxComputation` → shown under `tax`.

In `section_map.json` the **Income Details** sheet is recorded once, under `inc` (the section
that owns most of it), carrying all four blocks; `who`, `ret` and `tax` are screen views of the
same sheet, not separate sheet mappings (as `ret` was for ITR-3). House-property income (B3)
also lives in `IncomeDeductions` (`PropertyDetails[]`) and is entered on its own **HP** sheet,
shown under `hp`.

| # | Section | id | Sheets it holds (utility) | Schema blocks |
|---|---|---|---|---|
| 1 | Who is filing | who | Income Details (PART A General — personal info, address, contact) *(view of the Income Details sheet)* | PersonalInfo |
| 2 | Return and regime | ret | Income Details (FILING STATUS — nature of employment, filed u/s, old/new regime & Form 10-IEA, seventh proviso A24, representative assessee A25) *(view of the Income Details sheet)* | FilingStatus |
| 3 | Income | inc | Income Details (Part B B1 salary, B2 business/profession, B4 other sources — from IncomeDeductions), BP (presumptive 44AD/44ADA/44AE, GST turnover, financial particulars), 44AE *(hidden — goods-carriage helper)*, Schedule EA 10(13A) *(hidden — HRA helper)* | IncomeDeductions, ScheduleBP, ScheduleEA10_13A |
| 4 | House property | hp | HP (up to two properties, co-owners, tenants, annual value, 24(b) interest), Schedule 24(b) *(hidden — interest-on-borrowed-capital helper)* | IncomeDeductions (PropertyDetails, Section24B) |
| 5 | Deductions | ded | Income Details (Part C C1–C19, from IncomeDeductions), 80C, 80D, 80G, 80DD_80U, 80GGC, 80E_80EE_80EEA_80EEB *(all hidden — unhidden on claim)* | IncomeDeductions (Part C), Schedule80C, Schedule80D, Schedule80G, Schedule80DD, Schedule80U, Schedule80GGC, Schedule80E, Schedule80EE, Schedule80EEA, Schedule80EEB |
| 6 | Part B — tax computation | tax | Income Details (Part D D1–D12 — from TaxComputation), TaxCalc *(hidden — the method)* | TaxComputation |
| 7 | Taxes paid | paid | TDS (Sch TDS1 salary, TDS2(i), TDS2(ii)), TCS, IT (advance & self-assessment tax) | TDSonSalaries, TDSonOthThanSals, ScheduleTDS3Dtls, ScheduleTCS, ScheduleIT |
| 8 | Bank and verification | bank | Taxes Paid and Verification (D13–D17 taxes paid, D18/D19 payable/refund, D20 exempt income, D20(a) LTCG 112A not chargeable, D21 bank accounts, verification, TRP) | TaxPaid, Refund, TaxExmpIntIncDtls, LTCG112A, Verification, TaxReturnPreparer |

Six distinct section ids in `section_map.json` (`inc`, `hp`, `ded`, `tax`, `paid`, `bank`);
`who` and `ret` are screen views of the Income Details sheet, not separate mappings — well
within the gate's limit of 20.

## Built on demand — hidden sheets the utility unhides when the claim is made (rule 1)

These are hidden until the taxpayer makes the claim; the utility unhides them on demand and the
sub-schedule (or its feed) is filed, so each is mapped with a `why_built` reason rather than
excluded.

- **Income (`inc`)** — **`44AE`** (the goods-carriage per-vehicle deemed-income helper that
  feeds Schedule BP's 44AE rows → block `ScheduleBP`) and **`Schedule EA 10(13A)`** (the
  house-rent-allowance exemption helper → block `ScheduleEA10_13A`).
- **House property (`hp`)** — **`Schedule 24(b)`** (the interest-on-borrowed-capital loan-detail
  helper; the data is filed under `IncomeDeductions` PropertyDetails.Rentdetails.Section24B).
- **Deductions (`ded`)** — the Chapter VI-A sub-schedules behind Part C: **`80C`** (→ Schedule80C),
  **`80D`** (→ Schedule80D), **`80G`** (→ Schedule80G), **`80DD_80U`** (→ Schedule80DD / Schedule80U),
  **`80GGC`** (→ Schedule80GGC), **`80E_80EE_80EEA_80EEB`** (→ Schedule80E / Schedule80EE /
  Schedule80EEA / Schedule80EEB).
- **Part B — tax (`tax`)** — **`TaxCalc`** is the hidden *computation* sheet (no schema block):
  the method behind Part D tax, the interest u/s 234A/234B/234C and the fee u/s 234F. Read, not
  shown (rule 7).

## Excluded (with reasons) — see `section_map.json`

| Sheet | State | Reason |
|---|---|---|
| Sheet1 | hidden | utility scratch sheet (single blank row) — no schedule, no schema block |
| Part A Gen_139(8A) | hidden | the 139(8A) updated-return variant of Part A General — not applicable to an original return |
| Part B ATI | hidden | Part B-ATI is the updated-return (139(8A) / 140B) computation — not applicable to an original return, and no schema block in ITR-4's block list |
| AL | hidden | Schedule AL applies only where total income exceeds Rs 50 lakh; ITR-4 (Sugam) is for total income up to Rs 50 lakh and its schema has no ScheduleAL block — not applicable to this form |
| SUMMARY | hidden | hidden internal preview / summary sheet — no schedule, no schema block |
| Help | hidden | the utility's how-to-use instructions text — not a schedule |
| DB | hidden | the utility's dropdown / database master (65k rows) — lookup data, not a schedule |
