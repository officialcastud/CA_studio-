# Profit and Loss — Part A-P&L (ITR-5, A.Y. 2026-27)

Schema block: `PARTA_PL`. Sheet: **PROFIT_LOSS** (Excel caption `Part A-P& L`). Section map: `{"section":"pl","blocks":["PARTA_PL"]}` (`books/ITR-5/section_map.json`). Rows 3–210 read from `python3 tools/dump.py --form ITR-5 --sheet "PROFIT_LOSS"`; formulas from `--formulas`; dropdowns from `--dropdowns`; schema from `--schema PARTA_PL` / `--leaves PARTA_PL`; rules from `books/ITR-5/rules.json` (cat A n=108–179, cat B n=4,5,6,25,26,31,54).

## The shape
This is the **Profit and Loss Account for the financial year 2025-26** (row 3: "fill items 13 to 61 in a case where regular books of account are maintained"). It has three faces:

1. **Regular-books P&L** (items 13–61, rows 4–135): credits (item 13 gross profit from trading account, item 14 other income), then every debit/expense head (items 16–50), profit before interest depreciation and taxes (item 51), interest, depreciation, net profit before taxes (item 54), provisions for tax and appropriations (items 55–61).
2. **Presumptive income cases** (rows 136–177): computation u/s **44AD** (item 62), **44ADA** (item 63) and **44AE** goods carriages (item 64).
3. **No-account case / other** (rows 178–210): item 65 (no regular books — business & profession), item 66 (speculative activity), item 67 (non-resident presumptive u/s 44B/44BB/44BBA/44BBC/44BBD).

Almost every figure is a single value. The only repeating (array) parts are: other income (14 xi), other expenses (item 47), the two bad-debt detail tables (48 i, 48 ii), the three presumptive nature-of-business tables (62/63/64), the 44AE goods-carriage table (64 i), and the non-resident detail table (item 67).

## The items

### Block `PARTA_PL` — Credits to P&L (items 13–15, rows 4–26)
| item | field label | type | schema key | rule / notes |
|---|---|---|---|---|
| 13 | Gross profit transferred from Trading Account (12+12b+12d) | int | `CreditsToPL.GrossProfitTrnsfFrmTrdAcc` | computed O4 = SUM(TradingAcc_GrossProfitOrLoss, TradingAcc_IntradayTradingIncome, IncomefromFutures_ProfilandLoss); rule n=108 (=12+12b+12d of Trading) |
| 14 | Other income | object | `CreditsToPL.OthIncome` | container |
| 14 i | Rent | int | `CreditsToPL.OthIncome.RentInc` | min 0 |
| 14 ii | Commission | int | `CreditsToPL.OthIncome.Comissions` | min 0 |
| 14 iii | Dividend income | int | `CreditsToPL.OthIncome.Dividends` | min 0 |
| 14 iv | Interest income | int | `CreditsToPL.OthIncome.InterestInc` | min 0 |
| 14 v | Profit on sale of fixed assets | int | `CreditsToPL.OthIncome.ProfitOnSaleFixedAsset` | may be negative |
| 14 vi | Profit on sale of investment being securities chargeable to Securities Transaction Tax (STT) | int | `CreditsToPL.OthIncome.ProfitOnInvChrSTT` | may be negative |
| 14 vii | Profit on sale of other investment | int | `CreditsToPL.OthIncome.ProfitOnOthInv` | may be negative |
| 14 viii | Gain (Loss) on account of foreign exchange fluctuation u/s 43AA | int | `CreditsToPL.OthIncome.ProfitOnCurrFluct` | may be negative |
| 14 ix | Profit on conversion of inventory into capital asset u/s 28(via) (FMV of inventory as on the date of conversion) | int | `CreditsToPL.OthIncome.ProfitOnCnvInvntryToCapAsst` | min 0 |
| 14 x | Agricultural income | int | `CreditsToPL.OthIncome.ProfitOnAgriIncome` | min 0 |
| 14 xi | Any other income (specify nature and amount) | array | `CreditsToPL.OthIncome.OtherIncDtls[]` | rows: `NatureOfIncome` (≤50), `Amount` (min 0). Table headers: Sl. No. / Nature / Amount (row 18) |
| 14 xi a. | Liabilities written back | int | `CreditsToPL.OthIncome.LiabilityWrittenBack` | row 19 (a.); also see **hidden row 16 (xia)** |
| 14 xi b. | Amount of interest due or received from partnership firm | int | `CreditsToPL.OthIncome.AmtofInterest` | row 20 (b.); min 0 |
| 14 xi (misc) | Any other income — miscellaneous total | int | `CreditsToPL.OthIncome.MiscOthIncome` | folds row-23 Total (`H23 = SUM(PL.Amount)+PL_LiabilityWrittenBack+AmtofInterest_PL`) into the credit line |
| 14 xii | Total of other income (i + ii + iii + iv + v + vi + vii + viii + ix + x + xi) | int | `CreditsToPL.OthIncome.TotOthIncome` | computed O25 = SUM(L6:L15)+PL.MiscOthIncome; rule n=110 |
| 15 | Total of credits to profit and loss account (13+14xii) | int | `CreditsToPL.TotCreditsToPL` | computed O26 = SUM(PL.GrossProfitTrnsfFrmTrdAcc, PL.TotOthIncome); rule n=111 (=13+14xii) |

### Block `PARTA_PL` — Debits to P&L (items 16–52, rows 27–126)
| item | field label | type | schema key | rule / notes |
|---|---|---|---|---|
| 16 | Freight outward | int | `DebitsToPL.DebitPlAcnt.Freight` | min 0 |
| 17 | Consumption of stores and spare parts | int | `DebitsToPL.DebitPlAcnt.ConsumptionOfStores` | min 0 |
| 18 | Power and fuel | int | `DebitsToPL.DebitPlAcnt.PowerFuel` | min 0 |
| 19 | Rents | int | `DebitsToPL.DebitPlAcnt.RentExpdr` | min 0 |
| 20 | Repairs to building | int | `DebitsToPL.DebitPlAcnt.RepairsBldg` | min 0 |
| 21 | Repairs to machinery | int | `DebitsToPL.DebitPlAcnt.RepairMach` | min 0 |
| 22 | Compensation to employees | object | `DebitsToPL.DebitPlAcnt.EmployeeComp` | container |
| 22 i | Salaries and wages | int | `DebitsToPL.DebitPlAcnt.EmployeeComp.SalsWages` | min 0 |
| 22 ii | Bonus | int | `DebitsToPL.DebitPlAcnt.EmployeeComp.Bonus` | min 0 |
| 22 iii | Reimbursement of medical expenses | int | `DebitsToPL.DebitPlAcnt.EmployeeComp.MedExpReimb` | min 0 |
| 22 iv | Leave encashment | int | `DebitsToPL.DebitPlAcnt.EmployeeComp.LeaveEncash` | min 0 |
| 22 v | Leave travel benefits | int | `DebitsToPL.DebitPlAcnt.EmployeeComp.LeaveTravelBenft` | min 0 |
| 22 vi | Contribution to approved superannuation fund | int | `DebitsToPL.DebitPlAcnt.EmployeeComp.ContToSuperAnnFund` | min 0 |
| 22 vii | Contribution to recognised provident fund | int | `DebitsToPL.DebitPlAcnt.EmployeeComp.ContToPF` | min 0 |
| 22 viii | Contribution to recognised gratuity fund | int | `DebitsToPL.DebitPlAcnt.EmployeeComp.ContToGratFund` | min 0 |
| 22 ix | Contribution to any other fund | int | `DebitsToPL.DebitPlAcnt.EmployeeComp.ContToOthFund` | min 0 |
| 22 x | Any other benefit to employees in respect of which an expenditure has been incurred | int | `DebitsToPL.DebitPlAcnt.EmployeeComp.OthEmpBenftExpdr` | min 0 |
| 22 xi | Total compensation to employees (total of 22i to 22x) | int | `DebitsToPL.DebitPlAcnt.EmployeeComp.TotEmployeeComp` | computed O44 = SUM(L34:L43); rule n=113 |
| 22 xii(a) | Whether any compensation, included in 22xi, paid to non-residents | string | `DebitsToPL.DebitPlAcnt.EmployeeComp.AnyCompPaidToNonRes` | dropdown L45 Yes/No; rule n=112 (if Yes, 22xiib ≠ 0) |
| 22 xii(b) | If Yes, amount paid to non-residents | int | `DebitsToPL.DebitPlAcnt.EmployeeComp.AmtPaidToNonRes` | min 0 |
| 23 | Insurance | object | `DebitsToPL.DebitPlAcnt.Insurances` | container |
| 23 i | Medical Insurance | int | `DebitsToPL.DebitPlAcnt.Insurances.MedInsur` | min 0 |
| 23 ii | Life Insurance | int | `DebitsToPL.DebitPlAcnt.Insurances.LifeInsur` | min 0 |
| 23 iii | Keyman's Insurance | int | `DebitsToPL.DebitPlAcnt.Insurances.KeyManInsur` | min 0 |
| 23 iv | Other Insurance including factory, office, car, goods, etc. | int | `DebitsToPL.DebitPlAcnt.Insurances.OthInsur` | min 0 |
| 23 v | Total expenditure on insurance (23i+23ii+23iii+23iv) | int | `DebitsToPL.DebitPlAcnt.Insurances.TotInsurances` | computed O52 = SUM(L48:L51); rule n=114 |
| 24 | Workmen and staff welfare expenses | int | `DebitsToPL.DebitPlAcnt.StaffWelfareExp` | min 0 |
| 25 | Entertainment | int | `DebitsToPL.DebitPlAcnt.Entertainment` | min 0 |
| 26 | Hospitality | int | `DebitsToPL.DebitPlAcnt.Hospitality` | min 0 |
| 27 | Conference | int | `DebitsToPL.DebitPlAcnt.Conference` | min 0 |
| 28 | Sales promotion including publicity (other than advertisement) | int | `DebitsToPL.DebitPlAcnt.SalePromoExp` | min 0 |
| 29 | Advertisement | int | `DebitsToPL.DebitPlAcnt.Advertisement` | min 0 |
| 30 | Commission | object | `DebitsToPL.DebitPlAcnt.CommissionExpdrDtls` | container |
| 30 i | Paid outside India, or paid in India to a non-resident other than a company or a foreign company | int | `DebitsToPL.DebitPlAcnt.CommissionExpdrDtls.NonResOtherCompany` | min 0 |
| 30 ii | To others | int | `DebitsToPL.DebitPlAcnt.CommissionExpdrDtls.Others` | min 0 |
| 30 iii | Total (i + ii) | int | `DebitsToPL.DebitPlAcnt.CommissionExpdrDtls.Total` | computed O62 = SUM(L60:L61); rule n=115 |
| 31 | Royalty | object | `DebitsToPL.DebitPlAcnt.RoyalityDtls` | container |
| 31 i | Paid outside India, or paid in India to a non-resident other than a company or a foreign company | int | `DebitsToPL.DebitPlAcnt.RoyalityDtls.NonResOtherCompany` | min 0 |
| 31 ii | To others | int | `DebitsToPL.DebitPlAcnt.RoyalityDtls.Others` | min 0 |
| 31 iii | Total (i + ii) | int | `DebitsToPL.DebitPlAcnt.RoyalityDtls.Total` | computed O66 = SUM(L64:L65); rule n=116 |
| 32 | Professional / Consultancy fees / Fee for technical services | object | `DebitsToPL.DebitPlAcnt.ProfessionalConstDtls` | container |
| 32 i | Paid outside India, or paid in India to a non-resident other than a company or a foreign company | int | `DebitsToPL.DebitPlAcnt.ProfessionalConstDtls.NonResOtherCompany` | min 0 |
| 32 ii | To others | int | `DebitsToPL.DebitPlAcnt.ProfessionalConstDtls.Others` | min 0 |
| 32 iii | Total (i + ii) | int | `DebitsToPL.DebitPlAcnt.ProfessionalConstDtls.Total` | computed O70 = SUM(L68:L69); rule n=117 |
| 33 | Hotel, boarding and Lodging | int | `DebitsToPL.DebitPlAcnt.HotelBoardLodge` | min 0 |
| 34 | Traveling expenses other than on foreign traveling | int | `DebitsToPL.DebitPlAcnt.TravelExp` | min 0 |
| 35 | Foreign travelling expenses | int | `DebitsToPL.DebitPlAcnt.ForeignTravelExp` | min 0 |
| 36 | Conveyance expenses | int | `DebitsToPL.DebitPlAcnt.ConveyanceExp` | min 0 |
| 37 | Telephone expenses | int | `DebitsToPL.DebitPlAcnt.TelephoneExp` | min 0 |
| 38 | Guest House expenses | int | `DebitsToPL.DebitPlAcnt.GuestHouseExp` | min 0 |
| 39 | Club expenses | int | `DebitsToPL.DebitPlAcnt.ClubExp` | min 0 |
| 40 | Festival celebration expenses | int | `DebitsToPL.DebitPlAcnt.FestivalCelebExp` | min 0 |
| 41 | Scholarship | int | `DebitsToPL.DebitPlAcnt.Scholarship` | min 0 |
| 42 | Gift | int | `DebitsToPL.DebitPlAcnt.Gift` | min 0 |
| 43 | Donation | int | `DebitsToPL.DebitPlAcnt.Donation` | min 0 |
| 44 | Rates and taxes, paid or payable to Government or any local body (excluding taxes on income) | object | `DebitsToPL.DebitPlAcnt.RatesTaxesPays.ExciseCustomsVAT` | container |
| 44 i | Union excise duty | int | `DebitsToPL.DebitPlAcnt.RatesTaxesPays.ExciseCustomsVAT.UnionExciseDuty` | min 0 |
| 44 ii | Service tax | int | `DebitsToPL.DebitPlAcnt.RatesTaxesPays.ExciseCustomsVAT.ServiceTax` | min 0 |
| 44 iii | VAT/ Sales tax | int | `DebitsToPL.DebitPlAcnt.RatesTaxesPays.ExciseCustomsVAT.VATorSaleTax` | min 0 |
| 44 iv | Cess | int | `DebitsToPL.DebitPlAcnt.RatesTaxesPays.ExciseCustomsVAT.Cess` | min 0 (not required) |
| 44 v | Central Goods & Service Tax (CGST) | int | `DebitsToPL.DebitPlAcnt.RatesTaxesPays.ExciseCustomsVAT.CentralGoodServiceTax` | min 0 |
| 44 vi | State Goods & Services Tax (SGST) | int | `DebitsToPL.DebitPlAcnt.RatesTaxesPays.ExciseCustomsVAT.StateGoodServiceTax` | min 0 |
| 44 vii | Integrated Goods & Services Tax (IGST) | int | `DebitsToPL.DebitPlAcnt.RatesTaxesPays.ExciseCustomsVAT.IntegratedGoodServiceTax` | min 0 |
| 44 viii | Union Territory Goods & Services Tax (UTGST) | int | `DebitsToPL.DebitPlAcnt.RatesTaxesPays.ExciseCustomsVAT.UnionTerrGoodServiceTax` | min 0 |
| 44 ix | Any other rate, tax, duty or cess including STT and CTT | int | `DebitsToPL.DebitPlAcnt.RatesTaxesPays.ExciseCustomsVAT.OthDutyTaxCess` | min 0 |
| 44 x | Total rates and taxes paid or payable (44i+44ii+44iii+44iv+44v+44vi+44vii+44viii+44ix) | int | `DebitsToPL.DebitPlAcnt.RatesTaxesPays.ExciseCustomsVAT.TotExciseCustomsVAT` | computed O92 = SUM(L83:L91); rule n=118 (note: 44x = sum 44i..44viii **+44ix**) |
| 45 | Audit fee | int | `DebitsToPL.DebitPlAcnt.AuditFee` | min 0 |
| 46 | Salary/Remuneration to Partners of the firm | int | `DebitsToPL.DebitPlAcnt.SalRemuneration` | min 0; rule n=124 (claimed by other than Firm), rule n=165 (46 + 64iii must tie to Part A-General-2 point E/A col 9) |
| 47 | Other expenses (Specify nature and amount) | array | `DebitsToPL.DebitPlAcnt.OtherExpensesDtls[]` | rows: `ExpenseNature` (≤50), `Amount` (min 0). Table headers Sl. No./Nature/Amount (row 96). Row-100 Total O100 = SUM(PLOE.ExpenseAmt); rule n=119 (47 = 47i+47ii+47n) |
| 47 (total) | Total of other expenses | int | `DebitsToPL.DebitPlAcnt.OtherExpenses` | sum of the 47 detail table |
| 48 | Bad debts (specify PAN/ Aadhaar No. of the person, if available, in respect of whom Bad Debt of ≥ Rs.1 lakh is claimed) | object | `DebitsToPL.DebitPlAcnt.BadDebtDtls` | container |
| 48 i | Bad-debt detail (PAN/Aadhaar available) | array | `DebitsToPL.DebitPlAcnt.BadDebtDtls.BadDebtAmtDtls[]` | rows: `PAN`, `Aadhaar`, `Amount`. Headers row 102: Sl. No./PAN/Aadhaar No./Amount. Row-105 Total H105 = SUM(PLBD.Amount); rule n=162 (PAN/Aadhaar mandatory if amount filled), n=172/n=166 (breakup consistent with total) |
| 48 i (total) | Total bad debt with PAN/Aadhaar | int | `DebitsToPL.DebitPlAcnt.BadDebtDtls.BadDebtAmtDtlsTotal` | computed |
| 48 ii | Others (more than Rs. 1 lakh) where PAN/ Aadhaar No. is not available (provide name and complete address) | array | `DebitsToPL.DebitPlAcnt.BadDebtDtls.OthersPANNotAvlblDtl[]` | rows below; Total row 111 O111 = SUM(PLOT.Amount); rule n=179 (name & address mandatory where PAN/Aadhaar absent and amount > Rs.1 lakh) |
| 48 ii (total) | Total bad debt without PAN/Aadhaar | int | `DebitsToPL.DebitPlAcnt.BadDebtDtls.OthersPANNotAvlblDtlTotal` | computed |
| 48 iii | Others (where aggregate amount of bad debt per person is less than Rs.1 lakh) | int | `DebitsToPL.DebitPlAcnt.BadDebtDtls.OthersAmtLt1Lakh` | min 0 |
| 48 iv | Total Bad Debt (48i + 48ii + 48iii) | int | `DebitsToPL.DebitPlAcnt.BadDebtDtls.BadDebt` | computed O114 = SUM(PLBD.Amount)+SUM(PLOT.Amount)+PL.OthersAmtLt1Lakh; rule n=120 |
| 49 | Provision for bad and doubtful debts | int | `DebitsToPL.DebitPlAcnt.ProvForBadDoubtDebt` | may be negative (no min) |
| 50 | Other provisions | int | `DebitsToPL.DebitPlAcnt.OthProvisionsExpdr` | may be negative (no min) |
| 51 | Profit before interest, depreciation and taxes [15 – (16 to 21 + 22xi + 23v + 24 to 29 + 30iii + 31iii + 32iii + 33 to 43 + 44x + 45 + 46 + 47 + 48iv + 49 + 50)] | int | `DebitsToPL.DebitPlAcnt.PBIDTA` | computed O117; rule n=121 |
| 52 | Interest | object | `DebitsToPL.DebitPlAcnt.InterestExpdrtDtls` | container |
| 52 i | Paid outside India, or paid in India to a non-resident other than a company or a foreign company | (subtotal L119) | — | L119 = SUM(PLI.NonResOtherCompany_P, PLI.NonResOtherCompany_O) |
| 52 i a | To Partners | int | `DebitsToPL.DebitPlAcnt.InterestExpdrtDtls.NonResOtherCompany` | min 0 (52ia) |
| 52 i b | To others | int | `DebitsToPL.DebitPlAcnt.InterestExpdrtDtls.Others` | min 0 (52ib) |
| 52 ii | Paid in India, or paid to a resident | (subtotal L122) | — | L122 = SUM(PLI.Others_P, PLI.Others_O) |
| 52 ii a | To Partners | int | `DebitsToPL.DebitPlAcnt.InterestExpdrtDtls.ResPartners` | min 0 (52iia) |
| 52 ii b | To others | int | `DebitsToPL.DebitPlAcnt.InterestExpdrtDtls.ResOthers` | min 0 (52iib) |
| 52 iii | Total (52i + 52ii) | int | `DebitsToPL.DebitPlAcnt.InterestExpdrtDtls.InterestExpdr` | computed O125 = SUM(PLI.NonResOtherCompany, PLI.Others); rule n=122 (= 52ia+52ib+52iia+52iib) |
| 53 | Depreciation and amortization | int | `DebitsToPL.DebitPlAcnt.DepreciationAmort` | min 0; schema note "Include Amortisation expenses along with Depreciation" |
| 54 | Net profit before taxes (51 – 52iii – 53) | int | `DebitsToPL.DebitPlAcnt.PBT` | computed O127 = O117-O125-O126; rule n=123 |

### Block `PARTA_PL` — Provisions for tax and Appropriations (items 55–61, rows 128–135)
| item | field label | type | schema key | rule / notes |
|---|---|---|---|---|
| — | Provisions for tax and Appropriations | object | `DebitsToPL.TaxProvAppr` | section header (row 128) |
| 55 | Provision for current tax | int | `DebitsToPL.TaxProvAppr.ProvForCurrTax` | may be negative (no min) |
| 56 | Provision for Deferred Tax | int | `DebitsToPL.TaxProvAppr.ProvDefTax` | may be negative (no min) |
| 57 | Profit after tax (54 – 55 – 56) | int | `DebitsToPL.TaxProvAppr.ProfitAfterTax` | computed O131 = O127-O129-O130; rule n=125 |
| 58 | Balance brought forward from previous year | int | `DebitsToPL.TaxProvAppr.BalBFPrevYr` | may be negative |
| 59 | Amount available for appropriation (57 + 58) | int | `DebitsToPL.TaxProvAppr.AmtAvlAppr` | computed O133 = SUM(O131:O132); rule n=126 |
| 60 | Transferred to reserves and surplus | int | `DebitsToPL.TaxProvAppr.Appropriations.TrfToReserves` | may be negative |
| 61 | Balance carried to balance sheet in proprietor's account (59 – 60) | int | `DebitsToPL.TaxProvAppr.PartnerAccBalTrf` | computed O135 = O133-O134; rule n=127 |

### Block `PARTA_PL` — Presumptive income u/s 44AD (item 62, rows 136–149)
Section headers: **PRESUMPTIVE INCOME CASES** (row 136); **COMPUTATION OF PRESUMPTIVE BUSINESS INCOME UNDER SECTION 44AD (Only for Resident Partnership Firm** other than LLP**)** (row 137).

| item | field label | type | schema key | rule / notes |
|---|---|---|---|---|
| 62 (table) | Nature of business — Name of the Business / Business Code / Description | array (max 3) | `NatOfBus44AD[]` | rows: `NameOfBusiness` (≤75, req), `CodeAD` (enum[315], req, dropdown H139:H141), `Description` (≤75). Headers row 138: Sl.No./Name of the Business/Business Code/Description; rule n=135, n=136 |
| 62 i | Gross Turnover or Gross Receipts (iA + iB + iC) — 62(i) limited to Rs.2 Crores; however if [62(i)B+62(i)C] ≤ 5% then limited to Rs.3 Crores | int | `PersumptiveInc44AD.GrsTrnOverOrReceipt` | computed O142 = SUM(L143:L145); max **30000000**; rule n=128 |
| 62 iA | Through a/c payee cheque or a/c payee bank draft or bank electronic clearing system or other prescribed electronic mode | int | `PersumptiveInc44AD.GrsTrnOverBank` | max 30000000 |
| 62 iB | Receipts in Cash | int | `PersumptiveInc44AD.GrsTotalTrnOverInCash` | max 30000000 |
| 62 iC | Any mode other than A and B | int | `PersumptiveInc44AD.GrsTrnOverAnyOthMode` | max 30000000 |
| 62 ii | Presumptive income under section 44AD (iiA + iiB) | int | `PersumptiveInc44AD.TotPersumptiveInc44AD` | computed O146 = SUM(L147:L148); rule n=129 |
| 62 iiA | 6% of 62iA, or the amount claimed to have been earned, whichever is higher | int | `PersumptiveInc44AD.PersumptiveInc44AD6Per` | rule n=130 (≥6% of 62iA), n=133 (≤ 62ia) |
| 62 iiB | 8% of (62iB + 62iC), or the amount claimed to have been earned, whichever is higher | int | `PersumptiveInc44AD.PersumptiveInc44AD8Per` | rule n=131 (≥8% of 62iB & 62iC), n=132 (≤ 62ib & 62ic) |

Hidden helper cells (5%/turnover test that decides the Rs.2cr/Rs.3cr cap): `T142 = T144*5/100`, `T144 = SUM(bank, cash, othmode)`, `T145 = cash`, `T148 = IF(T145>T142, MIN(T144,20000000), IF(T145<=T142, MIN(T144,30000000)))`. Note (row 149): if income is less than the above percentage of Gross Receipts/Turnover, it is mandatory to maintain books of accounts and get them audited.

### Block `PARTA_PL` — Presumptive income u/s 44ADA (item 63, rows 150–160)
Section header: **COMPUTATION OF PRESUMPTIVE INCOME FROM PROFESSIONS UNDER SECTION 44ADA (Only for Resident Partnership Firm** other than LLP**)** (row 150).

| item | field label | type | schema key | rule / notes |
|---|---|---|---|---|
| 63 (table) | Nature — Name of the Business/ Profession / Business Code / Description | array (max 3) | `NatOfBus44ADA[]` | rows: `NameOfBusiness` (≤75, req), `CodeADA` (enum[38], req, dropdown H152:H154), `Description` (≤75). Headers row 151; rule n=137, n=138 |
| 63 i | Gross Receipts — 63(i) limited to Rs.50 Lakhs; however if [63(i)B+63(i)C] ≤ 5% then limited to Rs.75 Lakhs | int | `PersumptiveInc44ADA.GrsReceipt` | computed O155 = SUM(bank, receipts, anyother); max **7500000**; rule n=167 (= 63ia+63ib+63ic) |
| 63 iA | Through a/c payee cheque or a/c payee bank draft or bank electronic clearing system or prescribed electronic mode | int | `PersumptiveInc44ADA.GrsTrnOverBank44ADA` | max 7500000 |
| 63 iB | Receipts in Cash | int | `PersumptiveInc44ADA.GrsTotalTrnOverInCash44ADA` | max 7500000 |
| 63 iC | Any mode other than A and B | int | `PersumptiveInc44ADA.GrsTrnOverAnyOthMode44ADA` | max 7500000 |
| 63 ii | Presumptive Income under section 44ADA (50% of 63i, or the amount claimed to have been earned, whichever is higher) | int | `PersumptiveInc44ADA.TotPersumptiveInc44ADA` | rule n=134 (≥50% of 63i), n=141 (63i not more than 63ii) |

Hidden helper cells: `T155 = T157*5/100`, `T157 = SUM(bank, receipts, anyother)`, `T158 = receipts(cash)`, `T161 = IF(T158>T155, MIN(T157,5000000), IF(T158<=T155, MIN(T157,7500000)))`. Note (row 160): if income is less than 50% of Gross Receipts, it is mandatory to maintain books of accounts and have them audited.

### Block `PARTA_PL` — Presumptive income u/s 44AE (item 64, rows 161–177)
Section header: **COMPUTATION OF PRESUMPTIVE INCOME FROM GOODS CARRIAGES UNDER SECTION 44AE** (row 161).

| item | field label | type | schema key | rule / notes |
|---|---|---|---|---|
| 64 (table) | Nature of business — Name of the Business / Business Code / Description | array (max 3) | `NatOfBus44AE[]` | rows: `NameOfBusiness` (≤75, req), `CodeAE` (enum[7], req, dropdown H163:H165), `Description` (≤75). Headers row 162; rule n=139, n=140 |
| 64 i (table) | Goods-carriage detail | array | `GoodsDtlsUs44AE[]` | one row per carriage; columns (row 167) below |
| 64 i (1) | Registration No. of goods carriage | string | `GoodsDtlsUs44AE[].RegNumberGoodsCarriage` | ≤11 chars; rule n=163 (registration number must be unique) |
| 64 i (2) | Whether owned/leased/hired | string | `GoodsDtlsUs44AE[].OwnedLeasedHiredFlag` | enum OWN/LEASE/HIRED; dropdown G169:G171 Owned/Leased/Hired |
| 64 i (3) | Tonnage Capacity of goods carriage (in MT) | int | `GoodsDtlsUs44AE[].TonnageCapacity` | 0–100; rule n=149 (≤100 MT) |
| 64 i (4) | Number of months for which goods carriage was owned / leased / hired by assessee | int | `GoodsDtlsUs44AE[].HoldingPeriod` | 1–12; column-4 total ≤120 (rule n=147) |
| 64 i (5) | Presumptive income u/s 44AE for the goods carriage (Rs.1000 per ton per month if tonnage > 12MT, else Rs.7500 per month) | int | `GoodsDtlsUs44AE[].PresumptiveIncome` | min 7500; rule n=150 (≥Rs.7500 if ≤12MT / Rs.1000 per ton per month if >12MT) |
| 64 i (total col 4) | Total number of months | int | `TotalNumOfMonths` | computed I172 = SUM(PL44AE2.NoMonthsOwned) |
| 64 i (total col 5) | Total presumptive income (goods) | int | `TotalPrsumptvIncUs44EGoods` / `TotalPrsumptvIncGCUs44E` | computed J172 = SUM(PL44AE2.PresemptiveIncome) |
| 64 ii | Total presumptive income from goods carriage u/s 44AE [total of column (5) of table 64(i)] | int | `TotalPrsumptvIncGCUs44E` | computed O175 = SUM(PL44AE2.PresemptiveIncome); rule n=145/n=146 (= total of col 5) |
| 64 iii | Less: Salary/Remuneration to Partners of the firm | int | `SalRemrtnToPartnerFirm` | min 0; rule n=161 (cannot be > 0 if 64ii null/zero), n=165 (46+64iii tie to Part A-General-2) |
| 64 iv | Total Presumptive Income u/s 44AE (ii – iii) | int | `TotalPrsumptvIncUs44E` | computed O177 = MAX(0, PL.TotalPrsumptvIncGCUs44E - PL.SalRemrtnToPartnerFirm); rule n=148 |

Note (row 174): if the profits are lower than prescribed under section 44AE or the number of goods carriage owned at any time exceeds the limit, books must be maintained and audited.

### Block `PARTA_PL` — No-account case (item 65, rows 178–193)
Section header (row 178): **NO ACCOUNT CASE** — IF REGULAR BOOKS OF ACCOUNT OF BUSINESS OR PROFESSION ARE NOT MAINTAINED, furnish the following information.

| item | field label | type | schema key | rule / notes |
|---|---|---|---|---|
| 65 (i) | For assessee carrying on Business | object | `NoBooksOfAccPL` | sub-block |
| 65 (i) a | Gross receipts (a1 + a2) | int | `NoBooksOfAccPL.GrossReceipt` | computed O180 = SUM(O181:O182); rule n=157 (= 65(i)a(i)+65(i)a(ii)) |
| 65 (i) a i | Through a/c payee cheque or a/c payee bank draft or bank electronic clearing system or other prescribed electronic mode | int | `NoBooksOfAccPL.GrsRcptAccPayeeOrBankMode` | min 0 |
| 65 (i) a ii | Any other mode | int | `NoBooksOfAccPL.GrsRcptOtherMode` | min 0 |
| 65 (i) b | Gross profit | int | `NoBooksOfAccPL.GrossProfit` | may be negative; rule n=155 (65(i)b not more than 65(i)a) |
| 65 (i) c | Expenses | int | `NoBooksOfAccPL.Expenses` | min 0 |
| 65 (i) d | Net profit | int | `NoBooksOfAccPL.NetProfit` | computed O185 = MAX(0, PL.GrossProfit - PL.Expenses); rule n=153 (= 65(i)b − 65(i)c) |
| 65 (ii) | For assessee carrying on Profession | object | `NoBooksOfAccPL` | sub-block |
| 65 (ii) a | Gross receipts (a1 + a2) | int | `NoBooksOfAccPL.GrossReceiptPrf` | computed O187 = SUM(O188:O189); rule n=158 (= 65iia1+65iia2) |
| 65 (ii) a i | Through a/c payee cheque or a/c payee bank draft or bank electronic clearing system or other prescribed electronic mode | int | `NoBooksOfAccPL.GrsRcptAccPayeeOrBankModePrf` | min 0 |
| 65 (ii) a ii | Any other mode | int | `NoBooksOfAccPL.GrsRcptOtherModePrf` | min 0 |
| 65 (ii) b | Gross profit | int | `NoBooksOfAccPL.GrossProfitPrf` | may be negative; rule n=156 (65(ii)b not more than 65(ii)a) |
| 65 (ii) c | Expenses | int | `NoBooksOfAccPL.ExpensesPrf` | min 0 |
| 65 (ii) d | Net profit | int | `NoBooksOfAccPL.NetProfitPrf` | computed O192 = MAX(0, PL.GrossProfitPrf - PL.ExpensesPrf); rule n=154 (= 65(ii)b − 65(ii)c) |
| 65 (total) | Total Profit (65(i)d + 65(ii)d) | int | `NoBooksOfAccPL.TotBusinessProfession` | computed O193 = PL.NetProfit + PL.NetProfitPrf; rule n=159 |

### Block `PARTA_PL` — Speculative activity (item 66, rows 194–197)
| item | field label | type | schema key | rule / notes |
|---|---|---|---|---|
| 66 (i) | Turnover from speculative activity | int | `TurnverFrmSpecActivity` | min 0; **required** |
| 66 (ii) | Gross Profit | int | `GrossProfit` | may be negative |
| 66 (iii) | Expenditure, if any | int | `Expenditure` | min 0 |
| 66 (iv) | Net income from speculative activity (66ii − 66iii) | int | `NetIncomeFrmSpecActivity` | computed O197 = PL.GrossProfit_2 - PL.Expenditure; **required**; rule n=160 |

### Block `PARTA_PL` — Non-resident presumptive (item 67, rows 198–210)
Section header (row 198): In case of Non-Resident, if the total income comprises of profits and gains from business referred to in sections 44B / 44BB / 44BBA / 44BBC / 44BBD.

| item | field label | type | schema key | rule / notes |
|---|---|---|---|---|
| 67 (detail) | Section / Gross receipt / Net profit per section | array (max 5) | `NonResidentPLDetails[]` | rows: `Section` (enum 44B/44BB/44BBA/44BBC/44BBD), `GrossReceipt` (min 0), `NetProfit` (min 0) |
| 67 a | Total (Gross receipts/ Turnover) (ai + aii + aiii + aiv + av) | int | `NonResidentPL.GrossReceipt` | computed O199 = SUM(O200:O204) |
| 67 a i | Section 44B | int | (row ai → `NonResidentPLDetails[]`) | rule n=175 (net profit ≥ 7.5% of gross) |
| 67 a ii | Section 44BB | int | (row aii) | rule n=176 (≥10%) |
| 67 a iii | Section 44BBA | int | (row aiii) | rule n=177 (≥5%) |
| 67 a iv | Section 44BBC | int | (row aiv) | rule n=178 (≥20%) |
| 67 a v | Section 44BBD | int | (row av) | rule n=173 (≥25%) |
| 67 b | Total (Net Profit) (bi + bii + biii + biv + bv) | int | `NonResidentPL.NetProfit` | computed O205 = SUM(O206:O210); rule n=174 (67(ii) net profit not more than 67(i) turnover) |
| 67 b i–v | Section 44B / 44BB / 44BBA / 44BBC / 44BBD net profit | int | (rows bi–bv → `NonResidentPLDetails[].NetProfit`) | per-section net profit |

## The rules the sheet computes
Computed (formula) cells — the sheet auto-fills; the build must not accept manual entry that contradicts them:
- **O4** item 13 = SUM(TradingAcc_GrossProfitOrLoss, TradingAcc_IntradayTradingIncome, IncomefromFutures_ProfilandLoss) (rule n=108).
- **H23** other-income detail Total = SUM(PL.Amount)+PL_LiabilityWrittenBack+AmtofInterest_PL.
- **O25** item 14xii = SUM(L6:L15)+PL.MiscOthIncome (rule n=110).
- **O26** item 15 = SUM(PL.GrossProfitTrnsfFrmTrdAcc, PL.TotOthIncome) (rule n=111).
- **O44** item 22xi = SUM(L34:L43) (rule n=113).
- **O52** item 23v = SUM(L48:L51) (rule n=114).
- **O62 / O66 / O70** items 30iii / 31iii / 32iii = SUM of the two sub-rows (rules n=115/116/117).
- **O92** item 44x = SUM(L83:L91) (rule n=118).
- **O100** item 47 Total = SUM(PLOE.ExpenseAmt) (rule n=119).
- **H105 / O111** bad-debt sub-totals = SUM(PLBD.Amount) / SUM(PLOT.Amount).
- **O114** item 48iv = SUM(PLBD.Amount)+SUM(PLOT.Amount)+PL.OthersAmtLt1Lakh (rule n=120).
- **O117** item 51 PBIDTA = PL.TotCreditsToPL − (SUM(O27:O32)+PL.TotEmployeeComp+PL.TotInsurances+SUM(O53:O58)+PL.CommissionExpdr+…) (rule n=121).
- **O125** item 52iii = SUM(PLI.NonResOtherCompany, PLI.Others) (rule n=122). **L119/L122** are the two sub-group subtotals.
- **O127** item 54 = O117 − O125 − O126 (rule n=123).
- **O131** item 57 = O127 − O129 − O130 (rule n=125).
- **O133** item 59 = SUM(O131:O132) (rule n=126).
- **O135** item 61 = O133 − O134 (rule n=127).
- **44AD:** O142 item 62i = SUM(L143:L145) (rule n=128); O146 item 62ii = SUM(L147:L148) (rule n=129). Cap logic in helper `T148 = IF(T145>T142, MIN(T144,20000000), IF(T145<=T142, MIN(T144,30000000)))` — Rs.2cr cap unless cash+other ≤ 5% of turnover, then Rs.3cr.
- **44ADA:** O155 item 63i = SUM(bank, receipts, anyother) (rule n=167). Cap `T161 = IF(T158>T155, MIN(T157,5000000), IF(T158<=T155, MIN(T157,7500000)))` — Rs.50L cap unless cash+other ≤ 5%, then Rs.75L.
- **44AE:** I172/J172 table totals; O175 item 64ii = SUM(PL44AE2.PresemptiveIncome) (rule n=146); O177 item 64iv = MAX(0, TotalPrsumptvIncGCUs44E − SalRemrtnToPartnerFirm) (rule n=148).
- **No-account:** O180/O187 gross receipts = SUM of the two mode rows; O185/O192 net profit = MAX(0, gross profit − expenses) (rules n=153/154); O193 total = NetProfit + NetProfitPrf (rule n=159).
- **Speculative:** O197 item 66iv = PL.GrossProfit_2 − PL.Expenditure (rule n=160).
- **Non-resident:** O199 item 67a = SUM(O200:O204); O205 item 67b = SUM(O206:O210).

Cross-schedule / validation rules (not auto-fill, but the build must honour):
- rules n=142/143/144: Schedule BP Sl.no 35(i)=62(ii), 35(ii)=63(ii), 35(iii)=64(iv).
- rule n=112: if 22xii(a) = Yes then 22xii(b) ≠ 0.
- rule n=124: item 46 Salary/Remuneration to Partners cannot be claimed by other than a Firm.
- rule n=161: item 64iii can be > 0 only if 64ii > 0.
- rule n=162 / n=179: PAN/Aadhaar mandatory in 48(i) when bad-debt amount filled; name & full address mandatory in 48(ii) where PAN/Aadhaar absent and amount > Rs.1 lakh.
- rule n=163: goods-carriage registration number must be unique.
- rule n=151/152: 44AD & 44ADA presumptive income only for Resident Partnership Firm; 44AD not available to general commission agents / professionals u/s 44AA(1).
- Audit-trigger rules (Part A-General "liable for audit u/s 44AB"): n=164 (business > Rs.10cr or profession > Rs.50L), n=168 (44ADA > Rs.50L with cash/other > 5%), n=169 (44AD > Rs.2cr with cash/other > 5%), n=170 (44ADA > Rs.75L), n=171 (44AD > Rs.3cr), cat-B n=31/54.
- cat-B n=4/5/6: if business/profession income claimed, gross receipts must be entered in P&L, and profit must be ≥ 6%/8% (44AD) or ≥ 50% (44ADA) unless books maintained and audited; n=25 links to Schedule BP.
- rules n=1/2/10/13: Part A-P&L cannot be blank if liable for audit u/s 92E / 44AB, or if liable to maintain accounts u/s 44AA; "No books" section fills the no-account case.

## Dropdowns
- **22 xii(a) — Whether compensation paid to non-residents (`L45`)**: `Yes`, `No`.
- **64 i(2) — Whether owned/leased/hired (`G169:G171`)**: `(Select)`, `Owned`, `Leased`, `Hired`. (Schema flag enum: `OWN`, `LEASE`, `HIRED`.)
- **67 — Section (`NonResidentPLDetails[].Section`)**: `44B`, `44BB`, `44BBA`, `44BBC`, `44BBD` (schema enum; not an Excel data-validation list).
- **48 ii — State (`K109:K110`, 37 codes + placeholder)** and **Country (`L109:L110`, 250 codes + placeholder)**: full lists below.
- **62 — Business Code u/s 44AD (`H139:H141`, 315 codes)**, **63 — Business Code u/s 44ADA (`H152:H154`, 38 codes)**, **64 — Business Code u/s 44AE (`H163:H165`, 7 codes)**: full lists below.

The remaining Excel "dropdowns" reported for this sheet (`source` values like `0`, `-99999999999999`, `50`) are numeric input-range validations, not pick-lists, so they carry no value list.

## What repeats and what is one figure
**Arrays (repeat):**
- `CreditsToPL.OthIncome.OtherIncDtls[]` — other income (14 xi), rows of Nature + Amount.
- `DebitsToPL.DebitPlAcnt.OtherExpensesDtls[]` — other expenses (47), rows of ExpenseNature + Amount.
- `DebitsToPL.DebitPlAcnt.BadDebtDtls.BadDebtAmtDtls[]` — bad debts with PAN/Aadhaar (48 i).
- `DebitsToPL.DebitPlAcnt.BadDebtDtls.OthersPANNotAvlblDtl[]` — bad debts without PAN/Aadhaar, with full address (48 ii).
- `NatOfBus44AD[]`, `NatOfBus44ADA[]`, `NatOfBus44AE[]` — max 3 rows each (nature-of-business tables).
- `GoodsDtlsUs44AE[]` — goods-carriage table (64 i).
- `NonResidentPLDetails[]` — max 5 rows (item 67, one per section).

**Everything else is a single figure** (one value per line): all the credit/debit heads, all totals/computed lines, the presumptive summaries, the no-account case, the speculative block, and the `NonResidentPL` summary object.

## Mandatory (required schema keys)
Top-level required (from `--schema PARTA_PL` `required:`): `CreditsToPL`, `DebitsToPL`, `PersumptiveInc44AD`, `PersumptiveInc44ADA`, `TotalPrsumptvIncUs44E`, `NoBooksOfAccPL`, `TurnverFrmSpecActivity`, `NetIncomeFrmSpecActivity`.

Required leaves (starred `*` in `--leaves PARTA_PL`), by area:
- **Credits:** all of `OthIncome.*` except `OtherIncDtls`, `AmtofInterest`, `LiabilityWrittenBack` (those three are optional); `TotOthIncome`, `TotCreditsToPL` required.
- **Debits:** every head under `DebitPlAcnt` is required except `Cess`, `AnyCompPaidToNonRes`, `AmtPaidToNonRes`, `OtherExpensesDtls`, the bad-debt array rows' optional cols (Aadhaar, PremisesBuildingName, RoadStreetPostOffice, PinCode, ZipCode), `OtherExpenses` is required; all totals required.
- **Array-row required fields:** `OtherIncDtls[].NatureOfIncome/.Amount`; `OtherExpensesDtls[].ExpenseNature/.Amount`; `BadDebtAmtDtls[].PAN/.Amount`; `OthersPANNotAvlblDtl[].Name/.FlatDoorBlockNumber/.AreaLocality/.TownCityDistrict/.StateCode/.CountryCode/.Amount`; `NatOfBus44AD[].NameOfBusiness/.CodeAD` (and 44ADA `.CodeADA`, 44AE `.CodeAE`); `GoodsDtlsUs44AE[].RegNumberGoodsCarriage/.OwnedLeasedHiredFlag/.TonnageCapacity/.HoldingPeriod/.PresumptiveIncome`.
- **Presumptive:** `PersumptiveInc44AD.GrsTrnOverOrReceipt/.TotPersumptiveInc44AD`; `PersumptiveInc44ADA.GrsReceipt`; `TotalPrsumptvIncUs44E`.
- **No-account:** all of `NoBooksOfAccPL.*` required (`GrossReceipt`, `GrsRcptAccPayeeOrBankMode`, `GrsRcptOtherMode`, `GrossProfit`, `Expenses`, `NetProfit`, and the `…Prf` set, `TotBusinessProfession`).
- **Speculative:** `TurnverFrmSpecActivity`, `NetIncomeFrmSpecActivity` required; `GrossProfit`, `Expenditure` optional.
- **Non-resident:** `NonResidentPLDetails[]` and `NonResidentPL` fields all optional (block filled only for non-resident presumptive cases).

## Hidden rows — not built
- **Row 16 (H)** — `[E16] xia [F16] Liabilities written back [K16] xia`: this is a hidden mirror of the "Liabilities written back" line. The **visible** entry is row 19 (14 xi a., schema key `CreditsToPL.OthIncome.LiabilityWrittenBack`) inside the "Any other income" detail table. Do **not** build a separate field for hidden row 16.

No other rows in the dumped range (rows 3–210) are flagged `H`. Helper rows F22/E98/E104/D110/E170/E171/F140/F141/F153/F154/F164/F165 are auto-increment Sl.No. counters (`= prev+1`), not data fields, and the `T…`/`S…` column cells (T142/T144/T145/T148/T155/T157/T158/T161, S-labels "5% of 62(i)" etc.) are off-form helper cells for the turnover-cap tests — captured under the 44AD/44ADA rule notes above, not built as user fields.

## What this means for the build
- Build the single-figure heads as plain integer inputs; wire the computed cells (all the `O…` totals listed under "The rules the sheet computes") as read-only derived values, never free entry.
- Model the seven arrays as add-row tables; enforce max 3 for the three nature-of-business tables, max 5 for `NonResidentPLDetails[]`.
- Three sections are mutually alternative in practice: (1) regular-books P&L (13–61), (2) presumptive (62–64), (3) no-account case (65). Which one is live is driven by Part A-General's "books maintained / liable to audit / declaring only u/s 44AD/44ADA/44AE" flags (rules n=1/2/10/13, cat-B n=4/5/6/25/31/54). The build should expose the correct face based on those flags rather than all at once.
- The 44AD/44ADA turnover caps switch (Rs.2cr↔Rs.3cr; Rs.50L↔Rs.75L) on the 5%-cash test — enforce via the helper logic in the rule notes, and drive the audit-liability flags (n=164/168/169/170/171) from the same figures.
- Feed 62(ii)→BP 35(i), 63(ii)→BP 35(ii), 64(iv)→BP 35(iii) (rules n=142/143/144); tie item 13 to Trading account 12+12b+12d (n=108); tie item 46 + 64(iii) to Part A-General-2 partner remuneration (n=165).
- Enforce the bad-debt identity rules (PAN/Aadhaar mandatory when amount filled; name+address when PAN/Aadhaar absent and amount > Rs.1 lakh; breakup ties to total) — n=162/166/172/179.

## Full dropdown value lists

##### 22 xiia — Whether compensation paid to non-residents  (cells=L45, 2 values)
- Yes
- No

##### 62 — Business Code u/s 44AD  (cells=H139:H141, 316 values)
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
- 04071-Manufacture of machinery for processing of food and  beverages
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
- 04086-Manufacture of parts & accessories of motor vehicles &  engines
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
- 05004-Other essential commodity service  n.e.c
- 06001-Site preparation works
- 06002-Building of complete constructions or parts- civil contractors
- 06003-Building installation
- 06004-Building completion
- 06005-Construction and maintenance of roads, rails, bridges, tunnels, ports, harbour, runways etc.
- 06006-Construction and maintenance of power plants
- 06007-Construction  and maintenance of industrial plants
- 06008-Construction  and maintenance of power transmission and telecommunication lines
- 06009-Construction of water ways and water reservoirs
- 06010-Other construction activity n.e.c.
- 07001-Purchase, sale and letting of leased buildings  (residential and non-residential)
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

##### 63 — Business Code u/s 44ADA  (cells=H152:H154, 39 values)
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
- 18001-General  hospitals
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

##### 64 — Business Code u/s 44AE  (cells=H163:H165, 8 values)
- (Select)
- 08001-Renting of land transport equipment
- 11002-Packers and movers
- 11008-Freight transport by road
- 11010-Forwarding of freight
- 11011-Receiving and acceptance of freight
- 11012-Cargo handling
- 11015-Other Transport & Logistics services n.e.c

##### 64 i(2) — Whether owned/leased/hired  (cells=G169:G171, 4 values)
- (Select)
- Owned
- Leased
- Hired

##### 48 ii — State  (cells=K109:K110, 39 values)
- (Select)
- 01-Andaman and Nicobar Islands
- 02-Andhra Pradesh
- 03-Arunachal Pradesh
- 04-Assam
- 05-Bihar
- 06-Chandigarh
- 07-Dadra Nagar and Haveli
- 08-Daman and Diu
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
- 33-Chhattisgarh
- 34-Uttarakhand
- 35-Jharkhand
- 36-Telangana
- 37-Ladakh
- 99-Foreign

##### 48 ii — Country  (cells=L109:L110, 251 values)
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
- 886-TAIWAN, PROVINCE OF CHINA[A]
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
