# The book of Personal Information (PI) — ITR-7, A.Y. 2026-27

Read row by row from the utility's **PI** sheet (rows 3–146, with the hidden-row
flags, dropdowns and formulas) and confirmed against the CBDT ITR-7 schema block
**`PartA_GEN1`** (the personal / registration / filing-status block). Every
label, code and dropdown below is the department's own; nothing is invented.
Item numbers (A1–A26) are the department's own numbering carried on the sheet.

> **Source split, flagged.** ITR-7 is the return **"For persons including
> companies required to furnish return under sections 139(4A) or 139(4B) or
> 139(4C) or 139(4D)"** — i.e. charitable / religious trusts, political parties,
> research associations, news agencies, universities, hospitals and other
> exemption-claiming institutions. So "PERSONAL INFORMATION" here is not a natural
> person's page: it is the **entity's identity**, its **registrations/approvals
> under the Income-tax Act and under other laws**, and its **filing status**.
> This sheet also physically carries the **A23–A26 "Other details"** rows
> (change in activities u/s 2(15), first return, 22nd-proviso/13(10) flags) whose
> schema keys live under **`PartA_GEN2`** — the block `section_map.json` assigns
> to the **Audit** sheet. See §7 (inconsistencies). The Gate-3 check for this
> sheet covers only `PartA_GEN1`; the `PartA_GEN2` keys for rows 91–146 are
> documented here for completeness (and are the sole input for that part of the
> Audit builder).

---

## 1 · Why ITR-7's Personal Information is an institution's page

ITR-1/2 ask who the *individual* is. ITR-7 asks who the **trust / institution**
is and then asks the questions only an exemption-claiming body answers:

| The reason | What ITR-7 asks for it |
|---|---|
| A trust/institution has a formation instrument, not a birthday | **(A1) Name** as in the deed of creation/establishing/incorporation/formation, and **(A3) Date of Formation/incorporation** |
| It is one of several legal forms | **status** — 04-Local Authority / 05-AOP/BOI / 06-AJP(Artificial Juridical Person) / 07-Company, with a **sub-status** |
| It runs identifiable projects/institutions | **(A18)** whether any project/institution is run, and a table naming each and its nature of activity |
| Its exemption rests on a registration/approval | **(A19)** registration/provisional registration or approval **under the Income-tax Act** (section, the section on which exemption is claimed, date, URN) |
| It may also be registered elsewhere | **(A20)** registration/approval **under any law other than income-tax** (FCRA, DARPAN, SEBI, IFSC, any other law) |
| It files under a specific 139 sub-section | **(A21/A17)** the filing section, the section **139(4A)/(4B)/(4C)/(4D)** under which the return is furnished, and the **exemption section claimed** |
| It may be filed by a representative, or the entity may be a partner | filing status **d–g**: residential status, s.90/90A/91 claim flag, representative-assessee card, partner-in-a-firm table |
| A large refund needs an LEI | **(A21 h)** Legal Entity Identifier (mandatory if refund ≥ ₹50 crore) |
| Unlisted shares must be disclosed | **(A22)** unlisted-equity-shares holding table |
| Anti-abuse "other details" | **(A23)** advancement of general public utility & the 2(15) trade/commerce test; **(A24)** change in objects/activities; **(A25)** first return; **(A26)** 22nd proviso to 10(23C)/13(10) |

---

## 2 · The shape — the blocks on this sheet

| # | Block | Kind | Schema block | Always shown? |
|---|---|---|---|---|
| 1 | **Personal information** — name, status, date of formation | figures + ask | `PartA_GEN1.OrgFirmInfo` | yes |
| 2 | **Addresses** — primary and secondary | figures | `PartA_GEN1.OrgFirmInfo.Address` / `.AlternateAddress` | yes |
| 3 | **Communication** — phone, mobile, email | figures | `PartA_GEN1.OrgFirmInfo.Address` | yes |
| 4 | **(A18) Projects/institutions run** | ask + table | `PartA_GEN1.ProjectOrInstDtls[]` | on Yes |
| 5 | **(A19) Registration/approval under the Income-tax Act** | table | `PartA_GEN1.RegApprUnderITADtls[]` | yes |
| 6 | **(A20) Registration/approval under any other law** | table | `PartA_GEN1.RegApprUnderOthITADtls[]` | on Yes |
| 7 | **Filing status** — filing section, 139(4A-D), exemption section, revised/notice, residential status, representative, partner, LEI | ask + figures | `PartA_GEN1.FilingStatus` / `OrgFirmInfo.ReturnFurnishedSec` / `.SecExemptionClaimed` | yes |
| 8 | **(A22) Unlisted equity shares held** | ask + table | `PartA_GEN1.FilingStatus.HeldUnlistedEqShrPrYr` | on Yes |
| 9 | **(A23–A26) Other details** (2(15), change in activities, first return, 13(10)) | ask + tables | **`PartA_GEN2`** (not this sheet's block) | mixed |

---

## 3 · Block by block — the live rows

Types: **T** text, **D** date `DD/MM/YYYY`, **N** number/integer, **E** enum
(dropdown, values in §5), **F** flag Yes/No.

### Block 1 · Personal information (rows 6–9)

| Item | Label (verbatim) | Type | Schema key |
|---|---|---|---|
| **A1** | Name (as mentioned in deed of creation/establishing/incorporation/formation) | T | `OrgFirmInfo.AssesseeName.SurNameOrOrgName` (required) |
| **A2** | Permanent Account Number (PAN) | T | `OrgFirmInfo.PAN` (required) |
| **A3** | Date of Formation/ incorporation (DD/MM/YYYY) | D | `OrgFirmInfo.DateOFFormOrIncorp` (required) |
| — | Status | E | `OrgFirmInfo.StatusOrCompanyType` (required) — `NSTATUS`: 04-Local Authority / 05-AOP/BOI / 06-AJP(Artificial Juridical Person) / 07-Company |
| — | Sub-status | E | `OrgFirmInfo.SubStatus` |

The **status** drives everything downstream: the sub-status list (`NLA`, `NAOP`,
`NAJP`, `NCOMP`) and, for a **07-Company** that is a **01-Domestic Company**, the
residential-status range (`RNGRES` vs `RNGNRI`) at (A19).

### Block 2 · Addresses (rows 10–26)

Sheet heading (row 10): *"Address to be provided for communication purposes"*.

**Primary Address** (rows 11–17):

| Item | Label (verbatim) | Type | Schema key |
|---|---|---|---|
| **A4a** | Flat / Door / Block No | T | `OrgFirmInfo.Address.ResidenceNo` (required) |
| **A5a** | Name of Premises / Building / Village | T | `OrgFirmInfo.Address.ResidenceName` |
| **A6a** | Road / Street / Post Office | T | `OrgFirmInfo.Address.RoadOrStreet` |
| **A7a** | Area / Locality | T | `OrgFirmInfo.Address.LocalityOrArea` (required) |
| **A8a** | Town/ City/ District | T | `OrgFirmInfo.Address.CityOrTownOrDistrict` (required) |
| **A9a** | State | E | `OrgFirmInfo.Address.StateCode` (required) — `State`, 38 codes, §5 |
| **A10a** | Country | E | `OrgFirmInfo.Address.CountryCode` |
| **A11a** | PIN Code | N | `OrgFirmInfo.Address.PinCode` |
| — | Zip Code | T | `OrgFirmInfo.Address.ZipCode` |

Row 18 (hidden): *"Whether you want to update the address for receiving
communication from the department?"* — helper, not built.

**Is the secondary address same as primary address?** (row 19) — E (Yes/No) →
helper for `OrgFirmInfo.SecondaryAdd`. On **No**, the **Secondary Address**
(rows 20–26) opens the same fields into `OrgFirmInfo.AlternateAddress.*`
(`ResidenceNo` req, `ResidenceName`, `RoadOrStreet`, `LocalityOrArea` req,
`CityOrTownOrDistrict` req, `StateCode` req, `CountryCode`, `PinCode`,
`ZipCode`), labelled A4b/A6b/A8b/A9b.

### Block 3 · Communication (rows 27–31)

Sheet heading (row 27): *"Details to be provided for communication purposes"*.

| Item | Label (verbatim) | Type | Schema key |
|---|---|---|---|
| **A13** | (Std code) | N | `OrgFirmInfo.Address.Phone.STDcode` (required) |
| **A13** | Phone number (Office) | N | `OrgFirmInfo.Address.Phone.PhoneNo` (required) |
| **A13** | Primary Mobile No of the taxpayer | N | `OrgFirmInfo.Address.MobileNo` (required) + `CountryCodeMobile` (required) |
| **A14** | Secondary Mobile No. | N | `OrgFirmInfo.Address.MobileNoSec` + `CountryCodeMobileNoSec` |
| **A15** | Primary Email ID | T | `OrgFirmInfo.Address.EmailAddress` (required) |
| **A16** | Secondary Email ID | T | `OrgFirmInfo.Address.EmailAddressSecondary` |

### Block 4 · (A18) Projects/institutions run (rows 32–37)

**(A18) Whether any project/institution is run by the assessee? (Yes/No)** →
helper `ProjectOrInstDtlsFlg` (enum `YES,NO` at row 32). On Yes the table
**Details of the projects/institutions run by you** opens:

| Col | Label (verbatim) | Type | Schema key |
|---|---|---|---|
| — | Name of the project/institution | T | `ProjectOrInstDtls[].NameOfProjectOrInst` (required) |
| — | Nature of activity | E | `ProjectOrInstDtls[].ActivityNature` (required) — `DOP.NatureList`, §5 |
| — | (classification code, derived from nature) | E | `ProjectOrInstDtls[].ClassificationCode` (required) |

### Block 5 · (A19) Registration/approval under the Income-tax Act (rows 40–44)

Row 40: *"(A19) Details of registration/provisional registration or approval
under Income Tax Act (Mandatory ...)"* → `RegApprUnderITADtls[]`.

| Col | Label (verbatim) | Type | Schema key |
|---|---|---|---|
| — | Section under which registered/provisionally registered or approved/notified | E | `RegApprUnderITADtls[].SectionRegistered` (required) |
| — | Indicate the registration section based on which exemption is claimed in the return | E | `RegApprUnderITADtls[].RegSecExmpClaimed` (required) |
| — | Date of registration/provisional registration or approval | D | `RegApprUnderITADtls[].RegApprovalDate` (required) |
| — | Approval/ Notification/Unique Registration No. (URN) | T | `RegApprUnderITADtls[].ApprovalRegistrationNo` (required) |
| — | Approving Authority | T | `RegApprUnderITADtls[].ApprovingAuthority` (required) |
| — | Effective date | D | `RegApprUnderITADtls[].EffectiveDate` |

### Block 6 · (A20) Registration/approval under any other law (rows 47–51)

Row 47: *"(A20) Details of registration/provisional registration or approval
under any law other than income tax ..."* → `RegApprUnderOthITADtls[]`.

| Col | Label (verbatim) | Type | Schema key |
|---|---|---|---|
| — | Law under/Portal on which registered | E | `RegApprUnderOthITADtls[].LawRegistered` (required) — `PI.LawUPList`: FCRA / DARPAN Portal / SEBI / IFSC / Any other Law |
| — | Specify details in case 'Any other Law' | T | `RegApprUnderOthITADtls[].OtherLawDesc` |
| — | Date of registration or approval | D | `RegApprUnderOthITADtls[].RegApprDate` (required) |
| — | Approval/Registration No. | T | `RegApprUnderOthITADtls[].ApprovalRegistrationNo` (required) |
| — | Approving Authority | T | `RegApprUnderOthITADtls[].ApprovingAuthority` (required) |
| — | Effective date / Valid date | D | `RegApprUnderOthITADtls[].EffectiveDate` / `.ValidDate` |

### Block 7 · Filing status (rows 54–82)

| Item | Label (verbatim) | Type | Schema key |
|---|---|---|---|
| **A21 a** | Return filed u/s / Filed in response to notice u/s | E | `FilingStatus.ReturnFileSec.IncomeTaxSec` (required) — computed `ReturnSection1`/`ReturnSection2` |
| **A17 i** | Return furnished under section | E | `OrgFirmInfo.ReturnFurnishedSec` (required) — `ReturnFurnished`: 139(4A) / 139(4B) / 139(4C) / 139(4D) |
| **A17 ii** | Please specify the section under which the exemption is claimed (dropdown to be provided) | E | `OrgFirmInfo.SecExemptionClaimed` (required) — computed `ExemtionClaimed_List1..4` by the 139(4A-D) choice; the union of `Section` + `OthersSection`, §5 |
| **b** | If revised/ defective/Modified, enter Receipt no (of original return) | N | `FilingStatus.ReceiptNo` |
| **b** | Date of filing of original return (DD/MM/YYYY) | D | `FilingStatus.OrigRetFiledDate` |
| **c** | If filed in response to a notice u/s 139(9)/142(1)/148/153C or order u/s 119(2)(b), enter unique number | — | (header) |
| **c** | Unique number/DIN | T | `FilingStatus.UniqueNumNoticeUs` |
| **c** | Date of such Notice or Order (or u/s 92CD date of advance pricing agreement) | D | `FilingStatus.NoticeDateUnderSec` |
| **d** | Residential Status | E | `FilingStatus.ResidentialStatus` (required) — `RNGRES`/`RNGNRI` by status |
| **e** | Whether any income included in total income for which claim under section 90/90A/91 has been made? | E | `FilingStatus.ClaimUS9090A91Flg` — Yes/No |
| **f** | Whether this return is being filed by a representative assessee? | E | `FilingStatus.AsseseeRepFlg` (required) — Yes/No |
| **f** | Name of the representative assessee | T | `FilingStatus.AssesseeRep.RepName` (req on Yes) |
| **f** | Email-id of the representative assessee | T | `FilingStatus.AssesseeRep.RepEmailID` (req on Yes) |
| **f** | Contact number of the representative assessee | N | `FilingStatus.AssesseeRep.RepMobileNo` + `.CountryCodeRepMobileNo` (req on Yes) |
| **f** | Capacity of representative | E | (`CapacityRepresentative`, §5) — **hidden** (row 70) |
| **f** | Address of the representative | T | — **hidden** (row 71) |
| **f** | Permanent Account Number (PAN) of the representative | T | — **hidden** (row 72) |
| **f** | Aadhaar No. of the representative | N | — **hidden** (row 73) |
| **g** | Whether you are Partner in a firm? (If yes, please furnish following information) | E | `FilingStatus.PartnerInFirmFlg` (required) — Yes/No |
| **g** | Name of Firm | T | `FilingStatus.PartnerInFirm.PartnerInFirmDtls[].NameOfFirm` (required) |
| **g** | PAN | T | `FilingStatus.PartnerInFirm.PartnerInFirmDtls[].PAN` (required) |
| **h** | Legal Entity Identifier (LEI) details (mandatory if refund is 50 crores or more) | — | `FilingStatus.LEIDtls` |
| **h** | LEI Number | T | `FilingStatus.LEIDtls.LEINumber` |
| **h** | Valid upto | D | `FilingStatus.LEIDtls.ValidUptoDate` |

### Block 8 · (A22) Unlisted equity shares held (rows 83–89)

**(A22) Whether you have held unlisted equity shares at any time during the
previous year? If yes, please furnish following information** →
`FilingStatus.HeldUnlistedEqShrPrYrFlg` (required, Yes/No). On Yes the table
`HeldUnlistedEqShrPrYr.HeldUnlistedEqShrPrYrDtls[]` opens:

| Col | Label (verbatim) | Type | Schema key |
|---|---|---|---|
| 1a | Name of company | T | `...NameOfCompany` (required) |
| 1b | Type of Company | E | `...CompanyType` (required) — Domestic / Foreign |
| 2 | PAN | T | `...PAN` |
| 3 | Opening Balance — No. of shares | N | `...OpngBalNumberOfShares` (required) |
| 4 | Opening Balance — Cost of acquisition | N | `...OpngBalCostOfAcquisition` (required) |
| 5 | Shares acquired during the year — No. of shares | N | `...ShrAcqDurYrNumberOfShares` |
| 6 | Date of subscription / purchase | D | `...DateOfSubscrPurchase` |
| — | Face value per share | N | `...FaceValuePerShare` |
| — | Issue price per share | N | `...IssuePricePerShare` |
| — | Purchase price per share | N | `...PurchasePricePerShare` |
| — | Shares transferred — No. of shares | N | `...ShrTrnfNumberOfShares` |
| — | Shares transferred — sale consideration | N | `...ShrTrnfSaleConsideration` |
| — | Closing Balance — No. of shares | N | `...ClsngBalNumberOfShares` (required) |
| — | Closing Balance — Cost of acquisition | N | `...ClsngBalCostOfAcquisition` (required) |

### Block 9 · (A23–A26) Other details (rows 91–146) — schema block `PartA_GEN2`

These rows are physically on this sheet, but their schema keys are the
`PartA_GEN2` block (see §7). Documented here in full; they are also documented
in the **Audit** book, which owns `PartA_GEN2`.

| Item | Label (verbatim) | Type | Schema key (`PartA_GEN2`) |
|---|---|---|---|
| **A23 i** | Where, in any of the projects/institutions run by you, one of the charitable purposes is advancement of general public utility | E | `OtherDetailsFor7.OtherDetailsUs2_15.CharitablePurposeOfGeneralPublic` — Yes/No |
| **A23 ai** | whether there is any activity in the nature of trade, commerce or business referred to in proviso to section 2(15) | E | `...OtherDetailsUs2_15.ActivityNature2_15` — Yes/No |
| **A23 aii** | If yes, then percentage of receipt from such activity vis-à-vis total receipts | N | `...OtherDetailsUs2_15.PercntNatureOfTrade` |
| **A23 bi** | whether there is any activity of rendering any service in relation to any trade, commerce or business | E | `...OtherDetailsUs2_15.ActivityRendering2_15` — Yes/No |
| **A23 bii** | If yes, then percentage of receipt from such activity vis-à-vis total receipts | N | `...OtherDetailsUs2_15.PercntAnyTrade` |
| **A23 ii** | If 'a' or 'b' is YES, the aggregate annual receipts from such activities in respect of that institution | table | `...AggAnnualRecptsofInst[]` — `NameOfTheInstitution` (req), `AggregateAnnualReceipts` (req) |
| **A24 i** | Is there any change in the objects/activities during the Year on the basis of which approval/registration was granted | E | `OtherDetailsFor7.ChangeInActivitiesDuringYr` — Yes/No |
| **A24 ii A** | date of such change (DD/MM/YYYY) | D | `OtherDetailsFor7.DateOfChange` |
| **A24 ii B** | whether an application for fresh registration/provisional registration has been made in the prescribed form | E | `OtherDetailsFor7.FreshRegSec12A` — Yes/No |
| **A24 ii C** | whether fresh registration/provisional registration has been granted under section 12AB | E | `OtherDetailsFor7.FreshRegGrantedUs12AA` — Yes/No |
| **A24 ii D** | date of such fresh registration/provisional registration (DD/MM/YYYY) | D | `OtherDetailsFor7.DateOfFreshReg` |
| **A25** | Is this your first return? | E | `OtherDetailsFor7.FirstReturnFlag` (required) — Yes/No |
| **A26** | Whether provisions of twenty second proviso to Section 10(23C) or Section 13(10) are applicable? | E | `OtherDetailsFor7.ProvisionsSec1310Applcbl` (required) — Yes/No |
| **A26 (a)** | Provisions of proviso to clause (15) of section 2 are applicable | E | `OtherDetailsFor7.Clause15Sec2ProvisioFlag` — Yes/No |
| **A26 (b)** | Conditions specified in clause (a) of tenth proviso to 10(23C)/ sub-clause (i) of clause (b) of sub-section (1) of section 12A | E | `OtherDetailsFor7.SubClauseiSec12AViolateFlag` — Yes/No |
| **A26 (c)** | Conditions specified in clause (b) of tenth proviso to 10(23C)/ sub-clause (ii) of clause (b) of sub-section (1) of section 12A | E | `OtherDetailsFor7.SubClauseiiSec12AViolateFlag` — Yes/No |
| **A26 (d)** | Conditions specified in twentieth proviso to 10(23C)/ clause (ba) of sub-section (1) of section 12A | E | `OtherDetailsFor7.SubSec1Sec12AViolateFlag` — Yes/No |

Hidden variant rows on this sheet (read, not built): rows 104–105 (B —
University/Educational Institution/Hospital eligible under 10(23C), section list
`G107`), rows 111–124 (C — 12A/12AA registration particulars; D — approval under
section 35, `AK115` Religious/Charitable/Both, `AK120`
Scientific/Social Science/Statistical, `AK121` Incidental/Non incidental;
B — approval u/s 80G), rows 131–139 (D — FCRA; E — business trust registered
with SEBI; C — liable to tax at maximum marginal rate u/s 164). These belong to
the `PartA_GEN2` "Others details" expansion and are documented in the Audit book.

---

## 4 · The law / computation substance the builder must encode

1. **The 139 sub-section drives the exemption menu.** `ReturnFurnishedSec`
   (139(4A)/(4B)/(4C)/(4D)) selects which `ExemtionClaimed_List` populates
   `SecExemptionClaimed`. 139(4A) = trusts/institutions claiming 11/12; 139(4B) =
   political parties (13A); 139(4C) = research associations, news agencies,
   funds/institutions under 10(21)/(22B)/(23A)/(23B)/(23C) etc.; 139(4D) =
   universities/colleges under 10(23C)(iiiab)/(iiiac)/(iiiad)/(iiiae).
2. **Registration is the spine of exemption.** (A19) `RegApprUnderITADtls[]`
   records the Income-tax registration/approval (12A/12AA/12AB, 10(23C) approval,
   80G, section 35, 10(46) notification …); `RegSecExmpClaimed` picks which of
   those the exemption in *this* return rests on. Without a live registration the
   exemption fails; A24 (change in objects) and A26 (13(10)) test whether it still
   holds.
3. **Status gates residential-status and rate.** A **07-Company /
   01-Domestic Company** uses `RNGRES`; otherwise `RNGNRI`. Residential status
   feeds Schedule FSI/TR/FA and the s.90/90A/91 claim flag (**e**).
4. **The 2(15) proviso test (A23).** For a body whose charitable purpose is the
   *advancement of any other object of general public utility*, trade/commerce
   activity (or service in relation to trade/commerce) above the statutory
   receipts threshold defeats "charitable purpose"; the percentages
   (`PercntNatureOfTrade`, `PercntAnyTrade`) and the aggregate annual receipts
   table are the evidence.
5. **13(10)/22nd-proviso computation (A26).** When registration/approval
   conditions are violated, income is computed under section 13(10) / the 22nd
   proviso to 10(23C) — the three sub-flags mark which condition is breached, and
   the exemption is denied to that extent.
6. **LEI (h)** is mandatory when the Part B-TTI refund is ₹50 crore or more.
7. **Dates are `DD/MM/YYYY`** — formation, original return, notice, registration,
   change, fresh registration, LEI validity.

---

## 5 · Dropdown / enum lists (every value, verbatim)

**Yes/No flags** (`(Select), Yes, No`) — rows 19, 65, 66, 74, 83, 91, 92, 94,
122, 125, 128, 129, 131, 136, 139, 140, 141, 143–146, and the diii/other cards.

**Status — `NSTATUS`** (row 9) — `(Select)`, `04-Local Authority`, `05-AOP/BOI`,
`06-AJP(Artificial Juridical Person)`, `07-Company`.

**Secondary-address helper** (`(Select), Y`) — rows 16, 25.

**Update-address / secondary-same helper** (`(Select), Yes, No`) — row 19.

**(A18) project run helper** (`(Select), YES, NO`) — row 32.

**Nature of activity — `DOP.NatureList`** (A18 table, W35) — `(Select)`,
`Charitable & Religious`, `Research`, `Professional Bodies`, `Trade Union`,
`Political Party`, `Electoral Trust`, `Others`.

**(A20) Law/Portal — `PI.LawUPList`** (E49) — `(Select)`, `FCRA`,
`DARPAN Portal`, `SEBI`, `IFSC`, `Any other Law`.

**(A17 i) Return furnished under section — `ReturnFurnished`** (AM57) —
`(Select)`, `139(4A)`, `139(4B)`, `139(4C)`, `139(4D)`.

**(A22) Type of Company** (E86) — `(Select)`, `Domestic`, `Foreign`.

**Capacity of representative — `CapacityRepresentative`** (row 70, hidden) —
`(Select)`, `Agent of Non-resident`, `Court of Wards`, `Administrator General`,
`Official Trustee`, `Manager`, `Receiver`, `Others`.

**(hidden B) University/Institution 10(23C) section — `G107`** — `(Select)`,
`10(23C)(iiiab)`, `10(23C)(iiiac)`, `10(23C)(iiiad)`, `10(23C)(iiiae)`.

**(hidden D) Whether activity is (religious) — `AK115`** — `(Select)`,
`1.Religious`, `2.Charitable`, `3.Both`.

**(hidden D) Whether research is — `AK120`** — `(Select)`, `Scientific`,
`Social Science`, `Statistical`.

**(hidden D) Business activity in research — `AK121`** — `(Select)`,
`Incidental`, ` Non incidental`.

### 5a · Exemption section (`Section`, `A17 ii`, BM35)

(Select), Section 10(21) read with section 35, Section 10(22B), Section 10(23A),
Section 10(23B), Section 10(23C)(iiiab), Section 10(23C)(iiiac),
Section 10(23C)(iiiad), Section 10(23C)(iiiae), Section 10(23C)(iv),
Section 10(23C)(v), Section 10(23C)(vi), Section 10(23C)(via), Section 10(23D),
Section 10(23DA), Section 10(23FB), Section 10(23FBA), Section 10(23FC),
Section 10(23FCA), Section 10(24), Section 10(46), Section 10(47), Section 11,
Section 13A, Section 13B, Others.

### 5b · Exemption "Others" section (`OthersSection`, BN35)

(Select), 10(20), 10(23AA), 10(23AAA), 10(23AAB), 10(23BB), 10(23BBA),
10(23BBC), 10(23BBE), 10(23BBG), 10(23BBH), 10(23C)(i), 10(23C)(ii),
10(23C)(iii), 10(23C)(iiia), 10(23C)(iiiaa), 10(23C)(iiiaaa), 10(23C)(iiiaaaa),
10(25)(i), 10(25)(ii), 10(25)(iii), 10(25)(iv), 10(25)(v), 10(25A), 10(26AAB),
10(26B), 10(26BB), 10(26BBB), 10(44).

### 5c · State codes (`State`, 38 values)

(Select), 01-ANDAMAN AND NICOBAR ISLANDS, 02-ANDHRA PRADESH,
03-ARUNACHAL PRADESH, 04-ASSAM, 05-BIHAR, 06-CHANDIGARH,
07-DADRA NAGAR AND HAVELI, 08-DAMAN AND DIU, 09-DELHI, 10-GOA, 11-GUJARAT,
12-HARYANA, 13-HIMACHAL PRADESH, 14-JAMMU AND KASHMIR, 15-KARNATAKA, 16-KERALA,
17-LAKHSWADEEP, 18-MADHYA PRADESH, 19-MAHARASHTRA, 20-MANIPUR, 21-MEGHALAYA,
22-MIZORAM, 23-NAGALAND, 24-ODISHA, 25-PUDUCHERRY, 26-PUNJAB, 27-RAJASTHAN,
28-SIKKIM, 29-TAMILNADU, 30-TRIPURA, 31-UTTAR PRADESH, 32-WEST BENGAL,
33-CHHATISHGARH, 34-UTTARAKHAND, 35-JHARKHAND, 36-TELANGANA, 37-LADAKH,
99-FOREIGN.

---

## 6 · Cross-sheet feeds

**Feeds out of PI:**
- `StatusOrCompanyType` / `SubStatus` → tax computation and every "who" gate.
- `ReturnFurnishedSec` (139(4A-D)) + `SecExemptionClaimed` → which exemption
  schedules apply (Schedule IE-1/2/3/4, Schedule VC, Schedule AI, Schedule ER/EC).
- `RegApprUnderITADtls[].RegSecExmpClaimed` → the exemption section the return
  rests on; drives Schedule IE selection.
- `ResidentialStatus` → Schedule FSI / TR / FA availability; `ClaimUS9090A91Flg`
  → Schedule TR / FSI.
- `HeldUnlistedEqShrPrYrFlg = Yes` → the unlisted-shares disclosure table.
- LEI (h) → mandatory when Part B-TTI refund ≥ ₹50 crore.

**Feeds into PI:** none computed; every value is entered. The A23–A26 "other
details" rows serialise into **`PartA_GEN2`**, whose remaining tables (audit,
partner/member, author/founder/contribution) are on the **Audit** sheet.

---

## 7 · Inconsistencies found between the sources

1. **A23–A26 rows straddle two schema blocks.** Rows 91–146 are physically on the
   **PI** sheet, but their keys are the `OtherDetailsFor7` fields of
   **`PartA_GEN2`**, which `section_map.json` maps to the **Audit** sheet. This
   sheet's own block (`PartA_GEN1`) has no key for them. Documented above (Block 9)
   and in the Audit book; the Gate-3 check for PI covers only `PartA_GEN1`, so no
   gate conflict, but the section-builder must serialise rows 91–146 into
   `PartA_GEN2` and the Audit builder owns the rest of that block.
2. **Exemption-section list is computed, not a fixed range.** `SecExemptionClaimed`
   (A17 ii) is `ExemtionClaimed_List1..4` chosen by the 139(4A-D) value; the
   union of the `Section` and `OthersSection` named ranges is reproduced in §5a/5b.
3. **Residential-status range switches on status** — `RNGRES` for a domestic
   company, else `RNGNRI` (formula at I42/I44).
4. **Many "Others details" rows are hidden variants** (104–124, 131–139) that the
   utility unhides only for the matching institution type (10(23C) university,
   section-35 research body, 80G, FCRA, SEBI business trust, s.164 MMR). They are
   read, not built, on the default path.

---

## Appendix 1 · Every schema leaf of block `PartA_GEN1` (full paths)
`*` = required.
```
* OrgFirmInfo.AssesseeName.SurNameOrOrgName string
* OrgFirmInfo.PAN string
* OrgFirmInfo.Address.ResidenceNo string
  OrgFirmInfo.Address.ResidenceName string
  OrgFirmInfo.Address.RoadOrStreet string
* OrgFirmInfo.Address.LocalityOrArea string
* OrgFirmInfo.Address.CityOrTownOrDistrict string
* OrgFirmInfo.Address.StateCode string
  OrgFirmInfo.Address.CountryCode string
  OrgFirmInfo.Address.PinCode integer
  OrgFirmInfo.Address.ZipCode string
* OrgFirmInfo.Address.Phone.STDcode integer
* OrgFirmInfo.Address.Phone.PhoneNo integer
* OrgFirmInfo.Address.CountryCodeMobile integer
* OrgFirmInfo.Address.MobileNo integer
  OrgFirmInfo.Address.CountryCodeMobileNoSec integer
  OrgFirmInfo.Address.MobileNoSec integer
* OrgFirmInfo.Address.EmailAddress string
  OrgFirmInfo.Address.EmailAddressSecondary string
  OrgFirmInfo.SecondaryAdd string
* OrgFirmInfo.AlternateAddress.ResidenceNo string
  OrgFirmInfo.AlternateAddress.ResidenceName string
  OrgFirmInfo.AlternateAddress.RoadOrStreet string
* OrgFirmInfo.AlternateAddress.LocalityOrArea string
* OrgFirmInfo.AlternateAddress.CityOrTownOrDistrict string
* OrgFirmInfo.AlternateAddress.StateCode string
  OrgFirmInfo.AlternateAddress.CountryCode string
  OrgFirmInfo.AlternateAddress.PinCode integer
  OrgFirmInfo.AlternateAddress.ZipCode string
* OrgFirmInfo.DateOFFormOrIncorp string
* OrgFirmInfo.StatusOrCompanyType string
  OrgFirmInfo.SubStatus string
* OrgFirmInfo.ReturnFurnishedSec string
* OrgFirmInfo.SecExemptionClaimed string
  ProjectOrInstDtlsFlg string
  ProjectOrInstDtls[] array
* ProjectOrInstDtls[].NameOfProjectOrInst string
* ProjectOrInstDtls[].ActivityNature string
* ProjectOrInstDtls[].ClassificationCode string
  RegApprUnderITADtls[] array
* RegApprUnderITADtls[].SectionRegistered string
* RegApprUnderITADtls[].RegSecExmpClaimed string
* RegApprUnderITADtls[].RegApprovalDate string
* RegApprUnderITADtls[].ApprovalRegistrationNo string
* RegApprUnderITADtls[].ApprovingAuthority string
  RegApprUnderITADtls[].EffectiveDate string
  RegApprUnderOthITADtls[] array
* RegApprUnderOthITADtls[].LawRegistered string
  RegApprUnderOthITADtls[].OtherLawDesc string
* RegApprUnderOthITADtls[].RegApprDate string
* RegApprUnderOthITADtls[].ApprovalRegistrationNo string
* RegApprUnderOthITADtls[].ApprovingAuthority string
  RegApprUnderOthITADtls[].EffectiveDate string
  RegApprUnderOthITADtls[].ValidDate string
* FilingStatus.ReturnFileSec.IncomeTaxSec integer
  FilingStatus.ReceiptNo integer
  FilingStatus.OrigRetFiledDate string
  FilingStatus.UniqueNumNoticeUs string
  FilingStatus.NoticeDateUnderSec string
* FilingStatus.ResidentialStatus string
  FilingStatus.ClaimUS9090A91Flg string
* FilingStatus.AsseseeRepFlg string
* FilingStatus.AssesseeRep.RepName string
* FilingStatus.AssesseeRep.RepEmailID string
* FilingStatus.AssesseeRep.CountryCodeRepMobileNo integer
* FilingStatus.AssesseeRep.RepMobileNo integer
* FilingStatus.PartnerInFirmFlg string
  FilingStatus.PartnerInFirm.PartnerInFirmDtls[] array
* FilingStatus.PartnerInFirm.PartnerInFirmDtls[].NameOfFirm string
* FilingStatus.PartnerInFirm.PartnerInFirmDtls[].PAN string
* FilingStatus.HeldUnlistedEqShrPrYrFlg string
  FilingStatus.HeldUnlistedEqShrPrYr.HeldUnlistedEqShrPrYrDtls[] array
* FilingStatus.HeldUnlistedEqShrPrYr.HeldUnlistedEqShrPrYrDtls[].NameOfCompany string
* FilingStatus.HeldUnlistedEqShrPrYr.HeldUnlistedEqShrPrYrDtls[].CompanyType string
  FilingStatus.HeldUnlistedEqShrPrYr.HeldUnlistedEqShrPrYrDtls[].PAN string
* FilingStatus.HeldUnlistedEqShrPrYr.HeldUnlistedEqShrPrYrDtls[].OpngBalNumberOfShares integer
* FilingStatus.HeldUnlistedEqShrPrYr.HeldUnlistedEqShrPrYrDtls[].OpngBalCostOfAcquisition number
  FilingStatus.HeldUnlistedEqShrPrYr.HeldUnlistedEqShrPrYrDtls[].ShrAcqDurYrNumberOfShares integer
  FilingStatus.HeldUnlistedEqShrPrYr.HeldUnlistedEqShrPrYrDtls[].DateOfSubscrPurchase string
  FilingStatus.HeldUnlistedEqShrPrYr.HeldUnlistedEqShrPrYrDtls[].FaceValuePerShare number
  FilingStatus.HeldUnlistedEqShrPrYr.HeldUnlistedEqShrPrYrDtls[].IssuePricePerShare number
  FilingStatus.HeldUnlistedEqShrPrYr.HeldUnlistedEqShrPrYrDtls[].PurchasePricePerShare number
  FilingStatus.HeldUnlistedEqShrPrYr.HeldUnlistedEqShrPrYrDtls[].ShrTrnfNumberOfShares integer
  FilingStatus.HeldUnlistedEqShrPrYr.HeldUnlistedEqShrPrYrDtls[].ShrTrnfSaleConsideration number
* FilingStatus.HeldUnlistedEqShrPrYr.HeldUnlistedEqShrPrYrDtls[].ClsngBalNumberOfShares integer
* FilingStatus.HeldUnlistedEqShrPrYr.HeldUnlistedEqShrPrYrDtls[].ClsngBalCostOfAcquisition number
  FilingStatus.LEIDtls.LEINumber string
  FilingStatus.LEIDtls.ValidUptoDate string
```

---

## Appendix 2 · Every live row of the sheet, verbatim
Rows flagged `H` are hidden (read, not built).
```
[C3] FORM  |  [D3] ITR-7  |  [O3] ITR 7 - INDIAN INCOME TAX RETURN
[J4] [For persons including companies required to furnish return under sections 139(4A) or 139(4B) or 139
[J5] (Please see rule 12 of the Income-tax Rules, 1962) (Please refer instructions for guidance)
[C6] PERSONAL INFORMATION  |  [D6] (A1) Name (as mentioned in deed of creation/establishing/incorporation/formation)
[D8] (A3)Date of Formation/ incorporation (DD/MM/YYYY)
[D10] Address to be provided for communication purposes
[D11] Primary Address
[D12] (A4a)Flat / Door / Block No
[D14] (A6a)Road / Street / Post Office
[D16] (A8a) Town/ City/ District  |  [V16] (A9a)State
[V17] (Select)
[D18]H Whether you want to update the address for receiving communication from the department?
[D19] Is the secondary address same as primary address?
[D20] Secondary Address
[D21] (A4b)Flat/ Door/ Block No.
[D23] (A6b)Road/ Street/Post office
[D25] (A8b)Town/ City/ District  |  [V25] (A9b)State
[V26] (Select)
[D27] Details to be provided for communication purposes
[D28] (A13)(Std code)  |  [H28] (A13)Phone number (Office)  |  [P28] (A13)Primary Mobile No of the taxpayer
[D30] (A14)Secondary Mobile No.
[D32] (A18) Whether any project/institution is run by the assessee? (Yes/No) If Yes, then please furnish t
[D33] Details of the projects/institutions run by you
[D34] Sl. No.  |  [E34] Name of the project/institution  |  [W34] Nature of activity
[D40] (A19) Details of registration/provisional registration or approval under Income Tax Act (Mandatory i
[D41] Sl. No  |  [E41] Section under which registered/provisionally registered or approved/notified  |  [I41] Indicate the registration section based on which exemption is claimed in the return  |  [O41] Date of registration/provisional registration or approval  |  [S41] Approval/ Notification/Unique Registration No. (URN)
[D47] (A20) Details of registration/provisional registration or approval under any law other than income t
[D48] Sl. No  |  [E48] Law under/Portal on which registered  |  [N48] Specify details in case 'Any other Law '  |  [V48] Date of registration or approval
[D54] (A21) Filing Section
[C55] FILING STATUS  |  [D55] a  |  [E55] Return filed u/s Filed in response to notice u/s.
[E56]H "Tax payer is required to select section as "139(8A) in Part A General" while filing corrected retur
[D57] (A17)  |  [E57] i  |  [F57] Return furnished under section
[E58] ii  |  [F58] Please specify the section under which the exemption is claimed (dropdown to be provided)
[D59] b  |  [E59] If revised/ defective/Modified, enter Receipt no (Enter receipt Number of original return for wirefr
[E60] Date of filing of original return (DD/MM/YYYY)
[D61] c  |  [E61] If filed, in response to a notice u/s 139(9)/142(1)/148/153C or order u/s 119(2)(b), enter unique nu
[E62] Unique number/DIN
[E63] Date of such Notice or Order  |  [F63] in response to a notice u/s 139(9)/142(1)/148/153A/153C enter date of such notice  |  [G63] or u/s 92CD enter date of advance pricing agreement
[D64] d  |  [E64] Residential Status
[D65] e  |  [E65] Whether any income included in total income for which claim under section 90/90A/91 has been made?
[D66] f  |  [E66] Whether this return is being filed by a representative assessee?
[G67] Name of the representative assessee
[G68] Email-id of the representative assessee
[G69] Contact number of the representative assessee
[G70]H Capacity of representative
[G71]H Address of the representative
[G72]H Permanent Account Number (PAN) of the representative
[G73]H Aadhaar No. of the representative
[D74] g  |  [E74] Whether you are Partner in a firm? (If yes, please furnish following information)
[E75] Sl.No.  |  [G75] Name of Firm
[D81] h  |  [E81] Legal Entity Identifier (LEI) details (mandatory if refund is 50 crores or more):
[E82] LEI Number
[D83] (A22) Whether you have held unlisted equity shares at any time during the previous year? If yes, ple
[C84] Sl.No.  |  [D84] Name of company (Col 1a)  |  [E84] Type of Company (Col 1b)  |  [H84] PAN (Col 2)  |  [L84] Opening Balance  |  [T84] Shares acquired during the year
[L85] No. of shares (Col 3)  |  [P85] Cost of acquisition (Col 4)  |  [T85] No. of shares (Col 5)  |  [X85] Date of subscription / purchase (Col 6)
[D91] (A23)  |  [E91] i  |  [F91] Where, in any of the projects/institutions run by you, one of the charitable purposes is advancement
[F92] ai  |  [G92] whether there is any activity in the nature of trade, commerce or business referred to in proviso to
[F93] aii  |  [G93] If yes, then percentage of receipt from such activity vis-à-vis total receipts
[F94] bi  |  [G94] whether there is any activity of rendering any service in relation to any trade, commerce or busines
[F95] bii  |  [G95] If yes, then percentage of receipt from such activity vis-à-vis total receipts
[E96] ii  |  [F96] If 'a' or 'b' is YES, the aggregate annual receipts from such activities in respect of that institut
[F97] Sl.No.  |  [I97] Name of the project/Institution
[D104]H B  |  [E104] University/ Educational Institution/ Hospital/ Other Institution eligible for exemption u/s 10(23C)(
[E105]H Sl.  |  [G105] Section  |  [M105] Name of the University/ Educational Institution/ Hospital/ Other Institution
[C111]H OTHERS DETAILS  |  [D111] C  |  [E111] i  |  [F111] Whether Registered u/s 12A/12AA?
[E112]H ii  |  [F112] If yes, then enter Registration No.
[E113]H iii  |  [F113] Commissioner/Director of Income-tax (Exemptions) who granted registration
[E114]H iv  |  [F114] Date of Registration (DD/MM/YYYY)
[E115]H v  |  [F115] Whether activity is,-  |  [G115] -
[D116]H D  |  [E116] i  |  [F116] Whether approval obtained under section 35?
[E117]H ii  |  [F117] If yes, then enter the relevant clause of section 35 and Registration No.
[E118]H iii  |  [F118] Date of Approval (DD/MM/YYYY)
[E119]H iv  |  [F119] Approving Authority
[E120]H v  |  [F120] Whether research is,-  |  [G120] -
[E121]H vi  |  [F121] In case of business activity in research, whether it is
[D122]H B  |  [E122] i  |  [F122] Whether approval obtained u/s 80G?
[E123]H ii  |  [F123] If yes, then enter Approval No.
[E124]H iii  |  [F124] Date of Approval (DD/MM/YYYY)
[D125] (A24)  |  [E125] i  |  [F125] Is there any change in the objects/activities during the Year on the basis of which approval/registr
[E126] ii  |  [F126] If yes, please furnish following information:-
[F127] A  |  [G127] date of such change (DD/MM/YYYY)
[F128] B  |  [G128] whether an application for fresh registration/provisional registration has been made in the prescrib
[F129] C  |  [G129] whether fresh registration/provisional registration has been granted under section 12AB
[F130] D  |  [G130] date of such fresh registration/provisional registration (DD/MM/YYYY)
[D131]H D  |  [E131] i  |  [F131] Whether registered under Foreign Contribution (Regulation) Act, 2010 (FCRA)?
[E132]H ii  |  [F132] If yes, then enter Registration No.
[E133]H iii  |  [F133] Date of Registration (DD/MM/YYYY)
[E134]H iv  |  [F134] a  |  [G134] Total amount of foreign contribution received during the year, if any
[F135]H b  |  [G135] Specify the purpose for which the above contribution is received
[D136]H E  |  [E136] i  |  [F136] Whether a business trust registered with SEBI?
[E137]H ii  |  [F137] If yes, then enter Registration No.
[E138]H iii  |  [F138] Date of Registration (DD/MM/YYYY)
[D139]H C  |  [E139] Whether liable to tax at maximum marginal rate under section 164? (If disallowable u/s 13(1)(c) and/
[D140] (A25)  |  [E140] Is this your first return?
[D141] (A26)  |  [E141] Whether provisions of twenty second proviso to Section 10(23C) or Section 13(10) are applicable?
[F142] If yes, please furnish following information, whether:-
[F143] (a)  |  [G143] Provisions of proviso to clause (15) of section 2 are applicable
[F144] (b)  |  [G144] Conditions specified in clause (a) of tenth proviso to 10 (23C) / sub-clause (i) of clause (b) of su
[F145] (c)  |  [G145] Conditions specified in clause (b) of tenth proviso to 10 (23C)/ sub-clause (ii) of clause (b) of su
[F146] (d)  |  [G146] Conditions specified in twentieth proviso to 10(23C)/ clause (ba) of sub-section (1) of section 12A
```

---

## Appendix 3 · Every dropdown value (verbatim)
```
J-flags "(Select),Yes,No" => (Select) | Yes | No
NSTATUS => (Select) | 04-Local Authority | 05-AOP/BOI | 06-AJP(Artificial Juridical Person) | 07-Company
secondary-address "(Select),Y" => (Select) | Y
"(Select),YES,NO" => (Select) | YES | NO
DOP.NatureList => (Select) | Charitable & Religious | Research | Professional Bodies | Trade Union | Political Party | Electoral Trust | Others
PI.LawUPList => (Select) | FCRA | DARPAN Portal | SEBI | IFSC | Any other Law
ReturnFurnished => (Select) | 139(4A) | 139(4B) | 139(4C) | 139(4D)
Type of Company => (Select) | Domestic | Foreign
CapacityRepresentative => (Select) | Agent of Non-resident | Court of Wards | Administrator General | Official Trustee | Manager | Receiver | Others
G107 10(23C) => (Select) | 10(23C)(iiiab) | 10(23C)(iiiac) | 10(23C)(iiiad) | 10(23C)(iiiae)
AK115 => (Select) | 1.Religious | 2.Charitable | 3.Both
AK120 => (Select) | Scientific | Social Science | Statistical
AK121 => (Select) | Incidental |  Non incidental
Section (exemption) => (Select) | Section 10(21) read with section 35 | Section 10(22B) | Section 10(23A) | Section 10(23B) | Section 10(23C)(iiiab) | Section 10(23C)(iiiac) | Section 10(23C)(iiiad) | Section 10(23C)(iiiae) | Section 10(23C)(iv) | Section 10(23C)(v) | Section 10(23C)(vi) | Section 10(23C)(via) | Section 10(23D) | Section 10(23DA) | Section 10(23FB) | Section 10(23FBA) | Section 10(23FC) | Section 10(23FCA) | Section 10(24) | Section 10(46) | Section 10(47) | Section 11 | Section 13A | Section 13B | Others
OthersSection => (Select) | 10(20) | 10(23AA) | 10(23AAA) | 10(23AAB) | 10(23BB) | 10(23BBA) | 10(23BBC) | 10(23BBE) | 10(23BBG) | 10(23BBH) | 10(23C)(i) | 10(23C)(ii) | 10(23C)(iii) | 10(23C)(iiia) | 10(23C)(iiiaa) | 10(23C)(iiiaaa) | 10(23C)(iiiaaaa) | 10(25)(i) | 10(25)(ii) | 10(25)(iii) | 10(25)(iv) | 10(25)(v) | 10(25A) | 10(26AAB) | 10(26B) | 10(26BB) | 10(26BBB) | 10(44)
State => (Select) | 01-ANDAMAN AND NICOBAR ISLANDS | 02-ANDHRA PRADESH | 03-ARUNACHAL PRADESH | 04-ASSAM | 05-BIHAR | 06-CHANDIGARH | 07-DADRA NAGAR AND HAVELI | 08-DAMAN AND DIU | 09-DELHI | 10-GOA | 11-GUJARAT | 12-HARYANA | 13-HIMACHAL PRADESH | 14-JAMMU AND KASHMIR | 15-KARNATAKA | 16-KERALA | 17-LAKHSWADEEP | 18-MADHYA PRADESH | 19-MAHARASHTRA | 20-MANIPUR | 21-MEGHALAYA | 22-MIZORAM | 23-NAGALAND | 24-ODISHA | 25-PUDUCHERRY | 26-PUNJAB | 27-RAJASTHAN | 28-SIKKIM | 29-TAMILNADU | 30-TRIPURA | 31-UTTAR PRADESH | 32-WEST BENGAL | 33-CHHATISHGARH | 34-UTTARAKHAND | 35-JHARKHAND | 36-TELANGANA | 37-LADAKH | 99-FOREIGN
```
