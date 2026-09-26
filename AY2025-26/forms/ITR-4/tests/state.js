/* ============================================================================
   S SUDHIR · PAN TVOPS4373C · A.Y. 2025-26 — the complete ITR-4 (Sugam) test return
   OLD regime (S.fs.optout="Yes") so every Chapter VI-A deduction, HRA 10(13A) and
   self-occupied 24(b) interest is open and exercised.
   Constant identity from PIPELINE.md; lawful amounts; total income ≤ ₹50L.
   Namespaces are exactly those the ITR-4 engines read (forms/ITR-4/src/70_sec_*.js):
     S.pi / S.fs         — inccore identity + filing/regime
     S.ic.*              — inccore income (salary, presumptive BP, HP, OS, LTCG112A, exempt, Part D inputs)
     S.ded.*             — Chapter VI-A + HRA schedule
     S.paid.* / S.bank / S.ver / S.trp — taxes paid, bank, verification, TRP
   ============================================================================ */

/* ---------------- Part A — General : identity (who) ---------------- */
/* NB: engine bug — S.pi.res is overloaded as BOTH the address "Flat/Door/Block No."
   (exported to PersonalInfo.Address.ResidenceNo) AND the residential-status select
   (RES/NRI/NOR; drives 87A and the ded engine's non-resident bar). Must be "RES" for
   the person to be a Resident and keep 80DD/80DDB/80U; that makes Address.ResidenceNo
   export as "RES". Logged in phase7_bugs.md (inccore). */
S.pi = {
  status:"I", res:"RES", resName:"Brigade Gardens", road:"3rd Cross, Richmond Town",
  locality:"Richmond Town", city:"Bengaluru", state:"15", pin:"560025", country:"91",
  first:"S", mid:"", last:"SUDHIR", pan:"TVOPS4373C", aadhaar:"734519826041",
  dob:"05/11/2006", empcat:"CGOV",
  mobile:"9845012345", mobcc:"91", std:"080", phone:"25551234",
  email:"s.sudhir.test@example.in", emailSec:"sudhir.alt@example.in",
  secAdd:"Y"
};

/* ---------------- Return & regime / filing (ret) ---------------- */
S.fs = {
  optout:"Yes",                 /* OLD regime — opts out of 115BAC(1A) via Form 10-IEA */
  sec:11,                       /* 139(1) — on or before due date */
  f10ieaEarlier:"N",
  f10ieaDateCur:"25/07/2025", f10ieaAckCur:"123456789012345",
  duedate:"2025-07-31", filed:"28/07/2025",
  seventh:"N", rep:"N", clause7:[]
};

/* ---------------- Income (inc) — S.ic namespace ---------------- */
S.ic = S.ic || {};

/* Salary (B1) — one private employer; HRA 10(13A) + LTC 10(5) exempt; PT 16(iii) */
S.ic.sal = {
  s17_1:800000, s17_2:50000, s17_3:0,
  alw:[ {nat:"10(13A)", amt:120000},      /* HRA — least of A/B/C, matches ScheduleEA below */
        {nat:"10(5)",   amt:20000} ],     /* leave travel concession */
  ent:0,                                   /* 16(ii) entertainment allowance — govt-only, not claimed */
  ptax:2500                                /* 16(iii) professional tax (Karnataka) */
};

/* Presumptive business / profession (Schedule BP → B1 E8) */
S.ic.bp = {
  /* 44AD business — turnover within the ₹3 cr cap (cash 3.4% ≤ 5%) */
  nad:[ {name:"Sudhir Traders", code:"09028", desc:"Wholesale trading"} ],
  ad:{ bank:2800000, cash:100000, other:0, claim6:0, claim8:0 },
  /* 44ADA profession — gross receipts ₹12L within the ₹50L cap; 50% deemed */
  nada:[ {name:"Sudhir Consulting", code:"16003", desc:"Management consultancy"} ],
  ada:{ bank:1000000, cash:200000, other:0, claim:0 },
  /* 44AE goods carriage — one owned heavy vehicle (15 MT), 12 months */
  nae:[ {name:"Sudhir Logistics", code:"11008", desc:"Freight transport by road"} ],
  gcv:[ {reg:"KA01AB1234", flag:"OWN", tonnage:15, months:12, pi:180000} ],  /* ₹1000/MT/mo × 15 × 12 */
  ae:{ salint:0 },
  gstn:[ {gstin:"29ABCDE1234F1Z5", amt:2900000} ],
  fin:{ creditors:200000, inventories:300000, debtors:150000, bank:400000, cash:50000 }
};

/* House property (IncomeDeductions.PropertyDetails) — one let-out, one self-occupied */
S.ic.hp = [
  { addr:"No. 42, 3rd Cross, Richmond Town", city:"Bengaluru", state:"15", pin:"560025", country:"91",
    owner:"SE", let:"L", co:"NO", share:100,
    tenant:[ {name:"Rohan Mehta", pan:"BQAPM7788N", aadhaar:"501234567890", pantan:"BQAPM7788N"} ],
    gross:360000, notReal:0, localTax:40000, arrears:0,
    loans:[ {from:"B", name:"HDFC Bank", accno:"HL77812345", date:"20/07/2021", total:4500000, outst:3900000, intr:200000} ] },
  { addr:"Flat 7B, Prestige Lakeside, Whitefield", city:"Bengaluru", state:"15", pin:"560066", country:"91",
    owner:"SE", let:"S", co:"NO", share:100,
    gross:0, notReal:0, localTax:0, arrears:0,
    loans:[ {from:"B", name:"State Bank of India", accno:"HL3391120044", date:"12/04/2019", total:8000000, outst:5200000, intr:200000} ] }
];

/* Other sources (B4) — savings/FD/refund interest, dividend (quarter split), family pension */
S.ic.os = {
  rows:[
    {nat:"SAV", amt:12000},
    {nat:"IFD", amt:60000},
    {nat:"TAX", amt:2000},
    {nat:"DIV", q1:10000, q2:10000, q3:10000, q4:10000, q5:0},   /* dividend 40,000 across periods */
    {nat:"FAP", amt:60000}                                        /* family pension */
  ],
  fp57:15000                                                       /* 57(iia) — lower of ⅓ FP or 15,000 */
};

/* LTCG u/s 112A not chargeable (D20a) — gain ≤ ₹1.25L, reported not taxed */
S.ic.ltcg = { sale:300000, cost:200000 };

/* Exempt income for reporting (D20) — agricultural ≤ ₹5,000 keeps ITR-4 eligibility */
S.ic.exmp = [
  {cat:"AGRI", sub:"10(1)", desc:"Agricultural income", amt:4000},
  {cat:"SRPC", sub:"10(11)", desc:"Statutory provident fund received", amt:50000}
];

/* Part D inputs — relief 89 / interest 234A-C / fees (return on time, taxes paid → all 0) */
S.ic.d = { relief89:0, int234a:0, int234b:0, int234c:0, fee234f:0, fee234i:0 };

/* ---------------- Deductions — Chapter VI-A + HRA (ded) ---------------- */
S.ded = {
  v:{ c80ccd1:40000, c80ccd1b:50000, c80ccd2:50000, c80ddb:40000, ddb_type:"1", ddb_disease:"k",
      c80tta:10000, c80cch:50000, pran:"110012345678" },
  /* 80C item table — ₹90,000 (with 80CCC 20,000 + 80CCD(1) 40,000 = ₹1,50,000 at the cap) */
  c80c:[ {amt:90000, id:"PPF-BLR-0011223"} ],
  pen80ccc:[ {type:"OTHPRAN", id:"LIC Jeevan Akshay 4455", amt:20000} ],
  /* 80D — self/family (non-senior) + parents (senior) */
  d80:{ selfSr:"N", parSr:"Y",
        selfIns:[ {insurer:"Star Health", policy:"P/700001/01/2026/001234", amt:22000} ], selfPHC:4000,
        parSrIns:[ {insurer:"New India Assurance", policy:"NIA-MED-556677", amt:45000} ], parSrPHC:3000, parSrMed:0 },
  /* 80DD — a dependant with disability (fixed ₹75,000) */
  dd80:{ nature:"1", type:"1", amt:75000, dep:"2", pan:"CQKPS1234D", aadhaar:"890123456789",
         f10ack:"456789012345678", udid:"KA0412345678901234" },
  /* 80U — self with severe disability (fixed ₹75,000) */
  u80:{ nature:"1", type:"2", amt:75000, ack:"654321098765432", udid:"KA0498765432109876" },
  /* 80E / 80EEA / 80EEB loans (80EE omitted — mutually exclusive with 80EEA claimed here) */
  e80:{ e:[ {from:"B", name:"Canara Bank", acno:"EDU-2019-04455", dt:"05/07/2019", amt:2000000, os:1400000, interest:80000} ],
        ee:[],
        eea:[ {from:"B", name:"HDFC Bank", acno:"HL-EEA-2020", dt:"12/06/2020", amt:3500000, os:2600000, interest:100000} ],
        eeb:[ {from:"B", name:"Kotak Mahindra Bank", acno:"EV-2020-778", reg:"KA01MJ4521", dt:"22/12/2020", amt:1400000, os:700000, interest:80000} ],
        eeaSdv:4000000 },
  /* 80G — donations across buckets A / B / D (all non-cash) */
  g80:[ {bucket:"A", name:"Prime Minister's National Relief Fund", addr:"South Block", city:"New Delhi", state:"09", pin:"110011", pan:"AAAGP1234A", cash:0, other:50000, ref:"NEFT-PMNRF-2025-0917", ifsc:"SBIN0000691", amt:50000},
        {bucket:"B", name:"Jawaharlal Nehru Memorial Fund", addr:"Teen Murti", city:"New Delhi", state:"09", pin:"110011", pan:"AAATJ0012B", cash:0, other:60000, ref:"NEFT-JNMF-2025", ifsc:"SBIN0000691", amt:60000},
        {bucket:"D", name:"Akshaya Patra Foundation", addr:"HK Hill, Rajajinagar", city:"Bengaluru", state:"15", pin:"560010", pan:"AAATT6624F", arn:"AAATT6624F24BLR1", cash:0, other:40000, ref:"UPI-akshaya-778812", ifsc:"HDFC0000523", amt:40000} ],
  /* 80GGC — contribution to a political party (non-cash) */
  ggc:[ {dt:"11/10/2024", name:"Bharatiya Janata Party", pan:"AAABI0067L", mode:"OTH", ref:"NEFT-9988776655", ifsc:"SBIN0000691", amt:25000} ],
  /* Schedule EA 10(13A) — HRA helper (non-metro → 40% of salary) */
  hra:{ place:"2", hraRecv:120000, rent:240000, basic:600000, da:0 }
};

/* ---------------- Taxes paid (paid) ---------------- */
S.paid = {
  tds1:[ {tan:"BLRG09999C", name:"Sudhir Employer Pvt Ltd", inc:632500, tds:20000} ],
  tds2:[ {tan:"MUMB12345D", sec:"94A", bf:0, ded:6000, claim:6000, gross:60000, head:"OS"} ],
  tds3:[ {pan:"BQAPM7788N", aadh:"501234567890", sec:"4-IB", bf:0, ded:3600, claim:3600, gross:360000, head:"HP"} ],
  tcs:[ {tan:"BLRC44444J", name:"Auto Dealer Ltd", paid26:5000, coll:5000, claim:5000} ],
  it:[ {bsr:"0510308", dt:"14/03/2025", sn:"63", amt:5000},   /* advance tax (≤ 31/03/2025) */
       {bsr:"0510308", dt:"25/07/2025", sn:"70", amt:2000} ]  /* self-assessment tax (≥ 01/04/2025) */
};

/* ---------------- Bank & verification (bank) ---------------- */
S.bank = [
  {ifsc:"SBIN0040011", bank:"State Bank of India", acno:"30412345678", type:"SB", refund:"Y"},
  {ifsc:"HDFC0000523", bank:"HDFC Bank", acno:"50100987654321", type:"SB", refund:"N"}
];
S.ver = {cap:"S", name:"S SUDHIR", father:"S SUBRAMANIAM", pan:"TVOPS4373C", place:"Bengaluru"};
S.trp = {id:"TRP0012345", name:"Ramesh Iyer", reimb:0};
