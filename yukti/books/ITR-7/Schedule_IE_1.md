# The book of Schedule IE-1 — Income & Expenditure (regime 1) · ITR-7, A.Y. 2026-27

Read row by row from the utility's **IE-1** sheet (rows 3–6; no hidden rows) and
confirmed against the CBDT ITR-7 schema block **ScheduleIE_I**. This is the
**Income & Expenditure statement** for institutions whose exemption is **not
subject to a computational or application test** — the receipts, application and
accumulation are stated as three plain figures. Per its head note it is
*Applicable for assessees claiming exemption under sections 10(21), 10(23AAA),
10(23B), 10(23D), 10(23DA), 10(23EC), 10(23ED), 10(23EE), 10(23FB), 10(29A),
10(46), 10(46A), 10(46B), 10(47), 10(21) read with section 35(1)*. Nothing is
invented: Appendix 2 lists every schema leaf, Appendix 3 reproduces every live
row verbatim.

---

## 1 · Purpose and shape

The simplest of the four IE statements: three sequential figures, one per row.

| Row | Item | Label (verbatim) | Type | Schema key |
|---|---|---|---|---|
| 3 | — | Income & Expenditure statement (Applicable for assessees claiming exemption under sections 10(21),10(23AAA), 10(23B), 10(23D), 10(23DA), 10(23EC), 10(23ED), 10(23EE), 10(23FB), 10(29A), 10(46), 10(46A), 10(46B), 10(47) , 10(21) read with section 35(1)) | header | — |
| 4 | 1 | Total receipts including any voluntary contribution | integer | `TotRcptVoluntaryContr` |
| 5 | 2 | Application of income towards object of the institution | integer | `AppIncTwrdsObjInstn` |
| 6 | 3 | Accumulation of income | integer | `AccmltnOfInc` |

---

## 2 · The law and computation the section-builder must encode

The exemptions listed in the head note (10(21), 10(23AAA), 10(23B), 10(23D),
10(23DA), 10(23EC), 10(23ED), 10(23EE), 10(23FB), 10(29A), 10(46), 10(46A),
10(46B), 10(47), and 10(21) read with s.35(1)) grant a **blanket exemption to the
entity's income** and are **not subject to computational or application
conditions** the way section 11 or 10(23C) charitable exemptions are. The IE-1
statement therefore only needs the trust to state the money that moved:

- **1 Total receipts including any voluntary contribution** (`TotRcptVoluntaryContr`)
  — the gross receipts of the year, inclusive of any voluntary contribution
  received.
- **2 Application of income towards object of the institution** (`AppIncTwrdsObjInstn`)
  — the amount applied during the year towards the objects of the institution.
- **3 Accumulation of income** (`AccmltnOfInc`) — the amount of income
  accumulated (not applied) during the year.

All three are required integers. There is no on-sheet total row and no
eligibility computation — the balance (receipts − application) is reflected as
accumulation, and the exemption is claimed on the strength of the notified
section, not a percentage test. The regime chosen (from the head-note sections)
is carried from the return's ExemptionClaimed selection elsewhere; this schedule
is the operating statement for those regimes.

---

## 3 · Dropdowns

Schedule IE-1 has **no value dropdowns** — the three inputs are integer amounts.
The dump reports only a formatting source (K4:K6) with a null value list.

---

## Appendix 1 · Dropdown values (verbatim)
```
(none — Schedule IE-1 has no selectable dropdown lists; all three inputs are integer amounts)
```

---

## Appendix 2 · Every schema leaf of block ScheduleIE_I (full paths)
`*` = required.
```
* TotRcptVoluntaryContr integer
* AppIncTwrdsObjInstn integer
* AccmltnOfInc integer
```

---

## Appendix 3 · Every live row of the sheet, verbatim
```
[C3] Schedule IE-1  |  [E3] Income & Expenditure statement (Applicable for assessees claiming exemption under sections 10(21),10(23AAA), 10(23B), 10(23D), 10(23DA), 10(23EC), 10(23ED), 10(23EE), 10(23FB), 10(29A), 10(46), 10(46A), 10(46B), 10(47) , 10(21) read with section 35(1) {Exemptions are not subject to computational or
[E4] Total receipts including any voluntary contribution
[E5] Application of income towards object of the institution
[E6] Accumulation of income
```
