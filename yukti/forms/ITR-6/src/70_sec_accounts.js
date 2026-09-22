/* =====================================================================
   70_sec_accounts.js — Part A audited accounts (ITR-6, Phase 4)
   Section id "accounts", screen/compute order 15 (before Schedule BP).
   Built ONLY from books/ITR-6/: BALANCE_SHEET.md, Part_A_Manufacturing_
   Account.md, Part_A_Trading_Account.md, PROFIT_LOSS.md, Part_A_BS_Ind_
   AS.md, Part_AManufacturingAccountIndas.md, Part_A_Trading_Account_
   Indas.md, Part_A_P_L_Ind_AS.md, PART_A_OI.md, QUANTITATIVE_DETAILS.md,
   PART_A_OL.md — plus enums.json for the three dropdown lists.

   Eleven schema blocks (verbatim keys, department misspellings kept):
     PARTA_BSFor6FrmAY13   — Balance Sheet (Schedule III, non-Ind-AS)
     ManufacturingAccount  — Manufacturing Account
     TradingAccount        — Trading Account
     PARTA_PL              — Statement of Profit & Loss
     PARTA_BSIndAS         — Balance Sheet (Ind AS)
     ManufacturingAccountIndAS — Manufacturing Account (Ind AS)
     TradingAccountIndAS   — Trading Account (Ind AS)
     PARTA_PLIndAS         — Statement of Profit & Loss (Ind AS) + OCI
     PARTA_OI              — Other Information (tax-audit annexure)
     PARTA_QD              — Quantitative Details
     PARTA_OL             — Receipt & Payment (company under liquidation)

   The four BS/PL blocks are in SKEL and are ALWAYS merged onto the zero
   skeleton (auditShape requires their keys present). The other seven are
   emitted only when they carry data.

   COMPUTE CHAIN (both regular and Ind-AS variants, kept separate):
     Mfg.CostOfGoodsPrdcd (item 3) -> Trading item 11 GoodsCostPrdcdFrmMA
     Trading GrossProfit (12) + 12b + 12d -> P&L item 13 GrossProfitTrnsfFrmTrdAcc
     P&L balance carried (item 60 PartnerAccBalTrf) -> BS 1Bviii PLAccount
                                                    -> BS-IndAS RetainedEarngs
   OI 3a/3b are fed from Schedule ICDS (S.C.icds, published by section bp)
   so the ICDS deviation reaches OI and thence Schedule BP (the ITR-5 fix).
   The accounts produce the statements; PGBP itself is computed in Schedule
   BP (section bp), so S.C.accounts.income is 0 (no double count).
   ===================================================================== */

/* ---- dropdown lists (codes verbatim from books/ITR-6/enums.json;
   State/Country display labels from the P&L books' clean lists) ---- */
const ACC_UNIT=[["101","101-Gms"],["102","102-Kilograms"],["103","103-Litre"],["104","104-Kilolitre"],["105","105-Metre"],["106","106-Kilometre"],["107","107-Numbers"],["108","108-Quintal"],["109","109-Ton"],["110","110-Pound"],["111","111-Miligrams"],["112","112-Carat"],["113","113-Numbers (1000s)"],["114","114-Kwatt"],["115","115-Mwatt"],["116","116-Inch"],["117","117-Feet"],["118","118-Sqft"],["119","119-Acre"],["120","120-Cubicft"],["121","121-Sqmetre"],["122","122-Cubicmetre"],["999","999-Residual"]];
const ACC_STATE=[["01","01-Andaman and Nicobar islands"],["02","02-Andhra Pradesh"],["03","03-Arunachal Pradesh"],["04","04-Assam"],["05","05-Bihar"],["06","06-Chandigarh"],["07","07-The Dadra And Nagar Haveli And Daman And Diu"],["09","09-Delhi"],["10","10-Goa"],["11","11-Gujarat"],["12","12-Haryana"],["13","13-Himachal Pradesh"],["14","14-Jammu and Kashmir"],["15","15-Karnataka"],["16","16-Kerala"],["17","17-Lakshadweep"],["18","18-Madhya Pradesh"],["19","19-Maharashtra"],["20","20-Manipur"],["21","21-Meghalaya"],["22","22-Mizoram"],["23","23-Nagaland"],["24","24-Odisha"],["25","25-Puducherry"],["26","26-Punjab"],["27","27-Rajasthan"],["28","28-Sikkim"],["29","29-Tamil Nadu"],["30","30-Tripura"],["31","31-Uttar Pradesh"],["32","32-West Bengal"],["33","33-Chattisgarh"],["34","34-Uttarakhand"],["35","35-Jharkhand"],["36","36-Telangana"],["37","37-Ladakh"],["99","99-Foreign"]];
const ACC_CTRY=[["93","93-AFGHANISTAN"],["1001","1001-ALAND ISLANDS"],["355","355-ALBANIA"],["213","213-ALGERIA"],["684","684-AMERICAN SAMOA"],["376","376-ANDORRA"],["244","244-ANGOLA"],["1264","1264-ANGUILLA"],["1010","1010-ANTARCTICA"],["1268","1268-ANTIGUA AND BARBUDA"],["54","54-ARGENTINA"],["374","374-ARMENIA"],["297","297-ARUBA"],["61","61-AUSTRALIA"],["43","43-AUSTRIA"],["994","994-AZERBAIJAN"],["1242","1242-BAHAMAS"],["973","973-BAHRAIN"],["880","880-BANGLADESH"],["1246","1246-BARBADOS"],["375","375-BELARUS"],["32","32-BELGIUM"],["501","501-BELIZE"],["229","229-BENIN"],["1441","1441-BERMUDA"],["975","975-BHUTAN"],["591","591-BOLIVIA (PLURINATIONAL STATE OF)"],["1002","1002-BONAIRE, SINT EUSTATIUS AND SABA"],["387","387-BOSNIA AND HERZEGOVINA"],["267","267-BOTSWANA"],["1003","1003-BOUVET ISLAND"],["55","55-BRAZIL"],["1014","1014-BRITISH INDIAN OCEAN TERRITORY"],["673","673-BRUNEI DARUSSALAM"],["359","359-BULGARIA"],["226","226-BURKINA FASO"],["257","257-BURUNDI"],["238","238-CABO VERDE"],["855","855-CAMBODIA"],["237","237-CAMEROON"],["1","1-CANADA"],["1345","1345-CAYMAN ISLANDS"],["236","236-CENTRAL AFRICAN REPUBLIC"],["235","235-CHAD"],["56","56-CHILE"],["86","86-CHINA"],["9","9-CHRISTMAS ISLAND"],["672","672-COCOS (KEELING) ISLANDS"],["57","57-COLOMBIA"],["270","270-COMOROS"],["242","242-CONGO"],["243","243-CONGO (DEMOCRATIC REPUBLIC OF THE)"],["682","682-COOK ISLANDS"],["506","506-COSTA RICA"],["225","225-COTE DIVOIRE"],["385","385-CROATIA"],["53","53-CUBA"],["1015","1015-CURACAO"],["357","357-CYPRUS"],["420","420-CZECHIA"],["45","45-DENMARK"],["253","253-DJIBOUTI"],["1767","1767-DOMINICA"],["1809","1809-DOMINICAN REPUBLIC"],["593","593-ECUADOR"],["20","20-EGYPT"],["503","503-EL SALVADOR"],["240","240-EQUATORIAL GUINEA"],["291","291-ERITREA"],["372","372-ESTONIA"],["251","251-ETHIOPIA"],["500","500-FALKLAND ISLANDS (MALVINAS)"],["298","298-FAROE ISLANDS"],["679","679-FIJI"],["358","358-FINLAND"],["33","33-FRANCE"],["594","594-FRENCH GUIANA"],["689","689-FRENCH POLYNESIA"],["1004","1004-FRENCH SOUTHERN TERRITORIES"],["241","241-GABON"],["220","220-GAMBIA"],["995","995-GEORGIA"],["49","49-GERMANY"],["233","233-GHANA"],["350","350-GIBRALTAR"],["30","30-GREECE"],["299","299-GREENLAND"],["1473","1473-GRENADA"],["590","590-GUADELOUPE"],["1671","1671-GUAM"],["502","502-GUATEMALA"],["1481","1481-GUERNSEY"],["224","224-GUINEA"],["245","245-GUINEA-BISSAU"],["592","592-GUYANA"],["509","509-HAITI"],["1005","1005-HEARD ISLAND AND MCDONALD ISLANDS"],["6","6-HOLY SEE"],["504","504-HONDURAS"],["852","852-HONG KONG"],["36","36-HUNGARY"],["354","354-ICELAND"],["91","91-INDIA"],["62","62-INDONESIA"],["98","98-IRAN (ISLAMIC REPUBLIC OF)"],["964","964-IRAQ"],["353","353-IRELAND"],["1624","1624-ISLE OF MAN"],["972","972-ISRAEL"],["5","5-ITALY"],["1876","1876-JAMAICA"],["81","81-JAPAN"],["1534","1534-JERSEY"],["962","962-JORDAN"],["7","7-KAZAKHSTAN"],["254","254-KENYA"],["686","686-KIRIBATI"],["850","850-KOREA (DEMOCRATIC PEOPLES REPUBLIC OF)"],["82","82-KOREA (REPUBLIC OF)"],["965","965-KUWAIT"],["996","996-KYRGYZSTAN"],["856","856-LAO PEOPLES DEMOCRATIC REPUBLIC"],["371","371-LATVIA"],["961","961-LEBANON"],["266","266-LESOTHO"],["231","231-LIBERIA"],["218","218-LIBYA"],["423","423-LIECHTENSTEIN"],["370","370-LITHUANIA"],["352","352-LUXEMBOURG"],["853","853-MACAO"],["389","389-MACEDONIA (THE FORMER YUGOSLAV REPUBLIC OF)"],["261","261-MADAGASCAR"],["265","265-MALAWI"],["60","60-MALAYSIA"],["960","960-MALDIVES"],["223","223-MALI"],["356","356-MALTA"],["692","692-MARSHALL ISLANDS"],["596","596-MARTINIQUE"],["222","222-MAURITANIA"],["230","230-MAURITIUS"],["269","269-MAYOTTE"],["52","52-MEXICO"],["691","691-MICRONESIA (FEDERATED STATES OF)"],["373","373-MOLDOVA (REPUBLIC OF)"],["377","377-MONACO"],["976","976-MONGOLIA"],["382","382-MONTENEGRO"],["1664","1664-MONTSERRAT"],["212","212-MOROCCO"],["258","258-MOZAMBIQUE"],["95","95-MYANMAR"],["264","264-NAMIBIA"],["674","674-NAURU"],["977","977-NEPAL"],["31","31-NETHERLANDS"],["687","687-NEW CALEDONIA"],["64","64-NEW ZEALAND"],["505","505-NICARAGUA"],["227","227-NIGER"],["234","234-NIGERIA"],["683","683-NIUE"],["15","15-NORFOLK ISLAND"],["1670","1670-NORTHERN MARIANA ISLANDS"],["47","47-NORWAY"],["968","968-OMAN"],["92","92-PAKISTAN"],["680","680-PALAU"],["970","970-PALESTINE, STATE OF"],["507","507-PANAMA"],["675","675-PAPUA NEW GUINEA"],["595","595-PARAGUAY"],["51","51-PERU"],["63","63-PHILIPPINES"],["1011","1011-PITCAIRN"],["48","48-POLAND"],["14","14-PORTUGAL"],["1787","1787-PUERTO RICO"],["974","974-QATAR"],["262","262-REUNION"],["40","40-ROMANIA"],["8","8-RUSSIAN FEDERATION"],["250","250-RWANDA"],["1006","1006-SAINT BARTHELEMY"],["290","290-SAINT HELENA, ASCENSION AND TRISTAN DA CUNHA"],["1869","1869-SAINT KITTS AND NEVIS"],["1758","1758-SAINT LUCIA"],["1007","1007-SAINT MARTIN (FRENCH PART)"],["508","508-SAINT PIERRE AND MIQUELON"],["1784","1784-SAINT VINCENT AND THE GRENADINES"],["685","685-SAMOA"],["378","378-SAN MARINO"],["239","239-SAO TOME AND PRINCIPE"],["966","966-SAUDI ARABIA"],["221","221-SENEGAL"],["381","381-SERBIA"],["248","248-SEYCHELLES"],["232","232-SIERRA LEONE"],["65","65-SINGAPORE"],["1721","1721-SINT MAARTEN (DUTCH PART)"],["421","421-SLOVAKIA"],["386","386-SLOVENIA"],["677","677-SOLOMON ISLANDS"],["252","252-SOMALIA"],["28","28-SOUTH AFRICA"],["1008","1008-SOUTH GEORGIA AND THE SOUTH SANDWICH ISLANDS"],["211","211-SOUTH SUDAN"],["35","35-SPAIN"],["94","94-SRI LANKA"],["249","249-SUDAN"],["597","597-SURINAME"],["1012","1012-SVALBARD AND JAN MAYEN"],["268","268-SWAZILAND"],["46","46-SWEDEN"],["41","41-SWITZERLAND"],["963","963-SYRIAN ARAB REPUBLIC"],["886","886-TAIWAN"],["992","992-TAJIKISTAN"],["255","255-TANZANIA, UNITED REPUBLIC OF"],["66","66-THAILAND"],["670","670-TIMOR-LESTE(EAST TIMOR)"],["228","228-TOGO"],["690","690-TOKELAU"],["676","676-TONGA"],["1868","1868-TRINIDAD AND TOBAGO"],["216","216-TUNISIA"],["90","90-TURKEY"],["993","993-TURKMENISTAN"],["1649","1649-TURKS AND CAICOS ISLANDS"],["688","688-TUVALU"],["256","256-UGANDA"],["380","380-UKRAINE"],["971","971-UNITED ARAB EMIRATES"],["44","44-UNITED KINGDOM OF GREAT BRITAIN AND NORTHERN IRELAND"],["2","2-UNITED STATES OF AMERICA"],["1009","1009-UNITED STATES MINOR OUTLYING ISLANDS"],["598","598-URUGUAY"],["998","998-UZBEKISTAN"],["678","678-VANUATU"],["58","58-VENEZUELA (BOLIVARIAN REPUBLIC OF)"],["84","84-VIET NAM"],["1284","1284-VIRGIN ISLANDS (BRITISH)"],["1340","1340-VIRGIN ISLANDS (U.S.)"],["681","681-WALLIS AND FUTUNA"],["1013","1013-WESTERN SAHARA"],["967","967-YEMEN"],["260","260-ZAMBIA"],["263","263-ZIMBABWE"],["9999","9999-OTHERS"]];
const ACC_YN=[["Yes","Yes"],["No","No"]];       /* items 2, 4c, 18 flags */
const ACC_YN2=[["Y","Y"],["N","N"]];            /* P&L 22xiia AnyCompPaidToNonRes */
const ACC_ACCT=[["MERC","Mercantile"],["CASH","Cash"]];  /* OI item 1 */
const ACC_VAL=[["1","1 — Cost or market rate, whichever is less"],["2","2 — At cost"],["3","3 — At market rate"]]; /* OI 4a/4b */
const ACC_RC=[["Revenue","Revenue"],["Capital","Capital"]]; /* OL 2v TypeOfIncome */

/* ---- state: S.accounts mirrors each schema block's nested shape. The
   engine writes computed totals back onto the same paths, so S.accounts is
   the single source of truth for the renderer cells and the exporter. ---- */
S.accounts = S.accounts || {
  bsOn:false, mfgOn:false, trdOn:false, plOn:false,
  biasOn:false, mfgiasOn:false, trdiasOn:false, pliasOn:false,
  oiOn:false, qdOn:false, olOn:false,
  bs:{ EquityAndLiablities:{ ShareHolderFund:{ShareCapital:{},ResrNSurp:{OtherResrvDtls:[]}},
         ShareAppMoneyAllot:{},
         NonCurrLiabilities:{LongTermBorrowings:{BondsDebentures:{},TermLoans:{RupeeLoans:{}}},OthLongTermLiablities:{},LongTermProvisions:{}},
         CurrentLiabilities:{ShortTrmBorrowings:{LoansRepaybleOnDemand:{}},TradePayables:{},OthCurrLiabilities:{},ShortTermProv:{}} },
       Assets:{ NonCurrAssets:{FixedAsset:{Tangible:{},InTangible:{}},NonCurrInvstmnts:{EquityInstruments:{}},LongTrmLoanAdv:{LTLoanAdvDtls:{}},OthNonCurrAssets:{LTTradeReceivables:{}}},
         CurrentAssets:{CurrInvstmnts:{EquityInstruments:{}},Inventories:{},TradeReceivables:{},CashNCashEquivalents:{},TotShortTermLoanAdv:{STLoanAdvDtls:{}}} } },
  mfg:{ OpeningInventory:{}, ClosingStock:{} },
  trd:{ ExciseCustomsVAT:{}, DutyTaxPay:{ExciseCustomsVAT:{}}, OtherOperatingRevenueDtls:[], OtherDirectExpenses:[] },
  pl:{ CreditsToPL:{OthIncome:{OtherIncDtls:[]}},
       DebitsToPL:{DebitPlAcnt:{EmployeeComp:{},Insurances:{},CommissionExpdrDtls:{},RoyalityDtls:{},ProfessionalConstDtls:{},
         RatesTaxesPays:{ExciseCustomsVAT:{}},OtherExpensesDtls:[],
         BadDebtDtls:{BadDebtAmtDtls:[],OthersPANNotAvlblDtl:[]},InterestExpdrtDtls:{}},
         TaxProvAppr:{Appropriations:{}}},
       NatOfBus44AE:[], GoodsDtlsUs44AE:[], NoBooksOfAccPLDetails:[], NoBooksOfAccPL:{} },
  bsias:{ EquityAndLiablities:{ Equity:{EquityShareCapital:{},OtherEquityReserv:{OtherResrvDtls:[]}},
         Liabilities:{
           NonCurrLiabilities:{FinancialLiabilities:{BondsDebentures:{},TermLoans:{RupeeLoans:{}}},Provisions:{OthersProvisions:[]},OtherNonCurLiabilites:{OthersNonCurrLiab:[]}},
           CurrentLiabilities:{FinancialLiabBorrowings:{LoansRepaybleOnDemand:{},BrwngOtherLoans:[]},OthFinancialLiabilities:{OthPayables:[]},OtherCuurLiabilities:{OtherAdvance:[],Others:[]},Provosions:{OthersProvisions:[]}} } },
       Assets:{ NonCurrAssets:{PropertyPlantEquip:{FinancialAssets:{Investments:{OtherInvestment:[]},TradeReceivables:{},Loans:{OtherLoans:[]},OtherFinacialAssets:{},OtherNonCurrentAssets:{OtherNonCurrAsst:[]}}}},
         CurrentAssets:{Inventories:{},FinancialAssets:{Investments:{},TradeReceivables:{},CashEquivalents:{OtherCashDtls:[]},Loans:{OtherLoans:[]},OtherCurrentAssets:{OthersCurrentAssts:[]}}} } },
  mfgias:{ OpeningInventory:{}, ClosingStock:{} },
  trdias:{ ExciseCustomsVAT:{}, DutyTaxPay:{ExciseCustomsVAT:{}}, OtherOperatingRevenueDtls:[], OtherDirectExpenses:[] },
  plias:{ CreditsToPL:{OthIncome:{OtherIncDtls:[]}},
       DebitsToPL:{DebitPlAcnt:{EmployeeComp:{},Insurances:{},CommissionExpdrDtls:{},RoyalityDtls:{},ProfessionalConstDtls:{},
         RatesTaxesPays:{ExciseCustomsVAT:{}},OtherExpensesDtls:[],
         BadDebtDtls:{BadDebtAmtDtls:[],OthersPANNotAvlblDtl:[]},InterestExpdrtDtls:{}},
         TaxProvAppr:{Appropriations:{}}},
       OtherComprnsvInc:{ItemsNotReclsfdPnL:{OtherIncDtls:[]},ItemsReclsfdPnL:{OtherIncDtls:[]}} },
  oi:{ MethodOfValClgStk:{}, NoCredToPLAmt:{}, AmtDisallUs36:{NoOfEmployeesEmployed:{}}, AmtDisallUs37:{},
       AmtDisallUs40:{}, AmtDisallUs40A:{},
       AmtDisallUs43BPyNowAll:{AmtUs43B:{}}, AmtDisall43B:{AmtUs43B:{}},
       AmtExciseCustomsVATOutstanding:{ExciseCustomsVAT:{}} },
  qd:{ trd:[], raw:[], fin:[] },
  ol:{ OpeningBal:{}, Receipts:{SaleOfAssets:{SaleOfAssetsDtls:[]},OthersIncRec:{OthersIncDtls:[]}},
       Payments:{OthersPayments:{OthersPaymentsDtls:[]}}, ClosingStock:{} }
};

/* ================================================================
   ENGINE — every total tagged with its book item/row reference.
   ================================================================ */
function engAccounts(){
  const G=p=>N(get("accounts."+p)),
        St=(p,v)=>set("accounts."+p,R(v)),
        A=p=>{const a=get("accounts."+p);return Array.isArray(a)?a:[];},
        SUM=(arr,k)=>arr.reduce((a,r)=>a+N(r[k]),0);

  /* ---------- Manufacturing Account (regular + Ind-AS share structure) ---------- */
  function engMfg(pf){
    const o=pf+".OpeningInventory.";
    const opng=Math.max(0, G(o+"OpngStckRawMat")+G(o+"OpngStckWrkinPrgrs"));          /* 1Aiii */
    St(o+"OpngInvntryTotal", opng);
    const de=G(o+"CarriageInward")+G(o+"PowerAndFuel")+G(o+"OthDirectExpenses");       /* 1D */
    St(o+"DirectExpenses", de);
    const fo=G(o+"IndirectWages")+G(o+"FactoryRentAndRates")+G(o+"FactoryInsurance")+G(o+"FactoryFuelAndPower")+G(o+"FactoryGeneralExpenses")+G(o+"DeprctnOfFactoryMachinery"); /* 1Evii */
    St(o+"TotalFactoryOverheads", fo);
    const deb=opng+G(o+"Purchases")+G(o+"DirectWages")+de+fo;                          /* 1F */
    St(o+"TotalDebtsManfctrngAcc", deb);
    const cl=G(pf+".ClosingStock.ClsngStckRawMaterial")+G(pf+".ClosingStock.ClsngStckWrkInPrgrs"); /* 2iii */
    St(pf+".ClosingStock.ClsngStckTotal", cl);
    const cogp=deb-cl;                                                                  /* 3 (may be negative) */
    St(pf+".CostOfGoodsPrdcd", cogp);
    return cogp;
  }
  const mCOGP=engMfg("mfg"), mCOGPias=engMfg("mfgias");

  /* ---------- Trading Account (regular + Ind-AS share structure) ---------- */
  function engTrd(pf, cogp){
    const oor=SUM(A(pf+".OtherOperatingRevenueDtls"),"OperatingRevenueAmt");            /* 4Aiiic */
    St(pf+".OperatingRevenueTotal", oor);
    const aiv=G(pf+".SaleOfGoods")+G(pf+".SaleOfServices")+oor;                         /* 4Aiv */
    St(pf+".SalesGrossReceiptsTotal", aiv);
    const e=pf+".ExciseCustomsVAT.";
    const cix=G(e+"UnionExciseDuty")+G(e+"ServiceTax")+G(e+"VATorSaleTax")+G(e+"CentralGoodServiceTax")+G(e+"StateGoodServiceTax")+G(e+"IntegratedGoodServiceTax")+G(e+"UnionTerrGoodServiceTax")+G(e+"OthDutyTaxCess"); /* 4Cix */
    St(e+"TotExciseCustomsVAT", cix);
    const d4=aiv+G(pf+".GrossRcptFromProfession")+cix;                                  /* 4D */
    St(pf+".TotRevenueFrmOperations", d4);
    const cred=d4+G(pf+".ClsngStckOfFinishedStcks");                                    /* 6 */
    St(pf+".TardingAccTotCred", cred);
    const tode=Math.max(0, SUM(A(pf+".OtherDirectExpenses"),"Amount"));                 /* 9iii total */
    St(pf+".TotOthDirectExpenses", tode);
    const de9=G(pf+".CarriageInward")+G(pf+".PowerAndFuel")+tode;                       /* 9 */
    St(pf+".DirectExpenses", de9);
    const dt=pf+".DutyTaxPay.ExciseCustomsVAT.";
    const x=G(dt+"CustomDuty")+G(dt+"CounterVailDuty")+G(dt+"SplAddDuty")+G(dt+"UnionExciseDuty")+G(dt+"ServiceTax")+G(dt+"VATorSaleTax")+G(dt+"CentralGoodServiceTax")+G(dt+"StateGoodServiceTax")+G(dt+"IntegratedGoodServiceTax")+G(dt+"UnionTerrGoodServiceTax")+G(dt+"OthDutyTaxCess"); /* 10xii */
    St(dt+"TotExciseCustomsVAT", x);
    St(pf+".GoodsCostPrdcdFrmMA", cogp);                                                /* 11 fed from Mfg */
    const gp=cred-G(pf+".OpngStckOfFinishedStcks")-G(pf+".Purchases")-de9-x-cogp;       /* 12 */
    St(pf+".GrossProfitFrmBusProf", gp);
    /* 13 to P&L: GP + intraday income (12b) + F&O income (12d) */
    return gp+G(pf+".IntradayTradingIncome")+G(pf+".IncomeFutureTrd");
  }
  const gpTr=engTrd("trd", mCOGP), gpTrias=engTrd("trdias", mCOGPias);

  /* ---------- Statement of Profit & Loss (regular + Ind-AS) ---------- */
  function engPL(pf, gpTransf, incAmtKey){
    const c=pf+".CreditsToPL.", oi=c+"OthIncome.";
    St(c+"GrossProfitTrnsfFrmTrdAcc", gpTransf);                                        /* 13 */
    const misc=G(oi+"LiabilityWrittenBack")+G(oi+"AmtofInterest")+SUM(A(oi+"OtherIncDtls"),incAmtKey); /* 14xic */
    St(oi+"MiscOthIncome", misc);
    const totOI=G(oi+"RentInc")+G(oi+"Comissions")+G(oi+"Dividends")+G(oi+"InterestInc")+G(oi+"ProfitOnSaleFixedAsset")+G(oi+"ProfitOnInvChrSTT")+G(oi+"ProfitOnOthInv")+G(oi+"ProfitOnCurrFluct")+G(oi+"ProfitOnCnvInvntryToCapAsst")+G(oi+"ProfitOnAgriIncome")+misc; /* 14xii */
    St(oi+"TotOthIncome", totOI);
    const totCred=gpTransf+totOI;                                                       /* 15 */
    St(c+"TotCreditsToPL", totCred);
    const d=pf+".DebitsToPL.DebitPlAcnt.", ec=d+"EmployeeComp.", ins=d+"Insurances.";
    const emp=G(ec+"SalsWages")+G(ec+"Bonus")+G(ec+"MedExpReimb")+G(ec+"LeaveEncash")+G(ec+"LeaveTravelBenft")+G(ec+"ContToSuperAnnFund")+G(ec+"ContToPF")+G(ec+"ContToGratFund")+G(ec+"ContToOthFund")+G(ec+"OthEmpBenftExpdr"); /* 22xi */
    St(ec+"TotEmployeeComp", emp);
    const insT=G(ins+"MedInsur")+G(ins+"LifeInsur")+G(ins+"KeyManInsur")+G(ins+"OthInsur"); /* 23v */
    St(ins+"TotInsurances", insT);
    const commT=G(d+"CommissionExpdrDtls.NonResOtherCompany")+G(d+"CommissionExpdrDtls.Others"); St(d+"CommissionExpdrDtls.Total",commT); /* 30iii */
    const royT=G(d+"RoyalityDtls.NonResOtherCompany")+G(d+"RoyalityDtls.Others"); St(d+"RoyalityDtls.Total",royT);                          /* 31iii */
    const profT=G(d+"ProfessionalConstDtls.NonResOtherCompany")+G(d+"ProfessionalConstDtls.Others"); St(d+"ProfessionalConstDtls.Total",profT); /* 32iii */
    const rt=d+"RatesTaxesPays.ExciseCustomsVAT.";
    const rtT=G(rt+"UnionExciseDuty")+G(rt+"ServiceTax")+G(rt+"VATorSaleTax")+G(rt+"Cess")+G(rt+"CentralGoodServiceTax")+G(rt+"StateGoodServiceTax")+G(rt+"IntegratedGoodServiceTax")+G(rt+"UnionTerrGoodServiceTax")+G(rt+"OthDutyTaxCess"); /* 44x */
    St(rt+"TotExciseCustomsVAT", rtT);
    const oExp=SUM(A(d+"OtherExpensesDtls"),"Amount"); St(d+"OtherExpenses",oExp);      /* 46 total */
    const bd1=Math.max(0, SUM(A(d+"BadDebtDtls.BadDebtAmtDtls"),"Amount")); St(d+"BadDebtDtls.BadDebtAmtDtlsTotal",bd1); /* 47i */
    const bd2=Math.max(0, SUM(A(d+"BadDebtDtls.OthersPANNotAvlblDtl"),"Amount")); St(d+"BadDebtDtls.OthersPANNotAvlblDtlTotal",bd2); /* 47ii */
    const bdT=Math.max(0, bd1+bd2+G(d+"BadDebtDtls.OthersAmtLt1Lakh")); St(d+"BadDebtDtls.BadDebt",bdT);                              /* 47iv */
    const debHeads=G(d+"Freight")+G(d+"ConsumptionOfStores")+G(d+"PowerFuel")+G(d+"RentExpdr")+G(d+"RepairsBldg")+G(d+"RepairMach")+emp+insT+G(d+"StaffWelfareExp")+G(d+"Entertainment")+G(d+"Hospitality")+G(d+"Conference")+G(d+"SalePromoExp")+G(d+"Advertisement")+commT+royT+profT+G(d+"HotelBoardLodge")+G(d+"TravelExp")+G(d+"ForeignTravelExp")+G(d+"ConveyanceExp")+G(d+"TelephoneExp")+G(d+"GuestHouseExp")+G(d+"ClubExp")+G(d+"FestivalCelebExp")+G(d+"Scholarship")+G(d+"Gift")+G(d+"Donation")+rtT+G(d+"AuditFee")+oExp+bdT+G(d+"ProvForBadDoubtDebt")+G(d+"OthProvisionsExpdr");
    const pbidta=totCred-debHeads; St(d+"PBIDTA",pbidta);                               /* 50 */
    const intT=G(d+"InterestExpdrtDtls.NonResOtherCompany")+G(d+"InterestExpdrtDtls.Others"); St(d+"InterestExpdrtDtls.InterestExpdr",intT); /* 51iii */
    const pbt=pbidta-intT-G(d+"DepreciationAmort"); St(d+"PBT",pbt);                    /* 53 */
    const tp=pf+".DebitsToPL.TaxProvAppr.", ap=tp+"Appropriations.";
    const pat=pbt-G(tp+"ProvForCurrTax")-G(tp+"ProvDefTax"); St(tp+"ProfitAfterTax",pat); /* 56 */
    const avl=pat+G(tp+"BalBFPrevYr"); St(tp+"AmtAvlAppr",avl);                         /* 58 */
    const totApp=G(ap+"TrfToReserves")+G(ap+"ProposedDividend")+G(ap+"TaxOnDividend")+G(ap+"AppropriationsCSR")+G(ap+"AnyOtherAppr"); St(ap+"TotAppropriations",totApp); /* 59vi */
    const carry=avl-totApp; St(tp+"PartnerAccBalTrf",carry);                            /* 60 -> BS */
    return {pbt:pbt, pat:pat, carry:carry};
  }
  const R1=engPL("pl", gpTr, "Amount");
  const R2=engPL("plias", gpTrias, "OthersAmount");

  /* ---------- P&L Ind-AS · Other Comprehensive Income (61A/61B/62) ---------- */
  const na="plias.OtherComprnsvInc.ItemsNotReclsfdPnL.", re="plias.OtherComprnsvInc.ItemsReclsfdPnL.";
  const naOth=SUM(A(na+"OtherIncDtls"),"OthersAmount"); St(na+"OthersTotal",naOth);
  const totNotPnL=G(na+"ChangesInSurplus")+G(na+"ReMesDefinedBenftPlans")+G(na+"EquityOCI")+G(na+"FairValFVTPl")+G(na+"ShareOfOtherComprInc")+naOth+G(na+"IncomeTaxNotPnL"); St(na+"TotalNotPnL",totNotPnL); /* 61A */
  const reOth=SUM(A(re+"OtherIncDtls"),"OthersAmount"); St(re+"OthersTotal",reOth);
  const totPnL=G(re+"ExchangeDiff")+G(re+"DebtsOCI")+G(re+"EffecPortionGainnLoss")+G(re+"ShareOCI")+reOth+G(re+"IncomeTaxReclsPnL"); St(re+"TotalPnL",totPnL); /* 61B */
  St("plias.OtherComprnsvInc.TotalComprIncome", R2.pat+totNotPnL+totPnL);              /* 62 */

  /* ---------- Balance Sheet (Schedule III, non-Ind-AS) ---------- */
  (function engBS(){
    const el="bs.EquityAndLiablities.", as="bs.Assets.";
    const shf=el+"ShareHolderFund.", sc=shf+"ShareCapital.", rs=shf+"ResrNSurp.";
    St(sc+"TotShareCapital", G(sc+"IssuedSubsPaidUp")+G(sc+"SubscribedNotFullyPaid"));  /* 1Aiv */
    const othResr=SUM(A(rs+"OtherResrvDtls"),"Amount"); St(rs+"OtherResrvTotal",othResr); /* 1Bvii */
    St(rs+"PLAccount", R1.carry);                                                       /* 1Bviii fed from P&L */
    const totRes=G(rs+"CapResr")+G(rs+"CapRedempResr")+G(rs+"SecurPremResr")+G(rs+"DebunRedResr")+G(rs+"RevResr")+G(rs+"ShareOptOSAmount")+othResr+R1.carry; St(rs+"TotResrNSurp",totRes); /* 1Bix */
    const shFund=G(shf+"MoneyRecvdAgainstShares")+totRes+G(sc+"TotShareCapital"); St(shf+"TotShareHolderFund",shFund); /* 1D */
    const sam=el+"ShareAppMoneyAllot.";
    St(sam+"Total", G(sam+"PendingLtOneYr")+G(sam+"PendingMtOneYr"));                   /* 2iii */
    const ncl=el+"NonCurrLiabilities.", ltb=ncl+"LongTermBorrowings.";
    St(ltb+"BondsDebentures.Total", G(ltb+"BondsDebentures.ForeignCurrency")+G(ltb+"BondsDebentures.Rupee")); /* 3Ai */
    St(ltb+"TermLoans.RupeeLoans.Total", G(ltb+"TermLoans.RupeeLoans.FromBanks")+G(ltb+"TermLoans.RupeeLoans.FromOthers"));
    St(ltb+"TermLoans.TotalTermLoans", G(ltb+"TermLoans.RupeeLoans.Total")+G(ltb+"TermLoans.ForeignCurrency"));
    St(ltb+"TotalLTBorrowings", G(ltb+"BondsDebentures.Total")+G(ltb+"TermLoans.TotalTermLoans")+G(ltb+"DeferredPymtLiabilities")+G(ltb+"DepositsFrmRelatedParties")+G(ltb+"OtherDeposits")+G(ltb+"LoansAndAdv")+G(ltb+"OthersLoanAdv")+G(ltb+"LongTermMaturities")); /* 3Aix */
    St(ncl+"OthLongTermLiablities.TotalOthLtLiabilities", G(ncl+"OthLongTermLiablities.TradePayables")+G(ncl+"OthLongTermLiablities.Others")); /* 3C */
    St(ncl+"LongTermProvisions.Total", G(ncl+"LongTermProvisions.ProvEmpBenefits")+G(ncl+"LongTermProvisions.Others")); /* 3D */
    const totNCL=G(ltb+"TotalLTBorrowings")+G(ncl+"NetDefferedTaxLiability")+G(ncl+"OthLongTermLiablities.TotalOthLtLiabilities")+G(ncl+"LongTermProvisions.Total"); St(ncl+"TotalNonCurrLiabilites",totNCL); /* 3E */
    const cl=el+"CurrentLiabilities.", stb=cl+"ShortTrmBorrowings.";
    St(stb+"LoansRepaybleOnDemand.TotLoansRepaybleOnDemand", G(stb+"LoansRepaybleOnDemand.FromBanks")+G(stb+"LoansRepaybleOnDemand.FrmNonBanking")+G(stb+"LoansRepaybleOnDemand.OthFinanceInst")+G(stb+"LoansRepaybleOnDemand.Others")); /* 4Ai */
    St(stb+"TotShortTrmBorrowings", G(stb+"LoansRepaybleOnDemand.TotLoansRepaybleOnDemand")+G(stb+"DepositsFrmRelatedParties")+G(stb+"LoansAndAdv")+G(stb+"OthLoansAndAdv")+G(stb+"OthDeposits")); /* 4Avi */
    St(cl+"TradePayables.TotalTradePayables", G(cl+"TradePayables.OSMoreThanOneYr")+G(cl+"TradePayables.Others")); /* 4Biii */
    const ocl=cl+"OthCurrLiabilities.";
    St(ocl+"TotOthCurrLiabilities", G(ocl+"CurrMatOnLTDebt")+G(ocl+"CurrMatFinanceOblg")+G(ocl+"AccrInterestNotDue")+G(ocl+"AccrInterest")+G(ocl+"IncRecvdAdvance")+G(ocl+"UnpaidDividend")+G(ocl+"AppMonyRecvdAllotSecurities")+G(ocl+"UnpaidMatDeposits")+G(ocl+"UnpaidMatureDebenture")+G(ocl+"OthPayables")); /* 4Cxi */
    const sp=cl+"ShortTermProv.";
    St(sp+"TotShortTermProvisions", G(sp+"EmpBenefitProv")+G(sp+"ITProvision")+G(sp+"ProposedDividend")+G(sp+"TaxOnDividend")+G(sp+"OthProvision")); /* 4Dvi */
    const totCL=G(stb+"TotShortTrmBorrowings")+G(cl+"TradePayables.TotalTradePayables")+G(ocl+"TotOthCurrLiabilities")+G(sp+"TotShortTermProvisions"); St(cl+"TotCurrLiabilitiesProvision",totCL); /* 4E */
    St(el+"TotEquityAndLiabilities", Math.max(0, shFund+G(sam+"Total")+totNCL+totCL)); /* I */
    /* Assets */
    const nca=as+"NonCurrAssets.", fa=nca+"FixedAsset.";
    St(fa+"Tangible.NetBlock", Math.max(0, G(fa+"Tangible.GrossBlock")-G(fa+"Tangible.Depreciation")-G(fa+"Tangible.ImpairmentLosses"))); /* 1Aid */
    St(fa+"InTangible.NetBlock", Math.max(0, G(fa+"InTangible.GrossBlock")-G(fa+"InTangible.Amortization")-G(fa+"InTangible.ImpairmentLosses"))); /* 1Aiid */
    St(fa+"TotFixedAsset", G(fa+"Tangible.NetBlock")+G(fa+"InTangible.NetBlock")+G(fa+"CapWrkProg")+G(fa+"IntangibleAssetUnDev")); /* 1Av */
    const nci=nca+"NonCurrInvstmnts.";
    St(nci+"EquityInstruments.Total", G(nci+"EquityInstruments.ListedEquities")+G(nci+"EquityInstruments.UnListedEquities"));
    St(nci+"TotNonCurrInvstmnts", G(nci+"InvInProperty")+G(nci+"EquityInstruments.Total")+G(nci+"PreferenceShares")+G(nci+"GovtOrTrustSecurities")+G(nci+"DebenturesOrBonds")+G(nci+"MutualFunds")+G(nci+"InvstmntInPrtnrShipFirm")+G(nci+"OtherInvstmnts")); /* 1Bix */
    const lla=nca+"LongTrmLoanAdv.";
    St(lla+"TotLTLoanAdv", G(lla+"CapitalAdv")+G(lla+"SecurityDeposits")+G(lla+"LoanAdvRelatedParties")+G(lla+"OthLoanAdv")); /* 1Dv */
    const onc=nca+"OthNonCurrAssets.";
    St(onc+"LTTradeReceivables.TotOthNonCurrAssets", G(onc+"LTTradeReceivables.Secured")+G(onc+"LTTradeReceivables.Unsecured")+G(onc+"LTTradeReceivables.Doubtful")); /* 1Ei */
    St(onc+"Total", G(onc+"LTTradeReceivables.TotOthNonCurrAssets")+G(onc+"Others")); /* 1Eiii */
    const totNCA=G(fa+"TotFixedAsset")+G(nci+"TotNonCurrInvstmnts")+G(nca+"NetDeferredTaxAssets")+G(lla+"TotLTLoanAdv")+G(onc+"Total"); St(nca+"TotNonCurrAssets",totNCA); /* 1F */
    const ca=as+"CurrentAssets.", ci=ca+"CurrInvstmnts.";
    St(ci+"EquityInstruments.Total", G(ci+"EquityInstruments.ListedEquities")+G(ci+"EquityInstruments.UnListedEquities"));
    St(ci+"TotCurrInvstmnts", G(ci+"EquityInstruments.Total")+G(ci+"PreferenceShares")+G(ci+"GovtOrTrustSecurities")+G(ci+"DebenturesOrBonds")+G(ci+"MutualFunds")+G(ci+"InvstmntInPrtnrShipFirm")+G(ci+"OtherInvstmnts")); /* 2Aviii */
    const iv=ca+"Inventories.";
    St(iv+"TotInventries", G(iv+"RawMatl")+G(iv+"WorkInProgress")+G(iv+"FinOrTradGood")+G(iv+"StkInTrade")+G(iv+"StoresConsumables")+G(iv+"LooseTools")+G(iv+"Others")); /* 2Bviii */
    St(ca+"TradeReceivables.TotalTradeReceivables", G(ca+"TradeReceivables.OSMoreThanSixMonths")+G(ca+"TradeReceivables.Others")); /* 2Ciii */
    const ce=ca+"CashNCashEquivalents.";
    St(ce+"TotCashNCashEquivalents", G(ce+"BalWithBanks")+G(ce+"ChequesDrafts")+G(ce+"CashInHand")+G(ce+"Others")); /* 2Dv */
    const stl=ca+"TotShortTermLoanAdv.";
    St(stl+"TotShrtTermLoans", G(stl+"LoanAdv")+G(stl+"Others")); /* 2Eiii */
    const totCA=G(ci+"TotCurrInvstmnts")+G(iv+"TotInventries")+G(ca+"TradeReceivables.TotalTradeReceivables")+G(ce+"TotCashNCashEquivalents")+G(stl+"TotShrtTermLoans")+G(ca+"OtherCurrAssets"); St(ca+"TotCurrAssets",totCA); /* 2G */
    St("bs.Assets.TotalAssets", totNCA+totCA); /* II */
  })();

  /* ---------- Balance Sheet (Ind AS) ---------- */
  (function engBSias(){
    const el="bsias.EquityAndLiablities.";
    const eq=el+"Equity.", esc=eq+"EquityShareCapital.", oe=eq+"OtherEquityReserv.";
    St(esc+"TotShareCapital", G(esc+"IssuedSubsPaidUp")+G(esc+"SubscribedNotFullyPaid")); /* 1Aiv */
    const oeOth=SUM(A(oe+"OtherResrvDtls"),"OthersAmount"); St(oe+"OthersTotal",oeOth);  /* 1Bid */
    St(oe+"TotalOtherResrv", G(oe+"CapRedempResr")+G(oe+"DebunRedResr")+G(oe+"ShareOptOSAmount")+oeOth); /* 1Bie */
    St(oe+"RetainedEarngs", R2.carry);                                                   /* 1Bii fed from P&L Ind-AS */
    St(oe+"TotResrNRetEar", G(oe+"TotalOtherResrv")+R2.carry);                           /* 1Biii */
    const totEq=G(esc+"TotShareCapital")+G(oe+"TotResrNRetEar"); St(oe+"TotalEquity",totEq); /* 1C */
    const li=el+"Liabilities.", ncl=li+"NonCurrLiabilities.", fl=ncl+"FinancialLiabilities.";
    St(fl+"BondsDebentures.Total", G(fl+"BondsDebentures.ForeignCurrency")+G(fl+"BondsDebentures.Rupee"));
    St(fl+"TermLoans.RupeeLoans.Total", G(fl+"TermLoans.RupeeLoans.FromBanks")+G(fl+"TermLoans.RupeeLoans.FromOthers"));
    St(fl+"TermLoans.TotalTermLoans", G(fl+"TermLoans.ForeignCurrency")+G(fl+"TermLoans.RupeeLoans.Total"));
    St(fl+"TotalLTBorrowings", G(fl+"BondsDebentures.Total")+G(fl+"TermLoans.TotalTermLoans")+G(fl+"DeferredPymtLiabilities")+G(fl+"Deposits")+G(fl+"LoansReltdParties")+G(fl+"LongTermMaturities")+G(fl+"LiabilityComp")+G(fl+"OtherLoans")); /* Ii */
    const prv=ncl+"Provisions.";
    const prvOth=SUM(A(prv+"OthersProvisions"),"OthersAmount"); St(prv+"OthersTotal",prvOth);
    St(prv+"TotalProvisions", G(prv+"ProvEmpBenefits")+prvOth); /* IIC */
    const onl=ncl+"OtherNonCurLiabilites.";
    const onlOth=SUM(A(onl+"OthersNonCurrLiab"),"OthersAmount"); St(onl+"OthersTotal",onlOth);
    St(onl+"TotalOthNonCurrLiab", G(onl+"Advances")+onlOth); /* IVc */
    const totNCL=G(fl+"TotalLTBorrowings")+G(fl+"TradePayables")+G(fl+"OtherFinancialLiab")+G(prv+"TotalProvisions")+G(ncl+"DefrdTaxCurrLiabilites")+G(onl+"TotalOthNonCurrLiab"); St(ncl+"TotalNonCurrLiab",totNCL); /* 2A */
    const cl=li+"CurrentLiabilities.", flb=cl+"FinancialLiabBorrowings.";
    St(flb+"LoansRepaybleOnDemand.TotLoansRepaybleOnDemand", G(flb+"LoansRepaybleOnDemand.FromBanks")+G(flb+"LoansRepaybleOnDemand.FrmOtherParties"));
    const flbOth=SUM(A(flb+"BrwngOtherLoans"),"OthersAmount"); St(flb+"OthersTotal",flbOth);
    St(flb+"TotalBorrowings", G(flb+"LoansRepaybleOnDemand.TotLoansRepaybleOnDemand")+G(flb+"LoansFrmRelatedParties")+G(flb+"Deposits")+flbOth); /* Ia */
    const ofl=cl+"OthFinancialLiabilities.";
    const oflOth=SUM(A(ofl+"OthPayables"),"OthersAmount"); St(ofl+"OthersTotal",oflOth);
    St(ofl+"TotOthFinancialLiab", G(ofl+"CurrMatOnLTDebt")+G(ofl+"CurrMatFinanceOblg")+G(ofl+"AccrInterest")+G(ofl+"UnpaidDividend")+G(ofl+"AppMonyRecvdAllotSecurities")+G(ofl+"UnpaidMatDeposits")+G(ofl+"UnpaidMatureDebenture")+oflOth); /* Iiii */
    St(cl+"TottalFinancialLiab", G(flb+"TotalBorrowings")+G(flb+"TradePayables")+G(ofl+"TotOthFinancialLiab")); /* Iiv */
    const ocl=cl+"OtherCuurLiabilities.";
    const advOth=SUM(A(ocl+"OtherAdvance"),"OthersAmount"); St(ocl+"OthersAdvTotal",advOth);
    const othOth=SUM(A(ocl+"Others"),"OthersAmount"); St(ocl+"OthersTotal",othOth);
    St(ocl+"TotalOthCurrLiab", G(ocl+"RevenueRecvdAdvance")+advOth+othOth); /* IId */
    const pv2=cl+"Provosions.";
    const pv2Oth=SUM(A(pv2+"OthersProvisions"),"OthersAmount"); St(pv2+"OthersTotal",pv2Oth);
    St(pv2+"TotalProvosions", G(pv2+"ProvosionEmpBenft")+pv2Oth); /* IIIc */
    St(cl+"TotalCurrentLiab", G(cl+"TottalFinancialLiab")+G(ocl+"TotalOthCurrLiab")+G(pv2+"TotalProvosions")+G(cl+"CurrTaxLiabilities")); /* 2B */
    St(cl+"TotalEquityLiab", totEq+totNCL+G(cl+"TotalCurrentLiab")); /* 1(I) */
    /* Assets — everything non-current under PropertyPlantEquip */
    const ppe="bsias.Assets.NonCurrAssets.PropertyPlantEquip.";
    St(ppe+"NetBlock", Math.max(0, G(ppe+"GrossBlock")-G(ppe+"Depreciation")-G(ppe+"ImpairmentLosses"))); /* Ad */
    St(ppe+"InvstPropNetBlock", Math.max(0, G(ppe+"InvstPropGrossBlock")-G(ppe+"InvstPropDepreciation")-G(ppe+"InvstPropImprLosses"))); /* Cd */
    St(ppe+"GoodWlNetBlock", Math.max(0, G(ppe+"GoodWlGrossBlock")-G(ppe+"GoodWlImprLosses"))); /* Dc */
    St(ppe+"OthIntAstNetBlock", Math.max(0, G(ppe+"OthIntAstGrossBlock")-G(ppe+"OthIntAstAmortisation")-G(ppe+"OthIntAstImprLosses"))); /* Ed */
    St(ppe+"BioAstNetBlock", Math.max(0, G(ppe+"BioAstGrossBlock")-G(ppe+"BioAstImprLosses"))); /* Gc */
    const nfa=ppe+"FinancialAssets.", inv=nfa+"Investments.";
    St(inv+"Total", G(inv+"ListedEquities")+G(inv+"UnListedEquities"));
    const invOth=SUM(A(inv+"OtherInvestment"),"OthersAmount"); St(inv+"OthersTotal",invOth);
    St(inv+"TotalNonCurrentInvst", G(inv+"Total")+G(inv+"InvstPrfShares")+G(inv+"InvstGovtTrust")+G(inv+"InvstInDebenture")+G(inv+"InvstInMutualFunds")+G(inv+"InvstInPartnershpFirm")+invOth); /* HI */
    St(nfa+"TradeReceivables.TotalTradeReceivbls", G(nfa+"TradeReceivables.SecuredConsGoods")+G(nfa+"TradeReceivables.UnSecuredConsGoods")+G(nfa+"TradeReceivables.Doubtful")); /* HII */
    const lo=nfa+"Loans.";
    const loOth=SUM(A(lo+"OtherLoans"),"OthersAmount"); St(lo+"OthersTotal",loOth);
    St(lo+"TotalLoans", G(lo+"SecurityDepsts")+G(lo+"LoansRltdParties")+loOth); /* HIII */
    St(nfa+"OtherFinacialAssets.TotalOthFinancialAsst", G(nfa+"OtherFinacialAssets.BankDeposits")+G(nfa+"OtherFinacialAssets.OtherDeposits")); /* HIV */
    const ona=nfa+"OtherNonCurrentAssets.";
    const onaOth=SUM(A(ona+"OtherNonCurrAsst"),"OthersAmount"); St(ona+"OthersTotal",onaOth);
    St(ona+"TotalNonCurrAsst", G(ona+"CapitalAdvanc")+G(ona+"AdvancOthCapital")+onaOth); /* J */
    St(nfa+"TotalNonCurrntAsst", G(ppe+"NetBlock")+G(ppe+"CapWrkProg")+G(ppe+"InvstPropNetBlock")+G(ppe+"GoodWlNetBlock")+G(ppe+"OthIntAstNetBlock")+G(ppe+"IntAstUndrDevlpmnt")+G(ppe+"BioAstNetBlock")+G(inv+"TotalNonCurrentInvst")+G(nfa+"TradeReceivables.TotalTradeReceivbls")+G(lo+"TotalLoans")+G(nfa+"OtherFinacialAssets.TotalOthFinancialAsst")+G(nfa+"OtherFinacialAssets.DefrdTaxAsst")+G(ona+"TotalNonCurrAsst")); /* total NCA */
    /* current assets */
    const ca="bsias.Assets.CurrentAssets.", cin=ca+"Inventories.";
    St(cin+"TotalInventories", G(cin+"RawMaterials")+G(cin+"WorkInProgress")+G(cin+"FinishedGoods")+G(cin+"StockInTrade")+G(cin+"StoresSpares")+G(cin+"LooseTools")+G(cin+"Others")); /* 2A */
    const cfa=ca+"FinancialAssets.", cinv=cfa+"Investments.";
    St(cinv+"Total", G(cinv+"ListedEquities")+G(cinv+"UnListedEquities"));
    St(cinv+"TotalCurrentInvst", G(cinv+"Total")+G(cinv+"InvstPrfShares")+G(cinv+"InvstGovtTrust")+G(cinv+"InvstInDebenture")+G(cinv+"InvstInMutualFunds")+G(cinv+"InvstInPartnershpFirm")+G(cinv+"OtherInvestment")); /* BI */
    St(cfa+"TradeReceivables.TotalTradeReceivbls", G(cfa+"TradeReceivables.SecuredConsGoods")+G(cfa+"TradeReceivables.UnSecuredConsGoods")+G(cfa+"TradeReceivables.Doubtful")); /* BII */
    const cce=cfa+"CashEquivalents.";
    const cceOth=SUM(A(cce+"OtherCashDtls"),"OthersAmount"); St(cce+"OthersTotal",cceOth);
    St(cce+"TotalCashEquivalents", G(cce+"BalancesWithBanks")+G(cce+"ChequeDraftsInHand")+G(cce+"CashOnHand")+cceOth); /* BIII */
    const clo=cfa+"Loans.";
    const cloOth=SUM(A(clo+"OtherLoans"),"OthersAmount"); St(clo+"OthersTotal",cloOth);
    St(clo+"TotalLoans", G(clo+"SecurityDepsts")+G(clo+"LoansRltdParties")+cloOth); /* BV */
    St(cfa+"TotalFinancialAsst", G(cinv+"TotalCurrentInvst")+G(cfa+"TradeReceivables.TotalTradeReceivbls")+G(cce+"TotalCashEquivalents")+G(cce+"BankBalanceOther")+G(clo+"TotalLoans")+G(cfa+"OtherFinancialAsst")); /* 2B */
    const oca=cfa+"OtherCurrentAssets.";
    const ocaOth=SUM(A(oca+"OthersCurrentAssts"),"OthersAmount"); St(oca+"OthersTotal",ocaOth);
    St(oca+"TotalOthCurrentAsst", G(oca+"AdvancOthCapital")+ocaOth); /* 2D */
    St(oca+"TotalCurrAsst", G(cin+"TotalInventories")+G(cfa+"TotalFinancialAsst")+G(cfa+"CurrentTaxAsst")+G(oca+"TotalOthCurrentAsst")); /* total CA */
    St("bsias.Assets.TotalAssets", G(nfa+"TotalNonCurrntAsst")+G(oca+"TotalCurrAsst")); /* II */
  })();

  /* ---------- Part A - OI (Other Information) ---------- */
  (function engOI(){
    const o="oi.";
    /* items 3a/3b fed from Schedule ICDS (published by section bp) — the ITR-5 fix */
    const icds=S.C.icds||{};
    if(icds.totInc||icds.totDec){ St(o+"ProfDeviatDueAcctMeth", icds.totInc||0); St(o+"DecProOrIncLossUs145_2", icds.totDec||0); }
    St(o+"NoCredToPLAmt.TotNoCredToPLAmt", G(o+"NoCredToPLAmt.Section28Items")+G(o+"NoCredToPLAmt.ProformaCreditsDue")+G(o+"NoCredToPLAmt.PrevYrEscalClaim")+G(o+"NoCredToPLAmt.OthItemInc")+G(o+"NoCredToPLAmt.CapReceipt")); /* 5f */
    const s36=["StkInsurPrem","EmpHealthInsurPrem","EmpBonusCommSum","IntOnBorrCap","ZeroCoupBondDisc","RecogPFContribAmt","AppSuperAnnFundAmt","PensionSchemeSec80CCD","AppGratFundAmt","OthFundAmt","EmpContributionCredits","BadDebtDoubtAmt","BadDebtDoubtProvn","SpecResrvTranfr","FamPlanPromoExp","SecuritiesPaidAmt","MrktLossOthExpLossICDS","AnyOthDisallowance"];
    St(o+"AmtDisallUs36.TotAmtDisallUs36", s36.reduce((a,k)=>a+G(o+"AmtDisallUs36."+k),0)); /* 6s */
    St(o+"AmtDisallUs36.NoOfEmployeesEmployed.Total", G(o+"AmtDisallUs36.NoOfEmployeesEmployed.DeployedInIndia")+G(o+"AmtDisallUs36.NoOfEmployeesEmployed.DeployedOutSideIndia")); /* 6t(iii) */
    const s37=["CapitalNatureExp","PersonalExp","BusOrProfessnExp","PoliticPartyExp","LawVoilatPenalExp","OthPenalFineExp","OffenceExp","SocialRespCSR","ContigentLiability","OthAmtNotAllowUs37"];
    St(o+"AmtDisallUs37.TotAmtDisallUs37", s37.reduce((a,k)=>a+G(o+"AmtDisallUs37."+k),0)); /* 7k */
    const s40=["NonCompChapXVIIBAmt","NonComp40aiaChapXVIIBAmt","NonComp40aibChapXVIIBAmt","NonComp40aiiiChapXVIIBAmt","TaxAmtOnProfits","WTAmt","RolyatyOrServiceFee","IntSalBonPartner","AnyOthDisallowance"];
    St(o+"AmtDisallUs40.TotAmtDisallUs40", s40.reduce((a,k)=>a+G(o+"AmtDisallUs40."+k),0)); /* 8Aj */
    const s40A=["AmtPaidUs40A2b","AmtGT20kCash","ProvPmtGrat","ContToSetupTrust","AnyOthDisallowance"];
    St(o+"AmtDisallUs40A.TotAmtDisallUs40A", s40A.reduce((a,k)=>a+G(o+"AmtDisallUs40A."+k),0)); /* 9f */
    const b43=["TaxDutyCesAmt","ContToEmpPFSFGF","EmpBonusComm","IntPayaleToFI","SumPayaleLoanBrToFinComp","IntPayaleToFISchBank","LeaveEncashPayable","RailwayAsstsPyble","MSEPayable"];
    St(o+"AmtDisallUs43BPyNowAll.AmtUs43B.TotAmtUs43b", b43.reduce((a,k)=>a+G(o+"AmtDisallUs43BPyNowAll.AmtUs43B."+k),0)); /* 10i */
    St(o+"AmtDisall43B.AmtUs43B.TotAmtUs43b", b43.reduce((a,k)=>a+G(o+"AmtDisall43B.AmtUs43B."+k),0)); /* 11i */
    const oe=o+"AmtExciseCustomsVATOutstanding.ExciseCustomsVAT.";
    St(oe+"TotExciseCustomsVAT", G(oe+"UnionExciseDuty")+G(oe+"ServiceTax")+G(oe+"VATorSaleTax")+G(oe+"CentralGoodServiceTax")+G(oe+"StateGoodServiceTax")+G(oe+"IntegratedGoodServiceTax")+G(oe+"UnionTerrGoodServiceTax")+G(oe+"OthDutyTaxCess")); /* 12i */
    St(o+"DeemedProfUs33ABs", Math.max(0, G(o+"DeemedProfUs33AB")+G(o+"DeemedProfUs33ABA")+G(o+"DeemedProfUs33AC"))); /* item 13 */
  })();

  /* ---------- Part A - OL (company under liquidation) ---------- */
  (function engOL(){
    const o="ol.";
    St(o+"OpeningBal.TotalOpenBal", G(o+"OpeningBal.CashInHand")+G(o+"OpeningBal.CashInBank")); /* 1iii */
    const sale=SUM(A(o+"Receipts.SaleOfAssets.SaleOfAssetsDtls"),"OthAmount"); St(o+"Receipts.TotalSaleofAssets",sale); /* 2iiib */
    const orec=SUM(A(o+"Receipts.OthersIncRec.OthersIncDtls"),"OthAmount"); St(o+"Receipts.TotOthersReceiptsOnly",orec); /* 2vb */
    const totRec=G(o+"Receipts.Interest")+G(o+"Receipts.Dividend")+sale+G(o+"Receipts.RlznDuesDebtors")+orec; St(o+"Receipts.TotalOfReceipts",totRec); /* 2vi */
    St(o+"TotalOpenReceipts", G(o+"OpeningBal.TotalOpenBal")+totRec); /* 3 */
    const opay=SUM(A(o+"Payments.OthersPayments.OthersPaymentsDtls"),"OthAmount"); St(o+"Payments.TotalOthersPayments",opay); /* 4vb */
    const totPay=G(o+"Payments.RepaymentSecuredloan")+G(o+"Payments.RepaymentUnsecuredloan")+G(o+"Payments.RepaymentCreditors")+G(o+"Payments.Commission")+opay; St(o+"Payments.TotalPayments",totPay); /* 4vi */
    St(o+"ClosingStock.TotalClBal", G(o+"ClosingStock.CashInHand")+G(o+"ClosingStock.CashInBank")); /* 5iii */
    St(o+"TotalClPaymnts", totPay+G(o+"ClosingStock.TotalClBal")); /* 6 */
  })();

  /* ================= feeds & head roll-up =================
     The accounts produce the statements; Schedule BP (section bp) computes
     the PGBP head and rolls it into GTI, so income=0 (no double count).
     Publish the figures BP / MAT / checks read. */
  S.C.accounts = {
    income:0,
    pbt:R1.pbt, pbtIndAs:R2.pbt,           /* P&L item 53 -> Schedule BP book-profit start */
    grossProfitTrading:R(G("trd.GrossProfitFrmBusProf")),
    grossProfitTradingIndAs:R(G("trdias.GrossProfitFrmBusProf")),
    costOfGoodsPrdcd:R(mCOGP), costOfGoodsPrdcdIndAs:R(mCOGPias),
    depreciationPL:R(G("pl.DebitsToPL.DebitPlAcnt.DepreciationAmort")),
    depreciationPLIndAs:R(G("plias.DebitsToPL.DebitPlAcnt.DepreciationAmort")),
    totComprIncome:R(G("plias.OtherComprnsvInc.TotalComprIncome")),
    bsTotEL:R(G("bs.EquityAndLiablities.TotEquityAndLiabilities")), bsTotAsset:R(G("bs.Assets.TotalAssets")),
    bsMismatch:R(G("bs.EquityAndLiablities.TotEquityAndLiabilities"))!==R(G("bs.Assets.TotalAssets")),
    biasTotEL:R(G("bsias.EquityAndLiablities.Liabilities.CurrentLiabilities.TotalEquityLiab")), biasTotAsset:R(G("bsias.Assets.TotalAssets")),
    biasMismatch:R(G("bsias.EquityAndLiablities.Liabilities.CurrentLiabilities.TotalEquityLiab"))!==R(G("bsias.Assets.TotalAssets")),
    olIn:R(G("ol.TotalOpenReceipts")), olOut:R(G("ol.TotalClPaymnts")),
    olMismatch:R(G("ol.TotalOpenReceipts"))!==R(G("ol.TotalClPaymnts")),
    /* OI feeds -> Schedule BP add-backs / allowances */
    oi:{
      profDeviat:R(G("oi.ProfDeviatDueAcctMeth")),        /* 3a (ICDS increase) -> BP 25 */
      decProfDeviat:R(G("oi.DecProOrIncLossUs145_2")),    /* 3b (ICDS decrease) -> BP 33 */
      stockDevInc:R(G("oi.MethodOfValClgStk.EffectOnPL")),/* 4d 145A stock deviation -> BP 25 */
      stockDevDec:R(G("oi.MethodOfValClgStk.DecProOrIncLossUs145_A")), /* 4e -> BP 33 */
      noCredPL:R(G("oi.NoCredToPLAmt.TotNoCredToPLAmt")), /* 5f */
      disall36:R(G("oi.AmtDisallUs36.TotAmtDisallUs36")), /* 6s */
      disall37:R(G("oi.AmtDisallUs37.TotAmtDisallUs37")), /* 7k */
      disall40:R(G("oi.AmtDisallUs40.TotAmtDisallUs40")), /* 8Aj */
      disall40Prev:R(G("oi.AmtDisallUs40.AnyAmtOfSec40AllowPrevYr")), /* 8B -> BP */
      disall40A:R(G("oi.AmtDisallUs40A.TotAmtDisallUs40A")), /* 9f */
      amt43BNowAllow:R(G("oi.AmtDisallUs43BPyNowAll.AmtUs43B.TotAmtUs43b")), /* 10i -> BP */
      amt43BDisallow:R(G("oi.AmtDisall43B.AmtUs43B.TotAmtUs43b")),           /* 11i -> BP */
      exciseOutstanding:R(G("oi.AmtExciseCustomsVATOutstanding.ExciseCustomsVAT.TotExciseCustomsVAT")), /* 12i */
      deemedProf33:R(G("oi.DeemedProfUs33ABs")),          /* item 13 = 33AB/33ABA/33AC */
      profTaxUs41:R(G("oi.ProfTaxAmtUs41")),              /* item 14 -> BP */
      priorPeriod:R(G("oi.PriorAmtIncCrDrPL")),           /* item 15 -> BP */
      exp14A:R(G("oi.AmountOfExpDisAllwUs14A")),          /* item 16 */
      intSMEDisallow:R(G("oi.InterestDisAllowUs23SMEAct")), /* item 17 */
      tpsaFlag:st0(get("accounts.oi.ScheduleTPSAFlg"))    /* item 18 -> Schedule TPSA */
    }
  };
}

/* helper: does an object subtree carry any nonzero number / any array row / text? */
function _accHas(o){
  if(o==null)return false;
  if(Array.isArray(o))return o.length>0;
  if(typeof o==="object")return Object.keys(o).some(k=>_accHas(o[k]));
  if(typeof o==="number")return R(o)!==0;
  return st0(o)!=="";
}

/* ================================================================
   SCREEN — every live book row -> a field; computed rows -> cell().
   Part A accounts are not regime-closed, so no isNew() gating.
   ================================================================ */
function _acRi(l,pth,ref,o){o=o||{};return row(l,inp("accounts."+pth,{n:1}),{ref:ref,ind:o.ind,hint:o.hint,req:o.req,cls:o.cls});}
function _acRt(l,pth,ref,o){o=o||{};return row(l,inp("accounts."+pth,{max:o.max,ph:o.ph}),{ref:ref,ind:o.ind,hint:o.hint,req:o.req});}
function _acRc(l,pth,ref,o){o=o||{};return row(l,cell(N(get("accounts."+pth))),{ref:ref,ind:o.ind,cls:o.cls||"tot",hint:o.hint});}
function _acRsel(l,pth,opts,ref,o){o=o||{};return row(l,sel("accounts."+pth,opts,{blank:o.blank}),{ref:ref,req:o.req,hint:o.hint});}
function _acArr(p){const a=get("accounts."+p);return Array.isArray(a)?a:[];}
const _acV=p=>N(get("accounts."+p));
/* a "specify nature and amount" table with OthersDesc/OthersAmount (Ind-AS style) */
function _acOthTbl(pth,addLabel){return grid("accounts."+pth,
  [{k:"OthersDesc",h:"Nature",t:"txt",w:"auto",req:1,max:50},{k:"OthersAmount",h:"Amount",t:"num",w:"160px",req:1}],
  _acArr(pth),{min:"480px",empty:"Nothing entered.",add:addLabel||"Add a row"});}

/* ---------- Manufacturing Account (shared: regular / Ind-AS) ---------- */
function accMfg(pf){
  const o=pf+".OpeningInventory.";let m="";
  m+=sub("1 — Debits to the Manufacturing Account");
  m+=_acRi("Opening stock of raw material",o+"OpngStckRawMat","1Ai",{ind:1});
  m+=_acRi("Opening stock of work in progress",o+"OpngStckWrkinPrgrs","1Aii",{ind:1});
  m+=_acRc("Total opening inventory (i + ii)",o+"OpngInvntryTotal","1Aiii");
  m+=_acRi("Purchases (net of refunds and duty or tax)",o+"Purchases","1B");
  m+=_acRi("Direct wages",o+"DirectWages","1C");
  m+=_acRi("Carriage inward",o+"CarriageInward","1Di",{ind:1});
  m+=_acRi("Power and fuel",o+"PowerAndFuel","1Dii",{ind:1});
  m+=_acRi("Other direct expenses",o+"OthDirectExpenses","1Diii",{ind:1});
  m+=_acRc("Direct expenses (Di + Dii + Diii)",o+"DirectExpenses","1D");
  m+=sub("1E — Factory overheads");
  m+=_acRi("Indirect wages",o+"IndirectWages","1Ei",{ind:1});
  m+=_acRi("Factory rent and rates",o+"FactoryRentAndRates","1Eii",{ind:1});
  m+=_acRi("Factory insurance",o+"FactoryInsurance","1Eiii",{ind:1});
  m+=_acRi("Factory fuel and power",o+"FactoryFuelAndPower","1Eiv",{ind:1});
  m+=_acRi("Factory general expenses",o+"FactoryGeneralExpenses","1Ev",{ind:1});
  m+=_acRi("Depreciation of factory machinery",o+"DeprctnOfFactoryMachinery","1Evi",{ind:1});
  m+=_acRc("Total factory overheads (i to vi)",o+"TotalFactoryOverheads","1Evii");
  m+=_acRc("Total of debits to Manufacturing Account (Aiii + B + C + D + Evii)",o+"TotalDebtsManfctrngAcc","1F");
  m+=sub("2 — Closing stock");
  m+=_acRi("Raw material",pf+".ClosingStock.ClsngStckRawMaterial","2i",{ind:1});
  m+=_acRi("Work-in-progress",pf+".ClosingStock.ClsngStckWrkInPrgrs","2ii",{ind:1});
  m+=_acRc("Total closing stock (2i + 2ii)",pf+".ClosingStock.ClsngStckTotal","2iii");
  m+=_acRc("Cost of Goods Produced — transferred to Trading Account (1F − 2)",pf+".CostOfGoodsPrdcd","3",{hint:"may be negative; feeds Trading item 11"});
  return m;
}

/* ---------- Trading Account (shared: regular / Ind-AS) ---------- */
function accTrd(pf){
  let t="";
  t+=sub("4 — Revenue from operations");
  t+=_acRi("Sale of goods",pf+".SaleOfGoods","4Ai");
  t+=_acRi("Sale of services",pf+".SaleOfServices","4Aii");
  t+=grid("accounts."+pf+".OtherOperatingRevenueDtls",
    [{k:"OperatingRevenueName",h:"Other operating revenue — nature",t:"txt",w:"auto",req:1,max:125},{k:"OperatingRevenueAmt",h:"Amount",t:"num",w:"150px",req:1}],
    _acArr(pf+".OtherOperatingRevenueDtls"),{min:"520px",empty:"No other operating revenue.",add:"Add other operating revenue"});
  t+=_acRc("Total other operating revenues",pf+".OperatingRevenueTotal","4Aiiic");
  t+=_acRc("Total sales / gross receipts (i + ii + iiic)",pf+".SalesGrossReceiptsTotal","4Aiv");
  t+=_acRi("Gross receipts from profession",pf+".GrossRcptFromProfession","4B");
  t+=sub("4C — Duties, taxes and cess received or receivable on goods and services sold");
  t+=_acRi("Union excise duties",pf+".ExciseCustomsVAT.UnionExciseDuty","4Ci",{ind:1});
  t+=_acRi("Service tax",pf+".ExciseCustomsVAT.ServiceTax","4Cii",{ind:1});
  t+=_acRi("VAT / Sales tax",pf+".ExciseCustomsVAT.VATorSaleTax","4Ciii",{ind:1});
  t+=_acRi("Central GST (CGST)",pf+".ExciseCustomsVAT.CentralGoodServiceTax","4Civ",{ind:1});
  t+=_acRi("State GST (SGST)",pf+".ExciseCustomsVAT.StateGoodServiceTax","4Cv",{ind:1});
  t+=_acRi("Integrated GST (IGST)",pf+".ExciseCustomsVAT.IntegratedGoodServiceTax","4Cvi",{ind:1});
  t+=_acRi("Union Territory GST (UTGST)",pf+".ExciseCustomsVAT.UnionTerrGoodServiceTax","4Cvii",{ind:1});
  t+=_acRi("Any other duty, tax and cess",pf+".ExciseCustomsVAT.OthDutyTaxCess","4Cviii",{ind:1});
  t+=_acRc("Total (4Ci to 4Cviii)",pf+".ExciseCustomsVAT.TotExciseCustomsVAT","4Cix");
  t+=_acRc("Total Revenue from operations (Aiv + B + Cix)",pf+".TotRevenueFrmOperations","4D");
  t+=_acRi("5 — Closing Stock of Finished Stocks",pf+".ClsngStckOfFinishedStcks","5");
  t+=_acRc("6 — Total of credits to Trading Account (4D + 5)",pf+".TardingAccTotCred","6");
  t+=sub("Debits");
  t+=_acRi("7 — Opening Stock of Finished Goods",pf+".OpngStckOfFinishedStcks","7");
  t+=_acRi("8 — Purchases (net of refunds and duty or tax)",pf+".Purchases","8");
  t+=_acRi("Carriage inward",pf+".CarriageInward","9i",{ind:1});
  t+=_acRi("Power and fuel",pf+".PowerAndFuel","9ii",{ind:1});
  t+=grid("accounts."+pf+".OtherDirectExpenses",
    [{k:"NatureOfDirectExpense",h:"Other direct expenses — nature",t:"txt",w:"auto",req:1,max:125},{k:"Amount",h:"Amount",t:"num",w:"150px",req:1}],
    _acArr(pf+".OtherDirectExpenses"),{min:"520px",empty:"No other direct expenses.",add:"Add other direct expense"});
  t+=_acRc("Total other direct expenses (9iii)",pf+".TotOthDirectExpenses","9iii");
  t+=_acRc("9 — Direct Expenses (9i + 9ii + 9iii)",pf+".DirectExpenses","9");
  t+=sub("10 — Duties and taxes, paid or payable, on goods and services purchased");
  t+=_acRi("Custom duty",pf+".DutyTaxPay.ExciseCustomsVAT.CustomDuty","10i",{ind:1});
  t+=_acRi("Counter veiling duty",pf+".DutyTaxPay.ExciseCustomsVAT.CounterVailDuty","10ii",{ind:1});
  t+=_acRi("Special additional duty",pf+".DutyTaxPay.ExciseCustomsVAT.SplAddDuty","10iii",{ind:1});
  t+=_acRi("Union excise duty",pf+".DutyTaxPay.ExciseCustomsVAT.UnionExciseDuty","10iv",{ind:1});
  t+=_acRi("Service tax",pf+".DutyTaxPay.ExciseCustomsVAT.ServiceTax","10v",{ind:1});
  t+=_acRi("VAT / Sales tax",pf+".DutyTaxPay.ExciseCustomsVAT.VATorSaleTax","10vi",{ind:1});
  t+=_acRi("Central GST (CGST)",pf+".DutyTaxPay.ExciseCustomsVAT.CentralGoodServiceTax","10vii",{ind:1});
  t+=_acRi("State GST (SGST)",pf+".DutyTaxPay.ExciseCustomsVAT.StateGoodServiceTax","10viii",{ind:1});
  t+=_acRi("Integrated GST (IGST)",pf+".DutyTaxPay.ExciseCustomsVAT.IntegratedGoodServiceTax","10ix",{ind:1});
  t+=_acRi("Union Territory GST (UTGST)",pf+".DutyTaxPay.ExciseCustomsVAT.UnionTerrGoodServiceTax","10x",{ind:1});
  t+=_acRi("Any other tax, paid or payable",pf+".DutyTaxPay.ExciseCustomsVAT.OthDutyTaxCess","10xi",{ind:1});
  t+=_acRc("Total (10i to 10xi)",pf+".DutyTaxPay.ExciseCustomsVAT.TotExciseCustomsVAT","10xii");
  t+=_acRc("11 — Cost of goods produced — transferred from Manufacturing Account",pf+".GoodsCostPrdcdFrmMA","11",{hint:"fed from the Manufacturing Account"});
  t+=_acRc("12 — Gross Profit transferred to P&L (6 − 7 − 8 − 9 − 10xii − 11)",pf+".GrossProfitFrmBusProf","12",{hint:"may be negative"});
  t+=sub("Intraday and Futures & Options appendix");
  t+=_acRi("12a — Turnover from Intraday Trading",pf+".IntradayTradingTurnOver","12a");
  t+=_acRi("12b — Income from Intraday Trading (to P&L)",pf+".IntradayTradingIncome","12b");
  t+=_acRi("12c — Turnover from Futures & Options Trading",pf+".TurnoverFutureTrd","12c");
  t+=_acRi("12d — Income from Futures & Options Trading (to P&L)",pf+".IncomeFutureTrd","12d");
  return t;
}

/* ---------- Statement of Profit & Loss (shared: regular / Ind-AS) ---------- */
function accPL(pf, isIas){
  const c=pf+".CreditsToPL.", oi=c+"OthIncome.", d=pf+".DebitsToPL.DebitPlAcnt.", tp=pf+".DebitsToPL.TaxProvAppr.";
  const incAmt=isIas?"OthersAmount":"Amount", incNat=isIas?"OthersDesc":"NatureOfIncome";
  let s="";
  s+=sub("Credits to the Statement of Profit and Loss");
  s+=_acRc("13 — Gross profit transferred from Trading Account (12 + 12b + 12d)",c+"GrossProfitTrnsfFrmTrdAcc","13",{hint:"fed from the Trading Account"});
  s+=sub("14 — Other income");
  s+=_acRi("Rent",oi+"RentInc","14i",{ind:1});
  s+=_acRi("Commission",oi+"Comissions","14ii",{ind:1});
  s+=_acRi("Dividend income",oi+"Dividends","14iii",{ind:1});
  s+=_acRi("Interest income",oi+"InterestInc","14iv",{ind:1});
  s+=_acRi("Profit on sale of fixed assets",oi+"ProfitOnSaleFixedAsset","14v",{ind:1});
  s+=_acRi("Profit on sale of investment (securities chargeable to STT)",oi+"ProfitOnInvChrSTT","14vi",{ind:1});
  s+=_acRi("Profit on sale of other investment",oi+"ProfitOnOthInv","14vii",{ind:1});
  s+=_acRi("Gain (loss) on foreign exchange fluctuation u/s 43AA",oi+"ProfitOnCurrFluct","14viii",{ind:1});
  s+=_acRi("Profit on conversion of inventory into capital asset u/s 28(via)",oi+"ProfitOnCnvInvntryToCapAsst","14ix",{ind:1});
  s+=_acRi("Agricultural income",oi+"ProfitOnAgriIncome","14x",{ind:1});
  s+=grid("accounts."+oi+"OtherIncDtls",
    [{k:incNat,h:"Any other income — nature",t:"txt",w:"auto",req:1,max:125},{k:incAmt,h:"Amount",t:"num",w:"150px",req:1}],
    _acArr(oi+"OtherIncDtls"),{min:"520px",empty:"No other income.",add:"Add other income"});
  s+=_acRi("Liabilities written back",oi+"LiabilityWrittenBack","14xia",{ind:1});
  s+=_acRi("Interest due or received from partnership firm",oi+"AmtofInterest","14xib",{ind:1});
  s+=_acRc("Total any other income (xia + xib + table)",oi+"MiscOthIncome","14xic");
  s+=_acRc("14xii — Total of other income",oi+"TotOthIncome","14xii");
  s+=_acRc("15 — Total of credits to statement of profit and loss (13 + 14xii)",c+"TotCreditsToPL","15");
  s+=sub("Debits to the Statement of Profit and Loss");
  s+=_acRi("16 — Freight outward",d+"Freight","16");
  s+=_acRi("17 — Consumption of stores and spare parts",d+"ConsumptionOfStores","17");
  s+=_acRi("18 — Power and fuel",d+"PowerFuel","18");
  s+=_acRi("19 — Rents",d+"RentExpdr","19");
  s+=_acRi("20 — Repairs to building",d+"RepairsBldg","20");
  s+=_acRi("21 — Repairs to machinery",d+"RepairMach","21");
  s+=sub("22 — Compensation to employees");
  s+=_acRi("Salaries and wages",d+"EmployeeComp.SalsWages","22i",{ind:1});
  s+=_acRi("Bonus",d+"EmployeeComp.Bonus","22ii",{ind:1});
  s+=_acRi("Reimbursement of medical expenses",d+"EmployeeComp.MedExpReimb","22iii",{ind:1});
  s+=_acRi("Leave encashment",d+"EmployeeComp.LeaveEncash","22iv",{ind:1});
  s+=_acRi("Leave travel benefits",d+"EmployeeComp.LeaveTravelBenft","22v",{ind:1});
  s+=_acRi("Contribution to approved superannuation fund",d+"EmployeeComp.ContToSuperAnnFund","22vi",{ind:1});
  s+=_acRi("Contribution to recognised provident fund",d+"EmployeeComp.ContToPF","22vii",{ind:1});
  s+=_acRi("Contribution to recognised gratuity fund",d+"EmployeeComp.ContToGratFund","22viii",{ind:1});
  s+=_acRi("Contribution to any other fund",d+"EmployeeComp.ContToOthFund","22ix",{ind:1});
  s+=_acRi("Any other benefit to employees",d+"EmployeeComp.OthEmpBenftExpdr","22x",{ind:1});
  s+=_acRc("22xi — Total compensation to employees",d+"EmployeeComp.TotEmployeeComp","22xi");
  s+=_acRsel("Any compensation in 22xi paid to non-residents?",d+"EmployeeComp.AnyCompPaidToNonRes",ACC_YN2,"22xiia");
  s+=_acRi("If Yes, amount paid to non-residents",d+"EmployeeComp.AmtPaidToNonRes","22xiib",{ind:1});
  s+=sub("23 — Insurance");
  s+=_acRi("Medical Insurance",d+"Insurances.MedInsur","23i",{ind:1});
  s+=_acRi("Life Insurance",d+"Insurances.LifeInsur","23ii",{ind:1});
  s+=_acRi("Keyman's Insurance",d+"Insurances.KeyManInsur","23iii",{ind:1});
  s+=_acRi("Other Insurance (factory, office, car, goods, etc.)",d+"Insurances.OthInsur","23iv",{ind:1});
  s+=_acRc("23v — Total expenditure on insurance",d+"Insurances.TotInsurances","23v");
  s+=_acRi("24 — Workmen and staff welfare expenses",d+"StaffWelfareExp","24");
  s+=_acRi("25 — Entertainment",d+"Entertainment","25");
  s+=_acRi("26 — Hospitality",d+"Hospitality","26");
  s+=_acRi("27 — Conference",d+"Conference","27");
  s+=_acRi("28 — Sales promotion (other than advertisement)",d+"SalePromoExp","28");
  s+=_acRi("29 — Advertisement",d+"Advertisement","29");
  s+=sub("30 — Commission");
  s+=_acRi("Paid outside India / to a non-resident (not a company)",d+"CommissionExpdrDtls.NonResOtherCompany","30i",{ind:1});
  s+=_acRi("To others",d+"CommissionExpdrDtls.Others","30ii",{ind:1});
  s+=_acRc("30iii — Total commission",d+"CommissionExpdrDtls.Total","30iii");
  s+=sub("31 — Royalty");
  s+=_acRi("Paid outside India / to a non-resident (not a company)",d+"RoyalityDtls.NonResOtherCompany","31i",{ind:1});
  s+=_acRi("To others",d+"RoyalityDtls.Others","31ii",{ind:1});
  s+=_acRc("31iii — Total royalty",d+"RoyalityDtls.Total","31iii");
  s+=sub("32 — Professional / consultancy / technical fees");
  s+=_acRi("Paid outside India / to a non-resident (not a company)",d+"ProfessionalConstDtls.NonResOtherCompany","32i",{ind:1});
  s+=_acRi("To others",d+"ProfessionalConstDtls.Others","32ii",{ind:1});
  s+=_acRc("32iii — Total professional fees",d+"ProfessionalConstDtls.Total","32iii");
  s+=_acRi("33 — Hotel, boarding and lodging",d+"HotelBoardLodge","33");
  s+=_acRi("34 — Travelling expenses (other than foreign)",d+"TravelExp","34");
  s+=_acRi("35 — Foreign travelling expenses",d+"ForeignTravelExp","35");
  s+=_acRi("36 — Conveyance expenses",d+"ConveyanceExp","36");
  s+=_acRi("37 — Telephone expenses",d+"TelephoneExp","37");
  s+=_acRi("38 — Guest house expenses",d+"GuestHouseExp","38");
  s+=_acRi("39 — Club expenses",d+"ClubExp","39");
  s+=_acRi("40 — Festival celebration expenses",d+"FestivalCelebExp","40");
  s+=_acRi("41 — Scholarship",d+"Scholarship","41");
  s+=_acRi("42 — Gift",d+"Gift","42");
  s+=_acRi("43 — Donation",d+"Donation","43");
  s+=sub("44 — Rates and taxes paid or payable (excluding taxes on income)");
  s+=_acRi("Union excise duty",d+"RatesTaxesPays.ExciseCustomsVAT.UnionExciseDuty","44i",{ind:1});
  s+=_acRi("Service tax",d+"RatesTaxesPays.ExciseCustomsVAT.ServiceTax","44ii",{ind:1});
  s+=_acRi("VAT / Sales tax",d+"RatesTaxesPays.ExciseCustomsVAT.VATorSaleTax","44iii",{ind:1});
  s+=_acRi("Cess",d+"RatesTaxesPays.ExciseCustomsVAT.Cess","44iv",{ind:1});
  s+=_acRi("Central GST (CGST)",d+"RatesTaxesPays.ExciseCustomsVAT.CentralGoodServiceTax","44v",{ind:1});
  s+=_acRi("State GST (SGST)",d+"RatesTaxesPays.ExciseCustomsVAT.StateGoodServiceTax","44vi",{ind:1});
  s+=_acRi("Integrated GST (IGST)",d+"RatesTaxesPays.ExciseCustomsVAT.IntegratedGoodServiceTax","44vii",{ind:1});
  s+=_acRi("Union Territory GST (UTGST)",d+"RatesTaxesPays.ExciseCustomsVAT.UnionTerrGoodServiceTax","44viii",{ind:1});
  s+=_acRi("Any other rate/tax/duty/cess incl. STT and CTT",d+"RatesTaxesPays.ExciseCustomsVAT.OthDutyTaxCess","44ix",{ind:1});
  s+=_acRc("44x — Total rates and taxes",d+"RatesTaxesPays.ExciseCustomsVAT.TotExciseCustomsVAT","44x");
  s+=_acRi("45 — Audit fee",d+"AuditFee","45");
  s+=sub("46 — Other expenses");
  s+=grid("accounts."+d+"OtherExpensesDtls",
    [{k:"ExpenseNature",h:"Other expenses — nature",t:"txt",w:"auto",req:1,max:125},{k:"Amount",h:"Amount",t:"num",w:"150px",req:1}],
    _acArr(d+"OtherExpensesDtls"),{min:"520px",empty:"No other expenses.",add:"Add other expense"});
  s+=_acRc("46 — Total other expenses",d+"OtherExpenses","46");
  s+=sub("47 — Bad debts");
  s+=grid("accounts."+d+"BadDebtDtls.BadDebtAmtDtls",
    [{k:"PAN",h:"PAN",t:"txt",w:"130px",max:10},{k:"Aadhaar",h:"Aadhaar",t:"txt",w:"150px",max:12},{k:"Amount",h:"Amount",t:"num",w:"150px",req:1}],
    _acArr(d+"BadDebtDtls.BadDebtAmtDtls"),{min:"520px",empty:"None (Rs 1 lakh or more, with PAN/Aadhaar).",add:"Add bad debt (with PAN/Aadhaar)"});
  s+=_acRc("47i — Total (with PAN/Aadhaar)",d+"BadDebtDtls.BadDebtAmtDtlsTotal","47i");
  s+=note("47ii — Others (more than Rs 1 lakh) where PAN/Aadhaar is not available (provide name and complete address).");
  s+=grid("accounts."+d+"BadDebtDtls.OthersPANNotAvlblDtl",
    [{k:"Name",h:"Name",t:"txt",w:"auto",req:1,max:75},{k:"FlatDoorBlockNumber",h:"Flat/Door/Block",t:"txt",w:"auto",req:1,max:50},
     {k:"PremisesBuildingName",h:"Premises/Building",t:"txt",w:"auto",max:50},{k:"RoadStreetPostOffice",h:"Road/Street/PO",t:"txt",w:"auto",max:50},
     {k:"AreaLocality",h:"Area/Locality",t:"txt",w:"auto",req:1,max:50},{k:"TownCityDistrict",h:"Town/City/District",t:"txt",w:"auto",req:1,max:50},
     {k:"StateCode",h:"State",t:"sel",opts:ACC_STATE,req:1},{k:"CountryCode",h:"Country",t:"sel",opts:ACC_CTRY,req:1},
     {k:"PinCode",h:"PIN",t:"num",w:"110px"},{k:"ZipCode",h:"ZIP",t:"txt",w:"110px",max:15},{k:"Amount",h:"Amount",t:"num",w:"140px",req:1}],
    _acArr(d+"BadDebtDtls.OthersPANNotAvlblDtl"),{min:"1400px",empty:"None (no-PAN, with address).",add:"Add bad debt (no PAN — with address)"});
  s+=_acRc("47ii — Total (no PAN, with address)",d+"BadDebtDtls.OthersPANNotAvlblDtlTotal","47ii");
  s+=_acRi("47iii — Others (amounts less than Rs 1 lakh)",d+"BadDebtDtls.OthersAmtLt1Lakh","47iii");
  s+=_acRc("47iv — Total Bad Debt (47i + 47ii + 47iii)",d+"BadDebtDtls.BadDebt","47iv");
  s+=_acRi("48 — Provision for bad and doubtful debts",d+"ProvForBadDoubtDebt","48");
  s+=_acRi("49 — Other provisions",d+"OthProvisionsExpdr","49");
  s+=_acRc("50 — Profit before interest, depreciation and taxes (PBIDTA)",d+"PBIDTA","50");
  s+=sub("51 — Interest");
  s+=_acRi("Paid outside India / to a non-resident (not a company)",d+"InterestExpdrtDtls.NonResOtherCompany","51i",{ind:1});
  s+=_acRi("To others",d+"InterestExpdrtDtls.Others","51ii",{ind:1});
  s+=_acRc("51iii — Total interest",d+"InterestExpdrtDtls.InterestExpdr","51iii");
  s+=_acRi("52 — Depreciation and amortization",d+"DepreciationAmort","52");
  s+=_acRc("53 — Net Profit before taxes (50 − 51iii − 52)",d+"PBT","53",{hint:"starting figure for Schedule BP"});
  s+=sub("Provisions for tax and appropriations");
  s+=_acRi("54 — Provision for current tax",tp+"ProvForCurrTax","54");
  s+=_acRi("55 — Provision for deferred tax",tp+"ProvDefTax","55");
  s+=_acRc("56 — Profit after tax (53 − 54 − 55)",tp+"ProfitAfterTax","56");
  s+=_acRi("57 — Balance brought forward from previous year",tp+"BalBFPrevYr","57");
  s+=_acRc("58 — Amount available for appropriation (56 + 57)",tp+"AmtAvlAppr","58");
  s+=sub("59 — Appropriations");
  s+=_acRi("Transfer to reserves and surplus",tp+"Appropriations.TrfToReserves","59i",{ind:1});
  s+=_acRi("Proposed / interim dividend",tp+"Appropriations.ProposedDividend","59ii",{ind:1});
  s+=_acRi("Tax on dividend (incl. earlier years)",tp+"Appropriations.TaxOnDividend","59iii",{ind:1});
  s+=_acRi("Appropriation towards CSR (s.135 Companies Act)",tp+"Appropriations.AppropriationsCSR","59iv",{ind:1});
  s+=_acRi("Any other appropriation",tp+"Appropriations.AnyOtherAppr","59v",{ind:1});
  s+=_acRc("59vi — Total appropriations",tp+"Appropriations.TotAppropriations","59vi");
  s+=_acRc("60 — Balance carried to balance sheet (58 − 59vi)",tp+"PartnerAccBalTrf","60",{hint:"feeds Balance Sheet 1Bviii"});
  if(isIas) s+=accOCI();
  return s;
}

/* ---------- Other Comprehensive Income (Ind-AS P&L only) ---------- */
function accOCI(){
  const na="plias.OtherComprnsvInc.ItemsNotReclsfdPnL.", re="plias.OtherComprnsvInc.ItemsReclsfdPnL.";
  let s=sub("61A — Other Comprehensive Income: items that will NOT be reclassified to P&L");
  s+=_acRi("Changes in revaluation surplus",na+"ChangesInSurplus","61Ai",{ind:1});
  s+=_acRi("Re-measurements of the defined benefit plans",na+"ReMesDefinedBenftPlans","61Aii",{ind:1});
  s+=_acRi("Equity instruments through OCI",na+"EquityOCI","61Aiii",{ind:1});
  s+=_acRi("Fair value changes — own credit risk of FVTPL financial liabilities",na+"FairValFVTPl","61Aiv",{ind:1});
  s+=_acRi("Share of OCI in associates/JVs (not reclassified)",na+"ShareOfOtherComprInc","61Av",{ind:1});
  s+=_acOthTbl(na+"OtherIncDtls","Add item (61A vi)");
  s+=_acRc("Total of (vi)",na+"OthersTotal","61Avi");
  s+=_acRi("Income tax relating to items not reclassified to P&L",na+"IncomeTaxNotPnL","61Avii",{ind:1});
  s+=_acRc("61A — Total",na+"TotalNotPnL","61A");
  s+=sub("61B — Other Comprehensive Income: items that WILL be reclassified to P&L");
  s+=_acRi("Exchange differences on translating a foreign operation",re+"ExchangeDiff","61Bi",{ind:1});
  s+=_acRi("Debt instruments through OCI",re+"DebtsOCI","61Bii",{ind:1});
  s+=_acRi("Effective portion of gains/loss on cash-flow-hedge instruments",re+"EffecPortionGainnLoss","61Biii",{ind:1});
  s+=_acRi("Share of OCI in associates/JVs (to be reclassified)",re+"ShareOCI","61Biv",{ind:1});
  s+=_acOthTbl(re+"OtherIncDtls","Add item (61B v)");
  s+=_acRc("Total of (v)",re+"OthersTotal","61Bv");
  s+=_acRi("Income tax relating to items reclassified to P&L",re+"IncomeTaxReclsPnL","61Bvi",{ind:1});
  s+=_acRc("61B — Total",re+"TotalPnL","61B");
  s+=_acRc("62 — Total Comprehensive Income (56 + 61A + 61B)","plias.OtherComprnsvInc.TotalComprIncome","62");
  return s;
}
