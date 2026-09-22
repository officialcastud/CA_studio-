/* ==========================================================================
   S SUDHIR INDUSTRIES PRIVATE LIMITED · TVOPS4373C · A.Y. 2026-27
   The complete ITR-6 test return (Phase 7).

   Constant test identity (PIPELINE.md): S SUDHIR · TVOPS4373C · 05/11/2006 ·
   Aadhaar 734519826041 · 9845012345 · s.sudhir.test@example.in ·
   No. 42, 3rd Cross, Richmond Town, Bengaluru 560025, Karnataka ·
   SBIN0040011 / 30412345678.
   On a COMPANY return the identity is carried as follows: the PAN and the
   05/11/2006 date are the company's (PAN of incorporation date); the natural
   person S SUDHIR is the Managing Director who verifies the return and is
   listed as a Key Person (so the verification PAN matches a Key Person PAN,
   rule A 868).  NOTE: TVOPS4373C has "P" as its fourth letter, so the `who`
   section raises its "PAN does not match a company" WARNING — that is the
   one lawfulness compromise forced by holding the constant PAN fixed.

   THE CLIENT: a resident, domestic, UNLISTED PRIVATE company on the NORMAL
   regime (Section115BA = "NA" — not 115BA/115BAA/115BAB), liable to audit
   u/s 44AB, not liable u/s 92E, filing u/s 139(1) on 15/10/2026, before the
   31/10/2026 due date.  Turnover of FY 2023-24 did NOT exceed Rs 400 crore,
   so the corporate rate is 25 %.
   ========================================================================== */

/* ======================= 1 · WHO IS FILING (PartA_GEN1) ================= */
S.pi = {
  name:"S SUDHIR INDUSTRIES PRIVATE LIMITED", nameChg:"N", oldName:"",
  pan:"TVOPS4373C", cin:"U29100KA2006PTC043730",
  res:"RES",                              /* SEAM: the cg / os / ei / fa / bank engines read
                                             S.pi.res, while `who` owns S.fs.resStatus. Both are
                                             set so the company is read as resident everywhere. */
  doi:"05/11/2006",                       /* date of incorporation = constant DOB */
  bizStart:"01/04/2007",
  status:"7",                             /* 7 = Private Company */
  domestic:"Y",
  /* primary (communication) address — the constant address */
  addr1:"No. 42, 3rd Cross", premises:"Sudhir Towers", road:"Richmond Road",
  locality:"Richmond Town", city:"Bengaluru", country:"91", state:"15", pin:"560025",
  email:"s.sudhir.test@example.in", email2:"accounts.sudhir@example.in",
  mobileCc:"91", mobile:"9845012345", mobile2Cc:"91", mobile2:"9845067890",
  std:"080", phone:"25551234",
  /* registered office differs from the communication address */
  addr2same:"N",
  addr1b:"Plot 18, KIADB Industrial Area", premisesb:"Sudhir Works", roadb:"Hoskote Road",
  localityb:"Narasapura", cityb:"Kolar", countryb:"91", stateb:"15", pinb:"563133"
};

S.fs = {
  sec:"11",                               /* 139(1) — on or before the due date */
  due:"2026-10-31",                       /* ItrFilingDueDate (non-92E company) */
  filed:"15/10/2026",                     /* date of filing — before the due date */
  resStatus:"RES",
  grossRcpt:"N",                          /* FilingStatus.GrossReceipt — turnover FY 23-24 NOT > 400 cr */
  grossReceipt:"N",                       /* SEAM: the tax engine's taxDrivers() reads
                                             "fs.grossReceipt" (not "fs.grossRcpt"), so the
                                             25 % small-company rate needs this second key.
                                             Reported to the CEO as a naming seam. */
  resSec90:"N",
  s115:"NA",                              /* normal regime — NOT 115BA/115BAA/115BAB */
  s115Curr:"N",
  regLaw:"Y", actDesc:"Companies Act, 2013", actRegNo:"U29100KA2006PTC043730", actRegDate:"05/11/2006",
  finStmt:"N",                            /* financial statements NOT drawn under Ind AS */
  ifsc:"N",                               /* not a unit in an IFSC */
  underLiq:"N",
  fpi:"N",
  producer:"N",                           /* not a producer company u/s 378A */
  rep:"N",
  startup:"N",                            /* not DPIIT-recognised (incorporated 2006) */
  msme:"Y", msmeNo:"UDYAM-KR-03-0012345",
  lei:"3358005G7M7VX2ZUXX88", leiValid:"31/12/2027",
  cnd44AB:"bi"                            /* turnover exceeds the s.44AB limits */
};

/* ======================= 2 · COMPANY PARTICULARS (PartA_GEN2For6) ======= */
S.gen = {
  aud:{
    sec44AA:"Y", incDclrdUs:"N",
    salesBand:"MoreThan10CR",              /* turnover Rs 62 crore */
    sec44AB:"Y", acctFlg:"Y",
    repDate:"12/09/2026", repAck:"482910375612",
    frmName:"Rao & Rao, Chartered Accountants", frmPAN:"AAAFR5566K",
    sec92E:"N", acct92E:"", date92E:"", ack92E:"",
    oth:[
      {sec:"10AA", otherSec:"", flag:"Y", date:"12/09/2026", ack:"482910375613"},
      {sec:"80-IA", otherSec:"", flag:"Y", date:"12/09/2026", ack:"482910375614"},
      {sec:"115JB", otherSec:"", flag:"Y", date:"12/09/2026", ack:"482910375615"}
    ],
    act:[
      {act:"6", actOther:"", sec:"143", othFlag:"Y", date:"28/08/2026"},
      {act:"4", actOther:"", sec:"35(5)", othFlag:"Y", date:"20/12/2025"}
    ]
  },
  hold:{
    natFlg:"1",                            /* 1 = holding company */
    holding:[],
    subsid:[
      {name:"Sudhir Components Private Limited", pan:"AAECS1122F",
       addr:"Plot 9, KIADB Industrial Area, Narasapura", city:"Kolar", state:"15",
       country:"91", pin:"563133", zip:"", pct:100},
      {name:"Sudhir Logistics Private Limited", pan:"AAFCS3344G",
       addr:"No. 7, Mysore Road", city:"Bengaluru", state:"15",
       country:"91", pin:"560026", zip:"", pct:72}
    ]
  },
  busorg:[
    {type:"AMALGAMATED", name:"Narasapura Tooling Private Limited", addr:"Plot 4, KIADB Area",
     city:"Kolar", state:"15", country:"91", pin:"563133", zip:"", pan:"AACCN7788H", date:"01/04/2024"}
  ],
  keyp:[
    {name:"S SUDHIR", desig:"MD", addr:"No. 42, 3rd Cross, Richmond Town", city:"Bengaluru",
     state:"15", country:"91", pin:"560025", zip:"", pan:"TVOPS4373C",
     aadhaar:"734519826041", din:"01234567"},
    {name:"LAKSHMI SUDHIR", desig:"DIR", addr:"No. 42, 3rd Cross, Richmond Town", city:"Bengaluru",
     state:"15", country:"91", pin:"560025", zip:"", pan:"AKPPL2211M",
     aadhaar:"612345678901", din:"01234568"},
    {name:"R VENKATESH", desig:"CFO", addr:"No. 118, 5th Main, Jayanagar", city:"Bengaluru",
     state:"15", country:"91", pin:"560041", zip:"", pan:"AFRPV9988L", aadhaar:"501234567890", din:""},
    {name:"MEERA NAIR", desig:"SEC", addr:"No. 3, Cunningham Road", city:"Bengaluru",
     state:"15", country:"91", pin:"560052", zip:"", pan:"BKRPN4455J", aadhaar:"401234567891", din:""}
  ],
  shr:[
    {name:"S SUDHIR", pct:62, addr:"No. 42, 3rd Cross, Richmond Town", city:"Bengaluru",
     state:"15", country:"91", pin:"560025", zip:"", pan:"TVOPS4373C", aadhaar:"734519826041"},
    {name:"LAKSHMI SUDHIR", pct:23, addr:"No. 42, 3rd Cross, Richmond Town", city:"Bengaluru",
     state:"15", country:"91", pin:"560025", zip:"", pan:"AKPPL2211M", aadhaar:"612345678901"},
    {name:"KAVERI CAPITAL LLP", pct:15, addr:"No. 9, Lavelle Road", city:"Bengaluru",
     state:"15", country:"91", pin:"560001", zip:"", pan:"AAEFK6677N", aadhaar:""}
  ],
  own:[
    {name:"S SUDHIR", pct:62, addr:"No. 42, 3rd Cross, Richmond Town", city:"Bengaluru",
     state:"15", country:"91", pin:"560025", zip:"", pan:"TVOPS4373C", aadhaar:"734519826041"},
    {name:"LAKSHMI SUDHIR", pct:23, addr:"No. 42, 3rd Cross, Richmond Town", city:"Bengaluru",
     state:"15", country:"91", pin:"560025", zip:"", pan:"AKPPL2211M", aadhaar:"612345678901"}
  ],
  /* the two foreign-parent tables are for a FOREIGN company only — this
     company is domestic, so they are left empty (logged as not applicable). */
  frnImm:[], frnUlt:[],
  nat:{ pubSect:"N", rbi:"N", gov40:"N", bank:"N", schedBank:"N", irda:"N", nbfi:"N",
        unlisted:"Y" },                    /* unlisted -> Schedule SH-1 and AL-1 are required */
  nob:[
    {code:"04066", trade:"Sudhir Industries", desc:"Manufacture of other general purpose machinery"},
    {code:"09009", trade:"Sudhir Trading Division", desc:"Wholesale of metals and metal ores"},
    {code:"11013", trade:"Sudhir Cold Chain", desc:"Storage and warehousing (specified business u/s 35AD)"}
  ]
};

/* ======================= 3 · AUDITED ACCOUNTS (Part A) ==================
   The audited Schedule-III (non-Ind-AS) accounts of the company, in rupees:

     BALANCE SHEET (foots at 12,70,00,000)
       EQUITY & LIABILITIES            ASSETS
        Share capital        2,00,00,000   Tangible fixed assets (net) 5,40,00,000
        Reserves & surplus   4,62,00,000   Intangible assets (net)        9,00,000
        Long-term borrowings 2,80,00,000   Capital work in progress      30,00,000
        Deferred tax liab.     15,00,000   Non-current investments    1,80,00,000
        Long-term provisions   20,00,000   Long-term loans & advances   40,00,000
        Short-term borrowings  90,00,000   Other non-current assets     11,00,000
        Trade payables       1,24,00,000   Current investments          60,00,000
        Other curr. liab.      36,00,000   Inventories                1,45,00,000
        Short-term provisions  43,00,000   Trade receivables          1,72,00,000
                            ------------   Cash & cash equivalents      58,00,000
                             12,70,00,000  Short-term loans & adv.      23,00,000
                                           Other current assets          2,00,000
                                                                     ------------
                                                                      12,70,00,000
     STATEMENT OF PROFIT AND LOSS (foots to a profit before tax of 1,28,15,000)
        Revenue from operations                    6,20,00,000
        Other income                                 78,15,000
          rent of the let-out building  24,00,000
          dividend (domestic companies) 12,00,000
          interest on bank deposits      4,50,000
          interest on income-tax refund    25,000
          rent of plant let on hire       3,00,000
          miscellaneous receipts            60,000
          profit on sale of investments 30,00,000
          share of profit from the firm  1,80,000
          interest from the firm         1,20,000
          interest on tax-free bonds       80,000
        Total revenue                              6,98,15,000
        Cost of materials consumed     3,80,00,000
        Employee benefits expense         90,00,000
        Finance costs                     12,00,000
        Depreciation and amortisation     28,00,000
        Other expenses                    60,00,000
        Total expenses                             5,70,00,000
        PROFIT BEFORE TAX                          1,28,15,000
        Provision for current tax 24,00,000 · deferred tax 1,50,000
        PROFIT AFTER TAX                           1,02,65,000

   The `accounts` section (forms/ITR-6/src/70_sec_accounts.js, engAccounts/
   expAccounts/impAccounts) is now built and registered, so these audited
   figures are wired LIVE below.  Only input leaves are set; the engine
   computes every *Total / *Net / TotShareCapital / ResrNSurp.PLAccount /
   TotEquityAndLiabilities / TotalAssets and writes them back onto S.accounts
   (single source of truth), then expAccounts overlays the subtree onto the
   schema-required BS/P&L skeleton.  Every key path below is the verbatim
   schema/engine key (confirmed against ITR-6_2026_Main_V1_0_schema.json). */
/* NOTE: 10_state.js pre-seeds `accounts:{}` (and every other section
   namespace), so 70_sec_accounts.js's own `S.accounts = S.accounts || {...}`
   seed never fires — see the build report, defect 1. The object is therefore
   built here in full. */
S.accounts = {
  basis:"reg",                             /* Schedule III (non-Ind-AS) accounts */
  bsOn:true, mfgOn:false, trdOn:true, plOn:true,
  biasOn:false, mfgiasOn:false, trdiasOn:false, pliasOn:false,
  oiOn:true, qdOn:false, olOn:false,
  /* ---- BALANCE SHEET (Schedule III) — foots to 12,70,00,000. ---- */
  bs:{
    EquityAndLiablities:{
      ShareHolderFund:{
        ShareCapital:{ IssuedSubsPaidUp:20000000 },            /* share capital 2,00,00,000 */
        ResrNSurp:{ CapResr:35935000, OtherResrvDtls:[] }      /* PLAccount 1,02,65,000 engine-fed -> R&S 4,62,00,000 */
      },
      NonCurrLiabilities:{
        LongTermBorrowings:{ TermLoans:{ RupeeLoans:{ FromBanks:28000000 } } }, /* 2,80,00,000 */
        NetDefferedTaxLiability:1500000,                       /* 15,00,000 */
        LongTermProvisions:{ ProvEmpBenefits:2000000 }         /* 20,00,000 */
      },
      CurrentLiabilities:{
        ShortTrmBorrowings:{ LoansRepaybleOnDemand:{ FromBanks:9000000 } },     /* 90,00,000 */
        TradePayables:{ Others:12400000 },                     /* 1,24,00,000 */
        OthCurrLiabilities:{ OthPayables:3600000 },            /* 36,00,000 */
        ShortTermProv:{ ITProvision:4300000 }                  /* 43,00,000 */
      }
    },
    Assets:{
      NonCurrAssets:{
        FixedAsset:{
          Tangible:{ GrossBlock:54000000 },                    /* net 5,40,00,000 */
          InTangible:{ GrossBlock:900000 },                    /* net 9,00,000 */
          CapWrkProg:3000000                                   /* 30,00,000 (FixedAsset.CapWrkProg per schema) */
        },
        NonCurrInvstmnts:{ OtherInvstmnts:18000000 },          /* 1,80,00,000 */
        LongTrmLoanAdv:{ OthLoanAdv:4000000 },                 /* 40,00,000 */
        OthNonCurrAssets:{ Others:1100000 }                    /* 11,00,000 */
      },
      CurrentAssets:{
        CurrInvstmnts:{ OtherInvstmnts:6000000 },              /* 60,00,000 */
        Inventories:{ RawMatl:14500000 },                      /* 1,45,00,000 */
        TradeReceivables:{ Others:17200000 },                  /* 1,72,00,000 */
        CashNCashEquivalents:{ BalWithBanks:5800000 },         /* 58,00,000 */
        TotShortTermLoanAdv:{ Others:2300000 },                /* 23,00,000 */
        OtherCurrAssets:200000                                 /* 2,00,000 (CurrentAssets.OtherCurrAssets per schema) */
      }
    }
  },
  mfg:{}, bsias:{}, mfgias:{}, trdias:{}, plias:{},
  /* ---- TRADING ACCOUNT — sales 6,20,00,000 − purchases 3,80,00,000
     => Gross Profit 2,40,00,000 (item 12 -> P&L item 13). ---- */
  trd:{ SaleOfGoods:62000000, Purchases:38000000 },
  /* ---- STATEMENT OF PROFIT & LOSS — PBT 1,28,15,000 / PAT 1,02,65,000. ---- */
  pl:{
    CreditsToPL:{ OthIncome:{
      RentInc:2700000,          /* building rent 24,00,000 + plant let on hire 3,00,000 */
      Dividends:1200000,        /* dividend from domestic companies */
      InterestInc:475000,       /* bank-deposit interest 4,50,000 + IT-refund interest 25,000 */
      ProfitOnOthInv:3000000,   /* profit on sale of investments */
      AmtofInterest:120000,     /* 14xib interest received from the partnership firm */
      OtherIncDtls:[
        {NatureOfIncome:"Misc",  Amount:180000},   /* share of profit of the firm */
        {NatureOfIncome:"Scrap", Amount:60000},    /* miscellaneous receipts */
        {NatureOfIncome:"Other", Amount:80000}     /* interest on tax-free bonds */
      ]
    } },
    DebitsToPL:{
      DebitPlAcnt:{
        EmployeeComp:{ SalsWages:9000000 },                         /* employee benefits 90,00,000 */
        OtherExpensesDtls:[{ExpenseNature:"Admin", Amount:6000000}],/* other expenses 60,00,000 */
        InterestExpdrtDtls:{ Others:1200000 },                      /* finance costs 12,00,000 */
        DepreciationAmort:2800000                                   /* depreciation & amortisation 28,00,000 */
      },
      TaxProvAppr:{
        ProvForCurrTax:2400000,   /* provision for current tax 24,00,000 */
        ProvDefTax:150000         /* provision for deferred tax 1,50,000 */
      }
    }
  },
  /* ---- PART A-OI (tax-audit annexure). MethodOfValClgStk 4d/4e = nil, so
     BP 25/33 remain the Schedule ICDS increase / decrease alone. ---- */
  oi:{ MethodOfAcct:"MERC", ChangeInAcctMethFlg:"N",
       MethodOfValClgStk:{ ValRawMaterial:"1", ValFinishedGoods:"1", ChngStockValMetFlg:"N",
                           EffectOnPL:0, DecProOrIncLossUs145_A:0 },
       AmountOfExpDisAllwUs14A:15000 },                             /* OI 16 -> BP 8b */
  /* Part A-QD — the audited books carry no quantitative rows, so QD is not filed. */
  qd:{ trd:[], raw:[], fin:[] }, ol:{}
};

/* ======================= 4 · SCHEDULE BP (and DPM/DOA/DEP/DCG/ESR/ICDS) = */
S.bp = {
  pbt:12815000,                 /* 1  profit before tax per the P&L */
  nplSpec:150000,               /* 2a net profit of the speculative (commodity) segment */
  nplSpecified:200000,          /* 2b net profit of the specified business u/s 35AD (sugar warehouse) */
  /* 3 — income credited to the P&L but chargeable under another head */
  a3a:2400000,                  /* 3a house property (gross rent credited) */
  a3b:3000000,                  /* 3b capital gains (book profit on sale of investments) */
  a3ci:1200000,                 /* 3c(i) dividend */
  a3cii:835000,                 /* 3c(ii) bank interest 4,50,000 + refund interest 25,000
                                   + plant hire 3,00,000 + miscellaneous 60,000 */
  a3d:0, a3e:0, a3f:0,
  /* 4 — profits under the presumptive / rule 7-8 sections: none */
  p44AE:0,p44B:0,p44BB:0,p44BBA:0,p44BBB:0,p44BBC:0,p44BBD:0,p44D:0,p44DA:0,pXIIG:0,pFirstSch:0,
  p115B:0, r7:0,r7A:0,r7B1:0,r7B1A:0,r8:0, pElig10TIA:0,
  /* 5 — exempt income credited to the P&L */
  a5a:180000,                   /* 5a share in the profit of the firm (s.10(2A)) */
  a5b:0,
  divExempt:0,
  othExempt:[{name:"Interest on tax-free bonds exempt u/s 10(15)", amt:80000}],
  a5A:0,
  /* 7-8 — expenses debited to the P&L that belong to another head / exempt income */
  e7a:550000,                   /* 7a house property: municipal taxes 1,50,000 + interest 4,00,000 */
  e7b:0,
  e7c:140000,                   /* 7c other sources: collection charges 40,000 + interest 1,00,000 */
  e7d:0, e7e:0,
  e8a:20000,                    /* 8a expenses relating to exempt income */
  e8b:15000,                    /* 8b disallowance u/s 14A (16 of Part A-OI) */
  /* 11-12 depreciation */
  depDebPL:2800000,             /* 11 depreciation debited to the P&L */
  dep32_1_i:0,
  /* 14-19 add-backs */
  d14:50000,                    /* 14 disallowable u/s 36 */
  d15:80000,                    /* 15 disallowable u/s 37 (penalty) */
  d16:120000,                   /* 16 disallowable u/s 40 (TDS not deducted, 30 %) */
  d17:60000,                    /* 17 disallowable u/s 40A(3) */
  d18:150000,                   /* 18 disallowable u/s 43B (unpaid statutory dues) */
  d19:0,
  deem41:25000,                 /* 20 deemed income u/s 41(1) */
  /* 21 deemed income — only the total is filed */
  d21_32AC:0,d21_32AD:0,d21_33AB:40000,d21_33ABA:0,d21_35ABA:0,d21_35ABB:0,
  d21_35AC:0,d21_40A3A:0,d21_33AC:0,d21_72A:0,d21_80HHD:0,d21_80IA:0,
  d22:0, d23:0,
  i24a:0, i24b:0, i24c:0,
  /* 27-32 deductions */
  d27:0, d28_32AC:0,
  d30:70000,                    /* 30 disallowed u/s 40 in an earlier year, now allowable */
  d31:110000,                   /* 31 disallowed u/s 43B in an earlier year, now paid */
  d32:0,
  /* 36 presumptive — none */
  dp44AE:0,dp44B:0,dp44BB:0,dp44BBA:0,dp44BBB:0,dp44BBC:0,dp44BBD:0,dp44D:0,dp44DA:0,dpXIIG:0,dpFirstSch:0,
  /* 38 rule 7 / 7A / 7B / 8 — none */
  r38a:0,r38b:0,r38c:0,r38d:0,r38e:0,
  /* Part B — speculative */
  s41:0, s42:0,
  /* Part C — specified business u/s 35AD */
  sp45:0, sp46:0, sp48:0,
  clause:["ah",""]              /* 35AD(5)(ah) — warehousing facility for the storage of sugar */
};

/* --- Schedule DPM (plant & machinery, by rate) --- */
S.dpm = {
  r15:{ WDVFirstDay:8000000, AdditionsGrThan180Days:2000000, AdditionsLessThan180Days:1000000,
        RealizationTotalPeriod:0, RealizationPeriodDuringYear:0,
        AddlnDeprOnGT180DayAdditions:400000,        /* 20 % of 20,00,000 */
        AddlnDeprDuringYearAdditions:0,
        AddlnDeprOnLessThan180DayAdditions:100000,  /* 10 % of 10,00,000 (used < 180 days) */
        DepDisAllowUs38_2:0, ProportionateAggDepreciation:0, ExpdrOnTrforSaleAsset:0 },
  r30:{ WDVFirstDay:600000 },
  r40:{ WDVFirstDay:500000, AdditionsGrThan180Days:300000, RealizationTotalPeriod:100000 },
  r45:{ WDVFirstDay:200000 }
};
/* --- Schedule DOA (land, buildings, furniture, intangibles, ships) --- */
S.doa = {
  land:{ WDVFirstDay:5000000 },
  b5:{ WDVFirstDay:12000000 },
  b10:{ WDVFirstDay:1000000 },
  b40:{},
  furn:{ WDVFirstDay:800000, AdditionsLessThan180Days:200000 },
  intang:{ WDVFirstDay:1200000 },
  ships:{}
};
/* --- Schedule ESR (expenditure on scientific research) --- */
S.esr = {
  i:{ deb:500000, allow:500000 },     /* 35(1)(i)  in-house revenue research */
  ii:{ deb:200000, allow:200000 },    /* 35(1)(ii) donation to an approved research association */
  iii:{ deb:0, allow:0 },
  iv:{ deb:0, allow:0 },
  v:{ deb:0, allow:0 },
  vi:{ deb:300000, allow:300000 },    /* 35(2AA) donation to a National Laboratory */
  vii:{ deb:0, allow:0 },
  viii:{ deb:0, allow:0 },
  ix:{ deb:100000, allow:100000 }     /* 35CCD skill-development project */
};
/* --- Schedule ICDS (XI) — increase 2,20,000 / decrease 80,000 --- */
S.icds = {
  acc:{ inc:60000, dec:0 },           /* I    accounting policies */
  inv:{ inc:0, dec:0 },
  cons:{ inc:90000, dec:0 },          /* III  construction contracts */
  rev:{ inc:0, dec:50000 },           /* IV   revenue recognition */
  tfa:{ inc:0, dec:0 },
  fx:{ inc:25000, dec:0 },            /* VI   foreign exchange rates */
  grant:{ inc:0, dec:0 },
  sec:{ inc:0, dec:0 },
  borr:{ inc:0, dec:30000 },          /* IX   borrowing costs */
  prov:{ inc:45000, dec:0 }           /* X    provisions */
};

/* ======================= 5 · SCHEDULE HP (let-out only) ================= */
/* A company has no self-occupied house — both properties are Y / D. */
S.hp = { on:"1", pti:"", props:[
  { addr:"No. 42, 3rd Cross, Richmond Town", city:"Bengaluru", country:"91", state:"15", pin:"560025",
    owner:"SE", co:"NO", type:"Y",
    tenants:[{name:"Arjun Technologies Private Limited", pan:"AADCA5566P", aadhaar:"", pantan:"AADCA5566P"}],
    coowners:[],
    rent:2400000, unreal:0, taxes:120000, arrears:0,
    loans:[{from:"B", name:"State Bank of India", acno:"HL30412345678", dt:"12/04/2019",
            amt:25000000, os:18400000, interest:400000}] },
  { addr:"Plot 18, KIADB Industrial Area, Narasapura", city:"Kolar", country:"91", state:"15", pin:"563133",
    owner:"SE", co:"YES", type:"D",
    coowners:[{name:"Sudhir Components Private Limited", pan:"AAECS1122F", aadhaar:"", share:30}],
    tenants:[],
    rent:600000, unreal:0, taxes:30000, arrears:0, loans:[] }
]};

/* ======================= 6 · SCHEDULE CG · 112A · VDA =================== */
S.cg = {
  on:true,
  land:[
    { /* A1 — short-term: a shed sold within 24 months */
      buy:"05/05/2024", sale:"15/09/2025", lt:"Short",
      cons:3000000, sdv:3000000, cost:2500000, improve:0, exp:50000,
      ded:{}, paddr:"Shed 4, Peenya 2nd Stage", pstate:"15", ppin:"560058", pcountry:"91",
      buyers:[{name:"Nandi Steels Private Limited", pan:"AAACN1234B", aadhaar:"", share:100, amt:3000000}] },
    { /* B1 — long-term: factory land sold, 54EC bonds bought */
      buy:"10/06/2015", sale:"20/11/2025", lt:"Long",
      cons:9000000, sdv:9200000, cost:4000000, improve:500000, exp:200000,
      ded:{ s54D:0, s54EC:800000, s54G:0, s54GA:0 },
      paddr:"Survey 112, Bommasandra Industrial Area", pstate:"15", ppin:"560099", pcountry:"91",
      buyers:[{name:"Greenfield Realty Private Limited", pan:"AABCG7788C", aadhaar:"", share:100, amt:9000000}] }
  ],
  a2:{},                                             /* A2 slump sale — none */
  a3i:{ cons:900000, cost:700000, improve:0, exp:5000, loss94:0 },   /* A3(i) 111A STCG */
  a3ii:{}, a4:{}, a5:{},
  a6:{ unqCons:0, unqFmv:0, othCons:500000, cost:400000, improve:0, exp:10000,
       loss94:0, dcg:0, ded:{} },                    /* A6 other short-term assets */
  a7:{ deem:[{py:"2023-24", sec:"54G", yracq:"2024", util:200000, unused:100000}],
       other:0, unutFlag:"" },                       /* A7 deemed STCG — unutilised CGAS */
  a8:{ r20:60000, r30:0, rApp:40000 },               /* A8 pass-through STCG (Schedule PTI) */
  a9:[],                                             /* A9 DTAA STCG — non-residents only */
  aA:[{rate:"STL20", amt:50000}],                    /* A(A) loss on buy-back of shares taxable @20% */
  b2:{},                                             /* B2 slump sale — none */
  b3:{ cons:1000000, cost:700000, improve:0, exp:0 },/* B3 112(1) listed securities / ZCB */
  b4:{}, b5:{}, b6:[], b7:{},
  b8:{ ded:{} },
  b9:{ deem:[], other:0, unutFlag:"" },
  b10:{ r125a:120000, r125o:80000 },                 /* B10 pass-through LTCG (Schedule PTI) */
  b11:[],                                            /* B11 DTAA LTCG — non-residents only */
  bA:{},
  s112a:[
    { pre18:"AE", after23:"AF", isin:"INE009A01021", name:"Infosys Limited",
      qty:0, price:0, sale6:2000000, cost:1200000, fmv18:0, exp:10000 },
    { pre18:"BE", after23:"AF", isin:"INE002A01018", name:"Reliance Industries Limited",
      qty:5000, price:300, sale6:0, cost:600000, fmv18:200, exp:5000 }
  ],
  s115ad:[],                                         /* 115AD — FII / non-resident only */
  vda:[
    { buy:"10/05/2025", sale:"20/12/2025", head:"CG", cost:400000, cons:650000 },
    { buy:"01/06/2024", sale:"15/01/2026", head:"CG", cost:300000, cons:260000 }
  ],
  dclaim:{
    us54D:[],
    us54EC:[{transfer:"20/11/2025", invested:800000, invdate:"15/01/2026", amt:800000}],
    us54G:[], us54GA:[]
  },
  editE:false, Eover:null, editF:false, Fover:null
};

/* ======================= 7 · SCHEDULE OS ================================ */
S.os = {
  divOth:1200000,           /* 1a(i)  dividend from domestic companies */
  div22e:0, div22f:0,
  intSaving:0,
  intDeposit:450000,        /* 1b(ii) interest on bank deposits */
  intRefund:25000,          /* 1b(iii) interest on an income-tax refund */
  intPTI:0, intOthers:0,
  rentMach:300000,          /* 1c rent of plant and machinery let on hire */
  giftMoney:0, giftImmovWo:0, giftImmovInadeq:0, giftOthWo:0, giftOthInadeq:0,
  sum562xii:0,
  others:[{nat:"Miscellaneous receipts (scrap, insurance claims)", amt:60000}],
  win115BB:0, win115BBJ:0,
  cc68:0, ui69:0, um69a:0, udi69b:0, ue69c:0, hundi69d:0,
  spl:[],                   /* 2c — the 115A/115AC/115AD codes are for non-residents */
  pti:[],                   /* 2d — no pass-through income at a special rate under OS */
  dtaa:[],                  /* 2e — non-residents only */
  dExpenses:40000,          /* 3a collection charges */
  dDep:60000,               /* 3b depreciation on the plant let on hire (<= 1c) */
  dIntClaimed:100000,       /* 3c interest u/s 57(1) — capped at 20 % of 12,00,000 */
  notDed58:0, profit59:0,
  horse:{ receipts:"", ded57:"", notDed58:"", profit59:"" },
  q:{ d115bbda:{ Upto15Of6:300000, Up16Of6To15Of9:300000, Up16Of9To15Of12:300000,
                 Up16Of12To15Of3:150000, Up16Of3To31Of3:50000 } }
};

/* ======================= 8 · THE LOSS CHAIN (CYLA · BFLA · CFL · UD) ==== */
/* No current-year loss arises (every head is positive), so Schedule CYLA is
   nil.  Schedule CFL carries five earlier years; Schedule BFLA sets off the
   house-property, business, short-term and long-term brought-forward losses.
   The brought-forward speculative (80,000) and specified-business (3,00,000)
   losses cannot be set off — there is no speculative / specified income row
   published to BFLA — and are carried forward again. */
S.loss = {
  cfl:{
    "2019-20":{ dt:"15/10/2019", specified:300000 },
    "2021-22":{ dt:"20/12/2021", hp:120000 },
    "2022-23":{ dt:"28/09/2022", spec:80000 },
    "2023-24":{ dt:"25/09/2023", bus5a:400000, bus5b:0 },
    "2024-25":{ dt:"30/10/2024", st:150000, lt:250000 }
  },
  /* Schedule UD — unabsorbed depreciation and the s.35(4) allowance.
     The set-off columns (4) and (7) are NIL this year: see the build report,
     defect 2 — the tax section reads only BFLA column 2 into Part B-TI item
     8, so a non-nil column 3 / 4 would make Part B-TI disagree with BFLA. */
  ud:[
    { ay:"2026-27", bfud:900000, adj115:0, soc:0, bfallow:150000, allowsoc:0 },
    { ay:"2020-21", bfud:250000, adj115:0, soc:0, bfallow:0,      allowsoc:0 }
  ],
  editC:"", editB:"", cylaOver:{}, busOver:{}, osOver:{}, bflaOver:{}
};

/* ======================= 9 · CHAPTER VI-A · 80G · 80M · 10AA =========== */
S.ded = {
  v:{ iab:0, iba:0, jja:0, jjaa:400000, pa:0 },   /* 80-JJAA: 30 % of the additional employee cost */
  g80:[
    { bucket:"A", name:"Prime Minister's National Relief Fund", addr:"South Block, Raisina Hill",
      city:"New Delhi", state:"09", pin:"110011", pan:"AACTP4637Q", arn:"",
      cash:0, other:200000, ref:"UTR SBIN25091200451", ifsc:"SBIN0040011" },
    { bucket:"B", name:"Jawaharlal Nehru Memorial Fund", addr:"Teen Murti House",
      city:"New Delhi", state:"09", pin:"110011", pan:"AAATJ0602E", arn:"",
      cash:0, other:100000, ref:"UTR SBIN25091200452", ifsc:"SBIN0040011" },
    { bucket:"C", name:"Karnataka State Disaster Response Fund", addr:"Vidhana Soudha",
      city:"Bengaluru", state:"15", pin:"560001", pan:"AAAGK1122L", arn:"AAAGK1122LF2024901",
      cash:0, other:300000, ref:"UTR SBIN25100300117", ifsc:"SBIN0040011" },
    { bucket:"D", name:"Sneha Charitable Trust", addr:"No. 18, 8th Main, Malleswaram",
      city:"Bengaluru", state:"15", pin:"560003", pan:"AAATS9911R", arn:"AAATS9911RF2024122",
      cash:2000, other:48000, ref:"UTR SBIN25110700245", ifsc:"SBIN0040011" }
  ],
  gga:[
    /* the company has business income, so 80GGA is not available (rule A836);
       the donation is disclosed here and the eligible amount is nil. */
    { clause:"80GGA2b", name:"Gramin Vikas Sansthan", addr:"12, Civil Lines",
      city:"Nagpur", state:"19", pin:"440001", pan:"AAATG3344M", cashdt:"",
      cash:0, other:100000 }
  ],
  ra:[
    /* the donees behind Schedule ESR 35(1)(ii) and 35(2AA) */
    { name:"Indian Institute of Science", addr:"CV Raman Road", city:"Bengaluru",
      state:"15", pin:"560012", pan:"AAATI0596J", cash:0, other:200000 },
    { name:"CSIR National Aerospace Laboratories", addr:"Old Airport Road, Kodihalli",
      city:"Bengaluru", state:"15", pin:"560017", pan:"AAATC1919P", cash:0, other:300000 }
  ],
  ggb:[
    { dt:"18/08/2025", cash:0, other:250000, name:"Bharatiya Janata Party", pan:"AAABB0930E",
      ref:"UTR SBIN25081800912", ifsc:"SBIN0040011" }
  ],
  ggc:[],            /* 80GGC is for assessees OTHER than a company — not applicable */
  m80:[
    { dt:"15/09/2026", amt:900000, type:"ScheduleOS" }   /* interim dividend, within the cut-off */
  ],
  la:[],             /* 80LA — no Offshore Banking Unit / IFSC unit */
  iac:{},            /* 80-IAC — not a DPIIT start-up (incorporated 2006) */
  aa10:[
    { ay:"2015-16", amt:500000 }    /* section 10AA — the SEZ unit, 11th year, 50 % */
  ],
  /* Sch80LocOrDescCode is a FIXED schema constant per sub-clause, not free
     text, and the exporter writes every group (empty ones too) — so each
     group carries its own constant. */
  ia:{ i:{ loc:"INFRAFAC" },
       iv:{ loc:"POWER", rows:[{amt:300000}] },            /* 80-IA(4)(iv) captive power unit */
       v:{ loc:"REVIVAL_POWER_PLNT" } },
  ib:{ oil:{ loc:"COMM_PROD" }, hous:{ loc:"HOUSING_PROJECT" },
       fruit:{ loc:"FRIUTS_VEGTBLE", rows:[{amt:150000}] },/* 80-IB(11A) cold chain */
       food:{ loc:"STOR_TRANS" } },
  ie:{ assam:{ loc:"INDSRTL_ASSAM", rows:[{amt:200000}] }, /* 80-IE Assam unit */
       arun:{ loc:"INDSRTL_ARUNPRADESH" }, manip:{ loc:"INDSRTL_MANIPUR" },
       mizo:{ loc:"INDSRTL_MIZORAM" },     megh:{ loc:"INDSRTL_MEGHALAYA" },
       naga:{ loc:"INDSRTL_NAGALND" },     trip:{ loc:"INDSRTL_TRIPURA" },
       sikk:{ loc:"INDSRTL_SIKKIM" } }
};

/* ======================= 10 · SCHEDULE SI ==============================
   The CG / OS / BP engines do not publish a `siFeed` (see the build report,
   defect 3), so Schedule SI is filled through the sheet's own
   "Do you want to edit the details auto-populated?" override.
   Composition, after the Schedule BFLA set-off of the brought-forward
   capital losses (1,50,000 against short-term, 2,50,000 against long-term):
     111A STCG @20 %      1,95,000 less 50,000 buy-back loss   = 1,45,000
     PTI STCG @20 %                                               60,000
     112 land LTCG @12.5 % 35,00,000 less 2,50,000 BF LTCL    = 32,50,000
     112(1) listed securities @12.5 %                           3,00,000
     112A equity @12.5 %                                       12,85,000
     PTI 112A LTCG @12.5 %                                      1,20,000
     PTI other LTCG @12.5 %                                       80,000
     115BBH virtual digital assets @30 %                        2,50,000
                                                              -----------
                                                               54,90,000   */
S.si = { edit:"Yes", rows:[
  { code:"1A",                 rate:"20",   inc:145000 },
  { code:"21",                 rate:"12.5", inc:3250000 },
  { code:"22",                 rate:"12.5", inc:300000 },
  { code:"2A",                 rate:"12.5", inc:1285000 },
  { code:"PTI_STCG20P",        rate:"20",   inc:60000 },
  { code:"PTI_LTCG12_5P112A",  rate:"12.5", inc:120000 },
  { code:"PTI_LTCG12_5P",      rate:"12.5", inc:80000 },
  { code:"5BBH",               rate:"30",   inc:250000 }
]};

/* ======================= 11 · SCHEDULE EI ============================== */
S.ei = {
  interest:80000,            /* 1 interest on tax-free bonds, s.10(15) */
  grossAgri:0, expAgri:0, unabAgri:0,
  land:[],                   /* net agricultural income is nil — no land details required */
  others:[{ cat:"OTH", sub:"10(2A)", desc:"", amt:180000 }],   /* share of profit of the firm */
  dtaa:[],                   /* 4 — non-residents only */
  passThr:200000             /* 5 — the exempt pass-through of Schedule PTI (10(23FD)) */
};

/* ======================= 12 · MAT (115JB) and MAT CREDIT (115JAA) ====== */
S.mat = {
  q1:"1",                    /* P&L prepared under Schedule III of the Companies Act — Yes */
  q2:"1",
  q3:"1",                    /* accounting policies etc. the same as laid before the AGM — Yes */
  pat:10265000,              /* 4 profit after tax as per the P&L */
  add:{ a:2550000,           /* 5a income-tax paid/payable incl. deferred tax */
        c:100000,            /* 5c provision for an unascertained liability */
        f:20000 },           /* 5f expenditure relating to exempt income */
  ded:{ b:260000,            /* 6b income exempt u/s 10 (10(2A) 1,80,000 + 10(15) 80,000) */
        i:300000 },          /* 6i b/f loss or unabsorbed depreciation, whichever is less */
  indas:"N",                 /* financial statements NOT drawn under Ind AS — 8A/8B are nil */
  a8:{}, b8:{},
  ifsc:0,                    /* 9a — no unit in an IFSC */
  matc:{ rows:[
    {ay:"2011-12",gross:"",setoff:""},{ay:"2012-13",gross:"",setoff:""},
    {ay:"2013-14",gross:"",setoff:""},{ay:"2014-15",gross:"",setoff:""},
    {ay:"2015-16",gross:"",setoff:""},{ay:"2016-17",gross:"",setoff:""},
    {ay:"2017-18",gross:"",setoff:""},{ay:"2018-19",gross:"",setoff:""},
    {ay:"2019-20",gross:"",setoff:""},{ay:"2020-21",gross:"",setoff:""},
    {ay:"2021-22",gross:"",setoff:""},{ay:"2022-23",gross:400000,setoff:0},
    {ay:"2023-24",gross:250000,setoff:50000},{ay:"2024-25",gross:"",setoff:""},
    {ay:"2025-26",gross:"",setoff:""}
  ]},
  _seeded:1
};

/* ======================= 13 · FSI · TR · FA ============================ */
S.fa = {
  /* ---------------------------------------------------------------------
     SCHEDULE FSI / TR — now wired LIVE (fa.js defect 4 fixed: the FSI row
     forEach parameter is renamed, so blk() renders and export is unblocked).
     Two foreign countries; column (e)=min(c,d) per head feeds Schedule TR.
     Singapore (65) claims relief u/s 90 (DTAA) -> S.C.fa.dtaa 1,30,000;
     Canada (1) claims relief u/s 91 (no DTAA) -> S.C.fa.notDtaa 30,000;
     total foreign-tax relief 1,60,000 -> Part B-TTI item 6 (S.C.int.relief).
     Row shape (engFa: rw.{hp,bus,cg,os}={b,c,d,art}; rw.{code,tin,sec}). --- */
  fsi:[
    { code:"65", tin:"SG-UEN-201612345K", sec:"90",     /* Singapore — DTAA (s.90) */
      hp :{ b:0,      c:0,      d:0,      art:""   },
      bus:{ b:800000, c:120000, d:200000, art:"7"  },   /* e=min(120000,200000)=120000 */
      cg :{ b:0,      c:0,      d:0,      art:""   },
      os :{ b:100000, c:10000,  d:25000,  art:"11" } }, /* e=min(10000,25000)=10000; country relief 1,30,000 */
    { code:"1", tin:"CA-BN-778899001", sec:"91",         /* Canada — no DTAA (s.91) */
      hp :{ b:0,      c:0,     d:0,     art:"" },
      bus:{ b:200000, c:30000, d:50000, art:"" },        /* e=min(30000,50000)=30000; country relief 30,000 */
      cg :{ b:0,      c:0,     d:0,     art:"" },
      os :{ b:0,      c:0,     d:0,     art:"" } }
  ],
  trFlag:"NO", trAmt:"", trAY:"",
  /* Schedule FA — the calendar year 1 Jan to 31 Dec 2025 */
  a1:[{ code:"65", Bankname:"DBS Bank Limited", AddressOfBank:"12 Marina Boulevard, Singapore",
        ZipCode:"018982", ForeignAccountNumber:"0021234567", OwnerStatus:"OWNER",
        AccOpenDate:"14/07/2018", PeakBalanceDuringYear:4200000, ClosingBalance:3800000,
        IntrstAccured:96000 }],
  a2:[{ code:"2", FinancialInstName:"Charles Schwab & Co.", FinancialInstAddress:"211 Main Street, San Francisco",
        ZipCode:"94105", AccountNumber:"CS-8890123", Status:"OWNER", AccOpenDate:"03/02/2020",
        PeakBalanceDuringPeriod:2600000, ClosingBalance:2400000, NatureOfAmount:"D",
        GrossAmtPaidCredited:54000 }],
  a3:[{ code:"44", NameOfEntity:"Sudhir Industries UK Limited", AddressOfEntity:"5 Fleet Place, London",
        ZipCode:"EC4M7RD", NatureOfEntity:"Private limited company", InterestAcquiringDate:"09/05/2019",
        InitialValOfInvstmnt:3000000, PeakBalanceDuringPeriod:3400000, ClosingBalance:3400000,
        TotGrossAmtPaidCredited:0, TotGrossProceeds:0 }],
  a4:[{ code:"65", FinancialInstName:"Great Eastern Life Assurance", FinancialInstAddress:"1 Pickering Street, Singapore",
        ZipCode:"048659", ContractDate:"22/11/2021", CashValOrSurrenderVal:850000,
        TotGrossAmtPaidCredited:0 }],
  b:[{ code:"44", ZipCode:"EC4M7RD", NatureOfEntity:"Wholly owned subsidiary",
       NameOfEntity:"Sudhir Industries UK Limited", AddressOfEntity:"5 Fleet Place, London",
       NatureOfInt:"DIRECT", DateHeld:"09/05/2019", TotalInvestment:3000000,
       IncFromInt:0, NatureOfInc:"No income during the year", IncTaxAmt:0,
       IncTaxSch:"NI", IncTaxSchNo:"-" }],
  c:[{ code:"65", ZipCode:"189702", AddressOfProperty:"21 Beach Road, #08-02, Singapore",
       Ownership:"DIRECT", DateOfAcq:"18/03/2022", TotalInvestment:9600000,
       IncDrvProperty:0, NatureOfInc:"No income during the year", IncTaxAmt:0,
       IncTaxSch:"NI", IncTaxSchNo:"-" }],
  d:[{ code:"2", ZipCode:"94105", NatureOfAsset:"Listed equity shares held abroad",
       Ownership:"DIRECT", DateOfAcq:"03/02/2020", TotalInvestment:2400000,
       IncDrvAsset:0, NatureOfInc:"No income during the year", IncTaxAmt:0,
       IncTaxSch:"NI", IncTaxSchNo:"-" }],
  e:[{ NameOfInstitution:"HSBC Bank Middle East", AddressOfInstitution:"Downtown, Dubai",
       code:"971", ZipCode:"00000", NameMentionedInAccnt:"Sudhir Industries FZE",
       InstitutionAccountNumber:"AE070331234567890123456", PeakBalanceOrInvestment:1200000,
       IncAccuredTaxFlag:"N", IncAccuredInAcc:0, IncOfferedAmt:0, IncOfferedSch:"NI",
       IncOfferedSchNo:"-" }],
  f:[{ code:"44", ZipCode:"EC4M7RD", NameOfTrust:"Sudhir Family Welfare Trust",
       AddressOfTrust:"5 Fleet Place, London", NameOfOtherTrustees:"Lakshmi Sudhir",
       AddressOfOtherTrustees:"No. 42, 3rd Cross, Richmond Town, Bengaluru",
       NameOfSettlor:"S Sudhir", AddressOfSettlor:"No. 42, 3rd Cross, Richmond Town, Bengaluru",
       NameOfBeneficiaries:"Employees of the UK subsidiary",
       AddressOfBeneficiaries:"5 Fleet Place, London", DateHeld:"01/09/2022",
       IncDrvTaxFlag:"N", IncDrvFromTrust:0, IncOfferedAmt:0, IncOfferedSch:"NI",
       IncOfferedSchNo:"-" }],
  g:[{ code:"65", ZipCode:"018982", NameOfPerson:"Asia Pacific Engineering Pte Ltd",
       AddressOfPerson:"3 Fusionopolis Way, Singapore", IncDerived:100000,
       NatureOfInc:"Interest on a deposit with a bank outside India", IncDrvTaxFlag:"Y",
       IncOfferedAmt:100000, IncOfferedSch:"OS", IncOfferedSchNo:"1b(ii)" }]
};

/* ======================= 14 · SH-1 and AL-1 (unlisted company) ========= */
/* SH-2 and AL-2 are for a DPIIT-recognised start-up only — left empty. */
S.al = {
  sh:{
    sec8:"N", ucFlag:"Y", suGate:"N",
    DtlsSHEndPreviousYearUC:[
      { ShareholderName:"S SUDHIR", ResidentialStatus:"RES", ShareType:"ES", ShareTypeOthers:"",
        PAN:"TVOPS4373C", Aadhaar:"734519826041", AllotmentDate:"05/11/2006",
        NumberOfSharesHeld:1240000, FaceValuePerShare:10, IssuePricePerShare:10, AmountReceived:12400000 },
      { ShareholderName:"LAKSHMI SUDHIR", ResidentialStatus:"RES", ShareType:"ES", ShareTypeOthers:"",
        PAN:"AKPPL2211M", Aadhaar:"612345678901", AllotmentDate:"05/11/2006",
        NumberOfSharesHeld:460000, FaceValuePerShare:10, IssuePricePerShare:10, AmountReceived:4600000 },
      { ShareholderName:"KAVERI CAPITAL LLP", ResidentialStatus:"RES", ShareType:"PS", ShareTypeOthers:"",
        PAN:"AAEFK6677N", Aadhaar:"", AllotmentDate:"12/06/2019",
        NumberOfSharesHeld:300000, FaceValuePerShare:10, IssuePricePerShare:10, AmountReceived:3000000 }
    ],
    DtlsEquityShareEndPrvYr:[
      { ApplicantName:"NANDI GROWTH FUND", ResidentialStatus:"RES", ShareType:"ES", ShareTypeOthers:"",
        PAN:"AABTN5544Q", Aadhaar:"", ApplicationDate:"20/03/2026",
        NumberOfSharesApplied:50000, ApplicationMoneyReceived:2500000,
        FaceValuePerShare:10, ProposedIssuePrice:50 }
    ],
    SHDtlsAnyTimePrevYearUC:[
      { ShareholderName:"RAVI PRAKASH", ResidentialStatus:"RES", ShareType:"ES",
        PAN:"AGJPR7766T", Aadhaar:"701234567892",
        NumberOfSharesHeld:100000, FaceValuePerShare:10, IssuePricePerShare:10, AmountReceived:1000000,
        AllotmentDate:"15/07/2016", CeaseShareholderDate:"28/08/2025", CessationMode:"TS",
        NewShareholderPAN:"TVOPS4373C", NewShareholderAadhaar:"734519826041" }
    ],
    DtlsSHEndPreviousYearSU:[], DtlsShareAppMoneyAlltEndPrvYr:[], SHDtlsAnyTimePrevYearSU:[]
  },
  al1:{
    flag:"Y",
    DtlsBldLandResHouseUC:[
      { Address:"No. 42, 3rd Cross, Richmond Town, Bengaluru", PinCode:560025,
        AcquisitionDate:"12/04/2019", AcquisitionCost:24000000, Purpose:"RE" }
    ],
    DtlsBldLandNotResHouseUC:[
      { Address:"Plot 18, KIADB Industrial Area, Narasapura, Kolar", PinCode:563133,
        AcquisitionDate:"08/08/2012", AcquisitionCost:18000000, Purpose:"FA" }
    ],
    DtlsListedEquitySharesUC:[
      { OpenBalNumberOfShares:40000, OpenBalShareType:"ES", OpenBalAcquisitionCost:4200000,
        ShrsAcqNumberOfShares:0, ShrsAcqShareType:"ES", ShrsAcqAcquisitionCost:0,
        ShrsTrsNumberOfShares:15000, ShrsTrsShareType:"ES", ShrsTrsSaleConsdr:3500000,
        ClBalNumberOfShares:25000, ClBalShareType:"ES", ClBalAcquisitionCost:2400000 }
    ],
    DtlsUnListedEquitySharesUC:[
      { CompanyName:"Sudhir Components Private Limited", PAN:"AAECS1122F",
        OpenBalNumberOfShares:100000, OpenBalAcquisitionCost:1000000,
        ShrsAcqNumberOfShares:0, SubscriptionPurchaseDate:"", FaceValuePerShare:10,
        IssuePricePerShare:0, PurchasePricePerShare:0,
        ShrsTrsNumberOfShares:0, SaleConsideration:0,
        ClBalNumberOfShares:100000, ClBalAcquisitionCost:1000000 }
    ],
    DtlsOtherSecuritiesUC:[
      { SecuritiesType:"B", SecuritiesTypeOthers:"", ListedUnlistedFlag:"L",
        OpenBalNumberOfSecurities:500, OpenBalAcquisitionCost:5000000,
        ShrsAcqNumberOfSecurities:80, SubscriptionPurchaseDate:"15/01/2026",
        FaceValuePerShare:10000, IssuePriceSecurity:10000, PurchasePricePerSecurity:0,
        ShrsTrsNumberOfSecurities:0, SaleConsideration:0,
        ClBalNumberOfSecurities:580, ClBalAcquisitionCost:5800000 }
    ],
    DtlsCapitalContributionOthEntityUC:[
      { EntityName:"Sudhir & Associates", PAN:"AAJFS7788L", OpeningBalance:1400000,
        AmtContributedDrgTheYr:0, AmtWithdrawnDrgTheYr:180000,
        AmtprofitLossDividend:280000, ClosingBalance:1500000 }
    ],
    DtlsLoansAdvancesUC:[
      { PersonName:"Sudhir Logistics Private Limited", PAN:"AAFCS3344G", OpeningBalance:2000000,
        AmountReceived:500000, AmountPaid:0, InterestCredited:180000,
        ClosingBalance:1680000, InterestRate:9 }
    ],
    DtlsVehiclestransportUC:[
      { AssetParticulars:"M", AssetParticularsOthers:"", RegNumVehicle:"KA01MJ4373",
        AcquisitionCost:4200000, AcquisitionDate:"20/09/2023", Purpose:"DU" }
    ],
    DtlsJewelleryArchCollectionsUC:[
      { AssetParticulars:"PA", AssetParticularsOthers:"", Quantity:4, AcquisitionCost:600000,
        AcquisitionDate:"11/02/2021", Purpose:"IN" }
    ],
    DtlsLiabilitiesUC:[
      { PersonName:"S SUDHIR", PAN:"TVOPS4373C", OpeningBalance:5000000,
        AmountReceived:1000000, AmountPaid:2000000, InterestCredited:420000,
        ClosingBalance:4420000, InterestRate:9 }
    ]
  },
  al2:{ flag:"N",
    DtlsBldLandResHouseSU:[], DtlsBldLandNotResHouseSU:[], DtlsLoansAdvancesSU:[],
    DtlsCapitalContributionSU:[], DtlsAcqustSharesSecuritiesSU:[], DtlsVehiclestransportSU:[],
    DtlsJewelleryAcquiredSU:[], DtlsArchaeologicalCollctSU:[], DtlsLiabilitiesSU:[] }
};

/* ======================= 15 · IF · PTI · GST (and the schedules that
   this client cannot use: TPSA, 115TD, FD) ============================== */
S.other = {
  if:[
    { name:"Sudhir & Associates", ftype:"Partnership Firm", pan:"AAJFS7788L",
      audit:"Yes", sec92e:"No", pct:25, profit:180000, interest:120000, capbal:1500000 }
  ],
  pti:[
    { kind:"Section 115UA", name:"Embassy Office Parks REIT", pan:"AABCE1234F",
      hp     :{ inc:150000, loss:0, tds:15000 },
      st111a :{ inc:60000,  loss:0, tds:0 },
      stOth  :{ inc:40000,  loss:0, tds:0 },
      lt112a :{ inc:120000, loss:0, tds:0 },
      ltOth  :{ inc:80000,  loss:0, tds:0 },
      osDiv  :{ inc:0, tds:0 },
      osOth  :{ inc:0, tds:0 },
      ex23fbb:{ inc:0, tds:0 },
      exBcode:"10(23FD)", exB:{ inc:200000, tds:0 },
      exCcode:"",         exC:{ inc:0, tds:0 } }
  ],
  /* Schedule TPSA — no transfer-pricing primary adjustment; the company is
     not liable u/s 92E, so section 92CE(2A) cannot arise. */
  tpsa:{ adj:"", challans:[] },
  /* Schedule 115TD — accreted income on the conversion of a trust; a company
     registered u/s 12AA/10(23C) only. Not applicable to this company. */
  td:{ fmv:"", liab:"", fmv4i:"", fmv4ii:"", fmv4iii:"", liab4:"",
       addtax:"", interest:"", specdate:"", challans:[] },
  gst:[
    { gstin:"29TVOPS4373C1ZK", amt:55000000 },
    { gstin:"18TVOPS4373C1ZJ", amt:7000000 }
  ],
  /* Schedule FD — foreign-currency receipts/payments of a NON-audit filer.
     This company is audited u/s 44AB, so Schedule FD does not apply. */
  fd:{ payCap:"", payRev:"", rcptCap:"", rcptRev:"" }
};

/* ======================= 16 · TAXES PAID (IT · TDS · TCS) ============== */
S.paid = {
  /* Schedule TDS1 (15B1, Form 16A) -> schema ScheduleTDS2 */
  tds2:[
    { who:"S", tan:"BLRD12345E", sec:"194",   yr:"", bf:0, dedOwn:120000, dedOthInc:0, dedOthTds:0,
      claimOwn:120000, claimOthInc:0, claimOthTds:0, claimOthPan:"", claimOthAadh:"",
      gross:1200000, head:"OS" },
    { who:"S", tan:"MUMR09876F", sec:"94A",   yr:"", bf:0, dedOwn:45000, dedOthInc:0, dedOthTds:0,
      claimOwn:45000, claimOthInc:0, claimOthTds:0, claimOthPan:"", claimOthAadh:"",
      gross:450000, head:"OS" },
    { who:"S", tan:"BLRC55555G", sec:"94C",   yr:"", bf:0, dedOwn:60000, dedOthInc:0, dedOthTds:0,
      claimOwn:60000, claimOthInc:0, claimOthTds:0, claimOthPan:"", claimOthAadh:"",
      gross:3000000, head:"BP" },
    { who:"S", tan:"DELH11111H", sec:"4-IB",  yr:"2024", bf:25000, dedOwn:0, dedOthInc:0, dedOthTds:0,
      claimOwn:25000, claimOthInc:0, claimOthTds:0, claimOthPan:"", claimOthAadh:"",
      gross:240000, head:"HP" }
  ],
  /* Schedule TDS2 (15B2, Form 16B) -> schema ScheduleTDS3 — buyer with a PAN */
  tds3:[
    { who:"S", pan:"AABCG7788C", aadh:"", sec:"4IA", yr:"", bf:0, dedOwn:90000, dedOthInc:0, dedOthTds:0,
      claimOwn:90000, claimOthInc:0, claimOthTds:0, claimOthPan:"", claimOthAadh:"",
      gross:9000000, head:"CG" }
  ],
  /* Schedule TCS (15C, Form 27D) */
  tcs:[
    { who:"S", tan:"BLRT77777J", othPan:"", yr:"", bf:0, collOwn:15000, collOth:0,
      claimOwn:15000, claimOth:0, claimOthPan:"" }
  ],
  /* Schedule IT (15A) — four advance-tax challans and one self-assessment challan */
  it:[
    { bsr:"0510308", dt:"15/06/2025", sn:"00121", amt:310000 },
    { bsr:"0510308", dt:"15/09/2025", sn:"00337", amt:600000 },
    { bsr:"0510308", dt:"15/12/2025", sn:"00519", amt:940000 },
    { bsr:"0510308", dt:"14/03/2026", sn:"00742", amt:500000 },
    { bsr:"0510308", dt:"12/10/2026", sn:"00981", amt:170000 }   /* self-assessment tax */
  ]
};

/* ======================= 17 · BANK ACCOUNTS AND VERIFICATION =========== */
S.bank = [
  { ifsc:"SBIN0040011", bank:"State Bank of India", acno:"30412345678", type:"CA", refund:"Y" },
  { ifsc:"HDFC0000123", bank:"HDFC Bank Limited",   acno:"50200012345678", type:"CC", refund:"N" }
];
S.fbank = [];              /* a resident company takes its refund in India */
S.ver = {
  bankFlag:"Y",
  nacc:2,
  assetOut:"YES",          /* Schedule FA is filled */
  name:"S SUDHIR",
  father:"SUDHIR NARAYANAN",
  pan:"TVOPS4373C",
  cap:"MD",                /* Managing Director */
  place:"Bengaluru",
  date:"15/10/2026"
};
