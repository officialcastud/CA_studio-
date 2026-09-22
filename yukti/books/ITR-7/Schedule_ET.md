# The book of Schedule ET — Electoral Trust · ITR-7, A.Y. 2026-27

Read row by row from the utility's **Schedule ET** sheet (rows 3–18) with the
dropdowns and number-format validations, and confirmed against the CBDT ITR-7
schema block **`ScheduleET`**. Schedule ET is the **special body-of-persons
disclosure for an electoral trust** — the particulars an electoral trust must
file to establish its claim to exemption of income under **section 13B** of the
Income-tax Act, read with the conditions of **rule 17CA** of the Income-tax
Rules, 1962 and the Electoral Trusts Scheme, 2013. Nothing here is invented:
Appendix 2 reproduces every schema leaf, Appendix 3 every live row verbatim,
Appendix 4 every dropdown value.

---

## 1 · Purpose and shape

Schedule ET is a **single-instance particulars block** (not a repeating table).
It has two bands:

1. **Compliance conditions** (rows 4–9) — whether books of account were
   maintained, whether a record of each voluntary contribution (with name,
   address and PAN of the contributor) was maintained, whether a record of each
   eligible political party to whom distributable contributions were distributed
   was maintained, whether the accounts were audited as per rule 17CA(12), the
   date of the audit report in Form No. 10BC, and whether the report as per rule
   17CA(14) was furnished.
2. **Contributions received and distributed** (rows 10–18) — a fixed eight-line
   computation of the year's voluntary-contribution movement, from opening
   balance to closing balance, isolating the **amount eligible for exemption
   under section 13B** (`VoluntaryContributionDtls`).

Every filed particular is a scalar key or a leaf of the single object
`VoluntaryContributionDtls`; there is no array on this schedule.

---

## 2 · The rows — label → type → schema key

| Row | Label (verbatim head) | Type / input | Schema key |
|---|---|---|---|
| E4 | Whether books of account were maintained? | dropdown (Select)/Yes/No | `BooksOfAccMaintained` * |
| E5 | Whether record of each voluntary contribution (including name, address and PAN of the person who has made such contribution) was maintained? | dropdown (Select)/Yes/No | `VoluntaryContribution` * |
| E6 | Whether record of each eligible political party to whom the distributable contributions have been distributed was maintained? | dropdown (Select)/Yes/No | `RecordsMaintainedWithPAN` * |
| E7 | Whether the accounts have been audited as per rule 17CA(12)? | dropdown (Select)/Yes/No | `AccountsAudited` * |
| E8 | If yes, date of audit report in Form No.10BC (DD/MM/YYYY) | date (max 10) | `AuditReportDate` |
| E9 | Whether the report as per rule 17CA(14) furnished to the Commissioner of Income-tax or Director of Income-tax? | dropdown (Select)/Yes/No | `ReportAsPerRule17CA` * |
| E10 | Details of voluntary contributions received and amounts distributed during the year | header | — |
| i / F11 | Opening balance as on 1st April | integer | `VoluntaryContributionDtls.OpeningBalance` * |
| ii / F12 | Voluntary contribution received during the year | integer | `VoluntaryContributionDtls.VoluntaryContributionDuringYr` * |
| iii / F13 | Total (i + ii) | integer | `VoluntaryContributionDtls.TotalAfterVoluntaryContribution` * |
| iv / F14 | Amount distributed to Political parties | integer | `VoluntaryContributionDtls.AmtDistToPoliticalParties` * |
| v / F15 | Amount spent on administrative and management functions of the Trust (Restricted to 5% of Sr.no. ii subject to a maximum of Rs. 5,00,000/-) | integer | `VoluntaryContributionDtls.AmtSpentOnManagingAffairs` * |
| vi / F16 | Total (iv + v) | integer | `VoluntaryContributionDtls.Total` * |
| vii / F17 | Total amount eligible for exemption under section 13B (Sr.no. 6ii of schedule ET if Amount distributed to political parties is ≥ 95% of total contributions) | integer | `VoluntaryContributionDtls.TotAmtExeUndSec13B` * |
| viii / F18 | Closing balance as on 31st March (iii – vi) | integer | `VoluntaryContributionDtls.ClosingBalance` * |

`*` marks a **required** leaf of block `ScheduleET`.

---

## 3 · The law and computation substance

**Section 13B** exempts any **voluntary contributions received by an electoral
trust** in a previous year, provided the trust:

- **distributes** to eligible political parties (registered under section 29A of
  the Representation of the People Act, 1951) at least **95% of the aggregate
  donations received during the year together with the surplus (opening
  balance)**; and
- **functions in accordance with rule 17CA** of the Income-tax Rules, 1962.

Schedule ET collects the evidence and the arithmetic of that test:

- **Rule 17CA conditions** (rows 4–9) — the trust keeps and maintains **books
  of account** (`BooksOfAccMaintained`), keeps a **record of each voluntary
  contribution** with the contributor's name, address and PAN
  (`VoluntaryContribution`), keeps a **record of each eligible political party**
  to whom distributions were made (`RecordsMaintainedWithPAN`), has its
  **accounts audited** as required by rule 17CA(12) (`AccountsAudited`) with the
  audit report in **Form No. 10BC** (`AuditReportDate`), and **furnishes the
  report** to the Commissioner/Director as required by rule 17CA(14)
  (`ReportAsPerRule17CA`).

- **The 95%/5% arithmetic** (rows 11–18): the opening balance (i) plus
  contributions received during the year (ii) give the total available (iii).
  The trust may spend on its own administrative and management functions
  (v) an amount **restricted to 5% of the year's contributions (item ii),
  subject to a maximum of ₹5,00,000**. The amount distributed to political
  parties (iv) plus the permitted administrative spend (v) give item vi. The
  **amount eligible for exemption under section 13B** (vii) is available when the
  amount distributed to political parties is **≥ 95%** of the total
  contributions. The closing balance (viii) = total available (iii) − item vi.

The exemption line `TotAmtExeUndSec13B` is the operative figure the trust
carries to its exemption claim.

---

## 4 · Cross-sheet feeds

**In:** all figures are entered directly from the trust's accounts of
contributions received and distributed.

**Out:** the **total amount eligible for exemption under section 13B**
(`VoluntaryContributionDtls.TotAmtExeUndSec13B`, row 17) ties to the exemption
claimed on total income in Part B-TI. Schedule ET is otherwise a **disclosure
schedule** — it certifies the rule-17CA conditions and computes the 13B-eligible
figure, but levies no tax of its own.

---

## Appendix 1 · When Schedule ET applies

Schedule ET is filled by an **electoral trust** approved under the Electoral
Trusts Scheme, 2013 that claims exemption of its income under section 13B. It is
a special-body schedule of ITR-7 (alongside Schedule PP for a political party).

---

## Appendix 2 · Every schema leaf of block `ScheduleET` (full paths)
`*` = required.
```
* BooksOfAccMaintained string
* VoluntaryContribution string
* RecordsMaintainedWithPAN string
* AccountsAudited string
  AuditReportDate string
* ReportAsPerRule17CA string
* VoluntaryContributionDtls.OpeningBalance integer
* VoluntaryContributionDtls.VoluntaryContributionDuringYr integer
* VoluntaryContributionDtls.TotalAfterVoluntaryContribution integer
* VoluntaryContributionDtls.AmtDistToPoliticalParties integer
* VoluntaryContributionDtls.AmtSpentOnManagingAffairs integer
* VoluntaryContributionDtls.Total integer
* VoluntaryContributionDtls.TotAmtExeUndSec13B integer
* VoluntaryContributionDtls.ClosingBalance integer
```

---

## Appendix 3 · Every live row of the sheet, verbatim
```
[C3] Schedule ET  |  [F3] Electoral Trust
[C4] ELECTORAL TRUST  |  [E4] Whether books of account were maintained?
[E5] Whether record of each voluntary contribution (including name, address and PAN of the person who has made such contribution) was maintained?
[E6] Whether record of each eligible political party to whom the distributable contributions have been distributed was maintained?
[E7] Whether the accounts have been audited as per rule 17CA(12)?
[E8] If yes, date of audit report in Form No.10BC (DD/MM/YYYY )
[E9] Whether the report as per rule 17CA(14) furnished to the Commissioner of Income-tax or Director of Income-tax?
[E10] Details of voluntary contributions received and amounts distributed during the year
[E11] i  |  [F11] Opening balance as on 1st April  |  [M11] i
[E12] ii  |  [F12] Voluntary contribution received during the year  |  [M12] ii
[E13] iii  |  [F13] Total (i + ii)  |  [M13] iii
[E14] iv  |  [F14] Amount distributed to Political parties  |  [M14] iv
[E15] v  |  [F15] Amount spent on administrative and management functions of the Trust (Restricted to 5% of Sr.no. ii subject to a maximum of Rs. 5,00,000/-)  |  [M15] v
[E16] vi  |  [F16] Total (iv + v)  |  [M16] vi
[E17] vii  |  [F17] Total amount eligible for exemption under section 13B (Sr.no. 6ii of schedule ET if Amount distributed to political parties is >= 95% of total contributions)  |  [M17] vii
[E18] viii  |  [F18] Closing balance as on 31st March (iii – vi)  |  [M18] viii
```

---

## Appendix 4 · Dropdown values (verbatim)

**Yes/No gate** — cells N4:O4, N5:O7, N9:O9 (`BooksOfAccMaintained`,
`VoluntaryContribution`, `RecordsMaintainedWithPAN`, `AccountsAudited`,
`ReportAsPerRule17CA`):
```
(Select) | Yes | No
```

All other cells (N8 date; N11–N18 the eight contribution lines) are
number/date-format validations, not value lists.
