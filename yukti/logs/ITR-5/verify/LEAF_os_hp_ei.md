# ITR-5 · LEAF-COVERAGE CHECK — AREA `os_hp_ei`

**Schema:** `sources/ITR-5/ITR-5_2026_Main_V1_1_schema.json` (V1.1, AY 2026-27)  
**Blocks audited:** `ITR5.ScheduleOS` (all nested, incl. the ten quarterly `DateRange` blocks and the 2e DTAA table), `ITR5.ScheduleHP` (all nested), `ITR5.ScheduleEI` (all nested)  
**Built software checked:** `forms/ITR-5/Yukti_ITR5.html` (assembled) and `forms/ITR-5/src/70_sec_os.js`, `70_sec_hp.js`, `70_sec_ei.js`  
**Leaves enumerated:** 182 (OS 114 · HP 42 · EI 26) — walked from the schema with `$ref` resolution against `definitions`, recursing `properties`/`items`; a leaf is a property with no nested `properties`/`items`.

> Assembly verified: every non-blank line of all three `70_sec_*.js` files is present verbatim in `Yukti_ITR5.html`, so the evidence below holds for the shipped form.
> `inp(p,…)` emits `data-p="p"`, `sel(p,…)` emits `data-p="p"`, and `grid(key,cols,…)` emits `data-p="key.<i>.<col.k>"` (`Yukti_ITR5.html:17387-17398`) — so a grid column reference below is a real on-screen field.

## Result

### ✅ ZERO ORPHANS — and zero required-leaf orphans.

Every one of the 182 leaves under ScheduleOS, ScheduleHP and ScheduleEI has a home: a `data-p` field on screen that reaches it through the section's `exp()`, or an engine expression that derives it and an export line that writes it. Nothing in these three blocks is NA either — ITR-5 builds all of them.

| bucket | count |
|---|---:|
| INPUT | 147 |
| COMPUTED | 35 |
| NA | 0 |
| ORPHAN | 0 |
| **total** | **182** |

| schedule | leaves | INPUT | COMPUTED | NA | ORPHAN | required leaves |
|---|---:|---:|---:|---:|---:|---:|
| `ScheduleOS` | 114 | 97 | 17 | 0 | 0 | 102 |
| `ScheduleHP` | 42 | 29 | 13 | 0 | 0 | 31 |
| `ScheduleEI` | 26 | 21 | 5 | 0 | 0 | 11 |
| **all three** | **182** | **147** | **35** | **0** | **0** | **144** |

**ORPHAN list: _(empty)_** — there is no required-leaf orphan and no optional-leaf orphan in this area. The return can be filed from these three schedules.

---


## `ScheduleOS` — 114 leaves  <sub>(forms/ITR-5/src/70_sec_os.js)</sub>

| leaf | schema path | required? | class | evidence |
|---|---|:-:|:-:|---|
| `GrossIncChrgblTaxAtAppRate` | `/ScheduleOS/IncOthThanOwnRaceHorse/GrossIncChrgblTaxAtAppRate` | **REQ** | **COMPUTED** | engOs `const item1 = a1+b1+c1+d1+e1` (P4) → expOs `GrossIncChrgblTaxAtAppRate: sg(C.item1)` |
| `DividendGross` | `/ScheduleOS/IncOthThanOwnRaceHorse/DividendGross` | **REQ** | **COMPUTED** | engOs `const a1 = div_i+div_ii+div_iii` (N5, rule 495) → `DividendGross: sg(a1.tot)` |
| `DividendOthThan22e` | `/ScheduleOS/IncOthThanOwnRaceHorse/DividendOthThan22e` | **REQ** | **INPUT** | `data-p="os.divOth"` — row 1a(i) `inp("os.divOth",{n:1})` (os.js:439) |
| `Dividend22e` | `/ScheduleOS/IncOthThanOwnRaceHorse/Dividend22e` | **REQ** | **INPUT** | `data-p="os.div22e"` — row 1a(ii) (os.js:440) |
| `Dividend22f` | `/ScheduleOS/IncOthThanOwnRaceHorse/Dividend22f` | — | **INPUT** | `data-p="os.div22f"` — row 1a(iii) buy-back (os.js:441); guarded emit `if(R(O.div22f)) io.Dividend22f=sg(...)` |
| `InterestGross` | `/ScheduleOS/IncOthThanOwnRaceHorse/InterestGross` | **REQ** | **COMPUTED** | engOs `const b1 = bi+bii+biii+biv+bv` (N9, rule 490) → `InterestGross: sg(b1.tot)` |
| `IntrstFrmSavingBank` | `/ScheduleOS/IncOthThanOwnRaceHorse/IntrstFrmSavingBank` | **REQ** | **INPUT** | `data-p="os.intSaving"` — 1b(i) (os.js:445) |
| `IntrstFrmTermDeposit` | `/ScheduleOS/IncOthThanOwnRaceHorse/IntrstFrmTermDeposit` | **REQ** | **INPUT** | `data-p="os.intDeposit"` — 1b(ii) (os.js:446) |
| `IntrstFrmIncmTaxRefund` | `/ScheduleOS/IncOthThanOwnRaceHorse/IntrstFrmIncmTaxRefund` | **REQ** | **INPUT** | `data-p="os.intRefund"` — 1b(iii) (os.js:447) |
| `NatofPassThrghIncome` | `/ScheduleOS/IncOthThanOwnRaceHorse/NatofPassThrghIncome` | **REQ** | **INPUT** | `data-p="os.intPTI"` — 1b(iv) pass-through interest, may be negative (os.js:448) |
| `IntrstFrmOthers` | `/ScheduleOS/IncOthThanOwnRaceHorse/IntrstFrmOthers` | **REQ** | **INPUT** | `data-p="os.intOthers"` — 1b(v) (os.js:449) |
| `RentFromMachPlantBldgs` | `/ScheduleOS/IncOthThanOwnRaceHorse/RentFromMachPlantBldgs` | **REQ** | **INPUT** | `data-p="os.rentMach"` — 1c (os.js:451) |
| `Tot562x` | `/ScheduleOS/IncOthThanOwnRaceHorse/Tot562x` | **REQ** | **COMPUTED** | engOs `const d1 = d_i+d_ii+d_iii+d_iv+d_v` (N16, rule 478) → `Tot562x: n0(d1.tot)` |
| `Aggrtvaluewithoutcons562x` | `/ScheduleOS/IncOthThanOwnRaceHorse/Aggrtvaluewithoutcons562x` | **REQ** | **INPUT** | `data-p="os.giftMoney"` — 1d(i) (os.js:455) |
| `Immovpropwithoutcons562x` | `/ScheduleOS/IncOthThanOwnRaceHorse/Immovpropwithoutcons562x` | **REQ** | **INPUT** | `data-p="os.giftImmovWo"` — 1d(ii) (os.js:456) |
| `Immovpropinadeqcons562x` | `/ScheduleOS/IncOthThanOwnRaceHorse/Immovpropinadeqcons562x` | **REQ** | **INPUT** | `data-p="os.giftImmovInadeq"` — 1d(iii) (os.js:457) |
| `Anyotherpropwithoutcons562x` | `/ScheduleOS/IncOthThanOwnRaceHorse/Anyotherpropwithoutcons562x` | **REQ** | **INPUT** | `data-p="os.giftOthWo"` — 1d(iv) (os.js:458) |
| `Anyotherpropinadeqcons562x` | `/ScheduleOS/IncOthThanOwnRaceHorse/Anyotherpropinadeqcons562x` | **REQ** | **INPUT** | `data-p="os.giftOthInadeq"` — 1d(v) (os.js:459) |
| `SumRecdPrYrBusTRU562xii` | `/ScheduleOS/IncOthThanOwnRaceHorse/SumRecdPrYrBusTRU562xii` | — | **INPUT** | `data-p="os.sum562xii"` — 1e 56(2)(xii) fixed line (os.js:468); guarded emit |
| `AnyOtherIncome` | `/ScheduleOS/IncOthThanOwnRaceHorse/AnyOtherIncome` | **REQ** | **COMPUTED** | engOs `const e1 = othersSum + x562xii` (N22) → `AnyOtherIncome: sg(e1.tot)` |
| `OthNatOfInc` | `/ScheduleOS/IncOthThanOwnRaceHorse/OthersInc/OthersIncDtls[]/OthNatOfInc` | **REQ** | **INPUT** | grid `os.others` col `nat` → `data-p="os.others.<i>.nat"` (os.js:463-466) |
| `OthAmount` | `/ScheduleOS/IncOthThanOwnRaceHorse/OthersInc/OthersIncDtls[]/OthAmount` | **REQ** | **INPUT** | grid `os.others` col `amt` → `data-p="os.others.<i>.amt"` |
| `IncChargeableSpecialRates` | `/ScheduleOS/IncOthThanOwnRaceHorse/IncChargeableSpecialRates` | **REQ** | **COMPUTED** | engOs `item2 = Math.max(0, s2ai+s2aii+b2+c2+d2+dtaaSpecial)` (P30, rule 489) |
| `LtryPzzlChrgblUs115BB` | `/ScheduleOS/IncOthThanOwnRaceHorse/LtryPzzlChrgblUs115BB` | **REQ** | **INPUT** | `data-p="os.win115BB"` — 2a(i) 115BB (os.js:477) |
| `IncChrgblUs115BBE` | `/ScheduleOS/IncOthThanOwnRaceHorse/IncChrgblUs115BBE` | **REQ** | **COMPUTED** | engOs `const b2 = cc68+ui69+um69a+udi69b+ue69c+hundi69d` (N36, rule 500) |
| `IncChrgblUs115BBJ` | `/ScheduleOS/IncOthThanOwnRaceHorse/IncChrgblUs115BBJ` | — | **INPUT** | `data-p="os.win115BBJ"` — 2a(ii) online games 115BBJ (os.js:478); guarded emit |
| `CashCreditsUs68` | `/ScheduleOS/IncOthThanOwnRaceHorse/CashCreditsUs68` | **REQ** | **INPUT** | `data-p="os.cc68"` — 2b(i) (os.js:481) |
| `UnExplndInvstmntsUs69` | `/ScheduleOS/IncOthThanOwnRaceHorse/UnExplndInvstmntsUs69` | **REQ** | **INPUT** | `data-p="os.ui69"` — 2b(ii) (os.js:482) |
| `UnExplndMoneyUs69A` | `/ScheduleOS/IncOthThanOwnRaceHorse/UnExplndMoneyUs69A` | **REQ** | **INPUT** | `data-p="os.um69a"` — 2b(iii) (os.js:483) |
| `UnDsclsdInvstmntsUs69B` | `/ScheduleOS/IncOthThanOwnRaceHorse/UnDsclsdInvstmntsUs69B` | **REQ** | **INPUT** | `data-p="os.udi69b"` — 2b(iv) (os.js:484) |
| `UnExplndExpndtrUs69C` | `/ScheduleOS/IncOthThanOwnRaceHorse/UnExplndExpndtrUs69C` | **REQ** | **INPUT** | `data-p="os.ue69c"` — 2b(v) (os.js:485) |
| `AmtBrwdRepaidOnHundiUs69D` | `/ScheduleOS/IncOthThanOwnRaceHorse/AmtBrwdRepaidOnHundiUs69D` | **REQ** | **INPUT** | `data-p="os.hundi69d"` — 2b(vi) (os.js:486) |
| `OthersGross` | `/ScheduleOS/IncOthThanOwnRaceHorse/OthersGross` | **REQ** | **COMPUTED** | engOs `const c2 = (O.spl\|\|[]).reduce(...)` (N43, rules 486/493) → `OthersGross: n0(C.c2)` |
| `SourceDescription` | `/ScheduleOS/IncOthThanOwnRaceHorse/OthersGrossDtls[]/SourceDescription` | **REQ** | **INPUT** | grid `os.spl` col `code` (sel, OS_SPL 23 codes) → `data-p="os.spl.<i>.code"` (os.js:489) |
| `SourceAmount` | `/ScheduleOS/IncOthThanOwnRaceHorse/OthersGrossDtls[]/SourceAmount` | **REQ** | **INPUT** | grid `os.spl` col `amt` → `data-p="os.spl.<i>.amt"` |
| `PassThrIncOSChrgblSplRate` | `/ScheduleOS/IncOthThanOwnRaceHorse/PassThrIncOSChrgblSplRate` | **REQ** | **COMPUTED** | engOs `const d2manual = (O.pti\|\|[]).reduce(...)` (N52, rule 477) → `PassThrIncOSChrgblSplRate: n0(C.d2)` |
| `SourceDescription` | `/ScheduleOS/IncOthThanOwnRaceHorse/PTIOthersGrossDtls[]/SourceDescription` | **REQ** | **INPUT** | grid `os.pti` col `code` (sel, OS_PTI) → `data-p="os.pti.<i>.code"` (os.js:496) |
| `SourceAmount` | `/ScheduleOS/IncOthThanOwnRaceHorse/PTIOthersGrossDtls[]/SourceAmount` | **REQ** | **INPUT** | grid `os.pti` col `amt` → `data-p="os.pti.<i>.amt"` |
| `TotalAmtTaxUsDTAASchOs` | `/ScheduleOS/IncOthThanOwnRaceHorse/IncChargblSplRateOS/TotalAmtTaxUsDTAASchOs` | **REQ** | **COMPUTED** | engOs `const f2 = dtaaRows.filter(r=>r.counts).reduce(...)` (N58) — always emitted |
| `DTAAamt` | `/ScheduleOS/IncOthThanOwnRaceHorse/IncChargblSplRateOS/NRIOsDTAA/NRIDTAADtlsSchOS[]/DTAAamt` | **REQ** | **INPUT** | grid `os.dtaa` col `amt` → `data-p="os.dtaa.<i>.amt"` (os.js:506) |
| `NatureOfIncome` | `/ScheduleOS/IncOthThanOwnRaceHorse/IncChargblSplRateOS/NRIOsDTAA/NRIDTAADtlsSchOS[]/NatureOfIncome` | **REQ** | **INPUT** | grid `os.dtaa` col `nature` (sel OS_DTAA_NAT) → `data-p="os.dtaa.<i>.nature"` |
| `CountryName` | `/ScheduleOS/IncOthThanOwnRaceHorse/IncChargblSplRateOS/NRIOsDTAA/NRIDTAADtlsSchOS[]/CountryName` | **REQ** | **INPUT** | grid `os.dtaa` col `cname` → `data-p="os.dtaa.<i>.cname"` |
| `CountryCodeExcludingIndia` | `/ScheduleOS/IncOthThanOwnRaceHorse/IncChargblSplRateOS/NRIOsDTAA/NRIDTAADtlsSchOS[]/CountryCodeExcludingIndia` | **REQ** | **INPUT** | grid `os.dtaa` col `cc` (sel OS_CC) → `data-p="os.dtaa.<i>.cc"` |
| `DTAAarticle` | `/ScheduleOS/IncOthThanOwnRaceHorse/IncChargblSplRateOS/NRIOsDTAA/NRIDTAADtlsSchOS[]/DTAAarticle` | **REQ** | **INPUT** | grid `os.dtaa` col `article` → `data-p="os.dtaa.<i>.article"` — see Defect D2 (max 20 vs schema 16) |
| `RateAsPerTreaty` | `/ScheduleOS/IncOthThanOwnRaceHorse/IncChargblSplRateOS/NRIOsDTAA/NRIDTAADtlsSchOS[]/RateAsPerTreaty` | **REQ** | **INPUT** | grid `os.dtaa` col `treaty` → `data-p="os.dtaa.<i>.treaty"`; "NIL" is read as 0 by engOs |
| `TaxRescertifiedFlag` | `/ScheduleOS/IncOthThanOwnRaceHorse/IncChargblSplRateOS/NRIOsDTAA/NRIDTAADtlsSchOS[]/TaxRescertifiedFlag` | — | **INPUT** | grid `os.dtaa` col `trc` (sel OS_TRC) → `data-p="os.dtaa.<i>.trc"`; guarded emit `if(r.trc)` |
| `ItemNoincl` | `/ScheduleOS/IncOthThanOwnRaceHorse/IncChargblSplRateOS/NRIOsDTAA/NRIDTAADtlsSchOS[]/ItemNoincl` | **REQ** | **INPUT** | grid `os.dtaa` col `itemno` (sel OS_DTAA_ITEM, 53 codes) → `data-p="os.dtaa.<i>.itemno"` |
| `RateAsPerITAct` | `/ScheduleOS/IncOthThanOwnRaceHorse/IncChargblSplRateOS/NRIOsDTAA/NRIDTAADtlsSchOS[]/RateAsPerITAct` | **REQ** | **INPUT** | grid `os.dtaa` col `itact` → `data-p="os.dtaa.<i>.itact"` |
| `ApplicableRate` | `/ScheduleOS/IncOthThanOwnRaceHorse/IncChargblSplRateOS/NRIOsDTAA/NRIDTAADtlsSchOS[]/ApplicableRate` | — | **COMPUTED** | engOs `const appl = nri ? (counts?Math.min(treaty,itact):"") : Math.min(treaty,itact)` (N60, rule 488); emitted `if(typeof r.appl==="number")`; shown as `t:"calc"` column |
| `Expenses` | `/ScheduleOS/IncOthThanOwnRaceHorse/Deductions/Expenses` | — | **INPUT** | `data-p="os.dExpenses"` — 3a (os.js:527); guarded emit `if(D.expenses)` |
| `UsrIntExp57` | `/ScheduleOS/IncOthThanOwnRaceHorse/Deductions/UsrIntExp57` | — | **INPUT** | `data-p="os.dIntClaimed"` — 3c interest claimed u/s 57(1) (os.js:530) |
| `IntExp57` | `/ScheduleOS/IncOthThanOwnRaceHorse/Deductions/IntExp57` | — | **COMPUTED** | engOs `eligInt = divForInt>0 ? Math.min(claimedInt, R(0.20*divForInt)) : 0` — 3c(i) 20% cap (rules 494-495) |
| `Depreciation` | `/ScheduleOS/IncOthThanOwnRaceHorse/Deductions/Depreciation` | **REQ** | **INPUT** | `data-p="os.dDep"` — 3b, rendered only when 1c>0 (`C.c1>0?inp("os.dDep"):cell(0)`, os.js:528, rule 473); always exported `Depreciation:n0(D.dep)` |
| `TotDeductions` | `/ScheduleOS/IncOthThanOwnRaceHorse/Deductions/TotDeductions` | **REQ** | **COMPUTED** | engOs `const totDed = dep + expenses + eligInt` (N74, rule 472) |
| `AmtNotDeductibleUs58` | `/ScheduleOS/IncOthThanOwnRaceHorse/AmtNotDeductibleUs58` | — | **INPUT** | `data-p="os.notDed58"` — item 4 (os.js:540); guarded emit |
| `ProfitChargTaxUs59` | `/ScheduleOS/IncOthThanOwnRaceHorse/ProfitChargTaxUs59` | — | **INPUT** | `data-p="os.profit59"` — item 5 (os.js:541); guarded emit |
| `BalanceNoRaceHorse` | `/ScheduleOS/IncOthThanOwnRaceHorse/BalanceNoRaceHorse` | **REQ** | **COMPUTED** | engOs `item6 = item1-totDed+Math.max(0,notDed58)+profit59-dtaaItem1` (P77, rules 487-488/507) |
| `TotOthSrcNoRaceHorse` | `/ScheduleOS/TotOthSrcNoRaceHorse` | **REQ** | **COMPUTED** | engOs `const item7 = Math.max(0,item6)+item2` (P78, rule 474) → `TotOthSrcNoRaceHorse: sg(C.item7)` |
| `Receipts` | `/ScheduleOS/IncFromOwnHorse/Receipts` | **REQ** | **INPUT** | `data-p="os.horse.receipts"` — 8a (os.js:553) |
| `DeductSec57` | `/ScheduleOS/IncFromOwnHorse/DeductSec57` | **REQ** | **INPUT** | `data-p="os.horse.ded57"` — 8b (os.js:554) |
| `AmtNotDeductibleUs58` | `/ScheduleOS/IncFromOwnHorse/AmtNotDeductibleUs58` | — | **INPUT** | `data-p="os.horse.notDed58"` — 8c (os.js:555); guarded emit |
| `ProfitChargTaxUs59` | `/ScheduleOS/IncFromOwnHorse/ProfitChargTaxUs59` | — | **INPUT** | `data-p="os.horse.profit59"` — 8d (os.js:556); guarded emit |
| `BalanceOwnRaceHorse` | `/ScheduleOS/IncFromOwnHorse/BalanceOwnRaceHorse` | **REQ** | **COMPUTED** | engOs `item8e = hReceipts-hDed57+hNot58+hProfit59` (P84, signed; <0 → CFL 11xvii) |
| `IncChargeableFrmOthSrc` | `/ScheduleOS/IncChargeableFrmOthSrc` | **REQ** | **COMPUTED** | engOs `const item9 = item7 + Math.max(0,item8e)` (P85, rule 476) → `OS.IncChargeableFrmOthSrc = sg(C.item9)` |
| `Upto15Of6` | `/ScheduleOS/IncFrmLottery/DateRange/Upto15Of6` | **REQ** | **INPUT** | item-10 quarterly table, `data-p="os.q.lottery.Upto15Of6"` (`inp("os.q."+qr.k+"."+pk,{n:1})`, os.js:572) — row: 2a(i) Winnings from lotteries/puzzles/races u/s 115BB |
| `Up16Of6To15Of9` | `/ScheduleOS/IncFrmLottery/DateRange/Up16Of6To15Of9` | **REQ** | **INPUT** | item-10 quarterly table, `data-p="os.q.lottery.Up16Of6To15Of9"` (`inp("os.q."+qr.k+"."+pk,{n:1})`, os.js:572) — row: 2a(i) Winnings from lotteries/puzzles/races u/s 115BB |
| `Up16Of9To15Of12` | `/ScheduleOS/IncFrmLottery/DateRange/Up16Of9To15Of12` | **REQ** | **INPUT** | item-10 quarterly table, `data-p="os.q.lottery.Up16Of9To15Of12"` (`inp("os.q."+qr.k+"."+pk,{n:1})`, os.js:572) — row: 2a(i) Winnings from lotteries/puzzles/races u/s 115BB |
| `Up16Of12To15Of3` | `/ScheduleOS/IncFrmLottery/DateRange/Up16Of12To15Of3` | **REQ** | **INPUT** | item-10 quarterly table, `data-p="os.q.lottery.Up16Of12To15Of3"` (`inp("os.q."+qr.k+"."+pk,{n:1})`, os.js:572) — row: 2a(i) Winnings from lotteries/puzzles/races u/s 115BB |
| `Up16Of3To31Of3` | `/ScheduleOS/IncFrmLottery/DateRange/Up16Of3To31Of3` | **REQ** | **INPUT** | item-10 quarterly table, `data-p="os.q.lottery.Up16Of3To31Of3"` (`inp("os.q."+qr.k+"."+pk,{n:1})`, os.js:572) — row: 2a(i) Winnings from lotteries/puzzles/races u/s 115BB |
| `Upto15Of6` | `/ScheduleOS/IncFrmOnGames/DateRange/Upto15Of6` | **REQ** | **INPUT** | item-10 quarterly table, `data-p="os.q.ongames.Upto15Of6"` (`inp("os.q."+qr.k+"."+pk,{n:1})`, os.js:572) — row: 2a(ii) Winnings from online games u/s 115BBJ |
| `Up16Of6To15Of9` | `/ScheduleOS/IncFrmOnGames/DateRange/Up16Of6To15Of9` | **REQ** | **INPUT** | item-10 quarterly table, `data-p="os.q.ongames.Up16Of6To15Of9"` (`inp("os.q."+qr.k+"."+pk,{n:1})`, os.js:572) — row: 2a(ii) Winnings from online games u/s 115BBJ |
| `Up16Of9To15Of12` | `/ScheduleOS/IncFrmOnGames/DateRange/Up16Of9To15Of12` | **REQ** | **INPUT** | item-10 quarterly table, `data-p="os.q.ongames.Up16Of9To15Of12"` (`inp("os.q."+qr.k+"."+pk,{n:1})`, os.js:572) — row: 2a(ii) Winnings from online games u/s 115BBJ |
| `Up16Of12To15Of3` | `/ScheduleOS/IncFrmOnGames/DateRange/Up16Of12To15Of3` | **REQ** | **INPUT** | item-10 quarterly table, `data-p="os.q.ongames.Up16Of12To15Of3"` (`inp("os.q."+qr.k+"."+pk,{n:1})`, os.js:572) — row: 2a(ii) Winnings from online games u/s 115BBJ |
| `Up16Of3To31Of3` | `/ScheduleOS/IncFrmOnGames/DateRange/Up16Of3To31Of3` | **REQ** | **INPUT** | item-10 quarterly table, `data-p="os.q.ongames.Up16Of3To31Of3"` (`inp("os.q."+qr.k+"."+pk,{n:1})`, os.js:572) — row: 2a(ii) Winnings from online games u/s 115BBJ |
| `Upto15Of6` | `/ScheduleOS/DividendIncUs115BBDA/DateRange/Upto15Of6` | **REQ** | **INPUT** | item-10 quarterly table, `data-p="os.q.d1ai.Upto15Of6"` (`inp("os.q."+qr.k+"."+pk,{n:1})`, os.js:572) — row: 3a Dividend referred in Sl.No.1a(i) |
| `Up16Of6To15Of9` | `/ScheduleOS/DividendIncUs115BBDA/DateRange/Up16Of6To15Of9` | **REQ** | **INPUT** | item-10 quarterly table, `data-p="os.q.d1ai.Up16Of6To15Of9"` (`inp("os.q."+qr.k+"."+pk,{n:1})`, os.js:572) — row: 3a Dividend referred in Sl.No.1a(i) |
| `Up16Of9To15Of12` | `/ScheduleOS/DividendIncUs115BBDA/DateRange/Up16Of9To15Of12` | **REQ** | **INPUT** | item-10 quarterly table, `data-p="os.q.d1ai.Up16Of9To15Of12"` (`inp("os.q."+qr.k+"."+pk,{n:1})`, os.js:572) — row: 3a Dividend referred in Sl.No.1a(i) |
| `Up16Of12To15Of3` | `/ScheduleOS/DividendIncUs115BBDA/DateRange/Up16Of12To15Of3` | **REQ** | **INPUT** | item-10 quarterly table, `data-p="os.q.d1ai.Up16Of12To15Of3"` (`inp("os.q."+qr.k+"."+pk,{n:1})`, os.js:572) — row: 3a Dividend referred in Sl.No.1a(i) |
| `Up16Of3To31Of3` | `/ScheduleOS/DividendIncUs115BBDA/DateRange/Up16Of3To31Of3` | **REQ** | **INPUT** | item-10 quarterly table, `data-p="os.q.d1ai.Up16Of3To31Of3"` (`inp("os.q."+qr.k+"."+pk,{n:1})`, os.js:572) — row: 3a Dividend referred in Sl.No.1a(i) |
| `Upto15Of6` | `/ScheduleOS/DividendIncUs115BBDAaiii/DateRange/Upto15Of6` | **REQ** | **INPUT** | item-10 quarterly table, `data-p="os.q.d1aiii.Upto15Of6"` (`inp("os.q."+qr.k+"."+pk,{n:1})`, os.js:572) — row: 3b Dividend referred in Sl.No.1a(iii) |
| `Up16Of6To15Of9` | `/ScheduleOS/DividendIncUs115BBDAaiii/DateRange/Up16Of6To15Of9` | **REQ** | **INPUT** | item-10 quarterly table, `data-p="os.q.d1aiii.Up16Of6To15Of9"` (`inp("os.q."+qr.k+"."+pk,{n:1})`, os.js:572) — row: 3b Dividend referred in Sl.No.1a(iii) |
| `Up16Of9To15Of12` | `/ScheduleOS/DividendIncUs115BBDAaiii/DateRange/Up16Of9To15Of12` | **REQ** | **INPUT** | item-10 quarterly table, `data-p="os.q.d1aiii.Up16Of9To15Of12"` (`inp("os.q."+qr.k+"."+pk,{n:1})`, os.js:572) — row: 3b Dividend referred in Sl.No.1a(iii) |
| `Up16Of12To15Of3` | `/ScheduleOS/DividendIncUs115BBDAaiii/DateRange/Up16Of12To15Of3` | **REQ** | **INPUT** | item-10 quarterly table, `data-p="os.q.d1aiii.Up16Of12To15Of3"` (`inp("os.q."+qr.k+"."+pk,{n:1})`, os.js:572) — row: 3b Dividend referred in Sl.No.1a(iii) |
| `Up16Of3To31Of3` | `/ScheduleOS/DividendIncUs115BBDAaiii/DateRange/Up16Of3To31Of3` | **REQ** | **INPUT** | item-10 quarterly table, `data-p="os.q.d1aiii.Up16Of3To31Of3"` (`inp("os.q."+qr.k+"."+pk,{n:1})`, os.js:572) — row: 3b Dividend referred in Sl.No.1a(iii) |
| `Upto15Of6` | `/ScheduleOS/DividendIncUs115A1ai/DateRange/Upto15Of6` | **REQ** | **INPUT** | item-10 quarterly table, `data-p="os.q.d115a1ai.Upto15Of6"` (`inp("os.q."+qr.k+"."+pk,{n:1})`, os.js:572) — row: Dividend u/s 115A(1)(a)(i) @20% |
| `Up16Of6To15Of9` | `/ScheduleOS/DividendIncUs115A1ai/DateRange/Up16Of6To15Of9` | **REQ** | **INPUT** | item-10 quarterly table, `data-p="os.q.d115a1ai.Up16Of6To15Of9"` (`inp("os.q."+qr.k+"."+pk,{n:1})`, os.js:572) — row: Dividend u/s 115A(1)(a)(i) @20% |
| `Up16Of9To15Of12` | `/ScheduleOS/DividendIncUs115A1ai/DateRange/Up16Of9To15Of12` | **REQ** | **INPUT** | item-10 quarterly table, `data-p="os.q.d115a1ai.Up16Of9To15Of12"` (`inp("os.q."+qr.k+"."+pk,{n:1})`, os.js:572) — row: Dividend u/s 115A(1)(a)(i) @20% |
| `Up16Of12To15Of3` | `/ScheduleOS/DividendIncUs115A1ai/DateRange/Up16Of12To15Of3` | **REQ** | **INPUT** | item-10 quarterly table, `data-p="os.q.d115a1ai.Up16Of12To15Of3"` (`inp("os.q."+qr.k+"."+pk,{n:1})`, os.js:572) — row: Dividend u/s 115A(1)(a)(i) @20% |
| `Up16Of3To31Of3` | `/ScheduleOS/DividendIncUs115A1ai/DateRange/Up16Of3To31Of3` | **REQ** | **INPUT** | item-10 quarterly table, `data-p="os.q.d115a1ai.Up16Of3To31Of3"` (`inp("os.q."+qr.k+"."+pk,{n:1})`, os.js:572) — row: Dividend u/s 115A(1)(a)(i) @20% |
| `Upto15Of6` | `/ScheduleOS/DividendIncUs115A1aA/DateRange/Upto15Of6` | **REQ** | **INPUT** | item-10 quarterly table, `data-p="os.q.d115a1aA.Upto15Of6"` (`inp("os.q."+qr.k+"."+pk,{n:1})`, os.js:572) — row: Dividend per proviso to 115A(1)(a)(A) @10% |
| `Up16Of6To15Of9` | `/ScheduleOS/DividendIncUs115A1aA/DateRange/Up16Of6To15Of9` | **REQ** | **INPUT** | item-10 quarterly table, `data-p="os.q.d115a1aA.Up16Of6To15Of9"` (`inp("os.q."+qr.k+"."+pk,{n:1})`, os.js:572) — row: Dividend per proviso to 115A(1)(a)(A) @10% |
| `Up16Of9To15Of12` | `/ScheduleOS/DividendIncUs115A1aA/DateRange/Up16Of9To15Of12` | **REQ** | **INPUT** | item-10 quarterly table, `data-p="os.q.d115a1aA.Up16Of9To15Of12"` (`inp("os.q."+qr.k+"."+pk,{n:1})`, os.js:572) — row: Dividend per proviso to 115A(1)(a)(A) @10% |
| `Up16Of12To15Of3` | `/ScheduleOS/DividendIncUs115A1aA/DateRange/Up16Of12To15Of3` | **REQ** | **INPUT** | item-10 quarterly table, `data-p="os.q.d115a1aA.Up16Of12To15Of3"` (`inp("os.q."+qr.k+"."+pk,{n:1})`, os.js:572) — row: Dividend per proviso to 115A(1)(a)(A) @10% |
| `Up16Of3To31Of3` | `/ScheduleOS/DividendIncUs115A1aA/DateRange/Up16Of3To31Of3` | **REQ** | **INPUT** | item-10 quarterly table, `data-p="os.q.d115a1aA.Up16Of3To31Of3"` (`inp("os.q."+qr.k+"."+pk,{n:1})`, os.js:572) — row: Dividend per proviso to 115A(1)(a)(A) @10% |
| `Upto15Of6` | `/ScheduleOS/DividendIncUs115AC/DateRange/Upto15Of6` | **REQ** | **INPUT** | item-10 quarterly table, `data-p="os.q.d115ac.Upto15Of6"` (`inp("os.q."+qr.k+"."+pk,{n:1})`, os.js:572) — row: Dividend u/s 115AC @10% |
| `Up16Of6To15Of9` | `/ScheduleOS/DividendIncUs115AC/DateRange/Up16Of6To15Of9` | **REQ** | **INPUT** | item-10 quarterly table, `data-p="os.q.d115ac.Up16Of6To15Of9"` (`inp("os.q."+qr.k+"."+pk,{n:1})`, os.js:572) — row: Dividend u/s 115AC @10% |
| `Up16Of9To15Of12` | `/ScheduleOS/DividendIncUs115AC/DateRange/Up16Of9To15Of12` | **REQ** | **INPUT** | item-10 quarterly table, `data-p="os.q.d115ac.Up16Of9To15Of12"` (`inp("os.q."+qr.k+"."+pk,{n:1})`, os.js:572) — row: Dividend u/s 115AC @10% |
| `Up16Of12To15Of3` | `/ScheduleOS/DividendIncUs115AC/DateRange/Up16Of12To15Of3` | **REQ** | **INPUT** | item-10 quarterly table, `data-p="os.q.d115ac.Up16Of12To15Of3"` (`inp("os.q."+qr.k+"."+pk,{n:1})`, os.js:572) — row: Dividend u/s 115AC @10% |
| `Up16Of3To31Of3` | `/ScheduleOS/DividendIncUs115AC/DateRange/Up16Of3To31Of3` | **REQ** | **INPUT** | item-10 quarterly table, `data-p="os.q.d115ac.Up16Of3To31Of3"` (`inp("os.q."+qr.k+"."+pk,{n:1})`, os.js:572) — row: Dividend u/s 115AC @10% |
| `Upto15Of6` | `/ScheduleOS/DividendIncUs115AD1iDiv/DateRange/Upto15Of6` | **REQ** | **INPUT** | item-10 quarterly table, `data-p="os.q.d115ad1id.Upto15Of6"` (`inp("os.q."+qr.k+"."+pk,{n:1})`, os.js:572) — row: Dividend to an FII u/s 115AD(1)(i) @20% |
| `Up16Of6To15Of9` | `/ScheduleOS/DividendIncUs115AD1iDiv/DateRange/Up16Of6To15Of9` | **REQ** | **INPUT** | item-10 quarterly table, `data-p="os.q.d115ad1id.Up16Of6To15Of9"` (`inp("os.q."+qr.k+"."+pk,{n:1})`, os.js:572) — row: Dividend to an FII u/s 115AD(1)(i) @20% |
| `Up16Of9To15Of12` | `/ScheduleOS/DividendIncUs115AD1iDiv/DateRange/Up16Of9To15Of12` | **REQ** | **INPUT** | item-10 quarterly table, `data-p="os.q.d115ad1id.Up16Of9To15Of12"` (`inp("os.q."+qr.k+"."+pk,{n:1})`, os.js:572) — row: Dividend to an FII u/s 115AD(1)(i) @20% |
| `Up16Of12To15Of3` | `/ScheduleOS/DividendIncUs115AD1iDiv/DateRange/Up16Of12To15Of3` | **REQ** | **INPUT** | item-10 quarterly table, `data-p="os.q.d115ad1id.Up16Of12To15Of3"` (`inp("os.q."+qr.k+"."+pk,{n:1})`, os.js:572) — row: Dividend to an FII u/s 115AD(1)(i) @20% |
| `Up16Of3To31Of3` | `/ScheduleOS/DividendIncUs115AD1iDiv/DateRange/Up16Of3To31Of3` | **REQ** | **INPUT** | item-10 quarterly table, `data-p="os.q.d115ad1id.Up16Of3To31Of3"` (`inp("os.q."+qr.k+"."+pk,{n:1})`, os.js:572) — row: Dividend to an FII u/s 115AD(1)(i) @20% |
| `Upto15Of6` | `/ScheduleOS/DividendIncUs115AD1IBd/DateRange/Upto15Of6` | **REQ** | **INPUT** | item-10 quarterly table, `data-p="os.q.d115ad1ib.Upto15Of6"` (`inp("os.q."+qr.k+"."+pk,{n:1})`, os.js:572) — row: Dividend to a specified fund u/s 115AD(1)(i) @10% |
| `Up16Of6To15Of9` | `/ScheduleOS/DividendIncUs115AD1IBd/DateRange/Up16Of6To15Of9` | **REQ** | **INPUT** | item-10 quarterly table, `data-p="os.q.d115ad1ib.Up16Of6To15Of9"` (`inp("os.q."+qr.k+"."+pk,{n:1})`, os.js:572) — row: Dividend to a specified fund u/s 115AD(1)(i) @10% |
| `Up16Of9To15Of12` | `/ScheduleOS/DividendIncUs115AD1IBd/DateRange/Up16Of9To15Of12` | **REQ** | **INPUT** | item-10 quarterly table, `data-p="os.q.d115ad1ib.Up16Of9To15Of12"` (`inp("os.q."+qr.k+"."+pk,{n:1})`, os.js:572) — row: Dividend to a specified fund u/s 115AD(1)(i) @10% |
| `Up16Of12To15Of3` | `/ScheduleOS/DividendIncUs115AD1IBd/DateRange/Up16Of12To15Of3` | **REQ** | **INPUT** | item-10 quarterly table, `data-p="os.q.d115ad1ib.Up16Of12To15Of3"` (`inp("os.q."+qr.k+"."+pk,{n:1})`, os.js:572) — row: Dividend to a specified fund u/s 115AD(1)(i) @10% |
| `Up16Of3To31Of3` | `/ScheduleOS/DividendIncUs115AD1IBd/DateRange/Up16Of3To31Of3` | **REQ** | **INPUT** | item-10 quarterly table, `data-p="os.q.d115ad1ib.Up16Of3To31Of3"` (`inp("os.q."+qr.k+"."+pk,{n:1})`, os.js:572) — row: Dividend to a specified fund u/s 115AD(1)(i) @10% |
| `Upto15Of6` | `/ScheduleOS/DividendDTAA/DateRange/Upto15Of6` | **REQ** | **INPUT** | item-10 quarterly table, `data-p="os.q.divdtaa.Upto15Of6"` (`inp("os.q."+qr.k+"."+pk,{n:1})`, os.js:572) — row: Dividend income taxable at DTAA rates |
| `Up16Of6To15Of9` | `/ScheduleOS/DividendDTAA/DateRange/Up16Of6To15Of9` | **REQ** | **INPUT** | item-10 quarterly table, `data-p="os.q.divdtaa.Up16Of6To15Of9"` (`inp("os.q."+qr.k+"."+pk,{n:1})`, os.js:572) — row: Dividend income taxable at DTAA rates |
| `Up16Of9To15Of12` | `/ScheduleOS/DividendDTAA/DateRange/Up16Of9To15Of12` | **REQ** | **INPUT** | item-10 quarterly table, `data-p="os.q.divdtaa.Up16Of9To15Of12"` (`inp("os.q."+qr.k+"."+pk,{n:1})`, os.js:572) — row: Dividend income taxable at DTAA rates |
| `Up16Of12To15Of3` | `/ScheduleOS/DividendDTAA/DateRange/Up16Of12To15Of3` | **REQ** | **INPUT** | item-10 quarterly table, `data-p="os.q.divdtaa.Up16Of12To15Of3"` (`inp("os.q."+qr.k+"."+pk,{n:1})`, os.js:572) — row: Dividend income taxable at DTAA rates |
| `Up16Of3To31Of3` | `/ScheduleOS/DividendDTAA/DateRange/Up16Of3To31Of3` | **REQ** | **INPUT** | item-10 quarterly table, `data-p="os.q.divdtaa.Up16Of3To31Of3"` (`inp("os.q."+qr.k+"."+pk,{n:1})`, os.js:572) — row: Dividend income taxable at DTAA rates |

## `ScheduleHP` — 42 leaves  <sub>(forms/ITR-5/src/70_sec_hp.js)</sub>

| leaf | schema path | required? | class | evidence |
|---|---|:-:|:-:|---|
| `HPSNo` | `/ScheduleHP/PropertyDetails[]/HPSNo` | **REQ** | **COMPUTED** | expHp `HPSNo:i+1` — property serial from the block index |
| `AddrDetail` | `/ScheduleHP/PropertyDetails[]/AddressDetailWithZipCode/AddrDetail` | **REQ** | **INPUT** | `data-p="hp.props.<i>.addr"` (hp.js:199) |
| `CityOrTownOrDistrict` | `/ScheduleHP/PropertyDetails[]/AddressDetailWithZipCode/CityOrTownOrDistrict` | **REQ** | **INPUT** | `data-p="hp.props.<i>.city"` (hp.js:200) |
| `StateCode` | `/ScheduleHP/PropertyDetails[]/AddressDetailWithZipCode/StateCode` | **REQ** | **INPUT** | `data-p="hp.props.<i>.state"` (sel HP_STATE; forced to "99" when country≠91) (hp.js:203/207) |
| `CountryCode` | `/ScheduleHP/PropertyDetails[]/AddressDetailWithZipCode/CountryCode` | **REQ** | **INPUT** | `data-p="hp.props.<i>.country"` (sel HP_COUNTRY) (hp.js:201) |
| `PinCode` | `/ScheduleHP/PropertyDetails[]/AddressDetailWithZipCode/PinCode` | — | **INPUT** | `data-p="hp.props.<i>.pin"` — shown only for country 91 (hp.js:204); emitted when /^[1-9]\d{5}$/ |
| `ZipCode` | `/ScheduleHP/PropertyDetails[]/AddressDetailWithZipCode/ZipCode` | — | **INPUT** | `data-p="hp.props.<i>.zip"` — shown only for a foreign property (hp.js:208) |
| `PropertyOwner` | `/ScheduleHP/PropertyDetails[]/PropertyOwner` | **REQ** | **INPUT** | `data-p="hp.props.<i>.owner"` (sel HP_OWNER SE/DO) (hp.js:212) |
| `PropCoOwnedFlg` | `/ScheduleHP/PropertyDetails[]/PropCoOwnedFlg` | **REQ** | **INPUT** | `data-p="hp.props.<i>.co"` (sel HP_COOWN YES/NO) (hp.js:213) |
| `AssessePercentShareProp` | `/ScheduleHP/PropertyDetails[]/AssessePercentShareProp` | — | **COMPUTED** | engProp `share = p.co==="YES" ? Math.max(0,R(100-coShare)) : p.co==="NO" ? 100 : 0` (J6) — green cell `cell(r.share)` (hp.js:215) |
| `CoOwnersSNo` | `/ScheduleHP/PropertyDetails[]/CoOwners[]/CoOwnersSNo` | **REQ** | **COMPUTED** | expHp `CoOwnersSNo:k+1` |
| `NameCoOwner` | `/ScheduleHP/PropertyDetails[]/CoOwners[]/NameCoOwner` | **REQ** | **INPUT** | grid `hp.props.<i>.coowners` col `name` (hp.js:221) |
| `PAN_CoOwner` | `/ScheduleHP/PropertyDetails[]/CoOwners[]/PAN_CoOwner` | — | **INPUT** | grid col `pan` → `data-p="hp.props.<i>.coowners.<k>.pan"`; emitted when PAN_RE matches |
| `Aadhaar_CoOwner` | `/ScheduleHP/PropertyDetails[]/CoOwners[]/Aadhaar_CoOwner` | — | **INPUT** | grid col `aadhaar`; emitted when AADH matches |
| `PercentShareProperty` | `/ScheduleHP/PropertyDetails[]/CoOwners[]/PercentShareProperty` | — | **INPUT** | grid col `share` → `data-p="hp.props.<i>.coowners.<k>.share"` |
| `ifLetOut` | `/ScheduleHP/PropertyDetails[]/ifLetOut` | **REQ** | **INPUT** | `data-p="hp.props.<i>.type"` (sel HP_TYPE Y/D — ITR-5 has no self-occupied) (hp.js:236) |
| `TenantSNo` | `/ScheduleHP/PropertyDetails[]/TenantDetails[]/TenantSNo` | **REQ** | **COMPUTED** | expHp `TenantSNo:k+1` |
| `NameofTenant` | `/ScheduleHP/PropertyDetails[]/TenantDetails[]/NameofTenant` | **REQ** | **INPUT** | grid `hp.props.<i>.tenants` col `name` (hp.js:238) |
| `PANofTenant` | `/ScheduleHP/PropertyDetails[]/TenantDetails[]/PANofTenant` | — | **INPUT** | grid col `pan`; emitted when PAN_RE matches |
| `AadhaarofTenant` | `/ScheduleHP/PropertyDetails[]/TenantDetails[]/AadhaarofTenant` | — | **INPUT** | grid col `aadhaar`; emitted when AADH matches |
| `PANTANofTenant` | `/ScheduleHP/PropertyDetails[]/TenantDetails[]/PANTANofTenant` | — | **INPUT** | grid col `pantan` — PAN/TAN of tenant when TDS credit is claimed |
| `AnnualLetableValue` | `/ScheduleHP/PropertyDetails[]/Rentdetails/AnnualLetableValue` | **REQ** | **INPUT** | `data-p="hp.props.<i>.rent"` — 1a, entered in full (hp.js:247) |
| `RentNotRealized` | `/ScheduleHP/PropertyDetails[]/Rentdetails/RentNotRealized` | **REQ** | **INPUT** | `data-p="hp.props.<i>.unreal"` — 1b (hp.js:249) |
| `LocalTaxes` | `/ScheduleHP/PropertyDetails[]/Rentdetails/LocalTaxes` | **REQ** | **INPUT** | `data-p="hp.props.<i>.taxes"` — 1c (hp.js:250) |
| `TotalUnrealizedAndTax` | `/ScheduleHP/PropertyDetails[]/Rentdetails/TotalUnrealizedAndTax` | **REQ** | **COMPUTED** | engProp `const d = R(b+c)` (H22) — green cell `cell(r.d)` |
| `BalanceALV` | `/ScheduleHP/PropertyDetails[]/Rentdetails/BalanceALV` | **REQ** | **COMPUTED** | engProp `const e = Math.max(0,R(a-d))` (J23) |
| `AnnualOfPropOwned` | `/ScheduleHP/PropertyDetails[]/Rentdetails/AnnualOfPropOwned` | **REQ** | **COMPUTED** | engProp `const f = Math.max(0,R((share/100)*e))` (J24) — own share bites here |
| `ThirtyPercentOfBalance` | `/ScheduleHP/PropertyDetails[]/Rentdetails/ThirtyPercentOfBalance` | **REQ** | **COMPUTED** | engProp `const g = Math.max(0,R(0.30*f))` (H25) |
| `IntOnBorwCap` | `/ScheduleHP/PropertyDetails[]/Rentdetails/IntOnBorwCap` | **REQ** | **COMPUTED** | engProp `const hRaw = R(loans.reduce((s,l)=>s+N(l.interest),0)); const h = hRaw` (H26/J34) — no per-loan cap in ITR-5 |
| `LoanTknFrom` | `/ScheduleHP/PropertyDetails[]/Rentdetails/Section24B/Section24BDtls[]/LoanTknFrom` | **REQ** | **INPUT** | grid `hp.props.<i>.loans` col `from` (sel HP_LOANFROM B/I) (hp.js:259) |
| `BankOrInstnName` | `/ScheduleHP/PropertyDetails[]/Rentdetails/Section24B/Section24BDtls[]/BankOrInstnName` | **REQ** | **INPUT** | grid col `name` → `data-p="hp.props.<i>.loans.<k>.name"` |
| `LoanAccNoOfBankOrInstnRefNo` | `/ScheduleHP/PropertyDetails[]/Rentdetails/Section24B/Section24BDtls[]/LoanAccNoOfBankOrInstnRefNo` | **REQ** | **INPUT** | grid col `acno` → `data-p="hp.props.<i>.loans.<k>.acno"` — see Defect D1 (max 25 vs schema 20) |
| `DateofLoan` | `/ScheduleHP/PropertyDetails[]/Rentdetails/Section24B/Section24BDtls[]/DateofLoan` | **REQ** | **INPUT** | grid col `dt` (t:"date") → `data-p="hp.props.<i>.loans.<k>.dt"`; `ISO(l.dt)\|\|"2025-04-01"` |
| `TotalLoanAmt` | `/ScheduleHP/PropertyDetails[]/Rentdetails/Section24B/Section24BDtls[]/TotalLoanAmt` | **REQ** | **INPUT** | grid col `amt` |
| `LoanOutstndngAmt` | `/ScheduleHP/PropertyDetails[]/Rentdetails/Section24B/Section24BDtls[]/LoanOutstndngAmt` | **REQ** | **INPUT** | grid col `os` — loan outstanding on 31-03-2026 |
| `InterestUs24B` | `/ScheduleHP/PropertyDetails[]/Rentdetails/Section24B/Section24BDtls[]/InterestUs24B` | **REQ** | **INPUT** | grid col `interest` |
| `TotalInterestUs24B` | `/ScheduleHP/PropertyDetails[]/Rentdetails/Section24B/TotalInterestUs24B` | **REQ** | **COMPUTED** | engProp `hRaw` = Σ loan interest (J34) → `TotalInterestUs24B:n0(r.hRaw)` |
| `TotalDeduct` | `/ScheduleHP/PropertyDetails[]/Rentdetails/TotalDeduct` | **REQ** | **COMPUTED** | engProp `const i = R(g+h)` (J35) — 30% + interest |
| `ArrearsUnrealizedRentRcvd` | `/ScheduleHP/PropertyDetails[]/Rentdetails/ArrearsUnrealizedRentRcvd` | — | **INPUT** | `data-p="hp.props.<i>.arrears"` — 1j amount received (hp.js:277); engProp stores `j = R(0.70*jRecd)` (less 30%, J36) |
| `IncomeOfHP` | `/ScheduleHP/PropertyDetails[]/Rentdetails/IncomeOfHP` | **REQ** | **COMPUTED** | engProp `const k = R(f-i+j)` (J37) → `IncomeOfHP:sg(r.k)` (signed) |
| `PassThroghIncome` | `/ScheduleHP/PassThroghIncome` | — | **INPUT** | `data-p="hp.pti"` (hp.js:303) when Schedule PTI has not published; otherwise COMPUTED from `S.C.other.pti[].hp.net` (engHp `ptiFromSch`, 70_sec_other.js:109) |
| `TotalIncomeChargeableUnHP` | `/ScheduleHP/TotalIncomeChargeableUnHP` | **REQ** | **COMPUTED** | engHp `const income = R(sum1k + pti)` (row 42) → `put(j,"ScheduleHP.TotalIncomeChargeableUnHP",sg(C.income))` |

## `ScheduleEI` — 26 leaves  <sub>(forms/ITR-5/src/70_sec_ei.js)</sub>

| leaf | schema path | required? | class | evidence |
|---|---|:-:|:-:|---|
| `InterestInc` | `/ScheduleEI/InterestInc` | — | **INPUT** | `data-p="ei.interest"` — Sl.1 (ei.js:186) |
| `GrossAgriRecpt` | `/ScheduleEI/GrossAgriRecpt` | — | **INPUT** | `data-p="ei.grossAgri"` — Sl.2(i) (ei.js:190) |
| `ExpIncAgri` | `/ScheduleEI/ExpIncAgri` | — | **INPUT** | `data-p="ei.expAgri"` — Sl.2(ii) (ei.js:192) |
| `UnabAgriLossPrev8` | `/ScheduleEI/UnabAgriLossPrev8` | — | **INPUT** | `data-p="ei.unabAgri"` — Sl.2(iii) (ei.js:195) |
| `NetAgriIncRelateToRule7` | `/ScheduleEI/NetAgriIncRelateToRule7` | — | **COMPUTED** | engEi `const agri4 = Math.max(0, R(((S.C.bp\|\|{}).a\|\|{})._38\|\|0))` (J9) — pulled from Sch BP Sl.38 (`put(j,P+"BalIncDeemedFrmAgri",n0(A._38))`, 70_sec_bp.js:758); green cell `cell(C.agri4)` |
| `NetAgriIncOrOthrIncRule7` | `/ScheduleEI/NetAgriIncOrOthrIncRule7` | — | **COMPUTED** | engEi `const net2v = Math.max(0, grossAgri-expAgri-unabAgri+agri4)` (J10) — always emitted `o.NetAgriIncOrOthrIncRule7 = n0(C.net2v)` |
| `NameOfDistrict` | `/ScheduleEI/ExcNetAgriInc/ExcNetAgriIncDtls[]/NameOfDistrict` | **REQ** | **INPUT** | grid `ei.land` col `district` → `data-p="ei.land.<i>.district"` (ei.js:207) — table opens only when net agri > ₹5,00,000 (`C.needLand`, rule 3685) |
| `PinCode` | `/ScheduleEI/ExcNetAgriInc/ExcNetAgriIncDtls[]/PinCode` | **REQ** | **INPUT** | grid `ei.land` col `pin`; chkEi errors unless /^\d{6}$/ |
| `MeasurementOfLand` | `/ScheduleEI/ExcNetAgriInc/ExcNetAgriIncDtls[]/MeasurementOfLand` | **REQ** | **INPUT** | grid `ei.land` col `meas` (Acre); chkEi errors unless >0 |
| `AgriLandOwnedFlag` | `/ScheduleEI/ExcNetAgriInc/ExcNetAgriIncDtls[]/AgriLandOwnedFlag` | **REQ** | **INPUT** | grid `ei.land` col `owned` (sel EI_OWNED O/H); SEED default "O" |
| `AgriLandIrrigatedFlag` | `/ScheduleEI/ExcNetAgriInc/ExcNetAgriIncDtls[]/AgriLandIrrigatedFlag` | **REQ** | **INPUT** | grid `ei.land` col `irr` (sel EI_IRR IRG/RF); SEED default "IRG" |
| `Category` | `/ScheduleEI/OthersInc/OthersIncDtls[]/Category` | — | **INPUT** | `data-p="ei.others.<i>.cat"` (sel, `eiCatOpts(isRes)`) (ei.js:230) |
| `SubCategory` | `/ScheduleEI/OthersInc/OthersIncDtls[]/SubCategory` | — | **INPUT** | `data-p="ei.others.<i>.sub"` (sel, `eiSubOpts(cat,isRes)` — dependent dropdown) (ei.js:231) |
| `OthAmount` | `/ScheduleEI/OthersInc/OthersIncDtls[]/OthAmount` | **REQ** | **INPUT** | `data-p="ei.others.<i>.amt"` (ei.js:233) |
| `Description` | `/ScheduleEI/OthersInc/OthersIncDtls[]/Description` | — | **INPUT** | `data-p="ei.others.<i>.desc"` (ei.js:232); mandatory for the Circular/Notification/Receipts sub-categories (EI_DESC_REQ) |
| `Others` | `/ScheduleEI/Others` | — | **COMPUTED** | engEi `const Others = others.reduce((a,r)=>a+r.amt,0)` (J38) → `put(o,"Others", n0(C.othersTot))` |
| `AmountOfIncome` | `/ScheduleEI/IncNotChrgblAsPerDTAA/IncNotChrgblAsPerDTAADtls[]/AmountOfIncome` | **REQ** | **INPUT** | grid `ei.dtaa` col `amt` → `data-p="ei.dtaa.<i>.amt"` (ei.js:253) |
| `NatureOfIncome` | `/ScheduleEI/IncNotChrgblAsPerDTAA/IncNotChrgblAsPerDTAADtls[]/NatureOfIncome` | — | **INPUT** | grid `ei.dtaa` col `nature` (max 75) |
| `CountryName` | `/ScheduleEI/IncNotChrgblAsPerDTAA/IncNotChrgblAsPerDTAADtls[]/CountryName` | **REQ** | **INPUT** | grid `ei.dtaa` col `cname` (max 55) |
| `CountryCodeExcludingIndia` | `/ScheduleEI/IncNotChrgblAsPerDTAA/IncNotChrgblAsPerDTAADtls[]/CountryCodeExcludingIndia` | **REQ** | **INPUT** | grid `ei.dtaa` col `ccode` (sel EI_CTRY) |
| `ArticleOfDTAA` | `/ScheduleEI/IncNotChrgblAsPerDTAA/IncNotChrgblAsPerDTAADtls[]/ArticleOfDTAA` | — | **INPUT** | grid `ei.dtaa` col `article` (max 16) |
| `HeadOfIncome` | `/ScheduleEI/IncNotChrgblAsPerDTAA/IncNotChrgblAsPerDTAADtls[]/HeadOfIncome` | **REQ** | **INPUT** | grid `ei.dtaa` col `head` (sel EI_HEAD HP/BP/CG/OS) |
| `TRCFlag` | `/ScheduleEI/IncNotChrgblAsPerDTAA/IncNotChrgblAsPerDTAADtls[]/TRCFlag` | — | **INPUT** | grid `ei.dtaa` col `trc` (sel EI_TRC Y/N) |
| `IncChrgblAsPerDTAA` | `/ScheduleEI/IncChrgblAsPerDTAA` | — | **COMPUTED** | engEi `const dtaaTotal = dtaa.reduce((a,r)=>a+r.amt,0)` (J44) → `put(o,"IncChrgblAsPerDTAA", n0(C.dtaaTotal))` |
| `PassThrIncNotChrgblTax` | `/ScheduleEI/PassThrIncNotChrgblTax` | — | **INPUT** | `data-p="ei.passThr"` — Sl.5 (ei.js:266); reconciled against Sch PTI by chkEi |
| `TotalExemptInc` | `/ScheduleEI/TotalExemptInc` | **REQ** | **COMPUTED** | engEi `const total6 = Math.max(0, interest+net2v+Others+dtaaTotal+passThr)` (J47) — always emitted `o.TotalExemptInc = n0(C.total)` |

---

## Adjacent defects found while tracing (NOT orphans — every leaf still has a home)

These do not change any classification above, but they are schema-validity risks in the same three blocks. Reporting them here so the CEO sees them alongside the coverage result.

### D1 — HP loan account number can exceed the schema's `maxLength`
`ScheduleHP.PropertyDetails[].Rentdetails.Section24B.Section24BDtls[].LoanAccNoOfBankOrInstnRefNo` has `"maxLength": 20` in the schema, but the form allows and exports up to **25** characters:

- `forms/ITR-5/src/70_sec_hp.js:261` — `{k:"acno",h:"Loan Account number",t:"txt",w:"170px",req:1,max:25}`
- `forms/ITR-5/src/70_sec_hp.js:350` — `LoanAccNoOfBankOrInstnRefNo:(sv(l.acno)||"NA").slice(0,25),`

A 21–25 character loan account number is accepted on screen and written to the JSON, where it fails schema validation. `chkHp` only checks that `acno` is non-empty (`70_sec_hp.js:486`), so nothing catches it. Both the grid `max:` and the `slice()` should be 20.

### D2 — OS DTAA article can exceed the schema's `maxLength`
`ScheduleOS.IncOthThanOwnRaceHorse.IncChargblSplRateOS.NRIOsDTAA.NRIDTAADtlsSchOS[].DTAAarticle` has `"maxLength": 16`, but the form allows and exports up to **20**:

- `forms/ITR-5/src/70_sec_os.js:512` — `{k:"article",h:"Article of DTAA",t:"txt",max:20,req:1},`
- `forms/ITR-5/src/70_sec_os.js:654` — `DTAAarticle: (sv(r.article)||"NA").slice(0,20),`

Note that the sibling EI DTAA table gets this right (`ei.dtaa` col `article` is `max:16` and `slice(0,16)`), which makes the OS value look like a transcription slip. Both should be 16.

### D3 — required leaves inside EI repeating rows are dropped rather than defaulted (blocking check exists)
`expEi` writes the EI row fields through `pf()` → `put()`, which **silently drops** `undefined`, `null`, `""` **and never writes a value that evaluated to `undefined`**:

- `ExcNetAgriIncDtls[]`: `pf(d,"PinCode", R(r.pin)||undefined)` and `pf(d,"MeasurementOfLand", r.meas ? r.meas : undefined)` drop a `0`/blank; `AgriLandOwnedFlag` / `AgriLandIrrigatedFlag` drop a blank select. All four are **schema-required**.
- `IncNotChrgblAsPerDTAADtls[]`: `CountryCodeExcludingIndia` and `HeadOfIncome` are **schema-required** but written with `pf(d,…,sv(r.ccode))` / `sv(r.head)`, which drop a blank select. The row is filtered in on `r.amt || cname || ccode` alone, so an amount-only row would export without them.

This is mitigated — not fixed — by blocking `err`-level checks: `chkEi` (`70_sec_ei.js:382-395`) errors on any land row missing district / 6-digit PIN / measurement / owned / irrigated, and (`70_sec_ei.js:429-434`) errors on any DTAA row missing amount, country name, country code or head of income. So a user cannot normally file an invalid row — but a JSON produced while errors are outstanding would be schema-invalid rather than merely incomplete. Contrast `expHp` / `expOs`, which default required strings (`||"NA"`, `||"56i"`, `||"2025-04-01"`) so the shape is always valid.

---

## Method notes

1. **Enumeration** was done from the schema only, with a `$ref`-resolving walker (`properties` / `items` recursion, chasing `definitions`); a leaf is a property carrying no nested `properties`/`items`. Counts: ScheduleOS 114, ScheduleHP 42, ScheduleEI 26 = **182**. The ten quarterly blocks contribute 50 of the 114 OS leaves (10 objects x 5 `DateRange` fields), and the 2e DTAA table contributes 10.
2. **Required?** is the leaf's membership in its immediate parent object's `required` array. 144 of the 182 leaves are required. All three schedule roots are themselves optional under `ITR5` (`ScheduleOS`, `ScheduleHP`, `ScheduleEI` are not in `ITR5.required`), so a required leaf binds only once its containing object is emitted.
3. **Assembly check** — every non-blank line of `70_sec_os.js`, `70_sec_hp.js` and `70_sec_ei.js` was confirmed present verbatim in `forms/ITR-5/Yukti_ITR5.html`, so section-source evidence is evidence about the shipped form.
4. **Field reachability** — `inp(p,o)` and `sel(p,opts,o)` emit `data-p="<p>"`; `grid(key,cols,rows,o)` emits `data-p="<key>.<i>.<col.k>"` per cell (`Yukti_ITR5.html:17387-17398`). Every INPUT row above names a path produced by one of those three.
5. **Cross-section reads were verified, not assumed** — the two COMPUTED leaves that depend on another section both have a live publisher:
   - `ScheduleEI.NetAgriIncRelateToRule7` reads `S.C.bp.a._38`, which `70_sec_bp.js:329` computes and `70_sec_bp.js:758` exports as `BalIncDeemedFrmAgri`.
   - `ScheduleHP.PassThroghIncome` prefers `S.C.other.pti[].hp.net`, published at `70_sec_other.js:85-109`, and falls back to the `hp.pti` screen field when Schedule PTI is empty — so the leaf is reachable either way.
6. **Conditional fields are rule-gated, not missing** — three INPUT leaves render only under a condition, each traceable to a rule: OS `Deductions.Depreciation` (`os.dDep` shown only when 1c rent > 0, rule 473, exported as 0 otherwise); HP `PinCode` vs `ZipCode` (India vs foreign, mutually exclusive by design); EI land-detail rows (`ei.land`, opened only when net agricultural income > Rs.5,00,000, rule 3685). None of these leaves is unreachable.
