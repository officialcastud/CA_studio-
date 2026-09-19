# The book of Schedule DEP + Schedule DCG — Summary of depreciation, and deemed capital gains on depreciable assets · ITR-6, A.Y. 2026-27

Read row by row from the utility's **DEP_DCG** sheet (two schedules on one sheet:
Sch DEP rows 3–21, Sch DCG rows 23–41), the formulas in columns H and J, the
hidden helper columns, and confirmed against the CBDT ITR-6 schema's
`ScheduleDEP` and `ScheduleDCG` and the validation-rules document. Nothing here is
invented.

Both schedules are **summaries** — they carry no data entry of their own. Every
figure is pulled from Schedule DPM (plant and machinery) and Schedule DOA (other
assets), which are on the companion sheet DPM_DOA. DEP summarises the year's
allowable depreciation by block; DCG summarises the deemed capital gain/loss
under section 50 when a block ceases to exist. This book pairs with **DPM_DOA.md**.

---

## 1 · Schedule DEP — Summary of depreciation on assets

Header (E3): *"Summary of depreciation on assets (Other than on assets on which
full capital expenditure is allowable as deduction under any other section)."*

Two asset classes — plant and machinery (by rate) and other assets — each block
pulling its total depreciation from DPM/DOA.

### 1 · Plant and machinery (item numbers from the rules document)

| Item | Label (col F) | Row | Source (formula) | Schema key |
|---|---|---|---|---|
| **1a** | Block entitled for depreciation @ 15 per cent (Schedule DPM - 17i or 18i as applicable) | r5 | DPM15 proportionate/net aggregate | `PlantMachinerySummary.DeprBlockTot15Percent` |
| **1b** | Block entitled for depreciation @ 30 per cent (Schedule DPM - 17ii or 18ii as applicable) | r6 | DPM30 | `PlantMachinerySummary.DeprBlockTot30Percent` |
| **1c** | Block entitled for depreciation @ 40 per cent (Schedule DPM - 17iii or 18iii as applicable) | r7 | DPM40 | `PlantMachinerySummary.DeprBlockTot40Percent` |
| **1d** | Block entitled for depreciation @ 45 per cent (Schedule DPM - 17iv or 18iv as applicable) | r8 | DPM45 | `PlantMachinerySummary.DeprBlockTot45Percent` |
| **1e** | Total depreciation on plant and machinery (1a+1b+1c+1d) | r12 | `SUM(H5:H8)` | `PlantMachinerySummary.TotPlntMach` |

The per-block cell (e.g. H5) is:
`IF(DPM15.ProportionateAggregate>0, DPM15.ProportionateAggregate, IF(IsBusiness="N",
DPM15.NetAggregate, IF(OR(Isdatenull="N", IsinfincYear="Y"),
MIN(DPM15.NetAggregate, DPM15.ProportionateAggregate), DPM15.NetAggregate)))` —
i.e. it takes the **proportionate** aggregate depreciation where a succession /
amalgamation / demerger has split the year (DPM item 18), otherwise the **net**
aggregate (DPM item 17), with the succession-year `MIN` guard driven by the
hidden helper flags **IsBusiness**, **IsinfincYear** and **Isdatenull** (see §3).

### 2 · Building (not including land)

| Item | Label (col F) | Row | Source | Schema key |
|---|---|---|---|---|
| **2a** | Block entitled for depreciation @ 5 per cent (Schedule DOA- 14ii or 15ii as applicable) | r14 | DAOB5 | `BuildingSummary.DeprBlockTot5Percent` |
| **2b** | Block entitled for depreciation @ 10 per cent (Schedule DOA- 14iii or 15iii as applicable) | r15 | DAOB10 | `BuildingSummary.DeprBlockTot10Percent` |
| **2c** | Block entitled for depreciation @ 40 per cent (Schedule DOA- 14iv or 15iv as applicable) | r16 | DAOB100 | `BuildingSummary.DeprBlockTot40Percent` |
| **2d** | Total depreciation on building (2a+2b+2c) | r17 | `SUM(H14:H16)` | `BuildingSummary.TotBuildng` |

### 3–5 · Other classes, and the grand total

| Item | Label (col E/F) | Row | Source | Schema key |
|---|---|---|---|---|
| **3** | Furniture and fittings (Schedule DOA- 14v or 15v as applicable) | r18 | DAOF10 | `FurnitureSummary` |
| **4** | Intangible assets (Schedule DOA- 14vi or 15vi as applicable) | r19 | DAOI25 | `IntangibleAssetSummary` |
| **5** | Ships (Schedule DOA- 14vii or 15vii as applicable) | r20 | DAOS20 | `ShipsSummary` |
| **—** | **Total depreciation (1e+2d+3+4+5)** | r21 | `MAX(0, J12+SUM(J17:J20))` | `TotalDepreciation` |

---

## 2 · Schedule DCG — Deemed Capital Gains on sale of depreciable assets

Header (E23): *"Deemed Capital Gains on sale of depreciable assets."* Same block
layout as DEP, but each cell pulls the **section-50 capital gain/loss** (DPM item
20 / DOA item 17) instead of the depreciation.

### 1 · Plant and machinery (item numbers from the rules document)

| Item | Label (col F) | Row | Source (formula) | Schema key |
|---|---|---|---|---|
| **1a** | Block entitled for depreciation @ 15 per cent (Schedule DPM - 20i) | r25 | `DPM_DOA!F27` | `PlantMachinerySummaryCG.DeprBlockTot15Percent` |
| **1b** | Block entitled for depreciation @ 30 per cent (Schedule DPM – 20ii) | r26 | `DPM_DOA!G27` | `PlantMachinerySummaryCG.DeprBlockTot30Percent` |
| **1c** | Block entitled for depreciation @ 40 per cent (Schedule DPM - 20iii) | r27 | `DPM_DOA!H27` | `PlantMachinerySummaryCG.DeprBlockTot40Percent` |
| **1d** | Block entitled for depreciation @ 45 per cent (Schedule DPM - 20iv) | r28 | `DPM45.CapGainUs50` | `PlantMachinerySummaryCG.DeprBlockTot45Percent` |
| **1e** | Total (1a+1b+1c+1d) | r32 | `SUM(H25:H28)` | `PlantMachinerySummaryCG.TotPlntMach` |

### 2 · Building (not including land)

| Item | Label (col F) | Row | Source | Schema key |
|---|---|---|---|---|
| **2a** | Block entitled for depreciation @ 5 per cent (Schedule DOA- 17ii) | r34 | `DPM_DOA!G52` | `BuildingSummaryCG.DeprBlockTot5Percent` |
| **2b** | Block entitled for depreciation @ 10 per cent (Schedule DOA- 17iii) | r35 | `DPM_DOA!H52` | `BuildingSummaryCG.DeprBlockTot10Percent` |
| **2c** | Block entitled for depreciation @ 40 per cent (Schedule DOA- 17iv) | r36 | `DPM_DOA!I52` | `BuildingSummaryCG.DeprBlockTot40Percent` |
| **2d** | Total (2a+2b+2c) | r37 | `SUM(H34:H36)` | `BuildingSummaryCG.TotBuildng` |

### 3–5 · Other classes, and the grand total

| Item | Label (col E/F) | Row | Source | Schema key |
|---|---|---|---|---|
| **3** | Furniture and fittings (Schedule DOA- 17v) | r38 | `DPM_DOA!J52` | `FurnitureSummary` |
| **4** | Intangible assets (Schedule DOA- 17vi) | r39 | `DPM_DOA!K52` | `IntangibleAssetSummary` |
| **5** | Ships (Schedule DOA- 17vii) | r40 | `DPM_DOA!L52` | `ShipsSummary` |
| **—** | **Total (1e+2d+3+4+5)** | r41 | `SUM(J37:J40)+DCGP.TotPlntMach` | `TotalDepreciation` |

---

## 3 · The hidden helper columns and rows — read them

- **Q3 IsBusiness, R3 IsinfincYear, S3 Isdatenull** (with N/Y flags on r4): three
  helper flags at the top of the sheet that drive every DEP per-block formula.
  `IsBusiness` = whether business income is being computed; `IsinfincYear` /
  `Isdatenull` = whether the year is a succession/amalgamation year and whether the
  succession date is present. When the year is not split, the block takes the DPM
  **net** aggregate depreciation (item 17); when it is split, it takes the
  **proportionate** figure (item 18) or the `MIN` of the two. These are the rules
  behind "17i or 18i as applicable."
- **DEP r9H/r10H/r11H — items 1e/1f/1g** — Block entitled for depreciation @ 60 /
  80 / 100 per cent (Schedule DPM 15v / 15vi / 15vii). **Hidden — not built.**
  These are the pre-A.Y.-2021 higher plant-and-machinery rates, withdrawn when the
  block rates were capped at 40%. Their cells pull the DPM helper columns
  `DPM_DOA!Q22 / R22 / S22`. Logged as excluded (hidden, superseded rate blocks).
- **DCG r29H/r30H/r31H — items 1e/1f/1g** — the same 60 / 80 / 100 per cent blocks
  on the DCG side (Schedule DPM 17v / 17vi / 17vii). **Hidden — not built.** Their
  cells pull `DPM_DOA!P27`. Logged as excluded.

The schema carries `FurnitureSummary`, `IntangibleAssetSummary`, `ShipsSummary` as
single integers (no rate breakdown), matching the single live rows 3/4/5.

---

## 4 · The rules the schedules enforce (from the rules document)

| Rule | What it enforces |
|---|---|
| **A304** | DEP total depreciation on plant and machinery = 1a + 1b + 1c + 1d |
| **A305** | DEP total depreciation on building = 2a + 2b + 2c |
| **A306** | DEP total depreciation = 1e + 2d + 3 + 4 + 5 |
| **A307** | DEP P&M block @ 15% = Sl. No. 17i **or** 18i of Schedule DPM as applicable |
| **A308** | DEP P&M block @ 30% = Sl. No. 17ii or 18ii of Schedule DPM as applicable |
| **A309** | DEP P&M block @ 40% = Sl. No. 17iii or 18iii of Schedule DPM as applicable |
| **A317** | DCG total deemed capital gains on plant and machinery = 1a + 1b + 1c + 1d |
| **A318** | DCG total deemed capital gains on building = 2a + 2b + 2c |
| **A319** | DCG total deemed capital gains on depreciable assets = 1e + 2d + 3 + 4 + 5 |
| **A320** | DCG P&M block @ 15% = Sl. No. 20i of Schedule DPM |
| **A321** | DCG P&M block @ 30% = Sl. No. 20ii of Schedule DPM |
| **A322** | DCG P&M block @ 40% = Sl. No. 20iii of Schedule DPM |

---

## 5 · Cross-sheet feeds — in and out

**Into DEP / DCG:** everything, from **Schedule DPM** and **Schedule DOA** (sheet
DPM_DOA). DEP pulls each block's aggregate depreciation (DPM item 17 net / 18
proportionate; DOA item 14 / 15); DCG pulls each block's section-50 capital gain
(DPM item 20; DOA item 17). No direct data entry.

**Out of DEP:**

| From DEP | To | Rule |
|---|---|---|
| **Total depreciation** (item column, r21) | Schedule **BP item 12i** — "Depreciation allowable under section 32(1)(ii) and 32(1)(iia) (column 6 of Schedule-DEP)" | **A196** (BP 12(i) = item 6 of Schedule DEP) |

**Out of DCG:**

| From DCG | To |
|---|---|
| **Total deemed capital gains** (r41) and the per-block figures | Schedule **CG** — the section-50 short-term deemed capital gain on the sale of depreciable assets (the depreciable-block heads of Schedule CG) |

---

## 6 · What is mandatory

The schema marks required on **ScheduleDEP**: the plant-and-machinery summary
(`DeprBlockTot15Percent`, `DeprBlockTot30Percent`, `DeprBlockTot40Percent`,
`DeprBlockTot45Percent`, `TotPlntMach`), the building summary
(`DeprBlockTot5Percent`, `DeprBlockTot10Percent`, `DeprBlockTot40Percent`,
`TotBuildng`) and `TotalDepreciation`; `FurnitureSummary`,
`IntangibleAssetSummary`, `ShipsSummary` are optional single integers. The same
set is required on **ScheduleDCG** under `SummaryFromDeprSchCG`
(`PlantMachinerySummaryCG`, `BuildingSummaryCG`, `TotalDepreciation`).

Every figure is a non-negative integer on DEP (min 0); the DCG capital-gain cells
may be negative (min −99999999999999) when a block ceases to exist.

---

## 7 · Dropdowns and hidden rows

- **No dropdowns with value lists.** The two data-validation ranges are numeric
  constraints only (DEP amounts min 0; DCG amounts min −99999999999999).
- **Hidden rows — not built:** DEP items 1e/1f/1g at 60/80/100% (r9H, r10H, r11H)
  and DCG items 1e/1f/1g at 60/80/100% (r29H, r30H, r31H) — the withdrawn higher
  rate blocks. Plus the helper columns Q/R/S (IsBusiness, IsinfincYear, Isdatenull).

---

## 8 · What this means for the build

1. **Both schedules are read-only summaries** — no data entry; every cell is a
   green computed pull from DPM / DOA. Build them as displays fed by the
   depreciation engine, not as forms.
2. **The rate blocks are 15 / 30 / 40 / 45 % for plant and machinery** and
   **5 / 10 / 40 % for building**; the 60 / 80 / 100 % rows are hidden and not
   built (superseded).
3. **DEP total feeds BP 12i**; **DCG feeds Schedule CG** as the section-50 deemed
   short-term capital gain.
4. **Honour the succession switch** (IsBusiness / IsinfincYear / Isdatenull): net
   aggregate in an ordinary year, proportionate (or the MIN) in a succession /
   amalgamation / demerger year — the "17i or 18i as applicable" rule.
