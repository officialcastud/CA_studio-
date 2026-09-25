<!-- ITR-4: convert AY 2026-27 build -> AY 2025-26 -->
### 3b. ADD — required by 2025-26 schema

- `FilingStatus.AssesseeRep.RepAadhaar` — type=string, pattern=[0-9]{12}
- `FilingStatus.AssesseeRep.RepAddress` — type=string, minLength=1, maxLength=250, pattern=|(\s*([\w\d_=!@#$%\^*\(\){}\[\]\|\\:;',\.\?/~`\-\+<>&"][\s\w\d_=!@#$%\^*\(\){}\[\]\|\\:;',\.\?/~`\-\+<>&"]*)\s*), REQUIRED
- `FilingStatus.AssesseeRep.RepCapacity` — type=string, pattern=|(\s*([\w\d_=!@#$%\^*\(\){}\[\]\|\\:;',\.\?/~`\-\+<>&"][\s\w\d_=!@#$%\^*\(\){}\[\]\|\\:;',\.\?/~`\-\+<>&"]*)\s*), enum=['L', 'M', 'G', 'O'], REQUIRED  
  _L - Legal Heir; M - Manager; G - Guardian; O - Other_
- `FilingStatus.AssesseeRep.RepPAN` — type=string, pattern=[A-Z]{5}[0-9]{4}[A-Z], REQUIRED
- `FilingStatus.Form10IEAAckNo` — type=integer, minimum=100000000000000, maximum=999999999999999
- `FilingStatus.Form10IEAAckNo_AY24_25` — type=integer, minimum=100000000000000, maximum=999999999999999
- `FilingStatus.Form10IEADate` — type=string, pattern=([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))  
  _Form 10IEA filing date in YYYY-MM-DD format_
- `FilingStatus.Form10IEADate_AY24_25` — type=string, pattern=([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))  
  _Form 10IEA filing date in YYYY-MM-DD format_
- `FilingStatus.NA_OptOutNewTaxReg` — type=string, enum=['Y', 'N']  
  _Y : Yes, N : No_
- `FilingStatus.No_OptOutNewTaxReg` — type=string, enum=['Y', 'N']  
  _Y : Yes, N : No_
- `FilingStatus.OptOutNewTaxRegime_Form10IEA_AY24_25` — type=string, enum=['Y', 'N', 'NA'], REQUIRED  
  _Y : Yes, N : No, NA : Not applicable_
- `FilingStatus.Yes_ContOptOutNewTaxReg` — type=string, enum=['Y', 'N']  
  _Y : Yes, N : No_
- `IncomeDeductions.AllwncExemptUs10.AllwncExemptUs10Dtls[].SalOthNatOfInc` — type=string, maxLength=125, pattern=|(\s*([\w\d_=!@#$%\^*\(\){}\[\]\|\\:;',\.\?/~`\-\+<>&"][\s\w\d_=!@#$%\^*\(\){}\[\]\|\\:;',\.\?/~`\-\+<>&"]*)\s*)
- `IncomeDeductions.AnnualValue` — type=integer, minimum=0, maximum=99999999999999, REQUIRED
- `IncomeDeductions.AnnualValue30Percent` — type=integer, minimum=0, maximum=99999999999999, REQUIRED
- `IncomeDeductions.ArrearsUnrealizedRentRcvd` — type=integer, minimum=0, maximum=99999999999999
- `IncomeDeductions.GrossRentReceived` — type=integer, minimum=0, maximum=99999999999999
- `IncomeDeductions.IncomeNotified89A` — type=integer, minimum=0, maximum=99999999999999, REQUIRED
- **`IncomeDeductions.IncomeNotified89AType[]`** (whole block, 2 fields)
  - `IncomeDeductions.IncomeNotified89AType[].NOT89AAmount` — type=integer, minimum=0, maximum=99999999999999, REQUIRED
  - `IncomeDeductions.IncomeNotified89AType[].NOT89ACountrycode` — type=string, enum=['US', 'UK', 'CA'], REQUIRED
- `IncomeDeductions.IncomeNotifiedOther89A` — type=integer, minimum=0, maximum=99999999999999
- `IncomeDeductions.Increliefus89A` — type=integer, minimum=0, maximum=99999999999999
- `IncomeDeductions.Increliefus89AOS` — type=integer, minimum=0, maximum=99999999999999
- `IncomeDeductions.InterestPayable` — type=integer, minimum=0, maximum=99999999999999
- **`IncomeDeductions.OthersInc.OthersIncDtlsOthSrc[].NOT89AInc`** (whole block, 5 fields)
  - `IncomeDeductions.OthersInc.OthersIncDtlsOthSrc[].NOT89AInc.DateRange.Up16Of12To15Of3` — type=integer, minimum=0, maximum=99999999999999, REQUIRED
  - `IncomeDeductions.OthersInc.OthersIncDtlsOthSrc[].NOT89AInc.DateRange.Up16Of3To31Of3` — type=integer, minimum=0, maximum=99999999999999, REQUIRED
  - `IncomeDeductions.OthersInc.OthersIncDtlsOthSrc[].NOT89AInc.DateRange.Up16Of9To15Of12` — type=integer, minimum=0, maximum=99999999999999, REQUIRED
  - `IncomeDeductions.OthersInc.OthersIncDtlsOthSrc[].NOT89AInc.DateRange.Upto15Of6` — type=integer, minimum=0, maximum=99999999999999, REQUIRED
  - `IncomeDeductions.OthersInc.OthersIncDtlsOthSrc[].NOT89AInc.DateRange.Upto15Of9` — type=integer, minimum=0, maximum=99999999999999, REQUIRED
- **`IncomeDeductions.OthersInc.OthersIncDtlsOthSrc[].NOT89A[]`** (whole block, 2 fields)
  - `IncomeDeductions.OthersInc.OthersIncDtlsOthSrc[].NOT89A[].NOT89AAmount` — type=integer, minimum=0, maximum=99999999999999, REQUIRED
  - `IncomeDeductions.OthersInc.OthersIncDtlsOthSrc[].NOT89A[].NOT89ACountrycode` — type=string, enum=['US', 'UK', 'CA'], REQUIRED
- `IncomeDeductions.TaxPaidlocalAuth` — type=integer, minimum=0, maximum=99999999999999
- `IncomeDeductions.TotalIncomeOfHP` — type=integer, minimum=-200000, maximum=99999999999999, REQUIRED  
  _House Property income_
- `IncomeDeductions.TypeOfHP` — type=string, pattern=S|L|D  
  _S:Self Occupied; L:Let Out; D:Deemed let out_
- `IncomeDeductions.UsrDeductUndChapVIA.PRANNum` — type=string, minLength=1, maxLength=125
- **`PartA_139_8A`** (whole block, 17 fields)
  - `PartA_139_8A.AadhaarCardNo` — type=string, pattern=[0-9]{12}
  - `PartA_139_8A.Applicable_139_8A.AcknowledgementNo` — type=string, maxLength=15, pattern=[0-9]{15}, REQUIRED
  - `PartA_139_8A.Applicable_139_8A.ITRForm` — type=string, pattern=|(\s*([\w\d_=!@#$%\^*\(\){}\[\]\|\\:;',\.\?/~`\-\+<>&"][\s\w\d_=!@#$%\^*\(\){}\[\]\|\\:;',\.\?/~`\-\+<>&"]*)\s*), enum=['ITR1', 'ITR2', 'ITR3', 'ITR4', 'ITR5', 'ITR6', 'ITR7']
  - `PartA_139_8A.Applicable_139_8A.OrigRetFiledDate` — type=string, pattern=([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])), REQUIRED
  - `PartA_139_8A.AssessmentYear` — type=string, pattern=2025, REQUIRED
  - `PartA_139_8A.ITRFormUpdatingInc` — type=string, pattern=|(\s*([\w\d_=!@#$%\^*\(\){}\[\]\|\\:;',\.\?/~`\-\+<>&"][\s\w\d_=!@#$%\^*\(\){}\[\]\|\\:;',\.\?/~`\-\+<>&"]*)\s*), enum=['ITR4'], REQUIRED
  - `PartA_139_8A.LaidOutIn_139_8A` — type=string, pattern=Y|N, REQUIRED
  - `PartA_139_8A.Name` — type=string, maxLength=125, pattern=|(\s*([\w\d_=!@#$%\^*\(\){}\[\]\|\\:;',\.\?/~`\-\+<>&"][\s\w\d_=!@#$%\^*\(\){}\[\]\|\\:;',\.\?/~`\-\+<>&"]*)\s*), REQUIRED
  - `PartA_139_8A.PAN` — type=string, pattern=[A-Z]{5}[0-9]{4}[A-Z], REQUIRED
  - `PartA_139_8A.PreviouslyFiledForThisAY` — type=string, pattern=Y|N, REQUIRED
  - `PartA_139_8A.PreviouslyFiledForThisAY_139_8A` — type=string, pattern=|(\s*([\w\d_=!@#$%\^*\(\){}\[\]\|\\:;',\.\?/~`\-\+<>&"][\s\w\d_=!@#$%\^*\(\){}\[\]\|\\:;',\.\?/~`\-\+<>&"]*)\s*), enum=['1', '2']
  - `PartA_139_8A.RetrntoRedCarriedFL.UDYear.UnabsorbedDepreciationYearDtls[].RevisedReturnFile` — type=string, pattern=Y|N
  - `PartA_139_8A.RetrntoRedCarriedFL.UDYear.UnabsorbedDepreciationYearDtls[].UnabsorbedDepreciationYear` — type=string, pattern=|(\s*([\w\d_=!@#$%\^*\(\){}\[\]\|\\:;',\.\?/~`\-\+<>&"][\s\w\d_=!@#$%\^*\(\){}\[\]\|\\:;',\.\?/~`\-\+<>&"]*)\s*), enum=['2026', '2027'], REQUIRED
  - `PartA_139_8A.RetrntoRedCarriedFL.UDYear.UnabsorbedDepreciationYearDtls[].UpdatedReturnFile` — type=string, pattern=Y|N
  - `PartA_139_8A.RetrntoRedCarriedFL.UnabsorbedDepreciation` — type=string, pattern=Y|N, REQUIRED
  - `PartA_139_8A.UpdatedReturnDuringPeriod` — type=string, pattern=|(\s*([\w\d_=!@#$%\^*\(\){}\[\]\|\\:;',\.\?/~`\-\+<>&"][\s\w\d_=!@#$%\^*\(\){}\[\]\|\\:;',\.\?/~`\-\+<>&"]*)\s*), enum=['1', '2', '3', '4'], REQUIRED
  - `PartA_139_8A.UpdatingInc.ReasonsForUpdatingIncDtls[].ReasonsForUpdatingIncome` — type=string, pattern=|(\s*([\w\d_=!@#$%\^*\(\){}\[\]\|\\:;',\.\?/~`\-\+<>&"][\s\w\d_=!@#$%\^*\(\){}\[\]\|\\:;',\.\?/~`\-\+<>&"]*)\s*), enum=['1', '2', '3', '4', '5', '6', '7', 'OTH'], REQUIRED
- **`PartB-ATI`** (whole block, 34 fields)
  - `PartB-ATI.AddtnlIncTax` — type=integer, minimum=0, maximum=99999999999999, REQUIRED
  - `PartB-ATI.AggrLiabilityNoRefund` — type=integer, minimum=0, maximum=99999999999999, REQUIRED
  - `PartB-ATI.AggrLiabilityRefund` — type=integer, minimum=0, maximum=99999999999999, REQUIRED
  - `PartB-ATI.AmtPayable` — type=integer, minimum=0, maximum=99999999999999, REQUIRED
  - `PartB-ATI.AmtRefundable` — type=integer, minimum=0, maximum=99999999999999
  - `PartB-ATI.FeeIncUS234F` — type=integer, minimum=0, maximum=5000, REQUIRED
  - `PartB-ATI.HeadOfInc.IncomeFromBP` — type=integer, minimum=-99999999999999, maximum=99999999999999
  - `PartB-ATI.HeadOfInc.IncomeFromCG` — type=integer, minimum=-99999999999999, maximum=99999999999999
  - `PartB-ATI.HeadOfInc.IncomeFromHP` — type=integer, minimum=-99999999999999, maximum=99999999999999
  - `PartB-ATI.HeadOfInc.IncomeFromOS` — type=integer, minimum=-99999999999999, maximum=99999999999999
  - `PartB-ATI.HeadOfInc.Salaries` — type=integer, minimum=-99999999999999, maximum=99999999999999
  - `PartB-ATI.HeadOfInc.Total` — type=integer, minimum=-99999999999999, maximum=99999999999999
  - `PartB-ATI.LastAmtPayable` — type=integer, minimum=0, maximum=99999999999999
  - `PartB-ATI.LatestTotInc` — type=integer, minimum=0, maximum=99999999999999
  - `PartB-ATI.NetPayable` — type=integer, minimum=0, maximum=99999999999999, REQUIRED
  - `PartB-ATI.Refund` — type=integer, minimum=0, maximum=99999999999999
  - `PartB-ATI.RegAssessementTAX` — type=integer, minimum=0, maximum=99999999999999
  - `PartB-ATI.ReleifUS89` — type=integer, minimum=0, maximum=99999999999999, REQUIRED
  - `PartB-ATI.ScheduleIT1.TaxPayment1.ITTaxPayments[].Amt` — type=integer, minimum=0, maximum=99999999999999, REQUIRED
  - `PartB-ATI.ScheduleIT1.TaxPayment1.ITTaxPayments[].BSRCode` — type=string, pattern=[0-9]{3}[0-9A-Z]{4}, REQUIRED
  - `PartB-ATI.ScheduleIT1.TaxPayment1.ITTaxPayments[].DateDep` — type=string, pattern=([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])), REQUIRED
  - `PartB-ATI.ScheduleIT1.TaxPayment1.ITTaxPayments[].SrlNoOfChaln` — type=integer, minimum=0, maximum=99999, REQUIRED
  - `PartB-ATI.ScheduleIT1.TaxPayment1.ITTaxPayments[].slno` — type=integer, minimum=0, maximum=99999999999999
  - `PartB-ATI.ScheduleIT1.Total` — type=integer, minimum=0, maximum=99999999999999, REQUIRED
  - `PartB-ATI.ScheduleIT2.TaxPayment2.ITTaxPayments[].Amt` — type=integer, minimum=0, maximum=99999999999999, REQUIRED
  - `PartB-ATI.ScheduleIT2.TaxPayment2.ITTaxPayments[].BSRCode` — type=string, pattern=[0-9]{3}[0-9A-Z]{4}, REQUIRED
  - `PartB-ATI.ScheduleIT2.TaxPayment2.ITTaxPayments[].DateDep` — type=string, pattern=([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])), REQUIRED
  - `PartB-ATI.ScheduleIT2.TaxPayment2.ITTaxPayments[].SrlNoOfChaln` — type=integer, minimum=0, maximum=99999, REQUIRED
  - `PartB-ATI.ScheduleIT2.TaxPayment2.ITTaxPayments[].slno` — type=integer, minimum=0, maximum=99999999999999
  - `PartB-ATI.ScheduleIT2.Total` — type=integer, minimum=0, maximum=99999999999999, REQUIRED
  - `PartB-ATI.TaxDue10_11` — type=integer, minimum=0, maximum=99999999999999, REQUIRED
  - `PartB-ATI.TaxUS140B` — type=integer, minimum=0, maximum=99999999999999, REQUIRED
  - `PartB-ATI.TotRefund` — type=integer, minimum=0, maximum=99999999999999
  - `PartB-ATI.UpdatedTotInc` — type=integer, minimum=0, maximum=99999999999999, REQUIRED
- **`ScheduleUs24B`** (whole block, 8 fields)
  - `ScheduleUs24B.ScheduleUs24BDtls[].BankOrInstnName` — type=string, minLength=1, maxLength=125, pattern=|(\s*([\w\d_=!@#$%\^*\(\){}\[\]\|\\:;',\.\?/~`\-\+<>&"][\s\w\d_=!@#$%\^*\(\){}\[\]\|\\:;',\.\?/~`\-\+<>&"]*)\s*), REQUIRED
  - `ScheduleUs24B.ScheduleUs24BDtls[].DateofLoan` — type=string, pattern=([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])), REQUIRED
  - `ScheduleUs24B.ScheduleUs24BDtls[].InterestUs24B` — type=integer, minimum=0, maximum=99999999999999, REQUIRED
  - `ScheduleUs24B.ScheduleUs24BDtls[].LoanAccNoOfBankOrInstnRefNo` — type=string, minLength=1, maxLength=20, pattern=[a-zA-Z0-9]([/-]?(((\d*[1-9]\d*)*[a-zA-Z/-])|(\d*[1-9]\d*[a-zA-Z]*))+)*[0-9]*, REQUIRED
  - `ScheduleUs24B.ScheduleUs24BDtls[].LoanOutstndngAmt` — type=integer, minimum=0, maximum=99999999999999, REQUIRED
  - `ScheduleUs24B.ScheduleUs24BDtls[].LoanTknFrom` — type=string, enum=['B', 'I'], REQUIRED
  - `ScheduleUs24B.ScheduleUs24BDtls[].TotalLoanAmt` — type=integer, minimum=0, maximum=99999999999999, REQUIRED
  - `ScheduleUs24B.TotalInterestUs24B` — type=integer, minimum=0, maximum=99999999999999, REQUIRED
- `TaxExmpIntIncDtls.OthersInc.OthersIncDtls[].NatureDesc` — type=string, pattern=|(\s*([\w\d_=!@#$%\^*\(\){}\[\]\|\\:;',\.\?/~`\-\+<>&"][\s\w\d_=!@#$%\^*\(\){}\[\]\|\\:;',\.\?/~`\-\+<>&"]*)\s*), enum=['AGRI', '10(10BC)', '10(10D)', '10(11)', '10(12)', '10(12C)', '10(13)', '10(16)', '10(17)', '10(17A)', '10(18)', 'DMDP', '10(19)', '10(26)', '10(26AAA)', 'OTH'…], REQUIRED  
  _AGRI : Agriculture Income (<= Rs.5000); 10(10BC): Sec 10(10BC)-Any amount from the Central/State Govt./local authority by way of compensation on account of any disaster; 10(10D) : Sec 10(10D)- Any sum received under a life insurance policy, including the sum allocated by way of bonus on such policy _
- `TaxExmpIntIncDtls.OthersInc.OthersIncDtls[].OthNatOfInc` — type=string, maxLength=125, pattern=|(\s*([\w\d_=!@#$%\^*\(\){}\[\]\|\\:;',\.\?/~`\-\+<>&"][\s\w\d_=!@#$%\^*\(\){}\[\]\|\\:;',\.\?/~`\-\+<>&"]*)\s*)
