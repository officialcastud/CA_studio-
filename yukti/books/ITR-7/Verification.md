# The book of Verification — the declaration · ITR-7, A.Y. 2026-27

Read row by row from the utility's **Verification** sheet (10 rows, 1 hidden),
with the hidden-row flags, and confirmed against the schema's `Verification`
block. This is the last section a trust/institution fills — who signs the
return, in what capacity, and with what PAN.

On ITR-7 the bank-account and refund details do **not** live on this sheet — they
sit at the foot of the **PART-B-TI & TTI** sheet (rows 282–300,
`PartB_TTI.Refund.BankAccountDtls`) and are documented in
`books/ITR-7/PART_B_TI_TTI.md`. The `Verification` schema block on this sheet is
only the *declaration*.

---

## 1 · The shape — one declaration, one figure

| Part | On the sheet | Schema block | Repeats? |
|---|---|---|---|
| **The declaration** | Verification sheet, rows 3–9 | `Verification` (`Declaration.*` + `Date`, `Place`) | one figure |

There are no item numbers in the rules document for these — they are the closing
verification that every ITR carries.

---

## 2 · The declaration — Verification sheet, row by row

The whole sheet is the declaration text with fillable boxes.

| Row | Cell | Label (verbatim) | Fillable box | Type / enum | Schema key |
|---|---|---|---|---|---|
| 3 | C3 / F3 | **Schedule Verification / Verification** | — | heading | — |
| 4 | C4 | **I,** (full name in block letters) | full name of the signatory | string, max 125 | `Declaration.AssesseeVerName` |
| 4 | G4 | **son/daughter of** | father's name | string, max 125 | `Declaration.FatherName` |
| 5 | C5 | **solemnly declare that to the best of my knowledge and belief, the information given in this return and the schedules thereto is correct and complete …** | — | fixed declaration text | — |
| 6 | C6 | **I further declare that I am making this return in my capacity as** | capacity of the signatory | dropdown — see §3 | `Declaration.Capacity` |
| 6 | H6 | **and I am also competent to make this return and verify it.** | — | fixed declaration text | — |
| 7 | C7 | **I am holding permanent account number** | PAN of the signatory | string (PAN) | `Declaration.AssesseeVerPAN` |
| 7 | I7 | **(if allotted) (Please see instruction).** | — | fixed note | — |
| 9 | C9 | **Date** | date of signing | date `DD/MM/YYYY` → `YYYY-MM-DD` | `Date` |
| 9 | G9 | **Place** | place of signing | string, max 50 | `Place` |
| 9 | J9 | **Sign here ->** | signature | — | — |
| 10 | C10 | **Note: 1. Submission date is the system date of e-Filing portal …** | — | fixed note | — |

`Verification` schema keys are **top-level** for `Date` and `Place` and nested
under `Declaration` for the rest. Every one of the six leaves —
`assesseeVerName`, `fatherName`, `assesseeVerPAN`, `capacity`, `date`, `place` —
is **required**.

**Hidden row.** Row 8 (`C8` *"I further declare that the critical assumptions
specified in the agreement have been satisfied and all the terms and conditions
of the agreement have been complied with."*) is **hidden** (`hidden="1"`) — the
APA-only sentence, **not built** for the ordinary trust return.

---

## 3 · The Capacity dropdown (G9:H9, `Declaration.Capacity`)

The one dropdown on the sheet. The utility shows the description; the schema
stores the code. The ITR-7 capacity list is the trust/institution list —
**Managing Director, Director, Principal Officer, Chief Executive Officer,
Representative Assessee, Others** (note "Chief Executive Officer" and
"Representative Assessee", which the company form does not carry):

```
(Select)
Managing Director
Director
Principal Officer
Chief Executive Officer
Representative Assessee
Others
```

**The Representative-assessee rule (A62 / A63).** If the capacity chosen is
**Representative** (Representative Assessee), then in Part A-General the *"Name of
the representative, Email ID and contact number of the representative assessee"*
becomes mandatory, and the **Secondary Address** in Schedule Part A-General
Information must be provided.

**Verification mode (A54).** Mandatory verification of the ITR as per the mode
prescribed in Rule 12 and 12AC is required at the time of submission.

---

## 4 · What is mandatory

| Block | Required |
|---|---|
| `Verification` | `Declaration.AssesseeVerName`, `Declaration.FatherName`, `Declaration.AssesseeVerPAN`, `Declaration.Capacity`, `Date`, `Place` |

---

## 5 · Cross-sheet feeds

**Out:**
- `Declaration.Capacity = Representative` → the representative's name, email,
  contact and Secondary Address in Part A-General become mandatory (A62 / A63).
- The whole declaration is the signature block the e-Filing portal verifies at
  submission (A54).

---

## 6 · What this means for the build

1. **The declaration as five boxes** — full name, father's name, capacity
   (dropdown), PAN, place, date. The date is exported `YYYY-MM-DD`; `Date` and
   `Place` sit at the top level of `Verification`, the rest under `Declaration`.
2. **The Capacity dropdown from the enum** — six choices, description shown, code
   stored; the "Representative Assessee" branch opens the representative fields
   in Part A-General.
3. **Row 8 not built** — the hidden APA critical-assumptions sentence.
4. **The bank/refund block is not here** — it is on the PART-B-TI & TTI sheet;
   see `books/ITR-7/PART_B_TI_TTI.md`.
5. **Export** — the whole `Declaration` object plus top-level `Date` and `Place`.

---

## Appendix A · Every schema leaf of `Verification` (verbatim; * = required)

```
* Declaration.AssesseeVerName   string
* Declaration.FatherName        string
* Declaration.AssesseeVerPAN    string
* Declaration.Capacity          string
* Date                          string
* Place                         string
```

## Appendix B · Every live-row label on the Verification sheet (verbatim from `tools/dump.py`)

Row 8 is hidden (**H**) and **not built**.

```
r   3 : [C3] Schedule Verification  |  [F3] Verification
r   4 : [C4] I,  |  [G4] son/daughter of
r   5 : [C5] solemnly declare that to the best of my knowledge and belief, the information given in this return a
r   6 : [C6] I further declare that I am making this return in my capacity as  |  [G6] (Select)  |  [H6] and I am also competent to make this return and verify it.
r   7 : [C7] I am holding permanent account number  |  [I7] (if allotted) (Please see instruction).
r   8H: [C8] I further declare that the critical assumptions specified in the agreement have been satisfied and a
r   9 : [C9] Date  |  [G9] Place  |  [J9] Sign here ->
r  10 : [C10] Note: 1. Submission date is the system date of e-Filing portal of Income Tax Department. The same is
```

## Appendix C · The Capacity dropdown (G9:H9, verbatim)

```
(Select)
Managing Director
Director
Principal Officer
Chief Executive Officer
Representative Assessee
Others
```
