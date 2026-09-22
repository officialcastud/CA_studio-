/* Scenario: resident firm with substantial foreign income & assets —
   Schedule FSI (3 countries), Schedule TR (relief 90/91), Schedule FA (all tables). */
S.fa={
 fsi:[{code:"2",name:"UNITED STATES OF AMERICA",tin:"US-98-7654321",sec:"90",
        hp:{b:200000,c:30000,d:30000,art:"6"},bus:{b:500000,c:75000,d:75000,art:"7"},
        cg:{b:100000,c:20000,d:15000,art:"13"},os:{b:100000,c:15000,d:15000,art:"11"}},
      {code:"1",name:"UNITED ARAB EMIRATES",tin:"AE-1122334455",sec:"90",
        hp:{b:0,c:0,d:0,art:""},bus:{b:300000,c:0,d:0,art:"7"},
        cg:{b:0,c:0,d:0,art:""},os:{b:50000,c:0,d:0,art:"11"}},
      {code:"65",name:"SINGAPORE",tin:"SG-200912345K",sec:"91",
        hp:{b:0,c:0,d:0,art:""},bus:{b:0,c:0,d:0,art:""},
        cg:{b:0,c:0,d:0,art:""},os:{b:150000,c:22500,d:22500,art:""}},],
 trFlag:"YES", trAmt:"50000", trAY:"2025-26",
 a1:[{code:"2",Bankname:"JPMorgan Chase Bank",AddressOfBank:"270 Park Avenue, New York",ZipCode:"10017",
       ForeignAccountNumber:"US-987654321",OwnerStatus:"OWNER",AccOpenDate:"14/03/2019",
       PeakBalanceDuringYear:1200000,ClosingBalance:900000,IntrstAccured:15000}],
 a2:[{code:"2",FinancialInstName:"Fidelity Custody",FinancialInstAddress:"245 Summer St, Boston",ZipCode:"02210",
       AccountNumber:"CUST-4411",Status:"OWNER",AccOpenDate:"01/06/2020",
       PeakBalanceDuringYear:800000,ClosingBalance:700000,NatureOfAmount:"INTEREST",GrossAmtPaidCredited:20000}],
 a3:[],a4:[],
 b:[{code:"2",NameOfEntity:"Alpha Inc",AddressOfEntity:"1 Market St, San Francisco",ZipCode:"94105",
      NatureOfEntity:"Company",NatureOfInt:"DIRECT",DateHeld:"12/08/2021",TotalInvestment:500000,NatureOfInc:"Dividend",IncFromInt:0,IncTaxAmt:0,IncTaxSch:"OS",IncTaxSchNo:"1a",
      }],
 c:[],d:[],e:[],f:[],g:[]};
S.fs.foreignExch="Y";
S.tax.faFlag="Y";
