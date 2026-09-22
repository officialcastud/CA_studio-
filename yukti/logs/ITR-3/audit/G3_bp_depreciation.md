# G3 — Business income, depreciation & related sub-schedules (section: bp)

Sheets audited: **BP, DPM - DOA, DEP_DCG, ESR, Unabsorbed Depreciation, ICDS**.
Code: `forms/ITR-3/src/70_sec_bp.js` (screen `secBp`, engine `engBp`, export `expBp`, import `impBp`, checks `chkBp`).
Books cross-read: `books/ITR-3/BP.md`, `DPM_DOA.md`, `DEP_DCG.md`, `ESR.md`, `Unabsorbed_Depreciation.md`, `ICDS.md`, `REGIME.md`.

Headline: this is the **strongest** section of the ITR-3 build with respect to the CEO's worry. The ITR-2-bleed fear does **not** materialise — Part B (speculative business), Part C (specified business u/s 35AD, including the 35AD(5) clause dropdown) and Part E (intra-head set off) are all built from ITR-3's own sheet, none of which exist in ITR-2. All six regime open/close closures match the spec exactly. DPM/DOA/DEP/DCG/ESR/UD/ICDS are all reproduced. Two genuine gaps remain (one required leaf that cannot be filled or imported; the DPM 45% block missing its half-rate/additional-depreciation rows), plus one scope note about the 44AD(4) audit trigger which does not live on any sheet I own.

---

## BP  (section: bp)

### Missing fields/rows
- **`BusinessIncOthThanSpec.PLUs44sChapXIIG`** ("Profit or loss included in 1, referred to in section 44AD/…/44DA **and Chapter-XII-G**", BP.md row 27, a **required** leaf key). In code it exists only as `S.bp.pl44` (state line 34) and is exported once as `put(j,P+"PLUs44sChapXIIG",n0(B.pl44))` (exp line 640) — but there is **no screen input in `secBp`** and **no line in `impBp`**. So it is hard-wired to 0, cannot be entered by a filer, and is silently dropped on a return→import→export round-trip. Impact: a shipping/Chapter-XII-G assessee (or anyone whose PBT includes 44-group profit that must be shown on this line) cannot fill it; also a latent round-trip (rule 12) breakage if any imported JSON carries a nonzero value. Fix is small (add an input row after 3g and an import line). Violates constitution rule 3/4.
- All other visible numbered rows (1–38, 39–B42, 43–C48, D, E i–v) are present and computed. Hidden legacy rows correctly **not** built: 32AD (r97H), 35AC/31a–c (r101H–104H), 44BBB (r116H), 44D (r117H), Chapter-XII-G deemed-profit line (r121H), 10A/10AA/10B/10BA block (r123H–129H), 46a/46b 35AD split (r150H–151H), TempBusLoss (r164H). Matches BP.md "Hidden rows — not built".

### Dropdowns
- **35AD(5) clause** [G154:G155]: Excel/`BP_Drp` has 13 selectable clauses (a, aa, ab, ac, ad, ae, af, ag, ah, ai, aj, ak, b). Code `BP_35AD5` (lines 74–88) has all 13. **No missing values.** Two-row selection (`bp.clause.0/.1`) reproduced, and the "same clause cannot be picked twice" validator is present (chk lines 1021–1023).

### Conditional cascades (show/hide)
- BP has **no Yes/No flags, radios or type selectors** — it is a pure computed adjustment ladder. The only show/hide on the sheet is the regime driver (below). No business-flag cascade to reproduce.
- The presumptive-vs-regular relationship: BP only **consumes** presumptive results (item 4a `ProfitLossInclRefrdSec.*` fed from sheet11; item 35 `DeemedProfitBusUs.*` fed from PL_61ii/62ii/63ii). Reproduced as guarded inputs `bp.p44AD…p44DA` and `bp.d35_44AD…d35_44DA` with `_4a` (eng 245) and `_35` (eng 269) totals. The **turnover × 6%/8% / 50% / per-vehicle presumptive computation itself lives on the "Profit and Loss" sheet (sheet11), owned by group bpa** — not on any BP sheet. Correct division of labour.

### Regime open/close
- **35AD(1) deduction (item 47)**: Excel new=closed, old=open. Ours: **match** — `_47 = isNew()?0:R(nb("sp47"))` (eng 284, A287); renderer shows `cell(0)` + "closed by section 115BAC" note when new, input when old (sec 429–431). Check at chk 1007.
- No other regime switch on the BP ladder itself; the rest of the regime closures are on the depreciation/ESR/UD sub-schedules below.

### Audit u/s
- **No audit trigger exists on the BP sheet.** The 44AD(4)/(5) "opted out of presumptive, now liable to audit", 44AB liability, and 44AA books-of-account flags are on **Part A - General** (`sheet1.LiableSec44ABflg`, rows 79/80H etc. — section **who**) and are referenced by **Nature Of Business** (`[N3]=…sheet1.LiableSec44ABflg`) and **Profit and Loss/sheet11** (section **bpa**). None of these are among my six sheets. See "ITR-2 bleed / notes" for the cross-reference the CEO should route to groups who/bpa.

### ITR-2 bleed / notes
- **Speculative (Part B, rows 139–143) and specified-business u/s 35AD (Part C, rows 144–155) are fully built** — `Bp._39/_40/_41/B42` (eng 276–278) and `Cp._43/_44/_45/_46/_47/C48` (eng 281–285), rendered at sec 417–434, exported under `SpecBusinessInc.*` / `SpecifiedBusinessInc.*` (exp 730–744). These schedules **do not exist in ITR-2**, so the CEO's "any absence is a MAJOR gap" concern is **not** realised here. No bleed.
- Intra-head set off (Part E, rows 163–170: current-year business loss set off first against speculative then specified income) reproduced at eng 291–297 and exp 748–757. Loss-to-CFL routing hints present (B42→6ix, C48→7ix). This is an ITR-3-only mechanic — built.
- **Cross-reference (route to groups who / bpa):** the 44AD(4) audit-liability cascade the CEO asked me to focus on is genuinely off my sheets. It must be verified on Part A - General (who) and P&L/Nature of Business (bpa). Within BP, the consequence of that cascade (presumptive figures at 4a and 35) is correctly consumed.

### Verdict: **MINOR GAPS** — one required leaf (`PLUs44sChapXIIG`) cannot be filled or imported; everything else (speculative, specified, 35AD(5), set-off, regime) is correct.

---

## DPM - DOA  (section: bp — blocks ScheduleDPM, ScheduleDOA)

### Missing fields/rows
- **DPM 45% plant-&-machinery block — half-rate and additional-depreciation rows are absent.** The utility computes half-rate depreciation for the 45% column I: rows 16 (additions <180 days), 17 (realization out of 7), 18 (`[I18]=MAX(0,I16-I17+MIN(0,I7+I13-I14))`) and 20 (`[I20]=ROUND(DPM45.HalfRateDeprAmt*DPM45.RATE/200,0)`), plus additional-dep rows 21–23 feeding `[I24]`. All of these rows are **visible** (no H). Our code builds r45 with `{half:false, addl:false, blocked:true}` (eng 185), so `secBp`/`blockCol` never renders additions<180/half-rate for the 45% block and `bpBlock` forces `halfAmt=depHalf=0`. Impact: an assessee with <180-day additions to a 45% block cannot enter them and loses the half-rate depreciation; the same for any additional depreciation on the 45% block in the old regime. PARTIAL coverage of the 45% block. (Rate-15/30/40 blocks are complete — half-rate and, in old regime, additional depreciation all present.)
- Correctly **not** built (hidden legacy P&M columns): 50%/60%/80%/100% blocks (DEP r8H–11H; corresponding DPM columns). DOA "Block Ceases to Exist Y/N" (r31H) helper not built — correct.

### Dropdowns
- None on this sheet other than numeric constraints. No gap.

### Conditional cascades (show/hide)
- **3a "Adjustment 2nd proviso s.115BAC (Rule 5)" row (DPM r9H/r11; DOA equivalent)**: opens only when the taxpayer is in the new regime. Ours: **reproduced** — `blockCol` renders the `AdjustmentSec115BAC` row only `if(isNew())` (sec 461); `bpBlock` applies `adj=isNew()?N(b.AdjustmentSec115BAC):0` (eng 120); export guards it with `if(isNew()&&…)` (exp 772). Match.
- **Additional-depreciation rows (12–14 / DPM r21–23)**: open in old regime, closed in new. Ours: **reproduced** — `addlOK = opts.addl!==false && !isNew()` (eng 116); renderer shows the three inputs in old regime and a `cell(0)`+"closed by section 115BAC" line in new (sec 474–480). Match — *except* they are never offered for the 45% block at all (see Missing fields).

### Regime open/close
- **Additional depreciation → 0 (A309)**: match (eng 116, chk 1002–1003).
- **45% block cannot claim depreciation (A310)**: match — `blocked = opts.blocked && isNew()` zeroes depFull/depHalf for r45 (eng 132, 185); warning at chk 1004–1005.
- **DPM 3a 115BAC WDV adjustment (second proviso, A620)**: applied in new regime only (eng 120). Match.

### Audit u/s
- None on this sheet.

### ITR-2 bleed / notes
- Depreciation schedules do not exist in ITR-2 at all; entirely ITR-3-built. Block rates correct: DPM 15/30/40/45; DOA Land (Nil), Building 5/10/40 (internal names DAOB5/DAOB10/DAOB100 — the "B100" is the utility's internal id for the **40%** building block, code maps it to `b40` correctly per DEP r17), Furniture 10, Intangible 25, Ships 20. WDV/full-rate/half-rate/net-aggregate/proportionate/WDV-last formulas match the utility (eng `bpBlock`).

### Verdict: **MINOR GAPS** — 45% block lacks half-rate & additional-depreciation inputs; all other blocks and both regime closures are correct.

---

## DEP_DCG  (section: bp — blocks ScheduleDEP, ScheduleDCG)

### Missing fields/rows
- All visible summary lines reproduced. DEP: 1a–1d P&M (15/30/40/45), 1e total P&M, 2a–2c building (5/10/40), 2d total, 3 furniture, 4 intangible, 5 ships, 6 total → BP 12i (eng 203–210, exp 815–828). DCG: same block layout, signed, total = deemed CG u/s 50 (eng 213–219, exp 830–844). Matches DEP_DCG.md.
- Hidden 50/60/80/100% summary rows (DEP r8H–11H, DCG r29H–32H) correctly **not** built.
- Note: `ScheduleDEP`/`ScheduleDCG` are emitted unconditionally (required objects) — correct.

### Dropdowns / Cascades / Audit
- None. DEP/DCG are pure roll-ups of DPM/DOA.

### Regime open/close
- Inherited from DPM/DOA (45% and additional-dep closures flow through). The 45% half-rate gap above propagates here (DEP 1d / DCG 1d would understate half-rate for a 45% block with <180-day additions).

### ITR-2 bleed / notes
- ITR-3-only; no bleed. `IF(Pro>0,Pro,NetAgg)` selection (eng 141) matches utility `H=IF(DPM..ProAgrdep>0,ProAgrdep,NetAgrdep)`.

### Verdict: **SOLID** (subject to the upstream DPM 45% half-rate gap).

---

## ESR  (section: bp — block ScheduleESR)

### Missing fields/rows
- All nine section rows present: 35(1)(i), (ii), (iia), (iii), (iv), 35(2AA), 35(2AB), 35CCC, 35CCD (ESR_ROWS lines 101–111; render sec 542–551). Columns (2) debited, (3) allowable, (4)=(3)−(2) floored at 0, and X Total reproduced (eng 166–177). Col (4) feeds BP item 28 (`_28=esr.totExcess`, eng 265). Shortfall (negative (3)−(2)) routed to BP 24e (eng 261). Matches ESR.md.

### Dropdowns / Cascades
- None.

### Regime open/close
- **Weighted deductions col-3 for 35(1)(ii)/(iia)/(iii)/35(2AA)/35CCC → 0 (A354)**: match — `if(isNew()&&r[3])allow=0` (eng 169), gated rows flagged `gatedZeroed`, renderer shows `cell(0)`+"closed by s.115BAC" (sec 544–546), warning at chk 1006. Gated set = ii/iii/iv/vi/viii (i.e. 35(1)(ii)/(iia)/(iii)/(2AA)/35CCC) per ESR_ROWS `gatedInNewRegime` flags — matches the REGIME spec.

### Audit u/s
- ESR note row 16: Schedule RA is mandatory if a deduction is claimed under 35(1)(ii)/(iia)/(iii)/35(2AA). Ours: **reproduced as a cross-schedule warning** (chk 1012–1013). Good.

### Verdict: **SOLID**.

---

## Unabsorbed Depreciation  (section: bp — block ITR3ScheduleUD)

### Missing fields/rows
- All columns present: (2) AY, (3) BF unabsorbed depreciation, (3a) 115BAC adjustment, (4) set off, (5) balance CF `=MAX(3−3a−4,0)`, (6) BF allowance u/s 35(4), (7) set off, (8) balance CF `=MAX(6−7,0)`, plus the current-AY 2026-27 row and totals (eng 222–238, render 566–595, exp 861–882). Matches Unabsorbed_Depreciation.md and utility H8/K8/H19/K19 formulas.
- Prior-year rows are a user array with add/delete; AY-mandatory, no-duplicate-AY and AY≤2025-26 validators present (chk 1024–1028). Good.

### Dropdowns / Cascades
- None (AY is free text with format validation).

### Regime open/close
- **Col (3a) 115BAC adjustment applies only in the new regime (A624)**: match — `adj=isNew()?N(r.AdjustAccTax115BACAmt):0` (eng 226); renderer shows the (3a) input only when new, else `cell(0)` (sec 574); old-regime warning if a value is present (chk 1009). Match.

### Audit u/s
- None.

### ITR-2 bleed / notes
- Unabsorbed depreciation carry (the s.35(4) allowance columns 6–8) is ITR-3-specific — built, no bleed.

### Verdict: **SOLID**.

---

## ICDS  (section: bp — block ScheduleICDS)

### Missing fields/rows
- All ten ICDS rows (I–X) present with Increase/Decrease/Net columns and XI Total (ICDS_ROWS lines 89–100; eng 152–163; render 599–617). Total increase → BP 25, total decrease → BP 32 (eng 265–266). `Net=Increase−Decrease`, totals floored at 0 for the positive parts, signed net — matches ICDS.md and utility H6/F16/G16/H16.
- Hidden negative-total helper row 17H correctly not built.

### Dropdowns / Cascades / Audit / Regime
- None on this sheet.

### ITR-2 bleed / notes
- No bleed. On import, the code correctly strips the ICDS schedule contribution back out of BP 25/32 to avoid double counting on recompute (imp 937–941) — a genuinely careful round-trip handling.

### Verdict: **SOLID**.

---

## GROUP SUMMARY

| Metric | Count |
|---|---|
| Missing fields/rows | **2** (BP `PLUs44sChapXIIG` not user-settable / not imported; DPM 45% block missing half-rate + additional-depreciation rows) |
| Missing cascades | **0** (BP has no Yes/No cascades; all show/hide is regime-driven and reproduced) |
| Missing dropdown values | **0** (35AD(5) clause list complete, all 13 values) |
| Regime mismatches | **0** (35AD, additional dep, 45% block, ESR col-3, UD 3a, DPM 3a — all match) |
| Audit gaps (within owned sheets) | **0** (the 44AD(4)/44AB trigger is not on any G3 sheet — it lives on Part A-General/who and P&L/bpa; flagged for those groups) |

### Three most serious items
1. **BP `PLUs44sChapXIIG` is a required schema leaf that cannot be filled and is not imported** — hard-wired to 0 in export (exp 640), no `secBp` input, no `impBp` line. Blocks Chapter-XII-G / 44-group disclosure and is a latent round-trip (rule 12) failure. Small fix.
2. **DPM 45% plant-&-machinery block omits half-rate (<180-day additions) and additional-depreciation rows** that the utility computes live (I16–I24). A 45% block with late-year additions is under-depreciated and the entries can't be made. PARTIAL coverage.
3. **44AD(4) audit-liability cascade is absent from all G3 sheets by design** — it belongs to groups **who** (Part A-General `LiableSec44ABflg`) and **bpa** (P&L/Nature of Business presumptive computation). Not a G3 defect, but the CEO's focus item must be routed there and verified; BP only consumes the presumptive results, which it does correctly.
