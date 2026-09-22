# The book of Schedule A — amount applied to the stated objects · ITR-7, A.Y. 2026-27

Read row by row from the utility's **Schedule A** sheet (rows 3–50) and confirmed
against the CBDT ITR-7 schema block **ScheduleA**. This is the master statement of
the **amount applied to the stated objects of the trust/institution during the
previous year from all sources** — the numerator of the 85%-application test for
exemption under sections 11 and 12 (or 10(23C)(iv)/(v)/(vi)/(via)). It is built in
seven parts: **A** application towards the stated objects (revenue and capital),
**B** expenditure not allowed as application, **C** the sources of fund used to
meet the application, and **D–G** the reconciliation to the total amount allowed
as application. Every figure is split three ways — **Revenue · Capital · Total**.
Nothing here is invented: Appendix 1 lists every schema leaf, Appendix 2
reproduces every live row verbatim.

This is the trust's application & accumulation core: Schedule A is *application*,
**Schedule I / IA** are *accumulation u/s 11(2)/11(3)* and **Schedule D / DA** are
*deemed application u/s Expln.1 to 11(1) / 11(1B)*.

---

## 1 · Purpose and shape

A single tall statement, not a repeating array (except the "Any other" source
sub-table). Row 3 is the title — `B3` **Schedule A**, `D3` *"Amount applied to
stated objects of the trust/institution during the previous year from all sources
referred to in C1 to C7 of this table [to be filled by assessee claiming
exemption u/s 11 and 12 or u/s 10(23C)(iv) or 10(23C)(v) or 10(23C)(vi) or
10(23C)(via)]."* Every money row carries three amounts — **Revenue** (col I),
**Capital** (col J), **Total** (col K = Revenue + Capital) — the header at row 6.

The parts:
- **A** (rows 5–19) — Application towards the stated objects → total at A12 (row 19).
- **B** (rows 21–29) — Expenditure not allowed as application → total at row 21.
- **C** (rows 31–43) — Source of fund to meet the application in Row A.
- **D** (row 47) — Total amount applied during the previous year [A12−B−C2…C7].
- **E** (row 48) — Amount not actually applied during the previous year out of D.
- **F** (row 49) — Amount actually paid this year that accrued in an earlier year.
- **G** (row 50) — Total amount to be allowed as application (G = D − E + F).

---

## 2 · Part A — application towards the stated objects (rows 5–19)

Each row → a `Revenue`, `Capital`, `Total` triple under `AppTowExpTrstInst`.

| Row | Sl | Label (verbatim, abridged) | Schema key (object) |
|---|---|---|---|
| 7 | — | Donation to trust or institution registered u/s 12AB or approved u/s 10(23C)(iv)/(v)/(vi)/(via)– Other than Corpus (100% of donation made need to be entered here) | OtherThanCorpus |
| 8 | 1a | 85% of the donation(s) made to trust or institution(s) registered u/s 12AB or approved u/s 10(23C)(iv)/(v)/(vi)/(via)– Other than Corpus | OtherThanCorpus85 |
| 9 | — | Religious | Religious |
| 10 | — | Relief of poor | ReliefOfPoor |
| 11 | — | Educational | Educational |
| 12 | — | Yoga | Yoga |
| 13 | — | Medical relief | MedicalRelief |
| 14 | — | Preservation of environment | PreservationOfEnvrmnt |
| 15 | — | Preservation of monuments etc | PreservationOfMonumentsEtc |
| 16 | — | General public utility | GeneralPublicUtility |
| 17 | — | Application which cannot be specificically identified under 1 to 9 above | AppCantBeSpecIdentAbov |
| 18 | — | Cost of new asset for claim of Exemption u/s 11(1A) (restricted to the net consideration) | CostNewAssetUs11_1A |
| 19 | A12 | Total (A1a to A11) | TotalA1toA11 *(required)* |

---

## 3 · Part B — expenditure not allowed as application (rows 21–29)

Amounts here are **out of** the Part A figures but disallowed as application. Each
row → a `Revenue`, `Capital`, `Total` triple under `ExpNotAllowedApplication`.

| Row | Label (verbatim, abridged) | Schema key (object) |
|---|---|---|
| 21 | Expenditure not allowed as application other than application out of source of fund at C2 to C7 (B1+B2+B3+B4+B5+B6+B7+B8) | TotExpNotAllowedApplication *(required)* |
| 22 | Donation to trust or institution registered u/s 12AB or approved u/s 10(23C)(iv)/(v)/(vi)/(via) towards Corpus | DonFormingPartCorpusFund |
| 23 | Donation … other than towards corpus in case of donations out of accumulated income | DonationTowardsOtherThanCorpus |
| 24 | Donation … not having same objects | DonationNotSameObject |
| 25 | Donation to any person other than trust or institution registered u/s 12AB or approved u/s 10(23C)(iv)/(v)/(vi)/(via) | DonationOtherThanTrust |
| 26 | Application outside India for which approval as per proviso to section 11(1)(c) is obtained | ApplctnOutIndiaApprvlObtnd |
| 27 | Application outside India for which approval as per proviso to section 11(1)(c) is not obtained | ApplctnOutIndiaApprvlNotObtnd |
| 28 | Applied for any purpose beyond the objects of the trust or institution | AppliedBeyondObject |
| 29 | Any other disallowable application | AnyOthrDisallowableExpenditure |

---

## 4 · Part C — source of fund to meet the application (rows 31–43)

The sources funding the revenue and capital application in Row A (to the extent
C2–C7 is included in A12). Each row → a `Revenue`, `Capital`, `Total` triple under
`SrcRevCapApplctn`.

| Row | Label (verbatim, abridged) | Schema key (object) |
|---|---|---|
| 31 | Source of fund to meet revenue and capital application in Row A (to the extent amount at Sl. No. C2 to C7 is included in Sl. No. A12) | TotSrcRevCapApplctn *(required)* |
| 32 | Income derived from the property/income earned during previous year (Excluding corpus) | IncDerFrmPrprty |
| 33 | Income accumulated as under section 11(2) or third proviso to section 10(23C) in earlier years | IncAccumulatedEarlierYr |
| 34 | Income deemed to be applied in any preceding year under clause 2 of explanation 1 of section 11(1) (applicable only when exemption is claimed u/s 11 and 12) | IncDeemdPrcdngYr |
| 35 | Income of earlier years upto 15% accumulated or set apart | EarlierYrIncUpto15Per |
| 36 | Corpus | Corpus |
| 37 | Borrowed Fund | BorrowedFund |
| 38 | Any other (Please specify) | OthersInc → TotOthersInc |

Row 38 opens a repeatable sub-table (rows 39–43), header row 39 —
`Sl. No. | Nature | Revenue Amount | Capital Amount`. Array
`SrcRevCapApplctn.OthersInc.OthersIncDtls[]`: `OthNatOfInc` (Nature),
`OthRevAmount` (Revenue Amount), `OthCapAmount` (Capital Amount); its running
total is `TotOthersInc` (Revenue/Capital/Total).

---

## 5 · Parts D–G — the reconciliation (rows 47–50)

| Row | Sl | Label (verbatim, abridged) | Schema key (object) | Rule |
|---|---|---|---|---|
| 47 | D | Total Amount applied during the previous year [A12-B-C2-C3-C4-C5-C6-C7] | TotAmtAppDrngPrevYr *(required)* | D = A12 − B − (C2…C7) |
| 48 | E | Amount which was not actually applied during the previous year out of D [(if it is included in Sl. No. A12)] | AmountNotPaidPY | subtracted in G |
| 49 | F | Amount actually paid during the previous year which accrued during any earlier previous year but not claimed as application of income in earlier previous year | AmountPaidPY | added in G |
| 50 | G | Total amount to be allowed as application (G=D-E+F) | TotAmountAllowedApplication *(required)* | **G = D − E + F** |

**Row G (`TotAmountAllowedApplication`)** is the schedule's output — the total
amount allowed as application of income, tested against the 85% requirement.

---

## 6 · The law and the computation

For exemption under **sections 11 and 12** a trust must **apply at least 85%** of
its income to its charitable/religious objects in India during the year. Schedule
A assembles that numerator:

- **Part A** lists application by object head (religious, relief of poor,
  educational, yoga, medical relief, preservation of environment / monuments,
  general public utility, unidentifiable, and the s.11(1A) cost of a new asset),
  plus donations to other registered trusts (100% recorded at row 7, only **85%**
  of an *other-than-corpus* donation counting as application at row 8, per the
  Explanation to s.11 restricting inter-charity donations out of current income).
- **Part B** strips out what the law does **not** allow as application: corpus
  donations, donations to non-same-object or unregistered donees, un-approved
  foreign application (s.11(1)(c)), and application beyond the objects.
- **Part C** identifies the *source* of the funds applied — current income, income
  accumulated u/s 11(2), income deemed applied in a preceding year, the 15%
  earlier-year set-apart, corpus, borrowed funds, or any other — because
  application **out of corpus or borrowed funds** (and out of accumulations) is
  treated specially and not counted afresh.
- **Parts D–G** reconcile to the allowable figure: **D** = A12 net of B and the
  C2–C7 sources; **E** removes amounts booked but not actually applied; **F** adds
  amounts actually paid this year that had accrued earlier; **G = D − E + F** is the
  total allowed as application.

Every line is split **Revenue** vs **Capital** so revenue application and capital
application (asset acquisition) are separately visible, with **Total** = Revenue +
Capital.

---

## 7 · Dropdowns / enums

There are **no value-list dropdowns** on Schedule A. Every data-validation entry
is a numeric constraint (`source "0"`, `values: null`) or a text-length limit on
the "Nature" free-text column (`E40:E43`, `source "125"`). So there are no enum
values to seed.

---

## 8 · Cross-sheet feeds

**In:** application figures are typed / drawn from the books of account; Part C row
33 ties to **Schedule I** (income accumulated u/s 11(2) in earlier years) and row
34 to **Schedule D** (income deemed applied in a preceding year u/s Expln.1 to
11(1)). The hidden helper sheets **Schedule ER** (establishment & administrative
expenses) and **Schedule EC** (capital account) feed the revenue/capital detail.

**Out:** row **G** (`TotAmountAllowedApplication`) is the total application allowed,
carried into the exemption computation and the 85%-application test in Part B-TI.

---

## Appendix 1 · Every schema leaf of block ScheduleA (full paths)
`*` = required.
```
  AppTowExpTrstInst.OtherThanCorpus.Revenue integer
  AppTowExpTrstInst.OtherThanCorpus.Capital integer
  AppTowExpTrstInst.OtherThanCorpus.Total integer
  AppTowExpTrstInst.OtherThanCorpus85.Revenue integer
  AppTowExpTrstInst.OtherThanCorpus85.Capital integer
  AppTowExpTrstInst.OtherThanCorpus85.Total integer
  AppTowExpTrstInst.Religious.Revenue integer
  AppTowExpTrstInst.Religious.Capital integer
  AppTowExpTrstInst.Religious.Total integer
  AppTowExpTrstInst.ReliefOfPoor.Revenue integer
  AppTowExpTrstInst.ReliefOfPoor.Capital integer
  AppTowExpTrstInst.ReliefOfPoor.Total integer
  AppTowExpTrstInst.Educational.Revenue integer
  AppTowExpTrstInst.Educational.Capital integer
  AppTowExpTrstInst.Educational.Total integer
  AppTowExpTrstInst.Yoga.Revenue integer
  AppTowExpTrstInst.Yoga.Capital integer
  AppTowExpTrstInst.Yoga.Total integer
  AppTowExpTrstInst.MedicalRelief.Revenue integer
  AppTowExpTrstInst.MedicalRelief.Capital integer
  AppTowExpTrstInst.MedicalRelief.Total integer
  AppTowExpTrstInst.PreservationOfEnvrmnt.Revenue integer
  AppTowExpTrstInst.PreservationOfEnvrmnt.Capital integer
  AppTowExpTrstInst.PreservationOfEnvrmnt.Total integer
  AppTowExpTrstInst.PreservationOfMonumentsEtc.Revenue integer
  AppTowExpTrstInst.PreservationOfMonumentsEtc.Capital integer
  AppTowExpTrstInst.PreservationOfMonumentsEtc.Total integer
  AppTowExpTrstInst.GeneralPublicUtility.Revenue integer
  AppTowExpTrstInst.GeneralPublicUtility.Capital integer
  AppTowExpTrstInst.GeneralPublicUtility.Total integer
  AppTowExpTrstInst.AppCantBeSpecIdentAbov.Revenue integer
  AppTowExpTrstInst.AppCantBeSpecIdentAbov.Capital integer
  AppTowExpTrstInst.AppCantBeSpecIdentAbov.Total integer
  AppTowExpTrstInst.CostNewAssetUs11_1A.Revenue integer
  AppTowExpTrstInst.CostNewAssetUs11_1A.Capital integer
  AppTowExpTrstInst.CostNewAssetUs11_1A.Total integer
* AppTowExpTrstInst.TotalA1toA11.Revenue integer
* AppTowExpTrstInst.TotalA1toA11.Capital integer
* AppTowExpTrstInst.TotalA1toA11.Total integer
* ExpNotAllowedApplication.TotExpNotAllowedApplication.Revenue integer
* ExpNotAllowedApplication.TotExpNotAllowedApplication.Capital integer
* ExpNotAllowedApplication.TotExpNotAllowedApplication.Total integer
  ExpNotAllowedApplication.DonFormingPartCorpusFund.Revenue integer
  ExpNotAllowedApplication.DonFormingPartCorpusFund.Capital integer
  ExpNotAllowedApplication.DonFormingPartCorpusFund.Total integer
  ExpNotAllowedApplication.DonationTowardsOtherThanCorpus.Revenue integer
  ExpNotAllowedApplication.DonationTowardsOtherThanCorpus.Capital integer
  ExpNotAllowedApplication.DonationTowardsOtherThanCorpus.Total integer
  ExpNotAllowedApplication.DonationNotSameObject.Revenue integer
  ExpNotAllowedApplication.DonationNotSameObject.Capital integer
  ExpNotAllowedApplication.DonationNotSameObject.Total integer
  ExpNotAllowedApplication.DonationOtherThanTrust.Revenue integer
  ExpNotAllowedApplication.DonationOtherThanTrust.Capital integer
  ExpNotAllowedApplication.DonationOtherThanTrust.Total integer
  ExpNotAllowedApplication.ApplctnOutIndiaApprvlObtnd.Revenue integer
  ExpNotAllowedApplication.ApplctnOutIndiaApprvlObtnd.Capital integer
  ExpNotAllowedApplication.ApplctnOutIndiaApprvlObtnd.Total integer
  ExpNotAllowedApplication.ApplctnOutIndiaApprvlNotObtnd.Revenue integer
  ExpNotAllowedApplication.ApplctnOutIndiaApprvlNotObtnd.Capital integer
  ExpNotAllowedApplication.ApplctnOutIndiaApprvlNotObtnd.Total integer
  ExpNotAllowedApplication.AppliedBeyondObject.Revenue integer
  ExpNotAllowedApplication.AppliedBeyondObject.Capital integer
  ExpNotAllowedApplication.AppliedBeyondObject.Total integer
  ExpNotAllowedApplication.AnyOthrDisallowableExpenditure.Revenue integer
  ExpNotAllowedApplication.AnyOthrDisallowableExpenditure.Capital integer
  ExpNotAllowedApplication.AnyOthrDisallowableExpenditure.Total integer
* SrcRevCapApplctn.TotSrcRevCapApplctn.Revenue integer
* SrcRevCapApplctn.TotSrcRevCapApplctn.Capital integer
* SrcRevCapApplctn.TotSrcRevCapApplctn.Total integer
  SrcRevCapApplctn.IncDerFrmPrprty.Revenue integer
  SrcRevCapApplctn.IncDerFrmPrprty.Capital integer
  SrcRevCapApplctn.IncDerFrmPrprty.Total integer
  SrcRevCapApplctn.IncAccumulatedEarlierYr.Revenue integer
  SrcRevCapApplctn.IncAccumulatedEarlierYr.Capital integer
  SrcRevCapApplctn.IncAccumulatedEarlierYr.Total integer
  SrcRevCapApplctn.IncDeemdPrcdngYr.Revenue integer
  SrcRevCapApplctn.IncDeemdPrcdngYr.Capital integer
  SrcRevCapApplctn.IncDeemdPrcdngYr.Total integer
  SrcRevCapApplctn.EarlierYrIncUpto15Per.Revenue integer
  SrcRevCapApplctn.EarlierYrIncUpto15Per.Capital integer
  SrcRevCapApplctn.EarlierYrIncUpto15Per.Total integer
  SrcRevCapApplctn.Corpus.Revenue integer
  SrcRevCapApplctn.Corpus.Capital integer
  SrcRevCapApplctn.Corpus.Total integer
  SrcRevCapApplctn.BorrowedFund.Revenue integer
  SrcRevCapApplctn.BorrowedFund.Capital integer
  SrcRevCapApplctn.BorrowedFund.Total integer
  SrcRevCapApplctn.OthersInc.TotOthersInc.Revenue integer
  SrcRevCapApplctn.OthersInc.TotOthersInc.Capital integer
  SrcRevCapApplctn.OthersInc.TotOthersInc.Total integer
  SrcRevCapApplctn.OthersInc.OthersIncDtls[] array
  SrcRevCapApplctn.OthersInc.OthersIncDtls[].OthNatOfInc string
  SrcRevCapApplctn.OthersInc.OthersIncDtls[].OthRevAmount integer
  SrcRevCapApplctn.OthersInc.OthersIncDtls[].OthCapAmount integer
* TotAmtAppDrngPrevYr.Revenue integer
* TotAmtAppDrngPrevYr.Capital integer
* TotAmtAppDrngPrevYr.Total integer
  AmountNotPaidPY.Revenue integer
  AmountNotPaidPY.Capital integer
  AmountNotPaidPY.Total integer
  AmountPaidPY.Revenue integer
  AmountPaidPY.Capital integer
  AmountPaidPY.Total integer
* TotAmountAllowedApplication.Revenue integer
* TotAmountAllowedApplication.Capital integer
* TotAmountAllowedApplication.Total integer
```

---

## Appendix 2 · Every live row of the sheet, verbatim
```
[B3] Schedule A  |  [D3] Amount applied to stated objects of the trust/institution during the previous year from all sources referred to in C1 to C7 of this table [to be filled by assessee claiming exemption u/s 11 and 12 or u/s 10(23C)(iv) or 10(23C)(v) or 10(23C)(vi) or 10(23C)(via)].
[C5] A  |  [D5] Application towards the stated objects of the trust/institution  |  [I5] Amount
[I6] Revenue  |  [J6] Capital  |  [K6] Total
[D7] Donation to trust or institution registered u/s 12AB or approved u/s 10(23C)(iv)/(v)/(vi)/(via)– Other than Corpus (100% of donation made need to be entered here)
[C8] 1a  |  [D8] 85% of the donation(s) made to trust or institution(s) registered u/s 12AB or approved u/s 10(23C)(iv)/(v)/(vi)/(via)– Other than Corpus
[D9] Religious
[D10] Relief of poor
[D11] Educational
[D12] Yoga
[D13] Medical relief
[D14] Preservation of environment
[D15] Preservation of monuments etc
[D16] General public utility
[D17] Application which cannot be specificically identified under 1 to 9 above
[D18] Cost of new asset for claim of Exemption u/s 11(1A) (restricted to the net consideration)
[D19] Total (A1a to A11)
[C21] B  |  [D21] Expenditure not allowed as application other than application out of source of fund at C2 to C7 (B1+B2+B3+B4+B5+B6+B7+B8) Note: Amount entered in Sl. No. B should be out of Sl. No. A
[D22] Donation to trust or institution registered u/s 12AB or approved u/s 10(23C)(iv)/(v)/(vi)/(via) towards Corpus
[D23] Donation to trust or institution registered u/s 12AB or approved u/s 10(23C)(iv)/(v)/(vi)/(via) other than towards corpus in case of donations out of accumulated income
[D24] Donation to trust or institution registered u/s 12AB or approved u/s 10(23C)(iv)/(v)/(vi)/(via) not having same objects
[D25] Donation to any person other than trust or institution registered u/s 12AB or approved u/s 10(23C)(iv)/(v)/(vi)/(via)
[D26] Application outside India for which approval as per proviso to section 11(1)(c) is obtained
[D27] Application outside India for which approval as per proviso to section 11(1)(c) is not obtained
[D28] Applied for any purpose beyond the objects of the trust or institution
[D29] Any other disallowable application
[C31] C  |  [D31] Source of fund to meet revenue and capital application in Row A (to the extent amount at Sl. No. C2 to C7 is included in Sl. No. A12)
[D32] Income derived from the property/income earned during previous year (Excluding corpus)
[D33] Income accumulated as under section 11(2) or third proviso to section 10(23C) in earlier years
[D34] Income deemed to be applied in any preceding year under clause 2 of explanation 1 of section 11(1) (applicable only when exemption is claimed u/s 11 and 12)
[D35] Income of earlier years upto 15% accumulated or set apart
[D36] Corpus
[D37] Borrowed Fund
[D38] Any other (Please specify)
[D39] Sl. No.  |  [E39] Nature  |  [F39] Revenue Amount  |  [G39] Capital Amount
[C47] D  |  [D47] Total Amount applied during the previous year [A12-B-C2-C3-C4-C5-C6-C7]
[C48] E  |  [D48] Amount which was not actually applied during the previous year out of D [(if it is included in Sl. No. A12)]
[C49] F  |  [D49] Amount actually paid during the previous year which accrued during any earlier previous year but not claimed as application of income in earlier previous year
[C50] G  |  [D50] Total amount to be allowed as application (G=D-E+F)
```
