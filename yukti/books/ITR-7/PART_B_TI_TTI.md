# The book of Part B-TI · Part B-TTI — ITR-7, A.Y. 2026-27

Read row by row from the utility's **PART-B-TI & TTI** sheet (rows 3–308, many
hidden), the named formulas and the hidden-row flags, confirmed against **four**
schema blocks — `PartB_TI`, `PartB_TI2`, `PartB_TI3` and `PartB_TTI` — and the
validation-rules document.

**What makes ITR-7 different.** This is the *trust / institution* return, so
Part B-TI is **computed once per exemption regime**, and the utility paints
three parallel Part B-TI sub-statements on the one sheet:

| Sub-statement | Sheet block | Schema block | Applicable when exemption is claimed under |
|---|---|---|---|
| **Part-B1** (rows 4–113) | first Part B-TI | **`PartB_TI`** | ss. 11 & 12, or 10(23C)(iv)/(v)/(vi)/(via) |
| **Part-B2** (rows 114–179) | second Part B-TI | **`PartB_TI2`** | s. 13A/13B and ss. 10(21), 10(23A)…10(47) |
| **Part-B3** (rows 180–240) | third Part B-TI | **`PartB_TI3`** | 22nd proviso to s. 10(23C) or s. 13(10) (income taxed at MMR) |
| **Part B – TTI** (rows 241–308) | tax liability | **`PartB_TTI`** | always — computation of tax on the total income |

Only the regime that matches the filing status (Part A-General item A26 / the
"Return furnished under section" code) is filed; the other two are computed but
inert. The tax ladder for a trust is normal rates, plus **30 % on anonymous
donations u/s 115BBC** (item 1c) and **30 % on specified income u/s 115BBI**
(item 1d), **maximum marginal rate** where exemption is withdrawn (Part-B3), and
the company/AOP surcharge and 4 % cess. MAT/AMT (115JB/115JC, rows 242–245) is
hidden for the ordinary trust.

Type key: `C` = computed (white cell, fed from another schedule, untypeable);
`inp` = enterable. Every live figure is an `integer` in the schema unless noted.

---

## Part 1 · Part-B1 — computation for ss. 11/12 or 10(23C) trusts (`PartB_TI`)

Applicable if exemption is being claimed u/s 11 and 12 or
10(23C)(iv)/(v)/(vi)/(via) (E4). The voluntary-contribution corpus, the
application of income, the accumulation, the additions on violation and the
income-not-forming-part heads all live here.

| Item | Label (utility, abridged) | Type | Schema key (`PartB_TI.…`) |
|---|---|---|---|
| 1 | Voluntary Contributions and anonymous donations taxable u/s 115BBC (Other than Corpus) | C | `VcCorpusSec11` |
| 2 | Voluntary contribution forming part of corpus other than anonymous donations | C | `VoluntaryContributions.TotIncFromVC` |
| 2A | Corpus representing donations received for renovation/repair of places notified u/s 80G(2)(b) | C | `VoluntaryContributions.CorpusDonationUS80G` |
| 2B | Corpus other than above [Aib + Bib of Schedule VC] | C | `VoluntaryContributions.CorpusOtherThan80G` |
| 4 | Aggregate of income referred to in ss. 11, 12 and 10(23C)(iv)/(v)/(vi)/(via) | C | `AggregateIncomeUs1112` |
| 5 | Amount eligible for exemption under section 11(1)(c) | C | `AmtForCharitableUs111` |
| 5a | Approval number given by the Board | inp | `AmtForCharitableUs111Number` |
| 5b | Date of approval by the Board | inp | `AmtForCharitableUs111Date` |
| 6 | Income to be applied [1+3-4-(A1-A1a of Schedule A)] | C | `IncToBeApplied` |
| 6i | Amount applied during the previous year (excluding borrowed/deemed/corpus) | C | `TIDeductions.AmtAppliedtForCharitablePurpose` |
| 6ii | Repayment of loan during the previous year | C | `TIDeductions.AmtAppForCharitablePurposeRepayment` |
| 6iii | Amount invested/deposited back into specified mode of corpus | C | `TIDeductions.AmtAppliedSpecifiedMode` |
| 6iv | Amount deemed to have been applied (clause (2) of Explanation to s. 11(1)) | C | `TIDeductions.AmtDeemedForCharitable` |
| 6iv-A | Whether option Form No. 9A furnished to the AO | inp (Yes/No) | `TIDeductions.ExercisedBfDueDateFlag` |
| 6iv-B | If yes, date of furnishing Form No. 9A | inp | `TIDeductions.DateOfFurnishing` |
| 6v | Amount accumulated or set apart for application (s. 11(2)) | C | `TIDeductions.AmtAccumulatedForCharitable` |
| 6vi | Amount set apart for specified purposes (s. 11(2)) | C | `TIDeductions.AmtFulfilledUs11_2` |
| 6vi-A | Whether option Form No. 10 furnished to the AO | inp (Yes/No) | `TIDeductions.IsForm10Furnished` |
| 6vi-B | If yes, date of furnishing Form No. 10 | inp | `TIDeductions.DateOfFurnishingForm10` |
| 6vii | Total [6i + 6ii + 6iii + 6iv + 6v + 6vi] | C | `TIDeductions.TotalDeductions` |
| 7i | Income chargeable under section 115BBI (Total of Sl. 7 of Schedule 115BBI) | C | `TIAdditions.IncChargeableUs115BBI` |
| 7ii | Anonymous donation (exemption u/s 11 not available) | C | `TIAdditions.ExemptionUs11_13Dtl.AnonymousDonationVC` |
| 7iii | Income chargeable under section 12(2) | C | `TIAdditions.IncChargeableUs12_2` |
| 7iv | Amount disallowable u/s 11(1) r.w.s 40(a)(ia) or 10(23C) r.w.s 40(a)(ia) | C | `TIAdditions.AmtDsllwblUs111RWS40AIA` |
| 7v | Amount disallowable u/s 11(1) r.w.s 40A(3)/(3A) or 10(23C) r.w.s 40A(3)/(3A) | C | `TIAdditions.AmtDsllwblUs111RWS40A3` |
| 7vi | Income as per Explanation 3B (violation of Explanation 3A) | C | `TIAdditions.IncExp3BUS80G` |
| 7vii | Income as per Explanation 1B (violation of Explanation 1A) | C | `TIAdditions.IncExp1BUS80G` |
| 7viii | Any other income on which exemption is not allowable | C | `TIAdditions.AnyOthrIncome` |
| 7ix | Total [7i+…+7viii] | C | `TIAdditions.TotalAdditions` |
| 8 | Income chargeable u/s 11(4) | C | `IncChargeableUs11_4` |
| 9 | Gross income after exemption u/s 11/10(23C) [(5-6vii)+7ix+8] | C | `GrossIncome` |
| 10i | Income from house property [3 of Schedule HP] (enter nil if loss) | C | `IncomeFromHP` |
| 10ii | Profits and gains of business or profession [D48 of Schedule BP] | C | `ProfBusGain.ProfGainNoSpecBus` |
| 10iiiA | Short-term chargeable @ 20% (8ii of item E of Sch CG) | C | `CapGain.ShortTerm.ShortTerm20Per` |
| 10iiiA | Short-term chargeable @ 30% (8iii) | C | `CapGain.ShortTerm.ShortTerm30Per` |
| 10iiiA | Short-term chargeable at applicable rate (8iv) | C | `CapGain.ShortTerm.ShortTermAppRate` |
| 10iiiA | Short-term chargeable at special rates as per DTAA (8v) | C | `CapGain.ShortTerm.ShortTermSplRateDTAA` |
| 10iiiAv | Total Short-term (Ai+Aii+Aiii+Aiv) | C | `CapGain.ShortTerm.TotalShortTerm` |
| 10iiiB | Long-term chargeable @ 12.5% (8vi) | C | `CapGain.LongTerm.LongTerm12_5Per` |
| 10iiiB | Long-term chargeable at special rates as per DTAA (8vii) | C | `CapGain.LongTerm.LongTermSplRateDTAA` |
| 10iiiBiii | Total Long-term (Bi+Bii) | C | `CapGain.LongTerm.TotalLongTerm` |
| 10iiiC | Sum of short-term/long-term capital gains (Av+Biii) | C | `CapGain.ShortTermLongTermTotal` |
| 10iiiD | Capital gain chargeable @ 30% u/s 115BBH (C2 of Sch CG) | C | `CapGain.CapGains30Per115BBH` |
| 10iiiE | Total capital gains (C + D) | C | `CapGain.TotalCapGains` |
| 10iv | Income from other sources [9 of Schedule OS] | C | `IncFromOS.TotIncFromOS` |
| 10v | Total (10i + 10ii + 10iiiE + 10iv) | C | `TotIncNotPart7And11Abv` |
| 11 | Gross income (9 + 10) | C | `GrossIncome` (roll-up) |
| 12 | Losses of current year to be set off against 10v (2xiv/3xiv/4xiv of CYLA) | C | `CurrentYearLoss` |
| 13 | Total Income [11 − 12] | C | `TotalIncome` |
| 14 | Income included in 13 and chargeable at special rates (col (i) of Schedule SI) | C | `IncChargeableTaxSplRates` |
| 15 | Anonymous donations to be taxed u/s 115BBC @ 30% (Diii of Schedule VC) | C | `DonationsUs115BBC` |
| 16 | Specified income chargeable u/s 115BBI @ 30% (Sl. 7 of Schedule 115BBI) | C | `IncChargUs115BBIIncld13` |
| 17 | Aggregate income to be taxed at normal rates (13 − 14 − 15 − 16) | C | `AggIncothSpecInc115BBI` |
| — | Total of head-wise income | C | `TotalTI` |

`PartB_TI` marks every one of these `required` except
`AmtForCharitableUs111Number`, `AmtForCharitableUs111Date`,
`ExercisedBfDueDateFlag`, `DateOfFurnishing`, `IsForm10Furnished`,
`DateOfFurnishingForm10`, `ProfBusGain.ProfGainNoSpecBus` and
`IncFromOS.TotIncFromOS`.

---

## Part 2 · Part-B2 — computation for s. 13A/13B or 10(21)…10(47) (`PartB_TI2`)

Applicable if exemption is claimed under s. 13A/13B and under ss. 10(21),
10(23A)… (E114). This regime lists the exemption clauses one by one (items 1a–1n
and 2a–2f), the s. 11(3) read with 10(21) add-back, the political-party (13A) /
electoral-trust (13B) exemptions, the voluntary contribution, and the heads not
forming part of the above, then aggregates to total income and the maximum-
marginal-rate figure.

| Item | Label (utility, abridged) | Type | Schema key (`PartB_TI2.…`) |
|---|---|---|---|
| 1 | Total — Amount eligible for exemption under ss. 10(21)…10(47) | C | `TotExemptionUs10_21to29` |
| 1a | Exemption under section 10(21) | C | `ExemptionUs1021` |
| 1c | Exemption under section 10(23A) | C | `ExemptionUs10_23A` |
| 1b | Exemption under section 10(23AAA) | C | `ExemptionUs10_23AAA` |
| 1c | Exemption under section 10(23B) | C | `ExemptionUs10_23B` |
| 1f | Exemption under section 10(23EC) | C | `ExemptionUs10_23EC` |
| 1g | Exemption under section 10(23ED) | C | `ExemptionUs10_23ED` |
| 1h | Exemption under section 10(23EE) | C | `ExemptionUs10_23EE` |
| 1j | Exemption under section 10(29A) | C | `ExemptionUs10_29A` |
| 2 | Total — Amount eligible u/s 10(23A), 10(23C)(iiiab)…(iiiae), 10(23D)… | C | `TotExemptionUs10_23Cto10_47` |
| 2b | Exemption under section 10(23C)(iiiab) | C | `ExemptionUs10_23Ciiiab` |
| 2c | Exemption under section 10(23C)(iiiac) | C | `ExemptionUs10_23Ciiiac` |
| 2d | Exemption under section 10(23C)(iiiad) | C | `ExemptionUs10_23Ciiiad` |
| 2e | Exemption under section 10(23C)(iiiae) | C | `ExemptionUs10_23Ciiiae` |
| 1d | Exemption under section 10(23D) | C | `ExemptionUs10_23D` |
| 1e | Exemption under section 10(23DA) | C | `ExemptionUs10_23DA` |
| 1i | Exemption under section 10(23FB) | C | `ExemptionUs10_23FB` |
| 2f | Exemption under section 10(24) | C | `ExemptionUs10_24` |
| 1k | Exemption under section 10(46) | C | `ExemptionUs10_46` |
| 1l | Exemption under section 10(46A) | C | `ExemptionUs10_46A` |
| 1m | Exemption under section 10(46B) | C | `ExemptionUs10_46B` |
| 1n | Exemption under section 10(47) | C | `ExemptionUs10_47` |
| 3 | Income chargeable under section 11(3) read with section 10(21) | C | `IncomeChargeable11_3` |
| 4 | Income claimed as exempt under section 13A (Political Party) | C | `ExemptionUs13_A` |
| 5 | Income claimed as exempt under section 13B (Electoral Trust) | C | `ExemptionUs13_B` |
| 6 | Voluntary Contribution received during the year (s. 13A/13B) | C | `VoluntaryContributions` |
| 7i | Income from house property [3 of Schedule HP] | C | `IncomeFromHP` |
| 7ii | Profits and gains of business or profession [D48 of Sch BP] | C | `ProfBusGain.ProfGainNoSpecBus` |
| 7iii | Capital gains — 20% / 30% / applicable / DTAA / totals / 115BBH | C | `CapGain.*` (same leaves as Part-B1) |
| 7iv | Income from other sources [9 of Schedule OS] | C | `IncFromOS.TotIncFromOS` |
| 7v | Total (7i + 7ii + 7iiiE + 7iv) | C | `TotIncNotPart7And11Abv` |
| 8 | Gross income [6 + 7v − 4 − 5] + 3 | C | `GrossIncome` |
| 9 | Losses of current year to be set off against 7v | C | `CurrentYearLoss` |
| 10 | Gross Total Income (8 − 9) | C | `GrossTotalIncome` |
| 11 | Income included in 10 and chargeable at special rates | C | `IncChargeableTaxSplRates` |
| 12 | Net Agricultural income for rate purpose | C | `NetAgricultureIncomeOrOtherIncomeForRate` |
| 13 | Aggregate Income (10 − 11 + 12) | C | `AggregateIncome` |
| 14 | Income chargeable at maximum marginal rates | C | `IncChrgbleMaxMarginalRates` |

`PartB_TI2` marks all of the above `required` except `ExemptionUs10_23D`.

---

## Part 3 · Part-B3 — income taxed at MMR under 22nd proviso to 10(23C)/s. 13(10) (`PartB_TI3`)

Applicable if the trust has lost exemption (Part A-General A26 = "Yes"); its
income is computed as gross receipts less allowed expenditure, with a list of
disallowed expenditure and additions, then taxed at the maximum marginal rate.
Everything nests under `ComputationIncChargeable`.

| Item | Label (utility, abridged) | Type | Schema key (`PartB_TI3.ComputationIncChargeable.…`) |
|---|---|---|---|
| 1 | Total Income for the previous year other than Sl. 7 | C | `TotIncPrevYr` |
| 2 | Total Expenditure incurred in India for the objects | C | `TotExpIncur` |
| 3i | Expenditure from the corpus standing to the credit | C | `ExpDisallowed.ExpCorpusStandingCredit` |
| 3ii | Expenditure from any loan or borrowing | C | `ExpDisallowed.ExpLoanBorrow` |
| 3iii | Depreciation on an asset claimed as application | C | `ExpDisallowed.DeprRespAsset` |
| 3iv | Expenditure as contribution or donation to any person | C | `ExpDisallowed.ExpFormContri` |
| 3v | Capital expenditure | C | `ExpDisallowed.CapExp` |
| 3vi | Amount disallowable (s. 13(10)/22nd proviso — 40(a)(ia)) | C | `ExpDisallowed.AmtDisallSubClauseiaSec40` |
| 3vii | Amount disallowable (s. 13(10)/22nd proviso — 40A(3)) | C | `ExpDisallowed.AmtDisallSubSec3Sec40A` |
| 3viii | Amount disallowable (s. 13(10)/22nd proviso — 40A(3A)) | C | `ExpDisallowed.AmtDisallSubSec3ASec40A` |
| 3ix | Any other disallowance | C | `ExpDisallowed.AnyOthDisall` |
| 3x | Total expenditure to be disallowed | C | `ExpDisallowed.TotExpDisall` |
| 4i | Income chargeable under section 115BBI | C | `Additions.IncChargSec115BBI` |
| 4ii | Income (exemption u/s 11 not available), anonymous donation | C | `Additions.IncExemptNotAvail` |
| 4iii | Income chargeable under section 12(2) | C | `Additions.IncChargSec122` |
| 4iv | Income as per Explanation 3B | C | `Additions.IncExpl3B` |
| 4v | Income as per Explanation 1B | C | `Additions.IncExpl1B` |
| 4vi | Any other income on which exemption is not allowable | C | `Additions.AnyOthrIncome` |
| 4vii | Total Additions | C | `Additions.TotAdditions` |
| 5 | Income chargeable u/s 11(4) | C | `IncChargSec114` |
| 6 | Sum total [(1−2+3x)+4vii+5] | C | `SumTotal` |
| 7i | Income from house property [3 of Sch HP] | C | `IncNotForming.IncFromHP` |
| 7ii | Profits and gains of business or profession [D48 of Sch BP] | C | `IncNotForming.ProfitGainsBP` |
| 7iii | Capital gains — 20%/30%/applicable/DTAA/totals/115BBH | C | `IncNotForming.CapGain.*` |
| 7iv | Income from other sources [9 of Sch OS] | C | `IncNotForming.IncOS` |
| 7v | Total (7i + 7ii + 7iiie + 7iv) | C | `IncNotForming.Total` |
| 8 | Losses of current year to be set off against 7v | C | `LossCurYrToBeSetOff` |
| 9 | Total Income (6 + 7 − 8) | C | `TotalInc` |
| 10 | Income included in 9 and chargeable at special rates | C | `IncIncludedChargRateSpec` |
| 11 | Anonymous donations to be taxed u/s 115BBC @ 30% | C | `AnonymousDonation` |
| 12 | Income chargeable u/s 115BBI @ 30% | C | `IncChargSec115BBI` |
| 13 | Income chargeable to tax u/s 22nd proviso to 10(23C) or s. 13(10) | C | `IncChagrgSec13` |
| — | Income chargeable under section 11(4) (Capital Gains sub-table) | C | `IncChargSec114` |

Every leaf of `PartB_TI3.ComputationIncChargeable` is `required`.

Rows 182–186 (the reason codes — proviso to s. 2(15), tenth/twentieth proviso to
10(23C), etc.) are **hidden Yes/No** helpers behind the A26 reason and are not
independently filed.

---

## Part 4 · Part B – TTI — computation of tax liability (`PartB_TTI`)

The tax ladder is common to whichever Part B-TI regime is filed. Items 1a–1d
(tax on deemed total income u/s 115JB/115JC — rows 242–245) are **hidden** for
the ordinary trust; item 1 is the tax on total income at rows 246–253.

| Item | Label (utility) | Type | Schema key (`PartB_TTI.…`) |
|---|---|---|---|
| 1a | Tax at normal rates on [Sl. 17 of Part B1] OR [(13−14) of Part B2] | C | `ComputationOfTaxLiability.TaxPayableOnTI.TaxAtNormalRates` |
| 1b | Tax at special rates (total of col (ii) of Schedule-SI) | C | `ComputationOfTaxLiability.TaxPayableOnTI.TaxAtSpecialRates` |
| 1c | Tax on anonymous donation u/s 115BBC @ 30% | C | `ComputationOfTaxLiability.TaxPayableOnTI.DonationUs115BC` |
| 1d | Tax on income chargeable u/s 115BBI @ 30% | C | `ComputationOfTaxLiability.TaxPayableOnTI.TaxIncChargUs115BBI` |
| 1e | Tax at maximum marginal rate on Sr. 14 of Part B2 | C | `ComputationOfTaxLiability.TaxPayableOnTI.TaxAtMarginalRate` |
| 1f | Rebate on agricultural income [Part B2] | C | `ComputationOfTaxLiability.TaxPayableOnTI.RebateOnAgricultureInc` |
| 1g | Tax Payable on Total Income (1a+1b+1c+1d+1e−1f) | C | `ComputationOfTaxLiability.TaxPayableOnTI.TaxPayableOnTotInc` |
| 2i | 25% of Column (ii) of "Income under section 115BBE" of Schedule SI | C | `ComputationOfTaxLiability.Surcharge25ofSI` |
| 2ii | On [(1g) − (115BBE income of Schedule SI)] | C | `ComputationOfTaxLiability.SurchargeOnTaxPayable` |
| 2iii | Total (i + ii) | C | `ComputationOfTaxLiability.TotalSurcharge` |
| 3 | Health and Education Cess @ 4% on (1g + 2iii) | C | `ComputationOfTaxLiability.EducationCess` |
| 4 | Gross tax liability (1g + 2iii + 3) | C | `ComputationOfTaxLiability.GrossTaxLiability` |
| 5a | Section 90/90A (2 of Schedule TR) | C | `ComputationOfTaxLiability.TaxRelief.Section90` |
| 5b | Section 91 (3 of Schedule TR) | C | `ComputationOfTaxLiability.TaxRelief.Section91` |
| 5c | Total (5a + 5b) | C | `ComputationOfTaxLiability.TaxRelief.TotTaxRelief` |
| 6 | Net tax liability (4 − 5c) | C | `ComputationOfTaxLiability.NetTaxLiability` |
| 7a | Interest for default in furnishing the return (section 234A) | C | `ComputationOfTaxLiability.IntrstPay.IntrstPayUs234A` |
| 7b | Interest for default in payment of advance tax (section 234B) | C | `ComputationOfTaxLiability.IntrstPay.IntrstPayUs234B` |
| 7c | Interest for deferment of advance tax (section 234C) | C | `ComputationOfTaxLiability.IntrstPay.IntrstPayUs234C` |
| 7d | Fee for default in furnishing return of income (section 234F) | C | `ComputationOfTaxLiability.IntrstPay.LateFilingFee234F` |
| 7da | Fee for furnishing revised return of income (section 234-I) | C | `ComputationOfTaxLiability.IntrstPay.FeeFurnish234I` |
| 7e | Total Interest and Fee Payable (7a+7b+7c+7d+7da) | C | `ComputationOfTaxLiability.IntrstPay.TotalIntrstPay` |
| 8 | Aggregate liability (6 + 7e) | C | `ComputationOfTaxLiability.AggregateTaxInterestLiability` |
| 9a | Advance Tax (from column 5 of 15A) | C | `TaxPaid.TaxesPaid.AdvanceTax` |
| 9b | TDS (total of column 9 of 15B) | C | `TaxPaid.TaxesPaid.TDS` |
| 9c | TCS (total of column 7(i) of 15C) | C | `TaxPaid.TaxesPaid.TCS` |
| 9d | Self-Assessment Tax (from column 5 of 15A) | C | `TaxPaid.TaxesPaid.SelfAssessmentTax` |
| 9e | Total Taxes Paid (9a + 9b + 9c + 9d) | C | `TaxPaid.TaxesPaid.TotalTaxesPaid` |
| 10 | Amount payable (Enter if 8 is greater than 9e, else enter 0) | C | `TaxPaid.BalTaxPayable` |
| 11 | Refund (If 9e is greater than 8) | C | `Refund.RefundDue` |
| 12 | Net tax payable on 115TD income including interest u/s 115TE (Sl. 12 of Schedule 115TD) | C | `Refund.NetTaxPyblOn115TDInc` |
| 13 | Do you have a bank account in India | inp (Yes/No) | `Refund.BankAccountDtls.BankDtlsFlag` |
| 13 | IFS Code of the bank / Name of the Bank / Account Number / Type of account / refund tick | inp (array) | `Refund.BankAccountDtls.AddtnlBankDetails[]` → `IFSCCode`, `BankName`, `BankAccountNo`, `AccountType`, `UseForRefund` |
| 13b | Non-residents' one foreign bank account — SWIFT Code / Name / Country / IBAN | inp (array) | `Refund.BankAccountDtls.ForeignBankDetails[]` → `SWIFTCode`, `BankName`, `CountryCode`, `IBAN` |
| 14 | Do you at any time during the previous year hold, as beneficial owner, … any asset located outside India … | inp (Yes/No) | `AssetOutsideIndiaFlg` |

`PartB_TTI` marks the whole `ComputationOfTaxLiability` object required (except
`FeeFurnish234I`), the `TaxPaid.TaxesPaid` totals, `Refund.RefundDue`,
`Refund.NetTaxPyblOn115TDInc`, `BankDtlsFlag`, every `AddtnlBankDetails[]` field,
every `ForeignBankDetails[]` field, and `AssetOutsideIndiaFlg`.

---

## Part 5 · The bank-account block — rows 282–300 → `Refund.BankAccountDtls`

**Do you have a bank account in India** (row 282, Non-Residents claiming refund
with no bank account in India may … ) — Yes / No, `BankDtlsFlag`, enum **Y / N**.

**Details of all Bank Accounts held in India at any time during the previous
year (excluding dormant accounts)** (row 288, headers row 289) — one repeatable
row per account (`AddtnlBankDetails[]`):

| Col (row 289) | Field | Type / enum | Schema key |
|---|---|---|---|
| J289 | IFS Code of the bank in case of Bank Accounts held in India | string, 11 chars | `IFSCCode` |
| K289 | Name of the Bank | string, max 125 | `BankName` |
| L289 | Account Number | string | `BankAccountNo` |
| AD290 | Type of account | dropdown — §7.3 | `AccountType` |
| — | Select Account for refund credit | true / false | `UseForRefund` |

**Account-type enum** — note ITR-7 **does** carry *Savings Account* (unlike the
company form): `(SELECT)`, Savings Account, Current Account, Cash Credit Account,
Over draft account, Non Resident Account, Capital Gains Accounts Scheme, Other.

**Foreign bank account** (row 295, headers row 296): *Non-residents, may, at
their option, furnish the details of one foreign bank account* — one repeatable
row (`ForeignBankDetails[]`): SWIFT Code (J296), Name of the Bank (K296),
Country of Location (L296 — the 250-code country dropdown, §7.2), IBAN (M296).

The note at row 294: *"1) All bank accounts held at any time are to be reported,
except dormant A/c 2) In case of multiple accounts selected, the refund will be
credited to one of the validated accounts after processing."* Rows 283–287 (the
older single-refund-account layout, "Total number of savings and current bank
accounts", "a) Bank Account in which refund shall be credited", CITI Bank
placeholder) are **hidden** superseded layouts — not built.

---

## Part 6 · The rules the section carries (rules document)

- **A628** — 9e "Total Taxes Paid" = Advance Tax + TDS + TCS + Self-Assessment Tax.
- **A631** — 9a "Advance Tax" = Σ Schedule IT where date of deposit is 01/04/2025
  … 31/03/2026. **A632** — 9d "Self-Assessment Tax" = Σ Schedule IT where date of
  deposit is after 31/03/2026 within A.Y. 2026-27.
- **A633** — 9(b) "TDS (total of column 9 of 15B)" = Σ Totals of Column 9 of TDS1
  + column 9 of TDS2. **A634** — 9(C) "TCS (total of column 7(i) of 15C)" = Total
  of column 7(i) of Schedule TCS.
- **A624** — 5c "Total" = 5a + 5b. **A625** — item 6 "Net tax liability" = 4 − 5c.
- **A626** — 7e "Total Interest and Fee Payable" = 7a + 7b + 7c + 7d + 7da.
  **A627** — item 8 "Aggregate liability" = 6 + 7e.
- **A629** — item 10 "Amount payable" = 8 − 9e. **A630** — item 11 "Refund" =
  9e − 8.
- **A635** — item 12 (115TD) = Sl. 12 of Schedule 115TD.
- **A636** — interest 234A/234B/234C not computed if tax payable on total income
  is 0. **A637** — 234F fee not computed if the return is filed within due date.
- **A638** — Schedule FA must be filled if item 14 is "Yes".
- **A639 / A640** — 234-I fee = ₹1,000 if filed after 31/12/2026 u/s 139(5) and
  total income ≤ ₹5 lakh; ₹5,000 if total income exceeds ₹5 lakh.
- Part-B2 exemption checks: **A527** (10(29A) claimed only if selected under
  filing status); **A586** (Sl. 1 total = Σ 1a…1n).

---

## Part 7 · Dropdowns (verbatim — every value on the sheet)

### 7.1 · Yes / No flags (row 282 bank-account, row 300 foreign-asset, rows 22/29/183–186/305–308 form-9A/form-10/reason/specified-transaction)

```
(Select)
Yes
No
```

- `BankAccountDtls.BankDtlsFlag` schema enum: `Y` = Yes, `N` = No.
- `AssetOutsideIndiaFlg` schema enum: `YES` = Yes, `NO` = No.
- `TIDeductions.ExercisedBfDueDateFlag`, `TIDeductions.IsForm10Furnished`: Y / N.

### 7.2 · Country of Location (foreign bank, L297 — `CountryCode`)

The 250-value country enum (code → name). Reproduced in full in **Appendix D**.

### 7.3 · Type of account (AD290:AD292 — `AccountType`)

```
(SELECT)
Savings Account
Current Account
Cash Credit Account
Over draft account
Non Resident Account
Capital Gains Accounts Scheme
Other
```

Schema `AccountType` codes: `SB` = Savings Account, `CA` = Current Account,
`CC` = Cash Credit Account, `OD` = Over draft account, `NRO` = Non Resident
Account, `CGAS` = Capital Gains Accounts Scheme, `OTH` = Other.

### 7.4 · `UseForRefund`

`true` / `false` — at least one account must be ticked for refund credit.

---

## Part 8 · What repeats and what is one figure

- **One figure:** every computed line of all four blocks — each fed from its
  schedule (or from the Tax computation).
- **Repeats:** `Refund.BankAccountDtls.AddtnlBankDetails[]` (one row per Indian
  bank account) and `Refund.BankAccountDtls.ForeignBankDetails[]` (one foreign
  account).

## Part 9 · Cross-sheet feeds

**In:** Schedule VC (voluntary contributions, anonymous donations); Schedule
A/ER/EC (application, accumulation); Schedule 115BBI; Schedule HP, BP, CG (Table
E), OS (the income-not-forming heads); Schedule CYLA (item 12); Schedule SI
(special rates); Schedule IE-1…IE-4, AI; Schedule TR (TTI 5); Schedule IT (TTI
9a/9d), TDS1 & TDS2 (9b), TCS (9c); Schedule 115TD (TTI 12); Part A-General A26 /
filing-status section driving which regime is live.

**Out:** item 14 = Yes → Schedule FA required (A638); the chosen refund account
(`UseForRefund = true`) is where CPC credits any refund; the Tax sheet reads back
1g, total income, the surcharge/cess and 234A/B/C interest.

## Part 10 · What this means for the build

1. **Three parallel Part B-TI regimes** — `PartB_TI` (ss. 11/12 or 10(23C)),
   `PartB_TI2` (13A/13B or 10(21)…10(47)), `PartB_TI3` (income at MMR under 22nd
   proviso/13(10)). Only the regime matching the filing status is live; compute
   the other two but do not file them.
2. **The trust tax ladder** — normal rates (1a), special rates (1b), 30 % on
   anonymous donations 115BBC (1c), 30 % on 115BBI income (1d), maximum marginal
   rate (1e), agricultural rebate (1f); surcharge (25 % on 115BBE + company/AOP
   surcharge on the rest), 4 % cess; relief u/s 90/90A/91; 234A/B/C interest and
   234F/234-I fees. MAT/AMT rows 242–245 hidden for the ordinary trust.
3. **Feed 9a/9b/9c/9d** of Part B-TTI (ITR-7 numbering) from IT, TDS, TCS; 9e is
   their sum; amount-payable (10) and refund (11) follow.
4. **The bank block at rows 282–300** — the "Do you have a bank account" flag,
   the repeatable Indian-account table (with Savings Account in the type list),
   the foreign-account table, and item 14's foreign-asset flag → Schedule FA.
5. **Export** — every line of the live regime block to its schema key, plus the
   whole `PartB_TTI` object; the bank block; `BankDtlsFlag`;
   `AssetOutsideIndiaFlg`.

---

## Appendix A · Every schema leaf, all four blocks (verbatim; * = required)


### `PartB_TI`

```
* VcCorpusSec11 integer
* VoluntaryContributions.TotIncFromVC integer
* VoluntaryContributions.CorpusDonationUS80G integer
* VoluntaryContributions.CorpusOtherThan80G integer
* AggregateIncomeUs1112 integer
* AmtForCharitableUs111 integer
  AmtForCharitableUs111Number integer
  AmtForCharitableUs111Date string
* IncToBeApplied integer
* TIDeductions.AmtAppliedtForCharitablePurpose integer
* TIDeductions.AmtAppForCharitablePurposeRepayment integer
* TIDeductions.AmtAppliedSpecifiedMode integer
* TIDeductions.AmtDeemedForCharitable integer
  TIDeductions.ExercisedBfDueDateFlag string
  TIDeductions.DateOfFurnishing string
* TIDeductions.AmtAccumulatedForCharitable integer
* TIDeductions.AmtFulfilledUs11_2 integer
  TIDeductions.IsForm10Furnished string
  TIDeductions.DateOfFurnishingForm10 string
* TIDeductions.TotalDeductions integer
* TIAdditions.IncChargeableUs115BBI integer
* TIAdditions.ExemptionUs11_13Dtl.AnonymousDonationVC integer
* TIAdditions.IncChargeableUs12_2 integer
* TIAdditions.AmtDsllwblUs111RWS40AIA integer
* TIAdditions.AmtDsllwblUs111RWS40A3 integer
* TIAdditions.IncExp3BUS80G integer
* TIAdditions.IncExp1BUS80G integer
* TIAdditions.AnyOthrIncome integer
* TIAdditions.TotalAdditions integer
* IncChargeableUs11_4 integer
* TotalTI integer
* IncomeFromHP integer
  ProfBusGain.ProfGainNoSpecBus integer
* CapGain.ShortTerm.ShortTerm20Per integer
* CapGain.ShortTerm.ShortTerm30Per integer
* CapGain.ShortTerm.ShortTermAppRate integer
* CapGain.ShortTerm.ShortTermSplRateDTAA integer
* CapGain.ShortTerm.TotalShortTerm integer
* CapGain.LongTerm.LongTerm12_5Per integer
* CapGain.LongTerm.LongTermSplRateDTAA integer
* CapGain.LongTerm.TotalLongTerm integer
* CapGain.ShortTermLongTermTotal integer
* CapGain.CapGains30Per115BBH integer
* CapGain.TotalCapGains integer
  IncFromOS.TotIncFromOS integer
* TotIncNotPart7And11Abv integer
* GrossIncome integer
* CurrentYearLoss integer
* TotalIncome integer
* IncChargeableTaxSplRates integer
* DonationsUs115BBC integer
* IncChargUs115BBIIncld13 integer
* AggIncothSpecInc115BBI integer
```


### `PartB_TI2`

```
* TotExemptionUs10_21to29 integer
* ExemptionUs1021 integer
* ExemptionUs10_23A integer
* ExemptionUs10_23AAA integer
* ExemptionUs10_23B integer
* ExemptionUs10_23EC integer
* ExemptionUs10_23ED integer
* ExemptionUs10_23EE integer
* ExemptionUs10_29A integer
* TotExemptionUs10_23Cto10_47 integer
* ExemptionUs10_23Ciiiab integer
* ExemptionUs10_23Ciiiac integer
* ExemptionUs10_23Ciiiad integer
* ExemptionUs10_23Ciiiae integer
  ExemptionUs10_23D integer
* ExemptionUs10_23DA integer
* ExemptionUs10_23FB integer
* ExemptionUs10_24 integer
* ExemptionUs10_46 integer
* ExemptionUs10_46A integer
* ExemptionUs10_46B integer
* ExemptionUs10_47 integer
* IncomeChargeable11_3 integer
* ExemptionUs13_A integer
* ExemptionUs13_B integer
* VoluntaryContributions integer
* IncomeFromHP integer
* ProfBusGain.ProfGainNoSpecBus integer
* CapGain.ShortTerm.ShortTerm20Per integer
* CapGain.ShortTerm.ShortTerm30Per integer
* CapGain.ShortTerm.ShortTermAppRate integer
* CapGain.ShortTerm.ShortTermSplRateDTAA integer
* CapGain.ShortTerm.TotalShortTerm integer
* CapGain.LongTerm.LongTerm12_5Per integer
* CapGain.LongTerm.LongTermSplRateDTAA integer
* CapGain.LongTerm.TotalLongTerm integer
* CapGain.ShortTermLongTermTotal integer
* CapGain.CapGains30Per115BBH integer
* CapGain.TotalCapGains integer
* IncFromOS.TotIncFromOS integer
* TotIncNotPart7And11Abv integer
* GrossIncome integer
* CurrentYearLoss integer
* GrossTotalIncome integer
* IncChargeableTaxSplRates integer
* NetAgricultureIncomeOrOtherIncomeForRate integer
* AggregateIncome integer
* IncChrgbleMaxMarginalRates integer
```


### `PartB_TI3`

```
* ComputationIncChargeable.TotIncPrevYr integer
* ComputationIncChargeable.TotExpIncur integer
* ComputationIncChargeable.ExpDisallowed.ExpCorpusStandingCredit integer
* ComputationIncChargeable.ExpDisallowed.ExpLoanBorrow integer
* ComputationIncChargeable.ExpDisallowed.DeprRespAsset integer
* ComputationIncChargeable.ExpDisallowed.ExpFormContri integer
* ComputationIncChargeable.ExpDisallowed.CapExp integer
* ComputationIncChargeable.ExpDisallowed.AmtDisallSubClauseiaSec40 integer
* ComputationIncChargeable.ExpDisallowed.AmtDisallSubSec3Sec40A integer
* ComputationIncChargeable.ExpDisallowed.AmtDisallSubSec3ASec40A integer
* ComputationIncChargeable.ExpDisallowed.AnyOthDisall integer
* ComputationIncChargeable.ExpDisallowed.TotExpDisall integer
* ComputationIncChargeable.Additions.IncChargSec115BBI integer
* ComputationIncChargeable.Additions.IncExemptNotAvail integer
* ComputationIncChargeable.Additions.IncChargSec122 integer
* ComputationIncChargeable.Additions.IncExpl3B integer
* ComputationIncChargeable.Additions.IncExpl1B integer
* ComputationIncChargeable.Additions.AnyOthrIncome integer
* ComputationIncChargeable.Additions.TotAdditions integer
* ComputationIncChargeable.IncChargSec114 integer
* ComputationIncChargeable.SumTotal integer
* ComputationIncChargeable.IncNotForming.IncFromHP integer
* ComputationIncChargeable.IncNotForming.ProfitGainsBP integer
* ComputationIncChargeable.IncNotForming.CapGain.ShortTerm.ShortTerm20Per integer
* ComputationIncChargeable.IncNotForming.CapGain.ShortTerm.ShortTerm30Per integer
* ComputationIncChargeable.IncNotForming.CapGain.ShortTerm.ShortTermAppRate integer
* ComputationIncChargeable.IncNotForming.CapGain.ShortTerm.ShortTermSplRateDTAA integer
* ComputationIncChargeable.IncNotForming.CapGain.ShortTerm.TotalShortTerm integer
* ComputationIncChargeable.IncNotForming.CapGain.LongTerm.LongTerm12_5Per integer
* ComputationIncChargeable.IncNotForming.CapGain.LongTerm.LongTermSplRateDTAA integer
* ComputationIncChargeable.IncNotForming.CapGain.LongTerm.TotalLongTerm integer
* ComputationIncChargeable.IncNotForming.CapGain.ShortTermLongTermTotal integer
* ComputationIncChargeable.IncNotForming.CapGain.CapGains30Per115BBH integer
* ComputationIncChargeable.IncNotForming.CapGain.TotalCapGains integer
* ComputationIncChargeable.IncNotForming.IncOS integer
* ComputationIncChargeable.IncNotForming.Total integer
* ComputationIncChargeable.LossCurYrToBeSetOff integer
* ComputationIncChargeable.TotalInc integer
* ComputationIncChargeable.IncIncludedChargRateSpec integer
* ComputationIncChargeable.AnonymousDonation integer
* ComputationIncChargeable.IncChargSec115BBI integer
* ComputationIncChargeable.IncChagrgSec13 integer
```


### `PartB_TTI`

```
* ComputationOfTaxLiability.TaxPayableOnTI.TaxAtNormalRates integer
* ComputationOfTaxLiability.TaxPayableOnTI.TaxAtSpecialRates integer
* ComputationOfTaxLiability.TaxPayableOnTI.DonationUs115BC integer
* ComputationOfTaxLiability.TaxPayableOnTI.TaxIncChargUs115BBI integer
* ComputationOfTaxLiability.TaxPayableOnTI.TaxAtMarginalRate integer
* ComputationOfTaxLiability.TaxPayableOnTI.RebateOnAgricultureInc integer
* ComputationOfTaxLiability.TaxPayableOnTI.TaxPayableOnTotInc integer
* ComputationOfTaxLiability.Surcharge25ofSI integer
* ComputationOfTaxLiability.SurchargeOnTaxPayable integer
* ComputationOfTaxLiability.TotalSurcharge integer
* ComputationOfTaxLiability.EducationCess integer
* ComputationOfTaxLiability.GrossTaxLiability integer
* ComputationOfTaxLiability.TaxRelief.Section90 integer
* ComputationOfTaxLiability.TaxRelief.Section91 integer
* ComputationOfTaxLiability.TaxRelief.TotTaxRelief integer
* ComputationOfTaxLiability.NetTaxLiability integer
* ComputationOfTaxLiability.IntrstPay.IntrstPayUs234A integer
* ComputationOfTaxLiability.IntrstPay.IntrstPayUs234B integer
* ComputationOfTaxLiability.IntrstPay.IntrstPayUs234C integer
* ComputationOfTaxLiability.IntrstPay.LateFilingFee234F integer
  ComputationOfTaxLiability.IntrstPay.FeeFurnish234I integer
* ComputationOfTaxLiability.IntrstPay.TotalIntrstPay integer
* ComputationOfTaxLiability.AggregateTaxInterestLiability integer
* TaxPaid.TaxesPaid.AdvanceTax integer
* TaxPaid.TaxesPaid.TDS integer
* TaxPaid.TaxesPaid.TCS integer
* TaxPaid.TaxesPaid.SelfAssessmentTax integer
* TaxPaid.TaxesPaid.TotalTaxesPaid integer
* TaxPaid.BalTaxPayable integer
* Refund.RefundDue integer
* Refund.NetTaxPyblOn115TDInc integer
* Refund.BankAccountDtls.BankDtlsFlag string
  Refund.BankAccountDtls.AddtnlBankDetails[] array
* Refund.BankAccountDtls.AddtnlBankDetails[].IFSCCode string
* Refund.BankAccountDtls.AddtnlBankDetails[].BankName string
* Refund.BankAccountDtls.AddtnlBankDetails[].BankAccountNo string
* Refund.BankAccountDtls.AddtnlBankDetails[].AccountType string
* Refund.BankAccountDtls.AddtnlBankDetails[].UseForRefund string
  Refund.BankAccountDtls.ForeignBankDetails[] array
* Refund.BankAccountDtls.ForeignBankDetails[].SWIFTCode string
* Refund.BankAccountDtls.ForeignBankDetails[].BankName string
* Refund.BankAccountDtls.ForeignBankDetails[].CountryCode string
* Refund.BankAccountDtls.ForeignBankDetails[].IBAN string
* AssetOutsideIndiaFlg string
```


---

## Appendix B · Every live-row label on the PART-B-TI & TTI sheet (verbatim from `tools/dump.py`)

Hidden rows are marked **H** and are **not built**.

```
r   3 : [C3] Part B – TI  |  [J3] STATEMENT OF INCOME FOR THE PERIOD ENDED ON 31ST MARCH 2026
r   4 : [C4] Part-B1  |  [E4] Applicable if exemption is being claimed u/s 11 and 12 or 10(23C)(iv)/10(23C)(v)/ 10(23C)(vi)/10(23C
r   5 : [E5] Voluntary Contributions and anonymous donations taxable u/s 115BBC (Other than Corpus) [(C- Ai-Bi+E 
r   6 : [E6] Voluntary contribution forming part of corpus other than anonymous donations taxable u/s 115BBC [(A 
r   7 : [D7] A  |  [E7] Corpus representing donations received for the renovation or repair of places notified u/s 80G(2)(b)
r   8 : [D8] B  |  [E8] Corpus other than above [Aib +Bib of Schedule VC]
r   9H: [E9] Amount of corpus donation not eligible for exemption as per Part A1 column (8) of Schedule J
r  10H: [E10] Amount of corpus donation invested in 11(5) modes and eligible for exemption (2-3) of Part B-TI)
r  11 : [E11] Aggregate of income referred to in sections 11, 12 and sections 10(23C)(iv), 10(23C)(v), 10(23C)(vi)
r  12 : [E12] Amount eligible for exemption under section 11(1)(c )
r  13 : [E13] a  |  [F13] Approval number given by the Board
r  14 : [E14] b  |  [F14] Date of approval by the Board
r  15 : [E15] Income to be applied [1+3-4-(A1-A1a of Schedule A)]
r  16 : [E16] Application of income for charitable or religious purposes or for the stated objects of the trust/in
r  17 : [E17] i  |  [F17] Amount applied during the previous year [Excluding application from borrowed fund, deemed applicatio
r  18H: [E18] ii  |  [F18] Amount applied during the previous year–Capital Account [Excluding application from Borrowed Funds, 
r  19 : [E19] ii  |  [F19] Repayment of loan during the previous year - [Sr.no. 4 of table A2 of Schedule J]
r  20 : [E20] iii  |  [F20] Amount applied during the previous year- invested or deposited back into specified mode of Corpus fu
r  21 : [E21] iv  |  [F21] Amount deemed to have been applied during the previous year as per clause (2) of Explanation to sect
r  22 : [F22] A  |  [G22] If (iv)above applicable, whether option Form No. 9A has been furnished to the Assessing Officer
r  23 : [F23] B  |  [G23] If yes, date of furnishing Form No. 9A (DD/MM/YYYY)
r  24 : [E24] v  |  [F24] Amount accumulated or set apart for application to charitable or religious purposes or for the state
r  25 : [E25] vi  |  [F25] Amount in addition to amount referred to in (v) above, accumulated or set apart for specified purpos
r  26H: [E26] vii  |  [F26] Amount eligible for exemption under section 11(1)(c)
r  27H: [F27] a  |  [G27] Approval number given by the Board
r  28H: [F28] b  |  [G28] Date of approval by board
r  29 : [F29] A  |  [G29] If (vi) above applicable, whether option Form No. 10 has been furnished to the Assessing Officer
r  30 : [F30] B  |  [G30] If yes, date of furnishing Form No. 10 (DD/MM/YYYY)
r  31 : [E31] vii  |  [F31] Total [6i + 6ii+6iii +6iv+6v+ 6vi]
r  32 : [E32] Additions
r  33H: [E33] i  |  [F33] Corpus donation to other trust or institution chargeable as per Explanation 2 to section 11(1) [item
r  34 : [E34] i  |  [F34] Income chargeable under section 115BBI [Total of Sl. No. 7 of Schedule 115BBI ]
r  35H: [E35] ii  |  [F35] Amount of corpus donation not eligible for exemption as per Column (10) of Sl. No. (ii) - Part A1 of
r  36H: [E36] iii  |  [F36] Income in respect of which exemption under section 11 is not available
r  37 : [E37] ii  |  [F37] Income in respect of which exemption under section 11 is not available being anonymous donation (Dii
r  38H: [F38] b  |  [G38] Disallowable u/s 13(1)(c) or 13(1)(d) (including Part E of schedule J)
r  39 : [E39] iii  |  [F39] Income chargeable under section 12(2)
r  40 : [E40] iv  |  [F40] Amount disallowable under section 11(1) r.w.s 40(a)(ia) or 10(23C) r.w.s 40(a)(ia)
r  41 : [E41] v  |  [F41] Amount disallowable under section 11(1) r.w.s 40A(3)/(3A) or 10(23C) r.w.s 40A(3)/(3A)
r  42 : [E42] vi  |  [F42] Income as per Explanation 3B in case of violation of clause (a) or (b) or (c) of Explanation 3A to s
r  43 : [E43] vii  |  [F43] Income as per Explanation 1B in case of violation of clause (a) or (b) or (c) of Explanation 1A to s
r  44 : [E44] viii  |  [F44] Any other income on which exemption is not allowable under the Income-tax Act
r  45 : [E45] ix  |  [F45] Total [7i+7ii+7iii+7iv +7v +7vi+7vii+7viii]
r  46 : [E46] Income chargeable u/s 11(4)
r  47 : [E47] Gross income after Exemption u/s 11/10(23C)(iv)/10(23C)(v)/ 10(23C)(vi)/10(23C)(via) [(5-6vii)+7ix+8
r  48H: [E48] Amount of income exempt under any clause of section 10, to the extent that is included in 12 above
r  49H: [E49] Amount eligible for exemption under section 10(21), 10(22B), 10(23A),10(23AAA), 10(23B), 10(23EC), 1
r  50H: [E50] a  |  [F50] Exemption under section 10(21)
r  51H: [E51] b  |  [F51] Exemption under section 10(22B)
r  52H: [E52] c  |  [F52] Exemption under section 10(23A)
r  53H: [E53] d  |  [F53] Exemption under section 10(23AAA)
r  54H: [E54] e  |  [F54] Exemption under section 10(23B)
r  55H: [E55] f  |  [F55] Exemption under section 10(23EC)
r  56H: [E56] g  |  [F56] Exemption under section 10(23ED)
r  57H: [E57] h  |  [F57] Exemption under section 10(23EE)
r  58H: [E58] i  |  [F58] Exemption under section 10(29A)
r  59H: [E59] Amount eligible for exemption under section 10(23C)(iiiab), 10(23C)(iiiac), 10(23C)(iiiad), 10(23C)(
r  60H: [E60] Amount eligible for exemption under section 10(23C)(iiiab), 10(23C)(iiiac), 10(23C)(iiiad), 10(23C)(
r  61H: [E61] a  |  [F61] Exemption under section 10(23C)(iiiab)
r  62H: [E62] b  |  [F62] Exemption under section 10(23C)(iiiac)
r  63H: [E63] c  |  [F63] Exemption under section 10(23C)(iiiad)
r  64H: [E64] d  |  [F64] Exemption under section 10(23C)(iiiae)
r  65H: [E65] e  |  [F65] Exemption under section 10(23D)
r  66H: [E66] f  |  [F66] Exemption under section 10(23DA)
r  67H: [E67] g  |  [F67] Exemption under section 10(23FB)
r  68H: [E68] h  |  [F68] Exemption under section 10(24)
r  69H: [E69] i  |  [F69] Exemption under section 10(46)
r  70H: [E70] j  |  [F70] Exemption under section 10(47)
r  71H: [E71] i  |  [F71] Voluntary Contributions other than corpus (C – (Ai+Bi) of schedule VC)
r  72H: [E72] ii  |  [F72] Aggregate of income derived during the previous year excluding Voluntary contribution (9 of Schedule
r  73H: [E73] iii  |  [F73] Amount applied during the previous year - Revenue Account (24(A) of Schedule ER)
r  74H: [E74] Amount eligible for exemption under any other clause of section 10 (other than those at 8 and 9)
r  75H: [E75] Income chargeable under section 11(3) read with section 10(21)
r  76H: [D76] 12a  |  [E76] Income claimed/ exempt under section 13A in case of a Political Party
r  77H: [D77] 12b  |  [E77] Income claimed/ exempt under section 13B in case of an Electoral Trust (item No. 6vii of Schedule ET
r  78 : [E78] Income not forming part of item no. 9 above
r  79 : [D79] i  |  [E79] Income from house property [3 of Schedule HP] (enter nil if loss)
r  80 : [D80] ii  |  [E80] Profits and gains of business or profession [as per item no. D48 of schedule BP]
r  81 : [D81] iii  |  [E81] Income under the head Capital Gains
r  82 : [E82] A  |  [F82] Short term
r  83H: [E83] Aia  |  [F83] Short-term chargeable @ 15% (11ii of item E of schedule CG)
r  84 : [E84] Ai  |  [F84] Short-term chargeable @ 20% (8ii of item E of schedule CG)
r  85 : [E85] Aii  |  [F85] Short-term chargeable @ 30% (8iii of item E of schedule CG)
r  86 : [E86] Aiii  |  [F86] Short-term chargeable at applicable rate (8iv of item E of schedule CG)
r  87 : [E87] Aiv  |  [F87] Short-term chargeable at special rates in India as per DTAA (8v of item E of Schedule CG)
r  88 : [E88] Av  |  [F88] Total Short-term (Ai + Aii + Aiii + Aiv) (enter nil if loss )
r  89 : [E89] B  |  [F89] Long term
r  90H: [E90] Bia  |  [F90] Long-term chargeable @ 10% (11vii of item E of schedule CG)
r  91 : [E91] Bi  |  [F91] Long-term chargeable @ 12.5% (8vi of item E of schedule CG)
r  92H: [E92] Bii  |  [F92] Long-term chargeable @ 20% (11ix of item E of schedule CG)
r  93 : [E93] Bii  |  [F93] Long-term chargeable at special rates in India as per DTAA (8vii of item E of schedule CG)
r  94 : [E94] Biii  |  [F94] Total Long-term (Bi+ Bii) (enter nil if loss)
r  95 : [E95] C  |  [F95] Sum of Short-term/Long-term capital gains (Av+Biii) (enter nil if loss )
r  96 : [E96] D  |  [F96] Capital gain chargeable @ 30% u/s 115BBH (C2 of schedule CG)
r  97 : [E97] E  |  [F97] Total capital gains (C + D)
r  98 : [D98] iv  |  [E98] Income from other sources [as per item no. 9 of Schedule OS]
r  99 : [D99] v  |  [E99] Total (10i + 10ii + 10iiiE + 10iv)
r 100 : [E100] Gross income (9+10)
r 101H: [E101] Income chargeable to tax (6 – 8 - 9viii + 10v + 11 –14 – 15 – 16 + 17 - 18)
r 102 : [E102] Losses of current year to be set off against 10v (total of 2xiv, 3xiv and 4xiv of Schedule CYLA)
r 103H: [E103] Gross Total Income (14-15)
r 104H: [E104] Income chargeable to tax at special rate under section 111A, 112 etc. included in 16
r 105H: [E105] Deduction u/s 10AA
r 106 : [E106] Total Income [11-12]
r 107 : [E107] Income which is included in 13 and chargeable to tax at special rates (total of col(i) of schedule S
r 108H: [E108] Net Agricultural income for rate purpose
r 109H: [E109] Aggregate Income (13-14)
r 110 : [E110] Anonymous donations, included in 13, to be taxed under section 115BBC @ 30% (Diii of Schedule VC)
r 111 : [E111] Specified income chargeable u/s 115BBI , included in 13, to be taxed @ 30% (Sl. No. 7 of Schedule 11
r 112 : [E112] Aggregate income to be taxed at normal rates (13-14-15-16)
r 113H: [E113] Income chargeable at maximum marginal rates
r 114 : [C114] Part-B2  |  [E114] Applicable if exemption is being claimed under section 13A/13B and under sections 10(21), 10(23A), 1
r 116 : [E116] Amount eligible for exemption under sections 10(21), 10(23AAA), 10(23B), 10(23D), 10(23DA), 10(23EC)
r 117 : [D117] 1a  |  [E117] Exemption under section 10(21)
r 118H: [D118] 1b  |  [E118] Exemption under section 10(22B)
r 119H: [D119] 1c  |  [E119] Exemption under section 10(23A)
r 120 : [D120] 1b  |  [E120] Exemption under section 10(23AAA)
r 121 : [D121] 1c  |  [E121] Exemption under section 10(23B)
r 122 : [D122] 1d  |  [E122] Exemption under section 10(23D)
r 123 : [D123] 1e  |  [E123] Exemption under section 10(23DA)
r 124 : [D124] 1f  |  [E124] Exemption under section 10(23EC)
r 125 : [D125] 1g  |  [E125] Exemption under section 10(23ED)
r 126 : [D126] 1h  |  [E126] Exemption under section 10(23EE)
r 127 : [D127] 1i  |  [E127] Exemption under section 10(23FB)
r 128 : [D128] 1j  |  [E128] Exemption under section 10(29A)
r 129 : [D129] 1k  |  [E129] Exemption under section 10(46)
r 130 : [D130] 1l  |  [E130] Exemption under section 10(46A)
r 131 : [D131] 1m  |  [E131] Exemption under section 10(46B)
r 132 : [D132] 1n  |  [E132] Exemption under section 10(47)
r 133 : [E133] Amount eligible for exemption under sections 10(23A), 10(23C)(iiiab), 10(23C)(iiiac), 10(23C)(iiiad)
r 134 : [D134] 2a  |  [E134] Exemption under section 10(23A)
r 135 : [D135] 2b  |  [E135] Exemption under section 10(23C)(iiiab)
r 136 : [D136] 2c  |  [E136] Exemption under section 10(23C)(iiiac)
r 137 : [D137] 2d  |  [E137] Exemption under section 10(23C)(iiiad)
r 138 : [D138] 2e  |  [E138] Exemption under section 10(23C)(iiiae)
r 139H: [D139] 2e  |  [E139] Exemption under section 10(23D)
r 140H: [D140] 2f  |  [E140] Exemption under section 10(23DA)
r 141H: [D141] 2g  |  [E141] Exemption under section 10(23FB)
r 142 : [D142] 2f  |  [E142] Exemption under section 10(24)
r 143H: [D143] 2i  |  [E143] Exemption under section 10(46)
r 144H: [D144] 2j  |  [E144] Exemption under section 10(47)
r 145H: [E145] Amount eligible for exemption under any other clause of section 10 (other than those at 1 and 2)
r 146 : [E146] Income chargeable under section 11(3) read with section 10(21).[Total of Col 15 of Schedule I]
r 147 : [E147] Income claimed as exempt under section 13A in case of a Political Party.
r 148 : [E148] Income claimed as exempt under section 13B in case of an Electoral Trust.(item No. 6vii of Schedule 
r 149 : [E149] Voluntary Contribution received during the year [applicable for Section 13A and 13B].
r 150 : [E150] Heads of Income not forming part of above
r 151 : [E151] i  |  [F151] Income from house property [3 of Schedule HP] (enter nil if loss)
r 152 : [E152] ii  |  [F152] Profits and gains of business or profession[as per item No. D 48 of schedule BP]
r 153 : [E153] iii  |  [F153] Income under the head Capital Gains
r 154 : [F154] A  |  [G154] Short term
r 155H: [F155] Aia  |  [G155] Short-term chargeable @ 15% (11ii of item E of schedule CG)
r 156 : [F156] Ai  |  [G156] Short-term chargeable @ 20% (8ii of item E of schedule CG)
r 157 : [F157] Aii  |  [G157] Short-term chargeable @ 30% (8iii of item E of schedule CG)
r 158 : [F158] Aiii  |  [G158] Short-term chargeable at applicable rate (8iv of item E of schedule CG)
r 159 : [F159] Aiv  |  [G159] Short-term chargeable at special rates in India as per DTAA (8v of item E of Schedule CG)
r 160 : [F160] Av  |  [G160] Total Short-term (Ai + Aii + Aiii + Aiv) (enter nil if loss )
r 161 : [F161] B  |  [G161] Long term
r 162H: [F162] Bia  |  [G162] Long-term chargeable @ 10% (11vii of item E of schedule CG)
r 163 : [F163] Bi  |  [G163] Long-term chargeable @ 12.5% (8vi of item E of schedule CG)
r 164H: [F164] Bii  |  [G164] Long-term chargeable @ 20% (11ix of item E of schedule CG)
r 165 : [F165] Bii  |  [G165] Long-term chargeable at special rates in India as per DTAA (8vii of item E of schedule CG)
r 166 : [F166] Biii  |  [G166] Total Long-term (Bi+ Bii) (enter nil if loss)
r 167 : [F167] C  |  [G167] Sum of Short-term/Long-term capital gains (Av+Biii) (enter nil if loss)
r 168 : [F168] D  |  [G168] Capital gain chargeable @ 30% u/s 115BBH (C2 of schedule CG)
r 169 : [F169] E  |  [G169] Total capital gains (C + D)
r 170 : [E170] iv  |  [F170] Income from other sources. [as per item No. 9 of Schedule OS]
r 171 : [E171] v  |  [F171] Total (7i+7ii+7iiiE+7iv)
r 172 : [E172] Gross income [6+7v-4-5]+3
r 173 : [E173] Losses of current year to be set off against 7v (total of 2xiv, 3xiv and 4xiv of Schedule CYLA)
r 174 : [E174] Gross Total Income (8-9)
r 175 : [E175] Income which is included in 10 and chargeable to tax at special rates (total of col. (i) of schedule
r 176 : [E176] Net Agricultural income for rate purpose.
r 177 : [E177] Aggregate Income (10-11+12) [applicable if (10-11) exceeds maximum amount not chargeable to tax]
r 178H: [E178] Anonymous donations, included in 14, to be taxed under section 115BBC @ 30% (Diii of Schedule VC)
r 179 : [E179] Income chargeable at maximum marginal rates.
r 180 : [C180] Part-B3  |  [E180] Applicable if total income chargeable to tax u/s twenty-second proviso to section 10(23C) or section
r 182H: [D182] I  |  [E182] If yes in Sl. No. A(26) of Part A-General, specify the reason why the provisions of twenty second pr
r 183H: [D183] (a)  |  [E183] Provision of proviso to clause (15) of section 2 is applicable
r 184H: [D184] (b)  |  [E184] Condition specified in clause (a) of tenth proviso to 10(23C) / sub-clause (i) of clause (b) of sub-
r 185H: [D185] (c)  |  [E185] Condition specified in clause (b) of tenth proviso to 10(23C)/ sub-clause (ii) of clause (b) of sub-
r 186H: [D186] (d)  |  [E186] Condition specified in twentieth proviso to 10(23C)/ clause (ba) of sub-section (1) of section 12A h
r 187 : [E187] If yes in Sl. No. A(26) of Part A-General, please the provide computation of Income chargeable under
r 188 : [E188] Total Income for the previous year other than Sl. No. 7
r 189 : [E189] Total Expenditure incurred in India, for the objects of the assessee
r 190 : [E190] Expenditure to be disallowed
r 191 : [E191] i  |  [F191] Expenditure from the corpus standing to the credit of the trust or institution as on the end of the 
r 192 : [E192] ii  |  [F192] Expenditure from any loan or borrowing
r 193 : [E193] iii  |  [F193] Depreciation in respect of an asset, acquisition of which has been claimed as application of income,
r 194 : [E194] iv  |  [F194] Expenditure in the form of contribution or donation to any person
r 195 : [E195] v  |  [F195] Capital expenditure
r 196 : [E196] vi  |  [F196] Amount disallowable under Explanation to sub-section (10) of section 13 or Explanation to twenty sec
r 197 : [E197] vii  |  [F197] Amount disallowable under Explanation to sub-section (10) of section 13 or Explanation to twenty sec
r 198H: [E198] Amount eligible for exemption under any other clause of section 10 (other than those at 1 and 2)
r 199 : [E199] viii  |  [F199] Amount disallowable under Explanation to sub-section (10) of section 13 or Explanation to twenty sec
r 200 : [E200] ix  |  [F200] Any other disallowance
r 201 : [E201] x  |  [F201] Total expenditure to be disallowed (i)+(ii)+(iii)+(iv)+(v)+(vi)+(vii)+(viii)+(ix)
r 202 : [E202] Additions
r 203 : [E203] i  |  [F203] Income chargeable under section 115BBI <Total of Sl. No. 7 of Schedule 115BBI >
r 204 : [E204] ii  |  [F204] Income in respect of which exemption under section 11 is not available, being anonymous donation ( D
r 205 : [E205] iii  |  [F205] Income chargeable under section 12(2)
r 206 : [E206] iv  |  [F206] Income as per Explanation 3B in case of violation of clause (a) or (b) or (c) of Explanation 3A to s
r 207 : [E207] v  |  [F207] Income as per Explanation 1B in case of violation of clause (a) or (b) or (c) of Explanation 1A to s
r 208 : [E208] vi  |  [F208] Any other income on which exemption is not allowable under the Income-tax Act
r 209 : [E209] vii  |  [F209] Total Additions (i)+(ii)+(iii)+(iv)+(v)+(vi)
r 210 : [E210] Income chargeable u/s 11(4)  |  [F210] Income under the head Capital Gains
r 211 : [E211] Sum total [(1-2+3x)+4vii+5]  |  [F211] A  |  [G211] Short term
r 212 : [E212] Income not forming part of item no. 6 above  |  [F212] Ai  |  [G212] Short-term chargeable @ 15% (9ii of item E of schedule CG)
r 213 : [E213] i  |  [F213] Income from house property [ 3 of Schedule HP] (enter nil if loss)
r 214 : [E214] ii  |  [F214] Profits and gains of business or profession [as per item no. D48 of schedule BP]
r 215 : [E215] iii  |  [F215] Income under the head Capital Gains
r 216 : [F216] a  |  [G216] Short term
r 217H: [G217] aia  |  [H217] Short-term chargeable @ 15% (11ii of item E of schedule CG)
r 218 : [G218] ai  |  [H218] Short-term chargeable @ 20% (8ii of item E of schedule CG)
r 219 : [G219] aii  |  [H219] Short-term chargeable @ 30% (8iii of item E of schedule CG)
r 220 : [G220] aiii  |  [H220] Short-term chargeable at applicable rate (8iv of item E of schedule CG)
r 221 : [G221] aiv  |  [H221] Short-term chargeable at special rates in India as per DTAA (8v of item E of Schedule CG)
r 222 : [G222] av  |  [H222] Total Short-term (ai + aii + aiii + aiv) (enter nil if loss)
r 223 : [F223] b  |  [G223] Long term
r 224H: [G224] bia  |  [H224] Long-term chargeable @ 10% (11vii of item E of schedule CG)
r 225 : [G225] bi  |  [H225] Long-term chargeable @ 12.5% (8vi of item E of schedule CG)
r 226H: [G226] bii  |  [H226] Long-term chargeable @ 20% (11ix of item E of schedule CG)
r 227 : [G227] bii  |  [H227] Long-term chargeable at special rates in India as per DTAA (8vii of item E of schedule CG)
r 228 : [G228] biii  |  [H228] Total Long-term (bi + bii) (enter nil if loss)
r 229 : [F229] c  |  [G229] Sum of Short-term/Long-term capital gains (av+biii) (enter nil if loss)
r 230 : [F230] d  |  [G230] Capital gain chargeable @ 30% u/s 115BBH (C2 of schedule CG)
r 231 : [F231] e  |  [G231] Total capital gains (c + d)
r 232 : [E232] iv  |  [F232] Income from other sources [as per item no. 9 of Schedule OS]
r 233 : [E233] v  |  [F233] Total (7i+7ii+7iiie+7iv)
r 234 : [E234] Losses of current year to be set off against 7v (total of 2xiv, 3xiv and 4xiv of Schedule CYLA)
r 235 : [E235] Total Income (6+7-8)
r 236 : [E236] Income which is included in 9 and chargeable to tax at special rates (total of col. (i) of schedule 
r 237 : [E237] Anonymous donations, included in 9, to be taxed under section 115BBC @ 30% (Diii of Schedule VC)
r 238 : [E238] Income chargeable u/s 115BBI, included in 9, to be taxed @ 30% (Sl. No 7 of Schedule 115BBI)
r 239H: [E239] Anonymous donations, included in 14, to be taxed under section 115BBC @ 30% (Diii of Schedule VC)
r 240 : [E240] Income chargeable to tax u/s twenty-second proviso to clause (23C) of section 10 or sub-section (10)
r 241 : [C241] TAX LIABILITY  |  [D241] Part B – TTI  |  [J241] Computation of tax liability on total income
r 242H: [E242] 1a  |  [F242] Tax Payable on deemed total Income under section 115JB or 115JC as applicable (7 of Schedule MAT/ 4 
r 243H: [E243] 1b  |  [F243] Surcharge on (a) above
r 244H: [E244] 1c  |  [F244] Education Cess on (1a+1b) above
r 245H: [E245] 1d  |  [F245] Total Tax Payable u/s 115JB or 115JC as applicable (1a+1b+1c)
r 246 : [E246] Tax payable on total income
r 247 : [E247] a  |  [F247] Tax at normal rates on [Sl. No. 17 of Part B1 of Part B-TI] OR [Sl. No. (13-14) of Part B2 of Part B
r 248 : [E248] b  |  [F248] Tax at special rates (total of col(ii) of Schedule-SI)
r 249 : [E249] c  |  [F249] Tax on anonymous donation u/s 115BBC @30% on [Sr. no. 15 of Part B1 of Part B-TI] OR [Sl. No. 11 of 
r 250 : [E250] d  |  [F250] Tax on income chargeable u/s 115BBI @30% on (Sr. no. 16 of Part B1 of Part B-TI) OR (Sl. No. 12 of P
r 251 : [E251] e  |  [F251] Tax at maximum marginal rate on Sr.no. 14 of Part B2 of Part B-TI
r 252 : [E252] f  |  [F252] Rebate on agricultural income [Part B2, applicable if (10-11) of Part B-TI exceeds maximum amount no
r 253 : [E253] g  |  [F253] Tax Payable on Total Income (1a+1b+1c+1d+1e-1f)
r 254 : [E254] Surcharge
r 255 : [E255] i  |  [F255] 25% of Column (ii) of “Income under section 115BBE ” of Schedule SI
r 256 : [E256] ii  |  [F256] On [(1g) – (Column (ii) of “Income under section 115BBE ” of Schedule SI)]
r 257 : [E257] iii  |  [F257] Total (i + ii)
r 258 : [E258] Health and Education Cess @ 4% on (1g + 2iii)
r 259 : [E259] Gross tax liability (1g+ 2iii + 3)
r 260 : [E260] Tax relief
r 261 : [E261] a  |  [F261] Section 90/90A (2 of Schedule TR)
r 262 : [E262] b  |  [F262] Section 91 (3 of Schedule TR)
r 263 : [E263] c  |  [F263] Total (5a + 5b)
r 264 : [E264] Net tax liability (4 – 5c)
r 265 : [E265] Interest and fee payable
r 266 : [E266] a  |  [F266] Interest for default in furnishing the return (section 234A)
r 267 : [E267] b  |  [F267] Interest for default in payment of advance tax (section 234B)
r 268 : [E268] c  |  [F268] Interest for deferment of advance tax (section 234C)
r 269 : [E269] d  |  [F269] Fee for default in furnishing return of income (section 234F)
r 270 : [E270] da  |  [F270] Fee for furnishing revised return of income (section 234-I)
r 271 : [E271] e  |  [F271] Total Interest and Fee Payable (7a+ 7b+ 7c+ 7d+ 7da)
r 272 : [E272] Aggregate liability (6 + 7e)
r 273 : [E273] Taxes Paid
r 274 : [E274] a  |  [F274] Advance Tax (from column 5 of 15A)
r 275 : [E275] b  |  [F275] TDS(total of column 9 of 15B)
r 276 : [E276] c  |  [F276] TCS (total of column 7(i) of 15C)
r 277 : [E277] d  |  [F277] Self-Assessment Tax (from column 5 of 15A)
r 278 : [E278] e  |  [F278] Total Taxes Paid (9a+9b+9c + 9d)
r 279 : [E279] Amount payable(Enter if 8 is greater than 9e, else enter 0)
r 280 : [E280] Refund(If 9e is greater than 8) (refund, if any, will be directly credited into the bank account)
r 281 : [E281] Net tax payable on 115TD income including interest u/s 115TE (Sr.no. 12 of Schedule 115TD)
r 282 : [E282] Do you have a bank account in India (Non- Residents claiming refund with no bank account in India ma
r 283H: [E283] Total number of savings and current bank accounts held by you at any time during the previous year (
r 284H: [E284] Details of all Bank Accounts held in India at any time during the previous year (excluding dormant a
r 285H: [D285] (i)  |  [E285] a) Bank Account in which refund, if any, shall be credited
r 286H: [G286] SI.No  |  [J286] IFS Code of the Bank  |  [K286] Name of the Bank  |  [L286] Account Number
r 287H: [R287] CITI Bank
r 288 : [D288] a  |  [E288] Details of all Bank Accounts held in India at any time during the previous year (excluding dormant a
r 289 : [G289] SI.No  |  [J289] IFS Code of the bank in case of Bank Accounts held in India  |  [K289] Name of the Bank  |  [L289] Account Number
r 294 : [E294] Note: 1) All bank accounts held at any time are to be reported, except dormant A/c 2) In case of mul
r 295 : [D295] b  |  [E295] Non-residents,may, at their option, furnish the details of one foreign bank account:
r 296 : [G296] SI.No  |  [J296] SWIFT Code  |  [K296] Name of the Bank  |  [L296] Country of Location  |  [M296] IBAN
r 300 : [E300] Do you at any time during the previous year,- (i) hold, as beneficial owner, beneficiary or otherwis
r 305H: [E305] Please state whether you have at any time entered into any specified transaction during the previous
r 306H: [E306] i  |  [F306] taken or accepted any loan or deposit or any specified sum amounting to twenty thousand rupees or mo
r 307H: [E307] ii  |  [F307] received an amount of two lakh rupees or more, in cash, as referred in section 269ST; or
r 308H: [E308] iii  |  [F308] made repayment of any loan or deposit or any specified advance amounting to twenty thousand rupees o
```


---

## Appendix C · Type of account (AD290:AD292 — `AccountType`, verbatim)

```
(SELECT)
Savings Account
Current Account
Cash Credit Account
Over draft account
Non Resident Account
Capital Gains Accounts Scheme
Other
```


## Appendix D · Country of Location — the 250-value country enum (L297, verbatim)

```
(Select)
93-AFGHANISTAN
1001-ALAND ISLANDS
355-ALBANIA
213-ALGERIA
684-AMERICAN SAMOA
376-ANDORRA
244-ANGOLA
1264-ANGUILLA
1010-ANTARCTICA
1268-ANTIGUA AND BARBUDA
54-ARGENTINA
374-ARMENIA
297-ARUBA
61-AUSTRALIA
43-AUSTRIA
994-AZERBAIJAN
1242-BAHAMAS
973-BAHRAIN
880-BANGLADESH
1246-BARBADOS
375-BELARUS
32-BELGIUM
501-BELIZE
229-BENIN
1441-BERMUDA
975-BHUTAN
591-BOLIVIA (PLURINATIONAL STATE OF)
1002-BONAIRE, SINT EUSTATIUS AND SABA
387-BOSNIA AND HERZEGOVINA
267-BOTSWANA
1003-BOUVET ISLAND
55-BRAZIL
1014-BRITISH INDIAN OCEAN TERRITORY
673-BRUNEI DARUSSALAM
359-BULGARIA
226-BURKINA FASO
257-BURUNDI
238-CABO VERDE
855-CAMBODIA
237-CAMEROON
1-CANADA
1345-CAYMAN ISLANDS
236-CENTRAL AFRICAN REPUBLIC
235-CHAD
56-CHILE
86-CHINA
9-CHRISTMAS ISLAND
672-COCOS (KEELING) ISLANDS
57-COLOMBIA
270-COMOROS
242-CONGO
243-CONGO (DEMOCRATIC REPUBLIC OF THE)
682-COOK ISLANDS
506-COSTA RICA
225-COTE DIVOIRE
385-CROATIA
53-CUBA
1015-CURACAO
357-CYPRUS
420-CZECHIA
45-DENMARK
253-DJIBOUTI
1767-DOMINICA
1809-DOMINICAN REPUBLIC
593-ECUADOR
20-EGYPT
503-EL SALVADOR
240-EQUATORIAL GUINEA
291-ERITREA
372-ESTONIA
251-ETHIOPIA
500-FALKLAND ISLANDS (MALVINAS)
298-FAROE ISLANDS
679-FIJI
358-FINLAND
33-FRANCE
594-FRENCH GUIANA
689-FRENCH POLYNESIA
1004-FRENCH SOUTHERN TERRITORIES
241-GABON
220-GAMBIA
995-GEORGIA
49-GERMANY
233-GHANA
350-GIBRALTAR
30-GREECE
299-GREENLAND
1473-GRENADA
590-GUADELOUPE
1671-GUAM
502-GUATEMALA
1481-GUERNSEY
224-GUINEA
245-GUINEA-BISSAU
592-GUYANA
509-HAITI
1005-HEARD ISLAND AND MCDONALD ISLANDS
6-HOLY SEE
504-HONDURAS
852-HONG KONG
36-HUNGARY
354-ICELAND
91-INDIA
62-INDONESIA
98-IRAN (ISLAMIC REPUBLIC OF)
964-IRAQ
353-IRELAND
1624-ISLE OF MAN
972-ISRAEL
5-ITALY
1876-JAMAICA
81-JAPAN
1534-JERSEY
962-JORDAN
7-KAZAKHSTAN
254-KENYA
686-KIRIBATI
850-KOREA (DEMOCRATIC PEOPLES REPUBLIC OF)
82-KOREA (REPUBLIC OF)
965-KUWAIT
996-KYRGYZSTAN
856-LAO PEOPLES DEMOCRATIC REPUBLIC
371-LATVIA
961-LEBANON
266-LESOTHO
231-LIBERIA
218-LIBYA
423-LIECHTENSTEIN
370-LITHUANIA
352-LUXEMBOURG
853-MACAO
389-MACEDONIA (THE FORMER YUGOSLAV REPUBLIC OF)
261-MADAGASCAR
265-MALAWI
60-MALAYSIA
960-MALDIVES
223-MALI
356-MALTA
692-MARSHALL ISLANDS
596-MARTINIQUE
222-MAURITANIA
230-MAURITIUS
269-MAYOTTE
52-MEXICO
691-MICRONESIA (FEDERATED STATES OF)
373-MOLDOVA (REPUBLIC OF)
377-MONACO
976-MONGOLIA
382-MONTENEGRO
1664-MONTSERRAT
212-MOROCCO
258-MOZAMBIQUE
95-MYANMAR
264-NAMIBIA
674-NAURU
977-NEPAL
31-NETHERLANDS
687-NEW CALEDONIA
64-NEW ZEALAND
505-NICARAGUA
227-NIGER
234-NIGERIA
683-NIUE
15-NORFOLK ISLAND
1670-NORTHERN MARIANA ISLANDS
47-NORWAY
968-OMAN
92-PAKISTAN
680-PALAU
970-PALESTINE, STATE OF
507-PANAMA
675-PAPUA NEW GUINEA
595-PARAGUAY
51-PERU
63-PHILIPPINES
1011-PITCAIRN
48-POLAND
14-PORTUGAL
1787-PUERTO RICO
974-QATAR
262-REUNION
40-ROMANIA
8-RUSSIAN FEDERATION
250-RWANDA
1006-SAINT BARTHELEMY
290-SAINT HELENA, ASCENSION AND TRISTAN DA CUNHA
1869-SAINT KITTS AND NEVIS
1758-SAINT LUCIA
1007-SAINT MARTIN (FRENCH PART)
508-SAINT PIERRE AND MIQUELON
1784-SAINT VINCENT AND THE GRENADINES
685-SAMOA
378-SAN MARINO
239-SAO TOME AND PRINCIPE
966-SAUDI ARABIA
221-SENEGAL
381-SERBIA
248-SEYCHELLES
232-SIERRA LEONE
65-SINGAPORE
1721-SINT MAARTEN (DUTCH PART)
421-SLOVAKIA
386-SLOVENIA
677-SOLOMON ISLANDS
252-SOMALIA
28-SOUTH AFRICA
1008-SOUTH GEORGIA AND THE SOUTH SANDWICH ISLANDS
211-SOUTH SUDAN
35-SPAIN
94-SRI LANKA
249-SUDAN
597-SURINAME
1012-SVALBARD AND JAN MAYEN
268-SWAZILAND
46-SWEDEN
41-SWITZERLAND
963-SYRIAN ARAB REPUBLIC
886-TAIWAN, PROVINCE OF CHINA[A]
992-TAJIKISTAN
255-TANZANIA, UNITED REPUBLIC OF
66-THAILAND
670-TIMOR-LESTE(EAST TIMOR)
228-TOGO
690-TOKELAU
676-TONGA
1868-TRINIDAD AND TOBAGO
216-TUNISIA
90-TURKEY
993-TURKMENISTAN
1649-TURKS AND CAICOS ISLANDS
688-TUVALU
256-UGANDA
380-UKRAINE
971-UNITED ARAB EMIRATES
44-UNITED KINGDOM OF GREAT BRITAIN AND NORTHERN IRELAND
2-UNITED STATES OF AMERICA
1009-UNITED STATES MINOR OUTLYING ISLANDS
598-URUGUAY
998-UZBEKISTAN
678-VANUATU
58-VENEZUELA (BOLIVARIAN REPUBLIC OF)
84-VIET NAM
1284-VIRGIN ISLANDS (BRITISH)
1340-VIRGIN ISLANDS (U.S.)
681-WALLIS AND FUTUNA
1013-WESTERN SAHARA
967-YEMEN
260-ZAMBIA
263-ZIMBABWE
9999-OTHERS
```

