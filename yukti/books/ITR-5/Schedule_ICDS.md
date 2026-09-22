# Schedule ICDS — Effect of Income Computation Disclosure Standards on profit

Form ITR-5, A.Y. 2026-27. Block: **ScheduleICDS** (section `bp`). Sheet: **Schedule ICDS**.
Sources: `tools/dump.py` (rows, `--formulas`, `--dropdowns`, `--schema/--leaves ScheduleICDS`), utility named ranges from `sources/ITR-5/utility/xl/workbook.xml`, VBA hints from `sources/ITR-5/vba_text.txt`, cross-rules from `books/ITR-5/rules.json`, and the official `sources/ITR-5/ITR-5_2026_Main_V1_1_schema.json` (`definitions/ScheduleICDS`).

## The shape
Schedule ICDS captures the **Effect of Income Computation Disclosure Standards on profit** — the adjustment each of the ten notified ICDS makes to book profit. It is a single, fixed, non-repeating table: ten live ICDS rows (Sl. No. I–X, sheet rows 6–15) each with three money columns — **Increase in Profit(+)** (col F), **Decrease in Profit(-)** (col G) and **Net Effect** (col H) — followed by one total row, Sl. No. XI (row 16: **Total effect of ICDS adjustments on profit (I+II+III+IV+V+VI+VII+VIII+IX+X)**). One figure per cell; nothing repeats. The two total figures (positive total = XI Increase, negative/decrease total = XI Decrease) feed **Part A-OI Sl. No. 3a and 3b**. There are **no hidden rows** on this sheet.

## The items

Column heads (sheet row 4): **Sl. No.** (col C) · **ICDS** (col D) · **Increase in Profit(+)** (col F) · **Decrease in Profit(-)** (col G) · **Net Effect** (col H). Per rules.json the columns are numbered 3 = Increase, 4 = Decrease, 5 = Net Effect; Net Effect (5) = Increase (3) − Decrease (4).

Each ICDS row (I–X) maps to one schema object of type `ICDSinfo`, with three integer leaves: `IncreaseInProfit` (col F), `DecreaseInProfit` (col G), `NetEffect` (col H). The total row (XI) maps to `TotalNetAmtDetl`, which has only `IncreaseInProfit` and `DecreaseInProfit` (no `NetEffect`).

| Sl. No. | ICDS (col D field label) | type | schema object.keys | Increase / Decrease / Net cell | rule |
|---|---|---|---|---|---|
| I | Accounting Policies | money ×3 | `AccPolicyAmtDetl.IncreaseInProfit`, `AccPolicyAmtDetl.DecreaseInProfit`, `AccPolicyAmtDetl.NetEffect` | F6 / G6 / H6 | Net H6 = F6−G6 |
| II | Valuation of Inventories (other than the effect of change in method of valuation u/s 145A, if the same is separately reported at col. 4d or 4e of Part A-OI) | money ×3 | `InventoriesValueDetl.IncreaseInProfit`, `InventoriesValueDetl.DecreaseInProfit`, `InventoriesValueDetl.NetEffect` | F7 / G7 / H7 | Net H7 = F7−G7 |
| III | Construction Contracts | money ×3 | `ConstContractsAmtDetl.IncreaseInProfit`, `ConstContractsAmtDetl.DecreaseInProfit`, `ConstContractsAmtDetl.NetEffect` | F8 / G8 / H8 | Net H8 = F8−G8 |
| IV | Revenue Recognition | money ×3 | `RevenueRcgAmtDetl.IncreaseInProfit`, `RevenueRcgAmtDetl.DecreaseInProfit`, `RevenueRcgAmtDetl.NetEffect` | F9 / G9 / H9 | Net H9 = F9−G9 |
| V | Tangible Fixed Assets | money ×3 | `TangibleFixedAssetDetl.IncreaseInProfit`, `TangibleFixedAssetDetl.DecreaseInProfit`, `TangibleFixedAssetDetl.NetEffect` | F10 / G10 / H10 | Net H10 = F10−G10 |
| VI | Changes in Foreign Exchange Rates | money ×3 | `ForeignExgRatesDetl.IncreaseInProfit`, `ForeignExgRatesDetl.DecreaseInProfit`, `ForeignExgRatesDetl.NetEffect` | F11 / G11 / H11 | Net H11 = F11−G11 |
| VII | Government Grants | money ×3 | `GovtGrantsDetl.IncreaseInProfit`, `GovtGrantsDetl.DecreaseInProfit`, `GovtGrantsDetl.NetEffect` | F12 / G12 / H12 | Net H12 = F12−G12 |
| VIII | Securities (other than the effect of change in method of valuation u/s 145A, if the same is separately reported at col. 4d or 4e of Part A-OI) | money ×3 | `SecuritiesDetl.IncreaseInProfit`, `SecuritiesDetl.DecreaseInProfit`, `SecuritiesDetl.NetEffect` | F13 / G13 / H13 | Net H13 = F13−G13 |
| IX | Borrowing Costs | money ×3 | `BorrowingCostsDetl.IncreaseInProfit`, `BorrowingCostsDetl.DecreaseInProfit`, `BorrowingCostsDetl.NetEffect` | F14 / G14 / H14 | Net H14 = F14−G14 |
| X | Provisions, Contingent Liabilities and Contingent Assets | money ×3 | `ProvAssetsDetl.IncreaseInProfit`, `ProvAssetsDetl.DecreaseInProfit`, `ProvAssetsDetl.NetEffect` | F15 / G15 / H15 | Net H15 = F15−G15 |
| XI | Total effect of ICDS adjustments on profit (I+II+III+IV+V+VI+VII+VIII+IX+X) | money ×2 | `TotalNetAmtDetl.IncreaseInProfit`, `TotalNetAmtDetl.DecreaseInProfit` | F16 / G16 / (H16) | computed totals; **no** `NetEffect` key on this row |

## The rules the sheet computes
- **[H6]** `= F6-G6` — Net Effect (I) = Increase − Decrease. (Named range `ICDS.AccPolicies` = H6.)
- **[H7:H15]** shared formula `= F<r>-G<r>` (`<f t="shared" ref="H7:H15" si="0">F7-G7`) — Net Effect for rows II–X = Increase − Decrease. Named net cells: `ICDS.ValuationInv` H7, `ICDS.ConsContracts` H8, `ICDS.RevenueRecog` H9, `ICDS.TangibleFixAssests` H10, `ICDS.ChngRates` H11, `ICDS.Govgrants` H12, `ICDS.Securities` H13, `ICDS.BorrowingCosts` H14, `ICDS.ProvLiability` H15.
- **[F16]** `= MAX(0,SUM(F6:F15))` — Total Increase in Profit (XI, column 3), floored at 0 → `TotalNetAmtDetl.IncreaseInProfit`. Named range `ICDS.Total` = F16.
- **[G16]** `= MAX(0,SUM(G6:G15))` — Total Decrease in Profit (XI, column 4), floored at 0 → `TotalNetAmtDetl.DecreaseInProfit`. Named range `ICDS.DeTotal1` = G16.
- **[H16]** `= SUM(H6:H15)` — Total Net Effect (XI, column 5) = sum of the ten net effects. Named range `ICDS.PositiveTotal` = H16.
- **[K4]** (helper, `ICDS.FilledFlag`) `= IF(OR(ICDS.AccPolicies<>"",ICDS.ValuationInv<>"",ICDS.ConsContracts<>"",ICDS.RevenueRecog<>"",ICDS.TangibleFixAssests<>"",ICDS.ChngRates<>"",ICDS.Govgrants<>"",ICDS.Securities<>"",ICDS.BorrowingCosts<>"",ICDS.ProvLiability<>""),TRUE,FALSE)` — TRUE when any of the ten Net-Effect cells is non-empty. VBA gates emission of `<ScheduleICDS>` on `ICDS.FilledFlag` (only emit the block when the flag is TRUE).
- Cross-rule (rules.json line 2890): "In Schedule ICDS, value at field in 'XI' Total effect of ICDS adjustments on profit should be equal to sum of (I + II + III + IV + V + VI + VII + VIII + IX + X)."
- Cross-rule (rules.json line 2895): "In Schedule ICDS, Sl.No. 5 - Net Effect should be equal to Sl. No. 3 (Increase in profit) Less Sl. No. 4 (Decrease in profit)."
- Cross-sheet (rules.json line 900): "Part A-OI Sl.no 3a of Part A-OI should be equal to column XI(3) of schedule ICDS" — Part A-OI **3a** = XI Increase = F16 (`TotalNetAmtDetl.IncreaseInProfit`).
- Cross-sheet (rules.json line 905): "Part A-OI sl no 3b should be equal to column XI(4) of schedule ICDS" — Part A-OI **3b** = XI Decrease = G16 (`TotalNetAmtDetl.DecreaseInProfit`).

## Dropdowns
No enumerated (list) dropdowns exist on this sheet. `tools/dump.py --dropdowns "Schedule ICDS"` returns only numeric-range data-validation entries (source values `null`, i.e. min-bound constraints, not pick-lists):
- **F6:G15** (per-ICDS Increase and Decrease cells): minimum `0`.
- **H6:H15** (per-ICDS Net Effect): minimum `-99999999999999`.
- **H16** (Total Net Effect): minimum `-99999999999999`.

Schema bounds: every `IncreaseInProfit` / `DecreaseInProfit` leaf is integer `0 … 99999999999999`; every `NetEffect` leaf is integer `-99999999999999 … 99999999999999`.

## What repeats and what is one figure
Nothing repeats. The schedule is a fixed table of eleven rows (ten ICDS I–X + one total XI); each is a distinct named schema object — there are no arrays. Every cell holds exactly one figure.

## Mandatory
Schema `required`: **`TotalNetAmtDetl`** (the total object, holding `TotalNetAmtDetl.IncreaseInProfit` and `TotalNetAmtDetl.DecreaseInProfit`). The ten per-ICDS detail objects — `AccPolicyAmtDetl`, `InventoriesValueDetl`, `ConstContractsAmtDetl`, `RevenueRcgAmtDetl`, `TangibleFixedAssetDetl`, `ForeignExgRatesDetl`, `GovtGrantsDetl`, `SecuritiesDetl`, `BorrowingCostsDetl`, `ProvAssetsDetl` — are optional. The whole `ScheduleICDS` block is emitted only when `ICDS.FilledFlag` (K4) is TRUE.

## Hidden rows — not built
**None.** `tools/dump.py --form ITR-5 --sheet "Schedule ICDS"` marks no row `H`; the raw worksheet has no `hidden="1"` rows. Sheet rows 17–19 exist but are empty (no content, not hidden). Note: the workbook still carries a dangling defined name `ICDS.NegativeTotal` pointing at `#REF!` — a leftover from an older layout's negative-total mirror row; it resolves to nothing and there is **no** such row or schema key in the AY 2026-27 utility, so nothing is built for it.

## What this means for the build
- Render one fixed 10-row table (Sl. No. I–X in col C, ICDS label in col D, then three money columns F/G/H) plus a total row XI. Heads: **Sl. No.** · **ICDS** · **Increase in Profit(+)** · **Decrease in Profit(-)** · **Net Effect**.
- Per ICDS row: Increase (`IncreaseInProfit`) and Decrease (`DecreaseInProfit`) are typed money inputs (min 0); Net Effect (`NetEffect`) is **computed** (read-only) = Increase − Decrease.
- Total row XI: Increase = `MAX(0, ΣF6:F15)` → `TotalNetAmtDetl.IncreaseInProfit`; Decrease = `MAX(0, ΣG6:G15)` → `TotalNetAmtDetl.DecreaseInProfit`; Net Effect display = `ΣH6:H15`. Do **not** emit a `NetEffect` under `TotalNetAmtDetl` — the schema stops at Increase/Decrease for the total.
- Feed Part A-OI: **3a** = XI Increase (F16), **3b** = XI Decrease (G16). Compute this sheet before Part A-OI reads those totals.
- Emit the `ScheduleICDS` block only when at least one Net-Effect cell is filled (FilledFlag K4 TRUE).
- Build no hidden rows (there are none) and ignore the dangling `ICDS.NegativeTotal` (#REF!) defined name.
