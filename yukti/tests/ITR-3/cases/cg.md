# Section `cg` (Schedule CG · 112A · 115AD · VDA) — hand-traced case

Resident individual, new regime (`fs.optout="No"`). CG is not regime-gated, so
the figures are identical old-or-new (verified both ways).

## Inputs (`S.cg`)

1. **Short-term land/building (A1)** — `land[0]`, `lt:"Short"`
   - Date of purchase 01/06/2024, date of sale 01/09/2025
   - Full value of consideration (ai) = ₹30,00,000
   - Stamp valuation (aii) = ₹32,00,000
   - Cost of acquisition (bi) = ₹25,00,000; expenditure (biii) = ₹50,000
   - No section-54B/54G/54GA deduction.

2. **Listed equity u/s 112A (B4)** — `s112a[0]`, acquired **after** 31-Jan-2018 (`pre18:"AE"`)
   - Consolidated sale value (Col 6) = ₹5,00,000; cost (Col 8) = ₹2,00,000; expenditure = 0.
   - No 54F.

## Hand arithmetic (from the CG book §3)

**A1 — STCG on immovable property (r16/r21, S21)**
- 50C (Q10): stamp 32,00,000 vs 1.10 × 30,00,000 = 33,00,000 → stamp does **not** exceed the
  110 % band, so full value = actual consideration = **30,00,000**.
- biv (r15) = 25,00,000 + 0 + 50,000 = 25,50,000.
- c (r16) = 30,00,000 − 25,50,000 = **4,50,000**.
- No deduction ⇒ A1e (r21) = **4,50,000**.
- **A10** (r140) = A1e = **4,50,000**.

**B4 — LTCG u/s 112A (Schedule 112A → r256/r262)**
- Row acquired after 31-Jan-2018 ⇒ no grandfathering: Col 9 = 0, Col 7 (cost w/o index) =
  higher of Col 8 (2,00,000) and Col 9 (0) = 2,00,000.
- Col 13 (T6) = Col 7 + expenditure = 2,00,000. Col 14 (U6) = Col 6 − Col 13 = 5,00,000 − 2,00,000
  = **3,00,000** = `Balance112A`.
- B4a (r256) = 3,00,000; no 54F ⇒ B4c (r262) = **3,00,000**.
- **B13** (r425) = B4c = **3,00,000**.

**Part E — set-off (r523–r534)**
- applicable-rate slot gain = A1e = 4,50,000 (no loss) → after set-off = 4,50,000.
- 12.5 % slot gain = B13 heads = 3,00,000 (no loss) → after set-off = 3,00,000.
- **C1** (r426) = 4,50,000 + 3,00,000 = **7,50,000**.

**Part C — summary**
- C2 (r427, Schedule VDA item B) = 0 (no VDA).
- **C3** (r428) = C1 + C2 = **7,50,000**.
- `S.C.cg.income` = C3 = **7,50,000** (this head's contribution to Gross Total Income).

## Engine output (traced line by line, matches to the rupee)

```
A1e (land STCG) = 450000
A10 total STCG  = 450000
B4 112A balance = 300000   B4c = 300000
B13 total LTCG  = 300000
E stApp after   = 450000
E lt125 after   = 300000
C1 = 750000   C2 = 0   C3 = 750000   income = 750000
exp TotalSTCG = 450000 · exp TotalLTCG = 300000 · exp C3 = 750000 · Schedule112A.Balance112A = 300000
```

Round-trip (export → import → export) reproduces C3, TotalSTCG, TotalLTCG and
`Balance112A` identically.

Both regimes: with `fs.optout="Yes"` (old) the same figures are produced — Schedule CG
carries no regime-closed item (the 54/54B/… exemptions are capital-gains exemptions, not
Chapter VI-A, and stay available in both regimes per REGIME.md).
