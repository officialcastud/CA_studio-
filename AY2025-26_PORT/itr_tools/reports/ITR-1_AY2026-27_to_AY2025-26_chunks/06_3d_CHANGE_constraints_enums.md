<!-- ITR-1: convert AY 2026-27 build -> AY 2025-26 -->
### 3d. CHANGE constraints / enums

- `FilingStatus.ItrFilingDueDate`
  - pattern: `2026-07-31` → `2025-07-31`
- `FilingStatus.ReturnFileSec`
  - description: 11 : 139(1)-On or before due date, 12 : 139(4)-After due date, 13 : 142(1), 14 : 148, 16 : 153C, 17 : 139(5)-Revised , 18 : 139(9), 20 : 119(2)(b)-After condonation of ~~delay~~ **delay, 21 : 139(8A)-Updated Return**
  - enum: **add [21]**
  - maximum: `20` → `21`
- `Form_ITR1.AssessmentYear`
  - pattern: `2026` → `2025`
- `ITR1_IncomeDeductions.AllwncExemptUs10.AllwncExemptUs10Dtls[].SalNatureDesc`
  - description: 10(5) - Sec 10(5)-Leave Travel concession/assistance; 10(6) - Sec 10(6)-Remuneration received as an official, by whatever name called, of an embassy, high commission etc.; 10(7) - Sec 10(7)-Allowances or perquisites paid or allowed as such outside India by the Government to a citizen of India for rendering service outside India; 10(10) - Sec 10(10)-Death-cum-retirement gratuity received ; 10(10A) - Sec 10(10A)-Commuted value of pension received; 10(10AA) - Sec 10(10AA)-Earned leave encashment on Retirement; 10(10B)(i) - Sec 10(10B)-First proviso - Compensation limit notified by CG in the Official Gazette; 10(10B)(ii) - Sec 10(10B)-Second proviso - Compensation under scheme approved by the Central Government; 10(10C) - Sec 10(10C)- Amount received/receivable on voluntary retirement or termination of service; 10(10CC) - Sec 10(10CC)-Tax paid by employer on non-monetary perquisite; 10(13A) - Sec 10(13A)-Allowance to meet expenditure incurred on house rent; 10(14)(i) - Sec 10(14)(i)- Prescribed Allowances or benefits (not in a nature of perquisite) specifically granted to meet expenses wholly, necessarily and exclusively and to the extent actually incurred, in performance of duties of office or employment; 10(14)(ii) - Sec 10(14)(ii) -Prescribed Allowances or benefits granted to meet personal expenses in performance of duties of office or employment or to compensate him for increased cost of living. ; 10(14)(i)(115BAC) - Sec 10(14)(i) -Allowances referred in sub-clauses (a) to (c) of sub-rule (1) in Rule 2BB ; 10(14)(ii)(115BAC) - Sec 10(14)(ii) -Transport allowance granted to certain physically handicapped assessee ; EIC - Exempt income received by a judge covered under the payment of salaries to Supreme Court/High Court judges Act /Rules ; ~~10(17):Sec 10(17)- Allowance MP/MLA/MLC~~ **OTH - Any Other**
  - enum: ~~remove ['10(17)']~~
  - enum: **add ['OTH']**
- `ITR1_IncomeDeductions.OthersInc.OthersIncDtlsOthSrc[].OthSrcNatureDesc`
  - description: SAV : Interest from Saving Account; IFD : Interest from Deposit(Bank/Post Office/Cooperative Society); TAX : Interest from Income Tax Refund; FAP : Family pension; DIV : Dividend; 10(11)(iP) : Interest accrued on contributions to provident fund to the extent taxable as per first proviso to section 10(11); 10(11)(iiP) : Interest accrued on contributions to provident fund to the extent taxable as per second proviso to section 10(11); 10(12)(iP) : Interest accrued on contributions to provident fund to the extent taxable as per first proviso to section 10(12); 10(12)(iiP) : Interest accrued on contributions to provident fund to the extent taxable as per second proviso to section 10(12); **NOT89A : Income from retirement benefit account maintained in a notified country u/s 89A ; OTHNOT89A : Income from retirement benefit account maintained in a country other than a country notified u/s 89A ;** OTH : Any Other
  - enum: **add ['NOT89A', 'OTHNOT89A']**
- `ITR1_TaxComputation.Rebate87A`
  - maximum: `60000` → `25000`
- `ScheduleTCS.TCS[].CollectedYr`
  - description: ~~2025: 2025-26;~~ 2024: 2024-25; 2023: 2023-24; 2022: 2022-23; 2021: 2021-22; 2020: 2020-21; 2019: 2019-20; 2018: 2018-19; 2017: 2017-18; 2016: 2016-17; 2015: 2015-16; 2014: 2014-15; 2013: 2013-14; 2012: 2012-13; 2011: 2011-12; 2010: 2010-11; 2009: 2009-10; 2008: 2008-09
  - enum: ~~remove ['2025']~~
- `ScheduleTDS3Dtls.TDS3Details[].DeductedYr`
  - description: ~~2025: 2025-26;~~ 2024:2024-25; 2023:2023-24; 2022:2022-23; 2021:2021-22; 2020:2020-21; 2019:2019-20; 2018:2018-19; 2017:2017-18;
  - enum: ~~remove ['2025']~~
- `TDSonOthThanSals.TDSonOthThanSal[].DeductedYr`
  - description: ~~2025: 2025-26;~~ 2024: 2024-25; 2023: 2023-24; 2022: 2022-23; 2021: 2021-22; 2020: 2020-21; 2019: 2019-20; 2018: 2018-19; 2017: 2017-18; 2016: 2016-17; 2015: 2015-16; 2014: 2014-15; 2013: 2013-14; 2012: 2012-13; 2011: 2011-12; 2010: 2010-11; 2009: 2009-10; 2008: 2008-09
  - enum: ~~remove ['2025']~~

<details><summary>3f. Description-only changes (3) — labels/help text</summary>

- `PersonalInfo.DOB`: Date of Birth of the Assessee format YYYY-MM-DD; maximum date allowed ~~2026-03-31~~ **2025-03-31**
- `PersonalInfo.EmployerCategory`: CGOV:Central Government, SGOV:State Government, PSU:Public Sector ~~Undertaking,~~ **Unit,** PE:Pensioners - Central Government, PESG:Pensioners - State Government, PEPS:Pensioners - Public sector undertaking, PEO:Pensioners - Others, OTH:Others, NA:Not Applicable
- `TaxPayments.TaxPayment[].DateDep`: Date of deposit should be on or after ~~2025-04-01~~ **2024-04-01** in YYYY-MM-DD format

</details>

