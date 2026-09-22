# The book of Schedules AMT · AMTC — ITR-2, A.Y. 2026-27

Read from the utility's **AMT** sheet (15 rows, **hidden**) and **AMTC** sheet
(27 rows), with the hidden-row flags, and confirmed against `ScheduleAMT` and
`ScheduleAMTC`.

---

## 1 · When AMT applies on ITR-2 — narrowly

Section 115JC charges an alternate minimum tax where the person has claimed
certain deductions that reduce normal tax below 18.5% of adjusted total income.
On ITR-2 the schedule is **hidden**, and of its three adjustment lines two are
hidden too:

| Line | Adjustment | On ITR-2 |
|---|---|---|
| 2a | Deduction claimed under any section of Chapter VI-A **Part C — "Deductions in respect of certain incomes"**, other than 80P | **live** |
| 2b | Deduction under section 10AA | **hidden** — no 10AA on ITR-2 |
| 2c | Deduction under section 35AD | **hidden** — business |

So on ITR-2 the only trigger is a **Part C deduction** — and from the VI-A book
the live Part C heads are **80QQB** (author's royalty) and **80RRB** (patent
royalty). Everything else in Part C (80IA to 80JJAA) is hidden as business.

And two more gates from the sheet:

- *"Tax payable under section 115JC — 18.5% of (3), if 3 is greater than ₹20
  lakhs"* — AMT arises only where **adjusted total income exceeds ₹20,00,000**.
- Under the **new regime** section 115JC does not apply at all — the whole
  schedule is nil.

So: an old-regime person, with adjusted total income over ₹20 lakh, who claimed
80QQB or 80RRB. That is the AMT population on ITR-2.

---

## 2 · Schedule AMT — the computation

| Item | Field | Formula |
|---|---|---|
| **1** | Total income as per item 12 of Part B-TI | `TotalIncItemPartBTI` |
| 2a | Deduction claimed under Chapter VI-A Part C | `DeductionClaimUndrAnySec` — the 80QQB + 80RRB allowed |
| **3** | Adjusted total income under 115JC(1) = 1 + 2a | `AdjustedUnderSec115JC` |
| **4** | Tax payable under 115JC — **18.5% of 3, if 3 > ₹20 lakh**, else nil | `TaxPayableUnderSec115JC` |

All four are schema-required when the block is present. The block is written
only when line 4 is non-zero — or, to be safe, whenever a Part C deduction is
claimed under the old regime.

The surcharge and cess on AMT are applied in Part B-TTI, not here — B-TTI
line 1 has its own `TaxPayDeemedTotIncUs115JC`, `Surcharge`, `HealthEduCess`,
`TotalTaxPayablDeemedTotInc`.

---

## 3 · Schedule AMTC — the credit

*"Computation of tax credit under section 115JD."* AMT paid in a year above the
normal tax becomes a **credit**, carried forward up to **fifteen years**, and
used in a later year when normal tax exceeds AMT.

### The head lines

| Item | Field | Formula |
|---|---|---|
| **1** | Tax under section 115JC in A.Y. 2026-27 — 1d of Part B-TTI | `TaxSection115JC` |
| **2** | Tax under other provisions of the Act in A.Y. 2026-27 — 7 of Part B-TTI | `TaxOthProvisions` |
| **3** | Amount of tax against which credit is available — **2 − 1 if 2 > 1, else nil** | `AmtTaxCreditAvailable` |
| **4** | Utilisation of AMT credit available — the table | |

### The table — thirteen years plus the current year

| Row | Assessment year | Gross (B1) | Set off in earlier years (B2) | Balance brought forward (B3) = B1 − B2 | Utilised this year (C) | Carried forward (D) = B3 − C |
|---|---|---|---|---|---|---|
| i–xiii | 2013-14 … 2025-26 | typed | typed | computed | computed — oldest first, up to line 3 | computed |
| xiv | **Current A.Y. 2026-27** — *enter 1 − 2 if 1 > 2, else 0* | this year's AMT above normal tax — becomes new credit | — | — | — | = gross |
| xv | Total | | | | | |

Schema: `ScheduleAMTC.ScheduleAMTCDtls[]` (max 13 rows, one per year,
`AssYr` from the 13-year enum) with `Gross`, `AmtCreditSetOfEy`,
`AmtCreditBalBroughtFwd`, `AmtCreditUtilized`, `BalAmtCreditCarryFwd`;
then `CurrAssYr` (2026-27), `CurrYrAmtCreditFwd`, `CurrYrCreditCarryFwd`;
totals `TotAMTGross`, `TotSetOffEys`, `TotBalBF`, `TotAmtCreditUtilisedCY`,
`TotBalAMTCreditCF`.

### The two closing lines

| Item | Field |
|---|---|
| **5** | Amount of tax credit under 115JD utilised during the year — total of column C | `TaxSection115JD` → goes to Part B-TTI as the credit against tax |
| **6** | Amount of AMT liability available for credit in subsequent years — total of column D | `AmtLiabilityAvailable` |

### The rules

- **Credit is used only when normal tax exceeds AMT** — line 3 is the ceiling on
  column C for the year.
- **Oldest year first** — the fifteen-year window runs out on the earliest row,
  so it is consumed first.
- **The current year's excess of AMT over normal tax is the new credit** — row
  xiv, from the same two figures with the sign reversed.
- Fifteen years: a credit from 2010-11 would have lapsed; the table's first
  row is 2013-14, which is fifteen years back from 2027-28 — the table is the
  window.

---

## 4 · What is mandatory

**AMT** — all four lines when present.
**AMTC** — lines 1, 2, 3, the current-year pair, the five totals, and lines 5
and 6; on each year row all six fields.

## 5 · What repeats

The AMTC year rows — up to thirteen, fixed years. Nothing else.

---

## 6 · What this means for the build

1. **The 10AA trigger is already gone** from Yukti's AMT engine (deleted with
   the deductions rebuild). What remains has to be pointed at the right thing:
   **AMT applies only under the old regime, only where 80QQB or 80RRB is
   allowed, and only where adjusted total income exceeds ₹20 lakh.** Today the
   engine tests "any Part C deduction other than 80CCD(2)" — too wide.
2. **Schedule AMT** — four computed lines in the tax section, shown only when
   the trigger is met.
3. **Schedule AMTC** — a fixed thirteen-year table with typed Gross and
   Set-off-earlier columns, the rest computed; the current-year row from this
   year's AMT and normal tax; lines 5 and 6.
4. **Part B-TTI** takes line 5 as the credit and, where AMT exceeds normal tax,
   AMT as the tax payable (its line 1d and 3).
5. **Export** — `ScheduleAMT` when AMT arises; `ScheduleAMTC` when a credit
   exists or arises.
