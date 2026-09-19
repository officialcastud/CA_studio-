# The book of Schedule IT — Advance tax and Self-Assessment tax · ITR-6, A.Y. 2026-27

Read row by row from the utility's **IT** sheet (25 rows, rows 2–12 hidden
helper), with the hidden-row flags and the helper-column formulas, and confirmed
against the schema's `ScheduleIT` block. One sheet → one schema block; no
sheet-name/schema offset here (contrast the TDS sheet, whose labels are offset
one place from the schema blocks — see `books/ITR-6/TDS.md`).

The sheet is a single repeatable table of tax-payment challans. The utility does
**not** ask the filer to say whether a challan is advance tax or
self-assessment tax; it decides that from the **date of deposit** in a hidden
helper column, and it also buckets each challan into its 234C instalment
quarter. The display sheet shows the challan rows; the hidden rows 2–12 and the
helper columns S–X show the method.

---

## 1 · The shape — one table, feeding two lines of Part B-TTI

| Table | Item on the sheet | What it is | Feeds |
|---|---|---|---|
| **IT** | **15A** | Advance tax and self-assessment tax challans (Details of payments of Advance Tax and Self-Assessment Tax) | Part B-TTI **10a** (advance) and **10d** (self-assessment) |

The table is repeatable and unlimited (the utility ships six challan rows,
E18:I23, and grows). The table ends in a total (`I24`) that the schema marks
required even at zero (`TotalTaxPayments`).

**The Part B-TTI offset for ITR-6.** ITR-2 fed advance/self-assessment into 15a
and 15d; on **ITR-6 the same totals feed 10a and 10d** (rules A775, A776, and
the sheet's own NOTE at F25: *"Enter the totals of Advance tax and
Self-Assessment tax in Sl No. 10a & 10d of Part B-TTI"*). Item **10e** = 10a +
10b + 10c + 10d (rule A764).

---

## 2 · IT — the challan table (rows 15–24)

*Tax Payments — Details of payments of Advance Tax and Self-Assessment Tax*
(E15). Header row **D16 "TAX PAYMENTS"**; column headers at row 16. One row per
challan (E18:I23, then grown).

| Col | Sheet cell | Field (label) | Type / rule | Schema key |
|---|---|---|---|---|
| 1 | E16 | Sl.No | serial, auto | — |
| 2 | F16 | **BSR Code** | required — seven characters (data-validation length 7 on F18:F23) | `BSRCode` |
| 3 | G16 | **Date of Deposit (DD/MM/YYYY)** | required; shown `DD/MM/YYYY`, filed `YYYY-MM-DD`. For A.Y. 2026-27 a deposit on/after 2025-04-01 | `DateDep` |
| 4 | H16 | **Serial Number of Challan** | required, integer (0…99999999999999) | `SrlNoOfChaln` |
| 5 | I16 | **Amount (Rs)** | required, integer (0…99999999999999) | `Amt` |
| — | I24 | **Total** | computed — `MAX(0, SUM(IT.Amt))` | `TotalTaxPayments` |

Schema: `ScheduleIT.TaxPayment[]` — `{BSRCode, DateDep, SrlNoOfChaln, Amt}`,
plus the table total `TotalTaxPayments`. `ScheduleIT` `required: [TotalTaxPayments]`;
inside each `TaxPayment` element, `BSRCode`, `DateDep`, `SrlNoOfChaln` and `Amt`
are all required.

The sheet's NOTE (D25 / F25): *"Enter the totals of Advance tax and
Self-Assessment tax in Sl No. 10a & 10d of Part B-TTI."*

---

## 3 · The hidden method — how advance is split from self-assessment (rows 2–18, cols S–X)

Rows **2–12 are hidden** (quarter/SAT SUMIF accumulators, e.g.
`SUMIF(FormulaofSAT,"=12",IT.Amt)`); they are **not built** — they are the
utility's internal running sums. The live rows carry the same method in the
helper columns S–X (visible but not fillable):

- **S18** `= VALUE(MID(G18,7,4))` — the **Year** of the deposit (S17 "Year").
- **T18** `= VALUE(MID(G18,1,2))` — the **Day** (T17 "Day");
  **U18** `= VALUE(MID(G18,4,2))` — the **Month** (U17 "Month").
- **V18** (FormulaOfS) `= IF(S18>2026, 2, IF(S18>=2026, IF(U18>=4, 2, 1), 1))`
  — the split flag: **1 = advance, 2 = self-assessment (SAT)**.

So a challan whose **date of deposit is on or before 31 March 2026 is advance
tax**; a challan **on or after 1 April 2026 is self-assessment tax**. There is
no dropdown to choose — the date decides. This matches rules **A775** (advance =
sum of Schedule-IT tax paid with date of deposit between 01/04/2025 and
31/03/2026) and **A776** (self-assessment = sum where date of deposit is after
31/03/2026).

The two totals are formed at rows 15–16:
- **U15 "AT"**, **V15** `= SUMIF(IT.FormulaOfS,"<2",IT.Amt)` — **Advance tax total** → Part B-TTI **10a**.
- **U16 "SAT"**, **V16** `= SUMIF(IT.FormulaOfS,">=2",IT.Amt)` — **Self-Assessment tax total** → Part B-TTI **10d**.

### The 234C quarter placement

The same helper columns place each advance-tax challan in its instalment quarter
from the month, for interest under 234C:
- **X18** `= IF(S18<=2026, IF(V18>1, IF(U18<4, U18+9, U18-3), 0), U18+9)` — the
  month re-based to the tax year (April = 1), used by the quarter SUMIFs
  (`FormulaofQ`, `FormulaofSAT`) in the hidden rows to bucket into: up to 15
  June · 16 June–15 Sept · 16 Sept–15 Dec · 16 Dec–15 Mar · after 15 Mar.
- **V8** (hidden) "Quarter Income Break up" heads that hidden accumulator area.

### The State-code / Tamil & Pondicherry helper (S15–T16)

- **S15 "State Code"**, **T15** `= MID(sheet1.StateCode1,1,2)` — the first two
  digits of the company's state code.
- **S16 "Tamil & Pondicherry Case"**, **T16** `= IF(OR(T15="03","04","20",
  "21","22","23","30"), FALSE, FALSE)` — a state-code flag the utility keeps for
  due-date handling. In this build it evaluates to FALSE either way (both
  branches return FALSE); it is a **helper, not a filed field** — read, not
  shown as an input.

---

## 4 · Dropdowns

The IT sheet carries only **length/number data-validations** (BSR-code length 7
on F18:F23, challan number on H18:H23, amount on I18:I23, date on G18:G23) — none
are value lists. There are **no enumerated dropdowns** on this sheet, so nothing
to seed from `enums.json` here.

---

## 5 · What is mandatory

| Level | Required |
|---|---|
| Each challan row | `BSRCode`, `DateDep`, `SrlNoOfChaln`, `Amt` |
| The table | `TotalTaxPayments` (present even at zero) |

Rule **A785**: in Schedule IT, the total of col 5 (Amount) must equal the sum of
the individual challan amounts — i.e. `TotalTaxPayments` = Σ `Amt`.

---

## 6 · What repeats

The challan table (`TaxPayment[]`), unlimited. Nothing else.

---

## 7 · Cross-sheet feeds

| Out of Schedule IT | Into |
|---|---|
| Advance tax total (V15, date ≤ 31/03/2026) | Part B-TTI **10a** (rule A775) |
| Self-assessment tax total (V16, date ≥ 01/04/2026) | Part B-TTI **10d** (rule A776) |
| Quarter breakup (X-columns) | 234C interest computation (hidden **Tax** sheet) |

Item **10e** of Part B-TTI = 10a + 10b + 10c + 10d (rule A764), where 10b is the
TDS total and 10c the TCS total from `books/ITR-6/TDS.md`.

---

## 8 · What this means for the build

1. **One four-input row** — BSR code, date of deposit, serial number of challan,
   amount — repeatable, with the computed table total `TotalTaxPayments` shown
   green and untypeable.
2. **No advance/SAT dropdown.** The engine derives the split from the date:
   deposit ≤ 31 March 2026 → advance (→ 10a); deposit ≥ 1 April 2026 → SAT
   (→ 10d). Encode from V18's formula, not from a chooser.
3. **The 234C quarter** is derived from the month for the interest computation;
   the hidden accumulators are the method, not fields.
4. **Date format**: display `DD/MM/YYYY`, export `DateDep` as `YYYY-MM-DD`; the
   round-trip must preserve it.
5. **Export** — every row to `ScheduleIT.TaxPayment[]`, the total present even at
   zero; feed 10a and 10d of Part B-TTI (the ITR-6 numbering, not ITR-2's 15a/15d).

---

## 9 · Live-row / hidden-row ledger

- **Live rows** carrying labels or inputs: 1 (none here), 13 (helper flag), 15,
  16, 17, 18–23 (challan input rows), 24 (total), 25 (note). Challan input rows
  E18:I23 grow unlimited.
- **Hidden rows (not built):** 2–12 — the quarter/SAT SUMIF accumulators.
- **Helper columns S–X on live rows** (S15/S16 state-code flags, S17–U17 year/day/month,
  V/W/X split-and-quarter formulas) are **read, not shown as inputs**; the only
  fillable cells are F/G/H/I of the challan rows.
- **Excluded rows:** none with a filed schema key beyond the four inputs and the
  total; every live input row maps to `ScheduleIT.TaxPayment[]`.
