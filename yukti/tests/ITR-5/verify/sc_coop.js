/* Scenario: Other Co-operative Society (status 14, sub 3), OLD regime,
   claiming Schedule 80P, co-op slab (10/20/30) + co-op surcharge ladder. */
S.pi.status="14"; S.pi.substatus="3-Other Cooperative Society";
S.pi.name="SUDHIR CO-OPERATIVE SOCIETY LTD"; S.pi.pan="AAAAC5678Q";
S.pi.firms=[];
S.fs.optout="Yes"; S.fs.partner="N";
S.other.if={n:"0",firms:[]};
S.ded.p={r15:{inc:300000,amt:300000}, r13:{inc:200000,amt:200000}};

/* non-firm: partner remuneration/interest are firm-only (rule A124/A125) — move to other expenses */
S.pl.pl.DebitsToPL.DebitPlAcnt.OtherExpensesDtls.push({ExpenseNature:"Managerial remuneration",Amount:800000});
S.pl.pl.DebitsToPL.DebitPlAcnt.SalRemuneration=0;
S.pl.pl.DebitsToPL.DebitPlAcnt.OtherExpensesDtls.push({ExpenseNature:"Interest on members deposits",Amount:200000});
S.pl.pl.DebitsToPL.DebitPlAcnt.InterestExpdrtDtls.ResPartners=0;
S.pm.members.forEach(function(m){m.remun=0;m.roi=0;});
S.fs.newTaxRegime="N";
S.nob.push({code:"23011",trade:"Sudhir Co-op Credit",desc:"80P(2)(d) interest/dividend from other co-op"});
S.nob.push({code:"23009",trade:"Sudhir Consumer Store",desc:"80P(2)(c)(i) consumer co-operative"});
