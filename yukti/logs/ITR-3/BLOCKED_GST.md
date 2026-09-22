# BLOCKED — ITR-3 Schedule GST — Gate 3 cannot print GREEN (provable gate defect)

## Status
Book `books/ITR-3/GST.md` is complete and correct against all three sources
(utility rows, ScheduleGST schema, VBA validators). It covers every visible label's
significant words, both schema leaf keys, and there are no dropdown value lists.

`python3 tools/gates/gate.py --form ITR-3 --gate 3 --sheet "GST"` still prints:
    GATE 3: RED — 2 items
        [GST] label not in book: Schedule GST
        [GST] label not in book: GSTIN No(s).

Both flagged words ("schedule", "gstin") ARE present in the book. The failure is not
fixable from the book — it is an unhandled edge case in `gate.py::gate3`.

## Root cause (evidence)
`tools/gates/gate.py` line ~75:
    words=[w for w in norm(t).split() if len(w)>3 and w not in STOP][:6]
    if words and sum(1 for w in words if w in book) < max(2, len(words)-2): missing.append(...)

For a label whose only surviving token (len>3, non-stopword) is a SINGLE word:
  - "Schedule GST"  -> norm "schedule gst" -> "gst" is len 3 (dropped) -> words=["schedule"]
  - "GSTIN No(s)."  -> norm "gstin no s "  -> words=["gstin"]
Both labels are exactly 12 chars, so they pass the `len(t)<12` skip and ARE checked.
Threshold = max(2, len(words)-2) = max(2, 1-2) = max(2,-1) = 2.
Maximum achievable matches for a 1-word list = 1.  1 < 2 is ALWAYS true => ALWAYS flagged.
No book edit can satisfy it; only a gate change (forbidden by CLAUDE.md) could.

## Why this is a gate defect, not a book/source problem
- The gate was authored against ITR-2 (the finished reference). A scan of every VISIBLE
  ITR-2 sheet finds ZERO labels (len>=12) that reduce to a single significant word.
- ITR-3 introduces many such labels (e.g. "Schedule GST", "GSTIN No(s).", "EXEMPT INCOME"
  -> ["exempt"] because "income" is a stopword, "Section 44BB" -> ["44bb"], "Schedule CFL",
  "Schedule VDA", "Schedule ESR", etc.). The threshold `max(2, len(words)-2)` demands 2
  matches even when a label has only 1 significant word, which is unsatisfiable.
- This affects GST and numerous other ITR-3 sheets, not just this one.

## What is needed (for CEO/auditor — do not let the sheet-reader edit the gate)
Fix the threshold in `gate3` to not exceed the number of significant words, e.g.
    need = min(len(words), max(2, len(words)-2))
    if words and sum(1 for w in words if w in book) < need: ...
(or raise the short-label skip so single-significant-word labels are exempt). After the
gate is corrected, `GST.md` requires no changes to go green — every word/key/value is
already present.

## Rule basis
CLAUDE.md: "Never edit a gate to make it pass; if a gate is wrong, say so ... and stop."
and the unattended-operation clause: "If you are blocked (... a gate is provably wrong ...),
write logs/<form>/BLOCKED.md ... and stop."
