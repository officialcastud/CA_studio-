# The book of Schedule UD — unabsorbed depreciation and the s.35(4) allowance · ITR-6, A.Y. 2026-27

Read row by row from the utility's **Unabsorbed Depreciation** sheet
(`sheet33.xml`, 19 rows, 0 hidden), with the helper columns and the sheet's own
formulas; confirmed against the CBDT ITR-6 schema's `ITRScheduleUD`, and against
the validation-rules document (serials A569–A574). Nothing here is invented.

Schedule UD is a sibling ledger to the loss chain. It is **not** a loss
carry-forward (that is Schedule CFL); it is the ledger of **unabsorbed
depreciation** and the **capital-expenditure allowance under section 35(4)**,
both of which a company carries forward **without any time limit**. Its two
set-off columns feed **Schedule BFLA** columns 3 and 4.

---

## 1 · What Schedule UD is

`D3` **Schedule UD** · `H3` **Unabsorbed depreciation and allowance under
section 35(4)**. Two ledgers side by side, one row per assessment year:
- the left half tracks **unabsorbed depreciation** (s.32(2));
- the right half tracks the **allowance under section 35(4)** (capital
  expenditure on scientific research).

`D4` carries the whole sheet's gating note, verbatim:
**(Note: If no entry is made in first row then other rows will not be
considered)** — the first data row must be filled for any later row to count.

Both amounts carry forward **indefinitely** (no eight-year window), which is why
they live here rather than in Schedule CFL.

---

## 2 · Column headers, verbatim (read the whole header — the item numbers live there)

The header spans rows 5–6. The item numbers in parentheses are the sheet's /
rules document's own (used by rules A569–A574):

| Half | Cell | Header text (verbatim) | Schema key |
|---|---|---|---|
| — | `D6` | **Sl No (1)** | (row index) |
| — | `E6` | **Assessment Year (2)** | `ScheduleUD[].AssYr` / `CurrAssYr` |
| Depreciation (`F5` **Depreciation**) | `F6` | **Amount of brought forward unabsorbed depreciation (3)** | `ScheduleUD[].AmtBFUD` |
| Depreciation | `G6` | **Amount as adjusted on account of opting for taxation under section 115BAA (3a)** | `ScheduleUD[].AmtAdjOptTaxUs115BAA` |
| Depreciation | `H6` | **Amount of depreciation set-off against the current year income (4)** | `ScheduleUD[].AmtDeprSOCY` |
| Depreciation | `I6` | **Balance Carried forward to the next year (5)** | `ScheduleUD[].BalCFNY` / `CurBalCFNY` |
| Allowance (`J5` **Allowance under section 35(4)**) | `J6` | **Amount of brought forward unabsorbed allowance (6)** | `ScheduleUD[].AmtBFUAllow` |
| Allowance | `K6` | **Amount of allowance set-off against the current year income (7)** | `ScheduleUD[].AmtAllowSOCY` |
| Allowance | `L6` | **Balance Carried forward to the next year (8)** | `ScheduleUD[].AllowBalCFNY` / `CurAllowBalCFNY` |

---

## 3 · The rows

| Row | Cell | Content | Schema |
|---|---|---|---|
| first data row | `E7` = **2026-27** | the current assessment year; `D8 = D7+1` auto-increments the Sl.No down the list | `CurrAssYr` + first `ScheduleUD[]` entry |
| rows 8–14 | `E8:E14` (dropdown, named list `7`) | the earlier assessment years carrying unabsorbed depreciation / allowance | further `ScheduleUD[]` entries |
| total | `E15` = **Total** | column totals (row 15) | the `Tot…` keys (§5) |

The list is a **repeatable array** (`ScheduleUD[]`), one object per assessment
year, with **no year limit** — a company may carry unabsorbed depreciation
indefinitely. There are **no hidden rows** on this sheet.

---

## 4 · The formulas (computed columns) and the rules

Per row (from the sheet's own formulas):
- `I8 = MAX((F8 − G8 − H8), 0)` — balance depreciation c/f = brought-forward −
  115BAA adjustment − set-off this year. Rule **A571**: 5 = 3 − 3a − 4.
- `L8 = MAX((J8 − K8), 0)` — balance allowance c/f = brought-forward − set-off.
  Rule **A572**: 8 = 6 − 7.

The gating and cap rules from the validation-rules document:
- **A569**: 3a (`AmtAdjOptTaxUs115BAA`) can be entered **only if** the assessee
  opts for taxation u/s 115BAA.
- **A570**: 4 (depreciation set off) **cannot be more than 3 − 3a** in any row.
- **A571**: 5 = 3 − 3a − 4 (balance c/f).
- **A572**: 8 = 6 − 7 (allowance balance c/f).
- **A573**: the sum of individual rows must match the Total-row value for every
  column, 3 through 8.
- **A574**: 4 (depreciation set off) for the current assessment year cannot
  exceed 12iii of Schedule BP (the income available to absorb depreciation).

---

## 5 · The totals (row 15) and their schema keys

| Cell | Formula | Schema key |
|---|---|---|
| `F15` | `SUM(UD.BF)` | `TotBFUDepritAmt` |
| `G15` | `SUM(UD.115BAA)` | `TotAmtAdjOptTaxUs115BAA` |
| `H15` | `SUM(UD.Setoff)` | `TotCurYrdepritSetoffInc` |
| `I15` | `SUM(UD.Balance) + UDCY.Balance` | `TotDepritBalCFNY` |
| `J15` | `SUM(UD2.BF)` | `TotBFUAllowAmt` |
| `K15` | `SUM(UD2.Setoff)` | `TotCurYrAllowSetoffInc` |
| `L15` | `SUM(UD2.Balance) + UDCY2.Balance` | `TotalBalCFNY` |

Top-level current-year fields: `CurrAssYr` (the current AY string),
`CurBalCFNY` (the current-year depreciation balance c/f) and `CurAllowBalCFNY`
(the current-year allowance balance c/f).

---

## 6 · Every schema leaf key (so nothing is lost on filing)

Top level: `CurrAssYr`, `CurBalCFNY`, `CurAllowBalCFNY`; the totals
`TotBFUDepritAmt`, `TotAmtAdjOptTaxUs115BAA`, `TotCurYrdepritSetoffInc`,
`TotDepritBalCFNY`, `TotBFUAllowAmt`, `TotCurYrAllowSetoffInc`, `TotalBalCFNY`;
and the repeatable array `ScheduleUD[]` with, per entry: `AssYr`, `AmtBFUD`,
`AmtAdjOptTaxUs115BAA`, `AmtDeprSOCY`, `BalCFNY`, `AmtBFUAllow`, `AmtAllowSOCY`,
`AllowBalCFNY`.

No leaf is excluded — every column of the ledger and every total has a place on
screen.

---

## 7 · The enums / dropdowns on this sheet

There are **no value-list dropdowns** with fixed enum members. The
data-validation entries are numeric constraints (`0`) or reference a named list
for the Assessment-Year cells (`E7:E14`, source `7`) that resolves to a year
list, not a fixed enum. So there are no enum ranges to seed.

---

## 8 · What flows in and out (cross-sheet feeds)

**Out to Schedule BFLA:** the depreciation set-off pool `SUM(UD.Setoff)` (this
sheet's column 4) feeds BFLA column 3 (`H34 = SUM(UD.Setoff)`); the allowance
set-off pool `SUM(UD2.Setoff)` (column 7) feeds BFLA column 4
(`I34 = SUM(UD2.Setoff)`). Rules **A536** (BFLA 3xv = total of UD col 4) and
**A535** (BFLA 4xv = total of UD col 7) close the loop.

**In:** column 4 (current-year depreciation set off) is capped by 12iii of
Schedule BP (rule A574); the brought-forward amounts (columns 3 and 6) are the
filer's opening balances from last year's return; 3a is driven by the 115BAA
option.

Unlike Schedule CFL (losses, time-limited) and unlike a brought-forward *loss*
in BFLA, unabsorbed depreciation and the s.35(4) allowance may be set against
**any** head of income in BFLA, including other sources.

---

## 9 · What repeats and what does not

`ScheduleUD[]` is a **repeatable array**, one row per assessment year, unbounded.
The four balance/total columns (5, 8, and the Total row) are computed; the filer
types the assessment year, the brought-forward amounts (3, 6), the 115BAA
adjustment (3a, only when opting), and the set-off amounts (4, 7).

---

## 10 · What ITR-6 has here that ITR-2 does not

ITR-2 has **no Schedule UD at all** — an individual/HUF without business income
has no unabsorbed depreciation or s.35(4) allowance to carry. The whole schedule,
and the two extra brought-forward columns it feeds into Schedule BFLA
(depreciation and the s.35(4) allowance), are specific to the business forms.

---

## 11 · What this means for the build

1. **Schedule UD is a repeatable year table** with two ledgers (depreciation and
   the s.35(4) allowance), the first-row gating note (D4), no time limit and no
   hidden rows.
2. **Computed columns** — 5 = 3 − 3a − 4 (A571), 8 = 6 − 7 (A572), the Total row
   (A573) — are green and untypeable; 3a is gated on the 115BAA option (A569);
   column 4 is capped at 3 − 3a (A570) and, for the current year, at BP 12iii
   (A574).
3. **Feeds** — the two set-off column totals feed BFLA columns 3 and 4 (A535/A536).
4. **Export** — `ITRScheduleUD` with `CurrAssYr`, the current-year balances, the
   `ScheduleUD[]` array (one entry per year that carries an amount) and the seven
   totals, validated against the schema.
