# ITR-4 (SUGAM) — AY 2025-26 (FY 2024-25)

Multi-file build of the YUKTI ITR-4 form. **Entry point: `index.html`** — opens
offline by double-click (classic `<script src>` tags in dependency order; no ES
modules, no `fetch`/XHR of local files, all data embedded as JS globals).

> **Status: Step 1 done.**
> - **Step 1 (done):** output-preserving multi-file split of the AY 2026-27 build.
>   This is a pure repackaging — the assembled single-file `Yukti_ITR4.html` build
>   was broken into many small files (one per module), byte-for-byte
>   behaviour-identical. **No year-porting, no schema/rule changes** were made:
>   the code still carries the AY 2026-27 numbers, slabs and rule bodies. UI and
>   behaviour are identical to the source; only the packaging (single file →
>   `js/` + `css/` + `index.html`) has changed.
> - **Step 2 (not started):** the A.Y. 2025-26 year overlay and the schema + rule
>   deltas are future work, mirroring how ITR-1 layered its `js/05_year_config.js`
>   overlay and schema/rule port on top of its Step 1 split.

## Provenance

Split from the AY 2026-27 single-file build, mirroring the ITR-1 Step 1 split.

- Source: `/home/user/ca-itr4/yukti` — `forms/ITR-4/` (single-file `Yukti_ITR4.html`,
  assembled by `tools/assemble.py` from `forms/ITR-4/src/*.js` + `shell/`)
- Source commit: `ce0c2c4f98bb8b2444c374fac58a59c7b1513a74`
- At Step 1 the `js/` modules `00_form.js … 90_wiring.js` are byte-for-byte copies
  of that build's `forms/ITR-4/src/*.js`, `js/95_shell.js` a copy of the shared
  `shell/shell.js`, and `css/shell.css` a copy of `shell/shell.css`. `index.html`
  is a thin shell (head/body from the shared `shell/head.html` + `shell/body.html`,
  with the css inlined as a `<link>` and the ordered `<script src>` list); the form
  name in the `<title>` is set to ITR-4. Nothing else was changed.

## Layout

```
index.html         thin shell: <link> css + mount points + ordered <script src>
Yukti_ITR4.html    GENERATED single-file equivalent (css inlined, one <script>);
                   for gate.py and the double-click-equivalence proof. Do not edit.
build.py           regenerates index.html's <script> list AND Yukti_ITR4.html from js/+css/
css/shell.css      styles
js/                one file per module, loaded in numeric-filename order
README.md          this file
```

## Load order (exact — do not reorder)

`index.html` loads the `js/` files in **sorted filename order**, then the shell
last. This mirrors the AY 2026-27 pipeline's `tools/assemble.py`, which
concatenates `sorted(glob("forms/ITR-4/src/*.js"))` and appends `shell.js`.

```
00_form.js         FORM identity (id/name/sw) + code tables
08_registry.js     reg()/ruleset() contract, _SECREG, SCREEN_ORDER, pf()
10_state.js        S (the working state) + defaults
30_sec_00_boot.js  placeholder registration for the screen sections
60_rules.js        runRules()/auditRules() engine
61_rules_fix_01.js … 61_rules_fix_07.js   department validation-rule batches (fix)
61_rules_g0.js  61_rules_g1.js  61_rules_g2.js   department validation-rule batches (g)
70_sec_ded.js  70_sec_inccore.js  70_sec_paidbank.js
                   one file per schedule group: builder + engine + export + import + checks
90_wiring.js       builds SECS from _SECREG; compute() fixpoint; buildReturn/importReturn
95_shell.js        shared shell: helpers, renderers, paint(), events, save/open/export.
                   Loads LAST — it calls paint() and wires the DOM once every module is
                   defined. Keep it last (sorts after 90_wiring.js).
```

Why the split is safe (output-preserving): every module only **defines** things
and **registers** section descriptors (arrow functions) at load; nothing executes
the form until `paint()` runs at the end of `95_shell.js`. Top-level `const`/`let`
are shared across classic scripts via the global lexical environment, so separate
ordered `<script src>` tags behave exactly like one concatenated `<script>`.

## Verification (Step 1)

**UI/behaviour identical; backend split only.** Behaviour-identical to the AY
2026-27 single-file build (`Yukti_ITR4.html`), proven with the Playwright harness
against the golden test return (S SUDHIR, old regime) at
`/home/user/ca-itr4/yukti/tests/ITR-4/state.js`:

- Original single-file and the multi-file `index.html` produce **byte-identical
  `return.json`**.
- Figures identical: GTI 16,96,500 · TI 7,40,500 · tax 42,224 · balance 620.
- `exported = true`, 0 page errors, same number of Category-A rules firing in both.

Regenerate outputs after editing `js/` or `css/`: `python3 build.py`.
