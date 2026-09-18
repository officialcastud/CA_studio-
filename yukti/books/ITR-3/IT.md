# The book of Schedule IT — Advance Tax and Self-Assessment Tax — ITR-3, A.Y. 2026-27

Read row by row from the utility's **IT** sheet, with the hidden-row flags,
and confirmed against the schema's `ScheduleIT`. This is the single table of
advance-tax and self-assessment-tax challans. Its total feeds Part B-TTI.

---

## The shape

One repeatable table, item **17A**, headed *"Details of payments of Advance Tax
and Self-Assessment Tax"* (row 4). One row per challan, each carrying BSR code,
date of deposit, serial number of challan and amount; the amounts are summed
into a single **Total** (row 17). The sheet then splits that total, by the date
of each challan, into advance tax and self-assessment tax through hidden helper
columns — there is no dropdown to choose which is which.

---

## The items

### ScheduleIT — item 17A · Details of payments of Advance Tax and Self-Assessment Tax

| Col / row | Field label | Type | Schema key | Rule / notes |
|---|---|---|---|---|
| 1 | SI. NO. | integer | — | row counter, not exported |
| 2 | **BSR Code** | string | `TaxPayment[].BSRCode` | required |
| 3 | **Date of Deposit (DD/MM/YYYY)** | string | `TaxPayment[].DateDep` | required; schema stores `YYYY-MM-DD`, on or after **2026-04-01** |
| 4 | **Serial Number of Challan** | integer | `TaxPayment[].SrlNoOfChaln` | required; 0 to 99999 |
| 5 | **Amount (Rs)** | integer | `TaxPayment[].Amt` | required; 0 to 99999999999999 |
| row 17 | **Total** | integer | `TotalTaxPayments` | computed = `SUM(IT.Amt)`; required even at zero |

The table object is the array `TaxPayment[]`; the single figure below it is
`TotalTaxPayments`.

---

## The rules the sheet computes

- `[H17]= SUM(IT.Amt)` — the Total is the sum of every challan's amount → schema `TotalTaxPayments`.
- `[V5]= SUMIF(FormulaOfExSAT,"=A",IT.Amt)` and `[W4] SUMIF(FormulaOfExSAT,"=A",IT.Amt)` — advance-tax total: the sum of amounts whose ExSat helper equals `"A"`.
- `[Q7]= VALUE(MID(F7,7,4))`, `[R7]= VALUE(MID(F7,1,2))`, `[S7]= VALUE(MID(F7,4,2))` — the helper pulls year, day, month out of the `DD/MM/YYYY` date of deposit.
- `[T7]= IF(Q7>2026,2,IF(Q7>=2026,IF(S7>=4,2,1),1))` — flags whether a challan is in the current-year window (used to classify advance vs self-assessment).
- `[V7]= IF(Q7<=2026,IF(T7>1,IF(S7<4,S7+9,S7-3),0),S7+9)` — the month-into-quarter mapping used by the self-assessment / instalment break-up columns.
- `[W7]= IF(Q7<=2026,IF(T7>1,IF(S7>7,IF(S7<VALUE(MID(NonAudit_DueDate,4,2)),"A", ...` — the **234C quarter placement**, worked against the non-audit due date `NonAudit_DueDate` (15/09/2025 for this cycle).
- `[X7]= IF(T7>1,6,IF(Q7<2026,IF((S7=6)*(R7>16),2, ...` — the "Normal" instalment-quarter classifier (row 6 header `[X6] Normal`).
- `[U27]…[U31]= SUMIF(FormulaOfQ,"=n",IT.Amt)` and `[V20]…[W31]= SUMIF(FormulaOfSAT,"=n",IT.Amt)` / `[X23],[X26]= SUMIF(FormulaOfSATNew,...)` — the **Quarter Income Break up** (row 27 header `[T27] Quarter Income Break up`): each quarter's amount, summed from the SAT helper codes.
- `[R31]= SUMIF(IT.FormulaOFS,">=2",IT.Amt)` (SelfAssesment) and `[T31]= SUMIF(IT.FormulaOFS,"<2",IT.Amt)` (AdvanceTax) — the by-date split into self-assessment vs advance tax **(both in hidden row 31)**.
- Note (row 18): *"Enter the totals of Advance tax and Self-Assessment tax in Sl No. 10a & 10d of Part B-TTI"* — the advance-tax total goes to Part B-TTI 10a, the self-assessment total to 10d.

**How the split works, in words:** the utility reads the date of each challan.
A challan is advance tax (`"A"`) or self-assessment tax by its deposit date
relative to the year-end / due date — a challan paid within the financial year
is advance tax, one paid after it is self-assessment. There is no user choice;
the ExSat helper column decides.

---

## Dropdowns

None. The IT sheet has no data-validation lists — the cells `E7:E15`, `F7:F15`,
`G7:G15`, `H7:H15` carry data-entry validations (numeric/format), not
value-list dropdowns. Advance vs self-assessment is not chosen from a list; it
is derived from the date.

---

## What repeats and what is one figure

- **Repeats (array):** `TaxPayment[]` — one object per challan, unlimited rows.
- **One figure (single):** `TotalTaxPayments` — the sum of all amounts.

---

## Mandatory

Schema `required` at the block level: **`TotalTaxPayments`**.

Within each `TaxPayment` object, every leaf is required:
`BSRCode`, `DateDep`, `SrlNoOfChaln`, `Amt`. So any challan row that exists must
carry all four; the total must be present (even zero) whenever the schedule is
exported.

---

## Hidden rows — not built

- **Row 31 (H):** `[Q31] SelfAssesment` and `[S31] AdvanceTax`, with helper
  formulas `[R31]= SUMIF(IT.FormulaOFS,">=2",IT.Amt)` (self-assessment total)
  and `[T31]= SUMIF(IT.FormulaOFS,"<2",IT.Amt)` (advance-tax total). These are
  internal accumulator cells used to split the total by date; they are not
  input items and are never shown to the user. **Not built as items.**

The remaining helper columns on the right (columns Q–X across rows 5–31 —
`234C Quarter check`, `ExSat`, `Normal`, `Quarter Income Break up`, and the
per-quarter `SUMIF` cells) are non-input computed helpers that live off-screen;
they drive the advance/self-assessment split and the 234C quarter placement but
are not entry items.

---

## What this means for the build

1. **Four visible input columns** — BSR Code, Date of Deposit (`DD/MM/YYYY`),
   Serial Number of Challan, Amount (Rs) — plus a computed **Total**. Nothing
   more is entered.
2. **The date rule is enforced:** `DateDep` must be on or after **2026-04-01**;
   store it as `YYYY-MM-DD` on export while showing `DD/MM/YYYY` on the sheet.
3. **The advance / self-assessment split is by date, computed** — a challan
   within the financial year is advance tax, after it is self-assessment tax;
   reproduce the ExSat / `FormulaOfExSAT` logic and the **234C quarter**
   placement from the deposit date. No dropdown.
4. **The two derived totals feed Part B-TTI** — advance tax to **10a**,
   self-assessment tax to **10d** (per the row-18 note).
5. **Export:** every row to a `TaxPayment` object with all four leaves;
   `TotalTaxPayments` present even at zero.
