# VDA — Gate 3 cannot reach GREEN: same systemic single-word-label defect

Sheet: **VDA**. Book: `books/ITR-3/VDA.md`. Block: `ScheduleVDA`.
Run: `python3 tools/gates/gate.py --form ITR-3 --gate 3 --sheet "VDA"` -> RED, 1 item.

## The 1 remaining failure is the one-significant-word-label defect (line 74)
gate3 marks a label missing when
`sum(1 for w in words if w in book) < max(2, len(words)-2)`, where `words` = label
tokens of length >3 not in STOP. For a label whose significant-token list has length 1,
the threshold is `max(2, 1-2) = 2`, but at most 1 match is achievable, so such a label can
never pass regardless of book content. Identical to the escalations already filed for
BP (`verify_BP_gate3_defect.md`), OS (`OS_gate3_blocker.md`), SPI-SI-IF
(`reader_SPI_SI_IF_gatebug.md`), DPM-DOA (`DPM_DOA_gate3_defect.md`) and PTI
(`PTI_gate3_defect.md`).

The one flagged cell, a single-significant-word visible cell whose one word is already
present verbatim in `books/ITR-3/VDA.md`:
- `Schedule VDA`  [B3]  -> word: schedule   (vda is 3 chars, drops out)

`Schedule VDA` is present verbatim in the book (title line and elsewhere). The failing word
comes from the label, not the book, so no book edit can satisfy it. Note the off-by-one: the
pre-skip guard is `len(t)<12`, and "Schedule VDA" is exactly 12 chars, so it is not skipped
the way the 11-char "Schedule CG"/"Schedule OS" headers are.

## Everything else is GREEN
- Schema keys: 0 "required schema key not in book" errors. All `ScheduleVDA` leaf keys are
  mapped beside their sheet items: `ScheduleVDADtls` and its leaves
  (`DateofAcquisition`, `DateofTransfer`, `HeadUndIncTaxed`, `AcquisitionCost`,
  `ConsidReceived`, `IncomeFromVDA`), plus `TotIncBusiness` and `TotIncCapGain`.
- Dropdowns: 0 errors. The only enumerated list — Col 4 head (cells F5:F7): `(Select)`,
  `Business Income`, `Capital Gain` — is listed verbatim. All other cell validations are
  numeric bounds (min 0 / max 99999999999999; the I10 total carries min -99999999999999),
  no value lists.
- Visible multi-word labels: all pass (col headers 1-7, Total A, Total B, the top note).
- Hidden rows: none — every VDA row (3, 4, 5-7, 9, 10) is visible; row 8 is a spacer with
  only cell-range anchors and no printed label. Documented under "Hidden rows — not built".

## Recommendation (gate owner)
Same as prior escalations: `max(2, len(words)-2)` over-demands for short labels; it should be
`min(len(words), max(2, len(words)-2))` (or pre-skip labels with <2 significant words, or
change the length guard to `<=12`) so a single-significant-word label is satisfiable. Per
CLAUDE.md the gate must not be edited by a reader; flagging with evidence and stopping.
