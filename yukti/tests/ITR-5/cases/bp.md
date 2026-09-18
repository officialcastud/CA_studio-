# Schedule BP (ITR-5) — hand-computed case

Section `bp` — `forms/ITR-5/src/70_sec_bp.js`. Figures verified to the rupee
against the engine (`engBp`) with a stubbed shell (scratchpad harness).

## Case 1 — new regime (isNew() = true, fs.optout = "No")

Inputs (S.bp / S.dpm / S.esr / S.icds):
- A1 pbt = 1,000,000; A2a nplSpec = 50,000; A2b nplSpecified = −20,000
- A3b CG = 30,000; A3ci Dividend = 10,000; A3cii Other = 5,000 → A3c = 15,000
- A5a firm share = 25,000; 5c dividend = 10,000; 5c other "Agri" = 5,000
- A11 depDebPL = 80,000; A14 s36 = 12,000; A24a Salary = 7,000; A27 = 3,000
- B40 = 8,000; C44 = 4,000; C47 sp47 = 6,000 (barred in new regime); clause = ab
- DPM 15%: WDV 500,000; add≥180 100,000; realTot 50,000; add<180 40,000; real<180 10,000
- ESR 35(1)(ii): debited 20,000; allowable 50,000
- ICDS Accounting Policies: increase 15,000; decrease 5,000

### DPM 15% block (DPM_DOA.md cell formulas)
- 3 Total (3a+3b)     = 500,000 + 0            = 500,000    (adj 0: new regime, no 115BAC entered)
- 6 Full-rate amount  = MAX(0, 500,000+100,000−50,000) = 550,000
- 9 Half-rate amount  = MAX(0, 40,000−10,000+MIN(0,550,000)) = 30,000
- 10 Dep @ full rate  = ROUND(550,000×15/100) = 82,500
- 11 Dep @ half rate  = ROUND(30,000×15/200)  = 2,250
- 15 Total dep        = 82,500 + 2,250        = 84,750
- 17 Net aggregate    = MAX(0, 84,750−0)      = 84,750
- 21 WDV last day     = MAX(0, 500,000+100,000−50,000+40,000−10,000−84,750) = 495,250
- Schedule DEP total (item 6) = 84,750  → BP A12i

### ICDS / ESR
- ICDS XI Increase = MAX(0, 15,000) = 15,000; Decrease = 5,000; Net = 10,000
- ESR X(4) excess  = MAX(0, 50,000−20,000) = 30,000  → BP A28

### BP ladder — Part A
- A3c = 10,000 + 5,000 = 15,000
- A5c total = 10,000 + 5,000 = 15,000; A5d = 25,000 + 0 + 15,000 = 40,000
- A6 = 1,000,000 − 50,000 − (−20,000) − 0(3a) − 30,000(3b) − 15,000(3c)
       − 0 − 0 − 0(3d/e/f) − 0(4a) − 0(4b) − 0(4c) − 40,000(5d) − 0(5A) = 885,000
- A9 = 0; A10 = 885,000
- A12i = 84,750; A12iii = 84,750; A13 = 885,000 + 80,000 − 84,750 = 880,250
- A24e = 0 (ESR shortfall 0); A24 = 7,000
- A25 = MAX(0, 0 + 15,000) = 15,000
- A26 = 12,000 + 7,000 + 15,000 = 34,000
- A28 = 30,000; A32 = MAX(0, 0 + 5,000) = 5,000
- A33 = 3,000 + 30,000 + 5,000 = 38,000
- A34 = 880,250 + 34,000 − 38,000 = 876,250
- A36 = 876,250; A37f = 876,250; A37 = 876,250

### Parts B / C / D / E
- B39 = 50,000; B42 = 50,000 + 8,000 − 0 = 58,000
- C43 = −20,000; C46 = −20,000 + 4,000 − 0 = −16,000
- C47 = 0 (new regime bars 35AD(1), rule 255); C48 = −16,000
- D = MAX(0,−16,000) + MAX(0,58,000) + 876,250 = 934,250
- E(i) loss to set off = ABS(MIN(0, 876,250)) = 0
- E(ii) speculative income = 58,000, set-off 0, remaining 58,000
- E(iii) specified income = MAX(0,−16,000) = 0
- income published to S.C.bp.income = D = 934,250

## Case 2 — old regime (fs.optout = "Yes") checks
- C47 = sp47 = 25,000 honoured; C48 = (−40,000+5,000) − 25,000 = −60,000.
- DPM 40% additional depreciation (AddlnDeprOnGT180DayAdditions 12,000) honoured:
  full-rate amount 240,000, dep@full 96,000, +12,000 additional → total dep 108,000.
- DOA Building@10% with CapGainUs50 = −5,000 → Schedule DCG total = −5,000 (signed, block ceased).
- 115BAC WDV adjustment (3b) is applied only in the new regime (see report note): in the
  old regime it is ignored and not exported.

## Verifications performed
- `node --check forms/ITR-5/src/70_sec_bp.js` — clean.
- Rate45 exports the reduced leaf set only (no additions/half/additional-depreciation keys).
- ScheduleICDS.TotalNetAmtDetl carries only Increase/Decrease (no NetEffect).
- ESR total col(4) ties to BP A28.
- Export → import → re-export is byte-identical (round-trip green) in both regimes.
