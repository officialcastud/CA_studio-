# Hand-case — Section `other` (ITR-5, A.Y. 2026-27)

File under test: `forms/ITR-5/src/70_sec_other.js`
Blocks: SchedulePTI · ScheduleIF · ScheduleTPSA · ScheduleGST · Schedule115TD.

The primary rupee-exact verification below is **Schedule TPSA** (a pure
percentage cascade, fully deterministic). PTI/IF/GST arithmetic is verified
alongside. Schedule 115TD's field-7 tax is verified to the rupee; its field-8
115TE interest is verified for method (its value depends on the system date, so
the total is shown for the run date and the method is what is checked).

---

## Primary hand-case — Schedule TPSA (§92CE(2A), deterministic)

Gate: Part A-OI item 17 `ScheduleTPSAFlg = "Yes"` (so the schedule is live).

Input (Sl.1, `[H4]` → `AmtPrimaryAdjUs92CE_2A`): **₹10,00,000**
Challan table (`DtlsTaxesPaid[]`): one challan, amount deposited **₹1,50,000**.

| Sl. | Field | Formula | Amount |
|-----|-------|---------|--------|
| 1 | Primary adjustment | input | 10,00,000 |
| 2a | Additional income-tax @18% | ROUND(10,00,000 × 0.18) | **1,80,000** |
| 2b | Surcharge @12% on 2a | ROUND(1,80,000 × 0.12) | **21,600** |
| 2c | H&E cess @4% on (2a+2b) | ROUND((1,80,000+21,600) × 0.04) = ROUND(2,01,600×0.04) | **8,064** |
| 2d | Total additional tax | 1,80,000 + 21,600 + 8,064 | **2,09,664** |
| 3 | Taxes paid | SUM(challans) | **1,50,000** |
| 4 | Net tax payable | MAX(0, 2,09,664 − 1,50,000) | **59,664** |

Engine output (verified): `tax18=180000, sur12=21600, cess4=8064,`
`total=209664, paid=150000, net=59664`. ✓ Matches to the rupee.

Export `ScheduleTPSA` carries all eight scalar leaves plus `DtlsTaxesPaid[]` and
`TotalAmountDeposited=150000`. Emitted only because the OI flag is Yes.

---

## Schedule PTI — one fund

Fund 1: kind `A` (Section 115UA), PAN `AAACR1234A`.

| Head | Income (7) | Loss (8) | Net (9)=7−8 |
|------|-----------|----------|-------------|
| i House property | 1,00,000 | 20,000 | **80,000** |
| ii-ai 111A | 50,000 | 0 | 50,000 |
| ii-aii Others | 30,000 | 10,000 | 20,000 |
| **iia Short term** | 80,000 | 10,000 | **70,000** |
| ii-bi 112A | 2,00,000 | 0 | 2,00,000 |
| **iib Long term** | 2,00,000 | 0 | **2,00,000** |
| iii-Dividend | 40,000 | — | 40,000 |
| iii-Others | 10,000 | — | 10,000 |
| **iii Other Sources** | 50,000 | — | **50,000** |
| iv-a 10(23FBB) | 15,000 | — | 15,000 |
| iv-b 10(35) | 5,000 | — | 5,000 |
| **iv Exempt total** | 20,000 | — | **20,000** |

Published on `S.C.other.pti[0]` (head objects with `.net`) and aggregated on
`S.C.other.ptiTot = {hp:80000, stAgg:70000, ltAgg:200000, osAgg:50000, exTot:20000}`.
These are the cross-schedule ties: HP Sl.2 (A203) = 80,000; CG STCG PTI = 70,000
and CG B10 LTCG (A385) = 2,00,000; OS Sl.2d (A477) = 50,000; EI Sl.5 (A732) =
20,000. ✓

Note: Col 8 (loss share) exists only for House property and Capital Gains in the
schema; Other Sources and exempt lines have no loss column, so their net = amount.

---

## Schedule IF — two firms

| Firm | %share | Profit (i) | Interest (ii) | Capital (iii) |
|------|--------|-----------|---------------|---------------|
| FIRM ONE LLP (AAAFF1111A, audit Yes, 92E No) | 40 | 3,00,000 | 50,000 | 10,00,000 |
| FIRM TWO (AAAFF2222B, audit No, 92E No) | 25 | 1,50,000 | 20,000 | 5,00,000 |
| **Total** | | **4,50,000** | **70,000** | **15,00,000** |

Engine: `tot={profit:450000, intr:70000, cap:1500000}`, `n=2`. ✓
Exported `TotalProfitShareAmt=450000`, `TotalIntrstAmtDueOrRecv=70000`,
`TotalFirmCapBalOn31Mar=1500000`. Warn emitted: total interest (70,000) must tie
to P&L 14xi(b) (rule n55).

---

## Schedule GST — one GSTIN

`27AAACR1234A1Z5` → ₹50,00,000. Passes the 15-char pattern check; both columns
present so the A779/A780 all-or-nothing pairing holds. ✓

---

## Schedule 115TD — accreted income

| Sl. | Field | Formula | Amount |
|-----|-------|---------|--------|
| 1 | Aggregate FMV | input | 1,00,00,000 |
| 2 | Less: total liability | input | 20,00,000 |
| 3 | Net value of assets | MAX(0, 1−2) | **80,00,000** |
| 4i/4ii/4iii | FMV carve-outs | 5,00,000 / 3,00,000 / 2,00,000 | |
| 4iv | Total | 5,00,000+3,00,000+2,00,000 | **10,00,000** |
| 5 | Liability on assets at 4 | input | 1,00,000 |
| 6 | Accreted income | MAX(0, 80,00,000 − (10,00,000 − 1,00,000)) | **71,00,000** |
| 7 | Additional tax @ MMR 34.944% | ROUND(71,00,000 × 0.34944) | **24,81,024** |
| 8 | Interest u/s 115TE | 1%/month engine (see below) | *system-date dependent* |
| 10 | Tax + interest | 7 + 8 | |
| 11 | Tax & interest paid | SUM(challans) = 1,00,000 | **1,00,000** |
| 12 | Net payable (ROUNDUP(10−11, −1)) | → Part B-TTI Sr.12 (n762) | |

Field 7 verified to the rupee: 71,00,000 × 34.944% = 24,81,024. ✓

**115TE interest method** (verified): base = ROUNDDOWN(24,81,024, −2) = 24,81,000;
specified date 15/06/2025 → due date +14 days = 29/06/2025; one challan on
20/09/2025 for 1,00,000.
- 29/06/2025 → 20/09/2025 = 3 whole months → 24,81,000 × 1% × 3 = 74,430.
- Payment reduces outstanding to 24,81,000 − 1,00,000 = 23,81,000.
- 20/09/2025 → system date accrues at 1% × months on 23,81,000.

On the test run date the total interest came to ₹3,60,150, giving field 10 =
28,41,174 and field 12 = MAX(0, ROUNDUP(28,41,174 − 1,00,000, −1)) = **27,41,180**
(rounded up to the nearest 10). The rupee total moves with the system date by
design (interest accrues to today when tax is unpaid); an `intOvr` field lets the
preparer pin the exact figure.

---

## Round-trip

`expOther(j)` → `impOther(j)` → `engOther()` → `expOther(j2)` gives
`j === j2` (verified byte-identical for the full five-block case above). ✓

## Published cross-section keys (`S.C.other`)
- `S.C.other.pti` — array of fund blocks, each head object carrying `.inc/.loss/.net/.tds` (HP reads `pti[i].hp.net`; CG/OS/EI read `stAgg/ltAgg/osAgg/exTot`).
- `S.C.other.ptiTot` — `{hp, stAgg, ltAgg, osAgg, exTot}` head sums for the tie rules.
- `S.C.other.tpsa.net` — net additional tax u/s 92CE(2A).
- `S.C.other.td.net12` — net 115TD payable → Part B-TTI Sr.12.
- `S.C.other.income = 0` (all five are disclosures / additional-tax, no GTI here).
