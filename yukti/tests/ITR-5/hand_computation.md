# ITR-5 · A.Y. 2026-27 — hand computation

**Client:** S SUDHIR AND ASSOCIATES · PAN `AAAFS5678Q` · partnership FIRM (MainStatus 1) ·
resident · **OLD regime** (Form 10-IEA filed in time) · liable to audit u/s 44AB · filed 31/10/2026 (on the due date).

Every figure below is derived by hand from `tests/ITR-5/state.js` and reconciles to the engine
(`S.C.gti / S.C.ti / S.C.tax.gross / S.C.int.net / .refund`) to the rupee.

## Business/profession (Part A accounts → Schedule BP)
Manufacturing account: opening inventory 600,000 + purchases 3,000,000 + direct wages 800,000 +
direct exp 200,000 + factory overheads 300,000 = debits 4,900,000; less closing 500,000 →
**cost of goods produced 4,400,000**.
Trading account: sales 15,000,000 + scrap 50,000 = 15,050,000; + closing FG 800,000 = credits 15,850,000;
less opening FG 600,000, purchases 5,000,000, direct exp 250,000, COGP 4,400,000 → **gross profit 5,600,000**.
P&L: GP 5,600,000 + other income 100,000 = 5,700,000; less debits 2,470,000 (freight 50,000,
salaries 1,200,000, insurance 30,000, staff welfare 20,000, travel 40,000, telephone 30,000,
audit fee 100,000, partner remuneration 800,000, other exp 160,000 [incl. s.35(1)(i) research 100,000],
bad debts 40,000) = **PBIDTA 3,230,000**; less interest to partners 200,000, depreciation 400,000 →
**PBT 2,630,000** (BP A1).

Schedule BP ladder (A1 → A37): A1 2,630,000; + depreciation debited to P&L 400,000 (A11);
− depreciation allowable per Sch DEP 445,000 (A12i: DPM 15% 375,000 + DOA building 5% 50,000 +
furniture 10% 20,000) → A13 2,585,000; + ICDS increase 25,000 (A25) → A26 25,000; A34 2,610,000;
**A37 (business income) = 2,610,000**. Schedule ESR: s.35(1)(i) deb 100,000 = allow 100,000 (no excess).

## Heads of income (before set-off)
| Head | Amount |
|---|---|
| House property (let-out): 600,000 − 40,000 tax = 560,000; − 30% 168,000 − 24(b) interest 200,000 | **192,000** |
| Business (BP A37) | **2,610,000** |
| Capital gains — STCG land (applicable rate): 5,000,000 − 4,000,000 − 100,000 | 900,000 |
| Capital gains — LTCG 112A @12.5%: 800,000 − 300,000 | 500,000 |
| Capital gains — VDA 115BBH @30%: 500,000 − 300,000 | 200,000 |
| Other sources — normal: dividend 200,000 + interest 350,000 − s.57 ded 50,000 | 500,000 |
| Other sources — special: 115BB winnings @30% | 50,000 |

## Loss set-off (CYLA / BFLA / CFL / UD)
No current-year losses → **CYLA nil**. Brought-forward set-off (Schedule BFLA):
- BF business loss AY 2023-24 **300,000** → business 2,610,000 → 2,310,000
- Unabsorbed depreciation AY 2024-25 **60,000** (Sch UD) → business 2,310,000 → 2,250,000
- BF short-term capital loss AY 2022-23 **100,000** → STCG applicable 900,000 → 800,000
- BF long-term capital loss AY 2021-22 **80,000** → LTCG 112A 500,000 → 420,000

**Gross Total Income (Part B-TI item 9 = Schedule BFLA col-5):**
192,000 + 2,250,000 + 800,000 + 420,000 + 500,000 = **4,162,000**.
(115BBH VDA 200,000 and 115BB winnings 50,000 sit outside the CG E-table / CYLA-BFLA chain and
so are not in this GTI figure; both are still taxed via Schedule SI — see below.)

## Chapter VI-A + 10AA → Total Income
- 80G: PMNRF 100,000 (100%, no limit) + charitable trust 40,000 (50%, with 10% qualifying limit → 20,000) = **120,000**
- 80GGC political-party contribution (other mode) = **25,000**
- 80-IA(4)(iv) power undertaking (Part C) = **100,000**
- Chapter VI-A total = **245,000**
- 10AA (SEZ unit) = **200,000**

**Total Income = 4,162,000 − 245,000 − 200,000 = 3,717,000** (rounded to the nearest 10).

## Tax on total income (firm — flat 30% + 4% cess)
- Special-rate income in TI (Schedule SI) = 420,000 (112A) + 200,000 (VDA) + 50,000 (winnings) = **670,000**
- Normal-rate income = 3,717,000 − 670,000 = 3,047,000 → tax @30% = **914,100**
- Schedule SI tax: 112A (420,000 − 1,25,000 exemption = 295,000 @12.5% = 36,875) + VDA (200,000 @30% = 60,000)
  + winnings (50,000 @30% = 15,000) = **111,875**
- Tax on TI = 914,100 + 111,875 = **1,025,975**; surcharge nil (TI < ₹1 cr)
- Health & education cess @4% = **41,039**
- **Gross tax liability = 1,067,014**  ← `figures.tax`

## AMT (s.115JC) comparison
Adjusted total income = TI 3,717,000 + Part C 100,000 + 10AA 200,000 = 4,017,000; AMT @18.5% = 743,145;
+ 4% cess = **772,871**. AMT (772,871) < normal (1,067,014) → normal tax charged; Schedule AMTC set off
₹50,000 of brought-forward s.115JD credit (AY 2023-24).

## Net liability, interest, refund
- After s.115JD credit: 1,067,014 − 50,000 = 1,017,014
- Less s.90/90A relief (Schedule TR, USA) 15,000 → **Net tax liability = 1,002,014**  ← `figures.net`
- 234A/234B/234C/234F all nil (filed on the due date; advance tax paid in four in-time instalments)
- Taxes paid = advance 950,000 + TDS 75,000 (194A 30,000, 194I(b) 40,000, 194S 5,000) + TCS 8,000 = 1,033,000
- **Balance payable = 0**; **Refund = 30,990** (rounded to the nearest 10)  ← `figures.refund`
