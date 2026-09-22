/* Scenario: AOP registered u/s 12AA whose registration is cancelled —
   Schedule 115TD accreted income + tax thereon. */
S.pi.status="14"; S.pi.substatus="7-Any other AOP/BOI";
S.pi.name="SUDHIR CHARITABLE ASSOCIATION"; S.pi.pan="AAAAT5678Q";
S.pi.firms=[]; S.fs.partner="N"; S.fs.optout="Yes";
S.other.if={n:"0",firms:[]};
S.other.td={fmv:5000000, liab:1000000, fmv101:0, fmv12aa:0, fmv115td2:0,
  assetLiab:4000000, specDate:"15/09/2025", intOvr:"",
  challans:[{bsr:"0510308",bank:"State Bank of India, MG Road",date:"14/10/2025",srl:"91",amt:1400000}]};

/* non-firm: partner remuneration/interest are firm-only (rule A124/A125) — move to other expenses */
S.pl.pl.DebitsToPL.DebitPlAcnt.OtherExpensesDtls.push({ExpenseNature:"Managerial remuneration",Amount:800000});
S.pl.pl.DebitsToPL.DebitPlAcnt.SalRemuneration=0;
S.pl.pl.DebitsToPL.DebitPlAcnt.OtherExpensesDtls.push({ExpenseNature:"Interest on members deposits",Amount:200000});
S.pl.pl.DebitsToPL.DebitPlAcnt.InterestExpdrtDtls.ResPartners=0;
S.pm.members.forEach(function(m){m.remun=0;m.roi=0;});
S.fs.newTaxRegime="";
