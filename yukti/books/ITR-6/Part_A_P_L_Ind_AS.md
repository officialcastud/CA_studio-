# The book of Part A — Statement of Profit and Loss (Ind AS) · ITR-6, A.Y. 2026-27

Read row by row from the utility's **Part A-P& L - Ind AS** sheet (243 rows, with
the hidden-row flags) and confirmed against the CBDT ITR-6 schema's
`PARTA_PLIndAS`. Nothing here is invented; every label, item number, dropdown
value and rule is the department's own. This is the **Ind-AS** Statement of
Profit and Loss (Schedule III, Division II) — shown to a company whose financial
statements are drawn up under the Indian Accounting Standards; it carries the
gross profit in from the Ind-AS Trading Account and adds an **Other
Comprehensive Income** block that the regular P&L does not have.

The sheet's own heading: *Statement of Profit and Loss for the financial year
2025-26 [applicable for a company whose financial statements are drawn up in
compliance with the Ind AS].*

---

## 1 · Why this sheet is different from the regular P&L

Because the accounts are drawn under Ind AS, the revenue-from-operations
breakdown and the opening/closing-stock lines live on the Ind-AS Trading Account,
not here — so those rows on this sheet are **hidden**, and the P&L instead opens
with a single fed line, *Gross profit transferred from Trading Account
(12+12b+12d)*. Below the normal appropriations it adds the **Other Comprehensive
Income** working (items 61A and 61B) and a **Total Comprehensive Income** line
(item 62) that the regular P&L does not carry. The 44AE presumptive block and the
no-account case are present on the sheet but **hidden** (they belong to the
non-Ind-AS P&L).

---

## 2 · The shape

| Block | What it is | Schema root |
|---|---|---|
| **Credits** | Gross profit from Trading Account, other income, total credits | `CreditsToPL` |
| **Debits** | All operating expenses; PBIDTA; interest; depreciation; PBT | `DebitsToPL.DebitPlAcnt` |
| **Tax & appropriations** | current/deferred tax, profit after tax, appropriations, balance carried | `DebitsToPL.TaxProvAppr` |
| **Other Comprehensive Income** | 61A items not reclassified, 61B items reclassified, 62 total | `OtherComprnsvInc` |

---

## 3 · Credits to the P&L

| Item | Label (verbatim) | Type | Schema key | Hidden? |
|---|---|---|---|---|
| **1** | Gross profit transferred from Trading Account (12+12b+12d) | fed-in | `CreditsToPL.GrossProfitTrnsfFrmTrdAcc` | no |
| **2 i** | Rent | integer | `CreditsToPL.OthIncome.RentInc` | no |
| **2 ii** | Commission | integer | `CreditsToPL.OthIncome.Comissions` | no |
| **2 iii** | Dividend income | integer | `CreditsToPL.OthIncome.Dividends` | no |
| **2 iv** | Interest income | integer | `CreditsToPL.OthIncome.InterestInc` | no |
| **2 v** | Profit on sale of fixed assets | integer | `CreditsToPL.OthIncome.ProfitOnSaleFixedAsset` | no |
| **2 vi** | Profit on sale of investment being securities chargeable to Securities Transaction Tax (STT) | integer | `CreditsToPL.OthIncome.ProfitOnInvChrSTT` | no |
| **2 vii** | Profit on sale of other investment | integer | `CreditsToPL.OthIncome.ProfitOnOthInv` | no |
| **2 viii** | Gain(Loss) on account of foreign exchange fluctuation u/s 43AA | integer | `CreditsToPL.OthIncome.ProfitOnCurrFluct` | no |
| **2 ix** | Profit on conversion of inventory into capital asset u/s 28(via) (Fair Market Value of inventory as on the date of conversion) | integer | `CreditsToPL.OthIncome.ProfitOnCnvInvntryToCapAsst` | no |
| **2 x** | Agricultural income | integer | `CreditsToPL.OthIncome.ProfitOnAgriIncome` | no |
| **2 xi** | Any other income (specify nature and amount) — table | table | `CreditsToPL.OthIncome.OtherIncDtls[]` (`OthersDesc`, `OthersAmount`) | no |
| **2 xia** | Liabilities written back | integer | `CreditsToPL.OthIncome.LiabilityWrittenBack` | no |
| **2 xib** | Amount of interest due or received from partnership firm | integer | `CreditsToPL.OthIncome.AmtofInterest` | no |
| **2 xic** | Total (xia + xib+xin) | computed | `CreditsToPL.OthIncome.MiscOthIncome` | no |
| **2 xii** | Total of other income (i + ii + iii + iv + v + vi + vii + viii + ix +x+ xic) | computed | `CreditsToPL.OthIncome.TotOthIncome` | no |
| **—** | Total of credits to statement of profit and loss (13+14xii) | computed | `CreditsToPL.TotCreditsToPL` | no |

---

## 4 · Debits to the P&L — operating expenses

Schema root `DebitsToPL.DebitPlAcnt`.

| Item | Label (verbatim) | Schema key |
|---|---|---|
| 16 | Freight outward | `Freight` |
| 17 | Consumption of stores and spare parts | `ConsumptionOfStores` |
| 18 | Power and fuel | `PowerFuel` |
| 19 | Rents | `RentExpdr` |
| 20 | Repairs to building | `RepairsBldg` |
| 21 | Repairs to machinery | `RepairMach` |
| **22** | Compensation to employees | group `EmployeeComp` |
| 22 i | Salaries and wages | `EmployeeComp.SalsWages` |
| 22 ii | Bonus | `EmployeeComp.Bonus` |
| 22 iii | Reimbursement of medical expenses | `EmployeeComp.MedExpReimb` |
| 22 iv | Leave encashment | `EmployeeComp.LeaveEncash` |
| 22 v | Leave travel benefits | `EmployeeComp.LeaveTravelBenft` |
| 22 vi | Contribution to approved superannuation fund | `EmployeeComp.ContToSuperAnnFund` |
| 22 vii | Contribution to recognised provident fund | `EmployeeComp.ContToPF` |
| 22 viii | Contribution to recognised gratuity fund | `EmployeeComp.ContToGratFund` |
| 22 ix | Contribution to any other fund | `EmployeeComp.ContToOthFund` |
| 22 x | Any other benefit to employees in respect of which an expenditure has been incurred | `EmployeeComp.OthEmpBenftExpdr` |
| 22 xi | Total compensation to employees (total of 22i to 22x) | `EmployeeComp.TotEmployeeComp` |
| 22 xiia | Whether any compensation, included in 22xi, paid to non-resident | `EmployeeComp.AnyCompPaidToNonRes` (enum Yes/No) |
| 22 xiib | If Yes, amount paid to non-residents | `EmployeeComp.AmtPaidToNonRes` |
| **23** | Insurance | group `Insurances` |
| 23 i | Medical Insurance | `Insurances.MedInsur` |
| 23 ii | Life Insurance | `Insurances.LifeInsur` |
| 23 iii | Keyman's Insurance | `Insurances.KeyManInsur` |
| 23 iv | Other Insurance including factory, office, car, goods, etc. | `Insurances.OthInsur` |
| 23 v | Total expenditure on insurance (23i+23ii+23iii+23iv) | `Insurances.TotInsurances` |
| 24 | Workmen and staff welfare expenses | `StaffWelfareExp` |
| 25 | Entertainment | `Entertainment` |
| 26 | Hospitality | `Hospitality` |
| 27 | Conference | `Conference` |
| 28 | Sales promotion including publicity (other than advertisement) | `SalePromoExp` |
| 29 | Advertisement | `Advertisement` |
| **30** | Commission → i Paid outside India, or paid in India to a non-resident other than a company or a foreign company | `CommissionExpdrDtls.NonResOtherCompany` |
| 30 ii | To others | `CommissionExpdrDtls.Others` |
| 30 iii | Total (i + ii) | `CommissionExpdrDtls.Total` |
| **31** | Royalty → i Paid outside India, or paid in India to a non-resident other than a company or a foreign company | `RoyalityDtls.NonResOtherCompany` |
| 31 ii | To others | `RoyalityDtls.Others` |
| 31 iii | Total (i + ii) | `RoyalityDtls.Total` |
| **32** | Professional / Consultancy fees / Fee for technical services → i Paid outside India, or paid in India to a non-resident other than a company or a foreign company | `ProfessionalConstDtls.NonResOtherCompany` |
| 32 ii | To others | `ProfessionalConstDtls.Others` |
| 32 iii | Total (i + ii) | `ProfessionalConstDtls.Total` |
| 33 | Hotel, boarding and Lodging | `HotelBoardLodge` |
| 34 | Traveling expenses other than on foreign traveling | `TravelExp` |
| 35 | Foreign traveling expenses | `ForeignTravelExp` |
| 36 | Conveyance expenses | `ConveyanceExp` |
| 37 | Telephone expenses | `TelephoneExp` |
| 38 | Guest House expenses | `GuestHouseExp` |
| 39 | Club expenses | `ClubExp` |
| 40 | Festival celebration expenses | `FestivalCelebExp` |
| 41 | Scholarship | `Scholarship` |
| 42 | Gift | `Gift` |
| 43 | Donation | `Donation` |

### Item 44 · Rates and taxes, paid or payable (`RatesTaxesPays.ExciseCustomsVAT`)

| Item | Label (verbatim) | Schema key |
|---|---|---|
| 44 | Rates and taxes, paid or payable to Government or any local body (excluding taxes on income) | group |
| 44 i | Union excise duty | `UnionExciseDuty` |
| 44 ii | Service tax | `ServiceTax` |
| 44 iii | VAT/ Sales tax | `VATorSaleTax` |
| 44 iv | Cess | `Cess` |
| 44 v | Central Goods & Service Tax (CGST) | `CentralGoodServiceTax` |
| 44 vi | State Goods & Services Tax (SGST) | `StateGoodServiceTax` |
| 44 vii | Integrated Goods & Services Tax (IGST) | `IntegratedGoodServiceTax` |
| 44 viii | Union Territory Goods & Services Tax (UTGST) | `UnionTerrGoodServiceTax` |
| 44 ix | Any other rate, tax, duty or cess incl. STT and CTT | `OthDutyTaxCess` |
| 44 x | Total rates and taxes paid or payable (44i + 44ii + … + 44ix) | `TotExciseCustomsVAT` |
| 45 | Audit fee | `AuditFee` |

### Item 46 · Other expenses; item 47 · Bad debts

| Item | Label (verbatim) | Schema key |
|---|---|---|
| 46 | Other expenses (specify nature and amount) — table | `OtherExpensesDtls[]` (`ExpenseNature`, `Amount`) |
| 46 iii | Total (of other expenses) | `OtherExpenses` |
| 47 | Bad debts written off (specify PAN/Aadhar No. of the person, if it is available, for whom Bad Debt for amount of Rs. 1 lakh or more is claimed) — table | `BadDebtDtls.BadDebtAmtDtls[]` (`PAN`, `Aadhaar`, `Amount`) |
| 47 i | Total (of the PAN/Aadhaar bad-debt table) | `BadDebtDtls.BadDebtAmtDtlsTotal` |
| 47 ii | Others (more than Rs. 1 lakh) where PAN/Aadhaar No. is not available (provide name and complete address) — table | `BadDebtDtls.OthersPANNotAvlblDtl[]` (see address columns below) |
| 47 ii total | Total (of the no-PAN bad-debt table) | `BadDebtDtls.OthersPANNotAvlblDtlTotal` |
| 47 iii | Others (amounts less than Rs. 1 lakh) | `BadDebtDtls.OthersAmtLt1Lakh` |
| 47 iv | Total Bad Debt (47i + 47ii + 47iii) | `BadDebtDtls.BadDebt` |

The no-PAN bad-debt table (item 47ii) address columns (header row, verbatim):
*Name · Flat/ Door/ Block No. · Name of Premises / Building / Village · Road/
Street/Post office · Area/ Locality · Town/ City/ District · State ·
Country/Region · PIN Code · ZIP Code · Amount* —

| Column | Schema key (under `BadDebtDtls.OthersPANNotAvlblDtl[]`) |
|---|---|
| Name | `Name` |
| Flat/ Door/ Block No. | `FlatDoorBlockNumber` |
| Name of Premises / Building / Village | `PremisesBuildingName` |
| Road/ Street/Post office | `RoadStreetPostOffice` |
| Area/ Locality | `AreaLocality` |
| Town/ City/ District | `TownCityDistrict` |
| State | `StateCode` (enum, see appendix §12) |
| Country/Region | `CountryCode` (enum, see appendix §12) |
| PIN Code | `PinCode` |
| ZIP Code | `ZipCode` |
| Amount | `Amount` |

### Items 48 to 53 · provisions, PBIDTA, interest, depreciation, PBT

| Item | Label (verbatim) | Schema key |
|---|---|---|
| 48 | Provision for bad and doubtful debts | `ProvForBadDoubtDebt` |
| 49 | Other provisions | `OthProvisionsExpdr` |
| 50 | Profit before interest, depreciation and taxes [15 – (16 to 21 + 22xi + 23v + 24 to 29 + 30iii + 31iii + 32iii + 33 to 43 + 44x + 45 + 46iii + 47iv + 48 + 49)] | `PBIDTA` |
| 51 | Interest → i Paid outside India, or paid in India to a non-resident other than a company or a foreign company | `InterestExpdrtDtls.NonResOtherCompany` |
| 51 ii | To others | `InterestExpdrtDtls.Others` |
| 51 iii | Total (i + ii) | `InterestExpdrtDtls.InterestExpdr` |
| 52 | Depreciation and amortization | `DepreciationAmort` |
| 53 | Net Profit before taxes (50 – 51iii – 52) | `PBT` |

---

## 5 · Provisions for tax and appropriations

The sheet's section heading reads (verbatim, with the utility's own spelling):
*PROVISIONS FOR TAX AND APPROCIATIONS.* Schema root `DebitsToPL.TaxProvAppr`.

| Item | Label (verbatim) | Schema key |
|---|---|---|
| 54 | Provision for current tax | `ProvForCurrTax` |
| 55 | Provision for Deferred Tax | `ProvDefTax` |
| 56 | Profit after tax (53 - 54 - 55) | `ProfitAfterTax` |
| 57 | Balance brought forward from previous year | `BalBFPrevYr` |
| 58 | Amount available for appropriation (56 + 57) | `AmtAvlAppr` |
| **59** | Appropriations | group `Appropriations` |
| 59 i | Transferred to reserves and surplus | `Appropriations.TrfToReserves` |
| 59 ii | Proposed dividend/ Interim dividend | `Appropriations.ProposedDividend` |
| 59 iii | Tax on dividend/ Tax on dividend for earlier years | `Appropriations.TaxOnDividend` |
| 59 iv | Appropriation towards Corporate Social Responsibility (CSR) activities (in case of companies covered under section 135 of the Companies Act, 2013) | `Appropriations.AppropriationsCSR` |
| 59 v | Any other appropriation | `Appropriations.AnyOtherAppr` |
| 59 vi | Total (59i + 59ii + 59iii + 59iv+59v) | `Appropriations.TotAppropriations` |
| 60 | Balance carried to balance sheet (58 – 59vi) | `PartnerAccBalTrf` |

Note the schema names item 60 `PartnerAccBalTrf` (a carried-over name); it is the
balance carried to the balance sheet.

---

## 6 · Other Comprehensive Income — the Ind-AS-only block

The heading row *Other Comprehensive Income* (row 184) is hidden on the sheet,
but its content rows (185 onward) are visible and filed. Schema root
`OtherComprnsvInc`.

### 61A · Items that will not be reclassified to P&L (`ItemsNotReclsfdPnL`)

| Item | Label (verbatim) | Schema key |
|---|---|---|
| 61A i | Changes in revaluation surplus | `ChangesInSurplus` |
| 61A ii | Re-measurements of the defined benefit plans | `ReMesDefinedBenftPlans` |
| 61A iii | Equity instruments through OCI | `EquityOCI` |
| 61A iv | Fair value Changes relating to own credit risk of financial liabilities designated at FVTPL | `FairValFVTPl` |
| 61A v | Share of Other comprehensive income in associates and joint ventures, to the extent not to be classified into P&L | `ShareOfOtherComprInc` |
| 61A vi | Others (Specify nature) — table | `OtherIncDtls[]` (`OthersDesc`, `OthersAmount`) |
| 61A vi total | Total of (vi) | `OthersTotal` |
| 61A vii | Income tax relating to items that will not be reclassified to P&L | `IncomeTaxNotPnL` |
| 61A | Total | `TotalNotPnL` |

### 61B · Items that will be reclassified to P&L (`ItemsReclsfdPnL`)

| Item | Label (verbatim) | Schema key |
|---|---|---|
| 61B i | Exchange differences in translating the financial statements of a foreign operation | `ExchangeDiff` |
| 61B ii | Debt instruments through OCI | `DebtsOCI` |
| 61B iii | The effective portion of gains and loss on hedging instruments in a cash flow hedge | `EffecPortionGainnLoss` |
| 61B iv | Share of OCI in associates and joint ventures to the extent to be classified into P&L | `ShareOCI` |
| 61B v | Others (Specify nature) — table | `OtherIncDtls[]` (`OthersDesc`, `OthersAmount`) |
| 61B v total | Total of (v) | `OthersTotal` |
| 61B vi | Income tax relating to items that will be reclassified to P&L | `IncomeTaxReclsPnL` |
| 61B | Total | `TotalPnL` |
| **62** | Total Comprehensive Income (56 + 61A + 61B) | `TotalComprIncome` |

---

## 7 · Enums / dropdowns (on live rows)

| Cell | List |
|---|---|
| 22 xiia `AnyCompPaidToNonRes` | (Select), Yes, No |
| 47ii `StateCode` | the 38-code State list — see appendix §12 |
| 47ii `CountryCode` | the 251-code Country/Region list — see appendix §12 |

All other cells are numeric or free text (the "Nature" columns are 125-character
strings; the address columns 50 characters; amounts to the 14-digit maximum).

---

## 8 · The rules the sheet computes

| Rule | What it asserts |
|---|---|
| **A117** | 61(ii) Total presumptive income from goods carriage u/s 44AE = the table total (44AE block; hidden here) |
| **A118** | In the 44AE table 61(i), total of column 4 (months) must be within bounds (44AE block; hidden here) |
| identity | Item 1 (Gross profit) = Trading Account (Ind AS) item 12 + 12b + 12d |
| identity | Item 50 (PBIDTA), 53 (PBT), 56 (PAT), 58, 59vi, 60, 61A, 61B, 62 are the computed chain shown in each label |

---

## 9 · Cross-sheet feeds

| Direction | Feed |
|---|---|
| in | Item 1 ← Trading Account (Ind AS) items 12 + 12b + 12d (gross profit + intraday income + F&O income) |
| out | Net profit / PBT and the individual expense and income lines → **Schedule BP** as the book-profit starting point; the OI add-backs adjust from there |
| out | Item 60 (balance carried) → retained earnings on the Balance Sheet (Ind AS) |
| out | Item 62 Total Comprehensive Income → the Ind-AS disclosure / MAT book-profit working |

---

## 10 · What repeats, what is mandatory

- **Repeatable tables:** Any other income (`OtherIncDtls[]`), Other expenses
  (`OtherExpensesDtls[]`), the two bad-debt tables
  (`BadDebtAmtDtls[]`, `OthersPANNotAvlblDtl[]`), and the two OCI "Others" tables
  (`ItemsNotReclsfdPnL.OtherIncDtls[]`, `ItemsReclsfdPnL.OtherIncDtls[]`).
- Everything else is a single figure or (item 22xiia) a flag.
- The schema marks the great majority of leaves as required; the block is written
  in full for an Ind-AS company. Optional lines
  (`LiabilityWrittenBack`, `AmtofInterest`, `AmtPaidToNonRes`,
  `AnyCompPaidToNonRes`, the whole `RatesTaxesPays` sub-lines, the bad-debt PAN/
  Aadhaar/ZIP/PIN/premises/road cells, and the appropriation sub-lines
  `ProposedDividend`/`TaxOnDividend`/`AppropriationsCSR`/`AnyOtherAppr`) are
  written only when they carry a value.

---

## 11 · Hidden rows — read, listed, NOT built

The following rows are **hidden** on the sheet. They belong to the non-Ind-AS
P&L (their content is captured elsewhere for an Ind-AS filer) or are alternative
computations; they are listed here per the "never build a hidden row" rule.

| Rows (hidden) | Block | Why hidden |
|---|---|---|
| 5–15 (Avi) | Sales/ Gross receipts of business — sale of products/goods, sale of services, other operating revenues, interest and other financial services (finance company), total | on Ind-AS accounts this revenue detail lives on the **Trading Account (Ind AS)**; here only the gross profit (item 1) is carried |
| 16–26 (Bix, 1C) | Duties, taxes and cess received or receivable; Total Revenue from operations | same — captured on the Trading Account (Ind AS) |
| 40 | "Liabilities written back" heading | duplicate heading; the live line is item 2xia at row 42 |
| 49–53 (3i–3iv) | Closing Stock (raw material, WIP, finished goods, total) | captured on the Trading/Manufacturing Accounts (Ind AS) |
| 54 | Total of credits to profit and loss account (1C + 2xi + 3iv) | superseded by the Ind-AS credits total (row 74) |
| 55–59 (5i–5iv) | Opening Stock (raw material, WIP, finished goods, total) | captured on the Trading/Manufacturing Accounts (Ind AS) |
| 60 | Purchases (net of refunds and duty or tax, if any) | captured on the Trading Account (Ind AS) |
| 61–73 (7i–7xii) | Duties and taxes, paid or payable, in respect of goods and services purchased; total | captured on the Trading Account (Ind AS) |
| 184 | "Other Comprehensive Income" heading | heading only; the OCI content rows 185+ are visible and filed |
| 211–224 (63) | COMPUTATION OF PRESUMPTIVE INCOME FROM GOODS CARRIAGES UNDER SECTION 44AE (Sl.No, Name of Business, Business Code, Description; registration/tonnage/months/presumptive-income table; total 63ii) | presumptive 44AE is a non-Ind-AS-company path; not applicable to a company on regular Ind-AS books |
| 225–240 (64) | NO ACCOUNT CASE — for a business (64ia gross receipts a1/a2, gross profit, expenses, net profit) and for a profession (64iia–64iid), total 64iii | a company on Ind-AS books maintains accounts, so the no-account case does not apply |

None of these hidden rows has a leaf key in `PARTA_PLIndAS` (they belong to the
non-Ind-AS `PARTA_PL` block); logged as excluded.

---

## 12 · Appendix — dropdown value lists (checked by the gate)

These lists back the enums on this sheet: **State** and **Country/Region** on the
live no-PAN bad-debt address table (item 47ii), and — on the **hidden** 44AE block
(rows 211–224, not built) — the **Business Code** list and the
**Owned/Leased/Hired** flag. They are reproduced verbatim so the build seeds them
from the enum file.

### Yes/No flag (item 22xiia)
(Select) | Yes | No

### Owned/Leased/Hired (hidden 44AE table, column "Whether owned/leased/hired")
(Select) | Owned | Leased | Hired

### Business Code — BCode.44AE (hidden 44AE table, column "Business Code")
(Select) | 08001-Renting of land transport equipment | 11002-Packers and movers | 11008-Freight transport by road | 11010-Forwarding of freight | 11011-Receiving and acceptance of freight | 11012-Cargo handling | 11015-Other Transport & Logistics services n.e.c

### State (item 47ii address, column "State")
(Select) | 01-Andaman and Nicobar islands | 02-Andhra Pradesh | 03-Arunachal Pradesh | 04-Assam | 05-Bihar | 06-Chandigarh | 07-The Dadra And Nagar Haveli And Daman And Diu | 09-Delhi | 10-Goa | 11-Gujarat | 12-Haryana | 13-Himachal Pradesh | 14-Jammu and Kashmir | 15-Karnataka | 16-Kerala | 17-Lakshadweep | 18-Madhya Pradesh | 19-Maharashtra | 20-Manipur | 21-Meghalaya | 22-Mizoram | 23-Nagaland | 24-Odisha | 25-Puducherry | 26-Punjab | 27-Rajasthan | 28-Sikkim | 29-Tamil Nadu | 30-Tripura | 31-Uttar Pradesh | 32-West Bengal | 33-Chattisgarh | 34-Uttarakhand | 35-Jharkhand | 36-Telangana | 37-Ladakh | 99-Foreign

### Country/Region (item 47ii address, column "Country/Region")
(select) | 93-AFGHANISTAN | 1001-ALAND ISLANDS | 355-ALBANIA | 213-ALGERIA | 684-AMERICAN SAMOA | 376-ANDORRA | 244-ANGOLA | 1264-ANGUILLA | 1010-ANTARCTICA | 1268-ANTIGUA AND BARBUDA | 54-ARGENTINA | 374-ARMENIA | 297-ARUBA | 61-AUSTRALIA | 43-AUSTRIA | 994-AZERBAIJAN | 1242-BAHAMAS | 973-BAHRAIN | 880-BANGLADESH | 1246-BARBADOS | 375-BELARUS | 32-BELGIUM | 501-BELIZE | 229-BENIN | 1441-BERMUDA | 975-BHUTAN | 591-BOLIVIA (PLURINATIONAL STATE OF) | 1002-BONAIRE, SINT EUSTATIUS AND SABA | 387-BOSNIA AND HERZEGOVINA | 267-BOTSWANA | 1003-BOUVET ISLAND | 55-BRAZIL | 1014-BRITISH INDIAN OCEAN TERRITORY | 673-BRUNEI DARUSSALAM | 359-BULGARIA | 226-BURKINA FASO | 257-BURUNDI | 238-CABO VERDE | 855-CAMBODIA | 237-CAMEROON | 1-CANADA | 1345-CAYMAN ISLANDS | 236-CENTRAL AFRICAN REPUBLIC | 235-CHAD | 56-CHILE | 86-CHINA | 9-CHRISTMAS ISLAND | 672-COCOS (KEELING) ISLANDS | 57-COLOMBIA | 270-COMOROS | 242-CONGO | 243-CONGO (DEMOCRATIC REPUBLIC OF THE) | 682-COOK ISLANDS | 506-COSTA RICA | 225-COTE DIVOIRE | 385-CROATIA | 53-CUBA | 1015-CURACAO | 357-CYPRUS | 420-CZECHIA | 45-DENMARK | 253-DJIBOUTI | 1767-DOMINICA | 1809-DOMINICAN REPUBLIC | 593-ECUADOR | 20-EGYPT | 503-EL SALVADOR | 240-EQUATORIAL GUINEA | 291-ERITREA | 372-ESTONIA | 251-ETHIOPIA | 500-FALKLAND ISLANDS (MALVINAS) | 298-FAROE ISLANDS | 679-FIJI | 358-FINLAND | 33-FRANCE | 594-FRENCH GUIANA | 689-FRENCH POLYNESIA | 1004-FRENCH SOUTHERN TERRITORIES | 241-GABON | 220-GAMBIA | 995-GEORGIA | 49-GERMANY | 233-GHANA | 350-GIBRALTAR | 30-GREECE | 299-GREENLAND | 1473-GRENADA | 590-GUADELOUPE | 1671-GUAM | 502-GUATEMALA | 1481-GUERNSEY | 224-GUINEA | 245-GUINEA-BISSAU | 592-GUYANA | 509-HAITI | 1005-HEARD ISLAND AND MCDONALD ISLANDS | 6-HOLY SEE | 504-HONDURAS | 852-HONG KONG | 36-HUNGARY | 354-ICELAND | 91-INDIA | 62-INDONESIA | 98-IRAN (ISLAMIC REPUBLIC OF) | 964-IRAQ | 353-IRELAND | 1624-ISLE OF MAN | 972-ISRAEL | 5-ITALY | 1876-JAMAICA | 81-JAPAN | 1534-JERSEY | 962-JORDAN | 7-KAZAKHSTAN | 254-KENYA | 686-KIRIBATI | 850-KOREA (DEMOCRATIC PEOPLES REPUBLIC OF) | 82-KOREA (REPUBLIC OF) | 965-KUWAIT | 996-KYRGYZSTAN | 856-LAO PEOPLES DEMOCRATIC REPUBLIC | 371-LATVIA | 961-LEBANON | 266-LESOTHO | 231-LIBERIA | 218-LIBYA | 423-LIECHTENSTEIN | 370-LITHUANIA | 352-LUXEMBOURG | 853-MACAO | 389-MACEDONIA (THE FORMER YUGOSLAV REPUBLIC OF) | 261-MADAGASCAR | 265-MALAWI | 60-MALAYSIA | 960-MALDIVES | 223-MALI | 356-MALTA | 692-MARSHALL ISLANDS | 596-MARTINIQUE | 222-MAURITANIA | 230-MAURITIUS | 269-MAYOTTE | 52-MEXICO | 691-MICRONESIA (FEDERATED STATES OF) | 373-MOLDOVA (REPUBLIC OF) | 377-MONACO | 976-MONGOLIA | 382-MONTENEGRO | 1664-MONTSERRAT | 212-MOROCCO | 258-MOZAMBIQUE | 95-MYANMAR | 264-NAMIBIA | 674-NAURU | 977-NEPAL | 31-NETHERLANDS | 687-NEW CALEDONIA | 64-NEW ZEALAND | 505-NICARAGUA | 227-NIGER | 234-NIGERIA | 683-NIUE | 15-NORFOLK ISLAND | 1670-NORTHERN MARIANA ISLANDS | 47-NORWAY | 968-OMAN | 92-PAKISTAN | 680-PALAU | 970-PALESTINE, STATE OF | 507-PANAMA | 675-PAPUA NEW GUINEA | 595-PARAGUAY | 51-PERU | 63-PHILIPPINES | 1011-PITCAIRN | 48-POLAND | 14-PORTUGAL | 1787-PUERTO RICO | 974-QATAR | 262-REUNION | 40-ROMANIA | 8-RUSSIAN FEDERATION | 250-RWANDA | 1006-SAINT BARTHELEMY | 290-SAINT HELENA, ASCENSION AND TRISTAN DA CUNHA | 1869-SAINT KITTS AND NEVIS | 1758-SAINT LUCIA | 1007-SAINT MARTIN (FRENCH PART) | 508-SAINT PIERRE AND MIQUELON | 1784-SAINT VINCENT AND THE GRENADINES | 685-SAMOA | 378-SAN MARINO | 239-SAO TOME AND PRINCIPE | 966-SAUDI ARABIA | 221-SENEGAL | 381-SERBIA | 248-SEYCHELLES | 232-SIERRA LEONE | 65-SINGAPORE | 1721-SINT MAARTEN (DUTCH PART) | 421-SLOVAKIA | 386-SLOVENIA | 677-SOLOMON ISLANDS | 252-SOMALIA | 28-SOUTH AFRICA | 1008-SOUTH GEORGIA AND THE SOUTH SANDWICH ISLANDS | 211-SOUTH SUDAN | 35-SPAIN | 94-SRI LANKA | 249-SUDAN | 597-SURINAME | 1012-SVALBARD AND JAN MAYEN | 268-SWAZILAND | 46-SWEDEN | 41-SWITZERLAND | 963-SYRIAN ARAB REPUBLIC | 886-TAIWAN | 992-TAJIKISTAN | 255-TANZANIA, UNITED REPUBLIC OF | 66-THAILAND | 670-TIMOR-LESTE(EAST TIMOR) | 228-TOGO | 690-TOKELAU | 676-TONGA | 1868-TRINIDAD AND TOBAGO | 216-TUNISIA | 90-TURKEY | 993-TURKMENISTAN | 1649-TURKS AND CAICOS ISLANDS | 688-TUVALU | 256-UGANDA | 380-UKRAINE | 971-UNITED ARAB EMIRATES | 44-UNITED KINGDOM OF GREAT BRITAIN AND NORTHERN IRELAND | 2-UNITED STATES OF AMERICA | 1009-UNITED STATES MINOR OUTLYING ISLANDS | 598-URUGUAY | 998-UZBEKISTAN | 678-VANUATU | 58-VENEZUELA (BOLIVARIAN REPUBLIC OF) | 84-VIET NAM | 1284-VIRGIN ISLANDS (BRITISH) | 1340-VIRGIN ISLANDS (U.S.) | 681-WALLIS AND FUTUNA | 1013-WESTERN SAHARA | 967-YEMEN | 260-ZAMBIA | 263-ZIMBABWE | 9999-OTHERS

---

## 13 · What this means for the build

1. The credits side opens with a **fed line** (item 1) from the Trading Account
   (Ind AS); do not re-collect the sales/stock detail — those rows are hidden here.
2. The debits side is a long expense list with several "Paid outside India / To
   others" pairs (commission, royalty, professional fees, interest) that each
   total; and four free tables (other income, other expenses, two bad-debt tables)
   plus the two OCI "Others" tables.
3. The Ind-AS-only additions are the OCI block (61A, 61B) and Total Comprehensive
   Income (item 62) — build them; they are absent from the regular P&L.
4. Do **not** build the hidden 44AE and no-account blocks (rows 211–240) or the
   hidden trading/stock rows (5–73); they have no key in `PARTA_PLIndAS`.
5. Seed the State and Country/Region dropdowns (bad-debt address) from the enum
   file, not by hand.
6. Mind schema spellings: `Comissions`, `RoyalityDtls`, `EffecPortionGainnLoss`,
   `PartnerAccBalTrf` (= balance carried), `OtherFinacialAssets` is on the BS not
   here.
