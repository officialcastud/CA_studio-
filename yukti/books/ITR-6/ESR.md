# The book of Schedule ESR — Expenditure on Scientific Research · ITR-6, A.Y. 2026-27

Read row by row from the utility's **ESR** sheet (15 rows, no hidden rows), the
formulas in columns F, G and the hidden helper column K, and confirmed against
the CBDT ITR-6 schema's `ScheduleESR` and the validation-rules document. Nothing
here is invented; every heading, item number and section reference is the
department's own.

---

## 1 · The shape — one grid, nine claim rows and a total

Schedule ESR is the **weighted-deduction working for scientific-research and
skill-development expenditure** under section 35 / 35CCC / 35CCD. It is a single
grid: one row per eligible section, four money columns, and a Total row (x).

Its whole reason for existing is that the deduction the Act allows can be **more**
than the amount the company put through its profit-and-loss account (the old
150% / 200% weighted deductions), so the excess has to be added back as a
separate deduction in Schedule BP — and, the other way, if the amount debited
to P&L is **more** than what the Act allows, the shortfall has to be added back
as income in Schedule BP. The four columns are exactly that reconciliation.

| Part | What it is |
|---|---|
| **Rows i–ix** | one line per section — 35(1)(i), 35(1)(ii), 35(1)(iia), 35(1)(iii), 35(1)(iv), 35(2AA), 35(2AB), 35CCC, 35CCD |
| **Row x** | **Total** |

The sheet header (E3): *"Expenditure on scientific Research etc. (Deduction under
section 35 or 35CCC or 35CCD)."*

---

## 2 · The grid, column by column

The four columns, from the sheet's own header row (r4):

| Col | Sheet header | Kind | Schema key |
|---|---|---|---|
| **(1)** | Expenditure of the nature referred to in section | label (the section) | — |
| **(2)** | Amount, if any, debited to statement of profit and loss | amount entered | `AmtDebPL` |
| **(3)** | Amount of deduction allowable | amount entered | `AmtUs35Allowable` |
| **(4)** | Amount of deduction in excess of the amount debited to statement of profit and loss (4) = (3) − (2) | **computed** | `ExcessAmtOverDebPL` |

Column (4) is `MAX(0, F − E)` in the sheet (cell G5 = `MAX(0,F5-E5)`): only the
positive excess of allowable over debited is carried here. The hidden helper
column **K** holds the mirror figure `MAX(E − F, 0)` (K5 = `MAX(E5-F5,0)`) — the
amount by which the P&L debit **exceeds** the allowable deduction, i.e. the
shortfall that must be added back as income in Schedule BP. Column K is not on
screen and is not a schema field; it is the sheet's own arithmetic for the BP
feed (see §5). **Read it — it is the rule for what flows to BP item 24(c).**

---

## 3 · The rows — section by section (item numbers from the rules document)

Each row carries three amounts: debited to P&L (2), allowable (3), excess (4).
The item letters i–x are the sheet's own; the sections are column (1).

| Item | Section (col 1) | Row | Schema object |
|---|---|---|---|
| **i** | 35(1)(i) — revenue expenditure on in-house scientific research | r5 | `Section35_1_i` |
| **ii** | 35(1)(ii) — sum paid to an approved research association / university / college / institution | r6 | `Section35_1_ii` |
| **iii** | 35(1)(iia) — sum paid to an approved company for scientific research | r7 | `Section35_1_iia` |
| **iv** | 35(1)(iii) — sum paid for research in social science or statistical research | r8 | `Section35_1_iii` |
| **v** | 35(1)(iv) — capital expenditure on in-house scientific research | r9 | `Section35_1_iv` |
| **vi** | 35(2AA) — sum paid to a National Laboratory / University / IIT for an approved programme | r10 | `Section35_2AA` |
| **vii** | 35(2AB) — in-house R&D expenditure by a company on an approved facility | r11 | `Section35_2AB` |
| **viii** | 35CCC — expenditure on a notified agricultural extension project | r12 | `Section35_CCC` |
| **ix** | 35CCD — expenditure on a notified skill-development project | r13 | `Section35_CCD` |
| **x** | **Total** | r14 | `TotUs35` |

Each object nests one `DeductUs35` group with the three leaves `AmtDebPL`,
`AmtUs35Allowable`, `ExcessAmtOverDebPL`.

**Note on the sheet (r15):** *"In case any deduction is claimed under sections
35(1)(ii) or 35(1)(iia) or 35(1)(iii) or 35(2AA), please provide the details as
per Schedule RA."* — the donee-by-donee particulars of those payments live in
Schedule RA (the research-association schedule), not here; ESR carries only the
amounts.

---

## 4 · The rules the sheet computes (from its formulas and the rules document)

| Cell / rule | What it enforces |
|---|---|
| **G5:G13** = `MAX(0, F − E)` | column (4) = the positive part of (3) − (2), per row |
| **K5:K13** = `MAX(E − F, 0)` | hidden: the positive part of (2) − (3) — the shortfall, per row |
| **E14** = `SUM(E5:E13)` | Total column (2) |
| **F14** = `SUM(F5:F13)` | Total column (3) |
| **G14** = `MAX(0, SUM(G5:G13))` | Total column (4) — item x(4) |
| **K14** = `SUM(K5:K13)` | Total shortfall (hidden) |
| **Rule A330** | Sl. No. 4 [(4) = (3) − (2)] and Sl. No. 3 − Sl. No. 2 must be consistent |
| **Rule A331** | Sl. No. x = sum of Sl. No. (c) [35(1)(i)] + ii + iii + iv + v + vi + vii + viii + ix |
| **Rule A255** | in Schedule ESR, deduction u/s 35(1)(ii), 35(1)(iia), 35(1)(iii), 35(2AA) or 35CCC **cannot be claimed if section 115BAA or 115BAB is opted** (the concessional-rate regime disallows these weighted deductions) |

---

## 5 · Cross-sheet feeds — in and out

**Into ESR:** nothing computed from other sheets; the company enters columns (2)
and (3) directly. Column (1) sections are fixed labels.

**Out of ESR — the two BP feeds (the reason the schedule exists):**

| From ESR | To | Rule |
|---|---|---|
| **Total column (4)** — item x(4), the excess of allowable over debited | Schedule **BP item 29** — "Amount of deduction under section 35 or 35CCC or 35CCD in excess of the amount debited to P&L (item X(4) of Schedule ESR)" — a **deduction** in BP | **A212** (BP A29 = total of column (4) of Schedule ESR) |
| **Absolute value of the total of the negative "col 3 − col 2"** across all rows (the hidden column K total) | Schedule **BP item 24(c)** — "Others", an **addition** back to income | **A235** (BP 24(c) = min of the absolute value of the total of negative values of "col 3 − col 2" of all ESR fields) |

The sheet's own note on the BP side (BP r103): *"if amount deductible under
section 35 or 35CCC or 35CCD is lower than amount debited to P&L account, it will
go to item 24."* That is the column-K path.

Schedule **RA** carries the donee particulars for rows ii, iii, iv and vi (the
r15 note) — RA is a separate sheet, in the deductions section.

---

## 6 · What is mandatory

The schema marks the whole `DeductionUs35` object required, and under it every
section object and its three leaves (`AmtDebPL`, `AmtUs35Allowable`,
`ExcessAmtOverDebPL`) — so all ten rows × three columns are present in the block,
written at zero where the company has no claim. Every amount is a non-negative
integer, maximum 99999999999999.

**Schema leaf keys** (block `ScheduleESR`, all under
`DeductionUs35.<Section>.DeductUs35`): `AmtDebPL`, `AmtUs35Allowable`,
`ExcessAmtOverDebPL`, across `Section35_1_i`, `Section35_1_ii`, `Section35_1_iia`,
`Section35_1_iii`, `Section35_1_iv`, `Section35_2AA`, `Section35_2AB`,
`Section35_CCC`, `Section35_CCD`, `TotUs35`.

---

## 7 · Dropdowns and hidden rows

- **No dropdowns with value lists.** The two data-validation ranges on the sheet
  (G5:G13 and E5:E14 F14:G14) are numeric constraints only (no enum values).
- **No hidden rows.** Every row i–x is live and built. The only hidden element is
  helper **column K** (the shortfall arithmetic), described in §2 and §5 — read,
  not shown, not a schema field.

---

## 8 · What this means for the build

1. **A single grid**, nine section rows plus a Total, three money columns per row
   ((2) debited, (3) allowable, (4) excess), with column (4) computed green as
   `MAX(0, (3) − (2))`.
2. **Carry the hidden K arithmetic** — `MAX((2) − (3), 0)` — even though it is not
   on screen and not exported, because its total is what feeds BP 24(c).
3. **Total row x** sums (2), (3) and (4); x(4) feeds BP item 29.
4. **Gate the weighted deductions on the regime** — under 115BAA / 115BAB the
   rows for 35(1)(ii), (iia), (iii), 35(2AA) and 35CCC are not allowable (A255).
5. **Link to Schedule RA** for the donee particulars of the associations rows —
   a check when those rows carry a value.
