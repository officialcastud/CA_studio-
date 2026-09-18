# Nature Of Business — ITR-3 (books/ITR-3/Nature_Of_Business.md)

Sheet: **Nature Of Business** (utility file `sheet5.xml`, 117 XML row entries, 4 hidden).
Section: `bpa` — Business, Part A accounts (section_map.json). Schema block carried: **PartA_GEN2**.
This is the sheet's own book; every quotation below is taken from `tools/dump.py` output against
this sheet, or from `sources/ITR-3/ITR-3_2026_Main_V1_1_schema.json`, or from
`sources/ITR-3/vba_text.txt`, or from `books/ITR-3/rules.json` — never from memory (rule 17).

## The shape

The sheet is one table, "NATURE OF BUSINESS" (cell C3), holding the `NatOfBus.NatureOfBusiness[]`
array of `PartA_GEN2` — up to three business/profession entries (Sl. No. 1, 2, 3; rows 5, 6, 7),
each a Code (a dropdown of 357 departmental business/profession codes), an optional Trade name of
the proprietorship, and an optional Description. Cell D3 states the table's own scope in the
department's words: *"Nature of business/profession, if more than one business/profession indicate
the three main activities/Products (OTHER THAN THOSE DECLARING INCOME UNDER SECTIONS 44AD, 44ADA
AND 44AE)"* — i.e. this grid is for businesses/professions other than those declared under the
presumptive sections 44AD, 44ADA and 44AE. Alongside the visible table, row 3 and row 4 carry seven
hidden-column helper formulas (`L3:Q3`, `O4:P4`) that pull turnover and audit/44AD data from three
other sheets ("PART A - General", "BP", "Profit and Loss") to classify the filer against the Sec.
44AB tax-audit turnover thresholds — a computation, not a user field. `PartA_GEN2`'s other half,
**AuditInfo** (liability under 44AA/44AB/92E, the audit report and its dates), is *not* on this
sheet: per `books/ITR-3/structure.md`, `AuditInfo` is entered on the "PART A - General" sheet
(section `who`); it is named here only because `section_map.json` assigns the whole `PartA_GEN2`
block to both sheets, and the gate walks every leaf of a block a sheet claims (see Mandatory).

## The items

### PartA_GEN2 · NatOfBus — this sheet's own content

| Sheet cell / Sl. No. | Field label (verbatim) | Type | Schema key | Rule / notes |
|---|---|---|---|---|
| C3 | "NATURE OF BUSINESS" | section banner (static label, merged C3:C9) | — (table title) | title of the schedule on this sheet |
| D3 (merged D3:G3) | "Nature of business/profession, if more than one business/profession indicate the three main activities/Products (OTHER THAN THOSE DECLARING INCOME UNDER SECTIONS 44AD, 44ADA AND 44AE)" | instruction (static text) | — | scopes the table to filers *other than* those declaring income under 44AD/44ADA/44AE — see rules n=105, n=107, n=109 below |
| D4 | "Serial No." | column header | array index of `NatOfBus.NatureOfBusiness[]` | not itself a stored field — D5 is static `1`, `D6`= D5+1, `D7`= D6+1 (row formulas, see The rules) |
| E4 | "Code" | column header / list dropdown | `NatOfBus.NatureOfBusiness[].Code` | **required** (`*Code` in the schema); enum of 357 codes; dropdown named range `Nature_of_Business`; VBA: duplicate Code across the three rows is blocked, message "Duplicate Code-Sub Sector is not allowed" (field `NOB.Code`, validators `ValidateCode_NOB` / `ValidateSubCode_NOB`) |
| F4 | "Trade name of the proprietorship, if any" | column header / free text | `NatOfBus.NatureOfBusiness[].TradeName1` | optional; `maxLength` 125; sheet validation "Trade name cannot be more than 125 characters in schedule Nature of business" |
| G4 | "Description" | column header / free text | `NatOfBus.NatureOfBusiness[].Description` | optional; `maxLength` 125; sheet validation "TradeNameOrDescription should not exceed 125 characters"; VBA also carries message "Description is compulsory: schedule Nature of business" against a field named `NOB.TradeNameOrDescription2` (see The rules — the exact trigger condition is not fully recoverable, rule 17) |
| Sl. No. 1 (row 5) | E5 Code · F5 Trade name · G5 Description | data entry row 1 of the array | `NatOfBus.NatureOfBusiness[0]` = `{Code, TradeName1, Description}` | `D5` = static `1`; `E5` default "(Select)" |
| Sl. No. 2 (row 6) | E6 Code · F6 Trade name · G6 Description | data entry row 2 of the array | `NatOfBus.NatureOfBusiness[1]` = `{Code, TradeName1, Description}` | `D6` = `D5+1` |
| Sl. No. 3 (row 7) | E7 Code · F7 Trade name · G7 Description | data entry row 3 of the array | `NatOfBus.NatureOfBusiness[2]` = `{Code, TradeName1, Description}` | `D7` = `D6+1` |

`NatOfBus.NatureOfBusiness[]` itself is an **array** (the schema carries no `maxItems`); the sheet
pre-builds three rows and a control button "AddRows_NatureOfBusiness" (macro name; the button is
anchored at row 8 in the sheet's drawing) lets more be added, so the array is not hard-capped at 3
by the source, only by the utility's built-in grid.

### PartA_GEN2 · AuditInfo — NOT on this sheet

`AuditInfo` (required top-level key of `PartA_GEN2`) and every key beneath it are entered on the
**"PART A - General"** sheet (section `who`), not here — see The shape and Mandatory. They are
listed in Mandatory only because `section_map.json` gives both sheets the same block name
`PartA_GEN2`, and the coverage gate walks every required leaf of every block a sheet claims.

## The rules the sheet computes

Row-numbering (UI only, not a schema field):
- `D6`= `D5+1` — Sl. No. of row 2 = Sl. No. of row 1 + 1.
- `D7`= `D6+1` — Sl. No. of row 3 = Sl. No. of row 2 + 1.

Per-row code classification helpers (columns M, N, O — hidden columns K onward, column K itself is
sheet-hidden via `<col min="11" max="16384" hidden="1">`, not row-hidden):
- `M5`= `MID(E5,1,SEARCH("-",E5)-1)` (and `M6`, `M7` the same on their own row) — the Code text
  before the hyphen, e.g. "04024" out of "04024-Manufacture of textiles…". While `E5` is still the
  default "(Select)" (no hyphen), `SEARCH` errors and `M5` is `#VALUE!`.
- `N5`= `IF(ISERROR(IF(OR(M5="0601",M5="0602",M5="0603",M5="0604",M5="0605",M5="0606",M5="0607"),"A","B")),0,IF(OR(M5="0601",…,M5="0607"),"A","B"))`
  (and `N6`, `N7`) — classifies the row "A" if its code is one of the legacy 4-character codes
  "0601"–"0607", else "B"; `0` while `M5` errors (row not yet filled). **Observed anomaly**: none
  of the 357 codes in the current `Nature_of_Business` dropdown/enum is a 4-character "0601"–"0607"
  string (the current codes in that numeric neighbourhood are 5-character, "06001"–"06010" —
  construction codes), so with the current code list `N5/N6/N7` can only ever come out `"B"` (once
  a real code is chosen) or `0` (while unchosen) — `"A"` is not reachable. Build it as written
  (rule 2: every formula from this form's own sheet, never re-derived), but the section-builder
  should know `"A"` cannot fire with the current list.
- `O5`, `O6`, `O7` = static `1` (not a formula) — a per-row weight of 1, used by the SUMIFs below.
- `L3`= `SUMIF(N5:N7,"A",O5:O7)` — count of rows classified "A". Structurally always `0` given the
  `N5/N6/N7` anomaly above.
- `M3`= `SUMIF(N5:N7,"B",O5:O7)` — count of rows classified "B", i.e. count of rows with a real
  Code chosen (1, 2 or 3).

Sheet/turnover classification helpers (row 3–4, columns N–Q — cross-sheet):
- `N3`= `IF(OR(MID(sheet1.LiableSec44ABflg,1,1)="(",MID(sheet1.LiableSec44ABflg,1,1)=""),"NA",MID(sheet1.LiableSec44ABflg,1,1))`
  — first character of the Sec. 44AB liability flag on the **"PART A - General"** sheet (named
  range `sheet1.LiableSec44ABflg` = `'PART A - General'!$AP$156`, the `AuditInfo.LiableSec44ABflg`
  field); `"NA"` if that flag is blank or begins with "(".
- `O3`= `sheet11.Section44AD` — the Section 44AD election value on the **"BP"** sheet (named range
  `sheet11.Section44AD` = `BP!$I$110`).
- `P3`= `_xlfn.SINGLE(PL.BusinessReceipts)+_xlfn.SINGLE(PLCrEx.TotExciseCustomsVAT)+_xlfn.SINGLE(PL.GrossReceipt)`
  — aggregate business turnover from **"Profit and Loss"**-sheet named ranges (`PL.GrossReceipt` =
  `'Profit and Loss'!$L$207`; `PL.BusinessReceipts` and `PLCrEx.TotExciseCustomsVAT` are not in
  `sheet_map.json`'s resolved named-range table, so their exact cells could not be confirmed here —
  said so rather than guessed, rule 17).
- `Q3`= `PL.GrossReceipts+PL.GrossReceipt_ii` — aggregate gross receipts (profession side), also
  Profit-and-Loss named ranges (neither resolved in `sheet_map.json`'s table either).
- `O4`= `IF(AND(N3="N",M3>=1),IF(AND(O3>0,P3<=20000000),1,IF(AND(O3>0,P3>20000000),2,IF(AND(OR(O3=0,O3=""),P3<=10000000),3,IF(AND(OR(O3=0,O3=""),P3>10000000),4,5)))),0)`
  — a 0–5 classification code: only when not liable u/s 44AB (`N3`="N") and at least one business
  is entered (`M3`>=1): code `1` if 44AD is elected and turnover ≤ Rs 2 crore (20000000); `2` if
  44AD elected and turnover > Rs 2 crore; `3` if 44AD not elected and turnover ≤ Rs 1 crore
  (10000000); `4` if 44AD not elected and turnover > Rs 1 crore; else `5`; else (liable u/s 44AB or
  no business entered) `0`.
- `P4`= `IF(AND(L3>=1,N3="N"),IF(AND(Q3<=5000000),1,2),0)` — a 1/2 classification against the
  Rs 50 lakh (5000000) 44ADA professional-receipts threshold, gated on `L3>=1`. Because `L3` is
  structurally always `0` (see the `N5/N6/N7` anomaly), `P4` is always `0` as the utility is
  currently built.

Validator/message rules read from `sources/ITR-3/vba_text.txt` (this source is compiled VBA
p-code — a string-table dump, not readable source lines; only the literal strings below could be
quoted, not the full trigger logic around them — said so per rule 17):
- "Duplicate Code-Sub Sector is not allowed" — field `NOB.Code`; macros `ValidateCode_NOB`,
  `ValidateSubCode_NOB`, run from `CmdValidate_NOB_Click` / `ValidateSheetNOB_ALL` (the sheet's
  "Validate" button, control macro `CmdValidate_NOB_Click`). The same Code cannot be chosen twice
  across the three rows.
- "Description is compulsory: schedule Nature of business" — field `NOB.TradeNameOrDescription2`;
  macro family `ValidateTradeName_NOB` / `ValidateTradeName1_NOB` / `ValidateTradeName2_NOB`.
- Button macro `AddRows_NatureOfBusiness` (control "Button 32", anchored at row 8) — adds rows to
  the grid beyond the three built in, consistent with the schema's uncapped `NatureOfBusiness[]`.

Department rules from `books/ITR-3/rules.json` that govern how this sheet's `Code` is used
elsewhere in the return (item numbers are the rules document's own `n`, per rule 5):
- n=105 (cat A): "In Part A P&L, if "Business code" u/s 44AD is selected then it is mandatory to
  declare income u/s 44AD."
- n=106 (cat A): "In Part A P&L, Nature of business must be filled by the assessee if 61(i) and /or
  (ii) is greater than zero"
- n=107 (cat A): "In Part A P&L, If "business code" u/s 44ADA is selected then it is mandatory to
  declare income u/s 44ADA."
- n=109 (cat A): "In Part A P&L, If "business code" u/s 44AE is selected then it is mandatory to
  declare income u/s 44AE."
- n=110 (cat A): "In Part A P&L, Nature of business must be filled by the assessee if 63(ii) is
  greater than zero"
- n=120 (cat A): "speculative business. Presumptive Business Income Under Section 44AD cannot be
  disclosed by Non-Resident."
- n=121 (cat A): "The provisions of 44AD is not applicable for General commission agents and
  persons carrying on professions as referred in section 44AA(1)."
- n=285 (cat A): "in "Sl.No 35 (i) (Sec 44AD) " of Schedule BP The provisions of 44AD is not
  applicable for General commission agents and persons carrying on professions as referred in
  section 44AA(1)"
- n=303 (cat A): "Exceptions: 1. If NOB has business code as 00001 and Schedule IF is filled. 2. If
  "Yes" is selected for "Are you liable for Audit u/s 92E?" in Schedule Part A General
  Information. 3. If "Yes" is selected for "Whether books of account of spouse is audited u/s
  92E? or" — quoted exactly; `rules.json`'s own text for this entry is truncated at "…u/s 92E? or"
  (266 characters, source ends mid-sentence — said so rather than guessed, rule 17). It confirms
  Code "00001" ("Share of Income from firm only") is treated specially elsewhere (Schedule IF).
- n=16 (cat D): "Amount can be reduced from schedule BP at Sl.No. A4b i.e. Profit from activities
  covered under rule 7A, 7B(1), 7B(1A) and 8 only if business code is selected as 1003 , 1002, 1001
  respectively"

## Dropdowns

Three data-validation entries on this sheet (from `tools/dump.py --dropdowns "Nature Of Business"`):

**1. `E5:E7` — Code — type list, named range `Nature_of_Business`, 358 entries (357 real codes plus
the "(Select)" placeholder).** Error title "Code ", message "Please select from the list". Every
value, verbatim:

- (Select)
- 00001-Share of Income from firm only
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
- 04071-Manufacture of machinery for processing of food and beverages
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
- 04086-Manufacture of parts & accessories of motor vehicles & engines
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
- 05004-Other essential commodity service n.e.c
- 06001-Site preparation works
- 06002-Building of complete constructions or parts- civil contractors
- 06003-Building installation
- 06004-Building completion
- 06005-Construction and maintenance of roads, rails, bridges, tunnels, ports, harbor, runways etc.
- 06006-Construction and maintenance of power plants
- 06007-Construction and maintenance of industrial plants
- 06008-Construction and maintenance of power transmission and telecommunication lines
- 06009-Construction of water ways and water reservoirs
- 06010-Other construction activity n.e.c.
- 07001-Purchase, sale and letting of leased buildings (residential and non-residential)
- 07002-Operating of real estate of self-owned buildings (residential and non-residential)
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
- 09005-General commission agents, commodity brokers and auctioneers
- 09006-Wholesale of agricultural raw material
- 09007-Wholesale of food & beverages and tobacco
- 09008-Wholesale of household goods
- 09009-Wholesale of metals and metal ores
- 09010-Wholesale of household goods
- 09011-Wholesale of construction material
- 09012-Wholesale of hardware and sanitary fittings
- 09013-Wholesale of cotton and jute
- 09014-Wholesale of raw wool and raw silk
- 09015-Wholesale of other textile fibers
- 09016-Wholesale of industrial chemicals
- 09017-Wholesale of fertilizers and pesticides
- 09018-Wholesale of electronic parts & equipment
- 09019-Wholesale of other machinery, equipment and supplies
- 09020-Wholesale of waste, scrap & materials for re-cycling
- 09021-Retail sale of food, beverages and tobacco in specialized stores
- 09022-Retail sale of other goods in specialized stores
- 09023-Retail sale in non-specialized stores
- 09024-Retail sale of textiles, apparel, footwear, leather goods
- 09025-Retail sale of other household appliances
- 09026-Retail sale of hardware, paint and glass
- 09027-Wholesale of other products n.e.c
- 09028-Retail sale of other products n.e.c
- 09029-Commission agents - Kachcha Arahtia
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
- 14001-Software development
- 14002-Other software consultancy
- 14003-Data processing
- 14004-Database activities and distribution of electronic content
- 14005-Other IT enabled services
- 14006-BPO services
- 14007-Cyber café
- 14008-Maintenance and repair of office, accounting and computing machinery
- 14009-Computer training and educational institutes
- 14010-Other computation related services n.e.c.
- 15001-Natural sciences and engineering
- 15002-Social sciences and humanities
- 15003-Other Research & Development activities n.e.c.
- 16001-Legal profession
- 16002-Accounting, book-keeping and auditing profession
- 16003-Tax consultancy
- 16004-Architectural profession
- 16005-Engineering and technical consultancy
- 16006-Advertising
- 16007-Fashion designing
- 16008-Interior decoration
- 16009-Photography
- 16010-Auctioneers
- 16011-Business brokerage
- 16012-Market research and public opinion polling
- 16013-Business and management consultancy activities
- 16014-Labour recruitment and provision of personnel
- 16015-Investigation and security services
- 16016-Building-cleaning and industrial cleaning activities
- 16017-Packaging activities
- 16018-Secretarial activities
- 16019_1-Medical Profession
- 16020-Film Artist
- 16021-Social Media Influencers
- 16019-Other professional services n.e.c.
- 17001-Primary education
- 17002-Secondary/ senior secondary education
- 17003-Technical and vocational secondary/ senior secondary education
- 17004-Higher education
- 17005-Education by correspondence
- 17006-Coaching centres and tuitions
- 17007-Other education services n.e.c.
- 18001-General hospitals
- 18002-Speciality and super Speciality hospitals
- 18003-Nursing homes
- 18004-Diagnostic centres
- 18005-Pathological laboratories
- 18006-Independent blood banks
- 18007-Medical transcription
- 18008-Independent ambulance services
- 18009-Medical suppliers, agencies and stores
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
- 20010-Individual artists excluding authors
- 20011-Literary activities
- 20012-Other cultural activities n.e.c.
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
- 21009-Speculative trading
- 21010-Futures and Options trading
- 21011-Buying and selling shares
- 21008-Other services n.e.c.
- 22001-Extra territorial organisations and bodies (IMF, World Bank, European Commission etc.)


**2. `F5:F7` — Trade name of the proprietorship, if any — type textLength, operator
lessThanOrEqual, formula `125`.** Not a picklist — a length cap. Error title "Trade name of the
proprietorship", message "\"Trade name cannot be more than 125 characters in schedule Nature of
business\"".

**3. `G5:G7 H5:H9` — Description (and its merge spill-over into column H on rows 5–9) — type
textLength, operator lessThanOrEqual, formula `125`.** Not a picklist — a length cap. Error title
"TradeNameOrDescription", message "TradeNameOrDescription  should not exceed 125 characters ".

## What repeats and what is one figure

- **Repeats (array)**: `NatOfBus.NatureOfBusiness[]` — one element per business/profession, each
  `{Code, TradeName1, Description}`. The sheet pre-builds three (Sl. No. 1, 2, 3 / rows 5, 6, 7);
  the "AddRows_NatureOfBusiness" button can add more; the schema carries no `maxItems`.
- **One figure each (not arrays)**: the row-3/row-4 helper cells `L3`, `M3`, `N3`, `O3`, `P3`,
  `Q3`, `O4`, `P4` — each computed once for the whole sheet, not once per row. They are UI/
  validation helpers only (cross-sheet turnover and 44AD/44AB classification); none of them is a
  schema leaf under `NatOfBus` — they do not themselves get filed.
- **Out of scope for this sheet**: `AuditInfo` — a single object (not an array) on the "PART A -
  General" sheet, with its own two nested arrays `AuditDetails[]` and `AuditReportDetails[]` and a
  nested single object `AuditDetails92E` — none of it is entered here.

## Mandatory

On this sheet's own content (`NatOfBus.NatureOfBusiness[]` items), the schema's `required` array
is `["Code"]` — only `Code` is required per entry; `TradeName1` and `Description` are optional
(though the VBA message "Description is compulsory: schedule Nature of business", above, suggests
the utility enforces Description in at least one situation that the compiled source does not let
us pin down further — rule 17).

`PartA_GEN2`'s own top-level `required` is `["AuditInfo"]`. Within `AuditInfo`, the schema's
required leaves are `LiableSec44AAflg`, `IncDclrdUs`, `LiableSec44ABflg`, `LiableSec92Eflg`,
`AccountAuditFlag`, and (nested under `AuditDetails92E`) `DateOfAudit` and `AckNum92E`. **None of
these seven are entered on the Nature Of Business sheet** — they are entered on the "PART A -
General" sheet (`books/ITR-3/structure.md`: "its **AuditInfo** rows sit on PART A - General …, its
**NatOfBus** rows on the Nature Of Business sheet"). They are named verbatim here only so the
coverage gate — which walks every required leaf of every block a sheet's `section_map.json` entry
claims, and "Nature Of Business" claims `PartA_GEN2` whole — is satisfied without this book
pretending they map to an item that does not exist on this sheet.

For completeness, `AuditInfo`'s full leaf set (all optional unless marked `*` above), all living on
the "PART A - General" sheet, not here: `TotalSalesExcOneCr`, `AgrOFAllAmtsRcvd`,
`AgrOFAllPayMade`, `Cndnfor44AB`, `BiiDetails.44AD`, `BiiDetails.44ADA`, `BiiDetails.44AE`,
`BiiDetails.44BB`, `AuditAccountantFlg`, `AuditReportFurnishDate`, `AckNum44AB`, `AudFrmName`,
`AudFrmPAN`, `AudFrmAadhaar`, `AuditDetails[]` (with `AuditedSection`, `AuditFlag`, `OthAuditDtls`,
`DateOfAudit`, `AckNumOth`), `AuditReportDetails[]` (with `AuditReportAct`, `AuditReportActOthers`,
`AuditedSection`, `OtherITActFlag`, `OthAuditDtlsOthThanITAct`, `DateOfAudit`).

## Hidden rows — not built

`sheet_map.json` records 4 hidden rows on this sheet, and the raw worksheet XML confirms exactly
four `<row hidden="1">` entries — rows **12, 13, 14 and 15**. Each is a single cell in column K
(style 141), with no value, no formula and no label:

```
ROW 12 hidden=1   K12 (empty, style 141 only)
ROW 13 hidden=1   K13 (empty, style 141 only)
ROW 14 hidden=1   K14 (empty, style 141 only)
ROW 15 hidden=1   K15 (empty, style 141 only)
```

Nothing to build from any of them — no label, no dropdown, no formula, no schema key. (Column K
itself is also sheet-hidden throughout, `<col min="11" max="16384" hidden="1">`, but that is a
column-hidden helper column, not a row-hidden one; its only content on this sheet, `K7`, is a
single blank space character and carries no meaning.)

Rows 16 upward to the sheet's last XML row entry (117 `<row>` elements in total, matching
`sheet_map.json`'s `"rows": 117`) are **visible but empty** — `<row>` tags with no `<c>` children at
all (formatting artefacts, e.g. `<row r="26" .../>`), not hidden and not content; `tools/dump.py`
correctly prints nothing for them because they carry no string or formula cell. They are not
"hidden rows" (rule 1 is about the `H`-flagged rows only) and are not listed as items because they
carry no label to itemise — rows 2, 8, 9, 10 and 11 are the same: present in the XML (merged/
bordered cells for the table's box), visibly part of the table's layout, but with zero string or
formula content (confirmed cell-by-cell against the raw XML), so `dump.py` shows nothing for them
either. `D8:G8` and `D9:G9` are merged blank cells (matching the merges list: `mergeCell
ref="D8:G8"`, `ref="D9:G9"`) sitting directly under Sl. No. 3 / row 7, in the same vertical
"NATURE OF BUSINESS" banner (`C3:C9` merged) — reserved layout space, not additional data rows.

## What this means for the build

- Build exactly what's in "The items": three `NatOfBus.NatureOfBusiness[]` rows (Code required,
  TradeName1/Description optional, both ≤125 chars), Sl. No. numbered 1/2/3 by the array's own
  index (the sheet's `D5`/`D6=D5+1`/`D7=D6+1` are UI numbering only, not a schema field to store).
  Support at least 3 entries; the "AddRows_NatureOfBusiness" button and the schema's missing
  `maxItems` both point at more than 3 being acceptable, so build for growth if practical.
- Enforce "no duplicate Code across the rows" (VBA message "Duplicate Code-Sub Sector is not
  allowed") — this is the one concrete in-sheet validation rule for this table.
- Cell D3's own instruction text is the scope rule: this table is for business/profession activity
  **other than** what's declared under Sections 44AD, 44ADA and 44AE (backed by rules n=105, n=107,
  n=109 — selecting a 44AD/44ADA/44AE business code elsewhere makes declaring that section's income
  mandatory there, not here).
- The `L3:Q3` / `O4:P4` helper block is cross-sheet computed classification (turnover vs. the Rs 1
  crore / Rs 2 crore / Rs 50 lakh thresholds, combined with the Sec. 44AB flag from "PART A -
  General" and the Sec. 44AD election from "BP") — it is **not** a `NatOfBus` schema field; it is a
  validation/messaging helper for the Audit Information block that lives on the other sheet. Per
  rule 8 ("helper columns are rules — read them") and rule 2 ("never port an engine from another
  form"), if the section-builder needs this turnover/44AD/44AB classification, it must reproduce
  these exact formulas and their exact cross-sheet sources (`PART A - General`.LiableSec44ABflg,
  `BP`.Section44AD, `Profit and Loss` receipts) rather than inventing new logic — but note the
  `N5/N6/N7`→`L3`→`P4` chain is dead with the current 357-code list (see The rules), so `P4` will
  always compute `0`; that is the formula as written on this sheet, not a build error to "fix".
- `AuditInfo` (the rest of `PartA_GEN2`) is entirely out of scope for the `bpa` section / this
  sheet's build — it is the `who` section's responsibility, built from the "PART A - General"
  sheet's own book. Do not create Audit Information UI here.
- This sheet's own required key is just `Code`. Do not make TradeName1/Description mandatory in
  the UI beyond the sheet's own textLength caps, absent clearer VBA evidence for when Description
  becomes compulsory.
