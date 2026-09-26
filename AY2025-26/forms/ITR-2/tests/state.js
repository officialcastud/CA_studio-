/* ====== S SUDHIR · TVOPS4373C · A.Y. 2025-26 — the complete test return ====== */
S.pi={status:"I",first:"S",mid:"",last:"SUDHIR",pan:"TVOPS4373C",aadhaar:"734519826041",dob:"05/11/2006",passport:"N8814072",
  res:"RES",rescond:"1",empcat:"OTH",
  email:"s.sudhir.test@example.in",email2:"sudhir.alt@example.in",mobile:"9845012345",mobile2:"9900123456",std:"080",phone:"25551234",
  country:"91",addr1:"No. 42, 3rd Cross",premises:"Brigade Gardens",road:"Richmond Road",locality:"Richmond Town",city:"Bengaluru",state:"15",pin:"560025",
  addr2same:"No",addr1b:"Flat 7B",premisesb:"Prestige Lakeside",roadb:"Varthur Road",localityb:"Whitefield",cityb:"Bengaluru",stateb:"15",pinb:"560066",
  fpi:"No",rep:"No",dir:"Yes",dirco:[{name:"Sudhir Infotech Private Limited",type:"D",pan:"AABCS4321K",listed:"U",din:"07654321"},{name:"Global Trade Corp",type:"F",listed:"L",din:"07654322"}],
  partner:"Yes",firms:[{name:"Sudhir & Associates",pan:"AAJFS7788L"}],
  unl:"Yes",unlco:[{name:"Sudhir Infotech Private Limited",type:"D",pan:"AABCS4321K",open:5000,opencost:500000,acq:1000,acqdt:"15/09/2024",fv:10,ip:150,pp:150,sold:500,soldcons:120000,close:5500,closecost:600000}],
  s5a:"Yes",s115h:"No",lei:"3358005G7M7VX2ZUXX88",lei_dt:"31/12/2025"};
S.fs={optout:"Yes",sec:11,filed:"25/07/2025"};
S.decl={flag:"Yes",dep_f:"Yes",dep:12000000,trv_f:"Yes",trv:450000,ele_f:"Yes",ele:180000,c4_f:"Yes",c4:[{nature:"3",amt:60000}]};
/* ---- Schedule S — three employers ---- */
S.sal={emp:[
 {name:"Infosys Limited",empcat:"OTH",tan:"BLRI01234A",addr:"Electronics City, Bengaluru 560100",s17_1:2400000,s17_2:180000,s17_3:0,
  n17_1:[{code:"1",amt:1200000},{code:"2",amt:240000},{code:"4",amt:480000},{code:"5",amt:60000},{code:"7",amt:420000}],n17_2:[{code:"2",amt:120000},{code:"8",amt:60000}],
  n89a_US:0,exempt:[{nature:"10(13A)",amt:240000},{nature:"10(5)",amt:60000},{nature:"10(14)(i)",amt:24000}]},
 {name:"Wipro Limited",empcat:"OTH",tan:"BLRW05678B",addr:"Sarjapur Road, Bengaluru 560035",s17_1:1600000,s17_2:90000,s17_3:300000,
  n17_1:[{code:"1",amt:900000},{code:"2",amt:180000},{code:"4",amt:360000},{code:"13",amt:160000}],n17_2:[{code:"1",amt:90000}],n17_3:[{code:"1",amt:300000}],
  exempt:[{nature:"10(10)",amt:200000},{nature:"10(10AA)",amt:150000}]},
 {name:"Government of Karnataka",empcat:"SG",tan:"BLRG09999C",addr:"Vidhana Soudha, Bengaluru 560001",s17_1:900000,s17_2:0,s17_3:0,
  n17_1:[{code:"1",amt:600000},{code:"2",amt:120000},{code:"11",amt:180000}],
  n89a_US:150000,n89a_UK:50000,oth89a:30000,prev89a:20000,exempt:[{nature:"10(14)(ii)",amt:12000}]}],
 s16ii:5000,s16iii:2500};
/* ---- Schedule HP — two properties ---- */
S.hp={on:"1",pti:0,props:[
 {addr:"No. 42, 3rd Cross, Richmond Town",city:"Bengaluru",country:"91",state:"15",pin:"560025",owner:"SE",co:"NO",type:"S",
  loans:[{from:"B",name:"State Bank of India",acno:"HL3391120044",dt:"12/04/2019",amt:8000000,os:5200000,interest:310000}]},
 {addr:"Flat 7B, Prestige Lakeside, Whitefield",city:"Bengaluru",country:"91",state:"15",pin:"560066",owner:"SE",co:"YES",share:50,
  coowners:[{name:"Lakshmi Sudhir",pan:"AKPPL2211M",aadhaar:"612345678901",share:50}],type:"L",
  tenants:[{name:"Rohan Mehta",pan:"BQAPM7788N",aadhaar:"501234567890",pantan:"BQAPM7788N"}],
  rent:720000,unreal:30000,taxes:24000,arrears:60000,
  loans:[{from:"B",name:"HDFC Bank",acno:"HL77812345",dt:"20/07/2021",amt:4500000,os:3900000,interest:280000},{from:"B",name:"Axis Bank",acno:"HL-EE-0099",dt:"15/03/2017",amt:3200000,os:1900000,interest:48000},{from:"I",name:"Lakshmi Sudhir (spouse)",acno:"FAMILY-01",dt:"01/04/2022",amt:1000000,os:1000000,interest:60000}]}]};
/* ---- Schedule CG — every head ---- */
S.cg=Object.assign(JSON.parse(JSON.stringify(CG_STATE_DEFAULT)),{on:"1",
 land:[
  {buy:"05/03/2012",sale:"18/08/2024",lt:"",cons:32000000,sdv:34500000,cost:9000000,exp:320000,improve:[{amt:1200000,yr:"2016-17"},{amt:800000,yr:"2019-20"}],
   ded:{s54:6000000,s54EC:4700000},buyers:[{name:"Anil Kumar",pan:"AAAPK1122A",share:60,amt:19200000},{name:"Sunita Kumar",aadhaar:"456789012345",share:40,amt:12800000}],
   paddr:"Site 18, Sarjapur Layout",pstate:"15",ppin:"560035"},
  {buy:"10/01/2024",sale:"22/11/2024",lt:"",cons:7500000,sdv:7200000,cost:6800000,exp:75000,ded:{},buyers:[{name:"Meena Rao",pan:"AAAPR3344B",share:100,amt:7500000}],
   paddr:"Plot 5, Hoskote",pstate:"15",ppin:"562114"}],
 a3trades:[{name:"HDFC Bank",buy:"03/05/2024",sale:"02/09/2024",cons:640000,cost:590000,exp:1200},{name:"Tata Motors",buy:"12/06/2024",sale:"20/01/2025",cons:410000,cost:470000,exp:900}],
 a6:{unqCons:900000,unqFmv:1100000,othCons:250000,cost:400000,improve:0,exp:5000,loss94:0,dcg:0,ded:{}},
 a7:{deem:[{py:"2023-24",acqyr:"2025-26",used:1500000,unused:300000}],other:100000},
 a8:{r20:80000,r30:0,rApp:40000},
 aA:[{rate:"STL20",amt:25000}],
 b3i:{cons:600000,cost:450000,exp:2000},b3ii:{cons:1200000,cost:900000,exp:3000},b3iii:{cons:0,cost:0},
 b4:{s54F:0},
 b9:{unqCons:0,unqFmv:0,othCons:2200000,cost:1400000,improve:0,exp:10000,ded:{s54EC:300000}},
 b10:{deem:[{py:"2022-23",sec:"54",acqyr:"2024-25",used:2000000,unused:500000}],other:0},
 b11:{r125a:60000,r125o:90000},
 bA:[{amt:15000}],
 s112a:[{isin:"INE009A01021",name:"Infosys Ltd",pre18:"BE",qty:1500,price:1850,cost:1200000,fmv18:1150,exp:2000},{isin:"INE467B01029",name:"TCS Ltd",pre18:"AE",qty:300,price:4100,cost:900000,exp:800},{isin:"INF109K01Y41",name:"Nifty 50 Index Fund",pre18:"AE",qty:20000,price:180,cost:2500000,exp:0}],
 vda:[{buy:"14/07/2024",sale:"09/02/2025",cost:600000,cons:950000},{buy:"01/10/2024",sale:"15/03/2025",cost:300000,cons:280000}],
 dedD:{"54":[{transfer:"18/08/2024",cost:6000000,purchase:"10/01/2025",dep:0}],
       "54EC":[{transfer:"18/08/2024",cost:4700000,purchase:"30/11/2024"},{transfer:"05/10/2024",cost:300000,purchase:"20/12/2024"}]}});
/* ---- Schedule OS — every item ---- */
S.os2=Object.assign(JSON.parse(JSON.stringify(OS_STATE_DEFAULT)),{on:"1",
 d:{ord:640000,e22:50000,f22:120000},
 i:{sav:38000,dep:420000,refund:6200,pti:15000,pf11a:22000,pf11b:8000,pf12a:14000,pf12b:5000,others:75000},
 rent:180000,
 g:{money:80000,immWithout:0,immInadeq:250000,othWithout:60000,othInadeq:0},
 e:{fap:240000,n89a_US:120000,n89a_UK:0,n89a_CA:40000,oth89a:25000,prev89a:15000,s562xii:30000,s562xiii:200000},
 eOther:[{nature:"Guest lecture honorarium",amt:45000},{nature:"Prize from a quiz contest",amt:12000}],
 sp:{lottery:150000,online:60000,s68:200000,s69:0,s69A:50000,s69B:0,s69C:30000,s69D:0},
 pf111:[{ay:"2023-24",incben:40000,taxben:8000}],
 spl:[{code:"5BBF",amt:300000},{code:"5BBG",amt:80000},{code:"5ACA1a",amt:50000}],
 pti:[{code:"5A1ai",amt:35000}],
 ded:{exp:30000,dep:45000,intClaimed:180000},
 s58:8000,s59:12000,rel89a:60000,
 horse:{on:true,rec:250000,ded57:310000,s58:5000,s59:0},
 editQ:"1",Q:{lottery:["0","50000","0","100000","0"],online:["20000","0","0","40000","0"],div1aiii:["0","0","120000","0","0"],n89a:["0","0","0","100000","0"]}});
/* ---- CFL — brought forward, several years ---- */
S.loss={cfl:{"2018-19":{dt:"25/07/2018",hp:80000,st:0,lt:120000},"2019-20":{dt:"28/07/2019",hp:0,st:150000,lt:0},"2021-22":{dt:"30/07/2021",hp:0,st:0,lt:200000},
             "2023-24":{dt:"29/07/2023",hp:60000,st:90000,lt:0,horse:70000},"2024-25":{dt:"31/07/2024",hp:0,st:0,lt:0,horse:40000}},editC:"",editB:""};
/* ---- Chapter VI-A — every card ---- */
S.via={c80ccd2:96000,c80ddb:85000,ddb_type:"2",ddb_disease:"k",c80gg:0,c80qqb:280000,ack10ccd:"210987654321098",c80rrb:120000,ack10cce:"321098765432109",c80tta:12000,c80cch:0,pran:"110098765432"};
S.c80c=[{amt:150000,id:"PPF-BLR-0011223"},{amt:48000,id:"LIC-712345678"},{amt:30000,id:"ELSS-FOLIO-99881"}];
S.pen80ccc=[{type:"LIC",id:"JEEVAN-AKSHAY-4455",amt:25000}];
S.pen80ccd1=[{type:"NPS",id:"NPS Tier 1 — own",amt:60000}];
S.pen80ccd1b=[{type:"NPS",id:"NPS Tier 1 — additional",amt:50000}];
S.d80={selfSr:"N",parSr:"Y",selfIns:[{insurer:"Star Health & Allied Insurance",policy:"P/700001/01/2025/001234",amt:26000}],selfPHC:4000,
       parSrIns:[{insurer:"New India Assurance",policy:"NIA-MED-556677",amt:38000}],parSrPHC:1000,parSrMed:0};
S.dd80={nature:"2",type:"1",amt:125000,dep:"2",pan:"CQKPS1234D",aadhaar:"890123456789",f10dt:"18/06/2025",f10ack:"456789012345678",udid:"KA0412345678901234"};
S.u80={nature:"Self",type:"2",dt:"20/06/2025",ack:"654321098765432",udid:"KA0498765432109876"};S.via.c80u=75000;
S.e80={eeaSdv:4200000,e:[{from:"B",name:"Canara Bank",acno:"EDU-2019-04455",dt:"05/07/2019",amt:2000000,os:1400000,interest:112000}],
       ee:[{from:"B",name:"Axis Bank",acno:"HL-EE-0099",dt:"15/03/2017",amt:3200000,os:1900000,interest:48000}],
       eea:[],
       eeb:[{from:"B",name:"Kotak Mahindra Bank",acno:"EV-2020-778",reg:"KA01MJ4521",dt:"22/12/2020",amt:1400000,os:700000,interest:52000}]};
S.g80=[{bucket:"A",name:"Prime Minister's National Relief Fund",addr:"South Block, New Delhi",city:"New Delhi",state:"09",pin:"110011",pan:"AAAGP1234A",cash:0,other:50000,ref:"NEFT-PMNRF-2025-0917",ifsc:"SBIN0000691",amt:50000},
       {bucket:"D",name:"Akshaya Patra Foundation",addr:"HK Hill, Rajajinagar",city:"Bengaluru",state:"15",pin:"560010",pan:"AAATT6624F",arn:"AAATT6624F24BLR1",cash:2000,other:38000,ref:"UPI-akshaya-778812",ifsc:"HDFC0000523",amt:40000}];
S.gga=[{clause:"80GGA2a",name:"Indian Institute of Science",addr:"CV Raman Avenue",city:"Bengaluru",state:"15",pin:"560012",pan:"AAAAI0134N",mode:"OTH",amt:60000}];
S.ra=[{name:"Indian Institute of Science",addr:"CV Raman Avenue",city:"Bengaluru",state:"15",pin:"560012",pan:"AAAAI0134N",cash:0,other:60000}];
S.ggc=[{dt:"11/10/2024",name:"Bharatiya Janata Party",pan:"AAAAB0067L",mode:"OTH",ref:"NEFT-9988776655",ifsc:"SBIN0000691",amt:25000}];
/* ---- AMTC — brought-forward credit ---- */
S.amtc={"2022-23":{gross:180000,setoff:60000},"2024-25":{gross:95000,setoff:0}};
/* ---- SPI ---- */
S.spi=[{name:"Aarav Sudhir",rel:"Minor son",amt:18000,head:"OS"},{name:"Lakshmi Sudhir",pan:"AKPPL2211M",rel:"Spouse",amt:120000,head:"HP"}];
/* ---- EI ---- */
S.ei2={interest:42000,agriGross:1450000,agriExp:380000,agriUnab:70000,
  land:[{district:"Mandya",pin:"571401",acres:6.5,owned:"O",irr:"IRG"},{district:"Hassan",pin:"573201",acres:3,owned:"H",irr:"RF"}],
  others:[{cat:"SRPC",sub:"10(10D)",desc:"LIC Jeevan Anand maturity",amt:480000},{cat:"SRSC",sub:"10(32)",desc:"Minor child's income exempt",amt:1500},{cat:"ISI",sub:"10(15)",desc:"Interest on tax-free bonds",amt:36000}],
  dtaa:[]};
/* ---- PTI — two blocks ---- */
S.pti2=[{kind:"A",name:"Embassy Office Parks REIT",pan:"AAATE0770R",rows:{hp:{inc:90000,loss:0,tds:9000},osDiv:{inc:60000,tds:6000},osOth:{inc:15000,tds:1500},ex23fbb:{inc:0}}},
        {kind:"B",name:"Sundaram Alternate Opportunities Fund",pan:"AAATS5566Q",rows:{st111a:{inc:80000,loss:10000,tds:8000},ltOth:{inc:90000,loss:0,tds:9000},lt112a:{inc:60000},ex23fbb:{inc:25000}}}];
/* ---- ESOP ---- */
S.esop={pan:"AAECS9988F",dpiit:"DIPP45678",deferNow:180000,
  yrs:{"2023-24":{bf:240000,sec:"PS",sales:[{dt:"12/08/2024",amt:90000}],ceased:"N",exp48:"N"},"2024-25":{bf:160000,sec:"NS",ceased:"N",exp48:"N"}}};
/* ---- 5A ---- */
S.sch5a2={name:"Lakshmi Sudhir",pan:"AKPPL2211M",aadhaar:"612345678901",h:{hp:{inc:720000,spouse:360000,tds:36000,tdsSp:18000},cg:{inc:0,spouse:0,tds:0,tdsSp:0},os:{inc:1280000,spouse:640000,tds:64000,tdsSp:32000}}};
/* ---- FSI / TR / FA ---- */
S.fsi2=[{code:"1",name:"United States of America",tin:"987-65-4321",sec:"90",h:{os:{inc:420000,paid:63000,article:"11"},cg:{inc:150000,paid:30000,article:"13"}}},
        {code:"971",name:"United Arab Emirates",tin:"784-1990-1234567-1",sec:"91",h:{os:{inc:200000,paid:10000,article:""}}}];
S.tr2={refundFlag:"YES",refundAmt:12000,refundAY:"2024-25"};
S.fa2={bank:[{code:"1",country:"United States of America",inst:"JPMorgan Chase Bank",addr:"270 Park Avenue, New York",zip:"10017",acno:"US-987654321",status:"OWNER",opened:"14/03/2019",peak:3200000,close:2750000,interest:42000}],
 cust:[{code:"1",country:"United States of America",inst:"Charles Schwab",addr:"3000 Schwab Way, Westlake TX",zip:"76262",acno:"SCHW-4455667",status:"OWNER",opened:"02/06/2020",peak:5100000,close:4800000,gross:150000,nature:"D"}],
 equity:[{code:"1",country:"United States of America",entity:"Alphabet Inc",addr:"1600 Amphitheatre Parkway, Mountain View",zip:"94043",nature:"Listed company",acq:"15/09/2021",initial:1800000,peak:2600000,close:2400000,paid:0,proceeds:0}],
 insur:[{code:"44",country:"United Kingdom",inst:"Aviva Life",addr:"St Helen's, London",zip:"EC3P3DQ",dt:"10/01/2018",cashval:900000,paid:0}],
 fin:[{code:"65",country:"Singapore",zip:"048624",nature:"Private limited company",entity:"Sudhir Trading Pte Ltd",addr:"1 Raffles Place, Singapore",interest:"DIRECT",since:"01/07/2022",cost:2500000,inc:120000,incNature:"Dividend",offAmt:120000,offSch:"OS",offItem:"1a(i)"}],
 imm:[{code:"971",country:"United Arab Emirates",zip:"00000",addr:"Apartment 1204, Marina Heights, Dubai",own:"DIRECT",acq:"20/11/2017",cost:14000000,inc:200000,incNature:"Rent",offAmt:200000,offSch:"OS",offItem:"1b(ix)"}],
 oth:[{code:"1",country:"United States of America",zip:"10001",nature:"Bitcoin held with Coinbase",own:"DIRECT",acq:"05/02/2021",cost:400000,inc:0,incNature:"None",offAmt:0,offSch:"NI",offItem:""}],
 sign:[{inst:"HSBC Bank plc",addr:"8 Canada Square, London",code:"44",country:"United Kingdom",zip:"E145HQ",holder:"Sudhir Family Trust",acno:"GB-11223344",peak:1500000,taxable:"N"}],
 trust:[{code:"44",country:"United Kingdom",zip:"E145HQ",trust:"Sudhir Family Trust",trustAddr:"8 Canada Square, London",trustees:"John Whitfield",trusteesAddr:"London",settlor:"S Sudhir",settlorAddr:"Bengaluru",benef:"Aarav Sudhir",benefAddr:"Bengaluru",since:"01/04/2020",taxable:"N"}],
 othInc:[{code:"65",country:"Singapore",zip:"048624",from:"Sudhir Trading Pte Ltd",fromAddr:"1 Raffles Place, Singapore",inc:80000,nature:"Consultancy fee",taxable:"Y",offAmt:80000,offSch:"OS",offItem:"1e"}]};
/* ---- AL ---- */
S.al2={hasImm:"Y",imm:[{desc:"Residential house",flat:"No. 42, 3rd Cross",premises:"Brigade Gardens",road:"Richmond Road",locality:"Richmond Town",city:"Bengaluru",state:"15",country:"91",pin:"560025",amt:18000000},
  {desc:"Flat (50% share)",flat:"7B",premises:"Prestige Lakeside",road:"Varthur Road",locality:"Whitefield",city:"Bengaluru",state:"15",country:"91",pin:"560066",amt:6500000},
  {desc:"Apartment abroad",flat:"1204",premises:"Marina Heights",road:"Dubai Marina",locality:"Marina",city:"Dubai",state:"99",country:"971",zip:"00000",amt:14000000}],
  jewel:2400000,art:350000,vehicle:2800000,bank:6900000,shares:12500000,insur:1800000,loans:500000,cash:120000,liab:10600000};
/* ---- Taxes paid ---- */
S.tds1=[{tan:"BLRI01234A",name:"Infosys Limited",inc:2340000,tds:410000},{tan:"BLRW05678B",name:"Wipro Limited",inc:1640000,tds:280000},{tan:"BLRG09999C",name:"Government of Karnataka",inc:888000,tds:95000}];
S.tds2=[{who:"S",tan:"BLRS12345D",sec:"94A",dedOwn:42000,claimOwn:42000,gross:420000,head:"OS"},
        {who:"S",tan:"MUMH67890E",sec:"194",dedOwn:64000,claimOwn:64000,gross:640000,head:"OS"},
        {who:"O",othPan:"AKPPL2211M",tan:"BLRT11111F",sec:"4-IB",dedOthInc:360000,dedOthTds:36000,claimOthInc:360000,claimOthTds:36000,claimOthPan:"AKPPL2211M",gross:360000,head:"HP"},
        {who:"S",tan:"BLRB22222G",sec:"94B",bf:5000,yr:"2024",claimOwn:5000,gross:20000,head:"OS"},{who:"S",tan:"BLRB22222G",sec:"94B",dedOwn:45000,claimOwn:45000,gross:150000,head:"OS"},
        {who:"S",tan:"MUMR33333H",sec:"LBA1",dedOwn:9000,claimOwn:9000,gross:90000,head:"HP"}];
S.tds3=[{who:"S",pan:"AAAPK1122A",sec:"4IA",dedOwn:192000,claimOwn:192000,gross:19200000,head:"CG"},
        {who:"S",pan:"AAAPR3344B",aadh:"123456789012",sec:"4IA",dedOwn:75000,claimOwn:75000,gross:7500000,head:"CG"},
        {who:"S",pan:"BQAPM7788N",sec:"4IB",dedOwn:36000,claimOwn:20000,gross:720000,head:"HP"}];
S.tcs=[{who:"1",tan:"BLRC44444J",collOwn:32000,claimOwn:32000},{who:"2",othPan:"AKPPL2211M",tan:"MUMC55555K",collOth:12000,claimOth:12000,claimOthPan:"AKPPL2211M"},{who:"1",tan:"MUMC55555K",bf:3000,yr:"2024",claimOwn:3000}];
S.it=[{bsr:"0510308",dt:"14/06/2024",sn:"12",amt:900000},{bsr:"0510308",dt:"12/09/2024",sn:"27",amt:1200000},{bsr:"0510308",dt:"13/12/2024",sn:"41",amt:1500000},{bsr:"0510308",dt:"14/03/2025",sn:"63",amt:1400000},
      {bsr:"0510308",dt:"28/03/2025",sn:"70",amt:200000},{bsr:"0510308",dt:"25/06/2025",sn:"9",amt:600000},{bsr:"0510308",dt:"10/09/2025",sn:"15",amt:350000}];
/* ---- Part B-TTI inputs ---- */
S.tax={s89:35000,e10ack:"567890123456789",f234i:0};
/* ---- bank and verification ---- */
S.bank=[{ifsc:"SBIN0040011",bank:"State Bank of India",acno:"30412345678",type:"SB",refund:"Y"},{ifsc:"HDFC0000523",bank:"HDFC Bank",acno:"50100987654321",type:"SB",refund:"N"},{ifsc:"ICIC0001234",bank:"ICICI Bank",acno:"123401500987",type:"CA",refund:"N"}];
S.ver={cap:"S",name:"S SUDHIR",father:"S SUBRAMANIAM",pan:"TVOPS4373C",place:"Bengaluru",swid:"SW10000001",nacc:3};
S.trp={id:"TRP0012345",name:"Ramesh Iyer",reimb:0};
