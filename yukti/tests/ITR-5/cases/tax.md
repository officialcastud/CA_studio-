# tax — hand-computed case (Part B-TI · Part B-TTI, a firm, to the rupee)

Section `tax`, screen position 17, **compute order 60 (LAST** — after paid=58,
amt=54, si=52, ded=50, loss=46, so it reads fresh `S.C` from every section).
File `forms/ITR-5/src/70_sec_tax.js`. Blocks: **PartB-TI**, **PartB_TTI**
(incl. the refund bank accounts). Engine method from
`books/ITR-5/PARTB_TI_TTI.md` and **`books/ITR-5/Tax_N.md`** (the LIVE engine —
**cess is 4%**, not the legacy 3% of `Tax.md`). Figures verified to the rupee
against `engTax` with a stubbed shell (scratchpad harness).

## Assessee and inputs (upstream `S.C.*`, consumed live)

- **Status**: `S.pi.status="1"` (Firm), `S.pi.substatus="1-Partnership Firm"` →
  Tax(N) group **GrpsA → flat 30%**. Regime `S.fs.optout="No"`.
- **Business income** (`S.C.bp.a.A37`) = **₹1,20,00,000**; no HP/CG/OS, no
  speculative/specified/special-rate business income.
- No current-year loss (`S.C.loss={}`), no brought-forward loss, no special-rate
  income (`S.C.si={}`), no Chapter VI-A / 10AA (`S.C.ded={}`), no AMT
  (`S.C.amt={}`), no agri (`S.C.ei={}`).
- **Foreign-tax relief** (read LIVE from the FA engine): `S.C.fa.dtaa=30,000`
  (§90/90A), `S.C.fa.notDtaa=20,000` (§91), `S.C.fa.hasFA=false`.
- **Taxes paid** (`S.C.paid`): advance tax **₹30,00,000** (one challan dated
  15/03/2026), no TDS/TCS/SAT.
- **Return filed** 15/12/2026; due date 31/08/2026 → **filed late**.

## Part B-TI

| Sl | Item | ₹ |
|---|---|---|
| 2i/2v | Business income (A37) | 1,20,00,000 |
| 5 | Total head-wise income | 1,20,00,000 |
| 6 | Current-year loss set off (CYLA) | 0 |
| 7 | Balance after CYLA | 1,20,00,000 |
| 8 | Brought-forward loss set off (BFLA) | 0 |
| 9 | **Gross total income** | 1,20,00,000 |
| 11c/12 | Chapter VI-A + 10AA | 0 |
| 13 | **Total income** (rounded to ₹10) | **1,20,00,000** |

## Part B-TTI — tax (Tax(N) method, firm flat 30%)

- **2a Tax at normal rates** = 30% × 1,20,00,000 = **₹36,00,000**.
- **2b/2c** special-rate tax / agri rebate = 0.
- **2d Tax payable on total income** = ₹36,00,000.
- **2e Surcharge**: total income > ₹1 crore → firm surcharge **12%** (single
  slab; firms have no 10%/25%/37% bands). 12% × 36,00,000 = **₹4,32,000**.
  - *Marginal relief check*: (tax+surcharge)=40,32,000 vs cap = tax-at-₹1cr
    (30,00,000) + (1,20,00,000 − 1,00,00,000) = 80,00,000. 40,32,000 < 80,00,000
    → **no marginal relief** (mr = 0).
- **2f Health & education cess @ 4%** = 4% × (36,00,000 + 4,32,000)
  = 4% × 40,32,000 = **₹1,61,280**. *(Cess is 4% — the Tax(N) rate — never 3%.)*
- **2g Gross tax liability** = 36,00,000 + 4,32,000 + 1,61,280 = **₹41,93,280**.
- **3 Gross tax payable** (higher of 1d AMT=0 and 2g) = ₹41,93,280.
- **4 §115JD credit** = 0 (no AMT). **5 Tax after credit** = ₹41,93,280.
- **6 Tax relief** — read LIVE from `S.C.fa`: 6a §90/90A = **30,000**
  (`S.C.fa.dtaa`), 6b §91 = **20,000** (`S.C.fa.notDtaa`), **6c total = 50,000**.
  This proves the relief reads `S.C.fa` live (change `S.C.fa.dtaa`/`.notDtaa`
  and 6a/6b/6c move — it is not a dead field; this is exactly the ITR-3 bug the
  build avoids).
- **7 Net tax liability** = 41,93,280 − 50,000 = **₹41,43,280**.

## Part B-TTI — interest, fee, and balance

- **8a §234A** (late 4 months, Sep→Dec): principal = floor((41,43,280 −
  30,00,000)/100)×100 = 11,43,200; × 1% × 4 = **₹45,728**.
- **8b §234B**: advance (30,00,000) < 90% of assessed (0.9 × 41,43,280 =
  37,28,952) → applies. principal 11,43,200; Apr→Dec = 9 months; × 1% × 9 =
  **₹1,02,888**.
- **8c §234C**: assessed = net − relief = 41,43,280 − 50,000 = 40,93,280; ladder
  15/45/75/100%, advance ₹30,00,000 credited only at Q4 (15/03/2026):
  Q1 6,13,900×1%×3 = 18,417; Q2 18,41,900×1%×3 = 55,257; Q3 30,69,900×1%×3 =
  92,097; Q4 (40,93,280−30,00,000→10,93,200)×1%×1 = 10,932. **Total ₹1,76,703**.
- **8d §234F** late-filing fee (TI > ₹5L) = **₹5,000**.
- **8e Total interest & fee** = 45,728 + 1,02,888 + 1,76,703 + 5,000 =
  **₹3,30,319**.
- **9 Aggregate liability** = 41,43,280 + 3,30,319 = **₹44,73,599**.
- **10e Taxes paid** = 30,00,000. **11 Amount payable** = round((44,73,599 −
  30,00,000)/10)×10 = **₹14,73,600**. **12 Refund** = 0.

All figures reproduced exactly by `engTax` (scratchpad harness). The refund
bank grid, foreign-bank grid, `BankDtlsFlag` and `AssetOutsideIndiaFlg`
(data-driven from `S.C.fa.hasFA`) round-trip export → import → re-export
identically.

## What is not honoured by row

- **§115BAE co-op split** (15% mfg + 22% other) uses `S.C.bp.a.A37` as the
  manufacturing base; a separate mfg-income feed from the BP schedule would
  refine it. Not exercised by the firm case.
- **AOP member cases** (foreign-company 35%/30% share split, PDT/MMR
  representative cases) are approximated: business-trust / investment-fund /
  MMR (sub-status 6) → 30%; "any other AOP/BOI" (sub-status 7) → the ordinary
  AOP slab. The full `Tax(N)` `O36:O40`/`PDT.*` member-share case logic is not
  fully reproduced. Not exercised by the firm case.
- **§234B** uses the straight 1%/month formula (principal × 1% × months); the
  Tax(N) SAT-first monthly-cycle adjustment (a self-assessment challan paying
  accrued interest before principal) is simplified.
- The **`noCess` carve** (`AE25` — special incomes on which cess is not levied)
  is consumed from `S.C.si.noCess` when SI publishes it; 0 otherwise.
