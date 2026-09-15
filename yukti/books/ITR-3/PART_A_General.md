# The book of PART A - General · ITR-3, A.Y. 2026-27

Read row by row with `python3 tools/dump.py --form ITR-3 --sheet "PART A - General"`
(sheet3.xml, 201 rows, 61 hidden → 140 visible), a second pass with `--formulas`,
`--dropdowns "PART A - General"`, and the two schema blocks this sheet carries,
`PartA_GEN1` and `PartA_GEN2` (`--schema` / `--leaves`). Every label, code and
dropdown value below is quoted from those dumps or from the raw sheet3.xml /
`ITR-3_2026_Main_V1_1_schema.json` when a dump truncated it; none of it is
carried over from the ITR-2 book, which is consulted only for prose style.

`books/ITR-3/structure.md` and `section_map.json` record that this ONE sheet
feeds TWO of the pipeline's sections (`who` for personal info + audit info,
`ret` for filing/regime/director-partner-unlisted flags) — that split does not
change anything here: this book covers the whole sheet, top to bottom.

`PartA_GEN2` is **split across two sheets**: its `AuditInfo` object lives on
*this* sheet (rows 150-193); its `NatOfBus` object (`NatureOfBusiness[]`, one
required leaf `Code`) lives on the separate **Nature Of Business** sheet
(sheet5.xml) and is that sheet-reader's book, not this one. It is mentioned
here only so the gate's schema-leaf check (which walks the whole block) is not
mistaken for a missed item.

---

## The shape

Part A – General is the "who is filing, and under what circumstances" sheet:
name, PAN, status (individual/HUF), both addresses, how to be contacted, which
section the return is filed under and its due date, the current-year
old-regime/new-regime election under section 115BAC(6) via Form 10-IEA, the
seventh-proviso-to-139(1) mandatory-filing conditions, Aadhaar/115H/Portuguese
Code/representative/FPI/LEI particulars, and three small repeating tables
(director, partner, unlisted equity shares). Then, lower on the same physical
sheet, a second logical block — **Audit Information** — asks whether books
must be kept (44AA), whether the account is audited (44AB) and by whom, the
transfer-pricing audit (92E), and any audit under an Act other than the
Income-tax Act. The sheet's own header: `FORM` `ITR-3` `INDIAN INCOME TAX
RETURN` `[For individuals and HUFs having income from profits and gains
business or profession]` (C3/E3/N3/N4), Assessment Year `2026-27` (AN3/AN4).

The A.Y. 2026-27 utility carries a full **second copy** of last year's
115BAC(6) opt-in/opt-out interview (rows 36-100) that is hidden throughout —
replaced by a new, visible Form 10-IEA interview at rows 62-79. See "Hidden
rows" below.

---

## The items

### PartA_GEN1 · Personal information (rows 7-9)

| Item | Field (sheet text) | Type | Schema key | Rule / notes |
|---|---|---|---|---|
| — | First Name (E7) | string, maxLength 25 | `FirstName` | optional |
| — | Middle Name (O7) | string, maxLength 25 | `MiddleName` | optional |
| — | Last Name (W7) | string, maxLength 75 | `SurNameOrOrgName` | **required** — "Enter Last or Sur name for Individual or HUF name here" |
| — | PAN (AK7) | string, pattern `[A-Z]{5}[0-9]{4}[A-Z]` | `PAN` | **required** |
| — | Date of Commencement of Business (DD/MM/YYYY) (E9) | date | `DateofBusCommencement` | optional |
| — | Date of Birth/Formation (DD/MM/YYYY) (W9) | date | `DOB` | **required**; "maximum date allowed 2026-03-31" |
| — | Status (I-Individual,H-HUF) (AK9) | enum `I`,`H` | `Status` | **required**; helper cells BB9/BB10/BE10/BF10/BB11 spell out "I-INDIVIDUAL" and "H-HUF" next to the dropdown (its own validation formula is one of the entries `--dropdowns` could not resolve to a literal list — see *Unreadable*) |

### PartA_GEN1 · Primary and secondary address (rows 11-25)

Sheet heading (E11): *"Addresses to be provided for communication purposes."*

| Item | Field (sheet text) | Type | Schema key | Rule / notes |
|---|---|---|---|---|
| — | Primary Address (E12) | — | `Address` | section heading |
| — | Flat/ Door/ Block No. (E13) | string, maxLength 50 | `ResidenceNo` | **required** |
| — | Name of Premises / Building / Village (W13) | string, maxLength 50 | `ResidenceName` | optional |
| — | Road / Street / Post Office (AE13) | string, maxLength 50 | `RoadOrStreet` | optional |
| — | Area / Locality (AK13) | string, maxLength 50 | `LocalityOrArea` | **required** |
| — | Town/City/District (E16) | string, maxLength 50 | `CityOrTownOrDistrict` | **required** |
| — | State (W16, dropdown W17 = 38 codes) | enum, 38 codes | `StateCode` | **required** |
| — | Country (AE16, dropdown AE17 = 250 codes) | enum, 250 codes | `CountryCode` | **required** |
| — | Pin Code (AO16) | integer, 100000-999999 | `PinCode` | optional (India) |
| — | No Zip Code? (E18, dropdown AE18:AG18 = `(Select)`,`Y`) | checkbox | — | ticks that the address is foreign / has no PIN |
| — | Zip Code (AH18) | string, maxLength 8 | `ZipCode` | optional (foreign address) |
| — | Is the secondary address same as primary address? (E19, dropdown AK19) | enum `Y`,`N` (shown Yes/No) | `SecondaryAdd` | **required** |
| — | Secondary Address (E20) | — | `AlternateAddress` | section heading, opens on `SecondaryAdd`=N |
| — | Flat/ Door/ Block No. (E21) | string, maxLength 50 | `AlternateAddress.ResidenceNo` | **required** |
| — | Name of Premises / Building / Village (W21) | string, maxLength 50 | `AlternateAddress.ResidenceName` | optional |
| — | Road/ Street/Post office (AE21) | string, maxLength 50 | `AlternateAddress.RoadOrStreet` | optional |
| — | Area/ Locality (AK21) | string, maxLength 50 | `AlternateAddress.LocalityOrArea` | **required** |
| — | Town/ City/ District (E23) | string, maxLength 50 | `AlternateAddress.CityOrTownOrDistrict` | **required** |
| — | State (W23, dropdown W24 = 38 codes) | enum, 38 codes | `AlternateAddress.StateCode` | **required** |
| — | Country (AE23, dropdown AE24 = 250 codes) | enum, 250 codes | `AlternateAddress.CountryCode` | optional |
| — | PIN Code (AO23) | integer | `AlternateAddress.PinCode` | optional |
| — | NO Zip Code (E25, dropdown AE25:AG25 = `(Select)`,`Y`) | checkbox | — | as above |
| — | ZIP Code (AH25) | string, maxLength 8 | `AlternateAddress.ZipCode` | optional |

Rules #49/#50 (rules.json, cat A): a secondary address is mandatory to
provide, and when `SecondaryAdd`=N it must not equal the primary address.

### PartA_GEN1 · Communication (row 27)

| Item | Field (sheet text) | Type | Schema key | Rule / notes |
|---|---|---|---|---|
| — | Primary Email ID of the taxpayer (E27) | string, maxLength 125 | `EmailAddress` | **required** — "required for receiving copy of ITR-V" |
| — | Secondary Email ID (N27) | string, maxLength 125 | `EmailAddressSec` | optional |
| — | Primary Mobile no of the taxpayer (W27) | integer | `MobileNo` | **required**, with `CountryCodeMobile` **required** |
| — | (STD code) (AA27) | integer, 0-99999 | `Phone.STDcode` | **required** *if* `Phone` given |
| — | Residential/Office Phone (AE27) | string, ≤12 digits | `Phone.PhoneNo` | **required** *if* `Phone` given |
| — | Secondary Mobile no (AK27) | integer | `MobileNoSec` (+ `CountryCodeMobileNoSec`) | optional |

### PartA_GEN1 · Filing (rows 28-35)

| Item | Field (sheet text) | Type | Schema key | Rule / notes |
|---|---|---|---|---|
| — | Filed u/s (N30, dropdown X30 = `ReturnFileUnderSection1`) | integer enum 11-21 | `ReturnFileSec` | **required**; BB28 = `VLOOKUP(sheet1.ReturnFileSec, ReturnFileUnderSection, 2, FALSE)` redisplays the code's label |
| — | Filed in response to notice u/s (Q30) | — | `ReturnFileSec` (same field) | no dropdown of its own was found on Q30 — the notice-section codes (142(1)/148/153C/139(9)) are entered through the *same* X30 cell once VBA swaps in the alternate list (see *The rules*) |
| — | Due date for filing return of income (E29, dropdown X29 = 3 literal dates) | enum, 3 dates | `ItrFilingDueDate` | **required** |
| — | If revised/defective/Modified, enter Receipt no (E32) | string, pattern 15 digits | `ReceiptNo` | required for 139(5)/139(9)/92CD |
| — | Date of filing of Original Return (DD/MM/YYYY) (AF32) | date | `OrigRetFiledDate` | pairs with the receipt no. |
| — | If filed, in response to a notice u/s 139(9)/142(1)/148/153C or order u/s 119(2)(b), enter Unique Number/Document Identification Number and date of such notice/order, or if filed u/s 92CD enter date of advance pricing agreement (E34) | — | — | instruction row, no cell of its own |
| — | Unique Number/ Document Identification Number (E35) | string, maxLength 100 | `NoticeNo` | required when responding to a notice |
| — | Date or if filed u/s 92CD enter date of advance pricing agreement (AF35) | date | `NoticeDate` | this one cell does double duty — notice date, or the 92CD advance-pricing-agreement date; the schema has no separate key for the APA date (see *What this means for the build*) |
| — | Residential Status in India (For Individuals) (Tick applicable option) (AE30, dropdown AK30 = `ResiStatus`) | enum `RES`,`NRI`,`NOR` | `ResidentialStatus` | **required** |

### PartA_GEN1 · Form 10-IEA — regime election for the current year (rows 62-79, all VISIBLE)

Item **A19(b)** in the department's own numbering (rules.json #39/#40/#46 cite
"Sl. No. A19(b)(I)" / "A19(b)(II)" / "A19b" for this exact question):

| Item | Field (sheet text) | Type | Schema key | Rule / notes |
|---|---|---|---|---|
| A19(b) | Do you have income from business or profession for current Assessment Year? (E62, dropdown AK62) | enum `Y`,`N` | `IncFrmBusOrProf` | **required**; rule #39 makes the (I) branch mandatory on Yes, rule #40 makes (II) mandatory on No |
| (I) | If answer to A19(b) is Yes, have you filed form10IEA within due date for any earlier assessment year for choosing old tax regime? (F63/N63, dropdown AK63 = `Form10IEAoldtax_IAi`) | enum `Y`,`N` | `Form10IEAEarlierAYOldRegime` | |
| (I)(A)(i) | Furnish form 10IEA acknowledgement number and assessment year for which this form for choosing old tax regime was filed (N64/O64) — Assessment Year (O65, dropdown AK65 = `AssYr_Dropdown_IAi`) / Acknowledgement Number (O66) | enum 2 AYs / integer | `Form10IEAAssYear` / `Form10IEAEarlierAYAckOldRegime` | |
| (I)(A)(ii) | Have you filed ITR 3/4 in past and have re-entered new tax regime by filing form 10IEA for any assessment year subsequent to assessment year in which first form 10IEA was filed for choosing old tax regime? (F67/N67, dropdown AK67 = `Form10IEAoldtax_IA`) | enum `Y`,`N` | `F10IEAEarlierAYNewRegime` | |
| (I)(A)(ii)(a) | acknowledgement number of second form 10IEA and assessment year (N68/O68) — Assessment Year (O69, dropdown AK69 = `AssYr_Dropdown_IAiia`, one value) / Acknowledgement Number (O70) | enum 1 AY / integer | `AssYrF10IEANewTaxReg` / `Form10IEAEarlierAYAckNewRegime` | |
| (I)(A)(ii)(b) | If answer to (I)(A)(ii) is No, have you furnished form 10IEA for re-entering in new tax regime in current assessment year? (F71/N71, dropdown AK71 = `Form10IEANewTax_Iaiib`) | enum `Y`,`N` | `F10IEACurrAYNewRegime` | |
| (I)(A)(ii)(b)(i) | ack. number of form 10IEA and furnish ITR in new tax regime (N72/O72) — Date of filing (O73) / Acknowledgement Number (O74) | date / integer | `F10IEADateCurrAYNewTax` / `F10IEAAckNoCurrAYNewTax` | |
| — | If answer to (I) is No, have you furnished form 10IEA within due date for current assessment year for choosing old tax regime? (N75, dropdown AK75 = `Form10IEANewTax_IB`) | enum `Y`,`N` | `F10IEACurrAYOldRegime` | this is the (I)(B) trigger |
| (I)(B) / (I)(B)(i) | ack. number of form 10IEA, furnish return in old tax regime (F76/N76/O76) — Date of filing (O77) / Acknowledgement Number (O78) | date / integer | `F10IEADateCurrAYOldTax` / `F10IEAAckNoCurrAYOldTax` | |
| A19(b)(II) | Do you wish to opt for old tax regime for the current Assessment Year? (E79, dropdown AK79 = `Form10IEA_II`) | enum `Y`,`N` | `OptOldRegimeCurrAY` | **required** |

### PartA_GEN1 · Seventh proviso to section 139(1) (rows 101-109)

| Item | Field (sheet text) | Type | Schema key | Rule / notes |
|---|---|---|---|---|
| — | Are you filing return of income under Seventh proviso to Section 139(1) – (Tick) Yes No If yes, please furnish following information [Note: To be filled only if a person is not required to furnish a return of income under section 139(1) but filing return of income due to fulfilling one or more conditions mentioned in the seventh proviso to section 139(1)] (E101, dropdown AK101) | enum `Y`,`N` | `SeventhProvisio139` | **required** |
| — | Have you deposited amount or aggregate of amounts exceeding Rs. 1 Crore in one or more current account during the previous year? (Yes/No) (E102) | enum `Y`,`N` + amount | `DepAmtAggAmtExcd1CrPrYrFlg` + `AmtSeventhProvisio139i` (min ₹1 crore) | |
| — | Have you incurred expenditure of an amount or aggregate of amount exceeding Rs. 2 lakhs for travel to a foreign country for yourself or for any other person (E103) | enum `Y`,`N` + amount | `IncrExpAggAmt2LkTrvFrgnCntryFlg` + `AmtSeventhProvisio139ii` (min ₹2 lakh) | |
| — | Have you incurred expenditure of amount or aggregate of amount exceeding Rs. 1 lakh on consumption of electricity during the previous year? (Yes/No) (E104) | enum `Y`,`N` + amount | `IncrExpAggAmt1LkElctrctyPrYrFlg` + `AmtSeventhProvisio139iii` (min ₹1 lakh) | |
| — | Are you required to file a return as per other conditions prescribed under clause (iv) of seventh proviso to section 139(1) (If yes, please furnish following information) (E105) | enum `Y`,`N` | `clauseiv7provisio139i` | |
| 1 | (i) if his total sales, turnover or gross receipts, as the case may be in the business exceeds sixty lakh rupees during the previous year; or (E106) | condition code `1` | `clauseiv7provisio139iDtls[].clauseiv7provisio139iNature` = `"1"` | table row, + `clauseiv7provisio139iAmount` |
| 2 | (ii) if his total gross receipts in profession exceeds ten lakh rupees during the previous year; or (E107) | condition code `2` | `...Nature` = `"2"` | |
| 3 | (iii) if the aggregate of tax deducted at source and tax collected at source during the previous year, in the case of the person, is twenty-five thousand rupees (fifty-thousand for resident senior citizen) or more; or (E108) | condition code `3` | `...Nature` = `"3"` | |
| 4 | (iv) The deposits in one or more savings bank account of the person, in aggregate, is rupees fifty lakh or more, during the previous year. (E109) | condition code `4` | `...Nature` = `"4"` | |

Rows 106-109 are the four static condition texts of clause (iv); they are
selected (one or more) as rows of the `clauseiv7provisio139iDtls[]` array,
each with its own `clauseiv7provisio139iAmount`, rather than being four
separate yes/no cells.

### PartA_GEN1 · Other particulars (rows 110-149)

| Item | Field (sheet text) | Type | Schema key | Rule / notes |
|---|---|---|---|---|
| — | Aadhaar Number [Please enter the Aadhaar Number. Applicable to Individual only] (E110) | string, 12 digits | `AadhaarCardNo` | optional in the schema; rules #22/#23 (cat B, advisory) flag Aadhaar-PAN linking under section 139AA |
| — | Do you want to claim the benefit u/s 115H (Applicable in case of Resident)? (E112, dropdown Z112:AE112) | enum `Y`,`N` | `BenefitUs115HFlg` | |
| — | Are you governed by Portuguese Civil Code as per section 5A? (If "YES" please fill Schedule 5A) (AF112, dropdown AR112 = `PortugueseCode`, default "No") | enum `Y`,`N` | `PortugeseCC5A` | on Yes, Schedule 5A (a different sheet) is mandatory — rule #7 |
| — | Whether this return is being filed by a representative assessee? If yes, please furnish following information (E114, dropdown AM114 = `YesNoCode`) | enum `Y`,`N` | `AsseseeRepFlg` | rule #10 |
| — | Name of the representative assessee (G115) | string, maxLength 125 | `AssesseeRep.RepName` | **required** if representative |
| — | Email-ID of the representative assessee (N116) | string, maxLength 125 | `AssesseeRep.RepEmailID` | **required**; rule #47 — must not equal the taxpayer's own primary email |
| — | Contact number of the representative assessee (N117) | integer (+ country code) | `AssesseeRep.RepMobileNo` / `CountryCodeRepMobileNo` | **required**; rule #47 — must not equal the taxpayer's own primary mobile |
| — | Whether you are Director in a company at any time during the previous year? If yes, please furnish following information - (E122, dropdown AM122) | enum `Y`,`N` | `CompDirectorPrvYrFlg` | rule #11 |
| — | *(director table, rows 123-126 — see "What repeats")* | | | |
| — | Whether you are a Partner in a Firm? If yes, please furnish following information - (E128, dropdown AM128) | enum `Y`,`N` | `PartnerInFirmFlg` | |
| — | *(partner table, rows 129-131 — see "What repeats")* | | | |
| — | Whether you have held unlisted equity shares at any time during the previous year? If yes, please furnish following information - (E133, dropdown AM133) | enum `Y`,`N` | `HeldUnlistedEqShrPrYrFlg` | **required**; rule #6 |
| — | *(unlisted-equity-shares table, rows 134-138 — see "What repeats")* | | | |
| — | In case of non-resident, is there a permanent establishment (PE) in India? (E140) | enum `Y`,`N` | `NriPEinIndia` | |
| — | In the case of non-resident, is there a Significant Economic Presence (SEP) in India (E141, dropdown AE141) | enum `Y`,`N`,`NA` | `NriSEPinIndia` | |
| — | please provide details of (a) aggregate of payments arising from the transaction or transactions during the previous year (E142) | number | `AggrPaymentTransac` | SEP threshold detail |
| — | (b) number of users in India as referred in Explanation 2A(b) to Section 9(1)(i) (E143) | number | `NumberOfUsers` | SEP threshold detail |
| — | Whether assessee has a unit in an International Financial Services Centre and derives income solely in convertible foreign exchange? (E144, dropdown AE144) | enum `Y`,`N` | `ForeignExchangeFlag` | **required** |
| — | Whether you are an FPI? (E145, dropdown AE145) | enum `Y`,`N` | `FiiFpiFlag` | **required**; rule #48 — must be Yes to offer income u/s 115AD(1)(i) in Schedule OS |
| — | If yes, please provide SEBI Regn. No (E146) | string | `SebiRegnNo` | |
| — | Legal Entity Identifier (LEI) details (mandatory if refund is 50 Crores or more) (E147) | — | `LEIDtls` | |
| — | LEI Number (E148) | string, maxLength 20 | `LEIDtls.LEINumber` | |
| — | Valid upto date (E149) | date | `LEIDtls.ValidUptoDate` | |

### PartA_GEN1 · Director / Partner / Unlisted-equity-shares tables (rows 123-138)

| Table | Columns (sheet text) | Schema key | Rule / notes |
|---|---|---|---|
| Director (header row 123; data rows 124-126) | Sl. No. · Name of company (F123) · Type of Company (O123, dropdown O124:W126 = Domestic/Foreign) · PAN (X123) · Whether its shares are listed or unlisted (AG123, dropdown AG124:AJ126 = Listed/Unlisted) · Director Identification Number (DIN) (AK123) | `NameOfCompany`\*, `CompanyType`\* (`D`/`F`), `PAN`, `SharesTypes`\* (`L`/`U`), `DIN` | 3 template rows on the sheet (E125=E124+1, E126=E125+1) |
| Partner in a Firm (header row 129; data rows 130-131) | Sl. No. · Name of Firm (F129) · PAN (W129) | `NameOfFirm`\*, `PAN`\* | 2 template rows (E131=E130+1) |
| Unlisted equity shares (header rows 134-135; data rows 136-138) | Sl. No. · Name of company (F134) · Type of Company (N134, dropdown N136:N138 = Domestic/Foreign) · PAN (O134) · Opening Balance — No. of shares (P135)/Cost of acquisition (T135) · Shares acquired during the year — No. of shares (X135)/Date of subscription/purchase (Z135)/Face value per share (AC135)/Issue price per share, fresh issue (AE135)/Purchase price per share, from existing holder (AH135) · Shares transferred during the year — No. of shares (AJ135)/Sale consideration (AL135) · Closing Balance — No. of shares (AN135)/Cost of acquisition (AR135) | `NameOfCompany`\*, `CompanyType`\* (`D`/`F`), `PAN`, `OpngBalNumberOfShares`\*, `OpngBalCostOfAcquisition`\*, `ShrAcqDurYrNumberOfShares`, `DateOfSubscrPurchase`, `FaceValuePerShare`, `IssuePricePerShare`, `PurchasePricePerShare`, `ShrTrnfNumberOfShares`, `ShrTrnfSaleConsideration`, `ClsngBalNumberOfShares`\*, `ClsngBalCostOfAcquisition`\* | 3 template rows (E137=E136+1, E138=E137+1) — the widest table on the sheet |

\* = required within its row, per the schema (see *Mandatory*).

### PartA_GEN2 · Audit Information (`AuditInfo`, rows 150-193)

| Item | Field (sheet text) | Type | Schema key | Rule / notes |
|---|---|---|---|---|
| — | Audit Information (E150) / AUDIT INFORMATION (C151) | — | `AuditInfo` | section heading |
| a1 | Are you liable to maintain accounts as per section 44AA? (Select) (F151, dropdown AF151 = `PortugueseCode`) | enum `N`,`Y` (pattern) | `LiableSec44AAflg` | **required**; default `N` |
| a2 | Whether assessee is declaring income only under section 44AE/44B/44BB/44AD/44ADA/44BBA/44BBC/44BBD/44DA (F152, dropdown AF152) | enum `N`,`Y` (pattern) | `IncDclrdUs` | **required**; default `N` |
| a2i | Please select the range of total sales/turnover/gross receipts of business (F153, dropdown AF153 = `PortugueseCodeNewU`) | enum `Upto1CR`,`Upto10CR`,`MoreThan10CR` | `TotalSalesExcOneCr` | |
| a2ii | If "More than Rs. 1 crore and up to Rs. 10 crores" is selected at a2i, please select the percentage of amounts received in cash & non a/c payee cheque/ bank draft out of the aggregate receipts during the previous year (Note: If this percentage is more than 5%, you are liable for audit u/s. 44AB) (F154, dropdown AF154 = `PercentageAgr_a2ii`) | enum `Upto5Per`,`MoreThan5Per` | `AgrOFAllAmtsRcvd` | rule #28 |
| a2iii | If "More than Rs. 1 crore and up to Rs. 10 crores" is selected at a2i, please select the percentage of payments made in cash & non a/c payee cheque/ bank draft out of the aggregate payments made during the previous year (F155, dropdown AF155 = `PercentageAgr_a2iii`) | enum `Upto5Per`,`MoreThan5Per` | `AgrOFAllPayMade` | rule #29/#30 |
| b | Are you liable for audit under section 44AB? (F156, dropdown AP156 = `YesNoCode`) | enum `N`,`Y` | `LiableSec44ABflg` | **required** |
| — | If Yes is selected at (b), mention by virtue of which of the following conditions (F157, dropdown V157:AM157 = `Dropdown44Select`: `bi`/`bii`/`biii`) | enum `bi`,`bii`,`biii` | `Cndnfor44AB` | |
| — | 44AD (AN157) / 44ADA (AN158) / 44AE (AN159) / 44BB (AN160), each with a Y-Yes/N-No dropdown (AQ157:AT160) | enum `Y`,`N` ×4 | `BiiDetails.44AD` / `.44ADA` / `.44AE` / `.44BB` | shown when `Cndnfor44AB`=`bii` |
| c | If (b) is Yes, whether the accounts have been audited by an accountant? furnish the following information below (F161, dropdown AP161 = `YesNoCode`) | enum `Y`,`N`(coded) | `AuditAccountantFlg` | |
| — | Date of furnishing of the audit report (DD/MM/YYYY) (G162) | date | `AuditReportFurnishDate` | rule #17 — cannot be after system date |
| — | Acknowledgement number of the audit report (N163) | integer, 15 digits | `AckNum44AB` | |
| — | Name of the auditor (proprietorship/firm) (G166) | string, maxLength 125 | `AudFrmName` | |
| — | Permanent Account Number (PAN) of the proprietorship/ firm (G168) | string, PAN pattern | `AudFrmPAN` | "Enter Firm's PAN or Proprietor's PAN here" |
| g | Aadhaar of the proprietorship (G169) | string, 12 digits | `AudFrmAadhaar` | |
| d(i) | Are you liable for Audit u/s 92E? (F173, dropdown Q173 = `YesNoCode`) | enum `N`,`Y` | `LiableSec92Eflg` | **required** |
| d(ii) | If (di) is Yes, whether the accounts have been audited u/s. 92E? (W173, dropdown AH173 = `YesNoCode`) | enum `N`,`Y` | `AccountAuditFlag` | **required** |
| — | Date of audit report (DD/MM/YYYY) (E174) | date | `AuditDetails92E.DateOfAudit` | **required** if 92E-audited; rule #17 |
| — | Acknowledgement number (E175) | integer, 15 digits | `AuditDetails92E.AckNum92E` | **required** if 92E-audited |
| (diii) | If liable to furnish other audit report (E176) | — | `AuditDetails[]` | table heading |
| — | Sl.No. · Section Code (F177, dropdown F178:M184 = `Section_code`, 12 codes) · Whether have you furnished such other audit report? If yes, please provide the details as under: (N177, dropdown N178:N184) · Date (O177) · Acknowledgement number (P177) | enum (section) + `Y`/`N` + date + integer | `AuditDetails[].AuditedSection`, `.OthAuditDtls`, `.DateOfAudit`, `.AckNumOth` | 7 template rows (178-184); the schema's own `AuditFlag` (separate Y/N) has no distinct visible cell in this table — see *What this means for the build* |
| — | If liable to audit under any Act other than the Income-tax Act, mention the Act, section and date of furnishing the audit report? (E188) | — | `AuditReportDetails[]` | table heading |
| — | Sl.No. · Act (F189, dropdown F190:N193 = `AuditDropDown`, 19 Acts) · Description (O189) · Section (X189) · Have you got audited under the selected Act other than the Income-tax Act? (AG189, dropdown AG190:AH193) · Date (AI189) | enum (act) + text + free text + `Y`/`N` + date | `AuditReportDetails[].AuditReportAct`, `.AuditReportActOthers`, `.AuditedSection` (free text here, unlike `AuditDetails`'s coded one), `.OtherITActFlag`, `.DateOfAudit` | 4 template rows (190-193); the schema's `OthAuditDtlsOthThanITAct` (separate Y/N) again has no distinct visible cell — see *What this means for the build* |

`NatOfBus.NatureOfBusiness[]` (business-code table, required leaf `Code`) is
**not on this sheet** — it is built by the Nature Of Business sheet-reader.

---

## The rules the sheet computes

1. **BB28** `= VLOOKUP(sheet1.ReturnFileSec, ReturnFileUnderSection, 2, FALSE)` — redisplays the stored numeric filing-section code (`ReturnFileSec`) as its label next to the "Filed u/s" dropdown.
2. **Serial numbers, not logic** — every repeating table's Sl.No. column is simply "previous row + 1": `E40=E39+1` (jurisdiction table, hidden), `E125=E124+1`, `E126=E125+1` (director), `E131=E130+1` (partner), `E137=E136+1`, `E138=E137+1` (unlisted shares), `E179=E178+1`…up through `E184` implied (other audit report), `E191=1+E190`, `E192=1+E191`, `E193=1+E192` (Act audit table). No cell on this sheet computes a rupee figure — Part A General has no money totals of its own.
3. **Due date is one of exactly three dates** (X29 = `31/08/2026`, `31/10/2026`, `30/11/2026`, matching schema `ItrFilingDueDate` enum `2026-08-31`/`2026-10-31`/`2026-11-30` — note the sheet is `DD/MM/YYYY`, the schema `YYYY-MM-DD`). The VBA (`sources/ITR-3/vba_text.txt`, e.g. the block around "Filing section u/s. 139(4) cannot be selected till 31st August, 2026" / "...31st October, 2026" / "...30th November, 2026") blocks picking `139(4)- After due date` until the matching date (checked against `sheet9.Date`, the system date) has passed, and separately warns *"Please select correct due date for filing return of income as you have selected Yes for 'Are you liable for audit under section 44AB?'"* when the due-date choice and the 44AB flag disagree.
4. **"Filed u/s" (X30) is not one fixed list.** The VBA swaps its data-validation formula at runtime between `ReturnFileUnderSection1` (the 6-option list `--dropdowns` returns today), `Returnfiledundersection_new`, and `ReturnFileUnderSection2with153C` (vba_text.txt: `Set cellrange = Sheet1.Range("sheet1.ReturnFileSec")` … `formula = "=ReturnFileUnderSection1"` / `"=Returnfiledundersection_new"` / `"=ReturnFileUnderSection2with153C"`). The schema's `ReturnFileSec` enum (11, 12, 13, 14, 16, 17, 18, 19, 20, 21) covers four codes — `13`=142(1), `14`=148, `16`=153C, `18`=139(9) — that the currently-visible `ReturnFileUnderSection1` list does not show as its own options; they arrive through the alternate list. Row 34's "Filed in response to a notice u/s 139(9)/142(1)/148/153C…" is the trigger for that swap; Q30 ("Filed in response to notice u/s") is descriptive text with no dropdown of its own.
5. **Rules #39 / #40 / #46** (rules.json, cat A) tie the item number **A19(b)** to row 62 (`IncFrmBusOrProf`): "In case of business income, it is mandatory to answer Sl. No. A19(b)(I)"; "In case of no business income, it is mandatory to answer Sl. No. A19(b)(II)"; "Business Income is mandatory if any option is selected at Sl. no. A19b". So the Yes-branch is the (I)…(I)(B)(i) tree (rows 63-78) and the No-branch is row 79, **A19(b)(II)** (`OptOldRegimeCurrAY`).
6. **Rules #41-#45**: each Form 10-IEA acknowledgement-number/date pair becomes mandatory the moment its governing Yes/No, one row above it, is Yes (e.g. row 63 Yes ⇒ rows 64-66 mandatory).
7. **Rules #28 / #29 / #30**: `AgrOFAllAmtsRcvd`="MoreThan5Per" (row 154, a2ii) → liable for audit u/s 44AB; `AgrOFAllPayMade`="MoreThan5Per" (row 155, a2iii) → liable for audit; and `TotalSalesExcOneCr`="Upto10CR" (a2i, "More than Rs. 1 crore and up to Rs. 10 crores") together with either a2ii or a2iii = "MoreThan5Per" → liable for audit. All three should drive `LiableSec44ABflg` (row 156) to `Y`.
8. **Rule #17**: "Date of audit report cannot be after system date" — applies to `AuditReportFurnishDate` (row 162), and the same constraint is repeated as prose in the schema ("on or after 2026-04-01") for `AuditDetails92E.DateOfAudit` (row 174), `AuditDetails[].DateOfAudit` (rows 178-184) and `AuditReportDetails[].DateOfAudit` (rows 190-193).
9. **Rules #13 / #14**: if `LiableSec44ABflg`=Y and the accountant-audited flag (`AuditAccountantFlg`, row 161) =Y, the auditor/audit-report particulars (rows 162-169) must be furnished; and the "declaring income only under 44AE/44B/44BB/44AD/44ADA/44BBA/44BBC/44BBD" answer (row 152) has its own follow-on mandatory fields.
10. **Rule #6**: `HeldUnlistedEqShrPrYrFlg`=Yes (row 133) makes the table at rows 134-138 mandatory. **Rule #7**: `PortugeseCC5A`=Yes (row 112) makes Schedule 5A (a different sheet) mandatory. **Rule #10**: seventh-proviso=Yes (row 101) makes rows 102-109 mandatory, and representative=Yes (row 114) makes rows 115-117 mandatory. **Rule #11**: director=Yes (row 122) makes the table at rows 123-126 mandatory.
11. **Rule #47**: the representative's email (row 116) and contact number (row 117) must **not** match the taxpayer's own primary email/mobile (row 27).
12. **Rule #48**: `FiiFpiFlag`=Yes (row 145) must be selected before income can be offered under section 115AD(1)(i) in Schedule OS.
13. **Rules #32 / #33** (cat B, advisory not blocking): the Form 10-IEA acknowledgement/date entered at rows 63-78 should match the department's own database of filed 10-IEAs; a mismatch is flagged to the filer, not rejected outright.
14. **Cross-sheet effects** (the trigger lives here, the effect is read while building other sheets, so it is logged here): `LiableSec92Eflg`=Yes (row 173) is one of the exceptions in a Schedule BP disallowance rule; `OptOldRegimeCurrAY`/the old-vs-new regime choice (row 79) gates Schedule DPM Sl. No. 3b (cannot be > 0 under the old regime) and whether Schedule 80GGC is open at all (not required once the new regime is selected).

---

## Dropdowns

Every dropdown `--dropdowns "PART A - General"` returned with a literal value
list (character-count-only validations, e.g. `source: "50"`, are not
dropdowns and are omitted). `(Select)` is the placeholder on almost every one
of them.

**Address:**

- **State** (W17, W24 — 38 codes): `(Select)`, `01-ANDAMAN AND NICOBAR ISLANDS`, `02-ANDHRA PRADESH`, `03-ARUNACHAL PRADESH`, `04-ASSAM`, `05-BIHAR`, `06-CHANDIGARH`, `07-Dadra Nagar and Haveli`, `08-Daman and Diu`, `09-DELHI`, `10-GOA`, `11-GUJARAT`, `12-HARYANA`, `13-HIMACHAL PRADESH`, `14-JAMMU AND KASHMIR`, `15-KARNATAKA`, `16-KERALA`, `17-LAKHSWADEEP`, `18-MADHYA PRADESH`, `19-MAHARASHTRA`, `20-MANIPUR`, `21-MEGHALAYA`, `22-MIZORAM`, `23-NAGALAND`, `24-ODISHA`, `25-PUDUCHERRY`, `26-PUNJAB`, `27-RAJASTHAN`, `28-SIKKIM`, `29-TAMIL NADU`, `30-TRIPURA`, `31-UTTAR PRADESH`, `32-WEST BENGAL`, `33-CHHATTISGARH`, `34-UTTARAKHAND`, `35-JHARKHAND`, `36-TELANGANA`, `37-LADAKH`, `99-Foreign`.
- **Country** (AE17, AE24 — 250 codes): `(Select)`, `93-AFGHANISTAN`, `1001-ALAND ISLANDS`, `355-ALBANIA`, `213-ALGERIA`, `684-AMERICAN SAMOA`, `376-ANDORRA`, `244-ANGOLA`, `1264-ANGUILLA`, `1010-ANTARCTICA`, `1268-ANTIGUA AND BARBUDA`, `54-ARGENTINA`, `374-ARMENIA`, `297-ARUBA`, `61-AUSTRALIA`, `43-AUSTRIA`, `994-AZERBAIJAN`, `1242-BAHAMAS`, `973-BAHRAIN`, `880-BANGLADESH`, `1246-BARBADOS`, `375-BELARUS`, `32-BELGIUM`, `501-BELIZE`, `229-BENIN`, `1441-BERMUDA`, `975-BHUTAN`, `591-BOLIVIA (PLURINATIONAL STATE OF)`, `1002-BONAIRE, SINT EUSTATIUS AND SABA`, `387-BOSNIA AND HERZEGOVINA`, `267-BOTSWANA`, `1003-BOUVET ISLAND`, `55-BRAZIL`, `1014-BRITISH INDIAN OCEAN TERRITORY`, `673-BRUNEI DARUSSALAM`, `359-BULGARIA`, `226-BURKINA FASO`, `257-BURUNDI`, `238-CABO VERDE`, `855-CAMBODIA`, `237-CAMEROON`, `1-CANADA`, `1345-CAYMAN ISLANDS`, `236-CENTRAL AFRICAN REPUBLIC`, `235-CHAD`, `56-CHILE`, `86-CHINA`, `9-CHRISTMAS ISLAND`, `672-COCOS (KEELING) ISLANDS`, `57-COLOMBIA`, `270-COMOROS`, `242-CONGO`, `243-CONGO (DEMOCRATIC REPUBLIC OF THE)`, `682-COOK ISLANDS`, `506-COSTA RICA`, `225-COTE DIVOIRE`, `385-CROATIA`, `53-CUBA`, `1015-CURACAO`, `357-CYPRUS`, `420-CZECHIA`, `45-DENMARK`, `253-DJIBOUTI`, `1767-DOMINICA`, `1809-DOMINICAN REPUBLIC`, `593-ECUADOR`, `20-EGYPT`, `503-EL SALVADOR`, `240-EQUATORIAL GUINEA`, `291-ERITREA`, `372-ESTONIA`, `251-ETHIOPIA`, `500-FALKLAND ISLANDS (MALVINAS)`, `298-FAROE ISLANDS`, `679-FIJI`, `358-FINLAND`, `33-FRANCE`, `594-FRENCH GUIANA`, `689-FRENCH POLYNESIA`, `1004-FRENCH SOUTHERN TERRITORIES`, `241-GABON`, `220-GAMBIA`, `995-GEORGIA`, `49-GERMANY`, `233-GHANA`, `350-GIBRALTAR`, `30-GREECE`, `299-GREENLAND`, `1473-GRENADA`, `590-GUADELOUPE`, `1671-GUAM`, `502-GUATEMALA`, `1481-GUERNSEY`, `224-GUINEA`, `245-GUINEA-BISSAU`, `592-GUYANA`, `509-HAITI`, `1005-HEARD ISLAND AND MCDONALD ISLANDS`, `6-HOLY SEE`, `504-HONDURAS`, `852-HONG KONG`, `36-HUNGARY`, `354-ICELAND`, `91-INDIA`, `62-INDONESIA`, `98-IRAN (ISLAMIC REPUBLIC OF)`, `964-IRAQ`, `353-IRELAND`, `1624-ISLE OF MAN`, `972-ISRAEL`, `5-ITALY`, `1876-JAMAICA`, `81-JAPAN`, `1534-JERSEY`, `962-JORDAN`, `7-KAZAKHSTAN`, `254-KENYA`, `686-KIRIBATI`, `850-KOREA (DEMOCRATIC PEOPLES REPUBLIC OF)`, `82-KOREA (REPUBLIC OF)`, `965-KUWAIT`, `996-KYRGYZSTAN`, `856-LAO PEOPLES DEMOCRATIC REPUBLIC`, `371-LATVIA`, `961-LEBANON`, `266-LESOTHO`, `231-LIBERIA`, `218-LIBYA`, `423-LIECHTENSTEIN`, `370-LITHUANIA`, `352-LUXEMBOURG`, `853-MACAO`, `389-MACEDONIA (THE FORMER YUGOSLAV REPUBLIC OF)`, `261-MADAGASCAR`, `265-MALAWI`, `60-MALAYSIA`, `960-MALDIVES`, `223-MALI`, `356-MALTA`, `692-MARSHALL ISLANDS`, `596-MARTINIQUE`, `222-MAURITANIA`, `230-MAURITIUS`, `269-MAYOTTE`, `52-MEXICO`, `691-MICRONESIA (FEDERATED STATES OF)`, `373-MOLDOVA (REPUBLIC OF)`, `377-MONACO`, `976-MONGOLIA`, `382-MONTENEGRO`, `1664-MONTSERRAT`, `212-MOROCCO`, `258-MOZAMBIQUE`, `95-MYANMAR`, `264-NAMIBIA`, `674-NAURU`, `977-NEPAL`, `31-NETHERLANDS`, `687-NEW CALEDONIA`, `64-NEW ZEALAND`, `505-NICARAGUA`, `227-NIGER`, `234-NIGERIA`, `683-NIUE`, `15-NORFOLK ISLAND`, `1670-NORTHERN MARIANA ISLANDS`, `47-NORWAY`, `968-OMAN`, `92-PAKISTAN`, `680-PALAU`, `970-PALESTINE, STATE OF`, `507-PANAMA`, `675-PAPUA NEW GUINEA`, `595-PARAGUAY`, `51-PERU`, `63-PHILIPPINES`, `1011-PITCAIRN`, `48-POLAND`, `14-PORTUGAL`, `1787-PUERTO RICO`, `974-QATAR`, `262-REUNION`, `40-ROMANIA`, `8-RUSSIAN FEDERATION`, `250-RWANDA`, `1006-SAINT BARTHELEMY`, `290-SAINT HELENA, ASCENSION AND TRISTAN DA CUNHA`, `1869-SAINT KITTS AND NEVIS`, `1758-SAINT LUCIA`, `1007-SAINT MARTIN (FRENCH PART)`, `508-SAINT PIERRE AND MIQUELON`, `1784-SAINT VINCENT AND THE GRENADINES`, `685-SAMOA`, `378-SAN MARINO`, `239-SAO TOME AND PRINCIPE`, `966-SAUDI ARABIA`, `221-SENEGAL`, `381-SERBIA`, `248-SEYCHELLES`, `232-SIERRA LEONE`, `65-SINGAPORE`, `1721-SINT MAARTEN (DUTCH PART)`, `421-SLOVAKIA`, `386-SLOVENIA`, `677-SOLOMON ISLANDS`, `252-SOMALIA`, `28-SOUTH AFRICA`, `1008-SOUTH GEORGIA AND THE SOUTH SANDWICH ISLANDS`, `211-SOUTH SUDAN`, `35-SPAIN`, `94-SRI LANKA`, `249-SUDAN`, `597-SURINAME`, `1012-SVALBARD AND JAN MAYEN`, `268-SWAZILAND`, `46-SWEDEN`, `41-SWITZERLAND`, `963-SYRIAN ARAB REPUBLIC`, `886-TAIWAN`, `992-TAJIKISTAN`, `255-TANZANIA, UNITED REPUBLIC OF`, `66-THAILAND`, `670-TIMOR-LESTE(EAST TIMOR)`, `228-TOGO`, `690-TOKELAU`, `676-TONGA`, `1868-TRINIDAD AND TOBAGO`, `216-TUNISIA`, `90-TURKEY`, `993-TURKMENISTAN`, `1649-TURKS AND CAICOS ISLANDS`, `688-TUVALU`, `256-UGANDA`, `380-UKRAINE`, `971-UNITED ARAB EMIRATES`, `44-UNITED KINGDOM OF GREAT BRITAIN AND NORTHERN IRELAND`, `2-UNITED STATES OF AMERICA`, `1009-UNITED STATES MINOR OUTLYING ISLANDS`, `598-URUGUAY`, `998-UZBEKISTAN`, `678-VANUATU`, `58-VENEZUELA (BOLIVARIAN REPUBLIC OF)`, `84-VIET NAM`, `1284-VIRGIN ISLANDS (BRITISH)`, `1340-VIRGIN ISLANDS (U.S.)`, `681-WALLIS AND FUTUNA`, `967-YEMEN`, `263-ZIMBABWE`, `260-ZAMBIA`, `1013-WESTERN SAHARA`, `9999-OTHERS`.
- **Country_Juridiction** (F39:Z40, hidden jurisdiction table) — the *same* 250-country list, minus `91-INDIA`, `967-YEMEN` and `263-ZIMBABWE`, plus one extra value: `9998-Not Applicable (Not Resident in any Country)`.
- **(Select),Y** (AE18:AG18, AE25:AG25 — "No Zip Code?" ticks): `(Select)`, `Y`.

**Filing:**

- **ReturnFileUnderSection1** (X30 — 7 values): `(Select)`, `139(1)- On or Before due date`, `139(4)- After due date`, `139(5)- Revised Return`, `92CD-Modified return`, `119(2)(b)- After condonation of delay`, `139(8A)`.
- **Due date literal list** (X29 — 3 values): `31/08/2026`, `31/10/2026`, `30/11/2026`.
- **ResiStatus** (AK30, and AP45 on the hidden block — 4 values): `(Select)`, `RES - Resident`, `NRI - Non Resident`, `NOR - Resident but not Ordinarily Resident`.

**Form 10-IEA (rows 62-79):**

- **Form10IEAoldtax_IAi** (AK63 — 3): `(Select)`, `Yes`, `No`.
- **AssYr_Dropdown_IAi** (AK65 — 2): `2024-25`, `2025-26`.
- **Form10IEAoldtax_IA** (AK67 — 3): `(Select)`, `Yes`, `No`.
- **AssYr_Dropdown_IAiia** (AK69 — 1): `2025-26`.
- **Form10IEANewTax_Iaiib** (AK71 — 3): `(Select)`, `Yes`, `No`.
- **Form10IEANewTax_IB** (AK75 — 3): `(Select)`, `Yes`, `No`.
- **Form10IEA_II** (AK79 — 3): `(Select)`, `Yes`, `No`.

**Generic Yes/No** (`"(Select),Yes,No"`, 3 values: `(Select)`, `Yes`, `No` — the same literal list reused at rows 19, 62, 101-109, 112 (Z112), 122, 128, 133, 141 (the 4-value `"(Select),Yes,No,NA"` variant adds `NA`), 144, 145, 178-184, 190-193, and at the hidden rows 45 (as `trasactionAct`) and 50).

**Other particulars:**

- **PortugueseCode** (AR112, AF151, AF152 — 3): `(Select)`, `Yes`, `No`.
- **YesNoCode** (AM114, AP156, AP161, AE140, Q173, AH173 — 3): `(Select)`, `Y - Yes`, `N -No`.
- **(Select),Listed,Unlisted** (AG124:AJ126 — director shares): `(Select)`, `Listed`, `Unlisted`.
- **(Select),Domestic,Foreign** (O124:W126 director table; N136:N138 unlisted-shares table — 3): `(Select)`, `Domestic`, `Foreign`.
- **Dropdown_RepCapacity** (AE118, hidden row — 5): `(Select)`, `Legal Heir`, `Manager`, `Guardian`, `Other`.

**Audit Information:**

- **PortugueseCodeNewU** (AF153 — 4): `(Select)`, `Up to Rs. 1 crore`, `More than Rs. 1 crore and up to Rs. 10 crores`, `More than Rs. 10 crores`.
- **PercentageAgr_a2ii** (AF154 — 3): `(Select)`, `Up to 5%`, `More than 5%`.
- **PercentageAgr_a2iii** (AF155 — 3): `(Select)`, `Up to 5%`, `More than 5%`.
- **Dropdown44Select** (V157:AM157 — 3): `bi-Sales, turnover or gross receipts exceeds the specified limits`, `bii-Assessee falling u/s 44AD/44ADA/44AE/44BB but not opting for offering income on presumptive basis`, `biii-Others`.
- **"Y-Yes,N-No"** (AQ157:AT160, the 44AD/44ADA/44AE/44BB sub-flags — 2): `Y-Yes`, `N-No`.
- **Section_code** (F178:M184 — 13): `(Select)`, `10A`, `10AA`, `44DA`, `50B`, `80-IA`, `80-IB`, `80-IC`, `80-ID`, `80-IE`, `80JJAA`, `80LA`, `115JC`. *(The schema's `AuditedSection` enum has 14 values — it also allows `80-IAB` and `80-IAC`, which are not options in this list; see "What this means for the build".)*
- **AuditDropDown** (F190:N193 — 20): `(Select)`, `Banking Regulation Act, 1949`, `Central Excise Act,1944`, `Central Sales Tax Act, 1956`, `Central Goods and Services Tax Act, 2017`, `Charitable And Religious Trusts Act, 1920`, `Companies Act, 2013`, `Electricity Act, 2003`, `Employees Provident Fund and Miscellaneous Provisions Act, 1952`, `Foreign Exchange Management Act, 1999`, `Government Superannuation Fund Act, 1956`, `Indian Trusts Act, 1882`, `Integrated Goods and Services Tax Act, 2017`, `Limited Liability Partnership Act, 2008`, `Payment of Gratuity Act, 1972`, `SEBI Act, 1992`, `Securities Contract (Regulation) Act, 1956`, `State Goods and Services Tax Act, 2017`, `Union Territories Goods and Services Tax Act, 2017`, `Others`.

**Hidden-row-only dropdowns** (values still listed here so nothing is lost, but no row is built for them — see "Hidden rows"): **NTR_Current1** (AK54 — 3): `(Select)`, `Opting in now`, `Not opting`. **Sheet1.MethodofOptONTR** (AF80 — 3): `(Select)`, `by filing 10IEA (having income from business or profession)`, `by exercising the option in the return of income only (form 10IEA is not applicable)`. **BAC115.NY** (AK81 — 4): `(Select)`, `No`, `Yes`, `Not Applicable`. **BAC115.Yes_New** (AK85 — 3): `(Select)`, `No`, `Yes`. **BAC115.No_New** (AK90 — 3): `(Select)`, `No`, `Yes`. **BAC115.NA_New** (AK95 — 3): `(Select)`, `No`, `Yes`. **BAC115.NY_2** (AK99 — 3): `(Select)`, `Yes`, `No`.

---

## What repeats and what is one figure

| Block | Kind | Rows | Sheet template size | Schema |
|---|---|---|---|---|
| Personal info, both addresses, communication, filing, regime, seventh-proviso flags, Aadhaar/115H/Portuguese/FPI/LEI/PE-SEP | one figure each | throughout | — | scalar fields directly under `PersonalInfo` / `FilingStatus` |
| `clauseiv7provisio139iDtls[]` | **array** | 106-109 (conditions) | 4 static condition rows, one flag each | one row per condition triggered, each with an amount |
| `JurisdictionResPrevYr.JurisdictionResPrevYrDtls[]` | **array** | 38-40 (hidden) | 2 template rows | not built — see "Hidden rows" |
| `CompDirectorPrvYr.CompDirectorPrvYrDtls[]` | **array** | 123-126 | 3 template rows | one row per directorship |
| `PartnerInFirm.PartnerInFirmDtls[]` | **array** | 129-131 | 2 template rows | one row per firm |
| `HeldUnlistedEqShrPrYr.HeldUnlistedEqShrPrYrDtls[]` | **array** | 134-138 | 3 template rows | one row per company, widest table on the sheet |
| `AuditInfo.AuditDetails[]` | **array** | 177-184 | 7 template rows | one row per profit-linked-deduction section audited |
| `AuditInfo.AuditReportDetails[]` | **array** | 189-193 | 4 template rows | one row per non-IT-Act audit |
| `AuditInfo.BiiDetails` | one object, not an array | 157-160 | — | four fixed Y/N flags (44AD/44ADA/44AE/44BB) |
| `AssesseeRep`, `LEIDtls`, `AuditDetails92E` | one object each | 115-117, 147-149, 173-175 | — | single occurrence, opens on its own flag |

The sheet's own row count for each array (2, 3, 4 or 7 rows) is a *template*
— the auto-incrementing Sl.No. formulas (rule 2 under "The rules") only prove
how many rows the static grid shows, not a hard cap on the array the schema
will accept.

---

## Mandatory

`PartA_GEN1` requires `PersonalInfo` and `FilingStatus`. Within them, always
mandatory:

`SurNameOrOrgName` · `PAN` · `ResidenceNo` · `LocalityOrArea` ·
`CityOrTownOrDistrict` · `StateCode` · `CountryCode` · `STDcode` · `PhoneNo`
(both only if `Phone` is given at all) · `CountryCodeMobile` · `MobileNo` ·
`EmailAddress` · `SecondaryAdd` · `DOB` · `Status` · `ReturnFileSec` ·
`IncFrmBusOrProf` · `SeventhProvisio139` · `ResidentialStatus` ·
`HeldUnlistedEqShrPrYrFlg` · `ForeignExchangeFlag` · `FiiFpiFlag` ·
`ItrFilingDueDate`.

`PartA_GEN2` requires `AuditInfo`. Within it, always mandatory:
`LiableSec44AAflg` · `IncDclrdUs` · `LiableSec44ABflg` · `LiableSec92Eflg` ·
`AccountAuditFlag`.

**Required only once its row/table is opened** (required *inside* its own
object or array item, not force-opened by itself):

- `AlternateAddress` opens on `SecondaryAdd`=N; then `ResidenceNo`,
  `LocalityOrArea`, `CityOrTownOrDistrict`, `StateCode` are required.
- `clauseiv7provisio139iDtls[]` rows: `clauseiv7provisio139iNature` and
  `clauseiv7provisio139iAmount` both required per row.
- `JurisdictionResPrevYrDtls[]` rows (hidden, not built): `JurisdictionResidence`
  and `TIN` both required per row.
- `AssesseeRep` opens on `AsseseeRepFlg`=Y; then `RepName`, `RepEmailID`,
  `CountryCodeRepMobileNo`, `RepMobileNo` all required.
- `CompDirectorPrvYrDtls[]` rows: `NameOfCompany`, `CompanyType`,
  `SharesTypes` required per row (`PAN`, `DIN` optional).
- `PartnerInFirmDtls[]` rows: `NameOfFirm` and `PAN` both required per row.
- `HeldUnlistedEqShrPrYrDtls[]` rows: `NameOfCompany`, `CompanyType`,
  `OpngBalNumberOfShares`, `OpngBalCostOfAcquisition`,
  `ClsngBalNumberOfShares`, `ClsngBalCostOfAcquisition` required per row
  (acquired/transferred-during-the-year columns optional).
- `AuditDetails92E` opens once `LiableSec92Eflg`=Y and `AccountAuditFlag`=Y;
  then `DateOfAudit` and `AckNum92E` both required.

---

## Hidden rows — not built

| Row(s) | What it is | Why it is not built |
|---|---|---|
| 15 | `Female` / `F-Female` helper cells (BD15/BE15) | part of an unused Male/Female/Transgender helper lookup sitting in columns BD-BF of rows 13-17, off to the side of the address fields; no `PersonalInfo` field of that kind exists in `PartA_GEN1` — this lookup is not consumed by anything on this sheet |
| 31 | Long instruction note on selecting `139(8A)` when re-filing against a 139(9) notice on an updated return | instructional text only, no input cell |
| 36-45 | "Conditions for Residential Status" — the whole non-resident sub-form: `W36` conditions dropdown, the jurisdiction-of-residence table (`F38:AA40`), days-in-India-this-year/preceding-4-years (`E43`/`E44`), and an `Aadhaar` line (`E45`) | the **entire** non-resident detail interview is hidden this AY — only the top-level Residential Status dropdown (row 30) remains visible. The schema fields it would feed (`ConditionsResStatus`, `JurisdictionResPrevYr`, `TotalPrStayIndiaPrevYr`, `TotalPrStayIndia4PrecYr`) are all optional, so nothing required is lost |
| 46-61 | Opted for/out of 115BAC **in earlier years**, via the old Form 10-IE flow (`NTR_Current1`, `BAC115.*`-style helpers) | superseded by the new, visible Form 10-IEA interview at rows 62-79; this is last year's UI left in place but hidden |
| 80-100 | A second, more elaborate opting-out-of-new-regime continuity check across AY 2024-25/2025-26, driven by the `BAC115.*` named ranges and `Sheet1.MethodofOptONTR` | also superseded by rows 62-79; hidden alternate flow |
| 111 | Aadhaar Enrolment Id (28-digit fallback for when the Aadhaar number itself is not yet allotted) | hidden this AY — only the Aadhaar Number row (110) is offered |
| 113 | Passport No. (Individual) | hidden on ITR-3 this AY — for contrast, ITR-2's Part A General shows this same field visibly; nothing transfers between forms |
| 118-121 | Capacity of representative / Address of the representative / PAN of the Representative / Aadhaar Number of the representative | hidden, **and** the schema's own `AssesseeRep` definition only has `RepName`, `RepEmailID`, `CountryCodeRepMobileNo`, `RepMobileNo` — capacity/address/PAN/Aadhaar of the representative are not schema fields either, so the hidden rows and the schema agree |
| 164, 165, 167 | Name of the auditor signing the tax audit report / Membership no. of the auditor / Proprietorship/firm registration number | hidden, and `AuditInfo` has no matching keys (only `AudFrmName`/`AudFrmPAN`/`AudFrmAadhaar` — the firm/proprietorship-level fields at rows 166/168/169 — survive) |
| 170, 171 | Date of audit report. / Acknowledgement number of the audit report | duplicates of the visible `AuditReportFurnishDate`/`AckNum44AB` pair already collected at rows 162-163; hidden as redundant |
| 172 | UDIN | hidden, and `AuditInfo` has no `UDIN` key |

---

## What this means for the build

1. **This sheet has no money to total.** Every formula on it is a Sl.No.
   auto-increment; the only real computation (BB28) is a display lookup. Do
   not expect Gate-7-style rupee figures from Part A General itself.
2. **Status drives the sheet.** `I` shows First/Middle/Last name, Date of
   Birth, Aadhaar, the (hidden) residential-condition detail. `H` (HUF) uses
   the same name fields for the HUF's name and `DOB` as its date of formation
   — the sheet does not relabel the field for HUF, the schema description
   does ("Date of Birth of the Assessee" is reused for `DateofBusCommencement`
   too).
3. **`IncFrmBusOrProf` (A19(b), row 62) is the fork for the whole Form 10-IEA
   block** (rows 63-79) — build it as one interview, not eight independent
   questions; each Yes/No only makes sense read against the one above it.
4. **`ReturnFileSec`/"Filed u/s" needs the alternate list, not just
   `ReturnFileUnderSection1`.** Four schema-valid codes (142(1), 148, 153C,
   139(9)) are not present in the sheet's currently-visible dropdown; the
   section-builder should offer all ten schema codes and let row 34/35
   (notice particulars) drive which ones make sense, rather than restricting
   the picker to the six visible labels.
5. **AF35 is overloaded** — it is the notice date for a 139(9)/142(1)/148/
   153C response *and* the doorway text also names it as the 92CD
   advance-pricing-agreement date, but the schema has only `NoticeDate` (and
   `OrigRetFiledDate` for the revised-return case) to hold it. Map AF35 to
   `NoticeDate` and flag the 92CD case rather than inventing a key the schema
   does not have.
6. **Two Yes/No vocabularies coexist**: plain `Yes`/`No` (most of the sheet,
   stored as schema `Y`/`N`) and coded `Y - Yes`/`N -No` (`YesNoCode`, used
   for `LiableSec44ABflg`, `AuditAccountantFlg`, `LiableSec92Eflg`,
   `AccountAuditFlag`, `AsseseeRepFlg`, `NriPEinIndia`). Both resolve to the
   same `Y`/`N` in the schema — the section-builder should not treat them as
   different value sets.
7. **`Section_code` (12 values) is narrower than the schema's `AuditedSection`
   enum (14 values)** — the sheet's own picker is missing `80-IAB` and
   `80-IAC`. Build the picker from the schema's 14, not the sheet's 12,
   since the schema is what the e-filing portal will actually accept.
8. **Two tables each have one schema Y/N flag with no visible cell of its
   own**: `AuditDetails[].AuditFlag` (rows 177-184 only shows `OthAuditDtls`)
   and `AuditReportDetails[].OthAuditDtlsOthThanITAct` (rows 188-193 only
   shows `OtherITActFlag`). Set the missing flag to `Y` from the fact that the
   row was filled at all, rather than asking the user a redundant second
   question the utility itself does not ask.
9. **The three small tables (director/partner/unlisted-shares) are template
   rows, not a hard limit** — 3, 2 and 3 rows respectively are what the sheet
   shows, driven only by the Sl.No.-increment formulas; the arrays in the
   schema are open-ended, so give the user an "add row" rather than a fixed
   grid.
10. **`AK9` (Status) is one dropdown `--dropdowns` could not resolve to a
    literal list** — its values (`I`, `H`) are confirmed instead from the
    literal helper cells BB10/BE10/BF10/BB11 next to it, which match the
    schema's `Status` enum exactly; treat this as read, not guessed (see
    *Unreadable*).
11. **`AK123` (DIN)** is 8 digits per the schema pattern — the sheet gives it
    no digit-count data-validation of its own that `--dropdowns` picked up;
    enforce the 8-digit pattern from the schema.
12. **A literal `grep -in "PartA_GEN1"` / `"PartA_GEN2"` in `rules.json`
    returns nothing** — the rules document refers to this sheet only by its
    printed name ("Part A General" / "Schedule Part A General" / "Part-A
    General"), never by the schema block code. Searching on that name is what
    produced every rule and item number cited above (in particular **A19(b)**
    and **a2i/a2ii/a2iii**, both confirmed in rules.json rather than counted
    off the row numbers, per rule 5).

---

## Unreadable

- The literal data-validation list behind `AK9` (Status, I/H) was not among
  the entries `tools/dump.py --dropdowns` returned for this sheet (its
  `sqref`/`formula1` pairing did not match the tool's regex — likely stored
  as a legacy, non-`x14` validation block). Its values are instead confirmed
  from the plain-text helper cells BB10/BE10/BF10/BB11 next to it, which
  agree with the schema's `Status` enum (`I`, `H`).
- `sources/ITR-3/vba_text.txt` is a raw strings-dump of the compiled VBA
  project, not clean source: most of it is binary noise with readable
  fragments embedded. The fragments quoted in "The rules the sheet computes"
  and "What this means for the build" (due-date gating, the `ReturnFileSec`
  list-swap) are the parts that were legible; the surrounding procedure
  bodies were not reconstructable and are not claimed here.
