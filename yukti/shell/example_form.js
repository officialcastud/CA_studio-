/* ===== a minimal form on the shell: proves the contract ===== */
window.FORM={id:"ITR-X",name:"ITR-X",ay:"2026-27",sw:"SW10000001",due:"2026-07-31"};
const S={meta:{app:"yukti",form:"ITR-X",ay:"2026-27",ver:1},pi:{status:"I",res:"RES",first:"",last:"",pan:"",dob:""},fs:{optout:"No",sec:11,filed:""},
  inc:{salary:"",other:""},bank:[],ver:{cap:"S"},open:{},C:{}};
const SEED={};
function compute(){const sal=N(S.inc.salary),oth=N(S.inc.other);S.C.gti=R(sal+oth);S.C.ti=Math.round(S.C.gti/10)*10;
  const tax=Math.max(0,S.C.ti-400000)*0.05;S.C.tax={gross:R(tax*1.04)};S.C.int={net:R(tax*1.04),balance:R(tax*1.04),refund:0,paid:0,total:0};S.C.checks=engChecks();}
function engChecks(){const c=[];if(!PAN_RE.test(st0(S.pi.pan).toUpperCase()))c.push({lvl:"err",t:"PAN",m:"A valid PAN is required.",sec:"who"});return c;}
function secWho(){let h=row("First name",inp("pi.first"),{req:1});h+=row("Last name",inp("pi.last"),{req:1});h+=row("PAN",inp("pi.pan",{max:10}),{req:1});h+=row("Date of birth",dte("pi.dob"),{req:1});return h;}
function secInc(){let h=row("Salary",inp("inc.salary",{n:1}));h+=row("Other income",inp("inc.other",{n:1}));h+=row("Gross total income",cell(S.C.gti),{cls:"grand"});return h;}
function secBank(){let h=grid("bank",[{k:"ifsc",h:"IFS code",t:"txt",w:"140px",max:11,req:1},{k:"acno",h:"Account number",t:"txt",w:"auto",req:1}],S.bank||[],{min:"500px",empty:"No account.",add:"Add an account"});
  h+=row("Name of the person verifying",inp("ver.name"),{req:1});h+=rulesPanel();h+='<div class="r"><div class="l"></div><div class="v"><button class="add" id="b_json2" style="margin:0">Export the return as JSON</button></div></div>';return h;}
const SECS=[{id:"who",t:"Who is filing",ref:"Part A",f:secWho,s:()=>S.pi.pan||"PAN"},{id:"inc",t:"Income",ref:"Schedule",f:secInc,s:()=>S.C.gti?CR(S.C.gti):"None"},{id:"bank",t:"Bank and verification",ref:"Part B-TTI",f:secBank,s:()=>(S.bank||[]).length+" accounts"}];
const SKEL={CreationInfo:{SWVersionNo:"1.0",SWCreatedBy:"SW10000000",JSONCreatedBy:"SW10000000",JSONCreationDate:"2026-01-01",IntermediaryCity:"Delhi",Digest:"-"},PartA_GEN1:{PersonalInfo:{PAN:"",AssesseeName:{}}},PartB_TTI:{}};
function buildReturn(){compute();const j=deep(SKEL);put(j,"PartA_GEN1.PersonalInfo.PAN",st0(S.pi.pan).toUpperCase());put(j,"PartA_GEN1.PersonalInfo.AssesseeName.FirstName",S.pi.first);put(j,"PartA_GEN1.PersonalInfo.AssesseeName.SurNameOrOrgName",S.pi.last);put(j,"PartB_TTI.GrossTotalIncome",S.C.gti);return {ITR:{ITRX:j}};}
function importReturn(I){S.pi.pan=RG(I,"PartA_GEN1.PersonalInfo.PAN","");S.pi.first=RG(I,"PartA_GEN1.PersonalInfo.AssesseeName.FirstName","");S.pi.last=RG(I,"PartA_GEN1.PersonalInfo.AssesseeName.SurNameOrOrgName","");return ["personal information"];}
function runRules(I,S_){const out=[];if(!RG(I,"PartA_GEN1.PersonalInfo.PAN",""))out.push({cat:"A",n:1,msg:"PAN is required."});return out;}
function auditRules(b){return [];}
