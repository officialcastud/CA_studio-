# Phase 7 — the ITR-6 test client · run log

**Client** S SUDHIR INDUSTRIES PRIVATE LIMITED · PAN TVOPS4373C · incorporated 05/11/2006
(the PIPELINE.md constant identity, read onto a company: the PAN and the 05/11/2006 date are
the company's; the natural person **S SUDHIR** is the Managing Director who verifies the return
and is listed as a Key Person so rule A 868 is satisfied).
Resident · domestic · **unlisted private** company · **normal regime** (Section115BA = "NA") ·
liable to audit u/s 44AB · **not** liable u/s 92E · filed u/s **139(1)** on 15/10/2026,
before the 31/10/2026 due date · turnover FY 2023-24 **not** above Rs 400 crore.

Artefacts: `tests/ITR-6/state.js`, `tests/ITR-6/figures.json`,
`tests/ITR-6/S_SUDHIR_ITR6_AY2026-27_return.json`,
`tests/ITR-6/S_SUDHIR_ITR6_AY2026-27.working.json`.

## Gate status (this run)

| Gate | Result | Note |
|---|---|---|
| 0 | GREEN | sources / skeleton / rules unchanged |
| 1 | GREEN | structure unchanged |
| 2 | GREEN | empty form boots, saves |
| 3 | GREEN | books unchanged |
| 4 | **RED — 1 item** | `schema errors` (16, every one an engine/form defect — see below). node --check OK, no duplicate writers, no page errors, export produced, **both round-trips byte-identical** |
| 5 | **RED — 1 item** | same 16 schema errors; every block the form builds is referenced |
| 6 | GREEN | 0 Category A, 0 Category D (no rule batch is encoded yet) |
| 7 | **RED — 1 item** | `gate 5 red`. Everything Gate 7 owns is green: 67 arrays, **0 empty**; both round-trips identical; **the hand figures match the engine to the rupee** |

## Headline figures (hand-computed, rupees)

    Part B-TI
      1   house property                           16,25,300
      2v  business and profession                  54,15,000
      3e  capital gains                            64,20,000
      4d  other sources                            18,35,000
      5   total of the heads                    1,52,95,300
      6   Schedule CYLA                                  nil
      8   Schedule BFLA                             9,20,000
      9   GROSS TOTAL INCOME                    1,43,75,300
      11c Chapter VI-A                             27,75,000
      12  section 10AA                              5,00,000
      13  TOTAL INCOME                          1,11,00,300
      10/14 special-rate income (Sch SI)           54,90,000
      15  income at normal rates                   56,10,300
      18  deemed total income u/s 115JB          1,23,75,000

    Part B-TTI (as the engine computes it — see defect 5)
      2f  gross tax liability                      28,57,111
      1d  tax on the 115JB deemed income           19,69,110  (normal is higher)
      7   net tax liability                        28,57,111
      8c  interest u/s 234C                            2,316
      9   aggregate liability                      28,59,427
      10e taxes paid                               28,75,000
      12  REFUND DUE                                  15,570

Full arithmetic is in the `_note` of `tests/ITR-6/figures.json`, including the **lawful**
Part B-TTI (25 % domestic rate, 7 % surcharge, MAT credit, s.90/91 relief) that the form
will produce once defects 4, 5 and 6 are fixed: gross tax 23,72,852 · net tax 19,05,636.

## Defects found (left for the CEO — not worked around in the engine)

1. **`forms/ITR-6/src/10_state.js:22`** — `S` pre-seeds `who:{}, gen:{}, accounts:{}, bp:{}, cg:{},
   os:{}, hp:{}, loss:{}, ded:{}, si:{}, ei:{}, mat:{}, fa:{}, al:{}, other:{}, paid:{}, tax:{}`.
   Every section then does `S.<ns> = S.<ns> || {…}`, and `{}` is truthy, so **no section's own
   state seed ever runs**. Expected: `S.hp.on`, `S.cg.on`, `S.os.*`, `S.other.tpsa/td/fd`,
   `S.fa.*`, `S.paid.tds2/tds3/tcs/it`, `S.bp.*` seeded. Actual: all undefined; the form only
   boots because every engine reads defensively. Fix: drop the `{}` placeholders from 10_state.js
   (or make each section seed key-by-key, as `who` / `mat` / `bank` already do).
2. **`forms/ITR-6/src/70_sec_accounts.js`** — the file defines `engAccounts()` and the renderer
   helpers and then **stops at line 693**: there is no `secAccounts`, `expAccounts`,
   `impAccounts`, `chkAccounts` and **no `reg(...)`**. The `accounts` section therefore keeps the
   Phase-4 boot stub, and `PARTA_BSFor6FrmAY13`, `PARTA_BSIndAS`, `PARTA_PL`, `PARTA_PLIndAS`
   (all schema-**required**), `ManufacturingAccount`, `TradingAccount`, their Ind-AS twins,
   `PARTA_OI`, `PARTA_QD` and `PARTA_OL` are exported only as the zero skeleton. The audited
   balance sheet and P&L of the client are recorded as a comment block in `tests/ITR-6/state.js`
   §3 and can be keyed in the moment the section lands.
3. **`forms/ITR-6/src/10_state.js` SKEL** — `CreationInfo` and `Form_ITR6` carry the
   `skeleton.json` placeholders (`"na"`) and **nothing overwrites them**. 7 schema errors:
   `SWCreatedBy`/`JSONCreatedBy` must match `[S][W][0-9]{8}`, `Digest` must be `-` or 44 chars,
   `FormName` = `ITR-6`, `AssessmentYear` = `2026`, `SchemaVer` = `FormVer` = `Ver1.0`.
   `forms/ITR-3/src/10_state.js:22-34` carries the real constants — ITR-6's SKEL was copied
   verbatim from the skeleton instead.
4. **`forms/ITR-6/src/70_sec_fa.js:173` + `:198`** — `(S.fa.fsi||[]).forEach((blk,i)=>{ … })`
   shadows the shell's `blk()` renderer with the row object, and line 198 then calls
   `blk("fsi"+i, …)`. Expected: the FSI country block renders. Actual:
   `TypeError: blk is not a function` the moment Schedule FSI has one row — `paint()` throws and
   the whole form dies. Fix: rename the parameter (e.g. `(row_,i)`). Until then **Schedule FSI
   and Schedule TR cannot be exercised**; the client's two country blocks are parked in
   `tests/ITR-6/state.js` §13 as a comment (relief 1,30,000 u/s 90 + 30,000 u/s 91 = 1,60,000).
5. **`forms/ITR-6/src/70_sec_tax.js:51` (`taxDrivers`) vs `70_sec_who.js:84` (`engWho`)** —
   `engWho` publishes `S.C.who.domestic` as a **boolean** (`C.domestic=dom`), and `taxDrivers`
   does `st0(taxGet("C.gen.domestic","C.who.domestic",…))` then `domRaw.charAt(0)==="Y"`.
   `st0(true)` is `"true"`, so `"T" !== "Y"`. Expected: domestic company, 25 % (turnover
   <= Rs 400 cr), 7 % surcharge, MAT surcharge 7 %. Actual: **every domestic company is taxed as
   a foreign company at 35 %** with the 2 %/5 % foreign surcharge. On this client that is
   28,57,111 of gross tax instead of the lawful 23,72,852. Fix: publish `C.domestic` as `"Y"/"N"`,
   or test it as a boolean in `taxDrivers`. (Related, same function: it reads
   `fs.grossReceipt` while `who` owns `fs.grossRcpt` — the state sets both.)
6. **MAT credit seam, both directions.**
   `70_sec_tax.js:262` reads `MAT.credit` off **`S.C.mat`**, but `engMat` publishes the credit on
   **`S.C.matc.credit`** (`70_sec_mat.js:231`) — so **no MAT credit u/s 115JAA is ever set off**.
   Conversely `70_sec_mat.js:187-192` looks for `tax.mat1d` / `tax.normal2f` /
   `tax.grossTaxLiability` / `tax.grossTax2f`, none of which the tax section publishes (it
   publishes `deemedTotal` and `gross`), so MATC item 1 falls back to the un-grossed MAT tax and
   **item 2 is always 0 → item 3 is always 0 → credit utilised is always 0**, while the
   current-year credit (G27) is overstated at the whole MAT tax (here 18,56,250, although the
   normal tax exceeds MAT and no credit arises this year).
7. **`forms/ITR-6/src/70_sec_loss.js:291` vs `70_sec_tax.js:196`** — the loss section publishes
   `bflaTotal` = **BFLA column 2 only** and `bfSetoffTotal` = columns 2+3+4; the tax section's
   Part B-TI item 8 takes `L.bflaTotal` (its own comment says the item is "2xv + 3xv + 4xv").
   Expected: item 8 includes the brought-forward depreciation and the s.35(4) allowance set off.
   Actual: it does not, so GTI would be overstated by exactly that amount. **Because of this the
   client's Schedule UD carries its brought-forward pool with nil set-off in columns (4)/(7)** —
   otherwise the filed Part B-TI would not agree with Schedule BFLA. Also `70_sec_tax.js:228`
   takes `L.cf.total` (the whole carry-forward) for Part B-TI item 17, where Schedule CFL row xxi
   is the **current-year** figure the loss section publishes as `L.curTotal`.
8. **`forms/ITR-6/src/70_sec_cg.js:87`** — `isNr()` reads `S.pi.res`, but on ITR-6 the
   residential status is `S.fs.resStatus` (owned by `who`). With `S.pi.res` unset a resident
   company is read as a **non-resident** and the NR-only A4/A5/B5/B6/B7 paths open. Worked round
   in the state by setting `S.pi.res` as well as `S.fs.resStatus`; the seam should be read off
   `S.fs.resStatus` / `S.C.who.resident`.
9. **`forms/ITR-6/src/70_sec_cg.js:788-790` and `:850-851`** — the schema-required zero stubs
   `NRITransacSec48Dtl`, `NRISecur115AD`, `NRIProvisoSec48`, `NRISaleOfEquityShareUs112A` are
   written inside `if(G.nri){ dfl(…) }`. The schema marks all four **`required`** on every
   `ScheduleCG/ShortTermCapGain` / `LongTermCapGain`. Expected: the `dfl(…)` defaults run
   unconditionally (only the *data* writes need the `nri` guard). Actual: 3 schema errors for a
   resident.
10. **`forms/ITR-6/src/70_sec_bp.js:731-735`** — the 5c exempt-income detail is written at
    `CorpScheduleBP.BusinessIncOthThanSpec.**OtherExmptIncDtl**`; the schema nests it one level
    deeper, at `BusinessIncOthThanSpec.**IncCredPL**.OtherExmptIncDtl`. 1 schema error
    (`Additional properties are not allowed`).
11. **`forms/ITR-6/src/70_sec_bp.js:850` (`putBlock`)** — `AdditionsGrThan180Days` is written for
    every DPM block including **Rate45**, whose schema definition
    (`DepreciationDetailRate45`) allows only `WDVFirstDay, RealizationTotalPeriod,
    FullRateDeprAmt, DepreciationAtFullRate, TotalDepreciation, DepDisAllowUs38_2,
    NetAggregateDepreciation, ProportionateAggDepreciation, ExpdrOnTrforSaleAsset, CapGainUs50,
    WDVLastDay`. The `opts` already carry `half:false, addl:false` for Rate45; they need
    `add180:false` too.
12. **`forms/ITR-6/src/70_sec_loss.js:489, :493`** — `AmtAdjOptTaxUs115BAA` (per row) and
    `TotAmtAdjOptTaxUs115BAA` (total) are written only `if(baa)`. Both are **`required`** in
    `ITRScheduleUD`. Expected: written as 0 under the normal regime. Actual: 3 schema errors.
13. **`forms/ITR-6/src/70_sec_ded.js:577`, Schedule 80-IC export** — `Sch80SectionCode:"80IE"`; the
    schema enum is **`80-IC_IE`**. 1 schema error. (Related, same function: `grp80()` writes the
    user's `loc` string into `Sch80LocOrDescCode`, which is a fixed per-sub-clause constant —
    `INFRAFAC`, `POWER`, `REVIVAL_POWER_PLNT`, `COMM_PROD`, `HOUSING_PROJECT`,
    `FRIUTS_VEGTBLE`, `STOR_TRANS`, `INDSRTL_ASSAM` … — and it writes *every* group, including
    the empty ones, with the default `"NA"`. The state now carries the right constant for every
    group, but the exporter should supply them itself.)
14. **`forms/ITR-6/src/70_sec_si.js:186`** — `engSi` merges `S.C.cg.siFeed`,
    `S.C.os.siFeed`, `S.C.bp.siFeed`; **none of the three engines publishes a `siFeed`**, so
    Schedule SI is permanently empty and every special rate (111A, 112, 112A, 115BBH …) would be
    taxed at the normal corporate rate. The client fills Schedule SI through the sheet's own
    `EditAutopoulatedDetail` override (`S.si.edit = "Yes"`), which round-trips correctly.
15. Minor seams, same pattern: `70_sec_tax.js:225` reads `S.C.ei.netAgri`/`.agri` while `engEi`
    publishes `net2v` (Part B-TI item 16 is always 0 — harmless for a company);
    `70_sec_tax.js:331` reads `S.C.other.net115TD` while `engOther` publishes `td115Net`;
    `70_sec_other.js` `oth_audited()` reads `S.gen.aud44ab` while `gen` owns `S.gen.aud.sec44AB`
    (Schedule FD is offered to an audited filer).

## Blocks this client cannot fill, and why

`Schedule115AD` FII/115AD securities — the company is not an FII (`FiiFpiFlag = N`).
`Schedule80GGC` — 80GGC is for assessees *other than* a company; a company's political
contributions fall under 80GGB, which is filled.
`Schedule80IAC` — 80-IAC needs DPIIT recognition and incorporation after 01/04/2016; this
company was incorporated 05/11/2006.
`Schedule80LA` — no Offshore Banking Unit / IFSC unit (`IsIfsc = N`).
`ScheduleTPSA` — s.92CE(2A) needs a transfer-pricing primary adjustment; the company is not
liable u/s 92E.
`Schedule115TD` — accreted income applies to a trust/institution registered u/s 12AA or
10(23C), not to this company.
`ScheduleFD` — the foreign-currency receipt/payment statement is for a **non-audit** filer;
this company is audited u/s 44AB.
`ScheduleSH / ShrhldngStartUps` and `ScheduleAL / AsstLiabilitiesStartUps` — start-up tables;
SH-1 and AL-1 (the unlisted-company tables) are filled in full instead.
`ManufacturingAccount*`, `TradingAccount*`, `PARTA_OI`, `PARTA_QD`, `PARTA_OL` and the four
BS/P&L blocks — blocked by defect 2 (no `accounts` section).
`ScheduleFSI` / `ScheduleTR1` — blocked by defect 4.
