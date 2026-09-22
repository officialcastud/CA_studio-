# BLOCKED — Gate 3 (sheet TDS) is unsatisfiable for single-word column/title labels

**Sheet:** TDS · **Book:** books/ITR-3/TDS.md (complete and correct) ·
**Gate:** `tools/gates/gate.py --gate 3 --sheet "TDS"` · **Date:** 2026-09-15

The book covers the significant words of every visible labelled row, every
schema leaf key of `ScheduleTDS1`, `ScheduleTDS2`, `ScheduleTDS3` and
`ScheduleTCS` (all required keys), and every dropdown value (Self/Other, the FY
lists 2024-25…2008-09 and 2024…2008, both Head-of-Income lists, and the full
60-code `TDS_Section_List_1`). Gate 3 now reports exactly SIX items, none of
which can be cleared by any book content:

```
[TDS] label not in book: Section under which TDS is deducted   (×2 — TDS 2 I20, TDS 3 J35)
[TDS] label not in book: Head of Income (Col 12)               (×2 — TDS 2 R21, TDS 3 W36)
[TDS] label not in book: Schedule TCS                          (C63 title, item 15C)
[TDS] label not in book: Amount b/f (Col 5)                    (Schedule TCS I65)
```

All four phrases are present verbatim in the book. The failures are the same
documented gate defect already raised for VI-A, FSI, Schedule S, Part A-BS,
Profit and Loss, DEP_DCG and Trading Account (see logs/ITR-3/BLOCKED.md).

## Evidence (gate.py gate3 label check, unedited — lines 74-75)

```python
words=[w for w in norm(t).split() if len(w)>3 and w not in STOP][:6]
if words and sum(1 for w in words if w in book)<max(2,len(words)-2):missing.append(t[:80])
```

`STOP` contains `income`, `section`, `which`, `under`, `tax`, etc. After
filtering `len(w)>3` and removing stop-words, each offending cell reduces to a
single keyword, so the threshold `max(2, len(words)-2)` = `max(2, -1)` = **2**
can never be reached (max achievable sum = 1):

| Cell | Label `t` | `norm` → words | needed / reachable |
|---|---|---|---|
| I20 / J35 | `Section under which TDS is deducted` | `['deducted']` (section, under, which ∈ STOP; `tds` len 3) | 2 / 1 |
| R21 / W36 | `Head of Income (Col 12)` | `['head']` (`income` ∈ STOP; `col`, `12` too short) | 2 / 1 |
| C63 | `Schedule TCS` | `['schedule']` (`tcs` len 3) | 2 / 1 |
| I65 | `Amount b/f (Col 5)` | `['amount']` (`col` len 3, `b`/`f`/`5` short) | 2 / 1 |

`1 < 2` is always True ⇒ each is always reported missing, for ANY book text.
Verified empirically: the exact strings are already in the book and the six
items still print.

## Not a book gap
Every other Gate 3 check passes for TDS: no `required schema key not in book`
and no `dropdown value not in book` items remain (one earlier dropdown failure —
a line-wrapped "Income from Other Sources" — has been fixed). Only the
single-word label heuristic remains red.

## What is needed to unblock (gate-owner / CEO / auditor)
Per the constitution a reader must not edit a gate. Minimal fix to line 75:
change the threshold `max(2, len(words)-2)` to `max(1, len(words)-2)`
(or `min(len(words), max(2, len(words)-2))`), so a single-word label needs its
one word present rather than an impossible two. The book needs no change.
