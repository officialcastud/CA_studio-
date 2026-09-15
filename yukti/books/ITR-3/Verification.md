# The book of Verification — ITR-3, A.Y. 2026-27

Read row by row from the utility's **Verification** sheet (rows 3–10, one row
hidden), its formulas and dropdowns, and confirmed against the schema blocks
`Verification` and `TaxReturnPreparer`.

## The shape

The Verification schedule is the declaration the assessee signs: a solemn
declaration that the information in the return is correct and complete, the
capacity in which the person signs, the PAN held, and the place and date of
signing. It is a single one-off block — nothing on it repeats. A second,
optional block on the same schema — `TaxReturnPreparer` — records the TRP who
prepared the return, if any. One row (row 8, the Advance Pricing Agreement
"critical assumptions" declaration) is hidden and is not built.

## The items

### Block: Verification

| Row / cell | Field label | Type | Schema key | Rule / notes |
|---|---|---|---|---|
| r4 [C4] | I, (full name in block letters), | string | `Declaration.AssesseeVerName` | full name in block letters; maxLength 125 |
| r4 [I4] | son/ daughter of | string | `Declaration.FatherName` | father's name; maxLength 125 |
| r5 [C5] | solemnly declare that to the best of my knowledge and belief, the information given in the return an... | (declaration text) | — | the solemn declaration sentence; no input |
| r6 [C6] | I further declare that I am making returns in my capacity as | string (enum) | `Capacity` | dropdown I6; enum S / R / K / A |
| r6 [J6] | and I am also competent to make this return and verify it. | (declaration text) | — | tail of the capacity sentence; no input |
| r7 [C7] | I am holding permanent account number . | string | `Declaration.AssesseeVerPAN` | the PAN held by the person verifying |
| r7 [G7] | PAN | string | `Declaration.AssesseeVerPAN` | label for the PAN box |
| r9 [C9] | Sign here | — | — | signature area |
| r9 [H9] | Place | string | `Place` | maxLength 50 |
| r9 [J9] | Date | string | `Date` | Date in YYYY-MM-DD format; sheet fills L9 with today (see rules) |

### Block: TaxReturnPreparer

| Item | Field label | Type | Schema key | Rule / notes |
|---|---|---|---|---|
| TRP.1 | Identification number of TRP | string | `IdentificationNoOfTRP` | required within the block |
| TRP.2 | Name of TRP | string | `NameOfTRP` | required within the block; maxLength 125 |
| TRP.3 | Amount reimbursed from Government (if any) | integer | `ReImbFrmGov` | optional; minimum 0, maximum 99999999999999 |

## The rules the sheet computes

- **L9 (Date default)** — `= CONCATENATE(IF(DAY(TODAY())<10,"0",""),DAY(TODAY()),"/",IF(MONTH(TODAY())<10,"0",""),MONTH(TODAY()), ...)` — the sheet pre-fills the signing date with the system date in `DD/MM/YYYY`. The schema stores `Date` as `YYYY-MM-DD`; the build converts.
- **Capacity ↔ dropdown** — the I6 dropdown value maps to the `Capacity` enum: Self → S, Representative → R, Karta → K, Authorised Signatory → A ((Select) is the unset placeholder). Confirmed by the VBA `sheet1.capacityassessee` handler (default `00/00/0000` / `(Select)`).
- **Representative rule (rules.json #45)** — "In Verification, if representative is selected from dropdown of capacity then Yes should be selected in 'Whether this return is being filed by a representative assessee' & details."
- **Representative PAN rule (rules.json #40)** — "If return is being filed by Representative Assessee then PAN quoted in verification schedule of the return should be same as the PAN who is trying to upload the return."
- **Verification PAN vs donee PAN (rules.json #60, #3275)** — the verification PAN cannot equal a donee PAN reported in Schedule 80G / 80GGA.

## Dropdowns

- **I6 — Capacity** (source `"(Select),Self,Representative,Karta,Authorised Signatory"`):
  - (Select)
  - Self
  - Representative
  - Karta
  - Authorised Signatory

(The other listed cells — K4:L4, I7, I9, H4 — carry numeric format/validation ids, not value lists.)

## What repeats and what is one figure

Everything on this schedule is **one figure** — a single declaration, one
capacity, one PAN, one place, one date. Neither `Verification` nor
`TaxReturnPreparer` is an array; `TaxReturnPreparer` is a single optional block.

## Mandatory

- **Verification** required keys: `Declaration`, `Capacity`, `Date`, `Place`
  (and within `Declaration`: `AssesseeVerName`, `FatherName`, `AssesseeVerPAN`).
- **TaxReturnPreparer** required keys (only if the block is present):
  `IdentificationNoOfTRP`, `NameOfTRP`. `ReImbFrmGov` is optional.

## Hidden rows — not built

- **r8 [C8]** — "I further declare that the critical assumptions specified in
  the agreement have been satisfied and a..." — HIDDEN. This is the Advance
  Pricing Agreement (APA) declaration, shown only for APA cases. Not built; no
  schema key on the standard Verification block.
- **r10 [C10]** — "Note: 1. Submission date is the system date of e-Filing
  portal of Income Tax Department. The same is..." — a note/instruction row,
  not an input; carried as guidance only, no field built.

## What this means for the build

1. **Verification as a single declaration block** with four visible inputs:
   the assessee's name and father's name (`Declaration`), the capacity
   dropdown (`Capacity`), the PAN (`Declaration.AssesseeVerPAN`), and place and
   date (`Place`, `Date`).
2. **Capacity as a code** — render the five dropdown labels; store the S/R/K/A
   code; wire the representative rule so choosing Representative forces the
   Part A-General representative flag to Yes and the verification PAN to match
   the uploader's PAN.
3. **Date** — default to today's date on screen in `DD/MM/YYYY`; export as
   `YYYY-MM-DD`.
4. **TaxReturnPreparer** — an optional block; when filled, `IdentificationNoOfTRP`
   and `NameOfTRP` are mandatory and `ReImbFrmGov` is an optional non-negative
   integer.
5. **Do not build** the hidden APA critical-assumptions row (r8) or an input
   for the submission-date note (r10).
