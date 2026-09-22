# ITR-5 · LEAF-COVERAGE CHECK — AREA `ded`

Chapter VI-A and the profit-linked deduction schedules.
Scope: the 12 schema blocks under `ITR.ITR5` assigned to this area —
`ScheduleVIA`, `Schedule80G`, `Schedule80GGA`, `Schedule80GGC`, `Schedule80RA`,
`Schedule80_IA`, `Schedule80_IB`, `Schedule80_IC`, `Schedule80IAC`, `Schedule80LA`,
`Schedule80P`, `Schedule10AA`.

Schema: `sources/ITR-5/ITR-5_2026_Main_V1_1_schema.json` (draft-04).
Software: `forms/ITR-5/Yukti_ITR5.html` (built) · `forms/ITR-5/src/70_sec_ded.js` (section source).

## Verdict

**243 leaves enumerated · 243 homed · 0 ORPHANs · 0 required-leaf ORPHANs.**

| bucket | count |
|---|---:|
| INPUT | 133 |
| COMPUTED | 110 |
| NA | 0 |
| **ORPHAN** | **0** |
| **total** | **243** |

Per block:

| block | leaves | INPUT | COMPUTED | ORPHAN |
|---|---:|---:|---:|---:|
| `ScheduleVIA` | 34 | 4 | 30 | 0 |
| `Schedule80G` | 72 | 48 | 24 | 0 |
| `Schedule80GGA` | 15 | 10 | 5 | 0 |
| `Schedule80GGC` | 13 | 7 | 6 | 0 |
| `Schedule80RA` | 14 | 8 | 6 | 0 |
| `Schedule80_IA` | 6 | 2 | 4 | 0 |
| `Schedule80_IB` | 12 | 5 | 7 | 0 |
| `Schedule80_IC` | 19 | 8 | 11 | 0 |
| `Schedule80IAC` | 5 | 5 | 0 | 0 |
| `Schedule80LA` | 9 | 8 | 1 | 0 |
| `Schedule80P` | 41 | 26 | 15 | 0 |
| `Schedule10AA` | 3 | 2 | 1 | 0 |
| **total** | **243** | **133** | **110** | **0** |

## How this was proved (not just grepped)

1. **Enumeration** — the schema was walked from `#/definitions/ITR → ITR5`, resolving every
   `$ref` (the file uses refs throughout, so a naive `properties` walk finds nothing). A leaf =
   a property with no nested `properties`/`items`. Result: 243 leaves across the 12 blocks.
2. **Live export** — the built `Yukti_ITR5.html` was loaded in Chromium (Playwright), seeded with
   `tests/ITR-5/state.js` plus a *maximal* `S.ded` (all four 80G buckets, 80GGA, RA, 80GGC, both
   80-IA clauses × 2 undertakings, all five 80-IB clauses, all eight 80-IE states, 80-IAC, both
   80-LA sub-sections, all thirteen 80P rows, two 10AA units, all four keyed VI-A boxes), old
   regime. `buildReturn()` was then run and the emitted JSON flattened to leaf paths.
   **239 of 243 emitted in that one run; 0 keys emitted that the schema does not define.**
3. **The 4 that did not emit** are guarded by `put()`'s `if(v===undefined||v===null||v==='')return`
   plus the `if(v)` in the `DED_VIA` loop — they were legitimately zero under that scenario's facts
   (`Section80GGA` is zeroed when the assessee has business income, VI_A.md `[K6]`; `Section80LA`
   is zeroed when the IFSC-forex flag is "Yes", VI_A.md `[K18]`). A second scenario
   (`S.fs.foreignExch="N"`, no business income) emitted both:
   `Section80GGA usr=61200 ded=61200`, `Section80LA usr=300000 ded=300000`. **All 243 proven.**
4. **Screen fields** — every `ded` card was force-opened and the DOM queried: **162 `data-p`**
   controls exist in the section, and each INPUT leaf below names the one that feeds it.
5. **Schema validation** — each of the 12 emitted blocks was validated with `Draft4Validator`
   against its own schema node: **12 valid, 0 invalid.**

## Findings (no ORPHANs — but three defects worth fixing)

### D1 · `UsrDeductUndChapVIA` carries the *allowed* figure, not the *claimed* one (3 leaves)

`VI_A.md` line 11/25 is explicit: **column I = claimed → `UsrDeductUndChapVIA`**, column K =
System Calculated → `DeductUndChapVIA`. And the col-K formulas *read col I*:

- `[K14] 80IBA = IF(bacValue=1,0,IF(scvia.Section80IBA>GTI, GTI, scvia.Section80IBA))`
- `[K16] 80JJA = IF(bacValue=1,0,IF(scvia.Section80JJA>GTI, GTI, scvia.Section80JJA))`
- `[K17] 80JJAA = MIN(VALUE(scvia.Section80JJAA))`

`expDed` writes the *same* computed value to both sides:

```js
DED_VIA.forEach(x=>{const k=x[0],f=DED_MAP[k];const v=n0(O[k]);
  if(v){put(usr,f,v);put(ded,f,v);}});   /* claimed = allowed (col I = col K per line) */
```

Observed (scenario: user types 99,999,999 into each keyed box; GTI = 4,162,000,
GTI−special = 3,742,000):

| leaf | user typed (`S.ded.v`) | `UsrDeductUndChapVIA` | `DeductUndChapVIA` | should be (col I) |
|---|---:|---:|---:|---:|
| `Section80IAB` | 99,999,999 | 99,999,999 | 99,999,999 | 99,999,999 — OK (no cap, `[K11]`) |
| `Section80IBA` | 99,999,999 | **4,162,000** | 4,162,000 | **99,999,999** |
| `Section80JJA` | 99,999,999 | **4,162,000** | 4,162,000 | **99,999,999** |
| `Section80JJAA` | 99,999,999 | **3,742,000** | 3,742,000 | **99,999,999** |

Secondary point on the same line: `[K17]` for 80JJAA is a bare `MIN(VALUE(scvia.Section80JJAA))`
(i.e. no cap), but `engDed` applies `Math.min(kv("c80jjaa"), gtiNet)`. That extra clamp is a
deliberate choice in the source (*"[K17] SURVIVES new regime; ≤ post-BFLA income"*) and is not
in the book formula — worth a ruling from the CEO alongside the col-I fix.

Knock-on: `UsrDeductUndChapVIA.TotPartCchapterVIA` is `V.partCraw`, which sums the *capped*
per-line `out[k]` values — so the claimed Part-C total is understated too (`[I21] = SUM(I10:I20)`).
The same shape affects the schedule-fed lines only where a clamp exists; for 80IA/80IB/80IE/80IAC/80P
the book's col-K is `MIN(x)*1 == x`, so writing one value to both sides is correct there.

*Not an ORPHAN*: the leaf has a screen field (`data-p="ded.v.c80iba"`) and is written on every
export. It is a wrong-value mapping, not a missing home.

**Fix:** in the `DED_VIA` loop, write the raw claim to `usr` and the computed figure to `ded` —
for the four `DED_KEYED` lines use `kv0(k)` (or the schedule total for fed lines) on the `usr`
side, and set `usr.TotPartCchapterVIA` to the sum of those raw col-I values.

### D2 · zero-valued `Section*` keys are omitted, against the book's build note

`VI_A.md` line 132: *"Emit the two schema objects `UsrDeductUndChapVIA` (col I) and
`DeductUndChapVIA` (col K) **with all 17 keys each**; always emit the three required totals."*
The `if(v)` guard drops any line that computes to zero.

Low severity, and the same book contradicts itself at line 119 (*"All individual `Section*` keys
are optional (present only when that deduction is claimed)"*), which matches the schema —
`required` on both objects is only `TotPartBchapterVIA`, `TotPartCchapterVIA`,
`TotalChapVIADeductions`, and those three are always written. Draft-04 validation passes either
way. Flagging only so the CEO can settle which book line governs.

### D3 · Schedule 10AA row count is not capped at 5

`10AA.md` line 66: *"up to **5 fixed rows** (undertaking No.1..5)"*; line 16: *"Rows 6-10 are the
five undertaking rows"*. The grid `grid("ded.aa",…)` labels its button `"Add a unit (max 5)"` but
neither `grid()` nor `chkDed()` enforces it, and the schema has no `maxItems`, so a 6th row
exports silently. Cosmetic against the schema, wrong against the department utility.

## Things checked and found CORRECT (so they are not raised as defects)

- **Two undertakings per 80-IA/80-IB/80-IE clause.** The schema sets no `maxItems` on
  `Sch80DeductAmtDtls`, so this looked like a capacity gap. `80.md` line 91 settles it:
  *"Per clause, exactly two undertaking amounts … max 2 entries … Not an open add-row list —
  the two rows are fixed."* `dedClauseUnd()` renders exactly Undertaking 1 / Undertaking 2, and
  `sum2Disp`/`amtDtls` implement `[C3]` (*"If no entry is made in first row then other rows will
  not be considered"*). Correct.
- **The required clause objects are always emitted, zero-filled.** `Schedule80_IA.required` lists
  both clause objects, `Schedule80_IB.required` all five, `Schedule80_IC.DeductInNorthEast.required`
  all eight states + the total. `amtDtls()` pushes `{DeductAmountSec80:0}` when a clause is empty,
  so a partially-used schedule still validates. Correct.
- **The 80G bucket-C/bucket-D total key names.** `DED_G80BLK` maps bucket C to `TotDon100Percent` /
  `TotElgDon100Percent` — the same spelling bucket A uses. That is not a copy-paste bug: the schema
  really does reuse those two names inside `Don100PercentApprReqd`. Verified against the schema and
  by the emitted-vs-schema diff (0 illegal keys).
- **80GGA `StateCode` enum includes `99` (foreign); the dropdown offers only 01–37.** Not a gap:
  `80GGA.md` line 23 — *"mandatory; 37-state enum (no foreign)"* — and line 79 names the utility's
  own range `StateWithoutForeign` *(no foreign option)*. The schema is wider than the form the
  department ships. `DED_STOPTS` correctly matches the utility.
- **Sikkim's location code.** `80.md` prints `INDSTRL_SIKKIM`; the schema pattern is
  `INDSRTL_SIKKIM`. `70_sec_ded.js` emits the schema spelling and says why in a comment. Correct.
- **80-IE hidden clauses** (Himachal Pradesh, Uttaranchal, and the duplicate Sikkim rows at `80.md`
  line 110) have *no schema key exposed*, so they generate no leaves and cannot be ORPHANs.
- **No 80C / 80D / 80DD / 80U / 80E / 80TTA / 80M rows.** `VI_A.md` line 62 confirms ITR-5's
  Chapter VI-A is only the donation lines (Part B) and the business lines (Part C). No leaves exist
  for them in the ITR-5 schema, so nothing is missing.
- **No other `Schedule80*` block exists.** `ITR5` has 58 properties; the ones matching
  `80|10AA|VIA` are exactly the 12 assigned here.

## Full leaf table

`required?` = the leaf is in its immediate parent object's `required` array. None of the 12 blocks
is itself required at `ITR5` level, so every "Y" is *conditionally* required — mandatory once that
block/row is present.

`<i>` in a `data-p` path is the grid row index (`grid()` renders `data-p="<key>.<i>.<col>"`).

| # | leaf | schema path | req? | bucket | evidence |
|---:|---|---|:--:|---|---|
| 1 | `Section80G` | `ScheduleVIA.UsrDeductUndChapVIA.Section80G` | — | COMPUTED | expDed DED_VIA loop → `put(usr,"Section80G",…)`; out.c80g  ← engDed80G(TI,otherDed,conc).eligible (Sch 80G grid) |
| 2 | `Section80GGA` | `ScheduleVIA.UsrDeductUndChapVIA.Section80GGA` | — | COMPUTED | expDed DED_VIA loop → `put(usr,"Section80GGA",…)`; out.c80gga ← min(Σ eligible gga rows, TI), 0 when business income (VI_A.md [K6]) |
| 3 | `Section80GGC` | `ScheduleVIA.UsrDeductUndChapVIA.Section80GGC` | — | COMPUTED | expDed DED_VIA loop → `put(usr,"Section80GGC",…)`; out.c80ggc ← Σ ggc other-mode, 0 for Local Authority/AJP (VI_A.md [K7]) |
| 4 | `TotPartBchapterVIA` | `ScheduleVIA.UsrDeductUndChapVIA.TotPartBchapterVIA` | Y | COMPUTED | expDed DED_VIA loop → `put(usr,"TotPartBchapterVIA",…)`; Usr=V.partBraw (raw Σ) / Ded=V.partB (clamped to GTI−special, VI_A.md [K8]) |
| 5 | `Section80IA` | `ScheduleVIA.UsrDeductUndChapVIA.Section80IA` | — | COMPUTED | expDed DED_VIA loop → `put(usr,"Section80IA",…)`; out.c80ia = tot80IA = sum2(ded.ia.inf)+sum2(ded.ia.pow) |
| 6 | `Section80IAB` | `ScheduleVIA.UsrDeductUndChapVIA.Section80IAB` | — | INPUT | `data-p="ded.v.c80iab"` (inp, VI-A "You claim" box) → `put(usr,"Section80IAB",n0(O.c80iab))` |
| 7 | `Section80IAC` | `ScheduleVIA.UsrDeductUndChapVIA.Section80IAC` | — | COMPUTED | expDed DED_VIA loop → `put(usr,"Section80IAC",…)`; out.c80iac = tot80IAC = N(ded.iac.amt) |
| 8 | `Section80IB` | `ScheduleVIA.UsrDeductUndChapVIA.Section80IB` | — | COMPUTED | expDed DED_VIA loop → `put(usr,"Section80IB",…)`; out.c80ib = tot80IB = Σ sum2(ded.ib.*) |
| 9 | `Section80IBA` | `ScheduleVIA.UsrDeductUndChapVIA.Section80IBA` | — | INPUT | `data-p="ded.v.c80iba"` (inp, VI-A "You claim" box) → `put(usr,"Section80IBA",n0(O.c80iba))` |
| 10 | `Section80IC` | `ScheduleVIA.UsrDeductUndChapVIA.Section80IC` | — | COMPUTED | expDed DED_VIA loop → `put(usr,"Section80IC",…)`; out.c80ie = tot80IC = totNE = Σ sum2(ded.ic.*) |
| 11 | `Section80JJA` | `ScheduleVIA.UsrDeductUndChapVIA.Section80JJA` | — | INPUT | `data-p="ded.v.c80jja"` (inp, VI-A "You claim" box) → `put(usr,"Section80JJA",n0(O.c80jja))` |
| 12 | `Section80JJAA` | `ScheduleVIA.UsrDeductUndChapVIA.Section80JJAA` | — | INPUT | `data-p="ded.v.c80jjaa"` (inp, VI-A "You claim" box) → `put(usr,"Section80JJAA",n0(O.c80jjaa))` |
| 13 | `Section80LA` | `ScheduleVIA.UsrDeductUndChapVIA.Section80LA` | — | COMPUTED | expDed DED_VIA loop → `put(usr,"Section80LA",…)`; out.c80la1 = Σ ded.la[sub=80LA(1)].amt, gated on forex="N" (VI_A.md [K18]) |
| 14 | `Section80LA_1A` | `ScheduleVIA.UsrDeductUndChapVIA.Section80LA_1A` | — | COMPUTED | expDed DED_VIA loop → `put(usr,"Section80LA_1A",…)`; out.c80la1a = Σ ded.la[sub=80LA(1A)].amt, gated on forex="Y" (VI_A.md [K19]) |
| 15 | `Section80P` | `ScheduleVIA.UsrDeductUndChapVIA.Section80P` | — | COMPUTED | expDed DED_VIA loop → `put(usr,"Section80P",…)`; out.c80p = engDed80P(conc).totalAmt |
| 16 | `TotPartCchapterVIA` | `ScheduleVIA.UsrDeductUndChapVIA.TotPartCchapterVIA` | Y | COMPUTED | expDed DED_VIA loop → `put(usr,"TotPartCchapterVIA",…)`; Usr=V.partCraw (raw Σ) / Ded=V.partC (clamped to business pool, VI_A.md [K21]) |
| 17 | `TotalChapVIADeductions` | `ScheduleVIA.UsrDeductUndChapVIA.TotalChapVIADeductions` | Y | COMPUTED | expDed DED_VIA loop → `put(usr,"TotalChapVIADeductions",…)`; Usr=V.total / Ded=V.allowed = min(partB+partC, GTI−special) (VI_A.md [K22]) |
| 18 | `Section80G` | `ScheduleVIA.DeductUndChapVIA.Section80G` | — | COMPUTED | expDed DED_VIA loop → `put(ded,"Section80G",…)`; out.c80g  ← engDed80G(TI,otherDed,conc).eligible (Sch 80G grid) |
| 19 | `Section80GGA` | `ScheduleVIA.DeductUndChapVIA.Section80GGA` | — | COMPUTED | expDed DED_VIA loop → `put(ded,"Section80GGA",…)`; out.c80gga ← min(Σ eligible gga rows, TI), 0 when business income (VI_A.md [K6]) |
| 20 | `Section80GGC` | `ScheduleVIA.DeductUndChapVIA.Section80GGC` | — | COMPUTED | expDed DED_VIA loop → `put(ded,"Section80GGC",…)`; out.c80ggc ← Σ ggc other-mode, 0 for Local Authority/AJP (VI_A.md [K7]) |
| 21 | `TotPartBchapterVIA` | `ScheduleVIA.DeductUndChapVIA.TotPartBchapterVIA` | Y | COMPUTED | expDed DED_VIA loop → `put(ded,"TotPartBchapterVIA",…)`; Usr=V.partBraw (raw Σ) / Ded=V.partB (clamped to GTI−special, VI_A.md [K8]) |
| 22 | `Section80IA` | `ScheduleVIA.DeductUndChapVIA.Section80IA` | — | COMPUTED | expDed DED_VIA loop → `put(ded,"Section80IA",…)`; out.c80ia = tot80IA = sum2(ded.ia.inf)+sum2(ded.ia.pow) |
| 23 | `Section80IAB` | `ScheduleVIA.DeductUndChapVIA.Section80IAB` | — | COMPUTED | `out.c80iab` = `conc?0:kv("c80iab")` — no cap (VI_A.md `[K11]= MIN(VALUE(scvia.Section80IAB))*1`) → `put(ded,"Section80IAB",…)` |
| 24 | `Section80IAC` | `ScheduleVIA.DeductUndChapVIA.Section80IAC` | — | COMPUTED | expDed DED_VIA loop → `put(ded,"Section80IAC",…)`; out.c80iac = tot80IAC = N(ded.iac.amt) |
| 25 | `Section80IB` | `ScheduleVIA.DeductUndChapVIA.Section80IB` | — | COMPUTED | expDed DED_VIA loop → `put(ded,"Section80IB",…)`; out.c80ib = tot80IB = Σ sum2(ded.ib.*) |
| 26 | `Section80IBA` | `ScheduleVIA.DeductUndChapVIA.Section80IBA` | — | COMPUTED | `out.c80iba` = `conc?0:min(kv("c80iba"),gti)` (VI_A.md `[K14]` — zeroed under new regime, else capped at GTI) → `put(ded,"Section80IBA",…)` |
| 27 | `Section80IC` | `ScheduleVIA.DeductUndChapVIA.Section80IC` | — | COMPUTED | expDed DED_VIA loop → `put(ded,"Section80IC",…)`; out.c80ie = tot80IC = totNE = Σ sum2(ded.ic.*) |
| 28 | `Section80JJA` | `ScheduleVIA.DeductUndChapVIA.Section80JJA` | — | COMPUTED | `out.c80jja` = `conc?0:min(kv("c80jja"),gti)` (VI_A.md `[K16]` — zeroed under new regime, else capped at GTI) → `put(ded,"Section80JJA",…)` |
| 29 | `Section80JJAA` | `ScheduleVIA.DeductUndChapVIA.Section80JJAA` | — | COMPUTED | `out.c80jjaa` = `min(kv("c80jjaa"),gtiNet)` (VI_A.md `[K17]`, survives the new regime) → `put(ded,"Section80JJAA",…)` |
| 30 | `Section80LA` | `ScheduleVIA.DeductUndChapVIA.Section80LA` | — | COMPUTED | expDed DED_VIA loop → `put(ded,"Section80LA",…)`; out.c80la1 = Σ ded.la[sub=80LA(1)].amt, gated on forex="N" (VI_A.md [K18]) |
| 31 | `Section80LA_1A` | `ScheduleVIA.DeductUndChapVIA.Section80LA_1A` | — | COMPUTED | expDed DED_VIA loop → `put(ded,"Section80LA_1A",…)`; out.c80la1a = Σ ded.la[sub=80LA(1A)].amt, gated on forex="Y" (VI_A.md [K19]) |
| 32 | `Section80P` | `ScheduleVIA.DeductUndChapVIA.Section80P` | — | COMPUTED | expDed DED_VIA loop → `put(ded,"Section80P",…)`; out.c80p = engDed80P(conc).totalAmt |
| 33 | `TotPartCchapterVIA` | `ScheduleVIA.DeductUndChapVIA.TotPartCchapterVIA` | Y | COMPUTED | expDed DED_VIA loop → `put(ded,"TotPartCchapterVIA",…)`; Usr=V.partCraw (raw Σ) / Ded=V.partC (clamped to business pool, VI_A.md [K21]) |
| 34 | `TotalChapVIADeductions` | `ScheduleVIA.DeductUndChapVIA.TotalChapVIADeductions` | Y | COMPUTED | expDed DED_VIA loop → `put(ded,"TotalChapVIADeductions",…)`; Usr=V.total / Ded=V.allowed = min(partB+partC, GTI−special) (VI_A.md [K22]) |
| 35 | `DoneeName` | `Schedule80G.Don100Percent.DoneeDetail[].DoneeName` | Y | INPUT | `data-p="ded.g80.<i>.name"` (dedDoneeTbl grid col `name`) → expDed `mk()` `DoneeName` |
| 36 | `DoneePAN` | `Schedule80G.Don100Percent.DoneeDetail[].DoneePAN` | Y | INPUT | `data-p="ded.g80.<i>.pan"` (dedDoneeTbl grid col `pan`) → expDed `mk()` `DoneePAN` |
| 37 | `AddrDetail` | `Schedule80G.Don100Percent.DoneeDetail[].AddressDetail.AddrDetail` | Y | INPUT | `data-p="ded.g80.<i>.addr"` (dedDoneeTbl grid col `addr`) → expDed `mk()` `AddrDetail` |
| 38 | `CityOrTownOrDistrict` | `Schedule80G.Don100Percent.DoneeDetail[].AddressDetail.CityOrTownOrDistrict` | Y | INPUT | `data-p="ded.g80.<i>.city"` (dedDoneeTbl grid col `city`) → expDed `mk()` `CityOrTownOrDistrict` |
| 39 | `StateCode` | `Schedule80G.Don100Percent.DoneeDetail[].AddressDetail.StateCode` | Y | INPUT | `data-p="ded.g80.<i>.state"` (dedDoneeTbl grid col `state`) → expDed `mk()` `StateCode` |
| 40 | `PinCode` | `Schedule80G.Don100Percent.DoneeDetail[].AddressDetail.PinCode` | Y | INPUT | `data-p="ded.g80.<i>.pin"` (dedDoneeTbl grid col `pin`) → expDed `mk()` `PinCode` |
| 41 | `DonationAmtCash` | `Schedule80G.Don100Percent.DoneeDetail[].DonationAmtCash` | Y | INPUT | `data-p="ded.g80.<i>.cash"` (dedDoneeTbl grid col `cash`) → expDed `mk()` `DonationAmtCash` |
| 42 | `DonationAmtOtherMode` | `Schedule80G.Don100Percent.DoneeDetail[].DonationAmtOtherMode` | Y | INPUT | `data-p="ded.g80.<i>.other"` (dedDoneeTbl grid col `other`) → expDed `mk()` `DonationAmtOtherMode` |
| 43 | `TransactionRefNum` | `Schedule80G.Don100Percent.DoneeDetail[].TransactionRefNum` | — | INPUT | `data-p="ded.g80.<i>.ref"` (dedDoneeTbl grid col `ref`) → expDed `mk()` `TransactionRefNum` |
| 44 | `IFSCCode` | `Schedule80G.Don100Percent.DoneeDetail[].IFSCCode` | — | INPUT | `data-p="ded.g80.<i>.ifsc"` (dedDoneeTbl grid col `ifsc`) → expDed `mk()` `IFSCCode` |
| 45 | `DonationAmt` | `Schedule80G.Don100Percent.DoneeDetail[].DonationAmt` | Y | INPUT | `data-p="ded.g80.<i>.amt"` (dedDoneeTbl grid col `amt`) → expDed `mk()` `DonationAmt` |
| 46 | `DonationElgAmt` | `Schedule80G.Don100Percent.DoneeDetail[].DonationElgAmt` | Y | COMPUTED | `DonationElgAmt:n0((cash>2000?0:cash)+oth)` in expDed `mk()` (80G.md: cash > ₹2,000 not eligible) |
| 47 | `ArnNbr` | `Schedule80G.Don100Percent.DoneeDetail[].ArnNbr` | — | INPUT | `data-p="ded.g80.<i>.arn"` (dedDoneeTbl grid col `arn`) → expDed `mk()` `ArnNbr` |
| 48 | `TotDon100PercentCash` | `Schedule80G.Don100Percent.TotDon100PercentCash` | Y | COMPUTED | expDed `blk[M.*]` / top total; engDed80G cashTot.A |
| 49 | `TotDon100PercentOtherMode` | `Schedule80G.Don100Percent.TotDon100PercentOtherMode` | Y | COMPUTED | expDed `blk[M.*]` / top total; engDed80G othTot.A |
| 50 | `TotDon100Percent` | `Schedule80G.Don100Percent.TotDon100Percent` | Y | COMPUTED | expDed `blk[M.*]` / top total; engDed80G donTot (bucket A / bucket C) |
| 51 | `TotElgDon100Percent` | `Schedule80G.Don100Percent.TotElgDon100Percent` | Y | COMPUTED | expDed `blk[M.*]` / top total; engDed80G Aelig / Celig |
| 52 | `DoneeName` | `Schedule80G.Don50PercentNoApprReqd.DoneeDetail[].DoneeName` | Y | INPUT | `data-p="ded.g80.<i>.name"` (dedDoneeTbl grid col `name`) → expDed `mk()` `DoneeName` |
| 53 | `DoneePAN` | `Schedule80G.Don50PercentNoApprReqd.DoneeDetail[].DoneePAN` | Y | INPUT | `data-p="ded.g80.<i>.pan"` (dedDoneeTbl grid col `pan`) → expDed `mk()` `DoneePAN` |
| 54 | `AddrDetail` | `Schedule80G.Don50PercentNoApprReqd.DoneeDetail[].AddressDetail.AddrDetail` | Y | INPUT | `data-p="ded.g80.<i>.addr"` (dedDoneeTbl grid col `addr`) → expDed `mk()` `AddrDetail` |
| 55 | `CityOrTownOrDistrict` | `Schedule80G.Don50PercentNoApprReqd.DoneeDetail[].AddressDetail.CityOrTownOrDistrict` | Y | INPUT | `data-p="ded.g80.<i>.city"` (dedDoneeTbl grid col `city`) → expDed `mk()` `CityOrTownOrDistrict` |
| 56 | `StateCode` | `Schedule80G.Don50PercentNoApprReqd.DoneeDetail[].AddressDetail.StateCode` | Y | INPUT | `data-p="ded.g80.<i>.state"` (dedDoneeTbl grid col `state`) → expDed `mk()` `StateCode` |
| 57 | `PinCode` | `Schedule80G.Don50PercentNoApprReqd.DoneeDetail[].AddressDetail.PinCode` | Y | INPUT | `data-p="ded.g80.<i>.pin"` (dedDoneeTbl grid col `pin`) → expDed `mk()` `PinCode` |
| 58 | `DonationAmtCash` | `Schedule80G.Don50PercentNoApprReqd.DoneeDetail[].DonationAmtCash` | Y | INPUT | `data-p="ded.g80.<i>.cash"` (dedDoneeTbl grid col `cash`) → expDed `mk()` `DonationAmtCash` |
| 59 | `DonationAmtOtherMode` | `Schedule80G.Don50PercentNoApprReqd.DoneeDetail[].DonationAmtOtherMode` | Y | INPUT | `data-p="ded.g80.<i>.other"` (dedDoneeTbl grid col `other`) → expDed `mk()` `DonationAmtOtherMode` |
| 60 | `TransactionRefNum` | `Schedule80G.Don50PercentNoApprReqd.DoneeDetail[].TransactionRefNum` | — | INPUT | `data-p="ded.g80.<i>.ref"` (dedDoneeTbl grid col `ref`) → expDed `mk()` `TransactionRefNum` |
| 61 | `IFSCCode` | `Schedule80G.Don50PercentNoApprReqd.DoneeDetail[].IFSCCode` | — | INPUT | `data-p="ded.g80.<i>.ifsc"` (dedDoneeTbl grid col `ifsc`) → expDed `mk()` `IFSCCode` |
| 62 | `DonationAmt` | `Schedule80G.Don50PercentNoApprReqd.DoneeDetail[].DonationAmt` | Y | INPUT | `data-p="ded.g80.<i>.amt"` (dedDoneeTbl grid col `amt`) → expDed `mk()` `DonationAmt` |
| 63 | `DonationElgAmt` | `Schedule80G.Don50PercentNoApprReqd.DoneeDetail[].DonationElgAmt` | Y | COMPUTED | `DonationElgAmt:n0((cash>2000?0:cash)+oth)` in expDed `mk()` (80G.md: cash > ₹2,000 not eligible) |
| 64 | `ArnNbr` | `Schedule80G.Don50PercentNoApprReqd.DoneeDetail[].ArnNbr` | — | INPUT | `data-p="ded.g80.<i>.arn"` (dedDoneeTbl grid col `arn`) → expDed `mk()` `ArnNbr` |
| 65 | `TotDon50PercentNoApprReqdCash` | `Schedule80G.Don50PercentNoApprReqd.TotDon50PercentNoApprReqdCash` | Y | COMPUTED | expDed `blk[M.*]` / top total; engDed80G cashTot.B |
| 66 | `TotDon50PercentNoApprReqdOtherMode` | `Schedule80G.Don50PercentNoApprReqd.TotDon50PercentNoApprReqdOtherMode` | Y | COMPUTED | expDed `blk[M.*]` / top total; engDed80G othTot.B |
| 67 | `TotDon50PercentNoApprReqd` | `Schedule80G.Don50PercentNoApprReqd.TotDon50PercentNoApprReqd` | Y | COMPUTED | expDed `blk[M.*]` / top total; engDed80G donTot.B |
| 68 | `TotElgDon50PercentNoApprReqd` | `Schedule80G.Don50PercentNoApprReqd.TotElgDon50PercentNoApprReqd` | Y | COMPUTED | expDed `blk[M.*]` / top total; engDed80G Belig |
| 69 | `DoneeName` | `Schedule80G.Don100PercentApprReqd.DoneeDetail[].DoneeName` | Y | INPUT | `data-p="ded.g80.<i>.name"` (dedDoneeTbl grid col `name`) → expDed `mk()` `DoneeName` |
| 70 | `DoneePAN` | `Schedule80G.Don100PercentApprReqd.DoneeDetail[].DoneePAN` | Y | INPUT | `data-p="ded.g80.<i>.pan"` (dedDoneeTbl grid col `pan`) → expDed `mk()` `DoneePAN` |
| 71 | `AddrDetail` | `Schedule80G.Don100PercentApprReqd.DoneeDetail[].AddressDetail.AddrDetail` | Y | INPUT | `data-p="ded.g80.<i>.addr"` (dedDoneeTbl grid col `addr`) → expDed `mk()` `AddrDetail` |
| 72 | `CityOrTownOrDistrict` | `Schedule80G.Don100PercentApprReqd.DoneeDetail[].AddressDetail.CityOrTownOrDistrict` | Y | INPUT | `data-p="ded.g80.<i>.city"` (dedDoneeTbl grid col `city`) → expDed `mk()` `CityOrTownOrDistrict` |
| 73 | `StateCode` | `Schedule80G.Don100PercentApprReqd.DoneeDetail[].AddressDetail.StateCode` | Y | INPUT | `data-p="ded.g80.<i>.state"` (dedDoneeTbl grid col `state`) → expDed `mk()` `StateCode` |
| 74 | `PinCode` | `Schedule80G.Don100PercentApprReqd.DoneeDetail[].AddressDetail.PinCode` | Y | INPUT | `data-p="ded.g80.<i>.pin"` (dedDoneeTbl grid col `pin`) → expDed `mk()` `PinCode` |
| 75 | `DonationAmtCash` | `Schedule80G.Don100PercentApprReqd.DoneeDetail[].DonationAmtCash` | Y | INPUT | `data-p="ded.g80.<i>.cash"` (dedDoneeTbl grid col `cash`) → expDed `mk()` `DonationAmtCash` |
| 76 | `DonationAmtOtherMode` | `Schedule80G.Don100PercentApprReqd.DoneeDetail[].DonationAmtOtherMode` | Y | INPUT | `data-p="ded.g80.<i>.other"` (dedDoneeTbl grid col `other`) → expDed `mk()` `DonationAmtOtherMode` |
| 77 | `TransactionRefNum` | `Schedule80G.Don100PercentApprReqd.DoneeDetail[].TransactionRefNum` | — | INPUT | `data-p="ded.g80.<i>.ref"` (dedDoneeTbl grid col `ref`) → expDed `mk()` `TransactionRefNum` |
| 78 | `IFSCCode` | `Schedule80G.Don100PercentApprReqd.DoneeDetail[].IFSCCode` | — | INPUT | `data-p="ded.g80.<i>.ifsc"` (dedDoneeTbl grid col `ifsc`) → expDed `mk()` `IFSCCode` |
| 79 | `DonationAmt` | `Schedule80G.Don100PercentApprReqd.DoneeDetail[].DonationAmt` | Y | INPUT | `data-p="ded.g80.<i>.amt"` (dedDoneeTbl grid col `amt`) → expDed `mk()` `DonationAmt` |
| 80 | `DonationElgAmt` | `Schedule80G.Don100PercentApprReqd.DoneeDetail[].DonationElgAmt` | Y | COMPUTED | `DonationElgAmt:n0((cash>2000?0:cash)+oth)` in expDed `mk()` (80G.md: cash > ₹2,000 not eligible) |
| 81 | `ArnNbr` | `Schedule80G.Don100PercentApprReqd.DoneeDetail[].ArnNbr` | — | INPUT | `data-p="ded.g80.<i>.arn"` (dedDoneeTbl grid col `arn`) → expDed `mk()` `ArnNbr` |
| 82 | `TotDon100PercentApprReqdCash` | `Schedule80G.Don100PercentApprReqd.TotDon100PercentApprReqdCash` | Y | COMPUTED | expDed `blk[M.*]` / top total; engDed80G cashTot.C |
| 83 | `TotDon100PercentApprReqdOtherMode` | `Schedule80G.Don100PercentApprReqd.TotDon100PercentApprReqdOtherMode` | Y | COMPUTED | expDed `blk[M.*]` / top total; engDed80G othTot.C |
| 84 | `TotDon100Percent` | `Schedule80G.Don100PercentApprReqd.TotDon100Percent` | Y | COMPUTED | expDed `blk[M.*]` / top total; engDed80G donTot (bucket A / bucket C) |
| 85 | `TotElgDon100Percent` | `Schedule80G.Don100PercentApprReqd.TotElgDon100Percent` | Y | COMPUTED | expDed `blk[M.*]` / top total; engDed80G Aelig / Celig |
| 86 | `DoneeName` | `Schedule80G.Don50PercentApprReqd.DoneeDetail[].DoneeName` | Y | INPUT | `data-p="ded.g80.<i>.name"` (dedDoneeTbl grid col `name`) → expDed `mk()` `DoneeName` |
| 87 | `DoneePAN` | `Schedule80G.Don50PercentApprReqd.DoneeDetail[].DoneePAN` | Y | INPUT | `data-p="ded.g80.<i>.pan"` (dedDoneeTbl grid col `pan`) → expDed `mk()` `DoneePAN` |
| 88 | `AddrDetail` | `Schedule80G.Don50PercentApprReqd.DoneeDetail[].AddressDetail.AddrDetail` | Y | INPUT | `data-p="ded.g80.<i>.addr"` (dedDoneeTbl grid col `addr`) → expDed `mk()` `AddrDetail` |
| 89 | `CityOrTownOrDistrict` | `Schedule80G.Don50PercentApprReqd.DoneeDetail[].AddressDetail.CityOrTownOrDistrict` | Y | INPUT | `data-p="ded.g80.<i>.city"` (dedDoneeTbl grid col `city`) → expDed `mk()` `CityOrTownOrDistrict` |
| 90 | `StateCode` | `Schedule80G.Don50PercentApprReqd.DoneeDetail[].AddressDetail.StateCode` | Y | INPUT | `data-p="ded.g80.<i>.state"` (dedDoneeTbl grid col `state`) → expDed `mk()` `StateCode` |
| 91 | `PinCode` | `Schedule80G.Don50PercentApprReqd.DoneeDetail[].AddressDetail.PinCode` | Y | INPUT | `data-p="ded.g80.<i>.pin"` (dedDoneeTbl grid col `pin`) → expDed `mk()` `PinCode` |
| 92 | `DonationAmtCash` | `Schedule80G.Don50PercentApprReqd.DoneeDetail[].DonationAmtCash` | Y | INPUT | `data-p="ded.g80.<i>.cash"` (dedDoneeTbl grid col `cash`) → expDed `mk()` `DonationAmtCash` |
| 93 | `DonationAmtOtherMode` | `Schedule80G.Don50PercentApprReqd.DoneeDetail[].DonationAmtOtherMode` | Y | INPUT | `data-p="ded.g80.<i>.other"` (dedDoneeTbl grid col `other`) → expDed `mk()` `DonationAmtOtherMode` |
| 94 | `TransactionRefNum` | `Schedule80G.Don50PercentApprReqd.DoneeDetail[].TransactionRefNum` | — | INPUT | `data-p="ded.g80.<i>.ref"` (dedDoneeTbl grid col `ref`) → expDed `mk()` `TransactionRefNum` |
| 95 | `IFSCCode` | `Schedule80G.Don50PercentApprReqd.DoneeDetail[].IFSCCode` | — | INPUT | `data-p="ded.g80.<i>.ifsc"` (dedDoneeTbl grid col `ifsc`) → expDed `mk()` `IFSCCode` |
| 96 | `DonationAmt` | `Schedule80G.Don50PercentApprReqd.DoneeDetail[].DonationAmt` | Y | INPUT | `data-p="ded.g80.<i>.amt"` (dedDoneeTbl grid col `amt`) → expDed `mk()` `DonationAmt` |
| 97 | `DonationElgAmt` | `Schedule80G.Don50PercentApprReqd.DoneeDetail[].DonationElgAmt` | Y | COMPUTED | `DonationElgAmt:n0((cash>2000?0:cash)+oth)` in expDed `mk()` (80G.md: cash > ₹2,000 not eligible) |
| 98 | `ArnNbr` | `Schedule80G.Don50PercentApprReqd.DoneeDetail[].ArnNbr` | — | INPUT | `data-p="ded.g80.<i>.arn"` (dedDoneeTbl grid col `arn`) → expDed `mk()` `ArnNbr` |
| 99 | `TotDon50PercentApprReqdCash` | `Schedule80G.Don50PercentApprReqd.TotDon50PercentApprReqdCash` | Y | COMPUTED | expDed `blk[M.*]` / top total; engDed80G cashTot.D |
| 100 | `TotDon50PercentApprReqdOtherMode` | `Schedule80G.Don50PercentApprReqd.TotDon50PercentApprReqdOtherMode` | Y | COMPUTED | expDed `blk[M.*]` / top total; engDed80G othTot.D |
| 101 | `TotDon50PercentApprReqd` | `Schedule80G.Don50PercentApprReqd.TotDon50PercentApprReqd` | Y | COMPUTED | expDed `blk[M.*]` / top total; engDed80G donTot.D |
| 102 | `TotElgDon50PercentApprReqd` | `Schedule80G.Don50PercentApprReqd.TotElgDon50PercentApprReqd` | Y | COMPUTED | expDed `blk[M.*]` / top total; engDed80G Delig |
| 103 | `TotalDonationsUs80GCash` | `Schedule80G.TotalDonationsUs80GCash` | Y | COMPUTED | expDed `blk[M.*]` / top total; engDed80G cashAll |
| 104 | `TotalDonationsUs80GOtherMode` | `Schedule80G.TotalDonationsUs80GOtherMode` | Y | COMPUTED | expDed `blk[M.*]` / top total; engDed80G othAll |
| 105 | `TotalDonationsUs80G` | `Schedule80G.TotalDonationsUs80G` | Y | COMPUTED | expDed `blk[M.*]` / top total; engDed80G gross |
| 106 | `TotalEligibleDonationsUs80G` | `Schedule80G.TotalEligibleDonationsUs80G` | Y | COMPUTED | expDed `blk[M.*]` / top total; out.c80g = engDed80G eligible |
| 107 | `RelevantClauseUndrDedClaimed` | `Schedule80GGA.DonationDtlsSciRsrchRuralDev[].RelevantClauseUndrDedClaimed` | Y | INPUT | `data-p="ded.gga.<i>.clause"` (grid `ded.gga` col `clause`) → expDed `RelevantClauseUndrDedClaimed` |
| 108 | `NameOfDonee` | `Schedule80GGA.DonationDtlsSciRsrchRuralDev[].NameOfDonee` | Y | INPUT | `data-p="ded.gga.<i>.name"` (grid `ded.gga` col `name`) → expDed `NameOfDonee` |
| 109 | `AddrDetail` | `Schedule80GGA.DonationDtlsSciRsrchRuralDev[].AddressDetail.AddrDetail` | Y | INPUT | `data-p="ded.gga.<i>.addr"` (grid `ded.gga` col `addr`) → expDed `AddrDetail` |
| 110 | `CityOrTownOrDistrict` | `Schedule80GGA.DonationDtlsSciRsrchRuralDev[].AddressDetail.CityOrTownOrDistrict` | Y | INPUT | `data-p="ded.gga.<i>.city"` (grid `ded.gga` col `city`) → expDed `CityOrTownOrDistrict` |
| 111 | `StateCode` | `Schedule80GGA.DonationDtlsSciRsrchRuralDev[].AddressDetail.StateCode` | Y | INPUT | `data-p="ded.gga.<i>.state"` (grid `ded.gga` col `state`) → expDed `StateCode` |
| 112 | `PinCode` | `Schedule80GGA.DonationDtlsSciRsrchRuralDev[].AddressDetail.PinCode` | Y | INPUT | `data-p="ded.gga.<i>.pin"` (grid `ded.gga` col `pin`) → expDed `PinCode` |
| 113 | `DoneePAN` | `Schedule80GGA.DonationDtlsSciRsrchRuralDev[].DoneePAN` | Y | INPUT | `data-p="ded.gga.<i>.pan"` (grid `ded.gga` col `pan`) → expDed `DoneePAN` |
| 114 | `DonationAmtCash` | `Schedule80GGA.DonationDtlsSciRsrchRuralDev[].DonationAmtCash` | — | INPUT | `data-p="ded.gga.<i>.cash"` (grid `ded.gga` col `cash`) → expDed `DonationAmtCash` |
| 115 | `DonationAmtOtherMode` | `Schedule80GGA.DonationDtlsSciRsrchRuralDev[].DonationAmtOtherMode` | — | INPUT | `data-p="ded.gga.<i>.other"` (grid `ded.gga` col `other`) → expDed `DonationAmtOtherMode` |
| 116 | `DonationAmt` | `Schedule80GGA.DonationDtlsSciRsrchRuralDev[].DonationAmt` | Y | INPUT | `data-p="ded.gga.<i>.amt"` (grid `ded.gga` col `amt`) → expDed `DonationAmt` |
| 117 | `EligibleDonationAmt` | `Schedule80GGA.DonationDtlsSciRsrchRuralDev[].EligibleDonationAmt` | — | COMPUTED | `EligibleDonationAmt:n0((cash>2000?0:cash)+other)` in expDed |
| 118 | `TotalDonationAmtCash80GGA` | `Schedule80GGA.TotalDonationAmtCash80GGA` | — | COMPUTED | expDed `TotalDonationAmtCash80GGA:Σ rows cash` |
| 119 | `TotalDonationAmtOtherMode80GGA` | `Schedule80GGA.TotalDonationAmtOtherMode80GGA` | — | COMPUTED | expDed `TotalDonationAmtOtherMode80GGA:Σ rows other` |
| 120 | `TotalDonationsUs80GGA` | `Schedule80GGA.TotalDonationsUs80GGA` | Y | COMPUTED | expDed `TotalDonationsUs80GGA:cash+oth` |
| 121 | `TotalEligibleDonationAmt80GGA` | `Schedule80GGA.TotalEligibleDonationAmt80GGA` | — | COMPUTED | expDed `TotalEligibleDonationAmt80GGA:n0(O.c80gga)` |
| 122 | `DonationDate` | `Schedule80GGC.Schedule80GGCDetails[].DonationDate` | Y | INPUT | `data-p="ded.ggc.<i>.dt"` (grid `ded.ggc` col `dt`) → expDed `DonationDate` |
| 123 | `DonationAmtCash` | `Schedule80GGC.Schedule80GGCDetails[].DonationAmtCash` | Y | INPUT | `data-p="ded.ggc.<i>.cash"` (grid `ded.ggc` col `cash`) → expDed `DonationAmtCash` |
| 124 | `DonationAmtOtherMode` | `Schedule80GGC.Schedule80GGCDetails[].DonationAmtOtherMode` | Y | INPUT | `data-p="ded.ggc.<i>.other"` (grid `ded.ggc` col `other`) → expDed `DonationAmtOtherMode` |
| 125 | `TransactionRefNum` | `Schedule80GGC.Schedule80GGCDetails[].TransactionRefNum` | — | INPUT | `data-p="ded.ggc.<i>.ref"` (grid `ded.ggc` col `ref`) → expDed `TransactionRefNum` |
| 126 | `IFSCCode` | `Schedule80GGC.Schedule80GGCDetails[].IFSCCode` | — | INPUT | `data-p="ded.ggc.<i>.ifsc"` (grid `ded.ggc` col `ifsc`) → expDed `IFSCCode` |
| 127 | `DonationAmt` | `Schedule80GGC.Schedule80GGCDetails[].DonationAmt` | Y | COMPUTED | `DonationAmt:n0(N(r.cash)+N(r.other))` in expDed |
| 128 | `EligibleDonationAmt` | `Schedule80GGC.Schedule80GGCDetails[].EligibleDonationAmt` | Y | COMPUTED | `EligibleDonationAmt:n0(r.other)` — cash never eligible (80GGC.md) |
| 129 | `PoliticalPartyName` | `Schedule80GGC.Schedule80GGCDetails[].PoliticalPartyName` | — | INPUT | `data-p="ded.ggc.<i>.name"` (grid `ded.ggc` col `name`) → expDed `PoliticalPartyName` |
| 130 | `PoliticalPartyPAN` | `Schedule80GGC.Schedule80GGCDetails[].PoliticalPartyPAN` | — | INPUT | `data-p="ded.ggc.<i>.pan"` (grid `ded.ggc` col `pan`) → expDed `PoliticalPartyPAN` |
| 131 | `TotalDonationAmtCash80GGC` | `Schedule80GGC.TotalDonationAmtCash80GGC` | Y | COMPUTED | expDed `TotalDonationAmtCash80GGC:Σ rows cash` |
| 132 | `TotalDonationAmtOtherMode80GGC` | `Schedule80GGC.TotalDonationAmtOtherMode80GGC` | Y | COMPUTED | expDed `TotalDonationAmtOtherMode80GGC:Σ rows other` |
| 133 | `TotalDonationsUs80GGC` | `Schedule80GGC.TotalDonationsUs80GGC` | Y | COMPUTED | expDed `TotalDonationsUs80GGC:cash+oth` |
| 134 | `TotalEligibleDonationAmt80GGC` | `Schedule80GGC.TotalEligibleDonationAmt80GGC` | Y | COMPUTED | expDed `TotalEligibleDonationAmt80GGC:n0(O.c80ggc)` |
| 135 | `Sch80SectionCode` | `Schedule80_IA.Sch80SectionCode` | Y | COMPUTED | fixed constant `{Sch80SectionCode:"80-IA"}` in expDed (80.md: never a user input) |
| 136 | `Sch80LocOrDescCode` | `Schedule80_IA.DeductUs80_IA_4_i.Sch80LocOrDescCode` | Y | COMPUTED | fixed code `"INFRAFAC"` from DED_IA_CLAUSE (80.md line 23) |
| 137 | `DeductAmountSec80` | `Schedule80_IA.DeductUs80_IA_4_i.Sch80DeductAmtDtls[].DeductAmountSec80` | Y | INPUT | `data-p="ded.ia.inf.0"` / `ded.ia.inf.1` (dedClauseUnd, 2 undertakings) → `amtDtls()` |
| 138 | `Sch80LocOrDescCode` | `Schedule80_IA.DeductUs80_IA_4_iv.Sch80LocOrDescCode` | Y | COMPUTED | fixed code `"POWER"` from DED_IA_CLAUSE (80.md line 23) |
| 139 | `DeductAmountSec80` | `Schedule80_IA.DeductUs80_IA_4_iv.Sch80DeductAmtDtls[].DeductAmountSec80` | Y | INPUT | `data-p="ded.ia.pow.0"` / `ded.ia.pow.1` (dedClauseUnd, 2 undertakings) → `amtDtls()` |
| 140 | `TotSchedule80_IA` | `Schedule80_IA.TotSchedule80_IA` | Y | COMPUTED | `IA.TotSchedule80_IA=n0(O.c80ia)` |
| 141 | `Sch80SectionCode` | `Schedule80_IB.Sch80SectionCode` | Y | COMPUTED | fixed constant `{Sch80SectionCode:"80-IB"}` in expDed |
| 142 | `Sch80LocOrDescCode` | `Schedule80_IB.DeductJKLocUs80_IB_4_Und.Sch80LocOrDescCode` | Y | COMPUTED | fixed code `"INDSRTL_JK"` from DED_IB_CLAUSE (80.md line 35) |
| 143 | `DeductAmountSec80` | `Schedule80_IB.DeductJKLocUs80_IB_4_Und.Sch80DeductAmtDtls[].DeductAmountSec80` | Y | INPUT | `data-p="ded.ib.jk.0"` / `ded.ib.jk.1` (dedClauseUnd) → `amtDtls()` |
| 144 | `Sch80LocOrDescCode` | `Schedule80_IB.DeductMinOilUs80_IB_9_Und.Sch80LocOrDescCode` | Y | COMPUTED | fixed code `"COMM_PROD"` from DED_IB_CLAUSE (80.md line 35) |
| 145 | `DeductAmountSec80` | `Schedule80_IB.DeductMinOilUs80_IB_9_Und.Sch80DeductAmtDtls[].DeductAmountSec80` | Y | INPUT | `data-p="ded.ib.oil.0"` / `ded.ib.oil.1` (dedClauseUnd) → `amtDtls()` |
| 146 | `Sch80LocOrDescCode` | `Schedule80_IB.DeductHousUs80_IB_10_Und.Sch80LocOrDescCode` | Y | COMPUTED | fixed code `"HOUSING_PROJECT"` from DED_IB_CLAUSE (80.md line 35) |
| 147 | `DeductAmountSec80` | `Schedule80_IB.DeductHousUs80_IB_10_Und.Sch80DeductAmtDtls[].DeductAmountSec80` | Y | INPUT | `data-p="ded.ib.hous.0"` / `ded.ib.hous.1` (dedClauseUnd) → `amtDtls()` |
| 148 | `Sch80LocOrDescCode` | `Schedule80_IB.DeductFruitVegUs80_IB_11A_Und.Sch80LocOrDescCode` | Y | COMPUTED | fixed code `"FRIUTS_VEGTBLE"` from DED_IB_CLAUSE (80.md line 35) |
| 149 | `DeductAmountSec80` | `Schedule80_IB.DeductFruitVegUs80_IB_11A_Und.Sch80DeductAmtDtls[].DeductAmountSec80` | Y | INPUT | `data-p="ded.ib.fruit.0"` / `ded.ib.fruit.1` (dedClauseUnd) → `amtDtls()` |
| 150 | `Sch80LocOrDescCode` | `Schedule80_IB.DeductFoodGrainUs80_IB_11A_Und.Sch80LocOrDescCode` | Y | COMPUTED | fixed code `"STOR_TRANS"` from DED_IB_CLAUSE (80.md line 35) |
| 151 | `DeductAmountSec80` | `Schedule80_IB.DeductFoodGrainUs80_IB_11A_Und.Sch80DeductAmtDtls[].DeductAmountSec80` | Y | INPUT | `data-p="ded.ib.food.0"` / `ded.ib.food.1` (dedClauseUnd) → `amtDtls()` |
| 152 | `TotSchedule80_IB` | `Schedule80_IB.TotSchedule80_IB` | Y | COMPUTED | `IB.TotSchedule80_IB=n0(O.c80ib)` |
| 153 | `Sch80SectionCode` | `Schedule80_IC.Sch80SectionCode` | Y | COMPUTED | fixed constant `{Sch80SectionCode:"80-IC_IE"}` in expDed |
| 154 | `Sch80LocOrDescCode` | `Schedule80_IC.DeductInNorthEast.Assam_Und.Sch80LocOrDescCode` | Y | COMPUTED | fixed code `"INDSRTL_ASSAM"` from DED_IC_CLAUSE (80.md line 48) |
| 155 | `DeductAmountSec80` | `Schedule80_IC.DeductInNorthEast.Assam_Und.Sch80DeductAmtDtls[].DeductAmountSec80` | Y | INPUT | `data-p="ded.ic.assam.0"` / `ded.ic.assam.1` (dedClauseUnd) → `amtDtls()` |
| 156 | `Sch80LocOrDescCode` | `Schedule80_IC.DeductInNorthEast.ArunachalPradesh_Und.Sch80LocOrDescCode` | Y | COMPUTED | fixed code `"INDSRTL_ARUNPRADESH"` from DED_IC_CLAUSE (80.md line 48) |
| 157 | `DeductAmountSec80` | `Schedule80_IC.DeductInNorthEast.ArunachalPradesh_Und.Sch80DeductAmtDtls[].DeductAmountSec80` | Y | INPUT | `data-p="ded.ic.arun.0"` / `ded.ic.arun.1` (dedClauseUnd) → `amtDtls()` |
| 158 | `Sch80LocOrDescCode` | `Schedule80_IC.DeductInNorthEast.Manipur_Und.Sch80LocOrDescCode` | Y | COMPUTED | fixed code `"INDSRTL_MANIPUR"` from DED_IC_CLAUSE (80.md line 48) |
| 159 | `DeductAmountSec80` | `Schedule80_IC.DeductInNorthEast.Manipur_Und.Sch80DeductAmtDtls[].DeductAmountSec80` | Y | INPUT | `data-p="ded.ic.mani.0"` / `ded.ic.mani.1` (dedClauseUnd) → `amtDtls()` |
| 160 | `Sch80LocOrDescCode` | `Schedule80_IC.DeductInNorthEast.Mizoram_Und.Sch80LocOrDescCode` | Y | COMPUTED | fixed code `"INDSRTL_MIZORAM"` from DED_IC_CLAUSE (80.md line 48) |
| 161 | `DeductAmountSec80` | `Schedule80_IC.DeductInNorthEast.Mizoram_Und.Sch80DeductAmtDtls[].DeductAmountSec80` | Y | INPUT | `data-p="ded.ic.mizo.0"` / `ded.ic.mizo.1` (dedClauseUnd) → `amtDtls()` |
| 162 | `Sch80LocOrDescCode` | `Schedule80_IC.DeductInNorthEast.Meghalaya_Und.Sch80LocOrDescCode` | Y | COMPUTED | fixed code `"INDSRTL_MEGHALAYA"` from DED_IC_CLAUSE (80.md line 48) |
| 163 | `DeductAmountSec80` | `Schedule80_IC.DeductInNorthEast.Meghalaya_Und.Sch80DeductAmtDtls[].DeductAmountSec80` | Y | INPUT | `data-p="ded.ic.megh.0"` / `ded.ic.megh.1` (dedClauseUnd) → `amtDtls()` |
| 164 | `Sch80LocOrDescCode` | `Schedule80_IC.DeductInNorthEast.Nagaland_Und.Sch80LocOrDescCode` | Y | COMPUTED | fixed code `"INDSRTL_NAGALND"` from DED_IC_CLAUSE (80.md line 48) |
| 165 | `DeductAmountSec80` | `Schedule80_IC.DeductInNorthEast.Nagaland_Und.Sch80DeductAmtDtls[].DeductAmountSec80` | Y | INPUT | `data-p="ded.ic.naga.0"` / `ded.ic.naga.1` (dedClauseUnd) → `amtDtls()` |
| 166 | `Sch80LocOrDescCode` | `Schedule80_IC.DeductInNorthEast.Tripura_Und.Sch80LocOrDescCode` | Y | COMPUTED | fixed code `"INDSRTL_TRIPURA"` from DED_IC_CLAUSE (80.md line 48) |
| 167 | `DeductAmountSec80` | `Schedule80_IC.DeductInNorthEast.Tripura_Und.Sch80DeductAmtDtls[].DeductAmountSec80` | Y | INPUT | `data-p="ded.ic.trip.0"` / `ded.ic.trip.1` (dedClauseUnd) → `amtDtls()` |
| 168 | `Sch80LocOrDescCode` | `Schedule80_IC.DeductInNorthEast.Sikkim_Und.Sch80LocOrDescCode` | Y | COMPUTED | fixed code `"INDSRTL_SIKKIM"` from DED_IC_CLAUSE (80.md line 48) |
| 169 | `DeductAmountSec80` | `Schedule80_IC.DeductInNorthEast.Sikkim_Und.Sch80DeductAmtDtls[].DeductAmountSec80` | Y | INPUT | `data-p="ded.ic.sikk.0"` / `ded.ic.sikk.1` (dedClauseUnd) → `amtDtls()` |
| 170 | `TotDeductInNorthEast` | `Schedule80_IC.DeductInNorthEast.TotDeductInNorthEast` | Y | COMPUTED | `NE.TotDeductInNorthEast=n0(V.totNE)` (80.md Ai r125) |
| 171 | `TotSchedule80_IC` | `Schedule80_IC.TotSchedule80_IC` | Y | COMPUTED | `TotSchedule80_IC:n0(O.c80ie)` (80.md B r127) |
| 172 | `Sec80P2aiCode` | `Schedule80P.Sec80P2aiCode` | — | COMPUTED | `blk[key+"Code"]=DED_80P[0][1]` = fixed nature-of-business code `23001` (80P.md) |
| 173 | `Sec80P2ai` | `Schedule80P.Sec80P2ai` | — | INPUT | `data-p="ded.p.r5.inc"` → `blk[key]=n0(row.inc)` |
| 174 | `Sec80P2aiAmt` | `Schedule80P.Sec80P2aiAmt` | — | INPUT | `data-p="ded.p.r5.amt"` → engDed80P caps to ≤ income / row cap → `blk[key+"Amt"]` |
| 175 | `Sec80P2aiiCode` | `Schedule80P.Sec80P2aiiCode` | — | COMPUTED | `blk[key+"Code"]=DED_80P[1][1]` = fixed nature-of-business code `23002` (80P.md) |
| 176 | `Sec80P2aii` | `Schedule80P.Sec80P2aii` | — | INPUT | `data-p="ded.p.r6.inc"` → `blk[key]=n0(row.inc)` |
| 177 | `Sec80P2aiiAmt` | `Schedule80P.Sec80P2aiiAmt` | — | INPUT | `data-p="ded.p.r6.amt"` → engDed80P caps to ≤ income / row cap → `blk[key+"Amt"]` |
| 178 | `Sec80P2aiiiCode` | `Schedule80P.Sec80P2aiiiCode` | — | COMPUTED | `blk[key+"Code"]=DED_80P[2][1]` = fixed nature-of-business code `23003` (80P.md) |
| 179 | `Sec80P2aiii` | `Schedule80P.Sec80P2aiii` | — | INPUT | `data-p="ded.p.r7.inc"` → `blk[key]=n0(row.inc)` |
| 180 | `Sec80P2aiiiAmt` | `Schedule80P.Sec80P2aiiiAmt` | — | INPUT | `data-p="ded.p.r7.amt"` → engDed80P caps to ≤ income / row cap → `blk[key+"Amt"]` |
| 181 | `Sec80P2aivCode` | `Schedule80P.Sec80P2aivCode` | — | COMPUTED | `blk[key+"Code"]=DED_80P[3][1]` = fixed nature-of-business code `23004` (80P.md) |
| 182 | `Sec80P2aiv` | `Schedule80P.Sec80P2aiv` | — | INPUT | `data-p="ded.p.r8.inc"` → `blk[key]=n0(row.inc)` |
| 183 | `Sec80P2aivAmt` | `Schedule80P.Sec80P2aivAmt` | — | INPUT | `data-p="ded.p.r8.amt"` → engDed80P caps to ≤ income / row cap → `blk[key+"Amt"]` |
| 184 | `Sec80P2avCode` | `Schedule80P.Sec80P2avCode` | — | COMPUTED | `blk[key+"Code"]=DED_80P[4][1]` = fixed nature-of-business code `23005` (80P.md) |
| 185 | `Sec80P2av` | `Schedule80P.Sec80P2av` | — | INPUT | `data-p="ded.p.r9.inc"` → `blk[key]=n0(row.inc)` |
| 186 | `Sec80P2avAmt` | `Schedule80P.Sec80P2avAmt` | — | INPUT | `data-p="ded.p.r9.amt"` → engDed80P caps to ≤ income / row cap → `blk[key+"Amt"]` |
| 187 | `Sec80P2aviCode` | `Schedule80P.Sec80P2aviCode` | — | COMPUTED | `blk[key+"Code"]=DED_80P[5][1]` = fixed nature-of-business code `23006` (80P.md) |
| 188 | `Sec80P2avi` | `Schedule80P.Sec80P2avi` | — | INPUT | `data-p="ded.p.r10.inc"` → `blk[key]=n0(row.inc)` |
| 189 | `Sec80P2aviAmt` | `Schedule80P.Sec80P2aviAmt` | — | INPUT | `data-p="ded.p.r10.amt"` → engDed80P caps to ≤ income / row cap → `blk[key+"Amt"]` |
| 190 | `Sec80P2aviiCode` | `Schedule80P.Sec80P2aviiCode` | — | COMPUTED | `blk[key+"Code"]=DED_80P[6][1]` = fixed nature-of-business code `23007` (80P.md) |
| 191 | `Sec80P2avii` | `Schedule80P.Sec80P2avii` | — | INPUT | `data-p="ded.p.r11.inc"` → `blk[key]=n0(row.inc)` |
| 192 | `Sec80P2aviiAmt` | `Schedule80P.Sec80P2aviiAmt` | — | INPUT | `data-p="ded.p.r11.amt"` → engDed80P caps to ≤ income / row cap → `blk[key+"Amt"]` |
| 193 | `Sec80P2bCode` | `Schedule80P.Sec80P2bCode` | — | COMPUTED | `blk[key+"Code"]=DED_80P[7][1]` = fixed nature-of-business code `23008` (80P.md) |
| 194 | `Sec80P2b` | `Schedule80P.Sec80P2b` | — | INPUT | `data-p="ded.p.r12.inc"` → `blk[key]=n0(row.inc)` |
| 195 | `Sec80P2bAmt` | `Schedule80P.Sec80P2bAmt` | — | INPUT | `data-p="ded.p.r12.amt"` → engDed80P caps to ≤ income / row cap → `blk[key+"Amt"]` |
| 196 | `Sec80P2ciCode` | `Schedule80P.Sec80P2ciCode` | — | COMPUTED | `blk[key+"Code"]=DED_80P[8][1]` = fixed nature-of-business code `23009` (80P.md) |
| 197 | `Sec80P2ci` | `Schedule80P.Sec80P2ci` | — | INPUT | `data-p="ded.p.r13.inc"` → `blk[key]=n0(row.inc)` |
| 198 | `Sec80P2ciAmt` | `Schedule80P.Sec80P2ciAmt` | — | INPUT | `data-p="ded.p.r13.amt"` → engDed80P caps to ≤ income / row cap → `blk[key+"Amt"]` |
| 199 | `Sec80P2ciiCode` | `Schedule80P.Sec80P2ciiCode` | — | COMPUTED | `blk[key+"Code"]=DED_80P[9][1]` = fixed nature-of-business code `23010` (80P.md) |
| 200 | `Sec80P2cii` | `Schedule80P.Sec80P2cii` | — | INPUT | `data-p="ded.p.r14.inc"` → `blk[key]=n0(row.inc)` |
| 201 | `Sec80P2ciiAmt` | `Schedule80P.Sec80P2ciiAmt` | — | INPUT | `data-p="ded.p.r14.amt"` → engDed80P caps to ≤ income / row cap → `blk[key+"Amt"]` |
| 202 | `Sec80P2dCode` | `Schedule80P.Sec80P2dCode` | — | COMPUTED | `blk[key+"Code"]=DED_80P[10][1]` = fixed nature-of-business code `23011` (80P.md) |
| 203 | `Sec80P2d` | `Schedule80P.Sec80P2d` | — | INPUT | `data-p="ded.p.r15.inc"` → `blk[key]=n0(row.inc)` |
| 204 | `Sec80P2dAmt` | `Schedule80P.Sec80P2dAmt` | — | INPUT | `data-p="ded.p.r15.amt"` → engDed80P caps to ≤ income / row cap → `blk[key+"Amt"]` |
| 205 | `Sec80P2eCode` | `Schedule80P.Sec80P2eCode` | — | COMPUTED | `blk[key+"Code"]=DED_80P[11][1]` = fixed nature-of-business code `23012` (80P.md) |
| 206 | `Sec80P2e` | `Schedule80P.Sec80P2e` | — | INPUT | `data-p="ded.p.r16.inc"` → `blk[key]=n0(row.inc)` |
| 207 | `Sec80P2eAmt` | `Schedule80P.Sec80P2eAmt` | — | INPUT | `data-p="ded.p.r16.amt"` → engDed80P caps to ≤ income / row cap → `blk[key+"Amt"]` |
| 208 | `Sec80P2fCode` | `Schedule80P.Sec80P2fCode` | — | COMPUTED | `blk[key+"Code"]=DED_80P[12][1]` = fixed nature-of-business code `23013` (80P.md) |
| 209 | `Sec80P2f` | `Schedule80P.Sec80P2f` | — | INPUT | `data-p="ded.p.r17.inc"` → `blk[key]=n0(row.inc)` |
| 210 | `Sec80P2fAmt` | `Schedule80P.Sec80P2fAmt` | — | INPUT | `data-p="ded.p.r17.amt"` → engDed80P caps to ≤ income / row cap → `blk[key+"Amt"]` |
| 211 | `Sec80PTotal` | `Schedule80P.Sec80PTotal` | Y | COMPUTED | `blk.Sec80PTotal=n0(V.p80.total)` = Σ row income |
| 212 | `Sec80PTotalAmt` | `Schedule80P.Sec80PTotalAmt` | Y | COMPUTED | `blk.Sec80PTotalAmt=n0(V.p80.totalAmt)` = Σ capped row amounts |
| 213 | `AssmtYrUnit` | `Schedule10AA.DeductSEZ.DedUs10Detail.Undertaking.DedFromUndertakingWithAy[].AssmtYrUnit` | Y | INPUT | `data-p="ded.aa.<i>.ay"` (grid `ded.aa`, sel DED_AAAY) → `AssmtYrUnit` |
| 214 | `DedUs10Sub` | `Schedule10AA.DeductSEZ.DedUs10Detail.Undertaking.DedFromUndertakingWithAy[].DedUs10Sub` | Y | INPUT | `data-p="ded.aa.<i>.amt"` (grid `ded.aa`) → `DedUs10Sub:n0(r.amt)` |
| 215 | `TotalDedUs10Sub` | `Schedule10AA.DeductSEZ.DedUs10Detail.TotalDedUs10Sub` | Y | COMPUTED | `TotalDedUs10Sub:n0(V.ded10AA)` = min(Σ rows, GTI−special−VI-A), 0 in new regime |
| 216 | `DateIncrpStrup` | `Schedule80IAC.DateIncrpStrup` | Y | INPUT | `data-p="ded.iac.dt"` (dte, single-object card d80iac) → expDed `DateIncrpStrup` |
| 217 | `NatureOfBusiness` | `Schedule80IAC.NatureOfBusiness` | Y | INPUT | `data-p="ded.iac.nob"` (inp, single-object card d80iac) → expDed `NatureOfBusiness` |
| 218 | `InterMnstBoardCertNum` | `Schedule80IAC.InterMnstBoardCertNum` | Y | INPUT | `data-p="ded.iac.cert"` (inp, single-object card d80iac) → expDed `InterMnstBoardCertNum` |
| 219 | `FstAYDeduction` | `Schedule80IAC.FstAYDeduction` | Y | INPUT | `data-p="ded.iac.fay"` (sel, single-object card d80iac) → expDed `FstAYDeduction` |
| 220 | `AmtDedCurAY` | `Schedule80IAC.AmtDedCurAY` | Y | INPUT | `data-p="ded.iac.amt"` (inp, single-object card d80iac) → expDed `AmtDedCurAY` |
| 221 | `SubSecDedClmd` | `Schedule80LA.Schedule80LADtls[].SubSecDedClmd` | — | INPUT | `data-p="ded.la.<i>.sub"` (grid `ded.la` col `sub`) → expDed `SubSecDedClmd` |
| 222 | `EntityType` | `Schedule80LA.Schedule80LADtls[].EntityType` | — | INPUT | `data-p="ded.la.<i>.ent"` (grid `ded.la` col `ent`) → expDed `EntityType` |
| 223 | `IncmTypeUnt` | `Schedule80LA.Schedule80LADtls[].IncmTypeUnt` | — | INPUT | `data-p="ded.la.<i>.inc"` (grid `ded.la` col `inc`) → expDed `IncmTypeUnt` |
| 224 | `RegGNTAuth` | `Schedule80LA.Schedule80LADtls[].RegGNTAuth` | — | INPUT | `data-p="ded.la.<i>.auth"` (grid `ded.la` col `auth`) → expDed `RegGNTAuth` |
| 225 | `RegDate` | `Schedule80LA.Schedule80LADtls[].RegDate` | — | INPUT | `data-p="ded.la.<i>.dt"` (grid `ded.la` col `dt`) → expDed `RegDate` |
| 226 | `RegNumber` | `Schedule80LA.Schedule80LADtls[].RegNumber` | — | INPUT | `data-p="ded.la.<i>.regno"` (grid `ded.la` col `regno`) → expDed `RegNumber` |
| 227 | `FstAYDeduction` | `Schedule80LA.Schedule80LADtls[].FstAYDeduction` | — | INPUT | `data-p="ded.la.<i>.fay"` (grid `ded.la` col `fay`) → expDed `FstAYDeduction` |
| 228 | `AmtDedCurAY` | `Schedule80LA.Schedule80LADtls[].AmtDedCurAY` | — | INPUT | `data-p="ded.la.<i>.amt"` (grid `ded.la` col `amt`) → expDed `AmtDedCurAY` |
| 229 | `Total` | `Schedule80LA.Total` | — | COMPUTED | `Total:n0(V.laTot)` = Σ ded.la[].amt |
| 230 | `NameOfDonee` | `Schedule80RA.DonationDtlsRsrchAssctn[].NameOfDonee` | Y | INPUT | `data-p="ded.ra.<i>.name"` (grid `ded.ra` col `name`) → expDed `NameOfDonee` |
| 231 | `AddrDetail` | `Schedule80RA.DonationDtlsRsrchAssctn[].AddressDetail.AddrDetail` | Y | INPUT | `data-p="ded.ra.<i>.addr"` (grid `ded.ra` col `addr`) → expDed `AddrDetail` |
| 232 | `CityOrTownOrDistrict` | `Schedule80RA.DonationDtlsRsrchAssctn[].AddressDetail.CityOrTownOrDistrict` | Y | INPUT | `data-p="ded.ra.<i>.city"` (grid `ded.ra` col `city`) → expDed `CityOrTownOrDistrict` |
| 233 | `StateCode` | `Schedule80RA.DonationDtlsRsrchAssctn[].AddressDetail.StateCode` | Y | INPUT | `data-p="ded.ra.<i>.state"` (grid `ded.ra` col `state`) → expDed `StateCode` |
| 234 | `PinCode` | `Schedule80RA.DonationDtlsRsrchAssctn[].AddressDetail.PinCode` | Y | INPUT | `data-p="ded.ra.<i>.pin"` (grid `ded.ra` col `pin`) → expDed `PinCode` |
| 235 | `DoneePAN` | `Schedule80RA.DonationDtlsRsrchAssctn[].DoneePAN` | Y | INPUT | `data-p="ded.ra.<i>.pan"` (grid `ded.ra` col `pan`) → expDed `DoneePAN` |
| 236 | `DonationAmtCash` | `Schedule80RA.DonationDtlsRsrchAssctn[].DonationAmtCash` | — | INPUT | `data-p="ded.ra.<i>.cash"` (grid `ded.ra` col `cash`) → expDed `DonationAmtCash` |
| 237 | `DonationAmtOtherMode` | `Schedule80RA.DonationDtlsRsrchAssctn[].DonationAmtOtherMode` | — | INPUT | `data-p="ded.ra.<i>.other"` (grid `ded.ra` col `other`) → expDed `DonationAmtOtherMode` |
| 238 | `DonationAmt` | `Schedule80RA.DonationDtlsRsrchAssctn[].DonationAmt` | Y | COMPUTED | `DonationAmt:n0(N(r.cash)+N(r.other))` in expDed |
| 239 | `EligibleDonationAmt` | `Schedule80RA.DonationDtlsRsrchAssctn[].EligibleDonationAmt` | — | COMPUTED | `EligibleDonationAmt:n0(N(r.cash)+N(r.other))` in expDed |
| 240 | `TotalDonationAmtCash80RA` | `Schedule80RA.TotalDonationAmtCash80RA` | — | COMPUTED | expDed `TotalDonationAmtCash80RA:Σ rows cash` |
| 241 | `TotalDonationAmtOtherMode80RA` | `Schedule80RA.TotalDonationAmtOtherMode80RA` | — | COMPUTED | expDed `TotalDonationAmtOtherMode80RA:Σ rows other` |
| 242 | `TotalDonationsUs80RA` | `Schedule80RA.TotalDonationsUs80RA` | Y | COMPUTED | expDed `TotalDonationsUs80RA:cash+oth` |
| 243 | `TotalEligibleDonationAmt80RA` | `Schedule80RA.TotalEligibleDonationAmt80RA` | — | COMPUTED | expDed `TotalEligibleDonationAmt80RA:cash+oth` |

## ORPHANs

**None.** No required-leaf ORPHANs and no optional-leaf ORPHANs in AREA `ded`.
All 243 leaves are reachable: 133 from a `data-p` field on screen, 110 from `engDed` /
`engDed80G` / `engDed80P` or a fixed schema constant written by `expDed`.

