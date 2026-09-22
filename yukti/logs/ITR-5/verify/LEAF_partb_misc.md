# ITR-5 · LEAF-COVERAGE CHECK — AREA `partb_misc`

> **VERDICT — 3 ORPHANS, all in `PartB_TTI.TaxPaid` (the 115TD adjustment, Sr.13/14/15).**
> None is schema-`required`, but each is the subject of a **Category A (blocking) CBDT validation rule**
> — 762, 816 and 839 — so any ITR-5 that files Schedule 115TD is rejected at upload by this build.
> Everything else in the 18 assigned blocks (445 of 448 leaves) has a home.

Schema: `sources/ITR-5/ITR-5_2026_Main_V1_1_schema.json` (V1.1) · form under test: `forms/ITR-5/Yukti_ITR5.html`
built from `forms/ITR-5/src/*.js`. Read-only audit — nothing in `forms/` or `books/` was touched.

## Scope and method

Leaves were enumerated straight from the schema by walking `definitions`, resolving every `$ref`, and recursing
through `properties` / `items`; a leaf is a property with no nested `properties`/`items`. The 147 `allOf` branches
inside these blocks were checked and carry only string/format constraints — **zero** of them add a nested property,
so the enumeration is complete. **448 leaves** across the 18 assigned blocks.

`required?` below has two levels: **R\*** = required all the way up the chain from the `ITR5` root (the return
cannot be filed without it); **R** = required inside its own object, but that object sits under an optional
parent (so it is required only once the parent block/row is present).

Each leaf was then traced in `forms/ITR-5/src/70_sec_*.js`: first to an export site (`put(...)` or an object
literal inside the section's `exp*()` function), then back from the exported state key to a `data-p` field
(`inp()` / `sel()` / `dte()` / a `grid()` column `k`) or to the engine expression that derives it.

## Per-leaf tables

### Part B-TI — total income

`PartB-TI` — 37 leaves · COMPUTED 37

| leaf | schema path | required? | class | evidence |
|---|---|---|---|---|
| `IncomeFromHP` | `PartB-TI/IncomeFromHP` | **R\*** | COMPUTED | engTax→S.C.tax; `70_sec_tax.js:486` put(j,"PartB-TI.IncomeFromHP",n0(T.item1)); |
| `ProfGainNoSpecBus` | `PartB-TI/ProfBusGain/ProfGainNoSpecBus` | **R\*** | COMPUTED | engTax→S.C.tax; `70_sec_tax.js:487` put(j,"PartB-TI.ProfBusGain.ProfGainNoSpecBus",n0(T.b2i)); |
| `ProfGainSpecBus` | `PartB-TI/ProfBusGain/ProfGainSpecBus` | **R\*** | COMPUTED | engTax→S.C.tax; `70_sec_tax.js:488` put(j,"PartB-TI.ProfBusGain.ProfGainSpecBus",n0(T.b2ii)); |
| `ProfGainSpecifiedBus` | `PartB-TI/ProfBusGain/ProfGainSpecifiedBus` | **R\*** | COMPUTED | engTax→S.C.tax; `70_sec_tax.js:489` put(j,"PartB-TI.ProfBusGain.ProfGainSpecifiedBus",n0(T.b2iii)); |
| `IncChrgblTaxSplRate` | `PartB-TI/ProfBusGain/IncChrgblTaxSplRate` | **R\*** | COMPUTED | engTax→S.C.tax; `70_sec_tax.js:490` put(j,"PartB-TI.ProfBusGain.IncChrgblTaxSplRate",n0(T.b2iv)); |
| `TotProfBusGain` | `PartB-TI/ProfBusGain/TotProfBusGain` | **R\*** | COMPUTED | engTax→S.C.tax; `70_sec_tax.js:491` put(j,"PartB-TI.ProfBusGain.TotProfBusGain",n0(T.b2v)); |
| `ShortTerm20Per` | `PartB-TI/CapGain/ShortTerm/ShortTerm20Per` | **R\*** | COMPUTED | engTax→S.C.tax; `70_sec_tax.js:492` put(j,"PartB-TI.CapGain.ShortTerm.ShortTerm20Per",n0(T.st20)); |
| `ShortTerm30Per` | `PartB-TI/CapGain/ShortTerm/ShortTerm30Per` | **R\*** | COMPUTED | engTax→S.C.tax; `70_sec_tax.js:493` put(j,"PartB-TI.CapGain.ShortTerm.ShortTerm30Per",n0(T.st30)); |
| `ShortTermAppRate` | `PartB-TI/CapGain/ShortTerm/ShortTermAppRate` | **R\*** | COMPUTED | engTax→S.C.tax; `70_sec_tax.js:494` put(j,"PartB-TI.CapGain.ShortTerm.ShortTermAppRate",n0(T.stApp)); |
| `ShortTermSplRateDTAA` | `PartB-TI/CapGain/ShortTerm/ShortTermSplRateDTAA` | **R\*** | COMPUTED | engTax→S.C.tax; `70_sec_tax.js:495` put(j,"PartB-TI.CapGain.ShortTerm.ShortTermSplRateDTAA",n0(T.stDTAA)); |
| `TotalShortTerm` | `PartB-TI/CapGain/ShortTerm/TotalShortTerm` | **R\*** | COMPUTED | engTax→S.C.tax; `70_sec_tax.js:496` put(j,"PartB-TI.CapGain.ShortTerm.TotalShortTerm",n0(T.totST)); |
| `LongTerm12_5Per` | `PartB-TI/CapGain/LongTerm/LongTerm12_5Per` | **R\*** | COMPUTED | engTax→S.C.tax; `70_sec_tax.js:497` put(j,"PartB-TI.CapGain.LongTerm.LongTerm12_5Per",n0(T.lt125)); |
| `LongTermSplRateDTAA` | `PartB-TI/CapGain/LongTerm/LongTermSplRateDTAA` | **R\*** | COMPUTED | engTax→S.C.tax; `70_sec_tax.js:498` put(j,"PartB-TI.CapGain.LongTerm.LongTermSplRateDTAA",n0(T.ltDTAA)); |
| `TotalLongTerm` | `PartB-TI/CapGain/LongTerm/TotalLongTerm` | **R\*** | COMPUTED | engTax→S.C.tax; `70_sec_tax.js:499` put(j,"PartB-TI.CapGain.LongTerm.TotalLongTerm",n0(T.totLT)); |
| `ShortTermLongTermTotal` | `PartB-TI/CapGain/ShortTermLongTermTotal` | **R\*** | COMPUTED | engTax→S.C.tax; `70_sec_tax.js:500` put(j,"PartB-TI.CapGain.ShortTermLongTermTotal",n0(T.cg3c)); |
| `CapGains30Per115BBH` | `PartB-TI/CapGain/CapGains30Per115BBH` | **R\*** | COMPUTED | engTax→S.C.tax; `70_sec_tax.js:501` put(j,"PartB-TI.CapGain.CapGains30Per115BBH",n0(T.cgC2)); |
| `TotalCapGains` | `PartB-TI/CapGain/TotalCapGains` | **R\*** | COMPUTED | engTax→S.C.tax; `70_sec_tax.js:502` put(j,"PartB-TI.CapGain.TotalCapGains",n0(T.cg3e)); |
| `OtherSrcThanOwnRaceHorse` | `PartB-TI/IncFromOS/OtherSrcThanOwnRaceHorse` | **R\*** | COMPUTED | engTax→S.C.tax; `70_sec_tax.js:503` put(j,"PartB-TI.IncFromOS.OtherSrcThanOwnRaceHorse",n0(T.os4a)); |
| `IncChargblSplRate` | `PartB-TI/IncFromOS/IncChargblSplRate` | **R\*** | COMPUTED | engTax→S.C.tax; `70_sec_tax.js:504` put(j,"PartB-TI.IncFromOS.IncChargblSplRate",n0(T.os4b)); |
| `FromOwnRaceHorse` | `PartB-TI/IncFromOS/FromOwnRaceHorse` | **R\*** | COMPUTED | engTax→S.C.tax; `70_sec_tax.js:505` put(j,"PartB-TI.IncFromOS.FromOwnRaceHorse",n0(T.os4c)); |
| `TotIncFromOS` | `PartB-TI/IncFromOS/TotIncFromOS` | **R\*** | COMPUTED | engTax→S.C.tax; `70_sec_tax.js:506` put(j,"PartB-TI.IncFromOS.TotIncFromOS",n0(T.os4d)); |
| `TotalTI` | `PartB-TI/TotalTI` | **R\*** | COMPUTED | engTax→S.C.tax; `70_sec_tax.js:507` put(j,"PartB-TI.TotalTI",n0(T.totalTI)); |
| `CurrentYearLoss` | `PartB-TI/CurrentYearLoss` | **R\*** | COMPUTED | engTax→S.C.tax; `70_sec_tax.js:508` put(j,"PartB-TI.CurrentYearLoss",n0(T.cyla)); |
| `BalanceAfterSetoffLosses` | `PartB-TI/BalanceAfterSetoffLosses` | **R\*** | COMPUTED | engTax→S.C.tax; `70_sec_tax.js:509` put(j,"PartB-TI.BalanceAfterSetoffLosses",n0(T.balAfterCYLA)); |
| `BroughtFwdLossesSetoff` | `PartB-TI/BroughtFwdLossesSetoff` | **R\*** | COMPUTED | engTax→S.C.tax; `70_sec_tax.js:510` put(j,"PartB-TI.BroughtFwdLossesSetoff",n0(T.bfla)); |
| `GrossTotalIncome` | `PartB-TI/GrossTotalIncome` | **R\*** | COMPUTED | engTax→S.C.tax; `70_sec_tax.js:511` put(j,"PartB-TI.GrossTotalIncome",n0(S.C.gti)); |
| `IncChargeTaxSplRate111A112` | `PartB-TI/IncChargeTaxSplRate111A112` | **R\*** | COMPUTED | engTax→S.C.tax; `70_sec_tax.js:512` put(j,"PartB-TI.IncChargeTaxSplRate111A112",n0(T.splInc)); |
| `PartBchapterVIA` | `PartB-TI/DeductionsUndSchVIADtl/PartBchapterVIA` | **R\*** | COMPUTED | engTax→S.C.tax; `70_sec_tax.js:513` put(j,"PartB-TI.DeductionsUndSchVIADtl.PartBchapterVIA",n0(T.viaPartB)); |
| `PartCchapterVIA` | `PartB-TI/DeductionsUndSchVIADtl/PartCchapterVIA` | **R\*** | COMPUTED | engTax→S.C.tax; `70_sec_tax.js:514` put(j,"PartB-TI.DeductionsUndSchVIADtl.PartCchapterVIA",n0(T.viaPartC)); |
| `TotDeductUndSchVIA` | `PartB-TI/DeductionsUndSchVIADtl/TotDeductUndSchVIA` | **R\*** | COMPUTED | engTax→S.C.tax; `70_sec_tax.js:515` put(j,"PartB-TI.DeductionsUndSchVIADtl.TotDeductUndSchVIA",n0(T.viaTot)); |
| `DeductionsUnder10Aor10AA` | `PartB-TI/DeductionsUnder10Aor10AA` | **R\*** | COMPUTED | engTax→S.C.tax; `70_sec_tax.js:516` put(j,"PartB-TI.DeductionsUnder10Aor10AA",n0(T.us10AA)); |
| `TotalIncome` | `PartB-TI/TotalIncome` | **R\*** | COMPUTED | engTax→S.C.tax; `70_sec_tax.js:517` put(j,"PartB-TI.TotalIncome",n0(S.C.ti)); |
| `IncChargeableTaxSplRates` | `PartB-TI/IncChargeableTaxSplRates` | **R\*** | COMPUTED | engTax→S.C.tax; `70_sec_tax.js:518` put(j,"PartB-TI.IncChargeableTaxSplRates",n0(T.splIncInTI)); |
| `NetAgricultureIncomeOrOtherIncomeForRate` | `PartB-TI/NetAgricultureIncomeOrOtherIncomeForRate` | **R\*** | COMPUTED | engTax→S.C.tax; `70_sec_tax.js:519` put(j,"PartB-TI.NetAgricultureIncomeOrOtherIncomeForRate",n0(T.agri)); |
| `AggregateIncome` | `PartB-TI/AggregateIncome` | **R\*** | COMPUTED | engTax→S.C.tax; `70_sec_tax.js:520` put(j,"PartB-TI.AggregateIncome",n0(T.aggFlag?((S.C.ti\|\|0)-(T.splIncInTI\|\|0)+(T.agri\|\|0)):0)); |
| `LossesOfCurrentYearCarriedFwd` | `PartB-TI/LossesOfCurrentYearCarriedFwd` | **R\*** | COMPUTED | engTax→S.C.tax; `70_sec_tax.js:521` put(j,"PartB-TI.LossesOfCurrentYearCarriedFwd",n0((L.cf&&L.cf.total)\|\|L.cfTotal\|\|0)); |
| `DeemedTotIncSec115JC` | `PartB-TI/DeemedTotIncSec115JC` | — | COMPUTED | engTax→S.C.tax; `70_sec_tax.js:522` if(T.amtApplies)put(j,"PartB-TI.DeemedTotIncSec115JC",n0(T.amtAdjusted)); |

### Part B-TTI — tax liability, taxes paid, refund & bank

`PartB_TTI` — 50 leaves · COMPUTED 35 · INPUT 12 · ORPHAN 3

| leaf | schema path | required? | class | evidence |
|---|---|---|---|---|
| `TaxDeemedTISec115JC` | `PartB_TTI/ComputationOfTaxLiability/TaxPayableOnDeemedTI/TaxDeemedTISec115JC` | **R\*** | COMPUTED | engTax/engInt→S.C.tax\|S.C.int; `70_sec_tax.js:526` put(CTL,"TaxPayableOnDeemedTI.TaxDeemedTISec115JC",n0(AM.applies?AM.amt:0)); |
| `Surcharge` | `PartB_TTI/ComputationOfTaxLiability/TaxPayableOnDeemedTI/Surcharge` | **R\*** | COMPUTED | engTax/engInt→S.C.tax\|S.C.int; `70_sec_tax.js:527` put(CTL,"TaxPayableOnDeemedTI.Surcharge",n0(AM.applies?AM.sur:0)); |
| `EducationCess` | `PartB_TTI/ComputationOfTaxLiability/TaxPayableOnDeemedTI/EducationCess` | **R\*** | COMPUTED | engTax/engInt→S.C.tax\|S.C.int; `70_sec_tax.js:528` put(CTL,"TaxPayableOnDeemedTI.EducationCess",n0(AM.applies?AM.cess:0)); |
| `TotalTax` | `PartB_TTI/ComputationOfTaxLiability/TaxPayableOnDeemedTI/TotalTax` | **R\*** | COMPUTED | engTax/engInt→S.C.tax\|S.C.int; `70_sec_tax.js:529` put(CTL,"TaxPayableOnDeemedTI.TotalTax",n0(AM.applies?AM.total:0)); |
| `TaxAtNormalRates` | `PartB_TTI/ComputationOfTaxLiability/TaxPayableOnTI/TaxAtNormalRates` | **R\*** | COMPUTED | engTax/engInt→S.C.tax\|S.C.int; `70_sec_tax.js:530` put(CTL,"TaxPayableOnTI.TaxAtNormalRates",n0(T.normalTax)); |
| `TaxAtSpecialRates` | `PartB_TTI/ComputationOfTaxLiability/TaxPayableOnTI/TaxAtSpecialRates` | **R\*** | COMPUTED | engTax/engInt→S.C.tax\|S.C.int; `70_sec_tax.js:531` put(CTL,"TaxPayableOnTI.TaxAtSpecialRates",n0(T.splTax)); |
| `RebateOnAgriInc` | `PartB_TTI/ComputationOfTaxLiability/TaxPayableOnTI/RebateOnAgriInc` | **R\*** | COMPUTED | engTax/engInt→S.C.tax\|S.C.int; `70_sec_tax.js:532` put(CTL,"TaxPayableOnTI.RebateOnAgriInc",n0(T.agriRebate)); |
| `TaxPayableOnTotInc` | `PartB_TTI/ComputationOfTaxLiability/TaxPayableOnTI/TaxPayableOnTotInc` | **R\*** | COMPUTED | engTax/engInt→S.C.tax\|S.C.int; `70_sec_tax.js:533` put(CTL,"TaxPayableOnTI.TaxPayableOnTotInc",n0(T.taxOn)); |
| `Surcharge25ofSI` | `PartB_TTI/ComputationOfTaxLiability/TaxPayableOnTI/Surcharge25ofSI` | **R\*** | COMPUTED | engTax/engInt→S.C.tax\|S.C.int; `70_sec_tax.js:534` put(CTL,"TaxPayableOnTI.Surcharge25ofSI",n0(T.surI)); |
| `SurchargeOnTaxPayable` | `PartB_TTI/ComputationOfTaxLiability/TaxPayableOnTI/SurchargeOnTaxPayable` | **R\*** | COMPUTED | engTax/engInt→S.C.tax\|S.C.int; `70_sec_tax.js:536` put(CTL,"TaxPayableOnTI.SurchargeOnTaxPayable",n0(T.surII)); |
| `Surcharge25ofSIBeforeMarginal` | `PartB_TTI/ComputationOfTaxLiability/TaxPayableOnTI/Surcharge25ofSIBeforeMarginal` | **R\*** | COMPUTED | engTax/engInt→S.C.tax\|S.C.int; `70_sec_tax.js:535` put(CTL,"TaxPayableOnTI.Surcharge25ofSIBeforeMarginal",n0(T.surI)); |
| `SurchargeOnTaxPayableBeforeMarginal` | `PartB_TTI/ComputationOfTaxLiability/TaxPayableOnTI/SurchargeOnTaxPayableBeforeMarginal` | **R\*** | COMPUTED | engTax/engInt→S.C.tax\|S.C.int; `70_sec_tax.js:537` put(CTL,"TaxPayableOnTI.SurchargeOnTaxPayableBeforeMarginal",n0(T.surII+T.mr)); |
| `TotalSurcharge` | `PartB_TTI/ComputationOfTaxLiability/TaxPayableOnTI/TotalSurcharge` | **R\*** | COMPUTED | engTax/engInt→S.C.tax\|S.C.int; `70_sec_tax.js:538` put(CTL,"TaxPayableOnTI.TotalSurcharge",n0(T.sur)); |
| `EducationCess` | `PartB_TTI/ComputationOfTaxLiability/TaxPayableOnTI/EducationCess` | **R\*** | COMPUTED | engTax/engInt→S.C.tax\|S.C.int; `70_sec_tax.js:539` put(CTL,"TaxPayableOnTI.EducationCess",n0(T.cess)); |
| `GrossTaxLiability` | `PartB_TTI/ComputationOfTaxLiability/TaxPayableOnTI/GrossTaxLiability` | **R\*** | COMPUTED | engTax/engInt→S.C.tax\|S.C.int; `70_sec_tax.js:540` put(CTL,"TaxPayableOnTI.GrossTaxLiability",n0(T.gross)); |
| `GrossTaxPayable` | `PartB_TTI/ComputationOfTaxLiability/GrossTaxPayable` | **R\*** | COMPUTED | engTax/engInt→S.C.tax\|S.C.int; `70_sec_tax.js:541` put(CTL,"GrossTaxPayable",n0(I.grossPayable)); |
| `CreditUS115JD` | `PartB_TTI/ComputationOfTaxLiability/CreditUS115JD` | **R\*** | COMPUTED | engTax/engInt→S.C.tax\|S.C.int; `70_sec_tax.js:542` put(CTL,"CreditUS115JD",n0(I.credit)); |
| `TaxPaidUnderCredit` | `PartB_TTI/ComputationOfTaxLiability/TaxPaidUnderCredit` | **R\*** | COMPUTED | engTax/engInt→S.C.tax\|S.C.int; `70_sec_tax.js:543` put(CTL,"TaxPaidUnderCredit",n0(I.afterCredit)); |
| `Section90` | `PartB_TTI/ComputationOfTaxLiability/TaxRelief/Section90` | **R\*** | COMPUTED | engTax/engInt→S.C.tax\|S.C.int; `70_sec_tax.js:544` put(CTL,"TaxRelief.Section90",n0(I.rel90)); |
| `Section91` | `PartB_TTI/ComputationOfTaxLiability/TaxRelief/Section91` | **R\*** | COMPUTED | engTax/engInt→S.C.tax\|S.C.int; `70_sec_tax.js:545` put(CTL,"TaxRelief.Section91",n0(I.rel91)); |
| `TotTaxRelief` | `PartB_TTI/ComputationOfTaxLiability/TaxRelief/TotTaxRelief` | **R\*** | COMPUTED | engTax/engInt→S.C.tax\|S.C.int; `70_sec_tax.js:546` put(CTL,"TaxRelief.TotTaxRelief",n0(I.relief)); |
| `NetTaxLiability` | `PartB_TTI/ComputationOfTaxLiability/NetTaxLiability` | **R\*** | COMPUTED | engTax/engInt→S.C.tax\|S.C.int; `70_sec_tax.js:547` put(CTL,"NetTaxLiability",n0(I.net)); |
| `IntrstPayUs234A` | `PartB_TTI/ComputationOfTaxLiability/IntrstPay/IntrstPayUs234A` | **R\*** | COMPUTED | engTax/engInt→S.C.tax\|S.C.int; `70_sec_tax.js:548` put(CTL,"IntrstPay.IntrstPayUs234A",n0(I.i234a)); |
| `IntrstPayUs234B` | `PartB_TTI/ComputationOfTaxLiability/IntrstPay/IntrstPayUs234B` | **R\*** | COMPUTED | engTax/engInt→S.C.tax\|S.C.int; `70_sec_tax.js:549` put(CTL,"IntrstPay.IntrstPayUs234B",n0(I.i234b)); |
| `IntrstPayUs234C` | `PartB_TTI/ComputationOfTaxLiability/IntrstPay/IntrstPayUs234C` | **R\*** | COMPUTED | engTax/engInt→S.C.tax\|S.C.int; `70_sec_tax.js:550` put(CTL,"IntrstPay.IntrstPayUs234C",n0(I.i234c)); |
| `LateFilingFee234F` | `PartB_TTI/ComputationOfTaxLiability/IntrstPay/LateFilingFee234F` | **R\*** | COMPUTED | engTax/engInt→S.C.tax\|S.C.int; `70_sec_tax.js:551` put(CTL,"IntrstPay.LateFilingFee234F",Math.min(5000,n0(I.f234f))); |
| `FeeFurnish234I` | `PartB_TTI/ComputationOfTaxLiability/IntrstPay/FeeFurnish234I` | — | INPUT | data-p=`tax.f234i` — 70_sec_tax.js:440 row(..., (+S.fs.sec===17)?inp("tax.f234i",{n:1}):cell(0)) — shown only for a revised return; exp 70_sec_tax.js:552 if(I.f234i)put(CTL,"IntrstPay.FeeFurnish234I",...) |
| `TotalIntrstPay` | `PartB_TTI/ComputationOfTaxLiability/IntrstPay/TotalIntrstPay` | **R\*** | COMPUTED | engTax/engInt→S.C.tax\|S.C.int; `70_sec_tax.js:553` put(CTL,"IntrstPay.TotalIntrstPay",n0(I.total)); |
| `AggregateTaxInterestLiability` | `PartB_TTI/ComputationOfTaxLiability/AggregateTaxInterestLiability` | **R\*** | COMPUTED | engTax/engInt→S.C.tax\|S.C.int; `70_sec_tax.js:554` put(CTL,"AggregateTaxInterestLiability",n0(I.aggregate)); |
| `AdvanceTax` | `PartB_TTI/TaxPaid/TaxesPaid/AdvanceTax` | — | COMPUTED | engTax/engInt→S.C.tax\|S.C.int; `70_sec_tax.js:557` if(I.adv)put(j,"PartB_TTI.TaxPaid.TaxesPaid.AdvanceTax",n0(I.adv)); |
| `TDS` | `PartB_TTI/TaxPaid/TaxesPaid/TDS` | — | COMPUTED | engTax/engInt→S.C.tax\|S.C.int; `70_sec_tax.js:558` if(I.tds)put(j,"PartB_TTI.TaxPaid.TaxesPaid.TDS",n0(I.tds)); |
| `TCS` | `PartB_TTI/TaxPaid/TaxesPaid/TCS` | — | COMPUTED | engTax/engInt→S.C.tax\|S.C.int; `70_sec_tax.js:559` if(I.tcs)put(j,"PartB_TTI.TaxPaid.TaxesPaid.TCS",n0(I.tcs)); |
| `SelfAssessmentTax` | `PartB_TTI/TaxPaid/TaxesPaid/SelfAssessmentTax` | — | COMPUTED | engTax/engInt→S.C.tax\|S.C.int; `70_sec_tax.js:560` if(I.sat)put(j,"PartB_TTI.TaxPaid.TaxesPaid.SelfAssessmentTax",n0(I.sat)); |
| `TotalTaxesPaid` | `PartB_TTI/TaxPaid/TaxesPaid/TotalTaxesPaid` | **R\*** | COMPUTED | engTax/engInt→S.C.tax\|S.C.int; `70_sec_tax.js:561` put(j,"PartB_TTI.TaxPaid.TaxesPaid.TotalTaxesPaid",n0(I.paid)); |
| `BalTaxPayable` | `PartB_TTI/TaxPaid/BalTaxPayable` | **R\*** | COMPUTED | engTax/engInt→S.C.tax\|S.C.int; `70_sec_tax.js:562` put(j,"PartB_TTI.TaxPaid.BalTaxPayable",n0(I.balance)); |
| `NetTaxPayable115TD` | `PartB_TTI/TaxPaid/NetTaxPayable115TD` | — | **ORPHAN** | Part B-TTI Sr.13. Book PARTB_TI_TTI.md:142 `L101 = Sch115TD.NetPayable` (CBDT rule 762). expTax (70_sec_tax.js:482-576) writes NO 115TD leaf; 61_rules_enc_18.js:219-224 admits it: "the owning exporter (70_sec_tax.js) never populates it". |
| `TaxPayable115TD` | `PartB_TTI/TaxPaid/TaxPayable115TD` | — | **ORPHAN** | Part B-TTI Sr.14. Book PARTB_TI_TTI.md:143 `L102 = IF(NetTax_115TD > RefundDue, NetTax_115TD - RefundDue, 0)` (CBDT rule 816). No put() anywhere; string absent from Yukti_ITR5.html except the rules-encoder comment. |
| `NetRefundAdjust` | `PartB_TTI/TaxPaid/NetRefundAdjust` | — | **ORPHAN** | Part B-TTI Sr.15. Book PARTB_TI_TTI.md:144 `L103 = IF(RefundDue > NetTax_115TD, RefundDue - NetTax_115TD, 0)` (CBDT rule 839). Zero occurrences of the string in forms/ITR-5/Yukti_ITR5.html and in src/. |
| `RefundDue` | `PartB_TTI/Refund/RefundDue` | **R\*** | COMPUTED | engTax/engInt→S.C.tax\|S.C.int; `70_sec_tax.js:563` put(j,"PartB_TTI.Refund.RefundDue",n0(I.refund)); |
| `BankDtlsFlag` | `PartB_TTI/Refund/BankAccountDtls/BankDtlsFlag` | **R\*** | INPUT | data-p=`tax.bankFlag` — 70_sec_tax.js:454 sel("tax.bankFlag",GEN_YN) |
| `IFSCCode` | `PartB_TTI/Refund/BankAccountDtls/AddtnlBankDetails[]/IFSCCode` | R | INPUT | data-p=`tax.banks.<i>.ifsc` — 70_sec_tax.js:458 grid col k:"ifsc" → exp 568 IFSCCode:st0(x.ifsc) |
| `BankName` | `PartB_TTI/Refund/BankAccountDtls/AddtnlBankDetails[]/BankName` | R | INPUT | data-p=`tax.banks.<i>.name` — 70_sec_tax.js:459 grid col k:"name" → exp 568 BankName:st0(x.name) |
| `BankAccountNo` | `PartB_TTI/Refund/BankAccountDtls/AddtnlBankDetails[]/BankAccountNo` | R | INPUT | data-p=`tax.banks.<i>.acno` — 70_sec_tax.js:460 grid col k:"acno" → exp 569 BankAccountNo:st0(x.acno) |
| `AccountType` | `PartB_TTI/Refund/BankAccountDtls/AddtnlBankDetails[]/AccountType` | R | INPUT | data-p=`tax.banks.<i>.type` — 70_sec_tax.js:461 grid col k:"type" (TAX_ACCTYPE) → exp 569 AccountType |
| `UseForRefund` | `PartB_TTI/Refund/BankAccountDtls/AddtnlBankDetails[]/UseForRefund` | R | INPUT | data-p=`tax.banks.<i>.refund` — 70_sec_tax.js:462 grid col k:"refund" t:"chk" → exp 569 UseForRefund |
| `SWIFTCode` | `PartB_TTI/Refund/BankAccountDtls/ForeignBankDetails[]/SWIFTCode` | R | INPUT | data-p=`tax.fbanks.<i>.swift` — 70_sec_tax.js:466 grid col k:"swift" → exp 572 SWIFTCode |
| `BankName` | `PartB_TTI/Refund/BankAccountDtls/ForeignBankDetails[]/BankName` | R | INPUT | data-p=`tax.fbanks.<i>.name` — 70_sec_tax.js:467 grid col k:"name" → exp 572 BankName |
| `CountryCode` | `PartB_TTI/Refund/BankAccountDtls/ForeignBankDetails[]/CountryCode` | R | INPUT | data-p=`tax.fbanks.<i>.country` — 70_sec_tax.js:468 grid col k:"country" → exp 573 CountryCode |
| `IBAN` | `PartB_TTI/Refund/BankAccountDtls/ForeignBankDetails[]/IBAN` | R | INPUT | data-p=`tax.fbanks.<i>.iban` — 70_sec_tax.js:469 grid col k:"iban" → exp 573 IBAN |
| `AssetOutsideIndiaFlg` | `PartB_TTI/AssetOutsideIndiaFlg` | — | INPUT | data-p=`tax.faFlag` — 70_sec_tax.js:472 sel("tax.faFlag",...) — forced to YES when Schedule FA has rows; exp 575 |

### Schedule SI — special-rate income

`ScheduleSI` — 7 leaves · COMPUTED 3 · INPUT 4

| leaf | schema path | required? | class | evidence |
|---|---|---|---|---|
| `SecCode` | `ScheduleSI/SplCodeRateTax[]/SecCode` | R | INPUT | data-p=`si.over.<i>.code` — 70_sec_si.js:327 grid("si.over") col k:"code" (SI_CODE_OPTS); rows otherwise auto-populated from Sch CG/OS. exp 347 SecCode:r.code |
| `SplRatePercent` | `ScheduleSI/SplCodeRateTax[]/SplRatePercent` | R | INPUT | data-p=`si.over.<i>.rate` — 70_sec_si.js:328 grid("si.over") col k:"rate" (SI_RATES); exp 348 SplRatePercent:siSnapRate(r.rate) |
| `SplRateInc` | `ScheduleSI/SplCodeRateTax[]/SplRateInc` | R | INPUT | data-p=`si.over.<i>.inc` — 70_sec_si.js:329 grid("si.over") col k:"inc"; exp 349 SplRateInc:n0(r.inc) |
| `SplRateIncTax` | `ScheduleSI/SplCodeRateTax[]/SplRateIncTax` | R | COMPUTED | engSi rate×income; 70_sec_si.js:350 SplRateIncTax:n0(r.tax) |
| `TotSplRateInc` | `ScheduleSI/TotSplRateInc` | R | COMPUTED | 70_sec_si.js:343 TotSplRateInc:n0(G.TotSplRateInc) [H105] |
| `TotSplRateIncTax` | `ScheduleSI/TotSplRateIncTax` | R | COMPUTED | 70_sec_si.js:344 TotSplRateIncTax:n0(G.TotSplRateIncTax) [J105] |
| `EditAutopoulatedDetail` | `ScheduleSI/EditAutopoulatedDetail` | — | INPUT | data-p=`si.edit` — 70_sec_si.js:322 sel("si.edit",[Yes,No]) [C107]; exp 352 |

### Schedule AMT — alternate minimum tax

`ScheduleAMT` — 9 leaves · COMPUTED 7 · INPUT 2

| leaf | schema path | required? | class | evidence |
|---|---|---|---|---|
| `TotalIncItem13` | `ScheduleAMT/TotalIncItem13` | R | COMPUTED | engAmt/amtcTable(); `70_sec_amt.js:285` put(o,"TotalIncItem13",sg(A.ti));                     /* required; may be negative (no minimum) */ |
| `DeductClaimSec6A` | `ScheduleAMT/AdjustmentSec115JC[]/DeductClaimSec6A` | R | COMPUTED | engAmt/amtcTable(); `70_sec_amt.js:287` DeductClaimSec6A:n0(A.partC), |
| `DeductClaimSec10AA` | `ScheduleAMT/AdjustmentSec115JC[]/DeductClaimSec10AA` | R | COMPUTED | engAmt/amtcTable(); `70_sec_amt.js:288` DeductClaimSec10AA:n0(A.d10AA), |
| `DeductClaimSec35AD` | `ScheduleAMT/AdjustmentSec115JC[]/DeductClaimSec35AD` | R | INPUT | data-p=`amt.d35AD` — 70_sec_amt.js:231 inp("amt.d35AD",{n:1}) [2c]; exp 289 |
| `Total` | `ScheduleAMT/AdjustmentSec115JC[]/Total` | R | COMPUTED | engAmt/amtcTable(); `70_sec_amt.js:290` Total:n0(A.total2d)}]; |
| `AdjustedUnderSec115JC` | `ScheduleAMT/AdjustedUnderSec115JC` | R | COMPUTED | engAmt/amtcTable(); `70_sec_amt.js:291` put(o,"AdjustedUnderSec115JC",n0(A.adjusted)); |
| `AdjustedUnderSec115JCIFSC` | `ScheduleAMT/AdjustedUnderSec115JCIFSC` | R | INPUT | data-p=`amt.ifsc` — 70_sec_amt.js:234 inp("amt.ifsc",{n:1}) [3a]; exp 292 |
| `AdjustedUnderSec115JCOther` | `ScheduleAMT/AdjustedUnderSec115JCOther` | R | COMPUTED | engAmt/amtcTable(); `70_sec_amt.js:293` put(o,"AdjustedUnderSec115JCOther",sg(A.other));      /* may be negative (minimum −99999999999999) */ |
| `TaxPayableUnderSec115JC` | `ScheduleAMT/TaxPayableUnderSec115JC` | R | COMPUTED | engAmt/amtcTable(); `70_sec_amt.js:294` put(o,"TaxPayableUnderSec115JC",n0(A.amt)); |

### Schedule AMTC — AMT credit u/s 115JD

`ScheduleAMTC` — 20 leaves · COMPUTED 18 · INPUT 2

| leaf | schema path | required? | class | evidence |
|---|---|---|---|---|
| `TaxSection115JC` | `ScheduleAMTC/TaxSection115JC` | R | COMPUTED | engAmt/amtcTable(); `70_sec_amt.js:303` put(o,"TaxSection115JC",n0(T.tax115JC)); |
| `TaxOthProvisions` | `ScheduleAMTC/TaxOthProvisions` | R | COMPUTED | engAmt/amtcTable(); `70_sec_amt.js:304` put(o,"TaxOthProvisions",n0(T.taxOther)); |
| `AmtTaxCreditAvailable` | `ScheduleAMTC/AmtTaxCreditAvailable` | R | COMPUTED | engAmt/amtcTable(); `70_sec_amt.js:305` put(o,"AmtTaxCreditAvailable",n0(T.avail)); |
| `AssYr` | `ScheduleAMTC/ScheduleAMTCDtls[]/AssYr` | R | COMPUTED | engAmt/amtcTable(); `70_sec_amt.js:318` const d={AssYr:r.y, AmtCreditFwd:n0(r.gross)}; |
| `AmtCreditFwd` | `ScheduleAMTC/ScheduleAMTCDtls[]/AmtCreditFwd` | R | INPUT | data-p=`amt.amtc.<AY>.gross` — 70_sec_amt.js:262 inp("amt.amtc."+x.y+".gross") col B1; exp 318 |
| `AmtCreditSetOfEy` | `ScheduleAMTC/ScheduleAMTCDtls[]/AmtCreditSetOfEy` | — | INPUT | data-p=`amt.amtc.<AY>.setoff` — 70_sec_amt.js:263 inp("amt.amtc."+x.y+".setoff") col B2; exp 319 |
| `AmtCreditBalBroughtFwd` | `ScheduleAMTC/ScheduleAMTCDtls[]/AmtCreditBalBroughtFwd` | R | COMPUTED | engAmt/amtcTable(); `70_sec_amt.js:320` d.AmtCreditBalBroughtFwd=n0(r.bf); |
| `AmtCreditUtilized` | `ScheduleAMTC/ScheduleAMTCDtls[]/AmtCreditUtilized` | R | COMPUTED | engAmt/amtcTable(); `70_sec_amt.js:321` d.AmtCreditUtilized=n0(r.used); |
| `BalAmtCreditCarryFwd` | `ScheduleAMTC/ScheduleAMTCDtls[]/BalAmtCreditCarryFwd` | R | COMPUTED | engAmt/amtcTable(); `70_sec_amt.js:322` d.BalAmtCreditCarryFwd=n0(r.cf); |
| `CurrAssYr` | `ScheduleAMTC/CurrAssYr` | R | COMPUTED | engAmt/amtcTable(); `70_sec_amt.js:306` put(o,"CurrAssYr",AMT_CUR_AY); |
| `CurrYrAmtCreditFwd` | `ScheduleAMTC/CurrYrAmtCreditFwd` | R | COMPUTED | engAmt/amtcTable(); `70_sec_amt.js:307` put(o,"CurrYrAmtCreditFwd",n0(T.curr));               /* [G25] */ |
| `CurrYrCreditBalBF` | `ScheduleAMTC/CurrYrCreditBalBF` | R | COMPUTED | engAmt/amtcTable(); `70_sec_amt.js:308` put(o,"CurrYrCreditBalBF",n0(T.curr));                /* [I25] */ |
| `CurrYrCreditCarryFwd` | `ScheduleAMTC/CurrYrCreditCarryFwd` | R | COMPUTED | engAmt/amtcTable(); `70_sec_amt.js:309` put(o,"CurrYrCreditCarryFwd",n0(T.New?0:T.curr));     /* [K25] 0 in new regime */ |
| `TotAMTGross` | `ScheduleAMTC/TotAMTGross` | R | COMPUTED | engAmt/amtcTable(); `70_sec_amt.js:310` put(o,"TotAMTGross",n0(T.gross+T.curr));              /* [G26]=SUM(G10:G25) incl current-year */ |
| `TotSetOffEys` | `ScheduleAMTC/TotSetOffEys` | R | COMPUTED | engAmt/amtcTable(); `70_sec_amt.js:311` put(o,"TotSetOffEys",n0(T.setoff));                   /* [H26] */ |
| `TotBalBF` | `ScheduleAMTC/TotBalBF` | R | COMPUTED | engAmt/amtcTable(); `70_sec_amt.js:312` put(o,"TotBalBF",n0(T.bf+T.curr));                    /* [I26]=SUM(I10:I25) incl current-year B3 */ |
| `TotAmtCreditUtilisedCY` | `ScheduleAMTC/TotAmtCreditUtilisedCY` | R | COMPUTED | engAmt/amtcTable(); `70_sec_amt.js:313` put(o,"TotAmtCreditUtilisedCY",n0(T.used));           /* [J26] */ |
| `TotBalAMTCreditCF` | `ScheduleAMTC/TotBalAMTCreditCF` | R | COMPUTED | engAmt/amtcTable(); `70_sec_amt.js:314` put(o,"TotBalAMTCreditCF",n0(T.cfTotal));             /* [K26] */ |
| `TaxSection115JD` | `ScheduleAMTC/TaxSection115JD` | R | COMPUTED | engAmt/amtcTable(); `70_sec_amt.js:315` put(o,"TaxSection115JD",n0(T.used));                  /* item 5 [K27] */ |
| `AmtLiabilityAvailable` | `ScheduleAMTC/AmtLiabilityAvailable` | R | COMPUTED | engAmt/amtcTable(); `70_sec_amt.js:316` put(o,"AmtLiabilityAvailable",n0(T.cfTotal));         /* item 6 [K28] */ |

### Schedule PTI — pass-through income

`SchedulePTI` — 54 leaves · COMPUTED 24 · INPUT 30

| leaf | schema path | required? | class | evidence |
|---|---|---|---|---|
| `InvstmntCvrdUs115UA115UB` | `SchedulePTI/SchedulePTIDtls[]/InvstmntCvrdUs115UA115UB` | R | INPUT | data-p=`other.pti.<i>.kind` — 70_sec_other.js:211 sel(pre+"kind",OTH_PTIKIND) col(2); exp 384 |
| `BusinessName` | `SchedulePTI/SchedulePTIDtls[]/BusinessName` | R | INPUT | data-p=`other.pti.<i>.name` — 70_sec_other.js:212 inp(pre+"name",{max:125}) col(3); exp 385 |
| `BusinessPAN` | `SchedulePTI/SchedulePTIDtls[]/BusinessPAN` | R | INPUT | data-p=`other.pti.<i>.pan` — 70_sec_other.js:213 inp(pre+"pan",{max:10}) col(4); exp 386 |
| `AmountOfInc` | `SchedulePTI/SchedulePTIDtls[]/IncFromHP/AmountOfInc` | R | INPUT | data-p=`other.pti.<i>.hp.inc` — 70_sec_other.js:214-218 money4()/money3() inp(pre+"hp.inc") col(7); exp 371 |
| `CurrYrLossShareByInvstFund` | `SchedulePTI/SchedulePTIDtls[]/IncFromHP/CurrYrLossShareByInvstFund` | R | INPUT | data-p=`other.pti.<i>.hp.loss` — 70_sec_other.js:214-215 money4() inp(pre+"hp.loss") col(8); exp 371 |
| `NetIncomeLoss` | `SchedulePTI/SchedulePTIDtls[]/IncFromHP/NetIncomeLoss` | R | COMPUTED | engOther:79-81 leaf(): net = inc − loss (col 9 = 7−8, A745); exp 372 |
| `TDSAmount` | `SchedulePTI/SchedulePTIDtls[]/IncFromHP/TDSAmount` | R | INPUT | data-p=`other.pti.<i>.hp.tds` — 70_sec_other.js:214-218 money4()/money3() inp(pre+"hp.tds") col(10); exp 372 |
| `AmountOfInc` | `SchedulePTI/SchedulePTIDtls[]/CapitalGainsPTI/ShortTermCG/AmountOfInc` | R | COMPUTED | engOther:88-99 add4/add3 subtotal (ShortTermCG); exp 371-372/387-390 |
| `CurrYrLossShareByInvstFund` | `SchedulePTI/SchedulePTIDtls[]/CapitalGainsPTI/ShortTermCG/CurrYrLossShareByInvstFund` | R | COMPUTED | engOther:88-99 add4/add3 subtotal (ShortTermCG); exp 371-372/387-390 |
| `NetIncomeLoss` | `SchedulePTI/SchedulePTIDtls[]/CapitalGainsPTI/ShortTermCG/NetIncomeLoss` | R | COMPUTED | engOther:88-99 add4/add3 subtotal (ShortTermCG); exp 371-372/387-390 |
| `TDSAmount` | `SchedulePTI/SchedulePTIDtls[]/CapitalGainsPTI/ShortTermCG/TDSAmount` | R | COMPUTED | engOther:88-99 add4/add3 subtotal (ShortTermCG); exp 371-372/387-390 |
| `AmountOfInc` | `SchedulePTI/SchedulePTIDtls[]/CapitalGainsPTI/STCG_Sec111A/AmountOfInc` | R | INPUT | data-p=`other.pti.<i>.st111a.inc` — 70_sec_other.js:214-218 money4()/money3() inp(pre+"st111a.inc") col(7); exp 371 |
| `CurrYrLossShareByInvstFund` | `SchedulePTI/SchedulePTIDtls[]/CapitalGainsPTI/STCG_Sec111A/CurrYrLossShareByInvstFund` | R | INPUT | data-p=`other.pti.<i>.st111a.loss` — 70_sec_other.js:214-215 money4() inp(pre+"st111a.loss") col(8); exp 371 |
| `NetIncomeLoss` | `SchedulePTI/SchedulePTIDtls[]/CapitalGainsPTI/STCG_Sec111A/NetIncomeLoss` | R | COMPUTED | engOther:79-81 leaf(): net = inc − loss (col 9 = 7−8, A745); exp 372 |
| `TDSAmount` | `SchedulePTI/SchedulePTIDtls[]/CapitalGainsPTI/STCG_Sec111A/TDSAmount` | R | INPUT | data-p=`other.pti.<i>.st111a.tds` — 70_sec_other.js:214-218 money4()/money3() inp(pre+"st111a.tds") col(10); exp 372 |
| `AmountOfInc` | `SchedulePTI/SchedulePTIDtls[]/CapitalGainsPTI/STCG_Others/AmountOfInc` | R | INPUT | data-p=`other.pti.<i>.stOth.inc` — 70_sec_other.js:214-218 money4()/money3() inp(pre+"stOth.inc") col(7); exp 371 |
| `CurrYrLossShareByInvstFund` | `SchedulePTI/SchedulePTIDtls[]/CapitalGainsPTI/STCG_Others/CurrYrLossShareByInvstFund` | R | INPUT | data-p=`other.pti.<i>.stOth.loss` — 70_sec_other.js:214-215 money4() inp(pre+"stOth.loss") col(8); exp 371 |
| `NetIncomeLoss` | `SchedulePTI/SchedulePTIDtls[]/CapitalGainsPTI/STCG_Others/NetIncomeLoss` | R | COMPUTED | engOther:79-81 leaf(): net = inc − loss (col 9 = 7−8, A745); exp 372 |
| `TDSAmount` | `SchedulePTI/SchedulePTIDtls[]/CapitalGainsPTI/STCG_Others/TDSAmount` | R | INPUT | data-p=`other.pti.<i>.stOth.tds` — 70_sec_other.js:214-218 money4()/money3() inp(pre+"stOth.tds") col(10); exp 372 |
| `AmountOfInc` | `SchedulePTI/SchedulePTIDtls[]/CapitalGainsPTI/LongTermCG/AmountOfInc` | R | COMPUTED | engOther:88-99 add4/add3 subtotal (LongTermCG); exp 371-372/387-390 |
| `CurrYrLossShareByInvstFund` | `SchedulePTI/SchedulePTIDtls[]/CapitalGainsPTI/LongTermCG/CurrYrLossShareByInvstFund` | R | COMPUTED | engOther:88-99 add4/add3 subtotal (LongTermCG); exp 371-372/387-390 |
| `NetIncomeLoss` | `SchedulePTI/SchedulePTIDtls[]/CapitalGainsPTI/LongTermCG/NetIncomeLoss` | R | COMPUTED | engOther:88-99 add4/add3 subtotal (LongTermCG); exp 371-372/387-390 |
| `TDSAmount` | `SchedulePTI/SchedulePTIDtls[]/CapitalGainsPTI/LongTermCG/TDSAmount` | R | COMPUTED | engOther:88-99 add4/add3 subtotal (LongTermCG); exp 371-372/387-390 |
| `AmountOfInc` | `SchedulePTI/SchedulePTIDtls[]/CapitalGainsPTI/LTCG_Sec112A/AmountOfInc` | R | INPUT | data-p=`other.pti.<i>.lt112a.inc` — 70_sec_other.js:214-218 money4()/money3() inp(pre+"lt112a.inc") col(7); exp 371 |
| `CurrYrLossShareByInvstFund` | `SchedulePTI/SchedulePTIDtls[]/CapitalGainsPTI/LTCG_Sec112A/CurrYrLossShareByInvstFund` | R | INPUT | data-p=`other.pti.<i>.lt112a.loss` — 70_sec_other.js:214-215 money4() inp(pre+"lt112a.loss") col(8); exp 371 |
| `NetIncomeLoss` | `SchedulePTI/SchedulePTIDtls[]/CapitalGainsPTI/LTCG_Sec112A/NetIncomeLoss` | R | COMPUTED | engOther:79-81 leaf(): net = inc − loss (col 9 = 7−8, A745); exp 372 |
| `TDSAmount` | `SchedulePTI/SchedulePTIDtls[]/CapitalGainsPTI/LTCG_Sec112A/TDSAmount` | R | INPUT | data-p=`other.pti.<i>.lt112a.tds` — 70_sec_other.js:214-218 money4()/money3() inp(pre+"lt112a.tds") col(10); exp 372 |
| `AmountOfInc` | `SchedulePTI/SchedulePTIDtls[]/CapitalGainsPTI/LTCG_Others/AmountOfInc` | R | INPUT | data-p=`other.pti.<i>.ltOth.inc` — 70_sec_other.js:214-218 money4()/money3() inp(pre+"ltOth.inc") col(7); exp 371 |
| `CurrYrLossShareByInvstFund` | `SchedulePTI/SchedulePTIDtls[]/CapitalGainsPTI/LTCG_Others/CurrYrLossShareByInvstFund` | R | INPUT | data-p=`other.pti.<i>.ltOth.loss` — 70_sec_other.js:214-215 money4() inp(pre+"ltOth.loss") col(8); exp 371 |
| `NetIncomeLoss` | `SchedulePTI/SchedulePTIDtls[]/CapitalGainsPTI/LTCG_Others/NetIncomeLoss` | R | COMPUTED | engOther:79-81 leaf(): net = inc − loss (col 9 = 7−8, A745); exp 372 |
| `TDSAmount` | `SchedulePTI/SchedulePTIDtls[]/CapitalGainsPTI/LTCG_Others/TDSAmount` | R | INPUT | data-p=`other.pti.<i>.ltOth.tds` — 70_sec_other.js:214-218 money4()/money3() inp(pre+"ltOth.tds") col(10); exp 372 |
| `AmountOfInc` | `SchedulePTI/SchedulePTIDtls[]/IncOthSrc/AmountOfInc` | R | COMPUTED | engOther:88-99 add4/add3 subtotal (IncOthSrc); exp 371-372/387-390 |
| `NetIncomeLoss` | `SchedulePTI/SchedulePTIDtls[]/IncOthSrc/NetIncomeLoss` | R | COMPUTED | engOther:88-99 add4/add3 subtotal (IncOthSrc); exp 371-372/387-390 |
| `TDSAmount` | `SchedulePTI/SchedulePTIDtls[]/IncOthSrc/TDSAmount` | R | COMPUTED | engOther:88-99 add4/add3 subtotal (IncOthSrc); exp 371-372/387-390 |
| `AmountOfInc` | `SchedulePTI/SchedulePTIDtls[]/OS_Dividend/AmountOfInc` | R | INPUT | data-p=`other.pti.<i>.osDiv.inc` — 70_sec_other.js:214-218 money4()/money3() inp(pre+"osDiv.inc") col(7); exp 371 |
| `NetIncomeLoss` | `SchedulePTI/SchedulePTIDtls[]/OS_Dividend/NetIncomeLoss` | R | COMPUTED | engOther:79-81 leaf(): net = inc − loss (col 9 = 7−8, A745); exp 372 |
| `TDSAmount` | `SchedulePTI/SchedulePTIDtls[]/OS_Dividend/TDSAmount` | R | INPUT | data-p=`other.pti.<i>.osDiv.tds` — 70_sec_other.js:214-218 money4()/money3() inp(pre+"osDiv.tds") col(10); exp 372 |
| `AmountOfInc` | `SchedulePTI/SchedulePTIDtls[]/OS_Others/AmountOfInc` | R | INPUT | data-p=`other.pti.<i>.osOth.inc` — 70_sec_other.js:214-218 money4()/money3() inp(pre+"osOth.inc") col(7); exp 371 |
| `NetIncomeLoss` | `SchedulePTI/SchedulePTIDtls[]/OS_Others/NetIncomeLoss` | R | COMPUTED | engOther:79-81 leaf(): net = inc − loss (col 9 = 7−8, A745); exp 372 |
| `TDSAmount` | `SchedulePTI/SchedulePTIDtls[]/OS_Others/TDSAmount` | R | INPUT | data-p=`other.pti.<i>.osOth.tds` — 70_sec_other.js:214-218 money4()/money3() inp(pre+"osOth.tds") col(10); exp 372 |
| `AmountOfInc` | `SchedulePTI/SchedulePTIDtls[]/IncClmdPTI/TotalSec23FBB/AmountOfInc` | R | COMPUTED | engOther:88-99 add4/add3 subtotal (TotalSec23FBB); exp 371-372/387-390 |
| `NetIncomeLoss` | `SchedulePTI/SchedulePTIDtls[]/IncClmdPTI/TotalSec23FBB/NetIncomeLoss` | R | COMPUTED | engOther:88-99 add4/add3 subtotal (TotalSec23FBB); exp 371-372/387-390 |
| `TDSAmount` | `SchedulePTI/SchedulePTIDtls[]/IncClmdPTI/TotalSec23FBB/TDSAmount` | R | COMPUTED | engOther:88-99 add4/add3 subtotal (TotalSec23FBB); exp 371-372/387-390 |
| `AmountOfInc` | `SchedulePTI/SchedulePTIDtls[]/IncClmdPTI/Sec23FBB/AmountOfInc` | R | INPUT | data-p=`other.pti.<i>.ex23fbb.inc` — 70_sec_other.js:214-218 money4()/money3() inp(pre+"ex23fbb.inc") col(7); exp 371 |
| `NetIncomeLoss` | `SchedulePTI/SchedulePTIDtls[]/IncClmdPTI/Sec23FBB/NetIncomeLoss` | R | COMPUTED | engOther:79-81 leaf(): net = inc − loss (col 9 = 7−8, A745); exp 372 |
| `TDSAmount` | `SchedulePTI/SchedulePTIDtls[]/IncClmdPTI/Sec23FBB/TDSAmount` | R | INPUT | data-p=`other.pti.<i>.ex23fbb.tds` — 70_sec_other.js:214-218 money4()/money3() inp(pre+"ex23fbb.tds") col(10); exp 372 |
| `SectionCode` | `SchedulePTI/SchedulePTIDtls[]/IncClmdPTI/SecBIncExmptDtl/SectionCode` | R | INPUT | data-p=`other.pti.<i>.exBcode` — 70_sec_other.js:245 inp(pre+"exBcode",{max:10}) row ivb; exp 379/381 SectionCode |
| `AmountOfInc` | `SchedulePTI/SchedulePTIDtls[]/IncClmdPTI/SecBIncExmptDtl/SecBCIncExmptDtl/AmountOfInc` | R | INPUT | data-p=`other.pti.<i>.exB.inc` — 70_sec_other.js:247/251 inp(pre+"exB.inc"); exp 380/382 |
| `NetIncomeLoss` | `SchedulePTI/SchedulePTIDtls[]/IncClmdPTI/SecBIncExmptDtl/SecBCIncExmptDtl/NetIncomeLoss` | R | COMPUTED | engOther:95-98 net = inc (no loss column on exempt rows); exp 380/382 NetIncomeLoss |
| `TDSAmount` | `SchedulePTI/SchedulePTIDtls[]/IncClmdPTI/SecBIncExmptDtl/SecBCIncExmptDtl/TDSAmount` | R | INPUT | data-p=`other.pti.<i>.exB.tds` — 70_sec_other.js:248/252 inp(pre+"exB.tds"); exp 380/382 |
| `SectionCode` | `SchedulePTI/SchedulePTIDtls[]/IncClmdPTI/SecCIncExmptDtl/SectionCode` | R | INPUT | data-p=`other.pti.<i>.exCcode` — 70_sec_other.js:249 inp(pre+"exCcode",{max:10}) row ivc; exp 379/381 SectionCode |
| `AmountOfInc` | `SchedulePTI/SchedulePTIDtls[]/IncClmdPTI/SecCIncExmptDtl/SecBCIncExmptDtl/AmountOfInc` | R | INPUT | data-p=`other.pti.<i>.exC.inc` — 70_sec_other.js:247/251 inp(pre+"exC.inc"); exp 380/382 |
| `NetIncomeLoss` | `SchedulePTI/SchedulePTIDtls[]/IncClmdPTI/SecCIncExmptDtl/SecBCIncExmptDtl/NetIncomeLoss` | R | COMPUTED | engOther:95-98 net = inc (no loss column on exempt rows); exp 380/382 NetIncomeLoss |
| `TDSAmount` | `SchedulePTI/SchedulePTIDtls[]/IncClmdPTI/SecCIncExmptDtl/SecBCIncExmptDtl/TDSAmount` | R | INPUT | data-p=`other.pti.<i>.exC.tds` — 70_sec_other.js:248/252 inp(pre+"exC.tds"); exp 380/382 |

### Schedule IF — firms in which partner

`ScheduleIF` — 12 leaves · COMPUTED 3 · INPUT 9

| leaf | schema path | required? | class | evidence |
|---|---|---|---|---|
| `PartnerInNumberOfFirms` | `ScheduleIF/PartnerInNumberOfFirms` | R | INPUT | data-p=`other.if.n` — 70_sec_other.js:265 inp("other.if.n",{n:1}) [L4]; exp 401 |
| `FirmName` | `ScheduleIF/PartnerFirmDetails[]/FirmName` | R | INPUT | data-p=`other.if.firms.<i>.name` — 70_sec_other.js:266-274 grid("other.if.firms") col k:"name"; exp 408 |
| `FirmPAN` | `ScheduleIF/PartnerFirmDetails[]/FirmPAN` | R | INPUT | data-p=`other.if.firms.<i>.pan` — 70_sec_other.js:266-274 grid("other.if.firms") col k:"pan"; exp 409 |
| `IsLiableToAudit` | `ScheduleIF/PartnerFirmDetails[]/IsLiableToAudit` | R | INPUT | data-p=`other.if.firms.<i>.audit` — 70_sec_other.js:266-274 grid("other.if.firms") col k:"audit"; exp 410 |
| `Sec92EFirmFlag` | `ScheduleIF/PartnerFirmDetails[]/Sec92EFirmFlag` | R | INPUT | data-p=`other.if.firms.<i>.s92e` — 70_sec_other.js:266-274 grid("other.if.firms") col k:"s92e"; exp 411 |
| `ProfitSharePercent` | `ScheduleIF/PartnerFirmDetails[]/ProfitSharePercent` | R | INPUT | data-p=`other.if.firms.<i>.pct` — 70_sec_other.js:266-274 grid("other.if.firms") col k:"pct"; exp 412 |
| `ProfitShareAmt` | `ScheduleIF/PartnerFirmDetails[]/ProfitShareAmt` | R | INPUT | data-p=`other.if.firms.<i>.profit` — 70_sec_other.js:266-274 grid("other.if.firms") col k:"profit"; exp 413 |
| `IntrstAmtDueOrRecv` | `ScheduleIF/PartnerFirmDetails[]/IntrstAmtDueOrRecv` | — | INPUT | data-p=`other.if.firms.<i>.intr` — 70_sec_other.js:266-274 grid("other.if.firms") col k:"intr"; exp 416 |
| `FirmCapBalOn31Mar` | `ScheduleIF/PartnerFirmDetails[]/FirmCapBalOn31Mar` | R | INPUT | data-p=`other.if.firms.<i>.cap` — 70_sec_other.js:266-274 grid("other.if.firms") col k:"cap"; exp 414 |
| `TotalProfitShareAmt` | `ScheduleIF/TotalProfitShareAmt` | R | COMPUTED | engOther:122-123 ifT reduce, [J11]/[K11]/[L11] = SUM (n731); `70_sec_other.js:402` TotalProfitShareAmt: sg((CI.tot\|\|{}).profit), |
| `TotalIntrstAmtDueOrRecv` | `ScheduleIF/TotalIntrstAmtDueOrRecv` | — | COMPUTED | engOther:122-123 ifT reduce, [J11]/[K11]/[L11] = SUM (n731); `70_sec_other.js:405` if((CI.tot\|\|{}).intr) o.TotalIntrstAmtDueOrRecv = sg(CI.tot.intr); |
| `TotalFirmCapBalOn31Mar` | `ScheduleIF/TotalFirmCapBalOn31Mar` | R | COMPUTED | engOther:122-123 ifT reduce, [J11]/[K11]/[L11] = SUM (n731); `70_sec_other.js:403` TotalFirmCapBalOn31Mar: sg((CI.tot\|\|{}).cap) |

### Schedule TPSA — secondary adjustment u/s 92CE(2A)

`ScheduleTPSA` — 13 leaves · COMPUTED 7 · INPUT 6

| leaf | schema path | required? | class | evidence |
|---|---|---|---|---|
| `AmtPrimaryAdjUs92CE_2A` | `ScheduleTPSA/AmtPrimaryAdjUs92CE_2A` | R | INPUT | data-p=`other.tpsa.amt` — 70_sec_other.js:295 inp("other.tpsa.amt",{n:1}) [H4]; exp 426 |
| `AdditionalIncTax18PercAbove` | `ScheduleTPSA/AdditionalIncTax18PercAbove` | R | COMPUTED | engOther TPSA ladder (18%/12%/4%); `70_sec_other.js:427` AdditionalIncTax18PercAbove:n0(T.tax18), |
| `Surcharge12Perc` | `ScheduleTPSA/Surcharge12Perc` | R | COMPUTED | engOther TPSA ladder (18%/12%/4%); `70_sec_other.js:428` Surcharge12Perc:n0(T.sur12), |
| `HealthEducationCess` | `ScheduleTPSA/HealthEducationCess` | R | COMPUTED | engOther TPSA ladder (18%/12%/4%); `70_sec_other.js:429` HealthEducationCess:n0(T.cess4), |
| `TotalAdditionalTax` | `ScheduleTPSA/TotalAdditionalTax` | R | COMPUTED | engOther TPSA ladder (18%/12%/4%); `70_sec_other.js:430` TotalAdditionalTax:n0(T.total), |
| `TaxesPaid` | `ScheduleTPSA/TaxesPaid` | R | COMPUTED | engOther TPSA ladder (18%/12%/4%); `70_sec_other.js:431` TaxesPaid:n0(T.paid), |
| `NetTaxPayable` | `ScheduleTPSA/NetTaxPayable` | R | COMPUTED | engOther TPSA ladder (18%/12%/4%); `70_sec_other.js:432` NetTaxPayable:n0(T.net), |
| `BSRCode` | `ScheduleTPSA/DtlsTaxesPaid[]/BSRCode` | R | INPUT | data-p=`other.tpsa.challans.<i>.bsr` — 70_sec_other.js:303-309 grid col k:"bsr"; exp 437 |
| `BankBranchName` | `ScheduleTPSA/DtlsTaxesPaid[]/BankBranchName` | R | INPUT | data-p=`other.tpsa.challans.<i>.bank` — 70_sec_other.js:303-309 grid col k:"bank"; exp 438 |
| `DateDep` | `ScheduleTPSA/DtlsTaxesPaid[]/DateDep` | R | INPUT | data-p=`other.tpsa.challans.<i>.date` — 70_sec_other.js:303-309 grid col k:"date"; exp 439 |
| `SrlNoOfChaln` | `ScheduleTPSA/DtlsTaxesPaid[]/SrlNoOfChaln` | R | INPUT | data-p=`other.tpsa.challans.<i>.srl` — 70_sec_other.js:303-309 grid col k:"srl"; exp 440 |
| `Amount` | `ScheduleTPSA/DtlsTaxesPaid[]/Amount` | R | INPUT | data-p=`other.tpsa.challans.<i>.amt` — 70_sec_other.js:303-309 grid col k:"amt"; exp 759 |
| `TotalAmountDeposited` | `ScheduleTPSA/TotalAmountDeposited` | R | COMPUTED | engOther TPSA ladder (18%/12%/4%); `70_sec_other.js:433` TotalAmountDeposited:n0(T.dep) |

### Schedule 115TD — accreted income

`Schedule115TD` — 20 leaves · COMPUTED 8 · INPUT 12

| leaf | schema path | required? | class | evidence |
|---|---|---|---|---|
| `FMVTotTrustInst` | `Schedule115TD/FMVTotTrustInst` | — | INPUT | data-p=`other.td.fmv` — 70_sec_other.js:333 inp("other.td.fmv") [N6]; exp 459 |
| `LessTotLiaTrustInst` | `Schedule115TD/LessTotLiaTrustInst` | — | INPUT | data-p=`other.td.liab` — 70_sec_other.js:334 inp("other.td.liab") [N7]; exp 460 |
| `NetValAsst` | `Schedule115TD/NetValAsst` | — | COMPUTED | engOther 115TD ladder (book 115TD.md rows 22-34); `70_sec_other.js:461` NetValAsst:n0(CD.netVal), |
| `FMVAsstAcqrdRfrdSec101` | `Schedule115TD/FMVAsstAcqrdRfrdSec101` | — | INPUT | data-p=`other.td.fmv101` — 70_sec_other.js:336 inp("other.td.fmv101") [N9]; exp 462 |
| `FMVAsstAcqPeriodFromDateCrtn` | `Schedule115TD/FMVAsstAcqPeriodFromDateCrtn` | — | INPUT | data-p=`other.td.fmv12aa` — 70_sec_other.js:337 inp("other.td.fmv12aa") [N10]; exp 463 |
| `FMVAsstTrnfsrdSec115TD2` | `Schedule115TD/FMVAsstTrnfsrdSec115TD2` | — | INPUT | data-p=`other.td.fmv115td2` — 70_sec_other.js:338 inp("other.td.fmv115td2") [N11]; exp 464 |
| `FMVTotal` | `Schedule115TD/FMVTotal` | — | COMPUTED | engOther 115TD ladder (book 115TD.md rows 22-34); `70_sec_other.js:465` FMVTotal:n0(CD.fmvTot), |
| `LiabilityRespectofAsset4Above` | `Schedule115TD/LiabilityRespectofAsset4Above` | — | INPUT | data-p=`other.td.assetLiab` — 70_sec_other.js:340 inp("other.td.assetLiab") [N13]; exp 466 |
| `AccretedIncomeSection115TD` | `Schedule115TD/AccretedIncomeSection115TD` | — | COMPUTED | engOther 115TD ladder (book 115TD.md rows 22-34); `70_sec_other.js:467` AccretedIncomeSection115TD:n0(CD.accreted), |
| `AddIncPay115TDMarginalRate` | `Schedule115TD/AddIncPay115TDMarginalRate` | — | COMPUTED | engOther 115TD ladder (book 115TD.md rows 22-34); `70_sec_other.js:468` AddIncPay115TDMarginalRate:n0(CD.tax7), |
| `InterestPayable115TE` | `Schedule115TD/InterestPayable115TE` | — | COMPUTED | engOther 115TD ladder (book 115TD.md rows 22-34); `70_sec_other.js:469` InterestPayable115TE:n0(CD.int8), (optional user override data-p=`other.td.intOvr`, 70_sec_other.js:344) |
| `SpecifiedDateUs115TD` | `Schedule115TD/SpecifiedDateUs115TD` | — | INPUT | data-p=`other.td.specDate` — 70_sec_other.js:345 inp("other.td.specDate") [N17]; exp 474 |
| `AddIncIntstPayb` | `Schedule115TD/AddIncIntstPayb` | — | COMPUTED | engOther 115TD ladder (book 115TD.md rows 22-34); `70_sec_other.js:470` AddIncIntstPayb:n0(CD.total10), |
| `TaxIntstPaid` | `Schedule115TD/TaxIntstPaid` | — | COMPUTED | engOther 115TD ladder (book 115TD.md rows 22-34); `70_sec_other.js:471` TaxIntstPaid:n0(CD.paid11), |
| `NetPaybleRefble` | `Schedule115TD/NetPaybleRefble` | — | COMPUTED | engOther 115TD ladder (book 115TD.md rows 22-34); `70_sec_other.js:472` NetPaybleRefble:n0(CD.net12) |
| `DateDep` | `Schedule115TD/DepositofTaxAccInc/DepositofTaxAccIncDtls[]/DateDep` | — | INPUT | data-p=`other.td.challans.<i>.date` — 70_sec_other.js:350-356 grid col k:"date"; exp 439 |
| `NameBankBranch` | `Schedule115TD/DepositofTaxAccInc/DepositofTaxAccIncDtls[]/NameBankBranch` | — | INPUT | data-p=`other.td.challans.<i>.bank` — 70_sec_other.js:350-356 grid col k:"bank"; exp 478 |
| `BSRCode` | `Schedule115TD/DepositofTaxAccInc/DepositofTaxAccIncDtls[]/BSRCode` | — | INPUT | data-p=`other.td.challans.<i>.bsr` — 70_sec_other.js:350-356 grid col k:"bsr"; exp 437 |
| `SrlNoOfChaln` | `Schedule115TD/DepositofTaxAccInc/DepositofTaxAccIncDtls[]/SrlNoOfChaln` | — | INPUT | data-p=`other.td.challans.<i>.srl` — 70_sec_other.js:350-356 grid col k:"srl"; exp 440 |
| `Amount` | `Schedule115TD/DepositofTaxAccInc/DepositofTaxAccIncDtls[]/Amount` | — | INPUT | data-p=`other.td.challans.<i>.amt` — 70_sec_other.js:350-356 grid col k:"amt"; exp 759 |

### Schedule FSI — income from outside India

`ScheduleFSI` — 27 leaves · COMPUTED 9 · INPUT 18

| leaf | schema path | required? | class | evidence |
|---|---|---|---|---|
| `CountryName` | `ScheduleFSI/ScheduleFSIDtls[]/CountryName` | R | COMPUTED | derived from the country code: 70_sec_foreign.js:376 pf(el,"CountryName", cr.name\|\|FA_CONM[cr.code]) |
| `CountryCodeExcludingIndia` | `ScheduleFSI/ScheduleFSIDtls[]/CountryCodeExcludingIndia` | R | INPUT | data-p=`fa.fsi.<i>.code` — 70_sec_foreign.js:147 sel("fa.fsi."+i+".code",FA_CO); exp 377 |
| `TaxIdentificationNo` | `ScheduleFSI/ScheduleFSIDtls[]/TaxIdentificationNo` | R | INPUT | data-p=`fa.fsi.<i>.tin` — 70_sec_foreign.js:148 inp("fa.fsi."+i+".tin",{max:75}); exp 378 |
| `IncFrmOutsideInd` | `ScheduleFSI/ScheduleFSIDtls[]/IncFromHP/IncFrmOutsideInd` | R | INPUT | data-p=`fa.fsi.<i>.hp.b` — 70_sec_foreign.js:135-141 inp("fa.fsi."+i+"."+k+".b") (b) income from outside India; exp 383-386 |
| `TaxPaidOutsideInd` | `ScheduleFSI/ScheduleFSIDtls[]/IncFromHP/TaxPaidOutsideInd` | R | INPUT | data-p=`fa.fsi.<i>.hp.c` — 70_sec_foreign.js:135-141 inp("fa.fsi."+i+"."+k+".c") (c) tax paid outside India; exp 383-386 |
| `TaxPayableinInd` | `ScheduleFSI/ScheduleFSIDtls[]/IncFromHP/TaxPayableinInd` | R | INPUT | data-p=`fa.fsi.<i>.hp.d` — 70_sec_foreign.js:135-141 inp("fa.fsi."+i+"."+k+".d") (d) tax payable in India; exp 383-386 |
| `TaxReliefinInd` | `ScheduleFSI/ScheduleFSIDtls[]/IncFromHP/TaxReliefinInd` | R | COMPUTED | (e)=min(c,d) — engForeign; 70_sec_foreign.js:384 o.TaxReliefinInd=n0(h.e) |
| `DTAAReliefUs90or90A` | `ScheduleFSI/ScheduleFSIDtls[]/IncFromHP/DTAAReliefUs90or90A` | — | INPUT | data-p=`fa.fsi.<i>.hp.art` — 70_sec_foreign.js:135-141 inp("fa.fsi."+i+"."+k+".art") (f) DTAA article; exp 383-386 |
| `IncFrmOutsideInd` | `ScheduleFSI/ScheduleFSIDtls[]/IncFromBusiness/IncFrmOutsideInd` | R | INPUT | data-p=`fa.fsi.<i>.bus.b` — 70_sec_foreign.js:135-141 inp("fa.fsi."+i+"."+k+".b") (b) income from outside India; exp 383-386 |
| `TaxPaidOutsideInd` | `ScheduleFSI/ScheduleFSIDtls[]/IncFromBusiness/TaxPaidOutsideInd` | R | INPUT | data-p=`fa.fsi.<i>.bus.c` — 70_sec_foreign.js:135-141 inp("fa.fsi."+i+"."+k+".c") (c) tax paid outside India; exp 383-386 |
| `TaxPayableinInd` | `ScheduleFSI/ScheduleFSIDtls[]/IncFromBusiness/TaxPayableinInd` | R | INPUT | data-p=`fa.fsi.<i>.bus.d` — 70_sec_foreign.js:135-141 inp("fa.fsi."+i+"."+k+".d") (d) tax payable in India; exp 383-386 |
| `TaxReliefinInd` | `ScheduleFSI/ScheduleFSIDtls[]/IncFromBusiness/TaxReliefinInd` | R | COMPUTED | (e)=min(c,d) — engForeign; 70_sec_foreign.js:384 o.TaxReliefinInd=n0(h.e) |
| `DTAAReliefUs90or90A` | `ScheduleFSI/ScheduleFSIDtls[]/IncFromBusiness/DTAAReliefUs90or90A` | — | INPUT | data-p=`fa.fsi.<i>.bus.art` — 70_sec_foreign.js:135-141 inp("fa.fsi."+i+"."+k+".art") (f) DTAA article; exp 383-386 |
| `IncFrmOutsideInd` | `ScheduleFSI/ScheduleFSIDtls[]/IncCapGain/IncFrmOutsideInd` | R | INPUT | data-p=`fa.fsi.<i>.cg.b` — 70_sec_foreign.js:135-141 inp("fa.fsi."+i+"."+k+".b") (b) income from outside India; exp 383-386 |
| `TaxPaidOutsideInd` | `ScheduleFSI/ScheduleFSIDtls[]/IncCapGain/TaxPaidOutsideInd` | R | INPUT | data-p=`fa.fsi.<i>.cg.c` — 70_sec_foreign.js:135-141 inp("fa.fsi."+i+"."+k+".c") (c) tax paid outside India; exp 383-386 |
| `TaxPayableinInd` | `ScheduleFSI/ScheduleFSIDtls[]/IncCapGain/TaxPayableinInd` | R | INPUT | data-p=`fa.fsi.<i>.cg.d` — 70_sec_foreign.js:135-141 inp("fa.fsi."+i+"."+k+".d") (d) tax payable in India; exp 383-386 |
| `TaxReliefinInd` | `ScheduleFSI/ScheduleFSIDtls[]/IncCapGain/TaxReliefinInd` | R | COMPUTED | (e)=min(c,d) — engForeign; 70_sec_foreign.js:384 o.TaxReliefinInd=n0(h.e) |
| `DTAAReliefUs90or90A` | `ScheduleFSI/ScheduleFSIDtls[]/IncCapGain/DTAAReliefUs90or90A` | — | INPUT | data-p=`fa.fsi.<i>.cg.art` — 70_sec_foreign.js:135-141 inp("fa.fsi."+i+"."+k+".art") (f) DTAA article; exp 383-386 |
| `IncFrmOutsideInd` | `ScheduleFSI/ScheduleFSIDtls[]/IncOthSrc/IncFrmOutsideInd` | R | INPUT | data-p=`fa.fsi.<i>.os.b` — 70_sec_foreign.js:135-141 inp("fa.fsi."+i+"."+k+".b") (b) income from outside India; exp 383-386 |
| `TaxPaidOutsideInd` | `ScheduleFSI/ScheduleFSIDtls[]/IncOthSrc/TaxPaidOutsideInd` | R | INPUT | data-p=`fa.fsi.<i>.os.c` — 70_sec_foreign.js:135-141 inp("fa.fsi."+i+"."+k+".c") (c) tax paid outside India; exp 383-386 |
| `TaxPayableinInd` | `ScheduleFSI/ScheduleFSIDtls[]/IncOthSrc/TaxPayableinInd` | R | INPUT | data-p=`fa.fsi.<i>.os.d` — 70_sec_foreign.js:135-141 inp("fa.fsi."+i+"."+k+".d") (d) tax payable in India; exp 383-386 |
| `TaxReliefinInd` | `ScheduleFSI/ScheduleFSIDtls[]/IncOthSrc/TaxReliefinInd` | R | COMPUTED | (e)=min(c,d) — engForeign; 70_sec_foreign.js:384 o.TaxReliefinInd=n0(h.e) |
| `DTAAReliefUs90or90A` | `ScheduleFSI/ScheduleFSIDtls[]/IncOthSrc/DTAAReliefUs90or90A` | — | INPUT | data-p=`fa.fsi.<i>.os.art` — 70_sec_foreign.js:135-141 inp("fa.fsi."+i+"."+k+".art") (f) DTAA article; exp 383-386 |
| `IncFrmOutsideInd` | `ScheduleFSI/ScheduleFSIDtls[]/TotalCountryWise/IncFrmOutsideInd` | R | COMPUTED | engForeign country total (row "Total (i+ii+iii+iv)"); exp 70_sec_foreign.js:392-394 el.TotalCountryWise={IncFrmOutsideInd…} |
| `TaxPaidOutsideInd` | `ScheduleFSI/ScheduleFSIDtls[]/TotalCountryWise/TaxPaidOutsideInd` | R | COMPUTED | engForeign country total (row "Total (i+ii+iii+iv)"); exp 70_sec_foreign.js:392-394 el.TotalCountryWise={IncFrmOutsideInd…} |
| `TaxPayableinInd` | `ScheduleFSI/ScheduleFSIDtls[]/TotalCountryWise/TaxPayableinInd` | R | COMPUTED | engForeign country total (row "Total (i+ii+iii+iv)"); exp 70_sec_foreign.js:392-394 el.TotalCountryWise={IncFrmOutsideInd…} |
| `TaxReliefinInd` | `ScheduleFSI/ScheduleFSIDtls[]/TotalCountryWise/TaxReliefinInd` | R | COMPUTED | engForeign country total (row "Total (i+ii+iii+iv)"); exp 70_sec_foreign.js:392-394 el.TotalCountryWise={IncFrmOutsideInd…} |

### Schedule TR — tax relief for taxes paid outside India

`ScheduleTR1` — 13 leaves · COMPUTED 9 · INPUT 4

| leaf | schema path | required? | class | evidence |
|---|---|---|---|---|
| `CountryName` | `ScheduleTR1/ScheduleTR[]/CountryName` | R | COMPUTED | from the FSI country code: 70_sec_foreign.js:403 pf(el,"CountryName", r.name\|\|FA_CONM[r.code]\|\|"") |
| `CountryCodeExcludingIndia` | `ScheduleTR1/ScheduleTR[]/CountryCodeExcludingIndia` | R | COMPUTED | Schedule TR rows are generated from Schedule FSI (engForeign C.trRows); 70_sec_foreign.js:404 pf(el,"CountryCodeExcludingIndia", r.code). The screen shows it read-only (renderer :164-176). |
| `TaxIdentificationNo` | `ScheduleTR1/ScheduleTR[]/TaxIdentificationNo` | R | COMPUTED | carried from the FSI row: 70_sec_foreign.js:405 pf(el,"TaxIdentificationNo", r.tin) |
| `TaxPaidOutsideIndia` | `ScheduleTR1/ScheduleTR[]/TaxPaidOutsideIndia` | R | COMPUTED | FSI col (c) country total; 70_sec_foreign.js:406 el.TaxPaidOutsideIndia=n0(r.paid) |
| `TaxReliefOutsideIndia` | `ScheduleTR1/ScheduleTR[]/TaxReliefOutsideIndia` | R | COMPUTED | FSI col (e) country total; 70_sec_foreign.js:407 el.TaxReliefOutsideIndia=n0(r.relief) |
| `ReliefClaimedUsSection` | `ScheduleTR1/ScheduleTR[]/ReliefClaimedUsSection` | — | INPUT | data-p=`fa.fsi.<i>.sec` — 70_sec_foreign.js:149 sel("fa.fsi."+i+".sec",FA_RELSEC), re-rendered inside the TR table at :172; exp 408 |
| `TotalTaxOutsideIndia` | `ScheduleTR1/TotalTaxOutsideIndia` | R | COMPUTED | 70_sec_foreign.js:414 put(...,n0(C.paidTot)) [G11] |
| `TotalTaxReliefOutsideIndia` | `ScheduleTR1/TotalTaxReliefOutsideIndia` | R | COMPUTED | 70_sec_foreign.js:415 put(...,n0(C.reliefTot)) [H11] |
| `TaxReliefOutsideIndiaDTAA` | `ScheduleTR1/TaxReliefOutsideIndiaDTAA` | R | COMPUTED | 70_sec_foreign.js:416 put(...,n0(C.dtaa)) [J12] |
| `TaxReliefOutsideIndiaNotDTAA` | `ScheduleTR1/TaxReliefOutsideIndiaNotDTAA` | R | COMPUTED | 70_sec_foreign.js:417 put(...,n0(C.notDtaa)) [J13] |
| `TaxPaidOutsideIndFlg` | `ScheduleTR1/TaxPaidOutsideIndFlg` | — | INPUT | data-p=`fa.trFlag` — 70_sec_foreign.js:181 sel("fa.trFlag",FA_REFFLAG) item 4; exp 418 |
| `AmtTaxRefunded` | `ScheduleTR1/AmtTaxRefunded` | — | INPUT | data-p=`fa.trAmt` — 70_sec_foreign.js:183 inp("fa.trAmt",{n:1}) item 4a; exp 420 |
| `AssmtYrTaxRelief` | `ScheduleTR1/AssmtYrTaxRelief` | — | INPUT | data-p=`fa.trAY` — 70_sec_foreign.js:184 inp("fa.trAY",{max:9}) item 4b; exp 421 |

### Schedule FA — foreign assets

`ScheduleFA` — 122 leaves · COMPUTED 10 · INPUT 112

| leaf | schema path | required? | class | evidence |
|---|---|---|---|---|
| `CountryName` | `ScheduleFA/DetailsForiegnBank[]/CountryName` | R | COMPUTED | derived from the row country code: 70_sec_foreign.js:427 cc() → pf(el,"CountryName",FA_CONM[r.code]||"") (A1 Foreign Depository Accounts) |
| `CountryCodeExcludingIndia` | `ScheduleFA/DetailsForiegnBank[]/CountryCodeExcludingIndia` | R | INPUT | data-p=`fa.a1.<i>.code` — 70_sec_foreign.js:194 grid("fa.a1") col k:"code" (A1 Foreign Depository Accounts); exp 70_sec_foreign.js:427 cc() → pf(el,"CountryCodeExcludingIndia",r.code) |
| `Bankname` | `ScheduleFA/DetailsForiegnBank[]/Bankname` | R | INPUT | data-p=`fa.a1.<i>.Bankname` — 70_sec_foreign.js:194 grid("fa.a1") col k:"Bankname" (A1 Foreign Depository Accounts); exp 432 |
| `AddressOfBank` | `ScheduleFA/DetailsForiegnBank[]/AddressOfBank` | R | INPUT | data-p=`fa.a1.<i>.AddressOfBank` — 70_sec_foreign.js:194 grid("fa.a1") col k:"AddressOfBank" (A1 Foreign Depository Accounts); exp 432 |
| `ZipCode` | `ScheduleFA/DetailsForiegnBank[]/ZipCode` | R | INPUT | data-p=`fa.a1.<i>.ZipCode` — 70_sec_foreign.js:194 grid("fa.a1") col k:"ZipCode" (A1 Foreign Depository Accounts); exp 432 |
| `ForeignAccountNumber` | `ScheduleFA/DetailsForiegnBank[]/ForeignAccountNumber` | R | INPUT | data-p=`fa.a1.<i>.ForeignAccountNumber` — 70_sec_foreign.js:194 grid("fa.a1") col k:"ForeignAccountNumber" (A1 Foreign Depository Accounts); exp 432 |
| `OwnerStatus` | `ScheduleFA/DetailsForiegnBank[]/OwnerStatus` | R | INPUT | data-p=`fa.a1.<i>.OwnerStatus` — 70_sec_foreign.js:194 grid("fa.a1") col k:"OwnerStatus" (A1 Foreign Depository Accounts); exp 432 |
| `AccOpenDate` | `ScheduleFA/DetailsForiegnBank[]/AccOpenDate` | R | INPUT | data-p=`fa.a1.<i>.AccOpenDate` — 70_sec_foreign.js:194 grid("fa.a1") col k:"AccOpenDate" (A1 Foreign Depository Accounts); exp 433 |
| `PeakBalanceDuringYear` | `ScheduleFA/DetailsForiegnBank[]/PeakBalanceDuringYear` | R | INPUT | data-p=`fa.a1.<i>.PeakBalanceDuringYear` — 70_sec_foreign.js:194 grid("fa.a1") col k:"PeakBalanceDuringYear" (A1 Foreign Depository Accounts); exp 434 |
| `ClosingBalance` | `ScheduleFA/DetailsForiegnBank[]/ClosingBalance` | R | INPUT | data-p=`fa.a1.<i>.ClosingBalance` — 70_sec_foreign.js:194 grid("fa.a1") col k:"ClosingBalance" (A1 Foreign Depository Accounts); exp 435 |
| `IntrstAccured` | `ScheduleFA/DetailsForiegnBank[]/IntrstAccured` | R | INPUT | data-p=`fa.a1.<i>.IntrstAccured` — 70_sec_foreign.js:194 grid("fa.a1") col k:"IntrstAccured" (A1 Foreign Depository Accounts); exp 436 |
| `CountryName` | `ScheduleFA/DtlsForeignCustodialAcc[]/CountryName` | R | COMPUTED | derived from the row country code: 70_sec_foreign.js:427 cc() → pf(el,"CountryName",FA_CONM[r.code]||"") (A2 Foreign Custodial Accounts) |
| `CountryCodeExcludingIndia` | `ScheduleFA/DtlsForeignCustodialAcc[]/CountryCodeExcludingIndia` | R | INPUT | data-p=`fa.a2.<i>.code` — 70_sec_foreign.js:209 grid("fa.a2") col k:"code" (A2 Foreign Custodial Accounts); exp 70_sec_foreign.js:427 cc() → pf(el,"CountryCodeExcludingIndia",r.code) |
| `FinancialInstName` | `ScheduleFA/DtlsForeignCustodialAcc[]/FinancialInstName` | R | INPUT | data-p=`fa.a2.<i>.FinancialInstName` — 70_sec_foreign.js:209 grid("fa.a2") col k:"FinancialInstName" (A2 Foreign Custodial Accounts); exp 441 |
| `FinancialInstAddress` | `ScheduleFA/DtlsForeignCustodialAcc[]/FinancialInstAddress` | R | INPUT | data-p=`fa.a2.<i>.FinancialInstAddress` — 70_sec_foreign.js:209 grid("fa.a2") col k:"FinancialInstAddress" (A2 Foreign Custodial Accounts); exp 441 |
| `ZipCode` | `ScheduleFA/DtlsForeignCustodialAcc[]/ZipCode` | R | INPUT | data-p=`fa.a2.<i>.ZipCode` — 70_sec_foreign.js:209 grid("fa.a2") col k:"ZipCode" (A2 Foreign Custodial Accounts); exp 432 |
| `AccountNumber` | `ScheduleFA/DtlsForeignCustodialAcc[]/AccountNumber` | R | INPUT | data-p=`fa.a2.<i>.AccountNumber` — 70_sec_foreign.js:209 grid("fa.a2") col k:"AccountNumber" (A2 Foreign Custodial Accounts); exp 441 |
| `Status` | `ScheduleFA/DtlsForeignCustodialAcc[]/Status` | R | INPUT | data-p=`fa.a2.<i>.Status` — 70_sec_foreign.js:209 grid("fa.a2") col k:"Status" (A2 Foreign Custodial Accounts); exp 441 |
| `AccOpenDate` | `ScheduleFA/DtlsForeignCustodialAcc[]/AccOpenDate` | R | INPUT | data-p=`fa.a2.<i>.AccOpenDate` — 70_sec_foreign.js:209 grid("fa.a2") col k:"AccOpenDate" (A2 Foreign Custodial Accounts); exp 433 |
| `PeakBalanceDuringPeriod` | `ScheduleFA/DtlsForeignCustodialAcc[]/PeakBalanceDuringPeriod` | R | INPUT | data-p=`fa.a2.<i>.PeakBalanceDuringPeriod` — 70_sec_foreign.js:209 grid("fa.a2") col k:"PeakBalanceDuringPeriod" (A2 Foreign Custodial Accounts); exp 443 |
| `ClosingBalance` | `ScheduleFA/DtlsForeignCustodialAcc[]/ClosingBalance` | R | INPUT | data-p=`fa.a2.<i>.ClosingBalance` — 70_sec_foreign.js:209 grid("fa.a2") col k:"ClosingBalance" (A2 Foreign Custodial Accounts); exp 435 |
| `GrossAmtPaidCredited` | `ScheduleFA/DtlsForeignCustodialAcc[]/GrossAmtPaidCredited` | R | INPUT | data-p=`fa.a2.<i>.GrossAmtPaidCredited` — 70_sec_foreign.js:209 grid("fa.a2") col k:"GrossAmtPaidCredited" (A2 Foreign Custodial Accounts); exp 445 |
| `NatureOfAmount` | `ScheduleFA/DtlsForeignCustodialAcc[]/NatureOfAmount` | R | INPUT | data-p=`fa.a2.<i>.NatureOfAmount` — 70_sec_foreign.js:209 grid("fa.a2") col k:"NatureOfAmount" (A2 Foreign Custodial Accounts); exp 441 |
| `CountryName` | `ScheduleFA/DtlsForeignEquityDebtInterest[]/CountryName` | R | COMPUTED | derived from the row country code: 70_sec_foreign.js:427 cc() → pf(el,"CountryName",FA_CONM[r.code]||"") (A3 Foreign Equity & Debt Interest) |
| `CountryCodeExcludingIndia` | `ScheduleFA/DtlsForeignEquityDebtInterest[]/CountryCodeExcludingIndia` | R | INPUT | data-p=`fa.a3.<i>.code` — 70_sec_foreign.js:225 grid("fa.a3") col k:"code" (A3 Foreign Equity & Debt Interest); exp 70_sec_foreign.js:427 cc() → pf(el,"CountryCodeExcludingIndia",r.code) |
| `NameOfEntity` | `ScheduleFA/DtlsForeignEquityDebtInterest[]/NameOfEntity` | R | INPUT | data-p=`fa.a3.<i>.NameOfEntity` — 70_sec_foreign.js:225 grid("fa.a3") col k:"NameOfEntity" (A3 Foreign Equity & Debt Interest); exp 450 |
| `AddressOfEntity` | `ScheduleFA/DtlsForeignEquityDebtInterest[]/AddressOfEntity` | R | INPUT | data-p=`fa.a3.<i>.AddressOfEntity` — 70_sec_foreign.js:225 grid("fa.a3") col k:"AddressOfEntity" (A3 Foreign Equity & Debt Interest); exp 450 |
| `ZipCode` | `ScheduleFA/DtlsForeignEquityDebtInterest[]/ZipCode` | R | INPUT | data-p=`fa.a3.<i>.ZipCode` — 70_sec_foreign.js:225 grid("fa.a3") col k:"ZipCode" (A3 Foreign Equity & Debt Interest); exp 432 |
| `NatureOfEntity` | `ScheduleFA/DtlsForeignEquityDebtInterest[]/NatureOfEntity` | R | INPUT | data-p=`fa.a3.<i>.NatureOfEntity` — 70_sec_foreign.js:225 grid("fa.a3") col k:"NatureOfEntity" (A3 Foreign Equity & Debt Interest); exp 450 |
| `InterestAcquiringDate` | `ScheduleFA/DtlsForeignEquityDebtInterest[]/InterestAcquiringDate` | R | INPUT | data-p=`fa.a3.<i>.InterestAcquiringDate` — 70_sec_foreign.js:225 grid("fa.a3") col k:"InterestAcquiringDate" (A3 Foreign Equity & Debt Interest); exp 451 |
| `InitialValOfInvstmnt` | `ScheduleFA/DtlsForeignEquityDebtInterest[]/InitialValOfInvstmnt` | R | INPUT | data-p=`fa.a3.<i>.InitialValOfInvstmnt` — 70_sec_foreign.js:225 grid("fa.a3") col k:"InitialValOfInvstmnt" (A3 Foreign Equity & Debt Interest); exp 452 |
| `PeakBalanceDuringPeriod` | `ScheduleFA/DtlsForeignEquityDebtInterest[]/PeakBalanceDuringPeriod` | R | INPUT | data-p=`fa.a3.<i>.PeakBalanceDuringPeriod` — 70_sec_foreign.js:225 grid("fa.a3") col k:"PeakBalanceDuringPeriod" (A3 Foreign Equity & Debt Interest); exp 443 |
| `ClosingBalance` | `ScheduleFA/DtlsForeignEquityDebtInterest[]/ClosingBalance` | R | INPUT | data-p=`fa.a3.<i>.ClosingBalance` — 70_sec_foreign.js:225 grid("fa.a3") col k:"ClosingBalance" (A3 Foreign Equity & Debt Interest); exp 435 |
| `TotGrossAmtPaidCredited` | `ScheduleFA/DtlsForeignEquityDebtInterest[]/TotGrossAmtPaidCredited` | R | INPUT | data-p=`fa.a3.<i>.TotGrossAmtPaidCredited` — 70_sec_foreign.js:225 grid("fa.a3") col k:"TotGrossAmtPaidCredited" (A3 Foreign Equity & Debt Interest); exp 455 |
| `TotGrossProceeds` | `ScheduleFA/DtlsForeignEquityDebtInterest[]/TotGrossProceeds` | R | INPUT | data-p=`fa.a3.<i>.TotGrossProceeds` — 70_sec_foreign.js:225 grid("fa.a3") col k:"TotGrossProceeds" (A3 Foreign Equity & Debt Interest); exp 456 |
| `CountryName` | `ScheduleFA/DtlsForeignCashValueInsurance[]/CountryName` | R | COMPUTED | derived from the row country code: 70_sec_foreign.js:427 cc() → pf(el,"CountryName",FA_CONM[r.code]||"") (A4 Foreign Cash Value Insurance) |
| `CountryCodeExcludingIndia` | `ScheduleFA/DtlsForeignCashValueInsurance[]/CountryCodeExcludingIndia` | R | INPUT | data-p=`fa.a4.<i>.code` — 70_sec_foreign.js:241 grid("fa.a4") col k:"code" (A4 Foreign Cash Value Insurance); exp 70_sec_foreign.js:427 cc() → pf(el,"CountryCodeExcludingIndia",r.code) |
| `FinancialInstName` | `ScheduleFA/DtlsForeignCashValueInsurance[]/FinancialInstName` | R | INPUT | data-p=`fa.a4.<i>.FinancialInstName` — 70_sec_foreign.js:241 grid("fa.a4") col k:"FinancialInstName" (A4 Foreign Cash Value Insurance); exp 441 |
| `FinancialInstAddress` | `ScheduleFA/DtlsForeignCashValueInsurance[]/FinancialInstAddress` | R | INPUT | data-p=`fa.a4.<i>.FinancialInstAddress` — 70_sec_foreign.js:241 grid("fa.a4") col k:"FinancialInstAddress" (A4 Foreign Cash Value Insurance); exp 441 |
| `ZipCode` | `ScheduleFA/DtlsForeignCashValueInsurance[]/ZipCode` | R | INPUT | data-p=`fa.a4.<i>.ZipCode` — 70_sec_foreign.js:241 grid("fa.a4") col k:"ZipCode" (A4 Foreign Cash Value Insurance); exp 432 |
| `ContractDate` | `ScheduleFA/DtlsForeignCashValueInsurance[]/ContractDate` | R | INPUT | data-p=`fa.a4.<i>.ContractDate` — 70_sec_foreign.js:241 grid("fa.a4") col k:"ContractDate" (A4 Foreign Cash Value Insurance); exp 462 |
| `CashValOrSurrenderVal` | `ScheduleFA/DtlsForeignCashValueInsurance[]/CashValOrSurrenderVal` | R | INPUT | data-p=`fa.a4.<i>.CashValOrSurrenderVal` — 70_sec_foreign.js:241 grid("fa.a4") col k:"CashValOrSurrenderVal" (A4 Foreign Cash Value Insurance); exp 463 |
| `TotGrossAmtPaidCredited` | `ScheduleFA/DtlsForeignCashValueInsurance[]/TotGrossAmtPaidCredited` | R | INPUT | data-p=`fa.a4.<i>.TotGrossAmtPaidCredited` — 70_sec_foreign.js:241 grid("fa.a4") col k:"TotGrossAmtPaidCredited" (A4 Foreign Cash Value Insurance); exp 455 |
| `CountryName` | `ScheduleFA/DetailsFinancialInterest[]/CountryName` | R | COMPUTED | derived from the row country code: 70_sec_foreign.js:427 cc() → pf(el,"CountryName",FA_CONM[r.code]||"") (B Financial interest in any entity) |
| `CountryCodeExcludingIndia` | `ScheduleFA/DetailsFinancialInterest[]/CountryCodeExcludingIndia` | R | INPUT | data-p=`fa.b.<i>.code` — 70_sec_foreign.js:253 grid("fa.b") col k:"code" (B Financial interest in any entity); exp 70_sec_foreign.js:427 cc() → pf(el,"CountryCodeExcludingIndia",r.code) |
| `ZipCode` | `ScheduleFA/DetailsFinancialInterest[]/ZipCode` | R | INPUT | data-p=`fa.b.<i>.ZipCode` — 70_sec_foreign.js:253 grid("fa.b") col k:"ZipCode" (B Financial interest in any entity); exp 432 |
| `NatureOfEntity` | `ScheduleFA/DetailsFinancialInterest[]/NatureOfEntity` | — | INPUT | data-p=`fa.b.<i>.NatureOfEntity` — 70_sec_foreign.js:253 grid("fa.b") col k:"NatureOfEntity" (B Financial interest in any entity); exp 450 |
| `NameOfEntity` | `ScheduleFA/DetailsFinancialInterest[]/NameOfEntity` | R | INPUT | data-p=`fa.b.<i>.NameOfEntity` — 70_sec_foreign.js:253 grid("fa.b") col k:"NameOfEntity" (B Financial interest in any entity); exp 450 |
| `AddressOfEntity` | `ScheduleFA/DetailsFinancialInterest[]/AddressOfEntity` | R | INPUT | data-p=`fa.b.<i>.AddressOfEntity` — 70_sec_foreign.js:253 grid("fa.b") col k:"AddressOfEntity" (B Financial interest in any entity); exp 450 |
| `NatureOfInt` | `ScheduleFA/DetailsFinancialInterest[]/NatureOfInt` | R | INPUT | data-p=`fa.b.<i>.NatureOfInt` — 70_sec_foreign.js:253 grid("fa.b") col k:"NatureOfInt" (B Financial interest in any entity); exp 469 |
| `DateHeld` | `ScheduleFA/DetailsFinancialInterest[]/DateHeld` | R | INPUT | data-p=`fa.b.<i>.DateHeld` — 70_sec_foreign.js:253 grid("fa.b") col k:"DateHeld" (B Financial interest in any entity); exp 470 |
| `TotalInvestment` | `ScheduleFA/DetailsFinancialInterest[]/TotalInvestment` | R | INPUT | data-p=`fa.b.<i>.TotalInvestment` — 70_sec_foreign.js:253 grid("fa.b") col k:"TotalInvestment" (B Financial interest in any entity); exp 471 |
| `IncFromInt` | `ScheduleFA/DetailsFinancialInterest[]/IncFromInt` | R | INPUT | data-p=`fa.b.<i>.IncFromInt` — 70_sec_foreign.js:253 grid("fa.b") col k:"IncFromInt" (B Financial interest in any entity); exp 472 |
| `NatureOfInc` | `ScheduleFA/DetailsFinancialInterest[]/NatureOfInc` | R | INPUT | data-p=`fa.b.<i>.NatureOfInc` — 70_sec_foreign.js:253 grid("fa.b") col k:"NatureOfInc" (B Financial interest in any entity); exp 469 |
| `IncTaxAmt` | `ScheduleFA/DetailsFinancialInterest[]/IncTaxAmt` | R | INPUT | data-p=`fa.b.<i>.IncTaxAmt` — 70_sec_foreign.js:253 grid("fa.b") col k:"IncTaxAmt" (B Financial interest in any entity); exp 473 |
| `IncTaxSch` | `ScheduleFA/DetailsFinancialInterest[]/IncTaxSch` | R | INPUT | data-p=`fa.b.<i>.IncTaxSch` — 70_sec_foreign.js:253 grid("fa.b") col k:"IncTaxSch" (B Financial interest in any entity); exp 469 |
| `IncTaxSchNo` | `ScheduleFA/DetailsFinancialInterest[]/IncTaxSchNo` | R | INPUT | data-p=`fa.b.<i>.IncTaxSchNo` — 70_sec_foreign.js:253 grid("fa.b") col k:"IncTaxSchNo" (B Financial interest in any entity); exp 469 |
| `CountryName` | `ScheduleFA/DetailsImmovableProperty[]/CountryName` | R | COMPUTED | derived from the row country code: 70_sec_foreign.js:427 cc() → pf(el,"CountryName",FA_CONM[r.code]||"") (C Immovable property) |
| `CountryCodeExcludingIndia` | `ScheduleFA/DetailsImmovableProperty[]/CountryCodeExcludingIndia` | R | INPUT | data-p=`fa.c.<i>.code` — 70_sec_foreign.js:271 grid("fa.c") col k:"code" (C Immovable property); exp 70_sec_foreign.js:427 cc() → pf(el,"CountryCodeExcludingIndia",r.code) |
| `ZipCode` | `ScheduleFA/DetailsImmovableProperty[]/ZipCode` | R | INPUT | data-p=`fa.c.<i>.ZipCode` — 70_sec_foreign.js:271 grid("fa.c") col k:"ZipCode" (C Immovable property); exp 432 |
| `AddressOfProperty` | `ScheduleFA/DetailsImmovableProperty[]/AddressOfProperty` | — | INPUT | data-p=`fa.c.<i>.AddressOfProperty` — 70_sec_foreign.js:271 grid("fa.c") col k:"AddressOfProperty" (C Immovable property); exp 70_sec_foreign.js:478 S1(el,r,["ZipCode","AddressOfProperty",…]) |
| `Ownership` | `ScheduleFA/DetailsImmovableProperty[]/Ownership` | R | INPUT | data-p=`fa.c.<i>.Ownership` — 70_sec_foreign.js:271 grid("fa.c") col k:"Ownership" (C Immovable property); exp 478 |
| `DateOfAcq` | `ScheduleFA/DetailsImmovableProperty[]/DateOfAcq` | R | INPUT | data-p=`fa.c.<i>.DateOfAcq` — 70_sec_foreign.js:271 grid("fa.c") col k:"DateOfAcq" (C Immovable property); exp 479 |
| `TotalInvestment` | `ScheduleFA/DetailsImmovableProperty[]/TotalInvestment` | R | INPUT | data-p=`fa.c.<i>.TotalInvestment` — 70_sec_foreign.js:271 grid("fa.c") col k:"TotalInvestment" (C Immovable property); exp 471 |
| `IncDrvProperty` | `ScheduleFA/DetailsImmovableProperty[]/IncDrvProperty` | R | INPUT | data-p=`fa.c.<i>.IncDrvProperty` — 70_sec_foreign.js:271 grid("fa.c") col k:"IncDrvProperty" (C Immovable property); exp 481 |
| `NatureOfInc` | `ScheduleFA/DetailsImmovableProperty[]/NatureOfInc` | R | INPUT | data-p=`fa.c.<i>.NatureOfInc` — 70_sec_foreign.js:271 grid("fa.c") col k:"NatureOfInc" (C Immovable property); exp 469 |
| `IncTaxAmt` | `ScheduleFA/DetailsImmovableProperty[]/IncTaxAmt` | R | INPUT | data-p=`fa.c.<i>.IncTaxAmt` — 70_sec_foreign.js:271 grid("fa.c") col k:"IncTaxAmt" (C Immovable property); exp 473 |
| `IncTaxSch` | `ScheduleFA/DetailsImmovableProperty[]/IncTaxSch` | R | INPUT | data-p=`fa.c.<i>.IncTaxSch` — 70_sec_foreign.js:271 grid("fa.c") col k:"IncTaxSch" (C Immovable property); exp 469 |
| `IncTaxSchNo` | `ScheduleFA/DetailsImmovableProperty[]/IncTaxSchNo` | R | INPUT | data-p=`fa.c.<i>.IncTaxSchNo` — 70_sec_foreign.js:271 grid("fa.c") col k:"IncTaxSchNo" (C Immovable property); exp 469 |
| `CountryName` | `ScheduleFA/DetailsOthAssets[]/CountryName` | R | COMPUTED | derived from the row country code: 70_sec_foreign.js:427 cc() → pf(el,"CountryName",FA_CONM[r.code]||"") (D Any other capital asset) |
| `CountryCodeExcludingIndia` | `ScheduleFA/DetailsOthAssets[]/CountryCodeExcludingIndia` | R | INPUT | data-p=`fa.d.<i>.code` — 70_sec_foreign.js:287 grid("fa.d") col k:"code" (D Any other capital asset); exp 70_sec_foreign.js:427 cc() → pf(el,"CountryCodeExcludingIndia",r.code) |
| `ZipCode` | `ScheduleFA/DetailsOthAssets[]/ZipCode` | R | INPUT | data-p=`fa.d.<i>.ZipCode` — 70_sec_foreign.js:287 grid("fa.d") col k:"ZipCode" (D Any other capital asset); exp 432 |
| `NatureOfAsset` | `ScheduleFA/DetailsOthAssets[]/NatureOfAsset` | R | INPUT | data-p=`fa.d.<i>.NatureOfAsset` — 70_sec_foreign.js:287 grid("fa.d") col k:"NatureOfAsset" (D Any other capital asset); exp 487 |
| `Ownership` | `ScheduleFA/DetailsOthAssets[]/Ownership` | R | INPUT | data-p=`fa.d.<i>.Ownership` — 70_sec_foreign.js:287 grid("fa.d") col k:"Ownership" (D Any other capital asset); exp 478 |
| `DateOfAcq` | `ScheduleFA/DetailsOthAssets[]/DateOfAcq` | R | INPUT | data-p=`fa.d.<i>.DateOfAcq` — 70_sec_foreign.js:287 grid("fa.d") col k:"DateOfAcq" (D Any other capital asset); exp 479 |
| `TotalInvestment` | `ScheduleFA/DetailsOthAssets[]/TotalInvestment` | R | INPUT | data-p=`fa.d.<i>.TotalInvestment` — 70_sec_foreign.js:287 grid("fa.d") col k:"TotalInvestment" (D Any other capital asset); exp 471 |
| `IncDrvAsset` | `ScheduleFA/DetailsOthAssets[]/IncDrvAsset` | R | INPUT | data-p=`fa.d.<i>.IncDrvAsset` — 70_sec_foreign.js:287 grid("fa.d") col k:"IncDrvAsset" (D Any other capital asset); exp 490 |
| `NatureOfInc` | `ScheduleFA/DetailsOthAssets[]/NatureOfInc` | R | INPUT | data-p=`fa.d.<i>.NatureOfInc` — 70_sec_foreign.js:287 grid("fa.d") col k:"NatureOfInc" (D Any other capital asset); exp 469 |
| `IncTaxAmt` | `ScheduleFA/DetailsOthAssets[]/IncTaxAmt` | R | INPUT | data-p=`fa.d.<i>.IncTaxAmt` — 70_sec_foreign.js:287 grid("fa.d") col k:"IncTaxAmt" (D Any other capital asset); exp 473 |
| `IncTaxSch` | `ScheduleFA/DetailsOthAssets[]/IncTaxSch` | R | INPUT | data-p=`fa.d.<i>.IncTaxSch` — 70_sec_foreign.js:287 grid("fa.d") col k:"IncTaxSch" (D Any other capital asset); exp 469 |
| `IncTaxSchNo` | `ScheduleFA/DetailsOthAssets[]/IncTaxSchNo` | R | INPUT | data-p=`fa.d.<i>.IncTaxSchNo` — 70_sec_foreign.js:287 grid("fa.d") col k:"IncTaxSchNo" (D Any other capital asset); exp 469 |
| `NameOfInstitution` | `ScheduleFA/DetailsOfAccntsHvngSigningAuth[]/NameOfInstitution` | R | INPUT | data-p=`fa.e.<i>.NameOfInstitution` — 70_sec_foreign.js:303 grid("fa.e") col k:"NameOfInstitution" (E Accounts with signing authority); exp 497 |
| `AddressOfInstitution` | `ScheduleFA/DetailsOfAccntsHvngSigningAuth[]/AddressOfInstitution` | R | INPUT | data-p=`fa.e.<i>.AddressOfInstitution` — 70_sec_foreign.js:303 grid("fa.e") col k:"AddressOfInstitution" (E Accounts with signing authority); exp 497 |
| `CountryName` | `ScheduleFA/DetailsOfAccntsHvngSigningAuth[]/CountryName` | R | COMPUTED | derived from the row country code: 70_sec_foreign.js:427 cc() → pf(el,"CountryName",FA_CONM[r.code]||"") (E Accounts with signing authority) |
| `CountryCodeExcludingIndia` | `ScheduleFA/DetailsOfAccntsHvngSigningAuth[]/CountryCodeExcludingIndia` | R | INPUT | data-p=`fa.e.<i>.code` — 70_sec_foreign.js:303 grid("fa.e") col k:"code" (E Accounts with signing authority); exp 70_sec_foreign.js:427 cc() → pf(el,"CountryCodeExcludingIndia",r.code) |
| `ZipCode` | `ScheduleFA/DetailsOfAccntsHvngSigningAuth[]/ZipCode` | R | INPUT | data-p=`fa.e.<i>.ZipCode` — 70_sec_foreign.js:303 grid("fa.e") col k:"ZipCode" (E Accounts with signing authority); exp 432 |
| `NameMentionedInAccnt` | `ScheduleFA/DetailsOfAccntsHvngSigningAuth[]/NameMentionedInAccnt` | R | INPUT | data-p=`fa.e.<i>.NameMentionedInAccnt` — 70_sec_foreign.js:303 grid("fa.e") col k:"NameMentionedInAccnt" (E Accounts with signing authority); exp 497 |
| `InstitutionAccountNumber` | `ScheduleFA/DetailsOfAccntsHvngSigningAuth[]/InstitutionAccountNumber` | R | INPUT | data-p=`fa.e.<i>.InstitutionAccountNumber` — 70_sec_foreign.js:303 grid("fa.e") col k:"InstitutionAccountNumber" (E Accounts with signing authority); exp 497 |
| `PeakBalanceOrInvestment` | `ScheduleFA/DetailsOfAccntsHvngSigningAuth[]/PeakBalanceOrInvestment` | R | INPUT | data-p=`fa.e.<i>.PeakBalanceOrInvestment` — 70_sec_foreign.js:303 grid("fa.e") col k:"PeakBalanceOrInvestment" (E Accounts with signing authority); exp 498 |
| `IncAccuredTaxFlag` | `ScheduleFA/DetailsOfAccntsHvngSigningAuth[]/IncAccuredTaxFlag` | R | INPUT | data-p=`fa.e.<i>.IncAccuredTaxFlag` — 70_sec_foreign.js:303 grid("fa.e") col k:"IncAccuredTaxFlag" (E Accounts with signing authority); exp 497 |
| `IncAccuredInAcc` | `ScheduleFA/DetailsOfAccntsHvngSigningAuth[]/IncAccuredInAcc` | — | INPUT | data-p=`fa.e.<i>.IncAccuredInAcc` — 70_sec_foreign.js:303 grid("fa.e") col k:"IncAccuredInAcc" (E Accounts with signing authority); exp 499 |
| `IncOfferedAmt` | `ScheduleFA/DetailsOfAccntsHvngSigningAuth[]/IncOfferedAmt` | — | INPUT | data-p=`fa.e.<i>.IncOfferedAmt` — 70_sec_foreign.js:303 grid("fa.e") col k:"IncOfferedAmt" (E Accounts with signing authority); exp 499 |
| `IncOfferedSch` | `ScheduleFA/DetailsOfAccntsHvngSigningAuth[]/IncOfferedSch` | — | INPUT | data-p=`fa.e.<i>.IncOfferedSch` — 70_sec_foreign.js:303 grid("fa.e") col k:"IncOfferedSch" (E Accounts with signing authority); exp 497 |
| `IncOfferedSchNo` | `ScheduleFA/DetailsOfAccntsHvngSigningAuth[]/IncOfferedSchNo` | — | INPUT | data-p=`fa.e.<i>.IncOfferedSchNo` — 70_sec_foreign.js:303 grid("fa.e") col k:"IncOfferedSchNo" (E Accounts with signing authority); exp 497 |
| `CountryName` | `ScheduleFA/DetailsOfTrustOutIndiaTrustee[]/CountryName` | R | COMPUTED | derived from the row country code: 70_sec_foreign.js:427 cc() → pf(el,"CountryName",FA_CONM[r.code]||"") (F Trusts outside India) |
| `CountryCodeExcludingIndia` | `ScheduleFA/DetailsOfTrustOutIndiaTrustee[]/CountryCodeExcludingIndia` | R | INPUT | data-p=`fa.f.<i>.code` — 70_sec_foreign.js:320 grid("fa.f") col k:"code" (F Trusts outside India); exp 70_sec_foreign.js:427 cc() → pf(el,"CountryCodeExcludingIndia",r.code) |
| `ZipCode` | `ScheduleFA/DetailsOfTrustOutIndiaTrustee[]/ZipCode` | R | INPUT | data-p=`fa.f.<i>.ZipCode` — 70_sec_foreign.js:320 grid("fa.f") col k:"ZipCode" (F Trusts outside India); exp 432 |
| `NameOfTrust` | `ScheduleFA/DetailsOfTrustOutIndiaTrustee[]/NameOfTrust` | R | INPUT | data-p=`fa.f.<i>.NameOfTrust` — 70_sec_foreign.js:320 grid("fa.f") col k:"NameOfTrust" (F Trusts outside India); exp 504 |
| `AddressOfTrust` | `ScheduleFA/DetailsOfTrustOutIndiaTrustee[]/AddressOfTrust` | R | INPUT | data-p=`fa.f.<i>.AddressOfTrust` — 70_sec_foreign.js:320 grid("fa.f") col k:"AddressOfTrust" (F Trusts outside India); exp 504 |
| `NameOfOtherTrustees` | `ScheduleFA/DetailsOfTrustOutIndiaTrustee[]/NameOfOtherTrustees` | R | INPUT | data-p=`fa.f.<i>.NameOfOtherTrustees` — 70_sec_foreign.js:320 grid("fa.f") col k:"NameOfOtherTrustees" (F Trusts outside India); exp 504 |
| `AddressOfOtherTrustees` | `ScheduleFA/DetailsOfTrustOutIndiaTrustee[]/AddressOfOtherTrustees` | R | INPUT | data-p=`fa.f.<i>.AddressOfOtherTrustees` — 70_sec_foreign.js:320 grid("fa.f") col k:"AddressOfOtherTrustees" (F Trusts outside India); exp 504 |
| `NameOfSettlor` | `ScheduleFA/DetailsOfTrustOutIndiaTrustee[]/NameOfSettlor` | R | INPUT | data-p=`fa.f.<i>.NameOfSettlor` — 70_sec_foreign.js:320 grid("fa.f") col k:"NameOfSettlor" (F Trusts outside India); exp 504 |
| `AddressOfSettlor` | `ScheduleFA/DetailsOfTrustOutIndiaTrustee[]/AddressOfSettlor` | R | INPUT | data-p=`fa.f.<i>.AddressOfSettlor` — 70_sec_foreign.js:320 grid("fa.f") col k:"AddressOfSettlor" (F Trusts outside India); exp 504 |
| `NameOfBeneficiaries` | `ScheduleFA/DetailsOfTrustOutIndiaTrustee[]/NameOfBeneficiaries` | R | INPUT | data-p=`fa.f.<i>.NameOfBeneficiaries` — 70_sec_foreign.js:320 grid("fa.f") col k:"NameOfBeneficiaries" (F Trusts outside India); exp 504 |
| `AddressOfBeneficiaries` | `ScheduleFA/DetailsOfTrustOutIndiaTrustee[]/AddressOfBeneficiaries` | R | INPUT | data-p=`fa.f.<i>.AddressOfBeneficiaries` — 70_sec_foreign.js:320 grid("fa.f") col k:"AddressOfBeneficiaries" (F Trusts outside India); exp 504 |
| `DateHeld` | `ScheduleFA/DetailsOfTrustOutIndiaTrustee[]/DateHeld` | R | INPUT | data-p=`fa.f.<i>.DateHeld` — 70_sec_foreign.js:320 grid("fa.f") col k:"DateHeld" (F Trusts outside India); exp 470 |
| `IncDrvTaxFlag` | `ScheduleFA/DetailsOfTrustOutIndiaTrustee[]/IncDrvTaxFlag` | R | INPUT | data-p=`fa.f.<i>.IncDrvTaxFlag` — 70_sec_foreign.js:320 grid("fa.f") col k:"IncDrvTaxFlag" (F Trusts outside India); exp 504 |
| `IncDrvFromTrust` | `ScheduleFA/DetailsOfTrustOutIndiaTrustee[]/IncDrvFromTrust` | — | INPUT | data-p=`fa.f.<i>.IncDrvFromTrust` — 70_sec_foreign.js:320 grid("fa.f") col k:"IncDrvFromTrust" (F Trusts outside India); exp 506 |
| `IncOfferedAmt` | `ScheduleFA/DetailsOfTrustOutIndiaTrustee[]/IncOfferedAmt` | — | INPUT | data-p=`fa.f.<i>.IncOfferedAmt` — 70_sec_foreign.js:320 grid("fa.f") col k:"IncOfferedAmt" (F Trusts outside India); exp 499 |
| `IncOfferedSch` | `ScheduleFA/DetailsOfTrustOutIndiaTrustee[]/IncOfferedSch` | — | INPUT | data-p=`fa.f.<i>.IncOfferedSch` — 70_sec_foreign.js:320 grid("fa.f") col k:"IncOfferedSch" (F Trusts outside India); exp 497 |
| `IncOfferedSchNo` | `ScheduleFA/DetailsOfTrustOutIndiaTrustee[]/IncOfferedSchNo` | — | INPUT | data-p=`fa.f.<i>.IncOfferedSchNo` — 70_sec_foreign.js:320 grid("fa.f") col k:"IncOfferedSchNo" (F Trusts outside India); exp 497 |
| `CountryName` | `ScheduleFA/DetailsOfOthSourcesIncOutsideIndia[]/CountryName` | R | COMPUTED | derived from the row country code: 70_sec_foreign.js:427 cc() → pf(el,"CountryName",FA_CONM[r.code]||"") (G Other income outside India) |
| `CountryCodeExcludingIndia` | `ScheduleFA/DetailsOfOthSourcesIncOutsideIndia[]/CountryCodeExcludingIndia` | R | INPUT | data-p=`fa.g.<i>.code` — 70_sec_foreign.js:341 grid("fa.g") col k:"code" (G Other income outside India); exp 70_sec_foreign.js:427 cc() → pf(el,"CountryCodeExcludingIndia",r.code) |
| `ZipCode` | `ScheduleFA/DetailsOfOthSourcesIncOutsideIndia[]/ZipCode` | R | INPUT | data-p=`fa.g.<i>.ZipCode` — 70_sec_foreign.js:341 grid("fa.g") col k:"ZipCode" (G Other income outside India); exp 432 |
| `NameOfPerson` | `ScheduleFA/DetailsOfOthSourcesIncOutsideIndia[]/NameOfPerson` | R | INPUT | data-p=`fa.g.<i>.NameOfPerson` — 70_sec_foreign.js:341 grid("fa.g") col k:"NameOfPerson" (G Other income outside India); exp 511 |
| `AddressOfPerson` | `ScheduleFA/DetailsOfOthSourcesIncOutsideIndia[]/AddressOfPerson` | R | INPUT | data-p=`fa.g.<i>.AddressOfPerson` — 70_sec_foreign.js:341 grid("fa.g") col k:"AddressOfPerson" (G Other income outside India); exp 511 |
| `IncDerived` | `ScheduleFA/DetailsOfOthSourcesIncOutsideIndia[]/IncDerived` | — | INPUT | data-p=`fa.g.<i>.IncDerived` — 70_sec_foreign.js:341 grid("fa.g") col k:"IncDerived" (G Other income outside India); exp 512 |
| `NatureOfInc` | `ScheduleFA/DetailsOfOthSourcesIncOutsideIndia[]/NatureOfInc` | R | INPUT | data-p=`fa.g.<i>.NatureOfInc` — 70_sec_foreign.js:341 grid("fa.g") col k:"NatureOfInc" (G Other income outside India); exp 469 |
| `IncDrvTaxFlag` | `ScheduleFA/DetailsOfOthSourcesIncOutsideIndia[]/IncDrvTaxFlag` | R | INPUT | data-p=`fa.g.<i>.IncDrvTaxFlag` — 70_sec_foreign.js:341 grid("fa.g") col k:"IncDrvTaxFlag" (G Other income outside India); exp 504 |
| `IncOfferedAmt` | `ScheduleFA/DetailsOfOthSourcesIncOutsideIndia[]/IncOfferedAmt` | — | INPUT | data-p=`fa.g.<i>.IncOfferedAmt` — 70_sec_foreign.js:341 grid("fa.g") col k:"IncOfferedAmt" (G Other income outside India); exp 499 |
| `IncOfferedSch` | `ScheduleFA/DetailsOfOthSourcesIncOutsideIndia[]/IncOfferedSch` | — | INPUT | data-p=`fa.g.<i>.IncOfferedSch` — 70_sec_foreign.js:341 grid("fa.g") col k:"IncOfferedSch" (G Other income outside India); exp 497 |
| `IncOfferedSchNo` | `ScheduleFA/DetailsOfOthSourcesIncOutsideIndia[]/IncOfferedSchNo` | — | INPUT | data-p=`fa.g.<i>.IncOfferedSchNo` — 70_sec_foreign.js:341 grid("fa.g") col k:"IncOfferedSchNo" (G Other income outside India); exp 497 |

### Schedule GST — turnover reported for GST

`ScheduleGST` — 2 leaves · INPUT 2

| leaf | schema path | required? | class | evidence |
|---|---|---|---|---|
| `GSTINNo` | `ScheduleGST/TurnoverGrsRcptForGSTIN[]/GSTINNo` | R | INPUT | data-p=`other.gst.<i>.gstin` — 70_sec_other.js:320-323 grid("other.gst") col k:"gstin"; exp 450 |
| `AmtTurnGrossRcptGSTIN` | `ScheduleGST/TurnoverGrsRcptForGSTIN[]/AmtTurnGrossRcptGSTIN` | R | INPUT | data-p=`other.gst.<i>.amt` — 70_sec_other.js:320-323 grid col k:"amt"; exp 451 |

### Schedule IT — advance / self-assessment tax challans

`ScheduleIT` — 5 leaves · COMPUTED 1 · INPUT 4

| leaf | schema path | required? | class | evidence |
|---|---|---|---|---|
| `BSRCode` | `ScheduleIT/TaxPayment[]/BSRCode` | R | INPUT | data-p=`paid.it.<i>.bsr` — 70_sec_paid.js:176-181 grid("paid.it") col k:"bsr"; exp 261-262 |
| `DateDep` | `ScheduleIT/TaxPayment[]/DateDep` | R | INPUT | data-p=`paid.it.<i>.dt` — 70_sec_paid.js:176-181 grid("paid.it") col k:"dt"; exp 261-262 |
| `SrlNoOfChaln` | `ScheduleIT/TaxPayment[]/SrlNoOfChaln` | R | INPUT | data-p=`paid.it.<i>.sn` — 70_sec_paid.js:176-181 grid("paid.it") col k:"sn"; exp 261-262 |
| `Amt` | `ScheduleIT/TaxPayment[]/Amt` | R | INPUT | data-p=`paid.it.<i>.amt` — 70_sec_paid.js:176-181 grid("paid.it") col k:"amt"; exp 261-262 |
| `TotalTaxPayments` | `ScheduleIT/TotalTaxPayments` | R | COMPUTED | engPaid P.itTotal = advance + self-assessment; 70_sec_paid.js:260 put(j,"ScheduleIT.TotalTaxPayments",n0(P.itTotal)) |

### Schedule TDS 1 (schema ScheduleTDS2) — TDS other than salary, Form 16A

`ScheduleTDS2` — 19 leaves · COMPUTED 2 · INPUT 17

| leaf | schema path | required? | class | evidence |
|---|---|---|---|---|
| `TDSCreditName` | `ScheduleTDS2/TDSOthThanSalaryDtls[]/TDSCreditName` | R | INPUT | data-p=`paid.tds2.<i>.who` — 70_sec_paid.js:115-137 tdsCols() col k:"who", grid at :141; exp 199 |
| `PANofOtherPerson` | `ScheduleTDS2/TDSOthThanSalaryDtls[]/PANofOtherPerson` | — | INPUT | data-p=`paid.tds2.<i>.othPan` — 70_sec_paid.js:115-137 tdsCols() col k:"othPan", grid at :141; exp 201 |
| `AadhaarOfOtherPerson` | `ScheduleTDS2/TDSOthThanSalaryDtls[]/AadhaarOfOtherPerson` | — | INPUT | data-p=`paid.tds2.<i>.othAadh` — 70_sec_paid.js:115-137 tdsCols() col k:"othAadh", grid at :141; exp 202 |
| `TDSSection` | `ScheduleTDS2/TDSOthThanSalaryDtls[]/TDSSection` | R | INPUT | data-p=`paid.tds2.<i>.sec` — 70_sec_paid.js:115-137 tdsCols() col k:"sec", grid at :141; exp 207 |
| `TANOfDeductor` | `ScheduleTDS2/TDSOthThanSalaryDtls[]/TANOfDeductor` | R | INPUT | data-p=`paid.tds2.<i>.tan` — 70_sec_paid.js:115-137 tdsCols() col k:"tan", grid at :141; exp 206 |
| `DeductedYr` | `ScheduleTDS2/TDSOthThanSalaryDtls[]/DeductedYr` | — | INPUT | data-p=`paid.tds2.<i>.yr` — 70_sec_paid.js:115-137 tdsCols() col k:"yr", grid at :141; exp 208 |
| `BroughtFwdTDSAmt` | `ScheduleTDS2/TDSOthThanSalaryDtls[]/BroughtFwdTDSAmt` | — | INPUT | data-p=`paid.tds2.<i>.bf` — 70_sec_paid.js:115-137 tdsCols() col k:"bf", grid at :141; exp 208 |
| `TaxDeductedOwnHands` | `ScheduleTDS2/TDSOthThanSalaryDtls[]/TaxDeductCreditDtls/TaxDeductedOwnHands` | — | INPUT | data-p=`paid.tds2.<i>.dedOwn` — 70_sec_paid.js:115-137 tdsCols() col k:"dedOwn", grid at :141; exp 210 |
| `TaxDeductedIncome` | `ScheduleTDS2/TDSOthThanSalaryDtls[]/TaxDeductCreditDtls/TaxDeductedIncome` | — | INPUT | data-p=`paid.tds2.<i>.dedOthInc` — 70_sec_paid.js:115-137 tdsCols() col k:"dedOthInc", grid at :141; exp 211 |
| `TaxDeductedTDS` | `ScheduleTDS2/TDSOthThanSalaryDtls[]/TaxDeductCreditDtls/TaxDeductedTDS` | — | INPUT | data-p=`paid.tds2.<i>.dedOthTds` — 70_sec_paid.js:115-137 tdsCols() col k:"dedOthTds", grid at :141; exp 212 |
| `TaxClaimedOwnHands` | `ScheduleTDS2/TDSOthThanSalaryDtls[]/TaxDeductCreditDtls/TaxClaimedOwnHands` | R | INPUT | data-p=`paid.tds2.<i>.claimOwn` — 70_sec_paid.js:115-137 tdsCols() col k:"claimOwn", grid at :141; exp 209 |
| `TaxClaimedIncome` | `ScheduleTDS2/TDSOthThanSalaryDtls[]/TaxDeductCreditDtls/TaxClaimedIncome` | — | INPUT | data-p=`paid.tds2.<i>.claimOthInc` — 70_sec_paid.js:115-137 tdsCols() col k:"claimOthInc", grid at :141; exp 213 |
| `TaxClaimedTDS` | `ScheduleTDS2/TDSOthThanSalaryDtls[]/TaxDeductCreditDtls/TaxClaimedTDS` | — | INPUT | data-p=`paid.tds2.<i>.claimOthTds` — 70_sec_paid.js:115-137 tdsCols() col k:"claimOthTds", grid at :141; exp 214 |
| `TaxClaimedSpouseOthPrsnPAN` | `ScheduleTDS2/TDSOthThanSalaryDtls[]/TaxDeductCreditDtls/TaxClaimedSpouseOthPrsnPAN` | — | INPUT | data-p=`paid.tds2.<i>.claimOthPan` — 70_sec_paid.js:115-137 tdsCols() col k:"claimOthPan", grid at :141; exp 215 |
| `SpouseOthPrsnAadhaar` | `ScheduleTDS2/TDSOthThanSalaryDtls[]/TaxDeductCreditDtls/SpouseOthPrsnAadhaar` | — | INPUT | data-p=`paid.tds2.<i>.claimOthAadh` — 70_sec_paid.js:115-137 tdsCols() col k:"claimOthAadh", grid at :141; exp 216 |
| `GrossAmount` | `ScheduleTDS2/TDSOthThanSalaryDtls[]/GrossAmount` | — | INPUT | data-p=`paid.tds2.<i>.gross` — 70_sec_paid.js:115-137 tdsCols() col k:"gross", grid at :141; exp 218 |
| `HeadOfIncome` | `ScheduleTDS2/TDSOthThanSalaryDtls[]/HeadOfIncome` | — | INPUT | data-p=`paid.tds2.<i>.head` — 70_sec_paid.js:115-137 tdsCols() col k:"head", grid at :141; exp 70_sec_paid.js:222 o.HeadOfIncome=hd (defaulted from the section via TDS_HEAD_OF5 when blank) |
| `AmtCarriedFwd` | `ScheduleTDS2/TDSOthThanSalaryDtls[]/AmtCarriedFwd` | R | COMPUTED | engPaid _cf = MAX(0, b/f + deducted − claimed); 70_sec_paid.js:223 o.AmtCarriedFwd=n0(r._cf\|\|0) (screen col t:"calc", 70_sec_paid.js:137) |
| `TotalTDSonOthThanSals` | `ScheduleTDS2/TotalTDSonOthThanSals` | R | COMPUTED | engPaid column-9 total (P.t2/P.t3); 70_sec_paid.js:228 put(j,"ScheduleTDS2.TotalTDSonOthThanSals",...) |

### Schedule TDS 2 (schema ScheduleTDS3) — TDS per Form 16B/16C/16D/16E

`ScheduleTDS3` — 20 leaves · COMPUTED 2 · INPUT 18

| leaf | schema path | required? | class | evidence |
|---|---|---|---|---|
| `TDSCreditName` | `ScheduleTDS3/TDS3onOthThanSalDtls[]/TDSCreditName` | R | INPUT | data-p=`paid.tds3.<i>.who` — 70_sec_paid.js:115-137 tdsCols() col k:"who", grid at :149; exp 199 |
| `PANofOtherPerson` | `ScheduleTDS3/TDS3onOthThanSalDtls[]/PANofOtherPerson` | — | INPUT | data-p=`paid.tds3.<i>.othPan` — 70_sec_paid.js:115-137 tdsCols() col k:"othPan", grid at :149; exp 201 |
| `AadhaarOfOtherPerson` | `ScheduleTDS3/TDS3onOthThanSalDtls[]/AadhaarOfOtherPerson` | — | INPUT | data-p=`paid.tds3.<i>.othAadh` — 70_sec_paid.js:115-137 tdsCols() col k:"othAadh", grid at :149; exp 202 |
| `PANOfBuyerTenant` | `ScheduleTDS3/TDS3onOthThanSalDtls[]/PANOfBuyerTenant` | R | INPUT | data-p=`paid.tds3.<i>.pan` — 70_sec_paid.js:115-137 tdsCols() col k:"pan", grid at :149; exp 204 |
| `AadhaarOfBuyerTenant` | `ScheduleTDS3/TDS3onOthThanSalDtls[]/AadhaarOfBuyerTenant` | — | INPUT | data-p=`paid.tds3.<i>.aadh` — 70_sec_paid.js:115-137 tdsCols() col k:"aadh", grid at :149; exp 205 |
| `TDSSection` | `ScheduleTDS3/TDS3onOthThanSalDtls[]/TDSSection` | R | INPUT | data-p=`paid.tds3.<i>.sec` — 70_sec_paid.js:115-137 tdsCols() col k:"sec", grid at :149; exp 207 |
| `DeductedYr` | `ScheduleTDS3/TDS3onOthThanSalDtls[]/DeductedYr` | — | INPUT | data-p=`paid.tds3.<i>.yr` — 70_sec_paid.js:115-137 tdsCols() col k:"yr", grid at :149; exp 208 |
| `BroughtFwdTDSAmt` | `ScheduleTDS3/TDS3onOthThanSalDtls[]/BroughtFwdTDSAmt` | — | INPUT | data-p=`paid.tds3.<i>.bf` — 70_sec_paid.js:115-137 tdsCols() col k:"bf", grid at :149; exp 208 |
| `TaxDeductedOwnHands` | `ScheduleTDS3/TDS3onOthThanSalDtls[]/TaxDeductCreditDtls/TaxDeductedOwnHands` | — | INPUT | data-p=`paid.tds3.<i>.dedOwn` — 70_sec_paid.js:115-137 tdsCols() col k:"dedOwn", grid at :149; exp 210 |
| `TaxDeductedIncome` | `ScheduleTDS3/TDS3onOthThanSalDtls[]/TaxDeductCreditDtls/TaxDeductedIncome` | — | INPUT | data-p=`paid.tds3.<i>.dedOthInc` — 70_sec_paid.js:115-137 tdsCols() col k:"dedOthInc", grid at :149; exp 211 |
| `TaxDeductedTDS` | `ScheduleTDS3/TDS3onOthThanSalDtls[]/TaxDeductCreditDtls/TaxDeductedTDS` | — | INPUT | data-p=`paid.tds3.<i>.dedOthTds` — 70_sec_paid.js:115-137 tdsCols() col k:"dedOthTds", grid at :149; exp 212 |
| `TaxClaimedOwnHands` | `ScheduleTDS3/TDS3onOthThanSalDtls[]/TaxDeductCreditDtls/TaxClaimedOwnHands` | R | INPUT | data-p=`paid.tds3.<i>.claimOwn` — 70_sec_paid.js:115-137 tdsCols() col k:"claimOwn", grid at :149; exp 209 |
| `TaxClaimedIncome` | `ScheduleTDS3/TDS3onOthThanSalDtls[]/TaxDeductCreditDtls/TaxClaimedIncome` | — | INPUT | data-p=`paid.tds3.<i>.claimOthInc` — 70_sec_paid.js:115-137 tdsCols() col k:"claimOthInc", grid at :149; exp 213 |
| `TaxClaimedTDS` | `ScheduleTDS3/TDS3onOthThanSalDtls[]/TaxDeductCreditDtls/TaxClaimedTDS` | — | INPUT | data-p=`paid.tds3.<i>.claimOthTds` — 70_sec_paid.js:115-137 tdsCols() col k:"claimOthTds", grid at :149; exp 214 |
| `TaxClaimedSpouseOthPrsnPAN` | `ScheduleTDS3/TDS3onOthThanSalDtls[]/TaxDeductCreditDtls/TaxClaimedSpouseOthPrsnPAN` | — | INPUT | data-p=`paid.tds3.<i>.claimOthPan` — 70_sec_paid.js:115-137 tdsCols() col k:"claimOthPan", grid at :149; exp 215 |
| `SpouseOthPrsnAadhaar` | `ScheduleTDS3/TDS3onOthThanSalDtls[]/TaxDeductCreditDtls/SpouseOthPrsnAadhaar` | — | INPUT | data-p=`paid.tds3.<i>.claimOthAadh` — 70_sec_paid.js:115-137 tdsCols() col k:"claimOthAadh", grid at :149; exp 216 |
| `GrossAmount` | `ScheduleTDS3/TDS3onOthThanSalDtls[]/GrossAmount` | — | INPUT | data-p=`paid.tds3.<i>.gross` — 70_sec_paid.js:115-137 tdsCols() col k:"gross", grid at :149; exp 218 |
| `HeadOfIncome` | `ScheduleTDS3/TDS3onOthThanSalDtls[]/HeadOfIncome` | — | INPUT | data-p=`paid.tds3.<i>.head` — 70_sec_paid.js:115-137 tdsCols() col k:"head", grid at :149; exp 70_sec_paid.js:222 o.HeadOfIncome=hd (defaulted from the section via TDS_HEAD_OF5 when blank) |
| `AmtCarriedFwd` | `ScheduleTDS3/TDS3onOthThanSalDtls[]/AmtCarriedFwd` | R | COMPUTED | engPaid _cf = MAX(0, b/f + deducted − claimed); 70_sec_paid.js:223 o.AmtCarriedFwd=n0(r._cf\|\|0) (screen col t:"calc", 70_sec_paid.js:137) |
| `TotalTDS3OnOthThanSal` | `ScheduleTDS3/TotalTDS3OnOthThanSal` | R | COMPUTED | engPaid column-9 total (P.t2/P.t3); 70_sec_paid.js:233 put(j,"ScheduleTDS3.TotalTDS3OnOthThanSal",...) |

### Schedule TCS — tax collected at source

`ScheduleTCS` — 12 leaves · COMPUTED 2 · INPUT 10

| leaf | schema path | required? | class | evidence |
|---|---|---|---|---|
| `TCSCreditName` | `ScheduleTCS/TCSDetails[]/EmployerOrDeductorOrCollectDetl/TCSCreditName` | — | INPUT | data-p=`paid.tcs.<i>.who` — 70_sec_paid.js:157-169 grid("paid.tcs") col k:"who"; exp 242 |
| `TAN` | `ScheduleTCS/TCSDetails[]/EmployerOrDeductorOrCollectDetl/TAN` | R | INPUT | data-p=`paid.tcs.<i>.tan` — 70_sec_paid.js:157-169 grid("paid.tcs") col k:"tan"; exp 242 |
| `PANofOtherPerson` | `ScheduleTCS/TCSDetails[]/EmployerOrDeductorOrCollectDetl/PANofOtherPerson` | — | INPUT | data-p=`paid.tcs.<i>.othPan` — 70_sec_paid.js:157-169 grid("paid.tcs") col k:"othPan"; exp 201 |
| `DeductedYr` | `ScheduleTCS/TCSDetails[]/DeductedYr` | — | INPUT | data-p=`paid.tcs.<i>.yr` — 70_sec_paid.js:157-169 grid("paid.tcs") col k:"yr"; exp 208 |
| `BroughtFwdTCSAmt` | `ScheduleTCS/TCSDetails[]/BroughtFwdTCSAmt` | — | INPUT | data-p=`paid.tcs.<i>.bf` — 70_sec_paid.js:157-169 grid("paid.tcs") col k:"bf"; exp 238 |
| `TCSAmtCollOwnHands` | `ScheduleTCS/TCSDetails[]/TCSCurrFYDtls/TCSAmtCollOwnHands` | R | INPUT | data-p=`paid.tcs.<i>.collOwn` — 70_sec_paid.js:163 grid("paid.tcs") col k:"collOwn"; exp 246 |
| `TCSAmtCollOthrHands` | `ScheduleTCS/TCSDetails[]/TCSCurrFYDtls/TCSAmtCollOthrHands` | — | INPUT | data-p=`paid.tcs.<i>.collOth` — 70_sec_paid.js:157-169 grid("paid.tcs") col k:"collOth"; exp 246 |
| `TCSAmtCollOwnHands` | `ScheduleTCS/TCSDetails[]/TCSClaimedThisYearDtls/TCSAmtCollOwnHands` | R | INPUT | data-p=`paid.tcs.<i>.claimOwn` — 70_sec_paid.js:165 grid("paid.tcs") col k:"claimOwn" (col 7i); exp 247 |
| `TaxClaimedTCS` | `ScheduleTCS/TCSDetails[]/TCSClaimedThisYearDtls/TCSAmtCollOthrHands/TaxClaimedTCS` | — | INPUT | data-p=`paid.tcs.<i>.claimOth` — 70_sec_paid.js:157-169 grid("paid.tcs") col k:"claimOth"; exp 250 |
| `PANOfOthrPrsn` | `ScheduleTCS/TCSDetails[]/TCSClaimedThisYearDtls/TCSAmtCollOthrHands/PANOfOthrPrsn` | — | INPUT | data-p=`paid.tcs.<i>.claimOthPan` — 70_sec_paid.js:157-169 grid("paid.tcs") col k:"claimOthPan"; exp 251 |
| `AmtCarriedFwd` | `ScheduleTCS/TCSDetails[]/AmtCarriedFwd` | R | COMPUTED | engPaid _cf = MAX(0, b/f + collected − claimed); 70_sec_paid.js:254 o.AmtCarriedFwd=n0(r._cf\|\|0); screen col k:"cf" t:"calc" at :168 |
| `TotalSchTCS` | `ScheduleTCS/TotalSchTCS` | R | COMPUTED | engPaid P.tcs = Schedule TCS col 7(i) total; 70_sec_paid.js:240 put(j,"ScheduleTCS.TotalSchTCS",n0(P.tcs)) |

### Verification — declaration

`Verification` — 6 leaves · COMPUTED 1 · INPUT 5

| leaf | schema path | required? | class | evidence |
|---|---|---|---|---|
| `AssesseeVerName` | `Verification/Declaration/AssesseeVerName` | **R\*** | INPUT | data-p=`ver.name` — 70_sec_verify.js:81 inp("ver.name") [H4]; exp 70_sec_verify.js:111-115 |
| `FatherName` | `Verification/Declaration/FatherName` | **R\*** | INPUT | data-p=`ver.father` — 70_sec_verify.js:83 inp("ver.father") [L4]; exp 70_sec_verify.js:111-115 |
| `AssesseeVerPAN` | `Verification/Declaration/AssesseeVerPAN` | **R\*** | INPUT | data-p=`ver.pan` — 70_sec_verify.js:88 inp("ver.pan") [H7]; exp 70_sec_verify.js:111-115 |
| `Capacity` | `Verification/Declaration/Capacity` | **R\*** | INPUT | data-p=`ver.capacity` — 70_sec_verify.js:85 sel("ver.capacity") [H6]; exp 70_sec_verify.js:111-115 |
| `Place` | `Verification/Declaration/Place` | **R\*** | INPUT | data-p=`ver.place` — 70_sec_verify.js:91 inp("ver.place") [H9]; exp 70_sec_verify.js:111-115 |
| `Date` | `Verification/Declaration/Date` | **R\*** | COMPUTED | system date, untypeable green cell — 70_sec_verify.js:56-61 engVerify() C.dateISO = yy-mm-dd; renderer :95 `<span class="c">`; exp :116 put(d,"Date",sv(C.dateISO)) |

## Counts

| bucket | leaves |
|---|---|
| INPUT | 267 |
| COMPUTED | 178 |
| NA | 0 |
| ORPHAN | 3 |
| **total** | **448** |

Per block:

| block | leaves | INPUT | COMPUTED | NA | ORPHAN |
|---|---|---|---|---|---|
| `PartB-TI` | 37 | 0 | 37 | 0 | 0 |
| `PartB_TTI` | 50 | 12 | 35 | 0 | 3 |
| `ScheduleSI` | 7 | 4 | 3 | 0 | 0 |
| `ScheduleAMT` | 9 | 2 | 7 | 0 | 0 |
| `ScheduleAMTC` | 20 | 2 | 18 | 0 | 0 |
| `SchedulePTI` | 54 | 30 | 24 | 0 | 0 |
| `ScheduleIF` | 12 | 9 | 3 | 0 | 0 |
| `ScheduleTPSA` | 13 | 6 | 7 | 0 | 0 |
| `Schedule115TD` | 20 | 12 | 8 | 0 | 0 |
| `ScheduleFSI` | 27 | 18 | 9 | 0 | 0 |
| `ScheduleTR1` | 13 | 4 | 9 | 0 | 0 |
| `ScheduleFA` | 122 | 112 | 10 | 0 | 0 |
| `ScheduleGST` | 2 | 2 | 0 | 0 | 0 |
| `ScheduleIT` | 5 | 4 | 1 | 0 | 0 |
| `ScheduleTDS2` | 19 | 17 | 2 | 0 | 0 |
| `ScheduleTDS3` | 20 | 18 | 2 | 0 | 0 |
| `ScheduleTCS` | 12 | 10 | 2 | 0 | 0 |
| `Verification` | 6 | 5 | 1 | 0 | 0 |

## ORPHANS — the failure cases

None of the three is marked `required` in the schema, so no *required*-leaf orphan exists in this area.
They are listed first anyway because each one is named by a **Category A** rule in
`sources/ITR-5/CBDT_e-Filing_ITR_5_Validation_Rules_AY_2026-27_V1_0.pdf`
(Category A = blocking: the return is not allowed to be uploaded — `VERIFICATION.md:73-75`, `PIPELINE.md:157`).

All three are the Part B-TTI tail that carries Schedule 115TD's net payable across to the tax ladder.
The form **does** build Schedule 115TD in full (`70_sec_other.js:459-481`, all 20 leaves INPUT/COMPUTED,
field 12 `NetPaybleRefble` computed at `:472`), and the screen even advertises the link —
`70_sec_other.js:347` renders *"12 · Net payable / refundable (10 − 11) → Part B-TTI Sr.12"*.
But `expTax()` (`70_sec_tax.js:482-576`) writes **no 115TD leaf at all** under `PartB_TTI`: the value is
computed, shown on screen, and then dropped on the floor at export.

**1. `PartB_TTI/TaxPaid/NetTaxPayable115TD`** — Part B-TTI Sr.13, "Net tax payable on 115TD income including interest u/s 115TE".
*Should be:* `L101 = Sch115TD.NetPayable` (`books/ITR-5/PARTB_TI_TTI.md:142`), i.e. `S.C.other.td.net12`, which already exists.
*Is:* nothing. Zero `put()` sites. The only occurrence of the string in the whole assembled
`forms/ITR-5/Yukti_ITR5.html` is a comment in the rules encoder (`61_rules_enc_18.js:219-224`) that
**already documents the gap**: *"The PartB_TTI schema does carry TaxPaid.NetTaxPayable115TD, but the owning
exporter (70_sec_tax.js) never populates it — it writes no 115TD leaf under PartB_TTI."* — and for that
reason CBDT rule **762** was filed under "NOT MAPPABLE (reported, not encoded)". So the return both fails
the rule and has the cross-check disabled.

**2. `PartB_TTI/TaxPaid/TaxPayable115TD`** — Part B-TTI Sr.14, "Tax payable u/s 115TD after adjustment of refund at Sl.No.12 (13 − 12)".
*Should be:* `L102 = IF(NetTax_115TD > RefundDue, NetTax_115TD − RefundDue, 0)` (`books/ITR-5/PARTB_TI_TTI.md:143`; `PARTB_TI_TTI.md:194` restates it as `14 = MAX(13 − 12, 0)`).
Both operands are already in hand — `S.C.other.td.net12` and `S.C.int.refund` (exported at `70_sec_tax.js:563`).
*Is:* nothing. CBDT rule **816** (Category A): *"In schedule Part B-TTI, Tax payable u/s 115TD after adjustment of refund if any at Sl.No.14 should be Sl.No.13 less Sl.No.12."*

**3. `PartB_TTI/TaxPaid/NetRefundAdjust`** — Part B-TTI Sr.15, "Net refund after adjustment as per Sl.No.14 (12 − 13)".
*Should be:* `L103 = IF(RefundDue > NetTax_115TD, RefundDue − NetTax_115TD, 0)` (`books/ITR-5/PARTB_TI_TTI.md:144`; `:194` — `15 = MAX(12 − 13, 0)`).
*Is:* nothing — **zero occurrences** of the string `NetRefundAdjust` anywhere in `forms/ITR-5/Yukti_ITR5.html` or in `forms/ITR-5/src/`.
CBDT rule **839** (Category A): *"In schedule Part B-TTI, Sl.No.15 Net refund after adjustment as per Sl.No.14 is not equal to Sl.No.12 less Sl.No.13."*

**Blast radius.** A return with no Schedule 115TD is unaffected (all three leaves are optional and would be
absent anyway). A return that *does* file Schedule 115TD — a trust/institution taxed on accreted income —
is blocked at upload on all three counts, and the refund figure at Sr.12 is never reduced by the 115TD
liability, so the JSON also overstates the refund due. The fix is four lines in `expTax()` reading
`S.C.other.td.net12` alongside the existing `I.refund`; the schema caps all three at `minimum: 0`, so each
needs a `MAX(0, …)` exactly as the book states. Re-enabling CBDT rule 762 in `61_rules_enc_18.js` follows.


## Notes on the non-orphan buckets

**Why NA is zero.** Every one of the other 445 leaves is a leaf ITR-5 genuinely files for this assessee class.
None of the 18 assigned blocks is other-form-only, portal/AIS-filled or hidden-row-excluded, so no leaf in this
area earns an NA. (The nearest thing to an exclusion is `ScheduleFSI`/`ScheduleTR1`/`ScheduleFA`, which
`expForeign()` skips entirely for a non-resident — `70_sec_foreign.js:369` `if(res==="NRI")return;`, per
`books/ITR-5/TR_FA.md:13`, CBDT rule 774 "Schedule TR is not applicable for non resident". That is a per-return
gate on an otherwise fully built block, not a leaf that has no home.)

**`Surcharge25ofSIBeforeMarginal` deliberately equals `Surcharge25ofSI`.** `70_sec_tax.js:534-535` writes
`n0(T.surI)` to both. This is not a copy-paste slip: marginal relief is computed at `:227-233` and subtracted
only from `surIIraw` (`surII = MAX(0, surIIraw − mr)`), while `surI` is the flat statutory 25% on 115BBE income
(`:212`) which marginal relief never touches. The companion pair at `:536-537` does add `mr` back, as expected.

**Schedule TR rows are generated, not typed.** Five of the six `ScheduleTR[]` leaves are COMPUTED because
`engForeign` builds `C.trRows` from the Schedule FSI countries; only `ReliefClaimedUsSection` remains a live
field (re-rendered inside the TR table at `70_sec_foreign.js:172`). The CBDT utility ships those cells as typed
entries (`books/ITR-5/TR_FA.md:62`), so a filer with tax paid abroad but no FSI-head income has no way to add a
TR-only country row. Every leaf still has a home, so this is not an orphan — flagging it as a design difference
worth a decision, not a defect.

**Where the INPUT concentration sits.** 112 of the 267 INPUT leaves are Schedule FA, whose ten grids
(`fa.a1`…`fa.g`, `70_sec_foreign.js:194-352`) use the schema leaf names verbatim as their column keys, so the
`data-p` path is literally `fa.<table>.<row>.<SchemaLeafName>`. Grid column counts match the schema arity exactly
in all ten tables (10/11/11/7/13/11/11/12/16/10 columns + the derived `CountryName` = 122 leaves).
