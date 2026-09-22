# Hand-trace — section `other` (Sch 5A · PTI · ESOP), ITR-3

Section builder: `forms/ITR-3/src/70_sec_other.js`. GTI contribution is 0 for
all three schedules (disclosures / tax-deferral), so the arithmetic worth
tracing is ESOP's per-year column logic (books/ITR-3/ESOP.md) and the 5A/PTI
totals. Traced against `engOther()` line by line.

## Inputs (S.other)

ESOP header: PAN AAACE1234F, DPIIT DIPP12345.

| Year | bf (col3) | sold (4i) | ceased (5) | sale rows tagged to year |
|---|---|---|---|---|
| 2021-22 | 50,000 | (blank) | (blank) | none |
| 2022-23 | 100,000 | PS (Partly Sold) | N | one: 10/06/2025 → 40,000 |
| 2023-24 | 0 | (blank) | (blank) | none |
| 2024-25 | 80,000 | NS (Not sold) | N | none |
| 2025-26 | 0 | (blank) | (blank) | none |

Sale sub-table: one row {ay:2022-23, date:10/06/2025, amt:40000}.

5A (governed = Yes): HP inc 200000/spouse 100000; BP inc 60000/spouse 30000;
CG inc 0; OS inc 20000/spouse 10000; all TDS 0.

## ESOP trace (`esopYear`)

**2021-22** — H = (sec/ceased blank) → SUMIF = **0**. L: year is 2021-22 ⇒
`l = bf` = **50,000** (48-month expiry). bal = max(0, 50000−50000) = **0**.

**2022-23** — H: not FS, not ceased-Y ⇒ SUMIF(sales@2022-23) = **40,000**.
L: not 2021-22; sec≠FS; not (PS & ceased Y); sec is PS ⇒ branch 4 `l = H` =
**40,000**. bal = max(0, 100000−40000) = **60,000**.

**2023-24** — H = 0. L: else branch `h>0?h:bf` = 0. bal = **0**.

**2024-25** — H = 0. L: NS & ceased N ⇒ **0**. bal = max(0, 80000−0) = **80,000**.

**2025-26** — all zero → H 0, L 0, bal 0.

- `esopDue` = Σ col7 = 50000 + 40000 + 0 + 0 + 0 = **90,000** → `S.C.other.esopTaxPayable`, and → Part B-TTI 8c.
- `esopSoldTotal` (TotalTaxAttributedAmt) = Σ all sale amt = **40,000**.
- 2026-27 balance [M13]: no override ⇒ reads `(S.C.tax||{}).gross` (0 at order 24) = **0** (resolves via the manual override or Part B-TTI once known).

Export ScheduleESOP: each `ScheduleESOP<nn>_Type` present with AssessmentYear +
BalanceTaxCF (required); 2223 carries the event array {Date 2025-06-10,
TaxAttributedAmt 40000}; TotalTaxAttributedAmt = 40000; 2627 = {AY, bal 0}.

## 5A trace (`engOther` 5A block)

Total row [I14/J14/K14/L14] = Σ of four heads:
inc 200000+60000+0+20000 = **280,000**; spouse 100000+30000+0+10000 =
**140,000**; tds 0; tdsSp 0. Card status shows spouse total ₹1,40,000.
Export writes HPHeadIncome/BusHeadIncome/CapGainHeadIncome/OtherSourcesHeadIncome
+ TotalHeadIncome, plus BooksSpouse44ABFlg/92EFlg when set.

## PTI

Disclosure only; each leaf net = income − loss, aggregates ST=111A+others,
LT=112A+other, OS=div+others, exempt total = 23FBB + iv b + iv c. No GTI add.

## GTI

`S.C.other.income = 0` (verified: no head income is created here; PTI net is
carried by each head's own schedule, 5A only apportions, ESOP is deferred tax).

## Regime

No item in this section appears in books/ITR-3/REGIME.md closures; renders and
computes identically for `isNew()` true and false. Confirmed both ways.
