# ITR-2 — Deductions verified against the utility, and the three schedules

Read from the utility's **VI-A** sheet (92 rows, with the hidden-row flags), the
eleven section-80 sub-sheets, and the schema's `ScheduleVIA`, `Schedule112A`,
`Schedule115AD` and `ScheduleVDA`.

---

## Part 1 · Schedule VI-A — what the utility actually has

The sheet is one list, lettered **a to v**, in two parts. The rows the utility
**hides** are as important as the ones it shows.

### Part B — deductions in respect of certain payments (a to p)

| Letter | Section | On the sheet | In Yukti today |
|---|---|---|---|
| a | 80C | live | ✓ figure — **sub-schedule 80C (identifier table) missing** |
| b | 80CCC | live, **with an identifier table** — type, identifier number, amount | ✓ figure — **identifier table missing** |
| c | 80CCD(1) | live, with an identifier table (header hidden, rows live) | ✓ figure — **identifier table missing** |
| d | 80CCD(1B) | live, with an identifier table **and a PRAN field** | ✓ figure — **identifier table and PRAN missing** |
| e | 80CCD(2) | live | ✓ |
| — | 80CCG | **hidden** — withdrawn | ✓ correctly absent |
| — | 80CCF | **hidden** — withdrawn | ✓ correctly absent |
| f | 80D | live — *"please fill schedule 80D; auto-populated"* | ✓ figure + card |
| g | 80DD | live — *"please fill schedule 80DD"* | ✓ figure — **card missing** |
| h | 80DDB | live, **with the specified-disease dropdown** | ✓ figure — **disease dropdown missing** |
| i | 80E | live | ✓ figure — **lender card missing** |
| j | 80EE | live | ✓ figure — **lender card missing** |
| k | 80EEA | live | ✓ figure — **lender card missing** |
| l | 80EEB | live | ✓ figure — **lender card missing** |
| m | 80G | live — *"please fill 80G Schedule"* | ✓ figure + card |
| n | 80GG | live, **with the Form 10BA acknowledgement** | ✓ figure — **10BA acknowledgement missing** |
| o | 80GGA | live — *"please fill 80GGA Schedule"* | ✓ figure — **card missing** |
| p | 80GGC | live — *"please fill 80GGC Schedule"* | ✓ figure — **card missing** |

### Part C, CA and D — deductions in respect of certain incomes (q to ub)

| Letter | Section | On the sheet | In Yukti today |
|---|---|---|---|
| — | 80IA, 80IAB, 80IB, 80IBA, 80IC/IE, 80ID, 80JJA, 80JJAA | **all hidden** — business deductions, not on ITR-2 | ✓ correctly absent |
| q | 80QQB | live, **with the Form 10CCD acknowledgement** | ✓ figure — **10CCD acknowledgement missing** |
| r | 80RRB | live, **with the Form 10CCE acknowledgement** | ✓ figure — **10CCE acknowledgement missing** |
| s | 80TTA | live | ✓ |
| t | 80TTB | live | ✓ |
| u | 80U | live — *"please fill 80U Schedule"* | ✓ figure + card |
| ua | 80CCH — Agnipath | live | ✓ |
| **ub** | **Any other deductions** | live | **missing** |
| v | Total (a to ua) | computed | ✓ |

### What is EXTRA in Yukti and must go

| In Yukti | Verdict |
|---|---|
| **Section 10AA card** | **Delete.** The 10AA sheet is hidden in the ITR-2 utility, `10AA` appears nowhere in the schema's `ScheduleVIA`, and it is a business deduction — it belongs to ITR-3. It also drives the AMT flag in the tax engine; that trigger goes with it. |

Nothing else is extra. The 22 sections in Yukti's list are exactly the 22 live
rows of the sheet (a to ua), plus 80QQB/80RRB which are live. The withdrawn
80CCG/80CCF and the eight business deductions are correctly absent.

### The plan for VI-A

**Delete:** the 10AA card and its AMT trigger.

**Add, from the sheet:**

| What | Where it goes |
|---|---|
| `ub` — Any other deductions | one figure, the last line before the total |
| Identifier tables for 80CCC, 80CCD(1), 80CCD(1B) | each a card: type of identifier · identifier number or name · amount; **PRAN** on 80CCD(1B) |
| Form 10BA acknowledgement | under 80GG, 15 digits, required when 80GG is claimed |
| Form 10CCD acknowledgement | under 80QQB, required when claimed |
| Form 10CCE acknowledgement | under 80RRB, required when claimed |
| Specified-disease dropdown | under 80DDB |
| Sub-schedule cards — 80C, 80DD, 80GGA, 80GGC, the 80E group, **Schedule RA** | each read from its own hidden sheet |

The two-column claimed / allowed layout and the 115BAC gate stay as they are —
they match the sheet's own "System Calculated" column.

---

## Part 2 · The section-80 sub-sheets, one by one

Eleven hidden sheets feed the VI-A figures. What each one is, and its status:

| Sheet | Rows | Feeds | Built |
|---|---|---|---|
| **80C** | 11 | VI-A a — identifier table for 80C items | **no** — was in ITR-1, not carried |
| **80G** | 72 | VI-A m — donee by donee in four buckets, with the ₹2,000 cash cap | ✓ card |
| **80D** | 76 | VI-A f — self/family/parents, senior, preventive check-up, medical expenditure | ✓ card — **to re-read**; the ITR-2 sheet is 76 rows against ITR-1's 53, it may carry more |
| **RA** | 15 | VI-A o — **Schedule RA**: research associations and institutions under 35(1)(ii)/(iia)/(iii) and 35(2AA) that the 80GGA donation went to | **no** — not built anywhere |
| **80GGA** | 19 | VI-A o — donee, PAN, mode, amount, ₹10,000 cash cap | **no** — was in ITR-1, not carried |
| **80** | 1000 | the consolidated identifier and detail rows for the smaller sections | partly |
| **80E_80EE_80EEA_80EEB** | 37 | VI-A i to l — lender type, name, account, sanction date, loan, interest | **no** — was in ITR-1, not carried |
| **80U-80DD** | 19 | VI-A u and g — nature of disability, Form 10-IA acknowledgement and date, UDID | 80U ✓ · **80DD no** |
| **80GGC** | 35 | VI-A p — party or trust, PAN, date, mode, reference, IFSC, ₹0 cash | **no** — was in ITR-1, not carried |
| **10AA** | 1000 | — | **hidden and irrelevant — delete** |

---

## Part 3 · Schedule 112A, Schedule 115AD(1)(iii) proviso, Schedule VDA

You asked whether these are already included. **On screen and in the
computation — yes. In the export — no.** That is the gap.

| Schedule | Utility sheet | On screen | In the engine | Exported as its own block |
|---|---|---|---|---|
| **Schedule 112A** | 17 rows, visible | ✓ scrip-by-scrip grid under B4 | ✓ feeds B4a, the 31-Jan-2018 grandfathering | **no** |
| **Schedule 115AD(1)(iii) proviso** | 17 rows, visible | ✓ scrip-by-scrip grid under B7 | ✓ feeds B7a | **no** |
| **Schedule VDA** | 27 rows, visible | ✓ one row per transfer | ✓ feeds C2 | **no** |

The schema has all three as top-level blocks — `Schedule112A`, `Schedule115AD`,
`ScheduleVDA` — each with a details array and a set of required totals. Yukti
computes the right figures and writes them into Schedule CG (B4a, B7a, C2), but
**never writes the scrip-level detail to its own block**. The department
cross-checks 112A scrip by scrip against the broker's AIS feed, so a return that
carries B4a without `Schedule112A` behind it is the kind that draws a notice.

**The plan:** write all three blocks in the export, from the grids that already
exist —

- `Schedule112A` — one `Schedule112ADtls` row per scrip (ISIN, name, held on or
  before 31-01-2018, quantity, sale price, sale value, cost with and without
  indexation, fair value, expenses, balance) and the nine required totals.
- `Schedule115AD` — the identical shape, from the B7 grid.
- `ScheduleVDA` — one `ScheduleVDADtls` row per transfer (dates, head, cost,
  consideration, income) and `TotIncCapGain`.

Nothing on screen changes. It is export only, validated against the schema.

---

## Summary

| | Extra — delete | Missing — add |
|---|---|---|
| VI-A list | 10AA card and its AMT trigger | `ub` any other deductions · identifier tables (80CCC, 80CCD(1), 80CCD(1B) + PRAN) · Form 10BA / 10CCD / 10CCE acknowledgements · 80DDB disease dropdown |
| Sub-schedule cards | — | 80C · 80DD · 80GGA · 80GGC · 80E group · **Schedule RA** ; re-read 80D |
| 112A / 115AD / VDA | — | the three top-level export blocks |
