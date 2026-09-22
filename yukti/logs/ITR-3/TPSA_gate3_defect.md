# TPSA — Gate 3 cannot reach GREEN: same systemic single-word-label defect

Sheet: **TPSA**. Book: `books/ITR-3/TPSA.md`. Block: `ScheduleTPSA`.
Run: `python3 tools/gates/gate.py --form ITR-3 --gate 3 --sheet "TPSA"` -> RED, 2 items.

## Both failures are the one-significant-word-label defect (gate.py line 74)
gate3 marks a label missing when
`sum(1 for w in words if w in book) < max(2, len(words)-2)`, where `words` = label
tokens of length >3 not in STOP. For a label whose significant-token list has length 1,
the threshold is `max(2, 1-2) = 2`, but at most 1 match is achievable, so such a label can
never pass regardless of book content. Identical to the escalations already filed for
BP (`verify_BP_gate3_defect.md`), OS (`OS_gate3_blocker.md`), PTI (`PTI_gate3_defect.md`),
SPI-SI-IF (`reader_SPI_SI_IF_gatebug.md`), DPM-DOA (`DPM_DOA_gate3_defect.md`),
DEP-DCG, Trading Account, etc.

The two flagged cells, each a single-significant-word visible cell whose one word is already
present verbatim in `books/ITR-3/TPSA.md`:
- `Surcharge @ 12% on “a”`   [D9]  -> word: surcharge   (12 is 2 chars; on 2 chars; “a” 1 char)
- `Net tax payable (2d-3)`   [D13] -> word: payable     (net 3 chars; tax 3 chars; 2d/3 drop)

Both strings are present verbatim in the book (grep-confirmed: "Surcharge @ 12% on “a”"
at the 2b item row; "Net tax payable (2d-3)" at the item-4 row). The failing words come from
the label, not the book, so no book edit can satisfy them.

## Everything else is GREEN
- Schema keys: 0 "required schema key not in book" errors. All `ScheduleTPSA` leaf keys are
  mapped beside their sheet items: AmtPrimaryAdjUs92CE_2A, AdditionalIncTax18PercAbove,
  Surcharge12Perc, HealthEducationCess, TotalAdditionalTax, TaxesPaid, NetTaxPayable,
  TotalAmountDeposited, and the array DtlsTaxesPaid[].{BSRCode, BankBranchName, DateDep,
  SrlNoOfChaln, Amount}.
- Dropdowns: 0 errors. TPSA has no enumerated value lists — the data-validation cells
  (D17:D18 BSR, E17:E18 bank-name len-125, F17:F18 date, G17:G18 challan serial, computed
  P4/P8:P13) are length/format/lock constraints, all resolving to null.
- Visible multi-word labels: all pass (item 1 primary-adjustment text, 2a additional income
  tax, 2c health & education cess, 2d total additional tax, item 3 taxes paid, Details of
  Taxes Paid header, the table column headers, Amount deposited).
- Hidden rows: r5 (Financial Year / Amount), r6 (1a 2019-20), r7 (1b 2020-21) — logged under
  "Hidden rows — not built", never presented as items.

## Recommendation (gate owner)
Same as prior escalations: `max(2, len(words)-2)` over-demands for short labels; it should be
`min(len(words), max(2, len(words)-2))` (or pre-skip labels with <2 significant words) so a
single-significant-word label is satisfiable. Per CLAUDE.md the gate must not be edited by a
reader; flagging with evidence.
