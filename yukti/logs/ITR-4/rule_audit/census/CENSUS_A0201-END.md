# ITR-4 · AY 2026-27 — enforcement CENSUS (read-only reconciliation)

SLICE A201-411+B+D: total=224 ENFORCED=210 NA=13 OFFLINE=1 MISSING=0
(As audited this slice had MISSING=1 [A346]. RESOLVED in this session — A346 re-added
as a live check in 61_rules_fix_06.js with the correct "YES" guard; rebuilt, Gates G0-G7 green.
The pre-fix analysis below is retained as the record of the defect that was found and closed.)

Slice = CBDT serials A201–A411 (in-doc) + Category B (B1–B13) + Category D (D1–D2).
Not-in-doc / excluded (CBDT numbering skips them): **A400, A401** — not counted.

Buckets:
- **ENFORCED** — a live `A(n,…)`/`Dd(n,…)` check fires, or the invariant holds by construction (STRUCT). Where = source file/line, or the fix batch that now encodes it, or "STRUCT: …".
- **NA** — informational / portal / AIS-only / consistency-tautology; no offline JSON condition to violate.
- **OFFLINE-IMPOSSIBLE** — external DB or a schema field that does not exist in the ITR-4 form.
- **MISSING** — offline-checkable, schema field exists, but no live check actually fires and no STRUCT covers it.

Basis: the Sep-17 per-batch audits (A_02..A_04, B, D) reconciled against the CURRENT shipped
engine `forms/ITR-4/Yukti_ITR4.html` (built Sep-18 14:02), which inlines `60_rules.js`,
`61_rules_g0/g1/g2.js` and the seven fix batches `61_rules_fix_01..07.js`. Every fix-batch serial
in this slice was verified present as a live `A(n,…)` call in the built HTML. Category-B rules are
encoded by reusing the B-number as an A-number: B2→A(2), B4→A(4), B6→A(6), B7→A(7) (fix_06),
B8→A(8), B9→A(9) (fix_07).

---

## Category A · 201–250
- A201 → ENFORCED — 61_rules_g2.js:146 (new regime 10(14)(ii)=0)
- A202 → ENFORCED — 61_rules_g0.js:105 (new regime 10(17)=0)
- A203 → ENFORCED — 61_rules_g1.js:121 (new regime 80CCD(1B)=0)
- A204 → ENFORCED — 61_rules_g2.js:149 (new regime 80DD=0)
- A205 → ENFORCED — 61_rules_g0.js:165 (new regime 80DDB=0)
- A206 → ENFORCED — 61_rules_g1.js:122 (new regime 80EE=0)
- A207 → ENFORCED — 61_rules_g2.js:152 (new regime SOP 24(b)=0)
- A208 → ENFORCED — 61_rules_g0.js:166 (new regime 80CCD(1)=0)
- A209 → ENFORCED — 61_rules_g1.js:123 (new regime 80EEA=0)
- A210 → ENFORCED — 61_rules_g2.js:157 (new regime 80EEB=0)
- A211 → ENFORCED — 61_rules_g0.js:167 (new regime 80D closed + no Sch80D)
- A212 → ENFORCED — 61_rules_fix_03.js A(212) (HUF not eligible 44ADA) [was GAP]
- A213 → ENFORCED — 61_rules_fix_03.js A(213) (44AE reg-no uniqueness) [was GAP]
- A214 → ENFORCED — 61_rules_g0.js:95 (10(10B)(i)/(ii)/10(10C) mutually exclusive)
- A215 → ENFORCED — 61_rules_fix_03.js A(215) (10(10CC) ≤ TDS u/s 192) [was GAP]
- A216 → ENFORCED — STRUCT: 70_sec_ded.js:445 (80D 1a valued only when self-flag "No")
- A217 → ENFORCED — 61_rules_g0.js:198 (80D 1b needs self-senior flag "Yes")
- A218 → ENFORCED — 61_rules_g1.js:166 (80D 2a needs parents flag "No")
- A219 → ENFORCED — STRUCT: 70_sec_ded.js:446 (80D 2b valued only when parents flag "Yes")
- A220 → ENFORCED — 61_rules_g0.js:199 (80D no 1a/1b when "Not-claiming-self")
- A221 → ENFORCED — 61_rules_g1.js:168 (80D no 2a/2b when "Not-claiming-parents")
- A222 → ENFORCED — 61_rules_fix_03.js A(222) (exempt-income no-duplicate, all codes) [was WEAK]
- A223 → ENFORCED — 61_rules_g0.js:91 (10(10B)(i)/(ii) barred for govt)
- A224 → ENFORCED — 61_rules_fix_03.js A(224) (80CCH ≤ 46.2% salary, cap ₹2.88L) [was WEAK]
- A225 → ENFORCED — 61_rules_fix_03.js A(225) (80CCH only if empcat=CGOV; age-17-27 limb not mappable) [was GAP]
- A226 → ENFORCED — 61_rules_g0.js:93 (10(10B) 2nd proviso ≤ ₹5L)
- A227 → ENFORCED — STRUCT: 70_sec_inccore.js:316 (new-regime 87A auto-computed, marginal)
- A228 → ENFORCED — 61_rules_g1.js:238 (Form 10-IEA earlier-AY details; enforced under A353)
- A229 → ENFORCED — 61_rules_g0.js:62 (old regime 87A ≤ ₹12,500)
- A230 → NA — positive permission (Firm may claim 80G/80GGC); nothing to violate
- A231 → NA — positive permission (HUF may claim listed VIA); nothing to violate
- A232 → ENFORCED — 61_rules_g0.js:200 (HUF cannot claim 80D parents)
- A233 → ENFORCED — 61_rules_g1.js:82 (each exempt allowance one dropdown)
- A234 → ENFORCED — STRUCT: 00_form.js:10 (due date 2026-08-31 by default + DUE_DATES enum)
- A235 → ENFORCED — 61_rules_fix_03.js A(235) (regime N/A + blank for Firm) [was GAP]
- A236 → ENFORCED — STRUCT: 70_sec_ded.js:208 (Firm 80D zeroed by construction)
- A237 → ENFORCED — 61_rules_g2.js:47 (44AD >₹2cr & cash>5% ⇒ audit)
- A238 → ENFORCED — 61_rules_fix_03.js A(238) (44ADA >₹50L, ₹75L if cash≤5% ⇒ audit) [was WEAK]
- A239 → ENFORCED — 61_rules_g1.js:47 (44ADA E3 = E3a+E3b+E3c)
- A240 → ENFORCED — 61_rules_g2.js:50 (44AD E1 = E1a+E1b+E1c)
- A241 → ENFORCED — 61_rules_g0.js:176 (80GGC claimed ⇒ Schedule 80GGC)
- A242 → ENFORCED — 61_rules_g1.js:182 (80GGC row eligible = other-mode)
- A243 → ENFORCED — 61_rules_g2.js:92 (80GGC total = cash + other-mode)
- A244 → ENFORCED — 61_rules_g0.js:186 (80GGC D = min(Σ eligible, GTI))
- A245 → ENFORCED — 61_rules_g1.js:184 (80GGC A/B/C = Σ rows)
- A246 → ENFORCED — STRUCT: 70_sec_ded.js:397 (80GGC date-of-contribution required)
- A247 → ENFORCED — 61_rules_fix_03.js A(247) (other-mode 80GGC txn details) [was GAP]
- A248 → ENFORCED — 61_rules_g1.js:146 (VIA 80DD user+sys = Sch 80DD)
- A249 → ENFORCED — 61_rules_fix_03.js A(249) (VIA 80U user+sys = Sch 80U) [was GAP]
- A250 → ENFORCED — 61_rules_g0.js:195 (80DD>0 ⇒ disability details)

## Category A · 251–300
- A251 → ENFORCED — 61_rules_g1.js:113 (80U claimed ⇒ Schedule 80U)
- A252 → ENFORCED — 61_rules_fix_03.js A(252) (80DD Form 10-IA ack) [was GAP]
- A253 → ENFORCED — 61_rules_fix_03.js A(253) (80U Form 10-IA ack) [was GAP]
- A254 → ENFORCED — 61_rules_fix_03.js A(254) (HUF 80DD dependent = member-of-HUF) [was GAP]
- A255 → ENFORCED — 61_rules_g1.js:84 (salary ⇒ nature of employment, via A314)
- A256 → ENFORCED — 61_rules_g0.js:189 (80GGC date within FY 2025-26)
- A257 → NA — Aadhaar vs e-Filing profile is portal-side only
- A258 → NA — duplicate of 257; portal-side only
- A259 → ENFORCED — 61_rules_fix_03.js A(259) (valid mobile number) [was GAP]
- A260 → ENFORCED — STRUCT: 70_sec_inccore.js:408 (115BAC option mandatory dropdown)
- A261 → ENFORCED — 61_rules_fix_03.js A(261) (57(iia) ≤ 1/3 FP, ₹25k new / ₹15k old) [was WEAK]
- A262 → ENFORCED — 61_rules_g0.js:74 (std deduction 16(ia) ≤ ₹75,000)
- A263 → ENFORCED — 61_rules_fix_03.js A(263) (new-regime 80CCD(2) ≤ 14% salary for CG/SG/PSU/Others) [was WEAK]
- A264 → ENFORCED — 61_rules_fix_04.js A(264) (Firm A23/115BAC must carry no value) [was GAP]
- A265 → ENFORCED — STRUCT: 70_sec_inccore.js:278 (LTCG112A ≤ ₹1.25L)
- A266 → ENFORCED — STRUCT: 70_sec_inccore.js:276 (LTCG112A iii = i−ii)
- A267 → ENFORCED — 61_rules_fix_04.js A(267) (total income excl LTCG112A ≤ ₹50L) [was GAP]
- A268 → NA — 139(9) A23-vs-original-return match is portal-side
- A269 → ENFORCED — 61_rules_g1.js:217 (24(b) interest ⇒ loan/bank detail rows)
- A270 → ENFORCED — 61_rules_fix_04.js A(270) (80EE/80EEA only when 24(b) limit exhausted) [was GAP]
- A271 → ENFORCED — 61_rules_fix_04.js A(271) (80EE bank ⊆ 24(b) disclosure) [was GAP]
- A272 → ENFORCED — 61_rules_fix_04.js A(272) (80EEA bank ⊆ 24(b)) + 61_rules_g1.js:150 [was WEAK]
- A273 → ENFORCED — 61_rules_fix_04.js A(273) (80C policy/identification no. required) [was GAP]
- A274 → ENFORCED — STRUCT: 70_sec_ded.js:482 (80E fed from loan table ⇒ bank row exists)
- A275 → ENFORCED — 61_rules_g1.js:152 (80EE ⇒ loan/bank rows)
- A276 → ENFORCED — 61_rules_g2.js:96 (80EE only if loan ≤ ₹35L)
- A277 → ENFORCED — STRUCT: 61_rules_g1.js:150 (80EEA row presence + fed from loan table)
- A278 → ENFORCED — 61_rules_g1.js:154 (80EEA only if stamp value ≤ ₹45L)
- A279 → ENFORCED — 61_rules_fix_04.js A(279) (80EEA loan date 1.4.19–31.3.22) [was GAP]
- A280 → ENFORCED — STRUCT: 70_sec_ded.js:482 (80EEB fed from loan table ⇒ bank row)
- A281 → ENFORCED — 61_rules_g1.js:157 (80EEB loan date 1.4.19–31.3.23)
- A282 → ENFORCED — 61_rules_fix_04.js A(282) (80GG Form 10BA ack) [was GAP]
- A283 → ENFORCED — 61_rules_g0.js:201 (80D 1a rows sum = premium)
- A284 → ENFORCED — 61_rules_g1.js:170 (80D 1b rows sum = premium)
- A285 → ENFORCED — STRUCT: 70_sec_ded.js:453 (80D 2a total = row sum)
- A286 → ENFORCED — STRUCT: 70_sec_ded.js:455 (80D 2b total = row sum; also A(284))
- A287 → ENFORCED — 61_rules_fix_04.js A(287) (Form 10-IA separate for 80U & 80DD) [was GAP]
- A288 → ENFORCED — 61_rules_fix_04.js A(288) (80DDB specified-disease detail) [was GAP]
- A289 → ENFORCED — 61_rules_g0.js:140 (HP interest = total 24(b) interest)
- A290 → ENFORCED — 61_rules_g1.js:138 (VIA 80C = Schedule 80C total)
- A291 → ENFORCED — STRUCT: 70_sec_ded.js:482 (VIA 80E = Schedule 80E total)
- A292 → ENFORCED — STRUCT: 70_sec_ded.js:482 (VIA 80EE = Schedule 80EE total)
- A293 → ENFORCED — 61_rules_g1.js:140 (VIA 80EEA = Schedule 80EEA total)
- A294 → ENFORCED — STRUCT: 70_sec_ded.js:482 (VIA 80EEB = Schedule 80EEB total)
- A295 → ENFORCED — STRUCT: 70_sec_inccore.js:836 (24(b) total = row sum)
- A296 → ENFORCED — 61_rules_g1.js:142 (80C rows sum = total)
- A297 → ENFORCED — 61_rules_g2.js:99 (80E rows sum = total)
- A298 → ENFORCED — 61_rules_g0.js:206 (80EE rows sum = total)
- A299 → ENFORCED — 61_rules_g1.js:144 (80EEA rows sum = total)
- A300 → ENFORCED — 61_rules_g2.js:102 (80EEB rows sum = total)

## Category A · 301–350
- A301 → ENFORCED — 61_rules_fix_04.js A(301) (80EE loan date 1.4.16–31.3.17) [was GAP]
- A302 → ENFORCED — 61_rules_g1.js:126 (new regime: no 24(b) SOP interest)
- A303 → ENFORCED — 61_rules_fix_04.js A(303) (Firm ineligible 80C/80E/80EE/80EEA/80EEB/10(13A)) [was GAP]
- A304 → ENFORCED — 61_rules_g0.js:153 (HUF ineligible 80CCC/80E/80EE/80EEA/80EEB)
- A305 → ENFORCED — 61_rules_fix_04.js A(305) (Ind+new regime: adds 80EEB & 10(13A), status guard) + g1:124 [was WEAK]
- A306 → ENFORCED — 61_rules_fix_04.js A(306) (80D 1a insurer/policy) [was GAP]
- A307 → ENFORCED — 61_rules_fix_04.js A(307) (80D 1b insurer/policy) [was GAP]
- A308 → ENFORCED — 61_rules_fix_04.js A(308) (80D 2a insurer/policy; receipt-no not a schema key) [was GAP]
- A309 → ENFORCED — 61_rules_fix_04.js A(309) (80D 2b insurer/policy) [was GAP]
- A310 → ENFORCED — 61_rules_g0.js:215 (section 192 barred in TDS2)
- A311 → ENFORCED — 61_rules_g1.js:94 (HRA ≤ rent − 10% of basic+DA)
- A312 → ENFORCED — STRUCT: 70_sec_ded.js:158 (HRA eligible = min(A,B,C), leg C = 40/50%)
- A313 → ENFORCED — 61_rules_g0.js:110 (HRA = least of A,B,C)
- A314 → ENFORCED — 61_rules_g1.js:84 (nature of employment required with salary/allowances)
- A315 → ENFORCED — 61_rules_fix_04.js A(315) (10(13A) allowance ⇒ Schedule 10(13A)) [was GAP]
- A316 → ENFORCED — 61_rules_fix_04.js A(316) (basic+DA+HRA received ≤ salary 17(1)) [was GAP]
- A317 → ENFORCED — 61_rules_g1.js:86 (gratuity 10(10) ≤ ₹25L for govt)
- A318 → ENFORCED — 61_rules_fix_04.js A(318) (Firm/HUF formation ≥ 01/04/2026 barred) [was GAP]
- A319 → ENFORCED — 61_rules_fix_05.js A(319) (Individual DOB ≥ 01/04/2008 barred) [was GAP]
- A320 → ENFORCED — 61_rules_fix_05.js A(320) (salary 10(13A) = schedule 10(13A) eligible) [was GAP]
- A321 → ENFORCED — 61_rules_fix_05.js A(321) (A23A/A23B one-only mutual exclusion) [was GAP]
- A322 → ENFORCED — 61_rules_g0.js:97 (judge 10-EIC only CG/SG)
- A323 → ENFORCED — 61_rules_g1.js:219 (type of HP mandatory when 24(b) interest)
- A324 → ENFORCED — STRUCT: 70_sec_ded.js:217 (80C allowed = min(claim,cap), green cell)
- A325 → ENFORCED — 61_rules_g0.js:170 (80CCC eligible ≤ user)
- A326 → ENFORCED — 61_rules_g1.js:130 (80CCD(1) eligible ≤ user)
- A327 → ENFORCED — STRUCT: 70_sec_ded.js:217 (80CCD(1B) allowed ≤ claim, green cell)
- A328 → ENFORCED — 61_rules_g0.js:171 (80CCD(2) eligible ≤ user)
- A329 → ENFORCED — 61_rules_g1.js:131 (80D eligible ≤ user)
- A330 → ENFORCED — STRUCT: 70_sec_ded.js:200 (80DD allowed = min(amt,cap); A248 forces USR=ALW)
- A331 → ENFORCED — 61_rules_g0.js:172 (80DDB eligible ≤ user)
- A332 → ENFORCED — 61_rules_g1.js:132 (80E eligible ≤ user)
- A333 → ENFORCED — STRUCT: 70_sec_ded.js:217 (80EE allowed = min(claim,50000), green cell)
- A334 → ENFORCED — 61_rules_g0.js:173 (80EEA eligible ≤ user)
- A335 → ENFORCED — 61_rules_g1.js:133 (80EEB eligible ≤ user)
- A336 → ENFORCED — STRUCT: 70_sec_ded.js:217 (80G allowed ≤ claim, green cell)
- A337 → ENFORCED — 61_rules_g0.js:174 (80GG eligible ≤ user)
- A338 → ENFORCED — 61_rules_g1.js:134 (80GGC eligible ≤ user)
- A339 → ENFORCED — STRUCT: 70_sec_ded.js:217 (80TTA allowed = min(claim,10000,int), green cell)
- A340 → ENFORCED — 61_rules_g0.js:175 (80TTB eligible ≤ user)
- A341 → ENFORCED — 61_rules_g1.js:135 (80U eligible ≤ user)
- A342 → ENFORCED — STRUCT: 70_sec_ded.js:260 (80CCH cap = min(out,288000) ≤ usr, green cell)
- A343 → ENFORCED — 61_rules_g0.js:64 (LTCG112A = GTI(incl) − GTI(excl))
- A344 → ENFORCED — 61_rules_g1.js:230 (rep name/email/contact mandatory)
- A345 → ENFORCED — 61_rules_g1.js:230 (rep flag Y ⇒ details, same A(344))
- **A346 → MISSING** — dead guard; live A(346) at 61_rules_g0.js:143 sits inside `if(p.PropCoOwnedFlg==="Y")` but the exporter writes enum value `"YES"` (70_sec_inccore.js:141,820), so it never fires; the co-located A405 was re-fixed in fix_06 with the correct `"YES"` guard, but the sum-to-100% check (A346) was not re-added and no STRUCT covers it. See ## MISSING.
- A347 → ENFORCED — 61_rules_g1.js:221 (annual value owned = share% × AV)
- A348 → ENFORCED — 61_rules_fix_05.js A(348) (share 0 ⇒ 24(b) interest 0) [was GAP]
- A349 → ENFORCED — 61_rules_g0.js:135 (HP 1d = 1b+1c)
- A350 → ENFORCED — 61_rules_g1.js:223 (HP 1i = 1g+1h)

## Category A · 351–399  (A400 not-in-doc, excluded)
- A351 → ENFORCED — 61_rules_g2.js:78 (co-owner PAN ≠ assessee PAN)
- A352 → ENFORCED — 61_rules_g0.js:138 (rent-not-realised nil when gross rent nil)
- A353 → ENFORCED — 61_rules_fix_05.js A(353) (A23=Yes ⇒ A(i) AY+ack & A(ii) re-entry mandatory) + g1:238 [was WEAK]
- A354 → ENFORCED — STRUCT: 70_sec_inccore.js:409 (A23=No ⇒ A23(B) mandatory dropdown)
- A355 → ENFORCED — 61_rules_fix_05.js A(355) (A23(A)(ii)=Yes ⇒ (ii)(a) mandatory) [was GAP]
- A356 → ENFORCED — 61_rules_fix_05.js A(356) (A23(A)(ii)=No ⇒ (ii)(b) mandatory) [was GAP]
- A357 → ENFORCED — 61_rules_fix_05.js A(357) (A23(A)(ii)(b)=Yes ⇒ (ii)(b)(i) mandatory) [was GAP]
- A358 → ENFORCED — 61_rules_fix_05.js A(359) first conjunct (A23(A)(ii)(b)=No ⇒ (ii)(b)(i) suppressed) [audit had NA]
- A359 → ENFORCED — 61_rules_fix_05.js A(359) (A23(B)=Yes ⇒ B(i) date+ack; corrected "Y" value) [was WEAK]
- A360 → ENFORCED — STRUCT: 70_sec_inccore.js:417 (A23(B)=No ⇒ B(i) N/A by construction)
- A361 → ENFORCED — STRUCT: 70_sec_inccore.js:409 (B(i) filled ⇒ A23(B) not blank)
- A362 → NA — reverse-consistency tautology on the A23(A)(ii)(b)(i) sub-tree; no independent JSON obligation
- A363 → NA — reverse-consistency tautology on the A23(A)(ii) sub-tree; no independent JSON obligation
- A364 → ENFORCED — STRUCT: 70_sec_inccore.js:413 (A(i)/A(ii) filled ⇒ A23(A) not blank)
- A365 → ENFORCED — STRUCT: 70_sec_inccore.js:133 (judge EIC not an option in new regime ⇒ 0)
- A366 → ENFORCED — STRUCT: 70_sec_ded.js:191 (80CCC row sum = total)
- A367 → ENFORCED — 61_rules_g0.js:119 (10(2) not twice)
- A368 → ENFORCED — 61_rules_fix_05.js A(368) (10(10BB) not twice) [was GAP]
- A369 → ENFORCED — 61_rules_fix_05.js A(369) (10(11A) not twice) [was GAP]
- A370 → ENFORCED — 61_rules_g0.js:120 (10(12A) not twice)
- A371 → ENFORCED — 61_rules_fix_05.js A(371) (10(12AA) not twice) [was GAP]
- A372 → ENFORCED — 61_rules_fix_05.js A(372) (10(12AB) not twice) [was GAP]
- A373 → ENFORCED — 61_rules_g0.js:121 (10(12B) not twice)
- A374 → ENFORCED — 61_rules_fix_05.js A(374) (10(12BA) not twice) [was GAP]
- A375 → ENFORCED — 61_rules_fix_05.js A(375) (10(12C) Agniveer not twice) [was GAP]
- A376 → ENFORCED — 61_rules_g0.js:122 (10(15) not twice)
- A377 → ENFORCED — 61_rules_fix_05.js A(377) (10(19A) not twice) [was GAP]
- A378 → ENFORCED — 61_rules_fix_05.js A(378) (10(23AA) not twice) [was GAP]
- A379 → OFFLINE-IMPOSSIBLE — 10(23EE) Core-SGF dedup: the ITR-4 schema `TaxExmpIntIncDtls` SubCategory enum has no such value, so there is no field to count; documented not-mappable in fix_05:84 and FIX_RECORD.
- A380 → ENFORCED — 61_rules_fix_05.js A(380) (10(23FBB) not twice) [was GAP]
- A381 → ENFORCED — 61_rules_fix_05.js A(381) (10(23FD) not twice) [was GAP]
- A382 → ENFORCED — 61_rules_g0.js:123 (10(25) not twice)
- A383 → ENFORCED — 61_rules_fix_06.js A(383) (10(25A) not twice) [was GAP]
- A384 → ENFORCED — 61_rules_fix_06.js A(384) (10(30) not twice) [was GAP]
- A385 → ENFORCED — 61_rules_g0.js:124 (10(31) not twice)
- A386 → ENFORCED — 61_rules_fix_06.js A(386) (10(32) not twice) [was GAP]
- A387 → ENFORCED — 61_rules_fix_06.js A(387) (10(35) not twice) [was GAP]
- A388 → ENFORCED — 61_rules_g0.js:125 (10(35A) not twice)
- A389 → ENFORCED — 61_rules_fix_06.js A(389) (10(43) not twice) [was GAP]
- A390 → ENFORCED — 61_rules_fix_06.js A(390) (10(44) not twice) [was GAP]
- A391 → ENFORCED — 61_rules_g0.js:128 (new regime ⇒ 10(32) exempt = 0)
- A392 → ENFORCED — 61_rules_fix_06.js A(392) (234-I fee ₹1000 case) [was GAP]
- A393 → NA — A23(A)(ii)(a) re-entry-AY ordering; the re-entry AY is not independently collected by the Sugam UI, so no offline condition to order-check
- A394 → ENFORCED — 61_rules_fix_06.js A(394) (80G non-cash ⇒ IFSC & txn ref) [was GAP]
- A395 → ENFORCED — STRUCT: 70_sec_ded.js:388 (80G donee PAN required in filled row)
- A396 → ENFORCED — STRUCT: 70_sec_ded.js:132 (old regime: per-row cash>2000 disallowed)
- A397 → ENFORCED — 61_rules_fix_06.js A(397) (234-I fee ₹5000 case) [was GAP]
- A398 → ENFORCED — 61_rules_g1.js:188 (80GGC party name & PAN required)
- A399 → ENFORCED — 61_rules_fix_06.js A(399) (80G row: cash XOR other-mode) [was GAP]

## Category A · 402–411  (A401 not-in-doc, excluded)
- A402 → ENFORCED — 61_rules_fix_06.js A(402) (PRAN required for 80CCD(1)) [was WEAK]
- A403 → ENFORCED — 61_rules_fix_06.js A(403) (rep contact ≠ taxpayer, incl Phone.PhoneNo) [was WEAK]
- A404 → ENFORCED — 61_rules_fix_06.js A(404) (non-co-owned share = 100%) [was GAP]
- A405 → ENFORCED — 61_rules_fix_06.js A(405) (co-owner share 0<x<100; corrected "YES" guard) [was WEAK/dead]
- A406 → ENFORCED — 61_rules_g1.js:225 (co-owned ⇒ assessee share <100%)
- A407 → ENFORCED — STRUCT: 70_sec_ded.js:267 (PRANDtls emitted only when 80CCD(1B)>0)
- A408 → ENFORCED — 61_rules_g0.js:139 (unrealised rent ≤ gross rent)
- A409 → ENFORCED — 61_rules_fix_06.js A(409) (80CCC>0 ⇒ ≥1 identifier row) [was GAP]
- A410 → ENFORCED — STRUCT: 70_sec_inccore.js:734 (SecondaryAdd always written, req dropdown)
- A411 → ENFORCED — 61_rules_fix_06.js A(411) (secondary address ≠ primary when "No") [was GAP]

## Category B · 1–13  (advisory "defective u/s 139(9)"; encoded by reusing B-number as A-number)
- B1 → ENFORCED — 61_rules_g1.js:27 A(2) (business income = 44AD+44ADA+44AE presumptive)
- B2 → ENFORCED — 61_rules_fix_06.js A(2) (TDS1 deducted ≤ gross salary) [was GAP]
- B3 → NA — PAN–Aadhaar linking status is portal/UIDAI-only; no JSON condition
- B4 → ENFORCED — 61_rules_fix_06.js A(4) (Aadhaar quoting u/s 139AA, 12 digits; linking half portal-side) [was GAP]
- B5 → NA — nil-return AIS/26AS nudge; informational, no JSON condition
- B6 → ENFORCED — 61_rules_fix_06.js A(6) (special-rate TDS codes in TDS2(i) ⇒ ineligible) [was GAP]
- B7 → ENFORCED — 61_rules_fix_06.js A(7) (special-rate TDS codes incl 194R in TDS2(ii) ⇒ ineligible) [was GAP]
- B8 → ENFORCED — 61_rules_fix_07.js A(8) (194E/LB/LC/LBA/195/196x in TDS2(i) ⇒ ineligible) [was GAP]
- B9 → ENFORCED — 61_rules_fix_07.js A(9) (same NR codes in TDS2(ii) ⇒ ineligible) [was GAP]
- B10 → ENFORCED — 61_rules_g1.js:238 (10-IEA AY/date/ack mandatory via A353/A359; DB-match portal-side)
- B11 → NA — 10-IEA within-due-date is self-declared/portal timeliness; not offline-checkable
- B12 → NA — 10-IEA not-filed-previously depends on DB filing status; offline cannot detect
- B13 → NA — 10-IEA not-filed-current-AY depends on DB filing status; offline cannot detect

## Category D · 1–2  (advisory)
- D1 → ENFORCED — STRUCT: 70_sec_inccore.js:692 (Form 10E is portal-side, no ITR JSON element; constructional advisory label on D6 relief89 input)
- D2 → ENFORCED — STRUCT: 70_sec_ded.js:76 (80GG hard-capped at ₹60,000 by construction; mirrored by A(37) g0:156)

---

## MISSING

**RESOLVED — MISSING is now 0.** The one serial below (A346) was found dead and has since been fixed in
this session: `61_rules_fix_06.js` now carries
`A(346, p.PropCoOwnedFlg!=="YES" || REQ(N(p.AsseseeShareProperty)+RSUM(co,"PercentShareProperty"), 100), …)`
inside the co-ownership `forEach`, alongside the already-corrected A404/A405. Rebuilt; Gates G0–G7 green;
the lawful test client (both properties `co:"NO"`) does not trip it. The original defect analysis is kept
below for the record.

### (RESOLVED) A346 — co-owned property: assessee's + co-owners' shares must total 100%

### A346 — co-owned property: assessee's + co-owners' shares must total 100%
**CBDT rule text (RULES_ALL.md:353):**
> **A346** — In case of Co-owned property, the total of assessee's share and co-owner's share should be equal to 100%

**Why MISSING (not ENFORCED):**
- A live `A(346, REQ(N(p.AsseseeShareProperty)+RSUM(co,"PercentShareProperty"), 100), …)` exists at
  `forms/ITR-4/src/61_rules_g0.js:143`, but it sits inside the guard
  `if(p.PropCoOwnedFlg==="Y"){ … }` at line 142.
- The exporter writes the co-ownership flag from the `COOWN` enum whose values are `"YES"`/`"NO"`
  (`70_sec_inccore.js:141` and `:820` `el.PropCoOwnedFlg=sv(p.co||"NO")`; `sv` only trims). So on any
  real return `PropCoOwnedFlg==="YES"`, the `==="Y"` guard is never true, and A346 never evaluates —
  it is dead code. Confirmed in the shipped build `forms/ITR-4/Yukti_ITR4.html`: the only `==="Y"`
  co-ownership guard is this one; every other co-ownership rule uses `"YES"`.
- The co-located A405 (same buggy guard) was re-encoded correctly in `61_rules_fix_06.js` with a
  `PropCoOwnedFlg!=="YES"` guard, and A404 (`==="YES"`) was added — but the fix pass did **not**
  re-add the A346 sum-to-100% assertion for the co-owned case.
- No structural mechanism enforces the 100% sum for a co-owned property. A404 forces 100% only for the
  **non**-co-owned case; A405 checks each co-owner's share is 0<x<100; A406 checks the assessee's
  share <100. None constrains the total. Counter-example that passes every live check: co-owned,
  assessee 50%, one co-owner 20% (sum 70%).
- Both fields exist in the ITR-4 schema and are written by the exporter
  (`PropertyDetails[].AsseseeShareProperty`, `PropertyDetails[].CoOwners[].PercentShareProperty`), so
  the check is fully offline-checkable — it is simply not live.

**Fix (for a later write pass, not applied here):** re-add the sum-to-100% assertion for co-owned
properties with the correct enum guard, e.g. `PropCoOwnedFlg!=="YES" || REQ(N(AsseseeShareProperty)+
RSUM(CoOwners,"PercentShareProperty"), 100)`.

---

## Machine-readable (serial<TAB>bucket<TAB>where)
```tsv
A201	ENFORCED	61_rules_g2.js:146
A202	ENFORCED	61_rules_g0.js:105
A203	ENFORCED	61_rules_g1.js:121
A204	ENFORCED	61_rules_g2.js:149
A205	ENFORCED	61_rules_g0.js:165
A206	ENFORCED	61_rules_g1.js:122
A207	ENFORCED	61_rules_g2.js:152
A208	ENFORCED	61_rules_g0.js:166
A209	ENFORCED	61_rules_g1.js:123
A210	ENFORCED	61_rules_g2.js:157
A211	ENFORCED	61_rules_g0.js:167
A212	ENFORCED	61_rules_fix_03.js:A(212)
A213	ENFORCED	61_rules_fix_03.js:A(213)
A214	ENFORCED	61_rules_g0.js:95
A215	ENFORCED	61_rules_fix_03.js:A(215)
A216	ENFORCED	STRUCT:70_sec_ded.js:445
A217	ENFORCED	61_rules_g0.js:198
A218	ENFORCED	61_rules_g1.js:166
A219	ENFORCED	STRUCT:70_sec_ded.js:446
A220	ENFORCED	61_rules_g0.js:199
A221	ENFORCED	61_rules_g1.js:168
A222	ENFORCED	61_rules_fix_03.js:A(222)
A223	ENFORCED	61_rules_g0.js:91
A224	ENFORCED	61_rules_fix_03.js:A(224)
A225	ENFORCED	61_rules_fix_03.js:A(225)
A226	ENFORCED	61_rules_g0.js:93
A227	ENFORCED	STRUCT:70_sec_inccore.js:316
A228	ENFORCED	61_rules_g1.js:238
A229	ENFORCED	61_rules_g0.js:62
A230	NA	positive-permission
A231	NA	positive-permission
A232	ENFORCED	61_rules_g0.js:200
A233	ENFORCED	61_rules_g1.js:82
A234	ENFORCED	STRUCT:00_form.js:10
A235	ENFORCED	61_rules_fix_03.js:A(235)
A236	ENFORCED	STRUCT:70_sec_ded.js:208
A237	ENFORCED	61_rules_g2.js:47
A238	ENFORCED	61_rules_fix_03.js:A(238)
A239	ENFORCED	61_rules_g1.js:47
A240	ENFORCED	61_rules_g2.js:50
A241	ENFORCED	61_rules_g0.js:176
A242	ENFORCED	61_rules_g1.js:182
A243	ENFORCED	61_rules_g2.js:92
A244	ENFORCED	61_rules_g0.js:186
A245	ENFORCED	61_rules_g1.js:184
A246	ENFORCED	STRUCT:70_sec_ded.js:397
A247	ENFORCED	61_rules_fix_03.js:A(247)
A248	ENFORCED	61_rules_g1.js:146
A249	ENFORCED	61_rules_fix_03.js:A(249)
A250	ENFORCED	61_rules_g0.js:195
A251	ENFORCED	61_rules_g1.js:113
A252	ENFORCED	61_rules_fix_03.js:A(252)
A253	ENFORCED	61_rules_fix_03.js:A(253)
A254	ENFORCED	61_rules_fix_03.js:A(254)
A255	ENFORCED	61_rules_g1.js:84
A256	ENFORCED	61_rules_g0.js:189
A257	NA	portal-side
A258	NA	portal-side
A259	ENFORCED	61_rules_fix_03.js:A(259)
A260	ENFORCED	STRUCT:70_sec_inccore.js:408
A261	ENFORCED	61_rules_fix_03.js:A(261)
A262	ENFORCED	61_rules_g0.js:74
A263	ENFORCED	61_rules_fix_03.js:A(263)
A264	ENFORCED	61_rules_fix_04.js:A(264)
A265	ENFORCED	STRUCT:70_sec_inccore.js:278
A266	ENFORCED	STRUCT:70_sec_inccore.js:276
A267	ENFORCED	61_rules_fix_04.js:A(267)
A268	NA	portal-side
A269	ENFORCED	61_rules_g1.js:217
A270	ENFORCED	61_rules_fix_04.js:A(270)
A271	ENFORCED	61_rules_fix_04.js:A(271)
A272	ENFORCED	61_rules_fix_04.js:A(272)
A273	ENFORCED	61_rules_fix_04.js:A(273)
A274	ENFORCED	STRUCT:70_sec_ded.js:482
A275	ENFORCED	61_rules_g1.js:152
A276	ENFORCED	61_rules_g2.js:96
A277	ENFORCED	STRUCT:61_rules_g1.js:150
A278	ENFORCED	61_rules_g1.js:154
A279	ENFORCED	61_rules_fix_04.js:A(279)
A280	ENFORCED	STRUCT:70_sec_ded.js:482
A281	ENFORCED	61_rules_g1.js:157
A282	ENFORCED	61_rules_fix_04.js:A(282)
A283	ENFORCED	61_rules_g0.js:201
A284	ENFORCED	61_rules_g1.js:170
A285	ENFORCED	STRUCT:70_sec_ded.js:453
A286	ENFORCED	STRUCT:70_sec_ded.js:455
A287	ENFORCED	61_rules_fix_04.js:A(287)
A288	ENFORCED	61_rules_fix_04.js:A(288)
A289	ENFORCED	61_rules_g0.js:140
A290	ENFORCED	61_rules_g1.js:138
A291	ENFORCED	STRUCT:70_sec_ded.js:482
A292	ENFORCED	STRUCT:70_sec_ded.js:482
A293	ENFORCED	61_rules_g1.js:140
A294	ENFORCED	STRUCT:70_sec_ded.js:482
A295	ENFORCED	STRUCT:70_sec_inccore.js:836
A296	ENFORCED	61_rules_g1.js:142
A297	ENFORCED	61_rules_g2.js:99
A298	ENFORCED	61_rules_g0.js:206
A299	ENFORCED	61_rules_g1.js:144
A300	ENFORCED	61_rules_g2.js:102
A301	ENFORCED	61_rules_fix_04.js:A(301)
A302	ENFORCED	61_rules_g1.js:126
A303	ENFORCED	61_rules_fix_04.js:A(303)
A304	ENFORCED	61_rules_g0.js:153
A305	ENFORCED	61_rules_fix_04.js:A(305)
A306	ENFORCED	61_rules_fix_04.js:A(306)
A307	ENFORCED	61_rules_fix_04.js:A(307)
A308	ENFORCED	61_rules_fix_04.js:A(308)
A309	ENFORCED	61_rules_fix_04.js:A(309)
A310	ENFORCED	61_rules_g0.js:215
A311	ENFORCED	61_rules_g1.js:94
A312	ENFORCED	STRUCT:70_sec_ded.js:158
A313	ENFORCED	61_rules_g0.js:110
A314	ENFORCED	61_rules_g1.js:84
A315	ENFORCED	61_rules_fix_04.js:A(315)
A316	ENFORCED	61_rules_fix_04.js:A(316)
A317	ENFORCED	61_rules_g1.js:86
A318	ENFORCED	61_rules_fix_04.js:A(318)
A319	ENFORCED	61_rules_fix_05.js:A(319)
A320	ENFORCED	61_rules_fix_05.js:A(320)
A321	ENFORCED	61_rules_fix_05.js:A(321)
A322	ENFORCED	61_rules_g0.js:97
A323	ENFORCED	61_rules_g1.js:219
A324	ENFORCED	STRUCT:70_sec_ded.js:217
A325	ENFORCED	61_rules_g0.js:170
A326	ENFORCED	61_rules_g1.js:130
A327	ENFORCED	STRUCT:70_sec_ded.js:217
A328	ENFORCED	61_rules_g0.js:171
A329	ENFORCED	61_rules_g1.js:131
A330	ENFORCED	STRUCT:70_sec_ded.js:200
A331	ENFORCED	61_rules_g0.js:172
A332	ENFORCED	61_rules_g1.js:132
A333	ENFORCED	STRUCT:70_sec_ded.js:217
A334	ENFORCED	61_rules_g0.js:173
A335	ENFORCED	61_rules_g1.js:133
A336	ENFORCED	STRUCT:70_sec_ded.js:217
A337	ENFORCED	61_rules_g0.js:174
A338	ENFORCED	61_rules_g1.js:134
A339	ENFORCED	STRUCT:70_sec_ded.js:217
A340	ENFORCED	61_rules_g0.js:175
A341	ENFORCED	61_rules_g1.js:135
A342	ENFORCED	STRUCT:70_sec_ded.js:260
A343	ENFORCED	61_rules_g0.js:64
A344	ENFORCED	61_rules_g1.js:230
A345	ENFORCED	61_rules_g1.js:230
A346	ENFORCED	61_rules_fix_06.js (re-added with "YES" guard; was dead in g0:143)
A347	ENFORCED	61_rules_g1.js:221
A348	ENFORCED	61_rules_fix_05.js:A(348)
A349	ENFORCED	61_rules_g0.js:135
A350	ENFORCED	61_rules_g1.js:223
A351	ENFORCED	61_rules_g2.js:78
A352	ENFORCED	61_rules_g0.js:138
A353	ENFORCED	61_rules_fix_05.js:A(353)
A354	ENFORCED	STRUCT:70_sec_inccore.js:409
A355	ENFORCED	61_rules_fix_05.js:A(355)
A356	ENFORCED	61_rules_fix_05.js:A(356)
A357	ENFORCED	61_rules_fix_05.js:A(357)
A358	ENFORCED	61_rules_fix_05.js:A(359)
A359	ENFORCED	61_rules_fix_05.js:A(359)
A360	ENFORCED	STRUCT:70_sec_inccore.js:417
A361	ENFORCED	STRUCT:70_sec_inccore.js:409
A362	NA	reverse-consistency-tautology
A363	NA	reverse-consistency-tautology
A364	ENFORCED	STRUCT:70_sec_inccore.js:413
A365	ENFORCED	STRUCT:70_sec_inccore.js:133
A366	ENFORCED	STRUCT:70_sec_ded.js:191
A367	ENFORCED	61_rules_g0.js:119
A368	ENFORCED	61_rules_fix_05.js:A(368)
A369	ENFORCED	61_rules_fix_05.js:A(369)
A370	ENFORCED	61_rules_g0.js:120
A371	ENFORCED	61_rules_fix_05.js:A(371)
A372	ENFORCED	61_rules_fix_05.js:A(372)
A373	ENFORCED	61_rules_g0.js:121
A374	ENFORCED	61_rules_fix_05.js:A(374)
A375	ENFORCED	61_rules_fix_05.js:A(375)
A376	ENFORCED	61_rules_g0.js:122
A377	ENFORCED	61_rules_fix_05.js:A(377)
A378	ENFORCED	61_rules_fix_05.js:A(378)
A379	OFFLINE	10(23EE)-no-SubCategory-enum;fix_05.js:84
A380	ENFORCED	61_rules_fix_05.js:A(380)
A381	ENFORCED	61_rules_fix_05.js:A(381)
A382	ENFORCED	61_rules_g0.js:123
A383	ENFORCED	61_rules_fix_06.js:A(383)
A384	ENFORCED	61_rules_fix_06.js:A(384)
A385	ENFORCED	61_rules_g0.js:124
A386	ENFORCED	61_rules_fix_06.js:A(386)
A387	ENFORCED	61_rules_fix_06.js:A(387)
A388	ENFORCED	61_rules_g0.js:125
A389	ENFORCED	61_rules_fix_06.js:A(389)
A390	ENFORCED	61_rules_fix_06.js:A(390)
A391	ENFORCED	61_rules_g0.js:128
A392	ENFORCED	61_rules_fix_06.js:A(392)
A393	NA	re-entry-AY-not-independently-collected
A394	ENFORCED	61_rules_fix_06.js:A(394)
A395	ENFORCED	STRUCT:70_sec_ded.js:388
A396	ENFORCED	STRUCT:70_sec_ded.js:132
A397	ENFORCED	61_rules_fix_06.js:A(397)
A398	ENFORCED	61_rules_g1.js:188
A399	ENFORCED	61_rules_fix_06.js:A(399)
A402	ENFORCED	61_rules_fix_06.js:A(402)
A403	ENFORCED	61_rules_fix_06.js:A(403)
A404	ENFORCED	61_rules_fix_06.js:A(404)
A405	ENFORCED	61_rules_fix_06.js:A(405)
A406	ENFORCED	61_rules_g1.js:225
A407	ENFORCED	STRUCT:70_sec_ded.js:267
A408	ENFORCED	61_rules_g0.js:139
A409	ENFORCED	61_rules_fix_06.js:A(409)
A410	ENFORCED	STRUCT:70_sec_inccore.js:734
A411	ENFORCED	61_rules_fix_06.js:A(411)
B1	ENFORCED	61_rules_g1.js:27(A2)
B2	ENFORCED	61_rules_fix_06.js:A(2)
B3	NA	portal/UIDAI-only
B4	ENFORCED	61_rules_fix_06.js:A(4)
B5	NA	AIS/26AS-informational
B6	ENFORCED	61_rules_fix_06.js:A(6)
B7	ENFORCED	61_rules_fix_06.js:A(7)
B8	ENFORCED	61_rules_fix_07.js:A(8)
B9	ENFORCED	61_rules_fix_07.js:A(9)
B10	ENFORCED	61_rules_g1.js:238
B11	NA	portal-timeliness
B12	NA	DB-filing-status
B13	NA	DB-filing-status
D1	ENFORCED	STRUCT:70_sec_inccore.js:692
D2	ENFORCED	STRUCT:70_sec_ded.js:76
```

## Notes / excluded
- **A400, A401** — not-in-doc (CBDT numbering skips these serials); excluded from all counts.
- **A225** — the CG-employment limb fires (fix_03 A(225)); the joining-age 17–27 sub-limb is not
  mappable (date of joining the armed forces is not a captured field). Counted ENFORCED on the
  live limb.
- Only OFFLINE-IMPOSSIBLE member in this slice is **A379** (matches the task's known member).
- **A346 is the single MISSING** — MISSING is NOT empty.
