# The book of Part A — Statement of Profit and Loss · ITR-6, A.Y. 2026-27

Read row by row from the utility's **PROFIT LOSS** sheet (179 live rows out of a
65,555-row sheet; rows 4–27, 42, 51–75, 94, 182, 211 and 212 are hidden) with
its formulas, and confirmed against the CBDT ITR-6 schema block **`PARTA_PL`**
(`ITRForm:PartA_PL`). Every label, item number and formula below is the
department's own.

The sheet's own heading (F3): *"Statement of Profit and Loss for the financial
year 2025-26 (fill items 13 to 60 in a case where regular books of account are
maintained, otherwise fill items 61 to 62 as applicable)."* The Ind-AS P&L is a
separate sheet (`Part A-P& L - Ind AS`) and a separate block.

---

## 1 · Why the P&L is the last of the three financial statements

The Manufacturing Account produced the cost of goods, the Trading Account
produced the **Gross Profit**; the Statement of Profit and Loss takes that
gross profit as its first credit, adds other income, subtracts every operating
expense, interest and depreciation to reach **Net Profit before taxes**, then
takes off tax provisions and appropriations to reach the **Balance carried to
the balance sheet**. Two special appendices sit at the foot: the presumptive
computation under section 44AE (item 61) and the no-account / foreign-company
case (item 62).

Because a company that maintains regular books fills the Trading Account for its
revenue, the P&L's own "Revenue from operations" block (items 1–1C, rows 4–27)
is **hidden** here and filled on the Trading Account instead. Those hidden rows
carry no `PARTA_PL` schema key and are excluded (§5).

---

## 2 · Credits to the Statement of Profit and Loss (items 13–17)

All amounts are integers (rupees). Computed rows are green and untypeable.
Schema paths are under `PARTA_PL.CreditsToPL`.

| Item | Row | Label | Type | Schema key | Formula / derivation |
|---|---|---|---|---|---|
| **13** | 29 | **Gross profit transferred from Trading Account (12 + 12b + 12d)** | fed | `GrossProfitTrnsfFrmTrdAcc` | `= TradingAcc GrossProfit + Intraday income (12b) + F&O income (12d)` |
| **14** | 30 | **Other income** | group | `OthIncome` | |
| 14i | 31 | Rent | figure | `OthIncome.RentInc` | entered |
| 14ii | 32 | Commission | figure | `OthIncome.Comissions` | entered |
| 14iii | 33 | Dividend income | figure | `OthIncome.Dividends` | entered |
| 14iv | 34 | Interest income | figure | `OthIncome.InterestInc` | entered |
| 14v | 35 | Profit on sale of fixed assets | figure | `OthIncome.ProfitOnSaleFixedAsset` | entered |
| 14vi | 36 | Profit on sale of investment being securities chargeable to Securities Transaction Tax (STT) | figure | `OthIncome.ProfitOnInvChrSTT` | entered |
| 14vii | 37 | Profit on sale of other investment | figure | `OthIncome.ProfitOnOthInv` | entered |
| 14viii | 38 | Gain (Loss) on account of foreign exchange fluctuation u/s 43AA | figure | `OthIncome.ProfitOnCurrFluct` | entered |
| 14ix | 39 | Profit on conversion of inventory into capital asset u/s 28(via) (Fair Market Value of inventory as on the date of conversion) | figure | `OthIncome.ProfitOnCnvInvntryToCapAsst` | entered |
| 14x | 40 | Agricultural income | figure | `OthIncome.ProfitOnAgriIncome` | entered |
| 14xi | 41 | Any other income (specify nature and amount) | **table** | `OthIncome.OtherIncDtls[]` (`.NatureOfIncome`, `.Amount`) | rows addable |
| 14xia | 44 | Liabilities written back | figure | `OthIncome.LiabilityWrittenBack` | entered |
| 14xib | 45 | Amount of interest due or received from partnership firm | figure | `OthIncome.AmtofInterest` | entered |
| 14xin | (misc) | Any other income (residual, from the addable table) | figure | `OthIncome.MiscOthIncome` | `SUM` of the added rows |
| 14xic | 48 | **Total (xia + xib + xin)** | computed | (subtotal of xi) | `SUM(LiabilityWrittenBack, Amount_OthIncome, AmountPL)` |
| **14xii** | 50 | **Total of other income (i + ii + … + xi)** | computed | `OthIncome.TotOthIncome` | `SUM(J31:J40) + MiscOthIncome` |
| **15** | 76 | **Total of credits to statement of profit and loss (13 + 14xii)** | computed | `TotCreditsToPL` | `GrossProfitTrnsfFrmTrdAcc + TotOthIncome` |

---

## 3 · Debits to the Statement of Profit and Loss (items 16–52)

Schema paths are under `PARTA_PL.DebitsToPL.DebitPlAcnt`.

| Item | Row | Label | Type | Schema key | Formula |
|---|---|---|---|---|---|
| **16** | 77 | Freight outward | figure | `Freight` | entered |
| **17** | 78 | Consumption of stores and spare parts | figure | `ConsumptionOfStores` | entered |
| **18** | 79 | Power and fuel | figure | `PowerFuel` | entered |
| **19** | 80 | Rents | figure | `RentExpdr` | entered |
| **20** | 81 | Repairs to building | figure | `RepairsBldg` | entered |
| **21** | 82 | Repairs to machinery | figure | `RepairMach` | entered |
| **22** | 83 | **Compensation to employees** | group | `EmployeeComp` | |
| 22i | 84 | Salaries and wages | figure | `EmployeeComp.SalsWages` | entered |
| 22ii | 85 | Bonus | figure | `EmployeeComp.Bonus` | entered |
| 22iii | 86 | Reimbursement of medical expenses | figure | `EmployeeComp.MedExpReimb` | entered |
| 22iv | 87 | Leave encashment | figure | `EmployeeComp.LeaveEncash` | entered |
| 22v | 88 | Leave travel benefits | figure | `EmployeeComp.LeaveTravelBenft` | entered |
| 22vi | 89 | Contribution to approved superannuation fund | figure | `EmployeeComp.ContToSuperAnnFund` | entered |
| 22vii | 90 | Contribution to recognised provident fund | figure | `EmployeeComp.ContToPF` | entered |
| 22viii | 91 | Contribution to recognised gratuity fund | figure | `EmployeeComp.ContToGratFund` | entered |
| 22ix | 92 | Contribution to any other fund | figure | `EmployeeComp.ContToOthFund` | entered |
| 22x | 93 | Any other benefit to employees in respect of which an expenditure has been incurred | figure | `EmployeeComp.OthEmpBenftExpdr` | entered |
| 22xi | 95 | **Total compensation to employees (total of 22i to 22x)** | computed | `EmployeeComp.TotEmployeeComp` | `SUM(J84:J94)` |
| 22xiia | 96 | Whether any compensation, included in 22xi, paid to non-residents | dropdown Y/N | `EmployeeComp.AnyCompPaidToNonRes` | entered |
| 22xiib | 97 | If Yes, amount paid to non-residents | figure | `EmployeeComp.AmtPaidToNonRes` | entered |
| **23** | 98 | **Insurance** | group | `Insurances` | |
| 23i | 99 | Medical Insurance | figure | `Insurances.MedInsur` | entered |
| 23ii | 100 | Life Insurance | figure | `Insurances.LifeInsur` | entered |
| 23iii | 101 | Keyman's Insurance | figure | `Insurances.KeyManInsur` | entered |
| 23iv | 102 | Other Insurance including factory, office, car, goods, etc. | figure | `Insurances.OthInsur` | entered |
| 23v | 103 | **Total expenditure on insurance (23i + 23ii + 23iii + 23iv)** | computed | `Insurances.TotInsurances` | `SUM(J99:J102)` |
| **24** | 104 | Workmen and staff welfare expenses | figure | `StaffWelfareExp` | entered |
| **25** | 105 | Entertainment | figure | `Entertainment` | entered |
| **26** | 106 | Hospitality | figure | `Hospitality` | entered |
| **27** | 107 | Conference | figure | `Conference` | entered |
| **28** | 108 | Sales promotion including publicity (other than advertisement) | figure | `SalePromoExp` | entered |
| **29** | 109 | Advertisement | figure | `Advertisement` | entered |
| **30** | 110 | **Commission** | group | `CommissionExpdrDtls` | |
| 30i | 111 | Paid outside India, or paid in India to a non-resident other than a company or a foreign company | figure | `CommissionExpdrDtls.NonResOtherCompany` | entered |
| 30ii | 112 | To others | figure | `CommissionExpdrDtls.Others` | entered |
| 30iii | 113 | **Total (i + ii)** | computed | `CommissionExpdrDtls.Total` | `SUM(J111:J112)` |
| **31** | 114 | **Royalty** | group | `RoyalityDtls` | |
| 31i | 115 | Paid outside India, or paid in India to a non-resident other than a company or a foreign company | figure | `RoyalityDtls.NonResOtherCompany` | entered |
| 31ii | 116 | To others | figure | `RoyalityDtls.Others` | entered |
| 31iii | 117 | **Total (i + ii)** | computed | `RoyalityDtls.Total` | `SUM(J115:J116)` |
| **32** | 118 | **Professional / Consultancy fees / Fee for technical services** | group | `ProfessionalConstDtls` | |
| 32i | 119 | Paid outside India, or paid in India to a non-resident other than a company or a foreign company | figure | `ProfessionalConstDtls.NonResOtherCompany` | entered |
| 32ii | 120 | To others | figure | `ProfessionalConstDtls.Others` | entered |
| 32iii | 121 | **Total (i + ii)** | computed | `ProfessionalConstDtls.Total` | `SUM(J119:J120)` |
| **33** | 122 | Hotel, boarding and Lodging | figure | `HotelBoardLodge` | entered |
| **34** | 123 | Traveling expenses other than on foreign traveling | figure | `TravelExp` | entered |
| **35** | 124 | Foreign travelling expenses | figure | `ForeignTravelExp` | entered |
| **36** | 125 | Conveyance expenses | figure | `ConveyanceExp` | entered |
| **37** | 126 | Telephone expenses | figure | `TelephoneExp` | entered |
| **38** | 127 | Guest House expenses | figure | `GuestHouseExp` | entered |
| **39** | 128 | Club expenses | figure | `ClubExp` | entered |
| **40** | 129 | Festival celebration expenses | figure | `FestivalCelebExp` | entered |
| **41** | 130 | Scholarship | figure | `Scholarship` | entered |
| **42** | 131 | Gift | figure | `Gift` | entered |
| **43** | 132 | Donation | figure | `Donation` | entered |
| **44** | 133 | **Rates and taxes, paid or payable to Government or any local body (excluding taxes on income)** | group | `RatesTaxesPays.ExciseCustomsVAT` | |
| 44i | 134 | Union excise duty | figure | `RatesTaxesPays.ExciseCustomsVAT.UnionExciseDuty` | entered |
| 44ii | 135 | Service tax | figure | `RatesTaxesPays.ExciseCustomsVAT.ServiceTax` | entered |
| 44iii | 136 | VAT/ Sales tax | figure | `RatesTaxesPays.ExciseCustomsVAT.VATorSaleTax` | entered |
| 44iv | 137 | Cess | figure | `RatesTaxesPays.ExciseCustomsVAT.Cess` | entered |
| 44v | 138 | Central Goods & Service Tax (CGST) | figure | `RatesTaxesPays.ExciseCustomsVAT.CentralGoodServiceTax` | entered |
| 44vi | 139 | State Goods & Services Tax (SGST) | figure | `RatesTaxesPays.ExciseCustomsVAT.StateGoodServiceTax` | entered |
| 44vii | 140 | Integrated Goods & Services Tax (IGST) | figure | `RatesTaxesPays.ExciseCustomsVAT.IntegratedGoodServiceTax` | entered |
| 44viii | 141 | Union Territory Goods & Services Tax (UTGST) | figure | `RatesTaxesPays.ExciseCustomsVAT.UnionTerrGoodServiceTax` | entered |
| 44ix | 142 | Any other rate, tax, duty or cess incl STT and CTT | figure | `RatesTaxesPays.ExciseCustomsVAT.OthDutyTaxCess` | entered |
| 44x | 143 | **Total rates and taxes paid or payable (44i + … + 44ix)** | computed | `RatesTaxesPays.ExciseCustomsVAT.TotExciseCustomsVAT` | `SUM(J134:J142)` |
| **45** | 144 | Audit fee | figure | `AuditFee` | entered |
| **46** | 145 | Other expenses (specify nature and amount) | **table** | `OtherExpensesDtls[]` (`.ExpenseNature`, `.Amount`) | rows addable |
| 46v | 151 | **Total** (of the other-expenses table) | computed | `OtherExpenses` | `SUM(PLOE.ExpenseAmtPL)` |
| **47** | 153 | **Bad debts** (specify PAN/Aadhaar No. of the person, if available, for whom Bad Debt for amount of Rs. 1 lakh or more is claimed) | group | `BadDebtDtls` | |
| 47i | 154–163 | (table: Sl.No · PAN · Aadhaar · Amount) → **Total** | **table** + computed | `BadDebtDtls.BadDebtAmtDtls[]` (`.PAN`, `.Aadhaar`, `.Amount`), total `BadDebtDtls.BadDebtAmtDtlsTotal` | `MAX(0, SUM(PLBD.Amount))` |
| 47ii | 164–169 | Others (more than Rs. 1 lakh) where PAN is not available (provide name and complete address) → **Total** | **table** + computed | `BadDebtDtls.OthersPANNotAvlblDtl[]` (see address columns below), total `BadDebtDtls.OthersPANNotAvlblDtlTotal` | `MAX(0, SUM(PLOth.M1Amount))` |
| 47iii | 170 | Others (amounts less than Rs. 1 lakh) | figure | `BadDebtDtls.OthersAmtLt1Lakh` | entered |
| 47iv | 171 | **Total Bad Debt (47i + 47ii + 47iii)** | computed | `BadDebtDtls.BadDebt` | `MAX(0, SUM(BadDebtAmtDtlsTotal-equivalent, OthersPANNotAvlblDtlTotal, OthersAmtLt1Lakh))` |
| **48** | 172 | Provision for bad and doubtful debts | figure | `ProvForBadDoubtDebt` | entered |
| **49** | 173 | Other provisions | figure | `OthProvisionsExpdr` | entered |
| **50** | 174 | **Profit before interest, depreciation and taxes [15 − (16 to 21 + 22xi + 23v + 24 to 29 + 30iii + 31iii + 32iii + 33 to 45 + 46v + 47iv + 48 + 49)]** | computed | `PBIDTA` | `TotCreditsToPL − (all debit lines 16–49)` |
| **51** | 175 | **Interest** | group | `InterestExpdrtDtls` | |
| 51i | 176 | Paid outside India, or paid in India to a non-resident other than a company or a foreign company | figure | `InterestExpdrtDtls.NonResOtherCompany` | entered |
| 51ii | 177 | To others | figure | `InterestExpdrtDtls.Others` | entered |
| 51iii | 178 | **Total (i + ii)** | computed | `InterestExpdrtDtls.InterestExpdr` | `SUM(J176:J177)` |
| **52** | 179 | Depreciation and amortization | figure | `DepreciationAmort` | entered |
| **53** | 180 | **Net Profit before taxes (50 − 51iii − 52)** | computed | `PBT` | `PBIDTA − InterestExpdr − DepreciationAmort` |

The address columns of the 47ii table (row 165) are: Sl.No · Name
(`OthersPANNotAvlblDtl[].Name`) · Flat/ Door/ Block No. (`.FlatDoorBlockNumber`)
· Name of Premises / Building / Village (`.PremisesBuildingName`) · Road/ Street/
Post office (`.RoadStreetPostOffice`) · Area/ Locality (`.AreaLocality`) · Town/
City/ District (`.TownCityDistrict`) · State (`.StateCode`, dropdown) ·
Country/Region (`.CountryCode`, dropdown) · Pin Code (`.PinCode`) · ZIP Code
(`.ZipCode`) · Amount (`.Amount`).

---

## 4 · Provisions for tax and appropriations (items 54–60)

Schema paths are under `PARTA_PL.DebitsToPL.TaxProvAppr`.

| Item | Row | Label | Type | Schema key | Formula |
|---|---|---|---|---|---|
| **54** | 181 | Provision for current tax | figure | `ProvForCurrTax` | entered |
| **55** | 183 | Provision for Deferred Tax | figure | `ProvDefTax` | entered |
| **56** | 184 | **Profit after tax (53 − 54 − 55)** | computed | `ProfitAfterTax` | `PBT − ProvForCurrTax − ProvDefTax` |
| **57** | 185 | Balance brought forward from previous year | figure | `BalBFPrevYr` | entered |
| **58** | 186 | **Amount available for appropriation (56 + 57)** | computed | `AmtAvlAppr` | `ProfitAfterTax + BalBFPrevYr` |
| **59** | 187 | **Appropriations** | group | `Appropriations` | |
| 59i | 188 | Transfer to reserves and surplus | figure | `Appropriations.TrfToReserves` | entered |
| 59ii | 189 | Proposed dividend/ Interim dividend | figure | `Appropriations.ProposedDividend` | entered |
| 59iii | 190 | Tax on dividend/ Tax on dividend for earlier years | figure | `Appropriations.TaxOnDividend` | entered |
| 59iv | 191 | Appropriation towards Corporate Social Responsibility (CSR) activities (in case of companies covered under section 135 of the Companies Act, 2013) | figure | `Appropriations.AppropriationsCSR` | entered |
| 59v | 192 | Any other appropriation | figure | `Appropriations.AnyOtherAppr` | entered |
| 59vi | 193 | **Total (59i + 59ii + 59iii + 59iv + 59v)** | computed | `Appropriations.TotAppropriations` | `SUM(J188:J192)` |
| **60** | 194 | **Balance carried to balance sheet (58 − 59vi)** | computed | `PartnerAccBalTrf` | `AmtAvlAppr − TotAppropriations` |

Item 60 (`PartnerAccBalTrf`) is the figure fed to the Balance Sheet item 1Bviii
(Surplus i.e. Balance in statement of profit and loss).

---

## 5 · Hidden rows — not built

The following visible-sheet rows are hidden (`H`) and carry **no `PARTA_PL`
schema key**; they are excluded (seventeen-mistakes rule 1):

| Rows | What they are | Reason hidden / excluded |
|---|---|---|
| 4–27 | Revenue from operations (items 1–1C: sales of goods/services, other operating revenue, duties collected, total revenue) | filled on the **Trading Account** for a regular-books company; keys live under `TradingAccount`, not `PARTA_PL` |
| 42 | "Liabilities written back" caption band | spacer above the addable other-income table |
| 51–56 | Closing Stock (items 3i–3iv) and "Totals of credits" | belong to the Trading Account for regular-books cases |
| 57–75 | Opening Stock (5i–5iv), Purchases (6), Duties paid (7i–7xii) | belong to the Trading Account for regular-books cases |
| 94 | Fringe benefit tax paid or payable (15k) | FBT abolished (A.Y. 2010-11); retained but hidden, no key |
| 182 | Provision for Fringe benefit Tax | FBT abolished; no key |
| 211, 212 | "Gross profit" / "Expenses" sub-captions of the no-account case | display captions; the live figures are the ai–avii and bi–bvii lines below |

None of these has a live `PARTA_PL` leaf, so nothing filable is lost.

---

## 6 · Item 61 — Presumptive income from goods carriages under section 44AE

Rows 195–208. Two tables and a computed total; schema arrays `NatOfBus44AE[]`
and `GoodsDtlsUs44AE[]`.

| Item | Row | Label | Type | Schema key | Notes |
|---|---|---|---|---|---|
| 61(i) | 195 | **(i) COMPUTATION OF PRESUMPTIVE INCOME FROM GOODS CARRIAGES UNDER SECTION 44AE** | heading | | |
| — | 196 | (nature-of-business table) Sl.No · Name of Business · Business Code · Description | **table** | `NatOfBus44AE[]` (`.NameOfBusiness`, `.CodeAE`, `.Description`) | Business Code is a dropdown (see §9) |
| — | 201 | (goods-carriage table) Sl.No · Registration No. of goods carriage 1 · Whether owned/leased/hired 2 · Tonnage Capacity of goods carriage (in MT) 3 · Number of months for which goods carriage was owned / leased / hired by assessee 4 · Presumptive income u/s 44AE for the goods carriage (Computed @ Rs.1000 per tonne per month in case tonnage exceeds 12MT, otherwise @ Rs.7500 per month) 5 | **table** | `GoodsDtlsUs44AE[]` (`.RegNumberGoodsCarriage`, `.OwnedLeasedHiredFlag`, `.TonnageCapacity`, `.HoldingPeriod`, `.PresumptiveIncome`) | Owned/Leased/Hired is a dropdown (§9) |
| — | 206 | Total (of the goods-carriage table) | computed | `TotalNumOfMonths`, `TotalPrsumptvIncUs44EGoods` | `TotalNumOfMonths = IF(SUM(months)>0, MIN(SUM(months)), 0)`; income total `SUM(PresumptiveIncome)` |
| 61(ii) | 207 | **Total presumptive income from goods carriage u/s 44AE [total of column (5) of table 61]** | computed | `TotalPrsumptvIncUs44E` | `= PL_TIncome` |
| — | 208 | NOTE — If the profits are lower than prescribed under S.44AE or the number of goods carriage owned / leased / hired exceeds ten, the assessee must maintain books and get them audited | note | | |

---

## 7 · Item 62 — No-account case / foreign company (sections 44B, 44BB, 44BBA, 44BBB, 44BBC, 44BBD, 44D, Rule 10TIA)

Rows 209–229. For a foreign company whose total income comprises profits and
gains from business referred to in these sections, and for the general
no-account case. Schema: `NoBooksOfAccPLDetails[]` and `NoBooksOfAccPL`.

| Item | Row | Label | Type | Schema key |
|---|---|---|---|---|
| — | 209 | **NO ACCOUNT CASE** — In case of Foreign Company whose total income comprises of profits and gains from business referred to in sections 44B, 44BB, 44BBA, 44BBB, 44BBC, 44BBD, 44D and Rule 10TIA | heading | |
| **62a** | 210 | **Gross receipts / Turnover (ai + aii + aiii + aiv + av + avi + avii)** | computed | `NoBooksOfAccPL.GrossReceipt` (and per-section `NoBooksOfAccPLDetails[].GrossReceipt`) |
| 62a-ai | 213 | Section 44B | figure | `NoBooksOfAccPLDetails[].Section` = 44B, `.GrossReceipt` |
| 62a-aii | 214 | Section 44BB | figure | `.Section` = 44BB |
| 62a-aiii | 215 | Section 44BBA | figure | `.Section` = 44BBA |
| 62a-aiv | 216 | Section 44BBB | figure | `.Section` = 44BBB |
| 62a-av | 217 | Section 44BBC | figure | `.Section` = 44BBC |
| 62a-ava | 218 | Section 44BBD | figure | `.Section` = 44BBD |
| 62a-avi | 219 | Section 44D | figure | `.Section` = 44D |
| 62a-avii | 220 | Rule 10TIA | figure | `.Section` = 10TIA |
| **62b** | 221 | **Net profit (bi + bii + biii + biv + bv + bvi + bvii)** | computed | `NoBooksOfAccPL.NetProfit` (and per-section `NoBooksOfAccPLDetails[].NetProfit`) |
| 62b-bi | 222 | Section 44B | figure | `.NetProfit` |
| 62b-bii | 223 | Section 44BB | figure | |
| 62b-biii | 224 | Section 44BBA | figure | |
| 62b-biv | 225 | Section 44BBB | figure | |
| 62b-bv | 226 | Section 44BBC | figure | |
| 62b-bva | 227 | Section 44BBD | figure | |
| 62b-bvi | 228 | Section 44D | figure | |
| 62b-bvii | 229 | Rule 10TIA | figure | |

Rows 211 (Gross profit, 53b) and 212 (Expenses, 53c) are hidden captions (§5).

---

## 8 · The rules the sheet computes (from its cells)

- **14xic** `G48 = SUM(Liabilities_wrtn_bckPL_new, PL.Amount_OthIncome, PL.AmountPL)`.
- **14xii** `L50 = SUM(J31:J40) + PL.MiscOthIncome`.
- **15** `L76 = PL.GPTFTA + PL.TotOthIncome` — total credits.
- **22xi** `L95 = SUM(J84:J94)`; **23v** `L103 = SUM(J99:J102)`.
- **30iii** `L113`, **31iii** `L117`, **32iii** `L121`, **51iii** `L178` = `SUM(i:ii)`.
- **44x** `L143 = SUM(J134:J142)`; **46v** `L151 = SUM(PLOE.ExpenseAmtPL)`.
- **47i** `L163 = MAX(0, SUM(PLBD.Amount))`; **47ii** `L169 = MAX(0, SUM(PLOth.M1Amount))`; **47iv** `L171 = MAX(0, SUM(PL.OtherBaddebts, PLOth.M1AmountTot, PL.OthersAmtLt1Lakh))`.
- **50 (PBIDTA)** `L174 = PL.TotCreditsPL − (SUM(freight … donations) + PL.TotEmployeeComp + PL.TotInsurances + PL.CommissionExpdr + PLRY.Total + … + PL.OtherProvisions)`.
- **53 (PBT)** `L180 = L174 − L178 − L179` (PBIDTA − interest − depreciation).
- **56 (Profit after tax)** `L184 = L180 − L181 − L183`.
- **58 (Amount available for appropriation)** `L186 = PL.ProfitAfterTax + PL.BalBFPrevYr`.
- **59vi** `L193 = SUM(J188:J192)`; **60** `L194 = PL.AmtAvlAppr − PL.TotAppropriations`.
- **61 total** `J206 = IF(SUM(Sheet44AE.NoOfMonths)>0, MIN(SUM(Sheet44AE.NoOfMonths)), 0)`, `K206 = SUM(Sheet44AE.PresumptiveIncome)`; `K207 = PL_TIncome`.
- **62a** `L210 = SUM(L213:L220)`; **62b** `L221 = SUM(L222:L229)`.

---

## 9 · Cross-sheet feeds

- **In ←** the **Trading Account**: item 13 `GrossProfitTrnsfFrmTrdAcc` = Trading
  Account Gross Profit (item 12) + Intraday income (12b) + F&O income (12d).
- **Out →** the **Balance Sheet**: item 60 `PartnerAccBalTrf` (Balance carried
  to balance sheet) = Balance Sheet item 1Bviii (`ResrNSurp.PLAccount`).
- Net profit (item 53) is the starting figure for **Schedule BP** (business
  income computation).
- Compute order: Manufacturing → Trading → **P&L** → Balance Sheet surplus.

---

## 10 · What the schema marks mandatory

Most of `PARTA_PL` is `required` — the department wants a figure on every
credit, debit, total and appropriation line (zero acceptable). The repeatable
tables are: other income (`OtherIncDtls[]`), other expenses
(`OtherExpensesDtls[]`), bad-debt-with-PAN (`BadDebtAmtDtls[]`), bad-debt-no-PAN
address (`OthersPANNotAvlblDtl[]`), 44AE business (`NatOfBus44AE[]`), 44AE goods
carriages (`GoodsDtlsUs44AE[]`), and the no-account per-section rows
(`NoBooksOfAccPLDetails[]`). The full leaf list with the required flag is in the
appendix (§12); every live row in §§2–7 maps to a leaf, and the hidden rows of
§5 are the only unbacked labels.

---

## 11 · What this means for the build

1. **Only the "credits/debits to statement of P&L" half is on this sheet** —
   the revenue-from-operations block is on the Trading Account (rows 4–27
   hidden). Do not build the hidden revenue rows here.
2. **Gross profit (item 13) is fed** from the Trading Account (12 + 12b + 12d);
   the surplus (item 60) is fed out to the Balance Sheet.
3. **Six repeatable tables** — other income, other expenses, two bad-debt
   tables (with-PAN and no-PAN-with-address), and the two 44AE tables.
4. **Every subtotal and the four running results (PBIDTA, PBT, PAT, balance
   carried) are computed** per §8; the filer types only leaf inputs.
5. **Two enum dropdowns beyond Y/N** — the 44AE Business Code list and the
   Owned/Leased/Hired flag; plus State and Country on the no-PAN bad-debt
   address rows. All are listed in §13.
6. **The 44AE and no-account appendices (items 61, 62)** are the alternative to
   the regular-books P&L; build them as separate sub-sections.

---

## 12 · Appendix — every schema leaf of `PARTA_PL`

The complete leaf list of the block (path · type · `*`=required), for build
coverage. Each maps to a row in §§2–7.

-   `CreditsToPL.GrossProfitTrnsfFrmTrdAcc` — integer
- * `CreditsToPL.OthIncome.RentInc` — integer
- * `CreditsToPL.OthIncome.Comissions` — integer
- * `CreditsToPL.OthIncome.Dividends` — integer
- * `CreditsToPL.OthIncome.InterestInc` — integer
- * `CreditsToPL.OthIncome.ProfitOnSaleFixedAsset` — integer
- * `CreditsToPL.OthIncome.ProfitOnInvChrSTT` — integer
- * `CreditsToPL.OthIncome.ProfitOnOthInv` — integer
- * `CreditsToPL.OthIncome.ProfitOnCurrFluct` — integer
- * `CreditsToPL.OthIncome.ProfitOnCnvInvntryToCapAsst` — integer
- * `CreditsToPL.OthIncome.ProfitOnAgriIncome` — integer
-   `CreditsToPL.OthIncome.OtherIncDtls[]` — array
- * `CreditsToPL.OthIncome.OtherIncDtls[].NatureOfIncome` — string
- * `CreditsToPL.OthIncome.OtherIncDtls[].Amount` — integer
- * `CreditsToPL.OthIncome.MiscOthIncome` — integer
- * `CreditsToPL.OthIncome.TotOthIncome` — integer
-   `CreditsToPL.OthIncome.LiabilityWrittenBack` — integer
-   `CreditsToPL.OthIncome.AmtofInterest` — integer
- * `CreditsToPL.TotCreditsToPL` — integer
- * `DebitsToPL.DebitPlAcnt.Freight` — integer
- * `DebitsToPL.DebitPlAcnt.ConsumptionOfStores` — integer
- * `DebitsToPL.DebitPlAcnt.PowerFuel` — integer
- * `DebitsToPL.DebitPlAcnt.RentExpdr` — integer
- * `DebitsToPL.DebitPlAcnt.RepairsBldg` — integer
- * `DebitsToPL.DebitPlAcnt.RepairMach` — integer
- * `DebitsToPL.DebitPlAcnt.EmployeeComp.SalsWages` — integer
- * `DebitsToPL.DebitPlAcnt.EmployeeComp.Bonus` — integer
- * `DebitsToPL.DebitPlAcnt.EmployeeComp.MedExpReimb` — integer
- * `DebitsToPL.DebitPlAcnt.EmployeeComp.LeaveEncash` — integer
- * `DebitsToPL.DebitPlAcnt.EmployeeComp.LeaveTravelBenft` — integer
- * `DebitsToPL.DebitPlAcnt.EmployeeComp.ContToSuperAnnFund` — integer
- * `DebitsToPL.DebitPlAcnt.EmployeeComp.ContToPF` — integer
- * `DebitsToPL.DebitPlAcnt.EmployeeComp.ContToGratFund` — integer
- * `DebitsToPL.DebitPlAcnt.EmployeeComp.ContToOthFund` — integer
- * `DebitsToPL.DebitPlAcnt.EmployeeComp.OthEmpBenftExpdr` — integer
- * `DebitsToPL.DebitPlAcnt.EmployeeComp.TotEmployeeComp` — integer
-   `DebitsToPL.DebitPlAcnt.EmployeeComp.AnyCompPaidToNonRes` — string
-   `DebitsToPL.DebitPlAcnt.EmployeeComp.AmtPaidToNonRes` — integer
- * `DebitsToPL.DebitPlAcnt.Insurances.MedInsur` — integer
- * `DebitsToPL.DebitPlAcnt.Insurances.LifeInsur` — integer
- * `DebitsToPL.DebitPlAcnt.Insurances.KeyManInsur` — integer
- * `DebitsToPL.DebitPlAcnt.Insurances.OthInsur` — integer
- * `DebitsToPL.DebitPlAcnt.Insurances.TotInsurances` — integer
- * `DebitsToPL.DebitPlAcnt.StaffWelfareExp` — integer
- * `DebitsToPL.DebitPlAcnt.Entertainment` — integer
- * `DebitsToPL.DebitPlAcnt.Hospitality` — integer
- * `DebitsToPL.DebitPlAcnt.Conference` — integer
- * `DebitsToPL.DebitPlAcnt.SalePromoExp` — integer
- * `DebitsToPL.DebitPlAcnt.Advertisement` — integer
- * `DebitsToPL.DebitPlAcnt.CommissionExpdrDtls.NonResOtherCompany` — integer
- * `DebitsToPL.DebitPlAcnt.CommissionExpdrDtls.Others` — integer
- * `DebitsToPL.DebitPlAcnt.CommissionExpdrDtls.Total` — integer
- * `DebitsToPL.DebitPlAcnt.RoyalityDtls.NonResOtherCompany` — integer
- * `DebitsToPL.DebitPlAcnt.RoyalityDtls.Others` — integer
- * `DebitsToPL.DebitPlAcnt.RoyalityDtls.Total` — integer
- * `DebitsToPL.DebitPlAcnt.ProfessionalConstDtls.NonResOtherCompany` — integer
- * `DebitsToPL.DebitPlAcnt.ProfessionalConstDtls.Others` — integer
- * `DebitsToPL.DebitPlAcnt.ProfessionalConstDtls.Total` — integer
- * `DebitsToPL.DebitPlAcnt.HotelBoardLodge` — integer
- * `DebitsToPL.DebitPlAcnt.TravelExp` — integer
- * `DebitsToPL.DebitPlAcnt.ForeignTravelExp` — integer
- * `DebitsToPL.DebitPlAcnt.ConveyanceExp` — integer
- * `DebitsToPL.DebitPlAcnt.TelephoneExp` — integer
- * `DebitsToPL.DebitPlAcnt.GuestHouseExp` — integer
- * `DebitsToPL.DebitPlAcnt.ClubExp` — integer
- * `DebitsToPL.DebitPlAcnt.FestivalCelebExp` — integer
- * `DebitsToPL.DebitPlAcnt.Scholarship` — integer
- * `DebitsToPL.DebitPlAcnt.Gift` — integer
- * `DebitsToPL.DebitPlAcnt.Donation` — integer
-   `DebitsToPL.DebitPlAcnt.RatesTaxesPays.ExciseCustomsVAT.UnionExciseDuty` — integer
-   `DebitsToPL.DebitPlAcnt.RatesTaxesPays.ExciseCustomsVAT.ServiceTax` — integer
-   `DebitsToPL.DebitPlAcnt.RatesTaxesPays.ExciseCustomsVAT.VATorSaleTax` — integer
-   `DebitsToPL.DebitPlAcnt.RatesTaxesPays.ExciseCustomsVAT.Cess` — integer
-   `DebitsToPL.DebitPlAcnt.RatesTaxesPays.ExciseCustomsVAT.CentralGoodServiceTax` — integer
-   `DebitsToPL.DebitPlAcnt.RatesTaxesPays.ExciseCustomsVAT.StateGoodServiceTax` — integer
-   `DebitsToPL.DebitPlAcnt.RatesTaxesPays.ExciseCustomsVAT.IntegratedGoodServiceTax` — integer
-   `DebitsToPL.DebitPlAcnt.RatesTaxesPays.ExciseCustomsVAT.UnionTerrGoodServiceTax` — integer
-   `DebitsToPL.DebitPlAcnt.RatesTaxesPays.ExciseCustomsVAT.OthDutyTaxCess` — integer
- * `DebitsToPL.DebitPlAcnt.RatesTaxesPays.ExciseCustomsVAT.TotExciseCustomsVAT` — integer
- * `DebitsToPL.DebitPlAcnt.AuditFee` — integer
-   `DebitsToPL.DebitPlAcnt.OtherExpensesDtls[]` — array
- * `DebitsToPL.DebitPlAcnt.OtherExpensesDtls[].ExpenseNature` — string
- * `DebitsToPL.DebitPlAcnt.OtherExpensesDtls[].Amount` — integer
- * `DebitsToPL.DebitPlAcnt.OtherExpenses` — integer
-   `DebitsToPL.DebitPlAcnt.BadDebtDtls.BadDebtAmtDtls[]` — array
-   `DebitsToPL.DebitPlAcnt.BadDebtDtls.BadDebtAmtDtls[].PAN` — string
-   `DebitsToPL.DebitPlAcnt.BadDebtDtls.BadDebtAmtDtls[].Aadhaar` — string
- * `DebitsToPL.DebitPlAcnt.BadDebtDtls.BadDebtAmtDtls[].Amount` — integer
- * `DebitsToPL.DebitPlAcnt.BadDebtDtls.BadDebtAmtDtlsTotal` — integer
-   `DebitsToPL.DebitPlAcnt.BadDebtDtls.OthersPANNotAvlblDtl[]` — array
- * `DebitsToPL.DebitPlAcnt.BadDebtDtls.OthersPANNotAvlblDtl[].Name` — string
- * `DebitsToPL.DebitPlAcnt.BadDebtDtls.OthersPANNotAvlblDtl[].FlatDoorBlockNumber` — string
-   `DebitsToPL.DebitPlAcnt.BadDebtDtls.OthersPANNotAvlblDtl[].PremisesBuildingName` — string
-   `DebitsToPL.DebitPlAcnt.BadDebtDtls.OthersPANNotAvlblDtl[].RoadStreetPostOffice` — string
- * `DebitsToPL.DebitPlAcnt.BadDebtDtls.OthersPANNotAvlblDtl[].AreaLocality` — string
- * `DebitsToPL.DebitPlAcnt.BadDebtDtls.OthersPANNotAvlblDtl[].TownCityDistrict` — string
- * `DebitsToPL.DebitPlAcnt.BadDebtDtls.OthersPANNotAvlblDtl[].StateCode` — string
- * `DebitsToPL.DebitPlAcnt.BadDebtDtls.OthersPANNotAvlblDtl[].CountryCode` — string
-   `DebitsToPL.DebitPlAcnt.BadDebtDtls.OthersPANNotAvlblDtl[].PinCode` — integer
-   `DebitsToPL.DebitPlAcnt.BadDebtDtls.OthersPANNotAvlblDtl[].ZipCode` — string
- * `DebitsToPL.DebitPlAcnt.BadDebtDtls.OthersPANNotAvlblDtl[].Amount` — integer
- * `DebitsToPL.DebitPlAcnt.BadDebtDtls.OthersPANNotAvlblDtlTotal` — integer
- * `DebitsToPL.DebitPlAcnt.BadDebtDtls.OthersAmtLt1Lakh` — integer
- * `DebitsToPL.DebitPlAcnt.BadDebtDtls.BadDebt` — integer
- * `DebitsToPL.DebitPlAcnt.ProvForBadDoubtDebt` — integer
- * `DebitsToPL.DebitPlAcnt.OthProvisionsExpdr` — integer
- * `DebitsToPL.DebitPlAcnt.PBIDTA` — integer
- * `DebitsToPL.DebitPlAcnt.InterestExpdrtDtls.NonResOtherCompany` — integer
- * `DebitsToPL.DebitPlAcnt.InterestExpdrtDtls.Others` — integer
- * `DebitsToPL.DebitPlAcnt.InterestExpdrtDtls.InterestExpdr` — integer
- * `DebitsToPL.DebitPlAcnt.DepreciationAmort` — integer
- * `DebitsToPL.DebitPlAcnt.PBT` — integer
- * `DebitsToPL.TaxProvAppr.ProvForCurrTax` — integer
- * `DebitsToPL.TaxProvAppr.ProvDefTax` — integer
- * `DebitsToPL.TaxProvAppr.ProfitAfterTax` — integer
- * `DebitsToPL.TaxProvAppr.BalBFPrevYr` — integer
- * `DebitsToPL.TaxProvAppr.AmtAvlAppr` — integer
- * `DebitsToPL.TaxProvAppr.Appropriations.TrfToReserves` — integer
-   `DebitsToPL.TaxProvAppr.Appropriations.ProposedDividend` — integer
-   `DebitsToPL.TaxProvAppr.Appropriations.TaxOnDividend` — integer
-   `DebitsToPL.TaxProvAppr.Appropriations.AppropriationsCSR` — integer
-   `DebitsToPL.TaxProvAppr.Appropriations.AnyOtherAppr` — integer
- * `DebitsToPL.TaxProvAppr.Appropriations.TotAppropriations` — integer
- * `DebitsToPL.TaxProvAppr.PartnerAccBalTrf` — integer
-   `NatOfBus44AE[]` — array
- * `NatOfBus44AE[].NameOfBusiness` — string
- * `NatOfBus44AE[].CodeAE` — string
-   `NatOfBus44AE[].Description` — string
-   `GoodsDtlsUs44AE[]` — array
- * `GoodsDtlsUs44AE[].RegNumberGoodsCarriage` — string
- * `GoodsDtlsUs44AE[].OwnedLeasedHiredFlag` — string
- * `GoodsDtlsUs44AE[].TonnageCapacity` — integer
- * `GoodsDtlsUs44AE[].HoldingPeriod` — integer
- * `GoodsDtlsUs44AE[].PresumptiveIncome` — integer
- * `TotalNumOfMonths` — integer
-   `TotalPrsumptvIncUs44EGoods` — integer
-   `TotalPrsumptvIncUs44E` — integer
-   `NoBooksOfAccPLDetails[]` — array
-   `NoBooksOfAccPLDetails[].Section` — string
-   `NoBooksOfAccPLDetails[].GrossReceipt` — integer
-   `NoBooksOfAccPLDetails[].NetProfit` — integer
-   `NoBooksOfAccPL.GrossReceipt` — integer
-   `NoBooksOfAccPL.NetProfit` — integer

---

## 13 · Appendix — every dropdown value on the sheet

These are the enumerated data-validation lists on the visible P&L rows, verbatim.

### Dropdown (source: "(Select),Y,N"), cells J96

- (Select)
- Y
- N

### Dropdown (source: BCode.44AE), cells I197:J199

- (Select)
- 08001-Renting of land transport equipment
- 11002-Packers and movers
- 11008-Freight transport by road
- 11010-Forwarding of freight
- 11011-Receiving and acceptance of freight
- 11012-Cargo handling
- 11015-Other Transport & Logistics services n.e.c

### Dropdown (source: State), cells N166:N167

- (Select)
- 01-Andaman and Nicobar islands
- 02-Andhra Pradesh
- 03-Arunachal Pradesh
- 04-Assam
- 05-Bihar
- 06-Chandigarh
- 07-The Dadra And Nagar Haveli And Daman And Diu
- 09-Delhi
- 10-Goa
- 11-Gujarat
- 12-Haryana
- 13-Himachal Pradesh
- 14-Jammu and Kashmir
- 15-Karnataka
- 16-Kerala
- 17-Lakshadweep
- 18-Madhya Pradesh
- 19-Maharashtra
- 20-Manipur
- 21-Meghalaya
- 22-Mizoram
- 23-Nagaland
- 24-Odisha
- 25-Puducherry
- 26-Punjab
- 27-Rajasthan
- 28-Sikkim
- 29-Tamil Nadu
- 30-Tripura
- 31-Uttar Pradesh
- 32-West Bengal
- 33-Chattisgarh
- 34-Uttarakhand
- 35-Jharkhand
- 36-Telangana
- 37-Ladakh
- 99-Foreign

### Dropdown (source: Country), cells O166:O167

- (select)
- 93-AFGHANISTAN
- 1001-ALAND ISLANDS
- 355-ALBANIA
- 213-ALGERIA
- 684-AMERICAN SAMOA
- 376-ANDORRA
- 244-ANGOLA
- 1264-ANGUILLA
- 1010-ANTARCTICA
- 1268-ANTIGUA AND BARBUDA
- 54-ARGENTINA
- 374-ARMENIA
- 297-ARUBA
- 61-AUSTRALIA
- 43-AUSTRIA
- 994-AZERBAIJAN
- 1242-BAHAMAS
- 973-BAHRAIN
- 880-BANGLADESH
- 1246-BARBADOS
- 375-BELARUS
- 32-BELGIUM
- 501-BELIZE
- 229-BENIN
- 1441-BERMUDA
- 975-BHUTAN
- 591-BOLIVIA (PLURINATIONAL STATE OF)
- 1002-BONAIRE, SINT EUSTATIUS AND SABA
- 387-BOSNIA AND HERZEGOVINA
- 267-BOTSWANA
- 1003-BOUVET ISLAND
- 55-BRAZIL
- 1014-BRITISH INDIAN OCEAN TERRITORY
- 673-BRUNEI DARUSSALAM
- 359-BULGARIA
- 226-BURKINA FASO
- 257-BURUNDI
- 238-CABO VERDE
- 855-CAMBODIA
- 237-CAMEROON
- 1-CANADA
- 1345-CAYMAN ISLANDS
- 236-CENTRAL AFRICAN REPUBLIC
- 235-CHAD
- 56-CHILE
- 86-CHINA
- 9-CHRISTMAS ISLAND
- 672-COCOS (KEELING) ISLANDS
- 57-COLOMBIA
- 270-COMOROS
- 242-CONGO
- 243-CONGO (DEMOCRATIC REPUBLIC OF THE)
- 682-COOK ISLANDS
- 506-COSTA RICA
- 225-COTE DIVOIRE
- 385-CROATIA
- 53-CUBA
- 1015-CURACAO
- 357-CYPRUS
- 420-CZECHIA
- 45-DENMARK
- 253-DJIBOUTI
- 1767-DOMINICA
- 1809-DOMINICAN REPUBLIC
- 593-ECUADOR
- 20-EGYPT
- 503-EL SALVADOR
- 240-EQUATORIAL GUINEA
- 291-ERITREA
- 372-ESTONIA
- 251-ETHIOPIA
- 500-FALKLAND ISLANDS (MALVINAS)
- 298-FAROE ISLANDS
- 679-FIJI
- 358-FINLAND
- 33-FRANCE
- 594-FRENCH GUIANA
- 689-FRENCH POLYNESIA
- 1004-FRENCH SOUTHERN TERRITORIES
- 241-GABON
- 220-GAMBIA
- 995-GEORGIA
- 49-GERMANY
- 233-GHANA
- 350-GIBRALTAR
- 30-GREECE
- 299-GREENLAND
- 1473-GRENADA
- 590-GUADELOUPE
- 1671-GUAM
- 502-GUATEMALA
- 1481-GUERNSEY
- 224-GUINEA
- 245-GUINEA-BISSAU
- 592-GUYANA
- 509-HAITI
- 1005-HEARD ISLAND AND MCDONALD ISLANDS
- 6-HOLY SEE
- 504-HONDURAS
- 852-HONG KONG
- 36-HUNGARY
- 354-ICELAND
- 91-INDIA
- 62-INDONESIA
- 98-IRAN (ISLAMIC REPUBLIC OF)
- 964-IRAQ
- 353-IRELAND
- 1624-ISLE OF MAN
- 972-ISRAEL
- 5-ITALY
- 1876-JAMAICA
- 81-JAPAN
- 1534-JERSEY
- 962-JORDAN
- 7-KAZAKHSTAN
- 254-KENYA
- 686-KIRIBATI
- 850-KOREA (DEMOCRATIC PEOPLES REPUBLIC OF)
- 82-KOREA (REPUBLIC OF)
- 965-KUWAIT
- 996-KYRGYZSTAN
- 856-LAO PEOPLES DEMOCRATIC REPUBLIC
- 371-LATVIA
- 961-LEBANON
- 266-LESOTHO
- 231-LIBERIA
- 218-LIBYA
- 423-LIECHTENSTEIN
- 370-LITHUANIA
- 352-LUXEMBOURG
- 853-MACAO
- 389-MACEDONIA (THE FORMER YUGOSLAV REPUBLIC OF)
- 261-MADAGASCAR
- 265-MALAWI
- 60-MALAYSIA
- 960-MALDIVES
- 223-MALI
- 356-MALTA
- 692-MARSHALL ISLANDS
- 596-MARTINIQUE
- 222-MAURITANIA
- 230-MAURITIUS
- 269-MAYOTTE
- 52-MEXICO
- 691-MICRONESIA (FEDERATED STATES OF)
- 373-MOLDOVA (REPUBLIC OF)
- 377-MONACO
- 976-MONGOLIA
- 382-MONTENEGRO
- 1664-MONTSERRAT
- 212-MOROCCO
- 258-MOZAMBIQUE
- 95-MYANMAR
- 264-NAMIBIA
- 674-NAURU
- 977-NEPAL
- 31-NETHERLANDS
- 687-NEW CALEDONIA
- 64-NEW ZEALAND
- 505-NICARAGUA
- 227-NIGER
- 234-NIGERIA
- 683-NIUE
- 15-NORFOLK ISLAND
- 1670-NORTHERN MARIANA ISLANDS
- 47-NORWAY
- 968-OMAN
- 92-PAKISTAN
- 680-PALAU
- 970-PALESTINE, STATE OF
- 507-PANAMA
- 675-PAPUA NEW GUINEA
- 595-PARAGUAY
- 51-PERU
- 63-PHILIPPINES
- 1011-PITCAIRN
- 48-POLAND
- 14-PORTUGAL
- 1787-PUERTO RICO
- 974-QATAR
- 262-REUNION
- 40-ROMANIA
- 8-RUSSIAN FEDERATION
- 250-RWANDA
- 1006-SAINT BARTHELEMY
- 290-SAINT HELENA, ASCENSION AND TRISTAN DA CUNHA
- 1869-SAINT KITTS AND NEVIS
- 1758-SAINT LUCIA
- 1007-SAINT MARTIN (FRENCH PART)
- 508-SAINT PIERRE AND MIQUELON
- 1784-SAINT VINCENT AND THE GRENADINES
- 685-SAMOA
- 378-SAN MARINO
- 239-SAO TOME AND PRINCIPE
- 966-SAUDI ARABIA
- 221-SENEGAL
- 381-SERBIA
- 248-SEYCHELLES
- 232-SIERRA LEONE
- 65-SINGAPORE
- 1721-SINT MAARTEN (DUTCH PART)
- 421-SLOVAKIA
- 386-SLOVENIA
- 677-SOLOMON ISLANDS
- 252-SOMALIA
- 28-SOUTH AFRICA
- 1008-SOUTH GEORGIA AND THE SOUTH SANDWICH ISLANDS
- 211-SOUTH SUDAN
- 35-SPAIN
- 94-SRI LANKA
- 249-SUDAN
- 597-SURINAME
- 1012-SVALBARD AND JAN MAYEN
- 268-SWAZILAND
- 46-SWEDEN
- 41-SWITZERLAND
- 963-SYRIAN ARAB REPUBLIC
- 886-TAIWAN
- 992-TAJIKISTAN
- 255-TANZANIA, UNITED REPUBLIC OF
- 66-THAILAND
- 670-TIMOR-LESTE(EAST TIMOR)
- 228-TOGO
- 690-TOKELAU
- 676-TONGA
- 1868-TRINIDAD AND TOBAGO
- 216-TUNISIA
- 90-TURKEY
- 993-TURKMENISTAN
- 1649-TURKS AND CAICOS ISLANDS
- 688-TUVALU
- 256-UGANDA
- 380-UKRAINE
- 971-UNITED ARAB EMIRATES
- 44-UNITED KINGDOM OF GREAT BRITAIN AND NORTHERN IRELAND
- 2-UNITED STATES OF AMERICA
- 1009-UNITED STATES MINOR OUTLYING ISLANDS
- 598-URUGUAY
- 998-UZBEKISTAN
- 678-VANUATU
- 58-VENEZUELA (BOLIVARIAN REPUBLIC OF)
- 84-VIET NAM
- 1284-VIRGIN ISLANDS (BRITISH)
- 1340-VIRGIN ISLANDS (U.S.)
- 681-WALLIS AND FUTUNA
- 1013-WESTERN SAHARA
- 967-YEMEN
- 260-ZAMBIA
- 263-ZIMBABWE
- 9999-OTHERS

### Dropdown (source: "(Select),Owned,Leased,Hired"), cells H202:H205

- (Select)
- Owned
- Leased
- Hired

