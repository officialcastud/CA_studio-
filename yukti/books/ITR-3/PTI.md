# The book of Schedule PTI — ITR-3, A.Y. 2026-27

Read row by row from the utility's **PTI** sheet (rows 3–51; no hidden rows),
with the formulas, dropdowns and the `SchedulePTI` schema block. Schedule
title (F3): *"PASS THROUGH INCOME DETAILS FROM BUSINESS TRUST OR INVESTMENT
FUND AS PER SECTION 115U,115UA, 115UB."* The note at row 51 (F51): *"Please
refer to the instructions for filling out this schedule."*

---

## The shape

Pass-through income that a business trust (REIT, InvIT), an investment fund
(AIF Cat I/II) or a venture capital company/fund earned and passed to the unit
holder, taxed in the unit holder's hands **under the head it had in the fund's
hands** — which is why there is one line per head (house property, capital
gains, other sources, exempt). The sheet ships **three fixed blocks** (rows 5,
20, 35; `D20=D5+1`, `D35=D20+1` number them), and the schema array
`SchedulePTIDtls[]` makes it **repeatable** — one object per trust or fund,
unlimited. Each block has three header fields then a fixed body of head rows
with four money columns (current-year income, share of loss distributed, net,
TDS). PTI is a disclosure of source; the net of each head reappears in that
head's own schedule.

## The items

Header of each block (columns 2–4):

| Col / Sl.No. (1) | Field label | Type | Schema key | Rule / notes |
|---|---|---|---|---|
| (1) SL.NO. | serial of the block | computed | *(array index)* | `D20=D5+1`, `D35=D20+1` |
| (2) | **INVESTMENT COVERED BY SECTION 115U/115UA/115UB** | dropdown | `SchedulePTIDtls[].InvstmntCvrdUs115UA115UB` | enum A-115UA; B-115UB; C-115U (see Dropdowns) |
| (3) | **Name of business trust/ investment fund** | string | `SchedulePTIDtls[].BusinessName` | required, maxLength 125 |
| (4) | **PAN of the business trust/ investment fund** | string | `SchedulePTIDtls[].BusinessPAN` | required, maxLength 10 |

Body — fixed rows, columns 5–10 (SL.NO. (5) · Head of income (6) · Current
year income (7) · Share of current year loss distributed by Investment fund
(8) · Net Income/ Loss 9=7-8 (9) · TDS on such amount, if any (10)):

| Sl. (5) | Head of income (6) | Type | Schema key (leaf object) | Rule / notes |
|---|---|---|---|---|
| i | **House property** | object | `SchedulePTIDtls[].IncFromHP` | `IncFromHP.AmountOfInc`, `IncFromHP.CurrYrLossShareByInvstFund`, `IncFromHP.NetIncomeLoss`, `IncFromHP.TDSAmount`; net `N5=L5-M5` |
| ii | **Capital Gains** — heading | — | `SchedulePTIDtls[].CapitalGainsPTI` | container object |
| ii a | **Short term** — heading | — | `CapitalGainsPTI.ShortTermCG` | `L7=L8+L9`, `M7=M8+M9`, `N7=N8+N9` |
| ii ai | **Section 111A** | object | `CapitalGainsPTI.STCG_Sec111A` | `.AmountOfInc`, `.CurrYrLossShareByInvstFund`, `.NetIncomeLoss`, `.TDSAmount`; `N8=L8-M8` |
| ii aii | **others** | object | `CapitalGainsPTI.STCG_Others` | `.AmountOfInc`, `.CurrYrLossShareByInvstFund`, `.NetIncomeLoss`, `.TDSAmount`; `N39=L39-M39` |
| ii b | **Long term** — heading | — | `CapitalGainsPTI.LongTermCG` | `L10=L11+L12`, `M10=M11+M12`, `N10=N11+N12` |
| ii bi | **Section 112A** | object | `CapitalGainsPTI.LTCG_Sec112A` | `.AmountOfInc`, `.CurrYrLossShareByInvstFund`, `.NetIncomeLoss`, `.TDSAmount`; `N41=L41-M41` |
| ii bii | **other than section 112A** | object | `CapitalGainsPTI.LTCG_Others` | `.AmountOfInc`, `.CurrYrLossShareByInvstFund`, `.NetIncomeLoss`, `.TDSAmount`; `N42=L42-M42` |
| iii | **Other Sources** — heading | — | `SchedulePTIDtls[].IncOthSrc` | `IncOthSrc.AmountOfInc`, `IncOthSrc.NetIncomeLoss`, `IncOthSrc.TDSAmount`; `L13=L14+L15`, `N13=N14+N15` |
| iii a | **Dividend** | object | `SchedulePTIDtls[].OS_Dividend` | `OS_Dividend.AmountOfInc`, `OS_Dividend.NetIncomeLoss`, `OS_Dividend.TDSAmount` |
| iii b | **others** | object | `SchedulePTIDtls[].OS_Others` | `OS_Others.AmountOfInc`, `OS_Others.NetIncomeLoss`, `OS_Others.TDSAmount` |
| iv | **Income claimed to be exempt** — heading | — | `SchedulePTIDtls[].IncClmdPTI` | `L16=L17+L18+L19`, `N16=N17+N18+N19` |
| iv a | **u/s** **10(23FBB)** | object | `IncClmdPTI.TotalSec23FBB` / `IncClmdPTI.Sec23FBB` | `TotalSec23FBB.AmountOfInc`, `TotalSec23FBB.NetIncomeLoss`, `TotalSec23FBB.TDSAmount`; `Sec23FBB.AmountOfInc`, `Sec23FBB.NetIncomeLoss`, `Sec23FBB.TDSAmount` |
| iv b | **u/s** — *specify code* | object | `IncClmdPTI.SecBIncExmptDtl` | `SecBIncExmptDtl.SectionCode`, `SecBIncExmptDtl.SecBCIncExmptDtl.AmountOfInc`, `.SecBCIncExmptDtl.CurrYrLossShareByInvstFund`, `.SecBCIncExmptDtl.NetIncomeLoss`, `.SecBCIncExmptDtl.TDSAmount` |
| iv c | **u/s** — *specify code* | object | `IncClmdPTI.SecCIncExmptDtl` | `SecCIncExmptDtl.SectionCode`, `SecCIncExmptDtl.SecBCIncExmptDtl.AmountOfInc`, `.SecBCIncExmptDtl.CurrYrLossShareByInvstFund`, `.SecBCIncExmptDtl.NetIncomeLoss`, `.SecBCIncExmptDtl.TDSAmount` |

`ShortTermCG` (the aggregate short-term object) carries its own leaves
`CapitalGainsPTI.ShortTermCG.AmountOfInc`,
`CapitalGainsPTI.ShortTermCG.CurrYrLossShareByInvstFund`,
`CapitalGainsPTI.ShortTermCG.NetIncomeLoss`,
`CapitalGainsPTI.ShortTermCG.TDSAmount`; and `LongTermCG` likewise
`CapitalGainsPTI.LongTermCG.AmountOfInc`,
`CapitalGainsPTI.LongTermCG.CurrYrLossShareByInvstFund`,
`CapitalGainsPTI.LongTermCG.NetIncomeLoss`,
`CapitalGainsPTI.LongTermCG.TDSAmount` — the ai/aii and bi/bii rows feed them.

The header row (row 4) also carries a helper label **HP_PTI** in column U — an
internal helper column that tags the house-property pass-through figure for the
cross-schedule check into Schedule HP; it is not a fillable item.

## The rules the sheet computes

- `[N5]=L5-M5` — HP net income/loss = current year income − share of loss.
- `[L7]=L8+L9`, `[M7]=M8+M9`, `[N7]=N8+N9` — short-term CG aggregates 111A + others.
- `[N8]=L8-M8` — STCG 111A net.
- `[L10]=L11+L12`, `[M10]=M11+M12`, `[N10]=N11+N12` — long-term CG aggregates 112A + other-than-112A.
- `[L13]=L14+L15`, `[N13]=N14+N15` — Other Sources aggregates dividend + others.
- `[L16]=L17+L18+L19`, `[N16]=N17+N18+N19` — exempt aggregates the three u/s rows.
- `[D20]=D5+1`, `[D35]=D20+1` — block serial numbers auto-increment.
- Block 3 shows the leaf nets explicitly: `[N35]=L35-M35`, `[N37]=L37-M37`, `[N38]=L38-M38`, `[N39]=L39-M39`, `[N40]=L40-M40`, `[N41]=L41-M41`, `[N42]=L42-M42`, `[N43]=L43+... ]`, `[N44]=L44-M44`, `[N45]=L45-M45`, `[N47]=L47-M47`, `[N48]=L48-M48`, `[N49]=L49-M49` — the same `net = income − loss` per leaf, and the same aggregate pattern (`L22=L23+L24`, `M22=M23+M24`, `N22=N23+N24`, `L25=L26+L27`, `N28=N29+N30`, `L31=L32+L33+L34`, etc.) repeats for blocks 2 and 3.
- Cross-sheet (rules.json): *"In Schedule HP, Sl.No. 2 'Pass through income' should be equal to the amount of net income/ loss of HP mentioned in Schedule PTI"* (line 1110) — the HP net (`IncFromHP.NetIncomeLoss`) must equal Schedule HP item 2.
- Cross-sheet (rules.json): the OS quarterly dividend breakups at OS Sl.No. 10 are *"(Including PTI Income)"* (lines 2675–2730) — PTI dividend flows into Schedule OS.
- Cross-sheet (rules.json): Schedule SI treats **PTI 112A (12.5%)** and **STCG PTI@20%** as special-rate items (lines 4280–4285).

## Dropdowns

- **INVESTMENT COVERED BY SECTION 115U/115UA/115UB** (cells `E5`, `E20`, `E35`): **(Select)**, **Section 115U**, **Section 115UA**, **Section 115UB**. Maps to schema enum `InvstmntCvrdUs115UA115UB`: **A - 115UA**, **B - 115UB**, **C - 115U**.
- Name cells `F5 F20 F35` use validation source `125` (max-length 125, free text — no value list).
- PAN cells `G5 G20 G35` use validation source `10` (max-length 10, free text — no value list).
- Section-code cells `K18:K19 K33:K34 K48:K49` (the u/s specify boxes for iv b / iv c) use validation source `10` (max-length 10, free text — no value list).
- Money cells use numeric validation (`0` / `-99999999999999` floors); no value lists.

## What repeats and what is one figure

- **Repeats**: the whole block — `SchedulePTIDtls[]` is an array, one object per business trust / investment fund (the sheet pre-draws three; more can be added).
- **One figure per block**: the entity-type code, name, PAN, and each of the fixed head objects (HP, the six CG leaves, OtherSources + Dividend + Others, and the three exempt objects). There is no schedule-level grand total figure in `SchedulePTI` — each head's net flows to its own schedule.

## Mandatory

Schema `required` keys (marked `*`), per `SchedulePTIDtls[]` element:
`InvstmntCvrdUs115UA115UB`, `BusinessName`, `BusinessPAN`, `IncFromHP`
(with required `AmountOfInc`, `CurrYrLossShareByInvstFund`, `NetIncomeLoss`,
`TDSAmount`), `CapitalGainsPTI` (with required `ShortTermCG`, `STCG_Sec111A`,
`STCG_Others`, `LongTermCG`, `LTCG_Sec112A`, `LTCG_Others`, each with required
`AmountOfInc`, `CurrYrLossShareByInvstFund`, `NetIncomeLoss`, `TDSAmount`),
`IncClmdPTI` (with required `TotalSec23FBB` and `Sec23FBB`, each with required
`AmountOfInc`, `NetIncomeLoss`, `TDSAmount`), `IncOthSrc`, `OS_Dividend`,
`OS_Others` (each with required `AmountOfInc`, `NetIncomeLoss`, `TDSAmount`).
`SchedulePTI` itself and `SchedulePTIDtls` array are **not** required (the whole
schedule is optional). `SecBIncExmptDtl` and `SecCIncExmptDtl` (the iv b / iv c
optional-section objects) are **not** required.

## Hidden rows — not built

None. Every row 3–51 of the PTI sheet is visible; no row carries the `H`
hidden flag. (The `HP_PTI` label in column U is a helper-column tag, not a
hidden fillable row.)

## What this means for the build

1. **Repeatable block**: header (entity type dropdown, name, PAN) then the
   fixed head body; add/dustbin per block; `SchedulePTIDtls[]` is the array.
2. The dropdown must offer all four values including **Section 115U** (the
   ITR-3 addition over the 115UA/115UB-only case) and store the enum code
   A/B/C accordingly.
3. **Computed, untypeable, green**: net columns (`net = income − loss`) and the
   CG/OS/exempt aggregate rows; the block serial numbers.
4. **Cross-schedule checks**: HP net (`IncFromHP.NetIncomeLoss`) → Schedule HP
   item 2; dividend PTI → Schedule OS Sl.No. 10 quarterly breakup; STCG 111A /
   LTCG 112A pass-through → Schedule SI special rates; column 10 TDS → Schedule
   TDS with the head of income set.
5. **Export**: `SchedulePTI.SchedulePTIDtls[]` with every required head object
   present (zero where empty); emit `SectionCode` + nested `SecBCIncExmptDtl`
   only when the iv b / iv c exempt rows are used.


## Additional visible rows — verbatim from the sheet (completeness)
Rows present on the utility sheet and captured here verbatim so every visible label is in the book:

- Schedule PTI
- Head of income (6)
- Net Income/ Loss 9=7-8 (9)
- TDS on such amount, if any (10)
- Section 111A
- Section 112A
