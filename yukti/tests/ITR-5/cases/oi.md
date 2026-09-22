# oi — hand-traced case (Other Information · Part A-OI + Quantitative Details · Part A-QD)

Section `oi`, screen position 4, compute order 6 (the Part-A accounts band,
matching `bs`=6 / `hp`=6, and strictly before Schedule `bp` which consumes the
`S.C.oi.*` feeds). Blocks: **PARTA_OI** and
**PARTA_QD** (both optional — not in SKEL; emitted only when they carry data;
the whole schedule is conditionally mandatory only when liable for audit u/s
44AB). Source of every formula: `books/ITR-5/PART_A_OI.md` and
`books/ITR-5/QUANTITATIVE_DETAILS.md`. No hidden rows on either sheet.

Verified with a standalone harness stubbing the shell primitives (N, R, RS, get,
set, put, deep, st0, sv, reg) and calling `engOi()` / `expOi()` / `impOi()` /
`chkOi()` directly. All eleven computed sub-totals matched to the rupee; the
export dropped no data and invented no key; export → import → re-export was
byte-identical (round-trip gate green). One warning fired as expected.

## The 9e / 40A(13) schema gap (how it is handled)

Sheet row **9e** (J74, "Marked to market loss or other expected loss … [40A(13)]")
has **no leaf** in schema block `AmtDisallUs40A` (only `AmtPaidUs40A2b`,
`AmtGT20kCash`, `ProvPmtGrat`, `ContToSetupTrust`, `AnyOthDisallowance`,
`TotAmtDisallUs40A`). Per CLAUDE.md rule 3 and the section brief ("do not invent
a key"), **9e is not built as an input and is never exported**, and the **9g
total is computed as SUM(9a,9b,9c,9d,9f)** — the five schema leaves only — so the
exported total reconciles with the leaves present and the round-trip stays
identical. (On the utility, 9g = SUM(J70:J75) also folds in J74/9e; that
component is simply unfileable in this schema.)

## Case: firm liable to 44AB, with a recognised PF and one item per QD grid

### Part A-OI inputs
- 1 MethodOfAcct = Mercantile (`MERC`); 2 ChangeInAcctMethFlg = `N`
- 4 MethodOfValClgStk: RawMaterial `1`, FinishedGoods `2`, ChngStockValMetFlg `N`, EffectOnPL 0, DecProOrIncLossUs145_A 0
- 5 NoCredToPLAmt: 5a 1,000; 5b 200; 5c 50; 5d 30; 5e 20
- 6 AmtDisallUs36: 6a 500; 6f (RecogPFContribAmt) 700; 6s (AnyOthDisallowance) 100
- 6u NoOfEmployeesEmployed: (i) 10; (ii) 2
- 7 AmtDisallUs37: 7a 300; 7i 200
- 8A AmtDisallUs40: 8A.e (TaxAmtOnProfits) 400; 8A.i (AnyOthDisallowance) 100 · 8B (AnyAmtOfSec40AllowPrevYr) 250
- 9 AmtDisallUs40A: 9a 600; 9f (AnyOthDisallowance) 150 · **9e left out (no schema leaf)**
- 10 AmtDisallUs43BPyNowAll.AmtUs43B: 10a 1,000; 10f 500; 10h (MSEPayable, optional) 200
- 11 AmtDisall43B.AmtUs43B: 11a 800; 11d 300
- 12 ExciseCustomsVAT: 12d (CGST) 1,200; 12e (SGST) 1,200
- 13 DeemedProf: 13a 100; 13c 50
- 14 ProfTaxAmtUs41 5,000; 15 PriorAmtIncCrDrPL −1,500 (negative allowed); 16 AmountOfExpDisAllwUs14A 250; 16A InterestDisAllowUs23SMEAct 75
- 17 ScheduleTPSAFlg = Yes

### Trace (cell refs from PART_A_OI.md)
- **5f** = 1,000+200+50+30+20 = **1,300**  (L20 = SUM(J15:J19))
- **6t** = 500+700+100 = **1,300**  (L41 = SUM(J22:J40), 6a..6s)
- **6u.iii** = 10+2 = **12**  (J45 = SUM(J43:J44))
- **7j** = 300+200 = **500**  (L56 = SUM(J47:J55))
- **8A.j** = 400+100 = **500**  (L67 = SUM(J58:J66))
- **9g** = 600+150 = **750**  (L76; 9e excluded — schema gap)
- **10i** = 1,000+500+200 = **1,700**  (L87 = SUM(J78:J86))
- **11i** = 800+300 = **1,100**  (L98 = SUM(J89:J97))
- **12i** = 1,200+1,200 = **2,400**  (L108 = SUM(J100:J107))
- **13** = 100+50 = **150**  (L109 = SUM(L110:L112))
- feeds to Schedule BP: 6t→A14 1,300; 9g→A17 750; 10i→A30 1,700; 8B→A29 250; 14→8b 5,000; 15→19 −1,500; SUM(5a..5d)→Sl.23 1,280; 17→Sl.19 "Yes"

All ten printed totals matched the expected values above to the rupee.

### Part A-QD inputs (one item per grid)
- (a) Trading: Widget · unit 107-Numbers · O 100, P 500, S 450, C 150, short/excess 0
- (b) Raw material: Steel · unit 109-Ton · O 10, P 90, Consumption 80, S 0, C 20, Yield 70, %yield 87.5, short/excess 0
- (c) Finished/by-product: Gadget · unit 107-Numbers · O 0, P 0, Qty manufactured 70, S 60, C 10, short/excess 0

QD has no computed cells (pure disclosure grids). Verified: the raw-material
`PercentYld` exported as the float **87.5** (not rounded); the finished grid used
key **`PrevyrManfact`** (schema-correct) while the raw grid used **`PrevYrConsum`**
— the two must not be confused. Unit codes stored as the numeric prefix.

### Checks
- `chkOi()` raised exactly one message: **warn "Schedule TPSA required"** (item 17 = Yes → rule 190).
- No PF/employee warning (6u was supplied though 6f > 0); no QD validation errors
  (item names ≤ 25 chars, no disallowed characters, units selected, %yield in 0–100).
- The 44AB-mandatory QD/OI errors are gated on `PartA_GEN2.LiableSec44ABflg`
  (section `gen`) — a cross-section seam read defensively; when the flag cannot be
  read the check is skipped (no false error). The integrator wires `gen`'s flag here.

### Round-trip
export → `impOi` → `engOi` → re-export was **byte-identical**, confirming every
emitted leaf survives import (rule 12). Negative `PriorAmtIncCrDrPL`, the float
`PercentYld`, and the optional leaves (`MSEPayable`, `DeemedProfUs33AB/33AC`,
`InterestDisAllowUs23SMEAct`) all round-tripped intact.
