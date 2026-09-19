# Manufacturing Account (ITR-3, Part A — Manufacturing Account)

## The shape
This is **Part A-Manufacturing Account** — the Manufacturing Account for the financial year 2025-26, filled by an assessee who maintains a manufacturing account (fill items 1 to 3). It is a single non-repeating statement, not an array: one block of debits (Sl.No. 1) with opening inventory, purchases, direct wages, direct expenses and factory overheads, a closing-stock block (Sl.No. 2), and one derived figure, Cost of Goods Produced transferred to Trading Account (Sl.No. 3 = 1F − 2). All amounts are non-negative integers except Sl.No. 3, which may be negative. This is an ITR-3-only sheet under the business/profession head; there is no ITR-2 model.

## The items

### Block: ManufacturingAccount
| Sl.No. | Field label | Type | Schema key | Rule / notes |
|---|---|---|---|---|
| 1A | Opening Inventory | object | OpeningInventory | Required object; sub-block Ai–Aiii |
| 1Ai | Opening stock of raw-material | integer | OpeningInventory.OpngStckRawMat | ≥ 0, max 99999999999999 |
| 1Aii | Opening stock of Work in progress | integer | OpeningInventory.OpngStckWrkinPrgrs | ≥ 0 |
| 1Aiii | Total (i + ii) | integer | OpeningInventory.OpngInvntryTotal | Computed = MAX(0, Ai+Aii); required |
| 1B | Purchases (net of refunds and duty or tax, if any) | integer | OpeningInventory.Purchases | ≥ 0 |
| 1C | Direct wages | integer | OpeningInventory.DirectWages | ≥ 0 |
| 1D | Direct expenses (Di + Dii + Diii) | integer | OpeningInventory.DirectExpenses | Computed = Di+Dii+Diii; required |
| 1Di | Carriage inward | integer | OpeningInventory.CarriageInward | ≥ 0 |
| 1Dii | Power and fuel | integer | OpeningInventory.PowerAndFuel | ≥ 0 |
| 1Diii | Other direct expenses | integer | OpeningInventory.OthDirectExpenses | ≥ 0 |
| 1E | Factory Overheads | (header) | — | Sub-block Ei–Evii |
| 1Ei | Indirect wages | integer | OpeningInventory.IndirectWages | ≥ 0 |
| 1Eii | Factory rent and rates | integer | OpeningInventory.FactoryRentAndRates | ≥ 0 |
| 1Eiii | Factory Insurance | integer | OpeningInventory.FactoryInsurance | ≥ 0 |
| 1Eiv | Factory fuel and power | integer | OpeningInventory.FactoryFuelAndPower | ≥ 0 |
| 1Ev | Factory general expenses | integer | OpeningInventory.FactoryGeneralExpenses | ≥ 0 |
| 1Evi | Depreciation of factory machinery | integer | OpeningInventory.DeprctnOfFactoryMachinery | ≥ 0; feeds Schedule BP Sl.No.11 |
| 1Evii | Total (i+ii+iii+iv+v+vi) | integer | OpeningInventory.TotalFactoryOverheads | Computed; required |
| 1F | Total of Debits to Manufacturing Account (Aiii+B+C+D+Evii) | integer | OpeningInventory.TotalDebtsManfctrngAcc | Computed; required |
| 2 | Closing Stock | object | ClosingStock | Required object |
| 2i | Raw material | integer | ClosingStock.ClsngStckRawMaterial | ≥ 0 |
| 2ii | Work-in-progress | integer | ClosingStock.ClsngStckWrkInPrgrs | ≥ 0 |
| 2iii | Total (2i + 2ii) | integer | ClosingStock.ClsngStckTotal | Computed; required |
| 3 | Cost of Goods Produced – transferred to Trading Account (1F − 2) | integer | CostOfGoodsPrdcd | Computed = 1F − 2iii; may be negative; required |

## The rules the sheet computes
- **[R8] 1Aiii Total opening inventory** = `MAX(0, (ManuFactureAcc_OpenStockRawMaterial + ManuFactureAcc_OpenStockWorkProgress))` — floored at zero (Ai + Aii).
- **[R11] 1D Direct expenses** = `SUM(ManuFactureAcc_CarriageInward, ManuFactureAcc_PowerAndFuel, ManuFactureAcc_OtherDirectExpenses)` (Di + Dii + Diii).
- **[R22] 1Evii Total factory overheads** = `SUM(ManuFactureAcc_IndirectWages, ManuFactureAcc_FactoryRentRates, ManuFactureAcc_FactoryInsurance, ManuFactureAcc_FactoryFuelAndPower, ManuFactureAcc_FactoryGeneralExpenses, ManuFactureAcc_DepreciationOfFactoryMachinary)` (Ei…Evi).
- **[R23] 1F Total of Debits to Manufacturing Account** = `SUM(ManuFactureAcc_TotalOpeningInventary, ManuFactureAcc_Purchases, ManuFactureAcc_DirectWages, ManuFactureAcc_TotalOfDirectExpenses, ManuFactureAcc_TotalFactoryOverheads)` (Aiii + B + C + D + Evii).
- **[R27] 2iii Total closing stock** = `SUM(ManuFactureAcc_RawMaterial, ManuFactureAcc_WorkInProgress)` (2i + 2ii).
- **[R28] 3 Cost of Goods Produced** = `ManuFactureAcc_TotalOfDebitstoManuFacturingAcc − ManuFactureAcc_TotalClosingClock` (1F − 2).

Cross-rules from `rules.json`:
- 1Aiii should equal 1Ai + 1Aii.
- 1D Direct expenses should equal the sum of its individual break-up.
- 1Evii Total factory overheads should equal the sum of its individual break-up.
- 1F should equal 1(Aiii + B + C + D + Evii).
- 2 total of closing stock should equal the sum of its break-up.
- Sl.No. 3 should equal 1F − 2.
- Negative signs are not allowed other than in Sl.No. 3.
- Schedule BP Sl.No.11 (Depreciation) should equal 1Evi of Manufacturing account + Sl.No.52 of PART-A-P&L.
- Trading Account Sl.No.11 (Cost of Goods Produced transferred from Manufacturing Account) should equal Sl.No. 3 of Part A Manufacturing Account.

## Dropdowns
There are **no value-list dropdowns** on this sheet. The only cell-validation entries are numeric bounds, not enumerated lists: minimum `0` on all input/total cells (R6–R27 group), and minimum `-99999999999999` on R28 (Sl.No. 3), which permits the single negative field. No selectable values exist to enumerate.

## What repeats and what is one figure
Everything here is **one figure** — the whole Manufacturing Account is a single non-repeating object. `OpeningInventory` and `ClosingStock` are single objects, not arrays; `CostOfGoodsPrdcd` is a single integer. **No arrays** appear in this block.

## Mandatory
Schema `required` keys:
- Block root: `OpeningInventory`, `ClosingStock`, `CostOfGoodsPrdcd`.
- Within `OpeningInventory`: `OpngInvntryTotal`, `DirectExpenses`, `TotalFactoryOverheads`, `TotalDebtsManfctrngAcc`.
- Within `ClosingStock`: `ClsngStckTotal`.

## Hidden rows — not built
None. Every row on this sheet (rows 3–28) is visible; the dump printed no `H` flag on any row.

## What this means for the build
- Build one non-repeating Manufacturing Account panel; render Sl.No. 1 (debits), 2 (closing stock), 3 (cost of goods produced).
- Computed/green untypeable cells: 1Aiii (R8, floored at 0), 1D (R11), 1Evii (R22), 1F (R23), 2iii (R27), 3 (R28). All others are user inputs.
- Enforce non-negative on every field except Sl.No. 3 (CostOfGoodsPrdcd), which alone may go negative.
- Wire cross-sheet feeds: 1Evi Depreciation of factory machinery → Schedule BP Sl.No.11; Sl.No. 3 → Trading Account Sl.No.11 (Cost of Goods Produced transferred from Manufacturing Account).
- Emit XML wrapper `<ITRForm:ManufacturingAccount>` with children `<OpeningInventory>`, `<ClosingStock>`, `<CostOfGoodsPrdcd>`; VBA import/export uses named ranges `ManuFactureAcc_*` (note the utility's spelling `ManuFactureAcc_TotalOpeningInventary`, `ManuFactureAcc_TotalClosingClock`, `ManuFactureAcc_DepreciationOfFactoryMachinary`).


## Additional visible rows — verbatim from the sheet (completeness)
Rows present on the utility sheet and captured here verbatim so every visible label is in the book:

- Total (i + ii)
- Total (i+ii+iii+iv+v+vi)
- Raw material
- Total (2i +2ii)
