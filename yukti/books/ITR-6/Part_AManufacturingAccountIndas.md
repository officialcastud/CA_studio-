# The book of Part A — Manufacturing Account (Ind AS) · ITR-6, A.Y. 2026-27

Read row by row from the utility's **Part AManufacturingAccountIndas** sheet
(30 rows) and confirmed against the CBDT ITR-6 schema's `ManufacturingAccountIndAS`.
Nothing here is invented; every label, item letter and rule is the department's own.
This is the **Ind-AS** variant of the Manufacturing Account — it is shown to a
company whose financial statements are drawn up in compliance with the Indian
Accounting Standards (Ind AS). The line structure is identical to the regular
Manufacturing Account; only the sheet, the schema block and the cross-reference
suffix "-Ind As" differ.

---

## 1 · Why this sheet exists and what it computes

A manufacturing company's cost sheet is split into three statements — the
Manufacturing Account (this sheet), the Trading Account, and the Statement of
Profit and Loss. This sheet is the **cost of goods produced** working: it
gathers opening inventory, purchases, direct wages, direct expenses and factory
overheads on the debit side, subtracts the closing stock of raw material and
work-in-progress, and lands on one figure — **Cost of Goods Produced** — which
is transferred to the Trading Account (Ind AS) at its Sl. No. 11.

The whole sheet is a numeric working; there are no dropdowns. It is mandatory
for a manufacturing company that maintains regular books and files under Ind AS.

---

## 2 · The shape — a debit side, a closing stock, one carried figure

| Item | What it is | Kind |
|---|---|---|
| **1A** | Opening Inventory (Ai raw material, Aii work-in-progress, Aiii total) | figures + computed total |
| **1B** | Purchases (net of refunds and duty or tax, if any) | figure |
| **1C** | Direct wages | figure |
| **1D** | Direct expenses (Di carriage inward, Dii power and fuel, Diii other) | figures + computed total |
| **1E** | Factory Overheads (Ei to Evi, Evii total) | figures + computed total |
| **1F** | Total of Debits to Manufacturing Account (Aiii + B + C + D + Evii) | computed |
| **2** | Closing Stock (2i raw material, 2ii work-in-progress, 2iii total) | figures + computed total |
| **3** | Cost of Goods Produced — transferred to Trading Account (1F − 2) | computed |

---

## 3 · Row by row (item letters from the rules document, e.g. A83–A89)

| Item | Label (verbatim) | Type | Schema key | Formula / derivation | Hidden? |
|---|---|---|---|---|---|
| **1A** | Opening Inventory | group | `OpeningInventory` | — | no |
| **1Ai** | Opening stock of raw-material | integer ≥0 | `OpeningInventory.OpngStckRawMat` | entered | no |
| **1Aii** | Opening stock of Work in progress | integer ≥0 | `OpeningInventory.OpngStckWrkinPrgrs` | entered | no |
| **1Aiii** | Total (i + ii) | computed | `OpeningInventory.OpngInvntryTotal` | Ai + Aii (rule A83) | no |
| **1B** | Purchases (net of refunds and duty or tax, if any) | integer ≥0 | `OpeningInventory.Purchases` | entered | no |
| **1C** | Direct wages | integer ≥0 | `OpeningInventory.DirectWages` | entered | no |
| **1D** | Direct expenses | computed | `OpeningInventory.DirectExpenses` | Di + Dii + Diii (rule A84) | no |
| **1Di** | Carriage inward | integer ≥0 | `OpeningInventory.CarriageInward` | entered | no |
| **1Dii** | Power and fuel | integer ≥0 | `OpeningInventory.PowerAndFuel` | entered | no |
| **1Diii** | Other direct expenses | integer ≥0 | `OpeningInventory.OthDirectExpenses` | entered | no |
| **1E** | Factory Overheads | group | — | — | no |
| **1Ei** | Indirect wages | integer ≥0 | `OpeningInventory.IndirectWages` | entered | no |
| **1Eii** | Factory rent and rates | integer ≥0 | `OpeningInventory.FactoryRentAndRates` | entered | no |
| **1Eiii** | Factory Insurance | integer ≥0 | `OpeningInventory.FactoryInsurance` | entered | no |
| **1Eiv** | Factory fuel and power | integer ≥0 | `OpeningInventory.FactoryFuelAndPower` | entered | no |
| **1Ev** | Factory general expenses | integer ≥0 | `OpeningInventory.FactoryGeneralExpenses` | entered | no |
| **1Evi** | Depreciation of factory machinery | integer ≥0 | `OpeningInventory.DeprctnOfFactoryMachinery` | entered | no |
| **1Evii** | Total (i+ii+iii+iv+v+vi) | computed | `OpeningInventory.TotalFactoryOverheads` | Ei+Eii+Eiii+Eiv+Ev+Evi (rule A85) | no |
| **1F** | Total of Debits to Manufacturing Account (Aiii+B+C+D+Evii) | computed | `OpeningInventory.TotalDebtsManfctrngAcc` | Aiii + B + C + D + Evii (rule A86) | no |
| **2** | Closing Stock | group | `ClosingStock` | — | no |
| **2i** | Raw material | integer ≥0 | `ClosingStock.ClsngStckRawMaterial` | entered | no |
| **2ii** | Work-in-progress | integer ≥0 | `ClosingStock.ClsngStckWrkInPrgrs` | entered | no |
| **2iii** | Total (2i +2ii) | computed | `ClosingStock.ClsngStckTotal` | 2i + 2ii (rule A87) | no |
| **3** | Cost of Goods Produced – transferred to Trading Account (1F-2) | computed | `CostOfGoodsPrdcd` | 1F − 2 (rule A88) | no |

Note the schema quirk: the department's `ManufacturingAccountIndAS` block nests
**every** debit line (Purchases, DirectWages, DirectExpenses, the carriage/power
lines, and all six factory-overhead lines with their total) **inside the
`OpeningInventory` object**, not as siblings of it. `ClosingStock` and
`CostOfGoodsPrdcd` are the only top-level keys besides `OpeningInventory`. The
build must write the debit lines under `OpeningInventory` even though on screen
they read as items 1B–1E.

---

## 4 · Enums / dropdowns

**None.** Every cell on this sheet is a numeric entry or a computed total. The
data-validations present are numeric bounds only (0 to 99,999,999,999,999; item
3 alone allows a negative down to −99,999,999,999,999).

---

## 5 · The rules the sheet computes (from its formulas and the rules document)

| Rule | What it asserts |
|---|---|
| **A90** (=A83) | Total opening inventory 1Aiii = 1Ai + 1Aii |
| **A91** (=A84) | Total direct expenses 1D = 1Di + 1Dii + 1Diii |
| **A85** | Total factory overheads 1Evii = Ei + Eii + Eiii + Eiv + Ev + Evi |
| **A86** | Total debits 1F = 1Aiii + 1B + 1C + 1D + 1Evii |
| **A87** | Total closing stock 2 (2iii) = 2i + 2ii |
| **A88** | Cost of goods produced 3 = 1F − 2 |
| **A89** | Negative signs are not allowed anywhere except item 3 (all other lines ≥ 0) |

(The rules document lists A90–A96 as the "-Ind As" twins of the regular
Manufacturing Account rules A83–A89; the arithmetic is the same.)

---

## 6 · Cross-sheet feeds

| Direction | Feed |
|---|---|
| **out** | Item 3 (Cost of Goods Produced) → **Trading Account (Ind AS)**, Sl. No. 11 "Cost of goods produced – Transferred from Manufacturing Account" (rule A71) |
| in | Opening/closing stock values reconcile with the **Quantitative Details** sheet (raw material, WIP quantities) for an audited company |

There is no feed to Part B-TI directly; the manufacturing figures reach income
only through the Trading Account → Statement of Profit and Loss → Schedule BP chain.

---

## 7 · What repeats, what is mandatory

- **Nothing repeats.** Every line is a single figure; there are no addable tables.
- The schema marks **`OpeningInventory`, `ClosingStock` and `CostOfGoodsPrdcd`**
  as required on `ManufacturingAccountIndAS`; within them the required leaves are
  the totals `OpngInvntryTotal`, `DirectExpenses`, `TotalFactoryOverheads`,
  `TotalDebtsManfctrngAcc`, `ClsngStckTotal`, and `CostOfGoodsPrdcd`. The
  individual input lines are optional (written only when they carry a value), but
  the whole block is written for a manufacturing company under Ind AS.

---

## 8 · Hidden rows

**None.** All 30 rows of this sheet are visible; there is no "no-account case"
sub-block on the Manufacturing Account (it lives on the Balance Sheet and the P&L).

---

## 9 · What this means for the build

1. It is a small figures block: five inputs to a debit total, three closing-stock
   inputs, and two computed totals (1F and 3). All totals are computed and
   untypeable (green cells).
2. Write the debit lines under the `OpeningInventory` object as the schema
   requires, not as siblings — this is the one place to get the JSON shape right.
3. Item 3 is the only line that may go negative; enforce ≥ 0 on every other line
   (rule A89).
4. Item 3 feeds the Trading Account (Ind AS) Sl. No. 11 — wire that feed and show
   it as fed there.
