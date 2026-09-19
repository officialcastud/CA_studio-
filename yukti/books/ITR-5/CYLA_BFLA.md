# CYLA-BFLA — Schedule CYLA & Schedule BFLA (ITR-5, A.Y. 2026-27)

One utility worksheet ("CYLA-BFLA") holds two schedules stacked vertically:

- **Schedule CYLA** (rows 3-28) — *Details of Income after set-off of current years losses*. Section header C4 = "CURRENT YEAR LOSS ADJUSTMENT". Maps to schema block **ScheduleCYLA**.
- **Schedule BFLA** (rows 30-54) — *Details of Income after Set off of Brought Forward Losses of earlier years*. Section header C31 = "BROUGHT FORWARD LOSS ADJUSTMENT". Maps to schema block **ScheduleBFLA**.

Rows 55-58 are off-table helper cells (M/N/O/P/Q scratch columns for the LTCG-DTAA waterfall).

---

## The shape

Both schedules are fixed matrices — **not repeats**. Each row is a named head/source of income; there is exactly one row per head, no add-row grid. Everything except the two edit-flag dropdowns is **auto-populated / computed** and read-only unless the user answers "Yes" to the edit question.

**Schedule CYLA** is a 5-column matrix (columns 1-5 = sheet columns F, G, H, I, J):

| Col | Sheet col | Meaning |
|---|---|---|
| 1 | F | Income of current year (fill only if income is zero or positive) |
| 2 | G | House property loss of the current year set off |
| 3 | H | Business Loss (other than speculation loss or specified business loss) of the current year set off |
| 4 | I | Other sources loss (other than loss from race horses) of the current year set off |
| 5 | J | Current year's Income remaining after set off (5 = 1 − 2 − 3 − 4) |

Row 6 names the source of each loss column: G6 = "Total loss (3 of Schedule – HP)", H6 = "Total loss (2v of item E of Schedule BP)", I6 = "Total loss (6 of Schedule-OS)". Row 7 (Sl.No. i) = "Loss to be set off(Fill this row only, if computed figure is negative)" holds the total loss available under each head. Rows 8-24 (Sl.No. ii-xv) are the income heads absorbing those losses. Row 25 (xvi) = totals set off; Row 26 (xvii) = loss remaining after set-off.

**Schedule BFLA** is a 5-column matrix (columns 1-5 = sheet columns F, G, H, I, J):

| Col | Sheet col | Meaning |
|---|---|---|
| 1 | F | Income after set off, if any, of current year's losses as per 5 of Schedule CYLA |
| 2 | G | Brought forward loss set off |
| 3 | H | Brought forward depreciation set off |
| 4 | I | Brought forward allowance under section 35(4) set off |
| 5 | J | Current year's income remaining after set off |

Rows 34-50 (Sl.No. i-xiv) are the heads; Row 51 (xv) = total of brought forward loss set off; Row 52 (xvi) = current year's income remaining after set off.

---

## The items — Schedule CYLA (block `ScheduleCYLA`)

Column-1 (F) income maps to `<Head>.IncCYLA.IncOfCurYrUnderThatHead`; column-5 (J) remaining income maps to `<Head>.IncCYLA.IncOfCurYrAfterSetOff`. Column-2 (G) set-off → `HPlossCurYrSetoff`, column-3 (H) → `BusLossSetoff`, column-4 (I) → `OthSrcLossNoRaceHorseSetoff` (naming per each head object; HP's own row has no HP-setoff column, OthSrc's row has no OthSrc-setoff column, race-horse row has no race-horse column — the head cannot set a loss off against itself).

| Sl.No. | Sheet cells | Head / Source of Income | Type | Schema key | Rule |
|---|---|---|---|---|---|
| i | E7,G7,H7,I7 | Loss to be set off (fill only if computed figure is negative) | computed | `TotalCurYr.TotHPlossCurYr` (G7), `TotalCurYr.TotBusLoss` (H7), `TotalCurYr.TotOthSrcLossNoRaceHorse` (I7) | totals of each loss available; see rules below |
| ii | E8,F8,H8,I8,J8 | House property | computed | `HP.IncCYLA.IncOfCurYrUnderThatHead`, `HP.IncCYLA.BusLossSetoff`, `HP.IncCYLA.OthSrcLossNoRaceHorseSetoff`, `HP.IncCYLA.IncOfCurYrAfterSetOff` | HP head has no HP-loss column |
| iii | E9,F9,G9,I9,J9 | Business (excluding income from life insurance business u/s 115B, speculation income and income from specified business) | computed | `BusProfExclSpecProf.IncCYLA.IncOfCurYrUnderThatHead`, `.HPlossCurYrSetoff`, `.OthSrcLossNoRaceHorseSetoff`, `.IncOfCurYrAfterSetOff` | Business head has no Business-loss column |
| iv | E10 | Income from life insurance business u/s 115B | display row | (no CYLA leaf; life-insurance 115B income line, limit `Ins115BIncome_Limit`) | not a schema leaf in CYLA |
| v | E11,F11,G11,I11,J11 | Speculative Income | computed | `SpeculationIncome.IncCYLA.IncOfCurYrUnderThatHead`, `.HPlossCurYrSetoff`, `.OthSrcLossNoRaceHorseSetoff`, `.IncOfCurYrAfterSetOff` | |
| vi | E12,F12,G12,I12,J12 | Specified business income u/s 35AD | computed | `SpecifiedBusIncome.IncCYLA.IncOfCurYrUnderThatHead`, `.HPlossCurYrSetoff`, `.OthSrcLossNoRaceHorseSetoff`, `.IncOfCurYrAfterSetOff` | |
| vii | E14,F14,G14,H14,I14,J14 | Short-term capital gain taxable @20% | computed | `STCG20Per.IncCYLA.IncOfCurYrUnderThatHead`, `.HPlossCurYrSetoff`, `.BusLossSetoff`, `.OthSrcLossNoRaceHorseSetoff`, `.IncOfCurYrAfterSetOff` | **required** block |
| viii | E15,F15,G15,H15,I15,J15 | Short-term capital gain taxable @ 30% | computed | `STCG30Per.IncCYLA.IncOfCurYrUnderThatHead`, `.HPlossCurYrSetoff`, `.BusLossSetoff`, `.OthSrcLossNoRaceHorseSetoff`, `.IncOfCurYrAfterSetOff` | **required** block |
| ix | E16,F16,G16,H16,I16,J16 | Short-term capital gain taxable at applicable rates | computed | `STCGAppRate.IncCYLA.IncOfCurYrUnderThatHead`, `.HPlossCurYrSetoff`, `.BusLossSetoff`, `.OthSrcLossNoRaceHorseSetoff`, `.IncOfCurYrAfterSetOff` | **required** block |
| x | E17,F17,G17,H17,I17,J17 | Short-term capital gain taxable at DTAA rates | computed | `STCGDTAARate.IncCYLA.IncOfCurYrUnderThatHead`, `.HPlossCurYrSetoff`, `.BusLossSetoff`, `.OthSrcLossNoRaceHorseSetoff`, `.IncOfCurYrAfterSetOff` | **required** block |
| xi | E19,F19,G19,H19,I19,J19 | Long term capital gain taxable @ 12.5% | computed | `LTCG12_5Per.IncCYLA.IncOfCurYrUnderThatHead`, `.HPlossCurYrSetoff`, `.BusLossSetoff`, `.OthSrcLossNoRaceHorseSetoff`, `.IncOfCurYrAfterSetOff` | **required** block |
| xii | E21,F21,G21,H21,I21,J21 | Long term capital gains taxable @ DTAA rates | computed | `LTCGDTAARate.IncCYLA.IncOfCurYrUnderThatHead`, `.HPlossCurYrSetoff`, `.BusLossSetoff`, `.OthSrcLossNoRaceHorseSetoff`, `.IncOfCurYrAfterSetOff` | **required** block |
| xiii | E22,F22,G22,H22,J22 | Net income from other sources chargeable at normal applicable rates | computed | `OthSrcExclRaceHorseLottery.IncCYLA.IncOfCurYrUnderThatHead`, `.HPlossCurYrSetoff`, `.BusLossSetoff`, `.IncOfCurYrAfterSetOff` | OS head has no OS-loss column |
| xiv | E23,F23,G23,H23,I23,J23 | Profit from the activity of owning and maintaining race horses | computed | `ProfitFrmRaceHorse.IncCYLA.IncOfCurYrUnderThatHead`, `.HPlossCurYrSetoff`, `.BusLossSetoff`, `.OthSrcLossNoRaceHorseSetoff`, `.IncOfCurYrAfterSetOff` | race-horse head has no race-horse column |
| xv | E24,F24,G24,H24,I24,J24 | Income from other sources income taxable at special rates as per DTAA rates | computed | `IncOSDTAA.IncCYLA.IncOfCurYrUnderThatHead`, `.HPlossCurYrSetoff`, `.BusLossSetoff`, `.OthSrcLossNoRaceHorseSetoff`, `.IncOfCurYrAfterSetOff` | |
| xvi | E25,G25,H25,I25 | Total loss set off (ii + iii + iv + v + vi + vii+ viii + ix + x + xi+ xii + xiii + xiv+xv) | computed | `TotalLossSetOff.TotHPlossCurYrSetoff` (G25, **cap ₹200000**), `TotalLossSetOff.TotBusLossSetoff` (H25), `TotalLossSetOff.TotOthSrcLossNoRaceHorseSetoff` (I25) | |
| xvii | E26,G26,H26,I26 | Loss remaining after set-off (i - xvi) | computed | `LossRemAftSetOff.BalHPlossCurYrAftSetoff` (G26), `LossRemAftSetOff.BalBusLossAftSetoff` (H26), `LossRemAftSetOff.BalOthSrcLossNoRaceHorseAftSetoff` (I26) | |

Edit flag: E28 question "Do you want to edit the details auto-populated in table above ?", answer cell I28 → `CYLAEditFlag`.

**CYLA helper limit cells (column N, non-hidden rows).** These are the per-head "income available for set-off" caps used by the set-off MIN() formulas: `BusinessIncome_Limit` (N9), `SpeculativeIncome_Limit` (N10), `SpecifiedIncome_Limit` (N11), `Ins115BIncome_Limit` (N12), `OsHorseRaceIncome_Limit` (N14), `OsDTAAIncome_Limit` (N15), `Stcg30PercentIncome_Limit` (N16), `StcgAppRateIncome_Limit` (N17), `Stcg15PercentIncome_Limit` (N19), `Ltcg10PercentIncome_Limit` (N21), `Ltcg12.5PercentIncome_Limit` (N22), `STCGDTAAIncome_Limit` (N23), `LTCGDTAAIncome_Limit` (N24). N8 = "Loss that can be adjusted". None of these are schema leaves — they exist only to drive the waterfall and are never emitted.

---

## The items — Schedule BFLA (block `ScheduleBFLA`)

Column-1 (F) → `<Head>.IncBFLA.IncOfCurYrUndHeadFromCYLA`; column-2 (G) → `BFlossPrevYrUndSameHeadSetoff`; column-3 (H) → `BFUnabsorbedDeprSetoff`; column-4 (I) → `BFAllUs35Cl4Setoff`; column-5 (J) → `IncOfCurYrAfterSetOffBFLosses`.

| Sl.No. | Sheet cells | Head / Source of Income | Type | Schema key | Rule |
|---|---|---|---|---|---|
| i | E34,F34,G34,H34,I34,J34 | House property | computed | `HP.IncBFLA.IncOfCurYrUndHeadFromCYLA`, `.BFlossPrevYrUndSameHeadSetoff`, `.BFUnabsorbedDeprSetoff`, `.BFAllUs35Cl4Setoff`, `.IncOfCurYrAfterSetOffBFLosses` | 1(i) = 5(ii) of CYLA |
| ii | E35,F35,G35,H35,I35,J35 | Business (excluding income from life insurance business u/s 115B, speculation income and income from specified business) | computed | `BusProfExclSpecProf.IncBFLA.IncOfCurYrUndHeadFromCYLA`, `.BFlossPrevYrUndSameHeadSetoff`, `.BFUnabsorbedDeprSetoff`, `.BFAllUs35Cl4Setoff`, `.IncOfCurYrAfterSetOffBFLosses` | 44BB/44BBD income excluded from BF business-loss & deprec set-off |
| iii | E36 | Income from life insurance business u/s 115B | computed | (rolled into SpecifiedBusIncome/115B handling; `115b Income` helper M38) | 115B income line |
| iv | E37,F37,G37,H37,I37,J37 | Speculative Income | computed | `SpeculationIncome.IncBFLA.IncOfCurYrUndHeadFromCYLA`, `.BFlossPrevYrUndSameHeadSetoff`, `.BFUnabsorbedDeprSetoff`, `.BFAllUs35Cl4Setoff`, `.IncOfCurYrAfterSetOffBFLosses` | 1(iv) = 5(v) of CYLA |
| v | E38,F38,G38,H38,I38,J38 | Specified Business Income | computed | `SpecifiedBusIncome.IncBFLA.IncOfCurYrUndHeadFromCYLA`, `.BFlossPrevYrUndSameHeadSetoff`, `.BFUnabsorbedDeprSetoff`, `.BFAllUs35Cl4Setoff`, `.IncOfCurYrAfterSetOffBFLosses` | 1(v) = 5(vi) of CYLA |
| vi | E40,F40,G40,H40,I40,J40 | Short-term capital gain taxable @ 20% | computed | `STCG20Per.IncBFLA.IncOfCurYrUndHeadFromCYLA`, `.BFlossPrevYrUndSameHeadSetoff`, `.BFUnabsorbedDeprSetoff`, `.BFAllUs35Cl4Setoff`, `.IncOfCurYrAfterSetOffBFLosses` | **required** block |
| vii | E41,F41,G41,H41,I41,J41 | Short-term capital gain taxable @ 30% | computed | `STCG30Per.IncBFLA.IncOfCurYrUndHeadFromCYLA`, `.BFlossPrevYrUndSameHeadSetoff`, `.BFUnabsorbedDeprSetoff`, `.BFAllUs35Cl4Setoff`, `.IncOfCurYrAfterSetOffBFLosses` | **required** block; 1(vii) = 5(viii) of CYLA |
| viii | E42,F42,G42,H42,I42,J42 | Short-term capital gain taxable at applicable rates | computed | `STCGAppRate.IncBFLA.IncOfCurYrUndHeadFromCYLA`, `.BFlossPrevYrUndSameHeadSetoff`, `.BFUnabsorbedDeprSetoff`, `.BFAllUs35Cl4Setoff`, `.IncOfCurYrAfterSetOffBFLosses` | **required** block; 1(viii) = 5(ix) of CYLA |
| ix | E43,F43,G43,H43,I43,J43 | Short-term capital gain taxable at special rates in India as per DTAA | computed | `STCGDTAARate.IncBFLA.IncOfCurYrUndHeadFromCYLA`, `.BFlossPrevYrUndSameHeadSetoff`, `.BFUnabsorbedDeprSetoff`, `.BFAllUs35Cl4Setoff`, `.IncOfCurYrAfterSetOffBFLosses` | **required** block; 1(ix) = 5(x) of CYLA |
| x | E45,F45,G45,H45,I45,J45 | Long term capital gain taxable @ 12.5% | computed | `LTCG12_5Per.IncBFLA.IncOfCurYrUndHeadFromCYLA`, `.BFlossPrevYrUndSameHeadSetoff`, `.BFUnabsorbedDeprSetoff`, `.BFAllUs35Cl4Setoff`, `.IncOfCurYrAfterSetOffBFLosses` | **required** block |
| xi | E47,F47,G47,H47,I47,J47 | Long term capital gains taxable at special rates in India as per DTAA | computed | `LTCGDTAARate.IncBFLA.IncOfCurYrUndHeadFromCYLA`, `.BFlossPrevYrUndSameHeadSetoff`, `.BFUnabsorbedDeprSetoff`, `.BFAllUs35Cl4Setoff`, `.IncOfCurYrAfterSetOffBFLosses` | **required** block; 1(xi) = 5(xii) of CYLA |
| xii | E48,F48,H48,I48,J48 | Net income from other sources chargeable at normal applicable rates | computed | `OthSrcExclRaceHorse.IncBFLA.IncOfCurYrUndHeadFromCYLA`, `.BFUnabsorbedDeprSetoff`, `.BFAllUs35Cl4Setoff`, `.IncOfCurYrAfterSetOffBFLosses` | no BF-loss column (OS loss not carried); 1(xii) = 5(xiii) of CYLA |
| xiii | E49,F49,G49,H49,I49,J49 | Profit from owning and maintaining race horses | computed | `ProfitFrmRaceHorse.IncBFLA.IncOfCurYrUndHeadFromCYLA`, `.BFlossPrevYrUndSameHeadSetoff`, `.BFUnabsorbedDeprSetoff`, `.BFAllUs35Cl4Setoff`, `.IncOfCurYrAfterSetOffBFLosses` | 1(xiii) = 5(xiv) of CYLA |
| xiv | E50,F50,H50,I50,J50 | Income from other sources income taxable at special rates in India as per DTAA | computed | `IncOSDTAA.IncBFLA.IncOfCurYrUndHeadFromCYLA`, `.BFUnabsorbedDeprSetoff`, `.BFAllUs35Cl4Setoff`, `.IncOfCurYrAfterSetOffBFLosses` | no BF-loss column; 1(xiv) = 5(xv) of CYLA |
| xv | E51,G51,H51,I51 | Total of brought forward loss set off (2i+2ii + 2iii + 2iv + 2v + 2vi + 2vii +2viii + 2ix + 2x+2xi +...) | computed | `TotalBFLossSetOff.TotBFLossSetoff` (G51), `TotalBFLossSetOff.TotUnabsorbedDeprSetoff` (H51), `TotalBFLossSetOff.TotAllUs35cl4Setoff` (I51) | |
| xvi | E52,J52 | Current year's income remaining after set off Total (5i + 5ii + 5iii + 5iv+ 5v + 5vi+ 5vii + 5viii +...) | computed | `IncomeOfCurrYrAftCYLABFLA` (J52) | |

Edit flag: E54 question "Do you want to edit the details auto-populated in table above ?", answer cell I54 → `BFLAEditFlag`.

**BFLA helper cells (columns M/N/O/P/Q, off-table waterfall).** Labels: `Business Income` (M35), `Speculative Income` (M36), `Specified Income` (M37), `115b Income` (M38), `STCG CFL Loss` (M43), and per-row `Individual Field Set off` (N34/N42), `Remaining Loss After Setoff` (O34/O42), `Income Remaining after Set off` (P34/P42), `STCG Loss Set Off` (Q42). These drive the STCG/LTCG cross-set-off ladder; not schema leaves, never emitted.

---

## The rules the sheet computes (with cell references)

### Schedule CYLA — losses available (row 7, Sl.No. i)
- **G7** = `ABS(MIN(HP.TotalIncomeChargeableUnHP,0))` — HP loss available = current-year HP loss (Schedule HP item 3), taken as positive. Maps to `TotalCurYr.TotHPlossCurYr`. (Rule: 2i House property loss should equal Schedule HP item 3 in case of loss; 2525.)
- **H7** = `ABS(sheet12.LossRemainSetOffOnBus)` — business loss available = "2v of item E of Schedule BP". Maps to `TotalCurYr.TotBusLoss`. (Rule 2530: 3i = 2vi of Table E of Schedule BP.)
- **I7** = `ABS(MIN(os.BalanceNoRaceHorse+MAX(0,0),0))` — other-sources loss available = "6 of Schedule-OS" in case of loss. Maps to `TotalCurYr.TotOthSrcLossNoRaceHorse`. (Rule 2535: 4i = item 6 of Schedule OS in case of loss.)

### Schedule CYLA — column 1 income (F), fill only if zero or positive
Each head's F pulls the positive current-year income from its source schedule, e.g. F8 = `MAX(HP.TotalIncomeChargeableUnHP,0)`, F9 = `MAX(sheet12.NetPLBusOthThanSpec7A7B7C,0)`, F14 = `STCG_CurrentYrGain20Percent`, F15 = `STCG_CurrentYrGain30Percent`, F16 = `STCG_CurrentYrGainAppRate`, F17 = `STCG_CurrentYrGainDTAARate`, F19 = `LTCG_CurrentYrGain125Percent`, F21 = `LTCG_CurrentYrGainDTAARate`, F22 = `MAX(os.BalanceNoRaceHorse+MAX(0,0),0)`, F23 = `MAX(0+MAX(os.BalanceOwnRaceHorse,0),0)`, F24 = `MAX(0,os.DTAA_Amt+MAX(0,0))`. (Rules 2575-2660 tie each F to its CG/BP/OS source line.)

### Schedule CYLA — set-off waterfall (columns 2-4), the order that matters
For every income head the set-off amount is `MIN(income available for that head, loss remaining to be set off, …)`, capped so total set off never exceeds column-1 income (rule 2635: sum of col 2+3+4 ≤ col 1). The per-head income cap is the N-column `_Limit` cell (e.g. G9 caps at `BusinessIncome_Limit`, G11 at `SpeculativeIncome_Limit`, G14 at `Stcg20PercentIncome_Limit`, …).

- **Column 2 (G) — HP loss set off**: whole HP loss can be set off against any head when income exceeds loss (rule 2630). Each Gn = `MIN(<Limit>, <head income − OthSrc already set off>, cyla.TotHPlossCurYr − HP already used…)`.
- **Column 3 (H) — Business loss set off**: whole business loss can be set off against any head (rule 2645). Each Hn = `MIN(<head income − HP setoff − OthSrc setoff>, cyla.TotBusLoss − …)`. Business loss cannot be set off against salary (n/a here) and, in BFLA, not against 44BB/44BBD income.
- **Column 4 (I) — Other-sources loss set off**: whole OS loss set off against any head (rule 2650), **but normal OS loss must be set off first against (i) race-horse profit and (ii) OS income taxable at special DTAA rates** (rule 2625). Formulas subtract `rh.OthSrcLossNoRaceHorseSetoff4` and `os.OthSrcLossNoRaceHorse…` first, enforcing that priority.
- **Column 5 (J)** = `MAX(0, <head income> − SUM(G:I))` for that row (rule 2570: col 5 = col 1 − 2 − 3 − 4). N5 note: "5=1-2-3-4". O5 = `SUM(busprof.HPlossCurYrSetoff,G11:G21,G22:G24)`, P5 = `SUM(J8:J24)` (control totals).

### Schedule CYLA — totals and remaining (rows 25-26)
- **G25** = `SUM(G8:G24)`, **H25** = `SUM(H8:H24)`, **I25** = `SUM(I8:I24)` — total loss set off per column (rules 2540/2545/2550).
- **G26** = `IF(bacValue=1,0,IF(sheet16.TotHPlossCurYrSetoff<200000, MAX(0,(cyla.TotHPlossCurYr1 − sheet16.TotHPlos…)),…))` — **HP loss remaining after set-off is forced to 0 when the new tax regime is opted (`bacValue=1`)**: HP losses cannot be adjusted under the new regime (rule 2640). Otherwise = 2(i) − 2(xvi).
- **H26** = `MAX(0, cyla.TotBusLoss − sheet16.TotBusLossSetoff)` = 3(i) − 3(xvi) (rule 2560).
- **I26** = `MAX(0, cyla.TotOthSrcLossNoRaceHorse − sheet16.TotOthSrcLossNoRaceHorseSetoff)` = 4(i) − 4(xvi) (rule 2565).

### CYLA hard cap
- **`TotalLossSetOff.TotHPlossCurYrSetoff` (G25) maximum = 200000.** Schema `maximum: 200000`; rule 2520/2540: HP total loss set off (2xvi) cannot exceed ₹200000 (the house-property set-off cap under s.71(3A)). All other set-off/income leaves cap at 99999999999999, min 0.

### Schedule BFLA — column 1 income (F)
Each F pulls the CYLA column-5 remaining income: F34 = `hp.IncOfCurYrAfterSetOff2`, F35 = `busprof.IncOfCurYrAfterSetOff`, F37 = `busprofspec.IncOfCurYrAfterSetOff0a`, F38 = `busprofspecified.IncOfCurYrAfterSetOff0b`, F40 = `stcg.IncOfCurYrAfterSetOff1ab`, F41 = `stcg.IncOfCurYrAfterSetOff1a`, F42 = `stcg.IncOfCurYrAfterSetOff1b`, F43 = `stcg.IncOfCurYrAfterSetOffDTAA`, F45 = `ltcg.IncOfCurYrAfterSetOff2ab`, F47 = `ltcg.IncOfCurYrAfterSetOffDTAA`, F48 = `othSecinclnlhrs.IncOfCurYrAfterSetOff3`, F49 = `rh.IncOfCurYrAfterSetOff4`, F50 = `os.IncOfCurYrAfterSetOffDTAA`. (Rules 2710-2765: BFLA 1(head) must match 5(corresponding) of Schedule CYLA.)

### Schedule BFLA — set-off waterfall (columns 2-4)
- **Column 2 (G) — Brought forward loss set off** = `MIN(income from CYLA, totofbfloss.<HeadLoss>CF8 − already used)`. STCG/LTCG rows share a cross-set-off ladder through the M/N/O/P/Q helpers (e.g. O43 = `MAX(0, totofbfloss.STCGLossCF8 − SUM(G40:G42))`; G45 = `MAX(0, N46+MIN(O45,P46))`). BF business loss and BF depreciation cannot be set off against 44BB/44BBD income (rule 2770/2775).
- **Column 3 (H) — Brought forward depreciation set off** = `MIN(remaining income, UD.TotSetoff − …)`. Total (3xv/H51) must equal total of Col. 4 of Schedule UD (rule 2670).
- **Column 4 (I) — Brought forward allowance u/s 35(4) set off** = `MIN(remaining income, UD2.TotSetoff − …)`. Total (4xv/I51) must equal total of Col. 7 of Schedule UD (rule 2665).
- **Column 5 (J)** = `MAX(<income from CYLA> − SUM(G:I), 0)` (rule 2785: col 5 = col 1 − 2 − 3 − 4; and col 5 sum ≤ col 1, rule 2790).

### Schedule BFLA — totals (rows 51-52)
- **G51** = `SUM(G34:G49)` → `TotalBFLossSetOff.TotBFLossSetoff` (rule 2690: 2xv = sum 2i…2xii).
- **H51** = `SUM(H34:H50)` → `TotalBFLossSetOff.TotUnabsorbedDeprSetoff` (rule 2700-2705: 3xv/4xv sums).
- **I51** = `SUM(I34:I50)` → `TotalBFLossSetOff.TotAllUs35cl4Setoff`.
- **J52** = `SUM(J34:J50)` → `IncomeOfCurrYrAftCYLABFLA` (rule 2695: 5xvi = sum of col-5).

### Cross-schedule ties (from rules.json)
- Part B-TI point uses "total of 2xvi, 3xvi and 4xvi of Schedule CYLA" (rule 3980) and "total value in field 2xv, 3xv and 4xv of Schedule BFLA" (rule 3985).
- Schedule CFL: 4xix = 2xvii of CYLA (rule 2810); 5xix = 3xvii of CYLA (rule 2815); BFLA 2(i) = CFL 4(xviii) (rule 2675); BFLA 2(ii+iii+iv+v) = CFL xvii(5+6+7) (rule 2680); BFLA 2(xiii) = CFL 11(xviii) (rule 2685).
- Schedule SI ties DTAA special-rate incomes to BFLA 5(vii/ix/xi/xiv) (rules 3520-3575).

---

## Dropdowns

Only two real dropdowns exist; both are the edit toggle:

- **I28** (`CYLAEditFlag`) — source `"No,Yes"` — values: **No**, **Yes**. Question E28 "Do you want to edit the details auto-populated in table above ?".
- **I54** (`BFLAEditFlag`) — named list `CYLA_TempEdit` — values: **Yes**, **No**. Question E54 "Do you want to edit the details auto-populated in table above ?".

The other two "dropdown" entries in the utility are input-validation ranges, not pick-lists: cells `F8:F24 …` etc. carry `source:"0"` (values null — a ≥0 numeric floor); `J44:J47` carry `source:"-99999999999999"` (values null — the CG rows may hold negatives during intermediate calc). Neither presents a list.

Default for both edit flags = **No** (auto-populated values are used as-is unless the user opts to edit).

---

## What repeats and what is one figure

- **Nothing repeats.** Both schedules are fixed single-instance matrices — one row per named head of income, one column set per schedule. There is no add-row / instance grid anywhere on this sheet.
- Each cell is **one figure**. Every income/set-off/remaining amount is a single computed integer. The only user-touchable inputs are the two edit-flag dropdowns (and, when "Yes", the auto-populated numbers become editable in place — still one figure per cell, not a repeat).

---

## Mandatory (from schema `required`)

**ScheduleCYLA** required blocks: `STCG20Per`, `STCG30Per`, `STCGAppRate`, `STCGDTAARate`, `LTCG12_5Per`, `LTCGDTAARate` (each must carry `IncCYLA.IncOfCurYrUnderThatHead` and `IncCYLA.IncOfCurYrAfterSetOff`, both required inside every block). Within every head object, `IncCYLA.IncOfCurYrUnderThatHead` and `IncCYLA.IncOfCurYrAfterSetOff` are required; the set-off legs (`HPlossCurYrSetoff`, `BusLossSetoff`, `OthSrcLossNoRaceHorseSetoff`) are optional. The three summary objects are required: `TotalCurYr` (`TotHPlossCurYr`, `TotBusLoss`, `TotOthSrcLossNoRaceHorse`), `TotalLossSetOff` (`TotHPlossCurYrSetoff` [≤200000], `TotBusLossSetoff`, `TotOthSrcLossNoRaceHorseSetoff`), `LossRemAftSetOff` (`BalHPlossCurYrAftSetoff`, `BalBusLossAftSetoff`, `BalOthSrcLossNoRaceHorseAftSetoff`). `CYLAEditFlag` is optional.

**ScheduleBFLA** required blocks: `STCG20Per`, `STCG30Per`, `STCGAppRate`, `STCGDTAARate`, `LTCG12_5Per`, `LTCGDTAARate`, and the scalar `IncomeOfCurrYrAftCYLABFLA`. Within every head object all five `IncBFLA` legs are required: `IncOfCurYrUndHeadFromCYLA`, `BFlossPrevYrUndSameHeadSetoff`, `BFUnabsorbedDeprSetoff`, `BFAllUs35Cl4Setoff`, `IncOfCurYrAfterSetOffBFLosses` — except `OthSrcExclRaceHorse` and `IncOSDTAA`, which drop `BFlossPrevYrUndSameHeadSetoff` (OS loss is not carried forward). `TotalBFLossSetOff` (`TotBFLossSetoff`, `TotUnabsorbedDeprSetoff`, `TotAllUs35cl4Setoff`) is required. `BFLAEditFlag` is optional.

All amounts: integer, minimum 0, maximum 99999999999999 — except `TotalLossSetOff.TotHPlossCurYrSetoff` maximum 200000.

---

## Hidden rows — not built

The following utility rows are marked **H** (hidden) and are **not built** — they are legacy/removed capital-gains rate buckets kept only for column alignment:

**Schedule CYLA:**
- Row 13 (viia) — "Short-term capital gain taxable @ 15%" (limit `OsNormalIncome_Limit`)
- Row 18 (xia) — "Long term capital gain taxable @ 10%" (limit `Ltcg20PercentIncome_Limit`)
- Row 20 (xii) — "Long term capital gain taxable @ 20%" (limit `Stcg20PercentIncome_Limit`)

**Schedule BFLA:**
- Row 39 (via) — "Short-term capital gain taxable @ 15%"
- Row 44 (xa) — "Long term capital gain taxable @ 10%"
- Row 46 (xi) — "Long term capital gain taxable @ 20%"

None of these has a corresponding required schema leaf; they are excluded from the item tables above.

---

## What this means for the build

- Build **two fixed matrices**, not grids. CYLA has 14 live income-head rows (ii-xv, skipping the 3 hidden CG buckets) plus the loss-available row (i) and two total rows (xvi, xvii). BFLA has 14 live head rows (i-xiv) plus two total rows (xv, xvi). Wire the row-to-schema-block mapping exactly as tabled above; the CG rate buckets that survive are STCG@20%/@30%/app-rate/DTAA and LTCG@12.5%/DTAA (the six required blocks in each schedule).
- **Everything is computed and read-only**; the only interactive controls are the two edit-flag dropdowns (I28 `CYLAEditFlag`, I54 `BFLAEditFlag`, default "No"). When "Yes", auto-populated numbers become editable — but the schema shape is identical.
- **Enforce the set-off order** precisely: (1) column priority HP loss → business loss → other-sources loss; (2) OS normal loss is applied first to race-horse profit and OS-DTAA special-rate income before other heads; (3) every set-off is `MIN(income-available, loss-remaining)` capped so cols 2+3+4 ≤ col 1; (4) col 5 = col 1 − 2 − 3 − 4. In BFLA: BF loss → BF depreciation → BF s.35(4) allowance, and BF business loss / BF depreciation must skip 44BB/44BBD income.
- **Two hard caps**: HP total loss set off (CYLA 2xvi) ≤ ₹200000; and when the **new tax regime** is opted (`bacValue=1`), HP loss remaining after set-off (CYLA 2xvii) is forced to 0 — HP losses are not adjustable under the new regime.
- The N/M/O/P/Q helper "_Limit" and waterfall cells are internal scratch — compute them but never emit them to the return JSON; only the leaf keys tabled above are exported.
- Feed the totals onward: CYLA 2xvi/3xvi/4xvi and 2xvii/3xvii/4xvii → Part B-TI and Schedule CFL; BFLA 2xv/3xv/4xv → Part B-TI point 8; BFLA col-5 remaining incomes → Schedule SI / Part B-TI.
