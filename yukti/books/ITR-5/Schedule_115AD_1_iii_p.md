# Schedule 115AD(1)(iii)(p) — ITR-5, A.Y. 2026-27

Sheet name (verbatim): **Schedule 115AD(1)(iii)(p)** · block: **Schedule115AD** · section: `cg`
Book filename derived by Gate 3: `books/ITR-5/Schedule_115AD_1_iii_p.md`

Sources read (never memory):
- `python3 tools/dump.py --form ITR-5 --sheet "Schedule 115AD(1)(iii)(p)"` (rows + `--formulas`)
- `python3 tools/dump.py --form ITR-5 --dropdowns "Schedule 115AD(1)(iii)(p)"`
- `python3 tools/dump.py --form ITR-5 --schema Schedule115AD` and `--leaves Schedule115AD`
- `books/ITR-5/rules.json` (rules n:378, 459, 460, 461, 464, 465 + the Col.13/Col.14 text), `enums.json`, `sources/ITR-5/ITR-5_2026_Main_V1_1_schema.json`, `sources/ITR-5/vba_text.txt`

---

## The shape

A single tabular schedule, one array. Sheet title `[C3] Schedule -115AD(1)(b)(iii)` with sub-caption `[E3] For NON-RESIDENTS - From sale of equity share in a company or unit of equity oriented fund or unit of a business trust on which STT is paid under section 112A rws 115AD(1)(b)(iii) proviso`.

This is the FII/FPI counterpart of Schedule 112A: LTCG on the sale of STT-paid equity shares / units of equity-oriented funds / units of a business trust, computed under the proviso to section 115AD(1)(b)(iii). It is enabled only when Part A-General "Whether you are FII / FPI?" = "Yes" (rules.json n:25).

Layout (from rows dump):
- **r3** — title / caption.
- **r4** — column headers (the item labels).
- **r5** — the utility's column-number legend `(Col 1)` … `(Col 14)`, plus `(Col 1a)` and `(Col 1b)`.
- **r6:r9** — the four template data-entry rows (`D7=D6+1` auto-serials; the array is extended by CSV import — see the `115` import staging sheet, excluded).
- **r11** — `Total` row (the SUM of each numeric column → the 8 block-level total keys).
- **r12H, r13H, r14H** — hidden totals (see Hidden rows).

The single schema block **Schedule115AD** carries: one array `Schedule115ADDtls[]` (the per-line rows) plus 8 scalar totals that mirror the r11 Total row.

---

## The items

### Block `Schedule115AD` — array rows `Schedule115ADDtls[]` (cells r6:r9, repeats)

| Sheet col | Field (verbatim r4 label) | Type | Schema key (`Schedule115ADDtls[].`) | Rule / source |
|---|---|---|---|---|
| Col 1 (D) | `Sl. No.` | serial (auto) | — (array index; no key) | `D7=D6+1` — auto serial, not exported |
| Col 1a (E) | `Share/Unit Acquired` | dropdown | `ShareOnOrBefore` (enum BE/AE) | acquisition-date bucket; drives rule n:464/465 |
| Col 1b (F) | `Share/Unit Transferred (Before/ on or after 23rd July 2024)` | dropdown | **— no schema key** (utility helper; see below) | feeds hidden SUMIFS r12/r13 |
| Col 2 (G) | `ISIN Code` | text | `ISINCode` | pattern `IN[0-9A-Z]{10}|INNOTREQUIRD`; INNOTAVAILAB if none |
| Col 3 (H) | `Name of the Share/Unit` | text | `ShareUnitName` | maxLength 125; `CONSOLIDATED` when AE |
| Col 4 (I) | `No. of Shares/Units` | number | `NumSharesUnits` | min 0, max 1e14, multipleOf 0.0001 |
| Col 5 (J) | `Sale-price per Share/Unit` | number | `SalePricePerShareUnit` | min 0, max 1e14, multipleOf 0.0001 |
| Col 6 (K) | `Full Value Consideration If shares are acquired on or before 31.01.2018- Total Sale Value (4*5) or If shares are Acquired after 31st January 2018 - Please enter Full Value of Consideration` | integer (computed) | `TotSaleValue` | `K6=ROUND(MAX(0,I6*J6),0)` (n:465) |
| Col 7 (L) | `Cost of acquisition without indexation` | integer (computed) | `CostAcqWithoutIndx` | `L6=MAX(0,M6,N6)` — higher of Col 8 & Col 9 (n:459) |
| Col 8 (M) | `Cost of acquisition` | number (input) | `AcquisitionCost` | min 0, max 1e14, multipleOf 0.0001 |
| Col 9 (N) | `If the long term capital asset was acquired before 01.02.2018 , Lower of 6 & 11` | integer (computed) | `LTCGBeforelower6and11` | `N6=MAX(0,MIN(P6,K6))` — lower of Col 6 & Col 11 (n:460/461) |
| Col 10 (O) | `Fair Market Value per share/unit as on 31st January,2018` | number (input) | `FairMktValuePerShareunit` | min 0, max 1e14, multipleOf 0.0001 |
| Col 11 (P) | `Total Fair Market Value as on 31st January,2018 of capital asset as per section 55(2)(ac)- (4*10)` | integer (computed) | `TotFairMktValueCapAst` | `P6=ROUND(MAX(0,I6*O6),0)` (Col 4 * Col 10) |
| Col 12 (Q) | `Expenditure wholly and exclusively in connection with transfer` | number (input) | `ExpExclCnctTransfer` | min 0, max 1e14, multipleOf 0.0001 |
| Col 13 (R) | `Total deductions (7+12)` | integer (computed) | `TotalDeductions` | `R6=MAX(0,SUM(L6,Q6))` — Col 7 + Col 12 (n:461) |
| Col 14 (S) | `Balance (6-13) Item 8 of LTCG Schedule of ITR5` | integer (computed) | `Balance` | `S6=ROUND(K6-R6,0)` — Col 6 − Col 13 (n rule 2310) |

Legend row r5: `(Col 1)` `(Col 1a)` `(Col 1b)` `(Col 2)` `(Col 3)` `(Col 4)` `(Col 5)` `(Col 6)` `(Col 7)` `(Col 8)` `(Col 9)` `(Col 10)` `(Col 11)` `(Col 12)` `(Col 13)` `(Col 14)`.

### Block `Schedule115AD` — scalar totals (r11 `Total` row; one figure each)

| Sheet cell | Feeds column | Schema key | Formula (verbatim) |
|---|---|---|---|
| K11 | Col 6 total | `SaleValue115AD` | `SUM(TotalSaleValue_115AD)` |
| L11 | Col 7 total | `CostAcqWithoutIndx115AD` | `SUM(COAwithoutIndex_115AD)` |
| M11 | Col 8 total | `AcquisitionCost115AD` | `SUM(COAwithIndex_115AD)` |
| N11 | Col 9 total | `LTCGBeforelowerB1B2115AD` | `SUM(LTCGAssetAcquired_115AD)` |
| P11 | Col 11 total | `FairMktValueCapAst115AD` | `SUM(TotalFairMarketValue_115AD)` |
| Q11 | Col 12 total | `ExpExclCnctTransfer115AD` | `SUM(ExpenditureWholly_115AD)` |
| R11 | Col 13 total | `Deductions115AD` | `SUM(TotalDeductions_115AD)` |
| S11 | Col 14 total | `Balance115AD` | `SUM(Balance_115AD)` |

(There is no total shown for Col 5 or Col 10, and no total key for the transfer-date column.)

---

## The rules the sheet computes (with cell references)

Per data row (r6:r9), rows 7-9 replicate row 6's formulas:
- **Col 1 (D)** — `D7= D6+1` — serial auto-increments (row 6 is the base).
- **Col 6 (K)** — `K6= ROUND(MAX(0,ROUND(I6,4)*ROUND(J6,4)),0)` — Total Sale Value = No. of shares (Col 4) × Sale price (Col 5), floored at 0. rules.json n:465: "Col. 6 Total Sale Value should be equal to Col. 4*Col. 5 for the shares purchased On or Before 31st January 2018".
- **Col 7 (L)** — `L6= IFERROR(ROUND(MAX(0,ROUND(M6,4),ROUND(N6,0)),0),0)` — **higher of Col 8 and Col 9**. rules.json n:459: "Col. 7 Cost of acquisition without indexation should be higher of Col. 8 and Col. 9".
- **Col 9 (N)** — `N6= IFERROR(ROUND(MAX(0,MIN(ROUND(P6,0),ROUND(K6,0))),0),0)` — **lower of Col 11 (P) and Col 6 (K)**. rules.json n:460/461: "Col. 9 ... should be lower of Col. 6 and Col. 11".
- **Col 11 (P)** — `P6= IFERROR(ROUND(MAX(0,ROUND(I6,4)*ROUND(O6,4)),0),0)` — Total FMV as on 31-Jan-2018 = Col 4 × Col 10.
- **Col 13 (R)** — `R6= IFERROR(ROUND(MAX(0,SUM(ROUND(L6,0),ROUND(Q6,4))),0),0)` — Total deductions = Col 7 + Col 12. rules.json n:461: "Col. 13 Total deductions should be equal to sum of Col. (7+12)".
- **Col 14 (S)** — `S6= ROUND(ROUND(K6,0)-ROUND(R6,0),0)` — Balance = Col 6 − Col 13. rules.json (rule text 2310): "Col. 14 Balance should be equal to the output of Col. 6-Col. 13".
- **Helper col V (hidden, not a schema field)** — `V6= IF(ISERROR(VLOOKUP(G6,ISINListTable,2,FALSE)),"",VLOOKUP(G6,ISINListTable,2,FALSE))` — ISIN lookup helper.

Constraint (validator, rules.json n:464): "Value at Column no. 4,5 & 11 cannot be greater than zero in case drop down is selected as 'After 31st January 2018'" for Col 1a. i.e. when `ShareOnOrBefore = AE`, Col 4 (No.), Col 5 (Sale price) and Col 11 (Total FMV) must be 0 — the grandfathering FMV route applies only to shares held on/before 31-Jan-2018.

Totals (r11): each column total = `SUM(<named range>)` over the array — see the totals table above. rules.json n rule (text 2315): "Total of Col 6, 7, 8, 9, 11, 12, 13 and 14 should be equal to the sum of Sl. No. (1+2+3+4+…..)".

Cross-schedule: rules.json n:378 — "Schedule CG, Sl. No. B7 LTCG u/s 112A should be equal to total of Col. 14 of Schedule 115AD(1)(iii)" (i.e. `Balance115AD` / S11 flows to Schedule CG B7). SI-side ceilings at rules.json n:715, n:3625, n:3630 (the 115AD(1)(b)(iii)-Proviso special-income line).

---

## Dropdowns (every value)

Two real value-list dropdowns; the rest are numeric/length validations (source `"0"`, min 0; text length; `-99999999999999` floors), not pick-lists.

**Col 1a (E6:E9) `Share/Unit Acquired`** → schema `ShareOnOrBefore` (enums.json: `BE`=On or Before 31st January 2018, `AE`=After 31st January 2018):
- `(Select)`
- `On or before 31st January 2018`
- `After 31st January 2018`

**Col 1b (F6:F9) `Share/Unit Transferred (Before/ on or after 23rd July 2024)`** → **no schema key**:
- `(Select)`
- `Before 23rd July 2024`
- `On or after 23rd July 2024`

Non-list validations (no pick values): `I6:J9`, `K6:K9`, `L6:L9`, `M6:M9`, `N6:N9`, `O6:O9 Q6:Q9`, `P6:P9`, `R6:R9` all source `"0"` (numeric ≥ 0); `H6:H9` source `125` (name text length); `G6:G9` source `12` (ISIN text); `S6:S9` and `S11:S14` source `-99999999999999` (integer floor).

---

## What repeats and what is one figure

- **Repeats** — `Schedule115ADDtls[]` is an array: one entry per share/unit line. The utility shows 4 template rows (r6:r9); real returns extend the array via the CSV import staging sheet `115` (excluded). Per-row fields: `ShareOnOrBefore, ISINCode, ShareUnitName, NumSharesUnits, SalePricePerShareUnit, TotSaleValue, CostAcqWithoutIndx, AcquisitionCost, LTCGBeforelower6and11, FairMktValuePerShareunit, TotFairMktValueCapAst, ExpExclCnctTransfer, TotalDeductions, Balance`.
- **One figure each** — the 8 block-level totals: `SaleValue115AD, CostAcqWithoutIndx115AD, AcquisitionCost115AD, LTCGBeforelowerB1B2115AD, FairMktValueCapAst115AD, ExpExclCnctTransfer115AD, Deductions115AD, Balance115AD`.

---

## Mandatory (schema `required`)

Row-level (`Schedule115ADDtls[]` items) required (`*`): `ShareOnOrBefore`, `ISINCode`, `ShareUnitName`, `TotSaleValue`, `CostAcqWithoutIndx`, `AcquisitionCost`, `ExpExclCnctTransfer`, `TotalDeductions`, `Balance`.
Optional row fields: `NumSharesUnits`, `SalePricePerShareUnit`, `LTCGBeforelower6and11`, `FairMktValuePerShareunit`, `TotFairMktValueCapAst`.

Block-level required (all 8 totals): `SaleValue115AD`, `CostAcqWithoutIndx115AD`, `AcquisitionCost115AD`, `LTCGBeforelowerB1B2115AD`, `FairMktValueCapAst115AD`, `ExpExclCnctTransfer115AD`, `Deductions115AD`, `Balance115AD`.

---

## Hidden rows — not built

Three hidden rows (marked `H` by the dump). Do **not** build these as fields — they are utility-internal helper totals:
- **r12H** `[D12] Total of column (14) where transfer was before 23rd July 2024` — `S12= IFERROR(SUMIFS(Balance_115AD,ShareTrans_115AD_1,"Before 23rd July 2024"),0)`.
- **r13H** `[D13] Total of column (14) where transfer was on or after 23rd July 2024` — `S13= IFERROR(SUMIFS(Balance_115AD,ShareTrans_115AD_1,"On or after 23rd July 2024"),0)`.
- **r14H** `[D14] Total of LTCG u/s 112A rws 115AD(1)(b)(iii)` — `S14= SUM(Total_Balance_115ADBE,Total_Balance_115ADAE)`.

Also hidden/helper: column **V** (`V6:V9` ISIN VLOOKUP against `ISINListTable`) — not a schema field, do not build.

---

## What this means for the build

- Build one array grid `Schedule115ADDtls[]` (14 visible input/computed columns) + a Total footer that writes the 8 scalar total keys.
- **Only Col 8 (`AcquisitionCost`, M), Col 10 (`FairMktValuePerShareunit`, O), Col 12 (`ExpExclCnctTransfer`, Q), Col 4 (`NumSharesUnits`, I), Col 5 (`SalePricePerShareUnit`, J)** plus the two dropdowns and the two text fields (ISIN, name) are user inputs. Cols 6, 7, 9, 11, 13, 14 are **computed** (do not accept manual entry) using the formulas above; the totals are SUMs.
- The **transfer-date column (Col 1b, F)** is an on-screen input the utility needs (to split LTCG before / on-or-after 23-Jul-2024 for the Schedule CG B7 rate split via hidden r12/r13), **but it has no key in `Schedule112A115ADType`** — it is not exported in this schedule's JSON. Capture it in the UI for the CG split, but do not emit a per-row transfer-date field for Schedule115AD.
- Enforce the `AE` constraint (n:464): when `ShareOnOrBefore = AE` (After 31-Jan-2018), zero out / block Col 4, Col 5 and Col 11 (no grandfathering); for `AE`, ISIN may be `INNOTREQUIRD` and name `CONSOLIDATED`.
- Wire `Balance115AD` (S11) → Schedule CG Sl. No. B7 (rule n:378). Gate the whole schedule on Part A-General "FII / FPI? = Yes" (rule n:25).
- The row type is **shared with Schedule 112A** (`Schedule112A115ADType`) — reuse the same row component/validator for both schedules.
