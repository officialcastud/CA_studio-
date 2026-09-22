# Yukti — the constitution

You are building an Income-tax return form for A.Y. 2026-27 as a single offline HTML file, from three official
sources, to a standard the e-filing portal will accept. This file is the law of the repository. Read it fully
before any action. `PIPELINE.md` is the procedure; `shell/README.md` is the contract a form must satisfy;
`forms/ITR-2/` with `books/ITR-2/` is the finished reference — study it before building anything.

## The one rule above all others
**Three sources must agree at once**: the utility (what the sheet shows), the schema (what the file must contain),
the validation rules (what must hold). Every mistake in ITR-2's build happened where one source was read and the
other two were not. Read `books/ITR-2/BUILD_RECORD.md` §4 — the seventeen mistakes — before starting.

## Roles (each is a subagent in `.claude/agents/`; the session model is the CEO's)
- **ceo** — supervises, decides, dispatches, and is the only one who declares a phase done. Never writes a book or a section itself; it reads gate logs and directs.
- **structure-architect** — Phase 1 only: reads every sheet name and its hidden flag, writes `structure.md` and `section_map.json`.
- **sheet-reader** — one per sheet, in parallel: reads its sheet row by row with `tools/dump.py` (hidden flags, dropdowns, formulas, the VBA text) and the schema block(s) for it, writes `books/<form>/<Sheet>.md` to the book contract, runs `gate.py --gate 3 --sheet "<name>"`, fixes until green. Cheap model; the gate is the guard, not the model.
- **sheet-verifier** — independent second reader for the same sheet: reruns the gate, reads the book against the sheet dump, files what it finds in `logs/<form>/verify_<Sheet>.md`. Never edits the book; the reader does.
- **section-builder** — one per section, in parallel, in its own worktree: builds `forms/<form>/src/30_sections_<id>.js` and the section's engine, export, import, checks — from the books only. Strongest model.
- **integrator** — assembles the form (`tools/assemble.py`), resolves the worktrees into one file, runs Gates 2, 4, 5, and fixes cross-section seams (compute order, fed lines, totals). Strongest model.
- **rules-enforcer** — Phase 6: encodes every checkable rule from `rules.json` into `60_rules.js`, from the rule's text; edits the engine where a rule contradicts it; fixes until Gate 6 is green. Strongest model.
- **test-client** — Phase 7: writes `tests/<form>/state.js` — the constant identity, every fillable box of the form — and `figures.json` computed by hand; fixes until Gate 7 is green.
- **auditor** — the external supervisor. Runs from the scheduled Routine: reruns every gate, reads the logs, opens a GitHub issue per red item with the rule serial or sheet row, and — if the last CEO session has stopped — restarts the pipeline from the first red gate.

## The gates are the only definition of progress
`python tools/gates/gate.py --form <form> --gate K` returns 0 on green. A phase is not done until its gate is green
and every earlier gate is still green. Log every run. Never edit a gate to make it pass; if a gate is wrong, say
so in an issue with the evidence and stop.

## The seventeen rules (from the mistakes)
1. Never build a hidden row; log it as excluded with the reason. A hidden sheet that the utility unhides on demand (the 80x sub-schedules) is built — say so in `section_map.json` as `why_built`.
2. Never port an engine from another form. Every formula from this form's sheets and VBA.
3. Every live row must have a schema key, or it cannot be filed — drop it and log it.
4. Every schema array under a block must have a place on screen.
5. Item numbers come from the rules document, never from counting rows.
6. Encode a rule from its text; if the engine disagrees, the engine is wrong until proven otherwise.
7. Read the hidden computation sheets (e.g. "Tax Calculated"); the display sheet shows results, the hidden one shows the method.
8. Helper columns are rules. Read them.
9. Read the whole header text of every column; conditions live there.
10. Read every enum's range before seeding a default.
11. After every splice, grep for duplicate writers of the same key (`gate.py` does this).
12. The round-trip is a gate: return JSON → import → export must be identical.
13. Zero errors is a state the next change breaks; rerun every earlier gate after every change.
14. Read the rules document before writing test data, so the client is a lawful one.
15. Verify one figure per schedule by hand, to the rupee, before trusting the engine.
16. Review the screenshot against the book, not against the code's intent.
17. When a source is unreadable (compressed VBA, a truncated PDF line), say so in the log; do not guess.

## Per-form facts that must come from the sources, never from the previous form
- The due date under 139(1): from the utility's `finalDuedate` formula and the rules document, per case (audit / non-audit). Set `FORM.due`.
- The numbering of every schedule's items: from that form's rules document. ITR-3's Schedule CG has slump sale live (A2/B2); ITR-2's does not. Nothing about numbering transfers between forms.
- The loss chain (CYLA/BFLA/CFL): ITR-3 has business rows (speculative, specified business, unabsorbed depreciation) and a different set-off order. Read its sheet's formulas.
- The AMT triggers: ITR-3's are wider (10AA, 35AD, Chapter VI-A Part C) than ITR-2's (80QQB/80RRB only).
- The schema root and its blocks (`books/<form>/blocks.json`) — build every block the form allows for the client; log the ones it cannot (e.g. FII-only) with the reason.

## Conventions
- One HTML file per form, assembled by `tools/assemble.py` from `forms/<form>/src/*.js` and the shell. Never edit the shell per form; if the shell needs a change, it is a separate PR with `example.html` re-verified.
- Renderers, ids, footer contract: `shell/README.md`. Maroon and white; red label text for mandatory; `DD/MM/YYYY` on every date; the dustbin; computed cells green and untypeable; every override behind the sheet's own switch.
- The constant test identity is in `PIPELINE.md`. Every form is tested on S SUDHIR, TVOPS4373C, 05/11/2006.
- Commit after every green gate with the message `ITR-N: gate K green (<counts>)`. Push to `claude/itr-N`. Open a PR to `main` only on Gate 7.
- Logs are for humans: name the sheet, the row, the schema key, or the rule serial. Never "fixed stuff".

## Unattended operation
There is no human in the loop until Gate 7. If you are blocked (a source is missing, a gate is provably wrong,
usage is exhausted), write `logs/<form>/BLOCKED.md` with exactly what is needed and stop. The auditor Routine
will find it and raise it. Do not invent a source to get past a gate.
