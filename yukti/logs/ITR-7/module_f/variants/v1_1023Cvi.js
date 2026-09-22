/* ==========================================================================
   SUDHIR MEMORIAL CHARITABLE TRUST · AAATS4373C · A.Y. 2026-27
   The complete ITR-7 test return (Phase 7) — a lawful trust filing, to the rupee.

   THE CLIENT: a resident public charitable trust, registered u/s 12AB and
   running educational and medical-relief objects, filing its return u/s
   139(4A) and claiming exemption u/s 11 (the ordinary application regime).
   It is audited u/s 12A(1)(b) (Form 10B), so its section-139(1) due date is
   31 October 2026; it files on 15 October 2026 — on time.

   Constant test identity (PIPELINE.md) carried to a trust: the natural person
   S SUDHIR (PAN TVOPS4373C, father SUDHIR NARAYANAN) is the Managing Trustee
   who verifies the return; the constant address (No. 42, 3rd Cross, Richmond
   Town, Bengaluru 560025, Karnataka) and the constant bank account
   (SBIN0040011 / 30412345678) are the trust's. The entity's own PAN
   AAATS4373C carries the "T" (Trust) fourth letter and the constant 4373C tail.

   The return is deliberately kept OFF the two known V0.1 schema gaps: no
   nature-of-business code is used (Schedule OA answered "No business income",
   so none of the six enum-less codes can arise), and every TDS row uses a
   section code (194A) inside the 54-member TDSSection enum.

   -------------------------------------------------------------------------
   HAND COMPUTATION (see tests/ITR-7/figures.json for the full trail):
     Voluntary contributions (Sch VC): corpus 20,00,000 (exempt capital) +
       other-than-corpus 55,00,000 (CSR grants 10,00,000 + other donations
       45,00,000, of which 5,00,000 anonymous) = total 75,00,000.
       Anonymous 5,00,000: floor Dii = 5% of (75L+5L) = 4,00,000; Diii charge-
       able u/s 115BBC @30% = 1,00,000; E (within floor) 4,00,000.
     Aggregate income (Sch AI): main-object receipts 30,00,000 + rent
       5,00,000 + interest 5,00,000 = 40,00,000.
     Income eligible for s.11 application = other-than-corpus VC 55,00,000 +
       Sch AI 40,00,000 − 115BBC anon 1,00,000 = 94,00,000.
     Schedule A application allowed (row G) 73,00,000 (educational 60,00,000
       + medical 13,00,000). 15% standard accumulation u/s 11(1)(a) =
       min(14,10,000, 21,00,000) = 14,10,000. Total deductions 87,10,000.
       Residual (ordinary) income 6,90,000; add back the 115BBC anonymous
       donation 1,00,000 → GROSS INCOME AFTER EXEMPTION 7,90,000.
     No income "not forming part of the application" (HP/BP/CG/OS all nil) and
       no current-year loss (Schedule CYLA nil) → TOTAL INCOME 7,90,000.
     PART B-TTI: of the 7,90,000, the 1,00,000 anonymous donation is taxed
       @30% (u/s 115BBC) = 30,000; the balance 6,90,000 at the AOP/trust slab
       (12,500 + 20% of 1,90,000) = 50,500. Tax on total income 80,500.
       Cess @4% = 3,220. GROSS TAX LIABILITY 83,720. No surcharge (TI < 50L),
       no s.90/91 relief. NET TAX LIABILITY 83,720.
       Interest: 234A nil (filed 15/10/2026, before 31/10/2026); 234B nil
       (advance tax 40,000 >= 90% of assessed 33,720); 234C nil (each
       instalment met). Taxes paid 90,000 (advance tax 40,000 + TDS 50,000).
       REFUND = 90,000 − 83,720 = 6,280 (rounded to the nearest ten, s.288B).
   ========================================================================== */

/* ======================= 1 · WHO IS FILING (Part A-General) ============= */
Object.assign(S.who, {
  status:"5",                              /* AOP/BOI — the ITR-7 status for a trust */
  substatus:"",
  name:"SUDHIR MEMORIAL CHARITABLE TRUST",
  pan:"AAATS4373C",                        /* fourth letter T = Trust */
  doi:"05/11/2006",                        /* date of creation of the trust = constant date */
  addr1:"No. 42, 3rd Cross", premises:"Sudhir Bhavan", road:"Richmond Road",
  locality:"Richmond Town", city:"Bengaluru",
  country:"91", state:"15", pin:"560025",
  std:"080", phone:"25551234",
  mobileCc:"91", mobile:"9845012345", mobile2Cc:"91", mobile2:"9845067890",
  email:"s.sudhir.test@example.in", email2:"accounts.sudhir@example.in",
  addr2same:"Y",
  /* A18 — the trust runs one educational and one medical institution */
  projFlg:"Y",
  proj:[
    {name:"Sudhir Vidya Kendra (school)", nature:"CHARITABLERELIGIOUS", cls:"iB"},
    {name:"Sudhir Arogya Clinic",         nature:"CHARITABLERELIGIOUS", cls:"iC"}
  ],
  /* A19 — registration u/s 12AB (the exemption in this return rests on it) */
  reg:[
    {regsec:"VI", exclaim:"true", regdate:"28/09/2021", urn:"AAATS4373CF20211",
     auth:"CIT(E), Bengaluru", effdate:"01/04/2021"},
    {regsec:"X", exclaim:"false", regdate:"28/09/2021", urn:"AAATS4373CF20219",
     auth:"CIT(E), Bengaluru", effdate:"01/04/2021"}
  ],
  regothFlg:"N",
  sec:"11",                                /* A21 — return filed u/s 139(1), on time */
  retfurn:"139-4A",                        /* A17 i — furnished u/s 139(4A) (s.11/12 trust) */
  exsec:"11",                              /* A17 ii — exemption claimed u/s 11 */
  resStatus:"RES",
  claim90:"NO",
  repFlg:"N",
  partnerFlg:"N",
  lei:"", leiValid:"",
  unlistedFlg:"N"
});

/* Part A-General 2 · A23-A29 (OtherDetailsFor7 + audit) */
Object.assign(S.g2, {
  aud44:"Y",                               /* A27 — liable to audit under the Income-tax Act */
  aud:{ sec:"12A(1)(b)", flag:"Y",
        frmName:"Rao & Rao, Chartered Accountants", frmPAN:"AAAFR5566K",
        date:"12/09/2026", ack:"482910375612" },
  othact:"N"
});
Object.assign(S.g2.od, {
  charPurpose:"N",                         /* A23 — education/medical, not general public utility */
  act2_15:"N", rend2_15:"N",
  change:"N",
  firstRet:"N",                            /* A25 */
  prov1310:"N"                             /* A26 — 22nd proviso / 13(10) NOT applicable */
});

/* ======================= 2 · SCHEDULE VC · AI ========================== */
/* Voluntary contributions (Schedule VC) and the aggregate of income derived
   during the year excluding voluntary contributions (Schedule AI). */
Object.assign(S.vc, {
  corpus80G2b:"", corpusOther:2000000,     /* Aib — corpus donation 20,00,000 (exempt capital) */
  grantsGovt:"", grantsCSR:1000000,        /* Aiib — CSR grants 10,00,000 */
  otherGrants:"", otherDon:4500000,        /* Aiid — other donations 45,00,000 (incl. 5,00,000 anonymous) */
  fCorpus80G2b:"", fCorpusOther:"", fOther:"", fPurpose:"",
  anonAgg:500000,                          /* Di — anonymous donations 5,00,000 */
  /* Schedule AI — operating receipts (donations stay in Schedule VC) */
  recMain:3000000,                         /* 1 — receipts from the main objects (fees) 30,00,000 */
  recIncid:"", rent:500000,                /* 3 — rent 5,00,000 */
  comm:"", div:"", interest:500000,        /* 6 — interest on deposits 5,00,000 */
  agri:"", netConsid:"", pti:"",
  aiOthers:[]
});

/* ======================= 3 · SCHEDULE A · I (application & accumulation) */
/* Amount applied to the stated objects (Schedule A), 73,00,000 all revenue:
   educational 60,00,000 + medical relief 13,00,000. The 85%-application ladder
   is computed by the `app` engine and carried to Part B-TI. Schedule I records
   an earlier-year accumulation u/s 11(2) still held and invested in 11(5)
   modes (no income deemed u/s 11(3) this year). */
S.app = {
  a:{ educational:{rev:6000000, cap:0}, medical:{rev:1300000, cap:0} },
  b:{}, c:{}, g:{},
  cOthers:[],
  iRows:[
    { year:"2021", acc:1000000, purpose:"Construction of a school building",
      applPY:400000, txd:0, appl8:200000, appl9:0, cred10:0,
      inv12:400000, inv13:0, notUtil14:0 }
  ],
  iaRows:[], dRows:[], daRows:[]
};

/* ======================= 4 · BALANCE SHEET · SCHEDULE J · R ============= */
/* Part A-BS foots to 90,00,000 on both halves. Schedule J reconciles the
   closing corpus (Other corpus 50,00,000 + Corpus other than 30,00,000) to
   the three corpus lines of the Balance Sheet (Schedule R ties). */
S.funds = {
  bs:{
    SourcesOfFund:{
      OwnFund:{ Corpus80G:0, OtherCorpus:5000000, AccumulatedInc:3000000,
                AccumulatedIncUS10_11:0, BalDeemedInc:0, OtherReserve:[] },
      LongTermBorrowings:{ SecuredLoan:0, UnSecuredLoan:1000000 },
      Advances:0
    },
    ApplicationOfFunds:{
      FixedAsset:{ GrossBlock:6000000, Depreciation:1000000 },
      Investements:2500000,
      CurrentAssetsLoanAdv:{
        CurrentAssets:{ Inventory:0, SundryDebtor:0,
          CashNCashEquivalents:{ BalWithBanks:2000000, CashInHand:100000, Others:0 },
          OtherCurrAssets:0 },
        LoansandAdvances:0,
        CurrLiabilitiesProviosions:{
          CurrLiability:{ SundryCreditor:500000, OtherPayable:100000 },
          Provisions:0 }
      },
      AccBalAnyOthRes:0,
      OutOf5InvModesUS11_5:2500000, OutOf5InvModesOthUS11_5:0
    }
  },
  j:{
    a1:[
      { CorpusDonation:"OTIA",  OpeningBlc:5000000, ReceivedCorpus:0, AppliedPY:0,
        AmtDepositedBack:0, TotAmtDepositedBack:0, Investment_11_5:5000000, AmtTxdAssYr22_23:0 },
      { CorpusDonation:"OTHER", OpeningBlc:3000000, ReceivedCorpus:0, AppliedPY:0,
        AmtDepositedBack:0, TotAmtDepositedBack:0, Investment_11_5:3000000, AmtTxdAssYr22_23:0 }
    ],
    a2:[], us11:[], us13:[], other:[], vc:[]
  },
  r:{ ReasonsOfDiff:{ PurchFixedAsset:{}, Depreciation:{}, AnyOthReason:{} } }
};

/* ======================= 5 · TAXES PAID (IT · TDS) ===================== */
/* Advance tax 40,000 (four instalments, each meeting the 234C threshold) and
   TDS 50,000 (194A, on the 5,00,000 interest offered under Schedule AI). */
S.paid = {
  tds2:[
    { who:"S", tan:"BLRD12345E", sec:"94A", yr:"", bf:0,
      dedOwn:50000, dedOthInc:0, dedOthTds:0,
      claimOwn:50000, claimOthInc:0, claimOthTds:0, claimOthPan:"", claimOthAadh:"",
      gross:500000, head:"AI" }
  ],
  tds3:[], tcs:[],
  it:[
    { bsr:"0510308", dt:"15/06/2025", sn:"00121", amt:7000 },
    { bsr:"0510308", dt:"15/09/2025", sn:"00337", amt:13000 },
    { bsr:"0510308", dt:"15/12/2025", sn:"00519", amt:12000 },
    { bsr:"0510308", dt:"15/03/2026", sn:"00742", amt:8000 }
  ]
};

/* ======================= 6 · PART B — DATE OF FILING =================== */
S.tax = { filed:"15/10/2026" };            /* on or before the 31/10/2026 audit-case due date */

/* ======================= 7 · BANK, REFUND & VERIFICATION ============== */
S.bank = [
  { ifsc:"SBIN0040011", bank:"State Bank of India", acno:"30412345678", type:"SB", refund:"Y" }
];
S.fbank = [];                              /* a resident trust takes its refund in India */
Object.assign(S.ver, {
  bankFlag:"Y",
  nacc:1,
  assetOut:"NO",                           /* no asset held outside India — Schedule FA not filed */
  name:"S SUDHIR",
  father:"SUDHIR NARAYANAN",
  pan:"TVOPS4373C",                        /* the Managing Trustee's own PAN */
  cap:"PO",                                /* Principal Officer (Managing Trustee) */
  place:"Bengaluru",
  date:"15/10/2026"
});
/* --- LENS3 B1b delta: 10(23C)(vi) education institution --- */
Object.assign(S.who,{ exsec:"23CVI", retfurn:"139-4C",
  reg:[{regsec:"IV", exclaim:"true", regdate:"28/09/2021", urn:"AAATS4373CF20211", auth:"CIT(E), Bengaluru", effdate:"01/04/2021"},
       {regsec:"X", exclaim:"false", regdate:"28/09/2021", urn:"AAATS4373CF20219", auth:"CIT(E), Bengaluru", effdate:"01/04/2021"}] });
