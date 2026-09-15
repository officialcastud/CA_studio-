# DPM - DOA (Schedule DPM & Schedule DOA) — ITR-3, A.Y. 2026-27

## The shape
This visible sheet holds two block-of-assets depreciation schedules. **Schedule DPM** — "Depreciation on Plant and Machinery (Other than assets on which full capital expenditure is allowable as deduction under any other section)" — carries four rate blocks of Plant and machinery: 15%, 30%, 40% and 45% (columns i–iv). **Schedule DOA** — "Depreciation on Other assets (Other than assets on which full capital expenditure is allowable as deduction)" — carries Land (Nil), Building at 5%/10%/40%, Furniture and Fittings 10%, Intangible assets 25% and Ships 20% (columns i–vii). Each block is one fixed depreciation computation (WDV → additions → realizations → depreciation → WDV last day), not a repeating list; the assessee has exactly one figure per row per block.

## The items — Schedule DPM (block ScheduleDPM)
Columns: (i) = Rate15 (15%), (ii) = Rate30 (30%), (iii) = Rate40 (40%), (iv) = Rate45 (45%). Rows below are keyed under `PlantMachinery.<Rate>.DepreciationDetail.<key>`. Sl.No. from the rules document.

| Sl.No. (row) | Field label | Type | schema key | rule / notes |
|---|---|---|---|---|
| 1 (r4) | Block of assets — Plant and machinery | header | `PlantMachinery` | four rate blocks Rate15/Rate30/Rate40/Rate45 |
| 2 (r5) | Rate (%) | header | — | 15 / 30 / 40 / 45; columns (i)(ii)(iii)(iv) at r6 |
| 3 (r7) | Written down value on the first day of previous year | integer | `WDVFirstDay` | opening WDV; required |
| 3a/3b (r11) | Adjustment as per second proviso to sub section 3 of section 115BAC (Refer to Rule 5) | integer | `AdjustmentSec115BAC` | 115BAC WDV adjustment |
| 3 total (r12) | Total (3a+3b) | integer (computed) | `Total` | `[F12]= MAX(0,WDVFirstDay+Adjmt2NDprov3section115BAC)` |
| 4 (r13) | Additions for a period of 180 days or more in the previous year | integer | `AdditionsGrThan180Days` | required |
| 5 (r14) | Consideration or other realization during the previous year out of 3 or 4 | integer | `RealizationTotalPeriod` | required |
| 6 (r15) | Amount on which depreciation at full rate to be allowed (3 + 4 -5) (Enter 0, if result is negative) | integer (computed) | `FullRateDeprAmt` | `[F15]= MAX(0,tot3A3B+AdditionsGrThan180Days-RealizationTotalPeriod)` |
| 7 (r16) | Additions for a period of less than 180 days in the previous year | integer | `AdditionsLessThan180Days` | required |
| 8 (r17) | Consideration or other realizations during the year out of 7 | integer | `RealizationPeriodLessThan180days` | required |
| 9 (r18) | Amount on which depreciation at half rate to be allowed (7 – 8) (Enter 0, if result is negative) | integer (computed) | `HalfRateDeprAmt` | `[F18]= MAX(0,F16-F17+MIN(0,F7+F13-F14))` |
| 10 (r19) | Depreciation on 6 at full rate | integer (computed) | `DepreciationAtFullRate` | `[F19]= ROUND(FullRateDeprAmt*RATE/100,0)` |
| 11 (r20) | Depreciation on 9 at half rate | integer (computed) | `DepreciationAtHalfRate` | `[F20]= ROUND(HalfRateDeprAmt*RATE/200,0)` |
| 12 (r21) | Additional depreciation, if any, on 4 | integer | `AddlnDeprOnGT180DayAdditions` | new tax regime: additional depreciation must be zero |
| 13 (r22) | Additional depreciation, if any, on 7 | integer | `AddlnDeprOnLessThan180DayAdditions` | |
| 14 (r23) | Additional depreciation relating to immediately preceding year' on asset put to use for less than 180 days | integer | `AddlnDeprOnAssetLessThan180Days` | |
| 15 (r24) | Total depreciation (10+11+12+13+14) | integer (computed) | `TotalDepreciation` | `[F24]= DepreciationAtHalfRate+DepreciationAtFullRate+AddlnDepr...` |
| 16 (r25) | Depreciation disallowed under section 38(2) of the I.T. Act (out of column 15) | integer | `DepDisAllowUs38_2` | required |
| 17 (r26) | Net aggregate depreciation (15-16) | integer (computed) | `NetAggregateDepreciation` | `[F26]= MAX(0,F24-F25)` |
| 18 (r27) | Proportionate aggregate depreciation allowable in the event of succession, amalgamation, demerger etc. (out of column 17) | integer | `ProportionateAggDepreciation` | must be out of net aggregate at Sl.No.17 |
| 19 (r28) | Expenditure incurred in connection with transfer of asset/ assets | integer | `ExpdrOnTrforSaleAsset` | required |
| 20 (r29) | Capital gains/ loss under section 50 (5 + 8 -3-4 -7 -19) (Enter negative only if block ceases to exist) | integer | `CapGainUs50` | may be negative; `[P2]= F14+F17-F10-F13-F16` helper |
| (r30) | Written down value on the last day of previous year (6+ 9 -15) (enter 0 if result is negative) | integer (computed) | `WDVLastDay` | `[F30]= MAX(WDVFirstDay+Adjmt2NDprov3section115BAC+AdditionsGrThan180Days-Realization...)` |

Rate45 (45% block, column iv) carries only: `WDVFirstDay`, `AdjustmentSec115BAC`, `Total`, `RealizationTotalPeriod`, `FullRateDeprAmt`, `DepreciationAtFullRate`, `TotalDepreciation`, `DepDisAllowUs38_2`, `NetAggregateDepreciation`, `ProportionateAggDepreciation`, `ExpdrOnTrforSaleAsset`, `CapGainUs50`, `WDVLastDay` — no half-rate or additional-depreciation keys (depreciation in the 45% block cannot be claimed under the new regime as per Rule 5).

## The items — Schedule DOA (block ScheduleDOA)
Columns: (i) Land = Nil, (ii) Building 5% = `Building.Rate5`, (iii) Building 10% = `Building.Rate10`, (iv) Building 40% = `Building.Rate40`, (v) Furniture and Fittings 10% = `FurnitureFittings.Rate10`, (vi) Intangible assets 25% = `IntangibleAssets.Rate25`, (vii) Ships 20% = `Ships.Rate20`. Rows keyed under `<Asset>.<Rate>.DepreciationDetail.<key>` (Land under `Land.DepreciationDetail`).

| Sl.No. (row) | Field label | Type | schema key | rule / notes |
|---|---|---|---|---|
| 1 (r34) | Block of assets — Land / Building(not including land) / Furniture and Fittings / Intangible assets / Ships | header | `Land` `Building` `FurnitureFittings` `IntangibleAssets` `Ships` | |
| 2 (r36) | Rate (%) | header | — | Nil / 5 / 10 / 40 / 10 / 25 / 20 |
| 3 (r38) | Written down value on the first day of previous year | integer | `WDVFirstDay` | Land uses `Land.DepreciationDetail.WDVFirstDay` |
| 4 (r39) | Additions for a period of 180 days or more in the previous year | integer | `AdditionsGrThan180Days` | required |
| 5 (r40) | Consideration or other realization during the previous year out of 3 or 4 | integer | `RealizationTotalPeriod` | required |
| 6 (r41) | Amount on which depreciation at full rate to be allowed (3 + 4 -5) (Enter 0, if result is negative) | integer (computed) | `FullRateDeprAmt` | `[G41]= MAX(0,G38+G39-G40)` |
| 7 (r42) | Additions for a period of less than 180 days in the previous year | integer | `AdditionsLessThan180Days` | required |
| 8 (r43) | Consideration or other realizations during the year out of 7 | integer | `RealizationPeriodLessThan180days` | required |
| 9 (r44) | Amount on which depreciation at half rate to be allowed (7-8) (Enter 0, if result is negative) | integer (computed) | `HalfRateDeprAmt` | `[G44]= MAX(0,G42-G43+MIN(0,G38+G39-G40))` |
| 10 (r45) | Depreciation on 6 at full rate | integer (computed) | `DepreciationAtFullRate` | `[G45]= ROUND(FullRateDeprAmt*RATE/100,0)` |
| 11 (r46) | Depreciation on 9 at half rate | integer (computed) | `DepreciationAtHalfRate` | `[G46]= ROUND(HalfRateDeprAmt*RATE/200,0)` |
| 12 (r49) | Total depreciation (10+11) | integer (computed) | `TotalDepreciation` | `[G49]= DepreciationAtHalfRate+DepreciationAtFullRate` (no additional depreciation in DOA) |
| 13 (r50) | Depreciation disallowed under section 38(2) of the I.T. Act (out of column 12) | integer | `DepDisAllowUs38_2` | required |
| 14 (r51) | Net aggregate depreciation (12-13) | integer (computed) | `NetAggregateDepreciation` | `[G51]= MAX(0,TotalDepreciation-DepUnderSec38)` |
| 15 (r52) | Proportionate aggregate depreciation allowable in the event of succession, amalgamation, demerger etc. (out of column 14) | integer | `ProportionateAggDepreciation` | must be out of net aggregate at Sl.No.14 |
| 16 (r53) | Expenditure incurred in connection with transfer of asset/ assets | integer | `ExpdrOnTrforSaleAsset` | required |
| 17 (r54) | Capital gains/ loss under section 50 (5 + 8 -3-4 -7 -16) (Enter negative only if block ceases to exist) | integer | `CapGainUs50` | may be negative |
| 18 (r55) | Written down value on the last day of previous year (6+ 9 -12) (enter 0 if result is negative) | integer (computed) | `WDVLastDay` | `[G55]= MAX(WDVFirstDay+AdditionsGrThan180Days-RealizationTotalPeriod+AdditionsLessThan180...)`; Land `[F55]= MAX(0,F38)` |

## The rules the sheet computes (with cell references)
- **DPM Total (3a+3b)** `[F12]= MAX(0,DPM15.WDVFirstDay+DPM15.Adjmt2NDprov3section115BAC)` (also G12,H12,I12) — 115BAC adjustment folded in, floored at 0.
- **DPM amount at full rate (Sl.6 = 3+4-5)** `[F15]= MAX(0,tot3A3B+AdditionsGrThan180Days-RealizationTotalPeriod)`.
- **DPM amount at half rate (Sl.9 = 7-8)** `[F18]= MAX(0,F16-F17+MIN(0,F7+F13-F14))`.
- **DPM depreciation full rate (Sl.10)** `[F19]= ROUND(FullRateDeprAmt*RATE/100,0)`.
- **DPM depreciation half rate (Sl.11)** `[F20]= ROUND(HalfRateDeprAmt*RATE/200,0)` — half rate = RATE/200.
- **DPM total depreciation (Sl.15 = 10+11+12+13+14)** `[F24]= DepreciationAtHalfRate+DepreciationAtFullRate+AddlnDepr…`.
- **DPM net aggregate (Sl.17 = 15-16)** `[F26]= MAX(0,F24-F25)`.
- **DPM WDV last day (6+9-15)** `[F30]= MAX(WDVFirstDay+Adjmt2NDprov3section115BAC+AdditionsGrThan180Days-Realization…,0)`.
- **DPM capital-gains helper** `[P2]= F14+F17-F10-F13-F16` (per rate column P2/Q2/R2/S2).
- **DPM 115BAC adjusted WDV feed** `[G10]= 0+DPM30.WDVFirstDayBAC`, `[H10]= 0+DPM40.WDVFirstDayBAC`, `[I10]= DPM45.WDVFirstDay3` (hidden row 10).
- **DOA amount at full rate (Sl.6 = 3+4-5)** `[G41]= MAX(0,G38+G39-G40)`.
- **DOA amount at half rate (Sl.9 = 7-8)** `[G44]= MAX(0,G42-G43+MIN(0,G38+G39-G40))`.
- **DOA depreciation full/half** `[G45]= ROUND(FullRateDeprAmt*RATE/100,0)`, `[G46]= ROUND(HalfRateDeprAmt*RATE/200,0)`.
- **DOA total depreciation (Sl.12 = 10+11)** `[G49]= DepreciationAtHalfRate+DepreciationAtFullRate` — no additional depreciation.
- **DOA net aggregate (Sl.14 = 12-13)** `[G51]= MAX(0,TotalDepreciation-DepUnderSec38)`.
- **DOA WDV last day (6+9-12)** `[G55]= MAX(WDVFirstDay+AdditionsGrThan180Days-RealizationTotalPeriod+AdditionsLessThan180Days…,0)`; **Land** `[F55]= MAX(0,F38)` (Land is Nil-rate, WDV last = WDV first).
- **Counted-value helper columns** `[T13]=(F14+F17-F7-F13-F16-F28)` "Total Counted Value at 16 DPM"; `[T18]=(G40+G43-G38-G39-G42-G53)` "Total Counted Value at 16 DOA" — helper columns S13/S18/S29/S34 label the user-entered capital-gains value ("Val Enter By User At DPM16", "Val Enter By User at DOA 16", "Val Enter By User At DPM16").

## Dropdowns
This sheet defines **no enumerated (list) dropdowns**. All 46 data-validation entries are numeric bounds (`source` "0" for a minimum of 0, or "-99999999999999" for the capital-gains cells F29/I29/G29:H29/G54:L54 which may be negative). The only Y/N picklist is on the **hidden** row 31 ("Block Ceases to Exist. Select Y / N", F31=Y, G31=N) and is not a live item. No dropdown value strings to reproduce.

## What repeats and what is one figure
Nothing repeats as a user-added array. Each rate block is a single fixed `DepreciationDetail` object holding one figure per row. DPM has exactly four blocks (Rate15/Rate30/Rate40/Rate45 = P&M columns i–iv); DOA has exactly the fixed set Land, Building (Rate5/Rate10/Rate40), FurnitureFittings.Rate10, IntangibleAssets.Rate25, Ships.Rate20 (columns i–vii). Blocks and rates are fixed by the schema, not entered.

## Mandatory (required schema keys)
- **ScheduleDPM** — `required: ['PlantMachinery']`. Within each `DepreciationDetail` the required keys are: `WDVFirstDay`, `AdditionsGrThan180Days`, `RealizationTotalPeriod`, `FullRateDeprAmt`, `AdditionsLessThan180Days`, `RealizationPeriodLessThan180days`, `HalfRateDeprAmt`, `DepreciationAtFullRate`, `DepreciationAtHalfRate`, `TotalDepreciation`, `DepDisAllowUs38_2`, `NetAggregateDepreciation`, `ProportionateAggDepreciation`, `ExpdrOnTrforSaleAsset`, `CapGainUs50`, `WDVLastDay`. Optional: `AdjustmentSec115BAC`, `Total`, `AddlnDeprOnGT180DayAdditions`, `AddlnDeprOnLessThan180DayAdditions`, `AddlnDeprOnAssetLessThan180Days`.
- **ScheduleDOA** — `required: None` at the block root (each asset object is optional; report only the blocks the assessee uses). Within any `DepreciationDetail` provided, the required keys are the same list as DPM (minus the additional-depreciation keys, which DOA does not have): `WDVFirstDay`, `AdditionsGrThan180Days`, `RealizationTotalPeriod`, `FullRateDeprAmt`, `AdditionsLessThan180Days`, `RealizationPeriodLessThan180days`, `HalfRateDeprAmt`, `DepreciationAtFullRate`, `DepreciationAtHalfRate`, `TotalDepreciation`, `DepDisAllowUs38_2`, `NetAggregateDepreciation`, `ProportionateAggDepreciation`, `ExpdrOnTrforSaleAsset`, `CapGainUs50`, `WDVLastDay`. Land carries only `WDVFirstDay` and `WDVLastDay`.

## Hidden rows — not built
- **r8 (3(b))** — "Written down value on the first day of previous year, of those block of assets which were eligible for depreciation @ 50%, 60% or 80% as per the old Table". Hidden; legacy old-rate-table adjustment, not an entry item.
- **r9 (3a)** — "Amount as adjusted on account of opting for taxation under section 115BAC". Hidden; feeds the 115BAC adjustment computation only.
- **r10 (3b)** — "Adjusted Written down value on the first day of previous year (3) + (3a)". Hidden computed feed (`[G10]= 0+DPM30.WDVFirstDayBAC`).
- **r31** — "Block Ceases to Exist. Select Y / N" (F31=Y, G31=N …). Hidden Y/N control that flags the negative-capital-gain case; not a filed item.
- **r47 (DOA)** — "Additional depreciation, if any, on 4". Hidden — DOA has no additional depreciation; excluded from the schema.
- **r48 (DOA)** — "Additional depreciation, if any, on 7". Hidden — same reason.

## What this means for the build
- Build DPM as four fixed P&M rate blocks (15/30/40/45) and DOA as Land + Building(5/10/40) + Furniture(10) + Intangible(25) + Ships(20); rates and blocks are structural, not user-chosen.
- Computed cells (full/half amounts Sl.6/9, depreciations Sl.10/11, totals Sl.15/12, net aggregate Sl.17/14, WDV last day) are green/untypeable; user enters WDV first day, additions (>180, <180), realizations, additional depreciation (DPM only), 38(2) disallowance, proportionate depreciation, transfer expenditure, and capital gains u/s 50.
- Half-rate depreciation divides the rate by 200 (half of RATE/100); round to 0 decimals.
- Capital-gains cells (`CapGainUs50`) alone may be negative (min -99999999999999) and only when the block ceases to exist; every other cell floors at 0.
- New tax regime (115BAC): additional depreciation must be zero and the 45% P&M block cannot be claimed (Rule 5); the `AdjustmentSec115BAC` / hidden 3a/3b rows carry the second-proviso WDV adjustment.
- Do not surface the hidden rows (r8, r9, r10, r31, r47, r48) as items.


## Additional visible rows — verbatim from the sheet (completeness)
Rows present on the utility sheet and captured here verbatim so every visible label is in the book:

- Schedule DPM
- Total (3a+3b)
- Schedule DOA
