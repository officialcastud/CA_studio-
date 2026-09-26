/* ITR-4 · AY 2026-27 — validation-rule FIX batch 07 (enforcement gaps/weak fixes).
   Registered via ruleset(); A(n,cond,msg) fires when cond is FALSE. Reads guarded; nothing throws.
   Serials 8 and 9 (Category B, GAP): TDS section codes that belong to non-residents / FIIs /
   business-trust-NR payees (194E, 194LB, 194LC, 194LBA(a)/(b)/(c), 195, 196A, 196B, 196C, 196D,
   196D(1A)) make the assessee ineligible for ITR-4 when selected at col 2a of TDS2(i) or TDS2(ii).
   Short codes are the TDSSection enum written by 70_sec_paidbank.js (TDSSEC_P4). */
ruleset(function(I,S_,A,Dd){
  I=I||{};
  /* TDSSection short codes (70_sec_paidbank.js) for the sections the rule names */
  var NR_CODES={
    "94E":1,                                   /* 194E   */
    "4LB":1,                                   /* 194LB  */
    "4LC1":1,"4LC2":1,"4LC3":1,                /* 194LC (2)(i)/(ia), (ib), (ic) */
    "4BA1":1,"4BA2":1,                         /* 194LBA(a), 194LBA(b) — resident labels */
    "LBA1":1,"LBA2":1,"LBA3":1,                /* 194LBA(a), 194LBA(b), 194LBA(c) — NR labels */
    "195":1,                                   /* 195    */
    "96A":1,"96B":1,"96C":1,"96D":1,"96DA":1   /* 196A, 196B, 196C, 196D, 196D(1A) */
  };
  var secOf=function(r){ return String(((r||{}).TDSSection)==null?"":(r||{}).TDSSection).trim(); };
  var badRow=function(rows){
    rows=rows||[]; var hit=-1;
    for(var i=0;i<rows.length;i++){ if(rows[i]&&NR_CODES[secOf(rows[i])]){ hit=i; break; } }
    return hit;
  };

  /* 8: TDS2(i) — TDSonOthThanSals.TDSonOthThanSalDtls[].TDSSection */
  var t2=RG(I,"TDSonOthThanSals.TDSonOthThanSalDtls",[])||[];
  var b2=badRow(t2);
  A(8, !I.TDSonOthThanSals || b2<0,
    "Schedule TDS2(i) row "+(b2+1)+": section "+(b2<0?"":secOf(t2[b2]))+" (194E/194LB/194LC/194LBA/195/196A-196D/196D(1A)) at col 2a is a non-resident TDS section; the assessee is not eligible to file ITR-4.");

  /* 9: TDS2(ii) — ScheduleTDS3Dtls.TDS3Details[].TDSSection */
  var t3=RG(I,"ScheduleTDS3Dtls.TDS3Details",[])||[];
  var b3=badRow(t3);
  A(9, !I.ScheduleTDS3Dtls || b3<0,
    "Schedule TDS2(ii) row "+(b3+1)+": section "+(b3<0?"":secOf(t3[b3]))+" (194E/194LB/194LC/194LBA/195/196A-196D/196D(1A)) at col 2a is a non-resident TDS section; the assessee is not eligible to file ITR-4.");

  /* ===================== AY 2025-26 ADD (4b) =====================
     New/general AY 2025-26 rules that block real returns, on surviving flat fields
     (serials 501+ are internal, outside the 2026-keyed disable set; the target
     AY 2025-26 rule number each encodes is noted). All guarded so they pass on the
     golden (self-capacity, rebate 0 above the ceiling, 24(b) already balanced). */
  /* s0: string-present test. NB RG(o,path) with no default returns 0 (String(0) is truthy), so every
     read below passes an explicit "" default, otherwise a missing leaf would read as present ("0"). */
  var s0=function(v){ return String(v==null?"":v).trim()!==""; };
  /* target A-44 — Representative-assessee mandatory fields when the Verification capacity is 'Representative'. */
  A(501, String(RG(I,"Verification.Capacity","S"))!=="R"
       || (s0(RG(I,"FilingStatus.AssesseeRep.RepName","")) && s0(RG(I,"FilingStatus.AssesseeRep.RepCapacity",""))
        && s0(RG(I,"FilingStatus.AssesseeRep.RepAddress",""))
        && (s0(RG(I,"FilingStatus.AssesseeRep.RepPAN","")) || s0(RG(I,"FilingStatus.AssesseeRep.RepAadhaar","")))),
    "When the return is filed in the capacity of Representative, the name, capacity, address and PAN/Aadhaar of the representative are mandatory.");
  /* target A-237 — New regime: rebate u/s 87A is barred when total income excluding LTCG u/s 112A exceeds
     the FY 2024-25 marginal-relief breakeven of Rs. 7,22,230 (Rs. 25,000 rebate ceiling at Rs. 7,00,000). */
  A(502, !isNew()
       || !((N(RG(I,"IncomeDeductions.TotalIncome",0)) - N(RG(I,"LTCG112A.LongCap112A",0))) > 722230)
       || N(RG(I,"TaxComputation.Rebate87A",0)) <= 1,
    "New regime: rebate u/s 87A cannot be claimed when total income (excluding LTCG u/s 112A) exceeds Rs. 7,22,230.");
  /* target A-326 (rows sum = 24(b) total) is NOT encoded: on this build's flat model the engine
     stores the *restricted/deductible* interest in ScheduleUs24B.TotalInterestUs24B (e.g. new
     regime / SOP cap), not the raw arithmetic sum of the per-loan InterestUs24B rows, so a
     "rows sum = total" assertion would false-fire whenever the interest is capped. Deferred. */
  /* target A-320 — House-property interest on borrowed capital must equal the Schedule 24(b) total (flat model). */
  A(504, !I.ScheduleUs24B
       || REQ(N(RG(I,"IncomeDeductions.InterestPayable",0)), N(RG(I,"ScheduleUs24B.TotalInterestUs24B",0)), 1),
    "Interest on borrowed capital (house property) must equal the total interest disclosed in Schedule 24(b).");
});
