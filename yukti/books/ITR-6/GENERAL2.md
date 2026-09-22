# The book of Part A — General (2) · ITR-6, A.Y. 2026-27

Read row by row from the utility's **GENERAL2** sheet (95 rows, no hidden rows),
its companion **AUDIT INFORMATION** region on the **PART A – GENERAL** sheet
(rows 82–126), and the **NATURE OF BUSINESS** sheet, and confirmed against the
CBDT ITR-6 schema's `PartA_GEN2For6`. Nothing here is invented; every label,
item number, dropdown value and rule is the department's own. Item numbers are
taken from the utility's own lettering (a1, a2, a2i, b, bi…) which the
validation-rules document uses verbatim (rules A3, A8, A23–A29, A33–A36).

> **Source inconsistency worth flagging (utility vs schema vs section_map).**
> The schema block `PartA_GEN2For6` is **split across three utility sheets**:
> the audit / section-44AA / 44AB / 92E / *income-declared* fields are
> **displayed** on the **PART A – GENERAL** sheet (which `section_map.json`
> otherwise ties to `PartA_GEN1`), while the holding, business-organisation,
> key-person, shareholder, ownership, foreign-parent and nature-of-company
> tables are on **GENERAL2**, and the business codes are on **NATURE OF
> BUSINESS**. `section_map.json` maps `PartA_GEN2For6` to **GENERAL2 and NATURE
> OF BUSINESS only**. This book therefore documents every leaf of the block —
> including the audit leaves whose display rows physically live on PART A –
> GENERAL — so that the block is filed completely. The MSME flag shown in the
> same AUDIT INFORMATION region (`Whether you are recognized as MSME`,
> PART A – GENERAL row 82) is **not** in this block — its schema key is
> `FilingStatus.ifMSME` in `PartA_GEN1` — so it belongs to the PART A – GENERAL
> book, not here; it is noted below only as a cross-sheet neighbour.

---

## 1 · What this block carries

Where `PartA_GEN1` establishes who is filing (name, PAN, address, filing status,
residence), `PartA_GEN2For6` is the **company-particulars** block that only a
company return has:

- **who is liable to audit** — section 44AA (books), 44AB (tax audit), 92E
  (transfer-pricing), other-Act audits, with the auditor and acknowledgement
  particulars;
- **the presumptive / turnover position** — income declared only under the
  presumptive sections, and the sales-turnover range with the cash-receipt and
  cash-payment percentages that decide 44AB liability;
- **the company's group position** — holding / subsidiary status and the
  details of holding and subsidiary companies;
- **business reorganisation** — amalgamating / amalgamated / demerged /
  resulting companies;
- **the people** — managing director, directors, secretary, principal officers;
- **the owners** — 10%-plus beneficial shareholders, ultimate beneficial owners
  of an unlisted company, and, for a foreign company, its immediate and ultimate
  parent;
- **what kind of company it is** — the eight statutory-category flags;
- **what it does** — up to four nature-of-business codes with trade names.

---

## 2 · The shape

| # | Block on screen | Sheet it displays on | Kind |
|---|---|---|---|
| A | **Audit information** — 44AA · 44AB · 92E · other-Act audits | PART A – GENERAL (rows 84–126) | ask + tables |
| B | **Income declared / turnover** — presumptive flag, sales range, cash %s | PART A – GENERAL (rows 85–88) | ask |
| C | **Holding status** and holding/subsidiary-company tables | GENERAL2 (rows 4–15) | ask + tables |
| D | **Business organisation** — amalgamation / demerger | GENERAL2 (rows 17–23) | table |
| E | **Key persons** — MD, directors, secretary, principal officers | GENERAL2 (rows 28–35) | table |
| F | **Shareholders** — 10%-plus beneficial owners | GENERAL2 (rows 40–47) | table |
| G | **Ownership** — ultimate beneficial owners (unlisted) | GENERAL2 (rows 52–59) | table |
| H | **Foreign-company parents** — immediate and ultimate | GENERAL2 (rows 63–81) | tables |
| I | **Nature of company** — eight statutory-category flags | GENERAL2 (rows 85–93) | eight Yes/No |
| J | **Nature of business** — up to 4 codes with trade names | NATURE OF BUSINESS | table |

---

## 3 · Block A · Audit information (schema leaves in this block; rows on PART A – GENERAL)

| Item | Label (verbatim) | Type / enum | Schema key | Notes |
|---|---|---|---|---|
| a1 | Whether liable to maintain accounts as per section 44AA? | Y/N | `LiableSec44AAflg` ★ | rule drives Part A BS / P&L (A42) |
| a2 | Whether assessee is declaring income only under section 44AE/44B/44BB/44BBA/44BBB/44BBC/44BBD/44D ? | string | `IncDclrdUs` ★ | the presumptive-only flag |
| a2i | Please select the range of total sales/turnover/gross receipts of business | enum: `Up to Rs. 1 crore` · `More than Rs. 1 crore and up to Rs. 10 crores` · `More than Rs.10 crores` | `TotalSalesExcOneCr` (`Upto1CR`, `Upto10CR`, `MoreThan10CR`) | |
| a2ii | If "More than Rs. 1 crore and up to Rs. 10 crores" … percentage of amounts received in cash & non a/c payee cheque/ bank draft out of the aggregate receipts during the previous year | enum: `Up to 5%` · `More than 5%` | `AgrOFAllAmtsRcvd` (`Upto5Per`, `MoreThan5Per`) | >5% ⇒ liable u/s 44AB (rule A27, A36) |
| a2iii | If "More than Rs. 1 crore and up to Rs. 10 crores" … percentage of payments made in cash & non a/c payee cheque/ bank draft out of the aggregate payments made during the previous year | enum: `Up to 5%` · `More than 5%` | `AgrOFAllPayMade` (`Upto5Per`, `MoreThan5Per`) | >5% ⇒ liable u/s 44AB (rule A28); a2i Yes with either a2ii/a2iii No ⇒ liable (A29) |
| b | Whether liable for audit under section 44AB? | Y/N | `LiableSec44ABflg` ★ | |
| bi | Sales, turnover or gross receipts exceeds the limits specified u/s 44AB | condition text | (virtue-of condition; no distinct leaf — `AuditReportDetails` carries the report) | |
| bii | Assessee falling u/s 44BB but not opting for offering income on presumptive basis | condition text | — | |
| biii | Assessee falling u/s 44BBB but not opting for offering income on presumptive basis | condition text | — | |
| biv | Others | condition text | — | |
| c | If liable for audit u/s 44AB, whether the accounts have been audited by an accountant? If yes, furnish the following information below | Y/N | `AuditedByAccountantFlg` | opens the auditor card |
| c | Date of furnishing of the audit report. | date YYYY-MM-DD | `AuditInfo.AuditReportFurnishDate` | cannot be > system date (rule A8) |
| c | Acknowledgement Number of Audit report | integer (15) | `AuditInfo.AckNum44AB` | mandatory if b = Yes (rule A23) |
| c | Name of the auditor (proprietorship/ firm) | string (125) | `AuditInfo.AudFrmName` | |
| c | Permanent Account Number (PAN) of the auditor ( proprietorship/ firm) | PAN | `AuditInfo.AudFrmPAN` ★ | Firm's PAN or Proprietor's PAN |
| di | Are you liable for Audit u/s 92E? | Y/N | `LiableSec92Eflg` ★ | transfer pricing; drives Form 3CEB (rule D1), due-date 30 Nov (A33/A34) |
| dii | If (di) is Yes, whether the accounts have been audited u/s. 92E? — Date of furnishing audit report (DD/MM/YYYY) | date YYYY-MM-DD | `AuditDetails92E.DateOfAudit` ★ | |
| dii | Acknowledgement Number | integer (15) | `AuditDetails92E.AckNum92E` | mandatory if 92E audited (rule A24) |
| diii | If liable to furnish other audit report under the Income-tax Act … (Sl.No · Section Code · Other Section · Whether have you furnished such other audit report? · Date · Acknowledgement Number) | table | `AuditDetails[]` | acknowledgement mandatory (rule A25) |
| diii | Section Code | enum (21) `AuditedSection` | `AuditDetails[].AuditedSection` ★ | see §11 |
| diii | Other Section | string (10) | `AuditDetails[].AnyOtherSection` | when section = `OTH` |
| diii | Whether have you furnished such other audit report? | Y/N | `AuditDetails[].AuditFlag` | |
| diii | Date (DD/MM/YYYY) | date | `AuditDetails[].DateOfAudit` | |
| diii | Acknowledgement Number | integer (15) | `AuditDetails[].AckNumOth` | |
| div | Mention the Act, section and date of furnishing the audit report under any Act other than the Income-tax Act (Sl.No · Act · Description · Section Code · Have you got audited under the selected Act other than the Income-tax Act?) | table | `AuditReportDetails[]` | |
| div | Act | enum (17) `AuditReportAct` | `AuditReportDetails[].AuditReportAct` ★ | see §11 |
| div | Description (Others) | string (50) | `AuditReportDetails[].AuditReportActOthers` | when Act = Others |
| div | Section Code | string (30) | `AuditReportDetails[].AuditReportSection` ★ | |
| div | Have you got audited under the selected Act other than the Income-tax Act? | Y/N | `AuditReportDetails[].OtherITActFlag` ★ | |
| div | Date (DD/MM/YYYY) | date | `AuditReportDetails[].AuditReportDate` | |
| — | (account-audit flag, schema-only) | Y/N | `AccountAuditFlag` | schema switch for the account-audit card |

★ = schema-required leaf.

---

## 4 · Block C · Holding status (GENERAL2 rows 4–15)

**Row 3 note (verbatim):** *"(Note: If no entry is made in first row then other
rows will not be considered)"* — the first row of each table must be filled
before any further row counts.

| Item | Label (verbatim) | Type / enum | Schema key |
|---|---|---|---|
| — | HOLDING STATUS - Nature of Company (select 1 if holding company, select 2 if a subsidiary company, select 3 if both, select 4 if any other) | enum `1-Holding company` · `2-Subsidiary company` · `3-Both` · `4-If any other` | `HoldingStatus.NatOfCompFlg` ★ (`1`,`2`,`3`,`4`) |
| — | If subsidiary company, mention the details of the Holding Company | table header | `HoldingStatus.HoldingCompDetail[]` |
| — | Name of Holding Company | string (125) | `…HoldingCompDetail[].CompDetails.CompName` ★ |
| — | Residential Address (Address · Town/City · State · Country · PIN Code · ZIP Code) | address | `…HoldingCompDetail[].CompDetails.AddressDetailWithZipCode.{AddrDetail★, CityOrTownOrDistrict★, StateCode★, CountryCode★, PinCode, ZipCode}` |
| — | PAN | PAN | `…HoldingCompDetail[].CompDetails.CompPAN` |
| — | Percentage of Shares held | number 0–100 | `…HoldingCompDetail[].CompDetails.CompSharePercent` |

The **subsidiary-company** table has the identical shape and feeds
`HoldingStatus.SubsidiaryCompDetail[]` with the same leaf keys
(`CompName` ★, `AddrDetail` ★, `CityOrTownOrDistrict` ★, `StateCode` ★,
`CountryCode` ★, `PinCode`, `ZipCode`, `CompPAN`, `CompSharePercent`). The
utility's `SUBSIDIARY DETAILS` sheet is a veryHidden look-up helper and is
excluded in `section_map.json` — not a filed schedule.

---

## 5 · Block D · Business organisation (GENERAL2 rows 17–23)

**Header (verbatim):** *"BUSINESS ORGANISATION Details of Amalgamating,
Amalgamated, Demerged and Resulting Company (as the case may be)"*.

| Column (verbatim) | Type / enum | Schema key |
|---|---|---|
| Business Type | enum `AMALGAMATING` · `AMALGAMATED` · `DEMERGED` · `RESULTING` | `BusOrganisation[].BusOrgType` |
| Name of the company | string (125) | `BusOrganisation[].CompName` |
| Residential Address (Address · Town/City · State · Country · PIN Code · ZIP Code) | address | `BusOrganisation[].AddressDetailWithZipCode.{AddrDetail★, CityOrTownOrDistrict★, StateCode★, CountryCode★, PinCode, ZipCode}` |
| PAN | PAN | `BusOrganisation[].BusOrgPAN` |
| Date of event | date YYYY-MM-DD | `BusOrganisation[].DateOfBusinessOrg` |

Serial number auto-increments (`C21 = C20+1`). Four rows shipped, addable.

---

## 6 · Block E · Key persons (GENERAL2 rows 28–35)

**Header (verbatim):** *"KEY PERSONS Particulars of Managing Director,
Directors, Secretary and Principal officer(s) who have held the office during
the previous year and the details of eligible person who is verifying the
return."*

| Column (verbatim) | Type / enum | Schema key |
|---|---|---|
| Name | string (125) | `KeyPersons[].PersonName` ★ |
| Designation | enum `MD-Managing Director` · `DIR-Directors` · `SEC-Secretary` · `CEO-Chief Executive Officer` · `CFO-Chief Financial Officer` · `MGR-Manager` · `OPO-any other Principal officers` | `KeyPersons[].Designation` ★ (`MD`,`DIR`,`SEC`,`CEO`,`CFO`,`MGR`,`OPO`) |
| Residential Address (Address · Town/City · State · Country · PIN Code · ZIP Code) | address | `KeyPersons[].AddressDetailWithZipCode.{AddrDetail★, CityOrTownOrDistrict★, StateCode★, CountryCode★, PinCode, ZipCode}` |
| PAN | PAN | `KeyPersons[].KeyPerPAN` |
| Aadhaar No. | string | `KeyPersons[].KeyPersnAadhaar` |
| Director Identification Number (DIN) issued by MCA, in case of Director | string | `KeyPersons[].DirectorIdNo` |

---

## 7 · Block F · Shareholders (GENERAL2 rows 40–47)

**Header (verbatim):** *"SHAREHOLDERS INFORMATION Particulars of persons who
were beneficial owners of shares holding not less than 10% of the voting power
at any time of the previous year"*.

| Column (verbatim) | Type / enum | Schema key |
|---|---|---|
| Name and address (Name · Address · Town/City · State · Country · PIN Code · ZIP Code) | name + address | `ShareHolderInfo[].ShareHolderInfoName` ★ + `…AddressDetailWithZipCode.{AddrDetail★, CityOrTownOrDistrict★, StateCode★, CountryCode★, PinCode, ZipCode}` |
| Percentage of shares held (If determinate ) | number 0–100 | `ShareHolderInfo[].PercentageOfShare` ★ |
| PAN (if allotted) | PAN | `ShareHolderInfo[].ShareHolderPAN` |
| Aadhaar No. | string | `ShareHolderInfo[].ShareHolderAadhaar` |

---

## 8 · Block G · Ownership information (GENERAL2 rows 52–59)

**Header (verbatim):** *"OWNERSHIP INFORMATION In case of unlisted company,
particulars of natural persons who were the ultimate beneficial owners, directly
or indirectly, of shares holding not less than 10% of the voting power at any
time of the previous year"*.

| Column (verbatim) | Type / enum | Schema key |
|---|---|---|
| Name and address (Name · Address · Town/City · State · Country · PIN Code · ZIP Code) | name + address | `OwnershipInfo[].OwnerName` ★ + `…AddressDetailWithZipCode.{AddrDetail★, CityOrTownOrDistrict★, StateCode★, CountryCode★, PinCode, ZipCode}` |
| Percentage of share held | number 0–100 | `OwnershipInfo[].PercentageOfShare` ★ |
| PAN | PAN | `OwnershipInfo[].OwnerPAN` |
| Aadhaar No. | string | `OwnershipInfo[].OwnerAadhaar` |

---

## 9 · Block H · Foreign-company parents (GENERAL2 rows 63–81)

Two tables, shown only for a foreign company.

**Immediate Parent Company** — *"In case of Foreign Company , please furnish the
details of Immediate Parent Company"* → `FrnCompImmediatePrntCompDtls[]`.
**Ultimate Parent Company** — *"In case of Foreign Company , please furnish the
details of Ultimate Parent Company"* → `FrnCompUltimatePrntCompDtls[]`.

Both tables have the identical columns:

| Column (verbatim) | Type / enum | Schema key (leaf) |
|---|---|---|
| Name and address (Name · Address · Town/City · State · Country · PIN Code · ZIP Code) | name + address | `Name` ★ + `AddressDetailWithZipCode.{AddrDetail★, CityOrTownOrDistrict★, StateCode★, CountryCode★, PinCode, ZipCode}` |
| Country of Residence / Country/Region of Residence | enum (250, `CountryCode` list) | `CountryOfResidence` ★ |
| PAN (if allotted) | PAN | `PAN` |
| Taxpayer's registration number or any unique identification number allotted in the country of residence | string (25) | `TaxpayerRegNumber` ★ |

---

## 10 · Block I · Nature of company and its business (GENERAL2 rows 85–93)

**Header (verbatim):** *"NATURE OF COMPANY AND ITS BUSINESS"* — Select Yes/No.
Eight statutory-category flags, every one schema-required:

| Item | Label (verbatim) | Schema key |
|---|---|---|
| — | Whether a public sector company as defined in section 2(36A) of the Income-tax Act | `NatureOfComp.PubSectCompUs2_36AFlg` ★ |
| — | Whether a company owned by the Reserve Bank of India | `NatureOfComp.RBICompFlg` ★ |
| — | Whether a company in which not less than forty percent of the shares are held (whether singly or taken together) by the Government or the Reserve Bank of India or a corporation owned by that Bank | `NatureOfComp.CompLes40PercSharGovRBIFlg` ★ |
| — | Whether a banking company as defined in clause (c) of section 5 of the Banking Regulation Act,1949 | `NatureOfComp.BankCompUs5Flg` ★ |
| — | Whether a scheduled Bank being a bank included in the Second Schedule to the Reserve Bank of India Act | `NatureOfComp.SchedBankOfRBIActFlg` ★ |
| — | Whether a company registered with Insurance Regulatory and Development Authority (established under sub-section (1) of section 3 of the Insurance Regulatory and Development Authority Act, 1999) | `NatureOfComp.CompWithIRDARegisterFlg` ★ |
| — | Whether a company being a non-banking Financial Institution | `NatureOfComp.NonBankFIICompFlg` ★ |
| — | Whether the Company is Unlisted If yes, please ensure to fill up the Schedule SH-1 and Schedule AL-1 | `NatureOfComp.CompanyUnlistedFlag` ★ |

Each is the dropdown `(Select)` · `Yes` · `No`. `CompanyUnlistedFlag` = Yes
unlocks Schedule SH-1 and Schedule AL-1.

---

## 11 · Block J · Nature of business — schema leaves (display on NATURE OF BUSINESS sheet)

The nature-of-business **codes** are the array `NatOfBus.NatureOfBusiness[]`
inside this block; they are entered on the separate **NATURE OF BUSINESS** sheet
(booked in its own file `books/ITR-6/NATURE_OF_BUSINESS.md`). Leaf keys:

| Column | Type / enum | Schema key |
|---|---|---|
| Code-Sub Sector | enum (356 codes, `NOBCode`) | `NatOfBus.NatureOfBusiness[].Code` ★ |
| Trade name | string (125) | `NatOfBus.NatureOfBusiness[].TradeName1` |
| (description) | string (125) | `NatOfBus.NatureOfBusiness[].Description` |

---

## 12 · The enums with their ranges

**HOLDING STATUS (`HoldingStatus.NatOfCompFlg`, F4):** `(Select)` · `1-Holding company` · `2-Subsidiary company` · `3-Both` · `4-If any other`.


**Yes/No flags (Nature-of-company H86–H93):** `(Select)` · `Yes` · `No`.


**Business Type (`BusOrgType`, D20:D23):** `(Select)` · `AMALGAMATING` · `AMALGAMATED` · `DEMERGED` · `RESULTING`.


**Designation (`Designation`, E32:E35):** `(Select)` · `MD-Managing Director` · `DIR-Directors` · `SEC-Secretary` · `CEO-Chief Executive Officer` · `CFO-Chief Financial Officer` · `MGR-Manager` · `OPO-any other Principal officers`.


**Audit section codes (`AuditDetails[].AuditedSection`, diii, 21 values):** `select`, `10AA`, `10(4D)`, `10(23FF)`, `44DA`, `50B`, `80-IA`, `80-IAB`, `80-IAC`, `80-IB`, `80-IC`, `80-ID`, `80-IE`, `80JJAA`, `80LA`, `115JB`, `115VW`, `33AB`, `33ABA`, `10TIA`, `OTH`. *(The utility's on-screen `AuditSectionCode` dropdown labels these: `10AA`, `44DA`, `50B`, `80-IA`, `80-IB`, `80-IC`, `80-ID`, `80-IE`, `80-IAB`, `80-IAC`, `80JJAA`, `80LA`, `115JB`, `115VW`, `33AB`, `33ABA`, `Rule 10TIA`, `Any other`.)*


**Other-Act audit (`AuditReportDetails[].AuditReportAct`, div, 17 codes 1–19):** the utility's `PartAGeneralAuditRepotDrpDwns` labels them: `Banking Regulation Act, 1949`, `Central Excise Act,1944`, `Central Sales Tax Act, 1956`, `Central Goods and Services Tax Act, 2017`, `Charitable And Religious Trusts Act, 1920`, `Companies Act, 2013`, `Electricity Act, 2003`, `Employees Provident Fund and Miscellaneous Provisions Act, 1952`, `Foreign Exchange Management Act, 1999`, `Government Superannuation Fund Act, 1956`, `Integrated Goods and Services Tax Act, 2017`, `Payment of Gratuity Act, 1972`, `SEBI Act, 1992`, `Securities Contract (Regulation) Act, 1956`, `State Goods and Services Tax Act, 2017`, `Union Territories Goods and Services Tax Act, 2017`, `Others`.


**Turnover range (`TotalSalesExcOneCr`, a2i):** `Up to Rs. 1 crore` (`Upto1CR`) · `More than Rs. 1 crore and up to Rs. 10 crores` (`Upto10CR`) · `More than Rs.10 crores` (`MoreThan10CR`).


**Cash-receipt / cash-payment percentage (`AgrOFAllAmtsRcvd`, `AgrOFAllPayMade`, a2ii/a2iii):** `Up to 5%` (`Upto5Per`) · `More than 5%` (`MoreThan5Per`).


**State code (`StateCode`, 38 values — used by every address in the block):**


`(Select)` · `01-Andaman and Nicobar islands` · `02-Andhra Pradesh` · `03-Arunachal Pradesh` · `04-Assam` · `05-Bihar` · `06-Chandigarh` · `07-The Dadra And Nagar Haveli And Daman And Diu` · `09-Delhi` · `10-Goa` · `11-Gujarat` · `12-Haryana` · `13-Himachal Pradesh` · `14-Jammu and Kashmir` · `15-Karnataka` · `16-Kerala` · `17-Lakshadweep` · `18-Madhya Pradesh` · `19-Maharashtra` · `20-Manipur` · `21-Meghalaya` · `22-Mizoram` · `23-Nagaland` · `24-Odisha` · `25-Puducherry` · `26-Punjab` · `27-Rajasthan` · `28-Sikkim` · `29-Tamil Nadu` · `30-Tripura` · `31-Uttar Pradesh` · `32-West Bengal` · `33-Chattisgarh` · `34-Uttarakhand` · `35-Jharkhand` · `36-Telangana` · `37-Ladakh` · `99-Foreign`


**Country / Region code (`CountryCode` and `CountryOfResidence`, 250 values):**


`(select)` · `93-AFGHANISTAN` · `1001-ALAND ISLANDS` · `355-ALBANIA` · `213-ALGERIA` · `684-AMERICAN SAMOA` · `376-ANDORRA` · `244-ANGOLA` · `1264-ANGUILLA` · `1010-ANTARCTICA` · `1268-ANTIGUA AND BARBUDA` · `54-ARGENTINA` · `374-ARMENIA` · `297-ARUBA` · `61-AUSTRALIA` · `43-AUSTRIA` · `994-AZERBAIJAN` · `1242-BAHAMAS` · `973-BAHRAIN` · `880-BANGLADESH` · `1246-BARBADOS` · `375-BELARUS` · `32-BELGIUM` · `501-BELIZE` · `229-BENIN` · `1441-BERMUDA` · `975-BHUTAN` · `591-BOLIVIA (PLURINATIONAL STATE OF)` · `1002-BONAIRE, SINT EUSTATIUS AND SABA` · `387-BOSNIA AND HERZEGOVINA` · `267-BOTSWANA` · `1003-BOUVET ISLAND` · `55-BRAZIL` · `1014-BRITISH INDIAN OCEAN TERRITORY` · `673-BRUNEI DARUSSALAM` · `359-BULGARIA` · `226-BURKINA FASO` · `257-BURUNDI` · `238-CABO VERDE` · `855-CAMBODIA` · `237-CAMEROON` · `1-CANADA` · `1345-CAYMAN ISLANDS` · `236-CENTRAL AFRICAN REPUBLIC` · `235-CHAD` · `56-CHILE` · `86-CHINA` · `9-CHRISTMAS ISLAND` · `672-COCOS (KEELING) ISLANDS` · `57-COLOMBIA` · `270-COMOROS` · `242-CONGO` · `243-CONGO (DEMOCRATIC REPUBLIC OF THE)` · `682-COOK ISLANDS` · `506-COSTA RICA` · `225-COTE DIVOIRE` · `385-CROATIA` · `53-CUBA` · `1015-CURACAO` · `357-CYPRUS` · `420-CZECHIA` · `45-DENMARK` · `253-DJIBOUTI` · `1767-DOMINICA` · `1809-DOMINICAN REPUBLIC` · `593-ECUADOR` · `20-EGYPT` · `503-EL SALVADOR` · `240-EQUATORIAL GUINEA` · `291-ERITREA` · `372-ESTONIA` · `251-ETHIOPIA` · `500-FALKLAND ISLANDS (MALVINAS)` · `298-FAROE ISLANDS` · `679-FIJI` · `358-FINLAND` · `33-FRANCE` · `594-FRENCH GUIANA` · `689-FRENCH POLYNESIA` · `1004-FRENCH SOUTHERN TERRITORIES` · `241-GABON` · `220-GAMBIA` · `995-GEORGIA` · `49-GERMANY` · `233-GHANA` · `350-GIBRALTAR` · `30-GREECE` · `299-GREENLAND` · `1473-GRENADA` · `590-GUADELOUPE` · `1671-GUAM` · `502-GUATEMALA` · `1481-GUERNSEY` · `224-GUINEA` · `245-GUINEA-BISSAU` · `592-GUYANA` · `509-HAITI` · `1005-HEARD ISLAND AND MCDONALD ISLANDS` · `6-HOLY SEE` · `504-HONDURAS` · `852-HONG KONG` · `36-HUNGARY` · `354-ICELAND` · `91-INDIA` · `62-INDONESIA` · `98-IRAN (ISLAMIC REPUBLIC OF)` · `964-IRAQ` · `353-IRELAND` · `1624-ISLE OF MAN` · `972-ISRAEL` · `5-ITALY` · `1876-JAMAICA` · `81-JAPAN` · `1534-JERSEY` · `962-JORDAN` · `7-KAZAKHSTAN` · `254-KENYA` · `686-KIRIBATI` · `850-KOREA (DEMOCRATIC PEOPLES REPUBLIC OF)` · `82-KOREA (REPUBLIC OF)` · `965-KUWAIT` · `996-KYRGYZSTAN` · `856-LAO PEOPLES DEMOCRATIC REPUBLIC` · `371-LATVIA` · `961-LEBANON` · `266-LESOTHO` · `231-LIBERIA` · `218-LIBYA` · `423-LIECHTENSTEIN` · `370-LITHUANIA` · `352-LUXEMBOURG` · `853-MACAO` · `389-MACEDONIA (THE FORMER YUGOSLAV REPUBLIC OF)` · `261-MADAGASCAR` · `265-MALAWI` · `60-MALAYSIA` · `960-MALDIVES` · `223-MALI` · `356-MALTA` · `692-MARSHALL ISLANDS` · `596-MARTINIQUE` · `222-MAURITANIA` · `230-MAURITIUS` · `269-MAYOTTE` · `52-MEXICO` · `691-MICRONESIA (FEDERATED STATES OF)` · `373-MOLDOVA (REPUBLIC OF)` · `377-MONACO` · `976-MONGOLIA` · `382-MONTENEGRO` · `1664-MONTSERRAT` · `212-MOROCCO` · `258-MOZAMBIQUE` · `95-MYANMAR` · `264-NAMIBIA` · `674-NAURU` · `977-NEPAL` · `31-NETHERLANDS` · `687-NEW CALEDONIA` · `64-NEW ZEALAND` · `505-NICARAGUA` · `227-NIGER` · `234-NIGERIA` · `683-NIUE` · `15-NORFOLK ISLAND` · `1670-NORTHERN MARIANA ISLANDS` · `47-NORWAY` · `968-OMAN` · `92-PAKISTAN` · `680-PALAU` · `970-PALESTINE, STATE OF` · `507-PANAMA` · `675-PAPUA NEW GUINEA` · `595-PARAGUAY` · `51-PERU` · `63-PHILIPPINES` · `1011-PITCAIRN` · `48-POLAND` · `14-PORTUGAL` · `1787-PUERTO RICO` · `974-QATAR` · `262-REUNION` · `40-ROMANIA` · `8-RUSSIAN FEDERATION` · `250-RWANDA` · `1006-SAINT BARTHELEMY` · `290-SAINT HELENA, ASCENSION AND TRISTAN DA CUNHA` · `1869-SAINT KITTS AND NEVIS` · `1758-SAINT LUCIA` · `1007-SAINT MARTIN (FRENCH PART)` · `508-SAINT PIERRE AND MIQUELON` · `1784-SAINT VINCENT AND THE GRENADINES` · `685-SAMOA` · `378-SAN MARINO` · `239-SAO TOME AND PRINCIPE` · `966-SAUDI ARABIA` · `221-SENEGAL` · `381-SERBIA` · `248-SEYCHELLES` · `232-SIERRA LEONE` · `65-SINGAPORE` · `1721-SINT MAARTEN (DUTCH PART)` · `421-SLOVAKIA` · `386-SLOVENIA` · `677-SOLOMON ISLANDS` · `252-SOMALIA` · `28-SOUTH AFRICA` · `1008-SOUTH GEORGIA AND THE SOUTH SANDWICH ISLANDS` · `211-SOUTH SUDAN` · `35-SPAIN` · `94-SRI LANKA` · `249-SUDAN` · `597-SURINAME` · `1012-SVALBARD AND JAN MAYEN` · `268-SWAZILAND` · `46-SWEDEN` · `41-SWITZERLAND` · `963-SYRIAN ARAB REPUBLIC` · `886-TAIWAN` · `992-TAJIKISTAN` · `255-TANZANIA, UNITED REPUBLIC OF` · `66-THAILAND` · `670-TIMOR-LESTE(EAST TIMOR)` · `228-TOGO` · `690-TOKELAU` · `676-TONGA` · `1868-TRINIDAD AND TOBAGO` · `216-TUNISIA` · `90-TURKEY` · `993-TURKMENISTAN` · `1649-TURKS AND CAICOS ISLANDS` · `688-TUVALU` · `256-UGANDA` · `380-UKRAINE` · `971-UNITED ARAB EMIRATES` · `44-UNITED KINGDOM OF GREAT BRITAIN AND NORTHERN IRELAND` · `2-UNITED STATES OF AMERICA` · `1009-UNITED STATES MINOR OUTLYING ISLANDS` · `598-URUGUAY` · `998-UZBEKISTAN` · `678-VANUATU` · `58-VENEZUELA (BOLIVARIAN REPUBLIC OF)` · `84-VIET NAM` · `1284-VIRGIN ISLANDS (BRITISH)` · `1340-VIRGIN ISLANDS (U.S.)` · `681-WALLIS AND FUTUNA` · `1013-WESTERN SAHARA` · `967-YEMEN` · `260-ZAMBIA` · `263-ZIMBABWE` · `9999-OTHERS`


---

## 13 · Cross-sheet feeds in and out

- **In:** the `PART A – GENERAL` sheet's status/company-type answers determine
  which of the nature-of-company flags and holding-status paths are relevant;
  the audit-liability answers (a1/a2/b/di) here are read by Part A – BS and
  Part A – P&L (rule A42: if liable u/s 44AB the balance sheet and P&L cannot be
  blank) and by the **final due date** (30 Nov where 92E/audit applies —
  rules A33/A34).
- **Out to Nature of Business (NATURE OF BUSINESS sheet):** at least one
  business code is mandatory here or at Point-61 of Sch P&L. Specific codes gate
  other schedules: `1001`/`1002`/`1003` for rule 7A/7B/8 tea-coffee-rubber
  income (rule A253); `1001`–`1018` for the 80PA deduction (rule A843); the
  power-sector nature for depreciation u/s 32(1)(i) in Schedule BP (rule A228).
- **Out to SH-1 / AL-1:** `CompanyUnlistedFlag = Yes` makes Schedule SH-1 and
  Schedule AL-1 mandatory.
- **Out to audit forms (Category D notices):** 44AB ⇒ Form 3CA-3CD/3CB-3CD
  (rule B1); 92E ⇒ Form 3CEB (rule D1).

---

## 14 · What is schema-mandatory

`PartA_GEN2For6` `required`: `LiableSec44AAflg`, `IncDclrdUs`,
`LiableSec44ABflg`, `LiableSec92Eflg`, `HoldingStatus`, `NatureOfComp`. Within
`HoldingStatus`, `NatOfCompFlg` is required. Within `NatureOfComp`, all eight
category flags are required. Inside every address, `AddrDetail`,
`CityOrTownOrDistrict`, `StateCode`, `CountryCode` are required; `PinCode` and
`ZipCode` are optional. Each table's identity leaf (`CompName`, `PersonName` +
`Designation`, `ShareHolderInfoName` + `PercentageOfShare`, `OwnerName` +
`PercentageOfShare`, `Name` + `CountryOfResidence` + `TaxpayerRegNumber`) is
required only when that row is present. `AuditInfo.AudFrmPAN`,
`AuditDetails92E.DateOfAudit`, `AuditDetails[].AuditedSection`,
`AuditReportDetails[].AuditReportAct` / `AuditReportSection` / `OtherITActFlag`,
and `NatOfBus.NatureOfBusiness[].Code` are required on their rows.

---

## 15 · What repeats

| Table | Repeatable |
|---|---|
| Holding-company details | yes (first row must be filled — row-3 note) |
| Subsidiary-company details | yes |
| Business organisation | yes (4 shipped) |
| Key persons | yes (4 shipped) |
| Shareholders (10%+) | yes (4 shipped) |
| Ownership (ultimate beneficial) | yes (4 shipped) |
| Immediate / ultimate foreign parent | yes (4 shipped each) |
| Other-Act audit reports (diii/div) | yes (7 shipped) |
| Nature of business codes | yes, up to 4 (NATURE OF BUSINESS sheet) |
| Holding-status flag, nature-of-company flags | one each |

---

## 16 · What this means for the build

1. **The block spans three display sheets.** Audit / turnover on PART A –
   GENERAL, the group/people/owner tables on GENERAL2, the codes on NATURE OF
   BUSINESS — but they export into **one** `PartA_GEN2For6` object. Keep the
   export writer for this block aware of all three source screens.
2. **Every address is the same six-field sub-object** (`AddressDetailWithZipCode`)
   with four required leaves; build it once and reuse across all eight tables.
3. **The row-3 note is a live rule** — a table whose first row is empty is
   ignored; enforce first-row-first.
4. **44AB liability is computed, not only asked** — a2i = 1–10 cr with a2ii or
   a2iii = More than 5% forces `LiableSec44ABflg`; encode rules A27/A28/A29/A36.
5. **CompanyUnlistedFlag gates SH-1/AL-1**; the nature-of-business code gates
   80PA, rule-7/8 income and power-sector depreciation.
6. **Dates are YYYY-MM-DD in the schema, `DD/MM/YYYY` on screen** — audit-report
   furnish date, 92E audit date, other-Act audit date, business-organisation
   date of event.
