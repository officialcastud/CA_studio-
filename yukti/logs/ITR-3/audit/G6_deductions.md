# G6 — Deductions (Chapter VI-A + 10AA) audit — ITR-3 A.Y. 2026-27

Group **G6_deductions**. Section owned: `ded` (`forms/ITR-3/src/70_sec_ded.js`).
Sheets audited: **VI-A**, **80C**, **80D**, **80U-80DD**, **80E_80EE_80EEA_80EEB**,
**80G**, **80GGA**, **RA**, **80GGC**, **80** (80-IA/80-IB/80-IE), **10AA**.
Excel utility = `sources/ITR-3/ITR3_AY_26-27_V1.3.xlsm`; schema =
`sources/ITR-3/ITR-3_2026_Main_V1_1_schema.json`. `H` after a row number = hidden row.

---

## VI-A  (section: ded)

The lettered Chapter VI-A list on the summary sheet. Our `DED_VIA` array
(`70_sec_ded.js:63-93`) reproduces **every live lettered row** a–o(i) / p–x /
y,z,i,ia,ib, and every schema key in `UsrDeductUndChapVIA` / `DeductUndChapVIA`
(verified against the schema — 39 keys, all mapped in `DED_MAP` at :102-109).

### Missing fields/rows
- None live. The rows we do NOT build are all hidden legacy rows with **no schema key**,
  correctly excluded and logged in `books/ITR-3/VI_A.md`:
  - `r30H` 80CCG (equity savings scheme) — withdrawn, no key.
  - `r31` 80CCF — visible but malformed formula (references 80CCG), no schema key; dropped per constitution rule 3.
  - `r55H` 80ID — withdrawn, folds into `Section80IC`.
  All three lack a schema key (confirmed: schema has no `Section80CCG`/`Section80CCF`/`Section80ID`), so absence is correct, not a gap.

### Dropdowns
- **Type of identifier** (80CCC, E9:E11 `PRAN` / `Other than PRAN`): ours `DED_IDENT` matches.
- **80DDB self/dependent type** (E38 `Section80DDB`: 1-Self or Dependent / 2-…Senior Citizen): ours `DED_DDBTYPE` matches.
- **80DDB disease** (F38 `Specified_Disease_List`, (a)…(n) — 14 diseases): ours `DED_DISEASE` matches all 14.
- **80D category dropdowns** (Selection80D 7-option / Selection80D_B / Selection80D_C) sit on hidden helper rows 33–35; the filed detail comes from the separate Schedule 80D sheet, which our UI models with the sheet's own senior-citizen Yes/No/NA questions. Not a missing value — different (correct) modelling.

### Conditional cascades (show/hide)
- FLAG **80DDB claimed** [r37/r38]: set→opens disease + self/senior type selectors. Ours: **YES** — `secDed:292-294` renders both when `N(S.ded.v.c80ddb)`.
- FLAG **80GG claimed** [r44/r45]: set→opens Form 10BA acknowledgement (mandatory). Ours: **YES** — `:295`, plus `chkDed:654` errors if the 15-digit ack is absent.
- FLAG **80QQB / 80RRB claimed** [r58/r59, r60/r61]: set→opens Form 10CCD / 10CCE ack (mandatory). Ours: **YES** — `:302-303` + `chkDed:657-658`.
- FLAG **80CCD(1B) claimed** [r18→r23]: set→opens PRAN entry. Ours: **YES** — `:291`, `chkDed:651` requires a 12-digit PRAN.
- FLAG **80CCC claimed** [r7→r8 identifier table]: set→opens the PensionContribution80CCC identifier grid. Ours: **YES** — `:290` fold `dedPenTbl`.

### Regime open/close
- New regime closes everything except **80CCD(2), 80CCH, (business) 80JJAA**. Utility: the `I`-column claimed formulas gate with `IF(bacValue=1,0,…)` on 80C (I6), 80E (I39), 80EE (I40), 80EEA (I41), 80EEB (I42), 80GGA (K46), 80GGC (K47), 80IBA (K53); 80CCD(2) (K29) and 80CCH (K67) keep computing. Ours: **MATCH** — `DED_VIA_NEW=["c80ccd2","c80cch","c80jjaa"]` (`:100`), `allow` gate (`:188`) and renderer `open` gate (`:281`). `bacValue=1`=new / `=2`=old confirmed against the I-column.
- Chapter VI-A GTI ceiling (W3 = GrossTotalIncome − IncChargeableTaxSplRates): ours `gtiLimit` (`:168`) and part-total `Math.min(…,gtiLimit)` (`:227-231`) reproduce K48/K62/K69/K70.

### Audit u/s
- None on this sheet (deductions carry no 44AB/92E trigger). N/A.

### ITR-2 bleed / notes
- ITR-3-only Part C business rows (80IA/IAB/IB/IBA/IE/JJA/JJAA) are **present and live** (`DED_VIA` p–x), not carried over as "absent" from ITR-2. Good.

### Verdict: SOLID — full lettered coverage, correct regime gating; the only VI-A-summary omissions are keyless legacy rows correctly excluded.

---

## 80C  (section: ded)

Excel: Sl.No / Nature of payment / Amount eligible u/s 80C / Policy-or-Document-ID (r3), total (r10).
Ours: `grid("ded.c80c",…)` with `amt` + `id` (`:317-319`).
- **Note:** Excel has a "Nature of payment" column (D3) that our grid drops (we keep only amount + identification no.). The schema `Schedule80CDtls` carries only `Amount` + `IdentificationNo` (verified `expDed:458`), so no filing impact — but the utility shows a nature-of-payment label our screen does not.

### Verdict: SOLID.

---

## 80D  (section: ded)

Excel Schedule 80D: (a) Self&Family (health insurance + preventive), (b) Self&Family incl. senior citizen (health insurance + preventive + **medical expenditure**), driven by r4 "you/family senior citizen?"; then (a) Parents / (b) Parents incl. senior citizen driven by r28 "any parent senior citizen?"; ₹25,000/₹50,000 block caps (L5/L16/L29/L40), ₹5,000 preventive, ₹1,00,000 overall (L52), new-regime blank (L52 `IF(bacValue=1,0,…)`).
Ours: `engDed80D` (`:118-136`) + card `d80d` (`:322-332`).

### Conditional cascades (show/hide)
- FLAG **"you/family a senior citizen?"** [r4, dropdown]: Y→opens the senior block with medical-expenditure row; N→non-senior block (no medical exp). Ours: **YES** — `d.selfSr==="Y"` shows `selfSrIns`+`selfSrPHC`+`selfSrMed`; `="N"` shows `selfIns`+`selfPHC` (`:325-326`).
- FLAG **"any parent a senior citizen?"** [r28]: same. Ours: **YES** (`:328-329`).
- ₹5,000 shared preventive cap and "medical expenditure only where no insurance taken": reproduced (`engDed80D:127-131`).

### Regime open/close
- 80D closed in new regime (L52). Ours: `Section80D` closed via the VI-A `allow` gate; export sub-schedule emitted only in old regime (`expDed:454` early return). **MATCH.**

### Verdict: SOLID.

---

## 80U-80DD  (section: ded)

Excel Schedule 80U (r4-6) columns: Nature / Type / Amount / Date of filing Form 10IA / **Ack. No. of Form 10IA** / **Ack No of Form as per Rule 11A(2)(ii) (if available)** [H5] / UDID.
Excel Schedule 80DD (r14-16) columns: Nature / Type / Amount / Type of dependent / PAN / Aadhaar / Date Form 10IA / Ack Form 10IA / **Ack No of Form as per Rule 11A(2)(ii)** [K15] / UDID.

### Missing fields/rows
- **[80U H5] "Ack No of Form as per Rule 11A(2)(ii)"** — schema key `Schedule80U.FormAckNum11A` (confirmed present in schema) — **not captured** in `secDed`/`expDed`/`impDed`. Impact: an optional ("if available") field cannot be filed; low severity.
- **[80DD K15] "Ack No of Form as per Rule 11A(2)(ii)"** — schema key `Schedule80DD.FormAckNum11A` (confirmed) — **not captured**. Same impact.

### Dropdowns
- Nature of disability (80U: self/self-severe; 80DD: dependent/dependent-severe) — ours `DED_UNAT` / `DED_DDNAT` match.
- Type of disability (1-Autism/CP/multiple, 2-Others) — ours `DED_DTYPE` matches.
- Type of dependent (80DD) — ours `DED_DEP` (Spouse…Member of HUF) present.

### Conditional cascades / caps
- ₹75,000 / ₹1,25,000 severe cap: reproduced in engine (`engDed:191-192`). Form 10-IA note shown (`:340,346`).

### Regime open/close
- 80U/80DD closed in new regime (E6/E16 `IF(bacValue=1,0,…)`, plus NRI zero). Ours: **MATCH** (allow gate + NRI list `:220`; export gated by old-regime return).

### Verdict: MINOR GAPS — two optional `FormAckNum11A` fields (Rule 11A(2)(ii) ack) absent from both 80DD and 80U.

---

## 80E_80EE_80EEA_80EEB  (section: ded)

Excel: four loan tables (r3-9 80E, r14-20 80EE, r25-32 80EEA + stamp value r26, r37-43 80EEB + vehicle reg r38); columns Loan-taken-from / Bank name / Loan A/c no / Date of sanction / Total loan / Outstanding / Interest.
Ours: `dedLoanTbl` (`:257-263`) + card `d80e` (`:350-354`); 80EEA stamp value (`:353`); 80EEB vehicle reg column (`:258`).
- All columns reproduced; `LoanTknFrom` enum B/I matches `DED_LOANFROM`.

### Regime open/close
- All four closed for new regime and for HUF (I39-I42). Ours: **MATCH** (allow gate + HUF handling; old-regime-only export).

### Verdict: SOLID.

---

## 80G  (section: ded)

Excel: four buckets — A 100% no-limit (r4), B 50% no-limit (r18), C 100% subject-to-limit (r32), D 50% subject-to-limit (r45); per-row Name/Address/City/State/PIN/PAN/cash/other/total/eligible/transaction-ref/IFSC; cash>2,000 disallowed (O7 `IF(L>2000,0,L)`); C+D share the 10% qualifying limit `QualifyingAmount80G`; new-regime blank (O61).
Ours: `engDed80G` (`:140-150`) + card `d80g` (`:357-367`).

### Conditional cascades / buckets
- Bucket A/B/C/D selector, 100%/50%, qualifying limit on C&D: **reproduced** — `engDed80G` computes `A + 0.5*B + min(C,ql) + 0.5*min(D,ql-C)`. Cash>₹2,000→no deduction: reproduced (`:141`). **YES.**

### Dropdowns / fields
- State dropdown: Excel `State80G` = codes **01-37** (no "99"). Ours `DED_STOPTS` adds `99-Outside India`, and `expDed` defaults an unpicked state to `"99"` (`:510,533,543`) — `99` is **not** a valid `State80G` value, a minor validation risk on a row left without a state.
- **ARN column:** Excel places ARN (Donation Reference No.) **only on bucket D** (K46); ours offers `arn` on every bucket row — harmless over-inclusion (schema `ArnNbr` optional).
- Excel note r63 ("if donee is Government and PAN unavailable use `GGGGG0000G`") — not surfaced on our screen (informational only).

### Qualifying-limit base (computational nuance)
- Excel `QualifyingAmount80G` (W4) = 10% of GTI **net of the other Chapter VI-A deductions** (`GTI − SUM('VI-A'!K6:K42,K46,K47,MIN(60000,80GG)…)`). Ours uses `0.1*gtiLimit` **gross** (`:146`), i.e. before subtracting the other deductions. For a filer with large other deductions this over-states the C/D qualifying pool. **PARTIAL** match on the C/D limit base.

### Verdict: MINOR GAPS — bucket cascade correct; qualifying-limit base is gross (not net of other VI-A) and the `99` state default is invalid for 80G.

---

## 80GGA  (section: ded)

Excel: donee table (r5-10), Relevant-clause dropdown (8 clauses a…e), Name/Address/City/State/PIN/PAN, **separate cash + other-mode columns**; eligible = `MIN(SUM(IF(cash>2000,0,cash),other),GTI)` with **`S7 = 2000`** cash threshold (r7); disallowed entirely where business income > 0 (O12 `BP_80GGA>0`) or new regime (`bacValue=1`).
Ours: card `d80gga` (`:370-376`) + engine `:174`.

### Missing / wrong
- **Cash threshold wrong.** Utility disallows a cash donation over **₹2,000** (S7=2000). Our engine (`:174`) and screen note (`:376`) use **₹10,000**. A cash donation of, say, ₹5,000 is allowed by us but fully disallowed by the utility → over-claim / figure mismatch.
- **Structural:** Excel has separate cash + other-mode columns per donee row, disallowing only the **cash portion** over ₹2,000 while always allowing the other-mode portion. Ours models each row as a single `mode` (CASH/OTH) + one `amt`, so a mixed cash+other donee cannot be entered and a CASH row is judged whole. PARTIAL.

### Dropdowns
- Relevant-clause dropdown (`RelevantClause_80GGA1`, 8 values a/aa/b/bb/c/cc/d/e): ours `DED_GGACLAUSE` matches all 8.

### Regime / business-income cascade
- new-regime blank + "not with business income": **reproduced** (`:196` zeroes 80GGA when `head("bp")>0`; `chkDed:664`).

### Verdict: MINOR GAPS — ₹2,000 vs ₹10,000 cash cut-off is a real computational error; single-mode row cannot represent a mixed donation.

---

## RA (Schedule RA — 35(1) research associations)  (section: ded)

Excel: Name/Address/City/State/PIN/PAN, **cash + other-mode** columns, total, eligible (r5-12); no cash-threshold disallowance (M7 = plain SUM).
Ours: card `d80gga` sub-section `ded.ra` (`:377-382`), separate `cash`/`other` columns, `expDed` writes `Schedule80RA` (`:539-545`).
- Columns and eligible-amount treatment match. Schema key `Schedule80RA` confirmed. **SOLID.**

### Verdict: SOLID.

---

## 80GGC  (section: ded)

Excel: Date / cash + other-mode / total / eligible / party name / PAN / transaction-ref / IFSC (r6-14); **any cash contribution disallowed** (`I8 = MIN(SUM(IF(F8>0,0,F8),G8),GTI)`); new-regime blank (`H14/I14 IF(bacValue=1,0,…)`).
Ours: card `d80ggc` (`:385-390`) + engine `:175` (`mode==="CASH"?0:amt`).
- Any-cash→no-deduction: **reproduced.** Fields present.
- **Structural note:** Excel has separate cash + other columns; ours is single `mode`+`amt`, so a mixed row cannot be split (but since any cash zeroes eligibility for a cash-flagged row, effect is close). PARTIAL on mixed rows only.

### Verdict: SOLID (minor single-mode structural note).

---

## 80 (Schedule 80-IA / 80-IB / 80-IE)  (section: ded)

Excel: per-section undertaking tables. Live (non-hidden) categories:
- **80-IA**: only `(4)(iv) Power` (r15) is visible; (4)(ii)/(iii)/(v) hidden.
- **80-IB**: mineral oil r47, housing r51, fruits/veg processing r59, integrated handling/storage/transport r63 visible; others hidden.
- **80-IE**: eight North-East state undertakings (Assam r92 … Sikkim r120) visible; Sikkim/HP/Uttaranchal sub-blocks hidden.

Ours: single "code + amount" input per section (`secDed:296-301`), export hard-wires fixed LocOrDescCodes (`expDed:557-573`).

### Missing fields/rows (coverage granularity)
- **[80-IB r47-r63]** Four live undertaking categories, but `expDed:566-569` only routes the entered amount to `DeductMinOilUs80_IB_9_Und` (mineral oil); housing / food-grain get an empty `Sch80DeductAmtDtls`. Impact: a filer claiming 80-IB for a **housing project / fruits-veg / integrated-handling** undertaking cannot place the amount in the right sub-object. PARTIAL.
- **[80-IE r91-r124]** Eight North-East state undertakings, but `expDed:570-573` puts the amount only in `Assam_Und` (all others empty). Impact: an 80-IE claim for Manipur/Mizoram/etc. is mis-bucketed to Assam. PARTIAL.
- **80-IA** — only Power is live, and our single input maps to `POWER`; **adequate**.

### Regime open/close
- All 80-IA/IB/IE closed in new regime (H23/H75/H126 `IF(bacValue=1,0,…)`). Ours: **MATCH** (allow gate; old-regime-only export at `:454`).

### Verdict: MINOR GAPS — 80-IB category and 80-IE state selection collapsed to one default bucket; correct only for the default undertaking.

---

## 10AA (Schedule 10AA — SEZ)  (section: ded)

Excel: units table (r8-14) — AY unit began to manufacture/provide services + amount; total `I14 = IF(bacValue=1,0,SUM(...))`; note r18 "available up to AY 2022-23"; the earlier Schedule 10A block (r1-5) is fully hidden.
Ours: card `d10aa` (`:393-398`), grid `ded.aa10` (ay + amt), engine `:235-236`, export `Schedule10AA` (`:576-578`).

### Coverage / cascade / regime
- **Present** (this is the ITR-3/business item ITR-2 lacks — correctly built). Fields (AY + amount) match the live 10AA table.
- Regime: **closed under new regime** — `ded10AA = isNew()?0:…` (`:236`); screen shows the "closed by 115BAC" stop note (`:394`); export emitted only when `!isNew()` (`:576`). **MATCH** (rule A633).
- AY-2022-23 sunset note surfaced (`:398`).
- Schema `Schedule10AA` / `DedFromUndertakingWithAy` confirmed against export shape.

### Verdict: SOLID.

---

## GROUP SUMMARY

- **Missing fields:** 4
  1. `Schedule80DD.FormAckNum11A` (Ack of Form per Rule 11A(2)(ii)) — 80DD K15.
  2. `Schedule80U.FormAckNum11A` — 80U H5.
  3. 80-IB category routing — only mineral-oil sub-object wired (housing / fruits-veg / integrated-handling not selectable).
  4. 80-IE North-East state routing — only Assam wired (7 other states not selectable).
  (Plus non-filing display omissions: 80C "Nature of payment" column, 80G Government-PAN note.)
- **Missing cascades:** 0 — every Yes/No, type-selector and sub-schedule cascade (80D senior toggles, 80DDB disease/type, 80GG/80QQB/80RRB ack, 80CCD(1B) PRAN, 80G buckets A–D, disability type, loan tables, 10AA) is reproduced.
- **Missing dropdown values:** 0 — all enums (identifier, 80DDB disease ×14, disability nature/type, dependent, 80GGA clause ×8, loan-from) match. (Ours over-includes a `99-Outside India` state that 80G/80GGA lack — an invalid default, not a missing value.)
- **Regime mismatches:** 0 — new-regime allow-list (80CCD(2)/80CCH/80JJAA) and every closure (80C…80U, 10AA, 80-IA/IB/IE) match the utility's `bacValue` gating exactly.
- **Audit gaps:** 0 — no 44AB/92E audit trigger lives on the deduction sheets.

### Three most serious items
1. **80GGA cash cut-off is ₹10,000 in our code (`70_sec_ded.js:174`, note `:376`) but ₹2,000 in the utility (80GGA sheet S7)** — a real over-claim / figure error.
2. **`FormAckNum11A` (Rule 11A(2)(ii) acknowledgement) missing on both Schedule 80DD and Schedule 80U** — schema-defined fields not captured.
3. **80-IB / 80-IE undertaking-category granularity collapsed to a single default bucket** — 80-IB claims land in mineral-oil and 80-IE claims land in Assam regardless of the real undertaking (`expDed:566-573`).
