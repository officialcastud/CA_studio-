# QUANTITATIVE_DETAILS — Part A – QD (ITR-5, A.Y. 2026-27)

Sources: `python tools/dump.py --form ITR-5 --sheet "QUANTITATIVE_DETAILS"` (rows, --formulas, --dropdowns); `--schema PARTA_QD` and `--leaves PARTA_QD`; `sources/ITR-5/vba_text.txt`; `books/ITR-5/rules.json`; `books/ITR-5/section_map.json`. Every quote below is from those dumps, not memory.

## The shape

One schedule, **Part A – QD** (row 3, cell C3 `Part A – QD`), block **PARTA_QD** (per `section_map.json`: `"QUANTITATIVE_DETAILS": { "section": "oi", "blocks": ["PARTA_QD"] }`).

The header note (D3) reads: **"Quantitative details (mandatory if liable for audit under section 44AB) (Note: If no entry is made in first row then other rows will not be considered)"** (from `sources/ITR-5/utility/xl/sharedStrings.xml`; the row dump truncates it to `...(Note: If no entry is made i`).

The schedule is three independent quantity grids, one per concern type:
- **(a) Trading concern** (C4) → schema object `TradingConcern.QuantitDet[]` — physical rows 7–10, a repeating grid (maxItems 20).
- **(b) Manufacturing concern – Raw Materials** (C13) → `ManfactrConcern.RawMaterial.QuantitDet[]` — physical rows 16–19, repeating (maxItems 20).
- **(C) Manufacturing concern – 7.Finished products/ By-products** (C22) → `ManfactrConcern.FinishrByProd.QuantitDet[]` — physical rows 25–29, repeating (maxItems 20).

There are **no hidden (H) rows** in this sheet — every dumped row is a live label or a data row. There are **no computed/derived cells** (no `--formulas` output beyond the plain labels); the only sheet-computed logic is data-validation min/max on the numeric cells (see "The rules the sheet computes"). The grids are pure data entry; the assessee types the item lines.

## The items

Grid rows are entered under the header rows. The lettering below uses the sheet's column letters (header row cells).

### (a) Trading concern — `TradingConcern.QuantitDet[]` (rows 7–10, header row 5)

| Col | Field (header) | Type | Schema key (leaf) | Rule |
|-----|----------------|------|-------------------|------|
| C5 | Item Name | string, maxLen 25 | `TradingConcern.QuantitDet[].ItemName` | mandatory once a row is used; DV source `25` on C7:C10 = 25-char cap; `< > & ' " $` not allowed (VBA) |
| D5 | Unit | dropdown | `TradingConcern.QuantitDet[].UnitOfMeasure` | mandatory; enum of 23 unit codes (`cmb_QDTradingConcern.UnitOfMeasure`) |
| E5 | Opening stock | integer | `TradingConcern.QuantitDet[].OpeningStock` | mandatory; min 0, max 99999999999999 |
| F5 | Purchase during the previous year | integer | `TradingConcern.QuantitDet[].PurchaseQty` | mandatory; min 0, max 99999999999999 |
| G5 | Sales during the previous year | integer | `TradingConcern.QuantitDet[].SaleQty` | mandatory; min 0, max 99999999999999 |
| H5 | Closing stock | integer | `TradingConcern.QuantitDet[].ClgStock` | mandatory; min 0, max 99999999999999 |
| I5 | Shortage/ excess, if any | integer | `TradingConcern.QuantitDet[].AnyShortExces` | mandatory; min -99999999999999, max 99999999999999 (can be negative) |

### (b) Manufacturing concern – Raw Materials — `ManfactrConcern.RawMaterial.QuantitDet[]` (rows 16–19, header row 14)

| Col | Field (header) | Type | Schema key (leaf) | Rule |
|-----|----------------|------|-------------------|------|
| C14 | Item Name | string, maxLen 25 | `ManfactrConcern.RawMaterial.QuantitDet[].ItemName` | mandatory once a row is used; DV source `25` on C16:C19 = 25-char cap; `< > & ' " $` not allowed (VBA) |
| D14 | Unit | dropdown | `ManfactrConcern.RawMaterial.QuantitDet[].UnitOfMeasure` | mandatory; enum of 23 unit codes (`cmb_QDRawMaterial.UnitOfMeasure`) |
| E14 | Opening stock | integer | `ManfactrConcern.RawMaterial.QuantitDet[].OpeningStock` | mandatory; min 0, max 99999999999999 |
| F14 | Purchase during the previous year | integer | `ManfactrConcern.RawMaterial.QuantitDet[].PurchaseQty` | mandatory; min 0, max 99999999999999 |
| G14 | Consumption during the previous year | integer | `ManfactrConcern.RawMaterial.QuantitDet[].PrevYrConsum` | mandatory (VBA: "Consumption during prev. year ... is mandatory"); min 0, max 99999999999999 |
| H14 | Sales during the previous year | integer | `ManfactrConcern.RawMaterial.QuantitDet[].SaleQty` | mandatory; min 0, max 99999999999999 |
| I14 | Closing stock | integer | `ManfactrConcern.RawMaterial.QuantitDet[].ClgStock` | mandatory; min 0, max 99999999999999 |
| J14 | Yield Finished Products | integer | `ManfactrConcern.RawMaterial.QuantitDet[].yldFinisProd` | mandatory (VBA: "Yield finished products ... is mandatory"); min 0, max 99999999999999 |
| K14 | Percentage of yield | number | `ManfactrConcern.RawMaterial.QuantitDet[].PercentYld` | mandatory (VBA: "Percentage of yield ... is mandatory"); min 0, max 100 |
| L14 | Shortage/ excess, if any | integer | `ManfactrConcern.RawMaterial.QuantitDet[].AnyShortExces` | mandatory; min -99999999999999, max 99999999999999 (can be negative) |

### (C) Manufacturing concern – Finished products/ By-products — `ManfactrConcern.FinishrByProd.QuantitDet[]` (rows 25–29, header row 23)

| Col | Field (header) | Type | Schema key (leaf) | Rule |
|-----|----------------|------|-------------------|------|
| C23 | Item Name | string, maxLen 25 | `ManfactrConcern.FinishrByProd.QuantitDet[].ItemName` | mandatory once a row is used; DV source `25` on C25:C29 = 25-char cap; `< > & ' " $` not allowed (VBA) |
| D23 | Unit | dropdown | `ManfactrConcern.FinishrByProd.QuantitDet[].UnitOfMeasure` | mandatory; enum of 23 unit codes (`cmb_QDFinishrByProd.UnitOfMeasure`) |
| E23 | Opening stock | integer | `ManfactrConcern.FinishrByProd.QuantitDet[].OpeningStock` | mandatory; min 0, max 99999999999999 |
| F23 | Purchase during the previous year | integer | `ManfactrConcern.FinishrByProd.QuantitDet[].PurchaseQty` | mandatory; min 0, max 99999999999999 |
| G23 | Quantity manufactured during the previous year | integer | `ManfactrConcern.FinishrByProd.QuantitDet[].PrevyrManfact` | mandatory (VBA validator uses `PrevYrConsum`: "Quantity manufactured during prev. year ... is mandatory"); min 0, max 99999999999999 |
| H23 | Sales during the previous year | integer | `ManfactrConcern.FinishrByProd.QuantitDet[].SaleQty` | mandatory; min 0, max 99999999999999 |
| I23 | Closing stock | integer | `ManfactrConcern.FinishrByProd.QuantitDet[].ClgStock` | mandatory; min 0, max 99999999999999 |
| J23 | Shortage/ excess, if any | integer | `ManfactrConcern.FinishrByProd.QuantitDet[].AnyShortExces` | mandatory; min -99999999999999, max 99999999999999 (can be negative) |

**Naming discrepancy to carry into the build:** for the Finished-products grid the schema key for the "Quantity manufactured during the previous year" column is **`PrevyrManfact`** (from `--leaves`/`--schema PARTA_QD`), but the legacy VBA grid definition and validator name it **`QDFinishrByProd.PrevYrConsum`** (`AddRows_Finished_QD` and `ValidatePrevYrConsum_QDFinishrByProd`). The **schema key `PrevyrManfact` is authoritative** for the export/return JSON. The Raw-Materials grid genuinely uses `PrevYrConsum` (Consumption) — do not confuse the two.

## The rules the sheet computes

There are no arithmetic/derived formulas in this sheet (nothing to auto-total or auto-fill; `--formulas` returns only the plain labels). The sheet-level rules are data-validation bounds and VBA validators:

- **Item Name length cap = 25** — data validation `source="25"` on `C16:C19 C25:C29 C7:C10` (matches schema `maxLength 25`). Cell refs: C7:C10 (trading), C16:C19 (raw), C25:C29 (finished).
- **Non-negative quantity cells (min 0)** — DV `source="0"` on: E7:E10, F7:F10, G7:G10, H7:H10 (trading); E16:E19, F16:F19, G16:G19, H16:H19, I16:I19, J16:J19, K16:K19 (raw); E25:E29, F25:F29, G25:G29, H25:H29, I25:I29 (finished). Matches schema `minimum 0`.
- **Shortage/excess may be negative (min -99999999999999)** — DV `source="-99999999999999"` on `L16:L19 J25:J29 I7:I10` (i.e. I7:I10 trading, L16:L19 raw, J25:J29 finished). Matches schema `minimum -99999999999999`.
- **Percentage of yield capped at 100** — schema `PercentYld` `maximum 100, minimum 0` (K16:K19). This is the only sub-100 numeric cap.
- **Item Name character restriction** — VBA: `ItemName at Sr. No. 3 in Sheet QUANTITATIVE_DETAILS characters < > & ' " $ b are not allowed`.
- **Schedule-mandatory trigger (VBA):** `If isOtherNOB And Sheet1.Range("sheet1.LiableSec44ABflg").Value = "Y-Yes" Then If end_QDRawMaterial = 0 And end_QDTradingConcern = 0 Then ... MsgBox "Schedule QUANTITATIVE_DETAILS compulsory"` — when liable for audit u/s 44AB (with the relevant nature-of-business flag), at least one row across the Trading or Raw-Material grid is required.
- **"First row governs" rule (D3 note):** *"If no entry is made in first row then other rows will not be considered"* — a grid's later rows are ignored unless its first row is filled.
- **Per-cell "please enter/select" validators (VBA):** every column of every used row is individually mandatory once a grid row is started, e.g. "Please enter Item name of trading concern...", "Please select Unit of measure of trading concern...", "Please enter Opening stock...", "Please enter Purchase...", "Please enter Sales...", "Please enter Closing stock...", "Please enter Shortage/ excess..." (and the analogous messages for Raw material and Finished goods, plus Consumption / Yield finished products / Percentage of yield for Raw materials).

## Dropdowns

Three dropdowns carry values, all the **same 23-value unit-of-measure list** (one bound name each). Sources: `cmb_QDTradingConcern.UnitOfMeasure` (D7:D10), `cmb_QDRawMaterial.UnitOfMeasure` (D16:D19), `cmb_QDFinishrByProd.UnitOfMeasure` (D25:D29). The stored enum code is the numeric prefix (101…122, 999); `(Select)` is the empty placeholder.

Full value list (identical for all three):
- (Select)
- 101-gms
- 102-kilograms
- 103-litre
- 104-kilolitre
- 105-metre
- 106-kilometre
- 107-numbers
- 108-quintal
- 109-ton
- 110-pound
- 111-milligrams
- 112-carat
- 113-numbers (1000s)
- 114-kwatt
- 115-mwatt
- 116-inch
- 117-feet
- 118-sqft
- 119-acre
- 120-cubicft
- 121-sqmetre
- 122-cubicmetre
- 999-residual

The other data-validation entries reported by `--dropdowns` (cells with `"values": null` and `source` `0`, `25`, or `-99999999999999`) are **numeric bounds, not pick-lists** — covered under "The rules the sheet computes".

## What repeats and what is one figure

- **All three grids repeat.** Each is a schema **array `QuantitDet[]` with `maxItems 20`** — up to 20 item lines per grid. The utility ships ~4–5 physical rows each (trading 7–10; raw 16–19; finished 25–29) and adds rows via VBA `AddRows_Trdng_QD` / `AddRows_Rawmtrl_QD` / `AddRows_Finished_QD`.
- **No single/one-figure fields** in this schedule — there are no schedule totals, no grand-total cells, nothing summed on the sheet. Every value is a per-item line entry inside one of the three arrays.

## Mandatory

From the schema (`--schema PARTA_QD`): top-level `PARTA_QD` `required: None`, and the three grid objects (`TradingConcern`, `ManfactrConcern.RawMaterial`, `ManfactrConcern.FinishrByProd`) are structurally optional — the whole schedule is **conditionally mandatory** (only when liable for audit u/s 44AB, per D3 and the VBA trigger above).

**Once a grid row is entered**, the schema `required` (`*`) leaves that must be present:
- **Trading (`TradingConcern.QuantitDet[]`):** `ItemName`, `UnitOfMeasure`, `OpeningStock`, `PurchaseQty`, `SaleQty`, `ClgStock`, `AnyShortExces` — all required. (No optional leaves.)
- **Raw Materials (`ManfactrConcern.RawMaterial.QuantitDet[]`):** required — `ItemName`, `UnitOfMeasure`, `OpeningStock`, `PurchaseQty`, `SaleQty`, `ClgStock`, `AnyShortExces`. Schema-optional leaves — `PrevYrConsum`, `yldFinisProd`, `PercentYld` (these three are *not* starred in the schema, but the VBA validators still demand them, so treat them as mandatory-in-practice in the build).
- **Finished/By-products (`ManfactrConcern.FinishrByProd.QuantitDet[]`):** required — `ItemName`, `UnitOfMeasure`, `OpeningStock`, `PurchaseQty`, `SaleQty`, `ClgStock`, `AnyShortExces`. Schema-optional leaf — `PrevyrManfact` (again VBA-mandatory in practice).

## Hidden rows — not built

**None.** No row in the `--dump` output is flagged `H`; every dumped row is a live section label, a column-header row, or a data-entry row. There is nothing to exclude.

## What this means for the build

- Build **three repeating grids** (arrays, maxItems 20), each with an "add row" affordance, under one schedule "Part A – QD". Bind them to `TradingConcern.QuantitDet[]`, `ManfactrConcern.RawMaterial.QuantitDet[]`, and `ManfactrConcern.FinishrByProd.QuantitDet[]`.
- The three grids have **different column sets**: Trading = 7 columns; Raw Materials = 10 columns (adds Consumption, Yield Finished Products, Percentage of yield); Finished = 8 columns (adds Quantity manufactured).
- **Unit dropdown**: one shared 23-code enum; store the numeric prefix (101…122, 999). Empty = `(Select)`.
- **Export key trap**: use **`PrevyrManfact`** for the Finished-goods "Quantity manufactured" column (schema-correct), and **`PrevYrConsum`** for the Raw-Materials "Consumption" column. They are different keys despite the VBA grid definition reusing `PrevYrConsum` for both.
- **Validation**: enforce ItemName ≤25 chars and reject `< > & ' " $`; enforce min 0 on all quantity columns, min -99999999999999 (allow negative) on Shortage/excess, and 0–100 on Percentage of yield. Once any grid row is started, require every column of that row (per VBA); ignore rows after an empty first row (D3 note).
- **Conditional gating**: surface/require the schedule when the assessee is liable for audit u/s 44AB (`sheet1.LiableSec44ABflg = "Y-Yes"`) with the relevant nature-of-business; otherwise the whole schedule is optional. No totals to compute — this schedule feeds nothing arithmetically; it is a disclosure grid.
