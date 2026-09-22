/* Scenario: firm filing a BELATED return u/s 139(4) with large brought-forward
   losses and a current-year business loss to carry forward. */
S.fs.sec=12; S.fs.filed="15/01/2027";
S.loss.cfl={
  "2020-21":{dt:"28/07/2020", bus5a:500000, spec:200000},
  "2021-22":{dt:"30/07/2021", lt:800000, hp:150000},
  "2022-23":{dt:"28/07/2022", st:1000000},
  "2023-24":{dt:"29/07/2023", bus5a:1200000},
  "2024-25":{dt:"31/10/2024", bus5a:900000, lt:300000}};
S.loss.ud={curBal:0,curAllowBal:0,rows:[
  {ay:"2023-24",bfUD:200000,adj:0,deprSO:200000,bfUAllow:0,allowSO:0},
  {ay:"2024-25",bfUD:600000,adj:0,deprSO:600000,bfUAllow:0,allowSO:0}]};
S.paid.it=[{bsr:"0510308",dt:"14/06/2025",sn:"11",amt:0}];
/* keep the UD set-off within the income the BFLA can absorb, and drop the
   deductions that the low GTI would clip (isolated separately) */
S.loss.ud.rows=[{ay:"2023-24",bfUD:200000,adj:0,deprSO:0,bfUAllow:0,allowSO:0},
                {ay:"2024-25",bfUD:600000,adj:0,deprSO:0,bfUAllow:0,allowSO:0}];
S.ded.aa=[]; S.ded.ggc=[]; S.ded.g80=[]; S.ded.ia={inf:["",""],pow:["",""]};
