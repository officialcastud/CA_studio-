# The book of Part A — General · ITR-6, A.Y. 2026-27

Read row by row from the utility's **PART A - GENERAL** sheet (`sheet2.xml`,
142 rows, 19 hidden) with the hidden-row flags, dropdowns and formulas, and
confirmed against the CBDT ITR-6 schema's `PartA_GEN1` (the personal /
filing-status block) and, for the audit rows that physically live on this
sheet, `PartA_GEN2For6`. Every label, code and dropdown below is the
department's own; nothing is invented. Item numbers (A6, a1–a2iii, b–biv, c,
di–div, r) are taken from the ITR-6 validation-rules document, never from
counting rows.

> **Source split, flagged.** This is an ITR-6 (company) return, so "Part A -
> General" is not the individual's page it is on ITR-2. It carries the company's
> identity, filing status, **and the AUDIT INFORMATION table (rows 84–126)**.
> The audit rows display on *this* sheet but their schema keys sit under
> `PartA_GEN2For6` — the block `section_map.json` assigns to the **GENERAL2**
> sheet. See §8 (inconsistencies). The gate for this sheet checks only
> `PartA_GEN1`; the audit keys are documented here for completeness and to
> satisfy rule 3 (every live row must have a schema key).

---

## 1 · Why ITR-6's General is a company's page, not a person's

ITR-2 asks who the *individual* is (first/middle/last name, date of birth,
Aadhaar, passport, the nine residential conditions). ITR-6 asks who the
**company** is and then asks the questions only a company answers:

| The reason | What ITR-6 asks for it |
|---|---|
| A company has one legal name and a CIN | name, whether the name changed (old name), PAN, **Corporate Identity Number (CIN) issued by MCA** |
| A company has an incorporation date, not a birthday | date of incorporation and **date of commencement of business** (item **A6**) |
| A company is domestic or foreign | status (Public / Private) and a **Domestic?** flag; the concessional-rate sections turn on it |
| A domestic company may opt for a concessional regime | **115BA / 115BAA / 115BAB** — opted earlier, or opting this year, with Form 10-IB/10-IC/10-ID date and acknowledgment |
| A large domestic company | whether turnover in FY 2023-24 exceeded 400 crore rupees |
| A non-resident company | resident of a treaty country (s.90/90A), **Permanent Establishment (PE)**, **Significant Economic Presence (SEP)** with payments and users |
| Statutory registrations | registration under a companies law; whether financials are drawn to **Ind AS**; an **IFSC** unit; under liquidation |
| Special statuses | **FII / FPI** with SEBI number, **producer company** (s.378A), **start-up (DPIIT)**, **MSME** |
| Every company files audited accounts | the whole **AUDIT INFORMATION** block — 44AA, 44AB, 92E, other audit reports |
| A refund of ₹50 crore or more | **Legal Entity Identifier (LEI)** — item **r** |

There is no individual-only content on this sheet: no first/middle name, no
date of birth, no Aadhaar of the assessee, no passport, no 115BAC(6) individual
regime, no seventh-proviso block, no directorship/partner tables (the company's
key-persons / shareholders / ownership tables live on GENERAL2).

---

## 2 · The shape — the blocks on this sheet

| # | Block | Kind | Schema block | Always shown? |
|---|---|---|---|---|
| 1 | **Personal information** — name, CIN, PAN, dates, status, domestic | figures + ask | `PartA_GEN1.OrgFirmInfo` | yes |
| 2 | **Addresses** — primary and secondary | figures | `PartA_GEN1.OrgFirmInfo.Address` / `.AlternateAddress` | yes |
| 3 | **Communication** — email, mobile, phone, country code | figures | `PartA_GEN1.OrgFirmInfo.Address` | yes |
| 4 | **Filing** — section, notice/DIN, revised particulars, due date | ask + figures | `PartA_GEN1.FilingStatus` | yes |
| 5 | **Residential status** and treaty / PE / SEP | ask | `PartA_GEN1.FilingStatus` | yes |
| 6 | **Concessional regime** — 115BA/115BAA/115BAB | ask + figures | `PartA_GEN1.FilingStatus` | yes; domestic company |
| 7 | **Company particulars** — registration, Ind AS, IFSC, liquidation, FII/FPI, producer co, representative, start-up, LEI, MSME | mixed | `PartA_GEN1.FilingStatus` | yes; sub-forms open on Yes |
| 8 | **AUDIT INFORMATION** (a1–a2iii, b–biv, c, di–div) | ask + tables | `PartA_GEN2For6` (audit part) | yes |

---

## 3 · Block by block — the live rows

Types: **T** text, **D** date `DD/MM/YYYY`, **N** number/integer, **E** enum
(dropdown, values in §6), **F** flag Yes/No. "Item" is the rules-document
number where the rules document gives one; where it does not, the schema key is
the anchor.

### Block 1 · Personal information (rows 8–12)

| Item | Label (verbatim) | Type | Schema key |
|---|---|---|---|
| — | Name | T | `OrgFirmInfo.AssesseeName.SurNameOrOrgName` (required) |
| — | Is there any change in the company's name? If yes, please furnish the old name | T | `OrgFirmInfo.AssesseeName.OrgOldName` |
| — | PAN | T | `OrgFirmInfo.PAN` (required) |
| — | Corporate Identity Number (CIN) issued by MCA | T | `OrgFirmInfo.CINissuedByMCA` |
| — | DATE OF INCORPORATION (DD/MM/YYYY) | D | `OrgFirmInfo.DateOFFormOrIncorp` (required) |
| **A6** | DATE OF COMMENCEMENT OF BUSINESS (DD/MM/YYYY) | D | `OrgFirmInfo.DateofBusCommencement` |
| — | Status | E | `OrgFirmInfo.StatusOrCompanyType` (required) — 6-Public Company / 7-Private Company |
| — | Domestic? | E | `OrgFirmInfo.DomesticCompFlg` (required) — Yes / No |

Rule (n=20): date of commencement (A6) must not be before date of
incorporation. Rules 30–31: 115BAB / 115BA benefit turns on the DOI/DOC pair.

### Block 2 · Addresses (rows 13–34)

Sheet heading: *"Addresses to be provided for communication purposes:"*

**Primary Address** (rows 14–24):

| Label (verbatim) | Type | Schema key |
|---|---|---|
| Flat / Door / Block No | T | `OrgFirmInfo.Address.ResidenceNo` (required) |
| Name of Premises / Building / Village | T | `OrgFirmInfo.Address.ResidenceName` |
| Road / Street / Post Office | T | `OrgFirmInfo.Address.RoadOrStreet` |
| Area / Locality | T | `OrgFirmInfo.Address.LocalityOrArea` (required) |
| Town/City/District | T | `OrgFirmInfo.Address.CityOrTownOrDistrict` (required) |
| State | E | `OrgFirmInfo.Address.StateCode` (required) — 38 codes, §6 |
| Country | E | `OrgFirmInfo.Address.CountryCode` (required) — default 91-INDIA, 250 codes, §6 |
| PIN code / No ZIP Code | N | `OrgFirmInfo.Address.PinCode` |
| Zip Code | T | `OrgFirmInfo.Address.ZipCode` |

**Is the secondary address same as primary address?** (row 26) — E (Yes/No) →
`OrgFirmInfo.SecondaryAdd`. On **No**, the **Secondary Address** (rows 27–34)
opens the same nine fields into `OrgFirmInfo.AlternateAddress.*`
(`ResidenceNo` req, `ResidenceName`, `RoadOrStreet`, `LocalityOrArea` req,
`CityOrTownOrDistrict` req, `StateCode` req, `CountryCode`, `PinCode`,
`ZipCode`). Rules 40–41: secondary address is mandatory and must not equal the
primary when "No" is chosen.

### Block 3 · Communication (rows 35–38)

Sheet heading: *"Details to be provided for communication purposes:"*

| Label (verbatim) | Type | Schema key |
|---|---|---|
| Primary Email ID of the Taxpayer | T | `OrgFirmInfo.Address.EmailAddress` (required) |
| Secondary Email ID | T | `OrgFirmInfo.Address.EmailAddressSecondary` |
| Country/Region Code | N | `OrgFirmInfo.Address.CountryCodeMobile` (required) — default 91 |
| Primary Mobile no. of the Taxpayer | N | `OrgFirmInfo.Address.MobileNo` (required) |
| (secondary mobile country code / number) | N | `OrgFirmInfo.Address.CountryCodeMobileNoSec` / `.MobileNoSec` |
| STD/ISD code | N | `OrgFirmInfo.Address.Phone.STDcode` (required) |
| Office Phone Number | N | `OrgFirmInfo.Address.Phone.PhoneNo` (required) |

Rule (n=1): with country India, the mobile number must be exactly 10 digits.

### Block 4 · Filing (rows 38–44)

| Label (verbatim) | Type | Schema key |
|---|---|---|
| Due date for filing return of Income to be provided | E | `FilingStatus.ItrFilingDueDate` (required) — "31/10/2026 or extended" / "30/11/2026" |
| Filed u/s Filed in response to notice u/s | E | `FilingStatus.ReturnFileSec.IncomeTaxSec` (required) — ReturnfiledSection, §6 |
| If revised/in response to defective/Modified, then enter Receipt No | N | `FilingStatus.ReceiptNo` |
| Date of filing of Original Return (DD/MM/YYYY) | D | `FilingStatus.OrigRetFiledDate` |
| Unique number/ Document Identification number (DIN) | T | `FilingStatus.UniqueNumNoticeUs` |
| Date of such Notice or Order or if filed u/s 92CD enter date of advance pricing agreement | D | `FilingStatus.NoticeDateUnderSec` |

Row 43 header (verbatim, kept because it is the rule for the DIN pair): *"If
filed, in response to a notice u/s 139(9)/142(1)/148/153C or order under
section 119(2)(b) or order referred to in section 170A, enter unique number
/Document Identification Number (DIN) and date of such notice/Order, or if
filed u/s 92CD enter date of advance pricing agreement."* Rule 19 makes the DIN
and date mandatory in those cases; rule 12 bars revising a 139 return once a
148/153C proceeding is initiated.

### Block 5 · Residential status and treaty / PE / SEP (rows 45, 53–58)

| Label (verbatim) | Type | Schema key |
|---|---|---|
| Residential Status | E | `FilingStatus.ResidentialStatus` (required) — RES - Resident / NRI - Non-Resident |
| Whether total turnover/ gross receipts in the previous year 2023-24 exceeds 400 crore rupees? (applicable for Domestic Company ) | T | `FilingStatus.GrossReceipt` |
| Whether assesse is a resident of a Country/Region or specified territory with which India has an agreement referred to in sec 90 (1) or Central Government has adopted any agreement under sec 90A(1) | T | `FilingStatus.ResidentSec90` |
| In the case of non-resident, is there a Permanent Establishment (PE) in India? | T | `FilingStatus.NRI_PE` |
| In the case of non-resident, is there a Significant Economic Presence (SEP) in India | T | `FilingStatus.NriSEPinIndia` |
| Aggregate of payments arising from the transaction or transactions during the previous year as referred in Explanation 2A(a) to Section 9(1)(i) | N | `FilingStatus.AggrPaymentTransac` |
| Number of users in India as referred in Explanation 2A(b) to Section 9(1)(i) | N | `FilingStatus.NumberOfUsers` |

Rule 11: a domestic company cannot be a non-resident.

### Block 6 · Concessional regime 115BA/115BAA/115BAB (rows 46–52)

| Label (verbatim) | Type | Schema key | Hidden? |
|---|---|---|---|
| Whether the assesse has opted for taxation under section 115BA/115BAA/115BAB? (applicable on Domestic Company) | E | (helper for `FilingStatus.Section115BA`) | **hidden** (row 46) |
| Have you opted for taxation under section 115BA/115BAA/115BAB? (applicable on Domestic Company) | E | `FilingStatus.Section115BA` — Section 115BA / 115BAA / 115BAB / None of above |
| If yes, please furnish the AY in which said option is exercised for the first time along with date of filing of relevant form (10-IB/ 10-IC/ 10-ID) & acknowledgment number. | T | `FilingStatus.Section115BAAY` |
| Acknowledgment number (row 49) | N | `FilingStatus.ReceiptNo115BA` |
| Date of filing (row 49) | D | `FilingStatus.115BAFormFiledDate` |
| If no, whether you are choosing to opt for taxation under section 115BA/115BAA/115BAB this year? | E | `FilingStatus.Section115CurrAY` — 115BA/115BAA/115BAB/No |
| If yes, Please provide the date of filing of relevant form (10-IB/10-IC/10-ID) & acknowledgment number | E | `FilingStatus.SectionCurrAY` — 115BA/115BAA/115BAB |
| Acknowledgment number (row 52) | N | `FilingStatus.Section115CurrAYRecNo` |
| Date of filing (row 52) | D | `FilingStatus.Section115CurrAYDate` |

Rules 9–10, 15–17: a foreign company cannot claim 115BA/BAA/BAB; once opted,
the company cannot opt out in later years; selecting an option here or in the
"opt this year" field drives the mandatory sub-fields.

### Block 7 · Company particulars (rows 59–83)

| Item | Label (verbatim) | Type | Schema key | Hidden? |
|---|---|---|---|---|
| — | Whether assesse is required to seek registration under any law for the time being in force relating to companies? If yes, please provide details. | T | `FilingStatus.RegistratedLaw` | |
| — | Act under which registration required | T | `FilingStatus.ActDesc` | |
| — | Registration Number | T | `FilingStatus.ActRegNo` | |
| — | Date of registration | D | `FilingStatus.ActRegDate` | |
| — | Whether the financial statements of the company are drawn up in compliance to the Indian Accounting Standards specified in Annexure to the companies (Indian Accounting Standards) Rules, 2015 | T | `FilingStatus.FinancialStmtFlag` (required) | |
| — | Whether assessee has a unit located in an International Financial Services Centre and derives income solely in convertible foreign exchange? | T | `FilingStatus.IsIfsc` | |
| — | Whether the assessee company is under liquidation | T | `FilingStatus.UnderLiquidation` (required) | |
| — | Whether you are an FII / FPI? | E | `FilingStatus.FiiFpiFlag` (required) — Yes / No | |
| — | If yes, please provide SEBI Registration Number | T | `FilingStatus.SebiRegnNo` | |
| — | Whether the company is a producer company as defined in Sec.378A of Companies Act, 2013? | E | `FilingStatus.Sec581AFlag` (required) — Yes / No | |
| — | Whether this return is being filed by a representative assessee? If yes, please furnish following information | E | `FilingStatus.AsseseeRepFlg` (required) — Yes / No | |
| — | Name of representative assessee | T | `FilingStatus.AssesseeRep.RepName` (req on Yes) | |
| — | Email-ID of the representative | T | `FilingStatus.AssesseeRep.RepEmailID` (req on Yes) | |
| — | Contact no of the representative | N | `FilingStatus.AssesseeRep.RepMobileNo` + `.CountryCodeRepMobileNo` (req on Yes) | |
| — | Capacity of representative | E | (`Capacity.Rep`, §6) | **hidden** (row 70) |
| — | Address of representative assessee | T | — | **hidden** (row 71) |
| — | Permanent Account Number (PAN) of the representative assessee | T | — | **hidden** (row 72) |
| — | Aadhaar No. of the representative | N | — | **hidden** (row 73) |
| — | Whether you are recognized as start up by DPIIT | E | `FilingStatus.StartUpDPIITFlag` (required) — Yes / No | |
| — | If yes, please provide start up recognition number allotted by the DPIIT | T | `FilingStatus.RecgnNumAllottedByDPIIT` | |
| — | Whether certificate from inter-ministerial board for certification is received? | E | `FilingStatus.InterMinisterialCertFlag` — Yes / No | |
| — | If yes provide the certification number | T | `FilingStatus.CertificationNumber` | |
| — | Whether declaration in Form-2 in accordance with para 5 of DPIIT notification dated 19/02/2019 has been filed before filing of the return? | E | `FilingStatus.Form2AccordPara5DPIITFlag` — Yes / No | |
| — | If yes, provide date of filing Form-2 | D | `FilingStatus.DateOfFilingForm2` | |
| **r** | Legal Entity Identifier (LEI) details (mandatory if refund is 50 crores or more) | — | `FilingStatus.LEIDtls` | |
| **r** | LEI Number | T | `FilingStatus.LEIDtls.LEINumber` | |
| **r** | Valid upto date | D | `FilingStatus.LEIDtls.ValidUptoDate` | |
| — | Whether you are recognized as MSME | E | `FilingStatus.ifMSME` (required) — Yes / No | |
| — | If yes, please provide registration number allotted as per MSMED Act, 2006 | T | `FilingStatus.RegNumMSMEDAct2006` | |

Rules: n=18/39 (FII/FPI must be "Yes" to fill Schedule 115AD); n=21–22 (MSME
Yes/No mandatory, registration number mandatory on Yes); n=14 (Ind AS "No"
path); item **r** LEI mandatory if the Part B-TTI refund is ₹50 crore or more
(cross-referenced by rule n=27 of Part B-TTI).

### Block 8 · AUDIT INFORMATION (rows 84–126)

Schema keys are in **`PartA_GEN2For6`** (audit portion), not in this sheet's
own `PartA_GEN1` block — see §8.

| Item | Label (verbatim) | Type | Schema key |
|---|---|---|---|
| **a1** | Whether liable to maintain accounts as per section 44AA? (Select) | E | `LiableSec44AAflg` (required) |
| **a2** | Whether assessee is declaring income only under section 44AE/44B/44BB/44BBA/44BBB/44BBC/44BBD/44D ? | E | `IncDclrdUs` (required) |
| **a2i** | Please select the range of total sales/turnover/gross receipts of business | E | `TotalSalesExcOneCr` — a2i range, §6 |
| **a2ii** | If "More than Rs. 1 crore and up to Rs. 10 crores" option is selected at a2i, please select the percentage of amounts received in cash & non a/c payee cheque/ bank draft out of the aggregate receipts during the previous year (Note: If this percentage is more than 5%, then you are liable for audit u/s. 44AB) | E | `AgrOFAllAmtsRcvd` — Up to 5% / More than 5% |
| **a2iii** | If "More than Rs. 1 crore and up to Rs. 10 crores" option is selected at a2i, please select the percentage of payments made in cash & non a/c payee cheque/ bank draft out of the aggregate payments made during the previous year (Note: If this percentage is more than 5%, then you are liable for audit u/s. 44AB) | E | `AgrOFAllPayMade` — Up to 5% / More than 5% |
| **b** | Whether liable for audit under section 44AB? | E | `LiableSec44ABflg` (required) |
| **b** | If Yes is selected at (b), mention by virtue of which of the following conditions; | — | (helper header) |
| **bi** | bi. Sales, turnover or gross receipts exceeds the limits specified u/s 44AB | F | (Yes/No; `Cndnfor44AB`) |
| **bii** | bii. Assessee falling u/s 44BB but not opting for offering income on presumptive basis | F | (Yes/No; `Cndnfor44AB`) |
| **biii** | biii. Assessee falling u/s 44BBB but not opting for offering income on presumptive basis | F | (Yes/No; `Cndnfor44AB`) |
| **biv** | biv Others | F | (Yes/No; `Cndnfor44AB`) |
| **c** | If liable for audit u/s 44AB, whether the accounts have been audited by an accountant? If yes, furnish the following information below | E | `AuditedByAccountantFlg` |
| **c** | Date of furnishing of the audit report. (DD/MM/YYYY) | D | `AuditInfo.AuditReportFurnishDate` |
| **c** | Acknowledgement Number of Audit report | T | `AuditInfo.AckNum44AB` |
| **c** | Name of the auditor (proprietorship/ firm) | T | `AuditInfo.AudFrmName` |
| **c** | Permanent Account Number (PAN) of the auditor ( proprietorship/ firm) | T | `AuditInfo.AudFrmPAN` (required) |
| **di** | Are you liable for Audit u/s 92E? | E | `LiableSec92Eflg` (required) — (Select)/Yes/No |
| **dii** | If (di) is Yes, whether the accounts have been audited u/s. 92E? | E | `AccountAuditFlag` |
| **dii** | Date of furnishing audit report (DD/MM/YYYY) | D | `AuditDetails92E.DateOfAudit` (required) |
| **dii** | Acknowledgement Number | T | `AuditDetails92E.AckNum92E` |
| **diii** | diii. If liable to furnish other audit report under the Income-tax Act, mention whether have you furnished such report, . If yes, please provide the details as under: | — | `AuditDetails[]` |
| **diii** | Section Code | E | `AuditDetails[].AuditedSection` (req) — AuditSectionCode, §6 |
| **diii** | Other Section | T | `AuditDetails[].AnyOtherSection` |
| **diii** | Whether have you furnished such other audit report? | E | `AuditDetails[].AuditFlag` — (Select)/Yes/No |
| **diii** | Date (DD/MM/YYYY) | D | `AuditDetails[].DateOfAudit` |
| **diii** | Acknowledgement Number | T | `AuditDetails[].AckNumOth` |
| **div** | div. Mention the Act, section and date of furnishing the audit report under any Act other than the Income-tax Act | — | `AuditReportDetails[]` |
| **div** | Act | E | `AuditReportDetails[].AuditReportAct` (req) — PartAGeneralAuditRepotDrpDwns, §6 |
| **div** | Description | T | `AuditReportDetails[].AuditReportActOthers` |
| **div** | Section Code | T | `AuditReportDetails[].AuditReportSection` (req) |
| **div** | Have you got audited under the selected Act other than the Income-tax Act? | E | `AuditReportDetails[].OtherITActFlag` (req) — (Select)/Yes/No |
| **div** | Date of furnishing of the audit report | D | `AuditReportDetails[].AuditReportDate` |

Audit rules: n=3 (44AB Y + audited-by-accountant Y ⇒ auditor + report
details mandatory); n=4–5 (a2 cannot be blank; presumptive path); n=6–7, 27–29,
37 (a2i "More than 1cr up to 10cr" + a2ii/a2iii "More than 5%" ⇒ liable u/s
44AB); n=8 (date of audit report ≤ system date); n=23 (44AB Yes ⇒ Ack no.
mandatory); n=24 (92E audited ⇒ Ack no. mandatory); n=25 (diii Yes ⇒ Ack no.
mandatory); n=33–34 (30 Nov due date ⟷ audit details).

---

## 4 · Hidden rows — read, not built (rule 1)

Marked `H` in the dump; each is logged here as **hidden, not built**:

| Row | Text | Why hidden |
|---|---|---|
| 21 | Date of Commencement of Business (DD/MM/YYYY) — 31/03/2026 | superseded helper row for A6 (the live A6 is row 11) |
| 40 | *Tax payer is required to select section as "139(8A) in Part A General" while filing corrected return in response to notice u/s 139(9)…* | instruction row, 139(8A) path is the excluded `Part A Gen_139(8A)` variant |
| 46 | Whether the assesse has opted for taxation under section 115BA/115BAA/115BAB? (helper) | helper duplicate of row 47 |
| 70 | Capacity of representative | representative sub-form, hidden until "Yes" |
| 71 | Address of representative assessee | representative sub-form |
| 72 | Permanent Account Number (PAN) of the representative assessee | representative sub-form |
| 73 | Aadhaar No. of the representative | representative sub-form |
| 98 | Name of the auditor signing the tax audit report | detailed-auditor sub-form, hidden variant |
| 99 | Membership no. of the auditor | detailed-auditor sub-form |
| 101 | Proprietorship/firm registration number | detailed-auditor sub-form |
| 103 | Aadhaar No. of the Auditor | detailed-auditor sub-form |
| 104 | Date of audit report. (DD/MM/YYYY) | detailed-auditor sub-form |
| 105 | Acknowledgement Number of Audit report | detailed-auditor sub-form |
| 106 | UDIN | detailed-auditor sub-form |

The live auditor rows kept in Block 8 are 96 (date), 97 (ack no.), 100 (firm
name) and 102 (firm PAN); the hidden 98/99/101/103–106 are the expanded-auditor
variant the utility unhides only in the full audit path and are not built.

---

## 5 · Dropdown / enum lists (every value, verbatim)

**Yes/No flags** (`(Select), Yes, No`) — used at rows 12, 26, 59, 62, 63, 64,
65, 66, 74, 76, 78, 82, 84, 85, 89, 95, 107, 108, and the diii/div tables.

**Status of company** (row 12) — `(Select)`, `6-Public Company`,
`7-Private Company`.

**Domestic?** (row 12) — `(Select)`, `Yes`, `No`.

**Secondary-address helper** (`(Select), Y`) — `(Select)`, `Y`.

**Due date** (row 38) — `31/10/2026 or extended`, `30/11/2026`.

**Return filed u/s — `ReturnfiledSection`** (row 39) — `(Select)`,
`139(1)-On or before due date`, `139(4)-After due date`,
`139(5)-Revised Return`, `92CD-Modified return`,
`119(2)(b)- after condonation of delay`,
`170A- After order by the tribunal or court`. The `ReturnfiledSection2`
variant adds `139(8A)`.

**Residential Status** (row 45) — `(Select)`, `RES - Resident`,
`NRI - Non-Resident`.

**115BA/115BAA/115BAB option** (rows 46/47) — `(Select)`, `Section 115BA`,
`Section 115BAA`, `Section 115BAB`, `None of above`. The "opt this year"
variant (row 50) is `(Select)`, `Section 115BA`, `Section 115BAA`,
`Section 115BAB`, `No`; the "form filed" variant (row 51) omits the `No`.

**Capacity of representative — `Capacity.Rep`** (row 70) — `(Select)`,
`Resident Authorised Person`,
`Designated Principal Officer of State Govt/ Central Govt`,
`Agent of Non-Resident`, `Administrator General`, `Court of Wards`, `Manager`,
`Receiver`, `Others`.

**a2i sales/turnover range** (row 86) — `(Select)`, `Up to Rs. 1 crore`,
`More than Rs. 1 crore and up to Rs. 10 crores`, `More than Rs.10 crores`.

**a2ii / a2iii cash percentage** (rows 87–88) — `(Select)`, `Up to 5%`,
`More than 5%`.

**Audit section code — `AuditSectionCode`** (diii, rows 112–118) — `(Select)`,
`10AA`, `44DA`, `50B`, `80-IA`, `80-IB`, `80-IC`, `80-ID`, `80-IE`, `80-IAB`,
`80-IAC`, `80JJAA`, `80LA`, `115JB`, `115VW`, `33AB`, `33ABA`, `Rule 10TIA`,
`Any other`.

**Other-Act audit report — `PartAGeneralAuditRepotDrpDwns`** (div, rows
122–126) — `(Select)`, `Banking Regulation Act, 1949`,
`Central Excise Act,1944`, `Central Sales Tax Act, 1956`,
`Central Goods and Services Tax Act, 2017`,
`Charitable And Religious Trusts Act, 1920`, `Companies Act, 2013`,
`Electricity Act, 2003`,
`Employees Provident Fund and Miscellaneous Provisions Act, 1952`,
`Foreign Exchange Management Act, 1999`,
`Government Superannuation Fund Act, 1956`,
`Integrated Goods and Services Tax Act, 2017`, `Payment of Gratuity Act, 1972`,
`SEBI Act, 1992`, `Securities Contract (Regulation) Act, 1956`,
`State Goods and Services Tax Act, 2017`,
`Union Territories Goods and Services Tax Act, 2017`, `Others`.

### 5a · State codes (`State`, 38 values)

(Select), 01-Andaman and Nicobar islands, 02-Andhra Pradesh, 03-Arunachal Pradesh, 04-Assam, 05-Bihar, 06-Chandigarh, 07-The Dadra And Nagar Haveli And Daman And Diu, 09-Delhi, 10-Goa, 11-Gujarat, 12-Haryana, 13-Himachal Pradesh, 14-Jammu and Kashmir, 15-Karnataka, 16-Kerala, 17-Lakshadweep, 18-Madhya Pradesh, 19-Maharashtra, 20-Manipur, 21-Meghalaya, 22-Mizoram, 23-Nagaland, 24-Odisha, 25-Puducherry, 26-Punjab, 27-Rajasthan, 28-Sikkim, 29-Tamil Nadu, 30-Tripura, 31-Uttar Pradesh, 32-West Bengal, 33-Chattisgarh, 34-Uttarakhand, 35-Jharkhand, 36-Telangana, 37-Ladakh, 99-Foreign.

### 5b · Country/Region codes (`Country`, 250 values, default 91-INDIA)

(select), 93-AFGHANISTAN, 1001-ALAND ISLANDS, 355-ALBANIA, 213-ALGERIA, 684-AMERICAN SAMOA, 376-ANDORRA, 244-ANGOLA, 1264-ANGUILLA, 1010-ANTARCTICA, 1268-ANTIGUA AND BARBUDA, 54-ARGENTINA, 374-ARMENIA, 297-ARUBA, 61-AUSTRALIA, 43-AUSTRIA, 994-AZERBAIJAN, 1242-BAHAMAS, 973-BAHRAIN, 880-BANGLADESH, 1246-BARBADOS, 375-BELARUS, 32-BELGIUM, 501-BELIZE, 229-BENIN, 1441-BERMUDA, 975-BHUTAN, 591-BOLIVIA (PLURINATIONAL STATE OF), 1002-BONAIRE, SINT EUSTATIUS AND SABA, 387-BOSNIA AND HERZEGOVINA, 267-BOTSWANA, 1003-BOUVET ISLAND, 55-BRAZIL, 1014-BRITISH INDIAN OCEAN TERRITORY, 673-BRUNEI DARUSSALAM, 359-BULGARIA, 226-BURKINA FASO, 257-BURUNDI, 238-CABO VERDE, 855-CAMBODIA, 237-CAMEROON, 1-CANADA, 1345-CAYMAN ISLANDS, 236-CENTRAL AFRICAN REPUBLIC, 235-CHAD, 56-CHILE, 86-CHINA, 9-CHRISTMAS ISLAND, 672-COCOS (KEELING) ISLANDS, 57-COLOMBIA, 270-COMOROS, 242-CONGO, 243-CONGO (DEMOCRATIC REPUBLIC OF THE), 682-COOK ISLANDS, 506-COSTA RICA, 225-COTE DIVOIRE, 385-CROATIA, 53-CUBA, 1015-CURACAO, 357-CYPRUS, 420-CZECHIA, 45-DENMARK, 253-DJIBOUTI, 1767-DOMINICA, 1809-DOMINICAN REPUBLIC, 593-ECUADOR, 20-EGYPT, 503-EL SALVADOR, 240-EQUATORIAL GUINEA, 291-ERITREA, 372-ESTONIA, 251-ETHIOPIA, 500-FALKLAND ISLANDS (MALVINAS), 298-FAROE ISLANDS, 679-FIJI, 358-FINLAND, 33-FRANCE, 594-FRENCH GUIANA, 689-FRENCH POLYNESIA, 1004-FRENCH SOUTHERN TERRITORIES, 241-GABON, 220-GAMBIA, 995-GEORGIA, 49-GERMANY, 233-GHANA, 350-GIBRALTAR, 30-GREECE, 299-GREENLAND, 1473-GRENADA, 590-GUADELOUPE, 1671-GUAM, 502-GUATEMALA, 1481-GUERNSEY, 224-GUINEA, 245-GUINEA-BISSAU, 592-GUYANA, 509-HAITI, 1005-HEARD ISLAND AND MCDONALD ISLANDS, 6-HOLY SEE, 504-HONDURAS, 852-HONG KONG, 36-HUNGARY, 354-ICELAND, 91-INDIA, 62-INDONESIA, 98-IRAN (ISLAMIC REPUBLIC OF), 964-IRAQ, 353-IRELAND, 1624-ISLE OF MAN, 972-ISRAEL, 5-ITALY, 1876-JAMAICA, 81-JAPAN, 1534-JERSEY, 962-JORDAN, 7-KAZAKHSTAN, 254-KENYA, 686-KIRIBATI, 850-KOREA (DEMOCRATIC PEOPLES REPUBLIC OF), 82-KOREA (REPUBLIC OF), 965-KUWAIT, 996-KYRGYZSTAN, 856-LAO PEOPLES DEMOCRATIC REPUBLIC, 371-LATVIA, 961-LEBANON, 266-LESOTHO, 231-LIBERIA, 218-LIBYA, 423-LIECHTENSTEIN, 370-LITHUANIA, 352-LUXEMBOURG, 853-MACAO, 389-MACEDONIA (THE FORMER YUGOSLAV REPUBLIC OF), 261-MADAGASCAR, 265-MALAWI, 60-MALAYSIA, 960-MALDIVES, 223-MALI, 356-MALTA, 692-MARSHALL ISLANDS, 596-MARTINIQUE, 222-MAURITANIA, 230-MAURITIUS, 269-MAYOTTE, 52-MEXICO, 691-MICRONESIA (FEDERATED STATES OF), 373-MOLDOVA (REPUBLIC OF), 377-MONACO, 976-MONGOLIA, 382-MONTENEGRO, 1664-MONTSERRAT, 212-MOROCCO, 258-MOZAMBIQUE, 95-MYANMAR, 264-NAMIBIA, 674-NAURU, 977-NEPAL, 31-NETHERLANDS, 687-NEW CALEDONIA, 64-NEW ZEALAND, 505-NICARAGUA, 227-NIGER, 234-NIGERIA, 683-NIUE, 15-NORFOLK ISLAND, 1670-NORTHERN MARIANA ISLANDS, 47-NORWAY, 968-OMAN, 92-PAKISTAN, 680-PALAU, 970-PALESTINE, STATE OF, 507-PANAMA, 675-PAPUA NEW GUINEA, 595-PARAGUAY, 51-PERU, 63-PHILIPPINES, 1011-PITCAIRN, 48-POLAND, 14-PORTUGAL, 1787-PUERTO RICO, 974-QATAR, 262-REUNION, 40-ROMANIA, 8-RUSSIAN FEDERATION, 250-RWANDA, 1006-SAINT BARTHELEMY, 290-SAINT HELENA, ASCENSION AND TRISTAN DA CUNHA, 1869-SAINT KITTS AND NEVIS, 1758-SAINT LUCIA, 1007-SAINT MARTIN (FRENCH PART), 508-SAINT PIERRE AND MIQUELON, 1784-SAINT VINCENT AND THE GRENADINES, 685-SAMOA, 378-SAN MARINO, 239-SAO TOME AND PRINCIPE, 966-SAUDI ARABIA, 221-SENEGAL, 381-SERBIA, 248-SEYCHELLES, 232-SIERRA LEONE, 65-SINGAPORE, 1721-SINT MAARTEN (DUTCH PART), 421-SLOVAKIA, 386-SLOVENIA, 677-SOLOMON ISLANDS, 252-SOMALIA, 28-SOUTH AFRICA, 1008-SOUTH GEORGIA AND THE SOUTH SANDWICH ISLANDS, 211-SOUTH SUDAN, 35-SPAIN, 94-SRI LANKA, 249-SUDAN, 597-SURINAME, 1012-SVALBARD AND JAN MAYEN, 268-SWAZILAND, 46-SWEDEN, 41-SWITZERLAND, 963-SYRIAN ARAB REPUBLIC, 886-TAIWAN, 992-TAJIKISTAN, 255-TANZANIA, UNITED REPUBLIC OF, 66-THAILAND, 670-TIMOR-LESTE(EAST TIMOR), 228-TOGO, 690-TOKELAU, 676-TONGA, 1868-TRINIDAD AND TOBAGO, 216-TUNISIA, 90-TURKEY, 993-TURKMENISTAN, 1649-TURKS AND CAICOS ISLANDS, 688-TUVALU, 256-UGANDA, 380-UKRAINE, 971-UNITED ARAB EMIRATES, 44-UNITED KINGDOM OF GREAT BRITAIN AND NORTHERN IRELAND, 2-UNITED STATES OF AMERICA, 1009-UNITED STATES MINOR OUTLYING ISLANDS, 598-URUGUAY, 998-UZBEKISTAN, 678-VANUATU, 58-VENEZUELA (BOLIVARIAN REPUBLIC OF), 84-VIET NAM, 1284-VIRGIN ISLANDS (BRITISH), 1340-VIRGIN ISLANDS (U.S.), 681-WALLIS AND FUTUNA, 1013-WESTERN SAHARA, 967-YEMEN, 260-ZAMBIA, 263-ZIMBABWE, 9999-OTHERS.

---

## 6 · Cross-sheet feeds

**Feeds out of Part A - General:**

- `DomesticCompFlg` / `StatusOrCompanyType` → tax computation (Part B-TTI): a
  foreign company is taxed at a different rate; 115BA/115BAA/115BAB gate on
  domestic + this flag.
- `FiiFpiFlag = Yes` → unlocks **Schedule 115AD(1)(b)(iii)-Proviso** and
  Section 115AD income in Schedule SI (rules n=18, 39).
- `ResidentialStatus` → Schedule FSI / TR / FA availability; treaty relief.
- `LiableSec44ABflg`, `AuditedByAccountantFlg` → require Part A-BS / P&L to be
  filled (rule n=42) and the auditor / report particulars.
- Due date "30/11/2026" → Schedule TP / audit u/s 92E path (rules n=33–34).
- Item **r** LEI → mandatory when Part B-TTI refund ≥ ₹50 crore (Part B-TTI
  rule n=27).

**Feeds into Part A - General:** none computed; every value is entered. The
company-particulars tables (holding, subsidiary, key persons, shareholders,
ownership, foreign parent, nature of company, nature of business) that complete
`PartA_GEN2For6` are on the **GENERAL2** sheet, not here.

---

## 7 · What is mandatory, and what opens on Yes

**Always mandatory** (schema `required` on `PartA_GEN1`): name
(`SurNameOrOrgName`), PAN, date of incorporation, status, domestic flag,
flat/door, locality, city, state, country, primary email, mobile with country
code, STD/phone, filed-under section, residential status, financial-statement
(Ind AS) flag, under-liquidation flag, FII/FPI flag, producer-company flag,
representative flag, start-up (DPIIT) flag, due date, MSME flag; plus (audit,
`PartA_GEN2For6`) 44AA flag, income-declared-u/s flag, 44AB flag, 92E flag.

**Mandatory only when the switch is Yes / a condition holds:**
- revised / notice → receipt no. + original date, or DIN + notice date
- domestic + 115BA/BAA/BAB → AY, form date, acknowledgment
- FII/FPI Yes → SEBI number
- representative Yes → name, email, contact (+ hidden capacity/address/PAN/Aadhaar)
- start-up Yes → DPIIT recognition number; certificate/Form-2 sub-fields
- MSME Yes → registration number
- 44AB Yes → auditor + report acknowledgment (rules 3, 23)
- 92E audited → acknowledgment (rule 24); diii Yes → acknowledgment (rule 25)
- refund ≥ ₹50 crore → LEI (item r)

---

## 8 · Inconsistencies found between the three sources

1. **Audit rows straddle two schema blocks.** The AUDIT INFORMATION table
   (rows 84–126) is physically on the **PART A - GENERAL** sheet, but its
   schema keys are the leading fields of **`PartA_GEN2For6`**, which
   `section_map.json` maps wholly to the **GENERAL2** sheet (section "gen").
   This sheet's own block (`PartA_GEN1`) has only one audit-related leaf
   (`FilingStatus.Cndnfor44AB`). So the audit rows here have schema keys, but
   in a block not listed for this sheet. Documented above under Block 8; the
   Gate 3 check for this sheet covers only `PartA_GEN1`, so no gate conflict,
   but the section-builder must know the audit fields on this screen serialise
   into `PartA_GEN2For6`, and the GENERAL2 builder owns the same block's tables.
2. **Two "opted for 115BA…" rows** — row 46 (hidden helper) and row 47 (live)
   carry near-identical text; only row 47 is built. Similarly row 21 (hidden)
   duplicates the A6 date-of-commencement of row 11.
3. **`Cndnfor44AB` is a single schema string** but the sheet presents bi–biv as
   four separate Yes/No conditions (rows 91–94, enum `Yes,No` with no
   "(Select)"). The builder must fold the four flags into the one key.
4. **`ReturnfiledSection` vs `ReturnfiledSection2`** — the live cell (AF39) uses
   `ReturnfiledSection2`, which adds `139(8A)`; the base named range
   `ReturnfiledSection` omits it. The 139(8A) path itself is the excluded
   `Part A Gen_139(8A)` sheet, so the extra value is present in the dropdown but
   the updated-return flow is out of scope for this filing.

---

## 9 · What this means for the build

1. **Company identity drives the form.** Domestic vs foreign and the
   115BA/BAA/BAB choice set the tax rate and gate the concessional-regime
   sub-fields; a foreign company must not be offered those sections (rule 9).
2. **The audit block is the heavy part** and its data lands in
   `PartA_GEN2For6`; wire a2i→a2ii/a2iii→44AB liability exactly as rules
   6–7, 27–29, 37 state, and make 44AB Yes force the auditor and Part A-BS/P&L.
3. **Every Yes/No opens a card** — representative, FII/FPI, start-up, MSME,
   LEI, and the audit sub-tables (diii `AuditDetails[]`, div
   `AuditReportDetails[]`, both repeatable). Off contributes nothing to the
   JSON; on makes the card's required fields mandatory.
4. **Dates are `DD/MM/YYYY` everywhere** — incorporation, commencement (A6),
   original return, notice, Form 10-IB/IC/ID, Form-2, LEI validity, audit
   reports.
5. **Item numbers come from the rules document** (A6, a1–a2iii, b–biv, c,
   di–div, r); the rest are anchored on the schema key, since the rules
   document numbers only those.
