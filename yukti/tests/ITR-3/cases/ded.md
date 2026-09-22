# ITR-3 · section `ded` (Deductions, Chapter VI-A) — hand-traced case

Source: `books/ITR-3/VI_A.md` + `books/ITR-3/REGIME.md`. Traced against
`engDed()`/`expDed()` in `forms/ITR-3/src/70_sec_ded.js`.

## Inputs (resident **Individual**)
- Gross total income (from the income heads): **₹10,00,000** (`S.C.sal.income`), no special-rate income → GTI ceiling W3 = 10,00,000.
- **80C** items: one row ₹1,60,000 (LIC).
- **80CCD(1B)**: ₹50,000, PRAN `123456789012`.
- **80D**: self & family, non-senior — health insurance ₹20,000 + preventive check-up ₹6,000.
- **80JJAA** (Part C, business): ₹30,000.
- **80CCH** (Agnipath): ₹1,00,000.

## Old regime (`S.fs.optout="Yes"`, `isNew()=false`)

### 80D eligible (`eng80D`)
- Self non-senior: HI ₹20,000; preventive capped by the ₹5,000 all-in pool → ₹5,000.
- Self total = min(₹25,000, 20,000 + 5,000) = **₹25,000**. Parents: not claimed → 0.
- Eligible = min(₹1,00,000, 25,000 + 0) = **₹25,000**.

### Chapter VI-A allowed (`engDed`)
- 80C: claimed 1,60,000 → hard cap 1,50,000 → **1,50,000**. 80C+80CCC+80CCD(1) pool = 1,50,000 ≤ 1,50,000 (no further trim).
- 80CCD(1B): 50,000 ≤ 50,000 cap → **50,000**.
- 80D: **25,000** (from Schedule 80D).
- **Part B (K48)** = 1,50,000 + 50,000 + 25,000 = **₹2,25,000** (≤ GTI ceiling).
- 80JJAA: **30,000** → **Part C (K62) = ₹30,000**.
- 80CCH: 1,00,000 ≤ 2,88,000 cap → **1,00,000** → **Part CA and D (K69) = ₹1,00,000**.
- **Chapter VI-A total (K70)** = 2,25,000 + 30,000 + 1,00,000 = **₹3,55,000** (≤ GTI ceiling 10,00,000).

**Expected `S.C.ded.allowed` = ₹3,55,000; `S.C.ded.income` = 0** (a deduction head adds nothing to GTI).
Engine output: partB 225000 · partC 30000 · partCAandD 100000 · total 355000 · **allowed 355000** · income 0 — matches to the rupee.

### Export
- `ScheduleVIA.UsrDeductUndChapVIA.Section80C` = 1,60,000 (claimed) ; `.TotPartBchapterVIA` = 2,25,000.
- `ScheduleVIA.DeductUndChapVIA.TotalChapVIADeductions` = 3,55,000 (allowed).
- `Schedule80C.TotalAmt` = 1,60,000 ; `Schedule80D…EligibleAmountOfDedn` = 25,000.

## New regime (`S.fs.optout="No"`, `isNew()=true`) — the closures
- 80C, 80CCD(1B), 80D **closed by section 115BAC** → 0 (renderer shows `cell(0)`; engine zeroes; check warns).
- Only **80JJAA ₹30,000** (Part C) and **80CCH ₹1,00,000** (CA and D) survive → **allowed = ₹1,30,000**.
- Claimed side and every detail sub-schedule (80C, 80D, …) are **not written** to the export (A696/A710/A646/…).
- Engine output: partB 0 · partC 30000 · partCAandD 100000 · **allowed 130000** — matches.

Both regimes verified with `node forms/ITR-3/src/70_sec_ded.js` under a shell-stub harness.
