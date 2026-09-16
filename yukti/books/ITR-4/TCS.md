# Schedule TCS — Details of Tax Collected at Source (ITR-4)

## The shape
Schedule TCS (`Sch TCS`) records **Details of Tax Collected at Source [As per Form 27D issued by the Collector(s)]**. It is a single repeating grid: one row per collector, each carrying the collector's TAN and name, the amount paid as reflected in Form 26AS, the tax collected, the amount of that TCS being claimed this year, and (where section 5A applies) the amount claimed in the hands of the spouse. A TOTAL row sums the "claimed this year" column into one figure, which the assessee must also carry into the Part B taxes-paid schedule (D16).

## The items

### Block: ScheduleTCS

| Sheet col / item | Field label | Type | Schema key | Rule / notes |
|---|---|---|---|---|
| — | `Sch TCS` — Details of Tax Collected at Source [As per Form 27D issued by the Collector(s)] | section header (row 3) | `TCS[]` (array) | The whole grid repeats; each filled row is one array element |
| Col (1) `Sl.No` | Sl.No, | auto integer | — (row index) | `[D7]=D6+1`, `[D8]=D7+1`, `[D9]=D8+1`, `[D10]=D9+1` — auto-numbered, not a schema field |
| Col (1) `(1)` | Tax Collection Account Number of the Collector | string | `TCS[].EmployerOrDeductorOrCollectDetl.TAN` | Mandatory; TAN of the collector |
| Col (2) `(2)` | Name of the Collector | string (maxLength 125) | `TCS[].EmployerOrDeductorOrCollectDetl.EmployerOrDeductorOrCollecterName` | Mandatory |
| Col (3) `(3)` | Details of amount paid as mentioned in Form 26AS | integer | `TCS[].Amtfrom26AS` | 0 ≤ x ≤ 99999999999999 |
| Col (4) `(4)` | Tax Collected | integer | `TCS[].TotalTCS` | 0 ≤ x ≤ 99999999999999 |
| Col (5) `(5)` | Amount out of Col (4) being claimed (Col(5)) | integer | `TCS[].AmtTCSClaimedThisYear` | 0 ≤ x ≤ 99999999999999; cannot exceed Tax Collected |
| Col (6) `(6)` | Amount out of (4) being claimed in the hands of spouse, if section 5A is applicable | integer | *(sheet range `TCS.AmtClaimedBySpouse`; **no leaf in the ScheduleTCS schema block** — section 5A apportionment is not part of the ITR-4 ScheduleTCS export)* | Present on the sheet as col (6) but not a ScheduleTCS schema leaf |
| `TOTAL` | TOTAL (of column (5)) | integer | `TotalSchTCS` | `[I11]=SUM(TCS.AmtTCSClaimedThisYear)`; the single total figure |
| Note (row 13) | Note: Please enter total of column (5) of Schedule-TCS in D16 | note | — | Carry `TotalSchTCS` into the Part B taxes-paid schedule at D16 |

## The rules the sheet computes
- `[D7]=D6+1`, `[D8]=D7+1`, `[D9]=D8+1`, `[D10]=D9+1` — Sl.No auto-increments down the grid.
- `[I11]=SUM(TCS.AmtTCSClaimedThisYear)` — TOTAL row is the sum of column (5) "amount being claimed this year" across all rows; this is `TotalSchTCS`.
- Row 13 note: the total of column (5) of Schedule TCS must be entered in **D16** (Part B taxes-paid schedule).
- Validation (VBA `ValidatesheetTCS`): each row must have **all** of TAN, collector name, amount paid, TotalTCS and AmtTCSClaimedThisYear filled — "Please fill all the Mandatory Fields".
- Validation (VBA, rules.json): "Amount claimed for this year cannot be more than total tax collected" — col (5) `AmtTCSClaimedThisYear` ≤ col (4) `TotalTCS` ("The Amount of TCS claimed this year is more than Tax collected").
- Validation (rules.json): "total of col 5 TCS credit out of (4) being claimed this year should be equal to sum of individual values" — `TotalSchTCS` must equal the sum of the per-row col (5) values.
- Cross-schedule (rules.json): in "Schedule Taxes Paid and Verification", Total TCS Claimed must equal the sum of total TCS claimed in the TCS schedule.
- Value bound: each amount must be Numeric, Non-Negative, not exceeding 14 digits (maximum 99999999999999).

## Dropdowns
There are **no dropdown value lists** in Schedule TCS. The data-validation entries on the grid (`E6:E10`, `F6:F10`, `G6:G10`, `H6:H10`, `I6:I10`, `J6:J10`, `I11`, `J11`) carry only text/number type constraints (type codes / length caps such as 125 for the name column), not enumerated pick-lists — every dropdown `values` set is null. (A `TCS.SectionTCSDeducted` "(Select)" column exists in the VBA for other assessment years but is not part of the current ITR-4 TCS grid rows.)

## What repeats and what is one figure
- **Repeats (array `TCS[]`):** each collector row — `EmployerOrDeductorOrCollectDetl.TAN`, `EmployerOrDeductorOrCollectDetl.EmployerOrDeductorOrCollecterName`, `Amtfrom26AS`, `TotalTCS`, `AmtTCSClaimedThisYear`.
- **One figure:** `TotalSchTCS` — the single TOTAL of column (5) across all rows.

## Mandatory
- Schema `required` at the block level: **`TotalSchTCS`**.
- Within each array element (schema `*` required leaves): `EmployerOrDeductorOrCollectDetl` (`TAN`, `EmployerOrDeductorOrCollecterName`), `Amtfrom26AS`, `TotalTCS`, `AmtTCSClaimedThisYear`.
- VBA enforces that a filled row carries all of TAN, collector name, amount paid, tax collected and amount claimed.

## Hidden rows — not built
None. The TCS sheet dump contains no rows flagged `H`; rows 3–5 are the header/column-label rows, rows 6–10 are the entry grid, row 11 is TOTAL, and row 13 is the note.

## What this means for the build
- Build one repeating table (`TCS[]`); each row maps col (1)→`EmployerOrDeductorOrCollectDetl.TAN`, col (2)→`EmployerOrDeductorOrCollectDetl.EmployerOrDeductorOrCollecterName`, col (3)→`Amtfrom26AS`, col (4)→`TotalTCS`, col (5)→`AmtTCSClaimedThisYear`.
- Compute `TotalSchTCS` as the sum of every row's `AmtTCSClaimedThisYear` (col 5), and surface the row-13 instruction to carry it into D16.
- Enforce per-row: `AmtTCSClaimedThisYear` ≤ `TotalTCS`; all amounts non-negative integers ≤ 99999999999999; name ≤ 125 chars; all mandatory fields present when a row is filled.
- Column (6) "Amount out of (4) being claimed in the hands of spouse, if section 5A is applicable" appears on the sheet (range `TCS.AmtClaimedBySpouse`) but has **no leaf in the ScheduleTCS schema block** — do not add a schema field for it under ScheduleTCS; treat it as sheet-only unless a separate 5A block requires it.
