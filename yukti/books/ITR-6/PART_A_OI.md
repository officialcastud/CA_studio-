# The book of Part A — OI (Other Information) · ITR-6, A.Y. 2026-27

Read row by row from the utility's **PART - A OI** sheet (129 rows) and confirmed
against the CBDT ITR-6 schema's `PARTA_OI`. Nothing here is invented; every item
number, label, dropdown value and rule is the department's own.

---

## 1 · Why this sheet exists

Part A – OI is the tax-audit disclosure block. Its heading: *Other Information —
mandatory if liable for audit under section 44AB; for others, fill if
applicable.* It restates the accounts in tax terms — the method of accounting and
of stock valuation and any ICDS deviation, amounts not credited to the P&L, and
the long lists of amounts debited to the P&L that are **disallowable** under
sections 36, 37, 40, 40A and 43B — so the return can adjust book profit to
taxable profit in Schedule BP. Every total on this sheet feeds a corresponding
add-back in BP.

---

## 2 · The shape — eighteen items

| Item | What it is | Kind |
|---|---|---|
| **1** | Method of accounting | dropdown |
| **2** | Change in method of accounting | dropdown + ICDS effect (3a/3b) |
| **4** | Method of valuation of closing stock (4a–4e) | dropdowns + figures |
| **5** | Amounts not credited to the P&L (5a–5f) | figures + total |
| **6** | Amounts disallowable under section 36 (6a–6s) + employees (6t) | figures + totals |
| **7** | Amounts disallowable under section 37 (7a–7k) | figures + total |
| **8A / 8B** | Amounts disallowable under section 40 (8Aa–8Aj); 8B allowable this year | figures + total |
| **9** | Amounts disallowable under section 40A (9a–9f) | figures + total |
| **10** | Section 43B — disallowed earlier, allowable this year (10a–10i) | figures + total |
| **11** | Section 43B — debited this year, disallowable (11a–11i) | figures + total |
| **12** | Credit outstanding in the accounts (12a–12i) | figures + total |
| **13** | Amounts deemed profits under 33AB/33ABA/33AC (13a–13c) | figures + total |
| **14–17** | Profit u/s 41, prior-period item, 14A, MSME interest u/s 23 | figures |
| **18** | Option under section 92CE(2A) | dropdown |

---

## 3 · Items 1 to 4 — accounting and stock valuation

| Item | Label (verbatim) | Type / enum | Schema key | Hidden? |
|---|---|---|---|---|
| **1** | Method of accounting employed in the previous year | enum: (Select)/Mercantile/Cash | `MethodOfAcct` | no |
| **2** | Is there any change in method of accounting | enum: (Select)/Yes/No | `ChangeInAcctMethFlg` | no |
| **3a** | Increase in the profit or decrease in loss because of deviation, if any, as per Income Computation Disclosure Standards (ICDS) | integer | `ProfDeviatDueAcctMeth` | no |
| **3b** | Decrease in the profit or increase in loss because of deviation, if any, as per Income Computation Disclosure Standards | integer | `DecProOrIncLossUs145_2` | no |
| **4** | Method of valuation of closing stock employed in the previous year | group | `MethodOfValClgStk` | no |
| **4a** | Raw Material (if at cost or market rates whichever is less write 1, if at cost write 2, if at market rate write 3) | enum: (Select)/1/2/3 | `MethodOfValClgStk.ValRawMaterial` | no |
| **4b** | Finished goods (if at cost or market rates whichever is less write 1, if at cost write 2, if at market rate write 3) | enum: (Select)/1/2/3 | `MethodOfValClgStk.ValFinishedGoods` | no |
| **4c** | Is there any change in stock valuation method | enum: (Select)/Yes/No | `MethodOfValClgStk.ChngStockValMetFlg` | no |
| **4d** | Increase in the profit or decrease in loss because of deviation, if any, from the method of valuation | integer | `MethodOfValClgStk.EffectOnPL` | no |
| **4e** | Decrease in the profit or increase in loss because of deviation, if any, from the method of valuation | integer | `MethodOfValClgStk.DecProOrIncLossUs145_A` | no |

---

## 4 · Item 5 — amounts not credited to the P&L

Heading (verbatim): *Amounts not credited to the statement of profit and loss, being.*

| Item | Label (verbatim) | Schema key |
|---|---|---|
| **5a** | the items falling within the scope of section 28 | `NoCredToPLAmt.Section28Items` |
| **5b** | The proforma credits, drawbacks, refund of duty of customs or excise or service tax, or refund of sales tax or value added tax | `NoCredToPLAmt.ProformaCreditsDue` |
| **5c** | escalation claims accepted during the previous year | `NoCredToPLAmt.PrevYrEscalClaim` |
| **5d** | Any other item of income | `NoCredToPLAmt.OthItemInc` |
| **5e** | Capital receipt, if any | `NoCredToPLAmt.CapReceipt` |
| **5f** | Total of amounts not credited to staement of profit and loss (5a+5b+5c+5d+5e) | `NoCredToPLAmt.TotNoCredToPLAmt` |

---

## 5 · Item 6 — amounts disallowable under section 36

Heading (verbatim): *Amounts debited to the statement of profit and loss, to the
extent disallowable under section 36.*

| Item | Label (verbatim) | Schema key |
|---|---|---|
| **6a** | Premium paid for insurance against risk of damage or destruction of stocks or store [36(1)(i)] | `AmtDisallUs36.StkInsurPrem` |
| **6b** | Premium paid for insurance on the health of employees [36(1)(ib)] | `AmtDisallUs36.EmpHealthInsurPrem` |
| **6c** | Any sum paid to an employee as bonus or commission for services rendered, where such sum was otherwise payable to him as profits or dividend | `AmtDisallUs36.EmpBonusCommSum` |
| **6d** | Any amount of interest paid in respect of borrowed capital [36(1)(iii)] | `AmtDisallUs36.IntOnBorrCap` |
| **6e** | Amount of discount on a zero-coupon bond [36(1)(iiia)] | `AmtDisallUs36.ZeroCoupBondDisc` |
| **6f** | Amount of contributions to a recognised provident fund [36(1)(iv)] | `AmtDisallUs36.RecogPFContribAmt` |
| **6g** | Amount of contributions to an approved superannuation fund [36(1)(iv)] | `AmtDisallUs36.AppSuperAnnFundAmt` |
| **6h** | Amount of contribution to a pension scheme referred to in section 80CCD [36(1)(iva)] | `AmtDisallUs36.PensionSchemeSec80CCD` |
| **6i** | Amount of contributions to an approved gratuity fund [36(1)(v)] | `AmtDisallUs36.AppGratFundAmt` |
| **6j** | Amount of contributions to any other fund | `AmtDisallUs36.OthFundAmt` |
| **6k** | Any sum received from employees as contribution to any provident fund or superannuation fund or any fund set up under ESI Act or any other fund, not credited | `AmtDisallUs36.EmpContributionCredits` |
| **6l** | Amount of bad and doubtful debts [36(1)(vii)] | `AmtDisallUs36.BadDebtDoubtAmt` |
| **6m** | Provision for bad and doubtful debts [36(1)(viia)] | `AmtDisallUs36.BadDebtDoubtProvn` |
| **6n** | Amount transferred to any special reserve [36(1)(viii)] | `AmtDisallUs36.SpecResrvTranfr` |
| **6o** | Expenditure for the purposes of promoting family planning amongst employees [36(1)(ix)] | `AmtDisallUs36.FamPlanPromoExp` |
| **6p** | Amount of securities transaction paid in respect of transaction in securities if such income is not included in business income | `AmtDisallUs36.SecuritiesPaidAmt` |
| **6q** | Marked to market loss or other expected loss as computed in accordance with the ICDS notified u/s 145(2) | `AmtDisallUs36.MrktLossOthExpLossICDS` |
| **6r** | Any other disallowance | `AmtDisallUs36.AnyOthDisallowance` |
| **6s** | Total amount disallowable under section 36 (total of 6a to 6r) | `AmtDisallUs36.TotAmtDisallUs36` |
| **6t** | Total number of employees employed by the company (mandatory in case company has recognized Provident Fund) | `AmtDisallUs36.NoOfEmployeesEmployed` |
| **6t(i)** | deployed in India | `AmtDisallUs36.NoOfEmployeesEmployed.DeployedInIndia` |
| **6t(ii)** | deployed outside India | `AmtDisallUs36.NoOfEmployeesEmployed.DeployedOutSideIndia` |
| **6t(iii)** | Total | `AmtDisallUs36.NoOfEmployeesEmployed.Total` |

Rule **A166**: 6s must equal the sum of 6a to 6r.

---

## 6 · Item 7 — amounts disallowable under section 37

Heading (verbatim): *Amounts debited to the statement of profit and loss, to the
extent disallowable under section 37.*

| Item | Label (verbatim) | Schema key |
|---|---|---|
| **7a** | Expenditure of capital nature [37(1)] | `AmtDisallUs37.CapitalNatureExp` |
| **7b** | Expenditure of personal nature [37(1)] | `AmtDisallUs37.PersonalExp` |
| **7c** | Expenditure laid out or expended wholly and exclusively NOT for the purpose of business or profession | `AmtDisallUs37.BusOrProfessnExp` |
| **7d** | Expenditure on advertisement in any souvenir, brochure, tract, pamphlet or the like, published by a political party | `AmtDisallUs37.PoliticPartyExp` |
| **7e** | Expenditure by way of penalty or fine for violation of any law for the time being in force | `AmtDisallUs37.LawVoilatPenalExp` |
| **7f** | Any other penalty or fine | `AmtDisallUs37.OthPenalFineExp` |
| **7g** | Expenditure incurred for any purpose which is an offence or which is prohibited by law | `AmtDisallUs37.OffenceExp` |
| **7h** | Expenditure incurred on corporate social responsibility (CSR) | `AmtDisallUs37.SocialRespCSR` |
| **7i** | Amount of any liability of a contingent nature | `AmtDisallUs37.ContigentLiability` |
| **7j** | Any other amount not allowable under section 37 | `AmtDisallUs37.OthAmtNotAllowUs37` |
| **7k** | Total amount disallowable under section 37 (total of 7a to 7j) | `AmtDisallUs37.TotAmtDisallUs37` |

Rule **A167**: 7k must equal the sum of 7a to 7j.

---

## 7 · Items 8A and 8B — section 40

Heading (verbatim): *Amounts debited to the staement of profit and loss, to the
extent disallowable under section 40.*

| Item | Label (verbatim) | Schema key |
|---|---|---|
| **8Aa** | Amount disallowable under section 40 (a)(i), on account of non-compliance with the provisions of Chapter XVII-B | `AmtDisallUs40.NonCompChapXVIIBAmt` |
| **8Ab** | Amount disallowable under section 40(a)(ia) on account of non-compliance with the provisions of Chapter XVII-B | `AmtDisallUs40.NonComp40aiaChapXVIIBAmt` |
| **8Ac** | Amount disallowable under section 40(a)(ib) on account of non-compliance with the provisions of Chapter VIII of the Finance Act 2016 | `AmtDisallUs40.NonComp40aibChapXVIIBAmt` |
| **8Ad** | Amount disallowable under section 40(a)(iii) on account of non-compliance with the provisions of Chapter XVII-B | `AmtDisallUs40.NonComp40aiiiChapXVIIBAmt` |
| **8Ae** | Amount of tax or rate levied or assessed on the basis of profits [40(a)(ii)] | `AmtDisallUs40.TaxAmtOnProfits` |
| **8Af** | Amount paid as wealth tax [40(a)(iia)] | `AmtDisallUs40.WTAmt` |
| **8Ag** | Amount paid by way of royalty, license fee, service fee etc. as per section 40(a)(iib) | `AmtDisallUs40.RolyatyOrServiceFee` |
| **8Ah** | Amount of interest, salary, bonus, commission or remuneration paid to any partner or member inadmissible under section 40(b)/40(ba) | `AmtDisallUs40.IntSalBonPartner` |
| **8Ai** | Any other disallowance | `AmtDisallUs40.AnyOthDisallowance` |
| **8Aj** | Total amount disallowable under section 40 (total of 8Aa to 8Ai) | `AmtDisallUs40.TotAmtDisallUs40` |
| **8B** | Any amount disallowed under section 40 in any preceding previous year but allowable during the previous year | `AmtDisallUs40.AnyAmtOfSec40AllowPrevYr` |

Rule **A168**: 8Aj must equal the sum of 8Aa to 8Ai.

---

## 8 · Item 9 — section 40A

Heading (verbatim): *Amounts debited to the statement of profit and loss, to the
extent disallowable under section 40A.*

| Item | Label (verbatim) | Schema key |
|---|---|---|
| **9a** | Amounts paid to persons specified in section 40A(2)(b) | `AmtDisallUs40A.AmtPaidUs40A2b` |
| **9b** | Amount paid otherwise than by account payee Cheque or account payee bank draft or use of electronic clearing system, disallowable under section 40A(3) | `AmtDisallUs40A.AmtGT20kCash` |
| **9c** | Provision for payment of gratuity [40A(7)] | `AmtDisallUs40A.ProvPmtGrat` |
| **9d** | any sum paid by the assesse as an employer for setting up or as contribution to any fund, trust, company, AOP, BOI, society or other institution [40A(9)] | `AmtDisallUs40A.ContToSetupTrust` |
| **9e** | Any other disallowance | `AmtDisallUs40A.AnyOthDisallowance` |
| **9f** | Total amount disallowable under section 40A (total of 9a to 9e) | `AmtDisallUs40A.TotAmtDisallUs40A` |

Rule **A169**: 9f must equal the sum of 9a to 9e.

---

## 9 · Item 10 — section 43B allowable this year

Heading (verbatim): *Any amount disallowed under section 43B in any preceding
previous year but allowable during the previous year.* Schema block
`AmtDisallUs43BPyNowAll.AmtUs43B`.

| Item | Label (verbatim) | Schema key (under `AmtDisallUs43BPyNowAll.AmtUs43B`) |
|---|---|---|
| **10a** | Any sum in the nature of tax, duty, cess or fee under any law | `TaxDutyCesAmt` |
| **10b** | Any sum payable by way of contribution to any provident fund or superannuation fund or gratuity fund | `ContToEmpPFSFGF` |
| **10c** | Any sum payable to an employee as bonus or commission for services rendered | `EmpBonusComm` |
| **10d** | Any sum payable as interest on any loan or borrowing from any public financial institution or a State financial corporation | `IntPayaleToFI` |
| **10da** | Any sum payable as interest on any loan or borrowing from such class of Non-banking financial company | `SumPayaleLoanBrToFinComp` |
| **10e** | Any sum payable as interest on any loan or borrowing from any scheduled bank or a co-operative bank | `IntPayaleToFISchBank` |
| **10f** | Any sum payable towards leave encashment | `LeaveEncashPayable` |
| **10g** | Any sum payable to the Indian Railways for the use of railway assets | `RailwayAsstsPyble` |
| **10h** | Any sum payable to a micro or small enterprise beyond the time limit specified in the Section 15 of the MSMED Act | `MSEPayable` |
| **10i** | Total amount allowable under section 43B (total of 10a to 10h) | `TotAmtUs43b` |

Rule **A170**: 10i must equal the sum of 10a to 10h.

---

## 10 · Item 11 — section 43B disallowable this year

Heading (verbatim): *Any amount debited to statement of profit and loss of the
previous year but disallowable under section 43B.* Schema block
`AmtDisall43B.AmtUs43B` (same leaf names as item 10).

| Item | Label (verbatim) | Schema key (under `AmtDisall43B.AmtUs43B`) |
|---|---|---|
| **11a** | Any sum in the nature of tax, duty, cess or fee under any law | `TaxDutyCesAmt` |
| **11b** | Any sum payable by way of contribution to any provident fund or superannuation fund or gratuity fund | `ContToEmpPFSFGF` |
| **11c** | Any sum payable to an employee as bonus or commission for services rendered | `EmpBonusComm` |
| **11d** | Any sum payable as interest on any loan or borrowing from any public financial institution or a State financial corporation | `IntPayaleToFI` |
| **11da** | Any sum payable as interest on any loan or borrowing from such class of Non-banking financial company | `SumPayaleLoanBrToFinComp` |
| **11e** | Any sum payable as interest on any loan or borrowing from any scheduled bank or a co-operative bank | `IntPayaleToFISchBank` |
| **11f** | Any sum payable towards leave encashment | `LeaveEncashPayable` |
| **11g** | Any sum payable to the Indian Railways for the use of railway assets | `RailwayAsstsPyble` |
| **11h** | Any sum payable to a micro or small enterprise beyond the time limit specified in the Section 15 of the MSMED Act | `MSEPayable` |
| **11i** | Total amount disallowable under Section 43B (total of 11a to 11h) | `TotAmtUs43b` |

Rule **A171**: 11i must equal the sum of 11a to 11h.

---

## 11 · Item 12 — credit outstanding in the accounts

Heading (verbatim): *Amount of credit outstanding in the accounts in respect of.*
Schema block `AmtExciseCustomsVATOutstanding.ExciseCustomsVAT`.

| Item | Label (verbatim) | Schema key |
|---|---|---|
| **12a** | Union Excise Duty | `...ExciseCustomsVAT.UnionExciseDuty` |
| **12b** | Service tax | `...ExciseCustomsVAT.ServiceTax` |
| **12c** | VAT/sales tax | `...ExciseCustomsVAT.VATorSaleTax` |
| **12d** | Central Goods & Service Tax (CGST) | `...ExciseCustomsVAT.CentralGoodServiceTax` |
| **12e** | State Goods & Services Tax (SGST) | `...ExciseCustomsVAT.StateGoodServiceTax` |
| **12f** | Integrated Goods & Services Tax (IGST) | `...ExciseCustomsVAT.IntegratedGoodServiceTax` |
| **12g** | Union Territory Goods & Services Tax (UTGST) | `...ExciseCustomsVAT.UnionTerrGoodServiceTax` |
| **12h** | Any other tax | `...ExciseCustomsVAT.OthDutyTaxCess` |
| **12i** | Total amount outstanding (total of 12a to 12h) | `...ExciseCustomsVAT.TotExciseCustomsVAT` |

---

## 12 · Items 13 to 18

| Item | Label (verbatim) | Type / enum | Schema key |
|---|---|---|---|
| **13** | Amounts deemed to be profits and gains under section 33AB or 33ABA or 33 AC | group / total | `DeemedProfUs33ABs` (total) |
| **13a** | 33AB | integer | `DeemedProfUs33AB` |
| **13b** | 33ABA | integer | `DeemedProfUs33ABA` |
| **13c** | 33AC | integer | `DeemedProfUs33AC` |
| **14** | Any amount of profit chargeable to tax under section 41 | integer | `ProfTaxAmtUs41` |
| **15** | Amount of income or expenditure of prior period credited or debited to the statement of profit and loss | integer | `PriorAmtIncCrDrPL` |
| **16** | Amount of expenditure disallowed u/s 14A | integer | `AmountOfExpDisAllwUs14A` |
| **17** | Interest disallowable under section 23 of the Micro, Small and Medium Enterprises Development Act, 2006 | integer | `InterestDisAllowUs23SMEAct` |
| **18** | Whether assessee is exercising option under subsection 2A of section 92CE | enum: (Select)/Yes/No | `ScheduleTPSAFlg` |

Item 18 (`ScheduleTPSAFlg` = Yes) unlocks **Schedule TPSA** (secondary adjustment
under section 92CE). Rule **A163**: item 3a should equal column XI(3) of Schedule
ICDS.

---

## 13 · Enums / dropdowns

| Cell | List |
|---|---|
| Item 1 `MethodOfAcct` | (Select), Mercantile, Cash |
| Items 2, 4c, 18 (flags) | (Select), Yes, No |
| Items 4a, 4b (valuation code) | (Select), 1, 2, 3 |

Values in full so the build seeds them from this book: **(Select)**, **Yes**,
**No**, **Mercantile**, **Cash**, and the codes **1**, **2**, **3**. All other
cells are numeric (0 or −99,999,999,999,999 to the 14-digit maximum).

---

## 14 · Cross-sheet feeds

| Direction | Feed |
|---|---|
| in | Item 3a ← Schedule ICDS column XI(3) (rule A163) |
| out | The section-36/37/40/40A/43B totals and the 5f, 12i, 13, 14–17 figures → the corresponding add-back / allowance lines of **Schedule BP** (business income computation) |
| out | Item 18 Yes → opens **Schedule TPSA** |

---

## 15 · What repeats, what is mandatory

- **Nothing repeats** — OI is a fixed list of figures and flags; there are no
  addable tables.
- The schema marks the flags (`MethodOfAcct`, `ChangeInAcctMethFlg`, the two
  valuation codes, `ChngStockValMetFlg`, `ScheduleTPSAFlg`) and every section
  total as required, so the block is written in full for an audited company. The
  optional leaves (`AnyOthDisallowance` under 40 and 40A, `RailwayAsstsPyble`,
  `MSEPayable`, the excise/customs sub-lines of item 12, and the three individual
  33AB/33ABA/33AC lines) are written only when they carry a value.

---

## 16 · Hidden rows

**None.** All 129 rows are visible.

---

## 17 · What this means for the build

1. It is a long figures-and-flags block with six computed section totals; each
   total (6s, 7k, 8Aj, 9f, 10i, 11i, 12i, and the 33AB group total) is checked by
   a rule (A166–A171) against its constituent lines — encode those.
2. Items 10 and 11 share the same leaf-key names in two different blocks
   (`AmtDisallUs43BPyNowAll.AmtUs43B` vs `AmtDisall43B.AmtUs43B`); keep the two
   objects distinct on export.
3. The valuation codes (4a, 4b) are 1/2/3 with the meanings in the label; render
   the dropdown, not free text.
4. Item 18 gates Schedule TPSA; item 3a ties to Schedule ICDS.
5. Watch the schema's spellings: `RolyatyOrServiceFee`, `AmtGT20kCash`,
   `DeemedProfUs33ABs` (the total, with a trailing "s"), `ScheduleTPSAFlg`.
