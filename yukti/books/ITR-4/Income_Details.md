# ITR-4 (SUGAM) — Income Details

*A.Y. 2026-27. Built from ITR-4's own sources only (utility sheet `Income Details`, `ITR-4_2026_Main_V1_1_schema.json`, the CBDT validation rules, and `vba_text.txt`). Nothing is invented; every label, code and dropdown is the department's own. Blocks mapped: PersonalInfo, FilingStatus, IncomeDeductions, TaxComputation.*

*Sheet header (row 4): SUGAM — [For Individuals, HUFs and Firms (other than LLP) being a Resident having total income upto Rs.50 lakh]. Row 8: Addresses to be provided for communication purposes. Row 26: Details to be provided for communication purposes.*

## The shape
`Income Details` is the SUGAM master sheet: one long screen that carries **Part A General Information** (name, addresses, contact, Aadhaar), the **Filing Status** block (nature of employment, section under which filed, the whole Form 10-IEA / section 115BAC regime choice, the seventh-proviso 139(1) questions and the representative-assessee block), then **Part B – Gross Total Income**, **Part C – Deductions and Taxable Total Income (Chapter VI-A)** and **Part D – Tax computations & Tax Status**. Unlike ITR-2, **there is no Schedule HP** — house-property figures live inside the `IncomeDeductions` block as the `PropertyDetails` array — and **Business & Profession is presumptive only** (44AD/44ADA/44AE), pulled as a single figure from E8 of Schedule BP. Most Part B/C/D figures are computed, not typed; the salary breakup, the exempt-allowance table, the other-sources table and the Chapter VI-A lines are the live inputs.

## The items

### Block: PersonalInfo (Part A General Information)

| Sheet ref | Field label | Type | Schema key | Rule / notes |
|---|---|---|---|---|
| E6 / O6 / W6 | First Name · Middle Name · Last Name | text | `AssesseeName.FirstName`, `AssesseeName.MiddleName`, `AssesseeName.SurNameOrOrgName` | Surname/last or Org name mandatory (max 75); First/Middle max 25 |
| — | PAN | text | `PAN` | Constant test identity uses S SUDHIR / TVOPS4373C |
| E9 | Primary Address | group | `Address` | Address of assessee |
| E10 | Flat/ Door/ Block No. | text | `Address.ResidenceNo` | max 50, mandatory |
| — | Premises/Building/Village (Name) | text | `Address.ResidenceName` | max 50 |
| E12 | Road / Street/ Post Office | text | `Address.RoadOrStreet` | max 50 |
| — | Area/Locality | text | `Address.LocalityOrArea` | max 50, mandatory |
| E14 | Town/City/District | text | `Address.CityOrTownOrDistrict` | max 50, mandatory |
| W14 | State | dropdown (38) | `Address.StateCode` | mandatory; codes 01–37, 99 |
| — | Country/Region | dropdown (250) | `Address.CountryCode` | mandatory |
| W16 | No ZIP Code / PIN | integer / text | `Address.PinCode`, `Address.ZipCode` | PIN 100000–999999, exactly 6 digits, not starting with zero; ZipCode max 8 (when abroad) |
| — | STD code · Phone No. | integer / text | `Address.Phone.STDcode`, `Address.Phone.PhoneNo` | STD 0–99999 |
| — | Mobile country code · Mobile No. | integer | `Address.CountryCodeMobile`, `Address.MobileNo` | mandatory |
| — | Secondary mobile country code · number | integer | `Address.CountryCodeMobileNoSec`, `Address.MobileNoSec` | optional |
| E27 | Primary Email ID of the taxpayer | text | `Address.EmailAddress` | mandatory; required for receiving copy of ITR-V; max 125 |
| S27 | Secondary Email ID | text | `Address.EmailAddressSec` | alternate email, max 125 |
| E17 | Is the secondary address same as primary address? | dropdown Yes/No | `SecondaryAdd` | Y/N, mandatory |
| E18 | Secondary Address | group | `AlternateAddress` | AlternateAddress of assessee |
| E19 | Flat/ Door/ Block No. (secondary) | text | `AlternateAddress.ResidenceNo` | max 50, mandatory when filled |
| — | Premises name (secondary) | text | `AlternateAddress.ResidenceName` | max 50 |
| E21 | Road / Street/ Post Office (secondary) | text | `AlternateAddress.RoadOrStreet` | max 50 |
| — | Area/Locality (secondary) | text | `AlternateAddress.LocalityOrArea` | max 50, mandatory |
| E23 | Town/City/District (secondary) | text | `AlternateAddress.CityOrTownOrDistrict` | max 50, mandatory |
| W23 | State (secondary) | dropdown (38) | `AlternateAddress.StateCode` | mandatory |
| — | Country (secondary) | dropdown (250) | `AlternateAddress.CountryCode` | |
| W25 | No ZIP Code / PIN (secondary) | integer / text | `AlternateAddress.PinCode`, `AlternateAddress.ZipCode` | |
| — | Date of Birth | date | `DOB` | YYYY-MM-DD; maximum date allowed 2026-03-31 |
| E36 | Nature of Employment (Status) | dropdown | `EmployerCategory` | enum CGOV, SGOV, PSU, PE, PESG, PEPS, PEO, OTH, NA |
| AF36 | Status | dropdown | `Status` | I - INDIVIDUAL, H - HUF, F - FIRM(Other than LLP) |
| E32 | Aadhaar Number [linked for your PAN in e-Filing portal] | text | `AadhaarCardNo` | Aadhaar linked to PAN |

### Block: FilingStatus

| Sheet ref | Field label | Type | Schema key | Rule / notes |
|---|---|---|---|---|
| N36 | Filed u/s / Filed in response to notice u/s | dropdown | `ReturnFileSec` | enum 11,12,13,14,16,17,18,20; 139(1)-On or before due date etc. |
| N38 | Due Date u/s 139(1) | date | `ItrFilingDueDate` | 31/08/2026 non-audit (max 10); set FORM.due from finalDuedate |
| E45 | (A23) Have you filed form 10IEA within due date for any earlier assessment year for choosing old tax regime | dropdown | `Form10IEAEarlierAYOldRegime` | Y/N/NA, mandatory |
| G49 | Assessment year for which form 10IEA for choosing old tax regime was filed | dropdown | `Form10IEAAssYear` | 2024-25 / 2025-26 |
| G50 | Acknowledgement number of form 10-IEA | integer | `Form10IEAEarlierAYAckOldRegime` | 15-digit |
| G51 | Have you filed ITR 3/4 in past and have re-entered new tax regime by filing form 10IEA | dropdown | `F10IEAEarlierAYNewRegime` | Yes/No |
| H54 | Assessment year for which form 10IEA for choosing new tax regime was filed | dropdown | `AssYrF10IEANewTaxReg` | 2025-26 |
| H55 | Acknowledgement number of form 10-IEA (new regime, earlier) | integer | `Form10IEAEarlierAYAckNewRegime` | |
| H56 | Have you furnished form 10IEA for re-entering in new tax regime in current AY | dropdown | `F10IEACurrAYNewRegime` | Yes/No |
| I59 | Date of filing of form 10-IEA for AY 2026-27 for re-entering in new tax regime | date | `F10IEADateCurrAYNewTax` | YYYY-MM-DD |
| I60 | Acknowledgement number of form 10-IEA for AY 2026-27 filed for re-entering in new tax regime | integer | `F10IEAAckNoCurrAYNewTax` | |
| F62 | Have you furnished form 10IEA within due date for current assessment year for choosing old tax regime | dropdown | `F10IEACurrAYOldRegime` | Yes/No |
| H69 | Date of filing of Form 10-IEA for AY 2026-27 filed for choosing old tax regime | date | `F10IEADateCurrAYOldTax` | YYYY-MM-DD |
| H70 | Acknowledgement number of Form 10-IEA for AY 2026-27 filed for choosing old tax regime | integer | `F10IEAAckNoCurrAYOldTax` | |
| F46 / F62 | If answer to A23 is yes, then (branch A) / If answer to A23 is No (branch B) | branch | *(cascade)* | routes to the 10-IEA acknowledgement/AY sub-questions |
| E72 | (A23b) Please select Option for current assessment year | dropdown | *(drives regime; New/Old Tax Regime)* | default is new regime |
| F89 | A24 — Are you filing return of income under Seventh proviso to section 139(1) but otherwise not required to furnish return | dropdown Yes/No | `SeventhProvisio139` | |
| E90 | Have you deposited amount or aggregate of amounts exceeding Rs. 1 Crore in one or more current accounts | dropdown Yes/No | `DepAmtAggAmtExcd1CrPrYrFlg` | amount `AmtSeventhProvisio139i` (min 1,00,00,000) |
| E91 | Have you incurred expenditure of an amount or aggregate exceeding Rs. 2 lakhs for travel to a foreign country | dropdown Yes/No | `IncrExpAggAmt2LkTrvFrgnCntryFlg` | amount `AmtSeventhProvisio139ii` (min 2,00,000) |
| E92 | Have you incurred expenditure of amount or aggregate exceeding Rs. 1 lakh on consumption of electricity | dropdown Yes/No | `IncrExpAggAmt1LkElctrctyPrYrFlg` | amount `AmtSeventhProvisio139iii` (min 1,00,000) |
| E93 | Are you required to file a return as per other conditions prescribed under clause (iv) of seventh proviso | dropdown Yes/No | `clauseiv7provisio139i` | detail array `clauseiv7provisio139iDtls` |
| E94 | The total sales, turnover or gross receipts in the business exceeds sixty lakh rupees during the previous year | flag | `clauseiv7provisio139iDtls[].clauseiv7provisio139iNature` = 1 | `clauseiv7provisio139iAmount` |
| E95 | The total gross receipts of the person in profession exceeds ten lakh rupees during the previous year | flag | `clauseiv7provisio139iNature` = 2 | |
| E96 | The aggregate of tax deducted at source and tax collected at source during the previous year | flag | `clauseiv7provisio139iNature` = 3 | |
| E97 | The deposit in one or more savings bank account of the person, in aggregate, is fifty lakh rupees or more | flag | `clauseiv7provisio139iNature` = 4 | |
| E41 | Receipt No. (original return, if revised/defective) | text | `ReceiptNo` | Receipt number of the original return |
| E43 | Unique number / Document Identification Number (DIN) | text | `NoticeNo` | max 100; row 42 notes 139(9)/142(1)/148/153C or order u/s 119(2)(b) |
| — | Date of filing of Original return | date | `OrigRetFiledDate` | YYYY-MM-DD |
| — | Date of Order or Notice under section | date | `NoticeDateUnderSec` | YYYY-MM-DD |
| F98 | A25 — Whether this return is being filed by a representative assessee? | dropdown Yes/No | `AsseseeRepFlg` | Y/N, mandatory |
| G99 | Name of the representative assessee | text | `AssesseeRep.RepName` | max 125 |
| G100 | Email-ID of the representative assessee | text | `AssesseeRep.RepEmailID` | max 125 |
| G101 | Contact no of the representative assessee | integer | `AssesseeRep.CountryCodeRepMobileNo`, `AssesseeRep.RepMobileNo` | |

### Block: IncomeDeductions (Part B & Part C)

| Sheet ref | Field label | Type | Schema key | Rule / notes |
|---|---|---|---|---|
| F110 | B1 Income from Business & Profession — NOTE: Enter value from E8 of Schedule BP | integer (computed) | `IncomeFromBusinessProf` | presumptive 44AD/44ADA/44AE; min 0 |
| H111 | (i) Gross Salary (ia + ib + ic) | integer | `GrossSalary` | mandatory |
| H112 | (a) Salary as per section 17(1) | integer | `Salary` | |
| H113 | (b) Value of perquisites as per section 17(2) | integer | `PerquisitesValue` | |
| H114 | (c) Profit in lieu of salary as per section 17(3) | integer | `ProfitsInSalary` | |
| H121 | (ii) Less: Allowances to the extent exempt u/s 10 (ensure included in salary u/s 17(1)) | table + total | `AllwncExemptUs10.AllwncExemptUs10Dtls[]`, `AllwncExemptUs10.TotalAllwncExemptUs10` | |
| I122 | Nature of Exempt Allowance (Sl.No.) | dropdown | `AllwncExemptUs10Dtls[].SalNatureDesc` | enum 10(5)…10(17) |
| — | Amount of exempt allowance | integer | `AllwncExemptUs10Dtls[].SalOthAmount` | |
| H128 | Sec 10(13A)-Allowance to meet expenditure incurred on house rent | (nature value) | — | one enumerated exempt allowance |
| H130 | (iii) Net Salary (i – ii) | integer (computed) | `NetSalary` | mandatory; = Gross salary − exempt u/s 10 |
| H131 | (iv) Deductions u/s 16 (iva + ivb + ivc) | integer (computed) | `DeductionUs16` | mandatory; = iva+ivb+ivc |
| H132 | (a) Standard Deduction u/s 16(ia) | integer | `DeductionUs16ia` | max 75000 |
| H133 | (b) Entertainment allowance u/s 16(ii) | integer | `EntertainmntalwncUs16ii` | max 5000 |
| H134 | (c) Professional tax u/s 16(iii) | integer | `ProfessionalTaxUs16iii` | max 5000 |
| H135 | (v) Income chargeable under the Head 'Salaries' (iii - iv) — Ensure to Fill "Sch TDS1" | integer (computed) | `IncomeFromSal` | mandatory; = iii − iv |
| B3 | House Property (array — no Schedule HP; lives in this block) | array (max 2) | `PropertyDetails[]` | |
| — | Serial no. | integer | `PropertyDetails[].HPSNo` | |
| — | Address / City / State / Country / PIN / Zip of property | group | `PropertyDetails[].AddressDetailWithZipCode.AddrDetail`/`.CityOrTownOrDistrict`/`.StateCode`/`.CountryCode`/`.PinCode`/`.ZipCode` | AddrDetail, City max 50 |
| — | Type of House Property / owner | dropdown | `PropertyDetails[].PropertyOwner` (SE/MI/SP/OT), `PropertyOwnerOther`, `PropertyDetails[].ifLetOut` (L/D/S) | Self Occupied / Let Out / Deemed let out |
| — | Property co-owned? / share | dropdown YES/NO, number | `PropertyDetails[].PropCoOwnedFlg`, `AsseseeShareProperty` | |
| — | Co-owners | array | `PropertyDetails[].CoOwners[].CoOwnersSNo`/`.NameCoOwner`/`.PAN_CoOwner`/`.Aadhaar_CoOwner`/`.PercentShareProperty` | |
| — | Tenant details | array | `PropertyDetails[].TenantDetails[].TenantSNo`/`.NameofTenant`/`.PANofTenant`/`.AadhaarofTenant`/`.PANTANofTenant` | |
| (i) | Gross rent received/ receivable/ lettable value during the year → Annual letable value | integer | `PropertyDetails[].Rentdetails.AnnualLetableValue` | |
| (a) | Rent received/ receivable during the year → not realized | integer | `PropertyDetails[].Rentdetails.RentNotRealized` | |
| (ii) | Tax paid to local authorities | integer | `PropertyDetails[].Rentdetails.LocalTaxes` | not allowed for Self-Occupied |
| — | Total unrealized + tax | integer | `PropertyDetails[].Rentdetails.TotalUnrealizedAndTax` | |
| (iii) | Annual Value (i – ii) → Balance ALV | integer | `PropertyDetails[].Rentdetails.BalanceALV`, `AnnualOfPropOwned` | Annual Value = B3i − B3ii |
| (iv) | 30% of Annual Value (30% * iii) | integer | `PropertyDetails[].Rentdetails.ThirtyPercentOfBalance` | |
| (v) | Interest payable on borrowed capital | integer | `PropertyDetails[].Rentdetails.IntOnBorwCap` | Schedule 24(b) detail `Section24B.Section24BDtls[]` (LoanTknFrom, BankOrInstnName, LoanAccNoOfBankOrInstnRefNo, DateofLoan, TotalLoanAmt, LoanOutstndngAmt, InterestUs24B), `TotalInterestUs24B` |
| — | Total deduction (interest plus 30% of balance) | integer | `PropertyDetails[].Rentdetails.TotalDeduct` | |
| (vi) | Arrears/Unrealized Rent received during the year Less 30% | integer | `PropertyDetails[].Rentdetails.ArrearsUnrealizedRentRcvd` | |
| — | Income of this house property | integer | `PropertyDetails[].Rentdetails.IncomeOfHP` | may be negative |
| H145 | Income chargeable under the head 'House Property' (Ʃ1k) (If loss, put the figure in negative) | integer (computed) | `TotalIncomeChargeableUnHP` | mandatory |
| F146 | B4 Income from Other Sources — Fill "Sch TDS2" if applicable | integer + table | `IncomeOthSrc`, `OthersInc.OthersIncDtlsOthSrc[]` | mandatory |
| I147 | Nature of Income (Sl.No.) | dropdown | `OthersInc.OthersIncDtlsOthSrc[].OthSrcNatureDesc` | enum SAV/IFD/TAX/FAP/DIV/10(11)(iP)/10(11)(iiP)/10(12)(iP)/10(12)(iiP)/OTH |
| — | Other nature description / amount | text / integer | `OthersIncDtlsOthSrc[].OthSrcOthNatOfInc` (max 125), `OthSrcOthAmount` | |
| H163 | Dividend (i+ii+iii+iv+v) | integer | `OthersIncDtlsOthSrc[].DividendInc.DateRange` | quarter split |
| H164 | i Upto 15-Jun-2025 | integer | `DividendInc.DateRange.Upto15Of6` | |
| H165 | ii From 16-Jun-2025 to 15-Sep-2025 | integer | `DividendInc.DateRange.Upto15Of9` | |
| H166 | iii From 16-Sep-2025 to 15-Dec-2025 | integer | `DividendInc.DateRange.Up16Of9To15Of12` | |
| H167 | iv From 16-Dec-2025 to 15-Mar-2026 | integer | `DividendInc.DateRange.Up16Of12To15Of3` | |
| H168 | v From 16-Mar-2026 to 31-Mar-2026 | integer | `DividendInc.DateRange.Up16Of3To31Of3` | |
| F170 | Less: Deduction u/s 57(iia) (In case of family pension only) | integer | `DeductionUs57iia` | max 25000; only if Family pension selected; ≤ lower of 1/3rd of Family pension or Rs.15,000 (old regime) |
| F172 | B5 Gross Total Income (B1+B2+B3+B4+D20(a)(iii)) | integer (computed) | `GrossTotIncome`, `GrossTotIncomeIncLTCG112A` | GTI without / including LTCG u/s 112A |

**Part C – Deductions and Taxable Total Income (Chapter VI-A).** Each item exists twice in the schema: a user-entered amount under `UsrDeductUndChapVIA.*` and the capped allowable amount under `DeductUndChapVIA.*` (caps below). Labels come from the sheet rows C1–C19.

| Sheet ref | Field label | Type | Schema key (user / allowed) | Cap (allowed) |
|---|---|---|---|---|
| H175 | C1 80C-Life insurance premium, deferred annuity, contributions to provident fund, subscription to certain equity/bonds | integer | `UsrDeductUndChapVIA.Section80C` / `DeductUndChapVIA.Section80C` | 150000 |
| H176 | C2 80CCC-Payment in respect Pension Fund | integer | `.Section80CCC` | 150000 |
| I177 | Type of Identifier (S.No.) | dropdown | `PensionContribution80CCC[].TypeofIdentifier` | PRAN / OTHPRAN |
| — | Name of identifier / Amount | text / integer | `PensionContribution80CCC[].NameofIdentifier`, `.Amount` | |
| H181 | C3 80CCD(1)-Contribution to pension scheme of Central Government | integer | `.Section80CCDEmployeeOrSE` | 150000 |
| H186 | C4 80CCD(1B)-Contribution to pension scheme of Central Government | integer | `.Section80CCD1B` | 50000 |
| H191 | PRAN | text | `PRANDtls[].PRANNum` | |
| H196 | C5 80CCD(2)-Contribution to pension scheme of Central Government by employer | integer | `.Section80CCDEmployer` | ≤14% salary (CG/SG) |
| H199 | C6 80D - Deduction in respect of health insurance premia (Please fill schedule 80D) | integer | `.Section80D` | 100000 |
| H203 | C7 80DD-Maintenance including medical treatment of a dependent who is a person with disability | integer | `.Section80DD` | 125000 |
| H204 | C8 80DDB-Medical treatment of specified disease | integer | `.Section80DDB`, `Section80DDBUsrType`, `NameOfSpecDisease80DDB` | 100000 |
| P204 | Name of specified disease | dropdown | `NameOfSpecDisease80DDB` | enum a…n |
| H206 | C9 80E-Interest on loan taken for higher education | integer | `.Section80E` | no cap |
| H207 | C10 80EE-Interest on loan taken for residential house property | integer | `.Section80EE` | 50000 |
| H208 | C11 80EEA - Deduction in respect of interest on loan taken for certain house property | integer | `.Section80EEA` | 150000 |
| H209 | C12 80EEB - Deduction in respect of purchase of electric vehicle | integer | `.Section80EEB` | 150000 |
| H210 | C13 80G - Donations to certain funds, charitable institutions, etc. (Please fill 80G schedule) | integer | `.Section80G` | no cap |
| H211 | C14 80GG - Rent paid (Please furnish form 10BA to claim the deduction) | integer | `.Section80GG`, `Form10BAAckNum` | 60000 |
| F213 | Acknowledgement number of Form 10BA | text | `Form10BAAckNum` | max 15 |
| H214 | C15 80GGC-Contribution to Political party (Please fill 80GGC schedule) | integer | `.Section80GGC` | no cap |
| H217 | C16 80TTA - Interest on savings bank account | integer | `.Section80TTA` | 10000 |
| H218 | C17 80TTB- Interest on deposits | integer | `.Section80TTB` | 50000 |
| H219 | C18 80U - In case of a person with disability (Please fill 80U schedule) | integer | `.Section80U` | 125000 |
| H220 | C18a 80CCH - Contribution to Agnipath Scheme | integer | `.AnyOthSec80CCH` | 288000 |
| H221 | C18b Any other deduction | integer | *(mapped into total)* | |
| H222 | C19 Total Deductions (Add items C1 to C18b) | integer (computed) | `UsrDeductUndChapVIA.TotalChapVIADeductions`, `DeductUndChapVIA.TotalChapVIADeductions` | mandatory |
| F224 | C20 Taxable Total Income (B5 - C19) — includes LTCG u/s 112A | integer (computed) | `TotalIncome` | max 5125000; mandatory |

### Block: TaxComputation (Part D)

| Sheet ref | Field label | Type | Schema key | Rule / notes |
|---|---|---|---|---|
| F226 | D1 Tax payable on Total Income (C20) | integer (computed) | `TotalTaxPayable` | mandatory |
| F227 | D2 Rebate u/s 87A (after Marginal Rebate, if any) | integer (computed) | `Rebate87A` | max 60000 |
| F228 | D3 Tax payable after Rebate (D1-D2) | integer (computed) | `TaxPayableOnRebate` | mandatory |
| F230 | D4 Health and Education Cess @ 4% on (D3) | integer (computed) | `EducationCess` | mandatory |
| F231 | D5 Total Tax & Cess (D3+D4) | integer (computed) | `GrossTaxLiability` | mandatory |
| F232 | D6 Relief u/s 89 (Please ensure to submit Form 10E to claim this relief) | integer | `Section89` | |
| F234 | D7 Balance Tax After Relief (D5 - D6) | integer (computed) | `NetTaxLiability` | = Total Tax & Cess − Relief u/s 89(1) |
| F235 | D8 Total interest u/s 234A | integer | `IntrstPay.IntrstPayUs234A` | mandatory |
| F236 | D9 Total Interest u/s 234B | integer | `IntrstPay.IntrstPayUs234B` | mandatory |
| F237 | D10 Total Interest u/s 234C | integer | `IntrstPay.IntrstPayUs234C` | mandatory |
| F238 | D11 Fee u/s 234F | integer | `IntrstPay.LateFilingFee234F` | max 5000 |
| F240 | D11a Fee for furnishing revised return of income (section 234-I) | integer | `IntrstPay.FeeFurnish234I` | max 5000 |
| F241 | D12 Total Tax, Fee and Interest (D7+D8+D9+D10+D11+D11a) | integer (computed) | `TotTaxPlusIntrstPay` | mandatory |

## The rules the sheet computes
- **[H124]/[H125]/[H126]** `=H123+1` — exempt-allowance table serial numbers auto-increment (Sl.No. of the AllwncExemptUs10 rows).
- **[H149]** `=H148+1` — other-sources table serial auto-increments.
- **[H179]/[H184]/[H189]/[H193]** `=H178+1` etc. — identifier/PRAN table serials auto-increment (80CCC/80CCD).
- **[AH106]** `=INDIRECT(IF(MID(TRIM(sheet1.Status),1,1)="F","ResStatus_2","ResStatus"))` — residential-status list switches by Status (Firm vs other).
- **[W107]** `=INDIRECT(IF(MID(TRIM(sheet1.Status),1,1)="I","AadharIND",IF(MID(...)="H","AadharHUF","AadharSelect")))` — Aadhaar question list switches by Status.
- **[I148:Y149]** `=IF(OR(MID(TRIM(sheet1.Status),1,1)="H",MID(...)="F"),Sheet1.others1,Sheet1.others)` — Nature-of-Income dropdown for Other Sources depends on Status; HUF/Firm get the shorter `others1` list (no Family pension).
- **[N36]** `=IF(Radiobuttoncheck=1,Returnfilesec1,Returnfilesec2)` — the "filed u/s" list switches between original-return sections and notice sections.
- **[AP83]** `=IF(OR(oldbacValue="",oldbacValue=0),RngNone,IF(oldbacValue=1,RngBacYes,RngBacNo))` — regime-option list depends on prior 115BAC history.
- **Annual Value** — B3(iii) Annual Value should be the output of B3(i) − B3(ii) [validation rules #275].
- **House Property total** — B3k Income chargeable under 'House Property' = Σ of the per-property (f − i − j); the sum of individual values cannot differ from the head total [#300].
- **Tax paid to local authorities** shall not be allowed for Type of House Property = "Self-Occupied" [#305].
- **Net Salary** = Gross salary − Allowances exempt u/s 10 [#320].
- **Deductions u/s 16** B2(iv) = sum of B2[iva+ivb+ivc] [#325].
- **Income chargeable under Salaries** B2(v) = B2(iii) − B2(iv) [#330].
- **Deduction u/s 57(iia)** allowed only if "Family pension" selected [#475]; ≤ lower of 1/3rd of Family pension or Rs.15,000 (old regime) [#480].
- **Chapter VI-A** deductions cannot exceed Gross Total Income [#95]; 80CCD(1) not > 20% of GTI [#115]; 80GG max Rs.60,000 (old regime) [#185].
- **Total income** = Gross total income − Total deductions [#230]; GTI shall include LTCG u/s 112A; 80CCD(2) not > 14% salary for CG/SG [#235].
- **Balance Tax after relief** = Total Tax & Cess − Relief u/s 89(1) [#280].
- Business income in Part B must be consistent with Schedule BP [#10]; presumptive income u/s 44AD/44ADA/44AE disclosed in Part B requires Schedule BP filled [#5].

## Dropdowns
(Every value, verbatim from the utility.)

- **Status** [AF36] — `(Select)`, `I - INDIVIDUAL`, `H - HUF`, `F - FIRM(Other than LLP)`.
- **Nature of Employment** [E36 Nature_Employment] — `(Select)`, `Central Government`, `State Government`, `Public Sector Undertaking`, `Pensioners-CG`, `Pensioners-SG`, `Pensioners-PSU`, `Pensioners-Other`, `Others`, `Not Applicable (eg. Family pension etc)`.
- **Nature of Employment (Portuguese-code section, Q34)** — `(Select)`, `Govt`, `PSU`, `Pensioners`, `Others`, `Not Applicable`.
- **Filed in response to notice u/s (Returnfilesec2)** [BB41] — `(Select)`, `139(9)`, `142(1)`, `153C`.
- **Whether Person governed by Portuguese Civil Code under Section 5A?** [AF34] — `(Select)`, `No`, `Yes`.
- **Is the secondary address same as primary address?** [AP17] — `(Select)`, `Yes`, `No`.
- **Secondary-address Yes/No** [AG16 / AG25] — `(Select)`, `Yes`, `No`.
- **A24 seventh-proviso questions** [AO89, AH90-AH97, AO93] — `(Select)`, `Yes`, `No`.
- **A25 representative assessee?** [AH98] — `(Select)`, `Yes`, `No`.
- **Capacity of representative** [AH102] — `(Select)`, `Legal Heir`, `Manager`, `Guardian`, `Other`.
- **Have you ever opted for new tax regime u/s 115BAC in earlier years? (BAC115.NY)** [AO45] — `(Select)`, `No`, `Yes`.
- **A23(A)(ii) re-entered new regime (BAC115.Yes_New)** [AO51] — `(Select)`, `No`, `Yes`.
- **A23(A)(ii)(b) furnished 10IEA new regime (BAC115.No_New)** [AO57] — `(Select)`, `No`, `Yes`.
- **Opt out of New Tax Regime (BAC115.NA_New)** [AO67] — `(Select)`, `No`, `Yes`.
- **A23(A)(ii) Yes/No** [AO56], **A23(B) Yes/No** [AO62] — `(Select)`, `Yes`, `No`.
- **AY for form 10IEA (old regime)** [AO49] — `(Select)`, `2024-25`, `2025-26`.
- **AY for form 10IEA (new regime)** [AO54] — `(Select)`, `2025-26`.
- **Earlier-year regime AY (legacy)** [AO76] — `(Select)`, `2021-22`, `2022-23`.
- **Opted out of 115BAC earlier?** [AO79] — `(Select)`, `Yes`, `No`.
- **AY in which option opted out** [AO80] — `(Select)`, `2022-23`.
- **Option for current assessment year (NTR_Current1)** [AO83] — `(Select)`, `Opting in now`, `Not opting`.
- **Please select Option for current assessment year (NTR_Current4)** [AO72] — `(Select)`, `New Tax Regime`, `Old Tax Regime`.
- **Nature of Exempt Allowance (Employment_Nature2)** [I123:I126] — `(Select)`, `Sec 10(5)-Leave Travel concession/assistance`, `Sec 10(6)-Remuneration received as an official, by whatever name called, of an embassy, high commission etc.`, `Sec 10(7)-Allowances or perquisites paid or allowed as such outside India by the Government to a citizen of India for rendering service outside India`, `Sec 10(10)-Death-cum-retirement gratuity received`, `Sec 10(10A)-Commuted value of pension received`, `Sec 10(10AA)-Earned leave encashment on Retirement`, `Sec 10(10C)-Amount received/receivable on voluntary retirement or termination of service`, `Sec 10(10CC)-Tax paid by employer on non-monetary perquisite`, `Sec 10(14)(i)-Prescribed Allowances or benefits (not in a nature of perquisite) specifically granted to meet expenses wholly, necessarily and exclusively and to the extent actually incurred, in performance of duties of office or employment`, `Sec 10(14)(ii)-Prescribed Allowances or benefits granted to meet personal expenses in performance of duties of office or employment or to compensate him for increased cost of living.`, `Exempt income received by a judge covered under the payment of salaries to Supreme Court/High Court judges Act /Rules`, `Sec 10(17)-Allowance MP/MLA/MLC`.
- **Nature of Income — Other Sources, Individual (Sheet1.others)** [I148:I149] — `(Select)`, `Interest from Saving Bank Account`, `Interest from Deposit (Bank/Post Office/Cooperative Society)`, `Interest from Income Tax Refund`, `Family pension`, `Any Other`.
- **Nature of Income — Other Sources, HUF/Firm (Sheet1.others1)** [H151] — `(Select)`, `Interest from Saving Bank Account`, `Interest from Deposit (Bank/Post Office/Cooperative Society)`, `Interest from Income Tax Refund`, `Any Other`.
- **Type of Identifier (80CCC/80CCD)** [I178] — `(Select)`, `PRAN`, `Other than PRAN`.
- **80DDB selection (Selection80DDB)** [H205] — `(Select)`, `1-Self or dependent`, `2-Self or Dependent - Senior Citizen`.
- **Name of specified disease (Specified_disease)** [P205] — `(Select)`, `(a) Dementia`, `(b) Dystonia Musculorum Deformans`, `(c) Motor Neuron Disease`, `(d) Ataxia`, `(e) Chorea`, `(f) Hemiballismus`, `(g) Aphasia`, `(h) Parkinsons Disease`, `(i) Malignant Cancers`, `(j) Full Blown Acquired Immuno-Deficiency Syndrome (AIDS)`, `(k) Chronic Renal failure`, `(l) Hematological disorders`, `(m) Hemophilia`, `(n) Thalassaemia`.
- **80D dropdowns** [P200:X202] — `(Select)`.
- **Type of House Property** [AO136] — `(Select)`, `Self Occupied`, `Let Out`, `Deemed let out`.
- **Tax Status** [AH108] — `(Select)`, `Tax Refundable`, `Tax Payable`, `Nil Tax Balance`.
- **Tax Status (header, BC109)** — `Tax Refundable`, `Tax Payable`, `Nil Tax Balance`.
- **State** [W15 / W24] — see full 38-value list below.
- **Country/Region** [AF15 / AF24] — see full 250-value list below.

### State codes (38)
`(Select)`, `01-Andaman and Nicobar islands`, `02-Andhra Pradesh`, `03-Arunachal Pradesh`, `04-Assam`, `05-Bihar`, `06-Chandigarh`, `07-THE DADRA AND NAGAR HAVELI AND DAMAN AND DIU`, `09-Delhi`, `10-Goa`, `11-Gujarat`, `12-Haryana`, `13-Himachal Pradesh`, `14-Jammu and Kashmir`, `15-Karnataka`, `16-Kerala`, `17-Lakshadweep`, `18-Madhya Pradesh`, `19-Maharashtra`, `20-Manipur`, `21-Meghalaya`, `22-Mizoram`, `23-Nagaland`, `24-Odisha`, `25-Puducherry`, `26-Punjab`, `27-Rajasthan`, `28-Sikkim`, `29-Tamil Nadu`, `30-Tripura`, `31-Uttar Pradesh`, `32-West Bengal`, `33-Chattisgarh`, `34-Uttarakhand`, `35-Jharkhand`, `36-Telangana`, `37-Ladakh`, `99-Foreign`

### Country/Region codes (250)
`(Select)`, `93-AFGHANISTAN`, `1001-ALAND ISLANDS`, `355-ALBANIA`, `213-ALGERIA`, `684-AMERICAN SAMOA`, `376-ANDORRA`, `244-ANGOLA`, `1264-ANGUILLA`, `1010-ANTARCTICA`, `1268-ANTIGUA AND BARBUDA`, `54-ARGENTINA`, `374-ARMENIA`, `297-ARUBA`, `61-AUSTRALIA`, `43-AUSTRIA`, `994-AZERBAIJAN`, `1242-BAHAMAS`, `973-BAHRAIN`, `880-BANGLADESH`, `1246-BARBADOS`, `375-BELARUS`, `32-BELGIUM`, `501-BELIZE`, `229-BENIN`, `1441-BERMUDA`, `975-BHUTAN`, `591-BOLIVIA (PLURINATIONAL STATE OF)`, `1002-BONAIRE, SINT EUSTATIUS AND SABA`, `387-BOSNIA AND HERZEGOVINA`, `267-BOTSWANA`, `1003-BOUVET ISLAND`, `55-BRAZIL`, `1014-BRITISH INDIAN OCEAN TERRITORY`, `673-BRUNEI DARUSSALAM`, `359-BULGARIA`, `226-BURKINA FASO`, `257-BURUNDI`, `238-CABO VERDE`, `855-CAMBODIA`, `237-CAMEROON`, `1-CANADA`, `1345-CAYMAN ISLANDS`, `236-CENTRAL AFRICAN REPUBLIC`, `235-CHAD`, `56-CHILE`, `86-CHINA`, `9-CHRISTMAS ISLAND`, `672-COCOS (KEELING) ISLANDS`, `57-COLOMBIA`, `270-COMOROS`, `242-CONGO`, `243-CONGO (DEMOCRATIC REPUBLIC OF THE)`, `682-COOK ISLANDS`, `506-COSTA RICA`, `225-CÔTE D'IVOIRE`, `385-CROATIA`, `53-CUBA`, `1015-CURAÇAO`, `357-CYPRUS`, `420-CZECHIA`, `45-DENMARK`, `253-DJIBOUTI`, `1767-DOMINICA`, `1809-DOMINICAN REPUBLIC`, `593-ECUADOR`, `20-EGYPT`, `503-EL SALVADOR`, `240-EQUATORIAL GUINEA`, `291-ERITREA`, `372-ESTONIA`, `251-ETHIOPIA`, `500-FALKLAND ISLANDS (MALVINAS)`, `298-FAROE ISLANDS`, `679-FIJI`, `358-FINLAND`, `33-FRANCE`, `594-FRENCH GUIANA`, `689-FRENCH POLYNESIA`, `1004-FRENCH SOUTHERN TERRITORIES`, `241-GABON`, `220-GAMBIA`, `995-GEORGIA`, `49-GERMANY`, `233-GHANA`, `350-GIBRALTAR`, `30-GREECE`, `299-GREENLAND`, `1473-GRENADA`, `590-GUADELOUPE`, `1671-GUAM`, `502-GUATEMALA`, `1481-GUERNSEY`, `224-GUINEA`, `245-GUINEA-BISSAU`, `592-GUYANA`, `509-HAITI`, `1005-HEARD ISLAND AND MCDONALD ISLANDS`, `6-HOLY SEE`, `504-HONDURAS`, `852-HONG KONG`, `36-HUNGARY`, `354-ICELAND`, `91-INDIA`, `62-INDONESIA`, `98-IRAN (ISLAMIC REPUBLIC OF)`, `964-IRAQ`, `353-IRELAND`, `1624-ISLE OF MAN`, `972-ISRAEL`, `5-ITALY`, `1876-JAMAICA`, `81-JAPAN`, `1534-JERSEY`, `962-JORDAN`, `7-KAZAKHSTAN`, `254-KENYA`, `686-KIRIBATI`, `850-KOREA (DEMOCRATIC PEOPLE'S REPUBLIC OF)`, `82-KOREA (REPUBLIC OF)`, `965-KUWAIT`, `996-KYRGYZSTAN`, `856-LAO PEOPLE'S DEMOCRATIC REPUBLIC`, `371-LATVIA`, `961-LEBANON`, `266-LESOTHO`, `231-LIBERIA`, `218-LIBYA`, `423-LIECHTENSTEIN`, `370-LITHUANIA`, `352-LUXEMBOURG`, `853-MACAO`, `389-MACEDONIA (THE FORMER YUGOSLAV REPUBLIC OF)`, `261-MADAGASCAR`, `265-MALAWI`, `60-MALAYSIA`, `960-MALDIVES`, `223-MALI`, `356-MALTA`, `692-MARSHALL ISLANDS`, `596-MARTINIQUE`, `222-MAURITANIA`, `230-MAURITIUS`, `269-MAYOTTE`, `52-MEXICO`, `691-MICRONESIA (FEDERATED STATES OF)`, `373-MOLDOVA (REPUBLIC OF)`, `377-MONACO`, `976-MONGOLIA`, `382-MONTENEGRO`, `1664-MONTSERRAT`, `212-MOROCCO`, `258-MOZAMBIQUE`, `95-MYANMAR`, `264-NAMIBIA`, `674-NAURU`, `977-NEPAL`, `31-NETHERLANDS`, `687-NEW CALEDONIA`, `64-NEW ZEALAND`, `505-NICARAGUA`, `227-NIGER`, `234-NIGERIA`, `683-NIUE`, `15-NORFOLK ISLAND`, `1670-NORTHERN MARIANA ISLANDS`, `47-NORWAY`, `968-OMAN`, `92-PAKISTAN`, `680-PALAU`, `970-PALESTINE, STATE OF`, `507-PANAMA`, `675-PAPUA NEW GUINEA`, `595-PARAGUAY`, `51-PERU`, `63-PHILIPPINES`, `1011-PITCAIRN`, `48-POLAND`, `14-PORTUGAL`, `1787-PUERTO RICO`, `974-QATAR`, `262-RÉUNION`, `40-ROMANIA`, `8-RUSSIAN FEDERATION`, `250-RWANDA`, `1006-SAINT BARTHÉLEMY`, `290-SAINT HELENA, ASCENSION AND TRISTAN DA CUNHA`, `1869-SAINT KITTS AND NEVIS`, `1758-SAINT LUCIA`, `1007-SAINT MARTIN (FRENCH PART)`, `508-SAINT PIERRE AND MIQUELON`, `1784-SAINT VINCENT AND THE GRENADINES`, `685-SAMOA`, `378-SAN MARINO`, `239-SAO TOME AND PRINCIPE`, `966-SAUDI ARABIA`, `221-SENEGAL`, `381-SERBIA`, `248-SEYCHELLES`, `232-SIERRA LEONE`, `65-SINGAPORE`, `1721-SINT MAARTEN (DUTCH PART)`, `421-SLOVAKIA`, `386-SLOVENIA`, `677-SOLOMON ISLANDS`, `252-SOMALIA`, `28-SOUTH AFRICA`, `1008-SOUTH GEORGIA AND THE SOUTH SANDWICH ISLANDS`, `211-SOUTH SUDAN`, `35-SPAIN`, `94-SRI LANKA`, `249-SUDAN`, `597-SURINAME`, `1012-SVALBARD AND JAN MAYEN`, `268-SWAZILAND`, `46-SWEDEN`, `41-SWITZERLAND`, `963-SYRIAN ARAB REPUBLIC`, `886-TAIWAN`, `992-TAJIKISTAN`, `255-TANZANIA, UNITED REPUBLIC OF`, `66-THAILAND`, `670-TIMOR-LESTE (EAST TIMOR)`, `228-TOGO`, `690-TOKELAU`, `676-TONGA`, `1868-TRINIDAD AND TOBAGO`, `216-TUNISIA`, `90-TURKEY`, `993-TURKMENISTAN`, `1649-TURKS AND CAICOS ISLANDS`, `688-TUVALU`, `256-UGANDA`, `380-UKRAINE`, `971-UNITED ARAB EMIRATES`, `44-UNITED KINGDOM OF GREAT BRITAIN AND NORTHERN IRELAND`, `2-UNITED STATES OF AMERICA`, `1009-UNITED STATES MINOR OUTLYING ISLANDS`, `598-URUGUAY`, `998-UZBEKISTAN`, `678-VANUATU`, `58-VENEZUELA (BOLIVARIAN REPUBLIC OF)`, `84-VIET NAM`, `1284-VIRGIN ISLANDS (BRITISH)`, `1340-VIRGIN ISLANDS (U.S.)`, `681-WALLIS AND FUTUNA`, `1013-WESTERN SAHARA`, `967-YEMEN`, `260-ZAMBIA`, `263-ZIMBABWE`, `9999-OTHERS`

## What repeats and what is one figure
**Arrays (repeat):**
- `AllwncExemptUs10.AllwncExemptUs10Dtls[]` — exempt-allowance rows (nature + amount).
- `PropertyDetails[]` — up to **2** house properties, each with nested `CoOwners[]`, `TenantDetails[]`, and `Rentdetails.Section24B.Section24BDtls[]` (interest-loan details).
- `OthersInc.OthersIncDtlsOthSrc[]` — other-source income rows, each with a nested `DividendInc.DateRange` quarter split.
- `UsrDeductUndChapVIA.PensionContribution80CCC[]` — 80CCC identifier rows.
- `UsrDeductUndChapVIA.PRANDtls[]` — PRAN rows for 80CCD.
- `clauseiv7provisio139iDtls[]` — seventh-proviso condition rows (nature 1–4 + amount).

**Single figures (one each):** Business income B1, the salary breakup (Gross/Net/16/Salaries), HP total `TotalIncomeChargeableUnHP`, `IncomeOthSrc`, `DeductionUs57iia`, `GrossTotIncome`, `GrossTotIncomeIncLTCG112A`, every Chapter VI-A line (both `UsrDeductUndChapVIA.*` and capped `DeductUndChapVIA.*`), `TotalChapVIADeductions`, `TotalIncome`, and all of Part D (`TotalTaxPayable`, `Rebate87A`, `TaxPayableOnRebate`, `EducationCess`, `GrossTaxLiability`, `Section89`, `NetTaxLiability`, `IntrstPay.*`, `TotTaxPlusIntrstPay`). PersonalInfo/FilingStatus are single objects (only the two AlternateAddress-less nested groups, plus the single `AssesseeRep` object).

## Mandatory (required schema keys)
- **PersonalInfo.required:** `AssesseeName` (→ `SurNameOrOrgName`), `PAN`, `Address` (→ `ResidenceNo`, `LocalityOrArea`, `CityOrTownOrDistrict`, `StateCode`, `CountryCode`, `Phone.STDcode`, `Phone.PhoneNo`, `CountryCodeMobile`, `MobileNo`, `EmailAddress`), `SecondaryAdd`, `DOB`, `EmployerCategory`, `Status`. On AlternateAddress: `ResidenceNo`, `LocalityOrArea`, `CityOrTownOrDistrict`, `StateCode`.
- **FilingStatus.required:** `ReturnFileSec`, `Form10IEAEarlierAYOldRegime`, `AsseseeRepFlg`, `ItrFilingDueDate`. On AssesseeRep (when Yes): `RepName`, `RepEmailID`, `CountryCodeRepMobileNo`, `RepMobileNo`. On clauseiv7provisio139iDtls: `clauseiv7provisio139iNature`, `clauseiv7provisio139iAmount`.
- **IncomeDeductions.required:** `IncomeFromBusinessProf`, `GrossSalary`, `NetSalary`, `DeductionUs16`, `IncomeFromSal`, `IncomeOthSrc`, `TotalIncomeChargeableUnHP`, `GrossTotIncome`, `GrossTotIncomeIncLTCG112A`, `UsrDeductUndChapVIA`, `DeductUndChapVIA`, `TotalIncome`. Within the two deduction objects, all `Section80*` lines and `TotalChapVIADeductions` are required. `AllwncExemptUs10.TotalAllwncExemptUs10` required when the array is present; array items require `SalNatureDesc`, `SalOthAmount`. PropertyDetails items require `HPSNo`, `AddressDetailWithZipCode.*` (AddrDetail, City, StateCode, CountryCode), `PropertyOwner`, `PropCoOwnedFlg`, `ifLetOut`, and the marked `Rentdetails.*` (AnnualLetableValue, TotalUnrealizedAndTax, BalanceALV, AnnualOfPropOwned, ThirtyPercentOfBalance, IntOnBorwCap, Section24B.Section24BDtls + TotalInterestUs24B, TotalDeduct, IncomeOfHP). OthersIncDtlsOthSrc items require `OthSrcNatureDesc`, `OthSrcOthAmount`, and DividendInc.DateRange leaves.
- **TaxComputation.required:** `TotalTaxPayable`, `Rebate87A`, `TaxPayableOnRebate`, `EducationCess`, `GrossTaxLiability`, `NetTaxLiability`, `IntrstPay` (→ `IntrstPayUs234A`, `IntrstPayUs234B`, `IntrstPayUs234C`, `LateFilingFee234F`), `TotTaxPlusIntrstPay`. `Section89` and `FeeFurnish234I` are optional.

## Hidden rows — not built
These rows are hidden in the utility (flagged `H` by `dump.py`) and are shown here only as excluded; they must never be rendered as items:
- **r29 FILING STATUS / Income Tax Ward / Circle**, **r31 Aadhaar (header)**, **r33 Aadhaar Enrolment Id**, **r34 Portuguese Civil Code Section 5A** — hidden header/legacy fields.
- **r37 "139(8A) corrected return" note**, **r38 Due Date u/s 139(1) label**, **r40 Receipt number label**, **r44 opted new regime earlier?** — hidden.
- **r48, r53, r64, r65, r66, r67, r68 (10-IEA legacy date/ack rows & opt-out repeats)**, **r73–r86 (Form 10-IE legacy option/opt-in/opt-out date & ack rows)** — hidden legacy 10-IE machinery superseded by 10-IEA.
- **r102–r108 (representative capacity/address/PAN/Aadhaar/residential status, "Whether you have Aadhaar", Tax Status)** — hidden.
- **r115–r120 (income from retirement benefit account u/s 89A: notified/other country, USA/UK/Canada)**, **r129 relief u/s 89A (salary)** — hidden 89A rows (not applicable to SUGAM build).
- **r136–r144 (Type of House Property, gross rent, arrears, tax to local authorities, annual value, 30%, interest, arrears-less-30% detail rows)** — hidden on the display sheet; the equivalent data is captured through the `PropertyDetails` array, not these rows.
- **r151–r162 (89A other-source retirement rows, USA/UK/Canada, taxable-portion quarter split), r169 relief u/s 89A (other sources), r171 GTI (1+2+3+4) note** — hidden.
- **r174 (VI-A period note), r182–r184, r187–r189, r194, r197–r198 (80CCC/80CCD identifier/PRAN sub-rows), r200–r202 (80D health-insurance/medical/preventive sub-rows), r205 selection sub-row, r212 80GGA, r215 80QQB, r216 80RRB** — hidden sub-rows.
- **r223 TAX COMPUTATION header / Taxable Total Income (5-6)**, **r229 Surcharge, if applicable**, **r233 Relief u/s 89A**, **r239 Total Interest u/s 234A 234B 234C 234F**, **r243–r244 For Office Use Only / Receipt No/Date** — hidden.
- Hidden dropdown machinery (`BJ35`, and the various `BAC115.*`/`NTR_*` named ranges) sits behind hidden rows but their values are documented above because the utility surfaces them on the visible regime cells.

## What this means for the build
- **No Schedule HP tab.** House property is a sub-array (`PropertyDetails`, max 2) inside the Income Details section; render it under B3 with the per-property rent/interest breakup and the Section 24(b) loan detail array. Self-Occupied must block "Tax paid to local authorities".
- **Business income is presumptive-only** — B1 (`IncomeFromBusinessProf`) is fed from Schedule BP E8; it is computed here, not typed, and must equal the BP figure (validation #5/#10). No regular P&L.
- **Chapter VI-A is doubled:** capture the user amount in `UsrDeductUndChapVIA.*`, compute the capped allowable into `DeductUndChapVIA.*` using the caps in the items table, and clamp total deductions to Gross Total Income. Apply the old-regime-only limits (80GG ≤ 60,000; 80CCD(2) ≤ 14% salary CG/SG; 57(iia) ≤ lower of 1/3 family pension or 15,000).
- **Regime engine is the hard part:** the A23/A23b/10-IEA cascade decides new vs old regime; `Form10IEAEarlierAYOldRegime` is required. Default regime is the new regime under 115BAC(1A). The dropdown lists on regime cells switch via the `BAC115.*` / `NTR_Current*` named ranges.
- **Status drives dropdowns:** Firm/HUF cannot pick "Family pension" in Other Sources (uses `others1`); residential-status and Aadhaar lists switch on Status too.
- **Nature of Employment = "Not Applicable (eg. Family pension etc)"** greys off the Salary schedule — enforce that dependency.
- **`ItrFilingDueDate`** is 31/08/2026 for the non-audit case (utility `finalDuedate`); set `FORM.due` from that per audit/non-audit.
- Every computed Part D line is untypeable/green; only D6 relief, D8–D11a interest/fee are inputs. `TotalIncome` (C20) is capped at 5,125,000 in the schema — SUGAM ceiling ~Rs.50 lakh.
