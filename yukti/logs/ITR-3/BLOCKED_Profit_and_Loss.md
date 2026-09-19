# BLOCKED — Profit and Loss (ITR-3) Gate 3 cannot reach GREEN

## Status
Book `books/ITR-3/Profit_and_Loss.md` is complete and correct. Verified programmatically:
- Every VISIBLE labelled row is covered (all pass the label check under the intended
  threshold `max(2, len(words))-2`).
- Every required schema leaf key of block `PARTA_PL` appears verbatim (0 missing).
- Every dropdown value is present (J47 Yes/No; H172 Owned/Leased/Hired; Section 44B..44BBD;
  State enum[38]; Country enum[250]; business codes NOB44AD[315] / NOB44ADA[38] / NOB[7]).
- The two hidden rows (17 "Liabilities written back" superseded cell; 170 "Serial number"
  stray header) are listed ONLY under "Hidden rows — not built", never as items.

`python3 tools/gates/gate.py --form ITR-3 --gate 3 --sheet "Profit and Loss"` still prints
`GATE 3: RED — 20 items`, all of the form `label not in book: <X>`. Every one of the 20
labels IS present verbatim in the book. The failures are a gate defect, not a book gap.

## Root cause (tools/gates/gate.py, gate3, line 75) — SAME defect as BLOCKED_Part_A_BS.md
    if words and sum(1 for w in words if w in book) < max(2, len(words)-2): missing.append(...)
For any label reducing to exactly ONE significant word (len>3, not in STOP), the threshold is
`max(2, 1-2) = 2`, but the maximum achievable match count is 1, so the label is ALWAYS reported
missing. Word count derives from the immutable sheet label, not the book — no book content can
fix it. 0-word labels are skipped; >=2-word labels are satisfiable; only the 1-word case is
impossible. The author guarded the 0-word edge but not the 1-word edge.

## The 20 affected VISIBLE labels on this sheet (all single-significant-word)
- Other income (row 5) -> {other}                     (income in STOP)
- Dividend income (row 8) -> {dividend}
- Interest income (row 9) -> {interest}
- Agriculture income (row 15) -> {agriculture}
- Entertainment (row 56) -> {entertainment}
- Advertisement (row 60) -> {advertisement}
- VAT/ Sales tax (row 87) -> {sales}                  (vat too short, tax in STOP)
- Total (i + ii) (rows 64, 68, 72, 131) -> {total}    (4 occurrences)
- Expenditure, if any (row 204) -> {expenditure}      (if/any in STOP)
- Section 44BB (rows 209, 215) -> {44bb}              (section in STOP; 2 occurrences)
- Section 44BBA (rows 210, 216) -> {44bba}            (2 occurrences)
- Section 44BBC (rows 211, 217) -> {44bbc}            (2 occurrences)
- Section 44BBD (rows 212, 218) -> {44bbd}            (2 occurrences)
(Note: "Section 44B" is skipped by the gate because "44b" is only 3 chars, not >3.)

All 20 are present verbatim in books/ITR-3/Profit_and_Loss.md.

## This is systemic, not sheet-specific
Already independently reported for Part A - BS (logs/ITR-3/BLOCKED_Part_A_BS.md), which names
this exact sheet's labels as the same class of failure. Gate 3 cannot be GREEN for any ITR-3
sheet that carries a single-strong-word visible label.

## What is needed (for the auditor/CEO — NOT done here; gates are never edited by readers)
Fix the gate threshold so a 1-significant-word label needs only its 1 word, e.g.
`max(1, len(words)-2)` or `min(len(words), max(2, len(words)-2))`. Gate fix must be made by the
gate owner, with example.html/gates re-verified. The book itself needs no change.
