# The book of Schedule PTI — ITR-6, A.Y. 2026-27

Read row by row from the utility's **PTI** sheet (49 rows, all visible), with the
hidden-row flags, the dropdowns and the cell formulas, and confirmed against the
schema block `SchedulePTI`. Item numbers (i / iia / iib / iii / iv, and the
column numbers 1–10) are taken from the ITR-6 validation-rules document
(rules 661–665, 186, 469, 646), never from counting rows.

---

## Schedule PTI — Pass-through income from a business trust or investment fund

*"Schedule PTI — PASS THROUGH INCOME DETAILS FROM BUSINESS TRUST OR INVESTMENT
FUND AS PER SECTION 115U, 115UA, 115UB."* Income that a REIT, InvIT, AIF or
venture-capital fund earned and passed to the company as a unit holder, taxed in
the company's hands **under the head it had in the fund's hands** — which is why
the HP, CG, OS and EI schedules each carry a pass-through line that PTI feeds.
PTI is a disclosure of source; it does not itself add to income.

### The shape — one block per trust or fund (three shipped, VBA adds more)

Each block has a three-field header and a fixed body of fifteen head rows with
four money columns.

**Header — columns 2, 3, 4:**

| Col | Item | Field | Type / enum | Schema key |
|---|---|---|---|---|
| E | (2) | **INVESTMENT ENTITY COVERED BY SECTION 115U/115UA/115UB** | dropdown **(Select) / Section 115U / Section 115UA / Section 115UB** | `InvstmntCvrdUs115UA115UB` |
| F | (3) | **Name of business trust/ investment fund** | text, max 125, required | `BusinessName` |
| G | (4) | **PAN of the business trust/ investment fund** | PAN, max 10, required | `BusinessPAN` |

**Body — the four money columns on every head row:**

| Col | No. | Heading |
|---|---|---|
| L | (7) | **Current year income** |
| M | (8) | **Share of current year loss distributed by Investment fund** |
| N | (9) | **Net Income/Loss 9=7-8** (computed) |
| O | (10) | **TDS on such amount, if any** |

**The head rows (column 6, the sheet's own lettering):**

| Sl. (5) | Head of income (6) | Schema leaf under `SchedulePTIDtls[]` |
|---|---|---|
| i | **House property** | `IncFromHP` |
| ii | **Capital Gains** (heading) | `CapitalGainsPTI` |
| ii a | **Short term** (heading) | `CapitalGainsPTI.ShortTermCG` |
| ii a i | **Section 111A** | `CapitalGainsPTI.STCG_Sec111A` |
| ii a ii | **Others** | `CapitalGainsPTI.STCG_Others` |
| ii b | **Long term** (heading) | `CapitalGainsPTI.LongTermCG` |
| ii b i | **Section 112A** | `CapitalGainsPTI.LTCG_Sec112A` |
| ii b ii | **Sections other than 112A** | `CapitalGainsPTI.LTCG_Others` |
| iii | **Other Sources** (heading) | `IncOthSrc` |
| iii a | **DIVIDEND** | `OS_Dividend` |
| iii b | **Others** | `OS_Others` |
| iv | **Income claimed to be exempt** (heading) | `IncClmdPTI` |
| iv a | **u/s 10(23FBB)** | `IncClmdPTI.TotalSec23FBB` / `Sec23FBB` |
| iv b | **u/s** — *specify section* | `IncClmdPTI.SecBIncExmptDtl` (`SectionCode` + amounts) |
| iv c | **u/s** — *specify section* | `IncClmdPTI.SecCIncExmptDtl` (`SectionCode` + amounts) |

Column 8 — *share of the current-year loss distributed* — exists because an
investment fund may pass a loss through; the net in column 9 can be negative and
then goes to the head's schedule as a loss (CYLA for HP and OS). Each money leaf
is an object of `AmountOfInc` (col 7), `CurrYrLossShareByInvstFund` (col 8, on
the HP and CG objects), `NetIncomeLoss` (col 9) and `TDSAmount` (col 10).

### The dropdown

| Column | Values |
|---|---|
| E — investment entity covered by | **(Select)**, **Section 115U**, **Section 115UA**, **Section 115UB** |

### Schema

`SchedulePTI.SchedulePTIDtls[]` — one object per fund with
`InvstmntCvrdUs115UA115UB`, `BusinessName`, `BusinessPAN`, then the head objects:
`IncFromHP`, `CapitalGainsPTI{ShortTermCG, STCG_Sec111A, STCG_Others, LongTermCG,
LTCG_Sec112A, LTCG_Others}`, `IncOthSrc`, `OS_Dividend`, `OS_Others`,
`IncClmdPTI{TotalSec23FBB, Sec23FBB, SecBIncExmptDtl{SectionCode, SecBCIncExmptDtl},
SecCIncExmptDtl{SectionCode, SecBCIncExmptDtl}}`. Each money leaf carries
`AmountOfInc`, `CurrYrLossShareByInvstFund` (HP/CG only), `NetIncomeLoss`,
`TDSAmount`. Required on every block: `InvstmntCvrdUs115UA115UB`, `BusinessName`,
`BusinessPAN`, and each head object's `AmountOfInc`, `NetIncomeLoss`, `TDSAmount`
(and `CurrYrLossShareByInvstFund` where present); `SectionCode` on the iv b / iv c
exempt objects.

### The rules the sheet computes

- Rule **661** (Category A): Col. **9** = Col. **7 − 8** on every head row
  (`NetIncomeLoss = AmountOfInc − CurrYrLossShareByInvstFund`).
- Rule **662**: Sl. No. **iia Short Term** = ai + aii.
- Rule **663**: Sl. No. **iib Long Term** = bi + bii.
- Rule **664**: Sl. No. **iii Other Sources** = a + b.
- Rule **665**: Sl. No. **iv Income claimed to be exempt** = a + b + c.

### Where each row goes

| PTI row | Lands in |
|---|---|
| i — house property | Schedule HP item **2** (rule 186) |
| ii a i — STCG 111A | Schedule CG A8, the 111A slot / Schedule SI (rules 628, 642) |
| ii a ii — STCG others | Schedule CG A8b / Schedule SI @30% (rules 619, 643) |
| ii b i — LTCG 112A | Schedule CG B10a1 / Schedule SI 112A (rule 644) |
| ii b ii — LTCG other than 112A | Schedule CG / Schedule SI (rule 645) |
| iii a — dividend | Schedule OS 2 (rule 469) |
| iii b — others | Schedule OS 2 (rules 469, 487) |
| iv — exempt | Schedule EI item **5** — pass-through not chargeable (rule 646) |
| column 10 — TDS | Schedule TDS, with the head of income set accordingly |

### What is mandatory

On every block: the entity type (115U/115UA/115UB), name, PAN, and each head
object present (the schema marks the money leaves required, at zero if nothing).

### Hidden rows

None. All 49 rows of the PTI sheet (3–49) are visible; the three shipped blocks
occupy rows 5–19, 20–34 and 35–49.

### What this means for the build

A repeatable block: three header fields (one dropdown) then the fifteen fixed
head rows with four columns each, net (col 9) computed as 7 − 8 and the iia/iib/
iii/iv headings computed as the sums of their sub-rows. A check that each row's
net reappears in its destination schedule (HP 2, CG A8/B10, OS 2, EI 5) and that
the TDS reaches Schedule TDS. Export `SchedulePTI.SchedulePTIDtls[]` with every
head object present.
