# Schedule UD — Unabsorbed Depreciation and Allowance under section 35(4)

## The shape
Schedule UD carries brought-forward **unabsorbed depreciation** (left block, columns 3–5) and **unabsorbed allowance under section 35(4)** (right block, columns 6–8), assessment year by assessment year. Each prior-year row records the amount brought forward, the amount set off against the current year's income, and the balance carried forward to the next year; the current assessment year (2026-27) sits on its own row. A Total row sums every money column across all years. The schema splits the current AY (`CurrAssYr`, `CurBalCFNY`, `CurAllowBalCFNY`) from the repeating prior-year array (`ScheduleUD[]`), plus one set of column totals.

## The items

### Block: ITR3ScheduleUD

| Sheet col / row | Field label | Type | Schema key | Rule / notes |
|---|---|---|---|---|
| Header r3 | Schedule UD — Unabsorbed depreciation and allowance under section 35(4) | — | — | Title row [C3]/[G3] |
| r5 | Depreciation (left block) / Allowance under section 35(4) (right block) | — | — | Block captions [E5]/[I5] |
| Col (1) | Sl. No. | integer | — (positional) | [C6]; auto `C8 = C7+1` |
| Col (2), current row (D7) | Assessment Year (2) | string | `CurrAssYr` | enum: **2026-27** (current AY, row 7) |
| Col (5), current row (H7) | Balance Carried forward to the next year (5) — depreciation | integer | `CurBalCFNY` | current AY depreciation balance CF |
| Col (8), current row (K7) | Balance Carried forward to the next year (8) — allowance | integer | `CurAllowBalCFNY` | current AY allowance balance CF |
| Col (2), prior rows | Assessment Year (2) | string | `ScheduleUD[].AssYr` | maxLength 7; format e.g. 2022-23; mandatory (Note r21) |
| Col (3) | Amount of brought forward unabsorbed depreciation (3) | integer | `ScheduleUD[].AmtBFUD` | mandatory |
| Col (3a) / (1A) | Amount as adjusted on account of opting for taxation u/s 115BAC (1A) (3a) | integer | `ScheduleUD[].AdjustAccTax115BACAmt` | optional |
| Col (4) | Amount of depreciation set-off against the current year income (4) | integer | `ScheduleUD[].AmtDeprSOCY` | ≤ (3) − (3a) |
| Col (5) | Balance Carried forward to the next year (5) — depreciation | integer | `ScheduleUD[].BalCFNY` | computed = (3) − (3a) − (4), floored 0 |
| Col (6) | Amount of brought forward unabsorbed allowance (6) | integer | `ScheduleUD[].AmtBFUAllow` | mandatory |
| Col (7) | Amount of allowance set-off against the current year income (7) | integer | `ScheduleUD[].AmtAllowSOCY` | ≤ (6) |
| Col (8) | Balance Carried forward to the next year (8) — allowance | integer | `ScheduleUD[].AllowBalCFNY` | computed = (6) − (7), floored 0 |
| Total r19, Col (3) | Total — brought forward unabsorbed depreciation | integer | `TotBFUDepritAmt` | `=SUM(UD.BF)` |
| Total r19, Col (3a) | Total — amount adjusted u/s 115BAC | integer | `TotAdjustAccTax115BACAmt` | `=SUM(UD.115BAC)`; optional |
| Total r19, Col (4) | Total — depreciation set-off against current year income | integer | `TotCurYrdepritSetoffInc` | `=SUM(UD.Setoff)` |
| Total r19, Col (5) | Total — depreciation balance carried forward | integer | `TotDepritBalCFNY` | `=SUM(UD.Balance,UDCY.Balance)` |
| Total r19, Col (6) | Total — brought forward unabsorbed allowance | integer | `TotBFUAllowAmt` | `=SUM(UD2.BF)` |
| Total r19, Col (7) | Total — allowance set-off against current year income | integer | `TotCurYrAllowSetoffInc` | `=SUM(UD2.Setoff)` |
| Total r19, Col (8) | Total — allowance balance carried forward | integer | `TotalBalCFNY` | `=SUM(UD2.Balance,UDCY2.Balance)` |

All money integers: minimum 0, maximum 99999999999999 (14 digits, non-negative, no decimal).

## The rules the sheet computes
- **[H8] `=MAX((E8-F8-G8),0)`** — depreciation Balance CF (5) = BF depreciation (3) − 115BAC adjustment (3a) − set-off (4), floored at 0 (same at H9, H10, H11, H17, H18). Rule 626: "value at Sl.No.5 should be equal to Sl.No. 3- 3a - 4".
- **[K8] `=MAX((I8-J8),0)`** — allowance Balance CF (8) = BF allowance (6) − set-off (7), floored at 0 (same at K9, K10, K11, K17, K18). Rule 627: "value at sl.no.8 should be equal to sl.no. 6 - Sl. No. 7".
- **[C8] `=C7+1`** — Sl. No. auto-increments row over row.
- **[E19] `=SUM(UD.BF)`**, **[F19] `=SUM(UD.115BAC)`**, **[G19] `=SUM(UD.Setoff)`**, **[H19] `=SUM(UD.Balance,UDCY.Balance)`**, **[I19] `=SUM(UD2.BF)`**, **[J19] `=SUM(UD2.Setoff)`**, **[K19] `=SUM(UD2.Balance,UDCY2.Balance)`** — column totals. Rule 628: "sum of individual row should match with value at total fields for all columns i.e. column 3 to 8".
- Rule 625: "value at Sl.No. 4 cannot be more than Sl.No. 3- Sl.No.3a in any of the row" (set-off ≤ BF − 115BAC adjustment).
- Rule 624: if New Tax Regime is not selected, Sl. No. 3a (115BAC adjustment) "should not be more than zero".
- Rule 629: "value at Sl. No. 5 for current assessment year should not exceed the value mentioned at Sl. No. 12iii of Schedule BP".
- Cross-sheet (rules 622/2955, 2960): depreciation set-off and allowance u/s 35(4) set-off must equal the corresponding brought-forward set-off in Schedule BFLA.
- VBA (`Sch UD`): Assessment Year mandatory ("Details of Assesment Year in Sch Unabsorbed Depriciation are Mandatory"); must be of appropriate format such as 2022-23, 2023-24; must be a consecutive year; must not exceed **AY 2025-26** (latest change "added by Chetan C M for AY 2026-27"); the **same Assessment Year cannot be selected more than once** ([UD.Button4] handler); depreciation/allowance set-off "cannot exceed Amount Brought forward"; balance CF must be non-negative, no decimal, up to 99,999,999,999,999; characters `< > & ' " $` are not allowed in text cells.

## Dropdowns
- **Assessment Year — D7:D18** (source list "7"): the enumerated values are not exposed by the dump (`values: null`). VBA constrains it: current AY row 7 = **2026-27**; prior-year rows must be a valid consecutive AY in format like 2022-23 / 2023-24, not exceeding AY 2025-26, and no AY may repeat. Schema enum for `CurrAssYr` is the single value **2026-27**.
- All money cells (E7:F7, I7, G7/J7, H7:H18/K7:K18, E8:E18/I8:I18, F8:F18, J8:J18, G8:G18, E19:K19) are plain numeric inputs (source "0", no enumerated list).

## What repeats and what is one figure
- **Repeats (array `ScheduleUD[]`):** one object per prior assessment year (sheet rows 8–18) with the eight per-year keys `AssYr`, `AmtBFUD`, `AdjustAccTax115BACAmt`, `AmtDeprSOCY`, `BalCFNY`, `AmtBFUAllow`, `AmtAllowSOCY`, `AllowBalCFNY`.
- **One figure each:** the current assessment year trio `CurrAssYr`, `CurBalCFNY`, `CurAllowBalCFNY` (row 7); and the seven column totals `TotBFUDepritAmt`, `TotAdjustAccTax115BACAmt`, `TotCurYrdepritSetoffInc`, `TotDepritBalCFNY`, `TotBFUAllowAmt`, `TotCurYrAllowSetoffInc`, `TotalBalCFNY` (row 19).

## Mandatory
Required schema keys: `CurrAssYr`, `CurBalCFNY`, `CurAllowBalCFNY`, `TotBFUDepritAmt`, `TotCurYrdepritSetoffInc`, `TotDepritBalCFNY`, `TotBFUAllowAmt`, `TotCurYrAllowSetoffInc`, `TotalBalCFNY`. Within each `ScheduleUD[]` element, required: `AssYr`, `AmtBFUD`, `AmtDeprSOCY`, `BalCFNY`, `AmtBFUAllow`, `AmtAllowSOCY`, `AllowBalCFNY`. Optional: `ScheduleUD[].AdjustAccTax115BACAmt` and the total `TotAdjustAccTax115BACAmt`. Note at [C21]: "* Note: Assessment Year in Col (2) is mandatory".

## Hidden rows — not built
None. Every row on this sheet (r3 title, r5 captions, r6 header, r7 current-AY row, r8–r18 prior-year entry rows, r19 Total, r21 note) is visible; the dump marks no row with the hidden `H` flag.

## What this means for the build
- Build the current AY row (2026-27) as a fixed, non-repeating row feeding `CurrAssYr`/`CurBalCFNY`/`CurAllowBalCFNY`; only its balance-CF columns (5) and (8) are captured in the schema, not its BF/set-off inputs.
- Build rows 8–18 as the repeatable `ScheduleUD[]` grid with the AY picker plus add/remove; enforce no-duplicate-AY, consecutive-year, format, and not-exceeding-AY-2025-26 in the AY field.
- Columns (5) and (8) are computed cells (green, untypeable): `(5)=MAX((3)-(3a)-(4),0)`, `(8)=MAX((6)-(7),0)`.
- Guard set-off: (4) ≤ (3) − (3a); (7) ≤ (6); and 115BAC adjustment (3a) forced to 0 when New Tax Regime is not selected.
- Total row sums columns (3)–(8) including the current-year balances (UDCY / UDCY2) into (5)/(8) totals.
- Feed depreciation set-off total and allowance-u/s-35(4) set-off total into Schedule BFLA (must match); constrain current-AY (5) against Schedule BP Sl. No. 12iii.
