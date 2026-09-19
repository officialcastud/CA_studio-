# Hand-traced case — section `who` (Who is filing · Part A - General)

Section `who` is the identity/eligibility face of Part A - General. It carries **no
income**, so its only arithmetic contribution to the return is the GTI roll-up value
`S.C.who.income`, which must be **0** (a signed integer), plus a faithful
schema serialisation of blocks `PartA_GEN1` and `PartA_GEN2`. The two things worth
hand-checking are therefore (a) the GTI contribution and (b) the export/round-trip,
verified to the field.

## Case 1 — resident individual, NEW regime (isNew() true, S.fs.optout="No")

Input (identity face only; filing/audit come from shared state the `ret` screen fills):

| Field | Value |
|---|---|
| Status | I (individual) |
| Name | ARJUN · MEHTA |
| PAN | abcpm1234k |
| Date of birth | 14/08/1988 |
| Address | 12 Nirvana, Andheri, Mumbai, State 19 (Maharashtra), PIN 400053, Country 91 (India) |
| Secondary same as primary? | Y |
| Email / mobile | arjun@example.in / 9876543210 |
| Aadhaar | 123412341234 |
| Nature of business | code 09028 |

### GTI contribution (the figure verified to the rupee)
`engWho()` sets `S.C.who = { income:0, ind:true }`.

- Part A - General is identity/eligibility only; no head of income is computed here.
- **Expected `S.C.who.income` = 0.**  Traced through `engWho`: `C.income = 0` (no
  branch adds to it). The tax section rolls up `Σ S.C.<head>.income`, so `who`
  adds **₹0** — matches to the rupee.

### Export checks (`expWho`)
- `PersonalInfo.PAN = "ABCPM1234K"` — upper-cased.
- `PersonalInfo.DOB = "1988-08-14"` — DD/MM/YYYY → ISO.
- `Address.StateCode = "19"`, `Address.CountryCode = "91"`, `Address.PinCode = 400053` (integer).
- `Address.CountryCodeMobile = 91`, `Address.MobileNo = 9876543210`.
- `SecondaryAdd = "Y"`, and **no** `AlternateAddress` object (secondary = primary).
- `PersonalInfo.AadhaarCardNo = "123412341234"`.
- `FilingStatus.OptOldRegimeCurrAY = "N"` — the new regime (isNew() true).
- `NatOfBus.NatureOfBusiness[0].Code = "09028"` (a real JSON array).

### Checks (`chkWho`)
- 0 errors; the summary row: *"Individual · ABCPM1234K · born/formed 14-Aug-1988."*

## Case 2 — REGIME both ways
With `S.fs.optout="Yes"` (OLD regime, isNew() false) the same state exports
`FilingStatus.OptOldRegimeCurrAY = "Y"`. No `PersonalInfo` item opens or closes on
the regime (REGIME.md lists none for Part A - General), so the identity face and
`S.C.who.income` (=0) are unchanged in both regimes. Confirmed both ways.

## Case 3 — round-trip identity (constitution rule 12)
A full state exercising every repeating table (directors, partners, unlisted shares,
clause-(iv), other-Act audits, other IT-Act audits, nature-of-business), the
secondary address, the seventh-proviso amounts, and a business filer opting out via
Form 10-IEA was exported, re-imported into a fresh state, and re-exported.

**`JSON.stringify(export2) === JSON.stringify(export1)` → true** (byte-identical).
Every repeating table serialises as a real JSON array (verified `Array.isArray`
true for all seven), so `impWho`'s `Array.isArray` re-read restores them exactly.

## Notes
- `who` renders `PartA_GEN1.PersonalInfo` (the "Who is filing" screen). The sibling
  `ret` screen (order 6) renders `FilingStatus` + `PartA_GEN2` into the same shared
  state (`S.pi`/`S.fs`/`S.decl`/`S.aud`/`S.nob`); per this builder's dispatch, `who`
  is the assigned owner of the full `PartA_GEN1`+`PartA_GEN2` export/import.
- Verified with a stub harness of the shell helpers (R, sv, ISO, put, D, PAN_RE …);
  `node --check` clean.
