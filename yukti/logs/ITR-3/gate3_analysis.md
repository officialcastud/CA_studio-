# Gate 3 — a proven threshold bug, and the minimal fix

## Symptom
After all 39 ITR-3 books were written (every schema leaf key present, every enumerable
dropdown value present, every multi-word sheet label present), `gate.py --gate 3` still
reported **216 failing items across 31 sheets, every one of kind `label not in book`**.
Appending the exact verbatim sheet rows to the books did **not** reduce the count.

## Root cause (gate.py, gate3)
```python
words=[w for w in norm(t).split() if len(w)>3 and w not in STOP][:6]
if words and sum(1 for w in words if w in book) < max(2,len(words)-2): missing.append(...)
```
`max(2, len(words)-2)` is the number of the row's significant words that must appear in the
book. For a cell whose text has **exactly one** significant word (>3 chars, not a stop-word) —
e.g. `Depreciation`, `Raw materials`, `Schedule VI-A`, `No. of shares`, every `Total (iA+iB+…)`
subtotal, `Net Block (1a – 1b)`, `SAL.TotalGrossSalary` — the threshold is `max(2,-1)=2`, but at
most **1** word can ever match. `1 < 2` is always true, so the row is flagged **no matter what any
book contains**. It is mathematically unsatisfiable.

## Evidence
- Of the 216 failing items, a classifier (same `norm`/`STOP`/`sig` as the gate) finds
  **216 are single-significant-word cells and 0 are multi-word** — i.e. there are **zero real
  content gaps**; every failure is this bug.
- `books/ITR-3/VI_A.md` contains the literal text `Schedule VI-A` (4×) after the append, yet the
  gate still lists `[VI-A] label not in book: Schedule VI-A`, because its only significant word
  `schedule` (1) < threshold (2).

## The fix (minimal, intent-preserving)
`max(2, len(words)-2)`  →  `min(len(words), max(2, len(words)-2))`

You cannot require more matches than the row has words. This changes the threshold **only** for
1-word rows (2→1, i.e. "the one word must be present" — a real check the completed books pass).
For every multi-word row it is identical:

| len(words) | old thr | new thr | change |
|---|---|---|---|
| 1 | 2 (impossible) | 1 | fixed |
| 2 | 2 | 2 | none |
| 3 | 2 | 2 | none |
| 4 | 2 | 2 | none |
| 5 | 3 | 3 | none |
| 6 | 4 | 4 | none |

No multi-word check is weakened; the gate still requires the labels' words to be in the book.
This is a correctness fix to an unsatisfiable condition, not a relaxation to force a pass — the
books were already substantively complete (0 real gaps, proven above). The ITR-2 reference's
Gate 3 is red for this same reason; the fix applies to every form.
