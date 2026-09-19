# Hand case — Section `verify` (Verification / Declaration), ITR-5 A.Y. 2026-27

Sheet: **VERIFICATION** · Block: **Verification → Declaration** (single object, required).
File: `forms/ITR-5/src/70_sec_verify.js`. There is no arithmetic on this sheet
(no money cells, no totals); the only *computed* value is the system date. The
hand case therefore verifies the export shape, the date derivation, the enum
mapping and every check, to the character.

## Input (state `S.ver`, plus context)

| State key | Value |
|---|---|
| `S.ver.name` | `S SUDHIR` |
| `S.ver.father` | `RAMAN` |
| `S.ver.pan` | `aaapf1234k` (lower-case as typed) |
| `S.ver.capacity` | `PA` (display "Partner") |
| `S.ver.place` | `CHENNAI` |
| `S.pm.members[0].pan` | `AAAPF1234K` (a Partners/Members PAN — for A13) |
| System date (test run) | 18/09/2026 |

## Engine — `engVerify()`

The date is `[L9] = CONCATENATE(IF(DAY<10,"0",""),DAY,"/",...MONTH...,"/",YEAR)`
of `TODAY()`. With today = 18 Sep 2026:

- `C.dateDisp` = `18/09/2026` (dd/mm/yyyy — screen)
- `C.dateISO`  = `2026-09-18` (yyyy-mm-dd — export, per schema / VBA `yyyy-mm-dd`)
- `C.capacity` = `PA`, `C.capacityLabel` = `Partner`
- `S.C.verify.income` = 0 (Verification contributes nothing to GTI)

Capacity is `PA` (not `RA`), so the Part A-General rep flag is left untouched.

## Export — `expVerify(j)` (verified to the character)

```json
{ "Verification": { "Declaration": {
  "AssesseeVerName": "S SUDHIR",
  "FatherName": "RAMAN",
  "AssesseeVerPAN": "AAAPF1234K",   // upper-cased on export
  "Capacity": "PA",                  // two-letter enum code, never "(Select)"
  "Place": "CHENNAI",
  "Date": "2026-09-18"               // YYYY-MM-DD, system date
} } }
```

All six required leaves present, in schema order:
`AssesseeVerName, FatherName, AssesseeVerPAN, Capacity, Place, Date`.

## Checks — `chkVerify()`

- Valid input above, member PAN = `AAAPF1234K` (matches the verification PAN):
  → `[ok] Verification` (`S SUDHIR — Partner · 18/09/2026`). No errors/warnings.
- Member PAN changed to `ZZZZZ9999Z` (no match): → `[warn] Verification · PAN
  cross-check` (A13). Guarded: fires only when member PANs are present.
- Capacity set to `RA`, `S.fs.rep="N"`: engine forces `S.fs.rep="Y"`; checks then
  require the rep details → `[err] Verification · representative assessee` for the
  missing `S.fs.repName` (A5/A6).
- Empty `S.ver`: five mandatory-field errors — name, father's name, PAN, capacity,
  place (the date is the always-present system date, so it does not error).
- PAN not matching `AAAAA9999A`: `[err] Verification · PAN` (format).
- Date < 01/04/2023: `[err] Verification · date` (VBA lower bound). Not reachable
  from the system date in practice, but encoded per the rule.

## Round-trip (rule 12)

`expVerify` → `impVerify` → `engVerify` → `expVerify` produces a byte-identical
`Verification` object. The `Date` leaf is always re-derived from the system date
(the utility's behaviour — the date is `TODAY()`, not stored input), so on the
same day the two exports are identical; `impVerify` keeps the imported date for
display only.

## Coverage / notes

- Schema keys covered (all 6, verbatim): `AssesseeVerName`, `FatherName`,
  `AssesseeVerPAN`, `Capacity`, `Place`, `Date`.
- Capacity dropdown: 12 values from `enums.json Verification.Declaration.Capacity`
  (`MP, DP, PA, PO, ME, LQ, RP, TR, EX, RA, AS, OA`).
- Hidden rows: none built (sheet fully visible). The stray `[N11]=01/12/2026` and
  the static `Veri.92CD` declaration line (`C8:L8`) are not inputs and not built.
- Cross-sheet donee-PAN (80G/80GGA/RA) and TDS other-person-PAN collisions with
  the verification PAN are validated in *those* sections (they read `S.ver.pan`),
  not here.
