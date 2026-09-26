# ITR-3 — AY 2025-26 (FY 2024-25)

Multi-file build of the YUKTI ITR-3 form (individual/HUF with income from
business or profession, plus capital gains, the CYLA/BFLA/CFL loss chain and
AMT u/s 115JC). **Entry point: `index.html`** — opens offline by double-click
(classic `<script src>` tags in dependency order; no ES modules, no `fetch`/XHR
of local files, all data embedded as JS globals).

> **Status: Step 1 done (byte-identical); Step 2 done (year overlay + schema +
> rules), both regimes conformance-CLEAN.**
> - **Step 1** — output-preserving multi-file split of the AY 2026-27 build.
> - **Step 2a** — year overlay `js/05_year_config.js` (A.Y. 2025-26 / F.Y. 2024-25).
> - **Step 2b** — schema deltas (3a REMOVE / 3b ADD / 3d CHANGE), the 4a rule
>   disable set, and the substantive 4b/4c rule changes. UI/behaviour unchanged;
>   only export / import / state-SKEL / rules were edited.

## Provenance

Ported from the AY 2026-27 single-file build by diff-porting.

- Source: `/home/user/ca-itr4/yukti` — `forms/ITR-3/` + shared `shell/`
- Source commit: `ce0c2c4f98bb8b2444c374fac58a59c7b1513a74`
- At Step 1 the `js/` modules `00_form.js … 90_wiring.js` were byte-for-byte
  copies of that build's `forms/ITR-3/src/*.js`, `js/95_shell.js` the shared
  `shell/shell.js` **as baked into the source single-file** (the working tree's
  `shell/shell.js` had drifted by one later edit — a `||I.PersonalInfo` import
  guard — so the split was taken from the golden `Yukti_ITR3.html` to preserve
  byte-identity), and `css/shell.css` a copy of `shell/shell.css`.
- **UI identical, backend split only.** Step 2 then applied the A.Y. 2025-26
  overlay and the schema/rule deltas; no UI renderer or tax-engine algorithm was
  changed — only year parameters, export/import writers, the state SKEL and the
  department validation rules.

## Layout

```
index.html         thin shell: <link> css + mount points + ordered <script src>
Yukti_ITR3.html    GENERATED single-file equivalent (css inlined, one <script>);
                   for gates and the double-click-equivalence proof. Do not edit.
build.py           regenerates index.html's <script> list AND Yukti_ITR3.html from js/+css/
css/shell.css      styles
js/                one file per module, loaded in sorted-filename order (95_shell.js last)
tests/state.js             re-dated AY2025-26 golden (S SUDHIR, OLD regime)
tests/state_new_regime.js  NEW-regime variant of the golden (see note below)
README.md          this file
```

`js/05_year_config.js` is the one file to edit for the next assessment year:
slab table, §87A limits, basic exemption, due dates, assessment-year leaf,
FY-boundary years, AMTC year list.

## Year overlay (js/05_year_config.js — A.Y. 2025-26 / F.Y. 2024-25)

- Assessment-year leaf `"2025"` (Form_ITR3.AssessmentYear).
- `ItrFilingDueDate` enum `2025-07-31 / 2025-10-31 / 2025-11-30`; default (audit
  case) `2025-10-31`. ITR-3 due date is audit-driven, not a fixed 31 Jul.
- NEW-regime slab table (s.115BAC, FY 2024-25): **0/5/10/15/20/30 % at
  3/7/10/12/15 L** (six bands — the AY 2026-27 seven-band table with a 25 % band
  and 4 L basic exemption does NOT apply); NEW basic exemption **₹3,00,000**.
- §87A NEW: total income ≤ **₹7,00,000** → min(tax, **₹25,000**) with marginal
  relief above; OLD unchanged (₹5,00,000 / ₹12,500).
- FY-boundary years 2024/2025 drive YREND (31-03-2025), the 234A/234B start
  (01-04-2025), the advance-vs-self-assessment challan split, the 234C
  instalment cut-offs, and the 80GGC / CG date windows.
- AMT (115JC) and the capital-gains rate engine stay engine-driven.

## Verification

**Step 1 (byte-identical):** the assembled `Yukti_ITR3.html` is byte-for-byte
identical to the source golden single-file; through the harness on the golden
(`tests/ITR-3/state.js`) the two builds produced identical `return.json`,
identical figures (GTI 3,273,500 / TI 1,786,500 / tax 361,868 / net 416,835 /
refund 1,161,170) and identical rule output (0 Category-A).

**Step 2 (both regimes, re-dated golden):**

| | GTI | TI | Tax | Net | Refund | Cat-A | Conformance |
|---|---|---|---|---|---|---|---|
| OLD (AMT case) | 3,273,500 | 1,786,500 | 361,868 | 416,835 | 1,161,170 | 0 | CLEAN (0/0/0) |
| NEW regime | 3,902,000 | 3,722,000 | 874,224 | 874,224 | 703,780 | 0 | CLEAN (0/0/0) |

- OLD-regime figures are identical to AY 2026-27 (AMT, old slabs and CG rates are
  year-invariant), confirming the overlay left them untouched.
- NEW-regime tax uses the FY 2024-25 slabs — verified on isolated cases: TI
  10,25,000 → slab tax 53,750 (FY 2024-25 exact; the FY 2025-26 table would give
  42,500); §87A gives a full rebate at TI ≤ 7,00,000 (675,000 → nil).
- Round-trip (export → import → re-export) on the OLD golden: **0 differences**.
- Both runs export cleanly with 0 page errors. The Category-D notices that remain
  are legitimate advisories present in the base too (OLD: AMT/Form-29C; NEW:
  80JJAA/Form-10DA), not defects.

Regenerate outputs after editing `js/` or `css/`: `python3 build.py`.

### tests/state_new_regime.js

A valid NEW-regime return derived from the golden by setting the regime opt-out
field to new and removing the two old-regime-only constructs that s.115BAC
disallows and that trip pre-existing base-engine CYLA/AMTC rules on any naive
flip (these fire on the untouched AY 2026-27 build too): the AMT credit
(`S.tax.amtc`) and the house-property loan interest (an HP loss cannot be set off
in the new regime). Used to prove the FY 2024-25 new-regime slab tax and
new-regime schema conformance.
