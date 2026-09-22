# PART A - GENERAL(2) — ITR-5 (books/ITR-5/PART_A_GENERAL_2.md)

Sheet: **PART A - GENERAL(2)** (utility file `sheet3.xml`). Section: `gen` (section_map.json).
Schema block carried: **PartA_GEN2** (the only block section_map assigns to this sheet).
Every quotation below is taken from `tools/dump.py` output against this sheet, from
`sources/ITR-5/ITR-5_2026_Main_V1_1_schema.json`, from `sources/ITR-5/vba_text.txt`, or from
`books/ITR-5/rules.json` — never from memory.

## The shape

This sheet holds the **partners / members / trust information** half of `PartA_GEN2`. It is five
things stacked one under another:

1. **Table A** (rows 3–6) — change of partners/members during the previous year. Cell `D3` is a
   CONCATENATE that reads *"Partner's or Member's or Trust Information … A. Whether there was any
   change during the previous year in the partners/members of the firm/AOP/BOI … (In case of
   societies and cooperative banks give details of Managing Committee) If Yes, provide the details
   in respect …"*. `K3` is the Yes/No flag; rows 5–6 are the admitted/retired detail rows. Maps to
   `PrevYrMemPartChange` + `PrevYrMemPart.PrevYrMemPartDtls[]`.
2. **Questions B, C, D** (rows 8–10) under the banner `C8` *"PARTNERS/ MEMBERS/TRUST INFORMATION"* —
   B: is any member a foreign company; C: percentage of share of that foreign company; D: whether
   any member's total income exceeds the basic exemption. Maps to the three head fields of
   `PartnerOrMemberInfo[]` (`PartnerForeignCompFlg`, `PercentageOfShareForeignComp`,
   `TotIncFrmMemberOfAop`).
3. **Table E** (rows 11–25) — *"Particulars of persons who were partners/ members in the firm/AOP/BOI
   or settlor/trustee/beneficiary in the trust or executors …"*. The main partner/member grid, up to
   11 built rows (15–25). Maps to `PartnerOrMemberInfo[]`.
4. **Section F** (rows 27–35) — *"For persons referred to in section 160(1)(iii) or (iv)"*, the private
   discretionary trust questionnaire. Maps to `PvtDiscretioneryTrust`.
5. **Nature of business** (rows 37–43) — up to 5 code/trade-name/description rows. Maps to
   `NatOfBus.NatureOfBusiness[]`.

`PartA_GEN2`'s **audit half** — `LiableSec44AAflg`, `IncDclrdUs`, `LiableSec44ABflg`,
`LiableSec92Eflg`, `AuditInfo`, `AuditDetails92E`, `AuditDetails[]`, `AuditReportDetails[]`,
`BiiDetails`, `AccountAuditFlag`, `AuditedByAccountantFlg`, `Cndnfor44AB`, `TotalSalesExcOneCr`,
`AgrOFAllAmtsRcvd`, `AgrOFAllPayMade` — is **not on this sheet**. Those fields are physically entered
on the **"PART A - GENERAL"** sheet under its *"AUDIT INFORMATION"* banner (rows 138–174 of
`sheet2.xml`: *"a1 Whether liable to maintain accounts as per section 44AA?"*, *"a2 Whether assessee
is declaring income only under section 44AD/44ADA/44AE/44B/44BB/44BBC/44BBD?"*, *"b Whether liable
for audit under section 44AB?"*, *"di Are you liable for Audit u/s 92E?"* …). They are listed in
**Mandatory** and **The items** below only because `section_map.json` assigns the whole `PartA_GEN2`
block to *this* sheet, and the Gate 3 coverage walk requires every required leaf of a claimed block
to be named in this book. The section-builder must take those keys from the "PART A - GENERAL"
sheet's UI, not from this sheet.

Alongside the visible grid this sheet carries **hidden helper columns** (Excel columns O, V, W, X,
Y, Z, AA are marked `hidden="1"`) that hold cross-check formulas (share totals, foreign-company
share, all-members-are-companies flag). These are computations, not user fields — see **The rules**.
**No rows on this sheet are hidden** (`hidden="1"` on `<row>` — none).

## The items

### Table A — change of partners/members during the year (rows 3–6)

Maps to `PrevYrMemPartChange` (the Yes/No) and, when Yes, `PrevYrMemPart.PrevYrMemPartDtls[]` (rows).

| Cell / Sl.No. | Field label (verbatim) | Type | Schema key | Rule / notes |
|---|---|---|---|---|
| D3 | "Partner's or Member's or Trust Information … A. Whether there was any change during the previous year in the partners/members of the firm/AOP/BOI … (In case of societies and cooperative banks give details of Managing Committee) If Yes, provide the details in respect …" | banner + question (CONCATENATE formula) | — (label of `PrevYrMemPartChange`) | in case of societies and cooperative banks give details of Managing Committee |
| K3 | (the Yes/No answer to A) | list dropdown (Select)/Y/N | **`PrevYrMemPartChange`** (enum N, Y) | **required**; if Yes → Table A rows must be filled (rule A76) |
| D4 | "Sl. No." | column header | array index of `PrevYrMemPartDtls[]` | `D5`=1 static, `D6`= `D5+1` |
| E4 | "Name of the Partner/member" | column header / free text | `PrevYrMemPart.PrevYrMemPartDtls[].PartnerName` | **required**; maxLength 125 |
| F4 | "Admitted/Retired" | column header / dropdown | `PrevYrMemPart.PrevYrMemPartDtls[].AdmRet` | **required**; enum ADM, RET; dropdown F5:F6 = (Select)/Admitted/Retired |
| G4 | "PAN" | column header / free text | `PrevYrMemPart.PrevYrMemPartDtls[].PAN` | **required**; maxLength 10 (G5:G6) |
| H4 | "Date of admission/ retirement (dd/mm/yyyy)" | column header / date | `PrevYrMemPart.PrevYrMemPartDtls[].AdmRetDate` | **required**; date YYYY-MM-DD |
| I4 | "Remuneration paid / payable in case of retiring partner (in the case of a firm)" | column header / amount | `PrevYrMemPart.PrevYrMemPartDtls[].RemunerationpaidAmt` | **required**; integer, min 0, max 99999999999999 |
| J4 | "Percentage of share (if determinate)" | column header / number | `PrevYrMemPart.PrevYrMemPartDtls[].SharePercentage` | **required**; number, min 0, max 100 (J5/J6 step 0.01) |
| Sl.No. 1 (row 5) | E5 name · F5 Admitted/Retired · G5 PAN · H5 date · I5 remuneration · J5 % share | data entry row 1 | `PrevYrMemPartDtls[0]` | `D5`=1; F5 default "(Select)" |
| Sl.No. 2 (row 6) | E6 · F6 · G6 · H6 · I6 · J6 | data entry row 2 | `PrevYrMemPartDtls[1]` | `D6`= `D5+1` |
| V4 | "Newly added by Riyaz for SIT-127312" | developer annotation (hidden col V) | — | not a user field |

### Questions B, C, D (rows 8–10)

| Cell | Field label (verbatim) | Type | Schema key | Rule / notes |
|---|---|---|---|---|
| C8 | "PARTNERS/ MEMBERS/TRUST INFORMATION" | section banner (static) | — (table title) | banner over rows 8–25 |
| D8 | "B. Is any member of the AOP/BOI / executor of AJP a foreign company?" | question | `PartnerOrMemberInfo[].PartnerForeignCompFlg` | enum YES, NO; K8 dropdown (Select)/Yes/No; VBA: *"BOI must be YES if Percentage of share of the Foreign Company"* |
| K8 | (Yes/No answer to B) | list dropdown (Select)/Yes/No | `PartnerOrMemberInfo[].PartnerForeignCompFlg` | see D8 |
| D9 | "C. If Yes, mention the percentage of share of the foreign company in the AOP/BOI or executor of AJP." | question / number | `PartnerOrMemberInfo[].PercentageOfShareForeignComp` | number, min 0, max 100; K9 input (maxLength 0-guard); rule A33: if B is Yes then Sl.No. C cannot be Zero; VBA: *"BOI Foreign Share Percentage MUST match Foreign Share of Status Code Foreign Company"* (checked against `W3`) |
| K9 | (percentage answer to C) | number input | `PartnerOrMemberInfo[].PercentageOfShareForeignComp` | see D9 |
| D10 | "D. Whether total income of any member of the AOP/BOI or executor of AJP (excluding his share from such association or body or Executor of AJP) exceeds the maximum amount which is not chargeable to tax in the case of that member?" | question | `PartnerOrMemberInfo[].TotIncFrmMemberOfAop` | K10 dropdown (Select)/Y/N |
| K10 | (Y/N answer to D) | list dropdown (Select)/Y/N | `PartnerOrMemberInfo[].TotIncFrmMemberOfAop` | see D10 |

### Table E — particulars of partners/members/trust persons (rows 11–25)

Maps to `PartnerOrMemberInfo[]` (the array proper — one row per partner/member/settlor/trustee/
beneficiary/executor). Built rows 15–25 (11 rows). Column headers row 12; address sub-headers row 13;
column numbering (1)–(9) row 14.

| Cell | Field label (verbatim) | Type | Schema key | Rule / notes |
|---|---|---|---|---|
| D11 | "E. Particulars of persons who were partners/ members in the firm/AOP/BOI or settlor/trustee/beneficiary in the trust or executors in the case of estate of deceased / estate of insolvent as on 31st day of March, 2026 or date of dissolution" | section header (static) | — (header of `PartnerOrMemberInfo[]`) | as on 31 March 2026 or date of dissolution |
| D12 | "Sl.No." | column header | array index of `PartnerOrMemberInfo[]` | `D16`= `D15+1`, `D17`= `D16+1` |
| E12 | "Name and address" | column group header | — | expands to E13–K13 below |
| E13 | "Name" | sub-header / free text (E15:E25) | `PartnerOrMemberInfo[].PartnerOrMemberName` | **required**; maxLength 125; VBA: *"Please enter the name of partner"* |
| F13 | "Address" | sub-header / free text (F15:F25) | `PartnerOrMemberInfo[].AddressDetailWithZipCode.AddrDetail` | **required**; maxLength 200 |
| G13 | "City" | sub-header / free text (G15:G25) | `PartnerOrMemberInfo[].AddressDetailWithZipCode.CityOrTownOrDistrict` | **required**; maxLength 50 |
| H13 | "State" | sub-header / dropdown (H15:H25) | `PartnerOrMemberInfo[].AddressDetailWithZipCode.StateCode` | **required**; enum of 38 state codes (dropdown `State`) |
| I13 | "Country" | sub-header / dropdown (I15:I25) | `PartnerOrMemberInfo[].AddressDetailWithZipCode.CountryCode` | **required**; enum of 250 country codes (dropdown `Country`) |
| J13 | "Pin Code" | sub-header / number (J15:J25) | `PartnerOrMemberInfo[].AddressDetailWithZipCode.PinCode` | integer, min 100000, max 999999 |
| K13 | "Zip Code" | sub-header / free text (K15:K25) | `PartnerOrMemberInfo[].AddressDetailWithZipCode.ZipCode` | maxLength 8 |
| L12 | "Percentage of share (if determinate)" | column header / number (L15:L25) | `PartnerOrMemberInfo[].SharePercentage` | **required**; number, min 0, max 100 |
| M12 | "PAN" | column header / free text (M15:M25) | `PartnerOrMemberInfo[].PAN` | maxLength 10; rule A(12): PAN at Verification should match a PAN entered here |
| N12 | "Aadhaar Number" | column header / free text (N15:N25) | `PartnerOrMemberInfo[].AadhaarCardNo` | maxLength 12; VBA: *"Please enter the valid Aadhaar number in point E of Part A general 2"* |
| O12 | "Aadhaar Enrolment Id (if eligible for Aadhaar)" | column header (**hidden column O**) | — (**no schema leaf** under `PartnerOrMemberInfo`; not exported) | VBA field `PMInfo.AadhaarEnrolmentID`, message *"Please enter the valid Aadhaar Enrolment Id in point E of Part A general 2."* — column is hidden and has no schema key, so **not built** (see Hidden rows/columns) |
| P12 | "Designated Partner Identification No in case Partner in LLP" | column header / free text (P15:P25) | `PartnerOrMemberInfo[].LLPIdentificationNo` | maxLength 8; VBA: *"Invalid Limited Liability Partnership Identification Number"* |
| Q12 | "Status (see instruction)" | column header / dropdown (Q15:Q25) | `PartnerOrMemberInfo[].Status` | **required**; enum of 18 codes (dropdown `PARTNER_STATUS`) — see Dropdowns for the code↔display map |
| R12 | "Rate of Interest on Capital" | column header / number (R15:R25) | `PartnerOrMemberInfo[].RateOfInterest` | **required**; number, min 0, max 100; VBA: *"Rate of Interest on capital at Sr. No …, in Sheet PART A - GENERAL(2) is mandatory"* |
| S12 | "Remuneration paid/ payable" | column header / amount (S15:T25) | `PartnerOrMemberInfo[].RemunerationPaid` | **required**; integer, min 0, max 99999999999999; VBA: *"Please enter Remuneration paid"* |

### Section F — private discretionary trust, s.160(1)(iii)/(iv) (rows 27–35)

Maps to `PvtDiscretioneryTrust`. Answers are M-column dropdowns (M27 label *"Select Yes/No"*; data
cells M28:M30 and M32:M35, each (Select)/Y/N).

| Cell | Field label (verbatim) | Type | Schema key | Rule / notes |
|---|---|---|---|---|
| C27 | "For persons referred to in section 160(1)(iii) or (iv)" | section banner | — | banner over rows 27–35 |
| E27 | "To be filled in case of persons referred to in section 160(1)(iii) or (iv)" | instruction (static) | — | scope note |
| M27 | "Select Yes/No" | column header (static) | — | header over the M-column answers |
| E28 / M28 | "Whether shares of the beneficiary are determinate or known?" | question / dropdown (Select)/Y/N | **`PvtDiscretioneryTrust.PvtDiscTrustShareFlg`** | **required** |
| E29 / M29 | "Whether the person referred in section 160(1)(iv) has Business Income?" | question / dropdown (Select)/Y/N | **`PvtDiscretioneryTrust.PvtDiscTrustBusIncFlg`** | **required** |
| E30 / M30 | "Whether the person referred in section 160(1)(iv) is declared by a Will and /or is exclusively for the benefit of any dependent relative of the settlor and/or is the only trust declared by the settlor?" | question / dropdown (Select)/Y/N | `PvtDiscretioneryTrust.PvtDiscTrustWillFlg` | optional |
| E31 | "please furnish the following details (as applicable):" | instruction (static) | — | intro to (i)–(iv) |
| E32 (i) / F32 / M32 | "Whether all the beneficiaries has income below basic exemption limit?" | question / dropdown (Select)/Y/N | `PvtDiscretioneryTrust.PvtDiscTrustBasicFlg` | optional |
| E33 (ii) / F33 / M33 | "Whether the relevant income or any part thereof is receivable under a trust declared by any person by will and such trust is the only trust so declared by him?" | question / dropdown (Select)/Y/N | `PvtDiscretioneryTrust.PvtDiscTrustReceivableFlg` | optional |
| E34 (iii) / F34 / M34 | "Whether the trust is non-testamentary trust created before 01-03-1970 for the exclusive benefit of relatives/member of HUF of the settlor mainly dependent on him/Family?" | question / dropdown (Select)/Y/N | `PvtDiscretioneryTrust.PvtDiscTrustRelativesFlg` | optional |
| E35 (iv) / F35 / M35 | "Whether the trust is created on behalf of a provident fund, superannuation fund, gratuity fund, pension fund or any other fund created bona fide by a person carrying on Business or profession exclusive for the employees in such Business or Profession?" | question / dropdown (Select)/Y/N | `PvtDiscretioneryTrust.PvtDiscTrustBusProfFlg` | optional |

### Nature of business (rows 37–43)

Maps to `NatOfBus.NatureOfBusiness[]` (up to 5 built rows, 39–43).

| Cell | Field label (verbatim) | Type | Schema key | Rule / notes |
|---|---|---|---|---|
| D37 | "Nature of business/profession, if more than one business or profession indicate the three main activities/ products (OTHER THAN THOSE DECLARING INCOME UNDER 44AD, 44ADA AND 44AE) ." | instruction (static) | — (header of `NatOfBus.NatureOfBusiness[]`) | scopes the grid to businesses other than those under 44AD/44ADA/44AE |
| D38 | "Sl. No." | column header | array index | — |
| E38 | "Code (Please see instructions)" | column header / dropdown (E39:E43) | `NatOfBus.NatureOfBusiness[].Code` | **required**; enum of 371 codes (dropdown `NOBCode`); rule A(11): disclosure of "Nature of business or profession" is mandatory |
| F38 | "Trade name of business, if any" | column header / free text (F39:F43) | `NatOfBus.NatureOfBusiness[].TradeName1` | optional; maxLength 125 |
| G38 | "Description" | column header / free text (G39:G43) | `NatOfBus.NatureOfBusiness[].Description` | optional; maxLength 125 |

### PartA_GEN2 audit half — NOT on this sheet (entered on "PART A - GENERAL")

Listed only for block coverage; take these from the "PART A - GENERAL" sheet's *"AUDIT INFORMATION"*
block (`sheet2.xml` rows 138–174), not from this sheet.

| Schema key | "PART A - GENERAL" label (verbatim, from sheet2) | Rule / notes |
|---|---|---|
| **`LiableSec44AAflg`** | "a1 Whether liable to maintain accounts as per section 44AA?" | **required**; enum N, Y |
| **`IncDclrdUs`** | "a2 Whether assessee is declaring income only under section 44AD/44ADA/44AE/44B/44BB/44BBA/44BBC/44BBD?" | **required** (string) |
| `TotalSalesExcOneCr` | (44AA follow-up) | enum Upto1CR, Upto10CR, MoreThan10CR |
| `AgrOFAllAmtsRcvd` | (aggregate of all amounts received) | enum Upto5Per, MoreThan5Per |
| `AgrOFAllPayMade` | (aggregate of all payments made) | enum Upto5Per, MoreThan5Per |
| **`LiableSec44ABflg`** | "b Whether liable for audit under section 44AB?" | **required**; enum N, Y |
| `Cndnfor44AB` | (condition for 44AB) | enum bi, bii, biii |
| `BiiDetails.44AD` / `.44ADA` / `.44AE` / `.44BB` | (section-wise turnover under condition bii) | strings |
| `AuditedByAccountantFlg` | "c If (b) is Yes, whether the accounts have been audited by an accountant?" | string |
| `AuditInfo.AuditReportFurnishDate` | "i Date of furnishing of the audit report (DD/MM/YYYY)" | date YYYY-MM-DD |
| `AuditInfo.AudFrmName` | "iii Name of the auditor (proprietorship/ firm)" | maxLength 125 |
| **`AuditInfo.AudFrmPAN`** | "iv Permanent Account Number (PAN) of the auditor (proprietorship/ firm)" | **required**; Firm's or Proprietor's PAN |
| `AuditInfo.AudFrmAadhaar` | "Aadhaar Number of the auditor (proprietorship)" | string |
| `AuditInfo.AckNum44AB` | "ii Acknowledgement number of the audit report" | integer, maxLength 15 |
| **`LiableSec92Eflg`** | "di Are you liable for Audit u/s 92E?" | **required**; enum N, Y (rule A(11): 92E → file Form 3CEB) |
| **`AuditDetails92E.DateOfAudit`** | "Date of furnishing audit report? DD/MM/YYYY" | **required**; date |
| **`AuditDetails92E.AckNum92E`** | (92E acknowledgement number) | **required**; integer, maxLength 15 |
| `AccountAuditFlag` | "(dii)a If (di) is Yes, whether the accounts have been audited u/s. 92E?" | enum N, Y |
| `AuditDetails[]` | "diii If liable to furnish other audit report … mention section code" (row 165 grid) | array |
| **`AuditDetails[].AuditedSection`** | "Section Code" | **required**; enum 10A, 10AA, 10(4D), 10(23FF), 44DA, 50B, 80-IA, 80-IAB, 80-IAC, 80-IB, 80-ID, 80-IE, 115VW … (15) |
| **`AuditDetails[].AuditFlag`** | "Whether have you furnished such other audit report?" | **required**; enum N, Y |
| `AuditDetails[].DateOfAudit` | "Date (dd/mm/yyyy)" | date |
| `AuditDetails[].AckNumOth` | "Acknowledgement number" | integer, maxLength 15 |
| `AuditReportDetails[]` | "(e) If liable to audit under any Act other than the Income-tax Act …" (row 174 grid) | array |
| **`AuditReportDetails[].AuditReportAct`** | "Act" | **required**; enum 1..13 (18 values) |
| `AuditReportDetails[].AuditReportActOthers` | (Act — Others) | maxLength 50 |
| **`AuditReportDetails[].AuditReportSection`** | "Section" | **required**; maxLength 30 |
| **`AuditReportDetails[].OtherITActFlag`** | "Have you got audited under the selected Act other than the Income-tax Act?" | **required**; enum N, Y |
| `AuditReportDetails[].AuditReportDate` | "Date" | date |

## The rules the sheet computes

Sl.No. auto-increment (UI only, not schema fields):
- `D6`= `D5+1` — Table A row 2 Sl.No. = row 1 + 1.
- `D16`= `D15+1`, `D17`= `D16+1` — Table E row Sl.No. increments.

Cross-check helper columns (hidden columns V, W, X, Y, Z, AA — computations, not user fields):
- `V3`= `MAX(0,SUM(PMInfo.SharePercentage)-PARTNERSHARE_IND_RETIRED)` — total share of Table E
  members less the retired-partner share. Ties to the "total share must equal 100" check (rule A21;
  VBA *"Please ensure that total share of percentage for existing partners must be equal to 100"*).
- `V5`= `IF(PARTNERSHARE<100,TRUE,FALSE)` — TRUE while the total share is under 100.
- `W3`= `SUMIF(PMInfo.StatusCode,"=FOREIGN_COMPANY",PMInfo.SharePercentage)` — sum of the share of
  all members whose Status is FOREIGN_COMPANY; VBA compares this against question C (`PercentageOf
  ShareForeignComp`): *"BOI Foreign Share Percentage MUST match Foreign Share of Status Code Foreign
  Company"*.
- `X3`= `IF(ISNA(MATCH(MID(sheet1.MainStatus,1,1),{"1","3"},0)),FALSE,IF(ISNA(MATCH(MID(sheet1.Main
  Status,1,1),{"3"},0)),TRUE,IF(ISNA(MATCH(MID(sheet1.SubStatus,1,1),{"1","2","3","4","5","6","7"},0)),
  FALSE,TRUE)))` — whether this sheet's partner grid applies, from the filer's Main/Sub status on the
  "PART A - GENERAL" sheet (`sheet1.MainStatus`, `sheet1.SubStatus`).
- `X4`= `IF(MID(sheet1.MainStatus,1,1)="1",SUMIF(PMInfo.StatusCode,"=INDIVIDUAL_RETIRED_PARTNER",
  PMInfo.SharePercentage),0)` — retired-individual-partner share, used by `V3`.
- `W15`= `SUMIF(PMInfo.AdmitRetr,"RETIRED",PMInfo.Remuneration)` — remuneration to retired members.
- `Y15`= `SUM(COUNTIF(PMInfo.StatusCode,{"DOMESTIC_COMPANY","FOREIGN_COMPANY"}))` — count of members
  that are companies.
- `Z15`= `COUNTA(PMInfo.PartnerOrMemberName)` — count of members entered.
- `AA15`= `IF(Y15=Z15,"Y","N")` — "Y" when **every** member is a company. Per the row-14 developer
  note *"When all entries are Domestic/foreign company - AMT surcharge will be 15% irrespective of
  other conditions"* (col Y14, added by Bindu, IPIP-80585), this flag drives the AMT surcharge rate.
- `W16`= `SUM(PMInfo.Rem)`; `W17`= `SUM(PMInfo.Remuneration)`; `W18`= `MMRCheck+RemunerationPaidTotal`
  — remuneration totals fed to Part A P&L consistency checks (rule A166 references *"Remuneration
  paid / payable in case of retiring partner) of point A of Part A General-2"*).

Validator messages from `sources/ITR-5/vba_text.txt` (compiled VBA string dump — only the literal
strings could be quoted, not the full trigger logic; said so rather than guessed):
- *"Please enter the name of partner"* — Table E name (E15:E25).
- *"Please enter Remuneration paid"* — S column; a variant fires on Admitted/Retired rows.
- *"Please select the option whether partner or member is admitted"* — Admitted/Retired dropdown.
- *"Please ensure that total share of percentage for existing partners must be equal to 100"* — share
  totals (rule A21).
- *"BOI Foreign Share Percentage MUST match Foreign Share of Status Code Foreign Company"* and
  *"BOI must be YES if Percentage of share of the Foreign Company"* — B/C consistency vs `W3`.
- *"Invalid Limited Liability Partnership Identification Number"* — P column (LLP DPIN).
- *"Please enter the valid Aadhaar number in point E of Part A general 2"* — N column.
- *"Please enter the valid Aadhaar Enrolment Id in point E of Part A general 2."* — O column (hidden).
- *"Rate of Interest on capital at Sr. No …, in Sheet PART A - GENERAL(2) is mandatory"* — R column.
- *"Please enter PAN of Firm in which you are Partner in a firm in point q of part A general"* — the
  "q" point is on the "PART A - GENERAL" sheet, referenced from validation, not this sheet.

Department rules from `books/ITR-5/rules.json` governing this sheet (item numbers are that file's own
`n`; note `rules.json` prepends each entry with the tail of the previous rule plus the schedule label
"Part A- General" — the rule text proper begins after that label):
- **A21**: "In Part A Gen, Table F, sl.no.1 is selected as 'Yes' then sum of 'Percentage of share (if
  determinate)' should be equal to 100" — the total-share = 100 check.
- **A33**: "If 'Yes' is selected in Sl.No. 2 'Is any member of AOP/BOI or AJP is foreign company?
  Then Sl.No. C cannot be Zero" — question B Yes → question C > 0.
- **A76**: "Details in respect of admitted / retired partners should be provided if answer to question
  'Whether there was any change during the previous year in the partners/members …'" — Table A
  mandatory when K3 = Yes.
- **A12** (PAN-match, text carried into the A13 entry): "PAN entered at 'Verification' should match
  with any PAN entered at 'PARTNERS/ MEMBERS/TRUST INFORMATION'".
- **A30 / A33** (context tails): reference "Table A in Part A general 2 is blank" and "Sl.No. B and
  Sl.No.D in Part A general 2 is blank" as blank-table checks tied to the filer's sub-status.
- **A11**: "Disclosure of 'Nature of business or profession' is mandatory in ITR" (Nature of business
  grid).

## Dropdowns

Every dropdown on the sheet with all its values (from `tools/dump.py --dropdowns`). Numeric-only
`source` entries in the dump (e.g. E5:E6 "125", H5:H6 "10", J5 "0.01") are data-validation
length/step limits, **not** value lists, and are noted in the items tables above.

- **K3, K10** — source `"(Select),Y,N"`: `(Select)`, `Y`, `N`
- **K8** — source `"(Select),Yes,No"`: `(Select)`, `Yes`, `No`
- **F5:F6** (Admitted/Retired) — source `"(Select),Admitted,Retired"`: `(Select)`, `Admitted`, `Retired`
- **M28:M30 M32:M35** — source `"(Select),Y,N"`: `(Select)`, `Y`, `N`

**Q15:Q25 — `PARTNER_STATUS`** (display value ↔ schema `Status` enum code):

| Display (dropdown) | Schema `Status` code |
|---|---|
| (Select) | — |
| INDIVIDUAL | INDIVIDUAL |
| INDIVIDUAL_WORKING_PARTNER [AS PER EXPL.4 TO SEC.40(b)] | IND_WORKING |
| INDIVIDUAL_RETIRED_PARTNER | IND_RETIRED |
| HUF | HUF |
| FIRM | FIRM |
| LLP | LLP |
| DOMESTIC_COMPANY | DOMESTIC_COMPANY |
| FOREIGN_COMPANY | FOREIGN_COMPANY |
| CO_OPERATIVE_SOCIETY | CO_OPERATIVE_SOCIETY |
| LOCAL_AUTHORITY | LOCAL_AUTHORITY |
| TRUST | TRUST |
| AOP_BOI | AOP_BOI |
| ANY_OTHER_AJP | ANY_OTHER_AJP |
| SETTLER | SETTLER |
| TRUSTEE | TRUSTEE |
| BENEFICIARY | BENEFICIARY |
| PRINCIPAL_OFFICER | PRINCIPAL_OFFICER |
| EXECUTOR | EXECUTOR |

The remaining three dropdowns are long departmental code lists; every value is reproduced verbatim
below (State = 38 codes + "(Select)"; Country = 250 codes + "(select)"; NOBCode = 371 codes +
"(Select)"). These are the same value sets as the schema enums `StateCode` (38), `CountryCode` (250)
and `NatureOfBusiness[].Code` (371).


## What repeats and what is one figure

**Arrays (repeat):**
- `PrevYrMemPart.PrevYrMemPartDtls[]` — Table A, admitted/retired detail rows (2 rows built, 5–6; utility "Add rows" extends it). One row per changed partner/member.
- `PartnerOrMemberInfo[]` — Table E, the partner/member/trust-person grid (11 rows built, 15–25). One row per person. No `maxItems` in schema.
- `PvtDiscretioneryTrust.*` — **not** an array; a single object of Y/N flags (rows 28–35), one figure each.
- `NatOfBus.NatureOfBusiness[]` — nature-of-business grid (5 rows built, 39–43). One row per activity/product. No `maxItems`.

**Single figures (one, not repeated):**
- `PrevYrMemPartChange` (K3) — one Y/N.
- Questions B / C / D — `PartnerForeignCompFlg`, `PercentageOfShareForeignComp`, `TotIncFrmMemberOfAop` — one each (schema places them as head fields of `PartnerOrMemberInfo[]`; on the sheet they are the single K8/K9/K10 answers, i.e. AOP/BOI-level, not per-row).
- Each `PvtDiscretioneryTrust` flag (`PvtDiscTrustShareFlg`, `PvtDiscTrustBusIncFlg`, `PvtDiscTrustWillFlg`, `PvtDiscTrustBasicFlg`, `PvtDiscTrustReceivableFlg`, `PvtDiscTrustRelativesFlg`, `PvtDiscTrustBusProfFlg`) — one Y/N each.

## Mandatory (from the schema `required`)

`PartA_GEN2` top-level `required`: **`LiableSec44AAflg`, `IncDclrdUs`, `LiableSec44ABflg`, `LiableSec92Eflg`, `PrevYrMemPartChange`**. Of these, only `PrevYrMemPartChange` (K3) is on this sheet; the other four are entered on "PART A - GENERAL" (audit half).

Required nested leaves relevant to this sheet's arrays/objects:
- `PrevYrMemPart.PrevYrMemPartDtls[]`: **`PartnerName`, `AdmRet`, `AdmRetDate`, `SharePercentage`, `PAN`, `RemunerationpaidAmt`** (all required per item).
- `PartnerOrMemberInfo[]`: **`PartnerOrMemberName`, `SharePercentage`, `Status`, `RateOfInterest`, `RemunerationPaid`** and address block **`AddressDetailWithZipCode.AddrDetail`, `.CityOrTownOrDistrict`, `.StateCode`, `.CountryCode`** are required; `PAN`, `AadhaarCardNo`, `LLPIdentificationNo`, `PinCode`, `ZipCode`, `PartnerForeignCompFlg`, `PercentageOfShareForeignComp`, `TotIncFrmMemberOfAop` are optional.
- `PvtDiscretioneryTrust`: **`PvtDiscTrustShareFlg`, `PvtDiscTrustBusIncFlg`** required; the other five flags optional.
- `NatOfBus.NatureOfBusiness[]`: **`Code`** required; `TradeName1`, `Description` optional.

Required leaves of the audit half (entered on "PART A - GENERAL"): `AuditInfo.AudFrmPAN`; `AuditDetails92E.DateOfAudit`, `.AckNum92E`; `AuditDetails[].AuditedSection`, `.AuditFlag`; `AuditReportDetails[].AuditReportAct`, `.AuditReportSection`, `.OtherITActFlag`.

## Hidden rows — not built

- **No hidden rows** on this sheet: no `<row hidden="1">` exists in `sheet3.xml`.
- **Hidden columns** (built as computations or not at all, never as user input):
  - Column **O** (`O12` "Aadhaar Enrolment Id (if eligible for Aadhaar)") — `hidden="1"`; has **no schema leaf** under `PartnerOrMemberInfo`. Do **not** build it as an exported field.
  - Columns **V, W, X, Y, Z, AA** (`hidden="1"`) — cross-check helper formulas (`V3`, `V5`, `W3`, `X3`, `X4`, `W15`, `Y15`, `Z15`, `AA15`, `W16`, `W17`, `W18`; see The rules). Compute these in the engine; they are not user fields. The `V4`/`Y14` texts are developer annotations.
  - Columns 28–59 and 60+ hidden — no live content for this sheet.

## What this means for the build

- Build **one** Yes/No control for K3 (`PrevYrMemPartChange`, required) and gate Table A (`PrevYrMemPartDtls[]`, 6 required fields per row) to appear only when K3 = Yes (rule A76).
- Build questions **B/C/D** as three single AOP/BOI-level controls that write to the head fields of `PartnerOrMemberInfo` (`PartnerForeignCompFlg` Yes/No, `PercentageOfShareForeignComp` number, `TotIncFrmMemberOfAop` Y/N). Enforce: B=Yes ⇒ C > 0 (A33); C must equal the sum of shares of FOREIGN_COMPANY members (`W3`, VBA check).
- Build **Table E** (`PartnerOrMemberInfo[]`) as a repeating grid: required Name, Address (AddrDetail/City/State/Country), SharePercentage, Status, RateOfInterest, RemunerationPaid; optional PAN, Aadhaar, LLP DPIN, PinCode, ZipCode. Wire the State/Country/PARTNER_STATUS dropdowns (mapping display → enum code per the Dropdowns table). Enforce total SharePercentage = 100 (A21) and the AA15 "all members are companies ⇒ AMT surcharge 15%" flag.
- Build **Section F** (`PvtDiscretioneryTrust`) as 7 Y/N flags; only `PvtDiscTrustShareFlg` and `PvtDiscTrustBusIncFlg` are required.
- Build **Nature of business** (`NatOfBus.NatureOfBusiness[]`) with the 371-code `NOBCode` dropdown (required Code), optional TradeName1/Description; disclosure mandatory (A11).
- Do **not** build the audit half here — those keys belong to the "PART A - GENERAL" sheet's UI even though `PartA_GEN2` is the schema block for this sheet.
- Do **not** build hidden column O; compute helper columns V–AA in the engine.

## Dropdowns — full value lists

### H15:H25 — `State` (38 codes)
`(Select)`, `01-Andaman and Nicobar Islands`, `02-Andhra Pradesh`, `03-Arunachal Pradesh`, `04-Assam`, `05-Bihar`, `06-Chandigarh`, `07-Dadra Nagar and Haveli`, `08-Daman and Diu`, `09-Delhi`, `10-Goa`, `11-Gujarat`, `12-Haryana`, `13-Himachal Pradesh`, `14-Jammu and Kashmir`, `15-Karnataka`, `16-Kerala`, `17-Lakshadweep`, `18-Madhya Pradesh`, `19-Maharashtra`, `20-Manipur`, `21-Meghalaya`, `22-Mizoram`, `23-Nagaland`, `24-Odisha`, `25-Puducherry`, `26-Punjab`, `27-Rajasthan`, `28-Sikkim`, `29-Tamil Nadu`, `30-Tripura`, `31-Uttar Pradesh`, `32-West Bengal`, `33-Chhattisgarh`, `34-Uttarakhand`, `35-Jharkhand`, `36-Telangana`, `37-Ladakh`, `99-Foreign`

### I15:I25 — `Country` (250 codes)
`(select)`, `93-AFGHANISTAN`, `1001-ALAND ISLANDS`, `355-ALBANIA`, `213-ALGERIA`, `684-AMERICAN SAMOA`, `376-ANDORRA`, `244-ANGOLA`, `1264-ANGUILLA`, `1010-ANTARCTICA`, `1268-ANTIGUA AND BARBUDA`, `54-ARGENTINA`, `374-ARMENIA`, `297-ARUBA`, `61-AUSTRALIA`, `43-AUSTRIA`, `994-AZERBAIJAN`, `1242-BAHAMAS`, `973-BAHRAIN`, `880-BANGLADESH`, `1246-BARBADOS`, `375-BELARUS`, `32-BELGIUM`, `501-BELIZE`, `229-BENIN`, `1441-BERMUDA`, `975-BHUTAN`, `591-BOLIVIA (PLURINATIONAL STATE OF)`, `1002-BONAIRE, SINT EUSTATIUS AND SABA`, `387-BOSNIA AND HERZEGOVINA`, `267-BOTSWANA`, `1003-BOUVET ISLAND`, `55-BRAZIL`, `1014-BRITISH INDIAN OCEAN TERRITORY`, `673-BRUNEI DARUSSALAM`, `359-BULGARIA`, `226-BURKINA FASO`, `257-BURUNDI`, `238-CABO VERDE`, `855-CAMBODIA`, `237-CAMEROON`, `1-CANADA`, `1345-CAYMAN ISLANDS`, `236-CENTRAL AFRICAN REPUBLIC`, `235-CHAD`, `56-CHILE`, `86-CHINA`, `9-CHRISTMAS ISLAND`, `672-COCOS (KEELING) ISLANDS`, `57-COLOMBIA`, `270-COMOROS`, `242-CONGO`, `243-CONGO (DEMOCRATIC REPUBLIC OF THE)`, `682-COOK ISLANDS`, `506-COSTA RICA`, `225-COTE DIVOIRE`, `385-CROATIA`, `53-CUBA`, `1015-CURACAO`, `357-CYPRUS`, `420-CZECHIA`, `45-DENMARK`, `253-DJIBOUTI`, `1767-DOMINICA`, `1809-DOMINICAN REPUBLIC`, `593-ECUADOR`, `20-EGYPT`, `503-EL SALVADOR`, `240-EQUATORIAL GUINEA`, `291-ERITREA`, `372-ESTONIA`, `251-ETHIOPIA`, `500-FALKLAND ISLANDS (MALVINAS)`, `298-FAROE ISLANDS`, `679-FIJI`, `358-FINLAND`, `33-FRANCE`, `594-FRENCH GUIANA`, `689-FRENCH POLYNESIA`, `1004-FRENCH SOUTHERN TERRITORIES`, `241-GABON`, `220-GAMBIA`, `995-GEORGIA`, `49-GERMANY`, `233-GHANA`, `350-GIBRALTAR`, `30-GREECE`, `299-GREENLAND`, `1473-GRENADA`, `590-GUADELOUPE`, `1671-GUAM`, `502-GUATEMALA`, `1481-GUERNSEY`, `224-GUINEA`, `245-GUINEA-BISSAU`, `592-GUYANA`, `509-HAITI`, `1005-HEARD ISLAND AND MCDONALD ISLANDS`, `6-HOLY SEE`, `504-HONDURAS`, `852-HONG KONG`, `36-HUNGARY`, `354-ICELAND`, `91-INDIA`, `62-INDONESIA`, `98-IRAN (ISLAMIC REPUBLIC OF)`, `964-IRAQ`, `353-IRELAND`, `1624-ISLE OF MAN`, `972-ISRAEL`, `5-ITALY`, `1876-JAMAICA`, `81-JAPAN`, `1534-JERSEY`, `962-JORDAN`, `7-KAZAKHSTAN`, `254-KENYA`, `686-KIRIBATI`, `850-KOREA (DEMOCRATIC PEOPLES REPUBLIC OF)`, `82-KOREA (REPUBLIC OF)`, `965-KUWAIT`, `996-KYRGYZSTAN`, `856-LAO PEOPLES DEMOCRATIC REPUBLIC`, `371-LATVIA`, `961-LEBANON`, `266-LESOTHO`, `231-LIBERIA`, `218-LIBYA`, `423-LIECHTENSTEIN`, `370-LITHUANIA`, `352-LUXEMBOURG`, `853-MACAO`, `389-MACEDONIA (THE FORMER YUGOSLAV REPUBLIC OF)`, `261-MADAGASCAR`, `265-MALAWI`, `60-MALAYSIA`, `960-MALDIVES`, `223-MALI`, `356-MALTA`, `692-MARSHALL ISLANDS`, `596-MARTINIQUE`, `222-MAURITANIA`, `230-MAURITIUS`, `269-MAYOTTE`, `52-MEXICO`, `691-MICRONESIA (FEDERATED STATES OF)`, `373-MOLDOVA (REPUBLIC OF)`, `377-MONACO`, `976-MONGOLIA`, `382-MONTENEGRO`, `1664-MONTSERRAT`, `212-MOROCCO`, `258-MOZAMBIQUE`, `95-MYANMAR`, `264-NAMIBIA`, `674-NAURU`, `977-NEPAL`, `31-NETHERLANDS`, `687-NEW CALEDONIA`, `64-NEW ZEALAND`, `505-NICARAGUA`, `227-NIGER`, `234-NIGERIA`, `683-NIUE`, `15-NORFOLK ISLAND`, `1670-NORTHERN MARIANA ISLANDS`, `47-NORWAY`, `968-OMAN`, `92-PAKISTAN`, `680-PALAU`, `970-PALESTINE, STATE OF`, `507-PANAMA`, `675-PAPUA NEW GUINEA`, `595-PARAGUAY`, `51-PERU`, `63-PHILIPPINES`, `1011-PITCAIRN`, `48-POLAND`, `14-PORTUGAL`, `1787-PUERTO RICO`, `974-QATAR`, `262-REUNION`, `40-ROMANIA`, `8-RUSSIAN FEDERATION`, `250-RWANDA`, `1006-SAINT BARTHELEMY`, `290-SAINT HELENA, ASCENSION AND TRISTAN DA CUNHA`, `1869-SAINT KITTS AND NEVIS`, `1758-SAINT LUCIA`, `1007-SAINT MARTIN (FRENCH PART)`, `508-SAINT PIERRE AND MIQUELON`, `1784-SAINT VINCENT AND THE GRENADINES`, `685-SAMOA`, `378-SAN MARINO`, `239-SAO TOME AND PRINCIPE`, `966-SAUDI ARABIA`, `221-SENEGAL`, `381-SERBIA`, `248-SEYCHELLES`, `232-SIERRA LEONE`, `65-SINGAPORE`, `1721-SINT MAARTEN (DUTCH PART)`, `421-SLOVAKIA`, `386-SLOVENIA`, `677-SOLOMON ISLANDS`, `252-SOMALIA`, `28-SOUTH AFRICA`, `1008-SOUTH GEORGIA AND THE SOUTH SANDWICH ISLANDS`, `211-SOUTH SUDAN`, `35-SPAIN`, `94-SRI LANKA`, `249-SUDAN`, `597-SURINAME`, `1012-SVALBARD AND JAN MAYEN`, `268-SWAZILAND`, `46-SWEDEN`, `41-SWITZERLAND`, `963-SYRIAN ARAB REPUBLIC`, `886-TAIWAN, PROVINCE OF CHINA[A]`, `992-TAJIKISTAN`, `255-TANZANIA, UNITED REPUBLIC OF`, `66-THAILAND`, `670-TIMOR-LESTE(EAST TIMOR)`, `228-TOGO`, `690-TOKELAU`, `676-TONGA`, `1868-TRINIDAD AND TOBAGO`, `216-TUNISIA`, `90-TURKEY`, `993-TURKMENISTAN`, `1649-TURKS AND CAICOS ISLANDS`, `688-TUVALU`, `256-UGANDA`, `380-UKRAINE`, `971-UNITED ARAB EMIRATES`, `44-UNITED KINGDOM OF GREAT BRITAIN AND NORTHERN IRELAND`, `2-UNITED STATES OF AMERICA`, `1009-UNITED STATES MINOR OUTLYING ISLANDS`, `598-URUGUAY`, `998-UZBEKISTAN`, `678-VANUATU`, `58-VENEZUELA (BOLIVARIAN REPUBLIC OF)`, `84-VIET NAM`, `1284-VIRGIN ISLANDS (BRITISH)`, `1340-VIRGIN ISLANDS (U.S.)`, `681-WALLIS AND FUTUNA`, `1013-WESTERN SAHARA`, `967-YEMEN`, `260-ZAMBIA`, `263-ZIMBABWE`, `9999-OTHERS`

### E39:E43 — `NOBCode` (371 codes)
`(Select)`, `00002-Not Applicable`, `01001-Growing and manufacturing of tea`, `01002-Growing and manufacturing of coffee`, `01003-Growing and manufacturing of rubber`, `01004-Market gardening and horticulture specialties`, `01005-Raising of silk worms and production of silk`, `01006-Raising of bees and production of honey`, `01007-Raising of poultry and production of eggs`, `01008-Rearing of sheep and production of wool`, `01009-Rearing of animals and production of animal products`, `01010-Agricultural and animal husbandry services`, `01011-Soil conservation, soil testing and soil desalination services`, `01012-Hunting, trapping and game propagation services`, `01013-Growing of timber, plantation, operation of tree nurseries and conserving of forest`, `01014-Gathering of tendu leaves`, `01015-Gathering of other wild growing materials`, `01016-Forestry service activities, timber cruising, afforestation and reforestation`, `01017-Logging service activities, transport of logs within the forest`, `01018-Other agriculture, animal husbandry or forestry activity n.e.c`, `02001-Fishing on commercial basis in inland waters`, `02002-Fishing on commercial basis in ocean and coastal areas`, `02003-Fish farming`, `02004-Gathering of marine materials such as natural pearls, sponges, coral etc.`, `02005-Services related to marine and fresh water fisheries, fish hatcheries and fish farms`, `02006-Other Fish farming activity n.e.c`, `03001-Mining and agglomeration of hard coal`, `03002-Mining and agglomeration of lignite`, `03003-Extraction and agglomeration of peat`, `03004-Extraction of crude petroleum and natural gas`, `03005-Service activities incidental to oil and gas extraction excluding surveying`, `03006-Mining of uranium and thorium ores`, `03007-Mining of iron ores`, `03008-Mining of non-ferrous metal ores, except uranium and thorium ores`, `03009-Mining of gemstones`, `03010-Mining of chemical and fertilizer minerals`, `03011-Mining of quarrying of abrasive materials`, `03012-Mining of mica, graphite and asbestos`, `03013-Quarrying of stones (marble/granite/dolomite), sand and clay`, `03014-Other mining and quarrying`, `03015-Mining and production of salt`, `03016-Other mining and quarrying n.e.c`, `04001-Production, processing and preservation of meat and meat products`, `04002-Production, processing and preservation of fish and fish products`, `04003-Manufacture of vegetable oil, animal oil and fats`, `04004-Processing of fruits, vegetables and edible nuts`, `04005-Manufacture of dairy products`, `04006-Manufacture of sugar`, `04007-Manufacture of cocoa, chocolates and sugar confectionery`, `04008-Flour milling`, `04009-Rice milling`, `04010-Dal milling`, `04011-Manufacture of other grain mill products`, `04012-Manufacture of bakery products`, `04013-Manufacture of starch products`, `04014-Manufacture of animal feeds`, `04015-Manufacture of other food products`, `04016-Manufacturing of wines`, `04017-Manufacture of beer`, `04018-Manufacture of malt liquors`, `04019-Distilling and blending of spirits, production of ethyl alcohol`, `04020-Manufacture of mineral water`, `04021-Manufacture of soft drinks`, `04022-Manufacture of other non-alcoholic beverages`, `04023-Manufacture of tobacco products`, `04024-Manufacture of textiles (other than by handloom)`, `04025-Manufacture of textiles using handlooms (khadi)`, `04026-Manufacture of carpet, rugs, blankets, shawls etc. (other than by hand)`, `04027-Manufacture of carpet, rugs, blankets, shawls etc. by hand`, `04028-Manufacture of wearing apparel`, `04029-Tanning and dressing of leather`, `04030-Manufacture of luggage, handbags and the like saddler and harness`, `04031-Manufacture of footwear`, `04032-Manufacture of wood and wood products, cork, straw and plaiting material`, `04033-Manufacture of paper and paper products`, `04034-Publishing, printing and reproduction of recorded media`, `04035-Manufacture of coke oven products`, `04036-Manufacture of refined petroleum products`, `04037-Processing of nuclear fuel`, `04038-Manufacture of fertilizers and nitrogen compounds`, `04039-Manufacture of plastics in primary forms and of synthetic rubber`, `04040-Manufacture of paints, varnishes and similar coatings`, `04041-Manufacture of pharmaceuticals, medicinal chemicals and botanical products`, `04042-Manufacture of soap and detergents`, `04043-Manufacture of other chemical products`, `04044-Manufacture of man-made fibers`, `04045-Manufacture of rubber products`, `04046-Manufacture of plastic products`, `04047-Manufacture of glass and glass products`, `04048-Manufacture of cement, lime and plaster`, `04049-Manufacture of articles of concrete, cement and plaster`, `04050-Manufacture of Bricks`, `04051-Manufacture of other clay and ceramic products`, `04052-Manufacture of other non-metallic mineral products`, `04053-Manufacture of pig iron, sponge iron, Direct Reduced Iron etc.`, `04054-Manufacture of Ferro alloys`, `04055-Manufacture of Ingots, billets, blooms and slabs etc.`, `04056-Manufacture of steel products`, `04057-Manufacture of basic precious and non-ferrous metals`, `04058-Manufacture of non-metallic mineral products`, `04059-Casting of metals`, `04060-Manufacture of fabricated metal products`, `04061-Manufacture of engines and turbines`, `04062-Manufacture of pumps and compressors`, `04063-Manufacture of bearings and gears`, `04064-Manufacture of ovens and furnaces`, `04065-Manufacture of lifting and handling equipment`, `04066-Manufacture of other general purpose machinery`, `04067-Manufacture of agricultural and forestry machinery`, `04068-Manufacture of Machine Tools`, `04069-Manufacture of machinery for metallurgy`, `04070-Manufacture of machinery for mining, quarrying and constructions`, `04071-Manufacture of machinery for processing of food and  beverages`, `04072-Manufacture of machinery for leather and textile`, `04073-Manufacture of weapons and ammunition`, `04074-Manufacture of other special purpose machinery`, `04075-Manufacture of domestic appliances`, `04076-Manufacture of office, accounting and computing machinery`, `04077-Manufacture of electrical machinery and apparatus`, `04078-Manufacture of Radio, Television, communication equipment and apparatus`, `04079-Manufacture of medical and surgical equipment`, `04080-Manufacture of industrial process control equipment`, `04081-Manufacture of instruments and appliances for measurements and navigation`, `04082-Manufacture of optical instruments`, `04083-Manufacture of watches and clocks`, `04084-Manufacture of motor vehicles`, `04085-Manufacture of body of motor vehicles`, `04086-Manufacture of parts & accessories of motor vehicles &  engines`, `04087-Building & repair of ships and boats`, `04088-Manufacture of railway locomotive and rolling stocks`, `04089-Manufacture of aircraft and spacecraft`, `04090-Manufacture of bicycles`, `04091-Manufacture of other transport equipment`, `04092-Manufacture of furniture`, `04093-Manufacture of jewellery`, `04094-Manufacture of sports goods`, `04095-Manufacture of musical instruments`, `04096-Manufacture of games and toys`, `04097-Other manufacturing n.e.c.`, `04098-Recycling of metal waste and scrap`, `04099-Recycling of non- metal waste and scrap`, `05001-Production, collection and distribution of electricity`, `05002-Manufacture and distribution of gas`, `05003-Collection, purification and distribution of water`, `05004-Other essential commodity service  n.e.c`, `06001-Site preparation works`, `06002-Building of complete constructions or parts- civil contractors`, `06003-Building installation`, `06004-Building completion`, `06005-Construction and maintenance of roads, rails, bridges, tunnels, ports, harbour, runways etc.`, `06006-Construction and maintenance of power plants`, `06007-Construction  and maintenance of industrial plants`, `06008-Construction  and maintenance of power transmission and telecommunication lines`, `06009-Construction of water ways and water reservoirs`, `06010-Other construction activity n.e.c.`, `07001-Purchase, sale and letting of leased buildings (residential and non-residential)`, `07002-Operating of real estate of self-owned buildings (residential and non-residential)`, `07003-Developing and sub-dividing real estate into lots`, `07004-Real estate activities on a fee or contract basis`, `07005-Other real estate/renting services n.e.c`, `08001-Renting of land transport equipment`, `08002-Renting of water transport equipment`, `08003-Renting of air transport equipment`, `08004-Renting of agricultural machinery and equipment`, `08005-Renting of construction and civil engineering machinery`, `08006-Renting of office machinery and equipment`, `08007-Renting of other machinery and equipment n.e.c.`, `08008-Renting of personal and household goods n.e.c.`, `08009-Renting of other machinery n.e.c.`, `09001-Wholesale and retail sale of motor vehicles`, `09002-Repair and maintenance of motor vehicles`, `09003-Sale of motor parts and accessories- wholesale and retail`, `09004-Retail sale of automotive fuel`, `09005-General commission agents, commodity brokers and auctioneers`, `09006-Wholesale of agricultural raw material`, `09007-Wholesale of food & beverages and tobacco`, `09008-Wholesale of household goods`, `09009-Wholesale of metals and metal ores`, `09010-Wholesale of household goods`, `09011-Wholesale of construction material`, `09012-Wholesale of hardware and sanitary fittings`, `09013-Wholesale of cotton and jute`, `09014-Wholesale of raw wool and raw silk`, `09015-Wholesale of other textile fibres`, `09016-Wholesale of industrial chemicals`, `09017-Wholesale of fertilizers and pesticides`, `09018-Wholesale of electronic parts & equipment`, `09019-Wholesale of other machinery, equipment and supplies`, `09020-Wholesale of waste, scrap & materials for re-cycling`, `09021-Retail sale of food, beverages and tobacco in specialized stores`, `09022-Retail sale of other goods in specialized stores`, `09023-Retail sale in non-specialized stores`, `09024-Retail sale of textiles, apparel, footwear, leather goods`, `09025-Retail sale of other household appliances`, `09026-Retail sale of hardware, paint and glass`, `09027-Wholesale of other products n.e.c`, `09028-Retail sale of other products n.e.c`, `09029-Commission agents - Kachcha Arahtia`, `10001-Hotels – Star rated`, `10002-Hotels – Non-star rated`, `10003-Motels, Inns and Dharmshalas`, `10004-Guest houses and circuit houses`, `10005-Dormitories and hostels at educational institutions`, `10006-Short stay accommodations n.e.c.`, `10007-Restaurants – with bars`, `10008-Restaurants – without bars`, `10009-Canteens`, `10010-Independent caterers`, `10011-Casinos and other games of chance`, `10012-Other hospitality services n.e.c.`, `11001-Travel agencies and tour operators`, `11002-Packers and movers`, `11003-Passenger land transport`, `11004-Air transport`, `11005-Transport by urban/sub-urban railways`, `11006-Inland water transport`, `11007-Sea and coastal water transport`, `11008-Freight transport by road`, `11009-Freight transport by railways`, `11010-Forwarding of freight`, `11011-Receiving and acceptance of freight`, `11012-Cargo handling`, `11013-Storage and warehousing`, `11014-Transport via pipelines (transport of gases, liquids, slurry and other commodities)`, `11015-Other Transport & Logistics services n.e.c`, `12001-Post and courier activities`, `12002-Basic telecom services`, `12003-Value added telecom services`, `12004-Maintenance of telecom network`, `12005-Activities of the cable operators`, `12006-Other Post & Telecommunication services n.e.c`, `13001-Commercial banks, saving banks and discount houses`, `13002-Specialised institutions granting credit`, `13003-Financial leasing`, `13004-Hire-purchase financing`, `13005-Housing finance activities`, `13006-Commercial loan activities`, `13007-Credit cards`, `13008-Mutual funds`, `13009-Chit fund`, `13010-Investment activities`, `13011-Life insurance`, `13012-Pension funding`, `13013-Non-life insurance`, `13014-Administration of financial markets`, `13015-Stock brokers, sub-brokers and related activities`, `13016-Financial advisers, mortgage advisers and brokers`, `13017-Foreign exchange services`, `13018-Other financial intermediation services n.e.c.`, `14001-Software development`, `14002-Other software consultancy`, `14003-Data processing`, `14004-Database activities and distribution of electronic content`, `14005-Other IT enabled services`, `14006-BPO services`, `14007-Cyber café`, `14008-Maintenance and repair of office, accounting and computing machinery`, `14009-Computer training and educational institutes`, `14010-Other computation related services n.e.c.`, `15001-Natural sciences and engineering`, `15002-Social sciences and humanities`, `15003-Other Research & Development activities n.e.c.`, `16001-Legal profession`, `16002-Accounting, book-keeping and auditing profession`, `16003-Tax consultancy`, `16004-Architectural profession`, `16005-Engineering and technical consultancy`, `16006-Advertising`, `16007-Fashion designing`, `16008-Interior decoration`, `16009-Photography`, `16010-Auctioneers`, `16011-Business brokerage`, `16012-Market research and public opinion polling`, `16013-Business and management consultancy activities`, `16014-Labour recruitment and provision of personnel`, `16015-Investigation and security services`, `16016-Building-cleaning and industrial cleaning activities`, `16017-Packaging activities`, `16018-Secretarial activities`, `16019_1-Medical Profession`, `16020-Film Artist`, `16021-Social Media Influencers`, `16019-Other professional services n.e.c.`, `17001-Primary education`, `17002-Secondary/ senior secondary education`, `17003-Technical and vocational secondary/ senior secondary education`, `17004-Higher education`, `17005-Education by correspondence`, `17006-Coaching centres and tuitions`, `17007-Other education services n.e.c.`, `18001-General  hospitals`, `18002-Speciality and super speciality hospitals`, `18003-Nursing homes`, `18004-Diagnostic centres`, `18005-Pathological laboratories`, `18006-Independent blood banks`, `18007-Medical transcription`, `18008-Independent ambulance services`, `18009-Medical suppliers, agencies and stores`, `18010-Medical clinics`, `18011-Dental practice`, `18012-Ayurveda practice`, `18013-Unani practice`, `18014-Homeopathy practice`, `18015-Nurses, physiotherapists or other para-medical practitioners`, `18016-Veterinary hospitals and practice`, `18017-Medical education`, `18018-Medical research`, `18019-Practice of other alternative medicine`, `18020-Other healthcare services`, `19001-Social work activities with accommodation (orphanages and old age homes)`, `19002-Social work activities without accommodation (Creches)`, `19003-Industry associations, chambers of commerce`, `19004-Professional organisations`, `19005-Trade unions`, `19006-Religious organizations`, `19007-Political organisations`, `19008-Other membership organisations n.e.c. (rotary clubs, book clubs and philatelic clubs)`, `19009-Other Social or community service n.e.c`, `20001-Motion picture production`, `20002-Film distribution`, `20003-Film laboratories`, `20004-Television channel productions`, `20005-Television channels broadcast`, `20006-Video production and distribution`, `20007-Sound recording studios`, `20008-Radio - recording and distribution`, `20009-Stage production and related activities`, `20010-Individual artists excluding authors`, `20011-Literary activities`, `20012-Other cultural activities n.e.c.`, `20013-Circuses and race tracks`, `20014-Video Parlours`, `20015-News agency activities`, `20016-Library and archives activities`, `20017-Museum activities`, `20018-Preservation of historical sites and buildings`, `20019-Botanical and zoological gardens`, `20020-Operation and maintenance of sports facilities`, `20021-Activities of sports and game schools`, `20022-Organisation and operation of indoor/outdoor sports and promotion and production of sporting events`, `20023_1-Sports Management`, `20023-Other sporting activities n.e.c.`, `20024-Other recreational activities n.e.c.`, `21001-Hair dressing and other beauty treatment`, `21002-Funeral and related activities`, `21003-Marriage bureaus`, `21004-Pet care services`, `21005-Sauna and steam baths, massage salons etc.`, `21006-Astrological and spiritualists’ activities`, `21007-Private households as employers of domestic staff`, `21008_1-Event Management`, `21008-Other services n.e.c.`, `21009-Speculative trading`, `21010-Futures and Options trading`, `21011-Buying and selling shares`, `22001-Extra territorial organisations and bodies (IMF, World Bank,European Commission etc.)`, `23001-Banking/Credit Facilities to its members`, `23002-Cottage Industry`, `23003- Marketing of Agricultural produce grown by its members`, `23004-Purchase of Agricultural Implements, seeds, livestock or other articles intended for agriculture for the purpose of supplying to its members.`, `23005-Processing ,  without the aid of power, of the agricultural Produce of its members.`, `23006- Collective disposal of Labour of its members`, `23007- Fishing or allied activities for the purpose of supplying to its members.`, `23008-Primary cooperative society engaged in supplying Milk, oilseeds, fruits or vegetables raised or grown by its members to Federal cooperative society engaged in supplying Milk, oilseeds, fruits or vegetables/Government or local authority/Government Company /  corporation established by or under a Central, State or Provincial Act`, `23009-Consumer Cooperative Society Other than specified in 80P(2a) or 80P(2b)`, `23010-Other Cooperative Society engaged in activities Other than specified in 80P(2a) or 80P(2b)`, `23011-Interest/Dividend from Investment in other co-operative society`, `23012-Income from Letting of godowns / warehouses for storage, processing / facilitating the marketing of commodities`, `23013-Others`, `23014-Federal milk co-operative society`
