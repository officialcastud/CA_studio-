# The book of Schedule 115AD(1)(b)(iii) proviso — ITR-6, A.Y. 2026-27

Read row by row from the utility's **115AD(1)(b)(iii) proviso** sheet (a.k.a.
"Tool-115AD(1)(b)(iii) proviso", rows 3–15; 4 live rows, 3 hidden) and confirmed
against the CBDT ITR-6 schema block **Schedule115AD**. This is the
**scrip-by-scrip** working, for a **Foreign Institutional Investor / FPI
(non-resident)**, of long-term capital gain on equity shares / units of an
equity-oriented fund / units of a business trust **on which STT has been paid**,
under the proviso to section 115AD(1)(b)(iii) read with section 112A. Its
column-14 totals feed **Schedule CG head B7**.

It is the FII twin of Schedule 112A — identical columns, different feed target
(B7 instead of B4) and the section-8(b) references instead of 5(b). Appendix 3
reproduces every live row verbatim; Appendix 2 lists every schema leaf.

---

## 1 · Purpose and shape

One flat table, one row per scrip/lot, unlimited rows (addable). Row 3 title:
"For NON-RESIDENTS - From sale of equity share in a company or unit of equity
oriented fund or unit of a business trust on which STT is paid u/s 112A r.w.s
115AD(1)(b)(iii) proviso". Row 4 is the 18-column header (Col 1 … Col 14 in row
5). Row 12 is "Total of each column". Rows 13–15 are **hidden** aggregates
(before / on-or-after 23rd July 2024 splits and the total LTCG u/s 112A r.w.s
115AD(1)(b)(iii) proviso).

Detail array `Schedule115ADDtls[]`; column totals are the `*115AD` scalar keys.

---

## 2 · The columns, row 4

| Col | Header label | Type | Schema key |
|---|---|---|---|
| 1 | Sl. No. | serial | — |
| 1a | WHETHER SHARE ACQUIRED (ON OR BEFORE / AFTER 31ST JANUARY 2018) | dropdown (2) | ShareOnOrBefore |
| 1b | Share / Unit transferred (Before / on or after 23rd July 2024) | flag | (drives the 23-July split, rows 13–14) |
| 2 | ISIN Code | text | ISINCode |
| 3 | Name of the Share/Unit | text | ShareUnitName |
| 4 | No. of Shares/Units | number | NumSharesUnits |
| 5 | Sale-price per Share/Unit | number | SalePricePerShareUnit |
| 6 | Full Value Consideration — if shares acquired on or before 31.01.2018, Total Sale Value (4×5), else actual | integer | TotSaleValue |
| 7 | Cost of acquisition without indexation (higher of 8 or 9) | integer | CostAcqWithoutIndx |
| 8 | Cost of acquisition | number | AcquisitionCost |
| 9 | If the long term capital asset was acquired before 01.02.2018, lower of col 11 & col 6 | integer | LTCGBeforelower6and11 |
| 10 | Fair Market Value per share/unit as on 31st January, 2018 | number | FairMktValuePerShareunit |
| 11 | Total Fair Market Value as on 31st January, 2018 of capital asset as per section 55(2)(ac) — (4×10) | integer | TotFairMktValueCapAst |
| 12 | Full value of Consideration — item 8(b)(i)(B)(2) of LTCG Schedule of ITR6 | integer | (feeds LTCG; grand-total FairMktValueCapAst115AD) |
| 13 | Cost of improvement without indexation — item 8(b)(ii) of LTCG Schedule of ITR6 | integer | (feeds LTCG) |
| 12 (S) | Expenditure wholly and exclusively in connection with transfer | number | ExpExclCnctTransfer |
| 13 (T) | Total deductions (7 + 12) | integer | TotalDeductions |
| 14 (U) | Balance (6 − 13) — Item 8 of LTCG Schedule CG | integer | Balance |

**Section 55(2)(ac) grandfathering** applies exactly as in Schedule 112A: column
7 = higher of actual cost (col 8) and, for pre-01.02.2018 assets, the lower of
the 31-Jan-2018 FMV (col 11) and the consideration (col 6) — column 9.

### Column totals (row 12) — scalar keys

`SaleValue115AD` (Σ col 6) · `CostAcqWithoutIndx115AD` (Σ col 7) ·
`AcquisitionCost115AD` (Σ col 8) · `LTCGBeforelowerB1B2115AD` (Σ col 9) ·
`FairMktValueCapAst115AD` (Σ col 11) · `ExpExclCnctTransfer115AD` (Σ) ·
`Deductions115AD` (Σ col 13) · `Balance115AD` (Σ col 14).

Hidden aggregate rows (not built): 13 "(i) Total of column (14) where transfer
was before 23rd July 2024"; 14 "(ii) Total of column (14) where transfer was on
or after 23rd July 2024"; 15 "(iii) Total of LTCG u/s 112A rws
115AD(1)(b)(iii) proviso".

---

## 3 · Dropdown

Column 1a (E6:E10) — **WHETHER SHARE ACQUIRED**: `(i) On or Before 31st January
2018` · `(ii) After 31st January 2018`.

Column F (Share/Unit transferred before / on or after 23rd July 2024) is a
before/after flag (no enum resolved) driving the hidden 23-July split totals.

---

## 4 · Cross-sheet feeds

**Out:** `Balance115AD` (Σ column 14) → **Schedule CG head B7** ("Long-term
Capital Gains on sale of capital assets at B7 above (column 14 of Schedule
115AD(1)(b)(iii) proviso)"); the before / on-or-after 23-July split (hidden rows
13–14) → B7 i / ii. This head is **hidden for residents** — it exists only where
the filer is an FII/FPI. **In:** per-scrip data entered directly; no other
schedule feeds it.

---

## Appendix 1 · Dropdown values (verbatim)
```
"(i) On or Before 31st January 2018,(ii) After 31st January  => (i) On or Before 31st January 2018 | (ii) After 31st January 2018
```

---

## Appendix 2 · Every schema leaf of block Schedule115AD (full paths)
\`*\` = required.
```
  Schedule115ADDtls[] array
* Schedule115ADDtls[].ShareOnOrBefore string
* Schedule115ADDtls[].ISINCode string
* Schedule115ADDtls[].ShareUnitName string
  Schedule115ADDtls[].NumSharesUnits number
  Schedule115ADDtls[].SalePricePerShareUnit number
* Schedule115ADDtls[].TotSaleValue integer
* Schedule115ADDtls[].CostAcqWithoutIndx integer
* Schedule115ADDtls[].AcquisitionCost number
  Schedule115ADDtls[].LTCGBeforelower6and11 integer
  Schedule115ADDtls[].FairMktValuePerShareunit number
  Schedule115ADDtls[].TotFairMktValueCapAst integer
* Schedule115ADDtls[].ExpExclCnctTransfer number
* Schedule115ADDtls[].TotalDeductions integer
* Schedule115ADDtls[].Balance integer
* SaleValue115AD integer
* CostAcqWithoutIndx115AD integer
* AcquisitionCost115AD integer
* LTCGBeforelowerB1B2115AD integer
* FairMktValueCapAst115AD integer
* ExpExclCnctTransfer115AD integer
* Deductions115AD integer
* Balance115AD integer
```

---

## Appendix 3 · Every live row of the sheet, verbatim
```
[C3] Tool-115AD(1)(b)(iii) proviso  |  [F3] For NON-RESIDENTS - From sale of equity share in a company or unit of equity oriented fund or unit o
[D4] Sl. No.  |  [E4] WHETHER SHARE ACQUIRED (ON OR BEFORE /AFTER 31ST JANUARY 2018)  |  [F4] Share / Unit transferred (Before/ on or after 23rd July 2024)  |  [G4] ISIN Code  |  [H4] Name of the Share/Unit  |  [I4] No. of Shares/Units  |  [J4] Sale-price per Share/Unit  |  [K4] Full Value Consideration If shares are acquired on or before 31.01.2018- Total Sale Value (4*5) or I  |  [L4] Cost of acquisition without indexation (higher of 8 or 9)  |  [M4] Cost of acquisition  |  [N4] If the long term capital asset was acquired before 01.02.2018, lower of 11 & 6  |  [O4] Fair Market Value per share/unit as on 31st January,2018  |  [P4] Total Fair Market Value as on 31st January,2018 of capital asset as per section 55(2)(ac)- (4*10)  |  [Q4] Full value of Consideration - item 8(b)(i)(B)(2) of LTCG Schedule of ITR6  |  [R4] Cost of improvement without indexation - item 8(b)(ii) of LTCG Schedule of ITR6  |  [S4] Expenditure wholly and exclusively in connection with transfer  |  [T4] Total deductions (7+12)  |  [U4] Balance (6-13) -Item 8 of LTCG Schedule CG
[D5] (Col 1)  |  [E5] (Col 1a)  |  [F5] (Col 1b)  |  [G5] (Col 2)  |  [H5] (Col 3)  |  [I5] (Col 4)  |  [J5] (Col 5)  |  [K5] (Col 6)  |  [L5] (Col 7)  |  [M5] (Col 8)  |  [N5] (Col 9)  |  [O5] (Col 10)  |  [P5] (Col 11)  |  [Q5] (Col 12)  |  [R5] (Col 13)  |  [S5] (Col 12)  |  [T5] (Col 13)  |  [U5] (Col 14)
[D12] Total of each column
```
