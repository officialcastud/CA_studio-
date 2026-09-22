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
const ACC_RC=[["R","Revenue"],["C","Capital"]]; /* OL 2v TypeOfIncome — schema enum R/C */

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
    St("bs.TotalAssets", totNCA+totCA); /* II */
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
    St("bsias.TotalAssets", G(nfa+"TotalNonCurrntAsst")+G(oca+"TotalCurrAsst")); /* II */
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
    bsTotEL:R(G("bs.EquityAndLiablities.TotEquityAndLiabilities")), bsTotAsset:R(G("bs.TotalAssets")),
    bsMismatch:R(G("bs.EquityAndLiablities.TotEquityAndLiabilities"))!==R(G("bs.TotalAssets")),
    biasTotEL:R(G("bsias.EquityAndLiablities.Liabilities.CurrentLiabilities.TotalEquityLiab")), biasTotAsset:R(G("bsias.TotalAssets")),
    biasMismatch:R(G("bsias.EquityAndLiablities.Liabilities.CurrentLiabilities.TotalEquityLiab"))!==R(G("bsias.TotalAssets")),
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

/* =====================================================================
   Part A - OI item lists (schema key · item ref · label — from
   books/ITR-6/PART_A_OI.md). Shared by the screen and the exporter so the
   two never drift; the exporter builds the required-leaf skeleton from
   these arrays and every leaf here is a verbatim PARTA_OI schema key.
   ===================================================================== */
const OI_NC5=[["Section28Items","5a","Items falling within the scope of section 28"],
  ["ProformaCreditsDue","5b","Proforma credits, drawbacks, refund of duty/tax"],
  ["PrevYrEscalClaim","5c","Escalation claims accepted during the year"],
  ["OthItemInc","5d","Any other item of income"],
  ["CapReceipt","5e","Capital receipt, if any"]];
const OI36=[["StkInsurPrem","6a","Insurance premium — risk of damage/destruction of stocks or stores [36(1)(i)]"],
  ["EmpHealthInsurPrem","6b","Insurance premium on the health of employees [36(1)(ib)]"],
  ["EmpBonusCommSum","6c","Bonus or commission to an employee otherwise payable as profit/dividend"],
  ["IntOnBorrCap","6d","Interest on borrowed capital [36(1)(iii)]"],
  ["ZeroCoupBondDisc","6e","Discount on a zero-coupon bond [36(1)(iiia)]"],
  ["RecogPFContribAmt","6f","Contributions to a recognised provident fund [36(1)(iv)]"],
  ["AppSuperAnnFundAmt","6g","Contributions to an approved superannuation fund [36(1)(iv)]"],
  ["PensionSchemeSec80CCD","6h","Contribution to a pension scheme u/s 80CCD [36(1)(iva)]"],
  ["AppGratFundAmt","6i","Contributions to an approved gratuity fund [36(1)(v)]"],
  ["OthFundAmt","6j","Contributions to any other fund"],
  ["EmpContributionCredits","6k","Employees' contribution to any fund, not credited by the due date"],
  ["BadDebtDoubtAmt","6l","Bad and doubtful debts [36(1)(vii)]"],
  ["BadDebtDoubtProvn","6m","Provision for bad and doubtful debts [36(1)(viia)]"],
  ["SpecResrvTranfr","6n","Amount transferred to any special reserve [36(1)(viii)]"],
  ["FamPlanPromoExp","6o","Expenditure for promoting family planning amongst employees [36(1)(ix)]"],
  ["SecuritiesPaidAmt","6p","Securities transaction tax paid where such income is not business income"],
  ["MrktLossOthExpLossICDS","6q","Marked-to-market / expected loss as computed under ICDS u/s 145(2)"],
  ["AnyOthDisallowance","6r","Any other disallowance"]];
const OI37=[["CapitalNatureExp","7a","Expenditure of capital nature [37(1)]"],
  ["PersonalExp","7b","Expenditure of personal nature [37(1)]"],
  ["BusOrProfessnExp","7c","Expenditure not wholly and exclusively for business/profession"],
  ["PoliticPartyExp","7d","Advertisement in a publication of a political party"],
  ["LawVoilatPenalExp","7e","Expenditure by way of penalty/fine for violation of any law"],
  ["OthPenalFineExp","7f","Any other penalty or fine"],
  ["OffenceExp","7g","Expenditure incurred for any purpose which is an offence/prohibited by law"],
  ["SocialRespCSR","7h","Expenditure on corporate social responsibility (s.135 Companies Act)"],
  ["ContigentLiability","7i","Amount of any liability of a contingent nature"],
  ["OthAmtNotAllowUs37","7j","Any other amount not allowable under section 37"]];
const OI40=[["NonCompChapXVIIBAmt","8Aa","Amount disallowable u/s 40(a)(i) — non-compliance with Chapter XVII-B"],
  ["NonComp40aiaChapXVIIBAmt","8Ab","Amount disallowable u/s 40(a)(ia)"],
  ["NonComp40aibChapXVIIBAmt","8Ac","Amount disallowable u/s 40(a)(ib)"],
  ["NonComp40aiiiChapXVIIBAmt","8Ad","Amount disallowable u/s 40(a)(iii)"],
  ["TaxAmtOnProfits","8Ae","Amount of tax on profits (s.40(a)(ii))"],
  ["WTAmt","8Af","Amount of wealth-tax (s.40(a)(iia))"],
  ["RolyatyOrServiceFee","8Ag","Royalty/licence/service fee to a State Government undertaking (s.40(a)(iib))"],
  ["IntSalBonPartner","8Ah","Interest/salary/bonus to a partner (s.40(b)/40(ba))"]];
const OI40A=[["AmtPaidUs40A2b","9a","Amounts paid to persons specified u/s 40A(2)(b)"],
  ["AmtGT20kCash","9b","Amount paid otherwise than by account-payee mode u/s 40A(3)/(3A)"],
  ["ProvPmtGrat","9c","Provision for payment of gratuity u/s 40A(7)"],
  ["ContToSetupTrust","9d","Contribution to a non-statutory fund/trust u/s 40A(9)"]];
const OI43=[["TaxDutyCesAmt","a","Any sum of tax, duty, cess or fee"],
  ["ContToEmpPFSFGF","b","Contribution to any provident/superannuation/gratuity or other employee fund"],
  ["EmpBonusComm","c","Bonus or commission to employees"],
  ["IntPayaleToFI","d","Interest on any loan/borrowing from a public financial institution/NBFC"],
  ["SumPayaleLoanBrToFinComp","e","Interest on any loan/advance from a scheduled bank/co-op bank"],
  ["IntPayaleToFISchBank","f","Interest on any loan/borrowing from a deposit-taking NBFC"],
  ["LeaveEncashPayable","g","Sum payable towards leave encashment"],
  ["RailwayAsstsPyble","h","Sum payable to Indian Railways for use of railway assets"],
  ["MSEPayable","i","Sum payable to a micro or small enterprise beyond the MSMED time limit"]];
const OI_EXC=["UnionExciseDuty","ServiceTax","VATorSaleTax","CentralGoodServiceTax","StateGoodServiceTax","IntegratedGoodServiceTax","UnionTerrGoodServiceTax","OthDutyTaxCess"];
const OI13=[["DeemedProfUs33AB","13a","Deemed profit u/s 33AB (tea/coffee/rubber development)"],
  ["DeemedProfUs33ABA","13b","Deemed profit u/s 33ABA (site restoration fund)"],
  ["DeemedProfUs33AC","13c","Deemed profit u/s 33AC (shipping reserve)"]];
const ACC_BASIS=[["reg","Schedule III (non-Ind-AS) accounts"],["ias","Ind-AS accounts (Companies (Ind-AS) Rules, 2015)"],["ol","Company under liquidation — Receipt & Payment account"]];
const ACC_OIYN=[["Y","Yes"],["N","No"]];

/* ---------- Balance Sheet — Schedule III, non-Ind-AS (accBS) ---------- */
function accBS(){
  const el="bs.EquityAndLiablities.", as="bs.Assets.";
  const shf=el+"ShareHolderFund.", sc=shf+"ShareCapital.", rs=shf+"ResrNSurp.";
  let h=sub("Part I — Equity and Liabilities");
  h+=sub("1A — Share capital");
  h+=_acRi("Authorised",sc+"Authorised","1Ai",{ind:1});
  h+=_acRi("Issued, subscribed and fully paid up",sc+"IssuedSubsPaidUp","1Aii",{ind:1});
  h+=_acRi("Subscribed but not fully paid",sc+"SubscribedNotFullyPaid","1Aiii",{ind:1});
  h+=_acRc("Total share capital (Aii + Aiii)",sc+"TotShareCapital","1Aiv");
  h+=sub("1B — Reserves and surplus");
  h+=_acRi("Capital reserve",rs+"CapResr","1Bi",{ind:1});
  h+=_acRi("Capital redemption reserve",rs+"CapRedempResr","1Bii",{ind:1});
  h+=_acRi("Securities premium reserve",rs+"SecurPremResr","1Biii",{ind:1});
  h+=_acRi("Debenture redemption reserve",rs+"DebunRedResr","1Biv",{ind:1});
  h+=_acRi("Revaluation reserve",rs+"RevResr","1Bv",{ind:1});
  h+=_acRi("Share options outstanding amount",rs+"ShareOptOSAmount","1Bvi",{ind:1});
  h+=grid("accounts."+rs+"OtherResrvDtls",
    [{k:"Nature",h:"Other reserve — nature",t:"txt",w:"auto",req:1,max:125},{k:"Amount",h:"Amount",t:"num",w:"150px",req:1}],
    _acArr(rs+"OtherResrvDtls"),{min:"480px",empty:"No other reserves.",add:"Add other reserve"});
  h+=_acRc("Total other reserves (1Bvii)",rs+"OtherResrvTotal","1Bvii");
  h+=_acRi("Surplus — balance in the statement of profit and loss (fed from P&L item 60; debit balance as −ve)",rs+"PLAccount","1Bviii",{hint:"fed from the P&L"});
  h+=_acRc("Total reserves and surplus (1Bix)",rs+"TotResrNSurp","1Bix");
  h+=_acRi("1C — Money received against share warrants",shf+"MoneyRecvdAgainstShares","1C");
  h+=_acRc("1D — Total shareholders' fund (Aiv + Bix + 1C)",shf+"TotShareHolderFund","1D");
  const sam=el+"ShareAppMoneyAllot.";
  h+=sub("2 — Share application money pending allotment");
  h+=_acRi("Pending for less than one year",sam+"PendingLtOneYr","2i",{ind:1});
  h+=_acRi("Pending for more than one year",sam+"PendingMtOneYr","2ii",{ind:1});
  h+=_acRc("Total (i + ii)",sam+"Total","2iii");
  const ncl=el+"NonCurrLiabilities.", ltb=ncl+"LongTermBorrowings.";
  h+=sub("3A — Long-term borrowings");
  h+=_acRi("Bonds/debentures — foreign currency",ltb+"BondsDebentures.ForeignCurrency","3Aia",{ind:1});
  h+=_acRi("Bonds/debentures — rupee",ltb+"BondsDebentures.Rupee","3Aib",{ind:1});
  h+=_acRc("Total bonds/debentures",ltb+"BondsDebentures.Total","3Aic");
  h+=_acRi("Term loans — foreign currency",ltb+"TermLoans.ForeignCurrency","3Aiia",{ind:1});
  h+=_acRi("Rupee term loans — from banks",ltb+"TermLoans.RupeeLoans.FromBanks","3Aiib1",{ind:1});
  h+=_acRi("Rupee term loans — from others",ltb+"TermLoans.RupeeLoans.FromOthers","3Aiib2",{ind:1});
  h+=_acRc("Total rupee term loans",ltb+"TermLoans.RupeeLoans.Total","3Aiib3");
  h+=_acRc("Total term loans",ltb+"TermLoans.TotalTermLoans","3Aiic");
  h+=_acRi("Deferred payment liabilities",ltb+"DeferredPymtLiabilities","3Aiii",{ind:1});
  h+=_acRi("Deposits from related parties",ltb+"DepositsFrmRelatedParties","3Aiv",{ind:1});
  h+=_acRi("Other deposits",ltb+"OtherDeposits","3Av",{ind:1});
  h+=_acRi("Loans and advances from related parties",ltb+"LoansAndAdv","3Avi",{ind:1});
  h+=_acRi("Other loans and advances",ltb+"OthersLoanAdv","3Avii",{ind:1});
  h+=_acRi("Long-term maturities of finance lease obligations",ltb+"LongTermMaturities","3Aviii",{ind:1});
  h+=_acRc("Total long-term borrowings (3Aix)",ltb+"TotalLTBorrowings","3Aix");
  h+=_acRi("3B — Deferred tax liabilities (net)",ncl+"NetDefferedTaxLiability","3B");
  h+=sub("3C — Other long-term liabilities");
  h+=_acRi("Trade payables",ncl+"OthLongTermLiablities.TradePayables","3Ci",{ind:1});
  h+=_acRi("Others",ncl+"OthLongTermLiablities.Others","3Cii",{ind:1});
  h+=_acRc("Total other long-term liabilities",ncl+"OthLongTermLiablities.TotalOthLtLiabilities","3Ciii");
  h+=sub("3D — Long-term provisions");
  h+=_acRi("Provision for employee benefits",ncl+"LongTermProvisions.ProvEmpBenefits","3Di",{ind:1});
  h+=_acRi("Others",ncl+"LongTermProvisions.Others","3Dii",{ind:1});
  h+=_acRc("Total long-term provisions",ncl+"LongTermProvisions.Total","3Diii");
  h+=_acRc("3E — Total non-current liabilities (3A + 3B + 3C + 3D)",ncl+"TotalNonCurrLiabilites","3E");
  const cl=el+"CurrentLiabilities.", stb=cl+"ShortTrmBorrowings.";
  h+=sub("4A — Short-term borrowings");
  h+=_acRi("Loans repayable on demand — from banks",stb+"LoansRepaybleOnDemand.FromBanks","4Aia",{ind:1});
  h+=_acRi("Loans repayable on demand — from NBFCs",stb+"LoansRepaybleOnDemand.FrmNonBanking","4Aib",{ind:1});
  h+=_acRi("Loans repayable on demand — from other financial institutions",stb+"LoansRepaybleOnDemand.OthFinanceInst","4Aic",{ind:1});
  h+=_acRi("Loans repayable on demand — from others",stb+"LoansRepaybleOnDemand.Others","4Aid",{ind:1});
  h+=_acRc("Total loans repayable on demand",stb+"LoansRepaybleOnDemand.TotLoansRepaybleOnDemand","4Aie");
  h+=_acRi("Deposits from related parties",stb+"DepositsFrmRelatedParties","4Aii",{ind:1});
  h+=_acRi("Loans and advances from related parties",stb+"LoansAndAdv","4Aiii",{ind:1});
  h+=_acRi("Other loans and advances",stb+"OthLoansAndAdv","4Aiv",{ind:1});
  h+=_acRi("Other deposits",stb+"OthDeposits","4Av",{ind:1});
  h+=_acRc("Total short-term borrowings (4Avi)",stb+"TotShortTrmBorrowings","4Avi");
  h+=sub("4B — Trade payables");
  h+=_acRi("Outstanding for more than one year",cl+"TradePayables.OSMoreThanOneYr","4Bi",{ind:1});
  h+=_acRi("Others",cl+"TradePayables.Others","4Bii",{ind:1});
  h+=_acRc("Total trade payables",cl+"TradePayables.TotalTradePayables","4Biii");
  const ocl=cl+"OthCurrLiabilities.";
  h+=sub("4C — Other current liabilities");
  h+=_acRi("Current maturities of long-term debt",ocl+"CurrMatOnLTDebt","4Ci",{ind:1});
  h+=_acRi("Current maturities of finance lease obligations",ocl+"CurrMatFinanceOblg","4Cii",{ind:1});
  h+=_acRi("Interest accrued but not due on borrowings",ocl+"AccrInterestNotDue","4Ciii",{ind:1});
  h+=_acRi("Interest accrued and due on borrowings",ocl+"AccrInterest","4Civ",{ind:1});
  h+=_acRi("Income received in advance",ocl+"IncRecvdAdvance","4Cv",{ind:1});
  h+=_acRi("Unpaid dividends",ocl+"UnpaidDividend","4Cvi",{ind:1});
  h+=_acRi("Application money received for allotment (due for refund) and interest accrued",ocl+"AppMonyRecvdAllotSecurities","4Cvii",{ind:1});
  h+=_acRi("Unpaid matured deposits and interest accrued thereon",ocl+"UnpaidMatDeposits","4Cviii",{ind:1});
  h+=_acRi("Unpaid matured debentures and interest accrued thereon",ocl+"UnpaidMatureDebenture","4Cix",{ind:1});
  h+=_acRi("Other payables",ocl+"OthPayables","4Cx",{ind:1});
  h+=_acRc("Total other current liabilities (4Cxi)",ocl+"TotOthCurrLiabilities","4Cxi");
  const sp=cl+"ShortTermProv.";
  h+=sub("4D — Short-term provisions");
  h+=_acRi("Provision for employee benefit",sp+"EmpBenefitProv","4Di",{ind:1});
  h+=_acRi("Provision for income-tax",sp+"ITProvision","4Dii",{ind:1});
  h+=_acRi("Proposed dividend",sp+"ProposedDividend","4Diii",{ind:1});
  h+=_acRi("Tax on dividend",sp+"TaxOnDividend","4Div",{ind:1});
  h+=_acRi("Other",sp+"OthProvision","4Dv",{ind:1});
  h+=_acRc("Total short-term provisions (4Dvi)",sp+"TotShortTermProvisions","4Dvi");
  h+=_acRc("4E — Total current liabilities (4Avi + 4Biii + 4Cxi + 4Dvi)",cl+"TotCurrLiabilitiesProvision","4E");
  h+=_acRc("I — Total Equity and liabilities (1D + 2 + 3E + 4E)",el+"TotEquityAndLiabilities","I",{cls:"grand"});
  /* ---- Assets ---- */
  const nca=as+"NonCurrAssets.", fa=nca+"FixedAsset.";
  h+=sub("Part II — Assets");
  h+=sub("1A — Fixed assets");
  h+=_acRi("Tangible assets — gross block",fa+"Tangible.GrossBlock","1Aia",{ind:1});
  h+=_acRi("Tangible assets — depreciation",fa+"Tangible.Depreciation","1Aib",{ind:1});
  h+=_acRi("Tangible assets — impairment losses",fa+"Tangible.ImpairmentLosses","1Aic",{ind:1});
  h+=_acRc("Tangible assets — net block (ia − ib − ic)",fa+"Tangible.NetBlock","1Aid");
  h+=_acRi("Intangible assets — gross block",fa+"InTangible.GrossBlock","1Aiia",{ind:1});
  h+=_acRi("Intangible assets — amortization",fa+"InTangible.Amortization","1Aiib",{ind:1});
  h+=_acRi("Intangible assets — impairment losses",fa+"InTangible.ImpairmentLosses","1Aiic",{ind:1});
  h+=_acRc("Intangible assets — net block (iia − iib − iic)",fa+"InTangible.NetBlock","1Aiid");
  h+=_acRi("Capital work-in-progress",fa+"CapWrkProg","1Aiii",{ind:1});
  h+=_acRi("Intangible assets under development",fa+"IntangibleAssetUnDev","1Aiv",{ind:1});
  h+=_acRc("Total fixed assets (1Av)",fa+"TotFixedAsset","1Av");
  const nci=nca+"NonCurrInvstmnts.";
  h+=sub("1B — Non-current investments");
  h+=_acRi("Investment in property",nci+"InvInProperty","1Bi",{ind:1});
  h+=_acRi("Equity instruments — listed",nci+"EquityInstruments.ListedEquities","1Biia",{ind:1});
  h+=_acRi("Equity instruments — unlisted",nci+"EquityInstruments.UnListedEquities","1Biib",{ind:1});
  h+=_acRc("Total equity instruments",nci+"EquityInstruments.Total","1Biic");
  h+=_acRi("Preference shares",nci+"PreferenceShares","1Biii",{ind:1});
  h+=_acRi("Government or trust securities",nci+"GovtOrTrustSecurities","1Biv",{ind:1});
  h+=_acRi("Debentures or bonds",nci+"DebenturesOrBonds","1Bv",{ind:1});
  h+=_acRi("Mutual funds",nci+"MutualFunds","1Bvi",{ind:1});
  h+=_acRi("Partnership firms",nci+"InvstmntInPrtnrShipFirm","1Bvii",{ind:1});
  h+=_acRi("Other investments",nci+"OtherInvstmnts","1Bviii",{ind:1});
  h+=_acRc("Total non-current investments (1Bix)",nci+"TotNonCurrInvstmnts","1Bix");
  h+=_acRi("1C — Deferred tax assets (net)",nca+"NetDeferredTaxAssets","1C");
  const lla=nca+"LongTrmLoanAdv.";
  h+=sub("1D — Long-term loans and advances");
  h+=_acRi("Capital advances",lla+"CapitalAdv","1Di",{ind:1});
  h+=_acRi("Security deposits",lla+"SecurityDeposits","1Dii",{ind:1});
  h+=_acRi("Loans and advances to related parties",lla+"LoanAdvRelatedParties","1Diii",{ind:1});
  h+=_acRi("Other loans and advances",lla+"OthLoanAdv","1Div",{ind:1});
  h+=_acRc("Total long-term loans and advances (1Dv)",lla+"TotLTLoanAdv","1Dv");
  h+=_acRi("of Dv — for the purpose of business or profession",lla+"LTLoanAdvDtls.BusOrProf","1Dvia",{ind:1});
  h+=_acRi("of Dv — not for the purpose of business or profession",lla+"LTLoanAdvDtls.NotForBusOrProf","1Dvib",{ind:1});
  h+=_acRi("of Dv — to a shareholder/concern u/s 2(22)(e)",lla+"LTLoanAdvDtls.ShareHolderUs2_22","1Dvic",{ind:1});
  const onc=nca+"OthNonCurrAssets.";
  h+=sub("1E — Other non-current assets");
  h+=_acRi("Long-term trade receivables — secured, considered good",onc+"LTTradeReceivables.Secured","1Eia",{ind:1});
  h+=_acRi("Long-term trade receivables — unsecured, considered good",onc+"LTTradeReceivables.Unsecured","1Eib",{ind:1});
  h+=_acRi("Long-term trade receivables — doubtful",onc+"LTTradeReceivables.Doubtful","1Eic",{ind:1});
  h+=_acRc("Total long-term trade receivables",onc+"LTTradeReceivables.TotOthNonCurrAssets","1Eid");
  h+=_acRi("Others",onc+"Others","1Eii",{ind:1});
  h+=_acRc("Total other non-current assets (1Eiii)",onc+"Total","1Eiii");
  h+=_acRi("of Eiii — due from a shareholder/concern u/s 2(22)(e)",onc+"NonCurrAssetUs2_22","1Eiv",{ind:1});
  h+=_acRc("1F — Total non-current assets (Av + Bix + C + Dv + Eiii)",nca+"TotNonCurrAssets","1F");
  const ca=as+"CurrentAssets.", ci=ca+"CurrInvstmnts.";
  h+=sub("2A — Current investments");
  h+=_acRi("Equity instruments — listed",ci+"EquityInstruments.ListedEquities","2Aia",{ind:1});
  h+=_acRi("Equity instruments — unlisted",ci+"EquityInstruments.UnListedEquities","2Aib",{ind:1});
  h+=_acRc("Total equity instruments",ci+"EquityInstruments.Total","2Aic");
  h+=_acRi("Preference shares",ci+"PreferenceShares","2Aii",{ind:1});
  h+=_acRi("Government or trust securities",ci+"GovtOrTrustSecurities","2Aiii",{ind:1});
  h+=_acRi("Debentures or bonds",ci+"DebenturesOrBonds","2Aiv",{ind:1});
  h+=_acRi("Mutual funds",ci+"MutualFunds","2Av",{ind:1});
  h+=_acRi("Partnership firms",ci+"InvstmntInPrtnrShipFirm","2Avi",{ind:1});
  h+=_acRi("Other investment",ci+"OtherInvstmnts","2Avii",{ind:1});
  h+=_acRc("Total current investments (2Aviii)",ci+"TotCurrInvstmnts","2Aviii");
  const iv=ca+"Inventories.";
  h+=sub("2B — Inventories");
  h+=_acRi("Raw materials",iv+"RawMatl","2Bi",{ind:1});
  h+=_acRi("Work-in-progress",iv+"WorkInProgress","2Bii",{ind:1});
  h+=_acRi("Finished goods",iv+"FinOrTradGood","2Biii",{ind:1});
  h+=_acRi("Stock-in-trade (goods acquired for trading)",iv+"StkInTrade","2Biv",{ind:1});
  h+=_acRi("Stores and spares",iv+"StoresConsumables","2Bv",{ind:1});
  h+=_acRi("Loose tools",iv+"LooseTools","2Bvi",{ind:1});
  h+=_acRi("Others",iv+"Others","2Bvii",{ind:1});
  h+=_acRc("Total inventories (2Bviii)",iv+"TotInventries","2Bviii");
  h+=sub("2C — Trade receivables");
  h+=_acRi("Outstanding for more than six months",ca+"TradeReceivables.OSMoreThanSixMonths","2Ci",{ind:1});
  h+=_acRi("Others",ca+"TradeReceivables.Others","2Cii",{ind:1});
  h+=_acRc("Total trade receivables",ca+"TradeReceivables.TotalTradeReceivables","2Ciii");
  const ce=ca+"CashNCashEquivalents.";
  h+=sub("2D — Cash and cash equivalents");
  h+=_acRi("Balances with banks",ce+"BalWithBanks","2Di",{ind:1});
  h+=_acRi("Cheques, drafts in hand",ce+"ChequesDrafts","2Dii",{ind:1});
  h+=_acRi("Cash in hand",ce+"CashInHand","2Diii",{ind:1});
  h+=_acRi("Others",ce+"Others","2Div",{ind:1});
  h+=_acRc("Total cash and cash equivalents (2Dv)",ce+"TotCashNCashEquivalents","2Dv");
  const stl=ca+"TotShortTermLoanAdv.";
  h+=sub("2E — Short-term loans and advances");
  h+=_acRi("Loans and advances to related parties",stl+"LoanAdv","2Ei",{ind:1});
  h+=_acRi("Others",stl+"Others","2Eii",{ind:1});
  h+=_acRc("Total short-term loans and advances (2Eiii)",stl+"TotShrtTermLoans","2Eiii");
  h+=_acRi("of Eiii — for the purpose of business or profession",stl+"STLoanAdvDtls.BusOrProf","2Eiva",{ind:1});
  h+=_acRi("of Eiii — not for the purpose of business or profession",stl+"STLoanAdvDtls.NotForBusOrProf","2Eivb",{ind:1});
  h+=_acRi("of Eiii — to a shareholder/concern u/s 2(22)(e)",stl+"STLoanAdvDtls.ShareHolderUs2_22","2Eivc",{ind:1});
  h+=_acRi("2F — Other current assets",ca+"OtherCurrAssets","2F");
  h+=_acRc("2G — Total current assets (Aviii + Bviii + Ciii + Dv + Eiii + F)",ca+"TotCurrAssets","2G");
  h+=_acRc("II — Total Assets (1F + 2G)","bs.TotalAssets","II",{cls:"grand"});
  return h;
}

/* ---------- Balance Sheet — Ind AS (accBSias) ---------- */
function accBSias(){
  const el="bsias.EquityAndLiablities.";
  const eq=el+"Equity.", esc=eq+"EquityShareCapital.", oe=eq+"OtherEquityReserv.";
  let h=sub("Part I — Equity and Liabilities");
  h+=sub("1A — Equity share capital");
  h+=_acRi("Authorised",esc+"Authorised","1Ai",{ind:1});
  h+=_acRi("Issued, subscribed and fully paid up",esc+"IssuedSubsPaidUp","1Aii",{ind:1});
  h+=_acRi("Subscribed but not fully paid",esc+"SubscribedNotFullyPaid","1Aiii",{ind:1});
  h+=_acRc("Total share capital (1Aiv)",esc+"TotShareCapital","1Aiv");
  h+=sub("1B — Other equity");
  h+=_acRi("Capital redemption reserve",oe+"CapRedempResr","1Bia",{ind:1});
  h+=_acRi("Debenture redemption reserve",oe+"DebunRedResr","1Bib",{ind:1});
  h+=_acRi("Share options outstanding amount",oe+"ShareOptOSAmount","1Bic",{ind:1});
  h+=_acOthTbl(oe+"OtherResrvDtls","Add other reserve (1Bid)");
  h+=_acRc("Total of other reserves table",oe+"OthersTotal","1Bid");
  h+=_acRc("Total other reserves (1Bie)",oe+"TotalOtherResrv","1Bie");
  h+=_acRi("Retained earnings (fed from P&L item 60)",oe+"RetainedEarngs","1Bii",{hint:"fed from the P&L Ind-AS"});
  h+=_acRc("Total reserves and retained earnings (1Biii)",oe+"TotResrNRetEar","1Biii");
  h+=_acRc("1C — Total equity",oe+"TotalEquity","1C",{cls:"grand"});
  const li=el+"Liabilities.", ncl=li+"NonCurrLiabilities.", fl=ncl+"FinancialLiabilities.";
  h+=sub("Non-current liabilities · I — Financial liabilities (borrowings)");
  h+=_acRi("Bonds/debentures — foreign currency",fl+"BondsDebentures.ForeignCurrency","a1",{ind:1});
  h+=_acRi("Bonds/debentures — rupee",fl+"BondsDebentures.Rupee","a2",{ind:1});
  h+=_acRc("Total bonds/debentures",fl+"BondsDebentures.Total","a3");
  h+=_acRi("Term loans — foreign currency",fl+"TermLoans.ForeignCurrency","b1",{ind:1});
  h+=_acRi("Rupee term loans — from banks",fl+"TermLoans.RupeeLoans.FromBanks","b2a",{ind:1});
  h+=_acRi("Rupee term loans — from others",fl+"TermLoans.RupeeLoans.FromOthers","b2b",{ind:1});
  h+=_acRc("Total rupee term loans",fl+"TermLoans.RupeeLoans.Total","b2");
  h+=_acRc("Total term loans",fl+"TermLoans.TotalTermLoans","b3");
  h+=_acRi("Deferred payment liabilities",fl+"DeferredPymtLiabilities","c",{ind:1});
  h+=_acRi("Deposits",fl+"Deposits","d",{ind:1});
  h+=_acRi("Loans from related parties",fl+"LoansReltdParties","e",{ind:1});
  h+=_acRi("Long-term maturities of finance lease obligations",fl+"LongTermMaturities","f",{ind:1});
  h+=_acRi("Liability component of compound financial instruments",fl+"LiabilityComp","g",{ind:1});
  h+=_acRi("Other loans",fl+"OtherLoans","h",{ind:1});
  h+=_acRc("Total long-term borrowings",fl+"TotalLTBorrowings","i");
  h+=_acRi("Trade payables",fl+"TradePayables","j");
  h+=_acRi("Other financial liabilities",fl+"OtherFinancialLiab","k");
  const prv=ncl+"Provisions.";
  h+=sub("II — Provisions");
  h+=_acRi("Provision for employee benefits",prv+"ProvEmpBenefits","IIa",{ind:1});
  h+=_acOthTbl(prv+"OthersProvisions","Add other provision (IIb)");
  h+=_acRc("Total of other provisions",prv+"OthersTotal","IIb");
  h+=_acRc("Total provisions (IIc)",prv+"TotalProvisions","IIc");
  h+=_acRi("III — Deferred tax liabilities (net)",ncl+"DefrdTaxCurrLiabilites","III");
  const onl=ncl+"OtherNonCurLiabilites.";
  h+=sub("IV — Other non-current liabilities");
  h+=_acRi("Advances",onl+"Advances","IVa",{ind:1});
  h+=_acOthTbl(onl+"OthersNonCurrLiab","Add other non-current liability (IVb)");
  h+=_acRc("Total of others",onl+"OthersTotal","IVb");
  h+=_acRc("Total other non-current liabilities (IVc)",onl+"TotalOthNonCurrLiab","IVc");
  h+=_acRc("2A — Total non-current liabilities",ncl+"TotalNonCurrLiab","2A");
  const cl=li+"CurrentLiabilities.", flb=cl+"FinancialLiabBorrowings.";
  h+=sub("Current liabilities · I — Financial liabilities (borrowings)");
  h+=_acRi("Loans repayable on demand — from banks",flb+"LoansRepaybleOnDemand.FromBanks","i",{ind:1});
  h+=_acRi("Loans repayable on demand — from other parties",flb+"LoansRepaybleOnDemand.FrmOtherParties","i2",{ind:1});
  h+=_acRc("Total loans repayable on demand",flb+"LoansRepaybleOnDemand.TotLoansRepaybleOnDemand","i3");
  h+=_acRi("Loans from related parties",flb+"LoansFrmRelatedParties","b",{ind:1});
  h+=_acRi("Deposits",flb+"Deposits","c",{ind:1});
  h+=_acOthTbl(flb+"BrwngOtherLoans","Add other loan (d)");
  h+=_acRc("Total of other loans",flb+"OthersTotal","d");
  h+=_acRc("Total borrowings",flb+"TotalBorrowings","Ia");
  h+=_acRi("Trade payables",flb+"TradePayables","ii");
  const ofl=cl+"OthFinancialLiabilities.";
  h+=sub("III — Other financial liabilities");
  h+=_acRi("Current maturities of long-term debt",ofl+"CurrMatOnLTDebt","a",{ind:1});
  h+=_acRi("Current maturities of finance lease obligations",ofl+"CurrMatFinanceOblg","b",{ind:1});
  h+=_acRi("Interest accrued",ofl+"AccrInterest","c",{ind:1});
  h+=_acRi("Unpaid dividends",ofl+"UnpaidDividend","d",{ind:1});
  h+=_acRi("Application money received for allotment (due for refund) and interest",ofl+"AppMonyRecvdAllotSecurities","e",{ind:1});
  h+=_acRi("Unpaid matured deposits and interest accrued",ofl+"UnpaidMatDeposits","f",{ind:1});
  h+=_acRi("Unpaid matured debentures and interest accrued",ofl+"UnpaidMatureDebenture","g",{ind:1});
  h+=_acOthTbl(ofl+"OthPayables","Add other payable (h)");
  h+=_acRc("Total of other payables",ofl+"OthersTotal","h");
  h+=_acRc("Total other financial liabilities (Iiii)",ofl+"TotOthFinancialLiab","Iiii");
  h+=_acRc("Total financial liabilities (Iiv)",cl+"TottalFinancialLiab","Iiv");
  const ocl=cl+"OtherCuurLiabilities.";
  h+=sub("II — Other current liabilities");
  h+=_acRi("Revenue received in advance",ocl+"RevenueRecvdAdvance","a",{ind:1});
  h+=_acOthTbl(ocl+"OtherAdvance","Add other advance (b)");
  h+=_acRc("Total of other advances",ocl+"OthersAdvTotal","b");
  h+=_acOthTbl(ocl+"Others","Add other (c)");
  h+=_acRc("Total of others",ocl+"OthersTotal","c");
  h+=_acRc("Total other current liabilities (IId)",ocl+"TotalOthCurrLiab","IId");
  const pv2=cl+"Provosions.";
  h+=sub("III — Provisions");
  h+=_acRi("Provision for employee benefits",pv2+"ProvosionEmpBenft","a",{ind:1});
  h+=_acOthTbl(pv2+"OthersProvisions","Add other provision (b)");
  h+=_acRc("Total of other provisions",pv2+"OthersTotal","b");
  h+=_acRc("Total provisions (IIIc)",pv2+"TotalProvosions","IIIc");
  h+=_acRi("IV — Current tax liabilities (net)",cl+"CurrTaxLiabilities","IV");
  h+=_acRc("2B — Total current liabilities",cl+"TotalCurrentLiab","2B");
  h+=_acRc("Total Equity and liabilities (1C + 2A + 2B)",cl+"TotalEquityLiab","1(I)",{cls:"grand"});
  /* ---- Assets ---- */
  const ppe="bsias.Assets.NonCurrAssets.PropertyPlantEquip.";
  h+=sub("Part II — Assets · Non-current · Property, plant and equipment");
  h+=_acRi("Gross block",ppe+"GrossBlock","Aa",{ind:1});
  h+=_acRi("Depreciation",ppe+"Depreciation","Ab",{ind:1});
  h+=_acRi("Impairment losses",ppe+"ImpairmentLosses","Ac",{ind:1});
  h+=_acRc("Net block (Ad)",ppe+"NetBlock","Ad");
  h+=_acRi("Capital work-in-progress",ppe+"CapWrkProg","B");
  h+=_acRi("Investment property — gross block",ppe+"InvstPropGrossBlock","Ca",{ind:1});
  h+=_acRi("Investment property — depreciation",ppe+"InvstPropDepreciation","Cb",{ind:1});
  h+=_acRi("Investment property — impairment losses",ppe+"InvstPropImprLosses","Cc",{ind:1});
  h+=_acRc("Investment property — net block (Cd)",ppe+"InvstPropNetBlock","Cd");
  h+=_acRi("Goodwill — gross block",ppe+"GoodWlGrossBlock","Da",{ind:1});
  h+=_acRi("Goodwill — impairment losses",ppe+"GoodWlImprLosses","Db",{ind:1});
  h+=_acRc("Goodwill — net block (Dc)",ppe+"GoodWlNetBlock","Dc");
  h+=_acRi("Other intangible assets — gross block",ppe+"OthIntAstGrossBlock","Ea",{ind:1});
  h+=_acRi("Other intangible assets — amortisation",ppe+"OthIntAstAmortisation","Eb",{ind:1});
  h+=_acRi("Other intangible assets — impairment losses",ppe+"OthIntAstImprLosses","Ec",{ind:1});
  h+=_acRc("Other intangible assets — net block (Ed)",ppe+"OthIntAstNetBlock","Ed");
  h+=_acRi("Intangible assets under development",ppe+"IntAstUndrDevlpmnt","F");
  h+=_acRi("Biological assets — gross block",ppe+"BioAstGrossBlock","Ga",{ind:1});
  h+=_acRi("Biological assets — impairment losses",ppe+"BioAstImprLosses","Gb",{ind:1});
  h+=_acRc("Biological assets — net block (Gc)",ppe+"BioAstNetBlock","Gc");
  const nfa=ppe+"FinancialAssets.", inv=nfa+"Investments.";
  h+=sub("H — Financial assets · Investments");
  h+=_acRi("Listed equities",inv+"ListedEquities","Hi1",{ind:1});
  h+=_acRi("Unlisted equities",inv+"UnListedEquities","Hi2",{ind:1});
  h+=_acRc("Total equities",inv+"Total","Hi3");
  h+=_acRi("Preference shares",inv+"InvstPrfShares","Hii",{ind:1});
  h+=_acRi("Government or trust securities",inv+"InvstGovtTrust","Hiii",{ind:1});
  h+=_acRi("Debentures",inv+"InvstInDebenture","Hiv",{ind:1});
  h+=_acRi("Mutual funds",inv+"InvstInMutualFunds","Hv",{ind:1});
  h+=_acRi("Partnership firms",inv+"InvstInPartnershpFirm","Hvi",{ind:1});
  h+=_acOthTbl(inv+"OtherInvestment","Add other investment");
  h+=_acRc("Total of other investments",inv+"OthersTotal","Hvii");
  h+=_acRc("Total non-current investments (HI)",inv+"TotalNonCurrentInvst","HI");
  h+=sub("H II — Trade receivables");
  h+=_acRi("Secured, considered good",nfa+"TradeReceivables.SecuredConsGoods","HIIa",{ind:1});
  h+=_acRi("Unsecured, considered good",nfa+"TradeReceivables.UnSecuredConsGoods","HIIb",{ind:1});
  h+=_acRi("Doubtful",nfa+"TradeReceivables.Doubtful","HIIc",{ind:1});
  h+=_acRc("Total trade receivables (HII)",nfa+"TradeReceivables.TotalTradeReceivbls","HII");
  const lo=nfa+"Loans.";
  h+=sub("H III — Loans");
  h+=_acRi("Security deposits",lo+"SecurityDepsts","HIIIa",{ind:1});
  h+=_acRi("Loans to related parties",lo+"LoansRltdParties","HIIIb",{ind:1});
  h+=_acOthTbl(lo+"OtherLoans","Add other loan");
  h+=_acRc("Total of other loans",lo+"OthersTotal","HIIIc");
  h+=_acRc("Total loans (HIII)",lo+"TotalLoans","HIII");
  h+=sub("H IV — Other financial assets");
  h+=_acRi("Bank deposits",nfa+"OtherFinacialAssets.BankDeposits","HIVa",{ind:1});
  h+=_acRi("Other deposits",nfa+"OtherFinacialAssets.OtherDeposits","HIVb",{ind:1});
  h+=_acRc("Total other financial assets (HIV)",nfa+"OtherFinacialAssets.TotalOthFinancialAsst","HIV");
  h+=_acRi("Deferred tax assets (net)",nfa+"OtherFinacialAssets.DefrdTaxAsst","J0");
  const ona=nfa+"OtherNonCurrentAssets.";
  h+=sub("J — Other non-current assets");
  h+=_acRi("Capital advances",ona+"CapitalAdvanc","Ja",{ind:1});
  h+=_acRi("Advances other than capital advances",ona+"AdvancOthCapital","Jb",{ind:1});
  h+=_acOthTbl(ona+"OtherNonCurrAsst","Add other non-current asset");
  h+=_acRc("Total of others",ona+"OthersTotal","Jc");
  h+=_acRc("Total other non-current assets (J)",ona+"TotalNonCurrAsst","J");
  h+=_acRc("Total non-current assets",nfa+"TotalNonCurrntAsst","NCA",{cls:"grand"});
  const cca="bsias.Assets.CurrentAssets.", cin=cca+"Inventories.";
  h+=sub("Current assets · 2A — Inventories");
  h+=_acRi("Raw materials",cin+"RawMaterials","2Aa",{ind:1});
  h+=_acRi("Work-in-progress",cin+"WorkInProgress","2Ab",{ind:1});
  h+=_acRi("Finished goods",cin+"FinishedGoods","2Ac",{ind:1});
  h+=_acRi("Stock-in-trade",cin+"StockInTrade","2Ad",{ind:1});
  h+=_acRi("Stores and spares",cin+"StoresSpares","2Ae",{ind:1});
  h+=_acRi("Loose tools",cin+"LooseTools","2Af",{ind:1});
  h+=_acRi("Others",cin+"Others","2Ag",{ind:1});
  h+=_acRc("Total inventories (2A)",cin+"TotalInventories","2A");
  const cfa=cca+"FinancialAssets.", cinv=cfa+"Investments.";
  h+=sub("2B — Financial assets · Investments");
  h+=_acRi("Listed equities",cinv+"ListedEquities","Bi1",{ind:1});
  h+=_acRi("Unlisted equities",cinv+"UnListedEquities","Bi2",{ind:1});
  h+=_acRc("Total equities",cinv+"Total","Bi3");
  h+=_acRi("Preference shares",cinv+"InvstPrfShares","Bii",{ind:1});
  h+=_acRi("Government or trust securities",cinv+"InvstGovtTrust","Biii",{ind:1});
  h+=_acRi("Debentures",cinv+"InvstInDebenture","Biv",{ind:1});
  h+=_acRi("Mutual funds",cinv+"InvstInMutualFunds","Bv",{ind:1});
  h+=_acRi("Partnership firms",cinv+"InvstInPartnershpFirm","Bvi",{ind:1});
  h+=_acRi("Other investment",cinv+"OtherInvestment","Bvii",{ind:1});
  h+=_acRc("Total current investments (BI)",cinv+"TotalCurrentInvst","BI");
  h+=sub("B II — Trade receivables");
  h+=_acRi("Secured, considered good",cfa+"TradeReceivables.SecuredConsGoods","BIIa",{ind:1});
  h+=_acRi("Unsecured, considered good",cfa+"TradeReceivables.UnSecuredConsGoods","BIIb",{ind:1});
  h+=_acRi("Doubtful",cfa+"TradeReceivables.Doubtful","BIIc",{ind:1});
  h+=_acRc("Total trade receivables (BII)",cfa+"TradeReceivables.TotalTradeReceivbls","BII");
  const cce=cfa+"CashEquivalents.";
  h+=sub("B III — Cash and cash equivalents");
  h+=_acRi("Balances with banks",cce+"BalancesWithBanks","BIIIa",{ind:1});
  h+=_acRi("Cheques, drafts in hand",cce+"ChequeDraftsInHand","BIIIb",{ind:1});
  h+=_acRi("Cash on hand",cce+"CashOnHand","BIIIc",{ind:1});
  h+=_acOthTbl(cce+"OtherCashDtls","Add other cash item");
  h+=_acRc("Total of others",cce+"OthersTotal","BIIId");
  h+=_acRc("Total cash and cash equivalents (BIII)",cce+"TotalCashEquivalents","BIII");
  h+=_acRi("B IV — Bank balances other than cash and cash equivalents",cfa+"BankBalanceOther","BIV");
  const clo=cfa+"Loans.";
  h+=sub("B V — Loans");
  h+=_acRi("Security deposits",clo+"SecurityDepsts","BVa",{ind:1});
  h+=_acRi("Loans to related parties",clo+"LoansRltdParties","BVb",{ind:1});
  h+=_acOthTbl(clo+"OtherLoans","Add other loan");
  h+=_acRc("Total of other loans",clo+"OthersTotal","BVc");
  h+=_acRc("Total loans (BV)",clo+"TotalLoans","BV");
  h+=_acRi("B VI — Other financial assets",cfa+"OtherFinancialAsst","BVI");
  h+=_acRc("Total financial assets (2B)",cfa+"TotalFinancialAsst","2Bfa");
  h+=_acRi("2C — Current tax assets (net)",cfa+"CurrentTaxAsst","2C");
  const oca=cfa+"OtherCurrentAssets.";
  h+=sub("2D — Other current assets");
  h+=_acRi("Advances other than capital advances",oca+"AdvancOthCapital","2Da",{ind:1});
  h+=_acOthTbl(oca+"OthersCurrentAssts","Add other current asset");
  h+=_acRc("Total of others",oca+"OthersTotal","2Db");
  h+=_acRc("Total other current assets (2D)",oca+"TotalOthCurrentAsst","2D");
  h+=_acRc("Total current assets",oca+"TotalCurrAsst","CA");
  h+=_acRc("II — Total Assets","bsias.TotalAssets","II",{cls:"grand"});
  return h;
}

/* ---------- Part A - OI (Other Information) screen (accOI) ---------- */
function accOI(){
  const o="oi."; let h="";
  h+=note("Part A-OI — Other Information. Mandatory for a filer liable to audit u/s 44AB. Each total feeds a corresponding add-back in Schedule BP.");
  h+=_acRsel("1 — Method of accounting employed in the previous year",o+"MethodOfAcct",ACC_ACCT,"1",{req:1});
  h+=_acRsel("2 — Is there any change in the method of accounting?",o+"ChangeInAcctMethFlg",ACC_OIYN,"2",{req:1});
  h+=_acRi("3a — Increase in profit / decrease in loss due to ICDS deviation",o+"ProfDeviatDueAcctMeth","3a",{hint:"auto-filled from Schedule ICDS when present"});
  h+=_acRi("3b — Decrease in profit / increase in loss due to ICDS deviation",o+"DecProOrIncLossUs145_2","3b",{hint:"auto-filled from Schedule ICDS when present"});
  h+=sub("4 — Method of valuation of closing stock");
  h+=_acRsel("4a — Raw material",o+"MethodOfValClgStk.ValRawMaterial",ACC_VAL,"4a");
  h+=_acRsel("4b — Finished goods",o+"MethodOfValClgStk.ValFinishedGoods",ACC_VAL,"4b");
  h+=_acRsel("4c — Is there any change in the stock valuation method?",o+"MethodOfValClgStk.ChngStockValMetFlg",ACC_OIYN,"4c");
  h+=_acRi("4d — Increase in profit / decrease in loss due to deviation in valuation",o+"MethodOfValClgStk.EffectOnPL","4d");
  h+=_acRi("4e — Decrease in profit / increase in loss due to deviation in valuation",o+"MethodOfValClgStk.DecProOrIncLossUs145_A","4e");
  h+=sub("5 — Amounts not credited to the statement of profit and loss");
  OI_NC5.forEach(x=>{ h+=_acRi(x[1]+" — "+x[2],o+"NoCredToPLAmt."+x[0],x[1],{ind:1}); });
  h+=_acRc("5f — Total amounts not credited to the P&L",o+"NoCredToPLAmt.TotNoCredToPLAmt","5f");
  h+=sub("6 — Amounts debited to the P&L, disallowable under section 36");
  OI36.forEach(x=>{ h+=_acRi(x[1]+" — "+x[2],o+"AmtDisallUs36."+x[0],x[1],{ind:1}); });
  h+=_acRc("6s — Total amount disallowable under section 36",o+"AmtDisallUs36.TotAmtDisallUs36","6s");
  h+=_acRi("6t(i) — Number of employees deployed in India",o+"AmtDisallUs36.NoOfEmployeesEmployed.DeployedInIndia","6ti",{ind:1});
  h+=_acRi("6t(ii) — Number of employees deployed outside India",o+"AmtDisallUs36.NoOfEmployeesEmployed.DeployedOutSideIndia","6tii",{ind:1});
  h+=_acRc("6t(iii) — Total number of employees",o+"AmtDisallUs36.NoOfEmployeesEmployed.Total","6tiii");
  h+=sub("7 — Amounts debited to the P&L, disallowable under section 37");
  OI37.forEach(x=>{ h+=_acRi(x[1]+" — "+x[2],o+"AmtDisallUs37."+x[0],x[1],{ind:1}); });
  h+=_acRc("7k — Total amount disallowable under section 37",o+"AmtDisallUs37.TotAmtDisallUs37","7k");
  h+=sub("8A — Amounts debited to the P&L, disallowable under section 40");
  OI40.forEach(x=>{ h+=_acRi(x[1]+" — "+x[2],o+"AmtDisallUs40."+x[0],x[1],{ind:1}); });
  h+=_acRi("8Ai — Any other disallowance under section 40",o+"AmtDisallUs40.AnyOthDisallowance","8Ai",{ind:1});
  h+=_acRc("8Aj — Total amount disallowable under section 40",o+"AmtDisallUs40.TotAmtDisallUs40","8Aj");
  h+=_acRi("8B — Amount of section 40 disallowance of an earlier year now allowable",o+"AmtDisallUs40.AnyAmtOfSec40AllowPrevYr","8B");
  h+=sub("9 — Amounts debited to the P&L, disallowable under section 40A");
  OI40A.forEach(x=>{ h+=_acRi(x[1]+" — "+x[2],o+"AmtDisallUs40A."+x[0],x[1],{ind:1}); });
  h+=_acRi("9e — Any other disallowance under section 40A",o+"AmtDisallUs40A.AnyOthDisallowance","9e",{ind:1});
  h+=_acRc("9f — Total amount disallowable under section 40A",o+"AmtDisallUs40A.TotAmtDisallUs40A","9f");
  h+=sub("10 — Section 43B: disallowed in an earlier year, allowable this year");
  OI43.forEach(x=>{ h+=_acRi("10"+x[1]+" — "+x[2],o+"AmtDisallUs43BPyNowAll.AmtUs43B."+x[0],"10"+x[1],{ind:1}); });
  h+=_acRc("10 — Total (allowable this year)",o+"AmtDisallUs43BPyNowAll.AmtUs43B.TotAmtUs43b","10tot");
  h+=sub("11 — Section 43B: debited this year, disallowable");
  OI43.forEach(x=>{ h+=_acRi("11"+x[1]+" — "+x[2],o+"AmtDisall43B.AmtUs43B."+x[0],"11"+x[1],{ind:1}); });
  h+=_acRc("11 — Total (disallowable this year)",o+"AmtDisall43B.AmtUs43B.TotAmtUs43b","11tot");
  h+=sub("12 — Amounts of tax/duty/cess/fee outstanding (credit balance in the accounts)");
  OI_EXC.forEach((k,i)=>{ h+=_acRi("12"+String.fromCharCode(97+i)+" — "+k,o+"AmtExciseCustomsVATOutstanding.ExciseCustomsVAT."+k,"12"+String.fromCharCode(97+i),{ind:1}); });
  h+=_acRc("12i — Total outstanding",o+"AmtExciseCustomsVATOutstanding.ExciseCustomsVAT.TotExciseCustomsVAT","12i");
  h+=sub("13 — Amounts deemed to be profits chargeable under section 33AB/33ABA/33AC");
  OI13.forEach(x=>{ h+=_acRi(x[1]+" — "+x[2],o+x[0],x[1],{ind:1}); });
  h+=_acRc("13 — Total deemed profits (33AB + 33ABA + 33AC)",o+"DeemedProfUs33ABs","13");
  h+=_acRi("14 — Amount of profit chargeable to tax under section 41",o+"ProfTaxAmtUs41","14");
  h+=_acRi("15 — Amount of income/expenditure of a prior period credited/debited to the P&L",o+"PriorAmtIncCrDrPL","15");
  h+=_acRi("16 — Amount of expenditure disallowed under section 14A",o+"AmountOfExpDisAllwUs14A","16");
  h+=_acRi("17 — Amount of interest inadmissible under section 23 of the MSMED Act, 2006",o+"InterestDisAllowUs23SMEAct","17");
  h+=_acRsel("18 — Whether an option is exercised under section 92CE(2A)?",o+"ScheduleTPSAFlg",ACC_OIYN,"18");
  return h;
}

/* ---------- Part A - QD (Quantitative Details) screen (accQD) ---------- */
function accQD(){
  let h=note("Part A-QD — Quantitative details of stock. Mandatory for a filer liable to audit u/s 44AB. Enter physical quantities (no commas, no units).");
  h+=sub("(a) Trading concern");
  h+=grid("accounts.qd.trd",
    [{k:"ItemName",h:"Item name",t:"txt",w:"auto",req:1,max:50},{k:"UnitOfMeasure",h:"Unit",t:"sel",opts:ACC_UNIT,req:1},
     {k:"OpeningStock",h:"Opening",t:"num",w:"110px"},{k:"PurchaseQty",h:"Purchase",t:"num",w:"110px"},
     {k:"SaleQty",h:"Sales",t:"num",w:"110px"},{k:"ClgStock",h:"Closing",t:"num",w:"110px"},
     {k:"AnyShortExces",h:"Shortage/excess",t:"num",w:"120px"}],
    _acArr("qd.trd"),{min:"900px",empty:"No trading items.",add:"Add trading item"});
  h+=sub("(b) Manufacturing concern — raw materials");
  h+=grid("accounts.qd.raw",
    [{k:"ItemName",h:"Item name",t:"txt",w:"auto",req:1,max:50},{k:"UnitOfMeasure",h:"Unit",t:"sel",opts:ACC_UNIT,req:1},
     {k:"OpeningStock",h:"Opening",t:"num",w:"100px"},{k:"PurchaseQty",h:"Purchase",t:"num",w:"100px"},
     {k:"PrevYrConsum",h:"Consumption",t:"num",w:"110px"},{k:"SaleQty",h:"Sales",t:"num",w:"90px"},
     {k:"ClgStock",h:"Closing",t:"num",w:"90px"},{k:"yldFinisProd",h:"Yield",t:"num",w:"90px"},
     {k:"PercentYld",h:"% yield",t:"num",w:"90px"},{k:"AnyShortExces",h:"Shortage/excess",t:"num",w:"110px"}],
    _acArr("qd.raw"),{min:"1200px",empty:"No raw materials.",add:"Add raw material"});
  h+=sub("(c) Manufacturing concern — finished goods / by-products");
  h+=grid("accounts.qd.fin",
    [{k:"ItemName",h:"Item name",t:"txt",w:"auto",req:1,max:50},{k:"UnitOfMeasure",h:"Unit",t:"sel",opts:ACC_UNIT,req:1},
     {k:"OpeningStock",h:"Opening",t:"num",w:"100px"},{k:"PurchaseQty",h:"Purchase",t:"num",w:"100px"},
     {k:"PrevyrManfact",h:"Manufactured",t:"num",w:"120px"},{k:"SaleQty",h:"Sales",t:"num",w:"100px"},
     {k:"ClgStock",h:"Closing",t:"num",w:"100px"},{k:"AnyShortExces",h:"Shortage/excess",t:"num",w:"120px"}],
    _acArr("qd.fin"),{min:"1000px",empty:"No finished goods.",add:"Add finished good"});
  return h;
}

/* ---------- Part A - OL (Receipt & Payment · liquidation) screen (accOL) ---------- */
function accOL(){
  const o="ol."; let h="";
  h+=note("Part A-OL — Receipt and payment account of a company under liquidation (substitutes the Balance Sheet / P&L). Amounts in rupees.");
  h+=sub("1 — Opening balance");
  h+=_acRi("Cash in hand",o+"OpeningBal.CashInHand","1i",{ind:1});
  h+=_acRi("Bank",o+"OpeningBal.CashInBank","1ii",{ind:1});
  h+=_acRc("Total opening balance (i + ii)",o+"OpeningBal.TotalOpenBal","1iii");
  h+=sub("2 — Receipts");
  h+=_acRi("Interest",o+"Receipts.Interest","2i",{ind:1});
  h+=_acRi("Dividend",o+"Receipts.Dividend","2ii",{ind:1});
  h+=grid("accounts."+o+"Receipts.SaleOfAssets.SaleOfAssetsDtls",
    [{k:"OthNatOfInc",h:"Sale of assets — nature",t:"txt",w:"auto",req:1,max:100},{k:"OthAmount",h:"Amount",t:"num",w:"150px",req:1}],
    _acArr("ol.Receipts.SaleOfAssets.SaleOfAssetsDtls"),{min:"480px",empty:"No asset sales.",add:"Add asset sale"});
  h+=_acRc("2iiib — Total sale of assets",o+"Receipts.TotalSaleofAssets","2iiib");
  h+=_acRi("Realization of dues / debtors",o+"Receipts.RlznDuesDebtors","2iv",{ind:1});
  h+=grid("accounts."+o+"Receipts.OthersIncRec.OthersIncDtls",
    [{k:"OthNatOfInc",h:"Other receipt — nature",t:"txt",w:"auto",req:1,max:100},{k:"TypeOfIncome",h:"Revenue/Capital",t:"sel",opts:ACC_RC,req:1},{k:"OthAmount",h:"Amount",t:"num",w:"150px",req:1}],
    _acArr("ol.Receipts.OthersIncRec.OthersIncDtls"),{min:"620px",empty:"No other receipts.",add:"Add other receipt"});
  h+=_acRc("2vb — Total other receipts",o+"Receipts.TotOthersReceiptsOnly","2vb");
  h+=_acRc("2vi — Total receipts",o+"Receipts.TotalOfReceipts","2vi");
  h+=_acRc("3 — Total of opening balance and receipts",o+"TotalOpenReceipts","3",{cls:"grand"});
  h+=sub("4 — Payments");
  h+=_acRi("Repayment of secured loans",o+"Payments.RepaymentSecuredloan","4i",{ind:1});
  h+=_acRi("Repayment of unsecured loans",o+"Payments.RepaymentUnsecuredloan","4ii",{ind:1});
  h+=_acRi("Repayment to creditors",o+"Payments.RepaymentCreditors","4iii",{ind:1});
  h+=_acRi("Commission",o+"Payments.Commission","4iv",{ind:1});
  h+=grid("accounts."+o+"Payments.OthersPayments.OthersPaymentsDtls",
    [{k:"OthNatOfInc",h:"Other payment — nature",t:"txt",w:"auto",req:1,max:100},{k:"OthAmount",h:"Amount",t:"num",w:"150px",req:1}],
    _acArr("ol.Payments.OthersPayments.OthersPaymentsDtls"),{min:"480px",empty:"No other payments.",add:"Add other payment"});
  h+=_acRc("4vb — Total other payments",o+"Payments.TotalOthersPayments","4vb");
  h+=_acRc("4vi — Total payments",o+"Payments.TotalPayments","4vi");
  h+=sub("5 — Closing balance");
  h+=_acRi("Cash in hand",o+"ClosingStock.CashInHand","5i",{ind:1});
  h+=_acRi("Bank",o+"ClosingStock.CashInBank","5ii",{ind:1});
  h+=_acRc("Total closing balance (i + ii)",o+"ClosingStock.TotalClBal","5iii");
  h+=_acRc("6 — Total of closing balance and payments (4vi + 5iii)",o+"TotalClPaymnts","6",{cls:"grand"});
  return h;
}

/* =====================================================================
   SCREEN — orchestrator: basis selector, then the block folds.
   ===================================================================== */
function _acCR(n){ n=R(n); return n?CR(n):""; }
function secAccounts(){
  const A=S.accounts||{}; let h="";
  h+=note("<b>Part A — Audited accounts.</b> Enter the audited Balance Sheet, Manufacturing / Trading Account and Statement of Profit &amp; Loss (or the Ind-AS set), the tax-audit Other Information (Part A-OI) and the Quantitative Details. Amounts are in rupees. The four Balance-Sheet / P&amp;L blocks are always filed (the schema requires all four); the set not used is filed as zeros.");
  h+=row("Basis of accounts",sel("accounts.basis",ACC_BASIS),{ref:"Part A",hint:"Schedule III, Ind-AS, or (in liquidation) the Receipt & Payment account"});
  const basis=st0(A.basis)||"reg";
  if(basis==="ol"){
    h+=fold("ac_ol","OL","Receipt and payment account (company under liquidation)",_acCR((S.C.accounts||{}).olIn),accOL(),{def:true});
    return h;
  }
  const ias=basis==="ias";
  const P=ias?{bs:"bsias",mfg:"mfgias",trd:"trdias",pl:"plias"}:{bs:"bs",mfg:"mfg",trd:"trd",pl:"pl"};
  const C=S.C.accounts||{};
  const bsTot=ias?C.biasTotEL:C.bsTotEL, mism=ias?C.biasMismatch:C.bsMismatch;
  h+=fold("ac_bs","1","Balance Sheet"+(ias?" (Ind AS)":""),(bsTot?_acCR(bsTot)+(mism?" ⚠ does not balance":" ✓"):""),ias?accBSias():accBS(),{def:true});
  h+=fold("ac_mfg","Mfg","Manufacturing Account"+(ias?" (Ind AS)":"")+" — if a manufacturing concern","",accMfg(P.mfg),{});
  h+=fold("ac_trd","Trd","Trading Account"+(ias?" (Ind AS)":""),"",accTrd(P.trd),{def:true});
  h+=fold("ac_pl","P&L","Statement of Profit and Loss"+(ias?" (Ind AS)":""),_acCR(ias?C.pbtIndAs:C.pbt),accPL(P.pl,ias),{def:true});
  h+=fold("ac_oi","OI","Part A-OI — Other Information (tax-audit annexure)","",accOI(),{def:true});
  h+=fold("ac_qd","QD","Part A-QD — Quantitative Details","",accQD(),{});
  return h;
}

/* =====================================================================
   EXPORT helpers — a schema-clean serializer. Every leaf written is a
   verbatim schema key: the state subtree mirrors the schema shape and the
   engine only ever writes schema keys, so a guided copy is exact. Numbers
   are coerced to whole rupees; empty branches/strings are dropped.
   ===================================================================== */
function _acEnum(v,allowed,def){ const t=st0(v); return allowed.indexOf(t)>=0?t:def; }
function _acClean(v){
  if(Array.isArray(v)) return _acRows(v);
  if(v&&typeof v==="object"){
    const o={}; for(const k of Object.keys(v)){ const c=_acClean(v[k]); if(c!==undefined) o[k]=c; }
    return Object.keys(o).length?o:undefined;
  }
  if(typeof v==="number") return R(v);
  const t=st0(v); return t===""?undefined:t;
}
function _acRows(a){
  if(!Array.isArray(a)) return undefined;
  const out=a.map(_acClean).filter(v=>v!==undefined);
  return out.length?out:undefined;
}
/* overlay src onto dst (the SKEL / required skeleton subtree), adding arrays
   and optional leaves from state without ever creating an empty object. */
function _acOverlay(dst,src){
  if(!dst||src==null||typeof src!=="object") return;
  for(const k of Object.keys(src)){
    const v=src[k];
    if(Array.isArray(v)){ const r=_acRows(v); if(r) dst[k]=r; }
    else if(v&&typeof v==="object"){
      if(_acClean(v)===undefined) continue;
      if(dst[k]==null||typeof dst[k]!=="object"||Array.isArray(dst[k])) dst[k]={};
      _acOverlay(dst[k],v);
    }
    else if(typeof v==="number") dst[k]=R(v);
    else { const t=st0(v); if(t!=="") dst[k]=t; }
  }
}
/* one QD row: integer columns via R, PercentYld kept as a number */
function _acQrow(r){
  if(!r||typeof r!=="object") return undefined; const o={};
  const put1=(k,fn)=>{ const v=r[k]; if(v!=null&&st0(v)!=="") o[k]=fn(v); };
  put1("ItemName",st0); put1("UnitOfMeasure",st0);
  ["OpeningStock","PurchaseQty","PrevYrConsum","PrevyrManfact","SaleQty","ClgStock","yldFinisProd","AnyShortExces"].forEach(k=>put1(k,x=>R(x)));
  put1("PercentYld",x=>N(x));
  return Object.keys(o).length?o:undefined;
}
function _acQrows(a){ if(!Array.isArray(a))return undefined; const out=a.map(_acQrow).filter(v=>v!==undefined); return out.length?out:undefined; }
/* the required-leaf skeleton for Part A-OI (zeros + enum defaults) */
function _acOIskel(){
  const zobj=keys=>{ const x={}; keys.forEach(k=>x[k]=0); return x; };
  return {
    MethodOfAcct:"MERC", ChangeInAcctMethFlg:"N", ProfDeviatDueAcctMeth:0, DecProOrIncLossUs145_2:0,
    MethodOfValClgStk:{ValRawMaterial:"1",ValFinishedGoods:"1",ChngStockValMetFlg:"N",EffectOnPL:0,DecProOrIncLossUs145_A:0},
    NoCredToPLAmt:zobj(OI_NC5.map(r=>r[0]).concat("TotNoCredToPLAmt")),
    AmtDisallUs36:zobj(OI36.map(r=>r[0]).concat("TotAmtDisallUs36")),
    AmtDisallUs37:zobj(OI37.map(r=>r[0]).concat("TotAmtDisallUs37")),
    AmtDisallUs40:zobj(OI40.map(r=>r[0]).concat("TotAmtDisallUs40")),
    AmtDisallUs40A:zobj(OI40A.map(r=>r[0]).concat("TotAmtDisallUs40A")),
    AmtDisallUs43BPyNowAll:{AmtUs43B:zobj(OI43.slice(0,7).map(r=>r[0]).concat("TotAmtUs43b"))},
    AmtDisall43B:{AmtUs43B:zobj(OI43.slice(0,8).map(r=>r[0]).concat("TotAmtUs43b"))},
    AmtExciseCustomsVATOutstanding:{ExciseCustomsVAT:{TotExciseCustomsVAT:0}},
    DeemedProfUs33ABs:0, ProfTaxAmtUs41:0, PriorAmtIncCrDrPL:0, AmountOfExpDisAllwUs14A:0, ScheduleTPSAFlg:"N"
  };
}
function _acOI(j){
  const A=S.accounts||{}, sk=_acOIskel();
  const st=deep(A.oi||{});
  try{ if(st.AmtDisallUs36) delete st.AmtDisallUs36.NoOfEmployeesEmployed; }catch(e){}
  _acOverlay(sk,st);
  sk.MethodOfAcct=_acEnum(RG(A,"oi.MethodOfAcct"),["MERC","CASH"],"MERC");
  sk.ChangeInAcctMethFlg=_acEnum(RG(A,"oi.ChangeInAcctMethFlg"),["Y","N"],"N");
  sk.MethodOfValClgStk.ValRawMaterial=_acEnum(RG(A,"oi.MethodOfValClgStk.ValRawMaterial"),["1","2","3"],"1");
  sk.MethodOfValClgStk.ValFinishedGoods=_acEnum(RG(A,"oi.MethodOfValClgStk.ValFinishedGoods"),["1","2","3"],"1");
  sk.MethodOfValClgStk.ChngStockValMetFlg=_acEnum(RG(A,"oi.MethodOfValClgStk.ChngStockValMetFlg"),["Y","N"],"N");
  sk.ScheduleTPSAFlg=_acEnum(RG(A,"oi.ScheduleTPSAFlg"),["Y","N"],"N");
  const eIn=N(RG(A,"oi.AmtDisallUs36.NoOfEmployeesEmployed.DeployedInIndia")), eOut=N(RG(A,"oi.AmtDisallUs36.NoOfEmployeesEmployed.DeployedOutSideIndia"));
  if(eIn||eOut) sk.AmtDisallUs36.NoOfEmployeesEmployed={DeployedInIndia:R(eIn),DeployedOutSideIndia:R(eOut),Total:R(eIn)+R(eOut)};
  j.PARTA_OI=sk;
}
function _acOL(j){
  const A=S.accounts||{};
  const sk={
    OpeningBal:{CashInHand:0,CashInBank:0,TotalOpenBal:0},
    Receipts:{Interest:0,Dividend:0,TotalSaleofAssets:0,RlznDuesDebtors:0,TotOthersReceiptsOnly:0,TotalOfReceipts:0},
    TotalOpenReceipts:0,
    Payments:{RepaymentSecuredloan:0,RepaymentUnsecuredloan:0,RepaymentCreditors:0,Commission:0,TotalOthersPayments:0,TotalPayments:0},
    ClosingStock:{CashInHand:0,CashInBank:0,TotalClBal:0},
    TotalClPaymnts:0
  };
  _acOverlay(sk,A.ol||{});
  j.PARTA_OL=sk;
}
function _acQD(j){
  const A=S.accounts||{}, qd=A.qd||{};
  const trd=_acQrows(qd.trd), raw=_acQrows(qd.raw), fin=_acQrows(qd.fin);
  const o={};
  if(trd) o.TradingConcern={QuantitDet:trd};
  if(raw||fin) o.ManfactrConcern={RawMaterial:raw?{QuantitDet:raw}:{}, FinishrByProd:fin?{QuantitDet:fin}:{}};
  if(Object.keys(o).length) j.PARTA_QD=o;
}
const _acOIon=A=>!!(A&&(A.oiOn||_accHas(A.oi)));
const _acOLon=A=>!!(A&&(A.olOn||_accHas(A.ol)));
/* TradingAccountIndAS required-leaf skeleton (its schema requires more input
   leaves than the regular Trading Account) */
function _acTrdiasSkel(){
  return { GrossRcptFromProfession:0, OpngStckOfFinishedStcks:0, Purchases:0, CarriageInward:0, PowerAndFuel:0,
    TotOthDirectExpenses:0, OperatingRevenueTotal:0, SalesGrossReceiptsTotal:0, TotRevenueFrmOperations:0,
    TardingAccTotCred:0, GrossProfitFrmBusProf:0,
    ExciseCustomsVAT:{CentralGoodServiceTax:0,StateGoodServiceTax:0,IntegratedGoodServiceTax:0,UnionTerrGoodServiceTax:0,TotExciseCustomsVAT:0} };
}

/* PARTA_PLIndAS (schema-required, always filed): overlay CreditsToPL /
   DebitsToPL onto SKEL; the OtherComprnsvInc block is OPTIONAL, so emit it
   only when it carries real OCI data — and then with every required leaf,
   since SKEL does not carry the OCI skeleton. */
function _acPLias(j, plias){
  plias=plias||{};
  const oci=plias.OtherComprnsvInc;
  const rest=deep(plias); try{ delete rest.OtherComprnsvInc; }catch(e){}
  _acOverlay(j.PARTA_PLIndAS, rest);
  if(oci&&typeof oci==="object"){
    const probe=deep(oci);
    try{ delete probe.TotalComprIncome;
      if(probe.ItemsNotReclsfdPnL){ delete probe.ItemsNotReclsfdPnL.OthersTotal; delete probe.ItemsNotReclsfdPnL.TotalNotPnL; }
      if(probe.ItemsReclsfdPnL){ delete probe.ItemsReclsfdPnL.OthersTotal; delete probe.ItemsReclsfdPnL.TotalPnL; }
    }catch(e){}
    if(_accHas(probe)){
      const osk={ ItemsNotReclsfdPnL:{ChangesInSurplus:0,ReMesDefinedBenftPlans:0,EquityOCI:0,FairValFVTPl:0,ShareOfOtherComprInc:0,OthersTotal:0,IncomeTaxNotPnL:0,TotalNotPnL:0},
                  ItemsReclsfdPnL:{ExchangeDiff:0,DebtsOCI:0,EffecPortionGainnLoss:0,ShareOCI:0,OthersTotal:0,IncomeTaxReclsPnL:0,TotalPnL:0},
                  TotalComprIncome:0 };
      _acOverlay(osk, oci);
      j.PARTA_PLIndAS.OtherComprnsvInc=osk;
    }
  }
}

function expAccounts(j){
  const A=S.accounts||{};
  /* the four schema-required blocks: overlay live values onto the SKEL zero
     skeleton already present in j (SKEL carries every required leaf). */
  _acOverlay(j.PARTA_BSFor6FrmAY13, A.bs);
  _acOverlay(j.PARTA_BSIndAS,       A.bsias);
  _acOverlay(j.PARTA_PL,            A.pl);
  _acPLias(j, A.plias);
  /* optional blocks — emitted only when they carry data */
  if(_accHas(A.mfg))    j.ManufacturingAccount     =_acClean(A.mfg);
  if(_accHas(A.trd))    j.TradingAccount            =_acClean(A.trd);
  if(_accHas(A.mfgias)) j.ManufacturingAccountIndAS =_acClean(A.mfgias);
  /* TradingAccountIndAS requires input leaves the engine does not write
     (GST fields, opening stock, purchases, carriage, power) — overlay onto
     a required-leaf skeleton so every mandatory leaf is present. */
  if(_accHas(A.trdias)){ const tsk=_acTrdiasSkel(); _acOverlay(tsk,A.trdias); j.TradingAccountIndAS=tsk; }
  if(_acOIon(A)) _acOI(j);
  if(_accHas(A.qd)) _acQD(j);
  if(_acOLon(A)) _acOL(j);
}

/* =====================================================================
   IMPORT — inverse of the exporter. The state subtree equals the schema
   shape, so a raw copy back into S.accounts round-trips to the byte; QD's
   three helper arrays are the only remapping. Totals are re-derived by the
   engine on the following compute(), so the round-trip is identity.
   ===================================================================== */
function impAccounts(I6){
  const read=[]; if(!I6||typeof I6!=="object") return read;
  const A=S.accounts=S.accounts||{};
  const cp=(k,ns,flag,label)=>{ const b=I6[k]; if(b!=null&&typeof b==="object"){ A[ns]=deep(b); if(flag)A[flag]=true; if(label)read.push(label); return true; } return false; };
  cp("PARTA_BSFor6FrmAY13","bs","bsOn","Part A — Balance Sheet");
  cp("PARTA_BSIndAS","bsias","biasOn",null);
  cp("PARTA_PL","pl","plOn","Part A — Statement of Profit and Loss");
  cp("PARTA_PLIndAS","plias","pliasOn",null);
  cp("ManufacturingAccount","mfg","mfgOn","Part A — Manufacturing Account");
  cp("TradingAccount","trd","trdOn","Part A — Trading Account");
  cp("ManufacturingAccountIndAS","mfgias","mfgiasOn",null);
  cp("TradingAccountIndAS","trdias","trdiasOn",null);
  if(cp("PARTA_OI","oi","oiOn","Part A — Other Information (OI)")) {}
  const qd=I6.PARTA_QD;
  if(qd&&typeof qd==="object"){
    A.qd={ trd:RG(qd,"TradingConcern.QuantitDet",[])||[],
           raw:RG(qd,"ManfactrConcern.RawMaterial.QuantitDet",[])||[],
           fin:RG(qd,"ManfactrConcern.FinishrByProd.QuantitDet",[])||[] };
    A.qdOn=true; read.push("Part A — Quantitative Details (QD)");
  }
  if(cp("PARTA_OL","ol","olOn","Part A — Receipt & Payment (company under liquidation)")) {}
  /* infer the screen basis so the imported set shows on the right path */
  if(_accHas(A.ol)) A.basis="ol";
  else if(_accHas(A.bsias)&&!_accHas(A.bs)) A.basis="ias";
  else if(!st0(A.basis)) A.basis="reg";
  return read;
}

/* =====================================================================
   CHECKS — this section's own screen validations (not department rules).
   ===================================================================== */
function chkAccounts(){
  const out=[]; const A=S.accounts||{}, C=S.C.accounts||{};
  const add=(lvl,t,m)=>out.push({lvl,t,m,sec:"accounts"});
  const basis=st0(A.basis)||"reg";
  if(basis==="ol"){
    if(_accHas(A.ol)&&C.olMismatch)
      add("err","Receipt & payment account does not tie","Total of opening balance and receipts (₹"+F(C.olIn)+") must equal the total of closing balance and payments (₹"+F(C.olOut)+").");
    return out;
  }
  const ias=basis==="ias";
  const mism=ias?C.biasMismatch:C.bsMismatch;
  const el=ias?C.biasTotEL:C.bsTotEL, as=ias?C.biasTotAsset:C.bsTotAsset;
  if((el||as)&&mism)
    add("err","Balance Sheet does not balance","Total Equity & Liabilities (₹"+F(el)+") must equal Total Assets (₹"+F(as)+").");
  else if(el&&as)
    add("ok","Balance Sheet balances","Both sides foot to ₹"+F(el)+".");
  const pbt=ias?C.pbtIndAs:C.pbt;
  if(N(pbt)!==0) add("ok","P&L profit before tax","₹"+F(pbt)+" (P&L item 53) — enter the same figure at Schedule BP item 1.");
  if(_acOIon(A)&&!st0(RG(A,"oi.MethodOfAcct")))
    add("warn","Part A-OI method of accounting unanswered","State the method of accounting (item 1) — defaults to Mercantile on export.");
  return out;
}

/* ---- register (overrides the boot stub for "accounts") ---------------- */
reg({id:"accounts", t:"Audited accounts", ref:"BS · Mfg/Trading · P&L · Ind-AS · OI · QD · OL",
  f:secAccounts,
  s:()=>{ const C=S.C.accounts||{}; const el=C.bsTotEL||C.biasTotEL||0; const pbt=C.pbt||C.pbtIndAs||0;
    return el?(CR(el)+(( (C.bsMismatch&&C.bsTotEL)||(C.biasMismatch&&C.biasTotEL))?" ⚠":"")):(pbt?"PBT "+CR(pbt):""); },
  eng:engAccounts, exp:expAccounts, imp:impAccounts, chk:chkAccounts, order:15, corder:15});
