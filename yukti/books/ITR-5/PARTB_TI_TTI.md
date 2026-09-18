# PARTB - TI - TTI — Part B-TI (Total Income) & Part B-TTI (Computation of Tax Liability) (ITR-5, A.Y. 2026-27)

One utility worksheet ("PARTB - TI - TTI", `data-p` sheet key `Sheet8b`) holds the two central computation blocks of the return, stacked vertically:

- **Part B-TI** (rows 3-52) — *Computation of total income*. Section header C3 = "PART B - TI", G3 = "Computation of total income". Maps to schema block **PartB-TI**.
- **Part B - TTI** (rows 53-126) — *Computation of Tax Liability on Total Income*. Section header C53 = "Part B - TTI", G53 = "Computation of Tax Liability on Total Income". Maps to schema block **PartB_TTI**.

Almost every figure on this sheet is **computed / auto-populated** (white calculated cells) — the sheet note at G3 reads "PLEASE NOTE THAT CALCULATED FIELDS (IN WHITE) ARE PICKED UP FROM OTHER Sheets". The genuine user inputs are only: the two YES/NO flags (bank account in India L104; foreign-asset/beneficial-owner question L126), the bank-account grid (rows 112-117) and the foreign-bank grid (row 122). The whole tax engine (tax on income, surcharge, marginal relief, cess, interest) is resolved on the **hidden `Tax` sheet** (`Sheet9`) and its named ranges; that sheet is never built (see section_map `why_built`).

---

## The shape

Two fixed, non-repeating computation ladders — **not** add-row grids — except for the two refund bank-account grids at the bottom.

- **Part B-TI** is a single-column waterfall of head-wise income → set-offs → gross total income → Chapter VI-A / 10AA deductions → **Total income (Sl.13)** → special-rate income, agri income, aggregate income, CFL and deemed income. Value cells live in column **L** (totals) and column **J** (sub-lines), Sl.No. lettering in column **I/K**, labels in **E/F/G**.
- **Part B - TTI** is a single-column tax ladder: tax on deemed TI (1a-1d) · tax on total income (2a-2g incl. the surcharge sub-ladder 2e A/B) · gross tax payable (3, higher of 1d/2g) · AMT credit 115JD (4) · tax after credit (5) · relief 90/91 (6) · net tax liability (7) · interest & fee 234A/B/C/F/234-I (8) · aggregate liability (9) · taxes paid (10) · amount payable (11) / refund (12) · 115TD adjustment (13-15) · refund bank details.
- **Bank-account grid** (rows 111-117) and **foreign-bank grid** (rows 121-122) are the only **repeats** on the sheet.

---

## The items — Part B-TI (block `PartB-TI`)

| Sl.No. | Sheet cells | Field | Type | Schema key | Rule / cell formula |
|---|---|---|---|---|---|
| 1 | E4, L4 | Income from house property ( 3 of Schedule-HP) (enter nil if loss) | computed | `IncomeFromHP` | `L4 = MAX(0,HP.TotalIncomeChargeableUnHP)` (rule 787) |
| 2 | E5 | Profits and gains from business or profession | header | (parent `ProfBusGain`) | — |
| 2i | F6, J6 | Profit and gains from business other than speculative business and specified business (A 37 of Schedule BP) | computed | `ProfBusGain.ProfGainNoSpecBus` | `J6 = MAX(sheet12.NetPLBusOthThanSpec7A7B7C,0)` (rule 788) |
| 2ii | F7, J7 | Profit and gains from speculative business (3(ii) of table E of Schedule BP) (enter nil if loss) | computed | `ProfBusGain.ProfGainSpecBus` | `J7 = MAX(0,sheet12.IncOfCurYrAfterSetOffa)` (rule 789) |
| 2iii | F8, J8 | Profits and gains from specified business (3(iii) of table E of Schedule BP) (enter nil if loss) | computed | `ProfBusGain.ProfGainSpecifiedBus` | `J8 = MAX(0,sheet12.IncOfCurYrAfterSetOffb)` (rule 790) |
| 2iv | F9, J9 | Income chargeable to tax at special rate (3d, 3e and 3f of Schedule BP ) | computed | `ProfBusGain.IncChrgblTaxSplRate` | `J9 = sheet10.IncRecCredPL115BBF + sheet10.IncRecCredPL115BBG + sheet10.IncRecCredPL115BBH` (rule 801) |
| 2v | F10, L10 | Total (2i + 2ii + 2iii + 2iv) (enter nil, if loss and carry this figure of loss to Schedule CYLA) | computed | `ProfBusGain.TotProfBusGain` | `L10 = SUM(J6:J9)` (rule 781) |
| 3 | E11 | Capital gains | header | (parent `CapGain`) | — |
| 3a | F12 | Short term | header | (parent `CapGain.ShortTerm`) | — |
| 3ai | G14, J14 | Short-term chargeable @ 20% (8ii of item E of schedule CG) | computed | `CapGain.ShortTerm.ShortTerm20Per` | `J14 = STCG_CurrentYrGain20Percent` (rule 817) |
| 3aii | G15, J15 | Short-term capital Gain (30%)(8iii of item E of Sch CG) | computed | `CapGain.ShortTerm.ShortTerm30Per` | `J15 = STCG_CurrentYrGain30Percent` (rule 791) |
| 3aiii | G16, J16 | Short-term Capital Gain (Applicable Rate)( 8iv of item E of Sch CG) | computed | `CapGain.ShortTerm.ShortTermAppRate` | `J16 = STCG_CurrentYrGainAppRate` (rule 792) |
| 3aiv | G17, J17 | STCG chargeable at special rates in India as per DTAA (8v of item E of Schedule CG) | computed | `CapGain.ShortTerm.ShortTermSplRateDTAA` | `J17 = STCG_CurrentYrGainDTAARate` (rule 811) |
| 3av | G18, J18 | Total Short-term (ai + aii + aiii+aiv) (enter nil if loss) | computed | `CapGain.ShortTerm.TotalShortTerm` | `J18 = SUM(J14:J17)` (rule 782) |
| 3b | F19 | Long term | header | (parent `CapGain.LongTerm`) | — |
| 3bi | G21, J21 | Long-term chargeable @ 12.5% (8vi of item E of schedule CG) | computed | `CapGain.LongTerm.LongTerm12_5Per` | `J21 = LTCG_CurrentYrGain125Percent` (rule 818) |
| 3bii | G23, J23 | LTCG chargeable at special rates in India as per DTAA (8vii of item E of schedule CG) | computed | `CapGain.LongTerm.LongTermSplRateDTAA` | `J23 = LTCG_CurrentYrGainDTAARate` (rule 812) |
| 3biii | G24, J24 | Total Long term (bi+bii) (enter nil if loss) | computed | `CapGain.LongTerm.TotalLongTerm` | `J24 = SUM(J21:J23)` (rule 783) |
| 3c | F25, L25 | Sum of Short-term/Long-term Capital Gains (3av+3biii) (enter nil if loss) | computed | `CapGain.ShortTermLongTermTotal` | `L25 = MAX(0,Sheet8b.TotalShortTerm+Sheet8b.LongTerm)` (rule 784) |
| 3d | F26, L26 | Capital gain chargeable @ 30% u/s 115BBH (C2 of schedule CG) | computed | `CapGain.CapGains30Per115BBH` | `L26 = MAX(0,CG.IncomeVDA)` (rule 814) |
| 3e | F27, L27 | Total capital gains (3c + 3d) | computed | `CapGain.TotalCapGains` | `L27 = MAX(SUM(Sheet8b.TotalCapGains,Sheet8b.TotalCapGains115BBH),0)` (rule 815) |
| 4 | E28 | Income from other sources | header | (parent `IncFromOS`) | — |
| 4a | F29, J29 | Net income from other sources chargeable to tax at normal applicable rates ( 6 of Schedule OS) (enter nil if loss) | computed | `IncFromOS.OtherSrcThanOwnRaceHorse` | `J29 = MAX(0,os.BalanceNoRaceHorse)` (rule 793) |
| 4b | F30, J30 | Income chargeable to tax at special rate (2 of Schedule OS) | computed | `IncFromOS.IncChargblSplRate` | `J30 = os.IncChargeableSpecialRates` (rule 794) |
| 4c | F31, J31 | Income from the activity of owning and maintaining race horses (8e of Schedule OS) (enter nil if loss) | computed | `IncFromOS.FromOwnRaceHorse` | `J31 = MAX(0,os.BalanceOwnRaceHorse)` (rule 795) |
| 4d | F32, L32 | Total (4a + 4b + 4c) | computed | `IncFromOS.TotIncFromOS` | `L32 = MAX(0,SUM(J29:J31))` (rule 785) |
| 5 | E33, L33 | Total of head wise income (1 + 2v + 3e +4d) | computed | `TotalTI` | `L33 = Sheet8b.TotIncFromOS + Sheet8b.TotalCapitalGains + Sheet8b.TotProfBusGain + Sheet8b.IncomeFromHP` (rule 786) |
| 6 | E34, L34 | Losses of current year to be set off against 5 (total of 2xvi, 3xvi and 4xvi of Schedule CYLA) | computed | `CurrentYearLoss` | `L34 = SUM(sheet16.TotHPlossCurYrSetoff, sheet16.TotBusLossSetoff, sheet16.TotOthSrcLossNoRaceHorseSetoff)` (rule 796) — schema: "Do Not Use -ve sign" |
| 7 | E35, L35 | Balance after set off of current year losses (5 – 6) (total of column 5 of schedule CYLA + 4b + 2iv- 2e of schedule OS) | computed | `BalanceAfterSetoffLosses` | `L35 = MAX(0,Sheet8b.TotalTI - Sheet8b.CurrentYearLoss)` (rule 813) |
| 8 | E36, L36 | Brought forward losses to be set off losses against 7(total of 2xv, 3xv and 4xv of Schedule BFLA) | computed | `BroughtFwdLossesSetoff` | `L36 = SUM(sheet16.TotBFLossSetoff, sheet16.TotUnabsorbedDeprSetoff, sheet16.TotAllUs35cl4Setoff)` (rule 797) |
| 9 | E37, L37 | Gross Total income (7 – 8) (total column 5 of Schedule BFLA + 4b+2iv - 2e of schedule OS) | computed | `GrossTotalIncome` | `L37 = MAX(0,Sheet8b.BalanceAfterSetoffLosses - Sheet8b.BroughtFwdLossesSetoff)` (rule 798) |
| 10 | E38, L38 | Income chargeable to tax at special rate under section 111A, 112, 112A etc. included in 9 | computed | `IncChargeTaxSplRate111A112` | `L38 = MAX(SUM(SI.SplRateInc),0)` — reduces the base on which Chapter VI-A / 10AA are limited (rules 806, 809) |
| 11 | E39 | Deductions under Chapter VI-A | header | (parent `DeductionsUndSchVIADtl`) | — |
| 11a | F40, J40 | Part-B of Chapter VI-A [1 of Schedule VI-A and limited upto (i,ii,iv,v,viii,xiii,xiv) of column 5 of Schedule BFLA] | computed | `DeductionsUndSchVIADtl.PartBchapterVIA` | `J40 = MAX(0,MIN(Sheet8b.GrossTotalIncome - Sheet8b.IncChargeableTaxSplRates, scvia.TotPartBchapterVIA_Calc))` (rules 807, 802) |
| 11b | F41, J41 | Part-C of Chapter VI-A [2 of Schedule VI-A )] | computed | `DeductionsUndSchVIADtl.PartCchapterVIA` | `J41 = MAX(0,IF(scvia.Section80P_Calc>0,MIN(...),...))` (rules 808, 803) |
| 11c | F42, L42 | Total (11a + 11b) [limited upto (9-10)] | computed | `DeductionsUndSchVIADtl.TotDeductUndSchVIA` | `L42 = MAX(0,MIN(Sheet8b.PartBchapterVIA + Sheet8b.PartCchapterVIA, Sheet8b.GrossTotalIncome - Sheet8b.IncChargeableTaxSplRates))` — **capped at (9 − 10)** (rule 809) |
| 12 | E43, L43 | Deduction u/s 10AA (Total of Schedule 10AA) | computed | `DeductionsUnder10Aor10AA` | `L43 = MAX(0,MIN((Sheet8b.GrossTotalIncome - Sheet8b.IncChargeableTaxSplRates - Sheet8b.DeductionsUnderScheduleVIA),...))` — cannot exceed Schedule 10AA total (rules 799, 804) |
| 13 | E47, L47 | Total income (9 - 11c - 12) | computed | `TotalIncome` | `L47 = ROUND(MAX(0,Sheet8b.GrossTotalIncome - Sheet8b.IncomeNotPart10 - Sheet8b.DeductionsUnderScheduleVIA), -1)` — **rounded to nearest ₹10** (rule 800) |
| 14 | E48, L48 | Income chargeable to tax at special rates (total of (i) of schedule SI) | computed | `IncChargeableTaxSplRates` | `L48 = MAX(SUM(SI.SplRateIncCalc),0)` (rule 806) |
| 15 | E49, L49 | Net agricultural income/ any other income for rate purpose (2v of Schedule EI) | computed | `NetAgricultureIncomeOrOtherIncomeForRate` | `L49 = IF(Sheet20.scei.NetAgriIncOrOthrIncRule7 > 5000, Sheet20.scei.NetAgriIncOrOthrIncRule7, 0)` — only counts if > ₹5,000 (rule 805) |
| 16 | E50, L50 | Aggregate income (13 – 14 + 15) [applicable if (13-14) exceeds maximum amount not chargeable to tax] | computed | `AggregateIncome` | `L50 = IF(GrpsA, IF(GrpsB, IF(OR(CaseEstateOfDeceased, NOT(GrpsC.3)), ...)))` — the partial-integration base for agri-income rate purpose |
| 17 | E51, L51 | Losses of current year to be carried forward (total of xxi- of Schedule CFL) | computed | `LossesOfCurrentYearCarriedFwd` | `L51 = IF(MID(sheet1.SubStatus,1,1)="5", SUM(CFL!L29:O29), SUM(CFL!G29:'CFL'!W29))` — Investment-Fund sub-status uses a different CFL column range (rule 559) |
| 18 | E52, L52 | Deemed total income under section 115JC (3 of Schedule AMT) | computed | `DeemedTotIncSec115JC` (not required) | `L52 = AMT.AdjustedUnderSec115JC` (rules 810, 677) |

**Every schema leaf of `PartB-TI` (verbatim):** `IncomeFromHP`; `ProfBusGain.ProfGainNoSpecBus`, `ProfBusGain.ProfGainSpecBus`, `ProfBusGain.ProfGainSpecifiedBus`, `ProfBusGain.IncChrgblTaxSplRate`, `ProfBusGain.TotProfBusGain`; `CapGain.ShortTerm.ShortTerm20Per`, `CapGain.ShortTerm.ShortTerm30Per`, `CapGain.ShortTerm.ShortTermAppRate`, `CapGain.ShortTerm.ShortTermSplRateDTAA`, `CapGain.ShortTerm.TotalShortTerm`, `CapGain.LongTerm.LongTerm12_5Per`, `CapGain.LongTerm.LongTermSplRateDTAA`, `CapGain.LongTerm.TotalLongTerm`, `CapGain.ShortTermLongTermTotal`, `CapGain.CapGains30Per115BBH`, `CapGain.TotalCapGains`; `IncFromOS.OtherSrcThanOwnRaceHorse`, `IncFromOS.IncChargblSplRate`, `IncFromOS.FromOwnRaceHorse`, `IncFromOS.TotIncFromOS`; `TotalTI`; `CurrentYearLoss`; `BalanceAfterSetoffLosses`; `BroughtFwdLossesSetoff`; `GrossTotalIncome`; `IncChargeTaxSplRate111A112`; `DeductionsUndSchVIADtl.PartBchapterVIA`, `DeductionsUndSchVIADtl.PartCchapterVIA`, `DeductionsUndSchVIADtl.TotDeductUndSchVIA`; `DeductionsUnder10Aor10AA`; `TotalIncome`; `IncChargeableTaxSplRates`; `NetAgricultureIncomeOrOtherIncomeForRate`; `AggregateIncome`; `LossesOfCurrentYearCarriedFwd`; `DeemedTotIncSec115JC`.

---

## The items — Part B - TTI (block `PartB_TTI`)

Top-level object `ComputationOfTaxLiability` (rows 54-90), `TaxPaid` (rows 91-103), `Refund` (rows 104-126), plus loose flag `AssetOutsideIndiaFlg`.

### 1. Tax payable on deemed total income (`ComputationOfTaxLiability.TaxPayableOnDeemedTI`)

| Sl.No. | Sheet cells | Field | Type | Schema key | Rule / cell formula |
|---|---|---|---|---|---|
| 1a | F54, L54 | Tax payable on deemed total income under section 115JC (4 of Schedule AMT) | computed | `...TaxPayableOnDeemedTI.TaxDeemedTISec115JC` | `L54 = AMT.TaxPayableUnderSec115JC` (rules 819, 684) |
| 1b | F55, L55 | Surcharge on (a) above (if applicable) | computed | `...TaxPayableOnDeemedTI.Surcharge` | `L55 = AMTSurcharge` (surcharge on AMT; applies when deemed TI > ₹1 crore) |
| 1c | F56, L56 | Health and Education Cess @ 4% on 1a+1b above | computed | `...TaxPayableOnDeemedTI.EducationCess` | `L56 = ROUND(0.04*(sheet9.TaxDeemedTISec115JC + sheet9.deemeds),0)` — **cess 4%** |
| 1d | F57, L57 | Total Tax Payable on deemed total income (1a+1b+1c) | computed | `...TaxPayableOnDeemedTI.TotalTax` | `L57 = SUM(L54:L56)` (rules 823, 687) |

### 2. Tax payable on total income (`ComputationOfTaxLiability.TaxPayableOnTI`)

| Sl.No. | Sheet cells | Field | Type | Schema key | Rule / cell formula |
|---|---|---|---|---|---|
| 2 | E58 | Tax payable on total income | header | — | — |
| 2a | F59, J59 | Tax at normal rates on 16 of Part B-TI | computed | `...TaxPayableOnTI.TaxAtNormalRates` | `J59 = Sheet9.TaxPayableOnTotInc` (tax on Aggregate income Sl.16, computed on hidden `Tax` sheet) |
| 2b | F60, J60 | Tax at special rates (total of (ii) of Schedule-SI) | computed | `...TaxPayableOnTI.TaxAtSpecialRates` | `J60 = SI.TotSplRateIncTax` — total of col (ii) "Tax thereon" of Schedule SI (rule 697) |
| 2c | F61, J61 | Rebate on agricultural income [applicable if (13-14) of Part B-TI exceeds maximum amount not chargeable to tax] | computed | `...TaxPayableOnTI.RebateOnAgriInc` | `J61 = sheet9.RebateOnAgriInc` — partial-integration rebate |
| 2d | F62, L62 | Tax Payable on total income (2a+2b -2c)) | computed | `...TaxPayableOnTI.TaxPayableOnTotInc` | `L62 = MAX(SUM(J59,J60) - sheet9.RebateOnAgriInc, 0)` (rule 824) |
| 2e | F63 | Surcharge | header | (see surcharge leaves below) | — |
| 2e-A | F64 | Surcharge computed before marginal relief | header | (before-marginal leaves) | — |
| 2e-Ai | G65, J65 | 25% of 12(ii) of Schedule SI | computed | `...TaxPayableOnTI.Surcharge25ofSIBeforeMarginal` | `J65 = ROUND(0.25 * SI_115BBE, 0)` — **flat 25% surcharge on 115BBE income** |
| 2e-Aii | G66, S66 | 10% or 15%, as applicable (refer instruction) | computed | `...TaxPayableOnTI.SurchargeOnTaxPayableBeforeMarginal` (part) | `S66 = Surchrgii` — surcharge on special-rate income **capped at 15%** |
| 2e-Aiii | G67, S67 | On [(2d) – (12(ii) of Schedule SI – Income referred in 2e(ii) | computed | `...TaxPayableOnTI.SurchargeOnTaxPayableBeforeMarginal` (part) | `S67 = Surchrgiii` — surcharge on the balance (normal-rate) income at `Surcharge_Rate` |
| 2e-B | F68, S68 | Surcharge after marginal relief | header | — | `S68 = Sheet9.Surcharge_ii_Bfr + Sheet9.Surcharge_ii_enhc_Bfr` |
| 2e-Bi | G69, J69 | 25% of 12(ii) of Schedule SI | computed | `...TaxPayableOnTI.Surcharge25ofSI` | `J69 = ROUND(0.25 * SI_115BBE, 0)` — 115BBE surcharge after marginal relief |
| 2e-Bii | G70 | 10% or 15%, as applicable (refer instruction) | computed | `...TaxPayableOnTI.SurchargeOnTaxPayable` (part) | 10%/15% cap on special-rate income after marginal relief |
| 2e-Biii | G71 | On [(2d) – (12(ii) of Schedule SI – Income referred in 2e(ii) | computed | `...TaxPayableOnTI.SurchargeOnTaxPayable` (part) | surcharge on balance income after marginal relief |
| 2eBiv | G72, L72 | Total (i +ii+iii) | computed | `...TaxPayableOnTI.TotalSurcharge` | `L72 = MAX(0, Sheet9.Surcharge_i + Sheet9.Surcharge_ii)` |
| 2f | F73 | Health and Education Cess @ 4% on 2d+2eiv | computed | `...TaxPayableOnTI.EducationCess` | cess = 4% of (2d + 2eiv), computed on `Sheet9.EducationCess` |
| 2g | F74, L74 | Gross tax liability (2d + 2eiv + 2f) | computed | `...TaxPayableOnTI.GrossTaxLiability` | `L74 = sheet9.TaxPayableOnTotInc + Sheet9.SurchargeOnTaxPayable + Sheet9.EducationCess` (rule 825) |

### 3-9. Credit, relief, net tax, interest, aggregate

| Sl.No. | Sheet cells | Field | Type | Schema key | Rule / cell formula |
|---|---|---|---|---|---|
| 3 | E75, L75 | Gross tax payable (higher of 1d or 2g) | computed | `ComputationOfTaxLiability.GrossTaxPayable` | `L75 = MAX(Sheet9.GrossTaxLiability, sheet9.TotalTax_DI)` (rule 834) |
| 4 | E76, L76 | Credit under Section 115JD of Tax Paid in Earlier Years (if 2g is more than 1d) (5 of schedule AMTC) | computed | `ComputationOfTaxLiability.CreditUS115JD` | `L76 = IF(Sheet9.GrossTaxLiability <= sheet9.TotalTax_DI, 0, AMTC.TaxSection115JD)` (rule 820) |
| 5 | E77, L77 | Tax payable after credit under section 115JD (3 - 4) | computed | `ComputationOfTaxLiability.TaxPaidUnderCredit` | `L77 = MAX(0, sheet9.GrossTaxPayable - sheet9.CreditUS115JD)` (rule 835) |
| 6 | E78 | Tax relief | header | (parent `ComputationOfTaxLiability.TaxRelief`) | — |
| 6a | F79, J79 | Section 90/90A (2 of Schedule TR) | computed | `...TaxRelief.Section90` | `J79 = TR_TaxReliefOutsideIndiaDTAA` (rule 826) |
| 6b | F80, J80 | Section 91 ( 3 of Schedule TR) | computed | `...TaxRelief.Section91` | `J80 = TR_TaxReliefOutsideIndiaNotDTAA` (rule 827) |
| 6c | F81, L81 | Total (6a + 6b ) | computed | `...TaxRelief.TotTaxRelief` | `L81 = SUM(J79:J80)` (rule 828) |
| 7 | E82, L82 | Net tax liability (5 – 6c) (enter zero, if negative) | computed | `ComputationOfTaxLiability.NetTaxLiability` | `L82 = MAX(sheet9.TaxPayAfterCreditUs115JD - Sheet9.TotTaxRelief, 0)` (rule 836) |
| 8 | E83 | Interest and fee payable | header | (parent `ComputationOfTaxLiability.IntrstPay`) | — |
| 8a | F84, J84 | Interest for default in furnishing the return (section 234A) | computed | `...IntrstPay.IntrstPayUs234A` | `J84` from `Sheet9` (234A engine) |
| 8b | F85, J85 | Interest for default in payment of advance tax (section 234B) | computed | `...IntrstPay.IntrstPayUs234B` | `J85` from `Sheet9` (234B engine) |
| 8c | F86, J86 | Interest for deferment of advance tax (section 234C) | computed | `...IntrstPay.IntrstPayUs234C` | `J86` from `Sheet9` (234C quarterly engine; `Tax!R2:X` working) |
| 8d | F87, J87 | Fee for default in furnishing return of income (section 234F) | computed | `...IntrstPay.LateFilingFee234F` | `J87` — schema **max ₹5,000** |
| 8da | F88, J88 | Fee for furnishing revised return of income (section 234-I) | computed | `...IntrstPay.FeeFurnish234I` (not required) | `J88` — **₹1,000 if TI ≤ ₹5 lakh, ₹5,000 if TI > ₹5 lakh**, only when filed after 31/12/2026 u/s 139(5); schema max ₹5,000 (rules 841, 842) |
| 8e | F89, L89 | Total Interest and Fee Payable (8a+8b+8c+8d+8da) | computed | `...IntrstPay.TotalIntrstPay` | `L89 = SUM(J84:J88)` (rules 829, 830) |
| 9 | E90, L90 | Aggregate liability (7 + 8e) | computed | `ComputationOfTaxLiability.AggregateTaxInterestLiability` | `L90 = ROUND(Sheet9.NetTaxLiability + Sheet9.TotalIntrstPay, 0)` (rule 831) |

### 10-12. Taxes paid, amount payable / refund (`TaxPaid`, `Refund`)

| Sl.No. | Sheet cells | Field | Type | Schema key | Rule / cell formula |
|---|---|---|---|---|---|
| 10 | E91 | Taxes Paid | header | (parent `TaxPaid.TaxesPaid`) | — |
| 10a | F92, J92 | Advance Tax (from column 5 of 18A) | computed | `TaxPaid.TaxesPaid.AdvanceTax` (not required) | `J92 = AdvanceTax` — sum of Schedule IT with deposit 01/04/2025-31/03/2026 (rules 822, 837) |
| 10b | F93, J93 | TDS (total of column 9 of 18B) | computed | `TaxPaid.TaxesPaid.TDS` (not required) | `J93 = SUM(TDS2.ClaimedInOwnHands) + SUM(TDS3.ClaimedInOwnHands)` (rule 823) |
| 10c | F94, J94 | TCS (total of column 7 of 18C) | computed | `TaxPaid.TaxesPaid.TCS` (not required) | `J94 = SUM(TCS1.ClaimedOwnHands)` (rule 823) |
| 10d | F95, J95 | Self-Assessment Tax (from column 5 of 18A) | computed | `TaxPaid.TaxesPaid.SelfAssessmentTax` (not required) | `J95 = IT.SAT` — Schedule IT with deposit after 31/03/2026 (rules 822, 838) |
| 10e | F96, L96 | Total Taxes Paid (10a+10b+10c+10d) | computed | `TaxPaid.TaxesPaid.TotalTaxesPaid` | `L96 = SUM($J$92:$J$95)` (rule 831) |
| 11 | E97, L97 | Amount payable (Enter if 9 is greater than 10e, else enter 0) | computed | `TaxPaid.BalTaxPayable` | `L97 = ROUND(MAX(0, Sheet9.AggregateTaxInterestLiability - Sheet9.TotalTaxesPaid), -1)` — rounded to ₹10 (rule 833) |
| 12 | E98, L98 | Refund (If 10e is greater than 9), | computed | `Refund.RefundDue` | `L98 = ROUND(MAX(0, Sheet9.TotalTaxesPaid - Sheet9.AggregateTaxInterestLiability), -1)` (rule 832) |
| 13 | E101, L101 | Net tax payable on 115TD income including interest u/s 115TE (Sr.no. 12 of Schedule 115TD) | computed | `TaxPaid.NetTaxPayable115TD` (not required) | `L101 = Sch115TD.NetPayable` (rule 762) |
| 14 | E102, L102 | Tax payable u/s 115TD after adjustment of refund at Sl. No. 12 (13-12) | computed | `TaxPaid.TaxPayable115TD` (not required) | `L102 = IF(NetTax_115TD > Sheet9.RefundDue, (NetTax_115TD - Sheet9.RefundDue), 0)` (rule 816) |
| 15 | E103, L103 | Net refund after adjustment as per Sl. No. 14 (12-13) (refund, if any, will be directly credited into the bank account) | computed | `TaxPaid.NetRefundAdjust` (not required) | `L103 = IF(Sheet9.RefundDue > NetTax_115TD, (Sheet9.RefundDue - NetTax_115TD), 0)` (rule 839) |

### Bank account & refund details (`Refund.BankAccountDtls`, `AssetOutsideIndiaFlg`)

| Sl.No. | Sheet cells | Field | Type | Schema key | Rule / dropdown |
|---|---|---|---|---|---|
| — | E104, L104 | Do you have a bank account in India (Non-residents claiming refund with no bank account in India may give foreign bank details) | **input** dropdown | `Refund.BankAccountDtls.BankDtlsFlag` (enum Y, N) | L104 dropdown `(Select)/YES/NO` → maps YES→`Y`, NO→`N`; a non-resident may instead furnish a foreign account (row 120) |
| l(a) | E107 | Details of all Bank Accounts held in India at any time during the previous year (excluding dormant accounts) | header | (array `Refund.BankAccountDtls.AddtnlBankDetails[]`) | — |
| — | E111/G111/H111/J111/K111/L111 | Sl.No · IFS Code of the Bank · Name of the Bank · Account Number · Type of account · Select Account for refund credit (tick at least one account √ ) | column headers | array leaf keys below | — |
| grid | rows 112-117 (E,G,H,J,K,L) | one row per bank account (**repeat**) | **input** | `AddtnlBankDetails[].IFSCCode`, `.BankName`, `.BankAccountNo`, `.AccountType`, `.UseForRefund` | `E112 = E109+1 …` auto Sl.No; G112:G117 = IFSC (text); K112:K117 = Type of account dropdown (`TypeofAccount_list`); L = UseForRefund (true/false) |
| — | M112 | NOTE: PLEASE VALIDATE SCHEDULE CG BEFORE IMPORTING BANK DETAILS | note | — | prefill guard note |
| — | D119/F119 | Note : 1. All bank accounts held at any time is to be reported, except dormant A/c. 2. In case of multiple accounts, indicate one for refund | note | — | — |
| B | D120/E120 | Non-residents, not having bank account in India may, at their option, furnish the details of one foreign bank account for refund | header | (array `Refund.BankAccountDtls.ForeignBankDetails[]`) | — |
| — | E121/G121/H121/J121/L121 | Sl.No · SWIFT Code · Name of the Bank · Country of Location · IBAN | column headers | array leaf keys below | — |
| grid | row 122 (G,H,J,L) | one foreign bank account (**repeat**) | **input** | `ForeignBankDetails[].SWIFTCode`, `.BankName`, `.CountryCode`, `.IBAN` | J122 = Country dropdown (enum = the 250 numeric country codes); the schema stores the numeric `CountryCode` |
| 17 | E126, L126 | Do you at any time during previous year, - (i) hold, as beneficial owner, beneficiary or otherwise, any asset (incl. financial interest in any entity) located outside India; (ii) have signing authority in any account located outside India; (iii) have income from any source outside India? | **input** dropdown | `AssetOutsideIndiaFlg` (enum YES, NO) | L126 dropdown `(Select)/YES/NO`; if YES, **Schedule FA is mandatory** (rules 777, 840) |

**Every schema leaf of `PartB_TTI` (verbatim):** `ComputationOfTaxLiability.TaxPayableOnDeemedTI.TaxDeemedTISec115JC`, `.Surcharge`, `.EducationCess`, `.TotalTax`; `ComputationOfTaxLiability.TaxPayableOnTI.TaxAtNormalRates`, `.TaxAtSpecialRates`, `.RebateOnAgriInc`, `.TaxPayableOnTotInc`, `.Surcharge25ofSI`, `.SurchargeOnTaxPayable`, `.Surcharge25ofSIBeforeMarginal`, `.SurchargeOnTaxPayableBeforeMarginal`, `.TotalSurcharge`, `.EducationCess`, `.GrossTaxLiability`; `ComputationOfTaxLiability.GrossTaxPayable`, `.CreditUS115JD`, `.TaxPaidUnderCredit`; `ComputationOfTaxLiability.TaxRelief.Section90`, `.Section91`, `.TotTaxRelief`; `ComputationOfTaxLiability.NetTaxLiability`; `ComputationOfTaxLiability.IntrstPay.IntrstPayUs234A`, `.IntrstPayUs234B`, `.IntrstPayUs234C`, `.LateFilingFee234F`, `.FeeFurnish234I`, `.TotalIntrstPay`; `ComputationOfTaxLiability.AggregateTaxInterestLiability`; `TaxPaid.TaxesPaid.AdvanceTax`, `.TDS`, `.TCS`, `.SelfAssessmentTax`, `.TotalTaxesPaid`; `TaxPaid.BalTaxPayable`, `TaxPaid.NetTaxPayable115TD`, `TaxPaid.TaxPayable115TD`, `TaxPaid.NetRefundAdjust`; `Refund.RefundDue`, `Refund.BankAccountDtls.BankDtlsFlag`, `Refund.BankAccountDtls.AddtnlBankDetails[].IFSCCode`, `.BankName`, `.BankAccountNo`, `.AccountType`, `.UseForRefund`, `Refund.BankAccountDtls.ForeignBankDetails[].SWIFTCode`, `.BankName`, `.CountryCode`, `.IBAN`; `AssetOutsideIndiaFlg`.

---

## The rules the sheet computes (with cell references)

**Part B-TI ladder**
- `L4 = MAX(0,HP.TotalIncomeChargeableUnHP)` — HP loss entered as nil (each head floored at 0).
- `L10 = SUM(J6:J9)` (2v); `J18 = SUM(J14:J17)` (3av); `J24 = SUM(J21:J23)` (3biii).
- `L25 = MAX(0,TotalShortTerm+LongTerm)` (3c); `L27 = MAX(SUM(TotalCapGains,TotalCapGains115BBH),0)` (3e).
- `L32 = MAX(0,SUM(J29:J31))` (4d); `L33 = OS + CG + BP + HP` (5, total head-wise income).
- `L34` set-off of CY losses (CYLA); `L35 = MAX(0,TotalTI − CurrentYearLoss)` (7); `L36` BF losses (BFLA); `L37 = MAX(0,BalanceAfterSetoffLosses − BroughtFwdLossesSetoff)` (9, GTI).
- `L42 = MAX(0,MIN(PartB+PartC, GTI − IncChargeableTaxSplRates))` — **Chapter VI-A total capped at (9 − 10)**.
- `L43` — **10AA deduction ≤ Schedule 10AA total, and ≤ remaining income after VI-A**.
- `L47 = ROUND(MAX(0, GTI − IncomeNotPart10 − DeductionsUnderScheduleVIA), −1)` — **Total income rounded to nearest ₹10** (Sl.13).
- `L49` counts agri income only when > ₹5,000; `L50` aggregate income for partial integration.
- `L51` — CFL carried-forward uses `CFL!L29:O29` when sub-status "5" (Investment Fund) else `CFL!G29:W29`.

**Part B-TTI tax engine** (all rate/slab logic on hidden `Tax` sheet `Sheet9`; never built)
- Tax on deemed TI: `1a = AMT.TaxPayableUnderSec115JC`; `1c = ROUND(0.04*(...),0)` (**cess 4%**); `1d = SUM(1a:1c)`.
- Tax on TI: `2d = MAX(SUM(2a,2b) − RebateOnAgriInc, 0)`; `2g = 2d + 2eiv + 2f`.
- **Surcharge** (`Tax!` engine):
  - Base surcharge rate `Surcharge_Rate` = `Tax!J2 = IF(MID(SubStatus,1,1) ∈ {"1","2","3","4","5"}, 0.15, 0.12)` — i.e. **15%** for AOP/BOI/AJP-type sub-statuses (groups 1,2,5 and 3,4), **12%** for firm (7) / LLP (8) / co-operative (6).
  - Surcharge applies **only when total income > ₹1 crore (10000000)** — `Tax!U72/D85 = IF(TotalIncome>10000000, Surcharge_Rate, 0)`.
  - **Special-rate income (u/s 111A/112/112A) surcharge capped at 15%** — sheet rows 66/70 "10% or 15%, as applicable (refer instruction)".
  - **Flat 25% surcharge on 115BBE income** — `J65 = J69 = ROUND(0.25 * SI_115BBE, 0)` (rows 2e-Ai / 2e-Bi).
  - **Marginal relief**: computed before (2e-A, rows 65-67) vs after (2e-B, rows 69-72); `Tax!D90` = relief, `Tax!D91` = surcharge after marginal relief. `TotalSurcharge L72 = MAX(0, Surcharge_i + Surcharge_ii)`.
  - AMT surcharge (1b) = `AMTSurcharge`; AMT block uses `Tax!D88 = ROUND(10000000*0.185,0)` and `0.185` group-D surcharge working for members' income.
  - (Note: the 25%/37% higher surcharge slabs that apply to certain AOPs with income above ₹2 cr/₹5 cr are resolved inside the hidden `Tax` sheet's Group A-D case logic — `Tax!E2:I2` classify the sub-status into groups; that engine is out of scope to build.)
- `3 = MAX(2g, 1d)` (higher of normal vs AMT); `4 = 115JD credit only if 2g > 1d`; `5 = MAX(0, 3 − 4)`.
- `6c = 90/90A + 91`; `7 = MAX(0, 5 − 6c)`.
- Interest: 234A (8a), 234B (8b), 234C (8c, quarterly — `Tax!R2:X` working with 15%/45%/75%/100% cumulative and the 12%/36% first-two-quarter working at `Tax!X3`), 234F fee (8d, max ₹5,000), 234-I revised-return fee (8da, ₹1,000/₹5,000). `8e = SUM(8a:8da)`.
- `9 = ROUND(7 + 8e, 0)`; `10e = SUM(10a:10d)`; `11 = ROUND(MAX(0, 9 − 10e), −1)`; `12 = ROUND(MAX(0, 10e − 9), −1)`.
- 115TD: `13 = Sch115TD.NetPayable`; `14 = MAX(13 − 12, 0)`; `15 = MAX(12 − 13, 0)`.

**Cross-schedule ties (rules.json):** AMT `1a`↔AMT Sl.4 (819/684); `4`↔AMTC Sl.5 (820); `2b`↔SI col(ii) total (697); `6a/6b`↔TR Sl.2/3 (826/827); `10a/10d`↔Schedule IT (822/837/838); `10b`↔TDS1/TDS2 total (823); `10c`↔TCS total (823); Sl.13 TI↔AMT Sl.1 (677); FA mandatory if 17=Yes (840).

---

## Dropdowns

- **BankDtlsFlag / AssetOutsideIndiaFlg** (`L104`, `L126`) — source `"(Select),YES,NO"`: (Select), YES, NO
- **Type of account** (`K112:K117`, named `sheet9.TypeofAccount_list`) — (SELECT), Current Account, Savings Account, Cash Credit Account, Over draft account, Non Resident Account, Capital Gains Accounts Scheme, Other (schema `AccountType` enum: `CA`, `SB`, `CC`, `OD`, `NRO`, `CGAS`, `OTH`).
- **Country of Location** (`J122`, named list `Country`) — the 250-entry code list (schema `CountryCode` stores the numeric code): (select), 93-AFGHANISTAN, 1001-ALAND ISLANDS, 355-ALBANIA, 213-ALGERIA, 684-AMERICAN SAMOA, 376-ANDORRA, 244-ANGOLA, 1264-ANGUILLA, 1010-ANTARCTICA, 1268-ANTIGUA AND BARBUDA, 54-ARGENTINA, 374-ARMENIA, 297-ARUBA, 61-AUSTRALIA, 43-AUSTRIA, 994-AZERBAIJAN, 1242-BAHAMAS, 973-BAHRAIN, 880-BANGLADESH, 1246-BARBADOS, 375-BELARUS, 32-BELGIUM, 501-BELIZE, 229-BENIN, 1441-BERMUDA, 975-BHUTAN, 591-BOLIVIA (PLURINATIONAL STATE OF), 1002-BONAIRE, SINT EUSTATIUS AND SABA, 387-BOSNIA AND HERZEGOVINA, 267-BOTSWANA, 1003-BOUVET ISLAND, 55-BRAZIL, 1014-BRITISH INDIAN OCEAN TERRITORY, 673-BRUNEI DARUSSALAM, 359-BULGARIA, 226-BURKINA FASO, 257-BURUNDI, 238-CABO VERDE, 855-CAMBODIA, 237-CAMEROON, 1-CANADA, 1345-CAYMAN ISLANDS, 236-CENTRAL AFRICAN REPUBLIC, 235-CHAD, 56-CHILE, 86-CHINA, 9-CHRISTMAS ISLAND, 672-COCOS (KEELING) ISLANDS, 57-COLOMBIA, 270-COMOROS, 242-CONGO, 243-CONGO (DEMOCRATIC REPUBLIC OF THE), 682-COOK ISLANDS, 506-COSTA RICA, 225-COTE DIVOIRE, 385-CROATIA, 53-CUBA, 1015-CURACAO, 357-CYPRUS, 420-CZECHIA, 45-DENMARK, 253-DJIBOUTI, 1767-DOMINICA, 1809-DOMINICAN REPUBLIC, 593-ECUADOR, 20-EGYPT, 503-EL SALVADOR, 240-EQUATORIAL GUINEA, 291-ERITREA, 372-ESTONIA, 251-ETHIOPIA, 500-FALKLAND ISLANDS (MALVINAS), 298-FAROE ISLANDS, 679-FIJI, 358-FINLAND, 33-FRANCE, 594-FRENCH GUIANA, 689-FRENCH POLYNESIA, 1004-FRENCH SOUTHERN TERRITORIES, 241-GABON, 220-GAMBIA, 995-GEORGIA, 49-GERMANY, 233-GHANA, 350-GIBRALTAR, 30-GREECE, 299-GREENLAND, 1473-GRENADA, 590-GUADELOUPE, 1671-GUAM, 502-GUATEMALA, 1481-GUERNSEY, 224-GUINEA, 245-GUINEA-BISSAU, 592-GUYANA, 509-HAITI, 1005-HEARD ISLAND AND MCDONALD ISLANDS, 6-HOLY SEE, 504-HONDURAS, 852-HONG KONG, 36-HUNGARY, 354-ICELAND, 91-INDIA, 62-INDONESIA, 98-IRAN (ISLAMIC REPUBLIC OF), 964-IRAQ, 353-IRELAND, 1624-ISLE OF MAN, 972-ISRAEL, 5-ITALY, 1876-JAMAICA, 81-JAPAN, 1534-JERSEY, 962-JORDAN, 7-KAZAKHSTAN, 254-KENYA, 686-KIRIBATI, 850-KOREA (DEMOCRATIC PEOPLES REPUBLIC OF), 82-KOREA (REPUBLIC OF), 965-KUWAIT, 996-KYRGYZSTAN, 856-LAO PEOPLES DEMOCRATIC REPUBLIC, 371-LATVIA, 961-LEBANON, 266-LESOTHO, 231-LIBERIA, 218-LIBYA, 423-LIECHTENSTEIN, 370-LITHUANIA, 352-LUXEMBOURG, 853-MACAO, 389-MACEDONIA (THE FORMER YUGOSLAV REPUBLIC OF), 261-MADAGASCAR, 265-MALAWI, 60-MALAYSIA, 960-MALDIVES, 223-MALI, 356-MALTA, 692-MARSHALL ISLANDS, 596-MARTINIQUE, 222-MAURITANIA, 230-MAURITIUS, 269-MAYOTTE, 52-MEXICO, 691-MICRONESIA (FEDERATED STATES OF), 373-MOLDOVA (REPUBLIC OF), 377-MONACO, 976-MONGOLIA, 382-MONTENEGRO, 1664-MONTSERRAT, 212-MOROCCO, 258-MOZAMBIQUE, 95-MYANMAR, 264-NAMIBIA, 674-NAURU, 977-NEPAL, 31-NETHERLANDS, 687-NEW CALEDONIA, 64-NEW ZEALAND, 505-NICARAGUA, 227-NIGER, 234-NIGERIA, 683-NIUE, 15-NORFOLK ISLAND, 1670-NORTHERN MARIANA ISLANDS, 47-NORWAY, 968-OMAN, 92-PAKISTAN, 680-PALAU, 970-PALESTINE, STATE OF, 507-PANAMA, 675-PAPUA NEW GUINEA, 595-PARAGUAY, 51-PERU, 63-PHILIPPINES, 1011-PITCAIRN, 48-POLAND, 14-PORTUGAL, 1787-PUERTO RICO, 974-QATAR, 262-REUNION, 40-ROMANIA, 8-RUSSIAN FEDERATION, 250-RWANDA, 1006-SAINT BARTHELEMY, 290-SAINT HELENA, ASCENSION AND TRISTAN DA CUNHA, 1869-SAINT KITTS AND NEVIS, 1758-SAINT LUCIA, 1007-SAINT MARTIN (FRENCH PART), 508-SAINT PIERRE AND MIQUELON, 1784-SAINT VINCENT AND THE GRENADINES, 685-SAMOA, 378-SAN MARINO, 239-SAO TOME AND PRINCIPE, 966-SAUDI ARABIA, 221-SENEGAL, 381-SERBIA, 248-SEYCHELLES, 232-SIERRA LEONE, 65-SINGAPORE, 1721-SINT MAARTEN (DUTCH PART), 421-SLOVAKIA, 386-SLOVENIA, 677-SOLOMON ISLANDS, 252-SOMALIA, 28-SOUTH AFRICA, 1008-SOUTH GEORGIA AND THE SOUTH SANDWICH ISLANDS, 211-SOUTH SUDAN, 35-SPAIN, 94-SRI LANKA, 249-SUDAN, 597-SURINAME, 1012-SVALBARD AND JAN MAYEN, 268-SWAZILAND, 46-SWEDEN, 41-SWITZERLAND, 963-SYRIAN ARAB REPUBLIC, 886-TAIWAN, PROVINCE OF CHINA[A], 992-TAJIKISTAN, 255-TANZANIA, UNITED REPUBLIC OF, 66-THAILAND, 670-TIMOR-LESTE(EAST TIMOR), 228-TOGO, 690-TOKELAU, 676-TONGA, 1868-TRINIDAD AND TOBAGO, 216-TUNISIA, 90-TURKEY, 993-TURKMENISTAN, 1649-TURKS AND CAICOS ISLANDS, 688-TUVALU, 256-UGANDA, 380-UKRAINE, 971-UNITED ARAB EMIRATES, 44-UNITED KINGDOM OF GREAT BRITAIN AND NORTHERN IRELAND, 2-UNITED STATES OF AMERICA, 1009-UNITED STATES MINOR OUTLYING ISLANDS, 598-URUGUAY, 998-UZBEKISTAN, 678-VANUATU, 58-VENEZUELA (BOLIVARIAN REPUBLIC OF), 84-VIET NAM, 1284-VIRGIN ISLANDS (BRITISH), 1340-VIRGIN ISLANDS (U.S.), 681-WALLIS AND FUTUNA, 1013-WESTERN SAHARA, 967-YEMEN, 260-ZAMBIA, 263-ZIMBABWE, 9999-OTHERS

Other data-validation cells on the sheet carry only numeric/text bounds (no value list): `L4 L40:L46 L54:L55 J57 L57 L63:L68 L109 J84:J87`, `J6:J9 L10 J13:J18 …` (min `-99999999999999`), `L62 J59:J61 L72:L77 …` (min 0), `L99` (text len 20), `H100 G109 G112:G117` (IFSC text, code 11), `J88` etc. — these are calculated/number cells, not selectable lists.

---

## What repeats and what is one figure

- **One figure each** — the entire Part B-TI ladder (Sl.1-18) and the entire Part B-TTI tax ladder (Sl.1a-15). Each is a single computed cell; nothing there is an add-row grid.
- **Repeats** —
  - `Refund.BankAccountDtls.AddtnlBankDetails[]`: rows 112-117 (six template rows; auto Sl.No via `E=E_prev+1`). One object per Indian bank account.
  - `Refund.BankAccountDtls.ForeignBankDetails[]`: row 122 (one template row) for a non-resident's single foreign account.
- **Single flags** — `BankDtlsFlag` (L104), `AssetOutsideIndiaFlg` (L126).

---

## Mandatory

**Block `PartB-TI` — required** (schema `required`): `IncomeFromHP`, `ProfBusGain`, `CapGain`, `IncFromOS`, `TotalTI`, `CurrentYearLoss`, `BalanceAfterSetoffLosses`, `BroughtFwdLossesSetoff`, `GrossTotalIncome`, `IncChargeTaxSplRate111A112`, `DeductionsUndSchVIADtl`, `DeductionsUnder10Aor10AA`, `TotalIncome`, `IncChargeableTaxSplRates`, `NetAgricultureIncomeOrOtherIncomeForRate`, `AggregateIncome`, `LossesOfCurrentYearCarriedFwd`. (`DeemedTotIncSec115JC` optional.) Within the required objects, all listed sub-leaves are required (e.g. `CapGain.LongTerm.TotalLongTerm`, `DeductionsUndSchVIADtl.TotDeductUndSchVIA`).

**Block `PartB_TTI` — required**: `ComputationOfTaxLiability`, `TaxPaid`, `Refund`. Required leaves: all surcharge/tax/cess leaves under `TaxPayableOnDeemedTI` and `TaxPayableOnTI`; `GrossTaxPayable`, `CreditUS115JD`, `TaxPaidUnderCredit`; `TaxRelief.Section90/Section91/TotTaxRelief`; `NetTaxLiability`; `IntrstPay.IntrstPayUs234A/234B/234C/LateFilingFee234F/TotalIntrstPay`; `AggregateTaxInterestLiability`; `TaxPaid.TaxesPaid.TotalTaxesPaid`; `TaxPaid.BalTaxPayable`; `Refund.RefundDue`; `Refund.BankAccountDtls.BankDtlsFlag`; and, when a bank/foreign-bank row exists, its `IFSCCode/BankName/BankAccountNo/AccountType/UseForRefund` and `SWIFTCode/BankName/CountryCode/IBAN`. Optional: `IntrstPay.FeeFurnish234I`, all four `TaxesPaid` component amounts (AdvanceTax/TDS/TCS/SelfAssessmentTax), `NetTaxPayable115TD`, `TaxPayable115TD`, `NetRefundAdjust`, `AssetOutsideIndiaFlg`.

---

## Hidden rows — not built

These rows carry `hidden="1"` and must **not** be built as items:

| Row | Cells | What it is |
|---|---|---|
| 13 (H) | F13/G13/I13/J13 | 3aia — Short-term Capital Gain (15%) (11(ii) of item E of Sch CG); `J13 = STCG_CurrentYrGain15Percent` — legacy 15% STCG line, not in schema |
| 20 (H) | F20/G20/I20/J20 | 3bia — Long-term Capital Gain (10%) (11(vii) of item E of Sch CG); `J20 = LTCG_CurrentYrGain10Percent` — legacy 10% LTCG line |
| 22 (H) | F22/G22/I22/J22 | 3bii — Long-term Capital Gain (20%) (11(ix) of item E of Sch CG); `J22 = LTCG_CurrentYrGain20Percent` — legacy 20% LTCG line |
| 44 (H) | E44/F44/K44/L44 | 12a — Deduction u/s 10AA (Total of Schedule 10AA) — collapsed sub-line of Sl.12 |
| 45 (H) | E45/F45/K45 | 12b — Income of investment fund referred to in section 10(23FB) or 10(23FBA) |
| 46 (H) | E46/F46/K46 | 12c — Income of a business trust referred to in section 10(23FC) or 10(23FCA) |
| 99 (H) | E99 | Enter your bank account number (9 digits or more per CBS) — legacy single-account field |
| 105 (H) | E105 | Total number of savings and current bank accounts held during the previous year |
| 106 (H) | E106 | Details of all Bank Accounts held in India (excluding dormant accounts) — duplicate header |
| 109 (H) | M109 | NOTE: PLEASE VALIDATE SCHEDULE CG BEFORE IMPORTING BANK DETAILS |
| 110 (H) | M110 | NOTE: PLEASE VALIDATE SCHEDULE CG BEFORE IMPORTING BANK DETAILS |

(The whole `Tax` / `Sheet9` computation sheet is a separate hidden sheet, excluded from the build per `section_map` `why_built`; its named ranges are the source of every tax/surcharge/interest figure above.)

---

## What this means for the build

1. **This sheet is almost entirely read-only.** Only five things are user input: `BankDtlsFlag` (L104), `AssetOutsideIndiaFlg` (L126), the Indian bank grid (112-117) and the foreign bank grid (122). Everything else is derived and should be rendered as calculated (white) fields — do not accept user entry for any Sl.No. line.
2. **Build the engine, not the display.** The tax-on-income, surcharge (12%/15% base; 25% on 115BBE; 15% cap on 111A/112/112A; marginal relief), cess (4%), 234A/B/C interest, 234F/234-I fee and 115JD credit all resolve on the hidden `Tax`/`Sheet9` sheet through named ranges. Reproduce that arithmetic in code; never build the `Tax` sheet as a screen.
3. **Rounding matters.** Total income (Sl.13), amount payable (Sl.11), refund (Sl.12) round to nearest ₹10 (`ROUND(...,-1)`); aggregate liability (Sl.9), cess and surcharge round to ₹1 (`ROUND(...,0)`).
4. **Caps to enforce.** Chapter VI-A total ≤ (GTI − special-rate income) (Sl.11c); 10AA ≤ Schedule 10AA total and ≤ remaining income (Sl.12); 234F ≤ ₹5,000; 234-I ₹1,000/₹5,000 rule; agri income counted only if > ₹5,000.
5. **Surcharge sub-status switch.** `Surcharge_Rate` keys off the first char of `SubStatus` (15% for {1,2,3,4,5}; 12% for 6/7/8). Wire this to Part A-General sub-status; the AOP Group A-D case classification (`Tax!E2:I2`) drives the fuller slab/marginal-relief branches.
6. **Never emit negatives.** Nearly every leaf is `MAX(0,…)`; carry losses as nil here and to Schedule CYLA/CFL (schema notes "Do Not Use -ve sign").
7. **Bank grids drive refund.** Require at least one `UseForRefund=true` account; map account-type dropdown text → enum (`CA/SB/CC/OD/NRO/CGAS/OTH`) and country display → numeric `CountryCode`. A non-resident with no Indian account may file only `ForeignBankDetails`.
8. **Downstream dependencies.** AMT (Sl.4↔1a), AMTC (Sl.5↔4), SI (2b, 14), TR (6a/6b), IT/TDS/TCS (10a-10d), CFL (17), Schedule FA (mandatory if 17=Yes) all tie back to these cells — keep the named-range wiring exact.
