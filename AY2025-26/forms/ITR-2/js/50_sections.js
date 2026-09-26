"use strict";
/* ==================================================================
   6 · THE SIX RENDERERS (identical to ITR-1)
   ================================================================== */
function row(label,right,o){o=o||{};
  return '<div class="r'+(o.cls?" "+o.cls:"")+'">'+
   '<div class="l'+(o.req?" req":"")+'">'+(o.ind?'<span class="i1">':'')+label+(o.ind?'</span>':'')+
     (o.hint?'<span class="hint">'+esc(o.hint)+'</span>':'')+'</div>'+
   '<div class="ref">'+esc(o.ref||"")+'</div>'+
   (o.v2!==undefined?'<div class="v2">'+o.v2+'</div>':'')+
   '<div class="v">'+(right||"")+'</div></div>';}
const cell=(n,c)=>'<span class="c'+(R(n)===0?" zero":"")+(R(n)<0?" neg":"")+(c?" "+c:"")+'">'+F(n)+'</span>';
function inp(p,o){o=o||{};const v=get(p);
  return '<input class="f'+(o.n?" n":"")+'" data-p="'+p+'" value="'+
    esc(v==null?"":(o.n?(N(v)?N(v):""):v))+'"'+(o.ph?' placeholder="'+esc(o.ph)+'"':'')+
    (o.max?' maxlength="'+o.max+'"':'')+(o.dis?" disabled":"")+'>';}
function dte(p){return inp(p,{ph:DF,max:10})+'<span class="dt">'+DF+'</span>';}
function sel(p,opts,o){o=o||{};const v=get(p);
  return '<select class="f" data-p="'+p+'"'+(o.style?' style="'+o.style+'"':'')+'>'+
    (o.blank!==false?'<option value="">(Select)</option>':'')+
    opts.map(x=>{const a=Array.isArray(x)?x[0]:x,b=Array.isArray(x)?x[1]:x;
      return '<option value="'+esc(a)+'"'+(String(v==null?"":v)===String(a)?" selected":"")+
        '>'+esc(b)+'</option>';}).join("")+'</select>';}
const sub=t=>'<div class="r sub"><div class="l">'+esc(t)+'</div><div class="ref"></div><div class="v"></div></div>';
const note=(t,k)=>'<div class="note'+(k?" "+k:"")+'">'+t+'</div>';
const formNote=t=>note("<b>Form required.</b> "+t,"form");
function grid(key,cols,rows,o){o=o||{};
  let h='<div class="full"><table class="gt"'+(o.min?' style="min-width:'+o.min+'"':'')+'><thead><tr>';
  cols.forEach(c=>h+='<th'+(c.t==="txt"||c.t==="sel"||c.t==="date"?' class="l':' class="')+
    (c.req?" req":"")+'"'+(c.w?' style="width:'+c.w+'"':'')+'>'+esc(c.h)+
    (c.t==="date"?' <span style="font-weight:400;color:var(--ink-3)">'+DF+'</span>':'')+'</th>');
  h+='<th class="x"></th></tr></thead><tbody>';
  if(!rows.length)h+='<tr><td class="emp" colspan="'+(cols.length+1)+'">'+esc(o.empty||"Nothing entered.")+'</td></tr>';
  rows.forEach((r,i)=>{h+='<tr>';
    cols.forEach(c=>{const p=key+"."+i+"."+c.k;
      if(c.t==="calc")h+='<td class="num">'+cell(c.f?c.f(r,i):r[c.k])+'</td>';
      else if(c.t==="sel")h+='<td class="l">'+sel(p,c.opts,{style:"width:100%"})+'</td>';
      else if(c.t==="chk")h+='<td style="text-align:center"><input type="checkbox" data-chk="'+p+'"'+(r[c.k]==="Y"?" checked":"")+'></td>';
      else if(c.t==="num")h+='<td>'+inp(p,{n:1})+'</td>';
      else if(c.t==="date")h+='<td>'+inp(p,{ph:DF,max:10})+'</td>';
      else h+='<td>'+inp(p,{ph:c.ph,max:c.max})+'</td>';});
    h+='<td class="x"><button data-del="'+key+"."+i+'" title="Remove">'+TRASH+'</button></td></tr>';});
  h+='</tbody>';
  if(o.foot){h+='<tfoot><tr>';
    o.foot.forEach(f=>h+='<td'+(f.l?' class="l"':'')+(f.span?' colspan="'+f.span+'"':'')+'>'+(f.l?esc(f.v):F(f.v))+'</td>');
    h+='<td></td></tr></tfoot>';}
  return h+'</table></div><button class="add" data-add="'+key+'">'+esc(o.add||"Add a row")+'</button>';}
function card(id,title,status,inner){const on=!!S.open["c_"+id];
  return '<div class="card'+(on?" on":"")+'"><button class="ch" data-card="'+id+'">'+
    '<span class="sw"></span><span class="t">'+esc(title)+'</span>'+
    '<span class="st">'+(on?status:"Not claimed")+'</span></button>'+
    '<div class="cb">'+(on?inner:"")+'</div></div>';}
function blk(id,title,status,inner,delPath){const on=S.open["b_"+id]!==false;
  return '<div class="blk'+(on?" on":"")+'"><div class="bh">'+
    '<button class="bhx" data-blk="'+id+'"><span class="cv2">'+(on?"−":"+")+'</span>'+
    '<span class="t">'+esc(title)+'</span><span class="s">'+esc(status)+'</span></button>'+
    (delPath?'<button class="blkdel" data-del="'+delPath+'" title="Remove">'+TRASH+'</button>':'')+
    '</div><div class="bb">'+(on?inner:"")+'</div></div>';}


/* ==================================================================
   7 · THE SIXTEEN SECTIONS
   ================================================================== */
const SECS=[
 {id:"who",t:"Who is filing",ref:"Part A",f:secWho,
  s:()=>st0(S.pi.pan)?st0(S.pi.pan).toUpperCase():"Name, PAN, status, residence, address"},
 {id:"ret",t:"Return and regime",ref:"Part A",f:secRet,
  s:()=>(isNew()?"New regime":"Old regime")+(D(S.fs.filed)?" · filed "+DISP(D(S.fs.filed)):"")},
 {id:"sal",t:"Salary",ref:"Schedule S",f:secSal,
  s:()=>S.C.sal.income?"Income "+CR(S.C.sal.income):"Gross salary, exempt allowances, section 16"},
 {id:"cg",t:"Capital gains",ref:"Schedule CG",f:secCG,
  s:()=>!S.cg.on?"None":(S.C.cg.total?CR(S.C.cg.total):(S.cg.land||[]).length+" property")},
 {id:"os",t:"Other sources",ref:"Schedule OS",f:secOS,
  s:()=>!(S.os2&&S.os2.on)?"None":(S.C.os.nine?CR(S.C.os.nine):"Dividend, interest, gifts, special rates")},
 {id:"hp",t:"House property",ref:"Schedule HP",f:secHP,
  s:()=>!S.hp.on?"None":(S.C.hp.income<0?"Loss "+CR(-S.C.hp.income):
       S.C.hp.income?"Income "+CR(S.C.hp.income):S.hp.props.length+" property")},
 {id:"ded",t:"Deductions",ref:"Chapter VI-A",f:secDed,
  s:()=>S.C.via.allowed?"Allowed "+CR(S.C.via.allowed):(isNew()?"Almost none under the new regime":"Chapter VI-A")},
 {id:"loss",t:"Losses — set-off and carry-forward",ref:"CYLA · CFL",f:secLoss,
  s:()=>S.C.loss.cf.total?"Carried "+CR(S.C.loss.cf.total):(S.C.loss.totHPset+S.C.loss.totOSset+S.C.loss.totBFset?"Set off "+CR(S.C.loss.totHPset+S.C.loss.totOSset+S.C.loss.totBFset):"CYLA · BFLA · CFL")},
 {id:"paid",t:"Taxes paid",ref:"TDS · TCS · IT",f:secPaid,
  s:()=>S.C.int.paid?"Paid "+CR(S.C.int.paid):"TDS, TCS, advance and self-assessment"},
 {id:"ei",t:"Exempt income",ref:"Schedule EI",f:secEI,
  s:()=>S.C.ei2.total?CR(S.C.ei2.total):"Agricultural, other exempt, DTAA"},
 {id:"si",t:"Specified persons and special rates",ref:"SPI · SI",f:secSI,
  s:()=>S.C.si.totInc?CR(S.C.si.totInc):"Clubbed income · special-rate table"},
 {id:"fa",t:"Foreign income and assets",ref:"FSI · TR · FA",f:secFA,
  s:()=>((S.fsi2||[]).length||Object.keys(S.fa2||{}).some(k=>(S.fa2[k]||[]).length))?"Declared":"None"},
 {id:"al",t:"Assets and liabilities",ref:"Schedule AL",f:secAL,
  s:()=>S.C.al2.required?"Required — income over ₹1 crore":(S.C.al2.mov||S.C.al2.imm?"Declared":"Not required")},
 {id:"other",t:"Other schedules",ref:"5A · PTI · ESOP",f:secOther,
  s:()=>(S.C.pti.blocks||S.C.esop.due||S.pi.s5a==="Yes")?"Declared":"Spouse apportionment, pass-through, ESOP"},
 {id:"tax",t:"Part B — total income and tax",ref:"Part B-TI · TTI",f:secTax,
  s:()=>S.C.tax.gross?"Tax "+CR(S.C.int.net):"Lines 1 to 17, both parts"},
 {id:"bank",t:"Bank and verification",ref:"Part B-TTI",f:secBank,
  s:()=>S.bank.length?S.bank.length+" account"+(S.bank.length>1?"s":""):"Bank, who signs, export"}
];

/* ---------------- 1 · Who is filing — Part A General, from the book -- */
function secWho(){
  const ind=S.pi.status!=="H";let h="";
  /* ---- Block 1 · personal information ---- */
  h+=sub("Personal information");
  h+=row("Status",sel("pi.status",STATUS,{blank:false}),{req:1,hint:"I — individual, H — Hindu undivided family"});
  if(ind){
    h+=row("First name",inp("pi.first"),{req:1});
    h+=row("Middle name",inp("pi.mid"));
    h+=row("Last name",inp("pi.last"),{req:1});
  } else h+=row("Name of the Hindu undivided family",inp("pi.last"),{req:1});
  h+=row("PAN",inp("pi.pan",{max:10}),{req:1,hint:ind?"the fourth letter must be P":"the fourth letter must be H"});
  h+=row(ind?"Date of birth":"Date of formation",dte("pi.dob"),{req:1,hint:"on or before 31 March 2026"});
  if(ind){
    h+=row("Aadhaar number",inp("pi.aadhaar",{max:12}),{req:1,hint:"twelve digits"});
    h+=row("Aadhaar enrolment id",inp("pi.aadhenrol",{max:28}),{hint:"only where the number is not yet allotted — all 28 digits including the date and time"});
    h+=row("Passport number",inp("pi.passport"),{hint:"if available"});
  }
  /* ---- Block 2 · addresses ---- */
  h+=sub("Primary address — for communication");
  h+=row("Flat, door or block number",inp("pi.addr1"),{req:1});
  h+=row("Name of premises, building or village",inp("pi.premises"));
  h+=row("Road, street or post office",inp("pi.road"));
  h+=row("Area or locality",inp("pi.locality"),{req:1});
  h+=row("Town, city or district",inp("pi.city"),{req:1});
  h+=row("Country or region",sel("pi.country",COUNTRIES,{blank:false}),{req:1});
  if((S.pi.country||"91")==="91"){
    h+=row("State",sel("pi.state",Object.keys(STATE).map(k=>[k,STATE[k]])),{req:1});
    h+=row("PIN code",inp("pi.pin",{max:6}),{req:1,hint:"six digits"});
  } else {
    h+=row("State",sel("pi.state",[["99","Outside India"]],{blank:false}),{req:1});
    h+=row("Zip code",inp("pi.zip",{max:10}),{req:1});
  }
  h+=row("Is the secondary address the same as the primary?",sel("pi.addr2same",["Yes","No"],{blank:false}),{req:1});
  if(S.pi.addr2same==="No"){
    h+=sub("Secondary address");
    h+=row("Flat, door or block number",inp("pi.addr1b"),{req:1});
    h+=row("Name of premises, building or village",inp("pi.premisesb"));
    h+=row("Road, street or post office",inp("pi.roadb"));
    h+=row("Area or locality",inp("pi.localityb"),{req:1});
    h+=row("Town, city or district",inp("pi.cityb"),{req:1});
    h+=row("State",sel("pi.stateb",Object.keys(STATE).map(k=>[k,STATE[k]])),{req:1});
    h+=row("PIN code",inp("pi.pinb",{max:6}),{req:1});
  }
  /* ---- Block 3 · communication ---- */
  h+=sub("Details for communication");
  h+=row("Primary email of the taxpayer",inp("pi.email",{ph:"name@example.in"}),{req:1});
  h+=row("Secondary email",inp("pi.email2"));
  h+=row("Primary mobile of the taxpayer",inp("pi.mobile",{max:10}),{req:1,hint:"ten digits, country code 91"});
  h+=row("Secondary mobile",inp("pi.mobile2",{max:10}));
  h+=row("STD or ISD code",inp("pi.std",{max:5}));
  h+=row("Residential or office phone",inp("pi.phone",{max:12}));
  /* ---- Block 5 · residential status ---- */
  h+=sub("Residential status");
  h+=row("Residential status in India",sel("pi.res",RESIDENTIAL,{blank:false}),{req:1});
  if(ind){
    h+=row("Condition for the residential status",sel("pi.rescond",RESCOND.map(c=>[c[0],c[0]+" — "+c[1]])),
      {req:1,hint:"pick the one that applies; it has to agree with the status above"});
    const rc=RESCOND.find(c=>c[0]===S.pi.rescond);
    if(rc&&rc[2]!==S.pi.res)
      h+=note("Condition "+rc[0]+" makes the person <b>"+(RESIDENTIAL.find(r=>r[0]===rc[2])||["",""])[1]+
        "</b>, but the status above says otherwise. One of the two is wrong.","stop");
  }
  if(S.pi.res!=="RES"){
    h+=sub("(i) Jurisdictions of residence during the year");
    h+=grid("pi.juris",[{k:"country",h:"Jurisdiction of residence",t:"sel",w:"260px",req:1,opts:COUNTRIES},
      {k:"tin",h:"Taxpayer identification number",t:"txt",w:"auto",req:1}],
      S.pi.juris||[],{min:"640px",empty:"No jurisdiction listed.",add:"Add a jurisdiction"});
    if(ind){
      h+=sub("(ii) For a citizen of India or a person of Indian origin");
      h+=row("Total period of stay in India during the year, in days",inp("pi.days1",{n:1}),{req:1});
      h+=row("Total period of stay in India during the 4 preceding years, in days",inp("pi.days4",{n:1}),{req:1});
    }
    h+=row("Is there a permanent establishment in India?",sel("pi.pe",["No","Yes"],{blank:false}),{req:1});
  }
  /* ---- Block 8 · other particulars ---- */
  h+=sub("Other particulars");
  if(S.pi.res==="RES")h+=row("Do you want to claim the benefit under section 115H?",sel("pi.s115h",["No","Yes"],{blank:false}),
    {hint:"a resident who was a non-resident Indian earlier, on foreign-exchange assets"});
  h+=row("Are you governed by the Portuguese Civil Code under section 5A?",sel("pi.s5a",["No","Yes"],{blank:false}),
    {hint:"Goa, Dadra & Nagar Haveli, Daman & Diu — on Yes, fill Schedule 5A"});
  h+=row("Are you a foreign portfolio investor?",sel("pi.fpi",["No","Yes"],{blank:false}),{req:1});
  if(S.pi.fpi==="Yes")h+=row("SEBI registration number",inp("pi.sebi"),{req:1,ind:1});
  h+=card("rep","Return filed by a representative assessee",(S.pi.rep==="Yes"?st0(S.pi.rep_name)||"Yes":""),
    row("Is this return being filed by a representative assessee?",sel("pi.rep",["No","Yes"],{blank:false}))+
    (S.pi.rep==="Yes"?(
      row("a · Name of the representative",inp("pi.rep_name"),{req:1})+
      row("b · Email of the representative",inp("pi.rep_email"),{req:1})+
      row("c · Contact number",inp("pi.rep_mobile",{max:10}),{req:1})+
      row("d · Capacity",sel("pi.rep_cap",REPCAP.slice(1)),{req:1})+
      row("e · Address of the representative",inp("pi.rep_addr"),{req:1})+
      row("f · PAN of the representative",inp("pi.rep_pan",{max:10}),{req:1})+
      row("g · Aadhaar of the representative",inp("pi.rep_aadhaar",{max:12}))):""));
  h+=card("lei","Legal Entity Identifier",(st0(S.pi.lei)?st0(S.pi.lei):""),
    note("Mandatory only where the refund is ₹50 crore or more.")+
    row("LEI number",inp("pi.lei",{max:20}))+
    row("Valid up to",dte("pi.lei_dt")));
  /* ---- Block 9 · directorships, partnerships, unlisted shares ---- */
  h+=sub("Directorships, partnerships and unlisted shares");
  h+=card("director","Director in a company at any time during the year",
    (S.pi.dir==="Yes"?((S.pi.dirco||[]).length+" compan"+((S.pi.dirco||[]).length===1?"y":"ies")):""),
    row("Were you a director in any company during the year?",sel("pi.dir",["No","Yes"],{blank:false}))+
    (S.pi.dir==="Yes"?grid("pi.dirco",[{k:"name",h:"Name of company",t:"txt",w:"auto",req:1},
      {k:"type",h:"Type of company",t:"sel",w:"130px",req:1,opts:COTYPE},
      {k:"pan",h:"PAN",t:"txt",w:"130px",max:10},
      {k:"listed",h:"Shares listed or unlisted",t:"sel",w:"150px",req:1,opts:[["L","Listed"],["U","Unlisted"]]},
      {k:"din",h:"Director identification number",t:"txt",w:"180px"}],
      S.pi.dirco||[],{min:"900px",empty:"No directorship.",add:"Add a company"}):""));
  h+=card("partner","Partner in a firm",(S.pi.partner==="Yes"?((S.pi.firms||[]).length+" firm"+((S.pi.firms||[]).length===1?"":"s")):""),
    row("Are you a partner in a firm?",sel("pi.partner",["No","Yes"],{blank:false}))+
    (S.pi.partner==="Yes"?grid("pi.firms",[{k:"name",h:"Name of firm",t:"txt",w:"auto",req:1},
      {k:"pan",h:"PAN",t:"txt",w:"140px",max:10,req:1}],
      S.pi.firms||[],{min:"520px",empty:"No firm.",add:"Add a firm"}):""));
  h+=card("unlisted","Unlisted equity shares held at any time during the year",
    (S.pi.unl==="Yes"?((S.pi.unlco||[]).length+" compan"+((S.pi.unlco||[]).length===1?"y":"ies")):""),
    row("Did you hold any unlisted equity shares at any time during the year?",sel("pi.unl",["No","Yes"],{blank:false}))+
    (S.pi.unl==="Yes"?(note("One row per company. Opening and closing balances are compulsory on every row; "+
        "the acquisition and transfer columns only where something happened. The department "+
        "cross-checks these against the company's own filings.")+
      grid("pi.unlco",[{k:"name",h:"Name of company",t:"txt",w:"auto",req:1},
      {k:"type",h:"Type",t:"sel",w:"110px",req:1,opts:COTYPE},
      {k:"pan",h:"PAN",t:"txt",w:"120px",max:10},
      {k:"open",h:"Opening — shares",t:"num",w:"110px",req:1},
      {k:"opencost",h:"Opening — cost",t:"num",w:"120px",req:1},
      {k:"acq",h:"Acquired — shares",t:"num",w:"110px"},
      {k:"acqdt",h:"Date of subscription or purchase",t:"date",w:"130px"},
      {k:"fv",h:"Face value per share",t:"num",w:"110px"},
      {k:"ip",h:"Issue price per share",t:"num",w:"110px"},
      {k:"pp",h:"Purchase price per share",t:"num",w:"120px"},
      {k:"sold",h:"Transferred — shares",t:"num",w:"120px"},
      {k:"soldcons",h:"Transferred — consideration",t:"num",w:"140px"},
      {k:"close",h:"Closing — shares",t:"num",w:"110px",req:1},
      {k:"closecost",h:"Closing — cost",t:"num",w:"120px",req:1}],
      S.pi.unlco||[],{min:"1900px",empty:"No unlisted shares.",add:"Add a company"})):""));
  return h;
}
/* ---------------- 2 · Return and regime — from the book -------------- */
function secRet(){
  let h="";
  h+=sub("Filing");
  h+=row("Filed under section",sel("fs.sec",RETSEC,{blank:false}),{req:1});
  if([13,14,16,18,20].indexOf(+S.fs.sec)>=0){
    h+=row("Filed in response to a notice under section",sel("fs.noticesec",NOTICESEC.slice(1)),{req:1,ind:1});
    h+=row("Unique number or document identification number of the notice or order",inp("fs.notice"),{req:1,ind:1});
    h+=row("Date of the notice or order",dte("fs.noticedate"),{req:1,ind:1});
  }
  if([17,18,19].indexOf(+S.fs.sec)>=0){
    h+=row("Receipt number of the original return",inp("fs.receipt",{max:15}),{req:1,ind:1,hint:"fifteen digits"});
    h+=row("Date of filing of the original return",dte("fs.origdate"),{req:1,ind:1});
  }
  if(+S.fs.sec===19)h+=row("Date of the advance pricing agreement",dte("fs.apadate"),{req:1,ind:1});
  if(+S.fs.sec===18)h+=note("A corrected return filed against a 139(9) notice on a return that was itself "+
    "filed under 139(8A) has to select 139(8A) again.","warn");
  h+=row("Date of filing",dte("fs.filed"),{req:1,hint:"drives interest under 234A and the fee under 234F"});
  h+=row("Due date under section 139(1)",'<span class="c">'+DISP(DUE)+'</span>');
  h+=row("Extended due date, if the Board extended it",dte("fs.dueExt"),{hint:"leave blank unless a circular extended the date — 234A and 234F then run from it"});
  h+=sub("Regime");
  h+=row("Do you wish to exercise the option under section 115BAC(6) of opting out of the new tax regime?",
    sel("fs.optout",["No","Yes"],{blank:false}),{req:1,hint:"the default is No — the new regime"});
  h+=note("For ITR-2 the option is exercised in the return itself. Form 10-IE or 10-IEA is needed only "+
    "where there is business or professional income, which does not arise on this form.");
  h+=regimeTable();
  h+=sub("Seventh proviso to section 139(1)");
  h+=card("decl","Filing under the seventh proviso though not otherwise required to",
    (S.decl&&S.decl.flag==="Yes"?"Declared":""),
    row("Are you filing under the seventh proviso to 139(1) but otherwise not required to?",
      sel("decl.flag",["No","Yes"],{blank:false}))+
    (S.decl&&S.decl.flag==="Yes"?(
      row("Deposited over ₹1 crore in one or more current accounts?",sel("decl.dep_f",["No","Yes"],{blank:false}),
        {v2:S.decl.dep_f==="Yes"?inp("decl.dep",{n:1}):""})+
      row("Spent over ₹2 lakh on travel to a foreign country, for yourself or another?",sel("decl.trv_f",["No","Yes"],{blank:false}),
        {v2:S.decl.trv_f==="Yes"?inp("decl.trv",{n:1}):""})+
      row("Spent over ₹1 lakh on consumption of electricity?",sel("decl.ele_f",["No","Yes"],{blank:false}),
        {v2:S.decl.ele_f==="Yes"?inp("decl.ele",{n:1}):""})+
      row("Required to file under other conditions in clause (iv) of the seventh proviso?",
        sel("decl.c4_f",["No","Yes"],{blank:false}))+
      (S.decl.c4_f==="Yes"?grid("decl.c4",[{k:"nature",h:"Condition",t:"sel",w:"520px",req:1,opts:CLAUSEIV},
        {k:"amt",h:"Amount",t:"num",w:"150px",req:1}],S.decl.c4||[],{min:"720px",empty:"No condition.",add:"Add a condition"}):"")
    ):""));
  return h;
}

function regimeTable(){
  const keep=S.fs.optout;
  const run=v=>{S.fs.optout=v;compute();
    return {via:S.C.via.allowed,ti:S.C.ti,tax:S.C.int.net};};
  const a=run("No"),b=run("Yes");S.fs.optout=keep;compute();
  const gap=Math.abs(a.tax-b.tax),better=a.tax<=b.tax?"new":"old";
  return '<div class="full"><table class="gt" style="min-width:640px"><thead><tr>'+
    '<th class="l">Regime</th><th style="width:160px">Chapter VI-A allowed</th>'+
    '<th style="width:150px">Total income</th><th style="width:150px">Tax after credit</th>'+
    '</tr></thead><tbody>'+
    '<tr><td class="l">New — section 115BAC(1A)</td><td class="num">'+cell(a.via)+
      '</td><td class="num">'+cell(a.ti)+'</td><td class="num">'+cell(a.tax)+'</td></tr>'+
    '<tr><td class="l">Old</td><td class="num">'+cell(b.via)+'</td><td class="num">'+
      cell(b.ti)+'</td><td class="num">'+cell(b.tax)+'</td></tr></tbody></table></div>'+
    (gap?note("On the figures entered so far the <b>"+better+" regime costs "+RS(gap)+
      " less</b>. Fill the rest before settling it.")
        :note("On the figures entered so far the two come to the same tax."));
}

/* ---------------- 3 · Salary — the full schedule ----------------- */
function secSal(){
  const A=S.C.sal;let h="";
  h+=formNote("Take these from Part B of Form 16. A separate block for each employer, "+
    "as the return requires — add one per Form 16 you hold.");
  if(!S.sal.emp||!S.sal.emp.length)S.sal.emp=[{empcat:"OTH"}];
  S.sal.emp.forEach((e,i)=>{
    const g=e._gross||0;
    const cat=(EMPCAT.find(c=>c[0]===e.empcat)||["","—"])[1];
    const status=st0(e.name)?(st0(e.name)+" · "+RS(g)):"not filled";
    let b=sub("The employer");
    b+=row("Name of the employer",inp("sal.emp."+i+".name"),{req:1});
    b+=row("Nature of employment",sel("sal.emp."+i+".empcat",EMPCAT,{blank:false}),{req:1});
    b+=row("TAN of the employer",inp("sal.emp."+i+".tan",{max:10}),
      {hint:"as on Form 16 — needed to match the TDS"});
    b+=row("Town or city of the employer",inp("sal.emp."+i+".city"));
    b+=row("State",sel("sal.emp."+i+".state",Object.keys(STATE).map(k=>[k,STATE[k]])));
    b+=row("PIN code",inp("sal.emp."+i+".pin",{max:6}));
    b+=sub("Salary from this employer");
    const natGrid=(k,opts,label)=>grid("sal.emp."+i+"."+k,[{k:"code",h:"Nature",t:"sel",w:"auto",req:1,opts:opts},{k:"desc",h:"If others, specify",t:"txt",w:"200px"},{k:"amt",h:"Amount",t:"num",w:"140px",req:1}],
      e[k]||[],{min:"760px",empty:"No breakup yet — the total below stays typeable until a row is added.",add:"Add a nature"});
    b+=fold("n17_1_"+i,"1a","Salary as per section 17(1) — nature-wise breakup (the form requires it)",(e.n17_1||[]).length?(e.n17_1||[]).length+" rows":"required",natGrid("n17_1",S17_1));
    b+=row("Salary as per section 17(1) — total",(e.n17_1||[]).length?cell(N(e.s17_1)):inp("sal.emp."+i+".s17_1",{n:1}),{ref:"1a",req:1,
      hint:(e.n17_1||[]).length?"the sum of the rows above":"add the breakup above — the portal rejects a 17(1) figure without it"});
    b+=fold("n17_2_"+i,"1b","Value of perquisites as per section 17(2) — nature-wise breakup",(e.n17_2||[]).length?(e.n17_2||[]).length+" rows":"if any",natGrid("n17_2",S17_2));
    b+=row("Value of perquisites as per section 17(2) — total",(e.n17_2||[]).length?cell(N(e.s17_2)):inp("sal.emp."+i+".s17_2",{n:1}),{ref:"1b"});
    b+=fold("n17_3_"+i,"1c","Profit in lieu of salary as per section 17(3) — nature-wise breakup",(e.n17_3||[]).length?(e.n17_3||[]).length+" rows":"if any",natGrid("n17_3",S17_3));
    b+=row("Profit in lieu of salary as per section 17(3) — total",(e.n17_3||[]).length?cell(N(e.s17_3)):inp("sal.emp."+i+".s17_3",{n:1}),{ref:"1c"});
    b+=row("Income from a retirement benefit account in a notified country, under section 89A",
      cell(e._d||0),{ref:"1d",hint:"the sum of the three countries below"});
    NOTIFIED89.forEach(c=>b+=row(c[1],inp("sal.emp."+i+".n89a_"+c[0],{n:1}),{ind:1}));
    b+=row("Income from a retirement benefit account in a country other than a notified one",
      inp("sal.emp."+i+".n89a_other",{n:1}),{ref:"1e"});
    b+=row("Income taxable this year on which relief under 89A was claimed in an earlier year",
      inp("sal.emp."+i+".n89a_prev",{n:1}),{ref:"1f"});
    b+=row("Gross salary from this employer",cell(g),{cls:"tot",
      hint:"1a + 1b + 1c + 1d + 1e + 1f, worked out for you"});
    h+=blk("emp"+i,"Employer "+(i+1)+(st0(e.name)?" — "+st0(e.name):""),status,b,"sal.emp."+i);
  });
  h+='<button class="add" data-addemp="1">Add an employer</button>';
  h+=sub("Gross salary — all employers");
  h+=row("Salary under section 17(1)",cell(A.grossS),{ref:"1a"});
  h+=row("Perquisites under section 17(2)",cell(A.grossP),{ref:"1b"});
  h+=row("Profit in lieu of salary under section 17(3)",cell(A.grossPr),{ref:"1c"});
  if(A.n89d)h+=row("Income from a notified country under section 89A",cell(A.n89d),{ref:"1d"});
  if(A.n89e)h+=row("Income from a country other than a notified one",cell(A.n89e),{ref:"1e"});
  if(A.n89f)h+=row("Taxable this year on an earlier 89A claim",cell(A.n89f),{ref:"1f"});
  h+=row("Total gross salary — all employers",cell(A.gross),{cls:"tot",ref:"1",
    hint:"the sum of every employer above"});
  h+=sub("Allowances exempt under section 10");
  if(isNew())h+=note("Section 115BAC closes most of these — house rent allowance, leave travel "+
    "concession and the ordinary 10(14) allowances among them. A row it cannot allow is shown "+
    "at nil.","warn");
  h+=grid("alw",[{k:"sec",h:"Nature of the allowance",t:"sel",w:"360px",req:1,
      opts:ALW10.map(a=>[a[0],a[0]+" — "+a[1]])},
    {k:"amt",h:"Amount",t:"num",w:"150px",req:1},
    {k:"ok",h:"Exempt",t:"calc",w:"140px",f:r=>r._ok?N(r.amt):0}],
    S.alw,{min:"760px",empty:"No exempt allowance claimed.",add:"Add an allowance",
    foot:[{l:1,v:"Total exempt under section 10",span:2},{v:A.exempt}]});
  h+=card("ea","Schedule EA 10(13A) — house rent allowance working",
    (S.sal.ea&&N(S.sal.ea.exempt)?F(N(S.sal.ea.exempt)):""),
    row("Place of work",sel("sal.ea.metro",
      [["M","A metro — Delhi, Mumbai, Kolkata or Chennai"],["N","Anywhere else"]]),{req:1})+
    row("Salary for the purpose of house rent allowance",inp("sal.ea.salary",{n:1}),{req:1})+
    row("Allowance received",inp("sal.ea.hra",{n:1}),{req:1})+
    row("Rent paid in the year",inp("sal.ea.rent",{n:1}),{req:1})+
    row("Exemption claimed",inp("sal.ea.exempt",{n:1}),{req:1,
      hint:"the least of the allowance, rent less ten per cent of salary, and 50% or 40% of salary"}));
  h+=card("s89a","Relief claimed under section 89A",
    (N(S.sal.rel89a)?F(N(S.sal.rel89a)):""),
    note("The income itself is entered employer by employer above, under 1d, 1e and 1f. "+
      "Enter here only the amount for which relief under section 89A is claimed this year.")+
    row("Income claimed for relief under section 89A",inp("sal.rel89a",{n:1}),{ref:"1iia"}));
  h+=row("Net salary",cell(A.net),{cls:"tot",ref:"3"});
  h+=sub("Deductions under section 16");
  h+=row("Standard deduction under section 16(ia)",cell(A.d16ia),{ref:"4a",
    hint:isNew()?"₹75,000, or the salary if less":"₹50,000, or the salary if less"});
  h+=row("Entertainment allowance under section 16(ii)",
    isNew()?cell(0):inp("sal.ent",{n:1}),{ref:"4b",
    hint:isNew()?"closed by section 115BAC":"government employees, up to ₹5,000"});
  h+=row("Professional tax under section 16(iii)",
    isNew()?cell(0):inp("sal.pt",{n:1}),{ref:"4c",
    hint:isNew()?"closed by section 115BAC":"up to ₹5,000"});
  h+=row("Total deduction under section 16",cell(A.d16),{cls:"tot",ref:"4"});
  h+=row("Income chargeable under the head salaries",cell(A.income),{cls:"grand",ref:"6"});
  return h;
}

/* ==================================================================
   CAPITAL GAINS — the screen, six parts, every head from the book
   ================================================================== */
const BYR_COLS=[{k:"name",h:"Name of buyer",t:"txt",w:"auto",req:1},
  {k:"pan",h:"PAN of buyer",t:"txt",w:"120px",max:10},
  {k:"aadhaar",h:"Aadhaar of buyer",t:"txt",w:"130px",max:12},
  {k:"share",h:"Percentage share",t:"num",w:"90px",req:1},
  {k:"amt",h:"Amount",t:"num",w:"130px",req:1}];
/* a fold: collapsible sub-head with a status on the right */
function fold(id,ref,title,status,inner,opts){
  opts=opts||{};const on=opts.def?S.open[id]!==false:!!S.open[id];
  return '<div class="sub2'+(on?" on":"")+'"><button class="s2h" data-sub2="'+id+'">'+
    '<span class="cv3">'+(on?"−":"+")+'</span><span class="s2ref">'+esc(ref)+'</span>'+
    '<span class="s2t">'+esc(title)+'</span><span class="s2v">'+status+'</span></button>'+
    '<div class="s2b'+(on?" open":"")+'">'+(on?inner:"")+'</div></div>';
}
/* the section-48 block, reused by every aggregate head */
function sec48(p,o,r,opts){
  opts=opts||{};let b="";
  if(opts.unq){
    b+=sub("a · Full value of consideration");
    b+=row("i · Where the securities sold include unquoted shares",'',{cls:"sub"});
    b+=row("a · Consideration received or receivable for unquoted shares",inp(p+"unqCons",{n:1}),{ind:1,ref:"aia"});
    b+=row("b · Fair market value of unquoted shares, determined in the prescribed manner",inp(p+"unqFmv",{n:1}),{ind:1,ref:"aib"});
    b+=row("c · Full value adopted under section 50CA — the higher of a and b",cell(o._c50ca||Math.max(N(o.unqCons),N(o.unqFmv))),{ind:1,ref:"aic",cls:"tot"});
    b+=row("ii · Full value of consideration for assets other than unquoted shares",inp(p+"othCons",{n:1}),{ref:"aii"});
    b+=row("iii · Total (ic + ii)",cell(r.cons),{ref:"aiii",cls:"tot"});
  } else {
    b+=row("a · Full value of consideration",inp(p+"cons",{n:1}),{req:1,ref:"a"});
  }
  b+=sub("b · Deductions under section 48");
  b+=row("i · Cost of acquisition without indexation",inp(p+"cost",{n:1}),{ref:"bi",ind:1});
  b+=row("ii · Cost of improvement without indexation",inp(p+"improve",{n:1}),{ref:"bii",ind:1});
  b+=row("iii · Expenditure wholly and exclusively in connection with the transfer",inp(p+"exp",{n:1}),{ref:"biii",ind:1});
  b+=row("iv · Total (bi + bii + biii)",cell(r.biv),{ref:"biv",cls:"tot"});
  b+=row("c · Balance (a − biv)",cell(r.c),{ref:"c",cls:"tot"});
  if(opts.loss94)b+=row("d · Loss to be disallowed under section 94(7) or 94(8)",inp(p+"loss94",{n:1}),{ref:"d",
    hint:"dividend or bonus stripping — bought within 3 months before the record date"});
  if(opts.dcg)b+=row("e · Deemed short-term gain on depreciable assets — item 6 of Schedule DCG",inp(p+"dcg",{n:1}),{ref:"e"});
  if(opts.deds&&opts.deds.length){
    b+=sub("Deductions claimed — particulars go in Part D");
    opts.deds.forEach(k=>{const sec=k.replace("s","");
      b+=row("Deduction under section "+sec,inp(p+"ded."+k,{n:1}),{ind:1});});
    b+=row("Total deduction",cell(r.ded),{cls:"tot"});
  }
  return b;
}
/* ---- one land/building property block ------------------------------ */
function landBlock(p,i,ordinal){
  const r=p._,pre="cg.land."+i+".",id="land"+i;
  const on=S.open["b_"+id]!==false;
  const term=r.isLT?"Long-term":"Short-term";
  const status=(D(p.sale)?DISP(D(p.sale)):"no date")+" · "+term+" · "+RS(r.gain);
  let b="";
  b+=sub("Dates");
  b+=row("Date of purchase or acquisition",dte(pre+"buy"),{req:1});
  b+=row("Date of sale or transfer",dte(pre+"sale"),{req:1});
  b+=row("Period of holding",'<span class="c">'+(r.months!=null?Math.floor(r.months)+" months":"—")+'</span>',
    {hint:r.isLT?"more than 24 months — long-term":"24 months or less — short-term"});
  b+=row("Treat as",sel(pre+"lt",[["","As worked out"],["Short","Short-term"],["Long","Long-term"]],{blank:false}),
    {hint:p.lt?"set when the block was added — choose 'As worked out' to let the dates decide":""});
  if(p.lt&&r.months!=null&&((p.lt==="Long")!==(r.months>24)))
    b+=note("The dates make this "+(r.months>24?"long":"short")+"-term, but the block is held as "+
      p.lt.toLowerCase()+"-term. Set 'Treat as' to 'As worked out' to move it, unless the Act treats the holding differently.","warn");
  if(r.isLT){
    b+=row("Whether chargeable to tax under section 45(5A)?",sel(pre+"s45_5a",["No","Yes"],{blank:false}),
      {hint:"a joint development agreement"});
    if(p.s45_5a==="Yes")b+=row("Date of the completion certificate",dte(pre+"ccDate"),{req:1,ind:1});
  }
  b+=sub("a · Full value of consideration");
  b+=row("i · Full value of consideration received or receivable",inp(pre+"cons",{n:1}),{req:1,ref:"ai"});
  b+=row("ii · Value of the property as per the stamp valuation authority",inp(pre+"sdv",{n:1}),{ref:"aii"});
  b+=row("iii · Full value adopted under section 50C",cell(r.value),{ref:"aiii",cls:"tot",
    hint:r.safe?"the stamp value is within 1.10 times the price, so the price stands":
      (N(p.sdv)>N(p.cons)*1.10?"the stamp value exceeds 1.10 times the price, so it is adopted":"")});
  b+=sub("b · Deductions under section 48");
  b+=row("i · Cost of acquisition without indexation",inp(pre+"cost",{n:1}),{req:1,ref:"bi",ind:1});
  if(r.isLT)b+=row("ii a · Cost of acquisition with indexation",cell(r.costIdx),{ref:"biia",ind:1,
    hint:r.canIndex?"indexed by the cost inflation index — residents, acquisition before 23 July 2024"
      :"no indexation — acquired on or after 23 July 2024, or a non-resident"});
  b+=row((r.isLT?"ii b · ":"ii · ")+"Cost of improvement",cell(r.impNo),{ref:r.isLT?"biib":"bii",ind:1,
    hint:"the sum of the improvements below"});
  b+=grid(pre.slice(0,-1)+".improve",[
    {k:"amt",h:"Cost without indexation",t:"num",w:"170px",req:1},
    {k:"yr",h:"Year of improvement",t:"sel",w:"150px",opts:Object.keys(CII).map(y=>[y,y])},
    {k:"idx",h:"Cost with indexation",t:"calc",w:"170px",f:x=>{
      if(!r.canIndex)return N(x.amt);const b0=CII[x.yr]||CII[FYof(p.buy)],s0=CII[FYof(p.sale)||"2025-26"];
      return (b0&&s0)?R(N(x.amt)*s0/b0):N(x.amt);}}],
    p.improve||[],{min:"560px",empty:"No improvement.",add:"Add an improvement"});
  if(r.isLT)b+=row("Total cost of improvement with indexation",cell(r.impIdx),{ind:1});
  b+=row("iii · Expenditure wholly and exclusively in connection with the transfer",inp(pre+"exp",{n:1}),{ref:"biii",ind:1});
  b+=row("iv · Total (bi + Σbii + biii)",cell(r.biv),{ref:"biv",cls:"tot"});
  if(r.isLT&&r.canIndex)b+=row("iv a · Total on the indexed basis (biia + Σbiib(c) + biii)",cell(r.biva),{ref:"biva",cls:"tot",
    hint:"only for working out eiB under the second proviso"});
  b+=row("c · Balance (aiii − biv)",cell(r.c),{ref:"c",cls:"tot"});
  if(r.isLT&&r.canIndex)b+=row("c a · Balance on the indexed basis (aiii − biva)",cell(r.ca),{ref:"ca",cls:"tot"});
  b+=sub("d · Deductions claimed — particulars go in Part D");
  const deds=r.isLT?[["s54","54 — a residential house from a residential house"],["s54B","54B — agricultural land"],
    ["s54EC","54EC — specified bonds, up to ₹50 lakh"],["s54EE","54EE — specified fund units"],
    ["s54F","54F — a residential house from any other asset"],["s54GB","54GB — eligible start-up company"]]
    :[["s54B","54B — agricultural land"]];
  deds.forEach(([k,l])=>b+=row(l,inp(pre+"ded."+k,{n:1}),{ind:1}));
  b+=row("Total deduction",cell(r.dedTot),{ref:"d",cls:"tot"});
  b+=row((r.isLT?"e · Long-term":"e · Short-term")+" capital gain on immovable property (c − d)",cell(r.e),{ref:"e",cls:"grand"});
  if(r.isLT&&r.canIndex){
    b+=row("e(a) · Gain on the indexed basis (ca − d)",cell(r.ea),{ref:"ea"});
    b+=sub("e i · Second proviso to section 112(1)(a) — residents, acquisition before 23 July 2024");
    b+=row("A · Tax under 112(1)(a)(ii)(B) — e × 12.5%",cell(r.taxA),{ind:1});
    b+=row("B · Tax for the second proviso — e(a) × 20%",cell(r.taxB),{ind:1});
    b+=row("e ii · Excess amount to be ignored (A − B)",cell(r.excess),{ref:"eii",cls:"tot",
      hint:"the person pays the lower of the two"});
  }
  b+=sub("f · Buyer details");
  b+=note("PAN or Aadhaar of the buyer is mandatory where tax was deducted under section 194-IA, "+
    "or where it is quoted in the documents. For more than one buyer give each one's share and amount.");
  b+=grid(pre.slice(0,-1)+".buyers",BYR_COLS,p.buyers||[],{min:"780px",empty:"No buyer listed.",add:"Add a buyer"});
  b+=row("Address of the property",inp(pre+"paddr"),{req:1});
  b+=row("State",sel(pre+"pstate",Object.keys(STATE).map(k=>[k,STATE[k]])),{req:1});
  b+=row("PIN code",inp(pre+"ppin",{max:6}),{req:1});
  b+=row("Country",'<span class="c">91 — INDIA</span>');
  return '<div class="blk'+(on?" on":"")+'"><div class="bh">'+
    '<button class="bhx" data-blk="'+id+'"><span class="cv2">'+(on?"−":"+")+'</span>'+
    '<span class="t">Property '+ordinal+(st0(p.paddr)?" — "+st0(p.paddr):"")+'</span>'+
    '<span class="s">'+esc(status)+'</span></button>'+
    '<button class="blkdel" data-del="cg.land.'+i+'" title="Remove">'+TRASH+'</button>'+
    '</div><div class="bb">'+(on?b:"")+'</div></div>';
}

/* ---- Part A ---------------------------------------------------- */
function partA(){
  const G=S.C.cg,A=G.A,C=S.cg,nri=G.nri;let h="";
  const st=(v)=>RS(v);
  /* A1 land — repeatable */
  let a1="";
  if(!G.land.st.length)a1=note("No short-term property yet. A property held 24 months or less "+
    "lands here once you add it below; longer than that goes under B1.");
  G.land.st.forEach((p,k)=>a1+=landBlock(p,p._i,k+1));
  a1+='<button class="add" data-addland="Short">Add a property</button>';
  h+=fold("A1","A1","From sale of land or building or both — one block per property",
    G.land.st.length?G.land.st.length+" property · "+st(A.a1):"none",a1,{def:1});
  /* A3 equity STT */
  let s3=sub("(i) · Under section 111A — for everyone other than an FII");
  s3+=fold("A3w","","Working — trade by trade, summed into the figures below",
    (C.a3trades||[]).length?(C.a3trades||[]).length+" trade"+((C.a3trades||[]).length>1?"s":""):"optional",
    note("The form takes only the totals. Enter each trade here and Yukti sums the consideration, cost "+
      "and expenses into A3(i); or leave this shut and type the totals directly.")+
    grid("cg.a3trades",[{k:"name",h:"Share or unit",t:"txt",w:"auto"},{k:"buy",h:"Bought",t:"date",w:"120px"},
      {k:"sale",h:"Sold",t:"date",w:"120px"},{k:"cons",h:"Consideration",t:"num",w:"120px"},
      {k:"cost",h:"Cost",t:"num",w:"110px"},{k:"exp",h:"Expenses",t:"num",w:"100px"},
      {k:"g",h:"Gain",t:"calc",w:"110px",f:r=>N(r.cons)-N(r.cost)-N(r.exp)}],
      C.a3trades||[],{min:"900px",empty:"No trade entered.",add:"Add a trade",
      foot:[{l:1,v:"Summed into A3(i)",span:3},{v:(C.a3trades||[]).reduce((a,r)=>a+N(r.cons),0)},
        {v:(C.a3trades||[]).reduce((a,r)=>a+N(r.cost),0)},{v:(C.a3trades||[]).reduce((a,r)=>a+N(r.exp),0)},
        {v:(C.a3trades||[]).reduce((a,r)=>a+N(r.cons)-N(r.cost)-N(r.exp),0)}]}));
  s3+=sec48("cg.a3i.",C.a3i||{},A.a3i,{loss94:1});
  s3+=row("i e · Short-term gain on equity with STT under 111A (c + d)",cell(A.a3i.gain),{ref:"A3ie",cls:"grand"});
  if(nri){s3+=sub("(ii) · Under section 115AD(1)(b)(ii) — for an FII only");
    s3+=sec48("cg.a3ii.",C.a3ii||{},A.a3ii,{loss94:1});
    s3+=row("ii e · Short-term gain under 115AD(1)(b)(ii) (c + d)",cell(A.a3ii.gain),{ref:"A3iie",cls:"grand"});}
  h+=fold("A3","A2","From sale of equity shares, equity-oriented fund units or business-trust units, STT paid",
    (A.a3i.gain||A.a3ii.gain)?st(A.a3i.gain+A.a3ii.gain):"none",s3);
  if(nri){
    let s4=note("For a non-resident who is not an FII. Computed with the foreign-exchange adjustment "+
      "under the first proviso to section 48 — enter the computed figures.");
    s4+=row("a · STCG on transactions covered under 111A",'',{cls:"sub"});
    s4+=row("a i · where the transfer was before 23 July 2024",inp("cg.a4.ai",{n:1}),{ind:1,ref:"A3ai"});
    s4+=row("a ii · where the transfer was on or after 23 July 2024",inp("cg.a4.aii",{n:1}),{ind:1,ref:"A3aii"});
    s4+=row("b · STCG on shares not covered in 3a, or on debentures",inp("cg.a4.b",{n:1}),{ref:"A3b"});
    s4+=row("Short-term gain — non-resident, section 48 proviso",cell(A.a4.gain),{cls:"grand"});
    h+=fold("A4","A3","For a non-resident, not an FII — shares or debentures of an Indian company",
      A.a4.gain?st(A.a4.gain):"none",s4);
    let s5=note("For a non-resident FII — securities under section 115AD, other than those at A3.");
    s5+=sec48("cg.a5.",C.a5||{},A.a5,{unq:1,loss94:1});
    s5+=row("e · Short-term gain on securities by an FII (c + d)",cell(A.a5.gain),{ref:"A4e",cls:"grand"});
    h+=fold("A5","A4","For a non-resident FII — securities under section 115AD",A.a5.gain?st(A.a5.gain):"none",s5);
  }
  /* A6 other */
  let s6=sec48("cg.a6.",C.a6||{},A.a6,{unq:1,loss94:1,dcg:1,deds:["s54D","s54G","s54GA"]});
  s6+=row("e · STCG on assets other than at A1 to A4 (c + d + e − f)",cell(A.a6.gain),{ref:"A5e",cls:"grand"});
  h+=fold("A6","A5","From sale of assets other than at A1 to A4",A.a6.gain?st(A.a6.gain):"none",s6);
  /* A7 deemed */
  let s7=sub("a · Unutilised capital gain from an earlier year, deposited in a Capital Gains Account Scheme");
  s7+=grid("cg.a7.deem",[{k:"py",h:"Previous year the asset was transferred",t:"sel",w:"180px",req:1,
      opts:[["2023-24","2023-24"],["2024-25","2024-25"]]},
    {k:"sec",h:"Section claimed that year",t:"sel",w:"140px",req:1,opts:[["54B","54B"]]},
    {k:"acqyr",h:"Year the new asset was acquired",t:"sel",w:"150px",opts:[["2023","2023"],["2024","2024"],["2025","2025"]]},
    {k:"used",h:"Amount utilised from the account",t:"num",w:"170px"},
    {k:"unused",h:"Amount not used — deemed income",t:"num",w:"180px",req:1}],
    (C.a7||{}).deem||[],{min:"900px",empty:"Nothing deemed.",add:"Add a year"});
  s7+=row("b · Amount deemed to be short-term capital gain, other than at a",inp("cg.a7.other",{n:1}),{ref:"A6b"});
  s7+=row("Total amount deemed to be short-term capital gain",cell(A.a7.gain),{ref:"A6",cls:"grand"});
  h+=fold("A7","A6","Amount deemed to be short-term capital gain",A.a7.gain?st(A.a7.gain):"none",s7);
  /* A8 PTI */
  let s8=note("Fill up Schedule PTI. The figures here are the short-term part of pass-through income.");
  s8+=row("chargeable at 15%",inp("cg.a8.r15",{n:1}),{ind:1,ref:"7ai"});
  s8+=row("chargeable at 20%",inp("cg.a8.r20",{n:1}),{ind:1,ref:"7a"});
  s8+=row("chargeable at 30%",inp("cg.a8.r30",{n:1}),{ind:1,ref:"7b"});
  s8+=row("chargeable at applicable rates",inp("cg.a8.rApp",{n:1}),{ind:1,ref:"7c"});
  s8+=row("Pass-through income in the nature of short-term capital gain",cell(A.a8.gain),{ref:"A7",cls:"grand"});
  h+=fold("A8","A7","Pass-through income or loss in the nature of short-term capital gain",A.a8.gain?st(A.a8.gain):"none",s8);
  /* A9 DTAA — NRI */
  if(nri){
    let s9=grid("cg.a9",[{k:"amt",h:"Amount of income",t:"num",w:"130px",req:1},
      {k:"item",h:"Item A1 to A8 in which included",t:"sel",w:"150px",req:1,
        opts:["A1e","A2c","A3ie","A3iie","A3a","A3b","A4e","A5e","A6","A7"].map(x=>[x,x])},
      {k:"country",h:"Country name and code",t:"txt",w:"180px",req:1},
      {k:"article",h:"Article of the DTAA",t:"txt",w:"110px",req:1},
      {k:"rate",h:"Rate per treaty (NIL if not chargeable)",t:"txt",w:"140px",req:1},
      {k:"trc",h:"TRC obtained?",t:"sel",w:"100px",opts:[["Y","Yes"],["N","No"]]},
      {k:"sec",h:"Section of the Act",t:"txt",w:"110px",req:1},
      {k:"itrate",h:"Rate per the Act",t:"num",w:"110px",req:1}],
      C.a9||[],{min:"1180px",empty:"No DTAA claim.",add:"Add a claim"});
    s9+=row("a · Total STCG not chargeable to tax in India under a DTAA",cell(A.a9.notTax),{ref:"A8a",cls:"tot"});
    s9+=row("b · Total STCG chargeable at special rates under a DTAA",cell(A.a9.special),{ref:"A8b",cls:"tot"});
    h+=fold("A9","A8","STCG claimed as not chargeable, or at special rates, under a DTAA",
      (A.a9.notTax+A.a9.special)?st(A.a9.notTax+A.a9.special):"none",s9);
  }
  /* A(A) buy-back */
  let sA=note("Can be claimed only if the corresponding dividend under section 2(22)(f) is offered in Schedule OS.");
  sA+=grid("cg.aA",[{k:"rate",h:"Rate",t:"sel",w:"220px",req:1,
      opts:[["STL20","Short-term at 20%"],["STL30","Short-term at 30%"],["STLAR","Short-term at the applicable rate"]]},
    {k:"amt",h:"Amount",t:"num",w:"150px",req:1}],C.aA||[],{min:"460px",empty:"No buy-back loss.",add:"Add a row"});
  h+=fold("AA","A(A)","Capital loss on buy-back of shares — short-term",A.aA.loss?"("+st(A.aA.loss)+")":"none",sA);
  h+=row("Total short-term capital gain (A1e + A2e + A3a + A3b + A4e + A5e + A6 + A7 − A8a + A(A))",cell(A.total),{ref:"A9",cls:"grand"});
  return h;
}
/* ---- Part B ---------------------------------------------------- */
function partB(){
  const G=S.C.cg,B=G.B,C=S.cg,nri=G.nri;let h="";const st=v=>RS(v);
  let b1="";
  if(!G.land.lt.length)b1=note("No long-term property yet. A property held more than 24 months lands here.");
  G.land.lt.forEach((p,k)=>b1+=landBlock(p,p._i,k+1));
  b1+='<button class="add" data-addland="Long">Add a property</button>';
  if(G.land.lt.length){
    b1+=sub("g · Across all immovable properties");
    b1+=row("Total long-term gain on all immovable properties",cell(B.b1),{ref:"B1g",cls:"tot"});
    b1+=row("a · from transfers before 23 July 2024",cell(B.b1before),{ind:1,ref:"B1ga"});
    b1+=row("b · from transfers on or after 23 July 2024",cell(B.b1after),{ind:1,ref:"B1gb"});
    b1+=row("h · Total excess tax to be ignored",cell(B.b1excess),{ref:"B1h",cls:"tot"});
  }
  h+=fold("B1","B1","From sale of land or building or both — one block per property",
    G.land.lt.length?G.land.lt.length+" property · "+st(B.b1):"none",b1,{def:1});
  let s3=sub("(i) · Listed securities other than units, or zero-coupon bonds — section 112(1)");
  s3+=sec48("cg.b3i.",C.b3i||{},B.b3i,{deds:["s54EC","s54EE","s54F"]});
  s3+=row("e · LTCG on bonds or debentures (c − d)",cell(B.b3i.gain),{cls:"grand"});
  s3+=sub("(ii) · Listed securities other than units, or zero-coupon bonds — section 112(1)");
  s3+=sec48("cg.b3ii.",C.b3ii||{},B.b3ii,{deds:["s54EC","s54EE","s54F"]});
  s3+=row("e · LTCG on listed securities (c − d)",cell(B.b3ii.gain),{cls:"grand"});
  s3+=sub("(iii) · GDR of an Indian company under section 115ACA — residents only");
  s3+=sec48("cg.b3iii.",C.b3iii||{},B.b3iii,{deds:["s54EC","s54EE","s54F"]});
  s3+=row("e · LTCG on GDRs (c − d)",cell(B.b3iii.gain),{cls:"grand"});
  h+=fold("B3","B2","Listed securities, zero-coupon bonds and GDRs — sections 112(1) and 115ACA",
    (B.b3i.gain+B.b3ii.gain+B.b3iii.gain)?st(B.b3i.gain+B.b3ii.gain+B.b3iii.gain):"none",s3);
  let s4=note("Fed from Schedule 112A below, column 14, scrip by scrip.");
  s4+=row("a · LTCG under 112A — the sum of column 14",cell(G.s112a.bal),{ref:"4a",cls:"tot"});
  s4+=row("b · Deduction under section 54F",inp("cg.b4.s54F",{n:1}),{ref:"4b"});
  s4+=row("c · Long-term gain on equity with STT (4a − 4b)",cell(B.b4.gain),{ref:"B4c",cls:"grand"});
  h+=fold("B4","B3","Equity shares, equity-oriented fund units or business-trust units with STT — section 112A",
    B.b4.gain?st(B.b4.gain):"none",s4);
  if(nri){
    let s5=note("Computed without indexation, with the foreign-exchange adjustment.");
    s5+=row("a i · Before 23 July 2024 — listed debentures",inp("cg.b5.ai",{n:1}),{ind:1});
    s5+=row("a ii · Before 23 July 2024 — other than listed debentures",inp("cg.b5.aii",{n:1}),{ind:1});
    s5+=row("a iii · On or after 23 July 2024",inp("cg.b5.aiii",{n:1}),{ind:1});
    s5+=row("b · Deduction under section 54F",inp("cg.b5.b",{n:1}));
    s5+=row("c · LTCG on unlisted shares or listed debentures (4a − 4b)",cell(B.b5.gain),{ref:"B5c",cls:"grand"});
    h+=fold("B5","B4","For a non-resident — unlisted shares or listed debentures of an Indian company",B.b5.gain?st(B.b5.gain):"none",s5);
    let s6="";
    [["b6i","(i) · Unlisted securities under section 112(1)(c)"],["b6ii","(ii) · Bonds or GDRs under section 115AC"],
     ["b6iii","(iii) · Securities by an FII under section 115AD, other than those at B7"]].forEach(([k,l])=>{
      s6+=sub(l);s6+=sec48("cg."+k+".",C[k]||{},B[k],{unq:1,deds:["s54F"]});
      s6+=row("e · Long-term gain (c − d)",cell(B[k].gain),{cls:"grand"});});
    h+=fold("B6","B5","For a non-resident — unlisted securities under 112(1)(c), bonds or GDRs under 115AC, and FII securities under 115AD",
      (B.b6i.gain+B.b6ii.gain+B.b6iii.gain)?st(B.b6i.gain+B.b6ii.gain+B.b6iii.gain):"none",s6);
    let s6b=sec48("cg.b6iv.",C.b6iv||{},B.b6iv,{deds:["s54F"]});
    s6b+=row("c · Long-term gain (a − b)",cell(B.b6iv.gain),{ref:"B6c",cls:"grand"});
    h+=fold("B6b","B6","For a non-resident — bonds or GDRs under section 115AC",B.b6iv.gain?st(B.b6iv.gain):"none",s6b);
    let s7=note("Fed from Schedule 115AD(1)(iii) proviso — scrip by scrip, the FII's counterpart of Schedule 112A.");
    s7+=grid("cg.s115ad",[{k:"isin",h:"ISIN",t:"txt",w:"130px",max:12},
      {k:"name",h:"Name of the share or unit",t:"txt",w:"auto"},
      {k:"pre18",h:"Held on 31-01-2018",t:"sel",w:"130px",opts:[["AE","No"],["BE","Yes"]]},
      {k:"qty",h:"Quantity",t:"num",w:"92px"},{k:"price",h:"Sale price each",t:"num",w:"104px"},
      {k:"cost",h:"Cost",t:"num",w:"104px"},{k:"fmv18",h:"Value on 31-01-2018",t:"num",w:"120px"},
      {k:"exp",h:"Expenses",t:"num",w:"92px"},{k:"bal",h:"Gain",t:"calc",w:"104px",f:r=>r._?r._.bal:0}],
      S.cg.s115ad||[],{min:"1300px",empty:"No scrip.",add:"Add a scrip",
      foot:[{l:1,v:"Column 14 — feeds 7a",span:8},{v:G.s115ad.bal}]});
    s7+=row("a · LTCG under 112A — the sum of column 14",cell(G.s115ad.bal),{ref:"7a",cls:"tot"});
    s7+=row("b · Deduction under section 54F",inp("cg.b7.b",{n:1}),{ref:"7b"});
    s7+=row("c · Long-term gain (7a − 7b)",cell(B.b7.gain),{ref:"B7c",cls:"grand"});
    h+=fold("B7","B7","For an FII — securities under section 115AD, including equity with STT through the 115AD(1)(iii) proviso",B.b7.gain?st(B.b7.gain):"none",s7);
    let s8=row("a · LTCG on a foreign-exchange asset under section 115F, without indexation",inp("cg.b8.a",{n:1}),{ref:"8a"});
    s8+=row("b · Less: deduction under section 115F",inp("cg.b8.b",{n:1}),{ref:"8b"});
    s8+=row("d · LTCG on any other asset under section 115E",inp("cg.b8.d",{n:1}),{ref:"8d"});
    s8+=row("c · Balance long-term gain",cell(B.b8.gain),{ref:"B8c",cls:"grand"});
    h+=fold("B8","B8","For a non-resident Indian — foreign-exchange asset under Chapter XII-A",B.b8.gain?st(B.b8.gain):"none",s8);
  }
  let s9=sec48("cg.b9.",C.b9||{},B.b9,{unq:1,deds:["s54D","s54EC","s54EE","s54F","s54G","s54GA"]});
  s9+=row("e · LTCG on assets at B9 (c − d)",cell(B.b9.gain),{ref:"B9e",cls:"grand"});
  h+=fold("B9","B9","From sale of assets where B1 to B8 do not apply",B.b9.gain?st(B.b9.gain):"none",s9);
  let s10=sub("a · Unutilised capital gain from an earlier year, deposited in a Capital Gains Account Scheme");
  s10+=grid("cg.b10.deem",[{k:"py",h:"Previous year the asset was transferred",t:"sel",w:"180px",req:1,
      opts:[["2023-24","2023-24"],["2024-25","2024-25"]]},
    {k:"sec",h:"Section claimed that year",t:"sel",w:"140px",req:1,
      opts:["54","54B","54D","54EC","54F","54G","54GA","54GB","115F"].map(x=>[x,x])},
    {k:"acqyr",h:"Year the new asset was acquired",t:"sel",w:"150px",opts:[["2023","2023"],["2024","2024"],["2025","2025"]]},
    {k:"used",h:"Amount utilised",t:"num",w:"150px"},
    {k:"unused",h:"Amount not used — deemed income",t:"num",w:"180px",req:1}],
    (C.b10||{}).deem||[],{min:"900px",empty:"Nothing deemed.",add:"Add a year"});
  s10+=row("b · Amount deemed to be long-term capital gain, other than at a",inp("cg.b10.other",{n:1}),{ref:"10b"});
  s10+=row("Total amount deemed to be long-term capital gain",cell(B.b10.gain),{ref:"B10",cls:"grand"});
  h+=fold("B10","B10","Amount deemed to be long-term capital gain",B.b10.gain?st(B.b10.gain):"none",s10);
  let s11=note("Fill up Schedule PTI.");
  [["r10a","chargeable at 10% under 112A"],["r125a","chargeable at 12.5% under 112A"],
   ["r10o","chargeable at 10% under other sections"],["r125o","chargeable at 12.5% under other sections"],
   ["r20","chargeable at 20%"]].forEach(([k,l])=>s11+=row(l,inp("cg.b11."+k,{n:1}),{ind:1}));
  s11+=row("Pass-through income in the nature of long-term capital gain",cell(B.b11.gain),{ref:"B11",cls:"grand"});
  h+=fold("B11","B11","Pass-through income or loss in the nature of long-term capital gain",B.b11.gain?st(B.b11.gain):"none",s11);
  if(nri){
    let s12=grid("cg.b12",[{k:"amt",h:"Amount of income",t:"num",w:"130px",req:1},
      {k:"item",h:"Item B1 to B11 in which included",t:"sel",w:"150px",req:1,
        opts:["B1e","B2e","B3e","B4c","B5c","B6e","B7c","B8c","B9e","B10","B11"].map(x=>[x,x])},
      {k:"country",h:"Country name and code",t:"txt",w:"180px",req:1},
      {k:"article",h:"Article of the DTAA",t:"txt",w:"110px",req:1},
      {k:"rate",h:"Rate per treaty (NIL if not chargeable)",t:"txt",w:"140px",req:1},
      {k:"trc",h:"TRC obtained?",t:"sel",w:"100px",opts:[["Y","Yes"],["N","No"]]},
      {k:"sec",h:"Section of the Act",t:"txt",w:"110px",req:1},
      {k:"itrate",h:"Rate per the Act",t:"num",w:"110px",req:1}],
      C.b12||[],{min:"1180px",empty:"No DTAA claim.",add:"Add a claim"});
    s12+=row("a · Total LTCG not chargeable to tax in India under a DTAA",cell(B.b12.notTax),{ref:"B12a",cls:"tot"});
    s12+=row("b · Total LTCG chargeable at special rates under a DTAA",cell(B.b12.special),{ref:"B12b",cls:"tot"});
    h+=fold("B12","B12","LTCG claimed as not chargeable, or at special rates, under a DTAA",
      (B.b12.notTax+B.b12.special)?st(B.b12.notTax+B.b12.special):"none",s12);
  }
  let sB=note("Can be claimed only if the corresponding dividend under section 2(22)(f) is offered in Schedule OS.");
  sB+=grid("cg.bA",[{k:"rate",h:"Rate",t:"sel",w:"220px",req:1,opts:[["LTL125","Long-term at 12.5%"]]},
    {k:"amt",h:"Amount",t:"num",w:"150px",req:1}],C.bA||[],{min:"460px",empty:"No buy-back loss.",add:"Add a row"});
  h+=fold("BA","B(A)","Capital loss on buy-back of shares — long-term at 12.5%",B.bA.loss?"("+st(B.bA.loss)+")":"none",sB);
  h+=row("Total long-term capital gain chargeable under the Act (B1g + B2e + B3 + B4c + B5 + B6 + B7c + B8c + B9e + B10 + B11 − B12a + B(A))",
    cell(B.total),{ref:"B12",cls:"grand"});
  return h;
}

/* ---- Part D: the sheet's exact columns, section by section --------- */
const D_COLS={
 "54":[["transfer","Date of transfer of original asset","date"],["cost","Cost of new residential house","num"],
   ["purchase","Date of purchase or construction of the new house","date"],
   ["dep","Amount deposited in the Capital Gains Accounts Scheme before the due date","num"],
   ["depdt","Date of deposit","date"],["acno","Account number","txt"],["ifsc","IFS code","txt"]],
 "54B":[["transfer","Date of transfer of original asset","date"],["cost","Cost of new agricultural land","num"],
   ["purchase","Date of purchase of the new agricultural land","date"],
   ["dep","Amount deposited in the Capital Gains Accounts Scheme before the due date","num"],
   ["depdt","Date of deposit","date"],["acno","Account number","txt"],["ifsc","IFS code","txt"]],
 "54D":[["transfer","Date of acquisition of original asset","date"],
   ["cost","Cost of purchase or construction of new land or building for the industrial undertaking","num"],
   ["purchase","Date of purchase of the new land or building","date"],
   ["dep","Amount deposited in the Capital Gains Accounts Scheme before the due date","num"]],
 "54EC":[["transfer","Date of transfer of original asset","date"],
   ["cost","Amount invested in specified or notified bonds — not exceeding fifty lakh rupees","num"],
   ["purchase","Date of investment","date"]],
 "54EE":[["transfer","Date of transfer of original residential property","date"],
   ["cost","Amount invested in specified assets","num"],["purchase","Date of investment","date"]],
 "54F":[["transfer","Date of transfer of original asset","date"],["cost","Cost of new residential house","num"],
   ["purchase","Date of purchase or construction of the new house","date"],
   ["dep","Amount deposited in the Capital Gains Accounts Scheme before the due date","num"],
   ["depdt","Date of deposit","date"],["acno","Account number","txt"],["ifsc","IFS code","txt"]],
 "54G":[["transfer","Date of transfer of original asset from the urban area","date"],
   ["cost","Cost and expenses incurred for purchase or construction of the new asset","num"],
   ["purchase","Date of purchase or construction of the new asset in an area other than urban","date"],
   ["dep","Amount deposited in the Capital Gains Accounts Scheme before the due date","num"]],
 "54GA":[["transfer","Date of transfer of original asset","date"],
   ["cost","Cost and expenses of the new asset in the special economic zone","num"],
   ["purchase","Date of purchase or construction","date"],
   ["dep","Amount deposited in the Capital Gains Accounts Scheme before the due date","num"]],
 "54GB":[["transfer","Date of transfer of original residential property","date"],
   ["copan","PAN of the eligible company","txt"],
   ["cost","Amount utilised for subscription of equity shares of the eligible company","num"],
   ["purchase","Date of subscription of the shares","date"],
   ["plant","Cost of new plant and machinery purchased by the eligible company","num"],
   ["plantdt","Date of purchase of the plant and machinery","date"],
   ["dep","Amount deposited in the Capital Gains Accounts Scheme before the due date","num"]],
 "115F":[["transfer","Date of transfer of original foreign-exchange asset","date"],
   ["cost","Amount invested in the new specified asset or savings certificate","num"],
   ["purchase","Date of investment","date"]]
};
function partD(){
  const G=S.C.cg;let h="";
  const secs=Object.keys(G.dedD);
  if(!secs.length)return note("No exemption has been claimed in Part A or Part B, so there is nothing to give particulars of.");
  h+=note("In case of deduction under 54, 54B, 54EC, 54F or 115F give the following details. Every "+
    "exemption claimed above appears here with the columns the form asks for that section. Dates are "+DF+".");
  const letters={"54":"a","54B":"b","54D":"c","54EC":"c","54EE":"e","54F":"d","54G":"f","54GA":"f","54GB":"e","115F":"e"};
  secs.forEach(sec=>{
    const rows=G.dedD[sec],cols=D_COLS[sec]||D_COLS["54F"];
    const tot=rows.reduce((a,r)=>a+r.amt,0);
    let b="";
    rows.forEach((r,k)=>{const p="cg.dedD."+sec+"."+k+".";
      b+=sub("Sl. "+(k+1));
      cols.forEach(([key,label,typ])=>{
        b+=row(label,typ==="date"?dte(p+key):(typ==="num"?inp(p+key,{n:1}):inp(p+key,{max:key==="ifsc"?11:key==="copan"?10:40})),
          {req:1,ind:1});});
      b+=row("Amount of deduction claimed",cell(r.amt),{cls:"tot",ind:1});});
    b+=row("Total",cell(tot),{cls:"tot"});
    h+=fold("D_"+sec,letters[sec]||"",'Deduction claimed under section '+sec,RS(tot),b);
  });
  h+=row("f · Total deduction claimed",cell(G.dedTotal),{ref:"Df",cls:"grand"});
  return h;
}
/* ---- Part E: the utility's live table — six slots, with the edit switch */
const E_ROWS=[["st20","ii","Short-term capital gain at 20%"],["st30","iii","Short-term capital gain at 30%"],
  ["stApp","iv","Short-term capital gain at applicable rate"],["stDTAA","v","Short-term capital gain at DTAA rates"],
  ["lt125","vi","Long-term capital gain at 12.5%"],["ltDTAA","vii","Long-term capital gain at DTAA rates"]];
const E_LOSSCOL=[["st20","20%"],["st30","30%"],["stApp","applicable rate"],["stDTAA","DTAA rates"],
  ["lt125","12.5%"],["ltDTAA","DTAA rates"]];
function partE(){
  const G=S.C.cg,ed=!!S.cg.editE;let h="";
  h+=note("Set-off of current-year capital losses against current-year capital gains, excluding the amounts "+
    "in A9a and B12a that are not chargeable under a DTAA. Filled from Parts A and B: a short-term loss may "+
    "go against any gain, a long-term loss only against a long-term gain, nothing against its own slot.");
  h+='<div class="full"><table class="gt" style="min-width:1100px"><thead><tr>'+
     '<th class="l" style="width:36px">Sl.</th><th class="l" style="min-width:230px">Type of capital gain</th>'+
     '<th style="width:120px">Capital gain of the year — positive only</th>'+
     '<th colspan="4">Short-term capital loss</th><th colspan="2">Long-term capital loss</th>'+
     '<th style="width:130px">Gain remaining after set-off</th></tr><tr><th></th><th></th><th></th>';
  E_LOSSCOL.forEach(([k,l])=>h+='<th style="width:90px">'+esc(l)+'</th>');
  h+='<th></th></tr></thead><tbody>';
  h+='<tr><td class="l">i</td><td class="l"><b>Capital loss to be set off — negative only</b></td><td></td>';
  E_LOSSCOL.forEach(([k])=>h+='<td class="num">'+cell(-G.loss[k])+'</td>');h+='<td></td></tr>';
  E_ROWS.forEach(([k,sl,label])=>{
    h+='<tr><td class="l">'+sl+'</td><td class="l">'+esc(label)+'</td><td class="num">'+cell(G.gain[k])+'</td>';
    E_LOSSCOL.forEach(([lk])=>{
      const own=(lk===k),longV=(lk.startsWith("lt")&&!k.startsWith("lt"));
      if(own||longV){h+='<td class="num" style="background:var(--closed)"></td>';return;}
      const v=(G.matrix[k]||{})[lk]||0;
      h+='<td class="num">'+(ed?inp("cg.Eover."+k+"."+lk,{n:1}):cell(v))+'</td>';});
    h+='<td class="num">'+cell(G.after[k])+'</td></tr>';});
  h+='</tbody><tfoot><tr><td class="l">viii</td><td class="l">Total loss set off (ii + iii + iv + v + vi + vii)</td><td></td>';
  E_LOSSCOL.forEach(([k])=>h+='<td>'+F(G.used[k])+'</td>');h+='<td>'+F(G.C1)+'</td></tr>';
  h+='<tr><td class="l">ix</td><td class="l">Loss remaining after set-off (i − viii)</td><td></td>';
  E_LOSSCOL.forEach(([k])=>h+='<td>'+F(G.loss[k]-G.used[k])+'</td>');h+='<td></td></tr></tfoot></table></div>';
  h+=row("Do you want to edit the detail auto-populated above?",sel("cg.editE",[["","No"],["1","Yes"]],{blank:false}),
    {hint:ed?"type the set-off amounts into the cells above":"the utility fills this; switch to edit it"});
  if(ed){const bad=E_ROWS.filter(([k])=>G.absorbed[k]>G.gain[k]);
    if(bad.length)h+=note("More loss has been set against a slot than it holds: "+bad.map(x=>x[2]).join(", ")+".","stop");}
  return h;
}
/* ---- Part F: auto-filled, then editable ---------------------------- */
const F_ROWS=[["st20","Short-term capital gains taxable at 20% — item 3iii of Schedule BFLA"],
  ["st30","Short-term capital gains taxable at 30% — item 3iv of Schedule BFLA"],
  ["stApp","Short-term capital gains taxable at applicable rates — item 3v of Schedule BFLA"],
  ["stDTAA","Short-term capital gains taxable at DTAA rates — item 3vi of Schedule BFLA"],
  ["lt125","Long-term capital gains taxable at 12.5% — item 3vii of Schedule BFLA"],
  ["ltDTAA","Long-term capital gains taxable at DTAA rates — item 3viii of Schedule BFLA"]];
function partF(){
  const G=S.C.cg,ed=!!S.cg.editF;let h="";
  const seniorRes=S.pi.res==="RES"&&S.pi.status==="I"&&senior();
  if(seniorRes)h+=note("Table F is not mandatory for a resident senior citizen or super senior citizen — no "+
    "advance tax is due, so interest under 234C does not arise.");
  h+=note("The quarter each gain accrued in. Each row must add up to the gain after brought-forward losses — "+
    "3(iii) to 3(viii) of Schedule BFLA. Filled from the sale dates on the land blocks; the rest falls in the fourth "+
    "quarter. Switch on editing to enter the split yourself.");
  h+='<div class="full"><table class="gt" style="min-width:1000px"><thead><tr>'+
     '<th class="l" style="min-width:300px">Type of capital gain</th>';
  ["Up to 15/6 (i)","16/6 to 15/9 (ii)","16/9 to 15/12 (iii)","16/12 to 15/3 (iv)","16/3 to 31/3 (v)"].forEach(q=>h+='<th style="width:110px">'+q+'</th>');
  h+='<th style="width:120px">Total</th></tr></thead><tbody>';
  const LB=S.C.loss.afterB||{};
  F_ROWS.forEach(([k,l])=>{if(!(LB[k]>0)&&!ed)return;
    const sum=G.F[k].reduce((a,x)=>a+x,0);const off=Math.abs(sum-(LB[k]||0))>1;
    h+='<tr><td class="l">'+esc(l)+'</td>';
    G.F[k].forEach((v,i)=>h+='<td class="num">'+(ed?inp("cg.Fover."+k+"."+i,{n:1}):cell(v))+'</td>');
    h+='<td class="num"'+(off&&ed?' style="color:var(--red)"':'')+'>'+cell(LB[k]||0)+
       (off&&ed?'<span class="dt">split is '+F(sum)+'</span>':'')+'</td></tr>';});
  if(G.C2){const vq=[0,0,0,0,0];(S.cg.vda||[]).forEach(r=>{if(r._&&r._.inc)vq[r._.q]+=r._.inc;});
    h+='<tr><td class="l">Capital gains on transfer of virtual digital assets at 30% — item 16 of Schedule SI</td>';
    vq.forEach(v=>h+='<td class="num">'+cell(v)+'</td>');h+='<td class="num">'+cell(G.C2)+'</td></tr>';}
  h+='</tbody></table></div>';
  h+=row("Do you want to edit the detail auto-populated above?",sel("cg.editF",[["","No"],["1","Yes"]],{blank:false}));
  return h;
}

/* ---- the section ---------------------------------------------------- */
function secCG(){
  const G=S.C.cg;let h="";
  h+=row("Is there any capital gain or loss?",sel("cg.on",[["","No"],["1","Yes"]],{blank:false}),{req:1});
  if(!S.cg.on)return h;
  h+=note("Six parts. <b>A</b> and <b>B</b> hold the gains, head by head. <b>C</b> is the summary. "+
    "<b>D</b> proves every exemption. <b>E</b> sets losses against gains. <b>F</b> is when each gain arose.");
  if(!G.nri)h+=note("Heads A3(ii), A4, A5, A9, B5 to B8 and B12 are for non-residents and are hidden. "+
    "They appear when residential status is set to non-resident in <b>Who is filing</b>.");
  h+='<div class="cgband">A · Short-term capital gains</div>';
  h+='<div class="cghead on"><div class="cghb open">'+partA()+'</div></div>';
  h+='<div class="cgband">B · Long-term capital gains</div>';
  h+='<div class="cghead on"><div class="cghb open">'+partB()+'</div></div>';
  h+='<div class="cgsubband">Schedule 112A — listed equity and equity funds with STT, scrip by scrip</div>';
  h+=grid("cg.s112a",[{k:"isin",h:"ISIN",t:"txt",w:"130px",max:12,ph:"INE009A01021"},
    {k:"name",h:"Name of the share or unit",t:"txt",w:"auto"},
    {k:"pre18",h:"Held on 31-01-2018",t:"sel",w:"130px",opts:[["AE","No"],["BE","Yes"]]},
    {k:"qty",h:"Quantity",t:"num",w:"92px"},{k:"price",h:"Sale price each",t:"num",w:"104px"},
    {k:"cost",h:"Cost",t:"num",w:"104px"},{k:"fmv18",h:"Value on 31-01-2018",t:"num",w:"120px"},
    {k:"exp",h:"Expenses",t:"num",w:"92px"},{k:"bal",h:"Gain",t:"calc",w:"104px",f:r=>r._?r._.bal:0}],
    S.cg.s112a,{min:"1300px",empty:"No listed equity sold.",add:"Add a scrip",
    foot:[{l:1,v:"Column 14 — feeds B4a",span:8},{v:G.s112a.bal}]});
  h+='<div class="cgsubband">Schedule VDA — virtual digital assets</div>';
  h+=grid("cg.vda",[{k:"buy",h:"Date of acquisition",t:"date",w:"130px"},{k:"sale",h:"Date of transfer",t:"date",w:"130px"},
    {k:"cost",h:"Cost of acquisition",t:"num",w:"130px"},{k:"cons",h:"Consideration",t:"num",w:"130px"},
    {k:"inc",h:"Income",t:"calc",w:"110px",f:r=>r._?r._.inc:0}],
    S.cg.vda,{min:"760px",empty:"No virtual digital asset transferred.",add:"Add a transfer",
    foot:[{l:1,v:"Column 7 — feeds C2",span:4},{v:G.vda.cg}]});
  h+='<div class="cgband">C · Income chargeable under the head</div>';
  h+=row("C1 · Sum of capital-gain incomes — after the set-off in Table E",cell(G.C1),{ref:"C1",cls:"tot"});
  h+=row("C2 · Income from transfer of virtual digital assets — column 7 of Schedule VDA",cell(G.C2),{ref:"C2"});
  h+=row("C3 · Income chargeable under the head Capital Gains (C1 + C2)",cell(G.C3),{ref:"C3",cls:"grand"});
  h+='<div class="cgband">D · Information about deductions claimed against capital gains</div>';
  h+=partD();
  h+='<div class="cgband">E · Set-off of current-year capital losses with current-year capital gains</div>';
  h+=partE();
  h+='<div class="cgband">F · Information about accrual or receipt of capital gain</div>';
  h+=partF();
  return h;
}

/* ---------------- 5 · Other sources — the book's working ------------ */
function secOS(){
  const O=S.C.os,X=S.os2||{};let h="";
  h+=row("Is there any income from other sources?",sel("os2.on",[["","No"],["1","Yes"]],{blank:false}),{req:1});
  if(!X.on)return h;
  h+=note("A working, numbered 1 to 9: gross income at normal rates, plus income at special rates, "+
    "less deductions under section 57, adjusted under 58 and 59 and for 89A relief, then race horses "+
    "on their own. Include the income of the specified persons — spouse, minor child — referred to in "+
    "Schedule SPI.");
  /* ===== 1 ===== */
  h+='<div class="cgband">1 · Gross income chargeable to tax at normal applicable rates (1a + 1b + 1c + 1d + 1e)</div>';
  let a=row("i · Dividend income, other than (ii) and (iii)",inp("os2.d.ord",{n:1}),{ref:"1ai"});
  a+=row("ii · Dividend income under section 2(22)(e)",inp("os2.d.e22",{n:1}),{ref:"1aii",
    hint:"deemed dividend — a loan or advance by a closely-held company to a substantial shareholder"});
  a+=row("iii · Dividend income under section 2(22)(f)",inp("os2.d.f22",{n:1}),{ref:"1aiii",
    hint:"buy-back of shares — this is what unlocks the buy-back loss at A(A) and B(A) in Schedule CG"});
  a+=row("a · Dividends, gross (ai + aii + aiii)",cell(O.a.tot),{ref:"1a",cls:"tot"});
  h+=fold("os1a","1a","Dividends, gross",O.a.tot?RS(O.a.tot):"none",a,{def:1});
  let b=row("i · From savings bank",inp("os2.i.sav",{n:1}),{ref:"1bi"});
  b+=row("ii · From deposit — bank, post office, co-operative",inp("os2.i.dep",{n:1}),{ref:"1bii"});
  b+=row("iii · From income-tax refund",inp("os2.i.refund",{n:1}),{ref:"1biii"});
  b+=row("iv · In the nature of pass-through income or loss",inp("os2.i.pti",{n:1}),{ref:"1biv"});
  b+=row("v · Interest on provident-fund contributions taxable under the first proviso to 10(11)",inp("os2.i.pf11a",{n:1}),{ref:"1bv"});
  b+=row("vi · — under the second proviso to 10(11)",inp("os2.i.pf11b",{n:1}),{ref:"1bvi"});
  b+=row("vii · — under the first proviso to 10(12)",inp("os2.i.pf12a",{n:1}),{ref:"1bvii"});
  b+=row("viii · — under the second proviso to 10(12)",inp("os2.i.pf12b",{n:1}),{ref:"1bviii"});
  b+=row("ix · Others, including interest from companies, NBFCs and HFCs",inp("os2.i.others",{n:1}),{ref:"1bix"});
  b+=row("b · Interest, gross (bi to bix)",cell(O.b.tot),{ref:"1b",cls:"tot"});
  h+=fold("os1b","1b","Interest, gross",O.b.tot?RS(O.b.tot):"none",b,{def:1});
  h+=row("c · Rental income from machinery, plants, buildings, etc., gross",inp("os2.rent",{n:1}),{ref:"1c",
    hint:"this is what unlocks the depreciation deduction at 3b"});
  let d=row("i · Aggregate value of sum of money received without consideration",inp("os2.g.money",{n:1}),{ref:"1di"});
  d+=row("ii · Immovable property received without consideration — stamp duty value",inp("os2.g.immWithout",{n:1}),{ref:"1dii"});
  d+=row("iii · Immovable property for inadequate consideration — stamp duty value in excess of the consideration",inp("os2.g.immInadeq",{n:1}),{ref:"1diii"});
  d+=row("iv · Any other property received without consideration — fair market value",inp("os2.g.othWithout",{n:1}),{ref:"1div"});
  d+=row("v · Any other property for inadequate consideration — fair market value in excess of the consideration",inp("os2.g.othInadeq",{n:1}),{ref:"1dv"});
  d+=row("d · Income under section 56(2)(x) (di to dv)",cell(O.d.tot),{ref:"1d",cls:"tot"});
  h+=fold("os1d","1d","Income of the nature referred to in section 56(2)(x)",O.d.tot?RS(O.d.tot):"none",d);
  let e=row("Family pension",inp("os2.e.fap",{n:1}),{hint:"unlocks the deduction under 57(iia) at 3a(ii)"});
  e+=sub("Income from a retirement benefit account maintained in a notified country under section 89A");
  e+=row("2a · United States of America",inp("os2.e.n89a_US",{n:1}),{ind:1});
  e+=row("2b · United Kingdom of Great Britain and Northern Ireland",inp("os2.e.n89a_UK",{n:1}),{ind:1});
  e+=row("2c · Canada",inp("os2.e.n89a_CA",{n:1}),{ind:1});
  e+=row("Income from a retirement benefit account in a country other than a notified country under 89A",inp("os2.e.oth89a",{n:1}));
  e+=row("Income taxable this year on which relief under 89A was claimed in an earlier year",inp("os2.e.prev89a",{n:1}));
  e+=row("Specified sum received by a unit holder from a business trust — section 56(2)(xii)",inp("os2.e.s562xii",{n:1}));
  e+=row("Sum received under a life insurance policy, including bonus — section 56(2)(xiii)",inp("os2.e.s562xiii",{n:1}));
  e+=sub("Any other — specify the nature");
  e+=grid("os2.eOther",[{k:"nature",h:"Nature",t:"txt",w:"auto",req:1},{k:"amt",h:"Amount",t:"num",w:"150px",req:1}],
    X.eOther||[],{min:"600px",empty:"Nothing else.",add:"Add a row"});
  e+=row("e · Any other income",cell(O.e.tot),{ref:"1e",cls:"tot"});
  h+=fold("os1e","1e","Any other income",O.e.tot?RS(O.e.tot):"none",e);
  h+=row("1 · Gross income chargeable to tax at normal applicable rates",cell(O.one),{ref:"1",cls:"grand"});
  /* ===== 2 ===== */
  h+='<div class="cgband">2 · Income chargeable at special rates (2a(i) + 2a(ii) + 2b + 2c + 2d + 2e + 2f)</div>';
  h+=row("a(i) · Winnings from lotteries, crossword puzzles, races, card games etc. — section 115BB",inp("os2.sp.lottery",{n:1}),{ref:"2ai",hint:"thirty per cent"});
  h+=row("a(ii) · Winnings from online games — section 115BBJ",inp("os2.sp.online",{n:1}),{ref:"2aii",hint:"thirty per cent"});
  let bb=row("i · Cash credits — section 68",inp("os2.sp.s68",{n:1}),{ref:"2bi"});
  bb+=row("ii · Unexplained investments — section 69",inp("os2.sp.s69",{n:1}),{ref:"2bii"});
  bb+=row("iii · Unexplained money etc. — section 69A",inp("os2.sp.s69A",{n:1}),{ref:"2biii"});
  bb+=row("iv · Undisclosed investments etc. — section 69B",inp("os2.sp.s69B",{n:1}),{ref:"2biv"});
  bb+=row("v · Unexplained expenditure etc. — section 69C",inp("os2.sp.s69C",{n:1}),{ref:"2bv"});
  bb+=row("vi · Amount borrowed or repaid on hundi — section 69D",inp("os2.sp.s69D",{n:1}),{ref:"2bvi"});
  bb+=row("b · Income chargeable under section 115BBE (bi to bvi)",cell(O.sp.bbeTot),{ref:"2b",cls:"tot",hint:"sixty per cent, plus a twenty-five per cent surcharge"});
  h+=fold("os2b","2b","Income chargeable under section 115BBE",O.sp.bbeTot?RS(O.sp.bbeTot):"none",bb);
  let pf=grid("os2.pf111",[{k:"ay",h:"Assessment year",t:"sel",w:"140px",req:1,
      opts:["2025-26","2024-25","2023-24","2022-23","2021-22","2020-21","2019-20","2018-19"].map(y=>[y,y])},
    {k:"incben",h:"Income benefit",t:"num",w:"150px",req:1},{k:"taxben",h:"Tax benefit",t:"num",w:"150px",req:1}],
    X.pf111||[],{min:"520px",empty:"None.",add:"Add a year",foot:[{l:1,v:"Total",span:1},{v:O.sp.pf111inc},{v:O.sp.pf111tax}]});
  h+=fold("os2c","2c","Accumulated balance of recognised provident fund taxable under section 111",O.sp.pf111inc?RS(O.sp.pf111inc):"none",pf);
  let sd=grid("os2.spl",[{k:"code",h:"Nature",t:"sel",w:"auto",req:1,opts:OS_SPL.map(x=>[x[0],x[0]+" — "+x[1]])},
    {k:"amt",h:"Amount",t:"num",w:"150px",req:1}],X.spl||[],{min:"900px",empty:"None.",add:"Add a row",
    foot:[{l:1,v:"Total of di to dxx",span:1},{v:O.sp.spl}]});
  h+=fold("os2d","2d","Any other income chargeable at a special rate",O.sp.spl?RS(O.sp.spl):"none",sd);
  let pt=grid("os2.pti",[{k:"code",h:"Nature",t:"sel",w:"auto",req:1,opts:OS_SPL.map(x=>[x[0],x[0]+" — "+x[1]])},
    {k:"amt",h:"Amount",t:"num",w:"150px",req:1}],X.pti||[],{min:"900px",empty:"None.",add:"Add a row",
    foot:[{l:1,v:"Total",span:1},{v:O.sp.pti}]});
  h+=fold("os2e","2e","Pass-through income in the nature of other sources, at special rates",O.sp.pti?RS(O.sp.pti):"none",pt);
  if(S.pi.res!=="RES"){
    let dt=note("Amount included in 1 and 2 above, claimed at special rates in India under a DTAA. Two classifications "+
      "per row — which item of this schedule, and which section of the Act.");
    dt+=grid("os2.dtaa",[{k:"amt",h:"Amount of income",t:"num",w:"120px",req:1},
      {k:"nature",h:"Item of this schedule",t:"sel",w:"110px",req:1,opts:OS_NATURE.map(x=>[x,x])},
      {k:"itemno",h:"Section of the Act",t:"sel",w:"260px",req:1,opts:OS_ITEMNO},
      {k:"country",h:"Country name",t:"txt",w:"140px",req:1},
      {k:"code",h:"Country code",t:"sel",w:"140px",req:1,opts:COUNTRIES.filter(c=>c[0]!=="91")},
      {k:"article",h:"Article of the DTAA",t:"txt",w:"100px",req:1},
      {k:"treaty",h:"Rate per treaty — NIL if not chargeable",t:"txt",w:"120px",req:1},
      {k:"trc",h:"TRC obtained?",t:"sel",w:"90px",opts:[["Y","Yes"],["N","No"]]},
      {k:"itrate",h:"Rate per the Act",t:"num",w:"100px",req:1},
      {k:"app",h:"Applicable rate",t:"calc",w:"100px",f:r=>{const t=/^nil$/i.test(st0(r.treaty))?0:N(r.treaty);return Math.min(t,N(r.itrate));}}],
      X.dtaa||[],{min:"1500px",empty:"No DTAA claim.",add:"Add a claim",foot:[{l:1,v:"Total",span:0},{v:O.sp.dtaa}]});
    h+=fold("os2f","2f","Amount claimed at special rates under a DTAA",O.sp.dtaa?RS(O.sp.dtaa):"none",dt);
  }
  h+=row("2 · Income chargeable at special rates",cell(O.two),{ref:"2",cls:"grand"});
  /* ===== 3 ===== */
  h+='<div class="cgband">3 · Deductions under section 57 — other than against 2a, 2b and 2d</div>';
  h+=row("a(i) · Expenses or deductions other than a(ii)",inp("os2.ded.exp",{n:1}),{ref:"3ai",hint:"in the case of income other than family pension"});
  h+=row("a(ii) · Deduction under section 57(iia) — family pension only",cell(O.ded.iia),{ref:"3aii",
    hint:O.fap?"a third of the pension, capped at "+RS(isNew()?25000:15000):"no family pension entered at 1e, so nothing here"});
  h+=row("b · Depreciation",O.c>0?inp("os2.ded.dep",{n:1}):cell(0),{ref:"3b",
    hint:O.c>0?"available because rent is offered at 1c":"available only if income is offered at 1c"});
  h+=row("c · Interest expenditure claimed under section 57(i)",(O.a.ord+O.a.e22)>0?inp("os2.ded.intClaimed",{n:1}):cell(0),{ref:"3c",
    hint:(O.a.ord+O.a.e22)>0?"against the dividend at 1a(i) and 1a(ii)":"available only if dividend is offered at 1a(i) or 1a(ii)"});
  h+=row("c(i) · Eligible amount of interest expenditure — computed",cell(O.ded.intElig),{ref:"3ci",ind:1,
    hint:"capped at twenty per cent of the dividend in 1a(i) and 1a(ii)"});
  h+=row("d · Total",cell(O.ded.tot),{ref:"3d",cls:"grand"});
  /* ===== 4, 5, 5a ===== */
  h+='<div class="cgband">4 · 5 · 5a — Adjustments</div>';
  h+=row("4 · Amounts not deductible under section 58",inp("os2.s58",{n:1}),{ref:"4"});
  h+=row("5 · Profits chargeable to tax under section 59",inp("os2.s59",{n:1}),{ref:"5"});
  h+=row("5a · Income claimed for relief from taxation under section 89A",inp("os2.rel89a",{n:1}),{ref:"5a"});
  /* ===== 6, 7 ===== */
  h+='<div class="cgband">6 · 7 — Net income</div>';
  h+=row("6 · Net income from other sources at normal rates — 1 (less the DTAA portion) − 3 + 4 + 5 − 5a",cell(O.six),{ref:"6",cls:"tot",
    hint:O.six<0?"a loss — it goes to 3(i) of Schedule CYLA":""});
  h+=row("7 · Income from other sources, other than race horses — 2 + 6, taking 6 as nil if negative",cell(O.seven),{ref:"7",cls:"grand"});
  /* ===== 8 ===== */
  h+='<div class="cgband">8 · Income from the activity of owning and maintaining race horses</div>';
  h+=card("horse","Owning and maintaining race horses",(O.horse.on?RS(O.horse.bal):""),
    row("a · Receipts",inp("os2.horse.rec",{n:1}),{ref:"8a",req:1})+
    row("b · Deductions under section 57 in relation to 8a only",inp("os2.horse.ded57",{n:1}),{ref:"8b"})+
    row("c · Amounts not deductible under section 58",inp("os2.horse.s58",{n:1}),{ref:"8c"})+
    row("d · Profits chargeable to tax under section 59",inp("os2.horse.s59",{n:1}),{ref:"8d"})+
    row("e · Balance (8a − 8b + 8c + 8d)",cell(O.horse.bal),{ref:"8e",cls:"tot",
      hint:O.horse.bal<0?"a loss — it goes to 6(xi) of Schedule CFL, set only against race-horse income":""}));
  /* ===== 9 ===== */
  h+='<div class="cgband">9 · Income under the head Income from other sources (7 + 8e)</div>';
  h+=row("9 · Income under the head — taking 8e as nil if negative",cell(O.nine),{ref:"9",cls:"grand"});
  /* ===== 10 ===== */
  h+='<div class="cgband">10 · Information about accrual or receipt of income from other sources</div>';
  const ed=!!X.editQ;
  h+=note("The quarter each amount arose in, for interest under section 234C. Filled from the figures above "+
    "into the fourth quarter; switch on editing to spread them yourself.");
  h+='<div class="full"><table class="gt" style="min-width:1100px"><thead><tr><th class="l" style="min-width:360px">Other source income</th>';
  ["Up to 15/6 (i)","16/6 to 15/9 (ii)","16/9 to 15/12 (iii)","16/12 to 15/3 (iv)","16/3 to 31/3 (v)"].forEach(q=>h+='<th style="width:105px">'+q+'</th>');
  h+='<th style="width:110px">Total</th></tr></thead><tbody>';
  OS_Q.forEach(([k,l,key,req])=>{const tot=O.Q[k].reduce((s,v)=>s+v,0);const src=O.auto[k]||0;
    if(!src&&!ed&&!req)return;
    h+='<tr><td class="l">'+esc(l)+(req?' <span class="hint" style="color:var(--red)">required</span>':'')+'</td>';
    O.Q[k].forEach((v,i)=>h+='<td class="num">'+(ed?inp("os2.Q."+k+"."+i,{n:1}):cell(v))+'</td>');
    h+='<td class="num"'+(ed&&Math.abs(tot-src)>1&&src?' style="color:var(--red)"':'')+'>'+cell(tot)+'</td></tr>';});
  h+='</tbody></table></div>';
  h+=row("Do you want to edit the detail auto-populated above?",sel("os2.editQ",[["","No"],["1","Yes"]],{blank:false}));
  return h;
}

/* ---------------- 6 · House property — the book ---------------------- */
function hpBlock(p,i,ordinal){
  const r=p._||engProp(p),pre="hp.props."+i+".",id="hp"+i;
  const on=S.open["b_"+id]!==false;
  const typeLbl=(HP_TYPE.find(t=>t[0]===p.type)||["","—"])[1];
  const status=(st0(p.addr)?typeLbl+" · ":"")+(r.k<0?"loss "+RS(-r.k):RS(r.k));
  let b="";
  b+=sub("The property");
  b+=row("Address of property",inp(pre+"addr"),{req:1});
  b+=row("Town or city",inp(pre+"city"),{req:1});
  b+=row("Country",sel(pre+"country",COUNTRIES,{blank:false}),{req:1});
  if((p.country||"91")==="91"){
    b+=row("State",sel(pre+"state",Object.keys(STATE).map(k=>[k,STATE[k]])),{req:1});
    b+=row("PIN code",inp(pre+"pin",{max:6}),{req:1});
  } else {
    b+=row("State",sel(pre+"state",[["99","Outside India"]],{blank:false}),{req:1});
    b+=row("Zip code",inp(pre+"zip",{max:10}),{req:1});
  }
  b+=sub("Ownership");
  b+=row("Owner of the property",sel(pre+"owner",HP_OWNER),{req:1});
  if(p.owner==="OT")b+=row("Please specify",inp(pre+"ownerOther"),{req:1,ind:1});
  b+=row("Is the property co-owned?",sel(pre+"co",[["NO","No"],["YES","Yes"]],{blank:false}),{req:1});
  b+=row("Your percentage share in the property",p.co==="YES"?inp(pre+"share",{n:1}):cell(100),{req:1,
    hint:p.co==="YES"?"the other co-owners below should bring the total to 100":"not co-owned — 100 per cent"});
  if(p.co==="YES"){
    b+=grid(pre.slice(0,-1)+".coowners",[{k:"name",h:"Name of other co-owner",t:"txt",w:"auto",req:1},
      {k:"pan",h:"PAN",t:"txt",w:"120px",max:10},{k:"aadhaar",h:"Aadhaar",t:"txt",w:"130px",max:12},
      {k:"share",h:"Share in the property %",t:"num",w:"140px"}],
      p.coowners||[],{min:"760px",empty:"No co-owner listed.",add:"Add a co-owner",
      foot:[{l:1,v:"Shares — yours "+(N(p.share)||0)+"% + theirs "+r.coShare+"%",span:3},{v:(N(p.share)||0)+r.coShare}]});
    if(Math.abs((N(p.share)||0)+r.coShare-100)>0.01)b+=note("The shares add to "+((N(p.share)||0)+r.coShare)+"%, not 100%.","warn");
  }
  b+=sub("Type of house property");
  b+=row("Type",sel(pre+"type",HP_TYPE,{blank:false}),{req:1});
  if(p.type!=="S"){
    b+=grid(pre.slice(0,-1)+".tenants",[{k:"name",h:"Name of tenant",t:"txt",w:"auto",req:1},
      {k:"pan",h:"PAN of tenant",t:"txt",w:"120px",max:10},{k:"aadhaar",h:"Aadhaar of tenant",t:"txt",w:"130px",max:12},
      {k:"pantan",h:"PAN / TAN of tenant — if TDS credit is claimed",t:"txt",w:"200px",max:10}],
      p.tenants||[],{min:"860px",empty:"No tenant listed.",add:"Add a tenant"});
  }
  b+=sub("The working");
  if(r.self){
    b+=note("Self-occupied — the annual value is nil under section 23(2), so only the interest counts."+
      (isNew()?" Under the new regime section 115BAC(2) disallows even that.":" Under the old regime it is allowed up to ₹2,00,000."));
    b+=row("a · Gross rent received or receivable, or lettable value",cell(0),{ref:"1a"});
    b+=row("e · Annual value — nil, self-occupied",cell(0),{ref:"1e"});
    b+=row("f · Annual value of the property owned",cell(0),{ref:"1f"});
    b+=row("g · 30% of 1f",cell(0),{ref:"1g"});
  } else {
    b+=row("a · Gross rent received or receivable, or lettable value",inp(pre+"rent",{n:1}),{req:1,ref:"1a",hint:"in full — the share is applied at f"});
    b+=row("b · The amount of rent which cannot be realised",inp(pre+"unreal",{n:1}),{ref:"1b"});
    b+=row("c · Tax paid to local authorities",inp(pre+"taxes",{n:1}),{ref:"1c"});
    b+=row("d · Total (1b + 1c)",cell(r.d),{ref:"1d",cls:"tot"});
    b+=row("e · Annual value (1a − 1d)",cell(r.e),{ref:"1e",cls:"tot"});
    b+=row("f · Annual value of the property owned — your share × 1e",cell(r.f),{ref:"1f",cls:"tot",
      hint:r.share<100?r.share+" per cent of "+RS(r.e):""});
    b+=row("g · 30% of 1f",cell(r.g),{ref:"1g"});
  }
  b+=sub("h · Interest payable on borrowed capital — section 24(b)");
  b+=note("One row per loan. Every column is required on a row that is filled. The interest sums into h."+
    (r.self?" On a self-occupied house the sheet says it cannot exceed ₹2,00,000.":""));
  b+=grid(pre.slice(0,-1)+".loans",[
    {k:"from",h:"Loan taken from",t:"sel",w:"150px",req:1,opts:HP_LOANFROM},
    {k:"name",h:"Name of the bank, institution or person",t:"txt",w:"auto",req:1},
    {k:"acno",h:"Loan account number",t:"txt",w:"170px",req:1},
    {k:"dt",h:"Date of sanction",t:"date",w:"130px",req:1},
    {k:"amt",h:"Total amount of the loan",t:"num",w:"140px",req:1},
    {k:"os",h:"Outstanding on 31-03-2026",t:"num",w:"150px",req:1},
    {k:"interest",h:"Interest under 24(b)",t:"num",w:"140px",req:1}],
    p.loans||[],{min:"1300px",empty:"No loan.",add:"Add a loan",
    foot:[{l:1,v:"Total interest on borrowed capital under section 24(b)",span:6},{v:r.hRaw}]});
  b+=row("h · Interest payable on borrowed capital",cell(r.h),{ref:"1h",cls:"tot",
    hint:r.barred?"disallowed under the new regime — "+RS(r.cut)+" set aside":
      (r.cut?"capped at ₹2,00,000 — "+RS(r.cut)+" above the ceiling":"")});
  b+=row("i · Total (1g + 1h)",cell(r.i),{ref:"1i",cls:"tot"});
  b+=row("j · Arrears or unrealised rent received during the year",inp(pre+"arrears",{n:1}),{ref:"1j",hint:"the amount received; 70% is taken"});
  b+=row("j · Less 30%",cell(r.j),{ref:"1j",ind:1});
  b+=row("k · Income from house property "+ordinal+" (1f − 1i + 1j)",cell(r.k),{ref:"1k",cls:"grand"});
  return '<div class="blk'+(on?" on":"")+'"><div class="bh">'+
    '<button class="bhx" data-blk="'+id+'"><span class="cv2">'+(on?"−":"+")+'</span>'+
    '<span class="t">Property '+ordinal+(st0(p.addr)?" — "+st0(p.addr):"")+'</span>'+
    '<span class="s">'+esc(status)+'</span></button>'+
    '<button class="blkdel" data-del="hp.props.'+i+'" title="Remove">'+TRASH+'</button>'+
    '</div><div class="bb">'+(on?b:"")+'</div></div>';
}
function secHP(){
  const P=S.C.hp;let h="";
  h+=row("Is there income or a loss from house property?",sel("hp.on",[["","No"],["1","Yes"]],{blank:false}),{req:1});
  if(!S.hp.on)return h;
  h+=note("One block per property, as many as there are. The section 24(b) loan table sits inside each "+
    "block and sums into its interest. Rent and taxes are entered in full; a co-owner's share is applied "+
    "once, at f.");
  if(isNew())h+=note("Under the new regime interest on a self-occupied house gives nothing, and a loss "+
    "under this head cannot be set against any other income.","warn");
  if(P.selfCount>2)h+=note("Section 23(4) allows two self-occupied properties. The third and any further "+
    "are treated as <b>deemed let out</b> — change their type.","stop");
  (S.hp.props||[]).forEach((p,i)=>h+=hpBlock(p,i,i+1));
  h+='<button class="add" data-addprop="1">Add a property</button>';
  h+='<div class="cgband">Across all properties</div>';
  h+=row("Σ1k · Income from all properties",cell(P.sum1k),{cls:"tot"});
  h+=row("2 · Pass-through income or loss under this head — from Schedule PTI",cell(P.pti),{ref:"2",hint:"the house-property row of every block in Schedule PTI"});
  h+=row("3 · Income under the head Income from house property (Σ1k + 2)",cell(P.income),{ref:"3",cls:"grand",
    hint:P.income<0?(isNew()?"a loss — not set against other heads under the new regime":"a loss — to 2(i) of Schedule CYLA, set against other heads up to ₹2,00,000"):""});
  return h;
}

/* ---------------- 7 · Deductions — Schedule VI-A, from the sheet ------ */
function insTable(key){
  return grid(key,[{k:"insurer",h:"Name of the insurer",t:"txt",w:"auto",req:1},
    {k:"policy",h:"Policy number",t:"txt",w:"180px",req:1},{k:"amt",h:"Health insurance amount",t:"num",w:"160px",req:1}],
    get(key)||[],{min:"720px",empty:"No policy listed.",add:"Add a policy"});
}
function pensionTable(key,withName){
  return grid(key,[{k:"type",h:"Type of identifier",t:"sel",w:"220px",req:1,opts:IDENT_TYPE},
    {k:"id",h:withName?"Name of identifier":"Identifier number",t:"txt",w:"auto",req:1},
    {k:"amt",h:"Amount",t:"num",w:"150px",req:1}],get(key)||[],{min:"640px",empty:"None listed.",add:"Add a row"});
}
function loanTable(key,intKey){
  const extra=key==="e80.eeb"?[{k:"reg",h:"Vehicle registration number",t:"txt",w:"150px",max:11,req:1}]:[];
  return grid(key,[{k:"from",h:"Loan taken from",t:"sel",w:"150px",req:1,opts:LOANFROM},...extra,
    {k:"name",h:"Name of the bank, institution or person",t:"txt",w:"auto",req:1},
    {k:"acno",h:"Loan account number",t:"txt",w:"160px",req:1},{k:"dt",h:"Date of sanction",t:"date",w:"130px",req:1},
    {k:"amt",h:"Total loan",t:"num",w:"130px",req:1},{k:"os",h:"Outstanding on 31-03-2026",t:"num",w:"150px",req:1},
    {k:"interest",h:"Interest in the year",t:"num",w:"140px",req:1}],get(key)||[],{min:"1240px",empty:"No loan.",add:"Add a loan"});
}
function secDed(){
  const V=S.C.via,D8=S.C.d80;let h="";
  if(S.pi.res!=="RES")h+=note("A non-resident cannot claim 80DD, 80DDB, 80U, 80TTB, 80QQB or 80RRB. Yukti allows only what a non-resident may.","warn");
  if(isNew())h+=note("<b>Under section 115BAC only 80CCD(2) and 80CCH survive.</b> Type the rest if you want the comparison in Return and regime to use them.","stop");
  h+='<div class="cgband">1 · Part B — Deduction in respect of certain payments</div>';
  h+='<div class="r sub"><div class="l">Section</div><div class="ref"></div><div class="v2 hd2">You claim</div><div class="v hd2">System calculated</div></div>';
  const fedNote={c80d:"from Schedule 80D",c80g:"from Schedule 80G",c80gga:"from Schedule 80GGA",c80ggc:"from Schedule 80GGC",
    c80e:"from the 80E loan table",c80ee:"from the 80EE loan table",c80eea:"from the 80EEA loan table",c80eeb:"from the 80EEB loan table",c80dd:"from Schedule 80DD"};
  const partC=["c80qqb"];
  VIA.forEach(x=>{const [k,ref,label,cap]=x;
    if(k==="c80qqb")h+='<div class="cgband">2 · Part C, CA and D — Deduction in respect of certain incomes and other deductions</div>';
    const open=!isNew()||VIA_NEW.indexOf(k)>=0;
    const fedK=V.fed&&V.fed[k]!==undefined&&(fedNote[k]||["c80c","c80ccc","c80ccd1","c80ccd1b"].indexOf(k)>=0&&((k==="c80c"?S.c80c:k==="c80ccc"?S.pen80ccc:k==="c80ccd1"?S.pen80ccd1:S.pen80ccd1b)||[]).length);
    h+='<div class="r'+(open?"":" closed")+'"><div class="l">'+esc(label)+
       (cap?'<span class="hint">ceiling '+RS(cap)+'</span>':'')+(fedK&&fedNote[k]?'<span class="hint">'+fedNote[k]+'</span>':'')+
       (!open&&N(S.via[k])?'<span class="hint">closed by section 115BAC</span>':'')+'</div>'+
       '<div class="ref">'+esc(ref)+'</div>'+
       '<div class="v2">'+(fedK?cell(V.fed[k]):inp("via."+k,{n:1}))+'</div>'+
       '<div class="v">'+cell(V.out[k])+'</div></div>';
    if(k==="c80ccc")h+=fold("pccc","b","Identifier details for 80CCC",(S.pen80ccc||[]).length?(S.pen80ccc||[]).length+" rows":"optional",pensionTable("pen80ccc",false));
    if(k==="c80ccd1")h+=fold("pccd1","c","Identifier details for 80CCD(1)",(S.pen80ccd1||[]).length?(S.pen80ccd1||[]).length+" rows":"optional",pensionTable("pen80ccd1",true));
    if(k==="c80ccd1b")h+=fold("pccd1b","d","Identifier details for 80CCD(1B), with the PRAN",(S.pen80ccd1b||[]).length?(S.pen80ccd1b||[]).length+" rows":"optional",
      pensionTable("pen80ccd1b",true)+row("PRAN",inp("via.pran",{max:12}),{ind:1,hint:"permanent retirement account number"}));
    if(k==="c80ddb"&&N(S.via.c80ddb)){
      h+=row("Claimed for",sel("via.ddb_type",[["1","Self or dependant"],["2","Self or dependant — senior citizen"]],{blank:false}),{req:1,ind:1,hint:"₹40,000, or ₹1,00,000 for a senior citizen"});
      h+=row("Name of the specified disease",sel("via.ddb_disease",DISEASE80DDB),{req:1,ind:1});}
    if(k==="c80gg"&&N(S.via.c80gg))h+=row("Acknowledgement number of Form 10BA",inp("via.ack10ba",{max:15}),{req:1,ind:1,hint:"fifteen digits"});
    if(k==="c80qqb"&&N(S.via.c80qqb))h+=row("Acknowledgement number of Form 10CCD",inp("via.ack10ccd",{max:15}),{req:1,ind:1});
    if(k==="c80rrb"&&N(S.via.c80rrb))h+=row("Acknowledgement number of Form 10CCE",inp("via.ack10cce",{max:15}),{req:1,ind:1});
  });
  h+=row("v · Deductions — total of a to ua",cell(V.total),{ref:"v",cls:"tot"});
  if(V.clipped)h+=row("Limited to gross total income",cell(V.allowed),{cls:"tot"});
  h+=row("Deduction under Chapter VI-A",cell(V.allowed),{cls:"grand"});

  h+='<div class="cgband">The schedules behind the figures</div>';
  /* 80C */
  h+=card("80c","Section 80C — the items",(S.c80c||[]).length?RS((S.c80c||[]).reduce((s,r)=>s+N(r.amt),0)):"",
    grid("c80c",[{k:"amt",h:"Amount eligible for deduction under 80C",t:"num",w:"220px",req:1},
      {k:"id",h:"Policy number or document identification number",t:"txt",w:"auto",req:1}],
      S.c80c||[],{min:"640px",empty:"No item listed.",add:"Add an item",foot:[{l:1,v:"Total deduction under 80C",span:1},{v:(S.c80c||[]).reduce((s,r)=>s+N(r.amt),0)}]}));
  /* 80D — the four blocks */
  const d=S.d80||{};
  h+=card("80d","Schedule 80D — health insurance",D8.eligible?RS(D8.eligible):"",
    row("If you are an individual, whether you or any of your family member, excluding parents, is a senior citizen?",
      sel("d80.selfSr",[["N","No"],["Y","Yes"],["N/A","Not claiming for self or family"]],{blank:false}),{req:1})+
    (d.selfSr==="N"?(sub("a · Self and family")+sub("(i) Health insurance — details of insurance")+insTable("d80.selfIns")+
      row("(ii) Preventive health check-up",inp("d80.selfPHC",{n:1}),{ind:1})):"")+
    (d.selfSr==="Y"?(sub("b · Self and family — senior citizen")+sub("(i) Health insurance — details of insurance")+insTable("d80.selfSrIns")+
      row("(ii) Preventive health check-up",inp("d80.selfSrPHC",{n:1}),{ind:1})+
      row("(iii) Medical expenditure — claimable only where no health insurance is taken",inp("d80.selfSrMed",{n:1}),{ind:1})):"")+
    row("Whether any one of your parents is a senior citizen?",sel("d80.parSr",[["N","No"],["Y","Yes"],["N/A","Not claiming for parents"]],{blank:false}),{req:1})+
    (d.parSr==="N"?(sub("a · Parents")+sub("(i) Health insurance — details of insurance")+insTable("d80.parIns")+
      row("(ii) Preventive health check-up",inp("d80.parPHC",{n:1}),{ind:1})):"")+
    (d.parSr==="Y"?(sub("b · Parents — senior citizen")+sub("(i) Health insurance — details of insurance")+insTable("d80.parSrIns")+
      row("(ii) Preventive health check-up",inp("d80.parSrPHC",{n:1}),{ind:1})+
      row("(iii) Medical expenditure — claimable only where no health insurance is taken",inp("d80.parSrMed",{n:1}),{ind:1})):"")+
    row("Self and family — eligible",cell(D8.selfTot),{cls:"tot",hint:D8.selfSr?"up to ₹50,000":"up to ₹25,000"})+
    row("Parents — eligible",cell(D8.parTot),{cls:"tot",hint:D8.parSr?"up to ₹50,000":"up to ₹25,000"})+
    row("Eligible amount of deduction",cell(D8.eligible),{cls:"grand",hint:"preventive check-up sits inside the ceilings, ₹5,000 in all"}));
  /* 80DD */
  h+=card("80dd","Schedule 80DD — a dependant with a disability",N((S.dd80||{}).amt)?RS(N(S.dd80.amt)):"",
    row("Nature of disability",sel("dd80.nature",DD_NATURE),{req:1})+row("Type of disability",sel("dd80.type",DD_TYPE),{req:1})+
    row("Amount of deduction",inp("dd80.amt",{n:1}),{req:1,hint:"₹75,000, or ₹1,25,000 for a severe disability"})+
    row("Dependant",sel("dd80.dep",DD_DEP),{req:1})+row("PAN of the dependant",inp("dd80.pan",{max:10}))+
    row("Aadhaar of the dependant",inp("dd80.aadhaar",{max:12}))+row("Date of filing of Form 10-IA",dte("dd80.f10dt"))+
    row("Acknowledgement number of Form 10-IA",inp("dd80.f10ack",{max:15}))+row("UDID number",inp("dd80.udid"))+
    formNote("<b>Form 10-IA</b> has to be filed before the return."));
  /* 80U */
  h+=card("80u","Schedule 80U — the person has a disability",N(S.via.c80u)?RS(V.out.c80u):"",
    row("Nature of the disability",sel("u80.nature",[["Self","Disability — 40% or more"],["SelfSevere","Severe disability — 80% or more"]]),{req:1})+
    row("Type of disability",sel("u80.type",DD_TYPE),{req:1})+
    row("Date of filing of Form 10-IA",dte("u80.dt"))+row("Acknowledgement number of Form 10-IA",inp("u80.ack",{max:15}))+
    row("UDID number",inp("u80.udid"))+formNote("<b>Form 10-IA</b> has to be filed before the return."));
  /* 80E group */
  const e=S.e80||{};const et=k=>(e[k]||[]).reduce((s,r)=>s+N(r.interest),0);
  h+=card("80e","80E, 80EE, 80EEA, 80EEB — loans, lender by lender",(et("e")+et("ee")+et("eea")+et("eeb"))?RS(et("e")+et("ee")+et("eea")+et("eeb")):"",
    sub("80E — interest on a loan taken for higher education")+loanTable("e80.e")+
    sub("80EE — interest on a loan taken for a residential house")+loanTable("e80.ee")+
    sub("80EEA — interest on a loan taken for certain house property")+row("Stamp duty value of the property",inp("e80.eeaSdv",{n:1}),{req:1,hint:"not over ₹45 lakh for the deduction"})+loanTable("e80.eea")+
    sub("80EEB — interest on a loan taken to buy an electric vehicle")+loanTable("e80.eeb"));
  /* 80G */
  h+=card("80g","Schedule 80G — donations, donee by donee",(S.g80||[]).length?RS((S.g80||[]).reduce((s,r)=>s+N(r.amt),0)):"",
    note("<b>Where any row is filled, every field in that row becomes mandatory.</b>")+
    grid("g80",[{k:"bucket",h:"Bucket",t:"sel",w:"230px",req:1,opts:[["A","100% without a qualifying limit"],["B","50% without a qualifying limit"],["C","100% subject to the limit"],["D","50% subject to the limit"]]},
      {k:"name",h:"Name of the donee",t:"txt",w:"auto",req:1},{k:"addr",h:"Address",t:"txt",w:"auto",req:1},{k:"city",h:"City",t:"txt",w:"120px",req:1},
      {k:"state",h:"State",t:"sel",w:"150px",req:1,opts:Object.keys(STATE).map(k=>[k,STATE[k]])},{k:"pin",h:"PIN",t:"txt",w:"90px",max:6,req:1},
      {k:"pan",h:"PAN of the donee",t:"txt",w:"120px",max:10,req:1},{k:"arn",h:"ARN — donation reference",t:"txt",w:"150px",max:25},
      {k:"cash",h:"In cash",t:"num",w:"100px"},{k:"other",h:"Other mode",t:"num",w:"100px"},
      {k:"ref",h:"Transaction reference — UPI, cheque, IMPS, NEFT, RTGS",t:"txt",w:"170px",max:50},{k:"ifsc",h:"IFSC of the bank",t:"txt",w:"110px",max:11},
      {k:"amt",h:"Total",t:"num",w:"120px",req:1}],S.g80||[],{min:"2000px",empty:"No donation listed.",add:"Add a donee",
      foot:[{l:1,v:"Total donated",span:12},{v:(S.g80||[]).reduce((s,r)=>s+N(r.amt),0)}]})+
    note("A donation in cash above ₹2,000 gives no deduction. For a donation by any other mode the transaction reference and the bank's IFSC are mandatory.","warn"));
  /* 80GGA + RA */
  h+=card("80gga","Schedule 80GGA — donations for scientific research or rural development",(S.gga||[]).length?RS((S.gga||[]).reduce((s,r)=>s+N(r.amt),0)):"",
    grid("gga",[{k:"clause",h:"Relevant clause",t:"sel",w:"auto",req:1,opts:GGA_CLAUSE},{k:"name",h:"Name of the donee",t:"txt",w:"auto",req:1},
      {k:"addr",h:"Address",t:"txt",w:"auto",req:1},{k:"city",h:"City",t:"txt",w:"110px",req:1},
      {k:"state",h:"State",t:"sel",w:"140px",req:1,opts:Object.keys(STATE).map(k=>[k,STATE[k]])},{k:"pin",h:"PIN",t:"txt",w:"80px",max:6,req:1},
      {k:"pan",h:"PAN of the donee",t:"txt",w:"120px",max:10,req:1},{k:"mode",h:"Mode",t:"sel",w:"110px",req:1,opts:[["CASH","Cash"],["OTH","Other"]]},
      {k:"amt",h:"Amount",t:"num",w:"120px",req:1}],S.gga||[],{min:"1600px",empty:"No donation listed.",add:"Add a donee"})+
    note("A donation in cash above ₹10,000 gives no deduction.","warn")+
    sub("Schedule RA — the research associations, universities and institutions the donation went to, under 35(1)(ii), (iia), (iii) and 35(2AA)")+
    grid("ra",[{k:"name",h:"Name of the donee",t:"txt",w:"auto",req:1},{k:"addr",h:"Address",t:"txt",w:"auto",req:1},
      {k:"city",h:"City or town or district",t:"txt",w:"140px",req:1},{k:"state",h:"State code",t:"sel",w:"140px",req:1,opts:Object.keys(STATE).map(k=>[k,STATE[k]])},
      {k:"pin",h:"PIN code",t:"txt",w:"90px",max:6,req:1},{k:"pan",h:"PAN of the donee",t:"txt",w:"120px",max:10,req:1},
      {k:"cash",h:"Donation in cash",t:"num",w:"120px"},{k:"other",h:"Donation in other mode",t:"num",w:"140px"}],
      S.ra||[],{min:"1300px",empty:"None listed.",add:"Add a donee"}));
  /* 80GGC */
  h+=card("80ggc","Schedule 80GGC — contribution to a political party or an electoral trust",(S.ggc||[]).length?RS((S.ggc||[]).reduce((s,r)=>s+N(r.amt),0)):"",
    grid("ggc",[{k:"dt",h:"Date of contribution",t:"date",w:"130px",req:1},{k:"name",h:"Name of the party or trust",t:"txt",w:"auto"},
      {k:"pan",h:"PAN",t:"txt",w:"120px",max:10},{k:"mode",h:"Mode",t:"sel",w:"110px",req:1,opts:[["CASH","Cash"],["OTH","Other than cash"]]},
      {k:"ref",h:"Transaction reference",t:"txt",w:"170px"},{k:"ifsc",h:"IFSC",t:"txt",w:"120px",max:11},{k:"amt",h:"Amount",t:"num",w:"120px",req:1}],
      S.ggc||[],{min:"1100px",empty:"No contribution listed.",add:"Add a contribution"})+
    note("A contribution in cash gives no deduction at all.","warn"));

  h+='<div class="cgband">How the total income comes out</div>';
  h+=row("Gross total income",cell(S.C.gti),{cls:"tot"});
  h+=row("Less: deductions under Chapter VI-A",cell(-V.allowed));
  h+=row("Total income",cell(S.C.ti),{cls:"grand",hint:"rounded to the nearest ten rupees"});
  return h;
}

/* ---------------- 8 · Losses — CYLA · BFLA · CFL, from the utility --- */
function secLoss(){
  const L=S.C.loss,X=S.loss||{};let h="";
  /* ===== CYLA ===== */
  h+='<div class="cgband">Schedule CYLA — Details of income after set-off of current year\'s losses</div>';
  h+=note("This year's house-property loss and other-sources loss are set against the other heads, in the "+
    "order the utility uses. A house-property loss goes against other heads only up to ₹2,00,000"+
    (isNew()?" — and not at all under the new regime":"")+"; the excess goes straight to Schedule CFL. "+
    "An other-sources loss not set off here lapses.");
  const ed=!!X.editC;
  h+='<div class="full"><table class="gt" style="min-width:1060px"><thead><tr><th class="l" style="width:34px">Sl.</th>'+
     '<th class="l" style="min-width:300px">Head / source of income</th><th style="width:130px">Income of current year — positive only</th>'+
     '<th style="width:150px">House property loss of the current year set off</th><th style="width:150px">Net loss from other sources at normal rates set off</th>'+
     '<th style="width:130px">Current year\'s income remaining after set-off</th></tr></thead><tbody>';
  h+='<tr><td class="l">i</td><td class="l"><b>Loss to be set off — negative figures only</b></td><td></td>'+
     '<td class="num">'+cell(-L.hpCapped)+(L.hpExcess?'<span class="dt">+ '+F(L.hpExcess)+' over ₹2 lakh, to CFL</span>':'')+'</td>'+
     '<td class="num">'+cell(-L.osLoss)+'</td><td></td></tr>';
  const sl=["ii","iii","iv","v","vi","vii","viii","ix","x","xi","xii"];
  LOSS_ROWS.forEach((r,i)=>{const [k,label,,f]=r;
    h+='<tr><td class="l">'+sl[i]+'</td><td class="l">'+esc(label)+'</td><td class="num">'+cell(L.inc[k])+'</td>'+
       '<td class="num"'+(f.hp?'':' style="background:var(--closed)"')+'>'+(f.hp?(ed?inp("loss.cylaOver."+k+".hp",{n:1}):cell(L.setHP[k])):'')+'</td>'+
       '<td class="num"'+(f.os?'':' style="background:var(--closed)"')+'>'+(f.os?(ed?inp("loss.cylaOver."+k+".os",{n:1}):cell(L.setOS[k])):'')+'</td>'+
       '<td class="num">'+cell(L.afterC[k])+'</td></tr>';});
  h+='</tbody><tfoot><tr><td class="l">xiii</td><td class="l">Total loss set-off (ii to xii)</td><td></td><td>'+F(L.totHPset)+'</td><td>'+F(L.totOSset)+'</td><td></td></tr>'+
     '<tr><td class="l">xiv</td><td class="l">Loss remaining after set-off (i − xiii)</td><td></td><td>'+F(L.hpRemain)+'<span class="dt">to CFL</span></td><td>'+F(L.osRemain)+'<span class="dt">lapses</span></td><td></td></tr></tfoot></table></div>';
  h+=row("Do you want to edit the details auto-populated in the table above?",sel("loss.editC",[["","No"],["1","Yes"]],{blank:false}));
  /* ===== BFLA ===== */
  h+='<div class="cgband">Schedule BFLA — Details of income after set-off of brought-forward losses of earlier years</div>';
  h+=note("Losses brought forward from Schedule CFL, set against what is left after CYLA. A house-property loss "+
    "against house-property income only; a short-term capital loss against any capital gain; a long-term loss "+
    "against long-term gains only, and it goes first; a race-horse loss against race-horse income only. Nothing "+
    "against salary or the other-sources rows.");
  const edB=!!X.editB;
  h+='<div class="full"><table class="gt" style="min-width:960px"><thead><tr><th class="l" style="width:34px">Sl.</th>'+
     '<th class="l" style="min-width:300px">Head / source of income</th><th style="width:150px">Income after set-off of current year\'s losses — 5 of CYLA</th>'+
     '<th style="width:150px">Brought forward loss set off</th><th style="width:150px">Current year\'s income remaining after set-off</th></tr></thead><tbody>';
  const slB=["i","ii","iii","iv","v","vi","vii","viii","ix","x","xi"];
  LOSS_ROWS.forEach((r,i)=>{const [k,label,,f]=r;
    h+='<tr><td class="l">'+slB[i]+'</td><td class="l">'+esc(label)+'</td><td class="num">'+cell(L.afterC[k])+'</td>'+
       '<td class="num"'+(f.bf?'':' style="background:var(--closed)"')+'>'+(f.bf?(edB?inp("loss.bflaOver."+k,{n:1}):cell(L.setBF[k])):'')+'</td>'+
       '<td class="num">'+cell(L.afterB[k])+'</td></tr>';});
  h+='</tbody><tfoot><tr><td class="l">xii</td><td class="l">Total of brought forward loss set off</td><td></td><td>'+F(L.totBFset)+'</td><td></td></tr>'+
     '<tr><td class="l">xiii</td><td class="l">Current year\'s income remaining after set-off — gross total income</td><td></td><td></td><td>'+F(L.gti)+'</td></tr></tfoot></table></div>';
  h+=row("Do you want to edit the details auto-populated in the table above?",sel("loss.editB",[["","No"],["1","Yes"]],{blank:false}));
  (L.val||[]).forEach(m=>h+=note(m,"stop"));
  /* ===== CFL ===== */
  h+='<div class="cgband">Schedule CFL — Details of losses to be carried forward to future years</div>';
  h+=note("One row per assessment year. The date of filing is required on any year that carries a loss — a loss "+
    "carries only if that year's return was filed in time. A race-horse loss carries four years, so its column "+
    "exists only on the last four rows. Dates are "+DF+".");
  h+='<div class="full"><table class="gt" style="min-width:1000px"><thead><tr><th class="l" style="width:34px">Sl.</th>'+
     '<th class="l" style="width:110px">Assessment year</th><th class="l" style="width:130px">Date of filing '+DF+'</th>'+
     '<th style="width:150px">House property loss</th><th style="width:150px">Short-term capital loss</th>'+
     '<th style="width:150px">Long-term capital loss</th><th style="width:170px">Loss from owning and maintaining race horses</th></tr></thead><tbody>';
  const slC=["i","ii","iii","iv","v","vi","vii","viii"];
  CFL_YEARS.forEach(([y,,horseOK],i)=>{const p="loss.cfl."+y+".";
    h+='<tr><td class="l">'+slC[i]+'</td><td class="l">'+y+'</td><td>'+inp(p+"dt",{ph:DF,max:10})+'</td>'+
       '<td>'+inp(p+"hp",{n:1})+'</td><td>'+inp(p+"st",{n:1})+'</td><td>'+inp(p+"lt",{n:1})+'</td>'+
       '<td'+(horseOK?'':' style="background:var(--closed)"')+'>'+(horseOK?inp(p+"horse",{n:1}):'')+'</td></tr>';});
  h+='</tbody><tfoot>'+
     '<tr><td class="l">ix</td><td class="l" colspan="2">Total of earlier year losses</td><td>'+F(L.bf.hp)+'</td><td>'+F(L.bf.st)+'</td><td>'+F(L.bf.lt)+'</td><td>'+F(L.bf.horse)+'</td></tr>'+
     '<tr><td class="l">x</td><td class="l" colspan="2">Adjustment of above losses in Schedule BFLA</td><td>'+F(L.usedBF.hp)+'</td><td>'+F(L.usedBF.st)+'</td><td>'+F(L.usedBF.lt)+'</td><td>'+F(L.usedBF.horse)+'</td></tr>'+
     '<tr><td class="l">xi</td><td class="l" colspan="2">2026-27 — current year losses</td><td>'+F(L.curr.hp)+'</td><td>'+F(L.curr.st)+'</td><td>'+F(L.curr.lt)+'</td><td>'+F(L.curr.horse)+'</td></tr>'+
     '<tr><td class="l">xii</td><td class="l" colspan="2">Total loss carried forward to future years</td><td>'+F(L.cf.hp)+'</td><td>'+F(L.cf.st)+'</td><td>'+F(L.cf.lt)+'</td><td>'+F(L.cf.horse)+'</td></tr></tfoot></table></div>';
  const lp=["hp","st","lt","horse"].filter(k=>L.lapsed[k]>0);
  if(lp.length)h+=note("<b>Lapsed this year:</b> "+lp.map(k=>({hp:"house property",st:"short-term capital",lt:"long-term capital",horse:"race horse"})[k]+" "+RS(L.lapsed[k])).join(", ")+
    " — the "+(lp.indexOf("horse")>=0&&lp.length===1?"2022-23":"2018-19")+" loss that BFLA did not use has reached the end of its window.","warn");
  return h;
}

/* ---------------- 9 · Taxes paid — book 01 ---------------------------- */
function secPaid(){
  const P=S.C.paid;let h="";
  h+=formNote("Check every figure against <b>Form 26AS</b> and the annual information statement. Wherever possible the head of income is pre-filled from the section — please verify.");
  h+='<div class="cgband">TDS 1 · 20B — Tax deducted at source from salary, as per Form 16</div>';
  h+=grid("tds1",[{k:"tan",h:"TAN of the employer",t:"txt",w:"130px",max:10,req:1},{k:"name",h:"Name of employer",t:"txt",w:"auto",req:1},
    {k:"inc",h:"Income chargeable under salaries",t:"num",w:"180px",req:1},{k:"tds",h:"Total tax deducted",t:"num",w:"140px",req:1}],
    S.tds1||[],{min:"900px",empty:"No salary TDS.",add:"Add an employer",foot:[{l:1,v:"Total — to 15b of Part B-TTI",span:3},{v:P.t1}]});
  const tdsCols=(buyer)=>[{k:"who",h:"TDS credit relating to",t:"sel",w:"120px",req:1,opts:[["S","Self"],["O","Other person"]]},
    {k:"othPan",h:"PAN of other person",t:"txt",w:"120px",max:10},{k:"othAadh",h:"Aadhaar of other person",t:"txt",w:"130px",max:12},
    buyer?{k:"pan",h:"PAN of the buyer / tenant",t:"txt",w:"130px",max:10,req:1}:{k:"tan",h:"TAN of the deductor",t:"txt",w:"120px",max:10,req:1},
    ...(buyer?[{k:"aadh",h:"Aadhaar of buyer / tenant",t:"txt",w:"130px",max:12}]:[]),
    {k:"sec",h:"Section",t:"sel",w:"110px",req:1,opts:TDSSEC.map(x=>[x[0],x[0]])},
    {k:"bf",h:"Unclaimed TDS b/f",t:"num",w:"110px"},{k:"yr",h:"FY of that b/f deduction",t:"sel",w:"100px",opts:DEDYR.map(y=>[y,y])},
    {k:"dedOwn",h:"Deducted in own hands",t:"num",w:"120px"},{k:"dedOthInc",h:"Deducted in other's hands — income",t:"num",w:"120px"},{k:"dedOthTds",h:"— TDS",t:"num",w:"100px"},
    {k:"claimOwn",h:"Claimed in own hands",t:"num",w:"120px",req:1},{k:"claimOthInc",h:"Claimed in other's hands — income",t:"num",w:"120px"},{k:"claimOthTds",h:"— TDS",t:"num",w:"100px"},
    {k:"claimOthPan",h:"— PAN",t:"txt",w:"110px",max:10},{k:"claimOthAadh",h:"— Aadhaar",t:"txt",w:"120px",max:12},
    {k:"gross",h:"Gross receipt offered",t:"num",w:"120px"},{k:"head",h:"Head of income",t:"sel",w:"120px",opts:buyer?TDS_HEADS.slice(0,4):TDS_HEADS},
    {k:"cf",h:"TDS credit carried forward",t:"calc",w:"120px",f:r=>r._cf||0}];
  h+='<div class="cgband">TDS 2 · 20C(1) — Tax deducted on income other than salary, as per Form 16A / 16D</div>';
  h+=note("Deducted = claimed + carried forward. The credit may be claimed only where the corresponding income is offered this year under the head named. Credit in another person's hands is the spouse under section 5A or any other person under rule 37BA(2).");
  h+=grid("tds2",tdsCols(false),S.tds2||[],{min:"2600px",empty:"No other TDS.",add:"Add a deduction",foot:[{l:1,v:"Claimed in own hands — to 15b",span:11},{v:P.t2},{v:""},{v:""},{v:""},{v:""},{v:""},{v:""},{v:""}]});
  (S.tds2||[]).forEach((r,i)=>{if(r._over)h+=note("TDS 2 row "+(i+1)+": claimed "+RS(r._claimed)+" exceeds the "+RS(r._avail)+" deducted and brought forward.","stop");});
  h+='<div class="cgband">TDS 3 · 20C — Tax deducted under 194IA, 194IB, 194M, 194S, as per Form 16B / 16C / 16D / 16E</div>';
  h+=grid("tds3",tdsCols(true),S.tds3||[],{min:"2700px",empty:"Nothing under these sections.",add:"Add a deduction",foot:[{l:1,v:"Claimed in own hands — to 15b",span:12},{v:P.t3},{v:""},{v:""},{v:""},{v:""},{v:""},{v:""},{v:""}]});
  (S.tds3||[]).forEach((r,i)=>{if(r._over)h+=note("TDS 3 row "+(i+1)+": claimed exceeds the deducted and brought forward.","stop");});
  h+='<div class="cgband">TCS · D — Tax collected at source, as per Form 27D</div>';
  h+=grid("tcs",[{k:"who",h:"TCS credit relating to",t:"sel",w:"120px",req:1,opts:[["1","Self"],["2","Other person"]]},
    {k:"tan",h:"TAN of the collector",t:"txt",w:"120px",max:10,req:1},{k:"othPan",h:"PAN of other person",t:"txt",w:"120px",max:10},
    {k:"bf",h:"Unclaimed TCS b/f",t:"num",w:"110px"},{k:"yr",h:"FY of that b/f collection",t:"sel",w:"100px",opts:DEDYR.map(y=>[y,y])},
    {k:"collOwn",h:"Collected in own hands",t:"num",w:"120px"},{k:"collOth",h:"Collected in other's hands",t:"num",w:"120px"},
    {k:"claimOwn",h:"Claimed in own hands",t:"num",w:"120px",req:1},{k:"claimOth",h:"Claimed in other's hands — TCS",t:"num",w:"120px"},{k:"claimOthPan",h:"— PAN",t:"txt",w:"110px",max:10},
    {k:"cf",h:"Carried forward",t:"calc",w:"110px",f:r=>r._cf||0}],S.tcs||[],{min:"1500px",empty:"Nothing collected.",add:"Add a collection",
    foot:[{l:1,v:"Claimed in own hands — to 15c",span:7},{v:P.tcs},{v:""},{v:""},{v:""}]});
  h+='<div class="cgband">IT · 17A — Advance tax and self-assessment tax</div>';
  h+=note("A challan dated on or before 31 March 2026 is advance tax; after it, self-assessment tax. The date also places each advance challan in its 234C instalment.");
  h+=grid("it",[{k:"bsr",h:"BSR code",t:"txt",w:"130px",max:7,req:1},{k:"dt",h:"Date of deposit",t:"date",w:"150px",req:1},
    {k:"sn",h:"Serial number of challan",t:"txt",w:"170px",max:5,req:1},{k:"amt",h:"Amount",t:"num",w:"150px",req:1},
    {k:"kind",h:"Treated as",t:"calc",w:"130px",f:r=>0}],S.it||[],{min:"820px",empty:"No challan.",add:"Add a challan",
    foot:[{l:1,v:"Advance "+F(P.adv)+" · self-assessment "+F(P.sat),span:3},{v:P.adv+P.sat},{v:""}]});
  h+=row("15a · Advance tax",cell(P.adv));h+=row("15b · TDS — TDS 1 col 5 + TDS 2 col 9 + TDS 3 col 9",cell(P.tds));
  h+=row("15c · TCS — col 7(i)",cell(P.tcs));h+=row("15d · Self-assessment tax",cell(P.sat));
  h+=row("15e · Total taxes paid",cell(P.paid),{cls:"grand"});
  return h;
}

/* ---------------- 10 · Exempt income — book 05 ------------------------ */
function secEI(){
  const E=S.C.ei2,X=S.ei2||{};let h="";
  h+=note("Income not to be included in total income or not chargeable to tax. Nothing here is taxed — but net agricultural income counts for the rate, and the pass-through line reconciles to Schedule PTI.");
  h+=row("1 · Interest income",inp("ei2.interest",{n:1}),{ref:"1"});
  h+='<div class="cgband">2 · Agricultural income</div>';
  h+=row("i · Gross agricultural receipts — other than income to be excluded under rule 7A, 7B or 8",inp("ei2.agriGross",{n:1}),{ref:"2i"});
  h+=row("ii · Expenditure incurred on agriculture",inp("ei2.agriExp",{n:1}),{ref:"2ii"});
  h+=row("iii · Unabsorbed agricultural loss of the previous eight assessment years",inp("ei2.agriUnab",{n:1}),{ref:"2iii"});
  h+=row("iv · Net agricultural income for the year (i − ii − iii) — nil if loss",cell(E.netAgri),{ref:"2iv",cls:"tot",hint:E.netAgri>5000?"counts for the rate in Part B-TI line 14":""});
  if(E.landReq){h+=note("Net agricultural income exceeds ₹5 lakh — the land particulars are required.","warn");
    h+=grid("ei2.land",[{k:"district",h:"Name of district",t:"txt",w:"auto",req:1},{k:"pin",h:"PIN code",t:"txt",w:"90px",max:6,req:1},
      {k:"acres",h:"Measurement in acres",t:"num",w:"130px",req:1},{k:"owned",h:"Owned or leased",t:"sel",w:"130px",req:1,opts:[["O","Owned"],["H","Held on lease"]]},
      {k:"irr",h:"Irrigated or rain-fed",t:"sel",w:"130px",req:1,opts:[["IRG","Irrigated"],["RF","Rain-fed"]]}],X.land||[],{min:"760px",empty:"No parcel listed.",add:"Add a parcel"});}
  h+='<div class="cgband">3 · Other exempt income, including exempt income of a minor child</div>';
  const subsFor=cat=>EISUB.filter(x=>({AGRI:/^10\(30\)|^10\(31\)|^10\(37\)$/,GOVC:/10\(10BB\)|10\(10BC\)|10\(17A\)|10\(12AB\)/,ISI:/10\(15\)|10\(23FBB\)|10\(23FD\)|10\(35|10\(23FBC\)|10\(33\)|10\(4B\)|10\(4C\)|10\(4E\)|10\(36\)|10\(37A\)/,
    SSRA:/10\(12C\)|10\(18\)|10\(19\)|DMD/,SRSC:/10\(32\)|10\(43\)/,SRST:/10\(19A\)|10\(26|10\(26AAA\)/,SRPC:/10\(10D\)|10\(11\)|10\(12\)|10\(11A\)|10\(12A\)|10\(12B\)|10\(13\)/,OTH:/./,OTHN:/10\(4\)|10\(15\)\(iv\)|10\(4D\)|10\(6/}[cat]||/./).test(x[0]));
  h+='<div class="full"><table class="gt" style="min-width:1000px"><thead><tr><th class="l" style="width:220px">Category</th><th class="l" style="width:300px">Sub-category</th><th class="l">Description</th><th style="width:140px">Amount</th><th class="x"></th></tr></thead><tbody>';
  if(!(X.others||[]).length)h+='<tr><td class="emp" colspan="5">No other exempt income.</td></tr>';
  (X.others||[]).forEach((r,i)=>{const p="ei2.others."+i+".";
    h+='<tr><td class="l">'+sel(p+"cat",EICAT,{style:"width:100%"})+'</td><td class="l">'+sel(p+"sub",subsFor(r.cat||"OTH").map(x=>[x[0],x[1].slice(0,60)]),{style:"width:100%"})+'</td>'+
       '<td>'+inp(p+"desc",{max:125})+'</td><td>'+inp(p+"amt",{n:1})+'</td><td class="x"><button data-del="ei2.others.'+i+'">'+TRASH+'</button></td></tr>';});
  h+='</tbody><tfoot><tr><td class="l" colspan="3">Total other exempt income</td><td>'+F(E.others)+'</td><td></td></tr></tfoot></table></div><button class="add" data-add="ei2.others">Add a row</button>';
  if(S.pi.res!=="RES"){h+='<div class="cgband">4 · Income claimed as not chargeable to tax under a DTAA — non-residents</div>';
    h+=grid("ei2.dtaa",[{k:"amt",h:"Amount of income",t:"num",w:"120px",req:1},{k:"nature",h:"Nature of income",t:"txt",w:"auto",req:1},
      {k:"country",h:"Country name",t:"txt",w:"140px",req:1},{k:"code",h:"Country code",t:"sel",w:"130px",req:1,opts:CC_ALL.filter(c=>c[0]!=="91")},
      {k:"article",h:"Article of DTAA",t:"txt",w:"100px",max:16,req:1},{k:"head",h:"Head of income",t:"sel",w:"110px",req:1,opts:[["SA","Salary"],["HP","House property"],["CG","Capital gains"],["OS","Other sources"]]},
      {k:"trc",h:"TRC obtained?",t:"sel",w:"90px",req:1,opts:[["Y","Yes"],["N","No"]]}],X.dtaa||[],{min:"1150px",empty:"No DTAA claim.",add:"Add a claim",
      foot:[{l:1,v:"Total income from DTAA claimed as not chargeable",span:6},{v:E.dtaa}]});}
  h+=row("5 · Pass-through income claimed as not chargeable to tax — from Schedule PTI",cell(E.pti),{ref:"5"});
  h+=row("6 · Total (1 + 2 + 3 + 4 + 5)",cell(E.total),{ref:"6",cls:"grand"});
  return h;
}

/* ---------------- 11 · SPI and SI — book 02 --------------------------- */
function secSI(){
  const SI=S.C.si;let h="";
  h+='<div class="cgband">Schedule SPI — Income of specified persons (spouse, minor child etc.) includable in the income of the assessee, section 64</div>';
  h+=note("A disclosure. The amount is entered in the head named in the last column — Schedule S, HP, CG, OS or EI — and this schedule says who it came from.");
  h+=grid("spi",[{k:"name",h:"Name of person",t:"txt",w:"auto",req:1},{k:"pan",h:"PAN (optional)",t:"txt",w:"120px",max:10},{k:"aadhaar",h:"Aadhaar (optional)",t:"txt",w:"130px",max:12},
    {k:"rel",h:"Relationship",t:"txt",w:"150px",req:1},{k:"amt",h:"Amount",t:"num",w:"130px",req:1},
    {k:"head",h:"Head of income in which included",t:"sel",w:"170px",req:1,opts:[["SA","Salary"],["HP","House property"],["CG","Capital gains"],["OS","Other sources"],["EI","Exempt income"]]}],
    S.spi||[],{min:"1000px",empty:"No specified person.",add:"Add a person"});
  h+='<div class="cgband">Schedule SI — Income chargeable to tax at special rates</div>';
  h+=note("Computed from the schedules. For a resident whose normal-rate income falls short of the basic exemption, the shortfall is set against capital gains — highest rate first — before the special rate applies. The ₹1,25,000 under 112A goes first to your own gain, then to pass-through, then to the FII proviso.");
  if(!SI.rows.length)return h+note("No income at a special rate yet.");
  h+='<div class="full"><table class="gt" style="min-width:1000px"><thead><tr><th class="l" style="width:34px">Sl.</th><th class="l" style="width:90px">Section</th><th class="l">Nature</th><th style="width:70px">Rate %</th><th style="width:130px">Income (i)</th><th style="width:150px">After adjusting for the minimum chargeable</th><th style="width:130px">Tax thereon (ii)</th></tr></thead><tbody>';
  SI.rows.forEach((r,i)=>{h+='<tr><td class="l">'+(i+1)+'</td><td class="l">'+esc(r.code)+'</td><td class="l" style="font-size:12px">'+esc(r.label.slice(0,95))+'</td><td class="num">'+r.rate+'</td><td class="num">'+cell(r.inc)+'</td><td class="num">'+cell(r.taxable)+(r.exempt?'<span class="dt">less '+F(r.exempt)+'</span>':'')+'</td><td class="num">'+cell(r.tax)+'</td></tr>';});
  h+='</tbody><tfoot><tr><td class="l" colspan="4">Total</td><td>'+F(SI.totInc)+'</td><td></td><td>'+F(SI.totTax)+'</td></tr></tfoot></table></div>';
  return h;
}

/* ---------------- 12 · Foreign — FSI · TR · FA — book 06 --------------- */
function secFA(){
  const FS=S.C.fsi;let h="";
  if(S.pi.res==="NRI")h+=note("Schedules FSI and TR are for a resident. Schedule FA is not applicable to a non-resident.","warn");
  h+='<div class="cgband">Schedule FSI — Details of income from outside India and tax relief (resident only)</div>';
  h+=note("One block per country. Column (b) is income already in the return under that head; (d) is the Indian tax on it at the average rate; (e), the relief, is the lower of (c) and (d).");
  (S.fsi2||[]).forEach((b,i)=>{const p="fsi2."+i+".",r=b._||{heads:{},tot:{}};
    let x=row("Country code",sel(p+"code",CC_ALL.filter(c=>c[0]!=="91"),{}),{req:1})+row("Country name",inp(p+"name"),{req:1})+row("Taxpayer identification number",inp(p+"tin"),{req:1});
    x+='<div class="full"><table class="gt" style="min-width:1000px"><thead><tr><th class="l" style="width:34px">Sl.</th><th class="l" style="width:140px">Head (a)</th><th style="width:150px">Income from outside India (b)</th><th style="width:140px">Tax paid outside India (c)</th><th style="width:150px">Tax payable in India (d)</th><th style="width:130px">Relief (e) = lower of c, d</th><th class="l" style="width:130px">DTAA article (f)</th></tr></thead><tbody>';
    [["sal","i","Salary"],["hp","ii","House property"],["cg","iii","Capital gains"],["os","iv","Other sources"]].forEach(([k,sl,l])=>{const hh=r.heads[k]||{};
      x+='<tr><td class="l">'+sl+'</td><td class="l">'+l+'</td><td>'+inp(p+"h."+k+".inc",{n:1})+'</td><td>'+inp(p+"h."+k+".paid",{n:1})+'</td><td class="num">'+cell(hh.payable||0)+'</td><td class="num">'+cell(hh.relief||0)+'</td><td>'+inp(p+"h."+k+".article",{max:16})+'</td></tr>';});
    x+='</tbody><tfoot><tr><td class="l" colspan="2">Total</td><td>'+F(r.tot.inc||0)+'</td><td>'+F(r.tot.paid||0)+'</td><td>'+F(r.tot.payable||0)+'</td><td>'+F(r.tot.relief||0)+'</td><td></td></tr></tfoot></table></div>';
    x+=row("Relief claimed under section",sel(p+"sec",[["90","90"],["90A","90A"],["91","91"]],{blank:false}),{req:1,hint:"90 / 90A with a treaty, 91 without"});
    h+=blk("fsi"+i,"Country "+(i+1)+(st0(b.name)?" — "+st0(b.name):""),(r.tot.relief?"relief "+RS(r.tot.relief):"not filled"),x,"fsi2."+i);});
  h+='<button class="add" data-addfsi="1">Add a country</button>';
  h+='<div class="cgband">Schedule TR — Summary of tax relief claimed for taxes paid outside India</div>';
  h+='<div class="full"><table class="gt" style="min-width:900px"><thead><tr><th class="l">Country code (a)</th><th class="l">TIN (b)</th><th style="width:170px">Total taxes paid outside India (c)</th><th style="width:170px">Total tax relief available (d)</th><th class="l" style="width:120px">Under section (e)</th></tr></thead><tbody>';
  if(!FS.tr.length)h+='<tr><td class="emp" colspan="5">Generated from Schedule FSI.</td></tr>';
  FS.tr.forEach(r=>{h+='<tr><td class="l">'+esc(r.code||"")+' '+esc(r.name||"")+'</td><td class="l">'+esc(r.tin||"")+'</td><td class="num">'+cell(r.paid)+'</td><td class="num">'+cell(r.relief)+'</td><td class="l">'+esc(r.sec)+'</td></tr>';});
  h+='</tbody><tfoot><tr><td class="l" colspan="2">Total</td><td>'+F(FS.paidTot)+'</td><td>'+F(FS.reliefTot)+'</td><td></td></tr></tfoot></table></div>';
  h+=row("Total tax relief available where a DTAA applies — sections 90 and 90A → 11b of Part B-TTI",cell(FS.dtaaRel),{cls:"tot"});
  h+=row("Total tax relief available where no DTAA applies — section 91 → 11c of Part B-TTI",cell(FS.noDtaaRel),{cls:"tot"});
  h+=row("Whether any tax paid outside India, on which relief was allowed in India, has been refunded or credited during the year?",sel("tr2.refundFlag",[["NO","No"],["YES","Yes"]],{blank:false}));
  if((S.tr2||{}).refundFlag==="YES"){h+=row("a · Amount of tax refunded",inp("tr2.refundAmt",{n:1}),{ind:1});h+=row("b · Assessment year in which relief was allowed in India",inp("tr2.refundAY",{ph:"2024-25"}),{ind:1});}
  /* ---- FA ---- */
  h+='<div class="cgband">Schedule FA — Details of foreign assets and income from any source outside India</div>';
  if(S.pi.res!=="RES")h+=note("Not applicable — Schedule FA is for a resident and ordinarily resident.","warn");
  else{h+=note("Held at any time during the <b>calendar year ending 31 December 2025</b>, including any beneficial interest. Values in rupees. Every table asks where in this return the income was offered — FA does not add income; it points to it.");
    const ST=[["OWNER","Owner"],["BENEFICIAL_OWNER","Beneficial owner"],["BENIFICIARY","Beneficiary"]],OW=[["DIRECT","Direct"],["BENEFICIAL_OWNER","Beneficial owner"],["BENIFICIARY","Beneficiary"]];
    const SCH=[["SA","Salary"],["HP","House property"],["CG","Capital gains"],["OS","Other sources"],["EI","Exempt income"],["NI","Not in this return"]];
    const cc={k:"code",h:"Country code",t:"sel",w:"120px",req:1,opts:CC_ALL.filter(c=>c[0]!=="91")},cn={k:"country",h:"Country name",t:"txt",w:"120px",req:1};
    const off=[{k:"offAmt",h:"Income offered — amount",t:"num",w:"110px"},{k:"offSch",h:"Schedule",t:"sel",w:"110px",opts:SCH},{k:"offItem",h:"Item no.",t:"txt",w:"80px",max:50}];
    h+=fold("faA1","A1","Foreign depository accounts",(S.fa2.bank||[]).length+" rows",grid("fa2.bank",[cc,cn,{k:"inst",h:"Financial institution",t:"txt",w:"auto",req:1},{k:"addr",h:"Address",t:"txt",w:"auto",req:1},{k:"zip",h:"ZIP",t:"txt",w:"80px",max:8,req:1},
      {k:"acno",h:"Account number",t:"txt",w:"130px",max:34,req:1},{k:"status",h:"Status",t:"sel",w:"130px",req:1,opts:ST},{k:"opened",h:"Opened on",t:"date",w:"120px",req:1},{k:"peak",h:"Peak balance",t:"num",w:"120px",req:1},{k:"close",h:"Closing balance",t:"num",w:"120px",req:1},{k:"interest",h:"Gross interest",t:"num",w:"110px",req:1}],S.fa2.bank||[],{min:"1700px",empty:"None.",add:"Add an account"}));
    h+=fold("faA2","A2","Foreign custodial accounts",(S.fa2.cust||[]).length+" rows",grid("fa2.cust",[cc,cn,{k:"inst",h:"Financial institution",t:"txt",w:"auto",req:1},{k:"addr",h:"Address",t:"txt",w:"auto",req:1},{k:"zip",h:"ZIP",t:"txt",w:"80px",max:8,req:1},
      {k:"acno",h:"Account number",t:"txt",w:"130px",max:34,req:1},{k:"status",h:"Status",t:"sel",w:"130px",req:1,opts:ST},{k:"opened",h:"Opened on",t:"date",w:"120px",req:1},{k:"peak",h:"Peak balance",t:"num",w:"120px",req:1},{k:"close",h:"Closing balance",t:"num",w:"120px",req:1},
      {k:"gross",h:"Gross amount paid / credited",t:"num",w:"130px",req:1},{k:"nature",h:"Nature",t:"sel",w:"110px",req:1,opts:FA_NAT}],S.fa2.cust||[],{min:"1900px",empty:"None.",add:"Add an account"}));
    h+=fold("faA3","A3","Foreign equity and debt interest",(S.fa2.equity||[]).length+" rows",grid("fa2.equity",[cc,cn,{k:"entity",h:"Name of entity",t:"txt",w:"auto",req:1},{k:"addr",h:"Address",t:"txt",w:"auto",req:1},{k:"zip",h:"ZIP",t:"txt",w:"80px",max:8,req:1},
      {k:"nature",h:"Nature of entity",t:"txt",w:"130px",max:34,req:1},{k:"acq",h:"Date of acquiring",t:"date",w:"120px",req:1},{k:"initial",h:"Initial value",t:"num",w:"110px",req:1},{k:"peak",h:"Peak value",t:"num",w:"110px",req:1},{k:"close",h:"Closing value",t:"num",w:"110px",req:1},{k:"paid",h:"Gross paid / credited",t:"num",w:"120px",req:1},{k:"proceeds",h:"Gross proceeds on sale",t:"num",w:"130px",req:1}],S.fa2.equity||[],{min:"1900px",empty:"None.",add:"Add a holding"}));
    h+=fold("faA4","A4","Foreign cash-value insurance or annuity contract",(S.fa2.insur||[]).length+" rows",grid("fa2.insur",[cc,cn,{k:"inst",h:"Financial institution",t:"txt",w:"auto",req:1},{k:"addr",h:"Address",t:"txt",w:"auto",req:1},{k:"zip",h:"ZIP",t:"txt",w:"80px",max:8,req:1},
      {k:"dt",h:"Date of contract",t:"date",w:"120px",req:1},{k:"cashval",h:"Cash or surrender value",t:"num",w:"140px",req:1},{k:"paid",h:"Gross paid / credited",t:"num",w:"130px",req:1}],S.fa2.insur||[],{min:"1300px",empty:"None.",add:"Add a contract"}));
    h+=fold("faB","B","Financial interest in any entity",(S.fa2.fin||[]).length+" rows",grid("fa2.fin",[cc,cn,{k:"zip",h:"ZIP",t:"txt",w:"80px",max:8,req:1},{k:"nature",h:"Nature of entity",t:"txt",w:"130px"},{k:"entity",h:"Name of entity",t:"txt",w:"auto",req:1},{k:"addr",h:"Address",t:"txt",w:"auto",req:1},
      {k:"interest",h:"Nature of interest",t:"sel",w:"140px",req:1,opts:OW},{k:"since",h:"Date since held",t:"date",w:"120px",req:1},{k:"cost",h:"Total investment at cost",t:"num",w:"130px",req:1},{k:"inc",h:"Income accrued",t:"num",w:"110px",req:1},{k:"incNature",h:"Nature of income",t:"txt",w:"120px",req:1},...off],S.fa2.fin||[],{min:"2000px",empty:"None.",add:"Add an interest"}));
    h+=fold("faC","C","Immovable property",(S.fa2.imm||[]).length+" rows",grid("fa2.imm",[cc,cn,{k:"zip",h:"ZIP",t:"txt",w:"80px",max:8,req:1},{k:"addr",h:"Address of the property",t:"txt",w:"auto"},{k:"own",h:"Ownership",t:"sel",w:"140px",req:1,opts:OW},{k:"acq",h:"Date of acquisition",t:"date",w:"120px",req:1},
      {k:"cost",h:"Total investment at cost",t:"num",w:"130px",req:1},{k:"inc",h:"Income derived",t:"num",w:"110px",req:1},{k:"incNature",h:"Nature of income",t:"txt",w:"120px",req:1},...off],S.fa2.imm||[],{min:"1700px",empty:"None.",add:"Add a property"}));
    h+=fold("faD","D","Any other capital asset",(S.fa2.oth||[]).length+" rows",grid("fa2.oth",[cc,cn,{k:"zip",h:"ZIP",t:"txt",w:"80px",max:8,req:1},{k:"nature",h:"Nature of asset",t:"txt",w:"140px",req:1},{k:"own",h:"Ownership",t:"sel",w:"140px",req:1,opts:OW},{k:"acq",h:"Date of acquisition",t:"date",w:"120px",req:1},
      {k:"cost",h:"Total investment at cost",t:"num",w:"130px",req:1},{k:"inc",h:"Income derived",t:"num",w:"110px",req:1},{k:"incNature",h:"Nature of income",t:"txt",w:"120px",req:1},...off],S.fa2.oth||[],{min:"1700px",empty:"None.",add:"Add an asset"}));
    h+=fold("faE","E","Accounts in which you have signing authority, not in A to D",(S.fa2.sign||[]).length+" rows",grid("fa2.sign",[{k:"inst",h:"Name of institution",t:"txt",w:"auto",req:1},{k:"addr",h:"Address",t:"txt",w:"auto",req:1},cc,cn,{k:"zip",h:"ZIP",t:"txt",w:"80px",max:8,req:1},
      {k:"holder",h:"Name of the account holder",t:"txt",w:"150px",req:1},{k:"acno",h:"Account number",t:"txt",w:"130px",max:34,req:1},{k:"peak",h:"Peak balance / investment",t:"num",w:"130px",req:1},{k:"taxable",h:"Income taxable in your hands?",t:"sel",w:"110px",req:1,opts:[["N","No"],["Y","Yes"]]},{k:"inc",h:"If yes, income accrued",t:"num",w:"120px"},...off],S.fa2.sign||[],{min:"1900px",empty:"None.",add:"Add an account"}));
    h+=fold("faF","F","Trusts created under the laws of a country outside India — trustee, beneficiary or settlor",(S.fa2.trust||[]).length+" rows",grid("fa2.trust",[cc,cn,{k:"zip",h:"ZIP",t:"txt",w:"80px",max:8,req:1},{k:"trust",h:"Name of the trust",t:"txt",w:"auto",req:1},{k:"trustAddr",h:"Address of the trust",t:"txt",w:"auto",req:1},
      {k:"trustees",h:"Name of other trustees",t:"txt",w:"140px",req:1},{k:"trusteesAddr",h:"Address of trustees",t:"txt",w:"140px",req:1},{k:"settlor",h:"Name of settlor",t:"txt",w:"130px",req:1},{k:"settlorAddr",h:"Address of settlor",t:"txt",w:"130px",req:1},{k:"benef",h:"Name of beneficiaries",t:"txt",w:"140px",req:1},{k:"benefAddr",h:"Address of beneficiaries",t:"txt",w:"140px",req:1},
      {k:"since",h:"Date since position held",t:"date",w:"120px",req:1},{k:"taxable",h:"Income taxable in your hands?",t:"sel",w:"110px",req:1,opts:[["N","No"],["Y","Yes"]]},{k:"inc",h:"If yes, income derived",t:"num",w:"120px"},...off],S.fa2.trust||[],{min:"2600px",empty:"None.",add:"Add a trust"}));
    h+=fold("faG","G","Any other income derived from any source outside India, not in A to F",(S.fa2.othInc||[]).length+" rows",grid("fa2.othInc",[cc,cn,{k:"zip",h:"ZIP",t:"txt",w:"80px",max:8,req:1},{k:"from",h:"Name of the person from whom derived",t:"txt",w:"auto",req:1},{k:"fromAddr",h:"Address",t:"txt",w:"auto",req:1},
      {k:"inc",h:"Income derived",t:"num",w:"120px",req:1},{k:"nature",h:"Nature of income",t:"txt",w:"130px",req:1},{k:"taxable",h:"Taxable in your hands?",t:"sel",w:"110px",req:1,opts:[["N","No"],["Y","Yes"]]},...off],S.fa2.othInc||[],{min:"1600px",empty:"None.",add:"Add a row"}));}
  return h;
}

/* ---------------- 13 · Assets and liabilities — book 07 ---------------- */
function secAL(){
  const A=S.C.al2,X=S.al2||{};let h="";
  h+=note((A.required?"<b>Total income exceeds ₹1 crore — Schedule AL is mandatory.</b> ":"Schedule AL is required only where total income exceeds ₹1 crore. ")+"Everything at cost, in rupees.",A.required?"stop":"");
  h+='<div class="cgband">A · Immovable assets</div>';
  h+=row("Do you own any immovable asset?",sel("al2.hasImm",[["N","No"],["Y","Yes"]],{blank:false}));
  if(X.hasImm==="Y")h+=grid("al2.imm",[{k:"desc",h:"Description",t:"txt",w:"140px",max:25,req:1},{k:"flat",h:"Flat / door / block",t:"txt",w:"140px",req:1},{k:"premises",h:"Premises / building / village",t:"txt",w:"140px"},{k:"road",h:"Road / street / post office",t:"txt",w:"140px"},
    {k:"locality",h:"Area / locality",t:"txt",w:"130px",req:1},{k:"city",h:"Town / city / district",t:"txt",w:"130px",req:1},{k:"state",h:"State",t:"sel",w:"140px",req:1,opts:Object.keys(STATE).map(k=>[k,STATE[k]])},
    {k:"country",h:"Country",t:"sel",w:"130px",req:1,opts:CC_ALL},{k:"pin",h:"PIN",t:"txt",w:"80px",max:6},{k:"zip",h:"ZIP",t:"txt",w:"80px",max:8},{k:"amt",h:"Amount — cost",t:"num",w:"130px",req:1}],X.imm||[],{min:"1700px",empty:"None.",add:"Add a property",foot:[{l:1,v:"Total",span:10},{v:A.imm}]});
  h+='<div class="cgband">B · Movable assets</div>';
  [["jewel","(i) Jewellery, bullion etc."],["art","(ii) Archaeological collections, drawings, paintings, sculpture or any work of art"],["vehicle","(iii) Vehicles, yachts, boats and aircraft"],
   ["bank","(iv)(a) Financial asset — bank, including all deposits"],["shares","(iv)(b) Shares and securities"],["insur","(iv)(c) Insurance policies"],["loans","(iv)(d) Loans and advances given"],["cash","(iv)(e) Cash in hand"]]
   .forEach(([k,l])=>h+=row(l,inp("al2."+k,{n:1})));
  h+=row("Total movable assets",cell(A.mov),{cls:"tot"});
  h+='<div class="cgband">C · Liabilities in relation to the assets at A + B</div>';
  h+=row("Liabilities",inp("al2.liab",{n:1}),{req:A.required});
  return h;
}

/* ---------------- 14 · Other schedules — 5A, PTI, ESOP — book 04 ------ */
function secOther(){
  const PT=S.C.pti,ES=S.C.esop,FA5=S.C.s5a;let h="";
  /* 5A */
  h+=card("sch5a","Schedule 5A — Apportionment of income between spouses governed by the Portuguese Civil Code",(S.pi.s5a==="Yes"?RS(FA5.tot.spouse):""),
    (S.pi.s5a!=="Yes"?note("Opens when 'governed by the Portuguese Civil Code' is Yes in Who is filing."):
    (row("Name of the spouse",inp("sch5a2.name"),{req:1})+row("PAN of the spouse",inp("sch5a2.pan",{max:10}),{req:1})+row("Aadhaar of the spouse",inp("sch5a2.aadhaar",{max:12}))+
     '<div class="full"><table class="gt" style="min-width:900px"><thead><tr><th class="l">Head of income (i)</th><th style="width:170px">Receipts under the head (ii)</th><th style="width:170px">Apportioned to the spouse (iii)</th><th style="width:150px">TDS on (ii) (iv)</th><th style="width:170px">TDS apportioned to spouse (v)</th></tr></thead><tbody>'+
     [["hp","House property"],["cg","Capital gains"],["os","Other sources"]].map(([k,l])=>'<tr><td class="l">'+l+'</td><td>'+inp("sch5a2.h."+k+".inc",{n:1})+'</td><td>'+inp("sch5a2.h."+k+".spouse",{n:1})+'</td><td>'+inp("sch5a2.h."+k+".tds",{n:1})+'</td><td>'+inp("sch5a2.h."+k+".tdsSp",{n:1})+'</td></tr>').join("")+
     '</tbody><tfoot><tr><td class="l">Total</td><td>'+F(FA5.tot.inc)+'</td><td>'+F(FA5.tot.spouse)+'</td><td>'+F(FA5.tot.tds)+'</td><td>'+F(FA5.tot.tdsSp)+'</td></tr></tfoot></table></div>'+
     note("Column (ii) is the whole receipt; (iii) the spouse's half. Your own schedules carry the other half. The TDS in (v) goes to the spouse — enter it in your TDS tables as credit relating to the other person."))));
  /* PTI */
  let pt="";
  (S.pti2||[]).forEach((b,i)=>{const p="pti2."+i+".";
    let x=row("Investment entity covered by",sel(p+"kind",[["A","A — 115UA, business trust (REIT, InvIT)"],["B","B — 115UB, investment fund (AIF)"],["C","C — 115U, venture capital"]]),{req:1})+row("Name of the business trust or investment fund",inp(p+"name"),{req:1})+row("PAN",inp(p+"pan",{max:10}),{req:1});
    x+='<div class="full"><table class="gt" style="min-width:960px"><thead><tr><th class="l">Head of income (6)</th><th style="width:140px">Current year income (7)</th><th style="width:170px">Share of current year loss distributed (8)</th><th style="width:140px">Net 9 = 7 − 8</th><th style="width:130px">TDS (10)</th></tr></thead><tbody>';
    PTI_HEADS.forEach(([k,l])=>{const r=((b.rows||{})[k])||{};x+='<tr><td class="l">'+l+'</td><td>'+inp(p+"rows."+k+".inc",{n:1})+'</td><td>'+inp(p+"rows."+k+".loss",{n:1})+'</td><td class="num">'+cell(N(r.inc)-N(r.loss))+'</td><td>'+inp(p+"rows."+k+".tds",{n:1})+'</td></tr>';});
    x+='</tbody></table></div>';
    pt+=blk("pti"+i,"Trust or fund "+(i+1)+(st0(b.name)?" — "+st0(b.name):""),"",x,"pti2."+i);});
  pt+='<button class="add" data-addpti="1">Add a trust or fund</button>';
  pt+=note("Each net lands in its destination: house property to HP item 2; the four capital-gain rows to CG A8 and B11; dividend and others to Schedule OS; exempt rows to EI line 5. The TDS to Schedule TDS 2 with the head set accordingly.");
  h+=card("pti","Schedule PTI — Pass-through income from a business trust or investment fund, sections 115UA, 115UB",(PT.blocks?PT.blocks+" block"+(PT.blocks>1?"s":""):""),pt);
  /* ESOP */
  let es=row("PAN of the employer, being an eligible start-up",inp("esop.pan",{max:10}),{req:1})+row("DPIIT registration number of the employer",inp("esop.dpiit"),{req:1});
  es+='<div class="full"><table class="gt" style="min-width:1200px"><thead><tr><th class="l" style="width:90px">Assessment year</th><th style="width:130px">Tax deferred brought forward (3)</th><th class="l" style="width:130px">Securities sold? (4i)</th><th style="width:120px">Sale table total (4ii)</th><th class="l" style="width:110px">Ceased employee? (5)</th><th class="l" style="width:110px">Date of ceasing</th><th class="l" style="width:110px">48 months expired? (6)</th><th style="width:130px">Tax payable this year (7)</th><th style="width:130px">Balance carried forward (8)</th></tr></thead><tbody>';
  ES.rows.forEach(r=>{const p="esop.yrs."+r.y+".";es+='<tr><td class="l">'+r.y+'</td><td>'+inp(p+"bf",{n:1})+'</td><td class="l">'+sel(p+"sec",[["NS","Not sold"],["PS","Partly sold"],["FS","Fully sold"]],{blank:false,style:"width:100%"})+'</td><td class="num">'+cell(r.sold)+'</td><td class="l">'+sel(p+"ceased",[["N","No"],["Y","Yes"]],{blank:false,style:"width:100%"})+'</td><td>'+inp(p+"ceasedDt",{ph:DF,max:10})+'</td><td class="l">'+sel(p+"exp48",[["N","No"],["Y","Yes"]],{blank:false,style:"width:100%"})+'</td><td class="num">'+cell(r.payable)+'</td><td class="num">'+cell(r.cf)+'</td></tr>';});
  es+='<tr><td class="l">2026-27</td><td class="num">—</td><td colspan="6"></td><td>'+inp("esop.deferNow",{n:1})+'</td></tr></tbody><tfoot><tr><td class="l" colspan="7">Tax deferred from earlier years payable this year → 8c of Part B-TTI</td><td>'+F(ES.due)+'</td><td></td></tr></tfoot></table></div>';
  ESOP_YEARS.forEach(y=>{const r=((S.esop||{}).yrs||{})[y]||{};if(r.sec&&r.sec!=="NS")es+=sub("Sales in "+y)+grid("esop.yrs."+y+".sales",[{k:"dt",h:"Date of sale",t:"date",w:"140px",req:1},{k:"amt",h:"Tax attributed to the sale",t:"num",w:"170px",req:1}],r.sales||[],{min:"400px",empty:"No sale.",add:"Add a sale"});});
  es+=note("Tax falls due in the year of the earliest event — a sale (to the extent sold), leaving the employer (all), or 48 months from the end of the assessment year of allotment (all).");
  h+=card("esop","Schedule ESOP — Tax deferred on ESOPs of an eligible start-up, section 17(2)(vi)",(ES.due?RS(ES.due)+" due":""),es);
  return h;
}

/* ---------------- 15 · Part B-TI and Part B-TTI — book 08 ------------- */
function secTax(){
  const T=S.C.tax,I=S.C.int,L=S.C.loss,CG=S.C.cg,O=S.C.os,SI=S.C.si,AM=S.C.amt,AC=S.C.amtc,E=S.C.ei2;let h="";
  const r=(n,l,v,o)=>row(l,cell(v),Object.assign({ref:n},o||{}));
  h+='<div class="cgband">Part B-TI — Computation of total income</div>';
  h+=r("1","Salaries — 6 of Schedule S",S.C.sal.income);
  h+=r("2","Income from house property — 3 of Schedule HP, nil if loss",Math.max(0,S.C.hp.income));
  h+=sub("3 · Capital gains");
  h+=r("3a(i)","Short term at 20% — 8ii of Table E",CG.after.st20||0,{ind:1});h+=r("3a(ii)","Short term at 30% — 8iii",CG.after.st30||0,{ind:1});
  h+=r("3a(iii)","Short term at applicable rate — 8iv",CG.after.stApp||0,{ind:1});h+=r("3a(iv)","Short term at DTAA rates — 8v",CG.after.stDTAA||0,{ind:1});
  h+=r("3a(v)","Total short term — nil if loss",Math.max(0,CG.shortTerm),{cls:"tot"});
  h+=r("3b(i)","Long term at 12.5% — 8vi",CG.after.lt125||0,{ind:1});h+=r("3b(ii)","Long term at DTAA rates — 8vii",CG.after.ltDTAA||0,{ind:1});
  h+=r("3b(iii)","Total long term — nil if loss",Math.max(0,CG.longTerm),{cls:"tot"});
  h+=r("3c","Sum of short-term and long-term (3av + 3biii)",Math.max(0,CG.shortTerm)+Math.max(0,CG.longTerm));
  h+=r("3d","Capital gains at 30% under 115BBH — C2 of Schedule CG",CG.C2);
  h+=r("3e","Total capital gains (3c + 3d)",Math.max(0,CG.shortTerm)+Math.max(0,CG.longTerm)+CG.C2,{cls:"tot"});
  h+=sub("4 · Income from other sources");
  h+=r("4a","Net income at normal rates — 6 of Schedule OS",Math.max(0,O.six||0),{ind:1});h+=r("4b","Income at special rates — 2 of Schedule OS",O.special||0,{ind:1});
  h+=r("4c","Race horses — 8e of Schedule OS, nil if loss",Math.max(0,O.horse?O.horse.bal:0),{ind:1});
  const four=Math.max(0,O.six||0)+(O.special||0)+Math.max(0,O.horse?O.horse.bal:0);h+=r("4d","Total (4a + 4b + 4c)",four,{cls:"tot"});
  const five=S.C.sal.income+Math.max(0,S.C.hp.income)+Math.max(0,CG.shortTerm)+Math.max(0,CG.longTerm)+CG.C2+four;
  h+=r("5","Total of head-wise income (1 + 2 + 3e + 4d)",five,{cls:"tot"});
  h+=r("6","Losses of the current year set off against 5 — 2xiii and 3xiii of Schedule CYLA",L.totHPset+L.totOSset);
  h+=r("7","Balance after set-off of current-year losses (5 − 6)",five-L.totHPset-L.totOSset);
  h+=r("8","Brought-forward losses set off against 7 — 2xii of Schedule BFLA",L.totBFset);
  h+=r("9","Gross total income (7 − 8)",S.C.gti,{cls:"grand"});
  h+=r("10","Income chargeable at special rates under 111A, 112, 112A etc. included in 9",SI.totInc);
  h+=r("11","Deductions under Chapter VI-A — v of Schedule VI-A, limited to (9 − 10)",S.C.via.allowed);
  h+=r("12","Total income (9 − 11)",S.C.ti,{cls:"grand",hint:"rounded to the nearest ten"});
  h+=r("13","Income included in 12 chargeable at special rates — total of (i) of Schedule SI",SI.totInc);
  h+=r("14","Net agricultural income for rate purposes — 2 of Schedule EI",T.agri);
  h+=r("15","Aggregate income (12 − 13 + 14) — applicable if (12 − 13) exceeds the maximum not chargeable",T.aggFlag?(S.C.ti-SI.totInc+T.agri):0);
  h+=r("16","Losses of the current year to be carried forward — row xi of Schedule CFL",L.curr.hp+L.curr.st+L.curr.lt+L.curr.horse);
  h+=r("17","Deemed income under section 115JC — 3 of Schedule AMT",AM.applies?AM.adjusted:0);
  /* ===== TTI ===== */
  h+='<div class="cgband">Part B-TTI — Computation of tax liability on total income</div>';
  h+=sub("1 · Tax payable on deemed total income — Schedule AMT");
  if(AM.applies){h+=r("1a","Tax under 115JC — 4 of Schedule AMT",AM.amt,{ind:1});h+=r("1b","Surcharge on 1a",AM.sur,{ind:1});h+=r("1c","Cess at 4% on (1a + 1b)",AM.cess,{ind:1});h+=r("1d","Total tax on deemed total income",AM.total,{cls:"tot"});}
  else h+=note("Section 115JC does not arise — "+(isNew()?"the new regime":AM.partC?"adjusted total income is within ₹20 lakh":"no deduction under 80QQB or 80RRB is claimed")+".");
  h+=sub("2 · Tax payable on total income");
  h+=r("2a","Tax at normal rates on 15 of Part B-TI",T.normalTax,{ind:1});
  h+='<div class="full"><table class="gt" style="min-width:600px"><thead><tr><th class="l">Slab</th><th style="width:70px">Rate</th><th style="width:150px">Income in it</th><th style="width:150px">Tax</th></tr></thead><tbody>';
  let last=0;const base=T.aggFlag?T.normalInc+T.agri:T.normalInc;
  T.bands.forEach(([u,rt])=>{const inS=Math.max(0,Math.min(base,u)-last);if(inS||rt===0)h+='<tr><td class="l">'+esc(u===Infinity?"Above "+RS(last):(last===0?"Up to "+RS(u):RS(last+1)+" to "+RS(u)))+'</td><td class="num" style="color:var(--ink-3)">'+rt+'%</td><td class="num">'+cell(inS)+'</td><td class="num">'+cell(inS*rt/100)+'</td></tr>';last=u;});
  h+='</tbody></table></div>';
  h+=r("2b","Tax at special rates — total of (ii) of Schedule SI",T.splTax,{ind:1});
  if(T.aggFlag)h+=r("2c","Rebate on agricultural income — tax on the exemption plus agricultural income",-T.agriRebate,{ind:1});
  h+=r("2d","Tax payable on total income (2a + 2b − 2c)",T.taxOn,{cls:"tot"});
  h+=r("3","Rebate under section 87A",-T.rebate,{hint:T.marginal?"marginal relief — tax held to the income above ₹12,00,000":(isNew()?"₹60,000 where total income is within ₹12,00,000":"₹12,500 where total income is within ₹5,00,000, not against 112A gains")});
  h+=r("4","Tax payable after rebate (2d − 3)",T.after,{cls:"tot"});
  h+=sub("5 · Surcharge");
  h+=r("5A(i)","Before marginal relief — 25% of tax under 115BBE",T.surI,{ind:1});
  h+=r("5A(ii)+(iii)","— at "+T.scr+"% on the rest, "+T.scrCap+"% on capital gains and dividend",T.surII+T.mr,{ind:1});
  if(T.mr)h+=r("5B","Marginal relief",-T.mr,{ind:1,hint:"tax plus surcharge held to the amount at the threshold plus the income above it"});
  h+=r("5B(iv)","Total surcharge",T.sur,{cls:"tot"});
  h+=r("6","Health and education cess at 4% on (4 + 5iv)",T.cess);
  h+=r("7","Gross tax liability (4 + 5iv + 6)",T.gross,{cls:"tot"});
  h+=r("8","Gross tax payable — higher of 1d and 7",I.grossPayable,{cls:"tot"});
  h+=row("8b · Tax deferred on the ESOP perquisite of 17(2)(vi) — this year",inp("esop.deferNow",{n:1}),{ref:"8b",ind:1});
  h+=r("8c","Tax deferred from earlier years but payable now — column 7 of Schedule ESOP",I.esopDue,{ind:1});
  h+=r("9","Credit under 115JD of tax paid in earlier years — only if 7 exceeds 1d",-I.credit);
  h+=r("10","Tax payable after credit (8a + 8c − 9)",I.afterCredit,{cls:"tot"});
  h+=sub("11 · Tax relief");
  h+=row("11a · Section 89 — ensure Form 10E is submitted",inp("tax.s89",{n:1}),{ref:"11a",ind:1});
  if(N(S.tax.s89))h+=row("Acknowledgement number of Form 10E",inp("tax.e10ack",{max:15}),{req:1,ind:1});
  h+=r("11b","Section 90 / 90A — 2 of Schedule TR",I.rel90,{ind:1});h+=r("11c","Section 91 — 3 of Schedule TR",I.rel91,{ind:1});
  h+=r("11d","Total relief",I.relief,{cls:"tot"});
  h+=r("12","Net tax liability (10 − 11d)",I.net,{cls:"grand"});
  h+=sub("13 · Interest and fee payable");
  h+=row("Date of filing",dte("fs.filed"),{req:1,hint:"due "+DISP(DUE)});
  h+=r("13a","Interest for default in furnishing the return — 234A",I.i234a,{ind:1,hint:I.m234a?I.m234a+" month"+(I.m234a>1?"s":"")+" on "+RS(I.p234a)+(I.matchedSAT?" — after "+RS(I.matchedSAT)+" self-assessment paid by the due date":"")+([17,18].indexOf(+S.fs.sec)>=0&&D(S.fs.origdate)?" — to the original return's date":""):""});
  h+=r("13b","Interest for default in payment of advance tax — 234B",I.i234b,{ind:1,hint:I.cycles.length?I.cycles.length+" monthly cycles on "+RS(I.cycles[0].principal)+(I.cycles.some(c=>c.sat)?" — a challan pays accrued interest first, then principal":""):""});
  if(I.cycles.some(c=>c.sat)){h+='<div class="full"><table class="gt" style="min-width:700px"><thead><tr><th class="l">Month</th><th style="width:120px">Principal</th><th style="width:100px">Interest</th><th style="width:120px">Self-assessment paid</th><th style="width:110px">To interest</th><th style="width:110px">To principal</th></tr></thead><tbody>';
    I.cycles.forEach(c=>{h+='<tr><td class="l">'+c.m+'</td><td class="num">'+cell(c.principal)+'</td><td class="num">'+cell(c.intr)+'</td><td class="num">'+cell(c.sat)+'</td><td class="num">'+cell(c.toInt)+'</td><td class="num">'+cell(c.toPrin)+'</td></tr>';});h+='</tbody></table></div>';}
  h+=r("13c","Interest for deferment of advance tax — 234C",I.i234c,{ind:1,hint:I.amtCase?"on the alternate minimum tax, flat":"on the tax on income cumulative to each instalment"});
  if(I.i234c){h+='<div class="full"><table class="gt" style="min-width:740px"><thead><tr><th class="l">Instalment</th><th style="width:120px">Tax to date</th><th style="width:120px">Required</th><th style="width:120px">Paid by then</th><th style="width:110px">Short</th><th style="width:100px">Interest</th></tr></thead><tbody>';
    ["By 16 June — 15% (12% safe)","By 20 September — 45% (36% safe)","By 15 December — 75%","By 16 March — 100%","17 to 31 March — income arising after the last instalment"].forEach((l,n)=>{const q=I.qs[n];if(!q)return;h+='<tr><td class="l">'+l+'</td><td class="num">'+cell(q.base)+'</td><td class="num">'+cell(q.need)+'</td><td class="num">'+cell(q.got)+'</td><td class="num">'+cell(q.short)+'</td><td class="num">'+cell(q.int)+'</td></tr>';});h+='</tbody></table></div>';}
  h+=r("13d","Fee for default in furnishing the return — 234F",I.f234f,{ind:1});
  h+=row("13da · Fee for furnishing a revised return — 234-I",(+S.fs.sec===17)?inp("tax.f234i",{n:1}):cell(0),{ref:"13da",ind:1});
  h+=r("13e","Total interest and fee",I.total,{cls:"tot"});
  h+=r("14","Aggregate liability (12 + 13e)",I.aggregate,{cls:"grand"});
  h+=sub("15 · Taxes paid");
  h+=r("15a","Advance tax",I.adv,{ind:1});h+=r("15b","TDS",I.tds,{ind:1});h+=r("15c","TCS",I.tcs,{ind:1});h+=r("15d","Self-assessment tax",I.sat,{ind:1});
  h+=r("15e","Total taxes paid",I.paid,{cls:"tot"});
  h+=r("16","Amount payable — if 14 exceeds 15e, rounded to ten",I.balance,{cls:I.balance?"grand":"tot"});
  h+=r("17","Refund — if 15e exceeds 14, rounded to ten",I.refund,{cls:I.refund?"grand":"tot"});
  /* AMTC */
  h+=card("amtc","Schedule AMTC — Computation of tax credit under section 115JD",(AC.used||AC.curr?RS(AC.used||AC.curr):""),
    r("1","Tax under 115JC in A.Y. 2026-27 — 1d of Part B-TTI",AC.tax115JC)+r("2","Tax under other provisions in A.Y. 2026-27 — 7 of Part B-TTI",AC.taxOther)+
    r("3","Amount of tax against which credit is available (2 − 1 if 2 > 1)",AC.avail,{cls:"tot"})+
    '<div class="full"><table class="gt" style="min-width:900px"><thead><tr><th class="l" style="width:90px">Assessment year</th><th style="width:120px">Gross (B1)</th><th style="width:140px">Set off in earlier years (B2)</th><th style="width:130px">Balance b/f (B3)</th><th style="width:130px">Utilised this year (C)</th><th style="width:130px">Carried forward (D)</th></tr></thead><tbody>'+
    AC.rows.map(x=>'<tr><td class="l">'+x.y+'</td><td>'+inp("amtc."+x.y+".gross",{n:1})+'</td><td>'+inp("amtc."+x.y+".setoff",{n:1})+'</td><td class="num">'+cell(x.bf)+'</td><td class="num">'+cell(x.used)+'</td><td class="num">'+cell(x.cf)+'</td></tr>').join("")+
    '<tr><td class="l">2026-27 (current)</td><td class="num">'+cell(AC.curr)+'</td><td></td><td></td><td></td><td class="num">'+cell(AC.curr)+'</td></tr></tbody><tfoot><tr><td class="l">Total</td><td>'+F(AC.gross)+'</td><td>'+F(AC.setoff)+'</td><td>'+F(AC.bf)+'</td><td>'+F(AC.used)+'</td><td>'+F(AC.cfTotal)+'</td></tr></tfoot></table></div>'+
    r("5","Credit under 115JD utilised during the year → 9 of Part B-TTI",AC.used,{cls:"tot"})+r("6","AMT liability available for credit in subsequent years",AC.cfTotal,{cls:"tot"}));
  return h;
}

/* ---------------- 16 · Bank and verification --------------------- */
function secBank(){
  const I=S.C.int;let h="";
  h+=row("Number of accounts held at any time in the year",inp("ver.nacc",{n:1}),
    {hint:"dormant accounts excluded"});
  h+=note("Every account held at any time has to be reported, except a dormant one. "+
    "Tick the one the refund should go to.");
  h+=grid("bank",[{k:"ifsc",h:"IFS code",t:"txt",w:"140px",max:11,req:1},
    {k:"bank",h:"Name of the bank",t:"txt",w:"auto",req:1},
    {k:"acno",h:"Account number",t:"txt",w:"200px",req:1},
    {k:"type",h:"Type",t:"sel",w:"170px",req:1,opts:ACCT},
    {k:"refund",h:"For the refund",t:"chk",w:"120px"}],
    S.bank,{min:"960px",empty:"No account given — a refund cannot be credited.",add:"Add an account"});
  h+=note("Type the IFS code and the name of the bank fills itself.");
  h+=sub("Verification");
  h+=row("Name of the person verifying the return",inp("ver.name"),{req:1});
  h+=row("Son or daughter of",inp("ver.father"),{req:1});
  h+=row("PAN of the person verifying",inp("ver.pan",{max:10}),{req:1});
  h+=row("Capacity",sel("ver.cap",[["S","Self"],["R","Representative assessee"],
    ["K","Karta of a Hindu undivided family"]],{blank:false}),{req:1});
  h+=row("Place",inp("ver.place"),{req:1});
  h+=card("trp","Prepared by a tax return preparer",(st0((S.trp||{}).name)?st0(S.trp.name):""),
    row("Identification number of the TRP",inp("trp.id",{max:10}),{req:1})+row("Name of the TRP",inp("trp.name"),{req:1})+
    row("Amount of reimbursement from the Government, if any",inp("trp.reimb",{n:1}),{req:1,hint:"nil if none"})+
    formNote("The TRP counter-signs the paper form; the JSON carries the three particulars."));
  h+=rulesPanel();
  h+=sub("Software registration");
  h+=note("The department wants the JSON to carry the registration number of the software "+
    "that made it, as SW and eight digits.");
  h+=row("Registration number",inp("ver.swid",{ph:"SW00000000",max:10}));
  h+=sub("Export");
  const errs=S.C.checks.filter(c=>c.lvl==="err").length;
  h+= errs
    ? note("<b>"+errs+" thing"+(errs>1?"s":"")+" still to fix.</b> Each sits against its section.","stop")
    : note("Every check passes. The JSON is validated against the schema skeleton before it is "+
      "written. Import it into the government utility to seal and upload.","form");
  h+='<div style="padding:8px 14px;display:flex;gap:10px">'+
     '<button class="add" id="b_json2" style="height:32px;padding:0 18px;margin:0'+
     (errs?";opacity:.45":"")+'"'+(errs?" disabled":"")+'>Export the return as JSON</button>'+
     '<button class="add" id="b_save2" style="height:32px;padding:0 18px;margin:0">Save the working file</button></div>';
  return h;
}

/* ==================================================================
   8 · RENDER
   ================================================================== */
function checksFor(id){
  const c=(S.C.checks||[]).filter(x=>x.sec===id);
  if(!c.length)return "";
  return '<div class="cks">'+c.map(x=>'<div class="ck '+x.lvl+'"><b>'+esc(x.t)+
    '</b><span>'+esc(x.m)+'</span></div>').join("")+'</div>';
}
function paint(keep){
  clearTimeout(window._rp);window._rp=null;compute();
  const y=keep?$("wrap").scrollTop:0;
  $("sheet").innerHTML=SECS.map(s=>{const on=S.open[s.id]!==false;
    let v="";try{v=s.s()||"";}catch(e){}
    const bad=(S.C.checks||[]).filter(c=>c.lvl==="err"&&c.sec===s.id).length;
    return '<section id="sec-'+s.id+'"><button class="bar" data-sec="'+s.id+'">'+
      '<span class="cv">'+(on?"−":"+")+'</span><span class="t">'+esc(s.t)+'</span>'+
      '<span class="r">'+esc(s.ref)+'</span>'+
      '<span class="v">'+(bad?bad+" to fix":esc(v))+'</span></button>'+
      '<div class="body'+(on?" open":"")+'">'+(on?checksFor(s.id)+s.f():"")+'</div></section>';
  }).join("");
  $("nav").innerHTML=SECS.map(s=>{let v="";try{v=s.s()||"";}catch(e){}
    const bad=(S.C.checks||[]).filter(c=>c.lvl==="err"&&c.sec===s.id).length;
    return '<button class="nv" data-go="'+s.id+'"><span class="t">'+esc(s.t)+'</span>'+
      '<span class="s '+(bad?"bad":/[₹]/.test(v)?"done":"")+'">'+(bad?bad+" to fix":esc(v))+
      '</span></button>';}).join("");
  band();$("wrap").scrollTop=y;spy();
}
function band(){
  const T=S.C.tax,I=S.C.int;
  $("s_gti").textContent=CR(S.C.gti);$("s_ti").textContent=CR(S.C.ti);
  $("s_tax").textContent=CR(T.gross);
  const w=$("s_bw");
  if(I.refund>0){$("s_bl").textContent="Refund due";$("s_b").textContent=CR(I.refund);w.className="m ref";}
  else{$("s_bl").textContent="Balance payable";$("s_b").textContent=CR(I.balance);w.className="m pay";}
  const c=S.C.checks||[],e=c.filter(x=>x.lvl==="err"),n=c.filter(x=>x.lvl==="warn").length;
  let s='<b>'+T.regime+'</b> regime';
  if(T.rebate)s+='  ·  rebate <b>'+CR(T.rebate)+'</b>';
  if(S.C.amt.applies)s+='  ·  AMT applies';
  s+='<br>'+(e.length?'<a data-go="'+e[0].sec+'"><b>'+e.length+' to fix</b></a>'
    :(n?n+' to look at':'<b style="color:#A8E6C9">Ready to export</b>'));
  $("s_st").innerHTML=s;
}
function spy(){const y=$("wrap").scrollTop+90;let cur=SECS[0].id;
  SECS.forEach(s=>{const el=$("sec-"+s.id);if(el&&el.offsetTop<=y)cur=s.id;});
  document.querySelectorAll(".nv").forEach(b=>b.classList.toggle("on",b.dataset.go===cur));}
function goTo(id){S.open[id]=true;paint(true);const el=$("sec-"+id);
  if(el)$("wrap").scrollTo({top:el.offsetTop-8,behavior:"smooth"});}


/* ==================================================================
   9 · EVENTS
   ================================================================== */
function commit(t){
  const p=t.dataset.p;if(!p)return false;
  let v=t.value;
  if(/\.(pan|tan|ifsc|bsr|swid|isin)$/.test(p)||/\.(pan|tan|ifsc|bsr)$/.test(p.replace(/\.\d+\./g,".")))
    v=String(v).toUpperCase();
  set(p,v);
  if(p==="pi.pin"&&/^\d{6}$/.test(v)){const c=PIN2ST[v.slice(0,2)];if(c&&!S.pi.state)S.pi.state=c;}
  if(/\.ifsc$/.test(p)&&v.length>=4){const b=BANK[v.slice(0,4)];
    if(b){const m=p.match(/^(.+)\.ifsc$/);if(!get(m[1]+".bank"))set(m[1]+".bank",b);}}
  if(p==="cg.on")return "full";
  if(/^cg\.land\.\d+\.(lt|s45_5a)$/.test(p)||/^cg\.(editE|editF)$/.test(p)||/^os2\.(on|editQ|rent|e\.fap|d\.(ord|e22))$/.test(p)||/^d80\.(selfSr|parSr)$/.test(p)||/^via\.c80(ddb|gg|qqb|rrb)$/.test(p)||/^loss\.(editC|editB)$/.test(p)||/^(al2\.hasImm|tr2\.refundFlag|esop\.yrs\.[0-9-]+\.sec|ei2\.others\.\d+\.cat|ei2\.agri)/.test(p))return "full";
  if(p==="hp.on"){if(!S.hp.props)S.hp.props=[];if(v&&!S.hp.props.length)S.hp.props=[{type:"S",co:"NO",country:"91",owner:"SE",loans:[],coowners:[],tenants:[]}];return "full";}
  if(/^(fs\.optout|fs\.sec|pi\.status|pi\.res|pi\.dir|pi\.unl|pi\.partner|pi\.fpi|pi\.rep|pi\.country|pi\.addr2same|pi\.rescond|decl\.flag|decl\.dep_f|decl\.trv_f|decl\.ele_f|decl\.c4_f)$/.test(p))return "full";
  if(/^hp\.props\.\d+\.(type|co|owner|country)$/.test(p))return "full";
  return true;
}
document.addEventListener("input",e=>{const t=e.target;
  if(!t.matches||!t.matches("input,select")||t.type==="checkbox")return;
  const r=commit(t);
  if(r==="full"){paint(true);return;}
  if(r){const id=t.dataset.p,pos=t.selectionStart;compute();band();
    clearTimeout(window._rp);
    window._rp=setTimeout(()=>{const y=$("wrap").scrollTop;paint(true);
      const el=document.querySelector('[data-p="'+CSS.escape(id)+'"]');
      if(el){el.focus();try{el.setSelectionRange(pos,pos);}catch(x){}}
      $("wrap").scrollTop=y;},430);}});
document.addEventListener("change",e=>{const t=e.target;
  if(t.matches&&t.matches("select")){if(commit(t)!==false)paint(true);return;}
  if(t.type==="checkbox"&&t.dataset.chk){set(t.dataset.chk,t.checked?"Y":"");paint(true);}});
document.addEventListener("click",e=>{const t=e.target;
  const g=t.closest&&t.closest("[data-go]");if(g){goTo(g.dataset.go);return;}
  const s=t.closest&&t.closest("[data-sec]");
  if(s){const id=s.dataset.sec;S.open[id]=S.open[id]===false;paint(true);return;}
  const c=t.closest&&t.closest("[data-card]");
  if(c){const k="c_"+c.dataset.card;S.open[k]=!S.open[k];
    const own={horse:"os2.horse"}[c.dataset.card];
    if(own)set(own+".on",!!S.open[k]);paint(true);return;}
  const b=t.closest&&t.closest("[data-blk]");
  if(b){const k="b_"+b.dataset.blk;S.open[k]=S.open[k]===false;paint(true);return;}
  const ch=t.closest&&t.closest("[data-cghead]");
  if(ch){const k=ch.dataset.cghead;S.open[k]=S.open[k]===false;paint(true);return;}
  const s2=t.closest&&t.closest("[data-sub2]");
  if(s2){const k=s2.dataset.sub2;S.open[k]=!S.open[k];paint(true);return;}
  const al=t.closest&&t.closest("[data-addland]");
  if(al){S.cg.land.push({buy:"",sale:"",lt:al.dataset.addland,ded:{},buyers:[],improve:[]});paint(true);return;}
  if(t.closest&&t.closest("[data-addprop]")){if(!S.hp.props)S.hp.props=[];S.hp.props.push({type:"S",co:"NO",country:"91",owner:"SE",loans:[],coowners:[],tenants:[]});paint(true);return;}
  if(t.closest&&t.closest("[data-addfsi]")){S.fsi2.push({sec:"90",h:{}});paint(true);return;}
  if(t.closest&&t.closest("[data-addpti]")){S.pti2.push({kind:"A",rows:{}});paint(true);return;}
  if(t.closest&&t.closest("[data-addemp]")){if(!S.sal.emp)S.sal.emp=[];S.sal.emp.push({empcat:"OTH"});paint(true);return;}
  const ad=t.closest&&t.closest("[data-add]");
  if(ad){const SEED={alw:{sec:"10(13A)"},os:{sec:"SAV"},tds2:{sec:"194A",yr:"2025"},
      tds3:{yr:"2025"},tcs:{yr:"2025"},bank:{type:"SB"},g80:{bucket:"A"},ei:{cat:"AGRI"},
      "cg.s112a":{pre18:"AE"},"cg.vda":{},"cg.a7.deem":{py:"2024-25",sec:"54B"},"cg.b10.deem":{py:"2024-25",sec:"54"},"cg.a9":{trc:"Y"},"cg.b12":{trc:"Y"},"cg.a3trades":{},"cg.s115ad":{pre18:"AE"},"os2.eOther":{},"os2.pf111":{ay:"2025-26"},"os2.spl":{code:"5A1ai"},"os2.pti":{code:"5A1ai"},"os2.dtaa":{nature:"1ai",itemno:"56i",trc:"Y"},"spi":{head:"OS"},"n17_1":{code:"1"},"n17_2":{code:"1"},"n17_3":{code:"1"},"ei2.others":{cat:"OTH"},"ei2.land":{owned:"O",irr:"IRG"},"ei2.dtaa":{trc:"Y",head:"OS"},"tds2":{who:"S",sec:"94A"},"tds3":{who:"S",sec:"4IA"},"tcs":{who:"1"},"fa2.bank":{status:"OWNER"},"fa2.cust":{status:"OWNER",nature:"I"},"fa2.equity":{},"fa2.insur":{},"fa2.fin":{interest:"DIRECT",offSch:"NI"},"fa2.imm":{own:"DIRECT",offSch:"NI"},"fa2.oth":{own:"DIRECT",offSch:"NI"},"fa2.sign":{taxable:"N",offSch:"NI"},"fa2.trust":{taxable:"N",offSch:"NI"},"fa2.othInc":{taxable:"N",offSch:"NI"},"al2.imm":{country:"91"},"gga":{clause:"80GGA2a",mode:"OTH"},"ggc":{mode:"OTH"},"ra":{},"c80c":{},"pen80ccc":{type:"LIC"},"pen80ccd1":{type:"NPS"},"pen80ccd1b":{type:"NPS"},"d80.selfIns":{},"d80.selfSrIns":{},"d80.parIns":{},"d80.parSrIns":{},"e80.e":{from:"B"},"e80.ee":{from:"B"},"e80.eea":{from:"B"},"e80.eeb":{from:"B"},"cg.aA":{rate:"STL20"},"cg.bA":{rate:"LTL125"},"loss.cfl":{},
      "fsi.rows":{sec:"90"},"tr.rows":{sec:"90"},"fa.bank":{},"fa.equity":{},"fa.immovable":{},
      "pti.rows":{head:"CG"},"esop.rows":{},"pi.dirco":{type:"D",listed:"L"},"pi.unlco":{type:"D"},"pi.juris":{},"pi.firms":{},"decl.c4":{nature:"1"}};
    const k=ad.dataset.add;let seed=Object.assign({},SEED[k]||{});
    if(/\.loans$/.test(k))seed={from:"B"};
    const suf=k.split(".").pop();if(SEED[suf]&&!SEED[k])seed=Object.assign({},SEED[suf]);
    const arr=get(k);
    if(Array.isArray(arr))arr.push(seed);else set(k,[seed]);paint(true);return;}
  const dl=t.closest&&t.closest("[data-del]");
  if(dl){const m=dl.dataset.del.match(/^(.+)\.(\d+)$/);const arr=get(m[1]);
    if(Array.isArray(arr))arr.splice(+m[2],1);paint(true);return;}
  if(t.id==="b_json2"){exportJSON();return;}
  if(t.id==="b_save2"){saveFile();return;}});
$("wrap").addEventListener("scroll",()=>{clearTimeout(window._sp);window._sp=setTimeout(spy,60);});

/* ==================================================================
   10 · SAVE, OPEN, EXPORT
   ================================================================== */
function download(n,t){const b=new Blob([t],{type:"application/json"}),a=document.createElement("a");
  a.href=URL.createObjectURL(b);a.download=n;document.body.appendChild(a);a.click();
  a.remove();URL.revokeObjectURL(a.href);}
function saveFile(){const o={};Object.keys(S).forEach(k=>{if(k!=="C")o[k]=S[k];});
  o.meta={app:"yukti",form:"ITR-2",ay:(window.YC&&YC.ay)||"2025-26",ver:1,saved:new Date().toISOString()};
  download((S.pi.pan||"ITR2")+"_AY"+((window.YC&&YC.ay)||"2025-26")+".yukti.json",JSON.stringify(o,null,1));}
$("b_save").addEventListener("click",saveFile);
function deepFind(o,keys,d){d=d||0;if(!o||typeof o!=="object"||d>9)return undefined;
  for(const k of keys)if(o[k]!==undefined&&o[k]!==null&&o[k]!=="")return o[k];
  for(const k in o){const r=deepFind(o[k],keys,d+1);if(r!==undefined)return r;}return undefined;}
/* ==================================================================
   importReturn — read a department-format ITR-2 JSON back into every
   Yukti field. The inverse of buildITR2. Computed blocks (CYLA, BFLA,
   SI, AMT, Part B) are not read; they are recomputed.
   ================================================================== */
const dmy=iso=>{const m=/^(\d{4})-(\d{2})-(\d{2})$/.exec(String(iso||""));return m?m[3]+"/"+m[2]+"/"+m[1]:"";};
const g_=(o,p)=>{try{return p.split(".").reduce((t,k)=>t==null?undefined:t[k],o);}catch(e){return undefined;}};
const nz=v=>(v==null||v===0||v==="")?"":v;
function importReturn(I){
  const got=[];
  /* ---- Part A General ---- */
  const PI=I.PartA_GEN1&&I.PartA_GEN1.PersonalInfo,FS=I.PartA_GEN1&&I.PartA_GEN1.FilingStatus;
  if(PI){const n=PI.AssesseeName||{},a=PI.Address||{},b=PI.AlternateAddress||{};
    Object.assign(S.pi,{status:PI.Status||"I",first:n.FirstName||"",mid:n.MiddleName||"",last:n.SurNameOrOrgName||"",pan:PI.PAN||"",
      aadhaar:PI.AadhaarCardNo||"",aadhenrol:PI.AadhaarEnrolmentId||"",dob:dmy(PI.DOB),passport:PI.PassportNo||"",
      addr1:a.ResidenceNo||"",premises:a.ResidenceName||"",road:a.RoadOrStreet||"",locality:a.LocalityOrArea||"",city:a.CityOrTownOrDistrict||"",
      country:a.CountryCode||"91",state:a.StateCode||"",pin:nz(a.PinCode)+"",zip:a.ZipCode||"",email:a.EmailAddress||"",email2:a.EmailAddressSec||"",
      mobile:nz(a.MobileNo)+"",mobile2:nz(a.MobileNoSec)+"",std:a.STDcode||"",phone:nz(a.PhoneNo)+"",
      addr2same:PI.SecondaryAdd==="Y"?"No":"Yes",addr1b:b.ResidenceNo||"",premisesb:b.ResidenceName||"",roadb:b.RoadOrStreet||"",localityb:b.LocalityOrArea||"",cityb:b.CityOrTownOrDistrict||"",stateb:b.StateCode||"",pinb:nz(b.PinCode)+""});
    got.push("personal information");}
  if(FS){Object.assign(S.pi,{res:FS.ResidentialStatus||"RES",rescond:FS.ConditionsResStatus||"",
      juris:(g_(FS,"JurisdictionResPrevYr.JurisdictionResPrevYrDtls")||[]).map(x=>({country:x.JurisdictionResidence,tin:x.TIN})),
      days1:nz(FS.TotalPrStayIndiaPrevYr),days4:nz(FS.TotalPrStayIndia4PrecYr),s115h:FS.BenefitUs115HFlg==="Y"?"Yes":"No",
      s5a:FS.PortugeseCC5A==="Y"?"Yes":"No",fpi:FS.FiiFpiFlag==="Y"?"Yes":"No",sebi:FS.SebiRegnNo||"",
      rep:FS.AsseseeRepFlg==="Y"?"Yes":"No",rep_name:g_(FS,"AssesseeRep.RepName")||"",rep_email:g_(FS,"AssesseeRep.RepEmailID")||"",rep_mobile:nz(g_(FS,"AssesseeRep.RepMobileNo"))+"",
      dir:FS.CompDirectorPrvYrFlg==="Y"?"Yes":"No",dirco:(g_(FS,"CompDirectorPrvYr.CompDirectorPrvYrDtls")||[]).map(c=>({name:c.NameOfCompany,type:c.CompanyType,pan:c.PAN||"",listed:c.SharesTypes,din:c.DIN||""})),
      unl:FS.HeldUnlistedEqShrPrYrFlg==="Y"?"Yes":"No",unlco:(g_(FS,"HeldUnlistedEqShrPrYr.HeldUnlistedEqShrPrYrDtls")||[]).map(c=>({name:c.NameOfCompany,type:c.CompanyType,pan:c.PAN||"",open:c.OpngBalNumberOfShares,opencost:c.OpngBalCostOfAcquisition,acq:nz(c.ShrAcqDurYrNumberOfShares),acqdt:dmy(c.DateOfSubscrPurchase),fv:nz(c.FaceValuePerShare),ip:nz(c.IssuePricePerShare),pp:nz(c.PurchasePricePerShare),sold:nz(c.ShrTrnfNumberOfShares),soldcons:nz(c.ShrTrnfSaleConsideration),close:c.ClsngBalNumberOfShares,closecost:c.ClsngBalCostOfAcquisition})),
      lei:g_(FS,"LEIDtls.LEINumber")||"",lei_dt:dmy(g_(FS,"LEIDtls.ValidUptoDate"))});
    S.fs={optout:FS.OptOutNewTaxRegime==="Y"?"Yes":"No",sec:FS.ReturnFileSec||11,filed:S.fs.filed||"",notice:FS.NoticeNo||"",noticedate:dmy(FS.NoticeDate),receipt:FS.ReceiptNo||"",origdate:dmy(FS.OrigRetFiledDate)};
    S.decl={flag:FS.SeventhProvisio139==="Y"?"Yes":"No",dep_f:FS.DepAmtAggAmtExcd1CrPrYrFlg==="Y"?"Yes":"No",dep:nz(FS.AmtSeventhProvisio139i),trv_f:FS.IncrExpAggAmt2LkTrvFrgnCntryFlg==="Y"?"Yes":"No",trv:nz(FS.AmtSeventhProvisio139ii),
      ele_f:FS.IncrExpAggAmt1LkElctrctyPrYrFlg==="Y"?"Yes":"No",ele:nz(FS.AmtSeventhProvisio139iii),c4_f:FS.clauseiv7provisio139i==="Y"?"Yes":"No",c4:(FS.clauseiv7provisio139iDtls||[]).map(x=>({nature:x.clauseiv7provisio139iNature,amt:x.clauseiv7provisio139iAmount}))};
    got.push("filing status");}
  /* ---- Schedule S ---- */
  if(I.ScheduleS){const sc=I.ScheduleS;
    S.sal={emp:(sc.Salaries||[]).map(e=>{const sy=e.Salarys||{};const o={name:e.NameOfEmployer,empcat:e.NatureOfEmployment||"OTH",tan:e.TANofEmployer||"",city:g_(e,"AddressDetail.CityOrTownOrDistrict")||"",state:g_(e,"AddressDetail.StateCode")||"",pin:nz(g_(e,"AddressDetail.PinCode"))+"",
        s17_1:nz(sy.Salary),s17_2:nz(sy.ValueOfPerquisites),s17_3:nz(sy.ProfitsinLieuOfSalary),oth89a:nz(sy.IncomeNotifiedOther89A),prev89a:nz(sy.IncomeNotifiedPrYr89A)};
      (sy.IncomeNotified89AType||[]).forEach(c=>o["n89a_"+c.NOT89ACountrycode]=c.NOT89AAmount);
      const back=n=>(g_(n,"OthersIncDtls")||[]).map(r=>({code:r.NatureDesc,desc:r.OthNatOfInc||"",amt:r.OthAmount}));
      o.n17_1=back(sy.NatureOfSalary);o.n17_2=back(sy.NatureOfPerquisites);o.n17_3=back(sy.NatureOfProfitInLieuOfSalary);return o;}),s16ii:nz(sc.EntertainmntalwncUs16ii),s16iii:nz(sc.ProfessionalTaxUs16iii)};
    S.alw=(g_(sc,"AllwncExemptUs10.AllwncExemptUs10Dtls")||[]).map(a=>({sec:a.SalNatureDesc,amt:a.SalOthAmount}));got.push("salary");}
  /* ---- Schedule HP ---- */
  if(I.ScheduleHP){const hp=I.ScheduleHP;
    S.hp={on:"1",pti:nz(hp.PassThroghIncome),props:(hp.PropertyDetails||[]).map(p=>{const ad=p.AddressDetailWithZipCode||{},rd=p.Rentdetails||{};
      return {addr:ad.AddrDetail||"",city:ad.CityOrTownOrDistrict||"",country:ad.CountryCode||"91",state:ad.StateCode||"",pin:nz(ad.PinCode)+"",zip:ad.ZipCode||"",
        owner:p.PropertyOwner||"SE",ownerOther:p.PropertyOwnerOther||"",co:p.PropCoOwnedFlg==="YES"?"YES":"NO",share:p.AsseseeShareProperty,
        coowners:(p.CoOwners||[]).map(c=>({name:c.NameCoOwner,pan:c.PAN_CoOwner||"",aadhaar:c.Aadhaar_CoOwner||"",share:nz(c.PercentShareProperty)})),
        type:p.ifLetOut||"S",tenants:(p.TenantDetails||[]).map(t=>({name:t.NameofTenant,pan:t.PANofTenant||"",aadhaar:t.AadhaarofTenant||"",pantan:t.PANTANofTenant||""})),
        rent:nz(rd.AnnualLetableValue),unreal:nz(rd.RentNotRealized),taxes:nz(rd.LocalTaxes),arrears:rd.ArrearsUnrealizedRentRcvd?Math.round(rd.ArrearsUnrealizedRentRcvd/0.7):"",
        loans:(g_(rd,"Section24B.Section24BDtls")||[]).map(l=>({from:l.LoanTknFrom,name:l.BankOrInstnName,acno:l.LoanAccNoOfBankOrInstnRefNo,dt:dmy(l.DateofLoan),amt:l.TotalLoanAmt,os:l.LoanOutstndngAmt,interest:l.InterestUs24B}))};})};
    got.push("house property");}
  /* ---- Schedule CG ---- */
  if(I.ScheduleCGFor23){const cg=I.ScheduleCGFor23,ST=cg.ShortTermCapGainFor23||{},LT=cg.LongTermCapGain23||{};
    const C=JSON.parse(JSON.stringify(CG_STATE_DEFAULT));C.on="1";
    const landOf=(d,isLT)=>{const b=g_(d,"TrnsfImmblPrprty.TrnsfImmblPrprtyDtls")||[];const first=b[0]||{};const ded={};
      (g_(d,"ExemptionOrDednUs54.ExemptionOrDednUs54Dtls")||[]).forEach(x=>ded["s"+x.ExemptionSecCode]=x.ExemptionAmount);if(d.DeductionUs54B)ded.s54B=d.DeductionUs54B;
      return {buy:dmy(d.DateofPurchase),sale:dmy(d.DateofSale),lt:isLT?"Long":"Short",cons:d.FullConsideration,sdv:nz(d.PropertyValuation),cost:d.AquisitCost,exp:nz(d.ExpOnTrans),
        improve:(g_(d,"CostOfImprovements.CostOfImprovementsDtls")||[]).map(x=>({amt:x.ImproveCost,yr:x.ImproveDate})),ded,
        buyers:b.map(x=>({name:x.NameOfBuyer,pan:x.PANofBuyer||"",aadhaar:x.AaadhaarOfBuyer||"",share:x.PercentageShare,amt:x.Amount})),
        paddr:first.AddressOfProperty||"",pstate:first.StateCode||"",ppin:nz(first.PinCode)+"",s45_5a:d.ChargeableUs45_5A==="Y"?"Yes":"No",ccDate:dmy(d.DateOfCompletionCert)};};
    C.land=(g_(ST,"SaleofLandBuild.SaleofLandBuildDtls")||[]).map(d=>landOf(d,false)).concat((g_(LT,"SaleofLandBuild.SaleofLandBuildDtls")||[]).map(d=>landOf(d,true)));
    const aggOf=(b)=>b?{cons:nz(b.FullConsideration),unqCons:nz(b.FullValueConsdRecvUnqshr),unqFmv:nz(b.FairMrktValueUnqshr),othCons:nz(b.FullValueConsdOthUnqshr),cost:nz(g_(b,"DeductSec48.AquisitCost")),improve:nz(g_(b,"DeductSec48.ImproveCost")),exp:nz(g_(b,"DeductSec48.ExpOnTrans")),loss94:nz(b.LossSec94of7Or94of8),ded:{s54F:nz(b.DeductionUs54F)}}:{};
    (ST.EquityMFonSTT||[]).forEach(e=>{const a=aggOf(e.EquityMFonSTTDtls);if(e.MFSectionCode==="1A")C.a3i=a;else C.a3ii=a;});
    if(ST.SaleOnOtherAssets)C.a6=aggOf(ST.SaleOnOtherAssets);
    if(ST.SlumpSaleInStcg)C.a2={fmv2:nz(ST.SlumpSaleInStcg.FMV11UAEii),fmv3:nz(ST.SlumpSaleInStcg.FMV11UAEiii),networth:nz(ST.SlumpSaleInStcg.NetWorthOfDivision)};
    C.a7={deem:(g_(ST,"UnutilizedCg.UnutilizedCgPrvYrDtls")||[]).map(x=>({py:x.PrvYrInWhichAsstTrnsfrd,acqyr:x.YrInWhichAssetAcq,used:x.AmtUtilized,unused:x.AmtUnutilized})),other:nz(ST.AmtDeemedStcg)};
    C.a8={r20:nz(ST.PassThrIncNatureSTCG20Per),r30:nz(ST.PassThrIncNatureSTCG30Per),rApp:nz(ST.PassThrIncNatureSTCGAppRate)};
    C.aA=(g_(ST,"CapitalLossBuyBackShares.CapitalLossBuyBackSharesDtls")||[]).map(x=>({rate:x.Rate,amt:Math.abs(x.Amount)}));
    if(LT.SlumpSaleInLtcgDtls)C.b2={fmv2:nz(g_(LT,"SlumpSaleInLtcgDtls.SlumpSaleInLtcg.FMV11UAEii")),fmv3:nz(g_(LT,"SlumpSaleInLtcgDtls.SlumpSaleInLtcg.FMV11UAEiii")),networth:nz(g_(LT,"SlumpSaleInLtcgDtls.SlumpSaleInLtcg.NetWorthOfDivision"))};
    (LT.Proviso112Applicable||[]).forEach(e=>{const d=e.Proviso112Applicabledtls||{};const a={cons:nz(d.FullConsideration),cost:nz(g_(d,"DeductSec48.AquisitCost")),improve:nz(g_(d,"DeductSec48.ImproveCost")),exp:nz(g_(d,"DeductSec48.ExpOnTrans")),ded:{s54F:nz(d.DeductionUs54F)}};if(e.Proviso112SectionCode==="5ACA1b")C.b3iii=a;else C.b3ii=a;});
    C.b4={s54F:nz(g_(LT,"SaleOfEquityShareUs112A.DeductionUs54F"))};
    if(g_(LT,"SaleofAssetNADtls.SaleofAssetNA"))C.b9=aggOf(LT.SaleofAssetNADtls.SaleofAssetNA);
    C.b10={deem:(g_(LT,"UnutilizedCg.UnutilizedCgPrvYrDtls")||[]).map(x=>({py:x.PrvYrInWhichAsstTrnsfrd,sec:x.SectionClmd,acqyr:x.YrInWhichAssetAcq,used:x.AmtUtilized,unused:x.AmtUnutilized})),other:nz(LT.AmtDeemedLtcg)};
    C.b11={r125a:nz(LT.PassThrIncNatureLTCGUs112A12_5Per),r125o:nz(LT.PassThrIncNatureLTCG12_5Per)};
    if(g_(LT,"CapitalLossBuyBackShares.TotalCapitalLossBuyBackShares"))C.bA=[{amt:Math.abs(LT.CapitalLossBuyBackShares.TotalCapitalLossBuyBackShares)}];
    const DD=cg.DeducClaimInfo||{};C.dedD={};
    [["54","DeducClaimDtlsUs54"],["54B","DeducClaimDtlsUs54B"],["54EC","DeducClaimDtlsUs54EC"],["54F","DeducClaimDtlsUs54F"],["115F","DeducClaimDtlsUs115F"]].forEach(([sec,k])=>{if(DD[k]&&DD[k].length)C.dedD[sec]=DD[k].map(r=>({transfer:dmy(r.DateofTransfer),cost:nz(r.CostofNewResHouse||r.CostofNewAgriLand||r.AmtInvested),purchase:dmy(r.DateofPurchase||r.DateofInvestment),dep:nz(r.AmtDeposited),depdt:dmy(r.DepositDate),acno:r.AccountNo||"",ifsc:r.IFSC||""}));});
    /* B9's one deduction slot is labelled 54F; Part D says which sections it really was — reconcile */
    {const partD={};Object.keys(C.dedD).forEach(sec=>partD[sec]=(C.dedD[sec]||[]).reduce((a,r)=>a+N(r.cost>0&&r.cost<9e15?0:0),0));
      [["54","DeducClaimDtlsUs54"],["54B","DeducClaimDtlsUs54B"],["54EC","DeducClaimDtlsUs54EC"],["54F","DeducClaimDtlsUs54F"],["115F","DeducClaimDtlsUs115F"]].forEach(([sec,k])=>{partD[sec]=(DD[k]||[]).reduce((a,r)=>a+N(r.AmtDeducted),0);});
      C.land.forEach(p=>Object.keys(p.ded||{}).forEach(k=>{const sec=k.slice(1);partD[sec]=Math.max(0,(partD[sec]||0)-N(p.ded[k]));}));
      let slot=N((C.b9.ded||{}).s54F);if(slot){C.b9.ded={};["54EC","54F","54","54B","115F"].forEach(sec=>{const t=Math.min(slot,partD[sec]||0);if(t>0){C.b9.ded["s"+sec]=t;partD[sec]-=t;slot-=t;}});if(slot)C.b9.ded.s54F=(C.b9.ded.s54F||0)+slot;}}
    if(I.Schedule112A)C.s112a=(I.Schedule112A.Schedule112ADtls||[]).map(r=>({isin:r.ISINCode==="INNOTREQUIRD"?"":r.ISINCode,name:r.ShareUnitName,pre18:r.ShareOnOrBefore,qty:r.NumSharesUnits||1,price:r.NumSharesUnits?r.SalePricePerShareUnit:r.TotSaleValue,cost:r.AcquisitionCost,fmv18:nz(r.FairMktValuePerShareunit),exp:nz(r.ExpExclCnctTransfer)}));
    if(I.Schedule115AD)C.s115ad=(I.Schedule115AD.Schedule115ADDtls||[]).map(r=>({isin:r.ISINCode==="INNOTREQUIRD"?"":r.ISINCode,name:r.ShareUnitName,pre18:r.ShareOnOrBefore,qty:r.NumSharesUnits,price:r.SalePricePerShareUnit,cost:r.AcquisitionCost,fmv18:nz(r.FairMktValuePerShareunit),exp:nz(r.ExpExclCnctTransfer)}));
    if(I.ScheduleVDA)C.vda=(I.ScheduleVDA.ScheduleVDADtls||[]).map(r=>({buy:dmy(r.DateofAcquisition),sale:dmy(r.DateofTransfer),cost:r.AcquisitionCost,cons:r.ConsidReceived}));
    S.cg=C;got.push("capital gains");}
  /* ---- Schedule OS ---- */
  if(I.ScheduleOS){const IO=I.ScheduleOS.IncOthThanOwnRaceHorse||{},H=I.ScheduleOS.IncFromOwnHorse;const O=JSON.parse(JSON.stringify(OS_STATE_DEFAULT));O.on="1";
    O.d={ord:nz(IO.DividendOthThan22e),e22:nz(IO.Dividend22e),f22:nz(IO.Dividend22f)};
    O.i={sav:nz(IO.IntrstFrmSavingBank),dep:nz(IO.IntrstFrmTermDeposit),refund:nz(IO.IntrstFrmIncmTaxRefund),pti:nz(IO.NatofPassThrghIncome),pf11a:nz(IO.IntrstSec10XIFirstProviso),pf11b:nz(IO.IntrstSec10XISecondProviso),pf12a:nz(IO.IntrstSec10XIIFirstProviso),pf12b:nz(IO.IntrstSec10XIISecondProviso),others:nz(IO.IntrstFrmOthers)};
    O.rent=nz(IO.RentFromMachPlantBldgs);O.g={money:nz(IO.Aggrtvaluewithoutcons562x),immWithout:nz(IO.Immovpropwithoutcons562x),immInadeq:nz(IO.Immovpropinadeqcons562x),othWithout:nz(IO.Anyotherpropwithoutcons562x),othInadeq:nz(IO.Anyotherpropinadeqcons562x)};
    O.e={fap:nz(IO.FamilyPension),oth89a:nz(IO.IncomeNotifiedOther89AOS),prev89a:nz(IO.IncomeNotifiedPrYr89AOS),s562xii:nz(IO.SumRecdPrYrBusTRU562xii),s562xiii:nz(IO.SumRecdPrYrLifIns562xiii)};
    (IO.IncomeNotified89ATypeOS||[]).forEach(c=>O.e["n89a_"+c.NOT89ACountrycode]=c.NOT89AAmount);
    O.eOther=(g_(IO,"OthersInc.OthersIncDtls")||[]).map(r=>({nature:r.OthNatOfInc,amt:r.OthAmount}));
    O.sp={lottery:nz(IO.LtryPzzlChrgblUs115BB),online:nz(IO.IncChrgblUs115BBJ),s68:nz(IO.CashCreditsUs68),s69:nz(IO.UnExplndInvstmntsUs69),s69A:nz(IO.UnExplndMoneyUs69A),s69B:nz(IO.UnDsclsdInvstmntsUs69B),s69C:nz(IO.UnExplndExpndtrUs69C),s69D:nz(IO.AmtBrwdRepaidOnHundiUs69D)};
    O.pf111=(g_(IO,"TaxAccumulatedBalRecPF.TaxAccmltdBalRecPFDtls")||[]).map(r=>({ay:r.AssessmentYear,incben:r.IncomeBenefit,taxben:r.TaxBenefit}));
    O.spl=(IO.OthersGrossDtls||[]).map(r=>({code:r.SourceDescription,amt:r.SourceAmount}));O.pti=(IO.PTIOthersGrossDtls||[]).map(r=>({code:String(r.SourceDescription).replace(/^PTI_/,""),amt:r.SourceAmount}));
    O.dtaa=(g_(IO,"IncChargblSplRateOS.NRIOsDTAA.NRIDTAADtlsSchOS")||[]).map(r=>({amt:r.DTAAamt,nature:r.NatureOfIncome,itemno:r.ItemNoincl,country:r.CountryName,code:r.CountryCodeExcludingIndia,article:r.DTAAarticle,treaty:r.RateAsPerTreaty===0?"NIL":r.RateAsPerTreaty,trc:r.TaxRescertifiedFlag,itrate:r.RateAsPerITAct}));
    const D=IO.Deductions||{};O.ded={exp:nz(D.Expenses),dep:nz(D.Depreciation),intClaimed:nz(D.UsrIntExp57)};O.s58=nz(IO.AmtNotDeductibleUs58);O.s59=nz(IO.ProfitChargTaxUs59);O.rel89a=nz(IO.Increliefus89AOS);
    O.horse=H?{on:true,rec:nz(H.Receipts),ded57:nz(H.DeductSec57),s58:nz(H.AmtNotDeductibleUs58),s59:nz(H.ProfitChargTaxUs59)}:{on:false};
    const QK=["Upto15Of6","Upto15Of9","Up16Of9To15Of12","Up16Of12To15Of3","Up16Of3To31Of3"];O.Q={};let anyQ=false;
    OS_Q.forEach(([k,l,key])=>{const dr=g_(I.ScheduleOS,key+".DateRange");if(dr){const arr=QK.map(q=>nz(dr[q]));if(arr.some(v=>v!=="")){O.Q[k]=arr;anyQ=true;}}});O.editQ=anyQ?"1":"";
    S.os2=O;got.push("other sources");}
  /* ---- CFL ---- */
  if(I.ScheduleCFL){S.loss={cfl:{},editC:"",editB:""};CFL_YEARS.forEach(([y,key])=>{const d=g_(I.ScheduleCFL,key+".CarryFwdLossDetail");if(d)S.loss.cfl[y]={dt:dmy(d.DateOfFiling),hp:nz(d.TotalHPPTILossCF),st:nz(d.TotalSTCGPTILossCF),lt:nz(d.TotalLTCGPTILossCF),horse:nz(d.OthSrcLossRaceHorseCF)};});got.push("losses carried forward");}
  /* ---- VI-A and the sub-schedules ---- */
  if(I.ScheduleVIA){const U=I.ScheduleVIA.UsrDeductUndChapVIA||{};const MAP={Section80C:"c80c",Section80CCC:"c80ccc",Section80CCDEmployeeOrSE:"c80ccd1",Section80CCD1B:"c80ccd1b",Section80CCDEmployer:"c80ccd2",Section80DD:"c80dd",Section80DDB:"c80ddb",Section80GG:"c80gg",Section80U:"c80u",Section80QQB:"c80qqb",Section80RRB:"c80rrb",Section80TTA:"c80tta",Section80TTB:"c80ttb",AnyOthSec80CCH:"c80cch"};
    S.via={};Object.keys(MAP).forEach(k=>{if(U[k])S.via[MAP[k]]=U[k];});
    S.via.pran=g_(U,"PRANDtls.0.PRANNum")||"";S.via.ddb_type=U.Section80DDBUsrType||"1";S.via.ddb_disease=U.NameOfSpecDisease80DDB||"";S.via.ack10ba=U.Form10BAAckNum||"";S.via.ack10ccd=U.Form10CCDAckNum||"";S.via.ack10cce=U.Form10CCEAckNum||"";
    S.pen80ccc=(U.PensionContribution80CCC||[]).map(r=>({type:r.TypeofIdentifier==="PRAN"?"NPS":"OTH",id:r.NameofIdentifier,amt:r.Amount}));got.push("deductions");}
  if(I.Schedule80C)S.c80c=(I.Schedule80C.Schedule80CDtls||[]).map(r=>({amt:r.Amount,id:r.IdentificationNo}));
  if(I.Schedule80D){const b=I.Schedule80D.Sec80DSelfFamSrCtznHealth||{};const ins=k=>(g_(b,k+".Sch80DInsDtls")||[]).map(r=>({insurer:r.InsurerName,policy:r.PolicyNo,amt:r.HealthInsAmt}));
    S.d80={selfSr:b.SeniorCitizenFlag===undefined?"N/A":b.SeniorCitizenFlag,parSr:b.ParentsSeniorCitizenFlag===undefined?"N/A":b.ParentsSeniorCitizenFlag,selfIns:ins("Sec80DSelfFamHIDtls"),selfPHC:nz(b.PrevHlthChckUpSlfFam),selfSrIns:ins("Sec80DSelfFamSrCtznHIDtls"),selfSrPHC:nz(b.PrevHlthChckUpSlfFamSrCtzn),selfSrMed:nz(b.MedicalExpSlfFamSrCtzn),parIns:ins("Sec80DParentsHIDtls"),parPHC:nz(b.PrevHlthChckUpParents),parSrIns:ins("Sec80DParentsSrCtznHIDtls"),parSrPHC:nz(b.PrevHlthChckUpParentsSrCtzn),parSrMed:nz(b.MedicalExpParentsSrCtzn)};}
  if(I.Schedule80DD){const x=I.Schedule80DD;S.dd80={nature:x.NatureOfDisability,type:x.TypeOfDisability,amt:x.DeductionAmount,dep:x.DependentType,pan:x.DependentPan||"",aadhaar:x.DependentAadhaar||"",f10dt:dmy(x.Form10IAFilingDate),f10ack:x.Form10IAAckNum||"",udid:x.UDIDNum||""};}
  if(I.Schedule80U){const x=I.Schedule80U;S.u80={nature:x.NatureOfDisability==="2"?"SelfSevere":"Self",type:x.TypeOfDisability,dt:dmy(x.Form10IAFilingDate),ack:x.Form10IAAckNum||"",udid:x.UDIDNum||""};S.via.c80u=x.DeductionAmount;}
  {const ln=(blk,dk,ik)=>(g_(I,blk+"."+dk)||[]).map(r=>({from:r.LoanTknFrom,name:r.BankOrInstnName,acno:r.LoanAccNoOfBankOrInstnRefNo,dt:dmy(r.DateofLoan),amt:r.TotalLoanAmt,os:r.LoanOutstndngAmt,reg:r.VehicleRegNo||"",interest:r[ik]}));
    S.e80={e:ln("Schedule80E","Schedule80EDtls","Interest80E"),ee:ln("Schedule80EE","Schedule80EEDtls","Interest80EE"),eea:ln("Schedule80EEA","Schedule80EEADtls","Interest80EEA"),eeb:ln("Schedule80EEB","Schedule80EEBDtls","Interest80EEB"),eeaSdv:nz(g_(I,"Schedule80EEA.PropStmpDtyVal"))};}
  if(I.Schedule80G){const G=I.Schedule80G;S.g80=[];[["A","Don100Percent"],["B","Don50PercentNoApprReqd"],["C","Don100PercentApprReqd"],["D","Don50PercentApprReqd"]].forEach(([b,k])=>{(g_(G,k+".DoneeWithPan")||[]).forEach(r=>{const a=r.AddressDetail||{};S.g80.push({bucket:b,name:r.DoneeWithPanName,addr:a.AddrDetail,city:a.CityOrTownOrDistrict,state:a.StateCode,pin:nz(a.PinCode)+"",pan:r.DoneePAN,arn:r.ArnNbr||"",cash:nz(r.DonationAmtCash),other:nz(r.DonationAmtOtherMode),ref:r.TransactionRefNum||"",ifsc:r.IFSCCode||"",amt:r.DonationAmt});});});}
  if(I.Schedule80GGA)S.gga=(I.Schedule80GGA.DonationDtlsSciRsrchRuralDev||[]).map(r=>{const a=r.AddressDetail||{};return {clause:r.RelevantClauseUndrDedClaimed,name:r.NameOfDonee,addr:a.AddrDetail,city:a.CityOrTownOrDistrict,state:a.StateCode,pin:nz(a.PinCode)+"",pan:r.DoneePAN,mode:r.DonationAmtCash?"CASH":"OTH",amt:r.DonationAmt};});
  if(I.Schedule80GGC)S.ggc=(I.Schedule80GGC.Schedule80GGCDetails||[]).map(r=>({dt:dmy(r.DonationDate),name:r.PoliticalPartyName||"",pan:r.PoliticalPartyPAN||"",mode:r.DonationAmtCash?"CASH":"OTH",ref:r.TransactionRefNum||"",ifsc:r.IFSCCode||"",amt:r.DonationAmt}));
  if(I.ScheduleAMTC){S.amtc={};(I.ScheduleAMTC.ScheduleAMTCDtls||[]).forEach(r=>S.amtc[r.AssYr]={gross:r.Gross,setoff:r.AmtCreditSetOfEy});}
  if(I.ScheduleSPI)S.spi=(I.ScheduleSPI.SpecifiedPerson||[]).map(r=>({name:r.SpecifiedPersonName,pan:r.PANofSpecPerson||"",aadhaar:r.AaadhaarOfSpecPerson||"",rel:r.ReltnShip,amt:r.AmtIncluded,head:r.HeadIncIncluded}));
  if(I.ScheduleEI){const E=I.ScheduleEI;S.ei2={interest:nz(E.InterestInc),agriGross:nz(E.GrossAgriRecpt),agriExp:nz(E.ExpIncAgri),agriUnab:nz(E.UnabAgriLossPrev8),
      land:(g_(E,"ExcNetAgriInc.ExcNetAgriIncDtls")||[]).map(r=>({district:r.NameOfDistrict,pin:nz(r.PinCode)+"",acres:r.MeasurementOfLand,owned:r.AgriLandOwnedFlag,irr:r.AgriLandIrrigatedFlag})),
      others:(g_(E,"OthersInc.OthersIncDtls")||[]).map(r=>({cat:r.Category||"OTH",sub:r.SubCategory||"",desc:r.Description||"",amt:r.OthAmount})),
      dtaa:(g_(E,"IncNotChrgblAsPerDTAA.IncNotChrgblAsPerDTAADtls")||[]).map(r=>({amt:r.AmountOfIncome,nature:r.NatureOfIncome,country:r.CountryName,code:r.CountryCodeExcludingIndia,article:r.ArticleOfDTAA,head:r.HeadOfIncome,trc:r.TRCFlag}))};got.push("exempt income");}
  if(I.SchedulePTI){const leaf=(o)=>o?{inc:nz(o.AmountOfInc),loss:nz(o.CurrYrLossShareByInvstFund),tds:nz(o.TDSAmount)}:{};
    S.pti2=(I.SchedulePTI.SchedulePTIDtls||[]).map(b=>{const c=b.CapitalGainsPTI||{},x=b.IncClmdPTI||{};return {kind:b.InvstmntCvrdUs115UA115UB,name:b.BusinessName,pan:b.BusinessPAN,rows:{hp:leaf(b.IncFromHP),st111a:leaf(c.STCG_Sec111A),stOth:leaf(c.STCG_Others),lt112a:leaf(c.LTCG_Sec112A),ltOth:leaf(c.LTCG_Others),osDiv:leaf(b.OS_Dividend),osOth:leaf(b.OS_Others),ex23fbb:leaf(x.Sec23FBB)}};});}
  if(I.ScheduleFSI){const trSec={};(g_(I,"ScheduleTR1.ScheduleTR")||[]).forEach(r=>trSec[r.CountryCodeExcludingIndia]=r.ReliefClaimedUsSection);
    S.fsi2=(I.ScheduleFSI.ScheduleFSIDtls||[]).map(b=>{const hd=o=>o?{inc:nz(o.IncFrmOutsideInd),paid:nz(o.TaxPaidOutsideInd),article:o.DTAAReliefUs90or90A||""}:{};return {code:b.CountryCodeExcludingIndia,name:b.CountryName,tin:b.TaxIdentificationNo,sec:trSec[b.CountryCodeExcludingIndia]||"90",h:{sal:hd(b.IncFromSal),hp:hd(b.IncFromHP),cg:hd(b.IncCapGain),os:hd(b.IncOthSrc)}};});
    const T=I.ScheduleTR1||{};S.tr2={refundFlag:T.TaxPaidOutsideIndFlg||"NO",refundAmt:nz(T.AmtTaxRefunded),refundAY:T.AssmtYrTaxRelief||""};got.push("foreign income");}
  if(I.ScheduleFA){const F=I.ScheduleFA;const cc=r=>({code:r.CountryCodeExcludingIndia,country:r.CountryName,zip:r.ZipCode||""});const off=r=>({offAmt:nz(r.IncTaxAmt!==undefined?r.IncTaxAmt:r.IncOfferedAmt),offSch:r.IncTaxSch||r.IncOfferedSch||"NI",offItem:r.IncTaxSchNo||r.IncOfferedSchNo||""});
    S.fa2={bank:(F.DetailsForiegnBank||[]).map(r=>Object.assign(cc(r),{inst:r.Bankname,addr:r.AddressOfBank,acno:r.ForeignAccountNumber,status:r.OwnerStatus,opened:dmy(r.AccOpenDate),peak:r.PeakBalanceDuringYear,close:r.ClosingBalance,interest:r.IntrstAccured})),
      cust:(F.DtlsForeignCustodialAcc||[]).map(r=>Object.assign(cc(r),{inst:r.FinancialInstName,addr:r.FinancialInstAddress,acno:r.AccountNumber,status:r.Status,opened:dmy(r.AccOpenDate),peak:r.PeakBalanceDuringPeriod,close:r.ClosingBalance,gross:r.GrossAmtPaidCredited,nature:r.NatureOfAmount})),
      equity:(F.DtlsForeignEquityDebtInterest||[]).map(r=>Object.assign(cc(r),{entity:r.NameOfEntity,addr:r.AddressOfEntity,nature:r.NatureOfEntity,acq:dmy(r.InterestAcquiringDate),initial:r.InitialValOfInvstmnt,peak:r.PeakBalanceDuringPeriod,close:r.ClosingBalance,paid:r.TotGrossAmtPaidCredited,proceeds:r.TotGrossProceeds})),
      insur:(F.DtlsForeignCashValueInsurance||[]).map(r=>Object.assign(cc(r),{inst:r.FinancialInstName,addr:r.FinancialInstAddress,dt:dmy(r.ContractDate),cashval:r.CashValOrSurrenderVal,paid:r.TotGrossAmtPaidCredited})),
      fin:(F.DetailsFinancialInterest||[]).map(r=>Object.assign(cc(r),{nature:r.NatureOfEntity||"",entity:r.NameOfEntity,addr:r.AddressOfEntity,interest:r.NatureOfInt,since:dmy(r.DateHeld),cost:r.TotalInvestment,inc:r.IncFromInt,incNature:r.NatureOfInc},off(r))),
      imm:(F.DetailsImmovableProperty||[]).map(r=>Object.assign(cc(r),{addr:r.AddressOfProperty||"",own:r.Ownership,acq:dmy(r.DateOfAcq),cost:r.TotalInvestment,inc:r.IncDrvProperty,incNature:r.NatureOfInc},off(r))),
      oth:(F.DetailsOthAssets||[]).map(r=>Object.assign(cc(r),{nature:r.NatureOfAsset,own:r.Ownership,acq:dmy(r.DateOfAcq),cost:r.TotalInvestment,inc:r.IncDrvAsset,incNature:r.NatureOfInc},off(r))),
      sign:(F.DetailsOfAccntsHvngSigningAuth||[]).map(r=>Object.assign(cc(r),{inst:r.NameOfInstitution,addr:r.AddressOfInstitution,holder:r.NameMentionedInAccnt,acno:r.InstitutionAccountNumber,peak:r.PeakBalanceOrInvestment,taxable:r.IncAccuredTaxFlag,inc:nz(r.IncAccuredInAcc)},off(r))),
      trust:(F.DetailsOfTrustOutIndiaTrustee||[]).map(r=>Object.assign(cc(r),{trust:r.NameOfTrust,trustAddr:r.AddressOfTrust,trustees:r.NameOfOtherTrustees,trusteesAddr:r.AddressOfOtherTrustees,settlor:r.NameOfSettlor,settlorAddr:r.AddressOfSettlor,benef:r.NameOfBeneficiaries,benefAddr:r.AddressOfBeneficiaries,since:dmy(r.DateHeld),taxable:r.IncDrvTaxFlag,inc:nz(r.IncDrvFromTrust)},off(r))),
      othInc:[]};got.push("foreign assets");}
  if(I.Schedule5A2014){const A=I.Schedule5A2014;const hd=o=>o?{inc:nz(o.IncRecvdUndHead),spouse:nz(o.AmtApprndOfSpouse),tds:nz(o.AmtTDSDeducted),tdsSp:nz(o.TDSApprndOfSpouse)}:{};S.sch5a2={name:A.NameOfSpouse,pan:A.PANOfSpouse,aadhaar:A.AadhaarOfSpouse||"",h:{hp:hd(A.HPHeadIncome),cg:hd(A.CapGainHeadIncome),os:hd(A.OtherSourcesHeadIncome)}};}
  if(I.ScheduleAL){const A=I.ScheduleAL,M=A.MovableAsset||{};S.al2={hasImm:(A.ImmovableDetails||[]).length?"Y":"N",imm:(A.ImmovableDetails||[]).map(r=>{const a=r.AddressAL||{};return {desc:r.Description,flat:a.ResidenceNo,premises:a.ResidenceName||"",road:a.RoadOrStreet||"",locality:a.LocalityOrArea,city:a.CityOrTownOrDistrict,state:a.StateCode,country:a.CountryCode,pin:nz(a.PinCode)+"",zip:a.ZipCode||"",amt:r.Amount};}),
      jewel:nz(M.JewelleryBullionEtc),art:nz(M.ArchCollDrawPaintSulpArt),vehicle:nz(M.VehiclYachtsBoatsAircrafts),bank:nz(M.DepositsInBank),shares:nz(M.SharesAndSecurities),insur:nz(M.InsurancePolicies),loans:nz(M.LoansAndAdvancesGiven),cash:nz(M.CashInHand),liab:nz(A.LiabilityInRelatAssets)};got.push("assets and liabilities");}
  if(I.ScheduleESOP){const E=I.ScheduleESOP;S.esop={pan:E.PanofStartUp,dpiit:E.DPIITRegNo,deferNow:nz(g_(E,"ScheduleESOP2627_Type.BalanceTaxCF")),yrs:{}};
    [["2021-22","2122"],["2022-23","2223"],["2023-24","2324"],["2024-25","2425"],["2025-26","2526"]].forEach(([y,k])=>{const b=E["ScheduleESOP"+k+"_Type"];if(!b)return;const ev=b.ScheduleESOPEventDtls||{};S.esop.yrs[y]={bf:nz(b.TaxDeferredBFEarlierAY),sec:ev.SecurityType||"NS",ceased:ev.CeasedEmployee||"N",ceasedDt:dmy(ev.DateOfCeasing),exp48:"N",sales:(ev.ScheduleESOPEventDtlsType||[]).map(s=>({dt:dmy(s.Date),amt:s.TaxAttributedAmt}))};});}
  /* ---- taxes paid ---- */
  if(I.ScheduleTDS1)S.tds1=(I.ScheduleTDS1.TDSonSalary||[]).map(r=>({tan:g_(r,"EmployerOrDeductorOrCollectDetl.TAN"),name:g_(r,"EmployerOrDeductorOrCollectDetl.EmployerOrDeductorOrCollecterName"),inc:r.IncChrgSal,tds:r.TotalTDSSal}));
  const tdsBack=(r,buyer)=>{const c=r.TaxDeductCreditDtls||{};return {who:r.TDSCreditName,othPan:r.PANofOtherPerson||"",othAadh:r.AadhaarOfOtherPerson||"",tan:r.TANOfDeductor||"",pan:r.PANOfBuyerTenant||"",aadh:r.AadhaarOfBuyerTenant||"",sec:r.TDSSection,yr:nz(r.DeductedYr)+"",bf:nz(r.BroughtFwdTDSAmt),dedOwn:nz(c.TaxDeductedOwnHands),dedOthInc:nz(c.TaxDeductedIncome),dedOthTds:nz(c.TaxDeductedTDS),claimOwn:nz(c.TaxClaimedOwnHands),claimOthInc:nz(c.TaxClaimedIncome),claimOthTds:nz(c.TaxClaimedTDS),claimOthPan:c.TaxClaimedSpouseOthPrsnPAN||"",claimOthAadh:c.SpouseOthPrsnAadhaar||"",gross:nz(r.GrossAmount),head:r.HeadOfIncome||""};};
  if(I.ScheduleTDS2)S.tds2=(I.ScheduleTDS2.TDSOthThanSalaryDtls||[]).map(r=>tdsBack(r,false));
  if(I.ScheduleTDS3)S.tds3=(I.ScheduleTDS3.TDS3onOthThanSalDtls||[]).map(r=>tdsBack(r,true));
  if(I.ScheduleTCS)S.tcs=(I.ScheduleTCS.TCS||[]).map(r=>({who:r.TCSCreditOwner,tan:r.EmployerOrDeductorOrCollectTAN,othPan:r.PANOfSpouseOrOthrPrsn||"",yr:nz(r.DeductedYr)+"",bf:nz(r.BroughtFwdTDSAmt),collOwn:nz(g_(r,"TCSCurrFYDtls.TCSAmtCollOwnHand")),collOth:nz(g_(r,"TCSCurrFYDtls.TCSAmtCollSpouseOrOthrHand")),claimOwn:nz(g_(r,"TCSClaimedThisYearDtls.TCSAmtCollOwnHand")),claimOth:nz(g_(r,"TCSClaimedThisYearDtls.TCSAmtCollSpouseOrOthrHand")),claimOthPan:g_(r,"TCSClaimedThisYearDtls.PANOfSpouseOrOthrPrsn")||""}));
  if(I.ScheduleIT)S.it=(I.ScheduleIT.TaxPayment||[]).map(c=>({bsr:c.BSRCode,dt:dmy(c.DateDep),sn:String(c.SrlNoOfChaln),amt:c.Amt}));
  if(I.ScheduleTDS1||I.ScheduleTDS2||I.ScheduleIT)got.push("taxes paid");
  /* ---- Part B-TTI inputs, bank, verification, TRP ---- */
  const CTL=g_(I,"PartB_TTI.ComputationOfTaxLiability")||{};S.tax={s89:nz(g_(CTL,"TaxRelief.Section89")),f234i:nz(g_(CTL,"IntrstPay.FeeFurnish234I"))};
  const bk=g_(I,"PartB_TTI.Refund.BankAccountDtls.AddtnlBankDetails")||[];if(bk.length){S.bank=bk.map(b=>({ifsc:b.IFSCCode,bank:b.BankName,acno:b.BankAccountNo,type:b.AccountType,refund:b.UseForRefund==="true"?"Y":"N"}));got.push("bank accounts");}
  const V=I.Verification||{};S.ver={cap:V.Capacity||"S",name:g_(V,"Declaration.AssesseeVerName")||"",father:g_(V,"Declaration.FatherName")||"",pan:g_(V,"Declaration.AssesseeVerPAN")||"",place:V.Place||"",swid:g_(I,"CreationInfo.SWCreatedBy")||"",nacc:bk.length||""};
  if(I.TaxReturnPreparer)S.trp={id:I.TaxReturnPreparer.IdentificationNoOfTRP,name:I.TaxReturnPreparer.NameOfTRP,reimb:nz(I.TaxReturnPreparer.ReImbFrmGov)};
  return got;
}

function importFile(txt){let j;try{j=JSON.parse(txt);}catch(e){alert("That file is not readable JSON.");return;}
  if(j&&j.meta&&j.meta.app==="yukti"&&j.meta.form==="ITR-2"){
    Object.keys(j).forEach(k=>{if(k!=="C"&&k!=="meta")S[k]=j[k];});
    if(!S.cg||S.cg.tx)S.cg=JSON.parse(JSON.stringify(CG_STATE_DEFAULT));
    if(!S.os2)S.os2=JSON.parse(JSON.stringify(OS_STATE_DEFAULT));
    S.open={};paint();alert("Working file loaded — every field is back as it was saved.");return;}
  const I=j&&j.ITR&&j.ITR.ITR2;
  if(I&&I.PartA_GEN1){
    const got=importReturn(I);S.open={};paint();
    alert("Return JSON read back into the form: "+got.join(", ")+".\n\nComputed schedules — CYLA, BFLA, SI, AMT, Part B — are recomputed from these. Check the date of filing, which the return does not carry.");return;}
  const got=[];const pan=deepFind(j,["PAN","pan"]);
  if(pan&&PAN_RE.test(String(pan).toUpperCase())){S.pi.pan=String(pan).toUpperCase();got.push("PAN");}
  const nm=deepFind(j,["AssesseeName"]);
  if(nm&&typeof nm==="object"){S.pi.first=nm.FirstName||S.pi.first;S.pi.mid=nm.MiddleName||S.pi.mid;S.pi.last=nm.SurNameOrOrgName||S.pi.last;got.push("name");}
  const ad=deepFind(j,["Address"]);
  if(ad&&typeof ad==="object"){S.pi.addr1=ad.ResidenceNo||S.pi.addr1;S.pi.locality=ad.LocalityOrArea||S.pi.locality;S.pi.city=ad.CityOrTownOrDistrict||S.pi.city;
    S.pi.state=ad.StateCode||S.pi.state;S.pi.pin=ad.PinCode!=null?String(ad.PinCode):S.pi.pin;S.pi.mobile=ad.MobileNo!=null?String(ad.MobileNo):S.pi.mobile;S.pi.email=ad.EmailAddress||S.pi.email;got.push("address");}
  const aa=deepFind(j,["AadhaarCardNo"]);if(aa&&AADH.test(String(aa))){S.pi.aadhaar=String(aa);got.push("Aadhaar");}
  const dob=deepFind(j,["DOB"]);if(dob){S.pi.dob=dmy(dob)||S.pi.dob;got.push("date of birth");}
  const bk=deepFind(j,["AddtnlBankDetails"]);
  if(Array.isArray(bk)&&bk.length){S.bank=bk.map(b=>({ifsc:b.IFSCCode||"",bank:b.BankName||"",acno:b.BankAccountNo||"",type:b.AccountType||"SB",refund:b.UseForRefund==="true"?"Y":"N"}));got.push("bank accounts");}
  paint();alert(got.length?("Imported from the prefill: "+got.join(", ")+"."):"Nothing recognisable was found. If it is the portal prefill, check the assessment year.");}
$("filepick").addEventListener("change",e=>{const f=e.target.files[0];if(!f)return;
  const r=new FileReader();r.onload=()=>importFile(String(r.result));r.readAsText(f);});
$("b_open").addEventListener("click",()=>$("filepick").click());
