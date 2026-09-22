# Schedule BP — Computation of income from business or profession (ITR-5, A.Y. 2026-27)

Schema block: `CorpScheduleBP`. Sheet: **BP** (utility, visible). Section map: `{"section":"bp","blocks":["CorpScheduleBP"]}`.

All labels, formulas, dropdowns and schema keys below are quoted from `tools/dump.py` (rows / `--formulas` / `--dropdowns "BP"` / `--schema CorpScheduleBP` / `--leaves CorpScheduleBP`) and from `books/ITR-5/rules.json`. Nothing is from memory.

## The shape

Schedule BP computes income under the head "Profits and gains from Business or profession". It is one long single-column adjustment ladder plus small sub-tables, organised into lettered parts:

- **A** — Income "From business or profession other than speculative business and specified business" (items 1 → A37, then the Rule 7/7A/7B/8 agriculture split at 37a-37f and the agriculture balance at 38). This is by far the biggest part: it starts from "Profit before tax as per profit and loss account" (item 1), strips out amounts taxable under other heads / exempt / presumptive (items 2-5A) to reach the Balance (6), adds back expenses relatable to other heads and depreciation (7-13), adds statutory disallowances (14-25), subtracts statutory allowances (26-33), then re-adds presumptive/deemed profits (35) to reach the net (36/A37).
- **B** — Computation of income from speculative business (items 39 → B42).
- **C** — Computation of income from specified business under section 35AD (items 43 → C48, plus a drop-down at 49 for the relevant clause of sub-section (5) of section 35AD).
- **D** — Income chargeable under the head "Profits and gains from business or profession" (A37 + B42 + C48).
- **E (row 161-168)** — Intra-head set off of business loss of current year (a small table: loss to be set off, then speculative / specified / life-insurance income columns, total loss set off, loss remaining).

There is also a **hidden Part E "Computation of income from life insurance business referred to in section 115B"** (rows 156-160, all H) — not built.

Almost every amount cell is a single figure computed by formula from other schedules (P&L, PART A-OI, DEP_DCG, ESR, VDA, and the internal sheet5/sheet6/sheet7/sheet10/sheet11/sheet12 working sheets). The only user-entered repeating array is "Any other exempt income" under 5c, and the only value drop-down is the section 35AD sub-section (5) clause at row 153.

## The items

### Part A — From business or profession other than speculative business and specified business (`BusinessIncOthThanSpec`)

| Item | Field label | Type | Schema key | Rule / formula (cell) |
|---|---|---|---|---|
| A1 (r5) | Profit before tax as per profit and loss account (item 54, 62ii, 63ii, 64iv and 65iii 66(iv) & 67(ii) of Part A-P&L) | integer | `BusinessIncOthThanSpec.ProfBfrTaxPL` | K5 = SUM(PL.PBT, PL.TotPersumptiveInc44AD, PL.TotPersumptiveInc44ADA, PL.TotalPrsumptvIncUs44E, PL.NetIncomeF…). Rule 261/262: A1 must match sum of Sl.No.(54, 62ii, 63ii, 64v, 65iii, 66(iv) and 67(ii) of Part A-P&L). |
| A2a (r6) | Net profit or loss from speculative business included in 1 (enter –ve sign in case of loss) [Sl.no.12b of Trading account + Sl. No. 66iv of Schedule P&L] (in case of no account case) | integer | `BusinessIncOthThanSpec.NetPLFromSpecBus` | I6 = SUM(PL.NetIncomeFrmSpecActivity, TradingAcc_IntradayTradingIncome). Rule 272: A2a should equal the net profit/loss from speculative business. |
| A2b (r7) | Net profit or Loss from Specified Business u/s 35AD included in 1 (enter –ve sign in case of loss) | integer | `BusinessIncOthThanSpec.NetProfLossSpecifiedBus` | Rule 269: Sl.no.43 of BP should equal Sl.no.2b of BP. |
| A3 (r8) | Income/ receipts credited to profit and loss account considered under other heads of income/chargeable u/s 115BBF/ chargeable u/s 115BBG or chargeable u/s 115BBH | (header) | `BusinessIncOthThanSpec.IncRecCredPLOthHeadDtls` | Rule 270: Sum of A3 cannot be greater than sum of revenues in P&L / Trading Account. Rule 258: income reduced at Sl.No.3/5 cannot exceed income credited to P&L. |
| A3a (r9) | House Property | integer | `IncRecCredPLOthHeadDtls.HouseProperty` | min 0. Rule 209: A3a cannot be more than income offered in Schedule HP. |
| A3b (r10) | Capital Gains | integer | `IncRecCredPLOthHeadDtls.CapitalGains` | min 0. Rule 257: A3b cannot be more than income offered in Schedule CG. |
| A3c (r11) | Other Sources | integer | `IncRecCredPLOthHeadDtls.OtherSources` | I11 = sheet10.IncRecCredPLOthHeads4Div + sheet10.IncRecCredPLOthHeads4OthDiv. Rule 210: A3c cannot exceed income offered in Schedule OS. Rule 259: 3c must equal 3ci + 3cii. |
| A3ci (r12) | Dividend Income | integer | `IncRecCredPLOthHeadDtls.Dividend` | min 0. Rule 260: 3ci plus 5c "Dividend income" cannot exceed sl.no.14iii of P&L. |
| A3cii (r13) | Other than Dividend Income | integer | `IncRecCredPLOthHeadDtls.OtherThanDividend` | min 0 |
| A3d (r14) | u/s 115BBF | integer | `IncRecCredPLOthHeadDtls.UnderSec115BBF` | min 0. Rule 249: 115BBF can be claimed only by Resident. Rule 703: matches sl.no.3d in Schedule SI. |
| A3e (r15) | u/s 115BBG | integer | `IncRecCredPLOthHeadDtls.UnderSec115BBG` | min 0. Rule 703: 115BBG must match sl.no.3e of BP in Schedule SI. |
| A3f (r16) | u/s. 115BBH (net of Cost of Acquisition, if any) | integer | `IncRecCredPLOthHeadDtls.UnderSec115BBH` (optional) | I16 = MAX(0, VDA.TotalIncomeBI). Rule 267/268: must match Sl.No. A "Total" of Schedule VDA. Rule 712: matches sl.no.3f of BP in Schedule SI. |
| A4a (r17) | Profit or loss included in 1, which is referred to in section 44AD/44ADA/44AE/44B/44BB/44BBA/44BBC/44BBD/44DA/First Schedule of Income-tax Act (other than profit from life insurance business referred to in section 115B) | integer | `BusinessIncOthThanSpec.ProfitLossInclRefrdSec` (object) | I17 = MAX(0, SUM(H19:H31)). N17 = PL.GrsTrnOverOrReceipt + PL.TotPersumptiveInc44AD. Rule 238: A4a must match values mentioned for respective sections at A35. |
| A4a·44AD (r19) | 44AD | integer | `ProfitLossInclRefrdSec.ProfitLossUs44AD` | H19 = IF(AND(PL.TotPersumptiveInc44AD>0, MID(sheet1.ResidentialStatus1,1,3)="RES", MID(sheet1.SubStatus,1,1)=…), …). Residency-gated (Resident firm only). Rule 250: presumptive u/s 44AD/44ADA only by Resident partnership firm. |
| A4a·44ADA (r20) | 44ADA | integer | `ProfitLossInclRefrdSec.ProfitLossUs44ADA` | H20 = IF(AND(PL.TotPersumptiveInc44ADA>0, MID(sheet1.ResidentialStatus1,1,3)="RES", …), …). Resident-gated. |
| A4a·44AE (r21) | 44AE | integer | `ProfitLossInclRefrdSec.ProfitLossUs44AE` | H21 = sheet11.Section44AE |
| A4a·44B (r22) | 44B | integer | `ProfitLossInclRefrdSec.ProfitLossUs44B` | H22 = IF(MID(sheet1.ResidentialStatus1,1,3)="NRI", sheet11.Section44B, 0). NRI-only. |
| A4a·44BB (r23) | 44BB | integer | `ProfitLossInclRefrdSec.ProfitLossUs44BB` | H23 = IF(MID(sheet1.ResidentialStatus1,1,3)="NRI", Sheet11.Section44BB, 0). NRI-only. |
| A4a·44BBA (r24) | 44BBA | integer | `ProfitLossInclRefrdSec.ProfitLossUs44BBA` | H24 = IF(MID(sheet1.ResidentialStatus1,1,3)="NRI", sheet11.Section44BBA, 0). NRI-only. |
| A4a·44BBC (r27) | 44BBC | integer | `ProfitLossInclRefrdSec.ProfitLossUs44BBC` | H27 = IF(MID(sheet1.ResidentialStatus1,1,3)="NRI", sheet11.Section44BBC, 0). NRI-only. |
| A4a·44BBD (r28) | 44BBD | integer | `ProfitLossInclRefrdSec.ProfitLossUs44BBD` | H28 = IF(MID(sheet1.ResidentialStatus1,1,3)="NRI", sheet11.Section44BBD, 0). NRI-only. |
| A4a·44DA (r29) | 44DA | integer | `ProfitLossInclRefrdSec.ProfitLossUs44DA` | H29 = IF(MID(sheet1.ResidentialStatus1,1,3)="NRI", sheet12.Section44DA, 0). NRI-only. |
| A4a·First Sch (r31) | First schedule of income tax Act (other than profit from life insurance business referred to in section 115B) | integer | `ProfitLossInclRefrdSec.FirstSchITActOthr115B` | N31 = IF(AND(PL44AD>0, MID(sheet1.ResidentialStatus1,1,3)="RES", MID(sheet1.SubStatus,1,1)="1", …), …) |
| A4b (r32) | Profit and gains from life insurance business referred to in section 115B | integer | `BusinessIncOthThanSpec.PLUs44sChapXIIGOthrUs115B` | min 0 |
| A4c (r33) | Profit from activities covered under rule 7, 7A, 7B(1), 7B(1A) and 8 | integer | `BusinessIncOthThanSpec.TotalProfitFrmActCvrd` | I33 = MAX(0, SUM(H35:H39)). Rule 252/253: reducible only if business code is 1003/1002/1001 respectively. |
| A4c(i) (r35) | Profit from activities covered under rule 7 | integer | `ProfitFrmActCvrd.ProfitFrmActCvrdUndrRule7` | min 0 |
| A4c(ii) (r36) | Profit from activities covered under rule 7A | integer | `ProfitFrmActCvrd.ProfitFrmActCvrdUndrRule7A` | min 0. Rule 263: 37b should be minimum 35% of 4c(ii). |
| A4c(iii) (r37) | Profit from activities covered under rule 7B(1) | integer | `ProfitFrmActCvrd.ProfitFrmActCvrdUndrRule7B1` | min 0. Rule 264: 37c should be minimum 25% of 4c(iii). |
| A4c(iv) (r38) | Profit from activities covered under rule 7B(1A) | integer | `ProfitFrmActCvrd.ProfitFrmActCvrdUndrRule7B1A` | min 0. Rule 265: 37d should be minimum 40% of 4c(iv). |
| A4c(v) (r39) | Profit from activities covered under rule 8 | integer | `ProfitFrmActCvrd.ProfitFrmActCvrdUndrRule8` | min 0. Rule 266: 37e should be minimum 40% of 4c(v). |
| A5 (r40) | Income credited to Profit and Loss account (included in 1) which is exempt | (header) | `BusinessIncOthThanSpec.IncCredPL` | |
| A5a (r41) | share of income from firm(s) | integer | `IncCredPL.FirmShareInc` | min 0 |
| A5b (r42) | Share of income from AOP/ BOI | integer | `IncCredPL.AOPBOISharInc` | min 0 |
| A5c (r43) | Any other exempt income (specify nature and amount) | (object) | `IncCredPL.OtherExmptIncDtl` | Rule 211: A5 reduced cannot be more than income offered in Schedule EI. Rule 258: cannot exceed income credited to P&L. |
| A5c·Dividend name (r45) | Dividend income | string | `OtherExmptIncDtl.OperatingDividendName` | enum: `Dividend` |
| A5c·Dividend amt (r45, col I) | Amount (Dividend income) | integer | `OtherExmptIncDtl.OperatingDividendAmt` | min 0. Rule 268: at Sl.No.5c "Dividend income" amount cannot be more than Zero. |
| A5c (rows r46-48) | Any other exempt income — repeating Nature/Amount lines | array | `OtherExmptIncDtl.OtherExmptIncDtls[]` → `.OperatingRevenueName` (string), `.OperatingRevenueAmt` (integer) | user-entered array. G46:G48 default "50"; I46:I48 default 0. |
| A5c·Total (r49) | Total | integer | `IncCredPL.OthExempInc` | I49 = SUM(DivIncome_1, sheet11.OthExempIncamount) |
| A5d (r51) | Total exempt income (5a+5b+5c) | integer | `IncCredPL.TotExempInc` | I51 = SUM(sheet11.FirmShareInc, sheet11.OthExempInc, sheet11.AOPBOISharInc). Rule 241: 5d = share from firm(s) + share from AOP/BOI + Total(ci+cii+ciii). |
| A5A (r52) | Income or receipts credited to Profit and Loss account but not chargeable to tax under the Act. | integer | `BusinessIncOthThanSpec.IncCredPLNotChargable` (optional) | min 0 |
| A6 (r53) | Balance (1– 2a – 2b – 3a - 3b – 3c – 3d - 3e - 3f - 4a - 4b - 4c – 5d - 5A) | integer | `BusinessIncOthThanSpec.BalancePLOthThanSpecBus` | K53 = K5-I6-I7-I9-I10-I11-I14-I15-I16-I17-I32-I33-I51-I52. Rule 212. |
| A7 (r54) | Expenses debited to profit and loss account considered under other heads of income/related to income chargeable u/s 115BBF/ or u/s 115BBG or u/s 115BBH | (header) | `BusinessIncOthThanSpec.ExpDebToPLOthHeadDtls` | |
| A7a (r55) | House Property | integer | `ExpDebToPLOthHeadDtls.HouseProperty` | min 0 |
| A7b (r56) | Capital Gains | integer | `ExpDebToPLOthHeadDtls.CapitalGains` | min 0 |
| A7c (r57) | Other Sources | integer | `ExpDebToPLOthHeadDtls.OtherSources` | min 0 |
| A7d (r58) | u/s 115BBF | integer | `ExpDebToPLOthHeadDtls.UnderSec115BBF` | min 0 |
| A7e (r59) | u/s 115BBG | integer | `ExpDebToPLOthHeadDtls.UnderSec115BBG` | min 0 |
| A7f (r60) | u/s 115BBH (other than Cost of Acquisition) | integer | `ExpDebToPLOthHeadDtls.UnderSec115BBH` (optional) | min 0 |
| A8a (r61) | Expenses debited to profit and loss account which relate to exempt income | integer | `BusinessIncOthThanSpec.ExpDebToPLExemptInc` | min 0 |
| A8b (r62) | Expenses debited to profit and loss account which relate to exempt income and disallowed u/s 14A (16 of Part A-OI) | integer | `BusinessIncOthThanSpec.ExpDebToPLExemptIncDisAllwUs14A` | I62 = MAX(0, sheet7.AmtExpDisallowed). Rule 245: 8b should equal value at field 16 of Schedule OI. |
| A9 (r63) | Total (7a + 7b + 7c + 7d + 7e + 7f + 8a + 8b) | integer | `BusinessIncOthThanSpec.TotExpDebPL` | I63 = sheet11.ExpDebToPLExemptInc + sheet11.ExpDebToPLOthHeads2 + sheet11.ExpDebToPLOthHeads3 + sheet11.ExpDebTo…. Rule 213. |
| A10 (r64) | Adjusted profit or loss (6+9) | integer | `BusinessIncOthThanSpec.AdjustedPLOthThanSpecBus` | K64 = sheet11.BalancePLOthThanSpecBus + sheet11.TotExpDebPL. Rule 214. |
| A11 (r65) | Depreciation and Amortization debited to profit and loss account (item 53 of Schedule – P&L & E(vi) of Manufacturing Account) | integer | `BusinessIncOthThanSpec.DepreciationDebPLCosAct` | K65 = MAX(PL.DepreciationAmort + ManuFactureAcc_DepreciationOfFactoryMachinary, 0). Rule 239/240: = sl.no.53 of P&L + sl.no.1E(vi) of Manufacturing A/c. |
| A12 (r66) | Depreciation allowable under Income-tax Act | (header) | `BusinessIncOthThanSpec.DepreciationAllowITAct32` | |
| A12i (r67) | Depreciation allowable under section 32(1)(ii) and 32(1)(iia) (column 6 of Schedule-DEP) | integer | `DepreciationAllowITAct32.DepreciationAllowUs32_1_ii` | I67 = IF(DEP_DCG!$J$18>0, DEP_DCG!$J$18, 0). Rule 299: = Point No. 6 of Schedule DEP. |
| A12ii (r68) | Depreciation allowable under section 32(1)(i) (Make your own computation and enter) (Refer Appendix-IA of IT Rules) | integer | `DepreciationAllowITAct32.DepreciationAllowUs32_1_i` | min 0. Rule 251: claimable only where Nature of business is power sector (Code 05001/06008). |
| A12iii (r69) | Total (12i + 12ii) | integer | `DepreciationAllowITAct32.TotDeprAllowITAct` | K69 = SUM(I67:I68). Rule 253. |
| A13 (r70) | Profit or loss after adjustment for depreciation (10 +11 - 12iii) | integer | `BusinessIncOthThanSpec.AdjustPLAfterDeprOthSpecInc` | K70 = sheet11.AdjustedPLOthThanSpecBus + sheet11.DepreciationDebPLCosAct - sheet11.TotDeprAllowITAct. Rule 215. |
| A14 (r71) | Amounts debited to the profit and loss account, to the extent disallowable under section 36 (6t of Part A-OI) | integer | `BusinessIncOthThanSpec.AmtDebPLDisallowUs36` | I71 = 'PART - A OI'!$L$41. Rule 218: = 6t of Part A-OI. |
| A15 (r72) | Amounts debited to the profit and loss account, to the extent disallowable under section 37 (7j of Part A-OI) | integer | `BusinessIncOthThanSpec.AmtDebPLDisallowUs37` | I72 = 'PART - A OI'!$L$56. Rule 219: = 7j of Part-OI. |
| A16 (r73) | Amounts debited to the profit and loss account, to the extent disallowable under section 40 (8Aj of Part-OI) | integer | `BusinessIncOthThanSpec.AmtDebPLDisallowUs40` | I73 = 'PART - A OI'!$L$67. Rule 220: = 8Aj of Part-OI. |
| A17 (r74) | Amounts debited to the profit and loss account, to the extent disallowable under section 40A (9g of Part A-OI) | integer | `BusinessIncOthThanSpec.AmtDebPLDisallowUs40A` | I74 = 'PART - A OI'!$L$76. Rule 221: = 9g of Part A-OI. |
| A18 (r75) | Any amount debited to profit and loss account of the previous year but disallowable under section 43B (11i of Part A-OI) | integer | `BusinessIncOthThanSpec.AmtDebPLDisallowUs43B` | I75 = sheet7.TotAmtUs43b1. Rule 222: = 11I of Part-OI. |
| A19 (r76) | Interest disallowable under section 23 of the Micro, Small and Medium Enterprises Development Act, 2006 (17 of Part A- OI) | integer | `BusinessIncOthThanSpec.InterestDisAllowUs23SMEAct` | I76 = sheet7.Section23_MSME. Rule 271: A19 = Sl.No.17 of Part A-OI. |
| A20 (r77) | Deemed income under section 41 | integer | `BusinessIncOthThanSpec.DeemIncUs41` | min 0 |
| A21 (r78) | Deemed income under section 32AC/32AD/33AB/33ABA/35ABA/35ABB/35AC/40A(3A)/33AC/ 72A/80HHD/80-IA (21a+…+21l) | integer | `BusinessIncOthThanSpec.DeemIncUs3380HHD80IA` | I78 = SUM(I79:I90). Rule 223: A21 = sum of 21(i) to 21(xii). |
| A21a (r79) | 32AC | integer | `BusinessIncOthThanSpec.DeemIncUs32AC` (optional) | min 0 |
| A21b (r80) | 32AD | integer | `BusinessIncOthThanSpec.DeemIncUs32AD` (optional) | min 0 |
| A21c (r81) | 33AB | integer | `BusinessIncOthThanSpec.DeemIncUs33AB` (optional) | min 0 |
| A21d (r82) | 33ABA | integer | `BusinessIncOthThanSpec.DeemIncUs33ABA` (optional) | min 0 |
| A21e (r83) | 35ABA | integer | `BusinessIncOthThanSpec.DeemIncUs35ABA` (optional) | min 0 |
| A21f (r84) | 35ABB | integer | `BusinessIncOthThanSpec.DeemIncUs35ABB` (optional) | min 0 |
| A21g (r85) | 35AC | integer | `BusinessIncOthThanSpec.DeemIncUs35AC` (optional) | min 0 |
| A21h (r86) | 40A(3A) | integer | `BusinessIncOthThanSpec.DeemIncUs40A3A` (optional) | min 0 |
| A21i (r87) | 33AC | integer | `BusinessIncOthThanSpec.DeemIncUs33AC` (optional) | min 0 |
| A21j (r88) | 72A | integer | `BusinessIncOthThanSpec.DeemIncUs72A` (optional) | min 0 |
| A21k (r89) | 80HHD | integer | `BusinessIncOthThanSpec.DeemIncUs80HHD` (optional) | min 0 |
| A21l (r90) | 80-IA | integer | `BusinessIncOthThanSpec.DeemIncUs80IA` (optional) | min 0 |
| A22 (r91) | Deemed income under section 43CA | integer | `BusinessIncOthThanSpec.DeemIncUs43CA` | min 0 |
| A23 (r92) | Any other item or items of addition under section 28 to 44DB | integer | `BusinessIncOthThanSpec.OthItemDisallowUs28To44DB` | min 0. Rule 254: Sl.no.23 should be min of sum of amounts entered at sl.no.5a to 5d of Part A-OI. |
| A24 (r93) | Any other income not included in profit and loss account/any other expense not allowable (including income from salary, commission, bonus and interest from firms in which assessee is a partner) | integer | `BusinessIncOthThanSpec.AnyOthIncNotInclInExpDisallowPL` | I93 = SUM(I94:I98). Rule 224: A24 = sum of 24(a+b+c+d+e). |
| A24a (r94) | Salary | integer | `BusinessIncOthThanSpec.SalaryExpDisallowPL` | min 0 |
| A24b (r95) | Bonus | integer | `BusinessIncOthThanSpec.BonusExpDisallowPL` | min 0 |
| A24c (r96) | Commission | integer | `BusinessIncOthThanSpec.CommissionExpDisallowPL` | min 0 |
| A24d (r97) | Interest | integer | `BusinessIncOthThanSpec.InterestExpDisallowPL` | min 0 |
| A24e (r98) | Others | integer | `BusinessIncOthThanSpec.OthersExpDisallowPL` | min 0 |
| A25 (r99) | Increase in profit or decrease in loss on account of ICDS adjustments and deviation in method of valuation of stock (Column 3a + 4d of Part A- OI) | integer | `BusinessIncOthThanSpec.IncProfDecLossAccICDSAdj` | I99 = MAX(0, sheet5.ProfDeviatDueAcctMeth + sheet6.EffectOnPL). Rule 225: A25 = sum of 3a + 4d of Schedule OI. |
| A26 (r100) | Total (14 + 15 +16 +17 +18 +19 + 20 +21 + 22 + 23 + 24 + 25) | integer | `BusinessIncOthThanSpec.TotAfterAddToPLDeprOthSpecInc` | K100 = SUM(I71:I99) - sheet11.DeemIncUs3380HHD80IA - SUM(I94:I98). Rule 216. |
| A27 (r101) | Deduction allowable under section 32(1)(iii) | integer | `BusinessIncOthThanSpec.DeductUs32_1_iii` | min 0 |
| A28 (r103) | Amount of deduction under section 35 or 35CCC or 35CCD in excess of the amount debited to profit and loss account (item X(4) of Schedule ESR) (if amount deductible … is lower than amount debited to P&L account, it will go to item 24) | integer | `BusinessIncOthThanSpec.DebPLUs35ExcessAmt` | I103 = ESR!$G$14. Rule 226: A28 = total of column (4) of Schedule ESR. Rule 256: 24(e) should be minimum of absolute of sum of negative values of col 3 - col 2 in Sch ESR. |
| A29 (r104) | Any amount disallowed under section 40 in any preceding previous year but allowable during the previous year (8B of Part A-OI) | integer | `BusinessIncOthThanSpec.AmtDisallUs40NowAllow` | I104 = 'PART - A OI'!$L$68. Rule 227: A29 = 8B of Part-OI. |
| A30 (r105) | Any amount disallowed under section 43B in any preceding previous year but allowable during the previous year (10i of Part A-OI) | integer | `BusinessIncOthThanSpec.AmtDisallUs43BNowAllow` | I105 = sheet7.TotAmtUs43b. Rule 228: A30 = 10I of Part A-OI. |
| A31 (r110) | Any other amount allowable as deduction | integer | `BusinessIncOthThanSpec.AnyOthAmtAllDeduct` | min 0 |
| A32 (r111) | Decrease in profit or increase in loss on account of ICDS adjustments and deviation in method of valuation of stock (Column 3b + 4e of Schedule OI) | integer | `BusinessIncOthThanSpec.DecProfIncLossAccICDSAdj` | I111 = MAX(0, sheet5.LossDeviatDueAcctMeth + sheet6.NegEffectOnPL). Rule 229: A32 = sum of 3b + 4e of Schedule OI. |
| A33 (r112) | Total(27+28+29+30+31+32) | integer | `BusinessIncOthThanSpec.TotDeductionAmts` | K112 = SUM(I101:I105) + sheet11.AnyOthAmtAllDeduct + sheet11.LossOrProfICDS. Rule 217. |
| A34 (r113) | Income (13+26-33) | integer | `BusinessIncOthThanSpec.PLAftAdjDedBusOthThanSpec` | K113 = sheet11.AdjustPLAfterDeprOthSpecInc + sheet11.TotAfterAddToPLDeprOthSpecInc - sheet11.TotDeductionAmts. Rule 230: A34 = (13 + 26 - 33). |
| A35 (r114) | Profits and gains of business or profession deemed to be under - | (header) | `BusinessIncOthThanSpec.DeemedProfitBusUs` | |
| A35i (r115) | Section 44AD [62(ii) of schedule P&L] | integer | `DeemedProfitBusUs.Section44AD` | I115 = PL.TotPersumptiveInc44AD |
| A35ii (r116) | Section 44ADA [63(ii) of schedule P&L] | integer | `DeemedProfitBusUs.Section44ADA` | I116 = PL.TotPersumptiveInc44ADA |
| A35iii (r117) | Section 44AE [64(iv) of schedule P&L] | integer | `DeemedProfitBusUs.Section44AE` | I117 = PL.TotalPrsumptvIncUs44E |
| A35iv (r118) | Section 44B | integer | `DeemedProfitBusUs.Section44B` | I118 = PL.NetProfit44B |
| A35v (r119) | Section 44BB | integer | `DeemedProfitBusUs.Section44BB` | I119 = PL.NetProfit44BB |
| A35via (r120) | Section 44BBA | integer | `DeemedProfitBusUs.Section44BBA` | I120 = PL.NetProfit44BBA |
| A35vib (r123) | Section 44BBC | integer | `DeemedProfitBusUs.Section44BBC` | I123 = PL.NetProfit44BBC |
| A35vic (r124) | Section 44BBD | integer | `DeemedProfitBusUs.Section44BBD` | I124 = PL.NetProfit44BBD |
| A35vii (r125) | Section 44DA | integer | `DeemedProfitBusUs.Section44DA` | (from sheet12) |
| A35viii (r127) | First Schedule of Income-tax Act (other than 115B) | integer | `DeemedProfitBusUs.FirstSchTActOther` | |
| A35ix (r128) | Total (35i to 35viii) | integer | `DeemedProfitBusUs.TotDeemedProfitBusUs` | K128 = SUM(I115:I127). Rule 231: A35(ix) = sum of 35i to 35viii. |
| A36 (r129) | Net profit or loss from business or profession other than speculative and specified business (34 + 35ix) | integer | `BusinessIncOthThanSpec.NetPLAftAdjBusOthThanSpec` | K129 = sheet11.PLAftAdjDedBusOthThanSpec + sheet12.TotDeemedProfitBusUs. Rule 232: A36 = A34 + A35ix. |
| A37 (r130) | Net Profit or loss from business or profession other than speculative business and specified business after applying rule 7A, 7B or 8, if applicable (… If loss take the figure to 2i of item E) (37a+ 37b + 37c + 37d + 37e + 37f) | integer | `BusinessIncOthThanSpec.NetPLBusOthThanSpec7A7B7C` | K130 = SUM(I131:I136). Rule 233: A37 = sum of (37a + 37b + 37c + 37d + 37e + 37). Rule 515: CYLA 1iii = A37 only if A37 positive. |
| A37a (r131) | Chargeable income under Rule 7 | integer | `BusinessIncOthThanSpec.ChrgblIncUndrRule7` | min 0. Rule 262: 37a must tally. |
| A37b (r132) | Deemed chargeable Income under Rule 7A | integer | `BusinessIncOthThanSpec.DeemedChrgblIncUndrRule7A` | min 0. Rule 263: minimum 35% of 4c(ii). |
| A37c (r133) | Deemed chargeable Income under Rule 7B(1) | integer | `BusinessIncOthThanSpec.DeemedChrgblIncUndrRule7B1` | min 0. Rule 264: minimum 25% of 4c(iii). |
| A37d (r134) | Deemed chargeable Income under Rule 7B(1A) | integer | `BusinessIncOthThanSpec.DeemedChrgblIncUndrRule7B1A` | min 0. Rule 265: minimum 40% of 4c(iv). |
| A37e (r135) | Deemed chargeable Income under Rule 8 | integer | `BusinessIncOthThanSpec.DeemedChrgblIncUndrRule8` | min 0. Rule 266: minimum 40% of 4c(v). |
| A37f (r136) | Income other than Rule 7A, 7B & 8 (Item No. 36) | integer | `BusinessIncOthThanSpec.IncomeOtherThanRule` | I136 = sheet12.NetPLAftAdjBusOthThanSpec |
| A38 (r137) | Balance of income deemed to be from agriculture, after applying Rule 7, 7A, 7B(1), 7B(1A) and Rule 8 for the purpose of aggregation of income as per Finance Act [4c-(37a+ 37b + 37c + 37d + 37e)] | integer | `BusinessIncOthThanSpec.BalIncDeemedFrmAgri` | K137 = MAX(0, sheet12.TotalProfitFrmActCvrd - SUM(I131:I135)). Rule 240: A39 = [4c-(37a + 37b + 37c + 37d + 37e)]. |

### Part B — Computation of income from speculative business (`SpecBusinessInc`)

| Item | Field label | Type | Schema key | Rule / formula (cell) |
|---|---|---|---|---|
| B39 (r139) | Net profit or loss from speculative business as per profit or loss account | integer | `SpecBusinessInc.NetPLFrmSpecBus` | K139 = sheet10.NetPLFromSpecBus. Rule 247: B39 = Pt 2a "Net profit or loss from speculative business". |
| B40 (r140) | Additions in accordance with section 28 to 44DB | integer | `SpecBusinessInc.AdditionUs28to44DB` | min 0 |
| B41 (r141) | Deductions in accordance with section 28 to 44DB | integer | `SpecBusinessInc.DeductUs28to44DB` | min 0 |
| B42 (r142) | Income from speculative business (if loss, take the figure to 6xvi of schedule CFL)(39+40-41) | integer | `SpecBusinessInc.AdjustedPLFrmSpecuBus` | K142 = sheet12.NetPLFrmSpecBus + sheet12.AdditionUs28to44DA - sheet12.DeductUs28to44DA. Rule 234: B42 = B39 + B40 - B41. Rule 565: CFL loss = B42 in case of loss. |

### Part C — Computation of income from specified business under section 35AD (`IncSpecifiedBusiness`)

| Item | Field label | Type | Schema key | Rule / formula (cell) |
|---|---|---|---|---|
| C43 (r144) | Net profit or loss from specified business as per profit or loss account | integer | `IncSpecifiedBusiness.NetPLFrmSpecifiedBus` | K144 = sheet10.NetPLFromSpecifiedBus. Rule 269: C43 = 2b of BP. |
| C44 (r145) | Additions in accordance with section 28 to 44DB | integer | `IncSpecifiedBusiness.AddSec28to44DB` | min 0 |
| C45 (r146) | Deductions in accordance with section 28 to 44DB (other than deduction under section,- (i) 35AD, (ii) 32 or 35 on which deduction u/s 35AD is claimed) | integer | `IncSpecifiedBusiness.DedSec28to44DBOTDedSec35AD` | min 0 |
| C46 (r147) | Profit or loss from specified business (43+44-45) | integer | `IncSpecifiedBusiness.ProfitLossSpecifiedBusiness` | K147 = sheet12.NetPLFrmSpecifiedBus + sheet12.AddSec2844DA - sheet12.DedSec2844DA. Rule 235: C46 = C(43 + 44 - 45). |
| C47 (r148) | Deductions in accordance with section 35AD(1) | (header/computed) | `IncSpecifiedBusiness.DedSec35AD` (optional) | Rule 255: cannot be claimed by assessee opting for New Tax Regime. |
| C48 (r151) | Income from specified business (46-47) (if loss, take the figure to 7xvi of schedule CFL) | integer | `IncSpecifiedBusiness.ProfitLossSpecifiedBusFinal` | K151 = sheet12.ProfLossFromSpecifiedBus - sheet12.DeductUs35AD. Rule 236: C48 = C(46-47). Rule 566: CFL 7xix = C48 in case of loss. |
| C49 (r152/153) | Relevant clause of sub-section (5) of section 35AD which covers the specified business (to be selected from drop down menu) | array of string | `IncSpecifiedBusiness.DedUs35ADSubSec5Dtls[]` → `.DedUs35ADSubSec5` | drop-down at G153 (`BP_35AD_Dropdown`). Rule 246: nature at sl.no.49 should be selected if income/loss from specified business at C48 is entered. |

### Part D — Income chargeable under the head

| Item | Field label | Type | Schema key | Rule / formula (cell) |
|---|---|---|---|---|
| D (r155) | Income chargeable under the head 'Profits and gains' from business or profession' (A37+B42+C48) | integer | `IncChrgUnHdProftGain` | K155 = MAX(0, sheet12.AdjustedPLFrmSpecifiedBus) + MAX(0, sheet12.AdjustedPLFrmSpecuBus) + sheet12.NetPLBusOthTha…. Rule 237: D = A37 + B42 + C48. Rule 790/801: feeds Part B-TI. |

### Part E (row 161-168) — Intra head set off of business loss of current year (`BusSetoffCurrYr`)

Column headers (r162): "Type of Business income" | "Income of current year (Fill this column only if figure is zero or positive)" | "Business loss set off" | "Business income remaining after set off (3) = (1)-(2)".

| Item | Field label | Type | Schema key | Rule / formula (cell) |
|---|---|---|---|---|
| E(i) (r163) | Loss to be set off (Fill this row only if figure is negative) | integer | `BusSetoffCurrYr.LossSetOffOnBusLoss` | I163 = ABS(MIN(0, sheet12.NetPLBusOthThanSpec7A7B7C)) |
| E(ii) income (r164, col H) | Income from speculative business — income of current year | integer | `BusSetoffCurrYr.SpeculativeInc.IncOfCurYrUnderThatHead` | H164 = MAX(0, sheet12.AdjustedPLFrmSpecuBus). Rule 516: CYLA speculative income = 3ii of Table E. |
| E(ii) set off (r164, col I) | Income from speculative business — business loss set off | integer | `BusSetoffCurrYr.SpeculativeInc.BusLossSetoff` | I164 = MIN(I163, H164) |
| E(ii) remain (r164, col K) | Income from speculative business — remaining after set off | integer | `BusSetoffCurrYr.SpeculativeInc.IncOfCurYrAfterSetOff` | K164 = H164 - I164. Rule 242: remaining = (income of current year) - (business loss set off). |
| E(iii) income (r165, col H) | Income from specified business — income of current year | integer | `BusSetoffCurrYr.SpecifiedInc.IncOfCurYrUnderThatHead` | H165 = MAX(0, sheet12.AdjustedPLFrmSpecifiedBus). Rule 517: CYLA specified income = 3iii of Table E. |
| E(iii) set off (r165, col I) | Income from specified business — business loss set off | integer | `BusSetoffCurrYr.SpecifiedInc.BusLossSetoff` | I165 = MIN(I163-I164, H165) |
| E(iii) remain (r165, col K) | Income from specified business — remaining after set off | integer | `BusSetoffCurrYr.SpecifiedInc.IncOfCurYrAfterSetOff` | K165 = H165 - I165 |
| E(iv) (r166) | Profit and gains from life insurance business u/s 115B | (row present, no formula) | — (life-insurance set-off; no schema leaf mapped) | (row visible but life-insurance E-part above it is hidden) |
| E(v) (r167) | Total loss set off (ii + iii + iv) | integer | `BusSetoffCurrYr.TotLossSetOffOnBus` | I167 = SUM(I164:J166). Rule 243: Ev = Eii + Eiii + Eiv. |
| E(vi) (r168) | Loss remaining after set off (i – v) | integer | `BusSetoffCurrYr.LossRemainSetOffOnBus` | I168 = I163 - I167. Rule 244: Evi = Ei - Ev. Rule 506: CYLA 3i = 2vi of Table E. |

## The rules the sheet computes (with cell references)

Totals / ladders (Part A):
- **A1 (K5)** = `SUM(PL.PBT, PL.TotPersumptiveInc44AD, PL.TotPersumptiveInc44ADA, PL.TotalPrsumptvIncUs44E, PL.NetIncomeF…)` — pulls PBT plus presumptive incomes from Schedule P&L.
- **A2a (I6)** = `SUM(PL.NetIncomeFrmSpecActivity, TradingAcc_IntradayTradingIncome)`.
- **A3c (I11)** = `sheet10.IncRecCredPLOthHeads4Div + sheet10.IncRecCredPLOthHeads4OthDiv`.
- **A3f (I16)** = `MAX(0, VDA.TotalIncomeBI)` — cap at zero.
- **A4a (I17)** = `MAX(0, SUM(H19:H31))` — cap at zero; N17 = `PL.GrsTrnOverOrReceipt + PL.TotPersumptiveInc44AD`.
- **A4c (I33)** = `MAX(0, SUM(H35:H39))` — cap at zero.
- **A5c Total (I49)** = `SUM(DivIncome_1, sheet11.OthExempIncamount)`.
- **A5d (I51)** = `SUM(sheet11.FirmShareInc, sheet11.OthExempInc, sheet11.AOPBOISharInc)`.
- **A6 Balance (K53)** = `K5-I6-I7-I9-I10-I11-I14-I15-I16-I17-I32-I33-I51-I52`.
- **A8b (I62)** = `MAX(0, sheet7.AmtExpDisallowed)` — cap at zero.
- **A10 (K64)** = `sheet11.BalancePLOthThanSpecBus + sheet11.TotExpDebPL`.
- **A11 (K65)** = `MAX(PL.DepreciationAmort + ManuFactureAcc_DepreciationOfFactoryMachinary, 0)` — cap at zero.
- **A12i (I67)** = `IF(DEP_DCG!$J$18>0, DEP_DCG!$J$18, 0)` — positive-only.
- **A12iii (K69)** = `SUM(I67:I68)`.
- **A13 (K70)** = `sheet11.AdjustedPLOthThanSpecBus + sheet11.DepreciationDebPLCosAct - sheet11.TotDeprAllowITAct`.
- **A14-A17 (I71-I74)** pull from `'PART - A OI'` cells L41 / L56 / L67 / L76.
- **A18 (I75)** = `sheet7.TotAmtUs43b1`; **A19 (I76)** = `sheet7.Section23_MSME`.
- **A21 (I78)** = `SUM(I79:I90)`.
- **A24 (I93)** = `SUM(I94:I98)`.
- **A25 (I99)** = `MAX(0, sheet5.ProfDeviatDueAcctMeth + sheet6.EffectOnPL)` — cap at zero.
- **A26 (K100)** = `SUM(I71:I99) - sheet11.DeemIncUs3380HHD80IA - SUM(I94:I98)` (note the subtractions that remove A21 and A24 sub-lines already summed elsewhere).
- **A28 (I103)** = `ESR!$G$14`; **A29 (I104)** = `'PART - A OI'!$L$68`; **A30 (I105)** = `sheet7.TotAmtUs43b`.
- **A32 (I111)** = `MAX(0, sheet5.LossDeviatDueAcctMeth + sheet6.NegEffectOnPL)` — cap at zero.
- **A33 (K112)** = `SUM(I101:I105) + sheet11.AnyOthAmtAllDeduct + sheet11.LossOrProfICDS`.
- **A34 (K113)** = `sheet11.AdjustPLAfterDeprOthSpecInc + sheet11.TotAfterAddToPLDeprOthSpecInc - sheet11.TotDeductionAmts`.
- **A35 lines (I115-I124)** each pull the matching `PL.NetProfit44*` / `PL.TotPersumptiveInc44*` figure.
- **A35ix (K128)** = `SUM(I115:I127)`.
- **A36 (K129)** = `sheet11.PLAftAdjDedBusOthThanSpec + sheet12.TotDeemedProfitBusUs`.
- **A37 (K130)** = `SUM(I131:I136)`; A37f (I136) = `sheet12.NetPLAftAdjBusOthThanSpec`.
- **A38 (K137)** = `MAX(0, sheet12.TotalProfitFrmActCvrd - SUM(I131:I135))` — cap at zero.

Residency / regime gates (Part A item 4a):
- **A4a·44AD (H19)** and **A4a·44ADA (H20)** fire only when `PL.TotPersumptiveInc44AD/44ADA > 0` AND `MID(sheet1.ResidentialStatus1,1,3)="RES"` AND sub-status conditions — i.e. only for a **Resident partnership firm** (rules 250/151).
- **A4a·44B/44BB/44BBA/44BBC/44BBD/44DA (H22/H23/H24/H27/H28/H29)** each = `IF(MID(sheet1.ResidentialStatus1,1,3)="NRI", …, 0)` — **NRI-only**.
- **A28 (r103) "Deductions u/s 35AD(1)" and C47** cannot be claimed under the New Tax Regime (rule 255).

Part B / C / D:
- **B42 (K142)** = `sheet12.NetPLFrmSpecBus + sheet12.AdditionUs28to44DA - sheet12.DeductUs28to44DA`.
- **C46 (K147)** = `sheet12.NetPLFrmSpecifiedBus + sheet12.AddSec2844DA - sheet12.DedSec2844DA`.
- **C48 (K151)** = `sheet12.ProfLossFromSpecifiedBus - sheet12.DeductUs35AD`.
- **D (K155)** = `MAX(0, sheet12.AdjustedPLFrmSpecifiedBus) + MAX(0, sheet12.AdjustedPLFrmSpecuBus) + sheet12.NetPLBusOthTha…` — each speculative/specified component floored at zero before adding, i.e. losses do not reduce D (they flow to CFL instead).

Part E (set-off, current-year):
- **E(i) (I163)** = `ABS(MIN(0, sheet12.NetPLBusOthThanSpec7A7B7C))` — the current-year business loss, as a positive figure.
- **E(ii) (H164/I164/K164)**: H164 = `MAX(0, sheet12.AdjustedPLFrmSpecuBus)`; I164 = `MIN(I163, H164)`; K164 = `H164 - I164`.
- **E(iii) (H165/I165/K165)**: H165 = `MAX(0, sheet12.AdjustedPLFrmSpecifiedBus)`; I165 = `MIN(I163-I164, H165)`; K165 = `H165 - I165`. Set-off runs waterfall: speculative first, then specified, each capped by the remaining loss.
- **E(v) (I167)** = `SUM(I164:J166)`; **E(vi) (I168)** = `I163 - I167`.

## Dropdowns

The only value-list drop-down is at **G153** (`BP_35AD_Dropdown`) — Relevant clause of sub-section (5) of section 35AD:

```
(Select)
a-laying and operating a cross-country natural gas pipeline network for distribution, including storage facilities being an integral part of such network;
aa-building and operating a new hotel of two-star or above category as classified by the Central Government;
ab-building and operating a new hospital with at least one hundred beds for patients;
ac-developing and building a housing project under a scheme for slum redevelopment or rehabilitation framed by the Central Government or a State Government, as the case may be, and which is notified by the Board in this behalf in accordance with the guidelines as may be prescribed;
ad-developing and building a housing project under a scheme for affordable housing framed by the Central Government or a State Government, as the case may be, and notified by the Board in this behalf in accordance with the guidelines as may be prescribed;
ae-new plant or in a newly installed capacity in an existing plant for production of fertilizer;
af-setting up and operating an inland container depot or a container freight station notified or approved under the Customs Act, 1962 (52 of 1962);
ag-bee-keeping and production of honey and beeswax;
ah-setting up and operating a warehousing facility for storage of sugar;
ai-laying and operating a slurry pipeline for the transportation of iron ore;
aj-setting up and operating a semi-conductor wafer fabrication manufacturing unit, and which is notified by the Board in accordance with such guidelines as may be prescribed
ak-developing or operating and maintaining or developing, operating and maintaining, any infrastructure facility; and
b-all other cases not falling under any of the above clauses.
```

There is a one-value enum on the 5c Dividend nature: `OtherExmptIncDtl.OperatingDividendName` enum = **Dividend**.

All other "dropdowns" reported by `--dropdowns "BP"` have `values: null` — they are numeric spinner/min-value validators (source `"0"` for min-zero amount cells, source `"-99999999999999"` for the signed profit/loss cells, source `"50"`/`"0"` defaults on the 5c array rows G46:G48/I46:I48). No enumerated text to build.

## What repeats and what is one figure

- **Repeats (user array):** only **5c "Any other exempt income"** — `IncCredPL.OtherExmptIncDtl.OtherExmptIncDtls[]` with per-row `OperatingRevenueName` (string) + `OperatingRevenueAmt` (integer). Rows G46:G48 / I46:I48 are the repeat rows; the first Dividend line (`OperatingDividendName`/`OperatingDividendAmt`) is a fixed single line above the array.
- **Repeats (array of one selection):** **C49** — `IncSpecifiedBusiness.DedUs35ADSubSec5Dtls[]` (`DedUs35ADSubSec5`) holds the selected 35AD(5) clause. Present when specified-business income/loss is entered.
- **Everything else is one figure** — a single computed or single-entry amount cell. The whole A ladder, B, C, D and the E table are one-value-per-item.

## Mandatory (schema `required`)

Top-level `CorpScheduleBP` required blocks: `BusinessIncOthThanSpec`, `SpecBusinessInc`, `IncSpecifiedBusiness`, `IncChrgUnHdProftGain`, `BusSetoffCurrYr`.

Required leaves (marked `*` in `--schema`): all Part-A amount cells except the optional ones noted below; every `IncRecCredPLOthHeadDtls.*` except `UnderSec115BBH`; all `ProfitLossInclRefrdSec.*`; all `ProfitFrmActCvrd.*`; `IncCredPL.FirmShareInc/AOPBOISharInc/OthExempInc/TotExempInc` and `OtherExmptIncDtl.OperatingDividendName/OperatingDividendAmt`; the full disallowance/deduction ladder; all `DeemedProfitBusUs.*`; the Rule 7/7A/7B/8 chargeable-income leaves; all `SpecBusinessInc.*`; `IncSpecifiedBusiness.NetPLFrmSpecifiedBus/AddSec28to44DB/DedSec28to44DBOTDedSec35AD/ProfitLossSpecifiedBusiness/ProfitLossSpecifiedBusFinal`; `IncChrgUnHdProftGain`; and in `BusSetoffCurrYr`: `LossSetOffOnBusLoss`, `TotLossSetOffOnBus`, `LossRemainSetOffOnBus`.

**Optional leaves** (no `*`): `IncRecCredPLOthHeadDtls.UnderSec115BBH`, `ExpDebToPLOthHeadDtls.UnderSec115BBH`, `IncCredPLNotChargable`, the twelve `DeemIncUs32AC…DeemIncUs80IA` sub-lines of A21, `OtherExmptIncDtl.OtherExmptIncDtls[]` (the repeat array), `IncSpecifiedBusiness.DedSec35AD`, `IncSpecifiedBusiness.DedUs35ADSubSec5Dtls[]`, and the whole `BusSetoffCurrYr.SpeculativeInc` / `BusSetoffCurrYr.SpecifiedInc` sub-objects.

## Hidden rows — not built

The following rows are marked **H** by `tools/dump.py` and must not be built as items:

- **r25** `44BBB` and **r26** `44D` — extra sections under 4a not offered (H26 formula = 0).
- **r30** `44DB` (H30 = `sheet12.Section44DB`) — under 4a, hidden.
- **r102** `Deduction allowable under section 32AD` (item 27-series) — hidden.
- **r121** `Section 44BBB` and **r122** `Section 44D` (H) and **r126** `Section 44DB` — extra deemed-profit lines under A35, hidden (schema `DeemedProfitBusUs` has no 44BBB/44D/44DB leaf).
- **r149** `35AD(1)` (47a) and **r150** `35AD(1A)` (47b) — the 35AD(1) sub-split under C47, hidden.
- **r156-r160** the entire hidden Part **E "Computation of income from life insurance business referred to in section 115B"**: r157 Net Profit/loss (K157 = `MAX(0, sheet10.PLUs44sChapXIIGOthers)`), r158 Additions per s.30-43B, r159 Deductions per s.30-43B, r160 Income under s.115B (K160 = `sheet12.NetPrftorLoss115B + sheet12.AddAccordance43B - sheet12.DedAccordance43B`). None built.

## What this means for the build

- BP is a **mostly-computed** schedule: build the A→B→C→D ladder and the E set-off table as read-only computed cells sourced from Schedule P&L, PART A-OI, DEP (DEP_DCG!J18), ESR (G14), VDA, and the internal sheet5/6/7/10/11/12 working sheets. The engine must reproduce the SUM/MAX/MIN/IF formulas above exactly (note the several `MAX(0,…)` floors and the two `MIN(...)` waterfall set-offs in Part E).
- **User-editable inputs are few:** the 5c "Any other exempt income" array (Nature+Amount), the 5c Dividend line, and the C49 35AD(5) clause drop-down. Manual-entry amount cells such as A12ii (own-computation depreciation), A20, A22, A23, A24 sub-lines, A27, A31, B40/B41, C44/C45 also exist but most are cross-populated from Part A-OI/ESR/other schedules.
- **Enforce the gates in the build:** residency gating on 4a (Resident-firm for 44AD/44ADA; NRI-only for 44B/44BB/44BBA/44BBC/44BBD/44DA), the New-Regime block on 35AD(1)/C47, the Rule 7A/7B/8 minimum-percentage checks (35%/25%/40%/40% of the corresponding 4c line), and the many "cannot exceed the income offered in Schedule HP/CG/OS/EI/VDA" caps (rules 209-211, 257-260, 267-268).
- **Cross-schedule wiring:** A37 → CYLA 1iii (only if positive); Table E rows 3ii/3iii → CYLA speculative/specified; E(vi) 2vi → CYLA 3i; B42/C48 losses → CFL 6xvi/7xix; D → Part B-TI (2iii specified, and 3iv = 3d+3e+3f of BP); 3d/3e/3f → Schedule SI (115BBF/115BBG/115BBH).
- Never build the H rows listed above (44BBB/44D/44DB lines, 32AD deduction row, 35AD(1)/(1A) split, and the whole life-insurance Part E).
