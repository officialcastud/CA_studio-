/* =====================================================================
   ITR-7 · Section "app" — Application & accumulation of income
   Screen ref: Schedule A · I · IA · D · DA.  Screen order 120, compute order 55.

   This is the APPLICATION & ACCUMULATION core of an 11/12 trust return — the
   centre of the form. Built ONLY from books/ITR-7/Schedule_A.md, Schedule_I.md,
   Schedule_IA.md, Schedule_D.md, Schedule_DA.md, section_map.json (all five ->
   "app"), enums.json and the ITR-7 schema. Owns these five schema blocks:

     · ScheduleA        — amount applied to the stated objects (Parts A..G):
        A  application by object head (revenue/capital),  B  expenditure NOT
        allowed as application, C  the source of the funds applied (C2..C7 +
        "Any other"), and D..G the reconciliation to G = the amount allowed as
        application (G = D − E + F, D = A12 − B − C2..C7). Every money line is a
        Revenue · Capital · Total triple.
     · ITRScheduleI     — income accumulated / set apart u/s 11(2) (or 3rd
        proviso to 10(23C)/10(21) r.w. 35(1)): a per-year ledger, col 15
        (AmountDeemedUs11) = (9)+(10)+(13)+(14) is the income deemed u/s 11(3).
     · ITRScheduleIA    — accumulated income taxed earlier u/s 11(3): the matrix
        behind Schedule I col 6 (year of accumulation × assessment year taxed).
     · ITRScheduleD     — deemed application u/s clause (2) Expln.1 to 11(1):
        per-year ledger, col (8) = (6)−(7) is the income deemed u/s 11(1B), col
        (9) = (4)−(6) the balance carried to next year.
     · ITRScheduleDA    — deemed application taxed earlier u/s 11(1B): the matrix
        behind Schedule D col 5.

   Consumes upstream:
     S.C.vc.{grossReceipts,aggregateIncome,totalVC}  — the income base
     S.C.ie.{receipts,applied,accumulation}          — IE-statement figures (fallback base)

   Publishes S.C.app.* (read by the tax section — Part B-TI):
     applied / appliedRev / appliedCap  — Sch A row G (TotAmountAllowedApplication):
        total amount ALLOWED as application of income (reduces income for exemption)
     a12 / expDisallowed / srcC2toC7    — Sch A working sub-totals (A12, B, C2..C7)
     accumulated                        — Sch I TotAmountAccumlated (amount set apart)
     deemed11_3                         — Sch I TotAmountDeemedUs11  (adds back to income)
     deemedApplied                      — Sch D TotAmountAppliedPY   (amount deemed applied)
     deemed11_1B                        — Sch D TotAmountNotAppliedCurrAY (adds back to income)
     iaGrandTotal / daGrandTotal        — Sch IA / DA reconciliation grand totals
     incomeBase                         — the income base drawn from vc/ie
     totalApplied                       — applied (G) + deemedApplied (Sch D)  → reduces income
     deemedIncome                       — deemed11_3 + deemed11_1B             → adds to income
     taxableBalance                     — indicative exemption balance for Part B-TI, which
        computes the definitive figure (the 15% permitted accumulation and the current-year
        set-apart u/s 11(2) are Part B-TI's, not this section's). Nothing else writes S.C.app.

   Enums (verbatim from books/ITR-7/enums.json — the coded VALUE is the schema
   member, the label is only the display; do NOT store the label):
     · ITRScheduleI.AccumlatedYear         -> integer "2020".."2025" (FY start year)
     · ITRScheduleD.AppliedYear            -> "1".."7"  (Prior to FY 2020-21 … 2025-26)
     · ITRScheduleD.DeemedApplicationReason-> "1"/"2"   (not received / any other reason)
     · ITRScheduleIA.YrOfAccumulationIA    -> "2020-21".."2023-24"
     · ITRScheduleDA.YrOfAccumulationDA    -> "PriorToAY","2020-21".."2023-24"
   ===================================================================== */

/* ---- enum tables (value, display) — from enums.json, labels expanded to the
   book's verbatim year text where the schema label is terse ---------------- */
const APP_IYEAR =[["2020","2020-21"],["2021","2021-22"],["2022","2022-23"],
                  ["2023","2023-24"],["2024","2024-25"],["2025","2025-26"]];
const APP_DYEAR =[["1","Prior to FY 2020-21"],["2","2020-21"],["3","2021-22"],
                  ["4","2022-23"],["5","2023-24"],["6","2024-25"],["7","2025-26"]];
const APP_DREASON=[["1","Income has not been received during that year"],
                   ["2","Any other reason"]];
const APP_IAYEAR=[["2020-21","2020-21"],["2021-22","2021-22"],
                  ["2022-23","2022-23"],["2023-24","2023-24"]];
const APP_DAYEAR=[["PriorToAY","Prior to 2020-21"],["2020-21","2020-21"],
                  ["2021-22","2021-22"],["2022-23","2022-23"],["2023-24","2023-24"]];
const _inSet=(arr,v)=>{v=st0(v);return arr.some(x=>x[0]===v)?v:"";};

/* ---- state seed (own namespace; not pre-seeded in 10_state.js) ---------- */
S.app = S.app || {};
S.app.a = S.app.a || {};   /* Part A object heads   {key:{rev,cap}} */
S.app.b = S.app.b || {};   /* Part B disallowed      {key:{rev,cap}} */
S.app.c = S.app.c || {};   /* Part C named sources   {key:{rev,cap}} */
S.app.g = S.app.g || {};   /* Parts E/F (not-paid / paid-earlier)    */
S.app.cOthers = S.app.cOthers || [];   /* Part C "Any other" sub-table  */
S.app.iRows  = S.app.iRows  || [];     /* ScheduleI[]      */
S.app.iaRows = S.app.iaRows || [];     /* YrOfAccDtls[]    (IA) */
S.app.dRows  = S.app.dRows  || [];     /* ScheduleD[]      */
S.app.daRows = S.app.daRows || [];     /* YrOfAccumDtls[]  (DA) */

/* ---- small pair helpers -------------------------------------------------- */
function _pair(o){o=o||{};return {rev:sg(o.rev), cap:sg(o.cap)};}
function _padd(){return Array.prototype.slice.call(arguments)
  .reduce((a,p)=>({rev:a.rev+p.rev, cap:a.cap+p.cap}),{rev:0,cap:0});}
const _pt=p=>p.rev+p.cap;

/* ==================================================================
   ENGINE — compute every schedule's totals, publish S.C.app
   ================================================================== */
function engApp(){
  S.app=S.app||{};
  const A=S.app; A.a=A.a||{}; A.b=A.b||{}; A.c=A.c||{}; A.g=A.g||{};
  const C=S.C.app={};

  /* ---------- Schedule A · Part A (rows 5–19) ---------- */
  const aOther=_pair(A.a.otherCorpus);                         /* row 7  — 100% */
  const a85={rev:R(0.85*aOther.rev), cap:R(0.85*aOther.cap)};  /* row 8  — 85% (A1a) */
  const aRel=_pair(A.a.religious),   aPoor=_pair(A.a.reliefPoor), aEdu=_pair(A.a.educational),
        aYoga=_pair(A.a.yoga),       aMed=_pair(A.a.medical),     aEnv=_pair(A.a.environ),
        aMon=_pair(A.a.monuments),   aGpu=_pair(A.a.gpu),         aCant=_pair(A.a.cantIdent),
        aCost=_pair(A.a.costNewAsset);
  const a12=_padd(a85,aRel,aPoor,aEdu,aYoga,aMed,aEnv,aMon,aGpu,aCant,aCost); /* A12 */

  /* ---------- Schedule A · Part B (rows 21–29) ---------- */
  const bCorpus=_pair(A.b.corpusDon),      bOther=_pair(A.b.otherThanCorpus),
        bNotSame=_pair(A.b.notSameObj),    bTrust=_pair(A.b.otherThanTrust),
        bOutApp=_pair(A.b.outIndiaApp),    bOutNot=_pair(A.b.outIndiaNotApp),
        bBeyond=_pair(A.b.beyondObj),      bDis=_pair(A.b.otherDisallow);
  const bTot=_padd(bCorpus,bOther,bNotSame,bTrust,bOutApp,bOutNot,bBeyond,bDis); /* B */

  /* ---------- Schedule A · Part C (rows 31–43) ---------- */
  const cProp=_pair(A.c.incProperty),  cAccum=_pair(A.c.incAccum),
        cDeem=_pair(A.c.incDeemed),    cE15=_pair(A.c.earlier15),
        cCorp=_pair(A.c.corpus),       cBorr=_pair(A.c.borrowed);
  const cOthers=(A.cOthers||[]).filter(r=>st0(r.nat)||N(r.rev)||N(r.cap));
  const cOthTot={rev:cOthers.reduce((s,r)=>s+sg(r.rev),0),
                 cap:cOthers.reduce((s,r)=>s+sg(r.cap),0)};
  const c27=_padd(cProp,cAccum,cDeem,cE15,cCorp,cBorr);   /* C2..C7 (subtracted in D) */
  const cTot=_padd(c27,cOthTot);                          /* C1 = C2..C7 + Any other */

  /* ---------- Schedule A · Parts D–G (rows 47–50) ---------- */
  const d={rev:a12.rev-bTot.rev-c27.rev, cap:a12.cap-bTot.cap-c27.cap}; /* D = A12−B−C2..C7 */
  const e=_pair(A.g.notPaid);      /* E — booked but not actually applied */
  const f=_pair(A.g.paidPY);       /* F — actually paid, accrued earlier */
  const g={rev:d.rev-e.rev+f.rev, cap:d.cap-e.cap+f.cap};               /* G = D−E+F */

  C.A={aOther,a85,aRel,aPoor,aEdu,aYoga,aMed,aEnv,aMon,aGpu,aCant,aCost,a12,
       bCorpus,bOther,bNotSame,bTrust,bOutApp,bOutNot,bBeyond,bDis,bTot,
       cProp,cAccum,cDeem,cE15,cCorp,cBorr,cOthers,cOthTot,c27,cTot,d,e,f,g};

  /* ---------- Schedule I — per-year accumulation ledger ---------- */
  const iLive=(A.iRows||[]).filter(_iLive);
  const iCalc=iLive.map(r=>{
    const year=sg(r.year), acc=sg(r.acc), applPY=sg(r.applPY), txd=sg(r.txd),
          appl8=sg(r.appl8), appl9=sg(r.appl9), cred10=sg(r.cred10),
          inv12=sg(r.inv12), inv13=sg(r.inv13), notUtil14=sg(r.notUtil14);
    const bal5=acc-applPY, bal7=bal5-txd, bal11=bal7-appl8-appl9-cred10,
          deemed15=appl9+cred10+inv13+notUtil14;
    return {year,acc,purpose:st0(r.purpose),applPY,txd,appl8,appl9,cred10,
            inv12,inv13,notUtil14,bal5,bal7,bal11,deemed15};
  });
  const iSum=k=>iCalc.reduce((s,r)=>s+r[k],0);
  C.iTot={acc:iSum("acc"),applPY:iSum("applPY"),bal5:iSum("bal5"),txd:iSum("txd"),
          bal7:iSum("bal7"),appl8:iSum("appl8"),appl9:iSum("appl9"),cred10:iSum("cred10"),
          bal11:iSum("bal11"),inv12:iSum("inv12"),inv13:iSum("inv13"),
          notUtil14:iSum("notUtil14"),deemed:iSum("deemed15")};
  C.iCalc=iCalc;

  /* ---------- Schedule IA — matrix (11(3) taxed earlier) ---------- */
  const iaLive=(A.iaRows||[]).filter(_iaLive);
  const iaCalc=iaLive.map(r=>{
    const prior=sg(r.prior), a2223=sg(r.a2223), a2324=sg(r.a2324),
          a2425=sg(r.a2425), a2526=sg(r.a2526);
    return {yr:st0(r.yr),prior,a2223,a2324,a2425,a2526,
            total:prior+a2223+a2324+a2425+a2526};
  });
  C.iaCalc=iaCalc;
  C.iaGrand=iaCalc.reduce((s,r)=>s+r.total,0);

  /* ---------- Schedule D — per-year deemed-application ledger ---------- */
  const dLive=(A.dRows||[]).filter(_dLive);
  const dCalc=dLive.map(r=>{
    const amtPY=sg(r.amtPY), reqApp=sg(r.reqApp), txd=sg(r.txd),
          toApply=sg(r.toApply), appliedCurr=sg(r.appliedCurr);
    const notApplied=toApply-appliedCurr;   /* (8)=(6)-(7) — deemed income u/s 11(1B) */
    const balance=reqApp-toApply;           /* (9)=(4)-(6) */
    return {year:st0(r.year),amtPY,reason:st0(r.reason),reasonDesc:st0(r.reasonDesc),
            reqApp,txd,toApply,appliedCurr,notApplied,balance};
  });
  const dSum=k=>dCalc.reduce((s,r)=>s+r[k],0);
  C.dTot={reqApp:dSum("reqApp"),txd:dSum("txd"),amtPY:dSum("amtPY"),
          toApply:dSum("toApply"),appliedCurr:dSum("appliedCurr"),
          notApplied:dSum("notApplied"),balance:dSum("balance")};
  C.dCalc=dCalc;

  /* ---------- Schedule DA — matrix (11(1B) taxed earlier) ---------- */
  const daLive=(A.daRows||[]).filter(_daLive);
  const daCalc=daLive.map(r=>{
    const prior=sg(r.priorAY), a2223=sg(r.a2223), a2324=sg(r.a2324),
          a2425=sg(r.a2425), a2526=sg(r.a2526);
    return {yr:st0(r.yr),prior,a2223,a2324,a2425,a2526,
            total:prior+a2223+a2324+a2425+a2526};
  });
  C.daCalc=daCalc;
  C.daGrand=daCalc.reduce((s,r)=>s+r.total,0);

  /* ---------- cross-section rolls (Part B-TI) ---------- */
  C.appliedRev=g.rev; C.appliedCap=g.cap; C.applied=_pt(g);   /* Sch A row G */
  C.a12=_pt(a12); C.expDisallowed=_pt(bTot); C.srcC2toC7=_pt(c27);
  C.accumulated = C.iTot.acc;                 /* Sch I TotAmountAccumlated */
  C.deemed11_3  = C.iTot.deemed;              /* Sch I TotAmountDeemedUs11 → adds to income */
  C.deemedApplied = C.dTot.amtPY;             /* Sch D TotAmountAppliedPY  (deemed applied) */
  C.deemed11_1B   = C.dTot.notApplied;        /* Sch D TotAmountNotAppliedCurrAY → adds to income */
  C.iaGrandTotal  = C.iaGrand;
  C.daGrandTotal  = C.daGrand;

  const incomeBase = R(RG(S,"C.vc.grossReceipts",0)) ||
                     R(RG(S,"C.ie.receipts",0));
  C.incomeBase    = incomeBase;
  C.totalApplied  = C.applied + C.deemedApplied;      /* application allowed + deemed applied */
  C.deemedIncome  = C.deemed11_3 + C.deemed11_1B;     /* 11(3) + 11(1B) add-backs */
  /* indicative exemption balance — Part B-TI computes the definitive figure */
  C.taxableBalance= Math.max(0, incomeBase - C.totalApplied) + C.deemedIncome;

  /* ---------- Part B-TI exemption ladder (s.11/12) — SEAM to the tax section ----
     The tax section's Part-B1 regime reads S.C.app.grossIncomeAfterExemption as
     the income chargeable AFTER the s.11 application/accumulation exemption, and
     exports the decomposition lines below into PartB_TI. These keys are computed
     here (the publisher) so the 85%-application ladder actually flows. All
     guarded; reads S.C.vc which computes before app (corder 25 < 55). */
  const _vc=(S.C.vc||{});
  const vcOtherCorpus = Math.max(0, R(_vc.totalVC) - R(_vc.corpus));   /* other-than-corpus contributions */
  const aggInc        = R(_vc.aggregateIncome);                        /* Schedule AI row 23 (income base) */
  const anon115        = R(_vc.anon115BBC);                            /* Diii — chargeable u/s 115BBC @30% */
  /* income eligible for the s.11 application test (the 115BBC anon is carved out
     and taxed separately @30%, so it does not get the application benefit) */
  const aggregate1112 = Math.max(0, vcOtherCorpus + aggInc - anon115);
  const dApplied   = C.applied;                                        /* Sch A row G (application allowed) */
  const dDeemedApp = C.deemedApplied;                                  /* Sch D TotAmountAppliedPY */
  const dSetApart  = Math.max(0, R(A.acc11_2!=null?A.acc11_2:0));      /* accumulation set apart u/s 11(2) */
  const std15room  = Math.max(0, aggregate1112 - dApplied - dDeemedApp - dSetApart);
  const dStd15     = Math.min(R(0.15*aggregate1112), std15room);       /* 11(1)(a) standard 15% accumulation */
  const totalDeductions = R(dApplied + dDeemedApp + dSetApart + dStd15);
  const addDeemed  = C.deemed11_3 + C.deemed11_1B;                     /* Sch I col15 + Sch D col8 add-backs */
  const totalAdditions = R(addDeemed + anon115);                       /* incl. the 115BBC anonymous donation */
  const residual   = Math.max(0, aggregate1112 - totalDeductions);

  C.vcCorpus115BBC   = anon115;                    /* Part B-TI item 1 (VcCorpusSec11) */
  C.aggregate1112    = R(aggregate1112);           /* AggregateIncomeUs1112 */
  C.amtCharitable111 = R(0.85*aggregate1112);      /* AmtForCharitableUs111 (85% to be applied) */
  C.incToApply       = R(aggregate1112);           /* IncToBeApplied */
  C.loanRepay        = 0;                           /* AmtAppForCharitablePurposeRepayment */
  C.appliedSpecMode  = 0;                           /* AmtAppliedSpecifiedMode */
  C.accumulated11_2  = R(dStd15);                   /* AmtAccumulatedForCharitable (15% standard) */
  C.setApart11_2     = R(dSetApart);               /* AmtFulfilledUs11_2 (11(2) set apart) */
  C.totalDeductions  = totalDeductions;            /* TIDeductions.TotalDeductions */
  C.anonNoExempt     = anon115;                    /* TIAdditions...AnonymousDonationVC */
  C.incUs12_2        = 0;                           /* IncChargeableUs12_2 */
  C.disallow40aia    = 0;                           /* AmtDsllwblUs111RWS40AIA */
  C.disallow40A3     = 0;                           /* AmtDsllwblUs111RWS40A3 */
  C.incExp3B         = 0;                           /* IncExp3BUS80G */
  C.incExp1B         = 0;                           /* IncExp1BUS80G */
  C.anyOtherInc      = 0;                           /* AnyOthrIncome */
  C.totalAdditions   = totalAdditions;             /* TIAdditions.TotalAdditions */
  C.incUs11_4        = 0;                           /* IncChargeableUs11_4 */
  C.netAgri          = 0;                           /* net agricultural income for rate purposes */
  C.incMMR           = 0;                           /* B2 income at maximum marginal rate */
  C.grossIncomeAfterExemption = R(residual + totalAdditions);  /* Part-B1 item 9 → tax section */
}

/* ---- live-row predicates ------------------------------------------------- */
function _iLive(r){r=r||{};return N(r.year)||N(r.acc)||st0(r.purpose)||N(r.applPY)||
  N(r.txd)||N(r.appl8)||N(r.appl9)||N(r.cred10)||N(r.inv12)||N(r.inv13)||N(r.notUtil14);}
function _iaLive(r){r=r||{};return st0(r.yr)||N(r.prior)||N(r.a2223)||N(r.a2324)||N(r.a2425)||N(r.a2526);}
function _dLive(r){r=r||{};return st0(r.year)||N(r.amtPY)||N(r.reqApp)||N(r.txd)||
  N(r.toApply)||N(r.appliedCurr)||st0(r.reasonDesc)||st0(r.reason);}
function _daLive(r){r=r||{};return st0(r.yr)||N(r.priorAY)||N(r.a2223)||N(r.a2324)||N(r.a2425)||N(r.a2526);}

/* ==================================================================
   RENDER
   ================================================================== */
/* one Schedule A input line — two number inputs (Rev, Cap) + live Total */
function _aIn(label,base,o){o=o||{};
  const rev=sg(get("app."+base+".rev")), cap=sg(get("app."+base+".cap"));
  return '<tr'+(o.cls?' class="'+o.cls+'"':'')+'><td class="l">'+
    (o.sl?'<b>'+esc(o.sl)+'</b>&nbsp; ':'')+esc(label)+'</td>'+
    '<td>'+inp("app."+base+".rev",{n:1})+'</td>'+
    '<td>'+inp("app."+base+".cap",{n:1})+'</td>'+
    '<td class="num">'+cell(rev+cap)+'</td></tr>';}
/* one Schedule A computed line — all three cells read-only */
function _aTot(label,rev,cap,o){o=o||{};
  return '<tr class="'+(o.cls||"tot")+'"><td class="l">'+
    (o.sl?'<b>'+esc(o.sl)+'</b>&nbsp; ':'')+'<b>'+esc(label)+'</b></td>'+
    '<td class="num">'+cell(rev)+'</td><td class="num">'+cell(cap)+'</td>'+
    '<td class="num">'+cell(rev+cap)+'</td></tr>';}
function _a3open(){return '<div class="full"><table class="gt" style="min-width:720px">'+
  '<thead><tr><th class="l">Particulars</th><th style="width:150px">Revenue</th>'+
  '<th style="width:150px">Capital</th><th style="width:150px">Total</th></tr></thead><tbody>';}
const _a3close='</tbody></table></div>';

function secApp(){
  engApp();
  const C=S.C.app||{}, X=C.A||{};
  let h="";

  h+=note("The application &amp; accumulation core of an exemption return. <b>Schedule A</b> "+
    "measures the amount applied to the trust's objects (the 85%-application numerator); "+
    "<b>Schedule I / IA</b> track accumulation set apart u/s 11(2) and what of it was taxed "+
    "u/s 11(3); <b>Schedule D / DA</b> track deemed application under Explanation 1 to 11(1) "+
    "and what was taxed u/s 11(1B). Every money line splits Revenue and Capital; Total = "+
    "Revenue + Capital.");

  /* ================= Schedule A ================= */
  h+=sub("Schedule A — Amount applied to the stated objects from all sources");

  /* Part A */
  h+='<div class="note">A — Application towards the stated objects of the trust/institution</div>';
  h+=_a3open();
  h+=_aIn("Donation to trust/institution registered u/s 12AB or approved u/s 10(23C)(iv)/(v)/(vi)/(via) — Other than Corpus (enter 100% of the donation)","a.otherCorpus");
  h+=_aTot("85% of the above donation — Other than Corpus (counted as application)",(X.a85||{}).rev,(X.a85||{}).cap,{sl:"A1a",cls:"sub"});
  h+=_aIn("Religious","a.religious");
  h+=_aIn("Relief of poor","a.reliefPoor");
  h+=_aIn("Educational","a.educational");
  h+=_aIn("Yoga","a.yoga");
  h+=_aIn("Medical relief","a.medical");
  h+=_aIn("Preservation of environment","a.environ");
  h+=_aIn("Preservation of monuments etc","a.monuments");
  h+=_aIn("General public utility","a.gpu");
  h+=_aIn("Application which cannot be specifically identified above","a.cantIdent");
  h+=_aIn("Cost of new asset for exemption u/s 11(1A) (restricted to the net consideration)","a.costNewAsset");
  h+=_aTot("Total (A1a to A11)",(X.a12||{}).rev,(X.a12||{}).cap,{sl:"A12"});
  h+=_a3close;

  /* Part B */
  h+='<div class="note">B — Expenditure NOT allowed as application (out of Row A, other than application out of C2 to C7)</div>';
  h+=_a3open();
  h+=_aIn("Donation to 12AB/10(23C) trust towards Corpus","b.corpusDon");
  h+=_aIn("Donation to 12AB/10(23C) trust other than towards corpus, out of accumulated income","b.otherThanCorpus");
  h+=_aIn("Donation to 12AB/10(23C) trust not having the same objects","b.notSameObj");
  h+=_aIn("Donation to any person other than a 12AB/10(23C) trust","b.otherThanTrust");
  h+=_aIn("Application outside India — approval u/s 11(1)(c) proviso obtained","b.outIndiaApp");
  h+=_aIn("Application outside India — approval u/s 11(1)(c) proviso NOT obtained","b.outIndiaNotApp");
  h+=_aIn("Applied for any purpose beyond the objects of the trust/institution","b.beyondObj");
  h+=_aIn("Any other disallowable application","b.otherDisallow");
  h+=_aTot("Total expenditure not allowed as application (B1 to B8)",(X.bTot||{}).rev,(X.bTot||{}).cap,{sl:"B"});
  h+=_a3close;

  /* Part C */
  h+='<div class="note">C — Source of fund to meet the application in Row A (to the extent C2 to C7 is included in A12)</div>';
  h+=_a3open();
  h+=_aIn("Income derived from property / income earned during the year (excluding corpus)","c.incProperty",{sl:"C2"});
  h+=_aIn("Income accumulated u/s 11(2) or 3rd proviso to 10(23C) in earlier years","c.incAccum",{sl:"C3"});
  h+=_aIn("Income deemed applied in a preceding year under clause 2 of Expln.1 to 11(1)","c.incDeemed",{sl:"C4"});
  h+=_aIn("Income of earlier years up to 15% accumulated or set apart","c.earlier15",{sl:"C5"});
  h+=_aIn("Corpus","c.corpus",{sl:"C6"});
  h+=_aIn("Borrowed Fund","c.borrowed",{sl:"C7"});
  h+=_aTot("Total source of fund (C2 to C7 + Any other)",(X.cTot||{}).rev,(X.cTot||{}).cap,{sl:"C1"});
  h+=_a3close;
  h+=note("C8 — Any other source (please specify). Revenue and Capital amount for each nature.");
  h+=grid("app.cOthers",[
      {k:"nat",h:"Nature",t:"txt",w:"280px",max:125},
      {k:"rev",h:"Revenue Amount",t:"num",w:"160px"},
      {k:"cap",h:"Capital Amount",t:"num",w:"160px"},
      {k:"tot",h:"Total",t:"calc",w:"150px",f:r=>sg(r.rev)+sg(r.cap)}],
      S.app.cOthers,{min:"780px",empty:"No other source entered.",add:"Add a source"});

  /* Parts D–G */
  h+='<div class="note">D to G — Reconciliation to the amount allowed as application</div>';
  h+=_a3open();
  h+=_aTot("D — Total amount applied during the year [A12 − B − C2..C7]",(X.d||{}).rev,(X.d||{}).cap,{sl:"D"});
  h+=_aIn("E — Amount not actually applied during the year out of D (if included in A12)","g.notPaid",{sl:"E"});
  h+=_aIn("F — Amount actually paid this year that accrued in an earlier year (not claimed earlier)","g.paidPY",{sl:"F"});
  h+=_aTot("G — Total amount to be allowed as application (G = D − E + F)",(X.g||{}).rev,(X.g||{}).cap,{sl:"G"});
  h+=_a3close;
  h+=row("Amount allowed as application (Schedule A, G — Total)",cell(C.applied),
    {ref:"TotAmountAllowedApplication",hint:"the 85%-application numerator carried to Part B-TI"});

  /* ================= Schedule I ================= */
  h+=sub("Schedule I — Income accumulated / set apart u/s 11(2)");
  h+=note("One row per year of accumulation. Balance (5)=(2)−(4); (7)=(5)−(6); "+
    "(11)=(7)−(8)−(9)−(10); Amount deemed income u/s 11(3) (15) = (9)+(10)+(13)+(14).");
  h+=grid("app.iRows",[
      {k:"year",h:"(1) Year of accumulation",t:"sel",w:"150px",req:1,opts:APP_IYEAR},
      {k:"acc",h:"(2) Amount accumulated",t:"num",w:"150px",req:1},
      {k:"purpose",h:"(3) Purpose",t:"txt",w:"200px",req:1,max:200},
      {k:"applPY",h:"(4) Applied up to beginning of PY",t:"num",w:"150px"},
      {k:"bal5",h:"(5) Balance (2−4)",t:"calc",w:"130px",f:r=>sg(r.acc)-sg(r.applPY)},
      {k:"txd",h:"(6) Taxed in earlier AY(s)",t:"num",w:"150px"},
      {k:"bal7",h:"(7) Balance available (5−6)",t:"calc",w:"140px",f:r=>(sg(r.acc)-sg(r.applPY))-sg(r.txd)},
      {k:"appl8",h:"(8) Applied this year from accumulation",t:"num",w:"160px"},
      {k:"appl9",h:"(9) Applied for other purpose",t:"num",w:"150px"},
      {k:"cred10",h:"(10) Credited/paid to another trust",t:"num",w:"160px"},
      {k:"bal11",h:"(11) Balance (7−8−9−10)",t:"calc",w:"150px",
        f:r=>((sg(r.acc)-sg(r.applPY))-sg(r.txd))-sg(r.appl8)-sg(r.appl9)-sg(r.cred10)},
      {k:"inv12",h:"(12) Invested in 11(5) modes",t:"num",w:"150px"},
      {k:"inv13",h:"(13) Invested in other modes",t:"num",w:"150px"},
      {k:"notUtil14",h:"(14) Not utilised in period",t:"num",w:"150px"},
      {k:"deemed15",h:"(15) Deemed income u/s 11(3)",t:"calc",w:"160px",
        f:r=>sg(r.appl9)+sg(r.cred10)+sg(r.inv13)+sg(r.notUtil14)}],
      S.app.iRows,{min:"2350px",empty:"No accumulation year entered.",add:"Add a year"});
  h+=row("Total amount accumulated (col 2)",cell((C.iTot||{}).acc),{ref:"TotAmountAccumlated"});
  h+=row("Total amount deemed income u/s 11(3) (col 15)",cell((C.iTot||{}).deemed),
    {ref:"TotAmountDeemedUs11",hint:"deemed income → Part B-TI"});

  /* ================= Schedule IA ================= */
  h+=sub("Schedule IA — Accumulated income taxed earlier u/s 11(3)");
  h+=note("Detail behind Schedule I col 6: for each year of accumulation, the amount taxed "+
    "in each earlier assessment year. Row Total = the sum across assessment years.");
  h+=grid("app.iaRows",[
      {k:"yr",h:"Year of accumulation (F.Yr.)",t:"sel",w:"170px",req:1,opts:APP_IAYEAR},
      {k:"prior",h:"AY 2021-22",t:"num",w:"140px"},
      {k:"a2223",h:"AY 2022-23",t:"num",w:"140px"},
      {k:"a2324",h:"AY 2023-24",t:"num",w:"140px"},
      {k:"a2425",h:"AY 2024-25",t:"num",w:"140px"},
      {k:"a2526",h:"AY 2025-26",t:"num",w:"140px"},
      {k:"tot",h:"Total (A+B+C+D)",t:"calc",w:"150px",
        f:r=>sg(r.prior)+sg(r.a2223)+sg(r.a2324)+sg(r.a2425)+sg(r.a2526)}],
      S.app.iaRows,{min:"1130px",empty:"No taxed accumulation entered.",add:"Add a year"});
  h+=row("Grand total taxed u/s 11(3)",cell(C.iaGrand),{ref:"GrandTotal"});

  /* ================= Schedule D ================= */
  h+=sub("Schedule D — Deemed application u/s clause (2), Explanation 1 to 11(1)");
  h+=note("One row per year in which income was deemed applied. (8)=(6)−(7) is the amount "+
    "that could not be applied and is deemed income u/s 11(1B); (9)=(4)−(6) is the balance "+
    "carried to FY 2026-27 onwards. Give a reason description when the reason is \"Any other\".");
  h+=grid("app.dRows",[
      {k:"year",h:"(1) Year deemed applied",t:"sel",w:"170px",req:1,opts:APP_DYEAR},
      {k:"amtPY",h:"(2) Amount deemed applied",t:"num",w:"150px",req:1},
      {k:"reason",h:"(3) Reason of deeming",t:"sel",w:"220px",req:1,opts:APP_DREASON},
      {k:"reasonDesc",h:"Reason (if any other)",t:"txt",w:"200px",max:250},
      {k:"reqApp",h:"(4) Amount required to be applied",t:"num",w:"160px"},
      {k:"txd",h:"(5) Taxed in earlier AY(s)",t:"num",w:"150px"},
      {k:"toApply",h:"(6) Required to apply this FY",t:"num",w:"160px"},
      {k:"appliedCurr",h:"(7) Applied this FY (earlier claim)",t:"num",w:"170px"},
      {k:"notApplied",h:"(8) Deemed income u/s 11(1B) (6−7)",t:"calc",w:"180px",
        f:r=>sg(r.toApply)-sg(r.appliedCurr)},
      {k:"balance",h:"(9) Balance to apply FY26-27+ (4−6)",t:"calc",w:"180px",
        f:r=>sg(r.reqApp)-sg(r.toApply)}],
      S.app.dRows,{min:"1900px",empty:"No deemed application entered.",add:"Add a year"});
  h+=row("Total amount deemed applied (col 2)",cell((C.dTot||{}).amtPY),{ref:"TotAmountAppliedPY"});
  h+=row("Total deemed income u/s 11(1B) (col 8)",cell((C.dTot||{}).notApplied),
    {ref:"TotAmountNotAppliedCurrAY",hint:"deemed income → Part B-TI"});

  /* ================= Schedule DA ================= */
  h+=sub("Schedule DA — Deemed application taxed earlier u/s 11(1B)");
  h+=note("Detail behind Schedule D col 5: for each year of deemed application, the amount "+
    "taxed in each earlier assessment year. Row Total = the sum across assessment years.");
  h+=grid("app.daRows",[
      {k:"yr",h:"Year of deemed application (F.Yr.)",t:"sel",w:"200px",req:1,opts:APP_DAYEAR},
      {k:"priorAY",h:"Prior to AY 2021-22",t:"num",w:"150px"},
      {k:"a2223",h:"AY 2022-23",t:"num",w:"140px"},
      {k:"a2324",h:"AY 2023-24",t:"num",w:"140px"},
      {k:"a2425",h:"AY 2024-25",t:"num",w:"140px"},
      {k:"a2526",h:"AY 2025-26",t:"num",w:"140px"},
      {k:"tot",h:"Total (A+B+C+D+E)",t:"calc",w:"160px",
        f:r=>sg(r.priorAY)+sg(r.a2223)+sg(r.a2324)+sg(r.a2425)+sg(r.a2526)}],
      S.app.daRows,{min:"1200px",empty:"No taxed deemed application entered.",add:"Add a year"});
  h+=row("Grand total taxed u/s 11(1B)",cell(C.daGrand),{ref:"GrandTotal"});

  return h;
}

/* ==================================================================
   EXPORT
   ================================================================== */
/* write a Revenue/Capital/Total triple at path (always — required totals) */
function _triAlways(j,path,p){
  put(j,path+".Revenue",sg(p.rev));
  put(j,path+".Capital",sg(p.cap));
  put(j,path+".Total",  sg(p.rev+p.cap));
}
/* write a triple only when it carries a value (optional detail rows) */
function _triOpt(j,path,p){ if(p&&(p.rev||p.cap)) _triAlways(j,path,p); }

function expApp(j){
  const C=S.C.app||{}, X=C.A||{};

  /* ---------- Schedule A ---------- */
  const hasA = _pt(X.a12||{rev:0,cap:0}) || _pt(X.bTot||{rev:0,cap:0}) ||
    _pt(X.cTot||{rev:0,cap:0}) || _pt(X.aOther||{rev:0,cap:0}) ||
    (X.e&&_pt(X.e)) || (X.f&&_pt(X.f));
  if(hasA){
    const P="ScheduleA.";
    /* A — object heads (optional details + required total A12) */
    _triOpt(j,P+"AppTowExpTrstInst.OtherThanCorpus",   X.aOther);
    _triOpt(j,P+"AppTowExpTrstInst.OtherThanCorpus85", X.a85);
    _triOpt(j,P+"AppTowExpTrstInst.Religious",         X.aRel);
    _triOpt(j,P+"AppTowExpTrstInst.ReliefOfPoor",      X.aPoor);
    _triOpt(j,P+"AppTowExpTrstInst.Educational",       X.aEdu);
    _triOpt(j,P+"AppTowExpTrstInst.Yoga",              X.aYoga);
    _triOpt(j,P+"AppTowExpTrstInst.MedicalRelief",     X.aMed);
    _triOpt(j,P+"AppTowExpTrstInst.PreservationOfEnvrmnt",       X.aEnv);
    _triOpt(j,P+"AppTowExpTrstInst.PreservationOfMonumentsEtc",  X.aMon);
    _triOpt(j,P+"AppTowExpTrstInst.GeneralPublicUtility",        X.aGpu);
    _triOpt(j,P+"AppTowExpTrstInst.AppCantBeSpecIdentAbov",      X.aCant);
    _triOpt(j,P+"AppTowExpTrstInst.CostNewAssetUs11_1A",         X.aCost);
    _triAlways(j,P+"AppTowExpTrstInst.TotalA1toA11",   X.a12);
    /* B — expenditure not allowed (optional details + required total) */
    _triOpt(j,P+"ExpNotAllowedApplication.DonFormingPartCorpusFund",      X.bCorpus);
    _triOpt(j,P+"ExpNotAllowedApplication.DonationTowardsOtherThanCorpus",X.bOther);
    _triOpt(j,P+"ExpNotAllowedApplication.DonationNotSameObject",         X.bNotSame);
    _triOpt(j,P+"ExpNotAllowedApplication.DonationOtherThanTrust",        X.bTrust);
    _triOpt(j,P+"ExpNotAllowedApplication.ApplctnOutIndiaApprvlObtnd",    X.bOutApp);
    _triOpt(j,P+"ExpNotAllowedApplication.ApplctnOutIndiaApprvlNotObtnd", X.bOutNot);
    _triOpt(j,P+"ExpNotAllowedApplication.AppliedBeyondObject",           X.bBeyond);
    _triOpt(j,P+"ExpNotAllowedApplication.AnyOthrDisallowableExpenditure",X.bDis);
    _triAlways(j,P+"ExpNotAllowedApplication.TotExpNotAllowedApplication",X.bTot);
    /* C — source of fund (optional details + required total) */
    _triOpt(j,P+"SrcRevCapApplctn.IncDerFrmPrprty",       X.cProp);
    _triOpt(j,P+"SrcRevCapApplctn.IncAccumulatedEarlierYr",X.cAccum);
    _triOpt(j,P+"SrcRevCapApplctn.IncDeemdPrcdngYr",      X.cDeem);
    _triOpt(j,P+"SrcRevCapApplctn.EarlierYrIncUpto15Per", X.cE15);
    _triOpt(j,P+"SrcRevCapApplctn.Corpus",                X.cCorp);
    _triOpt(j,P+"SrcRevCapApplctn.BorrowedFund",          X.cBorr);
    _triAlways(j,P+"SrcRevCapApplctn.TotSrcRevCapApplctn",X.cTot);
    /* C8 — Any other source (array + its total) */
    const oth=(X.cOthers||[]);
    if(oth.length){
      _triAlways(j,P+"SrcRevCapApplctn.OthersInc.TotOthersInc",X.cOthTot);
      j.ScheduleA.SrcRevCapApplctn.OthersInc.OthersIncDtls = oth.map(r=>{
        const o={};
        pf(o,"OthNatOfInc",(st0(r.nat)||"NA").slice(0,125));
        pf(o,"OthRevAmount",sg(r.rev));
        pf(o,"OthCapAmount",sg(r.cap));
        return o;});
    }
    /* D–G — reconciliation */
    _triAlways(j,P+"TotAmtAppDrngPrevYr",         X.d);
    _triOpt(j,   P+"AmountNotPaidPY",             X.e);
    _triOpt(j,   P+"AmountPaidPY",                X.f);
    _triAlways(j,P+"TotAmountAllowedApplication", X.g);
  }

  /* ---------- Schedule I ---------- */
  const iCalc=C.iCalc||[];
  if(iCalc.length){
    j.ITRScheduleI = j.ITRScheduleI || {};
    j.ITRScheduleI.ScheduleI = iCalc.map(r=>{
      const o={};
      pf(o,"AccumlatedYear",sg(r.year));
      pf(o,"AmountAccumlated",sg(r.acc));
      pf(o,"AccumulationPurpose",(st0(r.purpose)||"NA").slice(0,200));
      pf(o,"AmountAppliedPreviousYear",sg(r.applPY));
      pf(o,"BalanceAfterPY",sg(r.bal5));
      pf(o,"AmtTxdErlAssYr",sg(r.txd));
      pf(o,"BalAvailApp",sg(r.bal7));
      pf(o,"AmountAppliedDuringYear",sg(r.appl8));
      pf(o,"AmountAppliedDuringYearOtherPurpose",sg(r.appl9));
      pf(o,"AmountCreditedTrust",sg(r.cred10));
      pf(o,"BalanceAmount",sg(r.bal11));
      pf(o,"AmountInvested",sg(r.inv12));
      pf(o,"AmountInvestedInOtherMode",sg(r.inv13));
      pf(o,"AmountNotUtilized",sg(r.notUtil14));
      pf(o,"AmountDeemedUs11",sg(r.deemed15));
      return o;});
    const T=C.iTot||{};
    put(j,"ITRScheduleI.TotAmountAccumlated",sg(T.acc));
    put(j,"ITRScheduleI.TotAmountAppliedPreviousYear",sg(T.applPY));
    put(j,"ITRScheduleI.TotBalanceAfterPY",sg(T.bal5));
    put(j,"ITRScheduleI.TotAmtTxdErlAssYr",sg(T.txd));
    put(j,"ITRScheduleI.TotBalAvailApp",sg(T.bal7));
    put(j,"ITRScheduleI.TotAmountAppliedDuringYear",sg(T.appl8));
    put(j,"ITRScheduleI.TotAmountAppliedDuringYearOtherPurpose",sg(T.appl9));
    put(j,"ITRScheduleI.TotAmountCreditedTrust",sg(T.cred10));
    put(j,"ITRScheduleI.TotBalanceAmount",sg(T.bal11));
    put(j,"ITRScheduleI.TotAmountInvested",sg(T.inv12));
    put(j,"ITRScheduleI.TotAmountInvestedInOtherMode",sg(T.inv13));
    put(j,"ITRScheduleI.TotAmountNotUtilized",sg(T.notUtil14));
    put(j,"ITRScheduleI.TotAmountDeemedUs11",sg(T.deemed));
  }

  /* ---------- Schedule IA ---------- */
  const iaCalc=C.iaCalc||[];
  if(iaCalc.length){
    j.ITRScheduleIA = j.ITRScheduleIA || {};
    j.ITRScheduleIA.YrOfAccDtls = iaCalc.map(r=>{
      const o={};
      pf(o,"YrOfAccumulationIA",_inSet(APP_IAYEAR,r.yr)||"NA");
      pf(o,"AssYr22_23",sg(r.a2223));
      pf(o,"AssYr23_24",sg(r.a2324));
      pf(o,"AssYr24_25",sg(r.a2425));
      pf(o,"AssYr25_26",sg(r.a2526));
      pf(o,"Total",sg(r.total));
      return o;});
    put(j,"ITRScheduleIA.GrandTotal",sg(C.iaGrand));
  }

  /* ---------- Schedule D ---------- */
  const dCalc=C.dCalc||[];
  if(dCalc.length){
    j.ITRScheduleD = j.ITRScheduleD || {};
    j.ITRScheduleD.ScheduleD = dCalc.map(r=>{
      const o={}, reason=_inSet(APP_DREASON,r.reason)||"1";
      pf(o,"AppliedYear",_inSet(APP_DYEAR,r.year)||"1");
      pf(o,"AmountAppliedPY",sg(r.amtPY));
      pf(o,"DeemedApplicationReason",reason);
      if(reason==="2"&&st0(r.reasonDesc)) pf(o,"ReasonDesc",st0(r.reasonDesc).slice(0,250));
      pf(o,"OutOfDeemedAmtReqApp",sg(r.reqApp));
      pf(o,"AmtTxdErlAssYr",sg(r.txd));
      pf(o,"AmountToBeApplied",sg(r.toApply));
      pf(o,"AmountAppliedCurrAY",sg(r.appliedCurr));
      pf(o,"AmountNotAppliedCurrAY",sg(r.notApplied));
      pf(o,"BalanceAmount",sg(r.balance));
      return o;});
    const T=C.dTot||{};
    put(j,"ITRScheduleD.TotOutOfDeemedAmtReqApp",sg(T.reqApp));
    put(j,"ITRScheduleD.TotAmtTxdErlAssYr",sg(T.txd));
    put(j,"ITRScheduleD.TotAmountAppliedPY",sg(T.amtPY));
    put(j,"ITRScheduleD.TotAmountToBeApplied",sg(T.toApply));
    put(j,"ITRScheduleD.TotAmountAppliedCurrAY",sg(T.appliedCurr));
    put(j,"ITRScheduleD.TotAmountNotAppliedCurrAY",sg(T.notApplied));
    put(j,"ITRScheduleD.TotBalanceAmount",sg(T.balance));
  }

  /* ---------- Schedule DA ---------- */
  const daCalc=C.daCalc||[];
  if(daCalc.length){
    j.ITRScheduleDA = j.ITRScheduleDA || {};
    j.ITRScheduleDA.YrOfAccumDtls = daCalc.map(r=>{
      const o={};
      if(_inSet(APP_DAYEAR,r.yr)) pf(o,"YrOfAccumulationDA",_inSet(APP_DAYEAR,r.yr));
      pf(o,"AssYrPriorToAY",sg(r.prior));
      pf(o,"AssYr22_23",sg(r.a2223));
      pf(o,"AssYr23_24",sg(r.a2324));
      pf(o,"AssYr24_25",sg(r.a2425));
      pf(o,"AssYr25_26",sg(r.a2526));
      pf(o,"Total",sg(r.total));
      return o;});
    put(j,"ITRScheduleDA.GrandTotal",sg(C.daGrand));
  }
}

/* ==================================================================
   IMPORT (inverse of export)
   ================================================================== */
function _impTri(o){o=o||{};return {rev:nz(o.Revenue), cap:nz(o.Capital)};}

function impApp(I){
  const read=[]; S.app=S.app||{};
  const A=S.app; A.a=A.a||{}; A.b=A.b||{}; A.c=A.c||{}; A.g=A.g||{};

  /* ---------- Schedule A ---------- */
  const SA=I&&I.ScheduleA;
  if(SA){
    const AT=SA.AppTowExpTrstInst||{}, EX=SA.ExpNotAllowedApplication||{},
          SR=SA.SrcRevCapApplctn||{};
    A.a.otherCorpus =_impTri(AT.OtherThanCorpus);
    A.a.religious   =_impTri(AT.Religious);
    A.a.reliefPoor  =_impTri(AT.ReliefOfPoor);
    A.a.educational =_impTri(AT.Educational);
    A.a.yoga        =_impTri(AT.Yoga);
    A.a.medical     =_impTri(AT.MedicalRelief);
    A.a.environ     =_impTri(AT.PreservationOfEnvrmnt);
    A.a.monuments   =_impTri(AT.PreservationOfMonumentsEtc);
    A.a.gpu         =_impTri(AT.GeneralPublicUtility);
    A.a.cantIdent   =_impTri(AT.AppCantBeSpecIdentAbov);
    A.a.costNewAsset=_impTri(AT.CostNewAssetUs11_1A);
    A.b.corpusDon     =_impTri(EX.DonFormingPartCorpusFund);
    A.b.otherThanCorpus=_impTri(EX.DonationTowardsOtherThanCorpus);
    A.b.notSameObj    =_impTri(EX.DonationNotSameObject);
    A.b.otherThanTrust=_impTri(EX.DonationOtherThanTrust);
    A.b.outIndiaApp   =_impTri(EX.ApplctnOutIndiaApprvlObtnd);
    A.b.outIndiaNotApp=_impTri(EX.ApplctnOutIndiaApprvlNotObtnd);
    A.b.beyondObj     =_impTri(EX.AppliedBeyondObject);
    A.b.otherDisallow =_impTri(EX.AnyOthrDisallowableExpenditure);
    A.c.incProperty=_impTri(SR.IncDerFrmPrprty);
    A.c.incAccum   =_impTri(SR.IncAccumulatedEarlierYr);
    A.c.incDeemed  =_impTri(SR.IncDeemdPrcdngYr);
    A.c.earlier15  =_impTri(SR.EarlierYrIncUpto15Per);
    A.c.corpus     =_impTri(SR.Corpus);
    A.c.borrowed   =_impTri(SR.BorrowedFund);
    A.cOthers=(((SR.OthersInc||{}).OthersIncDtls)||[]).map(r=>({
      nat:r.OthNatOfInc||"", rev:nz(r.OthRevAmount), cap:nz(r.OthCapAmount)}));
    A.g.notPaid=_impTri(SA.AmountNotPaidPY);
    A.g.paidPY =_impTri(SA.AmountPaidPY);
    read.push("Schedule A");
  }

  /* ---------- Schedule I ---------- */
  const SI=I&&I.ITRScheduleI;
  if(SI&&Array.isArray(SI.ScheduleI)){
    A.iRows=SI.ScheduleI.map(r=>({
      year:nz(r.AccumlatedYear), acc:nz(r.AmountAccumlated),
      purpose:r.AccumulationPurpose||"", applPY:nz(r.AmountAppliedPreviousYear),
      txd:nz(r.AmtTxdErlAssYr), appl8:nz(r.AmountAppliedDuringYear),
      appl9:nz(r.AmountAppliedDuringYearOtherPurpose), cred10:nz(r.AmountCreditedTrust),
      inv12:nz(r.AmountInvested), inv13:nz(r.AmountInvestedInOtherMode),
      notUtil14:nz(r.AmountNotUtilized)}));
    read.push("Schedule I");
  }

  /* ---------- Schedule IA ---------- */
  const IA=I&&I.ITRScheduleIA;
  if(IA&&Array.isArray(IA.YrOfAccDtls)){
    A.iaRows=IA.YrOfAccDtls.map(r=>({
      yr:_inSet(APP_IAYEAR,r.YrOfAccumulationIA), prior:nz(r.AssYr21_22),
      a2223:nz(r.AssYr22_23), a2324:nz(r.AssYr23_24),
      a2425:nz(r.AssYr24_25), a2526:nz(r.AssYr25_26)}));
    read.push("Schedule IA");
  }

  /* ---------- Schedule D ---------- */
  const SD=I&&I.ITRScheduleD;
  if(SD&&Array.isArray(SD.ScheduleD)){
    A.dRows=SD.ScheduleD.map(r=>({
      year:_inSet(APP_DYEAR,r.AppliedYear), amtPY:nz(r.AmountAppliedPY),
      reason:_inSet(APP_DREASON,r.DeemedApplicationReason), reasonDesc:r.ReasonDesc||"",
      reqApp:nz(r.OutOfDeemedAmtReqApp), txd:nz(r.AmtTxdErlAssYr),
      toApply:nz(r.AmountToBeApplied), appliedCurr:nz(r.AmountAppliedCurrAY)}));
    read.push("Schedule D");
  }

  /* ---------- Schedule DA ---------- */
  const DA=I&&I.ITRScheduleDA;
  if(DA&&Array.isArray(DA.YrOfAccumDtls)){
    A.daRows=DA.YrOfAccumDtls.map(r=>({
      yr:_inSet(APP_DAYEAR,r.YrOfAccumulationDA), priorAY:nz(r.AssYrPriorToAY),
      a2223:nz(r.AssYr22_23), a2324:nz(r.AssYr23_24),
      a2425:nz(r.AssYr24_25), a2526:nz(r.AssYr25_26)}));
    read.push("Schedule DA");
  }
  return read;
}

/* ==================================================================
   CHECKS (section-local sanity — not the Phase-6 rule engine)
   ================================================================== */
function chkApp(){
  const out=[]; engApp();
  const C=S.C.app||{}, X=C.A||{};

  /* Schedule A — application should not exceed the income base */
  if(C.applied>0 && C.incomeBase>0 && C.totalApplied>C.incomeBase*1.0001)
    out.push({lvl:"warn",t:"Application vs income",m:"Application allowed ("+RS(C.totalApplied)+
      ") exceeds the income base ("+RS(C.incomeBase)+") — check Schedule A / the income schedules.",sec:"app"});
  if(X.g && (X.g.rev<0||X.g.cap<0))
    out.push({lvl:"warn",t:"Schedule A · row G",m:"The amount allowed as application (G = D − E + F) is negative — check Parts B, C and E.",sec:"app"});
  if(C.applied>0 && C.incomeBase>0 && C.totalApplied < C.incomeBase*0.85)
    out.push({lvl:"ok",t:"85% application test",m:"Application allowed ("+RS(C.totalApplied)+
      ") is below 85% of the income base ("+RS(C.incomeBase)+"); the shortfall must be accumulated u/s 11(2) or is taxable.",sec:"app"});

  /* Schedule I — each live row needs a valid year, amount and purpose */
  (S.app.iRows||[]).forEach((r,i)=>{ if(!_iLive(r))return;
    if(!_inSet(APP_IYEAR,r.year))
      out.push({lvl:"err",t:"Schedule I · row "+(i+1),m:"Choose the year of accumulation.",sec:"app"});
    if(!st0(r.purpose))
      out.push({lvl:"warn",t:"Schedule I · row "+(i+1),m:"State the purpose of accumulation (exported as \"NA\" otherwise).",sec:"app"});
  });
  if((C.iTot||{}).deemed>0)
    out.push({lvl:"ok",t:"Deemed income u/s 11(3)",m:RS(C.deemed11_3)+" is deemed to be income u/s 11(3) and is carried to Part B-TI.",sec:"app"});

  /* Schedule D — reason description required when reason is "Any other" */
  (S.app.dRows||[]).forEach((r,i)=>{ if(!_dLive(r))return;
    if(!_inSet(APP_DYEAR,r.year))
      out.push({lvl:"err",t:"Schedule D · row "+(i+1),m:"Choose the year in which income is deemed applied.",sec:"app"});
    if(_inSet(APP_DREASON,r.reason)==="2" && !st0(r.reasonDesc))
      out.push({lvl:"err",t:"Schedule D · row "+(i+1),m:"Give the reason description when the reason of deeming is \"Any other reason\".",sec:"app"});
  });
  if((C.dTot||{}).notApplied>0)
    out.push({lvl:"ok",t:"Deemed income u/s 11(1B)",m:RS(C.deemed11_1B)+" could not be applied and is deemed to be income u/s 11(1B), carried to Part B-TI.",sec:"app"});

  /* Schedule IA / DA reconciliation notes */
  if(C.iaGrand>0 && (C.iTot||{}).txd>0 && Math.abs(C.iaGrand-(C.iTot||{}).txd)>1)
    out.push({lvl:"warn",t:"Schedule IA reconciliation",m:"Schedule IA grand total ("+RS(C.iaGrand)+
      ") does not tie to Schedule I col 6 (amount taxed in earlier AYs, "+RS((C.iTot||{}).txd)+").",sec:"app"});
  if(C.daGrand>0 && (C.dTot||{}).txd>0 && Math.abs(C.daGrand-(C.dTot||{}).txd)>1)
    out.push({lvl:"warn",t:"Schedule DA reconciliation",m:"Schedule DA grand total ("+RS(C.daGrand)+
      ") does not tie to Schedule D col 5 (amount taxed in earlier AYs, "+RS((C.dTot||{}).txd)+").",sec:"app"});

  if(C.applied>0 && !out.some(o=>o.lvl==="err"))
    out.push({lvl:"ok",t:"Application allowed",m:"Schedule A allows "+RS(C.applied)+" as application of income.",sec:"app"});
  return out;
}

/* ==================================================================
   REGISTER (overrides the boot stub)
   ================================================================== */
reg({id:"app", t:"Application & accumulation of income", ref:"Schedule A · I · IA · D · DA",
  f:secApp,
  s:()=>{const C=S.C.app||{}; return C.applied?RS(C.applied):"";},
  eng:engApp, exp:expApp, imp:impApp, chk:chkApp, order:120, corder:55});
