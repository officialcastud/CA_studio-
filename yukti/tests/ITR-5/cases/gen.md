# Hand-traced case — section `gen` (Part A - General & General(2))

Section `gen` is the identity + filing-status + audit face of ITR-5. It carries
**no income**, so its only contribution to the return is the GTI roll-up value
`S.C.gen.income`, which must be **0** (a signed integer), plus a faithful schema
serialisation of blocks `PartA_GEN1` and `PartA_GEN2` (audit half + partners/
members/trust + nature of business). The three things worth hand-checking are
therefore (a) the GTI contribution, (b) the two computed helper figures the
sheet's DB columns define — the member **share total** (V3/X4) and the
**all-members-are-companies** flag (AA15) — and (c) the export/round-trip to the
field.

## Case 1 — an LLP firm, NEW regime, liable to audit u/s 44AB

Input (the fields that drive the arithmetic and the switches):

| Field | Value |
|---|---|
| Status / sub-status | `1` Firm / `2-LLP (Limited Liability Partnership)` |
| Name / PAN | SUDHIR TRADERS LLP / `aabfs1234k` |
| Date of formation | 05/11/2006 |
| Address | 12 Nehru Rd, Andheri, Mumbai, State 19, PIN 400053, Country 91 |
| Email / mobile | firm@example.in / 9876543210 |
| Regime (OptOldRegimeCurrAY) | No → **new regime**, `OptOldRegimeCurrAY="N"` |
| Due date | 2026-10-31 (31/10/2026, audit case) |
| MSME | Yes, UDYAM-MH-01-0001234 |
| Partner in a firm? | Yes → 1 firm row: ABC & Co, `aaafa1111a` |
| 44AA / 44AB / 92E | Y / (a2 IncDclrdUs=N, band Upto10CR, both cash ≤5%) audit **Y** cond `bi`, audited by accountant Y (report 15/09/2026, ack 123456789012345, XYZ Associates, PAN `aacfx9999z`) / 92E N |
| Other IT-Act audit | 80-IA, furnished Y, 10/09/2026, ack 111122223333444 |
| Members (Table E) | Sudhir S — IND_WORKING, share **60**, ROI 12, remun 5,00,000 · Meera R — INDIVIDUAL, share **40**, ROI 12, remun 4,00,000 |
| B / D | No foreign-company member / no member's income exceeds exemption |
| Nature of business | 09028 (Retail sale of other products n.e.c.) |

### GTI contribution (verified to the rupee)
`engGen()` sets `S.C.gen = { income:0, isFirm:true, allCompanies:"N", shareTotal:…, foreignShare:0 }`.
- Part A - General carries no head of income → **`S.C.gen.income` = 0**. The tax
  section rolls up `Σ S.C.<head>.income`, so `gen` adds **₹0** — matches.

### Member share total (V3 / X4, verified by hand)
The DB helper `V3 = MAX(0, SUM(SharePercentage) − retired-individual share)`,
where the retired-individual share is subtracted only for a Firm (`X4`, MID(MainStatus,1,1)="1").
Here no member is `IND_RETIRED`, so:
- `SUM(share) = 60 + 40 = 100`; retired-individual share `= 0`.
- **`shareTotal = MAX(0, 100 − 0) = 100`.** Rule **A21** (existing partners'
  share must equal 100) is satisfied → no warning.

### All-members-are-companies flag (AA15, verified by hand)
`AA15 = IF(count(company members)=count(members),"Y","N")`. Members = 2, of which
companies (`DOMESTIC_COMPANY`/`FOREIGN_COMPANY`) = 0. **`allCompanies="N"`** — the
AMT-surcharge-15%-override on the AMT screen does not fire.

### Export checks (`expGen`)
- `PartA_GEN1.OrgFirmInfo.StatusOrCompanyType = "1"`, `SubStatus = "2-LLP (Limited Liability Partnership)"`.
- `OrgFirmInfo.PAN = "AABFS1234K"`, `DateOFFormOrIncorp = "2006-11-05"` (DD/MM/YYYY → ISO).
- `FilingStatus.OptOldRegimeCurrAY = "N"` (new regime, `isNew()` true).
- `FilingStatus.ItrFilingDueDate = "2026-10-31"`, `ifMSME = "Y"`, `RegNumMSMEDAct2006 = "UDYAM-MH-01-0001234"`.
- `FilingStatus.PartnerInFirm.PartnerInFirmDtls = [{"NameOfFirm":"ABC & Co","PAN":"AAAFA1111A"}]` (a real JSON array).
- `PartA_GEN2.LiableSec44AAflg="Y"`, `IncDclrdUs="N"`, `TotalSalesExcOneCr="Upto10CR"`,
  `AgrOFAllAmtsRcvd="Upto5Per"`, `AgrOFAllPayMade="Upto5Per"`, `LiableSec44ABflg="Y"`, `Cndnfor44AB="bi"`.
- `PartA_GEN2.AuditInfo = {AuditReportFurnishDate:"2026-09-15", AckNum44AB:123456789012345, AudFrmName:"XYZ Associates", AudFrmPAN:"AACFX9999Z"}` and `AuditedByAccountantFlg="Y"`.
- `PartA_GEN2.AuditDetails = [{AuditedSection:"80-IA", AuditFlag:"Y", DateOfAudit:"2026-09-10", AckNumOth:111122223333444}]`.
- `PartA_GEN2.PartnerOrMemberInfo[0]` carries the address object plus the head fields
  `PartnerForeignCompFlg:"NO"` and `TotIncFrmMemberOfAop:"N"` (questions B/D ride on row 0, book §2 of GEN2).
- `PartA_GEN2.NatOfBus.NatureOfBusiness = [{Code:"09028", TradeName1:"Retail", Description:"General trade"}]`.

### Checks (`chkGen`)
- 0 errors. One warning fires by design: *"Balance sheet & P&L required"* (A1/A2/A13 —
  liable to audit u/s 44AA/44AB). Summary row:
  *"Firm · AABFS1234K · new regime · due 31/10/2026."*

### Round-trip (constitution rule 12)
`expGen → impGen → expGen` was run in isolation and the two JSON serialisations are
**byte-identical** (verified: `ROUND-TRIP identical: true`).

## Case 2 — the V3 subtraction for a retired individual partner (A21 edge)

Firm (`Status=1`) with three members: two working partners (share 60 and 40) and
one **retired individual** partner (`IND_RETIRED`, share 15).
- `SUM(share) = 60 + 40 + 15 = 115`.
- Retired-individual share (subtracted because Status = Firm) `= 15`.
- **`shareTotal = MAX(0, 115 − 15) = 100`** → A21 satisfied (the retiring partner's
  share is excluded from the "existing partners = 100%" test).
If instead the two working shares were 60 and 30 (total existing = 90), `shareTotal`
= 90 and `chkGen` raises the A21 warning *"Total share not 100%… Current: 90%."*

## Case 3 — foreign-company member (B ⇒ C, rule A33)

Question B = `YES` (a member is a foreign company) with C (percentage of share)
left blank. `chkGen` raises the error *"Foreign-company share required"* (A33: if
B is Yes, C cannot be zero). Setting C = 30 clears it, and `W3` (sum of the share
of `FOREIGN_COMPANY` members) is available on `S.C.gen.foreignShare` for the
B/C-consistency cross-check.
