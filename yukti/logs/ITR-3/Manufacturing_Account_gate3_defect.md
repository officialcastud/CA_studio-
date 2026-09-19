# Manufacturing Account — Gate 3 cannot reach GREEN: same systemic gate defect (not a book gap)

Sheet: **Manufacturing Account**. Book: `books/ITR-3/Manufacturing_Account.md`. Block: ManufacturingAccount.
Run: `python3 tools/gates/gate.py --form ITR-3 --gate 3 --sheet "Manufacturing Account"` -> RED, 4 items.

## The 4 remaining failures are all the one-significant-word-label defect
gate3 (line 75) marks a label missing when
`sum(1 for w in words if w in book) < max(2, len(words)-2)`, where `words` = label tokens of
length >3 not in STOP. For a label whose significant-token list has length 1, the threshold is
`max(2, 1-2) = 2`, but at most 1 match is achievable, so such labels can never pass regardless
of book content. Identical defect already escalated for Trading Account, Schedule S, Part A - BS,
Profit and Loss, DPM - DOA, BP, OS, SPI-SI-IF, PTI, TPSA, VDA, AL, FSI, TDS, Part A - OI, and
Unabsorbed Depreciation.

The 4 flagged cells, each a single-significant-word visible cell whose one word is already
present verbatim in the book:
- `Total (i + ii)`             [F8, item 1Aiii]  -> word: total  (i/ii drop out, len<=3)
- `Total (i+ii+iii+iv+v+vi)`   [F22, item 1Evii] -> word: total  (all roman tokens len<=3)
- `Raw material`               [E25, item 2i]    -> word: material  (raw is 3 chars, drops out)
- `Total (2i +2ii)`            [E27, item 2iii]  -> word: total  (2i/2ii drop out)

All four are present verbatim in `books/ITR-3/Manufacturing_Account.md`. The failing words come
from the label, not the book, so no edit to the book can satisfy them.

## Everything else is GREEN
- Schema keys: 0 "required schema key not in book" errors. All 21 ManufacturingAccount leaf keys
  are mapped verbatim beside their sheet items: OpngStckRawMat, OpngStckWrkinPrgrs,
  OpngInvntryTotal*, Purchases, DirectWages, DirectExpenses*, CarriageInward, PowerAndFuel,
  OthDirectExpenses, IndirectWages, FactoryRentAndRates, FactoryInsurance, FactoryFuelAndPower,
  FactoryGeneralExpenses, DeprctnOfFactoryMachinery, TotalFactoryOverheads*, TotalDebtsManfctrngAcc*,
  ClsngStckRawMaterial, ClsngStckWrkInPrgrs, ClsngStckTotal*, and CostOfGoodsPrdcd* (* = required).
  All 8 required keys present.
- Dropdowns: 0 errors. The sheet defines no enumerated (list) dropdowns — all validations are
  numeric bounds only (min 0 on inputs/totals; min -99999999999999 on R28 / Sl.No.3), documented
  under "Dropdowns".
- Visible multi-word labels: all pass (opening stock of raw-material, opening stock of work in
  progress, purchases net of refunds, direct wages, direct expenses, carriage inward, power and
  fuel, other direct expenses, factory overheads, indirect wages, factory rent and rates, factory
  insurance, factory fuel and power, factory general expenses, depreciation of factory machinery,
  total of debits to manufacturing account, closing stock, work-in-progress, cost of goods produced
  transferred to trading account).
- Hidden rows: none. Every row (3-28) is visible; the dump printed no H flag.

## Recommendation (gate owner — NOT done here; readers never edit gates)
Same as prior escalations: `max(2, len(words)-2)` over-demands for short labels; it should be
`min(len(words), max(2, len(words)-2))` (or pre-skip labels with <2 significant words) so a
single-significant-word label is satisfiable. Per CLAUDE.md the gate must not be edited by a
reader; flagging with evidence and stopping. The book needs no change.
