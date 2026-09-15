# Schedule ESR — Expenditure on Scientific Research etc. (Deduction under section 35 or 35CCC or 35CCD)

## The shape
Schedule ESR is a fixed nine-row grid (plus a total row) capturing the deduction claimed for expenditure on scientific research and specified expenditure under section 35, 35CCC and 35CCD. Each row is one statutory clause; the columns record the amount debited to the profit and loss account, the amount of deduction allowable, and the excess of the allowable deduction over the amount debited. There are no free-form rows and no dropdowns — every clause is a pre-printed line, so this is one fixed object of nine section sub-objects and a computed total.

## The items

Schema block: **ScheduleESR** — root object `DeductionUs35`. Each clause row is an object holding a `DeductUs35` object with three amount leaves. Columns: (2) `AmtDebPL` = Amount, if any, debited to profit and loss account; (3) `AmtUs35Allowable` = Amount of deduction allowable; (4) `ExcessAmtOverDebPL` = Amount of deduction in excess of the amount debited to profit and loss account = (3) − (2).

| Sl No | Field label (Expenditure of the nature referred to in section) | type | schema key | rule/notes |
|---|---|---|---|---|
| i | 35(1)(i) | object row | `DeductionUs35.Section35_1_i.DeductUs35` → `.AmtDebPL`, `.AmtUs35Allowable`, `.ExcessAmtOverDebPL` | col (4) = (3) − (2), floored at 0 [G5] |
| ii | 35(1)(ii) | object row | `DeductionUs35.Section35_1_ii.DeductUs35` → `.AmtDebPL`, `.AmtUs35Allowable`, `.ExcessAmtOverDebPL` | Schedule RA required if claimed; col (3) must be 0 under New Tax Regime; col (4) = (3) − (2), floored at 0 [G6] |
| iii | 35(1)(iia) | object row | `DeductionUs35.Section35_1_iia.DeductUs35` → `.AmtDebPL`, `.AmtUs35Allowable`, `.ExcessAmtOverDebPL` | Schedule RA required if claimed; col (3) must be 0 under New Tax Regime |
| iv | 35(1)(iii) | object row | `DeductionUs35.Section35_1_iii.DeductUs35` → `.AmtDebPL`, `.AmtUs35Allowable`, `.ExcessAmtOverDebPL` | Schedule RA required if claimed; col (3) must be 0 under New Tax Regime |
| v | 35(1)(iv) | object row | `DeductionUs35.Section35_1_iv.DeductUs35` → `.AmtDebPL`, `.AmtUs35Allowable`, `.ExcessAmtOverDebPL` | col (4) = (3) − (2), floored at 0 |
| vi | 35(2AA) | object row | `DeductionUs35.Section35_2AA.DeductUs35` → `.AmtDebPL`, `.AmtUs35Allowable`, `.ExcessAmtOverDebPL` | Schedule RA required if claimed; col (3) must be 0 under New Tax Regime; Form 3CLA hint for 35(2AB)/in-house R&D |
| vii | 35(2AB) | object row | `DeductionUs35.Section35_2AB.DeductUs35` → `.AmtDebPL`, `.AmtUs35Allowable`, `.ExcessAmtOverDebPL` | col (4) = (3) − (2), floored at 0 |
| viii | 35CCC | object row | `DeductionUs35.Section35_CCC.DeductUs35` → `.AmtDebPL`, `.AmtUs35Allowable`, `.ExcessAmtOverDebPL` | col (3) must be 0 under New Tax Regime |
| ix | 35CCD | object row | `DeductionUs35.Section35_CCD.DeductUs35` → `.AmtDebPL`, `.AmtUs35Allowable`, `.ExcessAmtOverDebPL` | col (4) = (3) − (2), floored at 0 |
| x | Total | object row (computed) | `DeductionUs35.TotUs35.DeductUs35` → `.AmtDebPL`, `.AmtUs35Allowable`, `.ExcessAmtOverDebPL` | sum of rows i–ix; col (3) rounded to whole rupee |

Column headers as printed: **Sl No** (col 1); **Expenditure of the nature referred to in section (1)**; **Amount, if any, debited to profit and loss account (2)**; **Amount of deduction allowable (3)**; **Amount of deduction in excess of the amount debited to profit and loss account (4) = (3) - (2)**.

## The rules the sheet computes
- **[G5]** `= IF((F5-E5) <0,0,(F5-E5))` — for row i (35(1)(i)), col (4) excess = allowable (3) − debited (2), floored at 0 (never negative).
- **[G6]** `= IF((F6-E6) <0,0,(F6-E6))` — same floored (3) − (2) for row ii (35(1)(ii)); the same IF/floor logic applies to col (4) for every clause row i–ix (rows G5:G13 default 0).
- **[E14]** `= SUM(E5:E13)` — Total (row x), col (2) = sum of amounts debited to P&L across rows i–ix.
- **[F14]** `= ROUND(SUM(F5:F13),0)` — Total (row x), col (3) = sum of allowable deductions across rows i–ix, rounded to the nearest whole rupee.
- **[G14]** `= SUM(G5:G13)` — Total (row x), col (4) = sum of excess amounts across rows i–ix.
- Cells F5:F13 (col 3) and F14:G15, E5:E15 default to 0.
- **rules.json #352** — "In Schedule ESR, Sl.No.4 … (4)=(3)-(2) should be equal to Sl.No.3-Sl.No.2" (per-row col-4 identity).
- **rules.json #353** — "In Schedule ESR, Sl.No. x should be equal to sum of Sl.No. i+ii+iii+iv+v+vi+vii+viii+ix" (total row).
- **rules.json #354** — "If New Tax Regime is selected, then in schedule ESR at column 3, amount cannot be more than zero for section 35(1)(ii), 35(1)(iia), 35(1)(iii), 35(2AA) and 35(CCC)."
- **vba_text** — "Schedule RA is mandatory as there is entry in Schedule ESR [deduction under sections 35(1)(ii) or 35(1)(iia) or 35(1)(iii) or 35(2AA)]."
- **rules.json cross-sheet (BP)** — Schedule BP Sl.No. 28 "Amount of deduction under section 35 … in excess of the amount debited to P & L a/c" should equal Sl.No. X(4) of Schedule ESR; and BP Sl.No. 24(e) should be minimum of absolute value of total of negative values of "col 3 − col 2" of all fields in Schedule ESR.

## Dropdowns
None. Schedule ESR has no dropdown lists; the only list-like configuration reported (`G5:G13`, `F5:F13`, `F14:G15 E5:E15` with source `0`) is a numeric default/format, not a value list.

## What repeats and what is one figure
Nothing repeats as a user-added array. Schedule ESR is one fixed object (`DeductionUs35`) with exactly nine named clause sub-objects (`Section35_1_i` … `Section35_CCD`) plus one total sub-object (`TotUs35`). Each sub-object carries a single `DeductUs35` object with three single-figure integer leaves (`AmtDebPL`, `AmtUs35Allowable`, `ExcessAmtOverDebPL`). Every figure is a single value; there is no add-row list.

## Mandatory
Schema `required`: **`DeductionUs35`** (the root object of the schedule). No individual clause row or leaf is independently marked required, but the container object must be present.

## Hidden rows — not built
- **r16 — Note (`[C16]` Note: / `[D16]`)**: "In case any deduction is claimed under sections 35(1)(ii) or 35(1)(iia) or 35(1)(iii) or 35(2AA), please provide the details as per Schedule RA." This is an instructional note/comment (also attached as the cell comment on E4), not a data-entry item — it is captured here as guidance, not built as a field.

(No rows are marked `H` hidden in the dump; all nine clause rows plus the total are visible data rows. Row 16 is a note line carrying no input cell.)

## What this means for the build
- Build a fixed 3-column grid of exactly ten object rows (nine clauses i–ix + total x); do not offer add/remove rows.
- For each clause row collect only cols (2) `AmtDebPL` and (3) `AmtUs35Allowable`; compute col (4) `ExcessAmtOverDebPL` = max(0, (3) − (2)) — never let it go negative.
- Compute the total row x: col (2) = SUM of col (2), col (4) = SUM of col (4), col (3) = ROUND(SUM of col (3), 0). Do not accept manual entry in the total row.
- Under the New Tax Regime, force col (3) allowable to zero (and block entry) for rows ii, iii, iv, vi and viii (sections 35(1)(ii), 35(1)(iia), 35(1)(iii), 35(2AA), 35CCC).
- If any amount is entered for rows ii, iii, iv or vi (35(1)(ii)/(iia)/(iii)/(2AA)), flag that Schedule RA becomes mandatory, and surface the note prompting Schedule RA details.
- Push X(4) to Schedule BP Sl.No. 28, and feed the absolute total of negative (col 3 − col 2) values to BP Sl.No. 24(e).
- All amounts are non-negative integers with maximum 99999999999999.
