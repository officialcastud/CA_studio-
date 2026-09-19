# Schedule PTI — ITR-5, A.Y. 2026-27

Block: **SchedulePTI** · section `other` (from `books/ITR-5/section_map.json`: `"Schedule PTI" => {"blocks": ["SchedulePTI"], "section": "other"}`).

Sheet title (`[C3]`): **Schedule PTI**, subtitle `[E3]`: *"PASS THROUGH INCOME DETAILS FROM BUSINESS TRUST OR INVESTMENT FUND AS PER SECTION 115U,115UA AND 115…"* (dump truncates at 100 chars) — pass-through income (PTI) distributed to the assessee by a **business trust** (REIT/InvIT, u/s 115UA) or an **investment fund** (AIF Cat I/II, u/s 115UB), and securitisation trust income u/s 115U. The character of the income (house property / capital gains / other sources / exempt) is retained in the hands of the unit-holder, so PTI is reported head-wise here and then flows into the corresponding head schedules (HP, CG, OS) and Schedule EI.

## The shape

A **repeating per-fund grid**: one block per business trust / investment fund from which PTI is received. The schema block `SchedulePTIDtls` is an unbounded **`array`**, so the built form must offer **add-row (add-fund)** rather than fix the two template blocks.

Each fund block is a **fixed head-wise ladder** of income lines (`[H]` column carries the roman/letter Sl. No. `(5)`; `[I]`/`[J]`/`[K]` carry the head label `(6)`), with four money columns per line: Col 7 current-year income, Col 8 share of current-year loss distributed by the fund, Col 9 net income/loss (= 7 − 8), Col 10 TDS.

In the utility template the ladder occupies:
- **Fund 1**: rows **6–20** (Sl. No. `D6` = `(1)`, entity type `E6`).
- **Fund 2**: rows **21–35** (serial `D21 = D6+1`, entity type `E21`) — a verbatim repeat of the same ladder, present only to show the grid repeats.

The head ladder inside one fund block:
- **i** House property (row 6)
- **ii** Capital Gains (row 7) → **a** Short term (row 8: Section 111A row 9, Others row 10) · **b** Long term (row 11: Section 112A row 12, Sections other than 112A row 13)
- **iii** Other Sources (row 14: DIVIDEND row 15, Others row 16)
- **iv** Income claimed to be exempt (row 17: **a** u/s 10(23FBB) row 18, **b** u/s row 19, **c** u/s row 20)

One dropdown governs each block: **Col 2 — investment entity type** (`E6`/`E21`), which selects 115U / 115UA / 115UB.

## The items

Sl. No. as lettered on the sheet (`[H]`/`[I]`/`[J]` column) with the header column `[r4]`/`[r5]` in parentheses. `[cell]` is the utility template cell for **Fund 1** (rows 6–20; Fund 2 = rows 21–35, same layout). "Type" is the schema type. Schema key = leaf path under `SchedulePTIDtls[]` (all keys quoted verbatim from `--leaves SchedulePTI`).

### Fund header (per array element — one figure each)

| Sl. No. | Cell (Fund 1) | Field (header `[r4]`) | Type | Schema key | Rule |
|---------|---------------|-----------------------|------|------------|------|
| (1) | `D6` | Sl. No. `(1)` | int | *(array index, not in schema)* | Auto serial: `D21 = D6+1` |
| (2) | `E6` | INVESTMENT ENTITY COVERED BY SECTION 115U/115UA/115UB `(2)` | string | `SchedulePTIDtls[].InvstmntCvrdUs115UA115UB` | **Dropdown** (Select / Section 115U / Section 115UA / Section 115UB); stored as code `A - 115UA; B - 115UB; C - 115U`. **Mandatory** |
| (3) | `F6` | Name of business trust/ investment fund `(3)` | string | `SchedulePTIDtls[].BusinessName` | Text, maxLength 125 (validation source `125`). **Mandatory** |
| (4) | `G6` | PAN of the business trust/ investment fund `(4)` | string | `SchedulePTIDtls[].BusinessPAN` | PAN, 10 chars (validation source `10`). **Mandatory** |

### i — House property (row 6)

| Sl. No. | Field | Cells | Schema key | Rule |
|---------|-------|-------|------------|------|
| i | House property `(5)/(6)` | `L6`/`M6`/`N6`/`O6` | `SchedulePTIDtls[].IncFromHP` | object |
| — | Current year income `(7)` | `L6` | `IncFromHP.AmountOfInc` | integer, 0 … 99999999999999 |
| — | Share of current year loss distributed by Investment fund `(8)` | `M6` | `IncFromHP.CurrYrLossShareByInvstFund` | integer, 0 … 99999999999999 |
| — | Net Income/Loss `(9)` | `N6` | `IncFromHP.NetIncomeLoss` | **Computed** `N6 = L6-M6`; −1e14 … 1e14 |
| — | TDS on such amount, if any `(10)` | `O6` | `IncFromHP.TDSAmount` | integer, 0 … 99999999999999 |

### ii — Capital Gains (row 7, group label; no own figure)

`SchedulePTIDtls[].CapitalGainsPTI` (object grouping Short term + Long term; no ST+LT total on the sheet).

**ii a — Short term (row 8, subtotal)** → `CapitalGainsPTI.ShortTermCG`

| Sl. No. | Field | Cells | Schema key | Rule |
|---------|-------|-------|------------|------|
| a | Short term (subtotal) | `L8`/`M8`/`N8`/`O8` | `CapitalGainsPTI.ShortTermCG.AmountOfInc` / `.CurrYrLossShareByInvstFund` / `.NetIncomeLoss` / `.TDSAmount` | **Computed** `L8=L9+L10`, `M8=M9+M10`, `N8=N9+N10` |
| ai | Section 111A (row 9) | `L9`/`M9`/`N9`/`O9` | `CapitalGainsPTI.STCG_Sec111A.AmountOfInc` / `.CurrYrLossShareByInvstFund` / `.NetIncomeLoss` / `.TDSAmount` | `N9 = L9-M9` |
| aii | Others (row 10) | `L10`/`M10`/`N10`/`O10` | `CapitalGainsPTI.STCG_Others.AmountOfInc` / `.CurrYrLossShareByInvstFund` / `.NetIncomeLoss` / `.TDSAmount` | net = L−M |

**ii b — Long term (row 11, subtotal)** → `CapitalGainsPTI.LongTermCG`

| Sl. No. | Field | Cells | Schema key | Rule |
|---------|-------|-------|------------|------|
| b | Long term (subtotal) | `L11`/`M11`/`N11`/`O11` | `CapitalGainsPTI.LongTermCG.AmountOfInc` / `.CurrYrLossShareByInvstFund` / `.NetIncomeLoss` / `.TDSAmount` | **Computed** `L11=L12+L13`, `M11=M12+M13`, `N11=N12+N13` |
| bi | Section 112A (row 12) | `L12`/`M12`/`N12`/`O12` | `CapitalGainsPTI.LTCG_Sec112A.AmountOfInc` / `.CurrYrLossShareByInvstFund` / `.NetIncomeLoss` / `.TDSAmount` | net = L−M |
| bii | Sections other than 112A (row 13) | `L13`/`M13`/`N13`/`O13` | `CapitalGainsPTI.LTCG_Others.AmountOfInc` / `.CurrYrLossShareByInvstFund` / `.NetIncomeLoss` / `.TDSAmount` | net = L−M |

### iii — Other Sources (row 14, subtotal)

`SchedulePTIDtls[].IncOthSrc` (note: **no** `CurrYrLossShareByInvstFund` under Other Sources — Col 8 is not captured for OS in the schema).

| Sl. No. | Field | Cells | Schema key | Rule |
|---------|-------|-------|------------|------|
| iii | Other Sources (subtotal) | `L14`/`N14`/`O14` | `IncOthSrc.AmountOfInc` / `.NetIncomeLoss` / `.TDSAmount` | **Computed** `L14=L15+L16`, `M14=M15+M16`, `N14=N15+N16` |
| — DIVIDEND (row 15) | DIVIDEND | `L15`/`N15`/`O15` | `OS_Dividend.AmountOfInc` / `.NetIncomeLoss` / `.TDSAmount` | `SchedulePTIDtls[].OS_Dividend` |
| — Others (row 16) | Others | `L16`/`N16`/`O16` | `OS_Others.AmountOfInc` / `.NetIncomeLoss` / `.TDSAmount` | `SchedulePTIDtls[].OS_Others` |

### iv — Income claimed to be exempt (row 17, subtotal)

`SchedulePTIDtls[].IncClmdPTI` (note: **no** `CurrYrLossShareByInvstFund` under exempt income).

| Sl. No. | Field | Cells | Schema key | Rule |
|---------|-------|-------|------------|------|
| iv | Income claimed to be exempt (subtotal) | `L17`/`N17`/`O17` | `IncClmdPTI.TotalSec23FBB.AmountOfInc` / `.NetIncomeLoss` / `.TDSAmount` | **Computed** `L17=L18+L19+L20`, `M17=M18+M19+M20`, `N17=N18+N19+N20` |
| iv a | u/s 10(23FBB) (row 18) | `K18`=`10(23FBB)`, `L18`/`N18`/`O18` | `IncClmdPTI.Sec23FBB.AmountOfInc` / `.NetIncomeLoss` / `.TDSAmount` | `N18 = L18-M18`; section fixed at `10(23FBB)` |
| iv b | u/s (row 19) | `K19`, `L19`/`N19`/`O19` | `IncClmdPTI.SecBIncExmptDtl.SectionCode` + `.SecBCIncExmptDtl.AmountOfInc` / `.NetIncomeLoss` / `.TDSAmount` | `SectionCode` text maxLength 10; `N19 = L19-M19`. **Optional** |
| iv c | u/s (row 20) | `K20`, `L20`/`N20`/`O20` | `IncClmdPTI.SecCIncExmptDtl.SectionCode` + `.SecBCIncExmptDtl.AmountOfInc` / `.NetIncomeLoss` / `.TDSAmount` | `SectionCode` text maxLength 10; `N20 = L20-M20`. **Optional** |

## The rules the sheet computes (with cell references)

Per-line and subtotal formulas (Fund 1 cells shown; Fund 2 rows 21–35 are identical, offset by +15):

- **Net Income/Loss `(9)` = Col 7 − Col 8**, every line: `N6=L6-M6`, `N9=L9-M9`, `N18=L18-M18`, `N19=L19-M19`, `N20=L20-M20` (and Fund 2 `N21=L21-M21`, `N24=L24-M24`, …). Rule **A745**: *"In Schedule PTI, Col. 9 should be equal to Col. 7-8"*.
- **iia Short term subtotal**: `L8=L9+L10`, `M8=M9+M10`, `N8=N9+N10`. Rule **A746**: *"Sl. No. iia Short Term should be equal to sum of ai+aii"*.
- **iib Long term subtotal**: `L11=L12+L13`, `M11=M12+M13`, `N11=N12+N13`. Rule **A747**: *"Sl. No. iib Long Term should be equal to sum of bi+bii"*.
- **iii Other Sources subtotal**: `L14=L15+L16`, `M14=M15+M16`, `N14=N15+N16`. Rule **A748**: *"Sl. No. iii Other Sources should be equal to sum of a+b"*.
- **iv Income claimed to be exempt subtotal**: `L17=L18+L19+L20`, `M17=M18+M19+M20`, `N17=N18+N19+N20`. Rule **A749**: *"Sl. No. iv Income claimed to be exempt should be equal to sum of a+b+c"*.
- **Serial**: `D21 = D6+1` (fund serial auto-increments).

### How PTI ties to the head schedules (cross-schedule)

- **→ Schedule HP** — Rule **A203**: *"In Schedule HP, Sl.no 2 Pass through income should be equal to the amount of net income/ loss of HP mentioned in Schedule PTI"* — i.e. the sum of `IncFromHP.NetIncomeLoss` (Col 9, row i) over all funds feeds Schedule HP Sl. No. 2.
- **→ Schedule CG** — Rule **A385**: *"In Schedule CG B10 Pass Through Income in the nature of Long Term Capital Gain should be equal to the sum of individual amounts"* — CG B10 draws from the LTCG PTI lines (rows 12/13, `LTCG_Sec112A` + `LTCG_Others`); STCG PTI (rows 9/10) feeds the corresponding CG STCG pass-through line.
- **→ Schedule OS** — Rule **A477**: *"amount of 'Pass through income in the nature of income from other sources chargeable at special rates' should be equal to the sum of … individual values entered in amount col"* — the OS PTI line (rows 15/16, `OS_Dividend` + `OS_Others`) feeds Schedule OS Sl. No. 2d (special-rate PTI).
- **→ Schedule EI** — Rule **A732**: *"In Schedule EI, sl.no.5 should be equal to amount in sl.no.1(iv)(a+b+c) of Schedule PTI"* — the exempt PTI subtotal (row 17, `IncClmdPTI.TotalSec23FBB`) feeds Schedule EI Sl. No. 5.

## Dropdowns

Only one real value-list dropdown; the other validation entries (`F6`/`F21` source `125`, `G6`/`G21` source `10`, `K19`/`K20`/`K34`/`K35` source `10`, and the numeric `0` / `-99999999999999` sources on the money cells) are length/min-value constraints with `values: null`, not selectable lists.

- **`E6` / `E21` — INVESTMENT ENTITY COVERED BY SECTION 115U/115UA/115UB** (source `"(Select),Section 115U,Section 115UA,Section 115UB"`):
  - `(Select)`
  - `Section 115U`
  - `Section 115UA`
  - `Section 115UB`

Stored to schema `InvstmntCvrdUs115UA115UB` as the coded value: **A - 115UA · B - 115UB · C - 115U** (schema enum description).

`K18` / `K33` carry the fixed label `10(23FBB)` for the iv-a exempt line (not a user choice).

## What repeats and what is one figure

- **Repeats (per fund / array element `SchedulePTIDtls[]`)**: the entire block — investment-entity type, name, PAN, and the full head-wise ladder (rows i–iv with all money columns). The template shows two fund blocks (rows 6–20 and 21–35), but the schema array is unbounded → **build add-row (add-fund)**.
- **One figure per fund (computed subtotals)**: `iia` Short term (`ShortTermCG`), `iib` Long term (`LongTermCG`), `iii` Other Sources (`IncOthSrc`), `iv` exempt subtotal (`TotalSec23FBB`) — each is a sum of its own leaf lines, not entered.
- **No grand-total row across funds** on the sheet itself; the head totals used downstream (HP 2, CG B10, OS 2d, EI 5) are aggregated by the receiving schedules per the tie rules above.

## Mandatory

From the schema (`*` = required in `--schema SchedulePTI`): within each `SchedulePTIDtls[]` element — `InvstmntCvrdUs115UA115UB`, `BusinessName`, `BusinessPAN`, and the objects `IncFromHP`, `CapitalGainsPTI` (with `ShortTermCG`, `STCG_Sec111A`, `STCG_Others`, `LongTermCG`, `LTCG_Sec112A`, `LTCG_Others`), `IncOthSrc`, `OS_Dividend`, `OS_Others`, and `IncClmdPTI.TotalSec23FBB`, `IncClmdPTI.Sec23FBB`. Within every amount object the leaves `AmountOfInc`, `CurrYrLossShareByInvstFund` (HP/CG only), `NetIncomeLoss`, `TDSAmount` are required when the object is present. **Optional**: `IncClmdPTI.SecBIncExmptDtl` and `IncClmdPTI.SecCIncExmptDtl` (rows iv b / iv c) including their `SectionCode` and `SecBCIncExmptDtl.{AmountOfInc, NetIncomeLoss, TDSAmount}`. Block `SchedulePTI` itself: `required: None` (the schedule is filed only when PTI exists).

## Hidden rows — not built

**None.** All template rows 3–37 are visible (dump shows no `H` marker on any row). Row 37 is the `[C37] NOTE ►` / `[F37]` instruction line — *"Please refer to the instructions for filling out this schedule."* — not a data row.

## What this means for the build

- Build `SchedulePTI` as a **repeating fund panel** over `SchedulePTIDtls[]` with add-row; do **not** hard-code two funds.
- Each fund panel: entity-type dropdown (`E`), name (`F`, max 125), PAN (`G`, 10) at the head; then the fixed head-wise ladder i–iv with the four money columns (`L`/`M`/`N`/`O` → AmountOfInc / CurrYrLossShareByInvstFund / NetIncomeLoss / TDSAmount).
- **Compute, don't collect**: Col 9 net = Col 7 − Col 8 on every line; iia/iib/iii/iv subtotals = sum of their leaf lines (A745–A749).
- **Col 8 (loss share)** exists only for **House property** and **Capital Gains** in the schema — omit the loss-share input for Other Sources (rows 15/16) and Income-claimed-exempt (rows 18–20); their net = amount.
- The **iv-a** line is fixed to section `10(23FBB)` (`Sec23FBB`); **iv-b / iv-c** are optional free `SectionCode` (max 10) inputs (`SecBIncExmptDtl` / `SecCIncExmptDtl`).
- Wire the four **cross-schedule ties** so PTI flows out: HP net → Schedule HP 2 (A203); LTCG/STCG PTI → Schedule CG B10 etc. (A385); OS PTI → Schedule OS 2d (A477); exempt subtotal → Schedule EI 5 (A732).
- Map the entity-type dropdown text to the coded value `A/B/C` on export (`Section 115UA→A`, `Section 115UB→B`, `Section 115U→C`).
