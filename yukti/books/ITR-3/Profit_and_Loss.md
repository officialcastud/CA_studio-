# Profit and Loss — Part A-P&L (ITR-3, A.Y. 2026-27)

Schema block: `PARTA_PL`. Sheet: **Profit and Loss** (`Part A-P &L`). ITR-3-only sheet (business/profession head); no ITR-2 model.

## The shape
This is the **Profit and Loss Account for the financial year 2025-26** (item 13 to 60 filled where **regular books of account** are maintained). It has three faces: (1) credits/debits of the P&L account (items 13–60: gross profit, other income, and every expense head down to net profit before taxes, provisions for tax and appropriations); (2) **computation of presumptive income** under sections **44AD**, **44ADA** and **44AE** (items 61–63); and (3) the "no regular books" schedule (item 64), speculative activity (item 65), and the non-resident presumptive block (item 66, sections 44B/44BB/44BBA/44BBC/44BBD). Almost every figure is a single value; only a handful of details are arrays (other income, other expenses, bad-debt lists, the three presumptive nature-of-business tables, and the 44AE goods-carriage table).

## The items

### Block `PARTA_PL` — Credits to P&L (item 13–15)
| item | field label | type | schema key | rule/notes |
|---|---|---|---|---|
| 13 | Gross profit transferred from Trading Account (12+12b+12d) | int | `CreditsToPL.GrossProfitTrnsfFrmTrdAcc` | computed L4 = TradingAcc_GrossProfitOrLoss + IncomeIntraTrading_12b + IncomeFO_Trading_12d |
| 14 | Other income | object | `CreditsToPL.OthIncome` | container |
| 14 i | Rent | int | `CreditsToPL.OthIncome.RentInc` | min 0 |
| 14 ii | Commission | int | `CreditsToPL.OthIncome.Comissions` | min 0 |
| 14 iii | Dividend income | int | `CreditsToPL.OthIncome.Dividends` | min 0 |
| 14 iv | Interest income | int | `CreditsToPL.OthIncome.InterestInc` | min 0 |
| 14 v | Profit on sale of fixed assets | int | `CreditsToPL.OthIncome.ProfitOnSaleFixedAsset` | |
| 14 vi | Profit on sale of investment being securities chargeable to Securities Transaction Tax (STT) | int | `CreditsToPL.OthIncome.ProfitOnInvChrSTT` | |
| 14 vii | Profit on sale of other investment | int | `CreditsToPL.OthIncome.ProfitOnOthInv` | |
| 14 viii | Gain (Loss) on account of foreign exchange fluctuation u/s 43AA | int | `CreditsToPL.OthIncome.ProfitOnCurrFluct` | may be negative |
| 14 ix | Profit on conversion of inventory into capital asset u/s 28(via) (Fair Market Value of inventory as on the date of conversion) | int | `CreditsToPL.OthIncome.ProfitOnCnvInvntryToCapAsst` | |
| 14 x | Agriculture income | int | `CreditsToPL.OthIncome.ProfitOnAgriIncome` | |
| 14 xi | Any other income (specify nature and amount) | array | `CreditsToPL.OthIncome.OtherIncDtls[]` | rows: `NatureOfIncome` (≤125), `Amount` (min 0) |
| 14 xi a | Liabilities written back | int | `CreditsToPL.OthIncome.LiabilityWrittenBack` | (hidden row 17 sub-total; see Hidden rows) |
| 14 xi b | Amount of interest due or received from partnership firm | int | `CreditsToPL.OthIncome.AmtofInterest` | min 0 |
| 14 xi c | Amount of remuneration due or received from partnership firm | int | `CreditsToPL.OthIncome.AmtofRem` | min 0 |
| 14 xi (misc) | Any other income — miscellaneous total | int | `CreditsToPL.OthIncome.MiscOthIncome` | |
| 14 xii | Total of other income (i + ii + iii + iv + v + vi + vii + viii + ix + x + xi) | int | `CreditsToPL.OthIncome.TotOthIncome` | computed L27 = SUM(J6..J15, J25) |
| 15 | Total of credits to profit and loss account (13+14xii) | int | `CreditsToPL.TotCreditsToPL` | computed L28 = SUM(PL_GrossProfitLoss, PL.TotOthIncome) |

### Block `PARTA_PL` — Debits to P&L (item 16–52)
| item | field label | type | schema key | rule/notes |
|---|---|---|---|---|
| 16 | Freight outward | int | `DebitsToPL.Freight` | min 0 |
| 17 | Consumption of stores and spare parts | int | `DebitsToPL.ConsumptionOfStores` | min 0 |
| 18 | Power and fuel | int | `DebitsToPL.PowerFuel` | min 0 |
| 19 | Rent | int | `DebitsToPL.RentExpdr` | min 0 |
| 20 | Repairs to building | int | `DebitsToPL.RepairsBldg` | min 0 |
| 21 | Repairs to machinery | int | `DebitsToPL.RepairMach` | min 0 |
| 22 | Compensation to employees | object | `DebitsToPL.EmployeeComp` | container |
| 22 i | Salaries and wages | int | `DebitsToPL.EmployeeComp.SalsWages` | min 0 |
| 22 ii | Bonus | int | `DebitsToPL.EmployeeComp.Bonus` | min 0 |
| 22 iii | Reimbursement of medical expenses | int | `DebitsToPL.EmployeeComp.MedExpReimb` | min 0 |
| 22 iv | Leave encashment | int | `DebitsToPL.EmployeeComp.LeaveEncash` | min 0 |
| 22 v | Leave travel benefits | int | `DebitsToPL.EmployeeComp.LeaveTravelBenft` | min 0 |
| 22 vi | Contribution to approved superannuation fund | int | `DebitsToPL.EmployeeComp.ContToSuperAnnFund` | min 0 |
| 22 vii | Contribution to recognised provident fund | int | `DebitsToPL.EmployeeComp.ContToPF` | min 0 |
| 22 viii | Contribution to recognised gratuity fund | int | `DebitsToPL.EmployeeComp.ContToGratFund` | min 0 |
| 22 ix | Contribution to any other fund | int | `DebitsToPL.EmployeeComp.ContToOthFund` | min 0 |
| 22 x | Any other benefit to employees in respect of which an expenditure has been incurred | int | `DebitsToPL.EmployeeComp.OthEmpBenftExpdr` | min 0 |
| 22 xi | Total compensation to employees (22i + 22ii + 22iii + 22iv + 22v + 22vi + 22vii + 22viii + 22ix + 22x) | int | `DebitsToPL.EmployeeComp.TotEmployeeComp` | computed L46 = SUM(J36:J45) |
| 22 xiia | Whether any compensation, included in 22xi, paid to non-residents | string | `DebitsToPL.EmployeeComp.AnyCompPaidToNonRes` | dropdown (Select)/Yes/No |
| 22 xiib | If Yes, amount paid to non-residents | int | `DebitsToPL.EmployeeComp.AmtPaidToNonRes` | min 0 |
| 23 | Insurance | object | `DebitsToPL.Insurances` | container |
| 23 i | Medical Insurance | int | `DebitsToPL.Insurances.MedInsur` | min 0 |
| 23 ii | Life Insurance | int | `DebitsToPL.Insurances.LifeInsur` | min 0 |
| 23 iii | Keyman's Insurance | int | `DebitsToPL.Insurances.KeyManInsur` | min 0 |
| 23 iv | Other Insurance including factory, office, car, goods, etc. | int | `DebitsToPL.Insurances.OthInsur` | min 0 |
| 23 v | Total expenditure on insurance (23i+23ii+23iii+23iv) | int | `DebitsToPL.Insurances.TotInsurances` | computed L54 = SUM(J50:J53) |
| 24 | Workmen and staff welfare expenses | int | `DebitsToPL.StaffWelfareExp` | min 0 |
| 25 | Entertainment | int | `DebitsToPL.Entertainment` | min 0 |
| 26 | Hospitality | int | `DebitsToPL.Hospitality` | min 0 |
| 27 | Conference | int | `DebitsToPL.Conference` | min 0 |
| 28 | Sales promotion including publicity (other than advertisement) | int | `DebitsToPL.SalePromoExp` | min 0 |
| 29 | Advertisement | int | `DebitsToPL.Advertisement` | min 0 |
| 30 | Commission | object | `DebitsToPL.CommissionExpdrDtls` | container |
| 30 i | Paid outside India, or paid in India to a non-resident other than a company or a foreign company | int | `DebitsToPL.CommissionExpdrDtls.NonResOtherCompany` | min 0 |
| 30 ii | To others | int | `DebitsToPL.CommissionExpdrDtls.Others` | min 0 |
| 30 iii | Total (i + ii) | int | `DebitsToPL.CommissionExpdrDtls.Total` | computed L64 = SUM(J62:J63) |
| 31 | Royalty | object | `DebitsToPL.RoyalityDtls` | container |
| 31 i | Paid outside India, or paid in India to a non-resident other than a company or a foreign company | int | `DebitsToPL.RoyalityDtls.NonResOtherCompany` | min 0 |
| 31 ii | To others | int | `DebitsToPL.RoyalityDtls.Others` | min 0 |
| 31 iii | Total (i + ii) | int | `DebitsToPL.RoyalityDtls.Total` | computed L68 = SUM(J66:J67) |
| 32 | Professional / Consultancy fees / Fee for technical services | object | `DebitsToPL.ProfessionalConstDtls` | container |
| 32 i | Paid outside India, or paid in India to a non-resident other than a company or a foreign company | int | `DebitsToPL.ProfessionalConstDtls.NonResOtherCompany` | min 0 |
| 32 ii | To others | int | `DebitsToPL.ProfessionalConstDtls.Others` | min 0 |
| 32 iii | Total (i + ii) | int | `DebitsToPL.ProfessionalConstDtls.Total` | computed L72 = SUM(J70:J71) |
| 33 | Hotel, boarding and Lodging | int | `DebitsToPL.HotelBoardLodge` | min 0 |
| 34 | Traveling expenses other than on foreign traveling | int | `DebitsToPL.TravelExp` | min 0 |
| 35 | Foreign travelling expenses | int | `DebitsToPL.ForeignTravelExp` | min 0 |
| 36 | Conveyance expenses | int | `DebitsToPL.ConveyanceExp` | min 0 |
| 37 | Telephone expenses | int | `DebitsToPL.TelephoneExp` | min 0 |
| 38 | Guest House expenses | int | `DebitsToPL.GuestHouseExp` | min 0 |
| 39 | Club expenses | int | `DebitsToPL.ClubExp` | min 0 |
| 40 | Festival celebration expenses | int | `DebitsToPL.FestivalCelebExp` | min 0 |
| 41 | Scholarship | int | `DebitsToPL.Scholarship` | min 0 |
| 42 | Gift | int | `DebitsToPL.Gift` | min 0 |
| 43 | Donation | int | `DebitsToPL.Donation` | min 0 |
| 44 | Rates and taxes, paid or payable to Government or any local body (excluding taxes on income) | object | `DebitsToPL.RatesTaxesPays.ExciseCustomsVAT` | container |
| 44 i | Union excise duty | int | `DebitsToPL.RatesTaxesPays.ExciseCustomsVAT.UnionExciseDuty` | min 0 |
| 44 ii | Service tax | int | `DebitsToPL.RatesTaxesPays.ExciseCustomsVAT.ServiceTax` | min 0 |
| 44 iii | VAT/ Sales tax | int | `DebitsToPL.RatesTaxesPays.ExciseCustomsVAT.VATorSaleTax` | min 0 |
| 44 iv | Cess | int | `DebitsToPL.RatesTaxesPays.ExciseCustomsVAT.Cess` | min 0 (optional) |
| 44 v | Central Goods & Service Tax (CGST) | int | `DebitsToPL.RatesTaxesPays.ExciseCustomsVAT.CentralGoodServiceTax` | min 0 |
| 44 vi | State Goods & Services Tax (SGST) | int | `DebitsToPL.RatesTaxesPays.ExciseCustomsVAT.StateGoodServiceTax` | min 0 |
| 44 vii | Integrated Goods & Services Tax (IGST) | int | `DebitsToPL.RatesTaxesPays.ExciseCustomsVAT.IntegratedGoodServiceTax` | min 0 |
| 44 viii | Union Territory Goods & Services Tax (UTGST) | int | `DebitsToPL.RatesTaxesPays.ExciseCustomsVAT.UnionTerrGoodServiceTax` | min 0 |
| 44 ix | Any other rate, tax, duty or cess including STT and CTT | int | `DebitsToPL.RatesTaxesPays.ExciseCustomsVAT.OthDutyTaxCess` | min 0 |
| 44 x | Total rates and taxes paid or payable (44i+44ii+44iii+44iv+44v+44vi+44vii+44viii+44ix) | int | `DebitsToPL.RatesTaxesPays.ExciseCustomsVAT.TotExciseCustomsVAT` | computed L94 = SUM(J85:J93) |
| 45 | Audit fee | int | `DebitsToPL.AuditFee` | min 0 |
| 46 | Other expenses (Specify nature and amount) | array | `DebitsToPL.OtherExpensesDtls[]` | rows: `ExpenseNature` (≤125), `Amount` (min 0); TOTAL L102 = SUM(Nature_Amt3) → `DebitsToPL.OtherExpenses` |
| 47 | Bad debts (specify PAN/Aadhaar no. of the person, if available, in respect of whom aggregate amount ≥ Rs.1 lakh) | object | `DebitsToPL.BadDebtDtls` | container |
| 47 i | Bad debts with PAN/Aadhaar (Sl.No. / PAN / Aadhaar Number / Amount) | array | `DebitsToPL.BadDebtDtls.BadDebtAmtDtls[]` | rows: `PAN`, `Aadhaar`, `Amount`; TOTAL L113 = SUM(PLBD.Amount) → `BadDebtAmtDtlsTotal` |
| 47 ii | Others (more than Rs. 1 lakh or more) where PAN/Aadhaar No. is not available, (provide name and complete address) | array | `DebitsToPL.BadDebtDtls.OthersPANNotAvlblDtl[]` | rows: Name/address/`StateCode`/`CountryCode`/PinCode/ZipCode/Amount; TOTAL Q122 = SUM(PL_Amount) → `OthersPANNotAvlblDtlTotal` |
| 47 iii | Others (amounts less than Rs. 1 lakh) | int | `DebitsToPL.BadDebtDtls.OthersAmtLt1Lakh` | |
| 47 iv | Total Bad Debt (47i + 47ii + 47iii) | int | `DebitsToPL.BadDebtDtls.BadDebt` | computed L124 = MAX(SUM(SUM(PLBD.Amount),SUM(PL_Amount),PL.OthersAmtLt1Lakh),0) |
| 48 | Provision for bad and doubtful debts | int | `DebitsToPL.ProvForBadDoubtDebt` | |
| 49 | Other provisions | int | `DebitsToPL.OthProvisionsExpdr` | |
| 50 | Profit before interest, depreciation and taxes [15 – (16 to 21 + 22xi + 23v + 24 to 29 + 30iii + 31iii + 32iii + 33 to 43 + 44x + 45 + 46 + 47iv + 48 + 49)] | int | `DebitsToPL.PBIDTA` | computed L127 |
| 51 | Interest | object | `DebitsToPL.InterestExpdrtDtls` | container |
| 51 i | Paid outside India, or paid in India to a non-resident other than a company or a foreign company | int | `DebitsToPL.InterestExpdrtDtls.NonResOtherCompany` | min 0 |
| 51 ii | To others | int | `DebitsToPL.InterestExpdrtDtls.Others` | min 0 |
| 51 iii | Total (i + ii) | int | `DebitsToPL.InterestExpdrtDtls.InterestExpdr` | computed L131 = SUM(J129,J130) |
| 52 | Depreciation and amortization (include Amortisation expenses along with Depreciation) | int | `DebitsToPL.DepreciationAmort` | min 0 |
| 53 | Net Profit before taxes (50 – 51iii – 52) | int | `DebitsToPL.PBT` | computed L133 = PBIDTA − InterestExpdr − DepreciationAmort |

### Block `PARTA_PL` — Provisions for tax and appropriations (item 54–60)
| item | field label | type | schema key | rule/notes |
|---|---|---|---|---|
| 54 | Provision for current tax | int | `TaxProvAppr.ProvForCurrTax` | |
| 55 | Provision for Deferred Tax | int | `TaxProvAppr.ProvDefTax` | |
| 56 | Profit after tax (53 – 54 – 55) | int | `TaxProvAppr.ProfitAfterTax` | computed L136 = PBT − ProvForCurrTax − ProvDefTax |
| 57 | Balance brought forward from previous year | int | `TaxProvAppr.BalBFPrevYr` | |
| 58 | Amount available for appropriation (56 + 57) | int | `TaxProvAppr.AmtAvlAppr` | computed L138 = SUM(L136,L137) |
| 59 | Transferred to reserves and surplus | int | `TaxProvAppr.TrfToReserves` | |
| 60 | Balance carried to balance sheet in proprietor's account (58 – 59) | int | `TaxProvAppr.ProprietorAccBalTrf` | computed L140 = AmtAvlAppr − TrfToReserves |

### Block `PARTA_PL` — Presumptive income 44AD (item 61)
| item | field label | type | schema key | rule/notes |
|---|---|---|---|---|
| 61 (table) | Name of the Business / Business Code / Description | array (max 3) | `NatOfBus44AD[]` | `NameOfBusiness` (≤75), `CodeAD` enum[315], `Description` (≤75) |
| 61 i | Gross Turnover or Gross Receipts (iA + iB + iC) (61(i) limited to Rs.2 Crores; if 61(iB)+61(iC) ≤ 5% then Rs.3 Crores) | int | `PersumptiveInc44AD.GrsTrnOverOrReceipt` | max 30000000; computed K146 = SUM(PL_61a,PL_61a_1b,PL_61b) |
| 61 iA | Through a/c payee cheque or a/c payee bank draft or bank electronic clearing system received before due date | int | `PersumptiveInc44AD.GrsTrnOverBank` | max 30000000 |
| 61 iB | Receipts in Cash | int | `PersumptiveInc44AD.GrsTotalTrnOverInCash` | max 30000000 |
| 61 iC | Any mode other than A and B | int | `PersumptiveInc44AD.GrsTrnOverAnyOthMode` | max 30000000 |
| 61 ii | Presumptive income under section 44AD (iiA + iiB) | int | `PersumptiveInc44AD.TotPersumptiveInc44AD` | computed K150 = SUM(PL_61iia,PL_61iib) |
| 61 iiA | 6% of 61iA, or the amount claimed to have been earned, whichever is higher | int | `PersumptiveInc44AD.PersumptiveInc44AD6Per` | |
| 61 iiB | 8% of [61(iB) + 61(iC)], or the amount claimed to have been earned, whichever is higher | int | `PersumptiveInc44AD.PersumptiveInc44AD8Per` | |

Note (row 153): If income is less than the above percentage of Gross Receipts/Turnover, it is mandatory to maintain books of accounts and get them audited.

### Block `PARTA_PL` — Presumptive income 44ADA (item 62)
| item | field label | type | schema key | rule/notes |
|---|---|---|---|---|
| 62 (table) | Name of the Business/ Profession / Business Code / Description | array (max 3) | `NatOfBus44ADA[]` | `NameOfBusiness` (≤75), `CodeADA` enum[38], `Description` (≤75) |
| 62 i | Gross Receipts 62(i) limited to Rs.50 Lakhs; if 62(iB)+62(iC) ≤ 5% then Rs.75 Lakhs | int | `PersumptiveInc44ADA.GrsReceipt` | max 7500000; computed K159 = SUM(K160:L162) |
| 62 iA | Through a/c payee cheque or a/c payee bank draft or bank electronic clearing system or prescribed electronic mode | int | `PersumptiveInc44ADA.GrsTrnOverBank44ADA` | max 7500000 |
| 62 iB | Receipts in Cash | int | `PersumptiveInc44ADA.GrsTotalTrnOverInCash44ADA` | max 7500000 |
| 62 iC | Any mode other than A and B | int | `PersumptiveInc44ADA.GrsTrnOverAnyOthMode44ADA` | max 7500000 |
| 62 ii | Presumptive Income under section 44ADA (50% of 62i, or the amount claimed to have been earned, whichever is higher) | int | `PersumptiveInc44ADA.TotPersumptiveInc44ADA` | max 9999999 |

Note (row 164): If income is less than 50% of Gross Receipts, it is mandatory to maintain books of accounts and get them audited.

### Block `PARTA_PL` — Presumptive income 44AE (item 63)
| item | field label | type | schema key | rule/notes |
|---|---|---|---|---|
| 63 (table) | Name of the Business / Business Code / Description | array (max 3) | `NatOfBus44AE[]` | `NameOfBusiness` (≤75), `CodeAE` enum[7], `Description` (≤75) |
| 63 i | Goods-carriage detail table | array | `GoodsDtlsUs44AE[]` | see below |
| 63 i(2) | Registration No. of goods carriage | string | `GoodsDtlsUs44AE[].RegNumberGoodsCarriage` | ≤11; must not repeat |
| 63 i(3) | Whether owned/leased/hired | string | `GoodsDtlsUs44AE[].OwnedLeasedHiredFlag` | enum OWN/LEASE/HIRED |
| 63 i(3b) | Tonnage Capacity of goods carriage (in MT) | number | `GoodsDtlsUs44AE[].TonnageCapacity` | 0–100 |
| 63 i(4) | Number of months for which goods carriage was owned / leased / hired by assessee | int | `GoodsDtlsUs44AE[].HoldingPeriod` | 1–12 |
| 63 i(5) | Presumptive income u/s 44AE for the goods carriage (Computed @ Rs.1000 per tonne per month in case tonnage > 12MT, else @ Rs.7500 per month) | int | `GoodsDtlsUs44AE[].PresumptiveIncome` | min 7500; V172 = I172*J172*1000, W172 = J172*7500 |
| 63 i Total (months) | Total | int | `TotalNumOfMonths` | J183 = SUM(Sheet44AE.NoOfMonths); max 120 |
| 63 i Total (income) | Total | int | `TotalPrsumptvIncUs44EGoods` | K183 = SUM(Sheet44AE.PresumptiveIncome) |
| 63 ii | Total presumptive income from goods carriage u/s 44AE [total of column (5) of table at Point 63(i)] | int | `TotalPrsumptvIncUs44E` | K184 = SUM(Sheet44AE.PresumptiveIncome) |

Note (row 185): If the profits are lower than prescribed under S.44AE or the number of goods carriage owned / leased / hired exceeds ten, books of accounts must be maintained and audited.

### Block `PARTA_PL` — No regular books maintained (item 64)
| item | field label | type | schema key | rule/notes |
|---|---|---|---|---|
| 64 | IF REGULAR BOOKS OF ACCOUNT OF BUSINESS OR PROFESSION ARE NOT MAINTAINED, furnish the following information | object | `NoBooksOfAccPL` | container |
| 64 i | For assessee carrying on Business | object | — | |
| 64 i a | Gross receipts (a1+a2) | int | `NoBooksOfAccPL.GrossReceipt` | L188 = SUM(PL_64ia1,PL_64ia2) |
| 64 i a1 | Through a/c payee cheque or a/c payee bank draft or bank electronic clearing system received or other prescribed mode | int | `NoBooksOfAccPL.GrsRcptAccPayeeOrBankMode` | min 0 |
| 64 i a2 | Any other mode | int | `NoBooksOfAccPL.GrsRcptOtherMode` | min 0 |
| 64 i b | Gross profit | int | `NoBooksOfAccPL.GrossProfit` | |
| 64 i c | Expenses | int | `NoBooksOfAccPL.Expenses` | min 0 |
| 64 i d | Net profit | int | `NoBooksOfAccPL.NetProfit` | L193 = MAX(0, 64ib − 64ic) |
| 64 ii | For assessee carrying on Profession | object | — | |
| 64 ii a | Gross receipts (a1 + a2) | int | `NoBooksOfAccPL.GrossReceiptPrf` | L195 = SUM(PL_64iia_i,PL_64iia_ii) |
| 64 ii a i | Through a/c payee cheque or a/c payee bank draft or bank electronic clearing system received before due date | int | `NoBooksOfAccPL.GrsRcptAccPayeeOrBankModePrf` | min 0 |
| 64 ii a ii | Any other mode | int | `NoBooksOfAccPL.GrsRcptOtherModePrf` | min 0 |
| 64 ii b | Gross profit | int | `NoBooksOfAccPL.GrossProfitPrf` | |
| 64 ii c | Expenses | int | `NoBooksOfAccPL.ExpensesPrf` | min 0 |
| 64 ii d | Net profit | int | `NoBooksOfAccPL.NetProfitPrf` | L200 = MAX(0, 64iib − 64iic) |
| 64 iii | Total Profit (64(i)d + 64(ii)d) | int | `NoBooksOfAccPL.TotBusinessProfession` | L201 = PL_64id + PL_64iid |

### Block `PARTA_PL` — Speculative activity (item 65) & Non-resident (item 66)
| item | field label | type | schema key | rule/notes |
|---|---|---|---|---|
| 65 i | Turnover From Speculative Activity | int | `TurnverFrmSpecActivity` | min 0 |
| 65 ii | Gross Profit | int | `GrossProfit` | |
| 65 iii | Expenditure, if any | int | `Expenditure` | min 0 |
| 65 iv | Net Income From Speculative Activity (65ii − 65iii) | int | `NetIncomeFrmSpecActivity` | L205 = PL_65ii − PL_65iii |
| 66 | In case of Non-Resident, if the total income comprises of profits and gains from business referred to in sections 44B/44BB/44BBA/44BBC/44BBD | array (max 5) | `NonResidentPLDetails[]` | rows: `Section` enum, `GrossReceipt`, `NetProfit` |
| 66 a | Gross receipts/ Turnover (Total) (ai+aii+aiii+aiv+av) | int | `NonResidentPL.GrossReceipt` | L207 = SUM(L208:L212) |
| 66 ai | Section 44B | int | `NonResidentPLDetails[].Section`=44B / `GrossReceipt` | |
| 66 aii | Section 44BB | int | =44BB | |
| 66 aiii | Section 44BBA | int | =44BBA | |
| 66 aiv | Section 44BBC | int | =44BBC | |
| 66 av | Section 44BBD | int | =44BBD | |
| 66 b | Net Profit (Total) (bi+bii+biii+biv+bv) | int | `NonResidentPL.NetProfit` | L213 = SUM(L214:L218) |
| 66 bi | Section 44B | int | `NonResidentPLDetails[].NetProfit` (44B) | |
| 66 bii | Section 44BB | int | (44BB) | |
| 66 biii | Section 44BBA | int | (44BBA) | |
| 66 biv | Section 44BBC | int | (44BBC) | |
| 66 bv | Section 44BBD | int | (44BBD) | |

## The rules the sheet computes
- **L4** — Gross profit transferred from Trading Account = `SUM(TradingAcc_GrossProfitOrLoss + IncomeIntraTrading_12b + IncomeFO_Trading_12d)` (cross-sheet: Trading account 12/12b/12d).
- **L25** — Liabilities written back TOTAL = `LiabilitiesWrittenBack_Amount + PL.Amount_a + PL.Amount_Rem + SUM(Nature_Amt2)`.
- **L27** — Total of other income (14xii) = `SUM(J6,J7,J8,J9,J10,J11,J12,J13,J14,J15,J25)`.
- **L28** — Total of credits to P&L (15) = `SUM(PL_GrossProfitLoss, PL.TotOthIncome)`; min bound −99999999999999.
- **L46** — Total compensation to employees (22xi) = `SUM(J36:J45)`.
- **L54** — Total expenditure on insurance (23v) = `SUM(J50:J53)`; W54 aggregates the debit heads for item 50 (PBIDTA denominator).
- **L64 / L68 / L72** — Commission (30iii) / Royalty (31iii) / Professional (32iii) Total (i+ii) = `SUM(J62:J63)` / `SUM(J66:J67)` / `SUM(J70:J71)`.
- **L94** — Total rates and taxes (44x) = `SUM(J85:J93)`.
- **L102** — Other expenses TOTAL = `SUM(Nature_Amt3)`.
- **L113** — Bad debts with PAN TOTAL (47i) = `SUM(PLBD.Amount)`; **Q122** — 47ii TOTAL = `SUM(PL_Amount)`.
- **L124** — Total Bad Debt (47iv) = `MAX(SUM(SUM(PLBD.Amount),SUM(PL_Amount),PL.OthersAmtLt1Lakh),0)`.
- **L127** — PBIDTA (item 50) = `(PL_TotalOfCreditsToProfit − SUM(L29:L34, PL.TotEmployeeComp, PL.TotInsurances, L55:L60, PL.CommissionExpdr, ...))`.
- **L131** — Interest Total (51iii) = `SUM(J129,J130)`.
- **L133** — Net Profit before taxes (53) = `(PL.PBIDTA − PL.InterestExpdr − PL.DepreciationAmort)`.
- **L136** — Profit after tax (56) = `(PL.PBT − PL.ProvForCurrTax − PL.ProvDefTax)`.
- **L138** — Amount available for appropriation (58) = `SUM(L136,L137)`.
- **L140** — Balance carried to balance sheet (60) = `(PL.AmtAvlAppr − PL.TrfToReserves)`.
- **K146** — 44AD Gross Turnover (61i) = `SUM(PL_61a,PL_61a_1b,PL_61b)`; **K150** — 44AD Presumptive income (61ii) = `SUM(PL_61iia,PL_61iib)`.
- **K159** — 44ADA Gross Receipts (62i) = `SUM(K160:L162)`.
- **V172** — 44AE presumptive per carriage = `I172*J172*1000` (Rs.1000 × tonnage × months when tonnage > 12MT); **W172** = `J172*7500` (Rs.7500 × months otherwise).
- **J183** — Total months = `SUM(Sheet44AE.NoOfMonths)` (≤120); **K183 / K184** — Total presumptive income u/s 44AE = `SUM(Sheet44AE.PresumptiveIncome)`.
- **L188** — 64(i) Business Gross receipts = `SUM(PL_64ia1,PL_64ia2)`; **L193** — 64(i)d Net profit = `MAX(0,(PL_64ib − PL_64ic))`.
- **L195** — 64(ii) Profession Gross receipts = `SUM(PL_64iia_i,PL_64iia_ii)`; **L200** — 64(ii)d Net profit = `MAX(0,(PL_64iib − PL_64iic))`.
- **L201** — 64iii Total Profit = `PL_64id + PL_64iid`.
- **L205** — 65iv Net Income From Speculative Activity = `PL_65ii − PL_65iii`.
- **L207 / L213** — 66a / 66b Non-resident totals = `SUM(L208:L212)` / `SUM(L214:L218)`.

### Cross-sheet validation rules (from rules.json)
- 14xii total of other income = sum of its break-up (14i..14xi); 14xic Any Other Income total = 14x(ia+ib).
- 15 Total of credits = 13 + 14xii.
- 61(ii) Presumptive Income u/s 44AD = 61iiA + 61iiB; cannot exceed gross receipts / gross turnover.
- If a business code u/s 44AD / 44ADA / 44AE is selected, income u/s that section is mandatory.
- 44AD gross receipts > Rs.2 Cr with cash > 5% ⇒ tax audit; > Rs.3 Cr ⇒ tax audit mandatory.
- 44ADA income cannot exceed gross receipts; gross receipts 62(i) = 62(i)a+b+c; > Rs.75,00,000 ⇒ tax audit; > Rs.50,00,000 with cash > 5% ⇒ audit.
- 44AE: 63(ii) must equal breakup column 5; total months (column 4) ≤ 120; if tonnage ≤ 12MT the presumptive income cannot be less than months × Rs.7500; Registration No. must not repeat.
- Presumptive income u/s 44AD cannot be disclosed by a Non-Resident; 44AD not applicable to general commission agents / professionals u/s 44AA(1); HUF not eligible u/s 44ADA.
- Schedule BP 35(i)/35(ii)/35(iii) must match P&L 61(ii)/62(ii)/63(ii).

## Dropdowns
- **22 xiia — Whether any compensation paid to non-residents (`J47`)**: `(Select)`, `Yes`, `No`.
- **63 i(3) — Whether owned/leased/hired (`H172:H181`)**: `(Select)`, `Owned`, `Leased`, `Hired`. (Schema flag enum: `OWN`, `LEASE`, `HIRED`.)
- **66 — Section (`NonResidentPLDetails[].Section`)**: `44B`, `44BB`, `44BBA`, `44BBC`, `44BBD`.
- **47 ii — State (`M117:M120`, named range `State`, 38 codes + placeholder)** and **Country (`N117:N120`, named range `Country`, 250 codes + placeholder)**: full lists below.
- **61 — Business Code u/s 44AD (`H143:J145`, named range `NOB44AD`)**, **62 — Business Code u/s 44ADA (`H156:J158`, named range `NOB44ADA`)**, **63 — Business Code u/s 44AE (`H167:J169`, named range `NOB`)**: full lists below.

### Full dropdown value lists
##### 44AD (316) cells=H143:J145
- (Select)
- 01001-Growing and manufacturing of tea
- 01002-Growing and manufacturing of coffee
- 01003-Growing and manufacturing of rubber
- 01004-Market gardening and horticulture specialties
- 01005-Raising of silk worms and production of silk
- 01006-Raising of bees and production of honey
- 01007-Raising of poultry and production of eggs
- 01008-Rearing of sheep and production of wool
- 01009-Rearing of animals and production of animal products
- 01010-Agricultural and animal husbandry services
- 01011-Soil conservation, soil testing and soil desalination services
- 01012-Hunting, trapping and game propagation services
- 01013-Growing of timber, plantation, operation of tree nurseries and conserving of forest
- 01014-Gathering of tendu leaves
- 01015-Gathering of other wild growing materials
- 01016-Forestry service activities, timber cruising, afforestation and reforestation
- 01017-Logging service activities, transport of logs within the forest
- 01018-Other agriculture, animal husbandry or forestry activity n.e.c
- 02001-Fishing on commercial basis in inland waters
- 02002-Fishing on commercial basis in ocean and coastal areas
- 02003-Fish farming
- 02004-Gathering of marine materials such as natural pearls, sponges, coral etc.
- 02005-Services related to marine and fresh water fisheries, fish hatcheries and fish farms
- 02006-Other Fish farming activity n.e.c
- 03001-Mining and agglomeration of hard coal
- 03002-Mining and agglomeration of lignite
- 03003-Extraction and agglomeration of peat
- 03004-Extraction of crude petroleum and natural gas
- 03005-Service activities incidental to oil and gas extraction excluding surveying
- 03006-Mining of uranium and thorium ores
- 03007-Mining of iron ores
- 03008-Mining of non-ferrous metal ores, except uranium and thorium ores
- 03009-Mining of gemstones
- 03010-Mining of chemical and fertilizer minerals
- 03011-Mining of quarrying of abrasive materials
- 03012-Mining of mica, graphite and asbestos
- 03013-Quarrying of stones (marble/granite/dolomite), sand and clay
- 03014-Other mining and quarrying
- 03015-Mining and production of salt
- 03016-Other mining and quarrying n.e.c
- 04001-Production, processing and preservation of meat and meat products
- 04002-Production, processing and preservation of fish and fish products
- 04003-Manufacture of vegetable oil, animal oil and fats
- 04004-Processing of fruits, vegetables and edible nuts
- 04005-Manufacture of dairy products
- 04006-Manufacture of sugar
- 04007-Manufacture of cocoa, chocolates and sugar confectionery
- 04008-Flour milling
- 04009-Rice milling
- 04010-Dal milling
- 04011-Manufacture of other grain mill products
- 04012-Manufacture of bakery products
- 04013-Manufacture of starch products
- 04014-Manufacture of animal feeds
- 04015-Manufacture of other food products
- 04016-Manufacturing of wines
- 04017-Manufacture of beer
- 04018-Manufacture of malt liquors
- 04019-Distilling and blending of spirits, production of ethyl alcohol
- 04020-Manufacture of mineral water
- 04021-Manufacture of soft drinks
- 04022-Manufacture of other non-alcoholic beverages
- 04023-Manufacture of tobacco products
- 04024-Manufacture of textiles (other than by handloom)
- 04025-Manufacture of textiles using handlooms (khadi)
- 04026-Manufacture of carpet, rugs, blankets, shawls etc. (other than by hand)
- 04027-Manufacture of carpet, rugs, blankets, shawls etc. by hand
- 04028-Manufacture of wearing apparel
- 04029-Tanning and dressing of leather
- 04030-Manufacture of luggage, handbags and the like saddler and harness
- 04031-Manufacture of footwear
- 04032-Manufacture of wood and wood products, cork, straw and plaiting material
- 04033-Manufacture of paper and paper products
- 04034-Publishing, printing and reproduction of recorded media
- 04035-Manufacture of coke oven products
- 04036-Manufacture of refined petroleum products
- 04037-Processing of nuclear fuel
- 04038-Manufacture of fertilizers and nitrogen compounds
- 04039-Manufacture of plastics in primary forms and of synthetic rubber
- 04040-Manufacture of paints, varnishes and similar coatings
- 04041-Manufacture of pharmaceuticals, medicinal chemicals and botanical products
- 04042-Manufacture of soap and detergents
- 04043-Manufacture of other chemical products
- 04044-Manufacture of man-made fibers
- 04045-Manufacture of rubber products
- 04046-Manufacture of plastic products
- 04047-Manufacture of glass and glass products
- 04048-Manufacture of cement, lime and plaster
- 04049-Manufacture of articles of concrete, cement and plaster
- 04050-Manufacture of Bricks
- 04051-Manufacture of other clay and ceramic products
- 04052-Manufacture of other non-metallic mineral products
- 04053-Manufacture of pig iron, sponge iron, Direct Reduced Iron etc.
- 04054-Manufacture of Ferro alloys
- 04055-Manufacture of Ingots, billets, blooms and slabs etc.
- 04056-Manufacture of steel products
- 04057-Manufacture of basic precious and non-ferrous metals
- 04058-Manufacture of non-metallic mineral products
- 04059-Casting of metals
- 04060-Manufacture of fabricated metal products
- 04061-Manufacture of engines and turbines
- 04062-Manufacture of pumps and compressors
- 04063-Manufacture of bearings and gears
- 04064-Manufacture of ovens and furnaces
- 04065-Manufacture of lifting and handling equipment
- 04066-Manufacture of other general purpose machinery
- 04067-Manufacture of agricultural and forestry machinery
- 04068-Manufacture of Machine Tools
- 04069-Manufacture of machinery for metallurgy
- 04070-Manufacture of machinery for mining, quarrying and constructions
- 04071-Manufacture of machinery for processing of food and beverages
- 04072-Manufacture of machinery for leather and textile
- 04073-Manufacture of weapons and ammunition
- 04074-Manufacture of other special purpose machinery
- 04075-Manufacture of domestic appliances
- 04076-Manufacture of office, accounting and computing machinery
- 04077-Manufacture of electrical machinery and apparatus
- 04078-Manufacture of Radio, Television, communication equipment and apparatus
- 04079-Manufacture of medical and surgical equipment
- 04080-Manufacture of industrial process control equipment
- 04081-Manufacture of instruments and appliances for measurements and navigation
- 04082-Manufacture of optical instruments
- 04083-Manufacture of watches and clocks
- 04084-Manufacture of motor vehicles
- 04085-Manufacture of body of motor vehicles
- 04086-Manufacture of parts & accessories of motor vehicles & engines
- 04087-Building & repair of ships and boats
- 04088-Manufacture of railway locomotive and rolling stocks
- 04089-Manufacture of aircraft and spacecraft
- 04090-Manufacture of bicycles
- 04091-Manufacture of other transport equipment
- 04092-Manufacture of furniture
- 04093-Manufacture of jewellery
- 04094-Manufacture of sports goods
- 04095-Manufacture of musical instruments
- 04096-Manufacture of games and toys
- 04097-Other manufacturing n.e.c.
- 04098-Recycling of metal waste and scrap
- 04099-Recycling of non- metal waste and scrap
- 05001-Production, collection and distribution of electricity
- 05002-Manufacture and distribution of gas
- 05003-Collection, purification and distribution of water
- 05004-Other essential commodity service n.e.c
- 06001-Site preparation works
- 06002-Building of complete constructions or parts- civil contractors
- 06003-Building installation
- 06004-Building completion
- 06005-Construction and maintenance of roads, rails, bridges, tunnels, ports, harbour, runways etc.
- 06006-Construction and maintenance of power plants
- 06007-Construction and maintenance of industrial plants
- 06008-Construction and maintenance of power transmission and telecommunication lines
- 06009-Construction of water ways and water reservoirs
- 06010-Other construction activity n.e.c.
- 07001-Purchase, sale and letting of leased buildings (residential and non-residential)
- 07002-Operating of real estate of self-owned buildings (residential and non-residential)
- 07003-Developing and sub-dividing real estate into lots
- 07004-Real estate activities on a fee or contract basis
- 07005-Other real estate/renting services n.e.c
- 08001-Renting of land transport equipment
- 08002-Renting of water transport equipment
- 08003-Renting of air transport equipment
- 08004-Renting of agricultural machinery and equipment
- 08005-Renting of construction and civil engineering machinery
- 08006-Renting of office machinery and equipment
- 08007-Renting of other machinery and equipment n.e.c.
- 08008-Renting of personal and household goods n.e.c.
- 08009-Renting of other machinery n.e.c.
- 09001-Wholesale and retail sale of motor vehicles
- 09002-Repair and maintenance of motor vehicles
- 09003-Sale of motor parts and accessories- wholesale and retail
- 09004-Retail sale of automotive fuel
- 09006-Wholesale of agricultural raw material
- 09007-Wholesale of food & beverages and tobacco
- 09008-Wholesale of household goods
- 09009-Wholesale of metals and metal ores
- 09010-Wholesale of household goods
- 09011-Wholesale of construction material
- 09012-Wholesale of hardware and sanitary fittings
- 09013-Wholesale of cotton and jute
- 09014-Wholesale of raw wool and raw silk
- 09015-Wholesale of other textile fibres
- 09016-Wholesale of industrial chemicals
- 09017-Wholesale of fertilizers and pesticides
- 09018-Wholesale of electronic parts & equipment
- 09019-Wholesale of other machinery, equipment and supplies
- 09020-Wholesale of waste, scrap & materials for re-cycling
- 09021-Retail sale of food, beverages and tobacco in specialized stores
- 09022-Retail sale of other goods in specialized stores
- 09023-Retail sale in non-specialized stores
- 09024-Retail sale of textiles, apparel, footwear, leather goods
- 09025-Retail sale of other household appliances
- 09026-Retail sale of hardware, paint and glass
- 09027-Wholesale of other products n.e.c
- 09028-Retail sale of other products n.e.c
- 10001-Hotels – Star rated
- 10002-Hotels – Non-star rated
- 10003-Motels, Inns and Dharmshalas
- 10004-Guest houses and circuit houses
- 10005-Dormitories and hostels at educational institutions
- 10006-Short stay accommodations n.e.c.
- 10007-Restaurants – with bars
- 10008-Restaurants – without bars
- 10009-Canteens
- 10010-Independent caterers
- 10011-Casinos and other games of chance
- 10012-Other hospitality services n.e.c.
- 11001-Travel agencies and tour operators
- 11002-Packers and movers
- 11003-Passenger land transport
- 11004-Air transport
- 11005-Transport by urban/sub-urban railways
- 11006-Inland water transport
- 11007-Sea and coastal water transport
- 11008-Freight transport by road
- 11009-Freight transport by railways
- 11010-Forwarding of freight
- 11011-Receiving and acceptance of freight
- 11012-Cargo handling
- 11013-Storage and warehousing
- 11014-Transport via pipelines (transport of gases, liquids, slurry and other commodities)
- 11015-Other Transport & Logistics services n.e.c
- 12001-Post and courier activities
- 12002-Basic telecom services
- 12003-Value added telecom services
- 12004-Maintenance of telecom network
- 12005-Activities of the cable operators
- 12006-Other Post & Telecommunication services n.e.c
- 13001-Commercial banks, saving banks and discount houses
- 13002-Specialised institutions granting credit
- 13003-Financial leasing
- 13004-Hire-purchase financing
- 13005-Housing finance activities
- 13006-Commercial loan activities
- 13007-Credit cards
- 13008-Mutual funds
- 13009-Chit fund
- 13010-Investment activities
- 13011-Life insurance
- 13012-Pension funding
- 13013-Non-life insurance
- 13014-Administration of financial markets
- 13015-Stock brokers, sub-brokers and related activities
- 13016-Financial advisers, mortgage advisers and brokers
- 13017-Foreign exchange services
- 13018-Other financial intermediation services n.e.c.
- 14005-Other IT enabled services
- 14007-Cyber café
- 14009-Computer training and educational institutes
- 14010-Other computation related services n.e.c.
- 15001-Natural sciences and engineering
- 15002-Social sciences and humanities
- 15003-Other Research & Development activities n.e.c.
- 16006-Advertising
- 16010-Auctioneers
- 16012-Market research and public opinion polling
- 16014-Labour recruitment and provision of personnel
- 16015-Investigation and security services
- 16016-Building-cleaning and industrial cleaning activities
- 16017-Packaging activities
- 16019-Other professional services n.e.c.
- 17001-Primary education
- 17002-Secondary/ senior secondary education
- 17003-Technical and vocational secondary/ senior secondary education
- 17004-Higher education
- 17005-Education by correspondence
- 17006-Coaching centres and tuitions
- 17007-Other education services n.e.c.
- 18006-Independent blood banks
- 18007-Medical transcription
- 18008-Independent ambulance services
- 18009-Medical suppliers, agencies and stores
- 19001-Social work activities with accommodation (orphanages and old age homes)
- 19002-Social work activities without accommodation (Creches)
- 19003-Industry associations, chambers of commerce
- 19004-Professional organisations
- 19005-Trade unions
- 19006-Religious organizations
- 19007-Political organisations
- 19008-Other membership organisations n.e.c. (rotary clubs, book clubs and philatelic clubs)
- 19009-Other Social or community service n.e.c
- 20001-Motion picture production
- 20002-Film distribution
- 20003-Film laboratories
- 20004-Television channel productions
- 20005-Television channels broadcast
- 20006-Video production and distribution
- 20007-Sound recording studios
- 20008-Radio - recording and distribution
- 20009-Stage production and related activities
- 20013-Circuses and race tracks
- 20014-Video Parlours
- 20015-News agency activities
- 20016-Library and archives activities
- 20017-Museum activities
- 20018-Preservation of historical sites and buildings
- 20019-Botanical and zoological gardens
- 20020-Operation and maintenance of sports facilities
- 20021-Activities of sports and game schools
- 20022-Organisation and operation of indoor/outdoor sports and promotion and production of sporting events
- 20023_1-Sports Management
- 20023-Other sporting activities n.e.c.
- 20024-Other recreational activities n.e.c.
- 21001-Hair dressing and other beauty treatment
- 21002-Funeral and related activities
- 21003-Marriage bureaus
- 21004-Pet care services
- 21005-Sauna and steam baths, massage salons etc.
- 21006-Astrological and spiritualists’ activities
- 21007-Private households as employers of domestic staff
- 21008_1-Event Management
- 21009-Speculative trading
- 21010-Futures and Options trading
- 21011-Buying and selling shares
- 21008-Other services n.e.c.
- 22001-Extra territorial organisations and bodies (IMF, World Bank, European Commission etc.)

##### 44ADA (39) cells=H156:J158
- (Select)
- 14001-Software development
- 14002-Other software consultancy
- 14003-Data processing
- 14004-Database activities and distribution of electronic content
- 14006-BPO services
- 14008-Maintenance and repair of office, accounting and computing machinery
- 16001-Legal profession
- 16002-Accounting, book-keeping and auditing profession
- 16003-Tax consultancy
- 16004-Architectural profession
- 16005-Engineering and technical consultancy
- 16007-Fashion designing
- 16008-Interior decoration
- 16009-Photography
- 16013-Business and management consultancy activities
- 16018-Secretarial activities
- 16019_1-Medical Profession
- 16021-Social Media Influencers
- 16020-Film Artist
- 18001-General hospitals
- 18002-Speciality and super speciality hospitals
- 18003-Nursing homes
- 18004-Diagnostic centres
- 18005-Pathological laboratories
- 18010-Medical clinics
- 18011-Dental practice
- 18012-Ayurveda practice
- 18013-Unani practice
- 18014-Homeopathy practice
- 18015-Nurses, physiotherapists or other para-medical practitioners
- 18016-Veterinary hospitals and practice
- 18017-Medical education
- 18018-Medical research
- 18019-Practice of other alternative medicine
- 18020-Other healthcare services
- 20010-Individual artists excluding authors
- 20011-Literary activities
- 20012-Other cultural activities n.e.c.

##### 44AE (8) cells=H167:J169
- (Select)
- 08001-Renting of land transport equipment
- 11002-Packers and movers
- 11008-Freight transport by road
- 11010-Forwarding of freight
- 11011-Receiving and acceptance of freight
- 11012-Cargo handling
- 11015-Other Transport & Logistics services n.e.c

##### STATE (39) cells=M117:M120
- (Select)
- 01-ANDAMAN AND NICOBAR ISLANDS
- 02-ANDHRA PRADESH
- 03-ARUNACHAL PRADESH
- 04-ASSAM
- 05-BIHAR
- 06-CHANDIGARH
- 07-Dadra Nagar and Haveli
- 08-Daman and Diu
- 09-DELHI
- 10-GOA
- 11-GUJARAT
- 12-HARYANA
- 13-HIMACHAL PRADESH
- 14-JAMMU AND KASHMIR
- 15-KARNATAKA
- 16-KERALA
- 17-LAKHSWADEEP
- 18-MADHYA PRADESH
- 19-MAHARASHTRA
- 20-MANIPUR
- 21-MEGHALAYA
- 22-MIZORAM
- 23-NAGALAND
- 24-ODISHA
- 25-PUDUCHERRY
- 26-PUNJAB
- 27-RAJASTHAN
- 28-SIKKIM
- 29-TAMIL NADU
- 30-TRIPURA
- 31-UTTAR PRADESH
- 32-WEST BENGAL
- 33-CHHATTISGARH
- 34-UTTARAKHAND
- 35-JHARKHAND
- 36-TELANGANA
- 37-LADAKH
- 99-Foreign

##### COUNTRY (251) cells=N117:N120
- (Select)
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
- 967-YEMEN
- 263-ZIMBABWE
- 260-ZAMBIA
- 1013-WESTERN SAHARA
- 9999-OTHERS


## What repeats and what is one figure
**Arrays (repeat):**
- `CreditsToPL.OthIncome.OtherIncDtls[]` — item 14xi Any other income rows (Nature, Amount).
- `DebitsToPL.OtherExpensesDtls[]` — item 46 Other expenses rows (Nature, Amount).
- `DebitsToPL.BadDebtDtls.BadDebtAmtDtls[]` — item 47i bad-debt-with-PAN rows.
- `DebitsToPL.BadDebtDtls.OthersPANNotAvlblDtl[]` — item 47ii rows (name + full address).
- `NatOfBus44AD[]` / `NatOfBus44ADA[]` / `NatOfBus44AE[]` — up to 3 nature-of-business rows each.
- `GoodsDtlsUs44AE[]` — item 63i goods-carriage rows (up to 10; > 10 forces books/audit).
- `NonResidentPLDetails[]` — item 66 non-resident section rows (up to 5).

**Single figures (one each):** every other item — all named credit heads, every expense head and its computed totals, the tax-provision/appropriation block (54–60), the presumptive-income summaries (61i/61ii, 62i/62ii, 63ii), the no-books block (64), the speculative block (65), and the non-resident summary object `NonResidentPL` (66a/66b).

## Mandatory (required schema keys)
Block-level required: `CreditsToPL`, `DebitsToPL`, `TaxProvAppr`, `NoBooksOfAccPL`, `TurnverFrmSpecActivity`, `NetIncomeFrmSpecActivity`.

Required leaf keys (must be present when their block is filed):
- Credits: `RentInc`, `Comissions`, `Dividends`, `InterestInc`, `ProfitOnSaleFixedAsset`, `ProfitOnInvChrSTT`, `ProfitOnOthInv`, `ProfitOnCurrFluct`, `ProfitOnCnvInvntryToCapAsst`, `ProfitOnAgriIncome`, `MiscOthIncome`, `TotOthIncome`, `TotCreditsToPL`; array row `Amount`.
- Debits: `Freight`, `ConsumptionOfStores`, `PowerFuel`, `RentExpdr`, `RepairsBldg`, `RepairMach`, `SalsWages`, `Bonus`, `MedExpReimb`, `LeaveEncash`, `LeaveTravelBenft`, `ContToSuperAnnFund`, `ContToPF`, `ContToGratFund`, `ContToOthFund`, `OthEmpBenftExpdr`, `TotEmployeeComp`, `MedInsur`, `LifeInsur`, `KeyManInsur`, `OthInsur`, `TotInsurances`, `StaffWelfareExp`, `Entertainment`, `Hospitality`, `Conference`, `SalePromoExp`, `Advertisement`, `NonResOtherCompany`, `Others`, `Total`, `HotelBoardLodge`, `TravelExp`, `ForeignTravelExp`, `ConveyanceExp`, `TelephoneExp`, `GuestHouseExp`, `ClubExp`, `FestivalCelebExp`, `Scholarship`, `Gift`, `Donation`, `UnionExciseDuty`, `ServiceTax`, `VATorSaleTax`, `CentralGoodServiceTax`, `StateGoodServiceTax`, `IntegratedGoodServiceTax`, `UnionTerrGoodServiceTax`, `OthDutyTaxCess`, `TotExciseCustomsVAT`, `AuditFee`, `ExpenseNature`, `OtherExpenses`, `PAN`, `BadDebtAmtDtlsTotal`, `Name`, `FlatDoorBlockNumber`, `AreaLocality`, `TownCityDistrict`, `StateCode`, `CountryCode`, `OthersPANNotAvlblDtlTotal`, `OthersAmtLt1Lakh`, `BadDebt`, `ProvForBadDoubtDebt`, `OthProvisionsExpdr`, `PBIDTA`, `InterestExpdr`, `DepreciationAmort`, `PBT`.
- Tax/appropriations: `ProvForCurrTax`, `ProvDefTax`, `ProfitAfterTax`, `BalBFPrevYr`, `AmtAvlAppr`, `TrfToReserves`, `ProprietorAccBalTrf`.
- Presumptive: `NameOfBusiness`, `CodeAD`, `CodeADA`, `CodeAE`, `GrsTrnOverOrReceipt`, `TotPersumptiveInc44AD`, `GrsReceipt`, `RegNumberGoodsCarriage`, `OwnedLeasedHiredFlag`, `TonnageCapacity`, `HoldingPeriod`, `PresumptiveIncome`.
- No-books: `GrossReceipt`, `GrsRcptAccPayeeOrBankMode`, `GrsRcptOtherMode`, `GrossProfit`, `Expenses`, `NetProfit`, `GrossReceiptPrf`, `GrsRcptAccPayeeOrBankModePrf`, `GrsRcptOtherModePrf`, `GrossProfitPrf`, `ExpensesPrf`, `NetProfitPrf`, `TotBusinessProfession`.

Optional keys still built where the item is present: `GrossProfitTrnsfFrmTrdAcc`, `NatureOfIncome`, `LiabilityWrittenBack`, `AmtofInterest`, `AmtofRem`, `AnyCompPaidToNonRes`, `AmtPaidToNonRes`, `Cess`, `Aadhaar`, `PremisesBuildingName`, `RoadStreetPostOffice`, `PinCode`, `ZipCode`, `Description`, `GrsTrnOverBank`, `GrsTotalTrnOverInCash`, `GrsTrnOverAnyOthMode`, `PersumptiveInc44AD6Per`, `PersumptiveInc44AD8Per`, `GrsTrnOverBank44ADA`, `GrsTotalTrnOverInCash44ADA`, `GrsTrnOverAnyOthMode44ADA`, `TotPersumptiveInc44ADA`, `TotalNumOfMonths`, `TotalPrsumptvIncUs44EGoods`, `TotalPrsumptvIncUs44E`, `Expenditure`, `Section`.

## Hidden rows — not built
- **Row 17 (`[F17] a. Liabilities written back` / `[G17] Liabilities written back`)** — HIDDEN. This is a superseded single-cell version of the "Liabilities written back" item; the live, built version is the sub-table at rows 18–25 (`Sl.No / Nature / Amount`, TOTAL at row 25) mapped to `LiabilityWrittenBack`, `AmtofInterest`, `AmtofRem`. Not presented as an item.
- **Row 170 (`[D170] (i)` / `[E170] Serial number`)** — HIDDEN. A stray serial-number header for the 44AE goods-carriage table; the live column headers are at row 171. Not presented as an item.

(No other rows carry the `H` flag; rows 22–24, 98–101, 106–112, 117–120, 143–145, 156–158, 167–169, 172–181 are visible spill/entry rows of the arrays above, not hidden.)

## What this means for the build
- Item numbers 13–66 come from the utility's own lettering/`K`-column tags and the rules document — not from row counting. Use them exactly (e.g. 14xii, 22xi, 22xiia/xiib, 23v, 30iii/31iii/32iii, 44x, 47i/47ii/47iii/47iv, 50, 51iii, 61i/61ii, 62i/62ii, 63i/63ii, 64iii, 65iv, 66a/66b).
- All computed cells (green, untypeable): 14xii, 15, 22xi, 23v, 30iii, 31iii, 32iii, 44x, 46 TOTAL, 47i/47ii/47iv, 50, 51iii, 53, 56, 58, 60, 61i, 61ii, 62i, 63i totals, 63ii, 64ia/64id/64iia/64iid/64iii, 65iv, 66a/66b.
- Enforce the presumptive caps at input: 44AD turnover ≤ Rs.2 Cr (Rs.3 Cr if cash ≤ 5%), schema max 30000000; 44ADA receipts ≤ Rs.50 L (Rs.75 L if cash ≤ 5%), schema max 7500000, income max 9999999; 44AE per-carriage income min Rs.7500, tonnage 0–100, holding 1–12 months, total months ≤ 120.
- 44AE per-carriage income: Rs.1000 × tonnage × months when tonnage > 12MT, else Rs.7500 × months (V172/W172). Registration number uniqueness must be validated (rules.json).
- Cross-links: item 13 pulls from Trading account (12/12b/12d); items 61(ii)/62(ii)/63(ii) feed Schedule BP 35(i)/(ii)/(iii); PBIDTA (50) sums the debit heads via W54/L127.
- Business-code dropdowns are the large named ranges NOB44AD (315), NOB44ADA (38), NOB (7); StateCode enum[38] and CountryCode enum[250] on the 47ii address rows. Selecting a code makes the corresponding presumptive income mandatory.
- Speculative block (65) and non-resident block (66) are separate from the main P&L; 65 and 66 totals are computed. Non-resident presumptive (66) available only for non-residents; 44AD presumptive barred for non-residents.


## Additional visible rows — verbatim from the sheet (completeness)
Rows present on the utility sheet and captured here verbatim so every visible label is in the book:

- Other income
- Dividend income
- Interest income
- Agriculture income
- Entertainment
- Advertisement
- Total (i + ii)
- VAT/ Sales tax
- Expenditure, if any
- Section 44BB
- Section 44BBA
- Section 44BBC
- Section 44BBD
