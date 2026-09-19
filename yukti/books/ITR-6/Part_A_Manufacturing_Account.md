# The book of Part A — Manufacturing Account · ITR-6, A.Y. 2026-27

Read row by row from the utility's **Part A-Manufacturing Account** sheet
(30 rows, none hidden) with its formulas, and confirmed against the CBDT ITR-6
schema block **`ManufacturingAccount`** (`ITRForm:PARTA_ManufacturingAccount`).
Every label, item letter and formula below is the department's own.

The sheet's own heading (G3): *"Part A-Manufacturing Account — Manufacturing
Account for the financial year 2025-26 (fill items 1 to 3 in a case where
regular books of account are maintained, otherwise fill items 61 to 62 as
applicable)."*

---

## 1 · Why the Manufacturing Account exists on ITR-6

ITR-6 is the company return, and a manufacturing company builds its Trading
Account on a **Cost of Goods Produced** figure that this account computes.
This account is only the first of the three financial statements: it takes the
debits of manufacture (opening inventory, purchases, direct wages, direct
expenses, factory overheads), subtracts the closing stock of raw material and
work-in-progress, and hands the balancing figure — **Cost of Goods Produced** —
down to the Trading Account. There are no credits shown here; it is a one-sided
transfer statement.

Nothing on this sheet is hidden. Every row is live.

---

## 2 · The shape — three item groups

| # | Group | Kind |
|---|---|---|
| 1 | **Debits to Manufacturing account** (A–F) | figures, with two computed totals |
| 2 | **Closing Stock** (i–iii) | figures, one computed total |
| 3 | **Cost of Goods Produced** transferred to Trading Account | one computed figure |

---

## 3 · Row by row

All amounts are integers (rupees). Computed rows are green and untypeable; they
carry the sheet's own formula, shown in the last column with the named cells.

### 1 · Debits to Manufacturing account

| Item | Row | Label | Type | Schema key (under `ManufacturingAccount.OpeningInventory`) | Formula / derivation |
|---|---|---|---|---|---|
| **1A** | 5–8 | **Opening Inventory** | group | | |
| 1Ai | 6 | Opening stock of raw-material | figure | `OpngStckRawMat` | entered |
| 1Aii | 7 | Opening stock of Work in progress | figure | `OpngStckWrkinPrgrs` | entered |
| 1Aiii | 8 | **Total (i + ii)** | computed | `OpngInvntryTotal` *(req)* | `MAX(0, OpngStckRawMat + OpngStckWrkinPrgrs)` |
| **1B** | 9 | **Purchases** (net of refunds and duty or tax, if any) | figure | `Purchases` | entered |
| **1C** | 10 | **Direct wages** | figure | `DirectWages` | entered |
| **1D** | 11 | **Direct expenses** (Di + Dii + Diii) | computed | `DirectExpenses` *(req)* | `SUM(CarriageInward, PowerAndFuel, OthDirectExpenses)` |
| 1Di | 12 | Carriage inward | figure | `CarriageInward` | entered |
| 1Dii | 13 | Power and fuel | figure | `PowerAndFuel` | entered |
| 1Diii | 14 | Other direct expenses | figure | `OthDirectExpenses` | entered |
| **1E** | 15–22 | **Factory Overheads** | group | | |
| 1Ei | 16 | Indirect wages | figure | `IndirectWages` | entered |
| 1Eii | 17 | Factory rent and rates | figure | `FactoryRentAndRates` | entered |
| 1Eiii | 18 | Factory Insurance | figure | `FactoryInsurance` | entered |
| 1Eiv | 19 | Factory fuel and power | figure | `FactoryFuelAndPower` | entered |
| 1Ev | 20 | Factory general expenses | figure | `FactoryGeneralExpenses` | entered |
| 1Evi | 21 | Depreciation of factory machinery | figure | `DeprctnOfFactoryMachinery` | entered |
| 1Evii | 22 | **Total (i+ii+iii+iv+v+vi)** | computed | `TotalFactoryOverheads` *(req)* | `SUM(IndirectWages, FactoryRentAndRates, FactoryInsurance, FactoryFuelAndPower, FactoryGeneralExpenses, DeprctnOfFactoryMachinery)` |
| **1F** | 23 | **Total of Debits to Manufacturing Account (Aiii+B+C+D+Evii)** | computed | `TotalDebtsManfctrngAcc` *(req)* | `SUM(OpngInvntryTotal, Purchases, DirectWages, DirectExpenses, TotalFactoryOverheads)` |

### 2 · Closing Stock

| Item | Row | Label | Type | Schema key (under `ManufacturingAccount.ClosingStock`) | Formula |
|---|---|---|---|---|---|
| 2i | 25 | Raw material | figure | `ClsngStckRawMaterial` | entered |
| 2ii | 26 | Work-in-progress | figure | `ClsngStckWrkInPrgrs` | entered |
| 2iii | 27 | **Total (2i + 2ii)** | computed | `ClsngStckTotal` *(req)* | `SUM(ClsngStckRawMaterial, ClsngStckWrkInPrgrs)` |

### 3 · Cost of Goods Produced

| Item | Row | Label | Type | Schema key (under `ManufacturingAccount`) | Formula |
|---|---|---|---|---|---|
| **3** | 28 | **Cost of Goods Produced — transferred to Trading Account (1F − 2)** | computed | `CostOfGoodsPrdcd` *(req)* | `TotalDebtsManfctrngAcc − ClsngStckTotal` |

---

## 4 · The dropdowns

There are **no enumerated (list) dropdowns** on this sheet. Every input cell
carries only a numeric data-validation (minimum 0, or a signed limit on the
computed transfer row 28: `-99999999999999`), never a value list. So there is
nothing here to seed from `enums.json`.

---

## 5 · Hidden rows

**None.** All 30 rows are visible; nothing is excluded.

---

## 6 · The rules the sheet computes (from its cells)

Every total on this sheet is derived, never typed:

- **Aiii** `R8 = MAX(0, ManuFactureAcc_OpenStockRawMaterial + ManuFactureAcc_OpenStockWorkProgress)` — the opening-inventory total is floored at zero.
- **D** `R11 = SUM(ManuFactureAcc_CarriageInward, ManuFactureAcc_PowerAndFuel, ManuFactureAcc_OtherDirectExpenses)`.
- **Evii** `R22 = SUM(ManuFactureAcc_IndirectWages, …, ManuFactureAcc_DepreciationFactoryMachinery)` — the six factory-overhead lines.
- **F** `R23 = SUM(ManuFactureAcc_TotalOpeningInventary, ManuFactureAcc_Purchases, ManuFactureAcc_DirectWages, ManuFactureAcc_DirectExpenses, ManuFactureAcc_TotalFactoryOverheads)`.
- **2iii** `R27 = SUM(ManuFactureAcc_RawMaterial, ManuFactureAcc_WorkInProgress)`.
- **3** `R28 = ManuFactureAcc_TotalOfDebitstoManuFacturingAcc − ManuFactureAcc_TotalClosingClock` — the balancing Cost of Goods Produced.

The transfer field name in the workbook is spelt `ManuFactureAcc_TotalClosingClock`
(a utility typo for "Stock"); it is the closing-stock total, item 2iii.

---

## 7 · Cross-sheet feeds

- **Out →** `CostOfGoodsPrdcd` (item 3) feeds the **Trading Account** at its
  item 11, "Cost of goods produced – Transferred from Manufacturing Account"
  (`TradingAccount.GoodsCostPrdcdFrmMA`, cell `N55 = ManuFactureAcc_CostOfGoodsProduced`).
- **In ←** nothing; this is the first statement in the chain.

The Ind-AS variant of this account lives on a separate sheet
(`Part AManufacturingAccountIndas`) and is not part of this block.

---

## 8 · What the schema marks mandatory

The four computed totals and the transfer figure are `required` in the schema:
`OpngInvntryTotal`, `DirectExpenses`, `TotalFactoryOverheads`,
`TotalDebtsManfctrngAcc`, `ClsngStckTotal`, `CostOfGoodsPrdcd`. The individual
input lines are optional (a company with no factory overheads leaves them nil).
Every leaf key listed in §3 is a leaf of `ManufacturingAccount`; there are no
excluded live rows.

---

## 9 · What this means for the build

1. **A one-sided figures block, no credits column** — five debit groups, one
   closing-stock group, one balancing transfer.
2. **Every total computed and untypeable** — Aiii, D, Evii, F, 2iii and 3 carry
   the formulas in §6; the filer types only the leaf inputs.
3. **The transfer to Trading is the whole point** — `CostOfGoodsPrdcd` is fed,
   not entered, into the Trading Account, so build the Trading Account after
   this one in compute order.
4. **Aiii is floored at zero** (`MAX(0, …)`); the other totals are plain sums.
5. **No enums** — only numeric minimums; no list to seed.
