# ITR-3 — the regime switch (a Phase-4 build requirement, from the ITR-3 sources)

The regime choice is the form's master switch. **New tax regime u/s 115BAC(1A) is the default.** Opting **out** (old regime) opens a large set of exemptions, deductions and set-offs; staying **in** the new regime closes them. Every section-builder must honour this — the engine zeroes what the regime disallows, and the renderer **opens** the field (editable / a card that expands) or **closes** it (shown as `cell(0)` / a `note("closed by section 115BAC")`, not an input) exactly as the regime dictates. Build it **both ways** and test both: `S.fs.optout="Yes"` (old — everything open) and `="No"` (new — the closures below).

Master switch (already in the shared shell): `const isNew=()=>S.fs.optout!=="Yes";`

## Try both ways — the comparison (mirror the ITR-2 `ret` section)
The **Return & regime** (`ret`) section must compute the whole return under BOTH regimes and show a New-vs-Old table (tax, total VI-A allowed, total income, tax payable), as the ITR-2 software does: temporarily set `S.fs.optout`, `compute()`, read the figures, restore, `compute()` again. This lets the filer see which is better before choosing. Never leave it computed under only one regime.

## What CLOSES when the NEW regime is in force (opt-out = "No")
Each line: the item · the rule serial from `rules.json` · the section-builder that owns it.

**Salary (`sal`)**
- 16(ii) entertainment allowance → 0 (A194); 16(iii) professional tax → 0 (A195).
- Std deduction 16(ia): ₹75,000 in the new regime vs ₹50,000 in old (note the swap — the *larger* std deduction is the new regime's).
- 10(14) allowances: only the new-regime-permitted subset stays exempt (A198 lists those barred, incl. transport allowance except for a disabled employee); all other 10(14) exemptions → 0.

**House property (`hp`)**
- 24(b) interest on borrowed capital for a **self-occupied** house → cannot be claimed (A224, A232). Let-out interest still allowed.

**Losses (`loss`)**
- Schedule CYLA: HP loss cannot be set off against any other head (A572, A579) and cannot be carried forward via CYLA (A573).
- CFL 5b / UD 3a: the 115BAC(6) opt-in adjustment rows apply (A620, A624).

**Business & depreciation (`bp`)**
- 35AD deduction cannot be claimed (A287).
- DPM: additional depreciation → 0 (A309); the 45% block cannot be claimed (A310).
- ESR: weighted deductions u/s 35(1)(ii)/(iia)/(iii)/35(2AA) → column-3 amount must be 0 (A354).

**Deductions (`ded`) — Chapter VI-A**  (this is the big one the user means by "most parts close")
- New-regime VI-A allow-list is essentially **only**: **80CCD(2)** (employer NPS, capped 14% of basic+DA — A797/A783) and **80CCH** (Agnipath, A795/A796). For a business filer **80JJAA** (Part C, employment generation) also stays allowed. Everything else → 0, shown "closed by section 115BAC".
- Explicitly blanked in the new regime: Schedule 10AA (A633), 80G (A646), 80GGA (A652), 80GGC (A661), Schedule RA (A687), 80-IA/IB/IE (A688), 80C/80E/80EE/80EEA/80EEB (A696), 80D (A710), 80U (A766), 80TTB (A772).
- 57 family-pension deduction capped at ₹25,000 / one-third (A548) — applies in the new regime.

**Part B & AMT (`tax`)**
- Schedule AMT must be **blank** in the new regime (A836). AMT (115JC) applies **only in the old regime**, when Adjusted Total Income > ₹20 lakh and there are add-backs (Part C VI-A deductions + 10AA + 35AD): tax = 18.5% of adjusted TI (9% for an IFSC-area assessee) — A830, A835. ITR-3's AMT trigger set is wider than ITR-2's (which was only 80QQB/80RRB).
- Slabs, surcharge cap (25% new vs 37% old), and 87A rebate (new: up to ₹60,000 for TI ≤ ₹12L) all switch on `isNew()` — see the ITR-2 `engTax`.

## What STAYS OPEN in the new regime
Employer NPS 80CCD(2), 80CCH, business 80JJAA; the ₹75,000 standard deduction; family-pension deduction (capped ₹25,000); all income heads and their computation; taxes paid; exempt income; foreign assets; AL. Only the *concessions* close, not the income side.

## Form 10-IEA (the opt-out mechanism for business filers) — Part A General (`who`)
A person with business/profession income opts out (or re-enters) the new regime **only** via Form 10-IEA, and it is sticky. The Part A General questions and their mandatory Form-10IEA detail rows are governed by A41–A45: capture acknowledgement no. + date when opting out for the current AY (A45) or re-entering (A42/A44). The old regime cannot be opted after the 139(1) due date (mirror ITR-2 rule A21 → the equivalent ITR-3 rule).

## Build checklist for every affected section-builder
1. Gate the field in the **renderer** on `isNew()` — closed items render as `cell(0)` or a `note`, never as a live input.
2. Zero the item in the **engine** when `isNew()` closes it — do not rely on the UI alone (the export reads the engine).
3. Keep the **check** (`55_checks`) that warns when a closed item carries a value (mirror the rule's text).
4. The `ret` section shows the **both-ways** comparison.
5. Re-run with `optout="Yes"` and `="No"`; confirm the right things open and close in each.
