# Schedule BP — Computation of income from business or profession

Schema block: `ITR3ScheduleBP`. Sheet: **BP** (utility sheet16.xml, visible). ITR-3-only head; no ITR-2 model.

## The shape
Schedule BP computes income under the head "Profits and gains from Business or profession". It has five lettered parts: **A** — business or profession other than speculative business and specified business (items 1 to 38, a long single-column adjustment ladder starting from Profit before tax as per the profit and loss account and ending in net profit A37 plus the Rule 7/7A/7B/8 agriculture split at 38); **B** — computation of income from speculative business (items 39 to B42); **C** — computation of income from specified business under section 35AD (items 43 to C48, plus a two-row drop-down for the relevant clause of sub-section (5) of section 35AD); **D** — income chargeable under the head (A37+B42+C48); and **E** — intra head set off of business loss of current year (a small table, rows i to v). Almost every amount cell is a single figure computed by formula from other schedules (P&L, OI, DEP, ESR, Trading account, sheet10/11/12); the only user-entered array is "Any other exempt income" under 5c, and the only drop-down list is the section 35AD sub-section (5) clause.

## The items

### Part A — From business or profession other than speculative business and specified business (`BusinessIncOthThanSpec`)

| Item / letter | Field label | Type | Schema key | Rule / notes |
|---|---|---|---|---|
| 1 | Profit before tax as per profit and loss account ((item 53, 61(ii)), 62(ii), 63(ii), 64(iii), 65(iv) and 66(ii) of P&L) (in case of no account case) | integer | `BusinessIncOthThanSpec.ProfBfrTaxPL` | K5 = PL.PBT+PL_61ii+PL_63ii+PL_64iii+PL_65iv+PL.NetProfit+IF(PL_62ii<>0,PL_62ii,0) |
| 2a | Net profit or loss from speculative business included in 1 (enter –ve sign in case of loss) [Sl.no 12b of Trading account + Sl.no 65iv of Schedule P&L] | integer | `BusinessIncOthThanSpec.NetPLFromSpecBus` | I6 = IncomeIntraTrading_12b+PL_65iv |
| 2b | Net profit or Loss from Specified Business u/s 35AD included in 1 (enter –ve sign in case of loss) | integer | `BusinessIncOthThanSpec.NetPLFromSpecifiedBus` | — |
| 3 | Income/receipts credited to profit and loss account considered under other heads of income or chargeable u/s 115BBF/115BBG/115BBH | (header) | `BusinessIncOthThanSpec.IncRecCredPLOthHeadDtls` | |
| 3a | Salaries | integer | `IncRecCredPLOthHeadDtls.Salary` | min 0 |
| 3b | House Property | integer | `IncRecCredPLOthHeadDtls.HouseProperty` | A3b cannot exceed income offered in Schedule HP |
| 3c | Capital Gains | integer | `IncRecCredPLOthHeadDtls.CapitalGains` | A3c cannot exceed income offered in Schedule CG |
| 3d | Other Sources | integer | `IncRecCredPLOthHeadDtls.OtherSources` | I12 = sheet10.IncRecCredPLOthHeads4Div + sheet10.IncRecCredPLOthHeads4OthDiv; A3d cannot exceed income offered in Schedule OS |
| 3di | Dividend Income | integer | `IncRecCredPLOthHeadDtls.Dividend` | min 0 |
| 3dii | Other than Dividend Income | integer | `IncRecCredPLOthHeadDtls.OtherThanDividend` | min 0 |
| 3e | u/s 115BBF | integer | `IncRecCredPLOthHeadDtls.Us115BBF` | min 0 |
| 3f | u/s 115BBG | integer | `IncRecCredPLOthHeadDtls.Us115BBG` | min 0 |
| 3g | u/s 115BBH (net of Cost of Acquisition) | integer | `IncRecCredPLOthHeadDtls.115BBH` | I17 = MAX(0,VDA.TotalIncomeBI) |
| (—) | Profit or loss included in 1, referred to in section 44AD/44ADA/44AE/44B/44BB/44BBA/44BBC/44BBD/44DA and Chapter-XII-G | integer | `BusinessIncOthThanSpec.PLUs44sChapXIIG` | min 0 |
| 4a | Profit or loss included in 1, which is referred to in section 44AD/44ADA/44AE/44B/44BB/44BBA/44BBC/44BBD/44DA | integer | `BusinessIncOthThanSpec.ProfitLossInclRefrdSec` (object) | I18 = SUM(BP_4_44AD,…,BP_4_44DA); Sl.No. 4a should equal Sl.No. 35(i) to 35(vii) |
| 4a·44AD | 44AD | integer | `ProfitLossInclRefrdSec.ProfitLossUs44AD` | I20 = sheet11.Section44AD |
| 4b·44ADA | 44ADA | integer | `ProfitLossInclRefrdSec.ProfitLossUs44ADA` | I21 = sheet11.Section44ADA |
| 4c·44AE | 44AE | integer | `ProfitLossInclRefrdSec.ProfitLossUs44AE` | I22 = sheet11.Section44AE |
| 4d·44B | 44B | integer | `ProfitLossInclRefrdSec.ProfitLossUs44B` | I23 = sheet11.Section44B |
| 4e·44BB | 44BB | integer | `ProfitLossInclRefrdSec.ProfitLossUs44BB` | I24 = Sheet11.Section44BB |
| 4f·44BBA | 44BBA | integer | `ProfitLossInclRefrdSec.ProfitLossUs44BBA` | I25 = sheet11.Section44BBA |
| 4g·44BBC | 44BBC | integer | `ProfitLossInclRefrdSec.ProfitLossUs44BBC` | I26 = sheet11.Section44BBC |
| 4h·44BBD | 44BBD | integer | `ProfitLossInclRefrdSec.ProfitLossUs44BBD` | I27 = sheet11.Section44BBD |
| 4i·44DA | 44DA | integer | `ProfitLossInclRefrdSec.ProfitLossUs44DA` | I28 = sheet12.Section44DA |
| 4b | Profit from activities covered under rule 7, 7A, 7B(1), 7B(1A) and 8 | integer | `BusinessIncOthThanSpec.TotalProfitFrmActCvrd` | I29 = SUM(BP_4b_ProfitRule7,7A,7B1,7B2,8) |
| 4ba | Profit from activities covered under rule 7 | integer | `ProfitFrmActCvrd.ProfitFrmActCvrdUndrRule7` | min 0 |
| 4bb | Profit from activities covered under rule 7A | integer | `ProfitFrmActCvrd.ProfitFrmActCvrdUndrRule7A` | min 0 |
| 4bc | Profit from activities covered under rule 7B(1) | integer | `ProfitFrmActCvrd.ProfitFrmActCvrdUndrRule7B1` | min 0 |
| 4bd | Profit from activities covered under rule 7B(1A) | integer | `ProfitFrmActCvrd.ProfitFrmActCvrdUndrRule7B1A` | min 0 |
| 4be | Profit from activities covered under rule 8 | integer | `ProfitFrmActCvrd.ProfitFrmActCvrdUndrRule8` | min 0 |
| 5 | Income credited to Profit and Loss account (included in 1) which is exempt | (header) | `BusinessIncOthThanSpec.IncCredPL` | |
| 5a | share of income from firm(s) | integer | `IncCredPL.FirmShareInc` | min 0 |
| 5b | Share of income from AOP/BOI | integer | `IncCredPL.AOPBOISharInc` | min 0 |
| 5c | Any other exempt Income (specify nature and amount) | (object/array) | `IncCredPL.OtherExmptIncDtl` | |
| 5c·i | Nature — Dividend Income | string | `OtherExmptIncDtl.OperatingDividendName` | enum: Dividend |
| 5c·ii | Amount (Dividend) | integer | `OtherExmptIncDtl.OperatingDividendAmt` | Dividend amount cannot exceed A.3d(i) Dividend Income; min 0 |
| 5c (rows) | Any other exempt income — repeating Nature/Amount lines | array | `OtherExmptIncDtl.OtherExmptIncDtls[]` → `.OperatingRevenueName` (string), `.OperatingRevenueAmt` (integer) | user array; Nature cannot contain special characters `<>` `&` |
| 5c·iii | Total | integer | `IncCredPL.OthExempInc` | I46 = SUM(DivIncome_1,Amt_1) |
| 5d | Total exempt income (5a+5b+5ciii) | integer | `IncCredPL.TotExempIncPL` | I47 = SUM(I37,I38,I46) |
| 5A | Income or receipts credited to Profit and Loss account but not chargeable to tax under the Act | integer | `BusinessIncOthThanSpec.IncCredPLNotChargable` | min 0 |
| 6 | Balance (1– 2a – 2b – 3a - 3b – 3c - 3d -3e-3f –3g- 4a-4b– 5d-5A) | integer | `BusinessIncOthThanSpec.BalancePLOthThanSpecBus` | K49 = K5-I6-I7-I9-I10-I11-I12-I15-I16-I17-I18-I29-I47-I48 |
| 7 | Expenses debited to profit and loss account considered under other heads of income/related to income chargeable u/s 115BBF/115BBG/115BBH | (header) | `BusinessIncOthThanSpec.ExpDebToPLOthHeadDtls` | |
| 7a | Salaries | integer | `ExpDebToPLOthHeadDtls.Salary` | min 0 |
| 7b | House Property | integer | `ExpDebToPLOthHeadDtls.HouseProperty` | min 0 |
| 7c | Capital Gains | integer | `ExpDebToPLOthHeadDtls.CapitalGains` | min 0 |
| 7d | Other Sources | integer | `ExpDebToPLOthHeadDtls.OtherSources` | min 0 |
| 7e | u/s 115BBF | integer | `ExpDebToPLOthHeadDtls.Us115BBF` | min 0 |
| 7f | u/s 115BBG | integer | `ExpDebToPLOthHeadDtls.Us115BBG` | min 0 |
| 7g | u/s 115BBH (other than Cost of Acquisition) | integer | `ExpDebToPLOthHeadDtls.115BBH` | min 0 |
| 8a | Expenses debited to profit and loss account which relate to exempt income | integer | `BusinessIncOthThanSpec.ExpDebToPLExemptInc` | min 0 |
| 8b | Expenses debited to profit and loss account which relate to exempt income and disallowed u/s 14A (16 of Part A-OI) | integer | `BusinessIncOthThanSpec.ExpDebToPLExemptIncDisAllwUs14A` | I59 = sheet7.AmountOfExpenditure14A |
| 9 | Total (7a + 7b + 7c + 7d + 7e +7f+7g+ 8a+8b) | integer | `BusinessIncOthThanSpec.TotExpDebPL` | I60 = SUM(I51:I59) |
| 10 | Adjusted profit or loss (6+9) | integer | `BusinessIncOthThanSpec.AdjustedPLOthThanSpecBus` | K61 = SUM(K49,I60) |
| 11 | Depreciation and amortization debited to profit and loss account | integer | `BusinessIncOthThanSpec.DepreciationDebPLCosAct` | K62 = PL.DepreciationAmort+ManuFactureAcc_DepreciationOfFactoryMachinary |
| 12 | Depreciation allowable under Income-tax Act | (header) | `BusinessIncOthThanSpec.DepreciationAllowITAct32` | |
| 12i | Depreciation allowable under section 32(1)(ii) and 32(1)(iia) (column 6 of Schedule-DEP) | integer | `DepreciationAllowITAct32.DepreciationAllowUs32_1_ii` | I64 = IF(DEP.TotalDepreciation>0,DEP.TotalDepreciation,0) |
| 12ii | Depreciation allowable under section 32(1)(i) (Make your own computation and enter) (Refer Appendix-IA) | integer | `DepreciationAllowITAct32.DepreciationAllowUs32_1_i` | min 0 |
| 12iii | Total (12i + 12ii) | integer | `DepreciationAllowITAct32.TotDeprAllowITAct` | K66 = SUM(I64,I65) |
| 13 | Profit or loss after adjustment for depreciation (10 +11 - 12iii) | integer | `BusinessIncOthThanSpec.AdjustPLAfterDeprOthSpecInc` | K67 = AdjustedPLOthThanSpecBus+DepreciationDebPLCosAct-TotDeprAllowITAct |
| 14 | Amounts debited to the profit and loss account, to the extent disallowable under section 36 (6s of Part A-OI) | integer | `BusinessIncOthThanSpec.AmtDebPLDisallowUs36` | I68 = sheet6.TotAmtDisallUs36 |
| 15 | Amounts debited to the profit and loss account, to the extent disallowable under section 37 (7J of Part-OI) | integer | `BusinessIncOthThanSpec.AmtDebPLDisallowUs37` | I69 = sheet6.TotAmtDisallUs37 |
| 16 | Amounts debited to the profit and loss account, to the extent disallowable under section 40 (8Aj of Part-OI) | integer | `BusinessIncOthThanSpec.AmtDebPLDisallowUs40` | I70 = sheet7.TotAmtDisallUs40 |
| 17 | Amounts debited to the profit and loss account, to the extent disallowable under section 40A (9F of Part-OI) | integer | `BusinessIncOthThanSpec.AmtDebPLDisallowUs40A` | I71 = sheet7.TotAmtDisallUs40A |
| 18 | Any amount debited to profit and loss account of the previous year but disallowable under section 43B (11i of Part-OI) | integer | `BusinessIncOthThanSpec.AmtDebPLDisallowUs43B` | I72 = sheet7.TotAmtUs43b1 |
| 19 | Interest disallowable under section 23 of the Micro, Small and Medium Enterprises Development Act, 2006 (17 of Part A-OI) | integer | `BusinessIncOthThanSpec.InterestDisAllowUs23SMEAct` | I73 = sheet7.Intrestsec23 |
| 20 | Deemed income under section 41 | integer | `BusinessIncOthThanSpec.DeemIncUs41` | — |
| 21 | Deemed income under section 32AD/33AB/33ABA/35ABA/35ABB/40A(3A)/72A/80HHD/80-IA | integer | `BusinessIncOthThanSpec.DeemIncUs3380HHD80IA` | I75 = MAX(0,SUM(I77:I85)) |
| 21a | 32AD | integer | `DeemIncUs32AD` | — |
| 21b | 33AB | integer | `DeemIncUs33AB` | — |
| 21c | 33ABA | integer | `DeemIncUs33ABA` | — |
| 21d | 35ABA | integer | `DeemIncUs35ABA` | — |
| 21e | 35ABB | integer | `DeemIncUs35ABB` | — |
| 21f | 40A(3A) | integer | `DeemIncUs40A3A` | — |
| 21g | 72A | integer | `DeemIncUs72A` | — |
| 21h | 80HHD | integer | `DeemIncUs80HHD` | — |
| 21i | 80-IA | integer | `DeemIncUs80IA` | — |
| 22 | Deemed income under section 43CA | integer | `BusinessIncOthThanSpec.DeemIncUs43CA` | min 0 |
| 23 | Any other item or items of addition under section 28 to 44DA | integer | `BusinessIncOthThanSpec.OthItemDisallowUs28To44DA` | min 0 |
| 24 | Any other income not included in profit and loss account/any other expense not allowable (including income from salary, commission, bonus and interest from firms in which individual/HUF/prop. concern is a partner) | integer | `BusinessIncOthThanSpec.AnyOthIncNotInclInExpDisallowPL` | I88 = SUM(I89:I93) |
| 24a | Salary | integer | `BusinessIncOthThanSpec.AnyOthIncNotInclInSalary` | min 0 |
| 24b | Bonus | integer | `BusinessIncOthThanSpec.AnyOthIncNotInclInBonus` | min 0 |
| 24c | Commission | integer | `BusinessIncOthThanSpec.AnyOthIncNotInclInCommission` | min 0 |
| 24d | Interest | integer | `BusinessIncOthThanSpec.AnyOthIncNotInclInInterest` | min 0 |
| 24e | Others | integer | `BusinessIncOthThanSpec.AnyOthIncNotInclInOthers` | min 0 |
| 25 | Increase in profit or decrease in loss on account of ICDS adjustments and deviation in method of valuation of stock (Column 3a + 4d of Part A - OI) | integer | `BusinessIncOthThanSpec.IncProfDecLossAccICDSAdj` | K94 = SUM(sheet5.ProfDeviatDueAcctMeth,sheet6.EffectOnPL) |
| 26 | Total (14 + 15 +16 +17 +18 +19 + 20 +21 + 22 + 23 + 24+25) | integer | `BusinessIncOthThanSpec.TotAfterAddToPLDeprOthSpecInc` | K95 = SUM(I68:I88,K94)-sheet11.DeemIncUs3380HHD80IA |
| 27 | Deduction allowable under section 32(1)(iii) | integer | `BusinessIncOthThanSpec.DeductUs32_1_iii` | min 0 |
| 28 | Amount of deduction under section 35 or 35CCC or 35CCD in excess of the amount debited to profit and loss account (item X(4) of Schedule ESR) (if amount deductible under section 35 or 35CCC or 35CCD is lower than amount debited to P&L account, it will go to item 24) | integer | `BusinessIncOthThanSpec.DebPLUs35ExcessAmt` | I98 = ESRTOT.ExcessAmtOverDebPL |
| 29 | Any amount disallowed under section 40 in any preceding previous year but allowable during the previous year (8B of Part A-OI) | integer | `BusinessIncOthThanSpec.AmtDisallUs40NowAllow` | I99 = sheet7.AmtDisallUs40PyNowAll |
| 30 | Any amount disallowed under section 43B in any preceding previous year but allowable during the previous year (10i of Part A-OI) | integer | `BusinessIncOthThanSpec.AmtDisallUs43BNowAllow` | I100 = sheet7.TotAmtUs43b |
| 31 | Any other amount allowable as deduction | integer | `BusinessIncOthThanSpec.AnyOthAmtAllDeduct` | min 0 |
| 32 | Decrease in profit or increase in loss on account of ICDS adjustments and deviation in method of valuation of stock (Column 3b + 4e of Part A- OI) | integer | `BusinessIncOthThanSpec.DecProfIncLossAccICDSAdj` | K106 = SUM(sheet5.ProfDeviatDueAcctMethb,sheet6.EffectOnPL4e) |
| 33 | Total (27+28+29+30+31+32) | integer | `BusinessIncOthThanSpec.TotDeductionAmts` | K107 = SUM(DeductUs32_1_iii,DebPLUs35ExcessAmt,AmtDisallUs40NowAllow,…) |
| 34 | Income (13 + 26 - 33) | integer | `BusinessIncOthThanSpec.PLAftAdjDedBusOthThanSpec` | K108 = K67+K95-K107 |
| 35 | Profits and gains of business or profession deemed to be under - | (header) | `BusinessIncOthThanSpec.DeemedProfitBusUs` | |
| 35i | Section 44AD (61(ii) of schedule P&L) | integer | `DeemedProfitBusUs.Section44AD` | I110 = PL_61ii; must match Presumptive income u/s 44AD of Schedule P&L |
| 35ii | Section 44ADA (62(ii) of schedule P&L) | integer | `DeemedProfitBusUs.Section44ADA` | I111 = PL_62ii; must match 62(ii) of Schedule P&L |
| 35iii | Section 44AE (63(ii) of schedule P&L) | integer | `DeemedProfitBusUs.Section44AE` | I112 = MAX(0,PL_63ii); must match 63(ii) of Schedule P&L |
| 35iv | Section 44B | integer | `DeemedProfitBusUs.Section44B` | I113 = MAX(0,PL.NetProfit44B) |
| 35v | Section 44BB | integer | `DeemedProfitBusUs.Section44BB` | I114 = MAX(0,PL.NetProfit44BB) |
| 35via | Section 44BBA | integer | `DeemedProfitBusUs.Section44BBA` | I115 = MAX(0,PL.NetProfit44BBA) |
| 35vib | Section 44BBC | integer | `DeemedProfitBusUs.Section44BBC` | I118 = MAX(0,PL.NetProfit44BBC) |
| 35vic | Section 44BBD | integer | `DeemedProfitBusUs.Section44BBD` | I119 = MAX(0,PL.NetProfit44BBD) |
| 35vii | Section 44DA | integer | `DeemedProfitBusUs.Section44DA` | — |
| 35viii | Total (35i to 35vii) | integer | `DeemedProfitBusUs.TotDeemedProfitBusUs` | K122 = MAX(0,SUM(sheet11.Section44AD,…)); equals sum of 35i to 35vii |
| 36 | Net profit or loss from business or profession other than speculative business and specified business (34 + 35viii) | integer | `BusinessIncOthThanSpec.NetPLAftAdjBusOthThanSpec` | K130 = PLAftAdjDedBusOthThanSpec + TotDeemedProfitBusUs |
| A37 | Net Profit or loss from business or profession other than speculative business and specified business, after applying rule 7A, 7B or 8, if applicable (if rule 7A, 7B or 8 is not applicable, enter same figure as in 40) (if loss take the figure to 2i of item E) (37a+ 37b + 37c + 37d + 37e + 37f) | integer | `BusinessIncOthThanSpec.NetPLBusOthThanSpec7A7B7C` | K131 = SUM(BP_Chargeable_rule7,7A,7B1,7B1A,rule8,…) |
| 37a | Chargeable income under Rule 7 | integer | `BusinessIncOthThanSpec.ChrgblIncUndrRule7` | min 0 |
| 37b | Deemed chargeable Income under Rule 7A | integer | `BusinessIncOthThanSpec.DeemedChrgblIncUndrRule7A` | min 0 |
| 37c | Deemed chargeable Income under Rule 7B(1) | integer | `BusinessIncOthThanSpec.DeemedChrgblIncUndrRule7B1` | min 0 |
| 37d | Deemed chargeable Income under Rule 7B(1A) | integer | `BusinessIncOthThanSpec.DeemedChrgblIncUndrRule7B1A` | min 0 |
| 37e | Deemed chargeable Income under Rule 8 | integer | `BusinessIncOthThanSpec.DeemedChrgblIncUndrRule8` | min 0 |
| 37f | Income other than Rule 7, 7A, 7B & 8 (Item No. 36) | integer | `BusinessIncOthThanSpec.IncomeOtherThanRule` | I137 = sheet12.NetPLAftAdjBusOthThanSpec |
| 38 | Balance of income deemed to be from Agriculture, after applying Rule 7, 7A, 7B(1), 7B(1A) and Rule 8 for aggregation of income purposes as per Finance Act | integer | `BusinessIncOthThanSpec.BalIncDeemedFrmAgri` | K138 = MAX(0,(BP_4b_TotalProfitFromActivates - SUM(I132:I136))) |

### Part B — Computation of income from speculative business (`SpecBusinessInc`)

| Item | Field label | Type | Schema key | Rule / notes |
|---|---|---|---|---|
| 39 | Net profit or loss from speculative business as per profit or loss account (Item No.2a) | integer | `SpecBusinessInc.NetPLFrmSpecBus` | K140 = sheet10.NetPLFromSpecBus |
| 40 | Additions in accordance with section 28 to 44DA | integer | `SpecBusinessInc.AdditionUs28to44DA` | min 0 |
| 41 | Deductions in accordance with section 28 to 44DA | integer | `SpecBusinessInc.DeductUs28to44DA` | min 0 |
| B42 | Income from speculative business (39+40-41) (if loss, take the figure to 6ix of schedule CFL) | integer | `SpecBusinessInc.AdjustedPLFrmSpecuBus` | K143 = NetPLFrmSpecBus + AdditionUs28to44DA - DeductUs28to44DA; current year speculative loss in CFL equals B42 |

### Part C — Computation of income from specified business under section 35AD (`SpecifiedBusinessInc`)

| Item | Field label | Type | Schema key | Rule / notes |
|---|---|---|---|---|
| 43 | Net profit or loss from specified business as per profit or loss account | integer | `SpecifiedBusinessInc.NetPLFrmSpecifiedBus` | K145 = sheet10.NetPLFromSpecifiedBus |
| 44 | Additions in accordance with section 28 to 44DA | integer | `SpecifiedBusinessInc.AddSec28to44DA` | min 0 |
| 45 | Deductions in accordance with section 28 to 44DA (other than deduction under section,- (i) 35AD, (ii) 32 or 35 on which deduction u/s 35AD is claimed) | integer | `SpecifiedBusinessInc.DedSec28to44DAOTDedSec35AD` | min 0 |
| 46 | Profit or loss from specified business (43+44-45) | integer | `SpecifiedBusinessInc.ProfitLossSpecifiedBusiness` | K148 = NetPLFrmSpecifiedBus + AddSec28to44DA - DedSec28to44DA |
| 47 | Deductions in accordance with section 35AD(1) | integer | `SpecifiedBusinessInc.DeductionUs35AD` | min 0; equals 46a+46b (35AD(1) + 35AD(1A) — both hidden) |
| C48 | Income from Specified Business (46-47) (if loss, take the figure to 7ix of schedule CFL) | integer | `SpecifiedBusinessInc.PLFrmSpecifiedBus` | K152 = ProfitLossSpecifiedBusiness - DeductionUs35AD; current year specified loss in CFL equals C48 |
| (clause) | Relevant clause of sub-section (5) of section 35AD which covers the specified business (to be selected from drop down menu) | array | `SpecifiedBusinessInc.DedUs35ADSubSec5Dtls[].DedUs35ADSubSec5` | two rows G154, G155; same drop down cannot be selected more than once in Schedule BP |

### Part D — Income chargeable under the head

| Item | Field label | Type | Schema key | Rule / notes |
|---|---|---|---|---|
| D | Income chargeable under the head 'Profits and gains from Business or profession' (A37+B42+C48) | integer | `IncChrgUnHdProftGain` | K157 = MAX(0,AdjustedPLFrmSpecifiedBus)+MAX(0,AdjustedPLFrmSpecuBus)+NetPLBusOthThanSpec…; equals A37 + B42 + C48 |

### Part E — Intra head set off of business loss of current year (`BusSetoffCurrYr`)

Columns: (1) Income of current year (Fill this column only if figure is zero or positive); (2) Business loss set off; (3) = (1)-(2) Business income remaining after set off.

| Row | Field label | Type | Schema key | Rule / notes |
|---|---|---|---|---|
| (i) | Loss to be set off (Fill this row only if figure is negative) | integer | `BusSetoffCurrYr.LossSetOffOnBusLoss` | I166 = ABS(MIN(0,sheet12.NetPLBusOthThanSpec7A7B7C)) |
| (ii) | Income from speculative business | (object) | `BusSetoffCurrYr.SpeculativeInc` | G167 = MAX(0,AdjustedPLFrmSpecuBus) |
| (ii)·1 | Income of current year | integer | `SpeculativeInc.IncOfCurYrUnderThatHead` | min 0 |
| (ii)·2 | Business loss set off | integer | `SpeculativeInc.BusLossSetoff` | I167 = MIN(LossSetOffOnBusLoss, IncOfCurYrUnderThatHeada) |
| (ii)·3 | Income of current year after set off | integer | `SpeculativeInc.IncOfCurYrAfterSetOff` | K167 = IncOfCurYrUnderThatHeada - BusLossSetoffa |
| (iii) | Income from specified business | (object) | `BusSetoffCurrYr.SpecifiedInc` | G168 = MAX(0,AdjustedPLFrmSpecifiedBus) |
| (iii)·1 | Income of current year | integer | `SpecifiedInc.IncOfCurYrUnderThatHead` | min 0 |
| (iii)·2 | Business loss set off | integer | `SpecifiedInc.BusLossSetoff` | I168 = MIN((LossSetOffOnBusLoss - BusLossSetoffa), G168) |
| (iii)·3 | Income of current year after set off | integer | `SpecifiedInc.IncOfCurYrAfterSetOff` | K168 = IncOfCurYrUnderThatHeadb - BusLossSetoffb |
| (iv) | Total loss set off (ii + iii) | integer | `BusSetoffCurrYr.TotLossSetOffOnBus` | I169 = SUM(I167:I168) |
| (v) | Loss remaining after set off (i – iv) | integer | `BusSetoffCurrYr.LossRemainSetOffOnBus` | I170 = MAX(LossSetOffOnBusLoss - TotLossSetOffOnBus) |

## The rules the sheet computes
- **[K5]** Profit before tax = `PL.PBT+PL_61ii+PL_63ii+PL_64iii+PL_65iv+PL.NetProfit+IF(PL_62ii<>0,PL_62ii,0)`. (Rule: PBT in BP should equal Profit before Tax + Net Profit (No Accounts Case) + presumptive income as per P&L.)
- **[I6 / O6]** 2a speculative net P/L = `IncomeIntraTrading_12b+PL_65iv`; helper `[N6] FINALPBT` (=`PL.PBT+PL_61ii+PL_63ii+PL_64iii+PL_65iv+IF(PL_62ii<>0,PL_62ii,0)`). 2a should equal 65iv of P&L + 12b of Trading account.
- **[I12]** 3d Other Sources = `sheet10.IncRecCredPLOthHeads4Div + sheet10.IncRecCredPLOthHeads4OthDiv`.
- **[I17]** 3g u/s 115BBH = `MAX(0,VDA.TotalIncomeBI)`.
- **[I18]** 4a = `SUM(BP_4_44AD,44ADA,44AE,44B,44BB,44BBA,44BBC,44BBD,44DA)`; 4a should equal 35(i) to 35(vii).
- **[I20–I28]** each 44xx line pulls from sheet11/sheet12 (Section44AD … Section44DA).
- **[I29]** 4b = `SUM(BP_4b_ProfitRule7,7A,7B1,7B2,8)`.
- **[I46]** 5c·iii Total = `SUM(DivIncome_1,Amt_1)`; **[I47]** 5d = `SUM(I37,I38,I46)`.
- **[K49]** 6 Balance = `K5-I6-I7-I9-I10-I11-I12-I15-I16-I17-I18-I29-I47-I48` (i.e. 1 minus 2a,2b,3a-3g,4a,4b,5d,5A).
- **[I59]** 8b = `sheet7.AmountOfExpenditure14A`; **[I60]** 9 Total = `SUM(I51:I59)`.
- **[K61]** 10 Adjusted P/L = `SUM(K49,I60)`.
- **[K62]** 11 Depreciation debited = `PL.DepreciationAmort+ManuFactureAcc_DepreciationOfFactoryMachinary` (1Evi of Manufacturing account + 52 of Part-A-P&L).
- **[I64]** 12i = `IF(DEP.TotalDepreciation>0,DEP.TotalDepreciation,0)` (column 6 of Schedule DEP); **[K66]** 12iii = `SUM(I64,I65)`.
- **[K67]** 13 = `AdjustedPLOthThanSpecBus + DepreciationDebPLCosAct - TotDeprAllowITAct` (10+11-12iii).
- **[I68–I73]** additions 14–19 pull from sheet6/sheet7 (TotAmtDisallUs36, …Us37, …Us40, …Us40A, TotAmtUs43b1, Intrestsec23).
- **[I75]** 21 = `MAX(0,SUM(I77:I85))`.
- **[I88]** 24 = `SUM(I89:I93)`.
- **[K94]** 25 ICDS increase = `SUM(sheet5.ProfDeviatDueAcctMeth,sheet6.EffectOnPL)`.
- **[K95]** 26 Total = `SUM(I68:I88,K94)-sheet11.DeemIncUs3380HHD80IA`.
- **[I98]** 28 = `ESRTOT.ExcessAmtOverDebPL` (X(4) of Schedule ESR); **[I99]** 29 = `sheet7.AmtDisallUs40PyNowAll`; **[I100]** 30 = `sheet7.TotAmtUs43b`.
- **[K106]** 32 ICDS decrease = `SUM(sheet5.ProfDeviatDueAcctMethb,sheet6.EffectOnPL4e)`.
- **[K107]** 33 Total = SUM of items 27–32; **[K108]** 34 Income = `K67+K95-K107` (13+26-33).
- **[I110–I119]** 35 deemed profits = `PL_61ii`, `PL_62ii`, `MAX(0,PL_63ii)`, `MAX(0,PL.NetProfit44B/44BB/44BBA/44BBC/44BBD)`.
- **[K122]** 35viii = `MAX(0,SUM(sheet11.Section44AD,44AE,44B,44BB,…))`; equals 35i to 35vii.
- **[K130]** 36 = `PLAftAdjDedBusOthThanSpec + TotDeemedProfitBusUs` (34+35viii).
- **[K131]** A37 = `SUM(BP_Chargeable_rule7,7A,7B1,7B1A,rule8,…)` (37a+…+37f).
- **[I137]** 37f = `sheet12.NetPLAftAdjBusOthThanSpec`.
- **[K138]** 38 = `MAX(0,(BP_4b_TotalProfitFromActivates - SUM(I132:I136)))`.
- **[K140]** 39 = `sheet10.NetPLFromSpecBus`; **[K143]** B42 = `NetPLFrmSpecBus + AdditionUs28to44DA - DeductUs28to44DA` (39+40-41).
- **[K145]** 43 = `sheet10.NetPLFromSpecifiedBus`; **[K148]** 46 = `NetPLFrmSpecifiedBus + AddSec28to44DA - DedSec28to44DA` (43+44-45); **[K152]** C48 = `ProfitLossSpecifiedBus - DeductUs35AD` (46-47).
- **[N154 / N155]** `MID(EI.Drpdn,1,4)` — first 4 chars of the selected clause (used for the "same drop down not selected twice" check).
- **[K157]** D = `MAX(0,AdjustedPLFrmSpecifiedBus)+MAX(0,AdjustedPLFrmSpecuBus)+NetPLBusOthTha…` (A37+B42+C48).
- **[I166]** E(i) = `ABS(MIN(0,sheet12.NetPLBusOthThanSpec7A7B7C))`; **[G167/G168]** = `MAX(0, AdjustedPLFrmSpecuBus / AdjustedPLFrmSpecifiedBus)`; **[I167]** = `MIN(LossSetOffOnBusLoss, IncOfCurYrUnderThatHeada)`; **[I168]** = `MIN((LossSetOffOnBusLoss-BusLossSetoffa), G168)`; **[K167/K168]** = income − loss set off; **[I169]** = `SUM(I167:I168)`; **[I170]** = `MAX(LossSetOffOnBusLoss - TotLossSetOffOnBus)`.
- Cross-schedule validators (from rules.json / VBA): A3b/A3c/A3d reductions cannot exceed income offered in Schedule HP/CG/OS; A6 = 1−2a−2b−3a…−5A; A9 = 7a…8b; A10 = 6+9; A12iii = 12i+12ii; A13 = 10+11−12iii; A14/15/16/17/18 tie to 6s/7j/8Aj/9F/11i of Part A-OI; A20 = 14 of OI; A25 = 3a+4d of OI; A32 = 3b+4e of OI; A26 = 14…25; A33 = 27…32; A34 = 13+26−33; A35viii = 35i…35vii; A36 = A34+A35viii; A37 = 37a…37f; B42 = 39+40−41; C47(46) = 43+44−45; C48 = 46−47; D = A37+B42+C48; 4a = 35(i)…35(vii). Exempt income reduced from PGBP must tally with Schedule EI. Dividend income at 5c cannot exceed A.3d(i). Nature in 5c cannot contain special characters `<> &`. Same clause cannot be selected twice in the 35AD(5) drop down.

## Dropdowns
Only one real value list on this sheet — the **section 35AD sub-section (5) clause** drop down (`BP_Drp`), applied to cells **G154:G155** (the two "Relevant clause of sub-section (5) of section 35AD" rows). Every value:
1. (Select)
2. (a) laying and operating a cross-country natural gas pipeline network for distribution, including storage facilities being an integral part of such network;
3. (aa) building and operating a new hotel of two-star or above category as classified by the Central Government;
4. (ab) building and operating a new hospital with at least one hundred beds for patients;
5. (ac) developing and building a housing project under a scheme for slum redevelopment or rehabilitation framed by the Central Government or a State Government, as the case may be, and which is notified by the Board in this behalf in accordance
6. (ad) developing and building a housing project under a scheme for affordable housing framed by the Central Government or a State Government, as the case may be, and notified by the Board in this behalf in accordance
7. (ae) new plant or in a newly installed capacity in an existing plant for production of fertilizer;
8. (af) setting up and operating an inland container depot or a container freight station notified or approved under the Customs Act, 1962 (52 of 1962);
9. (ag) bee-keeping and production of honey and beeswax;
10. (ah) setting up and operating a warehousing facility for storage of sugar;
11. (ai) laying and operating a slurry pipeline for the transportation of iron ore;
12. (aj) setting up and operating a semi-conductor wafer fabrication manufacturing unit, and which is notified by the Board in accordance with such guidelines as may be prescribed
13. (ak) developing or operating and maintaining or developing, operating and maintaining, any infrastructure facility; and
14. (b)  all other cases not falling under any of the above clauses.

(The remaining "dropdowns" listed by the utility for other BP cells are numeric input constraints / defaults — source `0`, `-99999999999999`, `50`, `-99999999999999` etc. — not selectable value lists, so they carry no enumerated values.)

## What repeats and what is one figure
- **Single figures (the overwhelming majority):** every numbered line in Parts A, B, C, D and the E table cells is exactly one integer. The whole schedule is a one-column adjustment ladder — there is no per-business repetition here.
- **Arrays (repeating):**
  - `BusinessIncOthThanSpec.IncCredPL.OtherExmptIncDtl.OtherExmptIncDtls[]` — item 5c "Any other exempt income": repeating rows of `OperatingRevenueName` (string) + `OperatingRevenueAmt` (integer), user-entered (spreadsheet range Name_1 / Amt_1). The first/fixed Dividend line is held separately as `OperatingDividendName` + `OperatingDividendAmt`.
  - `SpecifiedBusinessInc.DedUs35ADSubSec5Dtls[]` — the clause-of-35AD(5) selection: repeating rows of `DedUs35ADSubSec5` (string), fed by the two drop-down cells G154:G155.
- **Objects (single, grouped):** `IncRecCredPLOthHeadDtls`, `ProfitLossInclRefrdSec`, `ProfitFrmActCvrd`, `IncCredPL`, `ExpDebToPLOthHeadDtls`, `DepreciationAllowITAct32`, `DeemedProfitBusUs`, `SpecBusinessInc`, `SpecifiedBusinessInc`, `BusSetoffCurrYr.SpeculativeInc`, `BusSetoffCurrYr.SpecifiedInc`.

## Mandatory
Top-level `ITR3ScheduleBP` required blocks: **`BusinessIncOthThanSpec`, `SpecBusinessInc`, `SpecifiedBusinessInc`, `IncChrgUnHdProftGain`, `BusSetoffCurrYr`**.
Required leaf keys (all must be produced): under `BusinessIncOthThanSpec` — `ProfBfrTaxPL`, `NetPLFromSpecBus`, `NetPLFromSpecifiedBus`; `IncRecCredPLOthHeadDtls` (`Salary`, `HouseProperty`, `CapitalGains`, `OtherSources`, `Dividend`, `OtherThanDividend`, `Us115BBF`, `Us115BBG`, `115BBH`); `PLUs44sChapXIIG`; `ProfitLossInclRefrdSec` (`ProfitLossUs44AD`, `ProfitLossUs44ADA`, `ProfitLossUs44AE`, `ProfitLossUs44B`, `ProfitLossUs44BB`, `ProfitLossUs44BBA`, `ProfitLossUs44BBC`, `ProfitLossUs44BBD`, `ProfitLossUs44DA`); `TotalProfitFrmActCvrd`; `ProfitFrmActCvrd` (`ProfitFrmActCvrdUndrRule7`, `ProfitFrmActCvrdUndrRule7A`, `ProfitFrmActCvrdUndrRule7B1`, `ProfitFrmActCvrdUndrRule7B1A`, `ProfitFrmActCvrdUndrRule8`); `IncCredPL` (`FirmShareInc`, `AOPBOISharInc`, `OtherExmptIncDtl.OperatingDividendName`, `OtherExmptIncDtl.OperatingDividendAmt`, `OthExempInc`, `TotExempIncPL`); `BalancePLOthThanSpecBus`; `ExpDebToPLOthHeadDtls` (`Salary`, `HouseProperty`, `CapitalGains`, `OtherSources`, `Us115BBF`, `Us115BBG`, `115BBH`); `ExpDebToPLExemptInc`; `ExpDebToPLExemptIncDisAllwUs14A`; `TotExpDebPL`; `AdjustedPLOthThanSpecBus`; `DepreciationDebPLCosAct`; `DepreciationAllowITAct32` (`DepreciationAllowUs32_1_ii`, `DepreciationAllowUs32_1_i`, `TotDeprAllowITAct`); `AdjustPLAfterDeprOthSpecInc`; `AmtDebPLDisallowUs36`, `AmtDebPLDisallowUs37`, `AmtDebPLDisallowUs40`, `AmtDebPLDisallowUs40A`, `AmtDebPLDisallowUs43B`; `InterestDisAllowUs23SMEAct`; `DeemIncUs41`; `DeemIncUs3380HHD80IA`; `DeemIncUs43CA`; `OthItemDisallowUs28To44DA`; `AnyOthIncNotInclInExpDisallowPL`, `AnyOthIncNotInclInSalary`, `AnyOthIncNotInclInBonus`, `AnyOthIncNotInclInCommission`, `AnyOthIncNotInclInInterest`, `AnyOthIncNotInclInOthers`; `IncProfDecLossAccICDSAdj`; `TotAfterAddToPLDeprOthSpecInc`; `DeductUs32_1_iii`, `DebPLUs35ExcessAmt`, `AmtDisallUs40NowAllow`, `AmtDisallUs43BNowAllow`, `AnyOthAmtAllDeduct`, `DecProfIncLossAccICDSAdj`; `TotDeductionAmts`; `PLAftAdjDedBusOthThanSpec`; `DeemedProfitBusUs` (`Section44AD`, `Section44ADA`, `Section44AE`, `Section44B`, `Section44BB`, `Section44BBA`, `Section44BBC`, `Section44BBD`, `Section44DA`, `TotDeemedProfitBusUs`); `NetPLAftAdjBusOthThanSpec`; `NetPLBusOthThanSpec7A7B7C`; `ChrgblIncUndrRule7`, `DeemedChrgblIncUndrRule7A`, `DeemedChrgblIncUndrRule7B1`, `DeemedChrgblIncUndrRule7B1A`, `DeemedChrgblIncUndrRule8`; `IncomeOtherThanRule`; `BalIncDeemedFrmAgri`. Under `SpecBusinessInc` — `NetPLFrmSpecBus`, `AdditionUs28to44DA`, `DeductUs28to44DA`, `AdjustedPLFrmSpecuBus`. Under `SpecifiedBusinessInc` — `NetPLFrmSpecifiedBus`, `AddSec28to44DA`, `DedSec28to44DAOTDedSec35AD`, `ProfitLossSpecifiedBusiness`, `PLFrmSpecifiedBus`, and `DedUs35ADSubSec5Dtls[].DedUs35ADSubSec5`. Top-level `IncChrgUnHdProftGain`. Under `BusSetoffCurrYr` — `LossSetOffOnBusLoss`, `TotLossSetOffOnBus`, `LossRemainSetOffOnBus`, and both `SpeculativeInc` and `SpecifiedInc` each with `IncOfCurYrUnderThatHead`, `BusLossSetoff`, `IncOfCurYrAfterSetOff`.
Optional (not required) keys still supported: `IncCredPLNotChargable` (item 5A), `OtherExmptIncDtls[]` (`OperatingRevenueName`, `OperatingRevenueAmt`), `DeemIncUs32AD`, `DeemIncUs33AB`, `DeemIncUs33ABA`, `DeemIncUs35ABA`, `DeemIncUs35ABB`, `DeemIncUs40A3A`, `DeemIncUs72A`, `DeemIncUs80HHD`, `DeemIncUs80IA` (items 21a–21i), `SpecifiedBusinessInc.DeductionUs35AD` (item 47).

## Hidden rows — not built
These rows are marked hidden in the utility (H) and must NOT be surfaced as items. Column O/P/N cells are helper/temp cells that support formulas, also not items.
- **r97** — "Deduction allowable under section 32AD" (item 28 legacy; section sunset, hidden).
- **r101–r104** — "Deduction under section 35AC" and its sub-lines 31a "Amount, if any, debited to profit and loss account", 31b "Amount allowable as deduction", 31c "Excess amount allowable as deduction (31b – 31a)" (I104 = IF((I103-I102)<0,0,(I103-I102))); section 35AC withdrawn, hidden.
- **r116** — "Section 44BBB" (deemed profit line, H-code 36vii); hidden.
- **r117** — "Section 44D" (deemed profit line, H-code 36viii); hidden.
- **r121** — "Chapter-XII-G" (deemed profit line, H-code x); hidden.
- **r123** — "Profit or loss before deduction under section 10A/10AA (32 + 33xii)"; hidden.
- **r124** — "Deductions under section"; hidden header.
- **r125–r128** — "10A (6 of Schedule-10A)", "10AA (d of Schedule-10AA)", "10B (f of Schedule-10B)", "10BA (f of Schedule-10BA)"; hidden (SEZ/EOU deductions no longer in this ladder).
- **r129** — "Total (35i + 35ii)"; hidden.
- **r150–r151** — 46a "35AD(1)" and 46b "35AD(1A)"; hidden sub-lines feeding item 47 (`DeductionUs35AD`).
- **r158** — "Please include the income of the specified persons referred to in Schedule SPI while computing the income under this head"; hidden note.
- **r164** — helper `[P164] TempBusLoss`; hidden temp cell.
- Helper/temp cells on visible rows (not items): `[N6] FINALPBT`; `[O165] Normal Bus loss`; `[O166] After Speculative loss Set off`; `[O167] After Specified loss Setoff`; `[P166]`, `[P167]` temp set-off carry cells.
- Note row (visible, not an item): r171 — "Note : Please include the income of the specified persons referred to in Schedule SPI while computing the income under this head."

## What this means for the build
- BP is essentially **read-only / computed**: the section-builder should populate almost every cell from upstream schedules (Schedule P&L, Trading account, Part A-OI, Schedule DEP, Schedule ESR, Schedule EI, sheet10/11/12), not from fresh user input. The two genuine user inputs are (a) the "Any other exempt income" table under 5c (Nature + Amount, repeating) and (b) the section 35AD(5) clause drop-down (two rows).
- Enforce the identity chain exactly: 6 = 1−(2a+2b+3a…3g+4a+4b+5d+5A); 9 = 7a…8b; 10 = 6+9; 12iii = 12i+12ii; 13 = 10+11−12iii; 26 = 14…25; 33 = 27…32; 34 = 13+26−33; 35viii = 35i…35vii; 36 = 34+35viii; A37 = 37a…37f; B42 = 39+40−41; 46 = 43+44−45; C48 = 46−47; D = A37+B42+C48. All of these are checked by the department's category-A rules.
- Cross-schedule ties to honour: 35i/35ii/35iii must equal 61(ii)/62(ii)/63(ii) of Schedule P&L; 12i must equal column 6 of Schedule DEP; 11 must equal 1Evi of Manufacturing account + 52 of Part-A-P&L; 14–18/20/25/32 must equal the matching cells of Part A-OI; 28 must equal X(4) of Schedule ESR; exempt income reduced (5d) must tally with Schedule EI. B42 → 6ix of CFL, C48 → 7ix of CFL if losses.
- Validators to reproduce: Dividend amount in 5c cannot exceed 3d(i); 5c Nature cannot contain `<>` or `&`; the same 35AD(5) clause cannot be picked twice; A3b/A3c/A3d cannot exceed HP/CG/OS income.
- Item E (intra-head set off) is a computed mini-table: current-year business loss (from 7A/7B/7C net) is set off first against speculative income, then specified-business income; carry the remainder onward. Fill only the positive income column per its "Fill this column only if figure is zero or positive" guard, and the loss row only if negative.
- Do not render any hidden row (32AD, 35AC/31a-c, 44BBB, 44D, Chapter-XII-G, 10A/10AA/10B/10BA, 46a/46b, TempBusLoss) as a visible field.


## Additional visible rows — verbatim from the sheet (completeness)
Rows present on the utility sheet and captured here verbatim so every visible label is in the book:

- Dividend Income
- Share of income from AOP/ BOI
- Balance (1– 2a – 2b – 3a - 3b – 3c - 3d -3e-3f –3g- 4a-4b– 5d-5A)
- Total (7a + 7b + 7c + 7d + 7e +7f+7g+ 8a+8b)
- Deemed income under section 41
- Total (14 + 15 +16 +17 +18 +19 + 20 +21 + 22 + 23 + 24+25)
- Total (27+28+29+30+31+32)
- Section 44BB
- Section 44BBA
- Section44BBC
- Section 44BBD
- Section 44DA
