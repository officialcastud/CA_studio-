# DPM_DOA (Schedule DPM & Schedule DOA) — ITR-5, A.Y. 2026-27

Sheet `DPM_DOA` (sheet15.xml), state **visible**, 53 rows, 2 hidden rows. Section `bp`. Blocks: **ScheduleDPM**, **ScheduleDOA** (from `section_map.json`).

## The shape
This one visible sheet holds two block-of-assets depreciation schedules stacked vertically.

- **Schedule DPM** (rows 3–27) — `[E3] Depreciation on Plant and Machinery (Other than assets on which full capital expenditure is allowable as deduction under any other section)`. Four fixed rate blocks of `[F4] Plant and machinery` in columns **(i) (ii) (iii) (iv)** = rates **15% / 30% / 40% / 45%** (`[E5] Rate (%)`, row 5). Mapped to schema `PlantMachinery.Rate15 / Rate30 / Rate40 / Rate45`.
- **Schedule DOA** (rows 29–51) — `[E29] Depreciation on other assets (Other than assets on which full capital expenditure is allowable as deduction)`. Seven fixed columns **(i)–(vii)**: `[F30] Land` (rate `[F32] Nil`), `[G30] Building (not including land)` at **5% / 10% / 40%** (cols ii/iii/iv), `[J30] Furniture and fittings` **10%** (v), `[K30] Intangible Assets` **25%** (vi), `[L30] Ships` **20%** (vii). Mapped to schema `Land`, `Building.Rate5/Rate10/Rate40`, `FurnitureFittings.Rate10`, `IntangibleAssets.Rate25`, `Ships.Rate20`.

Each block is **one fixed depreciation computation** (WDV first day → additions → realizations → depreciation at full/half rate → total → net → WDV last day), not a repeating list. The rate blocks and asset columns are structural (fixed by the schema); the assessee never adds rows or picks a rate.

Row/column layout: line labels are in column **E** (item number tags `3a`,`3b` in column D). Data columns are **F,G,H,I** for DPM (i–iv) and **F,G,H,I,J,K,L** for DOA (i–vii). Columns **Q3:Q12** hold hidden helper/validator cells (see Rules → validators). Amounts are integers (0 dp).

The utility's internal **named ranges** (used in formulas / `sheet_map.json`) map to columns as: DPM `DPM15`=F(i,15%), `DPM30`=G(ii,30%), `DPM40`=H(iii,40%), `DPM45`=I(iv,45%); DOA `DAOB0`=F(Land), `DAOB5`=G(Building 5%), `DAOB10`=H(Building 10%), `DAOB100`=I(Building 40%), `DAOF10`=J(Furniture 10%), `DAOI25`=K(Intangible 25%), `DAOS20`=L(Ships 20%). (Note: alias `DAOB100` is the **40%** building column, its `RATE` lives in cell I32.)

## The items — Schedule DPM (block ScheduleDPM)
Columns (i)=`PlantMachinery.Rate15`, (ii)=`Rate30`, (iii)=`Rate40`, (iv)=`Rate45`. Every data row is keyed under `PlantMachinery.<Rate>.DepreciationDetail.<key>`. Sl.No. from `rules.json`. Cells shown for column (i) = F; the same row exists in G/H/I.

| Sl.No. (row) | Field label (verbatim) | Type | schema key | rule / cell |
|---|---|---|---|---|
| 1 (r5) | Rate (%) | header | — | 15 / 30 / 40 / 45 in F5:I5 (`DPM15.RATE`=F5 …) |
| 2 (r4) | Block of assets — Plant and machinery | header | `PlantMachinery` | four rate blocks Rate15/Rate30/Rate40/Rate45; cols (i)(ii)(iii)(iv) at r6 |
| 3a (r7) | Written down value on the first day of previous year | integer (input) | `PlantMachinery.Rate15.DepreciationDetail.WDVFirstDay` | opening WDV; required |
| 3b (r8) | Adjustment as per second proviso to sub section 3 of section 115BAC (Refer to rule 5) | integer (input) | `...DepreciationDetail.AdjustmentSec115BAC` | optional; not allowed to firm/LLP/co-op or under new regime |
| 3 (r9) | Total (3a+3b) | integer (computed) | `...DepreciationDetail.Total` | `[F9]= DPM15.WDVFirstDay+DPM15.WDVFirstDayBAC` (= WDVFirstDay + AdjustmentSec115BAC) |
| 4 (r10) | Additions for a period of 180 days or more in the previous year | integer (input) | `...DepreciationDetail.AdditionsGrThan180Days` | required |
| 5 (r11) | Consideration or other realization during the previous year out of 3 or 4 | integer (input) | `...DepreciationDetail.RealizationTotalPeriod` | required |
| 6 (r12) | Amount on which depreciation at full rate to be allowed (3 + 4 - 5) (enter 0, if result is negative) | integer (computed) | `...DepreciationDetail.FullRateDeprAmt` | `[F12]= MAX(0,F9+F10-F11)` |
| 7 (r13) | Additions for a period of less than 180 days in the previous year | integer (input) | `...DepreciationDetail.AdditionsLessThan180Days` | required |
| 8 (r14) | Consideration or other realizations during the year out of 7 | integer (input) | `...DepreciationDetail.RealizationPeriodDuringYear` | required |
| 9 (r15) | Amount on which depreciation at half rate to be allowed (7 - 8) (enter 0, if result in negative) | integer (computed) | `...DepreciationDetail.HalfRateDeprAmt` | `[F15]= MAX(0,F13-F14+MIN(0,F9+F10-F11))` |
| 10 (r16) | Depreciation on 6 at full rate | integer (computed) | `...DepreciationDetail.DepreciationAtFullRate` | `[F16]= ROUND(DPM15.FullRateDeprAmt*DPM15.RATE/100,0)` |
| 11 (r17) | Depreciation on 9 at half rate | integer (computed) | `...DepreciationDetail.DepreciationAtHalfRate` | `[F17]= ROUND(DPM15.HalfRateDeprAmt*DPM15.RATE/200,0)` (half = RATE/200) |
| 12 (r18) | Additional depreciation, if any, on 4 | integer (input) | `...DepreciationDetail.AddlnDeprOnGT180DayAdditions` | optional; disallowed under new tax regime |
| 13 (r19) | Additional depreciation, if any, on 7 | integer (input) | `...DepreciationDetail.AddlnDeprDuringYearAdditions` | optional; disallowed under new tax regime |
| 14 (r20) | Additional depreciation relating to immediately preceding year' on asset put to use for less than 180 days | integer (input) | `...DepreciationDetail.AddlnDeprOnLessThan180DayAdditions` | optional (alias `DPM15.AddlnDeprlessthan180days`=F20); disallowed under new regime |
| 15 (r21) | Total depreciation* (10+11+12+13+14) | integer (computed) | `...DepreciationDetail.TotalDepreciation` | `[F21]= DPM15.DepreciationAtHalfRate + DPM15.DepreciationAtFullRate + DPM15.AddlnDeprDuringYearAdditions + DPM15.AddlnDeprOnGT180DayAdditions + DPM15.AddlnDeprlessthan180days` |
| 16 (r22) | Depreciation disallowed under section 38(2) of the I.T. Act (out of column 15) | integer (input) | `...DepreciationDetail.DepDisAllowUs38_2` | required (alias `DepreciationDisallowed`) |
| 17 (r23) | Net aggregate depreciation (15-16) | integer (computed) | `...DepreciationDetail.NetAggregateDepreciation` | `[F23]= MAX(F21-F22,0)` (alias `NetDepreciation`) |
| 18 (r24) | Proportionate aggregate depreciation allowable in the event of succession, amalgamation, demerger etc. | integer (input) | `...DepreciationDetail.ProportionateAggDepreciation` | must be out of net aggregate at Sl.17 (alias `DepreciationAllowed`) |
| 19 (r25) | Expenditure incurred in connection with transfer of asset/ assets | integer (input) | `...DepreciationDetail.ExpdrOnTrforSaleAsset` | required |
| 20 (r26) | Capital gains/ loss under section 50* (5 + 8 – 3 – 4 -7 - 19) (enter negative only if block ceases to exist) | integer (input) | `...DepreciationDetail.CapGainUs50` | may be **negative** (min −99999999999999); validator Q3 |
| 21 (r27) | Written down value on the last day of previous year* (6+ 9 -15) (enter 0 if result is negative) | integer (computed) | `...DepreciationDetail.WDVLastDay` | `[F27]= MAX(DPM15.tot3A3B+DPM15.AdditionsGrThan180Days -DPM15.RealizationTotalPeriod + DPM15.AdditionsLessThan180Days - DPM15.RealizationPeriodDuringYear - DPM15.TotalDepreciation,0)` |

**Rate45 quirk (column iv).** In the schema `PlantMachinery.Rate45.DepreciationDetail` carries only: `WDVFirstDay`, `AdjustmentSec115BAC`, `Total`, `RealizationTotalPeriod`, `FullRateDeprAmt`, `DepreciationAtFullRate`, `TotalDepreciation`, `DepDisAllowUs38_2`, `NetAggregateDepreciation`, `ProportionateAggDepreciation`, `ExpdrOnTrforSaleAsset`, `CapGainUs50`, `WDVLastDay` — it has **no** `AdditionsGrThan180Days`, `AdditionsLessThan180Days`, `RealizationPeriodDuringYear`, `HalfRateDeprAmt`, `DepreciationAtHalfRate`, nor any additional-depreciation keys. The sheet, however, still contains live cells I10–I20 and formulas I12/I15/I16/I17 for the 45% column. **Discrepancy to respect on the build: for the 45% P&M block, export only the Rate45 leaf set the schema allows.** (Depreciation @45% cannot be claimed by an assessee opting for 115BAD — see rules.)

## The items — Schedule DOA (block ScheduleDOA)
Columns: (i) `Land` (rate Nil), (ii) `Building.Rate5` (5%), (iii) `Building.Rate10` (10%), (iv) `Building.Rate40` (40%, alias `DAOB100`), (v) `FurnitureFittings.Rate10` (10%), (vi) `IntangibleAssets.Rate25` (25%), (vii) `Ships.Rate20` (20%). Data rows keyed under `<Asset>.<Rate>.DepreciationDetail.<key>`; Land under `Land.DepreciationDetail`. **DOA has no additional-depreciation rows** (they are hidden — see below) so numbering differs from DPM. Cells shown for column (ii) = G (Building 5%); the same row exists G–L.

| Sl.No. (row) | Field label (verbatim) | Type | schema key | rule / cell |
|---|---|---|---|---|
| 1 (r32) | Rate (%) | header | — | Nil / 5 / 10 / 40 / 10 / 25 / 20 in F32:L32 |
| 2 (r30) | Block of assets — Land / Building (not including land) / Furniture and fittings / Intangible Assets / Ships | header | `Land` `Building` `FurnitureFittings` `IntangibleAssets` `Ships` | cols (i)–(vii) at r33 |
| 3 (r34) | Written down value on the first day of previous year | integer (input) | `Building.Rate5.DepreciationDetail.WDVFirstDay` (Land → `Land.DepreciationDetail.WDVFirstDay`) | required |
| 4 (r35) | Additions for a period of 180 days or more in the previous year | integer (input) | `...DepreciationDetail.AdditionsGrThan180Days` | required (not for Land) |
| 5 (r36) | Consideration or other realization during the previous year out of 3 or 4 | integer (input) | `...DepreciationDetail.RealizationTotalPeriod` | required |
| 6 (r37) | Amount on which depreciation at full rate to be allowed (3 + 4 -5) (enter 0, if result is negative) | integer (computed) | `...DepreciationDetail.FullRateDeprAmt` | `[G37]= MAX(0,G34+G35-G36)` |
| 7 (r38) | Additions for a period of less than 180 days in the previous year | integer (input) | `...DepreciationDetail.AdditionsLessThan180Days` | required |
| 8 (r39) | Consideration or other realizations during the year out of 7 | integer (input) | `...DepreciationDetail.RealizationPeriodDuringYear` | required |
| 9 (r40) | Amount on which depreciation at half rate to be allowed (7-8) (enter 0, if result in negative) | integer (computed) | `...DepreciationDetail.HalfRateDeprAmt` | `[G40]= MAX(0,G38-G39+MIN(0,G34+G35-G36))` |
| 10 (r41) | Depreciation on 6 at full rate | integer (computed) | `...DepreciationDetail.DepreciationAtFullRate` | `[G41]= ROUND(DAOB5.FullRateDeprAmt*DAOB5.RATE/100,0)` |
| 11 (r42) | Depreciation on 9 at half rate | integer (computed) | `...DepreciationDetail.DepreciationAtHalfRate` | `[G42]= ROUND(DAOB5.HalfRateDeprAmt*DAOB5.RATE/200,0)` |
| 12 (r45) | Total depreciation (10+11) | integer (computed) | `...DepreciationDetail.TotalDepreciation` | `[G45]= DAOB5.DepreciationAtHalfRate + DAOB5.DepreciationAtFullRate + DAOB5.AddlnDeprDuringYearAdditions + DAOB5.AddlnDeprOnGT180DayAdditions` (addln terms are 0 — rows hidden) |
| 13 (r46) | Depreciation disallowed under section 38(2) of the I.T. Act (out of column 12) | integer (input) | `...DepreciationDetail.DepDisAllowUs38_2` | required |
| 14 (r47) | Net aggregate depreciation (12-13) | integer (computed) | `...DepreciationDetail.NetAggregateDepreciation` | `[G47]= MAX(G45-G46,0)` (shared G47:L47) |
| 15 (r48) | Proportionate aggregate depreciation allowable in the event of succession, amalgamation, demerger etc. | integer (input) | `...DepreciationDetail.ProportionateAggDepreciation` | must be out of net aggregate at Sl.14 |
| 16 (r49) | Expenditure incurred in connection with transfer of asset/ assets | integer (input) | `...DepreciationDetail.ExpdrOnTrforSaleAsset` | required |
| 17 (r50) | Capital gains/ loss under section 50 (5 + 8 -3-4 -7 -16) (enter negative only if block ceases to exist) | integer (input) | `...DepreciationDetail.CapGainUs50` | may be **negative** (min −99999999999999); validator Q7 |
| 18 (r51) | Written down value on the last day of previous year* (6+ 9 -12) (enter 0 if result is negative) | integer (computed) | `...DepreciationDetail.WDVLastDay` | `[G51]= MAX(DAOB5.WDVFirstDay+DAOB5.AdditionsGrThan180Days -DAOB5.RealizationTotalPeriod + DAOB5.AdditionsLessThan180Days - DAOB5.RealizationPeriodDuringYear - DAOB5.TotalDepreciation,0)` |

**Land column (i).** Land is rate `Nil`: the schema `Land.DepreciationDetail` carries only `WDVFirstDay` (input, r34/F34) and `WDVLastDay` (computed, r51). `[F51]= MAX(DAOB0.WDVFirstDay,0)` — WDV last = WDV first. All other Land cells (F35–F50) are blank on the sheet.

## The rules the sheet computes (with cell refs)
DPM (column F shown; identical across G/H/I):
- **3 Total (3a+3b)** `[F9]= DPM15.WDVFirstDay+DPM15.WDVFirstDayBAC` — Total = WDVFirstDay + AdjustmentSec115BAC (rule: sl.3 = 3a + 3b).
- **6 Amount at full rate (3+4-5)** `[F12]= MAX(0,F9+F10-F11)` — floors at 0 (rule: sl.6 = 3+4-5 or 0).
- **9 Amount at half rate (7-8)** `[F15]= MAX(0,F13-F14+MIN(0,F9+F10-F11))` (rule: sl.9 = 7-8 or 0).
- **10/11 depreciation** `[F16]= ROUND(DPM15.FullRateDeprAmt*DPM15.RATE/100,0)`, `[F17]= ROUND(DPM15.HalfRateDeprAmt*DPM15.RATE/200,0)` — half rate divides by 200 (rules: sl.10/11 must match the rate at sl.2).
- **15 Total depreciation (10+11+12+13+14)** `[F21]= DepreciationAtHalfRate + DepreciationAtFullRate + AddlnDeprDuringYearAdditions + AddlnDeprOnGT180DayAdditions + AddlnDeprlessthan180days`.
- **17 Net aggregate (15-16)** `[F23]= MAX(F21-F22,0)`.
- **21 WDV last day (6+9-15)** `[F27]= MAX(tot3A3B+AdditionsGrThan180Days -RealizationTotalPeriod + AdditionsLessThan180Days - RealizationPeriodDuringYear - TotalDepreciation,0)`. (Rule: if sl.20 = 0, sl.21 = 7-8+3+4-5-15.)
- **20 Capital gains u/s 50** input `= 5 + 8 – 3 – 4 -7 - 19`; if capital gains ≠ 0 then sl.10–18 & 21 must be 0 (rule); may be negative only if block ceases to exist.
- **Additional depreciation (sl.12/13/14) cannot be claimed under the new tax regime** (rule); the 3b/AdjustmentSec115BAC row is not allowed to firm/LLP/co-op or under new regime.

DOA (column G shown; identical across G–L):
- **6 full-rate amount** `[G37]= MAX(0,G34+G35-G36)`.
- **9 half-rate amount** `[G40]= MAX(0,G38-G39+MIN(0,G34+G35-G36))`.
- **10/11 depreciation** `[G41]= ROUND(DAOB5.FullRateDeprAmt*DAOB5.RATE/100,0)`, `[G42]= ROUND(DAOB5.HalfRateDeprAmt*DAOB5.RATE/200,0)`.
- **12 Total depreciation (10+11)** `[G45]= DepreciationAtHalfRate + DepreciationAtFullRate + AddlnDeprDuringYearAdditions + AddlnDeprOnGT180DayAdditions` (last two = 0, DOA rows hidden).
- **14 Net aggregate (12-13)** `[G47]= MAX(G45-G46,0)`.
- **18 WDV last day (6+9-12)** `[G51]= MAX(WDVFirstDay+AdditionsGrThan180Days -RealizationTotalPeriod + AdditionsLessThan180Days - RealizationPeriodDuringYear - TotalDepreciation,0)`; **Land** `[F51]= MAX(DAOB0.WDVFirstDay,0)`.
- **17 Capital gains u/s 50** input `= 5+8-3-4-7-16`; if ≠ 0 then sl.10–15 & 18 must be 0 (rule).

**Validators (hidden helper cells, columns Q3:Q12).** Named `DPMxx.check20A` (DPM, sl.20) and `DAOxx.Check17A` (DOA, sl.17). Examples: `[Q3]= F11+F14-F7-F10-F13` (DPM15 = 5+8-3a-4-7), `[Q7]= G36+G39-G34-G35-G38` (DAOB5 = 5+8-3-4-7). They compute the capital-gains base for the rule that CapGainUs50 must not be less than (5+8-3-4-7-19) [DPM] / (5+8-3-4-7-16) [DOA] when consideration exceeds opening WDV + additions. These Q cells are **not** ScheduleDPM/DOA schema leaves — do not export them.

## Dropdowns
`--dropdowns "DPM_DOA"` returns **16 data-validation entries, all numeric bounds — no enumerated (list) dropdowns** (`values` is `null` for every entry). Two bound types:
- **min 0** (`source` "0") — nearly every cell (F7:I9, F10:I24, F37:L37, F40:L51 groups, etc.): amounts floor at 0.
- **min −99999999999999** (`source` "-99999999999999") — cells `G50:L50 F26:I26` = the **Capital gains/loss u/s 50** cells (`CapGainUs50`), the only cells allowed to be negative.

No value strings to reproduce.

## What repeats and what is one figure
Nothing repeats as a user-added array. Each block is a single fixed `DepreciationDetail` object — one figure per row per block. DPM has exactly four blocks (`Rate15/Rate30/Rate40/Rate45`, cols i–iv); DOA has exactly the fixed set `Land`, `Building.Rate5/Rate10/Rate40`, `FurnitureFittings.Rate10`, `IntangibleAssets.Rate25`, `Ships.Rate20` (cols i–vii). Blocks and rates are structural (schema-fixed), never entered or added.

## Mandatory (from schema `required`)
- **ScheduleDPM** — block root `required: ['PlantMachinery']`. Within each Rate15/Rate30/Rate40 `DepreciationDetail` the **required** keys are: `WDVFirstDay`, `AdditionsGrThan180Days`, `RealizationTotalPeriod`, `FullRateDeprAmt`, `AdditionsLessThan180Days`, `RealizationPeriodDuringYear`, `HalfRateDeprAmt`, `DepreciationAtFullRate`, `DepreciationAtHalfRate`, `TotalDepreciation`, `DepDisAllowUs38_2`, `NetAggregateDepreciation`, `ProportionateAggDepreciation`, `ExpdrOnTrforSaleAsset`, `CapGainUs50`, `WDVLastDay`. Optional: `AdjustmentSec115BAC`, `Total`, `AddlnDeprOnGT180DayAdditions`, `AddlnDeprDuringYearAdditions`, `AddlnDeprOnLessThan180DayAdditions`. **Rate45** required subset: `WDVFirstDay`, `RealizationTotalPeriod`, `FullRateDeprAmt`, `DepreciationAtFullRate`, `TotalDepreciation`, `DepDisAllowUs38_2`, `NetAggregateDepreciation`, `ProportionateAggDepreciation`, `ExpdrOnTrforSaleAsset`, `CapGainUs50`, `WDVLastDay` (no half-rate / additions / additional-depreciation keys).
- **ScheduleDOA** — block root `required: None` (each asset object is optional; report only blocks the assessee uses). Within any `DepreciationDetail` provided (Building.Rate5/Rate10/Rate40, FurnitureFittings.Rate10, IntangibleAssets.Rate25, Ships.Rate20) the required keys match the DPM list above (DOA has no additional-depreciation keys). **Land** carries only required `WDVFirstDay` and `WDVLastDay`.

## Hidden rows — not built
Sheet has exactly **2 hidden rows** (`sheet_map.json` hidden_rows: 2):
- **r43 (H)** — `[E43] Additional depreciation, if any, on 4` (Schedule DOA). Hidden — other assets are not eligible for additional depreciation; not in the ScheduleDOA schema. Do not build.
- **r44 (H)** — `[E44] Additional depreciation, if any, on 7` (Schedule DOA). Hidden — same reason. Do not build.

## What this means for the build
- Build DPM as four fixed P&M rate blocks (15/30/40/45) and DOA as Land + Building(5/10/40) + Furniture(10) + Intangible(25) + Ships(20). Rates and blocks are structural, not user-chosen; no add-row UI.
- Computed cells (Total 3a+3b; full/half amounts sl.6/9; depreciations sl.10/11; total sl.15[DPM]/12[DOA]; net aggregate sl.17[DPM]/14[DOA]; WDV last day) are green/untypeable. User enters: WDV first day, 115BAC adjustment (DPM only), additions (>180 & <180), realizations, additional depreciation (DPM only, sl.12/13/14), 38(2) disallowance, proportionate depreciation, transfer expenditure, and capital gains u/s 50.
- Half-rate depreciation divides the rate by **200** (= half of RATE/100); ROUND to 0 dp.
- Only `CapGainUs50` (DPM F26:I26, DOA G50:L50) may be **negative** (min −99999999999999) and only when the block ceases to exist; every other cell floors at 0.
- **Rate45 (P&M 45%)**: export only the reduced Rate45 leaf set — the schema omits half-rate and additional-depreciation keys even though the sheet shows those cells. Depreciation @45% cannot be claimed under 115BAD.
- **Land**: export only `WDVFirstDay` and `WDVLastDay` (= MAX(WDVFirstDay,0)).
- New tax regime (115BAC): additional depreciation (sl.12/13/14) must be 0 and the 3b `AdjustmentSec115BAC` row is not allowed to firm/LLP/co-op or under new regime.
- If capital gains u/s 50 (sl.20 DPM / sl.17 DOA) ≠ 0, the depreciation rows and WDV-last-day for that block must be 0 (block ceased). The Q3:Q12 helper/validator cells enforce the capital-gains-floor rule; they are not schema leaves — do not export.
- Do not surface the hidden rows (r43, r44).

## Additional visible headers — verbatim (completeness)
- Schedule DPM
- DEPRECIATION ON PLANT AND MACHINERY
- Schedule DOA
- DEPRECIATION ON OTHER ASSETS
- Total (3a+3b)
