# The book of Schedule VDA — ITR-3, A.Y. 2026-27

Read row by row from the utility's **VDA** sheet and confirmed against the CBDT
ITR-3 schema block `ScheduleVDA`. Every heading, column number and item letter
below is the department's own; nothing is invented.

---

## The shape

Schedule VDA — **Income from transfer of Virtual Digital Assets** — is one flat
transaction table plus two totals. The sheet's own note at the top: *"Details of
every transaction are to be filled"* — one row per VDA transfer. Each row carries
seven columns (1 to 7); the head of income (Business Income or Capital Gain) is
chosen per row, and the taxable income per row is `MAX(0, Consideration − Cost)`.
Below the table, two totals split the positive incomes by head: **A** the sum for
Business Income, **B** the sum for Capital Gain.

---

## The items

### Block: `ScheduleVDA`

The transaction table (columns 1–7; repeats per transfer):

| Sheet col./item | Field label | Type | Schema key | Rule / notes |
|---|---|---|---|---|
| Col (1) | Serial number | int (auto) | — | `C6 = C5+1`, `C7 = C6+1`; running counter, not a filed key |
| Col (2) | Date of Acquisition | date DD/MM/YYYY | `ScheduleVDADtls[].DateofAcquisition` | schema string YYYY-MM-DD; cannot be after 31st March of the FY |
| Col (3) | Date of Transfer | date DD/MM/YYYY | `ScheduleVDADtls[].DateofTransfer` | schema string YYYY-MM-DD; cannot be after 31st March of the FY |
| Col (4) | Head under which income to be taxed (Business/Capital Gain) | enum | `ScheduleVDADtls[].HeadUndIncTaxed` | enum `BI`, `CG`; dropdown `(Select) / Business Income / Capital Gain` |
| Col (5) | Cost of Acquisition (In case of gift; a. Enter the amount on which tax is paid u/s 56(2)(x) if any b. …) | amount | `ScheduleVDADtls[].AcquisitionCost` | integer, min 0, max 99999999999999 |
| Col (6) | Consideration Received | amount | `ScheduleVDADtls[].ConsidReceived` | integer, min 0, max 99999999999999 |
| Col (7) | Income from transfer of Virtual Digital Assets (enter nil in case of loss) (Col. 6 – Col. 5) | computed | `ScheduleVDADtls[].IncomeFromVDA` | `I5 = MAX(0, H5−G5)` per row |

The totals (below the table):

| Sheet item | Field label | Type | Schema key | Rule / notes |
|---|---|---|---|---|
| **A** | Total (Sum of all Positive Incomes of Business Income in Col. 7) | computed | `TotIncBusiness` | `SUMIF` over rows where head = Business Income |
| **B** | Total (Sum of all Positive Incomes of Capital Gain in Col. 7) | computed | `TotIncCapGain` | `SUMIF` over rows where head = Capital Gain |

---

## The rules the sheet computes

- **`[I5]` (and `[I6]`, `[I7]`)** `= MAX(0, H5-G5)` — Col 7 income per row is Consideration (Col 6) minus Cost of Acquisition (Col 5), floored at zero (nil in case of loss).
- **`[C6]`** `= C5+1` and **`[C7]`** `= C6+1` — serial number auto-increments down the rows.
- **`[I9]` (Total A)** `= SUMIF(VDA_Head_Income, "Business Income", VDA_Income_from_transfer)` — sum of Col 7 across only the rows whose Col 4 head is Business Income.
- **`[I10]` (Total B)** `= SUMIF(VDA_Head_Income, "Capital Gain", VDA_Income_from_transfer)` — sum of Col 7 across only the rows whose Col 4 head is Capital Gain.

Cross-sheet rules carried by the RULES document: Col 7 must equal Col 6 − Col 5; Total A must equal the sum of Col 7 where head is Business Income; Total B must equal the sum of Col 7 where head is Capital Gain; Date of Acquisition or Date of Transfer cannot be after 31st March of the financial year; Schedule CG Sl. No. C2 (Income from transfer of Virtual Digital Assets) must equal Sl. No. B of Schedule VDA; and Sl. No. 3g u/s 115BBH in Schedule BP must match Sl. No. A of Schedule VDA.

---

## Dropdowns

- **Col 4 — Head under which income to be taxed** (cells F5:F7): `(Select)`, `Business Income`, `Capital Gain`.

(All other cells in the transaction range are numeric or date inputs with no value list; the totals cells I9/I10 carry only numeric bounds, not a list.)

---

## What repeats and what is one figure

- **Repeats (array):** the transaction row — `ScheduleVDADtls[]`. One entry per VDA transfer, each with its own dates, head, cost, consideration and income. The sheet ships a few rows and adds more on demand.
- **One figure each:** `TotIncBusiness` (Total A) and `TotIncCapGain` (Total B) — single computed totals for the whole schedule.

---

## Mandatory

Schema `required` at block `ScheduleVDA`: `ScheduleVDADtls`, `TotIncBusiness`, `TotIncCapGain`.

Within each `ScheduleVDADtls` entry, all leaves are required: `DateofAcquisition`, `DateofTransfer`, `HeadUndIncTaxed`, `AcquisitionCost`, `ConsidReceived`, `IncomeFromVDA`.

All schema leaf keys, verbatim:
`ScheduleVDADtls`, `ScheduleVDADtls[].DateofAcquisition`, `ScheduleVDADtls[].DateofTransfer`, `ScheduleVDADtls[].HeadUndIncTaxed`, `ScheduleVDADtls[].AcquisitionCost`, `ScheduleVDADtls[].ConsidReceived`, `ScheduleVDADtls[].IncomeFromVDA`, `TotIncBusiness`, `TotIncCapGain`.

---

## Hidden rows — not built

None. The VDA dump prints no row flagged `H`; every labelled row (3, 4, 5–7, 9, 10) is visible. Row 8 carries only cell-range dropdown/format anchors (D8:E8, F8:K8) with no printed label — it is a spacer, not an item.

---

## What this means for the build

1. Build one repeatable transaction row (`ScheduleVDADtls[]`): Date of Acquisition, Date of Transfer, Head (dropdown BI/CG), Cost of Acquisition, Consideration Received, and the computed Income (green, untypeable) as `MAX(0, Consideration − Cost)`.
2. Serial number is an auto-counter for display; do not file it — it has no schema key.
3. The head dropdown maps display `Business Income → BI` and `Capital Gain → CG`; `(Select)` is the empty state.
4. Compute Total A (`TotIncBusiness`) and Total B (`TotIncCapGain`) as SUMIF over rows by head — both green, both floored at zero (positive incomes only).
5. Feed Total B to Schedule CG C2 and Total A to Schedule BP 3g (115BBH); both are cross-schedule ties enforced by the rules document.
6. Enforce the date rule: neither date may be after 31st March of the financial year.


## Additional visible rows — verbatim from the sheet (completeness)
Rows present on the utility sheet and captured here verbatim so every visible label is in the book:

- Schedule VDA
