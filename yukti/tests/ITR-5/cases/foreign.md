# Hand case — section `foreign` (ITR-5, A.Y. 2026-27)

Section file: `forms/ITR-5/src/70_sec_foreign.js`.
Blocks: **ScheduleFSI**, **ScheduleTR1**, **ScheduleFA**.
Books: `books/ITR-5/FSI.md`, `books/ITR-5/TR_FA.md`.

Residential status: **RES** (Resident). FSI, TR and FA all apply (they are off for NRI).

## Input (a resident firm with foreign income in two countries + one depository account)

Schedule FSI — two country blocks:

| Country | Head | (b) Income | (c) Tax paid outside | (d) Tax payable in India | TR section |
|---|---|---|---|---|---|
| USA (code 2), TIN ABC123 | i House Property | 100000 | 15000 | 12000 | 90 (DTAA) |
| | ii Business or Profession | 0 | 0 | 0 | |
| | iii Capital Gains | 50000 | 8000 | 10000 | |
| | iv Other Sources | 20000 | 5000 | 4000 | |
| UK (code 44), TIN XYZ789 | iv Other Sources | 30000 | 6000 | 9000 | 91 (no DTAA) |

Schedule FA — one A1 depository account (USA, CITI, peak ₹5,00,000, interest ₹12,000).

## The arithmetic (each figure to the rupee)

**Relief per head, (e) = MIN(c, d)** — FSI.md rule `[M15]=MIN(K15,L15)` (A764/A765):

- USA HP:  MIN(15000, 12000) = **12000**
- USA CG:  MIN(8000, 10000)  = **8000**
- USA OS:  MIN(5000, 4000)   = **4000**
- UK  OS:  MIN(6000, 9000)   = **6000**

**Country totals, SUM of the four heads** (A766) — USA:
- (b) 100000+0+50000+20000 = **170000**
- (c) 15000+0+8000+5000   = **28000**
- (d) 12000+0+10000+4000  = **26000**
- (e) 12000+0+8000+4000   = **24000**

UK: (c) **6000**, (e) **6000**.

**Schedule TR** (rows generated per country from FSI — A775 c ← FSI (c), A776 d ← FSI (e)):

- `TotalTaxOutsideIndia`  [G11] = 28000 + 6000 = **34000**
- `TotalTaxReliefOutsideIndia` [H11] = 24000 + 6000 = **30000**
- `TaxReliefOutsideIndiaNotDTAA` [J13] = SUMIF(section=91) = UK relief = **6000**
- `TaxReliefOutsideIndiaDTAA` [J12] = 30000 − 6000 = **24000**  (USA, section 90)
- check J12 + J13 = 24000 + 6000 = 30000 = H11 ✓ (rule 773)

**Part B-TTI feed** (the tax section reads these off `S.C.fa`):
- `S.C.fa.dtaa`    = 24000  → Part B-TTI 6a (Section 90/90A), rule 826
- `S.C.fa.notDtaa` = 6000   → Part B-TTI 6b (Section 91), rule 827
- 6c = 6a + 6b = 30000 (rule 828)
- `S.C.fa.paidTot` = 34000, `S.C.fa.reliefTot` = 30000, `S.C.fa.income` = 0 (FSI adds nothing to GTI), `S.C.fa.hasFA` = true.

## Verified by harness (node)

`engForeign()` then `expForeign(j)` produced exactly:

```
paidTot 34000 · reliefTot 30000 · dtaa 24000 · notDtaa 6000 · hasFA true · income 0
USA heads e: hp 12000 cg 8000 os 4000
USA TotalCountryWise {b:170000, c:28000, d:26000, e:24000}
FSI object keys: CountryName,CountryCodeExcludingIndia,TaxIdentificationNo,
                 IncFromHP,IncFromBusiness,IncCapGain,IncOthSrc,TotalCountryWise
  (IncFromSal is ABSENT — ITR-5 FSI has four heads, no salary)
ScheduleTR1.TotalTaxOutsideIndia = 34000   (ITR-5 leaf name, not TotalTaxPaidOutsideIndia)
ScheduleTR1.TaxReliefOutsideIndiaDTAA = 24000 · TaxReliefOutsideIndiaNotDTAA = 6000
TR rows: 2/90/paid28000/rel24000 · 44/91/paid6000/rel6000
FA A1: AccOpenDate exported as ISO 2020-06-01
```

**Round-trip (rule 12):** `impForeign(j)` re-read FSI + TR + FA, and a fresh
`engForeign()`/`expForeign()` produced a JSON identical to the original
(`round-trip identical: true`). The TR relief section is stored back onto each
FSI block on import (via `ScheduleTR[].ReliefClaimedUsSection`), so the 90/91
split survives the round trip.

## Notes / anything not honoured

- Schedule TR is **generated from Schedule FSI** per country (as in the reference
  build): column (c) = FSI country total (c), column (d) = FSI country total (e),
  which makes rules A775/A776 hold by construction. The only TR-specific input is
  the relief section (90/90A/91), chosen in the TR table and stored on the FSI
  block's `sec`.
- Income-floor cross-rules A767–A770 (FSI head income ≥ the corresponding return
  head) are cross-section rules — left for the Phase-6 rules-enforcer / integrator
  (they compare against HP/BP/CG/OS heads owned by other sections), not encoded as
  a section-local check here.
- Hidden rows are not built: FSI rows 7–10 (report-form staging) and TR_FA row 19
  (A1 header) — per the books.
