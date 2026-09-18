# Reader note — sheet "SPI - SI - IF" — Gate 3 blocked by a gate bug (not the book)

Book `books/ITR-3/SPI_SI_IF.md` is complete: all 26 schema leaf keys mapped
(ScheduleSPI/SI/IF), all 4 dropdown lists with every value, every VISIBLE
multi-word row label, and all 48 hidden rows documented under "Hidden rows".
`gate.py --gate 3` reports **0** schema-key errors and **0** dropdown errors.

Residual: 22 "label not in book" items, ALL of which are visible cells whose
label reduces to exactly ONE significant word after the gate's STOP/len>3
filter (gate.py line 74). For such cells the gate requires
`sum(matches) >= max(2, len(words)-2)` = `max(2, 1-2)` = **2**, but a one-word
label can match at most 1 — so they can NEVER pass, regardless of book content.

Evidence (each word IS present in the book, still flagged):
Relationship, Schedule SPI, Tax thereon (iii), PAN of the firm,
"115BBE - Tax on income under section 68, 69, 69A, 69B, 69C or 69D.",
ExemptionUnderSI, ExemptionAmt, Tax at Spl Rate, For 112(proviso), FOR 112 Proviso,
For 111A-15%, For PTI-20% LTCG, 1st-112-20%LTCG, 4th - PTI-20% STCG, 6th-PTI-15%-STCG,
PTI_LTCG12_5P, PTI_5A1aiiaa, PTI_5A1aiiab, PTI_5A1aiiac, PTI_5A1aiiaaP,
PTI_5A1aiiaa2P, PTI_5AD1iDiv.

This is systemic: CG, OS and the ITR-2 books hit the same one-word cells.
Likely intended expression `max(2, len(words)) - 2` (which yields 0 for
one-word labels) was written as `max(2, len(words)-2)`. Per CLAUDE.md the gate
must not be edited by a reader; flagging for the CEO/gate owner.
