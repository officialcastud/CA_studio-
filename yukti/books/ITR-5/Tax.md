# Tax — hidden tax-computation engine (ITR-5, A.Y. 2026-27)

Utility worksheet **"Tax"** (`sheet11.xml`, workbook `state=hidden`, `sheetId=32`). It is a **method sheet**, not a data sheet: it holds no user inputs and no display fields, only formulas that recompute the whole income-tax liability. Part B-TTI shows the *results*; this sheet is one of the two engines that produce the *method* behind them (constitution rule 7 — read the hidden computation sheet).

`section_map.json` maps it as `{"section":"tax","blocks":[]}` — **no schema block of its own**, so nothing here is emitted to the return JSON directly. Its `why_built` records that **123 defined names anchor on this sheet's cells** (verified — see below). It is **READ, not shown**: the "items" section documents *what it computes*; "What this means for the build" says what the tax engine must replicate.

> **Important data-flow finding (read before trusting this sheet as live).** This sheet computes cess at **3%** (`0.03`) everywhere, while the live display sheet Part B-TI-TTI and its twin `Tax(N)` compute cess at **4%** (`0.04`) — health & education cess has been 4% since A.Y. 2019-20. In addition, every scalar input this sheet reads (`TaxableIncome`, `NormalIncome`, `TotalIncome`, `BasicExemption`, `Higher_MATC`, `Is_44_AD_Applicable`, `Income_44_AD`, `Surcharge_Rate`, `MarginalRelief`, `Step1Tax`, `Step2Tax`, `Normal_Income_234C`, …) resolves **globally to the `Tax(N)` sheet**, and the 234A/B/C interest outputs consumed downstream (`CalculatedValue234A/B/C`) also live on `Tax(N)`. No formula on any *other* sheet reads this sheet's 123 output names — the bridge to Part B-TTI is the (binary, unreadable) VBA macro. Treat the method below as authoritative and the *wiring* as a lead-level reconciliation item (Tax vs Tax(N)). Details under **What this means for the build**.

---

## The shape

No dropdowns (the only data-validations are numeric bounds `0/125/200`, values `null` — not lists), no editable cells. Every populated cell is a formula reading from **Part B-TI-TTI** (name prefixes `Sheet8b.` and `sheet9.`, both = `'PARTB - TI - TTI'`), **Schedule SI** (`SI!…`, `SI_111A`, `SI_115BBC`, `SI_115EA`, `taxablesi`, `B115Inc`), the **CG quarterly accumulators** (`AccSTCG.…`, `AccSTCGOTH.…`, `AccLTCG.…`, `AccLTCGNP.…`, `BBDA_1aiii.…`, `OS30_…`), **AMT/AMTC** (`AMT.…`, `AMTC.…`), and the twin scalar sheet **`Tax(N)`** (via the global names listed above). Custom VBA functions used: `getExemption()`, `applyExemption()`, `CalculateTax()`, `calculateAge()`.

The sheet is laid out as ~12 side-by-side working blocks, each headed by a text label:

| Block header (cell) | Rows | What it computes |
|---|---|---|
| **BASIC TAX CALCULATION PART** (A1) | 6–37 | Tax on taxable income by assessee group → `C37` |
| **INTEREST PAYABLE CALCULATION PART** (N7) | 7–22 (cols N-O) | Dates, TDS/TCS, assessed tax for §234 |
| **Total Income Segregation Bucket** / **TOTAL INCOME** (N23/O23) | 23–46 (cols N-P) | Normal-vs-special income split; the Part B-TTI tax build-up `P35`→`P46` |
| **SPECIAL RATE TAX** (R23) | 23–30 (cols Q-U) | Schedule-SI special-rate income + its tax/surcharge/cess `U25` |
| **44AD Calculation** (N29) | 29–34 (cols N-P) | Presumptive-income branch flags & figures |
| **REBATE ON AGRICULTURAL INCOME CALCULATION PART** (A41) | 41–78 | §2(2)(a)/89A-style agri rebate → `C78`, `D43` |
| **AMT Calculation for 44AD** (M46) + `R48:R57` | 46–57 | §115JC adjusted total income, AMT, its surcharge/cess |
| **Surcharge on AMT Income** (A82) | 82–91 | Surcharge + marginal relief on deemed (AMT) income → `D90/D91` |
| **SURCHARGE CALCULATION PART** (A101) | 101–146 | Surcharge, marginal-relief income bands, special-rate income lists |
| **SURCHARGE CALCULATION PART For 44 AD** (R65) | 65–113 (cols R-U) | Surcharge working for the 44AD branch |
| **FOR Surcharge:- Tax Calc** (A156) | 156–192 | Tax recomputed on `TaxableIncome1` for the surcharge comparison → `C192` |
| §234C quarterly working (R2:X7, R14:X20, R31:X46, S16:AA46, AE42:AI47) | — | Advance-tax cumulative % schedule, interest per quarter |

**Assessee groups & cases.** The whole engine forks on five mutually-exclusive "groups" derived from `sheet1.SubStatus` (first character), and, inside the AOP/BOI group, five member "cases":

| Flag (cell) | Name | Formula | Meaning |
|---|---|---|---|
| `F2` | `GrpA` | `ISNA(MATCH(sub,{"7","8"},0))` | slab table rows 7–10 fire when this is **FALSE** |
| `E2` | `GrpA.PDT` | `AND(ISNA(MATCH(sub,{"7"},0))=FALSE)` | AOP taxed at maximum marginal rate / member cases |
| `G2` | `GrpB` | `ISNA(MATCH(sub,{"6"},0))` | AOP/BOI with member analysis |
| `H2` | `GrpC` | `ISNA(MATCH(sub,{"1","2","5"},0))` | flat 30% (firm/LLP/local authority) |
| `I2` | `GrpD` | `ISNA(MATCH(sub,{"3","4"},0))` | co-operative-society slab (10k/20k thresholds) |
| `J2` | Surcharge Rate | `IF(ISNA(MATCH(sub,{"1","2","3","4","5"},0)),0.15,0.12)` | 12% or 15% |

The group flags use inverted logic: each slab cell is `IF(GrpX, 0, <compute>)`, i.e. "contribute 0 unless the assessee *is* in group X". AOP member cases 1–5 are decided in `E21/E23/E27/E31/E35` from foreign-company flag `L2`, share % `M2`, member-income flag `N2`, and 99.9% share test `O2` (rows 19, `D19:G19`).

---

## The items — the computation, block by block

Cells are quoted verbatim from `dump.py … --formulas` (full text). Named ranges are given as the workbook defines them; a `Tax!$…` range is one of the **123 names anchored on this sheet**.

### 1 · Basic tax on taxable income (rows 6–37) → `C37` "Tax on Taxable Income"

Reference: `A4` "Point (16) of Part B-TI", value `D4 = Sheet8b.AggregateIncome`. The taxable income driver is the name `TaxableIncome` (= `Tax(N)!$D$4 = Sheet8b.AggregateIncome`).

Slab tables (one per group, only the matching group's rows are non-zero). Thresholds live in column A:

- **Group A** (rows 7–10): `A7=250000`, `A8=500000`, `A9=1000000`, `A10=1000001`. `C7`=nil to 2.5L; `C8 = ROUND((TaxableIncome−A7)*0.1,0)` for 2.5–5L; `C9 = ROUND((TaxableIncome−A8)*0.2,0)+25000` for 5–10L; `C10 = ROUND((TaxableIncome−A9)*0.3,0)+125000` above 10L.
- **GrpA.PDT** (row 12): `C12 = IF(PDT.MMR,ROUND(TaxableIncome*0.3,0),0)` — maximum-marginal-rate 30%.
- **Group C** (row 14): `C14 = ROUND(TaxableIncome*0.3,0)` — flat 30%.
- **Group D** (rows 16–18, co-operative society): `A16=10000`,`A17=20000`,`A18=20001`. `C16 = ROUND(TaxableIncome*0.1,0)` to 10k; `C17 = ROUND((TaxableIncome−A16)*0.2,0)+1000` 10k–20k; `C18 = ROUND((TaxableIncome−A17)*0.3,0)+3000` above 20k.
- **Group B / AOP cases** (rows 21–35): case 1 flat 30% (`C21`); case 2 slab (`C23:C26`, thresholds `A23:A26`); case 3 foreign-share split `C28 = ROUND(TaxableIncome*(M2/100)*0.4,0)+ROUND(TaxableIncome*((100−M2)/100)*0.3,0)`; case 4 `C31` 30%; case 5 `C35` 40%.
- **Total:** `C37 = SUM(C7:C35)`.

### 2 · Rebate on agricultural income (rows 41–78) → `C78`, and `D43`

`A43` "Point 15 of Part B-TI", `C43` "Agriculture Income". `D43` grosses agri income up with the ₹2.5L basic-exemption where the group requires (`IF(Sheet8b.NetAgricultureIncomeOrOtherIncomeForRate>0, … +250000 …)`). The block re-runs the same group slab tables on `AgricultureIncome` (rows 47–75, e.g. `C48 = ROUND((AgricultureIncome−A47)*0.1,0)`), totalled at **`C78 = SUM(C47:C75)`** ("Rebate On Agricultural Income", `A78`). The consumed value is `sheet9.RebateOnAgriInc` (= Part B-TTI `J61`), subtracted at `P37/P38` and in the 234C tax rows (`Z16 = MAX(Y16−sheet9.RebateOnAgriInc,0)`).

### 3 · Normal-vs-special split and the Part B-TTI tax build-up (cols N–P, rows 23–46)

The core of "Tax Payable on Total Income":

| Cell | Name | Formula | Meaning |
|---|---|---|---|
| `P23` | | `Sheet8b.TotalIncome` | total income |
| `P24` | | `MAX(Sheet8b.TotalIncome−(P25+P26+P27+P28),0)` | normal-rate income (total less CG / lottery / OS-special / CG-AR) |
| `P30` | `TotPartCchapterVIA_Calc` | `scvia.TotPartCchapterVIA_Calc` | Chapter VI-A |
| `P31` | `TotalDedUs10Sub_SEZA10` | `SEZA10.TotalDedUs10Sub` | §10AA (SEZ) |
| `P32` | `TotalDedUs10Sub_AA10` | `AA10.TotalDedUs10Sub` | §10AA total |
| `P33` | | `IF(IS_FIRM, IF(Income_44_AD>0, IF(OR(P30>0,P31>0,P32>0),FALSE,TRUE),FALSE),FALSE)` | "IS 44 AD Applicable" |
| `P34` | | `IF(sheet11.Section44AD="",0,sheet11.Section44AD)+IF(sheet11.Section44ADA="",0,sheet11.Section44ADA)` | 44AD/44ADA income |
| `P35` | | `IF(ISERROR(CalculateTax(Normal_Income_234C+P28)),0,CalculateTax(Normal_Income_234C+P28))` | tax at normal rate |
| `P36` | | `sheet9.TaxAtSpecialRates` | tax at special rates (Sch-SI (ii) total) |
| `P37` | | `sheet9.RebateOnAgriInc` | agri rebate |
| **`P38`** | **`TaxPayableOnTotInc_1`** (`Tax!$P$38`) | **`P36+P35−P37`** | **Tax Payable on Total Income (44AD branch)** |
| `P39` | | `ROUND(Income_44_AD*(Sheet9.Surcharge_ii/MAX(1,Sheet8b.TotalIncome)),0)` | surcharge (44AD apportioned) |
| `P40` | | `ROUND(0.03*(P38+P39),0)` | **cess — 3% (stale; see finding)** |
| `P41` | | `P40+P39+P38` | Gross Tax Liability |
| `P42` | | `MAX(P41,R57)` | Gross Tax Payable = higher of normal vs AMT |
| `P43` | | `IF(P41<=R57,0,AMTC.TaxSection115JD)` | §115JD credit |
| `P44` | | `MAX(0,P42−P43)` | tax payable after credit |
| `P45` | | `Sheet9.TotTaxRelief` | §90/91 relief |
| **`P46`** | **`NetTaxLiability_44AD`** (`Tax!$P$46`) | **`MAX(0,P44−P45)`** | **Net Tax Liability (44AD branch)** |

Output scalars the sheet exposes: **`Q2 = NET_TAX`** (`Tax!$Q$2`) `= IF(Is_44_AD_Applicable, TaxPayableOnTotInc_1, sheet9.TaxPayableOnTotInc)`; **`Q3 = NET_Surcharge`** (`Tax!$Q$3`) `= IF(Is_44_AD_Applicable, Surcharge_44AD, Sheet9.SurchargeOnTaxPayable)`; `Q4 = sheet9.TotalTax_DI`.

The three names Part B-TTI actually publishes are on the **display** sheet, fed (via the macro) from this method:

- `TaxPayableOnTotInc` = `'PARTB - TI - TTI'!$L$62` = `MAX(SUM(J59,J60)−sheet9.RebateOnAgriInc,0)`
- `SurchargeOnTaxPayable` = `'PARTB - TI - TTI'!$L$72` = `MAX(0,Sheet9.Surcharge_i+Sheet9.Surcharge_ii)`
- `EducationCess` = `'PARTB - TI - TTI'!$L$73`
- `GrossTaxLiability` = `'PARTB - TI - TTI'!$L$74` = `sheet9.TaxPayableOnTotInc+Sheet9.SurchargeOnTaxPayable+Sheet9.EducationCess`
- `TotalTax_DI` = `'PARTB - TI - TTI'!$L$57` = `SUM(L54:L56)`

### 4 · Special-rate tax build-up (rows 23–30 cols Q-U; rows 32–46 cols S-BH; rows 100–144 cols A-D/R-U)

Schedule-SI income is bucketed and taxed rate by rate. Aggregate: `Q25 = SI!I6+SI!I24+…+SI_115EA` (income), `R25 = SI.TotSplRateIncTax−(SI!J10+…)` (tax); its surcharge `S25` and cess `T25 = ROUND((R25+S25)*0.03,0)` (**3%**), total `U25 = MAX(R25+S25+T25,0)`.

The per-rate income lists and their rates (rows 136–144, values are constants):

| Row | Head (col A) | Income (col C) | Rate (col D) |
|---|---|---|---|
| 136 | 111A STCG (STT, 15%) | `SI_111A+SI!I10` | `0.15` |
| 137 | 112 LTCG listed w/o indexation (10%) | `SI!I16+…+SI!I52` | `0.1` |
| 138 | 112 LTCG others (20%) | `SI!I12+…+SI!I45` | `0.2` |
| 139 | 30% all CG & OS | `SI!I40+SI_115BBC` | `0.3` |
| 140 | OS 5% | `SI!I27+…+SI!I30` | `0.05` |
| 141 | OS 12.5% | `B115Inc` | `0.125` |
| 142 | OS 25% | | `0.25` |
| 143 | OS 50% | `SI!#REF!` | `0.5` |
| 144 | OS 60% | `SI!I49` | `0.6` |

The CG special-rate waterfall (hidden cols S–BF, rows 32–46) spreads each CG bucket across the five §234C quarters, applies the basic-exemption residue via `applyExemption(CGExmptn15Per,q,$S$32:$S$36)`, and taxes it: STCG 15% `X32 = ROUND(V32*W32/100,0)` (`W32=15`), STCG 30% `AI32` (`AH32=30`), LTCG 10% `AS32` (`AR39=10`), LTCG 20% `BC32`, OS 30% `BE39` (`BD39=30`). Each carries its own surcharge (cols Y/AJ/AT/BD/BF) and 3% cess (cols Z/AK/AU/BE/BG).

### 5 · AMT / §115JC (rows 46–57)

`M47` "Total Income as per item 13 of PART-B-TI"; `M48` "Adjustment as per §115JC(2)". Adjustments: `P49` (Chapter VI-A part-C, capped), `P50` (§10AA), `P51 = P49+P50` (2c). Then:

- `R48 = MAX(Sheet8b.TotalIncome−P34,0)`
- `R53 = P51+R48` — Adjusted Total Income under §115JC(1)
- `R54 = IF(FormulaOfAMT="N", IF(P51<=0,0,IF(R53<=2000000,0,MAX(0,ROUND(0.185*R53,0)))), IF(P51<=0,0,MAX(0,ROUND(0.185*R53,0))))` — AMT at **18.5%**, only if adjusted income > ₹20L (the ₹20L floor is skipped when `FormulaOfAMT="Y"`)
- `R55` — surcharge (apportioned `sheet9.deemeds`), `R56 = ROUND(0.03*(R54+R55),0)` — **3% cess**
- **`R57 = R54+R55+R56`** = `TotalTax_DI_44AD` (`Tax!$R$57`) — total AMT liability
- Comparison: `R10 = sheet9.TotalTax_DI>Sheet9.GrossTaxLiability`; the higher-of test is applied at `P42 = MAX(P41,R57)`.

Deemed-income surcharge & marginal relief (rows 82–91, `A82` "Surcharge on AMT Income"): `D83 = AMT.AdjustedUnderSec115JC`, `D84 = ROUND(sheet9.TaxDeemedTISec115JC,0)`, `D85 = IF(D83>10000000,ROUND(D84*Surcharge_Rate,0),0)`, `D87/D88/D89` recompute at the ₹1 cr threshold, **`D90 = IF(D83>10000000, MAX(D86−D89,0),0)`** (marginal relief), **`D91`** surcharge after marginal relief.

### 6 · Surcharge & marginal relief on the normal computation (rows 101–146)

`A101` "SURCHARGE CALCULATION PART". `D103 = Sheet8b.TotalIncome`, `D105 = IF(TotalIncome>10000000,Surcharge_Rate,0)`, `D107 = TotalIncome−Sheet8b.IncChargeTaxSplRate111A112` (normal income). Rows 107–118 slice income into the slab bands (`K107:K110`, `C109:C118`, names `GrpA.Income1..4`, `GrpC.Income1`, `GrpD.Income1..3`, etc.) so tax can be recomputed for the marginal-relief comparison. Group-B AOP foreign/domestic split at `H127 = MIN(100,G127)/100`, `H128 = MAX(0,100−G127)/100` (`G127 = PMInfo.PercentageOfShareForeignComp`). Names `MarginalRelief_1 = Tax!$T$112`, `SurchargeOn2D_1 = Tax!$T$113`, `RateForComp = Tax!$H$92`.

### 7 · §234A/B/C interest working (cols N-O rows 7–22; cols R-AA rows 2–46; cols AE-AI rows 42–47)

Dates: `NonAudit_DueDate = K16 (31/07/2026)`, `Audit_DueDate = K17 (31/10/2026)`, `NonAudit_DueDate_Business = K19 (31/08/2026)`, `Audit_DueDate92E = K18 (30/11/2026)` (+`L…` = due-date+1). `O9` = date of interest calc = today. TDS `O20 = Sheet9.TDS`, TCS `O21 = Sheet9.TCS`. The §234C schedule (`R2:X7`, `R41:X46`, `S16:AA46`, `AE42:AI47`) builds cumulative advance-tax percentages (`V3 = FLOOR(S3*0.15,100)`, `V4 = FLOOR(S4*0.45,100)`, `V5=…*0.75`, `V6=…*1`) against `IT.Qtr1..5` paid and charges 1% × 3 (or ×1) per shortfall quarter; `AI47 = MAX(interest234C_MATC, SUM(AI42:AI46))`. Two step-tax tables `Step1.Total_Tax = AH17` and `Step2.Total_Tax = AL17` feed the marginal §234C-vs-MATC comparison. **The §234A/B/C figures that Part B-TTI actually reads (`CalculatedValue234A/B/C`, `DateOfFiling234A/B/C`) are hosted on `Tax(N)`, not here.**

---

## The rules the sheet computes (with cell references)

- **Slab tax by assessee group** — `C7:C35`, thresholds `A7:A10` (Group A), `A16:A18` (co-op Group D), `A23:A26` (AOP case 2); flat 30% `C14`/`C21`/`C31`, MMR 30% `C12`, 40% `C35`. Total `C37 = SUM(C7:C35)`. Mirrors rules Part B-TI 781–800.
- **Tax on total income** — `P38 = P36+P35−P37` (special + normal − agri rebate); Part B-TTI Sl.2d rule **A824** ("2d = 2a + 2b − 2c").
- **Gross tax payable = higher of normal or AMT** — `P42 = MAX(P41,R57)`; Part B-TTI Sl.3 rule **A834** ("higher of 1d or 2g").
- **AMT §115JC at 18.5%, floor ₹20L** — `R54`; Schedule-AMT rules **A682/A683** (adjusted income > ₹20L for AOP/BOI/AJP / firm), **A676** (§115JC = 9% where any IFSC unit), **A680** (2d = 2a+2b+2c), **A681** (3 = 1+2d).
- **§115JD (AMT credit)** — `P43 = IF(P41<=R57,0,AMTC.TaxSection115JD)`, applied only when normal < AMT; rules **A820/A821**, **A835** (Sl.5 = 3 − 4).
- **Surcharge** — rate `J2/D105 = 12% or 15%` above ₹1 cr (`IF(TotalIncome>10000000,Surcharge_Rate,0)`).
- **Marginal relief** — `D90 = IF(D83>10000000, MAX(D86−D89,0),0)` (AMT branch); `MarginalRelief_1 = T112` (normal branch). Surcharge after relief `D91`, `SurchargeOn2D_1 = T113`.
- **Health & education cess — computed here at 3%** (`P40`, `T25`, `R56`, `AB16…`, `Z32…`). *The correct A.Y. 2026-27 rate is 4% (`Tax(N)!AR113`, Part B-TTI `L56` use `0.04`).*
- **Rebate on agricultural income** — agri income grossed with basic exemption (`D43`), tax recomputed on it (`C47:C75`), rebate `C78`; consumed as `sheet9.RebateOnAgriInc` at `P37/P38`, `Z16`.
- **Special-rate tax** — `R25`/`U25` and the per-rate lists `C136:D144`; Schedule-SI rules **A705** ("tax = income × special rate"), **A708** (total = sum of line items).
- **§234C advance-tax schedule** — 15/45/75/100% cumulative (`V3:V6`), 1%×months on shortfall (`AA3:AA9`, `AI42:AI47`); Part B-TTI interest names `Sheet9.IntrstPayUs234A/B/C = J84/J85/J86`, total rule **A829/A830**.
- **Surcharge on AMT only if AMT income > threshold** — `D85`/`D90` gate on `D83>10000000`; category-B rule **B23** ("Surcharge on AMT only if AMT income > 1Cr or 50L").

---

## Dropdowns

**None.** `dump.py --dropdowns "Tax"` returns only numeric data-validations (`source` = `0`, `125`, `200`; `values: null`) on the rate/threshold cells (`C111:C112`, `D111:…`, `R53`, `R54`, …). There are no value lists to enumerate — this sheet has no user-selectable inputs.

---

## What repeats and what is one figure

Nothing on this sheet is a user-repeated grid. The repetition here is **internal fan-out**, all one-figure-per-cell:

- The **five group slab tables** (rows 7–35, 47–75, 109–134, 162–190) are the same slab logic replicated per assessee group/case; exactly one group's rows are non-zero for any assessee.
- The **§234C quarterly tables** repeat one row per advance-tax instalment (Q1/Q2/Q3/Q4/Q5, rows 3–7, 16–20, 32–46, 42–46) — five instalments, not user rows.
- The **CG special-rate waterfall** (cols S–BF, rows 32–46) repeats the exemption-and-tax step across the five quarters × four CG rate buckets.

Every output is a single scalar: `C37`, `C78`, `C192`, `P38`, `P46`, `R57`, `Q2`, `Q3`, `D90/D91`.

---

## Mandatory

**None.** The sheet has no schema block (`blocks: []`), so there are no `required` schema keys and nothing here is mandatory in the return-JSON sense. Its outputs are mandatory only transitively — the values it computes must equal what Part B-TTI reports (rules A824, A825, A834–A836).

---

## Hidden rows — not built

The **entire worksheet is hidden** (`state=hidden`); `hidden_rows: 0` — no individual rows are separately flagged. Because the sheet is hidden, Gate 3 skips it (`gate3`: `if s["state"]!="visible" … continue`), so this book is not row-label-checked; it is written to the sheet-reader contract regardless, as a method reference for the tax engine. Nothing on this sheet is "built" as a UI — it is a calculation model to be reimplemented in code, not rendered.

Off-screen helper columns not shown by the 24-column `dump.py` view but documented above: **Y–AA** (per-line surcharge/cess on the normal slab), **AC–BH** (CG special-rate waterfall), **AH–AV** (step-tax tables for §234C marginal relief). These are computation scratch, never emitted.

---

## What this means for the build

The tax engine the build must replicate (from this sheet's method):

1. **Classify the assessee** into one of five rate schedules from `sheet1.SubStatus[0]` (Group A slab; GrpA.PDT/MMR 30%; Group C flat 30%; Group D co-op slab 10/20/30% at ₹10k/₹20k; Group B AOP with member cases 1–5 including the foreign-share 40/30 split). Flags `F2:J2`, `E2`, cases `E21/E23/E27/E31/E35`.
2. **Tax on total income** = tax at normal slab on normal income (`CalculateTax(Normal_Income+…)`) **+** tax at special rates (Schedule-SI, per-rate lists `C136:D144`) **−** rebate on agricultural income (`C78`). = `P38`/Part B-TTI `L62`.
3. **Surcharge** at 12%/15% above ₹1 cr, **with marginal relief** (`D90`, `MarginalRelief_1`), apportioned across normal and special-rate income.
4. **Health & education cess at 4%** on (tax + surcharge). *Do **not** copy this sheet's 3% — use 4% (Part B-TTI `L56`/`Tax(N)`).* 
5. **AMT (§115JC) at 18.5%** on adjusted total income (total − 44AD income + Chapter VI-A part-C + §10AA), floor ₹20L (or 9% for IFSC units), with its own surcharge/marginal relief; **gross tax = MAX(normal, AMT)**; grant **§115JD credit** when normal < AMT.
6. **§234A/B/C interest** on the 15/45/75/100% advance-tax schedule with 1%/month shortfall.

**Wiring caveats the lead must reconcile before wiring this sheet as the live engine:**

- **This sheet is a 3%-cess-era duplicate.** Cess is 3% in every cell here (`P40`, `T25`, `R56`, `AB16`, `Z32`, …) versus 4% on `Tax(N)` (`AR113`) and Part B-TTI (`L56`). 4% is correct for A.Y. 2026-27.
- **All scalar inputs resolve to `Tax(N)`.** The global names this sheet reads — `TaxableIncome` (`Tax(N)!D4`), `NormalIncome` (`Tax(N)!C121`), `TotalIncome` (`Tax(N)!C118`), `BasicExemption` (`Tax(N)!W4`), `Higher_MATC` (`Tax(N)!W2`), `Is_44_AD_Applicable` (`Tax(N)!W27`), `Income_44_AD` (`Tax(N)!W28`), `Surcharge_44AD` (`Tax(N)!W29`), `Surcharge_Rate` (`Tax(N)!M2`), `SurchargeInterestRate` (`Tax(N)!C120`), `MarginalRelief` (`Tax(N)!C176`), `Normal_Income_234C` (`Tax(N)!W12`), `Step1Tax`/`Step2Tax` (`Tax(N)!AV15/AV18`), `Consumed_BE`/`CGExmptn15Per`/`NormalIncome_MinusBE` — are all hosted on the "excluded" twin `Tax(N)`.
- **The §234 interest figures Part B-TTI consumes are on `Tax(N)`**, not here: `CalculatedValue234A/B/C = Tax(N)!W34/35/36`, `DateOfFiling234A/B/C = Tax(N)!W45/46/47`, `Balance_Interest`/`IT_Interest`/`Month_Wise_234Bvalues` (`Tax(N)!CB:CE`).
- **No formula on any other sheet reads this sheet's 123 output names** (`NET_TAX`, `TaxPayableOnTotInc_1`, `Step1.Total_Tax`, `GrpA.Income1`, `TotalIncome1`, `NormalIncome1`, `NetTaxLiability_44AD`, `TotalTax_DI_44AD`, … — all "NONE outside Tax/Tax(N)"). The only bridge from either engine to Part B-TTI's `J59/J60/J66/J70` (which are blank in the XML) is the **VBA macro**, whose text (`sources/ITR-5/vba_text.txt`) is a binary dump and unreadable as source.

Net: implement the method above as the tax engine, use **4% cess**, and take the section-map's "Tax = live / Tax(N) = excluded" designation as **unverified** — the evidence (correct 4% cess, scalar-input hosting, 234-interest hosting) points to `Tax(N)` being the live twin. Flag for the lead to confirm against the running utility before choosing which sheet's constants to trust.

---

*Sources: `tools/dump.py --form ITR-5 --sheet "Tax" [--formulas] [--dropdowns]`; `sources/ITR-5/utility/xl/workbook.xml` (definedNames, sheet state); cross-sheet reads of `PARTB - TI - TTI` and `Tax(N)`; `books/ITR-5/rules.json` (A676–A696, A705–A712, A819–A841, B23). VBA (`vba_text.txt`) is a binary blob — not quotable as source.*
