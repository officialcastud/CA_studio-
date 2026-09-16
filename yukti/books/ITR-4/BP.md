# Schedule BP — Details of Income from Business or Profession (Presumptive)

Schema block: `ScheduleBP`. Sheet: **BP**.

## The shape
Schedule BP in ITR-4 is the presumptive business/profession schedule: it computes income under section **44AD** (business), section **44ADA** (profession) and section **44AE** (goods carriages), with no regular profit-and-loss computation. Each presumptive section has a small "nature of business" table (name, business code, description) followed by a computation block; the three presumptive incomes roll up into E8 "Income chargeable under Business or Profession". The schedule closes with a GST turnover-reconciliation table (E9/E10) and the mandatory FINANCIAL PARTICULARS of the business (E11–E25). Many detailed / reconciliation rows are hidden in ITR-4 and are not built as items.

## The items

### Nature of business — section 44AD (`NatOfBus44AD[]`, rows 12–17, array)
| item | field label | type | schema key | rule/notes |
|---|---|---|---|---|
| Sl.No. | Sl.No. | serial | — | auto (D14=D13+1 …) |
| E12 | Name of the Business | string | `NatOfBus44AD[].NameOfBusiness` | maxLength 75; required per item |
| F12 | Business Code | enum | `NatOfBus44AD[].CodeAD` | dropdown NOB44AD; required per item |
| I12 | Description | string | `NatOfBus44AD[].Description` | maxLength 75 |

### Computation — presumptive income under 44AD (`PersumptiveInc44AD`, rows 19–26, single object)
| item | field label | type | schema key | rule/notes |
|---|---|---|---|---|
| E1 | Gross Turnover or Gross Receipts (E1 limited to Rs.2 Crores) | integer | `PersumptiveInc44AD.GrsTotalTrnOver` | required; max 30000000 |
| (a) | Through a/c payee cheque or a/c payee bank draft or bank electronic clearing system or prescribed electronic modes | integer | `PersumptiveInc44AD.GrsTrnOverBank` | max 30000000 |
| (b) | Receipts in Cash | integer | `PersumptiveInc44AD.GrsTotalTrnOverInCash` | max 30000000 |
| (c) | Any mode other than a and b | integer | `PersumptiveInc44AD.GrsTrnOverAnyOthMode` | max 30000000 |
| E2 | Presumptive income under section 44AD | — | (E2 = a+b) | header |
| (a) | 6% of E1a or the amount claimed to have been earned, whichever is higher | integer | `PersumptiveInc44AD.PersumptiveInc44AD6Per` | |
| (b) | 8% of (E1b+E1c) or the amount claimed to have been earned, whichever is higher | integer | `PersumptiveInc44AD.PersumptiveInc44AD8Per` | |
| (c) | Total (a + b) | integer | `PersumptiveInc44AD.TotPersumptiveInc44AD` | required; max 30000000 |

Note 1: If income is less than the above percentage of Gross Receipts, it is mandatory to have a tax audit.

### Nature of business/profession — section 44ADA (`NatOfBus44ADA[]`, rows 29–35, array)
| item | field label | type | schema key | rule/notes |
|---|---|---|---|---|
| Sl.No. | Sl.No. | serial | — | auto |
| E29 | Name of Business/Profession | string | `NatOfBus44ADA[].NameOfBusiness` | maxLength 75; required per item |
| F29 | Business Code | enum | `NatOfBus44ADA[].CodeADA` | dropdown NOB44ADA; required per item |
| I29 | Description | string | `NatOfBus44ADA[].Description` | maxLength 75 |

### Computation — presumptive income from professions under 44ADA (`PersumptiveInc44ADA`, rows 37–41, single object)
| item | field label | type | schema key | rule/notes |
|---|---|---|---|---|
| E3 | Gross Receipts (E3 limited to Rs.50 Lakhs) | integer | `PersumptiveInc44ADA.GrsReceipt` | required; max 7500000 |
| (a) | Through a/c payee cheque or a/c payee bank draft or bank electronic clearing system or prescribed electronic modes | integer | `PersumptiveInc44ADA.GrsTrnOverBank44ADA` | max 7500000 |
| (b) | Receipts in Cash | integer | `PersumptiveInc44ADA.GrsTotalTrnOverInCash44ADA` | max 7500000 |
| (c) | Any mode other than a and b | integer | `PersumptiveInc44ADA.GrsTrnOverAnyOthMode44ADA` | max 7500000 |
| E4 | Presumptive Income under section 44ADA (50% of E3) or the amount claimed to have been earned, whichever is higher | integer | `PersumptiveInc44ADA.TotPersumptiveInc44ADA` | required; max 7500000 |

NOTE: If income is less than 50% of Gross Receipts, it is mandatory to have a tax audit under 44AB.

### Nature of business — section 44AE goods carriages (`NatOfBus44AE[]`, rows 44–49, array)
| item | field label | type | schema key | rule/notes |
|---|---|---|---|---|
| Sl.No | Sl.No | serial | — | auto |
| E44 | Name of the Business | string | `NatOfBus44AE[].NameOfBusiness` | maxLength 75; required per item |
| F44 | Business Code | enum | `NatOfBus44AE[].CodeAE` | dropdown NOB (7 transport codes); required per item |
| I44 | Description | string | `NatOfBus44AE[].Description` | maxLength 75 |

### Goods carriage details — section 44AE (`GoodsDtlsUs44AE[]`, rows 53–63, array, maxItems 10)
| item | field label | type | schema key | rule/notes |
|---|---|---|---|---|
| SL.NO | SL.NO | serial | — | auto |
| E53 | Registration No. of goods carriage | string | `GoodsDtlsUs44AE[].RegNumberGoodsCarriage` | maxLength 11; required; must not repeat |
| F53 | Whether owned/leased/hired | enum | `GoodsDtlsUs44AE[].OwnedLeasedHiredFlag` | dropdown Owned/Leased/Hired; required |
| G53 | Tonnage Capacity of goods carriage (in MT) | integer | `GoodsDtlsUs44AE[].TonnageCapacity` | required; max 100 |
| H53 | Number of months for which goods carriage was owned/ leased / hired by assessee | integer | `GoodsDtlsUs44AE[].HoldingPeriod` | holding period in months; min 1 max 12 |
| I53 | Presumptive income u/s 44AE for the goods carriage (minimum Rs 1000 per ton per month) | integer | `GoodsDtlsUs44AE[].PresumptiveIncome` | required; min 7500 |

Note: If the profits are lower than prescribed under Section 44AE or the number of Vehicles owned exceeds the limit, a tax audit is required.

### Computation — presumptive income under 44AE and roll-up (`PersumptiveInc44AE`, rows 65–72, single object)
| item | field label | type | schema key | rule/notes |
|---|---|---|---|---|
| E5 | Presumptive Income from Goods Carriage under section 44AE [total of column (5)] | integer | `PersumptiveInc44AE.TotPersumInc44AE` | required; = SUM(Sheet44AE.PresumptiveIncome) |
| E6 | Salary and interest paid to the partners | integer | `PersumptiveInc44AE.SalInterestByFirm` | to be filled up only by firms |
| E7 | Presumptive Income u/s 44AE (E5-E6) | integer | `PersumptiveInc44AE.TotalPersumptiveInc` | required; MAX(0, E5-E6) |
| E8 | Income chargeable under Business or Profession (E2c+ E4+ E7) | integer | `PersumptiveInc44AE.IncChargeableUnderBus` | required; MAX(0, sum) |

### GST turnover reported (`TurnoverGrsRcptForGSTIN[]`, rows 73–79, array; and total row 83)
| item | field label | type | schema key | rule/notes |
|---|---|---|---|---|
| E9 | INFORMATION REGARDING TURNOVER/GROSS RECEIPT REPORTED FOR GST | — | — | header/note |
| Sl.No. | Sl.No. | serial | — | auto |
| E74 | GSTIN No.(s) | string | `TurnoverGrsRcptForGSTIN[].GSTINNo` | required per item |
| F74 | Annual Value of Outward Supplies as per the GST Return Filed | integer | `TurnoverGrsRcptForGSTIN[].AmtTurnGrossRcptGSTIN` | required; max 99999999999999 |
| E10 | Total of value of Outward Supplies as per the GST returns filed | integer | `TotalTurnoverGrsRcptGSTIN` | = SUM(BP.GSTRAmount) |

### Financial particulars of the business (`FinanclPartclrOfBusiness`, rows 92–110, single object)
| item | field label | type | schema key | rule/notes |
|---|---|---|---|---|
| E11 | Partners/ members own capital | integer | `FinanclPartclrOfBusiness.PartnerMemberOwnCapital` | |
| E12 | Secured loans | integer | `FinanclPartclrOfBusiness.SecuredLoans` | |
| E13 | Unsecured loans | integer | `FinanclPartclrOfBusiness.UnSecuredLoans` | |
| E14 | Advances | integer | `FinanclPartclrOfBusiness.Advances` | |
| E15 | Sundry creditors | integer | `FinanclPartclrOfBusiness.SundryCreditors` | mandatory |
| E16 | Other liabilities | integer | `FinanclPartclrOfBusiness.OthrCurrLiab` | |
| E17 | Total capital and liabilities (E11+E12+E13+E14+E15+E16) | integer | `FinanclPartclrOfBusiness.TotCapLiabilities` | = SUM(I94:I99) |
| E18 | Fixed assets | integer | `FinanclPartclrOfBusiness.FixedAssets` | |
| E18(a) | Investments | integer | `FinanclPartclrOfBusiness.Investments` | |
| E19 | Inventories | integer | `FinanclPartclrOfBusiness.Inventories` | mandatory |
| E20 | Sundry debtors | integer | `FinanclPartclrOfBusiness.SundryDebtors` | mandatory |
| E21 | Balance with banks | integer | `FinanclPartclrOfBusiness.BalWithBanks` | mandatory |
| E22 | Cash-in-hand | integer | `FinanclPartclrOfBusiness.CashInHand` | mandatory |
| E23 | Loans and advances | integer | `FinanclPartclrOfBusiness.LoansAndAdvances` | |
| E24 | Other Assets | integer | `FinanclPartclrOfBusiness.OtherAssets` | |
| E25 | Total assets (E18+E18a+E19+E20+E21+E22+E23+E24) | integer | `FinanclPartclrOfBusiness.TotalAssets` | = SUM(I101:I108) |

NOTE― For E11 to E25 furnish the information as on 31st day of March, 2026. Note: E15, E19, E20, E21, E22 are mandatory and others if available.

## The rules the sheet computes
- `[I19]` E1 Gross Turnover = SUM(BP_E1a, BP_E1a_E1b, BP_E1b) — E1 must match a+b+c.
- `[O20]` 5% of E1 = O22*5/100 (cash-receipt threshold test for 44AD).
- `[O22]` = SUM(BP_E1a, BP_E1a_E1b, BP_E1b).
- `[O26]` 44AD cap: IF(O23>O20, MIN(O22,20000000), IF(O23<=O20, MIN(O22,30000000))) — Rs 2 crore limit, raised to Rs 3 crore when cash receipts ≤ 5%.
- `[I26]` E2c Total = SUM(BP_E2a, BP_E2b) — E2 = 6% part + 8% part.
- `[I37]` E3 Gross Receipts = SUM(BP_E3_a, BP_E3_b, BP_E3_c).
- `[O37]` 5% of E3 = O39*5/100.
- `[O42]` 44ADA cap: IF(O40>O37, MIN(O39,5000000), IF(O40<=O37, MIN(O39,7500000))) — Rs 50 lakh limit, raised to Rs 75 lakh when cash ≤ 5%.
- `[N54]` per-vehicle deemed income = G54*H54*1000 (Rs 1000 per MT per month, tonnage > 12 MT).
- `[O54]` = H54*7500 (Rs 7500 per month floor).
- `[N53]` = SUM(Sheet44AE.NoOfMonths).
- `[I65]` E5 = SUM(Sheet44AE.PresumptiveIncome) — total of goods-carriage column (5).
- `[H68]` (hidden) E6 = MAX(0, BP_E2+BP_E3).
- `[I71]` E7 = MAX(0, (BP_E3 - BP_E3_2)) — E5 minus salary/interest to partners.
- `[I72]` E8 = MAX(0, (BP_E2_PI + BP_E4_PI44ADA + BP_E7_IC44AE)) — E2c + E4 + E7.
- `[H82]` (hidden) E6 income chargeable under business = MAX(0, BP_E4_2 - BP_E3_2).
- `[I83]` E10 = SUM(BP.GSTRAmount).
- `[I100]` E17 Total capital and liabilities = SUM(I94:I99).
- `[I109]` E25 Total assets = SUM(I101:I108).

## What repeats and what is one figure
- **Arrays (repeat):** `NatOfBus44AD[]`, `NatOfBus44ADA[]`, `NatOfBus44AE[]`, `GoodsDtlsUs44AE[]` (maxItems 10), `TurnoverGrsRcptForGSTIN[]`.
- **Single objects/figures:** `PersumptiveInc44AD`, `PersumptiveInc44ADA`, `PersumptiveInc44AE`, `TotalTurnoverGrsRcptGSTIN`, `FinanclPartclrOfBusiness`.

## Mandatory (required schema keys)
The `ScheduleBP` block itself has `required: None` (no block is compulsory), but within each array item / object the required leaves are:
- `NatOfBus44AD[].NameOfBusiness`, `NatOfBus44AD[].CodeAD`
- `PersumptiveInc44AD.GrsTotalTrnOver`, `PersumptiveInc44AD.TotPersumptiveInc44AD`
- `NatOfBus44ADA[].NameOfBusiness`, `NatOfBus44ADA[].CodeADA`
- `PersumptiveInc44ADA.GrsReceipt`, `PersumptiveInc44ADA.TotPersumptiveInc44ADA`
- `NatOfBus44AE[].NameOfBusiness`, `NatOfBus44AE[].CodeAE`
- `GoodsDtlsUs44AE[].RegNumberGoodsCarriage`, `GoodsDtlsUs44AE[].OwnedLeasedHiredFlag`, `GoodsDtlsUs44AE[].TonnageCapacity`, `GoodsDtlsUs44AE[].HoldingPeriod`, `GoodsDtlsUs44AE[].PresumptiveIncome`
- `PersumptiveInc44AE.TotPersumInc44AE`, `PersumptiveInc44AE.TotalPersumptiveInc`, `PersumptiveInc44AE.IncChargeableUnderBus`
- `TurnoverGrsRcptForGSTIN[].GSTINNo`, `TurnoverGrsRcptForGSTIN[].AmtTurnGrossRcptGSTIN`

## Hidden rows — not built
These rows are printed `H` in the dump and are excluded (never built as items):
- Rows 3–7 — "Nature of business or profession if more than one business indicate the three main activities/products" header plus S.No./Code/Tradename columns and (i)/(ii)/(iii) select rows (the multi-business `NOB` table; ITR-4 does not build it as a live item).
- Row 64 — "Total" (goods carriage column total, computed).
- Row 68 — E6 "Presumptive Income under section 44AD and 44AE (E2 +E3)" (hidden intermediate, H68 formula).
- Row 81 — E10 "Gross Turnover / Gross Receipts and reconciliation statement" (hidden reconciliation header).
- Row 82 — E6 "INCOME CHARGEABLE UNDER BUSINESS (E4 - E5)" (hidden intermediate, H82 formula).
- Rows 84–89 — "Adjustment on account of": Sl.No./Nature of Items/Description/Amount and the (Select)/Not Applicable adjustment rows (hidden GST reconciliation adjustments, dropdown NewCodes).
- Row 91 — c "Gross turnover or gross receipts as shown in column E1 or column E3 (as applicable)" (hidden reconciliation figure).

## What this means for the build
- Build three presumptive computation blocks (44AD, 44ADA, 44AE), each with its own nature-of-business table and its cap logic. Enforce the Rs 2cr/3cr (44AD), Rs 50L/75L (44ADA) caps from `[O26]`/`[O42]` — the higher cap only when cash-mode receipts ≤ 5% of turnover.
- The 44AE goods-carriage table (max 10 rows) drives E5 via `Sheet44AE.PresumptiveIncome`; per-vehicle income = max(Rs 1000/MT/month, Rs 7500/month). Registration numbers must be unique; months 1–12.
- E8 `IncChargeableUnderBus` is the feed into Part B-TI / Income Details (`IncD.IncomeFromBP`). Salary/interest to partners (E6) applies to firms only.
- Financial particulars E15, E19, E20, E21, E22 are mandatory; totals E17 and E25 are computed and untypeable.
- Do NOT build the hidden multi-business NOB table (rows 3–7) or the hidden GST reconciliation/adjustment rows (81–91) as live items.

**NOB** (cells `E5:E7`) — 8 values:

- (Select)
- 08001-Renting of land transport equipment
- 11002-Packers and movers
- 11008-Freight transport by road
- 11010-Forwarding of freight
- 11011-Receiving and acceptance of freight
- 11012-Cargo handling
- 11015-Other Transport & Logistics services n.e.c

**"(Select),Owned,Leased,Hired"** (cells `F54:F63`) — 4 values:

- (Select)
- Owned
- Leased
- Hired

**NOB44AD** (cells `F13:H17`) — 316 values:

- (Select)
- 01001-Growing and manufacturing of tea
- 01002-Growing and manufacturing of coffee
- 01003-Growing and manufacturing of rubber
- 01004-Market gardening and horticulture specialties
- 01005-Raising of silk worms and production of silk
- 01006-Raising of bees and production of honey
- 01007-Raising of poultry and production of eggs
- 01008-Rearing of sheep and production of wool
- 01009-Rearing of animals and production of animal products
- 01010-Agricultural and animal husbandry services
- 01011-Soil conservation, soil testing and soil desalination services
- 01012-Hunting, trapping and game propagation services
- 01013-Growing of timber, plantation, operation of tree nurseries and conserving of forest
- 01014-Gathering of tendu leaves
- 01015-Gathering of other wild growing materials
- 01016-Forestry service activities, timber cruising, afforestation and reforestation
- 01017-Logging service activities, transport of logs within the forest
- 01018-Other agriculture, animal husbandry or forestry activity n.e.c
- 02001-Fishing on commercial basis in inland waters
- 02002-Fishing on commercial basis in ocean and coastal areas
- 02003-Fish farming
- 02004-Gathering of marine materials such as natural pearls, sponges, coral etc.
- 02005-Services related to marine and fresh water fisheries, fish hatcheries and fish farms
- 02006-Other Fish farming activity n.e.c
- 03001-Mining and agglomeration of hard coal
- 03002-Mining and agglomeration of lignite
- 03003-Extraction and agglomeration of peat
- 03004-Extraction of crude petroleum and natural gas
- 03005-Service activities incidental to oil and gas extraction excluding surveying
- 03006-Mining of uranium and thorium ores
- 03007-Mining of iron ores
- 03008-Mining of non-ferrous metal ores, except uranium and thorium ores
- 03009-Mining of gemstones
- 03010-Mining of chemical and fertilizer minerals
- 03011-Mining of quarrying of abrasive materials
- 03012-Mining of mica, graphite and asbestos
- 03013-Quarrying of stones (marble/granite/dolomite), sand and clay
- 03014-Other mining and quarrying
- 03015-Mining and production of salt
- 03016-Other mining and quarrying n.e.c
- 04001-Production, processing and preservation of meat and meat products
- 04002-Production, processing and preservation of fish and fish products
- 04003-Manufacture of vegetable oil, animal oil and fats
- 04004-Processing of fruits, vegetables and edible nuts
- 04005-Manufacture of dairy products
- 04006-Manufacture of sugar
- 04007-Manufacture of cocoa, chocolates and sugar confectionery
- 04008-Flour milling
- 04009-Rice milling
- 04010-Dal milling
- 04011-Manufacture of other grain mill products
- 04012-Manufacture of bakery products
- 04013-Manufacture of starch products
- 04014-Manufacture of animal feeds
- 04015-Manufacture of other food products
- 04016-Manufacturing of wines
- 04017-Manufacture of beer
- 04018-Manufacture of malt liquors
- 04019-Distilling and blending of spirits, production of ethyl alcohol
- 04020-Manufacture of mineral water
- 04021-Manufacture of soft drinks
- 04022-Manufacture of other non-alcoholic beverages
- 04023-Manufacture of tobacco products
- 04024-Manufacture of textiles (other than by handloom)
- 04025-Manufacture of textiles using handlooms (khadi)
- 04026-Manufacture of carpet, rugs, blankets, shawls etc. (other than by hand)
- 04027-Manufacture of carpet, rugs, blankets, shawls etc. by hand
- 04028-Manufacture of wearing apparel
- 04029-Tanning and dressing of leather
- 04030-Manufacture of luggage, handbags and the like saddler and harness
- 04031-Manufacture of footwear
- 04032-Manufacture of wood and wood products, cork, straw and plaiting material
- 04033-Manufacture of paper and paper products
- 04034-Publishing, printing and reproduction of recorded media
- 04035-Manufacture of coke oven products
- 04036-Manufacture of refined petroleum products
- 04037-Processing of nuclear fuel
- 04038-Manufacture of fertilizers and nitrogen compounds
- 04039-Manufacture of plastics in primary forms and of synthetic rubber
- 04040-Manufacture of paints, varnishes and similar coatings
- 04041-Manufacture of pharmaceuticals, medicinal chemicals and botanical products
- 04042-Manufacture of soap and detergents
- 04043-Manufacture of other chemical products
- 04044-Manufacture of man-made fibers
- 04045-Manufacture of rubber products
- 04046-Manufacture of plastic products
- 04047-Manufacture of glass and glass products
- 04048-Manufacture of cement, lime and plaster
- 04049-Manufacture of articles of concrete, cement and plaster
- 04050-Manufacture of Bricks
- 04051-Manufacture of other clay and ceramic products
- 04052-Manufacture of other non-metallic mineral products
- 04053-Manufacture of pig iron, sponge iron, Direct Reduced Iron etc.
- 04054-Manufacture of Ferro alloys
- 04055-Manufacture of Ingots, billets, blooms and slabs etc.
- 04056-Manufacture of steel products
- 04057-Manufacture of basic precious and non-ferrous metals
- 04058-Manufacture of non-metallic mineral products
- 04059-Casting of metals
- 04060-Manufacture of fabricated metal products
- 04061-Manufacture of engines and turbines
- 04062-Manufacture of pumps and compressors
- 04063-Manufacture of bearings and gears
- 04064-Manufacture of ovens and furnaces
- 04065-Manufacture of lifting and handling equipment
- 04066-Manufacture of other general purpose machinery
- 04067-Manufacture of agricultural and forestry machinery
- 04068-Manufacture of Machine Tools
- 04069-Manufacture of machinery for metallurgy
- 04070-Manufacture of machinery for mining, quarrying and constructions
- 04071-Manufacture of machinery for processing of food and  beverages
- 04072-Manufacture of machinery for leather and textile
- 04073-Manufacture of weapons and ammunition
- 04074-Manufacture of other special purpose machinery
- 04075-Manufacture of domestic appliances
- 04076-Manufacture of office, accounting and computing machinery
- 04077-Manufacture of electrical machinery and apparatus
- 04078-Manufacture of Radio, Television, communication equipment and apparatus
- 04079-Manufacture of medical and surgical equipment
- 04080-Manufacture of industrial process control equipment
- 04081-Manufacture of instruments and appliances for measurements and navigation
- 04082-Manufacture of optical instruments
- 04083-Manufacture of watches and clocks
- 04084-Manufacture of motor vehicles
- 04085-Manufacture of body of motor vehicles
- 04086-Manufacture of parts & accessories of motor vehicles &  engines
- 04087-Building & repair of ships and boats
- 04088-Manufacture of railway locomotive and rolling stocks
- 04089-Manufacture of aircraft and spacecraft
- 04090-Manufacture of bicycles
- 04091-Manufacture of other transport equipment
- 04092-Manufacture of furniture
- 04093-Manufacture of jewellery
- 04094-Manufacture of sports goods
- 04095-Manufacture of musical instruments
- 04096-Manufacture of games and toys
- 04097-Other manufacturing n.e.c.
- 04098-Recycling of metal waste and scrap
- 04099-Recycling of non- metal waste and scrap
- 05001-Production, collection and distribution of electricity
- 05002-Manufacture and distribution of gas
- 05003-Collection, purification and distribution of water
- 05004-Other essential commodity service  n.e.c
- 06001-Site preparation works
- 06002-Building of complete constructions or parts civil contractors
- 06003-Building installation
- 06004-Building completion
- 06005-Construction and maintenance of roads, rails, bridges, tunnels, ports, harbour, runways etc.
- 06006-Construction and maintenance of power plants
- 06007-Construction  and maintenance of industrial plants
- 06008-Construction  and maintenance of power transmission and telecommunication lines
- 06009-Construction of water ways and water reservoirs
- 06010-Other construction activity n.e.c.
- 07001-Purchase, sale and letting of leased buildings  (residential and non-residential)
- 07002-Operating of real estate of self owned buildings (residential and non-residential)
- 07003-Developing and sub-dividing real estate into lots
- 07004-Real estate activities on a fee or contract basis
- 07005-Other real estate/renting services n.e.c
- 08001-Renting of land transport equipment
- 08002-Renting of water transport equipment
- 08003-Renting of air transport equipment
- 08004-Renting of agricultural machinery and equipment
- 08005-Renting of construction and civil engineering machinery
- 08006-Renting of office machinery and equipment
- 08007-Renting of other machinery and equipment n.e.c.
- 08008-Renting of personal and household goods n.e.c.
- 08009-Renting of other machinery n.e.c.
- 09001-Wholesale and retail sale of motor vehicles
- 09002-Repair and maintenance of motor vehicles
- 09003-Sale of motor parts and accessories- wholesale and retail
- 09004-Retail sale of automotive fuel
- 09006-Wholesale of agricultural raw material
- 09007-Wholesale of food & beverages and tobacco
- 09008-Wholesale of household goods
- 09009-Wholesale of metals and metal ores
- 09010-Wholesale of household goods
- 09011-Wholesale of construction material
- 09012-Wholesale of hardware and sanitary fittings
- 09013-Wholesale of cotton and jute
- 09014-Wholesale of raw wool and raw silk
- 09015-Wholesale of other textile fibres
- 09016-Wholesale of industrial chemicals
- 09017-Wholesale of fertilizers and pesticides
- 09018-Wholesale of electronic parts & equipment
- 09019-Wholesale of other machinery, equipment and supplies
- 09020-Wholesale of waste, scrap & materials for re-cycling
- 09021-Retail sale of food, beverages and tobacco in specialized stores
- 09022-Retail sale of other goods in specialized stores
- 09023-Retail sale in non specialized stores
- 09024-Retail sale of textiles, apparel, footwear, leather goods
- 09025-Retail sale of other household appliances
- 09026-Retail sale of hardware, paint and glass
- 09027-Wholesale of other products n.e.c
- 09028-Retail sale of other products n.e.c
- 10001-Hotels – Star rated
- 10002-Hotels – Non-star rated
- 10003-Motels, Inns and Dharmshalas
- 10004-Guest houses and circuit houses
- 10005-Dormitories and hostels at educational institutions
- 10006-Short stay accommodations n.e.c.
- 10007-Restaurants – with bars
- 10008-Restaurants – without bars
- 10009-Canteens
- 10010-Independent caterers
- 10011-Casinos and other games of chance
- 10012-Other hospitality services n.e.c.
- 11001-Travel agencies and tour operators
- 11002-Packers and movers
- 11003-Passenger land transport
- 11004-Air transport
- 11005-Transport by urban/sub-urban railways
- 11006-Inland water transport
- 11007-Sea and coastal water transport
- 11008-Freight transport by road
- 11009-Freight transport by railways
- 11010-Forwarding of freight
- 11011-Receiving and acceptance of freight
- 11012-Cargo handling
- 11013-Storage and warehousing
- 11014-Transport via pipelines (transport of gases, liquids, slurry and other commodities)
- 11015-Other Transport & Logistics services n.e.c
- 12001-Post and courier activities
- 12002-Basic telecom services
- 12003-Value added telecom services
- 12004-Maintenance of telecom network
- 12005-Activities of the cable operators
- 12006-Other Post & Telecommunication services n.e.c
- 13001-Commercial banks, saving banks and discount houses
- 13002-Specialised institutions granting credit
- 13003-Financial leasing
- 13004-Hire-purchase financing
- 13005-Housing finance activities
- 13006-Commercial loan activities
- 13007-Credit cards
- 13008-Mutual funds
- 13009-Chit fund
- 13010-Investment activities
- 13011-Life insurance
- 13012-Pension funding
- 13013-Non-life insurance
- 13014-Administration of financial markets
- 13015-Stock brokers, sub-brokers and related activities
- 13016-Financial advisers, mortgage advisers and brokers
- 13017-Foreign exchange services
- 13018-Other financial intermediation services n.e.c.
- 14005-Other IT enabled services
- 14007-Cyber café
- 14009-Computer training and educational institutes
- 14010-Other computation related services n.e.c.
- 15001-Natural sciences and engineering
- 15002-Social sciences and humanities
- 15003-Other Research & Development activities n.e.c.
- 16006-Advertising
- 16010-Auctioneers
- 16012-Market research and public opinion polling
- 16014-Labour recruitment and provision of personnel
- 16015-Investigation and security services
- 16016-Building-cleaning and industrial cleaning activities
- 16017-Packaging activities
- 16019-Other professional services n.e.c.
- 17001-Primary education
- 17002-Secondary/ senior secondary education
- 17003-Technical and vocational secondary/ senior secondary education
- 17004-Higher education
- 17005-Education by correspondence
- 17006-Coaching centres and tuitions
- 17007-Other education services n.e.c.
- 18006-Independent blood banks
- 18007-Medical transcription
- 18008-Independent ambulance services
- 18009-Medical suppliers, agencies and stores
- 19001-Social work activities with accommodation (orphanages and old age homes)
- 19002-Social work activities without accommodation (Creches)
- 19003-Industry associations, chambers of commerce
- 19004-Professional organisations
- 19005-Trade unions
- 19006-Religious organizations
- 19007-Political organisations
- 19008-Other membership organisations n.e.c. (rotary clubs, book clubs and philatelic clubs)
- 19009-Other Social or community service n.e.c
- 20001-Motion picture production
- 20002-Film distribution
- 20003-Film laboratories
- 20004-Television channel productions
- 20005-Television channels broadcast
- 20006-Video production and distribution
- 20007-Sound recording studios
- 20008-Radio - recording and distribution
- 20009-Stage production and related activities
- 20013-Circuses and race tracks
- 20014-Video Parlours
- 20015-News agency activities
- 20016-Library and archives activities
- 20017-Museum activities
- 20018-Preservation of historical sites and buildings
- 20019-Botanical and zoological gardens
- 20020-Operation and maintenance of sports facilities
- 20021-Activities of sports and game schools
- 20022-Organisation and operation of indoor/outdoor sports and promotion and production of sporting events
- 20023_1-Sports Management
- 20023-Other sporting activities n.e.c.
- 20024-Other recreational activities n.e.c.
- 21001-Hair dressing and other beauty treatment
- 21002-Funeral and related activities
- 21003-Marriage bureaus
- 21004-Pet care services
- 21005-Sauna and steam baths, massage salons etc.
- 21006-Astrological and spiritualists’ activities
- 21007-Private households as employers of domestic staff
- 21008_1-Event Management
- 21008-Other services n.e.c.
- 21009-Speculative trading
- 21010-Futures and Options trading
- 21011-Buying and selling shares
- 22001-Extra territorial organisations and bodies (IMF, World Bank, European Commission etc.)

**NOB44ADA** (cells `F30:H35`) — 39 values:

- (Select)
- 14001-Software development
- 14002-Other software consultancy
- 14003-Data processing
- 14004-Database activities and distribution of electronic content
- 14006-BPO services
- 14008-Maintenance and repair of office, accounting and computing machinery
- 16001-Legal profession
- 16002-Accounting, book-keeping and auditing profession
- 16003-Tax consultancy
- 16004-Architectural profession
- 16005-Engineering and technical consultancy
- 16007-Fashion designing
- 16008-Interior decoration
- 16009-Photography
- 16013-Business and management consultancy activities
- 16018-Secretarial activities
- 16019_1-Medical Profession
- 16020-Film Artist
- 16021-Social Media Influencers
- 18001-General  hospitals
- 18002-Speciality and super speciality hospitals
- 18003-Nursing homes
- 18004-Diagnostic centres
- 18005-Pathological laboratories
- 18010-Medical clinics
- 18011-Dental practice
- 18012-Ayurveda practice
- 18013-Unani practice
- 18014-Homeopathy practice
- 18015-Nurses, physiotherapists or other para-medical practitioners
- 18016-Veterinary hospitals and practice
- 18017-Medical education
- 18018-Medical research
- 18019-Practice of other alternative medicine
- 18020-Other healthcare services
- 20010-Individual artists excluding authors
- 20011-Literary activities
- 20012-Other cultural activities n.e.c.

**NewCodes** (cells `E86:E89`) — 11 values:

- (Select)
- Unbilled revenue and/or Unadjusted advances
- Deemed Supply under Schedule I of CGST Act, 2017 (eg. Stock transfer)
- Discounts/Credit Notes not permissible under GST
- Supply of goods by SEZ units to DTA Units (if not reported in GST returns by SEZ unit)
- Difference in turnover arising on account of valuation rules including foreign currency translation under CGST Act, 2017
- Gross turnover/receipt reported under GST but considered separately under the head “Income from other sources”
- Gross turnover/receipt reported under GST but considered separately under the head “Income from House Property”
- Gross turnover/receipt reported under GST but considered for computing presumptive income under section 44AE
- Aggregate amount of GST not forming part of turnover reported in GST returns filed but included in E1 and/or E3
- Any Other
