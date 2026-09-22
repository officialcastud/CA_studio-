# The book of Schedule DA — deemed application taxed earlier u/s 11(1B) · ITR-7, A.Y. 2026-27

Read row by row from the utility's **Schedule DA** sheet (rows 3–15; the year rows
"Prior to 2019-20", 2018-19 and 2019-20 are hidden, "Prior to 2020-21" … 2023-24
live, plus a Total row and a Total column) and confirmed against the CBDT ITR-7
schema block **ITRScheduleDA**. This is the cross-tabulation of **deemed
application of income that was taxed in earlier assessment years as per section
11(1B)** — the counterpart, on the Explanation-1-to-11(1) track, of what Schedule
IA does on the section 11(2)/11(3) accumulation track. It maps the amount held in
**column 5 of Schedule D** ("Amount taxed in any earlier Assessment Year(s)"),
broken out by the **year of deemed application** (down the rows) against the
**assessment year in which it was taxed** (across the columns). Nothing here is
invented: Appendix 1 lists every schema leaf, Appendix 2 reproduces every live
row verbatim.

This is one of the trust's application & accumulation core schedules. It is the
detail behind Schedule D column 5.

---

## 1 · Purpose and shape

A **matrix**: rows are the financial **years of deemed application**, columns are
the **assessment years in which the amount was taxed** under section 11(1B), and
the cell is the amount taxed. Row 3 is the title — `C3` **Schedule DA**, `D3`
*"Details of deemed application of income taxed in earlier assessment years as per
section 11(1B)"*. Row 4 is the banner *"Assessment year in which the amount
referred at Col 5 of Schedule D was taxed (Figures in Rs.)"*. Row 5 is the
assessment-year header (Prior to 2021-22 · 2020-21 · 2021-22 · Prior to 2022-23 ·
2022-23 · 2023-24 · 2024-25 · 2025-26 · Total); row 6 labels the columns (A)…(F).
Rows 7–14 are the year-of-deemed-application rows; row 15 is the **Total**.

Detail array: `YrOfAccumDtls[]` — one object per year-of-deemed-application row,
each carrying the per-assessment-year amounts and its row `Total`. The overall
`GrandTotal` is the scalar bottom-right cell.

---

## 2 · Rows, columns → type → schema key

**Rows (year of deemed application, column C):**

| Row | Cell | Year of Deemed Application (F.Yr.) | State |
|---|---|---|---|
| 7 | C7 | Prior to 2019-20 | hidden |
| 8 | C8 | 2018-19 | hidden |
| 9 | C9 | 2019-20 | hidden |
| 10 | C10 | Prior to 2020-21 | live |
| 11 | C11 | 2020-21 | live |
| 12 | C12 | 2021-22 | live |
| 13 | C13 | 2022-23 | live |
| 14 | C14 | 2023-24 | live |
| 15 | B15 | Total | Total row |

Each row is a `YrOfAccumDtls[]` object; the year label is `YrOfAccumulationDA`.

**Columns (assessment year taxed, row 5 header → the per-AY leaf keys):**

| Col | Cell | Assessment year taxed | Label (row 6) | Type | Schema key |
|---|---|---|---|---|---|
| — | C | Year of Deemed Application (F.Yr.) | FY | string | YrOfAccumulationDA |
| — | D | Prior to 2021-22 | (A) | integer | AssYrPriorToAY |
| — | E | 2020-21 | (B) | integer | *(folded to row Total)* |
| — | F | 2021-22 | (B) | integer | AssYr22_23 |
| — | G | Prior to 2022-23 | (A) | integer | *(folded to row Total)* |
| — | H | 2022-23 | (B) | integer | AssYr23_24 |
| — | I | 2023-24 | (C) | integer | AssYr24_25 |
| — | J | 2024-25 | (D) | integer | AssYr25_26 |
| — | K | 2025-26 | (E) | integer | *(latest bucket)* |
| — | L | Total (F) (A+B+C+D+E) | Total | integer | Total |

Note: the schema exposes five assessment-year amount leaves — `AssYrPriorToAY`,
`AssYr22_23`, `AssYr23_24`, `AssYr24_25`, `AssYr25_26` — plus the row `Total`; the
sheet's several "prior to" and year columns are the display buckets that feed
these leaves and the row Total. The bottom-right cell is `GrandTotal`.

---

## 3 · The law and the computation

**Section 11(1B)** provides that where income was **deemed to have been applied**
to the trust's objects under clause (2) of Explanation 1 to section 11(1) — i.e.
treated as applied because it had not been received, or for any other reason —
and is then **not actually applied** for that purpose in the year in which it was
required to be applied, the amount **not so applied** is **deemed to be the
income** of the previous year immediately following, and is taxed in the
corresponding assessment year.

Schedule DA does not compute a fresh charge; it is the **audit trail** of amounts
already taxed under 11(1B): for each **year of deemed application** it records how
much was taxed **in each earlier assessment year**. The row `Total` (col F =
A+B+C+D+E) ties each year's taxed amount together; the `GrandTotal` sums across
all years and assessment years and reconciles to the running column-5 tally in
Schedule D.

---

## 4 · Dropdowns / enums

There are **no value-list dropdowns** on Schedule DA. Every data-validation entry
is a `source "0"` numeric/text constraint with `values: null` (the row labels in
`C8:C14` and the amount cells across `D`–`L`). So there are no enum values to
seed.

---

## 5 · Cross-sheet feeds

**In:** the amounts are the section 11(1B) figures already carried in **Schedule D
column 5** ("Amount taxed in any earlier Assessment Year(s)"), disaggregated here
by year of deemed application × assessment year taxed.

**Out:** a reconciliation/detail schedule — its `GrandTotal` ties back to the
aggregate of Schedule D column 5; it does not itself feed a fresh figure into
Part B-TI.

---

## Appendix 1 · Every schema leaf of block ITRScheduleDA (full paths)
`*` = required.
```
* YrOfAccumDtls[] array
  YrOfAccumDtls[].YrOfAccumulationDA string
  YrOfAccumDtls[].AssYrPriorToAY integer
  YrOfAccumDtls[].AssYr22_23 integer
  YrOfAccumDtls[].AssYr23_24 integer
  YrOfAccumDtls[].AssYr24_25 integer
  YrOfAccumDtls[].AssYr25_26 integer
* YrOfAccumDtls[].Total integer
* GrandTotal integer
```

---

## Appendix 2 · Every live row of the sheet, verbatim
(Rows 7–9, the years "Prior to 2019-20", 2018-19 and 2019-20, are hidden; shown
for completeness of the year axis.)
```
[C3] Schedule DA  |  [D3] Details of deemed application of income taxed in earlier assessment years as per section 11(1B)
[D4] Assessment year in which the amount referred at Col 5 of Schedule D was taxed (Figures in Rs.)
[C5] Year of Deemed Application (F.Yr.)  |  [D5] Prior to 2021-22  |  [E5] 2020-21  |  [F5] 2021-22  |  [G5] Prior to 2022-23  |  [H5] 2022-23  |  [I5] 2023-24  |  [J5] 2024-25  |  [K5] 2025-26  |  [L5] Total
[C6] FY  |  [D6] (A)  |  [E6] (B)  |  [F6] (B)  |  [G6] (A)  |  [H6] (B)  |  [I6] (C)  |  [J6] (D)  |  [K6] (E)  |  [L6] (F) (A+B+C+D+E)
[C7] Prior to 2019-20   (hidden)
[C8] 2018-19            (hidden)
[C9] 2019-20            (hidden)
[C10] Prior to 2020-21
[C11] 2020-21
[C12] 2021-22
[C13] 2022-23
[C14] 2023-24
[B15] Total
```
