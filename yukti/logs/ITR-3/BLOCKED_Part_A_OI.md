# BLOCKED — Part A - OI (ITR-3, Gate 3)

The book `books/ITR-3/Part_A_OI.md` is complete and correct: every visible labelled row, every required schema key under `PARTA_OI`, and every dropdown value are present (verified — 0 missing required keys, 0 missing dropdown values). Gate 3 for this sheet cannot print GREEN because of a **gate defect**, not a book gap. Per CLAUDE.md I did not edit the gate.

## Evidence — two labels are structurally unsatisfiable
`tools/gates/gate.py` gate3 label check (line 75):
```
words=[w for w in norm(t).split() if len(w)>3 and w not in STOP][:6]
if words and sum(1 for w in words if w in book) < max(2, len(words)-2): missing
```
For a label whose text is ≥12 chars (so it is not skipped by `len(t)<12`) but reduces to exactly **one** significant word, the threshold is `max(2, 1-2) = 2`, while the maximum achievable count is `1`. So `1 < 2` is always true — no book content can satisfy it.

Two rows on this sheet hit exactly that case:
- **Row 96 `[F96] "VAT/sales tax"`** (item 12c, key `AmtExciseCustomsVATOutstanding.ExciseCustomsVAT.VATorSaleTax`): norm → `vat sales tax`; `vat`/`tax` dropped (len≤3 / STOP), leaving `['sales']`. present=1, threshold=2.
- **Row 101 `[F101] "Any other tax"`** (item 12h, key `...OthDutyTaxCess`): norm → `any other tax`; `any`/`tax` are STOP, leaving `['other']`. present=1, threshold=2.

(Length 11 labels like "Service tax" escape via the `len(t)<12` skip; these two at length 13 do not.)

## Scope — systemic, not this sheet
The same defect flags single-significant-word ≥12-char labels across essentially every ITR-3 sheet (full `--gate 3` run = 215 items: e.g. PART A-General "No. of shares", Part A-BS "Depreciation", Schedule S "Salary as per section 17(1)", OS "Amount of income", CG "Deductions under section 48", Trading Account "VAT/ Sales tax"). Phase 3 cannot reach GREEN for any of these until the gate is fixed.

## Fix needed (for the CEO/auditor — not applied here)
The threshold floor of `2` in `max(2, len(words)-2)` should be `min(2, len(words))` (or `max(1, len(words)-2)`) so a genuine one-word label is satisfied by that one word being present. This is a gate change (separate PR), not a book change.
