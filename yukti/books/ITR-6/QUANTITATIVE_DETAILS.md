# The book of Part A — QD (Quantitative Details) · ITR-6, A.Y. 2026-27

Read row by row from the utility's **QUANTITATIVE DETAILS** sheet (97 rows) and
confirmed against the CBDT ITR-6 schema's `PARTA_QD`. Nothing here is invented;
every label, column, dropdown value and rule is the department's own.

---

## 1 · Why this sheet exists and what it holds

Part A – QD is the stock reconciliation. Its own heading says it is **mandatory
if liable for audit under section 44AB** (fill if applicable otherwise). It has
three tables — one for a trading concern, and two for a manufacturing concern
(raw materials, and finished goods / by-products) — each listing item by item the
opening stock, purchases, consumption / sales and closing stock in physical
units, so that the quantities tie back to the Trading and Manufacturing Accounts.
Its note warns: numeric values are not to be filled with commas or units, only
the figure.

---

## 2 · The shape — three item tables

| Part | What it is | Schema key | Repeatable |
|---|---|---|---|
| **(a)** | In the case of a trading concern | `TradingConcern.QuantitDet[]` | yes, one row per item |
| **(b)** | In the case of a manufacturing concern – Raw Materials | `ManfactrConcern.RawMaterial.QuantitDet[]` | yes |
| **(c)** | In the case of a manufacturing concern – Finished Goods/ By-products | `ManfactrConcern.FinishrByProd.QuantitDet[]` | yes |

Each row begins with an item name and a unit of measure (dropdown), then the
quantity columns. The utility ships 19 blank rows for each table (rows 7–25,
35–53, 62–80), all showing "(Select)" until an item is chosen.

---

## 3 · (a) Trading concern — column by column

Header row (verbatim): *Item Name · Unit · Opening stock · Purchase during the
previous year · Sales during the previous year · Closing stock · Shortage/
excess, if any.*

| Column | Type / enum | Schema key |
|---|---|---|
| Item Name | string | `TradingConcern.QuantitDet[].ItemName` |
| Unit (of measure) | enum (see §6) | `TradingConcern.QuantitDet[].UnitOfMeasure` |
| Opening stock | integer | `TradingConcern.QuantitDet[].OpeningStock` |
| Purchase during the previous year | integer | `TradingConcern.QuantitDet[].PurchaseQty` |
| Sales during the previous year | integer | `TradingConcern.QuantitDet[].SaleQty` |
| Closing stock | integer | `TradingConcern.QuantitDet[].ClgStock` |
| Shortage/ excess, if any | integer (may be negative) | `TradingConcern.QuantitDet[].AnyShortExces` |

## 4 · (b) Manufacturing concern – Raw Materials — column by column

Header row (verbatim): *Item Name · Unit of measure · Opening stock · Purchase
during the previous year · Consumption during the previous year · Sales during
the previous year · Closing stock · Yield Finished Products · Percentage of yield
· Shortage/ excess, if any.*

| Column | Type / enum | Schema key |
|---|---|---|
| Item Name | string | `ManfactrConcern.RawMaterial.QuantitDet[].ItemName` |
| Unit of measure | enum (see §6) | `ManfactrConcern.RawMaterial.QuantitDet[].UnitOfMeasure` |
| Opening stock | integer | `ManfactrConcern.RawMaterial.QuantitDet[].OpeningStock` |
| Purchase during the previous year | integer | `ManfactrConcern.RawMaterial.QuantitDet[].PurchaseQty` |
| Consumption during the previous year | integer | `ManfactrConcern.RawMaterial.QuantitDet[].PrevYrConsum` |
| Sales during the previous year | integer | `ManfactrConcern.RawMaterial.QuantitDet[].SaleQty` |
| Closing stock | integer | `ManfactrConcern.RawMaterial.QuantitDet[].ClgStock` |
| Yield Finished Products | integer | `ManfactrConcern.RawMaterial.QuantitDet[].yldFinisProd` |
| Percentage of yield | number | `ManfactrConcern.RawMaterial.QuantitDet[].PercentYld` |
| Shortage/ excess, if any | integer (may be negative) | `ManfactrConcern.RawMaterial.QuantitDet[].AnyShortExces` |

## 5 · (c) Manufacturing concern – Finished Goods/ By-products — column by column

Header row (verbatim): *Item Name · Unit · Opening stock · Purchase during the
previous year · Quantity manufactured during the previous year · Sales during the
previous year · Closing stock · Shortage/ excess, if any.*

| Column | Type / enum | Schema key |
|---|---|---|
| Item Name | string | `ManfactrConcern.FinishrByProd.QuantitDet[].ItemName` |
| Unit | enum (see §6) | `ManfactrConcern.FinishrByProd.QuantitDet[].UnitOfMeasure` |
| Opening stock | integer | `ManfactrConcern.FinishrByProd.QuantitDet[].OpeningStock` |
| Purchase during the previous year | integer | `ManfactrConcern.FinishrByProd.QuantitDet[].PurchaseQty` |
| Quantity manufactured during the previous year | integer | `ManfactrConcern.FinishrByProd.QuantitDet[].PrevyrManfact` |
| Sales during the previous year | integer | `ManfactrConcern.FinishrByProd.QuantitDet[].SaleQty` |
| Closing stock | integer | `ManfactrConcern.FinishrByProd.QuantitDet[].ClgStock` |
| Shortage/ excess, if any | integer (may be negative) | `ManfactrConcern.FinishrByProd.QuantitDet[].AnyShortExces` |

---

## 6 · Enums / dropdowns — Unit of measure

All three tables use the **same** unit-of-measure dropdown
(`cmb_QDTradingConcern.UnitOfMeasure`, `cmb_QDRawMaterial.UnitOfMeasure`,
`cmb_QDFinishrByProd.UnitOfMeasure` — identical 24-value list):

| Value |
|---|
| (Select) |
| 101-gms |
| 102-kilograms |
| 103-litre |
| 104-kilolitre |
| 105-metre |
| 106-kilometre |
| 107-numbers |
| 108-quintal |
| 109-ton |
| 110-pound |
| 111-milligrams |
| 112-carat |
| 113-numbers (1000s) |
| 114-kwatt |
| 115-mwatt |
| 116-inch |
| 117-feet |
| 118-sqft |
| 119-acre |
| 120-cubicft |
| 121-sqmetre |
| 122-cubicmetre |
| 999-residual |

The quantity columns are numeric (0 to the 14-digit maximum; the shortage/excess
column allows a negative down to −99,999,999,999,999); item-name cells are limited
to 25 characters.

---

## 7 · Cross-sheet feeds

| Direction | Feed |
|---|---|
| trigger | Mandatory when the company is **liable to audit under section 44AB** |
| reconcile | The opening/closing stock quantities reconcile with the **Manufacturing Account** (raw material, WIP) and the **Trading Account** (finished goods, stock-in-trade) values; QD carries physical quantities where those carry amounts |

There is no arithmetic feed to income; QD is a disclosure and reconciliation
schedule.

---

## 8 · What repeats, what is mandatory

- All three tables are **repeatable**, one row per item; each `QuantitDet[]` row
  requires `ItemName`, `UnitOfMeasure`, `OpeningStock`, `PurchaseQty`, `SaleQty`,
  `ClgStock` and `AnyShortExces`; the raw-material table additionally requires
  those, with `PrevYrConsum`, `yldFinisProd` and `PercentYld` optional, and the
  finished-goods table requires `PrevyrManfact` as part of its row.
- The block is written only for a concern that maintains quantitative records
  (typically an audited manufacturing or trading company); it may be absent for a
  service company, logged as not applicable.

---

## 9 · Hidden rows

**None.** All rows are visible; rows 7–25, 35–53 and 62–80 are the blank
"(Select)" template rows the "add row" control fills.

---

## 10 · What this means for the build

1. Three "add row" tables sharing one unit-of-measure dropdown; seed the dropdown
   from the enum file, not by hand.
2. The shortage/excess column and (for raw materials) the yield columns are the
   reconciliation lines; allow the shortage column to go negative.
3. Numbers only — strip commas and unit suffixes on entry (the sheet note).
4. Render the schedule when the company is 44AB-audited; otherwise it is optional.
