# ITR-5 · LEAF-COVERAGE CHECK — AREA `bp`

Blocks audited: `CorpScheduleBP` (all nested) · `ScheduleDPM` · `ScheduleDOA` · `ScheduleDEP` · `ScheduleDCG` · `ScheduleESR` · `ScheduleICDS`

Schema: `sources/ITR-5/ITR-5_2026_Main_V1_1_schema.json` · Form: `forms/ITR-5/Yukti_ITR5.html` (bp body verbatim from `forms/ITR-5/src/70_sec_bp.js`, verified byte-identical).

## Verdict

**394 schema leaves · 234 INPUT · 160 COMPUTED · 0 NA · 0 ORPHAN.** No required-leaf orphans. No optional-leaf orphans.

Every leaf was additionally proved reachable **empirically**: a max-fill state that touches every `data-p` in the section was injected into the real form and `buildReturn()` was called; the resulting JSON contains **394 of 394** leaves and **0 extra** keys, and `jsonschema` Draft-4 reports **0 errors inside these seven blocks**.

Two defects were found that are *not* leaf orphans but should still be fixed — see **Findings beyond the leaf census** at the end. One (DOA 3b) corrupts exported depreciation figures.

## Counts

| bucket | count |
|---|---:|
| INPUT | 234 |
| COMPUTED | 160 |
| NA | 0 |
| ORPHAN | 0 |
| **total** | **394** |

| block | leaves | INPUT | COMPUTED | NA | ORPHAN |
|---|---:|---:|---:|---:|---:|
| `CorpScheduleBP` | 132 | 95 | 37 | 0 | 0 |
| `ScheduleDPM` | 76 | 46 | 30 | 0 | 0 |
| `ScheduleDOA` | 98 | 55 | 43 | 0 | 0 |
| `ScheduleDEP` | 13 | 0 | 13 | 0 | 0 |
| `ScheduleDCG` | 13 | 0 | 13 | 0 | 0 |
| `ScheduleESR` | 30 | 18 | 12 | 0 | 0 |
| `ScheduleICDS` | 32 | 20 | 12 | 0 | 0 |

Requiredness: **105** leaves are unconditionally required (marked **YES** below — the parent chain is required all the way to the ITR5 root, which only `CorpScheduleBP` is); **216** are required only *within an optional parent* (marked yes&dagger; — they bind only when that parent object is emitted); **73** are optional.

## ORPHANS

### Required-leaf ORPHANs

**NONE.** All 105 unconditionally-required leaves and all 216 conditionally-required leaves have a home.

### Other ORPHANs

**NONE.** All 73 optional leaves have a home.

Proof of the negative, three independent ways:

1. **Static** — every schema leaf has a matching `put()` target in `expBp()` (`forms/ITR-5/src/70_sec_bp.js:650-942`); the only three without a literal `put()` path (`OtherExmptIncDtls[]/OperatingRevenueName`, `OtherExmptIncDtls[]/OperatingRevenueAmt`, `DedUs35ADSubSec5Dtls[]/DedUs35ADSubSec5`) are written as object literals inside the two array `.map()`s at `:684` and `:775`.
2. **Value-source** — every `S.bp.*` key read by `expBp()` resolves to a rendered `data-p` field, and every `S.C.bp.*` / `S.C.{dpm,doa,dep,dcg,esr,icds}.*` key read by `expBp()` is assigned by `engBp()` (`:205-374`). Neither set has a dangling member, so no leaf is pinned to a permanently-zero source.
3. **Empirical** — max-fill run emits 394/394 leaves (see Verdict).

## Leaf table

`required?`: **YES** = unconditionally required · yes&dagger; = required if its (optional) parent object is present · no = optional.  
Line numbers are `forms/ITR-5/src/70_sec_bp.js`.

### `CorpScheduleBP` — 132 leaves

| leaf | schema path | required? | class | evidence |
|---|---|---|---|---|
| `ProfBfrTaxPL` | `CorpScheduleBP/BusinessIncOthThanSpec/ProfBfrTaxPL` | **YES** | INPUT | data-p `bp.pbt` — A1 `inpN("bp.pbt")` 70_sec_bp.js:390; engBp `K5=R(nb("pbt"))`; put :656 |
| `NetPLFromSpecBus` | `CorpScheduleBP/BusinessIncOthThanSpec/NetPLFromSpecBus` | **YES** | INPUT | data-p `bp.nplSpec` — A2a `inpN("bp.nplSpec")` :391; engBp `_2a=sgb("nplSpec")`; put :657 |
| `NetProfLossSpecifiedBus` | `CorpScheduleBP/BusinessIncOthThanSpec/NetProfLossSpecifiedBus` | **YES** | INPUT | data-p `bp.nplSpecified` — A2b `inpN("bp.nplSpecified")` :392; engBp `_2b=sgb("nplSpecified")`; put :658 |
| `HouseProperty` | `CorpScheduleBP/BusinessIncOthThanSpec/IncRecCredPLOthHeadDtls/HouseProperty` | **YES** | INPUT | data-p `bp.a3a` — put 70_sec_bp.js:659 |
| `CapitalGains` | `CorpScheduleBP/BusinessIncOthThanSpec/IncRecCredPLOthHeadDtls/CapitalGains` | **YES** | INPUT | data-p `bp.a3b` — put 70_sec_bp.js:660 |
| `OtherSources` | `CorpScheduleBP/BusinessIncOthThanSpec/IncRecCredPLOthHeadDtls/OtherSources` | **YES** | COMPUTED | engBp(): `a3c = R(nb("a3ci")+nb("a3cii"))`; put 70_sec_bp.js:661 |
| `Dividend` | `CorpScheduleBP/BusinessIncOthThanSpec/IncRecCredPLOthHeadDtls/Dividend` | **YES** | INPUT | data-p `bp.a3ci` — put 70_sec_bp.js:662 |
| `OtherThanDividend` | `CorpScheduleBP/BusinessIncOthThanSpec/IncRecCredPLOthHeadDtls/OtherThanDividend` | **YES** | INPUT | data-p `bp.a3cii` — put 70_sec_bp.js:663 |
| `UnderSec115BBF` | `CorpScheduleBP/BusinessIncOthThanSpec/IncRecCredPLOthHeadDtls/UnderSec115BBF` | **YES** | INPUT | data-p `bp.a3d` — put 70_sec_bp.js:664 |
| `UnderSec115BBG` | `CorpScheduleBP/BusinessIncOthThanSpec/IncRecCredPLOthHeadDtls/UnderSec115BBG` | **YES** | INPUT | data-p `bp.a3e` — put 70_sec_bp.js:665 |
| `UnderSec115BBH` | `CorpScheduleBP/BusinessIncOthThanSpec/IncRecCredPLOthHeadDtls/UnderSec115BBH` | no | INPUT | data-p `bp.a3f` — put 70_sec_bp.js:666 |
| `PLUs44sChapXIIGOthrUs115B` | `CorpScheduleBP/BusinessIncOthThanSpec/PLUs44sChapXIIGOthrUs115B` | **YES** | INPUT | data-p `bp.pl44b` — put 70_sec_bp.js:673 |
| `ProfitLossUs44AD` | `CorpScheduleBP/BusinessIncOthThanSpec/ProfitLossInclRefrdSec/ProfitLossUs44AD` | **YES** | INPUT | data-p `bp.p44AD` — put 70_sec_bp.js:668 |
| `ProfitLossUs44ADA` | `CorpScheduleBP/BusinessIncOthThanSpec/ProfitLossInclRefrdSec/ProfitLossUs44ADA` | **YES** | INPUT | data-p `bp.p44ADA` — put 70_sec_bp.js:668 |
| `ProfitLossUs44AE` | `CorpScheduleBP/BusinessIncOthThanSpec/ProfitLossInclRefrdSec/ProfitLossUs44AE` | **YES** | INPUT | data-p `bp.p44AE` — put 70_sec_bp.js:669 |
| `ProfitLossUs44B` | `CorpScheduleBP/BusinessIncOthThanSpec/ProfitLossInclRefrdSec/ProfitLossUs44B` | **YES** | INPUT | data-p `bp.p44B` — put 70_sec_bp.js:669 |
| `ProfitLossUs44BB` | `CorpScheduleBP/BusinessIncOthThanSpec/ProfitLossInclRefrdSec/ProfitLossUs44BB` | **YES** | INPUT | data-p `bp.p44BB` — put 70_sec_bp.js:670 |
| `ProfitLossUs44BBA` | `CorpScheduleBP/BusinessIncOthThanSpec/ProfitLossInclRefrdSec/ProfitLossUs44BBA` | **YES** | INPUT | data-p `bp.p44BBA` — put 70_sec_bp.js:670 |
| `ProfitLossUs44BBC` | `CorpScheduleBP/BusinessIncOthThanSpec/ProfitLossInclRefrdSec/ProfitLossUs44BBC` | **YES** | INPUT | data-p `bp.p44BBC` — put 70_sec_bp.js:671 |
| `ProfitLossUs44BBD` | `CorpScheduleBP/BusinessIncOthThanSpec/ProfitLossInclRefrdSec/ProfitLossUs44BBD` | **YES** | INPUT | data-p `bp.p44BBD` — put 70_sec_bp.js:671 |
| `ProfitLossUs44DA` | `CorpScheduleBP/BusinessIncOthThanSpec/ProfitLossInclRefrdSec/ProfitLossUs44DA` | **YES** | INPUT | data-p `bp.p44DA` — put 70_sec_bp.js:672 |
| `FirstSchITActOthr115B` | `CorpScheduleBP/BusinessIncOthThanSpec/ProfitLossInclRefrdSec/FirstSchITActOthr115B` | **YES** | INPUT | data-p `bp.pFirstSch` — put 70_sec_bp.js:672 |
| `TotalProfitFrmActCvrd` | `CorpScheduleBP/BusinessIncOthThanSpec/TotalProfitFrmActCvrd` | **YES** | COMPUTED | engBp(): `_4c = Math.max(0, R(nb("r7")+nb("r7A")+nb("r7B1")+nb("r7B1A")+nb("r8")))`; put 70_sec_bp.js:674 |
| `ProfitFrmActCvrdUndrRule7` | `CorpScheduleBP/BusinessIncOthThanSpec/ProfitFrmActCvrd/ProfitFrmActCvrdUndrRule7` | **YES** | INPUT | data-p `bp.r7` — put 70_sec_bp.js:675 |
| `ProfitFrmActCvrdUndrRule7A` | `CorpScheduleBP/BusinessIncOthThanSpec/ProfitFrmActCvrd/ProfitFrmActCvrdUndrRule7A` | **YES** | INPUT | data-p `bp.r7A` — put 70_sec_bp.js:676 |
| `ProfitFrmActCvrdUndrRule7B1` | `CorpScheduleBP/BusinessIncOthThanSpec/ProfitFrmActCvrd/ProfitFrmActCvrdUndrRule7B1` | **YES** | INPUT | data-p `bp.r7B1` — put 70_sec_bp.js:677 |
| `ProfitFrmActCvrdUndrRule7B1A` | `CorpScheduleBP/BusinessIncOthThanSpec/ProfitFrmActCvrd/ProfitFrmActCvrdUndrRule7B1A` | **YES** | INPUT | data-p `bp.r7B1A` — put 70_sec_bp.js:678 |
| `ProfitFrmActCvrdUndrRule8` | `CorpScheduleBP/BusinessIncOthThanSpec/ProfitFrmActCvrd/ProfitFrmActCvrdUndrRule8` | **YES** | INPUT | data-p `bp.r8` — put 70_sec_bp.js:679 |
| `FirmShareInc` | `CorpScheduleBP/BusinessIncOthThanSpec/IncCredPL/FirmShareInc` | **YES** | INPUT | data-p `bp.a5a` — put 70_sec_bp.js:680 |
| `AOPBOISharInc` | `CorpScheduleBP/BusinessIncOthThanSpec/IncCredPL/AOPBOISharInc` | **YES** | INPUT | data-p `bp.a5b` — put 70_sec_bp.js:681 |
| `OperatingDividendName` | `CorpScheduleBP/BusinessIncOthThanSpec/IncCredPL/OtherExmptIncDtl/OperatingDividendName` | yes† | COMPUTED | constant `"Dividend"` — put 70_sec_bp.js:682 |
| `OperatingDividendAmt` | `CorpScheduleBP/BusinessIncOthThanSpec/IncCredPL/OtherExmptIncDtl/OperatingDividendAmt` | yes† | INPUT | data-p `bp.divExempt` — put 70_sec_bp.js:683 |
| `OperatingRevenueName` | `CorpScheduleBP/BusinessIncOthThanSpec/IncCredPL/OtherExmptIncDtl/OtherExmptIncDtls[]/OperatingRevenueName` | no | INPUT | data-p `bp.othExempt.<i>.name` — grid("bp.othExempt",…) 70_sec_bp.js:417; object literal 70_sec_bp.js:684 |
| `OperatingRevenueAmt` | `CorpScheduleBP/BusinessIncOthThanSpec/IncCredPL/OtherExmptIncDtl/OtherExmptIncDtls[]/OperatingRevenueAmt` | no | INPUT | data-p `bp.othExempt.<i>.amt` — grid("bp.othExempt",…) 70_sec_bp.js:417; object literal 70_sec_bp.js:684 |
| `OthExempInc` | `CorpScheduleBP/BusinessIncOthThanSpec/IncCredPL/OthExempInc` | **YES** | COMPUTED | engBp(): `_5c = R(nb("divExempt")+othExemptTot)`; put 70_sec_bp.js:686 |
| `TotExempInc` | `CorpScheduleBP/BusinessIncOthThanSpec/IncCredPL/TotExempInc` | **YES** | COMPUTED | engBp(): `_5d = R(nb("a5a")+nb("a5b")+_5c)`; put 70_sec_bp.js:687 |
| `IncCredPLNotChargable` | `CorpScheduleBP/BusinessIncOthThanSpec/IncCredPLNotChargable` | no | INPUT | data-p `bp.a5A` — put 70_sec_bp.js:688 |
| `BalancePLOthThanSpecBus` | `CorpScheduleBP/BusinessIncOthThanSpec/BalancePLOthThanSpecBus` | **YES** | COMPUTED | engBp(): `_6 = S.C.bp.a._6`; put 70_sec_bp.js:689 |
| `HouseProperty` | `CorpScheduleBP/BusinessIncOthThanSpec/ExpDebToPLOthHeadDtls/HouseProperty` | **YES** | INPUT | data-p `bp.e7a` — put 70_sec_bp.js:690 |
| `CapitalGains` | `CorpScheduleBP/BusinessIncOthThanSpec/ExpDebToPLOthHeadDtls/CapitalGains` | **YES** | INPUT | data-p `bp.e7b` — put 70_sec_bp.js:691 |
| `OtherSources` | `CorpScheduleBP/BusinessIncOthThanSpec/ExpDebToPLOthHeadDtls/OtherSources` | **YES** | INPUT | data-p `bp.e7c` — put 70_sec_bp.js:692 |
| `UnderSec115BBF` | `CorpScheduleBP/BusinessIncOthThanSpec/ExpDebToPLOthHeadDtls/UnderSec115BBF` | **YES** | INPUT | data-p `bp.e7d` — put 70_sec_bp.js:693 |
| `UnderSec115BBG` | `CorpScheduleBP/BusinessIncOthThanSpec/ExpDebToPLOthHeadDtls/UnderSec115BBG` | **YES** | INPUT | data-p `bp.e7e` — put 70_sec_bp.js:694 |
| `UnderSec115BBH` | `CorpScheduleBP/BusinessIncOthThanSpec/ExpDebToPLOthHeadDtls/UnderSec115BBH` | no | INPUT | data-p `bp.e7f` — put 70_sec_bp.js:695 |
| `ExpDebToPLExemptInc` | `CorpScheduleBP/BusinessIncOthThanSpec/ExpDebToPLExemptInc` | **YES** | INPUT | data-p `bp.e8a` — put 70_sec_bp.js:696 |
| `ExpDebToPLExemptIncDisAllwUs14A` | `CorpScheduleBP/BusinessIncOthThanSpec/ExpDebToPLExemptIncDisAllwUs14A` | **YES** | INPUT | data-p `bp.e8b` — put 70_sec_bp.js:697 |
| `TotExpDebPL` | `CorpScheduleBP/BusinessIncOthThanSpec/TotExpDebPL` | **YES** | COMPUTED | engBp(): `_9 = R(nb("e7a")+nb("e7b")+nb("e7c")+nb("e7d")+nb("e7e")+nb("e7f")+nb("e8a")+nb("e8b"))`; put 70_sec_bp.js:698 |
| `AdjustedPLOthThanSpecBus` | `CorpScheduleBP/BusinessIncOthThanSpec/AdjustedPLOthThanSpecBus` | **YES** | COMPUTED | engBp(): `_10 = R(_6+_9)`; put 70_sec_bp.js:699 |
| `DepreciationDebPLCosAct` | `CorpScheduleBP/BusinessIncOthThanSpec/DepreciationDebPLCosAct` | **YES** | INPUT | data-p `bp.depDebPL` — put 70_sec_bp.js:700 |
| `DepreciationAllowUs32_1_ii` | `CorpScheduleBP/BusinessIncOthThanSpec/DepreciationAllowITAct32/DepreciationAllowUs32_1_ii` | **YES** | COMPUTED | engBp(): `_12i = R(dep.total>0?dep.total:0)`; put 70_sec_bp.js:701 |
| `DepreciationAllowUs32_1_i` | `CorpScheduleBP/BusinessIncOthThanSpec/DepreciationAllowITAct32/DepreciationAllowUs32_1_i` | **YES** | INPUT | data-p `bp.dep32_1_i` — put 70_sec_bp.js:702 |
| `TotDeprAllowITAct` | `CorpScheduleBP/BusinessIncOthThanSpec/DepreciationAllowITAct32/TotDeprAllowITAct` | **YES** | COMPUTED | engBp(): `_12iii = R(_12i+_12ii)`; put 70_sec_bp.js:703 |
| `AdjustPLAfterDeprOthSpecInc` | `CorpScheduleBP/BusinessIncOthThanSpec/AdjustPLAfterDeprOthSpecInc` | **YES** | COMPUTED | engBp(): `_13 = R(_10+_11-_12iii)`; put 70_sec_bp.js:704 |
| `AmtDebPLDisallowUs36` | `CorpScheduleBP/BusinessIncOthThanSpec/AmtDebPLDisallowUs36` | **YES** | INPUT | data-p `bp.d14` — put 70_sec_bp.js:705 |
| `AmtDebPLDisallowUs37` | `CorpScheduleBP/BusinessIncOthThanSpec/AmtDebPLDisallowUs37` | **YES** | INPUT | data-p `bp.d15` — put 70_sec_bp.js:706 |
| `AmtDebPLDisallowUs40` | `CorpScheduleBP/BusinessIncOthThanSpec/AmtDebPLDisallowUs40` | **YES** | INPUT | data-p `bp.d16` — put 70_sec_bp.js:707 |
| `AmtDebPLDisallowUs40A` | `CorpScheduleBP/BusinessIncOthThanSpec/AmtDebPLDisallowUs40A` | **YES** | INPUT | data-p `bp.d17` — put 70_sec_bp.js:708 |
| `AmtDebPLDisallowUs43B` | `CorpScheduleBP/BusinessIncOthThanSpec/AmtDebPLDisallowUs43B` | **YES** | INPUT | data-p `bp.d18` — put 70_sec_bp.js:709 |
| `InterestDisAllowUs23SMEAct` | `CorpScheduleBP/BusinessIncOthThanSpec/InterestDisAllowUs23SMEAct` | **YES** | INPUT | data-p `bp.d19` — put 70_sec_bp.js:710 |
| `DeemIncUs41` | `CorpScheduleBP/BusinessIncOthThanSpec/DeemIncUs41` | **YES** | INPUT | data-p `bp.deem41` — put 70_sec_bp.js:711 |
| `DeemIncUs3380HHD80IA` | `CorpScheduleBP/BusinessIncOthThanSpec/DeemIncUs3380HHD80IA` | **YES** | COMPUTED | engBp(): `_21 = S.C.bp.a._21`; put 70_sec_bp.js:712 |
| `DeemIncUs32AC` | `CorpScheduleBP/BusinessIncOthThanSpec/DeemIncUs32AC` | no | INPUT | data-p `bp.d21_32AC` — put 70_sec_bp.js:713 |
| `DeemIncUs32AD` | `CorpScheduleBP/BusinessIncOthThanSpec/DeemIncUs32AD` | no | INPUT | data-p `bp.d21_32AD` — put 70_sec_bp.js:714 |
| `DeemIncUs33AB` | `CorpScheduleBP/BusinessIncOthThanSpec/DeemIncUs33AB` | no | INPUT | data-p `bp.d21_33AB` — put 70_sec_bp.js:715 |
| `DeemIncUs33ABA` | `CorpScheduleBP/BusinessIncOthThanSpec/DeemIncUs33ABA` | no | INPUT | data-p `bp.d21_33ABA` — put 70_sec_bp.js:716 |
| `DeemIncUs35ABA` | `CorpScheduleBP/BusinessIncOthThanSpec/DeemIncUs35ABA` | no | INPUT | data-p `bp.d21_35ABA` — put 70_sec_bp.js:717 |
| `DeemIncUs35ABB` | `CorpScheduleBP/BusinessIncOthThanSpec/DeemIncUs35ABB` | no | INPUT | data-p `bp.d21_35ABB` — put 70_sec_bp.js:718 |
| `DeemIncUs35AC` | `CorpScheduleBP/BusinessIncOthThanSpec/DeemIncUs35AC` | no | INPUT | data-p `bp.d21_35AC` — put 70_sec_bp.js:719 |
| `DeemIncUs40A3A` | `CorpScheduleBP/BusinessIncOthThanSpec/DeemIncUs40A3A` | no | INPUT | data-p `bp.d21_40A3A` — put 70_sec_bp.js:720 |
| `DeemIncUs33AC` | `CorpScheduleBP/BusinessIncOthThanSpec/DeemIncUs33AC` | no | INPUT | data-p `bp.d21_33AC` — put 70_sec_bp.js:721 |
| `DeemIncUs72A` | `CorpScheduleBP/BusinessIncOthThanSpec/DeemIncUs72A` | no | INPUT | data-p `bp.d21_72A` — put 70_sec_bp.js:722 |
| `DeemIncUs80HHD` | `CorpScheduleBP/BusinessIncOthThanSpec/DeemIncUs80HHD` | no | INPUT | data-p `bp.d21_80HHD` — put 70_sec_bp.js:723 |
| `DeemIncUs80IA` | `CorpScheduleBP/BusinessIncOthThanSpec/DeemIncUs80IA` | no | INPUT | data-p `bp.d21_80IA` — put 70_sec_bp.js:724 |
| `DeemIncUs43CA` | `CorpScheduleBP/BusinessIncOthThanSpec/DeemIncUs43CA` | **YES** | INPUT | data-p `bp.d22` — put 70_sec_bp.js:725 |
| `OthItemDisallowUs28To44DB` | `CorpScheduleBP/BusinessIncOthThanSpec/OthItemDisallowUs28To44DB` | **YES** | INPUT | data-p `bp.d23` — put 70_sec_bp.js:726 |
| `AnyOthIncNotInclInExpDisallowPL` | `CorpScheduleBP/BusinessIncOthThanSpec/AnyOthIncNotInclInExpDisallowPL` | **YES** | COMPUTED | engBp(): `_24 = R(nb("i24a")+nb("i24b")+nb("i24c")+nb("i24d")+e24e)`; put 70_sec_bp.js:727 |
| `SalaryExpDisallowPL` | `CorpScheduleBP/BusinessIncOthThanSpec/SalaryExpDisallowPL` | **YES** | INPUT | data-p `bp.i24a` — put 70_sec_bp.js:728 |
| `BonusExpDisallowPL` | `CorpScheduleBP/BusinessIncOthThanSpec/BonusExpDisallowPL` | **YES** | INPUT | data-p `bp.i24b` — put 70_sec_bp.js:729 |
| `CommissionExpDisallowPL` | `CorpScheduleBP/BusinessIncOthThanSpec/CommissionExpDisallowPL` | **YES** | INPUT | data-p `bp.i24c` — put 70_sec_bp.js:730 |
| `InterestExpDisallowPL` | `CorpScheduleBP/BusinessIncOthThanSpec/InterestExpDisallowPL` | **YES** | INPUT | data-p `bp.i24d` — put 70_sec_bp.js:731 |
| `OthersExpDisallowPL` | `CorpScheduleBP/BusinessIncOthThanSpec/OthersExpDisallowPL` | **YES** | INPUT | data-p `bp.i24e` — A24e `inp("bp.i24e",{n:1})` :449; engBp `e24e=R(nb("i24e")\|\|esr.shortfall)` (ESR shortfall floor, rule 256); put :731 |
| `IncProfDecLossAccICDSAdj` | `CorpScheduleBP/BusinessIncOthThanSpec/IncProfDecLossAccICDSAdj` | **YES** | INPUT | data-p `bp.i25` — A25 `inp("bp.i25",{n:1})` :452; engBp `_25=MAX(0, nb("i25")+icds.totInc)` (OI stock-deviation typed + Sch ICDS added); put :732 |
| `TotAfterAddToPLDeprOthSpecInc` | `CorpScheduleBP/BusinessIncOthThanSpec/TotAfterAddToPLDeprOthSpecInc` | **YES** | COMPUTED | engBp(): `_26 = R(nb("d14")+nb("d15")+nb("d16")+nb("d17")+nb("d18")+nb("d19")+_20+_21+nb("d22")+nb("d23")+_24+_2`; put 70_sec_bp.js:734 |
| `DeductUs32_1_iii` | `CorpScheduleBP/BusinessIncOthThanSpec/DeductUs32_1_iii` | **YES** | INPUT | data-p `bp.d27` — put 70_sec_bp.js:735 |
| `DebPLUs35ExcessAmt` | `CorpScheduleBP/BusinessIncOthThanSpec/DebPLUs35ExcessAmt` | **YES** | COMPUTED | engBp(): `_28 = R(esr.totExcess)`; put 70_sec_bp.js:736 |
| `AmtDisallUs40NowAllow` | `CorpScheduleBP/BusinessIncOthThanSpec/AmtDisallUs40NowAllow` | **YES** | INPUT | data-p `bp.d29` — put 70_sec_bp.js:737 |
| `AmtDisallUs43BNowAllow` | `CorpScheduleBP/BusinessIncOthThanSpec/AmtDisallUs43BNowAllow` | **YES** | INPUT | data-p `bp.d30` — put 70_sec_bp.js:738 |
| `AnyOthAmtAllDeduct` | `CorpScheduleBP/BusinessIncOthThanSpec/AnyOthAmtAllDeduct` | **YES** | INPUT | data-p `bp.d31` — put 70_sec_bp.js:739 |
| `DecProfIncLossAccICDSAdj` | `CorpScheduleBP/BusinessIncOthThanSpec/DecProfIncLossAccICDSAdj` | **YES** | INPUT | data-p `bp.i32` — A32 `inp("bp.i32",{n:1})` :461; engBp `_32=MAX(0, nb("i32")+icds.totDec)`; put :739 |
| `TotDeductionAmts` | `CorpScheduleBP/BusinessIncOthThanSpec/TotDeductionAmts` | **YES** | COMPUTED | engBp(): `_33 = R(_27+_28+nb("d29")+nb("d30")+nb("d31")+_32)`; put 70_sec_bp.js:741 |
| `PLAftAdjDedBusOthThanSpec` | `CorpScheduleBP/BusinessIncOthThanSpec/PLAftAdjDedBusOthThanSpec` | **YES** | COMPUTED | engBp(): `_34 = R(_13+_26-_33)`; put 70_sec_bp.js:742 |
| `Section44AD` | `CorpScheduleBP/BusinessIncOthThanSpec/DeemedProfitBusUs/Section44AD` | **YES** | INPUT | data-p `bp.d35_44AD` — put 70_sec_bp.js:744 |
| `Section44ADA` | `CorpScheduleBP/BusinessIncOthThanSpec/DeemedProfitBusUs/Section44ADA` | **YES** | INPUT | data-p `bp.d35_44ADA` — put 70_sec_bp.js:744 |
| `Section44AE` | `CorpScheduleBP/BusinessIncOthThanSpec/DeemedProfitBusUs/Section44AE` | **YES** | INPUT | data-p `bp.d35_44AE` — put 70_sec_bp.js:745 |
| `Section44B` | `CorpScheduleBP/BusinessIncOthThanSpec/DeemedProfitBusUs/Section44B` | **YES** | INPUT | data-p `bp.d35_44B` — put 70_sec_bp.js:745 |
| `Section44BB` | `CorpScheduleBP/BusinessIncOthThanSpec/DeemedProfitBusUs/Section44BB` | **YES** | INPUT | data-p `bp.d35_44BB` — put 70_sec_bp.js:746 |
| `Section44BBA` | `CorpScheduleBP/BusinessIncOthThanSpec/DeemedProfitBusUs/Section44BBA` | **YES** | INPUT | data-p `bp.d35_44BBA` — put 70_sec_bp.js:746 |
| `Section44BBC` | `CorpScheduleBP/BusinessIncOthThanSpec/DeemedProfitBusUs/Section44BBC` | **YES** | INPUT | data-p `bp.d35_44BBC` — put 70_sec_bp.js:747 |
| `Section44BBD` | `CorpScheduleBP/BusinessIncOthThanSpec/DeemedProfitBusUs/Section44BBD` | **YES** | INPUT | data-p `bp.d35_44BBD` — put 70_sec_bp.js:747 |
| `Section44DA` | `CorpScheduleBP/BusinessIncOthThanSpec/DeemedProfitBusUs/Section44DA` | **YES** | INPUT | data-p `bp.d35_44DA` — put 70_sec_bp.js:748 |
| `FirstSchTActOther` | `CorpScheduleBP/BusinessIncOthThanSpec/DeemedProfitBusUs/FirstSchTActOther` | **YES** | INPUT | data-p `bp.d35_FirstSch` — put 70_sec_bp.js:748 |
| `TotDeemedProfitBusUs` | `CorpScheduleBP/BusinessIncOthThanSpec/DeemedProfitBusUs/TotDeemedProfitBusUs` | **YES** | COMPUTED | engBp(): `_35 = S.C.bp.a._35`; put 70_sec_bp.js:749 |
| `NetPLAftAdjBusOthThanSpec` | `CorpScheduleBP/BusinessIncOthThanSpec/NetPLAftAdjBusOthThanSpec` | **YES** | COMPUTED | engBp(): `_36 = R(_34+_35)`; put 70_sec_bp.js:750 |
| `NetPLBusOthThanSpec7A7B7C` | `CorpScheduleBP/BusinessIncOthThanSpec/NetPLBusOthThanSpec7A7B7C` | **YES** | COMPUTED | engBp(): `A37 = R(nb("r37a")+nb("r37b")+nb("r37c")+nb("r37d")+nb("r37e")+_37f)`; put 70_sec_bp.js:751 |
| `ChrgblIncUndrRule7` | `CorpScheduleBP/BusinessIncOthThanSpec/ChrgblIncUndrRule7` | **YES** | INPUT | data-p `bp.r37a` — put 70_sec_bp.js:752 |
| `DeemedChrgblIncUndrRule7A` | `CorpScheduleBP/BusinessIncOthThanSpec/DeemedChrgblIncUndrRule7A` | **YES** | INPUT | data-p `bp.r37b` — put 70_sec_bp.js:753 |
| `DeemedChrgblIncUndrRule7B1` | `CorpScheduleBP/BusinessIncOthThanSpec/DeemedChrgblIncUndrRule7B1` | **YES** | INPUT | data-p `bp.r37c` — put 70_sec_bp.js:754 |
| `DeemedChrgblIncUndrRule7B1A` | `CorpScheduleBP/BusinessIncOthThanSpec/DeemedChrgblIncUndrRule7B1A` | **YES** | INPUT | data-p `bp.r37d` — put 70_sec_bp.js:755 |
| `DeemedChrgblIncUndrRule8` | `CorpScheduleBP/BusinessIncOthThanSpec/DeemedChrgblIncUndrRule8` | **YES** | INPUT | data-p `bp.r37e` — put 70_sec_bp.js:756 |
| `IncomeOtherThanRule` | `CorpScheduleBP/BusinessIncOthThanSpec/IncomeOtherThanRule` | **YES** | COMPUTED | engBp(): `_37f = _36`; put 70_sec_bp.js:757 |
| `BalIncDeemedFrmAgri` | `CorpScheduleBP/BusinessIncOthThanSpec/BalIncDeemedFrmAgri` | **YES** | COMPUTED | engBp(): `_38 = Math.max(0, R(_4c - (nb("r37a")+nb("r37b")+nb("r37c")+nb("r37d")+nb("r37e"))))`; put 70_sec_bp.js:758 |
| `NetPLFrmSpecBus` | `CorpScheduleBP/SpecBusinessInc/NetPLFrmSpecBus` | **YES** | COMPUTED | engBp(): `_39 = _2a` — B39 (K139) carries item A2a; untypeable `cell(Bp._39)` :482; put :762 |
| `AdditionUs28to44DB` | `CorpScheduleBP/SpecBusinessInc/AdditionUs28to44DB` | **YES** | INPUT | data-p `bp.s40` — put 70_sec_bp.js:763 |
| `DeductUs28to44DB` | `CorpScheduleBP/SpecBusinessInc/DeductUs28to44DB` | **YES** | INPUT | data-p `bp.s41` — put 70_sec_bp.js:764 |
| `AdjustedPLFrmSpecuBus` | `CorpScheduleBP/SpecBusinessInc/AdjustedPLFrmSpecuBus` | **YES** | COMPUTED | engBp(): `B42 = R(_39+nb("s40")-nb("s41"))`; put 70_sec_bp.js:765 |
| `NetPLFrmSpecifiedBus` | `CorpScheduleBP/IncSpecifiedBusiness/NetPLFrmSpecifiedBus` | **YES** | COMPUTED | engBp(): `_43 = _2b` — C43 (K144) carries item A2b; untypeable `cell(Cp._43)` :489; put :770 |
| `AddSec28to44DB` | `CorpScheduleBP/IncSpecifiedBusiness/AddSec28to44DB` | **YES** | INPUT | data-p `bp.sp44` — put 70_sec_bp.js:770 |
| `DedSec28to44DBOTDedSec35AD` | `CorpScheduleBP/IncSpecifiedBusiness/DedSec28to44DBOTDedSec35AD` | **YES** | INPUT | data-p `bp.sp45` — put 70_sec_bp.js:771 |
| `ProfitLossSpecifiedBusiness` | `CorpScheduleBP/IncSpecifiedBusiness/ProfitLossSpecifiedBusiness` | **YES** | COMPUTED | engBp(): `_46 = R(_43+nb("sp44")-nb("sp45"))`; put 70_sec_bp.js:772 |
| `DedSec35AD` | `CorpScheduleBP/IncSpecifiedBusiness/DedSec35AD` | no | INPUT | data-p `bp.sp47` — C47 `inpN("bp.sp47")` :495 (old regime only); engBp `_47=isNew()?0:R(nb("sp47"))` — BP.md rule 255 bars 35AD(1) in the new regime; put :773 (guarded `if(n0(Cp._47))`) |
| `ProfitLossSpecifiedBusFinal` | `CorpScheduleBP/IncSpecifiedBusiness/ProfitLossSpecifiedBusFinal` | **YES** | COMPUTED | engBp(): `C48 = R(_46-_47)`; put 70_sec_bp.js:774 |
| `DedUs35ADSubSec5` | `CorpScheduleBP/IncSpecifiedBusiness/DedUs35ADSubSec5Dtls[]/DedUs35ADSubSec5` | yes† | INPUT | data-p `bp.clause.0` / `bp.clause.1` — sel(…,BP_35AD5) 70_sec_bp.js:497-498; literal 70_sec_bp.js:775 |
| `IncChrgUnHdProftGain` | `CorpScheduleBP/IncChrgUnHdProftGain` | **YES** | COMPUTED | put 70_sec_bp.js:779  `put(j,"CorpScheduleBP.IncChrgUnHdProftGain",sg(S.C.bp?S.C.bp.d:0));` |
| `LossSetOffOnBusLoss` | `CorpScheduleBP/BusSetoffCurrYr/LossSetOffOnBusLoss` | **YES** | COMPUTED | engBp(): `lossSetOff = Math.abs(Math.min(0, A37))`; put 70_sec_bp.js:783 |
| `IncOfCurYrUnderThatHead` | `CorpScheduleBP/BusSetoffCurrYr/SpeculativeInc/IncOfCurYrUnderThatHead` | yes† | COMPUTED | engBp(): `specInc = Math.max(0, B42)`; put 70_sec_bp.js:785 |
| `BusLossSetoff` | `CorpScheduleBP/BusSetoffCurrYr/SpeculativeInc/BusLossSetoff` | yes† | COMPUTED | engBp(): `specSet = Math.min(lossSetOff, specInc)`; put 70_sec_bp.js:786 |
| `IncOfCurYrAfterSetOff` | `CorpScheduleBP/BusSetoffCurrYr/SpeculativeInc/IncOfCurYrAfterSetOff` | yes† | COMPUTED | engBp(): `specRemain = R(specInc-specSet)`; put 70_sec_bp.js:787 |
| `IncOfCurYrUnderThatHead` | `CorpScheduleBP/BusSetoffCurrYr/SpecifiedInc/IncOfCurYrUnderThatHead` | yes† | COMPUTED | engBp(): `specifiedInc = Math.max(0, C48)`; put 70_sec_bp.js:790 |
| `BusLossSetoff` | `CorpScheduleBP/BusSetoffCurrYr/SpecifiedInc/BusLossSetoff` | yes† | COMPUTED | engBp(): `specifiedSet = Math.min(lossSetOff-specSet, specifiedInc)`; put 70_sec_bp.js:791 |
| `IncOfCurYrAfterSetOff` | `CorpScheduleBP/BusSetoffCurrYr/SpecifiedInc/IncOfCurYrAfterSetOff` | yes† | COMPUTED | engBp(): `specifiedRemain = R(specifiedInc-specifiedSet)`; put 70_sec_bp.js:792 |
| `TotLossSetOffOnBus` | `CorpScheduleBP/BusSetoffCurrYr/TotLossSetOffOnBus` | **YES** | COMPUTED | engBp(): `totSet = R(specSet+specifiedSet)`; put 70_sec_bp.js:794 |
| `LossRemainSetOffOnBus` | `CorpScheduleBP/BusSetoffCurrYr/LossRemainSetOffOnBus` | **YES** | COMPUTED | engBp(): `lossRemain = R(Math.max(0, lossSetOff-totSet))`; put 70_sec_bp.js:795 |

### `ScheduleDPM` — 76 leaves

| leaf | schema path | required? | class | evidence |
|---|---|---|---|---|
| `WDVFirstDay` | `ScheduleDPM/PlantMachinery/Rate15/DepreciationDetail/WDVFirstDay` | yes† | INPUT | data-p `dpm.r15.WDVFirstDay` (blockCol() iN("WDVFirstDay"), 70_sec_bp.js:518-553) |
| `AdjustmentSec115BAC` | `ScheduleDPM/PlantMachinery/Rate15/DepreciationDetail/AdjustmentSec115BAC` | no | INPUT | data-p `dpm.r15.AdjustmentSec115BAC` (blockCol() iN("AdjustmentSec115BAC"), 70_sec_bp.js:518-553) |
| `Total` | `ScheduleDPM/PlantMachinery/Rate15/DepreciationDetail/Total` | no | COMPUTED | bpBlock(): `tot3 = WDVFirstDay + AdjustmentSec115BAC  [F9]` → putDPM/putDOA `put(j,D2+"Total",…)` |
| `AdditionsGrThan180Days` | `ScheduleDPM/PlantMachinery/Rate15/DepreciationDetail/AdditionsGrThan180Days` | yes† | INPUT | data-p `dpm.r15.AdditionsGrThan180Days` (blockCol() iN("AdditionsGrThan180Days"), 70_sec_bp.js:518-553) |
| `RealizationTotalPeriod` | `ScheduleDPM/PlantMachinery/Rate15/DepreciationDetail/RealizationTotalPeriod` | yes† | INPUT | data-p `dpm.r15.RealizationTotalPeriod` (blockCol() iN("RealizationTotalPeriod"), 70_sec_bp.js:518-553) |
| `FullRateDeprAmt` | `ScheduleDPM/PlantMachinery/Rate15/DepreciationDetail/FullRateDeprAmt` | yes† | COMPUTED | bpBlock(): `fullAmt = MAX(0, 3+4−5)  [F12]` → putDPM/putDOA `put(j,D2+"FullRateDeprAmt",…)` |
| `AdditionsLessThan180Days` | `ScheduleDPM/PlantMachinery/Rate15/DepreciationDetail/AdditionsLessThan180Days` | yes† | INPUT | data-p `dpm.r15.AdditionsLessThan180Days` (blockCol() iN("AdditionsLessThan180Days"), 70_sec_bp.js:518-553) |
| `RealizationPeriodDuringYear` | `ScheduleDPM/PlantMachinery/Rate15/DepreciationDetail/RealizationPeriodDuringYear` | yes† | INPUT | data-p `dpm.r15.RealizationPeriodDuringYear` (blockCol() iN("RealizationPeriodDuringYear"), 70_sec_bp.js:518-553) |
| `HalfRateDeprAmt` | `ScheduleDPM/PlantMachinery/Rate15/DepreciationDetail/HalfRateDeprAmt` | yes† | COMPUTED | bpBlock(): `halfAmt = MAX(0, 7−8+MIN(0,3+4−5))  [F15]` → putDPM/putDOA `put(j,D2+"HalfRateDeprAmt",…)` |
| `DepreciationAtFullRate` | `ScheduleDPM/PlantMachinery/Rate15/DepreciationDetail/DepreciationAtFullRate` | yes† | COMPUTED | bpBlock(): `depFull = ROUND(fullAmt*rate/100)  [F16]` → putDPM/putDOA `put(j,D2+"DepreciationAtFullRate",…)` |
| `DepreciationAtHalfRate` | `ScheduleDPM/PlantMachinery/Rate15/DepreciationDetail/DepreciationAtHalfRate` | yes† | COMPUTED | bpBlock(): `depHalf = ROUND(halfAmt*rate/200)  [F17]` → putDPM/putDOA `put(j,D2+"DepreciationAtHalfRate",…)` |
| `AddlnDeprOnGT180DayAdditions` | `ScheduleDPM/PlantMachinery/Rate15/DepreciationDetail/AddlnDeprOnGT180DayAdditions` | no | INPUT | data-p `dpm.r15.AddlnDeprOnGT180DayAdditions` (blockCol() iN("AddlnDeprOnGT180DayAdditions"), 70_sec_bp.js:518-553) |
| `AddlnDeprDuringYearAdditions` | `ScheduleDPM/PlantMachinery/Rate15/DepreciationDetail/AddlnDeprDuringYearAdditions` | no | INPUT | data-p `dpm.r15.AddlnDeprDuringYearAdditions` (blockCol() iN("AddlnDeprDuringYearAdditions"), 70_sec_bp.js:518-553) |
| `AddlnDeprOnLessThan180DayAdditions` | `ScheduleDPM/PlantMachinery/Rate15/DepreciationDetail/AddlnDeprOnLessThan180DayAdditions` | no | INPUT | data-p `dpm.r15.AddlnDeprOnLessThan180DayAdditions` (blockCol() iN("AddlnDeprOnLessThan180DayAdditions"), 70_sec_bp.js:518-553) |
| `TotalDepreciation` | `ScheduleDPM/PlantMachinery/Rate15/DepreciationDetail/TotalDepreciation` | yes† | COMPUTED | bpBlock(): `totDep = 10+11+12+13+14  [F21]` → putDPM/putDOA `put(j,D2+"TotalDepreciation",…)` |
| `DepDisAllowUs38_2` | `ScheduleDPM/PlantMachinery/Rate15/DepreciationDetail/DepDisAllowUs38_2` | yes† | INPUT | data-p `dpm.r15.DepDisAllowUs38_2` (blockCol() iN("DepDisAllowUs38_2"), 70_sec_bp.js:518-553) |
| `NetAggregateDepreciation` | `ScheduleDPM/PlantMachinery/Rate15/DepreciationDetail/NetAggregateDepreciation` | yes† | COMPUTED | bpBlock(): `netAgg = MAX(0, 15−16)  [F23]` → putDPM/putDOA `put(j,D2+"NetAggregateDepreciation",…)` |
| `ProportionateAggDepreciation` | `ScheduleDPM/PlantMachinery/Rate15/DepreciationDetail/ProportionateAggDepreciation` | yes† | INPUT | data-p `dpm.r15.ProportionateAggDepreciation` (blockCol() iN("ProportionateAggDepreciation"), 70_sec_bp.js:518-553) |
| `ExpdrOnTrforSaleAsset` | `ScheduleDPM/PlantMachinery/Rate15/DepreciationDetail/ExpdrOnTrforSaleAsset` | yes† | INPUT | data-p `dpm.r15.ExpdrOnTrforSaleAsset` (blockCol() iN("ExpdrOnTrforSaleAsset"), 70_sec_bp.js:518-553) |
| `CapGainUs50` | `ScheduleDPM/PlantMachinery/Rate15/DepreciationDetail/CapGainUs50` | yes† | INPUT | data-p `dpm.r15.CapGainUs50` (blockCol() iN("CapGainUs50"), 70_sec_bp.js:518-553) |
| `WDVLastDay` | `ScheduleDPM/PlantMachinery/Rate15/DepreciationDetail/WDVLastDay` | yes† | COMPUTED | bpBlock(): `wdvLast = MAX(0, 3+4−5+7−8−15)  [F27]` → putDPM/putDOA `put(j,D2+"WDVLastDay",…)` |
| `WDVFirstDay` | `ScheduleDPM/PlantMachinery/Rate30/DepreciationDetail/WDVFirstDay` | yes† | INPUT | data-p `dpm.r30.WDVFirstDay` (blockCol() iN("WDVFirstDay"), 70_sec_bp.js:518-553) |
| `AdjustmentSec115BAC` | `ScheduleDPM/PlantMachinery/Rate30/DepreciationDetail/AdjustmentSec115BAC` | no | INPUT | data-p `dpm.r30.AdjustmentSec115BAC` (blockCol() iN("AdjustmentSec115BAC"), 70_sec_bp.js:518-553) |
| `Total` | `ScheduleDPM/PlantMachinery/Rate30/DepreciationDetail/Total` | no | COMPUTED | bpBlock(): `tot3 = WDVFirstDay + AdjustmentSec115BAC  [F9]` → putDPM/putDOA `put(j,D2+"Total",…)` |
| `AdditionsGrThan180Days` | `ScheduleDPM/PlantMachinery/Rate30/DepreciationDetail/AdditionsGrThan180Days` | yes† | INPUT | data-p `dpm.r30.AdditionsGrThan180Days` (blockCol() iN("AdditionsGrThan180Days"), 70_sec_bp.js:518-553) |
| `RealizationTotalPeriod` | `ScheduleDPM/PlantMachinery/Rate30/DepreciationDetail/RealizationTotalPeriod` | yes† | INPUT | data-p `dpm.r30.RealizationTotalPeriod` (blockCol() iN("RealizationTotalPeriod"), 70_sec_bp.js:518-553) |
| `FullRateDeprAmt` | `ScheduleDPM/PlantMachinery/Rate30/DepreciationDetail/FullRateDeprAmt` | yes† | COMPUTED | bpBlock(): `fullAmt = MAX(0, 3+4−5)  [F12]` → putDPM/putDOA `put(j,D2+"FullRateDeprAmt",…)` |
| `AdditionsLessThan180Days` | `ScheduleDPM/PlantMachinery/Rate30/DepreciationDetail/AdditionsLessThan180Days` | yes† | INPUT | data-p `dpm.r30.AdditionsLessThan180Days` (blockCol() iN("AdditionsLessThan180Days"), 70_sec_bp.js:518-553) |
| `RealizationPeriodDuringYear` | `ScheduleDPM/PlantMachinery/Rate30/DepreciationDetail/RealizationPeriodDuringYear` | yes† | INPUT | data-p `dpm.r30.RealizationPeriodDuringYear` (blockCol() iN("RealizationPeriodDuringYear"), 70_sec_bp.js:518-553) |
| `HalfRateDeprAmt` | `ScheduleDPM/PlantMachinery/Rate30/DepreciationDetail/HalfRateDeprAmt` | yes† | COMPUTED | bpBlock(): `halfAmt = MAX(0, 7−8+MIN(0,3+4−5))  [F15]` → putDPM/putDOA `put(j,D2+"HalfRateDeprAmt",…)` |
| `DepreciationAtFullRate` | `ScheduleDPM/PlantMachinery/Rate30/DepreciationDetail/DepreciationAtFullRate` | yes† | COMPUTED | bpBlock(): `depFull = ROUND(fullAmt*rate/100)  [F16]` → putDPM/putDOA `put(j,D2+"DepreciationAtFullRate",…)` |
| `DepreciationAtHalfRate` | `ScheduleDPM/PlantMachinery/Rate30/DepreciationDetail/DepreciationAtHalfRate` | yes† | COMPUTED | bpBlock(): `depHalf = ROUND(halfAmt*rate/200)  [F17]` → putDPM/putDOA `put(j,D2+"DepreciationAtHalfRate",…)` |
| `AddlnDeprOnGT180DayAdditions` | `ScheduleDPM/PlantMachinery/Rate30/DepreciationDetail/AddlnDeprOnGT180DayAdditions` | no | INPUT | data-p `dpm.r30.AddlnDeprOnGT180DayAdditions` (blockCol() iN("AddlnDeprOnGT180DayAdditions"), 70_sec_bp.js:518-553) |
| `AddlnDeprDuringYearAdditions` | `ScheduleDPM/PlantMachinery/Rate30/DepreciationDetail/AddlnDeprDuringYearAdditions` | no | INPUT | data-p `dpm.r30.AddlnDeprDuringYearAdditions` (blockCol() iN("AddlnDeprDuringYearAdditions"), 70_sec_bp.js:518-553) |
| `AddlnDeprOnLessThan180DayAdditions` | `ScheduleDPM/PlantMachinery/Rate30/DepreciationDetail/AddlnDeprOnLessThan180DayAdditions` | no | INPUT | data-p `dpm.r30.AddlnDeprOnLessThan180DayAdditions` (blockCol() iN("AddlnDeprOnLessThan180DayAdditions"), 70_sec_bp.js:518-553) |
| `TotalDepreciation` | `ScheduleDPM/PlantMachinery/Rate30/DepreciationDetail/TotalDepreciation` | yes† | COMPUTED | bpBlock(): `totDep = 10+11+12+13+14  [F21]` → putDPM/putDOA `put(j,D2+"TotalDepreciation",…)` |
| `DepDisAllowUs38_2` | `ScheduleDPM/PlantMachinery/Rate30/DepreciationDetail/DepDisAllowUs38_2` | yes† | INPUT | data-p `dpm.r30.DepDisAllowUs38_2` (blockCol() iN("DepDisAllowUs38_2"), 70_sec_bp.js:518-553) |
| `NetAggregateDepreciation` | `ScheduleDPM/PlantMachinery/Rate30/DepreciationDetail/NetAggregateDepreciation` | yes† | COMPUTED | bpBlock(): `netAgg = MAX(0, 15−16)  [F23]` → putDPM/putDOA `put(j,D2+"NetAggregateDepreciation",…)` |
| `ProportionateAggDepreciation` | `ScheduleDPM/PlantMachinery/Rate30/DepreciationDetail/ProportionateAggDepreciation` | yes† | INPUT | data-p `dpm.r30.ProportionateAggDepreciation` (blockCol() iN("ProportionateAggDepreciation"), 70_sec_bp.js:518-553) |
| `ExpdrOnTrforSaleAsset` | `ScheduleDPM/PlantMachinery/Rate30/DepreciationDetail/ExpdrOnTrforSaleAsset` | yes† | INPUT | data-p `dpm.r30.ExpdrOnTrforSaleAsset` (blockCol() iN("ExpdrOnTrforSaleAsset"), 70_sec_bp.js:518-553) |
| `CapGainUs50` | `ScheduleDPM/PlantMachinery/Rate30/DepreciationDetail/CapGainUs50` | yes† | INPUT | data-p `dpm.r30.CapGainUs50` (blockCol() iN("CapGainUs50"), 70_sec_bp.js:518-553) |
| `WDVLastDay` | `ScheduleDPM/PlantMachinery/Rate30/DepreciationDetail/WDVLastDay` | yes† | COMPUTED | bpBlock(): `wdvLast = MAX(0, 3+4−5+7−8−15)  [F27]` → putDPM/putDOA `put(j,D2+"WDVLastDay",…)` |
| `WDVFirstDay` | `ScheduleDPM/PlantMachinery/Rate40/DepreciationDetail/WDVFirstDay` | yes† | INPUT | data-p `dpm.r40.WDVFirstDay` (blockCol() iN("WDVFirstDay"), 70_sec_bp.js:518-553) |
| `AdjustmentSec115BAC` | `ScheduleDPM/PlantMachinery/Rate40/DepreciationDetail/AdjustmentSec115BAC` | no | INPUT | data-p `dpm.r40.AdjustmentSec115BAC` (blockCol() iN("AdjustmentSec115BAC"), 70_sec_bp.js:518-553) |
| `Total` | `ScheduleDPM/PlantMachinery/Rate40/DepreciationDetail/Total` | no | COMPUTED | bpBlock(): `tot3 = WDVFirstDay + AdjustmentSec115BAC  [F9]` → putDPM/putDOA `put(j,D2+"Total",…)` |
| `AdditionsGrThan180Days` | `ScheduleDPM/PlantMachinery/Rate40/DepreciationDetail/AdditionsGrThan180Days` | yes† | INPUT | data-p `dpm.r40.AdditionsGrThan180Days` (blockCol() iN("AdditionsGrThan180Days"), 70_sec_bp.js:518-553) |
| `RealizationTotalPeriod` | `ScheduleDPM/PlantMachinery/Rate40/DepreciationDetail/RealizationTotalPeriod` | yes† | INPUT | data-p `dpm.r40.RealizationTotalPeriod` (blockCol() iN("RealizationTotalPeriod"), 70_sec_bp.js:518-553) |
| `FullRateDeprAmt` | `ScheduleDPM/PlantMachinery/Rate40/DepreciationDetail/FullRateDeprAmt` | yes† | COMPUTED | bpBlock(): `fullAmt = MAX(0, 3+4−5)  [F12]` → putDPM/putDOA `put(j,D2+"FullRateDeprAmt",…)` |
| `AdditionsLessThan180Days` | `ScheduleDPM/PlantMachinery/Rate40/DepreciationDetail/AdditionsLessThan180Days` | yes† | INPUT | data-p `dpm.r40.AdditionsLessThan180Days` (blockCol() iN("AdditionsLessThan180Days"), 70_sec_bp.js:518-553) |
| `RealizationPeriodDuringYear` | `ScheduleDPM/PlantMachinery/Rate40/DepreciationDetail/RealizationPeriodDuringYear` | yes† | INPUT | data-p `dpm.r40.RealizationPeriodDuringYear` (blockCol() iN("RealizationPeriodDuringYear"), 70_sec_bp.js:518-553) |
| `HalfRateDeprAmt` | `ScheduleDPM/PlantMachinery/Rate40/DepreciationDetail/HalfRateDeprAmt` | yes† | COMPUTED | bpBlock(): `halfAmt = MAX(0, 7−8+MIN(0,3+4−5))  [F15]` → putDPM/putDOA `put(j,D2+"HalfRateDeprAmt",…)` |
| `DepreciationAtFullRate` | `ScheduleDPM/PlantMachinery/Rate40/DepreciationDetail/DepreciationAtFullRate` | yes† | COMPUTED | bpBlock(): `depFull = ROUND(fullAmt*rate/100)  [F16]` → putDPM/putDOA `put(j,D2+"DepreciationAtFullRate",…)` |
| `DepreciationAtHalfRate` | `ScheduleDPM/PlantMachinery/Rate40/DepreciationDetail/DepreciationAtHalfRate` | yes† | COMPUTED | bpBlock(): `depHalf = ROUND(halfAmt*rate/200)  [F17]` → putDPM/putDOA `put(j,D2+"DepreciationAtHalfRate",…)` |
| `AddlnDeprOnGT180DayAdditions` | `ScheduleDPM/PlantMachinery/Rate40/DepreciationDetail/AddlnDeprOnGT180DayAdditions` | no | INPUT | data-p `dpm.r40.AddlnDeprOnGT180DayAdditions` (blockCol() iN("AddlnDeprOnGT180DayAdditions"), 70_sec_bp.js:518-553) |
| `AddlnDeprDuringYearAdditions` | `ScheduleDPM/PlantMachinery/Rate40/DepreciationDetail/AddlnDeprDuringYearAdditions` | no | INPUT | data-p `dpm.r40.AddlnDeprDuringYearAdditions` (blockCol() iN("AddlnDeprDuringYearAdditions"), 70_sec_bp.js:518-553) |
| `AddlnDeprOnLessThan180DayAdditions` | `ScheduleDPM/PlantMachinery/Rate40/DepreciationDetail/AddlnDeprOnLessThan180DayAdditions` | no | INPUT | data-p `dpm.r40.AddlnDeprOnLessThan180DayAdditions` (blockCol() iN("AddlnDeprOnLessThan180DayAdditions"), 70_sec_bp.js:518-553) |
| `TotalDepreciation` | `ScheduleDPM/PlantMachinery/Rate40/DepreciationDetail/TotalDepreciation` | yes† | COMPUTED | bpBlock(): `totDep = 10+11+12+13+14  [F21]` → putDPM/putDOA `put(j,D2+"TotalDepreciation",…)` |
| `DepDisAllowUs38_2` | `ScheduleDPM/PlantMachinery/Rate40/DepreciationDetail/DepDisAllowUs38_2` | yes† | INPUT | data-p `dpm.r40.DepDisAllowUs38_2` (blockCol() iN("DepDisAllowUs38_2"), 70_sec_bp.js:518-553) |
| `NetAggregateDepreciation` | `ScheduleDPM/PlantMachinery/Rate40/DepreciationDetail/NetAggregateDepreciation` | yes† | COMPUTED | bpBlock(): `netAgg = MAX(0, 15−16)  [F23]` → putDPM/putDOA `put(j,D2+"NetAggregateDepreciation",…)` |
| `ProportionateAggDepreciation` | `ScheduleDPM/PlantMachinery/Rate40/DepreciationDetail/ProportionateAggDepreciation` | yes† | INPUT | data-p `dpm.r40.ProportionateAggDepreciation` (blockCol() iN("ProportionateAggDepreciation"), 70_sec_bp.js:518-553) |
| `ExpdrOnTrforSaleAsset` | `ScheduleDPM/PlantMachinery/Rate40/DepreciationDetail/ExpdrOnTrforSaleAsset` | yes† | INPUT | data-p `dpm.r40.ExpdrOnTrforSaleAsset` (blockCol() iN("ExpdrOnTrforSaleAsset"), 70_sec_bp.js:518-553) |
| `CapGainUs50` | `ScheduleDPM/PlantMachinery/Rate40/DepreciationDetail/CapGainUs50` | yes† | INPUT | data-p `dpm.r40.CapGainUs50` (blockCol() iN("CapGainUs50"), 70_sec_bp.js:518-553) |
| `WDVLastDay` | `ScheduleDPM/PlantMachinery/Rate40/DepreciationDetail/WDVLastDay` | yes† | COMPUTED | bpBlock(): `wdvLast = MAX(0, 3+4−5+7−8−15)  [F27]` → putDPM/putDOA `put(j,D2+"WDVLastDay",…)` |
| `WDVFirstDay` | `ScheduleDPM/PlantMachinery/Rate45/DepreciationDetail/WDVFirstDay` | yes† | INPUT | data-p `dpm.r45.WDVFirstDay` (blockCol() iN("WDVFirstDay"), 70_sec_bp.js:518-553) |
| `AdjustmentSec115BAC` | `ScheduleDPM/PlantMachinery/Rate45/DepreciationDetail/AdjustmentSec115BAC` | no | INPUT | data-p `dpm.r45.AdjustmentSec115BAC` (blockCol() iN("AdjustmentSec115BAC"), 70_sec_bp.js:518-553) |
| `Total` | `ScheduleDPM/PlantMachinery/Rate45/DepreciationDetail/Total` | no | COMPUTED | bpBlock(): `tot3 = WDVFirstDay + AdjustmentSec115BAC  [F9]` → putDPM/putDOA `put(j,D2+"Total",…)` |
| `RealizationTotalPeriod` | `ScheduleDPM/PlantMachinery/Rate45/DepreciationDetail/RealizationTotalPeriod` | yes† | INPUT | data-p `dpm.r45.RealizationTotalPeriod` (blockCol() iN("RealizationTotalPeriod"), 70_sec_bp.js:518-553) |
| `FullRateDeprAmt` | `ScheduleDPM/PlantMachinery/Rate45/DepreciationDetail/FullRateDeprAmt` | yes† | COMPUTED | bpBlock(): `fullAmt = MAX(0, 3+4−5)  [F12]` → putDPM/putDOA `put(j,D2+"FullRateDeprAmt",…)` |
| `DepreciationAtFullRate` | `ScheduleDPM/PlantMachinery/Rate45/DepreciationDetail/DepreciationAtFullRate` | yes† | COMPUTED | bpBlock(): `depFull = ROUND(fullAmt*rate/100)  [F16]` → putDPM/putDOA `put(j,D2+"DepreciationAtFullRate",…)` |
| `TotalDepreciation` | `ScheduleDPM/PlantMachinery/Rate45/DepreciationDetail/TotalDepreciation` | yes† | COMPUTED | bpBlock(): `totDep = 10+11+12+13+14  [F21]` → putDPM/putDOA `put(j,D2+"TotalDepreciation",…)` |
| `DepDisAllowUs38_2` | `ScheduleDPM/PlantMachinery/Rate45/DepreciationDetail/DepDisAllowUs38_2` | yes† | INPUT | data-p `dpm.r45.DepDisAllowUs38_2` (blockCol() iN("DepDisAllowUs38_2"), 70_sec_bp.js:518-553) |
| `NetAggregateDepreciation` | `ScheduleDPM/PlantMachinery/Rate45/DepreciationDetail/NetAggregateDepreciation` | yes† | COMPUTED | bpBlock(): `netAgg = MAX(0, 15−16)  [F23]` → putDPM/putDOA `put(j,D2+"NetAggregateDepreciation",…)` |
| `ProportionateAggDepreciation` | `ScheduleDPM/PlantMachinery/Rate45/DepreciationDetail/ProportionateAggDepreciation` | yes† | INPUT | data-p `dpm.r45.ProportionateAggDepreciation` (blockCol() iN("ProportionateAggDepreciation"), 70_sec_bp.js:518-553) |
| `ExpdrOnTrforSaleAsset` | `ScheduleDPM/PlantMachinery/Rate45/DepreciationDetail/ExpdrOnTrforSaleAsset` | yes† | INPUT | data-p `dpm.r45.ExpdrOnTrforSaleAsset` (blockCol() iN("ExpdrOnTrforSaleAsset"), 70_sec_bp.js:518-553) |
| `CapGainUs50` | `ScheduleDPM/PlantMachinery/Rate45/DepreciationDetail/CapGainUs50` | yes† | INPUT | data-p `dpm.r45.CapGainUs50` (blockCol() iN("CapGainUs50"), 70_sec_bp.js:518-553) |
| `WDVLastDay` | `ScheduleDPM/PlantMachinery/Rate45/DepreciationDetail/WDVLastDay` | yes† | COMPUTED | bpBlock(): `wdvLast = MAX(0, 3+4−5+7−8−15)  [F27]` → putDPM/putDOA `put(j,D2+"WDVLastDay",…)` |

### `ScheduleDOA` — 98 leaves

| leaf | schema path | required? | class | evidence |
|---|---|---|---|---|
| `WDVFirstDay` | `ScheduleDOA/Land/DepreciationDetail/WDVFirstDay` | yes† | INPUT | data-p `doa.land.WDVFirstDay` (70_sec_bp.js:571) |
| `WDVLastDay` | `ScheduleDOA/Land/DepreciationDetail/WDVLastDay` | yes† | COMPUTED | `land.wdvLast = MAX(0, N(landB.WDVFirstDay))` [F51] engBp :256; put :867 |
| `WDVFirstDay` | `ScheduleDOA/Building/Rate5/DepreciationDetail/WDVFirstDay` | yes† | INPUT | data-p `doa.b5.WDVFirstDay` (blockCol() iN("WDVFirstDay"), 70_sec_bp.js:518-553) |
| `AdditionsGrThan180Days` | `ScheduleDOA/Building/Rate5/DepreciationDetail/AdditionsGrThan180Days` | yes† | INPUT | data-p `doa.b5.AdditionsGrThan180Days` (blockCol() iN("AdditionsGrThan180Days"), 70_sec_bp.js:518-553) |
| `RealizationTotalPeriod` | `ScheduleDOA/Building/Rate5/DepreciationDetail/RealizationTotalPeriod` | yes† | INPUT | data-p `doa.b5.RealizationTotalPeriod` (blockCol() iN("RealizationTotalPeriod"), 70_sec_bp.js:518-553) |
| `FullRateDeprAmt` | `ScheduleDOA/Building/Rate5/DepreciationDetail/FullRateDeprAmt` | yes† | COMPUTED | bpBlock(): `fullAmt = MAX(0, 3+4−5)  [F12]` → putDPM/putDOA `put(j,D2+"FullRateDeprAmt",…)` |
| `AdditionsLessThan180Days` | `ScheduleDOA/Building/Rate5/DepreciationDetail/AdditionsLessThan180Days` | yes† | INPUT | data-p `doa.b5.AdditionsLessThan180Days` (blockCol() iN("AdditionsLessThan180Days"), 70_sec_bp.js:518-553) |
| `RealizationPeriodDuringYear` | `ScheduleDOA/Building/Rate5/DepreciationDetail/RealizationPeriodDuringYear` | yes† | INPUT | data-p `doa.b5.RealizationPeriodDuringYear` (blockCol() iN("RealizationPeriodDuringYear"), 70_sec_bp.js:518-553) |
| `HalfRateDeprAmt` | `ScheduleDOA/Building/Rate5/DepreciationDetail/HalfRateDeprAmt` | yes† | COMPUTED | bpBlock(): `halfAmt = MAX(0, 7−8+MIN(0,3+4−5))  [F15]` → putDPM/putDOA `put(j,D2+"HalfRateDeprAmt",…)` |
| `DepreciationAtFullRate` | `ScheduleDOA/Building/Rate5/DepreciationDetail/DepreciationAtFullRate` | yes† | COMPUTED | bpBlock(): `depFull = ROUND(fullAmt*rate/100)  [F16]` → putDPM/putDOA `put(j,D2+"DepreciationAtFullRate",…)` |
| `DepreciationAtHalfRate` | `ScheduleDOA/Building/Rate5/DepreciationDetail/DepreciationAtHalfRate` | yes† | COMPUTED | bpBlock(): `depHalf = ROUND(halfAmt*rate/200)  [F17]` → putDPM/putDOA `put(j,D2+"DepreciationAtHalfRate",…)` |
| `TotalDepreciation` | `ScheduleDOA/Building/Rate5/DepreciationDetail/TotalDepreciation` | yes† | COMPUTED | bpBlock(): `totDep = 10+11+12+13+14  [F21]` → putDPM/putDOA `put(j,D2+"TotalDepreciation",…)` |
| `DepDisAllowUs38_2` | `ScheduleDOA/Building/Rate5/DepreciationDetail/DepDisAllowUs38_2` | yes† | INPUT | data-p `doa.b5.DepDisAllowUs38_2` (blockCol() iN("DepDisAllowUs38_2"), 70_sec_bp.js:518-553) |
| `NetAggregateDepreciation` | `ScheduleDOA/Building/Rate5/DepreciationDetail/NetAggregateDepreciation` | yes† | COMPUTED | bpBlock(): `netAgg = MAX(0, 15−16)  [F23]` → putDPM/putDOA `put(j,D2+"NetAggregateDepreciation",…)` |
| `ProportionateAggDepreciation` | `ScheduleDOA/Building/Rate5/DepreciationDetail/ProportionateAggDepreciation` | yes† | INPUT | data-p `doa.b5.ProportionateAggDepreciation` (blockCol() iN("ProportionateAggDepreciation"), 70_sec_bp.js:518-553) |
| `ExpdrOnTrforSaleAsset` | `ScheduleDOA/Building/Rate5/DepreciationDetail/ExpdrOnTrforSaleAsset` | yes† | INPUT | data-p `doa.b5.ExpdrOnTrforSaleAsset` (blockCol() iN("ExpdrOnTrforSaleAsset"), 70_sec_bp.js:518-553) |
| `CapGainUs50` | `ScheduleDOA/Building/Rate5/DepreciationDetail/CapGainUs50` | yes† | INPUT | data-p `doa.b5.CapGainUs50` (blockCol() iN("CapGainUs50"), 70_sec_bp.js:518-553) |
| `WDVLastDay` | `ScheduleDOA/Building/Rate5/DepreciationDetail/WDVLastDay` | yes† | COMPUTED | bpBlock(): `wdvLast = MAX(0, 3+4−5+7−8−15)  [F27]` → putDPM/putDOA `put(j,D2+"WDVLastDay",…)` |
| `WDVFirstDay` | `ScheduleDOA/Building/Rate10/DepreciationDetail/WDVFirstDay` | yes† | INPUT | data-p `doa.b10.WDVFirstDay` (blockCol() iN("WDVFirstDay"), 70_sec_bp.js:518-553) |
| `AdditionsGrThan180Days` | `ScheduleDOA/Building/Rate10/DepreciationDetail/AdditionsGrThan180Days` | yes† | INPUT | data-p `doa.b10.AdditionsGrThan180Days` (blockCol() iN("AdditionsGrThan180Days"), 70_sec_bp.js:518-553) |
| `RealizationTotalPeriod` | `ScheduleDOA/Building/Rate10/DepreciationDetail/RealizationTotalPeriod` | yes† | INPUT | data-p `doa.b10.RealizationTotalPeriod` (blockCol() iN("RealizationTotalPeriod"), 70_sec_bp.js:518-553) |
| `FullRateDeprAmt` | `ScheduleDOA/Building/Rate10/DepreciationDetail/FullRateDeprAmt` | yes† | COMPUTED | bpBlock(): `fullAmt = MAX(0, 3+4−5)  [F12]` → putDPM/putDOA `put(j,D2+"FullRateDeprAmt",…)` |
| `AdditionsLessThan180Days` | `ScheduleDOA/Building/Rate10/DepreciationDetail/AdditionsLessThan180Days` | yes† | INPUT | data-p `doa.b10.AdditionsLessThan180Days` (blockCol() iN("AdditionsLessThan180Days"), 70_sec_bp.js:518-553) |
| `RealizationPeriodDuringYear` | `ScheduleDOA/Building/Rate10/DepreciationDetail/RealizationPeriodDuringYear` | yes† | INPUT | data-p `doa.b10.RealizationPeriodDuringYear` (blockCol() iN("RealizationPeriodDuringYear"), 70_sec_bp.js:518-553) |
| `HalfRateDeprAmt` | `ScheduleDOA/Building/Rate10/DepreciationDetail/HalfRateDeprAmt` | yes† | COMPUTED | bpBlock(): `halfAmt = MAX(0, 7−8+MIN(0,3+4−5))  [F15]` → putDPM/putDOA `put(j,D2+"HalfRateDeprAmt",…)` |
| `DepreciationAtFullRate` | `ScheduleDOA/Building/Rate10/DepreciationDetail/DepreciationAtFullRate` | yes† | COMPUTED | bpBlock(): `depFull = ROUND(fullAmt*rate/100)  [F16]` → putDPM/putDOA `put(j,D2+"DepreciationAtFullRate",…)` |
| `DepreciationAtHalfRate` | `ScheduleDOA/Building/Rate10/DepreciationDetail/DepreciationAtHalfRate` | yes† | COMPUTED | bpBlock(): `depHalf = ROUND(halfAmt*rate/200)  [F17]` → putDPM/putDOA `put(j,D2+"DepreciationAtHalfRate",…)` |
| `TotalDepreciation` | `ScheduleDOA/Building/Rate10/DepreciationDetail/TotalDepreciation` | yes† | COMPUTED | bpBlock(): `totDep = 10+11+12+13+14  [F21]` → putDPM/putDOA `put(j,D2+"TotalDepreciation",…)` |
| `DepDisAllowUs38_2` | `ScheduleDOA/Building/Rate10/DepreciationDetail/DepDisAllowUs38_2` | yes† | INPUT | data-p `doa.b10.DepDisAllowUs38_2` (blockCol() iN("DepDisAllowUs38_2"), 70_sec_bp.js:518-553) |
| `NetAggregateDepreciation` | `ScheduleDOA/Building/Rate10/DepreciationDetail/NetAggregateDepreciation` | yes† | COMPUTED | bpBlock(): `netAgg = MAX(0, 15−16)  [F23]` → putDPM/putDOA `put(j,D2+"NetAggregateDepreciation",…)` |
| `ProportionateAggDepreciation` | `ScheduleDOA/Building/Rate10/DepreciationDetail/ProportionateAggDepreciation` | yes† | INPUT | data-p `doa.b10.ProportionateAggDepreciation` (blockCol() iN("ProportionateAggDepreciation"), 70_sec_bp.js:518-553) |
| `ExpdrOnTrforSaleAsset` | `ScheduleDOA/Building/Rate10/DepreciationDetail/ExpdrOnTrforSaleAsset` | yes† | INPUT | data-p `doa.b10.ExpdrOnTrforSaleAsset` (blockCol() iN("ExpdrOnTrforSaleAsset"), 70_sec_bp.js:518-553) |
| `CapGainUs50` | `ScheduleDOA/Building/Rate10/DepreciationDetail/CapGainUs50` | yes† | INPUT | data-p `doa.b10.CapGainUs50` (blockCol() iN("CapGainUs50"), 70_sec_bp.js:518-553) |
| `WDVLastDay` | `ScheduleDOA/Building/Rate10/DepreciationDetail/WDVLastDay` | yes† | COMPUTED | bpBlock(): `wdvLast = MAX(0, 3+4−5+7−8−15)  [F27]` → putDPM/putDOA `put(j,D2+"WDVLastDay",…)` |
| `WDVFirstDay` | `ScheduleDOA/Building/Rate40/DepreciationDetail/WDVFirstDay` | yes† | INPUT | data-p `doa.b40.WDVFirstDay` (blockCol() iN("WDVFirstDay"), 70_sec_bp.js:518-553) |
| `AdditionsGrThan180Days` | `ScheduleDOA/Building/Rate40/DepreciationDetail/AdditionsGrThan180Days` | yes† | INPUT | data-p `doa.b40.AdditionsGrThan180Days` (blockCol() iN("AdditionsGrThan180Days"), 70_sec_bp.js:518-553) |
| `RealizationTotalPeriod` | `ScheduleDOA/Building/Rate40/DepreciationDetail/RealizationTotalPeriod` | yes† | INPUT | data-p `doa.b40.RealizationTotalPeriod` (blockCol() iN("RealizationTotalPeriod"), 70_sec_bp.js:518-553) |
| `FullRateDeprAmt` | `ScheduleDOA/Building/Rate40/DepreciationDetail/FullRateDeprAmt` | yes† | COMPUTED | bpBlock(): `fullAmt = MAX(0, 3+4−5)  [F12]` → putDPM/putDOA `put(j,D2+"FullRateDeprAmt",…)` |
| `AdditionsLessThan180Days` | `ScheduleDOA/Building/Rate40/DepreciationDetail/AdditionsLessThan180Days` | yes† | INPUT | data-p `doa.b40.AdditionsLessThan180Days` (blockCol() iN("AdditionsLessThan180Days"), 70_sec_bp.js:518-553) |
| `RealizationPeriodDuringYear` | `ScheduleDOA/Building/Rate40/DepreciationDetail/RealizationPeriodDuringYear` | yes† | INPUT | data-p `doa.b40.RealizationPeriodDuringYear` (blockCol() iN("RealizationPeriodDuringYear"), 70_sec_bp.js:518-553) |
| `HalfRateDeprAmt` | `ScheduleDOA/Building/Rate40/DepreciationDetail/HalfRateDeprAmt` | yes† | COMPUTED | bpBlock(): `halfAmt = MAX(0, 7−8+MIN(0,3+4−5))  [F15]` → putDPM/putDOA `put(j,D2+"HalfRateDeprAmt",…)` |
| `DepreciationAtFullRate` | `ScheduleDOA/Building/Rate40/DepreciationDetail/DepreciationAtFullRate` | yes† | COMPUTED | bpBlock(): `depFull = ROUND(fullAmt*rate/100)  [F16]` → putDPM/putDOA `put(j,D2+"DepreciationAtFullRate",…)` |
| `DepreciationAtHalfRate` | `ScheduleDOA/Building/Rate40/DepreciationDetail/DepreciationAtHalfRate` | yes† | COMPUTED | bpBlock(): `depHalf = ROUND(halfAmt*rate/200)  [F17]` → putDPM/putDOA `put(j,D2+"DepreciationAtHalfRate",…)` |
| `TotalDepreciation` | `ScheduleDOA/Building/Rate40/DepreciationDetail/TotalDepreciation` | yes† | COMPUTED | bpBlock(): `totDep = 10+11+12+13+14  [F21]` → putDPM/putDOA `put(j,D2+"TotalDepreciation",…)` |
| `DepDisAllowUs38_2` | `ScheduleDOA/Building/Rate40/DepreciationDetail/DepDisAllowUs38_2` | yes† | INPUT | data-p `doa.b40.DepDisAllowUs38_2` (blockCol() iN("DepDisAllowUs38_2"), 70_sec_bp.js:518-553) |
| `NetAggregateDepreciation` | `ScheduleDOA/Building/Rate40/DepreciationDetail/NetAggregateDepreciation` | yes† | COMPUTED | bpBlock(): `netAgg = MAX(0, 15−16)  [F23]` → putDPM/putDOA `put(j,D2+"NetAggregateDepreciation",…)` |
| `ProportionateAggDepreciation` | `ScheduleDOA/Building/Rate40/DepreciationDetail/ProportionateAggDepreciation` | yes† | INPUT | data-p `doa.b40.ProportionateAggDepreciation` (blockCol() iN("ProportionateAggDepreciation"), 70_sec_bp.js:518-553) |
| `ExpdrOnTrforSaleAsset` | `ScheduleDOA/Building/Rate40/DepreciationDetail/ExpdrOnTrforSaleAsset` | yes† | INPUT | data-p `doa.b40.ExpdrOnTrforSaleAsset` (blockCol() iN("ExpdrOnTrforSaleAsset"), 70_sec_bp.js:518-553) |
| `CapGainUs50` | `ScheduleDOA/Building/Rate40/DepreciationDetail/CapGainUs50` | yes† | INPUT | data-p `doa.b40.CapGainUs50` (blockCol() iN("CapGainUs50"), 70_sec_bp.js:518-553) |
| `WDVLastDay` | `ScheduleDOA/Building/Rate40/DepreciationDetail/WDVLastDay` | yes† | COMPUTED | bpBlock(): `wdvLast = MAX(0, 3+4−5+7−8−15)  [F27]` → putDPM/putDOA `put(j,D2+"WDVLastDay",…)` |
| `WDVFirstDay` | `ScheduleDOA/FurnitureFittings/Rate10/DepreciationDetail/WDVFirstDay` | yes† | INPUT | data-p `doa.furn.WDVFirstDay` (blockCol() iN("WDVFirstDay"), 70_sec_bp.js:518-553) |
| `AdditionsGrThan180Days` | `ScheduleDOA/FurnitureFittings/Rate10/DepreciationDetail/AdditionsGrThan180Days` | yes† | INPUT | data-p `doa.furn.AdditionsGrThan180Days` (blockCol() iN("AdditionsGrThan180Days"), 70_sec_bp.js:518-553) |
| `RealizationTotalPeriod` | `ScheduleDOA/FurnitureFittings/Rate10/DepreciationDetail/RealizationTotalPeriod` | yes† | INPUT | data-p `doa.furn.RealizationTotalPeriod` (blockCol() iN("RealizationTotalPeriod"), 70_sec_bp.js:518-553) |
| `FullRateDeprAmt` | `ScheduleDOA/FurnitureFittings/Rate10/DepreciationDetail/FullRateDeprAmt` | yes† | COMPUTED | bpBlock(): `fullAmt = MAX(0, 3+4−5)  [F12]` → putDPM/putDOA `put(j,D2+"FullRateDeprAmt",…)` |
| `AdditionsLessThan180Days` | `ScheduleDOA/FurnitureFittings/Rate10/DepreciationDetail/AdditionsLessThan180Days` | yes† | INPUT | data-p `doa.furn.AdditionsLessThan180Days` (blockCol() iN("AdditionsLessThan180Days"), 70_sec_bp.js:518-553) |
| `RealizationPeriodDuringYear` | `ScheduleDOA/FurnitureFittings/Rate10/DepreciationDetail/RealizationPeriodDuringYear` | yes† | INPUT | data-p `doa.furn.RealizationPeriodDuringYear` (blockCol() iN("RealizationPeriodDuringYear"), 70_sec_bp.js:518-553) |
| `HalfRateDeprAmt` | `ScheduleDOA/FurnitureFittings/Rate10/DepreciationDetail/HalfRateDeprAmt` | yes† | COMPUTED | bpBlock(): `halfAmt = MAX(0, 7−8+MIN(0,3+4−5))  [F15]` → putDPM/putDOA `put(j,D2+"HalfRateDeprAmt",…)` |
| `DepreciationAtFullRate` | `ScheduleDOA/FurnitureFittings/Rate10/DepreciationDetail/DepreciationAtFullRate` | yes† | COMPUTED | bpBlock(): `depFull = ROUND(fullAmt*rate/100)  [F16]` → putDPM/putDOA `put(j,D2+"DepreciationAtFullRate",…)` |
| `DepreciationAtHalfRate` | `ScheduleDOA/FurnitureFittings/Rate10/DepreciationDetail/DepreciationAtHalfRate` | yes† | COMPUTED | bpBlock(): `depHalf = ROUND(halfAmt*rate/200)  [F17]` → putDPM/putDOA `put(j,D2+"DepreciationAtHalfRate",…)` |
| `TotalDepreciation` | `ScheduleDOA/FurnitureFittings/Rate10/DepreciationDetail/TotalDepreciation` | yes† | COMPUTED | bpBlock(): `totDep = 10+11+12+13+14  [F21]` → putDPM/putDOA `put(j,D2+"TotalDepreciation",…)` |
| `DepDisAllowUs38_2` | `ScheduleDOA/FurnitureFittings/Rate10/DepreciationDetail/DepDisAllowUs38_2` | yes† | INPUT | data-p `doa.furn.DepDisAllowUs38_2` (blockCol() iN("DepDisAllowUs38_2"), 70_sec_bp.js:518-553) |
| `NetAggregateDepreciation` | `ScheduleDOA/FurnitureFittings/Rate10/DepreciationDetail/NetAggregateDepreciation` | yes† | COMPUTED | bpBlock(): `netAgg = MAX(0, 15−16)  [F23]` → putDPM/putDOA `put(j,D2+"NetAggregateDepreciation",…)` |
| `ProportionateAggDepreciation` | `ScheduleDOA/FurnitureFittings/Rate10/DepreciationDetail/ProportionateAggDepreciation` | yes† | INPUT | data-p `doa.furn.ProportionateAggDepreciation` (blockCol() iN("ProportionateAggDepreciation"), 70_sec_bp.js:518-553) |
| `ExpdrOnTrforSaleAsset` | `ScheduleDOA/FurnitureFittings/Rate10/DepreciationDetail/ExpdrOnTrforSaleAsset` | yes† | INPUT | data-p `doa.furn.ExpdrOnTrforSaleAsset` (blockCol() iN("ExpdrOnTrforSaleAsset"), 70_sec_bp.js:518-553) |
| `CapGainUs50` | `ScheduleDOA/FurnitureFittings/Rate10/DepreciationDetail/CapGainUs50` | yes† | INPUT | data-p `doa.furn.CapGainUs50` (blockCol() iN("CapGainUs50"), 70_sec_bp.js:518-553) |
| `WDVLastDay` | `ScheduleDOA/FurnitureFittings/Rate10/DepreciationDetail/WDVLastDay` | yes† | COMPUTED | bpBlock(): `wdvLast = MAX(0, 3+4−5+7−8−15)  [F27]` → putDPM/putDOA `put(j,D2+"WDVLastDay",…)` |
| `WDVFirstDay` | `ScheduleDOA/IntangibleAssets/Rate25/DepreciationDetail/WDVFirstDay` | yes† | INPUT | data-p `doa.intang.WDVFirstDay` (blockCol() iN("WDVFirstDay"), 70_sec_bp.js:518-553) |
| `AdditionsGrThan180Days` | `ScheduleDOA/IntangibleAssets/Rate25/DepreciationDetail/AdditionsGrThan180Days` | yes† | INPUT | data-p `doa.intang.AdditionsGrThan180Days` (blockCol() iN("AdditionsGrThan180Days"), 70_sec_bp.js:518-553) |
| `RealizationTotalPeriod` | `ScheduleDOA/IntangibleAssets/Rate25/DepreciationDetail/RealizationTotalPeriod` | yes† | INPUT | data-p `doa.intang.RealizationTotalPeriod` (blockCol() iN("RealizationTotalPeriod"), 70_sec_bp.js:518-553) |
| `FullRateDeprAmt` | `ScheduleDOA/IntangibleAssets/Rate25/DepreciationDetail/FullRateDeprAmt` | yes† | COMPUTED | bpBlock(): `fullAmt = MAX(0, 3+4−5)  [F12]` → putDPM/putDOA `put(j,D2+"FullRateDeprAmt",…)` |
| `AdditionsLessThan180Days` | `ScheduleDOA/IntangibleAssets/Rate25/DepreciationDetail/AdditionsLessThan180Days` | yes† | INPUT | data-p `doa.intang.AdditionsLessThan180Days` (blockCol() iN("AdditionsLessThan180Days"), 70_sec_bp.js:518-553) |
| `RealizationPeriodDuringYear` | `ScheduleDOA/IntangibleAssets/Rate25/DepreciationDetail/RealizationPeriodDuringYear` | yes† | INPUT | data-p `doa.intang.RealizationPeriodDuringYear` (blockCol() iN("RealizationPeriodDuringYear"), 70_sec_bp.js:518-553) |
| `HalfRateDeprAmt` | `ScheduleDOA/IntangibleAssets/Rate25/DepreciationDetail/HalfRateDeprAmt` | yes† | COMPUTED | bpBlock(): `halfAmt = MAX(0, 7−8+MIN(0,3+4−5))  [F15]` → putDPM/putDOA `put(j,D2+"HalfRateDeprAmt",…)` |
| `DepreciationAtFullRate` | `ScheduleDOA/IntangibleAssets/Rate25/DepreciationDetail/DepreciationAtFullRate` | yes† | COMPUTED | bpBlock(): `depFull = ROUND(fullAmt*rate/100)  [F16]` → putDPM/putDOA `put(j,D2+"DepreciationAtFullRate",…)` |
| `DepreciationAtHalfRate` | `ScheduleDOA/IntangibleAssets/Rate25/DepreciationDetail/DepreciationAtHalfRate` | yes† | COMPUTED | bpBlock(): `depHalf = ROUND(halfAmt*rate/200)  [F17]` → putDPM/putDOA `put(j,D2+"DepreciationAtHalfRate",…)` |
| `TotalDepreciation` | `ScheduleDOA/IntangibleAssets/Rate25/DepreciationDetail/TotalDepreciation` | yes† | COMPUTED | bpBlock(): `totDep = 10+11+12+13+14  [F21]` → putDPM/putDOA `put(j,D2+"TotalDepreciation",…)` |
| `DepDisAllowUs38_2` | `ScheduleDOA/IntangibleAssets/Rate25/DepreciationDetail/DepDisAllowUs38_2` | yes† | INPUT | data-p `doa.intang.DepDisAllowUs38_2` (blockCol() iN("DepDisAllowUs38_2"), 70_sec_bp.js:518-553) |
| `NetAggregateDepreciation` | `ScheduleDOA/IntangibleAssets/Rate25/DepreciationDetail/NetAggregateDepreciation` | yes† | COMPUTED | bpBlock(): `netAgg = MAX(0, 15−16)  [F23]` → putDPM/putDOA `put(j,D2+"NetAggregateDepreciation",…)` |
| `ProportionateAggDepreciation` | `ScheduleDOA/IntangibleAssets/Rate25/DepreciationDetail/ProportionateAggDepreciation` | yes† | INPUT | data-p `doa.intang.ProportionateAggDepreciation` (blockCol() iN("ProportionateAggDepreciation"), 70_sec_bp.js:518-553) |
| `ExpdrOnTrforSaleAsset` | `ScheduleDOA/IntangibleAssets/Rate25/DepreciationDetail/ExpdrOnTrforSaleAsset` | yes† | INPUT | data-p `doa.intang.ExpdrOnTrforSaleAsset` (blockCol() iN("ExpdrOnTrforSaleAsset"), 70_sec_bp.js:518-553) |
| `CapGainUs50` | `ScheduleDOA/IntangibleAssets/Rate25/DepreciationDetail/CapGainUs50` | yes† | INPUT | data-p `doa.intang.CapGainUs50` (blockCol() iN("CapGainUs50"), 70_sec_bp.js:518-553) |
| `WDVLastDay` | `ScheduleDOA/IntangibleAssets/Rate25/DepreciationDetail/WDVLastDay` | yes† | COMPUTED | bpBlock(): `wdvLast = MAX(0, 3+4−5+7−8−15)  [F27]` → putDPM/putDOA `put(j,D2+"WDVLastDay",…)` |
| `WDVFirstDay` | `ScheduleDOA/Ships/Rate20/DepreciationDetail/WDVFirstDay` | yes† | INPUT | data-p `doa.ships.WDVFirstDay` (blockCol() iN("WDVFirstDay"), 70_sec_bp.js:518-553) |
| `AdditionsGrThan180Days` | `ScheduleDOA/Ships/Rate20/DepreciationDetail/AdditionsGrThan180Days` | yes† | INPUT | data-p `doa.ships.AdditionsGrThan180Days` (blockCol() iN("AdditionsGrThan180Days"), 70_sec_bp.js:518-553) |
| `RealizationTotalPeriod` | `ScheduleDOA/Ships/Rate20/DepreciationDetail/RealizationTotalPeriod` | yes† | INPUT | data-p `doa.ships.RealizationTotalPeriod` (blockCol() iN("RealizationTotalPeriod"), 70_sec_bp.js:518-553) |
| `FullRateDeprAmt` | `ScheduleDOA/Ships/Rate20/DepreciationDetail/FullRateDeprAmt` | yes† | COMPUTED | bpBlock(): `fullAmt = MAX(0, 3+4−5)  [F12]` → putDPM/putDOA `put(j,D2+"FullRateDeprAmt",…)` |
| `AdditionsLessThan180Days` | `ScheduleDOA/Ships/Rate20/DepreciationDetail/AdditionsLessThan180Days` | yes† | INPUT | data-p `doa.ships.AdditionsLessThan180Days` (blockCol() iN("AdditionsLessThan180Days"), 70_sec_bp.js:518-553) |
| `RealizationPeriodDuringYear` | `ScheduleDOA/Ships/Rate20/DepreciationDetail/RealizationPeriodDuringYear` | yes† | INPUT | data-p `doa.ships.RealizationPeriodDuringYear` (blockCol() iN("RealizationPeriodDuringYear"), 70_sec_bp.js:518-553) |
| `HalfRateDeprAmt` | `ScheduleDOA/Ships/Rate20/DepreciationDetail/HalfRateDeprAmt` | yes† | COMPUTED | bpBlock(): `halfAmt = MAX(0, 7−8+MIN(0,3+4−5))  [F15]` → putDPM/putDOA `put(j,D2+"HalfRateDeprAmt",…)` |
| `DepreciationAtFullRate` | `ScheduleDOA/Ships/Rate20/DepreciationDetail/DepreciationAtFullRate` | yes† | COMPUTED | bpBlock(): `depFull = ROUND(fullAmt*rate/100)  [F16]` → putDPM/putDOA `put(j,D2+"DepreciationAtFullRate",…)` |
| `DepreciationAtHalfRate` | `ScheduleDOA/Ships/Rate20/DepreciationDetail/DepreciationAtHalfRate` | yes† | COMPUTED | bpBlock(): `depHalf = ROUND(halfAmt*rate/200)  [F17]` → putDPM/putDOA `put(j,D2+"DepreciationAtHalfRate",…)` |
| `TotalDepreciation` | `ScheduleDOA/Ships/Rate20/DepreciationDetail/TotalDepreciation` | yes† | COMPUTED | bpBlock(): `totDep = 10+11+12+13+14  [F21]` → putDPM/putDOA `put(j,D2+"TotalDepreciation",…)` |
| `DepDisAllowUs38_2` | `ScheduleDOA/Ships/Rate20/DepreciationDetail/DepDisAllowUs38_2` | yes† | INPUT | data-p `doa.ships.DepDisAllowUs38_2` (blockCol() iN("DepDisAllowUs38_2"), 70_sec_bp.js:518-553) |
| `NetAggregateDepreciation` | `ScheduleDOA/Ships/Rate20/DepreciationDetail/NetAggregateDepreciation` | yes† | COMPUTED | bpBlock(): `netAgg = MAX(0, 15−16)  [F23]` → putDPM/putDOA `put(j,D2+"NetAggregateDepreciation",…)` |
| `ProportionateAggDepreciation` | `ScheduleDOA/Ships/Rate20/DepreciationDetail/ProportionateAggDepreciation` | yes† | INPUT | data-p `doa.ships.ProportionateAggDepreciation` (blockCol() iN("ProportionateAggDepreciation"), 70_sec_bp.js:518-553) |
| `ExpdrOnTrforSaleAsset` | `ScheduleDOA/Ships/Rate20/DepreciationDetail/ExpdrOnTrforSaleAsset` | yes† | INPUT | data-p `doa.ships.ExpdrOnTrforSaleAsset` (blockCol() iN("ExpdrOnTrforSaleAsset"), 70_sec_bp.js:518-553) |
| `CapGainUs50` | `ScheduleDOA/Ships/Rate20/DepreciationDetail/CapGainUs50` | yes† | INPUT | data-p `doa.ships.CapGainUs50` (blockCol() iN("CapGainUs50"), 70_sec_bp.js:518-553) |
| `WDVLastDay` | `ScheduleDOA/Ships/Rate20/DepreciationDetail/WDVLastDay` | yes† | COMPUTED | bpBlock(): `wdvLast = MAX(0, 3+4−5+7−8−15)  [F27]` → putDPM/putDOA `put(j,D2+"WDVLastDay",…)` |

### `ScheduleDEP` — 13 leaves

| leaf | schema path | required? | class | evidence |
|---|---|---|---|---|
| `DeprBlockTot15Percent` | `ScheduleDEP/SummaryFromDeprSch/PlantMachinerySummary/DeprBlockTot15Percent` | yes† | COMPUTED | engBp(): `dep.pm15 = dpm.r15.dep (pro>0?pro:netAgg)`; put 70_sec_bp.js:882-895 |
| `DeprBlockTot30Percent` | `ScheduleDEP/SummaryFromDeprSch/PlantMachinerySummary/DeprBlockTot30Percent` | yes† | COMPUTED | engBp(): `dep.pm30 = dpm.r30.dep`; put 70_sec_bp.js:882-895 |
| `DeprBlockTot40Percent` | `ScheduleDEP/SummaryFromDeprSch/PlantMachinerySummary/DeprBlockTot40Percent` | yes† | COMPUTED | engBp(): `dep.pm40 = dpm.r40.dep`; put 70_sec_bp.js:882-895 |
| `DeprBlockTot45Percent` | `ScheduleDEP/SummaryFromDeprSch/PlantMachinerySummary/DeprBlockTot45Percent` | yes† | COMPUTED | engBp(): `dep.pm45 = dpm.r45.dep`; put 70_sec_bp.js:882-895 |
| `TotPlntMach` | `ScheduleDEP/SummaryFromDeprSch/PlantMachinerySummary/TotPlntMach` | yes† | COMPUTED | engBp(): `dep.totPM = pm15+pm30+pm40+pm45  [J9]`; put 70_sec_bp.js:882-895 |
| `DeprBlockTot5Percent` | `ScheduleDEP/SummaryFromDeprSch/BuildingSummary/DeprBlockTot5Percent` | yes† | COMPUTED | engBp(): `dep.b5 = doa.b5.dep`; put 70_sec_bp.js:882-895 |
| `DeprBlockTot10Percent` | `ScheduleDEP/SummaryFromDeprSch/BuildingSummary/DeprBlockTot10Percent` | yes† | COMPUTED | engBp(): `dep.b10 = doa.b10.dep`; put 70_sec_bp.js:882-895 |
| `DeprBlockTot40Percent` | `ScheduleDEP/SummaryFromDeprSch/BuildingSummary/DeprBlockTot40Percent` | yes† | COMPUTED | engBp(): `dep.pm40 = dpm.r40.dep`; put 70_sec_bp.js:882-895 |
| `TotBuildng` | `ScheduleDEP/SummaryFromDeprSch/BuildingSummary/TotBuildng` | yes† | COMPUTED | engBp(): `dep.totBld = b5+b10+b40  [J14]`; put 70_sec_bp.js:882-895 |
| `FurnitureSummary` | `ScheduleDEP/SummaryFromDeprSch/FurnitureSummary` | no | COMPUTED | engBp(): `dep.furn = doa.furn.dep`; put 70_sec_bp.js:882-895 |
| `IntangibleAssetSummary` | `ScheduleDEP/SummaryFromDeprSch/IntangibleAssetSummary` | no | COMPUTED | engBp(): `dep.intang = doa.intang.dep`; put 70_sec_bp.js:882-895 |
| `ShipsSummary` | `ScheduleDEP/SummaryFromDeprSch/ShipsSummary` | no | COMPUTED | engBp(): `dep.ships = doa.ships.dep`; put 70_sec_bp.js:882-895 |
| `TotalDepreciation` | `ScheduleDEP/SummaryFromDeprSch/TotalDepreciation` | yes† | COMPUTED | engBp(): `dep.total = MAX(0, 1e+2d+3+4+5)  [J18] → BP A12i`; put 70_sec_bp.js:882-895 |

### `ScheduleDCG` — 13 leaves

| leaf | schema path | required? | class | evidence |
|---|---|---|---|---|
| `DeprBlockTot15Percent` | `ScheduleDCG/SummaryFromDeprSchCG/PlantMachinerySummaryCG/DeprBlockTot15Percent` | yes† | COMPUTED | engBp(): `dcg.pm15 = dpm.r15.cg50 (pro>0?pro:netAgg)`; put 70_sec_bp.js:898-910 |
| `DeprBlockTot30Percent` | `ScheduleDCG/SummaryFromDeprSchCG/PlantMachinerySummaryCG/DeprBlockTot30Percent` | yes† | COMPUTED | engBp(): `dcg.pm30 = dpm.r30.cg50`; put 70_sec_bp.js:898-910 |
| `DeprBlockTot40Percent` | `ScheduleDCG/SummaryFromDeprSchCG/PlantMachinerySummaryCG/DeprBlockTot40Percent` | yes† | COMPUTED | engBp(): `dcg.pm40 = dpm.r40.cg50`; put 70_sec_bp.js:898-910 |
| `DeprBlockTot45Percent` | `ScheduleDCG/SummaryFromDeprSchCG/PlantMachinerySummaryCG/DeprBlockTot45Percent` | yes† | COMPUTED | engBp(): `dcg.pm45 = dpm.r45.cg50`; put 70_sec_bp.js:898-910 |
| `TotPlntMach` | `ScheduleDCG/SummaryFromDeprSchCG/PlantMachinerySummaryCG/TotPlntMach` | yes† | COMPUTED | engBp(): `dcg.totPM = pm15+pm30+pm40+pm45  [J26]`; put 70_sec_bp.js:898-910 |
| `DeprBlockTot5Percent` | `ScheduleDCG/SummaryFromDeprSchCG/BuildingSummaryCG/DeprBlockTot5Percent` | yes† | COMPUTED | engBp(): `dcg.b5 = doa.b5.cg50`; put 70_sec_bp.js:898-910 |
| `DeprBlockTot10Percent` | `ScheduleDCG/SummaryFromDeprSchCG/BuildingSummaryCG/DeprBlockTot10Percent` | yes† | COMPUTED | engBp(): `dcg.b10 = doa.b10.cg50`; put 70_sec_bp.js:898-910 |
| `DeprBlockTot40Percent` | `ScheduleDCG/SummaryFromDeprSchCG/BuildingSummaryCG/DeprBlockTot40Percent` | yes† | COMPUTED | engBp(): `dcg.pm40 = dpm.r40.cg50`; put 70_sec_bp.js:898-910 |
| `TotBuildng` | `ScheduleDCG/SummaryFromDeprSchCG/BuildingSummaryCG/TotBuildng` | yes† | COMPUTED | engBp(): `dcg.totBld = b5+b10+b40  [J31]`; put 70_sec_bp.js:898-910 |
| `FurnitureSummary` | `ScheduleDCG/SummaryFromDeprSchCG/FurnitureSummary` | no | COMPUTED | engBp(): `dcg.furn = doa.furn.cg50`; put 70_sec_bp.js:898-910 |
| `IntangibleAssetSummary` | `ScheduleDCG/SummaryFromDeprSchCG/IntangibleAssetSummary` | no | COMPUTED | engBp(): `dcg.intang = doa.intang.cg50`; put 70_sec_bp.js:898-910 |
| `ShipsSummary` | `ScheduleDCG/SummaryFromDeprSchCG/ShipsSummary` | no | COMPUTED | engBp(): `dcg.ships = doa.ships.cg50`; put 70_sec_bp.js:898-910 |
| `TotalDepreciation` | `ScheduleDCG/SummaryFromDeprSchCG/TotalDepreciation` | yes† | COMPUTED | engBp(): `dcg.total = 1e+2d+3+4+5 (signed)  [J35] → Sch CG`; put 70_sec_bp.js:898-910 |

### `ScheduleESR` — 30 leaves

| leaf | schema path | required? | class | evidence |
|---|---|---|---|---|
| `AmtDebPL` | `ScheduleESR/DeductionUs35/Section35_1_i/DeductUs35/AmtDebPL` | yes† | INPUT | data-p `esr.i.deb` (70_sec_bp.js:608) |
| `AmtUs35Allowable` | `ScheduleESR/DeductionUs35/Section35_1_i/DeductUs35/AmtUs35Allowable` | yes† | INPUT | data-p `esr.i.allow` (70_sec_bp.js:609) |
| `ExcessAmtOverDebPL` | `ScheduleESR/DeductionUs35/Section35_1_i/DeductUs35/ExcessAmtOverDebPL` | yes† | COMPUTED | engBp(): `excess = MAX(0, allow − deb)` [G5]; put 70_sec_bp.js:921 |
| `AmtDebPL` | `ScheduleESR/DeductionUs35/Section35_1_ii/DeductUs35/AmtDebPL` | yes† | INPUT | data-p `esr.ii.deb` (70_sec_bp.js:608) |
| `AmtUs35Allowable` | `ScheduleESR/DeductionUs35/Section35_1_ii/DeductUs35/AmtUs35Allowable` | yes† | INPUT | data-p `esr.ii.allow` (70_sec_bp.js:609) |
| `ExcessAmtOverDebPL` | `ScheduleESR/DeductionUs35/Section35_1_ii/DeductUs35/ExcessAmtOverDebPL` | yes† | COMPUTED | engBp(): `excess = MAX(0, allow − deb)` [G5]; put 70_sec_bp.js:921 |
| `AmtDebPL` | `ScheduleESR/DeductionUs35/Section35_1_iia/DeductUs35/AmtDebPL` | yes† | INPUT | data-p `esr.iii.deb` (70_sec_bp.js:608) |
| `AmtUs35Allowable` | `ScheduleESR/DeductionUs35/Section35_1_iia/DeductUs35/AmtUs35Allowable` | yes† | INPUT | data-p `esr.iii.allow` (70_sec_bp.js:609) |
| `ExcessAmtOverDebPL` | `ScheduleESR/DeductionUs35/Section35_1_iia/DeductUs35/ExcessAmtOverDebPL` | yes† | COMPUTED | engBp(): `excess = MAX(0, allow − deb)` [G5]; put 70_sec_bp.js:921 |
| `AmtDebPL` | `ScheduleESR/DeductionUs35/Section35_1_iii/DeductUs35/AmtDebPL` | yes† | INPUT | data-p `esr.iv.deb` (70_sec_bp.js:608) |
| `AmtUs35Allowable` | `ScheduleESR/DeductionUs35/Section35_1_iii/DeductUs35/AmtUs35Allowable` | yes† | INPUT | data-p `esr.iv.allow` (70_sec_bp.js:609) |
| `ExcessAmtOverDebPL` | `ScheduleESR/DeductionUs35/Section35_1_iii/DeductUs35/ExcessAmtOverDebPL` | yes† | COMPUTED | engBp(): `excess = MAX(0, allow − deb)` [G5]; put 70_sec_bp.js:921 |
| `AmtDebPL` | `ScheduleESR/DeductionUs35/Section35_1_iv/DeductUs35/AmtDebPL` | yes† | INPUT | data-p `esr.v.deb` (70_sec_bp.js:608) |
| `AmtUs35Allowable` | `ScheduleESR/DeductionUs35/Section35_1_iv/DeductUs35/AmtUs35Allowable` | yes† | INPUT | data-p `esr.v.allow` (70_sec_bp.js:609) |
| `ExcessAmtOverDebPL` | `ScheduleESR/DeductionUs35/Section35_1_iv/DeductUs35/ExcessAmtOverDebPL` | yes† | COMPUTED | engBp(): `excess = MAX(0, allow − deb)` [G5]; put 70_sec_bp.js:921 |
| `AmtDebPL` | `ScheduleESR/DeductionUs35/Section35_2AA/DeductUs35/AmtDebPL` | yes† | INPUT | data-p `esr.vi.deb` (70_sec_bp.js:608) |
| `AmtUs35Allowable` | `ScheduleESR/DeductionUs35/Section35_2AA/DeductUs35/AmtUs35Allowable` | yes† | INPUT | data-p `esr.vi.allow` (70_sec_bp.js:609) |
| `ExcessAmtOverDebPL` | `ScheduleESR/DeductionUs35/Section35_2AA/DeductUs35/ExcessAmtOverDebPL` | yes† | COMPUTED | engBp(): `excess = MAX(0, allow − deb)` [G5]; put 70_sec_bp.js:921 |
| `AmtDebPL` | `ScheduleESR/DeductionUs35/Section35_2AB/DeductUs35/AmtDebPL` | yes† | INPUT | data-p `esr.vii.deb` (70_sec_bp.js:608) |
| `AmtUs35Allowable` | `ScheduleESR/DeductionUs35/Section35_2AB/DeductUs35/AmtUs35Allowable` | yes† | INPUT | data-p `esr.vii.allow` (70_sec_bp.js:609) |
| `ExcessAmtOverDebPL` | `ScheduleESR/DeductionUs35/Section35_2AB/DeductUs35/ExcessAmtOverDebPL` | yes† | COMPUTED | engBp(): `excess = MAX(0, allow − deb)` [G5]; put 70_sec_bp.js:921 |
| `AmtDebPL` | `ScheduleESR/DeductionUs35/Section35_CCC/DeductUs35/AmtDebPL` | yes† | INPUT | data-p `esr.viii.deb` (70_sec_bp.js:608) |
| `AmtUs35Allowable` | `ScheduleESR/DeductionUs35/Section35_CCC/DeductUs35/AmtUs35Allowable` | yes† | INPUT | data-p `esr.viii.allow` (70_sec_bp.js:609) |
| `ExcessAmtOverDebPL` | `ScheduleESR/DeductionUs35/Section35_CCC/DeductUs35/ExcessAmtOverDebPL` | yes† | COMPUTED | engBp(): `excess = MAX(0, allow − deb)` [G5]; put 70_sec_bp.js:921 |
| `AmtDebPL` | `ScheduleESR/DeductionUs35/Section35_CCD/DeductUs35/AmtDebPL` | yes† | INPUT | data-p `esr.ix.deb` (70_sec_bp.js:608) |
| `AmtUs35Allowable` | `ScheduleESR/DeductionUs35/Section35_CCD/DeductUs35/AmtUs35Allowable` | yes† | INPUT | data-p `esr.ix.allow` (70_sec_bp.js:609) |
| `ExcessAmtOverDebPL` | `ScheduleESR/DeductionUs35/Section35_CCD/DeductUs35/ExcessAmtOverDebPL` | yes† | COMPUTED | engBp(): `excess = MAX(0, allow − deb)` [G5]; put 70_sec_bp.js:921 |
| `AmtDebPL` | `ScheduleESR/DeductionUs35/TotUs35/DeductUs35/AmtDebPL` | yes† | COMPUTED | engBp(): `esr.totDeb = SUM col(2) [E14]`; put 70_sec_bp.js:923-925 |
| `AmtUs35Allowable` | `ScheduleESR/DeductionUs35/TotUs35/DeductUs35/AmtUs35Allowable` | yes† | COMPUTED | engBp(): `esr.totAllow = SUM col(3) [F14]`; put 70_sec_bp.js:923-925 |
| `ExcessAmtOverDebPL` | `ScheduleESR/DeductionUs35/TotUs35/DeductUs35/ExcessAmtOverDebPL` | yes† | COMPUTED | engBp(): `esr.totExcess = MAX(0,SUM col(4)) [G14] → BP A28`; put 70_sec_bp.js:923-925 |

### `ScheduleICDS` — 32 leaves

| leaf | schema path | required? | class | evidence |
|---|---|---|---|---|
| `IncreaseInProfit` | `ScheduleICDS/AccPolicyAmtDetl/IncreaseInProfit` | no | INPUT | data-p `icds.acc.inc` (70_sec_bp.js:632) |
| `DecreaseInProfit` | `ScheduleICDS/AccPolicyAmtDetl/DecreaseInProfit` | no | INPUT | data-p `icds.acc.dec` (70_sec_bp.js:633) |
| `NetEffect` | `ScheduleICDS/AccPolicyAmtDetl/NetEffect` | no | COMPUTED | engBp(): `net = inc − dec` [H6]; put 70_sec_bp.js:937 |
| `IncreaseInProfit` | `ScheduleICDS/InventoriesValueDetl/IncreaseInProfit` | no | INPUT | data-p `icds.inv.inc` (70_sec_bp.js:632) |
| `DecreaseInProfit` | `ScheduleICDS/InventoriesValueDetl/DecreaseInProfit` | no | INPUT | data-p `icds.inv.dec` (70_sec_bp.js:633) |
| `NetEffect` | `ScheduleICDS/InventoriesValueDetl/NetEffect` | no | COMPUTED | engBp(): `net = inc − dec` [H6]; put 70_sec_bp.js:937 |
| `IncreaseInProfit` | `ScheduleICDS/ConstContractsAmtDetl/IncreaseInProfit` | no | INPUT | data-p `icds.cons.inc` (70_sec_bp.js:632) |
| `DecreaseInProfit` | `ScheduleICDS/ConstContractsAmtDetl/DecreaseInProfit` | no | INPUT | data-p `icds.cons.dec` (70_sec_bp.js:633) |
| `NetEffect` | `ScheduleICDS/ConstContractsAmtDetl/NetEffect` | no | COMPUTED | engBp(): `net = inc − dec` [H6]; put 70_sec_bp.js:937 |
| `IncreaseInProfit` | `ScheduleICDS/RevenueRcgAmtDetl/IncreaseInProfit` | no | INPUT | data-p `icds.rev.inc` (70_sec_bp.js:632) |
| `DecreaseInProfit` | `ScheduleICDS/RevenueRcgAmtDetl/DecreaseInProfit` | no | INPUT | data-p `icds.rev.dec` (70_sec_bp.js:633) |
| `NetEffect` | `ScheduleICDS/RevenueRcgAmtDetl/NetEffect` | no | COMPUTED | engBp(): `net = inc − dec` [H6]; put 70_sec_bp.js:937 |
| `IncreaseInProfit` | `ScheduleICDS/TangibleFixedAssetDetl/IncreaseInProfit` | no | INPUT | data-p `icds.tfa.inc` (70_sec_bp.js:632) |
| `DecreaseInProfit` | `ScheduleICDS/TangibleFixedAssetDetl/DecreaseInProfit` | no | INPUT | data-p `icds.tfa.dec` (70_sec_bp.js:633) |
| `NetEffect` | `ScheduleICDS/TangibleFixedAssetDetl/NetEffect` | no | COMPUTED | engBp(): `net = inc − dec` [H6]; put 70_sec_bp.js:937 |
| `IncreaseInProfit` | `ScheduleICDS/ForeignExgRatesDetl/IncreaseInProfit` | no | INPUT | data-p `icds.fx.inc` (70_sec_bp.js:632) |
| `DecreaseInProfit` | `ScheduleICDS/ForeignExgRatesDetl/DecreaseInProfit` | no | INPUT | data-p `icds.fx.dec` (70_sec_bp.js:633) |
| `NetEffect` | `ScheduleICDS/ForeignExgRatesDetl/NetEffect` | no | COMPUTED | engBp(): `net = inc − dec` [H6]; put 70_sec_bp.js:937 |
| `IncreaseInProfit` | `ScheduleICDS/GovtGrantsDetl/IncreaseInProfit` | no | INPUT | data-p `icds.grant.inc` (70_sec_bp.js:632) |
| `DecreaseInProfit` | `ScheduleICDS/GovtGrantsDetl/DecreaseInProfit` | no | INPUT | data-p `icds.grant.dec` (70_sec_bp.js:633) |
| `NetEffect` | `ScheduleICDS/GovtGrantsDetl/NetEffect` | no | COMPUTED | engBp(): `net = inc − dec` [H6]; put 70_sec_bp.js:937 |
| `IncreaseInProfit` | `ScheduleICDS/SecuritiesDetl/IncreaseInProfit` | no | INPUT | data-p `icds.sec.inc` (70_sec_bp.js:632) |
| `DecreaseInProfit` | `ScheduleICDS/SecuritiesDetl/DecreaseInProfit` | no | INPUT | data-p `icds.sec.dec` (70_sec_bp.js:633) |
| `NetEffect` | `ScheduleICDS/SecuritiesDetl/NetEffect` | no | COMPUTED | engBp(): `net = inc − dec` [H6]; put 70_sec_bp.js:937 |
| `IncreaseInProfit` | `ScheduleICDS/BorrowingCostsDetl/IncreaseInProfit` | no | INPUT | data-p `icds.borr.inc` (70_sec_bp.js:632) |
| `DecreaseInProfit` | `ScheduleICDS/BorrowingCostsDetl/DecreaseInProfit` | no | INPUT | data-p `icds.borr.dec` (70_sec_bp.js:633) |
| `NetEffect` | `ScheduleICDS/BorrowingCostsDetl/NetEffect` | no | COMPUTED | engBp(): `net = inc − dec` [H6]; put 70_sec_bp.js:937 |
| `IncreaseInProfit` | `ScheduleICDS/ProvAssetsDetl/IncreaseInProfit` | no | INPUT | data-p `icds.prov.inc` (70_sec_bp.js:632) |
| `DecreaseInProfit` | `ScheduleICDS/ProvAssetsDetl/DecreaseInProfit` | no | INPUT | data-p `icds.prov.dec` (70_sec_bp.js:633) |
| `NetEffect` | `ScheduleICDS/ProvAssetsDetl/NetEffect` | no | COMPUTED | engBp(): `net = inc − dec` [H6]; put 70_sec_bp.js:937 |
| `IncreaseInProfit` | `ScheduleICDS/TotalNetAmtDetl/IncreaseInProfit` | no | COMPUTED | engBp(): `icds.totInc = MAX(0,SUM) [F16] → OI 3a / BP A25`; put 70_sec_bp.js:939-940 |
| `DecreaseInProfit` | `ScheduleICDS/TotalNetAmtDetl/DecreaseInProfit` | no | COMPUTED | engBp(): `icds.totDec = MAX(0,SUM) [G16] → OI 3b / BP A32`; put 70_sec_bp.js:939-940 |
## Conditional emission — every gate checked against the schema's `required`

The export omits some leaves on purpose. Each gate was checked against the schema `required` chain; none of them can drop a leaf the schema demands.

| gate (`forms/ITR-5/src/70_sec_bp.js`) | leaves affected | schema position | safe? |
|---|---|---|---|
| `if(n0(B.a3f))` :666 · `if(n0(B.e7f))` :695 | `…/UnderSec115BBH` (×2) | optional in `IncRecCredPLOthHeadDtls` / `ExpDebToPLOthHeadDtls` | yes |
| `if(n0(B.a5A))` :688 | `IncCredPLNotChargable` | optional | yes |
| `if(n0(B.d21_*))` :713-724 | the twelve `DeemIncUs32AC` … `DeemIncUs80IA` | all optional | yes |
| `if(oth.length)` :685 | `OtherExmptIncDtls[]` | array optional; item `required: []` | yes |
| `if(n0(Cp._47))` :773 | `DedSec35AD` | optional | yes |
| `if(clauses.length)` :776 | `DedUs35ADSubSec5Dtls[]` | array optional; item requires `DedUs35ADSubSec5`, which the `.map()` at :775 always supplies | yes |
| `if(E.specInc)` :784 · `if(E.specifiedInc)` :789 | `SpeculativeInc.*`, `SpecifiedInc.*` (3 + 3) | **both objects are optional** inside `BusSetoffCurrYr`, whose `required` is only `LossSetOffOnBusLoss`, `TotLossSetOffOnBus`, `LossRemainSetOffOnBus` | yes |
| `if(!bar115BAC()&&N(raw.AdjustmentSec115BAC))` :804 | `AdjustmentSec115BAC` (DPM ×4) | optional | yes — DPM_DOA.md:123 "not allowed to firm/LLP/co-op or under new regime" |
| `if(N(raw.AdjustmentSec115BAC)\|\|blk.tot3)` :805 | `Total` (DPM ×4) | optional | yes |
| `if(!opts.fullOnly)` :806, :809-813, :815 | Rate45's additions / half-rate leaves | **Rate45 has no such leaves in the schema** | yes — DPM_DOA.md:46 |
| `if(!opts.fullOnly&&!isNew())` :816 | the three `AddlnDepr*` (DPM) | optional | yes — DPM_DOA.md:84 |
| `if(!anyDOA(src)&&…)return false` :843 | a whole DOA asset block | `ScheduleDOA.required = []`; each asset group `required = []` | yes — DPM_DOA.md:109 |
| `if(N(landRaw.WDVFirstDay))` :865 | `ScheduleDOA.Land.*` | `Land` optional; when present both its required leaves are written together (:866-867) | yes |
| `if(hasDep)` :880 | all of `ScheduleDEP` + `ScheduleDCG` | both optional at root | yes |
| `if(n0(dep.furn))` :892-894 · `if(sg(dcg.furn))` :907-909 | `FurnitureSummary` / `IntangibleAssetSummary` / `ShipsSummary` (DEP + DCG) | optional in both summaries | yes |
| `if(esr.totDeb\|\|esr.totAllow)` :915 | all of `ScheduleESR` | optional at root | yes |
| `if(icds.filled)` :930 | all of `ScheduleICDS` | optional at root; `TotalNetAmtDetl` (the one required child) always written at :939-940 | yes |
| `if(!(o.inc\|\|o.dec))return` :933 | one `ICDSinfo` row | `ICDSinfo.required = []` | yes |

`put()` (`forms/ITR-5/Yukti_ITR5.html:17601`) writes zeros — it only skips `undefined` / `null` / `""` — and `n0` / `sg` always return a number, so an ungated required leaf is never dropped for being zero. Confirmed empirically: with a **completely empty state**, `CorpScheduleBP` is still emitted with every mandatory leaf.

## Findings beyond the leaf census

### 1. Schedule DOA renders a `3b` "Adjustment u/s 115BAC" input the schema does not have — and it silently inflates the exported depreciation

`blockCol()` renders the 3b row for **every** block it draws (`forms/ITR-5/src/70_sec_bp.js:525`):

```js
if(!bar115BAC())h+='<tr><td class="l">3b Adjustment 2nd proviso s.115BAC (Rule 5)</td>'+iN("AdjustmentSec115BAC")+'</tr>';
```

`blockCol()` also serves the six DOA asset blocks (`oneBlockTable("Building @ 5%","doa.b5",…)` :573-578), so an AOP / BOI / AJP / trust filing under the old regime gets an editable `doa.b5.AdjustmentSec115BAC` field.

`ScheduleDOA…DepreciationDetail` has **no** `AdjustmentSec115BAC` leaf and no `Total` leaf, and `putDOA()` (:842-870) correctly never writes them. But `bpBlock()` (:175-176) still folds the value into the arithmetic for DOA:

```js
const adj = bar115BAC()?0:N(b.AdjustmentSec115BAC);
const tot3 = wdv + adj;
```

Measured on the live form (AOP, old regime, `doa.b5.WDVFirstDay = 10,00,000`, `AdjustmentSec115BAC = 5,00,000`), the exported Building@5% block is:

```
WDVFirstDay               10,00,000
AdditionsGrThan180Days            0
RealizationTotalPeriod            0
FullRateDeprAmt           15,00,000   <-- should be 3 + 4 - 5 = 10,00,000
DepreciationAtFullRate       75,000   <-- 5% of the inflated base (should be 50,000)
TotalDepreciation            75,000
NetAggregateDepreciation     75,000
WDVLastDay                14,25,000   <-- exceeds WDVFirstDay with no additions
```

Three consequences:

- the exported block is internally inconsistent — `FullRateDeprAmt` no longer equals `WDVFirstDay + AdditionsGrThan180Days − RealizationTotalPeriod`, a relation the portal cross-checks;
- `ScheduleDEP` / `ScheduleDCG` and therefore BP `A12i` inherit the inflated depreciation;
- the figure is unrecoverable — `impBp()` (:947 ff.) restores `S.doa.*` from the exported `DepreciationDetail`, which never carried it, so a save / reload silently changes the return.

The book is explicit that this row is DPM-only:

- `books/ITR-5/DPM_DOA.md:118` — "User enters: WDV first day, **115BAC adjustment (DPM only)**, additions (>180 & <180), realizations, additional depreciation (DPM only, sl.12/13/14), 38(2) disallowance, proportionate depreciation, transfer expenditure, and capital gains u/s 50."
- `books/ITR-5/DPM_DOA.md:92` — DOA WDV-last-day `[G51] = MAX(WDVFirstDay + AdditionsGrThan180Days − RealizationTotalPeriod + AdditionsLessThan180Days − RealizationPeriodDuringYear − TotalDepreciation, 0)` — no `3b` term.
- the DOA row list in the book starts at "**3** WDV on first day", not `3a` / `3b`.

**Fix:** gate the 3b row and the `adj` term on the same flag that already hides the `Total` row for DOA — `blockCol()` receives `opts.total:false` on every DOA call, and `bpBlock()` should take a matching option so `adj` is forced to 0 for DOA.

### 2. `ScheduleDPM` is emitted unconditionally, even when there is no depreciation at all

`putDPM()` is called for all four rate blocks with no guard (`forms/ITR-5/src/70_sec_bp.js:829-832`), so a return with no plant & machinery still carries a full `ScheduleDPM` of zeros — verified on an empty state (`ScheduleDPM` present; `ScheduleDOA` / `DEP` / `DCG` / `ESR` / `ICDS` all absent). This is schema-valid (`ScheduleDPM` is optional at root; when present `PlantMachinery` is required and every required `DepreciationDetail` leaf is written) and the baseline return validates with 0 errors, so it is **not** a leaf failure. Flagged only because every sibling schedule in this section is gated and DPM is the lone exception — worth a deliberate decision rather than an accident.

## Method / reproducibility

1. Leaves enumerated straight from the schema by walking `properties` / `items` with `$ref` resolution; a leaf is a property with no nested `properties` / `items`. 394 leaves across the seven blocks (`CorpScheduleBP` 132, `ScheduleDOA` 98, `ScheduleDPM` 76, `ScheduleICDS` 32, `ScheduleESR` 30, `ScheduleDEP` 13, `ScheduleDCG` 13).
2. `put()` targets extracted from `expBp()` (:650-945), with the `P` / `IR` / `DP` / `SB` / `SC` / `BE` / `PM` / `BD` / `CG` prefix constants resolved and the `putDPM` / `putDOA` / `ESR_ROWS` / `ICDS_ROWS` templates expanded over their call sites.
3. Value sources traced: `B.<k>` → `S.bp.<k>` → the `inp` / `inpN` / `sel` / `grid` call that renders its `data-p`; `A` / `Bp` / `Cp` / `E` / `blk` / `dep` / `dcg` / `esr` / `icds` → the assignment in `engBp()` (:205-374) or `bpBlock()` (:168-201). Every `S.bp.*` key the export reads has a field; every computed key the export reads is assigned. Neither set has a dangling member.
4. Empirical confirmation with Playwright against `forms/ITR-5/Yukti_ITR5.html`: a max-fill state (every `data-p` in the section set to a distinct non-zero value; AOP + old regime so the 115BAC and 35AD(1) gates are open) → `buildReturn()` → leaf diff (394 / 394, 0 extra) and `jsonschema` Draft-4 validation (0 errors in these seven blocks; the 3 residual errors in the whole document are in `Schedule112A` / `ScheduleCG`, other areas). The DOA `3b` defect was measured the same way.

`set()` (`Yukti_ITR5.html:17344`) auto-creates intermediate objects, so the nested field paths `dpm.r15.*`, `doa.*.*`, `esr.<row>.*`, `icds.<row>.*` all commit correctly even though `S.esr` / `S.icds` start empty.

Nothing under `forms/` or `books/` was modified.
