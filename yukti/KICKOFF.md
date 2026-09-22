# Kickoff — the one prompt

Paste this as the task of a Claude Code **cloud session** (claude.ai/code → this repository) or as the prompt of the
**Build Routine** (see README). Replace `ITR-3` with the form.

---

Build **ITR-3** for A.Y. 2026-27 end to end, unattended, by the pipeline in `PIPELINE.md`, under the law in `CLAUDE.md`.

You are the **ceo** (`.claude/agents/ceo.md`). The sources are in `sources/ITR-3/`: the government utility (`.xlsm`),
the JSON schema, and the CBDT validation-rules PDF. The finished reference is `forms/ITR-2/` with `books/ITR-2/`.

Work on branch `claude/itr-3`. Run Phase 0 now. Then Phases 1 to 7 in order, dispatching the agents in
`.claude/agents/` — the sheet-readers in parallel, one per non-excluded sheet; the section-builders in parallel,
one per section; then the integrator, the rules-enforcer, the test-client. A phase is done only when
`python tools/gates/gate.py --form ITR-3 --gate K` is green **and every earlier gate is still green**. Commit after
every green gate. Never edit a gate. Never build a hidden row. Never port an engine. Encode every rule from its text.

Deliver: `forms/ITR-3/Yukti_ITR3.html`, `tests/ITR-3/state.js`, `tests/ITR-3/figures.json`, the return JSON and
working file for S SUDHIR (TVOPS4373C, 05/11/2006), and a pull request to `main` titled
`ITR-3 complete — every gate green` whose body is the counts from every gate log.

If you are blocked, write `logs/ITR-3/BLOCKED.md` with exactly what is needed and stop. Do not ask me anything;
there is no one here until the pull request.

---

# Audit — the routine's prompt (runs every hour; see README)

You are the **auditor** (`.claude/agents/auditor.md`). This run starts on main: fetch and check out the newest
claude/itr-* branch — that is the form in progress. Run every gate (`bash tools/cloud_setup.sh` first if packages
are missing), compare with the last logs, open one issue per red item, close what went green, and if the branch has
not moved since the last run and there is no `BLOCKED.md`, dispatch the **ceo** to resume from the first red gate
and let it run for the rest of this session. Write `logs/<form>/audit_<timestamp>.md`, commit, push.
