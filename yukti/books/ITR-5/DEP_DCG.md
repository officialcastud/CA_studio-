# DEP_DCG — Schedule DEP (Summary of depreciation) & Schedule DCG (Deemed capital gains on sale of depreciable assets)

Source: `python3 tools/dump.py --form ITR-5 --sheet "DEP_DCG"` (rows, `--formulas`), `--dropdowns "DEP_DCG"`, `--schema ScheduleDEP`/`ScheduleDCG` and `--leaves` for each, `books/ITR-5/rules.json`, `sources/ITR-5/vba_text.txt`. `books/ITR-5/section_map.json` → `"DEP_DCG": { "section": "bp", "blocks": ["ScheduleDEP","ScheduleDCG"] }`.

## The shape
One utility sheet (`DEP_DCG`) carrying two read-only summary schedules. **Sch DEP** (rows 3–18) summarises depreciation on assets *other than assets on which full capital expenditure is allowable*, by asset class and block rate, pulling every figure from Schedules DPM and DOA (which live on the `DPM_DOA` sheet). **Sch DCG** (rows 20–35) summarises the deemed capital gains under section 50 on the sale of those same depreciable-asset blocks, again pulling from DPM/DOA. Every cell here is computed — nothing is keyed on this sheet; the assessee fills DPM and DOA and these two summaries roll up. In ITR-5 the layout is compact: the 50/60/80/100-per-cent rate rows do **not** exist (there are no hidden rows on this sheet — see "Hidden rows"). The 45-per-cent block is a live, visible row (DEP r8 = 1d, DCG r25 = 1d).

## The items

### Schedule DEP — ScheduleDEP (rows 3–18)
Item numbers are from the RULES document (rules.json #303–312: DEP 1a–1e plant & machinery, 2a–2d building, 3 furniture, 4 intangible, 5 ships, 6 total). Sheet lettering in col E (a/b/c/d), item code in col G/I.

| Sheet item | Field label (col F / E) | Type | Schema key | Rule / notes |
|---|---|---|---|---|
| — | Sch DEP — Summary of depreciation on assets (Other than assets on which full capital expenditure is allowable | header | — | r3 [C3]/[E3]; `SummaryFromDeprSch` object |
| — | Plant and machinery | header | — | r4 [E4] |
| 1a (E5 a / G5) | Block entitled for depreciation @ 15 per cent ( Schedule DPM -17i or 18i as applicable) | integer | SummaryFromDeprSch.PlantMachinerySummary.DeprBlockTot15Percent | r5, computed [H5]; rules.json #307 = DPM 17i/18i |
| 1b (E6 b / G6) | Block entitled for depreciation @ 30 per cent ( Schedule DPM - 17ii or 18ii as applicable) | integer | SummaryFromDeprSch.PlantMachinerySummary.DeprBlockTot30Percent | r6, computed [H6]; = DPM 17ii/18ii |
| 1c (E7 c / G7) | Block entitled for depreciation @ 40 per cent ( Schedule DPM - 17iii or 18iii as applicable) | integer | SummaryFromDeprSch.PlantMachinerySummary.DeprBlockTot40Percent | r7, computed [H7]; = DPM 17iii/18iii |
| 1d (E8 d / G8) | Block entitled for depreciation @ 45 per cent ( Schedule DPM – 17iv or 18iv as applicable) | integer | SummaryFromDeprSch.PlantMachinerySummary.DeprBlockTot45Percent | r8, computed [H8]; = DPM 17iv/18iv |
| 1e (I9) | Total depreciation - plant and machinery (1a+1b+1c+1d) | integer | SummaryFromDeprSch.PlantMachinerySummary.TotPlntMach | r9, total [J9]; rules.json #303 |
| — | Building (not including land) | header | — | r10 [E10] |
| 2a (E11 a / G11) | Block entitled for depreciation @ 5 per cent (Schedule DOA- 14ii or 15ii as applicable) | integer | SummaryFromDeprSch.BuildingSummary.DeprBlockTot5Percent | r11, computed [H11]; = DOA 14ii/15ii |
| 2b (E12 b / G12) | Block entitled for depreciation @ 10 per cent (Schedule DOA- 14iii or 15iii as applicable) | integer | SummaryFromDeprSch.BuildingSummary.DeprBlockTot10Percent | r12, computed [H12]; = DOA 14iii/15iii |
| 2c (E13 c / G13) | Block entitled for depreciation @ 40 per cent (Schedule DOA- 14iv or 15iv as applicable) | integer | SummaryFromDeprSch.BuildingSummary.DeprBlockTot40Percent | r13, computed [H13]; = DOA 14iv/15iv |
| 2d (I14) | Total depreciation on building (2a+2b+2c) | integer | SummaryFromDeprSch.BuildingSummary.TotBuildng | r14, total [J14]; rules.json #304 |
| 3 (E15) | Furniture and fittings (Schedule DOA- 14v or 15v as applicable) | integer | SummaryFromDeprSch.FurnitureSummary | r15, computed [J15]; = DOA 14v/15v |
| 4 (E16) | Intangible assets (Schedule DOA- 14vi or 15vi as applicable) | integer | SummaryFromDeprSch.IntangibleAssetSummary | r16, computed [J16]; = DOA 14vi/15vi |
| 5 (E17) | Ships (Schedule DOA- 14vii or 15vii as applicable) | integer | SummaryFromDeprSch.ShipsSummary | r17, computed [J17]; = DOA 14vii/15vii |
| 6 (E18) | Total depreciation ( 1e+2d+3+4+5) | integer | SummaryFromDeprSch.TotalDepreciation | r18, total [J18]; rules.json #305 |

### Schedule DCG — ScheduleDCG (rows 20–35)
Item numbers from the RULES document (rules.json #313–325: DCG 1a–1e plant & machinery, 2a–2d building, 3 furniture, 4 intangible, 5 ships, 6 total).

| Sheet item | Field label (col F / E) | Type | Schema key | Rule / notes |
|---|---|---|---|---|
| — | Sch DCG — Deemed Capital Gains on sale of depreciable assets | header | — | r20 [C20]/[E20]; `SummaryFromDeprSchCG` object |
| — | Plant and machinery | header | — | r21 [E21] |
| 1a (E22 a / G22) | Block entitled for depreciation @ 15 per cent (Schedule DPM - 20i) | integer | SummaryFromDeprSchCG.PlantMachinerySummaryCG.DeprBlockTot15Percent | r22, computed [H22]; rules.json #316 = DPM 20i |
| 1b (E23 b / G23) | Block entitled for depreciation @ 30 per cent (Schedule DPM – 20ii) | integer | SummaryFromDeprSchCG.PlantMachinerySummaryCG.DeprBlockTot30Percent | r23, computed [H23]; = DPM 20ii |
| 1c (E24 c / G24) | Block entitled for depreciation @ 40 per cent (Schedule DPM - 20iii) | integer | SummaryFromDeprSchCG.PlantMachinerySummaryCG.DeprBlockTot40Percent | r24, computed [H24]; = DPM 20iii |
| 1d (E25 d / G25) | Block entitled for depreciation @ 45 per cent (Schedule DPM - 20iv) | integer | SummaryFromDeprSchCG.PlantMachinerySummaryCG.DeprBlockTot45Percent | r25, computed [H25]; = DPM 20iv |
| 1e (I26) | Total ( 1a +1b + 1c +1d) | integer | SummaryFromDeprSchCG.PlantMachinerySummaryCG.TotPlntMach | r26, total [J26]; rules.json #313 |
| — | Building (not including land) | header | — | r27 [E27] |
| 2a (E28 a / G28) | Block entitled for depreciation @ 5 per cent (Schedule DOA- 17ii) | integer | SummaryFromDeprSchCG.BuildingSummaryCG.DeprBlockTot5Percent | r28, computed [H28]; = DOA 17ii |
| 2b (E29 b / G29) | Block entitled for depreciation @ 10 per cent (Schedule DOA- 17iii) | integer | SummaryFromDeprSchCG.BuildingSummaryCG.DeprBlockTot10Percent | r29, computed [H29]; = DOA 17iii |
| 2c (E30 c / G30) | Block entitled for depreciation @ 40 per cent (Schedule DOA- 17iv) | integer | SummaryFromDeprSchCG.BuildingSummaryCG.DeprBlockTot40Percent | r30, computed [H30]; = DOA 17iv |
| 2d (I31) | Total ( 2a + 2b + 2c) | integer | SummaryFromDeprSchCG.BuildingSummaryCG.TotBuildng | r31, total [J31]; rules.json #314 |
| 3 (E32) | Furniture and fittings ( Schedule DOA- 17v) | integer | SummaryFromDeprSchCG.FurnitureSummary | r32, computed [J32]; = DOA 17v |
| 4 (E33) | Intangible assets (Schedule DOA- 17vi) | integer | SummaryFromDeprSchCG.IntangibleAssetSummary | r33, computed [J33]; = DOA 17vi |
| 5 (E34) | Ships (Schedule DOA- 17vii) | integer | SummaryFromDeprSchCG.ShipsSummary | r34, computed [J34]; = DOA 17vii |
| 6 (E35) | Total ( 1e+2d+3+4+5) | integer | SummaryFromDeprSchCG.TotalDepreciation | r35, total [J35]; rules.json #315 |

## The rules the sheet computes
Every cell is computed by cross-sheet reference to Schedules DPM and DOA (both on `DPM_DOA`); nothing is entered here. Source cells verbatim from `--formulas`.

**Schedule DEP** — each block takes the *proportionate* depreciation-allowed figure if > 0, else the net depreciation (the DPM 18-row/17-row and DOA 15-row/14-row "as applicable" choice):
- [H5] `IF(DPM15.DepreciationAllowed>0,DPM15.DepreciationAllowed,DPM15.NetDepreciation)` — 1a (DPM 18i else 17i).
- [H6] `IF(DPM30.DepreciationAllowed>0,DPM30.DepreciationAllowed,DPM30.NetDepreciation)` — 1b (DPM 18ii else 17ii).
- [H7] `IF(DPM40.DepreciationAllowed>0,DPM40.DepreciationAllowed,DPM40.NetDepreciation)` — 1c (DPM 18iii else 17iii).
- [H8] `IF(DPM45.DepreciationAllowed>0,DPM45.DepreciationAllowed,DPM45.NetDepreciation)` — 1d (DPM 18iv else 17iv).
- [J9] `SUM(H5:H8)` — 1e = 1a+1b+1c+1d.
- [H11] `IF(DAOB5.DepreciationAllowed>0,DAOB5.DepreciationAllowed,DAOB5.NetDepreciation)` — 2a (DOA 15ii else 14ii).
- [H12] `IF(DAOB10.DepreciationAllowed>0,DAOB10.DepreciationAllowed,DAOB10.NetDepreciation)` — 2b (DOA 15iii else 14iii).
- [H13] `IF(DAOB100.DepreciationAllowed>0,DAOB100.DepreciationAllowed,DAOB100.NetDepreciation)` — 2c @40% (DOA 15iv else 14iv). (Source range is `DAOB100`.)
- [J14] `SUM(H11:H13)` — 2d = 2a+2b+2c.
- [J15] `IF(DAOF10.DepreciationAllowed>0,DAOF10.DepreciationAllowed,DAOF10.NetDepreciation)` — 3 furniture (DOA 15v else 14v).
- [J16] `IF(DAOI25.DepreciationAllowed>0,DAOI25.DepreciationAllowed,DAOI25.NetDepreciation)` — 4 intangible (DOA 15vi else 14vi).
- [J17] `IF(DAOS20.DepreciationAllowed>0,DAOS20.DepreciationAllowed,DAOS20.NetDepreciation)` — 5 ships (DOA 15vii else 14vii).
- [J18] `MAX(0,J9+SUM(J14:J17))` — 6 total depreciation, floored at 0 = 1e+2d+3+4+5.

**Schedule DCG** (deemed capital gain u/s 50). Here the source figures are the DPM/DOA `CapGainUs50` cells, wired by direct `DPM_DOA!` cell reference (F26/G26/H26/I26 on `DPM_DOA` are the DPM sl-20 plant CapGainUs50 columns; G50/H50/I50/J50/K50/L50 are the DOA sl-17 building/furniture/intangible/ships CapGainUs50 columns):
- [H22] `DPM_DOA!$F$26` — 1a (DPM 20i).
- [H23] `DPM_DOA!$G$26` — 1b (DPM 20ii).
- [H24] `DPM_DOA!$H$26` — 1c (DPM 20iii).
- [H25] `DPM_DOA!$I$26` — 1d (DPM 20iv).
- [J26] `SUM(H22:H25)` — 1e = 1a+1b+1c+1d.
- [H28] `DPM_DOA!$G$50` — 2a (DOA 17ii).
- [H29] `DPM_DOA!$H$50` — 2b (DOA 17iii).
- [H30] `DPM_DOA!$I$50` — 2c @40% (DOA 17iv).
- [J31] `SUM(H28:H30)` — 2d = 2a+2b+2c.
- [J32] `DPM_DOA!$J$50` — 3 furniture (DOA 17v).
- [J33] `DPM_DOA!$K$50` — 4 intangible (DOA 17vi).
- [J34] `DPM_DOA!$L$50` — 5 ships (DOA 17vii).
- [J35] `SUM(J31:J34)+DCGP.TotPlntMach` — 6 total deemed capital gains = 2d+3+4+5+1e (`DCGP.TotPlntMach` is the named range for the plant total at [J26]).

Corroborating RULES-document checks (rules.json, cat A):
- #303 DEP 1e = 1a+1b+1c+1d; #304 DEP 2d = 2a+2b+2c; #305 DEP 6 total (text says "1d + 2d + 3 + 4 + 5" — a typo for **1e**; formula [J18] uses J9=1e).
- #307–312 each DEP block equals its DPM 17/18 or DOA 14/15 source.
- #302 DEP: "Depreciation allowable u/s 32(1)(ii) and 32(1)(iia) in Schedule BP should be equal to Point No. 6 of Schedule DEP" (cross-schedule to BP).
- #313 DCG 1e = 1a+1b+1c+1d; #314 DCG 2d = 2a+2b+2c; #315 DCG 6 total = 1e+2d+3+4+5.
- #316–325 each DCG block equals its DPM 20 / DOA 17 source.
- #326 cross-schedule: Schedule CG sl A6e (STCG) = DCG sl 6.

## Dropdowns
None. The `--dropdowns` dump lists only numeric input-validation floors on the computed cells (no enumerated value lists — `"values": null`):
- cells `H5:H8 J9 H11:H13 J14:J18` — source/min `0` (Sch DEP figures, non-negative).
- cells `H22:H25 J26 H28:H30 J31:J35` — source/min `-99999999999999` (Sch DCG figures may be negative).
No selectable dropdown values exist on this sheet.

## What repeats and what is one figure
Nothing repeats — there are no arrays. Both `SummaryFromDeprSch` and `SummaryFromDeprSchCG` are single objects, each with two nested single objects (`PlantMachinerySummary`/`PlantMachinerySummaryCG`, `BuildingSummary`/`BuildingSummaryCG`) plus three scalar leaves (furniture, intangible, ships) and one total. Every leaf is one figure.

## Mandatory
**Schedule DEP** required key: `SummaryFromDeprSch`. Within it the schema marks required (`*`): `SummaryFromDeprSch.PlantMachinerySummary.DeprBlockTot15Percent`, `.DeprBlockTot30Percent`, `.DeprBlockTot40Percent`, `.DeprBlockTot45Percent`, `.TotPlntMach`; `SummaryFromDeprSch.BuildingSummary.DeprBlockTot5Percent`, `.DeprBlockTot10Percent`, `.DeprBlockTot40Percent`, `.TotBuildng`; and `SummaryFromDeprSch.TotalDepreciation`. (`FurnitureSummary`, `IntangibleAssetSummary`, `ShipsSummary` are optional scalars.) DEP leaves have `minimum 0`, `maximum 99999999999999`.

**Schedule DCG** required key: `SummaryFromDeprSchCG`. Within it required (`*`): `SummaryFromDeprSchCG.PlantMachinerySummaryCG.DeprBlockTot15Percent`, `.DeprBlockTot30Percent`, `.DeprBlockTot40Percent`, `.DeprBlockTot45Percent`, `.TotPlntMach`; `SummaryFromDeprSchCG.BuildingSummaryCG.DeprBlockTot5Percent`, `.DeprBlockTot10Percent`, `.DeprBlockTot40Percent`, `.TotBuildng`; and `SummaryFromDeprSchCG.TotalDepreciation`. (Furniture/Intangible/Ships summaries optional.) DCG leaves have `minimum -99999999999999`, `maximum 99999999999999`.

## Hidden rows — not built
**None.** Every row of `DEP_DCG` (r3–r18 for Sch DEP, r20–r35 for Sch DCG) is visible — the `--dump` marks no row with `H`. Unlike ITR-3, ITR-5's DEP_DCG has no 50/60/80/100-per-cent plant rows at all (they are not present as hidden rows either); the 45-per-cent block is the last live plant row (DEP r8 / DCG r25).

## What this means for the build
- Render both schedules entirely as computed (green, untypeable) cells; no keyed input on this sheet. All figures fed from Schedules DPM and DOA (on `DPM_DOA`).
- Only four plant rate blocks exist: 15/30/40/45 per cent (DEP 1a–1d = rows 5–8; DCG 1a–1d = rows 22–25). Do not build any 50/60/80/100 rows — they do not exist in ITR-5.
- DEP figures are floored non-negative (min 0, and [J18] wraps in `MAX(0,…)`); DCG figures may be negative (min -99999999999999) since a deemed capital-gain computation can yield a loss before aggregation — keep the DCG cells signed.
- Totals to wire exactly: DEP 1e=[J9] `SUM(H5:H8)`, 2d=[J14] `SUM(H11:H13)`, total 6=[J18] `MAX(0,J9+SUM(J14:J17))`; DCG 1e=[J26] `SUM(H22:H25)`, 2d=[J31] `SUM(H28:H30)`, total 6=[J35] `SUM(J31:J34)+DCGP.TotPlntMach` (i.e. 1e+2d+3+4+5).
- DEP source pattern: `IF(<blk>.DepreciationAllowed>0, <blk>.DepreciationAllowed, <blk>.NetDepreciation)` for each block (`DPM15/30/40/45`, `DAOB5/10/100`, `DAOF10`, `DAOI25`, `DAOS20`). DCG source pattern: direct `DPM_DOA!` cell references to the `CapGainUs50` columns (DPM row 26, DOA row 50).
- Both blocks are required at the object level, so always emit `SummaryFromDeprSch` and `SummaryFromDeprSchCG` with all required leaves (zero when empty) to file.
- Cross-schedule ties (validate, not built here): Sch BP depreciation allowable = DEP sl 6 (rules.json #302); Sch CG sl A6e STCG = DCG sl 6 (rules.json #326).
