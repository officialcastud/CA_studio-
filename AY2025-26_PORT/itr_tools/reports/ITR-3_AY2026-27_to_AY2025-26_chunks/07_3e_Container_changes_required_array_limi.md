<!-- ITR-3: convert AY 2026-27 build -> AY 2025-26 -->
### 3e. Container changes (required / array limits)

- `ScheduleAMTC.ScheduleAMTCDtls`: maxItems `13` → `12`
- `ScheduleCGFor23.DeducClaimInfo`: required `True` → `False`
- `ScheduleCGFor23.LongTermCapGain23.NRIOnSec112and115.NRIOnSec112and115Dtls`: maxItems `3` → `2`
- `ScheduleCGFor23.LongTermCapGain23.Proviso112Applicable`: maxItems `2` → `1`

<details><summary>3f. Description-only changes (9) — labels/help text</summary>

- `CreationInfo.JSONCreationDate`: Date in format YYYY-MM-DD on or after ~~2026-04-01~~ **2025-04-01**
- `PartA_GEN1.FilingStatus.OrigRetFiledDate`: Enter Date of filing of Original return in format YYYY-MM-DD on or after ~~2026-04-01~~ **2025-04-01**
- `PartA_GEN1.PersonalInfo.DOB`: Date of Birth of the Assessee format YYYY-MM-DD; maximum date allowed ~~2026-03-31~~ **2025-03-31**
- `PartA_GEN2.AuditInfo.AuditDetails92E.DateOfAudit`: Date in format YYYY-MM-DD on or after ~~2026-04-01~~ **2025-04-01**
- `PartA_GEN2.AuditInfo.AuditDetails[].DateOfAudit`: Date in format YYYY-MM-DD on or after ~~2026-04-01~~ **2025-04-01**
- `PartA_GEN2.AuditInfo.AuditReportDetails[].DateOfAudit`: Date in format YYYY-MM-DD on or after ~~2026-04-01~~ **2025-04-01**
- `PartA_GEN2.AuditInfo.AuditReportFurnishDate`: Date in format YYYY-MM-DD on or after ~~2026-04-01~~ **2025-04-01**
- `ScheduleIT.TaxPayment[].DateDep`: Date in format YYYY-MM-DD on or after ~~2026-04-01~~ **2025-04-01**
- `ScheduleTPSA.DtlsTaxesPaid[].DateDep`: Date in format YYYY-MM-DD on or after ~~2025-04-01~~ **2024-04-01**

</details>

