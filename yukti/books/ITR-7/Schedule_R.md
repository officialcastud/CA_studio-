# The book of Schedule R — ITR-7, A.Y. 2026-27

Read row by row from the utility's **Schedule R** sheet (rows 2–11) and confirmed
against the CBDT ITR-7 schema block **`ITRScheduleR`**. Schedule R is the
**Reconciliation of Corpus of Schedule J and Balance sheet** — a small grid that
bridges the closing corpus reported in Schedule J block A1 to the corpus shown in
the Part A Balance Sheet, explaining the difference line by line. Nothing here is
invented; Appendix 2 lists every schema leaf, Appendix 3 reproduces every live
row verbatim.

The sheet's own heading (C2): *"Reconciliation of Corpus of Schedule J and
Balance sheet."*

---

## 1 · Purpose and shape

One reconciliation grid: five particular rows (A, B, Bi, Bii, Biii, C) down the
side, and three corpus-type columns across the top. Each cell is an integer that
may be negative (the reasons-of-difference lines can be `+` or `−`).

The three columns (header row 4) are the three corpus categories carried
consistently across Schedule J, the Balance Sheet and here:

| Col | Header label (row 4) | Schema field suffix |
|---|---|---|
| (1) | Corpus out of the donations received for renovation or repair of places notified u/s 80G(2)(b) on or after 01.04.2020 | `CorpOutOf80G2b` |
| (2) | Other corpus received on or after 01.04.2021 | `OthCorpReceived` |
| (3) | Corpus other than (1) and (2) | `CorpOthThan` |

The rows down the side (col C / D):

| Item | Row | Particulars (col D) | Schema node |
|---|---|---|---|
| **A** | 6 | Closing balance as on 31.03.2026 as per Schedule J | `ClosngBalSchJ` |
| **B** | 7 | Reasons of difference(+/-) (Bi+Bii+Biii) | `ReasonsOfDiff.TotalReasonsOfDiff` |
| **B(i)** | 8 | Purchase of fixed asset | `ReasonsOfDiff.PurchFixedAsset` |
| **B(ii)** | 9 | Depreciation | `ReasonsOfDiff.Depreciation` |
| **B(iii)** | 10 | Any other reason (Please specify) | `ReasonsOfDiff.AnyOthReason` |
| **C** | 11 | Closing balance as on 31.03.2026 as per Balance sheet (A+B) | `ClosngBalBalSheet` |

Each node carries the three corpus columns as its leaf fields (`.CorpOutOf80G2b`,
`.OthCorpReceived`, `.CorpOthThan`).

---

## 2 · The reconciliation the sheet computes

For each of the three corpus columns:

```
C  (per Balance sheet)  =  A  (per Schedule J)  +  B  (reasons of difference)
B  (total reasons)      =  B(i)  +  B(ii)  +  B(iii)
```

- **A — per Schedule J** is the closing corpus on 31.03.2026 taken from
  Schedule J block A1 column 7 (`ClosingBlc`), split by the same three corpus
  types.
- **B — reasons of difference** explains why the corpus figure carried in the
  Balance Sheet differs from the Schedule J figure. The two standard reasons are
  **B(i) Purchase of fixed asset** (corpus applied to buy a capital asset reduces
  the fund figure in Schedule J but the asset still sits in the Balance Sheet) and
  **B(ii) Depreciation** (a Balance-Sheet charge with no Schedule-J counterpart);
  **B(iii) Any other reason (Please specify)** captures any residual, and may be
  positive or negative.
- **C — per Balance sheet** is the corpus figure that must equal the three corpus
  lines of the Part A Balance Sheet (1a Corpus80G, 1b OtherCorpus, 1c corpus other
  than a and b). It is the required output of the schedule.

Because the difference lines can move either way, cells B8:G10 carry a signed
data-validation (`-99999999999999`).

---

## 3 · Cross-sheet feeds

- **In ←** line **A** is the closing corpus of **Schedule J** block A1
  (`ScheduleJ_A1` closing balances), by corpus type.
- **In / cross-check ←** line **C** ties to the corpus lines of the **Part A
  Balance Sheet** (`PARTA_BS.SourcesOfFund.OwnFund.Corpus80G / OtherCorpus /
  AccumulatedInc`).
- **Out →** the reconciled corpus is the department's audit bridge; only line C
  (`ClosngBalBalSheet`) is a required schema output.

---

## 4 · What the schema marks mandatory

Only the three columns of line **C** — `ClosngBalBalSheet.CorpOutOf80G2b`,
`.OthCorpReceived`, `.CorpOthThan` — are `required`. The `ClosngBalSchJ` line and
every `ReasonsOfDiff` node are optional leaves (filled only where there is a
figure or a difference to explain). The full leaf list is in Appendix 2. There
are **no enumerated (list) dropdowns** on this sheet; cells E8:G10 carry only a
signed numeric data-validation.

---

## Appendix 1 · Heading, verbatim

```
[B2] Schedule R  |  [C2] Reconciliation of Corpus of Schedule J and Balance sheet
```

---

## Appendix 2 · Every schema leaf of block `ITRScheduleR` (full paths)
`*` = required.
```
  ClosngBalSchJ.CorpOutOf80G2b integer
  ClosngBalSchJ.OthCorpReceived integer
  ClosngBalSchJ.CorpOthThan integer
  ReasonsOfDiff.TotalReasonsOfDiff.CorpOutOf80G2b integer
  ReasonsOfDiff.TotalReasonsOfDiff.OthCorpReceived integer
  ReasonsOfDiff.TotalReasonsOfDiff.CorpOthThan integer
  ReasonsOfDiff.PurchFixedAsset.CorpOutOf80G2b integer
  ReasonsOfDiff.PurchFixedAsset.OthCorpReceived integer
  ReasonsOfDiff.PurchFixedAsset.CorpOthThan integer
  ReasonsOfDiff.Depreciation.CorpOutOf80G2b integer
  ReasonsOfDiff.Depreciation.OthCorpReceived integer
  ReasonsOfDiff.Depreciation.CorpOthThan integer
  ReasonsOfDiff.AnyOthReason.CorpOutOf80G2b integer
  ReasonsOfDiff.AnyOthReason.OthCorpReceived integer
  ReasonsOfDiff.AnyOthReason.CorpOthThan integer
* ClosngBalBalSheet.CorpOutOf80G2b integer
* ClosngBalBalSheet.OthCorpReceived integer
* ClosngBalBalSheet.CorpOthThan integer
```

---

## Appendix 3 · Every live row of the sheet, verbatim
```
[B2] Schedule R  |  [C2] Reconciliation of Corpus of Schedule J and Balance sheet
[C4] Sl.No  |  [D4] Particulars  |  [E4] Corpus out of the donations received for renovation or repair of places notified u/s 80G(2)(b) on or after 01.04.2020  |  [F4] Other corpus received on or after 01.04.2021  |  [G4] Corpus other than (1) and (2)
[E5] (1)  |  [F5] (2)  |  [G5] (3)
[C6] A  |  [D6] Closing balance as on 31.03.2026 as per Schedule J
[C7] B  |  [D7] Reasons of difference(+/-) (Bi+Bii+Biii)
[C8] (i)  |  [D8] Purchase of fixed asset
[C9] (ii)  |  [D9] Depreciation
[C10] (iii)  |  [D10] Any other reason (Please specify)
[C11] C  |  [D11] Closing balance as on 31.03.2026 as per Balance sheet (A+B)
```

---

## Appendix 4 · Dropdowns

None. The only data-validation on the sheet is a signed numeric range
(`-99999999999999`) on the reason-of-difference cells E8:G10.
