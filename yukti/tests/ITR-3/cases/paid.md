# Hand-checked case — section `paid` (Taxes paid), ITR-3 A.Y. 2026-27

Source of the arithmetic: `books/ITR-3/IT.md` and `books/ITR-3/TDS.md`.
Traced against `engPaid()` in `forms/ITR-3/src/70_sec_paid.js`.

## Inputs

| Table | Row |
|---|---|
| TDS 1 · 17B | Employer TAN ABCD12345E · IncChrgSal 12,00,000 · TotalTDSSal 90,000 |
| TDS 2 · 17C1 | Self · 194A (94A) · deducted own 15,000 · claimed own 15,000 · b/f 0 |
| TDS 3 · 18C2 | Self · 4IA · deducted own 5,000 · claimed own 5,000 |
| TCS · 15C | Self (1) · TAN ABCD12345E · collected own 2,000 · claimed own 2,000 |
| IT · 17A | Challan A: 15/03/2026, amount 30,000 |
| IT · 17A | Challan B: 20/07/2026, amount 10,000 |

## Book formulas applied

- **TDS 1 total** `H13 = SUM(TotalTDSSal)` = 90,000 → `TotalTDSonSalaries`.
- **TDS 2 total** `P28 = SUM(TaxClaimedOwnHands)` = 15,000 → `TotalTDSonOthThanSals`.
  Carry-forward `W23 = MAX(0, bf + dedOwn + dedOthTDS − claimOwn − claimOthTDS)`
  = MAX(0, 0 + 15,000 + 0 − 15,000 − 0) = **0**.
- **TDS 3 total** `Q43 = SUM(TaxClaimedOwnHands)` = 5,000 → `TotalTDS3OnOthThanSal`.
  Carry-forward `X38 = MAX(0, 0 + 5,000 − 5,000)` = **0**.
- **TCS total** `L73 = SUM(7i own hands)` = 2,000 → `TotalSchTCS`.
  Carry-forward `O67 = MAX(0, bf + collOwn + collOth − claimOwn − claimOth)`
  = MAX(0, 0 + 2,000 + 0 − 2,000 − 0) = **0**.
- **IT split by date** (helper `T7`/`FormulaOFS`): a challan on or before
  31 Mar 2026 (`YREND`) is advance tax (`T31 = SUMIF(<2)`); on or after
  1 Apr 2026 it is self-assessment tax (`R31 = SUMIF(>=2)`).
  - Challan A 15/03/2026 → advance = 30,000.
  - Challan B 20/07/2026 → self-assessment = 10,000.
  - `TotalTaxPayments` = 40,000.

## Part B-TTI feeds (books' row-18 / note lines)

- 10a Advance tax = **30,000**
- 10b TDS = 90,000 + 15,000 + 5,000 = **1,10,000**
- 10c TCS = **2,000**
- 10d Self-assessment tax = **10,000**
- Total taxes paid = 30,000 + 1,10,000 + 2,000 + 10,000 = **1,52,000**

## Contribution to Gross Total Income

`S.C.paid.income = 0` — taxes paid are credits against the tax liability;
they add nothing to Gross Total Income.

## engPaid() output (matches to the rupee)

```
t1=90000  t2=15000  t3=5000  tds=110000  tcs=2000
adv=30000 sat=10000 itTotal=40000  paid=152000  income=0
tds2._cf=0  tds3._cf=0  tcs._cf=0
```

## Regime

`books/ITR-3/REGIME.md`: "taxes paid" stays open in the new regime. No item
in this section closes on `isNew()`, so both regime paths (`S.fs.optout="Yes"`
old and `="No"` new) render and compute identically — verified by inspection.
