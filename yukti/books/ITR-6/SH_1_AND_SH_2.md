# The book of Schedule SH-1 and SH-2 — Shareholding of an unlisted company / a start-up · ITR-6, A.Y. 2026-27

Read row by row from the utility's **SH-1 AND SH-2** sheet (one sheet holds both
schedules — SH-1 in rows 3-27, SH-2 in rows 32-57), with the hidden-row flags,
the dropdowns, and the formulas, and confirmed against the schema block
**`ScheduleSH`** (`ShrhldngUnlistedCompany` + `ShrhldngStartUps`).

*Sch SH-1 — "SHAREHOLDING OF UNLISTED COMPANY (other than a start-up for which
Schedule SH-2 is to be filled up)".* *Sch SH-2 — "SHAREHOLDING OF START-UPS".*
This is a **company-only disclosure** — it has no counterpart on ITR-2. One
sheet carries the two schedules; the schema carries them as two objects under
one block.

---

## 1 · When it applies

- **SH-1** is *mandatorily required to be filled up by an unlisted company* that
  is not a start-up. A company **registered under section 8 of the Companies
  Act, 2013** (previously section 25 of the 1956 Act), or a company limited by
  guarantee under section 3(2), answers the gating question and is treated
  apart. Applicability is filed as `ShrhldngUnlistedCompany.SHUnlistedCompanyFlag`
  (enum **N / Y**).
- **SH-2** is for a **start-up which has filed declaration in Form-2 under para
  5 of the DPIIT notification dated 19.02.2019**; the details cover shareholding
  as at the end of the previous year. `ShrhldngStartUps` has **no separate
  applicability flag** in the schema — the object is written when any of its
  three tables has rows.

Row **D4** — *"Are you a Company registered under section 8 of Companies
Act,2013 (Previously Section 25 of Companies Act,1956) or Company Formed Limited
by Guarantee under section 3(2) of Companies Act, 2013?"* — is answered by the
dropdown at **N4** (**(Select) / Yes / No**). This is an on-screen **eligibility
gate**; it has **no dedicated leaf** under `ScheduleSH` (it is the company's
own particular, and the filed SH-1 applicability is `SHUnlistedCompanyFlag`).
Row **D5** — *"If you are an unlisted company, please furnish the following
details;-"* — and row **D33** — *"If you are a start-up which has filed
declaration in Form-2 under para 5 of DPIIT notification dated 19.02.2019,
please furnish the following details of shareholding"* — are instructional
headers, not filed fields.

---

## 2 · The shape — two schedules, three tables each

| Schedule / object | Part | What it is | Kind |
|---|---|---|---|
| **SH-1** `ShrhldngUnlistedCompany` | **A** | Details of shareholding at the end of the previous year | table, unlimited → `DtlsSHEndPreviousYearUC[]` |
| | **B** | Details of equity share application money pending allotment at the end of the previous year | table → `DtlsEquityShareEndPrvYr[]` |
| | **C** | Details of shareholders who is not a shareholder at the end of the previous year but was a shareholder at any time during the previous year | table → `SHDtlsAnyTimePrevYearUC[]` |
| **SH-2** `ShrhldngStartUps` | **A** | Details of shareholding at the end of the previous year | table → `DtlsSHEndPreviousYearSU[]` |
| | **B** | Details of share application money pending allotment as at the end of the previous year | table → `DtlsShareAppMoneyAlltEndPrvYr[]` |
| | **C** | Details of shareholders who is not a shareholder at the end of the previous year but was a shareholder at any time during the previous year | table → `SHDtlsAnyTimePrevYearSU[]` |

All amounts are in rupees. There is **no computed / total row** on this sheet —
every cell is entered; no formula carries a rule (the value cells at K8:N11 etc.
are number-format data-validations, not derivations).

---

## 3 · SH-1 · Part A — Shareholding at the end of the previous year

Header row **7**; data rows 8-11 (four seed rows, table is unlimited). Object
`ShrhldngUnlistedCompany.DtlsSHEndPreviousYearUC[]`.

| Col | Label (verbatim) | Type / enum | Schema key | Notes |
|---|---|---|---|---|
| C7 | Sl.No | serial | — | not filed |
| D7 | **Name of the shareholder** | text (max 125) | `ShareholderName` | required |
| E7 | **Residential status in India** | enum `SH1.ResSts` | `ResidentialStatus` | required — RES/NRI/NOR |
| F7 | **Type of share** | enum `SH1.Type` | `ShareType` | required — ES/PS/RS/SS/BS/OT |
| G7 | Others | text (max 50) | `ShareTypeOthers` | when Type = Others |
| H7 | PAN | PAN | `PAN` | required |
| I7 | Aadhaar | 12-digit | `Aadhaar` | optional |
| J7 | **Date of allotment** | date DD/MM/YYYY | `AllotmentDate` | required |
| K7 | **Number of shares held** | number ≥ 0 | `NumberOfSharesHeld` | required |
| L7 | **Face value per share** | number ≥ 0 | `FaceValuePerShare` | required |
| M7 | **Issue Price per share** | number ≥ 0 | `IssuePricePerShare` | required |
| N7 | **Amount received** | number ≥ 0 | `AmountReceived` | required |

## 4 · SH-1 · Part B — Equity share application money pending allotment

Header row **15**; data rows 16-19. Object
`ShrhldngUnlistedCompany.DtlsEquityShareEndPrvYr[]`.

| Col | Label (verbatim) | Type / enum | Schema key | Notes |
|---|---|---|---|---|
| C15 | SL.NO | serial | — | not filed |
| D15 | **Name of the applicant** | text (max 125) | `ApplicantName` | required |
| E15 | **Residential status in India** | enum `SH2.Type`→ res. status `SH1.ResSts` | `ResidentialStatus` | required — RES/NRI/NOR |
| F15 | **Type of share** | enum `SH2.Type` | `ShareType` | required — ES/PS/RS/SS/OT (no Bonus) |
| G15 | Others | text (max 50) | `ShareTypeOthers` | when Type = Others |
| H15 | PAN | PAN | `PAN` | required |
| I15 | Aadhaar | 12-digit | `Aadhaar` | optional |
| J15 | **Date of application** | date | `ApplicationDate` | required |
| K15 | **Number of shares applied for** | number ≥ 0 | `NumberOfSharesApplied` | required |
| L15 | **Application money received** | number ≥ 0 | `ApplicationMoneyReceived` | required |
| M15 | **Face value per share** | number ≥ 0 | `FaceValuePerShare` | required |
| N15 | **Proposed issue price** | number ≥ 0 | `ProposedIssuePrice` | required |

## 5 · SH-1 · Part C — Was a shareholder at any time during the previous year

Header row **23**; data rows 24-27. Object
`ShrhldngUnlistedCompany.SHDtlsAnyTimePrevYearUC[]`. Note there is **no
"Others" column** here — the share-type dropdown (`SH3.Type`) is a shorter list.

| Col | Label (verbatim) | Type / enum | Schema key | Notes |
|---|---|---|---|---|
| C23 | SL.NO | serial | — | not filed |
| D23 | **Name of the shareholder** | text (max 125) | `ShareholderName` | required |
| E23 | **Residential status in India** | enum `SH1.ResSts` | `ResidentialStatus` | required — RES/NRI/NOR |
| F23 | **Type of share** | enum `SH3.Type` | `ShareType` | required — ES/PS/SS/BS |
| G23 | PAN | PAN | `PAN` | required |
| H23 | Aadhaar | 12-digit | `Aadhaar` | optional |
| I23 | **Number of shares held** | integer ≥ 0 (max 99999999999999) | `NumberOfSharesHeld` | required |
| J23 | **Face value per share** | number ≥ 0 | `FaceValuePerShare` | required |
| K23 | **Issue Price per share** | number ≥ 0 | `IssuePricePerShare` | required |
| L23 | **Amount received** | number ≥ 0 | `AmountReceived` | required |
| M23 | **Date of allotment** | date | `AllotmentDate` | required |
| N23 | **Date on which cease to be shareholder** | date | `CeaseShareholderDate` | required |
| O23 | **Mode of cessation** | enum `SH1.Mode` | `CessationMode` | required — TS/RR |
| P23 | **In case of transfer, PAN of the new shareholder** | PAN | `NewShareholderPAN` | optional |
| Q23 | **Aadhaar of new shareholder** | 12-digit | `NewShareholderAadhaar` | optional |

---

## 6 · SH-2 · Part A — Shareholding at the end of the previous year (start-up)

Header row **35**; data rows 36-39. Object
`ShrhldngStartUps.DtlsSHEndPreviousYearSU[]`. The distinguishing columns for a
start-up are **Category of shareholder**, **Paid up value per share** and
**Share premium** (instead of "Amount received").

| Col | Label (verbatim) | Type / enum | Schema key | Notes |
|---|---|---|---|---|
| C35 | SL.NO | serial | — | not filed |
| D35 | **Name of the shareholder** | text (max 125) | `ShareholderName` | required |
| E35 | **Category of shareholder** | enum `SH2.Catgry` | `ShareholderCategory` | required — NRI/VCP/VCF/SPC/OTH |
| F35 | **Type of share** | enum `SH1.Type` | `ShareType` | required — ES/PS/RS/SS/BS/OT |
| G35 | Others | text (max 50) | `ShareTypeOthers` | when Type = Others |
| H35 | PAN | PAN | `PAN` | required |
| I35 | Aadhaar | 12-digit | `Aadhaar` | optional |
| J35 | **Date of allotment** | date | `AllotmentDate` | required |
| K35 | **Number of shares held** | integer ≥ 0 (max 99999999999999) | `NumberOfSharesHeld` | required |
| L35 | **Face value per share** | number ≥ 0 | `FaceValuePerShare` | required |
| M35 | **Issue Price per share** | number ≥ 0 | `IssuePricePerShare` | required |
| N35 | **Paid up value per share** | number ≥ 0 | `PaidUpValuePerShare` | required |
| O35 | **Share premium** | number ≥ 0 | `SharePremium` | required |

## 7 · SH-2 · Part B — Share application money pending allotment (start-up)

Header row **44**; data rows 45-48. Object
`ShrhldngStartUps.DtlsShareAppMoneyAlltEndPrvYr[]`.

| Col | Label (verbatim) | Type / enum | Schema key | Notes |
|---|---|---|---|---|
| C44 | SL.NO | serial | — | not filed |
| D44 | **Name of the applicant** | text (max 125) | `ApplicantName` | required |
| E44 | **Category of applicant** | enum `SH2.Catgry` | `ApplicantCategory` | required — NRI/VCP/VCF/SPC/OTH |
| F44 | **Type of share** | enum `SH2.Type` | `ShareType` | required — ES/PS/RS/SS/OT |
| G44 | Others | text (max 50) | `ShareTypeOthers` | when Type = Others |
| H44 | PAN | PAN | `PAN` | required |
| I44 | Aadhaar | 12-digit | `Aadhaar` | optional |
| J44 | **Date of application** | date | `ApplicationDate` | required |
| K44 | **Number of shares applied for** | integer ≥ 0 (max 99999999999999) | `NumberOfSharesApplied` | required |
| L44 | **Face value per share** | number ≥ 0 | `FaceValuePerShare` | required |
| M44 | **Proposed issue price per share** | number ≥ 0 | `ProposedIssuePrice` | required |
| N44 | **Share application money** | number ≥ 0 | `ShareApplicationMoney` | required |
| O44 | **Share application premium** | number ≥ 0 | `ShareApplicationPremium` | required |

## 8 · SH-2 · Part C — Was a shareholder at any time during the previous year (start-up)

Header row **53**; data rows 54-57. Object
`ShrhldngStartUps.SHDtlsAnyTimePrevYearSU[]`. No "Others" column; `SH2.Type` is
the shorter start-up type list (F54:F57 is a literal list — ES/PS/RS/SS).

| Col | Label (verbatim) | Type / enum | Schema key | Notes |
|---|---|---|---|---|
| C53 | SL.NO | serial | — | not filed |
| D53 | **Name of the shareholder** | text (max 125) | `ShareholderName` | required |
| E53 | **Category of shareholder** | enum `SH2.Catgry` | `ShareholderCategory` | required — NRI/VCP/VCF/SPC/OTH |
| F53 | **Type of share** | enum (literal) | `ShareType` | required — ES/PS/RS/SS |
| G53 | PAN | PAN | `PAN` | required |
| H53 | Aadhaar | 12-digit | `Aadhaar` | optional |
| I53 | **Date of allotment** | date | `AllotmentDate` | required |
| J53 | **Number of shares held** | integer ≥ 0 (max 99999999999999) | `NumberOfSharesHeld` | required |
| K53 | **Face value per share** | number ≥ 0 | `FaceValuePerShare` | required |
| L53 | **Issue Price per share** | number ≥ 0 | `IssuePricePerShare` | required |
| M53 | **Paid up value per share** | number ≥ 0 | `PaidUpValuePerShare` | required |
| N53 | **Date on which cease to be shareholder** | date | `CeaseShareholderDate` | required |
| O53 | **Mode of cessation** | enum `SH1.Mode` | `CessationMode` | required — TS/RR |
| P53 | **In case of transfer, PAN of the new shareholder** | PAN | `NewShareholderPAN` | optional |
| Q53 | **Aadhaar of new shareholder** | 12-digit | `NewShareholderAadhaar` | optional |

**Note (row C59, verbatim):** *"Note:- For definition of expressions– "venture
capital company", "venture capital fund" and "specified company", please refer
DPIIT notification dated 19.02.2019."*

---

## 9 · The dropdowns (every list on the sheet, with all its values)

**`SH1.ResSts` — Residential status in India** (E8:E11, E16:E19, E24:E27) → `ResidentialStatus`:

| Value | Code |
|---|---|
| (Select) | — |
| Resident | RES |
| Non Resident | NRI |
| Resident but not Ordinarily resident | NOR |

**`SH1.Type` — Type of share, full list** (F8:F11 SH-1 A, F36:F39 SH-2 A) → `ShareType`:
(Select), **Equity Shares** (ES), **Preference Shares** (PS), **Rights Shares**
(RS), **Sweat Equity Shares** (SS), **Bonus Shares** (BS), **Others** (OT).

**`SH2.Type` — Type of share, no Bonus** (F16:F19 SH-1 B, F45:F48 SH-2 B) → `ShareType`:
(Select), Equity Shares (ES), Preference Shares (PS), Rights Shares (RS), Sweat
Equity Shares (SS), Others (OT).

**`SH3.Type` — Type of share, SH-1 C** (F24:F27) → `ShareType`:
(Select), Equity Shares (ES), Preference Shares (PS), Bonus Shares (BS), Sweat
Equity Shares (SS).

**Type of share, SH-2 C** (F54:F57, literal list) → `ShareType`:
(Select), Equity Shares (ES), Preference Shares (PS), Rights Shares (RS), Sweat
Equity Shares (SS).

**`SH2.Catgry` — Category of shareholder / applicant** (E36:E39, E45:E48, E54:E57) → `ShareholderCategory` / `ApplicantCategory`:

| Value | Code |
|---|---|
| (Select) | — |
| non-resident | NRI |
| venture capital company | VCP |
| venture capital fund | VCF |
| specified company | SPC |
| any other person | OTH |

**`SH1.Mode` — Mode of cessation** (O24:O27, O54:O57) → `CessationMode`:
(Select), **Transfer/Sale** (TS), **Relinquishment of rights** (RR).

**Section-8 gate** (N4, literal): (Select), **Yes**, No — the D4 eligibility
question; not a `ScheduleSH` leaf.

`SHUnlistedCompanyFlag` (SH-1 applicability, filed): enum **N / Y**.

---

## 10 · The schema block `ScheduleSH` — every leaf key (coverage)

`ScheduleSH` has two objects. `*` = required within a row of the array it sits in.

**`ShrhldngUnlistedCompany`** — `SHUnlistedCompanyFlag` (N/Y); arrays
`DtlsSHEndPreviousYearUC[]`, `DtlsEquityShareEndPrvYr[]`,
`SHDtlsAnyTimePrevYearUC[]`. Row leaves: `ShareholderName`*, `ApplicantName`*,
`ResidentialStatus`*, `ShareType`*, `ShareTypeOthers`, `PAN`*, `Aadhaar`,
`AllotmentDate`*, `ApplicationDate`*, `NumberOfSharesHeld`*,
`NumberOfSharesApplied`*, `FaceValuePerShare`*, `IssuePricePerShare`*,
`AmountReceived`*, `ApplicationMoneyReceived`*, `ProposedIssuePrice`*,
`CeaseShareholderDate`*, `CessationMode`*, `NewShareholderPAN`,
`NewShareholderAadhaar`.

**`ShrhldngStartUps`** — arrays `DtlsSHEndPreviousYearSU[]`,
`DtlsShareAppMoneyAlltEndPrvYr[]`, `SHDtlsAnyTimePrevYearSU[]`. Row leaves:
`ShareholderName`*, `ApplicantName`*, `ShareholderCategory`*,
`ApplicantCategory`*, `ShareType`*, `ShareTypeOthers`, `PAN`*, `Aadhaar`,
`AllotmentDate`*, `ApplicationDate`*, `NumberOfSharesHeld`*,
`NumberOfSharesApplied`*, `FaceValuePerShare`*, `IssuePricePerShare`*,
`PaidUpValuePerShare`*, `SharePremium`*, `ShareApplicationMoney`*,
`ShareApplicationPremium`*, `ProposedIssuePrice`*, `CeaseShareholderDate`*,
`CessationMode`*, `NewShareholderPAN`, `NewShareholderAadhaar`.

Every live label on the sheet has a schema key. The only live row without a
`ScheduleSH` key is the **D4 section-8 eligibility question** — a company
particular / on-screen gate, not a filed leaf of this block (logged as such in §1).

---

## 11 · Cross-sheet feeds in / out

- **No numeric feed** into Part B-TI / Part B-TTI — Schedule SH is a pure
  disclosure schedule; it computes nothing and is fed by nothing.
- **Unlisted-share table in Part A-General** (`PartA_GEN2For6` — the company's
  own shareholders / holding status) and **Schedule AL-1 Part D (unlisted equity
  shares)** describe the *company's* holdings; SH describes *who holds the
  company's* shares — the two are distinct and should not be reconciled to each
  other, but the residential-status / category split in SH-2 should agree with
  the DPIIT / angel-tax position taken elsewhere.
- The **section-8 answer (N4)** should agree with the company-type declared in
  Part A-General.

## 12 · What is mandatory · what repeats

- SH-1 applicability flag `SHUnlistedCompanyFlag` (N/Y) for any unlisted
  company that is not a start-up; within each SH-1 row the required columns
  above. SH-2 has no flag — the object is written only when a table has rows.
- **Every table repeats, unlimited.** There are no fixed single-figure lines
  and no totals on this sheet.

## 13 · Hidden rows

None. Every row of the SH-1 AND SH-2 sheet in the applicable ranges is visible;
the utility hides nothing here. (The inter-table blank/formatting rows carry no
label and are not schema-backed.)

## 14 · What this means for the build

1. **Two schedules, one section (`al`).** Render SH-1 with its three unlimited
   tables and the SHUnlistedCompanyFlag/section-8 gate; render SH-2 with its
   three unlimited tables behind the DPIIT start-up gate.
2. **Type-of-share dropdown differs by table** — SH-1 A/SH-2 A carry the full
   six-value list (with Bonus + Others), SH-1 B/SH-2 B drop Bonus, SH-1 C is
   ES/PS/SS/BS with no "Others", SH-2 C is ES/PS/RS/SS. Seed each from its own
   enum, not one shared list.
3. **Category vs Residential status** — SH-1 uses residential status (RES/NRI/
   NOR); SH-2 uses shareholder category (NRI/VCP/VCF/SPC/OTH). Do not share the
   enum.
4. **Others free-text** appears only where the type list includes "Others"
   (SH-1 A, SH-1 B, SH-2 A, SH-2 B); write `ShareTypeOthers` only then.
5. **Export** — `ScheduleSH.ShrhldngUnlistedCompany` with the flag and any
   non-empty arrays; `ScheduleSH.ShrhldngStartUps` with any non-empty arrays.
   Nothing computed; every value is entered.
