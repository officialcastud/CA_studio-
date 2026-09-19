# Gate 3 — Schedule SI (ITR-6) — GREEN

Sheet: **SI** (sheet46.xml, 235 rows, 151 hidden) · Section: **si** · Block: **ScheduleSI**
Book: `books/ITR-6/SI.md`

## Runs
1. RED — 3 items:
   - `[SI] label not in book: Available Income`
   - `[SI] label not in book: DTAA - Double Taxation Avoidance Agreement From CG`
   - `[SI] label not in book: ossec_PTI_5AD1IBd`
   These were the off-screen helper-column labels (S "Available Income", Q69 DTAA
   look-up, and the `ossec_*` OS-feed key). Added a "Helper columns" note to §1
   of the book covering the S/T/U/N/Q/O/P/R/X columns and the verbatim `ossi_*` /
   `ossec_*` / `osDTAA_*` OS-feed key names.
2. **GREEN** — all live-row labels, all required schema leaves
   (`SecCode`, `SplRatePercent`, `SplRateInc`, `SplRateIncTax`, `TotSplRateInc`,
   `TotSplRateIncTax`), and all dropdown values ("(Select)", "Yes", "No")
   present in the book.

## Coverage
- Live rows booked: 79 (the visible special-rate heads + group headers r50/r53/
  r100 + total r106 + override r116).
- Hidden rows logged as excluded (not built): 24 within the SI table
  (the nine `_BE` twins, r7 111-PF, r45/48/49/82/83/92 superseded dividend/
  anon-donation slots, r59/62/64/66 pre-July PTI twins, r87/89 194LBA, r93 blank)
  plus r108–115 (a hidden Schedule IF fragment — booked separately from sheet
  `IF`/sheet47/block `ScheduleIF`).
- SecCode enum: 72 codes booked with rate + feed source. Rate enum: 12 values.
- Column I (`SI.SplRateIncCalc`, "taxable after min chargeable") has no schema
  leaf — display/compute only; equals column H on ITR-6 (THRESOLD = 0).
