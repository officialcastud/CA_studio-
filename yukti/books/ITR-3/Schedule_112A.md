# The book of Schedule 112A — ITR-3, A.Y. 2026-27

Read row by row from the utility's **Schedule 112A** sheet and confirmed against the
CBDT ITR-3 schema block `Schedule112A` and the ITR-3 `rules.json`. Nothing here is
invented; every heading, column and field is the department's own. The ITR-2
Schedule CG book was read as a **style model only** — no figure, item number or rule
was carried across.

---

## The shape

Schedule 112A is the **scrip-by-scrip working sheet** for long-term capital gains
under section 112A — *"From sale of equity share in a company or unit of equity
oriented fund or unit of a business trust on which STT is paid under section 112A"*
(the sheet's title text, [E3]). One row per security. It is a single flat table:
each row carries the acquisition question, the ISIN, the name, quantities, prices and
the department's cost-of-acquisition / fair-market-value working, ending in a Balance
(column 14) whose grand total feeds **item B4a of the LTCG Schedule of ITR-3**. The
column totals in the Total row are the only single figures; everything else repeats
per scrip.

---

## The items

One schema block: `Schedule112A`. The per-scrip detail is the array
`Schedule112ADtls[]`; the Total row maps to the eight block-level total keys.

### Per-scrip row — `Schedule112ADtls[]` (utility rows 6–9, addable; header rows 4 & 5)

| Sheet col | Field label (header text) | Type | Schema key | Rule / notes |
|---|---|---|---|---|
| Col 1 [D4] | Sl. No. | index | — (auto) | `[D7]=D6+1` — running serial, not a schema leaf |
| Col 1a [E4] | Share/Unit acquired (On or before / after 31st Jan 2018) | dropdown | `Schedule112ADtls[].ShareOnOrBefore` | enum BE, AE; drives the lock of cols 4,5,10,11 |
| Col 1b [F4] | Share/Unit Transferred (Before / on or after 23rd July 2024) | dropdown | *(no schema leaf)* | splits Balance into the hidden before/after totals (rows 12–13) |
| Col 2 [G4] | ISIN Code | string | `Schedule112ADtls[].ISINCode` | `IN[0-9A-Z]{10}` if On or Before 31 Jan 2018; `INNOTREQUIRD` if After; `INNOTAVAILAB` if security unavailable |
| Col 3 [H4] | Name of the Share/Unit | string | `Schedule112ADtls[].ShareUnitName` | `[w]*` if On or Before; `CONSOLIDATED` if After; maxLength 125 |
| Col 4 [I4] | No. of Shares/Units | number | `Schedule112ADtls[].NumSharesUnits` | min 0, max 1e14 |
| Col 5 [J4] | Sale-price per Share/Unit | number | `Schedule112ADtls[].SalePricePerShareUnit` | min 0, max 1e14 |
| Col 6 [K4] | Full Value of Consideration (Total Sale value) | integer | `Schedule112ADtls[].TotSaleValue` | `[K6]=ROUND(MAX(0,ROUND(I6,4)*ROUND(J6,4)),0)` = Col4 × Col5 |
| Col 7 [L4] | Cost of acquisition without indexation (higher of 8 or 9) | integer | `Schedule112ADtls[].CostAcqWithoutIndx` | `[L6]=ROUND(MAX(0,ROUND(M6,4),ROUND(N6,0)),0)` = higher of Col8 & Col9 |
| Col 8 [M4] | Cost of acquisition | number | `Schedule112ADtls[].AcquisitionCost` | min 0, max 1e14 |
| Col 9 [N4] | If the long term capital asset was acquired before 01.02.2018, Lower of 6 & 11 | integer | `Schedule112ADtls[].LTCGBeforelower6and11` | `[N6]=ROUND(MAX(0,MIN(ROUND(P6,0),ROUND(K6,0))),0)` = lower of Col6 & Col11 |
| Col 10 [O4] | Fair Market Value per share/unit as on 31st January, 2018 | number | `Schedule112ADtls[].FairMktValuePerShareunit` | min 0, max 1e14 |
| Col 11 [P4] | Total Fair Market Value as on 31st January, 2018 of capital asset as per section 55(2)(ac) - (4*10) | integer | `Schedule112ADtls[].TotFairMktValueCapAst` | `[P6]=ROUND(MAX(0,ROUND(I6,4)*ROUND(O6,4)),0)` = Col4 × Col10 |
| Col 12 [Q4] | Full value of Consideration - item 4 (b)(i)(B)(2) of LTCG Schedule of ITR3 | integer | *(no schema leaf — cross-reference)* | reference into LTCG Schedule |
| Col 13 [R4] | Cost of improvement without indexation - item 5 (b)(ii) of LTCG Schedule of ITR3 | integer | *(no schema leaf — cross-reference)* | reference into LTCG Schedule |
| Col 12 [S4] | Expenditure wholly and exclusively in connection with transfer | number | `Schedule112ADtls[].ExpExclCnctTransfer` | min 0, max 1e14 (utility re-labels this Col 12) |
| Col 13 [T4] | Total deductions (7+12) | integer | `Schedule112ADtls[].TotalDeductions` | `[T6]=ROUND(MAX(0,SUM(ROUND(L6,0),ROUND(S6,4))),0)` = Col7 + Col12 |
| Col 14 [U4] | Balance (6–13) - Item 4(a) of LTCG Schedule of ITR3 | integer | `Schedule112ADtls[].Balance` | `[U6]=ROUND(ROUND(K6,0)-ROUND(T6,0),0)` = Col6 − Col13; min −99999999999999 |

The utility's Col 5 sub-labels [D5]–[U5] read: (Col 1), (Col 1a), (Col 1b), (Col 2),
(Col 3), (Col 4), (Col 5), (Col 6), (Col 7), (Col 8), (Col 9), (Col 10), (Col 11),
(Col 12), (Col 13), (Col 12), (Col 13), (Col 14) — the duplicated "Col 12" and
"Col 13" are the utility's own numbering quirk, kept verbatim above.

### Total row — utility row 11 `[D11] Total` (single figures)

| Sheet cell | Column totalled | Schema key | Rule |
|---|---|---|---|
| [K11] | Col 6 Total Sale Value | `SaleValue112A` | `SUM(TotalSaleValue_112A)` |
| [L11] | Col 7 Cost of acquisition without indexation | `CostAcqWithoutIndx112A` | `SUM(COAwithoutIndex_112A)` |
| [M11] | Col 8 Cost of acquisition | `AcquisitionCost112A` | `SUM(COAwithIndex_112A)` |
| [N11] | Col 9 LTCG asset acquired before 01.02.2018 | `LTCGBeforelowerB1B2112A` | `SUM(LTCGAssetAcquired_112A)` |
| [P11] | Col 11 Total Fair Market Value | `FairMktValueCapAst112A` | `SUM(TotalFairMarketValue_112A)` |
| [S11] | Col 12 Expenditure wholly and exclusively | `ExpExclCnctTransfer112A` | `SUM(ExpenditureWholly_112A)` |
| [T11] | Col 13 Total deductions | `Deductions112A` | `SUM(TotalDeductions_112A)` |
| [U11] | Col 14 Balance | `Balance112A` | `SUM(Balance_112A)` |

---

## The rules the sheet computes

- **[K6] Full Value of Consideration** = `ROUND(MAX(0,ROUND(I6,4)*ROUND(J6,4)),0)` — Col 6 = Col 4 × Col 5 (rules.json: *"Col. 6 Total Sale Value should be equal to Col. 4*Col. 5"*).
- **[L6] Cost of acquisition without indexation** = `ROUND(MAX(0,ROUND(M6,4),ROUND(N6,0)),0)` — Col 7 = higher of Col 8 and Col 9 (rules.json: *"Col. 7 ... should be higher of Col. 8 and Col. 9"*).
- **[N6] LTCG asset acquired before 01.02.2018** = `ROUND(MAX(0,MIN(ROUND(P6,0),ROUND(K6,0))),0)` — Col 9 = lower of Col 6 and Col 11 (rules.json: *"Col. 9 ... should be lower of Col. 6 and Col. 11"*).
- **[P6] Total Fair Market Value** = `ROUND(MAX(0,ROUND(I6,4)*ROUND(O6,4)),0)` — Col 11 = Col 4 × Col 10 (rules.json: *"Col. 11 ... should be equal to Col. 4*Col. 10"*).
- **[T6] Total deductions** = `ROUND(MAX(0,SUM(ROUND(L6,0),ROUND(S6,4))),0)` — Col 13 = Col 7 + Col 12 (rules.json: *"Col. 13 Total deductions should be equal to sum of Col. (7+12)"*).
- **[U6] Balance** = `ROUND(ROUND(K6,0)-ROUND(T6,0),0)` — Col 14 = Col 6 − Col 13 (rules.json: *"Col. 14 Balance should be equal to the output of Col. 6-Col. 13"*).
- **Totals [K11]/[L11]/[M11]/[N11]/[P11]/[S11]/[T11]/[U11]** each `SUM(...)` the named column range (rules.json: *"Total of Col 6, 7, 8, 9, 11, 12, 13 and 14 should be equal to the sum of individual amounts entered in respective column"*).
- **Lock rule (VBA `LockUnlock112A9`, `LockUnlock112A11`; rules.json line 2460):** when Col 1a is *"After 31st January 2018"*, values at Col 4, 5, 10 & 11 cannot be greater than zero — the utility locks those cells (ISIN forced to `INNOTREQUIRD`, name to `CONSOLIDATED`).
- **Cross-sheet / mutual-exclusion (rules.json):** Col 14 total feeds *"Sl.No. B4a LTCG u/s 112A ... equal to total of Col. 14 of Schedule 112A"*; *"If any one row is filled in Schedule 112A, then Schedule 115AD(1)(b)(iii) proviso is not allowed"* and the reverse.

---

## Dropdowns

- **[E6] Col 1a — Share/Unit acquired (row 6):** `(Select)`, `On or before 31st January 2018`, `After 31st January 2018`.
- **[E7:E9] Col 1a — Share/Unit acquired (rows 7–9):** ` (Select)`, `On or before 31st January 2018`, `After 31st January 2018`.

(No other cell carries a value list — the remaining validation entries are numeric
range guards, e.g. min 0 or min `-99999999999999`, not pick-lists. Col 1b
"Share/Unit Transferred (Before/ on or after 23rd July 2024)" carries no explicit
value list in the dump.)

---

## What repeats and what is one figure

- **Repeats (array `Schedule112ADtls[]`):** every scrip row — Sl. No., Col 1a, Col 1b,
  ISIN, name, and Cols 2–14. Utility ships rows 6–9 (`[D7]=D6+1` extends the serial);
  the array is unlimited scrip by scrip.
- **One figure (block-level totals):** the eight Total-row keys `SaleValue112A`,
  `CostAcqWithoutIndx112A`, `AcquisitionCost112A`, `LTCGBeforelowerB1B2112A`,
  `FairMktValueCapAst112A`, `ExpExclCnctTransfer112A`, `Deductions112A`,
  `Balance112A`.

---

## Mandatory

Schema `required` at block level: `SaleValue112A`, `CostAcqWithoutIndx112A`,
`AcquisitionCost112A`, `LTCGBeforelowerB1B2112A`, `FairMktValueCapAst112A`,
`ExpExclCnctTransfer112A`, `Deductions112A`, `Balance112A`.

Required within each `Schedule112ADtls[]` entry: `ShareOnOrBefore`, `ISINCode`,
`ShareUnitName`, `TotSaleValue`, `CostAcqWithoutIndx`, `AcquisitionCost`,
`LTCGBeforelower6and11`, `FairMktValuePerShareunit`, `TotFairMktValueCapAst`,
`ExpExclCnctTransfer`, `TotalDeductions`, `Balance`. (`NumSharesUnits` and
`SalePricePerShareUnit` are present but not required.)

---

## Hidden rows — not built

Rows the dump flags with `H` after the row number. These are utility working
sub-totals; they carry **no schema leaf** and are **never rendered as items**:

- **Row 12 [D12]** — *"(i) Total of column (14) where transfer was before 23rd July 2024 (for each column)"* — HIDDEN.
- **Row 13 [D13]** — *"(ii) Total of column (14) where transfer was on or after 23rd July 2024 (for each column)"* — HIDDEN.
- **Row 14 [D14]** — *"(iii) Total of (i + ii)"* — HIDDEN.

These are the before/after 23-July-2024 split of the Col 14 total that the utility
computes internally (from Col 1b) to feed the LTCG Schedule's B4a(i)/(ii) split; the
visible Total (row 11) is the figure the taxpayer sees. Row 17 [I17] holds only a
stray backtick and is not a labelled item.

---

## What this means for the build

1. Build one repeatable table `Schedule112ADtls[]`, one row per scrip, with an add-row
   control; ship a few empty rows and a dustbin per row.
2. **Computed (green, untypeable):** Col 6 (=4×5), Col 7 (higher of 8 & 9), Col 9
   (lower of 6 & 11), Col 11 (=4×10), Col 13 (=7+12), Col 14 (=6−13), and every Total
   cell. User-entered: Col 1a, Col 1b, ISIN, name, Col 4, Col 5, Col 8, Col 10, Col 12
   (expenditure). Cols 12 [Q]/13 [R] are LTCG-schedule cross-references.
3. **Enforce the lock:** when Col 1a = "After 31st January 2018", zero and lock Col 4, 5,
   10, 11 and set ISIN=`INNOTREQUIRD`, name=`CONSOLIDATED`; validate ISIN pattern
   `IN[0-9A-Z]{10}` otherwise.
4. Compute the hidden before/after split (rows 12–14) internally from Col 1b to feed the
   LTCG Schedule B4a(i)/(ii); do not show it as an item.
5. The visible Total (row 11) → eight block totals; the Balance total (`Balance112A`)
   must equal item B4a / Col 14 total on the LTCG Schedule, and Schedule 112A is mutually
   exclusive with Schedule 115AD(1)(b)(iii) proviso.
