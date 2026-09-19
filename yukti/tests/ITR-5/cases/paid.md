# paid — hand-computed case (Taxes paid · TDS / TCS / IT)

Section `paid`, screen position 17, compute order 58. File
`forms/ITR-5/src/70_sec_paid.js`. Blocks: **ScheduleTDS2** (sheet "Schedule
TDS 1" 15B1, TAN), **ScheduleTDS3** (sheet "Schedule TDS 2" 15B2, buyer/tenant
PAN), **ScheduleTCS** (15C, collector TAN), **ScheduleIT** (18A, challans).
Every formula from `books/ITR-5/TDS.md` and `books/ITR-5/IT.md`. Figures
verified to the rupee against `engPaid` with a stubbed shell (scratchpad
harness). NOT built: hidden legacy TCS-on-income table (rows 54-63) and the IT
quarter-breakup helper region (cols Q-AA, rows 1-11).

## Inputs (S.paid)

**Schedule TDS 1 → ScheduleTDS2 (TAN):**
- Row 1: self, TAN MUMD12345E, 194A, current-FY deducted own 40,000, claimed own 40,000, gross 4,00,000, head OS. No b/f.
- Row 2: self, TAN DELC98765F, 194C, b/f 5,000 (FY 2024-25), claimed own 3,000, head BP.

**Schedule TDS 2 → ScheduleTDS3 (buyer PAN):**
- Row 1: self, buyer PAN AAAPZ1234C, 194IA, deducted own 12,000, claimed own 12,000, gross 12,00,000, head HP.

**Schedule TCS (collector TAN):**
- Row 1: self, TAN BLRT55555Z, collected own 2,000, claimed own 2,000.

**Schedule IT (challans):**
- BSR 0510308, 15/06/2025, srl 101, 50,000
- BSR 0510308, 15/12/2025, srl 102, 30,000
- BSR 0510308, 20/07/2026, srl 201, 15,000

## Per-row carried forward

- **ScheduleTDS2** `W=MAX(0, b/f + ded own + ded oth-TDS − claim own − claim oth-TDS)`:
  - Row 1 = MAX(0, 0 + 40,000 + 0 − 40,000 − 0) = **0**
  - Row 2 = MAX(0, 5,000 + 0 + 0 − 3,000 − 0) = **2,000**
- **ScheduleTDS3** `X=MAX(0, …)`:
  - Row 1 = MAX(0, 0 + 12,000 + 0 − 12,000 − 0) = **0**
- **ScheduleTCS** `P=MAX(0, b/f + coll own + coll oth − claim own − claim oth-TCS)`:
  - Row 1 = MAX(0, 0 + 2,000 + 0 − 2,000 − 0) = **0**

## Block totals (SUM of "claimed in own hands")

- `TotalTDSonOthThanSals` (P14) = 40,000 + 3,000 = **43,000**  → part of 10b
- `TotalTDS3OnOthThanSal` (Q28) = **12,000**                    → part of 10b
- `TotalSchTCS` (M41, col 7i)   = **2,000**                     → 10c

## Schedule IT — advance / self-assessment split by deposit date

YREND = 31/03/2026. A challan dated on/before YREND is advance tax (T15 → 10a);
on/after 01/04/2026 is self-assessment tax (T16 → 10d).
- 15/06/2025 (AT) 50,000 + 15/12/2025 (AT) 30,000 → **Advance = 80,000**
- 20/07/2026 (SAT) 15,000 → **Self-assessment = 15,000**
- `TotalTaxPayments` (H24) = 50,000 + 30,000 + 15,000 = **95,000**

## Part B-TTI feeds (S.C.paid, published for the tax section)

| Key | Meaning | Value |
|---|---|---|
| `adv` | 10a Advance tax | 80,000 |
| `tds` | 10b TDS (t2 + t3) | 55,000 |
| `tcs` | 10c TCS | 2,000 |
| `sat` | 10d Self-assessment tax | 15,000 |
| `t2` | ScheduleTDS2 total | 43,000 |
| `t3` | ScheduleTDS3 total | 12,000 |
| `itTotal` | TotalTaxPayments | 95,000 |
| `paid` | 10e Total taxes paid = adv + t2 + t3 + tcs + sat | 152,000 |
| `income` | contribution to GTI | 0 |

`paid` = 80,000 + 43,000 + 12,000 + 2,000 + 15,000 = **1,52,000**.

## Engine output (verified to the rupee)

```
{"t2":43000,"t3":12000,"tds":55000,"tcs":2000,"adv":80000,"sat":15000,
 "itTotal":95000,"paid":152000,"income":0,
 "cf_tds2":[0,2000],"cf_tds3":[0],"cf_tcs":[0]}
```

All hand figures match `engPaid` exactly.

## Notes on gating (export)

- ScheduleTDS2 rows emit only with a valid 10-char TAN; ScheduleTDS3 rows need a
  valid buyer PAN (falls back to AAAAA0000A if absent, per schema required key).
- ScheduleTCS row identity nests under `EmployerOrDeductorOrCollectDetl`
  (`TCSCreditName`, `TAN`, `PANofOtherPerson`); b/f key is `BroughtFwdTCSAmt`;
  current-FY under `TCSCurrFYDtls.TCSAmtCollOwnHands/TCSAmtCollOthrHands`;
  claimed under `TCSClaimedThisYearDtls.TCSAmtCollOwnHands` and
  `.TCSAmtCollOthrHands.{TaxClaimedTCS,PANOfOthrPrsn}` (ITR-5 keys differ from ITR-3).
- ScheduleIT emits a `TaxPayment` only for BSR-gated rows (sheet [E16] gate);
  `DateDep` converted DD/MM/YYYY → YYYY-MM-DD.
- Each block's Total is present even when the table is empty (report 0).
