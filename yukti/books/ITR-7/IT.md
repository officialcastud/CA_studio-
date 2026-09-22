# The book of Schedule IT — Advance tax and Self-Assessment tax · ITR-7, A.Y. 2026-27

Read row by row from the utility's **IT** sheet (24 live rows, rows 1–5 hidden
quarter helpers), with the hidden-row flags and the helper-column formulas, and
confirmed against the schema's `ScheduleIT` block. One sheet → one schema block;
there is no sheet-name/schema offset here (contrast the **TDS** sheet, whose
labels are offset one place from the schema blocks — see `books/ITR-7/TDS.md`).

The sheet is a single repeatable table of tax-payment challans. The utility does
**not** ask the filer to say whether a challan is advance tax or
self-assessment tax; it decides that from the **date of deposit** (a helper
column) and it also buckets each challan into its 234C instalment quarter for
the interest computation. The visible sheet shows the challan rows; the hidden
rows 1–5 (Quarter 5…Quarter 1) and the helper columns N–W carry the method.

**This is the trust/institution return.** Item numbering into Part B-TTI is
**9a / 9d** (advance / self-assessment) on ITR-7 — not ITR-6's 10a/10d, not
ITR-2's 15a/15d. The sheet's own NOTE (C24) says so: *"Enter the totals of
Advance tax and Self-Assessment tax in Sl No. 9a & 9d of Part B-TTI."*

---

## 1 · The shape — one table, feeding two lines of Part B-TTI

| Table | Item | What it is | Feeds |
|---|---|---|---|
| **IT** | **15A** | Advance tax and self-assessment tax challans (Details of Advance Tax and Self Assessment Tax Payments) | Part B-TTI **9a** (advance) and **9d** (self-assessment) |

The table is repeatable and unlimited (the utility ships six challan rows,
E14:H19, and grows). The table ends in a total (`H21`) that the schema marks
required even at zero (`TotalTaxPayments`). Part B-TTI **9e** = 9a + 9b + 9c +
9d (rule **A628**).

---

## 2 · IT — the challan table (rows 11–21)

*Details of Advance Tax and Self Assessment Tax Payments* (D12). Header row
**D11 "TAX PAYMENTS"**; column headers at row 13. One row per challan
(E14:H19, then grown).

| Col | Sheet cell | Field (label) | Type / rule | Schema key |
|---|---|---|---|---|
| 1 | D13 | Sl. No. | serial, auto | — |
| 2 | E13 | **BSR Code** | required — seven characters (data-validation length 7 on E14:E19) | `TaxPayment[].BSRCode` |
| 3 | F13 | **Date of Deposit (DD/MM/YYYY)** | required; shown `DD/MM/YYYY`, filed `YYYY-MM-DD`. For A.Y. 2026-27 a deposit on/after 2025-04-01 | `TaxPayment[].DateDep` |
| 4 | G13 | **Serial Number of Challan** | required, integer | `TaxPayment[].SrlNoOfChaln` |
| 5 | H13 | **Amount (Rs)** | required, integer | `TaxPayment[].Amt` |
| — | H21 | **Total** | computed — `MAX(0, SUM(IT.Amt))` | `TotalTaxPayments` |

Schema: `ScheduleIT.TaxPayment[]` — `{BSRCode, DateDep, SrlNoOfChaln, Amt}`,
plus the table total `TotalTaxPayments`. `ScheduleIT` `required:
[TotalTaxPayments]`; inside each `TaxPayment` element, `bsrcode`, `datedep`,
`srlnoofchaln` and `amt` are all required.

Rule **A641**: in Schedule IT, the *"Total"* of Column 5 "Amount" must equal the
sum of the amounts entered in the individual rows — i.e. `TotalTaxPayments` = Σ
`Amt`.

---

## 3 · The hidden method — how advance is split from self-assessment (rows 1–5, cols N–W)

Rows **1–5 are hidden** (`Quarter 5`, `Quarter 4`, `Quarter 3`, `Quarter 2`,
`Quarter 1` — the 234C instalment-quarter accumulators); they are **not built**
— they are the utility's internal running sums. The live rows carry the same
method in the helper columns N–W (visible but not fillable):

- **N13 "Year"** = the year of the deposit (from the date string).
- **O13 "Day"**, **P13 "Month"** = the day and month of the deposit.
- **Q13 "b"** and the **"orignal" / "TN case"** helpers (U13, V13) plus the
  **`IF(N14<=2024,IF(Q14>1,IF(AND(P14=11,O14<=15),"B",P14-3),0),P14+9)`** re-based
  month formula at **W13** — used to place each advance-tax challan in its 234C
  instalment quarter (April re-based to 1). The header row 11 also carries the
  **"7 sisters 234c Flag"** (S11) and **"ExSAT2_New - Newly added by Jyoti for 15
  DEC Due Date extended"** (V11) helpers; row 12 carries **"TN and Pondicherry
  case"** (N12) and the **ExSAT / ExSAT1 / ExSAT2_New** extended-self-assessment
  columns (R12/T12/V12).

So a challan whose **date of deposit is on or before 31 March 2026 is advance
tax**; a challan **on or after 1 April 2026 is self-assessment tax**. There is
no dropdown to choose — the date decides. This matches rules **A631** (advance =
Schedule IT tax paid with date of deposit between 01/04/2025 and 31/03/2026 →
9a) and **A632** (self-assessment = Schedule IT tax paid with date of deposit
after 31/03/2026 → 9d). The 234C quarter buckets (up to 15 June · 16 June–15
Sept · 16 Sept–15 Dec · 16 Dec–15 Mar · after 15 Mar) drive the interest
computation on the hidden Tax sheet; the "7 sisters" / "TN and Pondicherry case"
helpers cover the extended due-date states.

---

## 4 · Dropdowns

The IT sheet carries only **length/number data-validations** (BSR-code length 7
on E14:E19, challan number on G14:G19, amount on H14:H19, date on F14:F19) —
none are value lists. There are **no enumerated dropdowns** on this sheet, so
nothing to seed from `enums.json` here.

---

## 5 · What is mandatory

| Level | Required |
|---|---|
| Each challan row | `BSRCode`, `DateDep`, `SrlNoOfChaln`, `Amt` |
| The table | `TotalTaxPayments` (present even at zero) |

---

## 6 · What repeats

The challan table (`TaxPayment[]`), unlimited. Nothing else.

---

## 7 · Cross-sheet feeds

| Out of Schedule IT | Into |
|---|---|
| Advance tax total (date ≤ 31/03/2026) | Part B-TTI **9a** (rule A631) |
| Self-assessment tax total (date ≥ 01/04/2026) | Part B-TTI **9d** (rule A632) |
| Quarter breakup (W-column) | 234C interest computation (hidden Tax sheet) |

Item **9e** of Part B-TTI = 9a + 9b + 9c + 9d (rule A628), where 9b is the TDS
total and 9c the TCS total from `books/ITR-7/TDS.md` and `books/ITR-7/TCS.md`.

---

## 8 · What this means for the build

1. **One four-input row** — BSR code, date of deposit, serial number of challan,
   amount — repeatable, with the computed table total `TotalTaxPayments` shown
   green and untypeable.
2. **No advance/SAT dropdown.** The engine derives the split from the date:
   deposit ≤ 31 March 2026 → advance (→ 9a); deposit ≥ 1 April 2026 → SAT
   (→ 9d). Encode from the helper month/year formula, not from a chooser.
3. **The 234C quarter** is derived from the month for the interest computation;
   the hidden Quarter-1…Quarter-5 accumulators are the method, not fields.
4. **Date format**: display `DD/MM/YYYY`, export `DateDep` as `YYYY-MM-DD`; the
   round-trip must preserve it.
5. **Export** — every row to `ScheduleIT.TaxPayment[]`, the total present even at
   zero; feed 9a and 9d of Part B-TTI (the ITR-7 numbering).

---

## Appendix A · Every schema leaf of `ScheduleIT` (verbatim; * = required)

```
  TaxPayment[]                    array
* TaxPayment[].BSRCode           string
* TaxPayment[].DateDep           string
* TaxPayment[].SrlNoOfChaln      integer
* TaxPayment[].Amt               integer
* TotalTaxPayments               integer
```

## Appendix B · Every live-row label on the IT sheet (verbatim from `tools/dump.py`)

Hidden rows are marked **H** and are **not built**. Text is as the utility
stores it (helper-column formulas included verbatim).

```
r   1H: [P1] Quarter 5
r   2H: [P2] Quarter 4
r   3H: [P3] Quarter 3
r   4H: [P4] Quarter 2
r   5H: [P5] Quarter 1
r  11 : [D11] TAX PAYMENTS  |  [M11] Self Assessment  |  [O11] Advance Tax  |  [S11] 7 sisters 234c Flag  |  [V11] ExSAT2_New - Newly added by Jyoti for 15 DEC Due Date extended
r  12 : [C12] A  |  [D12] Details of Advance Tax and Self Assessment Tax Payments  |  [N12] TN and Pondicherry case  |  [R12] ExSAT  |  [T12] ExSAT1  |  [V12] ExSAT2_New
r  13 : [D13] Sl. No.  |  [E13] BSR Code  |  [F13] Date of Deposit (DD/MM/YYYY)  |  [G13] Serial Number of Challan  |  [H13] Amount (Rs)  |  [N13] Year  |  [O13] Day  |  [P13] Month  |  [Q13] b  |  [U13] orignal  |  [V13] TN case  |  [W13] IF(N14<=2024,IF(Q14>1,IF(AND(P14=11,O14<=15),"B",P14-3),0),P14+9) - New IF(N14<=2024,IF(Q14>1,IF(AND
r  21 : [E21] Total
r  24 : [C24] Note: Enter the totals of Advance tax and Self-Assessment tax in Sl No. 9a & 9d of Part B-TTI
```

## Appendix C · Data-validations (no value lists)

```
E14:E19  BSR Code — length 7          (no enumerated values)
F14:F19  Date of Deposit — length 10  (no enumerated values)
G14:G19  Serial Number of Challan     (no enumerated values)
H14:H19  Amount (Rs)                  (no enumerated values)
```
