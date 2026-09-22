# Unabsorbed Depreciation — Schedule UD (ITR-5, A.Y. 2026-27)

One utility worksheet ("Unabsorbed Depreciation") holds a single schedule: **Schedule UD — Unabsorbed depreciation and allowance under section 35(4)** (row 3 header: C3 = "Schedule UD", G3 = "Unabsorbed depreciation and allowance under section 35(4)"). It maps to the schema block **ITRScheduleUD** (`section_map.json`: `{"blocks": ["ITRScheduleUD"], "section": "loss"}`).

The schedule records, assessment-year by assessment-year, the brought-forward **unabsorbed depreciation** and the brought-forward **allowance under section 35(4)** (in-house scientific research), how much of each is set off against current-year income, and the balance carried forward to the next year.

---

## The shape

Schedule UD is **two side-by-side sub-tables sharing one assessment-year column**, split by the row-5 super-header: E5 = "Depreciation" (columns 3-5) and I5 = "Allowance under section 35(4)" (columns 6-8). Row 6 carries the numbered column headers; the data grid runs rows 7-16; row 19 is the "Total" row.

- **Row 7** is the **current assessment year** row — D7 = "2026-27" is pre-filled and fixed. It is a **single, one-off figure row** (not part of the repeating array). Its balance cells map to the top-level scalar leaves `CurrAssYr`, `CurBalCFNY`, `CurAllowBalCFNY`.
- **Rows 8-16** are the **repeating grid** of earlier assessment years (the `ScheduleUD[]` array). C8 = `C7+1`, C9 = `C8+1`, … auto-number the Sl. No.; the AY in column D is user-entered for each prior year. Rows 8-16 give up to 9 earlier-year lines.
- **Row 19 ("Total")** sums each column across the current-year row plus the array rows.

Columns (row 6 numbering, sheet columns C-K):

| Col | Sheet col | Header (row 6) |
|---|---|---|
| (1) | C | Sl. No. (1) |
| (2) | D | Assessment Year (2) |
| (3) | E | Amount of brought forward unabsorbed depreciation (3) |
| (3a) | F | Amount as adjusted on account of opting for taxation under section 115BAD or 115BAC(1A) (3a) |
| (4) | G | Amount of depreciation set-off against the current year income (4) |
| (5) | H | Balance Carried forward to the next year (5) |
| (6) | I | Amount of brought forward unabsorbed allowance (6) |
| (7) | J | Amount of allowance set-off against the current year income (7) |
| (8) | K | Balance Carried forward to the next year (8) |

Columns 3-5 (E/F/G/H) are the **Depreciation** sub-table; columns 6-8 (I/J/K) are the **Allowance under section 35(4)** sub-table. Columns 3, 3a, 4, 6, 7 are user inputs (numeric); columns 5 and 8 (the carry-forward balances) and row 19 are computed.

---

## The items (block `ITRScheduleUD`)

**Current-year row (row 7) — top-level scalar leaves:**

| Sl.No. | Sheet cell | Field | Type | Schema key | Rule |
|---|---|---|---|---|---|
| (current) | D7 | Assessment Year = 2026-27 (fixed) | fixed value | `CurrAssYr` (enum, only value `2026-27`) | pre-filled current AY |
| (5) | H7 | Balance carried forward to next year — depreciation, current AY | input | `CurBalCFNY` | integer 0…99999999999999 |
| (8) | K7 | Balance carried forward to next year — allowance u/s 35(4), current AY | input | `CurAllowBalCFNY` | integer 0…99999999999999 |

(For the current-AY row, columns 3/3a/4/6/7 are not captured as schema leaves — only the two carry-forward balances `CurBalCFNY` and `CurAllowBalCFNY` are emitted, plus `CurrAssYr`.)

**Earlier-year rows (rows 8-16) — repeating array `ScheduleUD[]` (one object per prior AY):**

| Col | Sheet cells | Field | Type | Schema key | Rule |
|---|---|---|---|---|---|
| (2) | D8:D16 | Assessment Year | input | `ScheduleUD[].AssYr` | Assessment year (string) |
| (3) | E8:E16 | Amount of brought forward unabsorbed depreciation | input | `ScheduleUD[].AmtBFUD` | integer 0…99999999999999 |
| (3a) | F8:F16 | Amount as adjusted on account of opting for taxation u/s 115BAD / 115BAC(1A) | input | `ScheduleUD[].AdjustAccTax115BADAmt` | integer; must be 0 if not opting new regime (see rules) |
| (4) | G8:G16 | Amount of depreciation set-off against the current year income | input | `ScheduleUD[].AmtDeprSOCY` | ≤ col 3 − col 3a |
| (5) | H8:H16 | Balance Carried forward to the next year (depreciation) | computed | `ScheduleUD[].BalCFNY` | H = MAX(E − F − G, 0) |
| (6) | I8:I16 | Amount of brought forward unabsorbed allowance u/s 35(4) | input | `ScheduleUD[].AmtBFUAllow` | integer 0…99999999999999 |
| (7) | J8:J16 | Amount of allowance set-off against the current year income | input | `ScheduleUD[].AmtAllowSOCY` | integer 0…99999999999999 |
| (8) | K8:K16 | Balance Carried forward to the next year (allowance) | computed | `ScheduleUD[].AllowBalCFNY` | K = MAX(I − J, 0) |

**Total row (row 19) — top-level scalar leaves:**

| Col | Sheet cell | Field | Type | Schema key | Rule |
|---|---|---|---|---|---|
| (3) | E19 | Total brought forward unabsorbed depreciation | computed | `TotBFUDepritAmt` | = SUM(UD.BF) |
| (3a) | F19 | Total amount adjusted (115BAD/115BAC) | computed | `TotAdjustAccTax115BADAmt` | = SUM(UD.Amtadjopttax115BAD) |
| (4) | G19 | Total depreciation set-off against current year income | computed | `TotCurYrdepritSetoffInc` | = SUM(UD.Setoff) — **feeds Schedule BFLA (col 4 total)** |
| (5) | H19 | Total balance carried forward (depreciation) | computed | `TotDepritBalCFNY` | = SUM(UD.Balance) + UDCY.Balance |
| (6) | I19 | Total brought forward unabsorbed allowance | computed | `TotBFUAllowAmt` | = SUM(UD2.BF) |
| (7) | J19 | Total allowance set-off against current year income | computed | `TotCurYrAllowSetoffInc` | = SUM(UD2.Setoff) — **feeds Schedule BFLA (col 7 total)** |
| (8) | K19 | Total balance carried forward (allowance) | computed | `TotalBalCFNY` | = SUM(UD2.Balance) + UDCY2.Balance |

Named ranges: `UD.BF`→col 3, `UD.Amtadjopttax115BAD`→col 3a, `UD.Setoff`→col 4, `UD.Balance`→col 5, `UD2.BF`→col 6, `UD2.Setoff`→col 7, `UD2.Balance`→col 8; `UDCY.Balance`→H7 (current-year depreciation balance), `UDCY2.Balance`→K7 (current-year allowance balance).

---

## The rules the sheet computes (with cell references)

**Per-row carry-forward balances (rows 8-16):**
- `[H8]` = `MAX((E8-F8-G8),0)` … `[H16]` = `MAX((E16-F16-G16),0)` — depreciation balance CF = brought-forward (col 3) − amount adjusted for regime (col 3a) − set-off (col 4), floored at 0. (Rule n=574: "value at sl.no.5 should be equal to sl.no. 3 − sl.no.3a − 4 in all the rows".)
- `[K8]` = `MAX((I8-J8),0)` … `[K16]` = `MAX((I16-J16),0)` — allowance balance CF = brought-forward (col 6) − set-off (col 7), floored at 0. (Rule n=575: "value at sl.no.8 should be equal to sl.no. 6 − Sl. No. 7".)

**Sl. No. auto-numbering:** `[C8]` = `C7+1`, `[C9]` = `C8+1`, … (each earlier-year row numbers one higher than the row above).

**Regime helper:** `[O7]` = `IF(bacValue=1,1,0)` — off-table flag set when the assessee has opted for the new tax regime (bacValue=1); drives column 3a (rule n=572: "value at sl. No. 3a should be '0' if the assessee opted for New Tax Regime u/s 115BAD / 115BAC(1A)").

**Column totals (row 19):**
- `[E19]` = `SUM(UD.BF)`; `[F19]` = `SUM(UD.Amtadjopttax115BAD)`; `[G19]` = `SUM(UD.Setoff)`; `[H19]` = `SUM(UD.Balance)+UDCY.Balance`.
- `[I19]` = `SUM(UD2.BF)`; `[J19]` = `SUM(UD2.Setoff)`; `[K19]` = `SUM(UD2.Balance)+UDCY2.Balance`.
- (Rule n=576: "sum of individual row should match with value at total fields for all columns i.e. column 3 to 8".)

**Validation rules (rules.json, cat A):**
- n=572: col 3a must be "0" if opted new regime u/s 115BAD / 115BAC(1A).
- n=573: col 4 (depreciation set-off) must not be more than col 3 − col 3a.
- n=574: col 5 = col 3 − col 3a − col 4 (all rows).
- n=575: col 8 = col 6 − col 7.
- n=576: totals (row 19) = sum of individual rows for columns 3 to 8.
- n=577: col 5 for the current assessment year should not exceed the value at Sl. No. 12iii of Schedule DEP (current-year depreciation).

**The two totals that feed Schedule BFLA:**
- **Col 4 total — `G19` = `TotCurYrdepritSetoffInc`** (depreciation set-off). Rule n=534: "In Sch BFLA, value at 3xv Brought forward depreciation set off should be equal to value at field total of Col. 4 of UD" → BFLA row xv, column 3 (`TotalBFLossSetOff.TotUnabsorbedDeprSetoff`).
- **Col 7 total — `J19` = `TotCurYrAllowSetoffInc`** (allowance u/s 35(4) set-off). Rule n=533: "In Sch BFLA, value at 4xv Brought forward allowance under section 35(4) set off should be equal to value at total field … of Col. 7 of UD" → BFLA row xv, column 4 (`TotalBFLossSetOff.TotAllUs35cl4Setoff`).

---

## Dropdowns

There are **no value-list dropdowns** on this sheet. The eight validation entries returned by `--dropdowns` (`D7:D16`, `E7:F16 I7:I16`, `G7 J7`, `K7 H7`, `E19:K19`, `G9:G11 G13:G16`, `G8 G12`, `J8:J16`) all have `values: null` — they are numeric/whole-number input constraints, not selectable lists.

---

## What repeats and what is one figure

- **Repeats:** rows 8-16 — the `ScheduleUD[]` array, one object per earlier assessment year (up to 9 lines), each carrying AssYr + the six input columns + two computed balances.
- **One figure (scalar, non-repeating):**
  - Current-AY row (row 7): `CurrAssYr` (fixed "2026-27"), `CurBalCFNY` (H7), `CurAllowBalCFNY` (K7).
  - Total row (row 19): `TotBFUDepritAmt`, `TotAdjustAccTax115BADAmt`, `TotCurYrdepritSetoffInc`, `TotDepritBalCFNY`, `TotBFUAllowAmt`, `TotCurYrAllowSetoffInc`, `TotalBalCFNY`.

---

## Mandatory (schema `required`)

All top-level leaves are required: `CurrAssYr`, `CurBalCFNY`, `CurAllowBalCFNY`, `TotBFUDepritAmt`, `TotAdjustAccTax115BADAmt`, `TotCurYrdepritSetoffInc`, `TotDepritBalCFNY`, `TotBFUAllowAmt`, `TotCurYrAllowSetoffInc`, `TotalBalCFNY`.

The `ScheduleUD[]` array is itself optional (not in the block's required list), but **when a row is present every element field is required**: `AssYr`, `AmtBFUD`, `AdjustAccTax115BADAmt`, `AmtDeprSOCY`, `BalCFNY`, `AmtBFUAllow`, `AmtAllowSOCY`, `AllowBalCFNY`. All integer leaves are bounded 0 … 99999999999999.

---

## Hidden rows — not built

**None.** No row on this sheet is marked hidden (H) by `tools/dump.py`. (Rows 8-18 are simply empty input rows of the earlier-year grid; the VBA `sheet1.rows("19:19").Hidden` references seen in `vba_text.txt` belong to Sheet1 / Part A-General, not this sheet.)

---

## What this means for the build

- Emit block **ITRScheduleUD** with three parts: (1) the scalar current-year leaves `CurrAssYr`/`CurBalCFNY`/`CurAllowBalCFNY` from row 7; (2) the `ScheduleUD[]` array from rows 8-16; (3) the seven scalar totals from row 19.
- `CurrAssYr` is a fixed enum ("2026-27") — write it as a constant, do not solicit it.
- Compute, do not collect, columns 5 and 8 and the whole of row 19: `BalCFNY = max(AmtBFUD − AdjustAccTax115BADAmt − AmtDeprSOCY, 0)`, `AllowBalCFNY = max(AmtBFUAllow − AmtAllowSOCY, 0)`; totals = column sums across the array plus the current-year balances.
- Enforce col 4 ≤ col 3 − col 3a (rule 573) and col 3a = 0 when the new regime (bacValue=1) is opted (rule 572).
- **Cross-schedule wiring:** push `TotCurYrdepritSetoffInc` (col-4 total) into Schedule BFLA row xv col 3 (`TotalBFLossSetOff.TotUnabsorbedDeprSetoff`) and `TotCurYrAllowSetoffInc` (col-7 total) into Schedule BFLA row xv col 4 (`TotalBFLossSetOff.TotAllUs35cl4Setoff`). Also cap the current-AY depreciation balance (col 5, current year) at Schedule DEP 12iii (rule 577).
