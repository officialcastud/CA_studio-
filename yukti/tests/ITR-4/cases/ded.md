# ITR-4 · section `ded` — hand-checked case

Resident **individual**, not a senior citizen, **old regime** (`S.fs.optout="Yes"`).
One income head posted by inccore: `S.C.inc.income = 8,00,000` → GTI estimate 8,00,000.

## Inputs
- **80C** item table: one row ₹1,60,000 (over the ₹1,50,000 ceiling).
- **80D**: self & family, non-senior — health insurance ₹28,000; preventive check-up ₹6,000.
- **80G**: one donee, bucket A (100%, no qualifying limit), other mode ₹10,000.
- **HRA 10(13A)**: Place = Metro; HRA received ₹2,00,000; rent ₹1,80,000; Basic ₹6,00,000; DA ₹0.

## Expected (from the book's caps)
| item | claimed (Usr) | allowed (Deduct) | why |
|---|---|---|---|
| 80C | 1,60,000 | **1,50,000** | C1 ceiling ₹1,50,000 |
| 80D | 25,000 | **25,000** | self non-senior min(₹25,000, 28,000 + ₹5,000 check-up cap) |
| 80G | 10,000 | **10,000** | bucket A at 100%, other-mode |
| **C19 total** | 1,95,000 | **1,85,000** | Σ allowed, ≤ GTI (8,00,000) so no clamp |

**S.C.ded.total = ₹1,85,000.**

HRA least-of-three: A = ₹2,00,000; B = rent − 10% salary = 1,80,000 − 60,000 = **₹1,20,000**;
C = 50% (Metro) × 6,00,000 = ₹3,00,000. **Eligible = min = ₹1,20,000.**

## New regime (`S.fs.optout="No"`)
All Chapter VI-A items above close (only 80CCD(2)/80CCH survive) and HRA closes →
`S.C.ded.total = 0`, `usr = {TotalChapVIADeductions:0}`, no sub-schedule blocks emitted.

## Verified
`node /tmp smoke` executing `engDed()`+`expDed()` returns total 185000, out.c80c 150000,
out.c80d 25000, out.c80g 10000; Schedule80C/80D/80G + ScheduleEA10_13A emitted (old regime);
HRA eligible 120000; new-regime total 0. Matches to the rupee.
