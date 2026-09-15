# The book of Schedule 115AD(1)(iii) proviso — ITR-3, A.Y. 2026-27

Read row by row from the ITR-3 utility's **Schedule 115AD(1)(iii) proviso** sheet
and confirmed against the CBDT ITR-3 schema block `Schedule115AD` and the ITR-3
`rules.json`. Nothing here is invented; every heading, column and field is the
department's own. (The ITR-2 book of the same sheet was consulted for style only —
no figure, column number or rule was carried across.)

---

## 1 · The shape

This is a **single scrip-by-scrip table** for **non-residents (FIIs/FPIs)** —
"*For NON-RESIDENTS — From sale of equity share in a company or unit of equity
oriented fund or unit of a business trust on which STT is paid*" — that feeds the
long-term capital gain computed under the **proviso to section 115AD(1)(iii)**
into item **B7a** of Schedule CG (LTCG u/s 112A route for an FII). Each row is one
holding; the utility computes the balance gain per row and the totals across all
rows. The whole sheet is locked unless the FPI flag (`Sheet1.115H`) is "Y" (VBA
`UnLock115AD` / `Lock115AD`), i.e. it applies only to a non-resident FII/FPI.
It is mutually exclusive with Schedule 112A (a row filled in one bars the other —
`rules.json`).

---

## 2 · The items

Each data row (rows 6–9 shipped, addable) maps one-to-one to an element of the
schema array `Schedule115ADDtls[]`. The sheet's column numbers are shown in
`(Col N)` in row 5; the header text is row 4.

| Sheet col | Field label (row 4) | Type | Schema key | Rule / notes |
|---|---|---|---|---|
| Col 1 | Sl. No. | serial | — | display only; `D7 = D6+1` auto-increments |
| Col 1a | Share/Unit acquired (On or before / after 31st Jan 2018) | dropdown | `Schedule115ADDtls[].ShareOnOrBefore` | enum BE / AE; drives the FMV columns |
| Col 1b | Share/Unit Transferred (Before / on or after 23rd July 2024) | label | — (no schema key) | visible column; only used to split the hidden totals rows 12/13 |
| Col 2 | ISIN Code | string | `Schedule115ADDtls[].ISINCode` | `IN[0-9A-Z]{10}` if On/before 31 Jan 2018; `INNOTREQUIRD` if After; `INNOTAVAILAB` if security has no ISIN |
| Col 3 | Name of the Share/Unit | string | `Schedule115ADDtls[].ShareUnitName` | `[w]*` if On/before; `CONSOLIDATED` if After; maxLength 125 |
| Col 4 | No. of Shares/Units | number | `Schedule115ADDtls[].NumSharesUnits` | min 0; must be 0 when "After 31st January 2018" is chosen |
| Col 5 | Sale-price per Share/Unit | number | `Schedule115ADDtls[].SalePricePerShareUnit` | min 0; must be 0 when "After 31st January 2018" |
| Col 6 | Full Value of Consideration (Total Sale value, if acquired on or before 31 Jan 2018) | integer | `Schedule115ADDtls[].TotSaleValue` | computed = Col 4 × Col 5 |
| Col 7 | Cost of acquisition without indexation (higher of 8 or 9) | integer | `Schedule115ADDtls[].CostAcqWithoutIndx` | computed = higher of Col 8 and Col 9 |
| Col 8 | Cost of acquisition | number | `Schedule115ADDtls[].AcquisitionCost` | entered; min 0 |
| Col 9 | If the long term capital asset was acquired before 01.02.2018, Lower of 6 & 11 | integer | `Schedule115ADDtls[].LTCGBeforelower6and11` | computed = lower of Col 6 and Col 11 |
| Col 10 | Fair Market Value per share/unit as on 31st January, 2018 | number | `Schedule115ADDtls[].FairMktValuePerShareunit` | entered; must be 0 when "After 31st January 2018" |
| Col 11 | Total Fair Market Value as on 31st January, 2018 of capital asset as per section 55(2)(ac) (4×10) | integer | `Schedule115ADDtls[].TotFairMktValueCapAst` | computed = Col 4 × Col 10; must be 0 when "After 31st January 2018" |
| Col 12 | Full value of Consideration — item 8(b)(i)(B)(2) of LTCG Schedule of ITR3 | number | — (unmapped display column; no named range, no formula) | vestigial column, not summed |
| Col 13 | Cost of improvement without indexation — item 8(b)(ii) of LTCG Schedule of ITR3 | number | — (unmapped display column; no named range, no formula) | vestigial column, not summed |
| Col 12 | Expenditure wholly and exclusively in connection with transfer | number | `Schedule115ADDtls[].ExpExclCnctTransfer` | entered; min 0 (row 5 re-labels this as Col 12) |
| Col 13 | Total deductions (7+12) | integer | `Schedule115ADDtls[].TotalDeductions` | computed = Col 7 + Expenditure |
| Col 14 | Balance (6-13) — Item 8(a) of LTCG Schedule of ITR3 | integer | `Schedule115ADDtls[].Balance` | computed = Col 6 − Total deductions; can be negative |

### Row 11 — Total (one figure each, mapped to the single-value schema keys)

| Sheet cell | What it totals | Schema key |
|---|---|---|
| K11 | Total of Col 6 (Total Sale value) | `SaleValue115AD` |
| L11 | Total of Col 7 (Cost of acquisition without indexation) | `CostAcqWithoutIndx115AD` |
| M11 | Total of Col 8 (Cost of acquisition) | `AcquisitionCost115AD` |
| N11 | Total of Col 9 (LTCG asset acquired before 01.02.2018) | `LTCGBeforelowerB1B2115AD` |
| P11 | Total of Col 11 (Total Fair Market Value) | `FairMktValueCapAst115AD` |
| S11 | Total of Col 12 (Expenditure wholly and exclusively) | `ExpExclCnctTransfer115AD` |
| T11 | Total of Col 13 (Total deductions) | `Deductions115AD` |
| U11 | Total of Col 14 (Balance) | `Balance115AD` |

---

## 3 · The rules the sheet computes

- `[K6] = ROUND(MAX(0, ROUND(I6,4)*ROUND(J6,4)),0)` — **Col 6 Total Sale Value = Col 4 × Col 5** (rules.json: "Col. 6 Total Sale Value should be equal to Col. 4*Col. 5").
- `[L6] = ROUND(MAX(0, ROUND(M6,4), ROUND(N6,0)),0)` — **Col 7 = higher of Col 8 and Col 9** (rules.json: "Col. 7 Cost of acquisition without indexation should be higher of Col. 8 and Col. 9").
- `[N6] = ROUND(MAX(0, MIN(ROUND(P6,0), ROUND(K6,0))),0)` — **Col 9 = lower of Col 6 and Col 11** (rules.json: "Col. 9 ... should be lower of Col. 6 and Col. 11").
- `[P6] = ROUND(MAX(0, ROUND(I6,4)*ROUND(O6,4)),0)` — **Col 11 = Col 4 × Col 10** (rules.json: "Col. 11 Total Fair Market Value ... should be equal to Col. 4*Col. 10").
- `[T6] = ROUND(MAX(0, SUM(ROUND(L6,0), ROUND(S6,4))),0)` — **Col 13 Total deductions = Col 7 + Col 12 (Expenditure)** (rules.json: "Col. 13 Total deductions should be equal to sum of Col. (7+12)").
- `[U6] = ROUND(ROUND(K6,0) - ROUND(T6,0),0)` — **Col 14 Balance = Col 6 − Col 13** (rules.json: "Col. 14 Balance should be equal to the output of Col. 6-Col. 13").
- `[D7] = D6+1` — Sl. No. auto-increments down the table.
- `[K11] = SUM(TotalSaleValue_115AD)`, `[L11] = SUM(COAwithoutIndex_115AD)`, `[M11] = SUM(COAwithIndex_115AD)`, `[N11] = SUM(LTCGAssetAcquired_115AD)`, `[P11] = SUM(TotalFairMarketValue_115AD)`, `[S11] = SUM(ExpenditureWholly_115AD)`, `[T11] = SUM(TotalDeductions_115AD)`, `[U11] = SUM(Balance_115AD)` — each Total is the sum of the column's per-row entries (rules.json: "Total of Col 6, 7, 8, 9, 11, 12, 13 and 14 should be equal to the sum of individual amounts entered in respective column").
- Cross-sheet: **B7a LTCG u/s 112A of Schedule CG = total of Col. 14 of this schedule** (rules.json).
- Enum guard: when Col 1a = "After 31st January 2018", **Col 4, 5, 10 & 11 cannot be greater than zero** (rules.json).
- Mutual exclusion: a filled row here bars Schedule 112A, and vice versa (rules.json).

---

## 4 · Dropdowns

- **Col 1a — Share/Unit acquired (E6:E9):**
  - `(Select)`
  - `On or before 31st January 2018`
  - ` After 31st January 2018`
- **Col 2 — ISIN Code (G6:G9):** cell dropdown backed by a source list (values not enumerated in the sheet; free ISIN entry per the schema pattern `IN[0-9A-Z]{10}` / `INNOTREQUIRD` / `INNOTAVAILAB`).
- **Col 3 — Name of the Share/Unit (H6:H9):** cell dropdown backed by a source list (free text per schema; `CONSOLIDATED` for After-31-Jan-2018 rows).
- All numeric cells (I, J, K, L, M, N, O, P, Q, R, S, T, U) carry only numeric bounds, not value lists.

---

## 5 · What repeats and what is one figure

- **Repeats:** the scrip table — schema array `Schedule115ADDtls[]`, one element per row (rows 6–9 shipped, unlimited addable). Each element carries the 14 per-row keys above.
- **One figure each:** the eight row-11 totals — `SaleValue115AD`, `CostAcqWithoutIndx115AD`, `AcquisitionCost115AD`, `LTCGBeforelowerB1B2115AD`, `FairMktValueCapAst115AD`, `ExpExclCnctTransfer115AD`, `Deductions115AD`, `Balance115AD`.

---

## 6 · Mandatory (schema `required`)

Block-level required single figures: `SaleValue115AD`, `CostAcqWithoutIndx115AD`,
`AcquisitionCost115AD`, `LTCGBeforelowerB1B2115AD`, `FairMktValueCapAst115AD`,
`ExpExclCnctTransfer115AD`, `Deductions115AD`, `Balance115AD`.

Required within each array element `Schedule115ADDtls[]`: `ShareOnOrBefore`,
`ISINCode`, `ShareUnitName`, `TotSaleValue`, `CostAcqWithoutIndx`,
`AcquisitionCost`, `LTCGBeforelower6and11`, `FairMktValuePerShareunit`,
`TotFairMktValueCapAst`, `ExpExclCnctTransfer`, `TotalDeductions`, `Balance`.
(`NumSharesUnits` and `SalePricePerShareUnit` are optional.)

---

## 7 · Hidden rows — not built

These rows are printed with `H` in the dump and are **not** entered by the user;
they are internal split-totals the utility keeps for the before/after-23-July-2024
apportionment. They must never be shown as items.

- **Row 12 (H)** — "(i) Total of column (14) where transfer was before 23rd July 2024 (for each column)".
- **Row 13 (H)** — "(ii) Total of column (14) where transfer was on or after 23rd July 2024 (for each column)".
- **Row 14 (H)** — "(iii) Total of (i + ii)".

---

## 8 · What this means for the build

1. Build one addable scrip table (array `Schedule115ADDtls[]`), columns exactly in
   the order Col 1a, 1b, 2–14 above, with Cols 6, 7, 9, 11, 13, 14 shown green and
   untypeable (computed by the formulas in §3).
2. Gate the whole schedule behind the FPI/FII flag and non-resident status
   (`Sheet1.115H` / VBA `UnLock115AD`/`Lock115AD`); do not offer it to a resident
   non-FII.
3. Enforce the Col 1a enum guard: selecting "After 31st January 2018" must force
   Cols 4, 5, 10 and 11 to zero (and drive the ISIN/name special values).
4. Compute the eight row-11 totals as column sums into the single-value keys; feed
   `Balance115AD` (total of Col 14) to Schedule CG item **B7a**.
5. Enforce mutual exclusivity with Schedule 112A.
6. Cols 12 and 13 as first labelled ("Full value of Consideration — item 8(b)(i)(B)(2)"
   and "Cost of improvement without indexation — item 8(b)(ii)") are vestigial display
   columns with no schema key, no named range and no formula — do not persist or total
   them. The operative Col 12 is the Expenditure column (`ExpExclCnctTransfer`).
7. Do not render the hidden before/after-23-July split rows (12–14); keep them as
   internal apportionment only.
