# ITR-1 (SAHAJ) — AY 2025-26 (FY 2024-25)

Multi-file build of the YUKTI ITR-1 form. **Entry point: `index.html`** — opens
offline by double-click (classic `<script src>` tags in dependency order; no ES
modules, no `fetch`/XHR of local files, all data embedded as JS globals).

> **Status: Step 1 complete — output-preserving split only.** The code in `js/`
> is still the **AY 2026-27** build, split verbatim into one file per module. The
> AY 2025-26 year delta (slab table, 87A, surcharge, due date, schema + rule
> deltas) has **not** been applied yet — that is Step 2 in
> `AY2025-26_PORT/PLAN.md §8`.

## Provenance

Ported from the AY 2026-27 single-file build by diff-porting, per
`AY2025-26_PORT/PLAN.md`.

- Source: `/home/user/ca-itr1/yukti` — `forms/ITR-1/` (branch `claude/itr-1`, PR #6)
- Source commit: `4075c3b6e62fb9ee8efa32c59ff3da368cfdf889`
- The 24 `js/` modules `00_form.js … 90_wiring.js` are byte-for-byte copies of that
  build's `forms/ITR-1/src/*.js`. `js/95_shell.js` is a byte-for-byte copy of the
  shared `shell/shell.js`. `css/shell.css` is a copy of the shared `shell/shell.css`.

## Layout

```
index.html         thin shell: <link> css + mount points + ordered <script src>
Yukti_ITR1.html    GENERATED single-file equivalent (css inlined, one <script>);
                   for gate.py and the double-click-equivalence proof. Do not edit.
build.py           regenerates index.html's <script> list AND Yukti_ITR1.html from js/+css/
css/shell.css      styles
js/                one file per module, loaded in numeric-filename order
README.md          this file
```

## Load order (exact — do not reorder)

`index.html` loads the `js/` files in **sorted filename order**, then the shell
last. This mirrors the AY 2026-27 pipeline's `assemble.py`, which concatenates
`sorted(glob("src/*.js"))` and appends `shell.js`.

```
00_form.js         FORM identity (id/name/ay/due/sw) + code tables (PIN2ST, BANK)
08_registry.js     reg()/ruleset() contract, _SECREG, SCREEN_ORDER, pf()
10_state.js        S (the working state) + defaults
30_sec_00_boot.js  placeholder registration for all 10 screen sections
60_rules.js        runRules()/auditRules() engine
61_rules_enc_01.js … 61_rules_enc_08.js   department validation-rule batches
70_sec_bank.js  70_sec_ded.js  70_sec_ei.js  70_sec_hp.js  70_sec_os.js
70_sec_paid.js  70_sec_ret.js  70_sec_sal.js  70_sec_tax.js  70_sec_who.js
                   one file per schedule: builder + engine + export + import + checks
90_wiring.js       builds SECS from _SECREG; compute() fixpoint; buildReturn/importReturn
95_shell.js        shared shell: helpers, renderers, paint(), events, save/open/export.
                   Loads LAST — it calls paint() and wires the DOM once every module is
                   defined. Keep it last.
```

Why the split is safe (output-preserving): every module only **defines** things
and **registers** section descriptors (arrow functions) at load; nothing executes
the form until `paint()` runs at the end of `95_shell.js`. Top-level `const`/`let`
are shared across classic scripts via the global lexical environment, so separate
ordered `<script src>` tags behave exactly like one concatenated `<script>`.

## Verification (Step 1)

Behaviour-identical to the AY 2026-27 single-file build (`Yukti_ITR1.html`),
proven against the golden test return (S SUDHIR, TVOPS4373C, old regime):

- Assembled-from-`js/` single-file is **byte-identical** to the source build.
- Rendered DOM (sheet + nav + footer + header + title) **byte-identical** for both
  empty state and the golden state.
- Figures identical: GTI 9,85,000 · TI 8,10,000 · tax 74,500 · refund 2,520.
- Exported return JSON and working-file JSON **byte-identical** (minus timestamps).
- Zero boot/page errors in both builds.

Regenerate outputs after editing `js/` or `css/`: `python3 build.py`.
