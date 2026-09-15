# BLOCKED — Gate 3 provably unsatisfiable for sheet "CYLA - BFLA"

Sheet: **CYLA - BFLA** (schema blocks ScheduleCYLA, ScheduleBFLA). Book:
`books/ITR-3/CYLA_BFLA.md` — complete and correct; every visible labelled row,
every required schema leaf key, and both dropdown values ("No", "Yes") are
present. Gate 3 nonetheless prints RED with exactly 4 items, all of the same
mechanical kind:

```
[CYLA - BFLA] label not in book: Speculative Income
[CYLA - BFLA] label not in book: Speculation Income
[CYLA - BFLA] label not in book: Remaining Set off BP
[CYLA - BFLA] label not in book: Remaining Set off
```

## Why this is a gate defect, not a book defect
Gate 3's live-label check (tools/gates/gate.py, gate3):
```
words=[w for w in norm(t).split() if len(w)>3 and w not in STOP][:6]
if words and sum(1 for w in words if w in book) < max(2, len(words)-2): missing.append(...)
```
`STOP` contains "income". After dropping words of length <=3 and the stop-word
"income", each of these four **visible** labels reduces to a SINGLE content word:

| Label (visible row) | Source cell | content words | threshold max(2,len-2) | max achievable sum | satisfiable? |
|---|---|---|---|---|---|
| Speculative Income | E11 (CYLA, row 11 visible) | [speculative] | 2 | 1 | NO |
| Speculation Income | E37 (BFLA, row 37 visible) | [speculation] | 2 | 1 | NO |
| Remaining Set off BP | S5 (helper col, row 5 visible) | [remaining] | 2 | 1 | NO |
| Remaining Set off | W31 (helper col, row 31 visible) | [remaining] | 2 | 1 | NO |

For a label with 1 content word the threshold is `max(2,-1)=2`, but the maximum
possible number of distinct content words found in the book is 1, so
`1 < 2` is always true. No amount of book text can satisfy it. Confirmed
empirically: appending the exact strings "speculative", "speculation",
"remaining", "bp" to the book leaves all 4 items unchanged.

Rows 11, 37, 5, 31 carry no `hidden="1"` in
`sources/ITR-3/utility/xl/worksheets/sheet25.xml`, so they are genuinely
visible; "Speculative Income"/"Speculation Income" are real heads (item iv/v of
CYLA / iii/iv of BFLA) and must be built. They are not hidden rows and must not
be dropped.

This defect affects any single-content-word visible label. Across ITR-3 the same
pattern hits many other sheets ("Depreciation", "Verification", "Dividend
income", "Advertisement", "Entertainment", "Schedule CFL", etc.), so Gate 3 is
un-greenable form-wide until fixed.

## What is needed
Fix the gate's threshold so a label with one content word requires 1 match, e.g.
`min(len(words), max(2, len(words)-2))` or `max(1, len(words)-2)`. The book needs
no change. Per CLAUDE.md the gate must not be edited by a reader/CEO to "pass";
this is filed for the auditor to raise as an issue with the evidence above.
