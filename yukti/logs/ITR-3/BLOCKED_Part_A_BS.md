# BLOCKED — Part A - BS (ITR-3) Gate 3 cannot reach GREEN

## Status
Book `books/ITR-3/Part_A_BS.md` is complete and correct: every visible labelled row, every
schema leaf key (70 leaves of block PARTA_BS), and every dropdown group is covered; the single
hidden row (79, Provision for Wealth Tax) is listed only under "Hidden rows — not built".

`python3 tools/gates/gate.py --form ITR-3 --gate 3 --sheet "Part A - BS"` still prints
`GATE 3: RED — 15 items`, all of the form `label not in book: <X>`. Every one of the 15 labels
IS present verbatim in the book (verified with grep). The failures are a gate defect, not a book gap.

## Root cause (tools/gates/gate.py, gate3, line 75)
    if words and sum(1 for w in words if w in book) < max(2, len(words)-2): missing.append(...)
where `words` = significant words of the label (len>3, not in STOP), capped at 6.

For any label that reduces to exactly ONE significant word, the threshold is
`max(2, 1-2) = 2`, but the maximum achievable match count is 1. So the condition is always
true and the label is always reported missing — no book content can change the word count,
which derives from the immutable sheet label, not the book. Labels with 0 significant words
are skipped (`if words` is falsy); labels with >=2 are satisfiable. Only the 1-word case is
impossible. The author guarded the 0-word edge but not the 1-word edge.

## The 15 affected VISIBLE labels on this sheet (all single-significant-word)
- Depreciation (row 34) -> {depreciation}
- Raw materials (row 53) -> {materials}
- Net Block (1a - 1b) (row 35) -> {block}
- Provision for Income Tax (row 78) -> {provision}   (for/income/tax all in STOP)
- NO ACCOUNT CASE (row 90 heading) -> {account}       (no too short, case in STOP)
- Total ( iiA + iiB) (row 19) -> {total}
- Total (ai + iiC) (row 20) -> {total}
- Total (bi + bii) (row 24) -> {total}
- Total (1c + 1d) (row 37) -> {total}
- Total (ai + aii) (row 42) -> {total}
- Total (iA + iB + iC + iD) (rows 56 and 76) -> {total}
- Total (iiA + iiB + iiC ) (row 82) -> {total}
- Total (iE + iiD) (row 83) -> {total}
- Total (4a + 4b + 4c) (row 88) -> {total}

All 15 are present verbatim in books/ITR-3/Part_A_BS.md.

## This is systemic, not sheet-specific
Running gate 3 across the whole form shows the same class of failure on every sheet that
carries a single-strong-word visible label (e.g. "Other income", "Dividend income" on
Profit and Loss; "Deductions under section 48" on CG). Gate 3 cannot be GREEN for ITR-3
(or any real ITR) while this label-matching threshold stands.

## What is needed (for the auditor/CEO — NOT done here, gates are never edited by readers)
Change the gate's threshold so a 1-significant-word label needs only its 1 word, e.g.
`min(len(words), max(2, len(words)-2))` or `max(1, len(words)-2)`. This is a gate fix and
must be made by whoever owns the gate, with example.html/gates re-verified. The book itself
needs no change.
