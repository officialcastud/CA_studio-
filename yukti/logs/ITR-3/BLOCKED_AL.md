# BLOCKED — Gate 3 provably unsatisfiable for sheet "AL"

Sheet: **AL** (schema block `ScheduleAL`). Book: `books/ITR-3/AL.md` — complete
and correct. Every visible labelled row (Parts A/B/C/D), every required schema
leaf key (`MovableAsset.*` all eight, `InterstAOPFlag`, `LiabilityInRelatAssets`,
`ImmovableDetails[].*`, `InterestHeldInaAsset[].*`), and every dropdown value
(Yes/No; 38 State codes; 250 Country codes) are present. Hidden row 113
(`[N113] 91-INDIA`) is logged under "Hidden rows — not built". Gate 3 nonetheless
prints RED with exactly 3 items, all the same mechanical kind:

```
[AL] label not in book: Description (2)
[AL] label not in book: Description (2)
[AL] label not in book: PAN of the firm/ AOP (4)
```

## Why this is a gate defect, not a book defect
Gate 3's live-label check (tools/gates/gate.py, gate3):
```
words=[w for w in norm(t).split() if len(w)>3 and w not in STOP][:6]
if words and sum(1 for w in words if w in book) < max(2, len(words)-2): missing.append(...)
```
After `norm` strips punctuation and digits-as-short-tokens, drops words of
length <=3, and removes the stop-word "of/the" etc., each of these VISIBLE
labels reduces to a SINGLE content word:

| Label (visible row) | Source cell | content words | threshold max(2,len-2) | max achievable sum | satisfiable? |
|---|---|---|---|---|---|
| Description (2) | E6  (Part A header, row 6 visible)  | [description] | 2 | 1 | NO |
| Description (2) | E15 (Part B header, row 15 visible) | [description] | 2 | 1 | NO |
| PAN of the firm/ AOP (4) | O26 (Part C header, row 26 visible) | [firm] | 2 | 1 | NO |

For a label with 1 content word the threshold is `max(2, -1) = 2`, but the most
distinct content words the book can supply for such a label is 1, so
`1 < 2` is always true. The word IS in the book ("description", "firm", "PAN"),
so the documented contract ("the significant words of every VISIBLE labelled
row") is met; the gate's arithmetic is stricter than its own contract.
Confirmed empirically: appending "description firm aop pan total amount address"
(x5) to the book leaves all 3 items unchanged.

Rows 6, 15, 26 carry no `hidden="1"`, so they are genuinely visible column
headers of the three built tables/blocks; they are not hidden rows and cannot be
dropped.

This is the same single-content-word defect already filed for CYLA-BFLA
(logs/ITR-3/BLOCKED.md) and for DEP_DCG, FSI, Part A-BS, Profit and Loss,
Schedule S, TDS, Trading Account, Unabsorbed Depreciation. Gate 3 is
un-greenable form-wide for any sheet carrying a one-content-word visible label.

## What is needed
Fix the gate's threshold so a label with one content word requires 1 match, e.g.
`min(len(words), max(2, len(words)-2))` or `max(1, len(words)-2)`. The AL book
needs no change. Per CLAUDE.md a reader must not edit the gate to "pass"; this is
filed for the auditor to raise as an issue with the evidence above.
