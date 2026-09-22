# The book of Schedules PTI · ESOP · 5A — ITR-2, A.Y. 2026-27

Read row by row from the utility's **PTI** sheet (54 rows), **ESOP** sheet
(83 rows) and **Sch 5A** sheet, with the hidden-row flags, and confirmed
against `SchedulePTI`, `ScheduleESOP` and `Schedule5A2014`.

---

## Part 1 · Schedule PTI — Pass-through income from a business trust or investment fund

*"Pass through income details from business trust or investment fund as per
section 115UA, 115UB."* Income that a REIT, InvIT or AIF earned and passed to
the unit holder, taxed in the unit holder's hands **under the head it had in
the trust's hands** — which is why the OS, CG, HP and EI schedules each have a
pass-through line.

### The shape — one block per trust or fund, unlimited

The sheet ships **three blocks**; the VBA adds more. Each block:

**Header**

| Column | Field | Rule |
|---|---|---|
| 2 | **Investment entity covered by** | dropdown: **A — 115UA (business trust: REIT, InvIT) · B — 115UB (investment fund: AIF Cat I, II) · C — 115U (venture capital)** |
| 3 | **Name of the business trust or investment fund** | required, max 125 |
| 4 | **PAN of the trust or fund** | required |

**Body — one row per head, fixed rows:**

| Sl. | Head of income | Current year income (7) | Share of current year loss distributed by the fund (8) | Net income or loss 9 = 7 − 8 | TDS on it (10) |
|---|---|---|---|---|---|
| i | House property | | | | |
| ii | Capital gains — heading | | | | |
| ii a | Short term — heading | | | | |
| ii a(i) | **Short term under 111A** | | | | |
| ii a(ii) | **Short term, others** | | | | |
| ii b | Long term — heading | | | | |
| ii b(i) | **Long term under 112A** | | | | |
| ii b(ii) | **Long term, other than 112A** | | | | |
| iii | Other sources — heading | | | | |
| iii a | **Dividend** | | | | |
| iii b | **Others** | | | | |
| iv | Income claimed to be exempt — heading | | | | |
| iv a | **under section 10(23FBB)** | | | | |
| iv b | under section — *specify* | | | | |
| iv c | under section — *specify* | | | | |

Column 8 — *share of the current-year loss distributed* — exists because an
investment fund may pass a loss through; the net in column 9 can be negative,
and it then goes to the head's schedule as a loss (CYLA for HP and OS).

Schema: `SchedulePTI.SchedulePTIDtls[]` — `InvstmntCvrdUs115UA115UB` (A/B/C),
`BusinessName`, `BusinessPAN`, then `IncFromHP`, `CapitalGainsPTI{ShortTermCG,
STCG_Sec111A, STCG_Others, LongTermCG, LTCG_Sec112A, LTCG_Others}`,
`IncOthSrc`, `OS_Dividend`, `OS_Others`, `IncClmdPTI{TotalSec23FBB, Sec23FBB,
SecBIncExmptDtl, SecCIncExmptDtl}` — each leaf an object of `AmountOfInc`,
`CurrYrLossShareByInvstFund`, `NetIncomeLoss`, `TDSAmount`.

### Where each row goes

| PTI row | Lands in |
|---|---|
| i — house property | Schedule HP item 2 |
| ii a(i) — STCG 111A | Schedule CG A8, the 20% slot |
| ii a(ii) — STCG others | Schedule CG A8, applicable rate |
| ii b(i) — LTCG 112A | Schedule CG B11, the 112A 12.5% slot |
| ii b(ii) — LTCG others | Schedule CG B11, the other 12.5% slot |
| iii a — dividend | Schedule OS 2e, or 1a if at normal rates |
| iii b — others | Schedule OS 1b(iv) (interest) or 2e (special rate) |
| iv — exempt | Schedule EI, the pass-through line |
| column 10 — TDS | Schedule TDS 2, with head of income set accordingly |

The sheet's note: *"Please refer to the instructions for filling out this
schedule."* — because the same amount must appear twice: here, and in the
destination schedule. PTI is a disclosure of source; it does not itself add to
income.

### What is mandatory

On every block: the entity type, name, PAN, and every one of the head objects
(the schema marks them all required, at zero if nothing).

---

## Part 2 · Schedule ESOP — Tax deferred on ESOPs of an eligible start-up

*"Information related to tax deferred — relatable to income on perquisites
referred in section 17(2)(vi) received from the employer, being an eligible
start-up referred to in section 80-IAC."* Section 192(1C): tax on the ESOP
perquisite is **deferred** until the earliest of — the shares are sold, the
person leaves the employer, or 48 months pass from the end of the assessment
year of allotment.

### The header

| Field | Rule |
|---|---|
| **PAN of the employer, being an eligible start-up** | required |
| **DPIIT registration number of the employer** | required |

### The main table — one row per assessment year of allotment

Six fixed rows, 2021-22 to 2026-27:

| Col | Field |
|---|---|
| 2 | Assessment year |
| 3 | **Amount of tax deferred brought forward** from that year |
| 4(i) | *Has any event occurred?* — **such securities were sold** — specify the date and amount; **FS — fully sold · PS — partly sold · NS — not sold** |
| 4(ii) | Total of the sale table below |
| 5(i) | **Ceased to be an employee** — Y/N, and the **date of ceasing** |
| 6 | **Forty-eight months have expired** from the end of the relevant assessment year — Y/N |
| 7 | **Amount of tax payable in the current assessment year** — the deferred tax that has fallen due on the event |
| 8 | **Balance tax deferred, carried forward** = 3 − 7 |

The 2026-27 row has only the balance column — an allotment this year has
nothing yet to bring forward.

### The sale table — for 4(ii)

*"Leave blank if the securities were not sold."* One row per sale, per year:

| Column |
|---|
| Assessment year of allotment (i) |
| **Date** of sale (ii) — `DD/MM/YYYY` |
| **Amount of tax attributed** to that sale (iii) |

Schema: `ScheduleESOP` — `PanofStartUp`, `DPIITRegNo`, then one object per
year `ScheduleESOP2122_Type` … `ScheduleESOP2627_Type`, each with
`AssessmentYear`, `TaxDeferredBFEarlierAY`,
`ScheduleESOPEventDtls{SecurityType (FS/PS/NS), ScheduleESOPEventDtlsType[]
{Date, TaxAttributedAmt}, CeasedEmployee (Y/N), DateOfCeasing}`,
`TotalTaxAttributedAmt21` (…22, 23, 24, 25), `TaxPayableCurrentAY`,
`BalanceTaxCF`; and `TotalTaxAttributedAmt` for the whole schedule.

### The rules

- Tax **falls due** in the year of the earliest event: a sale (to the extent of
  the shares sold), leaving the employer (all of it), or the 48-month expiry
  (all of it).
- Column 7 on each year row is the amount that has fallen due; it goes to Part
  B-TTI as tax payable this year.
- Column 8 carries the rest to next year's ESOP schedule.
- Every year with a brought-forward amount needs its event answers.

### What is mandatory

PAN of the start-up, DPIIT number, `TotalTaxAttributedAmt`. On any year object
present, the assessment year.

---

## Part 3 · Schedule 5A — Apportionment between spouses under the Portuguese Civil Code

*"Information regarding apportionment of income between spouses governed by
Portuguese Civil Code."* Section 5A: in Goa, Dadra & Nagar Haveli, Daman &
Diu, income other than salary is treated as **half the husband's and half the
wife's**. The schedule appears only where the Part A General answer *"Are you
governed by the Portuguese Civil Code under section 5A?"* is Yes.

### The header

| Field | Rule |
|---|---|
| **Name of the spouse** | required, max 125 |
| **PAN of the spouse** | required |
| Aadhaar of the spouse | optional |
| *Whether the spouse's books are audited under 44AB / 92E* | **hidden** — business; not on ITR-2 |

### The table — one row per head

| Head (i) | Receipts received under the head (ii) | Amount apportioned to the spouse (iii) | TDS deducted on (ii) (iv) | TDS apportioned to the spouse (v) |
|---|---|---|---|---|
| House property | | | | |
| *Business or profession* | **hidden** | | | |
| Capital gains | | | | |
| Other sources | | | | |
| **Total** | computed | computed | computed | computed |

Schema: `Schedule5A2014` — `NameOfSpouse`, `PANOfSpouse`, `AadhaarOfSpouse`,
then `HPHeadIncome`, `CapGainHeadIncome`, `OtherSourcesHeadIncome`,
`TotalHeadIncome`, each `{IncRecvdUndHead, AmtApprndOfSpouse, AmtTDSDeducted,
TDSApprndOfSpouse}`. **All required** when the block is present.

### The rules

- Column (ii) is the **whole** receipt under the head; column (iii) is the
  spouse's half; the person's own schedules carry the **other half**.
- Salary is not apportioned — no salary row.
- The TDS in column (v) goes to the spouse; the person's own Schedule TDS 2 and
  TDS 3 then carry the credit as "relating to other person — spouse under
  section 5A", which is the O / 2 code and the spouse's PAN in those tables.

### What is mandatory

Everything except Aadhaar, when the block is present.

---

## What this means for the build

1. **PTI** — a repeatable block: three header fields, then the fourteen fixed
   rows with four columns each, net computed. A check that each row's net
   reappears in its destination schedule. Rows to Part B-TI's pass-through
   lines.
2. **ESOP** — a card with the two header fields, the six-year table with the
   event columns, and the sale sub-table per year; column 7 to Part B-TTI.
3. **5A** — opens from the Part A answer; three header fields and the
   three-row table with totals; the spouse's PAN flows to the TDS tables as the
   "other person".
4. **Export** — `SchedulePTI.SchedulePTIDtls[]` with every head object present;
   `ScheduleESOP` with the year objects and the total; `Schedule5A2014` with
   all four head objects.
