# BLOCKED — DEP_DCG (ITR-3) Gate 3 cannot reach GREEN

## Status
Book `books/ITR-3/DEP_DCG.md` is complete and correct. It covers:
- Every VISIBLE labelled row of Sch DEP (items 1a,1b,1c,1d,1e,2a,2b,2c,2d,3,4,5,6) and
  Sch DCG (items 1a,1b,1c,1d,1e,2a,2b,2c,2d,3,4,5, total), each with its cell reference.
- Every schema leaf key verbatim for both blocks — all 10 required keys of `ScheduleDEP`
  (SummaryFromDeprSch.PlantMachinerySummary.{DeprBlockTot15Percent, DeprBlockTot30Percent,
  DeprBlockTot40Percent, DeprBlockTot45Percent, TotPlntMach}, SummaryFromDeprSch.BuildingSummary.
  {DeprBlockTot5Percent, DeprBlockTot10Percent, DeprBlockTot40Percent, TotBuildng},
  SummaryFromDeprSch.TotalDepreciation) plus the three optional scalars (FurnitureSummary,
  IntangibleAssetSummary, ShipsSummary); and all 10 required keys of `ScheduleDCG`
  (SummaryFromDeprSchCG.PlantMachinerySummaryCG.{DeprBlockTot15Percent, DeprBlockTot30Percent,
  DeprBlockTot40Percent, DeprBlockTot45Percent, TotPlntMach}, SummaryFromDeprSchCG.BuildingSummaryCG.
  {DeprBlockTot5Percent, DeprBlockTot10Percent, DeprBlockTot40Percent, TotBuildng},
  SummaryFromDeprSchCG.TotalDepreciation) plus the three optional scalars.
- No real dropdown lists (dropdown dump gives only numeric validation floors 0 / -99999999999999,
  values null).
- The 8 hidden rows (Sch DEP r8-r11 @50/60/80/100%, Sch DCG r29-r32 @50/60/80/100%) placed ONLY
  under "Hidden rows — not built", never as items.

`python3 tools/gates/gate.py --form ITR-3 --gate 3 --sheet "DEP_DCG"` still prints
`GATE 3: RED — 3 items`, all of type `label not in book`, all three VISIBLE bare-total labels:
    - Total ( 1a +1b + 1c +1d)   (Sch DCG r34, item 1e -> SummaryFromDeprSchCG.PlantMachinerySummaryCG.TotPlntMach)
    - Total ( 2a + 2b + 2c)      (Sch DCG r39, item 2d -> SummaryFromDeprSchCG.BuildingSummaryCG.TotBuildng)
    - Total ( 1e+2d+3+4+5)       (Sch DCG r43, total -> SummaryFromDeprSchCG.TotalDepreciation)
All three are present verbatim in the book. This is the SAME gate defect already logged for
Schedule S, Part A - BS, Profit and Loss, OS, and Trading Account — not a book gap.

## Root cause (tools/gates/gate.py, gate3)
    if words and sum(1 for w in words if w in book) < max(2, len(words)-2): missing.append(...)
`words` = label tokens of length >3 not in STOP. Each of the three DCG total labels norms to a
single significant token {total} (the block references "1a","1b","1e","2d",... are all length <=2).
For a one-token label, `present` can be at most 1 while the requirement is `max(2, 1-2) = 2`, so
the condition is always true and no book content can clear it — `words` derives from the immutable
sheet label. (The Sch DEP totals pass because they read "Total depreciation ..." = 2+ tokens.)

## What is needed (for the auditor/CEO — NOT done here; readers never edit gates)
Same gate fix already requested in the other blocker logs: let a 1-significant-word label need only
its 1 word (e.g. threshold `max(1, len(words)-2)`). The book itself needs no change; it is complete.

Escalating to CEO/auditor. Per CLAUDE.md the gate is not edited and no hidden row is presented to
satisfy it.
