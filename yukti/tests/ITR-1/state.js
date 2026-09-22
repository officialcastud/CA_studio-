/* ==========================================================================
   S SUDHIR · TVOPS4373C · A.Y. 2026-27
   The complete ITR-1 test return (Phase 7) — a lawful Sahaj filing, to the rupee.

   THE CLIENT: a RESIDENT INDIVIDUAL, aged 40 (born 15/06/1985, so not a senior
   citizen), a salaried employee of a non-Government employer, who has opted OUT
   of the new tax regime and files under the OLD regime u/s 115BAC(6) — so the
   Chapter VI-A deductions and the self-occupied 24(b) interest are live. He
   files u/s 139(1) [code 11] on 25/07/2026, before the 31/07/2026 due date, so
   no 234A interest and no 234F fee arise.

   Constant test identity (carried from PIPELINE.md): the natural person
   S SUDHIR (father SUDHIR NARAYANAN), constant address (No. 42, 3rd Cross,
   Richmond Town, Bengaluru 560025, Karnataka) and the constant bank account
   (SBIN0040011 / 30412345678). The individual PAN TVOPS4373C carries the "P"
   fourth letter (individual) and the constant 4373C tail.

   The return exercises the OLD-regime deduction ladder and the house-property
   loss set-off:
     · gross salary 12,00,000 (17(1)); std deduction 16(ia) 50,000 (old).
     · ONE self-occupied house with 24(b) interest 1,80,000 (within the 2L
       self-occupied ceiling) — a house-property LOSS of 1,80,000 set off
       against salary (within the 2,00,000 set-off ceiling).
     · savings-bank interest 15,000 (other sources).
     · 80C 1,50,000 (LIC/PPF) and 80D 25,000 (self, non-senior).
     · TDS on salary 70,000 + advance tax 10,000 cover the liability; the
       excess is refunded to the ticked SB account.

   -------------------------------------------------------------------------
   HAND COMPUTATION (see tests/ITR-1/figures.json for the full trail):
     Salary: gross 12,00,000; net (no exempt allowances) 12,00,000; less
       16(ia) standard deduction 50,000 => INCOME FROM SALARY 11,50,000.
     House property: self-occupied, annual value nil; 24(b) interest 1,80,000
       (<= 2,00,000 ceiling) => income (1,80,000) i.e. a LOSS of 1,80,000
       (within the 2,00,000 set-off ceiling; carried signed to GTI).
     Other sources: savings-bank interest 15,000 => INCOME FROM OS 15,000.
     GROSS TOTAL INCOME = 11,50,000 - 1,80,000 + 15,000 = 9,85,000.
     Chapter VI-A: 80C 1,50,000 + 80D 25,000 = 1,75,000 (within the 1.5L
       group ceiling and the income cap).
     TOTAL INCOME = 9,85,000 - 1,75,000 = 8,10,000 (rounded to the ten, s.288B).
     Tax (OLD slab, non-senior): nil to 2,50,000; 5% of 2,50,000 = 12,500;
       20% of (8,10,000 - 5,00,000 = 3,10,000) = 62,000 => TAX ON TOTAL
       INCOME 74,500. §87A rebate NIL (total income 8,10,000 > 5,00,000).
       Health & education cess @4% on 74,500 = 2,980 => GROSS TAX LIABILITY
       77,480. No surcharge (TI < 50L), no s.89 relief => NET TAX LIABILITY
       77,480.
     Interest & fee: 234A nil (filed 25/07/2026, before 31/07/2026); 234B nil
       and 234C nil (assessed tax net of TDS = 77,480 - 70,000 = 7,480, below
       the 10,000 threshold); 234F nil (filed on time). TOTAL INTEREST 0.
     Taxes paid: TDS on salary 70,000 + advance tax 10,000 = 80,000.
     Since paid 80,000 > net liability 77,480: balance payable NIL;
       REFUND DUE = 80,000 - 77,480 = 2,520.
   ========================================================================== */

/* ======================= 1 · WHO IS FILING (PersonalInfo) =============== */
Object.assign(S.who, {
  first:"S", mid:"", last:"SUDHIR",
  pan:"TVOPS4373C",                        /* fourth letter P = individual */
  dob:"15/06/1985",                        /* age 40 as on 31/03/2026 — not a senior citizen */
  aadhaar:"123412341234",
  empcat:"OTH",                            /* non-Government employer (10% 80CCD(2), no 16(ii)) */
  addr1:"No. 42, 3rd Cross", premises:"Sudhir Bhavan", road:"Richmond Road",
  locality:"Richmond Town", city:"Bengaluru",
  country:"91", state:"15", pin:"560025",  /* Karnataka */
  mobileCc:"91", mobile:"9845012345", mobile2Cc:"91", mobile2:"9845067890",
  email:"s.sudhir.test@example.in", email2:"accounts.sudhir@example.in",
  addr2same:"N"
});

/* ======================= 2 · RETURN & REGIME (FilingStatus) ============= */
Object.assign(S.ret, {
  optout:"Y",                              /* OptOutNewTaxRegime = Y => OLD regime */
  sec:11,                                  /* ReturnFileSec 11 = 139(1) */
  filed:"25/07/2026",                      /* on or before the 31/07/2026 due date */
  provFlag:"N",                            /* seventh proviso to 139(1) — not applicable */
  clauseFlag:"N",                          /* clause (iv) — not applicable */
  repFlg:"N"                               /* not a representative assessee */
});

/* ======================= 3 · SALARY (section 17) ======================= */
Object.assign(S.sal, {
  s17_1:1200000,                           /* Salary u/s 17(1) — gross salary 12,00,000 */
  s17_2:0, s17_3:0,
  ent:"", pt:""                            /* no entertainment allowance / professional tax */
});
S.alw = [];                                /* no allowances exempt u/s 10 */

/* ======================= 4 · HOUSE PROPERTY (self-occupied) ============= */
S.hp.props = [
  { type:"S", owner:"SE",
    addr1:"No. 42, 3rd Cross", city:"Bengaluru", state:"15", pin:"560025",
    co:"N",
    loans:[
      { type:"B", lender:"State Bank of India", acno:"HL30412345678",
        dt:"05/04/2019", amt:3000000, os:2200000, int:180000 }
    ] }
];

/* ======================= 5 · OTHER SOURCES ============================= */
S.os = [
  { sec:"SAV", desc:"", amt:15000 }        /* savings-bank interest 15,000 */
];
S.osx  = {};                                /* no dividend */
S.ltcg = {};                                /* no 112A gain */

/* ======================= 6 · CHAPTER VI-A DEDUCTIONS =================== */
S.ded.c80c = [
  { kind:"LIC", idno:"LIC-889012", amt:100000 },
  { kind:"PPF", idno:"PPF-40011",  amt:50000 }
];                                          /* 80C total 1,50,000 */
S.ded.d80  = { selfSr:"N", parSr:"P", hiSelf:25000 };   /* 80D self/family (non-senior) 25,000 */

/* ======================= 7 · TAXES PAID =============================== */
S.tds1 = [
  { tan:"BLRS12345E", name:"Yukti Software Services Private Limited",
    inc:1150000, tds:70000 }               /* TDS on salary 70,000 */
];
S.tds2 = [];                                /* no other TDS */
S.tds3 = [];                                /* no 26QB TDS */
S.tcs  = [];                                /* no TCS */
S.it = [
  { bsr:"0510308", dt:"15/03/2026", sn:"00742", amt:10000 }   /* advance tax 10,000 */
];

/* ======================= 8 · BANK, REFUND & VERIFICATION ============== */
S.bank = [
  { ifsc:"SBIN0040011", bank:"State Bank of India", acno:"30412345678",
    type:"SB", refund:"Y" }
];
Object.assign(S.ver, {
  hasbank:"Y",
  nacc:1,
  name:"S SUDHIR",
  father:"SUDHIR NARAYANAN",
  pan:"TVOPS4373C",                        /* the individual's own PAN, fourth letter P */
  cap:"S",                                 /* Self */
  place:"Bengaluru",
  date:"25/07/2026"
});
