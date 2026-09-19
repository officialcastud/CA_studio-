# Schedule 112A — ITR-5, A.Y. 2026-27

Block: **Schedule112A** · section `cg` (from `books/ITR-5/section_map.json`: `"Schedule 112A" => {"section": "cg", "blocks": ["Schedule112A"]}`).

Sheet title (`[C3]`): **Schedule 112A**, subtitle `[E3]`: *"From sale of equity share in a company or unit of equity oriented fund or unit of a business trust o…"* (dump truncates at 100 chars) — i.e. LTCG u/s 112A on equity shares / units of an equity-oriented fund / units of a business trust on which STT is paid, with grandfathering of the 31-Jan-2018 fair market value.

## The shape

A **repeating scrip-wise grid** (one row per ISIN / share / unit sold) with a **single Total row**. Data-entry rows in the utility template are rows 6–9 (four sample rows); the schema block `Schedule112ADtls` is an unbounded `array`, so the built form must allow **add-row** rather than fix four rows. Row 11 is the visible **Total** row whose column sums feed Schedule CG (Sl. No. B4 = Col. 14 total). Rows 12, 13, 14 are **hidden** helper totals (before / on-or-after 23-Jul-2024 splits) — not built.

Two dropdowns per row govern everything: **Col 1a — Share/Unit Acquired** (before/after 31-Jan-2018, drives grandfathering) and **Col 1b — Share/Unit Transferred** (before/on-or-after 23-Jul-2024, drives the rate split downstream).

## The items

Columns as lettered on the sheet. `[cell]` is the utility template cell (row 6 = first data row). "Type" is the schema type. Schema key = leaf of `Schedule112ADtls[]` (all keys quoted verbatim from `--leaves Schedule112A`).

| Col | Cell (r6) | Field (header `[r4]`) | Type | Schema key | Rule |
|-----|-----------|----------------------|------|------------|------|
| 1 | `D6` | Sl. No. `(Col 1)` | int | *(index, not in schema)* | Auto: `D7=D6+1` (serial increment) |
| 1a | `E6` | Share/Unit Acquired `(Col 1a)` | string | `ShareOnOrBefore` | Dropdown; enum `BE`/`AE`. **Mandatory** |
| 1b | `F6` | Share/Unit Transferred (Before / on or After 23rd July 2024) `(Col 1b)` | string | *(drives rate split; stored via ShareTra_112A)* | Dropdown |
| 2 | `G6` | ISIN Code `(Col 2)` | string | `ISINCode` | Pattern: `IN[0-9A-Z]{10}` if acquired on/before 31-Jan-2018; `INNOTREQUIRD` if after; `INNOTAVAILAB` if security unavailable. **Mandatory** |
| 3 | `H6` | Name of the Share/Unit `(Col 3)` | string | `ShareUnitName` | `[w]*` on/before 31-Jan-2018; `CONSOLIDATED` after (maxLength 125). **Mandatory** |
| 4 | `I6` | No. of Shares/Units `(Col 4)` | number | `NumSharesUnits` | 0 ≤ x ≤ 1e14 |
| 5 | `J6` | Sale-price per Share/Unit `(Col 5)` | number | `SalePricePerShareUnit` | 0 ≤ x ≤ 1e14 |
| 6 | `K6` | Full Value of Consideration If shares/units are acquired on or before 31st January, 2018 (Total Sale…) `(Col 6)` | int | `TotSaleValue` | **Computed** (see rules). **Mandatory** |
| 7 | `L6` | Cost of acquisition without indexation Higher of 8 & 9 `(Col 7)` | int | `CostAcqWithoutIndx` | **Computed** = higher of Col 8 & 9. **Mandatory** |
| 8 | `M6` | Cost of acquisition `(Col 8)` | number | `AcquisitionCost` | Input. 0 ≤ x ≤ 1e14. **Mandatory** |
| 9 | `N6` | If the long term capital asset was acquired before 01.02.2018, Lower of 6 & 11 `(Col 9)` | int | `LTCGBeforelower6and11` | **Computed** = lower of Col 6 & 11 |
| 10 | `O6` | Fair Market Value per share/unit as on 31st January, 2018 `(Col 10)` | number | `FairMktValuePerShareunit` | Input. 0 ≤ x ≤ 1e14 |
| 11 | `P6` | Total Fair Market Value as on 31st January, 2018 of capital asset as per section 55(2)(ac) - (4*10) `(Col 11)` | int | `TotFairMktValueCapAst` | **Computed** = Col 4 × Col 10 |
| 12 | `Q6` | Expenditure wholly and exclusively in connection with transfer `(Col 12)` | number | `ExpExclCnctTransfer` | Input. 0 ≤ x ≤ 1e14. **Mandatory** |
| 13 | `R6` | Total deductions (7+12) `(Col 13)` | int | `TotalDeductions` | **Computed** = Col 7 + Col 12. **Mandatory** |
| 14 | `S6` | Balance (6-13) Item 5 of LTCG Schedule of ITR5 `(Col 14)` | int | `Balance` | **Computed** = Col 6 − Col 13 (may be negative, min −1e14). **Mandatory** |

### Total row (row 11 — one figure each, block-level schema keys)

| Cell | Column summed | Schema key | Formula |
|------|---------------|------------|---------|
| `K11` | Col 6 Total Sale Value | `SaleValue112A` | `SUM(TotalSaleValue_112A)` |
| `L11` | Col 7 COA without indexation | `CostAcqWithoutIndx112A` | `SUM(COAwithoutIndex_112A)` |
| `M11` | Col 8 Cost of acquisition | `AcquisitionCost112A` | `SUM(COAwithIndex_112A)` |
| `N11` | Col 9 LTCG lower of 6 & 11 | `LTCGBeforelowerB1B2112A` | `SUM(LTCGAssetAcquired_112A)` |
| `P11` | Col 11 Total FMV | `FairMktValueCapAst112A` | `SUM(TotalFairMarketValue_112A)` |
| `Q11` | Col 12 Expenditure | `ExpExclCnctTransfer112A` | `SUM(ExpenditureWholly_112A)` |
| `R11` | Col 13 Total deductions | `Deductions112A` | `SUM(TotalDeductions_112A)` |
| `S11` | Col 14 Balance | `Balance112A` | `SUM(Balance_112A)` |

(Col 10 FMV-per-unit and Col 4/5 are not totalled; there is no total cell for them on row 11.)

## The rules the sheet computes (with cell references)

Per-row formulas (row 6 shown; identical for 7, 8, 9):

- **Col 6 `K6`** `= ROUND(MAX(0,ROUND(I6,4)*ROUND(J6,4)),0)` — Total Sale Value = No. of units × Sale price, floored at 0. Matches rule **A457**: *"Col. 6 Total Sale Value should be equal to Col. 4*Col. 5 for the shares purchased 'On or Before 31st January 2018'"*.
- **Col 7 `L6`** `= ROUND(MAX(0,ROUND(M6,4),ROUND(N6,0)),0)` — COA without indexation = **higher of Col 8 and Col 9**. Rule **A451**: *"Col. 7 Cost of acquisition without indexation should be higher of Col. 8 and Col. 9"*.
- **Col 9 `N6`** `= ROUND(MAX(0,MIN(ROUND(P6,0),ROUND(K6,0))),0)` — = **lower of Col 6 and Col 11**. Rule **A452**: *"Col. 9 … should be lower of Col. 6 and Col. 11"*.
- **Col 11 `P6`** `= ROUND(MAX(0,ROUND(I6,4)*ROUND(O6,4)),0)` — Total FMV as on 31-Jan-2018 = Col 4 × Col 10. Rule **A458**: *"Col. 11 'Total Fair Market Value…' should be equal to Col. 4*Col.[10]"*.
- **Col 13 `R6`** `= ROUND(MAX(0,SUM(ROUND(L6,0),ROUND(Q6,4))),0)` — Total deductions = Col 7 + Col 12. Rule **A453**: *"Col. 13 Total deductions should be equal to sum of Col. (7+12)"*.
- **Col 14 `S6`** `= ROUND(ROUND(K6,0)-ROUND(R6,0),0)` — Balance = Col 6 − Col 13 (can be negative). Rule **A454**: *"Col. 14 Balance should be equal to the output of Col. 6-Col. 13"*.
- **`V6`** (helper col, off the visible grid) `= IF(ISERROR(VLOOKUP(G6,ISINListTable,2,FALSE)),"",VLOOKUP(G6,ISINListTable,2,FALSE))` — ISIN → name lookup against `ISINListTable` (validation helper only, not a schema field).

Total-row rule **A455**: *"Total of Col 6, 7, 8, 9, 11, 12, 13 and 14 should be equal to the sum of Sl. No. (1+2+3+4+…..)"* — enforced by the `SUM(...)` named-range formulas on row 11.

Dropdown-conditioned rule **A456**: *"Value at Column no. 4,5 & 11 cannot be greater than zero in case drop down is selected as 'After 31st January 2018'"* — when Col 1a = After 31-Jan-2018, Cols 4, 5 and 11 must be 0 (grandfathering does not apply, so no No./Sale-price/FMV split).

Cross-schedule rule **A373**: *"In Schedule CG, Sl. No. B4 LTCG u/s 112A should be equal to total of Col. 14 of Schedule 112A"* — `Balance112A` (`S11`) feeds Schedule CG B4.

## Dropdowns (every value)

**Col 1a — Share/Unit Acquired** (`E6:E9`), source `"(Select),On or before 31st January 2018, After 31st January 2018"`:
- `(Select)`
- `On or before 31st January 2018`
- `After 31st January 2018` (note: leading space in source — ` After 31st January 2018`)

Maps to schema `ShareOnOrBefore` enum: `BE` (on/before 31-Jan-2018) and `AE` (after).

**Col 1b — Share/Unit Transferred** (`F6:F9`), source `"(Select),Before 23rd July 2024 ,On or after 23rd July 2024"`:
- `(Select)`
- `Before 23rd July 2024` (note: trailing space in source — `Before 23rd July 2024 `; used by hidden `SUMIFS` on `ShareTra_112A`)
- `On or after 23rd July 2024`

No other cells carry a value list (all other `dataValidation` entries are numeric constraints with `values: null`).

## What repeats and what is one figure

- **Repeats (per scrip / ISIN):** every column 1–14 (`Schedule112ADtls[]` array). Utility ships 4 template rows (6–9); the array is unbounded — build **add-row**.
- **One figure (Total row 11):** the eight `…112A` block-level totals (`SaleValue112A`, `CostAcqWithoutIndx112A`, `AcquisitionCost112A`, `LTCGBeforelowerB1B2112A`, `FairMktValueCapAst112A`, `ExpExclCnctTransfer112A`, `Deductions112A`, `Balance112A`). `Balance112A` (Col 14 total) is the single number that flows out to Schedule CG B4.

## Mandatory (from schema `required`)

Per-row (`Schedule112ADtls` required): `ShareOnOrBefore`, `ISINCode`, `ShareUnitName`, `TotSaleValue`, `CostAcqWithoutIndx`, `AcquisitionCost`, `ExpExclCnctTransfer`, `TotalDeductions`, `Balance`.
Optional per-row: `NumSharesUnits`, `SalePricePerShareUnit`, `LTCGBeforelower6and11`, `FairMktValuePerShareunit`, `TotFairMktValueCapAst`.

Block-level required (all eight): `SaleValue112A`, `CostAcqWithoutIndx112A`, `AcquisitionCost112A`, `LTCGBeforelowerB1B2112A`, `FairMktValueCapAst112A`, `ExpExclCnctTransfer112A`, `Deductions112A`, `Balance112A`.

## Hidden rows — not built

Rows marked `H` by the dump (never rendered as sheet items; kept only as documentation of the utility's internal totals):

- **r12H `[C12]`** "Total of column (14) where transfer was before 23rd July 2024" — `S12 = IFERROR(SUMIFS(Balance_112A,ShareTra_112A,"Before 23rd July 2024 "),0)`.
- **r13H `[C13]`** "Total of column (14) where transfer was on or after 23rd July 2024" — `S13 = IFERROR(SUMIFS(Balance_112A,ShareTra_112A,"On or after 23rd July 2024"),0)`.
- **r14H `[C14]`** "Total of LTCG u/s 112A" — `S14 = SUM(Total_Balance_112ABE,Total_Balance_112AAE)`.

These pre-split the Col-14 balance by transfer date (the 23-Jul-2024 rate change: 10%→12.5% LTCG). They are computed downstream in Schedule CG / SI, not entered here.

## What this means for the build

- Build a **repeating table** bound to `Schedule112ADtls[]` with an add-row control; do not hard-code four rows.
- **Compute, don't collect,** Cols 6, 7, 9, 11, 13, 14 (formulas above) and Sl. No. — only Cols 1a, 1b, 2, 3, 4, 5, 8, 10, 12 are user inputs.
- Enforce **A456**: when Col 1a = "After 31st January 2018" (`AE`), force Cols 4, 5, 11 to 0 and require `ISINCode = INNOTREQUIRD`, `ShareUnitName = CONSOLIDATED`.
- Emit the eight `…112A` block totals from the row-11 SUMs; wire `Balance112A` → Schedule CG B4 (A373).
- Do not render rows 12–14; if the CG/SI rate split needs the before/after-23-Jul figures, derive them at export via `SUMIFS` on the `ShareTra_112A` values, matching the exact dropdown strings (mind the trailing/leading spaces).
- Balance may be **negative** (Col 14 min −1e14); do not floor the total.
