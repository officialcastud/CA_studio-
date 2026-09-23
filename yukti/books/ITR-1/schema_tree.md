# The book of the ITR-1 JSON export tree — A.Y. 2026-27

The authoritative, complete leaf tree of the ITR-1 JSON, extracted from the CBDT
utility's VBA JSON-build routines (`vbaProject.bin`, decompiled) and
cross-checked against the prior functional builder's SKEL and the worksheet
formulas. Every leaf below is emitted by a named VBA `Function ...() As Object`
(a `Scripting.Dictionary`) that `ToJsonFormat()` (VBA line 32420) nests into the
final `ITR.ITR1` object. Nothing is invented; each leaf carries its VBA line or
sheet cell.

**Top-level assembly** (`ToJsonFormat`, lines 32428-32500):

```
ITR
└── ITR1
    ├── CreationInfo            Form01Header()          line 32428
    ├── Form_ITR1               Form_ITR1()             line 32429
    ├── PersonalInfo            PersonalInfo()          line 32431
    ├── FilingStatus            FilingStatus()          line 32433
    ├── PartA_139_8A     *      PartA_139_8A()          line 32436  (only if ReturnFileSec==21)
    ├── PartB-ATI        *      PartB_ATI()             line 32437  (only if ReturnFileSec==21)
    ├── ITR1_IncomeDeductions   IncomeDeductions()      line 32440
    ├── ITR1_TaxComputation     TaxComputation()        line 32442
    ├── LTCG112A                LTCG112A_New()          line 32444
    ├── TaxPaid                 TaxPaid()               line 32445
    ├── Refund                  Refund()                line 32446
    ├── Verification            Verification()          line 32447
    ├── Schedule80G      **     Schedule80G()           line 32451  (only if OLD regime, BacValue==2)
    ├── Schedule80GGA    **     Schedule80GGA()         line 32452
    ├── Schedule80GGC    **     Schedule80GGC()         line 32454
    ├── Schedule80D      **     Schedule80D()           line 32456
    ├── Schedule80DD     **     Schedule80DD_1()        line 32458
    ├── Schedule80U      **     Schedule80U_1()         line 32459
    ├── Schedule80E      **     Schedule80E()           line 32463
    ├── Schedule80EE     **     Schedule80EE()          line 32464
    ├── Schedule80EEA    **     Schedule80EEA()         line 32465
    ├── Schedule80EEB    **     Schedule80EEB()         line 32466
    ├── Schedule80C      **     Schedule80C()           line 32468
    ├── ScheduleEA10_13A ***    ScheduleEA10_13A()      line 32485  (OLD regime & EmployerCategory<>NA)
    ├── TDSonSalaries           TDSonSalaries()         line 32493
    ├── TDSonOthThanSals        TDSonOthThanSals()      line 32494
    ├── ScheduleTDS3Dtls        ScheduleTDS3Dtls()      line 32495
    ├── ScheduleTCS             ScheduleTCS()           line 32496
    ├── TaxPayments             TaxPayments()           line 32497
    └── TaxReturnPreparer       TaxReturnPreparer()     line 32498  (only if TRP id present)
```

`*`   emitted only for an updated return u/s 139(8A) (`ReturnFileSec == 21`).
`**`  the Chapter-VI-A detail schedules are built **only under the OLD regime**
(`Sheet5.BacValue == 2`, `OptOutNewTaxRegime=="Y"`) — under the new regime these
deductions are disallowed so their detail blocks are omitted entirely (VBA line
32449 `If (Sheet5.Range("BacValue").Value) = 2 Then`).
`***` HRA exemption schedule, OLD regime and a real employer only.

Legend for the leaf tables: **I** = INPUT (user-entered / read from an input
cell), **C** = COMPUTED (formula cell or utility-derived), **req** = schema
requires the key present (usually even at 0).

---

## 1 · CreationInfo  (`Form01Header`, lines 32505-32530)

| Leaf | Type | I/C | req | Source |
|---|---|---|---|---|
| CreationInfo.SWVersionNo | string | C | Y | getSWVersionNo |
| CreationInfo.SWCreatedBy | string | C | Y | getSWCreatedBy |
| CreationInfo.JSONCreatedBy | string | C | Y | getJSONCreatedBy |
| CreationInfo.JSONCreationDate | date | C | Y | Range("DateOfProcessing") |
| CreationInfo.IntermediaryCity | string | C | Y | getIntermediaryCity |
| CreationInfo.Digest | string | C | Y | literal "-" |

## 2 · Form_ITR1  (`Form_ITR1`, lines 32531-32549)

| Leaf | Type | I/C | req | Source |
|---|---|---|---|---|
| Form_ITR1.FormName | string | C | Y | getFormName |
| Form_ITR1.Description | string | C | Y | getFormDescription |
| Form_ITR1.AssessmentYear | string | C | Y | getAssessmentYear ("2026") |
| Form_ITR1.SchemaVer | string | C | Y | getSchemaVer |
| Form_ITR1.FormVer | string | C | Y | getFormVer |

## 3 · PersonalInfo  (`PersonalInfo`, lines 32869-33230)

| Leaf | Type | I/C | req | Source |
|---|---|---|---|---|
| PersonalInfo.AssesseeName.FirstName | string | I | N | firstName (Sheet1) |
| PersonalInfo.AssesseeName.MiddleName | string | I | N | middleName |
| PersonalInfo.AssesseeName.SurNameOrOrgName | string | I | Y | LastName |
| PersonalInfo.PAN | string | I | Y | PAN |
| PersonalInfo.Address.ResidenceNo | string | I | Y | Flat / sheet1.Flat |
| PersonalInfo.Address.ResidenceName | string | I | N | residenceName |
| PersonalInfo.Address.RoadOrStreet | string | I | N | sheet1.RoadOrStreet |
| PersonalInfo.Address.LocalityOrArea | string | I | Y | Area |
| PersonalInfo.Address.CityOrTownOrDistrict | string | I | Y | City |
| PersonalInfo.Address.StateCode | enum(StateCode) | I | Y | Mid(State,1,2) |
| PersonalInfo.Address.CountryCode | enum(CountryCode) | I | Y | sCountry (Mid before '-') |
| PersonalInfo.Address.PinCode | int | I | cond | sheet1.PinCode (if CountryCode 91) |
| PersonalInfo.Address.ZipCode | string | I | cond | zipCode (if foreign) |
| PersonalInfo.Address.CountryCodeMobile | int | I | Y | MobileCountryCode |
| PersonalInfo.Address.MobileNo | int | I | Y | mobileNo |
| PersonalInfo.Address.CountryCodeMobileNoSec | int | I | N | MobileCountryCode2 |
| PersonalInfo.Address.MobileNoSec | int | I | N | mobileNo2 |
| PersonalInfo.Address.EmailAddress | string | I | Y | Email |
| PersonalInfo.Address.EmailAddressSec | string | I | N | Email_1 |
| PersonalInfo.SecondaryAdd | enum(Y/N) | I | Y | Sheet1.Secondary_Address |
| PersonalInfo.AlternateAddress.ResidenceNo | string | I | cond | sheet1.ResidenceNo1 (when SecondaryAdd) |
| PersonalInfo.AlternateAddress.ResidenceName | string | I | N | sheet1.ResidenceName1 |
| PersonalInfo.AlternateAddress.RoadOrStreet | string | I | N | sheet1.RoadOrStreet1 |
| PersonalInfo.AlternateAddress.LocalityOrArea | string | I | cond | sheet1.LocalityOrArea1 |
| PersonalInfo.AlternateAddress.CityOrTownOrDistrict | string | I | cond | sheet1.CityOrTownOrDistrict1 |
| PersonalInfo.AlternateAddress.StateCode | enum(StateCode) | I | cond | sheet1.StateCode2 |
| PersonalInfo.AlternateAddress.CountryCode | enum | I | N | sheet1.Country1 |
| PersonalInfo.AlternateAddress.PinCode | int | I | cond | sheet1.PinCode1 |
| PersonalInfo.AlternateAddress.ZipCode | string | I | cond | sheet1.ZipCode1 |
| PersonalInfo.DOB | date | I | Y | sheet1.DOB (dd/mm/yyyy -> yyyy-mm-dd) |
| PersonalInfo.EmployerCategory | enum(EmployerCategory) | I | Y | empcat |
| PersonalInfo.AadhaarCardNo | string | I | N | Sheet1.Aadhaar |

Note: the utility also builds an `AssesseeRep` block under **FilingStatus** (not
PersonalInfo) — see §4.

## 4 · FilingStatus  (`FilingStatus`, lines 33232-33444)

| Leaf | Type | I/C | req | Source |
|---|---|---|---|---|
| FilingStatus.ReturnFileSec | int enum(ReturnFileSec) | I | Y | CDbl(ReturnFileSec) line 33297 |
| FilingStatus.SeventhProvisio139 | enum(Y/N) | I | N | ProvisoFlag |
| FilingStatus.OptOutNewTaxRegime | enum(Y/N) | I | Y | BacValue (2->Y, else N) line 33321 |
| FilingStatus.DepAmtAggAmtExcd1CrPrYrFlg | enum(Y/N) | I | N | DepositAmountFlag |
| FilingStatus.AmtSeventhProvisio139i | int | I | N | DepositAmount |
| FilingStatus.IncrExpAggAmt2LkTrvFrgnCntryFlg | enum(Y/N) | I | N | AggrigateAmountFlag |
| FilingStatus.AmtSeventhProvisio139ii | int | I | N | AggrigateAmount |
| FilingStatus.IncrExpAggAmt1LkElctrctyPrYrFlg | enum(Y/N) | I | N | AggrigateAmountFlag1 |
| FilingStatus.AmtSeventhProvisio139iii | int | I | N | AggrigateAmount1 |
| FilingStatus.NoticeNo | string | I | cond | sheet1.NoticeNo (ReturnFileSec 13/14/15/16/18/20) |
| FilingStatus.NoticeDateUnderSec | date | I | cond | sheet1.NoticeDate |
| FilingStatus.ReceiptNo | string | I | cond | sheet1.ReceiptNo (ReturnFileSec 17/18/21) |
| FilingStatus.OrigRetFiledDate | date | I | cond | sheet1.OrigRetFiledDate |
| FilingStatus.ItrFilingDueDate | date | C | Y | Due_DateITR1 (2026-07-31) |
| FilingStatus.clauseiv7provisio139i | enum(Y/N) | I | Y | clauseiv7provisio139iFlg |
| FilingStatus.clauseiv7provisio139iDtls[].clauseiv7provisio139iNature | enum(1/2) | I | cond | flags _3/_4 |
| FilingStatus.clauseiv7provisio139iDtls[].clauseiv7provisio139iAmount | int | I | cond | clauseiv7provisio139iAmount_3/_4 |
| FilingStatus.AsseseeRepFlg | enum(Y/N) | I | Y | sheet1.RepAssessee |
| FilingStatus.AssesseeRep.RepName | string | I | cond | sheet1.NameRepAssessee |
| FilingStatus.AssesseeRep.RepEmailID | string | I | cond | sheet1.EmailRepAssessee |
| FilingStatus.AssesseeRep.CountryCodeRepMobileNo | int | I | cond | sheet1.CountryCodeRepAssessee |
| FilingStatus.AssesseeRep.RepMobileNo | int | I | cond | sheet1.ContactRepAssessee |

## 5 · PartA_139_8A  *(updated return only, `PartA_139_8A`, lines 32550-32765)*

| Leaf | Type | I/C | req | Source |
|---|---|---|---|---|
| PartA_139_8A.AadhaarCardNo | string | I | N | U_AadhaarCardNo |
| PartA_139_8A.Name | string | I | N | U_Name |
| PartA_139_8A.PAN | string | I | N | U_PAN |
| PartA_139_8A.AssessmentYear | string | C | Y | literal "2025"* (see note) |
| PartA_139_8A.PreviouslyFiledForThisAY | enum | I | N | U_PreviouslyFiledForThisAY (Mid 1) |
| PartA_139_8A.PreviouslyFiledForThisAY_139_8A | enum(1/2) | I | N | U_PreviouslyFiledForThisAY_139_8A |
| PartA_139_8A.Applicable_139_8A.ITRForm | string | I | N | U_ITRForm |
| PartA_139_8A.Applicable_139_8A.AcknowledgementNo | string | I | N | U_AcknowledgementNo |
| PartA_139_8A.Applicable_139_8A.OrigRetFiledDate | date | I | N | U_OrigRetFiledDate |
| PartA_139_8A.LaidOutIn_139_8A | enum | I | N | U_LaidOutIn_139_8A (Mid 1) |
| PartA_139_8A.ITRFormUpdatingInc | string | C | Y | literal "ITR1" |
| PartA_139_8A.UpdatingInc.ReasonsForUpdatingIncDtls[].ReasonsForUpdatingIncome | enum(ReasonsForUpdatingIncome) | I | cond | U_ReasonsForUpdatingIncome |
| PartA_139_8A.UpdatedReturnDuringPeriod | enum(1-4) | I | N | U_UpdatedReturnDuringPeriod |
| PartA_139_8A.RetrntoRedCarriedFL.UnabsorbedDepreciation | enum | I | N | U_UnabsorbedDepreciation |
| PartA_139_8A.RetrntoRedCarriedFL.UDYear.UnabsorbedDepreciationYearDtls[].UnabsorbedDepreciationYear | int | I | cond | U_UnabsorbedDepreciationYear |
| ...UnabsorbedDepreciationYearDtls[].RevisedReturnFile | enum | I | cond | offset col 1 |
| ...UnabsorbedDepreciationYearDtls[].UpdatedReturnFile | enum | I | cond | offset col 16 |

\* The hard-coded `"2025"` at line 32578 is a utility bug/left-over; the true AY
is 2026. Flagged for the rebuild — emit "2026".

## 6 · PartB-ATI  *(updated return only, `PartB_ATI`, lines 32767-32867)*

| Leaf | Type | I/C | req | Source |
|---|---|---|---|---|
| PartB-ATI.HeadOfInc.Salaries | int | C | Y | U_Salaries |
| PartB-ATI.HeadOfInc.IncomeFromHP | int | C | Y | U_IncomeFromHP |
| PartB-ATI.HeadOfInc.IncomeFromOS | int | C | Y | U_IncomeFromOS |
| PartB-ATI.HeadOfInc.Total | int | C | Y | U_Total |
| PartB-ATI.LatestTotInc | int | I | Y | U_LatestTotInc |
| PartB-ATI.UpdatedTotInc | int | C | Y | U_UpdatedTotInc |
| PartB-ATI.AmtPayable | int | C | Y | U_AmtPayable |
| PartB-ATI.AmtRefundable | int | C | Y | U_AmtRefundable |
| PartB-ATI.LastAmtPayable | int | I | Y | U_LastAmtPayable |
| PartB-ATI.Refund | int | I | Y | U_Refund |
| PartB-ATI.TotRefund | int | C | Y | U_TotRefund |
| PartB-ATI.FeeIncUS234F | int | I | Y | U_FeeIncUS234F |
| PartB-ATI.RegAssessementTAX | int | I | Y | U_RegAssessementTAX |
| PartB-ATI.AggrLiabilityRefund | int | C | Y | U_AggrLiabilityRefund |
| PartB-ATI.AggrLiabilityNoRefund | int | C | Y | U_AggrLiabilityNoRefund |
| PartB-ATI.AddtnlIncTax | int | C | Y | U_AddtnlIncTax |
| PartB-ATI.NetPayable | int | C | Y | U_NetPayable |
| PartB-ATI.TaxUS140B | int | C | Y | U_TaxUS140B |
| PartB-ATI.TaxDue10_11 | int | C | Y | U_TaxDue10_11 |
| PartB-ATI.ScheduleIT1.TaxPayment1.ITTaxPayments[].{slno,BSRCode,DateDep,SrlNoOfChaln,Amt} | mixed | I | cond | U_BSRCode1 grid |
| PartB-ATI.ScheduleIT1.Total | int | C | cond | U_Total1 |
| PartB-ATI.ScheduleIT2.TaxPayment2.ITTaxPayments[].{slno,BSRCode,DateDep,SrlNoOfChaln,Amt} | mixed | I | cond | U_BSRCode2 grid |
| PartB-ATI.ScheduleIT2.Total | int | C | cond | U_Total2 |
| PartB-ATI.ReleifUS89 | int | I | Y | U_ReleifUS89 |

## 7 · ITR1_IncomeDeductions  (`IncomeDeductions`, lines 33448-35154)

### 7.1 Salary head

| Leaf | Type | I/C | req | Source |
|---|---|---|---|---|
| ITR1_IncomeDeductions.GrossSalary | int | I | Y | IncD.IncomeFromSal (0 default) |
| ITR1_IncomeDeductions.Salary | int | I | Y | IncD.Allowances |
| ITR1_IncomeDeductions.PerquisitesValue | int | I | Y | IncD.Perquisites |
| ITR1_IncomeDeductions.ProfitsInSalary | int | I | Y | IncD.Profits |
| ITR1_IncomeDeductions.NetSalary | int | C | Y | Net_salary |
| ITR1_IncomeDeductions.DeductionUs16 | int | C | Y | Deductions_16 |
| ITR1_IncomeDeductions.DeductionUs16ia | int | C | Y | IncD.Deduction16ia (std deduction) |
| ITR1_IncomeDeductions.EntertainmentAlw16ii | int | I | Y | IncD.Deduction16 |
| ITR1_IncomeDeductions.ProfessionalTaxUs16iii | int | I | Y | IncD.Deduction16ic |
| ITR1_IncomeDeductions.IncomeFromSal | int | C | Y | IncD.TotalHeadSalaries |

### 7.2 Allowances exempt u/s 10  (only if any allowance or HRA > 0)

| Leaf | Type | I/C | req | Source |
|---|---|---|---|---|
| ...AllwncExemptUs10.AllwncExemptUs10Dtls[].SalNatureDesc | enum(AllwncExemptUs10_SalNatureDesc) | I | cond | Others_NOI4 (+HRA -> 10(13A)) |
| ...AllwncExemptUs10.AllwncExemptUs10Dtls[].SalOthAmount | int | I | cond | Others_Amt3 / Sheet1.HRA |
| ...AllwncExemptUs10.TotalAllwncExemptUs10 | int | C | cond | Less_allowance |

### 7.3 House property  (`PropertyDetails[]`, repeating; lines 33819-34192)

| Leaf | Type | I/C | req | Source |
|---|---|---|---|---|
| ...PropertyDetails[].HPSNo | int | C | Y | row index |
| ...PropertyDetails[].AddressDetailWithZipCode.AddrDetail | string | I | Y | AddrDetail_HP |
| ...AddressDetailWithZipCode.CityOrTownOrDistrict | string | I | Y | CityOrTownOrDistrict_HP |
| ...AddressDetailWithZipCode.StateCode | enum(StateCode) | I | N | StateCode_HP |
| ...AddressDetailWithZipCode.CountryCode | enum | I | N | CountryCode_HP |
| ...AddressDetailWithZipCode.PinCode | int | I | cond | PinCode_HP (CountryCode 91) |
| ...AddressDetailWithZipCode.ZipCode | string | I | cond | ZipCode_HP (foreign) |
| ...PropertyDetails[].PropertyOwner | enum(PropertyOwner) | I | Y | OwnerProperty_HP |
| ...PropertyDetails[].PropertyOwnerOther | string | I | N | OwnerPropertyDescription_HP |
| ...PropertyDetails[].PropCoOwnedFlg | enum(YES/NO) | I | Y | CoOwnedYN_HP |
| ...PropertyDetails[].AsseseeShareProperty | int | I | Y | CoOwnedShare_HP (default 100) |
| ...PropertyDetails[].CoOwners[].CoOwnersSNo | int | C | cond | index |
| ...PropertyDetails[].CoOwners[].NameCoOwner | string | I | cond | CoName_HP |
| ...PropertyDetails[].CoOwners[].PAN_CoOwner | string | I | cond | CoPAN_HP |
| ...PropertyDetails[].CoOwners[].Aadhaar_CoOwner | string | I | cond | CoAadhar_HP |
| ...PropertyDetails[].CoOwners[].PercentShareProperty | number | I | cond | CoShare_HP |
| ...PropertyDetails[].ifLetOut | enum(ifLetOut) | I | Y | ifLetOut_HP |
| ...PropertyDetails[].TenantDetails[].TenantSNo | int | C | cond | index |
| ...PropertyDetails[].TenantDetails[].NameofTenant | string | I | cond | NameofTenant_HP |
| ...PropertyDetails[].TenantDetails[].PANofTenant | string | I | cond | PANofTenant_HP |
| ...PropertyDetails[].TenantDetails[].AadhaarofTenant | string | I | cond | AadharofTenant_HP |
| ...PropertyDetails[].TenantDetails[].PANTANofTenant | string | I | cond | TANofTenant_HP |
| ...PropertyDetails[].Rentdetails.AnnualLetableValue | int | I | Y | AnnualLetableValue_HP |
| ...PropertyDetails[].Rentdetails.RentNotRealized | int | I | Y | RentNotRealized_HP |
| ...PropertyDetails[].Rentdetails.LocalTaxes | int | I | Y | LocalTaxes_HP |
| ...PropertyDetails[].Rentdetails.TotalUnrealizedAndTax | int | C | Y | TotalUnrealizedAndTax_HP |
| ...PropertyDetails[].Rentdetails.BalanceALV | int | C | Y | BalanceALV_HP |
| ...PropertyDetails[].Rentdetails.AnnualOfPropOwned | int | C | Y | IncomeOfHPInOwnHand_HP |
| ...PropertyDetails[].Rentdetails.ThirtyPercentOfBalance | int | C | Y | ThirtyPercentOfBalance_HP |
| ...PropertyDetails[].Rentdetails.IntOnBorwCap | int | I | Y | IntOnBorwCap_HP |
| ...Rentdetails.Section24B.Section24BDtls[].LoanTknFrom | enum(LoanTknFrom) | I | cond | LoanfrmBankOrInstitute.24b |
| ...Rentdetails.Section24B.Section24BDtls[].BankOrInstnName | string | I | cond | bankName.24b |
| ...Rentdetails.Section24B.Section24BDtls[].LoanAccNoOfBankOrInstnRefNo | string | I | cond | loanAccNum.24b |
| ...Rentdetails.Section24B.Section24BDtls[].DateofLoan | date | I | cond | loanDate.24b |
| ...Rentdetails.Section24B.Section24BDtls[].TotalLoanAmt | int | I | cond | loanAmt.24b |
| ...Rentdetails.Section24B.Section24BDtls[].LoanOutstndngAmt | int | I | cond | loanOutstanding.24b |
| ...Rentdetails.Section24B.Section24BDtls[].InterestUs24B | int | I | cond | Intrst.24b |
| ...Rentdetails.Section24B.TotalInterestUs24B | int | C | cond | TotAmt.24b |
| ...PropertyDetails[].Rentdetails.TotalDeduct | int | C | Y | TotalDeduct_HP |
| ...PropertyDetails[].Rentdetails.ArrearsUnrealizedRentRcvd | int | I | N | HP.RentOfEarlierYrSec_AandAA |
| ...PropertyDetails[].Rentdetails.IncomeOfHP | int | C | Y | IncomeOfHP_HP |
| ITR1_IncomeDeductions.TotalIncomeChargeableUnHP | int | C | Y | TotalIncomeChargeableUnHP_HP |

### 7.4 Income from other sources  (`OthersInc`, lines 34203-34365)

| Leaf | Type | I/C | req | Source |
|---|---|---|---|---|
| ITR1_IncomeDeductions.IncomeOthSrc | int | C | Y | IncomeFromOS |
| ...OthersInc.OthersIncDtlsOthSrc[].OthSrcNatureDesc | enum(OthersInc_OthSrcNatureDesc) | I | cond | Others_NOI2 |
| ...OthersInc.OthersIncDtlsOthSrc[].OthSrcOthNatOfInc | string | I | N | Others_NOI3 |
| ...OthersInc.OthersIncDtlsOthSrc[].OthSrcOthAmount | int | I | cond | Others_Amt2 |
| ...OthersIncDtlsOthSrc[] (DIV row).DividendInc.DateRange.Upto15Of6 | int | I | cond | IncD_q1div |
| ...DividendInc.DateRange.Upto15Of9 | int | I | cond | IncD_q2div |
| ...DividendInc.DateRange.Up16Of9To15Of12 | int | I | cond | IncD_q3div |
| ...DividendInc.DateRange.Up16Of12To15Of3 | int | I | cond | IncD_q4div |
| ...DividendInc.DateRange.Up16Of3To31Of3 | int | I | cond | IncD_q5div |
| ITR1_IncomeDeductions.DeductionUs57iia | int | I | Y | IncD.LessDeduction57 (family pension) |

### 7.5 Gross total income

| Leaf | Type | I/C | req | Source |
|---|---|---|---|---|
| ITR1_IncomeDeductions.GrossTotIncome | int | C | Y | GrossTotIncome |
| ITR1_IncomeDeductions.GrossTotIncomeIncLTCG112A | int | C | Y | GrossTotIncomeIncLTCG112A |

### 7.6 Chapter VI-A — user-entered (`UsrDeductUndChapVIA`, lines 34393-34777)

All are INPUT ints, required, default 0. Source `IncD.SectionXX`.

`Section80C, Section80CCC, Section80CCDEmployeeOrSE, Section80CCD1B,
Section80CCDEmployer, Section80D, Section80DD, Section80DDB, Section80E,
Section80EE, Section80EEA, Section80EEB, Section80G, Section80GG, Section80GGA,
Section80GGC, Section80U, Section80TTA, Section80TTB, AnyOthSec80CCH,
TotalChapVIADeductions`

Plus nested / conditional under `UsrDeductUndChapVIA`:

| Leaf | Type | I/C | req | Source |
|---|---|---|---|---|
| ...PensionContribution80CCC[].TypeofIdentifier | enum(PRAN/OTHPRAN) | I | cond | Type_80CCC (if 80CCC>0) |
| ...PensionContribution80CCC[].NameofIdentifier | string | I | cond | Name_80CCC |
| ...PensionContribution80CCC[].Amount | number | I | cond | Amount_80CCC |
| ...PRANDtls[].PRANNum | string | I | cond | pran_new (if 80CCD_SE>0 or 80CCD1B_SE>0) |
| ...NameOfSpecDisease80DDB | enum(NameOfSpecDisease80DDB) | I | N | Sheet1.Specified_Disease |
| ...Section80DDBUsrType | enum | I | N | SELECT80DDS |
| ...Form10BAAckNum | string | I | N | Sheet1.AckNum (80GG) |

### 7.7 Chapter VI-A — computed/allowed (`DeductUndChapVIA`, lines 34779-34912)

Same 20 section keys as 7.6 (COMPUTED, `IncD.SectionXX_Calc`), all required,
default 0. These are the utility-capped *allowed* amounts (the caps.md logic).
Includes `Section80EEA`, `Section80EEB`, `AnyOthSec80CCH`,
`TotalChapVIADeductions`.

### 7.8 Total income

| Leaf | Type | I/C | req | Source |
|---|---|---|---|---|
| ITR1_IncomeDeductions.TotalIncome | int | C | Y | IncD.TotalIncome_New |

### 7.9 Exempt income  (`ExemptIncAgriOthUs10`, lines 35108-35150)

| Leaf | Type | I/C | req | Source |
|---|---|---|---|---|
| ...ExemptIncAgriOthUs10.ExemptIncAgriOthUs10Dtls[].Category | enum(ExemptIncAgriOthUs10_Category) | I | cond | Others_NOI |
| ...ExemptIncAgriOthUs10Dtls[].SubCategory | enum(ExemptIncAgriOthUs10_SubCategory) | I | cond | Others_NOI1 |
| ...ExemptIncAgriOthUs10Dtls[].Description | string | I | cond | Others_NOI22 (only circular/notification/receipt sub-cats) |
| ...ExemptIncAgriOthUs10Dtls[].OthAmount | int | I | cond | Others_Amt |
| ...ExemptIncAgriOthUs10.ExemptIncAgriOthUs10Total | int | C | cond | ExemptIncomeTotal |

## 8 · ITR1_TaxComputation  (`TaxComputation`, lines 35216-35329)

| Leaf | Type | I/C | req | Source |
|---|---|---|---|---|
| ITR1_TaxComputation.TotalTaxPayable | int | C | Y | TotalTaxPayable (slab) |
| ITR1_TaxComputation.Rebate87A | int | C | Y | IncD.Rebate87A (AO177 formula) |
| ITR1_TaxComputation.TaxPayableOnRebate | int | C | Y | IncD.TaxPayableOnRebate (AO178) |
| ITR1_TaxComputation.EducationCess | int | C | Y | IncD.EducationCess (4%) |
| ITR1_TaxComputation.GrossTaxLiability | int | C | Y | IncD.GrossTaxLiability |
| ITR1_TaxComputation.Section89 | int | I | Y | IncD.Section89 |
| ITR1_TaxComputation.NetTaxLiability | int | C | Y | IncD.NetTaxLiability |
| ITR1_TaxComputation.TotalIntrstPay | int | C | Y | IncD.TotalIntrstPay |
| ITR1_TaxComputation.IntrstPay.IntrstPayUs234A | int | C | Y | IncD.IntrstPayUs234A |
| ITR1_TaxComputation.IntrstPay.IntrstPayUs234B | int | C | Y | IncD.IntrstPayUs234B |
| ITR1_TaxComputation.IntrstPay.IntrstPayUs234C | int | C | Y | IncD.IntrstPayUs234C |
| ITR1_TaxComputation.IntrstPay.LateFilingFee234F | int | C | Y | IncD.IntrstPayUs234F |
| ITR1_TaxComputation.IntrstPay.FeeFurnish234I | int | C | Y | IncD.Section234I (V0.4) |
| ITR1_TaxComputation.TotTaxPlusIntrstPay | int | C | Y | IncD.TotTaxPlusIntrstPay |

## 9 · LTCG112A  (`LTCG112A_New`, lines 35330-35362)

| Leaf | Type | I/C | req | Source |
|---|---|---|---|---|
| LTCG112A.TotSaleCnsdrn | int | I | Y | IncD.Sale_LTCG |
| LTCG112A.TotCstAcqisn | int | I | Y | IncD.Cost_LTCG |
| LTCG112A.LongCap112A | int | C | Y | IncD.CG_LTCG |

## 10 · TaxPaid  (`TaxPaid`, lines 37443-37498)

| Leaf | Type | I/C | req | Source |
|---|---|---|---|---|
| TaxPaid.TaxesPaid.AdvanceTax | int | C | Y | IncD.AdvanceTax |
| TaxPaid.TaxesPaid.TDS | int | C | Y | IncD.TDS |
| TaxPaid.TaxesPaid.TCS | int | C | Y | IncD.TCS |
| TaxPaid.TaxesPaid.SelfAssessmentTax | int | C | Y | IncD.SelfAssessmentTax |
| TaxPaid.TaxesPaid.TotalTaxesPaid | int | C | Y | IncD.TotalTaxesPaid |
| TaxPaid.BalTaxPayable | int | C | Y | IncD.BalTaxPayable |

## 11 · Refund  (`Refund`, lines 37499-37606)

| Leaf | Type | I/C | req | Source |
|---|---|---|---|---|
| Refund.RefundDue | int | C | Y | IncD.RefundDue |
| Refund.BankAccountDtls.AddtnlBankDetails[].IFSCCode | string | I | cond | BankIFSC_BA |
| Refund.BankAccountDtls.AddtnlBankDetails[].BankName | string | I | cond | BankName_BA |
| Refund.BankAccountDtls.AddtnlBankDetails[].BankAccountNo | string | I | cond | BankAccntnum_BA |
| Refund.BankAccountDtls.AddtnlBankDetails[].AccountType | enum(AccountType) | I | cond | SchBA.AcntType |
| Refund.BankAccountDtls.AddtnlBankDetails[].UseForRefund | bool(true/false) | I | cond | tempxml |

## 12 · Verification  (`Verification`, lines 35155-35182)

| Leaf | Type | I/C | req | Source |
|---|---|---|---|---|
| Verification.Declaration.AssesseeVerName | string | I | Y | Ver.AssesseeVerName |
| Verification.Declaration.FatherName | string | I | Y | Ver.FatherName |
| Verification.Declaration.AssesseeVerPAN | string | I | Y | Ver.PAN |
| Verification.Capacity | enum(S/R) | I | Y | Ver.capacity (Mid 1) |
| Verification.Place | string | I | Y | Ver.Place |

## 13 · TaxReturnPreparer  *(only if TRP id present, lines 35183-35215)*

| Leaf | Type | I/C | req | Source |
|---|---|---|---|---|
| TaxReturnPreparer.IdentificationNoOfTRP | string | I | cond | Sheet2.IdentificationNoOfTRP |
| TaxReturnPreparer.NameOfTRP | string | I | cond | Sheet2.NameOfTRP |
| TaxReturnPreparer.ReImbFrmGov | int | I | cond | Sheet2.ReImbFrmGov |

## 14 · TDSonSalaries  (`TDSonSalaries`, lines 35363-35412)

| Leaf | Type | I/C | req | Source |
|---|---|---|---|---|
| TDSonSalaries.TDSonSalary[].EmployerOrDeductorOrCollectDetl.TAN | string | I | cond | TAN_TDS |
| ...EmployerOrDeductorOrCollectDetl.EmployerOrDeductorOrCollecterName | string | I | cond | TsEmpName |
| TDSonSalaries.TDSonSalary[].IncChrgSal | int | I | cond | Tot_chrg |
| TDSonSalaries.TDSonSalary[].TotalTDSSal | int | I | cond | Amount4_I |
| TDSonSalaries.TotalTDSonSalaries | int | C | Y | TDSal.Sum |

## 15 · TDSonOthThanSals  (`TDSonOthThanSals`, lines 35413-35758)

| Leaf | Type | I/C | req | Source |
|---|---|---|---|---|
| TDSonOthThanSals.TDSonOthThanSal[].EmployerOrDeductorOrCollectDetl.TAN | string | I | cond | Tan2_TDS |
| ...EmployerOrDeductorOrCollectDetl.EmployerOrDeductorOrCollecterName | string | I | cond | DeductName2_TDS |
| TDSonOthThanSals.TDSonOthThanSal[].AmtForTaxDeduct | int | I | cond | TaxDeducted_TDS |
| TDSonOthThanSals.TDSonOthThanSal[].TDSSection | enum(TDSSection) | I | cond | Section_TDS2 |
| TDSonOthThanSals.TDSonOthThanSal[].DeductedYr | enum(year) | I | cond | Year2_TDS |
| TDSonOthThanSals.TDSonOthThanSal[].TotTDSOnAmtPaid | int | I | cond | TDSoth.TotTDSOnAmtPaid |
| TDSonOthThanSals.TDSonOthThanSal[].ClaimOutOfTotTDSOnAmtPaid | int | I | cond | TDSoth.6income |
| TDSonOthThanSals.TotalTDSonOthThanSals | int | C | Y | TDSoth.Sum |

## 16 · ScheduleTDS3Dtls  (TDS on 26QB rent, `ScheduleTDS3Dtls`, lines 35759-36080)

| Leaf | Type | I/C | req | Source |
|---|---|---|---|---|
| ScheduleTDS3Dtls.TDS3Details[].PANofTenant | string | I | cond | PAN_TDS |
| ScheduleTDS3Dtls.TDS3Details[].AadhaarofTenant | string | I | cond | Tenant_Aadhar_TDS |
| ScheduleTDS3Dtls.TDS3Details[].NameOfTenant | string | I | cond | DeductName2_TDS3 |
| ScheduleTDS3Dtls.TDS3Details[].TDSSection | enum(TDSSection) | I | cond | Section_TDS3 |
| ScheduleTDS3Dtls.TDS3Details[].DeductedYr | enum(year) | I | cond | Year2_TDS3 |
| ScheduleTDS3Dtls.TDS3Details[].TDSDeducted | int | I | cond | TDS26QB.TotTDSOnAmtPaid |
| ScheduleTDS3Dtls.TDS3Details[].TDSClaimed | int | I | cond | TDS26QB.6income |
| ScheduleTDS3Dtls.TotalTDS3Details | int | C | Y | TDS26QB.Sum |

## 17 · ScheduleTCS  (`ScheduleTCS`, lines 36767-36870)

| Leaf | Type | I/C | req | Source |
|---|---|---|---|---|
| ScheduleTCS.TCS[].EmployerOrDeductorOrCollectDetl.TAN | string | I | cond | TAN_TCS |
| ...EmployerOrDeductorOrCollectDetl.EmployerOrDeductorOrCollecterName | string | I | cond | EmployerOrDeductorOrCollecterName_TCS |
| ScheduleTCS.TCS[].AmtTaxCollected | int | I | cond | AmtTaxCollected_TCS |
| ScheduleTCS.TCS[].CollectedYr | enum(year) | I | cond | Year2_TCS |
| ScheduleTCS.TCS[].TotalTCS | int | I | cond | BroughtFwdTCSAmt_TCS |
| ScheduleTCS.TCS[].AmtTCSClaimedThisYear | int | I | cond | AmtClaimedOnOwnHands_TCS |
| ScheduleTCS.TotalSchTCS | int | C | Y | TCS.Sum |

## 18 · TaxPayments  (advance / self-assessment challans, `TaxPayments`, lines 36081-36127)

| Leaf | Type | I/C | req | Source |
|---|---|---|---|---|
| TaxPayments.TaxPayment[].BSRCode | string | I | cond | BSR_TDS |
| TaxPayments.TaxPayment[].DateDep | date | I | cond | DateCredit_TDS |
| TaxPayments.TaxPayment[].SrlNoOfChaln | int | I | cond | SerialNum_TDS |
| TaxPayments.TaxPayment[].Amt | int | I | cond | TaxPaid3_TDS |
| TaxPayments.TotalTaxPayments | int | C | Y | TaxP.Sum |

## 19 · Chapter-VI-A detail schedules  *(OLD regime only)*

### 19.1 Schedule80C  (`Schedule80C`, lines 38943-39013)

| Leaf | Type | I/C | req | Source |
|---|---|---|---|---|
| Schedule80C.Schedule80CDtls[].Amount | int | I | cond | Amount.80C |
| Schedule80C.Schedule80CDtls[].IdentificationNo | string | I | cond | Identification_Number.80C |
| Schedule80C.TotalAmt | int | C | Y | TotAmount.80C |

### 19.2 Schedule80D  (`Schedule80D`, lines 37018-37442) — 4 insurer sub-blocks

| Leaf | Type | I/C | req | Source |
|---|---|---|---|---|
| Schedule80D.Sec80DSelfFamSrCtznHealth.SeniorCitizenFlag | enum(Y/N/S) | I | Y | DropDown_ValueOf_FamilyM_80D |
| ...SelfAndFamily | int | I | Y | Self_And_Family_80D |
| ...HealthInsPremSlfFam | int | I | Y | Health_Insurance_80D |
| ...Sec80DSelfFamHIDtls.Sch80DInsDtls[].{InsurerName,PolicyNo,HealthInsAmt} | mixed | I | cond | NameInsurerA1/PolicyNumA1/AmtA1.80D |
| ...Sec80DSelfFamHIDtls.TotalPayments | int | C | cond | TotAmtA1.80D |
| ...PrevHlthChckUpSlfFam | int | I | Y | Preventive_Health_80D |
| ...SelfAndFamilySeniorCitizen | int | I | Y | Senior_Citizen_80D |
| ...HlthInsPremSlfFamSrCtzn | int | I | Y | Health_InsuranceSC_80D |
| ...Sec80DSelfFamSrCtznHIDtls.Sch80DInsDtls[].{InsurerName,PolicyNo,HealthInsAmt} | mixed | I | cond | ...B1.80D |
| ...Sec80DSelfFamSrCtznHIDtls.TotalPayments | int | C | cond | TotAmtB1.80D |
| ...PrevHlthChckUpSlfFamSrCtzn | int | I | Y | Preventive_Health_SC_80D |
| ...MedicalExpSlfFamSrCtzn | int | I | Y | Medical_Expenditure_SC_80D |
| ...ParentsSeniorCitizenFlag | enum(Y/N/P) | I | cond | DropDown_ValueOf_SC_80D (not HUF) |
| ...Parents | int | I | cond | Parents_80D |
| ...HlthInsPremParents | int | I | cond | Health_Insurance2_80D |
| ...Sec80DParentsHIDtls.Sch80DInsDtls[]/TotalPayments | mixed | I | cond | ...A2.80D |
| ...PrevHlthChckUpParents | int | I | cond | Preventive_Health2_80D |
| ...ParentsSeniorCitizen | int | I | cond | Parents_SC_80D |
| ...HlthInsPremParentsSrCtzn | int | I | cond | Health_Insurance3_80D |
| ...Sec80DParentsSrCtznHIDtls.Sch80DInsDtls[]/TotalPayments | mixed | I | cond | ...B2.80D |
| ...PrevHlthChckUpParentsSrCtzn | int | I | cond | Preventive_Health3_80D |
| ...MedicalExpParentsSrCtzn | int | I | cond | Medical_Expenditure2_80D |
| ...EligibleAmountOfDedn | int | C | Y | Eligible_Amount_80D |

### 19.3 Schedule80DD  (`Schedule80DD_1`, lines 38326-38480)

| Leaf | Type | I/C | req | Source |
|---|---|---|---|---|
| Schedule80DD.NatureOfDisability | enum(1/2) | I | cond | Naturedisability_80DD |
| Schedule80DD.TypeOfDisability | enum(1/2) | I | cond | Disability_80DD |
| Schedule80DD.DeductionAmount | int | C | Y | Amtdeduction_80DD |
| Schedule80DD.DependentType | enum(DependentType_80DD) | I | cond | Typedependent_80DD |
| Schedule80DD.DependentPan | string | I | cond | PANdependent_80DD |
| Schedule80DD.DependentAadhaar | string | I | cond | Aadhaardependent_80DD |
| Schedule80DD.Form10IAAckNum | string | I | cond | AckNoFm10IAfiled_80DD |
| Schedule80DD.UDIDNum | string | I | cond | UDIDNum_80DD |

### 19.4 Schedule80U  (`Schedule80U_1`, lines 38190-38325)

| Leaf | Type | I/C | req | Source |
|---|---|---|---|---|
| Schedule80U.NatureOfDisability | enum(1/2) | I | cond | Naturedisability_80U |
| Schedule80U.TypeOfDisability | enum(1/2) | I | cond | Disability_80U |
| Schedule80U.DeductionAmount | int | C | Y | Amtdeduction_80U |
| Schedule80U.Form10IAAckNum | string | I | cond | AckNoFm10IAfiled_80U |
| Schedule80U.UDIDNum | string | I | cond | UDIDNum_80U |

### 19.5 Schedule80E / 80EE / 80EEA / 80EEB  (loan tables, lines 38484-38939)

Common repeating leaf shape `ScheduleXXDtls[]`:
`LoanTknFrom` enum(B/I), `BankOrInstnName` str, `LoanAccNoOfBankOrInstnRefNo`
str, `DateofLoan` date, `TotalLoanAmt` int, `LoanOutstndngAmt` int, and the
interest leaf named per section: **Interest80E / Interest80EE / Interest80EEA /
Interest80EEB** (int). Section totals `TotalInterest80E/80EE/80EEA/80EEB`
(COMPUTED, req). 80EEA also carries `PropStmpDtyVal` (int, gate >0). 80EEB also
carries `VehicleRegNo` (string) per row.

| Schedule | array | interest leaf | total leaf | extra |
|---|---|---|---|---|
| Schedule80E | Schedule80EDtls | Interest80E | TotalInterest80E | — |
| Schedule80EE | Schedule80EEDtls | Interest80EE | TotalInterest80EE | — |
| Schedule80EEA | Schedule80EEADtls | Interest80EEA | TotalInterest80EEA | PropStmpDtyVal |
| Schedule80EEB | Schedule80EEBDtls | Interest80EEB | TotalInterest80EEB | VehicleRegNo |

### 19.6 Schedule80G  (`Schedule80G`, lines 36131-36623) — four donee buckets

Each bucket (`Don100Percent`, `Don50PercentNoApprReqd`, `Don100PercentApprReqd`,
`Don50PercentApprReqd`) holds `DoneeWithPan[]` rows plus four total leaves.
Row shape:

| Leaf | Type | I/C | req | Source |
|---|---|---|---|---|
| ...DoneeWithPan[].DoneeWithPanName | string | I | cond | NameX_80GA/B/C/D |
| ...DoneeWithPan[].DoneePAN | string | I | cond | PanX |
| ...DoneeWithPan[].AddressDetail.AddrDetail | string | I | cond | AddrX |
| ...DoneeWithPan[].AddressDetail.CityOrTownOrDistrict | string | I | cond | CityX |
| ...DoneeWithPan[].AddressDetail.StateCode | enum(StateCode) | I | cond | StateX (Mid 2) |
| ...DoneeWithPan[].AddressDetail.PinCode | int | I | cond | PinCdX |
| ...DoneeWithPan[].DonationAmtCash | int | I | Y | DonationAmtX |
| ...DoneeWithPan[].DonationAmtOtherMode | int | I | Y | DonationAmtX1 |
| ...DoneeWithPan[].TransactionRefNum | string | I | N | TransactionX (V0.5) |
| ...DoneeWithPan[].IFSCCode | string | I | N | IFSC_80GX |
| ...DoneeWithPan[].DonationAmt | int | C | Y | DonationAmtTotal |
| ...DoneeWithPan[].EligibleDonationAmt | int | C | Y | EligibleAmt |
| ...DoneeWithPan[].ArnNbr | string | I | cond | Per5080G.ArnNbr (Don50PercentApprReqd only) |

Bucket totals (each bucket, COMPUTED): `TotDon{...}Cash`,
`TotDon{...}OtherMode`, `TotDon{...}`, `TotEligibleDon{...}`. Schedule totals
(COMPUTED, req): `TotalDonationsUs80GCash`, `TotalDonationsUs80GOtherMode`,
`TotalDonationsUs80G`, `TotalEligibleDonationsUs80G`.

### 19.7 Schedule80GGA  (`Schedule80GGA`, lines 36625-36766)

| Leaf | Type | I/C | req | Source |
|---|---|---|---|---|
| ...DonationDtlsSciRsrchRuralDev[].RelevantClauseUndrDedClaimed | enum(80GGA...) | I | cond | RelevantClauseClaimed_80GGA |
| ...DonationDtlsSciRsrchRuralDev[].NameOfDonee | string | I | cond | Name_of_Donee_80GGA |
| ...DonationDtlsSciRsrchRuralDev[].AddressDetail.{AddrDetail,CityOrTownOrDistrict,StateCode,PinCode} | mixed | I | cond | ..._80GGA |
| ...DonationDtlsSciRsrchRuralDev[].DoneePAN | string | I | cond | PAN_of_donee_80GGA |
| ...DonationDtlsSciRsrchRuralDev[].DonationAmtCash | int | I | Y | Donation_cash_80GGA |
| ...DonationDtlsSciRsrchRuralDev[].DonationAmtOtherMode | int | I | Y | Donation_other_80GGA |
| ...DonationDtlsSciRsrchRuralDev[].DonationAmt | int | C | Y | Donation_total_80GGA |
| ...DonationDtlsSciRsrchRuralDev[].EligibleDonationAmt | int | C | Y | Donation_Eligible_80GGA |
| Schedule80GGA.TotalDonationAmtCash80GGA | int | C | Y | Total_DonationInCash_80GGA |
| Schedule80GGA.TotalDonationAmtOtherMode80GGA | int | C | Y | Total_DonationInOtherMode_80GGA |
| Schedule80GGA.TotalDonationsUs80GGA | int | C | Y | Total_Donation_80GGA |
| Schedule80GGA.TotalEligibleDonationAmt80GGA | int | C | Y | Total_Donation_Eligible_80GGA |

### 19.8 Schedule80GGC  (`Schedule80GGC`, lines 38051-38188)

| Leaf | Type | I/C | req | Source |
|---|---|---|---|---|
| ...Schedule80GGCDetails[].DonationDate | date | I | cond | DateofDonation_80GGC |
| ...Schedule80GGCDetails[].DonationAmtCash | int | I | Y | Donation_cash_80GGC |
| ...Schedule80GGCDetails[].DonationAmtOtherMode | int | I | Y | Donation_other_80GGC |
| ...Schedule80GGCDetails[].IFSCCode | string | I | cond | BankIFSC_80GGC |
| ...Schedule80GGCDetails[].TransactionRefNum | string | I | cond | ChequeNumber_80GGC |
| ...Schedule80GGCDetails[].DonationAmt | int | C | Y | TotalDonation_80GGC |
| ...Schedule80GGCDetails[].EligibleDonationAmt | int | C | Y | EligibleAmountofDonation_80GGC |
| ...Schedule80GGCDetails[].PoliticalPartyName | string | I | cond | Name_80GGC (V0.6) |
| ...Schedule80GGCDetails[].PoliticalPartyPAN | string | I | cond | PAN_80GGC |
| Schedule80GGC.TotalDonationAmtCash80GGC | int | C | Y | Total_DonationInCash_80GGC |
| Schedule80GGC.TotalDonationAmtOtherMode80GGC | int | C | Y | Total_DonationInOtherMode_80GGC |
| Schedule80GGC.TotalDonationsUs80GGC | int | C | Y | Total_Donation_80GGC |
| Schedule80GGC.TotalEligibleDonationAmt80GGC | int | C | Y | Total_Donation_Eligible_80GGC |

### 19.9 ScheduleEA10_13A  (HRA exemption, `ScheduleEA10_13A`, lines 39195-39277)

| Leaf | Type | I/C | req | Source |
|---|---|---|---|---|
| ScheduleEA10_13A.Placeofwork | enum(1/2) | I | cond | Sch10of13A_PlaceofWrk |
| ScheduleEA10_13A.ActlHRARecv | int | I | Y | Sch10of13A_ActlHRArecivedA |
| ScheduleEA10_13A.ActlRentPaid | int | I | Y | Sch10of13A_ActlRentpaid |
| ScheduleEA10_13A.DtlsSalUsSec171 | int | I | Y | Sch10of13A_DetlsofSalpersec17of1 |
| ScheduleEA10_13A.BasicSalary | int | I | Y | Sch10of13A_BasicSalary |
| ScheduleEA10_13A.DearnessAllwnc | int | I | Y | Sch10of13A_DearAllowance |
| ScheduleEA10_13A.ActlRentPaid10Per | int | C | Y | Sch10of13A_Actlrentpaid10persalaryB |
| ScheduleEA10_13A.Sal40Or50Per | int | C | Y | Sch10of13A_50Por40Pofsalary |
| ScheduleEA10_13A.EligbleExmpAllwncUs13A | int | C | Y | Sch10of13A_ElgiblExmptAllwnce10of13A |

---

## Appendix · Sheet index (workbook.xml → xl/_rels)

| Sheet name | rId | file | VBA alias |
|---|---|---|---|
| Income Details | rId1 | sheet1.xml | Sheet1 |
| TDS | rId6 | sheet6.xml | Sheet2 |
| Taxes Paid and Verification | rId8 | sheet8.xml | Sheet3 |
| 80G | rId11 | sheet11.xml | — |
| DataBase | rId19 | sheet19.xml | Sheet5 (named ranges/enums) |
| SUMMARY | rId20 | sheet20.xml | — |
| 80D | rId10 | sheet10.xml | Sheet9 |
| TCS | rId7 | sheet7.xml | Sheet11 |
| 80U-80DD | rId14 | sheet14.xml | Sheet14 |
| 80C | rId15 | sheet15.xml | Sheet15 |
| 80GGA | rId12 | sheet12.xml | — |
| 80E_80EE_80EEA_80EEB | rId16 | sheet16.xml | Sheet17 |
| Schedule EA 10(13A) | rId3 | sheet3.xml | Sheet18 |
| HP | rId2 | sheet2.xml | Sheet19 |
| Part A Gen_139(8A) | rId5 | sheet5.xml | Sheet201 |
| Part B ATI | rId9 | sheet9.xml | Sheet202 |
| 80GGC | rId13 | sheet13.xml | — |

Note: the VBA `SheetN` aliases are the code-name objects, not the rId order.
Confirmed: Sheet1=Income Details, Sheet2=TDS, Sheet3=Taxes Paid & Verification,
Sheet9=80D, Sheet11=TCS, Sheet14=80U-80DD, Sheet15=80C, Sheet17=loans,
Sheet18=EA 10(13A), Sheet19=HP, Sheet201/202=139(8A) parts.

---

## Leaf count

Distinct schema leaves enumerated above: **≈ 268** (≈180 in the always-present
core blocks §1-18, ≈88 in the OLD-regime detail schedules §19). Counting every
repeating-row leaf once. See the tables for the exact list.
