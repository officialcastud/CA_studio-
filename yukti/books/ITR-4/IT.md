# The book of Schedule IT — Advance Tax and Self-Assessment Tax — ITR-4, A.Y. 2026-27

Read row by row from the utility's **IT** sheet (header `[D4] Sch IT`), with the
hidden-row flags, and confirmed against the schema's `ScheduleIT`. This is the
single table of advance-tax and self-assessment-tax challans. Its total feeds
Part B-TTI.

---

## The shape

One repeatable table headed **Sch IT · "Details of Advance Tax and Self
Assessment Tax Payments"** (row 4). One row per challan (rows 7–11), each
carrying **BSR Code**, **Date of Deposit (DD/MM/YYYY)**, **Serial Number of
Challan** and **Amount (Rs)**; the amounts are summed into a single **TOTAL**
(row 12, `[H12]= SUM(TaxP.Amt)`). The sheet then splits that total, by the date
of each challan, into **Advance Tax** and **SELF ASSESSMENT** tax through hidden
helper columns (columns N–X, with the `Exsat` / `FormulaOfExSAT` codes) — there
is no dropdown to choose which is which.

---

## The items

### ScheduleIT — Sch IT · Details of Advance Tax and Self Assessment Tax Payments

| Col / row | Field label | Type | Schema key | Rule / notes |
|---|---|---|---|---|
| 1 (`E`) | **Sl.No.** — header `(1)` | integer | — | row counter (`[D8]= D7+1`); not exported |
| 2 (`E`) | **BSR Code** — header `(1)` | string | `TaxPayment[].BSRCode` | required |
| 3 (`F`) | **Date of Deposit (DD/MM/YYYY)** — header `(2)` | string | `TaxPayment[].DateDep` | required; schema stores `YYYY-MM-DD`, on or after **2025-04-01** |
| 4 (`G`) | **Serial Number of Challan** — header `(3)` | integer | `TaxPayment[].SrlNoOfChaln` | required; 0 to 99999 |
| 5 (`H`) | **Amount (Rs)** — header `(4)` | integer | `TaxPayment[].Amt` | required; 0 to 99999999999999 |
| row 12 (`H`) | **TOTAL** | integer | `TotalTaxPayments` | computed = `SUM(TaxP.Amt)`; required even at zero |

The table object is the array `TaxPayment[]`; the single figure below it is
`TotalTaxPayments`. Note (row 14): *"Note: Enter the totals of Advance tax and
Self-Assessment tax in D13 & D14"*.

---

## The rules the sheet computes

- `[H12]= SUM(TaxP.Amt)` — the **TOTAL** is the sum of every challan's amount → schema `TotalTaxPayments`.
- `[O5]= SUMIF(IT.FormulaOFS,">=2",TaxP.Amt)` (**SELF ASSESSMENT** total) and `[Q5]= SUMIF(IT.FormulaOFS,"<2",TaxP.Amt)` (**Advance Tax** total) — the by-date split of the total into self-assessment vs advance tax.
- `[X5]= SUMIF(FormulaOfExSAT,"=1", TaxP.Amt)` — the **Exsat** accumulator (header `[W5] Exsat`); extended-due-date self-assessment amount.
- `[N7]= VALUE(MID(IT!F7,7,4))` (**Year**, header `[N6]`), `[O7]= VALUE(MID(IT!F7,1,2))` (**Day**, header `[O6]`), `[P7]= VALUE(MID(IT!F7,4,2))` (**Month**, header `[P6]`) — the helper pulls year, day, month out of the `DD/MM/YYYY` date of deposit `F7`.
- `[Q7]= IF(N7>IT_Quarter,2,IF(N7>=IT_Quarter,IF(P7>=4,2,1),1))` — flags whether a challan falls in the current-year window (advance vs self-assessment classifier), keyed off the named range `IT_Quarter`.
- `[R7]= IF($T$6,U7,T7)` — chooses between the two instalment-quarter classifiers `T7`/`U7` depending on the state flag `[T6]`/`[T5]= MID(sheet1.StateCode1,1,2)`.
- `[S7]= IF(N7<=IT_Quarter,IF(Q7>1,IF(P7<4,P7+9,P7-3),0),P7+9)` — the month-into-quarter mapping used by the break-up columns.
- `[T7]/[U7]= IF(Q7>1,6,IF(N7<IT_Quarter,IF((P7=6)*(O7>16),2,...)))` — the "Normal" / TN instalment-quarter classifiers (day-of-month thresholds decide the 234C quarter).
- `[V7]= IF(N7<=IT_Quarter,IF(Q7>1,IF(P7<4,P7+9,P7-3),0),P7 -3 + MAX(N7-IT_Quarter)*12)` — the self-assessment / instalment month index.
- `[X7]= IF(AND(Q7=2,P7=VALUE(MID(DueDate_Extend,4,2)),O7<=VALUE(MID(DueDate_Extend,1,2))),1,0)` — the extended-due-date test, worked against the named range `DueDate_Extend`.
- **Quarter Income Break up** (header `[U32]`): `[V32]/[W36]/[X35]/[W73]/[W74]= SUMIF(FormulaOfQ,"=n",TaxP.Amt)` — each quarter's amount, summed from the `FormulaOfQ` helper codes 1–5.
- **SELF ASSESSMENT** break-up: `[X21],[P24],[Q24],[P25],[Q25],[U27],[V27],[W29]…[X74]= SUMIF(FormulaOfSAT,"=n",TaxP.Amt)` — per-period self-assessment amounts from the `FormulaOfSAT` codes.
- **TN Case** (header `[U73]`): `[V73]= FALSE` — the Tamil-Nadu state toggle that selects the `U7` classifier column.
- VBA validation: *"Date of Deposit at Sr. No … in Sheet IT should not be less than 01/04/…"* — the deposit date has a lower-bound check; the schema fixes it at on/after **2025-04-01** and format `yyyy-mm-dd`.
- rules.json: *"In Schedule IT total of Col 4 Tax Paid should be equal to sum of individual values"*; the sum of Advance Tax + Self-Assessment Tax must equal the total claimed at "Total Taxes Paid" in the Taxes-Paid schedule; Advance Tax = tax paid where date of deposit is in the PY, Self-Assessment = date after 31st Mar.

**How the split works, in words:** the utility reads the date of each challan. A
challan is advance tax or self-assessment tax by its deposit date relative to the
year-end / due date — one paid within the previous year is advance tax, one paid
after it is self-assessment. There is no user choice; the `FormulaOFS` / `Exsat`
helper columns decide.

---

## Dropdowns

None. The IT sheet has no data-validation value lists. The validations on
`E7:E11`, `F7:F11`, `G7:G11`, `H7:H11`, `H12` and `O29:P34` are numeric / date /
format entry checks, not value-list dropdowns. Advance vs self-assessment is not
chosen from a list; it is derived from the date.

---

## What repeats and what is one figure

- **Repeats (array):** `TaxPayment[]` — one object per challan, one per row.
- **One figure (single):** `TotalTaxPayments` — the sum of all amounts.

---

## Mandatory

Schema `required` at the block level: **`TotalTaxPayments`**.

Within each `TaxPayment` object, every leaf is required:
`TaxPayment[].BSRCode`, `TaxPayment[].DateDep`, `TaxPayment[].SrlNoOfChaln`,
`TaxPayment[].Amt`. So any challan row that exists must carry all four; the total
`TotalTaxPayments` must be present (even zero) whenever the schedule is exported.

---

## Hidden rows — not built

No row of the IT sheet is flagged hidden (`H`) in the utility dump — rows 4, 5,
6, 12, 14, 32 and 73 are all visible. The right-hand columns **N–X** (across
rows 5–74: the `Year` / `Day` / `Month` extractors, the `Exsat`, "Normal" and
**TN Case** classifiers, the **Quarter Income Break up** and the per-period
`SUMIF` cells) are non-input computed helper cells that live off-screen to the
right of the entry grid; they drive the advance/self-assessment split and the
234C quarter placement but are **not entry items** and are not built as items.

---

## What this means for the build

1. **Four visible input columns** — BSR Code, Date of Deposit (`DD/MM/YYYY`),
   Serial Number of Challan, Amount (Rs) — plus a computed **TOTAL**. Nothing
   more is entered.
2. **The date rule is enforced:** `DateDep` must be on or after **2025-04-01**;
   store it as `YYYY-MM-DD` on export while showing `DD/MM/YYYY` on the sheet.
3. **The advance / self-assessment split is by date, computed** — a challan
   within the previous year is advance tax, after it is self-assessment tax;
   reproduce the `FormulaOFS` / `Exsat` logic and the 234C quarter placement
   (`FormulaOfQ`, `FormulaOfSAT`, the `IT_Quarter` and `DueDate_Extend` named
   ranges, and the TN-Case toggle) from the deposit date. No dropdown.
4. **The derived totals feed Part B-TTI** — advance tax and self-assessment tax
   totals per the row-14 note (into D13 & D14 / the Taxes-Paid schedule).
5. **Export:** every row to a `TaxPayment` object with all four leaves;
   `TotalTaxPayments` present even at zero.
