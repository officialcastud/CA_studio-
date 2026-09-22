/* Scenario: Business Trust (status 14, sub 4) with Schedule PTI — flat 30%. */
S.pi.status="14"; S.pi.substatus="4-Business Trust";
S.pi.name="SUDHIR INFRA BUSINESS TRUST"; S.pi.pan="AAATS5678Q";
S.pi.firms=[]; S.fs.partner="N"; S.fs.busTrust="Y"; S.fs.optout="Yes";
S.other.if={n:"0",firms:[]};

/* non-firm: partner remuneration/interest are firm-only (rule A124/A125) — move to other expenses */
S.pl.pl.DebitsToPL.DebitPlAcnt.OtherExpensesDtls.push({ExpenseNature:"Managerial remuneration",Amount:800000});
S.pl.pl.DebitsToPL.DebitPlAcnt.SalRemuneration=0;
S.pl.pl.DebitsToPL.DebitPlAcnt.OtherExpensesDtls.push({ExpenseNature:"Interest on members deposits",Amount:200000});
S.pl.pl.DebitsToPL.DebitPlAcnt.InterestExpdrtDtls.ResPartners=0;
S.pm.members.forEach(function(m){m.remun=0;m.roi=0;});
