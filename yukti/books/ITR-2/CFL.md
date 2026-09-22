# The book of Schedules CYLA · BFLA · CFL — the loss chain · ITR-2, A.Y. 2026-27

Read row by row from the utility's **CYLA – BFLA** sheet (54 rows) and **CFL**
sheet (25 rows), with the hidden-row flags, and confirmed against the CBDT
ITR-2 schema's `ScheduleCYLA`, `ScheduleBFLA` and `ScheduleCFL`. Nothing here is
invented.

---

## 1 · What the three schedules are, and the order they run in

These are one chain, and the order is fixed:

| Step | Schedule | What it does | Feeds |
|---|---|---|---|
| 1 | **CYLA** — current-year loss adjustment | sets **this year's** losses against **this year's** income, head by head | BFLA column 1 |
| 2 | **BFLA** — brought-forward loss adjustment | sets **earlier years'** losses (from CFL) against what is left after CYLA | Part B-TI gross total income |
| 3 | **CFL** — carry forward of losses | the ledger: what was brought in, what BFLA used, what this year added, what carries out | next year's CFL |

CYLA and BFLA are **required** blocks in the schema — they must be in every
ITR-2 JSON even at zero. CFL is optional but its two summary rows are required
once it is present.

Every one of the three is **computed by the utility** and then offered for
override: CYLA and BFLA each carry *"Do you want to edit the details
auto-populated in table above?"* with a Yes/No, and the schema carries
`EditAutopoulatedDetail` on both.

---

## 2 · The live rows — what ITR-2 actually has

The sheet ships the ITR-3 layout and **hides** what does not apply. The hidden
rows are the whole reason to read the sheet rather than guess:

| Row on the sheet | CYLA | BFLA | Why |
|---|---|---|---|
| Salaries | live | live | |
| House property | live | live | |
| Business income · speculative · specified business | **hidden** | **hidden** | ITR-2 has no business income |
| Short-term at **15%** | **hidden** | **hidden** | the pre-23-July-2024 rate; no such gain arises in FY 2025-26 |
| Short-term at 20% | live | live | |
| Short-term at 30% | live | live | |
| Short-term at applicable rates | live | live | |
| Short-term at DTAA rates | live | live | |
| Long-term at **10%** | **hidden** | **hidden** | pre-July rate |
| Long-term at 12.5% | live | live | |
| Long-term at **20%** | **hidden** | **hidden** | pre-July rate |
| Long-term at DTAA rates | live | live | |
| Net income from other sources at normal rates | live | live | |
| Profit from owning and maintaining race horses | live | live | |
| Other sources at DTAA rates | live | live | |

So the live set is **eleven heads**: salary, house property, six capital-gain
slots, and three other-sources lines. That is exactly the set the schema marks —
`STCG20Per`, `STCG30Per`, `STCGAppRate`, `STCGDTAARate`, `LTCG12_5Per`,
`LTCGDTAARate` are required on both CYLA and BFLA, and the other five are
optional objects.

---

## 3 · Schedule CYLA — current-year loss adjustment

### The shape

A matrix. **Rows are the heads of income. Columns are the three current-year
losses that can be set against them.**

| Column | Content | Source |
|---|---|---|
| 1 | Income of the current year — *fill only if zero or positive* | the head's own schedule |
| 2 | House-property loss of the current year set off | *Total loss — 4 of Schedule HP* |
| 3 | Business loss set off | *hidden on ITR-2* |
| 4 | Net loss from other sources at normal rates set off | *Total loss — 6 of Schedule OS* |
| 5 | Current year's income remaining after set-off | **computed** — 1 − 2 − 3 − 4 |

The first row is the special one:

| Row | Content |
|---|---|
| **i** | **Loss to be set off** — *fill only if the computed figure is negative* — the three losses go here, one per column |
| ii | Salaries |
| iii | House property |
| iv–ix | the six capital-gain slots |
| x | Net income from other sources at normal rates |
| xi | Profit from owning and maintaining race horses |
| xii | Other sources at DTAA rates |
| **xiii** | **Total loss set-off** (ii + … + xii) — **computed** |
| **xiv** | **Loss remaining after set-off** (i − xiii) — **computed**, goes to CFL as this year's loss |

### The rules the matrix enforces

**Which loss may go where** — the schema encodes this by which columns exist on
each row:

| Row | HP loss column? | OS loss column? | Rule |
|---|---|---|---|
| Salary | yes | yes | either loss may be set against salary |
| House property | **no** | yes | a house-property loss cannot be set against house-property income (it *is* that head) |
| the six CG slots | yes | yes | either loss against any capital gain |
| Other sources at normal rates | yes | **no** | an OS loss cannot go against OS income (same head) |
| Race horses | yes | yes | |
| OS at DTAA rates | yes | yes | |

**The ₹2,00,000 cap — section 71(3A).** A house-property loss may be set
against other heads only up to ₹2,00,000 in the year. Anything above goes
straight to CFL. *Under the new regime, none of it may be set against other
heads* — the whole HP loss carries forward, and (per the ITR-1 utility's own
formula) does not reduce gross total income at all.

**Only two losses enter CYLA on ITR-2** — house property and other sources at
normal rates. Capital losses never appear here; they are set within Schedule CG
(Table E) and carry via CFL. A race-horse loss never appears here either — it
goes to CFL on its own line.

**Order of set-off.** The utility sets the HP loss first, then the OS loss,
each against the heads in the row order above, top to bottom, until exhausted
or capped.

### Totals

| Key | Content |
|---|---|
| `TotalCurYr` | the two losses coming in — `TotHPlossCurYr`, `TotOthSrcLossNoRaceHorse` |
| `TotalLossSetOff` | how much of each was used — `TotHPlossCurYrSetoff`, `TotOthSrcLossNoRaceHorseSetoff` |
| `LossRemAftSetOff` | what is left of each — `BalHPlossCurYrAftSetoff`, `BalOthSrcLossNoRaceHorseAftSetoff` |

---

## 4 · Schedule BFLA — brought-forward loss adjustment

### The shape

Same eleven rows. Three columns:

| Column | Content |
|---|---|
| 1 | Income after set-off of current-year losses — *5 of Schedule CYLA* |
| 2 | Brought-forward loss set off |
| 3 | Brought-forward depreciation set off — *ITR-3; not on ITR-2* |
| 4 | Current year's income remaining after set-off — **computed** |

| Row | Content |
|---|---|
| i | Salaries — *no brought-forward loss may be set against salary; column 2 does not exist on this row* |
| ii | House property |
| iii–viii | the six capital-gain slots |
| ix | Net income from other sources at normal rates — *no brought-forward loss against it either* |
| x | Profit from race horses |
| xi | OS at DTAA rates — *no brought-forward loss against it* |
| **xii** | **Total of brought-forward loss set off** — **computed** |
| **xiii** | **Current year's income remaining after set-off** — the sum of column 4 — **computed**; this is the figure that becomes gross total income |

### The rules

**Which brought-forward loss may go where** — from the sheet's own tags in
column R (`HP`, `sTCG`, `LTCG`, `Maintain Horse`) and the schema's
`BFlossPrevYrUndSameHeadSetoff` on each row:

| Brought-forward loss | May be set against |
|---|---|
| House-property loss | house-property income only |
| Short-term capital loss | short-term **and** long-term capital gains — any of the six slots |
| Long-term capital loss | long-term capital gains only — the two long-term slots |
| Race-horse loss | race-horse income only |

**Oldest year first.** Losses are consumed in the order of the CFL table, the
earliest assessment year first, so nothing lapses that could have been used.

**No brought-forward loss against salary, OS at normal rates, or OS at DTAA
rates** — those rows have no column 2. The schema makes this exact: `Salary`,
`OthSrcExclRaceHorse` and `IncOSDTAA` carry only the two income fields.

---

## 5 · Schedule CFL — carry forward of losses

### The shape

A fixed table, **one row per assessment year**, eight years live, the earlier
years hidden because they have expired:

| Row | Assessment year | Schema key | Columns live |
|---|---|---|---|
| — | 2010-11 … 2017-18 | — | **hidden** — beyond eight years |
| i | 2018-19 | `LossCFFromPrev8thYearFromAY` | HP · STCL · LTCL |
| ii | 2019-20 | `LossCFFromPrev7thYearFromAY` | HP · STCL · LTCL |
| iii | 2020-21 | `LossCFFromPrev6thYearFromAY` | HP · STCL · LTCL |
| iv | 2021-22 | `LossCFFromPrev5thYearFromAY` | HP · STCL · LTCL |
| v | 2022-23 | `LossCFFromPrev4thYearFromAY` | HP · STCL · LTCL · **race horses** |
| vi | 2023-24 | `LossCFFromPrev3rdYearFromAY` | HP · STCL · LTCL · race horses |
| vii | 2024-25 | `LossCFFromPrev2ndYearFromAY` | HP · STCL · LTCL · race horses |
| viii | 2025-26 | `LossCFFromPrevYrToAY` | HP · STCL · LTCL · race horses |
| **ix** | **Total of earlier-year losses** | `TotalOfBFLossesEarlierYrs` | **computed** |
| **x** | **Adjustment of the above in Schedule BFLA** | `AdjTotBFLossInBFLA` | **computed** — what BFLA used |
| **xi** | **2026-27 — current-year losses** | `CurrentAYloss` | **computed** — xiv of CYLA, plus the unabsorbed capital losses from Table E, plus the race-horse loss from OS 8e |
| **xii** | **Total loss carried forward to future years** | `TotalLossCFSummary` | **computed** — ix − x + xi |

Per year, the columns:

| Column | Content | Rule |
|---|---|---|
| **Date of filing** | `DD/MM/YYYY` — the date the return for that year was filed | **required on every year that has a loss** — a loss carries only if that year's return was filed in time under 139(1) |
| House-property loss | | eight years |
| Business loss, speculative, specified | *hidden on ITR-2* | |
| Short-term capital loss | | eight years |
| Long-term capital loss | | eight years |
| Loss from owning and maintaining race horses | | **four years only** — the column exists on the last four rows and nowhere else; the schema makes it optional on 2022-23 to 2025-26 and absent on the earlier four |

### The rules

**Eight years for house-property and capital losses; four for race horses.**
The table is the rule — a year outside its window is not on the table.

**A loss carries forward only if the return for that year was filed within
the due date.** The date-of-filing column is how the department checks; it is
required whenever the row has a loss.

**The brought-forward capital loss is one figure per year per type.** The
utility does not split it by rate slot — that split is done in BFLA when it is
set off (short against any, long against long).

**The current-year row (xi) is not typed.** It is what CYLA left standing
(xiv), plus what Table E in Schedule CG left standing, plus the race-horse loss
from OS — under the heads they belong to.

---

## 6 · What flows where — the whole chain in one table

| Loss arising this year | Goes first to | Then | Carries via |
|---|---|---|---|
| House property (negative 3 of Schedule HP) | **CYLA** row i, HP column — against other heads up to ₹2,00,000 (nil under the new regime) | — | CFL xi, HP column, eight years |
| Other sources at normal rates (negative 6 of Schedule OS) | **CYLA** row i, OS column — against other heads, no cap | — | *does not carry* — an OS loss not set off in the year lapses |
| Short-term capital loss | **Schedule CG Table E** — against any capital gain | not in CYLA | CFL xi, STCL column, eight years |
| Long-term capital loss | **Schedule CG Table E** — against long-term gains only | not in CYLA | CFL xi, LTCL column, eight years |
| Race horses (negative 8e of Schedule OS) | nowhere this year | — | CFL xi, race-horse column, four years |

| Loss brought forward | Set off in BFLA against |
|---|---|
| House property | house-property income only |
| Short-term capital | any of the six capital-gain slots |
| Long-term capital | the two long-term slots |
| Race horses | race-horse income only |

---

## 7 · What is mandatory

**CYLA** — the six capital-gain slots, `TotalCurYr`, `TotalLossSetOff`,
`LossRemAftSetOff`; on every slot object, `IncOfCurYrUnderThatHead` and
`IncOfCurYrAfterSetOff`.

**BFLA** — salary, the six capital-gain slots, `IncomeOfCurrYrAftCYLABFLA`,
`TotalBFLossSetOff`; on every slot, `IncOfCurYrUndHeadFromCYLA`,
`IncOfCurYrAfterSetOffBFLosses`, and `BFlossPrevYrUndSameHeadSetoff` on the
rows that allow one.

**CFL** — `TotalOfBFLossesEarlierYrs` and `TotalLossCFSummary`; on any year
that is present, `DateOfFiling`; on 2022-23 onward, the three loss columns.

Salary, house property, the three other-sources rows and the eight year-rows
are written only when they carry a value.

---

## 8 · What repeats and what does not

Nothing repeats. CYLA and BFLA are fixed matrices of eleven rows. CFL is a fixed
table of eight years. The person's inputs are exactly:

- CFL — the date of filing and up to four loss figures per year, for the years
  that had a loss
- the two override switches on CYLA and BFLA, and the cells they unlock

Everything else is computed.

---

## 9 · What ITR-2 has here that ITR-1 does not

ITR-1 has none of this. It bars anyone with a loss to carry or bring forward.
The whole chain is new for ITR-2.

---

## 10 · What this means for the build

1. **Three sections on one screen** — CYLA, then BFLA, then CFL — in that order,
   because each feeds the next.
2. **CYLA is a matrix on the eleven live rows** with the two loss columns, the
   disallowed cells greyed (HP loss on the HP row, OS loss on the OS row), the
   ₹2 lakh cap and the new-regime bar applied to the HP column, and the
   sheet's override switch.
3. **BFLA is a matrix on the same rows** with one brought-forward column, the
   rows that allow none greyed (salary, OS normal, OS DTAA), oldest year first,
   short against any capital slot, long against long only, and the override
   switch.
4. **CFL is the eight-year table** with the date-of-filing column required on
   any row with a loss, the race-horse column only on the last four years, and
   the four computed rows — earlier-year total, BFLA adjustment, current-year
   loss, carried forward.
5. **The current-year row is assembled, not typed** — from CYLA xiv, Table E's
   unabsorbed losses, and OS 8e.
6. **The engine already does most of this** — the chain was ported from ITR-6.
   What changes is: the row set (eleven, not the ITR-6 set), the two override
   switches, the date-of-filing requirement, the four-year race-horse window,
   and writing every row to the schema's own keys rather than the totals only.
7. **Export** — `ScheduleCYLA` and `ScheduleBFLA` with every live row's object,
   `ScheduleCFL` with a year object for each year that has a loss, and the four
   summary objects.


# CYLA · BFLA · CFL — the build specification, from the ITR-2 utility's own code

Every rule below is taken from the utility's formulas on the **CYLA – BFLA**
and **CFL** sheets, the **House Property** helper cells they read, and the VBA
that auto-fills and validates them. The cell references are given so each
rule can be checked against the workbook. Nothing is taken from any other
form.

---

## 1 · The inputs the chain reads

| Named cell | Formula in the utility | What it is |
|---|---|---|
| `cyla.TotHPlossCurYr` (G6) | `ABS(MIN(HP.TotalIncomeChargeableUnHP, 0))` | this year's house-property loss, in full |
| `HP.REStwolakh` (HP N74) | `IF(bacValue=1, 0, MAX(HP.TotalIncomeChargeableUnHP, −200000))` | the part of that loss CYLA may use — **capped at ₹2,00,000; nil under the new regime** |
| `HP.REMloss` (HP N75) | `MAX(0, −HP.TotalIncomeChargeableUnHP − 200000)` | the part above ₹2,00,000 — goes straight to CFL |
| `cyla.TotOthSrcLossNoRaceHorse` (I6) | `ABS(MIN(os.BalanceNoRaceHorse, 0))` | this year's other-sources loss at normal rates |
| the eleven income cells (column F) | `MAX(0, …)` of each head's own schedule | income only if positive |
| `bacValue` | 1 = new regime, 2 = old | |

The six capital-gain income cells read **Table E of Schedule CG after its own
set-off** — `IHLA.E…_CurrYrCapGain` — so a capital loss never enters CYLA; it
was already set inside CG and its unused part goes to CFL.

---

## 2 · Schedule CYLA — the algorithm

### The eleven rows, in the order the utility fills them

The utility keeps a running "loss remaining" per column (the S chain for the
house-property loss, the U chain for the other-sources loss) and walks the
rows in a fixed order, at each row taking
`MIN(loss remaining, income of that row − whatever the other loss already took)`.

**House-property loss — order of set-off** (from the S/O formula chain):

| Order | Row | Formula |
|---|---|---|
| 1 | Salaries | `O8 = IF(S6 < income − OSsetoff, S6, income − OSsetoff)` |
| 2 | Net income from other sources at normal rates | `O22 = IF(S12 < income, S12, income)` |
| 3 | Profit from race horses | `O23 = IF(S22 < income − OSsetoff, S22, …)` |
| 4 | Short-term at 30% | `O15 = IF(S23 < income − OSsetoff, S23, …)` |
| 5 | Short-term at applicable rates | `O16 = IF(S15 < …)` |
| 6 | Short-term at 20% | VBA — *"STCG 20% newly added 19 Feb 25"* — `slotRem = MAX(0, income − OSsetoff − HPsetoff)`; take `MIN(setOffRem, slotRem)` |
| 7 | Long-term at 12.5% | VBA — *"LTCG 12.5% newly added 26 Feb 25"* — same pattern |
| 8 | Short-term at DTAA rates | same |
| 9 | Long-term at DTAA rates | same |
| 10 | Other sources at DTAA rates | same |

**Not a target:** the house-property row itself — `HP.IncCYLA` has no
`HPlossCurYrSetoff` field in the schema.

**Other-sources loss — order of set-off** (from the U/Q chain):

| Order | Row | Formula |
|---|---|---|
| 1 | **Profit from race horses** | `Q23 = IF(U6 < income, U6, income)` — the closest head goes first |
| 2 | Salaries | `Q8 = IF(U23 < income, U23, income)` |
| 3 | House property | `Q9 = IF(U8 < income, U8, income)` |
| 4 | Short-term at 30% | `Q15 = IF(U12 < income, U12, income)` |
| 5 | Short-term at applicable rates | `Q16 = IF(U15 < …)` |
| 6–10 | the Feb-25 slots and the DTAA rows | VBA, same pattern |

**Not a target:** the other-sources row itself — `OthSrcExclRaceHorse.IncCYLA`
has no `OthSrcLossNoRaceHorseSetoff` field.

### The totals

| Row | Formula | Meaning |
|---|---|---|
| xiii — total house-property loss set off | `G25 = MIN(SUM(G8, G12:G17, G19, G21:G24), cyla.TotHPlossCurYr, 200000)` | **never more than ₹2,00,000** |
| xiii — total other-sources loss set off | `I25 = SUM(I8:I12, I14:I17, I19, I21:I24)` | no cap |
| xiv — house-property loss remaining | `G26 = IF(bacValue=1, 0, IF(TotHPlossCurYrSetoff < 200000, MAX(0, (capped loss − G25) + HP.REMloss), HP.REMloss))` | what goes to CFL: the unabsorbed part of the capped loss plus the excess over ₹2 lakh — **nil under the new regime** |
| xiv — other-sources loss remaining | `I26 = MAX(0, TotOthSrcLoss − I25)` | shown, but **not carried** — there is no OS column in CFL; it lapses |
| column 5 on every row | `income − HPsetoff − OSsetoff`, rounded | feeds BFLA column 1 |

### The regime rule, exactly as the utility has it

Under the new regime (`bacValue = 1`):
- `HP.REStwolakh` is 0 → nothing is available to CYLA → **no set-off against any head**
- `G26` is 0 → **nothing carries to CFL either**

The utility's formulas give a new-regime house-property loss no path forward.
Yukti follows the utility.

### The override

`EditAutopoulatedDetail` Y/N. On Y the set-off cells become typeable and the
VBA validators run: each cell ≤ 14 digits, digits only; the row's set-off ≤ its
income; the column total ≤ the loss available (and ≤ ₹2,00,000 for house
property).

---

## 3 · Schedule BFLA — the algorithm

### The inputs

| Named cell | Source | What it is |
|---|---|---|
| column 1 on every row | `= column 5 of CYLA` (`F34 = J8` etc.) | income after current-year set-off |
| `totofbfloss.HPLossCF8` (CFL G22) | `SUM(G6:G21)` | brought-forward house-property loss, all eight years |
| `totofbfloss.STCGLossCF8` (CFL O22) | `SUM(O6:O21)` | brought-forward short-term capital loss |
| `totofbfloss.LTCGLossCF8` (CFL R22) | `SUM(R6:R21)` | brought-forward long-term capital loss |
| `totofbfloss.OthSrcLossRaceHorseCF8` (CFL U22) | `SUM(U16:U21)` | brought-forward race-horse loss, the live years only |

### Which loss goes where — from the formulas and the schema

| Brought-forward loss | Set against | Formula |
|---|---|---|
| House property | **house-property income only** | `O35 = IF(S35 < HP income, S35, HP income)` |
| Short-term capital | short-term at 30% first, then applicable, then 20%, then DTAA; **then the long-term slots, after the long-term loss has had them** | `O41 = IF(S41 < stcg30, …)`; `W41 = S41 − used`; `O42 = IF(W41 < stcgApp, …)`; the LTCG rows use the nested `AJ41 / AQ41 / AI48 / AK48` helpers |
| Long-term capital | **long-term at 12.5% and long-term DTAA only** | the `AJ/AK` helpers: LTCL goes first against each long-term slot; what is left of the slot may then take short-term loss |
| Race horses | **race-horse income only** | `O49 = IF(S49 < income, S49, income)` |

**No brought-forward loss against salary, other sources at normal rates, or
other sources at DTAA rates** — those rows compute `I = F` with no set-off
column (`I34 = F34`, `I50 = MAX(0, F50 − H50 − 0)` where H is the hidden
depreciation column).

**Oldest first** is implicit — the totals come from CFL where the earliest live
year is the first row, and the lapse rule in CFL (below) is what enforces it.

### The three validators the VBA runs on an override

| Validator | Rule | Message |
|---|---|---|
| `ValidateBFLA_STCG_MorethanCFL_STCG` | the set-off against short-term gains ≤ the short-term loss brought forward | *"Losses set off cannot be more than the losses brought forward from previous years in Schedule CFL."* |
| `ValidateBFLA_LTCG_Limit_CFL` | the set-off against long-term gains ≤ short-term **plus** long-term loss brought forward | same message |
| `ValidateBFLA_Maximum_losses_Notset_Total` | if loss is still available **and** income is still standing, the return is refused | *"Maximum losses has not been setoff"* |

The third one matters most: the utility does not let a person carry forward a
loss they could have used this year.

### The totals

| Row | Formula |
|---|---|
| xii — total brought-forward loss set off | `G51 = SUM(G35:G38, G40:G43, G45, G47:G50)` |
| xiii — income remaining after set-off | `I52 = SUM(I34:I50)` → **this is gross total income** |

---

## 4 · Schedule CFL — the algorithm

### The table

Eight live years, one row each, the older rows hidden:

| Row | Year | Columns live |
|---|---|---|
| i | 2018-19 | HP · STCL · LTCL |
| ii | 2019-20 | HP · STCL · LTCL |
| iii | 2020-21 | HP · STCL · LTCL |
| iv | 2021-22 | HP · STCL · LTCL |
| v | 2022-23 | HP · STCL · LTCL · race horses |
| vi | 2023-24 | HP · STCL · LTCL · race horses |
| vii | 2024-25 | HP · STCL · LTCL · race horses |
| viii | 2025-26 | HP · STCL · LTCL · race horses |

Per row the person enters the **date of filing** and the loss figures. The
`I = G + H` and `Q = O + P` formulas on each row are the hidden business
columns summing — nil on ITR-2.

### The four computed rows

| Row | Formula | Meaning |
|---|---|---|
| ix — total of earlier-year losses | `G22 = SUM(G6:G21)`, `O22`, `R22`, `U22 = SUM(U16:U21)` | brought forward, per column |
| x — adjustment in BFLA | `adjtotloss.*` — what BFLA used, per column | |
| xi — current-year losses | `G24 = sheet16.BalHPlossCurYrAftSetoff` (CYLA xiv) · `O24 = Σ Table E's unabsorbed short-term loss columns` · `R24 = Σ Table E's unabsorbed long-term loss columns` · `U24 = ABS(MIN(os.BalanceOwnRaceHorse, 0))` | assembled, not typed |
| xii — carried forward | see the lapse rule | |

### The lapse rule — the one thing the sheet does not say in words

`G25 = IF(CFL_HP_Normal_2018 > adjtotloss.HPLossCF9,
          MAX(0, total − CFL_HP_Normal_2018 + current),
          MAX(0, total − adjtotloss.HPLossCF9 + current))`

In words: **the 2018-19 loss is the eighth year. Whatever BFLA did not use of it
lapses.** So carried forward = total brought in − MAX(what BFLA used, the
2018-19 loss) + this year's loss. The same formula runs for short-term (`O25`)
and long-term (`R25`).

For race horses (`U25`) the same rule runs on **2022-23** — the fourth year —
because that column's window is four years.

---

## 5 · The chain, end to end

```
Schedule HP  ──── loss ──┐
                         │  capped 2L (old) / nil (new)        excess over 2L
Schedule OS  ── loss ────┤                                          │
                         ▼                                          │
                       CYLA  ── sets against the 11 heads ──► column 5 ──► BFLA col 1
                         │                                                    │
                    remaining HP ─────────────────────────────────────────────┼──► CFL row xi
                    remaining OS ──► lapses                                   │
                                                                              │
Schedule CG Table E ── unabsorbed STCL / LTCL ────────────────────────────────┼──► CFL row xi
Schedule OS 8e ── race-horse loss ────────────────────────────────────────────┘

CFL rows i–viii (brought forward) ──► totals ──► BFLA col 2 ──► BFLA col 4 ──► GROSS TOTAL INCOME
                                                     │
                                          what BFLA used ──► CFL row x
                                          the 8th / 4th year unused ──► lapses
                                          CFL row xii ──► next year's CFL
```

---

## 6 · What the person types, and what they do not

**Typed:**
- CFL — per year that had a loss: date of filing, and the figures in the live
  columns
- the two override switches on CYLA and BFLA, and the cells they unlock

**Everything else is computed** — the eleven income cells, both set-off
matrices, the CYLA and BFLA totals, CFL rows ix to xii.

---

## 7 · The build

1. **Engine — `engLoss()` rewritten to this document.** The eleven-row set; the
   two ordered walks for the two current-year losses with a running remaining
   per column; the ₹2,00,000 cap and the new-regime nil from `HP.REStwolakh`;
   the excess over 2 lakh straight to CFL; BFLA with HP→HP, STCL→short then
   long, LTCL→long only, race→race, the LTCL-first rule on the long slots; the
   CFL totals, the BFLA adjustment, the assembled current-year row, and the
   lapse rule on 2018-19 and 2022-23.
2. **Screen — one section, three parts in order.** CYLA as a matrix with the
   two loss columns, disallowed cells greyed, the override switch. BFLA as a
   matrix with one brought-forward column, the three rows without it greyed,
   the override switch, and the three validator messages shown live. CFL as the
   eight-year table with the date column required on any row with a loss, the
   race-horse column only on the last four rows, and rows ix–xii computed.
3. **Export** — `ScheduleCYLA` and `ScheduleBFLA` with every live row's object
   on the schema's keys and `EditAutopoulatedDetail`; `ScheduleCFL` with a year
   object for each year that carries a loss and the four summary objects.
   Validated against the schema before the file is written.
