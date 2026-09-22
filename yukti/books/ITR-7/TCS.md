# The book of Schedule TCS — Tax collected at source · ITR-7, A.Y. 2026-27

Read row by row from the utility's **TCS** sheet (18 rows), with the dropdowns
and the column-header conditions, and confirmed against the schema's
`ScheduleTCS` block. One sheet → one schema block; no sheet-name/schema offset
here (the TCS sheet label matches the schema block, unlike the **TDS** sheet
whose two tables are offset one place from their blocks — see
`books/ITR-7/TDS.md`).

The sheet is a single repeatable table of TCS credits, item **18C1**, *Details
of Tax Collected at Source (TCS) [As per form 27D issued by collectors]* (E4).
One row per collector. Its total of column 7(i) feeds Part B-TTI **9c**. The
sheet's own NOTE (E18): *"Please enter total of column 7(i) of Schedule-TCS in
9c of Part B-TTI."*

---

## 1 · The shape — one table feeding Part B-TTI 9c

| Table | Item | What it is | Feeds |
|---|---|---|---|
| **Schedule TCS** | 18C1 | Tax Collected at Source, as per Form 27D | Part B-TTI **9c** — total of column 7(i) "Claimed in own hands" (rule A634) |

The table is repeatable and unlimited (entry rows 8–13, then grown); its total
(`P15`) is schema-required even at zero (`TotalSchTCS`). The credit-owner codes
are **Self / Other Person** (schema **S/O**); "other person" is under **rule
37i(1)**. Each row enforces **collected = claimed + carried forward** (rule
**A661**: col 8 = col 5 + col 6 − col 7).

---

## 2 · Schedule TCS — Tax Collected at Source, Form 27D (schema `ScheduleTCS`)

*Details of Tax Collected at Source (TCS) [As per form 27D issued by
collectors]* (E4). Item **18C1**. Column headers at rows 5–7. One row per
collector.

| Sheet col | Sheet cell | Field (label) | Options / rule | Schema key (`TCSDetails[]`) |
|---|---|---|---|---|
| 1 | E5/E6 | Sl. No (Col 1) | serial | — |
| 2(i) | F5/F6 | **TCS credit relating to self/ other person [other person as per rule 37i(1)]** (Col 2(i)) | dropdown **Self / Other Person** | `EmployerOrDeductorOrCollectDetl.TCSCreditName` (S/O) |
| 2(ii) | G5/G6 | **Tax Deduction and Tax Collection Account Number of the Collector** (Col 2(ii)) | required | `EmployerOrDeductorOrCollectDetl.TAN` |
| 3 | H5/H6 | **PAN Of Other Person (If TCS Credit related to other person)** (Col 3) | when col 2(i) = Other Person | `EmployerOrDeductorOrCollectDetl.PANofOtherPerson` |
| 4 | I6 | **Financial Year in which TCS is collected** (Col 4) | dropdown 2024 … 2008 (b/f credit) | `EmployerOrDeductorOrCollectDetl.TDSFinYr` |
| 5 | I5 / J6 | **Unclaimed TCS brought forward (b/f)** — Amount b/f (Col 5) | b/f credit not claimed earlier | `BroughtFwdTCSAmt` |
| 6(i) | K5 / K6 | **TCS of the current financial Year (tax collected during the FY 2025-26)** — Collected in own hands (Col 6(i)) | | `TCSCurrFYDtls.TCSAmtCollOwnHands` |
| 6(ii) | L6 | Collected in the hands of any other person as per rule 37i(1) (if applicable) (Col 6(ii)) | | `TCSCurrFYDtls.TCSAmtCollOthrHands` |
| 7(i) | M5 / M6 | **TCS credit being claimed this year** — Claimed in own hands (Col 7(i)) | → Part B-TTI 9c | `TCSClaimedThisYearDtls.TCSAmtCollOwnHands` |
| 7(ii) | N6 | Claimed in hands of any other person as per rule 37i(1) (if applicable) (Col 7(ii)) — **TCS** (N7) / **PAN** (O7) | two sub-columns | `TCSClaimedThisYearDtls.TCSAmtCollOthrHands.TaxClaimedTCS`, `TCSClaimedThisYearDtls.TCSAmtCollOthrHands.PANOfOthrPrsn` |
| 8 | P5 / P6 | **TCS credit being carried forward** (Col 8) | required | `AmtCarriedFwd` |
| — | P15 | **Total** | computed | `TotalSchTCS` |

`ScheduleTCS` `required: [TotalSchTCS]`. Per row, the collector's `tan`
(`EmployerOrDeductorOrCollectDetl` is a required object),
`TCSCurrFYDtls.tcsamtcollownhands`,
`TCSClaimedThisYearDtls.tcsamtcollownhands` (a required object) and
`amtcarriedfwd` are required.

NOTE (E18): *"Please enter total of column 7(i) of Schedule-TCS in 9c of Part
B-TTI."*

---

## 3 · The row arithmetic (from the rules document)

- **A655** — TCS total of col 7(i) "Claimed in own hands" = Σ individual rows.
- **A656** — unclaimed b/f (col 5) and current-FY TCS (col 6) cannot be entered
  in the same row.
- **A657** — TCS claimed in own hands + in the hands of any other person cannot
  exceed TCS brought forward + TCS collected in own hands + TCS collected in the
  hands of any other person.
- **A658** — if credit relates to "other person", the PAN of the other person is
  mandatory (also where TCS is claimed in the hands of another person).
- **A659** — the column-2(i) TCS credit dropdown must be selected.
- **A660** — the collector's Tax Deduction and Tax Collection Account Number
  (TAN) must be provided.
- **A661** — col 8 "TCS credit being carried forward" = col 5 + col 6 − col 7.
- **B28** — TCS credited in the hands of another person is allowed to that person
  only if they declare it in Schedule TCS of their own ITR.

---

## 4 · Dropdowns (verbatim — every value on the sheet)

Every value below is checked by Gate 3 against this book.

### 4.1 · TCS credit relating to (F8:F13)

```
(Select)
Self
Other Person
```

### 4.2 · Financial year in which TCS is collected (I8:I13)

```
(Select)
2024
2023
2022
2021
2020
2019
2018
2017
2016
2015
2014
2013
2012
2011
2010
2009
2008
```

The other cells on the sheet (M8:M13, J8:K13, N8:N13) carry only numeric
data-validations, not value lists.

---

## 5 · What is mandatory

| Level | Required |
|---|---|
| Each TCS row | `TAN`, `TCSCurrFYDtls.TCSAmtCollOwnHands`, `TCSClaimedThisYearDtls.TCSAmtCollOwnHands`, `AmtCarriedFwd` |
| The table | `TotalSchTCS` (present even at zero) |

Plus: PAN of the other person whenever credit relates to "Other Person".

---

## 6 · What repeats

The TCS table (`TCSDetails[]`), unlimited. Nothing else.

---

## 7 · Cross-sheet feeds

| Out of Schedule TCS | Into |
|---|---|
| Σ column 7(i) "Claimed in own hands" | Part B-TTI **9c** "TCS" (rule A634) |

Part B-TTI **9e** = 9a + 9b + 9c + 9d (rule A628); 9a/9d are the advance and
self-assessment totals from `books/ITR-7/IT.md`, 9b the TDS total from
`books/ITR-7/TDS.md`.

---

## 8 · What this means for the build

1. **One table** — credit self/other with the other person's PAN, the
   collector's TAN, the financial year, the b/f amount, collected-own/other,
   claimed-own/other (TCS + PAN of other person), carried forward.
2. **Credit-owner is S/O** — the schema stores `S`/`O`; the claimed-in-other-
   hands is a nested object (`TaxClaimedTCS` + `PANOfOthrPrsn`).
3. **Row arithmetic checked live** — collected = claimed + carried (A661); the
   other-person columns open only on "Other Person"; the claim is capped at b/f
   + collected (A657).
4. **Feed 9c** of Part B-TTI (ITR-7 numbering), the total present even at zero.
5. **Export** — every row to `TCSDetails[]`; the total present even at zero.

---

## Appendix A · Every schema leaf of `ScheduleTCS` (verbatim; * = required)

```
  TCSDetails[]                                                             array
  TCSDetails[].EmployerOrDeductorOrCollectDetl.TCSCreditName             string
* TCSDetails[].EmployerOrDeductorOrCollectDetl.TAN                       string
  TCSDetails[].EmployerOrDeductorOrCollectDetl.PANofOtherPerson          string
  TCSDetails[].EmployerOrDeductorOrCollectDetl.TDSFinYr                  integer
  TCSDetails[].BroughtFwdTCSAmt                                          integer
* TCSDetails[].TCSCurrFYDtls.TCSAmtCollOwnHands                          integer
  TCSDetails[].TCSCurrFYDtls.TCSAmtCollOthrHands                         integer
* TCSDetails[].TCSClaimedThisYearDtls.TCSAmtCollOwnHands                 integer
  TCSDetails[].TCSClaimedThisYearDtls.TCSAmtCollOthrHands.TaxClaimedTCS  integer
  TCSDetails[].TCSClaimedThisYearDtls.TCSAmtCollOthrHands.PANOfOthrPrsn  string
* TCSDetails[].AmtCarriedFwd                                            integer
* TotalSchTCS                                                           integer
```

## Appendix B · Every live-row label on the TCS sheet (verbatim from `tools/dump.py`)

```
r   3 : [D3] TCS
r   4 : [D4] 18C1  |  [E4] Details of Tax Collected at Source (TCS) [As per form 27D issued by collectors]
r   5 : [E5] Sl. No.  |  [F5] TCS credit relating to self/ other person [other person as per rule 37i(1)]  |  [G5] Tax Deduction and Tax Collection Account Number of the Collector  |  [H5] PAN Of Other Person (If TCS Credit related to other person)  |  [I5] Unclaimed TCS brought forward (b/f)  |  [K5] TCS of the current financial Year (tax collected during the FY 2025-26)  |  [M5] TCS credit being claimed this year  |  [P5] TCS credit being carried forward
r   6 : [E6] (Col 1)  |  [F6] (Col 2(i))  |  [G6] (Col 2(ii))  |  [H6] (Col 3)  |  [I6] Financial Year in which TCS is collected (Col 4)  |  [J6] Amount b/f (Col 5)  |  [K6] Collected in own hands (Col 6(i))  |  [L6] Collected in the hands of any other person as per rule 37i(1) (if applicable) (Col 6(ii))  |  [M6] Claimed in own hands (Col 7(i)])  |  [N6] Claimed in hands of any other person as per rule 37i(1) (if applicable) (Col 7(ii)])  |  [P6] (Col 8)
r   7 : [N7] TCS  |  [O7] PAN
r  15 : [E15] Total
r  18 : [E18] Note: Please enter total of column 7(i) of Schedule-TCS in 9c of Part B-TTI
```
