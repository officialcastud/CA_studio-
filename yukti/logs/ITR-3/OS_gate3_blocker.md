# OS — Gate 3 blocker (provable gate defect, not editable per CLAUDE.md)

The OS book (`books/ITR-3/OS.md`) covers every visible multi-word row label,
all 112 required `ScheduleOS` schema keys, and all 6 resolvable dropdown lists.
`gate.py --gate 3 --sheet "OS"` still prints RED — 12 items, ALL of type
`label not in book`, and every one is a label whose significant-token list has
length 1.

## The defect
gate3 marks a label missing when
`sum(present) < max(2, len(words)-2)` where `words` = label tokens of length >3
not in STOP. For a one-token label, `present` can be at most 1 while the
requirement is `max(2, -1) = 2`, so it is unsatisfiable by any book content.
Proof: len(words)=1 -> need 2, max achievable 1 -> False. (len>=2 is fine.)
This is independent of the STOP set: e.g. "Depreciation" is a genuine one-word
form field and can never pass.

## The 12 blocked cells (all single significant token)
Genuine form labels: `Dividend income u/s 2(22)(e)` [F7], `Dividend income u/s
2(22)(f)` [F8], `From Income Tax refund` [G12], `Income Benefit` [H54],
`Amount of income` [G79], `Rate as per I.T. Act` [N79], `Depreciation` [F89],
`Upto 15/6 (i)` [H107]. Helper/annotation cells (no schema key): `os.BalanceNoRaceHorse`
[X82], `For AY 2025-26` [X94], `for AY 2025-26` [S103, S111].

All are present/described in the book; the gate's arithmetic rejects them anyway.
Per CLAUDE.md the gate is not edited. Escalating to CEO/auditor.
