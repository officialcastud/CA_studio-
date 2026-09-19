# ITR-3 audit — Excel utility vs the software we built (read-only)

You are auditing the **ITR-3 A.Y. 2026-27** software we built (`forms/ITR-3/Yukti_ITR3.html`, assembled
from `forms/ITR-3/src/*.js`) against the **official CBDT Excel utility** (`sources/ITR-3/utility/`), one
sheet at a time. **You do not change any file.** You produce one gap report. Run `cd /home/user/CA_studio-/yukti` first.

## Why this audit exists (read carefully)
ITR-3 is its own form — richer than ITR-2. We took only the **UI** from ITR-2 (the maroon/white look, the
renderers, the fold/card open-close feel). The CEO is worried the *content/logic* leaned on ITR-2 and that
ITR-3-specific options, conditional cascades, regime open/close behaviour, and audit-u/s triggers are
missing or thin. Your job is to find exactly what is missing or wrong, per sheet, in detail.

## How to read the Excel sheet
- `python3 tools/dump.py --form ITR-3 --sheet "<name>" --formulas` — every row. A row printed as `r 31H:`
  (an **H** after the number) is a **hidden row** — i.e. a row the utility shows only when some condition/flag
  is set. These hidden rows ARE the "if Yes is selected, these new options appear / if disabled they hide"
  cascades the CEO asked about. Read the formulas in neighbouring cells and helper columns — the show/hide
  and the audit triggers live there.
- `python3 tools/dump.py --form ITR-3 --dropdowns "<name>"` — the dropdowns and their allowed values.
- Cross-read `books/ITR-3/<Sheet>.md` (our sheet book) and `books/ITR-3/REGIME.md` (the new-vs-old spec).

## How to read our software
- The section file(s) that own your sheet(s): see `books/ITR-3/section_map.json` for the sheet→section map,
  then read `forms/ITR-3/src/70_sec_<id>.js` (screen `sec<Id>`, engine `eng<Id>`, export `exp<Id>`,
  import `imp<Id>`, checks `chk<Id>`). `isNew()` = new regime; `!isNew()` = old regime opted out.
- Grep the assembled `forms/ITR-3/Yukti_ITR3.html` if you need to see the rendered field.

## What to check, per sheet (be specific — cite the Excel cell/row and our code line)
1. **Coverage** — every LIVE (non-hidden-by-design, fileable) row/field/table in the Excel that is **absent**
   from our software. (A row hidden only until a flag is set still counts as a field we must have.)
2. **Dropdowns / enums** — options in the Excel dropdown missing from our `sel()`; wrong or truncated values.
3. **Conditional cascades (the core ask)** — for each Yes/No flag, radio, or type selector on the sheet:
   what rows/tables/sub-schedules the utility **opens when it is set** and **closes when it is cleared**
   (the `H` rows + the driving formula). State whether our software reproduces that show/hide. List every
   cascade that we do NOT reproduce.
4. **Regime open/close** — what the utility opens/closes between **new (115BAC default)** and **old (opted
   out via 10-IEA)** on this sheet, and whether our `isNew()` gating matches it exactly (e.g. deductions,
   10AA, 35AD, HP self-occupied interest, AMT, family-pension 57(iia), std deduction, surcharge/rebate).
5. **Audit u/s** — any audit trigger on this sheet (44AB / 44AD(4)/(5) / 44ADA / 92E / books-of-account
   liability, "are you liable to audit", tax-audit acknowledgement/UDIN/date, the audit-report section
   dropdown) — present in the Excel, and whether we have it.
6. **ITR-2 bleed** — anything that looks ported from ITR-2 rather than built from ITR-3's own sheet
   (numbers, item numbering, missing ITR-3-only rows such as speculative/specified-business, slump sale,
   unabsorbed depreciation).

## Output — write ONE file: `logs/ITR-3/audit/<GROUP>.md`
Use this structure, per sheet you own:

```
## <Sheet name>  (section: <id>)
### Missing fields/rows
- [Excel cell/row] <label> — not in our <sec/eng/exp>. Impact: <what breaks / can't be filed>.
### Dropdowns
- [cell] <field>: Excel has {a,b,c}; we have {a,b}. Missing: c.
### Conditional cascades (show/hide)
- FLAG "<label>" [cell]: set→opens [rows …]; clear→hides […]. Ours: reproduced? YES/NO/PARTIAL — <detail>.
### Regime open/close
- <item>: Excel new=<closed/open>, old=<open>. Ours (isNew gate): <match/mismatch> at <file:line>.
### Audit u/s
- <trigger/field>: Excel <cell>; ours <present/absent>.
### ITR-2 bleed / notes
- <finding>
### Verdict: <SOLID | MINOR GAPS | MAJOR GAPS>  — one line.
```

End the file with a `## GROUP SUMMARY` block: counts of missing fields, missing cascades, missing dropdown
values, regime mismatches, audit gaps, and the 3 most serious items.

## Return (structured)
Return: sheets_audited (list), missing_fields (int), missing_cascades (int), regime_mismatches (int),
audit_gaps (int), top_findings (list of short strings), report_path. Do not edit any file other than your
one report under `logs/ITR-3/audit/`.
