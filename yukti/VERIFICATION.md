# Yukti — the verification plan for ITR-5, ITR-6, ITR-7

This is the standard we hold every new form to before we call it done. It is not a new procedure —
`PIPELINE.md` builds the form and `CLAUDE.md` is the law. This file is the **acceptance protocol**:
the exact inspections, the exact case combinations, and the exact way corrections are made and proven,
distilled from how ITR-3 and ITR-4 were driven to a byte-for-byte replica of the CBDT utility.

Read `PIPELINE.md` first (the eight gates) and `logs/ITR-3/audit/FIXES.md` second (a worked correction
ledger). Then this.

> **One sentence:** a form is verified when every schema leaf has a home, every gate is green on the
> complete client, the export validates with zero schema errors and round-trips byte-identical, and the
> same is re-proven on each case in that form's case matrix — resident, non-resident, audit, presumptive,
> and each regime — not only on the one canonical client.

---

## 0. Prerequisite — the three sources must exist first

`sources/ITR-5/`, `sources/ITR-6/`, `sources/ITR-7/` do **not** exist in the repo yet. Nothing below can
start until, for each form, we have all three official sources for **A.Y. 2026-27** and they agree on the
version:

| Source | File | Used by |
|---|---|---|
| Utility | `sources/ITR-N/<utility>.xlsm` (unzipped to `utility/`) | `dump.py` — sheets, rows, hidden flags, dropdowns, formulas, VBA |
| Schema | `sources/ITR-N/<schema>.json` | `schema.py` → `blocks.json`, `skeleton.json`, `enums.json` |
| Rules | `sources/ITR-N/<rules>.pdf` | `rules_pdf.py` → `rules.json` (category + serial) |

**Gate 0 blocks the whole build if any is missing or the versions disagree.** Do not start a form whose
sources are incomplete; write `logs/ITR-N/BLOCKED.md` and stop (CLAUDE.md, "Unattended operation").

---

## 1. The inspection catalogue — what "verified" is made of

Eight distinct inspections. Each is a script that returns pass/fail; each writes a human-readable log naming
the sheet row, the schema key, or the rule serial. **Every one must pass on every case in the matrix (§2),
not just once.**

### I-1. Sheet-by-sheet, row-by-row audit (the exact-replica check)
The inspection the user asked for by name: *"sheet by sheet, row to row … every schema particular that has
to be filled must enter through the software … an exact replica of the utility."*

- For **every visible sheet**, `dump.py --sheet "<name>"` lists every live row (H = hidden, never built).
  Each live row must have a field on screen — direct input **or** a computed/green cell. A row with no home
  is a replica gap.
- Run one **sheet-reader** + one independent **sheet-verifier** per sheet (CLAUDE.md roles). The reader owns
  the book; the verifier only files findings in `logs/ITR-N/verify_<Sheet>.md`.
- Hidden rows are logged as excluded with the reason; a sub-schedule the utility unhides on demand
  (the 80-series, MAT/AMT workings) is built and marked `why_built`.
- **Tooling:** `dump.py`, Gate 3.

### I-2. Schema-leaf coverage (every particular has a space)
Every leaf of every block in `books/ITR-N/blocks.json` must have a home in the assembled HTML: an export
path, an object-literal key, or a `data-p` input.

- **Tooling:** `tools/coverage.py --form ITR-N` (concat-aware). **Target: 0 required and 0 optional
  uncovered.** ITR-3 finished at 0 of 2798.
- A leaf the form genuinely cannot produce for any client (a block for a different assessee type the schema
  shares) is logged as not-applicable with the reason — it is never left silently uncovered.

### I-3. Round-trip identity (nothing is lost on save/reopen)
- Working file: state → save → open → export must be **byte-identical**.
- Return JSON: export → import → re-export must be **byte-identical**.
- **Tooling:** `tools/harness/roundtrip.py`, inside Gate 4/5. This is rule 12 — a round-trip is a gate, not
  a test. Anything the export writes that the import cannot read is a field the portal will silently drop.

### I-4. Schema validation (the portal will accept it)
- The full-return export validates against the official schema with **zero errors**.
- **Tooling:** `tools/harness/validate_schema.py`, inside Gate 4/5/7.

### I-5. The department's validation rules (Category A = zero)
- Every checkable rule in `rules.json` is encoded in `runRules` **from the rule's text**, with its serial.
- The complete client runs with **zero Category A** (blocking) messages; Category D notices each name the
  form that must follow.
- **Tooling:** Gate 6. The log records `category_A_coded / category_A_total`.

### I-6. Hand-computed figures (the arithmetic is right, to the rupee)
- One figure per schedule verified by hand before the engine is trusted (rule 15), and the Part B totals
  (GTI, total income, tax, interest 234A/B/C/F, payable/refund) hand-checked in `tests/ITR-N/figures.json`.
- **Tooling:** Gate 7 compares `figures.json` to the engine within ₹1.

### I-7. Content audit (the client actually fills the form)
- Every array the form allows has rows; every block the form allows is present; the absent ones are logged
  as not-applicable with the reason. A "complete" client that left tables empty has not exercised the form.
- **Tooling:** `tools/harness/content_audit.py`, inside Gate 7.

### I-8. Duplicate-writer & regime-gating scan (no stale line silently wins)
- After every splice, grep for two `put(j,"Key",…)` writing the same key (rule 11) — Gate 4/5 does this.
- Every allowance/deduction that a regime closes is gated on `isNew()` / the regime switch, proven by
  flipping the regime on a minimal client and re-exporting (this is how ITR-3 bug #4 was caught and proven).
- **Tooling:** Gate 4/5 duplicate scan; a `REGIME.md`-driven flip test per form.

---

## 2. The case matrix — the combinations every form is proven on

A single canonical client (S SUDHIR) is necessary but **not sufficient**: ITR-3's residential-status bug,
due-date bug, and AssetOutIndiaFlag bug were all *masked* by the canonical client's pre-set state and only
surfaced when we ran the case matrix. So each inspection in §1 is re-run on each case below.

### 2.0 Cases common to all three forms
Run the full inspection set (§1) on each:

| # | Case | What it must exercise / catch |
|---|---|---|
| C1 | **Resident, books maintained, 44AB audit** | audit flag + `AuditReportFurnishDate`; due date **31-Oct** (interest 234A must use it, not 31-Jul); Schedule BP full |
| C2 | **Resident, presumptive** (44AD/44ADA/44AE where the form allows) | presumptive path; no books; the `BiiDetails` / condition leaves |
| C3 | **Non-resident** | residential status read from the live field, not a dead mirror; NR-only CG heads; foreign refund bank; §90/90A/91 relief; DTAA grids; senior/other exemptions denied where NR |
| C4 | **New regime (default) vs old regime** | every regime-closed allowance/deduction gated; flip and re-export proves it |
| C5 | **Capital gains — every head** | STCG 111A / normal, LTCG 112 / 112A / 115AD, slump sale, unlisted shares, 54-series deduction detail tables, deemed/unutilized CGAS |
| C6 | **Losses — CYLA / BFLA / CFL** | current-year set-off order from *this form's* sheet; brought-forward + carry-forward by year and head |
| C7 | **Foreign assets / foreign income** | Schedule FA (resident only) drives `AssetOutIndiaFlag`; FSI + TR + DTAA; a **no-foreign-asset** resident must export flag = NO (the A901 trap) |
| C8 | **AMT / MAT** | the form's own §115JC/115JB triggers and the credit schedule |
| C9 | **Chapter VI-A at its limits** | each deduction's cap and cash cut-off (e.g. 80GGA ₹2,000), qualifier objects, Form-10 acknowledgements |

### 2.1 ITR-5 — firms, LLP, AOP, BOI, AJP, co-op societies, business trusts, investment funds
Add to the common matrix:

- **Firm / LLP** with partner remuneration & interest disallowance (Schedule BP add-backs).
- **AOP / BOI** where members' shares are taxed at slab vs **maximum marginal rate** — the share-of-member
  schedule and the MMR trigger.
- **Business trust (115UA)** and **investment fund (115UB)** pass-through — Schedule PTI by nature and rate.
- **Co-operative society** rate path and 80P deduction.
- Resident firm **with** foreign assets vs a **non-resident** firm.
- Special-rate incomes (Schedule SI) reconciling to Part B-TI.

### 2.2 ITR-6 — companies (other than those claiming §11)
Add to the common matrix:

- **Domestic company, normal rate**, with **MAT §115JB** (Schedule MAT + MATC credit) — book-profit
  add-backs and the credit set-off.
- **§115BAA (22%)** and **§115BAB (15% new manufacturing)** concessional regimes — Form 10-IC/10-ID
  acknowledgement leaves; MAT **not** applicable under these; prove the gating.
- **Foreign company** rate path and PE/§44 special provisions.
- Schedule BP with **ICDS adjustments** and depreciation blocks (DPM/DOA/DEP/DCG/DEA) — the depreciation
  workings feed CG on sale of a block.
- Shareholding / unlisted-company schedules (SH-1/SH-2, AL-1) and §80-IAC / §80-IA family.
- Dividend, buy-back, and any TP/GAAR notice leaves the schema carries.

### 2.3 ITR-7 — trusts, institutions, political parties (§139(4A)–(4F))
The most divergent form. Add to the common matrix:

- **Charitable/religious trust §11/§12** — Schedules AI, ER, EC, IE-1/2/3/4; 15% accumulation and **§11(2)
  accumulation (Form 10)**; application of income; corpus donations.
- **§10(23C)** institutions (education/medical) and **§13A political party / electoral trust**.
- **§115BBI** specified income at 30% and **§115BBC** anonymous donations.
- Registration/approval details (12A/12AB/10(23C)) — the leaves that gate the whole exemption.
- Schedule VC (voluntary contributions, corpus vs non-corpus) reconciling to income applied/accumulated.
- Denial-of-exemption path (return filed where registration lapsed) — taxed as AOP.

> For each form, the case matrix is finalized **from that form's own rules PDF and utility dropdowns**
> (rule 14: read the rules before writing the client), never assumed from ITR-3. List the final matrix in
> `tests/ITR-N/CASES.md` before building the test clients.

---

## 3. How corrections are made — the byte-exact discipline

This is *"how we perfectly made a byte-to-byte exact model."* Every correction on ITR-3/ITR-4 followed this
loop, and every new form's fixes must too.

1. **Find it against the source, not the code.** A gap is real only when the utility/schema/rules show a
   field the software lacks or computes differently. Cite the sheet cell, the schema path, or the rule
   serial — never "looks wrong."
2. **Reproduce it on the case that exposes it.** The canonical client masks bugs. Build the minimal client
   for the case (a from-scratch salary/firm/company client) and show the wrong output first. ITR-3 #2–#6
   were each proven this way (RES vs NRI tax to the rupee; 234A 2-month vs 5-month; GTI with new-regime
   exempt allowances; AssetOutIndiaFlag NO).
3. **Fix exactly that, at one writer.** One disjoint file per fix when parallelizing (the CEO integrates,
   assembles, and gates — subagents never assemble). After the edit, grep for duplicate writers of the key.
4. **Prove the fix and prove it changed nothing else.** Re-run the targeted case (wrong → right) **and**
   re-run the canonical client to confirm it stays **byte-identical** — an empty new field must add nothing
   to the existing return. This "new field empty ⇒ output unchanged" invariant is what keeps every
   correction from regressing a passing form.
5. **Rerun every gate.** Zero errors is a state the next change breaks (rule 13). No fix lands on a red
   earlier gate.
6. **Log it in the ledger** (`logs/ITR-N/audit/FIXES.md`) in tiers, as ITR-3 did:
   - **Tier-1** — correctness bugs that corrupt a return (wrong tax, blocked filing). Each with its proof.
   - **Tier-2** — capability gaps (entry-detail tables, NR heads, capture cascades).
   - **Optional** — leaves without a UI space; closed until coverage is 0 uncovered.

The ledger is the record of *what inspections found what and how it was proven* — it is a deliverable, not
scratch.

---

## 4. Per-form sign-off checklist (paste into `logs/ITR-N/audit/CONSOLIDATED.md`)

A form is **done** only when every box is ticked, on every case in its matrix:

- [ ] Gate 0 green — all three sources present, versions agree, rules numbering continuous.
- [ ] Gate 1 green — every visible sheet in exactly one section; every hidden sheet excluded-with-reason or built-with-`why_built`.
- [ ] Gate 2 green — empty form boots, all sections paint, save/open restores empty state.
- [ ] Gate 3 green — every sheet's book covers its live rows, schema leaves, dropdowns, item numbers.
- [ ] Gate 4 green — per schedule: `node --check`, hand figure to the rupee, export validates, round-trips identical, no duplicate writers.
- [ ] Gate 5 green — sheet coverage × schema coverage matrix all green; full return validates zero; both round-trips byte-identical.
- [ ] Gate 6 green — every checkable rule coded from its text; **zero Category A**; D notices listed.
- [ ] Gate 7 green — complete client: schema 0, Category A 0, all allowed blocks present, both round-trips identical, hand figures match.
- [ ] `coverage.py` — **0 required, 0 optional uncovered** of N leaves.
- [ ] Case matrix (§2) — every case re-runs I-1…I-8 green; the residential/due-date/flag traps proven on their cases.
- [ ] `FIXES.md` — every Tier-1 bug proven (wrong → right) and the canonical return byte-identical after each.
- [ ] Downloaded file MD5 matches the pushed build.
- [ ] PR opened to `main` on Gate 7 (draft), per `claude/itr-N`.

---

## 5. Order of execution and what runs in parallel

Build **one form fully to Gate 7 before starting the next** (Phase 5 onward is per-form and sequential —
it needs the whole form). Within a form, Phase 3 (books) and Phase 4 (schedules) fan out one worker per
sheet. Suggested order: **ITR-5 → ITR-6 → ITR-7** (increasing divergence from ITR-3; ITR-7's exemption
machinery is the least like anything built so far, so it benefits from the muscle memory of 5 and 6 first).

Each form gets its own branch `claude/itr-5`, `claude/itr-6`, `claude/itr-7`, its own audit folder under
`logs/ITR-N/audit/`, and its own draft PR opened at Gate 7. The auditor Routine watches each PR to green.
