# The book of Schedules CYLA · BFLA — the loss chain (part 1) · ITR-6, A.Y. 2026-27

Read row by row from the utility's **CYLA-BFLA** sheet (`sheet31.xml`, 70 rows,
18 hidden), with the hidden-row flags, the helper columns, and the sheet's own
formulas; confirmed against the CBDT ITR-6 schema's `ScheduleCYLA` and
`ScheduleBFLA`, and against the validation-rules document (serials A501–A555).
Nothing here is invented. Where a source is a compressed VBA blob it is marked
so; the readable validator strings are quoted verbatim.

This book covers the two matrices on the one sheet — **CYLA** then **BFLA**.
Schedule **CFL** (the carry-forward ledger) and **Schedule UD** (unabsorbed
depreciation and the s.35(4) allowance) are separate sheets with their own
books: `books/ITR-6/CFL.md` and `books/ITR-6/Unabsorbed_Depreciation.md`.

---

## 1 · What these schedules are, and the order they run in

One chain, fixed order. On ITR-6 (a company) it is longer than on ITR-2 because
the company has **business income**, and the brought-forward side carries not
only losses but **unabsorbed depreciation** and the **section 35(4) allowance**:

| Step | Schedule | What it does | Feeds |
|---|---|---|---|
| 1 | **CYLA** — current-year loss adjustment | sets **this year's** house-property, business and other-sources losses against **this year's** income, head by head | BFLA column 1 (via CYLA column 5) |
| 2 | **BFLA** — brought-forward loss adjustment | sets **earlier years'** brought-forward losses, **brought-forward depreciation** and the **brought-forward s.35(4) allowance** (all from CFL / UD) against what is left after CYLA | Part B-TI gross total income (BFLA 5xvi) |
| 3 | **CFL** — carry forward of losses | the ledger (own book) | next year |

Both matrices are **computed by the utility** and then offered for override.
Each carries `E29`/`E55` *"Do you want to edit the details auto-populated in
table above ?"* with a **No / Yes** dropdown; the schema carries `CYLAEditFlag`
on CYLA and `BFLAEditFlag` on BFLA.

---

## 2 · Column headers, verbatim (read the whole header — conditions live there)

### Schedule CYLA — sheet header (rows 3–5)
- `C3` **Schedule CYLA** · `F3` **Details of Income after set-off of current years losses**
- `C4` **CURRENT YEAR LOSS ADJUSTMENT** · `D4` **Sl.No** · `E4` **Head/ Source of Income**
- `F4` (col 1) **Income of current year (Fill this column only if income is zero or positive)**
- `G4` (col 2) **House property loss of the current year set off**
- `H4` (col 3) **Business Loss (other than Income from life insurance business u/s 115B .speculation loss or specifie…** (truncated in the sheet at 100 chars — the full head is "…specified business loss) of the current year set off")
- `I4` (col 4) **Other sources loss (other than loss from race horses) of the current year set off**
- `J4` (col 5) **Current year's Income remaining after set off**
- `G5` **Total loss (4 of Schedule – HP)** · `H5` **Total loss (2vi of item E Schedule-BP)** · `I5` **Total loss (6 of Schedule-OS)** — the three current-year losses coming in
- `J7` **5=1-2-3-4** — the column-5 identity

### Schedule BFLA — sheet header (rows 31–32)
- `C31` **Schedule BFLA** · `F31` **Details of Income after Set off of Brought Forward Losses of earlier years**
- `C32` **BROUGHT FORWARD LOSS ADJUSTMENT** · `D32` **Sl. No.** · `E32` **Head/ Source of Income**
- `F32` (col 1) **Income after set off, if any, of current year's losses as per 5 of Schedule CYLA)**
- `G32` (col 2) **Brought forward loss set off**
- `H32` (col 3) **Brought forward depreciation set off**
- `I32` (col 4) **Brought forward allowance under section 35(4) set off**
- `J32` (col 5) **Current year's income remaining after set off**

The three set-off inputs on BFLA are the three things a company brings forward:
a **loss** (col 2, from CFL), **unabsorbed depreciation** (col 3, from Schedule
UD col 4), and the **s.35(4) allowance** (col 4, from Schedule UD col 7).

---

## 3 · Schedule CYLA — the live rows

Rows are the heads of income; the five columns are income (1), HP-loss set-off
(2), business-loss set-off (3), OS-loss set-off (4), income remaining (5). The
Sl.No lettering and labels are the sheet's own (column E), and the item numbers
are the ones the **rules document** uses (e.g. "2i", "4xvi").

| Sl.No | Row label (verbatim, col E) | Schema object | Live? |
|---|---|---|---|
| i | **Loss to be set off** (the three losses, one per column, row 6) | `TotalCurYr` | live |
| ii | **House property** | `HP.IncCYLA` | live |
| iii | **Income from Business (excluding Profit and gains from life insurance business u/s 115B or speculatio…** (…speculation income and income from specified business) | `BusProfExclSpecProf.IncCYLA` | live |
| iv | **Profit and gains from life insurance business u/s 115B** | `ProfGainUs115B.IncCYLA` | live |
| v | **Speculative Income** | `SpeculationIncome.IncCYLA` | live |
| vi | **Specified Business Income** | `SpecifiedBusIncome.IncCYLA` | live |
| viia | **Short-term capital gain taxable @ 15%** | — | **HIDDEN (r14)** — pre-23-Jul-2024 rate |
| vii | **Short-term capital gain taxable @ 20%** | `STCG20Per.IncCYLA` | live |
| viii | **Short-term capital gain taxable @ 30%** | `STCG30Per.IncCYLA` | live |
| ix | **Short-term capital gain taxable at applicable rates** | `STCGAppRate.IncCYLA` | live |
| x | **Short-term capital gain taxable at special rates in India as per DTAA** | `STCGDTAARate.IncCYLA` | live |
| xia | **Long term capital gain taxable @ 10%** | — | **HIDDEN (r19)** — pre-July rate |
| xi | **Long term capital gain taxable @ 12.5%** | `LTCG12_5Per.IncCYLA` | live |
| xii | **Long term capital gain taxable @ 20%** | — | **HIDDEN (r21)** — pre-July rate |
| xii | **Long term capital gains taxable at special rates in India as per DTAA** | `LTCGDTAARate.IncCYLA` | live |
| xiii | **Net Income From Other sources chargeable at normal applicable rates** | `OthSrcExclRaceHorseLottery.IncCYLA` | live |
| xiv | **Profit from owning and maintaining race horses** | `ProfitFrmRaceHorse.IncCYLA` | live |
| xv | **Income from Other sources taxable at special rates in India as per DTAA rates** | `IncOSDTAA.IncCYLA` | live |
| xvi | **Total loss set-off (ii+ iii+ iv+ v+ vi+ vii+ viii+ ix+ x+ xi+ xii+xiii+xiv+xv+xvi)** | `TotalLossSetOff` | live |
| xvii | **Loss remaining after set-off(i – xvii)** | `LossRemAftSetOff` | live |

So the live head set is **fifteen heads**: house property, four business heads
(business, 115B life-insurance, speculative, specified business), six
capital-gain slots (STCG 20/30/app/DTAA, LTCG 12.5/DTAA), and three
other-sources lines (normal, race horses, DTAA). The three pre-July rate slots
(STCG@15%, LTCG@10%, LTCG@20%) are **hidden and not built**.

### Which loss may go where — the columns that exist per row (from the schema)

| Row | col 2 HP-loss (`HPlossCurYrSetoff`) | col 3 Bus-loss (`BusLossSetoff`) | col 4 OS-loss (`OthSrcLossNoRaceHorseSetoff`) |
|---|---|---|---|
| House property | **no** (a HP loss cannot go against HP income) | yes | yes |
| Business (iii) | yes | **no** (bus loss cannot go against bus income) | yes |
| 115B / Speculative / Specified (iv–vi) | yes | **no** | yes |
| the six CG slots (vii–xii) | yes | yes | yes |
| OS normal (xiii) | yes | yes | **no** (OS loss cannot go against OS income) |
| Race horses (xiv) | yes | yes | yes |
| OS DTAA (xv) | yes | yes | yes |

Every row also carries col 1 `IncOfCurYrUnderThatHead` and col 5
`IncOfCurYrAfterSetOff`.

### The three current-year losses coming in (row i = the `TotalCurYr` object)
| Column | Named cell / formula | Schema key |
|---|---|---|
| 2 — HP loss | `G6 = ABS(MIN(HP.TotalIncomeChargeableUnHP,0))` | `TotalCurYr.TotHPlossCurYr` |
| 3 — business loss | `H6 = ABS(MAX(sheet12.LossRemainSetOffOnBus,0))` (from Table E of Schedule BP, 2vi) | `TotalCurYr.TotBusLoss` |
| 4 — OS loss (excl. race horses) | `I6 = ABS(MIN(os.BalanceNoRaceHorse+MAX(0,0),0))` | `TotalCurYr.TotOthSrcLossNoRaceHorse` |

### Totals (rows xvi, xvii)
| Cell | Formula | Schema key |
|---|---|---|
| `G26` HP loss set off | `MAX(0,MIN(200000,SUM(G10:G25)))` — **the ₹2,00,000 cap** | `TotalLossSetOff.TotHPlossCurYrSetoff` |
| `H26` business loss set off | `MAX(0,MIN(SUM(H8:H25),H6))` | `TotalLossSetOff.TotBusLossSetoff` |
| `I26` OS loss set off | `MAX(0,MIN(SUM(I8:I25),I6))` | `TotalLossSetOff.TotOthSrcLossNoRaceHorseSetoff` |
| `G27` HP loss remaining | `IF(sheet16.TotHPlossCurYrSetoff<200000, MAX(0,(cyla.TotHPlossCurYr1-sheet16.TotHPlossCurYrSetoff)+HP.REMloss), HP.REMloss)` | `LossRemAftSetOff.BalHPlossCurYrAftSetoff` |
| `H27` business loss remaining | `MAX(0, cyla.TotBusLoss - sheet16.TotBusLossSetoff)` | `LossRemAftSetOff.BalBusLossAftSetoff` |
| `I27` OS loss remaining | `MAX(0, cyla.TotOthSrcLossNoRaceHorse - sheet16.TotOthSrcLossNoRaceHorseSetoff)` | `LossRemAftSetOff.BalOthSrcLossNoRaceHorseAftSetoff` |
| `F26` total income after set-off | `SUM(F9:F25)` | — |

### The ₹2,00,000 cap and the set-off order
- Rule **A502**: "In schedule CYLA Sl. No. 2xvi cannot be more than Rs. 200000."
  VBA message: *"Maximum loss that can be set off for house property is Rs 200000."*
  So the HP-loss column total (`G26`) is `MIN(200000, …)`.
- Rule **A527**: "sum of amount mentioned in column no 2 + 3 + 4 should not
  exceed amount mentioned in column 1" — a row's set-offs cannot exceed that
  row's income.
- Rule **A525**: "Normal OS loss should be set off first against the (i) Profit
  from the activity of owning and maintaining race horses …" — the OS loss set-off
  walk starts at the race-horse row, then the other heads.
- Rule **A526**: "income is available for setoff of losses but house property
  loss is not fully setoff" — the utility refuses a carry-forward of a HP loss
  that could have been used (subject to the ₹2 lakh cap).
- The utility keeps a running remaining per loss column and, at each row, takes
  `MAX(0, MIN(loss remaining, income − whatever the other losses already took))`
  — see the `G/H/I/J` formulas per row (e.g. `J15 = MAX(0, income − SUM(G15:I15))`).

### The cross-checks the rules document ties to CYLA column 1 (income feeds)
| Item | Rule | Feed |
|---|---|---|
| 1iii Business | A520 | = A38 of Schedule BP, if positive |
| 1iv 115B | A521 | = E3iv of Schedule BP |
| 1v Speculative | A510 | = 3ii of Table E, Schedule BP |
| 1vi Specified business | A511 | = 3iii of Table E, Schedule BP |
| 1vii STCG@20% | A512 | = 8ii of item E, Schedule CG |
| 1viii STCG@30% | A513 | = 8iii of item E, Schedule CG |
| 1ix STCG app | A514 | = 8iv of item E, Schedule CG |
| 1x STCG DTAA | A515 | = 8v of item E, Schedule CG |
| 1xi LTCG@12.5% | A516 | = 8vi of item E, Schedule CG |
| 1xii LTCG DTAA | A517 | = 8 (DTAA) of item E, Schedule CG |
| 1xiii OS normal | A518 | Other-source income excl. race horses / special-rate |
| 1xiv Race horses | A519 | = 8e of Schedule OS |
| 1xv OS DTAA | A524 | = 2e of Schedule OS |
| 2i HP loss | A503 | = 3 of Schedule HP |
| 3i Business loss | A501 | = 2vi of Table E, Schedule BP |
| OS loss | A504 | = 6 of Schedule OS |
| 4xvi / 2xvii / 3xvii / 4xvii | A505/A506/A507/A508 | totals = the stated sums |
| Col 5 | A509 | = Col 1 − 2 − 3 − 4 |

---

## 4 · Schedule BFLA — the live rows

Same fifteen income heads (the three pre-July slots hidden), five columns:
1 income after CYLA (`IncOfCurYrUndHeadFromCYLA`), 2 brought-forward loss set
off (`BFlossPrevYrUndSameHeadSetoff`), 3 brought-forward depreciation set off
(`BFUnabsorbedDeprSetoff`), 4 brought-forward s.35(4) allowance set off
(`BFAllUs35Cl4Setoff`), 5 income remaining (`IncOfCurYrAfterSetOffBFLosses`).

| Sl.No | Row label (verbatim, col E) | Schema object | col 2 BF-loss? | Live? |
|---|---|---|---|---|
| i | **House property** | `HP.IncBFLA` | yes | live |
| ii | **Business (excluding Profit and gains from life insurance business u/s 115B or speculation income and…** | `BusProfExclSpecProf.IncBFLA` | yes | live |
| iii | **Profit and gains from life insurance business u/s 115B** | `ProfGainUs115B.IncBFLA` | yes | live |
| iv | **Speculative Income** | `SpeculationIncome.IncBFLA` | yes | live |
| v | **Specified Business Income** | `SpecifiedBusIncome.IncBFLA` | yes | live |
| via | **Short-term capital gain taxable @ 15%** | — | — | **HIDDEN (r40)** |
| vi | **Short-term capital gain taxable @ 20%** | `STCG20Per.IncBFLA` | yes | live |
| vii | **Short-term capital gain taxable @ 30%** | `STCG30Per.IncBFLA` | yes | live |
| viii | **Short-term capital gain taxable @ applicable rates** | `STCGAppRate.IncBFLA` | yes | live |
| ix | **Short-term capital gain taxable at special rates in India as per DTAA** | `STCGDTAARate.IncBFLA` | yes | live |
| xa | **Long term capital gain taxable @ 10%** | — | — | **HIDDEN (r45)** |
| x | **Long term capital gain taxable @ 12.5%** | `LTCG12_5Per.IncBFLA` | yes | live |
| xi | **Long term capital gain taxable @ 20%** | — | — | **HIDDEN (r47)** |
| xi | **Long term capital gains taxable at special rates in India as per DTAA** | `LTCGDTAARate.IncBFLA` | yes | live |
| xii | **Net income from other sources chargeable at normal applicable rates** | `OthSrcExclRaceHorse.IncBFLA` | **no** | live |
| xiii | **Profit from owning and maintaining race horses** | `ProfitFrmRaceHorse.IncBFLA` | yes | live |
| xiv | **Income from other sources income taxable at special rates in India as per DTAA** | `IncOSDTAA.IncBFLA` | **no** | live |
| xv | **Total of brought forward loss set off (2i+2ii+2iii+2iv+2v+2vi+2vii+2viii+2ix+2x+2xi+2xiii)** | `TotalBFLossSetOff` | — | live |
| xvi | **Current year's income remaining after set off of Total of (5i + 5ii + 5iii + 5iv+ 5v + 5vi + 5vii +…** | `IncomeOfCurrYrAftCYLABFLA` | — | live |

### Which brought-forward item may go where (from the schema + rules)

- **Brought-forward loss (col 2, `BFlossPrevYrUndSameHeadSetoff`)** exists on
  every live row **except OS normal (xii) and OS DTAA (xiv)** — a brought-forward
  loss may not be set against other-sources income. Head-matching:
  - HP loss → HP income only (`G35 = MIN(balAvlbl.HPlossCF, hp income)`).
  - Business (non-spec) loss → business income (ii); rule A555 ties
    2(ii+iii+iv+v) to CFL's business-loss adjustment.
  - Speculative loss → speculative income (iv) only.
  - Specified-business loss → specified-business income (v) only.
  - 115B life-insurance loss → 115B income (iii) only.
  - Short-term capital loss → any capital-gain slot (STCG first, then the LTCG
    slots via the `Q/R/S/T` helper chain).
  - Long-term capital loss → the long-term slots only.
  - Race-horse loss → race-horse income (xiii) only.
- **Brought-forward depreciation (col 3, `BFUnabsorbedDeprSetoff`)** and the
  **s.35(4) allowance (col 4, `BFAllUs35Cl4Setoff`)** exist on **every** live
  row, **including OS normal and OS DTAA** — unlike a brought-forward *loss*,
  unabsorbed depreciation and the s.35(4) allowance may be set against any head,
  other sources included. `H34 = SUM(UD.Setoff)` and `I34 = SUM(UD2.Setoff)` are
  the pools they draw from (Schedule UD columns 4 and 7).

### BFLA totals (rows xv, xvi)
| Cell | Formula | Schema key |
|---|---|---|
| `G52` | `SUM(G35:G50)` | `TotalBFLossSetOff.TotBFLossSetoff` |
| `H52` | `SUM(H35:H51)` | `TotalBFLossSetOff.TotUnabsorbedDeprSetoff` |
| `I52` | `SUM(I35:I51)` | `TotalBFLossSetOff.TotAllUs35cl4Setoff` |
| `J53` | `SUM(J35:J51)` → **gross total income** | `IncomeOfCurrYrAftCYLABFLA` |

### BFLA cross-checks and validators (rules document + VBA)
- **A537–A550**: column 1 of each BFLA row = column 5 of the matching CYLA row
  (1i = CYLA 5ii, 1ii = CYLA 5iv … 1xiv = CYLA 5xv).
- **A528**: 2(i) brought-forward HP loss = 4(xviii) of CFL (adjustment in BFLA).
- **A551**: 2(xiii) race-horse BF loss = 11(xvii) of CFL.
- **A554**: 2(vi+vii+viii+ix+x+xi) capital BF-loss set-off = 9(xviii)+10(xviii)
  of CFL (STCG + LTCG adjustments).
- **A555**: 2(ii+iii+iv+v) business BF loss = xviii(5+6+7+8) of CFL.
- **A536**: total col 3 (3xv, BF depreciation) = total of Col 4 of Schedule UD.
- **A535**: total col 4 (4xv, s.35(4) allowance) = total of Col 7 of Schedule UD.
- **A529**: on any row, col 2 + 3 + 4 ≤ col 1. **A532/A530**: 5 ≤ 1; 2xv ≤ the
  CFL adjustments. **A531**: col 5 = col 1 − 2 − 3 − 4. **A533/A552/A553/A534**:
  the totals equal the stated sums.
- VBA validator (readable string): *"Losses set off cannot be more than the
  losses brought forward from previous years in Schedule CFL."* (guards col 2
  against the CFL brought-forward totals). The rest of the BFLA VBA is a
  compressed blob; only this message resolved as clear text.

### Helper columns on the sheet (column P–T) — read them, they are the rule
These drive the nested capital-loss set-off (short-then-long, LTCL-first on the
long slots) and are computed, never typed:
- `P37` **Business Income**, `P38` **Speculative Income**, `P39` **Specified
  Income** — the pool labels for the business-loss chain.
- `Q36` **Individual Field Set off**, `R36` **Remaining Loss After Setoff**,
  `S36` **Income Remaining after Set off** (repeated at `Q44/R44/S44`), and
  `T44` **STCG Loss Set Off** — the capital-loss allocation helpers.
- Hidden helper labels not built: `P40` 115b Income, `P45` STCG CFL Loss,
  `P47` LTCG 20 (all on hidden rows r40/r45/r47).

---

## 5 · The enums / dropdowns on this sheet

| Cell | Values | Schema key |
|---|---|---|
| `I29` (CYLA edit) | **No**, **Yes** | `CYLAEditFlag` |
| `I55` (BFLA edit, named range `CYLA_TempEdit`) | **Yes**, **No** | `BFLAEditFlag` |

Both are the "edit the auto-populated table" override switch. On **Yes** the
set-off cells become typeable and the VBA validators (14-digit limit, the
₹2,00,000 HP cap, the CFL brought-forward limits) run.

---

## 6 · Every schema leaf key (so nothing is lost on filing)

**ScheduleCYLA** — `CYLAEditFlag`; `TotalCurYr.{TotHPlossCurYr, TotBusLoss,
TotOthSrcLossNoRaceHorse}`; then for each head object under `.IncCYLA`:
`IncOfCurYrUnderThatHead`, `HPlossCurYrSetoff`, `BusLossSetoff`,
`OthSrcLossNoRaceHorseSetoff`, `IncOfCurYrAfterSetOff` (only the columns that
exist on that row — see §3); the head objects are `HP`, `BusProfExclSpecProf`,
`ProfGainUs115B`, `SpeculationIncome`, `SpecifiedBusIncome`, `STCG20Per`,
`STCG30Per`, `STCGAppRate`, `STCGDTAARate`, `LTCG12_5Per`, `LTCGDTAARate`,
`OthSrcExclRaceHorseLottery`, `ProfitFrmRaceHorse`, `IncOSDTAA`; totals
`TotalLossSetOff.{TotHPlossCurYrSetoff, TotBusLossSetoff,
TotOthSrcLossNoRaceHorseSetoff}` and `LossRemAftSetOff.{BalHPlossCurYrAftSetoff,
BalBusLossAftSetoff, BalOthSrcLossNoRaceHorseAftSetoff}`.

**ScheduleBFLA** — `BFLAEditFlag`; for each head object under `.IncBFLA`:
`IncOfCurYrUndHeadFromCYLA`, `BFlossPrevYrUndSameHeadSetoff` (all rows except
`OthSrcExclRaceHorse` and `IncOSDTAA`), `BFUnabsorbedDeprSetoff`,
`BFAllUs35Cl4Setoff`, `IncOfCurYrAfterSetOffBFLosses`; the head objects are `HP`,
`BusProfExclSpecProf`, `ProfGainUs115B`, `SpeculationIncome`,
`SpecifiedBusIncome`, `STCG20Per`, `STCG30Per`, `STCGAppRate`, `STCGDTAARate`,
`LTCG12_5Per`, `LTCGDTAARate`, `OthSrcExclRaceHorse`, `ProfitFrmRaceHorse`,
`IncOSDTAA`; totals `TotalBFLossSetOff.{TotBFLossSetoff, TotUnabsorbedDeprSetoff,
TotAllUs35cl4Setoff}` and `IncomeOfCurrYrAftCYLABFLA`.

Every leaf listed here has a place on screen (a matrix cell) — no leaf is
excluded.

---

## 7 · What flows in and out (cross-sheet feeds)

**In to CYLA (column 1 income + the three losses):** Schedule HP (income and
the loss, item 3/4), Schedule BP Table E and A38/E3iv (business, 115B,
speculative, specified), Schedule CG item E 8ii–8vi (the capital slots),
Schedule OS 8e/2e/6 (race horses, DTAA, OS loss).

**CYLA → BFLA:** column 5 of each CYLA row becomes column 1 of the matching
BFLA row (A537–A550).

**In to BFLA (the brought-forward pools):** Schedule CFL totals (`balAvlbl.*`
= brought-forward HP/STCG/LTCG/race-horse losses; the business/speculative/
specified/115B `totofbfloss.*` pools); Schedule UD `SUM(UD.Setoff)` (col 3
depreciation) and `SUM(UD2.Setoff)` (col 4 s.35(4) allowance).

**Out of CYLA:** the loss-remaining row (xvii) feeds Schedule CFL row xix
(current-year losses) — HP remaining, business remaining, capital remaining.

**Out of BFLA:** row xvi (`IncomeOfCurrYrAftCYLABFLA`, `J53`) is **gross total
income** for Part B-TI; the amounts actually used (2xv/3xv/4xv) feed Schedule
CFL row xviii (adjustment in BFLA) and Schedule UD (depreciation/allowance
set off in the year).

---

## 8 · What repeats and what does not

Nothing repeats. CYLA and BFLA are **fixed matrices of fifteen live head rows**
(the three pre-July slots hidden). The only person inputs are the two override
switches (`I29`, `I55`) and the cells they unlock. Everything else — the income
cells, both set-off matrices, and all totals — is computed.

---

## 9 · What ITR-6 has here that ITR-2 does not

- **Four business heads are live** (business, 115B life insurance, speculative,
  specified business) and a **business-loss column (col 3)** in CYLA — ITR-2
  hides all of these.
- BFLA has **two extra brought-forward columns**: **depreciation (col 3)** and
  the **section 35(4) allowance (col 4)**, both sourced from Schedule UD; ITR-2
  has neither.
- Those two columns may be set against **other-sources income too** (a
  brought-forward *loss* may not).
- CFL runs **sixteen assessment years** (2010-11 … 2025-26), not eight — because
  a company's specified-business (s.35AD) loss and life-insurance loss carry
  forward without the eight-year limit (see `books/ITR-6/CFL.md`).

---

## 10 · What this means for the build

1. **One "loss" section, three parts in order** — CYLA, BFLA (this book), then
   CFL and, feeding both, Schedule UD.
2. **CYLA is a matrix on fifteen head rows** with three loss columns (HP/Bus/OS),
   the disallowed cells greyed per §3, the ₹2,00,000 cap on the HP column total
   (A502), the set-off order (A525/A527), and the `I29` override.
3. **BFLA is a matrix on the same fifteen rows** with three brought-forward
   columns (loss/depreciation/allowance): the loss column greyed on OS normal
   and OS DTAA, depreciation and allowance live on every row, head-matched loss
   set-off, and the `I55` override with the CFL-limit validator message shown live.
4. **Every cell writes to its own schema key** (§6) — not the totals only.
5. **Feeds** exactly as §7 — CYLA col 5 → BFLA col 1, BFLA xvi → gross total
   income, and the used amounts → CFL and UD.
