# The book of Part A — General · ITR-5, A.Y. 2026-27

Read row by row from the utility's **PART A - GENERAL** sheet (rows 3–180, of
which about a hundred carry live labels and forty-one are hidden), with the
hidden-row flags, and confirmed against the schema block **`PartA_GEN1`** (the
one block `section_map.json` maps to this sheet) plus the physically-adjacent
**`AuditInfo`** block that occupies the audit rows.

*"Part A — General"* is the return's front matter for a person who is neither an
individual, an HUF, a company, nor an ITR-7 filer — **a firm, LLP, local
authority, AOP/BOI or artificial juridical person**. It carries no money figure
of its own; it is who the assessee is (`OrgFirmInfo`), how and under what regime
the return is filed (`FilingStatus`), and the audit trail (`AuditInfo`). Its
switches drive the rest of the form: the sub-status decides which schedules
appear, the audit answers force Part A-BS / Part A-P&L to be filled, and the
tax-regime block (115BAC(6)/115BAD/115BAE, Form 10-IEA/10-IF/10-IFA) sets which
rate schedule applies.

The sheet header (r3–r6) reads **FORM · ITR-5 · INDIAN INCOME TAX RETURN**,
*"[For persons other than,- (i) individual, (ii) HUF, (iii) company and (iv)
person filing Form ITR-7]"*, *"(Please see Rule 12 of the Income
Tax-Rules,1962)"*, *"(Please refer instructions)"*.

---

## 1 · The shape — three panels

| Panel | Rows | Schema | What it holds |
|---|---|---|---|
| **PERSONAL INFORMATION** | r7–r24 | `OrgFirmInfo` | Name / old name / PAN, primary & secondary (alternate) address, phone, email, status & sub-status, date of formation |
| **FILING STATUS** | r26–r137 | `FilingStatus` | Section filed under, business-trust / 115UB flags, revised-return detail, residential status, the whole tax-regime option tree (10-IEA / 10-IF / 10-IFA, 115BAC(6) / 115BAD / 115BAE), IFSC unit, DPIIT start-up, inter-ministerial cert, MSME, non-resident PE / SEP, FII/FPI, representative assessee, partner-in-firm table, unlisted-shares table, LEI |
| **AUDIT INFORMATION** | r138–r180 | `AuditInfo` | 44AA / 44AB / presumptive flags, the 44AB condition, accountant's audit detail, 92E, other Income-tax-Act audit reports table, other-Act audits table |

The **AUDIT INFORMATION** header itself (`C138`) sits on a hidden row, but the
audit *fields* under it (r139–r180, bar a few) are live. `section_map.json` binds
only `PartA_GEN1` to this sheet; the audit fields map to the separate `AuditInfo`
block, listed here because they are physically on the sheet.

---

## 2 · The items — PERSONAL INFORMATION (`OrgFirmInfo`)

| Cell(s) | Field | Type | Schema key | Rule / note |
|---|---|---|---|---|
| E7/F8 | Name (firm/organisation name) | text ≤125 | `OrgFirmInfo.AssesseeName.SurNameOrOrgName` | required; "Surname/Org name mandatory" |
| O7 | *Is there any change in the name? If yes, please furnish the old name* | text ≤125 | `OrgFirmInfo.AssesseeName.OrgOldName` | |
| W7 | PAN | text | `OrgFirmInfo.PAN` | required |
| — | LLPIN issued by MCA | text | `OrgFirmInfo.LLPINissuedByMCA` | |
| E11/E12 | Flat/ Door/ Block No. | text ≤50 | `OrgFirmInfo.Address.ResidenceNo` | required |
| O11/O12 | Name of Premises/ Building/ Village | text ≤50 | `OrgFirmInfo.Address.ResidenceName` | |
| W11/W12 | Status | dropdown | `OrgFirmInfo.StatusOrCompanyType` | `MainStatus` (see §5) |
| AH12 | Sub-status | dropdown | `OrgFirmInfo.SubStatus` | dependent on Status |
| E13/E14 | Road / Street / Post Office | text ≤50 | `OrgFirmInfo.Address.RoadOrStreet` | |
| O13/O14 | Area / Locality | text ≤50 | `OrgFirmInfo.Address.LocalityOrArea` | required |
| W13 | Date of formation (dd/mm/yyyy) | date | `OrgFirmInfo.DateOFFormOrIncorp` | required; max 2026-03-31 |
| E15/E16 | Town/City/District | text ≤50 | `OrgFirmInfo.Address.CityOrTownOrDistrict` | required |
| O15/O16 | State | dropdown | `OrgFirmInfo.Address.StateCode` | `State` enum (see §5) |
| W15/W16 | Country | dropdown | `OrgFirmInfo.Address.CountryCode` | `Country` enum (see §5) |
| — | PIN code | integer 100000–999999 | `OrgFirmInfo.Address.PinCode` | |
| — | ZIP code | text ≤8 | `OrgFirmInfo.Address.ZipCode` | |
| — | STD code / Phone No. | integer | `OrgFirmInfo.Address.Phone.STDcode`, `OrgFirmInfo.Address.Phone.PhoneNo` | required pair |
| T24 | Primary Mobile no of the taxpayer | integer ≤10 digits | `OrgFirmInfo.Address.CountryCodeMobile`, `OrgFirmInfo.Address.MobileNo` | required |
| — | Secondary mobile | integer | `OrgFirmInfo.Address.CountryCodeMobileNoSec`, `OrgFirmInfo.Address.MobileNoSec` | |
| E24 | Primary Email Address of the taxpayer | text ≤125 | `OrgFirmInfo.Address.EmailAddress` | required; for ITR-V |
| H24 | Secondary Email Address | text ≤125 | `OrgFirmInfo.Address.EmailAddressSecondary` | |
| AQ17 | Is the secondary address same as primary address? | Yes/No | `OrgFirmInfo.SecondaryAdd` (Y/N) | |
| E19–W22 | Secondary Address: Flat/Door, Premises, Road/Street/Post office, Town/City/District, State, Country | text/dropdown | `OrgFirmInfo.AlternateAddress.*` (`ResidenceNo`, `ResidenceName`, `RoadOrStreet`, `LocalityOrArea`, `CityOrTownOrDistrict`, `StateCode`, `CountryCode`, `PinCode`, `ZipCode`) | required when second address given |
| — | Date of business commencement | date | `OrgFirmInfo.DateofBusCommencement` | |

*"Addresses to be provided for communication purposes:"* (r9), *"Primary
Address:"* (r10), *"Secondary Address:"* (r18) and *"Details to be provided for
communication purposes:"* (r23) are section captions.

---

## 3 · The items — FILING STATUS (`FilingStatus`)

| Cell(s) | Field | Type | Schema key | Rule / note |
|---|---|---|---|---|
| E26 | Due date for filing return of income | dropdown | `FilingStatus.ItrFilingDueDate` | required; `J26` list (see §5); rules A43, A55–A58 |
| AF27 | Filing status: Filed u/s / in response to notice u/s | dropdown | `FilingStatus.ReturnFileSec.IncomeTaxSec` | `FiledUnderSection12`; enum 11–20 |
| AG27 | (section in response to notice) | dropdown | `FilingStatus.ReturnFileSec.NoticeNo` / `NoticeDate` | `ReturnfiledSection` |
| E29 | Whether you are a business trust? | Yes/No | `FilingStatus.BusinessTrustFlag` | required |
| W29 | Whether you are a investment fund referred to in section 115UB? | Yes/No | `FilingStatus.InvstmntFundRefrdSec115UB` | required |
| E30 | If revised/defective/ in response to notice for Modified, then enter Receipt no. | integer | `FilingStatus.ReceiptNo` | |
| W30 | Date of filing original return (dd/mm/yyyy) | date | `FilingStatus.OrigRetFiledDate` | on/after 2026-04-01 |
| E31 | If filed, in response to a notice u/s 139(9)/142(1)/148/153C or order u/s 119(2)(b) enter unique number | text | `FilingStatus.ReturnFileSec.NoticeNo` | |
| E32 | Unique number/ Document Identification Number (DIN) | text | `FilingStatus.ReturnFileSec.NoticeNo` | |
| W32 | Date of such Notice or Order (dd/mm/yyyy) | date | `FilingStatus.ReturnFileSec.NoticeDate` | |
| W33 | Residential Status | dropdown | `FilingStatus.ResidentialStatus` | required; `RES`/`NRI` |
| F35 (d(i)) | Do you have income from business or profession for current Assessment Year? | Yes/No | `FilingStatus.IncFrmBusOrProf` | rule A58 |
| G37 (I(A)(i)) | Furnish form 10IEA acknowledgement number and assessment year (choosing old regime, earlier AY) | ack + AY | `FilingStatus.Form10IEAEarlierAYAckOldRegime`, `FilingStatus.Form10IEAAssYear` | rules A63, A71 |
| G38 | Acknowledgement Number | integer | `FilingStatus.Form10IEAEarlierAYAckOldRegime` | 15-digit |
| G39 | Assesment Year | dropdown | `FilingStatus.Form10IEAAssYear` | `AY 2024-25 / AY 2025-26` |
| I(A)(i) r36 | If answer to A19(di) is Yes, have you filed form10IEA within due date for any earlier assessment year… | Yes/No | `FilingStatus.Form10IEAEarlierAYOldRegime` | rule A71 |
| G40 (IA(ii)) | Have you re-entered new tax regime by filing form 10IEA for any assessment year subsequent… | Yes/No | `FilingStatus.F10IEAEarlierAYNewRegime` | rules A64, A72 |
| H43/H44 (A(ii)a) | Provide the acknowledgement number of second form 10IEA and assessment year… | ack + AY | `FilingStatus.Form10IEAEarlierAYAckNewRegime`, `FilingStatus.AssYrF10IEANewTaxReg` | AY 2025-26 |
| H45 (A(ii)b) | Have you furnished form 10IEA for re-entering in new tax regime in current assessment year? | Yes/No | `FilingStatus.F10IEACurrAYNewRegime` | rules A65, A66, A67 |
| H46/H47 | Date of filing of Form 10-IEA for AY 2026-27 / Provide the acknowledgement number of form 10IEA | date + ack | `FilingStatus.F10IEADateCurrAYNewTax`, `FilingStatus.F10IEAAckNoCurrAYNewTax` | |
| G48 (B) | Have you furnished form 10IEA within due date for current assessment year for choosing old tax regime? | Yes/No | `FilingStatus.F10IEACurrAYOldRegime` | rules A68, A69 |
| H49/H50 (B(i)) | Date of filing of Form 10-IEA for AY 2026-27 for Opting out of new tax regime / acknowledgement number | date + ack | `FilingStatus.F10IEADateCurrAYOldTax`, `FilingStatus.F10IEAAckNoCurrAYOldTax` | |
| F51 (II) | Do you wish to opt for old tax regime for the current Assessment Year? | Yes/No | `FilingStatus.OptOldRegimeCurrAY` | rules A51, A59, A60 |
| F76 (d(ii)) | Have you opted for new tax regime u/s 115BAD? Yes/No | Yes/No | `FilingStatus.ReturnFileSec.NewTaxRegime` / `OptingNewTaxRegime` | rule A23 |
| F78 | Assesment Year (115BAD first exercised) | dropdown | `FilingStatus.ReturnFileSec.Section115BADAY` | 2021-22…2025-26 |
| F79/F80 | Date of filing of form 10IF DD/MM/YYYY / Acknowledgement number | date + ack | `FilingStatus.ReturnFileSec.Form10IFDate`, `FilingStatus.ReturnFileSec.Form10IFAckNo` | |
| F81 (d(iii)) | If "No", Option for current assessment year — Not opting / opting in now | choice | `FilingStatus.ReturnFileSec.OptingNewTaxRegime` | |
| F82/F83/F84 | If "Opting in now" is selected, Please furnish — Date of filing of form 10IF, Acknowledgement number | date + ack | `FilingStatus.ReturnFileSec.Form10IFDate`, `Form10IFAckNo` | |
| F85 (d(iv)) | If you are a new manufacturing cooperative society, whether you were required to furnish the return… | Yes/No | `FilingStatus.115BAEReturnFiling_24_25` | rule A44 |
| F92 (a) | If the answer to d(iv) is 'yes', whether you have exercised the option u/s 115BAE of Opting of new tax regime | Yes/No | `FilingStatus.OptingTaxation115BAEYes` | |
| F93/F94/F95 | If div(a) is selected as 'Yes', please furnish date of filing of Form 10-IFA & acknowledgment number | date + ack | `FilingStatus.Form10IFADate`, `FilingStatus.Form10IFAAckNo` | |
| F96 (b) | If the answer to (div) is "No", do you wish to exercise the option u/s 115BAE of Opting of New Tax regime | Yes/No | `FilingStatus.OptingTaxation115BAENo` | |
| F97/F98/F99 | If div(b) is selected as 'Yes', please furnish date of filing of Form 10-IFA & acknowledgment number | date + ack | `FilingStatus.Form10IFADate`, `FilingStatus.Form10IFAAckNo` | |
| E100 | Whether assessee has a unit in an International Financial Services Centre and derives income solely… | Yes/No | (IFSC flag) | |
| E101 | Whether you are recognized as start up by DPIIT | Yes/No | `FilingStatus.StartUpDPIITFlag` | required |
| W101 | If yes, please provide start up recognition number allotted by the DPIIT | text ≤50 | `FilingStatus.RecgnNumAllottedByDPIIT` | |
| E102 | Whether certificate from inter-ministerial board for certification is received? | Yes/No | `FilingStatus.InterMinisterialCertFlag` | required |
| W102 | If yes, please provide the certification number | text ≤50 | `FilingStatus.CertificationNumber` | |
| E103 | Whether you are recognized as MSME ? | Yes/No | `FilingStatus.ifMSME` | required; rule A41 |
| W103 | If yes, please provide registration number allotted as per MSMED Act, 2006 | text ≤50 | `FilingStatus.RegNumMSMEDAct2006` | |
| E104 | In case of non-resident, is there a permanent establishment (PE) in India? | Yes/No | `FilingStatus.NRI_PE` | |
| E105 | In the case of non-resident, is there a Significant economic presence (SEP) in India | Yes/No/NA | `FilingStatus.NriSEPinIndia` | |
| E106 | If yes,please provide details of (a) aggregate of payments arising from the transaction or transactions | number | `FilingStatus.AggrPaymentTransac` | |
| E107 | (b) number of users in India as referred in Explanation 2A(b) to Section 9(1)(i) | number | `FilingStatus.NumberOfUsers` | |
| E108 | Whether you are an FII / FPI? | Yes/No | `FilingStatus.FiiFpiFlag` | required |
| W108 | If yes, please provide SEBI Regn. No | text ≤12 | `FilingStatus.SebiRegnNo` | |
| F109 (P) | Whether this return is being filed by a representative assessee? If yes, please furnish following information | Yes/No | `FilingStatus.AsseseeRepFlg` | required; rules A5, A6 |
| F110 | Name of representative assessee | text ≤125 | `FilingStatus.AssesseeRep.RepName` | required-if |
| F111 | Email Address of the representative assessee | text ≤125 | `FilingStatus.AssesseeRep.RepEmailID` | required-if |
| F112 | Contact Number of the representative assessee | integer | `FilingStatus.AssesseeRep.CountryCodeRepMobileNo`, `FilingStatus.AssesseeRep.RepMobileNo` | required-if |
| F117 (q) | Whether you are Partner in a firm? If yes, please furnish following information | Yes/No | `FilingStatus.PartnerInFirmFlg` | required; rule A? (at least one row mandatory) |
| F118 | Name of Firm | text ≤125 | `FilingStatus.PartnerInFirm.PartnerInFirmDtls[].NameOfFirm` | required per row |
| G118 | PAN | text | `FilingStatus.PartnerInFirm.PartnerInFirmDtls[].PAN` | required per row |
| F125 (r) | Whether you have held unlisted equity shares at any time during the previous year? If yes, please furnish | Yes/No | `FilingStatus.HeldUnlistedEqShrPrYrFlg` | required; rule A4 |
| F126 | Name of company | text ≤125 | `FilingStatus.HeldUnlistedEqShrPrYr.HeldUnlistedEqShrPrYrDtls[].NameOfCompany` | required per row |
| G126 | Type of Company | dropdown | `…HeldUnlistedEqShrPrYrDtls[].CompanyType` | `Domestic/Foreign` (D/F) |
| H126 | PAN | text | `…HeldUnlistedEqShrPrYrDtls[].PAN` | |
| I126/I127 | Opening Balance — No. of shares / Cost of acquisition | integer / number | `…OpngBalNumberOfShares`, `…OpngBalCostOfAcquisition` | required per row |
| P126/P127 | Shares acquired during the year — No. of shares | integer | `…ShrAcqDurYrNumberOfShares` | |
| T127 | Date of subscription / purchase (dd/mm/yyyy) | date | `…DateOfSubscrPurchase` | |
| W127 | Face value per share | number | `…FaceValuePerShare` | |
| — | Issue / purchase price per share, transfer no. of shares & sale consideration | number/integer | `…IssuePricePerShare`, `…PurchasePricePerShare`, `…ShrTrnfNumberOfShares`, `…ShrTrnfSaleConsideration` | |
| — | Closing balance — No. of shares / Cost of acquisition | integer / number | `…ClsngBalNumberOfShares`, `…ClsngBalCostOfAcquisition` | required per row |
| F135 (s) | Legal Entity Identifier (LEI) details (mandatory if refund is 50 Crores or more) | — | `FilingStatus.LEIDtls` | |
| F136 | LEI Number | text ≤20 | `FilingStatus.LEIDtls.LEINumber` | |
| F137 | Valid upto date | date | `FilingStatus.LEIDtls.ValidUptoDate` | |

The filing-status header row r27 reads *"Filing status: Filed u/s Filed in
response to notice u/s."*; r34 note d reads *"NOTE:- If AOP(other than
co-operative society)/ BOI/ AJP, please fill (di). If co-operative society,…"*.
Notes r124 (*"If field "Whether you are Partner in a Firm ?" is "Yes" then at
least one row is mandatory."*) and r134 (*"If field "Whether you have held
unlisted equity shares…" is "Yes"…"*) are validation prompts, not fields.

---

## 4 · The items — AUDIT INFORMATION (`AuditInfo`)

| Cell(s) | Field | Type | Schema key | Rule / note |
|---|---|---|---|---|
| F139 (a1) | Whether liable to maintain accounts as per section 44AA? | Y-Yes/N-No | `AuditInfo` (44AA flag) | rules A11, A13 |
| F140 (a2) | Whether assessee is declaring income only under section 44AD/44ADA/44AE/44B/44BB/44BBA/44BBC/44BBD? | Y-Yes/N-No | (presumptive flag) | rule A6 |
| F141 (a2i) | Please select the range of whether during the year total sales/ turnover/ gross receipts of business… | dropdown | (turnover range) | `AL141` list |
| F142 (a2ii) | Please select the percentage of amounts received in cash & non a/c payee cheque/ bank draft out of total | dropdown | (cash-receipt %) | `Up to 5% / More than 5%`; rule A45 |
| F143 (a2iii) | Please select the percentage of payments made in cash & non a/c payee cheque/ bank draft out of the total | dropdown | (cash-payment %) | `Up to 5% / More than 5%`; rule A46 |
| F144 (b) | Whether liable for audit under section 44AB? | Yes/No | (44AB flag) | rules A2, A42 |
| F145 | If Yes is selected at (b), mention by virtue of which of the following conditions; | dropdown | `Dropdown_44AB` | rule A42 |
| F149 (c) | If (b) is Yes, whether the accounts have been audited by an accountant? If Yes, furnish the following | Yes/No | (audited-by-accountant flag) | |
| F150 (i) | Date of furnishing of the audit report (DD/MM/YYYY) | date | `AuditInfo.AuditReportFurnishDate` | |
| F151 (ii) | Acknowledgement number of the audit report: | integer | `AuditInfo.AckNum44AB` | |
| F154 (iii) | Name of the auditor (proprietorship/ firm) | text ≤125 | `AuditInfo.AudFrmName` | |
| F156 (iv) | Permanent Account Number (PAN) of the auditor (proprietorship/ firm) | text | `AuditInfo.AudFrmPAN` | **required** |
| F157 | Aadhaar Number of the auditor (proprietorship) | text | `AuditInfo.AudFrmAadhaar` | |
| F160 (di) | Are you liable for Audit u/s 92E? | Yes/No | (92E flag) | rule A1 |
| F161 ((dii)a) | If (di) is Yes, whether the accounts have been audited u/s. 92E? | Yes/No | (92E audited flag) | |
| F162/F163 | Date of furnishing audit report? DD/MM/YYYY / Acknowledgement number | date + ack | (92E report) | |
| F164 (diii) | If liable to furnish other audit report under Income Tax Act, mention section code | table | (other-IT-audit table) | |
| F165–I170 | Section Code / Whether have you furnished such other audit report? / Date (dd/mm/yyyy) / Acknowledgement number | dropdown + Yes/No + date + ack | (rows) | `AuditSectionCode`, `Yes/No` |
| F173 (e) | If liable to audit under any Act other than the Income-tax Act, mention the Act, section and date of… | table | (other-Act audit table) | |
| F174–J180 | Act / Description / Section / Have you got audited under the selected Act other than the Income-tax Act? / Date | dropdown + text + Yes/No + date | (rows) | `Sheet1_Act_Dropdown`, `Yes/No` |

---

## 5 · The rules the sheet computes — with cell references

Two kinds of logic live here: **cross-schedule validations** (from
`books/ITR-5/rules.json`, category A) and **in-sheet auto-numbering / dependent
dropdowns** (from the formulas dump).

**In-sheet formulas (from `--formulas`):**

- **Serial auto-increment** — the Sl. No. columns of the three tables just count
  up: `E120 = E119+1`, `E121 = E120+1`, `E122 = E121+1` (partner-in-firm rows);
  `E130 = E129+1`, `E131 = E130+1`, `E132 = E131+1` (unlisted-shares rows);
  `E167 = E166+1` … `E170 = E169+1` (other-IT-audit rows); `E176 = E175+1` …
  `E180 = E179+1` (other-Act rows).
- **Dependent sub-status** — `AH12` (sub-status) =
  `IF(W12="1-Firm",FSS_1,IF(W12="2-Local Authority",LASS_1,IF(W12="3-AOP/BOI",AOPSS_1,IF(W12="4-AJP(Artificial Juridical Person)", AJPSS_1, Select))))`:
  the sub-status list is filtered by the Status chosen at `W12`.
- **Regime-gated ranges** — `AF81` (option for current AY) =
  `IF(OR(oldbacValue="",oldbacValue=0),RngNone,IF(oldbacValue=1,"",RngBacNo))`;
  the 44AB condition cells `AL144`/`AO144:AO148`/`AP144:AW144` =
  `IF(sheet1.IsIncmBtw1Crand5Crflg="N-No turnover exceeds 10 crores",RngYes,RngAll)`.

**Cross-schedule validations (`rules.json`, category A) that name Part A-General:**

- **A1** — "If Assessee is liable for audit u/s 92E, then Part A BS and Part A P&L can not be blank."
- **A2** — "If Assessee is liable for audit u/s 44AB, then Part A BS and Part A P&L can not be blank."
- **A4** — If "Yes" to *held unlisted equity shares*, the details table must be filled.
- **A5 / A6** — If a representative capacity is chosen in Verification, then *representative assessee* must be "Yes" and its details filled; the 44AD/44ADA/44AE/… presumptive dropdown drives audit.
- **A11 / A13** — If *maintain accounts u/s 44AA* is "No", nature of business is still mandatory; if "Yes", Part A BS and Part A P&L should be filled.
- **A14 / A29** — Status "Firm" ⇒ sub-status must be "Limited Liability Partnership" or "Partnership Firm".
- **A41** — MSME "Yes" ⇒ registration number mandatory.
- **A42** — Taxpayer must select the condition by which he is liable for audit u/s 44AB (`Dropdown_44AB`).
- **A43** — Taxpayer must select the applicable due date for filing (`ItrFilingDueDate`).
- **A44** — If Form 10-IFA filed within due date, opting for new regime u/s 115BAE is mandatory.
- **A45 / A46** — Selecting a2ii / a2iii as "more than 5%" makes you liable to audit u/s 44AB.
- **A50 / A51 / A63–A73** — the whole Form 10-IEA option tree: details required if filed, regime can be opted-out/withdrawn only if 10-IEA filed, and the earlier-year / re-entry / current-year questions gate one another.
- **A55–A58** — return cannot be filed u/s 139(1) after the due date; a 31-Oct / 30-Nov due date needs Schedule IF / 5A / audit detail; 31-Aug due date needs business income.
- **A59 / A60** — tax regime cannot be changed in a revised return filed after the original due date.

---

## 6 · Dropdowns — every value

The full value lists are in **Appendix B**; the distinct ones are:

- **`MainStatus`** (Status, `W12`) — `1-Firm`, `2-Local Authority`, `3-AOP/BOI`, `4-AJP(Artificial Juridical Person)`.
- **`State`** (`O16`, `J22`) — 38 state codes, `01-Andaman and Nicobar Islands` … `37-Ladakh`, `99-Foreign`.
- **`Country`** (`W16`, `W22`) — the 250-entry ISO list, `93-AFGHANISTAN` … `9999-OTHERS`.
- **`FiledUnderSection12`** (`AF27`) and **`ReturnfiledSection`** (`AG27`) — the sections filed under and in response to notice.
- **Regime option enums** — `Sheet1.MethodofOptONTR`, `BAC115.NY`, `BAC115.Yes_New`, `BAC115.No_New`, `BAC115.NA_New`, `BAC115.NY_2` (mostly on hidden rows).
- **Residential status** (`AL33`) — `RES-Resident`, `NRI-Non-Resident`.
- **Due date** (`J26`) — `31/07/2026 or extended`, `31/08/2026 or extended`, `31/10/2026 or extended`, `30/11/2026 or extended`.
- **Audit** — `Dropdown_44AB` (the 44AB condition), the turnover range (`AL141`), the cash-percentage `Up to 5% / More than 5%`, `AuditSectionCode` (other-IT-Act sections), `Sheet1_Act_Dropdown` (other Acts), and the `Y-Yes / N-No` and `(Select),Yes,No`, `(Select),Domestic,Foreign`, `Agent of Non-resident…` capacity list.

Dropdowns whose "source" is a bare number (e.g. `125`, `50`, `10`, `0`,
`100000000000000`) are **not enumerations** — the number is a text length / max
value, so those cells are free text or numbers, not pick-lists.

---

## 7 · What repeats and what is one figure

**Repeats (arrays, `[]` in the schema):**

- **Partner-in-firm** — `FilingStatus.PartnerInFirm.PartnerInFirmDtls[]` (r119–r122 shown; unlimited). At least one row when *Partner in a firm* = "Yes".
- **Unlisted equity shares** — `FilingStatus.HeldUnlistedEqShrPrYr.HeldUnlistedEqShrPrYrDtls[]` (r129–r132 shown; unlimited). At least one row when *held unlisted equity shares* = "Yes".
- **Other Income-tax-Act audit reports** — table r166–r170 (`AuditSectionCode` per row).
- **Other-Act audits** — table r175–r180 (`Sheet1_Act_Dropdown` per row).

**One figure each (single objects/scalars):** everything in `OrgFirmInfo`
(name, PAN, both addresses, phone, email, status/sub-status, dates) and every
scalar in `FilingStatus` (all the flags, the regime dates/ack numbers, the
representative-assessee object, the LEI object) and the audit scalars in
`AuditInfo`. There is **no monetary total** on this sheet.

---

## 8 · Mandatory — from the schema `required`

Block **`PartA_GEN1`** is required, and its required children are `OrgFirmInfo`
and `FilingStatus`. The required leaves (schema `*`, full list in Appendix C):

- `OrgFirmInfo`: `SurNameOrOrgName`, `PAN`, `DateOFFormOrIncorp`,
  `StatusOrCompanyType`; address — `ResidenceNo`, `LocalityOrArea`,
  `CityOrTownOrDistrict`, `StateCode`, `CountryCode`, `Phone.STDcode`,
  `Phone.PhoneNo`, `CountryCodeMobile`, `MobileNo`, `EmailAddress`; alternate
  address — `ResidenceNo`, `LocalityOrArea`, `CityOrTownOrDistrict`, `StateCode`.
- `FilingStatus`: `ReturnFileSec.IncomeTaxSec`, `BusinessTrustFlag`,
  `InvstmntFundRefrdSec115UB`, `ResidentialStatus`, `ForeignExchangeFlag`,
  `StartUpDPIITFlag`, `InterMinisterialCertFlag`, `ifMSME`, `FiiFpiFlag`,
  `AsseseeRepFlg`, `PartnerInFirmFlg`, `HeldUnlistedEqShrPrYrFlg`,
  `ItrFilingDueDate`; when the matching flag is "Yes", the row-level keys become
  required — `AssesseeRep.RepName / RepEmailID / CountryCodeRepMobileNo /
  RepMobileNo`; `PartnerInFirmDtls[].NameOfFirm / PAN`;
  `HeldUnlistedEqShrPrYrDtls[].NameOfCompany / CompanyType /
  OpngBalNumberOfShares / OpngBalCostOfAcquisition / ClsngBalNumberOfShares /
  ClsngBalCostOfAcquisition`.
- `AuditInfo` (adjacent block): `AudFrmPAN` is required.

---

## 9 · Hidden rows — not built

These rows carry the `H` flag in the dump. **Do not build them as items.** Most
are the collapsed AY-2024-25 / AY-2025-26 branches of the 115BAC(6) opt-out tree
(superseded by the live 10-IEA questions above), the collapsed 10-IFA sub-rows,
the representative-assessee extra fields, and a few audit sub-lines the utility
keeps hidden.

- r28 — note: *"Tax payer is required to select section as "139(8A) in Part A General" while filing corrected return"*
- r42 — Date of filing of Form 10-IEA for AY 2026-27
- r52 — d(i)1: Method of opting-out of new tax regime (10-IEA vs return-only) — `Sheet1.MethodofOptONTR`
- r53 — Have you exercised the option u/s 115BAC(6)… in Form 10-IEA in A.Y 2024-25 — `BAC115.NY`
- r54–r56 — (a) note + Date/Acknowledgement of form 10-IEA for AY 2024-25
- r57–r60 — (i) continue to opt out (AY 2024-25 branch) + date/ack for AY 2025-26 — `BAC115.Yes_New`
- r61–r65 — (b) note + opt out (AY 2025-26 branch) + date/ack — `BAC115.No_New`
- r66–r70 — (c) N/A for AY 2024-25 branch + opt out + date/ack — `BAC115.NA_New`
- r71–r75 — exercise option u/s 115BAC(6) (default "No") + notes + date/ack — `BAC115.NY_2`
- r86–r91 — 10-IFA date/ack and "opting in now" sub-lines for d(iv)
- r113–r116 — representative assessee: (b) Capacity `W113`, (c) Address, (d) PAN, (e) Aadhaar No.
- r138 — the **AUDIT INFORMATION** header + due-date note (`AL138` Yes/No)
- r152 — Name of the auditor signing the tax audit report
- r153 — Membership no. of the auditor (`W153`)
- r155 — Proprietorship/firm registration number
- r158 — Date of Audit Report (dd/mm/yyyy)
- r159 — UDIN

(The representative *Capacity* dropdown `W113` and the several `BAC115.*` /
`MethodofOptONTR` enums live on these hidden rows; their values are still listed
in Appendix B because the utility carries them, but the rows are not built.)

---

## 10 · What this means for the build

- Build **three panels** into `OrgFirmInfo` + `FilingStatus` + `AuditInfo`.
  Only `PartA_GEN1` is bound to this sheet in `section_map.json`; wire the audit
  fields into the `AuditInfo` block that the schema keeps separate.
- The **Status → Sub-status** dropdown is dependent (`AH12` formula) — filter
  the sub-status list on the Status pick, and enforce A14/A29 (Firm ⇒ LLP or
  Partnership Firm).
- The **tax-regime tree** is the hard part: the live questions are the 10-IEA
  earlier-year / re-entry / current-year set (d(i), I(A), IA(ii), B, II),
  115BAD (d(ii)/d(iii)) and 115BAE (d(iv)). The AY-2024-25/2025-26 115BAC(6)
  ladder is hidden — do not surface it. Gate the ack/date sub-fields on their
  parent "Yes" per rules A50–A73, and block a regime change in a late revised
  return (A59/A60).
- The **four tables** (partner-in-firm, unlisted shares, other-IT-audit,
  other-Act) are arrays with auto-incrementing Sl. No.; enforce "≥1 row when the
  flag is Yes" (partner A?, unlisted A4).
- The **audit answers** are load-bearing across the form: 44AA/44AB/92E force
  Part A-BS and Part A-P&L (A1/A2/A13); a2ii/a2iii "more than 5%" force 44AB
  liability (A45/A46); the 44AB condition and the due date must be picked
  (A42/A43).
- **No figure** flows out of this sheet — nothing to total; the correctness here
  is *consistency of switches*, not arithmetic.

## Appendix A — every live row label, verbatim

These are the labels the utility prints on the live (non-hidden) rows of the sheet, quoted exactly from `tools/dump.py` output. Each is an item the build must carry.

- INDIAN INCOME TAX RETURN
- [For persons other than,- (i) individual, (ii) HUF, (iii) company and (iv) person filing Form ITR-7]
- (Please see Rule 12 of the Income Tax-Rules,1962)
- (Please refer instructions)
- PERSONAL INFORMATION
- Is there any change in the name? If yes, please furnish the old name
- Addresses to be provided for communication purposes:
- Primary Address:
- Flat/ Door/ Block No.
- Name of Premises/ Building/ Village
- Road / Street / Post Office
- Area / Locality
- Date of formation (dd/mm/yyyy)
- Town/City/District
- Is the secondary address same as primary address?
- Secondary Address:
- Name of Premises / Building / Village
- Road/ Street/Post office
- Town/ City/ District
- Details to be provided for communication purposes:
- Primary Email Address of the taxpayer
- Secondary Email Address
- Primary Mobile no of the taxpayer
- FILING STATUS
- Due date for filing return of income
- Filing status: Filed u/s Filed in response to notice u/s.
- Whether you are a business trust?
- Whether you are a investment fund referred to in section 115UB?
- If revised/defective/ in response to notice for Modified, then enter Receipt no.
- Date of filing original return (dd/mm/yyyy)
- If filed, in response to a notice u/s 139(9)/142(1)/148/153C or order u/s 119(2)(b) enter unique num
- Unique number/ Document Identification Number (DIN)
- Date of such Notice or Order (dd/mm/yyyy)
- Residential Status
- NOTE:- If AOP(other than co-operative society)/ BOI/ AJP, please fill (di). If co-operative society,
- Do you have income from business or profession for current Assessment Year?
- If answer to A19(di) is Yes, have you filed form10IEA within due date for any earlier assessment yea
- Furnish form 10IEA acknowledgement number and assessment year for which this form for choosing old t
- Acknowledgement Number
- Assesment Year
- Have you re-entered new tax regime by filing form 10IEA for any assessment year subsequent to assess
- Provide the acknowledgement number of second form 10IEA and assessment year for which this form for
- Have you furnished form 10IEA for re-entering in new tax regime in current assessment year?
- Date of filing of Form 10-IEA for AY 2026-27
- Provide the acknowledgement number of form 10IEA
- Have you furnished form 10IEA within due date for current assessment year for choosing old tax regim
- Date of filing of Form 10-IEA for AY 2026-27 for Opting out of new tax regime
- Do you wish to opt for old tax regime for the current Assessment Year?
- Have you opted for new tax regime u/s 115BAD?  Yes  No
- If yes, please furnish the AY in which said option is exercised for the first time along with date o
- Date of filing of form 10IF DD/MM/YYYY
- Acknowledgement number
- If “No”, Option for current assessment year Not opting opting in now.
- If "Opting in now" is selected, Please furnish
- If you are a new manufacturing cooperative society, whether you were required to furnish the return
- If the answer to d(iv) is 'yes', whether you have exercised the option u/s 115BAE of Opting of new t
- If div(a) is selected as ‘Yes’, please furnish date of filing of Form 10-IFA & acknowledgment number
- Date of filing of form 10IFA
- If the answer to (div) is “No”, do you wish to exercise the option u/s 115BAE of Opting of New Tax r
- If div(b) is selected as ‘Yes’, please furnish date of filing of Form 10-IFA & acknowledgment number
- Whether assessee has a unit in an International Financial Services Centre and derives income solely
- Whether you are recognized as start up by DPIIT
- If yes, please provide start up recognition number allotted by the DPIIT
- Whether certificate from inter-ministerial board for certification is received?
- If yes, please provide the certification number
- Whether you are recognized as MSME ?
- If yes, please provide registration number allotted as per MSMED Act, 2006
- In case of non-resident, is there a permanent establishment (PE) in India?
- In the case of non-resident, is there a Significant economic presence (SEP) in India
- If yes,please provide details of (a) aggregate of payments arising from the transaction or transacti
- (b) number of users in India as referred in Explanation 2A(b) to Section 9(1)(i)
- Whether you are an FII / FPI?
- If yes, please provide SEBI Regn. No
- Whether this return is being filed by a representative assessee? If yes, please furnish following in
- Name of representative assessee
- Email Address of the representative assessee
- Contact Number of the representative assessee
- Whether you are Partner in a firm? If yes, please furnish following information
- Name of Firm
- If field "Whether you are Partner in a Firm ?" is "Yes" then at least one row is mandatory.
- Whether you have held unlisted equity shares at any time during the previous year? If yes, please fu
- Name of company
- Type of Company
- Opening Balance
- Shares acquired during the year
- No. of shares
- Cost of acquisition
- Date of subscription / purchase (dd/mm/yyyy)
- Face value per share
- If field "Whether you have held unlisted equity shares at any time during the previous year? " is "Y
- Legal Entity Identifier (LEI) details (mandatory if refund is 50 Crores or more)
- Valid upto date
- Whether liable to maintain accounts as per section 44AA?
- Whether assessee is declaring income only under section 44AD/44ADA/44AE/44B/44BB/44BBA/44BBC/44BBD?
- Please select the range of whether during the year total sales/ turnover/ gross receipts of business
- Please select the percentage of amounts received in cash & non a/c payee cheque/ bank draft out of t
- Please select the percentage of payments made in cash & non a/c payee cheque/ bank draft out of the
- Whether liable for audit under section 44AB?
- If Yes is selected at (b), mention by virtue of which of the following conditions;
- If (b) is Yes, whether the accounts have been audited by an accountant? If Yes, furnish the followin
- Date of furnishing of the audit report (DD/MM/YYYY)
- Acknowledgement number of the audit report:
- Name of the auditor (proprietorship/ firm)
- Permanent Account Number (PAN) of the auditor (proprietorship/ firm)
- Aadhaar Number of the auditor (proprietorship)
- Are you liable for Audit u/s 92E?
- If (di) is Yes, whether the accounts have been audited u/s. 92E?
- Date of furnishing audit report? DD/MM/YYYY
- If liable to furnish other audit report under Income Tax Act, mention section code(Please see Instru
- Section Code
- Whether have you furnished such other audit report?
- Date (dd/mm/yyyy)
- If liable to audit under any Act other than the Income-tax Act, mention the Act, section and date of
- Have you got audited under the selected Act other than the Income-tax Act?

## Appendix B — dropdown values in full


**`AuditSectionCode`** (cells `F166:F170`):
`(Select)`, `10A`, `10AA`, `44DA`, `50B`, `80-IA`, `80-IAB`, `80-IAC`, `80-IB`, `80-ID`, `80-IE`, `80JJAA`, `80LA`, `115JC`, `10(23FF)`, `10(4D)`

**`"(Select),Y-Yes,N-No"`** (cells `AL139:AL140 AL149`):
`(Select)`, `Y-Yes`, `N-No`

**`MainStatus`** (cells `W12:AG12`):
`(Select)`, `1-Firm`, `2-Local Authority`, `3-AOP/BOI`, `4-AJP(Artificial Juridical Person)`

**`"(Select),Y"`** (cells `AQ15:AW15`):
`(Select)`, `Y`

**`"(Select),Yes,No"`** (cells `AL29:AW29 AL109:AW109 AL117:AW117 AL125:AW125 AL100:AW100 J29:V29 AM104:AW104 AL104:AL105`):
`(Select)`, `Yes`, `No`

**`"(Select),Agent of Non-resident,Court of Wards,Administrator General,Official Trustee,Manager,Receiver,Others"`** (cells `W113:AW113`):
`(Select)`, `Agent of Non-resident`, `Court of Wards`, `Administrator General`, `Official Trustee`, `Manager`, `Receiver`, `Others`

**`State`** (cells `O16:V16`):
`(Select)`, `01-Andaman and Nicobar Islands`, `02-Andhra Pradesh`, `03-Arunachal Pradesh`, `04-Assam`, `05-Bihar`, `06-Chandigarh`, `07-Dadra Nagar and Haveli`, `08-Daman and Diu`, `09-Delhi`, `10-Goa`, `11-Gujarat`, `12-Haryana`, `13-Himachal Pradesh`, `14-Jammu and Kashmir`, `15-Karnataka`, `16-Kerala`, `17-Lakshadweep`, `18-Madhya Pradesh`, `19-Maharashtra`, `20-Manipur`, `21-Meghalaya`, `22-Mizoram`, `23-Nagaland`, `24-Odisha`, `25-Puducherry`, `26-Punjab`, `27-Rajasthan`, `28-Sikkim`, `29-Tamil Nadu`, `30-Tripura`, `31-Uttar Pradesh`, `32-West Bengal`, `33-Chhattisgarh`, `34-Uttarakhand`, `35-Jharkhand`, `36-Telangana`, `37-Ladakh`, `99-Foreign`

**`Country`** (cells `W16:AG16`):
`(select)`, `93-AFGHANISTAN`, `1001-ALAND ISLANDS`, `355-ALBANIA`, `213-ALGERIA`, `684-AMERICAN SAMOA`, `376-ANDORRA`, `244-ANGOLA`, `1264-ANGUILLA`, `1010-ANTARCTICA`, `1268-ANTIGUA AND BARBUDA`, `54-ARGENTINA`, `374-ARMENIA`, `297-ARUBA`, `61-AUSTRALIA`, `43-AUSTRIA`, `994-AZERBAIJAN`, `1242-BAHAMAS`, `973-BAHRAIN`, `880-BANGLADESH`, `1246-BARBADOS`, `375-BELARUS`, `32-BELGIUM`, `501-BELIZE`, `229-BENIN`, `1441-BERMUDA`, `975-BHUTAN`, `591-BOLIVIA (PLURINATIONAL STATE OF)`, `1002-BONAIRE, SINT EUSTATIUS AND SABA`, `387-BOSNIA AND HERZEGOVINA`, `267-BOTSWANA`, `1003-BOUVET ISLAND`, `55-BRAZIL`, `1014-BRITISH INDIAN OCEAN TERRITORY`, `673-BRUNEI DARUSSALAM`, `359-BULGARIA`, `226-BURKINA FASO`, `257-BURUNDI`, `238-CABO VERDE`, `855-CAMBODIA`, `237-CAMEROON`, `1-CANADA`, `1345-CAYMAN ISLANDS`, `236-CENTRAL AFRICAN REPUBLIC`, `235-CHAD`, `56-CHILE`, `86-CHINA`, `9-CHRISTMAS ISLAND`, `672-COCOS (KEELING) ISLANDS`, `57-COLOMBIA`, `270-COMOROS`, `242-CONGO`, `243-CONGO (DEMOCRATIC REPUBLIC OF THE)`, `682-COOK ISLANDS`, `506-COSTA RICA`, `225-COTE DIVOIRE`, `385-CROATIA`, `53-CUBA`, `1015-CURACAO`, `357-CYPRUS`, `420-CZECHIA`, `45-DENMARK`, `253-DJIBOUTI`, `1767-DOMINICA`, `1809-DOMINICAN REPUBLIC`, `593-ECUADOR`, `20-EGYPT`, `503-EL SALVADOR`, `240-EQUATORIAL GUINEA`, `291-ERITREA`, `372-ESTONIA`, `251-ETHIOPIA`, `500-FALKLAND ISLANDS (MALVINAS)`, `298-FAROE ISLANDS`, `679-FIJI`, `358-FINLAND`, `33-FRANCE`, `594-FRENCH GUIANA`, `689-FRENCH POLYNESIA`, `1004-FRENCH SOUTHERN TERRITORIES`, `241-GABON`, `220-GAMBIA`, `995-GEORGIA`, `49-GERMANY`, `233-GHANA`, `350-GIBRALTAR`, `30-GREECE`, `299-GREENLAND`, `1473-GRENADA`, `590-GUADELOUPE`, `1671-GUAM`, `502-GUATEMALA`, `1481-GUERNSEY`, `224-GUINEA`, `245-GUINEA-BISSAU`, `592-GUYANA`, `509-HAITI`, `1005-HEARD ISLAND AND MCDONALD ISLANDS`, `6-HOLY SEE`, `504-HONDURAS`, `852-HONG KONG`, `36-HUNGARY`, `354-ICELAND`, `91-INDIA`, `62-INDONESIA`, `98-IRAN (ISLAMIC REPUBLIC OF)`, `964-IRAQ`, `353-IRELAND`, `1624-ISLE OF MAN`, `972-ISRAEL`, `5-ITALY`, `1876-JAMAICA`, `81-JAPAN`, `1534-JERSEY`, `962-JORDAN`, `7-KAZAKHSTAN`, `254-KENYA`, `686-KIRIBATI`, `850-KOREA (DEMOCRATIC PEOPLES REPUBLIC OF)`, `82-KOREA (REPUBLIC OF)`, `965-KUWAIT`, `996-KYRGYZSTAN`, `856-LAO PEOPLES DEMOCRATIC REPUBLIC`, `371-LATVIA`, `961-LEBANON`, `266-LESOTHO`, `231-LIBERIA`, `218-LIBYA`, `423-LIECHTENSTEIN`, `370-LITHUANIA`, `352-LUXEMBOURG`, `853-MACAO`, `389-MACEDONIA (THE FORMER YUGOSLAV REPUBLIC OF)`, `261-MADAGASCAR`, `265-MALAWI`, `60-MALAYSIA`, `960-MALDIVES`, `223-MALI`, `356-MALTA`, `692-MARSHALL ISLANDS`, `596-MARTINIQUE`, `222-MAURITANIA`, `230-MAURITIUS`, `269-MAYOTTE`, `52-MEXICO`, `691-MICRONESIA (FEDERATED STATES OF)`, `373-MOLDOVA (REPUBLIC OF)`, `377-MONACO`, `976-MONGOLIA`, `382-MONTENEGRO`, `1664-MONTSERRAT`, `212-MOROCCO`, `258-MOZAMBIQUE`, `95-MYANMAR`, `264-NAMIBIA`, `674-NAURU`, `977-NEPAL`, `31-NETHERLANDS`, `687-NEW CALEDONIA`, `64-NEW ZEALAND`, `505-NICARAGUA`, `227-NIGER`, `234-NIGERIA`, `683-NIUE`, `15-NORFOLK ISLAND`, `1670-NORTHERN MARIANA ISLANDS`, `47-NORWAY`, `968-OMAN`, `92-PAKISTAN`, `680-PALAU`, `970-PALESTINE, STATE OF`, `507-PANAMA`, `675-PAPUA NEW GUINEA`, `595-PARAGUAY`, `51-PERU`, `63-PHILIPPINES`, `1011-PITCAIRN`, `48-POLAND`, `14-PORTUGAL`, `1787-PUERTO RICO`, `974-QATAR`, `262-REUNION`, `40-ROMANIA`, `8-RUSSIAN FEDERATION`, `250-RWANDA`, `1006-SAINT BARTHELEMY`, `290-SAINT HELENA, ASCENSION AND TRISTAN DA CUNHA`, `1869-SAINT KITTS AND NEVIS`, `1758-SAINT LUCIA`, `1007-SAINT MARTIN (FRENCH PART)`, `508-SAINT PIERRE AND MIQUELON`, `1784-SAINT VINCENT AND THE GRENADINES`, `685-SAMOA`, `378-SAN MARINO`, `239-SAO TOME AND PRINCIPE`, `966-SAUDI ARABIA`, `221-SENEGAL`, `381-SERBIA`, `248-SEYCHELLES`, `232-SIERRA LEONE`, `65-SINGAPORE`, `1721-SINT MAARTEN (DUTCH PART)`, `421-SLOVAKIA`, `386-SLOVENIA`, `677-SOLOMON ISLANDS`, `252-SOMALIA`, `28-SOUTH AFRICA`, `1008-SOUTH GEORGIA AND THE SOUTH SANDWICH ISLANDS`, `211-SOUTH SUDAN`, `35-SPAIN`, `94-SRI LANKA`, `249-SUDAN`, `597-SURINAME`, `1012-SVALBARD AND JAN MAYEN`, `268-SWAZILAND`, `46-SWEDEN`, `41-SWITZERLAND`, `963-SYRIAN ARAB REPUBLIC`, `886-TAIWAN, PROVINCE OF CHINA[A]`, `992-TAJIKISTAN`, `255-TANZANIA, UNITED REPUBLIC OF`, `66-THAILAND`, `670-TIMOR-LESTE(EAST TIMOR)`, `228-TOGO`, `690-TOKELAU`, `676-TONGA`, `1868-TRINIDAD AND TOBAGO`, `216-TUNISIA`, `90-TURKEY`, `993-TURKMENISTAN`, `1649-TURKS AND CAICOS ISLANDS`, `688-TUVALU`, `256-UGANDA`, `380-UKRAINE`, `971-UNITED ARAB EMIRATES`, `44-UNITED KINGDOM OF GREAT BRITAIN AND NORTHERN IRELAND`, `2-UNITED STATES OF AMERICA`, `1009-UNITED STATES MINOR OUTLYING ISLANDS`, `598-URUGUAY`, `998-UZBEKISTAN`, `678-VANUATU`, `58-VENEZUELA (BOLIVARIAN REPUBLIC OF)`, `84-VIET NAM`, `1284-VIRGIN ISLANDS (BRITISH)`, `1340-VIRGIN ISLANDS (U.S.)`, `681-WALLIS AND FUTUNA`, `1013-WESTERN SAHARA`, `967-YEMEN`, `260-ZAMBIA`, `263-ZIMBABWE`, `9999-OTHERS`

**`ReturnfiledSection`** (cells `AG27:AW27`):
`(Select)`, `139(1)-On or before due date`, `139(4)-Belated`, `142(1)`, `148`, `153A`, `153C`, `139(5)-Revised`, `139(9)`, `92CD-Modified return`, `119(2)(b)- After condonation of delay`

**`"(Select),Domestic,Foreign"`** (cells `G129:G132`):
`(Select)`, `Domestic`, `Foreign`

**`"(Select),Up to Rs. 1 crore, More than Rs. 1 crore and up to Rs. 10 crores, More than Rs. 10 crores"`** (cells `AL141:AW141`):
`(Select)`, `Up to Rs. 1 crore`, `More than Rs. 1 crore and up to Rs. 10 crores`, `More than Rs. 10 crores`

**`"(Select),2021-22,2022-23,2023-24,2024-25,2025-26"`** (cells `AF78:AW78`):
`(Select)`, `2021-22`, `2022-23`, `2023-24`, `2024-25`, `2025-26`

**`"No,Yes-within due date,Yes-but beyond due date"`** (cells `AF73:AW73`):
`No`, `Yes-within due date`, `Yes-but beyond due date`

**`"Yes,No"`** (cells `AL138:AW138`):
`Yes`, `No`

**`"31/07/2026 or extended,31/08/2026 or extended,31/10/2026 or extended,30/11/2026 or extended"`** (cells `J26:S26`):
`31/07/2026 or extended`, `31/08/2026 or extended`, `31/10/2026 or extended`, `30/11/2026 or extended`

**`Dropdown_44AB`** (cells `AL145:AN148`):
`bi.Sales, turnover or gross receipts exceeds the specified limits`, `bii.Assessee falling u/s 44AD/44ADA/44AE/44BB but not opting for offering income on presumptive basis`, `biii.Other`

**`Sheet1_Act_Dropdown`** (cells `T26:AW26`):
`(Select)`, `Banking Regulation Act, 1949`, `Central Excise Act,1944`, `Central Sales Tax Act, 1956`, `Central Goods and Services Tax Act, 2017`, `Charitable And Religious Trusts Act, 1920`, `Electricity Act, 2003`, `Employees Provident Fund and Miscellaneous Provisions Act, 1952`, `Foreign Exchange Management Act, 1999`, `Government Superannuation Fund Act, 1956`, `Indian Trusts Act, 1882`, `Integrated Goods and Services Tax Act, 2017`, `Limited Liability Partnership Act, 2008`, `Payment of Gratuity Act, 1972`, `SEBI Act, 1992`, `Securities Contract (Regulation) Act, 1956`, `State Goods and Services Tax Act, 2017`, `Union Territories Goods and Services Tax Act, 2017`, `Others`

**`Sheet1.MethodofOptONTR`** (cells `AL52 AM52:AW52`):
`(Select)`, `by filing 10IEA (having income from business or profession)`, `by exercising the option in the return of income only (form 10IEA is not applicable)`

**`BAC115.NY`** (cells `AL53:AW53`):
`(Select)`, `No`, `Yes`, `Not Applicable`

**`BAC115.Yes_New`** (cells `AL57:AW57`):
`(Select)`, `No`, `Yes`

**`"(Select),Up to 5%,More than 5%"`** (cells `AL142:AW143`):
`(Select)`, `Up to 5%`, `More than 5%`

**`"No,Yes"`** (cells `AF85:AW85`):
`No`, `Yes`

**`"(Select),AY 2024-25 ,AY 2025-26"`** (cells `AL39:AW39`):
`(Select)`, `AY 2024-25`, `AY 2025-26`

**`"(Select),AY 2025-26"`** (cells `AL44:AW44`):
`(Select)`, `AY 2025-26`

**`FiledUnderSection12`** (cells `AF27`):
`(Select)`, `139(1)-On or before due date`, `139(4)-Belated`, `139(5)-Revised`, `92CD-Modified return`, `119(2)(b)- After condonation of delay`, `139(8A)-Updated return`

**`"(Select),RES-Resident,NRI-Non-Resident"`** (cells `AL33:AW33`):
`(Select)`, `RES-Resident`, `NRI-Non-Resident`

## Appendix C — every schema leaf of `PartA_GEN1`, verbatim

`*` marks a leaf the schema marks required.

- * `OrgFirmInfo.AssesseeName.SurNameOrOrgName` — string
-   `OrgFirmInfo.AssesseeName.OrgOldName` — string
- * `OrgFirmInfo.PAN` — string
-   `OrgFirmInfo.LLPINissuedByMCA` — string
- * `OrgFirmInfo.Address.ResidenceNo` — string
-   `OrgFirmInfo.Address.ResidenceName` — string
-   `OrgFirmInfo.Address.RoadOrStreet` — string
- * `OrgFirmInfo.Address.LocalityOrArea` — string
- * `OrgFirmInfo.Address.CityOrTownOrDistrict` — string
- * `OrgFirmInfo.Address.StateCode` — string
- * `OrgFirmInfo.Address.CountryCode` — string
-   `OrgFirmInfo.Address.PinCode` — integer
-   `OrgFirmInfo.Address.ZipCode` — string
- * `OrgFirmInfo.Address.Phone.STDcode` — integer
- * `OrgFirmInfo.Address.Phone.PhoneNo` — integer
- * `OrgFirmInfo.Address.CountryCodeMobile` — integer
- * `OrgFirmInfo.Address.MobileNo` — integer
-   `OrgFirmInfo.Address.CountryCodeMobileNoSec` — integer
-   `OrgFirmInfo.Address.MobileNoSec` — integer
- * `OrgFirmInfo.Address.EmailAddress` — string
-   `OrgFirmInfo.Address.EmailAddressSecondary` — string
-   `OrgFirmInfo.SecondaryAdd` — string
- * `OrgFirmInfo.AlternateAddress.ResidenceNo` — string
-   `OrgFirmInfo.AlternateAddress.ResidenceName` — string
-   `OrgFirmInfo.AlternateAddress.RoadOrStreet` — string
- * `OrgFirmInfo.AlternateAddress.LocalityOrArea` — string
- * `OrgFirmInfo.AlternateAddress.CityOrTownOrDistrict` — string
- * `OrgFirmInfo.AlternateAddress.StateCode` — string
-   `OrgFirmInfo.AlternateAddress.CountryCode` — string
-   `OrgFirmInfo.AlternateAddress.PinCode` — integer
-   `OrgFirmInfo.AlternateAddress.ZipCode` — string
- * `OrgFirmInfo.DateOFFormOrIncorp` — string
-   `OrgFirmInfo.DateofBusCommencement` — string
- * `OrgFirmInfo.StatusOrCompanyType` — string
-   `OrgFirmInfo.SubStatus` — string
- * `FilingStatus.ReturnFileSec.IncomeTaxSec` — integer
-   `FilingStatus.ReturnFileSec.NoticeNo` — string
-   `FilingStatus.ReturnFileSec.NoticeDate` — string
-   `FilingStatus.ReturnFileSec.NewTaxRegime` — string
-   `FilingStatus.ReturnFileSec.OptingNewTaxRegime` — integer
-   `FilingStatus.ReturnFileSec.Section115BADAY` — string
-   `FilingStatus.ReturnFileSec.Form10IFDate` — string
-   `FilingStatus.ReturnFileSec.Form10IFAckNo` — integer
-   `FilingStatus.IncFrmBusOrProf` — string
-   `FilingStatus.Form10IEAAssYear` — string
-   `FilingStatus.Form10IEAEarlierAYOldRegime` — string
-   `FilingStatus.Form10IEAEarlierAYAckOldRegime` — integer
-   `FilingStatus.F10IEAEarlierAYNewRegime` — string
-   `FilingStatus.AssYrF10IEANewTaxReg` — string
-   `FilingStatus.Form10IEAEarlierAYAckNewRegime` — integer
-   `FilingStatus.F10IEACurrAYNewRegime` — string
-   `FilingStatus.F10IEADateCurrAYNewTax` — string
-   `FilingStatus.F10IEAAckNoCurrAYNewTax` — integer
-   `FilingStatus.F10IEACurrAYOldRegime` — string
-   `FilingStatus.F10IEADateCurrAYOldTax` — string
-   `FilingStatus.F10IEAAckNoCurrAYOldTax` — integer
-   `FilingStatus.OptOldRegimeCurrAY` — string
- * `FilingStatus.BusinessTrustFlag` — string
- * `FilingStatus.InvstmntFundRefrdSec115UB` — string
-   `FilingStatus.ReceiptNo` — integer
-   `FilingStatus.OrigRetFiledDate` — string
- * `FilingStatus.ResidentialStatus` — string
- * `FilingStatus.ForeignExchangeFlag` — string
- * `FilingStatus.StartUpDPIITFlag` — string
-   `FilingStatus.RecgnNumAllottedByDPIIT` — string
- * `FilingStatus.InterMinisterialCertFlag` — string
-   `FilingStatus.CertificationNumber` — string
- * `FilingStatus.ifMSME` — string
-   `FilingStatus.RegNumMSMEDAct2006` — string
-   `FilingStatus.NRI_PE` — string
-   `FilingStatus.NriSEPinIndia` — string
-   `FilingStatus.AggrPaymentTransac` — number
-   `FilingStatus.NumberOfUsers` — number
- * `FilingStatus.FiiFpiFlag` — string
-   `FilingStatus.SebiRegnNo` — string
- * `FilingStatus.AsseseeRepFlg` — string
- * `FilingStatus.AssesseeRep.RepName` — string
- * `FilingStatus.AssesseeRep.RepEmailID` — string
- * `FilingStatus.AssesseeRep.CountryCodeRepMobileNo` — integer
- * `FilingStatus.AssesseeRep.RepMobileNo` — integer
- * `FilingStatus.PartnerInFirmFlg` — string
-   `FilingStatus.PartnerInFirm.PartnerInFirmDtls[]` — array
- * `FilingStatus.PartnerInFirm.PartnerInFirmDtls[].NameOfFirm` — string
- * `FilingStatus.PartnerInFirm.PartnerInFirmDtls[].PAN` — string
- * `FilingStatus.HeldUnlistedEqShrPrYrFlg` — string
-   `FilingStatus.HeldUnlistedEqShrPrYr.HeldUnlistedEqShrPrYrDtls[]` — array
- * `FilingStatus.HeldUnlistedEqShrPrYr.HeldUnlistedEqShrPrYrDtls[].NameOfCompany` — string
- * `FilingStatus.HeldUnlistedEqShrPrYr.HeldUnlistedEqShrPrYrDtls[].CompanyType` — string
-   `FilingStatus.HeldUnlistedEqShrPrYr.HeldUnlistedEqShrPrYrDtls[].PAN` — string
- * `FilingStatus.HeldUnlistedEqShrPrYr.HeldUnlistedEqShrPrYrDtls[].OpngBalNumberOfShares` — integer
- * `FilingStatus.HeldUnlistedEqShrPrYr.HeldUnlistedEqShrPrYrDtls[].OpngBalCostOfAcquisition` — number
-   `FilingStatus.HeldUnlistedEqShrPrYr.HeldUnlistedEqShrPrYrDtls[].ShrAcqDurYrNumberOfShares` — integer
-   `FilingStatus.HeldUnlistedEqShrPrYr.HeldUnlistedEqShrPrYrDtls[].DateOfSubscrPurchase` — string
-   `FilingStatus.HeldUnlistedEqShrPrYr.HeldUnlistedEqShrPrYrDtls[].FaceValuePerShare` — number
-   `FilingStatus.HeldUnlistedEqShrPrYr.HeldUnlistedEqShrPrYrDtls[].IssuePricePerShare` — number
-   `FilingStatus.HeldUnlistedEqShrPrYr.HeldUnlistedEqShrPrYrDtls[].PurchasePricePerShare` — number
-   `FilingStatus.HeldUnlistedEqShrPrYr.HeldUnlistedEqShrPrYrDtls[].ShrTrnfNumberOfShares` — integer
-   `FilingStatus.HeldUnlistedEqShrPrYr.HeldUnlistedEqShrPrYrDtls[].ShrTrnfSaleConsideration` — number
- * `FilingStatus.HeldUnlistedEqShrPrYr.HeldUnlistedEqShrPrYrDtls[].ClsngBalNumberOfShares` — integer
- * `FilingStatus.HeldUnlistedEqShrPrYr.HeldUnlistedEqShrPrYrDtls[].ClsngBalCostOfAcquisition` — number
-   `FilingStatus.115BAEReturnFiling_24_25` — string
-   `FilingStatus.OptingTaxation115BAEYes` — string
-   `FilingStatus.OptingTaxation115BAENo` — string
-   `FilingStatus.Form10IFADate` — string
-   `FilingStatus.Form10IFAAckNo` — integer
-   `FilingStatus.LEIDtls.LEINumber` — string
-   `FilingStatus.LEIDtls.ValidUptoDate` — string
- * `FilingStatus.ItrFilingDueDate` — string
