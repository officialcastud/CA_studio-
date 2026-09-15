/* =====================================================================
   ITR-3 · Section "ret" — Return and regime (Part A - General)
   Screen ref: Part A - General · compute order 6.
   Owns schema blocks PartA_GEN1 (PersonalInfo + FilingStatus) and
   PartA_GEN2 (AuditInfo + NatOfBus). Built ONLY from
   books/ITR-3/PART_A_General.md and books/ITR-3/REGIME.md — every label,
   code, dropdown value and rule is the department's own, quoted from the
   sheet/book. Personal-identity fields (name/PAN/address) are collected by
   the "who" screen into S.pi; this section renders the return/regime/audit
   face, and exports/imports BOTH GEN blocks from S.pi / S.fs / S.decl /
   S.aud / S.nob.

   Part A - General carries NO income head: S.C.ret.income = 0 (nothing
   rolls into Gross Total Income from here). Regime (isNew()) here is the
   *mechanism* (Form 10-IEA opt-out), not a closed income item — so there is
   no cell(0) closure to build; the regime effect on this screen is the
   New-vs-Old comparison and the 10-IEA acknowledgement rows that open only
   when a business filer opts for the old regime.
   ===================================================================== */

/* ---- state (seed only what is absent; never clobber the "who" screen) --- */
S.pi = S.pi || {};
if(S.pi.status===undefined) S.pi.status="I";
if(S.pi.res===undefined)    S.pi.res="RES";
if(S.pi.country===undefined)S.pi.country="91";
if(S.pi.addr2same===undefined)S.pi.addr2same="Y";
S.pi.dirco = S.pi.dirco || [];   /* FilingStatus.CompDirectorPrvYr...Dtls[]  (rows 122-126) */
S.pi.firms = S.pi.firms || [];   /* FilingStatus.PartnerInFirm.PartnerInFirmDtls[] (rows 128-131) */
S.pi.unlco = S.pi.unlco || [];   /* FilingStatus.HeldUnlistedEqShrPrYr...Dtls[] (rows 133-138) */

S.fs = S.fs || {};
if(S.fs.optout===undefined) S.fs.optout="No";              /* master switch → isNew() */
if(S.fs.sec===undefined)    S.fs.sec=11;                   /* FilingStatus.ReturnFileSec (11 = 139(1)) */
if(S.fs.filed===undefined)  S.fs.filed="";
if(S.fs.incBP===undefined)  S.fs.incBP="Y";               /* FilingStatus.IncFrmBusOrProf (A19(b)) */
if(S.fs.resStatus===undefined)S.fs.resStatus="RES";        /* FilingStatus.ResidentialStatus */
if(S.fs.duedate===undefined)S.fs.duedate="2026-10-31";     /* FilingStatus.ItrFilingDueDate */
if(S.fs.seventh===undefined)S.fs.seventh="N";              /* FilingStatus.SeventhProvisio139 */
if(S.fs.foreignExch===undefined)S.fs.foreignExch="N";      /* FilingStatus.ForeignExchangeFlag */
if(S.fs.fpi===undefined)    S.fs.fpi="N";                  /* FilingStatus.FiiFpiFlag */
if(S.fs.nriPE===undefined)  S.fs.nriPE="N";
if(S.fs.nriSEP===undefined) S.fs.nriSEP="N";
if(S.fs.ifsc===undefined)   S.fs.ifsc="N";
if(S.fs.b115H===undefined)  S.fs.b115H="N";
if(S.fs.rep===undefined)    S.fs.rep="N";                  /* FilingStatus.AsseseeRepFlg */
if(S.fs.dir===undefined)    S.fs.dir="N";                  /* FilingStatus.CompDirectorPrvYrFlg */
if(S.fs.partner===undefined)S.fs.partner="N";              /* FilingStatus.PartnerInFirmFlg */
if(S.fs.unl===undefined)    S.fs.unl="N";                  /* FilingStatus.HeldUnlistedEqShrPrYrFlg */

S.decl = S.decl || {};                                     /* Seventh proviso to 139(1) */
if(S.decl.flag===undefined) S.decl.flag="N";
S.decl.c4 = S.decl.c4 || [];                               /* clauseiv7provisio139iDtls[] */

S.aud = S.aud || {};                                       /* PartA_GEN2 · AuditInfo */
if(S.aud.sec44AA===undefined)  S.aud.sec44AA="N";          /* LiableSec44AAflg */
if(S.aud.incDclrdUs===undefined)S.aud.incDclrdUs="N";      /* IncDclrdUs (a2) */
if(S.aud.sec44AB===undefined)  S.aud.sec44AB="N";          /* LiableSec44ABflg (b) */
if(S.aud.acctFlg===undefined)  S.aud.acctFlg="N";          /* AuditAccountantFlg (c) */
if(S.aud.sec92E===undefined)   S.aud.sec92E="N";           /* LiableSec92Eflg (d(i)) */
if(S.aud.acct92E===undefined)  S.aud.acct92E="N";          /* AccountAuditFlag (d(ii)) */
S.aud.oth = S.aud.oth || [];                               /* AuditInfo.AuditDetails[] (rows 177-184) */
S.aud.act = S.aud.act || [];                               /* AuditInfo.AuditReportDetails[] (rows 189-193) */

S.nob = S.nob || [];                                       /* NatOfBus.NatureOfBusiness[] */

/* SEED — default grid rows (per the task contract). The shell's add-row
   handler carries its own seeds for pi.dirco/pi.unlco/pi.firms/decl.c4;
   these cover this section's own grids. */
SEED["aud.oth"]=SEED["aud.oth"]||{sec:"10AA",flag:"Y"};
SEED["aud.act"]=SEED["aud.act"]||{act:"6"};
SEED.nob=SEED.nob||{};

/* ---- code tables (from books/ITR-3/enums.json, verbatim) ---- */
const RET_SEC=[["11","139(1)- On or Before due date"],["12","139(4)- After due date"],
  ["13","142(1)"],["14","148"],["16","153C"],["17","139(5)- Revised Return"],
  ["18","139(9)"],["19","92CD-Modified return"],["20","119(2)(b)-After condonation of delay"],
  ["21","139(8A)-Updated Return"]];
const RES_STAT=[["RES","RES - Resident"],["NRI","NRI - NonResident"],["NOR","NOR - Resident but not Ordinarily Resident"]];
const DUE_DATES=[["2026-08-31","31/08/2026"],["2026-10-31","31/10/2026"],["2026-11-30","30/11/2026"]];
const YN=[["Y","Yes"],["N","No"]];
const YN_NA=[["Y","Yes"],["N","No"],["NA","Not Applicable"]];
const CO_TYPE=[["D","Domestic"],["F","Foreign"]];
const SHARE_TYPE=[["L","Listed"],["U","Unlisted"]];
const CLAUSEIV=[
  ["1","total sales, turnover or gross receipts in the business exceeds sixty lakh rupees during the previous year"],
  ["2","the total gross receipts in profession exceeds ten lakh rupees during the previous year"],
  ["3","the aggregate of TDS and TCS during the previous year is twenty-five thousand rupees or more"],
  ["4","total deposits in one or more savings bank accounts is fifty lakh rupees or more in the previous year"]];
const SALES_BAND=[["Upto1CR","Up to Rs. 1 crore"],["Upto10CR","More than Rs. 1 crore and up to Rs. 10 crores"],["MoreThan10CR","More than Rs. 10 crores"]];
const PCT_BAND=[["Upto5Per","Up to 5%"],["MoreThan5Per","More than 5%"]];
const CND_44AB=[["bi","Sales, turnover or gross receipts exceeds the specified limits"],
  ["bii","Assessee falling u/s 44AD/44ADA/44AE/44BB but not opting for offering income on presumptive basis"],
  ["biii","others"]];
const AUD_SEC=[["10A","10A"],["10AA","10AA"],["44DA","44DA"],["50B","50B"],["80-IA","80-IA"],
  ["80-IAB","80-IAB"],["80-IAC","80-IAC"],["80-IB","80-IB"],["80-IC","80-IC"],["80-ID","80-ID"],
  ["80-IE","80-IE"],["80JJAA","80JJAA"],["80LA","80LA"],["115JC","115JC"]];
const AUD_ACT=[["1","Banking Regulation Act, 1949"],["2","Central Excise Act,1944"],
  ["3","Central Sales Tax Act, 1956"],["4","Central Goods and Services Tax Act, 2017"],
  ["5","Charitable And Religious Trusts Act, 1920"],["6","Companies Act, 2013"],
  ["7","Electricity Act, 2003"],["8","Employees Provident Fund and Miscellaneous Provisions Act, 1952"],
  ["9","Foreign Exchange Management Act, 1999"],["10","Government Superannuation Fund Act, 1956"],
  ["11","Indian Trusts Act, 1882"],["12","Integrated Goods and Services Tax Act, 2017"],
  ["13","Limited Liability Partnership Act, 2008"],["14","Payment of Gratuity Act, 1972"],
  ["15","SEBI Act, 1992"],["16","Securities Contract (Regulation) Act, 1956"],
  ["17","State Goods and Services Tax Act, 2017"],["18","Union Territories Goods and Services Tax Act, 2017"],
  ["19","Others"]];
/* Return-section codes that carry a notice/order (DIN + date mandatory) and
   those that carry an original-return receipt (revised/defective/modified). */
const RET_NOTICE=[13,14,16,18,20];   /* 142(1) / 148 / 153C / 139(9) / 119(2)(b) */
const RET_ORIG=[17,19];              /* 139(5) revised / 92CD modified */

/* =====================================================================
   ENGINE — engRet(): Part A - General carries no income head.
   ===================================================================== */
function engRet(){
  const A={income:0};                         /* contribution to GTI = 0 */
  A.optOld  = (S.fs.optout==="Yes");          /* old regime chosen */
  A.regime  = A.optOld?"Old":"New";
  A.hasBP   = (S.fs.incBP==="Y");             /* A19(b) — business/profession income */
  /* Form 10-IEA is the sticky opt-out mechanism, and is REQUIRED to opt out
     of the new regime only when there is business/profession income
     (REGIME.md · A45). A person without BP income opts in the return itself. */
  A.need10IEA = A.optOld && A.hasBP;
  S.C.ret=A;
}

/* =====================================================================
   New-vs-Old comparison — compute the whole return both ways.
   Reads other heads' compute output defensively; never throws.
   (REGIME.md: "the ret section shows the both-ways comparison".)
   ===================================================================== */
function retCompare(){
  if(typeof compute!=="function" || S._retCmp) return null;
  S._retCmp=1;
  const keep=S.fs.optout;
  const pick=()=>({ via:((S.C.ded||{}).allowed||(S.C.via||{}).allowed||0),
                    ti:(S.C.ti||0),
                    tax:(((S.C.int||{}).net!=null?(S.C.int||{}).net:((S.C.tax||{}).gross||0))||0) });
  let a={via:0,ti:0,tax:0}, b={via:0,ti:0,tax:0};
  try{ S.fs.optout="No";  compute(); a=pick(); }catch(e){}
  try{ S.fs.optout="Yes"; compute(); b=pick(); }catch(e){}
  S.fs.optout=keep; try{ compute(); }catch(e){}
  S._retCmp=0;
  return {a,b};
}
function regimeTable(){
  const c=retCompare();
  if(!c) return note("The New-vs-Old comparison appears once the income and tax "+
    "sections are computed.");
  const a=c.a,b=c.b,gap=Math.abs(R(a.tax)-R(b.tax)),better=R(a.tax)<=R(b.tax)?"new":"old";
  let h='<div class="full"><table class="gt" style="min-width:640px"><thead><tr>'+
    '<th class="l">Regime</th><th style="width:170px">Chapter VI-A allowed</th>'+
    '<th style="width:150px">Total income</th><th style="width:150px">Tax after credit</th>'+
    '</tr></thead><tbody>'+
    '<tr><td class="l">New — section 115BAC(1A)</td><td class="num">'+cell(a.via)+
      '</td><td class="num">'+cell(a.ti)+'</td><td class="num">'+cell(a.tax)+'</td></tr>'+
    '<tr><td class="l">Old</td><td class="num">'+cell(b.via)+'</td><td class="num">'+
      cell(b.ti)+'</td><td class="num">'+cell(b.tax)+'</td></tr></tbody></table></div>';
  h+=(gap?note("On the figures entered so far the <b>"+better+" regime costs "+RS(gap)+
      " less</b>. A business filer opts out of the new regime only through Form 10-IEA — "+
      "settle it before filing.")
        :note("On the figures entered so far the two regimes come to the same tax."));
  return h;
}

/* =====================================================================
   RENDERER — secRet(): the Return / regime / audit face.
   ===================================================================== */
function secRet(){
  const sec=+S.fs.sec, ind=S.pi.status!=="H";
  let h="";

  /* ---- Filing (rows 29-35) ---- */
  h+=sub("Filing");
  h+=row("Filed under section",sel("fs.sec",RET_SEC,{blank:false}),{req:1,ref:"A18"});
  if(RET_NOTICE.indexOf(sec)>=0){
    h+=row("Unique Number / Document Identification Number (DIN) of the notice or order",
      inp("fs.din"),{req:1,ind:1,ref:"E35",hint:"mandatory for a return filed against a 139(9)/142(1)/148/153C notice or 119(2)(b) order"});
    h+=row("Date of the notice or order",dte("fs.noticedate"),{req:1,ind:1});
  }
  if(RET_ORIG.indexOf(sec)>=0){
    h+=row("Receipt number of the original return",inp("fs.receipt",{max:15}),{req:1,ind:1,ref:"E32"});
    h+=row("Date of filing of the original return",dte("fs.origdate"),{req:1,ind:1});
  }
  h+=row("Date of filing this return",dte("fs.filed"),{req:1,hint:"drives interest under 234A and the fee under 234F"});
  h+=row("Due date for filing return of income",sel("fs.duedate",DUE_DATES,{blank:false}),
    {req:1,ref:"FilingStatus.ItrFilingDueDate",hint:"if 31 Oct or 30 Nov is selected, Schedule IF / 5A / audit details apply"});

  /* ---- Regime — Form 10-IEA machinery (rows 62-79 visible) ---- */
  h+=sub("Tax regime — section 115BAC");
  h+=row("Do you have income from business or profession for the current Assessment Year?",
    sel("fs.incBP",YN,{blank:false}),{req:1,ref:"A19(b) / E62"});
  h+=row("Do you wish to opt for the OLD tax regime for the current Assessment Year? (section 115BAC(6))",
    sel("fs.optout",[["No","No — stay in the new regime (default)"],["Yes","Yes — opt out to the old regime"]],{blank:false}),
    {req:1,ref:"E79",hint:"the default is the new regime u/s 115BAC(1A)"});
  if(S.fs.optout==="Yes"){
    if(S.fs.incBP==="Y"){
      h+=note("Opting out of the new regime with business/profession income is exercised "+
        "<b>only</b> through Form 10-IEA, and is sticky. Furnish its current-AY acknowledgement "+
        "and date below (REGIME.md · A45).","warn");
      h+=row("Date of filing of Form 10-IEA for AY 2026-27",dte("fs.f10ieaDate"),{req:1,ind:1,ref:"O77"});
      h+=row("Acknowledgement Number of Form 10-IEA",inp("fs.f10ieaAck",{max:15}),{req:1,ind:1,ref:"O78"});
    } else {
      h+=note("Without business/profession income the old regime is exercised in the return "+
        "itself — Form 10-IEA is not applicable.");
    }
    h+=row("Have you filed Form 10-IEA within the due date for any earlier AY to opt out (old regime)?",
      sel("fs.f10ieaEarlier",YN),{ind:1,ref:"N63"});
    if(S.fs.f10ieaEarlier==="Y"){
      h+=row("Form 10-IEA acknowledgement number (earlier AY, old regime)",inp("fs.f10ieaEarlierAck",{max:15}),{ind:1,ref:"O66"});
      h+=row("Assessment Year of that Form 10-IEA",sel("fs.f10ieaEarlierAY",[["2024-25","2024-25"],["2025-26","2025-26"]]),{ind:1,ref:"O65"});
    }
  }
  h+=regimeTable();

  /* ---- Residential status ---- */
  h+=sub("Residential status");
  h+=row("Residential status in India",sel("fs.resStatus",RES_STAT,{blank:false}),{req:1,ref:"FilingStatus.ResidentialStatus"});
  if(ind && S.fs.resStatus==="RES")
    h+=row("Do you want to claim the benefit under section 115H? (resident)",sel("fs.b115H",YN),{ref:"E112"});

  /* ---- Seventh proviso to 139(1) (rows 101-109) ---- */
  h+=sub("Seventh proviso to section 139(1)");
  h+=card("declret","Filing under the seventh proviso though not otherwise required to",
    (S.decl.flag==="Y"?"Declared":""),
    row("Are you filing under the seventh proviso to 139(1) but otherwise not required to file?",
      sel("decl.flag",YN,{blank:false}),{ref:"E101"})+
    (S.decl.flag==="Y"?(
      row("Deposited over ₹1 crore in one or more current accounts?",sel("decl.dep_f",YN),
        {ref:"E102",v2:S.decl.dep_f==="Y"?inp("decl.dep",{n:1}):""})+
      row("Spent over ₹2 lakh on travel to a foreign country?",sel("decl.trv_f",YN),
        {ref:"E103",v2:S.decl.trv_f==="Y"?inp("decl.trv",{n:1}):""})+
      row("Spent over ₹1 lakh on consumption of electricity?",sel("decl.ele_f",YN),
        {ref:"E104",v2:S.decl.ele_f==="Y"?inp("decl.ele",{n:1}):""})+
      row("Required to file under other conditions in clause (iv) of the seventh proviso?",
        sel("decl.c4_f",YN),{ref:"E105"})+
      (S.decl.c4_f==="Y"?grid("decl.c4",[
        {k:"nature",h:"Condition",t:"sel",w:"560px",req:1,opts:CLAUSEIV},
        {k:"amt",h:"Amount",t:"num",w:"150px",req:1}],
        S.decl.c4||[],{min:"760px",empty:"No condition added.",add:"Add a condition"}):"")
    ):""));

  /* ---- Directorship / Partnership / Unlisted shares ---- */
  h+=sub("Directorship, partnership and unlisted shares");
  h+=row("Were you a Director in a company at any time during the previous year?",
    sel("fs.dir",YN,{blank:false}),{ref:"E122"});
  if(S.fs.dir==="Y")
    h+=grid("pi.dirco",[
      {k:"name",h:"Name of company",t:"txt",w:"320px",req:1},
      {k:"type",h:"Type of company",t:"sel",w:"140px",req:1,opts:CO_TYPE},
      {k:"pan",h:"PAN",t:"txt",w:"130px",max:10},
      {k:"listed",h:"Shares",t:"sel",w:"130px",req:1,opts:SHARE_TYPE},
      {k:"din",h:"DIN",t:"txt",w:"140px"}],
      S.pi.dirco||[],{min:"900px",empty:"No company added.",add:"Add a company"});
  h+=row("Were you a Partner in a Firm?",sel("fs.partner",YN,{blank:false}),{ref:"E128"});
  if(S.fs.partner==="Y")
    h+=grid("pi.firms",[
      {k:"name",h:"Name of firm",t:"txt",w:"420px",req:1},
      {k:"pan",h:"PAN",t:"txt",w:"140px",req:1,max:10}],
      S.pi.firms||[],{min:"640px",empty:"No firm added.",add:"Add a firm"});
  h+=row("Did you hold unlisted equity shares at any time during the previous year?",
    sel("fs.unl",YN,{blank:false}),{req:1,ref:"E133"});
  if(S.fs.unl==="Y")
    h+=grid("pi.unlco",[
      {k:"name",h:"Name of company",t:"txt",w:"260px",req:1},
      {k:"type",h:"Type",t:"sel",w:"120px",req:1,opts:CO_TYPE},
      {k:"pan",h:"PAN",t:"txt",w:"120px",max:10},
      {k:"obNo",h:"Opening — no. of shares",t:"num",w:"120px",req:1},
      {k:"obCost",h:"Opening — cost of acquisition",t:"num",w:"140px",req:1},
      {k:"acqNo",h:"Acquired — no. of shares",t:"num",w:"120px"},
      {k:"cbNo",h:"Closing — no. of shares",t:"num",w:"120px",req:1},
      {k:"cbCost",h:"Closing — cost of acquisition",t:"num",w:"140px",req:1}],
      S.pi.unlco||[],{min:"1180px",empty:"No company added.",add:"Add a company"});

  /* ---- Non-resident PE/SEP, IFSC, FPI, LEI ---- */
  h+=sub("Non-resident, IFSC, FPI and LEI");
  if(S.fs.resStatus!=="RES"){
    h+=row("In case of non-resident, is there a Permanent Establishment (PE) in India?",sel("fs.nriPE",YN),{ref:"E140"});
    h+=row("In case of non-resident, is there a Significant Economic Presence (SEP) in India?",sel("fs.nriSEP",YN_NA),{ref:"E141"});
    if(S.fs.nriSEP==="Y"){
      h+=row("Aggregate of payments arising from the transaction(s)",inp("fs.sepPay",{n:1}),{ind:1,ref:"E142"});
      h+=row("Number of users in India [Explanation 2A(b) to 9(1)(i)]",inp("fs.sepUsers",{n:1}),{ind:1,ref:"E143"});
    }
  }
  h+=row("Do you have a unit in an IFSC deriving income solely in convertible foreign exchange?",
    sel("fs.foreignExch",YN,{blank:false}),{req:1,ref:"E144 / ForeignExchangeFlag"});
  h+=row("Whether you are an FPI?",sel("fs.fpi",YN,{blank:false}),{req:1,ref:"E145 / FiiFpiFlag"});
  if(S.fs.fpi==="Y")
    h+=row("SEBI Registration No.",inp("fs.sebi"),{ind:1,ref:"E146"});
  h+=row("Legal Entity Identifier (LEI) Number",inp("fs.lei",{max:20}),{ref:"E148",hint:"mandatory if the refund is ₹50 crore or more"});
  if(st0(S.fs.lei))
    h+=row("LEI valid upto date",dte("fs.leiValid"),{ind:1,ref:"E149"});

  /* ---- Representative assessee (rows 114-117) ---- */
  h+=sub("Representative assessee");
  h+=row("Is this return being filed by a representative assessee?",sel("fs.rep",YN,{blank:false}),{ref:"E114"});
  if(S.fs.rep==="Y"){
    h+=row("Name of the representative assessee",inp("fs.repName"),{req:1,ind:1,ref:"G115"});
    h+=row("Email-ID of the representative assessee",inp("fs.repEmail"),{req:1,ind:1,ref:"N116",hint:"must differ from the taxpayer's primary email"});
    h+=row("Contact number of the representative assessee",inp("fs.repMobile",{n:1}),{req:1,ind:1,ref:"N117",hint:"must differ from the taxpayer's primary mobile"});
  }

  /* ---- Audit information — PartA_GEN2 (rows 151-193) ---- */
  h+=sub("Audit information");
  h+=row("a1 · Are you liable to maintain accounts as per section 44AA?",sel("aud.sec44AA",YN,{blank:false}),{req:1,ref:"F151"});
  h+=row("a2 · Are you declaring income only under section 44AE/44B/44BB/44AD/44ADA/44BBA/44BBC/44BBD/44DA?",
    sel("aud.incDclrdUs",YN,{blank:false}),{req:1,ref:"F152"});
  if(S.aud.incDclrdUs==="N"){
    h+=row("a2i · Range of total sales / turnover / gross receipts of business",sel("aud.salesBand",SALES_BAND),{ind:1,ref:"F153"});
    if(S.aud.salesBand==="Upto10CR"){
      h+=row("a2ii · Percentage of aggregate of all amounts received (incl. sales/turnover) in cash",sel("aud.pctRcvd",PCT_BAND),{ind:1,req:1,ref:"F154"});
      h+=row("a2iii · Percentage of aggregate of all payments made (incl. expenditure) in cash",sel("aud.pctPaid",PCT_BAND),{ind:1,req:1,ref:"F155"});
    }
  }
  h+=row("b · Are you liable for audit under section 44AB?",sel("aud.sec44AB",YN,{blank:false}),{req:1,ref:"F156"});
  if(S.aud.sec44AB==="Y"){
    h+=row("Condition by virtue of which liable for audit u/s 44AB",sel("aud.cnd44AB",CND_44AB),{ind:1,req:1,ref:"F157"});
    h+=row("c · Have the accounts been audited by an accountant?",sel("aud.acctFlg",YN),{ind:1,ref:"F161"});
    if(S.aud.acctFlg==="Y"){
      h+=row("Date of furnishing of the audit report",dte("aud.repDate"),{ind:1,req:1,ref:"G162",hint:"cannot be after today"});
      h+=row("Acknowledgement number of the audit report",inp("aud.repAck",{max:15}),{ind:1,req:1,ref:"N163"});
      h+=row("Name of the auditor (proprietorship / firm)",inp("aud.frmName"),{ind:1,req:1,ref:"G166"});
      h+=row("PAN of the proprietorship / firm",inp("aud.frmPAN",{max:10}),{ind:1,ref:"G168"});
      h+=row("Aadhaar of the proprietorship",inp("aud.frmAadhaar",{max:12}),{ind:1,ref:"G169"});
    }
  }
  h+=row("d(i) · Are you liable for audit u/s 92E?",sel("aud.sec92E",YN,{blank:false}),{req:1,ref:"F173"});
  if(S.aud.sec92E==="Y"){
    h+=row("d(ii) · Have the accounts been audited u/s 92E?",sel("aud.acct92E",YN,{blank:false}),{ind:1,req:1,ref:"W173"});
    if(S.aud.acct92E==="Y"){
      h+=row("Date of audit report (92E)",dte("aud.date92E"),{ind:1,req:1,ref:"E174"});
      h+=row("Acknowledgement number (92E)",inp("aud.ack92E",{max:15}),{ind:1,req:1,ref:"E175"});
    }
  }
  h+=fold("audoth","d(iii)","Other audit reports furnished under the Income-tax Act",
    (S.aud.oth||[]).length?(S.aud.oth||[]).length+" rows":"if any",
    grid("aud.oth",[
      {k:"sec",h:"Section code",t:"sel",w:"140px",req:1,opts:AUD_SEC},
      {k:"flag",h:"Furnished?",t:"sel",w:"110px",opts:YN},
      {k:"date",h:"Date",t:"date",w:"150px"},
      {k:"ack",h:"Acknowledgement number",t:"txt",w:"180px",max:15}],
      S.aud.oth||[],{min:"640px",empty:"No other audit report.",add:"Add an audit report"}));
  h+=fold("audact","Other Act","Audits under an Act other than the Income-tax Act",
    (S.aud.act||[]).length?(S.aud.act||[]).length+" rows":"if any",
    grid("aud.act",[
      {k:"act",h:"Act",t:"sel",w:"320px",req:1,opts:AUD_ACT},
      {k:"actOther",h:"If others, specify",t:"txt",w:"180px"},
      {k:"sec",h:"Section",t:"txt",w:"120px"},
      {k:"date",h:"Date of audit report",t:"date",w:"150px"}],
      S.aud.act||[],{min:"820px",empty:"No other-Act audit.",add:"Add an audit"}));

  /* ---- Nature of business ---- */
  h+=sub("Nature of business or profession");
  h+=grid("nob",[
    {k:"code",h:"Code",t:"txt",w:"110px",req:1,ph:"e.g. 09028",max:5},
    {k:"trade",h:"Trade name",t:"txt",w:"240px"},
    {k:"desc",h:"Description",t:"txt",w:"320px"}],
    S.nob||[],{min:"720px",empty:"Add at least one nature of business.",add:"Add a business"});
  h+=note("Codes are the department's NatureOfBusiness list (357 entries); enter the five-digit code as it appears in the utility.");

  return h;
}

/* =====================================================================
   EXPORT — expRet(j): write PartA_GEN1 and PartA_GEN2 onto j.
   put() skips empty values; the SKEL skeleton keeps required leaves present.
   ===================================================================== */
function expRet(j){
  const ind=S.pi.status!=="H";
  /* ---------- PartA_GEN1 · PersonalInfo (collected on the "who" screen) -- */
  if(ind){
    put(j,"PartA_GEN1.PersonalInfo.AssesseeName.FirstName",sv(S.pi.first));
    put(j,"PartA_GEN1.PersonalInfo.AssesseeName.MiddleName",sv(S.pi.mid));
  }
  put(j,"PartA_GEN1.PersonalInfo.AssesseeName.SurNameOrOrgName",sv(S.pi.last));
  put(j,"PartA_GEN1.PersonalInfo.PAN",sv(S.pi.pan&&String(S.pi.pan).toUpperCase()));
  put(j,"PartA_GEN1.PersonalInfo.Address.ResidenceNo",sv(S.pi.addr1));
  put(j,"PartA_GEN1.PersonalInfo.Address.ResidenceName",sv(S.pi.premises));
  put(j,"PartA_GEN1.PersonalInfo.Address.RoadOrStreet",sv(S.pi.road));
  put(j,"PartA_GEN1.PersonalInfo.Address.LocalityOrArea",sv(S.pi.locality));
  put(j,"PartA_GEN1.PersonalInfo.Address.CityOrTownOrDistrict",sv(S.pi.city));
  put(j,"PartA_GEN1.PersonalInfo.Address.StateCode",sv(S.pi.state));
  put(j,"PartA_GEN1.PersonalInfo.Address.CountryCode",sv(S.pi.country||"91"));
  if(S.pi.pin) put(j,"PartA_GEN1.PersonalInfo.Address.PinCode",R(S.pi.pin));
  if(S.pi.std) put(j,"PartA_GEN1.PersonalInfo.Address.Phone.STDcode",R(S.pi.std));
  put(j,"PartA_GEN1.PersonalInfo.Address.Phone.PhoneNo",sv(S.pi.phone));
  if(S.pi.mobcc!=null&&S.pi.mobcc!=="") put(j,"PartA_GEN1.PersonalInfo.Address.CountryCodeMobile",R(S.pi.mobcc||91));
  else if(S.pi.mobile) put(j,"PartA_GEN1.PersonalInfo.Address.CountryCodeMobile",91);
  if(S.pi.mobile) put(j,"PartA_GEN1.PersonalInfo.Address.MobileNo",R(S.pi.mobile));
  put(j,"PartA_GEN1.PersonalInfo.Address.EmailAddress",sv(S.pi.email));
  put(j,"PartA_GEN1.PersonalInfo.Address.EmailAddressSec",sv(S.pi.email2));
  put(j,"PartA_GEN1.PersonalInfo.SecondaryAdd",sv(S.pi.addr2same||"Y"));
  put(j,"PartA_GEN1.PersonalInfo.DOB",ISO(S.pi.dob));
  put(j,"PartA_GEN1.PersonalInfo.Status",sv(S.pi.status||"I"));
  if(S.pi.bizStart) put(j,"PartA_GEN1.PersonalInfo.DateofBusCommencement",ISO(S.pi.bizStart));
  if(ind&&S.pi.aadhaar) put(j,"PartA_GEN1.PersonalInfo.AadhaarCardNo",sv(S.pi.aadhaar));

  /* ---------- PartA_GEN1 · FilingStatus ---------- */
  put(j,"PartA_GEN1.FilingStatus.ReturnFileSec",R(S.fs.sec||11));
  put(j,"PartA_GEN1.FilingStatus.IncFrmBusOrProf",sv(S.fs.incBP||"Y"));
  put(j,"PartA_GEN1.FilingStatus.OptOldRegimeCurrAY",S.fs.optout==="Yes"?"Y":"N");
  /* Form 10-IEA — current AY, old regime (business filer opting out) */
  if(S.fs.optout==="Yes"&&S.fs.incBP==="Y"){
    put(j,"PartA_GEN1.FilingStatus.F10IEACurrAYOldRegime","Y");
    put(j,"PartA_GEN1.FilingStatus.F10IEADateCurrAYOldTax",ISO(S.fs.f10ieaDate));
    if(S.fs.f10ieaAck) put(j,"PartA_GEN1.FilingStatus.F10IEAAckNoCurrAYOldTax",R(S.fs.f10ieaAck));
  }
  if(S.fs.f10ieaEarlier){
    put(j,"PartA_GEN1.FilingStatus.Form10IEAEarlierAYOldRegime",sv(S.fs.f10ieaEarlier));
    put(j,"PartA_GEN1.FilingStatus.Form10IEAAssYear",sv(S.fs.f10ieaEarlierAY));
    if(S.fs.f10ieaEarlierAck) put(j,"PartA_GEN1.FilingStatus.Form10IEAEarlierAYAckOldRegime",R(S.fs.f10ieaEarlierAck));
  }
  put(j,"PartA_GEN1.FilingStatus.SeventhProvisio139",sv(S.decl.flag||"N"));
  if(S.decl.flag==="Y"){
    put(j,"PartA_GEN1.FilingStatus.DepAmtAggAmtExcd1CrPrYrFlg",sv(S.decl.dep_f));
    if(S.decl.dep) put(j,"PartA_GEN1.FilingStatus.AmtSeventhProvisio139i",R(S.decl.dep));
    put(j,"PartA_GEN1.FilingStatus.IncrExpAggAmt2LkTrvFrgnCntryFlg",sv(S.decl.trv_f));
    if(S.decl.trv) put(j,"PartA_GEN1.FilingStatus.AmtSeventhProvisio139ii",R(S.decl.trv));
    put(j,"PartA_GEN1.FilingStatus.IncrExpAggAmt1LkElctrctyPrYrFlg",sv(S.decl.ele_f));
    if(S.decl.ele) put(j,"PartA_GEN1.FilingStatus.AmtSeventhProvisio139iii",R(S.decl.ele));
    put(j,"PartA_GEN1.FilingStatus.clauseiv7provisio139i",sv(S.decl.c4_f));
    if(S.decl.c4_f==="Y") (S.decl.c4||[]).forEach((r,i)=>{
      put(j,"PartA_GEN1.FilingStatus.clauseiv7provisio139iDtls."+i+".clauseiv7provisio139iNature",sv(r.nature));
      put(j,"PartA_GEN1.FilingStatus.clauseiv7provisio139iDtls."+i+".clauseiv7provisio139iAmount",R(r.amt));
    });
  }
  if(RET_NOTICE.indexOf(+S.fs.sec)>=0){
    put(j,"PartA_GEN1.FilingStatus.NoticeNo",sv(S.fs.din));
    put(j,"PartA_GEN1.FilingStatus.NoticeDate",ISO(S.fs.noticedate));
  }
  if(RET_ORIG.indexOf(+S.fs.sec)>=0){
    put(j,"PartA_GEN1.FilingStatus.ReceiptNo",sv(S.fs.receipt));
    put(j,"PartA_GEN1.FilingStatus.OrigRetFiledDate",ISO(S.fs.origdate));
  }
  put(j,"PartA_GEN1.FilingStatus.ResidentialStatus",sv(S.fs.resStatus||"RES"));
  if(S.pi.status!=="H"&&S.fs.resStatus==="RES") put(j,"PartA_GEN1.FilingStatus.BenefitUs115HFlg",sv(S.fs.b115H));
  /* Representative */
  put(j,"PartA_GEN1.FilingStatus.AsseseeRepFlg",sv(S.fs.rep||"N"));
  if(S.fs.rep==="Y"){
    put(j,"PartA_GEN1.FilingStatus.AssesseeRep.RepName",sv(S.fs.repName));
    put(j,"PartA_GEN1.FilingStatus.AssesseeRep.RepEmailID",sv(S.fs.repEmail));
    if(S.fs.repMobile){
      put(j,"PartA_GEN1.FilingStatus.AssesseeRep.CountryCodeRepMobileNo",91);
      put(j,"PartA_GEN1.FilingStatus.AssesseeRep.RepMobileNo",R(S.fs.repMobile));
    }
  }
  /* Directorship */
  put(j,"PartA_GEN1.FilingStatus.CompDirectorPrvYrFlg",sv(S.fs.dir||"N"));
  if(S.fs.dir==="Y") (S.pi.dirco||[]).forEach((r,i)=>{
    const b="PartA_GEN1.FilingStatus.CompDirectorPrvYr.CompDirectorPrvYrDtls."+i+".";
    put(j,b+"NameOfCompany",sv(r.name));
    put(j,b+"CompanyType",sv(r.type||"D"));
    put(j,b+"PAN",sv(r.pan&&String(r.pan).toUpperCase()));
    put(j,b+"SharesTypes",sv(r.listed||"L"));
    put(j,b+"DIN",sv(r.din));
  });
  /* Partnership */
  put(j,"PartA_GEN1.FilingStatus.PartnerInFirmFlg",sv(S.fs.partner||"N"));
  if(S.fs.partner==="Y") (S.pi.firms||[]).forEach((r,i)=>{
    const b="PartA_GEN1.FilingStatus.PartnerInFirm.PartnerInFirmDtls."+i+".";
    put(j,b+"NameOfFirm",sv(r.name));
    put(j,b+"PAN",sv(r.pan&&String(r.pan).toUpperCase()));
  });
  /* Unlisted equity shares */
  put(j,"PartA_GEN1.FilingStatus.HeldUnlistedEqShrPrYrFlg",sv(S.fs.unl||"N"));
  if(S.fs.unl==="Y") (S.pi.unlco||[]).forEach((r,i)=>{
    const b="PartA_GEN1.FilingStatus.HeldUnlistedEqShrPrYr.HeldUnlistedEqShrPrYrDtls."+i+".";
    put(j,b+"NameOfCompany",sv(r.name));
    put(j,b+"CompanyType",sv(r.type||"D"));
    put(j,b+"PAN",sv(r.pan&&String(r.pan).toUpperCase()));
    put(j,b+"OpngBalNumberOfShares",R(r.obNo));
    put(j,b+"OpngBalCostOfAcquisition",R(r.obCost));
    if(r.acqNo) put(j,b+"ShrAcqDurYrNumberOfShares",R(r.acqNo));
    put(j,b+"ClsngBalNumberOfShares",R(r.cbNo));
    put(j,b+"ClsngBalCostOfAcquisition",R(r.cbCost));
  });
  /* Non-resident PE/SEP */
  if(S.fs.resStatus!=="RES"){
    put(j,"PartA_GEN1.FilingStatus.NriPEinIndia",sv(S.fs.nriPE));
    put(j,"PartA_GEN1.FilingStatus.NriSEPinIndia",sv(S.fs.nriSEP));
    if(S.fs.nriSEP==="Y"){
      if(S.fs.sepPay) put(j,"PartA_GEN1.FilingStatus.AggrPaymentTransac",R(S.fs.sepPay));
      if(S.fs.sepUsers) put(j,"PartA_GEN1.FilingStatus.NumberOfUsers",R(S.fs.sepUsers));
    }
  }
  put(j,"PartA_GEN1.FilingStatus.ForeignExchangeFlag",sv(S.fs.foreignExch||"N"));
  put(j,"PartA_GEN1.FilingStatus.FiiFpiFlag",sv(S.fs.fpi||"N"));
  if(S.fs.fpi==="Y") put(j,"PartA_GEN1.FilingStatus.SebiRegnNo",sv(S.fs.sebi));
  put(j,"PartA_GEN1.FilingStatus.ItrFilingDueDate",sv(S.fs.duedate||"2026-10-31"));
  if(S.fs.lei){
    put(j,"PartA_GEN1.FilingStatus.LEIDtls.LEINumber",sv(String(S.fs.lei).toUpperCase()));
    put(j,"PartA_GEN1.FilingStatus.LEIDtls.ValidUptoDate",ISO(S.fs.leiValid));
  }

  /* ---------- PartA_GEN2 · AuditInfo ---------- */
  put(j,"PartA_GEN2.AuditInfo.LiableSec44AAflg",sv(S.aud.sec44AA||"N"));
  put(j,"PartA_GEN2.AuditInfo.IncDclrdUs",sv(S.aud.incDclrdUs||"N"));
  if(S.aud.incDclrdUs==="N"){
    put(j,"PartA_GEN2.AuditInfo.TotalSalesExcOneCr",sv(S.aud.salesBand));
    if(S.aud.salesBand==="Upto10CR"){
      put(j,"PartA_GEN2.AuditInfo.AgrOFAllAmtsRcvd",sv(S.aud.pctRcvd));
      put(j,"PartA_GEN2.AuditInfo.AgrOFAllPayMade",sv(S.aud.pctPaid));
    }
  }
  put(j,"PartA_GEN2.AuditInfo.LiableSec44ABflg",sv(S.aud.sec44AB||"N"));
  if(S.aud.sec44AB==="Y"){
    put(j,"PartA_GEN2.AuditInfo.Cndnfor44AB",sv(S.aud.cnd44AB));
    put(j,"PartA_GEN2.AuditInfo.AuditAccountantFlg",sv(S.aud.acctFlg));
    if(S.aud.acctFlg==="Y"){
      put(j,"PartA_GEN2.AuditInfo.AuditReportFurnishDate",ISO(S.aud.repDate));
      if(S.aud.repAck) put(j,"PartA_GEN2.AuditInfo.AckNum44AB",R(S.aud.repAck));
      put(j,"PartA_GEN2.AuditInfo.AudFrmName",sv(S.aud.frmName));
      put(j,"PartA_GEN2.AuditInfo.AudFrmPAN",sv(S.aud.frmPAN&&String(S.aud.frmPAN).toUpperCase()));
      put(j,"PartA_GEN2.AuditInfo.AudFrmAadhaar",sv(S.aud.frmAadhaar));
    }
  }
  put(j,"PartA_GEN2.AuditInfo.LiableSec92Eflg",sv(S.aud.sec92E||"N"));
  put(j,"PartA_GEN2.AuditInfo.AccountAuditFlag",S.aud.sec92E==="Y"?sv(S.aud.acct92E||"N"):"N");
  if(S.aud.sec92E==="Y"&&S.aud.acct92E==="Y"){
    put(j,"PartA_GEN2.AuditInfo.AuditDetails92E.DateOfAudit",ISO(S.aud.date92E));
    if(S.aud.ack92E) put(j,"PartA_GEN2.AuditInfo.AuditDetails92E.AckNum92E",R(S.aud.ack92E));
  }
  (S.aud.oth||[]).forEach((r,i)=>{
    const b="PartA_GEN2.AuditInfo.AuditDetails."+i+".";
    put(j,b+"AuditedSection",sv(r.sec));
    put(j,b+"AuditFlag",sv(r.flag));
    put(j,b+"DateOfAudit",ISO(r.date));
    if(r.ack) put(j,b+"AckNumOth",R(r.ack));
  });
  (S.aud.act||[]).forEach((r,i)=>{
    const b="PartA_GEN2.AuditInfo.AuditReportDetails."+i+".";
    put(j,b+"AuditReportAct",sv(r.act));
    put(j,b+"AuditReportActOthers",sv(r.actOther));
    put(j,b+"AuditedSection",sv(r.sec));
    put(j,b+"DateOfAudit",ISO(r.date));
  });
  /* ---------- PartA_GEN2 · NatOfBus ---------- */
  (S.nob||[]).forEach((r,i)=>{
    const b="PartA_GEN2.NatOfBus.NatureOfBusiness."+i+".";
    put(j,b+"Code",sv(r.code));
    put(j,b+"TradeName1",sv(r.trade));
    put(j,b+"Description",sv(r.desc));
  });
}

/* =====================================================================
   IMPORT — impRet(I3): inverse of expRet. Returns short labels read.
   ===================================================================== */
function impRet(I3){
  const read=[];
  const g1=(I3&&I3.PartA_GEN1)||{}, PI=g1.PersonalInfo||{}, AD=PI.Address||{}, FS=g1.FilingStatus||{};
  const g2=(I3&&I3.PartA_GEN2)||{}, AU=g2.AuditInfo||{}, NB=g2.NatOfBus||{};

  if(PI.AssesseeName){
    if(PI.AssesseeName.FirstName!=null)S.pi.first=PI.AssesseeName.FirstName;
    if(PI.AssesseeName.MiddleName!=null)S.pi.mid=PI.AssesseeName.MiddleName;
    if(PI.AssesseeName.SurNameOrOrgName!=null)S.pi.last=PI.AssesseeName.SurNameOrOrgName;
    read.push("name");
  }
  if(PI.PAN){S.pi.pan=PI.PAN;read.push("PAN");}
  if(Object.keys(AD).length){
    if(AD.ResidenceNo!=null)S.pi.addr1=AD.ResidenceNo;
    if(AD.ResidenceName!=null)S.pi.premises=AD.ResidenceName;
    if(AD.RoadOrStreet!=null)S.pi.road=AD.RoadOrStreet;
    if(AD.LocalityOrArea!=null)S.pi.locality=AD.LocalityOrArea;
    if(AD.CityOrTownOrDistrict!=null)S.pi.city=AD.CityOrTownOrDistrict;
    if(AD.StateCode!=null)S.pi.state=AD.StateCode;
    if(AD.CountryCode!=null)S.pi.country=AD.CountryCode;
    if(AD.PinCode!=null)S.pi.pin=String(AD.PinCode);
    if(AD.MobileNo!=null)S.pi.mobile=String(AD.MobileNo);
    if(AD.EmailAddress!=null)S.pi.email=AD.EmailAddress;
    if(AD.EmailAddressSec!=null)S.pi.email2=AD.EmailAddressSec;
    read.push("address");
  }
  if(PI.SecondaryAdd!=null)S.pi.addr2same=PI.SecondaryAdd;
  if(PI.DOB)S.pi.dob=dmy(PI.DOB)||S.pi.dob;
  if(PI.Status)S.pi.status=PI.Status;
  if(PI.DateofBusCommencement)S.pi.bizStart=dmy(PI.DateofBusCommencement);
  if(PI.AadhaarCardNo)S.pi.aadhaar=PI.AadhaarCardNo;

  if(FS.ReturnFileSec!=null){S.fs.sec=FS.ReturnFileSec;read.push("filing section");}
  if(FS.IncFrmBusOrProf!=null)S.fs.incBP=FS.IncFrmBusOrProf;
  if(FS.OptOldRegimeCurrAY!=null){S.fs.optout=(FS.OptOldRegimeCurrAY==="Y")?"Yes":"No";read.push("regime");}
  if(FS.F10IEADateCurrAYOldTax)S.fs.f10ieaDate=dmy(FS.F10IEADateCurrAYOldTax);
  if(FS.F10IEAAckNoCurrAYOldTax!=null)S.fs.f10ieaAck=String(FS.F10IEAAckNoCurrAYOldTax);
  if(FS.Form10IEAEarlierAYOldRegime!=null)S.fs.f10ieaEarlier=FS.Form10IEAEarlierAYOldRegime;
  if(FS.Form10IEAAssYear!=null)S.fs.f10ieaEarlierAY=FS.Form10IEAAssYear;
  if(FS.Form10IEAEarlierAYAckOldRegime!=null)S.fs.f10ieaEarlierAck=String(FS.Form10IEAEarlierAYAckOldRegime);
  if(FS.SeventhProvisio139!=null){S.decl.flag=FS.SeventhProvisio139;
    S.decl.dep_f=FS.DepAmtAggAmtExcd1CrPrYrFlg;S.decl.dep=FS.AmtSeventhProvisio139i;
    S.decl.trv_f=FS.IncrExpAggAmt2LkTrvFrgnCntryFlg;S.decl.trv=FS.AmtSeventhProvisio139ii;
    S.decl.ele_f=FS.IncrExpAggAmt1LkElctrctyPrYrFlg;S.decl.ele=FS.AmtSeventhProvisio139iii;
    S.decl.c4_f=FS.clauseiv7provisio139i;
    S.decl.c4=(FS.clauseiv7provisio139iDtls||[]).map(r=>({nature:r.clauseiv7provisio139iNature,amt:r.clauseiv7provisio139iAmount}));
  }
  if(FS.NoticeNo!=null)S.fs.din=FS.NoticeNo;
  if(FS.NoticeDate)S.fs.noticedate=dmy(FS.NoticeDate);
  if(FS.ReceiptNo!=null)S.fs.receipt=FS.ReceiptNo;
  if(FS.OrigRetFiledDate)S.fs.origdate=dmy(FS.OrigRetFiledDate);
  if(FS.ResidentialStatus!=null){S.fs.resStatus=FS.ResidentialStatus;read.push("residential status");}
  if(FS.BenefitUs115HFlg!=null)S.fs.b115H=FS.BenefitUs115HFlg;
  if(FS.AsseseeRepFlg!=null)S.fs.rep=FS.AsseseeRepFlg;
  if(FS.AssesseeRep){S.fs.repName=FS.AssesseeRep.RepName;S.fs.repEmail=FS.AssesseeRep.RepEmailID;
    if(FS.AssesseeRep.RepMobileNo!=null)S.fs.repMobile=String(FS.AssesseeRep.RepMobileNo);}
  if(FS.CompDirectorPrvYrFlg!=null)S.fs.dir=FS.CompDirectorPrvYrFlg;
  if(FS.CompDirectorPrvYr&&FS.CompDirectorPrvYr.CompDirectorPrvYrDtls){
    S.pi.dirco=FS.CompDirectorPrvYr.CompDirectorPrvYrDtls.map(r=>({name:r.NameOfCompany,type:r.CompanyType,pan:r.PAN,listed:r.SharesTypes,din:r.DIN}));
    read.push("directorships");
  }
  if(FS.PartnerInFirmFlg!=null)S.fs.partner=FS.PartnerInFirmFlg;
  if(FS.PartnerInFirm&&FS.PartnerInFirm.PartnerInFirmDtls){
    S.pi.firms=FS.PartnerInFirm.PartnerInFirmDtls.map(r=>({name:r.NameOfFirm,pan:r.PAN}));
    read.push("partnerships");
  }
  if(FS.HeldUnlistedEqShrPrYrFlg!=null)S.fs.unl=FS.HeldUnlistedEqShrPrYrFlg;
  if(FS.HeldUnlistedEqShrPrYr&&FS.HeldUnlistedEqShrPrYr.HeldUnlistedEqShrPrYrDtls){
    S.pi.unlco=FS.HeldUnlistedEqShrPrYr.HeldUnlistedEqShrPrYrDtls.map(r=>({
      name:r.NameOfCompany,type:r.CompanyType,pan:r.PAN,obNo:r.OpngBalNumberOfShares,
      obCost:r.OpngBalCostOfAcquisition,acqNo:r.ShrAcqDurYrNumberOfShares,
      cbNo:r.ClsngBalNumberOfShares,cbCost:r.ClsngBalCostOfAcquisition}));
    read.push("unlisted shares");
  }
  if(FS.NriPEinIndia!=null)S.fs.nriPE=FS.NriPEinIndia;
  if(FS.NriSEPinIndia!=null)S.fs.nriSEP=FS.NriSEPinIndia;
  if(FS.AggrPaymentTransac!=null)S.fs.sepPay=FS.AggrPaymentTransac;
  if(FS.NumberOfUsers!=null)S.fs.sepUsers=FS.NumberOfUsers;
  if(FS.ForeignExchangeFlag!=null)S.fs.foreignExch=FS.ForeignExchangeFlag;
  if(FS.FiiFpiFlag!=null)S.fs.fpi=FS.FiiFpiFlag;
  if(FS.SebiRegnNo!=null)S.fs.sebi=FS.SebiRegnNo;
  if(FS.ItrFilingDueDate!=null)S.fs.duedate=FS.ItrFilingDueDate;
  if(FS.LEIDtls){S.fs.lei=FS.LEIDtls.LEINumber;if(FS.LEIDtls.ValidUptoDate)S.fs.leiValid=dmy(FS.LEIDtls.ValidUptoDate);}

  if(Object.keys(AU).length){
    if(AU.LiableSec44AAflg!=null)S.aud.sec44AA=AU.LiableSec44AAflg;
    if(AU.IncDclrdUs!=null)S.aud.incDclrdUs=AU.IncDclrdUs;
    if(AU.TotalSalesExcOneCr!=null)S.aud.salesBand=AU.TotalSalesExcOneCr;
    if(AU.AgrOFAllAmtsRcvd!=null)S.aud.pctRcvd=AU.AgrOFAllAmtsRcvd;
    if(AU.AgrOFAllPayMade!=null)S.aud.pctPaid=AU.AgrOFAllPayMade;
    if(AU.LiableSec44ABflg!=null)S.aud.sec44AB=AU.LiableSec44ABflg;
    if(AU.Cndnfor44AB!=null)S.aud.cnd44AB=AU.Cndnfor44AB;
    if(AU.AuditAccountantFlg!=null)S.aud.acctFlg=AU.AuditAccountantFlg;
    if(AU.AuditReportFurnishDate)S.aud.repDate=dmy(AU.AuditReportFurnishDate);
    if(AU.AckNum44AB!=null)S.aud.repAck=String(AU.AckNum44AB);
    if(AU.AudFrmName!=null)S.aud.frmName=AU.AudFrmName;
    if(AU.AudFrmPAN!=null)S.aud.frmPAN=AU.AudFrmPAN;
    if(AU.AudFrmAadhaar!=null)S.aud.frmAadhaar=AU.AudFrmAadhaar;
    if(AU.LiableSec92Eflg!=null)S.aud.sec92E=AU.LiableSec92Eflg;
    if(AU.AccountAuditFlag!=null)S.aud.acct92E=AU.AccountAuditFlag;
    if(AU.AuditDetails92E){if(AU.AuditDetails92E.DateOfAudit)S.aud.date92E=dmy(AU.AuditDetails92E.DateOfAudit);
      if(AU.AuditDetails92E.AckNum92E!=null)S.aud.ack92E=String(AU.AuditDetails92E.AckNum92E);}
    if(Array.isArray(AU.AuditDetails))S.aud.oth=AU.AuditDetails.map(r=>({sec:r.AuditedSection,flag:r.AuditFlag,date:dmy(r.DateOfAudit),ack:r.AckNumOth}));
    if(Array.isArray(AU.AuditReportDetails))S.aud.act=AU.AuditReportDetails.map(r=>({act:r.AuditReportAct,actOther:r.AuditReportActOthers,sec:r.AuditedSection,date:dmy(r.DateOfAudit)}));
    read.push("audit information");
  }
  if(NB.NatureOfBusiness&&Array.isArray(NB.NatureOfBusiness)){
    S.nob=NB.NatureOfBusiness.map(r=>({code:r.Code,trade:r.TradeName1,desc:r.Description}));
    read.push("nature of business");
  }
  return read;
}

/* =====================================================================
   CHECKS — chkRet(): the sheet's own rules as live messages.
   ===================================================================== */
function chkRet(){
  const out=[], sec=+S.fs.sec;
  /* Notice / order sections → DIN + date mandatory (rules.json, rows 34-35) */
  if(RET_NOTICE.indexOf(sec)>=0){
    if(!st0(S.fs.din)) out.push({lvl:"err",t:"DIN required",m:"A return filed under 142(1)/148/153C/139(9) or an order u/s 119(2)(b) needs the Unique Number / Document Identification Number.",sec:"ret"});
    if(!D(S.fs.noticedate)) out.push({lvl:"err",t:"Notice date required",m:"Enter the date of the notice or order.",sec:"ret"});
  }
  if(RET_ORIG.indexOf(sec)>=0){
    if(!st0(S.fs.receipt)) out.push({lvl:"err",t:"Receipt number required",m:"A revised (139(5)) or modified (92CD) return needs the receipt number of the original return.",sec:"ret"});
    if(!D(S.fs.origdate)) out.push({lvl:"err",t:"Original-return date required",m:"Enter the date of filing of the original return.",sec:"ret"});
  }
  /* Regime: opting old with business income needs Form 10-IEA (A45) */
  if(S.fs.optout==="Yes"&&S.fs.incBP==="Y"){
    if(!st0(S.fs.f10ieaAck)) out.push({lvl:"err",t:"Form 10-IEA acknowledgement required",m:"A business filer opts out of the new regime only through Form 10-IEA — furnish its acknowledgement number.",sec:"ret"});
    if(!D(S.fs.f10ieaDate)) out.push({lvl:"err",t:"Form 10-IEA date required",m:"Furnish the date of filing of Form 10-IEA for AY 2026-27.",sec:"ret"});
    /* old regime cannot be opted after the 139(1) due date */
    if(D(S.fs.filed)&&D(S.fs.duedate?dmy(S.fs.duedate):"")&&D(S.fs.filed)>D(dmy(S.fs.duedate)))
      out.push({lvl:"warn",t:"Old regime after due date",m:"The old regime under 115BAC(6) cannot be opted after the due date under 139(1).",sec:"ret"});
  }
  /* Yes-then-table gates */
  if(S.fs.dir==="Y"&&!(S.pi.dirco||[]).length) out.push({lvl:"err",t:"Director table empty",m:"You answered Yes to being a Director — list each company.",sec:"ret"});
  if(S.fs.partner==="Y"&&!(S.pi.firms||[]).length) out.push({lvl:"err",t:"Partner table empty",m:"You answered Yes to being a Partner — list each firm.",sec:"ret"});
  if(S.fs.unl==="Y"&&!(S.pi.unlco||[]).length) out.push({lvl:"err",t:"Unlisted-shares table empty",m:"You answered Yes to holding unlisted equity shares — fill the shares table.",sec:"ret"});
  if(S.fs.rep==="Y"){
    if(st0(S.fs.repEmail)&&st0(S.pi.email)&&st0(S.fs.repEmail).toLowerCase()===st0(S.pi.email).toLowerCase())
      out.push({lvl:"err",t:"Representative email clashes",m:"The representative's email must differ from the taxpayer's primary email.",sec:"ret"});
    if(st0(S.fs.repMobile)&&st0(S.pi.mobile)&&st0(S.fs.repMobile)===st0(S.pi.mobile))
      out.push({lvl:"err",t:"Representative contact clashes",m:"The representative's contact number must differ from the taxpayer's primary mobile.",sec:"ret"});
  }
  /* Audit: 44AB liable + accountant-audited → auditor / report mandatory; date not future */
  if(S.aud.sec44AB==="Y"){
    if(!st0(S.aud.cnd44AB)) out.push({lvl:"err",t:"44AB condition required",m:"Select the condition by virtue of which you are liable for audit u/s 44AB.",sec:"ret"});
    if(S.aud.acctFlg==="Y"){
      if(!D(S.aud.repDate)) out.push({lvl:"err",t:"Audit-report date required",m:"When accounts are audited by an accountant, the date of furnishing the audit report is mandatory.",sec:"ret"});
      else if(D(S.aud.repDate)>new Date()) out.push({lvl:"warn",t:"Audit-report date in the future",m:"The date of the audit report cannot be after the system date.",sec:"ret"});
      if(!st0(S.aud.repAck)) out.push({lvl:"err",t:"Audit-report acknowledgement required",m:"Enter the acknowledgement number of the 44AB audit report.",sec:"ret"});
      if(!st0(S.aud.frmName)) out.push({lvl:"err",t:"Auditor name required",m:"Enter the name of the auditor (proprietorship / firm).",sec:"ret"});
    }
  }
  /* a2i turnover band drives a2ii/a2iii; > 5% → liable to 44AB */
  if(S.aud.incDclrdUs==="N"&&S.aud.salesBand==="Upto10CR"){
    if(!st0(S.aud.pctRcvd)||!st0(S.aud.pctPaid))
      out.push({lvl:"err",t:"Cash-percentage required",m:"With turnover over ₹1 crore up to ₹10 crores, both a2ii and a2iii percentages must be filled.",sec:"ret"});
    else if((S.aud.pctRcvd==="MoreThan5Per"||S.aud.pctPaid==="MoreThan5Per")&&S.aud.sec44AB!=="Y")
      out.push({lvl:"warn",t:"Likely liable u/s 44AB",m:"Cash receipts or payments exceed 5% — the assessee is liable to audit u/s 44AB.",sec:"ret"});
  }
  if(S.aud.sec92E==="Y"&&S.aud.acct92E==="Y"){
    if(!D(S.aud.date92E)) out.push({lvl:"err",t:"92E audit date required",m:"Enter the date of the 92E audit report.",sec:"ret"});
    if(!st0(S.aud.ack92E)) out.push({lvl:"err",t:"92E acknowledgement required",m:"Enter the acknowledgement number of the 92E audit report.",sec:"ret"});
  }
  /* Nature of business is mandatory for a business filer (NatureOfBusiness[].Code) */
  if(S.fs.incBP==="Y"&&!(S.nob||[]).length)
    out.push({lvl:"err",t:"Nature of business required",m:"A filer with business/profession income must enter at least one nature-of-business code.",sec:"ret"});
  if(!out.length) out.push({lvl:"ok",t:"Return and regime",m:(S.fs.optout==="Yes"?"Old":"New")+" regime · filed under "+((RET_SEC.find(x=>+x[0]===sec)||["",""])[1]||"section "+sec)+".",sec:"ret"});
  return out;
}

reg({id:"ret", t:"Return and regime", ref:"Part A - General", f:secRet,
  s:()=>(S.fs.optout==="Yes"?"Old regime":"New regime")+(D(S.fs.filed)?" · filed "+DISP(D(S.fs.filed)):""),
  eng:engRet, exp:expRet, imp:impRet, chk:chkRet, order:6});
