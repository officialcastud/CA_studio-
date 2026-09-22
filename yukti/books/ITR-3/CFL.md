# The book of Schedule CFL — Carry forward of loss · ITR-3, A.Y. 2026-27

Read row by row from the ITR-3 utility's **CFL** sheet (rows 3–25 labelled;
88 blank helper rows hidden and unlabelled), with the hidden-row flags, its
formulas, its dropdowns, and confirmed against the CBDT ITR-3 schema block
`ScheduleCFL`. Item numbering is taken from `books/ITR-3/rules.json`, never from
counting rows. Nothing here is invented; every figure and rule is from ITR-3's
own sources. (The ITR-2 CFL book was used only as a style model.)

---

## The shape

Schedule CFL is the loss ledger: a fixed table with **one row per assessment
year** (sixteen years, 2010-11 to 2025-26) plus four computed summary rows —
total of earlier-year losses brought forward, the adjustment those losses
received in Schedule BFLA, the current-year (2026-27) losses to be carried
forward, and the total loss carried forward to future years. Across the top are
**ten loss columns** (column numbers 4–10, with the business column split into
sub-columns 5a/5b/5c) — ITR-3 keeps the business, speculative and specified-
business columns **live**, unlike ITR-2 which hides them. Every loss figure is
computed by the utility from CYLA/BFLA/CG/OS and offered as a ledger; the person
supplies only the per-year date of filing and the historic loss figures.

---

## The items

### Block `ScheduleCFL` — the header row (row 4) and the business sub-header (row 5)

| Sheet item no. | Field label | Type | Schema key | Rule / notes |
|---|---|---|---|---|
| Col (1) | Serial No. | display | — | row serial i…xx; not a data field |
| Col (2) | Assessment Year | display | — | fixed per row (2010-11 … 2026-27) |
| Col (3) | Date of Filing (DD/MM/YYYY) | date | `…CarryFwdLossDetail.DateOfFiling` | required on any year that carries a loss; format YYYY-MM-DD in schema, on or after 2010-04-01 |
| Col (4) | House property loss | integer | `…CarryFwdLossDetail.TotalHPPTILossCF` | 8-year carry (rows ix–xvi only) |
| Col (5) | Loss from business other than loss from speculative business and specified business | integer | `…CarryFwdLossDetail.BusLossOthThanSpecLossCF` | 5c = 5a − 5b |
| Col (5a) | Brought forward Business Loss | integer | `…CarryFwdLossDetail.BrtFwdBusLoss` | the raw brought-forward business loss |
| Col (5b) | Amount as adjusted on account of taxation u/s 115BAC(1A) | integer | `…CarryFwdLossDetail.AdjustAccTax115BACAmt` | reduction on opting for the new regime; must be 0 if new regime not selected |
| Col (5c) | Brought forward Business Loss available for set off during the year (5c=5a-5b) | integer | `…CarryFwdLossDetail.BusLossOthThanSpecLossCF` | 5c = 5a − 5b |
| Col (6) | Loss from speculative business | integer | `…CarryFwdLossDetail.LossFrmSpecBusCF` | 4-year carry (rows xiii–xvi only) |
| Col (7) | Loss from Specified business | integer | `…CarryFwdLossDetail.LossFrmSpecifiedBusCF` | u/s 35AD — carried forward indefinitely; the only column present on the earliest eight year-rows |
| Col (8) | Short-term capital loss | integer | `…CarryFwdLossDetail.TotalSTCGPTILossCF` | 8-year carry |
| Col (9) | Long-term Capital loss | integer | `…CarryFwdLossDetail.TotalLTCGPTILossCF` | 8-year carry |
| Col (10) | Loss from owning and maintaining race horses | integer | `…CarryFwdLossDetail.OthSrcLossRaceHorseCF` | 4-year carry (rows xiii–xvi only) |

### The year-rows and their schema blocks (rows 6–21)

Item numbers i…xvi come from the rules document; each maps to one detail block.

| Row / item | Assessment Year | Schema block | Columns the schema carries |
|---|---|---|---|
| i | 2010-11 | `LossCFFromPrev9thYearFromAY` | DateOfFiling · LossFrmSpecifiedBusCF only |
| ii | 2011-12 | `LossCFFromPrev8thYearFromAY` | DateOfFiling · LossFrmSpecifiedBusCF only |
| iii | 2012-13 | `LossCFFromPrev7thYearFromAY` | DateOfFiling · LossFrmSpecifiedBusCF only |
| iv | 2013-14 | `LossCFFromPrev6thYearFromAY` | DateOfFiling · LossFrmSpecifiedBusCF only |
| v | 2014-15 | `LossCFFromPrev5thYearFromAY` | DateOfFiling · LossFrmSpecifiedBusCF only |
| vi | 2015-16 | `LossCFFromPrev4thYearFromAY` | DateOfFiling · LossFrmSpecifiedBusCF only |
| vii | 2016-17 | `LossCFFromPrev3rdYearFromAY` | DateOfFiling · LossFrmSpecifiedBusCF only |
| viii | 2017-18 | `LossCFFromPrev2ndYearFromAY` | DateOfFiling · LossFrmSpecifiedBusCF only |
| ix | 2018-19 | `LossCFFromPrevYrToAY` | HP · business (5a/5b/5c) · specified · STCG · LTCG (no speculative, no race horses) |
| x | 2019-20 | `LossCFCurrentAssmntYear` | HP · business · specified · STCG · LTCG |
| xi | 2020-21 | `LossCFCurrentAssmntYear2021` | HP · business · specified · STCG · LTCG |
| xii | 2021-22 | `LossCFCurrentAssmntYear2022` | HP · business · specified · STCG · LTCG |
| xiii | 2022-23 | `LossCFCurrentAssmntYear2023` | full set incl. speculative & race horses |
| xiv | 2023-24 | `LossCFCurrentAssmntYear2024` | full set incl. speculative & race horses |
| xv | 2024-25 | `LossCFCurrentAssmntYear2025` | full set incl. speculative & race horses |
| xvi | 2025-26 | `LossCFCurrentAssmntYear2026` | full set incl. speculative & race horses |

Each year block wraps a single `CarryFwdLossDetail` object. The leaf keys used
across the year blocks are, verbatim: `DateOfFiling`, `TotalHPPTILossCF`,
`BrtFwdBusLoss`, `AdjustAccTax115BACAmt`, `BusLossOthThanSpecLossCF`,
`LossFrmSpecBusCF`, `LossFrmSpecifiedBusCF`, `TotalSTCGPTILossCF`,
`TotalLTCGPTILossCF`, `OthSrcLossRaceHorseCF`.

### The four summary rows (rows 22–25)

| Row / item | Field label | Schema block (wraps `LossSummaryDetail`) | Rule / notes |
|---|---|---|---|
| xvii | Total of earlier year losses b/f | `TotalOfBFLossesEarlierYrs` | computed — SUM of the year-rows per column |
| xviii | Adjustment of above losses in Schedule BFLA | `AdjTotBFLossInBFLA` | computed — what BFLA actually used |
| xix | 2026-27 (Current year losses to be carried forward) | `CurrentAYloss` | computed — this year's unabsorbed losses by head |
| xx | Total loss Carried Forward to future years | `TotalLossCFSummary` | computed — xvii − xviii + xix, floored at 0 |

Each summary block carries a `LossSummaryDetail` object whose leaf keys are,
verbatim: `TotalHPPTILossCF`, `BusLossOthThanSpecLossCF`, `LossFrmSpecBusCF`,
`LossFrmSpecifiedBusCF`, `TotalSTCGPTILossCF`, `TotalLTCGPTILossCF`,
`OthSrcLossRaceHorseCF`.

Row 3 is the schedule banner: **Schedule CFL — Details of Losses to be carried
forward to future Years**. Row 4 is the **CARRY FORWARD OF LOSS** column header.

---

## The rules the sheet computes

- **[I9]= G9+H9**, **[I10]= G10+H10** — house-property column roll-up per year
  (helper columns G+H → I).
- **[Q9]= O9+P9**, **[Q11]= O11+P11** — short-term capital-loss roll-up per year.
- **[T9]= R9+S9** — long-term capital-loss roll-up per year.
- **[L14]= MAX(0, yr2006.BusLossOthThanSpecLossCF9a − yr2006.BusLossOthThanSpecLossCF9b)**
  and the parallel **[L15]…[L21]** — column 5c (business loss available for set
  off) = MAX(0, 5a − 5b); the 115BAC(1A) adjustment (5b) is netted out, never
  below zero. Cross-year named refs `yr2006…yr2025`.
- **[G22]= SUM(G6:G21)** — xvii, total HP loss brought forward, all years.
- **[I22]= SUM(I6:I16)** — total of the HP helper roll-up.
- **[L22]= SUM(L14:L21)** — xvii, total business loss (5c) available.
- **[M22]= SUM(M13:M21)** — xvii, total speculative loss (4-year window).
- **[N22]= SUM(CFL.specifiedLoss, yr1999.BusLossSpecBus, yr2020.LossFrmSpecifiedBusCF10, yr2021.LossFrmSpecifiedBu…)**
  — xvii, total specified-business loss, summed across the indefinitely-carried
  years.
- **[O22]= SUM(O14:O21)** — xvii, total short-term capital loss.
- **[Q22]= SUM(Q6:Q16)** — total STCL helper roll-up.
- **[R22]= SUM(R14:R21)** — xvii, total long-term capital loss.
- **[T22]= SUM(T6:T16)** — total LTCL helper roll-up.
- **[U22]= SUM(U13:U21)** — xvii, total race-horse loss (4-year window).
- **[G24]= sheet16.BalHPlossCurYrAftSetoff** — xix, current-year HP loss = CYLA
  balance after set-off. (Also **[X24]= sheet16.BalHPlossCurYrAftSetoff**.)
- **[L24]= sheet16.BalBusLossAftSetoff** — xix, current-year business loss after
  CYLA set-off.
- **[M24]= ABS(MIN(0, sheet12.AdjustedPLFrmSpecuBus))** — xix, current-year
  speculative loss = |negative adjusted speculative P&L|.
- **[N24]= ABS(MIN(0, sheet12.AdjustedPLFrmSpecifiedBus))** — xix, current-year
  specified-business loss.
- **[O24]= IHLA.Eviii2_StclSetoff15Per + IHLA.Exii2_StclSetoff20Per + IHLA.Eviii3_StclSetoff30Per + IHLA.Eviii4_StclS…**
  — xix, current-year short-term capital loss = sum of Table E unabsorbed STCL
  across rate slots.
- **[R24]= IHLA.Eviii5_LtclSetOff10Per + IHLA.Exii8_LtclSetOff12.5Per + IHLA.Eviii6_LtclSetOff20Per + IHLA.Eviii8_Ltc…**
  — xix, current-year long-term capital loss = sum of Table E unabsorbed LTCL.
- **[U24]= ABS(MIN(0, os.BalanceOwnRaceHorse))** — xix, current-year race-horse
  loss from Schedule OS.
- **The lapse rule — [G25]** (HP): `IF(CFL_HP_Normal_2018 > adjtotloss.HPLossCF9,
  MAX(0, totofbfloss.HPLossCF8 − CFL_HP_Normal_2018 + yr2007.HPL…), …)` — the
  eighth-year (2018-19) loss lapses to the extent BFLA did not use it, so
  xx = brought-in − MAX(BFLA-used, eighth-year loss) + current-year loss, floored
  at 0. Parallel formulas: **[L25]** business (via `yr2006.BusLossOthThanSpecLossCF9`),
  **[M25]** speculative (window checked at `yr2022.LossFrmSpecBusCF12`),
  **[N25]= MAX(0, totofbfloss.LossFrmSpecifiedBusCF8 − adjtotloss.LossFrmSpecifiedBusCF9 + yr2007.LossFrmSpecifiedBu…)**
  specified business (no lapse — indefinite), **[O25]** short-term
  (`CFL_STCG_Normal_2018`), **[R25]** long-term (`CFL_LTCG_Normal_2018`), and
  **[U25]** race horses (window on `yr2022.OthSrcLossRaceHorseCF12`).
- From `rules.json`: **In Schedule CFL, Sl. No. 5c should be equal to 5a − 5b**;
  **at Sl. No. xx should be equal to xvii − xviii + xix; if negative, restrict to
  "0"**; **5b (Amount as adjusted on account of opting for taxation u/s 115BAC)
  should not be more than zero if New Tax Regime is not selected**; current-year
  speculative loss must equal Sl.No. B42 of Schedule BP; current-year specified
  loss must equal C48 of Schedule BP; STCL/LTCL must equal Table E of CG; HP,
  business and other-sources losses must equal the remaining-after-set-off
  figures at Schedule CYLA.

---

## Dropdowns

The utility exposes no value-list dropdowns on this sheet. The
`--dropdowns` dump returns only cell *default/constant* seeds, each with
`values: null` (no enumerated list to present):

- `G22:T23`, `H25:T25` seeded to `-99999999999999` (computed/summary cells).
- The bulk of the loss cells (e.g. `G8:G18`, `H8:I21`, `O7:O18`, `R6:R18`,
  `U10:U18`, and many more) seeded to `0`.
- `F6:F18`, `F19`, `F20:F21` (the Date-of-Filing column) seeded to `10`.
- `H24:U24` and `G24` (the current-year row) seeded to `0`.

There are no selectable enum values on Schedule CFL.

---

## What repeats and what is one figure

The table is a **fixed set of rows**, not a repeating array the user grows:
sixteen year-rows (each a distinct named schema block wrapping one
`CarryFwdLossDetail`) plus four summary rows (each a distinct named block
wrapping one `LossSummaryDetail`). Nothing repeats or is added dynamically —
every row is a single figure per column. The person's only inputs are, per
year that had a loss, the date of filing and the historic loss figures; every
summary row and the current-year (xix) row are computed.

---

## Mandatory

Block-level required keys: **`TotalLossCFSummary`** and
**`TotalOfBFLossesEarlierYrs`**.

Within each present year block, **`DateOfFiling`** is required. Within each of
the four summary blocks (`TotalOfBFLossesEarlierYrs`, `AdjTotBFLossInBFLA`,
`CurrentAYloss`, `TotalLossCFSummary`) all seven `LossSummaryDetail` leaves are
required: `TotalHPPTILossCF`, `BusLossOthThanSpecLossCF`, `LossFrmSpecBusCF`,
`LossFrmSpecifiedBusCF`, `TotalSTCGPTILossCF`, `TotalLTCGPTILossCF`,
`OthSrcLossRaceHorseCF`. The per-year loss figures are optional (written only
when non-zero).

---

## Hidden rows — not built

The `--sheet` dump prints **no row flagged `H`** among the labelled rows
(3–25): every labelled row is visible. The sheet's underlying grid has 88 blank
helper/spacer rows (115 total) with no labels and no schema mapping — these are
not items and are not built. Note that ITR-3, unlike ITR-2, keeps the business
(5), speculative (6) and specified-business (7) columns **visible and live**;
they are not hidden here.

---

## What this means for the build

1. **One fixed table**, sixteen year-rows + four computed summary rows, ten loss
   columns (business split 5a/5b/5c). No add/remove rows.
2. **Column windows differ by loss type** — HP, business (5c), STCG, LTCG carry
   **8 years** (rows ix–xvi, 2018-19 onward); speculative and race-horse losses
   carry **4 years** (rows xiii–xvi, 2022-23 onward); specified-business loss
   (35AD) carries **indefinitely** (the only column live on rows i–viii). Grey
   out cells outside a loss type's window.
3. **Date of filing required** on any year-row carrying a loss (a loss carries
   only if that year's return was filed within the 139(1) due date); render
   DD/MM/YYYY, store YYYY-MM-DD, not before 2010-04-01.
4. **5c = 5a − 5b, floored at 0**; 5b (115BAC(1A) adjustment) must be 0 unless
   the new regime is selected.
5. **The current-year row (xix) is assembled, not typed** — HP from CYLA
   balance, business from CYLA business balance, speculative and specified from
   Schedule BP adjusted P&L (must tie to B42/C48), STCL/LTCL from Schedule CG
   Table E unabsorbed columns, race horses from Schedule OS balance.
6. **The summary rows** — xvii = SUM of year-rows per column; xviii = what BFLA
   used (feeds from BFLA); xx = xvii − xviii + xix with the eighth-year /
   fourth-year lapse rule applied per column, floored at 0.
7. **Export** — `ScheduleCFL` with a year block for each year that carries a
   loss and all four summary blocks (`TotalOfBFLossesEarlierYrs`,
   `AdjTotBFLossInBFLA`, `CurrentAYloss`, `TotalLossCFSummary`), written to the
   schema's own keys and validated before the file is written.


## Additional visible rows — verbatim from the sheet (completeness)
Rows present on the utility sheet and captured here verbatim so every visible label is in the book:

- Schedule CFL
- Serial No. (1)
