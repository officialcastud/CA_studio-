# ITR-1 (SAHAJ) — AY 2025-26 (FY 2024-25)

Multi-file build of the YUKTI ITR-1 form. **Entry point: `index.html`** — opens
offline by double-click (classic `<script src>` tags in dependency order; no ES
modules, no `fetch`/XHR of local files, all data embedded as JS globals).

> **Status: Step 1 done; Step 2 in progress — year overlay applied.**
> - **Step 1 (done):** output-preserving multi-file split of the AY 2026-27 build.
> - **Step 2a — year overlay (done, verified):** `js/05_year_config.js` now carries
>   everything year-specific for A.Y. 2025-26 — NEW-regime slab table
>   (0/5/10/15/20/30% at 3/7/10/12/15L), §87A (₹7,00,000 ceiling / ₹25,000 cap with
>   marginal relief), assessment-year leaf `"2025"`, `ItrFilingDueDate 2025-07-31`,
>   and the F.Y. 2024-25 boundary years that drive the age slab, the advance-vs-
>   self-assessment challan split and the 234B/234C instalment dates. OLD-regime
>   slabs/§87A are unchanged year-to-year.
> - **Step 2b — schema + rule deltas (NOT yet applied):** the 78 field removals,
>   84 additions, 9 constraint changes and the rule disable/add/change +
>   renumbering from `AY2025-26_PORT/PLAN.md §8` and the diff chunks. The
>   Category-A rule bodies in `js/61_rules_enc_*.js` still carry AY 2026-27 numbers
>   and header labels; renumbering and the schema deltas are the next steps.

## Provenance

Ported from the AY 2026-27 single-file build by diff-porting, per
`AY2025-26_PORT/PLAN.md`.

- Source: `/home/user/ca-itr1/yukti` — `forms/ITR-1/` (branch `claude/itr-1`, PR #6)
- Source commit: `4075c3b6e62fb9ee8efa32c59ff3da368cfdf889`
- At Step 1 the `js/` modules `00_form.js … 90_wiring.js` were byte-for-byte copies
  of that build's `forms/ITR-1/src/*.js`, `js/95_shell.js` a copy of the shared
  `shell/shell.js`, and `css/shell.css` a copy of `shell/shell.css`. Step 2a then
  applied the A.Y. 2025-26 year overlay (new `js/05_year_config.js` plus targeted
  edits to `00_form`, `10_state`, `70_sec_{tax,who,ret,paid,os,hp}`, `61_rules_enc_{03,05,07}`
  and `95_shell`); `css/shell.css` is unchanged.

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
00_form.js         FORM identity (id/name/sw) + code tables (PIN2ST, BANK)
05_year_config.js  YEAR OVERLAY (A.Y. 2025-26): slab table, §87A ceilings, cess,
                   assessment-year leaf, due date, F.Y. boundary years; overlays
                   FORM.ay/FORM.due. The one file to edit for the next year.
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

## Verification (Step 2a — year overlay)

Boot clean (no page errors); header shows **A.Y. 2025-26**; export stamps
`Form_ITR1.AssessmentYear "2025"` and `FilingStatus.ItrFilingDueDate "2025-07-31"`.
Tax computed against the golden return re-dated on-time (25/07/2025):

- **OLD regime** (unchanged year-to-year): GTI 9,85,000 · TI 8,10,000 · tax 74,500 ·
  cess 2,980 · net 77,480 · refund 2,520 — identical to the AY 2026-27 figures.
- **NEW regime** (AY 2025-26 slabs): TI 11,40,000 · tax 71,000 (20,000 + 30,000 +
  21,000) · no §87A (TI > ₹7,00,000) · cess 2,840 · net 73,840 · refund 6,160 —
  correctly *different* from AY 2026-27 (which gave a full rebate → nil tax).
- **§87A boundaries:** NEW TI 7,00,000 → full rebate 20,000 → nil; TI 7,10,000 →
  marginal relief 11,000 → tax 10,400; TI 12,00,000 → no rebate. OLD TI 5,00,000 →
  rebate 12,500 → nil; TI 5,10,000 → no rebate.

Regenerate outputs after editing `js/` or `css/`: `python3 build.py`.
