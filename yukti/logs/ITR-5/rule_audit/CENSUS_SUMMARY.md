# ITR-5 rule census — summary (A.Y. 2026-27)

Every rule in `books/ITR-5/rules.json` (868 → 866 Category-A after continuity,
57 Category-B, plus Category-D) was bucketed by a 4-agent census (per-serial
tick sheets in `census/CENSUS_*.md`). Buckets:

- **ENFORCED** — a live `A()`/`Dd()` check (direct, helper-array, or computed serial).
- **NA** — not offline-checkable: needs AIS/26AS, an audit/return form (3CA-3CD, 10DA,
  10CCB, 29C, 10-IEA/10-IF), portal submission/filing-date/assessment state, or another
  person's ITR.
- **OFFLINE-IMPOSSIBLE** — needs an external database (PAN name, RBI IFSC) or the ITR-5
  schema carries no field for the quantity tested.
- **MISSING** — offline-checkable with an existing schema field but left unenforced. **Must be 0.**

## Category A (866)
| bucket | before cleanup | after cleanup |
|---|---|---|
| ENFORCED | 765 | **790** |
| NA | 21 | 21 |
| OFFLINE-IMPOSSIBLE | 55 | 55 |
| **MISSING** | 25 | **0** |

## Category B (57)
| bucket | before cleanup | after cleanup |
|---|---|---|
| ENFORCED (Dd) | 12 | **13** |
| NA | 38 | 38 |
| OFFLINE-IMPOSSIBLE | 6 | 6 |
| **MISSING** | 1 | **0** |

## The 26 MISSING found and fixed (census cleanup wave, enc_23 + enc_24)
- **A261** (BP Sl.A1 Profit-before-tax = P&L 54+62ii+63ii+64v+65iii+66iv+67ii) — enc_24.
- **A449** (Schedule CG A10 total STCG identity) — enc_24.
- **A698,699,700,704,707,709,710,713,714,715,716,717–728** (23 Schedule-SI cross-checks
  against Schedule OS 2c/2d/2a-115BB net of DTAA, Schedule BFLA col-5 per rate-head, and
  Schedule CG sub-item upper bounds) — enc_23.
- **B52** (current-year losses carried forward must be 0 under a belated 139(4) return,
  excluding the s.71B HP-loss / s.32(2) unabsorbed-depreciation heads) — enc_24.

All 26 verified silent (0 fire) on the lawful firm test client with negative controls;
Gates 0–7 remain green after integration.

## Result
**MISSING = 0** in both categories — every offline-checkable CBDT validation rule for ITR-5
is enforced. The NA and OFFLINE-IMPOSSIBLE buckets are, by definition, checks the e-filing
portal performs against data or databases not present in an offline single-file return.
