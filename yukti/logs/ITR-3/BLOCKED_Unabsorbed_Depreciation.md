# BLOCKED — Gate 3 cannot go GREEN for sheet "Unabsorbed Depreciation"

## Status
Book `books/ITR-3/Unabsorbed_Depreciation.md` is complete and correct against all three sources.
Gate 3 reports RED with exactly 2 items, both of which are **provably unsatisfiable by any book edit** — this is a gate scoring limitation, not a book gap. I did not edit the gate and did not fabricate a pass.

## The 2 failing items
```
[Unabsorbed Depreciation] label not in book: Depreciation
[Unabsorbed Depreciation] label not in book: Allowance under section 35(4)
```

## Evidence
These are the two block-caption cells on visible row 5 (not hidden — `<row r="5" ...>` has no hidden attr; mergeCells `E5:H5` and `I5:K5`):
- `[E5]` SST #318 = `"Depreciation"` (group header over cols 3, 3a, 4, 5)
- `[I5]` SST #1053 = `"Allowance under section 35(4)"` (group header over cols 6, 7, 8)

Both words ("depreciation", "allowance") appear many times in the book. The gate still fails them because of its label-scoring formula (gate.py gate3, lines ~74-75):
```python
words=[w for w in norm(t).split() if len(w)>3 and w not in STOP][:6]
if words and sum(1 for w in words if w in book)<max(2,len(words)-2): missing.append(...)
```
- `"Depreciation"` -> qualifying words `["depreciation"]` (1 word) -> threshold `max(2, 1-2)=2` -> max possible hits = 1 < 2 => can never pass.
- `"Allowance under section 35(4)"` -> `"under"`,`"section"` are in STOP; `"35"`,`"4"` fail `len>3` -> qualifying words `["allowance"]` (1 word) -> threshold 2 -> max hits 1 < 2 => can never pass.

For any single-qualifying-word label the required minimum is 2 hits but the maximum achievable is 1, so no book content can satisfy it. The reference form ITR-2 has zero single-qualifying-word visible labels, so this oversight never surfaced there; ITR-3 Schedule UD's merged block captions are the first case.

## Recommended fix (gate, not book)
Change the floor for short labels, e.g. `max(1, len(words)-2)` (or skip the floor when `len(words)==1`), so a lone block caption passes when its word is present. This is a one-line change to `tools/gates/gate.py::gate3`; per CLAUDE.md a gate change is a separate, evidenced action and I am leaving it to the CEO/auditor.

## Everything else is green
All 16 schema leaf keys map and appear verbatim; all `required` keys present; both dropdown groups covered (AY list values are `null` in the dump — not enumerable — noted in the book with the VBA constraints); no hidden rows exist. The only RED items are the two captions above.
