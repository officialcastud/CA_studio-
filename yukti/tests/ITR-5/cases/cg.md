# Hand case — Schedule CG (ITR-5, A.Y. 2026-27)

Section `cg` — file `forms/ITR-5/src/70_sec_cg.js`. Verified with a standalone
node harness that stubs the shell globals, `eval`s the section file, runs
`engCg` / `expCg` / `impCg`, and validates the emitted blocks against
`sources/ITR-5/ITR-5_2026_Main_V1_1_schema.json` (Draft-04). Every figure below
is computed by hand and matched to the engine to the rupee.

Assessee: **S SUDHIR**, resident firm, new regime (CG head is open in both
regimes — no item is regime-gated).

---

## Inputs

**A1 — STCG land/building** (one property)
- Full value of consideration (ai) = ₹30,00,000
- Stamp value (aii) = ₹32,00,000
- s.48: bi Reduction48iii 0, bii AquisitCost ₹20,00,000, biii ImproveCost ₹1,00,000, biv ExpOnTrans ₹50,000
- Deduction u/s 54G = ₹1,00,000

**A8 — pass-through STCG** chargeable @20% = ₹2,00,000

**B1 — LTCG land/building** (one property)
- ai = ₹50,00,000, aii = ₹50,00,000
- s.48: bii AquisitCost ₹30,00,000 (no other line)
- Deduction u/s 54EC = ₹5,00,000

**B4 — Schedule 112A** (one grandfathered scrip, acquired ≤31-Jan-2018)
- Qty 100 × sale price ₹2,000 → Col 6 sale = ₹2,00,000
- Cost (Col 8) = ₹50,000 ; FMV/unit 31-Jan-18 (Col 10) = ₹1,000 → Col 11 = ₹1,00,000
- Col 9 = lower(Col6, Col11) = ₹1,00,000 ; Col 7 = higher(Col8, Col9) = ₹1,00,000
- Col 13 = ₹1,00,000 ; Col 14 balance = 2,00,000 − 1,00,000 = ₹1,00,000

**Schedule VDA** — one transfer, head = Capital Gain
- Cost ₹3,00,000, consideration ₹5,00,000 → income = MAX(0, 5,00,000 − 3,00,000) = ₹2,00,000

---

## Hand arithmetic

**A1 (STCG land)** — 50C (Q10): stamp 32,00,000 vs 1.1×30,00,000 = 33,00,000 → 32,00,000 ≤ 33,00,000, so
FullConsideration50C = **₹30,00,000** (consideration stands; no 50C substitution).
bv (Q16) = 0 + 20,00,000 + 1,00,000 + 50,000 = **₹21,50,000**.
1c = 30,00,000 − 21,50,000 = **₹8,50,000**.
A1e (S22) = IF(1c<0,1c,MAX(0,1c−1d)) = 8,50,000 − 1,00,000 = **₹7,50,000**.  ✓

**A10 TotalSTCG** = A1e 7,50,000 + A8 2,00,000 = **₹9,50,000**.  ✓

**B1 (LTCG land)** — 50C: 50,00,000 (no substitution). AquisitCostIndex = AquisitCost = ₹30,00,000
(a firm cannot claim the transitional 20%-with-indexation option; the with-indexation and excess-tax
rows are hidden). bv = ₹30,00,000. 1c = 50,00,000 − 30,00,000 = ₹20,00,000.
B1e (S157) = 20,00,000 − 5,00,000 (54EC) = **₹15,00,000**. B1g = **₹15,00,000**.  ✓

**B4** = ROUND(Col-14 total of Schedule 112A) = **₹1,00,000**.  ✓

**B12 TotalLTCG** = B1g 15,00,000 + B4 1,00,000 = **₹16,00,000**.  ✓

**Table E buckets** (no losses):
- st20 = A8(20%) 2,00,000 = **₹2,00,000**
- stApp = A1e 7,50,000 = **₹7,50,000**
- lt125 = B1g 15,00,000 + B4 1,00,000 = **₹16,00,000**
- st30 / stDTAA / ltDTAA = 0

**C1** (S345) = Σ after-set-off gains = 2,00,000 + 7,50,000 + 16,00,000 = **₹25,50,000**.  ✓
**C2** (S346) = MAX(0, Sch VDA item B) = **₹2,00,000**.  ✓
**C3** (S347) = MAX(0, C1 + C2) = 25,50,000 + 2,00,000 = **₹27,50,000**.  ✓

**SI buckets published on S.C.cg.buckets**:
- si111a20 = after.st20 = 2,00,000
- stApp = 7,50,000
- si112a = MIN(after.lt125, B4+B7) = MIN(16,00,000, 1,00,000) = 1,00,000  (₹1.25L exemption applied in SI)
- si112 = after.lt125 − 1,00,000 = 15,00,000
- si115bbh = C2 = 2,00,000

---

## Loss set-off case (Table E)

STCG applicable loss of ₹5,00,000 (land cost 15,00,000 > consideration 10,00,000) with a 112A LTCG of
₹8,00,000. A STCL sets off against any capital gain (Part E rule):
- E.stApp = −5,00,000 → loss.stApp 5,00,000 ; E.lt125 = 8,00,000.
- Auto set-off: 5,00,000 STCL absorbed against LTCG → after.stApp = 0, after.lt125 = **₹3,00,000**.
- Column identity: InLtcg12_5Per.CurrYearIncome 8,00,000 − StclSetoffAppRate 5,00,000 = CurrYrCapGain 3,00,000.  ✓
- TotLossSetOff.StclSetoffAppRate = 5,00,000 ; LossRemainSetOff = 0 (fully absorbed) ; cflSTCL = 0.
- C1 = **₹3,00,000**.  ✓

---

## Verification status

- `node --check forms/ITR-5/src/70_sec_cg.js` — clean.
- engine figures above match to the rupee (resident + loss cases).
- Non-resident case (A4/A5/A9, B5/B6/B7/B11, Schedule 115AD) computes and exports valid.
- `expCg` output validated against the JSON schema (Draft-04) for **ScheduleCG,
  Schedule112A, Schedule115AD, ScheduleVDA** — all VALID (resident-complex,
  non-resident, empty-on, and off cases).
- Round-trip `exp → imp → exp` is byte-identical (rule 12) for the resident-complex
  and non-resident cases.
