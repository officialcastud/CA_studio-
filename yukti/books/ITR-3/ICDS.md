# Schedule ICDS — Effect of Income Computation Disclosure Standards on profit

## The shape
Schedule ICDS reports the effect of the ten notified Income Computation and Disclosure Standards on the profit of a business or profession. Each of the ten ICDS gets one live row with three money columns — Increase in Profit (+), Decrease in Profit (-) and Net Effect — followed by a total row (Sl. No. XI) that sums the ten. It is a single, non-repeating table (one figure per cell), and there is one hidden mirror row for the negative total that the utility computes but the taxpayer never fills.

## The items

Column heads (row 4): **Sl. No.** (col I) · **ICDS** (col II) · **Increase in Profit (+)** (col III) · **Decrease in Profit(-)** (col IV) · **Net Effect** (col V). The Net Effect column = Increase (III) − Decrease (IV) for each row.

Each ICDS row maps to one schema object with three leaves: `IncreaseInProfit` (col III), `DecreaseInProfit` (col IV) and `NetEffect` (col V).

| Sl. No. | ICDS (field label) | type | schema object / keys | rule/notes |
|---|---|---|---|---|
| I | Accounting Policies | money ×3 | `AccPolicyAmtDetl.IncreaseInProfit`, `AccPolicyAmtDetl.DecreaseInProfit`, `AccPolicyAmtDetl.NetEffect` | Net = In − De (H6) |
| II | Valuation of Inventories (other than the effect of change in method of valuation u/s 145A, if the same is separately reported at col. 4d or 4e of Part A-OI) | money ×3 | `InventoriesValueDetl.IncreaseInProfit`, `InventoriesValueDetl.DecreaseInProfit`, `InventoriesValueDetl.NetEffect` | Net = In − De (H7) |
| III | Construction Contracts | money ×3 | `ConstContractsAmtDetl.IncreaseInProfit`, `ConstContractsAmtDetl.DecreaseInProfit`, `ConstContractsAmtDetl.NetEffect` | Net = In − De (H8) |
| IV | Revenue Recognition | money ×3 | `RevenueRcgAmtDetl.IncreaseInProfit`, `RevenueRcgAmtDetl.DecreaseInProfit`, `RevenueRcgAmtDetl.NetEffect` | Net = In − De (H9) |
| V | Tangible Fixed Assets | money ×3 | `TangibleFixedAssetDetl.IncreaseInProfit`, `TangibleFixedAssetDetl.DecreaseInProfit`, `TangibleFixedAssetDetl.NetEffect` | Net = In − De (H10) |
| VI | Changes in Foreign Exchange Rates | money ×3 | `ForeignExgRatesDetl.IncreaseInProfit`, `ForeignExgRatesDetl.DecreaseInProfit`, `ForeignExgRatesDetl.NetEffect` | Net = In − De (H11) |
| VII | Government Grants | money ×3 | `GovtGrantsDetl.IncreaseInProfit`, `GovtGrantsDetl.DecreaseInProfit`, `GovtGrantsDetl.NetEffect` | Net = In − De (H12) |
| VIII | Securities(other than the effect of change in method of valuation u/s 145A, if the same is separately reported at col. 4d or 4e of Part A-OI) | money ×3 | `SecuritiesDetl.IncreaseInProfit`, `SecuritiesDetl.DecreaseInProfit`, `SecuritiesDetl.NetEffect` | Net = In − De (H13) |
| IX | Borrowing Costs | money ×3 | `BorrowingCostsDetl.IncreaseInProfit`, `BorrowingCostsDetl.DecreaseInProfit`, `BorrowingCostsDetl.NetEffect` | Net = In − De (H14) |
| X | Provisions, Contingent Liabilities and Contingent Assets | money ×3 | `ProvAssetsDetl.IncreaseInProfit`, `ProvAssetsDetl.DecreaseInProfit`, `ProvAssetsDetl.NetEffect` | Net = In − De (H15) |
| XI | Total effect of ICDS adjustments on profit (I+II+III+IV+V+VI+VII+VIII+IX+X) | money ×2 | `TotalNetAmtDetl.IncreaseInProfit`, `TotalNetAmtDetl.DecreaseInProfit` | computed totals; this row has **no** NetEffect key (schema stops at Increase/Decrease) |

## The rules the sheet computes
- **[H6]** `= ICDS.InAccPolicies - ICDS.DeAccPolicies` — Net Effect (I) = Increase − Decrease.
- **[H7]** `= ICDS.InValuationInv - ICDS.DeValuationInv` — Net Effect (II).
- **[H8]** `= ICDS.InConsContracts - ICDS.DeConsContracts` — Net Effect (III).
- **[H9]** `= ICDS.InRevenueRecog - ICDS.DeRevenueRecog` — Net Effect (IV).
- **[H10]** `= ICDS.InTangibleFixAssests - ICDS.DeTangibleFixAssests` — Net Effect (V).
- **[H11]** `= ICDS.InChngRates - ICDS.DeChngRates` — Net Effect (VI).
- **[H12]** `= ICDS.InGovgrants - ICDS.DeGovgrants` — Net Effect (VII).
- **[H13]** `= ICDS.InSecurities - ICDS.DeSecurities` — Net Effect (VIII).
- **[H14]** `= ICDS.InBorrowingCosts - ICDS.DeBorrowingCosts` — Net Effect (IX).
- **[H15]** `= ICDS.InProvLiability - ICDS.DeProvLiability` — Net Effect (X).
- **[F16]** `= MAX(0, SUM(F6:F15))` — Total Increase in Profit (XI); floored at 0 (so the positive total maps to `TotalNetAmtDetl.IncreaseInProfit`).
- **[G16]** `= MAX(0, SUM(G6:G15))` — Total Decrease in Profit (XI); floored at 0 (maps to `TotalNetAmtDetl.DecreaseInProfit`).
- **[H16]** `= SUM(H6:H15)` — Total Net Effect (XI) = sum of the ten net effects.
- **[F17]** (HIDDEN) `= (MIN(0, SUM(F6:F15)) * -1)` — negative-total mirror; see Hidden rows.
- **[L4]** helper flag: `IF(OR(ICDS.InAccPolicies<>"", ICDS.InValuationInv<>"", ICDS.InConsContracts<>"", ICDS.InRevenueRecog<>"...`, a validator that fires when any ICDS Increase field is filled (used to gate whether the schedule must be reported). Hidden helper column.
- Cross-rule (rules.json #3150): "In Schedule ICDS, Sl.No. XI should be equal to the sum of (I+II+III+IV+V+VI+VII+VIII+IX+X)".
- Cross-rule (rules.json #3155): "In Schedule ICDS, Sl.No. 5 - Net Effect should be equal to Sl.No. 3 (Increase in profit) Less Sl.No. 4 (Decrease in profit)."
- Cross-sheet (rules.json #1285 / #1305): the ICDS increase feeds Schedule BP Sl. No. A25 (increase in profit / decrease in loss) and the decrease feeds BP A32 (decrease in profit / increase in loss).

## Dropdowns
No enumerated (list) dropdowns exist on this sheet. The only data-validation entries are numeric range constraints on the money cells:
- **F6:F15** (Increase in Profit, per-ICDS): minimum `0`.
- **F16** (Total Increase): minimum `0`.
- **H6:H15, G6:G14, G15** (Net Effect per-ICDS and Decrease cells): minimum `-99999999999999`.
- **G16** (Total Decrease): minimum `-999999999999999`.
- **H16** (Total Net Effect): minimum `-99999999999999`.

Schema bounds: every Increase/Decrease leaf is integer `0 … 99999999999999`; every NetEffect leaf is integer `-99999999999999 … 99999999999999`.

## What repeats and what is one figure
Nothing repeats. The schedule is a fixed table of eleven rows (ten ICDS + one total), each a distinct named object in the schema — there are no arrays. Every cell holds exactly one figure.

## Mandatory
Schema `required`: **`TotalNetAmtDetl`** (the total object, holding `TotalNetAmtDetl.IncreaseInProfit` and `TotalNetAmtDetl.DecreaseInProfit`). The ten per-ICDS detail objects (`AccPolicyAmtDetl`, `InventoriesValueDetl`, `ConstContractsAmtDetl`, `RevenueRcgAmtDetl`, `TangibleFixedAssetDetl`, `ForeignExgRatesDetl`, `GovtGrantsDetl`, `SecuritiesDetl`, `BorrowingCostsDetl`, `ProvAssetsDetl`) are optional.

## Hidden rows — not built
- **Row 17 — `Xi(b)`: "Total effect of ICDS adjustments on profit (I+II+III+IV+V+VI+VII+VIII+IX+X) (if negative)"** — HIDDEN (`r 17H`). This is the utility's internal mirror of the negative portion of the total (`[F17] = MIN(0, SUM(F6:F15)) * -1`). It is a computation helper the utility uses to route a negative overall effect; it is never shown to or filled by the taxpayer and has no schema key of its own, so it is **not built as an item**.
- **Column L helper (`[L4]`)** — a hidden validator column (the "any ICDS field filled?" flag). Not a screen row; not built.

## What this means for the build
- Render one fixed 10-row table (Sl. No. I–X, ICDS name, then three money inputs) plus a total row XI. Column heads: Sl. No. (I), ICDS (II), Increase in Profit (+) (III), Decrease in Profit(-) (IV), Net Effect (V).
- Per row, Increase and Decrease are typed inputs (min 0); Net Effect is **computed** (green, untypeable) = Increase − Decrease.
- Row XI: Increase = `MAX(0, ΣIncrease)`, Decrease = `MAX(0, ΣDecrease)`, Net Effect = `Σ NetEffect`. The total's Increase/Decrease are the two required leaves; the total has no NetEffect leaf in the schema, so do not emit one under `TotalNetAmtDetl`.
- Feed Schedule BP: A25 takes the ICDS increase (positive total), A32 takes the ICDS decrease — keep the compute order so BP reads ICDS totals after this sheet computes.
- Do not build row 17 (Xi(b)) or the L-column helper.
