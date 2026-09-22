# DPM - DOA — Gate 3 cannot reach GREEN: same systemic gate defect (not a book gap)

Sheet: **DPM - DOA**. Book: `books/ITR-3/DPM_DOA.md`. Blocks: ScheduleDPM, ScheduleDOA.
Run: `python3 tools/gates/gate.py --form ITR-3 --gate 3 --sheet "DPM - DOA"` -> RED, 3 items.

## The 3 remaining failures are all the one-significant-word-label defect
gate3 (line 74) marks a label missing when
`sum(1 for w in words if w in book) < max(2, len(words)-2)`, where `words` = label
tokens of length >3 not in STOP. For a label whose significant-token list has length 1,
the threshold is `max(2, 1-2) = 2`, but at most 1 match is achievable, so such labels can
never pass regardless of book content. This is the identical defect already escalated for
BP (`verify_BP_gate3_defect.md`), OS (`OS_gate3_blocker.md`) and SPI-SI-IF
(`reader_SPI_SI_IF_gatebug.md`).

The 3 flagged cells, each a single-significant-word visible cell whose one word is already
present verbatim in the book:
- `Schedule DPM`  [C3]   -> word: schedule  (dpm is 3 chars, drops out)
- `Schedule DOA`  [C33]  -> word: schedule
- `Total (3a+3b)` [E12]  -> word: total     (3a/3b are 2 chars, drop out)

All three are present verbatim in `books/ITR-3/DPM_DOA.md` ("Schedule DPM", "Schedule DOA",
"Total (3a+3b)"). The failing words come from the label, not the book, so no edit to the
book can satisfy them.

## Everything else is GREEN
- Schema keys: 0 "required schema key not in book" errors. All 21 distinct ScheduleDPM leaf
  keys and all ScheduleDOA leaf keys (Land + Building 5/10/40 + FurnitureFittings.Rate10 +
  IntangibleAssets.Rate25 + Ships.Rate20) are mapped in the book beside their sheet items.
- Dropdowns: 0 errors. The sheet defines no enumerated (list) dropdowns — all 46 validations
  are numeric bounds (min 0, or min -99999999999999 for the CapGainUs50 cells); the only
  Y/N picklist is on hidden row 31 and is documented under "Hidden rows — not built".
- Visible multi-word labels: all pass.
- Hidden rows r8, r9, r10, r31, r47, r48 documented only under "Hidden rows — not built".

## Recommendation (gate owner)
Same as prior escalations: `max(2, len(words)-2)` over-demands for short labels; it should be
`min(len(words), max(2, len(words)-2))` (or pre-skip labels with <2 significant words) so a
single-significant-word label is satisfiable. Per CLAUDE.md the gate must not be edited by a
reader; flagging with evidence and stopping.
