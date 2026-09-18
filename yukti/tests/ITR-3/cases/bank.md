# Case — Bank and verification (section id `bank`, order 95)

Built from `books/ITR-3/Verification.md` + `enums.json` (Verification.Capacity,
AccountType). This head carries no income, so `S.C.bank.income = 0` and there
are no regime (`isNew()`) closures — the screen is identical under the old and
new regimes (confirmed: nothing on it reads `isNew()`).

## Input state
```
S.pi.pan = "AAAPA1234A"
S.fs.optout = "No"  (new regime)   S.fs.rep = "N"
S.bank = [
  {ifsc:"HDFC0001234", bank:"HDFC Bank",           acno:"50100123456789", type:"SB", refund:"Y"},
  {ifsc:"SBIN0000456", bank:"State Bank of India", acno:"12345678901",     type:"CA", refund:"N"}
]
S.ver = {cap:"S", name:"RAVI KUMAR", father:"MOHAN KUMAR", pan:"AAAPA1234A",
         place:"Mumbai", date:"15/09/2026", nacc:"2"}
S.trp = {id:"TRP0012345", name:"Anil Sharma", reimb:"1500"}
```

## engBank() — line by line
- `B.income = 0`  — Verification/bank add nothing to Gross Total Income.
- `valid` = the two rows (both pass IFSC_RE + acno + bank) → `B.nAcc = 2`.
- `B.hasRefund = true` (row 1 ticked).
- `B.trpOn = true` (TRP name present).
- Result: `S.C.bank = {income:0, nAcc:2, hasRefund:true, trpOn:true}` ✓ (matches run).

## expBank(j) — expected figures
- Refund.BankAccountDtls.BankDtlsFlag = "Y" (one+ valid account).
- AddtnlBankDetails[0] = {IFSCCode:"HDFC0001234", BankName:"HDFC Bank",
  BankAccountNo:"50100123456789", AccountType:"SB", UseForRefund:"true"}.
- AddtnlBankDetails[1] UseForRefund:"false".
- Verification.Declaration.{AssesseeVerName:"RAVI KUMAR", FatherName:"MOHAN KUMAR",
  AssesseeVerPAN:"AAAPA1234A"}.
- Verification.Capacity = "S"; Place = "Mumbai".
- **Verification.Date = "2026-09-15"** — the load-bearing conversion: the on-screen
  signing date `15/09/2026` (DD/MM/YYYY) is exported via `ISO()` as `2026-09-15`
  (YYYY-MM-DD, per the book's L9 rule). ✓ matches run.
- TaxReturnPreparer = {IdentificationNoOfTRP:"TRP0012345", NameOfTRP:"Anil Sharma",
  ReImbFrmGov:1500 (integer, only emitted when > 0)}.

## chkBank() — expected
One `ok`: "Verified by RAVI KUMAR in the capacity of Self; every check passes."
(no err/warn: both accounts valid, one ticked for refund, PAN AAAPA1234A is a
valid P-series PAN equal to S.pi.pan, place+date present, TRP id+name present.) ✓

## Round-trip (impBank)
Reads back ["bank accounts","verification","tax return preparer"]; Date restored
to "15/09/2026", ReImbFrmGov back to 1500. State reconstructed identically. ✓

## Rule spot-checks (from the book)
- Set `S.ver.cap="R"` with `S.fs.rep="N"` → err "Representative assessee" (rules.json #45)
  plus a warn on the uploader PAN (#40). Confirmed by reading the code path.
- Verification PAN equal to a donee PAN in `S.g80`/`S.gga` → err (#60/#3275).
