<!-- ITR-2: convert AY 2026-27 build -> AY 2025-26 -->
### 3e. Container changes (required / array limits)

- `ScheduleAMTC.ScheduleAMTCDtls`: maxItems `13` → `12`
- `ScheduleCGFor23.LongTermCapGain23.NRIOnSec112and115.NRIOnSec112and115Dtls`: maxItems `3` → `2`
- `ScheduleCGFor23.LongTermCapGain23.Proviso112Applicable`: maxItems `2` → `1`

<details><summary>3f. Description-only changes (4) — labels/help text</summary>

- `CreationInfo.JSONCreationDate`: Date in YYYY-MM-DD format on or after ~~2026-04-01~~ **2023-04-01**
- `PartA_GEN1.PersonalInfo.DOB`: Date of birth of Assessee - On or before ~~2026-03-31~~ **2025-03-31**
- `ScheduleIT.TaxPayment[].DateDep`: Date in YYYY-MM-DD format on or after ~~2025-04-01~~ **2023-04-01**
- `ScheduleS.Salaries[].Salarys.NatureOfSalary.OthersIncDtls[].NatureDesc`: 1 - Basic Salary; 2 - Dearness Allowance; 3 - Conveyance Allowance; 4 - House Rent Allowance; 5 - Leave Travel Allowance; 6 - Children Education Allowance; 7 - Other Allowance; 8 - The contribution made by the Employer towards pension scheme as referred u/s 80CCD; 9 - Amount deemed to be income under rule 6 of Part-A of Fourth Schedule; 10 - Amount deemed to be income under rule 11(4) of Part-A of Fourth ~~Schedule ;~~ **Schedule;** 11 - Annuity or pension; 12 - Commuted Pension; 13 - Gratuity; 14 - Fees/ commission; 15 - Advance of salary; 16 - Leave Encashment; 17 - Contribution made by the central government towards Agnipath scheme as referred under section 80CCH; OTH - Others

</details>

