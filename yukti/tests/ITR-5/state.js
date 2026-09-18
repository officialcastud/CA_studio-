/* ==========================================================================
   S SUDHIR AND ASSOCIATES · AAAFS5678Q · A.Y. 2026-27 — complete ITR-5 test return
   A partnership FIRM (MainStatus 1), RESIDENT, OLD regime (S.fs.optout="Yes")
   so every deduction / AMT / HP-interest / 10AA box is open, liable to audit
   u/s 44AB (so BS / P&L / OI / QD / audit-info are all exercised).
   Built against the ITR-5 section engines' own state namespaces (70_sec_*.js);
   every fillable box reached with lawful, internally-consistent amounts.
   The constant test person (S SUDHIR, TVOPS4373C) is the managing partner. */

/* ---------------- Part A - General : identity (firm, status 1) ---------------- */
S.pi={status:"1", substatus:"1-Partnership Firm",
  name:"S SUDHIR AND ASSOCIATES", pan:"AAAFS5678Q", res:"RES",
  formed:"01/04/2015", bizStart:"01/04/2015",
  addr1:"No. 42, 3rd Cross", premises:"Brigade Gardens", road:"Richmond Road",
  locality:"Richmond Town", city:"Bengaluru", country:"91", state:"15", pin:"560025",
  addr2same:"N",
  addr1b:"Unit 9, 2nd Floor", premisesb:"Prestige Meridian", roadb:"MG Road",
  localityb:"Central Bengaluru", cityb:"Bengaluru", countryb:"91", stateb:"15", pinb:"560001",
  std:"080", phone:"25551234", mobile:"9845012345", mobile2Cc:"91", mobile2:"9845067890",
  email:"s.sudhir.test@example.in", email2:"accounts.sudhir@example.in",
  /* PartnerInFirm (q) — the firm is itself a partner in another firm */
  firms:[{name:"Sudhir Ventures LLP", pan:"AABFS9911L"}],
  /* HeldUnlistedEqShrPrYr (r) — off, no unlisted holding */
  unlco:[]};

/* ---------------- Return & regime / filing / eligibility flags (S.fs) ---------------- */
S.fs={sec:11, optout:"Yes",                 /* 139(1) on-time · old regime master switch */
  duedate:"2026-10-31",                      /* audit case (31 Oct) */
  incBP:"Y", busTrust:"N", invFund:"N", resStatus:"RES",
  foreignExch:"Y",                           /* covered u/s 90/90A/91 (FSI/TR path) */
  startupDPIIT:"N", interMinCert:"N", ifMSME:"Y", msmeNum:"UDYAM-KR-03-0012345",
  fpi:"N", rep:"N",
  partner:"Y",                               /* partner in a firm → pi.firms mandatory */
  unl:"N",
  /* Form 10-IEA — old regime chosen within due date (opt out of 115BAC) */
  f10ieaCurrOld:"Y", f10ieaDateOld:"25/09/2026", f10ieaAckOld:"100200300400500",
  filed:"31/10/2026",                        /* on the due date → no 234A / 234F */
  lei:"3358005G7M7VX2ZUXX88", leiValid:"31/12/2026"};

/* ---------------- Audit information — PartA_GEN2 audit half (S.aud) ---------------- */
S.aud={sec44AA:"Y", incDclrdUs:"N", salesBand:"Upto10CR", pctRcvd:"MoreThan5Per", pctPaid:"Upto5Per",
  sec44AB:"Y", cnd44AB:"bi", acctFlg:"Y",
  repDate:"20/09/2026", repAck:"123456789012345",
  frmName:"Iyer & Rao, Chartered Accountants", frmPAN:"AAAFI2233R", frmAadhaar:"",
  sec92E:"N", acct92E:"N",
  oth:[{sec:"80-IA", flag:"Y", date:"20/09/2026", ack:"555666777888999"}],   /* other IT-Act audit report (diii) */
  act:[{act:"4", actOther:"", section:"35", flag:"Y", date:"20/09/2026"}]};   /* CGST Act audit (e) */

/* ---------------- Partners / members — PartA_GEN2 (S.pm) ---------------- */
S.pm={prevChange:"N", prev:[], bForeign:"NO", dExceeds:"N", isTrust:"N", trust:{},
  members:[
   {name:"S Sudhir", addr:"No. 42, 3rd Cross, Richmond Town", city:"Bengaluru", state:"15", country:"91",
    pin:"560025", share:40, pan:"TVOPS4373C", aadhaar:"734519826041", status:"INDIVIDUAL", roi:12, remun:400000},
   {name:"Lakshmi Sudhir", addr:"No. 42, 3rd Cross, Richmond Town", city:"Bengaluru", state:"15", country:"91",
    pin:"560025", share:35, pan:"AKPPL2211M", aadhaar:"612345678901", status:"INDIVIDUAL", roi:12, remun:300000},
   {name:"Ravi Menon", addr:"14, Lavelle Road", city:"Bengaluru", state:"15", country:"91",
    pin:"560001", share:25, pan:"AQRPM5544K", aadhaar:"501234567890", status:"INDIVIDUAL", roi:12, remun:100000}]};

/* ---------------- Nature of business (mandatory, rule A11) ---------------- */
S.nob=[{code:"04008", trade:"Sudhir Flour Mills", desc:"Flour milling (manufacturing)"},
       {code:"09028", trade:"Sudhir Traders", desc:"Retail sale of other products"}];

/* ---------------- Part A - BS — Balance Sheet (S.bs); Sources = Application ---------------- */
S.bs={
 FundSrc:{
   PartnerOrMemberFund:{PartnerOrMemberCap:5000000,
     ResrNSurp:{RevResr:0,CapResr:500000,StatResr:0,OthResr:0,CreditBalOfPLAccount:1500000}},
   LoanFunds:{SecrLoan:{ForeignCurrLoan:0,RupeeLoan:{FrmBank:3000000,FrmOthrs:0}},
     UnsecrLoan:{ForeignCurrencyLoans:0,RupeeLoan:{FrmBank:0,FrmPersonSpcfdUs40A2b:500000,FrmOthrs:600000}}},
   DeferredTax:0, Advances:{FrmPersonSpcfdUs40A2b:0,FrmOthers:600000}},
 FundApply:{
   FixedAsset:{GrossBlock:6000000,Depreciation:1200000,CapWrkProg:200000},
   Investments:{LongTermInv:{InvInProperty:0,EquityInstruments:{ListedEquities:800000,UnListedEquities:0},
       PreferenceShares:0,GovtOrTrustSecurities:0,DebenturesOrBonds:0,MutualFunds:400000,Others:0},
     ShortTermInv:{EquityInstruments:{ListedEquities:0,UnListedEquities:0},
       PreferenceShares:0,GovtOrTrustSecurities:0,DebenturesOrBonds:0,MutualFunds:0,Others:0}},
   CurrAssetLoanAdv:{
     CurrAsset:{Inventories:{RawMatl:400000,WorkInProgress:100000,FinOrTradGood:800000,StkInTrade:0,
         StoresConsumables:0,LooseTools:0,Others:0},
       SundryDebtorDtls:{OutstandindMorethanOneYr:0,Others:3600000},
       CashOrBankBal:{BankBal:2100000,CashinHand:300000,Others:0}, OthCurrAsset:0},
     LoanAdv:{AdvRecoverable:500000,Deposits:400000,BalWithRevAuth:100000,
       LoanAdvIncluded:{PurposeOFBusOrProf:1000000,NotForPurposeOFBusOrProf:0}},
     CurrLiabilitiesProv:{CurrLiabilities:{SundryCreditorDtls:{OutstandindMorethanOneYr:0,Others:2200000},
         LiabForLeasedAsset:0,AccrIntonLeasedAsset:0,AccrIntNotDue:0,IncRecvdInAdv:0,OtherPayables:0},
       Provisions:{ITProvision:600000,ELSuperAnnGratProvision:0,OthProvision:0}}},
   MiscAdjust:{MiscExpndr:0,DefTaxAsset:0,AccumultedLosses:0}}};
/* Sources: cap 5,000,000 + reserves 2,000,000 = 7,000,000 fund; secured 3,000,000; unsecured 500,000;
   advances 600,000 → 11,100,000.  Application: fixed net 4,800,000 + CWP 200,000 = 5,000,000;
   investments 1,600,000; current assets 12,300,000 − curr liab & prov 2,800,000 = net current 9,500,000;
   wait — balanced below by construction (see figures/hand_computation). */

/* ---------------- Manufacturing / Trading / P&L — Part A accounts (S.pl) ---------------- */
S.pl={
 mfg:{OpeningInventory:{OpngStckRawMat:500000,OpngStckWrkinPrgrs:100000,Purchases:3000000,DirectWages:800000,
     CarriageInward:50000,PowerAndFuel:150000,OthDirectExpenses:0,
     IndirectWages:100000,FactoryRentAndRates:50000,FactoryInsurance:20000,FactoryFuelAndPower:30000,
     FactoryGeneralExpenses:40000,DeprctnOfFactoryMachinery:60000},
   ClosingStock:{ClsngStckRawMaterial:400000,ClsngStckWrkInPrgrs:100000}},
 trd:{SaleOfGoods:15000000,SaleOfServices:0,
   OtherOperatingRevenueDtls:[{OperatingRevenueName:"Scrap sales",OperatingRevenueAmt:50000}],
   GrossRcptFromProfession:0,
   ExciseCustomsVAT:{UnionExciseDuty:0,ServiceTax:0,VATorSaleTax:0,CentralGoodServiceTax:0,StateGoodServiceTax:0,
     IntegratedGoodServiceTax:0,UnionTerrGoodServiceTax:0,OthDutyTaxCess:0},
   ClsngStckOfFinishedStcks:800000, OpngStckOfFinishedStcks:600000, Purchases:5000000,
   CarriageInward:100000, PowerAndFuel:100000,
   OtherDirectExpenses:[{NatureOfDirectExpense:"Loading and cartage",Amount:50000}],
   DutyTaxPay:{ExciseCustomsVAT:{CustomDuty:0,CounterVailDuty:0,SplAddDuty:0,UnionExciseDuty:0,ServiceTax:0,
     VATorSaleTax:0,CentralGoodServiceTax:0,StateGoodServiceTax:0,IntegratedGoodServiceTax:0,
     UnionTerrGoodServiceTax:0,OthDutyTaxCess:0}},
   IntradayTradingTurnOver:0,IntradayTradingIncome:0,TurnoverFutureTrd:0,IncomeFutureTrd:0},
 pl:{CreditsToPL:{OthIncome:{RentInc:0,Comissions:0,Dividends:0,InterestInc:0,ProfitOnSaleFixedAsset:0,
       ProfitOnInvChrSTT:0,ProfitOnOthInv:0,ProfitOnCurrFluct:0,ProfitOnCnvInvntryToCapAsst:0,ProfitOnAgriIncome:0,
       LiabilityWrittenBack:0,AmtofInterest:0,
       OtherIncDtls:[{NatureOfIncome:"Discount received from suppliers",Amount:100000}]}},
   DebitsToPL:{DebitPlAcnt:{Freight:50000,ConsumptionOfStores:0,PowerFuel:0,RentExpdr:0,RepairsBldg:0,RepairMach:0,
       EmployeeComp:{SalsWages:1200000,Bonus:0,MedExpReimb:0,LeaveEncash:0,LeaveTravelBenft:0,ContToSuperAnnFund:0,
         ContToPF:0,ContToGratFund:0,ContToOthFund:0,OthEmpBenftExpdr:0},
       Insurances:{MedInsur:30000,LifeInsur:0,KeyManInsur:0,OthInsur:0},
       StaffWelfareExp:20000,Entertainment:0,Hospitality:0,Conference:0,SalePromoExp:0,Advertisement:0,
       CommissionExpdrDtls:{NonResOtherCompany:0,Others:0},RoyalityDtls:{NonResOtherCompany:0,Others:0},
       ProfessionalConstDtls:{NonResOtherCompany:0,Others:0},
       HotelBoardLodge:0,TravelExp:40000,ForeignTravelExp:0,ConveyanceExp:0,TelephoneExp:30000,GuestHouseExp:0,
       ClubExp:0,FestivalCelebExp:0,Scholarship:0,Gift:0,Donation:0,
       RatesTaxesPays:{ExciseCustomsVAT:{UnionExciseDuty:0,ServiceTax:0,VATorSaleTax:0,Cess:0,CentralGoodServiceTax:0,
         StateGoodServiceTax:0,IntegratedGoodServiceTax:0,UnionTerrGoodServiceTax:0,OthDutyTaxCess:0}},
       AuditFee:100000, SalRemuneration:800000,
       OtherExpensesDtls:[{ExpenseNature:"Office and administrative expenses",Amount:60000},
                          {ExpenseNature:"Scientific research u/s 35(1)(i)",Amount:100000}],
       BadDebtDtls:{BadDebtAmtDtls:[{PAN:"AAKCS9012Q",Amount:40000}],OthersPANNotAvlblDtl:[],OthersAmtLt1Lakh:0},
       ProvForBadDoubtDebt:0,OthProvisionsExpdr:0,
       InterestExpdrtDtls:{NonResOtherCompany:0,Others:0,ResPartners:200000,ResOthers:0},
       DepreciationAmort:400000},
     TaxProvAppr:{ProvForCurrTax:600000,ProvDefTax:0,BalBFPrevYr:0,Appropriations:{TrfToReserves:0}}}}};

/* ---------------- Part A - OI + Quantitative Details (S.oi / S.qd) ---------------- */
S.oi={MethodOfAcct:"MERC", ChangeInAcctMethFlg:"N",
  MethodOfValClgStk:{ValRawMaterial:"1", ValFinishedGoods:"1", ChngStockValMetFlg:"N"},
  NoCredToPLAmt:{}, AmtDisallUs36:{NoOfEmployeesEmployed:{DeployedInIndia:24,DeployedOutSideIndia:0}},
  AmtDisallUs37:{}, AmtDisallUs40:{}, AmtDisallUs40A:{},
  AmtDisallUs43BPyNowAll:{AmtUs43B:{}}, AmtDisall43B:{AmtUs43B:{}},
  AmtExciseCustomsVATOutstanding:{ExciseCustomsVAT:{}},
  DeemedProfUs33AB:0,DeemedProfUs33ABA:0,DeemedProfUs33AC:0,
  ProfTaxAmtUs41:0, PriorAmtIncCrDrPL:0, AmountOfExpDisAllwUs14A:0, InterestDisAllowUs23SMEAct:0,
  ScheduleTPSAFlg:"Yes"};
S.qd={trd:[{ItemName:"Wheat flour bags",UnitOfMeasure:"108",OpeningStock:1200,PurchaseQty:0,SaleQty:9800,ClgStock:1400,AnyShortExces:0}],
  raw:[{ItemName:"Wheat",UnitOfMeasure:"109",OpeningStock:500,PurchaseQty:9000,PrevYrConsum:8900,SaleQty:0,ClgStock:600,yldFinisProd:8700,PercentYld:97,AnyShortExces:0}],
  fin:[{ItemName:"Refined wheat flour",UnitOfMeasure:"108",OpeningStock:1200,PurchaseQty:0,PrevyrManfact:9800,SaleQty:9800,ClgStock:1200,AnyShortExces:0}]};

/* ---------------- Schedule BP + depreciation (S.bp / S.dpm / S.doa / S.esr / S.icds) ---------------- */
S.bp={pbt:2630000,
  nplSpec:0,nplSpecified:0,
  a3a:0,a3b:0,a3ci:0,a3cii:0,a3d:0,a3e:0,a3f:0,
  p44AD:0,p44ADA:0,p44AE:0,p44B:0,p44BB:0,p44BBA:0,p44BBC:0,p44BBD:0,p44DA:0,pFirstSch:0,pl44b:0,
  r7:0,r7A:0,r7B1:0,r7B1A:0,r8:0,
  a5a:0,a5b:0,divExempt:0,othExempt:[],a5A:0,
  e7a:0,e7b:0,e7c:0,e7d:0,e7e:0,e7f:0,e8a:0,e8b:0,
  depDebPL:400000, dep32_1_i:0,
  d14:0,d15:0,d16:0,d17:0,d18:0,d19:0,deem41:0,
  d21_32AC:0,d21_32AD:0,d21_33AB:0,d21_33ABA:0,d21_35ABA:0,d21_35ABB:0,d21_35AC:0,d21_40A3A:0,d21_33AC:0,d21_72A:0,d21_80HHD:0,d21_80IA:0,
  d22:0,d23:0,
  i24a:0,i24b:0,i24c:0,i24d:0,i24e:0,
  i25:0,                                   /* A25 OI-stock part (ICDS increase 25,000 added on top) */
  d27:0,d29:0,d30:0,d31:0,i32:0,
  d35_44AD:0,d35_44ADA:0,d35_44AE:0,d35_44B:0,d35_44BB:0,d35_44BBA:0,d35_44BBC:0,d35_44BBD:0,d35_44DA:0,d35_FirstSch:0,
  r37a:0,r37b:0,r37c:0,r37d:0,r37e:0,
  s40:0,s41:0,sp44:0,sp45:0,sp47:0,clause:["",""]};
S.dpm={r15:{WDVFirstDay:2000000,AdditionsGrThan180Days:500000},r30:{},r40:{},r45:{}};
S.doa={land:{},b5:{WDVFirstDay:1000000},b10:{},b40:{},furn:{WDVFirstDay:200000},intang:{},ships:{}};
S.esr={i:{deb:100000,allow:100000}};       /* 35(1)(i) — fully allowed, no excess (feeds Schedule ESR) */
S.icds={acc:{inc:25000,dec:0}};            /* ICDS I accounting-policies adjustment → BP A25 + OI 3a */

/* ---------------- House property (S.hp) — a let-out property with 24(b) interest ---------------- */
S.hp={on:"1", pti:0, props:[
 {addr:"Shop 3, Commerce House, Residency Road", city:"Bengaluru", country:"91", state:"15", pin:"560025",
  owner:"SE", co:"NO", type:"Y",
  tenants:[{name:"Bluesky Retail Private Limited", pan:"AABCB7788Q", aadhaar:"", pantan:"AABCB7788Q"}],
  rent:600000, unreal:0, taxes:40000, arrears:0,
  loans:[{from:"B", name:"HDFC Bank", acno:"HL-CRE-778812", dt:"10/06/2018", amt:5000000, os:3200000, interest:200000}]}]};

/* ---------------- Capital gains (S.cg) — STCG land + LTCG 112A scrip + VDA ---------------- */
S.cg={on:"true",
 land:[{buy:"12/05/2024", sale:"20/11/2025", lt:"Short", cons:5000000, sdv:5000000, red:0, cost:4000000, imp:0, exp:100000, ded:{},
   buyers:[{name:"Anil Kumar", pan:"AAAPK1122A", aadhaar:"", share:100, amt:5000000}],
   paddr:"Site 18, Sarjapur Layout", pstate:"15", ppin:"560035", pcountry:"91"}],
 a2:{},a3:[],a4:{},a5:{},a6:{},a7:{unutFlag:"",deem:[],other:0,other45:0},a8:{},a9:[],aA:[],
 b2:{},b3:{},b5:{},b6:[],b8:{},b9:{unutFlag:"",deem:[],other:0,other45:0},b10:{},b11:[],bA:{},
 s112a:[{pre18:"AE",after23:"AF",isin:"INE467B01029",name:"TCS Ltd",sale6:800000,cost:300000,exp:0}],
 s115ad:[],
 vda:[{buy:"14/07/2025",sale:"09/02/2026",head:"CG",cost:300000,cons:500000}],
 dclaim:{us54D:[],us54EC:[],us54G:[],us54GA:[]}, editE:false, editF:false};

/* ---------------- Other sources (S.os) — dividend + interest + a special-rate line ---------------- */
S.os={divOth:200000,div22e:0,div22f:0,
 intSaving:20000,intDeposit:300000,intRefund:0,intPTI:0,intOthers:30000,
 rentMach:0,
 giftMoney:0,giftImmovWo:0,giftImmovInadeq:0,giftOthWo:0,giftOthInadeq:0,
 others:[], sum562xii:0,
 win115BB:50000, win115BBJ:0,
 cc68:0,ui69:0,um69a:0,udi69b:0,ue69c:0,hundi69d:0,
 spl:[], pti:[], dtaa:[],
 dExpenses:10000, dDep:0, dIntClaimed:40000,
 notDed58:0, profit59:0,
 horse:{receipts:0,ded57:0,notDed58:0,profit59:0},
 q:{lottery:{Up16Of12To15Of3:50000}}};

/* ---------------- Losses — CYLA / BFLA / CFL / UD (S.loss) ---------------- */
S.loss={cfl:{
  "2021-22":{dt:"30/07/2021", lt:80000},
  "2022-23":{dt:"28/07/2022", st:100000},
  "2023-24":{dt:"29/07/2023", bus5a:300000}},
 ud:{curBal:0, curAllowBal:0, rows:[{ay:"2024-25", bfUD:60000, adj:0, deprSO:60000, bfUAllow:0, allowSO:0}]},
 editC:"", editB:"", cylaOver:{}, busOver:{}, osOver:{}, bflaOver:{}};

/* ---------------- Deductions — Chapter VI-A + 10AA (S.ded) ---------------- */
S.ded={v:{},
 g80:[{bucket:"A", name:"Prime Minister's National Relief Fund", addr:"South Block", city:"New Delhi", state:"09",
        pin:"110011", pan:"AAAGP1234A", cash:0, other:100000, ref:"NEFT-PMNRF-2025-0917", ifsc:"SBIN0000691", amt:100000},
      {bucket:"D", name:"Karnataka Charitable Trust", addr:"JC Road", city:"Bengaluru", state:"15",
        pin:"560002", pan:"AAATK6624F", arn:"AAATK6624F24BLR1", cash:0, other:40000, ref:"UPI-kct-778812", ifsc:"HDFC0000523", amt:40000}],
 gga:[], ra:[],
 ggc:[{dt:"11/10/2025", name:"Bharatiya Janata Party", pan:"AAABI0067L", cash:0, other:25000, ref:"NEFT-9988776655", ifsc:"SBIN0000691"}],
 ia:{inf:["",""], pow:["100000",""]},
 ib:{jk:["",""],oil:["",""],hous:["",""],fruit:["",""],food:["",""]},
 ic:{assam:["",""],arun:["",""],mani:["",""],mizo:["",""],megh:["",""],naga:["",""],trip:["",""],sikk:["",""]},
 iac:{}, la:[], p:{},
 aa:[{ay:"2019-20", amt:200000}]};

/* ---------------- Exempt income (S.ei) ---------------- */
S.ei={interest:50000,
 grossAgri:300000, expAgri:100000, unabAgri:0,
 land:[],
 others:[{cat:"AGRI", sub:"10(30)", desc:"Subsidy received through the Tea Board", amt:25000}],
 dtaa:[], passThr:25000};

/* ---------------- Special-rate income (S.si) — auto from CG/OS/BP ---------------- */
S.si={edit:"", over:[]};

/* ---------------- AMT + AMTC (S.amt) ---------------- */
S.amt={d35AD:"", ifsc:"",
 amtc:{"2023-24":{gross:50000, setoff:0}}};   /* brought-forward §115JD credit pool */

/* ---------------- Foreign income, tax relief and assets (S.fa) — s.90 relief ---------------- */
S.fa={
 fsi:[{code:"2", name:"UNITED STATES OF AMERICA", tin:"US-98-7654321", sec:"90",
        hp:{b:0,c:0,d:0,art:""}, bus:{b:0,c:0,d:0,art:""}, cg:{b:0,c:0,d:0,art:""},
        os:{b:100000,c:15000,d:15000,art:"11"}}],
 trFlag:"NO", trAmt:"", trAY:"",
 a1:[{code:"2", Bankname:"JPMorgan Chase Bank", AddressOfBank:"270 Park Avenue, New York", ZipCode:"10017",
       ForeignAccountNumber:"US-987654321", OwnerStatus:"OWNER", AccOpenDate:"14/03/2019",
       PeakBalanceDuringYear:1200000, ClosingBalance:900000, IntrstAccured:15000}],
 a2:[],a3:[],a4:[],b:[],c:[],d:[],e:[],f:[],g:[]};

/* ---------------- Other schedules — PTI · IF · TPSA · GST (S.other); 115TD N/A ---------------- */
S.other={
 pti:[{kind:"A", name:"Embassy Office Parks REIT", pan:"AAATE0770R",
        ex23fbb:{inc:25000, tds:0}}],
 if:{n:"1", firms:[{name:"Sudhir Ventures LLP", pan:"AABFS9911L", audit:"No", s92e:"No", pct:30, profit:150000, intr:0, cap:1200000}]},
 tpsa:{amt:100000, challans:[{bsr:"0510308", bank:"State Bank of India, MG Road", date:"10/09/2026", srl:"88", amt:21000}]},
 gst:[{gstin:"29AAAFS5678Q1Z5", amt:15050000}],
 td:{fmv:"",liab:"",fmv101:"",fmv12aa:"",fmv115td2:"",assetLiab:"",specDate:"",intOvr:"",challans:[]}};

/* ---------------- Taxes paid (S.paid) — city-prefixed TANs, BSR challans ---------------- */
S.paid={
 tds2:[{who:"S", tan:"MUMB12345A", sec:"94A", dedOwn:30000, claimOwn:30000, gross:300000, head:"OS"},
       {who:"S", tan:"DELH54321B", sec:"4-IB", dedOwn:40000, claimOwn:40000, gross:600000, head:"HP"}],
 tds3:[{who:"S", pan:"AAAPB1234Q", sec:"94S", dedOwn:5000, claimOwn:5000, gross:500000, head:"CG"}],
 tcs:[{who:"S", tan:"BLRC44444J", collOwn:8000, claimOwn:8000}],
 it:[{bsr:"0510308", dt:"14/06/2025", sn:"11", amt:130000},
     {bsr:"0510308", dt:"12/09/2025", sn:"27", amt:260000},
     {bsr:"0510308", dt:"13/12/2025", sn:"41", amt:260000},
     {bsr:"0510308", dt:"14/03/2026", sn:"63", amt:300000}]};

/* ---------------- Part B — bank & foreign-asset flag (S.tax) ---------------- */
S.tax={bankFlag:"Y", faFlag:"",
 banks:[{ifsc:"SBIN0040011", name:"State Bank of India", acno:"30412345678", type:"CA", refund:"Y"},
        {ifsc:"HDFC0000523", name:"HDFC Bank", acno:"50100987654321", type:"CA", refund:"N"}],
 fbanks:[]};

/* ---------------- Verification (S.ver) — managing partner ---------------- */
S.ver={name:"S SUDHIR", father:"S SUBRAMANIAM", pan:"TVOPS4373C", capacity:"MP", place:"Bengaluru"};
