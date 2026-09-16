# ITR-4 · Phase 7 — engine / export / build bugs the test-client cannot fix in state.js

Test client: `tests/ITR-4/state.js` (S SUDHIR, PAN TVOPS4373C, OLD regime).
Status after all state-side fixes: **Gate 6 GREEN** (0 Category A), **Gate 7 content-audit clean**
(25 arrays, 0 empty; only `Schedule80EE` absent — intentionally, mutually exclusive with the 80EEA
claimed here), **hand figures match the engine to the rupee** (GTI 16,71,500 · TI 7,15,500 · refund 4,580).
**Gate 5 is RED and Gate 7 is RED only because of the engine/build bugs below.** Every one is in a file
this role may not edit (`forms/ITR-4/src/*.js` or `shell/shell.js`); none is fixable in `state.js`.

Format: `section → schema key / figure → what's wrong → expected`.

---

## Build / assembly (pre-condition, already resolved)

- **assembly → `forms/ITR-4/Yukti_ITR4.html` was STALE** → the delivered HTML's `expInc` wrote array
  blocks with indexed dotted paths `pf(j,"ScheduleBP.NatOfBus44AD."+i+".NameOfBusiness",…)`, which
  `put()` materialises as **numeric-keyed objects** `{"0":{…}}` — schema-invalid (`is not of type 'array'`)
  for `NatOfBus44AD/44ADA/44AE`, `GoodsDtlsUs44AE`, `TurnoverGrsRcptForGSTIN`, `PropertyDetails`,
  `AllwncExemptUs10Dtls`, `OthersIncDtlsOthSrc`, `TaxExmpIntIncDtls.OthersIncDtls`.
  The **current src** (`70_sec_inccore.js`) is already fixed (builds real arrays via `.map()` + `put(j,path,arr)`),
  and the old HTML also predated `61_rules_g0.js` / `61_rules_g2.js`.
  **Action taken:** re-ran `tools/assemble.py --form ITR-4` (no src/tool/gate edit) → all 8 array errors gone.
  Expected: CEO re-assembles after the fixes below so the delivered HTML matches src.

---

## inccore (`forms/ITR-4/src/70_sec_inccore.js`)

1. **`10_state.js` SKEL header (loaded by inccore's flow) → `Form_ITR4.*` = `"na"`** → schema rejects:
   `FormName 'na' ≠ 'ITR-4'`, `AssessmentYear 'na' too short / ≠ '2026'`, `SchemaVer 'na' ≠ 'Ver1.0'`,
   `FormVer 'na' ≠ 'Ver1.0'`. Expected the ITR-3 constants: `FormName:"ITR-4"`, `AssessmentYear:"2026"`,
   `SchemaVer:"Ver1.0"`, `FormVer:"Ver1.0"`. *(File: `forms/ITR-4/src/10_state.js`, `SKEL.Form_ITR4`.)*

2. **`10_state.js` SKEL header → `CreationInfo.*` = `"na"`** → schema rejects:
   `JSONCreatedBy 'na' ≠ [S][W][0-9]{8}`, `SWCreatedBy 'na' ≠ [S][W][0-9]{8}`, `Digest 'na' ≠ '-|.{44}'`.
   Expected the ITR-3 constants: `SWVersionNo:"1.0"`, `SWCreatedBy:"SW10000000"`, `JSONCreatedBy:"SW10000000"`,
   `Digest:"-"`. *(File: `forms/ITR-4/src/10_state.js`, `SKEL.CreationInfo`.)*

3. **expInc → `FilingStatus.F10IEACurrAYOldRegime` = `"Yes"`** → schema enum is `['Y','N']`
   (`'Yes' is not one of ['Y','N']`). Line writes the literal `"Yes"` whenever `S.fs.optout==="Yes"`.
   This makes **every old-regime ITR-4 return fail schema validation** and cannot be avoided from state.
   Expected: write `"Y"` (and read `"Y"`/`"Yes"` back in `impInc`). *(70_sec_inccore.js ~L736.)*

4. **`const IC=S.ic` captured at module load → working-file round-trip broken.**
   inccore binds `const IC=S.ic;` once at load and every income formula reads `IC.*`. The shell's
   working-file open (`shell.js` `importFile`) restores state by **re-assigning** `S.ic = j.ic`, which
   orphans the captured `IC` (it still points at the original empty object). After opening the saved
   working file, `engInc` reads the stale `IC` → `S.C.inc.income = 0` (salary/BP/OS all 0), which cascades
   (GTI est → 0 → Chapter VI-A clamped to 0 → `S.C.ded.total = 0` → Category A **A244** on the re-export,
   and every income/tax figure diverges: 34 round-trip diffs). Expected: read `S.ic` dynamically (e.g.
   `const IC=()=>S.ic` / reference `S.ic` directly, as `ded`/`paidbank` do), so a reassigned `S.ic` is seen.
   *(70_sec_inccore.js L64.)* Sole root cause of the **working-file round-trip** Gate 5 failure.

5. **Cross-section contract gap → 80TTA / 80CCD(2) caps never bind** (the case the task flagged).
   `ded`'s `engDed` reads `S.C.os.sav` / `S.C.inc.savInt` to cap 80TTA to actual savings-bank interest,
   and `S.C.sal.basicDA` / `S.C.inc.basicDA` to cap 80CCD(2) to 14%/10% of salary. **inccore's `engInc`
   never writes any of these** — `S.C.inc` carries only `{income,salary,bp,os,ltcg112a,detail}`, and there
   is no `S.C.os` or `S.C.sal`. So both statutory caps read `0`/undefined and are silently skipped.
   In this return it happens to stay lawful (80TTA 10,000 ≤ savings 12,000; 80CCD(2) 50,000 ≤ 10%×basic
   60,000), but the caps are non-functional. Expected: inccore to expose `S.C.inc.savInt` (savings-bank
   interest), `S.C.inc.depInt` (deposit interest) and `S.C.inc.basicDA` (salary Basic+DA) — or `ded` to
   read the keys inccore actually publishes. *(reader: 70_sec_ded.js L229, L236-237; writer gap: 70_sec_inccore.js `engInc`.)*

6. **`pi.res` key collision → residential status vs `Address.ResidenceNo`.** The address "Flat/Door/Block No."
   input (`inp("pi.res",…)` → `PersonalInfo.Address.ResidenceNo`) and the residential-status select
   (`sel("pi.res",RES_STAT,…)`, values RES/NRI/NOR; drives 87A at L293 and `ded`'s non-resident bar at
   `70_sec_ded.js` L174) bind to the **same key `S.pi.res`**. They cannot both hold a valid value.
   Worked around in state by setting `S.pi.res="RES"` (keeps the person Resident so 80DD/80DDB/80U/80TTB
   survive), which makes `Address.ResidenceNo` export as `"RES"` (schema-valid free text, but wrong).
   Expected: a separate key for residential status (e.g. `S.pi.resStatus`) distinct from the address line.
   *(70_sec_inccore.js L348 vs L386; export L701; import L921.)*

---

## shell / integration (`shell/shell.js`) — blocks the return-JSON round-trip

7. **`importFile` detects a full return only via `I.PartA_GEN1` → return-JSON round-trip fails for ITR-4.**
   `shell.js` L258-259: `if(I && I.PartA_GEN1){ importReturn(I); … }`. `PartA_GEN1` is **ITR-3's** root
   block; ITR-4's return root is `PersonalInfo`/`FilingStatus`/…, so `I.PartA_GEN1` is undefined and the
   exported ITR-4 return.json falls through to the **prefill importer** (reads only PAN/name/address/
   Aadhaar/DOB/bank). On re-open, `S.ver`, `S.ded`, `S.ic`, `S.fs.optout` are not restored → the re-export
   is blocked (verification errors) and can never be byte-identical. Expected: detect a Yukti return
   generically (e.g. `I.PersonalInfo || I.PartA_GEN1`, or presence of the form's own root block), then call
   `importReturn(I)`. This is the sole cause of the **return-JSON round-trip** Gate 5 failure.
   *(Shell is a shared file — flagged for the CEO/integrator; not editable by test-client.)*

---

## Summary of Gate 5 red items → cause
- **schema errors (9):** bugs 1 (4×), 2 (3×), 3 (1×) — all in `10_state.js` SKEL and `expInc`.
- **working-file round-trip not identical:** bug 4 (`const IC=S.ic`).
- **return-JSON round-trip not identical:** bug 7 (shell `PartA_GEN1` gate).

No further state-side fix is possible; only engine/build bugs remain.
