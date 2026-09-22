# G2 — Business books (section `bpa`) audit — ITR-3 A.Y. 2026-27

Auditor group: **G2_business_books**. Sheets owned: Nature Of Business, Part A - BS,
Manufacturing Account, Trading Account, Profit and Loss, Part A - OI, Quantitative
Details, GST. All map to section `bpa` (`forms/ITR-3/src/70_sec_bpa.js`), except the
Nature-of-business schema key and the audit-u/s block, which live in `PartA_GEN2`
and are exported by section `who` (`forms/ITR-3/src/70_sec_who.js`) with its face
rendered by section `ret` (`forms/ITR-3/src/70_sec_ret.js`).

**Headline:** the eight accounting sheets themselves are covered to the row. The one
MAJOR problem is the **tax-audit cascade** the CEO worried about — and it is not where
the contract said to look. It is **not on Part A-OI at all**; it sits on PART A-General,
and there the 44AB=Yes reveal is built only halfway: **UDIN, auditor membership number,
auditor-signing name, firm registration number and the date of the audit report are
missing**, so a genuine 44AB tax-audit return cannot be validly filed. There is also a
duplicate Nature-of-business widget/writer (ITR-2 bleed).

---

## Nature Of Business  (section: bpa → PartA_GEN2.NatOfBus)
### Missing fields/rows
- None on the table itself. Code/TradeName1/Description all present (`70_sec_bpa.js:283-286`).
### Dropdowns
- `E5:E7` Code: Excel `sheet11` NatureOfBusiness list has 357 live entries; our `BPA_NOB`
  has **357** — exact match. Good.
### Conditional cascades (show/hide)
- The sheet's helper columns `N3/O3/O4/P4` (`Nature Of Business` r3-r4) compute the 44AB
  audit-liability code from `LiableSec44ABflg`, the 44AD income (`sheet11.Section44AD`) and
  turnover thresholds (₹2 cr / 5% cash). This is audit-determination logic, not a rendered
  cascade; our `chk` reproduces the turnover-cap warnings only (see Audit u/s below).
  Ours: PARTIAL — the code is not auto-derived, but that is a General-sheet concern.
### Regime open/close
- None. Nature of business is regime-neutral; no `isNew()` gate needed. Match.
### Audit u/s
- Indirect only (drives 44AB determination, above).
### ITR-2 bleed / notes
- **DUPLICATE UI + DUPLICATE WRITER (rule 11).** Nature of business is rendered **twice**:
  - `ret` screen: a **free-text** 5-char Code box (`70_sec_ret.js:354-358`, `grid("nob",…)` over `S.nob`).
  - `bpa` screen: the **full 357-entry dropdown** (`70_sec_bpa.js:283-286`, `grid("bpa.nob",…)` over `S.bpa.nob`).
  Both serialise the **same** schema key `PartA_GEN2.NatOfBus.NatureOfBusiness`:
  `expWho` from `S.nob` (`70_sec_who.js:305-307`, compute order 5) and `expBpa` from
  `S.bpa.nob` (`70_sec_bpa.js:830-831`, order 20 — runs last, so it wins). On import both
  `S.nob` and `S.bpa.nob` are filled (`70_sec_who.js:435-436`, `70_sec_bpa.js:857`), so a
  round-tripped return shows the **same business in two different widgets**, and a business
  typed in both screens loses the `ret` copy on export. The `ret` free-text version is the
  ITR-2-style artifact; the `bpa` dropdown is the one built from ITR-3's own sheet.
- **Row cap not enforced.** Utility exposes only 3 rows (r5-r7, "indicate the three main
  activities"); both our grids are unlimited. Minor.
### Verdict: MINOR GAPS — table is complete, but the double widget/writer must be resolved to one owner.

---

## Part A - BS  (section: bpa → PARTA_BS)
### Missing fields/rows
- None among the live rows. Full sources/application tree present (`70_sec_bpa.js:591-672`).
### Dropdowns
- None on this sheet.
### Conditional cascades (show/hide)
- **Hidden row `79H` "Provision for Wealth Tax" (iiB)** — correctly excluded (rule 1).
  Excel total `L82 = J78+J80+J81` skips J79; our `prov` = ITProvision + ELSuperAnnGrat +
  OthProvision (`70_sec_bpa.js:217`) matches exactly. Good.
- Regular-books BS vs **NO ACCOUNT CASE** (r90-94, 6a-6d): the utility shows **both**
  blocks unconditionally; the books/no-books switch itself is the 44AA flag on PART A-General,
  not a BS-sheet flag. Our fold renders the full BS plus the 6a-6d no-account rows
  (`70_sec_bpa.js:666-670`). Ours: reproduced — YES.
### Regime open/close
- None. Balance-sheet figures are identical in both regimes. Match.
### Audit u/s
- Balance rule A52 (sources must equal application, `vbCritical`) reproduced as an error in
  `chkBpa` (`70_sec_bpa.js:875-876`). Good.
### ITR-2 bleed / notes
- ITR-2 has no Part A-BS at all; this block is built from ITR-3's own sheet. No bleed seen.
### Verdict: SOLID.

---

## Manufacturing Account  (section: bpa → ManufacturingAccount)
### Missing fields/rows
- None. Items 1A-1F (opening inventory, purchases, direct wages, direct expenses Di-Diii,
  factory overheads Ei-Evii incl. `DeprctnOfFactoryMachinery`→BP Sl.11), 2 (closing stock),
  3 (cost of goods produced) all present (`70_sec_bpa.js:289-315`, eng `76-87`). 26 sheet rows,
  all computed items covered.
### Dropdowns / Cascades / Regime / Audit
- None on this sheet. Cost-of-goods-produced (item 3) cross-feeds Trading item 11 correctly
  (`70_sec_bpa.js:106`). No hidden rows.
### Verdict: SOLID.

---

## Trading Account  (section: bpa → TradingAccount)
### Missing fields/rows
- None. Revenue 4A(i-iv), 4B, 4C(i-ix) duties, 4D, item 5 closing stock, credits total,
  6/7 opening/purchases, 8 direct expenses (with 9i-9iii grid), 10(i-xii) duties on purchases,
  11 cost-from-mfg, 12 gross profit, and 12a-12d intraday/F&O all present
  (`70_sec_bpa.js:317-368`).
### Dropdowns
- None on this sheet.
### Conditional cascades (show/hide)
- No hidden rows. GP formula (r56 `credits − 6 − 7 − 8 − 10xii − 11`) matches eng
  (`70_sec_bpa.js:107`). 12b≤12a and 12d≤12c enforced in `chk` (`878-881`). Good.
### Regime open/close
- None. Match.
### Audit u/s / ITR-2 bleed
- Intraday/F&O rows (12a-12d) are ITR-3-specific and present; not ported from ITR-2. Clean.
### Verdict: SOLID.

---

## Profit and Loss  (section: bpa → PARTA_PL)
### Missing fields/rows
- None across 13-66. Credits 13-15 (incl. 14i-14xii and the 14xi(a-c) sub-block), debits
  16-53 (employee comp 22, insurance 23, commission/royalty/professional trip blocks 30-32,
  rates & taxes 44, bad debts 47 with PAN and no-PAN grids, PBIDTA 50, interest 51, dep 52,
  PBT 53), appropriations 54-60, presumptive 61-63, no-books 64, speculative 65, non-resident
  66 — all present (`70_sec_bpa.js:407-588`).
### Dropdowns
- `J47` comp-to-non-residents Yes/No → present (`BPA_YN`, line 451).
- `H143` 44AD codes: Excel 315 / our `BPA_CODEAD` **315** — match.
- `H156` 44ADA codes: Excel 38 / our `BPA_CODEADA` **38** — match.
- `H167` 44AE codes: Excel 7 / our `BPA_CODEAE` **7** — match.
- `H172` Owned/Leased/Hired → present.
- Bad-debt state/country (`M117/N117`) → `BPA_BDSTATE`/`BPA_BDCTRY` present.
- Non-resident section 66: 44B/44BB/44BBA/44BBC/44BBD (r208-212) → all five present (`582`).
### Conditional cascades (show/hide)
- Hidden row `17H` "Liabilities written back" (14xi a) — built (`424`). Good (conditional-reveal, rule 1 built-form).
- Hidden row `170H` serial for 44AE — auto-indexed grid. Good.
- 44AE presumptive `V172=I172*J172*1000 / W172=J172*7500` reproduced per-carriage (`157-159`). Good.
- **Presumptive-code → income-mandatory cascade** (utility note r153/r164/r185): selecting a
  44AD/44ADA/44AE code makes that section's income mandatory — reproduced in `chk`
  (`887-892`). Turnover caps (44AD ₹3cr, 44ADA ₹75L, 44AE 120 months / >10 carriages) also in
  `chk` (`894-902`). Ours: reproduced — YES.
- 22xii "compensation paid to non-residents?" → amount (22xiib): both rows always shown
  (`451-452`); utility also keeps the amount visible. Ours: OK / PARTIAL (no hide-on-No, but harmless).
### Regime open/close
- None. All P&L / presumptive figures are regime-neutral (they feed Schedule BP, where
  the concessions close). No `isNew()` gate here — correct per REGIME.md and the section header.
### Audit u/s
- The presumptive turnover-cap warnings above are the on-sheet audit triggers; present.
- Note: whether 44AB is triggered from these figures is decided on PART A-General (see below).
### ITR-2 bleed / notes
- Speculative (65) and non-resident 44B-family (66) are ITR-3-only and present. No ITR-2 numbering bleed.
### Verdict: SOLID.

---

## Part A - OI  (section: bpa → PARTA_OI)
### Missing fields/rows
- None. Method of accounting (r4), change flag (r5), 3a/3b ICDS/145(2) deviation, 4a-4e stock
  valuation, 5a-5f, 6a-6s (s36), 7a-7j (s37), 8Aa-8Aj + 8B (s40), 9a-9f (s40A), 10a-10i (s43B
  prior-year now-allowed), 11a-11i (s43B this-year disallowed), 12a-12i credit outstanding,
  13/13a/13b (33AB/33ABA), 14 (s41), 15 (prior period), 16 (14A), 17 (MSMED s23), 18 (92CE(2A))
  — all present (`70_sec_bpa.js:676-782`). **No hidden rows on this sheet.**
### Dropdowns
- Method of accounting `L4` Mercantile/Cash → present (`678`).
- Change-in-method `L5`, stock-valuation change `L11`, 92CE `L112` Yes/No → present.
- Raw/finished valuation `L9/L10` {1 cost-or-market, 2 cost, 3 market} → present (`683-684`).
### Conditional cascades (show/hide)
- None on this sheet (no `H` rows). 145A/ICDS 3a/3b feed from Schedule ICDS (hint noted).
### Regime open/close
- None. Match.
### Audit u/s — **CONTRACT PREMISE IS WRONG HERE (important)**
- The contract states Part A-OI "carries the audit-u/s block: … liable to maintain books
  u/s 44AA, liable to audit u/s 44AB, audit report / auditor / UDIN / date, 92E". **It does
  not.** Verified against the dump: Part A-OI runs items 1-18 and ends at **item 18 =
  section 92CE(2A) → Schedule TPSA** (`r112`), which we build (`70_sec_bpa.js:780`, warned in
  `chk` `908-909`). There is **no** 44AA/44AB/auditor/UDIN/92E content anywhere on Part A-OI.
- That entire audit-u/s block lives on **PART A - General → "AUDIT INFORMATION"**, exported by
  section `who` (`PartA_GEN2.AuditInfo`) and rendered by section `ret`. See the cross-reference
  finding below — it is the CEO's actual concern and it has a real gap.
### ITR-2 bleed / notes
- ITR-2 has no Part A-OI; this is built from ITR-3's sheet. No bleed on the sheet itself.
### Verdict: SOLID (as a sheet) — but see the audit-cascade gap on PART A-General.

---

## Quantitative Details  (section: bpa → PARTA_QD)
### Missing fields/rows
- None. (a) trading-concern table, (b) raw-material table (with consumption/yield/%yield),
  (c) finished/by-product table — all present with the required columns (`70_sec_bpa.js:384-392`).
### Dropdowns
- Unit of measure `E7:E10/E17:E20/E27:E30`: Excel 23 units → our `BPA_UNIT` 23 codes match on
  code. (Labels differ cosmetically, e.g. "103-Litre" vs "Litre"; only the code is exported.) Good.
### Cascades / Regime
- No hidden rows; mandatory only if 44AB (note rendered `383`). Regime-neutral.
### Audit u/s
- Correctly flagged "mandatory if liable to audit u/s 44AB" (fold label + note). Good.
### Verdict: SOLID.

---

## GST  (section: bpa → ScheduleGST)
### Missing fields/rows
- None. GSTIN No. + Annual value of outward supplies per GST return (`70_sec_bpa.js:399`).
### Dropdowns / Cascades / Regime / Audit
- None. Row cap: utility shows 3 GSTIN rows; our grid is unlimited (note says "per GSTIN
  separately", so multiple is expected). Minor.
### Verdict: SOLID.

---

## CROSS-REFERENCE — Audit-u/s cascade on PART A-General (the CEO's real concern)
*Not one of my eight sheets (owned by section `who`/`ret`), but it is the audit block the
contract asked me to focus on, and the contract mislocated it to Part A-OI. Surfacing it here.*

The utility's "AUDIT INFORMATION" block (`PART A - General` r151-193) opens, when
**b·"liable for audit u/s 44AB" = Yes** and **c·"audited by an accountant" = Yes**, this set
(the `H` rows are the conditional-reveal cascade):

| Excel row | Field | In our software? |
|---|---|---|
| G162 | Date of **furnishing** of audit report | YES (`ret:320` `aud.repDate`) |
| N163 | Ack number of audit report | YES (`ret:321` `aud.repAck`) |
| **164H (G164)** | **Name of the auditor signing the tax audit report** | **NO** |
| **165H (G165)** | **Membership no. of the auditor** | **NO** |
| 166 (G166) | Name of the auditor (proprietorship/firm) | YES (`ret:322` `aud.frmName`) |
| **167H (N167)** | **Proprietorship/firm registration number** | **NO** |
| 168 (G168) | PAN of proprietorship/firm | YES (`ret:323`) |
| 169 (G169) | Aadhaar of proprietorship | YES (`ret:324`) |
| **170H (G170)** | **Date of audit report** (distinct from furnishing date) | **NO** |
| 171H (N171) | Ack number of audit report | partial — only one ack (`N163`) captured |
| **172H (N172)** | **UDIN** | **NO** |

The 44AA cascade (a1, a2, a2i turnover band → a2ii/a2iii cash %), the 44AB liability + condition,
the 92E block (d(i)/(ii) + date/ack), the "other audit reports" (d(iii)) grid and the "other Act"
grid are all reproduced (`70_sec_ret.js:305-350`). But five accountant-audit fields —
**auditor-signing name, membership number, firm registration number, date of audit report, and
UDIN** — are absent.

**Root cause:** `books/ITR-3/PART_A_General.md` instructs "Build only the 106 visible rows; keep
the 61 hidden rows unbuilt" and lists r164/165/167/170/171/172 among the *hidden* rows. But
these are **conditional-reveal** rows (they unhide precisely on 44AB=Yes + audited=Yes), i.e. the
audit cascade — exactly the class the contract says "counts as a field we must have" and the
constitution's rule 1 says to build when the utility unhides it on demand. A 44AB tax-audit
return is **rejected by the e-filing schema without UDIN and the auditor's membership number**,
so this is a fileability defect for every audited business — the highest-value ITR-3 filer.

**Owner to fix:** the `who`/`ret` group (add `AudSignName`/`MembNoOfAudit`/`FrmRegNum`/
`DateAuditReport`/`UDIN` under `PartA_GEN2.AuditInfo`, gated on `sec44AB==="Y" && acctFlg==="Y"`).

---

## GROUP SUMMARY
- **Sheets audited (8):** Nature Of Business, Part A - BS, Manufacturing Account, Trading
  Account, Profit and Loss, Part A - OI, Quantitative Details, GST.
- **Missing fields:** **5** — all in the 44AB audit cascade on PART A-General
  (auditor-signing name, membership no, firm registration no, date of audit report, UDIN).
  0 missing on the eight `bpa` sheets themselves.
- **Missing cascades:** **1** — the 44AB "audited by accountant = Yes" reveal is only partially
  built (5 of ~9 revealed fields absent). (Plus 1 structural: Nature-of-business duplicate writer.)
- **Missing dropdown values:** **0** — NOB 357, CodeAD 315, CodeADA 38, CodeAE 7, units 23,
  states/countries, non-resident sections — all match exactly.
- **Regime mismatches:** **0** — every `bpa` sheet is regime-neutral; no `isNew()` gate is
  required and none is applied. Correct per REGIME.md.
- **Audit gaps:** **1 cascade / 5 fields** (UDIN, membership no, auditor-signing name, firm reg
  no, date of audit report) — on PART A-General, misattributed by the contract to Part A-OI.

### 3 most serious items
1. **Tax-audit cascade incomplete — UDIN + auditor membership number (and signing name, firm
   reg no, audit-report date) not built.** 44AB=Yes → audited=Yes reveal in
   `70_sec_ret.js:316-325` stops at firm name/PAN/Aadhaar/furnishing-date. A 44AB return cannot
   be validly filed without UDIN and membership no. Root: `PART_A_General.md` left these
   conditional-reveal rows unbuilt as if "hidden by design". MAJOR.
2. **The audit-u/s block is not on Part A-OI at all** (contract premise wrong). Part A-OI ends
   at item 18 = 92CE(2A). The whole 44AA/44AB/auditor/UDIN/92E block is on PART A-General
   (section `who`/`ret`). Any team looking for it on Part A-OI will miss the gap in #1.
3. **Nature of business is duplicated** — a free-text Code grid on the `ret` screen
   (`70_sec_ret.js:354-358`) and the full 357-entry dropdown on the `bpa` screen
   (`70_sec_bpa.js:283-286`), both writing `PartA_GEN2.NatOfBus.NatureOfBusiness`
   (`who:305` + `bpa:830`). Duplicate writer (rule 11), inconsistent input, and data loss when
   both are used; the `ret` free-text copy is ITR-2 bleed.
