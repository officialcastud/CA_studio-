/* Scenario: AOP/BOI (status 14, sub 7-Any other AOP/BOI), NEW regime 115BAC.
   Slab-taxed, AMT under 115JC applies, no 80P, no partner-in-firm. */
S.pi.status="14"; S.pi.substatus="7-Any other AOP/BOI";
S.pi.name="SUDHIR WELFARE ASSOCIATION"; S.pi.pan="AAAAS5678Q";
S.pi.firms=[];
S.fs.optout="No"; S.fs.partner="N";
S.fs.f10ieaCurrOld=""; S.fs.f10ieaDateOld=""; S.fs.f10ieaAckOld="";
S.other.if={n:"0",firms:[]};
S.ded.p={};

/* non-firm: partner remuneration/interest are firm-only (rule A124/A125) — move to other expenses */
S.pl.pl.DebitsToPL.DebitPlAcnt.OtherExpensesDtls.push({ExpenseNature:"Managerial remuneration",Amount:800000});
S.pl.pl.DebitsToPL.DebitPlAcnt.SalRemuneration=0;
S.pl.pl.DebitsToPL.DebitPlAcnt.OtherExpensesDtls.push({ExpenseNature:"Interest on members deposits",Amount:200000});
S.pl.pl.DebitsToPL.DebitPlAcnt.InterestExpdrtDtls.ResPartners=0;
S.pm.members.forEach(function(m){m.remun=0;m.roi=0;});
