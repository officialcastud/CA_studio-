# BLOCKED — Schedule S (ITR-3) Gate 3 cannot reach GREEN

## Status
Book `books/ITR-3/Schedule_S.md` is complete and correct: every visible labelled row is
covered, every schema leaf key of block `ScheduleS` (all required keys, plus the array
keys `Salaries[]`, `NatureOfSalary/NatureOfPerquisites/NatureOfProfitInLieuOfSalary`
`OthersIncDtls[]`, `IncomeNotified89AType[]`, `AllwncExemptUs10Dtls[]`, `Section10_13A.*`)
appears verbatim, and every dropdown group and value is listed (EmpCategory, State,
salarydropdown1/2/3, AllowanceBACYes, Place-of-residence, notified-country). The single
hidden row (104, helper stub `aaa`) is listed only under "Hidden rows — not built".

`python3 tools/gates/gate.py --form ITR-3 --gate 3 --sheet "Schedule S"` still prints
`GATE 3: RED — 6 items`, all of the form `label not in book: <X>`. Every one of the 6 labels
IS present verbatim in the book (verified with grep and by replicating the gate's own matcher).
The failures are a gate defect, not a book gap.

## Root cause (tools/gates/gate.py, gate3, line 75)
    if words and sum(1 for w in words if w in book) < max(2, len(words)-2): missing.append(...)
where `words` = significant words of the label (len>3, not in STOP), capped at 6.

For any label that reduces to exactly ONE significant word, the threshold is
`max(2, 1-2) = 2`, but the maximum achievable match count is 1. The condition is always true,
so the label is always reported missing — no book content can change the count, which derives
from the immutable sheet label, not the book. Labels with 0 significant words are skipped
(`if words` falsy); labels with >=2 are satisfiable. Only the 1-word case is impossible.
Verified empirically: appending the six phrases (repeated, with extra "salary" tokens) to the
book does not clear any of the six failures.

## The 6 affected VISIBLE labels on this sheet (all single-significant-word)
- Salary as per section 17(1) (row 8)  -> {salary}   (as/per/section STOP; 17,1 too short)
- Salary as per section 17(1) (row 34) -> {salary}   (second employer block)
- 50% /40% of salary (C) (row 73)      -> {salary}   (50,40,c too short; of STOP)
- Net Salary (2- 2a - 3) (row 75)      -> {salary}   (net len 3; 2,2a,3 too short)
- Deduction u/s 16 (5a + 5b + 5c) (row 76) -> {deduction}  (u,s,16,5a,5b,5c too short)
- Professional tax u/s 16(iii) (row 79)    -> {professional} (tax STOP; iii len 3)

All 6 are present verbatim in books/ITR-3/Schedule_S.md.

## This is systemic, not sheet-specific
Same class of failure already logged for Part A - BS and Profit and Loss (see
BLOCKED_Part_A_BS.md). Every ITR sheet carrying a single-strong-word visible label hits it.

## What is needed (for the auditor/CEO — NOT done here; readers never edit gates)
Change the gate's threshold so a 1-significant-word label needs only its 1 word, e.g.
`max(1, len(words)-2)` or `min(len(words), max(2, len(words)-2))`. This is a gate fix owned by
the gate maintainer, with example.html/gates re-verified. The book itself needs no change.
