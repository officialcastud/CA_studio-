# The book of Schedules CYLA · BFLA — the current-year and brought-forward loss chain · ITR-3, A.Y. 2026-27

Read row by row from the utility's **CYLA - BFLA** sheet (`sheet25.xml`, 106
rows, 46 hidden) with the hidden-row flags, its formulas, its dropdowns, and the
VBA/rules text, and confirmed against the CBDT ITR-3 schema's `ScheduleCYLA` and
`ScheduleBFLA`. Item numbering (i, ii, …, xvii) is taken from the RULES document
(`books/ITR-3/rules.json`), not from counting rows. Nothing here is invented.

---

## The shape

Two stacked matrices that run in sequence. **Schedule CYLA** sets *this year's*
losses (house-property, business, other-sources) against *this year's* income,
head by head, and hands its column-5 remainder to BFLA. **Schedule BFLA** then
sets *earlier years'* brought-forward losses, depreciation and section-35(4)
allowance against what CYLA left, head by head; its final total becomes the
gross total income fed to Part B-TI. Both are computed by the utility and then
offered for override with a *"Do you want to edit the details auto-populated in
table above ?"* Yes/No, carried in the schema as `EditAutopoulatedDetail`.
Unlike ITR-2, ITR-3 keeps the **business, speculative and specified-business**
rows live (this form has business income); only the three superseded
capital-gain rate rows (@15% / @10% / @20%) are hidden.

---

## The items

### Schedule CYLA — CURRENT YEAR LOSS ADJUSTMENT

Rows are heads of income; columns are the current-year losses set against them.
Columns (row 4 headers): **1** Income of current year (Fill this column only if
income is zero or positive); **2** House property loss of the current year set
off; **3** Business Loss (other than speculation loss or specified business
loss) of the current year set off; **4** Other sources loss (other than loss
from owning race horses) of the current year set off; **5** Current year's
Income remaining after set off, computed **5 = 1 − 2 − 3 − 4** (cell J7).

Row **i** is the loss-source row — *Loss to be setoff (Fill this row only if
computed figure is negative)* — whose three cells carry Total loss (4 of
Schedule – HP), Total loss (2v of item E of Schedule BP), and Total loss (6 of
Schedule-OS).

| Sl.No | Head / Source of Income (field label) | Type | Schema block → key | Rule / notes |
|---|---|---|---|---|
| i | Loss to be setoff (fill only if computed figure is negative) | source row | `TotalCurYr` → `TotHPlossCurYr`, `TotBusLoss`, `TotOthSrcLossNoRaceHorse` | the three incoming losses; caps at cols 2/3/4 |
| ii | Salaries | income+setoff | `Salary.IncCYLA` → `IncOfCurYrUnderThatHead`, `HPlossCurYrSetoff`, `OthSrcLossNoRaceHorseSetoff`, `IncOfCurYrAfterSetOff` | no business-loss column (no col 3) |
| iii | House property | income+setoff | `HP.IncCYLA` → `IncOfCurYrUnderThatHead`, `BusLossSetoff`, `OthSrcLossNoRaceHorseSetoff`, `IncOfCurYrAfterSetOff` | no HP-loss column against own head (excluded from col-2 sum) |
| iv | Business Income (excluding speculation profit and income from specified business) or Profession | income+setoff | `BusProfExclSpecProf.IncCYLA` → `IncOfCurYrUnderThatHead`, `HPlossCurYrSetoff`, `OthSrcLossNoRaceHorseSetoff`, `IncOfCurYrAfterSetOff` | live on ITR-3; no col 3 against own head |
| v | Speculative Income | income+setoff | `SpeculativeInc.IncCYLA` → `IncOfCurYrUnderThatHead`, `HPlossCurYrSetoff`, `OthSrcLossNoRaceHorseSetoff`, `IncOfCurYrAfterSetOff` | |
| vi | Specified Business Income | income+setoff | `SpecifiedInc.IncCYLA` → `IncOfCurYrUnderThatHead`, `HPlossCurYrSetoff`, `OthSrcLossNoRaceHorseSetoff`, `IncOfCurYrAfterSetOff` | |
| vii | Short-term capital gain taxable @20% | income+setoff | `STCG20Per.IncCYLA` → `IncOfCurYrUnderThatHead`, `HPlossCurYrSetoff`, `BusLossSetoff`, `OthSrcLossNoRaceHorseSetoff`, `IncOfCurYrAfterSetOff` | required block |
| viii | Short-term capital gain taxable @ 30% | income+setoff | `STCG30Per.IncCYLA` → same four setoff/inc keys | required block |
| ix | Short-term capital gain taxable @ applicable rates | income+setoff | `STCGAppRate.IncCYLA` → same | required block |
| x | Short-term capital gain taxable at Special Rate in India as per DTAA | income+setoff | `STCGDTAARate.IncCYLA` → same | required block |
| xi | Long term capital gain taxable @ 12.5% | income+setoff | `LTCG12_5Per.IncCYLA` → same | required block |
| xii | Long-term capital gains taxable at Special Rate in India as per DTAA | income+setoff | `LTCGDTAARate.IncCYLA` → same | required block |
| xiii | Net Income From Other sources chargeable at Normal Applicable rates | income+setoff | `OthSrcExclRaceHorse.IncCYLA` → `IncOfCurYrUnderThatHead`, `HPlossCurYrSetoff`, `BusLossSetoff`, `IncOfCurYrAfterSetOff` | no OS-loss column against own head (no col 4) |
| xiv | Profit from activity of owning and maintaining race horse | income+setoff | `OthSrcRaceHorse.IncCYLA` → `IncOfCurYrUnderThatHead`, `HPlossCurYrSetoff`, `BusLossSetoff`, `OthSrcLossNoRaceHorseSetoff`, `IncOfCurYrAfterSetOff` | |
| xv | Income from Other sources taxable at special rates in India as per DTAA rates | income+setoff | `IncOSDTAA.IncCYLA` → `IncOfCurYrUnderThatHead`, `HPlossCurYrSetoff`, `BusLossSetoff`, `OthSrcLossNoRaceHorseSetoff`, `IncOfCurYrAfterSetOff` | |
| xvi | Total loss set-off | computed | `TotalLossSetOff` → `TotHPlossCurYrSetoff`, `TotBusLossSetoff`, `TotOthSrcLossNoRaceHorseSetoff` | col-2 total capped at 200000 |
| xvii | Loss remaining after set-off (i - xvi) | computed | `LossRemAftSetOff` → `BalHPlossCurYrAftSetoff`, `BalBusLossAftSetoff`, `BalOthSrcLossNoRaceHorseAftSetoff` | goes to CFL |
| — | Do you want to edit the details auto-populated in table above ? | dropdown | `EditAutopoulatedDetail` (Y/N) | |

### Schedule BFLA — BROUGHT FORWARD LOSS ADJUSTMENT

Same heads; columns (row 31 headers): **1** Income after set off, if any, of
current year's losses as per 5 of Schedule CYLA); **2** Brought forward loss set
off; **3** Brought forward depreciation set off; **4** Brought forward allowance
under section 35(4) set off; **5** Current year's income remaining after set off.

| Sl. No. | Head / Source of Income (field label) | Type | Schema block → key | Rule / notes |
|---|---|---|---|---|
| i | Salaries | income only | `Salary.IncBFLA` → `IncOfCurYrUndHeadFromCYLA`, `IncOfCurYrAfterSetOffBFLosses` | no brought-forward loss against salary (no col 2) |
| ii | House property | income+setoff | `HP.IncBFLA` → `IncOfCurYrUndHeadFromCYLA`, `BFlossPrevYrUndSameHeadSetoff`, `BFUnabsorbedDeprSetoff`, `BFAllUs35Cl4Setoff`, `IncOfCurYrAfterSetOffBFLosses` | HP loss (tag `HP`) against HP only |
| iii | Business Income (excluding speculation profit and income from specified business) | income+setoff | `BusProfExclSpecProf.IncBFLA` → same five keys | tag `BP` |
| iv | Speculation Income | income+setoff | `SpeculativeInc.IncBFLA` → same | tag `Spec BP` |
| v | Specified Business Income | income+setoff | `SpecifiedInc.IncBFLA` → same | tag `Spcif BP` |
| vi | Short-term capital gain taxable @ 20% | income+setoff | `STCG20Per.IncBFLA` → `IncOfCurYrUndHeadFromCYLA`, `BFlossPrevYrUndSameHeadSetoff`, `BFUnabsorbedDeprSetoff`, `BFAllUs35Cl4Setoff`, `IncOfCurYrAfterSetOffBFLosses` | required block; tag `sTCG` |
| vii | Short-term capital gain taxable @ 30% | income+setoff | `STCG30Per.IncBFLA` → same | required block |
| viii | Short-term capital gain taxable @ applicable rates | income+setoff | `STCGAppRate.IncBFLA` → same | required block |
| ix | Short-term capital gain taxable at special rates in India as per DTAA | income+setoff | `STCGDTAARate.IncBFLA` → same | required block |
| x | Long-term capital gain taxable @ 12.5% | income+setoff | `LTCG12_5Per.IncBFLA` → same | required block; tag `LTCG` |
| xi | Long term capital gains taxable at special rates in India as per DTAA | income+setoff | `LTCGDTAARate.IncBFLA` → same | required block |
| xii | Net Income from Other sources income chargeable at Normal Applicable Rates | income only | `OthSrcExclRaceHorse.IncBFLA` → `IncOfCurYrUndHeadFromCYLA`, `BFUnabsorbedDeprSetoff`, `BFAllUs35Cl4Setoff`, `IncOfCurYrAfterSetOffBFLosses` | no brought-forward loss against it (no col 2) |
| xiii | Profit from owning and maintaining race horses | income+setoff | `OthSrcRaceHorse.IncBFLA` → `IncOfCurYrUndHeadFromCYLA`, `BFlossPrevYrUndSameHeadSetoff`, `BFUnabsorbedDeprSetoff`, `BFAllUs35Cl4Setoff`, `IncOfCurYrAfterSetOffBFLosses` | tag `Maintain Horse` |
| xiv | Income from other sources income taxable at special rates in India as per DTAA | income only | `IncOSDTAA.IncBFLA` → `IncOfCurYrUndHeadFromCYLA`, `BFUnabsorbedDeprSetoff`, `BFAllUs35Cl4Setoff`, `IncOfCurYrAfterSetOffBFLosses` | no col 2 |
| xv | Total of brought forward loss set off (2ii + 2iii + 2iv + 2v + 2vi + 2vii + 2viii + 2ix + 2x + 2xi + …) | computed | `TotalBFLossSetOff` → `TotBFLossSetoff`, `TotUnabsorbedDeprSetoff`, `TotAllUs35cl4Setoff` | sums cols 2, 3, 4 |
| xvi | Current year's income remaining after set off Total (5i + 5ii + 5iii + 5iv + 5v + 5vi + 5vii + 5viii + 5ix + …) | computed | `IncomeOfCurrYrAftCYLABFLA` | this is the figure that becomes gross total income |
| — | Do you want to edit the details auto-populated in table above ? | dropdown | `EditAutopoulatedDetail` (Y/N) | |

---

## The rules the sheet computes

**CYLA — column 5 remainder.** `5 = 1 − 2 − 3 − 4` (cell J7); e.g. Salaries
`J8 = ROUND(IncOfCurYrUnderThatHead − HPlossCurYrSetoff − OthSrcLossNoRaceHorseSetoff, 0)`.

**CYLA — the three incoming losses (row i).** House-property loss
`G6 = ABS(MIN(HP.TotalIncomeChargeableUnHP,0))`; business loss
`H6 = ABS(MIN(sheet12.NetPLBusOthThanSpec7A7B7C + MAX(sheet12.AdjustedPLFrmSpecuBus,0)+…,0))`;
other-sources loss `I6 = ABS(MIN(os.BalanceNoRaceHorse + MAX(0,0),0))`.

**CYLA — income sources of column 1** (each capped at zero, positive only):
Salaries `F8 = (SAL.IncomeFromSalary1)`; House property
`F9 = MAX(0,HP.TotalIncomeChargeableUnHP)`; Business
`F10 = MAX(0,sheet12.NetPLBusOthThanSpec7A7B7C)`; Speculative
`F11 = MAX(0,sheet12.IncOfCurYrAfterSetOffa)`; Specified
`F12 = MAX(0,sheet12.IncOfCurYrAfterSetOffb)`; STCG @20%
`F14 = MAX(0,IHLA.Eiii7_CurrYrCapGain20)`; STCG @30%
`F15 = MAX(0,IHLA.Eiii7_CurrYrCapGain)`; STCG applicable
`F16 = MAX(0,IHLA.Eiv7_CurrYrCapGain)`; STCG DTAA
`F17 = MAX(0,IHLA.Ev7_DTAArates)`; LTCG @12.5%
`F19 = MAX(0,IHLA.Eviii7_CurrYrCapGain12)`; LTCG DTAA
`F21 = MAX(0,IHLA.E_LTCGv7_DTAArates)`; OS normal
`F22 = MAX(0,os.BalanceNoRaceHorse)`; race horse
`F23 = MAX(0,os.BalanceOwnRaceHorse)`; OS DTAA `F24 = MAX(0,os.DTAA_Amt)`.

**CYLA — totals (row xvi).** HP set-off `G25 = SUM(G8,G10:G24)` (excludes G9,
i.e. HP against HP); business set-off `H25 = SUM(H9,H13:H24)`; OS set-off
`I25 = SUM(I8:I21,I23:I24)` (excludes I22, OS against OS).

**CYLA — loss remaining (row xvii).** HP
`G26 = IF(bacValue=1,0,IF(sheet16.TotHPlossCurYrSetoff<200000, MAX(0,((cyla.TotHPlossCurYr1−G25)+(HP.REMloss…))),…))`
— under the New Regime (`bacValue=1`) the whole HP loss carries forward and none
is set against other heads; business `H26 = MAX(0,(cyla.TotBusLoss−H25))`;
OS `I26 = MAX(0,(cyla.TotOthSrcLossNoRaceHorse−I25))`.

**CYLA — the ₹2,00,000 cap (section 71(3A)).** The schema caps
`TotalLossSetOff.TotHPlossCurYrSetoff` at **maximum 200000**; rules echo it —
"In schedule CYLA, Sl.No. 2xvi cannot be more than Rs. 200000." Anything above
carries forward.

**CYLA — order of set-off / which loss where.** "Normal OS loss should be set
off first against the (i) Profit from owning and maintaining race horses & (ii)
Income from other sources taxable at special rates as per DTAA"; "whole House
property loss can be setoff against any head of income in case income is more
than loss"; "whole business loss …"; "whole OS loss …"; and "sum of column no
2 + 3 + 4 should not exceed amount as referred in column 1." Column tags in
N/O/P/R/S/T carry the running remaining-set-off (`Remaining Set off HP Loss`,
`Remaining Set off BP`, `Remaining Setoff OS`).

**BFLA — column 1 comes from CYLA column 5.** Salaries
`F34 = IF(MID(sheet1.Status,1,1)="I", salary.IncOfCurYrAfterSetOff1, 0)`; HP
`F35 = (J9)`. Rules 2965–3070: BFLA 1i = CYLA 5ii, 1ii = 5iii, 1iii = 5iv,
1iv = 5v, 1v = 5vi, 1vi = 5vii, 1vii = 5viii, 1viii = 5ix, 1ix = 5x, 1x = 5xi,
1xi = 5xii, 1xii = 5xiii, 1xiii = 5xiv, 1xiv = 5xv.

**BFLA — brought-forward loss set-off comes from CFL** (column S "From CFL"):
HP `S35 = totofbfloss.HPLossCF8`; business `S36 = totofbfloss.BusLossOthThanSpecLossCF8`;
spec-business `S37 = totofbfloss.LossFrmSpecBusCF8`; specified
`S38 = totofbfloss.LossFrmSpecifiedBusCF8`; STCG `S41 = totofbfloss.STCGLossCF8`;
LTCG `S44 = totofbfloss.LTCGLossCF8`; race horse `S49 = totofbfloss.OthSrcLossRaceHorseCF8`.
STCL may set against STCG and LTCG; LTCL against LTCG only (formulas O44/O46/W46
gate LTCG set-off on remaining STCG capacity).

**BFLA — column 5 and totals.** Row per-head `J = MAX(0,(F − G − H − I))`
(e.g. `J35 = MAX(0,(F35−G35−H35−I35))`); row xv
`G51 = SUM(G35:G50)`, `H51 = SUM(H35:H50)`, `I51 = SUM(I35:I50)`; row xvi
`J52 = SUM(J34:J50)`. Rules: "Col No. 5 … should be equal to Col No. 1−2−3−4";
"sum of column no 2 + 3 + 4 should not exceed amount as referred in column 1";
"amount mentioned at Sl.No.5 should not exceed the amount mentioned at Sl.No.1".

**Cross-sheet ties (rules.json).** Losses of current year set off in Part B-TI =
CYLA "Total loss set off"; brought-forward losses set off in Part B-TI = BFLA
"Total of brought forward losses set off"; BFLA rows 5vi–5xiv feed Schedule SI
and Schedule CG Table F breakups; Brought forward depreciation set off and
allowance u/s 35(4) set off must equal Schedule UD.

---

## Dropdowns

- **I28** (CYLA edit flag) — source `"No,Yes"` → values: **No**, **Yes**.
- **I55** (BFLA edit flag) — named range `CYLA_TempEdit` → values: **Yes**, **No**.

Both feed the schema string `EditAutopoulatedDetail` (enum Y, N). The default
shown in the utility is **No**. The numeric data cells (col 1–5 across both
tables) carry dropdown `source "0"` — a plain numeric input, no picklist.

---

## What repeats and what is one figure

Nothing repeats — there are **no arrays** in either schedule. Each head is a
single named object (`Salary`, `HP`, `BusProfExclSpecProf`, `SpeculativeInc`,
`SpecifiedInc`, `STCG20Per`, `STCG30Per`, `STCGAppRate`, `STCGDTAARate`,
`LTCG12_5Per`, `LTCGDTAARate`, `OthSrcExclRaceHorse`, `OthSrcRaceHorse`,
`IncOSDTAA`) holding one `IncCYLA` / `IncBFLA` object of single integer fields.
The totals (`TotalCurYr`, `TotalLossSetOff`, `LossRemAftSetOff`,
`TotalBFLossSetOff`, `IncomeOfCurrYrAftCYLABFLA`) are single figures.

---

## Mandatory (schema `required` keys)

- **ScheduleCYLA** required blocks: `STCG20Per`, `STCG30Per`, `STCGAppRate`,
  `STCGDTAARate`, `LTCG12_5Per`, `LTCGDTAARate`, `TotalCurYr`,
  `TotalLossSetOff`, `LossRemAftSetOff`. Within every present head,
  `IncOfCurYrUnderThatHead` and `IncOfCurYrAfterSetOff` are required. Totals'
  leaves all required: `TotHPlossCurYr`, `TotBusLoss`, `TotOthSrcLossNoRaceHorse`,
  `TotHPlossCurYrSetoff`, `TotBusLossSetoff`, `TotOthSrcLossNoRaceHorseSetoff`,
  `BalHPlossCurYrAftSetoff`, `BalBusLossAftSetoff`, `BalOthSrcLossNoRaceHorseAftSetoff`.
  (`Salary`, `HP`, `BusProfExclSpecProf`, `SpeculativeInc`, `SpecifiedInc`,
  `OthSrcExclRaceHorse`, `OthSrcRaceHorse`, `IncOSDTAA`, `EditAutopoulatedDetail`
  are optional objects.)
- **ScheduleBFLA** required blocks: `Salary`, `STCG20Per`, `STCG30Per`,
  `STCGAppRate`, `STCGDTAARate`, `LTCG12_5Per`, `LTCGDTAARate`,
  `TotalBFLossSetOff`, `IncomeOfCurrYrAftCYLABFLA`. Within every present head,
  `IncOfCurYrUndHeadFromCYLA`, `BFUnabsorbedDeprSetoff`, `BFAllUs35Cl4Setoff` and
  `IncOfCurYrAfterSetOffBFLosses` are required; `BFlossPrevYrUndSameHeadSetoff`
  is optional (and absent from Salary, OthSrcExclRaceHorse, IncOSDTAA). Totals'
  leaves required: `TotBFLossSetoff`, `TotUnabsorbedDeprSetoff`, `TotAllUs35cl4Setoff`.

---

## Hidden rows — not built

These rows are marked **H** in the utility dump and carry no schema key; they are
the superseded pre-23-July-2024 capital-gain rate slots. They must never appear
as items — only recorded here.

| Sheet row | Sheet Sl.No. | Label | Schedule | Why hidden |
|---|---|---|---|---|
| r13 | viia | Short-term capital gain taxable @ 15% | CYLA | pre-23-July-2024 STT rate; no such gain in FY 2025-26 |
| r18 | xi | Long term capital gain taxable @ 10% | CYLA | pre-July LTCG rate, superseded |
| r20 | xii | Long term capital gain taxable @ 20% | CYLA | pre-July LTCG rate, superseded |
| r39 | via | Short-term capital gain taxable @ 15% | BFLA | pre-July STT rate |
| r44 | xa | Long term capital gain taxable @ 10% | BFLA | pre-July LTCG rate |
| r46 | xi | Long term capital gain taxable @ 20% | BFLA | pre-July LTCG rate |

The schema has no `STCG15Per`, `LTCG10Per` or `LTCG20Per` object — confirming
these rows are not to be built.

---

## What this means for the build

- Build **fourteen income heads** in CYLA and BFLA, in the row order above; do
  not build the three hidden rate rows. The six capital-gain slots present are
  STCG @20% / @30% / applicable / DTAA and LTCG @12.5% / DTAA — the required set.
- CYLA is a 5-column matrix (income, HP-loss, business-loss, OS-loss, remainder)
  with column 5 = 1 − 2 − 3 − 4; BFLA is a 5-column matrix (income-from-CYLA,
  BF-loss, BF-depreciation, BF-35(4)-allowance, remainder).
- Respect the missing-column pattern exactly: CYLA salary has no business-loss
  column; CYLA house-property row is excluded from the HP-loss total; CYLA
  OS-normal row has no OS-loss column. BFLA salary, OS-normal and OS-DTAA rows
  have no brought-forward-loss column (schema drops `BFlossPrevYrUndSameHeadSetoff`
  there).
- Enforce the **₹2,00,000 cap** on `TotHPlossCurYrSetoff`, and zero all HP
  set-off under the New Regime (`bacValue=1`), carrying the whole HP loss forward.
- Both schedules are utility-computed; wire the `EditAutopoulatedDetail` Yes/No
  override on each, default **No**. BFLA column 1 must equal CYLA column 5,
  head-by-head per rules 2965–3070; BFLA's final `IncomeOfCurrYrAftCYLABFLA`
  feeds Part B-TI gross total income.
