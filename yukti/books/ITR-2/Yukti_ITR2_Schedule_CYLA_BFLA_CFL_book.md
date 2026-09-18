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
