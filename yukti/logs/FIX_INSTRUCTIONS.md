# Validation-rule FIX pass — agent contract (write ONE new file only)

You encode missing/weak CBDT validation rules into the form's rule engine so a defective return can never
pass the e-Filing portal. You create exactly ONE new file (given as `outfile`). You edit NOTHING else.

## The mechanism (how your file is used)
The form assembles every `forms/<form>/src/*.js` in filename order. `08_registry.js` (loads first) defines:
```
const _RULEBATCHES=[]; function ruleset(fn){_RULEBATCHES.push(fn);}
```
`runRules(I,S_)` runs every registered batch: `_RULEBATCHES.forEach(rb=>rb(I,S_,A,Dd))`, where
- `A(n,cond,msg)` records a **Category-A** violation when `cond` (the "valid" assertion) is **FALSE**.
- `Dd(n,cond,msg)` records a **Category-D** advisory the same way.
- `I` is the built return object (schema keys, e.g. `I.PartA_GEN1.FilingStatus...`, `I.ScheduleS...`).
- `S_` is the live state (rarely needed; prefer `I`).

Your file MUST have this exact shape (a single registered batch):
```js
/* <form> · AY 2026-27 — validation-rule FIX batch NN (enforcement gaps/weak fixes).
   Registered via ruleset(); A(n,cond,msg) fires when cond is FALSE. Reads guarded; nothing throws. */
ruleset(function(I,S_,A,Dd){
  I=I||{};
  const FS=RG(I,"PartA_GEN1.FilingStatus",{})||{};
  const newR=FS.OptOldRegimeCurrAY!=="Y";           /* new regime default; old = 10-IEA opt-out */
  const res=FS.ResidentialStatus||"RES";
  /* ...your rules... */
  A(72, !N(RG(I,"ScheduleS.AllwncExtentExemptUs10.<key>")) || N(...)<=N(RG(I,"ScheduleS.TotSalary")),
    "10(7) exemption cannot exceed gross salary.");
});
```
`RG`, `N`, `REQ` and the other helpers are global (used all over `60_rules.js` / `61_rules_g*.js`). Reuse them.

## THE ONE RULE THAT MATTERS MOST
**A check must NEVER fire on a valid or empty return.** Guard every read so that when the relevant fields are
absent, zero, or the schedule isn't present, `cond` evaluates **TRUE** (valid). Only assert the violation when
the data is actually present AND actually breaks the rule. A rule that fires on the lawful test client turns
Gate 6 red and will be rejected. Pattern: `A(n, <not-applicable> || <valid-when-present>, msg)` — e.g.
`A(n, !I.ScheduleX || REQ(total, a+b+c), msg)` and `A(n, !N(x) || x<=cap, msg)`.
Also: **never let a read throw.** Always `RG(I,"a.b.c",default)` and `(obj||{})`; coerce numbers with `N()`.

## Method (per serial in your slice)
1. Understand the rule: read `clean`/`text` (the CBDT rule) and `finding` (what the audit says is missing/wrong).
2. Find the real schema paths: `Grep` the export writers (`forms/<form>/src/40_export.js`, `70_sec_*.js`) and
   existing rules (`60_rules.js`, `61_rules_g*.js`) for the schedule/field named in the rule. **Copy the exact
   `RG(I,"...")` paths already used elsewhere** — do not invent key names.
3. Write `A(n, cond, msg)` (or `Dd` for a Category-D serial). `cond` = the assertion that is TRUE for a valid
   return. Model it on the closest existing rule. Keep the message short and specific (mirror the rule text).
4. For a **WEAK** serial (already coded elsewhere, but wrong/partial per the finding): write the corrected,
   stricter assertion here as a companion — your version must be the correct one, and must still pass the
   lawful client.
5. If you genuinely cannot map a rule to a schema path (the field does not exist in this form), encode it as a
   comment line `/* n: not mappable — <reason> */` instead of a live A() call, and say so in your reply. Do not
   guess a path that might throw or false-fire.

## Hard rules
- Write ONLY `outfile`. Never edit `60_rules.js`, `61_rules_g*.js`, any `70_sec_*.js`, the HTML, or any other file.
- Your file must be valid JS: one `ruleset(function(I,S_,A,Dd){ ... });` wrapper. Balanced parens/braces.
- Every serial in your slice is addressed once (a live `A()`/`Dd()`, or a documented not-mappable comment).
- Do NOT run assemble or the gates (the coordinator does that). Do NOT touch git.
- Reply with: the count of rules coded live, and the list of any serials left as not-mappable (with reasons).
