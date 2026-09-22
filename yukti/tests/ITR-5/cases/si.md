# Hand case — Schedule SI (ITR-5, A.Y. 2026-27)

Section `si` — file `forms/ITR-5/src/70_sec_si.js`. Verified with a standalone
node harness that stubs the shell globals, `eval`s the section file, runs
`engSi` / `expSi` / `impSi`, and validates the emitted `ScheduleSI` block
against `sources/ITR-5/ITR-5_2026_Main_V1_1_schema.json` (Draft-04). Every
figure below is computed by hand and matched to the engine to the rupee.

Assessee: **S SUDHIR**, resident **firm** (status 1 — no basic-exemption
limit), new regime. Schedule SI is fully auto-populated from CG/OS/BP after
the Schedule BFLA set-off; nothing is keyed by hand.

---

## Case 1 — 112A LTCG scaled to POST-BFLA (the load-bearing case)

The key rule: the special-rate CG income must equal Schedule BFLA column 5
(rules 713/714/715). So the 112A figure that Schedule CG published pre-set-off
is scaled down by the brought-forward loss that BFLA absorbed.

**Inputs**
- `S.C.cg.buckets.si112a` = ₹5,00,000 (112A LTCG @12.5, pre-BFLA)
- `S.C.cg.buckets.si112`  = ₹0 (no other 12.5% LTCG)
- `S.C.loss.afterB.lt125` = ₹3,00,000 (post-BFLA — a ₹2,00,000 brought-forward
  LTCL was set off against the ₹5,00,000 LTCG in Schedule BFLA)

**Hand arithmetic**
- 12.5% LTCG pre-BFLA = si112a + si112 = 5,00,000 + 0 = ₹5,00,000
- scale factor = afterB.lt125 / pre = 3,00,000 / 5,00,000 = **0.6**
- SI code `2A` income (i) = 5,00,000 × 0.6 = **₹3,00,000**
- §112A ₹1,25,000 exemption: taxable = 3,00,000 − 1,25,000 = **₹1,75,000**
- tax = ROUND(1,75,000 × 12.5 / 100) = ROUND(21,875) = **₹21,875**

**Totals**
- `TotSplRateInc` (H105) = **₹3,00,000**
- `TotSplRateIncTax` (J105) = **₹21,875**
- `exemption112A` = **₹1,25,000**

**Exported `ScheduleSI`**
```json
{
  "TotSplRateInc": 300000,
  "TotSplRateIncTax": 21875,
  "SplCodeRateTax": [
    { "SecCode": "2A", "SplRatePercent": 12.5, "SplRateInc": 300000, "SplRateIncTax": 21875 }
  ],
  "EditAutopoulatedDetail": "N"
}
```
Schema-valid (Draft-04, resolved against the main schema). Round-trip: import
of this block re-derives `2A` from Schedule CG (a CG-auto code, not kept in
`S.si.over`) and sets `EditAutopoulatedDetail` → `No`.

Engine output (matches to the rupee):
```
2A  rate 12.5  inc 300000  taxable 175000  tax 21875  src cg
TotSplRateInc 300000  TotSplRateIncTax 21875  exemption112A 125000
```

---

## Case 2 — mixed OS + BP + DTAA aggregate (no BFLA scaling)

**Inputs**
- OS 2a(i) 115BB winnings = ₹1,00,000 → SI `5BB` @30
- OS 2b 115BBE = ₹50,000 → SI `5BBE` @60
- OS 2c `5A1ai` gross = ₹2,00,000, with a DTAA row on the **same** code
  `5A1ai` = ₹50,000 (counted) → SI `5A1ai` income = 2,00,000 − 50,000 = ₹1,50,000 @20
- OS 2d PTI `PTI_5A1aii` = ₹80,000 → SI `PTI_5A1aii` @20
- OS 2e DTAA total (`item2e`) = ₹90,000; DTAA rows: `5A1ai` ₹50,000 @10%,
  `56i` (normal-code) ₹40,000 @15% → SI `DTAAOS` aggregate
- BP 3d 115BBF (patent, BP) = ₹70,000 → SI `5BBF_BP` @10
- BP 3f 115BBH (VDA, BP) = ₹1,20,000 → SI `5BBH_BP` @30

**Hand arithmetic**
| SI code | income (i) | rate | tax (ii) |
|---|---|---|---|
| `5BB` | 1,00,000 | 30 | 30,000 |
| `5BBE` | 50,000 | 60 | 30,000 |
| `5A1ai` | 1,50,000 | 20 | 30,000 |
| `PTI_5A1aii` | 80,000 | 20 | 16,000 |
| `DTAAOS` | 90,000 | 1 (per treaty) | 11,000 |
| `5BBF_BP` | 70,000 | 10 | 7,000 |
| `5BBH_BP` | 1,20,000 | 30 | 36,000 |

- `DTAAOS` tax is NOT income × rate (rule 705 exempts the DTAA rows). It is the
  sum of each counted DTAA row × its applicable treaty rate:
  50,000 × 10% + 40,000 × 15% = 5,000 + 6,000 = **₹11,000**.
- `TotSplRateInc` = 1,00,000 + 50,000 + 1,50,000 + 80,000 + 90,000 + 70,000 +
  1,20,000 = **₹6,60,000**
- `TotSplRateIncTax` = 30,000 + 30,000 + 30,000 + 16,000 + 11,000 + 7,000 +
  36,000 = **₹1,60,000**

Engine output matches to the rupee (all seven rows, both totals). Schema-valid.

---

## Notes on faithfulness

- 111A STCG exports as SecCode **`1`** (schema enum), not the sheet's internal
  `[F]`-cell `1A` — the schema is authoritative (`1A` is not in the enum).
- The 26 hidden pre-23-Jul-2024 / 115B / 115BBC / 115BBDA / PTI-@10/15/20%
  legacy rows are not built.
- CG-auto codes (`1`,`21`,`2A`,`5BBH`,`DTAASTCG`,`DTAALTCG`) are re-derived from
  Schedule CG every compute and are not stored on import.
- Basic-exemption spreading fires only for a resident **AOP/BOI** (status 14);
  a firm / local authority / AJP has no basic-exemption limit, so the walk is a
  no-op for them (as in Case 1/2).
