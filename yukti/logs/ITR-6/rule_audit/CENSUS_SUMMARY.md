# ITR-6 · AY 2026-27 — Validation-rule enforcement census (final)

Every CBDT ITR-6 validation serial in `books/ITR-6/rules.json` is classified into one
constitution bucket, so Gate-6 can prove **MISSING = 0**. This summary reconciles the
census after the Phase-6 fan-out, folding in the serials that were honestly re-filed
**ENFORCED → OFFLINE-IMPOSSIBLE** when the rule's own target field turned out to be
absent from the ITR-6 schema. No rule was weakened, deleted, or faked.

Source of truth: `books/ITR-6/rule_census.md` (per-serial appendix) and the encoder
file headers `forms/ITR-6/src/61_rules_enc_*.js`, verified against
`sources/ITR-6/ITR-6_2026_Main_V1_0_schema.json`.

## Enforcement census

| Category | Total | ENFORCED | NA | OFFLINE-IMPOSSIBLE | MISSING |
|---|--:|--:|--:|--:|--:|
| **A** (blocking) | 868 | 851 | 11 | 6 | **0** |
| **B** (advisory) | 27 | 12 | 6 | 9 | **0** |
| **D** (advisory, follow-up forms) | 23 | 22 | 0 | 1 | **0** |
| **Total** | **918** | **885** | **17** | **16** | **0** |

- **A**: 868 − 851 − 11 − 6 = 0
- **B**: 27 − 12 − 6 − 9 = 0
- **D**: 23 − 22 − 0 − 1 = 0

## Bucket definitions

- **ENFORCED-target** — offline-checkable against a schema key that exists on the built
  return `I` (root `ITR6`). Category A → `A(serial,cond,msg)` blocking; B/D → `Dd(serial,cond,msg)`
  non-blocking advisory. `cond` is the "this return is lawful" assertion; the block fires when it is FALSE.
- **NA** — not this form's job: resolved by the e-filing portal, AIS/26AS, a server clock,
  or another form. Nothing to encode offline.
- **OFFLINE-IMPOSSIBLE** — would require an external database not shipped, or a schema
  field that does not exist in ITR-6. Reported, never faked (a vacuous check that always
  passes would be a fake enforcement).
- **MISSING** — a serial with no bucket. Must be 0.

## Methodology

1. **Encode every serial from its own rule text** (constitution rule 6), scoped so the
   block is silent when its schedule is absent. Reads are guarded (`RG`/`N`/`(X||{})`) so
   nothing throws on a partial return.
2. **Fan-out** across 18 disjoint serial-range files for Category A (`enc_01`–`enc_18`),
   plus Category B (`enc_19`) and Category D (`enc_20`).
3. **Honest re-file on absent target.** Where a rule names a field that does not exist in
   `ITR-6_2026_Main_V1_0_schema.json`, the serial is re-filed OFFLINE-IMPOSSIBLE with the
   reason recorded in both the encoder file header and the census appendix — never faked
   with an always-true check. This is the only movement from the pre-fan-out plan.
4. **Reconcile** the appendix: all 868 A-serials A1–A868 present exactly once; bucket
   tally ENF 851 + NA 11 + OFF 6 = 868 (script-verified, no gaps or duplicates).

### Serials re-filed ENFORCED → OFFLINE during fan-out (11)

**Category A (5), all in the `CorpScheduleBP` band → `enc_05`:**

| Serial | Rule (abbrev.) | Why the target is absent |
|---|---|---|
| A213 | A30 = Sl.8B of Part A-OI | PARTA_OI ships no 8B field; its u/s-40 keys are `AmtDisallUs40` (8Aj) and `AmtDisallUs40A` (9f). BP item 30 (`AmtDisallUs40NowAllow`) has no OI counterpart. |
| A216 | BP 11 = 1Evi Mfg + 52 of P&L | `ManufacturingAccount` carries only `{OpeningInventory, ClosingStock, CostOfGoodsPrdcd}` — no 1Evi depreciation line (nor Ind-AS). |
| A228 | dep u/s 32(1)(i) only if power sector | `NatOfBus` carries a business Code but the schema has no power-sector classifier; needs an external code master. |
| A232 | exempt reduced from PGBP = EI + IF share | allocation of BP item-5 exempt components across Schedule EI vs IF is unstated; a sound equality would false-fire on lawful returns. |
| A233 | A21 = sum of A(21a…21l) | item 21 is one total leaf `DeemIncUs3380HHD80IA`; the 21a–21l sub-lines have no schema keys to sum. |

**Category B (4) → `enc_19`:** B17, B18, B19, B20 — the TDS schedule
(`ScheduleTDS2`/`ScheduleTDS3`) preserves only a broad `HeadOfIncome` (OS/CG/…), not the
income sub-nature (VDA / §115BB lottery / race-horse / §115BBJ online games) that the rule
must match the TDS row against. Confirmed in the schema:
`TDSOthThanSalaryDtls`/`TDS3onOthThanSalDtls` expose `HeadOfIncome` only.

**Category D (1) → `enc_20`:** D23 — "all effects in the audit report Form 3CD route
through Schedule OI & BP per the mappings": Form 3CD is an external audit report not
present in the built return, so there is no in-return field to assert against.

Pre-existing OFFLINE serials (unchanged): A765 (RBI IFSC DB); B3/B4/B5/B8/B9 (Form
10-IB/IC/ID backend DB match).

### ENFORCED-via-parametrized-helper (do not undercount)

About **56** Category-A serials are enforced not by a literal `A(<serial>,…)` call but by
**DRY helpers / loops that emit computed serials**. They are enforced and fire on a
violating return; only a literal-serial `grep` undercounts them. They are counted as
ENFORCED in the census.

| Serials | Mechanism | File |
|---|---|---|
| A64–A70, A75–A96 | `trdChecks(sheet, indAS, off)` emits `A(off+N, …)` — offset 64 (regular Trading), offset 75 (Ind-AS Trading + Manufacturing) | `enc_02` |
| A279–A282, A294–A299 | dynamic-serial `forEach` over DPM/DOA depreciation blocks | `enc_06` |
| A537–A550 | `BROWS.forEach((k,i)=>…)` over Schedule BFLA rows | `enc_11` |
| A661 | per-fund `SchedulePTIDtls[].forEach` emitting `A(661,…)` across every HP/CG leaf | `enc_14` |
| A791–A792 | per-row `TDS2/TDS3[].forEach` emitting `A(791\|792,…)` | `enc_16` |

## Result

**MISSING = 0** for every category (A, B, D). The claim is auditable: each serial's bucket
is recorded one-line in the `rule_census.md` appendix, each re-file's reason is in the
encoder file header, and the appendix tally reconciles to the totals above.
