# CFL — Gate 3 cannot reach GREEN: same systemic single-word-label defect

Sheet: **CFL**. Book: `books/ITR-3/CFL.md`. Block: `ScheduleCFL`.
Run: `python3 tools/gates/gate.py --form ITR-3 --gate 3 --sheet "CFL"` -> RED, 2 items.

## The 2 remaining failures are the one-significant-word-label defect (gate.py line ~75)
gate3 marks a label missing when
`sum(1 for w in words if w in book) < max(2, len(words)-2)`, where `words` = label
tokens of length >3 not in STOP. For a label whose significant-token list has length 1,
the threshold is `max(2, 1-2) = 2`, but at most 1 match is achievable, so such a label can
never pass regardless of book content. Identical to the escalations already filed for
GST (`BLOCKED_GST.md`), VDA (`VDA_gate3_defect.md`), BP, OS, SPI-SI-IF, DPM-DOA, PTI, etc.
The GST note already names "Schedule CFL" among the affected labels.

The two flagged cells — each a single-significant-word visible cell whose one word is
already present verbatim in `books/ITR-3/CFL.md`:
- `Schedule CFL`   [C3] -> word: `schedule`  (`cfl` is 3 chars, drops out)
- `Serial No. (1)` [D4] -> word: `serial`    (`no`, `1` drop out)

Both strings appear verbatim in the book. The failing word comes from the label, not the
book, so no book edit can satisfy the check. Note the two off-by-one gate oversights:
- The pre-skip length guard is `len(t)<12`, and "Schedule CFL" is exactly 12 chars, so it
  is NOT skipped the way the 11-char "Schedule CG"/"Schedule OS" banners are.
- The serial-column skip guard is `"Sl. No" in t`, but the CFL sheet spells its column-1
  header "Serial No. (1)", which does not contain the substring "Sl. No", so it is checked.

Proof (independent of book content):
    'Schedule CFL'   -> words ['schedule'] -> needs 2 matches from 1 word => UNSATISFIABLE
    'Serial No. (1)' -> words ['serial']   -> needs 2 matches from 1 word => UNSATISFIABLE

## Everything else is GREEN
- Schema keys: 0 "required schema key not in book" errors. Every `ScheduleCFL` leaf key is
  mapped verbatim beside its sheet item — the year blocks `LossCFFromPrev9thYearFromAY` …
  `LossCFCurrentAssmntYear2026` and the summary blocks `TotalOfBFLossesEarlierYrs`,
  `AdjTotBFLossInBFLA`, `CurrentAYloss`, `TotalLossCFSummary`, with their leaves
  `DateOfFiling`, `TotalHPPTILossCF`, `BrtFwdBusLoss`, `AdjustAccTax115BACAmt`,
  `BusLossOthThanSpecLossCF`, `LossFrmSpecBusCF`, `LossFrmSpecifiedBusCF`,
  `TotalSTCGPTILossCF`, `TotalLTCGPTILossCF`, `OthSrcLossRaceHorseCF`.
- Dropdowns: 0 errors. Schedule CFL exposes no enumerated value lists — every cell
  validation is a numeric constant/bound (`0`, `10`, `-99999999999999`), all documented.
- Visible multi-word labels: all pass (schedule banner text, the ten loss-column headers 4–10,
  the business sub-headers 5a/5b/5c, and the four summary-row labels xvii–xx).
- Hidden rows: none among the labelled rows 3–25 (the dump prints no `H`). The sheet's 88
  blank helper/spacer rows carry no labels and no schema mapping; documented under
  "Hidden rows — not built". ITR-3 keeps the business/speculative/specified columns visible.

## Recommendation (gate owner — reader must not edit the gate, per CLAUDE.md)
Same fix as prior escalations: `max(2, len(words)-2)` over-demands for short labels; make it
`min(len(words), max(2, len(words)-2))` (or pre-skip labels with <2 significant words, or
change the length guard to `<=12` and the serial guard to also match "Serial No.").
Per CLAUDE.md the gate must not be edited by a reader; flagging with evidence and stopping.
