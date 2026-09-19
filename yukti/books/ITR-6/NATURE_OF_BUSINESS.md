# The book of Schedule Nature of Business · ITR-6, A.Y. 2026-27

Read row by row from the utility's **NATURE OF BUSINESS** sheet (16 rows; rows
14 and 65527 are hidden and empty — nothing to build), and confirmed against the
CBDT ITR-6 schema's `PartA_GEN2For6` → `NatOfBus.NatureOfBusiness[]`. Nothing
here is invented; every code and label is the department's own.

> **Scope note.** `section_map.json` maps the block `PartA_GEN2For6` to **both**
> GENERAL2 and this sheet. The nature-of-business **codes** are the only part of
> the block this sheet displays; the holding / subsidiary / shareholder /
> ownership / audit / nature-of-company leaves display on GENERAL2 and PART A –
> GENERAL and are documented in full in `books/ITR-6/GENERAL2.md`. Because this
> sheet's book is checked against the whole block, §5 below carries the block's
> complete schema-key coverage so nothing in `PartA_GEN2For6` is left unfiled.

---

## 1 · The shape — up to four business codes

One small table. **Header (verbatim):** *"NATURE OF BUSINESS — Nature of
business/profession, if more than one business or profession indicate the three
main activities/ products (Other than those declaring income under section
44AE) NOTE: Atleast one Business Code is mandatory in Schedule Nature of
Business or at Point-61 of Sch "P&L""*.

| Column (verbatim) | Type / enum | Schema key |
|---|---|---|
| Sl. No.. | serial (auto: `D7 = D6+1`) | — (index) |
| Code-Sub Sector | enum, 356 codes (`NOBCode`) | `NatOfBus.NatureOfBusiness[].Code` ★ |
| Trade name | string (125) | `NatOfBus.NatureOfBusiness[].TradeName1` |
| (description, schema-only) | string (125) | `NatOfBus.NatureOfBusiness[].Description` |

Four rows shipped (E6:E9), the array is `NatOfBus.NatureOfBusiness[]`. The
instruction limits meaningful entries to the **three main activities/products**
where there is more than one business. Presumptive income u/s 44AE is excluded
here — those codes go against the 44AE block, not this schedule.

---

## 2 · The rules the code carries

The chosen code is not cosmetic — several schedules key off it:

| Rule | What the code decides |
|---|---|
| A116 / A121 | a 44AE business code ⇔ income must be declared u/s 44AE (and vice-versa) |
| A253 | profit under rule 7A / 7B(1) / 7B(1A) / 8 only if code is `1003` / `1002` / `1001` (rubber / coffee / tea) |
| A228 | depreciation u/s 32(1)(i) in Schedule BP only if the nature of business is the **power sector** |
| A843 | deduction u/s 80PA disallowed unless the code is one of `1001`–`1018` |
| A844 | 80M claimed ⇒ a business-code option is mandatory |
| — | at least one code is mandatory here **or** at Point-61 of Sch P&L (sheet NOTE) |

---

## 3 · Hidden rows

| Row | State | Content |
|---|---|---|
| 14 | hidden | empty — not built |
| 65527 | hidden | empty — not built |

No live row is hidden; both hidden rows are blank spacer rows, logged as
excluded (empty).

---

## 4 · What repeats

`NatOfBus.NatureOfBusiness[]` — up to four rows (the utility ships E6:E9); the
instruction says indicate the three main activities/products where there is more
than one business.

---

## 5 · Full `PartA_GEN2For6` schema-key coverage

The block this sheet shares. Required leaves (★) and their home:

- **Audit / turnover (display: PART A – GENERAL):** `LiableSec44AAflg` ★,
  `IncDclrdUs` ★, `TotalSalesExcOneCr`, `AgrOFAllAmtsRcvd`, `AgrOFAllPayMade`,
  `LiableSec44ABflg` ★, `AuditedByAccountantFlg`,
  `AuditInfo.AuditReportFurnishDate`, `AuditInfo.AudFrmName`,
  `AuditInfo.AudFrmPAN` ★, `AuditInfo.AckNum44AB`, `LiableSec92Eflg` ★,
  `AuditDetails92E.DateOfAudit` ★ (note the leaf key `DateOfAudit`),
  `AuditDetails92E.AckNum92E`, `AccountAuditFlag`,
  `AuditDetails[].AuditedSection` ★, `AuditDetails[].AnyOtherSection`,
  `AuditDetails[].AuditFlag`, `AuditDetails[].AckNumOth`,
  `AuditReportDetails[].AuditReportAct` ★,
  `AuditReportDetails[].AuditReportActOthers`,
  `AuditReportDetails[].AuditReportSection` ★,
  `AuditReportDetails[].OtherITActFlag` ★,
  `AuditReportDetails[].AuditReportDate`.
- **Holding status (display: GENERAL2):** `HoldingStatus.NatOfCompFlg` ★, and in
  the holding/subsidiary tables `CompName` ★, `CompPAN`, `AddrDetail` ★,
  `CityOrTownOrDistrict` ★, `StateCode` ★, `CountryCode` ★, `PinCode`,
  `ZipCode`, `CompSharePercent`.
- **Business organisation:** `BusOrgType`, `CompName`, `BusOrgPAN`, address
  leaves, `DateOfBusinessOrg`.
- **Key persons:** `PersonName` ★, `Designation` ★, address leaves, `KeyPerPAN`,
  `KeyPersnAadhaar`, `DirectorIdNo`.
- **Shareholders:** `ShareHolderInfoName` ★, `PercentageOfShare` ★, address
  leaves, `ShareHolderPAN`, `ShareHolderAadhaar`.
- **Ownership:** `OwnerName` ★, `PercentageOfShare` ★, address leaves,
  `OwnerPAN`, `OwnerAadhaar`.
- **Foreign parents (immediate & ultimate):** `Name` ★, address leaves,
  `CountryOfResidence` ★, `PAN`, `TaxpayerRegNumber` ★.
- **Nature of company:** `PubSectCompUs2_36AFlg` ★, `RBICompFlg` ★,
  `CompLes40PercSharGovRBIFlg` ★, `BankCompUs5Flg` ★, `SchedBankOfRBIActFlg` ★,
  `CompWithIRDARegisterFlg` ★, `NonBankFIICompFlg` ★, `CompanyUnlistedFlag` ★.
- **Nature of business (this sheet):** `Code` ★, `TradeName1`, `Description`.

Full detail of every non-code leaf is in `books/ITR-6/GENERAL2.md`.

---

## 6 · The enum — the 356 nature-of-business codes (`NOBCode`)

`(Select)` plus the 356 code–sub-sector values:


`(Select)` · `01001-Growing and manufacturing of tea` · `01002-Growing and manufacturing of coffee` · `01003-Growing and manufacturing of rubber` · `01004-Market gardening and horticulture specialties` · `01005-Raising of silk worms and production of silk` · `01006-Raising of bees and production of honey` · `01007-Raising of poultry and production of eggs` · `01008-Rearing of sheep and production of wool` · `01009-Rearing of animals and production of animal products` · `01010-Agricultural and animal husbandry services` · `01011-Soil conservation, soil testing and soil desalination services` · `01012-Hunting, trapping and game propagation services` · `01013-Growing of timber, plantation, operation of tree nurseries and conserving of forest` · `01014-Gathering of tendu leaves` · `01015-Gathering of other wild growing materials` · `01016-Forestry service activities, timber cruising, afforestation and reforestation` · `01017-Logging service activities, transport of logs within the forest` · `01018-Other agriculture, animal husbandry or forestry activity n.e.c` · `02001-Fishing on commercial basis in inland waters` · `02002-Fishing on commercial basis in ocean and coastal areas` · `02003-Fish farming` · `02004-Gathering of marine materials such as natural pearls, sponges, coral etc.` · `02005-Services related to marine and fresh water fisheries, fish hatcheries and fish farms` · `02006-Other Fish farming activity n.e.c` · `03001-Mining and agglomeration of hard coal` · `03002-Mining and agglomeration of lignite` · `03003-Extraction and agglomeration of peat` · `03004-Extraction of crude petroleum and natural gas` · `03005-Service activities incidental to oil and gas extraction excluding surveying` · `03006-Mining of uranium and thorium ores` · `03007-Mining of iron ores` · `03008-Mining of non-ferrous metal ores, except uranium and thorium ores` · `03009-Mining of gemstones` · `03010-Mining of chemical and fertilizer minerals` · `03011-Mining of quarrying of abrasive materials` · `03012-Mining of mica, graphite and asbestos` · `03013-Quarrying of stones (marble/granite/dolomite), sand and clay` · `03014-Other mining and quarrying` · `03015-Mining and production of salt` · `03016-Other mining and quarrying n.e.c` · `04001-Production, processing and preservation of meat and meat products` · `04002-Production, processing and preservation of fish and fish products` · `04003-Manufacture of vegetable oil, animal oil and fats` · `04004-Processing of fruits, vegetables and edible nuts` · `04005-Manufacture of dairy products` · `04006-Manufacture of sugar` · `04007-Manufacture of cocoa, chocolates and sugar confectionery` · `04008-Flour milling` · `04009-Rice milling` · `04010-Dal milling` · `04011-Manufacture of other grain mill products` · `04012-Manufacture of bakery products` · `04013-Manufacture of starch products` · `04014-Manufacture of animal feeds` · `04015-Manufacture of other food products` · `04016-Manufacturing of wines` · `04017-Manufacture of beer` · `04018-Manufacture of malt liquors` · `04019-Distilling and blending of spirits, production of ethyl alcohol` · `04020-Manufacture of mineral water` · `04021-Manufacture of soft drinks` · `04022-Manufacture of other non-alcoholic beverages` · `04023-Manufacture of tobacco products` · `04024-Manufacture of textiles (other than by handloom)` · `04025-Manufacture of textiles using handlooms (khadi)` · `04026-Manufacture of carpet, rugs, blankets, shawls etc. (other than by hand)` · `04027-Manufacture of carpet, rugs, blankets, shawls etc. by hand` · `04028-Manufacture of wearing apparel` · `04029-Tanning and dressing of leather` · `04030-Manufacture of luggage, handbags and the like saddler and harness` · `04031-Manufacture of footwear` · `04032-Manufacture of wood and wood products, cork, straw and plaiting material` · `04033-Manufacture of paper and paper products` · `04034-Publishing, printing and reproduction of recorded media` · `04035-Manufacture of coke oven products` · `04036-Manufacture of refined petroleum products` · `04037-Processing of nuclear fuel` · `04038-Manufacture of fertilizers and nitrogen compounds` · `04039-Manufacture of plastics in primary forms and of synthetic rubber` · `04040-Manufacture of paints, varnishes and similar coatings` · `04041-Manufacture of pharmaceuticals, medicinal chemicals and botanical products` · `04042-Manufacture of soap and detergents` · `04043-Manufacture of other chemical products` · `04044-Manufacture of man-made fibers` · `04045-Manufacture of rubber products` · `04046-Manufacture of plastic products` · `04047-Manufacture of glass and glass products` · `04048-Manufacture of cement, lime and plaster` · `04049-Manufacture of articles of concrete, cement and plaster` · `04050-Manufacture of Bricks` · `04051-Manufacture of other clay and ceramic products` · `04052-Manufacture of other non-metallic mineral products` · `04053-Manufacture of pig iron, sponge iron, Direct Reduced Iron etc.` · `04054-Manufacture of Ferro alloys` · `04055-Manufacture of Ingots, billets, blooms and slabs etc.` · `04056-Manufacture of steel products` · `04057-Manufacture of basic precious and non-ferrous metals` · `04058-Manufacture of non-metallic mineral products` · `04059-Casting of metals` · `04060-Manufacture of fabricated metal products` · `04061-Manufacture of engines and turbines` · `04062-Manufacture of pumps and compressors` · `04063-Manufacture of bearings and gears` · `04064-Manufacture of ovens and furnaces` · `04065-Manufacture of lifting and handling equipment` · `04066-Manufacture of other general purpose machinery` · `04067-Manufacture of agricultural and forestry machinery` · `04068-Manufacture of Machine Tools` · `04069-Manufacture of machinery for metallurgy` · `04070-Manufacture of machinery for mining, quarrying and constructions` · `04071-Manufacture of machinery for processing of food and beverages` · `04072-Manufacture of machinery for leather and textile` · `04073-Manufacture of weapons and ammunition` · `04074-Manufacture of other special purpose machinery` · `04075-Manufacture of domestic appliances` · `04076-Manufacture of office, accounting and computing machinery` · `04077-Manufacture of electrical machinery and apparatus` · `04078-Manufacture of Radio, Television, communication equipment and apparatus` · `04079-Manufacture of medical and surgical equipment` · `04080-Manufacture of industrial process control equipment` · `04081-Manufacture of instruments and appliances for measurements and navigation` · `04082-Manufacture of optical instruments` · `04083-Manufacture of watches and clocks` · `04084-Manufacture of motor vehicles` · `04085-Manufacture of body of motor vehicles` · `04086-Manufacture of parts & accessories of motor vehicles & engines` · `04087-Building & repair of ships and boats` · `04088-Manufacture of railway locomotive and rolling stocks` · `04089-Manufacture of aircraft and spacecraft` · `04090-Manufacture of bicycles` · `04091-Manufacture of other transport equipment` · `04092-Manufacture of furniture` · `04093-Manufacture of jewellery` · `04094-Manufacture of sports goods` · `04095-Manufacture of musical instruments` · `04096-Manufacture of games and toys` · `04097-Other manufacturing n.e.c.` · `04098-Recycling of metal waste and scrap` · `04099-Recycling of non- metal waste and scrap` · `05001-Production, collection and distribution of electricity` · `05002-Manufacture and distribution of gas` · `05003-Collection, purification and distribution of water` · `05004-Other essential commodity service n.e.c` · `06001-Site preparation works` · `06002-Building of complete constructions or parts- civil contractors` · `06003-Building installation` · `06004-Building completion` · `06005-Construction and maintenance of roads, rails, bridges, tunnels, ports, harbour, runways etc.` · `06006-Construction and maintenance of power plants` · `06007-Construction and maintenance of industrial plants` · `06008-Construction and maintenance of power transmission and telecommunication lines` · `06009-Construction of water ways and water reservoirs` · `06010-Other construction activity n.e.c.` · `07001-Purchase, sale and letting of leased buildings(residential and non-residential)` · `07002-Operating of real estate of self-owned buildings(residential and non-residential)` · `07003-Developing and sub-dividing real estate into lots` · `07004-Real estate activities on a fee or contract basis` · `07005-Other real estate/renting services n.e.c` · `08001-Renting of land transport equipment` · `08002-Renting of water transport equipment` · `08003-Renting of air transport equipment` · `08004-Renting of agricultural machinery and equipment` · `08005-Renting of construction and civil engineering machinery` · `08006-Renting of office machinery and equipment` · `08007-Renting of other machinery and equipment n.e.c.` · `08008-Renting of personal and household goods n.e.c.` · `08009-Renting of other machinery n.e.c.` · `09001-Wholesale and retail sale of motor vehicles` · `09002-Repair and maintenance of motor vehicles` · `09003-Sale of motor parts and accessories- wholesale and retail` · `09004-Retail sale of automotive fuel` · `09005-General commission agents, commodity brokers and auctioneers` · `09006-Wholesale of agricultural raw material` · `09007-Wholesale of food & beverages and tobacco` · `09008-Wholesale of household goods` · `09009-Wholesale of metals and metal ores` · `09010-Wholesale of household goods` · `09011-Wholesale of construction material` · `09012-Wholesale of hardware and sanitary fittings` · `09013-Wholesale of cotton and jute` · `09014-Wholesale of raw wool and raw silk` · `09015-Wholesale of other textile fibres` · `09016-Wholesale of industrial chemicals` · `09017-Wholesale of fertilizers and pesticides` · `09018-Wholesale of electronic parts & equipment` · `09019-Wholesale of other machinery, equipment and supplies` · `09020-Wholesale of waste, scrap & materials for re-cycling` · `09021-Retail sale of food, beverages and tobacco in specialized stores` · `09022-Retail sale of other goods in specialized stores` · `09023-Retail sale in non-specialized stores` · `09024-Retail sale of textiles, apparel, footwear, leather goods` · `09025-Retail sale of other household appliances` · `09026-Retail sale of hardware, paint and glass` · `09027-Wholesale of other products n.e.c` · `09028-Retail sale of other products n.e.c` · `09029-Commission agents - Kachcha Arahtia` · `10001-Hotels – Star rated` · `10002-Hotels – Non-star rated` · `10003-Motels, Inns and Dharmshalas` · `10004-Guest houses and circuit houses` · `10005-Dormitories and hostels at educational institutions` · `10006-Short stay accommodations n.e.c.` · `10007-Restaurants – with bars` · `10008-Restaurants – without bars` · `10009-Canteens` · `10010-Independent caterers` · `10011-Casinos and other games of chance` · `10012-Other hospitality services n.e.c.` · `11001-Travel agencies and tour operators` · `11002-Packers and movers` · `11003-Passenger land transport` · `11004-Air transport` · `11005-Transport by urban/sub-urban railways` · `11006-Inland water transport` · `11007-Sea and coastal water transport` · `11008-Freight transport by road` · `11009-Freight transport by railways` · `11010-Forwarding of freight` · `11011-Receiving and acceptance of freight` · `11012-Cargo handling` · `11013-Storage and warehousing` · `11014-Transport via pipelines (transport of gases, liquids, slurry and other commodities)` · `11015-Other Transport & Logistics services n.e.c` · `12001-Post and courier activities` · `12002-Basic telecom services` · `12003-Value added telecom services` · `12004-Maintenance of telecom network` · `12005-Activities of the cable operators` · `12006-Other Post & Telecommunication services n.e.c` · `13001-Commercial banks, saving banks and discount houses` · `13002-Specialised institutions granting credit` · `13003-Financial leasing` · `13004-Hire-purchase financing` · `13005-Housing finance activities` · `13006-Commercial loan activities` · `13007-Credit cards` · `13008-Mutual funds` · `13009-Chit fund` · `13010-Investment activities` · `13011-Life insurance` · `13012-Pension funding` · `13013-Non-life insurance` · `13014-Administration of financial markets` · `13015-Stock brokers, sub-brokers and related activities` · `13016-Financial advisers, mortgage advisers and brokers` · `13017-Foreign exchange services` · `13018-Other financial intermediation services n.e.c.` · `14001-Software development` · `14002-Other software consultancy` · `14003-Data processing` · `14004-Database activities and distribution of electronic content` · `14005-Other IT enabled services` · `14006-BPO services` · `14007-Cyber café` · `14008-Maintenance and repair of office, accounting and computing machinery` · `14009-Computer training and educational institutes` · `14010-Other computation related services n.e.c.` · `15001-Natural sciences and engineering` · `15002-Social sciences and humanities` · `15003-Other Research & Development activities n.e.c.` · `16001-Legal profession` · `16002-Accounting, book-keeping and auditing profession` · `16003-Tax consultancy` · `16004-Architectural profession` · `16005-Engineering and technical consultancy` · `16006-Advertising` · `16007-Fashion designing` · `16008-Interior decoration` · `16009-Photography` · `16010-Auctioneers` · `16011-Business brokerage` · `16012-Market research and public opinion polling` · `16013-Business and management consultancy activities` · `16014-Labour recruitment and provision of personnel` · `16015-Investigation and security services` · `16016-Building-cleaning and industrial cleaning activities` · `16017-Packaging activities` · `16018-Secretarial activities` · `16019_1-Medical Profession` · `16020-Film Artist` · `16021-Social Media Influencers` · `16019-Other professional services n.e.c.` · `17001-Primary education` · `17002-Secondary/ senior secondary education` · `17003-Technical and vocational secondary/ senior secondary education` · `17004-Higher education` · `17005-Education by correspondence` · `17006-Coaching centres and tuitions` · `17007-Other education services n.e.c.` · `18001-General hospitals` · `18002-Speciality and super speciality hospitals` · `18003-Nursing homes` · `18004-Diagnostic centres` · `18005-Pathological laboratories` · `18006-Independent blood banks` · `18007-Medical transcription` · `18008-Independent ambulance services` · `18009-Medical suppliers, agencies and stores` · `18010-Medical clinics` · `18011-Dental practice` · `18012-Ayurveda practice` · `18013-Unani practice` · `18014-Homeopathy practice` · `18015-Nurses, physiotherapists or other para-medical practitioners` · `18016-Veterinary hospitals and practice` · `18017-Medical education` · `18018-Medical research` · `18019-Practice of other alternative medicine` · `18020-Other healthcare services` · `19001-Social work activities with accommodation (orphanages and old age homes)` · `19002-Social work activities without accommodation (Creches)` · `19003-Industry associations, chambers of commerce` · `19004-Professional organisations` · `19005-Trade unions` · `19006-Religious organizations` · `19007-Political organisations` · `19008-Other membership organisations n.e.c. (rotary clubs, book clubs and philatelic clubs)` · `19009-Other Social or community service n.e.c` · `20001-Motion picture production` · `20002-Film distribution` · `20003-Film laboratories` · `20004-Television channel productions` · `20005-Television channels broadcast` · `20006-Video production and distribution` · `20007-Sound recording studios` · `20008-Radio - recording and distribution` · `20009-Stage production and related activities` · `20010-Individual artists excluding authors` · `20011-Literary activities` · `20012-Other cultural activities n.e.c.` · `20013-Circuses and race tracks` · `20014-Video Parlours` · `20015-News agency activities` · `20016-Library and archives activities` · `20017-Museum activities` · `20018-Preservation of historical sites and buildings` · `20019-Botanical and zoological gardens` · `20020-Operation and maintenance of sports facilities` · `20021-Activities of sports and game schools` · `20022-Organisation and operation of indoor/outdoor sports and promotion and production of sporting events` · `20023_1-Sports Management` · `20023-Other sporting activities n.e.c.` · `20024-Other recreational activities n.e.c.` · `21001-Hair dressing and other beauty treatment` · `21002-Funeral and related activities` · `21003-Marriage bureaus` · `21004-Pet care services` · `21005-Sauna and steam baths, massage salons etc.` · `21006-Astrological and spiritualists‘ activities` · `21007-Private households as employers of domestic staff` · `21009-Speculative Trading` · `21010-Futures and Options trading` · `21011-Buying and selling of shares` · `21008_1-Event Management` · `21008-Other services n.e.c.` · `22001-Extra territorial organisations and bodies (IMF, World Bank, European Commission etc.)`


---

## 7 · Cross-sheet feeds

- **In:** none — the codes are entered directly on this sheet.
- **Out:** the code drives Schedule BP (rule-7/8 income A253, power-sector
  depreciation A228), Schedule VI-A (80PA A843, 80M A844), and the 44AE
  presumptive block (A116/A121). At least one code here or at Point-61 of Sch
  P&L is mandatory for the return.

---

## 8 · What this means for the build

1. **A four-row table** of code + trade name; the array is
   `NatOfBus.NatureOfBusiness[]` and only `Code` is required per row.
2. **The code list is the 356-value `NOBCode` dropdown** — seed it from
   `enums.json`, never hand-type.
3. **Enforce the "at least one code" rule** across this sheet and Point-61 of
   Sch P&L, and the 44AE cross-checks (A116/A121).
4. **The two hidden rows are blank** — do not build them (mistake #1).
