# The book of Part B - TI · Part B - TTI — ITR-3, A.Y. 2026-27

Read row by row from the utility's **Part B - TI TTI** sheet (rows 3-133), with
the hidden-row flags, the named formulas, and confirmed against the schema blocks
`PartB-TI` and `PartB_TTI`. Every figure below is picked up from another schedule —
"PLEASE NOTE THAT CALCULATED FIELDS (IN WHITE) ARE PICKED UP FROM OTHER S[heets]".
This is the sheet a CA holds against the paper form; each line carries the form's
own Sl. No. so the two land on the same row.

---

## The shape

Two stacked computations on one sheet. **Part B - TI** (rows 3-50) is the
*Computation of total income*: it aggregates the five heads (Salaries, House
Property, PGBP, Capital gains, Other sources), applies current-year and
brought-forward loss set-off, gross total income, Chapter VI-A deductions and
10AA, and lands on Total income and Aggregate income. **Part B - TTI**
(rows 52-133) is the *Computation of tax liability on total income*: AMT/deemed
income tax, tax on total income with surcharge and cess, marginal relief, AMT
credit, tax relief (89/90/90A/91), interest and fee (234A/B/C/F/234-I), taxes
paid (advance/TDS/TCS/self-assessment), and the amount payable or refund plus
the bank-account block. Almost every white cell is a pull from another schedule;
only the bank details, the two Yes/No declarations and the TRP block are keyed.

---

## The items

### Part B - TI (Computation of total income) — schema block `PartB-TI`

| Sl. No. | Field label | Type | Schema key | Rule / notes |
|---|---|---|---|---|
| 1 | Salaries (6 of Schedule S) | integer | `Salaries` | pull from Schedule S |
| 2 | Income from house property (3 of Schedule-HP) (enter nil if loss) | integer | `IncomeFromHP` | `MAX(0, HP.TotalIncomeChargeableUnHP)` (L5) |
| 3 | Profits and gains from business or profession | object | `ProfBusGain` | items 3i-3v |
| 3i | Profit and gains from business other than speculative business and specified business (A37 of Schedu[le BP]) | integer | `ProfBusGain.ProfGainNoSpecBus` | `MAX(0, NetPLBusOthThanSpec7A7B7C)` (J7) |
| 3ii | Profit and gains from speculative business (3(ii) of table E of Schedule BP) (enter nil if loss and [taxed]) | integer | `ProfBusGain.ProfGainSpecBus` | `MAX(0, IncOfCurYrAfterSetOffa)` (J8) |
| 3iii | Profit and gains from specified business(3(iii) of Table E of Schedule BP) (enter nil if loss and ta[xed]) | integer | `ProfBusGain.ProfGainSpecifiedBus` | `MAX(0, IncOfCurYrAfterSetOffb)` (J9) |
| 3iv | Income chargeable to tax at special rates (3e,3f & 3g of Schedule BP) | integer | `ProfBusGain.ProfIncome115BBF` | `MAX(0, Inc115BBF + Inc115BBG + Inc115BBH)` (J10) |
| 3v | Total (3i + 3ii + 3iii + 3iv) (enter nil if 3v is a loss) | integer | `ProfBusGain.TotProfBusGain` | `IF(SUM(J7:J10)<0,0,SUM(J7:J10))` (L11) |
| 4 | Capital gains | object | `CapGain` | items 4a-4e |
| 4a | Short term | object | `CapGain.ShortTerm` | |
| 4a(i) | Short-term chargeable @ 20% (8ii of item E of schedule CG) | integer | `CapGain.ShortTerm.ShortTerm20Per` | `MAX(0, Eiii7_CurrYrCapGain20)` (J15) |
| 4a(ii) | Short-term chargeable @ 30% (8iii of item E of schedule CG) | integer | `CapGain.ShortTerm.ShortTerm30Per` | `MAX(0, Eiii7_CurrYrCapGain)` (J16) |
| 4a(iii) | Short-term chargeable at applicable rate (8iv of item E of schedule CG) | integer | `CapGain.ShortTerm.ShortTermAppRate` | `MAX(0, Eiv7_CurrYrCapGain)` (J17) |
| 4a(iv) | STCG chargeable at special rates as per DTAA (8v of item E of Schedule CG) | integer | `CapGain.ShortTerm.ShortTermSplRateDTAA` | `MAX(0, Ev7_DTAArates)` (J18) |
| 4a(v) | Total Short-term (ai+ aii + aiii+aiv) | integer | `CapGain.ShortTerm.TotalShortTerm` | `SUM(J15:J18)` (J19) |
| 4b | Long term | object | `CapGain.LongTerm` | |
| 4b(i) | Long-term chargeable @ 12.5% (8vi of item E of schedule CG) | integer | `CapGain.LongTerm.LongTerm12_5Per` | `MAX(0, Eviii7_CurrYrCapGain12)` (J22) |
| 4b(ii) | LTCG chargeable at special rates as per DTAA (8vii of item E of Schedule CG) | integer | `CapGain.LongTerm.LongTermSplRateDTAA` | `MAX(0, E_LTCGv7_DTAArates)` (J24) |
| 4b(iii) | Total-Long term (bi+bii) (enter nil if loss) | integer | `CapGain.LongTerm.TotalLongTerm` | `SUM(LongTerm12.5NP + LTCGspecialrate)` (J25) |
| 4c | Sum of Short-term/Long-term Capital Gains (4av + 4biii) (enter nil if loss) | integer | `CapGain.ShortTermLongTermTotal` | `MAX(0, TotalShortTerm + LongTerm)` (L26) |
| 4d | Capital gain chargeable @ 30% u/s 115BBH (C2 of schedule CG) | integer | `CapGain.CapGains30Per115BBH` | `MAX(0, CG.IncomeVDA)` (L27) |
| 4e | Total capital gains (4c + 4d) | integer | `CapGain.TotalCapGains` | `MAX(SUM(TotalCapGains, L27), 0)` (L28) |
| 5 | Income from other sources | object | `IncFromOS` | items 5a-5d |
| 5a | Net Income from Other sources chargeable to tax at Normal Applicable rates (6 of Schedule OS) (enter [nil if loss]) | integer | `IncFromOS.OtherSrcThanOwnRaceHorse` | `MAX(0, os.BalanceNoRaceHorse)` (J30) |
| 5b | Income chargeable to tax at special rate (2 of Schedule OS) | integer | `IncFromOS.IncChargblSplRate` | `os.IncomeChargeableSpecialRates` (J31) |
| 5c | Income from the activity of owning & maintaining race horses (8e of Schedule OS)(enter nil if loss) | integer | `IncFromOS.FromOwnRaceHorse` | `MAX(0, os.BalanceOwnRaceHorse)` (J32) |
| 5d | Total (5a + 5b + 5c) (enter nil if loss) | integer | `IncFromOS.TotIncFromOS` | `MAX(0, SUM(J30:J32))` (L33) |
| 6 | Total of Head Wise Income((1 + 2 +3v+4e +5d) | integer | `TotalTI` | sum of the five heads (L34) |
| 7 | Losses of current year to be set off against 6 (total of 2xvi, 3xvi and 4xvi of Schedule CYLA) | integer | `CurrentYearLoss` | Schedule CYLA; do not use -ve sign (L35) |
| 8 | Balance after set off current year losses (6 - 7) (total of serial no (ii) to (xv) of column 5 of Sc[hedule CYLA]) | integer | `BalanceAfterSetoffLosses` | `MAX(0, TotalTI - CurrentYearLoss)` (L36) |
| 9 | Brought forward losses to be set off against 8 (total of 2xv, 3xv and 4xv of Schedule BFLA) | integer | `BroughtFwdLossesSetoff` | Schedule BFLA; do not use -ve sign (L37) |
| 10 | Gross Total income (8 - 9) (total of serial no (i) to (xiii) of column 5 of Schedule BFLA + 5b + 3iv[...]) | integer | `GrossTotalIncome` | `MAX(0, BalanceAfterSetoffLosses - BroughtFwdLossesSetoff)` (L38) |
| 11 | Income chargeable to tax at special rate under section 111A, 112,112A etc. included in 10 | integer | `IncChargeTaxSplRate111A112` | `SUM(SI.SplRateInc)` (L39) |
| 12 | Deductions under Chapter VI-A | object | `DeductionsUndSchVIADtl` | items 12a-12c |
| 12a | Part-B, CA and D of Chapter VI-A [(1 + 3) of Schedule VI-A and limited upto](i5+ii5+iii5+iv5+v5+viii[...]) | integer | `DeductionsUndSchVIADtl.PartBchapterVIA` | `MAX(0, MIN(...))` (J41) |
| 12b | Part-C of Chapter VI-A [2 of Schedule VI-A] | integer | `DeductionsUndSchVIADtl.PartCchapterVIA` | `MAX(0, TotPartCchapterVIA_Calc)` (J42) |
| 12c | Total (12a + 12b) [limited upto (10-11)] | integer | `DeductionsUndSchVIADtl.TotDeductUndSchVIA` | `MAX(0, MIN(PartB+PartC, GTI - special-rate income))` (L43) |
| 13 | Deduction u/s 10AA ( c of Sch. 10AA) | integer | `DeductionsUnder10Aor10AA` | `MAX(0, MIN(...))` (L44) |
| 14 | Total income (10 - 12c - 13) | integer | `TotalIncome` | `ROUND(MAX(0, GTI - 10AA - VI-A), ...)` (L45) |
| 15 | Income which is included in 14 and chargeable to tax at special rates (total of (i) of schedule SI) | integer | `IncChargeableTaxSplRates` | `SUM(SI.SplRateIncCalc)` (L46) |
| 16 | Net agricultural income/ any other income for rate purpose ( 2v of Schedule EI) | integer | `NetAgricultureIncomeOrOtherIncomeForRate` | `IF(NetAgriculturalIncome>5000, NetAgriculturalIncome, 0)` (L47) |
| 17 | Aggregate income (14-15+16) [applicable if (14-15) exceeds maximum amount not chargeable to tax] | integer | `AggregateIncome` | `IF((TotalIncome - special) > ExemptionUnder_TI, (TotalIncome - special) + agri, 0)` (L48) |
| 18 | Losses of current year to be carried forward (total of row xix of Schedule CFL) | integer | `LossesOfCurrentYearCarriedFwd` | `SUM(CFL!G24:U24)` (L49) |
| 19 | Deemed income under section 115JC (3 of Schedule AMT) | integer | `DeemedIncomeUs115JC` | `AMT.AdjustedUnderSec115JC` (L50) |

### Part B - TTI (Computation of tax liability on total income) — schema block `PartB_TTI`

| Sl. No. | Field label | Type | Schema key | Rule / notes |
|---|---|---|---|---|
| 1 | COMPUTATION OF TAX LIABILITY — Tax payable on deemed total income | object | `ComputationOfTaxLiability.TaxPayableOnDeemedTI` | |
| 1a | Tax payable on deemed total income under section 115JC (4 of Schedule AMT) | integer | `...TaxPayableOnDeemedTI.TaxDeemedTISec115JC` | `AMT.TaxPayableUnderSec115JC` (L53) |
| 1b | Surcharge on (a) (if applicable) | integer | `...TaxPayableOnDeemedTI.SurchargeOnAboveCrore` | `surchargeOnAboveCrore_temp` (L54); marginal-relief helpers CalcSurchargeAboveOneCrore / CalcSurchargeAbove50Lakh |
| 1c | Health and Education Cess , on (1a+1b) above | integer | `...TaxPayableOnDeemedTI.EducationCess` | `ROUND(0.04*(TaxDeemedTISec115JC + deemeds), 0)` (L55) |
| 1d | Total Tax Payable on deemed total income (1a+1b+1c) | integer | `...TaxPayableOnDeemedTI.TotalTax` | `deemeds + TaxDeemedTISec115JC + EducationCess_DI` (L56) |
| 2 | Tax payable on total income | object | `ComputationOfTaxLiability.TaxPayableOnTI` | items 2a-2i |
| 2a | Tax at normal rates on 17 of Part B-TI | integer | `...TaxPayableOnTI.TaxAtNormalRatesOnAggrInc` | on Aggregate income (item 17) |
| 2b | Tax at special rates (total of col (ii) of Schedule-SI) | integer | `...TaxPayableOnTI.TaxAtSpecialRates` | total of col (ii) of Schedule SI |
| 2c | Rebate on agricultural income [applicable if (14-15) of Part B-TI exceeds maximum amount not chargea[ble]] | integer | `...TaxPayableOnTI.RebateOnAgriInc` | agri rebate |
| 2d | Tax Payable on Total Income (2a + 2b-2c) | integer | `...TaxPayableOnTI.TaxPayableOnTotInc` | `IF(RebateOnAgriInc > 2a+2b, 0, MAX(...))` (L61) |
| 2e | Rebate under section 87A | integer | `...TaxPayableOnTI.Rebate87A` | `Rebate87Aformula_new` (L65); minimum 0 |
| 2f | Tax payable after rebate (2d – 2e) | integer | `...TaxPayableOnTI.TaxPayableOnRebate` | `MAX(0, TaxPayableOnTotInc - RebateUs88E)` (L66) |
| 2g | Surcharge | | | items A/B below, total at 2gBiv |
| 2gA | Surcharge computed before marginal relief | | | before marginal relief |
| 2gA(i) | 25% of 16(ii) of schedule SI | integer | `...TaxPayableOnTI.Surcharge25ofSIBeforeMarginal` | 115BBE surcharge before marginal relief (J69) |
| 2gA(ii) | 10% or 15%, as applicable | integer | `...TaxPayableOnTI.SurchargeOnAboveCroreBeforeMarginal` | `Surcharge_ii + MR_ND` (J70) |
| 2gA(iii) | On [(2f) – (16(ii) of schedule SI - tax on income referred in 2G(ii)above )] | | | balance base for surcharge |
| 2gB | Surcharge after marginal relief | | | after marginal relief |
| 2gB(i) | 25% of 17(ii) of schedule SI | integer | `...TaxPayableOnTI.Surcharge25ofSI` | 115BBE surcharge after marginal relief |
| 2gB(ii) | 10% or 15%, as applicable of 2(ii),3(ii), 9(ii), 12(ii), 22(ii), 24(ii), Dividend income u/s 115AD(1[...]) | integer | `...TaxPayableOnTI.SurchargeOnAboveCrore` | other-than-115BBE surcharge after marginal relief |
| 2gB(iii) | On [(2f) – (17(ii) + 2(ii) +3(ii)+9(ii)+12(ii)+22(ii)+24(ii) of schedule SI )] | | | balance base |
| 2gBiv | Total (ia+iia) | integer | `...TaxPayableOnTI.TotalSurcharge` | `MAX(0, Surcharge_i + Surcharge_ii)` (L76) |
| 2h | Health and Education Cess on (2f+2giv) | integer | `...TaxPayableOnTI.EducationCess` | cess on (2f + 2giv) |
| 2i | Gross tax liability (2f+2giv+2h) | integer | `...TaxPayableOnTI.GrossTaxLiability` | `BalTaxPayable + SurchargeOnTaxPayable + EducationCess` (L78) |
| 3 | Gross tax payable (higher of 1d and 2i) | integer | `ComputationOfTaxLiability.GrossTaxPayable` | `MAX(GrossTaxLiability, TotalTax_DI)` (L79) |
| 3a | Tax on income without including income on perquisites referred in section 17(2)(vi) received from em[ployer] | integer | `...GrossTaxPay.TaxInc17` | `MAX(0, GrossTaxPayable_3 - GrossTaxPayable_3b)` (L80) |
| 3b | Tax deferred - relatable to income on perquisites referred in section 17(2)(vi) received from employ[er] | integer | `...GrossTaxPay.TaxDeferred17` | `IF(GrossTaxLiability>TotalTax_DI, AC92, AC100)` (L81) |
| 3c | Tax deferred from earlier years but payable during current AY (Total of col. 7 of schedule Tax Defer[red on ESOP]) | integer | `...GrossTaxPay.TaxDeferredPayableCY` | sum of ESOP.TaxCurrAY (L82) |
| 4 | Credit under section 115JD of tax paid in earlier years (applicable if 2i is more than 1d) (5 of Sch[edule AMTC]) | integer | `ComputationOfTaxLiability.CreditUS115JD` | `IF(GrossTaxLiability <= TotalTax_DI, 0, AMTC.TaxSection115JD)` (L83) |
| 5 | Tax payable after credit under section 115JD (3a + 3c - 4) | integer | `ComputationOfTaxLiability.TaxPayAfterCreditUs115JD` | `IF((GrossTaxPayable + 3c) > CreditUS115JD, ...)` (L84) |
| 6 | Tax relief | object | `ComputationOfTaxLiability.TaxRelief` | items 6a-6e |
| 6a | Section 89 (Please ensure to submit Form 10E to claim this relief) | integer | `...TaxRelief.Section89` | submit Form 10E |
| 6b | Section 90/ 90A ( 2 of Schedule TR) | integer | `...TaxRelief.Section90` | `TR_TaxReliefOutsideIndiaDTAA` (J88) |
| 6c | Section 91 ( 3 of Schedule TR) | integer | `...TaxRelief.Section91` | `TR_TaxReliefOutsideIndiaNotDTAA` (J89) |
| 6e | Total (6a + 6b + 6c ) | integer | `...TaxRelief.TotTaxRelief` | `SUM(J86:J89)` (L90) |
| 7 | Net tax liability (5 – 6d) (Enter 0 if negative) | integer | `ComputationOfTaxLiability.NetTaxLiability` | `MAX(TaxPayAfterCreditUs115JD - TotTaxRelief, 0)` (L91) |
| 8 | Interest and fee payable | object | `ComputationOfTaxLiability.IntrstPay` | items 8a-8e |
| 8a | Interest for default in furnishing the return (section 234A) | integer | `...IntrstPay.IntrstPayUs234A` | section 234A |
| 8b | Interest for default in payment of advance tax (section 234B) | integer | `...IntrstPay.IntrstPayUs234B` | section 234B |
| 8c | Interest for deferment of advance tax (section 234C) | integer | `...IntrstPay.IntrstPayUs234C` | section 234C |
| 8d | Fee for default in furnishing return of income (section 234F) | integer | `...IntrstPay.LateFilingFee234F` | section 234F; maximum 5000 |
| 8da | Fee for furnishing revised return of income (section 234-I) | integer | `...IntrstPay.FeeFurnish234I` | section 234-I; maximum 5000 |
| 8e | Total Interest and Fee Payable (8a+8b+8c+8d+8da) | integer | `...IntrstPay.TotalIntrstPay` | `SUM(J93:J97)` (L98) |
| 9 | Aggregate liability (7 + 8e) | integer | `ComputationOfTaxLiability.AggregateTaxInterestLiability` | `ROUND(NetTaxLiability + TotalIntrstPay, 0)` (L99) |
| 10 | TAXES PAID — Taxes Paid | object | `TaxPaid.TaxesPaid` | items 10a-10e |
| 10a | Advance Tax (from column 5 of 17A ) | integer | `TaxPaid.TaxesPaid.AdvanceTax` | `IT.AT` (J101) |
| 10b | TDS (total of column 5 of 17B and column 9 of 17C ) | integer | `TaxPaid.TaxesPaid.TDS` | `SUM(TotalTDSSal) + ClaimedInOwnHands...` (J102) |
| 10c | TCS (column 7 of 17D) | integer | `TaxPaid.TaxesPaid.TCS` | `SUM(TCS1.TotalSchTCS)` (J103) |
| 10d | Self-Assessment Tax (from column 5 of 17A) | integer | `TaxPaid.TaxesPaid.SelfAssessmentTax` | `IT.SAT` (J104) |
| 10e | Total Taxes Paid (10a+10b+10c + 10d) | integer | `TaxPaid.TaxesPaid.TotalTaxesPaid` | `SUM(J101:J104)` (L105) |
| — | (Balance tax payable helper) | integer | `TaxPaid.BalTaxPayable` | derived balance figure |
| 11 | Amount payable (Enter if 9 is greater than 10e, else enter 0) | integer | (payable) | `ROUND(MAX(0, AggregateTaxInterestLiability - TotalTaxesPaid), -1)` (L106) |
| 12 | Refund (If 10e is greater than 9) (Refund, if any, will be directly credited into the bank account) | integer | `Refund.RefundDue` | `ROUND(MAX(0, TotalTaxesPaid - AggregateTaxInterestLiability), -1)` (L107) |
| 13 | Bank Account Details | object | `Refund.BankAccountDtls` | |
| 13 | Do you have a bank account in India (Non-residents claiming refund with no bank account in India may [...]) | string enum | `Refund.BankAccountDtls.BankDtlsFlag` | Y / N (sheet L112 Yes/No) |
| 13(i) | a)Details of all Bank Accounts held in India at any time during the previous year (excluding dormant [a/c]) | array | `Refund.BankAccountDtls.AddtnlBankDetails[]` | one row per account |
| — | IFS Code of the bank in case of Bank Account held in India | string | `...AddtnlBankDetails[].IFSCCode` | |
| — | Name of the Bank | string | `...AddtnlBankDetails[].BankName` | maxLength 125 |
| — | Account Number | string | `...AddtnlBankDetails[].BankAccountNo` | maxLength 20 |
| — | Type of account | string enum | `...AddtnlBankDetails[].AccountType` | SB/CA/CC/OD/NRO/CGAS/OTH |
| — | Select Account for refund credit (tick at least one account) | string enum | `...AddtnlBankDetails[].UseForRefund` | true / false |
| — | Note: Please validate Schedule CG before importing Bank details | | | note |
| 13(ii) | b)Non-residents, who are claiming income-tax refund and not having bank account in India may, at the [option] | array | `Refund.BankAccountDtls.ForeignBankDetails[]` | foreign accounts |
| — | SWIFT Code | string | `...ForeignBankDetails[].SWIFTCode` | maxLength 30 |
| — | Name of the Bank | string | `...ForeignBankDetails[].BankName` | maxLength 125 |
| — | Country/Region of Location | string enum | `...ForeignBankDetails[].CountryCode` | Country code list; maxLength 4 |
| — | IBAN | string | `...ForeignBankDetails[].IBAN` | maxLength 40 |
| 14 | Do you at any time during the previous year,- (i) hold, as beneficial owner, beneficiary or otherwis[e] | string enum | `AssetOutIndiaFlag` | YES / NO (asset held outside India; sheet L129) |

**Note: 1. All bank accounts held at any time are to be reported, except dormant A/c 2.In case, multip[le]** accounts — the sheet's own footnote (row 122).

**Tax Return Preparer (TRP) block (rows 130-133):** *If the return has been
prepared by a Tax Return Preparer (TRP) give further details below:* —
**Identification No. of TRP**, **Name of TRP**, **Counter Signature of TRP**, and
*If TRP is entitled for any reimbursement from the Government, amount thereof.*
These are captured in the form's declaration/TRP block, not in the PartB_TTI
schema block.

---

## The rules the sheet computes

- **L5** — Income from house property is floored at zero: `MAX(0, HP.TotalIncomeChargeableUnHP)` (enter nil if loss).
- **J7-J10** — each PGBP component is `MAX(0, ...)`; speculative/specified nil if loss.
- **L11** — 3v total: `IF(SUM(J7:J10)<0, 0, SUM(J7:J10))` — nil if the sum is a loss.
- **J15-J18 / J19** — short-term components floored at 0; `av = SUM(J15:J18)`.
- **J22, J24 / J25** — long-term components floored at 0; `biii = SUM(LongTerm12.5NP + LTCGspecialrate)`.
- **L26** — 4c `MAX(0, TotalShortTerm + LongTerm)` — nil if loss.
- **L27** — 4d `MAX(0, CG.IncomeVDA)` — VDA gains @30% u/s 115BBH.
- **L28** — 4e `MAX(SUM(TotalCapGains, L27), 0)`.
- **J30-J32 / L33** — OS components floored at 0; `5d = MAX(0, SUM(J30:J32))`.
- **L35** — current-year loss set-off = `SUM(TotHPlossCurYrSetoff, TotBusLossSetoff, TotOthSrcLossNoRaceHorseSetoff)` from Schedule CYLA.
- **L36** — `MAX(0, TotalTI - CurrentYearLoss)`.
- **L37** — brought-forward set-off = `SUM(TotBFLossSetoff, TotUnabsorbedDeprSetoff, TotAllUs35cl4Setoff)` from BFLA.
- **L38** — Gross total income `MAX(0, BalanceAfterSetoffLosses - BroughtFwdLossesSetoff)`.
- **L39** — item 11 `SUM(SI.SplRateInc)` = total of (i) of Schedule SI (111A/112/112A special-rate income).
- **J41 / L43** — Chapter VI-A capped: 12c `MAX(0, MIN(PartB + PartC, GrossTotalIncome - IncChargeableTaxSplRates))` — VI-A limited to (10 − 11).
- **L44** — 10AA deduction `MAX(0, MIN(GTI - special-rate - VI-A, ...))`.
- **L45** — Total income `ROUND(MAX(0, GTI - 10AA - VI-A), ...)`.
- **L47** — item 16 counts agricultural income only if `> 5000`: `IF(NetAgriculturalIncome>5000, NetAgriculturalIncome, 0)`.
- **L48** — Aggregate income applies only when (14−15) exceeds the exemption limit: `IF((TotalIncome - special) > ExemptionUnder_TI, (TotalIncome - special) + agri, 0)`. `ExemptionUnder_TI` (S48) = 400000 under the new regime (bacValue=1), else age-banded (60-79 / 80+) basic exemption by residential status.
- **L49** — CFL carry-forward `SUM(CFL!G24:U24)`.
- **L50 / L53** — deemed income and tax under 115JC from Schedule AMT.
- **L55** — 1c cess `ROUND(0.04*(TaxDeemedTISec115JC + deemeds), 0)` — 4% health & education cess.
- **Surcharge marginal relief (S/W/X columns)** — helper set: `taxOnCutOffInc` at the 1cr / 50L thresholds, `extraInc = S57 - 10000000` (crore) / `X57 - 5000000` (50 lakh), `marginal_Relief = MAX((tax+surcharge) - (taxOnCutOff+extraInc), 0)` (S77/X77), surcharge slabs 15% above 1cr (S59) and 10% above 50L (X59). `last_digit_AMT` / RoundDown drives the AMT round-off (S57/U57).
- **L61** — 2d `IF(RebateOnAgriInc > TaxAtNormalRates + TaxAtSpecialRates, 0, MAX(SUM(2a, 2b) - 2c, 0))`.
- **L65** — 2e rebate 87A `Rebate87Aformula_new` (minimum 0).
- **L66** — 2f `MAX(0, TaxPayableOnTotInc - RebateUs88E)`.
- **L76** — 2gBiv total surcharge `MAX(0, Surcharge_i + Surcharge_ii)`.
- **L78** — 2i gross tax liability `BalTaxPayable + SurchargeOnTaxPayable + EducationCess`.
- **L79** — item 3 `MAX(GrossTaxLiability, TotalTax_DI)` — higher of 1d and 2i.
- **L80** — 3a `MAX(0, GrossTaxPayable_3 - GrossTaxPayable_3b)`.
- **L83** — 4 AMT credit `IF(GrossTaxLiability <= TotalTax_DI, 0, AMTC.TaxSection115JD)`.
- **L84** — 5 `IF((GrossTaxPayable + 3c) > CreditUS115JD, GrossTaxPayable + 3c - credit, ...)`.
- **L90** — 6e `SUM(J86:J89)` total relief.
- **L91** — 7 net tax liability `MAX(TaxPayAfterCreditUs115JD - TotTaxRelief, 0)` (enter 0 if negative).
- **L98** — 8e `SUM(J93:J97)`.
- **L99** — 9 `ROUND(NetTaxLiability + TotalIntrstPay, 0)`.
- **L105** — 10e `SUM(J101:J104)`.
- **L106** — 11 amount payable `ROUND(MAX(0, AggregateTaxInterestLiability - TotalTaxesPaid), -1)` (only if 9 > 10e).
- **L107** — 12 refund `ROUND(MAX(0, TotalTaxesPaid - AggregateTaxInterestLiability), -1)` (only if 10e > 9).
- **E121** — `E120 + 1` auto-increments the bank-row serial number.

---

## Dropdowns

- **Do you have a bank account in India** (L112) and **Do you ... hold ... asset outside India** (L129) — list `PortugueseCode`: **(Select)**, **Yes**, **No**. (Same list also on L109.)
- **Type of account** (L81:L82 refund bank rows): **(Select)**, **Savings Account**, **Current Account**, **Cash Credit Account**, **Over Draft Account**, **Non Resident Account**, **Capital Gain Account Scheme**, **Other**. (Schema enum: SB, CA, CC, OD, NRO, CGAS, OTH.)
- **Type of account (select)** (L111) — named range `Accnt_Type` (values resolve to the same account-type list above).
- **Country/Region of Location** (I126 foreign bank rows) — named range `Country`:

(Select), 93-AFGHANISTAN, 1001-ALAND ISLANDS, 355-ALBANIA, 213-ALGERIA, 684-AMERICAN SAMOA, 376-ANDORRA, 244-ANGOLA, 1264-ANGUILLA, 1010-ANTARCTICA, 1268-ANTIGUA AND BARBUDA, 54-ARGENTINA, 374-ARMENIA, 297-ARUBA, 61-AUSTRALIA, 43-AUSTRIA, 994-AZERBAIJAN, 1242-BAHAMAS, 973-BAHRAIN, 880-BANGLADESH, 1246-BARBADOS, 375-BELARUS, 32-BELGIUM, 501-BELIZE, 229-BENIN, 1441-BERMUDA, 975-BHUTAN, 591-BOLIVIA (PLURINATIONAL STATE OF), 1002-BONAIRE, SINT EUSTATIUS AND SABA, 387-BOSNIA AND HERZEGOVINA, 267-BOTSWANA, 1003-BOUVET ISLAND, 55-BRAZIL, 1014-BRITISH INDIAN OCEAN TERRITORY, 673-BRUNEI DARUSSALAM, 359-BULGARIA, 226-BURKINA FASO, 257-BURUNDI, 238-CABO VERDE, 855-CAMBODIA, 237-CAMEROON, 1-CANADA, 1345-CAYMAN ISLANDS, 236-CENTRAL AFRICAN REPUBLIC, 235-CHAD, 56-CHILE, 86-CHINA, 9-CHRISTMAS ISLAND, 672-COCOS (KEELING) ISLANDS, 57-COLOMBIA, 270-COMOROS, 242-CONGO, 243-CONGO (DEMOCRATIC REPUBLIC OF THE), 682-COOK ISLANDS, 506-COSTA RICA, 225-COTE DIVOIRE, 385-CROATIA, 53-CUBA, 1015-CURACAO, 357-CYPRUS, 420-CZECHIA, 45-DENMARK, 253-DJIBOUTI, 1767-DOMINICA, 1809-DOMINICAN REPUBLIC, 593-ECUADOR, 20-EGYPT, 503-EL SALVADOR, 240-EQUATORIAL GUINEA, 291-ERITREA, 372-ESTONIA, 251-ETHIOPIA, 500-FALKLAND ISLANDS (MALVINAS), 298-FAROE ISLANDS, 679-FIJI, 358-FINLAND, 33-FRANCE, 594-FRENCH GUIANA, 689-FRENCH POLYNESIA, 1004-FRENCH SOUTHERN TERRITORIES, 241-GABON, 220-GAMBIA, 995-GEORGIA, 49-GERMANY, 233-GHANA, 350-GIBRALTAR, 30-GREECE, 299-GREENLAND, 1473-GRENADA, 590-GUADELOUPE, 1671-GUAM, 502-GUATEMALA, 1481-GUERNSEY, 224-GUINEA, 245-GUINEA-BISSAU, 592-GUYANA, 509-HAITI, 1005-HEARD ISLAND AND MCDONALD ISLANDS, 6-HOLY SEE, 504-HONDURAS, 852-HONG KONG, 36-HUNGARY, 354-ICELAND, 91-INDIA, 62-INDONESIA, 98-IRAN (ISLAMIC REPUBLIC OF), 964-IRAQ, 353-IRELAND, 1624-ISLE OF MAN, 972-ISRAEL, 5-ITALY, 1876-JAMAICA, 81-JAPAN, 1534-JERSEY, 962-JORDAN, 7-KAZAKHSTAN, 254-KENYA, 686-KIRIBATI, 850-KOREA (DEMOCRATIC PEOPLES REPUBLIC OF), 82-KOREA (REPUBLIC OF), 965-KUWAIT, 996-KYRGYZSTAN, 856-LAO PEOPLES DEMOCRATIC REPUBLIC, 371-LATVIA, 961-LEBANON, 266-LESOTHO, 231-LIBERIA, 218-LIBYA, 423-LIECHTENSTEIN, 370-LITHUANIA, 352-LUXEMBOURG, 853-MACAO, 389-MACEDONIA (THE FORMER YUGOSLAV REPUBLIC OF), 261-MADAGASCAR, 265-MALAWI, 60-MALAYSIA, 960-MALDIVES, 223-MALI, 356-MALTA, 692-MARSHALL ISLANDS, 596-MARTINIQUE, 222-MAURITANIA, 230-MAURITIUS, 269-MAYOTTE, 52-MEXICO, 691-MICRONESIA (FEDERATED STATES OF), 373-MOLDOVA (REPUBLIC OF), 377-MONACO, 976-MONGOLIA, 382-MONTENEGRO, 1664-MONTSERRAT, 212-MOROCCO, 258-MOZAMBIQUE, 95-MYANMAR, 264-NAMIBIA, 674-NAURU, 977-NEPAL, 31-NETHERLANDS, 687-NEW CALEDONIA, 64-NEW ZEALAND, 505-NICARAGUA, 227-NIGER, 234-NIGERIA, 683-NIUE, 15-NORFOLK ISLAND, 1670-NORTHERN MARIANA ISLANDS, 47-NORWAY, 968-OMAN, 92-PAKISTAN, 680-PALAU, 970-PALESTINE, STATE OF, 507-PANAMA, 675-PAPUA NEW GUINEA, 595-PARAGUAY, 51-PERU, 63-PHILIPPINES, 1011-PITCAIRN, 48-POLAND, 14-PORTUGAL, 1787-PUERTO RICO, 974-QATAR, 262-REUNION, 40-ROMANIA, 8-RUSSIAN FEDERATION, 250-RWANDA, 1006-SAINT BARTHELEMY, 290-SAINT HELENA, ASCENSION AND TRISTAN DA CUNHA, 1869-SAINT KITTS AND NEVIS, 1758-SAINT LUCIA, 1007-SAINT MARTIN (FRENCH PART), 508-SAINT PIERRE AND MIQUELON, 1784-SAINT VINCENT AND THE GRENADINES, 685-SAMOA, 378-SAN MARINO, 239-SAO TOME AND PRINCIPE, 966-SAUDI ARABIA, 221-SENEGAL, 381-SERBIA, 248-SEYCHELLES, 232-SIERRA LEONE, 65-SINGAPORE, 1721-SINT MAARTEN (DUTCH PART), 421-SLOVAKIA, 386-SLOVENIA, 677-SOLOMON ISLANDS, 252-SOMALIA, 28-SOUTH AFRICA, 1008-SOUTH GEORGIA AND THE SOUTH SANDWICH ISLANDS, 211-SOUTH SUDAN, 35-SPAIN, 94-SRI LANKA, 249-SUDAN, 597-SURINAME, 1012-SVALBARD AND JAN MAYEN, 268-SWAZILAND, 46-SWEDEN, 41-SWITZERLAND, 963-SYRIAN ARAB REPUBLIC, 886-TAIWAN, 992-TAJIKISTAN, 255-TANZANIA, UNITED REPUBLIC OF, 66-THAILAND, 670-TIMOR-LESTE(EAST TIMOR), 228-TOGO, 690-TOKELAU, 676-TONGA, 1868-TRINIDAD AND TOBAGO, 216-TUNISIA, 90-TURKEY, 993-TURKMENISTAN, 1649-TURKS AND CAICOS ISLANDS, 688-TUVALU, 256-UGANDA, 380-UKRAINE, 971-UNITED ARAB EMIRATES, 44-UNITED KINGDOM OF GREAT BRITAIN AND NORTHERN IRELAND, 2-UNITED STATES OF AMERICA, 1009-UNITED STATES MINOR OUTLYING ISLANDS, 598-URUGUAY, 998-UZBEKISTAN, 678-VANUATU, 58-VENEZUELA (BOLIVARIAN REPUBLIC OF), 84-VIET NAM, 1284-VIRGIN ISLANDS (BRITISH), 1340-VIRGIN ISLANDS (U.S.), 681-WALLIS AND FUTUNA, 967-YEMEN, 263-ZIMBABWE, 260-ZAMBIA, 1013-WESTERN SAHARA, 9999-OTHERS

---

## What repeats and what is one figure

- **One figure each:** every Part B-TI line (items 1-19) and every Part B-TTI
  computed line (1a-1d, 2a-2i, 3/3a/3b/3c, 4, 5, 6a-6e, 7, 8a-8e, 9, 10a-10e,
  11, 12) is a single scalar — all pulled from other schedules; none repeat.
- **Arrays (repeat):**
  - `Refund.BankAccountDtls.AddtnlBankDetails[]` — Indian bank accounts (IFSCCode, BankName, BankAccountNo, AccountType, UseForRefund), one row per account, at least one ticked for refund credit.
  - `Refund.BankAccountDtls.ForeignBankDetails[]` — foreign bank accounts for non-residents with no Indian account (SWIFTCode, BankName, CountryCode, IBAN).
- **Single flags:** `BankDtlsFlag` (Y/N) and `AssetOutIndiaFlag` (YES/NO).

---

## Mandatory (schema `required` keys)

**PartB-TI** required: `Salaries`, `IncomeFromHP`, `ProfBusGain` (with ProfGainNoSpecBus, ProfGainSpecBus, ProfGainSpecifiedBus, ProfIncome115BBF, TotProfBusGain), `CapGain` (ShortTerm{ShortTerm20Per, ShortTerm30Per, ShortTermAppRate, ShortTermSplRateDTAA, TotalShortTerm}, LongTerm{LongTerm12_5Per, LongTermSplRateDTAA, TotalLongTerm}, ShortTermLongTermTotal, CapGains30Per115BBH, TotalCapGains), `IncFromOS` (OtherSrcThanOwnRaceHorse, IncChargblSplRate, FromOwnRaceHorse, TotIncFromOS), `TotalTI`, `CurrentYearLoss`, `BalanceAfterSetoffLosses`, `BroughtFwdLossesSetoff`, `GrossTotalIncome`, `IncChargeTaxSplRate111A112`, `DeductionsUndSchVIADtl` (PartBchapterVIA, PartCchapterVIA, TotDeductUndSchVIA), `DeductionsUnder10Aor10AA`, `TotalIncome`, `AggregateIncome`, `DeemedIncomeUs115JC`. Not required: `IncChargeableTaxSplRates`, `NetAgricultureIncomeOrOtherIncomeForRate`, `LossesOfCurrentYearCarriedFwd`.

**PartB_TTI** required: `ComputationOfTaxLiability`, `TaxPaid`, `Refund`, `AssetOutIndiaFlag`; and within them TaxDeemedTISec115JC, SurchargeOnAboveCrore, EducationCess, TotalTax, TaxAtNormalRatesOnAggrInc, TaxAtSpecialRates, RebateOnAgriInc, TaxPayableOnTotInc, Rebate87A, TaxPayableOnRebate, Surcharge25ofSI, Surcharge25ofSIBeforeMarginal, SurchargeOnAboveCroreBeforeMarginal, SurchargeOnAboveCrore, TotalSurcharge, GrossTaxLiability, GrossTaxPayable, TaxInc17, TaxDeferred17, TaxDeferredPayableCY, CreditUS115JD, TaxPayAfterCreditUs115JD, TotTaxRelief, NetTaxLiability, IntrstPayUs234A, IntrstPayUs234B, IntrstPayUs234C, LateFilingFee234F, AggregateTaxInterestLiability, TotalTaxesPaid, RefundDue, BankDtlsFlag, and (per bank row) IFSCCode, BankName, BankAccountNo, AccountType, UseForRefund, SWIFTCode, CountryCode, IBAN. Not required: TaxRelief.Section89/Section90/Section91, IntrstPay.FeeFurnish234I/TotalIntrstPay, TaxesPaid.AdvanceTax/TDS/TCS/SelfAssessmentTax, TaxPaid.BalTaxPayable.

---

## Hidden rows — not built

These rows carry the hidden flag `H` in the utility and must never be surfaced as items:

- **r14 (aia)** — Short-term chargeable @ 15% (11ii of item E of schedule CG). Legacy pre-July STCG rate; superseded by the 20% row (r15). No schema key.
- **r21 (bia)** — Long-term chargeable @ 10% (11vii of item E of schedule CG). Legacy pre-July LTCG rate; superseded by 12.5% (r22). No schema key.
- **r23 (bii @20%)** — Long-term chargeable @ 20% (11ix of item E of schedule CG). Legacy indexed-LTCG rate; hidden. No schema key.
- **r62** — Rebate under section 88E (4 of Schedule-STTR). Hidden legacy rebate line.
- **r63** — Balance Tax Payable (1 -2). Hidden intermediate.
- **r64** — Surcharge on 3. Hidden intermediate.
- **r87 (6b)** — Section 89A. Hidden relief line (retirement-account income); not in this year's TR schema mapping.
- **r108** — Enter your bank account number (9 digits or more per CBS). Hidden legacy field.
- **r109** — Select Yes if you want your refund by direct deposit ... (Yes/No). Hidden legacy refund-mode selector.
- **r111** — IFS Code of the bank / Type of account(select). Hidden legacy single-account fields.
- **r113** — Total number of savings and current bank accounts held ... during the previous year. Hidden count field.
- **r114** — Details of all Bank Accounts held in India ... (excluding dormant). Hidden header.
- **r116** — Sl.No / IFS Code of the Bank / Name of the Bank / Account Number. Hidden table header for the legacy Indian-accounts grid.
- **r118** — b. Other Bank account details. Hidden sub-header.

The bank-account grid the form actually builds is the **visible** one at rows
115-125 (AddtnlBankDetails + ForeignBankDetails); the hidden r108-r118 fields are
an older single-account layout.

---

## What this means for the build

- Part B-TI and Part B-TTI are almost entirely **read-only computed** cells
  ("white / calculated fields picked up from other sheets"). The section-builder
  wires each item to its source schedule's named cell (listed in the rules
  above); it does not collect these as user input.
- The only **keyed input** on this sheet: the two Yes/No declarations
  (`BankDtlsFlag`, `AssetOutIndiaFlag`), the **AddtnlBankDetails** and
  **ForeignBankDetails** tables, and the TRP block. Everything else flows in.
- Enforce the **caps and floors** exactly (item 11's special-rate carve-out, the
  VI-A cap at 10−11, the >5000 agri gate, the 1cr/50L surcharge marginal-relief
  helpers, the higher-of-1d-and-2i rule, and the two ROUND(...,−1) at amount
  payable / refund). These are the rules the engine would otherwise miss.
- Build **only the visible** bank grid (rows 115-125). Do not surface the hidden
  legacy single-account fields (r108-r118) or the hidden legacy rate rows
  (r14/r21/r23) or the hidden tax lines (r62/r63/r64/r87).
- At least one AddtnlBankDetails row must be ticked `UseForRefund = true` when a
  refund is due; non-residents with no Indian account use ForeignBankDetails.

---

## Mechanical coverage appendix (verbatim visible cell text — reference only, NOT items)

This appendix reproduces the exact text of every visible labelled cell (including the utility's own developer annotation cells in far columns O-X) so the CA can trace each phrase back to the sheet. These are not additional items; the items are the numbered rows in the tables above.

- Computation of total income PLEASE NOTE THAT CALCULATED FIELDS (IN WHITE) ARE PICKED UP FROM OTHER S
- Salaries (6 of Schedule S)
- Income from house property (3 of Schedule-HP) (enter nil if loss)
- Profits and gains from business or profession
- Profit and gains from business other than speculative business and specified business (A37 of Schedu
- Profit and gains from speculative business (3(ii) of table E of Schedule BP) (enter nil if loss and
- Profit and gains from specified business(3(iii) of Table E of Schedule BP) (enter nil if loss and ta
- Income chargeable to tax at special rates (3e,3f & 3g of Schedule BP)
- Total (3i + 3ii + 3iii + 3iv) (enter nil if 3v is a loss)
- Capital gains
- Short-term chargeable @ 20% (8ii of item E of schedule CG)
- Short-term chargeable @ 30% (8iii of item E of schedule CG)
- Short-term chargeable at applicable rate (8iv of item E of schedule CG)
- STCG chargeable at special rates as per DTAA (8v of item E of Schedule CG)
- Total Short-term (ai+ aii + aiii+aiv)
- Long-term chargeable @ 12.5% (8vi of item E of schedule CG)
- LTCG chargeable at special rates as per DTAA (8vii of item E of Schedule CG)
- Total-Long term (bi+bii) (enter nil if loss)
- Sum of Short-term/Long-term Capital Gains (4av + 4biii) (enter nil if loss)
- Capital gain chargeable @ 30% u/s 115BBH (C2 of schedule CG)
- Total capital gains (4c + 4d)
- Income from other sources
- Net Income from Other sources chargeable to tax at Normal Applicable rates (6 of Schedule OS) (enter
- Income chargeable to tax at special rate (2 of Schedule OS)
- Income from the activity of owning & maintaining race horses (8e of Schedule OS)(enter nil if loss)
- Total (5a + 5b + 5c) (enter nil if loss)
- Total of Head Wise Income((1 + 2 +3v+4e +5d)
- Losses of current year to be set off against 6 (total of 2xvi, 3xvi and 4xvi of Schedule CYLA)
- Balance after set off current year losses (6 - 7) (total of serial no (ii) to (xv) of column 5 of Sc
- Brought forward losses to be set off against 8 (total of 2xv, 3xv and 4xv of Schedule BFLA)
- Gross Total income (8 - 9) (total of serial no (i) to (xiii) of column 5 of Schedule BFLA + 5b + 3iv
- Income chargeable to tax at special rate under section 111A, 112,112A etc. included in 10
- Deductions under Chapter VI-A
- Part-B, CA and D of Chapter VI-A [(1 + 3) of Schedule VI-A and limited upto](i5+ii5+iii5+iv5+v5+viii
- Part-C of Chapter VI-A [2 of Schedule VI-A]
- Total (12a + 12b) [limited upto (10-11)]
- Deduction u/s 10AA ( c of Sch. 10AA)
- Income which is included in 14 and chargeable to tax at special rates (total of (i) of schedule SI)
- Net agricultural income/ any other income for rate purpose ( 2v of Schedule EI)
- AY 2025-26 Updated as per Bindu
- AY 2024-25 Formula
- Aggregate income (14-15+16) [applicable if (14-15) exceeds maximum amount not chargeable to tax]
- Losses of current year to be carried forward (total of row xix of Schedule CFL)
- Deemed income under section 115JC (3 of Schedule AMT)
- Computation of tax liability on total income
- COMPUTATION OF TAX LIABILITY
- Tax payable on deemed total income under section 115JC (4 of Schedule AMT)
- Surcharge on (a) (if applicable)
- Health and Education Cess , on (1a+1b) above
- taxPayable or taxOnTotInc
- Total Tax Payable on deemed total income (1a+1b+1c)
- taxOnCutOffInc (including previous slab surcharge i.e 10%
- Last Digit of AMT
- Tax payable on total income
- RoundDown Value from AMT
- Tax at normal rates on 17 of Part B-TI
- Tax at special rates (total of col (ii) of Schedule-SI)
- Rebate on agricultural income [applicable if (14-15) of Part B-TI exceeds maximum amount not chargea
- TotalTaxPayable.INCD - sheet9.TaxPayableOnTotInc-SI_112A_Tax-'SPI - SI - IF'!I77-SI_Section115AD Old
- Tax Payable on Total Income (2a + 2b-2c)
- As per BA team updated
- //check if eligible for marginal relief
- Tax payable after rebate (2d – 2e)
- Surcharge computed before marginal relief
- New approach-1 - Rebate
- New approach-2-Rebate1
- New approach-3-Rebate1-Final
- On [(2f) – (16(ii) of schedule SI - tax on income referred in 2G(ii)above )]
- Surcharge after marginal relief
- 10% or 15%, as applicable of 2(ii),3(ii), 9(ii), 12(ii), 22(ii), 24(ii), Dividend income u/s 115AD(1
- Health and Education Cess on (2f+2giv)
- marginal Relief
- Gross tax liability (2f+2giv+2h)
- Gross tax payable (higher of 1d and 2i)
- For Rebate 87A Editable
- Tax on income without including income on perquisites referred in section 17(2)(vi) received from em
- Updated by Bindu as per DE Sheet post confirmation from BA Shubham
- Tax deferred - relatable to income on perquisites referred in section 17(2)(vi) received from employ
- Tax deferred from earlier years but payable during current AY (Total of col. 7 of schedule Tax Defer
- Credit under section 115JD of tax paid in earlier years (applicable if 2i is more than 1d) (5 of Sch
- Tax payable after credit under section 115JD (3a + 3c - 4)
- Section 89 (Please ensure to submit Form 10E to claim this relief)
- Net tax liability (5 – 6d) (Enter 0 if negative)
- Interest and fee payable
- Temp Net Taxable Inc
- Interest for default in furnishing the return (section 234A)
- Interest for default in payment of advance tax (section 234B)
- Interest for deferment of advance tax (section 234C)
- Fee for default in furnishing return of income (section 234F)
- Fee for furnishing revised return of income (section 234-I)
- Total Interest and Fee Payable (8a+8b+8c+8d+8da)
- Aggregate liability (7 + 8e)
- Advance Tax (from column 5 of 17A )
- TDS (total of column 5 of 17B and column 9 of 17C )
- Self-Assessment Tax (from column 5 of 17A)
- Total Taxes Paid (10a+10b+10c + 10d)
- Amount payable (Enter if 9 is greater than 10e, else enter 0)
- totInc + dtaaInc
- Refund (If 10e is greater than 9) (Refund, if any, will be directly credited into the bank account)
- (taxOnTotInc-incChargeTaxSplRate111A112)+taxAtSpecialRates
- Bank Account Details
- Do you have a bank account in India (Non-residents claiming refund with no bank account in India may
- a)Details of all Bank Accounts held in India at any time during the previous year (excluding dormant
- IFS Code of the bank in case of Bank Account held in India
- Name of the Bank
- Account Number
- Type of account
- Select Account for refund credit (tick at least one account √ )
- Note: Please validate Schedule CG before importing Bank details
- Note: 1. All bank accounts held at any time are to be reported, except dormant A/c 2.In case, multip
- b)Non-residents, who are claiming income-tax refund and not having bank account in India may, at the
- Country/Region of Location
- Do you at any time during the previous year,- (i) hold, as beneficial owner, beneficiary or otherwis
- If the return has been prepared by a Tax Return Preparer (TRP) give further details below:
- Counter Signature of TRP
- If TRP is entitled for any reimbursement from the Government, amount thereof……………
