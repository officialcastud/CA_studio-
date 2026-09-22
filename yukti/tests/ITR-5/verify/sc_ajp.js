/* Scenario: AJP — Estate of the insolvent (status 9, sub 2) → flat 30%. */
S.pi.status="9"; S.pi.substatus="2-Estate of the insolvent";
S.pi.name="ESTATE OF LATE R MENON"; S.pi.pan="AAAAJ5678Q";
S.pi.firms=[]; S.fs.partner="N"; S.fs.optout="Yes";
S.other.if={n:"0",firms:[]};

/* non-firm: partner remuneration/interest are firm-only (rule A124/A125) — move to other expenses */
S.pl.pl.DebitsToPL.DebitPlAcnt.OtherExpensesDtls.push({ExpenseNature:"Managerial remuneration",Amount:800000});
S.pl.pl.DebitsToPL.DebitPlAcnt.SalRemuneration=0;
S.pl.pl.DebitsToPL.DebitPlAcnt.OtherExpensesDtls.push({ExpenseNature:"Interest on members deposits",Amount:200000});
S.pl.pl.DebitsToPL.DebitPlAcnt.InterestExpdrtDtls.ResPartners=0;
S.pm.members.forEach(function(m){m.remun=0;m.roi=0;});
S.ded.ggc=[];   /* 80GGC is barred for an AJP (80GGC.md P7) */
