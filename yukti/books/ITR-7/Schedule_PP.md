# The book of Schedule PP — Political Party · ITR-7, A.Y. 2026-27

Read row by row from the utility's **Schedule PP** sheet (rows 3–56) with the
hidden-row flags, the dropdowns and the number-format validations, and confirmed
against the CBDT ITR-7 schema block **`SchedulePP`**. Schedule PP is the
**special body-of-persons disclosure for a political party** — the set of
particulars a party must file to establish its claim to exemption of income
under **section 13A** of the Income-tax Act, read with its registration under
**section 29A** and its statutory reporting under **section 29C** of the
Representation of the People Act, 1951. Nothing here is invented: Appendix 2
reproduces every schema leaf, Appendix 3 every live row verbatim, Appendix 4
every dropdown value.

---

## 1 · Purpose and shape

Schedule PP is a **single-instance particulars block** (not a repeating table).
It has three logical bands:

1. **Registration & recognition** (rows 4–8) — the section-29A registration
   number and date, and recognition by the Election Commission of India.
2. **Books, audit and section-29C reporting** (rows 9–24) — whether books were
   maintained, whether the accounts were audited, the full auditor particulars,
   and whether the report under section 29C of the RP Act was furnished.
3. **Voluntary-contribution conditions & aggregates** (rows 25–33) — the
   section-13A(b)/(d) conditions on contributions above ₹20,000 and donations
   above ₹2,000 otherwise than by account-payee instrument/electoral bond, plus
   the aggregate values of voluntary contributions by band.

Rows 35–56 carry a **Statement of Income and Expenditure** and the **amount
eligible for exemption under section 13A**; in this utility these rows are
**hidden** (they are populated from the income-and-expenditure computation
elsewhere), so they are documented here for completeness but are not part of the
filed `SchedulePP` leaf set. Every filed particular is a scalar key; there is no
array on this schedule.

---

## 2 · The rows — label → type → schema key

| Row | Label (verbatim head) | Type / input | Schema key |
|---|---|---|---|
| 1A / E4 | Whether registered under Section 29A of Representation of People Act, 1951 | dropdown (Select)/Yes/No | `RegisterUS29A` * |
| a / E5 | If yes, please enter registration number | text (max 25) | `RegisterNum` |
| b / E6 | Date of Registration | date DD/MM/YYYY | `DateRegisterUS29A` |
| 1B / E7 | Whether recognized by the Election Commission of India | dropdown (Select)/Yes/No | `RecognizedByECI` * |
| a / E8 | If yes, date of recognition | date DD/MM/YYYY | `DateOfRecognition` |
| E9 | Whether books of account were maintained? | dropdown (Select)/Yes/No | `BooksOfAccMaintained` * |
| a / F10 *(hidden)* | Whether any voluntary contribution from any person in excess of twenty thousand rupees was received | dropdown (Select)/Yes/No | — (mirrors row 25) |
| b / F11 *(hidden)* | If yes, whether record of each voluntary contribution (other than contributions by way of electoral bond) was maintained | dropdown (Select)/Yes/No | — (mirrors row 26) |
| E12 | Whether the accounts have been audited? | dropdown (Select)/Yes/No | `AccountsAudited` * |
| E13 | If yes, furnish the following information:- | header | — |
| a / F14 | Date of furnishing of the audit report (DD/MM/YYYY) | date | `AuditDetailsSchPP.DateOfAudit` |
| b / F15 | Name of the auditor signing the audit report | text (max 125) | `AuditDetailsSchPP.AuditorName` |
| c / F16 | Membership No. of the auditor | text (max 6) | `AuditDetailsSchPP.AuditorMemNo` |
| d / F17 | Name of the auditor (proprietorship/ firm) | text (max 125) | `AuditDetailsSchPP.AudFrmName` |
| e / F18 | Proprietorship/firm registration No. | text (max 8) | `AuditDetailsSchPP.AudFrmRegNo` |
| f / F19 | Permanent Account Number (PAN) of the auditor (proprietorship/ firm) | PAN (max 10) | `AuditDetailsSchPP.AudFrmPAN` |
| F20 | Aadhaar Number of the Auditor (proprietorship) | 12-digit (max 12) | `AuditDetailsSchPP.AudFrmAadhaar` |
| g / F21 | Date of audit report | date | `AuditDetailsSchPP.AuditDate` |
| E22 | Whether the report under sub-section (3) of section 29C of the Representation of the People Act, 1951 was furnished | dropdown (Select)/Yes/No | `ReportUs29` * |
| 4a / F23 | If yes, then date of submission of the report (DD/MM/YYYY) | date | `SubmissionDate` |
| 4b / F24 | Election Commission of India or State Election Commission to whom the report has been submitted | dropdown (list) | `Electioncommissionlist` |
| 5a / E25 | Whether any voluntary contribution from any person in excess of twenty thousand rupees was received | dropdown (Select)/Yes/No | `VoluntaryContribution` * |
| 5b / E26 | If yes, Whether record of each voluntary contribution (other than contributions by way of electoral bond) was maintained | dropdown (Select)/Yes/No | `VoluntaryContributionElecBond` * |
| E27 | Whether any donation exceeding two thousand rupees was received otherwise than by an account payee cheque/draft/bank/electoral bond | dropdown (Select)/Yes/No | `DonExceElectoralBond` * |
| E28 | Please furnish the following information | header | — |
| a / F29 | Total voluntary contributions received by the party during the F.Y. (b+d) | integer | `TotVCReceived` * |
| b / F30 | Aggregate value of all the voluntary contributions received upto Rs. 20,000 during the F.Y. | integer | `AggregateVCUpto20000` |
| ci / F31 | Aggregate value of all the voluntary contributions received upto Rs. 2,000 in cash during the F.Y. | integer | `AggregateVC2000Cash` |
| cii / F32 | Aggregate value of all the voluntary contributions received upto Rs. 2,000 other than in cash during the F.Y. | integer | `AggregateVC2000OtherThanCash` |
| d / F33 | Aggregate value of all the voluntary contributions received more than Rs. 20,000/- during the F.Y. | integer | `AggregateVCMoreThan20000` |

`*` marks a **required** leaf of block `SchedulePP`.

---

## 3 · The law and computation substance

**Section 13A** exempts the income of a political party under the heads *House
property*, *Capital gains*, *Other sources* and *voluntary contributions*,
subject to conditions. Schedule PP collects the evidence of those conditions:

- **13A(a)** — the party keeps and maintains **books of account** (row 9,
  `BooksOfAccMaintained`) that enable the Assessing Officer to deduce its income.
- **13A(b)** — in respect of each **voluntary contribution in excess of
  ₹20,000** (other than by electoral bond), the party keeps a **record** of the
  contribution and the name and address of the contributor (rows 25–26,
  `VoluntaryContribution` / `VoluntaryContributionElecBond`).
- **13A(c)** — the **accounts are audited** by a chartered accountant (row 12,
  `AccountsAudited`, and the auditor particulars at rows 14–21).
- **13A(d)** — **no donation exceeding ₹2,000** is received otherwise than by
  an account-payee cheque/draft, bank/electronic means, or electoral bond
  (row 27, `DonExceElectoralBond`).
- **Registration** under **section 29A** of the RP Act, 1951 (rows 4–6,
  `RegisterUS29A` / `RegisterNum` / `DateRegisterUS29A`) and the **report under
  section 29C(3)** of that Act (row 22, `ReportUs29`, with the submission date
  and the receiving Election Commission at rows 23–24) complete the eligibility.

The **aggregate figures** (rows 29–33) let the department test the 13A(b)/(d)
conditions against the money: total voluntary contributions `TotVCReceived`
(= b + d), the ≤₹20,000 band `AggregateVCUpto20000`, the ≤₹2,000 cash and
non-cash sub-bands `AggregateVC2000Cash` / `AggregateVC2000OtherThanCash`, and
the >₹20,000 band `AggregateVCMoreThan20000`.

The **hidden Income & Expenditure statement** (rows 35–56) sets out the party's
income (fee & subscriptions; grants/donations/contributions — including
contributions from electoral trusts under the Electoral Trust Scheme 2013,
donations through electoral bonds, and other donations; collection by issuing
coupons; receipts from sale of publications; other income) against its
expenditure (election expenditure; employee costs; administrative and general
expenses; finance costs; depreciation & amortisation; other expenses), yielding
the **excess of income over expenditure** and the **amount eligible for
exemption under section 13A**. These carry M-column codes 8a–8f (income),
9a–9g (expenditure), and are computed from the party's income-and-expenditure
account; they are hidden on this sheet and not filed as `SchedulePP` leaves.

---

## 4 · Cross-sheet feeds

**In:** the registration/recognition/audit/reporting answers are entered
directly. The income and expenditure figures (hidden rows 8a–9g) are drawn from
the party's income-and-expenditure computation.

**Out:** the **amount eligible for exemption under section 13A** (row 56) is the
exemption the party claims on its total income; it ties to the exemption claimed
in Part B-TI. Schedule PP is otherwise a **disclosure schedule** — it certifies
the 13A conditions rather than computing a tax figure of its own.

---

## Appendix 1 · When Schedule PP applies

Schedule PP is filled by a **political party** registered under section 29A of
the Representation of the People Act, 1951 that claims exemption of its income
under section 13A. It is a special-body schedule of ITR-7 (alongside Schedule ET
for an electoral trust). A party that is not registered under section 29A cannot
claim the 13A exemption.

---

## Appendix 2 · Every schema leaf of block `SchedulePP` (full paths)
`*` = required.
```
* RegisterUS29A string
  RegisterNum string
  DateRegisterUS29A string
* RecognizedByECI string
  DateOfRecognition string
* BooksOfAccMaintained string
* AccountsAudited string
  AuditDetailsSchPP.DateOfAudit string
  AuditDetailsSchPP.AuditorName string
  AuditDetailsSchPP.AuditorMemNo string
  AuditDetailsSchPP.AudFrmName string
  AuditDetailsSchPP.AudFrmRegNo string
  AuditDetailsSchPP.AudFrmPAN string
  AuditDetailsSchPP.AudFrmAadhaar string
  AuditDetailsSchPP.AuditDate string
* ReportUs29 string
  SubmissionDate string
  Electioncommissionlist string
* VoluntaryContribution string
* VoluntaryContributionElecBond string
* DonExceElectoralBond string
* TotVCReceived integer
  AggregateVCUpto20000 integer
  AggregateVC2000Cash integer
  AggregateVC2000OtherThanCash integer
  AggregateVCMoreThan20000 integer
```

---

## Appendix 3 · Every live row of the sheet, verbatim
Rows flagged **(H)** are hidden in this utility.
```
[C3] Schedule PP  |  [F3] Political Party
[D4] 1A  |  [E4] Whether registered under Section 29A of Representation of People Act, 1951
[D5] a  |  [E5] If yes, please enter registration number
[D6] b  |  [E6] Date of Registration
[D7] 1B  |  [E7] Whether recognized by the Election Commission of India
[D8] a  |  [E8] If yes, date of recognition
[C9] POLITICAL PARTY  |  [E9] Whether books of account were maintained?
(H) [E10] a  |  [F10] Whether any voluntary contribution from any person in excess of twenty thousand rupees was received
(H) [E11] b  |  [F11] If yes, whether record of each voluntary contribution (other than contributions by way of electoral
[E12] Whether the accounts have been audited?
[E13] If yes, furnish the following information:-
[E14] a  |  [F14] Date of furnishing of the audit report(DD/MM/YYYY)
[E15] b  |  [F15] Name of the auditor signing the audit report
[E16] c  |  [F16] Membership No. of the auditor
[E17] d  |  [F17] Name of the auditor (proprietorship/ firm)
[E18] e  |  [F18] Proprietorship/firm registration No.
[E19] f  |  [F19] Permanent Account Number (PAN) of the auditor (proprietorship/ firm)
[F20] Aadhaar Number of the Auditor (proprietorship)
[E21] g  |  [F21] Date of audit report
[E22] Whether the report under sub-section (3) of section 29C of the Representation of the People Act, 195[1] was furnished
[E23] 4a  |  [F23] If yes, then date of submission of the report (DD/MM/YYYY)
[E24] 4b  |  [F24] Election Commission of India or State Election Commission to whom the report has been submitted
[D25] 5a  |  [E25] Whether any voluntary contribution from any person in excess of twenty thousand rupees was received
[D26] 5b  |  [E26] If yes, Whether record of each voluntary contribution (other than contributions by way of electoral bond) was maintained
[E27] Whether any donation exceeding two thousand rupees was received otherwise than by an account payee cheque/draft/bank/electoral bond
[E28] Please furnish the following information
[E29] a  |  [F29] Total voluntary contributions received by the party during the F.Y. (b+d)
[E30] b  |  [F30] Aggregate value of all the voluntary contributions received upto Rs. 20,000 during the F.Y.
[E31] ci  |  [F31] Aggregate value of all the voluntary contributions received upto Rs. 2,000 in cash during the F.Y.
[E32] cii  |  [F32] Aggregate value of all the voluntary contributions received upto Rs. 2,000 other than in cash during the F.Y.
[E33] d  |  [F33] Aggregate value of all the voluntary contributions received more than Rs. 20,000/- during the F.Y.
(H) [D35] Statement of Income and expenditure for the previous year
(H) [E36] INCOME
(H) [E37] a  |  [F37] Fee & Subscriptions  |  [M37] 8a
(H) [E38] b  |  [F38] Grants/Donations/Contributions received
(H) [F39] i  |  [G39] Contributions received from electoral trusts as per Electoral Trust Scheme, 2013  |  [M39] 8bi
(H) [F40] ii  |  [G40] Donations received through electoral bonds  |  [M40] 8bii
(H) [F41] iii  |  [G41] Other donations  |  [M41] 8biii
(H) [F42] iv  |  [G42] Total (i + ii + iii)  |  [M42] 8biv
(H) [E43] c  |  [F43] Collection by issuing coupons  |  [M43] 8c
(H) [E44] d  |  [F44] Receipts from sale of publications  |  [M44] 8d
(H) [E45] e  |  [F45] Other income  |  [M45] 8e
(H) [E46] f  |  [F46] Total (8a + 8biv + 8c + 8d + 8e)  |  [M46] 8f
(H) [E47] EXPENDITURE
(H) [E48] a  |  [F48] Election expenditure  |  [M48] 9a
(H) [E49] b  |  [F49] Employee costs  |  [M49] 9b
(H) [E50] c  |  [F50] Administrative and General expenses  |  [M50] 9c
(H) [E51] d  |  [F51] Finance costs  |  [M51] 9d
(H) [E52] e  |  [F52] Depreciation &amortisation expenses  |  [M52] 9e
(H) [E53] f  |  [F53] Other expenses  |  [M53] 9f
(H) [E54] g  |  [F54] Total (9a + 9b + 9c + 9d + 9e + 9f)  |  [M54] 9g
(H) [E55] Excess of income over expenditure
(H) [E56] Amount eligible for exemption under section 13A
```

---

## Appendix 4 · Dropdown values (verbatim)

**Yes/No gate** — cells N7:O9, N11:O12, N22:O22, N25:O27 (`RegisterUS29A`,
`RecognizedByECI`, `BooksOfAccMaintained`, `AccountsAudited`, `ReportUs29`,
`VoluntaryContribution`, `VoluntaryContributionElecBond`, `DonExceElectoralBond`,
and the hidden N11/N12 mirrors):
```
(Select) | Yes | No
```

**`LA_Electioncommisionlist` — Election Commission list** (cell N24:O24 →
`Electioncommissionlist`), every value verbatim:
```
(Select)
Andhra Pradesh State Election Commission
Arunachal Pradesh State Election Commission
Assam State Election Commission
Bihar State Election Commission
Chhattisgarh State Election Commission
Delhi State Election Commission
Goa State Election Commission
Gujarat State Election Commission
Haryana State Election Commission
Himachal Pradesh State Election Commission
Jammu and Kashmir State Election Commission
Jharkhand State Election Commission
Karnataka State Election Commission
Kerala State Election Commission
Madhya Pradesh State Election Commission
Maharashtra State Election Commission
Manipur State Election Commission
Meghalaya State Election Commission
Mizoram State Election Commission
Nagaland State Election Commission
Odisha State Election Commission
Punjab State Election Commission
Puducherry State Election Commission
Rajasthan State Election Commission
Sikkim State Election Commission
Tamil Nadu State Election Commission
Telangana State Election Commission
Tripura State Election Commission
Uttar Pradesh State Election Commission
Uttarakhand State Election Commission
West Bengal State Election Commission
Common Election Commission for the UTs of Andaman and Nicobar Islands, Lakshadweep, Dadra & Nagar Haveli and Daman & Diu and Ladakh
Election Commission of India
```
