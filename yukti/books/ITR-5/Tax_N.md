# Tax(N) — the LIVE tax-computation engine (ITR-5, A.Y. 2026-27)

Utility worksheet **"Tax(N)"** (`sheet41.xml`, relationship `rId41`, workbook `state=hidden`). It is a **method sheet**, not a data sheet: it holds no user inputs and no display fields, only formulas (and a set of VBA-written scratch cells) that recompute the whole income-tax liability. Part B-TTI shows the *results*; **this is the engine that produces the *method* behind them** (constitution rule 7 — read the hidden computation sheet).

`section_map.json` maps it as `{"section":"tax","why_built":"LIVE AY2026-27 tax-computation engine (sheet41): 4% health-and-education cess (matches Part B-TTI) and hosts the 234A/B/C interest outputs Part B-TTI consumes…"}` — **no schema block of its own** (`blocks` absent), so nothing here is emitted to the return JSON directly. It is **READ, not shown**.

> **Why this is the live twin, not the parallel "Tax" sheet (the whole point of this book).**
> 1. **Cess is 4% here** (`AR113:AR117` = `…*0.04`), matching Part B-TTI (`L56`) and rule **A752**. The parallel `Tax` sheet (`sheet11`, `books/ITR-5/Tax.md`) computes cess at a **stale 3%** (`P40`,`T25`,`R56` = `*0.03`). There is **no `0.03` anywhere on Tax(N)** (verified by grep of every formula on the sheet).
> 2. **Tax(N) hosts every scalar the computation reads** — `TaxableIncome`=`Tax(N)!$D$4`, `TotalIncome`=`Tax(N)!$C$118`, `NormalIncome`=`Tax(N)!$C$121`, `BasicExemption`=`Tax(N)!$W$4`, `Surcharge_Rate`=`Tax(N)!$M$2`, `Higher_MATC`=`Tax(N)!$W$2`, `Normal_Income_234C`=`Tax(N)!$W$12`, `Step1Tax/Step2Tax`=`Tax(N)!$AV$15/$AV$18`, … (183 defined names anchor here vs 123 on the legacy `Tax`).
> 3. **The §234A/B/C interest and MAT-comparison outputs Part B-TTI consumes live here**: `CalculatedValue234A/B/C`=`Tax(N)!$W$34/$W$35/$W$36`, `CalculatedValue234F`=`Tax(N)!$W$37`, `DateOfFiling234A/B/C`=`Tax(N)!$W$45/$W$46/$W$47`, `TotalTax_DI`=`Tax(N)!$W$3`, `NetTaxLiability`=`Tax(N)!$W$38`, `Tax.TDS/Tax.TCS`=`Tax(N)!$W$39/$W$40`.
> 4. Tax(N) carries the **current-year slab and regime logic** (rows "updated by Riyaz on 7th Apr 2026", `bacValue_115BAC` §115BAC, `bacValue_115BAE` §115BAE, `bacValue`/`BAD_Value` §115BAD, new 4L/8L/12L/16L/20L/24L slab), which the legacy `Tax` sheet does not.
>
> **The build's tax engine therefore replicates Tax(N), with 4% cess.** See **What this means for the build**.

---

## The shape

No user-selectable dropdowns (the only data-validation is a numeric bound `125` on the surcharge-band scratch cells `C125 C128:C130 C134:C135 C137 C142:C143 C155:C156 C162:C163`, `values: null` — not a list). Every populated cell is either a **formula** reading from **Part B-TI-TTI** (name prefixes `Sheet8b.` = Part B-TI, `sheet9./Sheet9.` = Part B-TTI), **Part A-General** (`sheet1.MainStatus`, `sheet1.SubStatus`, `sheet1.ForeignExchangeFlag`, `PMInfo.*`, `PAG2.*`, `PDT.*`), **Schedule SI** (`SI!…`, `SI.TotSplRateInc*`, `SI_111A`, `SI_115BBE`, `SI_115BBC`, `SI_115EA`, `taxablesi`, `B115Inc`), the **CG quarterly accumulators** (`AccSTCG*`, `AccLTCG*`, `AccVDA.*`, `BBDA_1aiii.*`, `OS10_*`, `OS30_*`), **AMT/AMTC** (`AMT.*`, `AMTC.*`, `scvia.*`, `AA10.*`, `SEZA10.*`), the **advance-tax challans** (`IT.Qtr1..Qtr5`, `IT.Q1Rate`), **or a VBA-written value** (the macro writes the final 234A/B/C interest, marginal-relief and net-liability results into fixed cells — see "Hidden rows"). Custom VBA functions used in the formulas: `getExemption()`, `applyExemption()`, `CalculateTax()`.

975 cells carry formulas. The sheet is laid out as side-by-side working blocks, each headed by a text label:

| Block header (cell) | Rows / cols | What it computes |
|---|---|---|
| **BASIC TAX CALCULATION PART** (`A1`) | rows 1–46, col A–P | Tax on taxable income by assessee group → `C46` "Tax on Taxable Income" |
| **REBATE ON AGRICULTURAL INCOME CALCULATION PART** (`A52`) | rows 52–96, col A–H | Partial-integration: tax on (agri + basic exemption) → `C96` "Rebate On Agricultural Income" |
| **SURCHARGE CALCULATION PART** (`A101`) | rows 101–179, col A–T | AMT surcharge + marginal relief (`C106:T112`); normal surcharge scratch bands (`C125:C163`); special-benefit special-rate lists (`C165:E172`); `MarginalRelief`=`C176`, `SurchargeOn2D`=`C177` |
| **9 & 18.5% CHECK** (`D101`) | `C101` | AMT rate 18.5% (or 9% for IFSC) |
| **BASIC TAX CALCULATION PART [For Surcharge Calc]** (`A183`) | rows 183–228, col A–H | Tax re-run on `TaxableIncome1` for the marginal-relief comparison → `C228` |
| §234C step-tax / MATC (`AC5:AK11`; `AV14:AV18`) | rows 5–20, cols AC–AV | AMT-higher-than-normal advance-tax schedule (15/45/75/100%) |
| Special-rate CG waterfall (`AC16:AS20`, `AC31:AL35`, `AC55:AO59`, `AC63:AL67`, `AC71:AL75`, `AC87:AH91`, `AC95:AH99`, `AC104:AH108`) | rows 16–108, cols AC–AS | Per-quarter basic-exemption / 112A-exemption spreading and special-rate tax build-up |
| §234C final schedule + **cess 4%** (`AC113:AZ118`) | rows 113–118, cols AC–AZ | Five-instalment normal-path 234C, cess `AR113:AR117` = `*0.04`, interest `AX118` |
| §234B monthly working (`CA5:CK16` and down to row 124) | cols CA–CK | 1%/month balance-tax interest (`Balance_Interest`, `IT_Interest`, `Month_Wise_234Bvalues`) |
| Scalar I/O bus (`D4`, `W2:W52`, `C118:C121`, `C176:C179`, `U1:U52` labels) | col U (labels), W (values) | The named-range scalars in/out of the VBA bridge |

**Assessee groups & cases.** The whole engine forks on three top-level "groups" keyed on `sheet1.MainStatus[0]` and, inside them, sub-cases keyed on `sheet1.SubStatus[0]` and the AOP/BOI member flags. `MainStatus` (from Part A-General `W12`) = `1-Firm`, `2-Local Authority`, `3-AOP/BOI`, `4-AJP`.

| Flag (cell) | Name | Formula | Fires when… |
|---|---|---|---|
| `N2` | `GrpsA` | `ISNA(MATCH(MID(sheet1.MainStatus,1,1),{"1","2"},0))` | FALSE ⇒ **Firm(1) / Local Authority(2)** → flat 30% (`C7`) |
| `O2` | `GrpsB` | `ISNA(MATCH(MID(sheet1.MainStatus,1,1),{"3"},0))` | FALSE ⇒ **AOP/BOI(3)** (incl. co-op sub-statuses) |
| `P2` | `GrpsC` | `ISNA(MATCH(MID(sheet1.MainStatus,1,1),{"4"},0))` | FALSE ⇒ **AJP(4)** |
| `O4` | `GrpsB.1` | `ISNA(MATCH(MID(sheet1.SubStatus,1,1),{"1","3"},0))` | FALSE ⇒ co-operative-society slab (`C10:C12`) |
| `O5` | `GrpsB.2` | `ISNA(MATCH(MID(sheet1.SubStatus,1,1),{"2"},0))` | FALSE ⇒ AOP/BOI slab (`C14:D18`) |
| `O6` | `GrpsB.3` | `ISNA(MATCH(MID(sheet1.SubStatus,1,1),{"6"},0))` | FALSE ⇒ MMR case (`C19`) |
| `O7` | `GrpsB.4` | `ISNA(MATCH(MID(sheet1.SubStatus,1,1),{"4","5","7"},0))` | FALSE ⇒ AOP member cases 1–5 (`C20:C31`) |
| `O8` | `GrpsB.5_New` | `ISNA(MATCH(MID(sheet1.SubStatus,1,1),{"4","5","6","7"},0))` | new-regime 115BAC slab variant (`D26`) |
| `P4/P5/P6` | `GrpsC.1/.2/.3` | `ISNA(MATCH(MID(sheet1.SubStatus,1,1),{"1"}/{"2"}/{"3"},0))` | AJP sub-cases (`C34:C45`) |
| `M2` | `Surcharge_Rate` | see §3 | graduated 10/12/15/25/37% (7% relief for co-op mfg) |
| `C101` | AMT rate | `IF(MID(sheet1.ForeignExchangeFlag,1,1)="Y",0.09,0.185)` | 9% IFSC / **18.5%** otherwise |

Every slab cell uses inverted logic `IF(GrpX, 0, <compute>)` = "contribute 0 unless the assessee *is* in group X", so exactly one group's rows are non-zero. The AOP/BOI **member cases 1–5** are decided in `O36:O40`/`P36` from the foreign-company flag `Q2` (`PMInfo.PartnerForeignCompFlg`), share % `R2` (`PMInfo.PercentageOfShareForeignComp`), member-income flag `S2` (`PMInfo.TotIncFrmMemberOfAop`) and the 99.9%-share test `T2` (`SUM(PMInfo.SharePercentage)>=99.9`). The **PDT (person-determination-of-tax / representative) cases** `PDT.C1..C7` (`O23:O29`) and their roll-ups `PDT.MMR`=`P27`, `PDT.AOP`=`P26` drive the maximum-marginal-rate branch.

---

## The items — the computation, block by block

Cells are quoted verbatim from `sources/ITR-5/utility/xl/worksheets/sheet41.xml` (untruncated). Named ranges are given as `workbook.xml` defines them; a `Tax(N)!$…` range is one of the **183 names anchored on this sheet**.

### 1 · Basic tax on total (taxable) income (rows 6–46) → `C46` "Tax on Taxable Income"

Driver: `TaxableIncome` = `Tax(N)!$D$4` = `Sheet8b.AggregateIncome` (Point 16 of Part B-TI, label `A4`). Slab thresholds in column A: `A10=10000`,`A11=20000`,`A12=20001` (co-op); `A14=250000`,`A15=500000`,`A16=1000000`,`A17=1000001` (AOP/BOI & AJP); `A22:A25`, `A34:A37` mirror the 2.5/5/10L slab; `A192:A194` mirror the co-op slab for the surcharge re-run.

- **Firm / Local Authority — flat 30%** (`C7`): `IF(GrpsA,0,ROUND(VALUE(TaxableIncome)*0.3,0))`.
- **Co-operative society** (`C10:C12`, `D18` roll-up): old regime slab `10% ≤10k / 20%+1000 ≤20k / 30%+3000 >20k` (`C10`,`C11`,`C12`); **§115BAD** flat **22%** (`bacValue=1` ⇒ `ROUND(TaxableIncome*0.22,0)`); **§115BAE** new-manufacturing co-op **15% on mfg income `G12` + 22% on other `H12`** (`bacValue_115BAE=1` ⇒ `SUM(ROUND(H12*0.22),ROUND(G12*0.15))`, `G12`=business income, `H12`=TaxableIncome−G12).
- **AOP/BOI ordinary slab** (`C14:C17` old regime → summed at `D18`): nil ≤2.5L / 5% / 20%+12500 / 30%+112500. **§115BAC new-regime slab** (`C18`/`B18`, `bacValue_115BAC=1`): `nil ≤4L, 5%, 10%+20000, 15%+60000, 20%+120000, 25%+200000, 30%+300000` (4/8/12/16/20/24 lakh bands).
- **AOP/BOI at maximum marginal rate** (`C19`): `IF(GrpsB,0,IF(GrpsB.3,0,IF(PDT.MMR,ROUND(TaxableIncome*0.3,0),0)))` — **MMR = 30%**.
- **AOP/BOI member cases 1–5** (`C20:C31`, and DTAA/agri twins `E`/`F` cols):
  - Case 1 (`C20`) — flat 30%.
  - Case 2 (`C22:C26`) — 2.5/5/10L slab or §115BAC slab.
  - **Case 3 — foreign-member split** (`C27`): `ROUND(TaxableIncome*(R2/100)*0.35,0)+ROUND(TaxableIncome*((100−R2)/100)*0.3,0)` = **35% on the foreign company's share, 30% on the rest**. (`E27` holds the legacy **40%/30%** split — "earlier it was 0.4 by Bindu 5 Aug 2025".)
  - Case 4 (`C29`) — 30%. Case 5 (`C31`) — **35%** (`E31` legacy 40%).
- **AJP / Estate of Deceased** (`C34:C45`): Estate-of-deceased (`CaseEstateOfDeceased`=`P36`, executor & ≥99.9% share) gets the 2.5/5/10L or §115BAC slab; otherwise flat 30% (`C37`/`C39`); `GrpsC.3` gets the slab at `C41:C45`.
- **Business trust / Investment fund** (`C46`): `IF(H47="Y",ROUND(VALUE(H48)*0.3,0),IF(G47="Y",ROUND(VALUE(G48)*0.3,0),SUM(C7,C10:C12,D18,D26,C27:C31,D38,C39,D45,C19:C20)))`. `G47`="Y" when `(MainStatus=3 & SubStatus=4)` or `BusinessTrustFlag="YES"` (business trust); `H47`="Y" when investment fund (`I47`: MainStatus3&SubStatus5; `I48`: §115UB fund). Both tax the special base (`G48`/`H48` = aggregate income + special-rate income − exemptions − 115BBE) at flat **30%**. Otherwise `C46` sums the matching group's rows.

`TaxAtNormalRate` = `Tax(N)!$C$46` = `C46`. `D46 = SUM(C10:C45)`.

### 2 · Rebate on agricultural income — partial integration (rows 52–96) → `C96`

Point 15 of Part B-TI (`A54`), agri income `AgricultureIncome`=`Tax(N)!$D$54`, gross-up base `AggregateIncome`=`Tax(N)!$F$54`.

- `D54` decides the income to tax at slab rate for each group (uses `Sheet8b.NetAgricultureIncomeOrOtherIncomeForRate` and, for some groups, `AggregateIncome`).
- `F54 = IF(MAX(0,Sheet8b.TotalIncome−Sheet8b.IncChargeTaxSplRate111A112)>250000, NetAgriIncome+250000, 0)` — the classic **"tax on (agri + ₹2.5L basic exemption)"** gross-up.
- The block **re-runs the same group slab tables on `AgricultureIncome`** (rows 57–94), e.g. `C57 = IF(GrpsA,0,ROUND(AgricultureIncome*0.3,0))`, co-op `C60:C62`, AOP slab `C64:C67`, member cases `C70:C81`, AJP `C84:C94`.
- **`C96 = SUM(C57:C94)`** = `RebateOnAgriculturalIncome` = `Tax(N)!$C$96` = "Rebate On Agricultural Income" (`A96`).

The rebate is consumed as `sheet9.RebateOnAgriInc` (Part B-TTI) and subtracted in the tax-payable build-up (`AO16 = MAX(AN16−sheet9.RebateOnAgriInc,0)`) and in the §234C tax rows.

### 3 · Surcharge rate, the >₹1cr trigger, 25% on 115BBE, 15% cap (rows 1–8, 102–103, 108–112)

**Graduated normal surcharge rate** `Surcharge_Rate` = `Tax(N)!$M$2`, built from `M3:M8` / `N3:N8`:
- Base ladder (`N4`): `>₹5cr → 37%`, `>₹2cr → 25%`, `>₹1cr → 15%`, `>₹50L → 10%`, else 0. Under §115BAC (`bacValue_115BAC≠1`) the 37% band is **capped at 25%** (`M4`,`M8`).
- The **12%/15% base by sub-status** appears in the AMT rate table `E102/G103/K103/O103/S102` and the special-benefit rate `S101`: `IF(ISNA(MATCH(MainStatus,{"1","2","3"})),0.15,IF(GrpsB,0.12,IF(GrpsB.1,0.15,0.12)))` — i.e. **Firm/Local-Auth/co-op ⇒ 12%; AJP ⇒ 15%** (the AOP/BOI ordinary case takes 12%). `M2` also applies the **7% concession** for co-op (`MainStatus=3`) with TotalIncome in ₹1cr–₹10cr (`Surcharge_Rate_SBI=0.12 → 0.07`).
- **>₹1 crore trigger** (`C120`, `SurchargeInterestRate`=`Tax(N)!$C$120`): `IF(TotalIncome>10000000,0.15,IF(TotalIncome>5000000,0.1,0))`. Surcharge only above ₹1 cr for firm/co-op (`M2`/`M6` return 0 at `TotalIncome≤10000000`).
- **15% cap on 111A/112/112A special-rate income** — surcharge on special-rate income is held to **15% max**: `L2 = MIN(0.15,Surcharge_Rate)`, applied via `Surcharge_IncomeEH`/`Surcharge_RateEH` (`L1/L2/L3`) which feed the special-benefit income `H1`/tax `J1` and Part B-TTI `Surcharge_i`/`Surcharge_ii`.
- **25% flat on §115BBE** — 115BBE income (SI 60% tax) is **carved out of the graduated-surcharge base** so it carries its own statutory 25% surcharge: `AK109 = SI_115BBE`, `AO111 = IF(MAX(0,sheet9.TaxPayableOnTotInc−SI_115BBE−AO110)=0,1,MAX(0,…))`, and the surcharge apportionment `AQ113 = MAX($AM$110−$AO$109,0)/$AO$111*(MAX(0,AP113−SI_115BBE))+$AM$109` subtracts `SI_115BBE` before spreading. (`Sheet9.Surcharge_i`=`AM109`, `Sheet9.Surcharge_ii`=`AM110` come from Part B-TTI.)

**Marginal relief (normal branch)** — computed in the surcharge scratch bands `C125:C163` (income sliced into ₹1cr/₹2cr/₹5cr thresholds per group; `F126:F129`, `H126:H128` build the exemption slices), the tax re-run on `TaxableIncome1`=`Tax(N)!$D$186` at `C189:C228` (`TAX_FOR_SURC`=`C228`), and the result is **written by VBA** into `MarginalRelief`=`Tax(N)!$C$176`, `SurchargeOn2D`=`Tax(N)!$C$177`, `Surchrgii`=`C178`, `Surchrgiii`=`C179`.

**Marginal relief (AMT branch)** — fully in formulas (`C106:T112`): `C104 = ROUND(sheet9.TaxDeemedTISec115JC,0)`; surcharge `C106 = IF(C103>10000000,ROUND(C104*SurchargeRate_AMT,0),0)` (and `I106/M106/Q106/T106` at the 50L/2cr/5cr/10cr thresholds); `Total1 C107`; income-exceeding `C108`; tax-on-1cr `C109`; `Total2 C110`; **marginal relief `C111 = IF(C103>10000000,IF((C107−C110)>0,C107−C110,0),0)`**; **surcharge after relief `C112`**; final `AMTSurcharge`=`Tax(N)!$E$114` = `IF(AND(NOT(GrpsB),NOT(GrpsB.1)),ROUND(IF(AND(C103>=1cr,C103<10cr),C112,T112),0),ROUND(IF(C103>=10cr,T112,IF(C103>5cr,Q112,IF(C103>2cr,M112,IF(C103>1cr,C112,I112)))),0))`. Surcharge on AMT only if AMT income exceeds the threshold — rule **B23**.

### 4 · Cess — health & education cess at **4%** (`AR113:AR117`)

Quoted verbatim (the distinguishing cells vs the legacy 3% sheet):

```
AR113 = ((AP113-AE25)+AQ113)*0.04
AR114 = ((AP114-AE25)+AQ114)*0.04
AR115 = ((AP115-AE25)+AQ115)*0.04
AR116 = ((AP116-AE25)+AQ116)*0.04
AR117 = (AP117+AQ117)*0.04
```

`AP1xx` = tax (`MAX(AOxxx,0)`, where `AOxxx = SUM(ACxxx:ANxxx)` gathers the normal + special-rate + AMT tax across the five instalment rows), `AQ1xx` = surcharge (apportioned, 115BBE-carved), `AE25 = SI!J95+SI!J97+SI!J96+SI!J98` = `NoCess_CR` (the special-rate incomes on which cess is **not** levied, subtracted from the base). So **cess = 4% × (tax − no-cess incomes + surcharge)**, matching Part B-TTI `L56` and rule **A752** ("Health & Education cess should be 4% of (Additional income tax payable + Surcharge)"). The final tax per instalment `ASxxx = APxxx+AQxxx+ARxxx`. **There is no `0.03` cell anywhere on Tax(N).**

### 5 · Special-rate tax build-up & basic-exemption / 112A-exemption spreading (rows 16–108, cols AC–AS)

Schedule-SI income is bucketed by rate and spread across the five §234C instalment rows (Q1 15/6, Q2 15/9, Q3 15/12, Q4 15/3, Q5 16/3–31/3), applying any unused basic exemption / §112A ₹1-lakh exemption via `applyExemption(...)`:

- **Consumed basic exemption** `Consumed_BE`=`Tax(N)!$AF$14`; `NormalIncome_MinusBE`=`Tax(N)!$AI$14`; `BasicExemption`=`Tax(N)!$W$4` = `getExemption(MID(sheet1.MainStatus,1,1))`.
- **STCG 15% (111A)** — `AC31:AL35`, exemption `CGExmptn15Per`=`Tax(N)!$AD$29`, rate `AG31 = IF(New_InvestmentFund="Y",30,15)`, tax `AL31` (30% for MMR/business-trust flags, else 15%).
- **LTCG 10% (112A / 115AD)** — `AC55:AO59`, exemption `CGExmptn10Per`=`Tax(N)!$AD$53` (= 112A income less the ₹1L), the **₹1-lakh 112A relief** spread quarter-by-quarter via `LTCG10Per_Benefit_Q1..Q5` (`AI55:AK59`, `MIN(…,100000…)`), tax `AO55` at 10% (30% under fund/MMR).
- **LTCG 12.5%** — `AC63:AL67`, `CGExmptn` at `AE61`, rate `AG63 = IF(New_InvestmentFund="Y",30,12.5)`, tax `AL63`.
- **LTCG 20% (112 with indexation / 115A(1)(a)(i))** — `AC71:AL75`, exemption `CGExmptn20Per`=`Tax(N)!$AD$69`, rate 20% (`AG71`), tax `AL71`; business-trust nets the §112(1)(a) proviso `LTCG.B4f_Total`.
- **OS 30%** — `AC87:AH91` (`OS30_*` + online-games), **DTAA rates** `AH47:AH51`/`AH79:AH83`/`AH122:AH126` apportion `SI!J7/J8/J9`.
- Per-rate income lists (col C/D/E/F/G, rows 165–175) with their statutory rates:

| Row | Head | Income cell(s) | Rate |
|---|---|---|---|
| 165 | 111A STCG (STT) | `C165 = SI_111A+SI!I10+SI!I60` | 15% (20% new: `G165`) |
| 166 | 112 LTCG securities | `C166` (long list) | 10% (12.5% new: `G166`) |
| 167 | LTCG 10% special benefit | `C167` | 10% |
| 168 | 112 LTCG others | `C168` | 20% |
| 169 | 115BBC / lotteries 30% | `C169 = SI_115BBC+SI!I44+SI!I83` | 30% |
| 170 | 30% all CG & OS | `C170 = SI!I40+SI!I62` | 30% |
| 171 | OS 5% | `C171` | 5% |
| 172 | OS 12.5% / 111A 4% | `C172 = B115Inc`, `E172` | 12.5% |
| 175 | OS 60% (VDA `115BBH`) | `C175 = SI!I49` | 60% |

`AC25`/`AD25` compute the aggregate Schedule-SI special-rate income and tax (with the business-trust/investment-fund 30% override), `AE25` = the no-cess portion.

### 6 · AMT §115JC and §115JD credit (rows 2, 101–104)

- **AMT rate** `C101 = IF(MID(sheet1.ForeignExchangeFlag,1,1)="Y",0.09,0.185)` — **9% for an IFSC/foreign-exchange unit, else 18.5%** (rule **A676**: 9% where any unit in IFSC).
- **Adjusted total income u/s 115JC(1)** = `AMT.AdjustedUnderSec115JC` (`C103`, imported from Schedule AMT; adjustments = Chapter VI-A part-C `scvia.TotPartCchapterVIA_Calc` `W24`, §10AA `SEZA10`/`AA10` `W25/W26`; the ₹20L floor for AOP/BOI/AJP and firm lives on Schedule AMT — rules **A682/A683**).
- **Tax on deemed income** `C104 = ROUND(sheet9.TaxDeemedTISec115JC,0)`; surcharge/marginal-relief per §3 above.
- **MAT-higher-than-normal flags**: `Higher_MATC`=`Tax(N)!$W$2` = `sheet9.TotalTax_DI>Sheet9.GrossTaxLiability`; `TotalTax_DI`=`Tax(N)!$W$3` = `sheet9.TotalTax_DI`. The higher-of and **§115JD credit** are applied on Part B-TTI (rules **A819/A820/A821**, **A835**: tax payable after credit = 3 − 4; **A684**: 1a = Sl.4 of Schedule AMT). Form 29C is required when liability is on AMT (rules **B1/B12**).

### 7 · §234A/B/C interest and §234F/234-I fees

Labels sit in col U (rows 34–52): `U34` "Interest u/s 234A", `U35` "234B", `U36` "234C", `U37` "234F". The **outputs are VBA-written value cells** in col W that Part B-TTI reads by name:

| Output | Cell / defined name | Source |
|---|---|---|
| Interest u/s 234A | `CalculatedValue234A` = `Tax(N)!$W$34` (VBA value) | 1%/month on `Normal_Income_234C` shortfall from due date `DueDate`=`W44` to `DateOfFiling`=`W42` |
| Interest u/s 234B | `CalculatedValue234B` = `Tax(N)!$W$35` (VBA value) | §234B monthly working, cols CA–CK |
| Interest u/s 234C | `CalculatedValue234C` = `Tax(N)!$W$36` (VBA value) | §234C schedule, `AX118` |
| Fee u/s 234F | `CalculatedValue234F` = `Tax(N)!$W$37` (VBA value) | late-filing fee |
| Filing/interest dates | `DateOfFiling`=`W42`, `DateOfProcessing`=`W43`, `DueDate`=`W44`, `DateOfFiling234A/B/C`=`W45/W46/W47` | `W43 = CONCATENATE(YEAR(TODAY()),"-",…)` |
| TDS / TCS | `Tax.TDS`=`Tax(N)!$W$39`=`Sheet9.TDS`, `Tax.TCS`=`Tax(N)!$W$40`=`Sheet9.TCS` | Part B-TTI |
| Net tax liability | `NetTaxLiability`=`Tax(N)!$W$38` (VBA) | for §234B base |

The **readable spec** the VBA implements:

- **§234C advance-tax schedule (normal path)** — `AT113:AT117` = `MAX(tax+surcharge+cess − TDS − TCS − 115JD credit − relief, 0)` (assessed tax); cumulative-percentage floors **`AU113=FLOOR(0.15*AT113,100)`**, `AU114=FLOOR(0.45,…)`, `AU115=FLOOR(0.75,…)`, `AU116/AU117=FLOOR(1,…)` — the **15/45/75/100%** ladder; instalment target `AV113=FLOOR(0.12*AT113,100)`, `AV114=FLOOR(0.36,…)`; advance-tax paid `AW113=IT.Qtr1`, `AW114=IT.Qtr1+IT.Qtr2`, … `AW116=…+IT.Qtr4`, `AW117=IT.Qtr5`; shortfall `AX113 = IF(AW113>=AV113,0,MAX(0,FLOOR(MAX(0,AU113−AW113),100)))`; **interest `AY113 = ROUNDDOWN(AX113,-2)*0.01*3`** (1%×3 months for Q1–Q3), `AY116/AY117 = …*0.01*1` (1 month for Q4); total `AX118 = MAX(interest234C_MATC,SUM(AY113:AY117))`. `AZ113 = ROUNDDOWN(AX113,-2)*(IT.Q1Rate/100)*3` handles a custom Q1 rate.
- **§234C when MAT is higher** (`AC5:AK11`): same 15/45/75/100% floors on `AC5 = IF(Higher_MATC,MAX(TotalTax_DI − TDS − TCS − 115JD − relief,0),0)`; `AK5 = AJ5*0.01*3` … `AK8/AK9 = AJ*0.01*1`; `interest234C_MATC`=`Tax(N)!$AK$11` = `ROUND(SUM(AK5:AK10),0)`.
- **§234B (1%/month)** — cols CA–CK: `CA5 = IFERROR(MAX(Sheet9.NetTaxLiability − Sheet9.AdvanceTax − Sheet9.TDS − Sheet9.TCS,0),0)` (assessed-tax shortfall); running balance `CC = MAX(0,CA+MIN(0,CD−CE))`; **monthly interest `CG = FLOOR(MAX(0,CC*0.01),1)`** (1% per month), gated off for months before the relevant challan date via `CK` flags. `Balance_Interest`=`Tax(N)!$CD$6:$CD$124`, `IT_Interest`=`Tax(N)!$CE$5:$CE$124`, `Month_Wise_234Bvalues`=`Tax(N)!$CB$5:$CB$124`.
- **Step-tax tables** for the §234C-vs-MATC marginal comparison: `Step1Tax`=`Tax(N)!$AV$15` = `CalculateTax(AV14+BasicExemption)`, `Step2Tax`=`Tax(N)!$AV$18` = `CalculateTax(AV17+BasicExemption)`, feeding `AN20 = MAX(Step1Tax−Step2Tax,0)`.
- **§234F / §234-I fee** — `CalculatedValue234F` (`W37`, VBA); the total on Part B-TTI (`8e`) = 234A+234B+234C + 234F + §234-I (rules **A829/A830**).

---

## The rules the sheet computes (with cell references)

- **Slab tax by assessee group** — `C7:C46`, thresholds `A10:A17`; flat 30% `C7`/`C14`/`C37`/`C39`; co-op 10/20/30% `C10:C12`; §115BAD 22% / §115BAE 15%+22% `C12`; §115BAC 4/8/12/16/20/24-lakh slab `C18`,`E26`; MMR 30% `C19`; member Case-3 **35%/30% foreign-share split** `C27` (legacy 40% at `E27`); Case-5 35% `C31`. Total `C46`. Mirrors Part B-TI rules **A793/A805/A806**.
- **Tax on total income** — the tax build-up `AC113:AS117` (normal + special + AMT rows, minus agri rebate `AO16`); Part B-TTI Sl.2 rules **A806/A810–A812**.
- **Rebate on agricultural income (partial integration)** — gross-up `F54`/`D54` (+₹2.5L), re-run slab `C57:C94`, rebate `C96`; consumed `sheet9.RebateOnAgriInc`; Part B-TI rule **A805** (Sl.15 = Sch-EI 2v when >5000), **A734/A735**.
- **Surcharge** — rate ladder `M2:M8`/`N4` (10/12/15/25/37%), >₹1cr trigger `C120`, co-op 7%-relief `M2`; special-rate **15% cap** `L2 = MIN(0.15,Surcharge_Rate)`; **115BBE 25% carve-out** `AK109`/`AQ113`; surcharge 12% rule **A751**.
- **Cess — 4%** `AR113:AR117 = ((AP−AE25)+AQ)*0.04`; rule **A752**.
- **Marginal relief** — AMT branch `C111`/`C112`/`E114` (gate `C103>1cr`, rule **B23**); normal branch scratch `C125:C228` → VBA `MarginalRelief`=`C176`.
- **AMT §115JC** — rate `C101` (9%/18.5%), adjusted income `C103`, tax `C104`; rules **A676–A686**. **§115JD** credit on Part B-TTI, rules **A819–A821**, **A835**. Form 29C rules **B1/B12**.
- **§234A/B/C** — 15/45/75/100% ladder `AU113:AU117`, 1%×3/×1 months `AY113:AY117`, MATC path `AK5:AK11`, 234B monthly 1% `CG`; outputs `W34/W35/W36`; total rule **A829/A830**.
- **Co-op / new-regime gating** — `bacValue`(§115BAD), `bacValue_115BAC`(§115BAC), `bacValue_115BAE`(§115BAE); rules **A27/A37**, **B32/B33/B42/B43**. AOP/BOI sub-status rule **A15**.

---

## Dropdowns

**None.** `dump.py --dropdowns "Tax(N)"` returns a single numeric data-validation (`source: "125"`, `values: null`) on the surcharge-band scratch cells `C125 C128:C130 C134:C135 C137 C142:C143 C155:C156 C162:C163`. There are no value lists to enumerate — the sheet has no user-selectable inputs.

---

## What repeats and what is one figure

Nothing here is a user-repeated grid; the repetition is **internal fan-out**, all one-figure-per-cell:

- The **group slab tables** (rows 7–46, 57–94, 189–228) are the same slab logic replicated per MainStatus×SubStatus group/case; exactly one group's rows are non-zero.
- The **five §234C instalment rows** (Q1–Q5) repeat once per advance-tax instalment (`AC113:AZ117`, `AC5:AK9`), not user rows.
- The **CG special-rate waterfall** (cols AC–AS) repeats the exemption-and-tax step across five quarters × the 15/10/12.5/20/30/OS rate buckets.
- The **§234B monthly table** (cols CA–CK, rows 5–124) repeats one row per month.

Every output is a single scalar: `C46`, `C96`, `C118:C121`, `C176:C179`, `W2:W40`, `AX118`, `AK11`.

---

## Mandatory

**None.** The sheet has no schema block, so there are no `required` schema keys and nothing here is emitted to the return JSON. Its outputs are mandatory only transitively — the values it computes must equal what Part B-TTI reports (rules **A806**, **A810–A812**, **A819–A821**, **A829/A830**, **A834/A835**).

---

## Hidden rows — not built

The **entire worksheet is hidden** (`state=hidden`); it has no separately-flagged hidden rows. Because the sheet is hidden, **Gate 3 skips it** (`gate3`: `if s["state"]!="visible" … continue`), so this book is not row-label-checked; it is written to the sheet-reader contract regardless, as the method reference for the tax engine. Nothing here is "built" as UI — it is a calculation model to be reimplemented in code.

**VBA-written value cells (the macro bridge — read as spec, not as live formula):** `CalculatedValue234A/B/C/F` (`W34:W37`), `DateOfFiling`/`DueDate`/`DateOfFiling234A/B/C` (`W42`,`W44:W47`), `NetTaxLiability` (`W38`), `MarginalRelief`/`SurchargeOn2D`/`Surchrgii`/`Surchrgiii` (`C176:C179`), `TaxPayableOnTotalIncome` (`C119`). These hold sample residue values in the XML (`W42=413398`, `W45=1183`) — the running utility overwrites them via the macro from the scratch tables documented above.

Off-screen scratch columns (beyond the 24-col `dump.py` view): **AC–AZ** (CG special-rate waterfall + §234C schedule + 4% cess), **CA–CK** (§234B monthly interest), **U/W** (label/value scalar bus).

---

## What this means for the build

**The tax engine the build must replicate is Tax(N), with 4% cess.** The section-map's earlier "Tax = live" note is superseded: the current-year evidence (4% cess, scalar-input hosting, 234-interest hosting, updated Apr-2026 slabs and the §115BAC/115BAD/115BAE regime flags) all point to **Tax(N)** as the authoritative engine, and `section_map.json` now records it as such.

1. **Classify the assessee** from `sheet1.MainStatus[0]` × `sheet1.SubStatus[0]`: Firm/Local-Auth(1,2) flat 30%; AOP/BOI(3) with co-op slab (10/20/30% or §115BAD 22% or §115BAE 15%+22%), ordinary AOP slab (2.5/5/10L or §115BAC 4/8/12/16/20/24L), MMR 30%, member cases 1–5 (incl. **Case-3 foreign-share 35%/30% split**), business trust / investment fund 30%; AJP(4) incl. Estate-of-Deceased slab. Flags `N2:P2`, `O4:O9`, `P4:P6`, member cases `O36:O40`/`P36`, PDT cases `O23:O29`.
2. **Tax on total income** = slab tax on normal income (`C46`) **+** special-rate tax (§5 buckets, per-rate lists `C165:C175`) **−** rebate on agricultural income (`C96`, partial integration with ₹2.5L gross-up).
3. **Surcharge** at 10/12/15/25/37% above ₹50L/₹1cr/₹2cr/₹5cr (`M2:M8`), co-op 7% concession, **15% cap on 111A/112/112A special-rate income** (`L2`), **25% flat on §115BBE** (carved out at `AK109`/`AQ113`), **with marginal relief** — AMT branch in formulas (`C106:E114`), normal branch via the scratch bands + VBA (`C176`).
4. **Cess at 4%** on (tax − no-cess special incomes + surcharge): **`AR113:AR117 = …*0.04`**. **Never 3%** — that is the legacy `Tax` sheet.
5. **AMT §115JC** at **18.5%** (9% for IFSC units, `C101`), floor ₹20L, with its own surcharge/marginal relief; **gross tax = higher of normal vs AMT**; grant **§115JD credit** when normal < AMT (applied on Part B-TTI).
6. **§234A/B/C interest** on the **15/45/75/100%** advance-tax ladder with **1%/month** shortfall (`AU/AY/AK/CG` cells), plus **§234F** fee and **§234-I**; outputs `W34:W37`.
7. **Wire the named ranges to Tax(N).** The scalars the engine reads and the interest/AMT outputs it publishes anchor on Tax(N): `TaxableIncome`(`D4`), `TotalIncome`(`C118`), `NormalIncome`(`C121`), `BasicExemption`(`W4`), `Surcharge_Rate`(`M2`), `SurchargeInterestRate`(`C120`), `Higher_MATC`(`W2`), `TotalTax_DI`(`W3`), `Normal_Income_234C`(`W12`), `Is_44_AD_Applicable`(`W27`), `Income_44_AD`(`W28`), `Surcharge_44AD`(`W29`), `Step1Tax/Step2Tax`(`AV15/AV18`), `MarginalRelief`(`C176`), `CalculatedValue234A/B/C/F`(`W34:W37`), `DateOfFiling234A/B/C`(`W45:W47`), `NetTaxLiability`(`W38`), `Tax.TDS/Tax.TCS`(`W39/W40`).

### How Tax(N) differs from the legacy `Tax` sheet (`books/ITR-5/Tax.md`)

| Aspect | `Tax` (legacy, sheet11) | **`Tax(N)` (live, sheet41)** |
|---|---|---|
| Health & education cess | **3%** (`P40`,`T25`,`R56` = `*0.03`) | **4%** (`AR113:AR117` = `*0.04`); no `0.03` present |
| Defined names anchored | 123 (`NET_TAX`=`Tax!Q2`, `TaxPayableOnTotInc_1`=`Tax!P38`, `GrpB`=`Tax!G2`, the `*_1` family) | **183** (`Grps*`, `PDT.*`, `SurchargeRate_AMT*`, all `W`-column scalars, agri, special-rate lists) |
| Scalar inputs (`TaxableIncome`, `TotalIncome`, `NormalIncome`, `BasicExemption`, `Surcharge_Rate`, `Normal_Income_234C`, `Step1Tax`, `Step2Tax`, `Higher_MATC`, …) | **read from Tax(N)** (not hosted here) | **hosted here** (`D4`,`C118`,`C121`,`W4`,`M2`,`W12`,`AV15/18`,`W2`) |
| §234A/B/C outputs Part B-TTI reads (`CalculatedValue234A/B/C`, `DateOfFiling234A/B/C`) | **not here** | **hosted here** (`W34:W36`, `W45:W47`) |
| §234B monthly, MATC 234C, `TotalTax_DI`, `NetTaxLiability`, `Tax.TDS/TCS` | not hosted | hosted (`CA:CK`, `AK11`, `W3`,`W38`,`W39/W40`) |
| Slab / regime vintage | older slab layout | **Apr-2026 slabs**, §115BAC (`bacValue_115BAC`), §115BAD (`bacValue`), §115BAE (`bacValue_115BAE`), co-op 7% concession, new 4/8/12/16/20/24-lakh bands |
| Group classification | `SubStatus[0]` only (Grp A/B/C/D) | `MainStatus[0]` × `SubStatus[0]` (`GrpsA/GrpsB/GrpsC` + `.1/.2/.3/.4` sub-cases) |
| Member Case-3 foreign split | 40%/30% | **35%/30%** live (`C27`); 40% kept as legacy `E27` |
| Status in section_map | `{"section":"tax", why_built:"Legacy/parallel … stale 3% cess … named-range tracing only"}` | `{"section":"tax", why_built:"LIVE AY2026-27 tax-computation engine … 4% cess … hosts 234A/B/C"}` |

Both sheets are `state=hidden` and neither's output names are read by any *other* sheet's formulas — the only bridge from either engine to Part B-TTI's tax rows is the **VBA macro** (`vbaProject.bin`, a binary blob, not quotable as source). The live-vs-legacy determination therefore rests on (a) the 4% cess, (b) which sheet hosts the scalar inputs and the 234A/B/C outputs, and (c) the current-year regime constants — all of which are **Tax(N)**.

---

*Sources: `sources/ITR-5/utility/xl/worksheets/sheet41.xml` (untruncated cell formulas, read directly); `sources/ITR-5/utility/xl/workbook.xml` (183 `Tax(N)` definedNames, 123 `Tax` definedNames, sheet state & `rId41` mapping); `books/ITR-5/PART_A_GENERAL.md` (MainStatus/SubStatus enum); `books/ITR-5/rules.json` (A676–A696, A705–A712, A751/A752, A793–A835, B1/B12/B23/B32/B33/B42/B43); cross-checked against `books/ITR-5/Tax.md`. The VBA macro that carries these values to Part B-TTI is a binary dump — not quotable as source.*
