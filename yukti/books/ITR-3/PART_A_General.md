# The book of Part A — General · ITR-3, A.Y. 2026-27

Read row by row from the ITR-3 utility's **PART A – General** sheet (193 grid rows; 106 visible labelled rows, 61 hidden) and confirmed against the CBDT ITR-3 schema blocks `PartA_GEN1` and `PartA_GEN2`. Nothing here is invented; every label, code, cell reference and dropdown value is the department's own, quoted from the sheet. Where the utility hides a row it is listed only under *Hidden rows — not built*, never as an item.

---

## The shape

Part A – General is the return's identity-and-eligibility face for individuals and HUFs **having income from profits and gains business or profession**. It carries three schema areas: `PersonalInfo` (name, PAN, addresses, communication, status, date of birth/formation, date of commencement of business), `FilingStatus` (section filed under, notice/receipt particulars, residential status, the tax-regime / Form 10IEA machinery, the seventh-proviso flags, and the Yes-then-table sub-forms for directorship, partnership and unlisted shares, plus non-resident PE/SEP, IFSC unit, FPI and LEI) — both under block **PartA_GEN1** — and `AuditInfo`/`NatOfBus` (44AA/44AB/92E audit liability, auditor and audit-report details, other-Act audits) under block **PartA_GEN2**. Most blocks are single figures; the jurisdiction, seventh-proviso clause-iv, directorship, partnership, unlisted-share, other-audit-report and nature-of-business tables are the arrays.

---

## The items

### Block PartA_GEN1 — PersonalInfo + FilingStatus (visible rows)

| Row / cell | Field label (as the sheet states it) | Type | Schema key | Rule / notes |
|---|---|---|---|---|
| 3 `C3` | FORM | field |  | quoted from sheet |
| 3 `E3` | ITR-3 | field |  | quoted from sheet |
| 3 `N3` | INDIAN INCOME TAX RETURN | field |  | quoted from sheet |
| 4 `N4` | [For individuals and HUFs having income from profits and gains business or profession] | field |  | quoted from sheet |
| 5 `N5` | (Please see Rule 12 of the Income Tax-Rules,1962) (Please Refer instructions) | field |  | quoted from sheet |
| 7 `C7` | PERSONAL INFORMATION | field |  | quoted from sheet |
| 7 `E7` | First Name | field | PersonalInfo.AssesseeName.FirstName | quoted from sheet |
| 7 `O7` | Middle Name | field | PersonalInfo.AssesseeName.MiddleName | quoted from sheet |
| 7 `W7` | Last Name | field | PersonalInfo.AssesseeName.SurNameOrOrgName | quoted from sheet |
| 9 `E9` | Date of Commencement of Business (DD/MM/YYYY) | field | PersonalInfo.DateofBusCommencement | quoted from sheet |
| 9 `W9` | Date of Birth/Formation (DD/MM/YYYY) | field | PersonalInfo.DOB | quoted from sheet |
| 11 `E11` | Addresses to be provided for communication purposes: | field |  | quoted from sheet |
| 12 `E12` | Primary Address | field |  | quoted from sheet |
| 13 `E13` | Flat/ Door/ Block No. | field |  | quoted from sheet |
| 13 `W13` | Name of Premises / Building / Village | field |  | quoted from sheet |
| 16 `E16` | Town/City/District | field |  | quoted from sheet |
| 16 `W16` | State | field |  | quoted from sheet |
| 18 `E18` | No Zip Code? | field |  | quoted from sheet |
| 19 `E19` | Is the secondary address same as primary address? | field |  | quoted from sheet |
| 20 `E20` | Secondary Address | field |  | quoted from sheet |
| 21 `E21` | Flat/ Door/ Block No. | field |  | quoted from sheet |
| 21 `W21` | Name of Premises / Building / Village | field |  | quoted from sheet |
| 23 `E23` | Town/ City/ District | field |  | quoted from sheet |
| 23 `W23` | State | field |  | quoted from sheet |
| 25 `E25` | NO Zip Code | field |  | quoted from sheet |
| 26 `E26` | Details to be provided for communication purposes: | field |  | quoted from sheet |
| 27 `E27` | Primary Email ID of the taxpayer | field | PersonalInfo.Address.EmailAddress | quoted from sheet |
| 27 `N27` | Secondary Email ID | field | PersonalInfo.Address.EmailAddressSec | quoted from sheet |
| 27 `W27` | Primary Mobile no of the taxpayer | field | PersonalInfo.Address.MobileNo | quoted from sheet |
| 29 `E29` | Due date for filing return of income | field | FilingStatus.ItrFilingDueDate | quoted from sheet |
| 30 `N30` | Filed u/s | field | FilingStatus.ReturnFileSec | quoted from sheet |
| 30 `Q30` | Filed in response to notice u/s | field |  | quoted from sheet |
| 30 `X30` | 139(1)- On or Before due date | field |  | quoted from sheet |
| 32 `E32` | If revised/defective/Modified, enter Receipt no | field |  | quoted from sheet |
| 34 `E34` | If filed, in response to a notice u/s 139(9)/142(1)/148/153C or order u/s 119(2)(b), enter Unique Nu | field |  | quoted from sheet |
| 35 `E35` | Unique Number/ Document Identification Number | field | FilingStatus.NoticeNo | quoted from sheet |
| 62 `E62` | Do you have income from business or profession for current Assessment Year? | field | FilingStatus.IncFrmBusOrProf | quoted from sheet |
| 63 `F63` | (I) | field |  | quoted from sheet |
| 63 `N63` | If answer to A19(b) is Yes, have you filed form10IEA within due date for any earlier assessment year | field |  | quoted from sheet |
| 64 `N64` | (I)(A)(i) | field |  | quoted from sheet |
| 64 `O64` | Furnish form 10IEA acknowledgement number and assessment year for which this form for choosing old t | field |  | quoted from sheet |
| 65 `O65` | Assessment Year | field |  | quoted from sheet |
| 66 `O66` | Acknowledgement Number | field |  | quoted from sheet |
| 67 `F67` | (I)(A)(ii) | field |  | quoted from sheet |
| 67 `N67` | Have you filed ITR 3/4 in past and have re-entered new tax regime by filing form 10IEA for any asses | field |  | quoted from sheet |
| 68 `N68` | (I)(A)(ii)(a) | field |  | quoted from sheet |
| 68 `O68` | If answer to (I)(A)(ii) is Yes, provide the acknowledgement number of second form 10IEA and assessme | field |  | quoted from sheet |
| 69 `O69` | Assessment Year | field |  | quoted from sheet |
| 70 `O70` | Acknowledgement Number | field |  | quoted from sheet |
| 71 `F71` | (I)(A)(ii)(b) | field |  | quoted from sheet |
| 71 `N71` | If answer to (I)(A)(ii) is No, have you furnished form 10IEA for re-entering in new tax regime in cu | field |  | quoted from sheet |
| 72 `N72` | (I)(A)(ii)(b)(i) | field |  | quoted from sheet |
| 72 `O72` | If yes, then provide the acknowledgement number of form 10IEA and furnish ITR in new tax regime | field |  | quoted from sheet |
| 73 `O73` | Date of filing of Form 10-IEA for AY 2026-27 | field |  | quoted from sheet |
| 74 `O74` | Acknowledgement Number | field |  | quoted from sheet |
| 75 `N75` | If answer to (I) is No, have you furnished form 10IEA within due date for current assessment year fo | field |  | quoted from sheet |
| 76 `F76` | (I)(B) | field |  | quoted from sheet |
| 76 `N76` | (I)(B)(i) | field |  | quoted from sheet |
| 76 `O76` | If answer to (I)(B) is Yes, provide the acknowledgement number of form 10IEA, and then furnish retur | field |  | quoted from sheet |
| 77 `O77` | Date of filing of Form 10-IEA for AY 2026-27 | field |  | quoted from sheet |
| 78 `O78` | Acknowledgement Number | field |  | quoted from sheet |
| 79 `E79` | Do you wish to opt for old tax regime for the current Assessment Year? | field | FilingStatus.OptOldRegimeCurrAY | quoted from sheet |
| 101 `E101` | Are you filing return of income under Seventh proviso to Section 139(1) – (Tick)  Yes  No If yes | field |  | quoted from sheet |
| 102 `E102` | Have you deposited amount or aggregate of amounts exceeding Rs. 1 Crore in one or more current accou | field |  | quoted from sheet |
| 103 `E103` | Have you incurred expenditure of an amount or aggregate of amount exceeding Rs. 2 lakhs for travel t | field |  | quoted from sheet |
| 104 `E104` | Have you incurred expenditure of amount or aggregate of amount exceeding Rs. 1 lakh on consumption o | field |  | quoted from sheet |
| 105 `E105` | Are you required to file a return as per other conditions prescribed under clause (iv) of seventh pr | field |  | quoted from sheet |
| 106 `E106` | (i) if his total sales, turnover or gross receipts, as the case may be in the business exceeds sixty | field |  | quoted from sheet |
| 107 `E107` | (ii) if his total gross receipts in profession exceeds ten lakh rupees during the previous year; or | field |  | quoted from sheet |
| 108 `E108` | (iii) if the aggregate of tax deducted at source and tax collected at source during the previous yea | field |  | quoted from sheet |
| 109 `E109` | (iv) The deposits in one or more savings bank account of the person, in aggregate, is rupees fifty l | field |  | quoted from sheet |
| 110 `E110` | Aadhaar Number [Please enter the Aadhaar Number. Applicable to Individual only] | field | PersonalInfo.AadhaarCardNo | quoted from sheet |
| 112 `E112` | Do you want to claim the benefit u/s 115H (Applicable in case of Resident)? | field |  | quoted from sheet |
| 114 `E114` | Whether this return is being filed by a representative assessee? If yes, please furnish following in | field |  | quoted from sheet |
| 115 `G115` | Name of the representative assessee | field | FilingStatus.AssesseeRep.RepName | quoted from sheet |
| 116 `N116` | Email-ID of the representative assessee | field | FilingStatus.AssesseeRep.RepEmailID | quoted from sheet |
| 117 `N117` | Contact number of the representative assessee | field | FilingStatus.AssesseeRep.RepMobileNo | quoted from sheet |
| 122 `E122` | Whether you are Director in a company at any time during the previous year? If yes, please furnish f | field |  | quoted from sheet |
| 123 `E123` | Sl. No. | field |  | quoted from sheet |
| 123 `F123` | Name of company | field |  | quoted from sheet |
| 123 `O123` | Type of Company | field |  | quoted from sheet |
| 123 `X123` | PAN | field |  | quoted from sheet |
| 128 `E128` | Whether you are a Partner in a Firm? If yes, please furnish following information - | field |  | quoted from sheet |
| 129 `E129` | Sl. No. | field |  | quoted from sheet |
| 129 `F129` | Name of Firm | field |  | quoted from sheet |
| 129 `W129` | PAN | field |  | quoted from sheet |
| 133 `E133` | Whether you have held unlisted equity shares at any time during the previous year? If yes, please fu | field |  | quoted from sheet |
| 134 `E134` | Sl. No. | field |  | quoted from sheet |
| 134 `F134` | Name of company | field |  | quoted from sheet |
| 134 `N134` | Type of Company | field |  | quoted from sheet |
| 134 `O134` | PAN | field |  | quoted from sheet |
| 134 `P134` | Opening Balance | field |  | quoted from sheet |
| 134 `X134` | Shares acquired during the year | field |  | quoted from sheet |
| 135 `P135` | No. of shares | field |  | quoted from sheet |
| 135 `T135` | Cost of acquisition | field |  | quoted from sheet |
| 135 `X135` | No. of shares | field |  | quoted from sheet |
| 140 `E140` | In case of non-resident, is there a permanent establishment (PE) in India? | field |  | quoted from sheet |
| 141 `E141` | In the case of non-resident, is there a Significant Economic Presence (SEP) in India | field |  | quoted from sheet |
| 142 `E142` | please provide details of (a) aggregate of payments arising from the transaction or transactions dur | field |  | quoted from sheet |
| 143 `E143` | (b) number of users in India as referred in Explanation 2A(b) to Section 9(1)(i) | field |  | quoted from sheet |
| 144 `E144` | Whether assessee has a unit in an International Financial Services Centre and derives income solely | field |  | quoted from sheet |
| 145 `E145` | Whether you are an FPI? | field |  | quoted from sheet |
| 146 `E146` | If yes, please provide SEBI Regn. No | field | FilingStatus.SebiRegnNo | quoted from sheet |
| 147 `E147` | Legal Entity Identifier (LEI) details (mandatory if refund is 50 Crores or more) | field |  | quoted from sheet |
| 148 `E148` | LEI Number | field | FilingStatus.LEIDtls.LEINumber | quoted from sheet |
| 149 `E149` | Valid upto date | field | FilingStatus.LEIDtls.ValidUptoDate | quoted from sheet |

Every `PartA_GEN1` schema leaf key, verbatim, mapped to this block (required keys marked `*`):

```
  PersonalInfo.AssesseeName.FirstName  [string]
  PersonalInfo.AssesseeName.MiddleName  [string]
* PersonalInfo.AssesseeName.SurNameOrOrgName  [string]
* PersonalInfo.PAN  [string]
* PersonalInfo.Address.ResidenceNo  [string]
  PersonalInfo.Address.ResidenceName  [string]
  PersonalInfo.Address.RoadOrStreet  [string]
* PersonalInfo.Address.LocalityOrArea  [string]
* PersonalInfo.Address.CityOrTownOrDistrict  [string]
* PersonalInfo.Address.StateCode  [string]
* PersonalInfo.Address.CountryCode  [string]
  PersonalInfo.Address.PinCode  [integer]
  PersonalInfo.Address.ZipCode  [string]
* PersonalInfo.Address.Phone.STDcode  [integer]
* PersonalInfo.Address.Phone.PhoneNo  [string]
* PersonalInfo.Address.CountryCodeMobile  [integer]
* PersonalInfo.Address.MobileNo  [integer]
  PersonalInfo.Address.CountryCodeMobileNoSec  [integer]
  PersonalInfo.Address.MobileNoSec  [integer]
* PersonalInfo.Address.EmailAddress  [string]
  PersonalInfo.Address.EmailAddressSec  [string]
* PersonalInfo.SecondaryAdd  [string]
* PersonalInfo.AlternateAddress.ResidenceNo  [string]
  PersonalInfo.AlternateAddress.ResidenceName  [string]
  PersonalInfo.AlternateAddress.RoadOrStreet  [string]
* PersonalInfo.AlternateAddress.LocalityOrArea  [string]
* PersonalInfo.AlternateAddress.CityOrTownOrDistrict  [string]
* PersonalInfo.AlternateAddress.StateCode  [string]
  PersonalInfo.AlternateAddress.CountryCode  [string]
  PersonalInfo.AlternateAddress.PinCode  [integer]
  PersonalInfo.AlternateAddress.ZipCode  [string]
* PersonalInfo.DOB  [string]
* PersonalInfo.Status  [string]
  PersonalInfo.DateofBusCommencement  [string]
  PersonalInfo.AadhaarCardNo  [string]
* FilingStatus.ReturnFileSec  [integer]
* FilingStatus.IncFrmBusOrProf  [string]
  FilingStatus.Form10IEAEarlierAYOldRegime  [string]
  FilingStatus.Form10IEAAssYear  [string]
  FilingStatus.Form10IEAEarlierAYAckOldRegime  [integer]
  FilingStatus.F10IEAEarlierAYNewRegime  [string]
  FilingStatus.AssYrF10IEANewTaxReg  [string]
  FilingStatus.Form10IEAEarlierAYAckNewRegime  [integer]
  FilingStatus.F10IEACurrAYNewRegime  [string]
  FilingStatus.F10IEADateCurrAYNewTax  [string]
  FilingStatus.F10IEAAckNoCurrAYNewTax  [integer]
  FilingStatus.F10IEACurrAYOldRegime  [string]
  FilingStatus.F10IEADateCurrAYOldTax  [string]
  FilingStatus.F10IEAAckNoCurrAYOldTax  [integer]
  FilingStatus.OptOldRegimeCurrAY  [string]
* FilingStatus.SeventhProvisio139  [string]
  FilingStatus.DepAmtAggAmtExcd1CrPrYrFlg  [string]
  FilingStatus.AmtSeventhProvisio139i  [integer]
  FilingStatus.IncrExpAggAmt2LkTrvFrgnCntryFlg  [string]
  FilingStatus.AmtSeventhProvisio139ii  [integer]
  FilingStatus.IncrExpAggAmt1LkElctrctyPrYrFlg  [string]
  FilingStatus.AmtSeventhProvisio139iii  [integer]
  FilingStatus.clauseiv7provisio139i  [string]
  FilingStatus.clauseiv7provisio139iDtls[]  [array]
* FilingStatus.clauseiv7provisio139iDtls[].clauseiv7provisio139iNature  [string]
* FilingStatus.clauseiv7provisio139iDtls[].clauseiv7provisio139iAmount  [integer]
  FilingStatus.NoticeNo  [string]
  FilingStatus.NoticeDate  [string]
  FilingStatus.ReceiptNo  [string]
  FilingStatus.OrigRetFiledDate  [string]
* FilingStatus.ResidentialStatus  [string]
  FilingStatus.ConditionsResStatus  [string]
  FilingStatus.JurisdictionResPrevYr.JurisdictionResPrevYrDtls[]  [array]
* FilingStatus.JurisdictionResPrevYr.JurisdictionResPrevYrDtls[].JurisdictionResidence  [string]
* FilingStatus.JurisdictionResPrevYr.JurisdictionResPrevYrDtls[].TIN  [string]
  FilingStatus.TotalPrStayIndiaPrevYr  [integer]
  FilingStatus.TotalPrStayIndia4PrecYr  [integer]
  FilingStatus.BenefitUs115HFlg  [string]
  FilingStatus.PortugeseCC5A  [string]
  FilingStatus.AsseseeRepFlg  [string]
* FilingStatus.AssesseeRep.RepName  [string]
* FilingStatus.AssesseeRep.RepEmailID  [string]
* FilingStatus.AssesseeRep.CountryCodeRepMobileNo  [integer]
* FilingStatus.AssesseeRep.RepMobileNo  [integer]
  FilingStatus.CompDirectorPrvYrFlg  [string]
  FilingStatus.CompDirectorPrvYr.CompDirectorPrvYrDtls[]  [array]
* FilingStatus.CompDirectorPrvYr.CompDirectorPrvYrDtls[].NameOfCompany  [string]
* FilingStatus.CompDirectorPrvYr.CompDirectorPrvYrDtls[].CompanyType  [string]
  FilingStatus.CompDirectorPrvYr.CompDirectorPrvYrDtls[].PAN  [string]
* FilingStatus.CompDirectorPrvYr.CompDirectorPrvYrDtls[].SharesTypes  [string]
  FilingStatus.CompDirectorPrvYr.CompDirectorPrvYrDtls[].DIN  [string]
  FilingStatus.PartnerInFirmFlg  [string]
  FilingStatus.PartnerInFirm.PartnerInFirmDtls[]  [array]
* FilingStatus.PartnerInFirm.PartnerInFirmDtls[].NameOfFirm  [string]
* FilingStatus.PartnerInFirm.PartnerInFirmDtls[].PAN  [string]
* FilingStatus.HeldUnlistedEqShrPrYrFlg  [string]
  FilingStatus.HeldUnlistedEqShrPrYr.HeldUnlistedEqShrPrYrDtls[]  [array]
* FilingStatus.HeldUnlistedEqShrPrYr.HeldUnlistedEqShrPrYrDtls[].NameOfCompany  [string]
* FilingStatus.HeldUnlistedEqShrPrYr.HeldUnlistedEqShrPrYrDtls[].CompanyType  [string]
  FilingStatus.HeldUnlistedEqShrPrYr.HeldUnlistedEqShrPrYrDtls[].PAN  [string]
* FilingStatus.HeldUnlistedEqShrPrYr.HeldUnlistedEqShrPrYrDtls[].OpngBalNumberOfShares  [integer]
* FilingStatus.HeldUnlistedEqShrPrYr.HeldUnlistedEqShrPrYrDtls[].OpngBalCostOfAcquisition  [number]
  FilingStatus.HeldUnlistedEqShrPrYr.HeldUnlistedEqShrPrYrDtls[].ShrAcqDurYrNumberOfShares  [integer]
  FilingStatus.HeldUnlistedEqShrPrYr.HeldUnlistedEqShrPrYrDtls[].DateOfSubscrPurchase  [string]
  FilingStatus.HeldUnlistedEqShrPrYr.HeldUnlistedEqShrPrYrDtls[].FaceValuePerShare  [number]
  FilingStatus.HeldUnlistedEqShrPrYr.HeldUnlistedEqShrPrYrDtls[].IssuePricePerShare  [integer]
  FilingStatus.HeldUnlistedEqShrPrYr.HeldUnlistedEqShrPrYrDtls[].PurchasePricePerShare  [number]
  FilingStatus.HeldUnlistedEqShrPrYr.HeldUnlistedEqShrPrYrDtls[].ShrTrnfNumberOfShares  [integer]
  FilingStatus.HeldUnlistedEqShrPrYr.HeldUnlistedEqShrPrYrDtls[].ShrTrnfSaleConsideration  [number]
* FilingStatus.HeldUnlistedEqShrPrYr.HeldUnlistedEqShrPrYrDtls[].ClsngBalNumberOfShares  [integer]
* FilingStatus.HeldUnlistedEqShrPrYr.HeldUnlistedEqShrPrYrDtls[].ClsngBalCostOfAcquisition  [number]
  FilingStatus.NriPEinIndia  [string]
  FilingStatus.NriSEPinIndia  [string]
  FilingStatus.AggrPaymentTransac  [number]
  FilingStatus.NumberOfUsers  [number]
* FilingStatus.ForeignExchangeFlag  [string]
* FilingStatus.FiiFpiFlag  [string]
  FilingStatus.SebiRegnNo  [string]
* FilingStatus.ItrFilingDueDate  [string]
  FilingStatus.LEIDtls.LEINumber  [string]
  FilingStatus.LEIDtls.ValidUptoDate  [string]
```

### Block PartA_GEN2 — AuditInfo + NatOfBus (visible rows)

| Row / cell | Field label (as the sheet states it) | Type | Schema key | Rule / notes |
|---|---|---|---|---|
| 150 `E150` | Audit Information | field |  | quoted from sheet |
| 151 `C151` | AUDIT INFORMATION | field |  | quoted from sheet |
| 151 `E151` | a1 | field |  | quoted from sheet |
| 151 `F151` | Are you liable to maintain accounts as per section 44AA? (Select) | field | AuditInfo.LiableSec44AAflg | quoted from sheet |
| 152 `E152` | a2 | field |  | quoted from sheet |
| 152 `F152` | Whether assessee is declaring income only under section 44AE/44B/44BB/44AD/44ADA/44BBA/44BBC/44BBD/4 | field | AuditInfo.IncDclrdUs | quoted from sheet |
| 153 `E153` | a2i | field |  | quoted from sheet |
| 153 `F153` | Please select the range of total sales/turnover/gross receipts of business | field | AuditInfo.TotalSalesExcOneCr | quoted from sheet |
| 154 `E154` | a2ii | field |  | quoted from sheet |
| 154 `F154` | If “More than Rs. 1 crore and up to Rs. 10 crores” is selected at a2i, please select the percentage | field |  | quoted from sheet |
| 155 `E155` | a2iii | field |  | quoted from sheet |
| 155 `F155` | If “More than Rs. 1 crore and up to Rs. 10 crores” is selected at a2i, please select the percentage | field |  | quoted from sheet |
| 156 `E156` | b | field |  | quoted from sheet |
| 156 `F156` | Are you liable for audit under section 44AB? | field | AuditInfo.LiableSec44ABflg | quoted from sheet |
| 157 `F157` | If Yes is selected at (b), mention by virtue of which of the following conditions | field | AuditInfo.Cndnfor44AB | quoted from sheet |
| 161 `E161` | c | field |  | quoted from sheet |
| 161 `F161` | If (b) is Yes, whether the accounts have been audited by an accountant? furnish the following inform | field | AuditInfo.AuditAccountantFlg | quoted from sheet |
| 162 `G162` | Date of furnishing of the audit report (DD/MM/YYYY) | field | AuditInfo.AuditReportFurnishDate | quoted from sheet |
| 163 `N163` | Acknowledgement number of the audit report | field | AuditInfo.AckNum44AB | quoted from sheet |
| 166 `G166` | Name of the auditor (proprietorship/firm) | field | AuditInfo.AudFrmName | quoted from sheet |
| 168 `G168` | Permanent Account Number (PAN) of the proprietorship/ firm | field | AuditInfo.AudFrmPAN | quoted from sheet |
| 169 `E169` | g | field |  | quoted from sheet |
| 169 `G169` | Aadhaar of the proprietorship | field | AuditInfo.AudFrmAadhaar | quoted from sheet |
| 173 `E173` | d(i) | field |  | quoted from sheet |
| 173 `F173` | Are you liable for Audit u/s 92E? | field | AuditInfo.LiableSec92Eflg | quoted from sheet |
| 173 `V173` | d(ii) | field |  | quoted from sheet |
| 173 `W173` | If (di) is Yes, whether the accounts have been audited u/s. 92E? | field | AuditInfo.AccountAuditFlag | quoted from sheet |
| 174 `E174` | Date of audit report (DD/MM/YYYY) | field | AuditInfo.AuditDetails92E.DateOfAudit | quoted from sheet |
| 175 `E175` | Acknowledgement number | field | AuditInfo.AuditDetails92E.AckNum92E | quoted from sheet |
| 176 `E176` | (diii) If liable to furnish other audit report | field | AuditInfo.AuditDetails[].AuditedSection | quoted from sheet |
| 177 `E177` | Sl.No. | field |  | quoted from sheet |
| 177 `F177` | Section Code | field | AuditInfo.AuditReportDetails[].AuditedSection | quoted from sheet |
| 177 `N177` | Whether have you furnished such other audit report? If yes, please provide the details as under: | field | AuditInfo.AuditDetails[].AuditedSection | quoted from sheet |
| 177 `O177` | Date (dd/mm/yyyy) | field |  | quoted from sheet |
| 177 `P177` | Acknowledgement number | field | AuditInfo.AuditDetails92E.AckNum92E | quoted from sheet |
| 188 `E188` | If liable to audit under any Act other than the Income-tax Act, mention the Act, section and date of | field | AuditInfo.AuditReportDetails[].AuditReportAct | quoted from sheet |
| 189 `E189` | Sl.No. | field |  | quoted from sheet |
| 189 `F189` | Act | field | AuditInfo.AuditReportDetails[].AuditReportAct | quoted from sheet |
| 189 `O189` | Description | field | NatOfBus.NatureOfBusiness[].Description | quoted from sheet |
| 189 `X189` | Section | field | AuditInfo.AuditReportDetails[].AuditedSection | quoted from sheet |

Every `PartA_GEN2` schema leaf key, verbatim, mapped to this block (required keys marked `*`):

```
* AuditInfo.LiableSec44AAflg  [string]
* AuditInfo.IncDclrdUs  [string]
  AuditInfo.TotalSalesExcOneCr  [string]
  AuditInfo.AgrOFAllAmtsRcvd  [string]
  AuditInfo.AgrOFAllPayMade  [string]
* AuditInfo.LiableSec44ABflg  [string]
  AuditInfo.Cndnfor44AB  [string]
  AuditInfo.BiiDetails.44AD  [string]
  AuditInfo.BiiDetails.44ADA  [string]
  AuditInfo.BiiDetails.44AE  [string]
  AuditInfo.BiiDetails.44BB  [string]
  AuditInfo.AuditAccountantFlg  [string]
  AuditInfo.AuditReportFurnishDate  [string]
  AuditInfo.AckNum44AB  [integer]
  AuditInfo.AudFrmName  [string]
  AuditInfo.AudFrmPAN  [string]
  AuditInfo.AudFrmAadhaar  [string]
* AuditInfo.LiableSec92Eflg  [string]
* AuditInfo.AccountAuditFlag  [string]
* AuditInfo.AuditDetails92E.DateOfAudit  [string]
* AuditInfo.AuditDetails92E.AckNum92E  [integer]
  AuditInfo.AuditDetails[]  [array]
  AuditInfo.AuditDetails[].AuditedSection  [string]
  AuditInfo.AuditDetails[].AuditFlag  [string]
  AuditInfo.AuditDetails[].OthAuditDtls  [string]
  AuditInfo.AuditDetails[].DateOfAudit  [string]
  AuditInfo.AuditDetails[].AckNumOth  [integer]
  AuditInfo.AuditReportDetails[]  [array]
  AuditInfo.AuditReportDetails[].AuditReportAct  [string]
  AuditInfo.AuditReportDetails[].AuditReportActOthers  [string]
  AuditInfo.AuditReportDetails[].AuditedSection  [string]
  AuditInfo.AuditReportDetails[].OtherITActFlag  [string]
  AuditInfo.AuditReportDetails[].OthAuditDtlsOthThanITAct  [string]
  AuditInfo.AuditReportDetails[].DateOfAudit  [string]
  NatOfBus.NatureOfBusiness[]  [array]
* NatOfBus.NatureOfBusiness[].Code  [string]
  NatOfBus.NatureOfBusiness[].TradeName1  [string]
  NatOfBus.NatureOfBusiness[].Description  [string]
```

---

## The rules the sheet computes

The sheet's own formulas in this block are serial-number auto-increments for the repeating tables, plus a few conditional dropdown-source formulas. The substantive cross-field rules come from the department's rules document (`books/ITR-3/rules.json`) and are carried here with the cell they act on.

| Cell reference | What it computes / enforces |
|---|---|
| `E40` = `E39+1`, `E125`=`E124+1`, `E126`=`E125+1`, `E131`=`E130+1`, `E137`=`E136+1`, `E138`=`E137+1`, `E179`=`E178+1`, `E191`=`1+E190`, `E192`=`1+E191`, `E193`=`1+E192` | Sl. No. auto-increment down each repeating table (jurisdiction, directors, unlisted shares, partners, other-audit-reports, other-Act audits). |
| `W36:AT36` = `IF(MID(ResidentialStatus1,1,3)="RES",RES_Dropdown, ... NOR ... NRI ... Select1)` | The residential-status *conditions* dropdown is chosen by the first three letters of the residential-status answer (RES / NOR / NRI). |
| `AL54` = `IF(OR(oldbacValue="",oldbacValue=0),RngNone,IF(oldbacValue=1,RngBacYes,RngBacNo))` | Current-AY 115BAC option list switches on the earlier-year 115BAC value. |
| `AK47` / `AK51` = `IF(...oldbacValue=1,RngYear/RngYear2,RngNone)` | Assessment-year pick-lists appear only when 115BAC was opted earlier. |
| `AY27:AZ27` = `INDIRECT(IF(sheet1.Status<>"",MID(sheet1.Status,1,1),"Select"))` | Communication sub-list keyed off the first letter of Status (I / H). |
| `E11:AT11` source `$BB$9:$BB$11` | Address-block driver list. |
| Rule (rules.json): notice u/s 139(9)/142(1)/148 or order 119(2)(b) → **Unique Number / Document Identification Number (DIN) and date** are mandatory | drives row 34–35. |
| Rule: held unlisted equity shares = **Yes** → the unlisted-shares table must be filled | rows 133–138. |
| Rule: Director in a company = **Yes** → director table must be filled | rows 122–126. |
| Rule: governed by Portuguese Civil Code s.5A = Yes → Schedule 5A | row 112 area / `PortugeseCC5A`. |
| Rule: liable for audit u/s 44AB and accounts audited by an accountant = Yes → auditor and audit-report info mandatory | rows 161–169. |
| Rule: a2i = **More than Rs. 1 crore and up to Rs. 10 crores** → a2ii and a2iii cannot be left blank | rows 153–155. |
| Rule: a2ii or a2iii = **More than 5%** → liable to audit u/s 44AB | rows 154–156. |
| Rule: **Date of audit report cannot be after system date** | rows 162 / 174. |
| Rule: taxpayer must select the condition by virtue of which liable for audit u/s 44AB | row 157. |
| Rule: applicable **due date for filing** must be selected; if 31 Oct or 30 Nov selected, fill Schedule IF / 5A / audit details | row 29. |
| Rule: business income → answer A19(b)(I); no business income → A19(b)(II); Form 10IEA details mandatory when re-entering New Tax Regime | rows 62–79. |
| Rule: representative Email id and contact no must not match taxpayer's primary email/contact | rows 116–117. |
| Rule: **Secondary Address** is mandatory and must not equal Primary when 'same as primary' = No | rows 19–25. |
| Rule: FPI must be **Yes** to offer income u/s 115AD(1)(i) in Schedule OS | row 145. |
| Rule: liable for audit u/s 44AB → Part A BS and Part A P&L must be filled | row 156. |

---

## Dropdowns

Every dropdown list on the sheet, with every value. Source-only numeric lists (max-length / free-text validators such as `125`, `10`, `50`, `100000000000000`) carry no enumerated values and are omitted. Lists sharing an identical value set are grouped.

**List 1** — `W17:AD17 W24:AD24` (source `State`)

```
(Select)
01-ANDAMAN AND NICOBAR ISLANDS
02-ANDHRA PRADESH
03-ARUNACHAL PRADESH
04-ASSAM
05-BIHAR
06-CHANDIGARH
07-Dadra Nagar and Haveli
08-Daman and Diu
09-DELHI
10-GOA
11-GUJARAT
12-HARYANA
13-HIMACHAL PRADESH
14-JAMMU AND KASHMIR
15-KARNATAKA
16-KERALA
17-LAKHSWADEEP
18-MADHYA PRADESH
19-MAHARASHTRA
20-MANIPUR
21-MEGHALAYA
22-MIZORAM
23-NAGALAND
24-ODISHA
25-PUDUCHERRY
26-PUNJAB
27-RAJASTHAN
28-SIKKIM
29-TAMIL NADU
30-TRIPURA
31-UTTAR PRADESH
32-WEST BENGAL
33-CHHATTISGARH
34-UTTARAKHAND
35-JHARKHAND
36-TELANGANA
37-LADAKH
99-Foreign
```

**List 2** — `AE17:AN17 AE24:AN24` (source `Country`)

```
(Select)
93-AFGHANISTAN
1001-ALAND ISLANDS
355-ALBANIA
213-ALGERIA
684-AMERICAN SAMOA
376-ANDORRA
244-ANGOLA
1264-ANGUILLA
1010-ANTARCTICA
1268-ANTIGUA AND BARBUDA
54-ARGENTINA
374-ARMENIA
297-ARUBA
61-AUSTRALIA
43-AUSTRIA
994-AZERBAIJAN
1242-BAHAMAS
973-BAHRAIN
880-BANGLADESH
1246-BARBADOS
375-BELARUS
32-BELGIUM
501-BELIZE
229-BENIN
1441-BERMUDA
975-BHUTAN
591-BOLIVIA (PLURINATIONAL STATE OF)
1002-BONAIRE, SINT EUSTATIUS AND SABA
387-BOSNIA AND HERZEGOVINA
267-BOTSWANA
1003-BOUVET ISLAND
55-BRAZIL
1014-BRITISH INDIAN OCEAN TERRITORY
673-BRUNEI DARUSSALAM
359-BULGARIA
226-BURKINA FASO
257-BURUNDI
238-CABO VERDE
855-CAMBODIA
237-CAMEROON
1-CANADA
1345-CAYMAN ISLANDS
236-CENTRAL AFRICAN REPUBLIC
235-CHAD
56-CHILE
86-CHINA
9-CHRISTMAS ISLAND
672-COCOS (KEELING) ISLANDS
57-COLOMBIA
270-COMOROS
242-CONGO
243-CONGO (DEMOCRATIC REPUBLIC OF THE)
682-COOK ISLANDS
506-COSTA RICA
225-COTE DIVOIRE
385-CROATIA
53-CUBA
1015-CURACAO
357-CYPRUS
420-CZECHIA
45-DENMARK
253-DJIBOUTI
1767-DOMINICA
1809-DOMINICAN REPUBLIC
593-ECUADOR
20-EGYPT
503-EL SALVADOR
240-EQUATORIAL GUINEA
291-ERITREA
372-ESTONIA
251-ETHIOPIA
500-FALKLAND ISLANDS (MALVINAS)
298-FAROE ISLANDS
679-FIJI
358-FINLAND
33-FRANCE
594-FRENCH GUIANA
689-FRENCH POLYNESIA
1004-FRENCH SOUTHERN TERRITORIES
241-GABON
220-GAMBIA
995-GEORGIA
49-GERMANY
233-GHANA
350-GIBRALTAR
30-GREECE
299-GREENLAND
1473-GRENADA
590-GUADELOUPE
1671-GUAM
502-GUATEMALA
1481-GUERNSEY
224-GUINEA
245-GUINEA-BISSAU
592-GUYANA
509-HAITI
1005-HEARD ISLAND AND MCDONALD ISLANDS
6-HOLY SEE
504-HONDURAS
852-HONG KONG
36-HUNGARY
354-ICELAND
91-INDIA
62-INDONESIA
98-IRAN (ISLAMIC REPUBLIC OF)
964-IRAQ
353-IRELAND
1624-ISLE OF MAN
972-ISRAEL
5-ITALY
1876-JAMAICA
81-JAPAN
1534-JERSEY
962-JORDAN
7-KAZAKHSTAN
254-KENYA
686-KIRIBATI
850-KOREA (DEMOCRATIC PEOPLES REPUBLIC OF)
82-KOREA (REPUBLIC OF)
965-KUWAIT
996-KYRGYZSTAN
856-LAO PEOPLES DEMOCRATIC REPUBLIC
371-LATVIA
961-LEBANON
266-LESOTHO
231-LIBERIA
218-LIBYA
423-LIECHTENSTEIN
370-LITHUANIA
352-LUXEMBOURG
853-MACAO
389-MACEDONIA (THE FORMER YUGOSLAV REPUBLIC OF)
261-MADAGASCAR
265-MALAWI
60-MALAYSIA
960-MALDIVES
223-MALI
356-MALTA
692-MARSHALL ISLANDS
596-MARTINIQUE
222-MAURITANIA
230-MAURITIUS
269-MAYOTTE
52-MEXICO
691-MICRONESIA (FEDERATED STATES OF)
373-MOLDOVA (REPUBLIC OF)
377-MONACO
976-MONGOLIA
382-MONTENEGRO
1664-MONTSERRAT
212-MOROCCO
258-MOZAMBIQUE
95-MYANMAR
264-NAMIBIA
674-NAURU
977-NEPAL
31-NETHERLANDS
687-NEW CALEDONIA
64-NEW ZEALAND
505-NICARAGUA
227-NIGER
234-NIGERIA
683-NIUE
15-NORFOLK ISLAND
1670-NORTHERN MARIANA ISLANDS
47-NORWAY
968-OMAN
92-PAKISTAN
680-PALAU
970-PALESTINE, STATE OF
507-PANAMA
675-PAPUA NEW GUINEA
595-PARAGUAY
51-PERU
63-PHILIPPINES
1011-PITCAIRN
48-POLAND
14-PORTUGAL
1787-PUERTO RICO
974-QATAR
262-REUNION
40-ROMANIA
8-RUSSIAN FEDERATION
250-RWANDA
1006-SAINT BARTHELEMY
290-SAINT HELENA, ASCENSION AND TRISTAN DA CUNHA
1869-SAINT KITTS AND NEVIS
1758-SAINT LUCIA
1007-SAINT MARTIN (FRENCH PART)
508-SAINT PIERRE AND MIQUELON
1784-SAINT VINCENT AND THE GRENADINES
685-SAMOA
378-SAN MARINO
239-SAO TOME AND PRINCIPE
966-SAUDI ARABIA
221-SENEGAL
381-SERBIA
248-SEYCHELLES
232-SIERRA LEONE
65-SINGAPORE
1721-SINT MAARTEN (DUTCH PART)
421-SLOVAKIA
386-SLOVENIA
677-SOLOMON ISLANDS
252-SOMALIA
28-SOUTH AFRICA
1008-SOUTH GEORGIA AND THE SOUTH SANDWICH ISLANDS
211-SOUTH SUDAN
35-SPAIN
94-SRI LANKA
249-SUDAN
597-SURINAME
1012-SVALBARD AND JAN MAYEN
268-SWAZILAND
46-SWEDEN
41-SWITZERLAND
963-SYRIAN ARAB REPUBLIC
886-TAIWAN
992-TAJIKISTAN
255-TANZANIA, UNITED REPUBLIC OF
66-THAILAND
670-TIMOR-LESTE(EAST TIMOR)
228-TOGO
690-TOKELAU
676-TONGA
1868-TRINIDAD AND TOBAGO
216-TUNISIA
90-TURKEY
993-TURKMENISTAN
1649-TURKS AND CAICOS ISLANDS
688-TUVALU
256-UGANDA
380-UKRAINE
971-UNITED ARAB EMIRATES
44-UNITED KINGDOM OF GREAT BRITAIN AND NORTHERN IRELAND
2-UNITED STATES OF AMERICA
1009-UNITED STATES MINOR OUTLYING ISLANDS
598-URUGUAY
998-UZBEKISTAN
678-VANUATU
58-VENEZUELA (BOLIVARIAN REPUBLIC OF)
84-VIET NAM
1284-VIRGIN ISLANDS (BRITISH)
1340-VIRGIN ISLANDS (U.S.)
681-WALLIS AND FUTUNA
967-YEMEN
263-ZIMBABWE
260-ZAMBIA
1013-WESTERN SAHARA
9999-OTHERS
```

**List 3** — `Z45` (source `trasactionAct`); `AR112 AF151:AF152` (source `PortugueseCode`); `Z112:AE112` (source `"(Select),Yes,No"`); `AE144:AE145` (source `"(Select),Yes,No"`); `AM133:AT133` (source `"(Select),Yes,No"`); `AM122:AT122` (source `"(Select),Yes,No"`); +10 more cell(s)

Values: (Select) · Yes · No

**List 4** — `AP45:AT45 AK30:AT30` (source `ResiStatus`)

Values: (Select) · RES - Resident · NRI - Non Resident · NOR - Resident but not Ordinarily Resident

**List 5** — `AM114:AR114 AP161:AT161 AE140 AP156` (source `YesNoCode`); `Q173` (source `YesNoCode`)

Values: (Select) · Y - Yes · N -No

**List 6** — `F178:M184` (source `Section_code`)

Values: (Select) · 10A · 10AA · 44DA · 50B · 80-IA · 80-IB · 80-IC · 80-ID · 80-IE · 80JJAA · 80LA · 115JC

**List 7** — `AE18:AG18` (source `"(Select),Y"`); `AE25:AG25` (source `"(Select),Y"`)

Values: (Select) · Y

**List 8** — `F39:Z40` (source `Country_Juridiction`)

```
(Select)
93-AFGHANISTAN
1001-ALAND ISLANDS
355-ALBANIA
213-ALGERIA
684-AMERICAN SAMOA
376-ANDORRA
244-ANGOLA
1264-ANGUILLA
1010-ANTARCTICA
1268-ANTIGUA AND BARBUDA
54-ARGENTINA
374-ARMENIA
297-ARUBA
61-AUSTRALIA
43-AUSTRIA
994-AZERBAIJAN
1242-BAHAMAS
973-BAHRAIN
880-BANGLADESH
1246-BARBADOS
375-BELARUS
32-BELGIUM
501-BELIZE
229-BENIN
1441-BERMUDA
975-BHUTAN
591-BOLIVIA (PLURINATIONAL STATE OF)
1002-BONAIRE, SINT EUSTATIUS AND SABA
387-BOSNIA AND HERZEGOVINA
267-BOTSWANA
1003-BOUVET ISLAND
55-BRAZIL
1014-BRITISH INDIAN OCEAN TERRITORY
673-BRUNEI DARUSSALAM
359-BULGARIA
226-BURKINA FASO
257-BURUNDI
238-CABO VERDE
855-CAMBODIA
237-CAMEROON
1-CANADA
1345-CAYMAN ISLANDS
236-CENTRAL AFRICAN REPUBLIC
235-CHAD
56-CHILE
86-CHINA
9-CHRISTMAS ISLAND
672-COCOS (KEELING) ISLANDS
57-COLOMBIA
270-COMOROS
242-CONGO
243-CONGO (DEMOCRATIC REPUBLIC OF THE)
682-COOK ISLANDS
506-COSTA RICA
225-COTE DIVOIRE
385-CROATIA
53-CUBA
1015-CURACAO
357-CYPRUS
420-CZECHIA
45-DENMARK
253-DJIBOUTI
1767-DOMINICA
1809-DOMINICAN REPUBLIC
593-ECUADOR
20-EGYPT
503-EL SALVADOR
240-EQUATORIAL GUINEA
291-ERITREA
372-ESTONIA
251-ETHIOPIA
500-FALKLAND ISLANDS (MALVINAS)
298-FAROE ISLANDS
679-FIJI
358-FINLAND
33-FRANCE
594-FRENCH GUIANA
689-FRENCH POLYNESIA
1004-FRENCH SOUTHERN TERRITORIES
241-GABON
220-GAMBIA
995-GEORGIA
49-GERMANY
233-GHANA
350-GIBRALTAR
30-GREECE
299-GREENLAND
1473-GRENADA
590-GUADELOUPE
1671-GUAM
502-GUATEMALA
1481-GUERNSEY
224-GUINEA
245-GUINEA-BISSAU
592-GUYANA
509-HAITI
1005-HEARD ISLAND AND MCDONALD ISLANDS
6-HOLY SEE
504-HONDURAS
852-HONG KONG
36-HUNGARY
354-ICELAND
62-INDONESIA
98-IRAN (ISLAMIC REPUBLIC OF)
964-IRAQ
353-IRELAND
1624-ISLE OF MAN
972-ISRAEL
5-ITALY
1876-JAMAICA
81-JAPAN
1534-JERSEY
962-JORDAN
7-KAZAKHSTAN
254-KENYA
686-KIRIBATI
850-KOREA (DEMOCRATIC PEOPLES REPUBLIC OF)
82-KOREA (REPUBLIC OF)
965-KUWAIT
996-KYRGYZSTAN
856-LAO PEOPLES DEMOCRATIC REPUBLIC
371-LATVIA
961-LEBANON
266-LESOTHO
231-LIBERIA
218-LIBYA
423-LIECHTENSTEIN
370-LITHUANIA
352-LUXEMBOURG
853-MACAO
389-MACEDONIA (THE FORMER YUGOSLAV REPUBLIC OF)
261-MADAGASCAR
265-MALAWI
60-MALAYSIA
960-MALDIVES
223-MALI
356-MALTA
692-MARSHALL ISLANDS
596-MARTINIQUE
222-MAURITANIA
230-MAURITIUS
269-MAYOTTE
52-MEXICO
691-MICRONESIA (FEDERATED STATES OF)
373-MOLDOVA (REPUBLIC OF)
377-MONACO
976-MONGOLIA
382-MONTENEGRO
1664-MONTSERRAT
212-MOROCCO
258-MOZAMBIQUE
95-MYANMAR
264-NAMIBIA
674-NAURU
977-NEPAL
31-NETHERLANDS
687-NEW CALEDONIA
64-NEW ZEALAND
505-NICARAGUA
227-NIGER
234-NIGERIA
683-NIUE
15-NORFOLK ISLAND
1670-NORTHERN MARIANA ISLANDS
47-NORWAY
968-OMAN
92-PAKISTAN
680-PALAU
970-PALESTINE, STATE OF
507-PANAMA
675-PAPUA NEW GUINEA
595-PARAGUAY
51-PERU
63-PHILIPPINES
1011-PITCAIRN
48-POLAND
14-PORTUGAL
1787-PUERTO RICO
974-QATAR
262-REUNION
40-ROMANIA
8-RUSSIAN FEDERATION
250-RWANDA
1006-SAINT BARTHELEMY
290-SAINT HELENA, ASCENSION AND TRISTAN DA CUNHA
1869-SAINT KITTS AND NEVIS
1758-SAINT LUCIA
1007-SAINT MARTIN (FRENCH PART)
508-SAINT PIERRE AND MIQUELON
1784-SAINT VINCENT AND THE GRENADINES
685-SAMOA
378-SAN MARINO
239-SAO TOME AND PRINCIPE
966-SAUDI ARABIA
221-SENEGAL
381-SERBIA
248-SEYCHELLES
232-SIERRA LEONE
65-SINGAPORE
1721-SINT MAARTEN (DUTCH PART)
421-SLOVAKIA
386-SLOVENIA
677-SOLOMON ISLANDS
252-SOMALIA
28-SOUTH AFRICA
1008-SOUTH GEORGIA AND THE SOUTH SANDWICH ISLANDS
211-SOUTH SUDAN
35-SPAIN
94-SRI LANKA
249-SUDAN
597-SURINAME
1012-SVALBARD AND JAN MAYEN
268-SWAZILAND
46-SWEDEN
41-SWITZERLAND
963-SYRIAN ARAB REPUBLIC
886-TAIWAN
992-TAJIKISTAN
255-TANZANIA, UNITED REPUBLIC OF
66-THAILAND
670-TIMOR-LESTE(EAST TIMOR)
228-TOGO
690-TOKELAU
676-TONGA
1868-TRINIDAD AND TOBAGO
216-TUNISIA
90-TURKEY
993-TURKMENISTAN
1649-TURKS AND CAICOS ISLANDS
688-TUVALU
256-UGANDA
380-UKRAINE
971-UNITED ARAB EMIRATES
44-UNITED KINGDOM OF GREAT BRITAIN AND NORTHERN IRELAND
2-UNITED STATES OF AMERICA
1009-UNITED STATES MINOR OUTLYING ISLANDS
598-URUGUAY
998-UZBEKISTAN
678-VANUATU
58-VENEZUELA (BOLIVARIAN REPUBLIC OF)
84-VIET NAM
1284-VIRGIN ISLANDS (BRITISH)
1340-VIRGIN ISLANDS (U.S.)
681-WALLIS AND FUTUNA
1013-WESTERN SAHARA
260-ZAMBIA
9999-OTHERS
9998-Not Applicable (Not Resident in any Country)
```

**List 9** — `AG124:AJ126` (source `"(Select),Listed,Unlisted"`)

Values: (Select) · Listed · Unlisted

**List 10** — `AE118:AT118` (source `Dropdown_RepCapacity`)

Values: (Select) · Legal Heir · Manager · Guardian · Other

**List 11** — `F190:N193` (source `AuditDropDown`)

```
(Select)
Banking Regulation Act, 1949
Central Excise Act,1944
Central Sales Tax Act, 1956
Central Goods and Services Tax Act, 2017
Charitable And Religious Trusts Act, 1920
Companies Act, 2013
Electricity Act, 2003
Employees Provident Fund and Miscellaneous Provisions Act, 1952
Foreign Exchange Management Act, 1999
Government Superannuation Fund Act, 1956
Indian Trusts Act, 1882
Integrated Goods and Services Tax Act, 2017
Limited Liability Partnership Act, 2008
Payment of Gratuity Act, 1972
SEBI Act, 1992
Securities Contract (Regulation) Act, 1956
State Goods and Services Tax Act, 2017
Union Territories Goods and Services Tax Act, 2017
Others
```

**List 12** — `O124:W126` (source `"(Select),Domestic,Foreign"`); `N136:N138` (source `"(Select),Domestic,Foreign"`)

Values: (Select) · Domestic · Foreign

**List 13** — `AF153:AK153` (source `PortugueseCodeNewU`)

Values: (Select) · Up to Rs. 1 crore · More than Rs. 1 crore and up to Rs. 10 crores · More than Rs. 10 crores

**List 14** — `AE141:AJ141` (source `"(Select),Yes,No,NA"`)

Values: (Select) · Yes · No · NA

**List 15** — `AK54` (source `NTR_Current1`)

Values: (Select) · Opting in now · Not opting

**List 16** — `X29:AD29` (source `"31/08/2026,31/10/2026,30/11/2026"`)

Values: 31/08/2026 · 31/10/2026 · 30/11/2026

**List 17** — `AQ157:AT160` (source `"Y-Yes,N-No"`)

Values: Y-Yes · N-No

**List 18** — `V157:AM157` (source `Dropdown44Select`)

Values: bi-Sales, turnover or gross receipts exceeds the specified limits · bii-Assessee falling u/s 44AD/44ADA/44AE/44BB but not opting for offering income on presumptive basis · biii-Others

**List 19** — `X30` (source `ReturnFileUnderSection1`)

Values: (Select) · 139(1)- On or Before due date · 139(4)- After due date · 139(5)- Revised Return · 92CD-Modified return · 119(2)(b)- After condonation of delay · 139(8A)

**List 20** — `AK95:AT95` (source `BAC115.NA_New`); `AK90:AT90` (source `BAC115.No_New`); `AK85:AT85` (source `BAC115.Yes_New`)

Values: (Select) · No · Yes

**List 21** — `AK81:AT81` (source `BAC115.NY`)

Values: (Select) · No · Yes · Not Applicable

**List 22** — `AF80:AT80` (source `Sheet1.MethodofOptONTR`)

Values: (Select) · by filing 10IEA (having income from business or profession) · by exercising the option in the return of income only (form 10IEA is not applicable)

**List 23** — `AF155:AK155` (source `PercentageAgr_a2iii`); `AF154:AK154` (source `PercentageAgr_a2ii`)

Values: (Select) · Up to 5% · More than 5%

**List 24** — `AK65:AT65` (source `AssYr_Dropdown_IAi`)

Values: 2024-25 · 2025-26

**List 25** — `AK69:AT69` (source `AssYr_Dropdown_IAiia`)

Values: 2025-26

---

## What repeats and what is one figure

**Arrays (repeat, `[]` in schema):**

- `FilingStatus.JurisdictionResPrevYr.JurisdictionResPrevYrDtls[]` — jurisdiction(s) of residence (hidden sub-form).
- `FilingStatus.clauseiv7provisio139iDtls[]` — clause (iv) seventh-proviso nature + amount.
- `FilingStatus.CompDirectorPrvYr.CompDirectorPrvYrDtls[]` — directorships (rows 123–126).
- `FilingStatus.PartnerInFirm.PartnerInFirmDtls[]` — partnerships (rows 129–131).
- `FilingStatus.HeldUnlistedEqShrPrYr.HeldUnlistedEqShrPrYrDtls[]` — unlisted equity shares (rows 134–138).
- `AuditInfo.AuditDetails[]` — other audit reports under the Income-tax Act (rows 177–184).
- `AuditInfo.AuditReportDetails[]` — audits under Acts other than the Income-tax Act (rows 189–193).
- `NatOfBus.NatureOfBusiness[]` — nature-of-business code / trade name / description.

**Single figures:** everything else — `PersonalInfo` name/PAN/status/DOB/addresses/communication, the whole `FilingStatus` header (section, notice, receipt, residential status, regime flags, seventh-proviso flags, PE/SEP, IFSC, FPI, LEI, representative), and the single `AuditInfo` 44AA/44AB/92E answers, auditor and audit-report fields.

---

## Mandatory

The schema `required` leaf keys that must carry a value.

**PartA_GEN1** (block required: `PersonalInfo`, `FilingStatus`):

```
PersonalInfo.AssesseeName.SurNameOrOrgName
PersonalInfo.PAN
PersonalInfo.Address.ResidenceNo
PersonalInfo.Address.LocalityOrArea
PersonalInfo.Address.CityOrTownOrDistrict
PersonalInfo.Address.StateCode
PersonalInfo.Address.CountryCode
PersonalInfo.Address.Phone.STDcode
PersonalInfo.Address.Phone.PhoneNo
PersonalInfo.Address.CountryCodeMobile
PersonalInfo.Address.MobileNo
PersonalInfo.Address.EmailAddress
PersonalInfo.SecondaryAdd
PersonalInfo.AlternateAddress.ResidenceNo
PersonalInfo.AlternateAddress.LocalityOrArea
PersonalInfo.AlternateAddress.CityOrTownOrDistrict
PersonalInfo.AlternateAddress.StateCode
PersonalInfo.DOB
PersonalInfo.Status
FilingStatus.ReturnFileSec
FilingStatus.IncFrmBusOrProf
FilingStatus.SeventhProvisio139
FilingStatus.clauseiv7provisio139iDtls[].clauseiv7provisio139iNature
FilingStatus.clauseiv7provisio139iDtls[].clauseiv7provisio139iAmount
FilingStatus.ResidentialStatus
FilingStatus.JurisdictionResPrevYr.JurisdictionResPrevYrDtls[].JurisdictionResidence
FilingStatus.JurisdictionResPrevYr.JurisdictionResPrevYrDtls[].TIN
FilingStatus.AssesseeRep.RepName
FilingStatus.AssesseeRep.RepEmailID
FilingStatus.AssesseeRep.CountryCodeRepMobileNo
FilingStatus.AssesseeRep.RepMobileNo
FilingStatus.CompDirectorPrvYr.CompDirectorPrvYrDtls[].NameOfCompany
FilingStatus.CompDirectorPrvYr.CompDirectorPrvYrDtls[].CompanyType
FilingStatus.CompDirectorPrvYr.CompDirectorPrvYrDtls[].SharesTypes
FilingStatus.PartnerInFirm.PartnerInFirmDtls[].NameOfFirm
FilingStatus.PartnerInFirm.PartnerInFirmDtls[].PAN
FilingStatus.HeldUnlistedEqShrPrYrFlg
FilingStatus.HeldUnlistedEqShrPrYr.HeldUnlistedEqShrPrYrDtls[].NameOfCompany
FilingStatus.HeldUnlistedEqShrPrYr.HeldUnlistedEqShrPrYrDtls[].CompanyType
FilingStatus.HeldUnlistedEqShrPrYr.HeldUnlistedEqShrPrYrDtls[].OpngBalNumberOfShares
FilingStatus.HeldUnlistedEqShrPrYr.HeldUnlistedEqShrPrYrDtls[].OpngBalCostOfAcquisition
FilingStatus.HeldUnlistedEqShrPrYr.HeldUnlistedEqShrPrYrDtls[].ClsngBalNumberOfShares
FilingStatus.HeldUnlistedEqShrPrYr.HeldUnlistedEqShrPrYrDtls[].ClsngBalCostOfAcquisition
FilingStatus.ForeignExchangeFlag
FilingStatus.FiiFpiFlag
FilingStatus.ItrFilingDueDate
```

**PartA_GEN2** (block required: `AuditInfo`):

```
AuditInfo.LiableSec44AAflg
AuditInfo.IncDclrdUs
AuditInfo.LiableSec44ABflg
AuditInfo.LiableSec92Eflg
AuditInfo.AccountAuditFlag
AuditInfo.AuditDetails92E.DateOfAudit
AuditInfo.AuditDetails92E.AckNum92E
NatOfBus.NatureOfBusiness[].Code
```

Note — the single hard schema annotation on the sheet: `EmailAddress` — *Email Id is required for receiving copy of ITR-V* (maxLength 125).

---

## Hidden rows — not built

These rows are hidden in the utility (marked `H`). They are NOT built as items; they are legacy/conditional Form 10IE/10-IEA regime machinery for earlier AYs, the residential-status conditions sub-form, and representative/auditor detail rows the utility keeps collapsed. Listed here only for completeness.

| Row | Hidden label (as the sheet states it) |
|---|---|
| 31 | [E31] "Tax payer is required to select section as "139(8A) in Part A General" while filing corrected retur |
| 36 | [E36] Conditions for Residential Status (Applicable for Individuals Only)  \|  [W36] (Select) |
| 37 | [E37] (i) Please specify the jurisdiction(s) of residence during the previous year - |
| 38 | [E38] Sl.No.  \|  [F38] Jurisdiction(s) of residence |
| 39 | [F39] (Select) |
| 40 | [F40] (Select) |
| 42 | [E42] (ii) In case you are a Citizen of India or a Person of Indian Origin (POI), please specify - |
| 43 | [E43] Total period of stay in India during the previous year (in days) |
| 44 | [E44] Total period of stay in India during the 4 preceding years (in days) |
| 45 | [E45] Aadhaar |
| 46 | [E46] Have you ever opted for new tax regime u/s 115BAC in earlier years ? |
| 47 | [E47] Assessment Year in which said option was exercised |
| 48 | [E48] Date of filing of Form 10IE (DD/MM/YYYY) |
| 49 | [E49] Acknowledgment number |
| 50 | [E50] Have you ever opted out of section 115BAC in earlier years? |
| 51 | [E51] Assessment Year in which said option was opted out |
| 52 | [E52] Date of filing of Form 10IE (DD/MM/YYYY) |
| 53 | [E53] Acknowledgment number |
| 54 | [E54] Option for current assessment year (select opting in now if you are opting in first time) |
| 55 | [E55] For other than not opting,Continue to opt & Not eligible to opt in please furnish |
| 56 | [E56] Date of filing of Form 10IE (DD/MM/YYYY) |
| 57 | [E57] Acknowledgment number |
| 58 | [E58] Have you exercised the option u/s 115BAC(6) of Opting out of new tax regime? 1. By selecting "No" op |
| 59 | [E59] (If option other than ‘No’ is selected, please furnish date of filing and Acknowledgement number of |
| 60 | [E60] Date of filing |
| 61 | [E61] Acknowledgement number of form 10-IEA |
| 80 | [E80] Method of opting-out of new tax regime for current AY  by filing 10IEA (having income from business |
| 81 | [E81] Have you exercised the option u/s 115BAC(6) of Opting out of new tax regime in Form 10-IEA in AY 202 |
| 82 | [E82] (a)  \|  [F82] If ‘Yes’, please furnish date of filing and Acknowledgement number of Form 10-IEA for AY 2024-25 |
| 83 | [F83] Date of filing of form 10-IEA for AY 2024-25 |
| 84 | [F84] Acknowledgement number of form 10-IEA for AY 2024-25 |
| 85 | [F85] (i)  \|  [N85] Do you wish to continue to opt out of New Tax Regime for current assessment year  Yes  No |
| 86 | [O86] (If ‘No’, please furnish date of filing and Acknowledgement number of Form 10-IEA for AY 2025-26) |
| 87 | [O87] Date of filing of Form 10-IEA for AY 2025-26 |
| 88 | [O88] Acknowledgement number of Form 10-IEA for AY 2025-26 |
| 89 | [E89] (b)  \|  [F89] Please select ‘No’, even if Form 10IEA was filed after due date for AY 2024-25 |
| 90 | [F90] (i)  \|  [N90] Do you wish to opt out of New Tax Regime for current assessment year  Yes  No |
| 91 | [O91] (If ‘Yes’, please furnish date of filing and Acknowledgement number of Form 10-IEA for AY 2025-26) |
| 92 | [O92] Date of filing of Form 10-IEA for AY 2025-26 |
| 93 | [O93] Acknowledgement number of Form 10-IEA for AY 2025-26 |
| 94 | [E94] (c)  \|  [F94] Return was filed in ITR Form 1/ Form 2/ ITR 3 without requirement of Form 10-IEA for AY 2024-25 |
| 95 | [F95] (i)  \|  [N95] Do you wish to opt out of New Tax Regime for current assessment year  Yes  No |
| 96 | [O96] (If ‘Yes’, please furnish date of filing and Acknowledgement number of Form 10-IEA for AY 2025-26) |
| 97 | [O97] Date of filing of Form 10-IEA for AY 2025-26 |
| 98 | [O98] Acknowledgement number of Form 10-IEA for AY 2025-26 |
| 99 | [E99] Do you wish to opt out of New Tax Regime for current assessment year  Yes  No |
| 100 | [E100] Note- Option under section 115BAC(6) should be exercised in Form 10IEA on or before the due date for |
| 111 | [E111] Aadhaar Enrolment Id [Note: If Aadhaar Number is not yet allotted, then Aadhaar Enrolment Id is requ |
| 113 | [E113] Passport No. (Individual) (If available) |
| 118 | [E118] b  \|  [N118] Capacity of representative |
| 119 | [E119] c  \|  [G119] Address of the representative |
| 120 | [E120] d  \|  [G120] Permanent Account Number (PAN) of the Representative |
| 121 | [E121] e  \|  [N121] Aadhaar Number of the representative |
| 164 | [E164] b  \|  [G164] Name of the auditor signing the tax audit report |
| 165 | [E165] c  \|  [G165] Membership no. of the auditor |
| 167 | [E167] e  \|  [N167] Proprietorship/firm registration number |
| 170 | [G170] Date of audit report. |
| 171 | [N171] Acknowledgement number of the audit report |
| 172 | [E172] j  \|  [N172] UDIN |

---

## What this means for the build

- Build only the **106 visible rows**; keep the 61 hidden rows unbuilt (constitution rule 1). Item lettering in Audit Information follows the sheet's own tags (**a1, a2, a2i, a2ii, a2iii, b, c, d(i), d(ii), (diii)**, and the other-Act table), not row counting (rule 5).
- Two schema blocks feed one sheet: `PartA_GEN1` (PersonalInfo + FilingStatus) and `PartA_GEN2` (AuditInfo + NatOfBus). The section-builder must write/read both.
- The eight arrays above need add-row grids; everything else is a single field. Sl.No. columns are auto-incremented by the sheet (`=prev+1`) — the builder must not treat them as user input.
- Yes/No gates open sub-forms: Director → director table; Partner → partner table; unlisted shares → shares table; representative assessee → representative block; seventh proviso / clause (iv) → the flags and clause-iv table; FPI → SEBI Regn. No; LEI needed when refund ≥ ₹50 crore; non-resident → PE / SEP / IFSC.
- Audit gates: 44AA liability, 44AB liability (with the a2i turnover band driving a2ii/a2iii percentage and thereby 44AB), accountant-audited flag opening auditor + audit-report fields, 92E audit, and the other-audit-report and other-Act tables.
- Regime handling (rows 62–79 visible; 46–61 and 80–100 hidden) is the Form 10IEA new/old-regime flow; wire the visible A19(b)(I)/(II) branch and the current-AY 10-IEA acknowledgement/date fields, leaving the hidden earlier-AY 10IE/10-IEA rows unbuilt.
- Validators to honour: DIN + date mandatory on notice/order filing; audit-report date not after system date; secondary address mandatory and distinct from primary; representative email/contact must differ from the taxpayer's primary; due-date selection (31/08, 31/10, 30/11) drives Schedule IF/5A/audit requirements.
