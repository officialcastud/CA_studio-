# PTI — Gate 3 cannot reach GREEN: same systemic single-word-label defect

Sheet: **PTI**. Book: `books/ITR-3/PTI.md`. Block: `SchedulePTI`.
Run: `python3 tools/gates/gate.py --form ITR-3 --gate 3 --sheet "PTI"` -> RED, 10 items.

## All 10 failures are the one-significant-word-label defect (line 74)
gate3 marks a label missing when
`sum(1 for w in words if w in book) < max(2, len(words)-2)`, where `words` = label
tokens of length >3 not in STOP. For a label whose significant-token list has length 1,
the threshold is `max(2, 1-2) = 2`, but at most 1 match is achievable, so such labels can
never pass regardless of book content. Identical to the escalations already filed for
BP (`verify_BP_gate3_defect.md`), OS (`OS_gate3_blocker.md`), SPI-SI-IF
(`reader_SPI_SI_IF_gatebug.md`) and DPM-DOA (`DPM_DOA_gate3_defect.md`).

The flagged cells, each a single-significant-word visible cell whose one word is already
present verbatim in `books/ITR-3/PTI.md`:
- `Schedule PTI`                  [C3]  -> word: schedule   (pti is 3 chars, drops out)
- `Head of income (6)`            [I4]  -> word: head       (income is a STOP word)
- `Net Income/ Loss 9=7-8 (9)`    [N4]  -> word: loss       (net 3 chars; income STOP)
- `TDS on such amount, if any (10)`[O4] -> word: amount     (tds 3 chars; on/such/if/any STOP)
- `Section 111A`  [J8/J23/J38]  x3 -> word: 111a           (section STOP)
- `Section 112A`  [J11/J26/J41] x3 -> word: 112a           (section STOP)

Each string is present verbatim in the book (grep-confirmed). The failing words come from the
label, not the book, so no book edit can satisfy them.

## Everything else is GREEN
- Schema keys: 0 "required schema key not in book" errors. All `SchedulePTI` leaf keys are
  mapped beside their sheet items (InvstmntCvrdUs115UA115UB, BusinessName, BusinessPAN;
  IncFromHP.*; CapitalGainsPTI.{ShortTermCG,STCG_Sec111A,STCG_Others,LongTermCG,LTCG_Sec112A,
  LTCG_Others}.*; IncClmdPTI.{TotalSec23FBB,Sec23FBB,SecBIncExmptDtl,SecCIncExmptDtl}.*;
  IncOthSrc.*; OS_Dividend.*; OS_Others.*).
- Dropdowns: 0 errors. The only enumerated list — (Select), Section 115U, Section 115UA,
  Section 115UB — is listed verbatim (mapped to enum A-115UA/B-115UB/C-115U). The other
  validations are max-length/numeric bounds, no value lists.
- Visible multi-word labels: all pass.
- Hidden rows: none — every PTI row (3-51) is visible; nothing suppressed.

## Recommendation (gate owner)
Same as prior escalations: `max(2, len(words)-2)` over-demands for short labels; it should be
`min(len(words), max(2, len(words)-2))` (or pre-skip labels with <2 significant words) so a
single-significant-word label is satisfiable. Per CLAUDE.md the gate must not be edited by a
reader; flagging with evidence.
