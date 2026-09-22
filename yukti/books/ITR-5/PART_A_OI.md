# PART - A OI — Other Information (ITR-5, A.Y. 2026-27)

Block: `PARTA_OI` · Section: `oi` (from `books/ITR-5/section_map.json`)
Source header [F3]: "OI Other Information (Mandatory if liable for audit under section 44AB). Where applicable, all fields with Serial nos marked in red, are compulsory and blank numeric fields will be treated as zeroes."

## The shape

A single, non-repeating schedule. It is one flat form of tax-audit-style disclosures: 17 numbered items (Sl.No. 1–17), several of which open into fixed sub-lists (4a–4e, 5a–5f, 6a–6u, 7a–7j, 8A a–j + 8B, 9a–9g, 10a–10i, 11a–11i, 12a–12i, 13a–13c). Every amount cell is one figure — there are no add-a-row tables anywhere in this sheet. Values are typed into column J; sub-totals compute in column L (or J45). Two figures (3a, 3b) are auto-populated from Schedule ICDS and two dropdowns (method of accounting, stock valuation) drive text enums; the rest are numeric.

The schema mirrors this exactly: block `PARTA_OI` is one object with scalar leaves and fixed named sub-objects (`MethodOfValClgStk`, `NoCredToPLAmt`, `AmtDisallUs36` with nested `NoOfEmployeesEmployed`, `AmtDisallUs37`, `AmtDisallUs40`, `AmtDisallUs40A`, `AmtDisallUs43BPyNowAll.AmtUs43B`, `AmtDisall43B.AmtUs43B`, `AmtExciseCustomsVATOutstanding.ExciseCustomsVAT`). No arrays.

## The items

### 1–3 Method of accounting & ICDS deviation

| Sl | Cell | Field | Type | Schema key | Rule |
|----|------|-------|------|-----------|------|
| 1 | L4 | Method of accounting employed in the previous year | dropdown | `MethodOfAcct` (enum MERC, CASH) | mandatory |
| 2 | L5 | Is there any change in method of accounting | dropdown Yes/No | `ChangeInAcctMethFlg` (enum N, Y) | mandatory |
| 3a | L6 | Increase in the profit or decrease in loss because of deviation, if any, as per Income Computation Disclosure Standards notified under section 145(2) [column XI(3) of Schedule ICDS] | integer (auto) | `ProfDeviatDueAcctMeth` | L6 = ICDS.Total; must equal column XI(3) of Schedule ICDS (rule 180) |
| 3b | L7 | Decrease in the profit or increase in loss because of deviation, if any, as per Income Computation Disclosure Standards notified under section 145(2) [column XI(4) of Schedule ICDS] | integer (auto) | `DecProOrIncLossUs145_2` | L7 = ICDS.DeTotal1; must equal column XI(4) of Schedule ICDS (rule 181) |

### 4 Method of valuation of closing stock (`MethodOfValClgStk`)

Header [E8]: "Method of valuation of closing stock employed in the previous year (If applicable, fill all serial nos in red, since blank will be treated as zeroes)".

| Sl | Cell | Field | Type | Schema key | Rule |
|----|------|-------|------|-----------|------|
| 4a | L9 | Raw Material (if at cost or market rates whichever is less write 1, if at cost write 2, if at market rate write 3) | dropdown (enum 1,2,3) | `MethodOfValClgStk.ValRawMaterial` | mandatory in object |
| 4b | L10 | Finished goods (if at cost or market rates whichever is less write 1, if at cost write 2, if at market rate write 3) | dropdown (enum 1,2,3) | `MethodOfValClgStk.ValFinishedGoods` | mandatory in object |
| 4c | L11 | Is there any change in stock valuation method | dropdown Yes/No | `MethodOfValClgStk.ChngStockValMetFlg` (enum N,Y) | mandatory in object |
| 4d | L12 | Increase in the profit or decrease in loss because of deviation, if any, from the method of valuation specified under section 145A | integer | `MethodOfValClgStk.EffectOnPL` | mandatory in object |
| 4e | L13 | Decrease in the profit or increase in loss because of deviation, if any, from the method of valuation specified under section 145A | integer | `MethodOfValClgStk.DecProOrIncLossUs145_A` | mandatory in object |

### 5 Amounts not credited to the profit and loss account (`NoCredToPLAmt`)

Header [E14]: "Amounts not credited to the profit and loss account, being".

| Sl | Cell | Field | Type | Schema key | Rule |
|----|------|-------|------|-----------|------|
| 5a | J15 | the items falling within the scope of section 28 | integer | `NoCredToPLAmt.Section28Items` | |
| 5b | J16 | The proforma credits, drawbacks, refund of duty of customs or excise or service tax, or refund of sales tax or value added tax, or refund of GST, where such credits, drawbacks or refunds are admitted as due by the authorities concerned | integer | `NoCredToPLAmt.ProformaCreditsDue` | |
| 5c | J17 | escalation claims accepted during the previous year | integer | `NoCredToPLAmt.PrevYrEscalClaim` | |
| 5d | J18 | Any other item of income | integer | `NoCredToPLAmt.OthItemInc` | |
| 5e | J19 | Capital receipt, if any | integer | `NoCredToPLAmt.CapReceipt` | |
| 5f | L20 | Total of amounts not credited to profit and loss account (5a+5b+5c+5d+5e) | integer (computed) | `NoCredToPLAmt.TotNoCredToPLAmt` | L20 = SUM(J15:J19); 5a+5b+5c+5d+5e = 5f (rule 182) |

### 6 Amounts debited to P&L disallowable under section 36 (`AmtDisallUs36`)

Header [E21]: "Amounts debited to the profit and loss account, to the extent disallowable under section 36 due to non-fulfilment of condition specified in relevant clauses-".

| Sl | Cell | Field | Type | Schema key |
|----|------|-------|------|-----------|
| 6a | J22 | Premium paid for insurance against risk of damage or destruction of stocks or store [36(1)(i)] | integer | `AmtDisallUs36.StkInsurPrem` |
| 6b | J23 | Premium paid for insurance on the health of employees [36(1)(ib)] | integer | `AmtDisallUs36.EmpHealthInsurPrem` |
| 6c | J24 | Any sum paid to an employee as bonus or commission for services rendered, where such sum was otherwise payable to him as profits or dividend [36(1)(ii)] | integer | `AmtDisallUs36.EmpBonusCommSum` |
| 6d | J25 | Any amount of interest paid in respect of borrowed capital [36(1)(iii)] | integer | `AmtDisallUs36.IntOnBorrCap` |
| 6e | J26 | Amount of discount on a zero-coupon bond [36(1)(iiia)] | integer | `AmtDisallUs36.ZeroCoupBondDisc` |
| 6f | J27 | Amount of contributions to a recognised provident fund [36(1)(iv)] | integer | `AmtDisallUs36.RecogPFContribAmt` |
| 6g | J28 | Amount of contributions to an approved superannuation fund [36(1)(iv)] | integer | `AmtDisallUs36.AppSuperAnnFundAmt` |
| 6h | J29 | Amount of contribution to a pension scheme referred to in section 80CCD [36(1)(iva)] | integer | `AmtDisallUs36.PensionSchemeSec80CCD` |
| 6i | J30 | Amount of contributions to an approved gratuity fund [36(1)(v)] | integer | `AmtDisallUs36.AppGratFundAmt` |
| 6j | J31 | Amount of contributions to any other fund | integer | `AmtDisallUs36.OthFundAmt` |
| 6k | J32 | Any sum received from employees as contribution to any provident fund or superannuation fund or any fund set up under ESI Act or any other fund for the welfare of employees to the extent not credited to the employees account on or before the due date [36(1)(va)] | integer | `AmtDisallUs36.EmpContributionCredits` |
| 6l | J33 | Amount of bad and doubtful debts [36(1)(vii)] | integer | `AmtDisallUs36.BadDebtDoubtAmt` |
| 6m | J34 | Provision for bad and doubtful debts [36(1)(viia)] | integer | `AmtDisallUs36.BadDebtDoubtProvn` |
| 6n | J35 | Amount transferred to any special reserve [36(1)(viii)] | integer | `AmtDisallUs36.SpecResrvTranfr` |
| 6o | J36 | Expenditure for the purposes of promoting family planning amongst employees [36(1)(ix)] | integer | `AmtDisallUs36.FamPlanPromoExp` |
| 6p | J37 | Amount of securities transaction paid in respect of transaction in securities if such income is not included in business income [36(1)(xv)] | integer | `AmtDisallUs36.SecuritiesPaidAmt` |
| 6q | J38 | Marked to market loss or other expected loss as computed in accordance with the ICDS notified u/s 145(2) [36(1)(xviii)] | integer | `AmtDisallUs36.MrktLossOthExpLossICDS` |
| 6r | J39 | Expenditure for purchase of sugarcane in excess of the government approved price [36(1)(xvii)] | integer | `AmtDisallUs36.ExpGovtApprovedSugarPrice` |
| 6s | J40 | Any other disallowance | integer | `AmtDisallUs36.AnyOthDisallowance` |
| 6t | L41 | Total amount disallowable under section 36 (total of 6a to 6s) | integer (computed) | `AmtDisallUs36.TotAmtDisallUs36` |

**6u Total number of employees employed** (`AmtDisallUs36.NoOfEmployeesEmployed`) — [E42]/[F42]: "Total number of employees employed (mandatory in case the assessee has recognized Provident Fund)". Sub-object (optional):

| Sl | Cell | Field | Type | Schema key |
|----|------|-------|------|-----------|
| i | J43 | Deployed in India | integer | `AmtDisallUs36.NoOfEmployeesEmployed.DeployedInIndia` |
| ii | J44 | Deployed outside India | integer | `AmtDisallUs36.NoOfEmployeesEmployed.DeployedOutSideIndia` |
| iii | J45 | Total Deployed (i) + (ii) | integer (computed) | `AmtDisallUs36.NoOfEmployeesEmployed.Total` |

### 7 Amounts debited to P&L disallowable under section 37 (`AmtDisallUs37`)

Header [E46]: "Amounts debited to the profit and loss account, to the extent disallowable under section 37".

| Sl | Cell | Field | Type | Schema key |
|----|------|-------|------|-----------|
| 7a | J47 | Expenditure of capital nature [37(1)] | integer | `AmtDisallUs37.CapitalNatureExp` |
| 7b | J48 | Expenditure of personal nature [37(1)] | integer | `AmtDisallUs37.PersonalExp` |
| 7c | J49 | Expenditure laid out or expended wholly and exclusively NOT for the purpose of business or profession [37(1)] | integer | `AmtDisallUs37.BusOrProfessnExp` |
| 7d | J50 | Expenditure on advertisement in any souvenir, brochure, tract, pamphlet or the like, published by a political party [37(2B)] | integer | `AmtDisallUs37.PoliticPartyExp` |
| 7e | J51 | Expenditure by way of penalty or fine for violation of any law for the time being in force | integer | `AmtDisallUs37.LawVoilatPenalExp` |
| 7f | J52 | Any other penalty or fine; | integer | `AmtDisallUs37.OthPenalFineExp` |
| 7g | J53 | Expenditure incurred for any purpose which is an offence or which is prohibited by law; | integer | `AmtDisallUs37.OffenceExp` |
| 7h | J54 | Amount of any liability of a contingent nature | integer | `AmtDisallUs37.ContigentLiability` |
| 7i | J55 | Any other amount not allowable under section 37 | integer | `AmtDisallUs37.OthAmtNotAllowUs37` |
| 7j | L56 | Total amount disallowable under section 37(total of 7a to 7i) | integer (computed) | `AmtDisallUs37.TotAmtDisallUs37` |

### 8 Amounts disallowable under section 40 (`AmtDisallUs40`)

**8A** [E57]/[F57]: "Amounts debited to the profit and loss account, to the extent disallowable under section 40".

| Sl | Cell | Field | Type | Schema key |
|----|------|-------|------|-----------|
| 8A.a (Aa) | J58 | Amount disallowable under section 40 (a)(i), on account of non-compliance with the provisions of Chapter XVII-B | integer | `AmtDisallUs40.NonCompChapXVIIBAmt` |
| 8A.b (Ab) | J59 | Amount disallowable under section 40(a)(ia) on account of non-compliance with the provisions of Chapter XVII-B | integer | `AmtDisallUs40.NonComp40aiiChapXVIIBAmt` |
| 8A.c (Ac) | J60 | Amount disallowable under section 40 (a)(ib), on account of non-compliance with the provisions of Chapter VIII of the Finance Act, 2016 | integer | `AmtDisallUs40.NonComp40aibChapXVIIBAmt` |
| 8A.d (Ad) | J61 | Amount disallowable under section 40(a)(iii) on account of non-compliance with the provisions of Chapter XVII-B | integer | `AmtDisallUs40.NonComp40aiiiChapXVIIBAmt` |
| 8A.e (Ae) | J62 | Amount of tax or rate levied or assessed on the basis of profits [40(a)(ii)] | integer | `AmtDisallUs40.TaxAmtOnProfits` |
| 8A.f (Af) | J63 | Amount paid as wealth tax [40(a)(iia)] | integer | `AmtDisallUs40.WTAmt` |
| 8A.g (Ag) | J64 | Amount paid by way of royalty, license fee, service fee etc. as per section 40(a)(iib) | integer | `AmtDisallUs40.RolyatyOrServiceFee` |
| 8A.h (Ah) | J65 | Amount of interest, salary, bonus, commission or remuneration paid to any partner or member [40(b)] | integer | `AmtDisallUs40.IntSalBonPartner` |
| 8A.i (Ai) | J66 | Any other disallowance | integer | `AmtDisallUs40.AnyOthDisallowance` |
| 8A.j (Aj) | L67 | Total amount disallowable under section 40(total of Aa to Ai) | integer (computed) | `AmtDisallUs40.TotAmtDisallUs40` |
| 8B | K68 | Any amount disallowed under section 40 in any preceding previous year but allowable during the previous year | integer | `AmtDisallUs40.AnyAmtOfSec40AllowPrevYr` |

### 9 Amounts disallowable under section 40A (`AmtDisallUs40A`)

Header [E69]: "Amounts debited to the profit and loss account, to the extent disallowable under section 40A".

| Sl | Cell | Field | Type | Schema key |
|----|------|-------|------|-----------|
| 9a | J70 | Amounts paid to persons specified in section 40A(2)(b) | integer | `AmtDisallUs40A.AmtPaidUs40A2b` |
| 9b | J71 | Amount paid, otherwise than by account payee cheque or account payee bank draft or use of electronic clearing system through a bank account, or through such electronic mode as may be prescribed disallowable under section 40A(3) | integer | `AmtDisallUs40A.AmtGT20kCash` |
| 9c | J72 | Provision for payment of gratuity [40A(7)] | integer | `AmtDisallUs40A.ProvPmtGrat` |
| 9d | J73 | any sum paid by the assessee as an employer for setting up or as contribution to any fund, trust, company, AOP, or BOI or society or any other institution [40A(9)] | integer | `AmtDisallUs40A.ContToSetupTrust` |
| 9e | J74 | Marked to market loss or other expected loss except as allowable u/s 36(1)(xviii) [40A(13)] | integer | **no schema leaf** (see gaps) |
| 9f | J75 | Any other disallowance | integer | `AmtDisallUs40A.AnyOthDisallowance` |
| 9g | L76 | Total amount disallowable under section 40A (total of 9a to 9f) | integer (computed) | `AmtDisallUs40A.TotAmtDisallUs40A` |

### 10 Amount disallowed u/s 43B in a preceding year, now allowable (`AmtDisallUs43BPyNowAll.AmtUs43B`)

Header [E77]: "Any amount disallowed under section 43B in any preceding previous year but allowable during the previous year".

| Sl | Cell | Field | Type | Schema key |
|----|------|-------|------|-----------|
| 10a | J78 | Any sum in the nature of tax, duty, cess or fee under any law | integer | `AmtDisallUs43BPyNowAll.AmtUs43B.TaxDutyCesAmt` |
| 10b | J79 | Any sum payable by way of contribution to any provident fund or superannuation fund or gratuity fund or any other fund for the welfare of employees | integer | `AmtDisallUs43BPyNowAll.AmtUs43B.ContToEmpPFSFGF` |
| 10c | J80 | Any sum payable to an employee as bonus or commission for services rendered | integer | `AmtDisallUs43BPyNowAll.AmtUs43B.EmpBonusComm` |
| 10d | J81 | Any sum payable as interest on any loan or borrowing from any public financial institution or a State financial corporation or a State Industrial investment corporation | integer | `AmtDisallUs43BPyNowAll.AmtUs43B.IntPayaleToFI` |
| 10da | J82 | Any sum payable as interest on any loan or borrowing from such class of non-banking financial companies as may be notified by the Central Government | integer | `AmtDisallUs43BPyNowAll.AmtUs43B.SumPayaleLoanBrToFinComp` |
| 10e | J83 | Any sum payable as interest on any loan or borrowing from any scheduled bank or a co-operative bank other than a primary agricultural credit society or a primary co-operative agricultural and rural development bank | integer | `AmtDisallUs43BPyNowAll.AmtUs43B.IntPayaleToFISchBank` |
| 10f | J84 | Any sum payable towards leave encashment | integer | `AmtDisallUs43BPyNowAll.AmtUs43B.LeaveEncashPayable` |
| 10g | J85 | Any sum payable to the Indian Railways for the use of railway assets | integer (optional) | `AmtDisallUs43BPyNowAll.AmtUs43B.RailwayAsstsPyble` |
| 10h | J86 | Any sum payable to a micro or small enterprise beyond the time limit specified in section 15 of the Micro, Small and Medium Enterprises Development Act, 2006 | integer (optional) | `AmtDisallUs43BPyNowAll.AmtUs43B.MSEPayable` |
| 10i | L87 | Total amount allowable under section 43B (total of 10a to 10h) | integer (computed) | `AmtDisallUs43BPyNowAll.AmtUs43B.TotAmtUs43b` |

### 11 Amount debited to P&L but disallowable u/s 43B (`AmtDisall43B.AmtUs43B`)

Header [E88]: "Any amount debited to profit and loss account of the previous year but disallowable under section 43B:-".

| Sl | Cell | Field | Type | Schema key |
|----|------|-------|------|-----------|
| 11a | J89 | Any sum in the nature of tax, duty, cess or fee under any law | integer | `AmtDisall43B.AmtUs43B.TaxDutyCesAmt` |
| 11b | J90 | Any sum payable by way of contribution to any provident fund or superannuation fund or gratuity fund or any other fund for the welfare of employees | integer | `AmtDisall43B.AmtUs43B.ContToEmpPFSFGF` |
| 11c | J91 | Any sum payable to an employee as bonus or commission for services rendered | integer | `AmtDisall43B.AmtUs43B.EmpBonusComm` |
| 11d | J92 | Any sum payable as interest on any loan or borrowing from any public financial institution or a State financial corporation or a State Industrial investment corporation | integer | `AmtDisall43B.AmtUs43B.IntPayaleToFI` |
| 11da | J93 | Any sum payable as interest on any loan or borrowing from such class of non-banking financial companies as may be notified by the Central Government, in accordance with the terms and conditions of the agreement governing such loan or borrowing | integer | `AmtDisall43B.AmtUs43B.SumPayaleLoanBrToFinComp` |
| 11e | J94 | Any sum payable as interest on any loan or borrowing from any scheduled bank or a co-operative bank other than a primary agricultural credit society or a primary co-operative agricultural and rural development bank | integer | `AmtDisall43B.AmtUs43B.IntPayaleToFISchBank` |
| 11f | J95 | Any sum payable towards leave encashment | integer | `AmtDisall43B.AmtUs43B.LeaveEncashPayable` |
| 11g | J96 | Any sum payable to the Indian Railways for the use of railway assets | integer (optional) | `AmtDisall43B.AmtUs43B.RailwayAsstsPyble` |
| 11h | J97 | Any sum payable to a micro or small enterprise beyond the time limit specified in section 15 of the Micro, Small and Medium Enterprises Development Act, 2006 | integer (optional) | `AmtDisall43B.AmtUs43B.MSEPayable` |
| 11i | L98 | Total amount disallowable under Section 43B(total of 11a to 11h) | integer (computed) | `AmtDisall43B.AmtUs43B.TotAmtUs43b` |

### 12 Amount of credit outstanding in the accounts (`AmtExciseCustomsVATOutstanding.ExciseCustomsVAT`)

Header [E99]: "Amount of credit outstanding in the accounts in respect of".

| Sl | Cell | Field | Type | Schema key |
|----|------|-------|------|-----------|
| 12a | J100 | Union Excise Duty | integer | `AmtExciseCustomsVATOutstanding.ExciseCustomsVAT.UnionExciseDuty` |
| 12b | J101 | Service tax | integer | `AmtExciseCustomsVATOutstanding.ExciseCustomsVAT.ServiceTax` |
| 12c | J102 | VAT/sales tax | integer | `AmtExciseCustomsVATOutstanding.ExciseCustomsVAT.VATorSaleTax` |
| 12d | J103 | Central Goods & Service Tax (CGST) | integer | `AmtExciseCustomsVATOutstanding.ExciseCustomsVAT.CentralGoodServiceTax` |
| 12e | J104 | State Goods & Services Tax (SGST) | integer | `AmtExciseCustomsVATOutstanding.ExciseCustomsVAT.StateGoodServiceTax` |
| 12f | J105 | Integrated Goods & Services Tax (IGST) | integer | `AmtExciseCustomsVATOutstanding.ExciseCustomsVAT.IntegratedGoodServiceTax` |
| 12g | J106 | Union Territory Goods & Services Tax (UTGST) | integer | `AmtExciseCustomsVATOutstanding.ExciseCustomsVAT.UnionTerrGoodServiceTax` |
| 12h | J107 | Any other tax | integer | `AmtExciseCustomsVATOutstanding.ExciseCustomsVAT.OthDutyTaxCess` |
| 12i | L108 | Total amount outstanding (total of 12a to 12h) | integer (computed) | `AmtExciseCustomsVATOutstanding.ExciseCustomsVAT.TotExciseCustomsVAT` |

### 13 Amounts deemed to be profits and gains u/s 33AB / 33ABA / 33AC

Header [E109]: "Amounts deemed to be profits and gains under section 33AB or 33ABA or 33 AC (13a + 13b +13c)".

| Sl | Cell | Field | Type | Schema key |
|----|------|-------|------|-----------|
| 13 (total) | L109 | Amounts deemed to be profits and gains (13a+13b+13c) | integer (computed) | `DeemedProfUs33ABs` |
| 13a | L110 | 33AB | integer (optional) | `DeemedProfUs33AB` |
| 13b | L111 | 33ABA | integer (optional) | `DeemedProfUs33ABA` |
| 13c | L112 | 33AC | integer (optional) | `DeemedProfUs33AC` |

### 14–17 Single-figure disclosures

| Sl | Cell | Field | Type | Schema key | Rule |
|----|------|-------|------|-----------|------|
| 14 | L113 | Any amount of profit chargeable to tax under section 41 | integer | `ProfTaxAmtUs41` | mandatory |
| 15 | L114 | Amount of income or expenditure of prior period credited or debited to the profit and loss account (net) | integer (may be negative) | `PriorAmtIncCrDrPL` | mandatory; minimum -99999999999999 |
| 16 | L115 | Amount of expenditure disallowed u/s 14A | integer | `AmountOfExpDisAllwUs14A` | mandatory |
| 16A | L116 | Interest disallowable under section 23 of the Micro, Small and Medium Enterprises Development Act, 2006 | integer (optional) | `InterestDisAllowUs23SMEAct` | |
| 17 | L117 | Whether assessee is exercising option under subsection 2A of section 92CE ? [If yes , please fill schedule TPSA] | dropdown Yes/No | `ScheduleTPSAFlg` (string) | mandatory; if Yes → Schedule TPSA must be filled (rules 190/271) |

## The rules the sheet computes (with cell references)

- **3a auto-populate:** `L6 = ICDS.Total` — pulled from Schedule ICDS; must equal column XI(3) of Schedule ICDS (rule 180).
- **3b auto-populate:** `L7 = ICDS.DeTotal1` — pulled from Schedule ICDS; must equal column XI(4) of Schedule ICDS (rule 181).
- **5f total:** `L20 = SUM(J15:J19)` — 5a+5b+5c+5d+5e = 5f (rule 182).
- **6t total:** `L41 = SUM(J22:J40)` — sum of 6a to 6s = 6t (rule 183).
- **6u.iii total deployed:** `J45 = SUM(J43:J44)` — (i)+(ii).
- **7j total:** `L56 = SUM(J47:J55)` — 7a to 7i = 7j (rule 184).
- **8A.j total:** `L67 = SUM(J58:J66)` — Aa to Ai = 8Aj (rule 185).
- **9g total:** `L76 = SUM(J70:J75)` — 9a to 9f = 9g (rule 186).
- **10i total:** `L87 = SUM(J78:J86)` — 10a to 10h (rule 187).
- **11i total:** `L98 = SUM(J89:J97)` — 11a to 11h (rule 188).
- **12i total:** `L108 = SUM(J100:J107)` — 12a to 12h (rule 189).
- **13 total:** `L109 = SUM(L110:L112)` — 13a+13b+13c.

Cross-schedule consistency rules (Schedule BP feeds off this sheet):
- BP field A14 = 6t of Part A-OI (rule 218).
- BP field A17 = 9g of Part A-OI (rule 221).
- BP field A30 = 10i of Part A-OI (rule 228).
- BP Sl.No.19 = Sl.No.17 (92CE flag) of Part A-OI (rule 271); BP Sl.No.23 = min of sum of 5a to 5d of Part A-OI (rule 270).
- If Sl.No.17 = "Yes" then Schedule TPSA must be filled (rule 190).

## Dropdowns (every value)

- **L4 Method of accounting** — source `"(Select),Mercantile,Cash"`: `(Select)`, `Mercantile`, `Cash`. → schema enum MERC, CASH.
- **L5 & L11 Yes/No** — source `"(Select),Yes,No"`: `(Select)`, `Yes`, `No`. → schema enum N, Y.
- **L9 Raw Material valuation** — source `"(Select),1) Cost or market rate whichever is less.,  2) At cost., 3) At market rate."`: `(Select)`, `1) Cost or market rate whichever is less.`, `2) At cost.`, `3) At market rate.` → schema enum 1, 2, 3.
- **L10 Finished goods valuation** — source `"(Select),1) Cost or market rate whichever is less., 2) At cost., 3) At market rate."`: `(Select)`, `1) Cost or market rate whichever is less.`, `2) At cost.`, `3) At market rate.` → schema enum 1, 2, 3.
- **L117 92CE option** — source `"(Select),Yes,No"`: `(Select)`, `Yes`, `No`.

(The remaining "dropdowns" reported by the dumper for the J/L amount cells have source `0` or `-99999999999999` with no value list — these are numeric input constraints, not choice lists.)

## What repeats and what is one figure

Nothing repeats. There is not a single add-a-row / table-with-rows construct in this sheet. Every field is one figure (single instance). The apparent "lists" (4a–4e, 5a–5f, 6a–6u, 7a–7j, 8A a–j, 9a–9g, 10a–10i, 11a–11i, 12a–12i, 13a–13c and the 3-line 6u employee count) are fixed, named sub-fields of fixed sub-objects — not repeats. Schema confirms: no arrays anywhere in `PARTA_OI`.

## Mandatory (from schema `required`)

The whole schedule is mandatory if the assessee is liable for audit under section 44AB (header [F3]). Top-level required keys:
`MethodOfAcct`, `ChangeInAcctMethFlg`, `ProfDeviatDueAcctMeth`, `DecProOrIncLossUs145_2`, `NoCredToPLAmt`, `AmtDisallUs36`, `AmtDisallUs37`, `AmtDisallUs40`, `AmtDisallUs40A`, `AmtDisallUs43BPyNowAll`, `AmtDisall43B`, `AmtExciseCustomsVATOutstanding`, `DeemedProfUs33ABs`, `ProfTaxAmtUs41`, `PriorAmtIncCrDrPL`, `AmountOfExpDisAllwUs14A`, `ScheduleTPSAFlg`.

Required within objects: `MethodOfValClgStk` (whole object optional, but if present all five leaves required); `NoCredToPLAmt` all six leaves required; `AmtDisallUs36` all leaves required except the whole `NoOfEmployeesEmployed` sub-object (optional — but "mandatory in case the assessee has recognized Provident Fund" per [F42], and if present all three of its leaves are required); `AmtDisallUs37`, `AmtDisallUs40`, `AmtDisallUs40A` all leaves required; `AmtDisallUs43BPyNowAll.AmtUs43B` and `AmtDisall43B.AmtUs43B` — all leaves required **except** `RailwayAsstsPyble` and `MSEPayable` (optional, i.e. 10g/10h and 11g/11h); `AmtExciseCustomsVATOutstanding.ExciseCustomsVAT` all leaves required. `DeemedProfUs33ABs` required; its three components `DeemedProfUs33AB` / `DeemedProfUs33ABA` / `DeemedProfUs33AC` are optional. `InterestDisAllowUs23SMEAct` optional.

## Hidden rows — not built

None. No row in this sheet is marked hidden (H). All rows 3–117 are visible.

## What this means for the build

- Build one flat, non-repeating panel. Column J takes the user's numeric inputs; column L (and J45) carries the computed sub-totals — do not let the user type into the total cells (5f/L20, 6t/L41, iii/J45, 7j/L56, 8Aj/L67, 9g/L76, 10i/L87, 11i/L98, 12i/L108, 13/L109); compute them from the SUM ranges above.
- 3a (L6) and 3b (L7) are read-only, populated from Schedule ICDS (`ICDS.Total`, `ICDS.DeTotal1`); do not accept manual entry, and enforce equality with ICDS column XI(3)/XI(4).
- Five dropdowns only: L4 (method), L5 & L11 (Yes/No), L9 & L10 (stock valuation 1/2/3), L117 (92CE Yes/No). Map their display strings to schema enums (MERC/CASH, N/Y, 1/2/3). All other cells are plain integers.
- On export, wire the four cross-schedule links so Schedule BP stays consistent: A14=6t, A17=9g, A30=10i, BP Sl.19 = 92CE flag. If L117="Yes", require Schedule TPSA.
- Sub-objects must be emitted with their exact nesting: `AmtDisallUs36.NoOfEmployeesEmployed`, `AmtDisallUs43BPyNowAll.AmtUs43B`, `AmtDisall43B.AmtUs43B`, `AmtExciseCustomsVATOutstanding.ExciseCustomsVAT`.
- `PriorAmtIncCrDrPL` (item 15) is the only field that may be negative (minimum -99999999999999); all others have minimum 0.
- **Schema gap to watch:** row 9e (J74, "Marked to market loss or other expected loss ... [40A(13)]") has no dedicated leaf in `AmtDisallUs40A` (schema has AmtPaidUs40A2b, AmtGT20kCash, ProvPmtGrat, ContToSetupTrust, AnyOthDisallowance, TotAmtDisallUs40A — six keys for seven visible lines). The form builder must decide where 9e's amount goes on export (it still contributes to the 9g SUM(J70:J75) on the sheet). Flagged for the form-builder / schema owner.
