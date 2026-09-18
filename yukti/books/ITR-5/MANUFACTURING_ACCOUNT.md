# MANUFACTURING ACCOUNT — ITR-5 (A.Y. 2026-27)

Source sheet: `sheet6.xml` (sheet_map name "MANUFACTURING ACCOUNT"), section `pl`.
Schema block (section_map.json): **ManufacturingAccount**.

Header (row 3, cells C3 / G3):
> Part A-Manufacturing Account
> "Manufacturing Account for the financial year 2025-26 (fill items 1 to 3 in a case where regular books of accounts are maintained, otherwise fill items 62 to 66 as applicable)"

## The shape

One non-repeating block. It is a single manufacturing account statement with three numbered groups:

1. **Debits to manufacturing account** (item 1) — Opening Stock (A), Purchases (B), Direct wages (C), Direct expenses (D), Factory Overheads (E), and their total F.
2. **Closing Stock** (item 2) — raw material, work-in-progress and their total.
3. **Cost of Goods Produced** (item 3) — transferred to Trading Account, computed as 1F − 2.

Every value lives in column **Q** (the amount column). Labels sit in D/E/F, sheet lettering in P. All amounts are non-negative integers except item 3 (Cost of Goods Produced) which may be negative. There are no free-text or date fields, no dropdowns and no repeating tables — it is one figure per line.

## The items

Cell = the amount cell (column Q). "P col" = the sheet's own lettering shown in column P.

### Block `ManufacturingAccount` → `OpeningInventory` (item 1, Debits to manufacturing account)

| Sheet no. (P) | Field | Cell | Type | Named range | Schema key | Rule |
|---|---|---|---|---|---|---|
| A i (Ai) | Opening stock of raw-material | Q6 | integer ≥ 0 | ManuFactureAcc_OpenStockRawMaterial | OpeningInventory.**OpngStckRawMat** | user input |
| A ii (Aii) | Opening stock of Work in progress | Q7 | integer ≥ 0 | ManuFactureAcc_OpenStockWorkProgress | OpeningInventory.**OpngStckWrkinPrgrs** | user input |
| A iii (Aiii) | Total (i + ii) | Q8 | integer ≥ 0 | ManuFactureAcc_TotalOpeningInventary | OpeningInventory.**OpngInvntryTotal** | computed = Ai + Aii |
| B | Purchases (net of refunds and duty or tax, if any) | Q9 | integer ≥ 0 | ManuFactureAcc_Purchases | OpeningInventory.**Purchases** | user input |
| C | Direct wages | Q10 | integer ≥ 0 | ManuFactureAcc_DirectWages | OpeningInventory.**DirectWages** | user input |
| D | Direct expenses (Di + Dii + Diii) | Q11 | integer ≥ 0 | ManuFactureAcc_TotalOfDirectExpenses | OpeningInventory.**DirectExpenses** | computed = SUM(Di..Diii) |
| D i (Di) | Carriage inward | Q12 | integer ≥ 0 | ManuFactureAcc_CarriageInward | OpeningInventory.**CarriageInward** | user input |
| D ii (Dii) | Power and fuel | Q13 | integer ≥ 0 | ManuFactureAcc_PowerAndFuel | OpeningInventory.**PowerAndFuel** | user input |
| D iii (Diii) | Other direct expenses | Q14 | integer ≥ 0 | ManuFactureAcc_OtherDirectExpenses | OpeningInventory.**OthDirectExpenses** | user input |
| E i (Ei) | Indirect wages | Q16 | integer ≥ 0 | ManuFactureAcc_IndirectWages | OpeningInventory.**IndirectWages** | user input |
| E ii (Eii) | Factory rent and rates | Q17 | integer ≥ 0 | ManuFactureAcc_FactoryRentRates | OpeningInventory.**FactoryRentAndRates** | user input |
| E iii (Eiii) | Factory Insurance | Q18 | integer ≥ 0 | ManuFactureAcc_FactoryInsurance | OpeningInventory.**FactoryInsurance** | user input |
| E iv (Eiv) | Factory fuel and power | Q19 | integer ≥ 0 | ManuFactureAcc_FactoryFuelAndPower | OpeningInventory.**FactoryFuelAndPower** | user input |
| E v (Ev) | Factory general expenses | Q20 | integer ≥ 0 | ManuFactureAcc_FactoryGeneralExpenses | OpeningInventory.**FactoryGeneralExpenses** | user input |
| E vi (Evi) | Depreciation of factory machinery | Q21 | integer ≥ 0 | ManuFactureAcc_DepreciationOfFactoryMachinary | OpeningInventory.**DeprctnOfFactoryMachinery** | user input |
| E vii (Evii) | Total (i+ii+iii+iv+v+vi) | Q22 | integer ≥ 0 | ManuFactureAcc_TotalFactoryOverheads | OpeningInventory.**TotalFactoryOverheads** | computed = SUM(Ei..Evi) |
| F | Total of Debits to Manufacturing Account (Aiii+B+C+D+Evii) | Q23 | integer ≥ 0 | ManuFactureAcc_TotalOfDebitstoManuFacturingAcc | OpeningInventory.**TotalDebtsManfctrngAcc** | computed = Aiii + B + C + D + Evii |

Note on nesting: in the JSON/XML schema, items B, C, D, the D-details, all of E and the total F are nested inside the `OpeningInventory` object alongside the opening-stock lines. The row labels above ("Purchases", "Direct wages", "Factory Overheads" etc.) are the sheet's own group headings; only the leaf schema keys are the data fields.

Group heading rows carrying no amount cell: **A — Opening Stock** (E5), **E — Factory Overheads** (E15). These are section captions, not fields.

### Block `ManufacturingAccount` → `ClosingStock` (item 2, Closing Stock)

| Sheet no. (P) | Field | Cell | Type | Named range | Schema key | Rule |
|---|---|---|---|---|---|---|
| 2 i | Raw material | Q25 | integer ≥ 0 | ManuFactureAcc_RawMaterial | ClosingStock.**ClsngStckRawMaterial** | user input |
| 2 ii | Work-in-progress | Q26 | integer ≥ 0 | ManuFactureAcc_WorkInProgress | ClosingStock.**ClsngStckWrkInPrgrs** | user input |
| 2 iii | Total (2i +2ii) | Q27 | integer ≥ 0 | ManuFactureAcc_TotalClosingClock | ClosingStock.**ClsngStckTotal** | computed = 2i + 2ii |

### Block `ManufacturingAccount` → item 3

| Sheet no. (P) | Field | Cell | Type | Named range | Schema key | Rule |
|---|---|---|---|---|---|---|
| 3 | Cost of Goods Produced – transferred to Trading Account (1F-2) | Q28 | integer (−99999999999999 … 99999999999999) | ManuFactureAcc_CostOfGoodsProduced | **CostOfGoodsPrdcd** | computed = 1F − 2 |

## The rules the sheet computes

All computed cells are in column Q (verbatim from `--formulas`):

- **Q8 (Aiii, OpngInvntryTotal)** `= ManuFactureAcc_OpenStockRawMaterial + ManuFactureAcc_OpenStockWorkProgress` → Total Opening Inventory = Ai + Aii.
  - Validation rule (rules.json): *"In 'Schedule Manufacturing Account' Total of Opening Manufacturing Inventory Sl no 1Aiii should be equal to 1Ai+1Aii"*.
- **Q11 (D, DirectExpenses)** `= SUM(Q12:Q14)` → Direct expenses = Di + Dii + Diii.
  - Rule: *"at sl.no. 1Div Total Manufacturing Direct expenses should be equal to the sum of values at 1Di+1Dii+1Diii"*.
- **Q22 (Evii, TotalFactoryOverheads)** `= SUM(Q16:Q21)` → Factory Overheads total = Ei+Eii+Eiii+Eiv+Ev+Evi.
  - Rule: *"Total Factory Manufacturing Overheads at sl.no.1Evii should be equal to the sum of values at sl no (Ei+Eii+Eiii+Eiv+Ev+Evi)"*.
- **Q23 (F, TotalDebtsManfctrngAcc)** `= ManuFactureAcc_TotalOpeningInventary + ManuFactureAcc_Purchases + ManuFactureAcc_DirectWages + ManuFactureAcc_TotalOfDirectExpenses + ManuFactureAcc_TotalFactoryOverheads` → Total Debits = Aiii + B + C + D + Evii.
  - Rule: *"Total of Debits to Manufacturing Account at sl.no.1F should be equal to the sum of (Aiii + B + C + D + Evii)"*.
- **Q27 (2iii, ClsngStckTotal)** `= SUM(Q25:Q26)` → Total Closing Stock = 2i + 2ii.
  - Rule: *"Total Closing Stock at sl.no.2 should be equal to the sum of values at sl.no.2i + 2ii"*.
- **Q28 (3, CostOfGoodsPrdcd)** `= ManuFactureAcc_TotalOfDebitstoManuFacturingAcc - ManuFactureAcc_TotalClosingClock` → Cost of Goods Produced = 1F − 2.
  - Rule: *"In Manufacturing Account, value at Sl no 3 should be equal to 1F-2"*.

Non-negativity: rules.json — *"In Manufacturing Account, Negative values are not allowed in sl.no.1 and sl.no.2"*. Matches the schema minimum 0 on every leaf of item 1 and item 2. Item 3 (CostOfGoodsPrdcd) allows a negative minimum (−99999999999999).

Cross-schedule link: rules.json — *"Value at 'Sl no 11' of Part A trading Account should be equal to Sl no. 3 of Part A Manufacturing Account"* (item 3 here feeds Trading Account Sl no 11 / `GoodsCostPrdcdFrmMA`). Also *"equal to sl.no.53 of P&L A/c + sl.no.1E(vi) of Manufacturing A/c"* links Evi (depreciation of factory machinery) into a BP/depreciation check.

Auto-populate (VBA, `vba_text.txt`): on import the totals Aiii, D, Evii, F, 2iii and item 3 are written into their named ranges from the parsed object (e.g. `Sheet42.Range("ManuFactureAcc_TotalOpeningInventary")`, `...ManuFactureAcc_CostOfGoodsProduced`), i.e. the utility recomputes them rather than trusting the file.

## Dropdowns

None. Every column-Q cell reported by `--dropdowns` (Q6, Q7, Q8, Q9, Q10, Q11, Q12, Q13, Q14, Q16, Q17, Q18, Q19, Q20, Q21, Q22, Q23, Q25, Q26, Q27, Q28) has `source: "0"` and `values: null` — these are numeric input cells, not selection lists. There are no enumerated (dropdown) fields in this sheet.

## What repeats and what is one figure

Nothing repeats. There are no `[]` array leaves in the schema. Every field is a single figure. The whole `ManufacturingAccount` block appears once.

## Mandatory

Schema `required` at block level: **OpeningInventory**, **ClosingStock**, **CostOfGoodsPrdcd** (all three groups are required objects/fields when the block is present).

Required leaves (marked `*` in `--schema`/`--leaves`) — the computed totals:
- OpeningInventory.**OpngInvntryTotal** (Aiii, Q8)
- OpeningInventory.**DirectExpenses** (D, Q11)
- OpeningInventory.**TotalFactoryOverheads** (Evii, Q22)
- OpeningInventory.**TotalDebtsManfctrngAcc** (F, Q23)
- ClosingStock.**ClsngStckTotal** (2iii, Q27)
- **CostOfGoodsPrdcd** (item 3, Q28)

The individual input lines (OpngStckRawMat, OpngStckWrkinPrgrs, Purchases, DirectWages, CarriageInward, PowerAndFuel, OthDirectExpenses, IndirectWages, FactoryRentAndRates, FactoryInsurance, FactoryFuelAndPower, FactoryGeneralExpenses, DeprctnOfFactoryMachinery, ClsngStckRawMaterial, ClsngStckWrkInPrgrs) are optional (minimum 0), but the whole block is filled only "in a case where regular books of accounts are maintained" (row 3 header). If books are not maintained, this sheet is left empty and the no-account items 62-66 are used instead (those live on other sheets).

## Hidden rows — not built

None. No row in `sheet6.xml` for this sheet is marked hidden (`hidden="1"`); the `--dump` output shows no `H` flag on any row. Every row read is a built row.

## What this means for the build

- Build one non-repeating panel, all amounts in a single numeric column, mapping each input cell to its named range → schema key exactly as tabled above.
- Wire the six computed fields as read-only, auto-summed exactly per the formulas: Aiii=Ai+Aii; D=Di+Dii+Diii; Evii=Ei+…+Evi; F=Aiii+B+C+D+Evii; 2iii=2i+2ii; 3=F−2iii. Do not accept user entry for these.
- Enforce minimum 0 on every item-1 and item-2 field (no negatives); allow negatives only for item 3.
- No dropdowns to render. No repeating rows/tables.
- Feed item 3 (CostOfGoodsPrdcd) forward to Trading Account Sl no 11 (`GoodsCostPrdcdFrmMA`) and expose Evi for the depreciation cross-check.
- Gate the whole schedule on "regular books maintained"; otherwise leave the block absent from the export.
