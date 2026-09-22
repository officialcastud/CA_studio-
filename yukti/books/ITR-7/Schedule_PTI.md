# The book of Schedule PTI — Pass-through income · ITR-7, A.Y. 2026-27

Read row by row from the utility's **Schedule PTI** sheet (rows 3–23, all
visible), with the dropdown, and confirmed against the CBDT ITR-7 schema block
**SchedulePTI**. Item numbers (i / iia / iib / iii / iv, and the column numbers
7–10) are taken from the sheet's own lettering and the ITR-7 validation-rules
document (rules A383, A384, A305, A428, A442–A444). Nothing here is invented —
Appendix A reproduces every schema leaf, Appendix B every live row verbatim,
Appendix C the dropdown.

---

## 1 · Purpose and shape

*"Schedule PTI — PASS THROUGH INCOME DETAILS FROM BUSINESS TRUST OR INVESTMENT
FUND AS PER SECTION 115U/115UA AND 115UB."* Income that a REIT, InvIT, AIF or
venture-capital fund earned and passed to the ITR-7 filer as a unit holder, taxed
in the filer's hands **under the head it had in the fund's hands** — which is why
the HP, CG, OS and exempt-income schedules each carry a pass-through line that PTI
feeds. PTI is a disclosure of source; it does not itself add to income.

Each block is one business trust or investment fund. It has a three-field header
and a fixed body of head rows with four money columns. The `SchedulePTIDtls`
array is **repeatable** — one object per fund.

**Header — columns E, F, G (items 2, 3, 4):**

| Col | Item | Field (verbatim) | Type / enum | Schema key |
|---|---|---|---|---|
| E | (2) | **Investment entity covered by section 115U/115UA/115UB** | dropdown **(Select) / Section 115U / Section 115UA / Section 115UB** | `InvstmntCvrdUs115UA115UB` |
| F | (3) | **Name of business trust/ investment fund** | text, required | `BusinessName` |
| G | (4) | **PAN of the business trust/ investment fund** | PAN, required | `BusinessPAN` |

**Body — the four money columns on every head row (columns L, M, N, O):**

| Col | No. | Heading (verbatim) |
|---|---|---|
| L | (7) | **Current year income (7)** |
| M | (8) | **Share of current year loss distributed by Investment fund** |
| N | (9) | **Net Income/Loss 9=7-8** (computed) |
| O | (10) | **TDS on such amount, if any** |

---

## 2 · The head rows → schema map

The Sl. lettering is the sheet's own (columns H/I/J).

| Sl. (5) | Head of income (6) | Schema leaf under `SchedulePTIDtls[]` |
|---|---|---|
| i | **House property** | `IncFromHP` |
| ii | **Capital Gains** (heading) | `CapitalGainsPTI` |
| ii a | **Short term** (heading) | `CapitalGainsPTI.ShortTermCG` |
| ii a i | **Section 111A** | `CapitalGainsPTI.STCG_Sec111A` |
| ii a ii | **Others** | `CapitalGainsPTI.STCG_Others` |
| ii b | **Long term** (heading) | `CapitalGainsPTI.LongTermCG` |
| ii b i | **Section 112A** | `CapitalGainsPTI.LTCG_Sec112A` |
| ii b ii | **Sections other than 112A** | `CapitalGainsPTI.LTCG_Others` |
| iii | **Other Sources** (heading) | `IncOthSrc` |
| iii a | **DIVIDEND** | `OS_Dividend` |
| iii b | **Others** | `OS_Others` |
| iv | **Income claimed to be exempt** (heading) | `IncClmdPTI` |
| iv (u/s) | **u/s 10(23FBB)** | `IncClmdPTI.TotalSec23FBB` |
| iv a / b / c | **u/s** — *specify section* | `IncClmdPTI.IncClmdExmptDtls[]` (`SectionCode` + amounts) |

Column 8 — *share of the current-year loss distributed* — exists because an
investment fund may pass a loss through; the net in column 9 can be negative and
then goes to the head's schedule as a loss. Each money leaf is an object of
`AmountOfInc` (col 7), `CurrYrLossShareByInvstFund` (col 8, on the HP and CG
objects only), `NetIncomeLoss` (col 9) and `TDSAmount` (col 10). The
other-sources and exempt objects have no `CurrYrLossShareByInvstFund` leaf — only
`AmountOfInc`, `NetIncomeLoss` and `TDSAmount`.

---

## 3 · The rules the sheet computes

- Col. **9** = Col. **7 − 8** on every head row
  (`NetIncomeLoss = AmountOfInc − CurrYrLossShareByInvstFund`).
- Sl. No. **iia Short Term** = ai + aii; **iib Long Term** = bi + bii; **iii Other
  Sources** = a + b; **iv Income claimed to be exempt** = the sum of its section
  lines.
- **A383 / A384** — the pass-through amounts on the schedules that receive them
  (HP item 2, CG A8 / B11, OS 2d) must be at least the sum of the corresponding
  PTI lines across all names of business trust / investment fund.

---

## 4 · Where each row goes

| PTI row | Lands in |
|---|---|
| i — house property | Schedule HP item **2** (A383, A485) |
| ii a i — STCG 111A | Schedule CG A8 / Schedule SI (A442) |
| ii a ii — STCG others | Schedule CG A8b / Schedule SI @30% (A389, A442) |
| ii b i — LTCG 112A | Schedule CG B10a1 / Schedule SI 112A (A428, A443) |
| ii b ii — LTCG other than 112A | Schedule CG / Schedule SI (A444) |
| iii a — dividend | Schedule OS 2 |
| iii b — others | Schedule OS 2 / 2d special rate (A305) |
| iv — exempt | Schedule EI — pass-through not chargeable |
| column 10 — TDS | Schedule TDS, with the head of income set accordingly |

---

## 5 · What is mandatory

On every block the schema marks required: the entity type
(`InvstmntCvrdUs115UA115UB`), name (`BusinessName`), PAN (`BusinessPAN`), and, on
each head object present, `AmountOfInc`, `NetIncomeLoss` and `TDSAmount` (and
`CurrYrLossShareByInvstFund` where that leaf exists — the HP and CG objects). On
each `IncClmdExmptDtls` exempt line, `SectionCode` and its
`SecBCIncExmptDtl.{AmountOfInc, NetIncomeLoss, TDSAmount}`.

---

## 6 · What repeats

A repeatable block: three header fields (one dropdown) then the fixed head rows
with four columns each, net (col 9) computed as 7 − 8. Export
`SchedulePTI.SchedulePTIDtls[]` with every head object present.

---

## Appendix A · Full schema key map (`SchedulePTI`)

Required keys marked *. Every live row above maps to one of these leaves.

```
  SchedulePTIDtls[] array
* SchedulePTIDtls[].InvstmntCvrdUs115UA115UB string
* SchedulePTIDtls[].BusinessName string
* SchedulePTIDtls[].BusinessPAN string
* SchedulePTIDtls[].IncFromHP.AmountOfInc integer
* SchedulePTIDtls[].IncFromHP.CurrYrLossShareByInvstFund integer
* SchedulePTIDtls[].IncFromHP.NetIncomeLoss integer
* SchedulePTIDtls[].IncFromHP.TDSAmount integer
* SchedulePTIDtls[].CapitalGainsPTI.ShortTermCG.AmountOfInc integer
* SchedulePTIDtls[].CapitalGainsPTI.ShortTermCG.CurrYrLossShareByInvstFund integer
* SchedulePTIDtls[].CapitalGainsPTI.ShortTermCG.NetIncomeLoss integer
* SchedulePTIDtls[].CapitalGainsPTI.ShortTermCG.TDSAmount integer
* SchedulePTIDtls[].CapitalGainsPTI.STCG_Sec111A.AmountOfInc integer
* SchedulePTIDtls[].CapitalGainsPTI.STCG_Sec111A.CurrYrLossShareByInvstFund integer
* SchedulePTIDtls[].CapitalGainsPTI.STCG_Sec111A.NetIncomeLoss integer
* SchedulePTIDtls[].CapitalGainsPTI.STCG_Sec111A.TDSAmount integer
* SchedulePTIDtls[].CapitalGainsPTI.STCG_Others.AmountOfInc integer
* SchedulePTIDtls[].CapitalGainsPTI.STCG_Others.CurrYrLossShareByInvstFund integer
* SchedulePTIDtls[].CapitalGainsPTI.STCG_Others.NetIncomeLoss integer
* SchedulePTIDtls[].CapitalGainsPTI.STCG_Others.TDSAmount integer
* SchedulePTIDtls[].CapitalGainsPTI.LongTermCG.AmountOfInc integer
* SchedulePTIDtls[].CapitalGainsPTI.LongTermCG.CurrYrLossShareByInvstFund integer
* SchedulePTIDtls[].CapitalGainsPTI.LongTermCG.NetIncomeLoss integer
* SchedulePTIDtls[].CapitalGainsPTI.LongTermCG.TDSAmount integer
* SchedulePTIDtls[].CapitalGainsPTI.LTCG_Sec112A.AmountOfInc integer
* SchedulePTIDtls[].CapitalGainsPTI.LTCG_Sec112A.CurrYrLossShareByInvstFund integer
* SchedulePTIDtls[].CapitalGainsPTI.LTCG_Sec112A.NetIncomeLoss integer
* SchedulePTIDtls[].CapitalGainsPTI.LTCG_Sec112A.TDSAmount integer
* SchedulePTIDtls[].CapitalGainsPTI.LTCG_Others.AmountOfInc integer
* SchedulePTIDtls[].CapitalGainsPTI.LTCG_Others.CurrYrLossShareByInvstFund integer
* SchedulePTIDtls[].CapitalGainsPTI.LTCG_Others.NetIncomeLoss integer
* SchedulePTIDtls[].CapitalGainsPTI.LTCG_Others.TDSAmount integer
* SchedulePTIDtls[].IncOthSrc.AmountOfInc integer
* SchedulePTIDtls[].IncOthSrc.NetIncomeLoss integer
* SchedulePTIDtls[].IncOthSrc.TDSAmount integer
* SchedulePTIDtls[].OS_Dividend.AmountOfInc integer
* SchedulePTIDtls[].OS_Dividend.NetIncomeLoss integer
* SchedulePTIDtls[].OS_Dividend.TDSAmount integer
* SchedulePTIDtls[].OS_Others.AmountOfInc integer
* SchedulePTIDtls[].OS_Others.NetIncomeLoss integer
* SchedulePTIDtls[].OS_Others.TDSAmount integer
  SchedulePTIDtls[].IncClmdPTI.IncClmdExmptDtls[] array
* SchedulePTIDtls[].IncClmdPTI.IncClmdExmptDtls[].SectionCode string
* SchedulePTIDtls[].IncClmdPTI.IncClmdExmptDtls[].SecBCIncExmptDtl.AmountOfInc integer
* SchedulePTIDtls[].IncClmdPTI.IncClmdExmptDtls[].SecBCIncExmptDtl.NetIncomeLoss integer
* SchedulePTIDtls[].IncClmdPTI.IncClmdExmptDtls[].SecBCIncExmptDtl.TDSAmount integer
* SchedulePTIDtls[].IncClmdPTI.TotalSec23FBB.AmountOfInc integer
* SchedulePTIDtls[].IncClmdPTI.TotalSec23FBB.NetIncomeLoss integer
* SchedulePTIDtls[].IncClmdPTI.TotalSec23FBB.TDSAmount integer
```

---

## Appendix B · Every live row of the Schedule PTI sheet, verbatim

```
r3  : [C3] Schedule PTI | [F3] PASS THROUGH INCOME DETAILS FROM BUSINESS TRUST OR INVESTMENT FUND AS PER SECTION 115U/115UA AND 115UB
r4  : [D4] SI no | [E4] Investment entity covered by section 115U/115UA/115UB | [F4] Name of business trust/ investment fund | [G4] PAN of the business trust/ investment fund | [H4] SI. No. | [I4] Head of income | [L4] Current year income (7) | [M4] Share of current year loss distributed by Investment fund | [N4] Net Income/Loss 9=7-8 | [O4] TDS on such amount, if any
r6  : [E6] (SELECT) | [H6] i | [I6] House property
r7  : [H7] ii | [I7] Capital Gains
r8  : [I8] a | [J8] Short term
r9  : [I9] ai | [J9] Section 111A
r10 : [I10] aii | [J10] Others
r11 : [I11] b | [J11] Long term
r12 : [I12] bi | [J12] Section 112A
r13 : [I13] bii | [J13] Sections other than 112A
r14 : [H14] iii | [I14] Other Sources
r15 : [I15] a | [J15] DIVIDEND
r16 : [I16] b | [J16] Others
r17 : [H17] iv | [I17] Income claimed to be exempt
r18 : [J18] u/s | [K18] 10(23FBB)
r19 : [I19] a | [J19] u/s
r20 : [I20] b
r21 : [I21] c
r22 : [I22] d
r23 : [I23] e
```

No hidden rows — all rows 3–23 are visible.

---

## Appendix C · The dropdown

### Investment entity covered by section 115U/115UA/115UB (`InvstmntCvrdUs115UA115UB`) — cell E6
`(Select)` · **Section 115U** · **Section 115UA** · **Section 115UB**.
