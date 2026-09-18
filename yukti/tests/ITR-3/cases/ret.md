# Hand-traced case — section `ret` (Return and regime · Part A - General)

Part A - General is the return's identity/eligibility face. It carries **no
income head**, so the single figure this engine owns is:

    S.C.ret.income = 0   (its contribution to Gross Total Income)

The remaining engine outputs are booleans/labels that drive the renderer,
Form-10IEA flow and the New-vs-Old comparison, not rupee amounts. So the
"figure to the rupee" for this section is **0**, and the meaningful trace is
the regime/flag logic and the round-trip of the two schema blocks.

## Input state (a business filer, old regime, S SUDHIR identity)

    S.pi.status   = "I"
    S.pi.last     = "SUDHIR"
    S.pi.pan      = "TVOPS4373C"
    S.pi.dob      = "05/11/2006"          (DD/MM/YYYY)
    S.pi.email    = "sudhir@example.in"
    S.pi.mobile   = "9812345678"

    S.fs.sec        = 11                  (139(1) - on or before due date)
    S.fs.incBP      = "Y"                 (has business/profession income → A19(b))
    S.fs.optout     = "Yes"              (opts OUT of new regime → OLD regime)
    S.fs.incBP="Y" + optout="Yes"        (⇒ need10IEA = true)
    S.fs.f10ieaDate = "20/09/2026"
    S.fs.f10ieaAck  = "123456789012345"
    S.fs.resStatus  = "RES"
    S.fs.duedate    = "2026-10-31"
    S.aud.sec44AA   = "Y"
    S.aud.sec44AB   = "N"
    S.aud.sec92E    = "N"
    S.nob           = [{code:"09028", trade:"Retail", desc:"Trading"}]

## engRet() trace (line by line)

    A.income   = 0                                   → S.C.ret.income = 0 ✓
    A.optOld   = (S.fs.optout==="Yes")   = true      → regime "Old"
    A.regime   = "Old"
    A.hasBP    = (S.fs.incBP==="Y")      = true
    A.need10IEA= optOld && hasBP         = true       ✓ (Form 10-IEA required)

`S.C.ret = {income:0, optOld:true, regime:"Old", hasBP:true, need10IEA:true}`.

**Figure check: S.C.ret.income = 0, exactly.** ✓ (Part A - General adds
nothing to GTI; the tax section's Σ S.C.<head>.income is unaffected by ret.)

## isNew() cross-check (REGIME.md master switch)

`const isNew = () => S.fs.optout !== "Yes";`

- optout = "Yes"  → isNew() = **false** → OLD regime (concessions OPEN elsewhere).
- optout = "No"   → isNew() = **true**  → NEW regime (concessions CLOSED elsewhere).

Part A - General has no regime-closed income item, so there is no `cell(0)`
closure to build here. The regime effect owned by `ret` is:
1. `OptOldRegimeCurrAY` export = optout==="Yes" ? "Y" : "N"  → here "Y".
2. Form 10-IEA current-AY old-regime rows open (business filer) — required.
3. `regimeTable()` shows tax under BOTH regimes (compute() toggled).

## chkRet() trace on this input

    RET_NOTICE(11)? no      → no DIN/notice checks
    RET_ORIG(11)?   no      → no receipt checks
    optout=Yes & incBP=Y:
        f10ieaAck present   → no error
        f10ieaDate present  → no error
        filed blank         → due-date warn skipped
    dir/partner/unl = "N"   → no table checks
    rep = "N"               → no rep checks
    sec44AB = "N"           → no auditor checks
    sec92E  = "N"           → no 92E checks
    incBP=Y & nob has 1 row → no nature-of-business error
    ⇒ out empty → single OK: "Old regime · filed under 139(1)- On or Before due date."  ✓

Flip optout to "No" (new regime): OptOldRegimeCurrAY exports "N", the 10-IEA
rows collapse, no 10-IEA error, OK message reads "New regime …". ✓

## Export round-trip spot check (expRet → impRet)

    expRet writes:
      PartA_GEN1.PersonalInfo.PAN                 = "TVOPS4373C"
      PartA_GEN1.PersonalInfo.DOB                 = "2006-11-05"   (ISO of 05/11/2006)
      PartA_GEN1.PersonalInfo.Status              = "I"
      PartA_GEN1.FilingStatus.ReturnFileSec       = 11
      PartA_GEN1.FilingStatus.IncFrmBusOrProf     = "Y"
      PartA_GEN1.FilingStatus.OptOldRegimeCurrAY  = "Y"
      PartA_GEN1.FilingStatus.F10IEACurrAYOldRegime = "Y"
      PartA_GEN1.FilingStatus.F10IEADateCurrAYOldTax = "2026-09-20"
      PartA_GEN1.FilingStatus.F10IEAAckNoCurrAYOldTax = 123456789012345
      PartA_GEN1.FilingStatus.ItrFilingDueDate    = "2026-10-31"
      PartA_GEN2.AuditInfo.LiableSec44AAflg        = "Y"
      PartA_GEN2.AuditInfo.LiableSec44ABflg        = "N"
      PartA_GEN2.AuditInfo.LiableSec92Eflg         = "N"
      PartA_GEN2.AuditInfo.AccountAuditFlag        = "N"
      PartA_GEN2.NatOfBus.NatureOfBusiness[0].Code = "09028"

    impRet reads them back → S.fs.optout="Yes" (from "Y"), S.fs.sec=11,
    S.pi.pan="TVOPS4373C", S.pi.dob="05/11/2006", S.nob[0].code="09028".
    Values identical before/after → round-trip holds for the keys exercised. ✓
