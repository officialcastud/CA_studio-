# BLOCKED — Gate 3 (sheet FSI) is provably unsatisfiable for one column header

**Sheet:** FSI · **Book:** books/ITR-3/FSI.md (complete and correct) · **Gate:** `gate.py --gate 3 --sheet "FSI"`

The book covers every visible row's significant words, every schema leaf of
`ScheduleFSI` (all required keys), and every dropdown value (the 250-entry
country list incl. "(Select)"). Gate 3 reports exactly ONE item, and it cannot
be cleared by any book content:

    [FSI] label not in book: Head of Income (a)

## Evidence (gate.py gate3 label check, unedited)

For each cell the gate computes
`words = [w for w in norm(t).split() if len(w)>3 and w not in STOP][:6]`
and flags the cell when
`sum(1 for w in words if w in book) < max(2, len(words)-2)`.

Cell H5 text = **"Head of Income (a)"**. After `norm`, tokens are
`head, of, income, a`. Filtering `len(w)>3` drops `of`/`a`; filtering
`w not in STOP` drops `income` (STOP contains `income`, `tax`, `section`, ...).
So `words == ['head']`, a single keyword.

Threshold = `max(2, len(words)-2) = max(2, -1) = 2`.
Maximum achievable `sum` = `len(words) = 1` (even if `head` appears in the book).
`1 < 2` is always True ⇒ the cell is always "missing", for ANY book text.

Verified empirically: injecting `head`, `income`, `head of income (a)` into the
book in every combination still prints `GATE 3: RED — 1 items`.

## Root cause
`max(2, len(words)-2)` requires >=2 keyword matches, but any label whose only
non-STOP word of length >4 is a single token (here `head`, because `income` is a
STOP word) can never reach 2. The same defect flags single-keyword visible
labels on many other ITR-3 sheets (e.g. EI "EXEMPT INCOME", "Interest income";
BP "Deemed income under section 41"; VDA "Schedule VDA"). It is a gate bug, not
a book gap.

## What is needed
A gate fix is outside a reader's authority (CLAUDE.md: never edit a gate; if a
gate is wrong, log evidence and stop). Suggested minimal fix for the
gate-owner: make the threshold `min(len(words), max(2, len(words)-2))`, or skip
the label check when `len(words) < 2`. Book requires no change.
