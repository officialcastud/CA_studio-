/* defect probe: a firm whose gross total income is far below its Chapter VI-A /
   10AA claims, so the deduction engine has to clip. Does the clipping leave
   Schedule 80G / 80GGC / 10AA self-consistent with Schedule VI-A? */
S.bp.pbt=150000;
S.pl.pl.DebitsToPL.DebitPlAcnt.OtherExpensesDtls.push({ExpenseNature:"Additional operating expenses",Amount:2480000});
S.hp={on:"", pti:0, props:[]};
S.cg={on:"", land:[], a2:{},a3:[],a4:{},a5:{},a6:{},a7:{unutFlag:"",deem:[],other:0,other45:0},a8:{},a9:[],aA:[],
 b2:{},b3:{},b5:{},b6:[],b8:{},b9:{unutFlag:"",deem:[],other:0,other45:0},b10:{},b11:[],bA:{},
 s112a:[], s115ad:[], vda:[], dclaim:{us54D:[],us54EC:[],us54G:[],us54GA:[]}, editE:false, editF:false};
S.os={divOth:0,div22e:0,div22f:0,intSaving:0,intDeposit:0,intRefund:0,intPTI:0,intOthers:0,rentMach:0,
 giftMoney:0,giftImmovWo:0,giftImmovInadeq:0,giftOthWo:0,giftOthInadeq:0,others:[],sum562xii:0,
 win115BB:0,win115BBJ:0,cc68:0,ui69:0,um69a:0,udi69b:0,ue69c:0,hundi69d:0,spl:[],pti:[],dtaa:[],
 dExpenses:0,dDep:0,dIntClaimed:0,notDed58:0,profit59:0,
 horse:{receipts:0,ded57:0,notDed58:0,profit59:0}, q:{}};
S.paid.tds2=[]; S.paid.tds3=[]; S.paid.tcs=[];
