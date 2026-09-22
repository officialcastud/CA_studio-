# The book of Schedule SH — Shareholding of Unlisted Company · ITR-7, A.Y. 2026-27

Read row by row from the utility's **Schedule SH** sheet (rows 3–26, three
seeded tables) with the dropdowns and number-format validations, and confirmed
against the CBDT ITR-7 schema block **`ScheduleSH`**
(`ShrhldngUnlistedCompany`). *Sch SH — "SHAREHOLDING OF UNLISTED COMPANY"*, filed
where the ITR-7 filer is **an unlisted company** furnishing the details of its
shareholders. Unlike ITR-6, the ITR-7 Schedule SH carries **only the unlisted
company object** (`ShrhldngUnlistedCompany`) — there is no start-up SH-2 object
on this form. Nothing here is invented: Appendix 2 reproduces every schema leaf,
Appendix 3 every live row verbatim, Appendix 4 every dropdown value.

---

## 1 · When it applies and its shape

Row **D4** — *"If you are an unlisted company, please furnish the following
details;-"* — is the instructional gate. When the filer is an unlisted company,
it furnishes three tables, all unlimited:

| Part | What it is | Object array |
|---|---|---|
| **A** | Details of shareholding at the end of the previous year | `DtlsSHEndPreviousYearUC[]` |
| **B** | Details of equity share application money pending allotment at the end of the previous year | `DtlsEquityShareEndPrvYr[]` |
| **C** | Details of shareholders who is not a shareholder at the end of the previous year but was a shareholder at any time during the previous year | `SHDtlsAnyTimePrevYearUC[]` |

All amounts are in rupees. There is **no computed / total row** — every cell is
entered.

---

## 2 · Part A — Shareholding at the end of the previous year

Header row **6**; data rows 7–10 (four seed rows, unlimited). Object
`ShrhldngUnlistedCompany.DtlsSHEndPreviousYearUC[]`.

| Col | Label (verbatim) | Type / enum | Schema key | Req |
|---|---|---|---|---|
| C6 | Sl. No | serial | — | — |
| D6 | Name of the shareholder 1 | text (max 125) | `ShareholderName` | * |
| E6 | Residential status in India 2 | enum `SH1.ResSts` | `ResidentialStatus` | * |
| F6 | Type of share 3 | enum `SH1.Type` | `ShareType` | * |
| G6 | PAN 4 | PAN (max 10) | `PAN` | * |
| H6 | Date of acquisition 5 | date (max 10) | `AcquisitionDate` | * |
| I6 | Number of shares held 6 | integer ≥ 0 | `NumberOfSharesHeld` | * |
| J6 | Face value per share 7 | integer ≥ 0 | `FaceValuePerShare` | * |
| K6 | Issue Price per share 8 | integer ≥ 0 | `IssuePricePerShare` | * |
| L6 | Amount received 9 | integer ≥ 0 | `AmountReceived` | * |

---

## 3 · Part B — Equity share application money pending allotment

Header row **14**; data rows 15–18. Object
`ShrhldngUnlistedCompany.DtlsEquityShareEndPrvYr[]`.

| Col | Label (verbatim) | Type / enum | Schema key | Req |
|---|---|---|---|---|
| C14 | SL. No. | serial | — | — |
| D14 | Name of the applicant 1 | text (max 125) | `ApplicantName` | * |
| E14 | Residential status in India 2 | enum `SH1.ResSts` | `ResidentialStatus` | * |
| F14 | Type of share 3 | enum `SH1B.Type` | `ShareType` | * |
| G14 | Description 4 | text (max 125) | `ShareTypeOthers` | (when Type = Others) |
| H14 | PAN 5 | PAN (max 10) | `PAN` | * |
| I14 | Date of application 6 | date (max 10) | `ApplicationDate` | * |
| J14 | Number of shares applied for 7 | integer ≥ 0 | `NumberOfSharesApplied` | * |
| K14 | Application money received 8 | integer ≥ 0 | `ApplicationMoneyReceived` | * |
| L14 | Face value per share 9 | integer ≥ 0 | `FaceValuePerShare` | * |
| M14 | Proposed issue price 10 | integer ≥ 0 | `ProposedIssuePrice` | * |

---

## 4 · Part C — Was a shareholder at any time during the previous year

Header row **22**; data rows 23–26. Object
`ShrhldngUnlistedCompany.SHDtlsAnyTimePrevYearUC[]`. The share-type dropdown
here (`SH1C.Type`) is the shorter list, and there is **no "Others" column**.

| Col | Label (verbatim) | Type / enum | Schema key | Req |
|---|---|---|---|---|
| C22 | SL. No. | serial | — | — |
| D22 | Name of the shareholder 1 | text (max 125) | `ShareholderName` | * |
| E22 | Residential status in India 2 | enum `SH1.ResSts` | `ResidentialStatus` | * |
| F22 | Type of share 3 | enum `SH1C.Type` | `ShareType` | * |
| G22 | PAN 4 | PAN (max 10) | `PAN` | * |
| H22 | Number of shares held 5 | integer ≥ 0 | `NumberOfSharesHeld` | * |
| I22 | Face value per share 6 | integer ≥ 0 | `FaceValuePerShare` | * |
| J22 | Issue Price per share 7 | integer ≥ 0 | `IssuePricePerShare` | * |
| K22 | Amount received 8 | integer ≥ 0 | `AmountReceived` | * |
| L22 | Date of acquisition 9 | date (max 10) | `AcquisitionDate` | * |
| M22 | Date on which cease to be shareholder 10 | date (max 10) | `CeaseShareholderDate` | * |
| N22 | Mode of cessation 11 | enum `SH1.Mode` | `CessationMode` | * |
| O22 | In case of transfer, PAN of the shareholder 12 | PAN (max 10) | `NewShareholderPAN` | (optional) |

---

## 5 · The law and substance

Schedule SH is a **pure disclosure schedule** — it computes nothing and is fed
by nothing. It records **who holds the unlisted company's shares** (as distinct
from the company's own holdings, which sit elsewhere). Part A captures the
shareholding at the close of the previous year; Part B captures money received
towards shares applied for but not yet allotted; Part C captures persons who
ceased to be shareholders during the year, with the **date of cessation** and
the **mode of cessation** (transfer/sale or relinquishment of rights) and, in
case of transfer, the **PAN of the transferee/new shareholder**. Each row
carries the number of shares, face value per share, issue price per share and
amount received, so the department can test the consideration against fair value
(the angel-tax / section 56(2)(viib) enquiry) and trace movements in the cap
table across the year.

---

## Appendix 1 · Every schema leaf of block `ScheduleSH` (full paths)
`*` = required within a row of the array it sits in.
```
  ShrhldngUnlistedCompany.DtlsSHEndPreviousYearUC[] array
* ShrhldngUnlistedCompany.DtlsSHEndPreviousYearUC[].ShareholderName string
* ShrhldngUnlistedCompany.DtlsSHEndPreviousYearUC[].ResidentialStatus string
* ShrhldngUnlistedCompany.DtlsSHEndPreviousYearUC[].ShareType string
* ShrhldngUnlistedCompany.DtlsSHEndPreviousYearUC[].PAN string
* ShrhldngUnlistedCompany.DtlsSHEndPreviousYearUC[].AcquisitionDate string
* ShrhldngUnlistedCompany.DtlsSHEndPreviousYearUC[].NumberOfSharesHeld integer
* ShrhldngUnlistedCompany.DtlsSHEndPreviousYearUC[].FaceValuePerShare integer
* ShrhldngUnlistedCompany.DtlsSHEndPreviousYearUC[].IssuePricePerShare integer
* ShrhldngUnlistedCompany.DtlsSHEndPreviousYearUC[].AmountReceived integer
  ShrhldngUnlistedCompany.DtlsEquityShareEndPrvYr[] array
* ShrhldngUnlistedCompany.DtlsEquityShareEndPrvYr[].ApplicantName string
* ShrhldngUnlistedCompany.DtlsEquityShareEndPrvYr[].ResidentialStatus string
* ShrhldngUnlistedCompany.DtlsEquityShareEndPrvYr[].ShareType string
  ShrhldngUnlistedCompany.DtlsEquityShareEndPrvYr[].ShareTypeOthers string
* ShrhldngUnlistedCompany.DtlsEquityShareEndPrvYr[].PAN string
* ShrhldngUnlistedCompany.DtlsEquityShareEndPrvYr[].ApplicationDate string
* ShrhldngUnlistedCompany.DtlsEquityShareEndPrvYr[].NumberOfSharesApplied integer
* ShrhldngUnlistedCompany.DtlsEquityShareEndPrvYr[].ApplicationMoneyReceived integer
* ShrhldngUnlistedCompany.DtlsEquityShareEndPrvYr[].FaceValuePerShare integer
* ShrhldngUnlistedCompany.DtlsEquityShareEndPrvYr[].ProposedIssuePrice integer
  ShrhldngUnlistedCompany.SHDtlsAnyTimePrevYearUC[] array
* ShrhldngUnlistedCompany.SHDtlsAnyTimePrevYearUC[].ShareholderName string
* ShrhldngUnlistedCompany.SHDtlsAnyTimePrevYearUC[].ResidentialStatus string
* ShrhldngUnlistedCompany.SHDtlsAnyTimePrevYearUC[].ShareType string
* ShrhldngUnlistedCompany.SHDtlsAnyTimePrevYearUC[].PAN string
* ShrhldngUnlistedCompany.SHDtlsAnyTimePrevYearUC[].NumberOfSharesHeld integer
* ShrhldngUnlistedCompany.SHDtlsAnyTimePrevYearUC[].FaceValuePerShare integer
* ShrhldngUnlistedCompany.SHDtlsAnyTimePrevYearUC[].IssuePricePerShare integer
* ShrhldngUnlistedCompany.SHDtlsAnyTimePrevYearUC[].AmountReceived integer
* ShrhldngUnlistedCompany.SHDtlsAnyTimePrevYearUC[].AcquisitionDate string
* ShrhldngUnlistedCompany.SHDtlsAnyTimePrevYearUC[].CeaseShareholderDate string
* ShrhldngUnlistedCompany.SHDtlsAnyTimePrevYearUC[].CessationMode string
  ShrhldngUnlistedCompany.SHDtlsAnyTimePrevYearUC[].NewShareholderPAN string
```

---

## Appendix 2 · Every live row of the sheet, verbatim
```
[C3] Schedule SH  |  [D3] SHAREHOLDING OF UNLISTED COMPANY
[D4] If you are an unlisted company, please furnish the following details;-
[C5] A  |  [D5] Details of shareholding at the end of the previous year
[C6] Sl. No  |  [D6] Name of the shareholder 1  |  [E6] Residential status in India 2  |  [F6] Type of share 3  |  [G6] PAN 4  |  [H6] Date of acquisition 5  |  [I6] Number of shares held 6  |  [J6] Face value per share 7  |  [K6] Issue Price per share 8  |  [L6] Amount received 9
[C13] B  |  [D13] Details of equity share application money pending allotment at the end of the previous year
[C14] SL. No.  |  [D14] Name of the applicant 1  |  [E14] Residential status in India 2  |  [F14] Type of share 3  |  [G14] Description 4  |  [H14] PAN 5  |  [I14] Date of application 6  |  [J14] Number of shares applied for 7  |  [K14] Application money received 8  |  [L14] Face value per share 9  |  [M14] Proposed issue price 10
[C21] C  |  [D21] Details of shareholders who is not a shareholder at the end of the previous year but was a shareholder at any time during the previous year
[C22] SL. No.  |  [D22] Name of the shareholder 1  |  [E22] Residential status in India 2  |  [F22] Type of share 3  |  [G22] PAN 4  |  [H22] Number of shares held 5  |  [I22] Face value per share 6  |  [J22] Issue Price per share 7  |  [K22] Amount received 8  |  [L22] Date of acquisition 9  |  [M22] Date on which cease to be shareholder 10  |  [N22] Mode of cessation 11  |  [O22] In case of transfer, PAN of the shareholder 12
```

---

## Appendix 3 · The dropdowns (every list, with all its values, verbatim)

**`SH1.ResSts` — Residential status in India** (E7:E10, E15:E18, E23:E26 →
`ResidentialStatus`):
```
(Select)
Resident
Non Resident
Resident but not Ordinarily resident
```

**`SH1.Type` — Type of share, Part A** (F7:F10 → `ShareType`):
```
(Select)
Equity Shares
Preference Shares
Rights Shares
Sweat Equity Shares
Bonus Shares
```

**`SH1B.Type` — Type of share, Part B** (F15:F18 → `ShareType`):
```
(Select)
Equity Shares
Preference Shares
Rights Shares
Sweat Equity Shares
Others
```

**`SH1C.Type` — Type of share, Part C** (F23:F26 → `ShareType`):
```
(Select)
Equity Shares
Preference Shares
Sweat equity
Bonus Shares
```

**`SH1.Mode` — Mode of cessation** (N23:N26 → `CessationMode`):
```
(Select)
Transfer/Sale
Relinquishment of rights
```

The remaining validations are number-format (0 / max-length) constraints on the
name (max 125), PAN (max 10), date (max 10), description (max 125) and the
numeric cells (number of shares, face value, issue price, amount received,
proposed issue price) — not value lists.

---

## Appendix 4 · Cross-sheet feeds and build notes

- **No numeric feed** into Part B-TI / Part B-TTI — Schedule SH computes nothing
  and is fed by nothing; every value is entered.
- **Type-of-share dropdown differs by table** — Part A carries `SH1.Type`
  (Equity/Preference/Rights/Sweat Equity/Bonus), Part B carries `SH1B.Type`
  (Equity/Preference/Rights/Sweat Equity/Others — with the free-text
  **Description** column feeding `ShareTypeOthers`), Part C carries `SH1C.Type`
  (Equity/Preference/Sweat equity/Bonus, no "Others" column). Seed each table
  from its own enum, not one shared list.
- **Export** — `ScheduleSH.ShrhldngUnlistedCompany` with any non-empty arrays;
  there is no start-up (`ShrhldngStartUps`) object on ITR-7.
