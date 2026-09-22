# The book of Schedule VDA — ITR-6, A.Y. 2026-27

Read row by row from the utility's **VDA** sheet (rows 3–12; 9 live rows, no
hidden rows) and confirmed against the CBDT ITR-6 schema block **ScheduleVDA**.
This is the transaction-by-transaction record of **income from transfer of
Virtual Digital Assets** taxed under section 115BBH at a flat 30%. Its two totals
feed Schedule BP (business VDA income) and Schedule CG head C2 (capital-gain VDA
income). Nothing here is invented; Appendix 2 lists every schema leaf, Appendix 3
reproduces every live row verbatim.

---

## 1 · Purpose and shape

One flat table, one row per transaction (row 3 note: *"Detail of every
transaction are to be filled"* — VDA income is reported deal by deal, not
netted). Row 3 title "Income from transfer of Virtual Digital Assets". Row 4 is
the seven-column header. Rows 5–9 are the entry rows (each with a Head dropdown).
Rows 11 and 12 are the two totals, A and B.

Detail array: `ScheduleVDADtls[]`; the two totals are scalar keys.

---

## 2 · The columns, row 4

| Col | Header label | Type | Schema key |
|---|---|---|---|
| 1 | Serial number | serial | — |
| 2 | Date of Acquisition | date DD/MM/YYYY | DateofAcquisition |
| 3 | Date of Transfer | date DD/MM/YYYY | DateofTransfer |
| 4 | Head under which income to be taxed (Business/Capital Gain) | dropdown (3) | HeadUndIncTaxed |
| 5 | Cost of Acquisition (in case of gift: (a) amount on which tax paid u/s 56(2)(x) if any, (b) else cost to previous owner; no deduction for infra cost/interest) | integer | AcquisitionCost |
| 6 | Consideration Received | integer | ConsidReceived |
| 7 | Income from transfer of Virtual Digital Assets (enter nil in case of loss) (Col. 6 − Col. 5) | integer | IncomeFromVDA |

The rule in column 7 is the substance of section 115BBH: **income is
consideration minus only the cost of acquisition** — no other deduction, no
set-off — and **a loss is entered as nil** (a VDA loss is neither set off nor
carried forward).

---

## 3 · The two totals (rows 11–12)

| Item | Label | Schema key |
|---|---|---|
| A | Total (Sum of all Positive Incomes of **Business** Income in Col. 7) | TotIncBusiness |
| B | Total (Sum of all Positive Incomes of **Capital Gain** in Col. 7) | TotIncCapGain |

Only **positive** incomes are summed (consistent with the "enter nil in case of
loss" rule), split by the head chosen in column 4.

---

## 4 · Dropdown

Column 4 (F5:F9) — **Head under which income to be taxed**: `(Select)` · Business
Income · Capital Gain.

---

## 5 · Cross-sheet feeds

**Out:** Item **B** (`TotIncCapGain`) → **Schedule CG item C2** ("Income from
transfer of Virtual Digital Assets (Item No. B of Schedule VDA)") and, via
Schedule SI, the VDA @30% line of Schedule CG Table F (row 488). Item **A**
(`TotIncBusiness`) → Schedule BP / business income. Both ultimately land in the
115BBH special-rate computation in Schedule SI and Part B.

**In:** transactions are entered directly; no other schedule feeds VDA.

---

## Appendix 1 · Dropdown values (verbatim)
```
"(Select),Business Income,Capital Gain" => (Select) | Business Income | Capital Gain
```

---

## Appendix 2 · Every schema leaf of block ScheduleVDA (full paths)
\`*\` = required.
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

---

## Appendix 3 · Every live row of the sheet, verbatim
```
[C3] Schedule VDA  |  [E3] Income from transfer of Virtual Digital Assets (Note: Detail of every transaction are to be filled, 
[C4] Serial number (1)  |  [D4] Date of Acquisition (2)  |  [E4] Date of Transfer (3)  |  [F4] Head under which income to be taxed (Business/Capital Gain) (4)  |  [G4] Cost of Acquisition (In case of gift; a. Enter the amount on which tax is paid u/s 56(2)(x) if any b  |  [H4] Consideration Received (6)  |  [I4] Income from transfer of Virtual Digital Assets (enter nil in case of loss) (Col. 6 – Col. 5) (7)
[F5] (Select)
[F6] (Select)
[F7] (Select)
[F8] (Select)
[F9] (Select)
[C11] A.  |  [D11] Total (Sum of all Positive Incomes of Business Income in Col. 7)
[C12] B.  |  [D12] Total (Sum of all Positive Incomes of Capital Gain in Col. 7)
```
