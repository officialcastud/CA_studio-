# Part A - OI — Other Information (ITR-3)

Schema block: `PARTA_OI`. Sheet name: **Part A - OI**.

## The shape
Part A-OI ("OTHER INFORMATION") is the tax-audit annexure of the business/profession head: a single, non-repeating block of scalar figures reporting the method of accounting, closing-stock valuation, ICDS deviations, and every category of amount not credited to / debited to the profit and loss account that the Act disallows (sections 36, 37, 40, 40A, 43B), amounts deemed to be profits (33AB/33ABA/41), prior-period items, section 14A and MSMED-interest disallowances, and the section 92CE(2A) option flag. It is **mandatory if the assessee is liable to audit under section 44AB**, otherwise filled if applicable. Every figure is one value (no arrays); many feed Schedule BP. It is an ITR-3-only sheet — there is no ITR-2 counterpart.

## The items

### Method of accounting, ICDS and stock valuation (items 3–4)
| Sl. No. | Field label | Type | Schema key | Rule / notes |
|---|---|---|---|---|
| — (row 4) | Method of accounting employed in the previous year | dropdown | `MethodOfAcct` | enum MERC/CASH; dropdown Mercantile / Cash |
| — (row 5) | Is there any change in method of accounting | dropdown | `ChangeInAcctMethFlg` | enum N/Y; dropdown Yes / No |
| 3a | Increase in the profit or decrease in loss because of deviation, if any, as per Income Computation Disclosure Standards notified under section 145(2) | integer | `ProfDeviatDueAcctMeth` | auto: L6 = ICDS.Total (cross-sheet) |
| 3b | Decrease in the profit or increase in loss because of deviation, if any, as per Income Computation Disclosure Standards notified under section 145(2) | integer | `DecProOrIncLossUs145_2` | auto: L7 = ICDS.DeTotal1 (cross-sheet) |
| — (row 8) | Method of valuation of closing stock employed in the previous year | heading | `MethodOfValClgStk` (object) | — |
| 4a | Raw Material (if at cost or market rates whichever is less write 1, if at cost write 2, if at market rate write 3) | dropdown | `MethodOfValClgStk.ValRawMaterial` | enum 1/2/3 |
| 4b | Finished goods (if at cost or market rates whichever is less write 1, if at cost write 2, if at market rate write 3) | dropdown | `MethodOfValClgStk.ValFinishedGoods` | enum 1/2/3 |
| 4c | Is there any change in stock valuation method | dropdown | `MethodOfValClgStk.ChngStockValMetFlg` | enum N/Y; dropdown Yes / No |
| 4d | Increase in the profit or decrease in loss because of deviation, if any, from the method of valuation | integer | `MethodOfValClgStk.EffectOnPL` | min 0 |
| 4e | Decrease in the profit or increase in loss because of deviation, if any, from the method of valuation | integer | `MethodOfValClgStk.DecProOrIncLossUs145_A` | min 0 |

### 5 — Amounts not credited to the profit and loss account, being
| Sl. No. | Field label | Type | Schema key | Rule / notes |
|---|---|---|---|---|
| 5a | the items falling within the scope of section 28 | integer | `NoCredToPLAmt.Section28Items` | min 0 |
| 5b | The proforma credits, drawbacks, refund of duty of customs or excise or service tax, or refund of sales tax or value added tax | integer | `NoCredToPLAmt.ProformaCreditsDue` | min 0 |
| 5c | Escalation claims accepted during the previous year | integer | `NoCredToPLAmt.PrevYrEscalClaim` | min 0 |
| 5d | Any other item of income | integer | `NoCredToPLAmt.OthItemInc` | min 0 |
| 5e | Capital receipt, if any | integer | `NoCredToPLAmt.CapReceipt` | min 0 |
| 5f | Total of amounts not credited to profit and loss account (5a+5b+5c+5d+5e) | integer | `NoCredToPLAmt.TotNoCredToPLAmt` | L20 = SUM(J15:J19) |

### 6 — Amounts debited to the P&L a/c, disallowable under section 36
| Sl. No. | Field label | Type | Schema key | Rule / notes |
|---|---|---|---|---|
| 6a | Premium paid for insurance against risk of damage or destruction of stocks or store [36(1)(i)] | integer | `AmtDisallUs36.StkInsurPrem` | min 0 |
| 6b | Premium paid for insurance on the health of employees [36(1)(ib)] | integer | `AmtDisallUs36.EmpHealthInsurPrem` | min 0 |
| 6c | Any sum paid to an employee as bonus or commission for services rendered, where such sum was otherwise payable to him as profits or dividend | integer | `AmtDisallUs36.EmpBonusCommSum` | min 0 |
| 6d | Any amount of interest paid in respect of borrowed capital [36(1)(iii)] | integer | `AmtDisallUs36.IntOnBorrCap` | min 0 |
| 6e | Amount of discount on a zero-coupon bond [36(1)(iiia)] | integer | `AmtDisallUs36.ZeroCoupBondDisc` | min 0 |
| 6f | Amount of contributions to a recognised provident fund [36(1)(iv)] | integer | `AmtDisallUs36.RecogPFContribAmt` | min 0 |
| 6g | Amount of contributions to an approved superannuation fund [36(1)(iv)] | integer | `AmtDisallUs36.AppSuperAnnFundAmt` | min 0 |
| 6h | Amount of contribution to a pension scheme referred to in section 80CCD [36(1)(iva)] | integer | `AmtDisallUs36.PensionSchemeSec80CCD` | min 0 |
| 6i | Amount of contributions to an approved gratuity fund [36(1)(v)] | integer | `AmtDisallUs36.AppGratFundAmt` | min 0 |
| 6j | Amount of contributions to any other fund | integer | `AmtDisallUs36.OthFundAmt` | min 0 |
| 6k | Any sum received from employees as contribution to any provident fund or superannuation fund or any fund set up under ESI Act [credited after due date] | integer | `AmtDisallUs36.EmpContributionCredits` | min 0 |
| 6l | Amount of bad and doubtful debts [36(1)(vii)] | integer | `AmtDisallUs36.BadDebtDoubtAmt` | min 0 |
| 6m | Provision for bad and doubtful debts [36(1)(viia)] | integer | `AmtDisallUs36.BadDebtDoubtProvn` | min 0 |
| 6n | Amount transferred to any special reserve [36(1)(viii)] | integer | `AmtDisallUs36.SpecResrvTranfr` | min 0 |
| 6o | Expenditure for the purposes of promoting family planning amongst employees [36(1)(ix)] | integer | `AmtDisallUs36.FamPlanPromoExp` | min 0 |
| 6p | Amount of securities transaction paid in respect of transaction in securities if such income is not included in business income | integer | `AmtDisallUs36.SecuritiesPaidAmt` | min 0 |
| 6q | Marked to market loss or other expected loss as computed in accordance with the ICDS notified u/s 145(2) | integer | `AmtDisallUs36.MrktLossOthExpLossICDS` | min 0 |
| 6r | Any other disallowance | integer | `AmtDisallUs36.OthDisallowances` | min 0 |
| 6s | Total amount disallowable under section 36 (total of 6a to 6r) | integer | `AmtDisallUs36.TotAmtDisallUs36` | L40 = SUM(J22:J39) |

### 7 — Amounts debited to the P&L a/c, disallowable under section 37
| Sl. No. | Field label | Type | Schema key | Rule / notes |
|---|---|---|---|---|
| 7a | Expenditure of capital nature [37(1)] | integer | `AmtDisallUs37.CapitalNatureExp` | min 0 |
| 7b | Expenditure of personal nature [37(1)] | integer | `AmtDisallUs37.PersonalExp` | min 0 |
| 7c | Expenditure laid out or expended wholly and exclusively NOT for the purpose of business or profession [37(1)] | integer | `AmtDisallUs37.BusOrProfessnExp` | min 0 |
| 7d | Expenditure on advertisement in any souvenir, brochure, tract, pamphlet or the like, published by a political party | integer | `AmtDisallUs37.PoliticPartyExp` | min 0 |
| 7e | Expenditure by way of penalty or fine for violation of any law for the time being in force | integer | `AmtDisallUs37.LawVoilatPenalExp` | min 0 |
| 7f | Any other penalty or fine | integer | `AmtDisallUs37.OthPenalFineExp` | min 0 |
| 7g | Expenditure incurred for any purpose which is an offence or which is prohibited by law | integer | `AmtDisallUs37.OffenceExp` | min 0 |
| 7h | Amount of any liability of a contingent nature | integer | `AmtDisallUs37.ContigentLiability` | min 0 |
| 7i | Any other amount not allowable under section 37 | integer | `AmtDisallUs37.OthAmtNotAllowUs37` | min 0 |
| 7j | Total amount disallowable under section 37 (total of 7a to 7i) | integer | `AmtDisallUs37.TotAmtDisallUs37` | L51 = SUM(J42:J50) |

### 8A — Amounts debited to the P&L a/c, disallowable under section 40; 8B — allowed now
| Sl. No. | Field label | Type | Schema key | Rule / notes |
|---|---|---|---|---|
| 8Aa | Amount disallowable under section 40 (a)(i), on account of non-compliance with the provisions of Chapter XVII-B | integer | `AmtDisallUs40.NonCompChapXVIIBAmt` | min 0 |
| 8Ab | Amount disallowable under section 40(a)(ia) on account of non-compliance with the provisions of Chapter XVII-B | integer | `AmtDisallUs40.NonComp40aiiChapXVIIBAmt` | min 0 |
| 8Ac | Amount disallowable under section 40 (a)(ib), on account of non-compliance with the provisions of Chapter XVII-B (equalisation levy) | integer | `AmtDisallUs40.NonComp40aibChapXVIIBAmt` | min 0 |
| 8Ad | Amount disallowable under section 40(a)(iii) on account of non-compliance with the provisions of Chapter XVII-B | integer | `AmtDisallUs40.NonComp40aiiiChapXVIIBAmt` | min 0 |
| 8Ae | Amount of tax or rate levied or assessed on the basis of profits [40(a)(ii)] | integer | `AmtDisallUs40.TaxAmtOnProfits` | min 0 |
| 8Af | Amount paid as wealth tax [40(a)(iia)] | integer | `AmtDisallUs40.WTAmt` | min 0 |
| 8Ag | Amount paid by way of royalty, license fee, service fee etc. as per section 40(a)(iib) | integer | `AmtDisallUs40.RolyatyOrServiceFee` | min 0 |
| 8Ah | Amount of interest, salary, bonus, commission or remuneration paid to any partner or member inadmissible under section 40(b)/40(ba) | integer | `AmtDisallUs40.IntSalBonPartner` | min 0 |
| 8Ai | Any other disallowance | integer | `AmtDisallUs40.OthDisallow` | min 0 |
| 8Aj | Total amount disallowable under section 40 (total of Aa to Ai) | integer | `AmtDisallUs40.TotAmtDisallUs40` | L62 = SUM(J53:J61) |
| 8B | Any amount disallowed under section 40 in any preceding previous year but allowable during the previous year | integer | `AmtDisallUs40.AmtDisallUs40PyNowAll` | feeds BP A29; = Sl.No.16 link |

### 9 — Amounts debited to the P&L a/c, disallowable under section 40A
| Sl. No. | Field label | Type | Schema key | Rule / notes |
|---|---|---|---|---|
| 9a | Amounts paid to persons specified in section 40A(2)(b) | integer | `AmtDisallUs40A.AmtPaidUs40A2b` | min 0 |
| 9b | Amount paid, otherwise than by account payee cheque or account payee bank draft or use of electronic clearing system, disallowable u/s 40A(3) | integer | `AmtDisallUs40A.AmtGT20kCash` | min 0 |
| 9c | Provision for payment of gratuity [40A(7)] | integer | `AmtDisallUs40A.ProvPmtGrat` | min 0 |
| 9d | any sum paid by the assessee as an employer for setting up or as contribution to any fund, trust, company, etc. [40A(9)] | integer | `AmtDisallUs40A.ContToSetupTrust` | min 0 |
| 9e | Any other disallowance | integer | `AmtDisallUs40A.OthDisallow` | min 0 |
| 9f | Total amount disallowable under section 40A (total of 9a to 9e) | integer | `AmtDisallUs40A.TotAmtDisallUs40A` | L70 = SUM(J65:J69) |

### 10 — Any amount disallowed under section 43B in any preceding year but allowable during the previous year
Object `AmtDisallUs43BPyNowAll.AmtUs43B`.
| Sl. No. | Field label | Type | Schema key | Rule / notes |
|---|---|---|---|---|
| 10a | Any sum in the nature of tax, duty, cess or fee under any law | integer | `AmtDisallUs43BPyNowAll.AmtUs43B.TaxDutyCesAmt` | min 0 |
| 10b | Any sum payable by way of contribution to any provident fund or superannuation fund or gratuity fund or any other fund for the welfare of employees | integer | `AmtDisallUs43BPyNowAll.AmtUs43B.ContToEmpPFSFGF` | min 0 |
| 10c | Any sum payable to an employee as bonus or commission for services rendered | integer | `AmtDisallUs43BPyNowAll.AmtUs43B.EmpBonusComm` | min 0 |
| 10d | Any sum payable as interest on any loan or borrowing from any public financial institution or a State financial corporation or a State industrial investment corporation | integer | `AmtDisallUs43BPyNowAll.AmtUs43B.IntPayaleToFI` | min 0 |
| 10da | Any sum payable as interest on any loan or borrowing from such class of non-banking financial company as notified | integer | `AmtDisallUs43BPyNowAll.AmtUs43B.SumPayaleLoanBrToFinComp` | min 0 |
| 10e | any sum payable by the assessee as interest on any loan or borrowing from a scheduled bank or a co-operative bank | integer | `AmtDisallUs43BPyNowAll.AmtUs43B.IntPayaleToFISchBank` | min 0 |
| 10f | Any sum payable towards leave encashment | integer | `AmtDisallUs43BPyNowAll.AmtUs43B.LeaveEncashPayable` | min 0 |
| 10g | Any sum payable to the Indian Railways for the use of railway assets | integer | `AmtDisallUs43BPyNowAll.AmtUs43B.RailwayAssetsPayable` | optional |
| 10h | Any sum payable to a micro or small enterprise beyond the time limit specified in section 15 of the MSMED Act | integer | `AmtDisallUs43BPyNowAll.AmtUs43B.MSEPayable` | optional |
| 10i | Total amount allowable under section 43B (total of 10a to 10h) | integer | `AmtDisallUs43BPyNowAll.AmtUs43B.TotAmtUs43b` | L81 = SUM(J72:J80) |

### 11 — Any amount debited to P&L a/c of the previous year but disallowable under section 43B
Object `AmtDisall43B.AmtUs43B`.
| Sl. No. | Field label | Type | Schema key | Rule / notes |
|---|---|---|---|---|
| 11a | Any sum in the nature of tax, duty, cess or fee under any law | integer | `AmtDisall43B.AmtUs43B.TaxDutyCesAmt` | min 0 |
| 11b | Any sum payable by way of contribution to any provident fund or superannuation fund or gratuity fund or any other fund for the welfare of employees | integer | `AmtDisall43B.AmtUs43B.ContToEmpPFSFGF` | min 0 |
| 11c | Any sum payable to an employee as bonus or commission for services rendered | integer | `AmtDisall43B.AmtUs43B.EmpBonusComm` | min 0 |
| 11d | Any sum payable as interest on any loan or borrowing from any public financial institution or a State financial corporation or a State industrial investment corporation | integer | `AmtDisall43B.AmtUs43B.IntPayaleToFI` | min 0 |
| 11d(a) | Any sum payable as interest on any loan or borrowing from such class of non-banking financial company as notified | integer | `AmtDisall43B.AmtUs43B.SumPayaleLoanBrToFinComp` | min 0 |
| 11e | any sum payable by the assessee as interest on any loan or borrowing from a scheduled bank or a co-operative bank | integer | `AmtDisall43B.AmtUs43B.IntPayaleToFISchBank` | min 0 |
| 11f | Any sum payable towards leave encashment | integer | `AmtDisall43B.AmtUs43B.LeaveEncashPayable` | min 0 |
| 11g | Any sum payable to the Indian Railways for the use of railway assets | integer | `AmtDisall43B.AmtUs43B.RailwayAssetsPayable` | optional |
| 11h | Any sum payable to a micro or small enterprise beyond the time limit specified in section 15 of the MSMED Act | integer | `AmtDisall43B.AmtUs43B.MSEPayable` | optional |
| 11i | Total amount disallowable under Section 43B (total of 11a to 11h) | integer | `AmtDisall43B.AmtUs43B.TotAmtUs43b` | L92 = SUM(J83:J91) |

### 12 — Amount of credit outstanding in the accounts in respect of
Object `AmtExciseCustomsVATOutstanding.ExciseCustomsVAT`.
| Sl. No. | Field label | Type | Schema key | Rule / notes |
|---|---|---|---|---|
| 12a | Union Excise Duty | integer | `AmtExciseCustomsVATOutstanding.ExciseCustomsVAT.UnionExciseDuty` | min 0 |
| 12b | Service tax | integer | `AmtExciseCustomsVATOutstanding.ExciseCustomsVAT.ServiceTax` | min 0 |
| 12c | VAT/sales tax | integer | `AmtExciseCustomsVATOutstanding.ExciseCustomsVAT.VATorSaleTax` | min 0 |
| — | Cess (no visible row; optional schema leaf) | integer | `AmtExciseCustomsVATOutstanding.ExciseCustomsVAT.Cess` | optional — no on-screen row |
| 12d | Central Goods & Service Tax (CGST) | integer | `AmtExciseCustomsVATOutstanding.ExciseCustomsVAT.CentralGoodServiceTax` | min 0 |
| 12e | State Goods & Services Tax (SGST) | integer | `AmtExciseCustomsVATOutstanding.ExciseCustomsVAT.StateGoodServiceTax` | min 0 |
| 12f | Integrated Goods & Services Tax (IGST) | integer | `AmtExciseCustomsVATOutstanding.ExciseCustomsVAT.IntegratedGoodServiceTax` | min 0 |
| 12g | Union Territory Goods & Services Tax (UTGST) | integer | `AmtExciseCustomsVATOutstanding.ExciseCustomsVAT.UnionTerrGoodServiceTax` | min 0 |
| 12h | Any other tax | integer | `AmtExciseCustomsVATOutstanding.ExciseCustomsVAT.OthDutyTaxCess` | min 0 |
| 12i | Total amount outstanding (total of 12a to 12h) | integer | `AmtExciseCustomsVATOutstanding.ExciseCustomsVAT.TotExciseCustomsVAT` | L102 = SUM(J94:J101) |

### 13–18 — Deemed profits, section 41, prior period, 14A, MSMED interest, 92CE
| Sl. No. | Field label | Type | Schema key | Rule / notes |
|---|---|---|---|---|
| 13 | Amounts deemed to be profits and gains under section 33AB or 33ABA (13a+13b) | integer | `DeemedProfUs33ABs` | L103 = MAX(0, L104+L105) |
| 13a | 33AB | integer | `DeemedProfUs33AB` | optional component |
| 13b | 33ABA | integer | `DeemedProfUs33ABA` | optional component |
| 14 | Any amount of profit chargeable to tax under section 41 | integer | `ProfTaxAmtUs41` | min 0; = Sl.No.16 link to BP 8b |
| 15 | Amount of income or expenditure of prior period credited or debited to the profit and loss account | integer | `PriorAmtIncCrDrPL` | = Sl.No.17 link to BP 19 |
| 16 | Amount of Expenditure disallowed u/s 14A | integer | `AmountOfExpDisAllwUs14A` | min 0 |
| 17 | Interest disallowable under section 23 of the Micro, Small and Medium Enterprises Development Act, 2006 | integer | `InterestDisAllowUs23SMEAct` | min 0 |
| 18 | Whether assessee is exercising option under subsection 2A of section 92CE [If yes, please fill schedule TPSA] | dropdown | `ScheduleTPSAFlg` | dropdown (Select) / Yes / No |

## The rules the sheet computes
- **L6** `= ICDS.Total` — item 3a auto-populated from Schedule ICDS total (cross-sheet).
- **L7** `= ICDS.DeTotal1` — item 3b auto-populated from Schedule ICDS decrease total (cross-sheet).
- **L20** `= SUM(J15:J19)` — 5f total of amounts not credited (5a+5b+5c+5d+5e).
- **L40** `= SUM(J22:J39)` — 6s total disallowable u/s 36 (6a to 6r).
- **L51** `= SUM(J42:J50)` — 7j total disallowable u/s 37 (7a to 7i).
- **L62** `= SUM(J53:J61)` — 8Aj total disallowable u/s 40 (8Aa to 8Ai).
- **L70** `= SUM(J65:J69)` — 9f total disallowable u/s 40A (9a to 9e).
- **L81** `= SUM(J72:J80)` — 10i total allowable u/s 43B (10a to 10h).
- **L92** `= SUM(J83:J91)` — 11i total disallowable u/s 43B (11a to 11h).
- **L102** `= SUM(J94:J101)` — 12i total credit outstanding (12a to 12h).
- **L103** `= MAX(0, L104+L105)` — item 13 deemed profits u/s 33AB/33ABA (13a+13b), floored at 0.
- Cross-schedule (from rules.json): 3a should equal field XI(3) and 3b field XI(4); 5f = 5a+5b+5c+5d+5e; each total (6s/7j/8Aj/9f/10i/11i/12i) equals the sum of its sub-rows; BP Sl.23 ≥ sum of 5a–5d; BP A29 = 8B; BP 30 = 10i; BP 8b = Sl.No.16 (item 14, section 41); BP 19 = Sl.No.17 (item 15, prior period); if item 18 (92CE 2A) = Yes then Schedule TPSA must be filled.

## Dropdowns
- **Method of accounting (L4, `Method_of_Acct`)**: `Mercantile`, `Cash`.
- **Change in method of accounting / change in stock valuation method (L5, L11, `PortugueseCode`)**: `(Select)`, `Yes`, `No`.
- **Raw material / Finished goods valuation (L9:L10, `Raw_Material`)**: `(Select)`, `1 - Cost or market rate , whichever is less`, `2 - At cost`, `3 - At Market rate`.
- **Option u/s 92CE(2A) (L112)**: `(Select)`, `Yes`, `No`.

## What repeats and what is one figure
Everything on this sheet is **one figure** — there are no arrays. The block is a flat set of scalar fields and nested single objects (`MethodOfValClgStk`, `NoCredToPLAmt`, `AmtDisallUs36`, `AmtDisallUs37`, `AmtDisallUs40`, `AmtDisallUs40A`, `AmtDisallUs43BPyNowAll.AmtUs43B`, `AmtDisall43B.AmtUs43B`, `AmtExciseCustomsVATOutstanding.ExciseCustomsVAT`). No row repeats; there is exactly one Part A-OI per return.

## Mandatory
Schema `required` keys under `PARTA_OI`: `MethodOfAcct`, `ChangeInAcctMethFlg`, `ProfDeviatDueAcctMeth`, `DecProOrIncLossUs145_2`, `NoCredToPLAmt`, `AmtDisallUs36`, `AmtDisallUs37`, `AmtDisallUs40`, `AmtDisallUs40A`, `AmtDisallUs43BPyNowAll`, `AmtDisall43B`, `AmtExciseCustomsVATOutstanding`, `DeemedProfUs33ABs`, `ProfTaxAmtUs41`, `PriorAmtIncCrDrPL`, `AmountOfExpDisAllwUs14A`, `InterestDisAllowUs23SMEAct`, `ScheduleTPSAFlg`.

Within objects, all leaves are required **except**: `RailwayAssetsPayable` and `MSEPayable` (in both `AmtDisallUs43BPyNowAll.AmtUs43B` and `AmtDisall43B.AmtUs43B`), `Cess` (in `ExciseCustomsVAT`), and the components `DeemedProfUs33AB` / `DeemedProfUs33ABA`. `MethodOfValClgStk` itself is an optional top-level object but its five leaves are required when present. The whole Part A-OI is mandatory when the assessee is liable to audit under section 44AB (heading text: "mandatory if liable for audit under section 44AB, for other fill, if applicable").

## Hidden rows — not built
- **Rows 109 and 110**: not emitted by `tools/dump.py` (no label text in the read columns; blank/spacer rows between item 16 "Amount of Expenditure disallowed u/s 14A" (row 108) and item 17 MSMED interest (row 111)). They carry no label and no schema key, so nothing is built for them.
- No row in this sheet is flagged `H` (hidden) by the dumper; all lettered/numbered rows above are visible and built. (Rule 1: a hidden row is never presented as an item.)

## What this means for the build
- One non-repeating section. Render every 5-decimal-free integer field as a rupee box with min 0 (except items 3a/3b/15 which are signed — schema has no minimum and the sheet default is `-99999999999999`).
- Items **3a and 3b** are computed/auto-populated from Schedule ICDS (`ICDS.Total`, `ICDS.DeTotal1`) — render green/untypeable and fed, matching the utility.
- All nine subtotal rows (5f, 6s, 7j, 8Aj, 9f, 10i, 11i, 12i) and item 13 are computed (`SUM`/`MAX`) — green, untypeable, driven by their sub-rows.
- Two structurally identical 43B blocks (`AmtDisallUs43BPyNowAll` = item 10 "preceding year now allowable"; `AmtDisall43B` = item 11 "this year disallowable"), each nested under an `AmtUs43B` object with the same ten leaves — do not merge them.
- `Cess` under `ExciseCustomsVAT` has no on-screen row; keep it optional (omit unless a value exists). `RailwayAssetsPayable` / `MSEPayable` (10g/10h, 11g/11h) are optional leaves though they have visible rows.
- Feeds to Schedule BP: 8B → BP A29; 10i → BP 30; item 14 (section 41) → BP 8b; item 15 (prior period) → BP 19; 5a–5d → BP Sl.23. Wire the compute order so Part A-OI totals are available before BP consumes them.
- Item 18 (`ScheduleTPSAFlg`) = "Yes" must gate Schedule TPSA (rule at rules.json line 4425).


## Additional visible rows — verbatim from the sheet (completeness)
Rows present on the utility sheet and captured here verbatim so every visible label is in the book:

- VAT/sales tax
- Any other tax
