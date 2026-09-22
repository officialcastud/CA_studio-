# The book of Schedule D — deemed application u/s Expln.1 to 11(1) · ITR-7, A.Y. 2026-27

Read row by row from the utility's **Schedule D** sheet (rows 3–12; rows 6–10 are
the entry rows, row 11 the fixed 2025-26 row, row 12 the TOTAL) and confirmed
against the CBDT ITR-7 schema block **ITRScheduleD**. This is the year-by-year
ledger of **deemed application of income under clause (2) of Explanation 1 to
sub-section (1) of section 11** — income a trust could not apply in the year of
receipt because it had not been received, or for another reason, and which it
elected to treat as applied in that year and to actually apply in the following
year. Nothing here is invented: Appendix 1 lists every schema leaf, Appendix 2
reproduces every live row verbatim, Appendix 3 every dropdown value.

This is one of the trust's application & accumulation core schedules. Its sibling
**Schedule DA** records the part of that deemed application which **could not** be
applied in time and was **taxed earlier under section 11(1B)**; **Schedule I** /
**Schedule IA** handle the parallel section 11(2) accumulation track.

---

## 1 · Purpose and shape

One table, **one row per financial year in which income was deemed to be
applied**. Row 3 is the title — `C3` **Schedule D**, `F3` *"Details of deemed
application of income under clause (2) of Explanation 1 to sub-section (1) of
section 11."* Row 4 is the header (columns numbered (1)…(9) in row 5). Rows 6–10
are the entry rows (each with a year dropdown and a reason dropdown); row 11 is
the fixed **2025-26** row (Sl. No. ii); row 12 is the **TOTAL**.

Detail array: `ScheduleD[]` — one object per year. The column totals are the
scalar `Tot…` keys.

---

## 2 · The columns (row 4) → type → schema key

| Col | Cell | Header label (verbatim, abridged) | Type | Schema key |
|---|---|---|---|---|
| — | D | Sl No. | serial | — |
| (1) | E | Year in which income is deemed to be applied (F.Yr.) | dropdown | AppliedYear |
| (2) | F | Amount deemed to be applied during the previous year of deeming | integer | AmountAppliedPY |
| (3) | G | Reason of deeming application | dropdown | DeemedApplicationReason |
| — | H | Please Enter Reason for Any Other Reason Selected in Reason of deeming application | string | ReasonDesc |
| (4) | I | Out of the deemed application claimed, amount required to be applied | integer | OutOfDeemedAmtReqApp |
| (5) | J | Amount taxed in any earlier Assessment Year(s) | integer | AmtTxdErlAssYr |
| (6) | K | Out of the deemed application claimed, amount required to be applied during the financial year pertaining to current Assessment year | integer | AmountToBeApplied |
| (7) | L | Amount of deemed application claimed in earlier years, applied during the financial year pertaining to current AY | integer | AmountAppliedCurrAY |
| (8)=(6-7) | M | Amount which could not be applied and deemed to be income u/s 11(1B) during the previous year | integer | AmountNotAppliedCurrAY |
| (9)=(4-6) | N | Balance Amount of deemed Income being exemption claimed in earlier years on account of deemed application and required to be applied in FY 2026-27 onwards | integer | BalanceAmount |

`ReasonDesc` (column H) is the free-text explanation, required (in effect) only
when the reason chosen in column G is **"Any other reason"** (see §4). The TOTAL
row (row 12) carries the column sums, each a scalar `Tot…` key (Appendix 1).

---

## 3 · The law and the computation

**Explanation 1 to section 11(1), clause (2)** lets a trust treat income as
*applied* to its objects in the year of receipt even though it was not, in two
situations: **(a)** the income **had not been received** during that year, or
**(b)** for **any other reason** — provided the trust exercises the option (Form
9A) and then *actually* applies the income in the year of receipt (situation a) or
in the year immediately following (situation b).

If the income so deemed to be applied is **not in fact applied** for the purpose
in the following year, **section 11(1B)** deems it to be the income of the
previous year immediately following. Schedule D is the ledger that tracks each
open deemed-application claim to its resolution:

- Column (4) `OutOfDeemedAmtReqApp` — of the amount deemed applied, the part still
  required to be applied.
- Column (6) `AmountToBeApplied` — the part required to be applied **in the
  current AY's financial year**.
- Column (7) `AmountAppliedCurrAY` — what was **actually** applied this year out of
  earlier-year deemed-application claims.
- Column **(8) = (6) − (7)** `AmountNotAppliedCurrAY` — the shortfall, which is
  **deemed to be income under section 11(1B)** for the previous year. This is what
  leaves Schedule D as taxable income (and next year appears in **Schedule DA**).
- Column **(9) = (4) − (6)** `BalanceAmount` — the balance of the deemed-income
  exemption claimed in earlier years still required to be applied **in FY 2026-27
  onwards** (carried to next year's Schedule D).

---

## 4 · Dropdowns / enums

Three value-list validations:

- **Column (1), Year deemed applied** — cells `E6:E9`: `(Select)` · **Prior to FY
  2020-21** · 2020-21 · 2021-22 · 2022-23 · 2023-24 · 2024-25. (Row 11 is the fixed
  2025-26 row.)
- **Column (1), row 11** — cell `E11`: `(Select)` · **Income has not been received
  during that year** · **Any other reason**. (This is the row-11 variant of the
  year/reason validation.)
- **Column (3), Reason of deeming application** — cells `G6:G9` (named range
  `SchD_AnyOther_not`): `(Select)` · **Income has not been received during that
  year**. When the reason is **"Any other reason"** the free-text column H
  (`ReasonDesc`, `H7:H9`/`H11`, a length-limited text cell) must be filled.

---

## 5 · Cross-sheet feeds

**In:** each row is typed / carried forward by the filer — the year deemed
applied, the amount, the reason, and the running application figures.

**Out:** column (8) (`AmountNotAppliedCurrAY`, TOTAL `TotAmountNotAppliedCurrAY`)
is the income **deemed under section 11(1B)** and flows into the income
computation (Part B-TI). The amount taxed here becomes, next year, a **Schedule
DA** row (deemed application taxed in earlier assessment years). Column (9)
(`BalanceAmount`) carries the still-open claim to next year's Schedule D.

---

## Appendix 1 · Every schema leaf of block ITRScheduleD (full paths)
`*` = required.
```
* ScheduleD[] array
* ScheduleD[].AppliedYear string
* ScheduleD[].AmountAppliedPY integer
* ScheduleD[].DeemedApplicationReason string
  ScheduleD[].ReasonDesc string
* ScheduleD[].OutOfDeemedAmtReqApp integer
* ScheduleD[].AmtTxdErlAssYr integer
* ScheduleD[].AmountToBeApplied integer
* ScheduleD[].AmountAppliedCurrAY integer
* ScheduleD[].AmountNotAppliedCurrAY integer
* ScheduleD[].BalanceAmount integer
* TotOutOfDeemedAmtReqApp integer
* TotAmtTxdErlAssYr integer
* TotAmountAppliedPY integer
* TotAmountToBeApplied integer
* TotAmountAppliedCurrAY integer
* TotAmountNotAppliedCurrAY integer
* TotBalanceAmount integer
```

---

## Appendix 2 · Every live row of the sheet, verbatim
```
[C3] Schedule D  |  [F3] Details of deemed application of income under clause (2) of Explanation 1 to sub-section (1) of section 11.
[D4] Sl No.  |  [E4] Year in which income is deemed to be applied (F.Yr.)  |  [F4] Amount deemed to be applied during the previous year of deeming  |  [G4] Reason of deeming application  |  [H4] Please Enter Reason for Any Other Reason Selected in Reason of deeming application  |  [I4] Out of the deemed application claimed, amount required to be applied  |  [J4] Amount taxed in any earlier Assessment Year(s)  |  [K4] Out of the deemed application claimed, amount required to be applied during the financial year pertaining to current Assessment year  |  [L4] Amount of deemed application claimed in earlier years, applied during the financial year pertaining to current AY  |  [M4] Amount which could not be applied and deemed to be income u/s 11(1B) during the previous year  |  [N4] Balance Amount of deemed Income being exemption claimed in earlier years on account of deemed application and required to be applied in FY 2026-27 onwards
[E5] (1)  |  [F5] (2)  |  [G5] (3)  |  [I5] (4)  |  [J5] (5)  |  [K5] (6)  |  [L5] (7)  |  [M5] (8) = (6-7)  |  [N5] (9) = (4-6)
[D11] ii  |  [E11] 2025-26
[D12] TOTAL
```

---

## Appendix 3 · Dropdown values (verbatim)
```
Column (1) Year deemed applied — E6:E9:
  (Select) | Prior to FY 2020-21 | 2020-21 | 2021-22 | 2022-23 | 2023-24 | 2024-25
Column (1) row 11 — E11:
  (Select) | Income has not been received during that year | Any other reason
Column (3) Reason of deeming application — G6:G9 (named range SchD_AnyOther_not):
  (Select) | Income has not been received during that year
```
