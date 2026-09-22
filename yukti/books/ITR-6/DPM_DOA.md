# The book of Schedule DPM + Schedule DOA — Depreciation on plant and machinery, and on other assets · ITR-6, A.Y. 2026-27

Read row by row from the utility's **DPM_DOA** sheet (two schedules on one sheet:
Sch DPM rows 3–29, Sch DOA rows 31–53), every formula in the money columns, the
hidden helper columns P–S and the hidden capital-gains helper rows, and confirmed
against the CBDT ITR-6 schema's `ScheduleDPM` and `ScheduleDOA` and the
validation-rules document. Nothing here is invented.

This is the **engine of the depreciation chain**: DPM/DOA hold the block-wise
working (opening WDV → additions → depreciation → closing WDV, and the section-50
capital gain when a block ceases); Schedule **DEP** summarises the depreciation
these produce, Schedule **DCG** summarises the section-50 gains, and BP item 12i
takes the DEP total. This book pairs with **DEP_DCG.md**.

---

## 1 · The shape — two block-of-assets grids, one column per rate

Both schedules are the same 21-line (DPM) / 18-line (DOA) working, run **once per
rate column**. The lines are the standard block-of-assets computation; the columns
are the depreciation rates. The header (DPM E3): *"Depreciation on Plant and
Machinery (Other than assets on which full capital expenditure is allowable as
deduction under any other section)."*

| Schedule | Rate columns (live) | Hidden rate columns |
|---|---|---|
| **DPM** — plant and machinery | (i) 15% · (ii) 30% · (iii) 40% · (iv) 45% | (iv) 50% · (v) 60% · (vi) 80% · (vii) 100% — helper cols P, Q, R, S |
| **DOA** — other assets | Land (Nil) · Building (ii) 5% · (iii) 10% · (iv) 40% · Furniture and fittings (v) 10% · Intangible assets (vi) 25% · Ships (vii) 20% | — |

The 50/60/80/100% plant columns and the additional-depreciation building rows are
the pre-A.Y.-2021 higher-rate blocks, now hidden (see §5); the live plant rates
are capped at 40% (45% only for the specified 45% block), per rule A275.

---

## 2 · Schedule DPM — the working, line by line (item numbers from the rules document)

Each item runs across the four live rate columns (15/30/40/45%).

| Item | Label (col E) | Row | Kind |
|---|---|---|---|
| **3** | Written down value on the first day of previous year | r7 | amount |
| **4** | Additions for a period of 180 days or more in the previous year | r11 | amount |
| **5** | Consideration or other realization during the previous year out of 3 or 4 | r12 | amount |
| **6** | Amount on which depreciation at full rate to be allowed (3 + 4 – 5) (enter 0, if result is negative) | r13 | **computed** |
| **7** | Additions for a period of less than 180 days in the previous year | r14 | amount |
| **8** | Consideration or other realizations during the year out of 7 | r15 | amount |
| **9** | Amount on which depreciation at half rate to be allowed (7 – 8) (Enter 0, if result is negative) | r16 | **computed** |
| **10** | Depreciation on 6 at full rate | r17 | **computed** |
| **11** | Depreciation on 9 at half rate | r18 | **computed** |
| **12** | Additional depreciation, if any, on 4 | r19 | amount |
| **13** | Additional depreciation, if any, on 7 | r20 | amount |
| **14** | Additional depreciation relating to immediately preceding year on asset put to use for less than 180 days | r21 | amount |
| **15** | Total depreciation (10 + 11 + 12 + 13 + 14) | r22 | **computed** |
| **16** | Depreciation disallowed under section 38(2) of the I.T. Act (out of column 15) | r23 | amount |
| **17** | Net aggregate depreciation (15 – 16) | r24 | **computed** |
| **18** | Proportionate aggregate depreciation allowable in the event of succession, amalgamation, demerger etc. (out of column 17) | r25 | amount |
| **19** | Expenditure incurred in connection with transfer of asset / assets | r26 | amount |
| **20** | Capital gains / loss under section 50 (5 + 8 – 3 – 4 – 7 – 19) (Enter negative only if block ceases to exist) | r27 | **computed** |
| **21** | Written down value on the last day of previous year (6 + 9 – 15) (enter 0 if result is negative) | r28 | **computed** |

**Rate column → schema object:** (i) 15% = `PlantMachinery.Rate15`, (ii) 30% =
`Rate30`, (iii) 40% = `Rate40`, (iv) 45% = `Rate45`. Each nests one
`DepreciationDetail`. The 45% block carries a **reduced** set of leaves (no
half-rate / <180-day / additional-depreciation lines) — a 45% asset is a single
class with no half-rate split.

### Key DPM formulas (from the cells)

- **item 6** (r13) `= MAX(0, WDVFirstDay + AdditionsGrThan180Days − RealizationTotalPeriod)`
- **item 9** (r16) `= MAX(0, AdditionsLessThan180Days − RealizationPeriodDuringYear + MIN(0, WDVFirstDay + AdditionsGrThan180Days − RealizationTotalPeriod))`
- **item 10** (r17) `= ROUND(FullRateDeprAmt × RATE / 100, 0)`
- **item 11** (r18) `= ROUND(HalfRateDeprAmt × RATE / 200, 0)` (half rate)
- **item 15** (r22) `= DepreciationAtHalfRate + DepreciationAtFullRate + AddlnDeprDuringYearAdditions + AddlnDeprOnGT180DayAdditions + AdditionsDepThan180Days`
- **item 17** (r24) `= MAX(0, TotalDepreciation − DepDisAllowUs38_2)`
- **item 21** (r28) `= MAX(WDVFirstDay + AdditionsGrThan180Days − RealizationTotalPeriod + AdditionsLessThan180Days − RealizationPeriodDuringYear − TotalDepreciation, 0)`

---

## 3 · Schedule DOA — the working, line by line (item numbers from the rules document)

Header (E31): *"Depreciation on other assets (Other than assets on which full
capital expenditure is allowable as deduction)."* Same lines as DPM but **shorter**
(no additional-depreciation carry-forward): total depreciation is just 10 + 11.

Block-of-assets columns (row r32): **Land** (rate Nil) · **Building (not
including land)** · **Furniture and fittings** · **Intangible assets** · **Ships**.

| Item | Label (col E) | Row | Kind |
|---|---|---|---|
| **3** | Written down value on the first day of previous year | r36 | amount |
| **4** | Additions for a period of 180 days or more in the previous year | r37 | amount |
| **5** | Consideration or other realization during the previous year out of 3 or 4 | r38 | amount |
| **6** | Amount on which depreciation at full rate to be allowed (3 + 4 – 5) (Enter 0, if result is negative) | r39 | **computed** |
| **7** | Additions for a period of less than 180 days in the previous year | r40 | amount |
| **8** | Consideration or other realizations during the year out of 7 | r41 | amount |
| **9** | Amount on which depreciation at half rate to be allowed (7 – 8) (Enter 0, if result is negative) | r42 | **computed** |
| **10** | Depreciation on 6 at full rate | r43 | **computed** |
| **11** | Depreciation on 9 at half rate | r44 | **computed** |
| **12** | Total depreciation (10 + 11) | r47 | **computed** |
| **13** | Depreciation disallowed under section 38(2) of the I.T. Act (out of column 12) | r48 | amount |
| **14** | Net aggregate depreciation (12 – 13) | r49 | **computed** |
| **15** | Proportionate aggregate depreciation allowable in the event of succession, amalgamation, demerger etc. (out of column 14) | r50 | amount |
| **16** | Expenditure incurred in connection with transfer of asset / assets | r51 | amount |
| **17** | Capital gains / loss under section 50 (5 + 8 – 3 – 4 – 7 – 16) (enter negative only if block ceases to exist) | r52 | **computed** |
| **18** | Written down value on the last day of previous year (6 + 9 – 12) (enter 0 if result is negative) | r53 | **computed** |

**Column → schema object:** Land = `Land`, Building 5% = `Building.Rate5`, 10% =
`Building.Rate10`, 40% = `Building.Rate40`, Furniture and fittings 10% =
`FurnitureFittings.Rate10`, Intangible assets 25% = `IntangibleAssets.Rate25`,
Ships 20% = `Ships.Rate20`. Land carries only opening and closing WDV (rate Nil,
no depreciation). DOA item 10 = `ROUND(FullRateDeprAmt × RATE / 100, 0)`, item 11
= `ROUND(HalfRateDeprAmt × RATE / 200, 0)`, item 12 = full + half +
additional-during-year + additional->180-day, item 18 = `MAX(opening + additions −
realizations − total depreciation, 0)`.

---

## 4 · The schema leaf keys (both blocks share one `DepreciationDetail` shape)

Every rate object nests a `DepreciationDetail` with these leaves. All are
non-negative integers except `CapGainUs50` (may be negative), maximum
99999999999999.

```
WDVFirstDay                        item 3 — opening WDV
AdditionsGrThan180Days             item 4 — additions ≥ 180 days
RealizationTotalPeriod             item 5 — consideration out of 3 or 4
FullRateDeprAmt                    item 6 — amount at full rate (computed)
AdditionsLessThan180Days           item 7 — additions < 180 days
RealizationPeriodDuringYear        item 8 — consideration out of 7
HalfRateDeprAmt                    item 9 — amount at half rate (computed)
DepreciationAtFullRate             item 10 — depreciation on 6 at full rate
DepreciationAtHalfRate             item 11 — depreciation on 9 at half rate
AddlnDeprOnGT180DayAdditions       item 12 — additional depreciation on 4
AddlnDeprDuringYearAdditions       item 13 — additional depreciation on 7
AddlnDeprOnLessThan180DayAdditions item 14 — additional depreciation of preceding year
TotalDepreciation                  item 15 (DPM) / 12 (DOA) — total depreciation
DepDisAllowUs38_2                  item 16 (DPM) / 13 (DOA) — disallowed u/s 38(2)
NetAggregateDepreciation           item 17 (DPM) / 14 (DOA) — net aggregate → Sch DEP
ProportionateAggDepreciation       item 18 (DPM) / 15 (DOA) — proportionate → Sch DEP
ExpdrOnTrforSaleAsset              item 19 (DPM) / 16 (DOA) — transfer expenditure
CapGainUs50                        item 20 (DPM) / 17 (DOA) — section-50 gain → Sch DCG
WDVLastDay                         item 21 (DPM) / 18 (DOA) — closing WDV
```

`ScheduleDPM` objects: `PlantMachinery` → `Rate15`, `Rate30`, `Rate40`, `Rate45`.
`ScheduleDOA` objects: `Land`, `Building` (`Rate5`, `Rate10`, `Rate40`),
`FurnitureFittings.Rate10`, `IntangibleAssets.Rate25`, `Ships.Rate20`.

---

## 5 · The hidden helper columns and rows — read them

- **DPM r8H — item 3b** "Written down value on the first day of previous year, of
  those block of assets which were eligible for depreciation @ 50%, 60% or 80% as
  per the old Table." **Hidden — not built.** The legacy higher-rate opening WDV.
- **DPM r9H — item 3a** "Amount as adjusted on account of opting for taxation under
  section 115BAA." **Hidden — not built.** The WDV write-down forced when a
  company opts into the 115BAA concessional regime (unabsorbed additional
  depreciation is added to opening WDV).
- **DPM r10H — item 3b** "Adjusted Written down value on the first day of previous
  year (3) + (3a)." **Hidden — not built.** Opening WDV after the 115BAA
  adjustment.
- **DPM r29H** "Block Ceases to Exist. Select Y / N" (cells F29:L29). **Hidden —
  not built.** The Y/N switch that permits item 20 (capital gain u/s 50) to go
  negative. No enum value list (numeric data-validation only).
- **DOA r45H / r46H — additional depreciation on 4 / on 7.** **Hidden — not
  built.** Additional depreciation under 32(1)(iia) applies to plant and machinery
  only, not to buildings / furniture / intangibles / ships — so these rows are
  hidden on DOA.
- **Hidden helper columns P, Q, R, S** (DPM) — the 50 / 60 / 80 / 100% plant
  blocks (objects `DPM50`, `DPM60`, `DPM80`, `DPM100`). Their money rows mirror the
  live formulas (r13/r16/r17/r18/r22/r24/r28) but are hidden and are **not schema
  fields**. Their capital-gains helper cells (r30–r39, e.g. `P30 = F12+F15−F7−F11−F14`,
  and `Q37`) are the per-block section-50 gain that **Sch DCG reads** as
  `DPM_DOA!P27 / Q22 / R22 / S22`. Read these — they are the DCG feed for the
  withdrawn rate blocks.

---

## 6 · The rules the schedules enforce (from the rules document)

| Rule | What it enforces |
|---|---|
| **A270** | DPM Sl. No. 6 = 3 + 4 – 5, or 0 if negative |
| **A271** | DPM Sl. No. 9 = 7 – 8, or 0 if negative |
| **A272** | DPM Sl. No. 15 = 10 + 11 + 12 + 13 + 14 |
| **A273** | DPM Sl. No. 17 = 15 – 16 |
| **A274** | DPM additional depreciation is **not allowed** if opted for 115BA / 115BAA / 115BAB |
| **A275** | DPM depreciation **cannot exceed 40%** if opted for 115BA / 115BAA / 115BAB |
| **A276 / A277** | DPM depreciation at Sl. No. 10 / 11 must match the rate in Sl. No. 2 (full / half rates) |
| **A278** | DPM Sl. No. 20 = 5 + 8 – 3 – 4 – 7 – 19 |
| **A287** | DOA Sl. No. 17 = 5 + 8 – 3 – 4 – 7 – 16 |
| **A288** | DOA Sl. No. 6 (full-rate amount) = 3 + 4 – 5, or 0 if negative |
| **A289** | DOA Sl. No. 9 = 7 – 8, or 0 if negative |
| **A290** | DOA Sl. No. 12 = 10 + 11 |
| **A291** | DOA Sl. No. 14 = 12 – 13 |
| **A292 / A293** | DOA depreciation at Sl. No. 10 / 11 must match the rate in Sl. No. 2 |
| **A294** | DOA Sl. No. 15 (proportionate) cannot exceed Sl. No. 14 (net aggregate) in the 5% building block |

---

## 7 · Cross-sheet feeds — in and out

**Into DPM / DOA:** the company enters, per block, the opening WDV, additions
(≥180 / <180 days), realizations, additional depreciation, section-38(2)
disallowance, transfer expenditure and (for succession years) the proportionate
figure. Nothing is pulled from other sheets. The 115BAA opening-WDV adjustment
(hidden item 3a) is driven by the regime option in Part A-General.

**Out of DPM / DOA:**

| From | To | Rule |
|---|---|---|
| DPM item 17 (net aggregate) / 18 (proportionate), per rate column | **Sch DEP** items 1a–1d "17i or 18i as applicable" | A307–A309 |
| DOA item 14 / 15, per column | **Sch DEP** items 2a–2c, 3, 4, 5 "14ii or 15ii as applicable" | (DEP labels) |
| DPM item 20 (capital gain u/s 50), per rate column | **Sch DCG** items 1a–1d "20i" | A320–A322 |
| DOA item 17 (capital gain u/s 50), per column | **Sch DCG** items 2a–2c, 3, 4, 5 "17ii" | (DCG labels) |
| → then **Sch DEP** total → **BP item 12i** | Depreciation allowable u/s 32(1)(ii) & 32(1)(iia) | A196 |
| → then **Sch DCG** → **Schedule CG** | deemed short-term capital gain on depreciable assets | A317–A322 |

The choice between net (item 17/14) and proportionate (item 18/15) is made by
DEP's succession switch (IsBusiness / IsinfincYear / Isdatenull) — see DEP_DCG.md.

---

## 8 · What is mandatory

The schema marks required every `DepreciationDetail` leaf listed in §4, across all
live rate objects of both blocks (Land carries only `WDVFirstDay` and
`WDVLastDay`). Values are written at zero for a block the company does not hold.

---

## 9 · Dropdowns and hidden rows

- **No dropdowns with value lists.** Every data-validation range on the sheet is a
  numeric constraint (amount ≥ 0, or capital-gain ≥ −99999999999999); the "Block
  Ceases to Exist Y/N" range (F29:L29) carries no enum list.
- **Hidden rows / columns — not built:** DPM 3a/3b old-table and 115BAA WDV
  (r8H–r10H), DPM "Block Ceases to Exist" (r29H), DOA additional-depreciation rows
  (r45H, r46H), and the 50/60/80/100% helper columns P–S with their capital-gains
  helper rows — all documented in §5.

---

## 10 · What this means for the build

1. **One block-of-assets grid per rate**: DPM at 15 / 30 / 40 / 45%, DOA at Land
   (Nil) / Building 5 / 10 / 40% / Furniture 10% / Intangible 25% / Ships 20%.
2. **The computed lines are green** — full-rate amount (6), half-rate amount (9),
   depreciation (10/11), total (15/12), net aggregate (17/14), capital gain u/s 50
   (20/17), closing WDV (21/18) — each from the formulas in §2 / §3.
3. **Additional depreciation only on plant and machinery**, and disallowed
   entirely under 115BA / 115BAA / 115BAB (A274); the 45% block has no half-rate
   split; plant depreciation is capped at 40% under the concessional regimes (A275).
4. **The 50/60/80/100% plant blocks and the building additional-depreciation rows
   are hidden and not built** — reproduce their capital-gains helper arithmetic in
   the engine only, because Sch DCG reads it.
5. **Feed DEP and DCG** from items 17/18 (net/proportionate depreciation) and
   20/17 (section-50 gain); DEP's total then reaches BP 12i and DCG reaches CG.
