# BLOCKED — Trading Account (ITR-3) Gate 3 cannot reach GREEN

## Status
Book `books/ITR-3/Trading_Account.md` is complete and correct: every visible labelled row
(items 4 to 12d) is covered, every schema leaf key of block `TradingAccount` appears verbatim
(all 5 required keys — OperatingRevenueTotal, SalesGrossReceiptsTotal, TotRevenueFrmOperations,
TardingAccTotCred, DirectExpenses — plus the two arrays OtherOperatingRevenueDtls[] and
OtherIncDtls[] with their row keys, the ExciseCustomsVAT and DutyTaxPay.ExciseCustomsVAT
objects, and the intraday/F&O leaves), and there are no real dropdown lists (only numeric/text
validations). No row on this sheet is hidden; there are no H rows.

`python3 tools/gates/gate.py --form ITR-3 --gate 3 --sheet "Trading Account"` still prints
`GATE 3: RED — 2 items`, both `label not in book: VAT/ Sales tax` (rows 20 and 48). Both are
present verbatim in the book. This is the same gate defect already logged for Schedule S,
Part A - BS and Profit and Loss — not a book gap.

## Root cause (tools/gates/gate.py, gate3)
    if words and sum(1 for w in words if w in book) < max(2, len(words)-2): missing.append(...)
`words` = label tokens of length >3 not in STOP. "VAT/ Sales tax" -> norm "vat sales tax" ->
tokens {sales} only ("vat" and "tax" are len 3; "tax" is also in STOP). len(words)=1, so the
threshold is max(2, 1-2)=2, but the maximum achievable match is 1. The condition is always
true; no book content can clear it because `words` derives from the immutable sheet label.

## The 2 affected VISIBLE labels
- VAT/ Sales tax (row 20, item 4C iii)  -> {sales}
- VAT/ Sales tax (row 48, item 10 vi)   -> {sales}
Both present verbatim in books/ITR-3/Trading_Account.md.

## What is needed (for the auditor/CEO — NOT done here; readers never edit gates)
Same gate fix requested in BLOCKED_Schedule_S.md: make a 1-significant-word label need only its
1 word (e.g. threshold `max(1, len(words)-2)`). The book itself needs no change.
