# DEP_DCG — Schedule DEP (Summary of depreciation) & Schedule DCG (Deemed capital gains on sale of depreciable assets)

## The shape
This one utility sheet carries two read-only summary schedules. **Sch DEP** (rows 3–22) summarises the depreciation on assets (other than assets on which full capital expenditure is allowable) by asset class and block rate, pulling every figure from Schedules DPM and DOA. **Sch DCG** (rows 24–43) summarises the deemed capital gains under section 50 on the sale of those same depreciable-asset blocks, again pulling from DPM/DOA. Every cell here is computed — nothing is keyed on this sheet; the assessee fills DPM and DOA and these two summaries roll up.

## The items

### Schedule DEP — ScheduleDEP (rows 3–22)
Item numbers are from the RULES document (Schedule DEP: 1a–1e plant & machinery, 2a–2d building, 3 furniture, 4 intangible, 5 ships, 6 total).

| Sheet item | Field label | Type | Schema key | Rule / notes |
|---|---|---|---|---|
| — | Summary of depreciation on assets (Other than assets on which full capital expenditure is allowable) | header | — | Sheet title (r3); `SummaryFromDeprSch` object |
| — | Plant and machinery | header | — | r4 |
| 1a | Block entitled for depreciation @ 15 per cent ( Schedule DPM - 17i or 18i as applicable) | integer | SummaryFromDeprSch.PlantMachinerySummary.DeprBlockTot15Percent | r5, computed [H5] |
| 1b | Block entitled for depreciation @ 30 per cent ( Schedule DPM - 17ii or 18ii as applicable) | integer | SummaryFromDeprSch.PlantMachinerySummary.DeprBlockTot30Percent | r6, computed [H6] |
| 1c | Block entitled for depreciation @ 40 per cent ( Schedule DPM - 17iii or 18iii as applicable) | integer | SummaryFromDeprSch.PlantMachinerySummary.DeprBlockTot40Percent | r7, computed [H7] |
| 1d | Block entitled for depreciation @ 45 per cent ( Schedule DPM - 17iv or 18iv as applicable) | integer | SummaryFromDeprSch.PlantMachinerySummary.DeprBlockTot45Percent | r12, computed [H12] |
| 1e | Total depreciation on plant and machinery ( 1a + 1b + 1c +1d) | integer | SummaryFromDeprSch.PlantMachinerySummary.TotPlntMach | r13, total [J13] |
| — | Building (not including land) | header | — | r14 |
| 2a | Block entitled for depreciation @ 5 per cent (Schedule DOA- 14ii or 15ii as applicable) | integer | SummaryFromDeprSch.BuildingSummary.DeprBlockTot5Percent | r15, computed [H15] |
| 2b | Block entitled for depreciation @ 10 per cent (Schedule DOA- 14iii or 15iii as applicable) | integer | SummaryFromDeprSch.BuildingSummary.DeprBlockTot10Percent | r16, computed [H16] |
| 2c | Block entitled for depreciation @ 40 per cent (Schedule DOA- 14iv or 15iv as applicable) | integer | SummaryFromDeprSch.BuildingSummary.DeprBlockTot40Percent | r17, computed [H17] |
| 2d | Total depreciation on building (2a+2b+2c) | integer | SummaryFromDeprSch.BuildingSummary.TotBuildng | r18, total [J18] |
| 3 | Furniture and fittings (Schedule DOA- 14v or 15v as applicable) | integer | SummaryFromDeprSch.FurnitureSummary | r19, computed [J19] |
| 4 | Intangible assets (Schedule DOA- 14vi or 15vi as applicable) | integer | SummaryFromDeprSch.IntangibleAssetSummary | r20, computed [J20] |
| 5 | Ships (Schedule DOA- 14vii or 15vii as applicable) | integer | SummaryFromDeprSch.ShipsSummary | r21, computed [J21] |
| 6 | Total depreciation ( 1e+2d+3+4+5) | integer | SummaryFromDeprSch.TotalDepreciation | r22, total [J22] |

### Schedule DCG — ScheduleDCG (rows 24–43)
Item numbers from the RULES document (Schedule DCG: 1a–1e plant & machinery, 2a–2d building, 3 furniture, 4 intangible, 5 ships, total).

| Sheet item | Field label | Type | Schema key | Rule / notes |
|---|---|---|---|---|
| — | Deemed Capital Gains on sale of depreciable assets | header | — | Sheet title (r24); `SummaryFromDeprSchCG` object |
| — | Plant and machinery | header | — | r25 |
| 1a | Block entitled for depreciation @ 15 per cent (Schedule DPM - 20i) | integer | SummaryFromDeprSchCG.PlantMachinerySummaryCG.DeprBlockTot15Percent | r26, computed [H26] |
| 1b | Block entitled for depreciation @ 30 per cent (Schedule DPM – 20ii) | integer | SummaryFromDeprSchCG.PlantMachinerySummaryCG.DeprBlockTot30Percent | r27, computed [H27] |
| 1c | Block entitled for depreciation @ 40 per cent (Schedule DPM - 20iii) | integer | SummaryFromDeprSchCG.PlantMachinerySummaryCG.DeprBlockTot40Percent | r28, computed [H28] |
| 1d | Block entitled for depreciation @ 45 per cent (Schedule DPM - 20iv) | integer | SummaryFromDeprSchCG.PlantMachinerySummaryCG.DeprBlockTot45Percent | r33, computed [H33] |
| 1e | Total ( 1a +1b + 1c +1d) | integer | SummaryFromDeprSchCG.PlantMachinerySummaryCG.TotPlntMach | r34, total [J34] |
| — | Building (not including land) | header | — | r35 |
| 2a | Block entitled for depreciation @ 5 per cent (Schedule DOA- 17ii) | integer | SummaryFromDeprSchCG.BuildingSummaryCG.DeprBlockTot5Percent | r36, computed [H36] |
| 2b | Block entitled for depreciation @ 10 per cent (Schedule DOA- 17iii) | integer | SummaryFromDeprSchCG.BuildingSummaryCG.DeprBlockTot10Percent | r37, computed [H37] |
| 2c | Block entitled for depreciation @ 40 per cent (Schedule DOA- 17iv) | integer | SummaryFromDeprSchCG.BuildingSummaryCG.DeprBlockTot40Percent | r38, computed [H38] |
| 2d | Total ( 2a + 2b + 2c) | integer | SummaryFromDeprSchCG.BuildingSummaryCG.TotBuildng | r39, total [J39] |
| 3 | Furniture and fittings ( Schedule DOA- 17v) | integer | SummaryFromDeprSchCG.FurnitureSummary | r40, computed [J40] |
| 4 | Intangible assets (Schedule DOA- 17vi) | integer | SummaryFromDeprSchCG.IntangibleAssetSummary | r41, computed [J41] |
| 5 | Ships (Schedule DOA- 17vii) | integer | SummaryFromDeprSchCG.ShipsSummary | r42, computed [J42] |
| — | Total ( 1e+2d+3+4+5) | integer | SummaryFromDeprSchCG.TotalDepreciation | r43, total [J43] |

## The rules the sheet computes
Every cell is computed by cross-sheet reference to Schedules DPM and DOA; nothing is entered here.

Schedule DEP:
- [H5] `IF(DPM15.ProAgrdep>0,DPM15.ProAgrdep,DPM15.NetAgrdep)` — 1a takes proportionate depreciation if > 0 else net aggregate (DPM 18i else 17i).
- [H6] `IF(DPM30.ProAgrdep>0,DPM30.ProAgrdep,DPM30.NetAgrdep)` — 1b (DPM 18ii else 17ii).
- [H7] `IF(DPM40.ProAgrdep>0,DPM40.ProAgrdep,DPM40.NetAgrdep)` — 1c (DPM 18iii else 17iii).
- [H12] `IF(DPM45.ProAgrdep>0,DPM45.ProAgrdep,DPM45.NetAgrdep)` — 1d (DPM 18iv else 17iv).
- [J13] `SUM(DEPP.DeprBlockTot15Percent, DEPP.DeprBlockTot30Percent, DEPP.DeprBlockTot40Percent, DEPP.DeprBlockTot45Percent)` — 1e = 1a+1b+1c+1d.
- [H15] `IF(DAOB5.ProAgrdep>0,DAOB5.ProAgrdep,DAOB5.NetAgrdep)` — 2a (DOA 15ii else 14ii).
- [H16] `IF(DAOB10.ProAgrdep>0,DAOB10.ProAgrdep,DAOB10.NetAgrdep)` — 2b (DOA 15iii else 14iii).
- [H17] `IF(DAOB100.ProAgrdep>0,DAOB100.ProAgrdep,DAOB100.NetAgrdep)` — 2c @40% (DOA 15iv else 14iv).
- [J18] `SUM(H15:H17)` — 2d = 2a+2b+2c.
- [J19] `IF(DAOF10.ProAgrdep>0,DAOF10.ProAgrdep,DAOF10.NetAgrdep)` — 3 furniture (DOA 15v else 14v).
- [J20] `IF(DAOI25.ProAgrdep>0,DAOI25.ProAgrdep,DAOI25.NetAgrdep)` — 4 intangible (DOA 15vi else 14vi).
- [J21] `IF(DAOS20.ProAgrdep>0,DAOS20.ProAgrdep,DAOS20.NetAgrdep)` — 5 ships (DOA 15vii else 14vii).
- [J22] `MAX(0,SUM(J13,J18,J19,J20,J21))` — 6 total depreciation, floored at 0 = 1e+2d+3+4+5.

Schedule DCG (deemed capital gain u/s 50; source cells `.CapGainUs50`):
- [H26] `DPM15.CapGainUs50` — 1a (DPM 20i).
- [H27] `DPM30.CapGainUs50` — 1b (DPM 20ii).
- [H28] `DPM40.CapGainUs50` — 1c (DPM 20iii).
- [H33] `DPM45.CapGainUs50` — 1d (DPM 20iv).
- [J34] `SUM(DCGP.DeprBlockTot15Percent, DCGP.DeprBlockTot30Percent, DCGP.DeprBlockTot40Percent, DCGP.DeprBlockTot45Percent)` — 1e = 1a+1b+1c+1d.
- [H36] `DAOB5.CapGainUs50` — 2a (DOA 17ii).
- [H37] `DAOB10.CapGainUs50` — 2b (DOA 17iii).
- [H38] `DAOB100.CapGainUs50` — 2c @40% (DOA 17iv).
- [J39] `SUM(H36:H38)` — 2d = 2a+2b+2c.
- [J40] `DAOF10.CapGainUs50` — 3 furniture (DOA 17v).
- [J41] `DAOI25.CapGainUs50` — 4 intangible (DOA 17vi).
- [J42] `DAOS20.CapGainUs50` — 5 ships (DOA 17vii).
- [J43] `SUM(J34,J39:J42)` — total deemed capital gains = 1e+2d+3+4+5.

Corroborating RULES-document checks (rules.json): DEP 1e = 1a+1b+1c+1d; DEP 2d = 2a+2b+2c; DEP 6 total = 1e+2d+3+4+5; each DEP block equals its DPM 17/18 or DOA 14/15 source. DCG 1e = 1a+1b+1c+1d; DCG 2d = 2a+2b+2c; DCG total = 1e+2d+3+4+5; each DCG block equals its DPM 20 / DOA 17 source; DCG note "22" on 2d is a stray footnote.

## Dropdowns
None. The dropdown dump lists only numeric input-validation floors on the computed cells (no enumerated value lists):
- cells `J18:J22 H5:H12 J13 H15:H17` — minimum `0` (Sch DEP figures, non-negative).
- cells `H26:H33 H36:H38 J39:J43 J34` — minimum `-99999999999999` (Sch DCG figures may be negative).
No selectable dropdown values exist on this sheet.

## What repeats and what is one figure
Nothing repeats — there are no arrays. Both `SummaryFromDeprSch` and `SummaryFromDeprSchCG` are single objects, each with two nested single objects (plant & machinery, building) plus three scalar leaves (furniture, intangible, ships) and one total. Every leaf is one figure.

## Mandatory
Schedule DEP required key: `SummaryFromDeprSch`. Within it the schema marks required: `PlantMachinerySummary.DeprBlockTot15Percent`, `PlantMachinerySummary.DeprBlockTot30Percent`, `PlantMachinerySummary.DeprBlockTot40Percent`, `PlantMachinerySummary.DeprBlockTot45Percent`, `PlantMachinerySummary.TotPlntMach`, `BuildingSummary.DeprBlockTot5Percent`, `BuildingSummary.DeprBlockTot10Percent`, `BuildingSummary.DeprBlockTot40Percent`, `BuildingSummary.TotBuildng`, and `TotalDepreciation`. (Furniture/Intangible/Ships summaries are optional scalars.)

Schedule DCG required key: `SummaryFromDeprSchCG`. Within it required: `PlantMachinerySummaryCG.DeprBlockTot15Percent`, `PlantMachinerySummaryCG.DeprBlockTot30Percent`, `PlantMachinerySummaryCG.DeprBlockTot40Percent`, `PlantMachinerySummaryCG.DeprBlockTot45Percent`, `PlantMachinerySummaryCG.TotPlntMach`, `BuildingSummaryCG.DeprBlockTot5Percent`, `BuildingSummaryCG.DeprBlockTot10Percent`, `BuildingSummaryCG.DeprBlockTot40Percent`, `BuildingSummaryCG.TotBuildng`, and `TotalDepreciation`.

## Hidden rows — not built
These blocks are hidden in the utility (rate slabs no longer live for A.Y. 2026-27) and must never appear as items; they have no schema leaf and roll up to zero:
- **Sch DEP r8 (H)** — d, Block entitled for depreciation @ 50 per cent ( Schedule DPM - 15 iv); `= DPM50.TotalDepreciation`.
- **Sch DEP r9 (H)** — e, Block entitled for depreciation @ 60 per cent ( Schedule DPM - 15 v); `= DPM60.TotalDepreciation`.
- **Sch DEP r10 (H)** — f, Block entitled for depreciation @ 80 per cent ( Schedule DPM – 15 vi); `= DPM80.TotalDepreciation`.
- **Sch DEP r11 (H)** — g, Block entitled for depreciation @ 100 per cent ( Schedule DPM - 15 vii); `= DPM100.TotalDepreciation`.
- **Sch DCG r29 (H)** — d, Block entitled for depreciation @ 50 per cent (Schedule DPM - 17iv); `= DPM50.CapGainUs50`.
- **Sch DCG r30 (H)** — e, Block entitled for depreciation @ 60 per cent (Schedule DPM – 17v); `= DPM60.CapGainUs50`.
- **Sch DCG r31 (H)** — f, Block entitled for depreciation @ 80 per cent (Schedule DPM – 17vi); `= DPM80.CapGainUs50`.
- **Sch DCG r32 (H)** — g, Block entitled for depreciation @ 100 per cent (Schedule DPM – 17vii); `= DPM100.CapGainUs50`.

## What this means for the build
- Render both schedules entirely as computed (green, untypeable) cells; no keyed input on this sheet. All figures fed from Schedules DPM and DOA.
- Sch DEP 1d is the 45% block (row 12, `DeprBlockTot45Percent`); the 50/60/80/100 rows (8–11) are hidden — do not render them. Same for Sch DCG: 1d is the 45% block (row 33), rows 29–32 hidden.
- DEP figures are floored non-negative (min 0, and [J22] wraps in MAX(0,…)); DCG figures may be negative (min -99999999999999) since a deemed capital gain computation can yield a loss/negative before aggregation — keep the DCG cells signed.
- Totals: DEP 1e=[J13], 2d=[J18], total 6=[J22]; DCG 1e=[J34], 2d=[J39], total=[J43]. Wire these exactly to the SUM/MAX formulas above.
- Both blocks are required at the object level, so always emit `SummaryFromDeprSch` and `SummaryFromDeprSchCG` with all required leaves (zero when empty) to be filed.


## Additional visible rows — verbatim from the sheet (completeness)
Rows present on the utility sheet and captured here verbatim so every visible label is in the book:

- Total ( 1a +1b + 1c +1d)
- Total ( 2a + 2b + 2c)
- Total ( 1e+2d+3+4+5)
