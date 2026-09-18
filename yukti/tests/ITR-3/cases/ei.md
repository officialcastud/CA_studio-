# Hand-checked case — Schedule EI (section `ei`, ITR-3)

Traced against `engEi()` in `forms/ITR-3/src/70_sec_ei.js`. Book: `books/ITR-3/EI.md`.
Regime-independent (Schedule EI stays open in both regimes), so the figures below
hold with `S.fs.optout="No"` (new) and `="Yes"` (old).

## Inputs

| Item | Field | Value |
|---|---|---|
| Sch BP Sl.No.38 | `S.C.bp.a._38` (balance income deemed from agri) | 40,000 |
| 1 | InterestInc (`ei.interest`) | 1,20,000 |
| 2 i | GrossAgriRecpt (`ei.grossAgri`) | 8,00,000 |
| 2 ii | ExpIncAgri (`ei.expAgri`) | 2,50,000 |
| 2 iii | UnabAgriLossPrev8 (`ei.unabAgri`) | 30,000 |
| 3 | Other exempt: SRPC/10(11) 50,000 + AGRI/10(30) 25,000 | 75,000 |
| 4 | DTAA: USA (code 2), head OS, TRC Y | 2,00,000 |
| 5 | PassThrIncNotChrgblTax (`ei.passThr`) | 15,000 |

## Working (book rules)

- **2(iv)** `AgriIncRule7and8 = MAX(0, BP Sl.No.38)` = MAX(0, 40,000) = **40,000**  `[J10]`
- **2(v)** `NetAgriIncOrOthrIncRule7 = MAX(0, i − ii − iii + iv)`
  = MAX(0, 8,00,000 − 2,50,000 − 30,000 + 40,000) = MAX(0, 5,60,000) = **5,60,000**  `[J11]`
- Net agri **> ₹5,00,000 ⇒ land table (2(vi)) mandatory** — one parcel supplied (district, 6-digit PIN, measurement, O, IRG).
- **3** `Others = SUM(Amount)` = 50,000 + 25,000 = **75,000**  `[I27]`
- **4** `IncChrgblAsPerDTAA = SUM(AmountOfIncome)` = **2,00,000**  `[J37]`
- **6** `TotalExemptInc = MAX(0, 1 + 2(v) + 3 + 4 + 5)`
  = MAX(0, 1,20,000 + 5,60,000 + 75,000 + 2,00,000 + 15,000) = **9,70,000**  `[J39]`

## Expected outputs

| Contract | Value |
|---|---|
| `S.C.ei.net2v` | 5,60,000 |
| `S.C.ei.othersTot` | 75,000 |
| `S.C.ei.dtaaTotal` | 2,00,000 |
| `S.C.ei.total` (→ `TotalExemptInc`) | **9,70,000** |
| `S.C.ei.income` (GTI contribution) | **0** (exempt income is not part of GTI) |
| `S.C.eiAgri` (rate effect, read by tax section) | 5,60,000 |

## Verified by node harness

`engEi()` produced net2v 5,60,000, othersTot 75,000, dtaaTotal 2,00,000,
total **9,70,000**, income 0, S.C.eiAgri 5,60,000 — all matching to the rupee.
`expEi()` wrote `ScheduleEI` with both required totals present
(`NetAgriIncOrOthrIncRule7`=5,60,000, `TotalExemptInc`=9,70,000), the land row,
2 OthersInc rows + `Others`, the DTAA row + `IncChrgblAsPerDTAA`.
`impEi()` read all four blocks back (Schedule EI, agricultural land, other exempt,
DTAA). `chkEi()` fired the DTAA non-resident applicability appropriately and the
pass-through PTI reconciliation warning when the PTI context was absent.

Note: on a fresh re-import the total is 9,30,000 rather than 9,70,000 because
2(iv) is auto-pulled from Schedule BP Sl.No.38 and is not carried in the EI JSON —
correct behaviour, not a defect.
