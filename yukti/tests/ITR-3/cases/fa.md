# Hand-checked case — section `fa` (Foreign income and assets · FSI · TR · FA)

Books: `books/ITR-3/FSI.md`, `books/ITR-3/TR_FA.md`. Schema blocks: `ScheduleFSI`,
`ScheduleTR1`, `ScheduleFA`. Compute order 26.

## Regime & GTI
- Nothing in this section closes under the new regime (REGIME.md: "…foreign
  assets… Only the concessions close, not the income side"). `isNew()` opens/
  closes no item here.
- Foreign income in FSI col (b) is already inside Part B-TI, so this head adds
  **0** to Gross Total Income → `S.C.fa.income = 0`.

## Input (resident, S.pi.res = "RES")
Two FSI country blocks:

| Country | Head | (b) income | (c) tax paid | (d) tax payable IN |
|---|---|---|---|---|
| USA (2), TIN US-123, sec 90 | Salary | 10,00,000 | 1,50,000 | 1,20,000 |
| | Capital Gains | 2,00,000 | 40,000 | 60,000 |
| | Other Sources | 50,000 | 8,000 | 5,000 |
| UK (44), TIN UK-777, sec 91 | House Property | 3,00,000 | 30,000 | 25,000 |

FA A1: one USA depository account, peak 5,00,000, closing 4,00,000, interest 12,000,
opened 01/04/2020.

## The arithmetic (from the book's rules)

**Col (e) = MIN(c, d) per head** — `[L7]=MIN(J7,K7)`:
- USA Salary: min(1,50,000 , 1,20,000) = **1,20,000**
- USA Capital Gains: min(40,000 , 60,000) = **40,000**
- USA Other Sources: min(8,000 , 5,000) = **5,000**
- UK House Property: min(30,000 , 25,000) = **25,000**

**Country totals = SUM of the five heads (i+ii+iii+iv+v)** — `[I12..L12]`:
- USA: b = 10,00,000+2,00,000+50,000 = **12,50,000**; c = 1,50,000+40,000+8,000 = **1,98,000**;
  d = 1,20,000+60,000+5,000 = **1,85,000**; e = 1,20,000+40,000+5,000 = **1,65,000**
- UK: b = 3,00,000; c = 30,000; d = 25,000; e = **25,000**

**Schedule TR (generated per country from FSI):**
- USA row: paid (c) = 1,98,000; relief (d) = 1,65,000; sec 90
- UK row: paid (c) = 30,000; relief (d) = 25,000; sec 91
- `TotalTaxPaidOutsideIndia`  = 1,98,000 + 30,000 = **2,28,000**  (`[G11]=SUM`)
- `TotalTaxReliefOutsideIndia` = 1,65,000 + 25,000 = **1,90,000**  (`[H11]=SUM`)
- `TaxReliefOutsideIndiaNotDTAA` = relief where sec 91 = **25,000**  (`[J14]=SUMIF 91`)
- `TaxReliefOutsideIndiaDTAA` = MAX(1,90,000 − 25,000, 0) = **1,65,000**  (`[J13]=MAX`)

## Engine output (traced against `engFa()` / `expFa()`)
```
income (GTI contribution): 0
US total b,c,d,e: {"b":1250000,"c":198000,"d":185000,"e":165000}
US sal e = 120000 ; US cg e = 40000 ; US os e = 5000 ; UK total e = 25000
paidTot 228000 ; reliefTot 190000 ; notDtaa(91) 25000 ; dtaa 165000
TR totals: 228000 / 190000 / 165000 / 25000
```
Every figure matches the hand computation to the rupee.

## Round-trip (rule 12)
export → `impFa` → export is byte-identical for `ScheduleFSI`, `ScheduleTR1`
and `ScheduleFA` (verified in harness). Date `01/04/2020` exports as ISO
`2020-04-01` and imports back to `01/04/2020`.

## Residence gates
- `S.pi.res="NRI"` → `engFa` computes income 0 and exports no FSI/TR/FA
  (schedule not applicable to non-resident). `chkFa` raises an error if
  foreign rows are present.
- `S.pi.res="NOR"` → FSI/TR apply; Schedule FA blocked (resident-and-
  ordinarily-resident only), `chkFa` errors if FA rows present.
- `S.pi.res="RES"` → all three schedules open.
