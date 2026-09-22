# G1 — general + salary audit (Excel utility vs our software)

Group **G1_general_salary**. Sheets audited: **PART A - General** (section `who` + sibling `ret`,
`forms/ITR-3/src/70_sec_who.js`, `70_sec_ret.js`) and **Schedule S** (section `sal`,
`forms/ITR-3/src/70_sec_sal.js`). Excel read via `tools/dump.py --form ITR-3`. Schema leaves via
`--leaves PartA_GEN1 / PartA_GEN2 / (ScheduleS implicit)`. Cell/`H` flags are the utility's; code
lines are ours.

---

## PART A - General  (section: who + ret)

`who` renders the identity face (PersonalInfo) and OWNS the export/import of BOTH PartA_GEN1 and
PartA_GEN2. `ret` renders the return/regime/audit face into the shared `S.pi/S.fs/S.decl/S.aud/S.nob`
state (its `exp`/`imp` were removed by the integrator as dedup, rule 11). So a field must be checked
in BOTH the `secRet`/`secWho` renderers AND `expWho`.

### Missing fields/rows
- **[W36 / r36H] Conditions for Residential Status** (`FilingStatus.ConditionsResStatus`, enum 1–9) —
  NOT rendered (no match in who/ret) and NOT in `expWho`. Impact: an NRI / RNOR return cannot record
  the residential-status condition it qualifies under. Live fileable leaf (utility opens it via the
  `IF(MID(ResidentialStatus1,1,3)…)` formula on W36).
- **[r37–40H] Jurisdiction(s) of residence + TIN** (`FilingStatus.JurisdictionResPrevYr.
  JurisdictionResPrevYrDtls[].JurisdictionResidence / .TIN`, both required-in-row) — NOT rendered, NOT
  exported. Impact: a non-resident cannot list foreign tax jurisdictions/TIN → NRI return incomplete.
- **[r43H] Total period of stay in India during the PY** (`FilingStatus.TotalPrStayIndiaPrevYr`) and
  **[r44H] …during the 4 preceding years** (`FilingStatus.TotalPrStayIndia4PrecYr`) — NOT rendered,
  NOT exported. Impact: the day-count that drives RES/RNOR/NRI status can't be captured.
- **[r63–78] Form 10-IEA "new regime" re-entry leaves** — `FilingStatus.F10IEAEarlierAYNewRegime`,
  `.AssYrF10IEANewTaxReg`, `.Form10IEAEarlierAYAckNewRegime`, `.F10IEACurrAYNewRegime`,
  `.F10IEADateCurrAYNewTax`, `.F10IEAAckNoCurrAYNewTax` — NONE are written by `expWho` and there is no
  UI (grep for `NewRegime/NewTax/CurrAYNew` in who/ret = empty). `expWho` only handles the OLD-regime
  opt-out direction (`F10IEA…OldRegime/OldTax`, lines 189-198). Impact: a filer who had opted OUT and
  now RE-ENTERS the new regime by filing 10-IEA (utility path (I)(A)(ii)/(I)(B), rows 67-78) cannot be
  represented.
- **[r157–160 / AQ157:AT160] 44AB condition-"bii" sub-details** — `AuditInfo.BiiDetails.{44AD, 44ADA,
  44AE, 44BB}` (Y/N per section). NOT captured — `ret` only stores the `cnd44AB` selector (line 317),
  never the four presumptive-section flags the utility opens when `bii` is chosen. Impact: which of
  44AD/44ADA/44AE/44BB the assessee is falling under (but not offering presumptively) is lost.
- **[r177–184] AuditDetails[].OthAuditDtls** — schema leaf exists; `expWho` (lines 296-299) writes
  `AuditedSection/AuditFlag/DateOfAudit/AckNumOth` but not `OthAuditDtls`. Minor.
- **[r189–193] AuditReportDetails[].OtherITActFlag** and **.OthAuditDtlsOthThanITAct** — schema leaves
  exist; `expWho` (lines 300-303) omits both. Minor.
- **[r134–135] Unlisted-shares intra-year columns** — schema
  `HeldUnlistedEqShrPrYrDtls[]` also carries `DateOfSubscrPurchase, FaceValuePerShare, IssuePricePerShare,
  PurchasePricePerShare, ShrTrnfNumberOfShares, ShrTrnfSaleConsideration`; our grid (`ret` lines
  264-273) has only opening / acquired-no / closing. Impact: the "acquired during the year" price detail
  and the "transferred during the year" columns can't be filled (all non-required).
- **[secondary mobile]** `PersonalInfo.Address.CountryCodeMobileNoSec / MobileNoSec` — not rendered.
  Minor (optional leaves).

Correctly-omitted rows worth flagging (Excel shows them, schema has NO leaf → rule 3 drop, our omission
is schema-faithful, but the utility clearly collects them): **r46-57** Form **10-IE** (pre-AY24)
earlier/current-year election rows (no `F10IE*` leaf — only `F10IEA*` exist); **r111H** Aadhaar
Enrolment Id; **r113H** Passport No.; **r118-121** representative's Capacity / Address / PAN / Aadhaar
(`AssesseeRep` schema only has RepName/RepEmailID/RepMobileNo); **r164-172** auditor's personal name /
membership no / firm-registration no / **UDIN** (PartA_GEN2 `AuditInfo` has NO UDIN or auditor-person
leaf — only `AudFrmName/AudFrmPAN/AudFrmAadhaar`). The CEO should confirm the schema really files no
UDIN; the utility visibly captures it.

### Dropdowns
- **[X30] "Filed u/s"** — Excel `ReturnFileUnderSection1` shows 6 values on the main cell (139(1),
  139(4), 139(5), 92CD, 119(2)(b), 139(8A)) and keeps the notice codes (142(1)/148/153C/139(9)) in a
  SEPARATE "Filed in response to notice u/s" field (Q30). Our `RET_SEC` (ret lines 74-77) merges all
  10 codes into ONE dropdown. This matches the schema enum `ReturnFileSec = {11,12,13,14,16,17,18,19,
  20,21}` exactly, so it is schema-faithful — no missing values, only a cosmetic split difference.
- All other Part-A enums present and correct: `ResidentialStatus` RES/NRI/NOR (ret 78), due dates
  31/08·31/10·30/11 (ret 79 vs X29), rep-capacity, 44AB condition `bi/bii/biii` (ret 91-93 vs V157),
  sales bands (F153), cash-% bands (F154/F155), other-audit section codes (F178 Section_code — ours
  `AUD_SEC` adds 80-IAB/80-IAC which the utility list omits; harmless superset), other-Act list
  (F190 AuditDropDown ≡ `AUD_ACT`). No missing dropdown values found.

### Conditional cascades (show/hide)
- FLAG **Residential status = NRI/NOR** [AK30 / r36-44H]: set→utility opens Conditions-for-res-status
  (W36), Jurisdiction+TIN table (r37-40), and, for citizen/POI, days-in-India-this-year (r43) and
  days-in-4-preceding-years (r44). Ours: **NO** — none of these fields exist; only the RES/NRI/NOR
  selector and the (RES-only) 115H flag are rendered (`ret` 217-220). Biggest Part-A gap.
- FLAG **"Filed u/s" = notice/order code** [X30→13/14/16/18/20]: set→DIN + notice date. Ours: **YES**
  (`ret` 176-180, `RET_NOTICE`); revised/modified (17/19)→receipt + orig date **YES** (181-184).
  Note: `expWho` line 216 includes **18** in the receipt set whereas `secRet`'s `RET_ORIG=[17,19]`
  excludes it — small inconsistency.
- FLAG **incBP (A19(b)) + "opt old" (E79)** [r62/r79]: set→10-IEA current-AY date+ack (business path).
  Ours: **PARTIAL** — old-regime opt-out path reproduced (`ret` 196-213), but the whole 10-IEA
  **new-regime re-entry** tree (rows 63-78, (I)(A)(ii)/(I)(B)) is absent, and the many `H` method rows
  80-100 are collapsed. Fileable-leaf loss noted above.
- FLAG **44AB condition = "bii"** [V157→AQ157:AT160]: set→44AD/44ADA/44AE/44BB Y/N sub-flags
  (`BiiDetails`). Ours: **NO** — selector stored, sub-flags dropped.
- FLAG **a2i turnover = "More than 1cr up to 10cr"** [F153→F154/F155]: set→cash-received-% and
  cash-paid-% (a2ii/a2iii). Ours: **YES** (`ret` 308-313).
- FLAGs Director / Partner / Unlisted-shares [E122/E128/E133], Seventh-proviso [E101→E102-105 + clause
  (iv) grid], Representative [E114→G115-117], FPI [E145→SEBI], SEP [E141→pay/users], 92E
  [F173→W173→date/ack]: all **YES** (`ret` 244-350).

### Regime open/close
- 16(ii) entertainment / 16(iii) professional tax: Excel new=closed, old=open. Ours **match** — `sal`
  engine lines 154-156 zero both under `isNew()`; renderer shows `cell(0)`/"closed by 115BAC"
  (277-280). (This is the salary sheet, but the driver is the Part-A `OptOldRegimeCurrAY`→`isNew()`
  switch, written by `expWho` line 188.)
- The Part-A screen itself opens/closes no income item by regime; `OptOldRegimeCurrAY` is the master
  switch, correctly exported. `retCompare()`/`regimeTable()` (`ret` 132-164) build the both-ways
  comparison the spec asks for. No regime mismatch on Part A itself.

### Audit u/s
- 44AA (a1) F151, 44AE/44B/… presumptive (a2) F152, turnover bands a2i/ii/iii, 44AB (b) F156 + cond
  F157 + accountant-audit + report date/ack + firm name/PAN/Aadhaar, 92E d(i)/d(ii) + date/ack,
  other-IT-Act reports d(iii), other-Act audits — all **present** (`ret` 305-350).
- **Gap:** `BiiDetails` (44AD/44ADA/44AE/44BB under condition bii) — absent (see cascades).
- **Coverage inconsistency:** code 21 = **139(8A)** is offered in `RET_SEC` (ret 77) but the 139(8A)
  updated-return machinery is out of scope — `section_map.json` excludes "Part A Gen_139(8A)" and
  "Part B ATI" (no 140B/ATI computation). Selecting it is schema-legal but a functional dead end.

### ITR-2 bleed / notes
- No obvious ITR-2 numeric bleed on Part A — the ITR-3-specific rows (business-commencement date E9,
  IncFrmBusOrProf A19(b), the whole audit block 150-193, nature-of-business grid) are all built. The
  thinness is in the NRI residential cascade and the 10-IEA new-regime re-entry tree, i.e. under-built
  ITR-3 content rather than ported ITR-2 content.

### Verdict: **MAJOR GAPS** — NRI residential-status cascade (conditions + jurisdiction/TIN + days of
stay) entirely absent, plus the 10-IEA new-regime re-entry leaves and 44AB `BiiDetails`; the resident
new-regime case is complete.

---

## Schedule S  (section: sal)

### Missing fields/rows
- None material. Every live row is built: employer name/nature/TAN/address/city/pin/zip/state
  (r4-6), 17(1)/17(2)/17(3) nature-wise breakups + totals (1a/1b/1c), 89A rows 1d (US/UK/CA)/1e/1f,
  gross salary, total-gross-all-employers (E57), relief-89A (3a), exempt-allowance table (r60-64),
  10(13A) HRA working (r66-74), net salary, 16(ia)/(ii)/(iii), income under Salaries. The utility
  hard-codes 2 employer blocks (r4-28, r30-54); our list is unbounded (schema `Salaries[]`) — correct.
- r104H "aaa" is utility junk — ignore.

### Dropdowns
- Nature-of-employer `EmpCategory` (J4): Excel {CG, SG, PSU, CG-Pensioners, SG-Pensioners,
  PSU-Pensioners, Others-Pensioners, OTHERS} ≡ our `SAL_EMPCAT` (8 vals). Match.
- 1a `salarydropdown1`, 1b `salarydropdown2`, 1c `salarydropdown3`, place-of-residence
  `(Select),1.Metro,2.Non-Metro` (J68), 1d countries US/UK/CA — all present and matched.
- **Exempt-allowance nature (G61:G64)** — the utility uses a **regime- AND employer-category-driven**
  named range (`AllowanceBACYes`/`AllowanceBACNo`, further split `…CGSG / …CGSGPCGPSG / …PCGPSG /
  …AllPGov`, DropDownValues cols DY/EA/EC/EE/EF). We render ONE static 17-value `SAL_ALW10` list in all
  regimes and for all employer categories (`sal` 64-80, 247-253). No value is missing (our list is a
  superset), but the **filtering cascade is not reproduced** (see below). Not a missing-value defect.

### Conditional cascades (show/hide)
- FLAG **regime (isNew)** on the exempt-allowance dropdown: utility swaps `AllowanceBACNo` (old, 13
  sections incl. 10(5) LTA, 10(17)) → `AllowanceBACYes` (new, drops 10(5) and 10(17), keeps the
  retirement/statutory set). Ours: **NO** — the same 17-row list is offered both ways; regime handling
  is pushed entirely into the engine `_ok` gate (line 138), which is where the mismatch below lives.
- FLAG **employer category** on the exempt-allowance dropdown: utility narrows the list per
  govt/pensioner category (`…CGSG`, `…PCGPSG`, etc.; e.g. 10(10B) shown for CG/SG but dropped for
  pensioner-only lists). Ours: **NO** — employer category never filters the allowance list.

### Regime open/close
- **10(13A) HRA exemption**: Excel `[J69]=IF(bacValue=1,0,…)` → nil in new regime. Ours **match** —
  engine line 133 `isNew()?0:…`; renderer shows nil note (sal 257-266). OK.
- **Std deduction 16(ia)**: Excel `[J77]=…IF(bacValue=2,50000,IF(bacValue=1,75000,))` → 75k new / 50k
  old. Ours **match** — engine line 152. OK.
- **16(ii) / 16(iii)**: closed under new regime. Ours **match** — lines 154-156. OK.
- **Exempt allowances u/s 10 — MISMATCH (serious).** The utility's new-regime list `AllowanceBACYes`
  (DropDownValues DY24-35) keeps **10(6), 10(7), 10(10), 10(10A), 10(10AA), 10(10B) first proviso,
  10(10B) second proviso, 10(10C), 10(10CC), 10(14)(i), 10(14)(ii)** exempt under 115BAC — only 10(5)
  LTA and 10(17) drop out (plus 10(13A) handled separately). `REGIME.md` line 16 confirms only **10(14)
  non-permitted** and (lines 14, 83) 16(ii)/16(iii)/HRA close. But our engine
  `SAL_ALW10_NEW = ["10(14)(i)(115BAC)","10(14)(ii)(115BAC)"]` (line 86) with `_ok = !isNew() ||
  SAL_ALW10_NEW.indexOf(a.sec)>=0` (line 138) **zeroes 10(6), 10(7), 10(10), 10(10A), 10(10AA),
  10(10B)(i), 10(10B)(ii), 10(10C), 10(10CC)** under the new regime — i.e. it wrongly taxes gratuity,
  commuted pension, leave encashment, VRS, embassy/outside-India remuneration, etc. for every
  new-regime salaried filer. `chkSal` line 468 raises the same false "not exempt under 115BAC" warning.
  This over-closes the exemption set and **inflates taxable salary** under the default regime.
  isNew() gate is wrong at **`forms/ITR-3/src/70_sec_sal.js:86` (and consumers 138, 468)**; it should
  include the full `AllowanceBACYes` set, not just the two 10(14)(115BAC) codes.

### Audit u/s
- None on Schedule S (salary carries no audit trigger). N/A.

### ITR-2 bleed / notes
- No ITR-2 bleed detected; Schedule S content (89A rows, ESOP/start-up perquisite codes 16/21,
  Agnipath 80CCH code 17) is ITR-3/AY-2026-27 correct. The one defect is the over-narrow new-regime
  exempt set, a logic error rather than a port.

### Verdict: **MAJOR GAPS** — coverage and old-regime maths are solid, but the new-regime exempt-
allowance engine zeroes statutory/retirement 10(x) exemptions the utility keeps, mis-stating taxable
salary for the default regime.

---

## GROUP SUMMARY
- **Missing fields/rows:** ~11 (Part A): ConditionsResStatus; Jurisdiction+TIN table; days-in-India
  (2); 10-IEA new-regime re-entry leaves (2 groups); BiiDetails; AuditDetails.OthAuditDtls;
  AuditReportDetails.OtherITActFlag/OthAuditDtlsOthThanITAct; unlisted intra-year columns; secondary
  mobile. Schedule S: 0.
- **Missing cascades:** 4 — (1) NRI/NOR residential conditions+jurisdiction+days; (2) 44AB "bii"→
  44AD/44ADA/44AE/44BB; (3) 10-IEA new-regime re-entry tree; (4) Schedule S exempt-allowance dropdown
  filtering by regime AND employer category.
- **Missing dropdown values:** 0 (Part-A merged "Filed u/s" is schema-faithful; Schedule S lists are
  supersets — the regime/employer filtering is a cascade, not a missing value).
- **Regime mismatches:** 1 (severe) — Schedule S new-regime exempt-allowance set zeroes 10(6)/10(7)/
  10(10)/10(10A)/10(10AA)/10(10B)(i)/(ii)/10(10C)/10(10CC) that the utility keeps exempt
  (`70_sec_sal.js:86`).
- **Audit gaps:** 1 — `BiiDetails` (44AD/44ADA/44AE/44BB) not captured. Plus 1 coverage
  inconsistency: 139(8A) offered but no ATI/140B downstream.

**3 most serious items**
1. Schedule S: new-regime exempt-allowance engine over-closes statutory/retirement 10(x) exemptions →
   inflated taxable salary in the default regime (`forms/ITR-3/src/70_sec_sal.js:86,138,468`).
2. Part A: entire NRI/RNOR residential-status cascade missing — ConditionsResStatus, Jurisdiction+TIN
   table, and days-of-stay (rows 36-44H); an NRI/RNOR return cannot be completed.
3. Part A: Form 10-IEA "new-regime re-entry" leaves (rows 63-78) and 44AB `BiiDetails` (rows 157-160)
   are unbuilt — filers who re-enter the new regime, or fall under a specific presumptive section
   without opting presumptively, can't be represented.
