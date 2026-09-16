# ITR-3 audit — G8_other_schedules

Audit of the six sections that own the "other schedules" of ITR-3 A.Y. 2026-27,
against the CBDT Excel utility (`sources/ITR-3/utility/`). Read-only; no file
other than this report was touched.

Sheets audited: **EI, FSI, TR_FA (Schedule TR + Schedule FA), AL, PTI, Sch 5A,
ESOP, IT, TDS, Verification** → sections `ei`, `fa`, `al`, `other`, `paid`, `bank`.

Headline: every sheet is faithfully reproduced. All 10 Schedule FA tables exist,
the AL twin-threshold cascade is encoded, all four TDS/TCS sub-tables are built,
and Sch 5A carries both audit flags. No missing fields, no missing cascades, no
missing dropdown values, no regime mismatches, no audit gaps were found. The
findings below are confined to cosmetics and one cross-pass timing dependency.

---

## EI  (section: ei)  —  `70_sec_ei.js`

### Missing fields/rows
- None. Live rows r4 (Interest), r7–r13 (agri working + land table), r21–r27
  (other exempt), r30–r37 (DTAA), r38 (PTI pass-through), r39 (total) are all present.

### Dropdowns
- None missing. Category enum = 9 codes (`AGRI,GOVC,ISI,SSRA,SRSC,SRST,SRPC,OTH,OTHN`)
  and SubCategory = 63 codes — matches `enums.json` (`ScheduleEI.OthersInc.OthersIncDtls[].Category`=9,
  `.SubCategory`=63) exactly. Note: the utility's *display* dropdown F23 shows only 8
  categories (no `OTHN`) and G23 shows 56 sub-items, but the **schema enum** (authoritative
  per CLAUDE.md "three sources agree") carries 9/63 and the code follows it. Correct, not a gap.
- DTAA head-of-income (5), TRC (Y/N), country code list all present.

### Conditional cascades (show/hide)
- FLAG net agri income > ₹5 lakh [J11/r13]: set→opens land table 2(vi) [r14–r19];
  clear→hides it. Ours: reproduced YES — `engEi` sets `C.needLand = net2v > 500000`
  and `secEi` renders the land grid only inside `if(C.needLand)`; `chkEi` makes the
  land rows mandatory above the threshold (line 325).

### Regime open/close
- Nothing on EI is a 115BAC concession. Excel new=open, old=open. Ours: `engEi`
  reads `isNew()` but applies no closure (header + line 63). Match.

### Audit u/s
- None on this sheet.

### ITR-2 bleed / notes
- Hidden legacy rows correctly excluded per EI.md §"Hidden rows — not built":
  r5H Dividend (10(34) repealed), r6H LTCG-STT (10(38) repealed), r12H share-in-firm.
  The J39/N38 total formula still names `DividendInc`, but that field is always 0
  (permanently hidden), so `engEi`'s total `interest + net2v + Others + dtaaTotal + passThr`
  is arithmetically identical. No impact.

### Verdict: SOLID — full coverage; hidden legacy rows correctly excluded.

---

## FSI · TR · FA  (section: fa)  —  `70_sec_fa.js`

### Missing fields/rows
- None. **Schedule FSI**: per-country block (Country Code, TIN, section 90/90A/91)
  with the five head rows (Salary/HP/Business/CG/OS) each carrying (b) income,
  (c) tax paid, (d) tax payable, (e)=MIN(c,d), (f) DTAA article, plus the country
  total row — matches FSI r5–r12 exactly (`[L7]=MIN(J7,K7)`, `[I12..L12]=SUM`).
- **Schedule TR**: per-country table (code, TIN, (c) taxes paid, (d) relief,
  (e) section) + total [G11/H11], J13 DTAA relief `MAX(total−notDTAA,0)`, J14
  section-91 relief `SUMIF("91")`, and the refund block (r15 flag, r16a amount,
  r16b AY). All present (`C.dtaa`, `C.notDtaa`, `trFlag/trAmt/trAY`).
- **Schedule FA — all 10 tables verified present with full column sets**:
  A1 Depository (r22), A2 Custodial (r36-37, incl. Nature+Amount 11a/11b),
  A3 Equity/Debt (r50), A4 Cash-value Insurance (r64), B Financial Interest (r79-80),
  C Immovable (r94-95), D Other Capital Asset (r109-110), E Signing-authority (r125-126),
  F Trusts (r140-141, all trustee/settlor/beneficiary name+address pairs),
  G Other income (r152-153). Every column (incl. "Schedule where offered" + "Item number
  of schedule" + taxable-flag) is mapped in `secFa`/`expFa`/`impFa`.

### Dropdowns
- None missing. Owner/status (OWNER/BENEFICIAL_OWNER/BENIFICIARY), nature-of-interest
  (DIRECT/…), A2 nature-of-amount (I/D/S/O/N), where-offered (SA/HP/BU/CG/OS/EI/NI),
  taxable Y/N, relief section (90/90A/91), refund YES/NO, full country list — all present.

### Conditional cascades (show/hide)
- FLAG residential status = NRI: set→closes FSI, TR **and** FA entirely; clear→opens.
  Ours: reproduced YES — `secFa` returns the "not applicable" note when `res==="NRI"`;
  `engFa`/`expFa` bail out; `chkFa` errors if foreign data present under NRI.
- FLAG residential status = RNOR (NOR): FA closes but FSI/TR stay open. Ours: reproduced
  YES — FA sub-section rendered only when `res==="RES"` (line 172); FSI/TR run for RES+NOR
  (`fsiOn = res==="RES"||res==="NOR"`); `chkFa` errors on FA rows under NOR (line 543).
- FLAG TR refund = YES [r15]: set→opens 4a amount + 4b AY; clear→hides. Ours: reproduced
  YES (`if(S.fa.trFlag==="YES")` in `secFa`, lines 163–166).
- Per-country: a block with figures but no Country Code is ignored (E5 note) — reproduced
  (`expFa` skips `if(!cr.code)`, `chkFa` warns).

### Regime open/close
- FSI/TR/FA are not 115BAC concessions (REGIME.md: "foreign assets" stays open).
  Excel new=open, old=open. Ours: no `isNew()` closure. Match.

### Audit u/s
- None on these sheets.

### ITR-2 bleed / notes
- Cosmetic only: the Schedule TR line-3 hint reads "sum of (d) wherever section 91"
  (`70_sec_fa.js:160`) — it should read relief (e). The computed value `C.notDtaa`
  is correct (`SUMIF(section=91, relief)`), so this is a label typo, not a math error.

### Verdict: SOLID — all 10 FA tables and both residence cascades reproduced.

---

## AL  (section: al)  —  `70_sec_al.js`

### Missing fields/rows
- None. Part A immovable table (r4–r11: Description + 9-field address + Amount),
  Part B eight movable lines (r16–r24: (i)(ii)(iii) + (iv)(a–e)), Part C firm/AOP
  table (r25–r31: Name + address + PAN + investment), Part D liability (r34) — all present.

### Dropdowns
- None missing. StateCode (38 incl. 99-Foreign), CountryCode (250), Part A Yes/No [J4],
  Part C Y/N [M25] all present.

### Conditional cascades (show/hide)
- FLAG "Do you own any immovable asset?" [J4]: set(Yes)→opens the immovable rows;
  clear(No)→hides and Part A not written. Ours: reproduced YES — `secAl`
  renders the immovable blocks only inside `if(A.ownImm==="Yes")` (line 210); `expAl`
  writes `ImmovableDetails` only on Yes.
- FLAG interest-in-firm/AOP [M25]: set(Y)→opens firm/AOP rows; clear(N)→hides.
  Ours: reproduced YES — `secAl` line 246, `expAl` writes `InterestHeldInaAsset` only on Y.
- FLAG address country = India(91) vs foreign: opens Pin vs Zip. Ours: reproduced —
  `alAddrRows` shows Pin for 91 else Zip; `alRowAddrChecks` enforces the VBA Pin/Zip
  and State↔Country mapping rules.

### Regime open/close
- Schedule AL stays open in both regimes (REGIME.md names AL explicitly). Excel new=open,
  old=open. Ours: `engAl` reads `isNew()` with no closure (line 130). Match.

### Threshold cascade (the >1cr ask)
- Applicability correctly split: **rules.json n=905 = "Total Income > ₹1 crore ⇒ AL required"**
  and the **VBA prompt `TotalIncome_PARTBTI > 5000000`** (₹50 lakh). Both encoded:
  `secAl` shows a "required" form-note at TI>1cr (line 204) and a "please complete" warn at
  TI>50L (line 205); `chkAl` makes the two flags mandatory once `TI>5000000` (`applic50`,
  lines 382–387); `expAl` emits the block when applicable or filled (line 283).

### Audit u/s
- None on this sheet.

### ITR-2 bleed / notes
- Timing note (minor): the threshold reads `S.C.ti`, which is written by the tax section
  (`70_sec_tax.js:274`, order 90) and read by AL at order 30. On the recompute loop the
  prior-pass total income is used; `90_wiring.js:18` seeds `S.C.ti||0`. Advisory notes/flags
  therefore settle after one recompute pass (standard cross-schedule pattern, not a defect).

### Verdict: SOLID — twin ₹1cr/₹50L threshold and both Yes/No cascades reproduced.

---

## Sch 5A · PTI · ESOP  (section: other)  —  `70_sec_other.js`

### Missing fields/rows
- **Sch 5A**: Name (D4), PAN (D5), Aadhaar (D6), 44AB flag (D7), 92E flag (D8),
  four head rows HP/BP/CG/OS each with (ii) receipts / (iii) spouse share /
  (iv) TDS / (v) TDS-to-spouse, and the Total row [I14..L14] — all present.
- **PTI**: per-block section-covered (2), name (3), PAN (4); head table HP(i),
  CG-ST (a: 111A ai / others aii), CG-LT (b: 112A bi / other bii), OS (dividend a / others b),
  exempt (iv: 10(23FBB) a, u/s b, u/s c) with income(7)/loss(8)/net 9=7−8/TDS(10) and
  every aggregate subtotal — all present and the aggregation formulas match (L7=L8+L9, etc.).
- **ESOP**: employer PAN (C4), DPIIT no. (C5), the six AY rows 2021-22…2026-27 with
  cols 3 (b/f) / 4i (sold type) / 4ii (total) / 5 (ceased) / 5i (date) / 7 (payable) /
  8 (balance=3−7); plus the sale sub-table (AY/date/amount) feeding col 4ii. All present.

### Dropdowns
- PTI "Investment covered by section" [E5]: schema enum A=115UA, B=115UB, C=115U —
  `OTH_PTIKIND` matches the book map (PTI.md:88) exactly. Utility display order differs
  (115U/115UA/115UB) but all three labels present; stored code is what matters.
- ESOP sold-type [G8]: FS/PS/NS (Fully/Partly/Not sold) ✓; ceased [I8] Y/N ✓;
  sale-AY [E18] 2021-22…2025-26 ✓. Sch 5A audit flags Y/N ✓.

### Conditional cascades (show/hide)
- FLAG "governed by Portuguese Civil Code (s.5A)": set(Yes)→opens the whole Sch 5A block;
  clear(No)→hides and it is not filed. Ours: reproduced YES — `secOther` gates the block
  on `oth_s5a()` (reads `S.pi.s5a==="Yes"` from the "who" section); `expOther` writes
  `Schedule5A2014` only when `oth_s5a()`; `chkOther` errors if 5A filled while flag≠Yes.
- ESOP col-6 "48 months expired" [K]: a condition column with **no schema leaf** (ESOP.md:50).
  For 2021-22 the 48 months are auto-expired so [L8]=whole b/f. Ours: reproduced — `esopYear`
  hard-codes `l=bf` for 2021-22 (line 128); no separate input built. Correct.
- ESOP sold/ceased drive col-7 [L9] nested-IF: reproduced faithfully in `esopYear`
  (FS⇒b/f; PS&ceased⇒b/f; PS&not-ceased⇒SUMIF; NS&not-ceased⇒0; else⇒h||b/f), lines 128–137.

### Regime open/close
- None of Sch 5A / PTI / ESOP is regime-gated. Excel new=open, old=open. Ours: no closure. Match.

### Audit u/s
- Sch 5A carries the two audit flags: spouse books audited **u/s 44AB** [D7] →
  `other.s5a.aud44ab` (`BooksSpouse44ABFlg`), and spouse liable/partner **u/s 92E** [D8] →
  `other.s5a.aud92e` (`BooksSpouse92EFlg`). Both present (secOther lines 173–176; expOther 334–335).

### ITR-2 bleed / notes
- PTI's "Section 115U" option is the ITR-3 addition over the 115UA/115UB-only case
  (PTI.md:124) and is present — no ITR-2 bleed. ESOP and Sch 5A are ITR-3-native and built
  from their own sheets.

### Verdict: SOLID — 5A (with both audit flags), PTI (all heads + 115U), ESOP (full 6-year + sale table).

---

## IT · TDS · TCS  (section: paid)  —  `70_sec_paid.js`

### Missing fields/rows
- **TDS 1 (17B)** salary: TAN, employer name, income chargeable, total TDS + totals — present.
- **TDS 2 (17C1)** non-salary by TAN: self/other, other-PAN, other-Aadhaar, TAN, section,
  FY, b/f, deducted own, deducted-other (income+TDS), claimed own, claimed-other
  (income+TDS+PAN+Aadhaar), gross, head, carried-forward `W23=MAX(0,b/f+ded−claim)` — all present.
- **TDS 3 (18C2)** by buyer/tenant PAN (16B/16C/16D/16E): same shape but buyer/tenant
  **PAN + Aadhaar** in place of TAN — present; this is the **26QB (194IA sale) / 26QC (194IB rent)
  / 16D (194M) / 16E (194S)** table. Correct split from TDS 2.
- **Schedule TCS (15C)** new format: self/other, collector TAN, other-PAN, FY, b/f,
  collected own/other, claimed own/other (TCS+PAN), carried-forward `O67=MAX(0,…)` — present.
- **Schedule IT (17A)**: BSR, date, serial, amount; advance vs self-assessment split by
  challan date (`isSAT: d>YREND` = on/after 1 Apr 2026), matching `T7`/`R31`/`T31` — present.

### Dropdowns
- TDS section list [I23/J38]: 60 codes — `TDSSEC_PAID` has exactly 60, matching
  TDS_Section_List_1. FY lists: TDS2/TDS3 = 17 years (2024-25…2008-09) ✓; TCS = 17
  bare years (2024…2008) ✓. Head-of-income: **TDS 2 has 6 (incl. NA for 194N), TDS 3 has 5
  (NA dropped)** — matches the utility (V23:V26 n=7=Select+6; W38 n=6=Select+5). ✓

### Conditional cascades (show/hide)
- FLAG "TDS credit relating to = Other Person" [E20/E35]: set(O)→other-person PAN/Aadhaar
  become mandatory. Ours: reproduced — `chkPaid.needOth` errors when `who="O"` without
  PAN/Aadhaar (lines 298–301). Same for TCS `who="2"`.
- Over-claim guard: `claimed > available` holds carry-forward at 0 and warns
  (`_over` in `engPaid`; `chkPaid.over`). Matches `MAX(0,…)`.

### Regime open/close
- "Taxes paid" stays open in both regimes. Excel new=open, old=open. Ours: no closure. Match.

### Audit u/s
- None on these sheets.

### ITR-2 bleed / notes
- The hidden legacy **17D TCS block** (TDS r48H–r61H, old collector-name format) is
  correctly **not built** — only the live Schedule TCS 15C (r63–r75) is. No bleed.
- Section dropdown displays the code rather than the long label (UI choice); the stored
  `TDSSection` enum code is exported, so functionally correct.

### Verdict: SOLID — all four sub-tables (salary/non-salary/26QB-26QC/TCS) + IT date-split built; 17D legacy correctly excluded.

---

## Verification  (section: bank)  —  `70_sec_bank.js`

### Missing fields/rows
- Bank accounts (refund + all): IFSC, bank name, account no., type, refund tick — present
  (exported to `PartB_TTI.Refund.BankAccountDtls.AddtnlBankDetails`, `BankDtlsFlag`).
- Verification (r4–r9): full name (C4), son/daughter-of (I4), capacity (I6), PAN (C7/G7),
  Place (H9), Date (J9) — all present. TRP block (id, name, reimbursement) — present.

### Dropdowns
- Capacity [I6]: Self/Representative/Karta/Authorised Signatory — `VCAP` has all 4 (S/R/K/A). ✓
- Account type: SB/CA/CC/OD/NRO/CGAS/OTH present.

### Conditional cascades (show/hide)
- FLAG capacity = Representative [I6=R]: requires the Part A representative flag = Yes.
  Ours: reproduced — `chkBank` errors when `cap="R"` and `S.fs.rep≠"Y"` (rules.json #45,
  line 215), plus the #40 rep-PAN warning. Refund tick drives `UseForRefund`.

### Regime open/close
- Verification/TRP/bank are regime-invariant. Excel new=open, old=open. Ours: no closure. Match.

### Audit u/s
- None on this sheet.

### ITR-2 bleed / notes
- Hidden r8H ("critical assumptions specified in the agreement…", APA/rule-10 case) is
  correctly **not built**. Encodes rule #60/#3275 (verification PAN ≠ 80G/80GGA donee PAN).

### Verdict: SOLID — full verification block, capacity enum, TRP and refund accounts present.

---

## GROUP SUMMARY

| Metric | Count |
|---|---|
| Missing fields/rows | 0 |
| Missing cascades | 0 |
| Missing dropdown values | 0 |
| Regime mismatches | 0 |
| Audit gaps | 0 |

All ten sheets in this group are reproduced completely and correctly. The three
most serious items are all minor:

1. **[cosmetic] Schedule TR line-3 hint typo** (`70_sec_fa.js:160`): reads "sum of (d)
   wherever section 91"; should say relief (e). The computed `C.notDtaa` is correct — label only.
2. **[timing, benign] Schedule AL threshold reads `S.C.ti`** written later (tax section,
   order 90) than AL runs (order 30); the >1cr/>50L notes/flags settle after one recompute
   pass. Seeded `||0` in wiring; standard cross-schedule pattern, no wrong output at rest.
3. **[documentation, not a defect] EI Category/SubCategory follow the schema enum (9/63)**,
   which is broader than the utility's display dropdown (8/56, no `OTHN`). Per the
   "three-sources-agree / schema authoritative" rule this is correct and more complete.

No structural gaps, no ITR-2 bleed, no missing conditional cascades, and no regime
mis-gating were found across EI, FSI, TR, FA, AL, PTI, Sch 5A, ESOP, IT, TDS, TCS,
Verification. Group verdict: **SOLID.**
