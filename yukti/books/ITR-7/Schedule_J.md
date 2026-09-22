# The book of Schedule J — ITR-7, A.Y. 2026-27

Read row by row from the utility's **Schedule J** sheet (rows 3–54) and confirmed
against the CBDT ITR-7 schema block **`ITRScheduleJ`**. Schedule J is the
*"Statement showing the funds and investments as on the last day of the previous
year"* — filed by every assessee claiming exemption **u/s 11 and 12** or
**u/s 10(23C)(iv)/(v)/(vi)/(via)**. It is the trust's / institution's fund-and-
investment register on 31.03.2026: the movement of the corpus, of loans and
borrowings, the parking of corpus in the section 11(5) modes, investments in
13(3)-related concerns, other investments, and voluntary contributions received
in kind. Nothing here is invented; Appendix 2 lists every schema leaf, Appendix 3
reproduces every live row verbatim, Appendix 4 every dropdown value.

The sheet's own heading (F3): *"Statement showing the funds and investments as on
the last day of the previous year [to be filled by assesses claiming exemption
u/s 11 and 12 or u/s 10(23C)(iv)/10(23C)(v)/ 10(23C)(vi)/10(23C)(via)]."*

---

## 1 · Purpose and shape

Schedule J is six blocks stacked on one sheet, each an addable detail table with
its own TOTAL row:

| Block | Row | What it records | Schema node |
|---|---|---|---|
| **A i / A ii** | 4–5 (hidden) | Balance in the **corpus** fund and in the **non-corpus** fund on the last day of the year | (memo lines, hidden) |
| **A1** | 6–11 | **Details of corpus** — opening, received, applied, deposited-back, closing, and where the closing corpus is invested | `ScheduleJ_A1` |
| **A2** | 12–18 | **Details of loan and borrowings** — opening, taken, applied, repaid, closing | `ScheduleJ_A2` |
| **B** | 19–28 | **Details of corpus investment/deposits made under section 11(5)** as on 31.03.2026 | `ScheduleJUs11_5` |
| **C** | 29–37 | **Investment held in concern(s)** in which section 13(3) / 21st-proviso-10(23C) persons have a substantial interest | `ScheduleJUs13_3` |
| **D** | 38–45 | **Other investments** as on the last day of the previous year | `ScheduleJOtherInvstmts` |
| **E** | 46–54 | **Voluntary contributions/donations received in kind** not converted into 11(5) modes in time | `ScheduleJVoluntaryContribution` |

Every block's entry rows are a repeatable detail array (`…Dtls[]`); every TOTAL
row is a scalar sum key. All money columns are integers (rupees). Rows 4 and 5
are hidden memo lines and carry no schema key.

---

## 2 · Block A1 — Details of corpus (rows 6–11)

Header row 7. Entry rows 8–9. TOTAL row 11. Array `ScheduleJ_A1.ScheduleJ_A1Dtls[]`.

| Col | Header label (row 7) | Type | Schema key |
|---|---|---|---|
| — | Sl No. | serial | — |
| — | **Corpus Donation** (type of corpus) | dropdown | `CorpusDonation` |
| 1 | Opening Balance as on 01.04.2025 (corpus not applied till 31.03.2025) | integer | `OpeningBlc` |
| 2 | Received/Treated as corpus during the year | integer | `ReceivedCorpus` |
| 3 | Applied during the year | integer | `AppliedPY` |
| 4 | Amount invested or deposited back in to corpus (which was earlier applied and not claimed as application) (where application from corpus is made on or after 01.04.2021) | integer | `AmtDepositedBack` |
| 5 | Total amount invested or deposited back in to corpus | integer | `TotAmtDepositedBack` |
| 6 | Financial year in which (4) was applied earlier | dropdown (year) | `FinacialYr` |
| 7 | Closing Balance as on 31.03.2026 **[(1+2+5)−3]** | integer | `ClosingBlc` |
| 8 | Invested in modes specified in Sec 11(5) as on 31.03.2026 | integer | `Investment_11_5` |
| 9 | Amount taxed in earlier Assessment Years | integer | `AmtTxdAssYr22_23` |
| 10 | Invested in modes other than specified in Sec 11(5) as on 31.03.2026 **= (7−8−9)** | integer | `Investment_11_5_Other` |

TOTAL row 11 sums each money column: `TotOpeningBlc`, `TotReceivedCorpus`,
`TotAppliedPY`, `TotAmtDepositedBack`, `TotTotAmtDepositedBack`, `TotClosingBlc`,
`TotInvestment_11_5`, `TotAmtTxdAssYr22_23`, `TotInvestment_11_5_Other`.

**Substance.** The corpus is the permanent fund of a section 11 trust. Corpus
donations are exempt only if invested/deposited in a section 11(5) mode; the
2021 amendments track corpus *applied* and later *re-deposited* (columns 4–5)
because application out of corpus is allowed as application only in the year the
corpus is put back. Column 7 restates the closing corpus as
`(opening + received + re-deposited) − applied`; columns 8–10 split that closing
corpus into the part in 11(5) modes, the part already taxed, and the residual
outside 11(5) modes.

---

## 3 · Block A2 — Details of loan and borrowings (rows 12–18)

Header row 13. Entry rows 14–16. TOTAL row 18. Array
`ScheduleJ_A2.ScheduleJ_A2Dtls[]`.

| Col | Header label (row 13) | Type | Schema key |
|---|---|---|---|
| — | Sl No. | serial | — |
| 1 | Opening Balance as on 01.04.2025 | integer | `OpeningBlc` |
| 2 | Loan & Borrowings taken for applications towards objectives during the year | integer | `LoanBorrow` |
| 3 | Applied for the objects of the trust or institution during the year | integer | `AppliedPY` |
| 4 | Amount of repayment of loan or borrowing during the year (which was earlier applied and not claimed as application) (where application from any loan or borrowing is made on or after 01.04.2021) | integer | `Repayment` |
| 5 | Financial year in which (4) was applied earlier | dropdown (year) | `FinacialYr` |
| 6 | Total Repayment of loan or borrowing during the year | integer | `TotRepOfLoan` |
| 7 | Closing Balance as on 31.03.2026 **(1+2−6=7)** | integer | `ClosingBlc` |

TOTAL row 18 sums: `TotOpeningBlc`, `TotLoanBorrow`, `TotAppliedPY`,
`TotRepayment`, `TotTotRepOfLoan`, `TotClosingBlc`.

**Substance.** Post-2021, application out of a loan or borrowing is not treated as
application when incurred; it is allowed only in the year the loan is repaid
(columns 4–6). Closing balance is `opening + taken − total repaid`.

---

## 4 · Block B — Corpus investment/deposits u/s 11(5) (rows 19–28)

Row 19 title: *"Details of corpus investment/deposits made under section 11(5) as
on 31.03.2026."* Header rows 21–22. Entry rows 23–26. TOTAL row 28. Array
`ScheduleJUs11_5.ScheduleJUs11_5Dtls[]`.

| Col | Header label | Type | Schema key |
|---|---|---|---|
| 1 | Sl No. | serial | — |
| 2 | Investment out of | dropdown (`ScheduleJ.Investmentvalue`) | `InvestementOutOff` |
| 3 | Mode of investment as per section 11(5) | dropdown (`ScheduleJ.ModeOfInvestmentValue`) | `ModeOfInvestment` |
| 4 | Amount of investment | integer | `AmtOfInvestment` |

TOTAL row 28 → `TotalInvestmentAmt`.

**Substance.** Section 11(5) is the closed list of permitted modes in which the
corpus (and accumulated income) must be held for exemption to survive. Column 2
identifies which corpus the investment is drawn from (donations for renovation
u/s 80G(2)(b), corpus received on/after 01.04.2021, or other corpus); column 3 is
the 11(5) mode from Government schemes through PSU deposits to POWERGRID InvIT.

---

## 5 · Block C — Investment in 13(3)-concern(s) (rows 29–37)

Row 29 title: *"Investment held at any time during the previous year (s) in
concern (s) in which persons referred to in section 13(3) and 21st Proviso of
Section 10(23C) have a substantial interest."* Header rows 31–32. Entry rows
33–35. TOTAL row 37. Array `ScheduleJUs13_3.ScheduleJUs13_3Dtls[]`.

| Col | Header label (row 31) | Type | Schema key |
|---|---|---|---|
| 1 | Sl No. | serial | — |
| 2 | Name and address of the concern | string | `NameAndAddress` |
| 3 | Whether the concern is a company | dropdown Yes/No | `ConcernIsCompany` |
| 4 | Number of shares held | integer | `NoOfSharesHeld` |
| 5 | Class of shares held | string | `ClassOfSharesHeld` |
| 6 | Total value of investment | integer | `NominalaValueOfInvestment` |
| 7 | Income from the investment | integer | `IncFromInvestment` |
| 8 | Whether the amount in col (6) exceeds 5 percent of the capital of the concern during the previous year | dropdown Yes/No | `PercentOfCapitalConcern` |

TOTAL row 37 → `TotalNoOfShares`, `TotalValueOfInvestment`,
`TotalIncFromInvestment`.

**Substance.** Section 13(1)(c)/(d) with 13(2)/13(3) bar a trust from investing
its funds in, or for the benefit of, interested persons; column 8's "exceeds 5
percent of the capital" flag is the 13(4) threshold that determines whether the
investment forfeits exemption.

---

## 6 · Block D — Other investments (rows 38–45)

Row 38 title: *"Other investments as on the last day of the previous year."*
Header rows 39–40. Entry rows 41–43. TOTAL row 45. Array
`ScheduleJOtherInvstmts.ScheduleJOtherInvstmtsDtls[]`.

| Col | Header label (row 39) | Type | Schema key |
|---|---|---|---|
| 1 | Sl No. | serial | — |
| 2 | Name and address of the concern | string | `NameAndAddress` |
| 3 | Whether the concern is a company | dropdown Yes/No | `ConcernIsCompany` |
| 4 | Class of shares held | string | `ClassOfSharesHeld` |
| 5 | Number of shares held | integer | `NoOfSharesHeld` |
| 6 | Total value of investment | integer | `NominalaValueOfInvestment` |

TOTAL row 45 → `TotalNoOfShares`, `TotalValueOfInvestment`.

**Substance.** All remaining investments of the trust that are not corpus-11(5)
(block B) and not 13(3)-concern (block C) — the residual investment holdings on
the last day of the year.

---

## 7 · Block E — Voluntary contributions received in kind (rows 46–54)

Row 46 title: *"Voluntary contributions/donations received in kind but not
converted into investments in the specified modes u/s 11(5) within the time
provided."* Header rows 48–49. Entry rows 50–52. TOTAL row 54. Array
`ScheduleJVoluntaryContribution.ScheduleJVoluntaryContributionDtls[]`.

| Col | Header label (row 48) | Type | Schema key |
|---|---|---|---|
| 1 | Sl No. | serial | — |
| 2 | Name and address of the donor | string | `NameAndAddress` |
| 3 | Value of contribution/donation | integer | `ValueOfContribution` |
| 4 | Value of contribution applied towards objective | integer | `ValueOfContributionObj` |
| 5 | Amount out of (3) invested in modes prescribed under section 11(5) | integer | `AmtInvestedUs11` |
| 6 | Balance to be treated as income under section 11(3) | integer | `BalIncUs11` |

TOTAL row 54 → `TotalValueOfContribution`, `TotalValOfContrbnAppdTwrdsObj`,
`TotalAmtInvestedUs11`, `TotalBalIncUs11`.

**Substance.** In-kind voluntary contributions that are neither applied to the
objects (col 4) nor invested in an 11(5) mode within the permitted time (col 5)
have their unabsorbed balance (col 6) deemed income under section 11(3).

---

## 8 · The dropdowns

Schedule J carries five enumerated (list) dropdowns; the rest are numeric
data-validations. Full value lists are in Appendix 4.

1. **Corpus Donation / Investment out of type** — the corpus-type list
   `i.Representing donations received for the renovation or repair of places
   notified u/s 80G(2)(b) on or after 01.04.2020 · ii.Other than (i) above
   received on or after 01.04.2021 · iii.Other than (i) and (ii) above` (and its
   block-B twin `ScheduleJ.Investmentvalue`).
2. **Mode of investment as per section 11(5)** (`ScheduleJ.ModeOfInvestmentValue`,
   G23:G26) — the fourteen permitted 11(5) modes.
3. **Whether the concern is a company** (blocks C and D) — `(Select) · Yes · No`.
4. **Whether col (6) exceeds 5 percent** (block C) — `(Select) · Yes · No`.
5. **Financial year in which (4) was applied earlier** (A1 and A2) — the year list
   `2021-22 … 2025-26`.

---

## 9 · Cross-sheet feeds

- **Out →** Schedule R reconciles the **corpus closing balances** of Schedule J
  (block A1, the three corpus types) against the corpus figures in the Balance
  Sheet; Schedule J's block-A1 closing corpus is line **A** of Schedule R.
- **Out →** the 11(5) / non-11(5) split of the closing corpus feeds the
  application-and-accumulation tests in Schedule IE / the exemption computation.
- **In ←** figures are entered on the sheet from the trust's books; no other
  schedule computes into Schedule J.

---

## Appendix 1 · Purpose line, verbatim

```
[F3] Statement showing the funds and investments as on the last day of the previous year [to be filled by assesses claiming exemption u/s 11 and 12 or u/s 10(23C)(iv)/10(23C)(v)/ 10(23C)(vi)/10(23C)(via)
```

---

## Appendix 2 · Every schema leaf of block `ITRScheduleJ` (full paths)
`*` = required.
```
  ScheduleJ_A1.ScheduleJ_A1Dtls[] array
* ScheduleJ_A1.ScheduleJ_A1Dtls[].CorpusDonation string
* ScheduleJ_A1.ScheduleJ_A1Dtls[].OpeningBlc integer
* ScheduleJ_A1.ScheduleJ_A1Dtls[].ReceivedCorpus integer
* ScheduleJ_A1.ScheduleJ_A1Dtls[].AppliedPY integer
* ScheduleJ_A1.ScheduleJ_A1Dtls[].AmtDepositedBack integer
* ScheduleJ_A1.ScheduleJ_A1Dtls[].TotAmtDepositedBack integer
  ScheduleJ_A1.ScheduleJ_A1Dtls[].FinacialYr string
* ScheduleJ_A1.ScheduleJ_A1Dtls[].ClosingBlc integer
* ScheduleJ_A1.ScheduleJ_A1Dtls[].Investment_11_5 integer
* ScheduleJ_A1.ScheduleJ_A1Dtls[].AmtTxdAssYr22_23 integer
* ScheduleJ_A1.ScheduleJ_A1Dtls[].Investment_11_5_Other integer
* ScheduleJ_A1.TotOpeningBlc integer
* ScheduleJ_A1.TotReceivedCorpus integer
* ScheduleJ_A1.TotAppliedPY integer
* ScheduleJ_A1.TotAmtDepositedBack integer
* ScheduleJ_A1.TotTotAmtDepositedBack integer
* ScheduleJ_A1.TotClosingBlc integer
* ScheduleJ_A1.TotAmtTxdAssYr22_23 integer
* ScheduleJ_A1.TotInvestment_11_5 integer
* ScheduleJ_A1.TotInvestment_11_5_Other integer
  ScheduleJ_A2.ScheduleJ_A2Dtls[] array
* ScheduleJ_A2.ScheduleJ_A2Dtls[].OpeningBlc integer
* ScheduleJ_A2.ScheduleJ_A2Dtls[].LoanBorrow integer
* ScheduleJ_A2.ScheduleJ_A2Dtls[].AppliedPY integer
* ScheduleJ_A2.ScheduleJ_A2Dtls[].Repayment integer
  ScheduleJ_A2.ScheduleJ_A2Dtls[].FinacialYr string
* ScheduleJ_A2.ScheduleJ_A2Dtls[].TotRepOfLoan integer
* ScheduleJ_A2.ScheduleJ_A2Dtls[].ClosingBlc integer
* ScheduleJ_A2.TotOpeningBlc integer
* ScheduleJ_A2.TotLoanBorrow integer
* ScheduleJ_A2.TotAppliedPY integer
* ScheduleJ_A2.TotRepayment integer
* ScheduleJ_A2.TotTotRepOfLoan integer
* ScheduleJ_A2.TotClosingBlc integer
  ScheduleJUs11_5.ScheduleJUs11_5Dtls[] array
  ScheduleJUs11_5.ScheduleJUs11_5Dtls[].InvestementOutOff string
* ScheduleJUs11_5.ScheduleJUs11_5Dtls[].ModeOfInvestment string
* ScheduleJUs11_5.ScheduleJUs11_5Dtls[].AmtOfInvestment integer
* ScheduleJUs11_5.TotalInvestmentAmt integer
  ScheduleJUs13_3.ScheduleJUs13_3Dtls[] array
  ScheduleJUs13_3.ScheduleJUs13_3Dtls[].NameAndAddress string
  ScheduleJUs13_3.ScheduleJUs13_3Dtls[].ConcernIsCompany string
  ScheduleJUs13_3.ScheduleJUs13_3Dtls[].NoOfSharesHeld integer
  ScheduleJUs13_3.ScheduleJUs13_3Dtls[].ClassOfSharesHeld string
  ScheduleJUs13_3.ScheduleJUs13_3Dtls[].NominalaValueOfInvestment integer
  ScheduleJUs13_3.ScheduleJUs13_3Dtls[].IncFromInvestment integer
  ScheduleJUs13_3.ScheduleJUs13_3Dtls[].PercentOfCapitalConcern string
* ScheduleJUs13_3.TotalNoOfShares integer
* ScheduleJUs13_3.TotalValueOfInvestment integer
* ScheduleJUs13_3.TotalIncFromInvestment integer
  ScheduleJOtherInvstmts.ScheduleJOtherInvstmtsDtls[] array
  ScheduleJOtherInvstmts.ScheduleJOtherInvstmtsDtls[].NameAndAddress string
  ScheduleJOtherInvstmts.ScheduleJOtherInvstmtsDtls[].ConcernIsCompany string
  ScheduleJOtherInvstmts.ScheduleJOtherInvstmtsDtls[].ClassOfSharesHeld string
  ScheduleJOtherInvstmts.ScheduleJOtherInvstmtsDtls[].NoOfSharesHeld integer
  ScheduleJOtherInvstmts.ScheduleJOtherInvstmtsDtls[].NominalaValueOfInvestment integer
* ScheduleJOtherInvstmts.TotalNoOfShares integer
* ScheduleJOtherInvstmts.TotalValueOfInvestment integer
  ScheduleJVoluntaryContribution.ScheduleJVoluntaryContributionDtls[] array
* ScheduleJVoluntaryContribution.ScheduleJVoluntaryContributionDtls[].NameAndAddress string
* ScheduleJVoluntaryContribution.ScheduleJVoluntaryContributionDtls[].ValueOfContribution integer
* ScheduleJVoluntaryContribution.ScheduleJVoluntaryContributionDtls[].ValueOfContributionObj integer
* ScheduleJVoluntaryContribution.ScheduleJVoluntaryContributionDtls[].AmtInvestedUs11 integer
* ScheduleJVoluntaryContribution.ScheduleJVoluntaryContributionDtls[].BalIncUs11 integer
* ScheduleJVoluntaryContribution.TotalValueOfContribution integer
* ScheduleJVoluntaryContribution.TotalValOfContrbnAppdTwrdsObj integer
* ScheduleJVoluntaryContribution.TotalAmtInvestedUs11 integer
* ScheduleJVoluntaryContribution.TotalBalIncUs11 integer
```

---

## Appendix 3 · Every live row of the sheet, verbatim
(Rows 4 and 5 are hidden memo lines — shown for completeness, not built.)
```
[C3] Schedule J  |  [F3] Statement showing the funds and investments as on the last day of the previous year [to be filled by assesses claiming exemption u/s 11 and 12 or u/s 10(23C)(iv)/10(23C)(v)/ 10(23C)(vi)/10(23C)(via)
[D4] A  |  [E4] i  |  [F4] Balance in the corpus fund as on the last day of the previous year          (hidden)
[E5] ii  |  [F5] Balance in the non-corpus fund as on the last day of the previous year                (hidden)
[D6] A1  |  [E6] Details of corpus
[E7] Sl No.  |  [F7] Corpus Donation  |  [G7] Opening Balance as on 01.04.2025 (corpus not applied till 31.03.2025) (1)  |  [H7] Received/Treated as corpus during the year (2)  |  [I7] Applied during the year (3)  |  [J7] Amount invested or deposited back in to corpus (which was earlier applied and not claimed as application) (where application from corpus is made on or after 01.04.2021) (4)  |  [K7] Total amount invested or deposited back in to corpus (5)  |  [L7] Financial year in which (4) was applied earlier (6)  |  [M7] Closing Balance as on 31.03.2026 [(1+2+5)-3] (7)  |  [N7] Invested in modes specified in Sec 11(5) as on 31.03.2026 (8)  |  [O7] Amount taxed in earlier Assessment Years (9)  |  [P7] Invested in modes other than specified in Sec 11(5) as on 31.03.2026 (10) = (7-8-9)
[F11] TOTAL
[D12] A2  |  [E12] Details of loan and borrowings
[E13] Sl No.  |  [F13] Opening Balance as on 01.04.2025 (1)  |  [G13] Loan & Borrowings taken for applications towards objectives during the year (2)  |  [H13] Applied for the objects of the trust or institution during the year (3)  |  [I13] Amount of repayment of loan or borrowing during the year (which was earlier applied and not claimed as application) (where application from any loan or borrowing is made on or after 01.04.2021) (4)  |  [J13] Financial year in which (4) was applied earlier (5)  |  [K13] Total Repayment of loan or borrowing during the year (6)  |  [L13] Closing Balance as on 31.03.2026 (7) (1+2-6=7)
[D18] TOTAL
[D19] B  |  [E19] Details of corpus investment/deposits made under section 11(5) as on 31.03.2026
[E21] Sl No.  |  [F21] Investment out of  |  [G21] Mode of investment as per section 11(5)  |  [H21] Amount of investment
[E22] (1)  |  [F22] (2)  |  [G22] (3)  |  [H22] (4)
[D28] TOTAL
[D29] C  |  [E29] Investment held at any time during the previous year (s) in concern (s) in which persons referred to in section 13(3) and 21st Proviso of Section 10(23C) have a substantial interest
[E31] Sl No.  |  [F31] Name and address of the concern  |  [G31] Whether the concern is a company  |  [H31] Number of shares held  |  [I31] Class of shares held  |  [J31] Total value of investment  |  [K31] Income from the investment  |  [L31] Whether the amount in col (6) exceeds 5 percent of the capital of the concern during the previous year
[E32] (1)  |  [F32] (2)  |  [G32] (3)  |  [H32] (4)  |  [I32] (5)  |  [J32] (6)  |  [K32] (7)  |  [L32] (8)
[D37] TOTAL
[D38] D  |  [E38] Other investments as on the last day of the previous year
[E39] Sl No.  |  [F39] Name and address of the concern  |  [G39] Whether the concern is a company  |  [H39] Class of shares held  |  [I39] Number of shares held  |  [J39] Total value of investment
[E40] (1)  |  [F40] (2)  |  [G40] (3)  |  [H40] (4)  |  [I40] (5)  |  [J40] (6)
[D45] TOTAL
[D46] E  |  [E46] Voluntary contributions/donations received in kind but not converted into investments in the specified modes u/s 11(5) within the time provided
[E48] Sl No.  |  [F48] Name and address of the donor  |  [G48] Value of contribution/donation  |  [H48] Value of contribution applied towards objective  |  [I48] Amount out of (3) invested in modes prescribed under section 11(5)  |  [J48] Balance to be treated as income under section 11(3)
[E49] (1)  |  [F49] (2)  |  [G49] (3)  |  [H49] (4)  |  [I49] (5)  |  [J49] (6)
[D54] TOTAL
```

---

## Appendix 4 · Every dropdown value, verbatim

**Mode of investment as per section 11(5)** — `ScheduleJ.ModeOfInvestmentValue`
(cells G23:G26):
```
(Select)
Investment in Government Saving Scheme
Post Office Saving Bank
Deposit in Schedule Bank or co-operative societies as per section 11(5)(iii)
Investment in UTI
Investment in CG/SG issued securities
CG/SG guaranteed debentures issued by any company or corporation
Investment or deposit in public sector company
Bonds issued by financial corporation as mentioned in section 11(5)(viii)
Bonds issued by public company carrying on business of providing long term finance for construction as mentioned in section 11(5)(ix)
Bonds issued by public company carrying on business of providing long term finance for urban infrastructure as mentioned in section 11(5)(ixa)
Investment in immovable property
Deposits with the IDBI
Investment by way of acquiring units of POWERGRID Infrastructure Investment Trust
Any other Investment or deposit as per sec 11(5)
```

**Investment out of** — `ScheduleJ.Investmentvalue` (cells F23:F26):
```
(Select)
Corpus representing donations received for the renovation or repair of places notified u/s 80G(2)(b) on or after 01.04.2020
Corpus other than (i) above received on or after 01.04.2021
Other than (i) and (ii) above
```

**Corpus Donation type** (cells L13, M7:P7):
```
(Select)
i.Representing donations received for the renovation or repair of places notified u/s 80G(2)(b) on or after 01.04.2020
ii.Other than (i) above received on or after 01.04.2021
iii.Other than (i) and (ii) above
```

**Whether the concern is a company / exceeds 5 percent** — Yes/No (cells
L33:L35, G33:G35, G41:G43):
```
(Select)
Yes
No
```

**Financial year in which (4) was applied earlier** (cells J14:J16, and L8:L9):
```
(Select)
2021-22
2022-23
2023-24
2024-25
2025-26
```
