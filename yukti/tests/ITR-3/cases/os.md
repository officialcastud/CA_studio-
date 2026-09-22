# Hand-check — Section `os` (Schedule OS), ITR-3

Traced against `books/ITR-3/OS.md` (rules J4/J5/J9/J20/J26/J40/J46/J60/J69/N78/
J88/J93/L97/L98/L104/L105). Regime: OS has **no** 115BAC closure, so both
`optout="Yes"` and `="No"` give the same figures (family-pension deduction is
capped at ₹25,000 in both regimes per J88, bacValue=1).

## Case 1 — resident, positive head (all normal + a little special)

Inputs (`S.os`):
- 1a dividends: 1a(i) 100000, 1a(ii) 20000, 1a(iii) 0
- 1b interest: SB 15000, deposit 50000, refund 2000, PTI −5000, others 8000
- 1c rental (machinery/plant/bldg): 60000
- 1d 56(2)(x): money 30000 (rest 0)
- 1e: family pension 120000, other-income row 10000
- 2a(i) 115BB 40000, 2a(ii) 115BBJ 5000
- 3a(i) expenses 3000, 3b depreciation 12000, 3c interest claimed 50000
- 4/5/5a and race horses: nil

Arithmetic:
| Item | Formula | Value |
|---|---|---|
| 1a | 100000+20000+0 | **120000** |
| 1b | 15000+50000+2000−5000+8000 | **70000** |
| 1c | — | **60000** |
| 1d | MAX(0, 30000) | **30000** |
| 1e | 120000+10000 | **130000** |
| **1** | 120000+70000+60000+30000+130000 | **410000** |
| **2** | 40000+5000 | **45000** |
| 3a(ii) | MIN(120000/3, 25000) | 25000 |
| 3b | rental>0 ⇒ 12000 | 12000 |
| 3c(i) | MIN(50000, 20%×(100000+20000)=24000) | 24000 |
| **3d** | 3000+25000+12000+24000 | **64000** |
| **6** | 410000−64000+0+0−0−0 | **346000** |
| **7** | 45000 + MAX(0,346000) | **391000** |
| 8e | 0−0+0+0 | 0 |
| **9 (IncChargeable)** | 391000 + MAX(0,0) | **391000** |
| **S.C.os.income** | 45000 + 346000 + MAX(0,0) | **391000** |

`engOs()` output matches every line to the rupee.

## Case 2 — NRI, normal-rate loss + race-horse loss + non-counting DTAA row

Inputs: 1b interest 1000; 2a(i) 115BB 10000; 3a(i) expenses 20000; race horses
receipts 5000, 57-deduction 20000; one DTAA row amount 1000, nature 1b, TRC "N",
treaty NIL, IT-Act 20; residential status NRI.

| Item | Formula | Value |
|---|---|---|
| 2 | 10000 | 10000 |
| 6 | 1000 − 20000 | **−19000** |
| 7 | 10000 + MAX(0,−19000) | 10000 |
| 8e | 5000 − 20000 | **−15000** → Schedule CFL 10xii |
| 9 (IncChargeable, floored) | 10000 + MAX(0,−15000) | **10000** |
| 2f DTAA total | NRI + TRC="N" ⇒ row excluded | **0** |
| **S.C.os.income (signed)** | 10000 + (−19000) + MAX(0,−15000) | **−9000** → CYLA |

`engOs()` returns exactly these; the −19000 normal loss is exposed as
`S.C.os.netNormal` and the −15000 race-horse loss as `S.C.os.raceHorse`.

## Export / import
`expOs(j)` writes `j.ScheduleOS` with the eleven required root keys present even
at zero (`TotOthSrcNoRaceHorse`, `IncFrmLottery`, `DividendIncUs115BBDA`,
`DividendIncUs115BBDAaiii`, `DividendIncUs115A1ai`, `DividendIncUs115AC`,
`DividendIncUs115ACA`, `DividendIncUs115AD1i`, `NOT89A`, `DividendDTAA`,
`IncChargeable`); the non-required `IncFrmOnGames` and `DividendIncUs115A1aA`
DateRange blocks are emitted only when they carry a value. `impOs()` reads the
block back and a re-`engOs()` reproduces `income = −9000` (Case 2), confirming a
clean round-trip.
