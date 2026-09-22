# bs — hand-traced case (Balance Sheet · Part A-BS)

Section `bs`, screen position 2, compute order 6. Block: **PARTA_BS**
(`FundSrc` + `FundApply` required; `NoBooksOfAccBS` alternate). Source of every
formula: `books/ITR-5/BALANCE_SHEET.md`. r115 (Provision for Wealth Tax) is
hidden and NOT built. No dropdowns on this sheet.

Verified with a standalone harness stubbing the shell primitives (N, R, RS, get,
set, put, deep, st0, reg) and calling `engBs()` / `expBs()` / `impBs()` /
`chkBs()` directly. All 29 computed subtotals matched to the rupee; the balanced
case raised no checks; export → import → re-export was byte-identical.

## Case: firm with regular books, balanced statement

### A — Sources of funds (`FundSrc`)
Inputs
- 1a Partners'/members' capital = 5,00,000  *(signed field)*
- 1b Reserves & surplus: Revaluation 10,000; Capital 20,000; Statutory 5,000;
  Other 5,000; Credit balance of P&L 60,000
- 2a Secured: Foreign currency 50,000; Rupee from banks 1,00,000; from others 50,000
- 2b Unsecured: Foreign currency 20,000; Rupee from banks 30,000;
  from 40A(2)(b) persons 10,000; from others 40,000
- 3 Deferred tax liability = 25,000
- 4 Advances: from 40A(2)(b) persons 15,000; from others 10,000

Trace
- 1bvi Total reserves & surplus = 10,000+20,000+5,000+5,000+60,000 = **1,00,000**  (L13)
- 1c Total partners'/members' fund = 5,00,000 + 1,00,000 = **6,00,000**  (L14, signed)
- 2aiiC Secured rupee loans = 1,00,000+50,000 = 1,50,000  (J21)
- 2aiii Total secured loans = 50,000+1,50,000 = **2,00,000**  (L22)
- 2biiD Unsecured rupee loans = 30,000+10,000+40,000 = 80,000  (J29)
- 2biii Total unsecured loans = 80,000+20,000 = **1,00,000**  (L30)
- 2c Total loan funds = 2,00,000+1,00,000 = **3,00,000**  (L31)
- 4iii Total advances = 15,000+10,000 = **25,000**  (L36)
- **5 Sources of funds = 6,00,000 + 3,00,000 + 25,000 + 25,000 = 9,50,000**  (L37, signed)

### B — Application of funds (`FundApply`)
Inputs
- 1 Fixed assets: Gross block 5,00,000; Depreciation 1,00,000; CWIP 50,000
- 2a Long-term: Property 40,000; Listed eq 20,000; Unlisted eq 10,000;
  Preference 5,000; Govt/trust 5,000; Debenture 5,000; MF 5,000; Others 5,000
- 2b Short-term: Listed eq 2,000; Unlisted eq 3,000 (rest 0)
- 3ai Inventories: RM 10,000; WIP 10,000; FG 10,000; Stock-in-trade 10,000;
  Stores 5,000; Loose tools 3,000; Others 2,000
- 3aii Sundry debtors: >1yr 20,000; Others 30,000
- 3aiii Cash & bank: Bank 1,00,000; Cash 40,000; Others 10,000
- 3aiv Other current assets 50,000
- 3b Loans & adv: Advances recoverable 40,000; Deposits 40,000; Bal w/ Rev Auth 20,000
- 3diA Sundry creditors: >1yr 10,000; Others 20,000
- 3di Liab leased 5,000; Int accrued & due 5,000; Int accrued not due 5,000;
  Income recvd in adv 5,000; Other payables 10,000
- 3dii Provisions: Income tax 10,000; Leave/superann/gratuity 5,000; Other 5,000
- 4 Misc: Misc expenditure 40,000; Deferred tax asset 30,000; Debit bal P&L 10,000

Trace
- 1c Net block = max(5,00,000 − 1,00,000, 0) = **4,00,000**  (J42, floored)
- 1e Total fixed assets = 4,00,000+50,000 = **4,50,000**  (L44)
- 2aiiC LT equity total = 20,000+10,000 = 30,000  (J51)
- 2aviii Total long-term inv = 5,000+5,000+5,000+5,000+5,000 + 30,000 + 40,000 = **95,000**  (L57)
- 2biC ST equity total = 3,000+2,000 = 5,000  (J62)
- 2bvii Total short-term inv = 0 + 5,000 = **5,000**  (L68)
- 2c Total investments = 5,000 + 95,000 = **1,00,000**  (L69)
- 3aiH Total inventories = 10,000×4 + 5,000+3,000+2,000 = **50,000**  (L80)
- 3aiiC Total sundry debtors = 20,000+30,000 = **50,000**  (L84)
- 3aiiiD Total cash & equivalents = 1,00,000+40,000+10,000 = **1,50,000**  (L89)
- 3av Total current assets = 1,50,000+50,000+50,000+50,000 = **3,00,000**  (L91)
- 3biv Total loans & advances = 40,000+40,000+20,000 = **1,00,000**  (L96)
- 3c Total CA, loans & adv = 3,00,000+1,00,000 = **4,00,000**  (L100)
- 3diA3 Total sundry creditors = 10,000+20,000 = 30,000  (J106)
- 3diG Total current liabilities = 30,000+5,000+5,000+5,000+5,000+10,000 = **60,000**  (L112)
- 3diiD Total provisions = 10,000+5,000+5,000 = **20,000**  (L118, hidden wealth-tax skipped)
- 3diii Total CL & provisions = 60,000+20,000 = **80,000**  (L119)
- 3e Net current assets = 4,00,000 − 80,000 = **3,20,000**  (L120, signed)
- 4d Total misc adjustments = 40,000+30,000+10,000 = **80,000**  (L124)
- **5 Application of funds = 4,50,000 + 1,00,000 + 3,20,000 + 80,000 = 9,50,000**  (L125, signed)

### Balancing check (rules.json n=81)
Sources (5) = 9,50,000  =  Application (5) = 9,50,000  →  balances, no error raised.

## Negative / imbalance edge case
Set PartnerOrMemberCap = −5,000 (signed, allowed → no flag), OthCurrAsset =
−3,000 (non-signed → flags), GrossBlock 1,00,000 with no matching application →
`chkBs()` returns:
- err "Balance sheet does not balance" (n=81)
- err "Negative figure not allowed" for OthCurrAsset and for the two non-signed
  computed totals it drives negative (TotCurrAsset, TotCurrAssetLoanAdv);
  the signed lines (PartnerOrMemberCap, NetCurrAsset) are correctly exempt.

## 139(9) defect trap (§6)
When Source-5 = 0 **and** every No-account C figure = 0 **and** Schedule BP
income (read from `S.C.bp.income` once the bp section exists) > ₹1,20,000,
`chkBs()` emits a warning that the return may be treated as defective u/s 139(9).
Cross-schedule; inert (0) until the bp section publishes its compute cache.

## Export / round-trip
`expBs(j)` merges FundSrc + FundApply (required) onto `j.PARTA_BS`; adds
`NoBooksOfAccBS` only when it carries data (confirmed omitted when empty).
export → `impBs` → `engBs` → export was byte-identical.
