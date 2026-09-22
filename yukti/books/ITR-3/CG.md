# The book of Schedule CG — ITR-3, A.Y. 2026-27

Schema block: **`ScheduleCGFor23`**. Read row by row from the utility's **CG** sheet and confirmed against the CBDT ITR-3 schema and the validation rules. Every heading, item letter, schema key and dropdown value below is the department's own; nothing is invented. Hidden rows are listed only under *Hidden rows — not built*.

---

## 1 · The shape

Schedule CG computes income under the head **Capital Gains** for A.Y. 2026-27. It has six lettered parts: **A** Short-term capital gains (heads A1–A9 plus buy-back loss line A(A) and the total A10), **B** Long-term capital gains (heads B1–B12 plus buy-back loss line B(A) and the total B13), **C** the summary (C1 Sum of Capital Gain Income, C2 Income from transfer of Virtual Digital Assets, C3 Income chargeable under the head CAPITAL GAINS), **D** Information about deduction claimed against Capital Gains (one table per exemption section 54/54B/54D/54EC/54EE/54F/54G/54GA/115F), **E** Set-off of current-year capital losses with current-year capital gains, and **F** Information about accrual/receipt of capital gain (the quarterly split for section 234C). The whole schedule maps to the single schema block `ScheduleCGFor23`. The sheet notes that short-term items A4 and A5 and long-term items B5 to B9 are **not applicable for residents** — they are the non-resident/FII heads and stay hidden for a resident.

---

## 2 · The items

One table for the schema block **`ScheduleCGFor23`**. Every **visible** labelled row of the CG sheet appears here with its cell reference and the significant text as the utility prints it. Schema-key mapping for the leaves is given in full in §6; the major computed heads carry their `R`-column item code (e.g. A1e, B1e, C3) which is how the rules document numbers them.

| Sheet cell / item | Field label (as the utility shows it) |
|---|---|
| r3 `C3` | Schedule CG  Capital Gains |
| r4 `D4` | A(I)  Short-term capital gain (Items 4 & 5 are not applicable for residents) |
| r5 `F5` | From sale of land or building or both (fill up details separately for each property) (in case of co- |
| r6 `F6` | Date of purchase/ acquisition |
| r7 `F7` | Date of sale/transfer |
| r8 `F8` | a  i  Full value of consideration received/receivable  ai |
| r9 `G9` | ii  Value of property as per stamp valuation authority  aii |
| r10 `G10` | iii  Full value of consideration adopted as per section 50C for the purpose of Capital Gains [in case (ai  aiii |
| r11 `F11` | b  Deductions under section 48 |
| r12 `C12` | CAPITAL GAINS  i  Cost of acquisition without indexation  bi |
| r13 `G13` | ii  Cost of Improvement without indexation  bii |
| r14 `G14` | iii  Expenditure wholly and exclusively in connection with transfer  biii |
| r15 `G15` | iv  Total (bi + bii + biii)  biv |
| r16 `F16` | c  Balance (aiii – biv)  c |
| r17 `F17` | di  Deduction under section 54B(Specify details in item Dbelow)  di |
| r18 `F18` | dii  Deduction under section 54G(Specify details in item Dbelow)  dii |
| r19 `F19` | diii  Deduction under section 54GA(Specify details in item Dbelow)  diii |
| r20 `F20` | d  Total Deduction under section 54B/54G/54GA  d |
| r21 `F21` | e  Short-term Capital Gains on Immovable property (1c - 1d)  A1e |
| r22 `F22` | f  In case of transfer of immovable property please furnish following details (See Note) |
| r23 `G23` | Sl. No.  Name of Buyer(s)  PAN of Buyer  Aadhaar Number of Buyer(s)  Percentage share  Amount  Address of Property  State Code  Pin Code  Country  ZipCode (Leave Blank if No Zipcode) |
| r29 `F29` | Note 1 : Furnishing of PAN is mandatory, if the tax is deduced under section 194-IA. Note 2 : In cas |
| r30 `F30` | From Slump sale |
| r31 `F31` | ai  Fair market value as per Rule 11UAE(2)  2ai |
| r32 `F32` | aii  Fair market value as per Rule 11UAE(3)  2aii |
| r33 `F33` | aiii  Full value of consideration (higher of ai or aii)  2aiii |
| r34 `F34` | b  Net worth of the under taking or division (6(e) of Form 3CEA)  2b |
| r35 `F35` | c  Short term capital gains from slump sale (2aiii-2b)  A2c |
| r36 `F36` | From sale of equity share or unit of equity oriented Mutual Fund (MF) or unit of a business trust on |
| r37 `F37` | ia  Full value of consideration  3ia |
| r38 `F38` | ib  Deductions under section 48 |
| r39 `G39` | i  Cost of acquisition without indexation  ibi |
| r40 `G40` | ii  Cost of Improvement without indexation  ibii |
| r41 `G41` | iii  Expenditure wholly and exclusively in connection with transfer  ibiii |
| r42 `G42` | iv  Total ( ibi + ibii + ibiii)  ibiv |
| r43 `F43` | ic  Balance (3ia – 3ibiv)  3ic |
| r44 `F44` | id  Loss to be disallowed, under section 94(7) or 94(8) for example if asset bought/acquired within 3 mo  3id |
| r45 `F45` | ie  Short-term capital gain on equity share or equity oriented MF (STT paid) u/s. 111A(for others) (3ic  A3ie |
| r46 `F46` | (ii) From sale of equity share or unit of equity oriented Mutual Fund (MF) or unit of a business tru |
| r47 `F47` | iia  Full value of consideration  3iia |
| r48 `F48` | iib  Deductions under section 48 |
| r49 `G49` | i  Cost of acquisition without indexation  iibi |
| r50 `G50` | ii  Cost of Improvement without indexation  iibii |
| r51 `G51` | iii  Expenditure wholly and exclusively in connection with transfer  iibiii |
| r52 `G52` | iv  Total ( i + ii + iii)  iibiv |
| r53 `F53` | iic  Balance (3a – 3biv)  3iic |
| r54 `F54` | iid  Loss to be disallowed u/s 94(7) or 94(8)- for example if asset bought/acquired within 3 months prior  3iid |
| r55 `F55` | iie  Short-term capital gain on equity share or equity oriented MF or unit of a business trust (STT paid)  A3iie |
| r76 `F76` | From sale of assets other than at A1 or A2 or A3 or A4 or A5 above |
| r77 `F77` | a  i  In case assets sold include shares of a company other than quoted shares, enter the following detail |
| r78 `H78` | a  Full value of consideration received/receivable in respect of unquoted shares  6aia |
| r79 `H79` | b  Fair market value of unquoted shares determined in the prescribed manner  aib |
| r80 `H80` | c  Full value of consideration in respect of unquoted shares adopted as per section 50CA for the purpos  aic |
| r81 `G81` | ii  Full value of consideration in respect of assets other than unquoted shares  aii |
| r82 `G82` | iii  Total (ic + ii)  aiii |
| r84 `F84` | b  Deductions under section 48 |
| r85 `G85` | i  Cost of acquisition without indexation  bi |
| r86 `G86` | ii  Cost of Improvement without indexation  bii |
| r87 `G87` | iii  Expenditure wholly and exclusively in connection with transfer  biii |
| r88 `G88` | iv  Total (bi + bii + biii)  biv |
| r89 `F89` | c  Balance (6aiii – biv)  6c |
| r90 `F90` | d  In case of asset (security/unit)loss to be disallowed u/s 94(7) or 94(8)- for example if asset bough  6d |
| r91 `F91` | e  Deemed short term capital gains on depreciable assets (6 of schedule- DCG)  e |
| r93 `F93` | fi  Deduction under section 54G (Specify details in item Dbelow)  fi |
| r94 `F94` | fii  Deduction under section 54GA (Specify details in item Dbelow)  fii |
| r95 `F95` | f  Deduction under section 54G/54GA  6f |
| r96 `F96` | g  STCG on assets other than at A1 or A2 or A3 or A4 or A5 above (6c + 6d + 6e-6f)  A6g |
| r97 `F97` | Amount deemed to be short-term capital gains |
| r98 `E98` | a  Whether any amount of unutilized capital gain on asset transferred during the previous years shown b  No |
| r99 `G99` | Sl.No.  Previous year in which asset transferred  Section under which deduction claimed in that year  New asset acquired/constructed  Amount not used for new asset or remained unutilized in Capital gains account (X) |
| r100 `J100` | Previous year in which asset acquired/constructed  Amount utilised out of Capital Gains account |
| r101 `F101` | i |
| r103 `E103` | b  Amount deemed to be short term capital gains u/s 54B/54G/54GA, other than at ‘a’  7b |
| r104 `F104` | Total amount deemed to be short term capital gains (aXi + aXii + aXiii + b)  A7 |
| r106 `F106` | Pass Through Income/Loss in the nature of Short Term Capital Gain, (Fill up schedule PTI) (A8a+ A8b  A8 |
| r109 `F109` | a  Pass Through Income/ Loss in the nature of Short Term Capital Gain, chargeable @ 20%  8a |
| r110 `F110` | b  Pass Through Income / Loss in the nature of Short Term Capital Gain, chargeable @ 30%  8b |
| r111 `F111` | c  Pass Through Income / Loss in the nature of Short Term Capital Gain, chargeable at applicable rates  8c |
| r112 `F112` | Amount of STCG included in A1-A8 but claimed as not chargeable to tax or chargeable at special rates |
| r113 `G113` | Sl. No. (1)  Amount of income (2)  Item No. A1 to A8 above in which included (3)  Country name, code (4)  Article of DTAA (5)  Rate as per Treaty (enter NIL, if not chargeable) (6)  Whether Tax Residency Certificate obtained? (7)  Section of I.T. Act (8)  Rate as per I.T. Act (9)  Applicable rate [lower of (6) or (9)] (10) |
| r120 `G120` | a  Total amount of STCG claimed as not chargeable to tax as per DTAA  A9a |
| r121 `G121` | b  Total amount of STCG claimed as chargeable to tax at special rates as per DTAA  A9b |
| r135 `D135` | A(A)  Capital Loss on buy back of shares [Short Term Capital loss @20% / 30% / Applicable rate] (can be cl  A(A) |
| r136 `G136` | Sl.No  Rate  Amount |
| r140 `F140` | Total short term capital gain (A1e+ A2c+ A3e+A4a+ A4b+ A5e+ A6g +A7 + A8-A9a)+A(A)  A10 |
| r141 `D141` | B(I)  Long-term capital gain (LTCG) (Items 5, 6 , 7 & 8 are not applicable for residents) |
| r142 `D142` | Long-term Capital Gains  From sale of land or building or both (fill up details separately for each property) (from a to f) |
| r143 `F143` | Date of purchase/ acquisition |
| r144 `F144` | Date of sale/transfer |
| r145 `F145` | a  i  Full value of consideration received/receivable  ai |
| r146 `G146` | ii  Value of property as per stamp valuation authority  aii |
| r147 `G147` | iii  Full value of consideration adopted as per section 50C for the purpose of Capital Gains [in case (ai  aiii |
| r148 `F148` | b  Deductions under section 48 |
| r149 `G149` | i  Cost of acquisition without indexation  bi |
| r150 `G150` | biia  Cost of acquisition with indexation (Applicable only for: Residents for computational purposes under  biia |
| r151 `G151` | biib  Total Cost of Improvement  iib |
| r152 `G152` | Sl. No.  Cost of improvement without indexation biib(a)  Year of Improvement  Cost of Improvement with indexation (b & c applicable only for: Residents for computational purposes |
| r156 `H156` | Total Cost of improvement without indexation  biibci |
| r157 `H157` | Total Cost of Improvement with indexation  biibcii |
| r158 `G158` | biii  Expenditure wholly and exclusively in connection with transfer  biii |
| r159 `G159` | biv  Total ( bi + ∑biib(a) + biii)  biv |
| r160 `G160` | biva  Total (only for the purpose of computing eiB) (biia + Ʃbiib(c) + biii) (Applicable for Residents for  biva |
| r161 `F161` | c  Balance (aiii – biv)  1c |
| r162 `G162` | ca  (Applicable for Residents for computational purposes under second proviso to section 112(1)(a) where  1ca |
| r163 `F163` | di  Deduction under section 54 (Specify details in item D below)  di |
| r164 `F164` | dii  Deduction under section 54B (Specify details in item D below)  dii |
| r165 `F165` | diii  Deduction under section 54D (Specify details in item D below)  diii |
| r166 `F166` | div  Deduction under section 54EC (Specify details in item D below)  div |
| r167 `F167` | dv  Deduction under section 54F (Specify details in item D below)  dv |
| r168 `F168` | dvi  Deduction under section 54G (Specify details in item D below)  dvi |
| r169 `F169` | dvii  Deduction under section 54GA (Specify details in item D below)  dvii |
| r170 `F170` | d  Deduction under section 54/54B/54D/54EC/54F/54G/54GA (Specify details in item D below)  1d |
| r171 `F171` | e  Long-term Capital Gains on Immovable property (1c - 1d)  B1e |
| r172 `F172` | ea  Long term Capital Gains on Immovable property (1ca-1d) (Applicable for Residents for computational p  B1e(a) |
| r173 `F173` | ei  Where acquisition is before 23rd July 2024 (for resident only (Note : Tax computed at (ei) is for de |
| r174 `F174` | eiA  Tax as per Section 112(1)(a)(ii)(B) (1e*12.5%)  B1ei(A) |
| r175 `F175` | eiB  Tax for the purpose of second proviso to Section 112(1)(a) (1ea*20%)  B1ei(B) |
| r176 `F176` | eii  Excess amount, if any, that is required to be ignored as per second proviso to section 112(1)(a) (fo  B1eii |
| r177 `F177` | f  In case of transfer of immovable property please furnish the following details (See Note) |
| r178 `G178` | Sl. No.  Name of Buyer(s)  PAN of Buyer(s)  Aadhaar Number of Buyer(s)  Percentage share  Amount  Address of Property  State Code  Pin Code  Country  Zipcode (Leave Blank if No Zipcode) |
| r184 `F184` | Note 1 : Furnishing of PAN is mandatory, if the tax is deduced under section 194-IA. Note 2 : In cas |
| r185 `E185` | g  Total Long-term Capital Gains on all Immovable propertyies (ƩB1e) |
| r188 `E188` | h  Total excess tax to be ignored (ƩB1eii) |
| r189 `F189` | From Slump sale |
| r191 `F191` | ai  Fair market value as per Rule 11UAE(2)  2ai |
| r192 `F192` | aii  Fair market value as per Rule 11UAE(3)  2aii |
| r193 `F193` | aiii  Full value of consideration (higher of ai or aii)  2aiii |
| r194 `F194` | b  Net worth of the under taking or division (6(e) of Form 3CEA)  2b |
| r195 `F195` | c  Balance (2aiii - 2b)  2c |
| r196 `F196` | di  Deduction u/s 54EC (Specify details in item D below)  di |
| r198 `F198` | dii  Deduction u/s 54F (Specify details in item D below)  dii |
| r199 `F199` | d  Total Deduction u/s 54EC/54F  2d |
| r200 `F200` | e  Long term capital gains from slump sale (2c-2d)  B2e |
| r216 `E216` | 3i  From sale of (i) listed securities (other than a unit) or zero coupon bond as per Section 112(1) |
| r218 `F218` | ia  Full value of consideration  3ia |
| r219 `F219` | ib  Deductions under section 48 |
| r221 `G221` | i  Cost of acquisition without indexation  bia |
| r223 `G223` | ii  Cost of improvement without indexation  biia |
| r224 `G224` | iii  Expenditure wholly and exclusively in connection with transfer  biii |
| r225 `G225` | iv  Total (bi + bii +biii)  biv |
| r227 `F227` | ic  Balance (3ia – ibiv)  3c |
| r231 `F231` | id  Deduction under sections 54F(Specify details in item D below)  3id |
| r233 `F233` | ie  Long-term Capital Gains on assets at B4 above where transfer was (3c-3d)  B3ie |
| r240 `E240` | 3ii  From sale of (ii) GDR of an Indian company referred in sec. 115ACA (applicable only for resident ind |
| r241 `F241` | iia  Full value of consideration  3iia |
| r242 `F242` | iib  Deductions under section 48 |
| r243 `G243` | i  Cost of acquisition without indexation  iibi |
| r244 `G244` | ii  Cost of improvement without indexation  iibii |
| r245 `G245` | iii  Expenditure wholly and exclusively in connection with transfer  iibiii |
| r246 `G246` | iv  Total (bi + bii +biii)  iibiv |
| r247 `F247` | iic  Balance (3iia –iibiv)  3iic |
| r250 `F250` | iid  Deduction under sections 54F(Specify details in item D below)  iid |
| r252 `F252` | e  Long-term Capital Gains on assets at B4 above where transfer was (3c-3d)  B3iie |
| r255 `F255` | From sale of equity share in a company or unit of equity oriented fund or unit of a business trust o |
| r256 `F256` | a  LTCG u/s 112A (column 14 of Schedule 112A)  4a |
| r261 `F261` | b  Deduction under sections 54F (Specify details in item D below)  4b |
| r262 `F262` | c  Long-term Capital Gains on assets at B4 above (4a-4b)  B4c |
| r354 `F354` | From sale of assets where B1 to B8 above are not applicable |
| r355 `F355` | a  i  In case assets sold include shares of a company other than quoted shares, enter the following detail  i6a |
| r356 `H356` | a  Full value of consideration received/receivable in respect of unquoted shares  9ai |
| r357 `H357` | b  Fair market value of unquoted shares determined in the prescribed manner  ib |
| r358 `H358` | c  Full value of consideration in respect of unquoted shares adopted as per section 50CA for the purpos  ic |
| r359 `G359` | ii  Full value of consideration in respect of assets other than unquoted shares  9aii |
| r360 `G360` | iii  Total (ic + ii)  9aiii |
| r361 `F361` | b  Deductions under section 48 |
| r362 `G362` | i  Cost of acquisition without indexation  9bi |
| r363 `G363` | ii  Cost of improvement without indexation  bii |
| r364 `G364` | iii  Expenditure wholly and exclusively in connection with transfer  biii |
| r365 `G365` | iv  Total (bi + bii +biii)  biv |
| r366 `F366` | c  Balance (9aiii – biv)  9c |
| r367 `F367` | di  Deduction under sections 54D (Specify details in item D below)  di |
| r370 `F370` | dii  Deduction under sections 54F (Specify details in item D below)  dii |
| r371 `F371` | diii  Deduction under sections 54G (Specify details in item D below)  diii |
| r372 `F372` | div  Deduction under sections 54GA (Specify details in item D below)  div |
| r373 `F373` | d  Deduction under sections 54D/54F/54G/54GA (Specify details in item D below)  9d |
| r374 `F374` | e  Long-term Capital Gains on assets at B9 above (9c-9d)  B9e |
| r387 `F387` | Amount deemed to be long-term capital gains |
| r388 `E388` | a  Whether any amount of unutilized capital gain on asset transferred during the previous years shown b  No |
| r389 `G389` | Sl.No.  Previous year in which asset transferred  Section under which deduction claimed in that year  New asset acquired/constructed  Amount not used for new asset or remained unutilized in Capital gains account (X) |
| r390 `J390` | Year in which asset acquired/constructed  Amount utilised out of Capital Gains account |
| r396 `E396` | b  Amount deemed to be long-term capital gains, other than at ‘a’  10b |
| r397 `F397` | Total Amount deemed to be long-term capital gains (aXi + aXii +aXiii+ b)  B10 |
| r400 `F400` | Pass Through Income/loss in the nature of Long Term Capital Gain,(Fill up schedule PTI) (B11a1+B11a2  B11 |
| r402 `F402` | a1  Pass Through Income/ Loss in the nature of Long-Term Capital Gain, chargeable @ 12.5% u/s 112A  11a1 |
| r404 `F404` | a2  Pass Through Income/ Loss in the nature of Long-Term Capital Gain, chargeable @ 12.5% other than u/s  11a2 |
| r406 `F406` | Amount of LTCG included in items B1 to B11 but claimed as not chargeable to tax or chargeable at spe |
| r407 `G407` | Sl. No. (1)  Amount of income (2)  Item No. B1 to B11 above in which included (3)  Country name, code (4)  Article of DTAA (5)  Rate as per Treaty (enter NIL, if not chargeable) (6)  Whether Tax Residency Certificate obtained? (7)  Section of I.T. Act (8)  Rate as per I.T. Act (9)  Applicable rate [lower of (6) or (9)] (10) |
| r413 `G413` | a  Total amount of LTCG claimed as not chargeable to tax under DTAA  B12a |
| r414 `G414` | b  Total amount of LTCG claimed as chargeable to tax at special rates as per DTAA  B12b |
| r420 `E420` | B(A)  Capital Loss on buy back of shares [Long Term Capital loss @12.5%] (can be claimed only if respectiv  B(A) |
| r425 `F425` | Total long term capital gain chargeable under I.T. Act [B1g +B2e+ B3e +B4c+ B5c + B6c + B7c+ B8c + B  B13 |
| r426 `D426` | C1  Sum of Capital Gain Income (8ii +8iii + 8iv + 8v + 8vi + 8vii of table E below)  C1 |
| r427 `D427` | C2  Income from transfer of Virtual Digital Assets (Item No. B of Schedule VDA )  C2 |
| r428 `D428` | C3  Income chargeable under the head “CAPITAL GAINS” (C1 + C2 )  C3 |
| r429 `D429` | D  Information about deduction claimed against Capital Gains |
| r430 `F430` | In case of deduction u/s 54/54B/54D/54EC/54F/54G/54GA/115F give following details |
| r431 `F431` | a  Deduction claimed u/s 54 |
| r432 `G432` | Sl. No  Date of transfer of original asset  Cost of new residential house  Date of purchase/construction of new residential house  Amount deposited in Capital Gains Accounts Scheme before due date  Date of deposit  Account number  IFS code  Amount of deduction claimed |
| r436 `G436` | Total |
| r437 `F437` | b  Deduction claimed u/s 54B |
| r438 `G438` | Sl. No  Date of transfer of original asset  Cost of new agricultural land  Date of purchase of new agricultural land  Amount deposited in Capital Gains Accounts Scheme before due date  Date of deposit  Account number  IFS code  Amount of deduction claimed |
| r441 `G441` | Total |
| r442 `F442` | c  Deduction claimed u/s 54D |
| r443 `G443` | Sl. No  Date of acquisition of original asset  Cost of purchase/ construction of new land or building for industrial undertaking  Date of purchase of new land or building  Amount deposited in Capital Gains Accounts Scheme before due date  Date of deposit  Account number  IFS code  Amount of deduction claimed |
| r446 `G446` | Total |
| r447 `F447` | d  Deduction claimed u/s 54EC |
| r448 `G448` | Sl. No  Date of transfer of original asset  Amount invested in specified/notified bonds (not exceeding fifty lakh rupees)  Date of investment  Amount of deduction claimed |
| r451 `G451` | Total |
| r457 `F457` | e  Deduction claimed u/s 54F |
| r458 `G458` | Sl. No.  Date of transfer of original asset  Cost of new residential house  Date of purchase/construction of new residential house  Amount deposited in Capital Gains Accounts Scheme before due date  Date of deposit  Account number  IFS code  Amount of deduction claimed |
| r461 `G461` | Total |
| r462 `F462` | f  Deduction claimed u/s 54G |
| r463 `G463` | Sl. No.  Date of transfer of original asset from urban area  Cost and expenses incurred for purchase or construction of new asset  Date of purchase/construction of new asset in an area other than urban area  Amount deposited in Capital Gains Accounts Scheme before due date  Date of deposit  Account number  IFS code  Amount of deduction claimed |
| r466 `G466` | Total |
| r467 `F467` | g  Deduction claimed u/s 54GA |
| r468 `G468` | Sl. No.  Date of transfer of original asset from urban area  Cost and expenses incurred for purchase or construction of new asset  Date of purchase/construction of new asset in SEZ  Amount deposited in Capital Gains Accounts Scheme before due date  Date of deposit  Account number  IFS code  Amount of deduction claimed |
| r471 `G471` | Total |
| r472 `F472` | h  Deduction claimed u/s 115F (for Non-Resident Indians) |
| r473 `G473` | Sl. No  Date of transfer of original foreign exchange asset  Amount invested in new specified asset or savings certificate  Date of investment  Amount of deduction claimed |
| r476 `G476` | Total |
| r489 `F489` | 1i  Total deduction claimed ) (1a + 1b + 1c + 1d + 1e + 1f+1g+1h)  1i |
| r490 `F490` | In case of deduction u/s 54GB, furnish PAN of the company |
| r506 `D506` | E  Set-off of current year capital losses with current year capital gains (excluding amounts included i |
| r523 `D523` | SI. No  Type of Capital Gain  Capital Gain of current year (Fill this column only if computed figure is positive)  Short term capital loss  Long term capital loss |
| r524 `L524` | applicable rate  DTAA rates  DTAA rates  Current year’s capital gains remaining after set off (8= 1-2-3-4-5-6-7) |
| r526 `E526` | i  Capital Loss to be set off (Fill this row only if figure computed is negative)------> |
| r527 `E527` | ii  Short term capital gain |
| r528 `E528` | iii |
| r529 `E529` | iv  applicable rate |
| r530 `E530` | v  DTAA rates |
| r531 `E531` | vi  Long term capital gain |
| r532 `E532` | vii  DTAA rates |
| r533 `E533` | viii  Total loss set off (ii + iii + iv + v + vi+vii) |
| r534 `E534` | ix  Loss remaining after set off (i – viii) |
| r535 `D535` | Do you want to edit the detail autopopulated above? |
| r536 `D536` | F |
| r537 `F537` | Type of Capital gain / Date  Upto 15/6 (i)  16/6 to 15/9 (ii)  16/9 to 15/12 (iii)  16/12 to 15/3 (iv)  16/3 to 31/3 (v) |
| r539 `F539` | Short-term capital gains taxable at the rate of 20%.Enter value from item 5vi of schedule BFLA, if a |
| r540 `F540` | Short-term capital gains taxable at the rate of 30%. Enter value from item 5vii of schedule BFLA, if |
| r541 `F541` | Short-term capital gains taxable at applicable rates. Enter value from item 5viii of schedule BFLA, |
| r542 `F542` | Short-term capital gains taxable at DTAA rates Enter value from item 5ix of schedule BFLA, if any. |
| r544 `F544` | Long- term capital gains taxable at the rate of 12.5% Enter value from item 5x of schedule BFLA, if |
| r546 `F546` | Long-term capital gains taxable at DTAA rates Enter value from item 5xi of schedule BFLA, if any. |
| r547 `F547` | Capital gains on transfer of Virtual Digital Asset taxable at the rate of 30% Enter value from item |
| r548 `C548` | NOTE ►  Please include the income of the specified persons (spouse, minor child, etc.) referred to in Schedu |

---

## 3 · The rules the sheet computes

Each rule below is a formula the CG sheet carries, with its cell reference. Only visible, rule-bearing formulas (caps, MIN/MAX, conditions, cross-sheet references) are listed.

- **`Q10`** — A1aiii — full value of consideration u/s 50C = `IF(Q9>1.1*Q8, Q9, Q8)`: the stamp-duty value (aii) is substituted only when it exceeds the actual consideration (ai) by more than 10%.
- **`S21`** — A1e — Short-term Capital Gains on Immovable property = `IF(Q16<0, Q16, IF(Q20>Q16, 0, Q16-Q20))`: balance (1c) less deduction (1d), floored at 0 when the deduction exceeds the balance; a loss passes through unchanged.
- **`Q33`** — A2aiii — full value of consideration for slump sale = `MAX(Q31,Q32)`: higher of FMV under Rule 11UAE(2) and Rule 11UAE(3).
- **`Q65`** — A4aic — consideration for unquoted shares u/s 50CA = `MAX(full consideration, fair market value)` (non-resident, hidden).
- **`Q80`** — A5aic — consideration for unquoted shares u/s 50CA = `MAX(full consideration, fair market value)`.
- **`Q91`** — A6e — Deemed STCG on depreciable assets = `DCG.TotalDepreciation`: pulled from Schedule DCG (item 6).
- **`S96`** — A6g — STCG on other assets = `IF(6c+6d+6e < 0, ..., 6c+6d+6e-6f)`: sum of balance, disallowed loss and deemed depreciable gain, less deduction 6f.
- **`S120`** — A9a — total STCG not chargeable as per DTAA: computed only when residential status begins 'NRI' (`MID(sheet1.ResidentialStatus1,1,3)="NRI"`), summing DTAA rows where the treaty rate is NIL and a TRC was obtained.
- **`S121`** — A9b — total STCG chargeable at special rates as per DTAA: the NRI-only companion sum to A9a.
- **`W143/W144`** — B1 land/building — CII lookup: `VLOOKUP(...CostInflationtbl...)` on the acquisition year and sale year for the indexed cost of acquisition (residents only).
- **`Q147`** — B1aiii — full value of consideration u/s 50C = `IF(Q146>1.1*Q145, Q146, Q145)`: same 10% stamp-value substitution as A1.
- **`Q150`** — B1biia — indexed cost of acquisition: computed only for residents (`MID(sheet1.ResidentialStatus1,1,3)="RES"`) for the second-proviso-to-112(1)(a) working.
- **`S171`** — B1e — Long-term Capital Gains on Immovable property = `IF(1c<0, 1c, IF(1d>1c, 0, 1c-1d))`.
- **`S176`** — B1eii — excess amount to be ignored per second proviso to 112(1)(a) = `IF(B1ei(A) > B1ei(B), B1ei(A)-B1ei(B), 0)` i.e. tax at 12.5% without indexation vs 20% with indexation.
- **`Q256`** — B4a — LTCG u/s 112A = `ROUND(Total_Balance_112A,0)`: pulled from column 14 of Schedule 112A.
- **`Q330`** — B7a — LTCG u/s 112A for FII/FPI = `ROUND(Total_Balance_115AD,0)`: from column 14 of the 115AD(1)(iii) proviso schedule (hidden, non-resident).

Cross-schedule and total rules the validation document enforces (Schedule CG): STCG total in CG must equal the individual STCG breakup; LTCG total must equal the individual LTCG breakup; C1 (income under head Capital Gain) must equal the sum of capital gains in Table E; STCG on depreciable assets (A6e) must equal Sl.No.6 of Schedule DCG; where full value of consideration is zero the expenses under section 48 cannot be claimed; and the amount reduced at A3c of Schedule BP cannot exceed the income offered in Schedule CG.

---

## 4 · Dropdowns

Every dropdown list on the CG sheet, with every value. Numeric-only validators (min/max constraints with no value list) are not dropdowns and are omitted.

**Cells `K124:K125` (+others)** — 13 values:

(Select), A1e- Short-term Capital Gains on Immovable property, A2c- Short-term Capital Gains from Slump sale, A3ie- 111A- Short-term capital gain on equity share or equity oriented MF (STT paid), A3iie- 115AD- Short-term capital gain on equity share or equity oriented MF (STT paid), A4a- STCG on transactions covered u/s 111A for Non Residents, A4b- STCG from sale of shares not covered in sl. no 4a or sale of debentures for Non Residents, A5e- Short-term capital gain on sale of securities by an FII as per section 115AD, A6g- STCG on assets other than at A1 or A2 or A3 or A4 or A5, A7- Amount deemed to be short term capital gains, A8a_20%- Pass Through Income/ Loss in the nature of Short-Term Capital Gain, chargeable @ 20%, A8b- Pass Through Income/ Loss in the nature of Short-Term Capital Gain, chargeable @ 30%, A8c- Pass Through Income/ Loss in the nature of Short-Term Capital Gain, chargeable at applicable rates

**Cells `J124:J125` (+others)** — 3 values:

(Select), Yes, No

**Cells `K416:K417` (+others)** — 16 values:

(Select), B1g-Total LTCG on all Immovable properties, B2e-LTCG from Slump sale, B3ie-112(1) LTCG u/s 112(1) from listed securities (other than a unit) or zero coupon bonds, B3iie-115ACA - LTCG u/s 115ACA from GDR of an Indian company, B4c-112A- LTCG from sale of equity share in a company or unit of equity oriented fund or unit of a business trust on which STT is paid, B5c-LTCG on unlisted shares or listed debentures, B6ie-112(1)(c) - LTCG u/s 112(1)(c) from unlisted securities, B6iie-115AC - LTCG u/s 115AC from bonds or GDR, B6iiie-115AD - LTCG u/s 115AD from securities by FII, B7c-115AD(1)(iii) proviso - LTCG under section 112A read with section 115AD, B8c-LTCG from sale of foreign exchange asset by NRI, B9e-LTCG from sale of assets where B1 to B8 are not applicable, B10-Amount deemed to be long-term capital gains, B11a1-Pass Through Income/ Loss in the nature of LTCG, chargeable @ 12.5% u/s 112A, B11a2-Pass Through Income/ Loss in the nature of LTCG, chargeable @ 12.5% other than u/s 112A

**Cells `H124:H125` (+others)** — 248 values:

(Select), 93-AFGHANISTAN, 1001-ALAND ISLANDS, 355-ALBANIA, 213-ALGERIA, 684-AMERICAN SAMOA, 376-ANDORRA, 244-ANGOLA, 1264-ANGUILLA, 1010-ANTARCTICA, 1268-ANTIGUA AND BARBUDA, 54-ARGENTINA, 374-ARMENIA, 297-ARUBA, 61-AUSTRALIA, 43-AUSTRIA, 994-AZERBAIJAN, 1242-BAHAMAS, 973-BAHRAIN, 880-BANGLADESH, 1246-BARBADOS, 375-BELARUS, 32-BELGIUM, 501-BELIZE, 229-BENIN, 1441-BERMUDA, 975-BHUTAN, 591-BOLIVIA (PLURINATIONAL STATE OF), 1002-BONAIRE, SINT EUSTATIUS AND SABA, 387-BOSNIA AND HERZEGOVINA, 267-BOTSWANA, 1003-BOUVET ISLAND, 55-BRAZIL, 1014-BRITISH INDIAN OCEAN TERRITORY, 673-BRUNEI DARUSSALAM, 359-BULGARIA, 226-BURKINA FASO, 257-BURUNDI, 238-CABO VERDE, 855-CAMBODIA, 237-CAMEROON, 1-CANADA, 1345-CAYMAN ISLANDS, 236-CENTRAL AFRICAN REPUBLIC, 235-CHAD, 56-CHILE, 86-CHINA, 9-CHRISTMAS ISLAND, 672-COCOS (KEELING) ISLANDS, 57-COLOMBIA, 270-COMOROS, 242-CONGO, 243-CONGO (DEMOCRATIC REPUBLIC OF THE), 682-COOK ISLANDS, 506-COSTA RICA, 225-COTE DIVOIRE, 385-CROATIA, 53-CUBA, 1015-CURACAO, 357-CYPRUS, 420-CZECHIA, 45-DENMARK, 253-DJIBOUTI, 1767-DOMINICA, 1809-DOMINICAN REPUBLIC, 593-ECUADOR, 20-EGYPT, 503-EL SALVADOR, 240-EQUATORIAL GUINEA, 291-ERITREA, 372-ESTONIA, 251-ETHIOPIA, 500-FALKLAND ISLANDS (MALVINAS), 298-FAROE ISLANDS, 679-FIJI, 358-FINLAND, 33-FRANCE, 594-FRENCH GUIANA, 689-FRENCH POLYNESIA, 1004-FRENCH SOUTHERN TERRITORIES, 241-GABON, 220-GAMBIA, 995-GEORGIA, 49-GERMANY, 233-GHANA, 350-GIBRALTAR, 30-GREECE, 299-GREENLAND, 1473-GRENADA, 590-GUADELOUPE, 1671-GUAM, 502-GUATEMALA, 1481-GUERNSEY, 224-GUINEA, 245-GUINEA-BISSAU, 592-GUYANA, 509-HAITI, 1005-HEARD ISLAND AND MCDONALD ISLANDS, 6-HOLY SEE, 504-HONDURAS, 852-HONG KONG, 36-HUNGARY, 354-ICELAND, 62-INDONESIA, 98-IRAN (ISLAMIC REPUBLIC OF), 964-IRAQ, 353-IRELAND, 1624-ISLE OF MAN, 972-ISRAEL, 5-ITALY, 1876-JAMAICA, 81-JAPAN, 1534-JERSEY, 962-JORDAN, 7-KAZAKHSTAN, 254-KENYA, 686-KIRIBATI, 850-KOREA (DEMOCRATIC PEOPLES REPUBLIC OF), 82-KOREA (REPUBLIC OF), 965-KUWAIT, 996-KYRGYZSTAN, 856-LAO PEOPLES DEMOCRATIC REPUBLIC, 371-LATVIA, 961-LEBANON, 266-LESOTHO, 231-LIBERIA, 218-LIBYA, 423-LIECHTENSTEIN, 370-LITHUANIA, 352-LUXEMBOURG, 853-MACAO, 389-MACEDONIA (THE FORMER YUGOSLAV REPUBLIC OF), 261-MADAGASCAR, 265-MALAWI, 60-MALAYSIA, 960-MALDIVES, 223-MALI, 356-MALTA, 692-MARSHALL ISLANDS, 596-MARTINIQUE, 222-MAURITANIA, 230-MAURITIUS, 269-MAYOTTE, 52-MEXICO, 691-MICRONESIA (FEDERATED STATES OF), 373-MOLDOVA (REPUBLIC OF), 377-MONACO, 976-MONGOLIA, 382-MONTENEGRO, 1664-MONTSERRAT, 212-MOROCCO, 258-MOZAMBIQUE, 95-MYANMAR, 264-NAMIBIA, 674-NAURU, 977-NEPAL, 31-NETHERLANDS, 687-NEW CALEDONIA, 64-NEW ZEALAND, 505-NICARAGUA, 227-NIGER, 234-NIGERIA, 683-NIUE, 15-NORFOLK ISLAND, 1670-NORTHERN MARIANA ISLANDS, 47-NORWAY, 968-OMAN, 92-PAKISTAN, 680-PALAU, 970-PALESTINE, STATE OF, 507-PANAMA, 675-PAPUA NEW GUINEA, 595-PARAGUAY, 51-PERU, 63-PHILIPPINES, 1011-PITCAIRN, 48-POLAND, 14-PORTUGAL, 1787-PUERTO RICO, 974-QATAR, 262-REUNION, 40-ROMANIA, 8-RUSSIAN FEDERATION, 250-RWANDA, 1006-SAINT BARTHELEMY, 290-SAINT HELENA, ASCENSION AND TRISTAN DA CUNHA, 1869-SAINT KITTS AND NEVIS, 1758-SAINT LUCIA, 1007-SAINT MARTIN (FRENCH PART), 508-SAINT PIERRE AND MIQUELON, 1784-SAINT VINCENT AND THE GRENADINES, 685-SAMOA, 378-SAN MARINO, 239-SAO TOME AND PRINCIPE, 966-SAUDI ARABIA, 221-SENEGAL, 381-SERBIA, 248-SEYCHELLES, 232-SIERRA LEONE, 65-SINGAPORE, 1721-SINT MAARTEN (DUTCH PART), 421-SLOVAKIA, 386-SLOVENIA, 677-SOLOMON ISLANDS, 252-SOMALIA, 28-SOUTH AFRICA, 1008-SOUTH GEORGIA AND THE SOUTH SANDWICH ISLANDS, 211-SOUTH SUDAN, 35-SPAIN, 94-SRI LANKA, 249-SUDAN, 597-SURINAME, 1012-SVALBARD AND JAN MAYEN, 268-SWAZILAND, 46-SWEDEN, 41-SWITZERLAND, 963-SYRIAN ARAB REPUBLIC, 886-TAIWAN, 992-TAJIKISTAN, 255-TANZANIA, UNITED REPUBLIC OF, 66-THAILAND, 670-TIMOR-LESTE(EAST TIMOR), 228-TOGO, 690-TOKELAU, 676-TONGA, 1868-TRINIDAD AND TOBAGO, 216-TUNISIA, 90-TURKEY, 993-TURKMENISTAN, 1649-TURKS AND CAICOS ISLANDS, 688-TUVALU, 256-UGANDA, 380-UKRAINE, 971-UNITED ARAB EMIRATES, 44-UNITED KINGDOM OF GREAT BRITAIN AND NORTHERN IRELAND, 2-UNITED STATES OF AMERICA, 1009-UNITED STATES MINOR OUTLYING ISLANDS, 598-URUGUAY, 998-UZBEKISTAN, 678-VANUATU, 58-VENEZUELA (BOLIVARIAN REPUBLIC OF), 84-VIET NAM, 1284-VIRGIN ISLANDS (BRITISH), 1340-VIRGIN ISLANDS (U.S.), 681-WALLIS AND FUTUNA, 1013-WESTERN SAHARA, 260-ZAMBIA, 9999-OTHERS

**Cells `P388:Q388` (+others)** — 4 values:

(Select), Yes, No, Not Applicable

**Cells `J391:J392` (+others)** — 4 values:

(Select), 2023-24, 2024-25, 2025-26

**Cells `H478:H485` (+others)** — 11 values:

(Select), 54, 54B, 54D, 54EC, 54EE, 54F, 54G, 54GA, 54GB, 115F

**Cells `M408:M409` (+others)** — 3 values:

(Select), Yes, No

**Cells `J408:J409` (+others)** — 248 values:

(Select), 93-AFGHANISTAN, 1001-ALAND ISLANDS, 355-ALBANIA, 213-ALGERIA, 684-AMERICAN SAMOA, 376-ANDORRA, 244-ANGOLA, 1264-ANGUILLA, 1010-ANTARCTICA, 1268-ANTIGUA AND BARBUDA, 54-ARGENTINA, 374-ARMENIA, 297-ARUBA, 61-AUSTRALIA, 43-AUSTRIA, 994-AZERBAIJAN, 1242-BAHAMAS, 973-BAHRAIN, 880-BANGLADESH, 1246-BARBADOS, 375-BELARUS, 32-BELGIUM, 501-BELIZE, 229-BENIN, 1441-BERMUDA, 975-BHUTAN, 591-BOLIVIA (PLURINATIONAL STATE OF), 1002-BONAIRE, SINT EUSTATIUS AND SABA, 387-BOSNIA AND HERZEGOVINA, 267-BOTSWANA, 1003-BOUVET ISLAND, 55-BRAZIL, 1014-BRITISH INDIAN OCEAN TERRITORY, 673-BRUNEI DARUSSALAM, 359-BULGARIA, 226-BURKINA FASO, 257-BURUNDI, 238-CABO VERDE, 855-CAMBODIA, 237-CAMEROON, 1-CANADA, 1345-CAYMAN ISLANDS, 236-CENTRAL AFRICAN REPUBLIC, 235-CHAD, 56-CHILE, 86-CHINA, 9-CHRISTMAS ISLAND, 672-COCOS (KEELING) ISLANDS, 57-COLOMBIA, 270-COMOROS, 242-CONGO, 243-CONGO (DEMOCRATIC REPUBLIC OF THE), 682-COOK ISLANDS, 506-COSTA RICA, 225-COTE DIVOIRE, 385-CROATIA, 53-CUBA, 1015-CURACAO, 357-CYPRUS, 420-CZECHIA, 45-DENMARK, 253-DJIBOUTI, 1767-DOMINICA, 1809-DOMINICAN REPUBLIC, 593-ECUADOR, 20-EGYPT, 503-EL SALVADOR, 240-EQUATORIAL GUINEA, 291-ERITREA, 372-ESTONIA, 251-ETHIOPIA, 500-FALKLAND ISLANDS (MALVINAS), 298-FAROE ISLANDS, 679-FIJI, 358-FINLAND, 33-FRANCE, 594-FRENCH GUIANA, 689-FRENCH POLYNESIA, 1004-FRENCH SOUTHERN TERRITORIES, 241-GABON, 220-GAMBIA, 995-GEORGIA, 49-GERMANY, 233-GHANA, 350-GIBRALTAR, 30-GREECE, 299-GREENLAND, 1473-GRENADA, 590-GUADELOUPE, 1671-GUAM, 502-GUATEMALA, 1481-GUERNSEY, 224-GUINEA, 245-GUINEA-BISSAU, 592-GUYANA, 509-HAITI, 1005-HEARD ISLAND AND MCDONALD ISLANDS, 6-HOLY SEE, 504-HONDURAS, 852-HONG KONG, 36-HUNGARY, 354-ICELAND, 62-INDONESIA, 98-IRAN (ISLAMIC REPUBLIC OF), 964-IRAQ, 353-IRELAND, 1624-ISLE OF MAN, 972-ISRAEL, 5-ITALY, 1876-JAMAICA, 81-JAPAN, 1534-JERSEY, 962-JORDAN, 7-KAZAKHSTAN, 254-KENYA, 686-KIRIBATI, 850-KOREA (DEMOCRATIC PEOPLES REPUBLIC OF), 82-KOREA (REPUBLIC OF), 965-KUWAIT, 996-KYRGYZSTAN, 856-LAO PEOPLES DEMOCRATIC REPUBLIC, 371-LATVIA, 961-LEBANON, 266-LESOTHO, 231-LIBERIA, 218-LIBYA, 423-LIECHTENSTEIN, 370-LITHUANIA, 352-LUXEMBOURG, 853-MACAO, 389-MACEDONIA (THE FORMER YUGOSLAV REPUBLIC OF), 261-MADAGASCAR, 265-MALAWI, 60-MALAYSIA, 960-MALDIVES, 223-MALI, 356-MALTA, 692-MARSHALL ISLANDS, 596-MARTINIQUE, 222-MAURITANIA, 230-MAURITIUS, 269-MAYOTTE, 52-MEXICO, 691-MICRONESIA (FEDERATED STATES OF), 373-MOLDOVA (REPUBLIC OF), 377-MONACO, 976-MONGOLIA, 382-MONTENEGRO, 1664-MONTSERRAT, 212-MOROCCO, 258-MOZAMBIQUE, 95-MYANMAR, 264-NAMIBIA, 674-NAURU, 977-NEPAL, 31-NETHERLANDS, 687-NEW CALEDONIA, 64-NEW ZEALAND, 505-NICARAGUA, 227-NIGER, 234-NIGERIA, 683-NIUE, 15-NORFOLK ISLAND, 1670-NORTHERN MARIANA ISLANDS, 47-NORWAY, 968-OMAN, 92-PAKISTAN, 680-PALAU, 970-PALESTINE, STATE OF, 507-PANAMA, 675-PAPUA NEW GUINEA, 595-PARAGUAY, 51-PERU, 63-PHILIPPINES, 1011-PITCAIRN, 48-POLAND, 14-PORTUGAL, 1787-PUERTO RICO, 974-QATAR, 262-REUNION, 40-ROMANIA, 8-RUSSIAN FEDERATION, 250-RWANDA, 1006-SAINT BARTHELEMY, 290-SAINT HELENA, ASCENSION AND TRISTAN DA CUNHA, 1869-SAINT KITTS AND NEVIS, 1758-SAINT LUCIA, 1007-SAINT MARTIN (FRENCH PART), 508-SAINT PIERRE AND MIQUELON, 1784-SAINT VINCENT AND THE GRENADINES, 685-SAMOA, 378-SAN MARINO, 239-SAO TOME AND PRINCIPE, 966-SAUDI ARABIA, 221-SENEGAL, 381-SERBIA, 248-SEYCHELLES, 232-SIERRA LEONE, 65-SINGAPORE, 1721-SINT MAARTEN (DUTCH PART), 421-SLOVAKIA, 386-SLOVENIA, 677-SOLOMON ISLANDS, 252-SOMALIA, 28-SOUTH AFRICA, 1008-SOUTH GEORGIA AND THE SOUTH SANDWICH ISLANDS, 211-SOUTH SUDAN, 35-SPAIN, 94-SRI LANKA, 249-SUDAN, 597-SURINAME, 1012-SVALBARD AND JAN MAYEN, 268-SWAZILAND, 46-SWEDEN, 41-SWITZERLAND, 963-SYRIAN ARAB REPUBLIC, 886-TAIWAN, 992-TAJIKISTAN, 255-TANZANIA, UNITED REPUBLIC OF, 66-THAILAND, 670-TIMOR-LESTE(EAST TIMOR), 228-TOGO, 690-TOKELAU, 676-TONGA, 1868-TRINIDAD AND TOBAGO, 216-TUNISIA, 90-TURKEY, 993-TURKMENISTAN, 1649-TURKS AND CAICOS ISLANDS, 688-TUVALU, 256-UGANDA, 380-UKRAINE, 971-UNITED ARAB EMIRATES, 44-UNITED KINGDOM OF GREAT BRITAIN AND NORTHERN IRELAND, 2-UNITED STATES OF AMERICA, 1009-UNITED STATES MINOR OUTLYING ISLANDS, 598-URUGUAY, 998-UZBEKISTAN, 678-VANUATU, 58-VENEZUELA (BOLIVARIAN REPUBLIC OF), 84-VIET NAM, 1284-VIRGIN ISLANDS (BRITISH), 1340-VIRGIN ISLANDS (U.S.), 681-WALLIS AND FUTUNA, 1013-WESTERN SAHARA, 260-ZAMBIA, 9999-OTHERS

**Cells `H391:H392` (+others)** — 4 values:

(Select), 2022-23, 2023-24, 2024-25

**Cells `P179:P181` (+others)** — 39 values:

(Select), 01-ANDAMAN AND NICOBAR ISLANDS, 02-ANDHRA PRADESH, 03-ARUNACHAL PRADESH, 04-ASSAM, 05-BIHAR, 06-CHANDIGARH, 07-Dadra Nagar and Haveli, 08-Daman and Diu, 09-DELHI, 10-GOA, 11-GUJARAT, 12-HARYANA, 13-HIMACHAL PRADESH, 14-JAMMU AND KASHMIR, 15-KARNATAKA, 16-KERALA, 17-LAKHSWADEEP, 18-MADHYA PRADESH, 19-MAHARASHTRA, 20-MANIPUR, 21-MEGHALAYA, 22-MIZORAM, 23-NAGALAND, 24-ODISHA, 25-PUDUCHERRY, 26-PUNJAB, 27-RAJASTHAN, 28-SIKKIM, 29-TAMIL NADU, 30-TRIPURA, 31-UTTAR PRADESH, 32-WEST BENGAL, 33-CHHATTISGARH, 34-UTTARAKHAND, 35-JHARKHAND, 36-TELANGANA, 37-LADAKH, 99-Foreign

**Cells `P24:P26` (+others)** — 39 values:

(Select), 01-ANDAMAN AND NICOBAR ISLANDS, 02-ANDHRA PRADESH, 03-ARUNACHAL PRADESH, 04-ASSAM, 05-BIHAR, 06-CHANDIGARH, 07-Dadra Nagar and Haveli, 08-Daman and Diu, 09-DELHI, 10-GOA, 11-GUJARAT, 12-HARYANA, 13-HIMACHAL PRADESH, 14-JAMMU AND KASHMIR, 15-KARNATAKA, 16-KERALA, 17-LAKHSWADEEP, 18-MADHYA PRADESH, 19-MAHARASHTRA, 20-MANIPUR, 21-MEGHALAYA, 22-MIZORAM, 23-NAGALAND, 24-ODISHA, 25-PUDUCHERRY, 26-PUNJAB, 27-RAJASTHAN, 28-SIKKIM, 29-TAMIL NADU, 30-TRIPURA, 31-UTTAR PRADESH, 32-WEST BENGAL, 33-CHHATTISGARH, 34-UTTARAKHAND, 35-JHARKHAND, 36-TELANGANA, 37-LADAKH, 99-Foreign

**Cells `R24:R26` (+others)** — 251 values:

(Select), 93-AFGHANISTAN, 1001-ALAND ISLANDS, 355-ALBANIA, 213-ALGERIA, 684-AMERICAN SAMOA, 376-ANDORRA, 244-ANGOLA, 1264-ANGUILLA, 1010-ANTARCTICA, 1268-ANTIGUA AND BARBUDA, 54-ARGENTINA, 374-ARMENIA, 297-ARUBA, 61-AUSTRALIA, 43-AUSTRIA, 994-AZERBAIJAN, 1242-BAHAMAS, 973-BAHRAIN, 880-BANGLADESH, 1246-BARBADOS, 375-BELARUS, 32-BELGIUM, 501-BELIZE, 229-BENIN, 1441-BERMUDA, 975-BHUTAN, 591-BOLIVIA (PLURINATIONAL STATE OF), 1002-BONAIRE, SINT EUSTATIUS AND SABA, 387-BOSNIA AND HERZEGOVINA, 267-BOTSWANA, 1003-BOUVET ISLAND, 55-BRAZIL, 1014-BRITISH INDIAN OCEAN TERRITORY, 673-BRUNEI DARUSSALAM, 359-BULGARIA, 226-BURKINA FASO, 257-BURUNDI, 238-CABO VERDE, 855-CAMBODIA, 237-CAMEROON, 1-CANADA, 1345-CAYMAN ISLANDS, 236-CENTRAL AFRICAN REPUBLIC, 235-CHAD, 56-CHILE, 86-CHINA, 9-CHRISTMAS ISLAND, 672-COCOS (KEELING) ISLANDS, 57-COLOMBIA, 270-COMOROS, 242-CONGO, 243-CONGO (DEMOCRATIC REPUBLIC OF THE), 682-COOK ISLANDS, 506-COSTA RICA, 225-COTE DIVOIRE, 385-CROATIA, 53-CUBA, 1015-CURACAO, 357-CYPRUS, 420-CZECHIA, 45-DENMARK, 253-DJIBOUTI, 1767-DOMINICA, 1809-DOMINICAN REPUBLIC, 593-ECUADOR, 20-EGYPT, 503-EL SALVADOR, 240-EQUATORIAL GUINEA, 291-ERITREA, 372-ESTONIA, 251-ETHIOPIA, 500-FALKLAND ISLANDS (MALVINAS), 298-FAROE ISLANDS, 679-FIJI, 358-FINLAND, 33-FRANCE, 594-FRENCH GUIANA, 689-FRENCH POLYNESIA, 1004-FRENCH SOUTHERN TERRITORIES, 241-GABON, 220-GAMBIA, 995-GEORGIA, 49-GERMANY, 233-GHANA, 350-GIBRALTAR, 30-GREECE, 299-GREENLAND, 1473-GRENADA, 590-GUADELOUPE, 1671-GUAM, 502-GUATEMALA, 1481-GUERNSEY, 224-GUINEA, 245-GUINEA-BISSAU, 592-GUYANA, 509-HAITI, 1005-HEARD ISLAND AND MCDONALD ISLANDS, 6-HOLY SEE, 504-HONDURAS, 852-HONG KONG, 36-HUNGARY, 354-ICELAND, 91-INDIA, 62-INDONESIA, 98-IRAN (ISLAMIC REPUBLIC OF), 964-IRAQ, 353-IRELAND, 1624-ISLE OF MAN, 972-ISRAEL, 5-ITALY, 1876-JAMAICA, 81-JAPAN, 1534-JERSEY, 962-JORDAN, 7-KAZAKHSTAN, 254-KENYA, 686-KIRIBATI, 850-KOREA (DEMOCRATIC PEOPLES REPUBLIC OF), 82-KOREA (REPUBLIC OF), 965-KUWAIT, 996-KYRGYZSTAN, 856-LAO PEOPLES DEMOCRATIC REPUBLIC, 371-LATVIA, 961-LEBANON, 266-LESOTHO, 231-LIBERIA, 218-LIBYA, 423-LIECHTENSTEIN, 370-LITHUANIA, 352-LUXEMBOURG, 853-MACAO, 389-MACEDONIA (THE FORMER YUGOSLAV REPUBLIC OF), 261-MADAGASCAR, 265-MALAWI, 60-MALAYSIA, 960-MALDIVES, 223-MALI, 356-MALTA, 692-MARSHALL ISLANDS, 596-MARTINIQUE, 222-MAURITANIA, 230-MAURITIUS, 269-MAYOTTE, 52-MEXICO, 691-MICRONESIA (FEDERATED STATES OF), 373-MOLDOVA (REPUBLIC OF), 377-MONACO, 976-MONGOLIA, 382-MONTENEGRO, 1664-MONTSERRAT, 212-MOROCCO, 258-MOZAMBIQUE, 95-MYANMAR, 264-NAMIBIA, 674-NAURU, 977-NEPAL, 31-NETHERLANDS, 687-NEW CALEDONIA, 64-NEW ZEALAND, 505-NICARAGUA, 227-NIGER, 234-NIGERIA, 683-NIUE, 15-NORFOLK ISLAND, 1670-NORTHERN MARIANA ISLANDS, 47-NORWAY, 968-OMAN, 92-PAKISTAN, 680-PALAU, 970-PALESTINE, STATE OF, 507-PANAMA, 675-PAPUA NEW GUINEA, 595-PARAGUAY, 51-PERU, 63-PHILIPPINES, 1011-PITCAIRN, 48-POLAND, 14-PORTUGAL, 1787-PUERTO RICO, 974-QATAR, 262-REUNION, 40-ROMANIA, 8-RUSSIAN FEDERATION, 250-RWANDA, 1006-SAINT BARTHELEMY, 290-SAINT HELENA, ASCENSION AND TRISTAN DA CUNHA, 1869-SAINT KITTS AND NEVIS, 1758-SAINT LUCIA, 1007-SAINT MARTIN (FRENCH PART), 508-SAINT PIERRE AND MIQUELON, 1784-SAINT VINCENT AND THE GRENADINES, 685-SAMOA, 378-SAN MARINO, 239-SAO TOME AND PRINCIPE, 966-SAUDI ARABIA, 221-SENEGAL, 381-SERBIA, 248-SEYCHELLES, 232-SIERRA LEONE, 65-SINGAPORE, 1721-SINT MAARTEN (DUTCH PART), 421-SLOVAKIA, 386-SLOVENIA, 677-SOLOMON ISLANDS, 252-SOMALIA, 28-SOUTH AFRICA, 1008-SOUTH GEORGIA AND THE SOUTH SANDWICH ISLANDS, 211-SOUTH SUDAN, 35-SPAIN, 94-SRI LANKA, 249-SUDAN, 597-SURINAME, 1012-SVALBARD AND JAN MAYEN, 268-SWAZILAND, 46-SWEDEN, 41-SWITZERLAND, 963-SYRIAN ARAB REPUBLIC, 886-TAIWAN, 992-TAJIKISTAN, 255-TANZANIA, UNITED REPUBLIC OF, 66-THAILAND, 670-TIMOR-LESTE(EAST TIMOR), 228-TOGO, 690-TOKELAU, 676-TONGA, 1868-TRINIDAD AND TOBAGO, 216-TUNISIA, 90-TURKEY, 993-TURKMENISTAN, 1649-TURKS AND CAICOS ISLANDS, 688-TUVALU, 256-UGANDA, 380-UKRAINE, 971-UNITED ARAB EMIRATES, 44-UNITED KINGDOM OF GREAT BRITAIN AND NORTHERN IRELAND, 2-UNITED STATES OF AMERICA, 1009-UNITED STATES MINOR OUTLYING ISLANDS, 598-URUGUAY, 998-UZBEKISTAN, 678-VANUATU, 58-VENEZUELA (BOLIVARIAN REPUBLIC OF), 84-VIET NAM, 1284-VIRGIN ISLANDS (BRITISH), 1340-VIRGIN ISLANDS (U.S.), 681-WALLIS AND FUTUNA, 967-YEMEN, 263-ZIMBABWE, 260-ZAMBIA, 1013-WESTERN SAHARA, 9999-OTHERS

**Cells `R179:R181` (+others)** — 251 values:

(Select), 93-AFGHANISTAN, 1001-ALAND ISLANDS, 355-ALBANIA, 213-ALGERIA, 684-AMERICAN SAMOA, 376-ANDORRA, 244-ANGOLA, 1264-ANGUILLA, 1010-ANTARCTICA, 1268-ANTIGUA AND BARBUDA, 54-ARGENTINA, 374-ARMENIA, 297-ARUBA, 61-AUSTRALIA, 43-AUSTRIA, 994-AZERBAIJAN, 1242-BAHAMAS, 973-BAHRAIN, 880-BANGLADESH, 1246-BARBADOS, 375-BELARUS, 32-BELGIUM, 501-BELIZE, 229-BENIN, 1441-BERMUDA, 975-BHUTAN, 591-BOLIVIA (PLURINATIONAL STATE OF), 1002-BONAIRE, SINT EUSTATIUS AND SABA, 387-BOSNIA AND HERZEGOVINA, 267-BOTSWANA, 1003-BOUVET ISLAND, 55-BRAZIL, 1014-BRITISH INDIAN OCEAN TERRITORY, 673-BRUNEI DARUSSALAM, 359-BULGARIA, 226-BURKINA FASO, 257-BURUNDI, 238-CABO VERDE, 855-CAMBODIA, 237-CAMEROON, 1-CANADA, 1345-CAYMAN ISLANDS, 236-CENTRAL AFRICAN REPUBLIC, 235-CHAD, 56-CHILE, 86-CHINA, 9-CHRISTMAS ISLAND, 672-COCOS (KEELING) ISLANDS, 57-COLOMBIA, 270-COMOROS, 242-CONGO, 243-CONGO (DEMOCRATIC REPUBLIC OF THE), 682-COOK ISLANDS, 506-COSTA RICA, 225-COTE DIVOIRE, 385-CROATIA, 53-CUBA, 1015-CURACAO, 357-CYPRUS, 420-CZECHIA, 45-DENMARK, 253-DJIBOUTI, 1767-DOMINICA, 1809-DOMINICAN REPUBLIC, 593-ECUADOR, 20-EGYPT, 503-EL SALVADOR, 240-EQUATORIAL GUINEA, 291-ERITREA, 372-ESTONIA, 251-ETHIOPIA, 500-FALKLAND ISLANDS (MALVINAS), 298-FAROE ISLANDS, 679-FIJI, 358-FINLAND, 33-FRANCE, 594-FRENCH GUIANA, 689-FRENCH POLYNESIA, 1004-FRENCH SOUTHERN TERRITORIES, 241-GABON, 220-GAMBIA, 995-GEORGIA, 49-GERMANY, 233-GHANA, 350-GIBRALTAR, 30-GREECE, 299-GREENLAND, 1473-GRENADA, 590-GUADELOUPE, 1671-GUAM, 502-GUATEMALA, 1481-GUERNSEY, 224-GUINEA, 245-GUINEA-BISSAU, 592-GUYANA, 509-HAITI, 1005-HEARD ISLAND AND MCDONALD ISLANDS, 6-HOLY SEE, 504-HONDURAS, 852-HONG KONG, 36-HUNGARY, 354-ICELAND, 91-INDIA, 62-INDONESIA, 98-IRAN (ISLAMIC REPUBLIC OF), 964-IRAQ, 353-IRELAND, 1624-ISLE OF MAN, 972-ISRAEL, 5-ITALY, 1876-JAMAICA, 81-JAPAN, 1534-JERSEY, 962-JORDAN, 7-KAZAKHSTAN, 254-KENYA, 686-KIRIBATI, 850-KOREA (DEMOCRATIC PEOPLES REPUBLIC OF), 82-KOREA (REPUBLIC OF), 965-KUWAIT, 996-KYRGYZSTAN, 856-LAO PEOPLES DEMOCRATIC REPUBLIC, 371-LATVIA, 961-LEBANON, 266-LESOTHO, 231-LIBERIA, 218-LIBYA, 423-LIECHTENSTEIN, 370-LITHUANIA, 352-LUXEMBOURG, 853-MACAO, 389-MACEDONIA (THE FORMER YUGOSLAV REPUBLIC OF), 261-MADAGASCAR, 265-MALAWI, 60-MALAYSIA, 960-MALDIVES, 223-MALI, 356-MALTA, 692-MARSHALL ISLANDS, 596-MARTINIQUE, 222-MAURITANIA, 230-MAURITIUS, 269-MAYOTTE, 52-MEXICO, 691-MICRONESIA (FEDERATED STATES OF), 373-MOLDOVA (REPUBLIC OF), 377-MONACO, 976-MONGOLIA, 382-MONTENEGRO, 1664-MONTSERRAT, 212-MOROCCO, 258-MOZAMBIQUE, 95-MYANMAR, 264-NAMIBIA, 674-NAURU, 977-NEPAL, 31-NETHERLANDS, 687-NEW CALEDONIA, 64-NEW ZEALAND, 505-NICARAGUA, 227-NIGER, 234-NIGERIA, 683-NIUE, 15-NORFOLK ISLAND, 1670-NORTHERN MARIANA ISLANDS, 47-NORWAY, 968-OMAN, 92-PAKISTAN, 680-PALAU, 970-PALESTINE, STATE OF, 507-PANAMA, 675-PAPUA NEW GUINEA, 595-PARAGUAY, 51-PERU, 63-PHILIPPINES, 1011-PITCAIRN, 48-POLAND, 14-PORTUGAL, 1787-PUERTO RICO, 974-QATAR, 262-REUNION, 40-ROMANIA, 8-RUSSIAN FEDERATION, 250-RWANDA, 1006-SAINT BARTHELEMY, 290-SAINT HELENA, ASCENSION AND TRISTAN DA CUNHA, 1869-SAINT KITTS AND NEVIS, 1758-SAINT LUCIA, 1007-SAINT MARTIN (FRENCH PART), 508-SAINT PIERRE AND MIQUELON, 1784-SAINT VINCENT AND THE GRENADINES, 685-SAMOA, 378-SAN MARINO, 239-SAO TOME AND PRINCIPE, 966-SAUDI ARABIA, 221-SENEGAL, 381-SERBIA, 248-SEYCHELLES, 232-SIERRA LEONE, 65-SINGAPORE, 1721-SINT MAARTEN (DUTCH PART), 421-SLOVAKIA, 386-SLOVENIA, 677-SOLOMON ISLANDS, 252-SOMALIA, 28-SOUTH AFRICA, 1008-SOUTH GEORGIA AND THE SOUTH SANDWICH ISLANDS, 211-SOUTH SUDAN, 35-SPAIN, 94-SRI LANKA, 249-SUDAN, 597-SURINAME, 1012-SVALBARD AND JAN MAYEN, 268-SWAZILAND, 46-SWEDEN, 41-SWITZERLAND, 963-SYRIAN ARAB REPUBLIC, 886-TAIWAN, 992-TAJIKISTAN, 255-TANZANIA, UNITED REPUBLIC OF, 66-THAILAND, 670-TIMOR-LESTE(EAST TIMOR), 228-TOGO, 690-TOKELAU, 676-TONGA, 1868-TRINIDAD AND TOBAGO, 216-TUNISIA, 90-TURKEY, 993-TURKMENISTAN, 1649-TURKS AND CAICOS ISLANDS, 688-TUVALU, 256-UGANDA, 380-UKRAINE, 971-UNITED ARAB EMIRATES, 44-UNITED KINGDOM OF GREAT BRITAIN AND NORTHERN IRELAND, 2-UNITED STATES OF AMERICA, 1009-UNITED STATES MINOR OUTLYING ISLANDS, 598-URUGUAY, 998-UZBEKISTAN, 678-VANUATU, 58-VENEZUELA (BOLIVARIAN REPUBLIC OF), 84-VIET NAM, 1284-VIRGIN ISLANDS (BRITISH), 1340-VIRGIN ISLANDS (U.S.), 681-WALLIS AND FUTUNA, 967-YEMEN, 263-ZIMBABWE, 260-ZAMBIA, 1013-WESTERN SAHARA, 9999-OTHERS

**Cells `J153:K154` (+others)** — 25 values:

2001-02, 2002-03, 2003-04, 2004-05, 2005-06, 2006-07, 2007-08, 2008-09, 2009-10, 2010-11, 2011-12, 2012-13, 2013-14, 2014-15, 2015-16, 2016-17, 2017-18, 2018-19, 2019-20, 2020-21, 2021-22, 2022-23, 2023-24, 2024-25, 2025-26

**Cells `H137:K138` (+others)** — 4 values:

(Select), i. Loss from buy back of 'shares taxable at 20%', ii. Loss from buy back of 'shares taxable at 30%', iii. Loss from buy back of 'shares taxable at applicable rate'

**Cells `H422:J423` (+others)** — 2 values:

(Select), Loss from buy back of 'shares taxable at 12.5%'

**Cells `J101` (+others)** — 5 values:

(Select), 2022-23, 2023-24, 2024-25, 2025-26

**Cells `I392` (+others)** — 7 values:

(Select), 54, 54B, 54D, 54F, 54G, 54GA

**Cells `I391` (+others)** — 6 values:

(Select), 54, 54D, 54F, 54G, 54GA

**Cells `J114:J116` (+others)** — 248 values:

(Select), 93-AFGHANISTAN, 1001-ALAND ISLANDS, 355-ALBANIA, 213-ALGERIA, 684-AMERICAN SAMOA, 376-ANDORRA, 244-ANGOLA, 1264-ANGUILLA, 1010-ANTARCTICA, 1268-ANTIGUA AND BARBUDA, 54-ARGENTINA, 374-ARMENIA, 297-ARUBA, 61-AUSTRALIA, 43-AUSTRIA, 994-AZERBAIJAN, 1242-BAHAMAS, 973-BAHRAIN, 880-BANGLADESH, 1246-BARBADOS, 375-BELARUS, 32-BELGIUM, 501-BELIZE, 229-BENIN, 1441-BERMUDA, 975-BHUTAN, 591-BOLIVIA (PLURINATIONAL STATE OF), 1002-BONAIRE, SINT EUSTATIUS AND SABA, 387-BOSNIA AND HERZEGOVINA, 267-BOTSWANA, 1003-BOUVET ISLAND, 55-BRAZIL, 1014-BRITISH INDIAN OCEAN TERRITORY, 673-BRUNEI DARUSSALAM, 359-BULGARIA, 226-BURKINA FASO, 257-BURUNDI, 238-CABO VERDE, 855-CAMBODIA, 237-CAMEROON, 1-CANADA, 1345-CAYMAN ISLANDS, 236-CENTRAL AFRICAN REPUBLIC, 235-CHAD, 56-CHILE, 86-CHINA, 9-CHRISTMAS ISLAND, 672-COCOS (KEELING) ISLANDS, 57-COLOMBIA, 270-COMOROS, 242-CONGO, 243-CONGO (DEMOCRATIC REPUBLIC OF THE), 682-COOK ISLANDS, 506-COSTA RICA, 225-COTE DIVOIRE, 385-CROATIA, 53-CUBA, 1015-CURACAO, 357-CYPRUS, 420-CZECHIA, 45-DENMARK, 253-DJIBOUTI, 1767-DOMINICA, 1809-DOMINICAN REPUBLIC, 593-ECUADOR, 20-EGYPT, 503-EL SALVADOR, 240-EQUATORIAL GUINEA, 291-ERITREA, 372-ESTONIA, 251-ETHIOPIA, 500-FALKLAND ISLANDS (MALVINAS), 298-FAROE ISLANDS, 679-FIJI, 358-FINLAND, 33-FRANCE, 594-FRENCH GUIANA, 689-FRENCH POLYNESIA, 1004-FRENCH SOUTHERN TERRITORIES, 241-GABON, 220-GAMBIA, 995-GEORGIA, 49-GERMANY, 233-GHANA, 350-GIBRALTAR, 30-GREECE, 299-GREENLAND, 1473-GRENADA, 590-GUADELOUPE, 1671-GUAM, 502-GUATEMALA, 1481-GUERNSEY, 224-GUINEA, 245-GUINEA-BISSAU, 592-GUYANA, 509-HAITI, 1005-HEARD ISLAND AND MCDONALD ISLANDS, 6-HOLY SEE, 504-HONDURAS, 852-HONG KONG, 36-HUNGARY, 354-ICELAND, 62-INDONESIA, 98-IRAN (ISLAMIC REPUBLIC OF), 964-IRAQ, 353-IRELAND, 1624-ISLE OF MAN, 972-ISRAEL, 5-ITALY, 1876-JAMAICA, 81-JAPAN, 1534-JERSEY, 962-JORDAN, 7-KAZAKHSTAN, 254-KENYA, 686-KIRIBATI, 850-KOREA (DEMOCRATIC PEOPLES REPUBLIC OF), 82-KOREA (REPUBLIC OF), 965-KUWAIT, 996-KYRGYZSTAN, 856-LAO PEOPLES DEMOCRATIC REPUBLIC, 371-LATVIA, 961-LEBANON, 266-LESOTHO, 231-LIBERIA, 218-LIBYA, 423-LIECHTENSTEIN, 370-LITHUANIA, 352-LUXEMBOURG, 853-MACAO, 389-MACEDONIA (THE FORMER YUGOSLAV REPUBLIC OF), 261-MADAGASCAR, 265-MALAWI, 60-MALAYSIA, 960-MALDIVES, 223-MALI, 356-MALTA, 692-MARSHALL ISLANDS, 596-MARTINIQUE, 222-MAURITANIA, 230-MAURITIUS, 269-MAYOTTE, 52-MEXICO, 691-MICRONESIA (FEDERATED STATES OF), 373-MOLDOVA (REPUBLIC OF), 377-MONACO, 976-MONGOLIA, 382-MONTENEGRO, 1664-MONTSERRAT, 212-MOROCCO, 258-MOZAMBIQUE, 95-MYANMAR, 264-NAMIBIA, 674-NAURU, 977-NEPAL, 31-NETHERLANDS, 687-NEW CALEDONIA, 64-NEW ZEALAND, 505-NICARAGUA, 227-NIGER, 234-NIGERIA, 683-NIUE, 15-NORFOLK ISLAND, 1670-NORTHERN MARIANA ISLANDS, 47-NORWAY, 968-OMAN, 92-PAKISTAN, 680-PALAU, 970-PALESTINE, STATE OF, 507-PANAMA, 675-PAPUA NEW GUINEA, 595-PARAGUAY, 51-PERU, 63-PHILIPPINES, 1011-PITCAIRN, 48-POLAND, 14-PORTUGAL, 1787-PUERTO RICO, 974-QATAR, 262-REUNION, 40-ROMANIA, 8-RUSSIAN FEDERATION, 250-RWANDA, 1006-SAINT BARTHELEMY, 290-SAINT HELENA, ASCENSION AND TRISTAN DA CUNHA, 1869-SAINT KITTS AND NEVIS, 1758-SAINT LUCIA, 1007-SAINT MARTIN (FRENCH PART), 508-SAINT PIERRE AND MIQUELON, 1784-SAINT VINCENT AND THE GRENADINES, 685-SAMOA, 378-SAN MARINO, 239-SAO TOME AND PRINCIPE, 966-SAUDI ARABIA, 221-SENEGAL, 381-SERBIA, 248-SEYCHELLES, 232-SIERRA LEONE, 65-SINGAPORE, 1721-SINT MAARTEN (DUTCH PART), 421-SLOVAKIA, 386-SLOVENIA, 677-SOLOMON ISLANDS, 252-SOMALIA, 28-SOUTH AFRICA, 1008-SOUTH GEORGIA AND THE SOUTH SANDWICH ISLANDS, 211-SOUTH SUDAN, 35-SPAIN, 94-SRI LANKA, 249-SUDAN, 597-SURINAME, 1012-SVALBARD AND JAN MAYEN, 268-SWAZILAND, 46-SWEDEN, 41-SWITZERLAND, 963-SYRIAN ARAB REPUBLIC, 886-TAIWAN, 992-TAJIKISTAN, 255-TANZANIA, UNITED REPUBLIC OF, 66-THAILAND, 670-TIMOR-LESTE(EAST TIMOR), 228-TOGO, 690-TOKELAU, 676-TONGA, 1868-TRINIDAD AND TOBAGO, 216-TUNISIA, 90-TURKEY, 993-TURKMENISTAN, 1649-TURKS AND CAICOS ISLANDS, 688-TUVALU, 256-UGANDA, 380-UKRAINE, 971-UNITED ARAB EMIRATES, 44-UNITED KINGDOM OF GREAT BRITAIN AND NORTHERN IRELAND, 2-UNITED STATES OF AMERICA, 1009-UNITED STATES MINOR OUTLYING ISLANDS, 598-URUGUAY, 998-UZBEKISTAN, 678-VANUATU, 58-VENEZUELA (BOLIVARIAN REPUBLIC OF), 84-VIET NAM, 1284-VIRGIN ISLANDS (BRITISH), 1340-VIRGIN ISLANDS (U.S.), 681-WALLIS AND FUTUNA, 1013-WESTERN SAHARA, 260-ZAMBIA, 9999-OTHERS

**Cells `M114:M116` (+others)** — 3 values:

(Select), Yes, No

**Cells `I101` (+others)** — 3 values:

(Select), 54G, 54GA

---

## 5 · What repeats and what is one figure

**Arrays (repeat — one entry per transaction/row):** CapitalLossBuyBackSharesDtls, CostOfImprovementsDtls, DeducClaimDtlsUs115F, DeducClaimDtlsUs54, DeducClaimDtlsUs54B, DeducClaimDtlsUs54D, DeducClaimDtlsUs54EC, DeducClaimDtlsUs54F, DeducClaimDtlsUs54G, DeducClaimDtlsUs54GA, EquityMFonSTT, ExemptionOrDednUs54Dtls, NRIDTAADtls, NRIOnSec112and115Dtls, Proviso112Applicable, SaleofLandBuildDtls, TrnsfImmblPrprtyDtls, UnutilizedCgPrvYrDtls.

**Single figures (one value each):** the computed head totals and summaries — e.g. `TotalSTCG` (A10), `TotalLTCG` (B13), `SumOfCGIncm` (C1), `IncmFromVDATrnsf` (C2), `TotScheduleCGFor23` (C3), `TotalAmtDeemedStcg`, `TotalAmtDeemedLtcg`, `PassThrIncNatureSTCG`, `PassThrIncNatureLTCG`, `TotDeductClaim`, and the set-off matrix objects under `CurrYrLosses` and the quarterly `AccruOrRecOfCG` date ranges — are each a single figure, not arrays.

The flags `UnutilizedStcgFlag`, `UnutilizedLtcgFlag` and `EditAutopoulatedDetail` are single string values.

---

## 6 · Mandatory — the required schema keys

Every schema leaf key marked required (`*`) in the block `ScheduleCGFor23`, listed verbatim beside its full path so the section-builder can bind each to its CG item.

| Required schema key | Full path | Type |
|---|---|---|
| `FullConsideration` | `ShortTermCapGainFor23.SaleofLandBuild.SaleofLandBuildDtls[].FullConsideration` | integer |
| `PropertyValuation` | `ShortTermCapGainFor23.SaleofLandBuild.SaleofLandBuildDtls[].PropertyValuation` | integer |
| `FullConsideration50C` | `ShortTermCapGainFor23.SaleofLandBuild.SaleofLandBuildDtls[].FullConsideration50C` | integer |
| `AquisitCost` | `ShortTermCapGainFor23.SaleofLandBuild.SaleofLandBuildDtls[].AquisitCost` | integer |
| `ImproveCost` | `ShortTermCapGainFor23.SaleofLandBuild.SaleofLandBuildDtls[].ImproveCost` | integer |
| `ExpOnTrans` | `ShortTermCapGainFor23.SaleofLandBuild.SaleofLandBuildDtls[].ExpOnTrans` | integer |
| `TotalDedn` | `ShortTermCapGainFor23.SaleofLandBuild.SaleofLandBuildDtls[].TotalDedn` | integer |
| `Balance` | `ShortTermCapGainFor23.SaleofLandBuild.SaleofLandBuildDtls[].Balance` | integer |
| `ExemptionSecCode` | `ShortTermCapGainFor23.SaleofLandBuild.SaleofLandBuildDtls[].ExemptionOrDednUs54.ExemptionOrDednUs54Dtls[].ExemptionSecCode` | string |
| `ExemptionAmount` | `ShortTermCapGainFor23.SaleofLandBuild.SaleofLandBuildDtls[].ExemptionOrDednUs54.ExemptionOrDednUs54Dtls[].ExemptionAmount` | integer |
| `ExemptionGrandTotal` | `ShortTermCapGainFor23.SaleofLandBuild.SaleofLandBuildDtls[].ExemptionOrDednUs54.ExemptionGrandTotal` | integer |
| `CapgainonAssets` | `ShortTermCapGainFor23.SaleofLandBuild.SaleofLandBuildDtls[].CapgainonAssets` | integer |
| `NameOfBuyer` | `ShortTermCapGainFor23.SaleofLandBuild.SaleofLandBuildDtls[].TrnsfImmblPrprty.TrnsfImmblPrprtyDtls[].NameOfBuyer` | string |
| `PercentageShare` | `ShortTermCapGainFor23.SaleofLandBuild.SaleofLandBuildDtls[].TrnsfImmblPrprty.TrnsfImmblPrprtyDtls[].PercentageShare` | number |
| `Amount` | `ShortTermCapGainFor23.SaleofLandBuild.SaleofLandBuildDtls[].TrnsfImmblPrprty.TrnsfImmblPrprtyDtls[].Amount` | integer |
| `AddressOfProperty` | `ShortTermCapGainFor23.SaleofLandBuild.SaleofLandBuildDtls[].TrnsfImmblPrprty.TrnsfImmblPrprtyDtls[].AddressOfProperty` | string |
| `StateCode` | `ShortTermCapGainFor23.SaleofLandBuild.SaleofLandBuildDtls[].TrnsfImmblPrprty.TrnsfImmblPrprtyDtls[].StateCode` | string |
| `CountryCode` | `ShortTermCapGainFor23.SaleofLandBuild.SaleofLandBuildDtls[].TrnsfImmblPrprty.TrnsfImmblPrprtyDtls[].CountryCode` | string |
| `FMV11UAEii` | `ShortTermCapGainFor23.SlumpSaleInStcg.FMV11UAEii` | integer |
| `FMV11UAEiii` | `ShortTermCapGainFor23.SlumpSaleInStcg.FMV11UAEiii` | integer |
| `NetWorthOfDivision` | `ShortTermCapGainFor23.SlumpSaleInStcg.NetWorthOfDivision` | integer |
| `MFSectionCode` | `ShortTermCapGainFor23.EquityMFonSTT[].MFSectionCode` | string |
| `BalanceCG` | `ShortTermCapGainFor23.EquityMFonSTT[].EquityMFonSTTDtls.BalanceCG` | integer |
| `LossSec94of7Or94of8` | `ShortTermCapGainFor23.EquityMFonSTT[].EquityMFonSTTDtls.LossSec94of7Or94of8` | integer |
| `NRItaxSTTPaid` | `ShortTermCapGainFor23.NRITransacSec48Dtl.NRItaxSTTPaid` | integer |
| `NRItaxSTTNotPaid` | `ShortTermCapGainFor23.NRITransacSec48Dtl.NRItaxSTTNotPaid` | integer |
| `FullValueConsdRecvUnqshr` | `ShortTermCapGainFor23.NRISecur115AD.FullValueConsdRecvUnqshr` | integer |
| `FairMrktValueUnqshr` | `ShortTermCapGainFor23.NRISecur115AD.FairMrktValueUnqshr` | integer |
| `FullValueConsdSec50CA` | `ShortTermCapGainFor23.NRISecur115AD.FullValueConsdSec50CA` | integer |
| `FullValueConsdOthUnqshr` | `ShortTermCapGainFor23.NRISecur115AD.FullValueConsdOthUnqshr` | integer |
| `DeemedStcgOnAssets` | `ShortTermCapGainFor23.SaleOnOtherAssets.DeemedStcgOnAssets` | integer |
| `PrvYrInWhichAsstTrnsfrd` | `ShortTermCapGainFor23.UnutilizedCg.UnutilizedCgPrvYrDtls[].PrvYrInWhichAsstTrnsfrd` | string |
| `SectionClmd` | `ShortTermCapGainFor23.UnutilizedCg.UnutilizedCgPrvYrDtls[].SectionClmd` | string |
| `AmtUnutilized` | `ShortTermCapGainFor23.UnutilizedCg.UnutilizedCgPrvYrDtls[].AmtUnutilized` | integer |
| `TotalAmtDeemedStcg` | `ShortTermCapGainFor23.TotalAmtDeemedStcg` | integer |
| `PassThrIncNatureSTCG` | `ShortTermCapGainFor23.PassThrIncNatureSTCG` | integer |
| `DTAAamt` | `ShortTermCapGainFor23.NRICgDTAA.NRIDTAADtls[].DTAAamt` | integer |
| `ItemNoincl` | `ShortTermCapGainFor23.NRICgDTAA.NRIDTAADtls[].ItemNoincl` | string |
| `CountryName` | `ShortTermCapGainFor23.NRICgDTAA.NRIDTAADtls[].CountryName` | string |
| `CountryCodeExcludingIndia` | `ShortTermCapGainFor23.NRICgDTAA.NRIDTAADtls[].CountryCodeExcludingIndia` | string |
| `DTAAarticle` | `ShortTermCapGainFor23.NRICgDTAA.NRIDTAADtls[].DTAAarticle` | string |
| `RateAsPerTreaty` | `ShortTermCapGainFor23.NRICgDTAA.NRIDTAADtls[].RateAsPerTreaty` | number |
| `SecITAct` | `ShortTermCapGainFor23.NRICgDTAA.NRIDTAADtls[].SecITAct` | string |
| `RateAsPerITAct` | `ShortTermCapGainFor23.NRICgDTAA.NRIDTAADtls[].RateAsPerITAct` | number |
| `TotalAmtNotTaxUsDTAAStcg` | `ShortTermCapGainFor23.TotalAmtNotTaxUsDTAAStcg` | integer |
| `TotalAmtTaxUsDTAAStcg` | `ShortTermCapGainFor23.TotalAmtTaxUsDTAAStcg` | integer |
| `TotalCapitalLossBuyBackShares` | `ShortTermCapGainFor23.CapitalLossBuyBackShares.TotalCapitalLossBuyBackShares` | integer |
| `CapitalLossBuyBackSharesDtls` | `ShortTermCapGainFor23.CapitalLossBuyBackShares.CapitalLossBuyBackSharesDtls[]` | array |
| `Rate` | `ShortTermCapGainFor23.CapitalLossBuyBackShares.CapitalLossBuyBackSharesDtls[].Rate` | string |
| `TotalSTCG` | `ShortTermCapGainFor23.TotalSTCG` | integer |
| `AquisitCostIndex` | `LongTermCapGain23.SaleofLandBuild.SaleofLandBuildDtls[].AquisitCostIndex` | integer |
| `TotalDednForEiB` | `LongTermCapGain23.SaleofLandBuild.SaleofLandBuildDtls[].TotalDednForEiB` | integer |
| `CostOfImprovementsDtls` | `LongTermCapGain23.SaleofLandBuild.SaleofLandBuildDtls[].CostOfImprovements.CostOfImprovementsDtls[]` | array |
| `slno` | `LongTermCapGain23.SaleofLandBuild.SaleofLandBuildDtls[].CostOfImprovements.CostOfImprovementsDtls[].slno` | integer |
| `ImproveDate` | `LongTermCapGain23.SaleofLandBuild.SaleofLandBuildDtls[].CostOfImprovements.CostOfImprovementsDtls[].ImproveDate` | string |
| `CostOfImpIndex` | `LongTermCapGain23.SaleofLandBuild.SaleofLandBuildDtls[].CostOfImprovements.CostOfImprovementsDtls[].CostOfImpIndex` | integer |
| `TotalImprovecost` | `LongTermCapGain23.SaleofLandBuild.SaleofLandBuildDtls[].CostOfImprovements.TotalImprovecost` | integer |
| `TotalindexImprovecost` | `LongTermCapGain23.SaleofLandBuild.SaleofLandBuildDtls[].CostOfImprovements.TotalindexImprovecost` | integer |
| `BalanceForEiB` | `LongTermCapGain23.SaleofLandBuild.SaleofLandBuildDtls[].BalanceForEiB` | integer |
| `CapgainonAssets_1ea` | `LongTermCapGain23.SaleofLandBuild.SaleofLandBuildDtls[].CapgainonAssets_1ea` | integer |
| `TaxSec1121aiiB` | `LongTermCapGain23.SaleofLandBuild.SaleofLandBuildDtls[].TaxSec1121aiiB` | integer |
| `TaxSec1121a` | `LongTermCapGain23.SaleofLandBuild.SaleofLandBuildDtls[].TaxSec1121a` | integer |
| `ExcessAmtSec1121a` | `LongTermCapGain23.SaleofLandBuild.SaleofLandBuildDtls[].ExcessAmtSec1121a` | integer |
| `SlumpBalance` | `LongTermCapGain23.SlumpSaleInLtcgDtls.SlumpSaleInLtcg.SlumpBalance` | integer |
| `Proviso112SectionCode` | `LongTermCapGain23.Proviso112Applicable[].Proviso112SectionCode` | string |
| `DeductionUs54F` | `LongTermCapGain23.Proviso112Applicable[].Proviso112Applicabledtls.DeductionUs54F` | integer |
| `LTCGWithoutBenefit` | `LongTermCapGain23.NRIProvisoSec48.LTCGWithoutBenefit` | integer |
| `SectionCode` | `LongTermCapGain23.NRIOnSec112and115.NRIOnSec112and115Dtls[].SectionCode` | string |
| `SaleonSpecAsset` | `LongTermCapGain23.NRISaleofForeignAsset.SaleonSpecAsset` | integer |
| `DednSpecAssetus115` | `LongTermCapGain23.NRISaleofForeignAsset.DednSpecAssetus115` | integer |
| `BalonSpeciAsset` | `LongTermCapGain23.NRISaleofForeignAsset.BalonSpeciAsset` | integer |
| `AmtUtilized` | `LongTermCapGain23.UnutilizedCg.UnutilizedCgPrvYrDtls[].AmtUtilized` | integer |
| `TotalAmtDeemedLtcg` | `LongTermCapGain23.TotalAmtDeemedLtcg` | integer |
| `PassThrIncNatureLTCG` | `LongTermCapGain23.PassThrIncNatureLTCG` | integer |
| `TotalAmtNotTaxUsDTAALtcg` | `LongTermCapGain23.TotalAmtNotTaxUsDTAALtcg` | integer |
| `TotalAmtTaxUsDTAALtcg` | `LongTermCapGain23.TotalAmtTaxUsDTAALtcg` | integer |
| `TotalLTCG` | `LongTermCapGain23.TotalLTCG` | integer |
| `SumOfCGIncm` | `SumOfCGIncm` | integer |
| `IncmFromVDATrnsf` | `IncmFromVDATrnsf` | integer |
| `TotScheduleCGFor23` | `TotScheduleCGFor23` | integer |
| `DateofTransfer` | `DeducClaimInfo.DeducClaimDtlsUs54[].DateofTransfer` | string |
| `AmtDeducted` | `DeducClaimInfo.DeducClaimDtlsUs54[].AmtDeducted` | integer |
| `DateofAcquisition` | `DeducClaimInfo.DeducClaimDtlsUs54D[].DateofAcquisition` | string |
| `AmtInvested` | `DeducClaimInfo.DeducClaimDtlsUs115F[].AmtInvested` | integer |
| `DateofInvestment` | `DeducClaimInfo.DeducClaimDtlsUs115F[].DateofInvestment` | string |
| `TotDeductClaim` | `DeducClaimInfo.TotDeductClaim` | integer |
| `StclSetoff20Per` | `CurrYrLosses.InLossSetOff.StclSetoff20Per` | integer |
| `StclSetoff30Per` | `CurrYrLosses.InLossSetOff.StclSetoff30Per` | integer |
| `StclSetoffAppRate` | `CurrYrLosses.InLossSetOff.StclSetoffAppRate` | integer |
| `StclSetoffDTAARate` | `CurrYrLosses.InLossSetOff.StclSetoffDTAARate` | integer |
| `LtclSetOff12_5Per` | `CurrYrLosses.InLossSetOff.LtclSetOff12_5Per` | integer |
| `LtclSetOffDTAARate` | `CurrYrLosses.InLossSetOff.LtclSetOffDTAARate` | integer |
| `CurrYearIncome` | `CurrYrLosses.InStcg20Per.CurrYearIncome` | integer |
| `CurrYrCapGain` | `CurrYrLosses.InStcg20Per.CurrYrCapGain` | integer |
| `Upto15Of6` | `AccruOrRecOfCG.ShortTermUnder20Per.DateRange.Upto15Of6` | integer |
| `Upto15Of9` | `AccruOrRecOfCG.ShortTermUnder20Per.DateRange.Upto15Of9` | integer |
| `Up16Of9To15Of12` | `AccruOrRecOfCG.ShortTermUnder20Per.DateRange.Up16Of9To15Of12` | integer |
| `Up16Of12To15Of3` | `AccruOrRecOfCG.ShortTermUnder20Per.DateRange.Up16Of12To15Of3` | integer |
| `Up16Of3To31Of3` | `AccruOrRecOfCG.ShortTermUnder20Per.DateRange.Up16Of3To31Of3` | integer |

---

## 7 · Hidden rows — not built

These rows carry the `H` flag in the utility and must **not** be presented as items. They are the non-resident / FII heads, the pre-23-July-2024 rate splits kept for backward reference ('Not using'), and internal working rows the sheet auto-populates. They stay hidden for a resident filer and are only surfaced when the corresponding non-resident head applies.

| Sheet cell | Hidden row text |
|---|---|
| r56 `F56` | For NON-RESIDENT, not being an FII- from sale of shares or debentures of an Indian company (to be co |
| r57 `F57` | a  STCG on transactions covered u/s 111A (A4ai + A4aii)  A4a |
| r58 `F58` | a  Where the before was on or after 23rd July 2024  A4ai-15% |
| r59 `F59` | a  STCG on transactions covered u/s 111A  A4a |
| r60 `F60` | b  STCG from sale of shares not covered in sl.no. 4a or sale of debentures  A4b |
| r61 `F61` | For NON-RESIDENTS- from sale of securities (other than those at A3 above) by an FII as per section 1 |
| r62 `F62` | a  i  In case securities sold include shares of a company other than quoted shares, enter the following de |
| r63 `H63` | a  Full value of consideration received/receivable in respect of unquoted shares  5aia |
| r64 `H64` | b  Fair market value of unquoted shares determined in the prescribed manner  aib |
| r65 `H65` | c  Full value of consideration in respect of unquoted shares adopted as per section 50CA for the purpos  aic |
| r66 `G66` | ii  Full value of consideration in respect of securities other than unquoted shares  5aii |
| r67 `G67` | iii  Total (ic + ii)  5aiii |
| r68 `F68` | b  Deductions under section 48 |
| r69 `G69` | i  Cost of acquisition without indexation  bi |
| r70 `G70` | ii  Cost of improvement without indexation  bii |
| r71 `G71` | iii  Expenditure wholly and exclusively in connection with transfer  biii |
| r72 `G72` | iv  Total (bi + bii + biii)  biv |
| r73 `F73` | c  Balance (5aiii – biv)  5c |
| r74 `F74` | d  Loss to be disallowed under section 94(7) or 94(8)- for example if asset bought/acquired within 3 mo  5d |
| r75 `F75` | e  Short-term capital gain on sale of securities by an FII (other than those at A3) (5c +5d)  A5e |
| r83 `F83` | a  Full value of consideration  6a |
| r92 `F92` | fi  Deduction under section 54D (Specify details in item Dbelow)  fi |
| r105 `F105` | Deemed short term capital gains on depreciable assets (6 of schedule- DCG)  A8 |
| r107 `F107` | ai  Pass Through Income/ Loss in the nature of Short Term Capital Gain, chargeable @ 15%  8ai |
| r108 `F108` | a2  Pass Through Income/ Loss in the nature of Short Term Capital Gain, chargeable @ 15% other than Sect  8a2 |
| r122 `F122` | Amount of STCG included in A1-A7 but not chargeable to tax or chargeable at special rates in India a |
| r123 `G123` | Sl.  Country name, code  Article of DTAA  Whether Tax Residency Certificate obtained?  Item no. A1 to A7 above in which included  Amount of STCG |
| r127 `G127` | III  Total amount of STCG not chargeable to tax as per DTAA  A8 |
| r128 `F128` | Amount deemed to be short term capital gains under sections 54B/54D/54G/54GA |
| r129 `F129` | i  Amount deemed to be short term capital gains under sections 54B  i |
| r130 `F130` | ii  Amount deemed to be short term capital gains under sections 54D  ii |
| r131 `F131` | iii  Amount deemed to be short term capital gains under sections 54G  iii |
| r132 `F132` | iv  Amount deemed to be short term capital gains under sections 54GA  iv |
| r133 `F133` | Total Amount deemed to be short term capital gains under sections 54B/54D/54G/54GA  A7 |
| r134 `F134` | Deemed short term capital gains on depreciable assets (6 of schedule- DCG)  A9 |
| r186 `F186` | a  Before 23rd July 2024 (sum of capital gains on all properties transferred before 23rd July 2024) |
| r187 `F187` | b  On or after 23rd July 2024 (sum of capital gains on all properties transferred on or after 23rd July |
| r197 `F197` | dii  Deduction u/s 54EE (Specify details in item D below) |
| r201 `F201` | i  Before 23rd July 2024-Not using  B2ei |
| r202 `F202` | ii  On or after 23rd July 2024  B2eii |
| r203 `F203` | For residents, from sale of unlisted bonds or unlisted debenture (other than capital indexed bonds i |
| r204 `F204` | a  Full value of consideration  3a |
| r205 `F205` | b  Deductions under section 48 |
| r206 `G206` | i  Cost of acquisition without indexation  bi |
| r207 `G207` | ii  Cost of improvement without indexation  bii |
| r208 `G208` | iii  Expenditure wholly and exclusively in connection with transfer  biii |
| r209 `G209` | iv  Total (bi + bii +biii)  biv |
| r210 `F210` | c  Balance (3a – biv)  3c |
| r211 `F211` | di  Deduction under sections 54EC (Specify details in item D below)  di |
| r212 `F212` | di  Deduction under sections 54EE (Specify details in item D below)  dii |
| r213 `F213` | d  Deduction under sections 54F(Specify details in item D below)  3d |
| r214 `F214` | d  Total Deduction u/s 54EE/54F  3d |
| r215 `F215` | e  LTCG on bonds or debenture (3c – 3d)  B3e |
| r220 `G220` | i  Cost of acquisition with indexation  bi |
| r222 `G222` | ii  Cost of improvement with indexation  bii |
| r226 `G226` | iva  Total (bia + biia + biii) (for the purpose of computing excess as per proviso section 112(1)) (appli  biva |
| r228 `F228` | di  Deduction under sections 54EC(Specify details in item D below) |
| r229 `F229` | idiii  Deduction under sections 54EE(Specify details in item D below) |
| r230 `F230` | ica  Balance (4a – biva) (for the purpose of computing excess tax as per proviso to section 112(1)) (appl  3ca |
| r232 `F232` | d  Total Deduction u/s 54EE/54F  4d |
| r234 `F234` | i  Before 23rd July 2024-Not using  B4iei |
| r235 `F235` | ii  On or after 23rd July 2024  B4ieii |
| r236 `F236` | iea  Long-term Capital Gains on assets at B4 above where transfer was before 23rd July 2024 (4ca – 4d) -N  B4iea |
| r237 `F237` | if  Tax as per 112(1)(a)(ii)(A) or 112(1)(c)(ii)(A) [LTCG at 20 % with indexation] (applicable where tra  B4if |
| r238 `F238` | ig  Tax as per 1st Proviso to section 112(1) [LTCG at 10 % without indexation] [ B4(ea)*10%]-Not using (  B4ig |
| r239 `F239` | ih  Excess amount that is required to be ignored as per 1st proviso to section 112(1) [B4(f) – B4(g)]-No  B4ih |
| r248 `F248` | di  Deduction under sections 54EC(Specify details in item D below)  di |
| r249 `F249` | dii  Deduction under sections 54EE(Specify details in item D below)  dii |
| r251 `F251` | d  Total Deduction u/s 54EE/54F  4di |
| r253 `F253` | (i)  Before 23rd July 2024-Not using  B4iiei |
| r254 `F254` | (ii)  On or after 23rd July 2024  B4iieii |
| r257 `F257` | i  Sum of column 14 where transfer was before 23rd July 2024  5ai |
| r258 `F258` | ii  Sum of column 14 where transfer was on or after 23rd July 2024  5aii |
| r259 `F259` | b  Deduction under sections 54F (Specify details in item D below) where transfer was  5b |
| r260 `F260` | bi  Before 23rd July 2024  5bi |
| r263 `F263` | i  Before 23rd July 2024-Not using  B5ci |
| r264 `F264` | ii  On or after 23rd July 2024  B5cii |
| r265 `F265` | For NON-RESIDENTS- from sale of unlisted shares or listed debenture of Indian company (to be compute |
| r266 `F266` | a  LTCG computed without indexation benefit in respect of on unlisted shares or listed debentures  5a |
| r267 `F267` | i  Before 23rd July 2024 - Listed Debentures  5ai |
| r268 `F268` | ii  Before 23rd July 2024 - Other than listed Debentures  5aii |
| r269 `F269` | a  LTCG computed without indexation benefit in respect of on unlisted shares or listed debentures  5a |
| r270 `F270` | b  Deduction under sections 54F (Specify details in item D below)  5b |
| r271 `F271` | i  Before 23rd July 2024 - Listed Debentures  5bi |
| r272 `F272` | ii  Before 23rd July 2024 - Other than listed Debentures  5bii |
| r273 `F273` | b  Deduction under sections 54F (Specify details in item D below)  5b |
| r274 `F274` | c  LTCG on unlisted shares or listed debentures (5a-5b)  B5c |
| r275 `F275` | i  where transfer was before 23rd July 2024 – Listed Debentures-Not using  B5ci |
| r276 `F276` | ii  where transfer was before 23rd July 2024 – other than Listed Debentures-Not using  B5cii |
| r277 `F277` | iii  where transfer was on or after 23rd July 2024 (Only Listed Shares or Listed debentures  B5ciii |
| r278 `F278` | For NON-RESIDENTS- from sale of unlisted securities as per sec. 112(1)(c) |
| r279 `F279` | ia  i  In case securities sold include shares of a company other than quoted shares, enter the following de  i6a |
| r280 `H280` | a  Full value of consideration received/receivable in respect of unquoted shares  6ai |
| r281 `H281` | b  Fair market value of unquoted shares determined in the prescribed manner  aib |
| r282 `H282` | c  Full value of consideration in respect of unquoted shares adopted as per section 50CA for the purpos  aic |
| r283 `G283` | ii  Full value of consideration in respect of securities other than unquoted shares  aii |
| r284 `G284` | iii  Total (ic + ii)  aiii |
| r285 `F285` | ib  Deductions under section 48 |
| r286 `G286` | i  Cost of acquisition without indexation  6bi |
| r287 `G287` | ii  Cost of improvement without indexation  bii |
| r288 `G288` | iii  Expenditure wholly and exclusively in connection with transfer  biii |
| r289 `G289` | iv  Total (bi + bii +biii)  biv |
| r290 `F290` | ic  Balance (6aiii –6 biv)  6ic |
| r291 `F291` | id  Deduction under sections 54F(Specify details in item D below)  d |
| r292 `F292` | ie  Long-term Capital Gains on assets at B6 in case of NON-RESIDENT (6c – 6d)  B6ie |
| r293 `F293` | (i)  Where transfer was before 23rd July 2024 [applicable for 7(i) & 7(ii) ]-NOT USING  B7iei |
| r294 `F294` | (ii)  Where transfer was on or after 23rd July 2024 [ applicable for 7(i) & 7(ii) ]  B7ieii |
| r295 `F295` | For NON-RESIDENTS- from sale of bonds or GDR as referred in sec. 115AC |
| r296 `F296` | iia  i  In case securities sold include shares of a company other than quoted shares, enter the following de |
| r297 `H297` | a  Full value of consideration received/receivable in respect of unquoted shares  6iiai |
| r298 `H298` | b  Fair market value of unquoted shares determined in the prescribed manner  iiaib |
| r299 `H299` | c  Full value of consideration in respect of unquoted shares adopted as per section 50CA for the purpos  iiaic |
| r300 `G300` | ii  Full value of consideration in respect of securities other than unquoted shares  iiaii |
| r301 `G301` | iii  Total (ic + ii)  iiaiii |
| r302 `F302` | iib  Deductions under section 48 |
| r303 `G303` | i  Cost of acquisition without indexation  bi |
| r304 `G304` | ii  Cost of improvement without indexation  bii |
| r305 `G305` | iii  Expenditure wholly and exclusively in connection with transfer  biii |
| r306 `G306` | iv  Total (bi + bii +biii)  biv |
| r307 `F307` | iic  Balance (6aiii – 6biv)  6iic |
| r308 `F308` | iid  Deduction under sections 54F(Specify details in item D below)  d |
| r309 `F309` | iie  Long-term Capital Gains on assets at B6 in case of NON-REESIDENT (6c – 6d)  B6iie |
| r310 `F310` | (i)  Where transfer was before 23rd July 2024 [applicable for 7(i) & 7(ii) ]-NOT USING  B7iiei |
| r311 `F311` | (ii)  Where transfer was on or after 23rd July 2024 [ applicable for 7(i) & 7(ii) ]  B7iieii |
| r312 `F312` | For NON-RESIDENTS- from sale of securities by FII as referred to in sec. 115AD(other than securities |
| r313 `F313` | iiia  i  In case securities sold include shares of a company other than quoted shares, enter the following de  i6a |
| r314 `H314` | a  Full value of consideration received/receivable in respect of unquoted shares  6iiiai |
| r315 `H315` | b  Fair market value of unquoted shares determined in the prescribed manner  iiiaib |
| r316 `H316` | c  Full value of consideration in respect of unquoted shares adopted as per section 50CA for the purpos  iiiaic |
| r317 `G317` | ii  Full value of consideration in respect of securities other than unquoted shares  iiiaii |
| r318 `G318` | iii  Total (ic + ii)  iiiaiii |
| r319 `F319` | iiib  Deductions under section 48 |
| r320 `G320` | i  Cost of acquisition without indexation  bi |
| r321 `G321` | ii  Cost of improvement without indexation  bii |
| r322 `G322` | iii  Expenditure wholly and exclusively in connection with transfer  biii |
| r323 `G323` | iv  Total (bi + bii +biii)  biv |
| r324 `F324` | iiic  Balance (6aiii – 6biv)  6iiic |
| r325 `F325` | iiid  Deduction under sections 54F(Specify details in item D below)  diii |
| r326 `F326` | iiie  Long-term Capital Gains on assets at B6 in case of NON-RESIDENT (6c-6d)  B6iiie |
| r327 `G327` | (iii) - Long-term Capital Gains on assets from sale of securities by FII as referred to in sec. 115A  B7iiiei  Should be 12.5% 10% |
| r328 `G328` | Total of Long-term Capital Gains on assets at 7 above in case of NON-RESIDENT |
| r329 `F329` | For FII/FPI ( NON-RESIDENTS ) - From sale of equity share in a company or unit of equity oriented fu |
| r330 `F330` | a  LTCG u/s 112A (Column 14 of 115AD(1)(iii) proviso)  7a |
| r331 `F331` | i  Sum of column 14 where transfer was before 23rd July 2024 -Not using  7ai |
| r332 `F332` | ii  Sum of column 14 where transfer was on or after 23rd July 2024  7aii |
| r333 `F333` | b  Deduction under sections 54F (Specify details in item D below)  8b |
| r334 `F334` | i  Before 23rd July 2024 [applicable for 7(i) and 7(ii)]-not using  8bi |
| r335 `F335` | b  Deduction under sections 54F (Specify details in item D below)  7b |
| r336 `F336` | c  Long-term Capital Gains on assets at B7 above (7a-7b)  B7c |
| r337 `F337` | i  Before 23rd July 2024-Not using  B8ci |
| r338 `F338` | ii  On or after 23rd July 2024  B8cii |
| r339 `F339` | From sale of foreign exchange asset by NON-RESIDENT INDIAN (If opted under chapter XII-A) |
| r340 `F340` | a  LTCG on sale of foreign exchange asset (as per Section 115F) (computed without indexation)  8a |
| r341 `F341` | i  Before 23rd July 2024  8ai |
| r342 `F342` | a  LTCG on sale of foreign exchange asset (as per Section 115F) (computed without indexation)  8a |
| r343 `F343` | b  Less deduction under section 115F(Specify details in item D below)  8b |
| r344 `F344` | i  Before 23rd July 2024-Not using  8bi |
| r345 `F345` | b  Less deduction under section 115F(Specify details in item D below)  8b |
| r346 `F346` | c  Balance LTCG on sale of specified asset (8a – 8b)  B8c |
| r347 `F347` | i  Before 23rd July 2024-Not using  B8ci |
| r348 `F348` | ii  On or after 23rd July 2024  B8cii |
| r349 `F349` | d  LTCG on sale of asset, other than specified asset (as per Section 115E) where transfer was (computed  9d |
| r350 `F350` | i  Before 23rd July 2024  9di |
| r351 `F351` | ii  On or after 23rd July 2024  9dii |
| r352 `F352` | e  Less deduction under section 115F(Specify details in item D below)  9e |
| r353 `F353` | f  Balance LTCG on sale of asset, other than specified asset (9d – 9e)  B9f |
| r368 `F368` | dii  Deduction under sections 54EC (Specify details in item D below)  dii |
| r369 `F369` | diii  Deduction under sections 54EE (Specify details in item D below)  dii |
| r375 `F375` | i  Amount deemed to be LTCG under sections 54  i |
| r376 `F376` | ii  Amount deemed to be LTCG under sections 54B  ii |
| r377 `F377` | ii  Amount deemed to be LTCG under sections 54D  ii |
| r378 `F378` | iii  Amount deemed to be LTCG under sections 54EC  iii |
| r379 `F379` | iv  Amount deemed to be LTCG under sections 54F  iv |
| r380 `F380` | ii  Amount deemed to be LTCG under sections 54G  ii |
| r381 `F381` | ii  Amount deemed to be LTCG under sections 54GA  ii |
| r382 `F382` | v  Amount deemed to be LTCG under sections 54GB  v |
| r383 `F383` | vi  Amount deemed to be LTCG under sections 115F  vi |
| r384 `F384` | Total Amount deemed to be LTCG under sections 54/54B/54D/54EC/54F/54G/54GA/54GB/115F  B9 |
| r385 `F385` | i  Before 23rd July 2024-Not using  B10ei |
| r386 `F386` | ii  On or After 23rd July 2024  B10eii |
| r394 `E394` | b  Amount deemed to be long-term capital gains, other than at ‘a’  11b |
| r395 `E395` | i  Where deemed capital gain arose before 23rd July 2024-Not using  bi |
| r398 `E398` | i  Where deemed capital gain arose before 23rd July 2024-Not using  B11i |
| r399 `E399` | ii  Where deemed capital gain arose on or after 23rd July 2024  B11ii |
| r401 `F401` | a1(i)  Pass Through Income/loss in the nature of Long Term Capital Gain, chargeable @ 10% u/s. 112A  12a1(i) |
| r403 `F403` | a2(i)  Pass Through Income/loss in the nature of Long Term Capital Gain, chargeable @ 10% - under sections  12a2(i) |
| r405 `F405` | b  Pass Through Income /Loss in the nature of Long Term Capital Gain, chargeable @ 20%  12b |
| r415 `G415` | Sl.  Country name, code  Article of DTAA  Whether Tax Residency Certificate obtained?  Item B1 to B9 above in which included  Amount of LTCG |
| r419 `G419` | III  Total amount of LTCG not chargeable to tax as per DTAA  B10 |
| r421 `G421` | Sl.No  Rate  Amount |
| r452 `F452` | e  Deduction claimed u/s 54EE |
| r453 `G453` | Sl. No.  Date of transfer of original asset  Amount invested in specified assets  Date of investment  Amount of deduction claimed |
| r456 `G456` | Total |
| r477 `H477` | Section  Amount of Deduction  Cost of New Asset  Date of its acquisition/ construction  Amount deposited in Capital Gains Accounts Scheme before due date |
| r491 `D491` | E  Set-off of current year capital losses with current year capital gains (excluding amounts included i |
| r492 `E492` | SI. No.  Type of Capital Gain  Capital Gain of current year (Fill this column only if computed figure is positive)  Short term capital loss  Long term capital loss  Current year’s capital gains remaining after set off (9= 1-2-3-4-5-6-7-8) |
| r493 `L493` | applicable rate  DTAA rates  DTAA rates |
| r495 `E495` | i  Capital Loss to be set off (Fill this row only if figure computed is negative) ------> |
| r496 `E496` | ii  Short term capital gain |
| r497 `E497` | iii |
| r498 `E498` | iv  applicable rate |
| r499 `E499` | v  DTAA rates |
| r500 `E500` | vi  Long term capital gain |
| r501 `E501` | vii |
| r502 `E502` | viii  DTAA rates |
| r503 `E503` | ix  Total loss set off (ii + iii + iv + v + vi+vii+viii) |
| r504 `E504` | x  Loss remaining after set off (i – vii) |
| r507 `D507` | SI. No  Type of Capital Gain  Capital Gain of current year (Fill this column only if computed figure is positive)  Short term capital loss  Long term capital loss |
| r508 `M508` | applicable rate  DTAA rates  DTAA rates  Current year’s capital gains remaining after set off (11= 1-2-3-4-5-6-7-8-9-10) |
| r510 `D510` | i  Capital Loss to be set off (Fill this row only if figure computed is negative) ------> |
| r511 `E511` | ii  Short term capital gain |
| r512 `E512` | iii |
| r513 `E513` | iv |
| r514 `E514` | v  Applicable rate |
| r515 `E515` | vi  DTAA rates |
| r516 `E516` | vii  Long term capital gain |
| r517 `E517` | viii |
| r518 `E518` | ix |
| r519 `E519` | x  DTAA rates |
| r520 `E520` | xi  Total loss set off (ii + iii + iv + v + vi+vii+viii+ix+x) |
| r521 `E521` | xii  Loss remaining after set off (i – xi) |
| r522 `D522` | Do you want to edit the detail autopopulated above? |
| r538 `F538` | Short-term capital gains taxable at the rate of 15%. Enter value from item 5via of schedule BFLA, if |
| r543 `F543` | Long- term capital gains taxable at the rate of 10% Enter value from item 5xa of schedule BFLA, if a |
| r545 `F545` | Long- term capital gains taxable at the rate of 20% Enter value from item 5xi of schedule BFLA, if a |

Why hidden: A4/A5 and B5–B9 (rows 56–75, 122–134, 186–187, 201–215, 220, 222, 226, 228–230, 232, 234–239, 248–249, 251, 253–354 range) are the **non-resident and FII** heads and the depreciable/DTAA working rows the sheet computes internally; the numerous 'Before 23rd July 2024 - Not using' rows are the superseded pre-23-July-2024 rate lines kept for computation only. The set-off tables E (rows 491–521) that are auto-populated, and the hidden accrual rows, appear only through their editable counterparts.

---

## 8 · What this means for the build

- Bind the whole schedule to `ScheduleCGFor23`. Part A → `ShortTermCapGainFor23`, Part B → `LongTermCapGain23`, Part C → `SumOfCGIncm`/`IncmFromVDATrnsf`/`TotScheduleCGFor23`, Part D → `DeducClaimInfo`, Part E → `CurrYrLosses`, Part F → `AccruOrRecOfCG`.
- Build only the **visible** heads for a resident (A1, A2, A3, A6, A7, A8, A9, A(A), A10; B1, B2, B3i, B3ii, B9, B10, B11, B12, B(A), B13). Keep the non-resident heads (A4, A5, B5–B8) hidden until residential status is NRI/FII.
- Each 'Sale of land or building' head repeats per property (`SaleofLandBuildDtls[]`) and carries a per-property buyer table (`TrnsfImmblPrprtyDtls[]`) and an exemption table (`ExemptionOrDednUs54Dtls[]`). LTCG land/building also carries a cost-of-improvement table with indexation (`CostOfImprovementsDtls[]`).
- The 50C substitution (aii vs ai, 10% band), the MAX for slump-sale FMV and 50CA unquoted shares, the CII VLOOKUPs for indexed cost, the 112(1) second-proviso excess-tax working (B1ei(A)/B1ei(B)/B1eii), and the floor-at-zero deduction logic must all be reproduced.
- Part D tables must prove every exemption claimed in A or B: dates, cost of new asset, CGAS deposit, account/IFSC, amount. `TotDeductClaim` (1i) totals them.
- Part E set-off matrix nets STCG (20%/30%/applicable/DTAA) and LTCG (12.5%/DTAA) losses against gains; Part F splits each taxable gain across the five 234C date ranges (Upto 15/6, to 15/9, to 15/12, to 15/3, to 31/3), sourcing values from Schedule BFLA.



## Additional visible rows — verbatim from the sheet (completeness)
Rows present on the utility sheet and captured here verbatim so every visible label is in the book:

- Deductions under section 48
- PAN of Buyer
- Total ( i + ii + iii)
- Total (ic + ii)
- Amount of income (2)
- Rate as per I.T. Act (9)
- PAN of Buyer(s)
- Upto 15/6 (i)
