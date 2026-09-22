/* Scenario: Investment Fund 115UB (status 14, sub 5) with Schedule PTI. */
S.pi.status="14"; S.pi.substatus="5-Investment Fund";
S.pi.name="SUDHIR AIF CAT II"; S.pi.pan="AAATI5678Q";
S.pi.firms=[]; S.fs.partner="N"; S.fs.invFund="Y"; S.fs.optout="Yes";
S.other.if={n:"0",firms:[]};
S.other.pti=[{kind:"B",name:"Sudhir AIF Category II",pan:"AAATI5679R",
  ex23fbb:{inc:400000,tds:20000}}];

/* non-firm: partner remuneration/interest are firm-only (rule A124/A125) — move to other expenses */
S.pl.pl.DebitsToPL.DebitPlAcnt.OtherExpensesDtls.push({ExpenseNature:"Managerial remuneration",Amount:800000});
S.pl.pl.DebitsToPL.DebitPlAcnt.SalRemuneration=0;
S.pl.pl.DebitsToPL.DebitPlAcnt.OtherExpensesDtls.push({ExpenseNature:"Interest on members deposits",Amount:200000});
S.pl.pl.DebitsToPL.DebitPlAcnt.InterestExpdrtDtls.ResPartners=0;
S.pm.members.forEach(function(m){m.remun=0;m.roi=0;});
S.ei.passThr=400000;
