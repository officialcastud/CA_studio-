# The book of Schedule CYLA — current-year loss set-off · ITR-7, A.Y. 2026-27

Read row by row from the utility's **Schedule CYLA** sheet (rows 3–51, with the
hidden pre-July capital-gain slots and the helper columns), and confirmed against
the CBDT ITR-7 schema block **ScheduleCYLA** and the validation-rules document
(rules A354–A378, A500, A565, A601). Nothing here is invented — Appendix A
reproduces every schema leaf, Appendix B every live row verbatim, Appendix C the
dropdown.

ITR-7 has **one set-off sheet — Schedule CYLA** (current-year loss adjustment).
It sets **this year's** house-property, business and other-sources losses against
**this year's** income, head by head, and hands what is left to Part B-TI. (There
is no separate BFLA matrix on this ITR-7 sheet; brought-forward adjustment is not
part of this block.)

---

## 1 · What the schedule does

`Schedule CYLA — Details of Income after set-off of current years losses`. A
fixed matrix: the rows are the heads of income; the five columns are
**income (1)**, **house-property-loss set-off (2)**, **business-loss set-off (3)**,
**other-sources-loss set-off (4)**, and **income remaining after set-off (5)**,
with `5 = 1 − 2 − 3 − 4` (A363). The matrix is computed by the utility and then
offered for override — row 51 carries *"Do you want to edit the details
auto-populated in table above ?"* with a **No / Yes** switch (schema
`CYLAEditFlag`).

The three current-year losses coming in sit on row 6, **"Loss to be adjusted"**,
one per loss column: the house-property loss (column 2, = Sl. No. 3 of Schedule
HP, A360), the business loss (column 3, = Sl. No. 2v of item E of Schedule BP,
A361), and the other-sources loss other than race horses (column 4, = Sl. No. 6
of Schedule OS, A362).

---

## 2 · Column headers, verbatim (the conditions live in the headers)

- `D4` **Serial No.** · `E4` **Head/ Source of Income**
- `F4` (col 1) **Income of current year (Fill this column only if income is zero or positive)**
- `G4` (col 2) **House property loss of the current year set off Total loss (4 of Schedule –HP)**
- `H4` (col 3) **Business Loss (other than speculation or specified business loss) of the current year set off Total loss**
- `I4` (col 4) **Other sources loss (other than loss from race horses) of the current year set off Total loss (6 of Schedule OS)**
- `J4` (col 5) **Current year's Income remaining after set off** · `J5` **5=1-2-3-4**

---

## 3 · The live rows → schema map

The Sl.No lettering and labels are the sheet's own (column E); the item numbers
are those the rules document uses. There are **thirteen live income heads**; the
three pre-July rate slots (STCG@15%, LTCG@10%, LTCG@20%) and the two old combined
CG rows are **hidden and not built**.

| Sl.No | Row label (verbatim, col E) | Schema head object | col 2 HP | col 3 Bus | col 4 OS |
|---|---|---|---|---|---|
| — | **Loss to be adjusted** (row 6) | `TotalCurYr` | in | in | in |
| i | **House property** | `HP` | — | yes | yes |
| ii | **Income from Business (excluding speculation profit and income from specified business or profession)** | `BusProfExclSpecProf` | yes | — | yes |
| iii | **Speculative Income** | `SpeculationIncome` | yes | — | yes |
| iv | **Specified Business Income u/s 35AD** | `SpecifiedBusIncome` | yes | — | yes |
| v | **Short-term capital gain taxable @ 20%,** | `STCG20Per` | yes | yes | yes |
| vi | **Short-term capital gain taxable @ 30%,** | `STCG30Per` | yes | yes | yes |
| vii | **Short-term capital gain taxable at applicable rates,** | `STCGAppRate` | yes | yes | yes |
| viii | **Short-term capital gain taxable at special rates in India as per DTAA** | `STCGDTAARate` | yes | yes | yes |
| ix | **Long term capital gain taxable @ 12.5%,** | `LTCG12_5Per` | yes | yes | yes |
| x | **Long term capital gains taxable at special rates in India as per DTAA** | `LTCGDTAARate` | yes | yes | yes |
| xi | **Net Income from Other sources (excluding profit from owning race horses and winnings from lottery)** | `OthSrcExclRaceHorseLottery` | yes | yes | — |
| xii | **Profit from the activity of owning and maintaining race horses** | `ProfitFrmRaceHorse` | yes | yes | yes |
| xiii | **Income from other sources taxable at special rates in India as per DTAA** | `IncOSDTAA` | yes | yes | yes |
| xiv | **Total loss set-off** | `TotalLossSetOff` | — | — | — |
| xv | **Loss remaining after set-off** | `LossRemAftSetOff` | — | — | — |

Every head row carries col 1 `IncOfCurYrUnderThatHead` and col 5
`IncOfCurYrAfterSetOff`. "—" in a loss column means that set-off cannot happen
there: **a HP loss cannot go against HP income** (col 2 absent on row i); **a
business loss cannot go against business income** (col 3 absent on the three
business rows ii–iv); **an OS loss cannot go against OS-normal income** (col 4
absent on row xi). The schema leaf list (Appendix A) is the authority for which
of `HPlossCurYrSetoff` / `BusLossSetoff` / `OthSrcLossNoRaceHorseSetoff` exists on
each object.

### The three current-year losses coming in (row 6 = the `TotalCurYr` object)
| Column | Feed | Schema key |
|---|---|---|
| 2 — HP loss | = Sl. No. 3 of Schedule HP if a loss (A360) | `TotalCurYr.TotHPlossCurYr` |
| 3 — business loss | = Sl. No. 2v of item E of Schedule BP if a loss (A361) | `TotalCurYr.TotBusLoss` |
| 4 — OS loss (excl. race horses) | = Sl. No. 6 of Schedule OS if a loss (A362) | `TotalCurYr.TotOthSrcLossNoRaceHorse` |

### Totals (rows xiv, xv)
| Item | Rule | Schema key |
|---|---|---|
| xiv col 2 Total loss set-off (HP) | = sum of ii–xiii of column 2, capped at **Rs. 200000** (A354) | `TotalLossSetOff.TotHPlossCurYrSetoff` |
| xiv col 3 Total loss set-off (Bus) | = (i + v + vi + vii + viii + ix + x + xi + xii + xiii) of column 3 (A355) | `TotalLossSetOff.TotBusLossSetoff` |
| xiv col 4 Total loss set-off (OS) | = (i + ii + iii + iv + v + vi + vii + viii + ix + x + xii + xiii) of column 4 (A356) | `TotalLossSetOff.TotOthSrcLossNoRaceHorseSetoff` |
| xv col 2 Loss remaining | = "Loss to be adjusted" col 2 − 2(xiv) (A357) | `LossRemAftSetOff.BalHPlossCurYrAftSetoff` |
| xv col 3 Loss remaining | = "Loss to be adjusted" col 3 − 3(xiv) (A358) | `LossRemAftSetOff.BalBusLossAftSetoff` |
| xv col 4 Loss remaining | = "Loss to be adjusted" col 4 − 4(xiv) (A359) | `LossRemAftSetOff.BalOthSrcLossNoRaceHorseAftSetoff` |

---

## 4 · The rules the matrix enforces (by serial)

- **A354** — the HP-loss column total (xiv col 2) is capped at **Rs. 200000**
  (the two-lakh house-property set-off cap).
- **A355 / A356** — the business-loss and OS-loss column totals equal the stated
  sums of their rows.
- **A357 / A358 / A359** — the loss-remaining row (xv) = loss to be adjusted −
  the total set off, per column.
- **A363** — col 5 (income remaining) = col 1 − col 2 − col 3 − col 4.
- **A374** — Normal OS loss is set off **first** against "Profit from the activity
  of owning and maintaining race horses" and OS income taxable at special DTAA
  rates.
- **A375** — on any row, col 2 + col 3 + col 4 shall not exceed col 1 (a row's
  set-offs cannot exceed that row's income).
- **A360 / A361 / A362** — the three "Loss to be adjusted" figures = Sl. No. 3 of
  Schedule HP, Sl. No. 2v of Table E of Schedule BP, and Sl. No. 6 of Schedule OS.

### Column-1 income feeds (the cross-checks tied to CYLA column 1)
| Item | Rule | Feed |
|---|---|---|
| 1ii Business | A372 | = A36 of Schedule BP, only if A36 is positive |
| 1iii Speculative | A364 | = 3ii of Table E, Schedule BP |
| 1iv Specified business | A365 | = 3iii of Table E, Schedule BP |
| 1v STCG@20% | A376 | = 8ii of item E, Schedule CG |
| 1vi STCG@30% | A366 | = 8iii of item E, Schedule CG |
| 1vii STCG app rates | A367 | = 8iv of item E, Schedule CG |
| 1viii STCG DTAA | A368 | = 8v of item E, Schedule CG |
| 1ix LTCG@12.5% | A377 | = 8vi of item E, Schedule CG |
| 1x LTCG DTAA | A369 | = 8vii of item E, Schedule CG |
| 1xi OS normal | A370/A371 | Other-source income excl. race horses / special rate |
| 1xii Race horses | A371 | = 8e of Schedule OS |
| 1xiii OS DTAA | A378 | = 2e of Schedule OS |

---

## 5 · What repeats and what does not

Nothing repeats. Schedule CYLA is a **fixed matrix of thirteen live head rows**
(the three pre-July rate slots hidden). The only person input is the override
switch on row 51 and the cells it unlocks. Everything else — the income cells, the
set-off matrix and all totals — is computed.

---

## 6 · What flows in and out

**In (column 1 income + the three losses):** Schedule HP (income and the loss,
item 3), Schedule BP Table E and A36 (business, speculative, specified), Schedule
CG item E 8ii–8vii (the capital slots), Schedule OS 8e / 2e / 6 (race horses,
DTAA, OS loss).

**Out:** the "income remaining after set off" column (col 5) feeds the special-rate
rows of Schedule SI (A390, A429) and the CG cross-checks (A266–A273); the totals
of the loss set-off (2xiv + 3xiv + 4xiv) feed **Part B-TI** — Sl. No. 12 of Part
B1 (A500), Sl. No. 9 of Part B2 (A565) and Sl. No. 8 of Part B3 (A601).

---

## Appendix A · Full schema key map (`ScheduleCYLA`)

Required keys marked *. The presence or absence of each loss-column leaf on a head
object is the authority for §3's set-off grid.

```
  CYLAEditFlag string
* HP.IncCYLA.IncOfCurYrUnderThatHead integer
  HP.IncCYLA.BusLossSetoff integer
  HP.IncCYLA.OthSrcLossNoRaceHorseSetoff integer
* HP.IncCYLA.IncOfCurYrAfterSetOff integer
* BusProfExclSpecProf.IncCYLA.IncOfCurYrUnderThatHead integer
  BusProfExclSpecProf.IncCYLA.HPlossCurYrSetoff integer
  BusProfExclSpecProf.IncCYLA.OthSrcLossNoRaceHorseSetoff integer
* BusProfExclSpecProf.IncCYLA.IncOfCurYrAfterSetOff integer
* SpeculationIncome.IncCYLA.IncOfCurYrUnderThatHead integer
  SpeculationIncome.IncCYLA.HPlossCurYrSetoff integer
  SpeculationIncome.IncCYLA.OthSrcLossNoRaceHorseSetoff integer
* SpeculationIncome.IncCYLA.IncOfCurYrAfterSetOff integer
* SpecifiedBusIncome.IncCYLA.IncOfCurYrUnderThatHead integer
  SpecifiedBusIncome.IncCYLA.HPlossCurYrSetoff integer
  SpecifiedBusIncome.IncCYLA.OthSrcLossNoRaceHorseSetoff integer
* SpecifiedBusIncome.IncCYLA.IncOfCurYrAfterSetOff integer
* STCG20Per.IncCYLA.IncOfCurYrUnderThatHead integer
  STCG20Per.IncCYLA.HPlossCurYrSetoff integer
  STCG20Per.IncCYLA.BusLossSetoff integer
  STCG20Per.IncCYLA.OthSrcLossNoRaceHorseSetoff integer
* STCG20Per.IncCYLA.IncOfCurYrAfterSetOff integer
* STCG30Per.IncCYLA.IncOfCurYrUnderThatHead integer
  STCG30Per.IncCYLA.HPlossCurYrSetoff integer
  STCG30Per.IncCYLA.BusLossSetoff integer
  STCG30Per.IncCYLA.OthSrcLossNoRaceHorseSetoff integer
* STCG30Per.IncCYLA.IncOfCurYrAfterSetOff integer
* STCGAppRate.IncCYLA.IncOfCurYrUnderThatHead integer
  STCGAppRate.IncCYLA.HPlossCurYrSetoff integer
  STCGAppRate.IncCYLA.BusLossSetoff integer
  STCGAppRate.IncCYLA.OthSrcLossNoRaceHorseSetoff integer
* STCGAppRate.IncCYLA.IncOfCurYrAfterSetOff integer
* STCGDTAARate.IncCYLA.IncOfCurYrUnderThatHead integer
  STCGDTAARate.IncCYLA.HPlossCurYrSetoff integer
  STCGDTAARate.IncCYLA.BusLossSetoff integer
  STCGDTAARate.IncCYLA.OthSrcLossNoRaceHorseSetoff integer
* STCGDTAARate.IncCYLA.IncOfCurYrAfterSetOff integer
* LTCG12_5Per.IncCYLA.IncOfCurYrUnderThatHead integer
  LTCG12_5Per.IncCYLA.HPlossCurYrSetoff integer
  LTCG12_5Per.IncCYLA.BusLossSetoff integer
  LTCG12_5Per.IncCYLA.OthSrcLossNoRaceHorseSetoff integer
* LTCG12_5Per.IncCYLA.IncOfCurYrAfterSetOff integer
* LTCGDTAARate.IncCYLA.IncOfCurYrUnderThatHead integer
  LTCGDTAARate.IncCYLA.HPlossCurYrSetoff integer
  LTCGDTAARate.IncCYLA.BusLossSetoff integer
  LTCGDTAARate.IncCYLA.OthSrcLossNoRaceHorseSetoff integer
* LTCGDTAARate.IncCYLA.IncOfCurYrAfterSetOff integer
* OthSrcExclRaceHorseLottery.IncCYLA.IncOfCurYrUnderThatHead integer
  OthSrcExclRaceHorseLottery.IncCYLA.HPlossCurYrSetoff integer
  OthSrcExclRaceHorseLottery.IncCYLA.BusLossSetoff integer
* OthSrcExclRaceHorseLottery.IncCYLA.IncOfCurYrAfterSetOff integer
* ProfitFrmRaceHorse.IncCYLA.IncOfCurYrUnderThatHead integer
  ProfitFrmRaceHorse.IncCYLA.HPlossCurYrSetoff integer
  ProfitFrmRaceHorse.IncCYLA.BusLossSetoff integer
  ProfitFrmRaceHorse.IncCYLA.OthSrcLossNoRaceHorseSetoff integer
* ProfitFrmRaceHorse.IncCYLA.IncOfCurYrAfterSetOff integer
* IncOSDTAA.IncCYLA.IncOfCurYrUnderThatHead integer
  IncOSDTAA.IncCYLA.HPlossCurYrSetoff integer
  IncOSDTAA.IncCYLA.BusLossSetoff integer
  IncOSDTAA.IncCYLA.OthSrcLossNoRaceHorseSetoff integer
* IncOSDTAA.IncCYLA.IncOfCurYrAfterSetOff integer
  TotalCurYr.TotHPlossCurYr integer
  TotalCurYr.TotBusLoss integer
  TotalCurYr.TotOthSrcLossNoRaceHorse integer
  TotalLossSetOff.TotHPlossCurYrSetoff integer
  TotalLossSetOff.TotBusLossSetoff integer
  TotalLossSetOff.TotOthSrcLossNoRaceHorseSetoff integer
  LossRemAftSetOff.BalHPlossCurYrAftSetoff integer
  LossRemAftSetOff.BalBusLossAftSetoff integer
  LossRemAftSetOff.BalOthSrcLossNoRaceHorseAftSetoff integer
```

Every leaf listed here has a place on screen (a matrix cell) — no leaf is
excluded.

---

## Appendix B · Every live row of the Schedule CYLA sheet, verbatim

```
r3  : [C3] Schedule CYLA | [F3] Details of Income after set-off of current years losses
r4  : [D4] Serial No. | [E4] Head/ Source of Income | [F4] Income of current year (Fill this column only if income is zero or positive) | [G4] House property loss of the current year set off Total loss (4 of Schedule –HP) | [H4] Business Loss (other than speculation or specified business loss) of the current year set off Total | [I4] Other sources loss (other than loss from race horses) of the current year set off Total loss (6 of Schedule OS) | [J4] Current year's Income remaining after set off
r5  : [J5] 5=1-2-3-4
r6  : [E6] Loss to be adjusted
r7  : [D7] i | [E7] House property
r8  : [D8] ii | [E8] Income from Business (excluding speculation profit and income from specified business or profession)
r9  : [D9] iii | [E9] Speculative Income
r10 : [D10] iv | [E10] Specified Business Income u/s 35AD
r14 : [D14] v | [E14] Short-term capital gain taxable @ 20%,
r15 : [D15] vi | [E15] Short-term capital gain taxable @ 30%,
r16 : [D16] vii | [E16] Short-term capital gain taxable at applicable rates,
r17 : [D17] viii | [E17] Short-term capital gain taxable at special rates in India as per DTAA
r19 : [D19] ix | [E19] Long term capital gain taxable @ 12.5%,
r21 : [D21] x | [E21] Long term capital gains taxable at special rates in India as per DTAA
r22 : [D22] xi | [E22] Net Income from Other sources (excluding profit from owning race horses and winnings from lottery)
r23 : [D23] xii | [E23] Profit from the activity of owning and maintaining race horses
r24 : [D24] xiii | [E24] Income from other sources taxable at special rates in India as per DTAA
r25 : [D25] xiv | [E25] Total loss set-off
r26 : [D26] xv | [E26] Loss remaining after set-off
r51 : [E51] Do you want to edit the details auto-populated in table above ? | [I51] No
```

Hidden rows not built this year: **r11** (v Short-term capital gain — combined),
**r12** (vi Long term capital gain — combined), **r13** (va Short-term capital gain
taxable @ 15%), **r18** (ixa Long term capital gain taxable @ 10%), **r20** (x
Long-term capital gain taxable @ 20%) — the pre-23-July-2024 rate slots.

---

## Appendix C · The dropdown

### Edit the auto-populated table? (`CYLAEditFlag`) — cell I51
`No` · `Yes`.

On **Yes** the set-off cells become typeable and the utility's validators (the
two-lakh HP cap of A354, the col 2+3+4 ≤ col 1 check of A375, the col-5 identity
of A363) run against the entered figures.
