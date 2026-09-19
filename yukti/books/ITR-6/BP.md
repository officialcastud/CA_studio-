# The book of Schedule BP — Computation of income from business or profession · ITR-6, A.Y. 2026-27

Read row by row from the utility's **BP** sheet (158 rows, with the hidden-row
flags), every formula and item code in columns H / I / J, the 35AD drop-down, and
confirmed against the CBDT ITR-6 schema's `CorpScheduleBP` and the
validation-rules document. Nothing here is invented; every heading, item number
and section reference is the department's own.

Schedule BP is the **spine of the company return** — it takes the book profit
from Part A-P&L and turns it into taxable business income, pulling in the whole
depreciation chain (DPM/DOA → DEP → BP 12i), the scientific-research add-backs
(ESR → BP 24(c) / 29) and the ICDS adjustments (ICDS → OI → BP 25 / 33). This
book pairs with **DPM_DOA.md**, **DEP_DCG.md**, **ESR.md** and **ICDS.md**.

---

## 1 · The shape — five parts, A to E

Header (F3): *"Computation of income from business or profession."*

| Part | What it is | Schema object |
|---|---|---|
| **A** | From business or profession other than speculative business and specified business | `BusinessIncOthThanSpec` |
| **B** | Computation of income from speculative business | `SpecBusinessInc` |
| **C** | Computation of income from specified business under section 35AD | `IncSpecifiedBusiness` |
| **D** | Income chargeable under the head 'Profits and gains from Business or profession' (A38 + B43 + C49) | `IncChrgUnHdProftGain` |
| **E** | Intra head set off of business loss of current year | `BusSetoffCurrYr` |

A hidden Part E ("Computation of income from life insurance business referred to
in section 115B", rows 159–163) sits between Part D and the visible Part E — it is
hidden and **not built** (see §7).

---

## 2 · Part A — business other than speculative and specified (items 1 to 38)

### Items 1 to 6 — from book profit to the balance

| Item | Label | Row | Kind | Schema key |
|---|---|---|---|---|
| **1** | Profit before tax as per statement of profit and loss (item 53, 61(ii) and 62(b) of Part A-P&L) / (item 53 of Part A-P&L – Ind AS) (as applicable) | r5 | fed from P&L | `ProfBfrTaxPL` |
| **2a** | Net profit or loss from speculative business included in 1 (Enter -ve sign in case of loss) (Sl. No. 12b of Schedule Trading Account or Trading-Ind As account) | r6 | amount | `NetPLFromSpecBus` |
| **2b** | Net profit or Loss from Specified Business u/s 35AD included in 1 (enter –ve sign in case of loss) | r7 | amount | `NetProfLossSpecifiedBus` |
| **3** | Income/ receipts credited to statement of profit and loss considered under other heads of income or chargeable u/s 115BBF or chargeable u/s 115BBG or chargeable u/s 115BBH | r8 | group | `IncRecCredPLOthHeadDtls` |
| **3a** | House Property | r9 | amount | `HouseProperty` |
| **3b** | Capital Gains | r10 | amount | `CapitalGains` |
| **3c** | Other sources (i) + (ii) | r11 | amount | `OtherSources` |
| **3ci** | Dividend income | r12 | amount | `Dividend` |
| **3cii** | Other than Dividend income | r13 | amount | `OtherThanDividend` |
| **3d** | u/s 115BBF | r14 | amount | `UnderSec115BBF` |
| **3e** | u/s 115BBG | r15 | amount | `UnderSec115BBG` |
| **3f** | u/s 115BBH (net of Cost of acquisition, if any) | r16 | amount | `PLUs44sChapXIIGOthrUs115B` |
| **4a** | Profit or loss included in 1, which is referred to in section 44AE/44B/44BB/44BBA/44BBB/44BBC/44BBD/44D/44DA/Chapter-XII-G/ First Schedule of Income Tax Act (other than 115B) | r17 | group | `ProfitLossInclRefrdSec` |
| 4ai | 44AE | r19 | amount | `ProfitLossUs44AE` |
| 4aii | 44B | r20 | amount | `ProfitLossUs44B` |
| 4aiii | 44BB | r21 | amount | `ProfitLossUs44BB` |
| 4aiv | 44BBA | r22 | amount | `ProfitLossUs44BBA` |
| 4av | 44BBB | r23 | amount | `ProfitLossUs44BBB` |
| 4ava | 44BBC | r24 | amount | `ProfitLossUs44BBC` |
| 4avb | 44BBD | r25 | amount | `ProfitLossUs44BBD` |
| 4avi | 44D | r26 | amount | `ProfitLossUs44D` |
| 4avii | 44DA | r27 | amount | `ProfitLossUs44DA` |
| 4aviii | Chapter-XII-G | r28 | amount | `ProfitChapterXIIG` |
| 4aix | First Schedule of Income Tax Act (other than 115B) | r29 | amount | `FirstSchITActOthr115B` |
| **4b** | Profit and gains from life insurance business referred to in section 115B | r30 | amount | `PLUs44sChapXIIGUs115B` |
| **4c** | Profit from activities covered under rule 7, 7A, 7B(1), 7B(1A) and 8 | r31 | group | `ProfitFrmActCvrd` |
| 4ci | Profit from activities covered under rule 7 | r33 | amount | `ProfitFrmActCvrdUndrRule7` |
| 4cii | Profit from activities covered under rule 7A | r34 | amount | `ProfitFrmActCvrdUndrRule7A` |
| 4ciii | Profit from activities covered under rule 7B(1) | r35 | amount | `ProfitFrmActCvrdUndrRule7B1` |
| 4civ | Profit from activities covered under rule 7B(1A) | r36 | amount | `ProfitFrmActCvrdUndrRule7B1A` |
| 4cv | Profit from activities covered under rule 8 | r37 | amount | `ProfitFrmActCvrdUndrRule8` |
| **4d** | Profit from eligible business of selling raw diamonds (refer rule 10TIA) | r38 | amount | `ProfitFrmEligBus10TIA` |
| **5** | Income credited to statement of Profit and Loss (included in 1) which is exempt | r39 | group | `IncCredPL` |
| **5a** | Share of income from firm(s) | r40 | amount | `FirmShareInc` |
| **5b** | Share of income from AOP/ BOI | r41 | amount | `AOPBOISharInc` |
| **5c** | Any other exempt income (specify nature and amount) | r42 | table (Nature / Amount; Dividend income) | `OtherExmptIncDtl` → `OperatingDividendName`, `OperatingDividendAmt` |
| 5c iv | Total | r49 | computed | `OthExempInc` |
| **5d** | Total exempt income | r50 | computed | `TotExempInc` |
| **5A** | Income or receipts credited to statement of profit and loss but not chargeable to tax under the Act | r51 | amount | (carried in the Part-A balance) |
| **6** | Balance (1 − 2a − 2b − 3a − 3b − 3c − 3d − 3e − 3f − 4a − 4b − 4c − 4d − 5d − 5A) | r52 | **computed** | `BalancePLOthThanSpecBus` |

### Items 7 to 13 — expenses under other heads, and depreciation

| Item | Label | Row | Kind | Schema key |
|---|---|---|---|---|
| **7** | Expenses debited to statement of profit and loss considered under other heads of income / related to income chargeable u/s 115BBF or u/s 115BBG or u/s 115BBH | r53 | group | `ExpDebToPLOthHeadDtls` |
| **7a** | House Property | r54 | amount | `HouseProperty` |
| **7b** | Capital Gains | r55 | amount | `CapitalGains` |
| **7c** | Other Sources | r56 | amount | `OtherSources` |
| **7d** | u/s 115BBF | r57 | amount | `UnderSec115BBF` |
| **7e** | u/s 115BBG | r58 | amount | `UnderSec115BBG` |
| **7f** | u/s 115BBH (other than Cost of acquisition) | r59 | amount | (in the expenses group) |
| **8a** | Expenses debited to statement of profit and loss which relate to exempt income | r60 | amount | `ExpDebToPLExemptInc` |
| **8b** | Expenses debited to statement of profit and loss which relate to exempt income and disallowed u/s 14A (16 of Part A-OI) | r61 | amount | `ExpDebToPLExemptIncDisAllwUs14A` |
| **9** | Total (7a + 7b + 7c + 7d + 7e + 7f + 8a + 8b) | r62 | **computed** | `TotExpDebPL` |
| **10** | Adjusted profit or loss (6 + 9) | r63 | **computed** | `AdjustedPLOthThanSpecBus` |
| **11** | Depreciation and amortization debited to statement of profit and loss | r64 | amount | `DepreciationDebPLCosAct` |
| **12** | Depreciation allowable under Income-tax Act | r65 | group | `DepreciationAllowITAct32` |
| **12i** | Depreciation allowable under section 32(1)(ii) and 32(1)(iia) (column 6 of Schedule-DEP) | r66 | fed from DEP | `DepreciationAllowUs32_1_ii` |
| **12ii** | Depreciation allowable under section 32(1)(i) (Make your own computation refer Appendix IA of Income Tax Rules) | r67 | amount | `DepreciationAllowUs32_1_i` |
| **12iii** | Total (12i + 12ii) | r68 | **computed** | `TotDeprAllowITAct` |
| **13** | Profit or loss after adjustment for depreciation (10 + 11 − 12iii) | r69 | **computed** | `AdjustPLAfterDeprOthSpecInc` |

### Items 14 to 26 — additions back to income

| Item | Label | Row | Schema key |
|---|---|---|---|
| **14** | Amounts debited to the statement of profit and loss, to the extent disallowable under section 36 (6s of Part A-OI) | r70 | `AmtDebPLDisallowUs36` |
| **15** | Amounts debited to the statement of profit and loss, to the extent disallowable under section 37 (7k of Part A-OI) | r71 | `AmtDebPLDisallowUs37` |
| **16** | Amounts debited to the statement of profit and loss, to the extent disallowable under section 40 (8Aj of Part A-OI) | r72 | `AmtDebPLDisallowUs40` |
| **17** | Amounts debited to the statement of profit and loss, to the extent disallowable under section 40A (9f of Part A-OI) | r73 | `AmtDebPLDisallowUs40A` |
| **18** | Any amount debited to statement of profit and loss of the previous year but disallowable under section 43B (11i of Part A-OI) | r74 | `AmtDebPLDisallowUs43B` |
| **19** | Interest disallowable under section 23 of the Micro, Small and Medium Enterprises Development Act, 2006 (17 of Part A-OI) | r75 | `InterestDisAllowUs23SMEAct` |
| **20** | Deemed income under section 41 | r76 | `DeemIncUs41` |
| **21** | Deemed income under section 32AC / 32AD / 33AB / 33ABA / 35ABA / 35ABB / 35AC / 40A(3A) / 33AC / 72A / 80HHD / 80-IA | r77 | `DeemIncUs3380HHD80IA` |
| 21a–21l | 32AC · 32AD · 33AB · 33ABA · 35ABA · 35ABB · 35AC · 40A(3A) · 33AC · 72A · 80HHD · 80-IA | r78–r89 | (sub-lines of item 21) |
| **22** | Deemed income under section 43CA | r90 | `DeemIncUs43CA` |
| **23** | Any other item of addition under section 28 to 44DB | r91 | `OthItemDisallowUs28To44DA` |
| **24** | Any other income not included in statement of profit and loss / any other expense not allowable (including income from commission and interest from firms in which company is a partner) | r92 | `AnyOthIncNotInclInExpDisallowPL` |
| **24a** | Commission | r95 | `CommissionExpDisallowPL` |
| **24b** | Interest | r96 | `InterestExpDisallowPL` |
| **24c** | Others | r97 | `OthersExpDisallowPL` |
| **25** | Increase in profit or decrease in loss on account of ICDS adjustments and deviation in method of valuation of stock (Column 3a + 4d of Schedule OI) | r98 | `IncProfDecLossAccICDSAdj` |
| **26** | Total (14 + 15 + 16 + 17 + 18 + 19 + 20 + 21 + 22 + 23 + 24 + 25) | r99 | **computed** | `TotAfterAddToPLDeprOthSpecInc` |

### Items 27 to 36 — deductions, then income

| Item | Label | Row | Schema key |
|---|---|---|---|
| **27** | Deduction allowable under section 32(1)(iii) | r100 | `DeductUs32_1_iii` |
| **28** | Amount allowable as deduction under section 32AC | r102 | `Amt32AC` |
| **29** | Amount of deduction under section 35 or 35CCC or 35CCD in excess of the amount debited to statement of profit and loss (item X(4) of Schedule ESR) (if amount deductible under section 35 or 35CCC or 35CCD is lower than amount debited to P&L account, it will go to item 24) | r103 | `DebPLUs35ExcessAmt` |
| **30** | Any amount disallowed under section 40 in any preceding previous year but allowable during the previous year (8B of Part A-OI) | r104 | `AmtDisallUs40NowAllow` |
| **31** | Any amount disallowed under section 43B in any preceding previous year but allowable during the previous year (10i of Part A-OI) | r105 | `AmtDisallUs43BNowAllow` |
| **32** | Any other amount allowable as deduction | r110 | `AnyOthAmtAllDeduct` |
| **33** | Decrease in profit or increase in loss on account of ICDS adjustments and deviation in method of valuation of stock (Column 3b + 4e of Schedule OI) | r111 | `DecProfIncLossAccICDSAdj` |
| **34** | Total (27 + 28 + 29 + 30 + 31 + 32 + 33) | r112 | **computed** | `TotDeductionAmts` |
| **35** | Income (13 + 26 − 34) | r113 | **computed** | `PLAftAdjDedBusOthThanSpec` |

### Item 36 — profits and gains deemed to be under presumptive sections

| Item | Label | Row | Schema key |
|---|---|---|---|
| **36** | Profits and gains of business or profession deemed to be under - | r114 | `DeemedProfitBusUs` |
| **36i** | Section 44AE (61(ii) of schedule P&L) | r115 | `Section44AE` |
| **36ii** | Section 44B | r116 | `Section44B` |
| **36iii** | Section 44BB | r117 | `Section44BB` |
| **36iv** | Section 44BBA | r118 | `Section44BBA` |
| **36v** | Section 44BBB | r119 | `Section44BBB` |
| **36va** | Section 44BBC | r120 | `Section44BBC` |
| **36vb** | Section 44BBD | r121 | `Section44BBD` |
| **36vi** | Section 44D | r122 | `Section44D` |
| **36vii** | Section 44DA | r123 | `Section44DA` |
| **36viii** | Chapter-XII-G (tonnage) | r124 | `ChapterXIIG` |
| **36ix** | First Schedule of Income-tax Act (other than 115B) | r125 | `FirstSchTActOther` |
| **36x** | Total (36i to 36ix) | r128 | **computed** | `TotDeemedProfitBusUs` |

### Items 37 to 38 — the Part-A result

| Item | Label | Row | Schema key |
|---|---|---|---|
| **37** | Net profit or loss from business or profession other than speculative and specified business (35 + 36x) | r129 | `NetPLAftAdjBusOthThanSpec` |
| **A38** | Net Profit or loss from business or profession other than speculative business and specified business, after applying rule 7A, 7B or 8, if applicable (if rule 7A,7B or 8 is not applicable, enter same figure as in 37) (if loss take the figure to 2i of item F) (38a + 38b + 38c + 38d + 38e + 38f) | r130 | `NetPLBusOthThanSpec7A7B7C` |
| **38a** | Income Chargeable under Rule 7 | r131 | `ChrgblIncUndrRule7` |
| **38b** | Deemed Income chargeable under Rule 7A | r132 | `DeemedChrgblIncUndrRule7A` |
| **38c** | Deemed Income chargeable under Rule 7B(1) | r133 | `DeemedChrgblIncUndrRule7B1` |
| **38d** | Deemed Income chargeable under Rule 7B(1A) | r134 | `DeemedChrgblIncUndrRule7B1A` |
| **38e** | Deemed Income chargeable under Rule 8 | r135 | `DeemedChrgblIncUndrRule8` |
| **38f** | Income other than Rule 7A, 7B & 8 (Item No. 37) | r136 | `IncomeOtherThanRule` |
| **—** | Balance of income deemed to be from agriculture, after applying Rule 7, 7A, 7B(1), 7B(1A) and Rule 8 for the purpose of aggregation of income as per Finance Act [4c − (38a + 38b + 38c + 38d + 38e)] | r137 | `BalIncDeemedFrmAgri` |

---

## 3 · Part B — speculative business (items 40 to 43)

| Item | Label | Row | Schema key |
|---|---|---|---|
| **40** | Net profit or loss from speculative business as per profit or loss account | r139 | `NetPLFrmSpecBus` |
| **41** | Additions in accordance with section 28 to 44DB | r140 | `AdditionUs28to44DA` |
| **42** | Deductions in accordance with section 28 to 44DB | r141 | `DeductUs28to44DA` |
| **B43** | Income from speculative business (40 + 41 − 42) (if loss, take the figure of 6xix of schedule CFL) | r142 | `AdjustedPLFrmSpecuBus` |

---

## 4 · Part C — specified business under section 35AD (items 44 to 49)

| Item | Label | Row | Schema key |
|---|---|---|---|
| **44** | Net profit or loss from specified business as per profit or loss account | r144 | `NetPLFrmSpecifiedBus` |
| **45** | Additions in accordance with section 28 to 44DB | r145 | `AddSec28to44DA` |
| **46** | Deductions in accordance with section 28 to 44DB (other than deduction under section,- (i) 35AD, (ii) 32 or 35 on which deduction u/s 35AD is claimed) | r146 | `DedSec28to44DAOTDedSec35AD` |
| **47** | Profit or loss from specified business (44 + 45 − 46) | r147 | `ProfitLossSpecifiedBusiness` |
| **48** | Deductions in accordance with section 35AD(1) | r148 | `DedSec35AD1` |
| 48a | 35AD(1) | r149 (**hidden**) | (sub-line of item 48) |
| 48b | 35AD(1A) | r150 (**hidden**) | (sub-line of item 48) |
| **C49** | Income from specified business (if loss, take the figure to 7xix of schedule CFL) (47 − 48) | r151 | `ProfitLossSpecifiedBusFinal` |
| **—** | Relevant clause of sub-section (5) of section 35AD which covers the specified business (to be selected from drop down menu) | r152 | `DedUs35ADSubSec5Dtls[].DedUs35ADSubSec5` |

---

## 5 · Part D and Part E

### Part D — the head total

| Item | Label | Row | Schema key |
|---|---|---|---|
| **D** | Income chargeable under the head 'Profits and gains from Business or profession' (A38 + B43 + C49) | r155 | `IncChrgUnHdProftGain` |

**Note (r156, hidden):** *"Please include the income of the specified persons
referred to in Schedule SPI while computing the income under this head."*

### Part E — intra-head set-off of current-year business loss

Header (r165): *"Intra head set off of business loss of current year."* Columns
(r166): **Income of current year (Fill this column only if figure is zero or
positive) (1)** · **Business loss set off (2)** · **Business income remaining
after set off (3) = (1) − (2)**.

| Item | Type of business (col D) | Row | Schema object |
|---|---|---|---|
| **(i)** | Loss to be set off (Fill this row only if figure is negative) | r167 | `LossSetOffOnBusLoss` |
| **(ii)** | Income from speculative business | r168 | `SpeculativeInc` |
| **(iii)** | Income from specified business | r169 | `SpecifiedInc` |
| **(iv)** | Profit and gains from life insurance business u/s 115B | r170 | `ProfGainUs115B` |
| **(iva)** | Income of Foreign Company from eligible business of selling raw diamond (refer rule 10TIA) | r171 | `IncmForeignCompRule10TIA` |
| **(v)** | Total loss set off (ii + iii + iv) | r172 | `TotLossSetOffOnBus` |
| **(vi)** | Loss remaining after set off (i – v) | r173 | `LossRemainSetOffOnBus` |

Each of rows (ii), (iii), (iv), (iva) carries the three columns
`IncOfCurYrUnderThatHead`, `BusLossSetoff`, `IncOfCurYrAfterSetOff`.

---

## 6 · The 35AD drop-down (item at r152, G153) — `BP_35AD_Dropdown`

The one drop-down on the sheet with a value list — the specified-business clause
under section 35AD(5). Values, verbatim:

- (Select)
- a-laying and operating a cross-country natural gas pipeline network for distribution, including storage facilities being an integral part of such network;
- aa-building and operating a new hotel of two-star or above category as classified by the Central Government;
- ab-building and operating a new hospital with at least one hundred beds for patients;
- ac-developing and building a housing project under a scheme for slum redevelopment or rehabilitation framed by the Central Government or a State Government, as the case may be, and which is notified by the Board in this behalf in accordance with the guidelines as may be prescribed;
- ad-developing and building a housing project under a scheme for affordable housing framed by the Central Government or a State Government, as the case may be, and notified by the Board in this behalf in accordance with the guidelines as may be prescribed;
- ae-new plant or in a newly installed capacity in an existing plant for production of fertilizer;
- af-setting up and operating an inland container depot or a container freight station notified or approved under the Customs Act, 1962 (52 of 1962);
- ag-bee-keeping and production of honey and beeswax;
- ah-setting up and operating a warehousing facility for storage of sugar;
- ai-laying and operating a slurry pipeline for the transportation of iron ore;
- ak-developing or operating and maintaining or developing, operating and maintaining, any infrastructure facility; and
- b-all other cases not falling under any of the above clauses.

---

## 7 · Hidden rows — not built, logged here

| Row | Item | Reason |
|---|---|---|
| r93H | 24a — Salary | superseded sub-line of item 24 (companies use the Commission/Interest/Others split at r95–97); hidden |
| r94H | 24b — Bonus | as above |
| r101H | 28 — Deduction allowable under section 32AD | 32AD investment allowance withdrawn (no schema key); hidden |
| r126H | 36ixa — u/s 115B | hidden sub-line of the presumptive total |
| r127H | 36ixb — Others | hidden sub-line |
| r149H | 48a — 35AD(1) | hidden sub-line of item 48 |
| r150H | 48b — 35AD(1A) | hidden sub-line of item 48 |
| r156H | NOTE (Schedule SPI specified persons) | note text, not a field |
| r159H–r163H | **Part E — Computation of income from life insurance business referred to in section 115B** (i Net Profit/loss; ii Additions in accordance with section 30 to 43B; iii Deductions in accordance with section 30 to 43B; iv Income from life insurance business under section 115B) | applies only to a life-insurance company; hidden, no `CorpScheduleBP` schema block — **excluded** |

---

## 8 · The rules the schedule enforces (from the rules document)

| Rule | What it enforces |
|---|---|
| **A195** | Part A item 1 (Profit before tax) = item 53 + 61(ii) + 62(b) of Part A-P&L |
| **A196** | item 12(i) "Depreciation allowable under section 32(1)(ii) and 32(1)(iia)" = item 6 of **Schedule DEP** (the DEP total) |
| **A197** | item A25 = column 3a + 4d of **Part A-OI** (the ICDS-increase + 145A stock deviation) |
| **A205** | item A13 (Profit after adjustment for depreciation) = 10 + 11 − 12iii |
| **A212** | item A29 = total of column (4) of **Schedule ESR** (the 35/35CCC/35CCD excess) |
| **A228** | item "Depreciation allowable under section 32(1)(i)" can be claimed only if the nature of business is the power sector |
| **A235** | item 24(c) = the absolute value of the total of the negative "col 3 − col 2" values across **Schedule ESR** (the 35-deduction shortfall) |
| **A255** | "Deductions in accordance with section 35AD(1)", and ESR deductions u/s 35(1)(ii)/(iia)/(iii)/35(2AA)/35CCC, **cannot be claimed if 115BAA or 115BAB is opted** |
| **A198–A200** | income reduced at A3a/A3b/A3c to be offered under HP / CG / OS — the receipts shown in those schedules must not be less than the amounts removed here |

---

## 9 · Cross-sheet feeds — in and out (the depreciation chain and the ICDS/ESR feeds)

**Into BP:**

| Item | From | Rule |
|---|---|---|
| **1** Profit before tax | Part A-P&L (item 53, 61(ii), 62(b)) / Part A-P&L Ind AS (item 53) | A195 |
| **2a** speculative P&L | Trading Account / Trading-Ind AS (Sl. No. 12b) | — |
| **12i** depreciation allowable u/s 32(1)(ii)/(iia) | **Schedule DEP** total (column 6) | A196 |
| **14–19, 22, 30, 31** disallowances | Part A-OI (6s, 7k, 8Aj, 9f, 11i, 17, 8B, 10i) | — |
| **24(c)** Others (35-deduction shortfall) | **Schedule ESR** negative col(3)−col(2) | A235 |
| **25** increase on ICDS + 145A | **Part A-OI** 3a + 4d (OI 3a = **Schedule ICDS** XI(3)) | A197, A163 |
| **29** 35/35CCC/35CCD excess | **Schedule ESR** column (4) total | A212 |
| **33** decrease on ICDS + 145A | **Part A-OI** 3b + 4e (OI 3b = **Schedule ICDS** XI(4)) | A164 |
| **3b, deemed STCG on depreciable assets** context | **Schedule DCG** (section-50 gains) reaches Schedule CG, not BP directly | A317–A322 |

**Out of BP:**

| Item | To |
|---|---|
| **A38** (if loss) | Schedule CYLA item 2i / CFL |
| **B43** (if loss) | Schedule CFL 6xix |
| **C49** (if loss) | Schedule CFL 7xix |
| **D** = A38 + B43 + C49 | Schedule CYLA → BFLA → Part B-TI (business head total) |

The full depreciation chain: **DPM / DOA** (block working) → **DEP** (depreciation
summary) → **BP 12i**; and **DPM / DOA** → **DCG** (section-50 gains) → **Schedule
CG**. The scientific-research add-backs: **ESR** col(4) → **BP 29**, ESR shortfall
→ **BP 24(c)**. The ICDS chain: **ICDS** XI(3)/XI(4) → **OI 3a/3b** → **BP 25/33**.

---

## 10 · What is mandatory — the required schema leaf keys

The schema marks required, across `CorpScheduleBP`, these distinct leaf keys
(each written at zero where the company has no figure):

```
BusinessIncOthThanSpec: ProfBfrTaxPL, NetPLFromSpecBus, NetProfLossSpecifiedBus,
  HouseProperty, CapitalGains, OtherSources, Dividend, OtherThanDividend,
  UnderSec115BBF, UnderSec115BBG, PLUs44sChapXIIGOthrUs115B,
  ProfitLossUs44AE, ProfitLossUs44B, ProfitLossUs44BB, ProfitLossUs44BBA,
  ProfitLossUs44BBB, ProfitLossUs44BBC, ProfitLossUs44BBD, ProfitLossUs44D,
  ProfitLossUs44DA, ProfitChapterXIIG, FirstSchITActOthr115B, PLUs44sChapXIIGUs115B,
  TotalProfitFrmActCvrd, ProfitFrmEligBus10TIA, ProfitFrmActCvrdUndrRule7,
  ProfitFrmActCvrdUndrRule7A, ProfitFrmActCvrdUndrRule7B1,
  ProfitFrmActCvrdUndrRule7B1A, ProfitFrmActCvrdUndrRule8, FirmShareInc,
  AOPBOISharInc, OperatingDividendName, OperatingDividendAmt, OthExempInc,
  TotExempInc, BalancePLOthThanSpecBus, ExpDebToPLExemptInc,
  ExpDebToPLExemptIncDisAllwUs14A, TotExpDebPL, AdjustedPLOthThanSpecBus,
  DepreciationDebPLCosAct, DepreciationAllowUs32_1_ii, DepreciationAllowUs32_1_i,
  TotDeprAllowITAct, AdjustPLAfterDeprOthSpecInc, AmtDebPLDisallowUs36,
  AmtDebPLDisallowUs37, AmtDebPLDisallowUs40, AmtDebPLDisallowUs40A,
  AmtDebPLDisallowUs43B, InterestDisAllowUs23SMEAct, DeemIncUs41,
  DeemIncUs3380HHD80IA, DeemIncUs43CA, OthItemDisallowUs28To44DA,
  AnyOthIncNotInclInExpDisallowPL, CommissionExpDisallowPL, InterestExpDisallowPL,
  OthersExpDisallowPL, IncProfDecLossAccICDSAdj, TotAfterAddToPLDeprOthSpecInc,
  DeductUs32_1_iii, Amt32AC, DebPLUs35ExcessAmt, AmtDisallUs40NowAllow,
  AmtDisallUs43BNowAllow, AnyOthAmtAllDeduct, DecProfIncLossAccICDSAdj,
  TotDeductionAmts, PLAftAdjDedBusOthThanSpec, Section44AE, Section44B, Section44BB,
  Section44BBA, Section44BBC, Section44BBD, Section44BBB, Section44D, Section44DA,
  ChapterXIIG, FirstSchTActOther, TotDeemedProfitBusUs, NetPLAftAdjBusOthThanSpec,
  NetPLBusOthThanSpec7A7B7C, ChrgblIncUndrRule7, DeemedChrgblIncUndrRule7A,
  DeemedChrgblIncUndrRule7B1, DeemedChrgblIncUndrRule7B1A, DeemedChrgblIncUndrRule8,
  IncomeOtherThanRule, BalIncDeemedFrmAgri
SpecBusinessInc: NetPLFrmSpecBus, AdditionUs28to44DA, DeductUs28to44DA,
  AdjustedPLFrmSpecuBus
IncSpecifiedBusiness: NetPLFrmSpecifiedBus, AddSec28to44DA, DedSec28to44DAOTDedSec35AD,
  ProfitLossSpecifiedBusiness, DedSec35AD1, ProfitLossSpecifiedBusFinal,
  DedUs35ADSubSec5 (array DedUs35ADSubSec5Dtls[])
IncChrgUnHdProftGain
BusSetoffCurrYr: LossSetOffOnBusLoss, IncOfCurYrUnderThatHead, BusLossSetoff,
  IncOfCurYrAfterSetOff, TotLossSetOffOnBus, LossRemainSetOffOnBus
```

Note: `HouseProperty`, `CapitalGains`, `OtherSources`, `UnderSec115BBF`,
`UnderSec115BBG` appear twice — once under `IncRecCredPLOthHeadDtls` (item 3) and
once under `ExpDebToPLOthHeadDtls` (item 7); same key names, different groups.

---

## 11 · What this means for the build

1. **Part A is a long reconciliation** from book profit (item 1) through
   head-transfers (3, 7), exempt income (5), depreciation (11–13), additions
   (14–26) and deductions (27–34) to business income (35), then presumptive
   income (36) and the rule-7/8 agriculture split (38). Every computed line is
   green: 6, 9, 10, 12iii, 13, 26, 34, 35, 36x, 37, A38.
2. **Wire the depreciation chain**: item 12i is fed from Schedule DEP (never
   typed); DCG feeds Schedule CG.
3. **Wire the ESR feed**: item 29 = ESR column (4) total; item 24(c) = the ESR
   shortfall — both from the ESR sheet, not typed.
4. **Wire the ICDS feed**: item 25 = OI 3a + 4d, item 33 = OI 3b + 4e, where OI
   3a/3b come from Schedule ICDS XI(3)/XI(4).
5. **Gate the concessional-regime disallowances** (A255, A274, A275): under
   115BAA / 115BAB the 35AD deduction (item 48) and the ESR weighted deductions
   fall away, and depreciation is capped at 40%.
6. **The 32(1)(i) power-sector depreciation** (item 12ii) is allowed only for a
   power-sector nature of business (A228).
7. **Part E set-off** is the intra-head loss set-off matrix; **hidden Part E**
   (life insurance u/s 115B) is not built.
8. **The 35AD clause drop-down** carries the twelve specified-business clauses
   plus "(Select)" — seeded exactly as in §6.
