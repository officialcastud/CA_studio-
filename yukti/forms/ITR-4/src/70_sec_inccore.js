/* =====================================================================
   ITR-4 (SUGAM) · builder "inccore" — the core Income Details flow.
   Screen sections rendered: who · ret · inc · hp · tax.
   Schema blocks OWNED (export + import):
     PersonalInfo, FilingStatus, IncomeDeductions (all of it — salary,
     PropertyDetails/HP, IncomeFromBusinessProf, OthersInc, Chapter VI-A
     totals, GrossTotIncome, TotalIncome), TaxComputation, ScheduleBP
     (presumptive 44AD/44ADA/44AE), LTCG112A, TaxExmpIntIncDtls.
   Compute: engInc at order 20 (all income heads), engTax at order 80
     (Part D roll-up → footer contract). Reads (S.C.ded||{}).total (Chapter
     VI-A, regime-gated by the `ded` builder) and (S.C.paid||{}).total
     (taxes paid, by `paidbank`), both guarded.

   Built ONLY from ITR-4 books: Income_Details.md, HP.md, BP.md,
   Taxes_Paid_and_Verification.md (rule 2 — no engine ported from another
   form). Every formula carries its sheet cell ref in a comment.

   REGIME (task "## Regime (ITR-4)" note; there is no books/ITR-4/REGIME.md):
   New regime u/s 115BAC(1A) is the default; opting out (old) is via Form
   10-IEA (FilingStatus). isNew() = S.fs.optout!=="Yes". In the NEW regime:
     · exempt allowances 10(5)/10(13A)/10(14)(i)/10(14)(ii) close (rules #920/#990/#1000);
     · s.16(ii) entertainment allowance and s.16(iii) professional tax close;
     · s.24(b) interest on a self-occupied house closes;
     · s.57(iia) family-pension deduction is old-regime only;
     · a house-property loss cannot be set off (head floored at 0);
     · 87A rebate is up to Rs.60,000 for total income (excl. LTCG) up to Rs.12L (rule #1135),
       vs Rs.12,500 up to Rs.5L in the old regime (rule #1145).
   The Rs.75,000 standard deduction u/s 16(ia) and the family-pension part of
   s.57 stay in both. Chapter VI-A gating is the `ded` builder's job; inccore
   only reads its regime-gated total.

   NOTE on the tax method: ITR-4's Income_Details.md marks Part D lines
   D8–D11a (interest u/s 234A/234B/234C, fee 234F/234-I) as INPUTS, not
   computed ("only D6 relief, D8–D11a interest/fee are inputs"); only the
   slab tax (D1), 87A rebate (D2), tax after rebate (D3), cess (D4), total
   tax & cess (D5) and D7/D12 sums are computed. The AY 2026-27 slab rates
   themselves are not in ITR-4's books (no TaxCalc book / empty REGIME.md);
   they are the Finance Act 2025 statutory slabs, encoded below with the
   rebate caps confirmed by rules.json #1135/#1145 and the schema
   Rebate87A max 60000 (rule 17: source gap noted in the build report).
   ===================================================================== */

/* ---------------------------------------------------------------------
   STATE
   ------------------------------------------------------------------- */
S.pi = S.pi || {};
if(S.pi.status===undefined) S.pi.status="I";      /* PersonalInfo.Status  I/H/F */
if(S.pi.res===undefined)    S.pi.res="RES";       /* residential status (drives 87A) */
if(S.pi.country===undefined)S.pi.country="91";     /* Address.CountryCode 91-INDIA */
if(S.pi.empcat===undefined) S.pi.empcat="OTH";     /* EmployerCategory */
if(S.pi.secAdd===undefined) S.pi.secAdd="Y";       /* SecondaryAdd Y/N */

S.fs = S.fs || {};
if(S.fs.optout===undefined) S.fs.optout="No";      /* master regime switch → isNew() */
if(S.fs.sec===undefined)    S.fs.sec=11;           /* FilingStatus.ReturnFileSec (11=139(1)) */
if(S.fs.f10ieaEarlier===undefined) S.fs.f10ieaEarlier="NA"; /* Form10IEAEarlierAYOldRegime (mandatory) */
if(S.fs.duedate===undefined)S.fs.duedate="2026-08-31";      /* ItrFilingDueDate — non-audit (finalDuedate) */
if(S.fs.seventh===undefined)S.fs.seventh="N";      /* SeventhProvisio139 */
if(S.fs.rep===undefined)    S.fs.rep="N";          /* AsseseeRepFlg */
S.fs.clause7 = S.fs.clause7 || [];                 /* clauseiv7provisio139iDtls[] */

/* ic — this builder's own working namespace (arrays seeded [], cards off).
   IC is captured once and every engine below closes over it, so it must
   ALWAYS equal S.ic. seedIC() fills missing keys; afterOpen() re-points IC
   to a freshly-loaded S.ic (importFile replaces the object) then re-seeds,
   so opening a saved working file never leaves the engines on a stale ic. */
S.ic = S.ic || {};
const IC=S.ic;
function seedIC(){
  IC.sal = IC.sal || {};                           /* salary breakup */
  IC.sal.alw = IC.sal.alw || [];                   /* AllwncExemptUs10Dtls[] */
  IC.hp  = IC.hp  || [];                            /* PropertyDetails[] (max 2) */
  IC.os  = IC.os  || {};                            /* other sources */
  IC.os.rows = IC.os.rows || [];                    /* OthersIncDtlsOthSrc[] */
  IC.bp  = IC.bp  || {};                            /* ScheduleBP */
  IC.bp.nad  = IC.bp.nad  || [];                    /* NatOfBus44AD[] */
  IC.bp.ad   = IC.bp.ad   || {};                    /* PersumptiveInc44AD */
  IC.bp.nada = IC.bp.nada || [];                    /* NatOfBus44ADA[] */
  IC.bp.ada  = IC.bp.ada  || {};                    /* PersumptiveInc44ADA */
  IC.bp.nae  = IC.bp.nae  || [];                    /* NatOfBus44AE[] */
  IC.bp.gcv  = IC.bp.gcv  || [];                    /* GoodsDtlsUs44AE[] (max 10) */
  IC.bp.ae   = IC.bp.ae   || {};                    /* PersumptiveInc44AE (E6 SalInterestByFirm) */
  IC.bp.gstn = IC.bp.gstn || [];                    /* TurnoverGrsRcptForGSTIN[] */
  IC.bp.fin  = IC.bp.fin  || {};                    /* FinanclPartclrOfBusiness */
  IC.ltcg = IC.ltcg || {};                          /* LTCG112A (D20a) */
  IC.exmp = IC.exmp || [];                          /* TaxExmpIntIncDtls OthersIncDtls[] (D20) */
  IC.d   = IC.d   || {};                            /* Part D inputs (relief 89, interest, fees) */
}
seedIC();
function afterOpen(){
  if(S.ic&&S.ic!==IC){for(const k in IC)delete IC[k];Object.assign(IC,S.ic);}
  S.ic=IC;seedIC();
}

/* SEED — the shell's add-row handler carries its own literal seed table and
   shadows this global SEED; these are documented defaults (rows added blank). */
SEED["ic.hp"]=SEED["ic.hp"]||{};
SEED["ic.sal.alw"]=SEED["ic.sal.alw"]||{};

/* ---------------------------------------------------------------------
   CODE TABLES (clean labels from the books; codes verbatim from enums.json)
   ------------------------------------------------------------------- */
const STATUS=[["I","Individual"],["H","HUF"],["F","Firm (other than LLP)"]];
const EMPCAT=[["CGOV","Central Government"],["SGOV","State Government"],
  ["PSU","Public Sector Undertaking"],["PE","Pensioners - CG"],["PESG","Pensioners - SG"],
  ["PEPS","Pensioners - PSU"],["PEO","Pensioners - Others"],["OTH","Others"],
  ["NA","Not Applicable (eg. Family pension etc)"]];
const RES_STAT=[["RES","Resident"],["NRI","Non-Resident"],["NOR","Resident but not Ordinarily Resident"]];
const RET_SEC=[["11","139(1)-On or before due date"],["12","139(4)-After due date"],
  ["13","142(1)"],["14","148"],["16","153C"],["17","139(5)-Revised Return"],
  ["18","139(9)"],["20","119(2)(b)-After condonation of delay"]];
const DUE_DATES=[["2026-08-31","31/08/2026"],["2026-10-31","31/10/2026"],["2026-11-30","30/11/2026"]];
const YN=[["Y","Yes"],["N","No"]];
const YNNA=[["Y","Yes"],["N","No"],["NA","Not applicable"]];
const AY10IEA=[["2024-25","2024-25"],["2025-26","2025-26"]];
const CLAUSE7=[["1","Sales/turnover/gross receipts of business exceeds sixty lakh rupees"],
  ["2","Gross receipts in profession exceeds ten lakh rupees"],
  ["3","Aggregate of TDS and TCS is twenty-five thousand rupees or more"],
  ["4","Deposit in one or more savings bank account is fifty lakh rupees or more"]];
/* exempt allowances u/s 10 (I122); regime-closed set flagged below */
const ALW_NAT=[["10(5)","Sec 10(5)-Leave Travel concession/assistance"],
  ["10(6)","Sec 10(6)-Remuneration of an official of an embassy etc."],
  ["10(7)","Sec 10(7)-Allowances/perquisites outside India by Govt to a citizen"],
  ["10(10)","Sec 10(10)-Death-cum-retirement gratuity received"],
  ["10(10A)","Sec 10(10A)-Commuted value of pension received"],
  ["10(10AA)","Sec 10(10AA)-Earned leave encashment on retirement"],
  ["10(10C)","Sec 10(10C)-VRS / termination compensation"],
  ["10(10CC)","Sec 10(10CC)-Tax paid by employer on non-monetary perquisite"],
  ["10(13A)","Sec 10(13A)-House rent allowance"],
  ["10(14)(i)","Sec 10(14)(i)-Prescribed allowances to meet duties of office"],
  ["10(14)(ii)","Sec 10(14)(ii)-Prescribed allowances to meet personal expenses"],
  ["10(17)","Sec 10(17)-Allowance MP/MLA/MLC"]];
const ALW_CLOSED_NEW={"10(5)":1,"10(13A)":1,"10(14)(i)":1,"10(14)(ii)":1};   /* rules #920/#990/#1000 */
/* other-sources nature (I147); FAP (family pension) not for HUF/Firm (others1) */
const OS_NAT=[["SAV","Interest from Saving Bank Account"],
  ["IFD","Interest from Deposit (Bank/Post Office/Cooperative Society)"],
  ["TAX","Interest from Income Tax Refund"],["FAP","Family pension"],["DIV","Dividend"],
  ["OTH","Any Other"]];
const PROP_OWNER=[["SE","Self"],["MI","Minor"],["SP","Spouse"],["OT","Others"]];
const IF_LETOUT=[["L","Let Out"],["D","Deemed let out"],["S","Self Occupied"]];
const COOWN=[["YES","Yes"],["NO","No"]];
const LOAN_FROM=[["B","Bank"],["I","Other than Bank"]];
const OWN_LEASE=[["OWN","Owned"],["LEASE","Leased"],["HIRED","Hired"]];
const NOB44AE=[["08001","08001-Renting of land transport equipment"],
  ["11002","11002-Packers and movers"],["11008","11008-Freight transport by road"],
  ["11010","11010-Forwarding of freight"],["11011","11011-Receiving and acceptance of freight"],
  ["11012","11012-Cargo handling"],["11015","11015-Other Transport & Logistics services n.e.c"]];
const EXMP_CAT=[["AGRI","Agricultural & related incomes"],
  ["GOVC","Compensation/other sums from government/approved entities"],
  ["ISI","Income from specified Investments"],
  ["SSRA","Specified sums received by armed forces personnel"],
  ["SRSC","Sums received by Senior Citizens/Minors"],
  ["SRST","Sums received by specified Category of Taxpayers"],
  ["SRPC","Sums from policies/contributions (LIC/NPS/PF/SSY)"],["OTH","Other Incomes"]];
const STATE_CODES=[["01","01-Andaman and Nicobar islands"],["02","02-Andhra Pradesh"],
  ["03","03-Arunachal Pradesh"],["04","04-Assam"],["05","05-Bihar"],["06","06-Chandigarh"],
  ["07","07-Dadra & Nagar Haveli and Daman & Diu"],["09","09-Delhi"],["10","10-Goa"],
  ["11","11-Gujarat"],["12","12-Haryana"],["13","13-Himachal Pradesh"],["14","14-Jammu and Kashmir"],
  ["15","15-Karnataka"],["16","16-Kerala"],["17","17-Lakshadweep"],["18","18-Madhya Pradesh"],
  ["19","19-Maharashtra"],["20","20-Manipur"],["21","21-Meghalaya"],["22","22-Mizoram"],
  ["23","23-Nagaland"],["24","24-Odisha"],["25","25-Puducherry"],["26","26-Punjab"],
  ["27","27-Rajasthan"],["28","28-Sikkim"],["29","29-Tamil Nadu"],["30","30-Tripura"],
  ["31","31-Uttar Pradesh"],["32","32-West Bengal"],["33","33-Chattisgarh"],["34","34-Uttarakhand"],
  ["35","35-Jharkhand"],["36","36-Telangana"],["37","37-Ladakh"],["99","99-Foreign"]];

/* =====================================================================
   ENGINE HELPERS — tax on the slabs (Finance Act 2025; see NOTE above)
   ===================================================================== */
function icAge(){                                  /* age at 31-Mar-2026 (shell YREND) */
  return (typeof age==="function")?age():0;
}
function icBrackets(brks,ti){                        /* progressive tax over [lo,hi,rate] triples */
  let t=0,prev=0;
  for(const b of brks){ const lim=b[0], rate=b[1];
    const seg=Math.max(0, Math.min(ti,lim)-prev);
    t+=seg*rate; prev=Math.max(prev,lim); }
  return R(t);
}
/* NEW regime 115BAC(1A), AY 2026-27 — individual & HUF, no age benefit */
function icTaxNew(ti){
  return icBrackets([[400000,0],[800000,0.05],[1200000,0.10],[1600000,0.15],
    [2000000,0.20],[2400000,0.25],[Infinity,0.30]], ti);
}
/* OLD regime — individual (age slab) / HUF (uses <60 basic exemption) */
function icTaxOld(ti){
  const a=icAge(); const status=S.pi.status||"I";
  let basic=250000;
  if(status==="I"){ if(a>=80)basic=500000; else if(a>=60)basic=300000; }
  return icBrackets([[basic,0],[500000,0.05],[1000000,0.20],[Infinity,0.30]], ti);
}

/* =====================================================================
   ENGINE — engInc(): all income heads → S.C.inc / S.C.hp (order 20)
   ===================================================================== */
function engInc(){
  const A={income:0};

  /* ---- Salary (Income_Details B1 salary rows H111–H135) ---- */
  const s1=N(IC.sal.s17_1), s2=N(IC.sal.s17_2), s3=N(IC.sal.s17_3);
  const gross=s1+s2+s3;                                             /* H111 (i)=ia+ib+ic */
  let exempt=0;
  (IC.sal.alw||[]).forEach(r=>{
    const nat=st0(r.nat), amt=N(r.amt);
    if(isNew() && ALW_CLOSED_NEW[nat]) return;                      /* rules #920/#990/#1000 — closed in new */
    exempt+=amt;
  });
  const netSal=Math.max(0, gross-exempt);                          /* H130 (iii) Net Salary = i − ii  [#320] */
  const stdDed = gross>0 ? Math.min(isNew()?75000:50000, netSal) : 0;/* H132 16(ia) std ded — 75000 new regime, 50000 old (rule A143) */
  const ent = isNew()?0:Math.min(5000, N(IC.sal.ent));            /* H133 16(ii) — old regime only, max 5000 */
  const ptax= isNew()?0:Math.min(5000, N(IC.sal.ptax));          /* H134 16(iii) — old regime only, max 5000 */
  const ded16=stdDed+ent+ptax;                                    /* H131 (iv) = iva+ivb+ivc  [#325] */
  const incSal=Math.max(0, netSal-ded16);                         /* H135 (v) = iii − iv  [#330] */

  /* ---- Presumptive business/profession — Schedule BP → E8 (B1) ---- */
  const ad=IC.bp.ad||{};
  const e1a=N(ad.bank), e1b=N(ad.cash), e1c=N(ad.other);
  const e1=e1a+e1b+e1c;                                            /* [I19] E1 = a+b+c */
  const p6=R(0.06*e1a);                                            /* E2a 6% of E1a */
  const p8=R(0.08*(e1b+e1c));                                     /* E2b 8% of (E1b+E1c) */
  const e2a=Math.max(p6, N(ad.claim6));                            /* or amount claimed, whichever higher */
  const e2b=Math.max(p8, N(ad.claim8));
  const e2c=(e1>0)?(e2a+e2b):0;                                    /* [I26] E2c = a+b */

  const ada=IC.bp.ada||{};
  const e3a=N(ada.bank), e3b=N(ada.cash), e3c=N(ada.other);
  const e3=e3a+e3b+e3c;                                            /* [I37] E3 = a+b+c */
  const e4=(e3>0)?Math.max(R(0.50*e3), N(ada.claim)):0;           /* E4 = 50% of E3 or claimed, higher */

  let e5=0;                                                        /* [I65] E5 = Σ per-vehicle presumptive */
  (IC.bp.gcv||[]).forEach(v=>{ e5+=N(v.pi); });
  const e6=(S.pi.status==="F")?N(IC.bp.ae.salint):0;              /* E6 salary/interest to partners — firms only */
  const e7=Math.max(0, e5-e6);                                    /* [I71] E7 = max(0, E5 − E6) */
  const e8=Math.max(0, e2c+e4+e7);                               /* [I72] E8 = E2c + E4 + E7 = IncomeFromBusinessProf */

  /* ---- House property (HP.md; PropertyDetails[]) ---- */
  let hpHead=0; const hpCalc=[];
  (IC.hp||[]).forEach(p=>{
    const self=(p.let==="S");
    const a=self?0:N(p.gross);                                     /* a gross rent (nil if self-occupied) */
    const b=N(p.notReal);                                          /* b rent not realised */
    const c=self?0:N(p.localTax);                                  /* c local taxes — not allowed for self-occ [#305] */
    const d=b+c;                                                   /* d = b + c  [I28] */
    const e=Math.max(a-d,0);                                       /* e annual value = max(a−d,0)  [K29] */
    const share=(p.share===""||p.share==null)?100:N(p.share);
    const f=self?0:Math.max(0,R(share/100*e));                     /* f = share% × e  [K30] */
    const g=R(0.30*f);                                             /* g 30% of f  [I31] */
    let intr=0; (p.loans||[]).forEach(l=>{ intr+=N(l.intr); });    /* Σ Section24B InterestUs24B  [K41] */
    if(self||p.let==="D"){ intr=Math.min(intr,200000); }          /* not let out → cap 2 lakh (H73) */
    if(isNew() && self){ intr=0; }                                 /* new regime: self-occupied 24(b) closes */
    const totDed=g+intr;                                           /* i = g + h  [K42] */
    const j=N(p.arrears);                                          /* j arrears/unrealised less 30% */
    const k=f-totDed+j;                                            /* k = f − i + j  [K44] (may be negative) */
    hpHead+=k;
    hpCalc.push({a,b,c,d,e,f,g,intr,totDed,j,k,share});
  });
  /* [K87] head = max(-200000, Σk); new regime disallows HP loss set-off → floor 0 */
  hpHead = isNew() ? Math.max(0, hpHead) : Math.max(-200000, hpHead);

  /* ---- Other sources (B4) ---- */
  let osGross=0; const osCalc=[]; let famPension=0; let savInt=0; let depInt=0;
  (IC.os.rows||[]).forEach(r=>{
    let amt;
    if(r.nat==="DIV"){ amt=N(r.q1)+N(r.q2)+N(r.q3)+N(r.q4)+N(r.q5); }  /* dividend quarter split H163–H168 */
    else { amt=N(r.amt); }
    if(r.nat==="FAP") famPension+=amt;
    if(r.nat==="SAV") savInt+=amt;                                    /* savings-bank interest → 80TTA cap */
    if(r.nat==="IFD") depInt+=amt;                                    /* deposit interest → 80TTB cap */
    osGross+=amt; osCalc.push({amt});
  });
  /* F170 57(iia) family-pension deduction: old regime only; ≤ lower of 1/3 FP or 15,000 [#475/#480] */
  let ded57=0;
  if(!isNew() && famPension>0){ ded57=Math.min(N(IC.os.fp57), Math.round(famPension/3), 15000); if(ded57<0)ded57=0; }
  const incOS=Math.max(0, osGross-ded57);                          /* IncomeOthSrc */

  /* ---- LTCG u/s 112A not chargeable (D20a) — capped at 1,25,000 [I21] ---- */
  const ltSale=N(IC.ltcg.sale), ltCost=N(IC.ltcg.cost);
  const ltGain=Math.max(0, ltSale-ltCost);
  const long112a=(ltGain>125000)?0:ltGain;                          /* > 1.25L ⇒ report 0 (schema max 125000) */

  /* ---- roll into S.C ---- */
  A.salary=incSal; A.bp=e8; A.os=incOS; A.income=incSal+e8+incOS;
  A.ltcg112a=long112a;
  A.detail={ gross, exempt, netSal, stdDed, ent, ptax, ded16, incSal,
             e1,e1a,e1b,e1c,e2a,e2b,e2c, e3,e3a,e3b,e3c,e4, e5,e6,e7,e8,
             osGross, famPension, ded57, incOS, ltSale,ltCost,ltGain,long112a };
  S.C.inc=A;
  S.C.hp={ income:hpHead, calc:hpCalc };
  /* bases the Chapter VI-A engine (70_sec_ded.js) reads to clamp its caps:
     80CCD(2) → basicDA (the 17(1) salary, the closest proxy this form captures
     for basic+DA); 80TTA → savings-bank interest; 80TTB → deposit interest. */
  S.C.sal={ basicDA:s1 };
  S.C.os={ sav:savInt, dep:depInt };
}

/* =====================================================================
   ENGINE — engTax(): Part D roll-up → footer contract (order 80)
   ===================================================================== */
function engTax(){
  const inc=S.C.inc||{}, hp=S.C.hp||{};
  const salary=N(inc.salary), bp=N(inc.bp), os=N(inc.os), hpinc=N(hp.income);
  const ltcg=N(inc.ltcg112a);

  const gti = salary+bp+os+hpinc;                                  /* B5 GrossTotIncome (without LTCG112A) */
  const gtiInc = gti+ltcg;                                         /* GrossTotIncomeIncLTCG112A */
  let via = (S.C.ded||{}).total||0;                                /* Chapter VI-A, regime-gated by `ded` */
  via = Math.max(0, Math.min(via, Math.max(0,gtiInc)));            /* VI-A cannot exceed GTI [#95] */
  const ti = Math.max(0, gtiInc-via);                             /* C20 TotalIncome = B5 − C19  [#230] */

  /* slab base excludes the non-chargeable LTCG112A part */
  const base=Math.max(0, ti-ltcg);
  const status=S.pi.status||"I", resident=(S.pi.res||"RES")==="RES";
  let d1;                                                          /* D1 tax on total income */
  if(status==="F"){ d1=R(0.30*base); }                            /* firm — flat 30% */
  else { d1 = isNew()?icTaxNew(base):icTaxOld(base); }

  /* D2 rebate 87A — resident individual only (rules #1135 new / #1145 old) */
  let d2=0;
  if(status==="I" && resident){
    if(isNew()){
      if(base<=1200000) d2=Math.min(d1,60000);
      else { const marg=d1-(base-1200000); if(marg>0) d2=Math.min(d1,marg); }  /* marginal rebate */
    } else {
      if(base<=500000) d2=Math.min(d1,12500);
    }
  }
  const d3=Math.max(0, d1-d2);                                     /* D3 tax after rebate = D1 − D2  [#260] */
  const d4=R(0.04*d3);                                            /* D4 cess @ 4% on D3 */
  const d5=d3+d4;                                                 /* D5 total tax & cess = D3 + D4  [#265] */
  const d6=N(IC.d.relief89);                                      /* D6 relief u/s 89 (input) */
  const d7=Math.max(0, d5-d6);                                    /* D7 balance tax after relief = D5 − D6  [#280] */
  const i234a=N(IC.d.int234a), i234b=N(IC.d.int234b), i234c=N(IC.d.int234c);
  const fee234f=Math.min(5000, N(IC.d.fee234f)), fee234i=Math.min(5000, N(IC.d.fee234i));
  const d12=d7+i234a+i234b+i234c+fee234f+fee234i;                 /* D12 total tax, fee & interest  [#270] */

  const paid=(S.C.paid||{}).total||0;                             /* taxes paid (by `paidbank`) */
  const balance=R(Math.max(0, d12-paid)/10)*10;                  /* D18 amount payable, round to ₹10  [I9] */
  const refund =R(Math.max(0, paid-d12)/10)*10;                  /* D19 refund, round to ₹10  [I10] */

  /* footer contract the shell's band()/#s_gti/#s_ti/#s_tax/#s_b read */
  S.C.gti=gtiInc;
  S.C.ti=ti;
  S.C.tax={ gross:d5, regime:isNew()?"New":"Old", rebate:d2, liability:d12 };
  S.C.int={ net:d7, balance:balance, refund:refund };
  S.C.taxc={ d1,d2,d3,d4,d5,d6,d7,i234a,i234b,i234c,fee234f,fee234i,d12,
             gti,gtiInc,via,ti,base,paid };
}

/* =====================================================================
   RENDERERS
   ===================================================================== */
/* ---- who — Part A General (identity) ---------------------------------- */
function secWho(){
  let h="";
  h+=sub("Identity");
  h+=row("Status",sel("pi.status",STATUS,{blank:false}),{req:1,ref:"AF36"});
  h+=row("First name",inp("pi.first",{max:25}),{ref:"E6"});
  h+=row("Middle name",inp("pi.mid",{max:25}),{ref:"O6"});
  h+=row((S.pi.status==="F"?"Name of firm":"Last name / Surname"),inp("pi.last",{max:75}),{req:1,ref:"W6"});
  h+=row("PAN",inp("pi.pan",{max:10}),{req:1});
  h+=row("Aadhaar Number [linked to PAN]",inp("pi.aadhaar",{max:12}),{ref:"E32"});
  h+=row("Date of Birth / Incorporation",dte("pi.dob"),{req:1,hint:"maximum date 31/03/2026"});
  h+=row("Nature of Employment (Status)",sel("pi.empcat",EMPCAT,{blank:false}),{req:1,ref:"E36",
    hint:"'Not Applicable' greys off the salary schedule"});

  h+=sub("Primary address (for communication)");
  h+=row("Flat / Door / Block No.",inp("pi.resNo",{max:50}),{req:1,ref:"E10"});
  h+=row("Premises / Building / Village",inp("pi.resName",{max:50}),{});
  h+=row("Road / Street / Post Office",inp("pi.road",{max:50}),{ref:"E12"});
  h+=row("Area / Locality",inp("pi.locality",{max:50}),{req:1});
  h+=row("Town / City / District",inp("pi.city",{max:50}),{req:1,ref:"E14"});
  h+=row("State",sel("pi.state",STATE_CODES),{req:1,ref:"W14"});
  h+=row("PIN Code",inp("pi.pin",{n:1,max:6}),{req:1,hint:"6 digits, 100000–999999"});
  h+=row("STD code · Phone No.",inp("pi.std",{n:1}),{v2:inp("pi.phone")});
  h+=row("Mobile No.",inp("pi.mobile",{n:1}),{req:1,v2:inp("pi.mobcc",{n:1,ph:"91"})});
  h+=row("Primary Email ID",inp("pi.email",{max:125}),{req:1,ref:"E27"});
  h+=row("Secondary Email ID",inp("pi.emailSec",{max:125}),{ref:"S27"});

  h+=sub("Secondary address");
  h+=row("Is the secondary address same as primary?",sel("pi.secAdd",[["Y","Yes"],["N","No"]],{blank:false}),{req:1,ref:"E17"});
  if(S.pi.secAdd==="N"){
    h+=row("Flat / Door / Block No. (secondary)",inp("pi.altRes",{max:50}),{req:1,ind:1,ref:"E19"});
    h+=row("Area / Locality (secondary)",inp("pi.altLoc",{max:50}),{req:1,ind:1});
    h+=row("Town / City / District (secondary)",inp("pi.altCity",{max:50}),{req:1,ind:1,ref:"E23"});
    h+=row("State (secondary)",sel("pi.altState",STATE_CODES),{req:1,ind:1,ref:"W23"});
  }
  return h;
}

/* ---- ret — Filing status & regime ------------------------------------ */
function secRet(){
  const sec=+S.fs.sec; let h="";
  h+=sub("Filing");
  h+=row("Filed under section",sel("fs.sec",RET_SEC,{blank:false}),{req:1,ref:"N36"});
  if([13,14,16,18,20].indexOf(sec)>=0){
    h+=row("Unique Number / DIN of the notice or order",inp("fs.noticeNo",{max:100}),{req:1,ind:1,ref:"E43"});
    h+=row("Date of the notice or order",dte("fs.noticeDate"),{req:1,ind:1});
  }
  if([17].indexOf(sec)>=0){
    h+=row("Receipt No. of the original return",inp("fs.receipt",{max:15}),{req:1,ind:1,ref:"E41"});
    h+=row("Date of filing of the original return",dte("fs.origDate"),{req:1,ind:1});
  }
  h+=row("Date of filing this return",dte("fs.filed"),{req:1,hint:"drives interest u/s 234A and fee u/s 234F"});
  h+=row("Due date u/s 139(1)",sel("fs.duedate",DUE_DATES,{blank:false}),{req:1,ref:"N38"});
  h+=row("Residential status in India",sel("pi.res",RES_STAT,{blank:false}),{req:1,
    hint:"ITR-4 (Sugam) is for a Resident"});

  h+=sub("Tax regime — section 115BAC");
  h+=row("Do you wish to opt for the OLD tax regime for AY 2026-27? (115BAC(6))",
    sel("fs.optout",[["No","No — stay in the new regime (default)"],["Yes","Yes — opt out to the old regime"]],{blank:false}),
    {req:1,ref:"E72",hint:"the default is the new regime u/s 115BAC(1A)"});
  h+=row("Have you filed Form 10-IEA within due date for any earlier AY (old regime)?",
    sel("fs.f10ieaEarlier",YNNA,{blank:false}),{req:1,ref:"E45 · Form10IEAEarlierAYOldRegime"});
  if(S.fs.f10ieaEarlier==="Y"){
    h+=row("AY for which Form 10-IEA (old regime) was filed",sel("fs.f10ieaAY",AY10IEA),{ind:1,ref:"G49"});
    h+=row("Acknowledgement number of Form 10-IEA",inp("fs.f10ieaAck",{max:15}),{ind:1,ref:"G50"});
  }
  if(S.fs.optout==="Yes"){
    h+=note("Opting out of the new regime is exercised through Form 10-IEA and is sticky. "+
      "Furnish its current-AY acknowledgement and date.","warn");
    h+=row("Date of filing Form 10-IEA for AY 2026-27 (old regime)",dte("fs.f10ieaDateCur"),{req:1,ind:1,ref:"H69"});
    h+=row("Acknowledgement number of Form 10-IEA (AY 2026-27, old regime)",inp("fs.f10ieaAckCur",{max:15}),{req:1,ind:1,ref:"H70"});
  } else {
    h+=note("New regime u/s 115BAC(1A). Standard deduction ₹75,000 and family-pension "+
      "deduction remain; HRA/other exempt allowances, s.16(ii)/16(iii), self-occupied "+
      "24(b) interest and most Chapter VI-A deductions are closed.");
  }

  h+=sub("Seventh proviso to section 139(1)");
  h+=row("Filing under the seventh proviso though not otherwise required to?",
    sel("fs.seventh",YN,{blank:false}),{ref:"F89"});
  if(S.fs.seventh==="Y"){
    h+=row("Deposited over ₹1 crore in one or more current accounts?",sel("fs.dep1cr",YN),
      {ref:"E90",v2:S.fs.dep1cr==="Y"?inp("fs.dep1crAmt",{n:1}):""});
    h+=row("Spent over ₹2 lakh on foreign travel?",sel("fs.trv2l",YN),
      {ref:"E91",v2:S.fs.trv2l==="Y"?inp("fs.trv2lAmt",{n:1}):""});
    h+=row("Spent over ₹1 lakh on electricity?",sel("fs.ele1l",YN),
      {ref:"E92",v2:S.fs.ele1l==="Y"?inp("fs.ele1lAmt",{n:1}):""});
    h+=row("Required to file under other conditions in clause (iv)?",sel("fs.clz",YN),{ref:"E93"});
    if(S.fs.clz==="Y")
      h+=grid("fs.clause7",[
        {k:"nat",h:"Condition",t:"sel",w:"560px",req:1,opts:CLAUSE7},
        {k:"amt",h:"Amount",t:"num",w:"150px",req:1}],
        S.fs.clause7||[],{min:"760px",empty:"No condition added.",add:"Add a condition"});
  }

  h+=sub("Representative assessee");
  h+=row("Is this return being filed by a representative assessee?",sel("fs.rep",YN,{blank:false}),{req:1,ref:"F98"});
  if(S.fs.rep==="Y"){
    h+=row("Name of the representative assessee",inp("fs.repName",{max:125}),{req:1,ind:1,ref:"G99"});
    h+=row("Email-ID of the representative assessee",inp("fs.repEmail",{max:125}),{req:1,ind:1,ref:"G100"});
    h+=row("Contact number of the representative assessee",inp("fs.repMobile",{n:1}),{req:1,ind:1,ref:"G101"});
  }
  return h;
}

/* ---- inc — Income (salary + presumptive business + other sources + 112A/D20) ---- */
function secInc(){
  const inc=S.C.inc||{}, D=inc.detail||{}; const nw=isNew(); let h="";

  /* B1 salary */
  const salOff=(S.pi.empcat==="NA");
  h+=fold("ic_sal","B1","Salary","",(salOff?
      note("Nature of Employment is 'Not Applicable' — the salary schedule is greyed off."):(
      row("(a) Salary as per section 17(1)",inp("ic.sal.s17_1",{n:1}),{ref:"H112"})+
      row("(b) Value of perquisites u/s 17(2)",inp("ic.sal.s17_2",{n:1}),{ref:"H113"})+
      row("(c) Profit in lieu of salary u/s 17(3)",inp("ic.sal.s17_3",{n:1}),{ref:"H114"})+
      row("(i) Gross Salary (a+b+c)",cell(D.gross),{ref:"H111"})+
      row("(ii) Less: Allowances exempt u/s 10",cell(D.exempt),{ref:"H121",
        hint:nw?"HRA/LTC/10(14) close in the new regime":""})+
      grid("ic.sal.alw",[
        {k:"nat",h:"Nature of exempt allowance",t:"sel",w:"420px",req:1,opts:ALW_NAT},
        {k:"amt",h:"Amount",t:"num",w:"150px",req:1}],
        S.ic.sal.alw||[],{min:"620px",empty:"No exempt allowance.",add:"Add an allowance"})+
      row("(iii) Net Salary (i − ii)",cell(D.netSal),{ref:"H130"})+
      row("(iv) Deductions u/s 16 (iva+ivb+ivc)",cell(D.ded16),{ref:"H131"})+
      row("(a) Standard Deduction u/s 16(ia)",cell(D.stdDed),{ref:"H132",ind:1,hint:"max ₹75,000"})+
      (nw?row("(b) Entertainment allowance u/s 16(ii)",cell(0),{ref:"H133",ind:1,hint:"closed in the new regime"})
         :row("(b) Entertainment allowance u/s 16(ii)",inp("ic.sal.ent",{n:1}),{ref:"H133",ind:1,hint:"max ₹5,000"}))+
      (nw?row("(c) Professional tax u/s 16(iii)",cell(0),{ref:"H134",ind:1,hint:"closed in the new regime"})
         :row("(c) Professional tax u/s 16(iii)",inp("ic.sal.ptax",{n:1}),{ref:"H134",ind:1,hint:"max ₹5,000"}))+
      row("(v) Income chargeable under 'Salaries' (iii − iv)",cell(D.incSal),{ref:"H135"})
    )),{def:1});

  /* B1 presumptive business/profession — Schedule BP */
  h+=fold("ic_bp","BP","Presumptive business / profession (44AD / 44ADA / 44AE)",
    (R(D.e8)?RS(D.e8):""),(
    /* 44AD */
    sub("Section 44AD — business")+
    grid("ic.bp.nad",[
      {k:"name",h:"Name of business",t:"txt",w:"260px",req:1,max:75},
      {k:"code",h:"Business code",t:"txt",w:"110px",req:1,max:8,ph:"e.g. 09028"},
      {k:"desc",h:"Description",t:"txt",w:"260px",max:75}],
      S.ic.bp.nad||[],{min:"680px",empty:"No 44AD business.",add:"Add a 44AD business"})+
    row("E1(a) Turnover via bank / digital modes",inp("ic.bp.ad.bank",{n:1}),{ref:"E1a"})+
    row("E1(b) Receipts in cash",inp("ic.bp.ad.cash",{n:1}),{ref:"E1b"})+
    row("E1(c) Any other mode",inp("ic.bp.ad.other",{n:1}),{ref:"E1c"})+
    row("E1 Gross Turnover / Gross Receipts",cell(D.e1),{ref:"E1",hint:"cap ₹2 cr (₹3 cr if cash ≤ 5%)"})+
    row("E2(a) 6% of E1(a) or amount claimed",inp("ic.bp.ad.claim6",{n:1}),{ref:"E2a",v2:cell(D.e2a)})+
    row("E2(b) 8% of (E1b+E1c) or amount claimed",inp("ic.bp.ad.claim8",{n:1}),{ref:"E2b",v2:cell(D.e2b)})+
    row("E2(c) Presumptive income u/s 44AD (a+b)",cell(D.e2c),{ref:"E2c"})+
    /* 44ADA */
    sub("Section 44ADA — profession")+
    grid("ic.bp.nada",[
      {k:"name",h:"Name of business / profession",t:"txt",w:"260px",req:1,max:75},
      {k:"code",h:"Profession code",t:"txt",w:"110px",req:1,max:8,ph:"e.g. 16003"},
      {k:"desc",h:"Description",t:"txt",w:"260px",max:75}],
      S.ic.bp.nada||[],{min:"680px",empty:"No 44ADA profession.",add:"Add a 44ADA profession"})+
    row("E3(a) Receipts via bank / digital modes",inp("ic.bp.ada.bank",{n:1}),{ref:"E3a"})+
    row("E3(b) Receipts in cash",inp("ic.bp.ada.cash",{n:1}),{ref:"E3b"})+
    row("E3(c) Any other mode",inp("ic.bp.ada.other",{n:1}),{ref:"E3c"})+
    row("E3 Gross Receipts",cell(D.e3),{ref:"E3",hint:"cap ₹50 L (₹75 L if cash ≤ 5%)"})+
    row("E4 Presumptive income u/s 44ADA (50% of E3 or claimed)",inp("ic.bp.ada.claim",{n:1}),{ref:"E4",v2:cell(D.e4)})+
    /* 44AE */
    sub("Section 44AE — goods carriages")+
    grid("ic.bp.nae",[
      {k:"name",h:"Name of business",t:"txt",w:"260px",req:1,max:75},
      {k:"code",h:"Business code",t:"sel",w:"200px",req:1,opts:NOB44AE},
      {k:"desc",h:"Description",t:"txt",w:"220px",max:75}],
      S.ic.bp.nae||[],{min:"720px",empty:"No 44AE business.",add:"Add a 44AE business"})+
    grid("ic.bp.gcv",[
      {k:"reg",h:"Registration No.",t:"txt",w:"140px",req:1,max:11},
      {k:"flag",h:"Owned/Leased/Hired",t:"sel",w:"150px",req:1,opts:OWN_LEASE},
      {k:"tonnage",h:"Tonnage (MT)",t:"num",w:"110px",req:1},
      {k:"months",h:"Months held",t:"num",w:"110px",req:1},
      {k:"pi",h:"Presumptive income",t:"num",w:"150px",req:1}],
      S.ic.bp.gcv||[],{min:"720px",empty:"No goods carriage (max 10).",add:"Add a vehicle"})+
    (( (S.ic.bp.gcv||[]).length)?note("Per-vehicle presumptive income ≥ max(₹1,000/MT/month, ₹7,500/month); "+
      "months 1–12; registration numbers must be unique."):"")+
    (S.pi.status==="F"?row("E6 Salary & interest paid to partners (firms only)",inp("ic.bp.ae.salint",{n:1}),{ref:"E6"}):"")+
    row("E5 Presumptive income from goods carriages",cell(D.e5),{ref:"E5"})+
    row("E7 Presumptive income u/s 44AE (E5 − E6)",cell(D.e7),{ref:"E7"})+
    row("E8 Income chargeable under Business or Profession (E2c+E4+E7)",cell(D.e8),{ref:"E8 → B1"})+
    /* GST turnover reported */
    sub("Turnover / gross receipt reported for GST")+
    grid("ic.bp.gstn",[
      {k:"gstin",h:"GSTIN No.",t:"txt",w:"200px",req:1,max:20},
      {k:"amt",h:"Annual value of outward supplies per GST return",t:"num",w:"260px",req:1}],
      S.ic.bp.gstn||[],{min:"520px",empty:"No GSTIN reported.",add:"Add a GSTIN"})+
    /* Financial particulars E11–E25 */
    sub("Financial particulars of the business (as on 31-Mar-2026)")+
    row("E15 Sundry creditors",inp("ic.bp.fin.creditors",{n:1}),{req:1})+
    row("E19 Inventories",inp("ic.bp.fin.inventories",{n:1}),{req:1})+
    row("E20 Sundry debtors",inp("ic.bp.fin.debtors",{n:1}),{req:1})+
    row("E21 Balance with banks",inp("ic.bp.fin.bank",{n:1}),{req:1})+
    row("E22 Cash-in-hand",inp("ic.bp.fin.cash",{n:1}),{req:1})+
    note("E15, E19, E20, E21, E22 are mandatory; other financial-particulars lines if available.")
  ),{});

  /* B4 other sources */
  h+=fold("ic_os","B4","Income from other sources",(R(D.incOS)?RS(D.incOS):""),(
    grid("ic.os.rows",[
      {k:"nat",h:"Nature of income",t:"sel",w:"340px",req:1,opts:(S.pi.status==="I"?OS_NAT:OS_NAT.filter(x=>x[0]!=="FAP"))},
      {k:"amt",h:"Amount (non-dividend)",t:"num",w:"160px"}],
      S.ic.os.rows||[],{min:"560px",empty:"No other-source income.",add:"Add an income"})+
    ((S.ic.os.rows||[]).some(r=>r.nat==="DIV")?
      (sub("Dividend — quarter split (for rows marked Dividend)")+
       note("Enter the dividend across the five statutory periods; each dividend row's amount is the sum of its quarters."))
      :"")+
    (S.ic.os.rows||[]).map((r,i)=> r.nat==="DIV"?(
       row("Dividend row "+(i+1)+" — up to 15/06/2025",inp("ic.os.rows."+i+".q1",{n:1}),{ind:1,ref:"H164"})+
       row("16/06–15/09/2025",inp("ic.os.rows."+i+".q2",{n:1}),{ind:1,ref:"H165"})+
       row("16/09–15/12/2025",inp("ic.os.rows."+i+".q3",{n:1}),{ind:1,ref:"H166"})+
       row("16/12/2025–15/03/2026",inp("ic.os.rows."+i+".q4",{n:1}),{ind:1,ref:"H167"})+
       row("16/03–31/03/2026",inp("ic.os.rows."+i+".q5",{n:1}),{ind:1,ref:"H168"})
    ):"").join("")+
    (nw?row("Less: Deduction u/s 57(iia) (family pension)",cell(0),{ref:"F170",hint:"closed in the new regime"})
       :row("Less: Deduction u/s 57(iia) (family pension only)",inp("ic.os.fp57",{n:1}),{ref:"F170",
         hint:"≤ lower of 1/3 of family pension or ₹15,000"}))+
    row("B4 Income from other sources",cell(D.incOS),{ref:"F146"})
  ),{});

  /* D20(a) LTCG 112A not chargeable (block LTCG112A — owned here, feeds GTI incl 112A) */
  h+=fold("ic_ltcg","D20(a)","LTCG u/s 112A not chargeable to tax",(R(D.long112a)?RS(D.long112a):""),(
    row("(i) Total sale consideration",inp("ic.ltcg.sale",{n:1}),{ref:"D20a(i)"})+
    row("(ii) Total cost of acquisition",inp("ic.ltcg.cost",{n:1}),{ref:"D20a(ii)"})+
    row("(iii) Long-term capital gains as per sec 112A",cell(D.long112a),{ref:"D20a(iii)",
      hint:"reported only up to ₹1,25,000; above that it is 0"})
  ),{});

  /* D20 exempt income for reporting (block TaxExmpIntIncDtls — owned here) */
  let exTot=0; (S.ic.exmp||[]).forEach(r=>exTot+=N(r.amt));
  h+=fold("ic_exmp","D20","Exempt income (for reporting only)",(R(exTot)?RS(exTot):""),(
    note("For reporting only, not taxed. Agricultural income above ₹5,000 forces ITR-3/5.")+
    grid("ic.exmp",[
      {k:"cat",h:"Category",t:"sel",w:"320px",req:1,opts:EXMP_CAT},
      {k:"sub",h:"Sub-category",t:"txt",w:"140px",max:20,ph:"e.g. 10(1)"},
      {k:"desc",h:"Description",t:"txt",w:"200px",max:125},
      {k:"amt",h:"Amount",t:"num",w:"140px",req:1}],
      S.ic.exmp||[],{min:"820px",empty:"No exempt income.",add:"Add an exempt income"})+
    row("Total exempt income",cell(exTot),{ref:"D20 total"})
  ),{});
  return h;
}

/* ---- hp — House property (IncomeDeductions.PropertyDetails) ----------- */
function secHP(){
  const hp=S.C.hp||{}, calc=hp.calc||[]; const nw=isNew(); let h="";
  h+=note("Up to two house properties. In ITR-4 there is no Schedule HP — this feeds "+
    "IncomeDeductions.PropertyDetails[] and B3 'Income chargeable under House Property'.");
  (S.ic.hp||[]).forEach((p,i)=>{
    const c=calc[i]||{}; const self=(p.let==="S");
    let inner="";
    inner+=row("Address",inp("ic.hp."+i+".addr",{max:50}),{req:1});
    inner+=row("Town / City",inp("ic.hp."+i+".city",{max:50}),{req:1});
    inner+=row("State",sel("ic.hp."+i+".state",STATE_CODES),{req:1});
    inner+=row("PIN Code",inp("ic.hp."+i+".pin",{n:1,max:6}),{});
    inner+=row("Owner of the property",sel("ic.hp."+i+".owner",PROP_OWNER),{req:1});
    if(p.owner==="OT") inner+=row("If others, specify",inp("ic.hp."+i+".ownerOth",{max:50}),{ind:1});
    inner+=row("Type of house property",sel("ic.hp."+i+".let",IF_LETOUT),{req:1});
    inner+=row("Is the property co-owned?",sel("ic.hp."+i+".co",COOWN,{blank:false}),{});
    inner+=row("Your percentage of share (%)",inp("ic.hp."+i+".share",{n:1,ph:"100"}),{});
    if(p.co==="YES")
      inner+=grid("ic.hp."+i+".coown",[
        {k:"name",h:"Name of co-owner",t:"txt",w:"220px",req:1,max:125},
        {k:"pan",h:"PAN",t:"txt",w:"120px",max:10},
        {k:"aadhaar",h:"Aadhaar",t:"txt",w:"140px",max:12},
        {k:"share",h:"Share (%)",t:"num",w:"110px"}],
        p.coown||[],{min:"640px",empty:"No co-owner.",add:"Add a co-owner"});
    if(p.let==="L")
      inner+=grid("ic.hp."+i+".tenant",[
        {k:"name",h:"Name of tenant",t:"txt",w:"220px",req:1,max:125},
        {k:"pan",h:"PAN",t:"txt",w:"120px",max:10},
        {k:"aadhaar",h:"Aadhaar",t:"txt",w:"140px",max:12},
        {k:"pantan",h:"PAN/TAN (if TDS u/s 194-IB)",t:"txt",w:"180px"}],
        p.tenant||[],{min:"760px",empty:"No tenant.",add:"Add a tenant"});
    inner+=sub("Rent & annual value");
    if(self){
      inner+=note("Self-occupied — annual value is nil u/s 23(2); tax to local authorities is not allowed.");
    } else {
      inner+=row("(a) Gross rent received / receivable / lettable value",inp("ic.hp."+i+".gross",{n:1}),{ref:"a"});
      inner+=row("(b) Rent which cannot be realised",inp("ic.hp."+i+".notReal",{n:1}),{ref:"b"});
      inner+=row("(c) Tax paid to local authorities",inp("ic.hp."+i+".localTax",{n:1}),{ref:"c"});
      inner+=row("(d) Total (b + c)",cell(c.d),{ref:"d"});
      inner+=row("(e) Annual value (a − d)",cell(c.e),{ref:"e"});
      inner+=row("(f) Annual value of the property owned (share% × e)",cell(c.f),{ref:"f"});
      inner+=row("(g) 30% of annual value",cell(c.g),{ref:"g"});
    }
    inner+=sub("Interest on borrowed capital u/s 24(b)");
    if(nw && self){
      inner+=note("New regime — interest u/s 24(b) on a self-occupied house is not allowed (set to 0).","warn");
    } else {
      inner+=grid("ic.hp."+i+".loans",[
        {k:"from",h:"Loan taken from",t:"sel",w:"150px",req:1,opts:LOAN_FROM},
        {k:"name",h:"Bank / Institution / Person",t:"txt",w:"200px",req:1},
        {k:"accno",h:"Loan A/c No.",t:"txt",w:"140px",req:1},
        {k:"date",h:"Date of sanction",t:"date",w:"140px",req:1},
        {k:"total",h:"Total loan amount",t:"num",w:"140px",req:1},
        {k:"outst",h:"Outstanding",t:"num",w:"130px",req:1},
        {k:"intr",h:"Interest u/s 24(b)",t:"num",w:"140px",req:1}],
        p.loans||[],{min:"1080px",empty:"No loan.",add:"Add a loan"});
      inner+=row("(h) Interest payable on borrowed capital",cell(c.intr),{ref:"h",
        hint:(self||p.let==="D")?"capped at ₹2,00,000 (not let out)":""});
    }
    inner+=row("(i) Total deduction (g + h)",cell(c.totDed),{ref:"i"});
    inner+=row("(j) Arrears / unrealised rent received (less 30%)",inp("ic.hp."+i+".arrears",{n:1}),{ref:"j"});
    inner+=row("(k) Income of this house property (f − i + j)",cell(c.k),{ref:"k"});
    h+=blk("ichp"+i,"Property "+(i+1),(p.let?(IF_LETOUT.find(x=>x[0]===p.let)||["",""])[1]:"—"),inner,"ic.hp."+i);
  });
  if((S.ic.hp||[]).length<2)
    h+='<button class="add" data-add="ic.hp">Add a house property</button>';
  else h+=note("Maximum two house properties in ITR-4.");
  h+=row("B3 Income chargeable under the head 'House Property'",cell(hp.income),{ref:"H145",
    hint:nw?"new regime: HP loss not set off (floored at 0)":"aggregate loss floored at −₹2,00,000"});
  return h;
}

/* ---- tax — Part B → GTI → VI-A → TI → tax → 87A → cess → 234 → liability ---- */
function secTax(){
  const t=S.C.taxc||{}; const nw=isNew(); let h="";
  h+=sub("Part B — Gross Total Income");
  h+=row("B1 Salary",cell((S.C.inc||{}).salary),{ref:"H135"});
  h+=row("B1 Business & Profession (presumptive E8)",cell((S.C.inc||{}).bp),{ref:"F110"});
  h+=row("B3 House Property",cell((S.C.hp||{}).income),{ref:"H145"});
  h+=row("B4 Other Sources",cell((S.C.inc||{}).os),{ref:"F146"});
  h+=row("D20(a)(iii) LTCG u/s 112A (not chargeable)",cell((S.C.inc||{}).ltcg112a),{ref:"D20a"});
  h+=row("B5 Gross Total Income",cell(t.gti),{ref:"F172"});
  h+=row("Gross Total Income incl. LTCG 112A",cell(t.gtiInc),{ref:"GrossTotIncomeIncLTCG112A"});

  h+=sub("Part C — Chapter VI-A deductions");
  h+=row("C19 Total Chapter VI-A deductions (from Deductions screen)",cell(t.via),{ref:"C19",
    hint:nw?"most deductions close in the new regime":"read from the ded builder (S.C.ded.total)"});
  h+=row("C20 Total Income (B5 − C19)",cell(t.ti),{ref:"F224",hint:"Sugam ceiling ~₹50 lakh"});

  h+=sub("Part D — Tax computation");
  h+=row("D1 Tax payable on Total Income",cell(t.d1),{ref:"F226",
    hint:(S.pi.status==="F")?"firm — flat 30%":(nw?"new regime slabs 115BAC(1A)":"old regime slabs")});
  h+=row("D2 Rebate u/s 87A",cell(t.d2),{ref:"F227",
    hint:nw?"up to ₹60,000 for total income up to ₹12L":"₹12,500 for total income up to ₹5L"});
  h+=row("D3 Tax payable after rebate (D1 − D2)",cell(t.d3),{ref:"F228"});
  h+=row("D4 Health & Education Cess @ 4%",cell(t.d4),{ref:"F230"});
  h+=row("D5 Total Tax & Cess (D3 + D4)",cell(t.d5),{ref:"F231"});
  h+=row("D6 Relief u/s 89 (submit Form 10E)",inp("ic.d.relief89",{n:1}),{ref:"F232"});
  h+=row("D7 Balance Tax after Relief (D5 − D6)",cell(t.d7),{ref:"F234"});
  h+=row("D8 Interest u/s 234A",inp("ic.d.int234a",{n:1}),{ref:"F235"});
  h+=row("D9 Interest u/s 234B",inp("ic.d.int234b",{n:1}),{ref:"F236"});
  h+=row("D10 Interest u/s 234C",inp("ic.d.int234c",{n:1}),{ref:"F237"});
  h+=row("D11 Fee u/s 234F",inp("ic.d.fee234f",{n:1}),{ref:"F238",hint:"max ₹5,000"});
  h+=row("D11a Fee u/s 234-I (revised return)",inp("ic.d.fee234i",{n:1}),{ref:"F240",hint:"max ₹5,000"});
  h+=row("D12 Total Tax, Fee & Interest",cell(t.d12),{ref:"F241"});
  h+=note("Taxes paid, balance payable and refund are computed on the Taxes-paid and "+
    "Bank screens; the balance/refund figure appears in the footer strip.");
  return h;
}

/* =====================================================================
   EXPORT — expInc(j): write ALL owned blocks. put() skips empties; SKEL
   keeps the required leaves present at 0.
   ===================================================================== */
function expInc(j){
  const inc=S.C.inc||{}, D=inc.detail||{}, hp=S.C.hp||{}, calc=hp.calc||[], t=S.C.taxc||{};
  /* build a plain object, keeping only non-empty leaves */
  const ob=o=>{const r={};for(const k in o){const v=o[k];if(v!==undefined&&v!==null&&v!=="")r[k]=v;}return r;};

  /* ---- PersonalInfo ---- */
  put(j,"PersonalInfo.AssesseeName.FirstName",sv(S.pi.first));
  put(j,"PersonalInfo.AssesseeName.MiddleName",sv(S.pi.mid));
  put(j,"PersonalInfo.AssesseeName.SurNameOrOrgName",sv(S.pi.last));
  put(j,"PersonalInfo.PAN",sv(S.pi.pan));
  put(j,"PersonalInfo.Address.ResidenceNo",sv(S.pi.resNo));
  put(j,"PersonalInfo.Address.ResidenceName",sv(S.pi.resName));
  put(j,"PersonalInfo.Address.RoadOrStreet",sv(S.pi.road));
  put(j,"PersonalInfo.Address.LocalityOrArea",sv(S.pi.locality));
  put(j,"PersonalInfo.Address.CityOrTownOrDistrict",sv(S.pi.city));
  put(j,"PersonalInfo.Address.StateCode",sv(S.pi.state));
  put(j,"PersonalInfo.Address.CountryCode",sv(S.pi.country||"91"));
  if(N(S.pi.pin)) put(j,"PersonalInfo.Address.PinCode",R(N(S.pi.pin)));
  put(j,"PersonalInfo.Address.ZipCode",sv(S.pi.zip));
  if(N(S.pi.std))    put(j,"PersonalInfo.Address.Phone.STDcode",R(N(S.pi.std)));
  put(j,"PersonalInfo.Address.Phone.PhoneNo",sv(S.pi.phone));
  put(j,"PersonalInfo.Address.CountryCodeMobile",R(N(S.pi.mobcc)||91));
  if(N(S.pi.mobile)) put(j,"PersonalInfo.Address.MobileNo",R(N(S.pi.mobile)));
  put(j,"PersonalInfo.Address.EmailAddress",sv(S.pi.email));
  put(j,"PersonalInfo.Address.EmailAddressSec",sv(S.pi.emailSec));
  put(j,"PersonalInfo.SecondaryAdd",sv(S.pi.secAdd||"Y"));
  if(S.pi.secAdd==="N"){
    put(j,"PersonalInfo.AlternateAddress.ResidenceNo",sv(S.pi.altRes));
    put(j,"PersonalInfo.AlternateAddress.LocalityOrArea",sv(S.pi.altLoc));
    put(j,"PersonalInfo.AlternateAddress.CityOrTownOrDistrict",sv(S.pi.altCity));
    put(j,"PersonalInfo.AlternateAddress.StateCode",sv(S.pi.altState));
  }
  put(j,"PersonalInfo.DOB",ISO(S.pi.dob));
  put(j,"PersonalInfo.EmployerCategory",sv(S.pi.empcat||"OTH"));
  put(j,"PersonalInfo.Status",sv(S.pi.status||"I"));
  put(j,"PersonalInfo.AadhaarCardNo",sv(S.pi.aadhaar));

  /* ---- FilingStatus ---- */
  put(j,"FilingStatus.ReturnFileSec",R(N(S.fs.sec)||11));
  put(j,"FilingStatus.Form10IEAEarlierAYOldRegime",sv(S.fs.f10ieaEarlier||"NA"));
  if(S.fs.f10ieaEarlier==="Y"){
    put(j,"FilingStatus.Form10IEAAssYear",sv(S.fs.f10ieaAY));
    if(N(S.fs.f10ieaAck)) put(j,"FilingStatus.Form10IEAEarlierAYAckOldRegime",R(N(S.fs.f10ieaAck)));
  }
  if(S.fs.optout==="Yes"){
    put(j,"FilingStatus.F10IEACurrAYOldRegime","Y");
    put(j,"FilingStatus.F10IEADateCurrAYOldTax",ISO(S.fs.f10ieaDateCur));
    if(N(S.fs.f10ieaAckCur)) put(j,"FilingStatus.F10IEAAckNoCurrAYOldTax",R(N(S.fs.f10ieaAckCur)));
  }
  put(j,"FilingStatus.SeventhProvisio139",sv(S.fs.seventh));
  if(S.fs.seventh==="Y"){
    put(j,"FilingStatus.DepAmtAggAmtExcd1CrPrYrFlg",sv(S.fs.dep1cr));
    if(N(S.fs.dep1crAmt)) put(j,"FilingStatus.AmtSeventhProvisio139i",R(N(S.fs.dep1crAmt)));
    put(j,"FilingStatus.IncrExpAggAmt2LkTrvFrgnCntryFlg",sv(S.fs.trv2l));
    if(N(S.fs.trv2lAmt)) put(j,"FilingStatus.AmtSeventhProvisio139ii",R(N(S.fs.trv2lAmt)));
    put(j,"FilingStatus.IncrExpAggAmt1LkElctrctyPrYrFlg",sv(S.fs.ele1l));
    if(N(S.fs.ele1lAmt)) put(j,"FilingStatus.AmtSeventhProvisio139iii",R(N(S.fs.ele1lAmt)));
    put(j,"FilingStatus.clauseiv7provisio139i",sv(S.fs.clz));
    const cl=(S.fs.clause7||[]).filter(r=>st0(r.nat)||N(r.amt))
      .map(r=>({clauseiv7provisio139iNature:st0(r.nat),clauseiv7provisio139iAmount:R(N(r.amt))}));
    if(cl.length) put(j,"FilingStatus.clauseiv7provisio139iDtls",cl);
  }
  if([13,14,16,18,20].indexOf(+S.fs.sec)>=0){
    put(j,"FilingStatus.NoticeNo",sv(S.fs.noticeNo));
    put(j,"FilingStatus.NoticeDateUnderSec",ISO(S.fs.noticeDate));
  }
  if(+S.fs.sec===17){
    put(j,"FilingStatus.ReceiptNo",sv(S.fs.receipt));
    put(j,"FilingStatus.OrigRetFiledDate",ISO(S.fs.origDate));
  }
  put(j,"FilingStatus.AsseseeRepFlg",sv(S.fs.rep||"N"));
  if(S.fs.rep==="Y"){
    put(j,"FilingStatus.AssesseeRep.RepName",sv(S.fs.repName));
    put(j,"FilingStatus.AssesseeRep.RepEmailID",sv(S.fs.repEmail));
    put(j,"FilingStatus.AssesseeRep.CountryCodeRepMobileNo",91);
    if(N(S.fs.repMobile)) put(j,"FilingStatus.AssesseeRep.RepMobileNo",R(N(S.fs.repMobile)));
  }
  put(j,"FilingStatus.ItrFilingDueDate",sv(S.fs.duedate||"2026-08-31"));

  /* ---- IncomeDeductions ---- */
  put(j,"IncomeDeductions.IncomeFromBusinessProf",n0(D.e8));
  put(j,"IncomeDeductions.GrossSalary",n0(D.gross));
  if(N(D.gross)){
    if(N(IC.sal.s17_1)) put(j,"IncomeDeductions.Salary",n0(N(IC.sal.s17_1)));
    if(N(IC.sal.s17_2)) put(j,"IncomeDeductions.PerquisitesValue",n0(N(IC.sal.s17_2)));
    if(N(IC.sal.s17_3)) put(j,"IncomeDeductions.ProfitsInSalary",n0(N(IC.sal.s17_3)));
  }
  let exTotAll=0;
  const alwArr=(IC.sal.alw||[]).filter(r=>st0(r.nat)).map(r=>{
    const nat=st0(r.nat); const amt=(isNew()&&ALW_CLOSED_NEW[nat])?0:R(N(r.amt)); exTotAll+=amt;
    return {SalNatureDesc:nat,SalOthAmount:amt}; });
  if(alwArr.length){
    put(j,"IncomeDeductions.AllwncExemptUs10.AllwncExemptUs10Dtls",alwArr);
    put(j,"IncomeDeductions.AllwncExemptUs10.TotalAllwncExemptUs10",n0(exTotAll));
  }
  put(j,"IncomeDeductions.NetSalary",n0(D.netSal));
  put(j,"IncomeDeductions.DeductionUs16",n0(D.ded16));
  if(N(D.stdDed)) put(j,"IncomeDeductions.DeductionUs16ia",n0(D.stdDed));
  if(N(D.ent))    put(j,"IncomeDeductions.EntertainmntalwncUs16ii",n0(D.ent));
  if(N(D.ptax))   put(j,"IncomeDeductions.ProfessionalTaxUs16iii",n0(D.ptax));
  put(j,"IncomeDeductions.IncomeFromSal",n0(D.incSal));

  /* PropertyDetails[] — native array */
  const props=(IC.hp||[]).map((p,i)=>{
    const c=calc[i]||{};
    const el={};
    el.HPSNo=i+1;
    el.AddressDetailWithZipCode=ob({AddrDetail:sv(p.addr),CityOrTownOrDistrict:sv(p.city),
      StateCode:sv(p.state),CountryCode:sv(p.country||"91"),PinCode:N(p.pin)?R(N(p.pin)):undefined});
    if(sv(p.owner)) el.PropertyOwner=sv(p.owner);
    if(p.owner==="OT"&&sv(p.ownerOth)) el.PropertyOwnerOther=sv(p.ownerOth);
    el.PropCoOwnedFlg=sv(p.co||"NO");
    if(p.share!==""&&p.share!=null) el.AsseseeShareProperty=N(p.share);
    const co=(p.coown||[]).filter(o=>st0(o.name)).map((o,k)=>ob({CoOwnersSNo:k+1,NameCoOwner:sv(o.name),
      PAN_CoOwner:sv(o.pan),Aadhaar_CoOwner:sv(o.aadhaar),PercentShareProperty:(o.share!==""&&o.share!=null)?N(o.share):undefined}));
    if(co.length) el.CoOwners=co;
    if(sv(p.let)) el.ifLetOut=sv(p.let);
    const tn=(p.tenant||[]).filter(x=>st0(x.name)).map((x,k)=>ob({TenantSNo:k+1,NameofTenant:sv(x.name),
      PANofTenant:sv(x.pan),AadhaarofTenant:sv(x.aadhaar),PANTANofTenant:sv(x.pantan)}));
    if(tn.length) el.TenantDetails=tn;
    const loans=(p.loans||[]).filter(l=>st0(l.name)||N(l.intr)).map(l=>ob({LoanTknFrom:sv(l.from),
      BankOrInstnName:sv(l.name),LoanAccNoOfBankOrInstnRefNo:sv(l.accno),DateofLoan:ISO(l.date),
      TotalLoanAmt:R(N(l.total)),LoanOutstndngAmt:R(N(l.outst)),InterestUs24B:R(N(l.intr))}));
    const rd=ob({AnnualLetableValue:n0(c.a),RentNotRealized:N(c.b)?n0(c.b):undefined,
      LocalTaxes:N(c.c)?n0(c.c):undefined,TotalUnrealizedAndTax:n0(c.d),BalanceALV:n0(c.e),
      AnnualOfPropOwned:n0(c.f),ThirtyPercentOfBalance:n0(c.g),IntOnBorwCap:n0(c.intr),
      TotalDeduct:n0(c.totDed),ArrearsUnrealizedRentRcvd:N(c.j)?n0(c.j):undefined,IncomeOfHP:sg(c.k)});
    rd.Section24B=ob({TotalInterestUs24B:n0(c.intr)});
    if(loans.length) rd.Section24B.Section24BDtls=loans;
    el.Rentdetails=rd;
    return el;
  });
  if(props.length) put(j,"IncomeDeductions.PropertyDetails",props);
  put(j,"IncomeDeductions.TotalIncomeChargeableUnHP",sg(hp.income));

  /* OthersInc (other sources) — native array */
  put(j,"IncomeDeductions.IncomeOthSrc",n0(D.incOS));
  const osArr=(IC.os.rows||[]).filter(r=>st0(r.nat)).map(r=>{
    const nat=st0(r.nat);
    const amt=(nat==="DIV")?(N(r.q1)+N(r.q2)+N(r.q3)+N(r.q4)+N(r.q5)):N(r.amt);
    const el=ob({OthSrcNatureDesc:nat,OthSrcOthNatOfInc:(nat==="OTH")?sv(r.desc):undefined,OthSrcOthAmount:R(amt)});
    el.DividendInc={DateRange:{Upto15Of6:nat==="DIV"?R(N(r.q1)):0,Upto15Of9:nat==="DIV"?R(N(r.q2)):0,
      Up16Of9To15Of12:nat==="DIV"?R(N(r.q3)):0,Up16Of12To15Of3:nat==="DIV"?R(N(r.q4)):0,
      Up16Of3To31Of3:nat==="DIV"?R(N(r.q5)):0}};
    return el; });
  if(osArr.length) put(j,"IncomeDeductions.OthersInc.OthersIncDtlsOthSrc",osArr);
  if(!isNew() && N(D.ded57)) put(j,"IncomeDeductions.DeductionUs57iia",n0(D.ded57));

  put(j,"IncomeDeductions.GrossTotIncome",sg(t.gti));
  put(j,"IncomeDeductions.GrossTotIncomeIncLTCG112A",sg(t.gtiInc));
  /* Chapter VI-A per-line values: the `ded` builder hands over two ready-made,
     schema-keyed objects — usr (user-claimed) and cap (allowed, post-cap/regime)
     — each already carrying its own TotalChapVIADeductions. Drop every line in,
     so the summary blocks match their sub-schedules (rules A290/A293/A248/A18). */
  const dUsr=(S.C.ded||{}).usr||{}, dCap=(S.C.ded||{}).cap||{};
  const putVIA=(base,o)=>Object.keys(o).forEach(f=>{const v=o[f];
    put(j,base+"."+f, (typeof v==="number")?n0(v):v);});   /* amounts n0; qualifiers (PRANDtls[], disease, type) as-is */
  putVIA("IncomeDeductions.UsrDeductUndChapVIA",dUsr);
  putVIA("IncomeDeductions.DeductUndChapVIA",dCap);
  put(j,"IncomeDeductions.TotalIncome",sg(t.ti));

  /* ---- ScheduleBP ---- */
  const anyBP = R(D.e1)||R(D.e3)||R(D.e5)||R(D.e8)||(IC.bp.nad||[]).length||(IC.bp.nada||[]).length||(IC.bp.nae||[]).length;
  if(anyBP){
    const nad=(IC.bp.nad||[]).filter(r=>st0(r.name)).map(r=>ob({NameOfBusiness:sv(r.name),CodeAD:sv(r.code),Description:sv(r.desc)}));
    if(nad.length) put(j,"ScheduleBP.NatOfBus44AD",nad);
    if(R(D.e1)||R(D.e2c)) put(j,"ScheduleBP.PersumptiveInc44AD",ob({
      GrsTotalTrnOver:n0(D.e1),GrsTrnOverBank:N(D.e1a)?n0(D.e1a):undefined,
      GrsTotalTrnOverInCash:N(D.e1b)?n0(D.e1b):undefined,GrsTrnOverAnyOthMode:N(D.e1c)?n0(D.e1c):undefined,
      PersumptiveInc44AD6Per:N(D.e2a)?n0(D.e2a):undefined,PersumptiveInc44AD8Per:N(D.e2b)?n0(D.e2b):undefined,
      TotPersumptiveInc44AD:n0(D.e2c)}));
    const nada=(IC.bp.nada||[]).filter(r=>st0(r.name)).map(r=>ob({NameOfBusiness:sv(r.name),CodeADA:sv(r.code),Description:sv(r.desc)}));
    if(nada.length) put(j,"ScheduleBP.NatOfBus44ADA",nada);
    if(R(D.e3)||R(D.e4)) put(j,"ScheduleBP.PersumptiveInc44ADA",ob({
      GrsReceipt:n0(D.e3),GrsTrnOverBank44ADA:N(D.e3a)?n0(D.e3a):undefined,
      GrsTotalTrnOverInCash44ADA:N(D.e3b)?n0(D.e3b):undefined,GrsTrnOverAnyOthMode44ADA:N(D.e3c)?n0(D.e3c):undefined,
      TotPersumptiveInc44ADA:n0(D.e4)}));
    const nae=(IC.bp.nae||[]).filter(r=>st0(r.name)).map(r=>ob({NameOfBusiness:sv(r.name),CodeAE:sv(r.code),Description:sv(r.desc)}));
    if(nae.length) put(j,"ScheduleBP.NatOfBus44AE",nae);
    const gcv=(IC.bp.gcv||[]).filter(v=>st0(v.reg)).map(v=>ob({RegNumberGoodsCarriage:sv(v.reg),
      OwnedLeasedHiredFlag:sv(v.flag),TonnageCapacity:R(N(v.tonnage)),HoldingPeriod:R(N(v.months)),PresumptiveIncome:R(N(v.pi))}));
    if(gcv.length) put(j,"ScheduleBP.GoodsDtlsUs44AE",gcv);
    if(R(D.e5)||R(D.e7)||R(D.e8)) put(j,"ScheduleBP.PersumptiveInc44AE",ob({
      TotPersumInc44AE:n0(D.e5),SalInterestByFirm:N(D.e6)?n0(D.e6):undefined,
      TotalPersumptiveInc:n0(D.e7),IncChargeableUnderBus:n0(D.e8)}));
    let gstTot=0;
    const gst=(IC.bp.gstn||[]).filter(r=>st0(r.gstin)).map(r=>{gstTot+=N(r.amt);return ob({GSTINNo:sv(r.gstin),AmtTurnGrossRcptGSTIN:R(N(r.amt))});});
    if(gst.length){ put(j,"ScheduleBP.TurnoverGrsRcptForGSTIN",gst); put(j,"ScheduleBP.TotalTurnoverGrsRcptGSTIN",R(gstTot)); }
    const f=IC.bp.fin||{};
    const capL=N(f.owncap)+N(f.secured)+N(f.unsecured)+N(f.advances)+N(f.creditors)+N(f.othliab);
    const asst=N(f.fixed)+N(f.invest)+N(f.inventories)+N(f.debtors)+N(f.bank)+N(f.cash)+N(f.loans)+N(f.otherassets);
    const fin=ob({SundryCreditors:N(f.creditors)?R(N(f.creditors)):undefined,Inventories:N(f.inventories)?R(N(f.inventories)):undefined,
      SundryDebtors:N(f.debtors)?R(N(f.debtors)):undefined,BalWithBanks:N(f.bank)?R(N(f.bank)):undefined,
      CashInHand:N(f.cash)?R(N(f.cash)):undefined,TotCapLiabilities:capL?R(capL):undefined,TotalAssets:asst?R(asst):undefined});
    if(Object.keys(fin).length) put(j,"ScheduleBP.FinanclPartclrOfBusiness",fin);
  }

  /* ---- TaxComputation (Part D) ---- */
  put(j,"TaxComputation.TotalTaxPayable",n0(t.d1));
  put(j,"TaxComputation.Rebate87A",n0(t.d2));
  put(j,"TaxComputation.TaxPayableOnRebate",n0(t.d3));
  put(j,"TaxComputation.EducationCess",n0(t.d4));
  put(j,"TaxComputation.GrossTaxLiability",n0(t.d5));
  if(N(t.d6)) put(j,"TaxComputation.Section89",n0(t.d6));
  put(j,"TaxComputation.NetTaxLiability",n0(t.d7));
  put(j,"TaxComputation.IntrstPay.IntrstPayUs234A",n0(t.i234a));
  put(j,"TaxComputation.IntrstPay.IntrstPayUs234B",n0(t.i234b));
  put(j,"TaxComputation.IntrstPay.IntrstPayUs234C",n0(t.i234c));
  put(j,"TaxComputation.IntrstPay.LateFilingFee234F",n0(t.fee234f));
  if(N(t.fee234i)) put(j,"TaxComputation.IntrstPay.FeeFurnish234I",n0(t.fee234i));
  put(j,"TaxComputation.TotTaxPlusIntrstPay",n0(t.d12));

  /* ---- LTCG112A (D20a) ---- */
  put(j,"LTCG112A.TotSaleCnsdrn",n0(N(IC.ltcg.sale)));
  put(j,"LTCG112A.TotCstAcqisn",n0(N(IC.ltcg.cost)));
  put(j,"LTCG112A.LongCap112A",n0(D.long112a));

  /* ---- TaxExmpIntIncDtls (D20 exempt income) ---- */
  let exemptTot=0;
  const exArr=(IC.exmp||[]).filter(r=>N(r.amt)||st0(r.cat)).map(r=>{exemptTot+=N(r.amt);
    return ob({Category:sv(r.cat),SubCategory:sv(r.sub),Description:sv(r.desc),OthAmount:R(N(r.amt))});});
  if(exArr.length){
    put(j,"TaxExmpIntIncDtls.OthersInc.OthersIncDtls",exArr);
    put(j,"TaxExmpIntIncDtls.OthersInc.OthersTotalTaxExe",R(exemptTot));
  }
}

/* =====================================================================
   IMPORT — impInc(I4): inverse. Returns short labels of what was read.
   ===================================================================== */
function impInc(I4){
  const read=[]; if(!I4) return read;
  const P=I4.PersonalInfo, FSt=I4.FilingStatus, ID=I4.IncomeDeductions,
        TC=I4.TaxComputation, BP=I4.ScheduleBP, LT=I4.LTCG112A, EX=I4.TaxExmpIntIncDtls;
  if(P){
    const nm=P.AssesseeName||{}; S.pi.first=nm.FirstName||""; S.pi.mid=nm.MiddleName||""; S.pi.last=nm.SurNameOrOrgName||"";
    S.pi.pan=P.PAN||S.pi.pan;
    const a=P.Address||{}; S.pi.resNo=a.ResidenceNo||""; S.pi.resName=a.ResidenceName||""; S.pi.road=a.RoadOrStreet||"";
    S.pi.locality=a.LocalityOrArea||""; S.pi.city=a.CityOrTownOrDistrict||""; S.pi.state=a.StateCode||"";
    S.pi.country=a.CountryCode||"91"; S.pi.pin=a.PinCode!=null?String(a.PinCode):""; S.pi.zip=a.ZipCode||"";
    if(a.Phone){ S.pi.std=a.Phone.STDcode!=null?String(a.Phone.STDcode):""; S.pi.phone=a.Phone.PhoneNo||""; }
    S.pi.mobcc=a.CountryCodeMobile!=null?String(a.CountryCodeMobile):"91";
    S.pi.mobile=a.MobileNo!=null?String(a.MobileNo):""; S.pi.email=a.EmailAddress||""; S.pi.emailSec=a.EmailAddressSec||"";
    S.pi.secAdd=P.SecondaryAdd||"Y";
    const alt=P.AlternateAddress||{}; S.pi.altRes=alt.ResidenceNo||""; S.pi.altLoc=alt.LocalityOrArea||"";
    S.pi.altCity=alt.CityOrTownOrDistrict||""; S.pi.altState=alt.StateCode||"";
    S.pi.dob=dmy(P.DOB)||S.pi.dob; S.pi.empcat=P.EmployerCategory||"OTH"; S.pi.status=P.Status||"I"; S.pi.aadhaar=P.AadhaarCardNo||"";
    read.push("personal info");
  }
  if(FSt){
    S.fs.sec=FSt.ReturnFileSec!=null?FSt.ReturnFileSec:11;
    S.fs.f10ieaEarlier=FSt.Form10IEAEarlierAYOldRegime||"NA";
    S.fs.f10ieaAY=FSt.Form10IEAAssYear||""; S.fs.f10ieaAck=FSt.Form10IEAEarlierAYAckOldRegime||"";
    S.fs.optout=(FSt.F10IEACurrAYOldRegime==="Y")?"Yes":"No";
    S.fs.f10ieaDateCur=dmy(FSt.F10IEADateCurrAYOldTax)||""; S.fs.f10ieaAckCur=FSt.F10IEAAckNoCurrAYOldTax||"";
    S.fs.seventh=FSt.SeventhProvisio139||"N";
    S.fs.dep1cr=FSt.DepAmtAggAmtExcd1CrPrYrFlg||""; S.fs.dep1crAmt=FSt.AmtSeventhProvisio139i||"";
    S.fs.trv2l=FSt.IncrExpAggAmt2LkTrvFrgnCntryFlg||""; S.fs.trv2lAmt=FSt.AmtSeventhProvisio139ii||"";
    S.fs.ele1l=FSt.IncrExpAggAmt1LkElctrctyPrYrFlg||""; S.fs.ele1lAmt=FSt.AmtSeventhProvisio139iii||"";
    S.fs.clz=FSt.clauseiv7provisio139i||"";
    S.fs.clause7=(FSt.clauseiv7provisio139iDtls||[]).map(r=>({nat:r.clauseiv7provisio139iNature||"",amt:r.clauseiv7provisio139iAmount||""}));
    S.fs.noticeNo=FSt.NoticeNo||""; S.fs.noticeDate=dmy(FSt.NoticeDateUnderSec)||"";
    S.fs.receipt=FSt.ReceiptNo||""; S.fs.origDate=dmy(FSt.OrigRetFiledDate)||"";
    S.fs.rep=FSt.AsseseeRepFlg||"N";
    const rp=FSt.AssesseeRep||{}; S.fs.repName=rp.RepName||""; S.fs.repEmail=rp.RepEmailID||""; S.fs.repMobile=rp.RepMobileNo!=null?String(rp.RepMobileNo):"";
    S.fs.duedate=FSt.ItrFilingDueDate||"2026-08-31";
    read.push("filing status & regime");
  }
  if(ID){
    S.ic.sal.s17_1=ID.Salary||""; S.ic.sal.s17_2=ID.PerquisitesValue||""; S.ic.sal.s17_3=ID.ProfitsInSalary||"";
    S.ic.sal.ent=ID.EntertainmntalwncUs16ii||""; S.ic.sal.ptax=ID.ProfessionalTaxUs16iii||"";
    const alw=(ID.AllwncExemptUs10||{}).AllwncExemptUs10Dtls||[];
    S.ic.sal.alw=alw.map(r=>({nat:r.SalNatureDesc||"",amt:r.SalOthAmount||""}));
    S.ic.hp=(ID.PropertyDetails||[]).map(p=>{
      const rd=p.Rentdetails||{}, ad=p.AddressDetailWithZipCode||{}, s24=(rd.Section24B||{}).Section24BDtls||[];
      return { addr:ad.AddrDetail||"", city:ad.CityOrTownOrDistrict||"", state:ad.StateCode||"",
        country:ad.CountryCode||"91", pin:ad.PinCode!=null?String(ad.PinCode):"",
        owner:p.PropertyOwner||"", ownerOth:p.PropertyOwnerOther||"", co:p.PropCoOwnedFlg||"NO",
        share:p.AsseseeShareProperty!=null?p.AsseseeShareProperty:"", let:p.ifLetOut||"",
        coown:(p.CoOwners||[]).map(o=>({name:o.NameCoOwner||"",pan:o.PAN_CoOwner||"",aadhaar:o.Aadhaar_CoOwner||"",share:o.PercentShareProperty!=null?o.PercentShareProperty:""})),
        tenant:(p.TenantDetails||[]).map(tn=>({name:tn.NameofTenant||"",pan:tn.PANofTenant||"",aadhaar:tn.AadhaarofTenant||"",pantan:tn.PANTANofTenant||""})),
        gross:rd.AnnualLetableValue||"", notReal:rd.RentNotRealized||"", localTax:rd.LocalTaxes||"",
        arrears:rd.ArrearsUnrealizedRentRcvd||"",
        loans:s24.map(l=>({from:l.LoanTknFrom||"",name:l.BankOrInstnName||"",accno:l.LoanAccNoOfBankOrInstnRefNo||"",
          date:dmy(l.DateofLoan)||"",total:l.TotalLoanAmt||"",outst:l.LoanOutstndngAmt||"",intr:l.InterestUs24B||""})) };
    });
    const os=(ID.OthersInc||{}).OthersIncDtlsOthSrc||[];
    S.ic.os.rows=os.map(r=>{ const dr=(r.DividendInc||{}).DateRange||{};
      return { nat:r.OthSrcNatureDesc||"", desc:r.OthSrcOthNatOfInc||"", amt:r.OthSrcOthAmount||"",
        q1:dr.Upto15Of6||"",q2:dr.Upto15Of9||"",q3:dr.Up16Of9To15Of12||"",q4:dr.Up16Of12To15Of3||"",q5:dr.Up16Of3To31Of3||"" }; });
    S.ic.os.fp57=ID.DeductionUs57iia||"";
    read.push("income & deductions");
  }
  if(BP){
    S.ic.bp.nad=(BP.NatOfBus44AD||[]).map(r=>({name:r.NameOfBusiness||"",code:r.CodeAD||"",desc:r.Description||""}));
    const ad=BP.PersumptiveInc44AD||{}; S.ic.bp.ad={bank:ad.GrsTrnOverBank||"",cash:ad.GrsTotalTrnOverInCash||"",other:ad.GrsTrnOverAnyOthMode||"",claim6:ad.PersumptiveInc44AD6Per||"",claim8:ad.PersumptiveInc44AD8Per||""};
    S.ic.bp.nada=(BP.NatOfBus44ADA||[]).map(r=>({name:r.NameOfBusiness||"",code:r.CodeADA||"",desc:r.Description||""}));
    const ada=BP.PersumptiveInc44ADA||{}; S.ic.bp.ada={bank:ada.GrsTrnOverBank44ADA||"",cash:ada.GrsTotalTrnOverInCash44ADA||"",other:ada.GrsTrnOverAnyOthMode44ADA||"",claim:ada.TotPersumptiveInc44ADA||""};
    S.ic.bp.nae=(BP.NatOfBus44AE||[]).map(r=>({name:r.NameOfBusiness||"",code:r.CodeAE||"",desc:r.Description||""}));
    S.ic.bp.gcv=(BP.GoodsDtlsUs44AE||[]).map(v=>({reg:v.RegNumberGoodsCarriage||"",flag:v.OwnedLeasedHiredFlag||"",tonnage:v.TonnageCapacity||"",months:v.HoldingPeriod||"",pi:v.PresumptiveIncome||""}));
    S.ic.bp.ae={salint:(BP.PersumptiveInc44AE||{}).SalInterestByFirm||""};
    S.ic.bp.gstn=(BP.TurnoverGrsRcptForGSTIN||[]).map(r=>({gstin:r.GSTINNo||"",amt:r.AmtTurnGrossRcptGSTIN||""}));
    const f=BP.FinanclPartclrOfBusiness||{}; S.ic.bp.fin={creditors:f.SundryCreditors||"",inventories:f.Inventories||"",debtors:f.SundryDebtors||"",bank:f.BalWithBanks||"",cash:f.CashInHand||""};
    read.push("presumptive business (BP)");
  }
  if(TC){
    S.ic.d.relief89=TC.Section89||""; const ip=TC.IntrstPay||{};
    S.ic.d.int234a=ip.IntrstPayUs234A||""; S.ic.d.int234b=ip.IntrstPayUs234B||""; S.ic.d.int234c=ip.IntrstPayUs234C||"";
    S.ic.d.fee234f=ip.LateFilingFee234F||""; S.ic.d.fee234i=ip.FeeFurnish234I||"";
    read.push("tax computation");
  }
  if(LT){ S.ic.ltcg={sale:LT.TotSaleCnsdrn||"",cost:LT.TotCstAcqisn||""}; read.push("LTCG 112A"); }
  if(EX){ S.ic.exmp=((EX.OthersInc||{}).OthersIncDtls||[]).map(r=>({cat:r.Category||"",sub:r.SubCategory||"",desc:r.Description||"",amt:r.OthAmount||""})); read.push("exempt income"); }
  return read;
}

/* =====================================================================
   CHECKS — the sheet's own rules as live messages (regime-aware).
   ===================================================================== */
function chkWho(){
  const out=[];
  if(!st0(S.pi.last)) out.push({lvl:"err",t:"Name required",m:"Surname / last name (or firm name) is mandatory.",sec:"who"});
  if(st0(S.pi.pan)&&!PAN_RE.test(String(S.pi.pan).toUpperCase())) out.push({lvl:"err",t:"PAN not valid",m:"PAN must be 10 characters: AAAAA9999A.",sec:"who"});
  if(st0(S.pi.pin)&&!/^[1-9][0-9]{5}$/.test(String(S.pi.pin))) out.push({lvl:"warn",t:"PIN not valid",m:"PIN is 6 digits, 100000–999999.",sec:"who"});
  if(st0(S.pi.email)&&!MAIL.test(S.pi.email)) out.push({lvl:"warn",t:"Email looks wrong",m:"Enter a valid primary email.",sec:"who"});
  return out;
}
function chkRet(){
  const out=[], sec=+S.fs.sec;
  if(!st0(S.fs.f10ieaEarlier)) out.push({lvl:"err",t:"Form 10-IEA (earlier AY) required",m:"Answer whether Form 10-IEA was filed within the due date for an earlier AY (mandatory).",sec:"ret"});
  if(S.fs.optout==="Yes"){
    if(!st0(S.fs.f10ieaAckCur)) out.push({lvl:"err",t:"Form 10-IEA acknowledgement required",m:"Opting out of the new regime is exercised only through Form 10-IEA — furnish its acknowledgement number.",sec:"ret"});
    if(!D(S.fs.f10ieaDateCur)) out.push({lvl:"err",t:"Form 10-IEA date required",m:"Furnish the date of filing of Form 10-IEA for AY 2026-27.",sec:"ret"});
  }
  if([13,14,16,18,20].indexOf(sec)>=0 && !st0(S.fs.noticeNo)) out.push({lvl:"err",t:"DIN required",m:"A return filed against a 142(1)/148/153C/139(9) notice or 119(2)(b) order needs the DIN.",sec:"ret"});
  if(sec===17 && !st0(S.fs.receipt)) out.push({lvl:"err",t:"Receipt number required",m:"A revised return (139(5)) needs the receipt number of the original return.",sec:"ret"});
  if(S.fs.rep==="Y"){
    if(st0(S.fs.repEmail)&&st0(S.pi.email)&&S.fs.repEmail.toLowerCase()===st0(S.pi.email).toLowerCase())
      out.push({lvl:"err",t:"Representative email clashes",m:"The representative's email must differ from the taxpayer's.",sec:"ret"});
  }
  return out;
}
function chkInc(){
  const out=[], D=(S.C.inc||{}).detail||{};
  /* 44AD turnover / audit thresholds (BP.md [O26]) */
  if(N(D.e1)>0){
    const cashPct=N(D.e1)?(N(D.e1b)/N(D.e1)*100):0;
    const cap=cashPct>5?20000000:30000000;
    if(N(D.e1)>cap) out.push({lvl:"warn",t:"44AD turnover exceeds cap",m:"Gross turnover exceeds the ₹"+(cap/10000000)+" crore presumptive cap"+(cashPct>5?" (cash > 5%)":"")+".",sec:"inc"});
  }
  if(N(D.e3)>7500000) out.push({lvl:"warn",t:"44ADA receipts exceed cap",m:"Gross receipts u/s 44ADA exceed the ₹75 lakh cap.",sec:"inc"});
  if((S.ic.bp.gcv||[]).length>10) out.push({lvl:"err",t:"Too many goods carriages",m:"Schedule 44AE allows at most 10 goods-carriage rows.",sec:"inc"});
  (S.ic.bp.gcv||[]).forEach((v,i)=>{ const m=N(v.months); if(v.months!==""&&(m<1||m>12)) out.push({lvl:"err",t:"Vehicle months out of range",m:"Vehicle "+(i+1)+": months owned/leased/hired must be 1–12.",sec:"inc"}); });
  /* new-regime closed exempt allowances carrying value */
  if(isNew()) (S.ic.sal.alw||[]).forEach(r=>{ if(ALW_CLOSED_NEW[st0(r.nat)]&&N(r.amt)>0)
    out.push({lvl:"warn",t:"Exempt allowance closed in new regime",m:st0(r.nat)+" is not exempt under the new regime and is treated as 0.",sec:"inc"}); });
  if(N(D.ltGain)>125000) out.push({lvl:"warn",t:"LTCG 112A above ₹1.25L",m:"LTCG u/s 112A exceeds ₹1,25,000; it is reported as 0 here and this return may not be eligible for ITR-4.",sec:"inc"});
  return out;
}
function chkHP(){
  const out=[];
  if((S.ic.hp||[]).length>2) out.push({lvl:"err",t:"Too many house properties",m:"ITR-4 allows at most two house properties.",sec:"hp"});
  (S.ic.hp||[]).forEach((p,i)=>{
    if(p.let==="S"&&N(p.localTax)>0) out.push({lvl:"warn",t:"Local tax on self-occupied",m:"Property "+(i+1)+": tax paid to local authorities is not allowed for a self-occupied house.",sec:"hp"});
    if(p.co==="YES"&&!(p.coown||[]).length) out.push({lvl:"err",t:"Co-owner table empty",m:"Property "+(i+1)+": you marked it co-owned — list each co-owner.",sec:"hp"});
    let intr=0;(p.loans||[]).forEach(l=>intr+=N(l.intr));
    if((p.let==="S"||p.let==="D")&&intr>200000) out.push({lvl:"warn",t:"24(b) interest capped",m:"Property "+(i+1)+": interest on a not-let-out house is capped at ₹2,00,000.",sec:"hp"});
  });
  return out;
}
function chkTax(){
  const out=[], t=S.C.taxc||{};
  if(N(t.ti)>5125000) out.push({lvl:"err",t:"Total income above the Sugam ceiling",m:"Total income exceeds ₹51,25,000 — ITR-4 (Sugam) cannot be used; file ITR-3.",sec:"tax"});
  if(S.pi.status!=="I" && N(t.d2)>0) out.push({lvl:"warn",t:"87A rebate not available",m:"Rebate u/s 87A is available only to a Resident Individual (rules #250/#255).",sec:"tax"});
  if(N(t.fee234f)>5000) out.push({lvl:"warn",t:"Fee 234F over cap",m:"Late-filing fee u/s 234F is capped at ₹5,000.",sec:"tax"});
  if(!out.length) out.push({lvl:"ok",t:"Tax computation",m:(isNew()?"New":"Old")+" regime · total income "+RS(t.ti||0)+" · tax & cess "+RS(t.d5||0)+".",sec:"tax"});
  return out;
}

/* =====================================================================
   REGISTER — five screen sections. eng on inc(20)+tax(80); exp/imp on inc.
   ===================================================================== */
reg({id:"who", t:"Who is filing", ref:"Part A - General", f:secWho,
  s:()=>st0(S.pi.last)?(st0(S.pi.pan)?S.pi.pan:S.pi.last):"", chk:chkWho, order:8});
reg({id:"ret", t:"Return and regime", ref:"Filing Status", f:secRet,
  s:()=>(S.fs.optout==="Yes"?"Old regime":"New regime"), chk:chkRet, order:9});
reg({id:"inc", t:"Income", ref:"Income Details (Part B)", f:secInc,
  s:()=>{const A=S.C.inc||{};const v=N(A.salary)+N(A.bp)+N(A.os);return v?RS(v):"";},
  eng:engInc, exp:expInc, imp:impInc, chk:chkInc, order:20});
reg({id:"hp", t:"House property", ref:"HP", f:secHP,
  s:()=>{const v=(S.C.hp||{}).income;return R(v)?RS(v):"";}, chk:chkHP, order:22});
reg({id:"tax", t:"Part B — tax computation", ref:"Income Details (Part D)", f:secTax,
  s:()=>{const t=S.C.taxc||{};return R(t.d12)?RS(t.d12):"";},
  eng:engTax, chk:chkTax, order:80});
