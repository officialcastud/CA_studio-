# The book of Part B-TI · Part B-TTI — ITR-6, A.Y. 2026-27

Read row by row from the utility's **PARTB - TI - TTI** sheet (`sheet63.xml`,
137 rows, visible), the hidden **Tax** computation sheet (`sheet18.xml`, 124
rows — see `books/ITR-6/Tax.md`, the method behind every figure here), the
named formulas, and the hidden-row flags, confirmed against the schema blocks
`PartB-TI` and `PartB_TTI` and the validation-rules document (serials 716-745
for Part B-TI, 755-784 for Part B-TTI).

This is the sheet a company's auditor holds against the paper return. Every line
below carries the form's own item number (from the rules document, cross-checked
against the utility's `I`/`K` code cells) so the two land on the same row.

**What makes ITR-6 different from ITR-2 here.** This is the *company* return, so:
- There is **no salary head** — Part B-TI opens at house property (item 1), and
  business/profession (item 2) is a full head with speculative, specified,
  foreign-diamond and special-rate sub-rows.
- The tax ladder is the **corporate flat rate** (25 / 30 / 22 / 15 %, or 35 %
  foreign), never individual slabs — driven by the `Tax` sheet.
- The alternate-minimum machinery is **MAT under 115JB** (item 18 / TTI 1) with
  **MAT credit under 115JAA** (TTI 4), not AMT 115JC / credit 115JD.
- The surcharge is the **company surcharge** (7 % / 12 % domestic, 2 % / 5 %
  foreign) at two thresholds, plus 25 % on 115BBE income; there are **no basic
  exemption, no 87A rebate, no section 89**.
- Interest 234A/B/C and fees 234F/234-I are computed on the hidden `Tax` sheet.

---

## Part 1 · Part B-TI — Computation of total income

Type key: `C` = computed (white cell, fed from another schedule, untypeable);
`inp` = enterable. Every live figure is an `integer` in the schema.

| Item | Label (utility) | Type | Schema key (`PartB-TI.…`) | Formula / derivation (cell) | Hidden? |
|---|---|---|---|---|---|
| **1** | Income from house property (3 of Schedule-HP) (enter nil if loss) | C | `IncomeFromHP` | `MAX(0, HP.TotalIncomeChargeableUnHP)` (L5) | |
| **2** | Profits and gains from business or profession | | | | |
| 2i | Profit and gains from business other than Insurance Business u/s 115B or Speculative business and Specified Business (A38 of Schedule-BP) (enter nil if loss) | C | `ProfBusGain.ProfGainNoSpecBus` | `MAX(sheet12.NetPLBusOthThanSpec7A7B7C, 0)` (J7) | |
| 2ia | Income of Foreign company from eligible business of selling raw diamonds (refer rule 10TIA) (3iva of Table E of Schedule BP) | C | `ProfBusGain.IncmForeignCompRule10TIA` | `MAX(sheet12.PftBus_raw, 0)` (J8) | |
| 2ii | Profit and gains from speculative business (3(ii) of Table E of Sch BP) (enter nil if loss and carry this figure to Schedule CFL) | C | `ProfBusGain.ProfGainSpecBus` | speculative profit net of set-off (J9) | |
| 2iii | Profit and gains from Specified Business (3(iii) of Table E of Sch BP) (enter nil if loss and carry this figure to Schedule CFL) | C | `ProfBusGain.ProfGainSpecifiedBus` | specified-business profit net of set-off (J10) | |
| 2iv | Income chargeable to tax at special rate (3d, 3e, 3f & 3iv of Table E of schedule BP) | C | `ProfBusGain.IncChrgblTaxSplRate` | `MAX(0, SUM(sheet10.IncRecCredPL115BBF, sheet10.IncRecCredPL115BBG, sheet12.IncOfCurYrAfterSetOffc, sheet10.IncRecCredPL115BBH))` (J11) | |
| *2v* | *Income from transfer of carbon credits u/s 115BBG (3e of Schedule BP)* | | *— no schema key* | | **hidden** (r12) |
| 2v | Total (2i + 2ia + 2ii + 2iii + 2iv) | C | `ProfBusGain.TotProfBusGain` | `SUM(J7:J11)` (L13) | |
| **3** | Capital gains | | | | |
| 3a | Short term | | | | |
| *3aia* | *Short-term chargeable @ 15% (point 11(ii) of item E of schedule CG)* | | *— no schema key* | (J16) | **hidden** (pre-23-July) (r16) |
| 3ai | Short-term chargeable @ 20% (point 8(ii) of item E of Sch CG) | C | `CapGain.ShortTerm.ShortTerm20Per` | `IHLA.Eiii7_CurrYrCapGain20` (J17) | |
| 3aii | Short-term chargeable @ 30% (point 8(iii) of item E of schedule CG) | C | `CapGain.ShortTerm.ShortTerm30Per` | `IHLA.Eiii7_CurrYrCapGain` (J18) | |
| 3aiii | Short-term chargeable at applicable rate (point 8(iv) of item E of schedule CG) | C | `CapGain.ShortTerm.ShortTermAppRate` | `IHLA.Eiv7_CurrYrCapGain` (J19) | |
| 3aiv | Short-term chargeable at special rates in India as per DTAA (point 8(v) of item E of Schedule CG) | C | `CapGain.ShortTerm.ShortTermSplRateDTAA` | `IHLA.Ev9_CurrYrCapGain` (J20) | |
| 3av | Total short-term Capital Gain (ai + aii + aiii + aiv) (enter nil if loss) | C | `CapGain.ShortTerm.TotalShortTerm` | `SUM(J17:J20)` (J21) | |
| 3b | Long term | | | | |
| *3bia* | *Long-term chargeable @ 10% (point 8(vi) of item E of schedule CG)* | | *— no schema key* | (J23) | **hidden** (r23) |
| 3bi | Long-term chargeable @ 12.5% (point 11(viii) 8vi of item E of Sch CG) | C | `CapGain.LongTerm.LongTerm12_5Per` | `MAX(0, IHLA.Eviii7_CurrYrCapGain12)` (J24) | |
| *3bii* | *Long-term chargeable @ 20% (point 11(ix) of item E of schedule CG)* | | *— no schema key* | (J25) | **hidden** (r25) |
| 3bii | Long-term chargeable at special rates in India as per DTAA (8vii of item E of schedule CG) | C | `CapGain.LongTerm.LongTermSplRateDTAA` | `IHLA.Eviii9_CurrYrCapGain` (J26) | |
| 3biii | Total Long-Term Capital Gain (bi + bii) (enter nil if loss) | C | `CapGain.LongTerm.TotalLongTerm` | `SUM(J24:J26)` (J27) | |
| 3c | Sum of Short-term/Long-term Capital Gains (3av + 3biii) (enter nil if loss) | C | `CapGain.ShortTermLongTermTotal` | `MAX(0, Sheet8b.TotalShortTerm + Sheet8b.LongTerm)` (L28) | |
| 3d | Capital gain chargeable @ 30% u/s 115BBH (C2 of schedule CG) | C | `CapGain.CapGains30Per115BBH` | `CG.C2_TotScheduleCGFor23` (L29) | |
| 3e | Total capital gains (3c + 3d) | C | `CapGain.TotalCapGains` | `SUM(Sheet8b.TotalCapGains, Sheet8b.C2ofCapGains)` (L30) | |
| **4** | Income from other sources | | | | |
| 4a | Net income from other sources chargeable to tax at normal applicable rates (6 of Schedule OS) (enter nil if loss) | C | `IncFromOS.OtherSrcThanOwnRaceHorse` | `MAX(0, os.BalanceNoRaceHorse)` (J32) | |
| 4b | Income chargeable to tax at special rate (2 of Schedule OS) | C | `IncFromOS.IncChargblSplRate` | `os.IncomeChargeableSpecialRates` (J33) | |
| 4c | Income from the activity of owning and maintaining race horses (8e of Schedule OS) (enter nil if loss) | C | `IncFromOS.FromOwnRaceHorse` | `MAX(0, os.BalanceOwnRaceHorse)` (J34) | |
| 4d | Total (4a + 4b + 4c) | C | `IncFromOS.TotIncFromOS` | `MAX(0, SUM(J32:J34))` (L35) | |
| **5** | Total of head wise income (1 + 2v + 3e + 4d) | C | `TotalTI` | `Sheet8b.TotIncFromOS + PARTBTI_TotalCapitalGain_New + Sheet8b.TotProfBusGain + Sheet8b.IncomeFromHP` (L36) | |
| **6** | Losses of current year to be set off against 5 (total of 2xvi, 3xvi and 4xvi of Schedule CYLA) | C | `CurrentYearLoss` | `SUM(sheet16.TotHPlossCurYrSetoff, sheet16.TotBusLossSetoff, sheet16.TotOthSrcLossNoRaceHorseSetoff)` (L37) | |
| **7** | Balance after set off current year losses (5 − 6) (also total of column 5 of Schedule CYLA + 4b + 2iv − 2e of schedule OS − 3iv of Table E of schedule BP) | C | `BalanceAfterSetoffLosses` | `MAX(0, Sheet8b.TotalTI − Sheet8b.CurrentYearLoss)` (L38) | |
| **8** | Brought forward losses to be set off against 7 (total of 2xv, 3xv and 4xv of Schedule BFLA) | C | `BroughtFwdLossesSetoff` | `SUM(sheet16.TotBFLossSetoff, sheet16.TotUnabsorbedDeprSetoff, sheet16.TotAllUs35cl4Setoff)` (L39) | |
| **9** | Gross Total income (7 − 8) (Total of column 5 of Sch BFLA + 4b + 2iv − 2e of schedule OS − 3iv of Table E of schedule BP) | C | `GrossTotalIncome` | `MAX(0, Sheet8b.BalanceAfterSetoffLosses − Sheet8b.BroughtFwdLossesSetoff)` (L40) | |
| **10** | Income chargeable to tax at special rate under section 111A, 112, 112A etc. included in 9 | C | `IncChargeTaxSplRate111A112` | `MAX(SUM(SI.SplRateInc), 0)` (L41) | |
| **11** | Deductions under Chapter VI-A | | | | |
| 11a | Part-B of Chapter VI-A [1 of Schedule VI-A and limited upto total of (i, ii, iv, v, viii, xii, xiii) of col 5 of schedule BFLA] | C | `DeductionsUndSchVIADtl.PartBchapterVIA` | `MAX(0, MIN(GrossTotalIncome − IncChargeableTaxSplRates, scvia.TotPartBchapterVIA_Calc))` (J43) | |
| 11b | Part-C of Chapter VI-A [2 of Schedule VI-A] | C | `DeductionsUndSchVIADtl.PartCchapterVIA` | `MAX(0, MIN(GTI − IncChargeableTaxSplRates − IncOfCurYrAfterSetOffBFLosses2b, scvia.TotPartCchapterVIA_Calc))` (J44) | |
| 11c | Total (11a + 11b) | C | `DeductionsUndSchVIADtl.TotDeductUndSchVIA` | `MAX(0, MIN(PartBchapterVIA + PartCchapterVIA, GTI − IncChargeableTaxSplRates))` (L45) | |
| **12** | Deduction u/s 10AA (Total of Schedule 10AA) | C | `DeductionsUnder10Aor10AA` | `MAX(0, MIN(…10AA/SEZ totals…, GTI − IncChargeableTaxSplRates − DeductionsUnderScheduleVIA))` (L46) | |
| **13** | Total Income (9 − 11c − 12) | C | `TotalIncome` | `ROUND(MAX(0, GTI − DeductionsUnder10Aor10AA − DeductionsUnderScheduleVIA), −1)` (L47) | |
| **14** | Income chargeable to tax at special rates (total of (i) of schedule SI) | C | `IncChargeableTaxSplRates` | `MAX(SUM(SI.SplRateIncCalc), 0)` (L48) | |
| **15** | Income chargeable to tax at normal rates (13 − 14) | C | `IncChargeableTaxNormalRates` | `MAX(0, TotalIncome − IncChargeTaxSplRate111A112)` (L49) | |
| **16** | Net agricultural income (2v of Schedule EI) | C | `NetAgricultureIncomeOrOtherIncomeForRate` | `Sheet20.NetAgriculturalIncome` (L50) | |
| **17** | Losses of current year to be carried forward (total of xxi of Schedule CFL) | C | `LossesOfCurrentYearCarriedFwd` | sum of the current-year loss-CF rows of Schedule CFL (L51) | |
| **18** | Deemed total income under section 115JB (9 of Schedule MAT) | C | `DeemedTotIncSec115JB` | `MAX(0, MAT.Total9)` (L52) | |

*Hidden banner:* `r4H` "TOTAL INCOME" is a section banner, not a data row.

### The Part B-TI rules the engine must satisfy (rules doc)

- **716** 2v = 2i + 2ia + 2ii + 2iii + 2iv. **717** 3a(v) = ai + aii + aiii + aiv.
  **718** 3b(iii) = bi + bii. **719** 3c = 3av + 3biii. **720** 4d = 4a + 4b + 4c.
  **721** 5 = 1 + 2v + 3e + 4d.
- **732** item 6 = 2xvi + 3xvi + 4xvi of CYLA. **733** item 8 = 2xv + 3xv + 4xv of BFLA.
  **734** GTI (9) = 5 − 6 − 8.
- **736 / 738 / 741** Total income (13) = GTI − VI-A − 10AA; **11c and 10AA are each
  capped at (9 − 10)** — i.e. Chapter VI-A and 10AA cannot be set against
  special-rate income (`GrossTotalIncome − IncChargeableTaxSplRates`). This is the
  cap the formulas at J43/J44/L45/L46 enforce with `MIN(…, GTI − special)`.
- **737** if 11b > 0, Schedule VI-A Part C must be filled. **735** if 10AA claimed,
  Schedule 10AA must be filled.
- **739** item 16 = 2v of Schedule EI. **745** item 18 = 9 of Schedule MAT.
- **674** MAT (115JB) does **not** apply where 115BAA / 115BAB is opted — then
  item 18 and TTI line 1 are forced to 0 (see `Tax` sheet L55-L58).

---

## Part 2 · Part B-TTI — Computation of tax liability on total income

| Item | Label (utility) | Type | Schema key (`PartB_TTI.…`) | Formula / derivation (cell) | Hidden? |
|---|---|---|---|---|---|
| **1** | Tax Payable u/s 115JB | | | | |
| 1a | Tax Payable on Deemed Total Income under section 115JB (10 of Schedule MAT) | C | `ComputationOfTaxLiability.TaxPayableOnDeemedTI.TaxDeemedTISec115JB` | `IF(115BAA/115BAB, 0, MAT.TaxPayableUs115JB)` (L55) | |
| 1b | Surcharge on (a) above (if applicable) | C | `ComputationOfTaxLiability.TaxPayableOnDeemedTI.Surcharge` | `IF(115BAA/115BAB, 0, SurchargeMAT)` = `Tax!C20` (L56) | |
| 1c | Health & Education Cess @ 4% on (1a + 1b) above | C | `ComputationOfTaxLiability.TaxPayableOnDeemedTI.EducationCess` | `IF(115BAA/115BAB, 0, ROUND(0.04 × (TaxDeemedTISec115JC + deemeds), 0))` (L57) | |
| 1d | Total Tax Payable u/s 115JB (1a + 1b + 1c) | C | `ComputationOfTaxLiability.TaxPayableOnDeemedTI.TotalTax` | `deemeds + TaxDeemedTISec115JC + EducationCess_DI` (L58) | |
| **2** | Tax payable on total income | | | | |
| 2a | Tax at normal rates on 15 of Part B-TI | C | `ComputationOfTaxLiability.TaxPayableOnTI.TaxAtNormalRates` | corporate rate on normal-rate income — `Tax!C4` ladder (J60) | |
| 2b | Tax at special rates (total of (ii) of Schedule-SI) | C | `ComputationOfTaxLiability.TaxPayableOnTI.TaxAtSpecialRates` | total of column (ii) of Schedule SI (J61) | |
| 2c | Tax Payable on Total Income (2a + 2b) | C | `ComputationOfTaxLiability.TaxPayableOnTI.TaxPayableOnTotInc` | `MAX(SUM(J60, J61), 0)` (L62) | |
| 2d | Surcharge | | | | |
| 2di | 25% of tax on Deemed Income chargeable u/s 115BBE | C | `ComputationOfTaxLiability.TaxPayableOnTI.Surcharge25ofSI` | `Sheet9.Surcharge_i` — 25 % of 115BBE tax, never marginal-relieved (I64) | |
| 2dii | On [(2c) − (Income Chargeable u/s 115BBE of Schedule SI)] | C | `ComputationOfTaxLiability.TaxPayableOnTI.SurchargeOnTaxPayable` | `Sheet9.Surcharge_ii` — company surcharge on the rest (I65) | |
| 2diii | Total (i + ii) | C | `ComputationOfTaxLiability.TaxPayableOnTI.TotalSurcharge` | `MAX(0, Surcharge_i + Surcharge_ii)` (L66) | |
| 2e | Health & Education cess @ 4% on 2c + 2diii | C | `ComputationOfTaxLiability.TaxPayableOnTI.EducationCess` | 4 % of (2c + 2diii) (r67) | |
| 2f | Gross tax liability (2c + 2diii + 2e) | C | `ComputationOfTaxLiability.TaxPayableOnTI.GrossTaxLiability` | `TaxPayableOnTotInc + SurchargeOnTaxPayable + EducationCess` (L68) | |
| **3** | Gross tax payable (higher of 1d and 2f) | C | `ComputationOfTaxLiability.GrossTaxPayable` | `MAX(Sheet9.GrossTaxLiability, Sheet9.TotalTax_DI)` (L69) | |
| **4** | Credit under section 115JAA of tax paid in earlier years (applicable if 2f is more than 1d) (5 of schedule MATC) | C | `ComputationOfTaxLiability.CredUs115JAATaxPaid` | `IF(GrossTaxLiability ≤ TotalTax_DI, 0, AMTC.TaxSection115JD)` (L70) | |
| **5** | Tax payable after credit under section 115JAA (3 − 4) | C | `ComputationOfTaxLiability.TaxPayableAfterCredUs115JAA` | `MAX(0, GrossTaxPayable − CreditUS115JD)` (L71) | |
| **6** | Tax relief | | | | |
| 6a | Section 90 / 90A (2 of Schedule TR) | C | `ComputationOfTaxLiability.TaxRelief.Section90` | `TR_TaxReliefOutsideIndiaDTAA` (J73) | |
| 6b | Section 91 (3 of Schedule TR) | C | `ComputationOfTaxLiability.TaxRelief.Section91` | `TR_TaxReliefOutsideIndiaNotDTAA` (J74) | |
| 6c | Total (6a + 6b) | C | `ComputationOfTaxLiability.TaxRelief.TotTaxRelief` | `SUM(J73:J74)` (L75) | |
| **7** | Net Tax liability (5 − 6c) (enter zero if negative) | C | `ComputationOfTaxLiability.NetTaxLiability` | `MAX(TaxPayAfterCreditUs115JD − TotTaxRelief, 0)` (L76) | |
| **8** | Interest and fee payable | | | | |
| 8a | Interest for default in furnishing the return (section 234A) | C | `ComputationOfTaxLiability.IntrstPay.IntrstPayUs234A` | 234A working on `Tax` sheet (M11 / N18) (r78) | |
| 8b | Interest for default in payment of advance tax (section 234B) | C | `ComputationOfTaxLiability.IntrstPay.IntrstPayUs234B` | 234B working on `Tax` sheet (M12 / N17) (r79) | |
| 8c | Interest for deferment of advance tax (section 234C) | C | `ComputationOfTaxLiability.IntrstPay.IntrstPayUs234C` | 234C quarterly working on `Tax` sheet (AD8 / M13) (r80) | |
| 8d | Fee for default in furnishing return of income (section 234F) | C | `ComputationOfTaxLiability.IntrstPay.LateFilingFee234F` | 234F (M10) (r81) | |
| 8da | Fee for furnishing revised return of income (section 234-I) | C | `ComputationOfTaxLiability.IntrstPay.FeeFurnish234I` | ₹1,000 or ₹5,000 per rules 783/784 (r82) | |
| 8e | Total Interest and Fee Payable (8a + 8b + 8c + 8d + 8da) | C | `ComputationOfTaxLiability.IntrstPay.TotalIntrstPay` | `SUM(J78:J81)` (L83) | |
| **9** | Aggregate liability (7 + 8e) | C | `ComputationOfTaxLiability.AggregateTaxInterestLiability` | `ROUND(NetTaxLiability + TotalIntrstPay, 0)` (L84) | |
| **10** | Taxes Paid | | | | |
| 10a | Advance Tax (from column 5 of 18A / Schedule IT) | C | `TaxPaid.TaxesPaid.AdvanceTax` | `AdvanceTax` from Schedule IT by date (J86) | |
| 10b | TDS (total of column 9 of 18B / schedule TDS 1 & 2) | C | `TaxPaid.TaxesPaid.TDS` | `SUM(TDS2.Total, TDS3.Total)` (J87) | |
| 10c | TCS (total of column 7(i) of 18C schedule TCS) | C | `TaxPaid.TaxesPaid.TCS` | `SUM(TCS1.ClaimedOwnHands)` (J88) | |
| 10d | Self Assessment Tax (from column 5 of 18A / Schedule IT) | C | `TaxPaid.TaxesPaid.SelfAssessmentTax` | `IT.SAT` from Schedule IT by date (J89) | |
| 10e | Total Taxes Paid (10a + 10b + 10c + 10d) | C | `TaxPaid.TaxesPaid.TotalTaxesPaid` | `SUM(J86:J89)` (L90) | |
| **11** | Amount payable (9 − 10e) (Enter if 9 is greater than 10e, else enter 0) | C | `TaxPaid.BalTaxPayable` | `ROUND(MAX(0, AggregateTaxInterestLiability − TotalTaxesPaid), −1)` (L91) | |
| **12** | Refund (If 10e is greater than 9) | C | `Refund.RefundDue` | `ROUND(MAX(0, TotalTaxesPaid − AggregateTaxInterestLiability), −1)` (L92) | |
| **13** | Net tax payable on 115TD income including interest u/s 115TE (Sr.no. 12 of Schedule 115TD) | C | `TaxPaid.NetTaxPayable115TD` | `Sch115TD.NetPayable` (L96) | |
| **14** | Tax payable u/s 115TD after adjustment of refund at Sl. No. 12 (13 − 12) | C | `TaxPaid.TaxPayable115TD` | `IF(NetTax_115TD > RefundDue, NetTax_115TD − RefundDue, 0)` (L97) | |
| **15** | Net refund after adjustment as per Sl. No. 14 (12 − 13) (refund, if any, will be directly credited into the bank account) | C | `TaxPaid.NetRefundAdjust` | `IF(RefundDue > NetTax_115TD, RefundDue − NetTax_115TD, 0)` (L98) | |
| **16** | Do you have a bank account in India | inp (Yes/No) | `Refund.BankAccountDtls.BankDtlsFlag` (Y/N) | — (L99) | |
| 16 | Details of all Bank Accounts held in India at any time during the previous year (excluding dormant accounts) | inp (array) | `Refund.BankAccountDtls.AddtnlBankDetails[]` | one row per account (r100, r107) | |
| 16 | IFS Code of the Bank | inp | `…AddtnlBankDetails[].IFSCCode` | validated against RBI (rule 765) (G107) | |
| 16 | Name of the Bank | inp | `…AddtnlBankDetails[].BankName` | (H107) | |
| 16 | Account Number | inp | `…AddtnlBankDetails[].BankAccountNo` | 9 digits or more per CBS (J107) | |
| 16 | Type of account | inp (enum) | `…AddtnlBankDetails[].AccountType` | (K107, K108:K112 dropdown) | |
| 16 | Select Account for refund credit (tick at least one account √) | inp (bool) | `…AddtnlBankDetails[].UseForRefund` | true / false (L107) | |
| 16b | Non-residents, at their option, furnish the details of one foreign bank account | inp (array) | `Refund.BankAccountDtls.ForeignBankDetails[]` | (r115, r116) | |
| 16b | SWIFT Code | inp | `…ForeignBankDetails[].SWIFTCode` | (G116) | |
| 16b | Name of the Bank | inp | `…ForeignBankDetails[].BankName` | (H116) | |
| 16b | Country of Location | inp (enum) | `…ForeignBankDetails[].CountryCode` | Country list (J117) | |
| 16b | IBAN | inp | `…ForeignBankDetails[].IBAN` | (L116) | |
| **17** | Do you at any time during the previous year hold, as beneficial owner, beneficiary or otherwise, any asset (including financial interest in any entity) located outside India; or have signing authority in any account located outside India; or have income from any source outside India? [applicable only in case of a resident] [Ensure Schedule FA is filled up if the answer is Yes] | inp (Yes/No) | `AssetOutsideIndiaFlg` (YES/NO) | (L121) | |

*Hidden helper rows (read, not built):* `r93H` "Enter your bank account number
(… 9 digits or more as per CBS system of the bank)", `r94H` "In case of direct
deposit to your bank account give additional details", `r95H` "IFS Code of the
bank" / "Type of account(select)", `r101H` "Total number of savings and current
bank accounts held …", `r102H` the IFSC-if-none note ("NNNN0NNNNNN / NOT
APPLICABLE / NA999"), `r103H` "(i) a. Bank Account in which refund, if any, shall
be credited", `r104H` its column headers, `r106H` "b. Other Bank account details",
`r122H` "Please state whether you have entered into any specified transaction …
[Ensure Schedule CT is filled up if the answer is Yes]" — the Schedule-CT
question, not part of `PartB_TTI`.

*Notes carried on the sheet:* `r108` "Note: Please validate Schedule CG before
importing Bank details"; `r114` "Note: 1. All bank accounts held at any time are
to be reported, except dormant A/c. 2. In case multiple accounts are selected,
the refund will be credited to one of the validated accounts after processing the
return".

### The Part B-TTI rules the engine must satisfy (rules doc)

- **755** 2b = total of Col.(ii) of Schedule SI. **757** 2c = 2a + 2b.
  **758** 2f = 2c + 2diii + 2e. **774** 1d = 1a + 1b + 1c.
- **768** item 3 "Gross tax payable" = **higher of 1d and 2f**. **769** item 5 = 3 − 4.
  **770** item 7 "Net tax liability" = 5 − 6c.
- **771** 1a = 10 of Schedule MAT. **677** 1d = MATC Sl.1 (tax u/s 115JB AY 2025-26).
  **678** 2f = MATC Sl.2.
- **772** item 4 (115JAA credit) = 5 of Schedule MATC. **773** credit u/s 115JAA
  **cannot be claimed if 2f < 1d** (i.e. only when normal tax exceeds MAT).
- **759 / 760 / 761** 6a = TR Sl.2, 6b = TR Sl.3, 6c = 6a + 6b.
- **762** 8e = 8a + 8b + 8c + 8d + 8da. **763** item 9 = 7 + 8e. **764** 10e = 10a + 10b + 10c + 10d.
- **766** item 11 (amount payable) = 10e − 9 if positive. **767** item 12 (refund) = 9 − 10e if positive.
- **775** 10a Advance tax = Schedule IT paid on/before 31/03/2026. **776** 10d
  self-assessment = Schedule IT paid after 31/03/2026. **777** 10c = col 7(i) of TCS.
  **778** 10b = col 9 of TDS 1 & 2.
- **779 / 780 / 781** 115TD lines 13 / 14 / 15 tie to Schedule 115TD Sl.12.
- **782** Schedule FA required if item 17 = "Yes". **765** IFSC tallies with RBI database.
- **783 / 784** 234-I fee = ₹1,000 if the ITR is filed after 31/12/2026 u/s 139(5) and
  total income ≤ ₹5 lakh; ₹5,000 otherwise (after 31/12/2026).
- **B27** Part A-General LEI is mandatory if item 12 "Refund" ≥ ₹50 crore.
- **D10** form 67 mandatory if relief u/s 90/91 claimed. **D11** form 29B mandatory
  if MAT tax > normal-provision tax.

---

## The computation method (the hidden `Tax` sheet) — summary

Full working in `books/ITR-6/Tax.md`. The lines above are results; the method is:

1. **Corporate tax ladder (2a / normal-rate tax), `Tax!C4`.** Domestic company
   (`Status_Dom_Foreign = "Y"`): 25 % if turnover answer `_Per25 = "N"` (small
   company) or 115BA; **22 %** under 115BAA; **15 % on manufacturing income +
   22 % on the balance** under 115BAB; else **30 %**. Foreign company: **35 %**
   (the utility comment records the old-40 %-to-35 % update). No basic exemption
   ("BASIC EXEMPTION IS NOT THERE IN ITR6", `Tax!S12`).
2. **115BAA eligibility gate, `Tax!D65`.** If any of a listed set of incentives
   is claimed (additional depreciation, 10AA/SEZ, 35AD, 32AD, ESR 35, Part-C
   Chapter VI-A other than 80JJAA/80M) the 22 % rate is withdrawn and 30 % applies.
3. **Company surcharge (2dii / `Surcharge_ii`).** Total income > ₹1 crore ≤ ₹10
   crore → **7 %** domestic / **2 %** foreign; > ₹10 crore → **12 %** domestic /
   **5 %** foreign; with **marginal relief** at each threshold (`Tax` rows 42-50).
   DTAA income has its own capped surcharge (rows 54-58: max 70 % domestic / 60 %
   foreign of the excess). **Surcharge on 115BBE income is a flat 25 %
   (`Surcharge_i`, 2di), never marginal-relieved.**
4. **Cess** is 4 % on (tax + surcharge), both on the normal computation (2e) and on
   the MAT computation (1c).
5. **MAT (115JB) and MAT credit (115JAA).** MAT tax and its own surcharge
   (`SurchargeMAT`, domestic 7 %/12 %, foreign 2 %/5 %, marginal-relieved — `Tax`
   rows 8-20) give 1a-1d. **Gross tax payable (item 3) = higher of 1d and 2f.**
   MAT credit (item 4) is allowed only when 2f > 1d. Internally the utility reuses
   the AMT named ranges (`TaxDeemedTISec115JC`, `CreditUS115JD`, `AMTC.TaxSection115JD`)
   even though the *company* provisions are 115JB / 115JAA — the displayed section
   and schema keys are 115JB / 115JAA. **Flag:** name/section mismatch is cosmetic;
   build the engine to 115JB / 115JAA.
6. **Interest 234A / 234B / 234C** (`Tax` columns M-AD). 234C runs five quarterly
   buckets on cumulative advance tax vs. 12/36/45/75/100 % targets, with a separate
   path when MAT/MATC tax is higher than the normal tax (`Higher_MATC`, `Tax!R9`).

---

## Enums / dropdowns on this sheet

**Do you have a bank account in India** / **foreign-asset question** (`L99`,
`L121`; the hidden `L122` uses the same list): `(Select)`, `Yes`, `No`.
- `BankDtlsFlag` schema enum: `Y` = Y, `N` = N.
- `AssetOutsideIndiaFlg` schema enum: `YES` = Yes, `NO` = No.

**Type of account** (`K108:K112`, named list `sheet9.TypeofAccount_list`):
`(SELECT)`, `Current Account`, `Cash Credit Account`, `Over draft account`,
`Non Resident Account`, `Capital Gains Accounts Scheme`, `Other`.
- Schema `AccountType` codes: `CA` = Current Account, `CC` = Cash Credit Account,
  `OD` = Over draft account, `NRO` = Non Resident Account, `CGAS` = Capital Gains
  Account(s) Scheme, `SB` = Savings, `OTH` = Other.

**Use for refund** (`UseForRefund` schema enum): `true`, `false`.

**Country of Location** (`J117`, foreign bank account; schema
`ForeignBankDetails[].CountryCode`) — the full ISO code list (251 entries):

(select), 93-AFGHANISTAN, 1001-ALAND ISLANDS, 355-ALBANIA, 213-ALGERIA, 684-AMERICAN SAMOA, 376-ANDORRA, 244-ANGOLA, 1264-ANGUILLA, 1010-ANTARCTICA, 1268-ANTIGUA AND BARBUDA, 54-ARGENTINA, 374-ARMENIA, 297-ARUBA, 61-AUSTRALIA, 43-AUSTRIA, 994-AZERBAIJAN, 1242-BAHAMAS, 973-BAHRAIN, 880-BANGLADESH, 1246-BARBADOS, 375-BELARUS, 32-BELGIUM, 501-BELIZE, 229-BENIN, 1441-BERMUDA, 975-BHUTAN, 591-BOLIVIA (PLURINATIONAL STATE OF), 1002-BONAIRE, SINT EUSTATIUS AND SABA, 387-BOSNIA AND HERZEGOVINA, 267-BOTSWANA, 1003-BOUVET ISLAND, 55-BRAZIL, 1014-BRITISH INDIAN OCEAN TERRITORY, 673-BRUNEI DARUSSALAM, 359-BULGARIA, 226-BURKINA FASO, 257-BURUNDI, 238-CABO VERDE, 855-CAMBODIA, 237-CAMEROON, 1-CANADA, 1345-CAYMAN ISLANDS, 236-CENTRAL AFRICAN REPUBLIC, 235-CHAD, 56-CHILE, 86-CHINA, 9-CHRISTMAS ISLAND, 672-COCOS (KEELING) ISLANDS, 57-COLOMBIA, 270-COMOROS, 242-CONGO, 243-CONGO (DEMOCRATIC REPUBLIC OF THE), 682-COOK ISLANDS, 506-COSTA RICA, 225-COTE DIVOIRE, 385-CROATIA, 53-CUBA, 1015-CURACAO, 357-CYPRUS, 420-CZECHIA, 45-DENMARK, 253-DJIBOUTI, 1767-DOMINICA, 1809-DOMINICAN REPUBLIC, 593-ECUADOR, 20-EGYPT, 503-EL SALVADOR, 240-EQUATORIAL GUINEA, 291-ERITREA, 372-ESTONIA, 251-ETHIOPIA, 500-FALKLAND ISLANDS (MALVINAS), 298-FAROE ISLANDS, 679-FIJI, 358-FINLAND, 33-FRANCE, 594-FRENCH GUIANA, 689-FRENCH POLYNESIA, 1004-FRENCH SOUTHERN TERRITORIES, 241-GABON, 220-GAMBIA, 995-GEORGIA, 49-GERMANY, 233-GHANA, 350-GIBRALTAR, 30-GREECE, 299-GREENLAND, 1473-GRENADA, 590-GUADELOUPE, 1671-GUAM, 502-GUATEMALA, 1481-GUERNSEY, 224-GUINEA, 245-GUINEA-BISSAU, 592-GUYANA, 509-HAITI, 1005-HEARD ISLAND AND MCDONALD ISLANDS, 6-HOLY SEE, 504-HONDURAS, 852-HONG KONG, 36-HUNGARY, 354-ICELAND, 91-INDIA, 62-INDONESIA, 98-IRAN (ISLAMIC REPUBLIC OF), 964-IRAQ, 353-IRELAND, 1624-ISLE OF MAN, 972-ISRAEL, 5-ITALY, 1876-JAMAICA, 81-JAPAN, 1534-JERSEY, 962-JORDAN, 7-KAZAKHSTAN, 254-KENYA, 686-KIRIBATI, 850-KOREA (DEMOCRATIC PEOPLES REPUBLIC OF), 82-KOREA (REPUBLIC OF), 965-KUWAIT, 996-KYRGYZSTAN, 856-LAO PEOPLES DEMOCRATIC REPUBLIC, 371-LATVIA, 961-LEBANON, 266-LESOTHO, 231-LIBERIA, 218-LIBYA, 423-LIECHTENSTEIN, 370-LITHUANIA, 352-LUXEMBOURG, 853-MACAO, 389-MACEDONIA (THE FORMER YUGOSLAV REPUBLIC OF), 261-MADAGASCAR, 265-MALAWI, 60-MALAYSIA, 960-MALDIVES, 223-MALI, 356-MALTA, 692-MARSHALL ISLANDS, 596-MARTINIQUE, 222-MAURITANIA, 230-MAURITIUS, 269-MAYOTTE, 52-MEXICO, 691-MICRONESIA (FEDERATED STATES OF), 373-MOLDOVA (REPUBLIC OF), 377-MONACO, 976-MONGOLIA, 382-MONTENEGRO, 1664-MONTSERRAT, 212-MOROCCO, 258-MOZAMBIQUE, 95-MYANMAR, 264-NAMIBIA, 674-NAURU, 977-NEPAL, 31-NETHERLANDS, 687-NEW CALEDONIA, 64-NEW ZEALAND, 505-NICARAGUA, 227-NIGER, 234-NIGERIA, 683-NIUE, 15-NORFOLK ISLAND, 1670-NORTHERN MARIANA ISLANDS, 47-NORWAY, 968-OMAN, 92-PAKISTAN, 680-PALAU, 970-PALESTINE, STATE OF, 507-PANAMA, 675-PAPUA NEW GUINEA, 595-PARAGUAY, 51-PERU, 63-PHILIPPINES, 1011-PITCAIRN, 48-POLAND, 14-PORTUGAL, 1787-PUERTO RICO, 974-QATAR, 262-REUNION, 40-ROMANIA, 8-RUSSIAN FEDERATION, 250-RWANDA, 1006-SAINT BARTHELEMY, 290-SAINT HELENA, ASCENSION AND TRISTAN DA CUNHA, 1869-SAINT KITTS AND NEVIS, 1758-SAINT LUCIA, 1007-SAINT MARTIN (FRENCH PART), 508-SAINT PIERRE AND MIQUELON, 1784-SAINT VINCENT AND THE GRENADINES, 685-SAMOA, 378-SAN MARINO, 239-SAO TOME AND PRINCIPE, 966-SAUDI ARABIA, 221-SENEGAL, 381-SERBIA, 248-SEYCHELLES, 232-SIERRA LEONE, 65-SINGAPORE, 1721-SINT MAARTEN (DUTCH PART), 421-SLOVAKIA, 386-SLOVENIA, 677-SOLOMON ISLANDS, 252-SOMALIA, 28-SOUTH AFRICA, 1008-SOUTH GEORGIA AND THE SOUTH SANDWICH ISLANDS, 211-SOUTH SUDAN, 35-SPAIN, 94-SRI LANKA, 249-SUDAN, 597-SURINAME, 1012-SVALBARD AND JAN MAYEN, 268-SWAZILAND, 46-SWEDEN, 41-SWITZERLAND, 963-SYRIAN ARAB REPUBLIC, 886-TAIWAN, 992-TAJIKISTAN, 255-TANZANIA, UNITED REPUBLIC OF, 66-THAILAND, 670-TIMOR-LESTE(EAST TIMOR), 228-TOGO, 690-TOKELAU, 676-TONGA, 1868-TRINIDAD AND TOBAGO, 216-TUNISIA, 90-TURKEY, 993-TURKMENISTAN, 1649-TURKS AND CAICOS ISLANDS, 688-TUVALU, 256-UGANDA, 380-UKRAINE, 971-UNITED ARAB EMIRATES, 44-UNITED KINGDOM OF GREAT BRITAIN AND NORTHERN IRELAND, 2-UNITED STATES OF AMERICA, 1009-UNITED STATES MINOR OUTLYING ISLANDS, 598-URUGUAY, 998-UZBEKISTAN, 678-VANUATU, 58-VENEZUELA (BOLIVARIAN REPUBLIC OF), 84-VIET NAM, 1284-VIRGIN ISLANDS (BRITISH), 1340-VIRGIN ISLANDS (U.S.), 681-WALLIS AND FUTUNA, 1013-WESTERN SAHARA, 967-YEMEN, 260-ZAMBIA, 263-ZIMBABWE, 9999-OTHERS

(The `IFS Code`, `SWIFT Code` and other list-sourced cells `L93`, `G105/G108/H95`,
`H104/H107`, `H116/H113`, `G109:G112`, `L117`, `H117`, `G117` reference named
helper ranges that do not resolve to a value list in the workbook and carry no
enumerated values.)

---

## What repeats and what is one figure

- **One figure:** every line of Part B-TI (1-18) and every computed line of Part
  B-TTI (1a-15) — each is a single value fed from its schedule.
- **Repeats:** `Refund.BankAccountDtls.AddtnlBankDetails[]` (one row per Indian
  bank account, up to five entry rows `r108-r112` on the sheet) and
  `Refund.BankAccountDtls.ForeignBankDetails[]` (one foreign account, `r117`).

## What the schema marks mandatory

On `PartB-TI` — every head total and every intermediate line is `required`
(IncomeFromHP through LossesOfCurrentYearCarriedFwd); only `DeemedTotIncSec115JB`
is optional. On `PartB_TTI` — the whole `ComputationOfTaxLiability` object (except
`CredUs115JAATaxPaid` / `TaxPayableAfterCredUs115JAA` / `FeeFurnish234I`), the
`TaxPaid.TaxesPaid` totals, `Refund.RefundDue`, `BankDtlsFlag`, each
`AddtnlBankDetails[]` field, each `ForeignBankDetails[]` field, and
`AssetOutsideIndiaFlg` are mandatory.

## Cross-sheet feeds

**In:** Schedule HP (item 1); Schedule BP / DPM / DEP tables (item 2); Schedule
CG Table E, Schedule 112A, 115AD, VDA (item 3); Schedule OS (item 4); CYLA / BFLA
(items 6, 8); Schedule VI-A + 80M / 80G etc. (item 11); Schedule 10AA (item 12);
Schedule SI (items 10, 14, TTI 2b); Schedule EI (item 16); Schedule CFL (item 17);
Schedule MAT (item 18, TTI 1a); Schedule MATC (TTI 4); Schedule TR (TTI 6);
Schedule IT (TTI 10a/10d), TDS 1 & 2 (10b), TCS (10c); Schedule 115TD (TTI 13);
Part A-General filing status (domestic/foreign flag, 115BA/115BAA/115BAB section,
turnover) driving the `Tax` sheet.

**Out:** Part B-TTI item 12 refund → LEI mandate in Part A-General (rule B27);
item 17 = Yes → Schedule FA required (rule 782); `Tax` sheet reads back item 2c,
total income, MAT/normal comparison for surcharge, cess and 234A/B/C interest.

## What this means for the build

1. **Part B-TI as a result block, items 1-18**, every hidden line omitted (2v
   carbon-credits, 3aia/3bia/3bii 10 %/15 %/20 % CG), every figure fed from its
   schedule; the three "capped at (9 − 10)" MINs on 11a/11b/11c and 10AA.
2. **Part B-TTI as a result block, items 1-17**, with the MAT comparison at item 3
   (higher of 1d, 2f), MAT credit at item 4 (only when 2f > 1d), relief at item 6
   from Schedule TR, 234-I fee at 8da, the 115TD adjustment at 13-15, the bank
   block at 16, and the foreign-asset flag at 17.
3. **The corporate tax ladder and surcharge come only from the `Tax` sheet** —
   25/30/22/15 % domestic, 35 % foreign; the 115BAA eligibility gate; 7 %/12 %
   (2 %/5 % foreign) surcharge with marginal relief; flat 25 % on 115BBE; DTAA
   surcharge cap. No individual slabs, no basic exemption, no 87A, no section 89.
4. **MAT / 115JAA, not AMT / 115JD** — build to the displayed sections and schema
   keys; note the utility's internal AMT-named ranges are a cosmetic carryover.
5. **Rounding** — item 13 to the nearest ten; items 11 and 12 of TTI to the
   nearest ten; item 9 to the nearest rupee.
6. **Export** — every line of both objects to its schema key; the bank block with
   `AddtnlBankDetails[]` / `ForeignBankDetails[]`; `BankDtlsFlag`; `AssetOutsideIndiaFlg`.

## Sources that were fully readable

Every live row, formula and dropdown of `PARTB - TI - TTI` and the `Tax`
computation sheet resolved (`tools/dump.py --formulas`, `--dropdowns`). No
compressed VBA or truncated line was encountered for these two sheets; the
corporate tax/surcharge/interest method is entirely in the `Tax` sheet's cell
formulas (there is no separate VBA `calculateTaxPayable` routine as in ITR-2).
