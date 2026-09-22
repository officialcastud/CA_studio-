# The book of Schedule 80IAC — ITR-6, A.Y. 2026-27

Read row by row from the utility's **80IAC** sheet, and confirmed against the
CBDT ITR-6 schema (`Schedule80IAC`) and the validation-rules document. Section
80-IAC is the **deduction in respect of an eligible start-up** — 100% of profits
for any three consecutive years out of the first ten, for a DPIIT-recognised
start-up incorporated in the eligible window.

---

## 1 · The shape of the schedule

A single flat block (not an array in the schema — one set of particulars per
return). Utility rows 5–6: row 5 the titles, row 6 the six column heads. Sl. No.
is the row index; the deduction is one figure.

| Utility col | Column head (row 6) |
|---|---|
| C | Sl.No |
| D | Date of incorporation of Startup |
| E | Nature of Business |
| F | Certificate number as obtained from Inter Ministerial Board of Certification |
| G | First AY in which deduction was claimed |
| H | Amount of deduction claimed for current AY |

Row 5 carries **Schedule 80IAC** and *"Deduction in respect of eligible
start-up"*.

---

## 2 · The items, row by row

All five data keys are **required** in the schema:

| Item | Label | Type / enum | Schema key | Hidden? |
|---|---|---|---|---|
| — | Sl.No | auto int | (row index) | no |
| — | Date of incorporation of Startup | date `DD/MM/YYYY` | `DateIncrpStrup` | no |
| — | Nature of Business | text (max 120) | `NatureOfBusiness` | no |
| — | Certificate number as obtained from Inter Ministerial Board of Certification | text (max 30) | `InterMnstBoardCertNum` | no |
| — | First AY in which deduction was claimed | enum, see below | `FstAYDeduction` | no |
| — | Amount of deduction claimed for current AY | amount ≥ 0 | `AmtDedCurAY` | no |

The schema notes `DateIncrpStrup` as a date "on or after 2026-04-01" in the
`Schedule80IAC` definition (the schema's stated format constraint — recorded
as-is, not overridden; the eligibility date is governed by rule A600 below).

### Dropdown — column G (`FstAYDeduction`)

Data-validation list on **G8**, matching the schema enum (10 values):
`(Select), 2017-18, 2018-19, 2019-20, 2020-21, 2021-22, 2022-23, 2023-24,
2024-25, 2025-26, 2026-27`.

The other input columns (D date, E `Nature of Business`, F `Certificate number`,
H amount) use number/date/named-range validation with no fixed enum list.

---

## 3 · Cross-sheet feeds

**In**: Part A General — the field *"Whether you are recognized as start up by
DPIIT"* must be **Yes** for this schedule to be enabled (rule A601).

**Out**: `Schedule80IAC.AmtDedCurAY` feeds **Schedule VI-A** at **Sl. No. 2d**
(the 80-IAC line of Part C). Rule A602: the VI-A 80-IAC value cannot exceed
`AmtDedCurAY` (Sl. No. 6 of this schedule).

---

## 4 · The rules the sheet enforces

- **A599** — if Amount of deduction claimed > 0, the remaining fields (date,
  nature, certificate, first AY) must all be filled.
- **A600** — the deduction may be claimed only by entities whose **date of
  incorporation is after 01 April 2016**.
- **A601** — Schedule 80IAC is enabled only when "Whether you are recognized as
  start up by DPIIT" is **Yes** in Part A General.
- **A602** — the value in the 80-IAC field of Schedule VI-A (Sl. No. 2d) cannot
  be higher than `AmtDedCurAY` (Sl. No. 6 here).
- **A603** — if 80-IAC is claimed in Schedule VI-A at Sl. No. 2d but this
  schedule is not filled, error.

---

## 5 · What this means for the build

1. A single card with the six fields above → `Schedule80IAC`; all five data keys
   are mandatory once an amount is entered (A599).
2. First-AY dropdown seeded from the 10-value enum; amount ≥ 0.
3. Gate the card on the DPIIT-recognition Yes/No in Part A General (A601), and
   validate incorporation after 01-04-2016 (A600).
4. Feed `AmtDedCurAY` to VI-A Sl. No. 2d with the not-more-than cap (A602/A603).
