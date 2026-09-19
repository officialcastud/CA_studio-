# Verification — Declaration and verification of the return

Form: **ITR-5**, A.Y. 2026-27. Sheet: **VERIFICATION**. Section: `verify`. Block: **Verification**.
Source: `python tools/dump.py --form ITR-5 --sheet "VERIFICATION"` (rows / --formulas / --dropdowns) and `--schema Verification` / `--leaves Verification`; rules from `books/ITR-5/rules.json`; enum map from `books/ITR-5/enums.json`; validator text from `sources/ITR-5/vba_text.txt`; cell↔key map from `books/ITR-5/sheet_map.json` (named ranges); input-cell / data-validation / protection facts read directly from `sources/ITR-5/ITR5_AY_2026-27_V1.4.xlsm`.

## The shape

Verification is a **single-record declaration block** — not a table and not repeating. It is one paragraph of fixed declaration text with **six data fields** the signer fills, plus a note. The whole sheet occupies range `B2:N11` and is a **visible** sheet (`sheet_state = visible`); there are no hidden rows or columns.

The declaration reads (verbatim from the sheet):

- `[C3]` = **"VERIFICATION"** (banner).
- `[C4]` = **"I, (full name in block letters),"** — followed by the name input at `[H4]`; `[I4]` = **"Son/ Daughter of "** — followed by the father's-name input at `[L4]`.
- `[C5]` = **"solemnly declare that to the best of my knowledge and belief, the information given in the return and the schedules thereto is correct and complete is in accordance with the provisions of the Income-tax Act, 1961."**
- `[C6]` = **"I further declare that I am making this return in my capacity as"** — followed by the capacity dropdown at `[H6]`; `[I6]` = **"and I am also competent to make this return and verify it."**
- `[C7]` = **"I am holding Permanent Account Number"** — followed by the PAN input at `[H7]`.
- `[C8]` = **"I further declare that the critical assumptions specified in the agreement have been satisfied and all the terms and conditions of the agreement have been complied with. (Applicable, in a case where return is furnished under section 92CD)"** (this is the merged range `C8:L8`, named range `Veri.92CD` — a static declaration line, **not** an input field, applicable only when the return is furnished u/s 92CD).
- `[C9]` = **"Place"** — followed by the place input at `[H9]`; `[J9]` = **"Date  (System Date)"** — followed by the computed date at `[L9]`.
- `[C10]` = **"Note :"** and `[D10]` = **"1. Submission date is the system date of e-Filing portal of Income Tax Department. The same is available in the Acknowledgement/ITR-V generated after submission of return. 2. Verification Date is the date of e-Verification at e-Filing portal of Income Tax Department or the date of receipt of ITR-V at CPC, Bengaluru. The same will be available in View Returns/Forms option of e-Filing portal. In case of e-Verification, it is available in Acknowledgement."**

The five typed inputs (`H4`, `L4`, `H6`, `H7`, `H9`) are the only unlocked (`protection.locked = False`) cells; `L9` is a computed formula cell.

## The items

### Block `Verification` → `Declaration` [object] (single record, required)

| Sheet cell | Field (label) | Type | Schema key | Rule |
|---|---|---|---|---|
| `[H4]` (after `[C4]` "I, (full name in block letters),") | Full name of the signer, in block letters | string | `Declaration.AssesseeVerName` | mandatory; textLength min 1 (DV on H4); schema maxLength 125 |
| `[L4]` (after `[I4]` "Son/ Daughter of") | Father's name | string | `Declaration.FatherName` | mandatory; textLength min 1 (DV on L4); schema maxLength 125 |
| `[H7]` (after `[C7]` "I am holding Permanent Account Number") | PAN of the signer | string | `Declaration.AssesseeVerPAN` | mandatory; textLength exactly 10 (DV on H7); PAN format AAAAA9999A; must match a PAN entered in Partners/Members/Trust information (A13) |
| `[H6]` (after `[C6]` "…making this return in my capacity as") | Capacity in which the return is signed | dropdown → code | `Declaration.Capacity` | mandatory; enum of 12 (see Dropdowns); if "Representative assessee" chosen, Part A-General rep flags must be set (A5/A6) |
| `[H9]` (after `[C9]` "Place") | Place of signing | string | `Declaration.Place` | schema maxLength 50 |
| `[L9]` (after `[J9]` "Date  (System Date)") | Date of verification | string (date) | `Declaration.Date` | computed = today's date (see formula); XML date must be YYYY-MM-DD; mandatory; valid dd/mm/yyyy; not before 01/04/2023 (VBA) |

**Full leaf paths (verbatim schema keys):**
- `Declaration.AssesseeVerName` (string, maxLength 125) — required
- `Declaration.FatherName` (string, maxLength 125) — required
- `Declaration.AssesseeVerPAN` (string) — required
- `Declaration.Capacity` (string, enum: `MP`, `DP`, `PA`, `PO`, `ME`, `LQ`, `RP`, `TR`, `EX`, `RA`, `AS`, `OA`) — required
- `Declaration.Place` (string, maxLength 50) — required
- `Declaration.Date` (string, YYYY-MM-DD) — required

Named-range → cell map (from `sheet_map.json`): `sheet9.AssesseeVerName`→`VERIFICATION!$H$4`; `sheet9.FatherName`→`VERIFICATION!$L$4`; `sheet9.PAN`→`VERIFICATION!$H$7`; `sheet9.Capacity`→`VERIFICATION!$H$6`; `sheet9.Place`→`VERIFICATION!$H$9`; `sheet9.Date`→`VERIFICATION!$L$9`; `Veri.92CD`→`VERIFICATION!$C$8:$L$8`.

## The rules the sheet computes (with cell references)

- **Date is auto-generated (system date), not input** — `[L9] = CONCATENATE(IF(DAY(TODAY())<10,"0",""),DAY(TODAY()),"/",IF(MONTH(TODAY())<10,"0",""),MONTH(TODAY()),"/",YEAR(TODAY()))`. Produces the current date as `dd/mm/yyyy`. On XML export it maps to `Declaration.Date` and must be emitted in **YYYY-MM-DD** format (schema requirement; VBA formats `sheet9.Date` as `yyyy-mm-dd`).
- **PAN length** — DV `textLength = 10` on `[H7]`; must be a valid PAN (First 5 alphabets, next 4 digits, then 1 alphabet).
- **Name / Father's name presence** — DV `textLength = 1` (min length 1) on `[H4]` and `[L4]`.
- **Capacity is a closed list** — DV `list` on `[H6]`; the display label chosen is mapped to its two-letter code on export (see Dropdowns / enums).
- **Capacity code mapping (VBA XML export, `vba_text.txt`)** — MANAGING PARTNER→`MP`, DESIGNATED PARTNER→`DP`, PARTNER→`PA`, PRINCIPAL OFFICER→`PO`, MEMBER→`ME`, LIQUIDATOR→`LQ`, RESOLUTION PROFESSIONAL→`RP`, TRUSTEE→`TR`, EXECUTOR→`EX`, REPRESENTATIVE ASSESSEE→`RA`, AUTHORISED SIGNATORY→`AS`, OFFICIAL ASSIGNE→`OA`.

**Cross-sheet validators (rules.json / vba_text.txt) that reference this sheet:**
- `A13` (rules.json): *"PAN entered at 'Verification' should match with any PAN entered at 'PARTNERS/ MEMBERS/TRUST INFORMATION'"* — `Declaration.AssesseeVerPAN` must equal a PAN listed in Part A-General partner/member/trust info.
- `A5`/`A6` (rules.json): *if "representative" is selected from the capacity dropdown, "Yes" must be selected to "Whether this return is being filed by a representative assessee" and the representative-assessee details in Part A-General must be filled.*
- VBA: *"Verification Date in Sheet : PARTB and Verification is mandatory"*; *"Date in Sheet : PARTB and Verification must be a valid dd/mm/yyyy format"*; *"Date in Verification, Sheet PARTB and Verification must not be less than 01/04/2023"* — the verification date is validated and cannot precede 01/04/2023.
- VBA (80G / 80GGA / RA): Donee PAN cannot be the same as the assessee PAN or the **verification PAN**. VBA (TDS): deducted/other-person PAN must not match the verification PAN (`sheet9.PAN`).

## Dropdowns

**`[H6]` Capacity** — DV list; 12 real values plus the placeholder (display label → XML enum code, from `enums.json` `Verification.Declaration.Capacity`):

| Display value (dropdown) | Schema code |
|---|---|
| (Select) | — (placeholder, not a valid submission) |
| Managing Partner | `MP` |
| Designated partner | `DP` |
| Partner | `PA` |
| Principal Officer | `PO` |
| Member | `ME` |
| Liquidator | `LQ` |
| Resolution professional | `RP` |
| Trustee | `TR` |
| Executor | `EX` |
| Representative assessee | `RA` |
| Authorised Signatory | `AS` |
| Official Assigne | `OA` |

No other cell on this sheet has a list dropdown (`H4`, `L4`, `H7` carry only textLength validations; `L9` carries none).

## What repeats and what is one figure

- **Nothing repeats.** `Declaration` is a **single object** (one signer, one verification), not an array. There is exactly one of each field.
- All six fields are single figures: name, father's name, PAN, capacity, place, date.

## Mandatory

From the schema, block `Verification` requires `Declaration`; within `Declaration` the required keys are **all six**: `AssesseeVerName`, `FatherName`, `AssesseeVerPAN`, `Capacity`, `Place`, `Date`. The utility enforces name/father-name presence (textLength≥1), PAN length (=10), capacity via closed list, and verification date presence/format/range through validators. The block `Verification` itself is `required: true` in `blocks.json`.

## Hidden rows — not built

**None.** The sheet is fully visible (`sheet_state = visible`); rows 2–11 and all columns are visible (`row_dimensions[*].hidden = False`, `column_dimensions[*].hidden = False`). Nothing on this sheet is an H (hidden) row.

Note on `[N11]` = `01/12/2026`: a stray literal date value sitting outside the declaration layout (column N, row 11); it is not one of the six declaration inputs, has no named range and no schema key, and is not built.

## What this means for the build

- Emit a single `Verification/Declaration` object with the six children in schema order: `AssesseeVerName`, `FatherName`, `AssesseeVerPAN`, `Capacity`, `Place`, `Date`.
- Capacity: collect the display label from the 12-value list and store the two-letter enum code (`MP`…`OA`); never emit `(Select)`.
- Date: do not treat as free input — it is the system date; store as `YYYY-MM-DD` on export even though the sheet displays `dd/mm/yyyy`.
- PAN: validate 10-char PAN format and enforce cross-checks — must match a Partners/Members/Trust PAN (A13), and must not collide with donee PANs (80G/80GGA/RA) or TDS other-person PANs.
- If capacity = Representative assessee (`RA`), the build must also set the Part A-General representative-assessee flag and details (A5/A6).
- No repeat handling, no totals, no computed money cells on this sheet.
