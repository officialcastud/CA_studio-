# Schedule ESR — Expenditure on Scientific Research etc. (s.35 / 35CCC / 35CCD)

Form: **ITR-5**, A.Y. 2026-27. Sheet: **ESR**. Section: `bp`. Block: **ScheduleESR**.
Source: `python tools/dump.py --form ITR-5 --sheet "ESR"` (rows / --formulas / --dropdowns) and `--schema ScheduleESR` / `--leaves ScheduleESR`; rules from `books/ITR-5/rules.json`; note/validator text from `sources/ITR-5/ITR5_AY_2026-27_V1.4.xlsm` (sheet ESR) and `sources/ITR-5/vba_text.txt`.

## The shape

Schedule ESR is a **single fixed matrix** — one row per deduction section, no repeats. The header row `[E3]` reads (verbatim): **"Expenditure on scientific Research etc. Deduction under section 35 or 35CCC or 35CCD"**.

Four data columns (`[C4]..[G4]` header row), nine section rows (`i`..`ix`, rows 5-13), one Total row (`x`, row 14), and a Note row (row 15):

- Column (1) `[D4]` = **"Expenditure of the nature referred to in section (1)"** — the fixed section label per row (not an input; pre-printed).
- Column (2) `[E4]` = **"Amount, if any, debited to profit and loss account (2)"** — input → schema key `AmtDebPL`.
- Column (3) `[F4]` = **"Amount of deduction allowable (3)"** — input → schema key `AmtUs35Allowable`.
- Column (4) `[G4]` = **"Amount of deduction in excess of the amount debited to profit and loss account (4) = (3) - (2)"** — computed → schema key `ExcessAmtOverDebPL`.

Each of the nine section rows plus the Total row is a schema object `DeductUs35` holding those three amount keys. All nine section objects and the total sit under the parent object `DeductionUs35`; the total object is `TotUs35`.

## The items

### Block `ScheduleESR` → `DeductionUs35` (parent object, required)

Each section maps to `DeductionUs35.<Section>.DeductUs35.<amount key>`. Columns (2)/(3)/(4) map identically across every row:

| Sl. No. (col 1) | Section label `[D..]` | Col (2) input — key | Col (3) input — key | Col (4) computed — key |
|---|---|---|---|---|
| i (r5) | 35(1)(i) | `Section35_1_i` . `DeductUs35` . `AmtDebPL` | `AmtUs35Allowable` | `ExcessAmtOverDebPL` |
| ii (r6) | 35(1)(ii) | `Section35_1_ii` . `DeductUs35` . `AmtDebPL` | `AmtUs35Allowable` | `ExcessAmtOverDebPL` |
| iii (r7) | 35(1)(iia) | `Section35_1_iia` . `DeductUs35` . `AmtDebPL` | `AmtUs35Allowable` | `ExcessAmtOverDebPL` |
| iv (r8) | 35(1)(iii) | `Section35_1_iii` . `DeductUs35` . `AmtDebPL` | `AmtUs35Allowable` | `ExcessAmtOverDebPL` |
| v (r9) | 35(1)(iv) | `Section35_1_iv` . `DeductUs35` . `AmtDebPL` | `AmtUs35Allowable` | `ExcessAmtOverDebPL` |
| vi (r10) | 35(2AA) | `Section35_2AA` . `DeductUs35` . `AmtDebPL` | `AmtUs35Allowable` | `ExcessAmtOverDebPL` |
| vii (r11) | 35(2AB) | `Section35_2AB` . `DeductUs35` . `AmtDebPL` | `AmtUs35Allowable` | `ExcessAmtOverDebPL` |
| viii (r12) | 35CCC | `Section35_CCC` . `DeductUs35` . `AmtDebPL` | `AmtUs35Allowable` | `ExcessAmtOverDebPL` |
| ix (r13) | 35CCD | `Section35_CCD` . `DeductUs35` . `AmtDebPL` | `AmtUs35Allowable` | `ExcessAmtOverDebPL` |
| x (r14) | Total | `TotUs35` . `DeductUs35` . `AmtDebPL` | `AmtUs35Allowable` | `ExcessAmtOverDebPL` |

Every leaf is `[integer]`, `minimum 0`, `maximum 99999999999999`.

**Full leaf paths (verbatim schema keys):**
- `DeductionUs35.Section35_1_i.DeductUs35.AmtDebPL` / `.AmtUs35Allowable` / `.ExcessAmtOverDebPL`
- `DeductionUs35.Section35_1_ii.DeductUs35.AmtDebPL` / `.AmtUs35Allowable` / `.ExcessAmtOverDebPL`
- `DeductionUs35.Section35_1_iia.DeductUs35.AmtDebPL` / `.AmtUs35Allowable` / `.ExcessAmtOverDebPL`
- `DeductionUs35.Section35_1_iii.DeductUs35.AmtDebPL` / `.AmtUs35Allowable` / `.ExcessAmtOverDebPL`
- `DeductionUs35.Section35_1_iv.DeductUs35.AmtDebPL` / `.AmtUs35Allowable` / `.ExcessAmtOverDebPL`
- `DeductionUs35.Section35_2AA.DeductUs35.AmtDebPL` / `.AmtUs35Allowable` / `.ExcessAmtOverDebPL`
- `DeductionUs35.Section35_2AB.DeductUs35.AmtDebPL` / `.AmtUs35Allowable` / `.ExcessAmtOverDebPL`
- `DeductionUs35.Section35_CCC.DeductUs35.AmtDebPL` / `.AmtUs35Allowable` / `.ExcessAmtOverDebPL`
- `DeductionUs35.Section35_CCD.DeductUs35.AmtDebPL` / `.AmtUs35Allowable` / `.ExcessAmtOverDebPL`
- `DeductionUs35.TotUs35.DeductUs35.AmtDebPL` / `.AmtUs35Allowable` / `.ExcessAmtOverDebPL`

## The rules the sheet computes (with cell references)

- **Col (4) per row = MAX(0, col(3) − col(2))** — `[G5]= MAX(0,F5-E5)`, `[G6]= MAX(0,F6-E6)` (pattern repeats G5:G13). i.e. `ExcessAmtOverDebPL = max(0, AmtUs35Allowable − AmtDebPL)`. Matches rules.json A327: *"value in col (4) should be equal to the sum of value at col (3)-(2) of schedule ESR if Col 3 >= Col 2"*.
- **Total col (2)** — `[E14]= SUM(E5:E13)` → `TotUs35.DeductUs35.AmtDebPL`.
- **Total col (3)** — `[F14]= SUM(F5:F13)` → `TotUs35.DeductUs35.AmtUs35Allowable`.
- **Total col (4)** — `[G14]= MAX(0,SUM(G5:G13))` → `TotUs35.DeductUs35.ExcessAmtOverDebPL`. Matches rules.json A328: *"Total should be equal to the sum of value entered in (i + ii + iii + iv + v + vi + vii + viii + ix)"*.
- **Col (3) must equal col (2), per row** — rules.json A329–A337: *"value entered at Sl. No. 3i - 35(1)(i), should be equal to Sl. No. 2i - 35(1)(i)"* (and the same for ii/iii/iv/v/vi/vii/viii/ix). So for each row `AmtUs35Allowable` is expected to equal `AmtDebPL`; combined with the col(4) formula this drives col (4) toward 0 unless col(3) exceeds col(2).
- **CheckRA flag** — `[J3]` label "CheckRA", `[K3]= IF(SUM(ESR1ii.AmtDebPL,ESR1iia.AmtDebPL,ESR1iii.AmtDebPL,ESR2AA.AmtDebPL,ESR1ii.AmtUs35Allowable,ESR1iia.AmtUs35Allowable,ESR1iii.AmtUs35Allowable,ESR2AA.AmtUs35Allowable)>0,TRUE,FALSE)`. When TRUE, Schedule RA is mandatory. VBA message (`vba_text.txt`, key `CheckRA`): *"In case any deduction is claimed under sections 35(1)(ii) or 35(1)(iia) or 35(1)(iii) or 35(2AA) in Schedule ESR then at least one row is mandatory in Schedule RA"*.
- **Note `[D15]`** (verbatim): *"In case any deduction is claimed under sections 35(1)(ii) or 35(1)(iia) or 35(1)(iii) or 35(2AA), please provide the details as per Schedule RA"*.

### Cross-schedule rules (from rules.json)
- **A226**: *"Schedule BP value at field A28 should be equal to total of column (4) of Schedule ESR."* — i.e. BP field A28 = `TotUs35.DeductUs35.ExcessAmtOverDebPL`.
- **D29** (category B/D notice): if the taxpayer claims deduction under **s.35(2AB)** (in-house R&D) but **Form 3CLA (report from an accountant)** is not filed, a notice is raised.

## Dropdowns

`python tools/dump.py --form ITR-5 --dropdowns "ESR"` returns only numeric-input constraints (`source: "0"`, `values: null`) on cells `G5:G13`, `F5:F13`, `F14:G14 E5:E14`. **There are no value-list dropdowns in this sheet** — every input is a plain integer amount (≥ 0). Nothing to enumerate.

## What repeats and what is one figure

- **Nothing repeats.** Schedule ESR is a fixed 9-section matrix plus a Total row. There is no add-row / instance list; each section is a distinct named schema object.
- **One figure each:** every cell in E5:G13 is a single amount for its fixed section. The Total row (E14:G14) is one computed figure each.

## Mandatory

- Schema `required` at block level: **`DeductionUs35`** (the parent object). Each `Section35_*` object and `TotUs35` is marked required in the schema, and within each, `DeductUs35` and its three amount keys (`AmtDebPL`, `AmtUs35Allowable`, `ExcessAmtOverDebPL`) are required. In practice the whole schedule is optional data (fill only when a s.35 deduction is claimed); when built, the amount structure is present per the schema.
- **Conditional mandate:** if any of 35(1)(ii)/(iia)/(iii)/(2AA) has a non-zero AmtDebPL or AmtUs35Allowable (K3 = TRUE), **Schedule RA** requires at least one row (per D15 / CheckRA).

## Hidden rows — not built

**None.** All rows 3–15 are visible (verified: `row_dimensions[r].hidden == False` for r=3..15 in the ESR sheet of the xlsm). No H-flagged rows in the dump.

## What this means for the build

- Build a fixed 9-row table (35(1)(i), 35(1)(ii), 35(1)(iia), 35(1)(iii), 35(1)(iv), 35(2AA), 35(2AB), 35CCC, 35CCD) plus a Total row — no add/remove controls.
- Two inputs per section row: col (2) `AmtDebPL` and col (3) `AmtUs35Allowable`, both integer ≥ 0.
- Compute col (4) `ExcessAmtOverDebPL = MAX(0, AmtUs35Allowable − AmtDebPL)` per row; compute totals E14 = SUM col(2), F14 = SUM col(3), G14 = MAX(0, SUM col(4)).
- Wire `TotUs35.DeductUs35.ExcessAmtOverDebPL` into Schedule BP field A28 (rule A226).
- Set the CheckRA condition (K3): if AmtDebPL or AmtUs35Allowable is non-zero for any of 35(1)(ii)/(iia)/(iii)/(2AA), require Schedule RA (D15 note).
- Emit deduction under s.35(2AB) → prompt/notice about Form 3CLA (D29).
- No dropdowns to populate.
