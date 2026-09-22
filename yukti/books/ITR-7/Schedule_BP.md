# The book of Schedule BP — Computation of income from business or profession · ITR-7, A.Y. 2026-27

Read row by row from the utility's **Schedule BP** sheet and confirmed against the
CBDT ITR-7 schema block **CorpScheduleBP** (ITR-7's business income uses the corporate
BP block). This is the reconciliation that takes the surplus from the trust's
**Income and Expenditure account** and turns it into taxable business income, then
splits, sets off and totals it. Nothing here is invented; the appendices list every
schema leaf, every live row verbatim, and every dropdown value.

ITR-7's BP is a **leaner** version of the corporate BP: item 1 starts from the *Income
and Expenditure account* (not a company P&L); the presumptive block shows only section
44AE; and a **hidden Part** — "Computation of income chargeable to tax under section
11(4)" (rows 108–110) — sits between Part D and Part E for a trust's business
undertaking, but is hidden and not built (see §6).

---

## 1 · The shape — five parts, A to E

Header (G3): *"Computation of income from business or profession."*

| Part | What it is | Schema object |
|---|---|---|
| **A** | From business or profession other than speculative business and specified business | `BusinessIncOthThanSpec` |
| **B** | Computation of income from speculative business | `SpecBusinessInc` |
| **C** | Computation of income from specified business under section 35AD | `IncSpecifiedBusiness` |
| **D** | Income chargeable under the head 'Profits and gains from business or profession' (A36 + B40 + C46 + A3d) | `IncChrgUnHdProftGain` |
| **E** | Intra head set off of business loss of current year | `BusSetoffCurrYr` |

---

## 2 · Part A — business other than speculative and specified

### Items 1 to 6 — from surplus to the balance

| Item | Row | Label | Kind | Schema key |
|---|---|---|---|---|
| **1** | r5 | Profit before tax as per Income and Expenditure account (as applicable) | fed | `ProfBfrTaxPL` |
| **2a** | r6 | Net profit or loss from speculative business included in 1 (enter –ve sign in case of loss) | amount | `NetPLFromSpecBus` |
| **2b** | r7 | Net profit or loss from Specified Business u/s 35AD included in 1 (enter –ve sign in case of loss) | amount | `NetProfLossSpecifiedBus` |
| **3** | r8 | Income/ receipts credited to Profit & Loss account considered under other heads of income or chargeable u/s 115BBH | group | `IncRecCredPLOthHeadDtls` |
| **3a** | r9 | House property | amount | `HouseProperty` |
| **3b** | r10 | Capital Gains | amount | `CapitalGains` |
| **3c** | r11 | Other sources (i) + (ii) | amount | `OtherSources` |
| **3ci** | r12 | Dividend income | amount | `Dividend` |
| **3cii** | r13 | Other than Dividend income | amount | `OtherThanDividend` |
| **3d** | r14 | u/s 115BBH (net of Cost of Acquisition, if any) | amount | `UnderSec115BBH` |
| **4** | r15 | Profit or loss included in 1, which is referred to in section 44AE | amount | `PLUs44sChapXIIG` |
| **5** | r16 | Income credited to Profit & Loss account (included in 1) which is exempt | group | `IncCredPL` |
| **5a** | r17 | Share of income from firm(s) | amount | `FirmShareInc` |
| **5b** | r18 | Share of income from AOP/ BOI | amount | `AOPBOISharInc` |
| **5c** | r19 | Any other exempt income (Specify nature and Amount) | table | `OtherExmptIncDtl` |
| 5c — Dividend Income (r21) | r20–21 | SrNo · Nature · Amount; fixed Dividend Income row | table | `OperatingDividendName`, `OperatingDividendAmt`; free rows `OtherExmptIncDtls[]` → `OperatingRevenueName`, `OperatingRevenueAmt` |
| **5c total** | r26 | Total | computed | `OthExempInc` |
| **5d** | r27 | Total exempt income | computed | `TotExempInc` |
| **6** | r28 | Balance (1– 2a – 2b – 3a - 3b – 3c - 3d – 4–5d) | **computed** | `BalancePLOthThanSpecBus` |

### Items 7 to 13 — expenses under other heads, and depreciation

| Item | Row | Label | Schema key |
|---|---|---|---|
| **7** | r29 | Expenses debited to profit and loss account considered under other heads of income / related to income chargeable u/s 115BBH | group `ExpDebToPLOthHeadsInc` |
| **7a** | r30 | House property | `HouseProperty` |
| **7b** | r31 | Capital Gains | `CapitalGains` |
| **7c** | r32 | Other sources | `OtherSources` |
| **7d** | r33 | u/s 115BBH (other than Cost of Acquisition) | `UnderSec115BBH` |
| **9** | r35 | Total (7a + 7b + 7c + 7d) | **computed** `TotExpDebPL` |
| **10** | r36 | Adjusted profit or loss (6 + 8) | **computed** `AdjustedPLOthThanSpecBus` |
| **11** | r37 | Depreciation and amortization debited to profit and loss account | `DepreciationDebPLCosAct` |
| **12** | r38 | Depreciation allowable under Income-tax Act | group `DepreciationAllowITAct32` |
| **12i** | r39 | Depreciation allowable under section 32(1)(ii) and 32(1)(iia) | `DepreciationAllowUs32_1_ii` |
| **12ii** | r40 | Depreciation allowable under section 32(1)(i) (Make your own computation Refer Appendix-IA of IT Rules) | `DepreciationAllowUs32_1_i` |
| **12iii** | r41 | Total (11i + 11ii) | **computed** `TotDeprAllowITAct` |
| **13** | r42 | Profit or loss after adjustment for depreciation (9 + 10 − 11iii) | **computed** `AdjustPLAfterDeprOthSpecInc` |

### Items 14 to 25 — additions back to income

| Item | Row | Label | Schema key |
|---|---|---|---|
| **14** | r43 | Amounts debited to the profit and loss account, to the extent disallowable under section 36 | `AmtDebPLDisallowUs36` |
| **15** | r44 | …under section 37 | `AmtDebPLDisallowUs37` |
| **16** | r45 | …under section 40 | `AmtDebPLDisallowUs40` |
| **17** | r46 | …under section 40A | `AmtDebPLDisallowUs40A` |
| **18** | r47 | Any amount debited to profit and loss account of the previous year but disallowable under section 43B | `AmtDebPLDisallowUs43B` |
| **19** | r48 | Interest disallowable under section 23 of the Micro, Small and Medium Enterprises Development Act, 2006 | `InterestDisAllowUs23SMEAct` |
| **20** | r49 | Deemed income under section 41 | `DeemIncUs41` |
| **21** | r50 | Deemed income under section 32AC/ 32AD/ 33AB/ 33ABA/ 35ABA/ 35ABB/ 35AC/ 40A(3A)/ 33AC/ 72A | `Total33ABto35ABB` |
| **22** | r51 | Deemed income under section 43CA | `DeemIncUs43CA` |
| **23** | r52 | Any other item or items of addition under section 28 to 44DB | `OthItemDisallowUs28To44DA` |
| **24** | r53 | Any other income not included in profit and loss account / any other expense not allowable | `AnyOthIncNotInclInExpDisallowPL` |
| **25** | r54 | Total (13 + 14 + 15 + 16 + 17 + 18 + 19 + 20 + 21 + 22 + 23) | **computed** `TotAfterAddToPLDeprOthSpecInc` |

### Items 26 to 34 — deductions, then income

| Item | Row | Label | Schema key |
|---|---|---|---|
| **26** | r55 | Deduction allowable under section 32(1)(iii) | `DeductUs32_1_iii` |
| **27** | r57 | Amount allowable as deduction under section 32AC | `Amt32AC` |
| **28** | r58 | Amount of deduction under section 35 or 35CCC or 35CCD in excess of the amount debited to profit and loss account | `DebPLUs35ExcessAmt` |
| **29** | r59 | Any amount disallowed under section 40 in any preceding previous year but allowable during the previous year | `AmtDisallUs40NowAllow` |
| **30** | r60 | Any amount disallowed under section 43B in any preceding previous year but allowable during the previous year | `AmtDisallUs43BNowAllow` |
| **31** | r61 | Any other amount allowable as deduction | `AnyOthAmtAllDeduct` |
| **32** | r62 | Decrease in profit or increase in loss on account of ICDS adjustments and deviation in method of valuation of stock | `DecProfIncLossAccICDSAdj` |
| **33** | r79 | Total (25 + 26 + 27 + 28 + 29 + 30 + 31) | **computed** `TotDeductionAmts` |
| **34** | r80 | Income (12 + 24 − 32) | **computed** `PLAftAdjDedBusOthThanSpec` |

### Items 35 to A36 — presumptive income and the Part-A result

| Item | Row | Label | Schema key |
|---|---|---|---|
| **35** | r81 | Profits and gains of business or profession deemed to be under - | group `DeemedProfitBusUs` |
| **35 i** | r85 | Section 44AE | `Section44AE` |
| **35 total** | — | Total deemed profit | **computed** `TotDeemedProfitBusUs` |
| **36** | r86 | Net profit or loss from business or profession other than speculative business and specified business (35 + 36x) | `NetPLAftAdjBusOthThanSpec` |
| **A36** | r87 | Net Profit or loss from business or profession other than speculative business and specified business, after applying rule 7A, 7B or 8, if applicable | `NetPLBusOthThanSpec7A7B7C` |

---

## 3 · Part B — speculative business

| Item | Row | Label | Schema key |
|---|---|---|---|
| **37** | r89 | Net profit or loss from speculative business as per profit or loss account | `NetPLFrmSpecBus` |
| **38** | r90 | Additions in accordance with section 28 to 44DB | `AdditionUs28to44DA` |
| **39** | r91 | Deductions in accordance with section 28 to 44DB | `DeductUs28to44DA` |
| **B40** | r92 | Income from speculative business (37 + 38 − 39) | `AdjustedPLFrmSpecuBus` |

---

## 4 · Part C — specified business under section 35AD

| Item | Row | Label | Schema key |
|---|---|---|---|
| **41** | r94 | Net profit or loss from specified business as per profit or loss account | `NetPLFrmSpecifiedBus` |
| **42** | r95 | Additions in accordance with section 28 to 44DB | `AddSec28to44DA` |
| **43** | r96 | Deductions in accordance with section 28 to 44DB (other than deduction under section (i) 35AD, (ii) 32 or 35 on which deduction u/s 35AD is claimed) | `DedSec28to44DAOTDedSec35AD` |
| **44** | r97 | Profit or loss from specified business (41 + 42 − 43) | `ProfitLossSpecifiedBusiness` |
| **45** | r98 | Deductions in accordance with section 35AD(1) | `DedSec35AD` |
| **C46** | r101 | Income from specified business (44 − 45) | `ProfitLossSpecifiedBusFinal` |
| **—** | r102–104 | Relevant clause of sub-section (5) of section 35AD which covers the specified business (to be selected from drop down menu) | `DedUs35ADSubSec5Dtls[].DedUs35ADSubSec5` |

---

## 5 · Part D and Part E

### Part D — the head total

| Item | Row | Label | Schema key |
|---|---|---|---|
| **D** | r107 | Income chargeable under the head 'Profits and gains from business or profession' (A36 + B40 + C46 + A3d) | `IncChrgUnHdProftGain` |

### Part E — intra-head set-off of current-year business loss

Header (r111): *"Intra head set off of business loss of current year."* Columns:
**Income of current year (Fill this column only if figure is zero or positive)** ·
**Business loss set off** · **Business income remaining after set off**.

| Item | Row | Type of business income | Schema object |
|---|---|---|---|
| **(i)** | r114 | Loss to be set off (Fill this row only if figure is negative) | `LossSetOffOnBusLoss` |
| **(ii)** | r115 | Income from speculative business | `SpeculativeInc` |
| **(iii)** | r116 | Income from specified business | `SpecifiedInc` |
| **(iv)** | r117 | Total loss set off (ii + iii) | `TotLossSetOffOnBus` |
| **(v)** | r118 | Loss remaining after set off (i − iv) | `LossRemainSetOffOnBus` |

Each of rows (ii) and (iii) carries the three columns `IncOfCurYrUnderThatHead`,
`BusLossSetoff`, `IncOfCurYrAfterSetOff`.

---

## 6 · Hidden rows — not built, logged here

| Row | Item | Reason |
|---|---|---|
| r34H | 8 — Expenses debited to P&L which relate to exempt income | superseded / hidden in the utility; no separate schema key |
| r56H | Deduction allowable under section 32AD | 32AD investment allowance withdrawn; hidden, no schema key |
| r63H–r78H | Deemed income u/s 33AB/33ABA/35ABB (a, b, c); "Any other item of addition"; the Salary/Bonus/Commission/Interest/Others split (13a–13eii) and their totals; deductions u/s 32(1)(iii) and other | hidden sub-lines superseded by the leaner ITR-7 layout |
| r82H, r83H, r84H | Presumptive Section 44AD (19i), 44ADA (19ii) and a duplicate 44AE | hidden — ITR-7 shows only the single live Section 44AE at r85 |
| r99H, r100H | 35AD(1) (a) and 35AD(1A) (b) | hidden sub-lines of item 45 |
| r108H–r110H | **Part — Computation of income chargeable to tax under section 11(4)** (Income as shown in the accounts of business undertaking [refer section 11(4)] E35; Income chargeable to tax under section 11(4) [D34 − E35] E36) | a trust's section 11(4) business-undertaking computation; hidden in the utility, no `CorpScheduleBP` schema key — **excluded** |

---

## 7 · The substance

1. **Part A is a long reconciliation** from the Income-and-Expenditure surplus (item 1)
   through head-transfers (3, 7), exempt income (5), depreciation (11–13), additions
   (14–25) and deductions (26–33) to business income (34), then presumptive income (35)
   and the rule-7/8 result (A36). Every computed line — 6, 9, 10, 12iii, 13, 25, 33, 34,
   35 total, 36, A36 — is green.
2. **The 115BBH lines** (3d at r14, 7d at r33) carve the flat-rate VDA income out of the
   business reconciliation; the VDA figures come from Schedule VDA.
3. **Depreciation** at item 12i (32(1)(ii)/(iia)) is fed from the depreciation summary;
   12ii (32(1)(i)) is the power-sector own-computation line.
4. **Part C's 35AD clause drop-down** (r103–104) carries the thirteen specified-business
   clauses plus "(Select)", including the new **(aj) semi-conductor wafer fabrication**
   clause — seeded exactly as in the appendix.
5. **The section 11(4) hidden part** (r108–110) is a trust-specific business-undertaking
   computation that has no key in `CorpScheduleBP` and is not built.
6. **Part E** is the intra-head loss set-off matrix (speculative and specified income
   absorbing the current-year business loss).

---

## 8 · Cross-sheet feeds

**Into BP:** item 1 from the Income-and-Expenditure account; the 115BBH lines from
Schedule VDA; item 12i from the depreciation summary; disallowances (14–19) from Part
A-OI; the ICDS decrease (32) from the ICDS/OI chain.

**Out of BP:** **A36** (if loss) → CYLA / CFL; **B40** (if loss) → CFL speculative line;
**C46** (if loss) → CFL specified line; **D** = A36 + B40 + C46 + A3d → CYLA → BFLA →
Part B-TI (business head total).

---

## Appendix · Every schema leaf of block CorpScheduleBP (full paths)
`*` = required.
```
* BusinessIncOthThanSpec.ProfBfrTaxPL integer
* BusinessIncOthThanSpec.NetPLFromSpecBus integer
* BusinessIncOthThanSpec.NetProfLossSpecifiedBus integer
* BusinessIncOthThanSpec.IncRecCredPLOthHeadDtls.HouseProperty integer
* BusinessIncOthThanSpec.IncRecCredPLOthHeadDtls.CapitalGains integer
* BusinessIncOthThanSpec.IncRecCredPLOthHeadDtls.OtherSources integer
* BusinessIncOthThanSpec.IncRecCredPLOthHeadDtls.Dividend integer
* BusinessIncOthThanSpec.IncRecCredPLOthHeadDtls.OtherThanDividend integer
  BusinessIncOthThanSpec.IncRecCredPLOthHeadDtls.UnderSec115BBH integer
* BusinessIncOthThanSpec.PLUs44sChapXIIG integer
* BusinessIncOthThanSpec.IncCredPL.FirmShareInc integer
* BusinessIncOthThanSpec.IncCredPL.AOPBOISharInc integer
* BusinessIncOthThanSpec.IncCredPL.OtherExmptIncDtl.OperatingDividendName string
* BusinessIncOthThanSpec.IncCredPL.OtherExmptIncDtl.OperatingDividendAmt integer
  BusinessIncOthThanSpec.IncCredPL.OtherExmptIncDtl.OtherExmptIncDtls[] array
  BusinessIncOthThanSpec.IncCredPL.OtherExmptIncDtl.OtherExmptIncDtls[].OperatingRevenueName string
  BusinessIncOthThanSpec.IncCredPL.OtherExmptIncDtl.OtherExmptIncDtls[].OperatingRevenueAmt integer
* BusinessIncOthThanSpec.IncCredPL.OthExempInc integer
* BusinessIncOthThanSpec.IncCredPL.TotExempInc integer
* BusinessIncOthThanSpec.BalancePLOthThanSpecBus integer
* BusinessIncOthThanSpec.ExpDebToPLOthHeadsInc.HouseProperty integer
* BusinessIncOthThanSpec.ExpDebToPLOthHeadsInc.CapitalGains integer
* BusinessIncOthThanSpec.ExpDebToPLOthHeadsInc.OtherSources integer
  BusinessIncOthThanSpec.ExpDebToPLOthHeadsInc.UnderSec115BBH integer
* BusinessIncOthThanSpec.TotExpDebPL integer
* BusinessIncOthThanSpec.AdjustedPLOthThanSpecBus integer
* BusinessIncOthThanSpec.DepreciationDebPLCosAct integer
* BusinessIncOthThanSpec.DepreciationAllowITAct32.DepreciationAllowUs32_1_ii integer
* BusinessIncOthThanSpec.DepreciationAllowITAct32.DepreciationAllowUs32_1_i integer
* BusinessIncOthThanSpec.DepreciationAllowITAct32.TotDeprAllowITAct integer
* BusinessIncOthThanSpec.AdjustPLAfterDeprOthSpecInc integer
* BusinessIncOthThanSpec.AmtDebPLDisallowUs36 integer
* BusinessIncOthThanSpec.AmtDebPLDisallowUs37 integer
* BusinessIncOthThanSpec.AmtDebPLDisallowUs40 integer
* BusinessIncOthThanSpec.AmtDebPLDisallowUs40A integer
* BusinessIncOthThanSpec.AmtDebPLDisallowUs43B integer
* BusinessIncOthThanSpec.InterestDisAllowUs23SMEAct integer
* BusinessIncOthThanSpec.DeemIncUs41 integer
* BusinessIncOthThanSpec.Total33ABto35ABB integer
* BusinessIncOthThanSpec.DeemIncUs43CA integer
* BusinessIncOthThanSpec.OthItemDisallowUs28To44DA integer
* BusinessIncOthThanSpec.AnyOthIncNotInclInExpDisallowPL integer
* BusinessIncOthThanSpec.TotAfterAddToPLDeprOthSpecInc integer
* BusinessIncOthThanSpec.DeductUs32_1_iii integer
* BusinessIncOthThanSpec.Amt32AC integer
* BusinessIncOthThanSpec.DebPLUs35ExcessAmt integer
* BusinessIncOthThanSpec.AmtDisallUs40NowAllow integer
* BusinessIncOthThanSpec.AmtDisallUs43BNowAllow integer
* BusinessIncOthThanSpec.AnyOthAmtAllDeduct integer
* BusinessIncOthThanSpec.DecProfIncLossAccICDSAdj integer
* BusinessIncOthThanSpec.TotDeductionAmts integer
* BusinessIncOthThanSpec.PLAftAdjDedBusOthThanSpec integer
* BusinessIncOthThanSpec.DeemedProfitBusUs.Section44AE integer
* BusinessIncOthThanSpec.DeemedProfitBusUs.TotDeemedProfitBusUs integer
* BusinessIncOthThanSpec.NetPLAftAdjBusOthThanSpec integer
* BusinessIncOthThanSpec.NetPLBusOthThanSpec7A7B7C integer
* SpecBusinessInc.NetPLFrmSpecBus integer
* SpecBusinessInc.AdditionUs28to44DA integer
* SpecBusinessInc.DeductUs28to44DA integer
* SpecBusinessInc.AdjustedPLFrmSpecuBus integer
* IncSpecifiedBusiness.NetPLFrmSpecifiedBus integer
* IncSpecifiedBusiness.AddSec28to44DA integer
* IncSpecifiedBusiness.DedSec28to44DAOTDedSec35AD integer
* IncSpecifiedBusiness.ProfitLossSpecifiedBusiness integer
* IncSpecifiedBusiness.DedSec35AD integer
* IncSpecifiedBusiness.ProfitLossSpecifiedBusFinal integer
  IncSpecifiedBusiness.DedUs35ADSubSec5Dtls[] array
* IncSpecifiedBusiness.DedUs35ADSubSec5Dtls[].DedUs35ADSubSec5 string
* IncChrgUnHdProftGain integer
* BusSetoffCurrYr.LossSetOffOnBusLoss integer
* BusSetoffCurrYr.SpeculativeInc.IncOfCurYrUnderThatHead integer
* BusSetoffCurrYr.SpeculativeInc.BusLossSetoff integer
* BusSetoffCurrYr.SpeculativeInc.IncOfCurYrAfterSetOff integer
* BusSetoffCurrYr.SpecifiedInc.IncOfCurYrUnderThatHead integer
* BusSetoffCurrYr.SpecifiedInc.BusLossSetoff integer
* BusSetoffCurrYr.SpecifiedInc.IncOfCurYrAfterSetOff integer
* BusSetoffCurrYr.TotLossSetOffOnBus integer
* BusSetoffCurrYr.LossRemainSetOffOnBus integer
```

## Appendix · Every live row of the sheet, verbatim
```
r   3 : [C3] Schedule BP  |  [G3] Computation of income from business or profession
r   4 : [D4] A  |  [E4] From business or profession other than speculative business and specified business
r   5 : [F5] Profit before tax as per Income and Expenditure account (as applicable)
r   6 : [E6] 2a  |  [F6] Net profit or loss from speculative business included in 1 (enter –ve sign in case of loss)  |  [O6] 2a
r   7 : [E7] 2b  |  [F7] Net profit or loss from Specified Business u/s 35AD included in 1 (enter –ve sign in case of loss)  |  [O7] 2b
r   8 : [F8] Income/ receipts credited to Profit & Loss account considered under other heads of income or chargea
r   9 : [F9] a  |  [G9] House property  |  [O9] a
r  10 : [F10] b  |  [G10] Capital Gains  |  [O10] b
r  11 : [F11] c  |  [G11] Other sources (i) + (ii)  |  [O11] c
r  12 : [F12] i  |  [G12] Dividend income  |  [O12] i
r  13 : [F13] ii  |  [G13] Other than Dividend income  |  [O13] ii
r  14 : [F14] d  |  [G14] u/s 115BBH (net of Cost of Acquisition, if any)  |  [O14] d
r  15 : [F15] Profit or loss included in 1, which is referred to in section 44AE
r  16 : [F16] Income credited to Profit & Loss account (included in 1)which is exempt
r  17 : [F17] a  |  [G17] Share of income from firm(s)  |  [O17] 5a
r  18 : [F18] b  |  [G18] Share of income from AOP/ BOI  |  [O18] 5b
r  19 : [F19] c  |  [G19] Any other exempt income (Specify nature and Amount)
r  20 : [F20] SrNo  |  [G20] Nature  |  [O20] Amount
r  21 : [G21] Dividend Income
r  26 : [G26] Total  |  [O26] 5c
r  27 : [C27] INCOME FROM BUSINESS OR PROFESSION  |  [F27] d  |  [G27] Total exempt income  |  [O27] 5d
r  28 : [F28] Balance (1– 2a – 2b – 3a - 3b – 3c - 3d – 4–5d)
r  29 : [F29] Expenses debited to profit and loss account considered under other heads of income/ related to incom  |  [V29] .
r  30 : [E30] a  |  [F30] House property  |  [O30] a
r  31 : [E31] b  |  [F31] Capital Gains  |  [O31] b
r  32 : [E32] c  |  [F32] Other sources  |  [O32] c
r  33 : [E33] d  |  [F33] u/s 115BBH (other than Cost of Acquisition)  |  [O33] d
r  34H: [F34] Expenses debited to profit and loss account which relate to exempt income
r  35 : [F35] Total (7a + 7b + 7c +7d)
r  36 : [F36] Adjusted profit or loss (6+8)
r  37 : [F37] Depreciation and amortization debited to profit and loss account
r  38 : [F38] Depreciation allowable under Income-tax Act
r  39 : [E39] i  |  [F39] Depreciation allowable under section 32(1)(ii) and 32(1)(iia)  |  [O39] i
r  40 : [E40] ii  |  [F40] Depreciation allowable under section 32(1)(i) (Make your own computation Refer Appendix-IA of IT Rul  |  [O40] ii
r  41 : [E41] iii  |  [F41] Total (11i + 11ii)  |  [V41] iii
r  42 : [F42] Profit or loss after adjustment for depreciation (9 +10- 11iii)
r  43 : [F43] Amounts debited to the profit and loss account, to the extent disallowable under section 36
r  44 : [F44] Amounts debited to the profit and loss account, to the extent disallowable under section 37
r  45 : [F45] Amounts debited to the profit and loss account, to the extent disallowable under section 40
r  46 : [F46] Amounts debited to the profit and loss account, to the extent disallowable under section 40A
r  47 : [F47] Any amount debited to profit and loss account of the previous year but disallowable under section 43
r  48 : [F48] Interest disallowable under section 23 of the Micro, Small and Medium Enterprises Development Act,20
r  49 : [F49] Deemed income under section 41
r  50 : [F50] Deemed income under section 32AC/ 32AD/ 33AB/ 33ABA/ 35ABA/ 35ABB/ 35AC/ 40A(3A)/ 33AC/ 72A
r  51 : [F51] Deemed income under section 43CA
r  52 : [F52] Any other item or items of addition under section 28 to 44DB
r  53 : [F53] Any other income not included in profit and loss account/any other expense not allowable (including 
r  54 : [F54] Total (13+14 + 15 + 16 + 17 + 18 + 19 + 20 + 21+22 +23)
r  55 : [F55] Deduction allowable under section 32(1)(iii)
r  56H: [F56] Deduction allowable under section 32AD
r  57 : [F57] Amount allowable as deduction under section 32AC
r  58 : [F58] Amount of deduction under section 35 or 35CCC or 35CCD in excess of the amount debited to profit and
r  59 : [F59] Any amount disallowed under section 40 in any preceding previous year but allowable during the previ
r  60 : [F60] Any amount disallowed under section 43B in any preceding previous year but allowable during the prev
r  61 : [F61] Any other amount allowable as deduction
r  62 : [F62] Decrease in profit or increase in loss on account of ICDS adjustments and deviation in method of val
r  63H: [F63] Deemed income under section 33AB/33ABA/35ABB
r  64H: [F64] a  |  [G64] Section 33AB  |  [O64] 11a
r  65H: [F65] b  |  [G65] Section 33ABA  |  [O65] 11b
r  66H: [F66] c  |  [G66] Section 35ABB  |  [O66] 11c
r  67H: [F67] Any other item or items of addition under section 28 to 44DA
r  68H: [F68] Any other income not included in profit and loss account/any other expense not allowable (including 
r  69H: [F69] a  |  [G69] Salary  |  [O69] 13a
r  70H: [F70] b  |  [G70] Bonus  |  [O70] 13b
r  71H: [F71] c  |  [G71] Commission  |  [O71] 13c
r  72H: [F72] d  |  [G72] Interest  |  [O72] 13d
r  73H: [F73] e  |  [G73] Others  |  [O73] 13e
r  74H: [F74] ei  |  [G74] Dividend Income  |  [O74] 13ei
r  75H: [F75] eii  |  [G75] Other than Dividend Income  |  [O75] 13eii
r  76H: [F76] Total (10 +11+12+13)
r  77H: [F77] Deduction allowable under section 32(1)(iii)
r  78H: [F78] Any other amount allowable as deduction
r  79 : [F79] Total (25+26+27+28+29+30+31)
r  80 : [F80] Income (12+24-32)
r  81 : [F81] Profits and gains of business or profession deemed to be under -
r  82H: [F82] i  |  [G82] Section 44AD  |  [O82] 19i
r  83H: [F83] ii  |  [G83] Section 44ADA  |  [O83] 19ii
r  84H: [F84] i  |  [G84] Section 44AE
r  85 : [F85] i  |  [G85] Section 44AE
r  86 : [F86] Net profit or loss from business or profession other than speculative business and specified busines
r  87 : [F87] Net Profit or loss from business or profession other than speculative business and specified busines  |  [O87] A36  |  [V87] A36
r  88 : [D88] B  |  [E88] Computation of income from speculative business
r  89 : [F89] Net profit or loss from speculative business as per profit or loss account
r  90 : [F90] Additions in accordance with section 28 to 44DB
r  91 : [F91] Deductions in accordance with section 28 to 44DB
r  92 : [F92] Income from speculative business (37+38-39)
r  93 : [D93] C  |  [E93] Computation of income from specified business under section 35AD
r  94 : [F94] Net profit or loss from specified business as per profit or loss account
r  95 : [F95] Additions in accordance with section 28 to 44DB
r  96 : [F96] Deductions in accordance with section 28 to 44DB(other than deduction under section,- (i)35AD, (ii) 
r  97 : [F97] Profit or loss from specified business (41+42-43)
r  98 : [F98] Deductions in accordance with section 35AD(1)
r  99H: [F99] a  |  [G99] 35AD(1)
r 100H: [F100] b  |  [G100] 35AD(1A)
r 101 : [F101] Income from specified business (44-45)
r 102 : [F102] Relevant clause of sub-section (5) of section 35AD which covers the specified business (to be select
r 103 : [G103] (Select)
r 104 : [G104] (Select)
r 107 : [D107] D  |  [E107] Income chargeable under the head ‘Profits and gains from business or profession' (A36+B40+C46+A3d)  |  [V107] D48
r 108H: [D108] E  |  [E108] Computation of income chargeable to tax under section 11(4)
r 109H: [F109] Income as shown in the accounts of business under taking [refer section 11(4)]  |  [V109] E35
r 110H: [F110] Income chargeable to tax under section 11(4) [D34-E35]  |  [V110] E36
r 111 : [D111] E  |  [E111] Intra head set off of business loss of current year
r 112 : [F112] Sl.  |  [G112] Type of Business income  |  [O112] Income of current year (Fill this column only if figure is zero or positive)  |  [T112] Business loss set off
r 114 : [F114] i  |  [G114] Loss to be set off (Fill this row only if figure is negative)  |  [H114] Loss to be set off (Fill this row only if figure is negative)
r 115 : [F115] ii  |  [G115] Income from speculative business
r 116 : [F116] iii  |  [G116] Income from specified business
r 117 : [F117] iv  |  [G117] Total loss set off (ii + iii)
r 118 : [F118] v  |  [G118] Loss remaining after set off (i – iv)
```

## Appendix · Every dropdown value, verbatim

**Cells `G103:G104`** (source `BP.35AD`) — 14 values:
```
(Select) | (a)-laying and operating a cross-country natural gas pipeline network for distribution, including storage facilities being an integral part of such network; | (aa)-building and operating a new hotel of two-star or above category as classified by the Central Government; | (ab)-building and operating a new hospital with at least one hundred beds for patients; | (ac)-developing and building a housing project under a scheme for slum redevelopment or rehabilitation framed by the Central Government or a State Government, as the case may be, and which is notified by the Board in this behalf in accordance with the guidelines as may be prescribed; | (ad)-developing and building a housing project under a scheme for affordable housing framed by the Central Government or a State Government, as the case may be, and notified by the Board in this behalf in accordance with the guidelines as may be prescribed; | (ae)-new plant or in a newly installed capacity in an existing plant for production of fertilizer; | (af)-setting up and operating an inland container depot or a container freight station notified or approved under the Customs Act, 1962 (52 of 1962); | (ag)-bee-keeping and production of honey and beeswax;+I89 | (ah)-setting up and operating a warehousing facility for storage of sugar; | (ai)-laying and operating a slurry pipeline for the transportation of iron ore; | (aj)-setting up and operating a semi-conductor wafer fabrication manufacturing unit, and which is notified by the Board in accordance with such guidelines as may be prescribed | (ak)-developing or operating and maintaining or developing, operating and maintaining, any infrastructure facility; and | (b)-all other cases not falling under any of the above clauses.
```
