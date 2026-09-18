# Hand-traced case — Schedule AL (ITR-3), section `al`

A high-income individual (Total Income Rs. 1.5 crore, so Schedule AL is
mandatory) with a mixed asset base. Traced against `engAl()` line by line; the
figures must match to the rupee. Schedule AL is a **disclosure at cost** — it
adds nothing to Gross Total Income, so `S.C.al.income` must be `0` in every
case, under either regime.

## Input (`S.al`)

```
S.fs.optout = "No"           // new regime — irrelevant to AL (stays open both ways)
S.C.ti      = 15000000       // Total Income Rs. 1.5 cr (> Rs. 1 cr → AL required)

S.al = {
  ownImm : "Yes",
  imm : [
    { desc:"Flat 4B", resNo:"4B", area:"Bandra", city:"Mumbai",
      state:"19", country:"91", pin:"400050", amount:"9000000" },   // Rs. 90,00,000
    { desc:"Plot 12",  resNo:"12", area:"Whitefield", city:"Bengaluru",
      state:"15", country:"91", pin:"560066", amount:"3000000" }     // Rs. 30,00,000
  ],
  mov : { jewellery:"1500000", art:"0", vehicles:"2500000",
          bank:"1200000", shares:"800000", insurance:"300000",
          loans:"200000", cash:"50000" },
  aopFlag : "Y",
  aop : [
    { name:"ABC & Co LLP", resNo:"9", area:"Nariman Point", city:"Mumbai",
      state:"19", country:"91", pin:"400021", pan:"AAAFA1234B", invest:"2500000" }
  ],
  liab : "1000000"            // Rs. 10,00,000
}
```

## Trace of `engAl()`

`isNew()` is read (returns true here) — no closures apply to AL, so nothing is
zeroed by the regime. `C = {income:0}`.

### Part B — movable (each `n0`, non-negative)
| line | key | value |
|---|---|---|
| (i) | jewellery | 15,00,000 |
| (ii) | art | 0 |
| (iii) | vehicles | 25,00,000 |
| (iv)(a) | bank | 12,00,000 |
| (iv)(b) | shares | 8,00,000 |
| (iv)(c) | insurance | 3,00,000 |
| (iv)(d) | loans | 2,00,000 |
| (iv)(e) | cash | 50,000 |

`mov.total = 1500000+0+2500000+1200000+800000+300000+200000+50000`
`           = 65,50,000`  → **C.mov.total = 6550000**

### Part A — immovable
`C.immCount = 2`
`C.immTotal = 9000000 + 3000000 = 1,20,00,000`  → **C.immTotal = 12000000**

### Part C — firm/AOP
`C.aopCount = 1`
`C.aopTotal = 2500000`  → **C.aopTotal = 2500000**
`C.aopFlag  = "Y"` (flag set)

### Part D — liabilities & A+B+C reference
`C.liab      = 1000000`
`C.assetsABC = immTotal + mov.total + aopTotal`
`           = 12000000 + 6550000 + 2500000`
`           = 2,10,50,000`  → **C.assetsABC = 21050000**

### GTI contribution
`C.income = 0`  ✓ (disclosure schedule — never enters Gross Total Income)

## THE ONE HAND-CHECKED FIGURE

**C.assetsABC = 21050000** (Assets at A + B + C = Rs. 2,10,50,000), with
**C.income = 0**. The section summary shows total assets
= immTotal + mov.total + aopTotal = Rs. 2,10,50,000.

## Export shape (`expAl`) — spot check
- `present` = true (ownImm set / TI > 50L). `j.ScheduleAL` emitted.
- `ImmovableDetails` → 2 rows; each `AddressAL` India (91) so carries integer
  `PinCode`, no `ZipCode`; `Amount` = 9000000 / 3000000.
- `MovableAsset` → all eight keys present (art = 0 kept, "enter zeros if nil").
- `InterstAOPFlag` = "Y"; `InterestHeldInaAsset` → 1 row, `PanOfFirm`
  "AAAFA1234B" (valid PAN kept as-is), `AssesseInvestment` = 2500000.
- `LiabilityInRelatAssets` = 1000000.

## Checks (`chkAl`) on this input — all clean
- TI > 50L and both flags answered → no dropdown errors.
- Both immovable rows: all required fields present, India + valid Pin
  (400050 / 560066 in 100000–999999), state 19/15 ≠ 99 with country 91 → no
  mapping error.
- AOP row: name/address/PAN/investment present, PAN valid, Pin 400021 valid → clean.
- No amount exceeds 14 digits.
Expected: `[]` (no messages).

## Regime cross-check
- `optout="Yes"` (old): identical output — AL has no regime-gated item.
- `optout="No"` (new): identical output — REGIME.md lists AL under "STAYS OPEN".
Both ways: `C.income = 0`, `C.assetsABC = 21050000`. ✓
