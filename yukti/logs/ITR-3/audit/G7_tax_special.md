# ITR-3 audit — G7_tax_special (sections `tax`, `si`)

Sheets owned: **Part B - TI TTI**, **Tax Calculated** (hidden), **AMT** (hidden),
**AMTC**, **TPSA** → `forms/ITR-3/src/70_sec_tax.js`; **SPI - SI - IF** →
`forms/ITR-3/src/70_sec_si.js`. Read-only audit; no files changed except this report.

Overall the tax + special-rate build is unusually strong on **content coverage** (every
live Part B-TI/TTI row present, all hidden legacy CG rows correctly excluded, the SI
SecCode/rate enums are 100% complete, AMT/AMTC/TPSA structure faithful). The serious
problems are in **state wiring and gating**, not in missing schedules: two shared-state
desyncs (residential status, due date) silently break the residential and audit-case
computations that the utility drives from flags.

---

## Part B - TI TTI  (section: tax)

### Missing fields/rows
- [r62H] "Rebate under section 88E (4 of Schedule-STTR)" — L66 = `MAX(0,TaxPayableOnTotInc − RebateUs88E)`. Our `after` (70_sec_tax.js:143) subtracts only the 87A rebate; 88E is absent. The book (Part_B_TI_TTI.md L246) classes r62 as a **hidden legacy** line, so exclusion is defensible — but ITR-3 filers with STT-paid securities *business* are the population 88E was written for. Impact: none for a normal filer; a securities-trading business filer cannot claim the 88E rebate. **Excluded by book design — noted, not counted.**
- [r87H] "Section 89A" relief (retirement-account income). Hidden; book Part_B_TI_TTI.md L249 says not mapped this year. Our 6a/6b/6c = 89/90/91 only. **Excluded by book design.**
- All other live rows present and correct: 1, 2, 3i–3v (incl. speculative 3ii, specified 3iii — ITR-3-specific), 4a(i)–4e, 5a–5d, 6–19. Hidden CG legacy rows r14H @15%, r21H LT@10%, r23H LT@20% correctly **not** built (our 4a rows = 20/30/appl/DTAA per live J15–J18; 4b = 12.5/DTAA per J22/J24).

### Dropdowns
- None on this sheet other than bank-block selects (owned by `bank` section). No gaps.

### Conditional cascades (show/hide)
- Hidden CG-rate rows (r14H/r21H/r23H) are pre-23-Jul-2024 legacy rates that the utility only unhides for old-date transfers; our live-only set is the correct current-year behaviour. Reproduced: N/A (correctly omitted).

### Regime open/close
- 87A rebate [r65 / L65] — Excel new = up to ₹60,000 @ TI ≤ ₹12L with marginal relief; old = ₹12,500 @ TI ≤ ₹5L (not vs 112A/115AD). Ours (70_sec_tax.js:136–141): **match**.
- Surcharge cap — new 25% ceiling above ₹2cr, old 37% above ₹5cr; CG/dividend held to 15%; 115BBE fixed 25%. Ours `taxPlusSurAt` (49–57) + surcharge walk (145–155): **match**, incl. four-threshold marginal relief [5L/1cr/2cr/5cr].
- Exemption limit [S48] new 400000 / age-banded old, NRI never senior. Ours `taxExemptionLimit` (34–38): logic matches **but keyed on the wrong state field** — see the `pi.res` desync below.
- Deemed income u/s 115JC [r50] closed in new regime (`bacValue=1` → 0). Ours item 19 gated on `AM.applies` (344): match.

### Audit u/s
- **Due date is not derived from the audit flag — MAJOR.** The utility's `finalDuedate` (Tax Calculated B7) = `IF(COUNTIF(isLiableForAudit,"=1")>0, <31-Oct or 31-Nov for TempK 14/37>, <31-Jul>)` — i.e. a 44AB-liable ITR-3 filer's 139(1) due date is **31-Oct-2026** (30-Nov if 92E). Our interest engine (70_sec_tax.js:205) reads `D(S.fs.dueExt)||DUE` where `DUE = FORM.due = 2026-07-31` (shell.js:12; 00_form.js:10) and **`S.fs.dueExt` is never written by any section** (only read, tax.js:205). The user's actual choice lives in `S.fs.duedate` (ret.js:37 default `2026-10-31`, exported who.js:262) and is completely ignored by 234A/234B/234C/234F. Impact: every audit-case ITR-3 filed between 1-Aug and 31-Oct is wrongly charged **234A interest + a 234F late fee**, and `late`/`gate234c` are computed against the wrong date. 00_form.js:6 itself flags this as an unfinished "TODO Phase 4".

### ITR-2 bleed / notes
- 234C proviso not applied. Utility (Tax Calculated r117–r167) accrues CG/lottery/online-game/VDA/115A/115AD income **quarter-by-quarter** (Upto15Of6 … Up16Of3To31Of3) with per-quarter basic-exemption (`applyExemption`) and per-quarter surcharge/cess; the proviso means CG/special income bears no 234C if paid in the remaining instalments. Ours (70_sec_tax.js:224–241) treats the whole liability as accruing from Q1 ("safe default", per its own comment). This **over-states 234C** whenever material CG/special income arose after Q1. Documented simplification, but a real numeric divergence from the utility.

### Verdict: **MAJOR GAPS** — coverage is complete; the due-date wiring makes audit-case interest/fee wrong.

---

## Tax Calculated (hidden method sheet)  (section: tax)

### Missing fields/rows
- Method faithfully reproduced for slabs (B27/B28/B29/G25), aggregate-income rebate on agri (L48/E25), exemption bands (C33/C34), 234A principal floor (B4 `FLOOR(…,100)`), 234B 24-month cycle with SAT-first interest-then-principal (r76–r92), 234F fee, 234-I fee. No live method line missing.

### Conditional cascades / Regime
- `bacValue` (new-regime) gating on slabs, rebate, AMT: reproduced via `isNew()`.

### Audit u/s
- See the `finalDuedate` MAJOR item under Part B above — that formula lives on this sheet (B5/B6/B7/B14) and is the source we fail to honour.

### ITR-2 bleed / notes
- `matchedSAT` (H1/D3) in the utility is gated on `Flag92E`/`Temp_lakhcheck`; ours (satIn over [1-Apr-2026, dueDate], tax.js:216) is a simpler window — acceptable, but again anchored to the wrong `dueDate`.

### Verdict: **MINOR GAPS** (method correct; the one defect is the shared due-date source, already counted under Part B).

---

## AMT (hidden)  (section: tax)

### Missing fields/rows
- [N8–P14 columns] **AMT surcharge marginal relief not reproduced.** The utility computes the AMT surcharge with tiered marginal relief at ₹50L/1cr/2cr/5cr (the `AdjustedUnderSec115JC3a2_50L/2_1cr/2_2cr/2_5cr` column machinery, r7–r14). Ours (70_sec_tax.js:167–168) is flat: `amtScr` tier × `amt115JC`, no marginal relief. Impact: AMT surcharge slightly overstated for adjusted-income figures just over a threshold. Rare (old regime + AMT + >₹50L), but a live-computation gap.
- [J4 / Amt_Condn, M3=`AND(Condn_1..6)`] **specified-business substitution not reproduced.** When TotalIncome=0 while a specified-business (35AD) loss equals profit-before-tax and 35AD>0 (Condn 1–6), the utility substitutes `sheet12.ProfLossFromSpecifiedBus` for TotalIncome as item-14 input to AMT. Ours always uses `ti` (tax.js:162). ITR-3-specific (35AD/specified business); narrow edge case.

### Regime open/close
- Schedule AMT blank in new regime [J10 `IF(bacValue=1,0,…)`]. Ours `amtApplies=!isNew() && addbacks>0 && amtAdj>2000000` (165) + chk warning (607): **match**.
- Trigger set = **Part-C VI-A (2a) + 10AA (2b) + 35AD (2c)** [H6/H7/F8], 18.5% (9% IFSC) if adjusted TI > ₹20L. Ours (161–166): **match — and correctly WIDER than ITR-2** (10AA + 35AD + Part-C, not just 80QQB/80RRB). This was the CEO's headline worry and it is handled.

### Audit u/s
- 35AD add-back ties AMT to specified-business (an audit-adjacent ITR-3 item) — present via `BP.ded35AD`/`DED.ded35AD` (161).

### Verdict: **MINOR GAPS** (trigger set correct and ITR-3-wide; only surcharge marginal relief + the Amt_Condn edge are unreproduced).

---

## AMTC  (section: tax)

### Missing fields/rows / cascades
- 13 prior AYs (2013-14 … 2025-26, rows i–xiii) + current-AY row xiv, gross/set-off/bal-b/f/utilised/cf, and the five totals: all present (TAX_AMTC_YRS, 27–28; rows/export 179–185, 546–563). Exported per element keyed by `AssYr`, so the utility's scrambled internal `AmtCreditFwd_n` numbering is irrelevant.
- Minor: current-AY gross [G22 `MAX(TaxSection115JC − TaxOthProvisions − AMTCmove,0)`] — our `amtcCurr` (183) omits the `AMTCmove` term. Negligible.

### Regime open/close
- New regime: utilised (C) and carried-fwd (D) held to 0 [book rule]. Ours (181–182) + chk (613): **match**.

### Audit u/s
- 2025-26 (row xiii) B2 "set off in earlier years" must be 0 (utility H23 = `SUM(H9:H20)` stops at 2024-25). Ours chk err (619–620): **match**.

### Verdict: **SOLID**.

---

## TPSA  (section: tax)

### Missing fields/rows
- [r5H–r7H] hidden FY-wise breakdown of the primary adjustment (FY 2019-20, 2020-21). Ours captures item 1 as a single `tax.tpsa.amt` (263). The schema field is a single `AmtPrimaryAdjUs92CE_2A`, so no schema loss; the hidden per-FY split is display-only legacy. **Minor.**

### Conditional cascades (show/hide)
- FLAG "Option u/s 92CE(2A) exercised" [Part A-OI]: set → opens the primary-adjustment amount, 18%/12%/4% computation, challan table; clear → hides all. Ours `tax.tpsaOn` gate (262, 426–442): **reproduced — YES**.

### Dropdowns / Regime / Audit
- 18% / 12% surcharge / 4% cess (P8–P11), challan table (BSR/bank/date/serial/amount, H19 total): all present and correct. Not regime-sensitive.

### Verdict: **SOLID** (only the hidden legacy FY split omitted).

---

## SPI - SI - IF  (section: si)

### Missing fields/rows
- **SPI**: name/PAN/Aadhaar/relationship/amount/head + total I12 — all present (255–264, export 333–345). Correct that SPI adds nothing to GTI.
- **SI**: every schema element (`SecCode`/`SplRatePercent`/`SplRateInc`/`SplRateIncTax`, totals G119/I119) present; both totals exported even at zero (349–351).
- **IF**: firm name/PAN/audit-flag/92E-flag/%-share/profit/interest/remuneration/31-Mar capital + row-132 column totals — all present (308–322, export 362–383).

### Dropdowns
- SI `SecCode`: Excel enum has **69** codes; ours has **69** — exact match, zero missing (verified against `enums.json:ScheduleSI.SplCodeRateTax[].SecCode`). The `FA`/`5BBC`/`5BBDA`/`5Eacg` labels seen in the sheet's `O` column are internal helper names, not schema SecCodes.
- SI `SplRatePercent`: 12/12 values match (incl. 4, 9, 12.5).
- SPI `HeadIncIncluded`: 6/6 (BP/SA/HP/CG/OS/EI). IF audit/92E: Y/N. **No dropdown gaps anywhere in this sheet.**

### Conditional cascades (show/hide)
- FLAG "Do you want to edit the details auto-populated?" [I120 / EditAutopoulatedDetail]: set → opens the manual head table; clear → auto-only. Ours `si.edit` (290–300): **reproduced — YES**.
- **SI auto-population is PARTIAL.** The utility auto-populates ~15+ capital-gains special heads from Schedule CG (G-column `BFLAtemp…` buckets): 21 (112 w/index), 21ciii (unlisted, non-resident), 5AC1c, 5ACA1b, 5ADiii/5ADiiiP (FII LTCG), 5AD1biip (FII STCG 111A), 5Ea/5Eacg/5Eb (NRI), and the PTI CG heads. Our engine auto-populates only **6** (2A, 22, 1A, 5BBH, DTAASTCG, DTAALTCG — 181–186). All the others exist in the manual override list, so the *field* is present, but an NR/FII/PTI filer must **re-key** them by hand instead of having them flow from CG. Reproduced: **PARTIAL**.

### Regime open/close
- 112A ₹1,25,000 exemption shared own-112A → PTI-112A → 115AD-proviso [O4/P4/O6/P6/O7/P7]. Ours `SI_112A_ORDER` + pool walk (141, 197–201): **match**.
- Basic-exemption set-off vs special-rate CG, highest rate first [U19/U22, col-X walk] — new ₹4L / age-banded old, **nil for a non-resident**. Ours (208–218): logic matches, but **two residential-status defects**:
  1. **`resident = S.pi.res === "RES"` (si.js:161,248) excludes NOR.** The utility keys on `MID(ResidentialStatus1,1,3) <> "NRI"` (U19) — a Resident-but-not-Ordinarily-Resident (NOR) IS entitled to the set-off. We deny it. Mismatch.
  2. **`S.pi.res` is a dead mirror (shared-state desync — MAJOR).** Residential status is edited via `fs.resStatus` (ret.js:218) and imported into `S.fs.resStatus` (who.js:379); **nothing ever writes `S.pi.res`** (only defaulted "RES" at ret.js:24). So the si engine (and the tax engine's `S.pi.res!=="NRI"` at tax.js:36/46/136/225) always compute as **Resident** regardless of the user's choice. A genuine NRI is wrongly given the basic-exemption set-off (should be 0), the age/senior exemption bands, the 87A rebate, and resident-senior 234C relief. This breaks residential gating across both my sections.

### Audit u/s
- Schedule IF captures per-firm `IsLiableToAudit` and `Sec92EFirmFlag` (311–312, export 371–372): present. These feed the utility's audit/92E due-date logic (which we then fail to consume — see the due-date item).

### ITR-2 bleed / notes
- No ITR-2 numbering bleed; SecCode list, item numbers (row 119 total, row 132 IF totals) and the ₹1,25,000/basic-exemption walk are ITR-3's own.

### Verdict: **MAJOR GAPS** — enums and coverage are exemplary, but the `pi.res` desync + NOR exclusion make residential gating wrong, and CG auto-population is only partial.

---

## GROUP SUMMARY

| Metric | Count |
|---|---|
| Missing fields/rows (live-computation) | 2 (AMT surcharge marginal relief; AMT `Amt_Condn` specified-business substitution) |
| Excluded-by-book hidden rows noted | 3 (88E/STTR, 89A, TPSA per-FY split) |
| Missing cascades | 1 (SI CG auto-population covers 6 of ~15 heads → PARTIAL) |
| Missing dropdown values | 0 (SI SecCode 69/69, rates 12/12, SPI head 6/6 — all exact) |
| Regime mismatches | 2 (`S.pi.res` desync breaks NRI gating in `tax` + `si`; NOR wrongly excluded from basic-exemption set-off) |
| Audit gaps | 1 (139(1) due date not derived from 44AB `isLiableForAudit`/`finalDuedate`; interest engine reads unset `S.fs.dueExt` then the fixed 31-Jul constant, ignoring `S.fs.duedate`) |

### Three most serious
1. **Due-date desync (MAJOR).** 234A/234B/234C/234F use `S.fs.dueExt || DUE(31-Jul)` (70_sec_tax.js:205; shell.js:12; 00_form.js:10); `S.fs.dueExt` is never set and the real due date `S.fs.duedate` (default 31-Oct for audit cases) is ignored. Every audit-case ITR-3 filed Aug–Oct is over-charged 234A interest + a 234F fee. The utility drives this from `finalDuedate`/`isLiableForAudit` (Tax Calculated B5–B14).
2. **`S.pi.res` shared-state desync (MAJOR).** The UI/import write `S.fs.resStatus`; the `tax` and `si` engines read `S.pi.res`, which stays "RES" forever. NRI/NOR residential gating (basic-exemption set-off, exemption bands, 87A, senior-234C) is computed as Resident no matter what the filer selects (si.js:161/248; tax.js:36/46/136/225).
3. **SI capital-gains auto-population is partial (cascade).** Only 6 CG special heads flow from Schedule CG; the ~15 NR/FII/PTI/unlisted CG heads the utility auto-populates must be re-keyed manually via the override (si.js:181–189).

Also flag (lower severity): AMT surcharge marginal relief unreproduced; 234C quarter-wise proviso simplified to Q1 accrual (over-states 234C on late-arising CG). AMT trigger set itself is **correct and ITR-3-wide** (10AA + 35AD + Part-C VI-A), AMTC and TPSA are **SOLID**, and all SI/SPI/IF enums are complete.
