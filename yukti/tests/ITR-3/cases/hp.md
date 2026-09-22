# Hand-traced case — Section `hp` (Schedule HP), ITR-3

Source of every formula: `books/ITR-3/House_Property.md` (cell refs in brackets).
Traced against `forms/ITR-3/src/70_sec_hp.js` `engProp()` / `engHp()`.

## Case A — one let-out property, single owner (regime-neutral for the working)

Input (`S.hp = {on:"1", pti:"", props:[P]}`):

| field | value |
|---|---|
| type | `L` (Let Out) |
| co / share | No / 100% |
| rent (1a) | 3,00,000 |
| unreal (1b) | 20,000 |
| taxes (1c) | 30,000 |
| 24(b) interest total (feeds 1h) | 1,50,000 (one loan row) |
| arrears received (feeds 1j) | 50,000 |

Trace (`engProp`):

- self = false; share = 100 (not co-owned).
- a = 3,00,000 · b = 20,000 · c = 30,000
- **d = b + c = 50,000**  · [I23]=SUM(I21:I22)
- **e = MAX(0, a − d) = MAX(0, 2,50,000) = 2,50,000**  · [K24]
- **f = MAX(0, ROUND(100% × e)) = 2,50,000**  · [K25]
- **g = ROUND(30% × f) = 75,000**  · [I26]
- **h = 1,50,000** (let-out, no ceiling)  · [K35]→1h
- **i = g + h = 2,25,000**  · [K36]
- jRecd = 50,000 → **j = ROUND(70% × 50,000) = 35,000**  · 1j less 30%
- **k = f − i + j = 2,50,000 − 2,25,000 + 35,000 = 60,000**  · [K38]

`engHp`: sum1k = 60,000; item 2 (PTI) = 0; **item 3 = income = 60,000**.
⇒ `S.C.hp.income = 60000` (positive → adds to GTI). Matches to the rupee. ✔

Export: `ScheduleHP.TotalIncomeChargeableUnHP = 60000`,
`PropertyDetails[0].Rentdetails.IncomeOfHP = 60000`, `BalanceALV = 250000`,
`AnnualOfPropOwned = 250000`, `ThirtyPercentOfBalance = 75000`, `IntOnBorwCap = 150000`,
`TotalDeduct = 225000`, `ArrearsUnrealizedRentRcvd = 35000`.

## Case B — self-occupied, interest 2,50,000 — REGIME check (same input, both ways)

Input: type `S`, one 24(b) loan with interest 2,50,000, no rent.

- **New regime** (`S.fs.optout="No"` → `isNew()` true): self-occupied interest
  disallowed (A224/A232) ⇒ barred, cut = 2,50,000, **h = 0**.
  f = g = 0, i = 0, j = 0 ⇒ **k = 0 ⇒ income = 0**. Renderer shows 1h as `cell(0)`
  behind a "closed by section 115BAC" note — never an input. ✔
- **Old regime** (`S.fs.optout="Yes"` → `isNew()` false): interest capped at
  ₹2,00,000 ⇒ cut = 50,000, **h = 2,00,000**.
  i = 0 + 2,00,000 = 2,00,000 ⇒ **k = 0 − 2,00,000 + 0 = −2,00,000**
  ⇒ **income = −2,00,000** (a loss). ✔

The ₹2,00,000 set-off cap on this loss (N74) and its carry-forward (N75) are
applied by the `loss` section (Schedule CYLA/CFL), which reads the signed
`S.C.hp.income`; under the new regime that set-off/carry is nil (bacValue=1).
