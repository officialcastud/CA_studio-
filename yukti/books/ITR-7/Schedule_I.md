# The book of Schedule I — accumulation / set-apart u/s 11(2) · ITR-7, A.Y. 2026-27

Read row by row from the utility's **Schedule I** sheet (rows 3–23; the year rows
2010-11 … 2019-20 are hidden, 2020-21 … 2025-26 live, plus the TOTAL row) and
confirmed against the CBDT ITR-7 schema block **ITRScheduleI**. This is the
year-by-year ledger of **income accumulated or set apart within the meaning of
section 11(2)** (or, for a s.10(23C) fund, in terms of the third proviso to
section 10(23C) / 10(21) read with section 35(1)). It tracks each earlier year's
accumulation from the amount set apart, through what has been applied and taxed,
to the balance still available, the modes it is invested in, and finally the part
that becomes **deemed income under section 11(3)**. Nothing here is invented:
Appendix 1 lists every schema leaf, Appendix 2 reproduces every live row verbatim.

This is one of the trust's application & accumulation core schedules. Its sibling
ledgers are **Schedule IA** (accumulated income already taxed in earlier years
u/s 11(3)), **Schedule D** (deemed application under Explanation 1 to 11(1)) and
**Schedule DA** (deemed application taxed earlier u/s 11(1B)); **Schedule A**
records the amount actually applied to the stated objects this year.

---

## 1 · Purpose and shape

One table, **one row per financial year of accumulation**. Row 3 is the title —
`C3` **Schedule I**, `F3` *"Details of amounts accumulated / set apart within the
meaning of section 11(2) or in terms of third proviso to section 10(23C) )/10(21)
read with section 35(1)."* Row 4 is the fifteen-column header, row 5 the column
numbers (1)…(15). Rows 6–21 are the year rows (2010-11 … 2025-26); rows 6–15 are
hidden (accumulations older than the six-year window carried on-screen), rows
16–21 (2020-21 … 2025-26) are live. Row 23 is the **TOTAL** row.

Detail array: `ScheduleI[]` — one object per year. The column totals across the
years are the scalar `Tot…` keys.

---

## 2 · The columns (row 4) → type → schema key

Column numbers are the sheet's own (row 5). The fifteen data columns map one-to-one
onto the array leaf keys, in order:

| Col | Cell | Header label (verbatim, abridged) | Type | Schema key |
|---|---|---|---|---|
| — | D | Sl No. | serial | — |
| (1) | E | Year of accumulation (F.Yr.) | integer (F.Yr.) | AccumlatedYear |
| (2) | F | Amount accumulated in the year of accumulation | integer | AmountAccumlated |
| (3) | G | Purpose of accumulation | string | AccumulationPurpose |
| (4) | H | Amount applied for charitable/ religious/Scientific research/ social science or statistical research purposes up to the beginning of the previous year | integer | AmountAppliedPreviousYear |
| (5) | J | Balance (5)=(2-4) | integer | BalanceAfterPY |
| (6) | K | Amount taxed in any earlier Assessment Year(s) | integer | AmtTxdErlAssYr |
| (7) | L | Balance available for application (7)= (5-6) | integer | BalAvailApp |
| (8) | M | Amounts applied for charitable or religious/Scientific research/ social science or statistical research purpose during the previous year out of previous years' accumulation | integer | AmountAppliedDuringYear |
| (9) | N | Amount applied for purposes other than the purpose for which such accumulation was made (if applicable) | integer | AmountAppliedDuringYearOtherPurpose |
| (10) | O | Amount credited or paid to any trust or institution registered u/s 12AB or approved under sub-clauses (iv)/(v)/(vi)/(via) of clause (23C) of section 10 (if applicable) | integer | AmountCreditedTrust |
| (11) | P | Balance amount available for application (11) = (7) – (8) – (9) – (10) | integer | BalanceAmount |
| (12) | Q | Amount invested or deposited in the modes specified in section 11(5) out of 11 | integer | AmountInvested |
| (13) | R | Amount invested or deposited in the modes other than specified in section 11(5) out of 11 (if applicable) | integer | AmountInvestedInOtherMode |
| (14) | S | Amount which is not utilized during the period of accumulation (if applicable) | integer | AmountNotUtilized |
| (15) | T | Amount deemed to be income within meaning of sub-section (3) of section 11 (if applicable) (15) = (9+10+13+14) | integer | AmountDeemedUs11 |

The TOTAL row (row 23) carries the column sums, each a scalar `Tot…` key
(Appendix 1).

---

## 3 · The law and the computation

**Section 11(2)** lets a trust set apart (accumulate) income it did not apply in
the year of receipt, for a stated purpose, for up to five years, provided the
amount is invested in the **modes specified in section 11(5)** and Form 10 is
filed. Schedule I is the running account of every such accumulation still open.

The arithmetic built into the columns:
- **Balance (5) = (2) − (4)** — amount accumulated less what was applied up to the
  beginning of the previous year.
- **Balance available for application (7) = (5) − (6)** — that balance less the
  part already **taxed in an earlier assessment year** (column 6).
- **Balance amount available for application (11) = (7) − (8) − (9) − (10)** — the
  balance less this year's application to the accumulation purpose (8), less
  application to **other than the stated purpose** (9), less amounts **credited or
  paid to another 12AB/10(23C) trust** (10).
- **Amount deemed to be income u/s 11(3), (15) = (9) + (10) + (13) + (14)** — the
  sting of section 11(3): accumulation applied to a purpose other than the one
  stated (9), or credited/paid to another trust (10), or invested in modes
  **other than** those in section 11(5) (13), or **not utilised during the period
  of accumulation** (14), is **deemed to be the income** of the previous year in
  which the default occurs. This column 15 total is the amount that leaves
  Schedule I as taxable income.

Columns 12 and 13 split the balance by mode: **(12)** invested in the specified
section 11(5) modes (compliant), **(13)** invested in other modes (a default that
feeds column 15). Column 14 is the un-utilised balance at the end of the
accumulation period (also a default feeding column 15).

---

## 4 · Cross-sheet feeds

**In:** each year row is typed by the filer (the year, the amount accumulated, the
purpose) or carried forward from the prior year's Schedule I; column 6 (amount
taxed in an earlier assessment year) is the running tally that **Schedule IA**
details assessment-year by assessment-year.

**Out:** column 15 (`AmountDeemedUs11`, TOTAL `TotAmountDeemedUs11`) is the income
**deemed under section 11(3)** and flows into the income computation (Part B-TI)
as income of the trust for the year. The amount taxed here becomes, next year, a
column-6 entry and a **Schedule IA** row.

---

## 5 · Dropdowns / enums

There are **no value-list dropdowns** on Schedule I. Every data-validation entry
resolves to a numeric / free-text constraint (`source "0"` integer cells; the
purpose column G uses `source "200"`, a text-length limit, not an enum;
`values: null` throughout). So there are no enum values to seed.

---

## Appendix 1 · Every schema leaf of block ITRScheduleI (full paths)
`*` = required.
```
* ScheduleI[] array
* ScheduleI[].AccumlatedYear integer
* ScheduleI[].AmountAccumlated integer
* ScheduleI[].AccumulationPurpose string
* ScheduleI[].AmountAppliedPreviousYear integer
* ScheduleI[].BalanceAfterPY integer
* ScheduleI[].AmtTxdErlAssYr integer
* ScheduleI[].BalAvailApp integer
* ScheduleI[].AmountAppliedDuringYear integer
* ScheduleI[].AmountAppliedDuringYearOtherPurpose integer
* ScheduleI[].AmountCreditedTrust integer
* ScheduleI[].BalanceAmount integer
* ScheduleI[].AmountInvested integer
* ScheduleI[].AmountInvestedInOtherMode integer
* ScheduleI[].AmountNotUtilized integer
* ScheduleI[].AmountDeemedUs11 integer
* TotAmountAccumlated integer
* TotAmountAppliedPreviousYear integer
* TotBalanceAfterPY integer
* TotAmtTxdErlAssYr integer
* TotBalAvailApp integer
* TotAmountAppliedDuringYear integer
* TotAmountAppliedDuringYearOtherPurpose integer
* TotAmountCreditedTrust integer
* TotBalanceAmount integer
* TotAmountInvested integer
* TotAmountInvestedInOtherMode integer
* TotAmountNotUtilized integer
* TotAmountDeemedUs11 integer
```

---

## Appendix 2 · Every live row of the sheet, verbatim
(Rows 6–15, the years 2010-11 … 2019-20, are hidden; shown for completeness of the
year axis.)
```
[C3] Schedule I  |  [F3] Details of amounts accumulated / set apart within the meaning of section 11(2) or in terms of third proviso to section 10(23C) )/10(21) read with section 35(1).
[D4] Sl No.  |  [E4] Year of accumulation (F.Yr.)  |  [F4] Amount accumulated in the year of accumulation  |  [G4] Purpose of accumulation  |  [H4] Amount applied for charitable/ religious/Scientific research/ social science or statistical research purposes up to the beginning of the previous year  |  [J4] Balance (5)=(2-4)  |  [K4] Amount taxed in any earlier Assessment Year(s)  |  [L4] Balance available for application (7)= (5-6)  |  [M4] Amounts applied for charitable or religious/Scientific research/ social science or statistical research purpose during the previous year out of previous years’ accumulation  |  [N4] Amount applied for purposes other than the purpose for which such accumulation was made (if applicable)  |  [O4] Amount credited or paid to any trust or institution registered u/s 12AB or approved under sub-clauses (iv)/(v)/(vi)/(via) of clause (23C) of section 10 (if applicable  |  [P4] Balance amount available for application (11) = (7) – (8) – (9) – (10)  |  [Q4] Amount invested or deposited in the modes specified in section 11(5) out of 11  |  [R4] Amount invested or deposited in the modes other than specified in section 11(5) out of 11 (if applicable)  |  [S4] Amount which is not utilized during the period of accumulation (if applicable)  |  [T4] Amount deemed to be income within meaning of sub-section (3) of section 11 (if applicable) (15) = (9+10+13+14)
[E5] (1)  |  [F5] (2)  |  [G5] (3)  |  [H5] (4)  |  [I5] (5)  |  [J5] (5)  |  [K5] (6)  |  [L5] (7)  |  [M5] (8)  |  [N5] (9)  |  [O5] (10)  |  [P5] (11)  |  [Q5] (12)  |  [R5] (13)  |  [S5] (14)  |  [T5] (15)
[E6] 2010-11   (hidden)
[E7] 2011-12   (hidden)
[E8] 2012-13   (hidden)
[E9] 2013-14   (hidden)
[E10] 2014-15  (hidden)
[E11] 2015-16  (hidden)
[E12] 2016-17  (hidden)
[E13] 2017-18  (hidden)
[E14] 2018-19  (hidden)
[E15] 2019-20  (hidden)
[E16] 2020-21
[E17] 2021-22
[E18] 2022-23
[E19] 2023-24
[E20] 2024-25
[E21] 2025-26
[D23] TOTAL
```
