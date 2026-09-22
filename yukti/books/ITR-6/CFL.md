# The book of Schedule CFL — carry forward of losses · ITR-6, A.Y. 2026-27

Read row by row from the utility's **CFL** sheet (`sheet32.xml`, 33 rows, 3
hidden), with the hidden-row flags, the helper columns and the sheet's own
formulas; confirmed against the CBDT ITR-6 schema's `ScheduleCFL`, and against
the validation-rules document (serials A556–A568, B14). Nothing here is
invented. Where the VBA is a compressed blob it is marked so; the readable
validator strings are quoted verbatim.

CFL is the third link of the loss chain. Schedules **CYLA** and **BFLA** run
before it (`books/ITR-6/CYLA_BFLA.md`); Schedule **UD** (unabsorbed depreciation
and the s.35(4) allowance) is a sibling ledger (`books/ITR-6/Unabsorbed_Depreciation.md`).

---

## 1 · What CFL is, and where it sits in the chain

Schedule CFL is the **ledger of losses that carry to future years**. It records,
per assessment year, the loss brought in; sums them; subtracts what Schedule
BFLA used this year; adds this year's fresh losses; and carries the balance out.
`C3` **Schedule CFL** · `F3` **Details of Losses to be carried forward to future
Years** · `C4` **CARRY FORWARD OF LOSS**.

The order is fixed: CYLA (current-year set-off) → BFLA (brought-forward set-off,
which reads CFL's earlier-year totals) → CFL (the ledger, which reads back what
BFLA used and adds this year's remaining losses).

---

## 2 · Column headers, verbatim (read the whole header — conditions live there)

The sheet's header spans rows 4–6. Column numbers are the rules document's
("4xix", "9xviii", …):

| Col | Sub | Cell | Header text (verbatim) |
|---|---|---|---|
| — | Sl.No | `D4` | **Sl. No.** |
| — | AY | `E4` | **Assessment Year** |
| — | Date | `F4` | **Date of Filing (DD/MM/ YYYY)** |
| **4** | 4a | `G4` | **House property loss** |
| 4 | 4b | `H4`/`H6` | **PTI house property loss** |
| 4 | 4c | `I4`/`I6` | **Total House property loss (4=4a+4b)** |
| **5** | 5a | `J4`/`J5`/`J6` | **Loss from business other than loss from insurance business, loss from speculative business and speci…** (…and specified business) — **Brought forward business loss** (`J5`) |
| 5 | 5b | `K5`/`K6` | **Amount as adjusted on account of opting for taxation under section 115BAA** |
| 5 | 5c | `L5`/`L6` | **Brought forward Business loss available for set off during the year** |
| **6** | | `M4` | **Loss from speculative business** |
| **7** | | `N4` | **Loss from Specified business** |
| **8** | | `O4` | **Loss from Life insurance business u/s 115B** |
| **9** | 9a | `P4` | **Short-term capital loss** |
| 9 | 9b | `Q6` | **9b** |
| 9 | 9c | `R6` | **9c** |
| **10** | 10a | `S4` | **Long-term Capital loss** |
| 10 | 10b | `T6` | **10b** |
| 10 | 10c | `U6` | **10c** |
| — | | `V4` | **Other sources loss (other than loss from race horses)** — display only; an OS loss does not carry forward |
| **11** | | `W4` | **Loss from owning and maintaining race horses** |

The `4c = 4a + 4b`, `9c`/`10c` and `5c = 5a − 5b` sub-columns are the total /
115BAA-adjusted forms; only 5b is ever typed (and only when the company opts for
115BAA — rule A564).

---

## 3 · The assessment-year rows (i–xvi) — sixteen years, and their schema keys

The table has **one row per assessment year, sixteen years live** (2010-11 …
2025-26). Sixteen — not eight — because a company's **specified-business
(s.35AD)** loss and **life-insurance (115B)** loss carry forward without the
eight-year cap, so the earliest years remain on the ledger. The per-year schema
keys are the confusingly-named `LossCF…` objects (each wraps a
`CarryFwdLossDetail`):

| Sl.No | Row | Assessment Year (col E, verbatim) | Schema key |
|---|---|---|---|
| i | r7 | **2010-11** | `LossCFFromPrev9thYearFromAY` |
| ii | r8 | **2011-12** | `LossCFFromPrev8thYearFromAY` |
| iii | r9 | **2012-13** | `LossCFFromPrev7thYearFromAY` |
| iv | r10 | **2013-14** | `LossCFFromPrev6thYearFromAY` |
| v | r11 | **2014-15** | `LossCFFromPrev5thYearFromAY` |
| vi | r12 | **2015-16** | `LossCFFromPrev4thYearFromAY` |
| vii | r13 | **2016-17** | `LossCFFromPrev3rdYearFromAY` |
| viii | r14 | **2017-18** | `LossCFFromPrev2ndYearFromAY` |
| ix | r15 | **2018-19** | `LossCFFromPrevYrToAY` |
| x | r16 | **2019-20** | `LossCFCurrentAssmntYear` |
| xi | r17 | **2020-21** | `LossCFCurrentAssmntYear2021` |
| xii | r18 | **2021-22** | `LossCFCurrentAssmntYear2022` |
| xiii | r19 | **2022-23** | `LossCFCurrentAssmntYear2023` |
| xiv | r20 | **2023-24** | `LossCFCurrentAssmntYear2024` |
| xv | r21 | **2024-25** | `LossCFCurrentAssmntYear2025` |
| xvi | r22 | **2025-26** | `LossCFCurrentAssmntYear2026` |

### Which loss columns are live per year — the carry-forward windows

The schema is the authority (the sheet leaves all sixteen rows visible, but the
schema exposes only the columns still within each loss's window):

| Loss type | Column | Window | Live from row |
|---|---|---|---|
| Specified-business (s.35AD) loss | 7 / `LossFrmSpecifiedBusCF` | **indefinite** | **every** year, i (2010-11) onward |
| Life-insurance u/s 115B loss | 8 / `LossFrmLifeInsBusUs115B` | 8 years | ix (2018-19) onward |
| House-property loss | 4 / `TotalHPPTILossCF` | 8 years | ix (2018-19) onward |
| Business loss (non-spec) | 5 / `BroughtFrwrdBusLoss` → `BroughtFrwdBusLossSetOffDrYr` | 8 years | ix (2018-19) onward |
| 115BAA adjustment to business loss | 5b / `AmtAdjAccOptTaxUs115BAA_115BA` | with the business loss | ix onward |
| Short-term capital loss | 9 / `TotalSTCGPTILossCF` | 8 years | ix (2018-19) onward |
| Long-term capital loss | 10 / `TotalLTCGPTILossCF` | 8 years | ix (2018-19) onward |
| Speculative-business loss | 6 / `LossFrmSpecBusCF` | 4 years | xiii (2022-23) onward |
| Race-horse loss | 11 / `OthSrcLossRaceHorseCF` | 4 years | xiii (2022-23) onward |

So the eight earliest rows (i–viii, 2010-11 … 2017-18) expose only the
**date of filing** and the **specified-business loss** — the only loss that
still lives that far back.

### The date-of-filing rule (required per year with a loss; VBA-enforced minimums)

`DateOfFiling` (`DD/MM/YYYY`) is **required on every year row** and is how the
department checks the loss was returned in time under s.139(1). The VBA sets a
minimum date per row (readable strings, quoted verbatim):

> "Date of Filing (2) in Sch CFL must not be less than 01/04/2011"; (3) 01/04/2012;
> (4) 01/04/2013; (5) 01/04/2014; (6) 01/04/2015; (7) 01/04/2016; (8) 01/04/2017;
> (9) 01/04/2018; (10) 01/04/2019; (11) 01/04/2020; (12) 01/04/2021; (13) 01/04/2022;
> (14) 01/04/2023; (15) 01/04/2025.

(The numbers in the VBA are the sheet's date-column index, offset from the Sl.No;
the rule is: the filing date for an assessment year cannot precede 1 April of
that year.) The rest of the CFL VBA is a compressed blob and did not resolve to
clear text.

---

## 4 · The summary rows (xvii–xxii) and their schema keys

| Sl.No | Row | Label (col E, verbatim) | Schema key | Formula / rule |
|---|---|---|---|---|
| xvii | r23 | **Total of earlier year losses b/f** | `TotalOfBFLossesEarlierYrs` | per column, sum of rows i–xvi; rule **A567** (total = sum of individual AY fields) |
| xiii | r24 | **Loss distributed among the unit holder (Applicable for Investment Fund only)** | `CurrentYearDistrUnitHolder` (partial) | **HIDDEN** — investment-fund only, nil for a company |
| xv | r25 | **Balance available of Total of earlier year b/f (xi-xii)** | — | **HIDDEN** — superseded balance line |
| xviii | r26 | **Adjustment of above losses in Schedule BFLA** | `AdjTotBFLossInBFLA` | = what BFLA used this year (BFLA col 2, per head, fed back) |
| xix | r27 | **2026-27 (Current year losses)** | `CurrentAYloss` | assembled from this year's schedules (see §5) |
| xx | r28 | **Current year loss distributed among the unit-holder (Applicable for Investment fund only)** | `CurrentYearDistrUnitHolder` | nil for a company |
| xxi | r29 | **Current year losses to be carried forward (xix-xx)** | `CurrentYearLossCF` | = xix − xx; rule **A566** |
| xxii | r30 | **Total loss Carried Forward to future years (xvii-xviii+xxi)** | `TotalLossCFSummary` | = xvii − xviii + xxi, floored at 0; rule **A568** |
| xviii | r31 | **Current year loss distributed among the unit-holder (Applicable for Investment fund only)** | — | **HIDDEN** — duplicate unit-holder line |

Each summary object wraps a `LossSummaryDetail` with these per-column leaf keys:
`TotalHPPTILossCF`, `BroughtFrwdBusLossSetOffDrYr`, `LossFrmSpecBusCF`,
`LossFrmSpecifiedBusCF`, `LossFrmLifeInsBusUs115B`, `TotalSTCGPTILossCF`,
`TotalLTCGPTILossCF`, `OthSrcLossRaceHorseCF` (the unit-holder object carries
only the HP/STCG/LTCG/race-horse subset).

---

## 5 · The current-year row (xix) is assembled, not typed

Rule-tied feeds for row xix (`CurrentAYloss`), each from this year's schedule:

| Loss (col) | Rule | Source |
|---|---|---|
| HP loss (4xix / `TotalHPPTILossCF`) | **A560** | = 2xvii of Schedule CYLA (HP loss remaining after CYLA) |
| Business loss (5 / `BroughtFrwdBusLossSetOffDrYr`) | — | Schedule BP Table E business loss remaining |
| Speculative loss (6 / `LossFrmSpecBusCF`) | **A556** | = "speculative loss" field of Schedule BP |
| Specified-business loss (7 / `LossFrmSpecifiedBusCF`) | **A557** | = "Income from specified business u/s 35AD" of Schedule BP |
| Life-insurance 115B loss (8 / `LossFrmLifeInsBusUs115B`) | **A562** | = 4b of Schedule BP |
| STCG loss (9xix / `TotalSTCGPTILossCF`) | **A558** | = Table E (2ix+3ix+4ix+5ix+6ix) of Schedule CG |
| LTCG loss (10xix / `TotalLTCGPTILossCF`) | **A559** | = Table E (6ix+7ix) of Schedule CG |
| Race-horse loss (11xix / `OthSrcLossRaceHorseCF`) | **A561** | = 8e of Schedule OS |

Additional rules:
- **A564**: 5b (`AmtAdjAccOptTaxUs115BAA_115BA`) can be entered **only if** the
  assessee opts for taxation u/s 115BAA.
- **A565**: 5c = 5a − 5b.
- **A566**: xxi = xix − xx. **A568**: xxii = xvii − xviii + xxi, restricted to 0
  if negative. **A567**: xvii total = sum of the individual AY fields.
- **B14** (category B): current-year losses should be **nil** if the return is
  filed under s.139(4) (belated return) — a belated filer cannot create a new
  carry-forward.

---

## 6 · Every schema leaf key (so nothing is lost on filing)

For each per-year object `LossCF…FromAY.CarryFwdLossDetail`: `DateOfFiling`
(required), and — within its window (§3) — `TotalHPPTILossCF`,
`BroughtFrwrdBusLoss`, `AmtAdjAccOptTaxUs115BAA_115BA`,
`BroughtFrwdBusLossSetOffDrYr`, `LossFrmSpecBusCF`, `LossFrmSpecifiedBusCF`,
`LossFrmLifeInsBusUs115B`, `TotalSTCGPTILossCF`, `TotalLTCGPTILossCF`,
`OthSrcLossRaceHorseCF`.

For each summary object `.LossSummaryDetail` (`TotalOfBFLossesEarlierYrs`,
`AdjTotBFLossInBFLA`, `CurrentAYloss`, `CurrentYearDistrUnitHolder`,
`CurrentYearLossCF`, `TotalLossCFSummary`): `TotalHPPTILossCF`,
`BroughtFrwdBusLossSetOffDrYr`, `LossFrmSpecBusCF`, `LossFrmSpecifiedBusCF`,
`LossFrmLifeInsBusUs115B`, `TotalSTCGPTILossCF`, `TotalLTCGPTILossCF`,
`OthSrcLossRaceHorseCF`.

No leaf is excluded — every column of every live year and every summary row has
a place on screen.

---

## 7 · The enums / dropdowns on this sheet

There are **no value-list dropdowns** on CFL. The data-validation entries are
all numeric constraints, not enums: `-99999999999999` (the 14-digit floor / the
"Cannot be greater than 14 digits" VBA check), and integer cells (`0`) and the
date cell (`10`, a date format). So there are no enum ranges to seed.

---

## 8 · What flows in and out (cross-sheet feeds)

**In (earlier-year rows i–xvi):** typed by the filer per year that had a loss —
the date of filing and the loss figures in the live columns.

**In (row xviii, the BFLA adjustment):** = what Schedule BFLA set off this year,
per head, fed back (BFLA col 2 totals; rules A528/A551/A554/A555).

**In (row xix, current-year losses):** assembled from CYLA 2xvii, Schedule BP,
Schedule CG Table E and Schedule OS 8e (§5).

**Out:** row xvii's per-column totals (`balAvlbl.*` / `totofbfloss.*`) are the
brought-forward pools that Schedule BFLA draws on (its col 2). Row xxii
(`TotalLossCFSummary`) is next year's opening carry-forward.

---

## 9 · What repeats and what does not

The sixteen year rows are a **fixed table**, not a repeatable array. Per year
the filer types the date of filing and up to nine loss figures. The six summary
rows and the 4c/5c/9c/10c derived sub-columns are all computed.

---

## 10 · What ITR-6 has here that ITR-2 does not

- **Sixteen assessment-year rows** (2010-11 … 2025-26), not eight — because the
  specified-business (s.35AD) and 115B life-insurance losses have no eight-year
  cap.
- Extra loss columns a company has: **business loss (5a)** with a **115BAA
  adjustment (5b)**, **speculative-business loss (6)**, **specified-business
  loss (7)**, **life-insurance 115B loss (8)** — none of these exist on ITR-2.
- A **unit-holder distribution** pair of rows (investment-fund only, nil for an
  ordinary company).

---

## 11 · What this means for the build

1. **CFL is the sixteen-year table** with the date-of-filing column required on
   any row with a loss (VBA per-row minimum dates), each loss column shown only
   within its window (§3), and the six computed summary rows.
2. **The current-year row (xix) is assembled, not typed** — from CYLA 2xvii,
   Schedule BP, Schedule CG Table E and Schedule OS 8e (§5), with the 115BAA
   adjustment gate (A564) and the belated-return bar (B14).
3. **Row xxii** = xvii − xviii + xxi, floored at 0 (A568) — next year's opening.
4. **Export** — `ScheduleCFL` with a per-year object for each year that carries a
   loss (its `CarryFwdLossDetail`, within-window columns only) and the six
   summary objects (each a `LossSummaryDetail`), validated against the schema.
