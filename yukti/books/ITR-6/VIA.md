# The book of Schedule VI-A — Chapter VI-A deductions summary · ITR-6, A.Y. 2026-27

Read row by row from the utility's **VIA** sheet (rows 45–70, one hidden note at
r47 and one hidden section-80ID line at r60) and confirmed against the CBDT ITR-6
schema's `ScheduleVIA`. Every letter, label, formula and cross-reference below is
the department's own.

---

## 1 · Purpose — the two-part deductions roll-up, claimed vs allowed

Schedule VI-A is the **summary of all Chapter VI-A deductions**, in two parts:

- **Part B — deductions in respect of certain *payments*** (donations and
  political contributions), items **a to d**.
- **Part C — deductions in respect of certain *incomes*** (the profit-linked
  business deductions), items **e to p**.

It carries every deduction as **two columns**: what the filer *claims* (schema
object `UsrDeductUndChapVIA`) and what the system *allows* after applying the
caps (schema object `DeductUndChapVIA`), shown on screen under the header
**"System Calculated"** (col K). The header cell C46 reads **"TOTAL DEDUCTIONS"**;
the sheet title (F45) is **"Deductions under Chapter VI-A."**

For an ITR-6 company this list is deliberately short on the payment side (no 80C,
80D, 80TTA and the like — those are individual reliefs) and long on the
income/profit-linked side (the 80-I family, 80JJAA, 80LA, 80M, 80PA).

---

## 2 · Item numbering — the sheet letters and the rules-document numbering

The utility letters the rows in column D/H (**a–d** for Part B, **e–p** for
Part C). The **validation-rules document** numbers the two parts **1** and **2**,
so the rules cite items as **1a, 1b, 1c, 1d** (Part B) and **2e, 2f, … 2p**
(Part C) — e.g. rule A814 (*"Sl. No. 1a … 80G"*), rule A835 (*Part B = a + b + c
+ d*), rule A828 (*"80-IA field in sch VI A at Sl. No. 2e"*). This book uses the
sheet's letters as the primary item id and gives the rules-document number
alongside.

**Source inconsistency to flag:** rule **A602** cites *"80-IAC field in Schedule
VI A at Sl. No. 2d"*, but on the sheet 80-IAC is item **g** (row 56), which the
Part-C numbering would make **2g**, not 2d. The rules document's "2d" for 80-IAC
does not line up with the sheet's lettering; the sheet order (e = 80IA, f = 80IAB,
g = 80-IAC …) is authoritative for placement. Logged as a rules-vs-utility
numbering mismatch to watch when encoding A602.

---

## 3 · Part B — deductions in respect of certain payments (items a–d)

Heading (D46): *"1. Part B- Deduction in respect of certain payments."*
Hidden note at **r47** (not built): a reminder that the 01-04-2020 to 31-07-2020
COVID-window investments cannot be double-claimed — a stale AY 2020-21 note,
hidden.

| Letter (rules #) | Section | Sheet label | Claimed key (`UsrDeductUndChapVIA`) | Allowed / System-calculated (`DeductUndChapVIA`) |
|---|---|---|---|---|
| a (1a) | 80G | 80G - Donations to certain funds, charitable institutions, etc. (Please fill 80G Schedule; auto-populated) | `Section80G` | `Section80G` — from `Per…80G.TotalEligibleDonationsUs80G` |
| b (1b) | 80GGB | 80GGB - Contribution given by companies to political parties | `Section80GGB` | `Section80GGB` — `IF(GrossTotalIncome>=0,MIN(scvia.Section80GGB),0)` |
| c (1c) | 80GGA | 80GGA - Deduction in respect of certain donations for scientific research or rural development (Please fill 80GGA schedule; auto-populated) | `Section80GGA` | `Section80GGA` — zeroed when business income exists (`IF(TotProfBusGain<>0,0,…)`) |
| d (1d) | 80GGC | 80GGC - Contribution to Political party | `Section80GGC` | `Section80GGC` — `IF(GrossTotalIncome>=0,MIN(Total_Donation_Eligible_80GGC),0)` |
| — | **Total Part B** | Total Deduction under Part B (a + b + c + d) | `TotPartBchapterVIA` | `TotPartBchapterVIA` — `MIN(SUM(K48:K51),GTI_limit)` |

Rule **A835** — Total Part B = 80G + 80GGB + 80GGA + 80GGC. Rule **A836** —
80GGA (1c) is allowed only to an assessee with no business income.

---

## 4 · Part C — deductions in respect of certain incomes (items e–p)

Heading (D53): *"2. Part C- Deduction in respect of certain incomes."*

| Letter (rules #) | Section | Sheet label | Claimed key | Allowed key | Detail schedule |
|---|---|---|---|---|---|
| e (2e) | 80-IA | 80IA (d of Schedule 80-IA) - Profits and gains from industrial undertakings or enterprises engaged in infrastructure development, etc. | `Section80IA` | `Section80IA` — `MIN(IA80.TotSchedule80_IA)*1` | Schedule 80-IA (sheet "80") |
| f (2f) | 80-IAB | 80IAB - Profits and gains by an undertaking or enterprise engaged in development of Special Economic Zone | `Section80IAB` | `Section80IAB` — `MIN(scvia.Section80IAB)*1` | — |
| g (2g) | 80-IAC | 80-IAC-Special provision in respect of specified business | `Section80IAC` | `Section80IAC` — `MIN(scvia.Section80IAC)*1` | — (start-up, DPIIT gated) |
| h (2h) | 80-IB | 80IB (e of Schedule 80-IB) - Profits and gains from certain industrial undertakings other than infrastructure development undertakings | `Section80IB` | `Section80IB` — `MIN(IB80.TotSchedule80_IB)*1` | Schedule 80-IB (sheet "80") |
| i (2i) | 80-IBA | 80IBA - Profits and gains from housing projects | `Section80IBA` | `Section80IBA` — `MIN(scvia.Section80IBA)*1` | — |
| j (2j) | 80-IE | 80IE (b of Schedule 80-IE)-Special provisions in respect of certain undertakings or enterprises in certain special category States/North-Eastern States. | `Section80IC` (schema note: *"Also add 80IE"*) | `Section80IC` — `MIN(scvia.Section80IC)*1` | Schedule 80-IE (sheet "80") |
| k (hidden) | 80-ID | 80ID(item 10(e) of Form 10CCBBA) | — | *(row 60 hidden — see below)* | — |
| k (2k) | 80-JJA | 80JJA-Profits and gains from business of collecting and processing of bio-degradable waste. | `Section80JJA` (schema note: *"Also add 80ID"*) | `Section80JJA` — `MIN(scvia.Section80JJA)` | — |
| l (2l) | 80-JJAA | 80JJAA-Employment of new employees | `Section80JJAA` | `Section80JJAA` — `MIN(scvia.Section80JJAA)` | — |
| m (2m) | 80-LA(1) | 80LA(1)(8 of Schedule 80LA)-Certain Income Of Offshore Banking Units | `Section80LA` | `Section80LA` — `MIN(scvia.Section80LA1)` | Schedule 80LA |
| n (2n) | 80-LA(1A) | 80LA(1A) (8 of Schedule 80LA) -Certain Income Of International Financial Services Centre | `Section80LA_1A` | `Section80LA_1A` — `MIN(scvia.Section80LA)` | Schedule 80LA |
| o (2o) | 80-M | 80M- Deduction in respect of certain inter-corporate dividends. | `Section80M` (+ `Section80M_OS`, `Section80M_BP`, and the `Section80MDtls` array) | `Section80M` (+ `Section80M_OS`, `Section80M_BP`) | ScheduleOS / ScheduleBP sub-rows |
| — | 80M sub-row A | ScheduleOS | `Section80MDtls[]` type `ScheduleOS` | `Section80M_OS` | ScheduleOS |
| — | 80M sub-row B | ScheduleBP | `Section80MDtls[]` type `ScheduleBP` | `Section80M_BP` | ScheduleBP |
| p (2p) | 80-PA | 80PA- Deduction in respect of certain Income of Producer Companies | `Section80PA` | `Section80PA` — `MIN(scvia.Section80PA)` | — |
| — | **Total Part C** | Total Deduction under Part C (total of e to p) | `TotPartCchapterVIA` | `TotPartCchapterVIA` | — |
| — | **Total Chapter VI-A** | Total Deductions under Chapter VI-A (1 + 2) | `TotalChapVIADeductions` | `TotalChapVIADeductions` — `MIN(…, GTI_limit)` | — |

**Hidden row r60 (80-ID)** — *"80ID(item 10(e) of Form 10CCBBA)"* — is hidden in
the utility (its allowance is folded into the 80JJA claimed key, per the schema
note *"Also add 80ID"* on `Section80JJA`). Per rule 1 of the constitution it is
**not built as its own row**; logged as excluded: *hidden 80-ID line, folded into
80JJA*.

### The 80M sub-block

Section 80M (inter-corporate dividends) splits by the head the dividend sits in:
row A = **ScheduleOS**, row B = **ScheduleBP**. The schema carries a
`Section80MDtls` array (each row: `Section80MDate`, `Section80MAmnt`,
`Section80MType` ∈ {ScheduleBP, ScheduleOS}) plus the split totals `Section80M_OS`
and `Section80M_BP`. Both are switched off for a belated return
(`IF(MID(ReturnFileSec,1,6)="139(4)",0,…)`).

### Helper cells on the sheet (cols Q–S, rows 64–67)

The utility leaves working notes in the right-hand helper columns; they are not
filed but are read here so nothing on the live rows is missed:

| Cell | Text | Meaning |
|---|---|---|
| Q64 | (i+ii+iii+iv+vii+xii+xiii) Col 5 of BFLA | which BFLA rows feed the 80LA base |
| R65 | sum80LA1 | the 80LA(1) offshore-banking-unit sum |
| R66 | sum80LA1A | the 80LA(1A) IFSC-centre sum |
| S67 | sheet1.NRI_IFSC_1 | the Part-A "IFSC unit" flag that unlocks 80LA |

---

## 5 · The claimed / allowed pattern and the GTI cap

Every row exists twice: the **claimed** figure the filer enters (or that
auto-populates from the detail schedule) under `UsrDeductUndChapVIA`, and the
**System Calculated** allowed figure under `DeductUndChapVIA` (col K). The
allowed side applies the caps — `GTI_limit` on the totals, the belated-return
zeroing on 80M, the business-income gate on 80GGA. Part B-TI reads the *allowed*
side: rule **A746** — Part B of the VI-A deduction at Part B-TI = Sl. No. 1 of
Schedule VI-A; rule **A740** — Part C = Sl. No. 2 of Schedule VI-A (but capped at
BFLA ii5 as reduced by presumptive income). Rule **A848** / **A815** — under
115BAB / 115BAA most of these deductions cannot be claimed (only 80JJAA survives
the profit-linked list).

---

## 6 · Cross-sheet feeds

| Direction | What | Where |
|---|---|---|
| **In** | 80G/80GGA/80GGB/80GGC eligible totals; 80-IA/IB/IE totals from sheet "80"; 80LA, 80M, 80PA figures; `GrossTotalIncome`, `GTI_limit`, `ReturnFileSec` | the donation schedules, Schedule 80, Part A-General, Part B-TI |
| **Out** | `TotPartBchapterVIA` (→ Part B-TI Part B), `TotPartCchapterVIA` (→ Part B-TI Part C), `TotalChapVIADeductions` | Part B-TI |

---

## 7 · What is mandatory (schema `required`)

`ScheduleVIA` requires both objects **`UsrDeductUndChapVIA`** and
**`DeductUndChapVIA`**. Within each, the required leaves are the three totals:
**`TotPartBchapterVIA`, `TotPartCchapterVIA`, `TotalChapVIADeductions`** — present
even at zero. Every individual `Section80*` line is optional (written only when
carrying a value), as is the `Section80MDtls` array and its
`Section80MDate` / `Section80MAmnt` / `Section80MType` fields.

Full leaf list on each object (both `UsrDeductUndChapVIA` and `DeductUndChapVIA`):
`Section80G`, `Section80GGA`, `Section80GGB`, `Section80GGC`, `TotPartBchapterVIA`,
`Section80IA`, `Section80IAB`, `Section80IAC`, `Section80IBA`, `Section80IB`,
`Section80IC`, `Section80JJA`, `Section80JJAA`, `Section80LA`, `Section80LA_1A`,
`Section80M`, `Section80M_OS`, `Section80M_BP`, `Section80PA`, `TotPartCchapterVIA`,
`TotalChapVIADeductions` (`UsrDeductUndChapVIA` additionally carries `Section80IAC`
and the `Section80MDtls` array).

---

## 8 · What repeats and what does not

| Where | Repeatable? |
|---|---|
| `Section80MDtls` (80M dividend detail rows) | **yes** — one per dividend, addable |
| Every other item (a–p and the three totals) | **one figure each**, in the claimed and allowed columns |

---

## 9 · What ITR-6 has here that ITR-2 does not

Almost the whole schedule differs. ITR-2's VI-A is dominated by **payment
deductions** for individuals — 80C, 80CCD, 80D, 80E, 80TTA/TTB, 80U — none of
which appear here. ITR-6's VI-A is dominated by the **profit-linked business
deductions** of Part C — the 80-IA / 80-IAB / 80-IAC / 80-IB / 80-IBA / 80-IE
family, 80-JJAA (new-employee), 80-LA (offshore/IFSC units), **80-M
(inter-corporate dividends, with its ScheduleOS/ScheduleBP split)** and **80-PA
(producer companies)** — and by the concessional-regime gates (115BAA / 115BAB)
that switch most of them off. The claimed-vs-allowed ("System Calculated") two-
column layout is shared, but the caps behind it (GTI limit, BFLA ii5, presumptive
reduction) are the company computation.

---

## 10 · What this means for the build

1. **Two parallel objects** — `UsrDeductUndChapVIA` (claimed) and
   `DeductUndChapVIA` (allowed / System Calculated); render both columns, the
   allowed one green and untypeable.
2. **Part B = a–d only** (80G, 80GGB, 80GGA, 80GGC); no individual reliefs.
3. **Part C = e–p**, each feeding from or gated by its detail schedule; the 80M
   row carries the repeatable `Section80MDtls` array split into OS and BP.
4. **Do not build the hidden r47 note or the hidden r60 (80-ID) line**; fold 80-ID
   into 80JJA per the schema note.
5. **Apply the caps on the allowed side** — GTI limit on totals, 139(4) zeroing on
   80M, no-business-income gate on 80GGA, 115BAA/115BAB gate on the profit-linked
   list (only 80JJAA survives).
6. **Export the three totals on each object even at zero**; everything else only
   when it carries a value.
7. **Flag the A602 "2d" numbering** for 80-IAC as a rules-vs-sheet mismatch when
   encoding rules.
