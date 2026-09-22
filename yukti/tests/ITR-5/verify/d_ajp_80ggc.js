/* defect probe: an AJP (status 9) with an 80GGC political contribution.
   80GGC is barred for a Local Authority / AJP (80GGC.md P7), so the form
   zeroes the deduction — but does Schedule 80GGC stay self-consistent? */
S.pi.status="9"; S.pi.substatus="3-Other AJP";
S.pi.name="SUDHIR AJP"; S.pi.pan="AAAAJ5678Q";
S.pi.firms=[]; S.fs.partner="N"; S.fs.optout="Yes";
S.other.if={n:"0",firms:[]};
S.pl.pl.DebitsToPL.DebitPlAcnt.OtherExpensesDtls.push({ExpenseNature:"Managerial remuneration",Amount:800000});
S.pl.pl.DebitsToPL.DebitPlAcnt.SalRemuneration=0;
S.pl.pl.DebitsToPL.DebitPlAcnt.OtherExpensesDtls.push({ExpenseNature:"Interest on members deposits",Amount:200000});
S.pl.pl.DebitsToPL.DebitPlAcnt.InterestExpdrtDtls.ResPartners=0;
S.pm.members.forEach(function(m){m.remun=0;m.roi=0;});
/* the 80GGC contribution stays as in the reference client */
