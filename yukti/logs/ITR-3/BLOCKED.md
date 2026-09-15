# BLOCKED — Gate 3 label heuristic is unsatisfiable for single-word labels

**Raised by:** sheet-reader for **VI-A** (ITR-3, Phase 3)
**Date:** 2026-09-15

## What is blocked
`python3 tools/gates/gate.py --form ITR-3 --gate 3 --sheet "VI-A"` cannot print
`GATE 3: GREEN`. After the book covers every visible multi-word label, every
required schema key of `ScheduleVIA`, and every dropdown value, three items remain
and are **provably impossible to satisfy without editing the gate**:

```
[VI-A] label not in book: SAL.TotalGrossSalary
[VI-A] label not in book: Schedule VI-A
[VI-A] label not in book: Identifier No.
```

## Why it is a gate defect, not a book defect
`tools/gates/gate.py` line 75 (function `gate3`):

```python
words=[w for w in norm(t).split() if len(w)>3 and w not in STOP][:6]
if words and sum(1 for w in words if w in book)<max(2,len(words)-2):missing.append(t[:80])
```

The threshold is floored at **2** (`max(2, …)`). A label whose significant-word
list has **exactly one** word (>3 chars, not a stop-word) can contribute at most
**1** to the sum, so `1 < 2` is always true and the label is always reported
missing — no matter what the book contains.

The three VI-A offenders each reduce to a single significant word ≥12 chars:

| Sheet cell | Label text (`t`) | `norm` → words | count needed |
|---|---|---|---|
| Q2 (helper) | `SAL.TotalGrossSalary` | `['totalgrosssalary']` | 2 (max reachable 1) |
| C3 (title) | `Schedule VI-A` | `['schedule']` | 2 (max reachable 1) |
| F8 (header) | `Identifier No.` | `['identifier']` | 2 (max reachable 1) |

Verified empirically: appending the exact strings
`SAL.TotalGrossSalary`, `Schedule VI-A`, `Identifier No.` (and the bare tokens)
to the book leaves the three items still reported.

## Scope — this is systemic, not VI-A-specific
31 of the ITR-3 visible sheets carry at least one such single-word label
(examples: `Verification`, `Depreciation`, `Dividend Income`, `TOTAL INCOME`,
`Schedule VDA`, `Schedule CFL`, `EXEMPT INCOME`, `PAN of Co-owner(s)`,
`Salary as per section 17(1)`, `No Zip Code?`, …). Every one of these sheets is
therefore stuck RED on Gate 3 for the same reason. Only sheets with no single-word
label (e.g. `Nature Of Business`) can reach green today.

## What is needed to unblock
A one-line fix to the gate's threshold so a single-word label needs its one word
present rather than an impossible two — e.g. change line 75 from
`max(2,len(words)-2)` to `max(1,len(words)-2)` (or `min(2,len(words))`). Per the
constitution I must not edit a gate myself; this needs the CEO / auditor to make
the change (or confirm the intended heuristic).

## State of the VI-A book
`books/ITR-3/VI_A.md` is otherwise complete and passes every other Gate 3 check:
no `required schema key not in book` and no `dropdown value not in book` items.
All Part B / C / CA-and-D visible rows, both schema objects
(`UsrDeductUndChapVIA`, `DeductUndChapVIA`), all required totals, the
`PensionContribution80CCC[]` array keys, and all six dropdown lists are covered.
The three failing items are the title, a column header, and a cross-sheet helper
reference — all present verbatim in the book; they fail only on the threshold bug.
