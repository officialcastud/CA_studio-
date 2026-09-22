# The Yukti shell

Everything a form shares. A form is `head.html + <style>shell.css</style> + body.html + <script> FORM parts + shell.js </script>`.
`tools/assemble.py --form ITR-N` does that concatenation from `forms/ITR-N/src/*.js`.

## The contract a form must satisfy

| Global | Type | What it is |
|---|---|---|
| `window.FORM` | `{id, name, ay, sw, due}` | `id` "ITR-3", `name` shown in the masthead, `ay` "2026-27", `due` "YYYY-MM-DD" — the due date under 139(1) for this form and case, from the utility's `finalDuedate` formula and the rules document |
| `S` | object | the state; must contain `meta`, `pi`, `fs`, `bank`, `ver`, `open:{}`, `C:{}` |
| `SEED` | object | default row per grid key, e.g. `{"bank":{type:"SB"}}` |
| `SKEL` | object | the schema's required-key skeleton (`books/ITR-N/skeleton.json`) |
| `SECS` | array | `[{id, t, ref, f: renderer, s: ()=>summary}]` in screen order |
| `compute()` | function | rebuilds `S.C.*` in one pass; must set `S.C.gti`, `S.C.ti`, `S.C.tax.{gross,regime,rebate}`, `S.C.int.{refund,balance}`, `S.C.checks` |
| `engChecks()` | function | returns `[{lvl:"err"|"warn"|"ok", t, m, sec}]` |
| `buildReturn()` | function | returns `{ITR:{ITRn:{…}}}` on the schema's keys, starting from `deep(SKEL)` |
| `importReturn(I)` | function | the inverse: reads the `ITRn` object into `S`; returns the list of what it read |
| `runRules(I,S)` | function | the department's rules on the export; returns `[{cat:"A"|"D", n, msg}]` |
| `auditRules(b)` | function | the form's own arithmetic audit; returns messages |
| `afterOpen()` | optional | repair an older working file after it is loaded |

Renderers (all in the shell): `row(label, right, {req, hint, ref, cls, ind, v2})`, `inp(path, {n, max, ph})`, `dte(path)`, `sel(path, opts, {blank, style})`, `cell(n)`, `grid(key, cols, rows, {min, empty, add, foot})`, `fold(id, ref, title, status, inner, {def})`, `card(id, title, status, inner)`, `blk(id, title, status, inner, delPath)`, `sub(text)`, `note(html, kind)`, `formNote(html)`.

Element ids the harness relies on: `#b_open`, `#b_save`, `#b_json`, `#filepick`, `#nav`, `#sheet`, `#frm`, `#ay`, footer `#s_gti #s_ti #s_tax #s_b`.

`shell/example.html` is a three-section form on the shell that boots, saves, opens, exports and re-imports its own return — the smallest thing that satisfies the contract. Start a new form from `example_form.js`. Never edit the shell per form.
