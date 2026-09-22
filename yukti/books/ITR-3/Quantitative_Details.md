# Quantitative Details

Sheet: **Quantitative Details** · Section: business/profession head (bpa) · Schema block: **PARTA_QD** · Source: `python3 tools/dump.py --form ITR-3 --sheet "Quantitative Details"` (and `--formulas`, `--dropdowns`, `--schema PARTA_QD`, `--leaves PARTA_QD`), `books/ITR-3/rules.json`, `sources/ITR-3/vba_text.txt`. This is an ITR-3-only sheet (Profits and Gains of Business or Profession head) — no ITR-2 model exists; everything below comes from ITR-3's own sources.

## The shape

Row 3 titles the sheet: **"Part A – QD"** / **"Quantitative details (mandatory if liable for audit under section 44AB) (Note : Numeric values not f..."** — i.e. the quantitative details schedule, mandatory only where the assessee is liable for audit under section 44AB. The single schema block `PARTA_QD` has three sibling parts that mirror the sheet's three printed headings: **(a)** `TradingConcern` — "In the case of a trading concern" (rows 4-10); **(b)** `ManfactrConcern.RawMaterial` — "In the case of a manufacturing concern - Raw Materials" (rows 14-20); and **(C)** `ManfactrConcern.FinishrByProd` — "In the case of a manufacturing concern - Finished Products/By-products" (rows 24-30). Each part is an array (`QuantitDet`, maxItems 20) of item rows; the sheet template physically prints only four entry rows per part (e.g. E7:E10). Nothing on the sheet is computed — every cell is a manual quantity or name entry.

## The items

Type shorthand: **str25** = string, maxLength 25; **unit** = string enum of 23 unit codes (see Dropdowns); **N0** = integer, minimum 0, maximum 99999999999999; **N±** = integer, no min/max stated (shortage/excess, can be negative); **pct** = number 0-100. `*` marks a schema-required leaf.

#### (a) In the case of a trading concern — schema `TradingConcern.QuantitDet[]` (array, maxItems 20; rows 4-10)

| Row | Item | Field label | Type | Schema key | Rule/notes |
|---|---|---|---|---|---|
| 4 | (a) | In the case of a trading concern | hdg | — | part heading |
| 5 | — | column header row: Item Name / Unit / Opening stock / Purchase during the previous year / Sales during the previous year / Closing stock / Shortage/ excess, if any | hdg | — | column labels |
| 7-10 | — | Item Name | str25 | `TradingConcern.QuantitDet[].ItemName`* | one row per stock item |
| 7-10 | — | Unit | unit | `TradingConcern.QuantitDet[].UnitOfMeasure`* | (Select) dropdown, E7:E10 |
| 7-10 | — | Opening stock | N0 | `TradingConcern.QuantitDet[].OpeningStock`* | F7:F10 |
| 7-10 | — | Purchase during the previous year | N0 | `TradingConcern.QuantitDet[].PurchaseQty`* | G7:G10 |
| 7-10 | — | Sales during the previous year | N0 | `TradingConcern.QuantitDet[].SaleQty`* | H7:H10 |
| 7-10 | — | Closing stock | N0 | `TradingConcern.QuantitDet[].ClgStock`* | I7:I10 |
| 7-10 | — | Shortage/ excess, if any | N± | `TradingConcern.QuantitDet[].AnyShortExces`* | J7:J10, no min/max — negative allowed |

#### (b) In the case of a manufacturing concern - Raw Materials — schema `ManfactrConcern.RawMaterial.QuantitDet[]` (array, maxItems 20; rows 14-20)

| Row | Item | Field label | Type | Schema key | Rule/notes |
|---|---|---|---|---|---|
| 14 | (b) | In the case of a manufacturing concern - Raw Materials | hdg | — | part heading |
| 15 | — | column header row: Item Name / Unit of measure / Opening stock / Purchase during the previous year / Consumption during the previous year / Sales during the previous year / Closing stock / Yield Finished Products / Percentage of yield / Shortage/ excess, if any | hdg | — | column labels |
| 17-20 | — | Item Name | str25 | `ManfactrConcern.RawMaterial.QuantitDet[].ItemName`* | one row per raw material |
| 17-20 | — | Unit of measure | unit | `ManfactrConcern.RawMaterial.QuantitDet[].UnitOfMeasure`* | (Select) dropdown, E17:E20 |
| 17-20 | — | Opening stock | N0 | `ManfactrConcern.RawMaterial.QuantitDet[].OpeningStock`* | F17:F20 |
| 17-20 | — | Purchase during the previous year | N0 | `ManfactrConcern.RawMaterial.QuantitDet[].PurchaseQty`* | G17:G20 |
| 17-20 | — | Consumption during the previous year | N0 | `ManfactrConcern.RawMaterial.QuantitDet[].PrevYrConsum` | H17:H20 — not required |
| 17-20 | — | Sales during the previous year | N0 | `ManfactrConcern.RawMaterial.QuantitDet[].SaleQty`* | I17:I20 |
| 17-20 | — | Closing stock | N0 | `ManfactrConcern.RawMaterial.QuantitDet[].ClgStock`* | J17:J20 |
| 17-20 | — | Yield Finished Products | N0 | `ManfactrConcern.RawMaterial.QuantitDet[].yldFinisProd` | K17:K20 — not required |
| 17-20 | — | Percentage of yield | pct | `ManfactrConcern.RawMaterial.QuantitDet[].PercentYld` | L17:L20 — 0-100, not required |
| 17-20 | — | Shortage/ excess, if any | N± | `ManfactrConcern.RawMaterial.QuantitDet[].AnyShortExces`* | M17:M20, negative allowed |

#### (C) In the case of a manufacturing concern -Finished Products/By-products — schema `ManfactrConcern.FinishrByProd.QuantitDet[]` (array, maxItems 20; rows 24-30)

| Row | Item | Field label | Type | Schema key | Rule/notes |
|---|---|---|---|---|---|
| 24 | (C) | In the case of a manufacturing concern -Finished Products/By-products | hdg | — | part heading |
| 25 | — | column header row: Item Name / Unit / Opening stock / Purchase during the previous year / Quantity manufactured during the previous year / Sales during the previous year / Closing stock / Shortage/ excess, if any | hdg | — | column labels |
| 27-30 | — | Item Name | str25 | `ManfactrConcern.FinishrByProd.QuantitDet[].ItemName`* | one row per finished/by-product |
| 27-30 | — | Unit | unit | `ManfactrConcern.FinishrByProd.QuantitDet[].UnitOfMeasure`* | (Select) dropdown, E27:E30 |
| 27-30 | — | Opening stock | N0 | `ManfactrConcern.FinishrByProd.QuantitDet[].OpeningStock`* | F27:F30 |
| 27-30 | — | Purchase during the previous year | N0 | `ManfactrConcern.FinishrByProd.QuantitDet[].PurchaseQty`* | G27:G30 |
| 27-30 | — | Quantity manufactured during the previous year | N0 | `ManfactrConcern.FinishrByProd.QuantitDet[].PrevyrManfact` | H27:H30 — not required |
| 27-30 | — | Sales during the previous year | N0 | `ManfactrConcern.FinishrByProd.QuantitDet[].SaleQty`* | I27:I30 |
| 27-30 | — | Closing stock | N0 | `ManfactrConcern.FinishrByProd.QuantitDet[].ClgStock`* | J27:J30 |
| 27-30 | — | Shortage/ excess, if any | N± | `ManfactrConcern.FinishrByProd.QuantitDet[].AnyShortExces`* | K27:K30, negative allowed |

## The rules the sheet computes

The sheet carries **no formulas** — `--formulas` returns only the label rows, no computed cell. Every value is manually keyed. The constraints that do apply come from the schema and the sheet's data-validation, not from cell arithmetic:

- **Section 44AB gate** — Row 3 [E3]: the whole schedule is "mandatory if liable for audit under section 44AB"; otherwise optional.
- **Item name length** — `ItemName` maxLength 25 (all three arrays); the sheet unit-name dropdown cells D7:D10 / D17:D20 / D27:D30 carry a length source of `25`.
- **Quantity bounds** — `OpeningStock`, `PurchaseQty`, `SaleQty`, `ClgStock`, `PrevYrConsum`, `PrevyrManfact`, `yldFinisProd`: integer, minimum 0, maximum 99999999999999 (validation source `0`, upper bound from schema).
- **Percentage of yield** — `PercentYld` (raw materials only, L17:L20): number, minimum 0, maximum 100.
- **Shortage/ excess** — `AnyShortExces`: integer with no minimum stated (validation source `-99999999999999` on J7:J10 / M17:M20 / K27:K30) — negative figures are allowed.
- **Array cap** — each `QuantitDet` array is maxItems 20, though the sheet template prints only 4 entry rows per part.

## Dropdowns

**Unit / Unit of measure** — cells `E7:E10`, `E17:E20`, `E27:E30` (validation list "Unit"), 24 listed values:

`(Select)`, `101-Gms`, `102-Kilograms`, `103-Litre`, `104-Kilolitre`, `105-Metre`, `106-Kilometre`, `107-Numbers`, `108-Quintal`, `109-Ton`, `110-Pound`, `111-Miligrams`, `112-Carat`, `113-Numbers (1000s)`, `114-Kwatt`, `115-Mwatt`, `116-Inch`, `117-Feet`, `118-Sqft`, `119-Acre`, `120-Cubicft`, `121-Sqmetre`, `122-Cubicmetre`, `999-Residual`.

The schema stores only the numeric code. The `UnitOfMeasure` enum has 23 members: `101`, `102`, `103`, `104`, `105`, `106`, `107`, `108`, `109`, `110`, `111`, `112`, `113`, `114`, `115`, `116`, `117`, `118`, `119`, `120`, `121`, `122`, `999`.

The remaining "dropdowns" reported by the tool (F/G/H/I/J/K/L/M ranges with source `0` or `-99999999999999`) are not pick-lists — they are numeric data-validation floors, described under "The rules the sheet computes".

## What repeats and what is one figure

Every part is a **repeating array** (`QuantitDet[]`, maxItems 20) — a trading concern lists many stock items, a manufacturer lists many raw materials and many finished/by-products. There is **no single one-off figure** on this sheet and **no total row**. Each array element is one item line carrying its own name, unit, and quantities.

## Mandatory

The schema block `PARTA_QD` sets `required: None` at the top — the whole schedule is optional at the block level (it binds only when 44AB audit applies). The child objects `ManfactrConcern.RawMaterial` and `ManfactrConcern.FinishrByProd` are required members of `ManfactrConcern`. Within each array element, the required leaves are: `ItemName`, `UnitOfMeasure`, `OpeningStock`, `PurchaseQty`, `SaleQty`, `ClgStock`, `AnyShortExces` (all three arrays). Not required: `PrevYrConsum`, `yldFinisProd`, `PercentYld` (raw materials), and `PrevyrManfact` (finished/by-products).

## Hidden rows — not built

`--dump` reports **no hidden (H) rows** on this sheet — every printed row is visible. Rows 6, 11-13, 16, 21-23, 26 and 31+ are simply blank spacer rows in the template (no label, no schema key), not hidden rows, and are not built as items.

## What this means for the build

- Build three independent repeating tables, one per printed part, all under block `PARTA_QD`: `TradingConcern.QuantitDet[]` (7 columns), `ManfactrConcern.RawMaterial.QuantitDet[]` (10 columns — it adds Consumption, Yield Finished Products and Percentage of yield), and `ManfactrConcern.FinishrByProd.QuantitDet[]` (8 columns — it has Quantity manufactured in place of Consumption/Yield). Each table needs add/delete rows up to 20.
- The unit cell is a single dropdown of 23 codes shown as `code-label`; store the numeric code, display the label. Default `(Select)` / empty.
- Watch the column differences: raw materials is the only part with `PercentYld` (0-100) and `yldFinisProd`; finished/by-products has `PrevyrManfact`; trading concern has neither Consumption nor yield columns. Do not copy one table's columns to another.
- `AnyShortExces` must accept negatives; all other quantities floor at 0.
- Gate the whole schedule on 44AB audit liability — it is mandatory only then, otherwise the assessee may leave all three tables empty.
- No computation: no totals, no cross-column arithmetic. Every cell is a plain entry.
