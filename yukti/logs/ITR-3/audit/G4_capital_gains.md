# ITR-3 audit — G4 Capital Gains

Group **G4_capital_gains**. Sheets audited: **CG** (Schedule CG), **Schedule 112A**,
**Schedule 115AD(1)(iii) proviso**, **VDA**. All four map to section `cg`
(`forms/ITR-3/src/70_sec_cg.js`, blocks `ScheduleCGFor23` / `Schedule112A` /
`Schedule115AD` / `ScheduleVDA`). Read-only audit; nothing edited but this file.

Overall the section is unusually complete for the *computational core* — slump sale
(A2/B2), 112A grandfathering, the 23-July-2024 rate split, 50C/50CA substitution, the
six-slot set-off matrix and VDA are all genuinely built from the ITR-3 sheet (not bled
from ITR-2). The gaps are on the *evidentiary / entry-detail* side: Part D deduction
detail tables, the DTAA detail grids, the property-buyer detail, and the non-resident
short-term/LTCG heads.

---

## CG  (section: cg)

### Missing fields/rows
- **[r429–r489, Part D] Deduction-detail tables (54/54B/54D/54EC/54F/54G/54GA/115F)** —
  every visible Part D table (`r431` 54, `r437` 54B, `r442` 54D, `r447` 54EC, `r457` 54F,
  `r462` 54G, `r467` 54GA, `r472` 115F) asks per-claim for *Date of transfer of original
  asset, Cost of new asset, Date of purchase/construction, Amount deposited in CGAS before
  due date, Date of deposit, Account number, IFS code, Amount of deduction claimed*. Our
  software (`secCg` Part D fold, lines 544-550) renders **only the section totals** —
  `calcRow("Deduction u/s "+sec,...)`. There is **no input** for any of the eight detail
  columns. `expCg` (lines 704-716) fabricates them: `DateofTransfer:ISO(d.transfer)||"2025-04-01"`,
  reading `C.dedD[sec][k]` which **no UI ever populates**. Impact: the deduction detail
  the schema requires (`DeducClaimDtlsUs54[].DateofTransfer`, `AmtDeducted`, and for 54EC/115F
  `AmtInvested`/`DateofInvestment`) is auto-defaulted to a placeholder date and cannot be
  entered — the return will carry wrong/blank exemption-proof detail. **MAJOR.**
- **[r112–r121 / r407–r414] DTAA detail entry grid (A9 / B12)** — the sheet's visible grid
  (`r113`/`r407`) has ten columns: Amount of income, Item No. included, Country name/code,
  Article of DTAA, Rate as per Treaty, TRC obtained?, Section of I.T. Act, Rate as per
  I.T. Act, Applicable rate. Our state has `a9:[]`/`b12:[]` (lines 66,74) and the engine
  sums them (lines 220-221, 240-241), but **there is no renderer** — the arrays can never be
  filled. `expCg` writes only the two totals `TotalAmtNotTaxUsDTAAStcg`/`…TaxUsDTAAStcg`
  (line 631) and the LTCG pair (line 679); it never emits the `NRICgDTAA.NRIDTAADtls[]`
  detail array the book §6 lists as required. (S120/S121/S413/S414 are NRI-gated, so this is
  mainly NRI-facing, but the grid is visible and un-hidden.) Impact: A9a/A9b/B12a/B12b are
  always 0 in practice; a non-resident cannot claim DTAA relief in CG.
- **[r23 / r178] Property-buyer (194-IA) table — missing columns** — the sheet's buyer grid
  wants *Name, PAN, Aadhaar, % share, Amount, Address of Property, State Code, Pin Code,
  Country*. Our grid (`landBlock`, lines 350-355) offers only **Name / PAN / % share /
  Amount**. `expCg`'s `buyers()` (lines 594-601) reads `x.aadhaar`, `p.paddr`, `p.pstate`,
  `p.ppin` and defaults the un-enterable ones (`AddressOfProperty:"NA"`, `StateCode:"19"`).
  Impact: schema-required `AddressOfProperty`/`StateCode` and the buyer Aadhaar cannot be
  captured — every 194-IA property sale files a placeholder address/state.
- **[r99 / r389] Unutilized-CG table — missing columns** — sheet columns include *New asset
  acquired/constructed, Previous year in which asset acquired/constructed, Amount utilised
  out of Capital Gains account*. Our grid (`cg.a7.deem` / `cg.b10.deem`, lines 450-454 /
  496-500) captures only *PY of transfer, Section, Amount unutilised*. Schema
  `UnutilizedCgPrvYrDtls[].AmtUtilized` (LT, book §6) is never entered/exported. Impact:
  incomplete deemed-CG detail.
- **[r490] 54GB company PAN** — "In case of deduction u/s 54GB, furnish PAN of the company"
  is a visible field; not captured anywhere. Impact: 54GB claim cannot record the mandated PAN.
- **[r56–r75 A4/A5; r265–r353 B5/B6/B8] Non-resident short-term & LTCG heads** — book §8
  says keep A4 (STCG 111A for NR), A5 (STCG FII 115AD), B5 (unlisted shares/listed deb NR),
  B6 (112(1)(c) unlisted / 115AC bonds-GDR / 115AD FII), B8 (115F foreign-exchange asset)
  hidden **until residential status is NRI/FII**, then surface them. Our software builds
  **only B7** (FII 112A route, `if(G.nri)` line 516) and emits zero stubs
  (`NRITransacSec48Dtl`, `NRISecur115AD`, `NRISaleofForeignAsset`, lines 690-698). A
  non-resident filer therefore cannot report A4/A5/B5/B6/B8 at all. Impact: NRI/FII CG
  return incomplete (resident test client unaffected).
- **[r98 / r388 flags; r535 flag] single-string flags not exported** — `UnutilizedStcgFlag`,
  `UnutilizedLtcgFlag`, `EditAutopoulatedDetail` are single string schema values (book §5);
  `expCg` never writes them. Minor.

### Dropdowns
- **[H478:H485] Part D deduction section list** — Excel `{54,54B,54D,54EC,54EE,54F,54G,54GA,
  54GB,115F}`. Our per-head deduction rows expose 54/54B/54D/54EC/54F/54G/54GA (LTCG land,
  `EXLT_LAND`), 54B/54G/54GA (STCG land, `EXST_LAND`), plus 54EC/54F on slump-sale B2.
  Missing: **54EE** (nowhere selectable) and **54GB** (only as a PAN field). 54EE is largely
  a superseded/hidden line, so low impact.
- DTAA row selectors (Country-code 248-list, Article, TRC Yes/No, Section-of-IT-Act) — absent
  because the whole A9/B12 grid is unbuilt (see Missing fields).
- All other CG enums correctly reproduced: buy-back rate lists `BBST`/`BBLT` (r136/r421 match
  H137/H422), deemed-CG PY/section (`DEEM_ST_PY`/`DEEM_ST_SEC`/`DEEM_LT_SEC` match H391/I391/
  I392), 112A/115AD acquired-before/after (`OB`), VDA head (`HEADVDA`).

### Conditional cascades (show/hide)
- FLAG **Col 1a "acquired on/before vs after 31-Jan-2018"** [112A/115AD E-col]: set BE→opens
  qty/price/FMV-per-unit working and grandfathering (Col 9 = lower of Col 6 & 11); AE→locks
  Cols 4/5/10/11 to zero, ISIN=`INNOTREQUIRD`, name=`CONSOLIDATED`, direct sale value.
  **Ours: reproduced YES** — `engScrip` (lines 162-181) branches on `pre==="BE"`, `scripGrid`
  shows both `qty/price` and `sale6`; export forces the AE lock values (lines 574-582).
- FLAG **Col 1b "transferred before/on-after 23-Jul-2024"** [112A/115AD; hidden rows 12-14]:
  set→splits Col-14 total into before/after-23-July for B4a(i)/(ii). **Ours: PARTIAL** —
  `engScrip` computes `before23`/`after23` (line 178) but `expCg`/`scripBlock` **do not emit**
  the before/after split totals (only the flat Col-14 total). Those feed hidden rows r257/r258,
  so low impact, but the split is not surfaced.
- FLAG **resident + acquisition before 23-Jul-2024 (land/building)** [r173–r176]: opens the
  112(1) 2nd-proviso rate columns ei(A) 12.5% un-indexed / ei(B) 20% indexed / eii excess-to-
  ignore, plus the indexed-cost line biia and 1ca. **Ours: reproduced YES** — `engLand`
  `canIndex` + `taxA/taxB/excess` (lines 116-135), rendered lines 344-348.
- FLAG **"assets sold include shares other than quoted (unquoted)"** [r77/r355]: opens the
  50CA unquoted-share sub-rows (full value / FMV / 50CA MAX). **Ours: reproduced YES** for
  A6/B9 (`aggBlock` `opts.unq`, `engAgg` 50CA MAX line 143). (A5/B6 NR versions unbuilt.)
- FLAG **VDA Col 4 head BI vs CG** [VDA F-col]: routes per-row income to Business (Total A →
  BP 3g) or Capital Gain (Total B → CG C2). **Ours: reproduced YES** — `engVDA` (lines 184-187).
- FLAG **r98/r388 "Whether any unutilized capital gain…?" (Yes/No)**: set→opens the
  UnutilizedCg table. **Ours: PARTIAL** — we never render the Yes/No flag; the deem grid is
  always shown (empty = none). Functionally equivalent, but the flag itself is not modelled
  or exported.
- FLAG **r535 "Do you want to edit the auto-populated set-off?"** and **r536 edit quarters**:
  set→make Table E / Part F editable. **Ours: reproduced YES** — `cg.editE`/`cg.Eover`
  (lines 266-268, 553-555) and `cg.editF`/`cg.Fover` (lines 284-285, 557-560).
- CASCADE **residential status = NRI → open A4/A5/B5/B6/B8 + Schedule 115AD**: **Ours:
  PARTIAL/NO** — only B7 + Schedule 115AD open on `G.nri`; A4/A5/B5/B6/B8 never open (see
  Missing fields).

### Regime open/close
- REGIME.md closes **nothing** under the Capital Gains head — the 54/54B/… exemptions are
  CG exemptions (not Chapter VI-A) and stay available new-or-old; the whole income side stays
  open. **Ours: match** — `engCg` has no `isNew()` gating (documented lines 10-15); `isNew()`
  is read only to keep the both-ways contract explicit. **0 regime mismatches.**

### Audit u/s
- No audit trigger lives on any of these four sheets (44AB/44AD/44ADA/92E belong to Part-A/BP,
  not CG). **0 audit gaps** for G4.

### ITR-2 bleed / notes
- **Not bled:** slump sale A2/B2 is genuinely built (ITR-2 lacks it), the six rate-slots in
  Table E (20/30/applicable/DTAA STCG; 12.5/DTAA LTCG) match ITR-3's structure, and item
  numbering (A10/B13/C1/C2/C3) is taken from the ITR-3 sheet.
- **Import bug (mild bleed):** `impCg` (line 772) restores STCG-land exemption as
  `ded:{s54B:ExemptionGrandTotal}` — it always dumps the grand total into 54B, losing which
  section was actually claimed. LTCG land import (lines 773-778) correctly reads
  `ExemptionOrDednUs54Dtls[]` per section; STCG land does not (STCG land has no per-section
  detail array, so this is a lossy but tolerable simplification).

### Verdict: MINOR GAPS — computational core is solid; the entry-detail tables (Part D, DTAA, buyer, unutilized-CG) and the NR heads are the real holes.

---

## Schedule 112A  (section: cg)

### Missing fields/rows
- None material. All 14 columns are present in `scripGrid` (lines 381-398) and the eight
  block totals are emitted by `scripBlock` (lines 568-589). ISIN pattern / `INNOTREQUIRD` /
  `INNOTAVAILAB` and `CONSOLIDATED` name handled (lines 575-576).

### Dropdowns
- Col 1a `OB` = {BE "On or before 31st January 2018", AE "After 31st January 2018"} — matches
  E6:E9. Col 1b before/after-23-July offered in `scripGrid` (BF/AF). Complete.

### Conditional cascades (show/hide)
- Col 1a BE/AE lock and grandfathering — **reproduced YES** (see CG cascades). Col 6=4×5,
  Col 7=higher(8,9), Col 9=lower(6,11), Col 11=4×10, Col 13=7+12, Col 14=6−13 all in
  `engScrip` — match the book's [K6]/[L6]/[N6]/[P6]/[T6]/[U6] formulas exactly.
- Hidden before/after-23-July split (rows 12-14) — computed internally (`before23`/`after23`)
  but not exported (PARTIAL, low impact — feeds hidden B4a(i)/(ii)).

### Regime open/close
- No regime gating applies. Match.

### Audit u/s
- None.

### ITR-2 bleed / notes
- Balance112A total correctly feeds B4a (`B.b4.a`, line 234). Mutual-exclusion with 115AD
  enforced in `chkCg` (lines 823-826). Clean.

### Verdict: SOLID.

---

## Schedule 115AD(1)(iii) proviso  (section: cg)

### Missing fields/rows
- None material — reuses the identical `scripGrid`/`engScrip`/`scripBlock` math as 112A,
  gated behind `if(G.nri)` (line 516) so it is offered only to a non-resident, matching the
  book's FPI/FII (`Sheet1.115H`) lock.

### Dropdowns
- Same as 112A; complete.

### Conditional cascades (show/hide)
- Col 1a BE/AE lock — reproduced YES. FPI/FII gating — reproduced (`G.nri` = `S.pi.res!=="RES"`).
- Mutual exclusion with 112A + FII-only rule enforced in `chkCg` (lines 823-829). YES.

### Regime open/close
- No regime gating. Match.

### Audit u/s
- None.

### ITR-2 bleed / notes
- Balance115AD feeds B7a (`B.b7.a`, line 235). Clean. Note the residency test is
  `S.pi.res!=="RES"` — this treats any non-resident as FII-eligible; the book's stricter
  `Sheet1.115H` FPI flag is not separately modelled, so a non-FII non-resident is still
  offered the schedule (minor over-permission, guarded only at check level).

### Verdict: SOLID.

---

## VDA  (section: cg)

### Missing fields/rows
- None. Table columns Date of Acquisition, Date of Transfer, Head (BI/CG), Cost,
  Consideration, and computed Income = MAX(0, Cons−Cost) all present (`secCg` lines 531-539,
  `engVDA` lines 184-187). Totals A (`TotIncBusiness`) and B (`TotIncCapGain`) emitted
  (line 750). No hidden rows to worry about (book: none).

### Dropdowns
- Col 4 head `HEADVDA` = {BI "Business Income", CG "Capital Gain"} — matches F5:F7. Complete.

### Conditional cascades (show/hide)
- Head BI/CG routing — reproduced YES. Per-row income floored at 0 — reproduced.

### Regime open/close
- No regime gating (VDA taxed @30% u/s 115BBH regardless). Match.

### Audit u/s
- None.

### ITR-2 bleed / notes
- ITR-3-specific: Total A feeds BP 3g (115BBH) and Total B feeds CG C2 — both cross-ties
  reflected (C2 = `vda.cg`, line 288; `si115bbh` bucket line 309). The date-not-after-31-March
  check is present (`chkCg` lines 831-833). Clean; genuinely built for ITR-3.

### Verdict: SOLID.

---

## GROUP SUMMARY

- **Missing fields/rows: 8** — (1) Part D deduction detail tables; (2) A9 DTAA grid;
  (3) B12 DTAA grid; (4) buyer Aadhaar/Address/State/Pin/Country; (5) unutilized-CG extra
  columns (new asset / PY acquired / AmtUtilized); (6) 54GB company PAN; (7) NR heads
  A4/A5/B5/B6/B8; (8) UnutilizedStcg/Ltcg & EditAutopoulated flags.
- **Missing cascades: 1 not reproduced** (residency=NRI → open A4/A5/B5/B6/B8) **+ 2 partial**
  (r98/r388 unutilized-CG Yes/No flag never rendered; 112A/115AD before/after-23-July split
  computed but not exported). All other cascades reproduced.
- **Missing dropdown values: 1** — 54EE absent from the deduction-section options (plus the
  DTAA row selectors, which are subsumed in the unbuilt A9/B12 grids).
- **Regime mismatches: 0** — REGIME.md closes nothing under Capital Gains; our no-gating is correct.
- **Audit gaps: 0** — no audit trigger lives on these four sheets.

### Three most serious items
1. **Part D deduction detail tables are entry-less** (`70_sec_cg.js` Part D fold vs Excel
   r429-489): only totals shown; `expCg` fabricates `DateofTransfer:"2025-04-01"` and reads a
   never-populated `C.dedD`. Every 54/54B/54D/54EC/54F/54G/54GA/115F claim files placeholder
   dates and blank CGAS/account/IFSC detail. **MAJOR.**
2. **A9/B12 DTAA detail grids unbuilt** (Excel r112-121 / r406-414): state arrays exist but no
   UI and no `NRICgDTAA.NRIDTAADtls[]` export — DTAA relief in CG is uncapturable.
3. **Non-resident CG heads A4/A5/B5/B6/B8 not surfaced for an NRI filer** (Excel r56-75,
   r265-353): only B7 + Schedule 115AD open on `G.nri`; an NRI cannot report NR STCG/LTCG.
