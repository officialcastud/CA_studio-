/* ====== S SUDHIR · TVOPS4373C · A.Y. 2026-27 — the complete ITR-3 test return ======
   OLD regime (S.fs.optout="Yes") so every deduction / AMT / HP-interest box is open.
   Built against the ITR-3 section engines' own state namespaces (70_sec_*.js).
   Constant identity from PIPELINE.md; lawful amounts. */

/* ---------------- Part A - General : identity (who) ---------------- */
S.pi={status:"I",first:"S",mid:"",last:"SUDHIR",pan:"TVOPS4373C",aadhaar:"734519826041",
  dob:"05/11/2006",bizStart:"01/04/2019",res:"RES",
  email:"s.sudhir.test@example.in",email2:"sudhir.alt@example.in",mobile:"9845012345",std:"080",phone:"25551234",
  country:"91",addr1:"No. 42, 3rd Cross",premises:"Brigade Gardens",road:"Richmond Road",locality:"Richmond Town",
  city:"Bengaluru",state:"15",pin:"560025",
  addr2same:"N",addr1b:"Flat 7B",premisesb:"Prestige Lakeside",roadb:"Varthur Road",localityb:"Whitefield",cityb:"Bengaluru",stateb:"15",pinb:"560066",
  s5a:"Yes",
  dirco:[{name:"Sudhir Infotech Private Limited",type:"D",pan:"AABCS4321K",listed:"U",din:"07654321"},
         {name:"Global Trade Corp",type:"F",listed:"L",din:"07654322"}],
  firms:[{name:"Sudhir & Associates",pan:"AAJFS7788L"}],
  unlco:[{name:"Sudhir Infotech Private Limited",type:"D",pan:"AABCS4321K",obNo:5000,obCost:500000,acqNo:1000,cbNo:5500,cbCost:600000}]};

/* ---------------- Return & regime / filing / audit (ret) ---------------- */
S.fs={optout:"Yes",sec:11,incBP:"Y",filed:"28/07/2026",duedate:"2026-07-31",dueExt:"2026-07-31",
  resStatus:"RES",f10ieaDate:"25/07/2026",f10ieaAck:"123456789012345",
  rep:"N",dir:"Yes",partner:"Yes",unl:"Yes",fpi:"N",foreignExch:"Y",
  lei:"3358005G7M7VX2ZUXX88",leiValid:"31/12/2026"};
S.decl={flag:"Y",dep_f:"Y",dep:12000000,trv_f:"Y",trv:450000,ele_f:"Y",ele:180000,c4_f:"Y",c4:[{nature:"3",amt:60000}]};
S.aud={sec44AA:"Y",incDclrdUs:"N",salesBand:"Upto10CR",pctRcvd:"Y",pctPaid:"Y",sec44AB:"N",sec92E:"N",acct92E:"N",
  oth:[{sec:"92CD",flag:"N",date:""}],
  act:[{act:"Companies Act 2013",actOther:"",sec:"143",date:"20/09/2026"}]};
S.nob=[{code:"09028",trade:"Sudhir Traders",desc:"Wholesale trading"},
       {code:"14005",trade:"Sudhir Consulting",desc:"Professional — management consultancy"}];

/* ---------------- Salary (Schedule S) — two employers ---------------- */
S.sal={emp:[
 {name:"Government of Karnataka",empcat:"CGOV",tan:"BLRG09999C",addr:"Vidhana Soudha",city:"Bengaluru",state:"15",pin:"560001",
  nsal:[{code:"1",amt:600000},{code:"2",amt:200000},{code:"4",amt:120000}],
  nperq:[{code:"1",amt:50000}]},
 {name:"Wipro Limited",empcat:"OTH",tan:"BLRW05678B",addr:"Sarjapur Road",city:"Bengaluru",state:"15",pin:"560035",
  nsal:[{code:"1",amt:500000},{code:"2",amt:100000}]}],
 hra:{place:"1",salary:800000,hra:120000,rent:300000},
 alw:[{sec:"10(5)",desc:"Leave travel",amt:20000}],
 rel89a:0,ent:5000,pt:2500};

/* ---------------- House property (Schedule HP) — self-occupied + let-out ---------------- */
S.hp={on:"1",pti:0,props:[
 {addr:"No. 42, 3rd Cross, Richmond Town",city:"Bengaluru",country:"91",state:"15",pin:"560025",owner:"SE",co:"NO",type:"S",
  loans:[{from:"B",name:"State Bank of India",acno:"HL3391120044",dt:"12/04/2019",amt:8000000,os:5200000,interest:250000}]},
 {addr:"Flat 7B, Prestige Lakeside, Whitefield",city:"Bengaluru",country:"91",state:"15",pin:"560066",owner:"SE",co:"YES",share:50,
  coowners:[{name:"Lakshmi Sudhir",pan:"AKPPL2211M",aadhaar:"612345678901",share:50}],type:"L",
  tenants:[{name:"Rohan Mehta",pan:"BQAPM7788N",aadhaar:"501234567890",pantan:"BQAPM7788N"}],
  rent:600000,unreal:0,taxes:40000,arrears:0,
  loans:[{from:"B",name:"HDFC Bank",acno:"HL77812345",dt:"20/07/2021",amt:4500000,os:3900000,interest:300000}]}]};
/* note: property 2 rent 600000 in full; own share 50% applied at f. */

/* ---------------- Business — Part A accounts (bpa) ---------------- */
S.bpa={
  nob:[{Code:"09028",TradeName1:"Sudhir Traders",Description:"Wholesale trading"}],
  mfg:{OpeningInventory:{OpngStckRawMat:0,OpngStckWrkinPrgrs:0,Purchases:0,DirectWages:0,CarriageInward:0,PowerAndFuel:0,OthDirectExpenses:0,
        IndirectWages:0,FactoryRentAndRates:0,FactoryInsurance:0,FactoryFuelAndPower:0,FactoryGeneralExpenses:0,DeprctnOfFactoryMachinery:0},
       ClosingStock:{ClsngStckRawMaterial:0,ClsngStckWrkInPrgrs:0}},
  trd:{SaleOfGoods:10000000,SaleOfServices:0,
       OtherOperatingRevenueDtls:[{OperatingRevenueNature:"Scrap sales",OperatingRevenueAmt:50000}],
       GrossRcptFromProfession:0,
       ExciseCustomsVAT:{UnionExciseDuty:0,ServiceTax:0,VATorSaleTax:0,CentralGoodServiceTax:0,StateGoodServiceTax:0,IntegratedGoodServiceTax:0,UnionTerrGoodServiceTax:0,OthDutyTaxCess:0},
       ClsngStckOfFinishedStcks:200000,OpngStckOfFinishedStcks:150000,Purchases:6000000,
       CarriageInward:20000,PowerAndFuel:10000,
       OtherIncDtls:[{Nature:"Misc direct expense",Amount:5000}],
       DutyTaxPay:{ExciseCustomsVAT:{CustomDuty:0,CounterVailDuty:0,SplAddDuty:0,UnionExciseDuty:0,ServiceTax:0,VATorSaleTax:0,CentralGoodServiceTax:0,StateGoodServiceTax:0,IntegratedGoodServiceTax:0,UnionTerrGoodServiceTax:0,OthDutyTaxCess:0}},
       IncomeIntradayTrd:0,TurnoverIntradayTrd:0,IncomeFutureTrd:0,TurnoverFutureTrd:0},
  pl:{CreditsToPL:{OthIncome:{RentInc:30000,Comissions:0,Dividends:0,InterestInc:0,ProfitOnSaleFixedAsset:0,ProfitOnInvChrSTT:0,ProfitOnOthInv:0,ProfitOnCurrFluct:0,ProfitOnCnvInvntryToCapAsst:0,ProfitOnAgriIncome:0,LiabilityWrittenBack:0,AmtofInterest:0,AmtofRem:0,OtherIncDtls:[]}},
      DebitsToPL:{Freight:10000,ConsumptionOfStores:0,PowerFuel:0,RentExpdr:0,RepairsBldg:0,RepairMach:0,
        EmployeeComp:{SalsWages:80000,Bonus:0,MedExpReimb:0,LeaveEncash:0,LeaveTravelBenft:0,ContToSuperAnnFund:0,ContToPF:0,ContToGratFund:0,ContToOthFund:0,OthEmpBenftExpdr:0},
        Insurances:{MedInsur:0,LifeInsur:0,KeyManInsur:0,OthInsur:0},
        StaffWelfareExp:0,Entertainment:0,Hospitality:0,Conference:0,SalePromoExp:0,Advertisement:0,
        CommissionExpdrDtls:{NonResOtherCompany:0,Others:0},RoyalityDtls:{NonResOtherCompany:0,Others:0},ProfessionalConstDtls:{NonResOtherCompany:0,Others:0},
        HotelBoardLodge:0,TravelExp:0,ForeignTravelExp:0,ConveyanceExp:0,TelephoneExp:0,GuestHouseExp:0,ClubExp:0,FestivalCelebExp:0,Scholarship:0,Gift:0,Donation:0,
        RatesTaxesPays:{ExciseCustomsVAT:{UnionExciseDuty:0,ServiceTax:0,VATorSaleTax:0,Cess:0,CentralGoodServiceTax:0,StateGoodServiceTax:0,IntegratedGoodServiceTax:0,UnionTerrGoodServiceTax:0,OthDutyTaxCess:0}},
        AuditFee:0,OtherExpensesDtls:[],
        BadDebtDtls:{BadDebtAmtDtls:[],OthersPANNotAvlblDtl:[],OthersAmtLt1Lakh:0},ProvForBadDoubtDebt:0,OthProvisionsExpdr:0,
        InterestExpdrtDtls:{NonResOtherCompany:0,Others:0},DepreciationAmort:25000},
      TaxProvAppr:{ProvForCurrTax:0,ProvDefTax:0,BalBFPrevYr:0,TrfToReserves:0},
      PersumptiveInc44AD:{GrsTrnOverBank:0,GrsTotalTrnOverInCash:0,GrsTrnOverAnyOthMode:0,PersumptiveInc44AD6Per:0,PersumptiveInc44AD8Per:0},
      PersumptiveInc44ADA:{GrsTrnOverBank44ADA:0,GrsTotalTrnOverInCash44ADA:0,GrsTrnOverAnyOthMode44ADA:0,TotPersumptiveInc44ADA:0},
      GoodsDtlsUs44AE:[],
      NoBooksOfAccPL:{GrsRcptAccPayeeOrBankMode:0,GrsRcptOtherMode:0,GrossProfit:0,Expenses:0,GrsRcptAccPayeeOrBankModePrf:0,GrsRcptOtherModePrf:0,GrossProfitPrf:0,ExpensesPrf:0},
      GrossProfit:0,Expenditure:0,NonResidentPLDetails:[]},
  oi:{NoCredToPLAmt:{Section28Items:0,ProformaCreditsDue:0,PrevYrEscalClaim:0,OthItemInc:0,CapReceipt:0},
      AmtDisallUs36:{},AmtDisallUs37:{},AmtDisallUs40:{AmtDisallUs40PyNowAll:0},AmtDisallUs40A:{},
      AmtDisallUs43BPyNowAll:{AmtUs43B:{}},AmtDisall43B:{AmtUs43B:{}},
      AmtExciseCustomsVATOutstanding:{ExciseCustomsVAT:{}},DeemedProfUs33AB:0,DeemedProfUs33ABA:0,
      ProfTaxAmtUs41:0,PriorAmtIncCrDrPL:0,InterestDisAllowUs23SMEAct:0,AmountOfExpDisAllwUs14A:0},
  bs:{FundSrc:{PropFund:{PropCap:500000,ResrNSurp:{RevResr:0,CapResr:0,StatResr:0,OthResr:0}},
        LoanFunds:{SecrLoan:{ForeignCurrLoan:0,RupeeLoan:{FrmBank:0,FrmOthrs:0}},UnsecrLoan:{FrmBank:0,FrmOthrs:0}},
        DeferredTax:0,Advances:{FromPrsn:0,FromOthers:0}},
      FundApply:{FixedAsset:{GrossBlock:300000,Depreciation:50000,CapWrkProg:0},
        Investments:{LongTermInv:{GovtOthSecQuoted:0,GovOthSecUnQoted:0},TradeInv:{EquityShares:0,PreferShares:0,Debenture:0}},
        CurrAssetLoanAdv:{CurrAsset:{Inventories:{StoresConsumables:0,RawMatl:0,StkInProcess:0,FinOrTradGood:0},SndryDebtors:0,
          CashOrBankBal:{CashinHand:250000,BankBal:0},OthCurrAsset:0},
          LoanAdv:{AdvRecoverable:0,Deposits:0,BalWithRevAuth:0},
          CurrLiabilitiesProv:{CurrLiabilities:{SundryCred:0,LiabForLeasedAsset:0,AccrIntonLeasedAsset:0,AccrIntNotDue:0},Provisions:{ITProvision:0,ELSuperAnnGratProvision:0,OthProvision:0}}},
        MiscAdjust:{MiscExpndr:0,DefTaxAsset:0,AccumaltedLosses:0}}},
  qd:{},gst:{}};

/* ---------------- Business — Schedule BP & depreciation (bp) ---------------- */
S.bp={pbt:1110000,               /* 1,000,000 regular + 60,000 speculative + 50,000 specified(35AD) */
  nplSpec:60000,nplSpecified:50000,
  a3a:0,a3b:0,a3c:50000,a3di:0,a3dii:0,a3e:0,a3f:0,a3g:0,
  a5a:20000,a5b:0,divExempt:0,othExempt:[],a5A:0,
  e7a:0,e7b:0,e7c:0,e7d:10000,e7e:0,e7f:0,e7g:0,e8a:0,e8b:0,
  depDebPL:80000,dep32_1_i:0,
  d14:15000,d15:0,d16:0,d17:0,d18:0,d19:0,deem41:0,d22:0,d23:0,
  i24a:0,i24b:0,i24c:0,i24d:0,i24e:0,i25:0,
  d27:0,d29:0,d30:0,d31:5000,i32:0,
  s40:0,s41:0,sp44:0,sp45:0,sp47:30000,clause:["a","b"]};
S.dpm={r15:{WDVFirstDay:500000,AdditionsGrThan180Days:100000,AdditionsLessThan180Days:0},
  r30:{},r40:{},r45:{}};
S.doa={land:{},b5:{WDVFirstDay:200000},b10:{WDVFirstDay:0},b40:{},furn:{WDVFirstDay:50000},intang:{},ships:{}};
S.esr={i:{deb:30000,allow:40000},ii:{deb:0,allow:0}};
S.icds={acc:{inc:25000,dec:0}};
S.ud={rows:[{AssYr:"2024-25",AmtBFUD:0,AmtDeprSOCY:0,AmtBFUAllow:0,AmtAllowSOCY:0}],curDep:0,curAllow:0};

/* ---------------- Capital gains (Schedule CG · 112A · VDA) ---------------- */
S.cg={on:"true",
 land:[
  {buy:"01/06/2024",sale:"01/09/2025",lt:"Short",cons:3000000,sdv:3200000,cost:2500000,exp:50000,improve:[],ded:{},
   buyers:[{name:"Anil Kumar",pan:"AAAPK1122A",share:100,amt:3000000}],paddr:"Site 18, Sarjapur Layout",pstate:"15",ppin:"560035"}],
 s112a:[{pre18:"AE",after23:"AF",isin:"INE467B01029",name:"TCS Ltd",sale6:500000,cost:200000,exp:0}],
 vda:[{buy:"14/07/2025",sale:"09/02/2026",head:"CG",cost:300000,cons:500000}]};

/* ---------------- Other sources (Schedule OS) — normal income + race-horse loss ---------------- */
S.os={divOth:100000,div22e:20000,div22f:0,
 intSaving:15000,intDeposit:50000,intRefund:2000,intPTI:0,int10_11_1:0,int10_11_2:0,int10_12_1:0,int10_12_2:0,intOthers:8000,
 rentMach:60000,
 giftMoney:30000,giftImmovWo:0,giftImmovInadeq:0,giftOthWo:0,giftOthInadeq:0,
 familyPension:120000,others:[{nat:"Guest lecture honorarium",amt:10000}],
 not89aUS:0,not89aUK:0,not89aCA:0,not89aOther:0,not89aPrYr:0,sum562xii:0,sum562xiii:0,
 dExpenses:3000,dDep:12000,dIntClaimed:50000,
 notDed58:0,profit59:0,relief89a:0,
 horse:{receipts:250000,ded57:310000,notDed58:0,profit59:0}};

/* ---------------- Losses — CYLA · BFLA · CFL (loss) ---------------- */
S.loss={cfl:{
  "2019-20":{dt:"28/07/2019",bus5a:100000},
  "2021-22":{dt:"30/07/2021",st:50000},
  "2022-23":{dt:"29/07/2022",specified:25000},
  "2023-24":{dt:"29/07/2023",lt:80000,horse:30000},
  "2024-25":{dt:"28/07/2024",spec:40000}},
 editC:"",editB:""};

/* ---------------- Deductions — Chapter VI-A (ded) ---------------- */
S.ded={
 v:{c80ccc:20000,c80ccd1:40000,c80ccd1b:50000,c80ccd2:100000,c80ddb:40000,ddb_type:"1",ddb_disease:"k",
    c80tta:10000,c80cch:50000,c80jjaa:30000,c80gg:0},
 c80c:[{amt:90000,id:"PPF-BLR-0011223"}],
 pen80ccc:[{type:"OTHPRAN",id:"LIC Jeevan Akshay 4455",amt:20000}],
 d80:{selfSr:"N",parSr:"N",selfIns:[{insurer:"Star Health",policy:"P/700001/01/2026/001234",amt:20000}],selfPHC:6000,
      parIns:[{insurer:"New India Assurance",policy:"NIA-MED-556677",amt:30000}],parPHC:2000},
 dd80:{nature:"2",type:"1",amt:125000,dep:"2",pan:"CQKPS1234D",aadhaar:"890123456789",f10dt:"18/06/2026",f10ack:"456789012345678",udid:"KA0412345678901234"},
 u80:{nature:"1",type:"2",amt:75000,dt:"20/06/2026",ack:"654321098765432",udid:"KA0498765432109876"},
 e80:{e:[{from:"B",name:"Canara Bank",acno:"EDU-2019-04455",dt:"05/07/2019",amt:2000000,os:1400000,interest:112000}],
      ee:[],
      eea:[{from:"B",name:"HDFC Bank",acno:"HL-EEA-2020",dt:"12/06/2020",amt:3500000,os:2600000,interest:150000}],
      eeb:[{from:"B",name:"Kotak Mahindra Bank",acno:"EV-2020-778",reg:"KA01MJ4521",dt:"22/12/2020",amt:1400000,os:700000,interest:80000}]},
 g80:[{bucket:"A",name:"Prime Minister's National Relief Fund",addr:"South Block",city:"New Delhi",state:"09",pin:"110011",pan:"AAAGP1234A",cash:0,other:50000,ref:"NEFT-PMNRF-2025-0917",ifsc:"SBIN0000691",amt:50000},
      {bucket:"B",name:"Jawaharlal Nehru Memorial Fund",addr:"Teen Murti",city:"New Delhi",state:"09",pin:"110011",pan:"AAATJ0012B",cash:0,other:60000,ref:"NEFT-JNMF-2025",ifsc:"SBIN0000691",amt:60000},
      {bucket:"D",name:"Akshaya Patra Foundation",addr:"HK Hill, Rajajinagar",city:"Bengaluru",state:"15",pin:"560010",pan:"AAATT6624F",arn:"AAATT6624F24BLR1",cash:0,other:40000,ref:"UPI-akshaya-778812",ifsc:"HDFC0000523",amt:40000}],
 ggc:[{dt:"11/10/2025",name:"Bharatiya Janata Party",pan:"AAABI0067L",mode:"OTH",ref:"NEFT-9988776655",ifsc:"SBIN0000691",amt:25000}],
 ia:{code:"A",amt:100000},ib:{code:"B",amt:50000},ie:{},
 aa10:[{ay:"2019-20",amt:200000}],
 gga:[],ra:[]};

/* ---------------- Exempt income (Schedule EI) ---------------- */
S.ei={interest:120000,
 grossAgri:800000,expAgri:250000,unabAgri:30000,
 land:[{district:"Mandya",pin:"571401",meas:6.5,owned:"O",irr:"IRG"}],
 others:[{cat:"SRPC",sub:"10(11)",desc:"Statutory PF received",amt:50000},
         {cat:"AGRI",sub:"10(30)",desc:"Tea Board subsidy",amt:25000}],
 dtaa:[],passThr:15000};

/* ---------------- SPI · SI · IF (si) ---------------- */
S.si={
 spi:[{name:"Aarav Sudhir",rel:"Minor son",amt:18000,head:"OS"},
      {name:"Lakshmi Sudhir",pan:"AKPPL2211M",rel:"Spouse",amt:120000,head:"HP"}],
 edit:"No",rows:[],
 firms:[{name:"Sudhir & Associates",pan:"AAJFS7788L",audit:"N",sec92e:"N",pct:40,profit:20000,interest:60000,remun:120000,capbal:1500000}]};

/* ---------------- Foreign income & assets (FSI · TR · FA) ---------------- */
S.fa={
 fsi:[{code:"2",name:"UNITED STATES OF AMERICA",tin:"US-123-45-6789",sec:"90",
        sal:{b:0,c:0,d:0,art:""},hp:{b:0,c:0,d:0,art:""},bus:{b:0,c:0,d:0,art:""},
        cg:{b:200000,c:40000,d:60000,art:"13"},os:{b:500000,c:80000,d:60000,art:"11"}},
      {code:"44",name:"UNITED KINGDOM OF GREAT BRITAIN AND NORTHERN IRELAND",tin:"UK-777-88",sec:"91",
        hp:{b:300000,c:30000,d:25000,art:""}}],
 trFlag:"YES",trAmt:12000,trAY:"2024-25",
 a1:[{code:"2",Bankname:"JPMorgan Chase Bank",AddressOfBank:"270 Park Avenue, New York",ZipCode:"10017",ForeignAccountNumber:"US-987654321",OwnerStatus:"OWNER",AccOpenDate:"14/03/2019",PeakBalanceDuringYear:3200000,ClosingBalance:2750000,IntrstAccured:42000}],
 a2:[{code:"2",FinancialInstName:"Charles Schwab",FinancialInstAddress:"3000 Schwab Way, Westlake TX",ZipCode:"76262",AccountNumber:"SCHW-4455667",Status:"OWNER",AccOpenDate:"02/06/2020",PeakBalanceDuringPeriod:5100000,ClosingBalance:4800000,NatureOfAmount:"D",GrossAmtPaidCredited:150000}],
 a3:[{code:"2",NameOfEntity:"Alphabet Inc",AddressOfEntity:"1600 Amphitheatre Parkway",ZipCode:"94043",NatureOfEntity:"Listed company",InterestAcquiringDate:"15/09/2021",InitialValOfInvstmnt:1800000,PeakBalanceDuringPeriod:2600000,ClosingBalance:2400000,TotGrossAmtPaidCredited:0,TotGrossProceeds:0}],
 a4:[{code:"44",FinancialInstName:"Aviva Life",FinancialInstAddress:"St Helen's, London",ZipCode:"EC3P3DQ",ContractDate:"10/01/2018",CashValOrSurrenderVal:900000,TotGrossAmtPaidCredited:0}],
 b:[{code:"65",ZipCode:"048624",NatureOfEntity:"Private limited company",NameOfEntity:"Sudhir Trading Pte Ltd",AddressOfEntity:"1 Raffles Place, Singapore",NatureOfInt:"DIRECT",DateHeld:"01/07/2022",TotalInvestment:2500000,IncFromInt:120000,NatureOfInc:"Dividend",IncTaxAmt:120000,IncTaxSch:"OS",IncTaxSchNo:"1a"}],
 c:[{code:"971",ZipCode:"00000",AddressOfProperty:"Apartment 1204, Marina Heights, Dubai",Ownership:"DIRECT",DateOfAcq:"20/11/2017",TotalInvestment:14000000,IncDrvProperty:200000,NatureOfInc:"Rent",IncTaxAmt:200000,IncTaxSch:"OS",IncTaxSchNo:"1c"}],
 d:[{code:"2",ZipCode:"10001",NatureOfAsset:"Bitcoin held with Coinbase",Ownership:"DIRECT",DateOfAcq:"05/02/2021",TotalInvestment:400000,IncDrvAsset:0,NatureOfInc:"None",IncTaxAmt:0,IncTaxSch:"NI",IncTaxSchNo:""}],
 e:[{code:"44",NameOfInstitution:"HSBC Bank plc",AddressOfInstitution:"8 Canada Square, London",ZipCode:"E145HQ",NameMentionedInAccnt:"Sudhir Family Trust",InstitutionAccountNumber:"GB-11223344",PeakBalanceOrInvestment:1500000,IncAccuredTaxFlag:"N",IncAccuredInAcc:0,IncOfferedAmt:0,IncOfferedSch:"NI",IncOfferedSchNo:""}],
 f:[{code:"44",ZipCode:"E145HQ",NameOfTrust:"Sudhir Family Trust",AddressOfTrust:"8 Canada Square, London",NameOfOtherTrustees:"John Whitfield",AddressOfOtherTrustees:"London",NameOfSettlor:"S Sudhir",AddressOfSettlor:"Bengaluru",NameOfBeneficiaries:"Aarav Sudhir",AddressOfBeneficiaries:"Bengaluru",DateHeld:"01/04/2020",IncDrvTaxFlag:"N",IncDrvFromTrust:0,IncOfferedAmt:0,IncOfferedSch:"NI",IncOfferedSchNo:""}],
 g:[{code:"65",ZipCode:"048624",NameOfPerson:"Sudhir Trading Pte Ltd",AddressOfPerson:"1 Raffles Place, Singapore",IncDerived:80000,NatureOfInc:"Consultancy fee",IncDrvTaxFlag:"Y",IncOfferedAmt:80000,IncOfferedSch:"OS",IncOfferedSchNo:"1e"}]};

/* ---------------- Assets & liabilities (Schedule AL) ---------------- */
S.al={ownImm:"Yes",
 imm:[{desc:"Residential house",resNo:"No. 42",resName:"Brigade Gardens",road:"Richmond Road",area:"Richmond Town",city:"Bengaluru",state:"15",country:"91",pin:"560025",amount:18000000},
      {desc:"Flat (50% share)",resNo:"7B",resName:"Prestige Lakeside",road:"Varthur Road",area:"Whitefield",city:"Bengaluru",state:"15",country:"91",pin:"560066",amount:6500000}],
 mov:{jewellery:2400000,art:350000,vehicles:2800000,bank:6900000,shares:12500000,insurance:1800000,loans:500000,cash:120000},
 aopFlag:"Y",
 aop:[{name:"Sudhir & Associates",resNo:"9",resName:"Prestige Tower",road:"MG Road",area:"Central",city:"Bengaluru",state:"15",country:"91",pin:"560001",pan:"AAJFS7788L",invest:1500000}],
 liab:10600000};

/* ---------------- Sch 5A · PTI · ESOP (other) ---------------- */
S.other={
 s5a:{name:"Lakshmi Sudhir",pan:"AKPPL2211M",aadhaar:"612345678901",aud44ab:"N",aud92e:"N",
      hp:{inc:200000,spouse:100000,tds:20000,tdsSp:10000},bp:{inc:60000,spouse:30000,tds:0,tdsSp:0},
      cg:{inc:0,spouse:0,tds:0,tdsSp:0},os:{inc:20000,spouse:10000,tds:2000,tdsSp:1000}},
 pti:[{kind:"A",name:"Embassy Office Parks REIT",pan:"AAATE0770R",
        hp:{inc:90000,loss:0,tds:9000},osDiv:{inc:60000,tds:6000},osOth:{inc:15000,tds:1500},ex23fbb:{inc:0,tds:0}},
      {kind:"B",name:"Sundaram Alternate Opportunities Fund",pan:"AAATS5566Q",
        st111a:{inc:80000,loss:10000,tds:8000},ltOth:{inc:90000,loss:0,tds:9000},lt112a:{inc:60000,loss:0,tds:0},ex23fbb:{inc:25000,tds:0}}],
 esop:{pan:"AAECS9988F",dpiit:"DIPP45678",
   yrs:{"2021-22":{bf:50000,sec:"",ceased:""},
        "2022-23":{bf:100000,sec:"PS",ceased:"N"},
        "2023-24":{bf:0,sec:"",ceased:""},
        "2024-25":{bf:80000,sec:"NS",ceased:"N"},
        "2025-26":{bf:0,sec:"",ceased:""}},
   sales:[{ay:"2022-23",date:"10/06/2025",amt:40000}]}};

/* ---------------- Taxes paid (paid) ---------------- */
S.paid={
 tds1:[{tan:"BLRG09999C",name:"Government of Karnataka",inc:970000,tds:60000},
       {tan:"BLRW05678B",name:"Wipro Limited",inc:600000,tds:40000}],
 tds2:[{who:"S",tan:"BLRS12345D",sec:"94A",dedOwn:5000,claimOwn:5000,gross:50000,head:"OS"},
       {who:"S",tan:"MUMR33333H",sec:"4-IB",dedOwn:30000,claimOwn:30000,gross:600000,head:"HP"}],
 tds3:[{who:"S",pan:"AAAPK1122A",sec:"4IA",dedOwn:30000,claimOwn:30000,gross:3000000,head:"CG"},
       {who:"S",pan:"BQAPM7788N",sec:"94S",dedOwn:5000,claimOwn:5000,gross:500000,head:"CG"}],
 tcs:[{who:"1",tan:"BLRC44444J",collOwn:8000,claimOwn:8000}],
 it:[{bsr:"0510308",dt:"14/06/2025",sn:"12",amt:200000},
     {bsr:"0510308",dt:"12/09/2025",sn:"27",amt:300000},
     {bsr:"0510308",dt:"13/12/2025",sn:"41",amt:400000},
     {bsr:"0510308",dt:"14/03/2026",sn:"63",amt:300000},
     {bsr:"0510308",dt:"25/07/2026",sn:"70",amt:200000}]};
/* the interest engine reads challans from S.it (top-level) — mirror S.paid.it */
S.it=S.paid.it;

/* ---------------- Part B — roll-up, AMT, AMTC, TPSA (tax) ---------------- */
S.tax={s89:0,f234i:0,
 amtc:{"2022-23":{gross:180000,setoff:60000},"2024-25":{gross:95000,setoff:0}},
 tpsaOn:"Yes",tpsa:{amt:100000,rows:[{bsr:"0510308",dt:"20/09/2026",sn:"88",amt:15000}]},amtIFSC:0};

/* ---------------- Bank & verification (bank) ---------------- */
S.bank=[{ifsc:"SBIN0040011",bank:"State Bank of India",acno:"30412345678",type:"SB",refund:"Y"},
 {ifsc:"HDFC0000523",bank:"HDFC Bank",acno:"50100987654321",type:"SB",refund:"N"},
 {ifsc:"ICIC0001234",bank:"ICICI Bank",acno:"123401500987",type:"CA",refund:"N"}];
S.ver={cap:"S",name:"S SUDHIR",father:"S SUBRAMANIAM",pan:"TVOPS4373C",place:"Bengaluru",date:"15/09/2026",nacc:3};
S.trp={id:"TRP0012345",name:"Ramesh Iyer",reimb:0};
