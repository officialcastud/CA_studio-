# Hand-trace — section `tax` (Part B roll-up, ITR-3 AY 2026-27)

Verified against `engTax()` in `forms/ITR-3/src/70_sec_tax.js` (run in a node
harness that stubs the shell helpers). Every figure matches to the rupee.

## Case 1 — OLD regime, resident individual, age 45, on-time filing

Inputs published by the income heads (the S.C.<head>.income contract):

| Head (S.C) | value |
|---|---|
| `sal.income` | 10,00,000 |
| `hp.income` | −1,50,000 (loss) |
| `bp.income` | 5,00,000 (non-speculative) |
| `os.six` | 50,000 (normal rate) |
| `loss.cyla` (CYLA set-off) | 1,50,000 |
| `loss.bfla` | 0 |
| `ded.partB` / `ded.partC` / `ded.us10AA` | 1,50,000 / 0 / 0 |
| `si.totInc` / `si.totTax` | 0 / 0 |
| `paid` adv/tds/tcs/sat | 0 / 60,000 / 0 / 0 |
| `S.fs.optout` = "Yes" (old), filed 31/07/2026 (due 31/07/2026 → not late) | |

### Part B-TI
- 1 Salaries = 10,00,000
- 2 House property = MAX(0, −1,50,000) = **0** (L5, nil if loss)
- 3v PGBP = MAX(0, 5,00,000) = 5,00,000 (L11)
- 4e Capital gains = 0
- 5d Other sources = MAX(0, 50,000) = 50,000 (L33)
- **6 Total head-wise income** = 10,00,000 + 0 + 5,00,000 + 0 + 50,000 = **15,50,000** (L34)
- 7 Current-year loss set off (CYLA) = 1,50,000 (L35)
- 8 Balance = MAX(0, 15,50,000 − 1,50,000) = 14,00,000 (L36)
- 9 Brought-forward set off (BFLA) = 0 (L37)
- **10 Gross total income** = MAX(0, 14,00,000 − 0) = **14,00,000** (L38) → `S.C.gti`
- 11 Special-rate income in GTI = 0
- 12c Chapter VI-A = MIN(1,50,000, GTI−11 = 14,00,000) = 1,50,000 (L43)
- 13 10AA = 0
- **14 Total income** = round10(MAX(0, 14,00,000 − 1,50,000 − 0)) = **12,50,000** (L45) → `S.C.ti`

### Part B-TTI
- Old-regime normal-citizen slabs (Tax Calculated B29): 2,50,001–5,00,000 @5% = 12,500;
  5,00,001–10,00,000 @20% = 1,00,000; above 10,00,000 @30% on 2,50,000 = 75,000.
- **2a Tax at normal rates** = 12,500 + 1,00,000 + 75,000 = **1,87,500**
- 2b special = 0; 2e rebate 87A = 0 (old regime, TI > 5,00,000)
- 2f after rebate = 1,87,500; 2g surcharge = 0 (TI < 50L)
- 2h cess @4% = 7,500
- **2i Gross tax liability** = 1,87,500 + 0 + 7,500 = **1,95,000** (L78)
- 1d AMT = 0 (old regime, but no Part-C VI-A / 10AA / 35AD add-back → 115JC does not apply)
- 3 Gross tax payable = MAX(1,95,000, 0) = 1,95,000 (L79)
- 4 115JD credit = 0; 6e relief = 0
- **7 Net tax liability** = **1,95,000** (L91)

### Interest (Tax Calculated sheet)
- Not late → 234A = 0; 234F = 0.
- 234B: assessed = 1,95,000 − 60,000 = 1,35,000 ≥ 10,000, advance 0 < 90% → triggers.
  principal = floor(1,35,000/100)·100 = 1,35,000; months Apr→31/07 = MPART = **4**;
  interest = 4 × 1% × 1,35,000 = **5,400**.
- 234C (no advance paid; whole liability accrues from Q1, safe-harbour fails each slot):
  Q1 short 20,200 → 606; Q2 short 60,700 → 1,821; Q3 short 1,01,200 → 3,036; Q4 short 1,35,000 → 1,350; Q5 = 0.
  **234C = 606 + 1,821 + 3,036 + 1,350 = 6,813.**
- **8e Total interest & fee** = 0 + 5,400 + 6,813 = **12,213**
- 9 Aggregate liability = 1,95,000 + 12,213 = **2,07,213**
- 10e Taxes paid = 60,000
- **11 Amount payable** = round10(MAX(0, 2,07,213 − 60,000)) = **1,47,210**; 12 Refund = 0.

`engTax()` output: gti 14,00,000 · ti 12,50,000 · 2a 1,87,500 · cess 7,500 · 2i 1,95,000 ·
net 1,95,000 · 234B 5,400 · 234C 6,813 · 8e 12,213 · aggregate 2,07,213 · **balance 1,47,210** — matches.

## Case 2 — NEW regime, resident individual, TI 11,50,000 (salary only)
- New-regime slabs (Tax Calculated G25): 4–8L @5% = 20,000; 8–11.5L @10% = 35,000 → **2a = 55,000**.
- 87A rebate: TI ≤ 12,00,000 → MIN(55,000, 60,000) = **55,000** → 2f = 0, gross = 0, net = 0.
- AMT not applicable (new regime). Matches `engTax()` (rebate 55,000, net 0).

## Case 3 — OLD regime, AMT applies (10AA add-back)
- TI = 20,00,000 (business 50,00,000 − 10AA 30,00,000). Adjusted TI (Sch AMT item 3) = 20,00,000 + 30,00,000 = 50,00,000 > 20L.
- 1a Tax u/s 115JC = 18.5% × 50,00,000 = 9,25,000; surcharge 0 (adj TI not > 50L); cess 37,000 → **1d = 9,62,000**.
- Normal 2i on TI 20,00,000 = 4,12,500 + cess 16,500 = **4,29,000**.
- 3 Gross tax payable = MAX(4,29,000, 9,62,000) = **9,62,000** (AMT governs).
- AMTC current-year credit generated = MAX(0, 9,62,000 − 4,29,000) = **5,33,000** carried forward. Matches `engTax()`.

## Regime confirmation
- `isNew()` true (new): Schedule AMT blank / 115JC = 0 (REGIME.md A836); AMTC utilised & carried-forward held to 0 (rules 4240); 87A up to ₹60,000 at TI ≤ ₹12L; surcharge cap 25%.
- `isNew()` false (old): AMT opens when adjusted TI > ₹20L with a Part-C VI-A / 10AA / 35AD add-back; 87A ₹12,500 at TI ≤ ₹5L; surcharge cap 37%.
