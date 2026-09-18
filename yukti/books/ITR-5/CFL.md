# CFL — Schedule CFL (ITR-5, A.Y. 2026-27)

Block: `ScheduleCFL` · Sheet tab: **CFL** · Section: `loss` (per `section_map.json`).
Header: **Schedule CFL — Details of Losses to be carried forward to future Years** ([C3]/[F3]), sub-title **CARRY FORWARD OF LOSS** ([C4]).

All figures below are quoted from `tools/dump.py` (rows, `--formulas`, `--dropdowns`, `--schema/--leaves ScheduleCFL`) and `books/ITR-5/rules.json`. Nothing here is from memory.

---

## The shape

Schedule CFL is a **two-axis matrix**: one **row per assessment year** (the years from which losses are being brought forward) crossed with one **column per loss head** (the loss types that may be carried forward). Each intersection is one figure.

- **Row axis (Sl. No. i–xxii, cells D7:E30, `E` = Assessment Year label):**
  - Rows **i–xvi** (E7:E22) = the sixteen brought-forward assessment years **2010-11 … 2025-26**, one schema object each.
  - Row **xvii** (E23) = **Total of earlier year losses b/f** (sum of the per-AY rows).
  - Row **xviii** (E26) = **Adjustment of above losses in Schedule BFLA** (what got set off this year, pulled from BFLA).
  - Row **xix** (E27) = **2026-27 (Current year losses)** — the loss arising in the current year, pulled from the head schedules.
  - Row **xx** (E28) = **Current year loss distributed among the unit-holder** (Investment Fund only).
  - Row **xxi** (E29) = **Current year losses to be carried forward (xix-xx)**.
  - Row **xxii** (E30) = **Total loss Carried Forward to future years**.
- **Column axis (loss heads, columns F–W):** Date of Filing, House property loss (4), Business loss other than speculative/specified/insurance (5a/5b/5c), Speculative business (6), Specified business (7), Life insurance u/s 115B (8), Short-term capital loss (9), Long-term capital loss (10), Loss from owning and maintaining race horses (11).

Which columns are live depends on the AY row (a loss expires after its statutory carry-forward window), so the schema exposes **different leaf sets per year** — see "The items — row axis" for the three tiers.

The whole block is **one figure each** — there are no add-more repeaters anywhere in Schedule CFL.

---

## The items — row axis (each AY = one schema object)

Every AY row maps to its own object under `ScheduleCFL`, each holding a single `CarryFwdLossDetail` (per-AY rows) or `LossSummaryDetail` (summary rows) object. `*` marks schema-required.

| Sl.No | Cell | Assessment Year / label | Schema object | Leaf set (tier) |
|---|---|---|---|---|
| i | E7 | 2010-11 | `LossCFFromPrev9thYearFromAY.CarryFwdLossDetail` | Tier-1 |
| ii | E8 | 2011-12 | `LossCFFromPrev8thYearFromAY.CarryFwdLossDetail` | Tier-1 |
| iii | E9 | 2012-13 | `LossCFFromPrev7thYearFromAY.CarryFwdLossDetail` | Tier-1 |
| iv | E10 | 2013-14 | `LossCFFromPrev6thYearFromAY.CarryFwdLossDetail` | Tier-1 |
| v | E11 | 2014-15 | `LossCFFromPrev5thYearFromAY.CarryFwdLossDetail` | Tier-1 |
| vi | E12 | 2015-16 | `LossCFFromPrev4thYearFromAY.CarryFwdLossDetail` | Tier-1 |
| vii | E13 | 2016-17 | `LossCFFromPrev3rdYearFromAY.CarryFwdLossDetail` | Tier-1 |
| viii | E14 | 2017-18 | `LossCFFromPrev2ndYearFromAY.CarryFwdLossDetail` | Tier-1 |
| ix | E15 | 2018-19 | `LossCFFromPrevYrToAY.CarryFwdLossDetail` | Tier-2 |
| x | E16 | 2019-20 | `LossCFCurrentAssmntYear.CarryFwdLossDetail` | Tier-2 |
| xi | E17 | 2020-21 | `LossCFCurrentAssmntYear2021.CarryFwdLossDetail` | Tier-2 |
| xii | E18 | 2021-22 | `LossCFCurrentAssmntYear2022.CarryFwdLossDetail` | Tier-2 |
| xiii | E19 | 2022-23 | `LossCFCurrentAssmntYear2023.CarryFwdLossDetail` | Tier-3 |
| xiv | E20 | 2023-24 | `LossCFCurrentAssmntYear2024.CarryFwdLossDetail` | Tier-3 |
| xv | E21 | 2024-25 | `LossCFCurrentAssmntYear2025.CarryFwdLossDetail` | Tier-3 |
| xvi | E22 | 2025-26 | `LossCFCurrentAssmntYear2026.CarryFwdLossDetail` | Tier-3 |
| xvii | E23 | Total of earlier year losses b/f | `TotalOfBFLossesEarlierYrs.LossSummaryDetail` | Summary |
| xviii | E26 | Adjustment of above losses in Schedule BFLA | `AdjTotBFLossInBFLA.LossSummaryDetail` | Summary |
| xix | E27 | 2026-27 (Current year losses) | `CurrentAYloss.LossSummaryDetail` | Summary |
| xx | E28 | Current year loss distributed among the unit-holder (Applicable for Investment fund only) | `CurrentYearDistrUnitHolder.LossSummaryDetail` | Distr. |
| xxi | E29 | Current year losses to be carried forward (xix-xx) | `CurrentYearLossCF.LossSummaryDetail` | Summary |
| xxii | E30 | Total loss Carried Forward to future years | `TotalLossCFSummary.LossSummaryDetail` | Summary |

### The three per-AY leaf tiers (which loss heads a year may still carry)

The `CarryFwdLossDetail` object exposes a **different set of leaves depending on the AY**, mirroring the statutory carry-forward windows:

- **Tier-1 — AY 2010-11 … 2017-18 (rows i–viii):** only two leaves.
  `*DateOfFiling` (string, `YYYY-MM-DD`) · `LossFrmSpecifiedBusCF` (integer, min 0, max 99999999999999).
  Only **specified-business loss (35AD, col 7)** survives from these old years — it has no time limit; the 8-year loss heads have lapsed.
- **Tier-2 — AY 2018-19 … 2021-22 (rows ix–xii):**
  `*DateOfFiling` · `*TotalHPPTILossCF` · `BrtFwdBusLoss` · `AdjustAccTax115BADAmt` · `BusLossOthThanSpecLossCF` · `LossFrmSpecifiedBusCF` · `*TotalSTCGPTILossCF` · `*TotalLTCGPTILossCF`.
  Adds HP, business (5a/5b/5c), STCG and LTCG. **No** speculative and **no** race-horse leaf.
- **Tier-3 — AY 2022-23 … 2025-26 (rows xiii–xvi):** the full head set.
  `*DateOfFiling` · `TotalHPPTILossCF` · `BrtFwdBusLoss` · `AdjustAccTax115BADAmt` · `BusLossOthThanSpecLossCF` · `LossFrmSpecBusCF` · `LossFrmSpecifiedBusCF` · `TotalSTCGPTILossCF` · `TotalLTCGPTILossCF` · `OthSrcLossRaceHorseCF`.
  Adds speculative (`LossFrmSpecBusCF`) and race-horse (`OthSrcLossRaceHorseCF`). Here only `DateOfFiling` is required.

Summary rows (xvii, xviii, xix, xxi, xxii) each carry a `LossSummaryDetail` with the full head set: `TotalHPPTILossCF`, `BusLossOthThanSpecLossCF`, `LossFrmSpecBusCF`, `LossFrmSpecifiedBusCF`, `TotalSTCGPTILossCF`, `TotalLTCGPTILossCF`, `OthSrcLossRaceHorseCF` (no `DateOfFiling`, no business 5a/5b split). Row **xx** `CurrentYearDistrUnitHolder.LossSummaryDetail` carries only `*TotalHPPTILossCF`, `*TotalSTCGPTILossCF`, `*TotalLTCGPTILossCF`, `OthSrcLossRaceHorseCF`.

---

## The items — column axis (each loss head)

Column-to-schema-leaf mapping, from the leaf order (which follows the visible column order left-to-right) and the summary-row formulas. Leaf lives under `CarryFwdLossDetail` (per-AY) or `LossSummaryDetail` (summary rows).

| Col | Sheet head (row 4 / sub-heads rows 5-6) | Type | Schema leaf key | Rule / note |
|---|---|---|---|---|
| F | Date of Filing (dd/mm/yyyy) | date | `DateOfFiling` | Required on every AY row; `YYYY-MM-DD` in the return. Date validation (F7:F22), not an enum. |
| G | House property loss (col 4) | integer | `TotalHPPTILossCF` | Primary HP carry value; used by all summary formulas (G23, G26, G27, G29, G30). |
| H | 4b | integer | *(no distinct leaf)* | PTI HP sub-column; folded into the single `TotalHPPTILossCF`. |
| I | 4c | integer | *(no distinct leaf)* | `I=MAX(0,G+H)` (rows 9,10 only) — vestigial total column, not summed. |
| J | Brought forward business loss (5a) | integer | `BrtFwdBusLoss` | — |
| K | Amount as adjusted on account of opting for taxation under section 115BAD or 115BAC(1A) (5b) | integer | `AdjustAccTax115BADAmt` | Must be `0` if not opting 115BAD (rule 567). |
| L | Brought forward Business loss available for set off during the year (5c) | integer | `BusLossOthThanSpecLossCF` | `L=MAX(0,J-K)` i.e. 5c = 5a − 5b (rules 568, formula L15/L19-L22). |
| M | Loss from speculative business (col 6) | integer | `LossFrmSpecBusCF` | Tier-3 rows and summaries only. |
| N | Loss from Specified business (col 7) | integer | `LossFrmSpecifiedBusCF` | The only head carried from Tier-1 years. |
| O | Loss from Life insurance business u/s 115B (col 8) | integer | *(no CFL schema leaf)* | Displayed and computed on-sheet (O23/O26/O27/O30) but **has no key in `ScheduleCFL`** — see findings. |
| P | Short-term capital loss (col 9a) | integer | `TotalSTCGPTILossCF` | Primary STCL carry value; summed at P23; ties to Sch CG table E (rule 560). |
| Q | 9b | integer | *(no distinct leaf)* | PTI STCL sub-column. |
| R | 9c | integer | *(no distinct leaf)* | `R=MAX(0,P+Q)` (rows 9,10 only) — vestigial total. |
| S | Long-term Capital loss (col 10a) | integer | `TotalLTCGPTILossCF` | Primary LTCL carry value; summed at S23; ties to Sch CG table E (rule 561). |
| U | 10b | integer | *(no distinct leaf)* | PTI LTCL sub-column. |
| V | 10c | integer | *(no distinct leaf)* | `V=MAX(0,S+U)` (row 10 only) — vestigial total. |
| W | Loss from owning and maintaining race horses (col 11) | integer | `OthSrcLossRaceHorseCF` | Tier-3 rows and summaries only; ties to 8e of Sch OS (rule 566). |

All amount leaves are `integer`, minimum 0, maximum 99999999999999.

---

## The rules the sheet computes (with cell references)

**Per-AY row computed cells (formulas present in the utility):**
- `[L15]=MAX(0,J15-K15)` and `[L19]…[L22]=MAX(0,J-K)` — 5c available business loss = 5a − 5b, floored at 0 (rule 568).
- `[I9]=MAX(0,G9+H9)`, `[I10]=MAX(0,G10+H10)` — HP 4c = 4a + 4b (vestigial; only rows 9-10 carry the formula).
- `[R9]=MAX(0,P9+Q9)`, `[R10]=MAX(0,P10+Q10)` — STCL 9c = 9a + 9b (vestigial).
- `[V10]=MAX(0,S10+U10)` — LTCL 10c = 10a + 10b (vestigial).

**Row xvii — Total of earlier year losses b/f (E23), column sums:**
- `[G23]=SUM(G14:G22)` HP · `[L23]=SUM(L15:L22)` business · `[M23]=SUM(M19:M22)` speculative · `[N23]=SUM(N7:N22)` specified · `[O23]=SUM(O7:O22)` 115B · `[P23]=SUM(P14:P22)` STCL · `[S23]=SUM(S14:S22)` LTCL · `[W23]=SUM(W19:W22)` race horses.
- Note the different sum spans: specified (N) and 115B (O) sum from row 7 (2010-11); HP/STCL/LTCL from row 14; business from 15; speculative/race-horse from 19 — reflecting each head's carry-forward window. (Rule 570: total = amounts provided in individual AYs.)

**Row xviii — Adjustment of above losses in Schedule BFLA (E26), pulled from BFLA/other schedules:**
- `[G26]=hp.BFlossPrevYrUndSameHeadSetoff1` · `[L26]=totofbfloss.BusLossOthThanSpecLossCF8-LossRemaing_BP` · `[M26]=SpeculativeIncome_Setoff` · `[N26]=SpecifiedIncome_Setoff` · `[O26]=Income115B_Setoff` · `[P26]=totofbfloss.STCGLossCF8-LossRemaing_STCG_1` · `[S26]=LTCG20_Setoff+LTCG125_Setoff+LTCG10_Setoff+LTCGDTAA_Setoff` · `[W26]=rh.BFlossPrevYrUndSameHeadSetoff6`.

**Row xix — 2026-27 Current year losses (E27), pulled from head schedules:**
- `[G27]=sheet16.BalHPlossCurYrAftSetoff` · `[L27]=sheet16.BalBusLossAftSetoff` · `[M27]=ABS(MIN(sheet12.AdjustedPLFrmSpecuBus,0))` · `[N27]=ABS(MIN(sheet12.AdjustedPLFrmSpecifiedBus,0))` · `[O27]=ABS(MIN(sheet12.IncmLifeInsur115B,0))` · `[P27]=STCG_LossRemaining_15Percent+…20Percent+…30Percent+…` · `[S27]=LTCG_LossRemaining_10Percent+…125Percent+…20Percent+…` · `[W27]=ABS(MIN(os.BalanceOwnRaceHorse,0))`.
- Cross-ties (rules.json): 4xix = 2xvii of Sch CYLA (rule 562); 5xix = 3xvii of Sch CYLA (rule 563); 6(xix) speculative = Sch BP B42 loss (rules 564-565); 7xix specified = Sch BP C48 loss (rule 565); 11xix race-horse = 8e of Sch OS (rule 566); STCL/LTCL = "remaining after set off" in Sch CG table E (rules 560-561).

**Row xxi — Current year losses to be carried forward (xix-xx) (E29):**
- `[G29]=CYLossHPBeforedistributed-CYLossHPdistributed` and the parallel `[L29] [M29] [N29] [O29] [P29] [S29] [W29]` = "before distributed − distributed" for each head. Rule 569: xxi = xix − xx, restricted to 0 if negative.

**Row xxii — Total loss Carried Forward to future years (E30):**
- `[G30]=MAX(0,G23-G26-MAX(0,G15-G26))+G29` and the parallel `[L30] [M30] [O30] [P30] [S30] [W30]` (same shape) · `[N30]=MAX(0,N23-N26+N29)` (specified head has the simpler form).
- Rule 571: xxii = xvii − xviii + xxi.

**Flow-out to Part B-TI (rules.json):**
- Rule 559: Part B-TI sl.17 "Losses of current year to be carried forward" = Total of **xix** of Sch CFL (sub-status other than Investment Fund).
- Rule 560: Investment Fund sub-status → Part B-TI amount flows from Total of **5cxxi + 6xxi + 7xxi** of Sch CFL.

---

## Dropdowns

Schedule CFL has **no enumerated dropdowns** (`values: null` for every validation returned):
- `F7:F22` — source `"10"` → **date** data-validation (Date of Filing), no value list.
- `P8:S22 V9:V22 M12:M22 W12:W22 N7:O22 G23:W31 G8:L22` — source `"0"` → numeric-entry validation (integer ≥ 0), no value list.

So there is nothing here for the build to render as a `<select>`; the loss cells are numeric inputs and `F` is a date input.

---

## What repeats and what is one figure

**Everything is one figure.** There is no add-more / row-repeater anywhere. The matrix is fixed: exactly 16 brought-forward AY rows (2010-11 … 2025-26) plus 6 fixed summary rows, each crossed with the fixed loss-head columns. Each `CarryFwdLossDetail` / `LossSummaryDetail` is a single object, not an array. The AY labels themselves are fixed text and are not editable.

---

## Mandatory (from schema `required`)

- **Tier-1 rows (2010-11 … 2017-18):** `*DateOfFiling` required.
- **Tier-2 rows (2018-19 … 2021-22):** `*DateOfFiling`, `*TotalHPPTILossCF`, `*TotalSTCGPTILossCF`, `*TotalLTCGPTILossCF` required (business, specified leaves optional).
- **Tier-3 rows (2022-23 … 2025-26):** only `*DateOfFiling` required.
- **Row xx `CurrentYearDistrUnitHolder`:** `*TotalHPPTILossCF`, `*TotalSTCGPTILossCF`, `*TotalLTCGPTILossCF` required (`OthSrcLossRaceHorseCF` optional).
- Each block's inner object (`*CarryFwdLossDetail` / `*LossSummaryDetail`) is itself required when the block is present. The top-level `ScheduleCFL` block has `required: None` (no leaf is unconditionally required across the whole schedule) — the requirements above bind only within a block that is emitted.
- Summary blocks (xvii, xviii, xix, xxi, xxii) have their `*LossSummaryDetail` object required but **no required leaf**.

---

## Hidden rows — not built

Do **not** build these (marked `H` by `dump.py`); they carry no schema object:

- **r24H** `[D24] xiii [E24] Loss distributed among the unit holder (Applicable for Investment Fund only)` — legacy Investment-Fund distribution row; superseded, no schema key.
- **r25H** `[D25] xvi [E25] Balance available of Total of earlier year b/f (xi-xii)` — hidden balance row; carries only vestigial formulas `[I25]=MAX(0,I23-I24)`, `[R25]=MAX(0,R23-R24)`, `[V25]=MAX(0,V23-V24)` that reference the hidden distribution row. No schema key.
- **r31H** `[E31] Current year loss distributed among the unit-holder (Applicable for Investment fund only)` — hidden duplicate of the (visible) row xx label; no schema key.

(The visible row **xx**, r28, "Current year loss distributed among the unit-holder", **is** built — it maps to `CurrentYearDistrUnitHolder` and is not hidden.)

---

## What this means for the build

- Build a **fixed 16-AY × loss-head grid** plus the 6 fixed summary rows. No repeaters. AY labels are static text.
- **Gate the columns by AY tier:** old years (2010-11 … 2017-18) expose only Date of Filing + Specified-business loss; 2018-19 … 2021-22 add HP + business (5a/5b/5c) + STCG + LTCG; 2022-23 … 2025-26 add speculative + race horse. Emitting a head leaf for a year that does not carry it will not validate.
- **Map only the primary head columns to schema leaves:** G→`TotalHPPTILossCF`, J→`BrtFwdBusLoss`, K→`AdjustAccTax115BADAmt`, L→`BusLossOthThanSpecLossCF`, M→`LossFrmSpecBusCF`, N→`LossFrmSpecifiedBusCF`, P→`TotalSTCGPTILossCF`, S→`TotalLTCGPTILossCF`, W→`OthSrcLossRaceHorseCF`, F→`DateOfFiling`. The 4b/4c, 9b/9c, 10b/10c sub-columns (H,I,Q,R,U,V) have **no distinct schema leaf** — they are PTI/total display columns folded into the single head key; do not create separate fields for them.
- **Column O (Life insurance 115B) has no `ScheduleCFL` leaf** — it is displayed and internally computed but is not part of the CFL export. Flag for the form-builder: do not invent a key; if 115B carry-forward is filed at all it is not through this block.
- **Enforce the computed rules:** 5c = MAX(0, 5a − 5b) with 5b forced to 0 when not opting 115BAD/115BAC(1A); xxi = MAX(0, xix − xx); xvii = Σ per-AY; xxii = xvii − xviii + xxi. Amounts are non-negative integers (≤ 14 nines).
- **Wire the pull-ins:** xviii from Schedule BFLA set-offs, xix from the head schedules (HP/BP/CG/OS/CYLA), and the flow-out of Total-xix (or 5c/6/7 xxi for Investment Funds) to Part B-TI sl.17.
- Date of Filing is a **date** field (`YYYY-MM-DD`), required on every populated AY row; there are no `<select>` dropdowns to render.
