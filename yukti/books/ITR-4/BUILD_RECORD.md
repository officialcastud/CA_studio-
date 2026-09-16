# ITR-4 (Sugam) · A.Y. 2026-27 — Build Record

One offline single-file HTML return builder (`forms/ITR-4/Yukti_ITR4.html`), built by the Yukti
pipeline (`PIPELINE.md`) under the law in `CLAUDE.md`, from three CBDT sources that must agree at once.

## Sources
- **Utility** `sources/ITR-4/utility/` — ITR4_AY_26-27 (V1.2 offline utility, sheets dumped via `tools/dump.py`).
- **Schema** ITR-4_2026_Main_V1.1 JSON schema (root: `ITR.ITR4`).
- **Validation rules** — the CBDT ITR-4 validation-rules PDF (24 pp). Parsed by `tools/rules_pdf.py`
  into `books/ITR-4/rules.json`: **Category A 409, B 13, D 2** (real rules). The source numbering skips
  Category-A serials **400 and 401**; both are kept as explicit `absent` placeholders (constitution
  rule 17 — record the gap, do not invent), so continuity is honest and the enforcer skips them.

## Form facts (from ITR-4's own sources, not ported)
- `FORM = {id:"ITR-4", name:"ITR-4 (Sugam)", ay:"2026-27", sw:"SW10000001", due:"2026-08-31"}`.
- Presumptive income only: **44AD** (business), **44ADA** (profession), **44AE** (goods carriage).
  No regular books, no capital gains, resident-only, total income ≤ ₹50 lakh.
- Six screen sections (`section_map.json`): **inc, hp, ded, tax, paid, bank**; compute order
  inc(20) → ded(40) → paid(60) → tax(80) → bank(95).

## Regime behaviour (`SECTION_BUILDER_TASK.md` "## Regime")
New regime u/s 115BAC(1A) is default; opting out (old regime) is via Form 10-IEA (`FilingStatus`).
`isNew() = S.fs.optout !== "Yes"`. In the **new** regime, Chapter VI-A closes except **80CCD(2)** and
**80CCH**; the ₹75,000 standard deduction and the family-pension 57(iia) stay; entertainment 16(ii) /
professional tax 16(iii), HRA 10(13A) and self-occupied HP interest 24(b) close; 87A rebate is the
new-regime figure the schema's `Rebate87A` max carries. Every closed item is gated on `isNew()`.

## Rules coded
**209 of 411 Category A** encoded into `61_rules_g0.js` / `g1.js` / `g2.js` (registered via `ruleset()`
into `_RULEBATCHES`, run by `runRules`). The rest are cross-schedule/structural rules for schedules ITR-4
does not carry, or duplicates of coded checks. Gate 6 GREEN: **0 Category A fire on the lawful test client.**

## Test client (constitution: S SUDHIR, TVOPS4373C, 05/11/2006 — old regime)
`tests/ITR-4/state.js`. Exercises salary + all three presumptive heads (44AD/44ADA/44AE), two house
properties (one let-out, one self-occupied), other sources (savings/FD/dividend/family pension), LTCG
112A not chargeable, and the full Chapter VI-A set with sub-schedules (80C/80D/80DD/80DDB/80U/80E/80EEA/
80EEB/80G/80GGC/80CCC/80CCD/80CCH) plus HRA 10(13A), TDS/TCS/advance-tax and a refund bank account.
**Hand figures (`figures.json`) match the engine to the rupee: GTI ₹16,71,500 · TI ₹7,15,500.**

## Gates
`python3 tools/gates/gate.py --form ITR-4 --gate all` → **G0–G7 all GREEN.**

## Phase-7 bugs (see `logs/ITR-4/phase7_bugs.md` for detail)
Ten defects the test client surfaced, all fixed by the CEO: SKEL `CreationInfo`/`Form_ITR4` metadata and
a ≤75-char `Description`; `F10IEACurrAYOldRegime` "Yes"→"Y"; a stale captured `IC` ref (now `seedIC()` +
`afterOpen()`); the `S.C.sal`/`S.C.os` cross-section contract for the 80CCD(2)/80TTA/80TTB caps; a
`pi.res` key collision (residential status vs `Address.ResidenceNo`, split to `pi.resNo`); shell return
detection generalised to `PartA_GEN1 || PersonalInfo`; the Chapter VI-A per-line amounts + qualifier
fields (PRANDtls/80DDB type & disease/Form10BA/80CCC pension) now exported so the return round-trips;
rule A311 (HRA ceiling) de-double-subtracted; and an unlawful 100/0 HP co-ownership in the test state
represented as sole ownership.
