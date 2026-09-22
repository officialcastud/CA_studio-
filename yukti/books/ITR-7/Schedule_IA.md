# The book of Schedule IA — accumulated income taxed earlier u/s 11(3) · ITR-7, A.Y. 2026-27

Read row by row from the utility's **Schedule IA** sheet (rows 5–15; the year
rows 2018-19 and 2019-20 are hidden, 2020-21 … 2023-24 live, plus a Total row and
a Total column) and confirmed against the CBDT ITR-7 schema block
**ITRScheduleIA**. This is the cross-tabulation of **accumulated income that was
taxed in earlier assessment years as per section 11(3)** — the same amount that
sits in **column 6 of Schedule I** ("Amount taxed in any earlier Assessment
Year(s)"), broken out by the **year of accumulation** (down the rows) against the
**assessment year in which it was taxed** (across the columns). Nothing here is
invented: Appendix 1 lists every schema leaf, Appendix 2 reproduces every live row
verbatim.

This is one of the trust's application & accumulation core schedules. It is the
detail behind Schedule I column 6; its section 11(1B) counterpart is **Schedule
DA** (deemed application taxed in earlier years).

---

## 1 · Purpose and shape

A **matrix**: rows are the financial **years of accumulation**, columns are the
**assessment years in which the accumulated amount was taxed** under section
11(3), and the cell is the amount of that year's accumulation taxed in that
assessment year. Row 5 is the title — `C5` **Schedule IA**, `E5` *"Details of
accumulated income taxed in earlier assessment years as per section 11(3)"*. Row
6 is the banner *"Assessment year in which the amount referred at Col 6 of
Schedule I was taxed (Figures in Rs.)"*. Row 7 is the assessment-year header
(2021-22 · 2022-23 · 2023-24 · 2024-25 · 2025-26 · Total); row 8 labels the
columns (A)…(E). Rows 9–14 are the year-of-accumulation rows (2018-19 … 2023-24;
9–10 hidden); row 15 is the **Total** row.

Detail array: `YrOfAccDtls[]` — one object per year-of-accumulation row, each
carrying the per-assessment-year amounts and its row `Total`. The overall
`GrandTotal` is the scalar bottom-right cell.

---

## 2 · Rows, columns → type → schema key

**Rows (year of accumulation, column C):**

| Row | Cell | Year of accumulation (F.Yr.) | State |
|---|---|---|---|
| 9 | C9 | 2018-19 | hidden |
| 10 | C10 | 2019-20 | hidden |
| 11 | C11 | 2020-21 | live |
| 12 | C12 | 2021-22 | live |
| 13 | C13 | 2022-23 | live |
| 14 | C14 | 2023-24 | live |
| 15 | C15 | Total | Total row |

Each row is a `YrOfAccDtls[]` object; the year label is `YrOfAccumulationIA`.

**Columns (assessment year taxed, row 7 header → the per-AY leaf keys):**

| Col | Cell | Assessment year taxed | Label (row 8) | Type | Schema key |
|---|---|---|---|---|---|
| — | C | Year of accumulation. (F.Yr.) | FY | string | YrOfAccumulationIA |
| (A) | D | 2021-22 | (A) | integer | *(prior AY column — see note)* |
| (A) | E | 2022-23 | (A) | integer | AssYr22_23 |
| (B) | F | 2023-24 | (B) | integer | AssYr23_24 |
| (C) | G | 2024-25 | (C) | integer | AssYr24_25 |
| (D) | H | 2025-26 | (D) | integer | AssYr25_26 |
| (E) | I | Total (E) (A+B+C+D) | Total | integer | Total |

Note: the schema exposes four assessment-year amount leaves — `AssYr22_23`,
`AssYr23_24`, `AssYr24_25`, `AssYr25_26` — plus the row `Total`; column D
(assessment year 2021-22) is the sheet's leftmost/oldest bucket, folded into the
row Total. The bottom-right cell is `GrandTotal`.

---

## 3 · The law and the computation

**Section 11(3)** provides that where income accumulated or set apart under
section 11(2) is **applied to a purpose other than** the one for which it was
accumulated, **ceases to be so accumulated/set apart**, is **not utilised** for
the stated purpose within the permitted period, or is **credited/paid to another
trust**, it is **deemed to be the income** of the previous year in which the
default occurs, and is taxed in the corresponding assessment year.

Schedule IA does not compute a fresh charge; it is the **audit trail** of amounts
already taxed under 11(3): for each **year of accumulation** it records how much
was taxed **in each earlier assessment year**. The row `Total` (col E = A+B+C+D)
ties each accumulation year's taxed amount together; the `GrandTotal` is the sum
across all years and all assessment years, and reconciles to the running
column-6 tally in Schedule I.

---

## 4 · Dropdowns / enums

There are **no value-list dropdowns** on Schedule IA. Both data-validation
entries (`C9:C15` the year-of-accumulation labels, `D9:H14` the amount cells) are
`source "0"` numeric/text constraints with `values: null`. So there are no enum
values to seed.

---

## 5 · Cross-sheet feeds

**In:** the amounts are the section 11(3) figures already carried in **Schedule I
column 6** ("Amount taxed in any earlier Assessment Year(s)"), disaggregated here
by year of accumulation × assessment year taxed.

**Out:** a reconciliation/detail schedule — its `GrandTotal` ties back to the
aggregate of Schedule I column 6; it does not itself feed a fresh figure into
Part B-TI.

---

## Appendix 1 · Every schema leaf of block ITRScheduleIA (full paths)
`*` = required.
```
* YrOfAccDtls[] array
* YrOfAccDtls[].YrOfAccumulationIA string
  YrOfAccDtls[].AssYr22_23 integer
  YrOfAccDtls[].AssYr23_24 integer
  YrOfAccDtls[].AssYr24_25 integer
  YrOfAccDtls[].AssYr25_26 integer
* YrOfAccDtls[].Total integer
* GrandTotal integer
```

---

## Appendix 2 · Every live row of the sheet, verbatim
(Rows 9–10, the years 2018-19 and 2019-20, are hidden; shown for completeness of
the year axis.)
```
[C5] Schedule IA  |  [E5] Details of accumulated income taxed in earlier assessment years as per section 11(3)
[E6] Assessment year in which the amount referred at Col 6 of Schedule I was taxed (Figures in Rs.)
[C7] Year of accumulation. (F.Yr.)  |  [D7] 2021-22  |  [E7] 2022-23  |  [F7] 2023-24  |  [G7] 2024-25  |  [H7] 2025-26  |  [I7] Total
[C8] FY  |  [D8] (A)  |  [E8] (A)  |  [F8] (B)  |  [G8] (C)  |  [H8] (D)  |  [I8] (E) (A+B+C+D)
[C9] 2018-19   (hidden)
[C10] 2019-20  (hidden)
[C11] 2020-21
[C12] 2021-22
[C13] 2022-23
[C14] 2023-24
[C15] Total
```
