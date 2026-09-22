# The book of Schedule VDA — ITR-7, A.Y. 2026-27

Read row by row from the utility's **Schedule VDA** sheet and confirmed against
the CBDT ITR-7 schema block **ScheduleVDA**. This is the transaction-by-transaction
record of **income from transfer of Virtual Digital Assets** taxed under section
115BBH at a flat 30%. Its two totals feed the business-income and capital-gain
computations. Nothing here is invented; the appendices list every schema leaf,
every live row verbatim, and every dropdown value.

This is a **trust / institution** return (ITR-7), but Schedule VDA is identical in
shape to the company/individual VDA schedule — one flat table of transactions,
split by head into a Business total and a Capital-Gain total.

---

## 1 · Purpose and shape

One flat table, one row per transaction (row 3 note: *"Details of every transaction
are to be filled"* — VDA income is reported deal by deal, not netted). Row 3 title
"Income from transfer of Virtual Digital Assets". Row 4 is the seven-column header.
Rows 6–9 are the entry rows (each carrying a Head drop-down). Rows 11 and 12 are the
two totals, A and B.

Detail array: `ScheduleVDADtls[]`; the two totals `TotIncBusiness` and
`TotIncCapGain` are scalar keys.

---

## 2 · The columns (row 4)

| Col | Header label | Type | Schema key |
|---|---|---|---|
| 1 | Sl.No. | serial | — |
| 2 | Date of acquisition | date DD/MM/YYYY | `DateofAcquisition` |
| 3 | Date of Transfer | date DD/MM/YYYY | `DateofTransfer` |
| 4 | Head under which income to be taxed (Business/Capital Gain) | dropdown (3) | `HeadUndIncTaxed` |
| 5 | Cost of Acquisition (in case of gift: a. amount on which tax is paid u/s 56(2)(x) if any, b. else cost to previous owner; no deduction for infrastructure cost / interest) | integer | `AcquisitionCost` |
| 6 | Consideration Received | integer | `ConsidReceived` |
| 7 | Income from transfer of Virtual Digital Assets (enter nil in case of loss) (Col. 6 − Col. 5) | integer | `IncomeFromVDA` |

The rule in column 7 is the substance of section 115BBH: **income is consideration
minus only the cost of acquisition** — no other deduction, no set-off — and **a loss
is entered as nil** (a VDA loss is neither set off nor carried forward).

---

## 3 · The two totals (rows 11–12)

| Item | Label | Schema key |
|---|---|---|
| A | Total (Sum of all Positive Incomes of **Business** Income in Col. 7) | `TotIncBusiness` |
| B | Total (Sum of all Positive Incomes of **Capital Gain** in Col. 7) | `TotIncCapGain` |

Only **positive** incomes are summed (consistent with the "enter nil in case of loss"
rule), split by the head chosen in column 4.

---

## 4 · The law — section 115BBH

- Flat **30%** tax on income from transfer of any Virtual Digital Asset.
- **No deduction** in respect of any expenditure (other than cost of acquisition) or
  allowance is allowed.
- **No set-off** of any loss from transfer of a VDA against any other income; and the
  loss is **not carried forward**.
- Where the VDA was received as a gift, the cost of acquisition is (a) the amount on
  which tax was paid under section 56(2)(x), if any, else (b) the cost to the previous
  owner.
- The **Head** column routes each transaction's positive income either to the business
  head (Total A) or the capital-gains head (Total B).

---

## 5 · Cross-sheet feeds

**Out:** Item **A** (`TotIncBusiness`) → business-income / Schedule BP path; Item **B**
(`TotIncCapGain`) → the capital-gain VDA line of Schedule CG and, via Schedule SI, the
115BBH @30% special-rate line. Both ultimately land in the 115BBH special-rate
computation in Schedule SI and Part B.

**In:** transactions are entered directly; no other schedule feeds VDA.

---

## 6 · The dropdown

Column 4 (F6:F10) — **Head under which income to be taxed**: `(Select)` · Business
Income · Capital Gain.

---

## Appendix · Every schema leaf of block ScheduleVDA (full paths)
`*` = required.
```
* ScheduleVDADtls[] array
* ScheduleVDADtls[].DateofAcquisition string
* ScheduleVDADtls[].DateofTransfer string
* ScheduleVDADtls[].HeadUndIncTaxed string
* ScheduleVDADtls[].AcquisitionCost integer
* ScheduleVDADtls[].ConsidReceived integer
* ScheduleVDADtls[].IncomeFromVDA integer
* TotIncBusiness integer
* TotIncCapGain integer
```

## Appendix · Every live row of the sheet, verbatim
```
r   3 : [C3] Schedule VDA  |  [E3] Income from transfer of Virtual Digital Assets (Note: Details of every transaction are to be filled,
r   4 : [C4] Sl.No. (Col. 1)  |  [D4] Date of acquisition (Col. 2)  |  [E4] Date of Transfer (Col. 3)  |  [F4] Head under which income to be taxed (Business/Capital Gain) (Col. 4)  |  [G4] Cost of Acquisition (In case of gift; a. Enter the amount on which tax is paid u/s 56(2)(x) if any b  |  [H4] Consideration Received (Col. 6)  |  [I4] Income from transfer of Virtual Digital Assets (enter nil in case of loss) (Col. 6 – Col. 5) (Col. 7
r   6 : [F6] (Select)
r   7 : [F7] (Select)
r   8 : [F8] (Select)
r   9 : [F9] (Select)
r  11 : [F11] A  |  [G11] Total (Sum of all Positive Incomes of Business Income in Col. 7)
r  12 : [F12] B  |  [G12] Total (Sum of all Positive Incomes of Capital Gain in Col. 7)
```

## Appendix · Every dropdown value, verbatim

**Cells `F6:F10`** (source `"(Select),Business Income,Capital Gain"`) — 3 values:
```
(Select) | Business Income | Capital Gain
```
