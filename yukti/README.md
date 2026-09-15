# Yukti — one repository, every ITR form

An offline single-file HTML return builder per form, built by Claude Code from the government's own three sources
(the utility, the JSON schema, the validation rules), to a standard the e-filing portal accepts, unattended, in the cloud.

`forms/ITR-2/Yukti_ITR2.html` is finished and is the reference: 45 of 46 schema blocks, 429 validation rules coded,
zero schema errors, zero Category A, byte-identical round-trips. Gates 0, 1, 2, 4, 5, 6, 7 are green on it. Its Gate 3
(books) is red on purpose — its books predate the book contract; regenerating them is the pipeline's first self-test.

## What is in here
| Path | What |
|---|---|
| `CLAUDE.md` | the constitution every agent reads first — roles, gates, the seventeen rules |
| `PIPELINE.md` | the eight phases with their gates, the constant test identity |
| `KICKOFF.md` | the one prompt that starts a build, and the auditor's prompt |
| `.claude/agents/` | ceo · structure-architect · sheet-reader · sheet-verifier · section-builder · integrator · rules-enforcer · test-client · auditor |
| `shell/` | the UI every form shares (`shell.js`, `shell.css`, `body.html`), the contract (`README.md`), `example.html` |
| `tools/` | `extract_utility.py` · `dump.py` · `schema_tools.py` · `rules_pdf.py` · `assemble.py` · `gates/gate.py` · `harness/` |
| `sources/ITR-N/` | drop the `.xlsm`, the schema `.json`, the rules `.pdf` here |
| `books/ITR-N/` | the per-sheet books, `structure.md`, `section_map.json`, `rules.json`, `enums.json`, `skeleton.json` |
| `forms/ITR-N/` | `src/*.js` parts and the assembled `Yukti_ITRN.html` |
| `tests/ITR-N/` | `state.js` (the client), `figures.json` (hand-computed), cases |
| `logs/ITR-N/` | every gate run, verifier reports, audits, `BLOCKED.md` if stuck |
| `.github/workflows/gates.yml` | runs every gate on GitHub's machines on every push — the second supervisor |

## Start a build (about ten minutes of your time, then none)
1. Create a private GitHub repository and push this folder to `main`.
2. Put the form's three sources in `sources/ITR-N/`: the utility zip's `.xlsm`, the schema JSON, the validation-rules PDF. Commit.
3. **The cloud environment** (claude.ai/code → the cloud icon above the message box → settings on Default, or Add cloud environment): Network access = *Custom*, tick *Also include default list of common package managers*, add `playwright.azureedge.net`, `cdn.playwright.dev`, `playwright.download.prss.microsoft.com`; Setup script = the contents of `tools/cloud_setup.sh`. Save. (Or simply *Full* network access.)
4. **claude.ai/code** → the repository, branch `main` → permission mode *Auto* → paste the *Kickoff* prompt from `KICKOFF.md` with the form id. Choose the strongest model. The session runs on Anthropic's cloud; close the laptop.
5. **Routines** (claude.ai/code/routines → New routine): name *Yukti auditor*, prompt = the *Audit* prompt from `KICKOFF.md`, repository = this one, environment = the one from step 3, trigger = *Schedule → hourly*, model = the strongest, remove connectors you don't need. This is the external supervisor: it reruns the gates, files issues, and restarts the ceo if the build stalls. Routines have a daily run cap per plan; runs beyond it are dropped, which is harmless here.
6. GitHub Actions is already the third pair of eyes: every push to `claude/itr-N` runs all gates on a GitHub runner and opens an issue on red.
7. You get a pull request titled `ITR-N complete — every gate green`. Review the counts, download the form.

## Models and cost
The ceo, section-builders, integrator, rules-enforcer and test-client inherit the session's model — use the strongest
with the highest effort. The sheet-readers and verifiers are `sonnet`: the work is reading and diffing, and the
mechanical Gate 3 is the guard, not the model. Routines have a daily run cap per plan; hourly is within it.
A full form is on the order of dozens of agent sessions; on a 20× plan that is a day or two of unattended work.

## Run the gates yourself
```
pip install jsonschema playwright pymupdf && python -m playwright install chromium
python tools/gates/gate.py --form ITR-2 --gate all
```
