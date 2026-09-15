# Schedule BP — Gate 3 cannot reach GREEN: provable gate defect (not a book gap)

Sheet: BP. Book: books/ITR-3/BP.md. Run: `python3 tools/gates/gate.py --form ITR-3 --gate 3 --sheet "BP"` → RED, 13 items.

## Evidence
gate3's per-label test is:
    words=[w for w in norm(t).split() if len(w)>3 and w not in STOP][:6]
    if words and sum(1 for w in words if w in book) < max(2, len(words)-2): FAIL
For a label whose significant-word list has length 1, the threshold is `max(2, 1-2) = 2`, but the maximum
achievable match count is 1. Such labels are therefore impossible to satisfy no matter what the book contains.

All 13 remaining failures are exactly these single-significant-word visible labels (verified programmatically:
every failing label has len(words)==1, and its one word is already present in the book):
  - "Dividend Income" (rows 13 and 41)            word: dividend
  - "Share of income from AOP/ BOI" (row 38)      word: share   ("income","aop","boi" fall out: STOP / <4 chars)
  - "Balance (1– 2a – 2b …)" (row 49, item 6)     word: balance (all the 2-char cell refs drop out)
  - "Total (7a + 7b …)" (row 60, item 9)          word: total
  - "Deemed income under section 41" (row 74)     word: deemed  ("income","under","section" are STOP; "41" <4)
  - "Total (14 + 15 …)" (row 95, item 26)         word: total
  - "Total (27+28+29+30+31+32)" (row 107, item 33) word: total
  - "Section 44BB"  (row 114, 35v)                word: 44bb    ("section" is STOP)
  - "Section 44BBA" (row 115, 35via)              word: 44bba
  - "Section44BBC"  (row 118, 35vib)              word: section44bbc
  - "Section 44BBD" (row 119, 35vic)              word: 44bbd
  - "Section 44DA"  (row 120, 35vii)              word: 44da

These are all genuine live rows (each has a schema key) and are fully documented as items in BP.md with their
schema keys and formulas; they are not hidden and not droppable (constitution rule 3). The book cannot be
changed to make them pass because the failing words come from the label, not the book.

## Everything else is green
- 111 checked visible labels: 98 pass, 13 fail (all the 1-word case above).
- Required schema keys: 116/116 present (0 missing); 131/131 leaves mapped in the book.
- Dropdown BP_Drp (G154:G155): all 14 values present verbatim (incl. the `\xa0` after "(a)"/"(b)").

## Recommendation (gate owner)
gate3's threshold over-demands for short labels. `max(2, len(words)-2)` should be
`min(len(words), max(2, len(words)-2))` (or the label pre-filter should skip labels with <2 significant words),
so single-significant-word labels are satisfiable. This is systemic across ITR-3 Phase 3 sheets (OS, CG,
Schedule S, etc. show the same 1-word-label failures). Per CLAUDE.md the gate must not be edited by a reader;
flagging with evidence.
