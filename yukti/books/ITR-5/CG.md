# The book of Schedule CG — ITR-5, A.Y. 2026-27

Schema block: **`ScheduleCG`** (section_map: `CG → blocks:[ScheduleCG], section:cg`). Read row by row from the utility's **CG** sheet (`sheet18.xml`, 501 rows, 129 hidden) with `tools/dump.py` — rows, `--formulas`, `--dropdowns`, `--schema ScheduleCG` and `--leaves ScheduleCG` — and cross-checked against `books/ITR-5/rules.json` (184 Schedule-CG rules, A25–A450+). Every heading, item letter, item code, schema key and dropdown value below is the department's own; nothing is invented. A row the dump marks `H` is **hidden** and appears only under *§7 Hidden rows — not built*.

---

## 1 · The shape

Schedule CG computes income under the head **Capital Gains** for A.Y. 2026-27 and maps entirely to the one schema block **`ScheduleCG`**, whose eight required top-level members are `ShortTermCapGain`, `LongTermCapGain`, `SumOfCGIncm`, `IncmFromVDATrnsf`, `IncChargeableHeadCapGain`, `DeducClaimInfo`, `CurrYrLosses`, `AccruOrRecOfCG`.

The sheet has six lettered parts:

- **A — Short-term Capital Gains (STCG)** → `ShortTermCapGain`. Heads: **A1** sale of land/building (`SaleofLandBuild.SaleofLandBuildDtls[]`, item code A1e), **A2** slump sale (`SlumpSaleInStcg`, A2c), **A3** equity share / equity-oriented MF / business-trust units on which STT is paid — two sub-heads A3i (item A3ie) and A3ii (A3iie) → `EquityMFonSTT[]` (max 2, `MFSectionCode` enum `1A`,`5AD1biip`), **A4** non-resident sale of shares/debentures u/s 111A (`NRITransacSec48Dtl`, A4a/A4b), **A5** non-resident FII securities u/s 115AD (`NRISecur115AD`, A5e), **A6** other assets incl. deemed STCG on depreciable assets from Sch DCG (`SaleOnOtherAssets`, A6g), **A7** amount deemed to be STCG (`UnutilizedCg` + `AmtDeemedStcg` + `AmtDeemedStcg45iv`, A7/A7a), **A8** pass-through STCG (`PassThrIncNatureSTCG…`), **A9** STCG not chargeable / at special rates as per DTAA (`NRICgDTAA.NRIDTAADtls[]`, A9a/A9b), **A(A)** capital loss on buy-back of shares (`CapitalLossBuyBackShares`), **A10** total STCG (`TotalSTCG`).
- **B — Long-term Capital Gains (LTCG)** → `LongTermCapGain`. Heads: **B1** land/building with indexation working (`SaleofLandBuild`, B1e/B1g), **B2** slump sale (`SlumpSaleInLtcgDtls.SlumpSaleInLtcg`, B2e), **B3** listed securities / zero-coupon bonds u/s 112(1) (`Proviso112Applicable`, B3c), **B4** equity shares/units u/s 112A from col.14 of Schedule 112A (`SaleOfEquityShareUs112A`, B4), **B5** non-resident unlisted shares / listed debentures without indexation (`NRIProvisoSec48`, B5), **B6** non-resident unlisted securities u/s 112(1)(c) / 115AB / 115AC / 115AD (`NRIOnSec112and115.NRIOnSec112and115Dtls[]` max 4, four sub-blocks Bi/Bii/Biii/Biv6c), **B7** FII/FPI equity u/s 112A read with 115AD(1)(b)(iii) proviso from col.14 of Schedule 115AD (`NRISaleOfEquityShareUs112A`, B7), **B8** assets where B1–B7 are not applicable (`SaleofAssetNADtls.SaleofAssetNA`, B8e), **B9** amount deemed to be LTCG (`UnutilizedCg` + `AmtDeemedLtcg` + `AmtDeemedLtcg45iv`, B9), **B10** pass-through LTCG (`PassThrIncNatureLTCG…`), **B11** LTCG not chargeable / at special rates as per DTAA (`NRICgDTAA`, B11a/B11b), **B(A)** capital loss on buy-back (`CapitalLossBuyBackShares`), **B12** total LTCG (`TotalLTCG`).
- **C — Summary**: **C1** Sum of Capital Gain Incomes (`SumOfCGIncm`), **C2** Income from transfer of Virtual Digital Assets from Sch VDA item B (`IncmFromVDATrnsf`), **C3** Income chargeable under the head CAPITAL GAINS = C1 + C2 (`IncChargeableHeadCapGain`).
- **D — Information about deduction claimed** → `DeducClaimInfo`: one table per section actually usable in ITR-5 — **54D** (`DeducClaimDtlsUs54D[]`), **54EC** (`DeducClaimDtlsUs54EC[]`), **54G** (`DeducClaimDtlsUs54G[]`), **54GA** (`DeducClaimDtlsUs54GA[]`) — and the total **1e** (`TotDeductClaim`). (54/54B/54F/115F exist in the section-code enums for other ITRs but ITR-5 exposes only 54D/54EC/54G/54GA tables, since a firm/AOP/BOI cannot claim the residential-house reliefs.)
- **E — Set-off of current-year capital losses with current-year capital gains** → `CurrYrLosses`. A matrix nesting STCG at 20% / 30% / applicable rate / DTAA rate and LTCG at 12.5% / DTAA rate: `InLossSetOff` (row i), `InStcg20Per` / `InStcg30Per` / `InStcgAppRate` / `InStcgDTAARate`, `InLtcg12_5Per` / `InLtcgDTAARate`, `TotLossSetOff` (row viii/xi), `LossRemainSetOff` (row ix/xii). `EditAutopoulatedDetail` flags a manual override.
- **F — Information about accrual/receipt of capital gain** → `AccruOrRecOfCG`. Each taxable bucket carries a `DateRange` split across the five section-234C windows `Upto15Of6`, `Upto15Of9`, `Up16Of9To15Of12`, `Up16Of12To15Of3`, `Up16Of3To31Of3`: `ShortTermUnder20Per`, `ShortTermUnder30Per`, `ShortTermUnderAppRate`, `ShortTermUnderDTAARate`, `LongTermUnder12_5Per`, `LongTermUnderDTAARate`, `VDATrnsfGainsUnder30Per`. Each row sources its figure from the matching item of Schedule BFLA (rules A399–A403, A414–A415, A426–A427).

Two families of heads stay **hidden for a resident firm/AOP/BOI**: the non-resident/FII short-term heads (A4, A5) and the non-resident long-term heads (B5, B6, B7) — the sheet's own captions say "Sub-items 4 & 5 are not applicable for residents" (r4) and "Items 5, 6 & 7 are not applicable for residents" (r134). The 23-July-2024 rate-change split rows (before/after 23rd July 2024, with-/without-indexation, 10%/20%/12.5% tax-working lines) are the utility's internal computation rows and are almost all `H` — see §7.

---

## 2 · The items

One block, **`ScheduleCG`**. Every **visible** labelled row of the CG sheet is listed below verbatim as the utility prints it, with its row reference; the department's item code (the `R`/`P` column value, e.g. `A1e`, `B1e`, `C3`, `1c`, `bv`) is carried inline in the text where the sheet shows it, and is the numbering the rules document (§3) uses. Schema-key mapping for every leaf is given in full in §6 and §6a.

| Row | Field text as the utility prints it (all visible cells, incl. item code) |
|---|---|
| r3 | Schedule CG · Capital Gains |
| r4 | A · Short-term Capital Gains (STCG) (Sub-items 4 & 5 are not applicable for residents) |
| r5 | From sale of land or building or both (fill up details separately for each property) · TRC Flag |
| r6 | Date of Purchase / acquisition |
| r7 | Date of Sale / Transfer |
| r8 | a · i · Full value of consideration received/receivable · ai · ResidentialCheck |
| r9 | ii · Value of property as per stamp valuation authority · aii · STCG DTAA Sum |
| r10 | iii · Full value of consideration adopted as per section 50C for the purpose of Capital Gains [in case (ai · aiii · Sum of A1e · AR |
| r11 | b · Deductions under section 48 · Sum of aiii |
| r12 | i · Reduction as per clause (iii) of section 48 of the Act, read with rule 8AB of the Rules · bi |
| r13 | ii · Cost of acquisition without indexation · bii · CG_A_Count |
| r14 | iii · Cost of Improvement without indexation · biii · CG_A_frmsize |
| r15 | biv · Expenditure wholly and exclusively in connection with transfer · biv |
| r16 | bv · Total (bi + bii + biii+biv) · bv |
| r17 | c · Balance (aiii – bv) · 1c |
| r19 | di · Deduction under section 54G(Specify details in item D below) · di |
| r20 | dii · Deduction under section 54GA(Specify details in item D below) · dii |
| r21 | d · Total Deduction under section 54G/54GA · 1d |
| r22 | e · Short-term Capital Gains on Immovable property (1c - 1d) · A1e |
| r23 | f · In case of transfer of immovable property, please furnish the following details (see note) |
| r24 | Sl. No. · Name of buyer(s) · PAN of buyer(s) · Aadhaar No. of buyer(s) · Percentage share · Amount · Address of property · State · PIN Code · Country name, code · ZipCode |
| r25 | (Select) · (Select) |
| r26 | (Select) · (Select) |
| r27 | (Select) · (Select) |
| r28 | (Select) · (Select) |
| r32 | Note : · Furnishing of PAN/Aadhaar No. is mandatory, if the tax is deduced under section 194-IA or is quoted |
| r33 | From Slump sale |
| r34 | ai · Fair market value as per Rule 11UAE(2) · ai |
| r35 | aii · Fair market value as per Rule 11UAE(3) · aii |
| r36 | aiii · Full value of consideration (higher of ai or aii) · aiii |
| r37 | b · Net worth of the under taking or division · 2b |
| r38 | c · Short term capital gains from slump sale (2aiii-2b) · A2c |
| r39 | i · From sale of equity share or unit of equity oriented Mutual Fund (MF) or unit of a business trust on |
| r40 | ia · Full value of consideration · 3ia |
| r41 | ib · Deductions under section 48 |
| r42 | i · Reduction as per clause (iii) of section 48 of the Act, read with rule 8AB of the Rules · bi |
| r43 | ii · Cost of acquisition without indexation · bii |
| r44 | iii · Cost of Improvement without indexation · biii |
| r45 | iv · Expenditure wholly and exclusively in connection with transfer · biv |
| r46 | v · Total ( i + ii + iii+iv) · bv |
| r47 | ic · Balance (3ia – 3ibv) · 3ic |
| r48 | id · Loss, if any, to be ignored under section 94(7) or 94(8) for example if asset bought/acquired within · 3id |
| r49 | ie · Short-term capital gain on equity share or equity oriented MF (STT paid) (3ic +3id) · A3ie |
| r50 | ii · From sale of equity share or unit of equity oriented Mutual Fund (MF) or Unit of a business trust on |
| r51 | iia · Full value of consideration · 3iia |
| r52 | iib · Deductions under section 48 |
| r53 | i · Reduction as per clause (iii) of section 48 of the Act, read with rule 8AB of the Rules · bi |
| r54 | ii · Cost of acquisition without indexation · bii |
| r55 | iii · Cost of Improvement without indexation · biii |
| r56 | iv · Expenditure wholly and exclusively in connection with transfer · biv |
| r57 | v · Total ( i + ii + iii+iv) · bv |
| r58 | iic · Balance (3iia – 3iibv) · 3iic |
| r59 | iid · Loss to be disallowed u/s 94(7) or 94(8)- for example if asset bought/acquired within 3 months prior · 3iid |
| r60 | iie · Short-term capital gain on equity share or equity oriented MF (STT paid) (3iic +3iid) · A3iie |
| r61 | For NON-RESIDENT, not being an FII- from sale of shares or debentures of an Indian company (to be co |
| r62 | a · STCG on transactions covered u/s 111A · A4a |
| r65 | b · STCG from sale of shares not covered in sl.no. 4a or sale of debentures · A4b |
| r66 | For NON-RESIDENT- from sale of securities (other than those at A3) by an FII as per section 115AD |
| r67 | i · In case securities sold include shares of a company other than quoted shares, enter the following de |
| r68 | a) Full value of consideration received/receivable in respect of unquoted shares · ia |
| r69 | b) Fair market value of unquoted shares determined in the prescribed manner · ib |
| r70 | c) Full value of consideration in respect of unquoted shares adopted as per section 50CA for the pur · ic |
| r71 | ii · Full value of consideration in respect of securities other than unquoted shares · ii |
| r72 | iii · Total (ic + ii) · aiii |
| r73 | b · Deductions under section 48 |
| r74 | bi · Reduction as per clause (iii) of section 48 of the Act, read with rule 8AB of the Rules · bi |
| r75 | bii · Cost of acquisition without indexation · bii |
| r76 | biii · Cost of improvement without indexation · biii |
| r77 | biv · Expenditure wholly and exclusively in connection with transfer · biv |
| r78 | bv · Total (i + ii + iii + iv) · bv |
| r79 | c · Balance (5aiii – bv) · 5c |
| r80 | d · Loss, if any, to be ignored under section 94(7) or 94(8) for example if asset bought/acquired within · 5d |
| r81 | e · Short-term capital gain on securities by an FII (other than those at A3) (5c +5d) · A5e |
| r82 | From sale of assets other than at A1 or A2 or A3 or A4 or A5 above |
| r83 | i · In case assets sold include shares of a company other than quoted shares, enter the following detail |
| r84 | a) Full value of consideration received/receivable in respect of unquoted shares · ia |
| r85 | b) Fair market value of unquoted shares determined in the prescribed manner · ib |
| r86 | c) Full value of consideration in respect of unquoted shares adopted as per section 50CA for the pur · ic |
| r87 | ii · Full value of consideration in respect of assets other than unquoted shares · ii |
| r88 | iii · Total (ic + ii) · aiii |
| r89 | b · Deductions under section 48 |
| r90 | bi · Reduction as per clause (iii) of section 48 of the Act, read with rule 8AB of the Rules · bi |
| r91 | bii · Cost of acquisition without indexation · bii |
| r92 | biii · Cost of Improvement without indexation · biii |
| r93 | biv · Expenditure wholly and exclusively in connection with transfer · biv |
| r94 | bv · Total (i + ii + iii + iv) · bv |
| r95 | c · Balance (6aiii – bv) · 6c |
| r96 | d · In case of asset (security/unit) loss to be disallowed u/s 94(7) or 94(8)- for example if asset boug · 6d |
| r97 | e · Deemed short term capital gains on depreciable assets (6 of schedule- DCG) · e |
| r99 | fi · Deduction under section 54G (Specify details in item D below) · fi |
| r100 | fii · Deduction under section 54GA (Specify details in item D below) · fii |
| r101 | f · Total Deduction under section 54G/54GA · 6f |
| r102 | g · STCG on assets other than at A1 or A2 or A3 or A4 or A5 above (6c + 6d + 6e - 6f) · A6g |
| r103 | Amount deemed to be short-term capital gains |
| r104 | a · Whether any amount of unutilized capital gain on asset transferred during the previous years shown b · A7a · (Select) |
| r106 | Sl. No. · Previous year in which asset transferred · Section under which deduction claimed in that year · New asset acquired/constructed · Amount not used for new asset or remained unutilized in Capital gains account (X) |
| r107 | Previous year in which asset acquired/constructed · Amount utilised out of Capital Gains account |
| r112 | b · Amount deemed to be short term capital gains u/s 54G/54GA, other than at 'a‘ · 7b |
| r113 | c · Amount deemed to be short term capital gains as per Section 45(4) read with Section 9B of the Act · 7c |
| r114 | Amount deemed to be short term capital gains (aXi+Xii+Xiii+b + c) · A7 |
| r115 | Pass Through Income/ loss in the nature of Short Term Capital Gain, (Fill up schedule PTI) (A8a+ A8b · A8 |
| r117 | a · Pass Through Income/ Loss in the nature of Short Term Capital Gain, chargeable @ 20% · 8a |
| r118 | b · Pass Through Income/ Loss in the nature of Short Term Capital Gain, chargeable @ 30% · 8b |
| r119 | c · Pass Through Income/ Loss in the nature of Short Term Capital Gain, chargeable at applicable rates · 8c |
| r120 | Amount of STCG included in A1-A8 but claimed as not chargeable to tax or chargeable at special rates |
| r121 | Sl. No. · Amount of income (2) · Item No. A1 to A8 above in which included (3) · Country name, code (4) · Article of DTAA (5) · Rate as per Treaty (enter NIL, if not chargeable) (6) · Whether Tax Residency Certificate obtained? (7) · Section of I.T. Act (8) · Rate as per I.T. Act (9) · Applicable rate [lower of (6) or (9)] (10) |
| r122 | (Select) |
| r123 | (Select) |
| r125 | 9a · Total amount of STCG claimed as not chargeable to tax in India as per DTAA · A9a |
| r126 | 9b · Total amount of STCG claimed as chargeable to tax at special rates in India as per DTAA · A9b · AR |
| r128 | A(A) · Capital Loss on buy back of shares on or after 01st October 2024 (can be claimed only if respective · A(A) · STCG_20% · STCG_30% · STCG_AR |
| r129 | S.No · Rate · Amount |
| r130 | (Select) |
| r131 | (Select) |
| r132 | (Select) |
| r133 | Total Short-term Capital Gain (A1e+ A2c+ A3e+ A4a+ A4b+ A5e+ A6g+A7+A8-A9a+A(A)) · A10 |
| r134 | B · Long-term capital gain (LTCG) (Items 5, 6 & 7 are not applicable for residents) |
| r135 | From sale of land or building or both |
| r136 | Date of Purchase / acquisition |
| r137 | Date of Sale / transfer |
| r138 | a · i · Full value of consideration received/receivable · ai |
| r139 | ii · Value of property as per stamp valuation authority · aii |
| r140 | iii · Full value of consideration adopted as per section 50C for the purpose of Capital Gains [in case (ai · aiii |
| r141 | b · Deductions under section 48 |
| r142 | bi · Reduction as per clause (iii) of section 48 of the Act, read with rule 8AB of the Rules · bi |
| r143 | bii · Cost of acquisition without indexation · bii |
| r145 | biia · Cost of improvement without indexation · biia |
| r148 | biii · Expenditure wholly and exclusively in connection with transfer · biii |
| r149 | biv · Total (bi + bii+biia + biii) · biv |
| r150 | c · Balance (aiii – biv) · 1c |
| r151 | d · Deduction under section 54D/54EC/54G/54GA (Specify details in item D below) · d |
| r152 | di · Deduction under section 54D (Specify details in item D below) · di |
| r153 | dii · Deduction under section 54EC (Specify details in item D below) · dii |
| r154 | diii · Deduction under section 54G (Specify details in item D below) · diii |
| r155 | div · Deduction under section 54GA (Specify details in item D below) · div |
| r156 | d · Total Deduction under section 54D/54EC/54G/54GA (Specify details in item D below) · 1d |
| r157 | e · Long-term Capital Gains on Immovable property (1c - 1d) · B1e |
| r158 | f · In case of transfer of immovable property, please furnish the following details (see note) |
| r159 | Sl. No. · Name of buyer(s) · PAN of buyer(s) · Aadhaar No. of buyer(s) · Percentage share · Amount · Address of property · State · PIN Code · Country name, code · ZipCode |
| r160 | (Select) · (Select) |
| r161 | (Select) · (select) |
| r165 | Note : · Furnishing of PAN/Aadhaar No. is mandatory, if the tax is deduced under section 194-IA or is quoted |
| r166 | g · Total Long-term Capital Gains on Immovable property (ƩB1e) · B1g |
| r169 | From Slump sale |
| r170 | ai · Fair market value as per Rule 11UAE(2) · 2ai |
| r171 | aii · Fair market value as per Rule 11UAE(3) · 2aii |
| r172 | aiii · Full value of consideration (higher of ai or aii) · 2aiii |
| r173 | b · Net worth of the under taking or division · 2b |
| r174 | c · Balance (2aiii - 2b) · 2c |
| r175 | d · Deduction u/s 54EC · 2d |
| r176 | e · Long term capital gains from slump sale (2c-2d) · B2e |
| r188 | From sale of listed securities (other than a unit) or zero coupon bonds as per Section 112(1) |
| r189 | a · Full value of consideration · 3a |
| r190 | b · Deductions under section 48 |
| r191 | i · Reduction as per clause (iii) of section 48 of the Act, read with rule 8AB of the Rules · 3bi |
| r193 | ii · Cost of acquisition without indexation · 3bii |
| r195 | iii · Cost of improvement without indexation · 3biii |
| r196 | iv · Expenditure wholly and exclusively in connection with transfer · 3biv |
| r197 | v · Total (bi +bii +biii + biv) · 3bv |
| r199 | c · Long-term Capital Gains on assets at B3 above (3a – bv) · B3c |
| r206 | From sale of equity share in a company or unit of equity oriented fund or unit of a business trust o |
| r207 | a · Long-term Capital Gains on sale of capital assets at B4 (column 14 of Schedule 112A) · B4 |
| r212 | For NON-RESIDENTS- from sale of unlisted shares or listed debenture of Indian company (to be compute |
| r213 | LTCG computed without indexation benefit on unlsited shares or listed debentures · B5 |
| r217 | For NON-RESIDENTS- from sale of unlisted securities as per sec. 112(1)(c) |
| r218 | ai · In case securities sold include shares of a company other than quoted shares, enter the following de |
| r219 | a) Full value of consideration received/receivable in respect of unquoted shares · aia |
| r220 | b) Fair market value of unquoted shares determined in the prescribed manner · aib |
| r221 | c) Full value of consideration in respect of unquoted shares adopted as per section 50CA for the pur · aic |
| r222 | aii · Full value of consideration in respect of assets other than unquoted shares · aii |
| r223 | aiii · Total (ic + ii) · aiii |
| r224 | b · Deductions under section 48 |
| r225 | bi · Reduction as per clause (iii) of section 48 of the Act, read with rule 8AB of the Rules · bi |
| r226 | bii · Cost of acquisition without indexation · bii |
| r227 | biii · Cost of improvement without indexation · biii |
| r228 | biv · Expenditure wholly and exclusively in connection with transfer · biv |
| r229 | bv · Total (bi + bii + biii + biv) · bv |
| r230 | c · Long-term Capital Gains on assets at 6 above in case of NON-RESIDENT (aiii –bv) · Bi6c |
| r233 | For NON-RESIDENTS- from sale of units referred in sec. 115AB |
| r234 | ai · In case assets sold include shares of a company other than quoted shares, enter the following detail |
| r235 | a) Full value of consideration received/receivable in respect of unquoted shares · aia |
| r236 | b) Fair market value of unquoted shares determined in the prescribed manner · aib |
| r237 | c) Full value of consideration in respect of unquoted shares adopted as per section 50CA for the pur · aic |
| r238 | aii · Full value of consideration in respect of assets other than unquoted shares · aii |
| r239 | aiii · Total (ic + ii) · aiii |
| r240 | b · Deductions under section 48 |
| r241 | i · Reduction as per clause (iii) of section 48 of the Act, read with rule 8AB of the Rules · bi |
| r242 | ii · Cost of acquisition without indexation · bii |
| r243 | iii · Cost of improvement without indexation · biii |
| r244 | iv · Expenditure wholly and exclusively in connection with transfer · biv |
| r245 | v · Total (bi + bii + biii + biv) · bv |
| r246 | c · Long-term Capital Gains on assets at 6 above in case of NON-RESIDENT (aiii – bv) · Bii6c |
| r249 | For NON-RESIDENTS- from sale of bonds or GDR as referred in sec. 115AC |
| r250 | ai · In case securities sold include shares of a company other than quoted shares, enter the following de |
| r251 | a) Full value of consideration received/receivable in respect of unquoted shares · aia |
| r252 | b) Fair market value of unquoted shares determined in the prescribed manner · aib |
| r253 | c) Full value of consideration in respect of unquoted shares adopted as per section 50CA for the pur · aic |
| r254 | aii · Full value of consideration in respect of assets other than unquoted shares · aii |
| r255 | aiii · Total (ic + ii) · aiii |
| r256 | b · Deductions under section 48 |
| r257 | i · Reduction as per clause (iii) of section 48 of the Act, read with rule 8AB of the Rules · bi |
| r258 | ii · Cost of acquisition without indexation · bii |
| r259 | iii · Cost of improvement without indexation · biii |
| r260 | iv · Expenditure wholly and exclusively in connection with transfer · biv |
| r261 | v · Total (bi + bii + biii + biv) · bv |
| r262 | c · Long-term Capital Gains on assets at 6 above in case of NON-RESIDENT (aiii –bv) · Biii6c |
| r265 | For NON-RESIDENTS- from sale of securities by FII as referred to in sec. 115AD |
| r266 | ai · In case securities sold include shares of a company other than quoted shares, enter the following de |
| r267 | a) Full value of consideration received/receivable in respect of unquoted shares · aia |
| r268 | b) Fair market value of unquoted shares determined in the prescribed manner · aib |
| r269 | c) Full value of consideration in respect of unquoted shares adopted as per section 50CA for the pur · aic |
| r270 | aii · Full value of consideration in respect of assets other than unquoted shares · aii |
| r271 | aiii · Total (ic + ii) · aiii |
| r272 | b · Deductions under section 48 |
| r273 | i · Reduction as per clause (iii) of section 48 of the Act, read with rule 8AB of the Rules · bi |
| r274 | ii · Cost of acquisition without indexation · bii |
| r275 | iii · Cost of improvement without indexation · biii |
| r276 | iv · Expenditure wholly and exclusively in connection with transfer · biv |
| r277 | v · Total (bi + bii + biii + biv) · bv |
| r278 | c · Long-term Capital Gains on assets at 6 above in case of NON-RESIDENT (aiii –bv) · Biv6c |
| r280 | For FII/FPI(NON-RESIDENTS) - From sale of equity share in a company or unit of equity oriented fund |
| r281 | a · Long-term Capital Gains on sale of capital assets at B7 above (column 14 of Schedule 115AD(1)(b)(iii · B7 |
| r286 | From sale of assets where B1 to B7 above are not applicable |
| r287 | ai · In case assets sold include shares of a company other than quoted shares, enter the following detail |
| r288 | a) Full value of consideration received/receivable in respect of unquoted shares · B8aia |
| r289 | b) Fair market value of unquoted shares determined in the prescribed manner · B8aib |
| r290 | c) Full value of consideration in respect of unquoted shares adopted as per section 50CA for the pur · B8aic |
| r291 | aii · Full value of consideration in respect of assets other than unquoted shares · B8aii |
| r292 | aiii · Total (ic + ii) · B8aiii |
| r293 | b · Deductions under section 48 |
| r294 | i · Reduction as per clause (iii) of section 48 of the Act, read with rule 8AB of the Rules · B8bi |
| r295 | ii · Cost of acquisition without indexation · B8bii |
| r296 | iii · Cost of improvement without indexation · B8biii |
| r297 | iv · Expenditure wholly and exclusively in connection with transfer · B8biv |
| r298 | v · Total (bi + bii + biii + biv) · B8bv |
| r299 | c · Balance (9aiii – bv) · B8c |
| r300 | di · Deduction under sections 54D (Specify details in item D below) · B8di |
| r301 | dii · Deduction under sections 54G (Specify details in item D below) · B8dii |
| r302 | diii · Deduction under sections 54GA (Specify details in item D below) · B8dii |
| r303 | d · Deduction under sections 54D/54G/54GA (Specify details in item D below) · B8d |
| r304 | e · Long-term Capital Gains on assets at B8 above (8c-8d) · B8e |
| r307 | Amount deemed to be long-term capital gains |
| r308 | a · Whether any amount of unutilized capital gain on asset transferred during the previous years shown b · (Select) |
| r310 | Sl. No. · Previous year in which asset transferred · Section under which deduction claimed in that year · New asset acquired/constructed · Amount not used for new asset or remained unutilized in Capital gains account (X) |
| r311 | Previous year in which asset acquired/constructed · Amount utilised out of Capital Gains account |
| r316 | b · Amount deemed to be long-term capital gains, other than at ‘a’ · 9b |
| r319 | c · Amount deemed to be long term capital gains as per Section 45(4) read with Section 9B of the Act · 9c |
| r322 | Total Amount deemed to be long-term capital gains (aXi + aXii + aXiii + b+ c) · B9 |
| r325 | Pass Through Income/Loss in the nature of Long Term Capital Gain (Fill up schedule PTI) (B10a1 +B10a · B10 |
| r327 | a1 · Pass Through Income/ Loss in the nature of Long-Term Capital Gain, chargeable @ 12.5% u/s 112A · 10a1 |
| r329 | a2 · Pass Through Income/ Loss in the nature of Long-Term Capital Gain, chargeable @ 12.5% other than u/s · 10a2 |
| r331 | Amount of LTCG included in items B1 to B10 but claimed as not chargeable to tax or chargeable at spe |
| r332 | Sl. No. · Amount of income (2) · Item No. B1 to B11 above in which included (3) · Country name, code (4) · Article of DTAA (5) · Rate as per Treaty (enter NIL, if not chargeable) (6) · Whether Tax Residency Certificate obtained? (7) · Section of I.T. Act (8) · Rate as per I.T. Act (9) · Applicable rate [lower of (6) or (9)] (10) |
| r333 | (Select) |
| r334 | (Select) |
| r336 | 11a · Total amount of LTCG claimed as not chargeable to tax in India as per DTAA · B11a |
| r337 | 11b · Total amount of LTCG claimed as chargeable to tax at special rates in India as per DTAA · B11b |
| r339 | B(A) · Capital Loss on buy back of shares [Long Term Capital loss @12.5%] (can be claimed only if respectiv · B(A) |
| r344 | Total long term capital gain B1g + B2e + B3c + B4c + B5 + B6c + B7 + B8 + B9e + B10 - B11 + B(A) · B12 |
| r345 | C1 · Sum of Capital Gain Incomes (8ii + 8iii + 8iv + 8v + 8vi +8vii of table E below) · C1 |
| r346 | C2 · Income from transfer of Virtual Digital Assets (Item No. B of Schedule VDA ) · C2 |
| r347 | C3 · Income chargeable under the head “CAPITAL GAINS” (C1 + C2 ) · C3 |
| r348 | D · Information about deduction claimed |
| r349 | In case of deduction u/s 54D/ 54EC/ 54G/ 54GA give following details |
| r350 | a · Deduction claimed u/s 54D |
| r351 | Sl. No. · Date of acquisition of original asset · Cost of purchase/ construction of new land or building for industrial undertaking · Date of purchase of new land or building · Amount deposited in Capital Gains Accounts Scheme before due date · Date of deposit · Account Number · IFS Code · Amount of deduction claimed · 54DAccount · 54DIFSC |
| r355 | Total |
| r356 | b · Deduction claimed u/s 54EC |
| r357 | Sl. No · Date of transfer of original asset · Amount invested in specified/notified bonds (not exceeding fifty lakh rupees) · Date of investment · Amount of deduction claimed |
| r361 | Total |
| r362 | c · Deduction claimed u/s 54G |
| r363 | Sl. No. · Date of transfer of original asset from urban area · Cost and expenses incurred for purchase or construction of new asset · Date of purchase/construction of new asset in an area other than urban area · Amount deposited in Capital Gains Accounts Scheme before due date · Date of deposit · Account Number · IFS Code · Amount of deduction claimed · 54GAccount · 54GIFSC |
| r367 | Total |
| r368 | d · Deduction claimed u/s 54GA |
| r369 | Sl. No. · Date of transfer of original asset from urban area · Cost and expenses incurred for purchase or construction of new asset · Date of purchase/construction of new asset in SEZ · Amount deposited in Capital Gains Accounts Scheme before due date · Date of deposit · Account Number · IFS Code · Amount of deduction claimed · 54GAAccount · 54GAIFSC |
| r373 | Total |
| r374 | e · Total deduction claimed (1a + 1b + 1c + 1d) · 1e |
| r405 | E · Set-off of current year capital losses with current year capital gains (excluding amounts included i |
| r406 | SI. No. · Type of Capital Gain · Gain of current year (Fill this column only if computed figure is positive) · Short term capital loss set off · Long term capital loss set off · Current year’s capital gains remaining after set off |
| r407 | Applicable rate · DTAA rates · DTAA rates |
| r408 | 8=1-2-3-4-5-6-7 |
| r409 | i · Loss to be set off (Fill this row if computed figure is negative) |
| r410 | ii · Short term capital gain |
| r411 | iii |
| r412 | iv · Applicable rate |
| r413 | v · DTAA rates |
| r414 | vi · Long term capital gain |
| r415 | vii · DTAA rates |
| r416 | viii · Total loss set off (ii + iii + iv + v + vi+vii) |
| r417 | ix · Loss remaining after set off (i – viii) |
| r418 | Do you want to edit the detail autopopulated above? |
| r419 | Note : · The figures of STCG in this table (A1e* etc.) are the amounts of STCG computed in respective column |
| r420 | F · Information about accrual/receipt of capital gain |
| r421 | Type of Capital gain / Date · Upto 15/6 (i) · 16/6 to 15/9 (ii) · 16/9 to 15/12 (iii) · 16/12 to 15/3 (iv) · 16/3 to 31/3 (v) |
| r423 | Short-term capital gains taxable at the rate of 20% Enter value from item 5vib of schedule BFLA, if |
| r424 | Short-term capital gains taxable at the rate of 30% Enter value from item 5vii of schedule BFLA, if |
| r425 | Short-term capital gains taxable at applicable rates Enter value from item 5viii of schedule BFLA, i |
| r426 | Short-term capital gains taxable at DTAA rates Enter value from item 5ix of schedule BFLA, if any. |
| r428 | Long- term capital gains taxable at the rate of 12.5% Enter value from item 5xb of schedule BFLA, if |
| r430 | Long- term capital gains taxable at the rate DTAA rates Enter value from item 5xii of schedule BFLA, |
| r431 | Capital gains on transfer of Virtual Digital Asset taxable at the rate of 30% Enter value from item |

---

## 3 · The rules the sheet computes

Each rule is a formula the CG sheet carries, with its cell reference (STCG heads live in columns Q/S, LTCG likewise; helper sums live in named ranges). Only visible, rule-bearing formulas (caps, MIN/MAX, conditions, cross-sheet references) are listed; the department's validation rules from `rules.json` are cited by their `A`-number.

**Section 50C stamp-value substitution (STCG A1, LTCG B1).**
- **`Q10`** — A1aiii = `IF(Q9>(1.1*Q8),Q9,Q8)`: the stamp-valuation value (aii) is adopted only when it exceeds actual consideration (ai) by more than 10%, else consideration stands (rule A405).
- **`Q140`** — B1aiii = `IF(Q139>(1.1*Q138),Q139,Q138)`: same 10% band for LTCG land/building (rule A406).

**Section 48 deduction totals and balances.**
- **`Q16`** = `SUM(Q12:Q15)` — A1 bv Total (bi+bii+biii+biv), rule A348; **`Q17`** — A1c Balance = `Q10-Q16` (aiii − bv), rule A349.
- **`Q46`/`Q57`** — A3 ibv / iibv totals; **`Q47`** — A3ic = `A2ia_FullConsideration_ii − A2ibiv_TotalDedn_ii`; **`Q58`** — A3iic balance (rules A352/A353, A417/A418).
- **`Q78`** — A5 bv total; **`Q79`** — A5c balance = `A4a_FullConsideration − A4biv_TotalDedn` (rules A357/A358).
- **`Q94`** — A6 bv total; **`Q95`** — A6c balance = `A5a_FullConsideration − A5biv_TotalDedn` (rules A362/A363).
- LTCG: **`Q149`** B1 biv = bi+bii+biia+biii (rule A366); **`Q150`** B1c = `Q140-Q149` (rule A367); **`Q197`** B3 bv (rule A371); **`Q229`/`Q245`/`Q261`/`Q277`** the four non-resident B6 sub-block bv totals; **`Q298`** B8 bv (rule A381); **`Q299`** B8c balance (rule A382).

**Floor-at-zero deduction logic (loss passes through, gain reduced by exemption).**
- **`S22`** — A1e = `IF(Q17<0,Q17,MAX(0,Q17-Q21))` (rule A350). **`Q21`** — A1 total deduction 54G/54GA = `SUM(Q18:Q20)`.
- **`S157`** — B1e = `IF(Q150<0,Q150,MAX(0,Q150-Q156))` (rule A368). **`Q151`/`Q156`** — B1 total deduction 54D/54EC/54G/54GA = `SUM(Q152:Q155)`.
- **`S176`** — B2e = `IF(SlumpBalance<0,SlumpBalance,MAX(0,SlumpBalance-DeductionUnderSec54))` (rule A369). **`S304`** — B8e = `IF(B7c_BalanceCG<0,…,MAX(0,B7c_BalanceCG−B7d_ExemptionGrandTotal))` (rule A383). **`Q303`** — B8d = `SUM(Q300:Q302)`.

**Slump sale (higher-of FMV).**
- **`Q36`** — A2aiii = `MAX(A20iia_FullConsideration11UAEii, A20ia_FullConsideration11UAEi)` (rule A408). **`S38`** — A2c = `FullConsideration − NetWorthOfDivision` (rule A351).
- **`Q172`** — B2aiii = `MAX(FullConsiderationUAEi, FullConsiderationUAEii)` (rule A409). **`Q174`** — B2c = `FullConsideration − NetWorthOfDivision` (rule A370).

**Section 50CA unquoted-shares substitution (higher of consideration or FMV).**
- **`Q70`** (A5), **`Q86`** (A6), **`Q221`** (B6-i), **`Q237`** (B6-ii), **`Q253`** (B6-iii), **`Q269`** (B6-iv), **`Q290`** (B8) each = `MAX(<full consideration unquoted>, <FMV unquoted>)` (rules A355/A360, A374/A379); the total (ic + ii) rows `Q72/Q88/Q223/Q239/Q255/Q271/Q292` = `SUM(ic, ii)` (rules A356/A361, A375/A380).

**Deemed STCG on depreciable assets.**
- **`Q97`** — A6e = `DCG.TotalDepreciation`: pulled from Sl.No.6 of Schedule DCG (rule A326). **`S102`** — A6g = `IF(A5c+A5d+A8_DeemedStcgOnAssets<0, …, 6c+6d+6e−6f)` (rule A407).

**112A / 115AD cross-schedule pulls.**
- **`S207`** — B4 = `ROUND(Total_Balance_112A,0)`: total of column 14 of Schedule 112A (rules A373, A421). **`S281`** — B7 = `ROUND(Total_Balance_115AD,0)`: column 14 of Schedule 115AD(1)(b)(iii) proviso (rule A378).

**Deemed capital gains (u/s 54G/54GA carry-forward, 45(4) r.w. 9B).**
- **`S114`** — A7 = `SUM(A7_AmtNotUsed_1, A7_AmtNotUsed_2 + 7b.AmountDeemedOtherthan_a + AmtDeemedStcg45iv)` (rule A364). **`S322`** — B9 = `SUM(B9_AmtNotUsed_1, B8.AmountDeemedOtherThan_a, AmtDeemedLtcg45iv)` (rule A384). A7c/B9c = "as per Section 45(4) read with Section 9B" (r113/r319).

**Pass-through income.**
- **`S115`** — A8 = `SUM(Q117:Q119)` (8a@20% + 8b@30% + 8c applicable) (rule A365). **`S325`** — B10 = `SUM(LTCG_PTI_125Percent_112A, LTCG_PTI_125Percent)` (10a1@12.5% u/s 112A + 10a2@12.5% other) (rule A385).

**DTAA — resident vs non-resident and lower-of-treaty-or-Act rate.**
- **`W8`** — ResidentialCheck = `IF(MID(sheet1.ResidentialStatus1,1,2)="RE","RE","NR")`: drives the DTAA columns and A9/B11 sums.
- **`P122`/`P123`** (STCG) and **`P333`/`P334`** (LTCG) — Applicable rate (col.10) = `IF(ResidentialCheck="NR", IF(MID(certificate,1,1)="Y", MIN(treaty,ITAct), ""), MIN(treaty,ITAct))` (rules A403/A404, A450).
- **`S125`** — A9a and **`S126`** — A9b computed only when `MID(sheet1.ResidentialStatus1,1,3)="NRI"`, summing DTAA rows via `SUMIFS(STCG.A8_StcgAmt, …CertiStatus,"Yes"…)`; **`S336`/`S337`** — B11a/B11b are the LTCG companions. Rule A420 warns residents that a DTAA rate claim may be disallowed.

**Buy-back capital loss (post-01-Oct-2024).**
- **`V129`/`W129`/`X129`** — STCG buy-back loss split by rate = `SUMIF(...CapitalLoss20r30rapplicablerate, "i. …20%"/"ii. …30%"/"iii. …applicable rate", amt)`; **`S128`** — A(A) = `SUM(...CapitalLoss20r30rapplicablerate_amt)`, capped ≤ 0 (schema max 0). LTCG **`V341`/`W341`** split "…10%"/"…12.5%". Buy-back loss is claimable only if the corresponding buy-back income is offered under IFOS (sheet caption r128/r339).

**Totals and summary.**
- **`S133`** — A10 = A1e+A2c+A3e+A4a+A4b+A5e+A6g+A7+A8−A9a+A(A) (rule A449).
- **`S344`** — B12 = B1g+B2e+B3c+B4+B5+B6c+B7+B8e+B9+B10−B11a+B(A) (rule A338).
- **`S345`** — C1 = sum of the "8ii…8vii" current-year-gain columns of Table E (rule A339). **`S346`** — C2 = `MAX(0, VDA.TotalIncomeCG)` (rule A413). **`S347`** — C3 = `MAX(0, SUM(IncomeVDA, C_TotScheduleCGFor23))` = C1 + C2 (rule A412).
- **`O374`** — D1e = `SUM(AmtDeducted54D, EC, G, GA)` (rule A386); rule A397 requires D-table totals to equal the deductions actually claimed in A/B.
- LTCG immovable total **B1g** (`TotalLTCGImmblPrprty`) = ΣB1e over all properties (rule A443).

**Table E (set-off) — the matrix.** Each intersection cell is a bounded `MIN(loss remaining after prior columns, gain remaining after prior rows)`; row-i "Loss to be set off" cells are `ABS(MIN(0,<sum of that rate's gains/losses>))`; column-8/9 "remaining" = `MAX(0, gain − Σset-offs)`; row-viii/xi "Total loss set off" = Σ of the rate columns; row-ix/xii "Loss remaining" = loss − total set off (rules A387/A388, A428–A444). The whole matrix auto-populates from the A/B heads and is editable only via `EditAutopoulatedDetail` (r418).

**Cross-schedule guards (from `rules.json`).** A257 — amount reduced at BP A3b ≤ income offered in Sch CG. A285/A286 (DPM) and A296/A297 (DOA) — section-50 gain in the depreciation schedules ties to CG. A340–A347 — where full value of consideration is zero, section-48 expenses cannot be claimed. A410/A411/A448 — date of purchase & sale mandatory when B1 figures are positive, and land/building sale date cannot be after 31 March. A416/A445 — CGAS deposit rows require deposit date, account number and IFS code. A399–A403 / A414–A415 / A426–A427 — Table F quarter break-up of each bucket must equal the matching item of Schedule BFLA (5vi/5vii/5viii/5ix/5xa/5xb/5xi/5xii) and, for VDA (Sl.8), Schedule SI / item C2.


---

## 4 · Dropdowns

Every dropdown list on the CG sheet, with every value. Numeric-only validators (min/max with no value list, e.g. amount and rate cells) are not dropdowns and are omitted. The country and state lists are the department master lists.

**Cells `S104:S105`** — 4 values:

(Select), Yes, No, Not Applicable

**Cells `J110`** — 21 values:

(Select), 2001-02, 2002-03, 2003-04, 2004-05, 2005-06, 2006-07, 2007-08, 2008-09, 2009-10, 2010-11, 2011-12, 2012-13, 2013-14, 2014-15, 2015-16, 2016-17, 2017-18, 2018-19, 2019-20, 2020-21

**Cells `I312:I314`** — 4 values:

(Select), 54D, 54G, 54GA

**Cells `J122:J123 J333:J334`** — 250 values:

(Select), 93-AFGHANISTAN, 1001-ALAND ISLANDS, 355-ALBANIA, 213-ALGERIA, 684-AMERICAN SAMOA, 376-ANDORRA, 244-ANGOLA, 1264-ANGUILLA, 1010-ANTARCTICA, 1268-ANTIGUA AND BARBUDA, 54-ARGENTINA, 374-ARMENIA, 297-ARUBA, 61-AUSTRALIA, 43-AUSTRIA, 994-AZERBAIJAN, 1242-BAHAMAS, 973-BAHRAIN, 880-BANGLADESH, 1246-BARBADOS, 375-BELARUS, 32-BELGIUM, 501-BELIZE, 229-BENIN, 1441-BERMUDA, 975-BHUTAN, 591-BOLIVIA (PLURINATIONAL STATE OF), 1002-BONAIRE, SINT EUSTATIUS AND SABA, 387-BOSNIA AND HERZEGOVINA, 267-BOTSWANA, 1003-BOUVET ISLAND, 55-BRAZIL, 1014-BRITISH INDIAN OCEAN TERRITORY, 673-BRUNEI DARUSSALAM, 359-BULGARIA, 226-BURKINA FASO, 257-BURUNDI, 238-CABO VERDE, 855-CAMBODIA, 237-CAMEROON, 1-CANADA, 1345-CAYMAN ISLANDS, 236-CENTRAL AFRICAN REPUBLIC, 235-CHAD, 56-CHILE, 86-CHINA, 9-CHRISTMAS ISLAND, 672-COCOS (KEELING) ISLANDS, 57-COLOMBIA, 270-COMOROS, 242-CONGO, 243-CONGO (DEMOCRATIC REPUBLIC OF THE), 682-COOK ISLANDS, 506-COSTA RICA, 225-COTE DIVOIRE, 385-CROATIA, 53-CUBA, 1015-CURACAO, 357-CYPRUS, 420-CZECHIA, 45-DENMARK, 253-DJIBOUTI, 1767-DOMINICA, 1809-DOMINICAN REPUBLIC, 593-ECUADOR, 20-EGYPT, 503-EL SALVADOR, 240-EQUATORIAL GUINEA, 291-ERITREA, 372-ESTONIA, 251-ETHIOPIA, 500-FALKLAND ISLANDS (MALVINAS), 298-FAROE ISLANDS, 679-FIJI, 358-FINLAND, 33-FRANCE, 594-FRENCH GUIANA, 689-FRENCH POLYNESIA, 1004-FRENCH SOUTHERN TERRITORIES, 241-GABON, 220-GAMBIA, 995-GEORGIA, 49-GERMANY, 233-GHANA, 350-GIBRALTAR, 30-GREECE, 299-GREENLAND, 1473-GRENADA, 590-GUADELOUPE, 1671-GUAM, 502-GUATEMALA, 1481-GUERNSEY, 224-GUINEA, 245-GUINEA-BISSAU, 592-GUYANA, 509-HAITI, 1005-HEARD ISLAND AND MCDONALD ISLANDS, 6-HOLY SEE, 504-HONDURAS, 852-HONG KONG, 36-HUNGARY, 354-ICELAND, 62-INDONESIA, 98-IRAN (ISLAMIC REPUBLIC OF), 964-IRAQ, 353-IRELAND, 1624-ISLE OF MAN, 972-ISRAEL, 5-ITALY, 1876-JAMAICA, 81-JAPAN, 1534-JERSEY, 962-JORDAN, 7-KAZAKHSTAN, 254-KENYA, 686-KIRIBATI, 850-KOREA (DEMOCRATIC PEOPLES REPUBLIC OF), 82-KOREA (REPUBLIC OF), 965-KUWAIT, 996-KYRGYZSTAN, 856-LAO PEOPLES DEMOCRATIC REPUBLIC, 371-LATVIA, 961-LEBANON, 266-LESOTHO, 231-LIBERIA, 218-LIBYA, 423-LIECHTENSTEIN, 370-LITHUANIA, 352-LUXEMBOURG, 853-MACAO, 389-MACEDONIA (THE FORMER YUGOSLAV REPUBLIC OF), 261-MADAGASCAR, 265-MALAWI, 60-MALAYSIA, 960-MALDIVES, 223-MALI, 356-MALTA, 692-MARSHALL ISLANDS, 596-MARTINIQUE, 222-MAURITANIA, 230-MAURITIUS, 269-MAYOTTE, 52-MEXICO, 691-MICRONESIA (FEDERATED STATES OF), 373-MOLDOVA (REPUBLIC OF), 377-MONACO, 976-MONGOLIA, 382-MONTENEGRO, 1664-MONTSERRAT, 212-MOROCCO, 258-MOZAMBIQUE, 95-MYANMAR, 264-NAMIBIA, 674-NAURU, 977-NEPAL, 31-NETHERLANDS, 687-NEW CALEDONIA, 64-NEW ZEALAND, 505-NICARAGUA, 227-NIGER, 234-NIGERIA, 683-NIUE, 15-NORFOLK ISLAND, 1670-NORTHERN MARIANA ISLANDS, 47-NORWAY, 968-OMAN, 92-PAKISTAN, 680-PALAU, 970-PALESTINE, STATE OF, 507-PANAMA, 675-PAPUA NEW GUINEA, 595-PARAGUAY, 51-PERU, 63-PHILIPPINES, 1011-PITCAIRN, 48-POLAND, 14-PORTUGAL, 1787-PUERTO RICO, 974-QATAR, 262-REUNION, 40-ROMANIA, 8-RUSSIAN FEDERATION, 250-RWANDA, 1006-SAINT BARTHELEMY, 290-SAINT HELENA, ASCENSION AND TRISTAN DA CUNHA, 1869-SAINT KITTS AND NEVIS, 1758-SAINT LUCIA, 1007-SAINT MARTIN (FRENCH PART), 508-SAINT PIERRE AND MIQUELON, 1784-SAINT VINCENT AND THE GRENADINES, 685-SAMOA, 378-SAN MARINO, 239-SAO TOME AND PRINCIPE, 966-SAUDI ARABIA, 221-SENEGAL, 381-SERBIA, 248-SEYCHELLES, 232-SIERRA LEONE, 65-SINGAPORE, 1721-SINT MAARTEN (DUTCH PART), 421-SLOVAKIA, 386-SLOVENIA, 677-SOLOMON ISLANDS, 252-SOMALIA, 28-SOUTH AFRICA, 1008-SOUTH GEORGIA AND THE SOUTH SANDWICH ISLANDS, 211-SOUTH SUDAN, 35-SPAIN, 94-SRI LANKA, 249-SUDAN, 597-SURINAME, 1012-SVALBARD AND JAN MAYEN, 268-SWAZILAND, 46-SWEDEN, 41-SWITZERLAND, 963-SYRIAN ARAB REPUBLIC, 886-TAIWAN, PROVINCE OF CHINA[A], 992-TAJIKISTAN, 255-TANZANIA, UNITED REPUBLIC OF, 66-THAILAND, 670-TIMOR-LESTE(EAST TIMOR), 228-TOGO, 690-TOKELAU, 676-TONGA, 1868-TRINIDAD AND TOBAGO, 216-TUNISIA, 90-TURKEY, 993-TURKMENISTAN, 1649-TURKS AND CAICOS ISLANDS, 688-TUVALU, 256-UGANDA, 380-UKRAINE, 971-UNITED ARAB EMIRATES, 44-UNITED KINGDOM OF GREAT BRITAIN AND NORTHERN IRELAND, 2-UNITED STATES OF AMERICA, 1009-UNITED STATES MINOR OUTLYING ISLANDS, 598-URUGUAY, 998-UZBEKISTAN, 678-VANUATU, 58-VENEZUELA (BOLIVARIAN REPUBLIC OF), 84-VIET NAM, 1284-VIRGIN ISLANDS (BRITISH), 1340-VIRGIN ISLANDS (U.S.), 681-WALLIS AND FUTUNA, 1013-WESTERN SAHARA, 967-YEMEN, 260-ZAMBIA, 263-ZIMBABWE, 9999-OTHERS

**Cells `M122:M123`** — 3 values:

(Select), Yes, No

**Cells `S308:S309`** — 4 values:

(Select), Yes, No, Not Applicable

**Cells `M333:M334`** — 3 values:

(Select), Yes, No

**Cells `N160:N161 N25:N28`** — 39 values:

(Select), 01-Andaman and Nicobar Islands, 02-Andhra Pradesh, 03-Arunachal Pradesh, 04-Assam, 05-Bihar, 06-Chandigarh, 07-Dadra Nagar and Haveli, 08-Daman and Diu, 09-Delhi, 10-Goa, 11-Gujarat, 12-Haryana, 13-Himachal Pradesh, 14-Jammu and Kashmir, 15-Karnataka, 16-Kerala, 17-Lakshadweep, 18-Madhya Pradesh, 19-Maharashtra, 20-Manipur, 21-Meghalaya, 22-Mizoram, 23-Nagaland, 24-Odisha, 25-Puducherry, 26-Punjab, 27-Rajasthan, 28-Sikkim, 29-Tamil Nadu, 30-Tripura, 31-Uttar Pradesh, 32-West Bengal, 33-Chhattisgarh, 34-Uttarakhand, 35-Jharkhand, 36-Telangana, 37-Ladakh, 99-Foreign

**Cells `P25:P28`** — 251 values:

(select), 93-AFGHANISTAN, 1001-ALAND ISLANDS, 355-ALBANIA, 213-ALGERIA, 684-AMERICAN SAMOA, 376-ANDORRA, 244-ANGOLA, 1264-ANGUILLA, 1010-ANTARCTICA, 1268-ANTIGUA AND BARBUDA, 54-ARGENTINA, 374-ARMENIA, 297-ARUBA, 61-AUSTRALIA, 43-AUSTRIA, 994-AZERBAIJAN, 1242-BAHAMAS, 973-BAHRAIN, 880-BANGLADESH, 1246-BARBADOS, 375-BELARUS, 32-BELGIUM, 501-BELIZE, 229-BENIN, 1441-BERMUDA, 975-BHUTAN, 591-BOLIVIA (PLURINATIONAL STATE OF), 1002-BONAIRE, SINT EUSTATIUS AND SABA, 387-BOSNIA AND HERZEGOVINA, 267-BOTSWANA, 1003-BOUVET ISLAND, 55-BRAZIL, 1014-BRITISH INDIAN OCEAN TERRITORY, 673-BRUNEI DARUSSALAM, 359-BULGARIA, 226-BURKINA FASO, 257-BURUNDI, 238-CABO VERDE, 855-CAMBODIA, 237-CAMEROON, 1-CANADA, 1345-CAYMAN ISLANDS, 236-CENTRAL AFRICAN REPUBLIC, 235-CHAD, 56-CHILE, 86-CHINA, 9-CHRISTMAS ISLAND, 672-COCOS (KEELING) ISLANDS, 57-COLOMBIA, 270-COMOROS, 242-CONGO, 243-CONGO (DEMOCRATIC REPUBLIC OF THE), 682-COOK ISLANDS, 506-COSTA RICA, 225-COTE DIVOIRE, 385-CROATIA, 53-CUBA, 1015-CURACAO, 357-CYPRUS, 420-CZECHIA, 45-DENMARK, 253-DJIBOUTI, 1767-DOMINICA, 1809-DOMINICAN REPUBLIC, 593-ECUADOR, 20-EGYPT, 503-EL SALVADOR, 240-EQUATORIAL GUINEA, 291-ERITREA, 372-ESTONIA, 251-ETHIOPIA, 500-FALKLAND ISLANDS (MALVINAS), 298-FAROE ISLANDS, 679-FIJI, 358-FINLAND, 33-FRANCE, 594-FRENCH GUIANA, 689-FRENCH POLYNESIA, 1004-FRENCH SOUTHERN TERRITORIES, 241-GABON, 220-GAMBIA, 995-GEORGIA, 49-GERMANY, 233-GHANA, 350-GIBRALTAR, 30-GREECE, 299-GREENLAND, 1473-GRENADA, 590-GUADELOUPE, 1671-GUAM, 502-GUATEMALA, 1481-GUERNSEY, 224-GUINEA, 245-GUINEA-BISSAU, 592-GUYANA, 509-HAITI, 1005-HEARD ISLAND AND MCDONALD ISLANDS, 6-HOLY SEE, 504-HONDURAS, 852-HONG KONG, 36-HUNGARY, 354-ICELAND, 91-INDIA, 62-INDONESIA, 98-IRAN (ISLAMIC REPUBLIC OF), 964-IRAQ, 353-IRELAND, 1624-ISLE OF MAN, 972-ISRAEL, 5-ITALY, 1876-JAMAICA, 81-JAPAN, 1534-JERSEY, 962-JORDAN, 7-KAZAKHSTAN, 254-KENYA, 686-KIRIBATI, 850-KOREA (DEMOCRATIC PEOPLES REPUBLIC OF), 82-KOREA (REPUBLIC OF), 965-KUWAIT, 996-KYRGYZSTAN, 856-LAO PEOPLES DEMOCRATIC REPUBLIC, 371-LATVIA, 961-LEBANON, 266-LESOTHO, 231-LIBERIA, 218-LIBYA, 423-LIECHTENSTEIN, 370-LITHUANIA, 352-LUXEMBOURG, 853-MACAO, 389-MACEDONIA (THE FORMER YUGOSLAV REPUBLIC OF), 261-MADAGASCAR, 265-MALAWI, 60-MALAYSIA, 960-MALDIVES, 223-MALI, 356-MALTA, 692-MARSHALL ISLANDS, 596-MARTINIQUE, 222-MAURITANIA, 230-MAURITIUS, 269-MAYOTTE, 52-MEXICO, 691-MICRONESIA (FEDERATED STATES OF), 373-MOLDOVA (REPUBLIC OF), 377-MONACO, 976-MONGOLIA, 382-MONTENEGRO, 1664-MONTSERRAT, 212-MOROCCO, 258-MOZAMBIQUE, 95-MYANMAR, 264-NAMIBIA, 674-NAURU, 977-NEPAL, 31-NETHERLANDS, 687-NEW CALEDONIA, 64-NEW ZEALAND, 505-NICARAGUA, 227-NIGER, 234-NIGERIA, 683-NIUE, 15-NORFOLK ISLAND, 1670-NORTHERN MARIANA ISLANDS, 47-NORWAY, 968-OMAN, 92-PAKISTAN, 680-PALAU, 970-PALESTINE, STATE OF, 507-PANAMA, 675-PAPUA NEW GUINEA, 595-PARAGUAY, 51-PERU, 63-PHILIPPINES, 1011-PITCAIRN, 48-POLAND, 14-PORTUGAL, 1787-PUERTO RICO, 974-QATAR, 262-REUNION, 40-ROMANIA, 8-RUSSIAN FEDERATION, 250-RWANDA, 1006-SAINT BARTHELEMY, 290-SAINT HELENA, ASCENSION AND TRISTAN DA CUNHA, 1869-SAINT KITTS AND NEVIS, 1758-SAINT LUCIA, 1007-SAINT MARTIN (FRENCH PART), 508-SAINT PIERRE AND MIQUELON, 1784-SAINT VINCENT AND THE GRENADINES, 685-SAMOA, 378-SAN MARINO, 239-SAO TOME AND PRINCIPE, 966-SAUDI ARABIA, 221-SENEGAL, 381-SERBIA, 248-SEYCHELLES, 232-SIERRA LEONE, 65-SINGAPORE, 1721-SINT MAARTEN (DUTCH PART), 421-SLOVAKIA, 386-SLOVENIA, 677-SOLOMON ISLANDS, 252-SOMALIA, 28-SOUTH AFRICA, 1008-SOUTH GEORGIA AND THE SOUTH SANDWICH ISLANDS, 211-SOUTH SUDAN, 35-SPAIN, 94-SRI LANKA, 249-SUDAN, 597-SURINAME, 1012-SVALBARD AND JAN MAYEN, 268-SWAZILAND, 46-SWEDEN, 41-SWITZERLAND, 963-SYRIAN ARAB REPUBLIC, 886-TAIWAN, PROVINCE OF CHINA[A], 992-TAJIKISTAN, 255-TANZANIA, UNITED REPUBLIC OF, 66-THAILAND, 670-TIMOR-LESTE(EAST TIMOR), 228-TOGO, 690-TOKELAU, 676-TONGA, 1868-TRINIDAD AND TOBAGO, 216-TUNISIA, 90-TURKEY, 993-TURKMENISTAN, 1649-TURKS AND CAICOS ISLANDS, 688-TUVALU, 256-UGANDA, 380-UKRAINE, 971-UNITED ARAB EMIRATES, 44-UNITED KINGDOM OF GREAT BRITAIN AND NORTHERN IRELAND, 2-UNITED STATES OF AMERICA, 1009-UNITED STATES MINOR OUTLYING ISLANDS, 598-URUGUAY, 998-UZBEKISTAN, 678-VANUATU, 58-VENEZUELA (BOLIVARIAN REPUBLIC OF), 84-VIET NAM, 1284-VIRGIN ISLANDS (BRITISH), 1340-VIRGIN ISLANDS (U.S.), 681-WALLIS AND FUTUNA, 1013-WESTERN SAHARA, 967-YEMEN, 260-ZAMBIA, 263-ZIMBABWE, 9999-OTHERS

**Cells `P160:P161`** — 251 values:

(select), 93-AFGHANISTAN, 1001-ALAND ISLANDS, 355-ALBANIA, 213-ALGERIA, 684-AMERICAN SAMOA, 376-ANDORRA, 244-ANGOLA, 1264-ANGUILLA, 1010-ANTARCTICA, 1268-ANTIGUA AND BARBUDA, 54-ARGENTINA, 374-ARMENIA, 297-ARUBA, 61-AUSTRALIA, 43-AUSTRIA, 994-AZERBAIJAN, 1242-BAHAMAS, 973-BAHRAIN, 880-BANGLADESH, 1246-BARBADOS, 375-BELARUS, 32-BELGIUM, 501-BELIZE, 229-BENIN, 1441-BERMUDA, 975-BHUTAN, 591-BOLIVIA (PLURINATIONAL STATE OF), 1002-BONAIRE, SINT EUSTATIUS AND SABA, 387-BOSNIA AND HERZEGOVINA, 267-BOTSWANA, 1003-BOUVET ISLAND, 55-BRAZIL, 1014-BRITISH INDIAN OCEAN TERRITORY, 673-BRUNEI DARUSSALAM, 359-BULGARIA, 226-BURKINA FASO, 257-BURUNDI, 238-CABO VERDE, 855-CAMBODIA, 237-CAMEROON, 1-CANADA, 1345-CAYMAN ISLANDS, 236-CENTRAL AFRICAN REPUBLIC, 235-CHAD, 56-CHILE, 86-CHINA, 9-CHRISTMAS ISLAND, 672-COCOS (KEELING) ISLANDS, 57-COLOMBIA, 270-COMOROS, 242-CONGO, 243-CONGO (DEMOCRATIC REPUBLIC OF THE), 682-COOK ISLANDS, 506-COSTA RICA, 225-COTE DIVOIRE, 385-CROATIA, 53-CUBA, 1015-CURACAO, 357-CYPRUS, 420-CZECHIA, 45-DENMARK, 253-DJIBOUTI, 1767-DOMINICA, 1809-DOMINICAN REPUBLIC, 593-ECUADOR, 20-EGYPT, 503-EL SALVADOR, 240-EQUATORIAL GUINEA, 291-ERITREA, 372-ESTONIA, 251-ETHIOPIA, 500-FALKLAND ISLANDS (MALVINAS), 298-FAROE ISLANDS, 679-FIJI, 358-FINLAND, 33-FRANCE, 594-FRENCH GUIANA, 689-FRENCH POLYNESIA, 1004-FRENCH SOUTHERN TERRITORIES, 241-GABON, 220-GAMBIA, 995-GEORGIA, 49-GERMANY, 233-GHANA, 350-GIBRALTAR, 30-GREECE, 299-GREENLAND, 1473-GRENADA, 590-GUADELOUPE, 1671-GUAM, 502-GUATEMALA, 1481-GUERNSEY, 224-GUINEA, 245-GUINEA-BISSAU, 592-GUYANA, 509-HAITI, 1005-HEARD ISLAND AND MCDONALD ISLANDS, 6-HOLY SEE, 504-HONDURAS, 852-HONG KONG, 36-HUNGARY, 354-ICELAND, 91-INDIA, 62-INDONESIA, 98-IRAN (ISLAMIC REPUBLIC OF), 964-IRAQ, 353-IRELAND, 1624-ISLE OF MAN, 972-ISRAEL, 5-ITALY, 1876-JAMAICA, 81-JAPAN, 1534-JERSEY, 962-JORDAN, 7-KAZAKHSTAN, 254-KENYA, 686-KIRIBATI, 850-KOREA (DEMOCRATIC PEOPLES REPUBLIC OF), 82-KOREA (REPUBLIC OF), 965-KUWAIT, 996-KYRGYZSTAN, 856-LAO PEOPLES DEMOCRATIC REPUBLIC, 371-LATVIA, 961-LEBANON, 266-LESOTHO, 231-LIBERIA, 218-LIBYA, 423-LIECHTENSTEIN, 370-LITHUANIA, 352-LUXEMBOURG, 853-MACAO, 389-MACEDONIA (THE FORMER YUGOSLAV REPUBLIC OF), 261-MADAGASCAR, 265-MALAWI, 60-MALAYSIA, 960-MALDIVES, 223-MALI, 356-MALTA, 692-MARSHALL ISLANDS, 596-MARTINIQUE, 222-MAURITANIA, 230-MAURITIUS, 269-MAYOTTE, 52-MEXICO, 691-MICRONESIA (FEDERATED STATES OF), 373-MOLDOVA (REPUBLIC OF), 377-MONACO, 976-MONGOLIA, 382-MONTENEGRO, 1664-MONTSERRAT, 212-MOROCCO, 258-MOZAMBIQUE, 95-MYANMAR, 264-NAMIBIA, 674-NAURU, 977-NEPAL, 31-NETHERLANDS, 687-NEW CALEDONIA, 64-NEW ZEALAND, 505-NICARAGUA, 227-NIGER, 234-NIGERIA, 683-NIUE, 15-NORFOLK ISLAND, 1670-NORTHERN MARIANA ISLANDS, 47-NORWAY, 968-OMAN, 92-PAKISTAN, 680-PALAU, 970-PALESTINE, STATE OF, 507-PANAMA, 675-PAPUA NEW GUINEA, 595-PARAGUAY, 51-PERU, 63-PHILIPPINES, 1011-PITCAIRN, 48-POLAND, 14-PORTUGAL, 1787-PUERTO RICO, 974-QATAR, 262-REUNION, 40-ROMANIA, 8-RUSSIAN FEDERATION, 250-RWANDA, 1006-SAINT BARTHELEMY, 290-SAINT HELENA, ASCENSION AND TRISTAN DA CUNHA, 1869-SAINT KITTS AND NEVIS, 1758-SAINT LUCIA, 1007-SAINT MARTIN (FRENCH PART), 508-SAINT PIERRE AND MIQUELON, 1784-SAINT VINCENT AND THE GRENADINES, 685-SAMOA, 378-SAN MARINO, 239-SAO TOME AND PRINCIPE, 966-SAUDI ARABIA, 221-SENEGAL, 381-SERBIA, 248-SEYCHELLES, 232-SIERRA LEONE, 65-SINGAPORE, 1721-SINT MAARTEN (DUTCH PART), 421-SLOVAKIA, 386-SLOVENIA, 677-SOLOMON ISLANDS, 252-SOMALIA, 28-SOUTH AFRICA, 1008-SOUTH GEORGIA AND THE SOUTH SANDWICH ISLANDS, 211-SOUTH SUDAN, 35-SPAIN, 94-SRI LANKA, 249-SUDAN, 597-SURINAME, 1012-SVALBARD AND JAN MAYEN, 268-SWAZILAND, 46-SWEDEN, 41-SWITZERLAND, 963-SYRIAN ARAB REPUBLIC, 886-TAIWAN, PROVINCE OF CHINA[A], 992-TAJIKISTAN, 255-TANZANIA, UNITED REPUBLIC OF, 66-THAILAND, 670-TIMOR-LESTE(EAST TIMOR), 228-TOGO, 690-TOKELAU, 676-TONGA, 1868-TRINIDAD AND TOBAGO, 216-TUNISIA, 90-TURKEY, 993-TURKMENISTAN, 1649-TURKS AND CAICOS ISLANDS, 688-TUVALU, 256-UGANDA, 380-UKRAINE, 971-UNITED ARAB EMIRATES, 44-UNITED KINGDOM OF GREAT BRITAIN AND NORTHERN IRELAND, 2-UNITED STATES OF AMERICA, 1009-UNITED STATES MINOR OUTLYING ISLANDS, 598-URUGUAY, 998-UZBEKISTAN, 678-VANUATU, 58-VENEZUELA (BOLIVARIAN REPUBLIC OF), 84-VIET NAM, 1284-VIRGIN ISLANDS (BRITISH), 1340-VIRGIN ISLANDS (U.S.), 681-WALLIS AND FUTUNA, 1013-WESTERN SAHARA, 967-YEMEN, 260-ZAMBIA, 263-ZIMBABWE, 9999-OTHERS

**Cells `I108:I109`** — 3 values:

(Select), 54G, 54GA

**Cells `G130:K132`** — 4 values:

(Select), i. Loss from buy back of 'shares taxable at 20%', ii. Loss from buy back of 'shares taxable at 30%', iii.  Loss from buy back of 'shares taxable at applicable rate'

**Cells `J108:J109`** — 5 values:

(Select), 2022-23, 2023-24, 2024-25, 2025-26

**Cells `H312:H314 H108:H109`** — 4 values:

(Select), 2022-23, 2023-24, 2024-25

**Cells `J312:J314`** — 4 values:

(Select), 2023-24, 2024-25, 2025-26

**Cells `G341:K342`** — 2 values:

(Select), Loss from buy back of 'shares taxable at 12.5%


---

## 5 · What repeats and what is one figure

**Arrays (repeat — one object per transaction/row):**
- `ShortTermCapGain.SaleofLandBuild.SaleofLandBuildDtls[]` and `LongTermCapGain.SaleofLandBuild.SaleofLandBuildDtls[]` — one per property; each carries a per-property buyer table `TrnsfImmblPrprty.TrnsfImmblPrprtyDtls[]` (rows r25–r28 STCG, r160–r161 LTCG) and an exemption table `ExemptionOrDednUs54.ExemptionOrDednUs54Dtls[]`.
- `ShortTermCapGain.EquityMFonSTT[]` (maxItems 2 — the A3i/A3ii sub-heads, `MFSectionCode` = `1A` or `5AD1biip`).
- `LongTermCapGain.NRIOnSec112and115.NRIOnSec112and115Dtls[]` (maxItems 4 — the B6 sub-blocks, `SectionCode` = `21ciii`,`5AC1c`,`5AB1b`,`5ADiii`).
- `ShortTermCapGain.UnutilizedCg.UnutilizedCgPrvYrDtls[]` and `LongTermCapGain.UnutilizedCg.UnutilizedCgPrvYrDtls[]` (deemed-gain previous-year detail).
- `ShortTermCapGain.NRICgDTAA.NRIDTAADtls[]` and `LongTermCapGain.NRICgDTAA.NRIDTAADtls[]` (one per DTAA claim).
- `ShortTermCapGain.CapitalLossBuyBackShares.CapitalLossBuyBackSharesDtls[]` (maxItems 3; `Rate` = `STL20`,`STL30`,`STLAR`).
- `SaleofLandBuildDtls[].ExemptionOrDednUs54.ExemptionOrDednUs54Dtls[]` and `SaleOnOtherAssets.ExemptionOrDednUs54.ExemptionOrDednUs54Dtls[]` (maxItems 3), `SaleofAssetNADtls.SaleofAssetNA.ExemptionOrDednUs54.…Dtls[]`.
- `DeducClaimInfo.DeducClaimDtlsUs54D[]`, `…Us54EC[]`, `…Us54G[]`, `…Us54GA[]` (one per deduction claim, with CGAS account/IFSC).

**Single figures (one value each):** the computed head totals and summaries — `TotalSTCG` (A10), `TotalLTCG` (B12), `SumOfCGIncm` (C1), `IncmFromVDATrnsf` (C2), `IncChargeableHeadCapGain` (C3), `TotalAmtDeemedStcg`/`TotalAmtDeemedLtcg`, `PassThrIncNatureSTCG`/`PassThrIncNatureLTCG` (and their per-rate splits), `TotalAmtNotTaxUsDTAAStcg`/`…Ltcg`, `TotalAmtTaxUsDTAAStcg`/`…Ltcg`, `TotalCapitalLossBuyBackShares` (both ST and LT), `TotDeductClaim` (D1e), `SlumpSaleInStcg`/`SlumpSaleInLtcgDtls.SlumpSaleInLtcg`, `NRITransacSec48Dtl`, `NRISecur115AD`, `SaleOnOtherAssets`, `SaleOfEquityShareUs112A`, `NRIProvisoSec48`, `NRISaleOfEquityShareUs112A`, `SaleofAssetNADtls.SaleofAssetNA`, and the whole `CurrYrLosses` set-off matrix and the `AccruOrRecOfCG` quarter `DateRange` buckets.

**Single string/flag values:** `ShortTermCapGain.UnutilizedStcgFlag` and `LongTermCapGain.UnutilizedLtcgFlag` (enum `Y`,`N`,`X`), `EditAutopoulatedDetail` (enum `Y`,`N`).

---

## 6 · Mandatory — the required schema keys

Every schema leaf marked required (`*`) in block **`ScheduleCG`** (262 of 339 leaves), listed with its full path so the section-builder can bind each to its CG item. Gate 3 checks each of these leaf names appears verbatim in this book.

| Required schema key (leaf) | Full path | Type |
|---|---|---|
| `FullConsideration` | `ShortTermCapGain.SaleofLandBuild.SaleofLandBuildDtls[].FullConsideration` | integer |
| `PropertyValuation` | `ShortTermCapGain.SaleofLandBuild.SaleofLandBuildDtls[].PropertyValuation` | integer |
| `FullConsideration50C` | `ShortTermCapGain.SaleofLandBuild.SaleofLandBuildDtls[].FullConsideration50C` | integer |
| `Reduction48iii` | `ShortTermCapGain.SaleofLandBuild.SaleofLandBuildDtls[].Reduction48iii` | integer |
| `AquisitCost` | `ShortTermCapGain.SaleofLandBuild.SaleofLandBuildDtls[].AquisitCost` | integer |
| `ImproveCost` | `ShortTermCapGain.SaleofLandBuild.SaleofLandBuildDtls[].ImproveCost` | integer |
| `ExpOnTrans` | `ShortTermCapGain.SaleofLandBuild.SaleofLandBuildDtls[].ExpOnTrans` | integer |
| `TotalDedn` | `ShortTermCapGain.SaleofLandBuild.SaleofLandBuildDtls[].TotalDedn` | integer |
| `Balance` | `ShortTermCapGain.SaleofLandBuild.SaleofLandBuildDtls[].Balance` | integer |
| `ExemptionSecCode` | `ShortTermCapGain.SaleofLandBuild.SaleofLandBuildDtls[].ExemptionOrDednUs54.ExemptionOrDednUs54Dtls[].ExemptionSecCode` | string |
| `ExemptionAmount` | `ShortTermCapGain.SaleofLandBuild.SaleofLandBuildDtls[].ExemptionOrDednUs54.ExemptionOrDednUs54Dtls[].ExemptionAmount` | integer |
| `ExemptionGrandTotal` | `ShortTermCapGain.SaleofLandBuild.SaleofLandBuildDtls[].ExemptionOrDednUs54.ExemptionGrandTotal` | integer |
| `CapgainonAssets` | `ShortTermCapGain.SaleofLandBuild.SaleofLandBuildDtls[].CapgainonAssets` | integer |
| `NameOfBuyer` | `ShortTermCapGain.SaleofLandBuild.SaleofLandBuildDtls[].TrnsfImmblPrprty.TrnsfImmblPrprtyDtls[].NameOfBuyer` | string |
| `PercentageShare` | `ShortTermCapGain.SaleofLandBuild.SaleofLandBuildDtls[].TrnsfImmblPrprty.TrnsfImmblPrprtyDtls[].PercentageShare` | number |
| `Amount` | `ShortTermCapGain.SaleofLandBuild.SaleofLandBuildDtls[].TrnsfImmblPrprty.TrnsfImmblPrprtyDtls[].Amount` | integer |
| `AddressOfProperty` | `ShortTermCapGain.SaleofLandBuild.SaleofLandBuildDtls[].TrnsfImmblPrprty.TrnsfImmblPrprtyDtls[].AddressOfProperty` | string |
| `StateCode` | `ShortTermCapGain.SaleofLandBuild.SaleofLandBuildDtls[].TrnsfImmblPrprty.TrnsfImmblPrprtyDtls[].StateCode` | string |
| `FMV11UAEii` | `ShortTermCapGain.SlumpSaleInStcg.FMV11UAEii` | integer |
| `FMV11UAEiii` | `ShortTermCapGain.SlumpSaleInStcg.FMV11UAEiii` | integer |
| `FullConsideration` | `ShortTermCapGain.SlumpSaleInStcg.FullConsideration` | integer |
| `NetWorthOfDivision` | `ShortTermCapGain.SlumpSaleInStcg.NetWorthOfDivision` | integer |
| `CapgainonAssets` | `ShortTermCapGain.SlumpSaleInStcg.CapgainonAssets` | integer |
| `MFSectionCode` | `ShortTermCapGain.EquityMFonSTT[].MFSectionCode` | string |
| `FullConsideration` | `ShortTermCapGain.EquityMFonSTT[].EquityMFonSTTDtls.FullConsideration` | integer |
| `Reduction48iii` | `ShortTermCapGain.EquityMFonSTT[].EquityMFonSTTDtls.DeductSec48.Reduction48iii` | integer |
| `AquisitCost` | `ShortTermCapGain.EquityMFonSTT[].EquityMFonSTTDtls.DeductSec48.AquisitCost` | integer |
| `ImproveCost` | `ShortTermCapGain.EquityMFonSTT[].EquityMFonSTTDtls.DeductSec48.ImproveCost` | integer |
| `ExpOnTrans` | `ShortTermCapGain.EquityMFonSTT[].EquityMFonSTTDtls.DeductSec48.ExpOnTrans` | integer |
| `TotalDedn` | `ShortTermCapGain.EquityMFonSTT[].EquityMFonSTTDtls.DeductSec48.TotalDedn` | integer |
| `BalanceCG` | `ShortTermCapGain.EquityMFonSTT[].EquityMFonSTTDtls.BalanceCG` | integer |
| `LossSec94of7Or94of8` | `ShortTermCapGain.EquityMFonSTT[].EquityMFonSTTDtls.LossSec94of7Or94of8` | integer |
| `CapgainonAssets` | `ShortTermCapGain.EquityMFonSTT[].EquityMFonSTTDtls.CapgainonAssets` | integer |
| `NRItaxSTTPaid` | `ShortTermCapGain.NRITransacSec48Dtl.NRItaxSTTPaid` | integer |
| `NRItaxSTTNotPaid` | `ShortTermCapGain.NRITransacSec48Dtl.NRItaxSTTNotPaid` | integer |
| `FullValueConsdRecvUnqshr` | `ShortTermCapGain.NRISecur115AD.FullValueConsdRecvUnqshr` | integer |
| `FairMrktValueUnqshr` | `ShortTermCapGain.NRISecur115AD.FairMrktValueUnqshr` | integer |
| `FullValueConsdSec50CA` | `ShortTermCapGain.NRISecur115AD.FullValueConsdSec50CA` | integer |
| `FullValueConsdOthUnqshr` | `ShortTermCapGain.NRISecur115AD.FullValueConsdOthUnqshr` | integer |
| `FullConsideration` | `ShortTermCapGain.NRISecur115AD.FullConsideration` | integer |
| `Reduction48iii` | `ShortTermCapGain.NRISecur115AD.DeductSec48.Reduction48iii` | integer |
| `AquisitCost` | `ShortTermCapGain.NRISecur115AD.DeductSec48.AquisitCost` | integer |
| `ImproveCost` | `ShortTermCapGain.NRISecur115AD.DeductSec48.ImproveCost` | integer |
| `ExpOnTrans` | `ShortTermCapGain.NRISecur115AD.DeductSec48.ExpOnTrans` | integer |
| `TotalDedn` | `ShortTermCapGain.NRISecur115AD.DeductSec48.TotalDedn` | integer |
| `BalanceCG` | `ShortTermCapGain.NRISecur115AD.BalanceCG` | integer |
| `LossSec94of7Or94of8` | `ShortTermCapGain.NRISecur115AD.LossSec94of7Or94of8` | integer |
| `CapgainonAssets` | `ShortTermCapGain.NRISecur115AD.CapgainonAssets` | integer |
| `FullValueConsdRecvUnqshr` | `ShortTermCapGain.SaleOnOtherAssets.FullValueConsdRecvUnqshr` | integer |
| `FairMrktValueUnqshr` | `ShortTermCapGain.SaleOnOtherAssets.FairMrktValueUnqshr` | integer |
| `FullValueConsdSec50CA` | `ShortTermCapGain.SaleOnOtherAssets.FullValueConsdSec50CA` | integer |
| `FullValueConsdOthUnqshr` | `ShortTermCapGain.SaleOnOtherAssets.FullValueConsdOthUnqshr` | integer |
| `FullConsideration` | `ShortTermCapGain.SaleOnOtherAssets.FullConsideration` | integer |
| `Reduction48iii` | `ShortTermCapGain.SaleOnOtherAssets.DeductSec48.Reduction48iii` | integer |
| `AquisitCost` | `ShortTermCapGain.SaleOnOtherAssets.DeductSec48.AquisitCost` | integer |
| `ImproveCost` | `ShortTermCapGain.SaleOnOtherAssets.DeductSec48.ImproveCost` | integer |
| `ExpOnTrans` | `ShortTermCapGain.SaleOnOtherAssets.DeductSec48.ExpOnTrans` | integer |
| `TotalDedn` | `ShortTermCapGain.SaleOnOtherAssets.DeductSec48.TotalDedn` | integer |
| `BalanceCG` | `ShortTermCapGain.SaleOnOtherAssets.BalanceCG` | integer |
| `LossSec94of7Or94of8` | `ShortTermCapGain.SaleOnOtherAssets.LossSec94of7Or94of8` | integer |
| `DeemedSTCGDeprAsset` | `ShortTermCapGain.SaleOnOtherAssets.DeemedSTCGDeprAsset` | integer |
| `ExemptionSecCode` | `ShortTermCapGain.SaleOnOtherAssets.ExemptionOrDednUs54.ExemptionOrDednUs54Dtls[].ExemptionSecCode` | string |
| `ExemptionAmount` | `ShortTermCapGain.SaleOnOtherAssets.ExemptionOrDednUs54.ExemptionOrDednUs54Dtls[].ExemptionAmount` | integer |
| `ExemptionGrandTotal` | `ShortTermCapGain.SaleOnOtherAssets.ExemptionOrDednUs54.ExemptionGrandTotal` | integer |
| `CapgainonAssets` | `ShortTermCapGain.SaleOnOtherAssets.CapgainonAssets` | integer |
| `PrvYrInWhichAsstTrnsfrd` | `ShortTermCapGain.UnutilizedCg.UnutilizedCgPrvYrDtls[].PrvYrInWhichAsstTrnsfrd` | string |
| `SectionClmd` | `ShortTermCapGain.UnutilizedCg.UnutilizedCgPrvYrDtls[].SectionClmd` | string |
| `AmtUnutilized` | `ShortTermCapGain.UnutilizedCg.UnutilizedCgPrvYrDtls[].AmtUnutilized` | integer |
| `TotalAmtDeemedStcg` | `ShortTermCapGain.TotalAmtDeemedStcg` | integer |
| `PassThrIncNatureSTCG` | `ShortTermCapGain.PassThrIncNatureSTCG` | integer |
| `DTAAamt` | `ShortTermCapGain.NRICgDTAA.NRIDTAADtls[].DTAAamt` | integer |
| `ItemNoincl` | `ShortTermCapGain.NRICgDTAA.NRIDTAADtls[].ItemNoincl` | string |
| `CountryName` | `ShortTermCapGain.NRICgDTAA.NRIDTAADtls[].CountryName` | string |
| `CountryCodeExcludingIndia` | `ShortTermCapGain.NRICgDTAA.NRIDTAADtls[].CountryCodeExcludingIndia` | string |
| `DTAAarticle` | `ShortTermCapGain.NRICgDTAA.NRIDTAADtls[].DTAAarticle` | string |
| `RateAsPerTreaty` | `ShortTermCapGain.NRICgDTAA.NRIDTAADtls[].RateAsPerTreaty` | number |
| `SecITAct` | `ShortTermCapGain.NRICgDTAA.NRIDTAADtls[].SecITAct` | string |
| `RateAsPerITAct` | `ShortTermCapGain.NRICgDTAA.NRIDTAADtls[].RateAsPerITAct` | number |
| `TotalAmtNotTaxUsDTAAStcg` | `ShortTermCapGain.TotalAmtNotTaxUsDTAAStcg` | integer |
| `TotalAmtTaxUsDTAAStcg` | `ShortTermCapGain.TotalAmtTaxUsDTAAStcg` | integer |
| `TotalCapitalLossBuyBackShares` | `ShortTermCapGain.CapitalLossBuyBackShares.TotalCapitalLossBuyBackShares` | integer |
| `CapitalLossBuyBackSharesDtls` | `ShortTermCapGain.CapitalLossBuyBackShares.CapitalLossBuyBackSharesDtls[]` | array |
| `Rate` | `ShortTermCapGain.CapitalLossBuyBackShares.CapitalLossBuyBackSharesDtls[].Rate` | string |
| `Amount` | `ShortTermCapGain.CapitalLossBuyBackShares.CapitalLossBuyBackSharesDtls[].Amount` | integer |
| `TotalSTCG` | `ShortTermCapGain.TotalSTCG` | integer |
| `FullConsideration` | `LongTermCapGain.SaleofLandBuild.SaleofLandBuildDtls[].FullConsideration` | integer |
| `PropertyValuation` | `LongTermCapGain.SaleofLandBuild.SaleofLandBuildDtls[].PropertyValuation` | integer |
| `FullConsideration50C` | `LongTermCapGain.SaleofLandBuild.SaleofLandBuildDtls[].FullConsideration50C` | integer |
| `AquisitCost` | `LongTermCapGain.SaleofLandBuild.SaleofLandBuildDtls[].AquisitCost` | integer |
| `AquisitCostIndex` | `LongTermCapGain.SaleofLandBuild.SaleofLandBuildDtls[].AquisitCostIndex` | integer |
| `ExpOnTrans` | `LongTermCapGain.SaleofLandBuild.SaleofLandBuildDtls[].ExpOnTrans` | integer |
| `TotalDedn` | `LongTermCapGain.SaleofLandBuild.SaleofLandBuildDtls[].TotalDedn` | integer |
| `Balance` | `LongTermCapGain.SaleofLandBuild.SaleofLandBuildDtls[].Balance` | integer |
| `ExemptionSecCode` | `LongTermCapGain.SaleofLandBuild.SaleofLandBuildDtls[].ExemptionOrDednUs54.ExemptionOrDednUs54Dtls[].ExemptionSecCode` | string |
| `ExemptionAmount` | `LongTermCapGain.SaleofLandBuild.SaleofLandBuildDtls[].ExemptionOrDednUs54.ExemptionOrDednUs54Dtls[].ExemptionAmount` | integer |
| `ExemptionGrandTotal` | `LongTermCapGain.SaleofLandBuild.SaleofLandBuildDtls[].ExemptionOrDednUs54.ExemptionGrandTotal` | integer |
| `CapgainonAssets` | `LongTermCapGain.SaleofLandBuild.SaleofLandBuildDtls[].CapgainonAssets` | integer |
| `NameOfBuyer` | `LongTermCapGain.SaleofLandBuild.SaleofLandBuildDtls[].TrnsfImmblPrprty.TrnsfImmblPrprtyDtls[].NameOfBuyer` | string |
| `PercentageShare` | `LongTermCapGain.SaleofLandBuild.SaleofLandBuildDtls[].TrnsfImmblPrprty.TrnsfImmblPrprtyDtls[].PercentageShare` | number |
| `Amount` | `LongTermCapGain.SaleofLandBuild.SaleofLandBuildDtls[].TrnsfImmblPrprty.TrnsfImmblPrprtyDtls[].Amount` | integer |
| `AddressOfProperty` | `LongTermCapGain.SaleofLandBuild.SaleofLandBuildDtls[].TrnsfImmblPrprty.TrnsfImmblPrprtyDtls[].AddressOfProperty` | string |
| `StateCode` | `LongTermCapGain.SaleofLandBuild.SaleofLandBuildDtls[].TrnsfImmblPrprty.TrnsfImmblPrprtyDtls[].StateCode` | string |
| `FMV11UAEii` | `LongTermCapGain.SlumpSaleInLtcgDtls.SlumpSaleInLtcg.FMV11UAEii` | integer |
| `FMV11UAEiii` | `LongTermCapGain.SlumpSaleInLtcgDtls.SlumpSaleInLtcg.FMV11UAEiii` | integer |
| `FullConsideration` | `LongTermCapGain.SlumpSaleInLtcgDtls.SlumpSaleInLtcg.FullConsideration` | integer |
| `NetWorthOfDivision` | `LongTermCapGain.SlumpSaleInLtcgDtls.SlumpSaleInLtcg.NetWorthOfDivision` | integer |
| `SlumpBalance` | `LongTermCapGain.SlumpSaleInLtcgDtls.SlumpSaleInLtcg.SlumpBalance` | integer |
| `DeductionUnderSec54` | `LongTermCapGain.SlumpSaleInLtcgDtls.SlumpSaleInLtcg.DeductionUnderSec54` | integer |
| `CapgainonAssets` | `LongTermCapGain.SlumpSaleInLtcgDtls.SlumpSaleInLtcg.CapgainonAssets` | integer |
| `Proviso112SectionCode` | `LongTermCapGain.Proviso112Applicable.Proviso112SectionCode` | string |
| `FullConsideration` | `LongTermCapGain.Proviso112Applicable.Proviso112Applicabledtls.FullConsideration` | integer |
| `Reduction48iii` | `LongTermCapGain.Proviso112Applicable.Proviso112Applicabledtls.DeductSec48.Reduction48iii` | integer |
| `AquisitCost` | `LongTermCapGain.Proviso112Applicable.Proviso112Applicabledtls.DeductSec48.AquisitCost` | integer |
| `ImproveCost` | `LongTermCapGain.Proviso112Applicable.Proviso112Applicabledtls.DeductSec48.ImproveCost` | integer |
| `ExpOnTrans` | `LongTermCapGain.Proviso112Applicable.Proviso112Applicabledtls.DeductSec48.ExpOnTrans` | integer |
| `TotalDedn` | `LongTermCapGain.Proviso112Applicable.Proviso112Applicabledtls.DeductSec48.TotalDedn` | integer |
| `BalanceCG` | `LongTermCapGain.Proviso112Applicable.Proviso112Applicabledtls.BalanceCG` | integer |
| `CapgainonAssets` | `LongTermCapGain.SaleOfEquityShareUs112A.CapgainonAssets` | integer |
| `BalanceCG` | `LongTermCapGain.NRIProvisoSec48.BalanceCG` | integer |
| `FullValueConsdRecvUnqshr` | `LongTermCapGain.NRIOnSec112and115.NRIOnSec112and115Dtls[].FullValueConsdRecvUnqshr` | integer |
| `FairMrktValueUnqshr` | `LongTermCapGain.NRIOnSec112and115.NRIOnSec112and115Dtls[].FairMrktValueUnqshr` | integer |
| `FullValueConsdSec50CA` | `LongTermCapGain.NRIOnSec112and115.NRIOnSec112and115Dtls[].FullValueConsdSec50CA` | integer |
| `FullValueConsdOthUnqshr` | `LongTermCapGain.NRIOnSec112and115.NRIOnSec112and115Dtls[].FullValueConsdOthUnqshr` | integer |
| `FullConsideration` | `LongTermCapGain.NRIOnSec112and115.NRIOnSec112and115Dtls[].FullConsideration` | integer |
| `Reduction48iii` | `LongTermCapGain.NRIOnSec112and115.NRIOnSec112and115Dtls[].DeductSec48.Reduction48iii` | integer |
| `AquisitCost` | `LongTermCapGain.NRIOnSec112and115.NRIOnSec112and115Dtls[].DeductSec48.AquisitCost` | integer |
| `ImproveCost` | `LongTermCapGain.NRIOnSec112and115.NRIOnSec112and115Dtls[].DeductSec48.ImproveCost` | integer |
| `ExpOnTrans` | `LongTermCapGain.NRIOnSec112and115.NRIOnSec112and115Dtls[].DeductSec48.ExpOnTrans` | integer |
| `TotalDedn` | `LongTermCapGain.NRIOnSec112and115.NRIOnSec112and115Dtls[].DeductSec48.TotalDedn` | integer |
| `BalanceCG` | `LongTermCapGain.NRIOnSec112and115.NRIOnSec112and115Dtls[].BalanceCG` | integer |
| `CapgainonAssets` | `LongTermCapGain.NRISaleOfEquityShareUs112A.CapgainonAssets` | integer |
| `FullValueConsdRecvUnqshr` | `LongTermCapGain.SaleofAssetNADtls.SaleofAssetNA.FullValueConsdRecvUnqshr` | integer |
| `FairMrktValueUnqshr` | `LongTermCapGain.SaleofAssetNADtls.SaleofAssetNA.FairMrktValueUnqshr` | integer |
| `FullValueConsdSec50CA` | `LongTermCapGain.SaleofAssetNADtls.SaleofAssetNA.FullValueConsdSec50CA` | integer |
| `FullValueConsdOthUnqshr` | `LongTermCapGain.SaleofAssetNADtls.SaleofAssetNA.FullValueConsdOthUnqshr` | integer |
| `FullConsideration` | `LongTermCapGain.SaleofAssetNADtls.SaleofAssetNA.FullConsideration` | integer |
| `Reduction48iii` | `LongTermCapGain.SaleofAssetNADtls.SaleofAssetNA.DeductSec48.Reduction48iii` | integer |
| `AquisitCost` | `LongTermCapGain.SaleofAssetNADtls.SaleofAssetNA.DeductSec48.AquisitCost` | integer |
| `ImproveCost` | `LongTermCapGain.SaleofAssetNADtls.SaleofAssetNA.DeductSec48.ImproveCost` | integer |
| `ExpOnTrans` | `LongTermCapGain.SaleofAssetNADtls.SaleofAssetNA.DeductSec48.ExpOnTrans` | integer |
| `TotalDedn` | `LongTermCapGain.SaleofAssetNADtls.SaleofAssetNA.DeductSec48.TotalDedn` | integer |
| `BalanceCG` | `LongTermCapGain.SaleofAssetNADtls.SaleofAssetNA.BalanceCG` | integer |
| `ExemptionSecCode` | `LongTermCapGain.SaleofAssetNADtls.SaleofAssetNA.ExemptionOrDednUs54.ExemptionOrDednUs54Dtls[].ExemptionSecCode` | string |
| `ExemptionAmount` | `LongTermCapGain.SaleofAssetNADtls.SaleofAssetNA.ExemptionOrDednUs54.ExemptionOrDednUs54Dtls[].ExemptionAmount` | integer |
| `ExemptionGrandTotal` | `LongTermCapGain.SaleofAssetNADtls.SaleofAssetNA.ExemptionOrDednUs54.ExemptionGrandTotal` | integer |
| `CapgainonAssets` | `LongTermCapGain.SaleofAssetNADtls.SaleofAssetNA.CapgainonAssets` | integer |
| `PrvYrInWhichAsstTrnsfrd` | `LongTermCapGain.UnutilizedCg.UnutilizedCgPrvYrDtls[].PrvYrInWhichAsstTrnsfrd` | string |
| `SectionClmd` | `LongTermCapGain.UnutilizedCg.UnutilizedCgPrvYrDtls[].SectionClmd` | string |
| `AmtUnutilized` | `LongTermCapGain.UnutilizedCg.UnutilizedCgPrvYrDtls[].AmtUnutilized` | integer |
| `TotalAmtDeemedLtcg` | `LongTermCapGain.TotalAmtDeemedLtcg` | integer |
| `PassThrIncNatureLTCG` | `LongTermCapGain.PassThrIncNatureLTCG` | integer |
| `DTAAamt` | `LongTermCapGain.NRICgDTAA.NRIDTAADtls[].DTAAamt` | integer |
| `ItemNoincl` | `LongTermCapGain.NRICgDTAA.NRIDTAADtls[].ItemNoincl` | string |
| `CountryName` | `LongTermCapGain.NRICgDTAA.NRIDTAADtls[].CountryName` | string |
| `CountryCodeExcludingIndia` | `LongTermCapGain.NRICgDTAA.NRIDTAADtls[].CountryCodeExcludingIndia` | string |
| `DTAAarticle` | `LongTermCapGain.NRICgDTAA.NRIDTAADtls[].DTAAarticle` | string |
| `RateAsPerTreaty` | `LongTermCapGain.NRICgDTAA.NRIDTAADtls[].RateAsPerTreaty` | number |
| `SecITAct` | `LongTermCapGain.NRICgDTAA.NRIDTAADtls[].SecITAct` | string |
| `RateAsPerITAct` | `LongTermCapGain.NRICgDTAA.NRIDTAADtls[].RateAsPerITAct` | number |
| `TotalAmtNotTaxUsDTAALtcg` | `LongTermCapGain.TotalAmtNotTaxUsDTAALtcg` | integer |
| `TotalAmtTaxUsDTAALtcg` | `LongTermCapGain.TotalAmtTaxUsDTAALtcg` | integer |
| `TotalCapitalLossBuyBackShares` | `LongTermCapGain.CapitalLossBuyBackShares.TotalCapitalLossBuyBackShares` | integer |
| `TotalLTCG` | `LongTermCapGain.TotalLTCG` | integer |
| `SumOfCGIncm` | `SumOfCGIncm` | integer |
| `IncmFromVDATrnsf` | `IncmFromVDATrnsf` | integer |
| `IncChargeableHeadCapGain` | `IncChargeableHeadCapGain` | integer |
| `DateofAcquisition` | `DeducClaimInfo.DeducClaimDtlsUs54D[].DateofAcquisition` | string |
| `AmtDeducted` | `DeducClaimInfo.DeducClaimDtlsUs54D[].AmtDeducted` | integer |
| `DateofTransfer` | `DeducClaimInfo.DeducClaimDtlsUs54EC[].DateofTransfer` | string |
| `AmtDeducted` | `DeducClaimInfo.DeducClaimDtlsUs54EC[].AmtDeducted` | integer |
| `DateofTransfer` | `DeducClaimInfo.DeducClaimDtlsUs54G[].DateofTransfer` | string |
| `AmtDeducted` | `DeducClaimInfo.DeducClaimDtlsUs54G[].AmtDeducted` | integer |
| `DateofTransfer` | `DeducClaimInfo.DeducClaimDtlsUs54GA[].DateofTransfer` | string |
| `AmtDeducted` | `DeducClaimInfo.DeducClaimDtlsUs54GA[].AmtDeducted` | integer |
| `TotDeductClaim` | `DeducClaimInfo.TotDeductClaim` | integer |
| `StclSetoff20Per` | `CurrYrLosses.InLossSetOff.StclSetoff20Per` | integer |
| `StclSetoff30Per` | `CurrYrLosses.InLossSetOff.StclSetoff30Per` | integer |
| `StclSetoffAppRate` | `CurrYrLosses.InLossSetOff.StclSetoffAppRate` | integer |
| `StclSetoffDTAARate` | `CurrYrLosses.InLossSetOff.StclSetoffDTAARate` | integer |
| `LtclSetOff12_5Per` | `CurrYrLosses.InLossSetOff.LtclSetOff12_5Per` | integer |
| `LtclSetOffDTAARate` | `CurrYrLosses.InLossSetOff.LtclSetOffDTAARate` | integer |
| `CurrYearIncome` | `CurrYrLosses.InStcg20Per.CurrYearIncome` | integer |
| `StclSetoff30Per` | `CurrYrLosses.InStcg20Per.StclSetoff30Per` | integer |
| `StclSetoffAppRate` | `CurrYrLosses.InStcg20Per.StclSetoffAppRate` | integer |
| `StclSetoffDTAARate` | `CurrYrLosses.InStcg20Per.StclSetoffDTAARate` | integer |
| `CurrYrCapGain` | `CurrYrLosses.InStcg20Per.CurrYrCapGain` | integer |
| `CurrYearIncome` | `CurrYrLosses.InStcg30Per.CurrYearIncome` | integer |
| `StclSetoff20Per` | `CurrYrLosses.InStcg30Per.StclSetoff20Per` | integer |
| `StclSetoffAppRate` | `CurrYrLosses.InStcg30Per.StclSetoffAppRate` | integer |
| `StclSetoffDTAARate` | `CurrYrLosses.InStcg30Per.StclSetoffDTAARate` | integer |
| `CurrYrCapGain` | `CurrYrLosses.InStcg30Per.CurrYrCapGain` | integer |
| `CurrYearIncome` | `CurrYrLosses.InStcgAppRate.CurrYearIncome` | integer |
| `StclSetoff20Per` | `CurrYrLosses.InStcgAppRate.StclSetoff20Per` | integer |
| `StclSetoff30Per` | `CurrYrLosses.InStcgAppRate.StclSetoff30Per` | integer |
| `StclSetoffDTAARate` | `CurrYrLosses.InStcgAppRate.StclSetoffDTAARate` | integer |
| `CurrYrCapGain` | `CurrYrLosses.InStcgAppRate.CurrYrCapGain` | integer |
| `CurrYearIncome` | `CurrYrLosses.InStcgDTAARate.CurrYearIncome` | integer |
| `StclSetoff20Per` | `CurrYrLosses.InStcgDTAARate.StclSetoff20Per` | integer |
| `StclSetoff30Per` | `CurrYrLosses.InStcgDTAARate.StclSetoff30Per` | integer |
| `StclSetoffAppRate` | `CurrYrLosses.InStcgDTAARate.StclSetoffAppRate` | integer |
| `CurrYrCapGain` | `CurrYrLosses.InStcgDTAARate.CurrYrCapGain` | integer |
| `CurrYearIncome` | `CurrYrLosses.InLtcg12_5Per.CurrYearIncome` | integer |
| `StclSetoff20Per` | `CurrYrLosses.InLtcg12_5Per.StclSetoff20Per` | integer |
| `StclSetoff30Per` | `CurrYrLosses.InLtcg12_5Per.StclSetoff30Per` | integer |
| `StclSetoffAppRate` | `CurrYrLosses.InLtcg12_5Per.StclSetoffAppRate` | integer |
| `StclSetoffDTAARate` | `CurrYrLosses.InLtcg12_5Per.StclSetoffDTAARate` | integer |
| `LtclSetOffDTAARate` | `CurrYrLosses.InLtcg12_5Per.LtclSetOffDTAARate` | integer |
| `CurrYrCapGain` | `CurrYrLosses.InLtcg12_5Per.CurrYrCapGain` | integer |
| `CurrYearIncome` | `CurrYrLosses.InLtcgDTAARate.CurrYearIncome` | integer |
| `StclSetoff20Per` | `CurrYrLosses.InLtcgDTAARate.StclSetoff20Per` | integer |
| `StclSetoff30Per` | `CurrYrLosses.InLtcgDTAARate.StclSetoff30Per` | integer |
| `StclSetoffAppRate` | `CurrYrLosses.InLtcgDTAARate.StclSetoffAppRate` | integer |
| `StclSetoffDTAARate` | `CurrYrLosses.InLtcgDTAARate.StclSetoffDTAARate` | integer |
| `LtclSetOff12_5Per` | `CurrYrLosses.InLtcgDTAARate.LtclSetOff12_5Per` | integer |
| `CurrYrCapGain` | `CurrYrLosses.InLtcgDTAARate.CurrYrCapGain` | integer |
| `StclSetoff20Per` | `CurrYrLosses.TotLossSetOff.StclSetoff20Per` | integer |
| `StclSetoff30Per` | `CurrYrLosses.TotLossSetOff.StclSetoff30Per` | integer |
| `StclSetoffAppRate` | `CurrYrLosses.TotLossSetOff.StclSetoffAppRate` | integer |
| `StclSetoffDTAARate` | `CurrYrLosses.TotLossSetOff.StclSetoffDTAARate` | integer |
| `LtclSetOff12_5Per` | `CurrYrLosses.TotLossSetOff.LtclSetOff12_5Per` | integer |
| `LtclSetOffDTAARate` | `CurrYrLosses.TotLossSetOff.LtclSetOffDTAARate` | integer |
| `StclSetoff20Per` | `CurrYrLosses.LossRemainSetOff.StclSetoff20Per` | integer |
| `StclSetoff30Per` | `CurrYrLosses.LossRemainSetOff.StclSetoff30Per` | integer |
| `StclSetoffAppRate` | `CurrYrLosses.LossRemainSetOff.StclSetoffAppRate` | integer |
| `StclSetoffDTAARate` | `CurrYrLosses.LossRemainSetOff.StclSetoffDTAARate` | integer |
| `LtclSetOff12_5Per` | `CurrYrLosses.LossRemainSetOff.LtclSetOff12_5Per` | integer |
| `LtclSetOffDTAARate` | `CurrYrLosses.LossRemainSetOff.LtclSetOffDTAARate` | integer |
| `Upto15Of6` | `AccruOrRecOfCG.ShortTermUnder20Per.DateRange.Upto15Of6` | integer |
| `Upto15Of9` | `AccruOrRecOfCG.ShortTermUnder20Per.DateRange.Upto15Of9` | integer |
| `Up16Of9To15Of12` | `AccruOrRecOfCG.ShortTermUnder20Per.DateRange.Up16Of9To15Of12` | integer |
| `Up16Of12To15Of3` | `AccruOrRecOfCG.ShortTermUnder20Per.DateRange.Up16Of12To15Of3` | integer |
| `Up16Of3To31Of3` | `AccruOrRecOfCG.ShortTermUnder20Per.DateRange.Up16Of3To31Of3` | integer |
| `Upto15Of6` | `AccruOrRecOfCG.ShortTermUnder30Per.DateRange.Upto15Of6` | integer |
| `Upto15Of9` | `AccruOrRecOfCG.ShortTermUnder30Per.DateRange.Upto15Of9` | integer |
| `Up16Of9To15Of12` | `AccruOrRecOfCG.ShortTermUnder30Per.DateRange.Up16Of9To15Of12` | integer |
| `Up16Of12To15Of3` | `AccruOrRecOfCG.ShortTermUnder30Per.DateRange.Up16Of12To15Of3` | integer |
| `Up16Of3To31Of3` | `AccruOrRecOfCG.ShortTermUnder30Per.DateRange.Up16Of3To31Of3` | integer |
| `Upto15Of6` | `AccruOrRecOfCG.ShortTermUnderAppRate.DateRange.Upto15Of6` | integer |
| `Upto15Of9` | `AccruOrRecOfCG.ShortTermUnderAppRate.DateRange.Upto15Of9` | integer |
| `Up16Of9To15Of12` | `AccruOrRecOfCG.ShortTermUnderAppRate.DateRange.Up16Of9To15Of12` | integer |
| `Up16Of12To15Of3` | `AccruOrRecOfCG.ShortTermUnderAppRate.DateRange.Up16Of12To15Of3` | integer |
| `Up16Of3To31Of3` | `AccruOrRecOfCG.ShortTermUnderAppRate.DateRange.Up16Of3To31Of3` | integer |
| `Upto15Of6` | `AccruOrRecOfCG.ShortTermUnderDTAARate.DateRange.Upto15Of6` | integer |
| `Upto15Of9` | `AccruOrRecOfCG.ShortTermUnderDTAARate.DateRange.Upto15Of9` | integer |
| `Up16Of9To15Of12` | `AccruOrRecOfCG.ShortTermUnderDTAARate.DateRange.Up16Of9To15Of12` | integer |
| `Up16Of12To15Of3` | `AccruOrRecOfCG.ShortTermUnderDTAARate.DateRange.Up16Of12To15Of3` | integer |
| `Up16Of3To31Of3` | `AccruOrRecOfCG.ShortTermUnderDTAARate.DateRange.Up16Of3To31Of3` | integer |
| `Upto15Of6` | `AccruOrRecOfCG.LongTermUnder12_5Per.DateRange.Upto15Of6` | integer |
| `Upto15Of9` | `AccruOrRecOfCG.LongTermUnder12_5Per.DateRange.Upto15Of9` | integer |
| `Up16Of9To15Of12` | `AccruOrRecOfCG.LongTermUnder12_5Per.DateRange.Up16Of9To15Of12` | integer |
| `Up16Of12To15Of3` | `AccruOrRecOfCG.LongTermUnder12_5Per.DateRange.Up16Of12To15Of3` | integer |
| `Up16Of3To31Of3` | `AccruOrRecOfCG.LongTermUnder12_5Per.DateRange.Up16Of3To31Of3` | integer |
| `Upto15Of6` | `AccruOrRecOfCG.LongTermUnderDTAARate.DateRange.Upto15Of6` | integer |
| `Upto15Of9` | `AccruOrRecOfCG.LongTermUnderDTAARate.DateRange.Upto15Of9` | integer |
| `Up16Of9To15Of12` | `AccruOrRecOfCG.LongTermUnderDTAARate.DateRange.Up16Of9To15Of12` | integer |
| `Up16Of12To15Of3` | `AccruOrRecOfCG.LongTermUnderDTAARate.DateRange.Up16Of12To15Of3` | integer |
| `Up16Of3To31Of3` | `AccruOrRecOfCG.LongTermUnderDTAARate.DateRange.Up16Of3To31Of3` | integer |
| `Upto15Of6` | `AccruOrRecOfCG.VDATrnsfGainsUnder30Per.DateRange.Upto15Of6` | integer |
| `Upto15Of9` | `AccruOrRecOfCG.VDATrnsfGainsUnder30Per.DateRange.Upto15Of9` | integer |
| `Up16Of9To15Of12` | `AccruOrRecOfCG.VDATrnsfGainsUnder30Per.DateRange.Up16Of9To15Of12` | integer |
| `Up16Of12To15Of3` | `AccruOrRecOfCG.VDATrnsfGainsUnder30Per.DateRange.Up16Of12To15Of3` | integer |
| `Up16Of3To31Of3` | `AccruOrRecOfCG.VDATrnsfGainsUnder30Per.DateRange.Up16Of3To31Of3` | integer |

---

## 6a · Every schema leaf of `ScheduleCG` (verbatim, for the section-builder)

All 339 leaves of the block, required (`yes`) or optional, so every schema key name is recorded verbatim beside its item.

| Schema key | Full path | Type | Req |
|---|---|---|---|
| `SaleofLandBuildDtls` | `ShortTermCapGain.SaleofLandBuild.SaleofLandBuildDtls[]` | array |  |
| `DateofPurchase` | `ShortTermCapGain.SaleofLandBuild.SaleofLandBuildDtls[].DateofPurchase` | string |  |
| `DateofSale` | `ShortTermCapGain.SaleofLandBuild.SaleofLandBuildDtls[].DateofSale` | string |  |
| `FullConsideration` | `ShortTermCapGain.SaleofLandBuild.SaleofLandBuildDtls[].FullConsideration` | integer | yes |
| `PropertyValuation` | `ShortTermCapGain.SaleofLandBuild.SaleofLandBuildDtls[].PropertyValuation` | integer | yes |
| `FullConsideration50C` | `ShortTermCapGain.SaleofLandBuild.SaleofLandBuildDtls[].FullConsideration50C` | integer | yes |
| `Reduction48iii` | `ShortTermCapGain.SaleofLandBuild.SaleofLandBuildDtls[].Reduction48iii` | integer | yes |
| `AquisitCost` | `ShortTermCapGain.SaleofLandBuild.SaleofLandBuildDtls[].AquisitCost` | integer | yes |
| `ImproveCost` | `ShortTermCapGain.SaleofLandBuild.SaleofLandBuildDtls[].ImproveCost` | integer | yes |
| `ExpOnTrans` | `ShortTermCapGain.SaleofLandBuild.SaleofLandBuildDtls[].ExpOnTrans` | integer | yes |
| `TotalDedn` | `ShortTermCapGain.SaleofLandBuild.SaleofLandBuildDtls[].TotalDedn` | integer | yes |
| `Balance` | `ShortTermCapGain.SaleofLandBuild.SaleofLandBuildDtls[].Balance` | integer | yes |
| `ExemptionOrDednUs54Dtls` | `ShortTermCapGain.SaleofLandBuild.SaleofLandBuildDtls[].ExemptionOrDednUs54.ExemptionOrDednUs54Dtls[]` | array |  |
| `ExemptionSecCode` | `ShortTermCapGain.SaleofLandBuild.SaleofLandBuildDtls[].ExemptionOrDednUs54.ExemptionOrDednUs54Dtls[].ExemptionSecCode` | string | yes |
| `ExemptionAmount` | `ShortTermCapGain.SaleofLandBuild.SaleofLandBuildDtls[].ExemptionOrDednUs54.ExemptionOrDednUs54Dtls[].ExemptionAmount` | integer | yes |
| `ExemptionGrandTotal` | `ShortTermCapGain.SaleofLandBuild.SaleofLandBuildDtls[].ExemptionOrDednUs54.ExemptionGrandTotal` | integer | yes |
| `CapgainonAssets` | `ShortTermCapGain.SaleofLandBuild.SaleofLandBuildDtls[].CapgainonAssets` | integer | yes |
| `TrnsfImmblPrprtyDtls` | `ShortTermCapGain.SaleofLandBuild.SaleofLandBuildDtls[].TrnsfImmblPrprty.TrnsfImmblPrprtyDtls[]` | array |  |
| `NameOfBuyer` | `ShortTermCapGain.SaleofLandBuild.SaleofLandBuildDtls[].TrnsfImmblPrprty.TrnsfImmblPrprtyDtls[].NameOfBuyer` | string | yes |
| `PANofBuyer` | `ShortTermCapGain.SaleofLandBuild.SaleofLandBuildDtls[].TrnsfImmblPrprty.TrnsfImmblPrprtyDtls[].PANofBuyer` | string |  |
| `AaadhaarOfBuyer` | `ShortTermCapGain.SaleofLandBuild.SaleofLandBuildDtls[].TrnsfImmblPrprty.TrnsfImmblPrprtyDtls[].AaadhaarOfBuyer` | string |  |
| `PercentageShare` | `ShortTermCapGain.SaleofLandBuild.SaleofLandBuildDtls[].TrnsfImmblPrprty.TrnsfImmblPrprtyDtls[].PercentageShare` | number | yes |
| `Amount` | `ShortTermCapGain.SaleofLandBuild.SaleofLandBuildDtls[].TrnsfImmblPrprty.TrnsfImmblPrprtyDtls[].Amount` | integer | yes |
| `AddressOfProperty` | `ShortTermCapGain.SaleofLandBuild.SaleofLandBuildDtls[].TrnsfImmblPrprty.TrnsfImmblPrprtyDtls[].AddressOfProperty` | string | yes |
| `StateCode` | `ShortTermCapGain.SaleofLandBuild.SaleofLandBuildDtls[].TrnsfImmblPrprty.TrnsfImmblPrprtyDtls[].StateCode` | string | yes |
| `CountryCode` | `ShortTermCapGain.SaleofLandBuild.SaleofLandBuildDtls[].TrnsfImmblPrprty.TrnsfImmblPrprtyDtls[].CountryCode` | string |  |
| `PinCode` | `ShortTermCapGain.SaleofLandBuild.SaleofLandBuildDtls[].TrnsfImmblPrprty.TrnsfImmblPrprtyDtls[].PinCode` | integer |  |
| `ZipCode` | `ShortTermCapGain.SaleofLandBuild.SaleofLandBuildDtls[].TrnsfImmblPrprty.TrnsfImmblPrprtyDtls[].ZipCode` | string |  |
| `FMV11UAEii` | `ShortTermCapGain.SlumpSaleInStcg.FMV11UAEii` | integer | yes |
| `FMV11UAEiii` | `ShortTermCapGain.SlumpSaleInStcg.FMV11UAEiii` | integer | yes |
| `FullConsideration` | `ShortTermCapGain.SlumpSaleInStcg.FullConsideration` | integer | yes |
| `NetWorthOfDivision` | `ShortTermCapGain.SlumpSaleInStcg.NetWorthOfDivision` | integer | yes |
| `CapgainonAssets` | `ShortTermCapGain.SlumpSaleInStcg.CapgainonAssets` | integer | yes |
| `EquityMFonSTT` | `ShortTermCapGain.EquityMFonSTT[]` | array |  |
| `MFSectionCode` | `ShortTermCapGain.EquityMFonSTT[].MFSectionCode` | string | yes |
| `FullConsideration` | `ShortTermCapGain.EquityMFonSTT[].EquityMFonSTTDtls.FullConsideration` | integer | yes |
| `Reduction48iii` | `ShortTermCapGain.EquityMFonSTT[].EquityMFonSTTDtls.DeductSec48.Reduction48iii` | integer | yes |
| `AquisitCost` | `ShortTermCapGain.EquityMFonSTT[].EquityMFonSTTDtls.DeductSec48.AquisitCost` | integer | yes |
| `ImproveCost` | `ShortTermCapGain.EquityMFonSTT[].EquityMFonSTTDtls.DeductSec48.ImproveCost` | integer | yes |
| `ExpOnTrans` | `ShortTermCapGain.EquityMFonSTT[].EquityMFonSTTDtls.DeductSec48.ExpOnTrans` | integer | yes |
| `TotalDedn` | `ShortTermCapGain.EquityMFonSTT[].EquityMFonSTTDtls.DeductSec48.TotalDedn` | integer | yes |
| `BalanceCG` | `ShortTermCapGain.EquityMFonSTT[].EquityMFonSTTDtls.BalanceCG` | integer | yes |
| `LossSec94of7Or94of8` | `ShortTermCapGain.EquityMFonSTT[].EquityMFonSTTDtls.LossSec94of7Or94of8` | integer | yes |
| `CapgainonAssets` | `ShortTermCapGain.EquityMFonSTT[].EquityMFonSTTDtls.CapgainonAssets` | integer | yes |
| `NRItaxSTTPaid` | `ShortTermCapGain.NRITransacSec48Dtl.NRItaxSTTPaid` | integer | yes |
| `NRItaxSTTNotPaid` | `ShortTermCapGain.NRITransacSec48Dtl.NRItaxSTTNotPaid` | integer | yes |
| `FullValueConsdRecvUnqshr` | `ShortTermCapGain.NRISecur115AD.FullValueConsdRecvUnqshr` | integer | yes |
| `FairMrktValueUnqshr` | `ShortTermCapGain.NRISecur115AD.FairMrktValueUnqshr` | integer | yes |
| `FullValueConsdSec50CA` | `ShortTermCapGain.NRISecur115AD.FullValueConsdSec50CA` | integer | yes |
| `FullValueConsdOthUnqshr` | `ShortTermCapGain.NRISecur115AD.FullValueConsdOthUnqshr` | integer | yes |
| `FullConsideration` | `ShortTermCapGain.NRISecur115AD.FullConsideration` | integer | yes |
| `Reduction48iii` | `ShortTermCapGain.NRISecur115AD.DeductSec48.Reduction48iii` | integer | yes |
| `AquisitCost` | `ShortTermCapGain.NRISecur115AD.DeductSec48.AquisitCost` | integer | yes |
| `ImproveCost` | `ShortTermCapGain.NRISecur115AD.DeductSec48.ImproveCost` | integer | yes |
| `ExpOnTrans` | `ShortTermCapGain.NRISecur115AD.DeductSec48.ExpOnTrans` | integer | yes |
| `TotalDedn` | `ShortTermCapGain.NRISecur115AD.DeductSec48.TotalDedn` | integer | yes |
| `BalanceCG` | `ShortTermCapGain.NRISecur115AD.BalanceCG` | integer | yes |
| `LossSec94of7Or94of8` | `ShortTermCapGain.NRISecur115AD.LossSec94of7Or94of8` | integer | yes |
| `CapgainonAssets` | `ShortTermCapGain.NRISecur115AD.CapgainonAssets` | integer | yes |
| `FullValueConsdRecvUnqshr` | `ShortTermCapGain.SaleOnOtherAssets.FullValueConsdRecvUnqshr` | integer | yes |
| `FairMrktValueUnqshr` | `ShortTermCapGain.SaleOnOtherAssets.FairMrktValueUnqshr` | integer | yes |
| `FullValueConsdSec50CA` | `ShortTermCapGain.SaleOnOtherAssets.FullValueConsdSec50CA` | integer | yes |
| `FullValueConsdOthUnqshr` | `ShortTermCapGain.SaleOnOtherAssets.FullValueConsdOthUnqshr` | integer | yes |
| `FullConsideration` | `ShortTermCapGain.SaleOnOtherAssets.FullConsideration` | integer | yes |
| `Reduction48iii` | `ShortTermCapGain.SaleOnOtherAssets.DeductSec48.Reduction48iii` | integer | yes |
| `AquisitCost` | `ShortTermCapGain.SaleOnOtherAssets.DeductSec48.AquisitCost` | integer | yes |
| `ImproveCost` | `ShortTermCapGain.SaleOnOtherAssets.DeductSec48.ImproveCost` | integer | yes |
| `ExpOnTrans` | `ShortTermCapGain.SaleOnOtherAssets.DeductSec48.ExpOnTrans` | integer | yes |
| `TotalDedn` | `ShortTermCapGain.SaleOnOtherAssets.DeductSec48.TotalDedn` | integer | yes |
| `BalanceCG` | `ShortTermCapGain.SaleOnOtherAssets.BalanceCG` | integer | yes |
| `LossSec94of7Or94of8` | `ShortTermCapGain.SaleOnOtherAssets.LossSec94of7Or94of8` | integer | yes |
| `DeemedSTCGDeprAsset` | `ShortTermCapGain.SaleOnOtherAssets.DeemedSTCGDeprAsset` | integer | yes |
| `ExemptionOrDednUs54Dtls` | `ShortTermCapGain.SaleOnOtherAssets.ExemptionOrDednUs54.ExemptionOrDednUs54Dtls[]` | array |  |
| `ExemptionSecCode` | `ShortTermCapGain.SaleOnOtherAssets.ExemptionOrDednUs54.ExemptionOrDednUs54Dtls[].ExemptionSecCode` | string | yes |
| `ExemptionAmount` | `ShortTermCapGain.SaleOnOtherAssets.ExemptionOrDednUs54.ExemptionOrDednUs54Dtls[].ExemptionAmount` | integer | yes |
| `ExemptionGrandTotal` | `ShortTermCapGain.SaleOnOtherAssets.ExemptionOrDednUs54.ExemptionGrandTotal` | integer | yes |
| `CapgainonAssets` | `ShortTermCapGain.SaleOnOtherAssets.CapgainonAssets` | integer | yes |
| `UnutilizedStcgFlag` | `ShortTermCapGain.UnutilizedStcgFlag` | string |  |
| `UnutilizedCgPrvYrDtls` | `ShortTermCapGain.UnutilizedCg.UnutilizedCgPrvYrDtls[]` | array |  |
| `PrvYrInWhichAsstTrnsfrd` | `ShortTermCapGain.UnutilizedCg.UnutilizedCgPrvYrDtls[].PrvYrInWhichAsstTrnsfrd` | string | yes |
| `SectionClmd` | `ShortTermCapGain.UnutilizedCg.UnutilizedCgPrvYrDtls[].SectionClmd` | string | yes |
| `YrInWhichAssetAcq` | `ShortTermCapGain.UnutilizedCg.UnutilizedCgPrvYrDtls[].YrInWhichAssetAcq` | string |  |
| `AmtUtilized` | `ShortTermCapGain.UnutilizedCg.UnutilizedCgPrvYrDtls[].AmtUtilized` | integer |  |
| `AmtUnutilized` | `ShortTermCapGain.UnutilizedCg.UnutilizedCgPrvYrDtls[].AmtUnutilized` | integer | yes |
| `AmtDeemedStcg` | `ShortTermCapGain.AmtDeemedStcg` | integer |  |
| `AmtDeemedStcg45iv` | `ShortTermCapGain.AmtDeemedStcg45iv` | integer |  |
| `TotalAmtDeemedStcg` | `ShortTermCapGain.TotalAmtDeemedStcg` | integer | yes |
| `PassThrIncNatureSTCG` | `ShortTermCapGain.PassThrIncNatureSTCG` | integer | yes |
| `PassThrIncNatureSTCG20Per` | `ShortTermCapGain.PassThrIncNatureSTCG20Per` | integer |  |
| `PassThrIncNatureSTCG30Per` | `ShortTermCapGain.PassThrIncNatureSTCG30Per` | integer |  |
| `PassThrIncNatureSTCGAppRate` | `ShortTermCapGain.PassThrIncNatureSTCGAppRate` | integer |  |
| `NRIDTAADtls` | `ShortTermCapGain.NRICgDTAA.NRIDTAADtls[]` | array |  |
| `DTAAamt` | `ShortTermCapGain.NRICgDTAA.NRIDTAADtls[].DTAAamt` | integer | yes |
| `ItemNoincl` | `ShortTermCapGain.NRICgDTAA.NRIDTAADtls[].ItemNoincl` | string | yes |
| `CountryName` | `ShortTermCapGain.NRICgDTAA.NRIDTAADtls[].CountryName` | string | yes |
| `CountryCodeExcludingIndia` | `ShortTermCapGain.NRICgDTAA.NRIDTAADtls[].CountryCodeExcludingIndia` | string | yes |
| `DTAAarticle` | `ShortTermCapGain.NRICgDTAA.NRIDTAADtls[].DTAAarticle` | string | yes |
| `RateAsPerTreaty` | `ShortTermCapGain.NRICgDTAA.NRIDTAADtls[].RateAsPerTreaty` | number | yes |
| `TaxRescertifiedFlag` | `ShortTermCapGain.NRICgDTAA.NRIDTAADtls[].TaxRescertifiedFlag` | string |  |
| `SecITAct` | `ShortTermCapGain.NRICgDTAA.NRIDTAADtls[].SecITAct` | string | yes |
| `RateAsPerITAct` | `ShortTermCapGain.NRICgDTAA.NRIDTAADtls[].RateAsPerITAct` | number | yes |
| `ApplicableRate` | `ShortTermCapGain.NRICgDTAA.NRIDTAADtls[].ApplicableRate` | number |  |
| `TotalAmtNotTaxUsDTAAStcg` | `ShortTermCapGain.TotalAmtNotTaxUsDTAAStcg` | integer | yes |
| `TotalAmtTaxUsDTAAStcg` | `ShortTermCapGain.TotalAmtTaxUsDTAAStcg` | integer | yes |
| `TotalCapitalLossBuyBackShares` | `ShortTermCapGain.CapitalLossBuyBackShares.TotalCapitalLossBuyBackShares` | integer | yes |
| `CapitalLossBuyBackSharesDtls` | `ShortTermCapGain.CapitalLossBuyBackShares.CapitalLossBuyBackSharesDtls[]` | array | yes |
| `Rate` | `ShortTermCapGain.CapitalLossBuyBackShares.CapitalLossBuyBackSharesDtls[].Rate` | string | yes |
| `Amount` | `ShortTermCapGain.CapitalLossBuyBackShares.CapitalLossBuyBackSharesDtls[].Amount` | integer | yes |
| `TotalSTCG` | `ShortTermCapGain.TotalSTCG` | integer | yes |
| `SaleofLandBuildDtls` | `LongTermCapGain.SaleofLandBuild.SaleofLandBuildDtls[]` | array |  |
| `DateofPurchase` | `LongTermCapGain.SaleofLandBuild.SaleofLandBuildDtls[].DateofPurchase` | string |  |
| `DateofSale` | `LongTermCapGain.SaleofLandBuild.SaleofLandBuildDtls[].DateofSale` | string |  |
| `FullConsideration` | `LongTermCapGain.SaleofLandBuild.SaleofLandBuildDtls[].FullConsideration` | integer | yes |
| `PropertyValuation` | `LongTermCapGain.SaleofLandBuild.SaleofLandBuildDtls[].PropertyValuation` | integer | yes |
| `FullConsideration50C` | `LongTermCapGain.SaleofLandBuild.SaleofLandBuildDtls[].FullConsideration50C` | integer | yes |
| `Reduction48iii` | `LongTermCapGain.SaleofLandBuild.SaleofLandBuildDtls[].Reduction48iii` | integer |  |
| `AquisitCost` | `LongTermCapGain.SaleofLandBuild.SaleofLandBuildDtls[].AquisitCost` | integer | yes |
| `AquisitCostIndex` | `LongTermCapGain.SaleofLandBuild.SaleofLandBuildDtls[].AquisitCostIndex` | integer | yes |
| `ImproveCost` | `LongTermCapGain.SaleofLandBuild.SaleofLandBuildDtls[].ImproveCost` | integer |  |
| `ExpOnTrans` | `LongTermCapGain.SaleofLandBuild.SaleofLandBuildDtls[].ExpOnTrans` | integer | yes |
| `TotalDedn` | `LongTermCapGain.SaleofLandBuild.SaleofLandBuildDtls[].TotalDedn` | integer | yes |
| `Balance` | `LongTermCapGain.SaleofLandBuild.SaleofLandBuildDtls[].Balance` | integer | yes |
| `ExemptionOrDednUs54Dtls` | `LongTermCapGain.SaleofLandBuild.SaleofLandBuildDtls[].ExemptionOrDednUs54.ExemptionOrDednUs54Dtls[]` | array |  |
| `ExemptionSecCode` | `LongTermCapGain.SaleofLandBuild.SaleofLandBuildDtls[].ExemptionOrDednUs54.ExemptionOrDednUs54Dtls[].ExemptionSecCode` | string | yes |
| `ExemptionAmount` | `LongTermCapGain.SaleofLandBuild.SaleofLandBuildDtls[].ExemptionOrDednUs54.ExemptionOrDednUs54Dtls[].ExemptionAmount` | integer | yes |
| `ExemptionGrandTotal` | `LongTermCapGain.SaleofLandBuild.SaleofLandBuildDtls[].ExemptionOrDednUs54.ExemptionGrandTotal` | integer | yes |
| `CapgainonAssets` | `LongTermCapGain.SaleofLandBuild.SaleofLandBuildDtls[].CapgainonAssets` | integer | yes |
| `TrnsfImmblPrprtyDtls` | `LongTermCapGain.SaleofLandBuild.SaleofLandBuildDtls[].TrnsfImmblPrprty.TrnsfImmblPrprtyDtls[]` | array |  |
| `NameOfBuyer` | `LongTermCapGain.SaleofLandBuild.SaleofLandBuildDtls[].TrnsfImmblPrprty.TrnsfImmblPrprtyDtls[].NameOfBuyer` | string | yes |
| `PANofBuyer` | `LongTermCapGain.SaleofLandBuild.SaleofLandBuildDtls[].TrnsfImmblPrprty.TrnsfImmblPrprtyDtls[].PANofBuyer` | string |  |
| `AaadhaarOfBuyer` | `LongTermCapGain.SaleofLandBuild.SaleofLandBuildDtls[].TrnsfImmblPrprty.TrnsfImmblPrprtyDtls[].AaadhaarOfBuyer` | string |  |
| `PercentageShare` | `LongTermCapGain.SaleofLandBuild.SaleofLandBuildDtls[].TrnsfImmblPrprty.TrnsfImmblPrprtyDtls[].PercentageShare` | number | yes |
| `Amount` | `LongTermCapGain.SaleofLandBuild.SaleofLandBuildDtls[].TrnsfImmblPrprty.TrnsfImmblPrprtyDtls[].Amount` | integer | yes |
| `AddressOfProperty` | `LongTermCapGain.SaleofLandBuild.SaleofLandBuildDtls[].TrnsfImmblPrprty.TrnsfImmblPrprtyDtls[].AddressOfProperty` | string | yes |
| `StateCode` | `LongTermCapGain.SaleofLandBuild.SaleofLandBuildDtls[].TrnsfImmblPrprty.TrnsfImmblPrprtyDtls[].StateCode` | string | yes |
| `CountryCode` | `LongTermCapGain.SaleofLandBuild.SaleofLandBuildDtls[].TrnsfImmblPrprty.TrnsfImmblPrprtyDtls[].CountryCode` | string |  |
| `PinCode` | `LongTermCapGain.SaleofLandBuild.SaleofLandBuildDtls[].TrnsfImmblPrprty.TrnsfImmblPrprtyDtls[].PinCode` | integer |  |
| `ZipCode` | `LongTermCapGain.SaleofLandBuild.SaleofLandBuildDtls[].TrnsfImmblPrprty.TrnsfImmblPrprtyDtls[].ZipCode` | string |  |
| `TotalLTCGImmblPrprty` | `LongTermCapGain.SaleofLandBuild.TotalLTCGImmblPrprty` | integer |  |
| `FMV11UAEii` | `LongTermCapGain.SlumpSaleInLtcgDtls.SlumpSaleInLtcg.FMV11UAEii` | integer | yes |
| `FMV11UAEiii` | `LongTermCapGain.SlumpSaleInLtcgDtls.SlumpSaleInLtcg.FMV11UAEiii` | integer | yes |
| `FullConsideration` | `LongTermCapGain.SlumpSaleInLtcgDtls.SlumpSaleInLtcg.FullConsideration` | integer | yes |
| `NetWorthOfDivision` | `LongTermCapGain.SlumpSaleInLtcgDtls.SlumpSaleInLtcg.NetWorthOfDivision` | integer | yes |
| `SlumpBalance` | `LongTermCapGain.SlumpSaleInLtcgDtls.SlumpSaleInLtcg.SlumpBalance` | integer | yes |
| `DeductionUnderSec54` | `LongTermCapGain.SlumpSaleInLtcgDtls.SlumpSaleInLtcg.DeductionUnderSec54` | integer | yes |
| `CapgainonAssets` | `LongTermCapGain.SlumpSaleInLtcgDtls.SlumpSaleInLtcg.CapgainonAssets` | integer | yes |
| `Proviso112SectionCode` | `LongTermCapGain.Proviso112Applicable.Proviso112SectionCode` | string | yes |
| `FullConsideration` | `LongTermCapGain.Proviso112Applicable.Proviso112Applicabledtls.FullConsideration` | integer | yes |
| `Reduction48iii` | `LongTermCapGain.Proviso112Applicable.Proviso112Applicabledtls.DeductSec48.Reduction48iii` | integer | yes |
| `AquisitCost` | `LongTermCapGain.Proviso112Applicable.Proviso112Applicabledtls.DeductSec48.AquisitCost` | integer | yes |
| `ImproveCost` | `LongTermCapGain.Proviso112Applicable.Proviso112Applicabledtls.DeductSec48.ImproveCost` | integer | yes |
| `ExpOnTrans` | `LongTermCapGain.Proviso112Applicable.Proviso112Applicabledtls.DeductSec48.ExpOnTrans` | integer | yes |
| `TotalDedn` | `LongTermCapGain.Proviso112Applicable.Proviso112Applicabledtls.DeductSec48.TotalDedn` | integer | yes |
| `BalanceCG` | `LongTermCapGain.Proviso112Applicable.Proviso112Applicabledtls.BalanceCG` | integer | yes |
| `CapgainonAssets` | `LongTermCapGain.SaleOfEquityShareUs112A.CapgainonAssets` | integer | yes |
| `BalanceCG` | `LongTermCapGain.NRIProvisoSec48.BalanceCG` | integer | yes |
| `NRIOnSec112and115Dtls` | `LongTermCapGain.NRIOnSec112and115.NRIOnSec112and115Dtls[]` | array |  |
| `SectionCode` | `LongTermCapGain.NRIOnSec112and115.NRIOnSec112and115Dtls[].SectionCode` | string |  |
| `FullValueConsdRecvUnqshr` | `LongTermCapGain.NRIOnSec112and115.NRIOnSec112and115Dtls[].FullValueConsdRecvUnqshr` | integer | yes |
| `FairMrktValueUnqshr` | `LongTermCapGain.NRIOnSec112and115.NRIOnSec112and115Dtls[].FairMrktValueUnqshr` | integer | yes |
| `FullValueConsdSec50CA` | `LongTermCapGain.NRIOnSec112and115.NRIOnSec112and115Dtls[].FullValueConsdSec50CA` | integer | yes |
| `FullValueConsdOthUnqshr` | `LongTermCapGain.NRIOnSec112and115.NRIOnSec112and115Dtls[].FullValueConsdOthUnqshr` | integer | yes |
| `FullConsideration` | `LongTermCapGain.NRIOnSec112and115.NRIOnSec112and115Dtls[].FullConsideration` | integer | yes |
| `Reduction48iii` | `LongTermCapGain.NRIOnSec112and115.NRIOnSec112and115Dtls[].DeductSec48.Reduction48iii` | integer | yes |
| `AquisitCost` | `LongTermCapGain.NRIOnSec112and115.NRIOnSec112and115Dtls[].DeductSec48.AquisitCost` | integer | yes |
| `ImproveCost` | `LongTermCapGain.NRIOnSec112and115.NRIOnSec112and115Dtls[].DeductSec48.ImproveCost` | integer | yes |
| `ExpOnTrans` | `LongTermCapGain.NRIOnSec112and115.NRIOnSec112and115Dtls[].DeductSec48.ExpOnTrans` | integer | yes |
| `TotalDedn` | `LongTermCapGain.NRIOnSec112and115.NRIOnSec112and115Dtls[].DeductSec48.TotalDedn` | integer | yes |
| `BalanceCG` | `LongTermCapGain.NRIOnSec112and115.NRIOnSec112and115Dtls[].BalanceCG` | integer | yes |
| `TotalNRIOnSec112and115` | `LongTermCapGain.NRIOnSec112and115.TotalNRIOnSec112and115` | integer |  |
| `CapgainonAssets` | `LongTermCapGain.NRISaleOfEquityShareUs112A.CapgainonAssets` | integer | yes |
| `FullValueConsdRecvUnqshr` | `LongTermCapGain.SaleofAssetNADtls.SaleofAssetNA.FullValueConsdRecvUnqshr` | integer | yes |
| `FairMrktValueUnqshr` | `LongTermCapGain.SaleofAssetNADtls.SaleofAssetNA.FairMrktValueUnqshr` | integer | yes |
| `FullValueConsdSec50CA` | `LongTermCapGain.SaleofAssetNADtls.SaleofAssetNA.FullValueConsdSec50CA` | integer | yes |
| `FullValueConsdOthUnqshr` | `LongTermCapGain.SaleofAssetNADtls.SaleofAssetNA.FullValueConsdOthUnqshr` | integer | yes |
| `FullConsideration` | `LongTermCapGain.SaleofAssetNADtls.SaleofAssetNA.FullConsideration` | integer | yes |
| `Reduction48iii` | `LongTermCapGain.SaleofAssetNADtls.SaleofAssetNA.DeductSec48.Reduction48iii` | integer | yes |
| `AquisitCost` | `LongTermCapGain.SaleofAssetNADtls.SaleofAssetNA.DeductSec48.AquisitCost` | integer | yes |
| `ImproveCost` | `LongTermCapGain.SaleofAssetNADtls.SaleofAssetNA.DeductSec48.ImproveCost` | integer | yes |
| `ExpOnTrans` | `LongTermCapGain.SaleofAssetNADtls.SaleofAssetNA.DeductSec48.ExpOnTrans` | integer | yes |
| `TotalDedn` | `LongTermCapGain.SaleofAssetNADtls.SaleofAssetNA.DeductSec48.TotalDedn` | integer | yes |
| `BalanceCG` | `LongTermCapGain.SaleofAssetNADtls.SaleofAssetNA.BalanceCG` | integer | yes |
| `ExemptionOrDednUs54Dtls` | `LongTermCapGain.SaleofAssetNADtls.SaleofAssetNA.ExemptionOrDednUs54.ExemptionOrDednUs54Dtls[]` | array |  |
| `ExemptionSecCode` | `LongTermCapGain.SaleofAssetNADtls.SaleofAssetNA.ExemptionOrDednUs54.ExemptionOrDednUs54Dtls[].ExemptionSecCode` | string | yes |
| `ExemptionAmount` | `LongTermCapGain.SaleofAssetNADtls.SaleofAssetNA.ExemptionOrDednUs54.ExemptionOrDednUs54Dtls[].ExemptionAmount` | integer | yes |
| `ExemptionGrandTotal` | `LongTermCapGain.SaleofAssetNADtls.SaleofAssetNA.ExemptionOrDednUs54.ExemptionGrandTotal` | integer | yes |
| `CapgainonAssets` | `LongTermCapGain.SaleofAssetNADtls.SaleofAssetNA.CapgainonAssets` | integer | yes |
| `UnutilizedLtcgFlag` | `LongTermCapGain.UnutilizedLtcgFlag` | string |  |
| `UnutilizedCgPrvYrDtls` | `LongTermCapGain.UnutilizedCg.UnutilizedCgPrvYrDtls[]` | array |  |
| `PrvYrInWhichAsstTrnsfrd` | `LongTermCapGain.UnutilizedCg.UnutilizedCgPrvYrDtls[].PrvYrInWhichAsstTrnsfrd` | string | yes |
| `SectionClmd` | `LongTermCapGain.UnutilizedCg.UnutilizedCgPrvYrDtls[].SectionClmd` | string | yes |
| `YrInWhichAssetAcq` | `LongTermCapGain.UnutilizedCg.UnutilizedCgPrvYrDtls[].YrInWhichAssetAcq` | string |  |
| `AmtUtilized` | `LongTermCapGain.UnutilizedCg.UnutilizedCgPrvYrDtls[].AmtUtilized` | integer |  |
| `AmtUnutilized` | `LongTermCapGain.UnutilizedCg.UnutilizedCgPrvYrDtls[].AmtUnutilized` | integer | yes |
| `AmtDeemedLtcg` | `LongTermCapGain.AmtDeemedLtcg` | integer |  |
| `AmtDeemedLtcg45iv` | `LongTermCapGain.AmtDeemedLtcg45iv` | integer |  |
| `TotalAmtDeemedLtcg` | `LongTermCapGain.TotalAmtDeemedLtcg` | integer | yes |
| `PassThrIncNatureLTCG` | `LongTermCapGain.PassThrIncNatureLTCG` | integer | yes |
| `PassThrIncNatureLTCGUs112A12_5Per` | `LongTermCapGain.PassThrIncNatureLTCGUs112A12_5Per` | integer |  |
| `PassThrIncNatureLTCG12_5Per` | `LongTermCapGain.PassThrIncNatureLTCG12_5Per` | integer |  |
| `NRIDTAADtls` | `LongTermCapGain.NRICgDTAA.NRIDTAADtls[]` | array |  |
| `DTAAamt` | `LongTermCapGain.NRICgDTAA.NRIDTAADtls[].DTAAamt` | integer | yes |
| `ItemNoincl` | `LongTermCapGain.NRICgDTAA.NRIDTAADtls[].ItemNoincl` | string | yes |
| `CountryName` | `LongTermCapGain.NRICgDTAA.NRIDTAADtls[].CountryName` | string | yes |
| `CountryCodeExcludingIndia` | `LongTermCapGain.NRICgDTAA.NRIDTAADtls[].CountryCodeExcludingIndia` | string | yes |
| `DTAAarticle` | `LongTermCapGain.NRICgDTAA.NRIDTAADtls[].DTAAarticle` | string | yes |
| `RateAsPerTreaty` | `LongTermCapGain.NRICgDTAA.NRIDTAADtls[].RateAsPerTreaty` | number | yes |
| `TaxRescertifiedFlag` | `LongTermCapGain.NRICgDTAA.NRIDTAADtls[].TaxRescertifiedFlag` | string |  |
| `SecITAct` | `LongTermCapGain.NRICgDTAA.NRIDTAADtls[].SecITAct` | string | yes |
| `RateAsPerITAct` | `LongTermCapGain.NRICgDTAA.NRIDTAADtls[].RateAsPerITAct` | number | yes |
| `ApplicableRate` | `LongTermCapGain.NRICgDTAA.NRIDTAADtls[].ApplicableRate` | number |  |
| `TotalAmtNotTaxUsDTAALtcg` | `LongTermCapGain.TotalAmtNotTaxUsDTAALtcg` | integer | yes |
| `TotalAmtTaxUsDTAALtcg` | `LongTermCapGain.TotalAmtTaxUsDTAALtcg` | integer | yes |
| `TotalCapitalLossBuyBackShares` | `LongTermCapGain.CapitalLossBuyBackShares.TotalCapitalLossBuyBackShares` | integer | yes |
| `TotalLTCG` | `LongTermCapGain.TotalLTCG` | integer | yes |
| `SumOfCGIncm` | `SumOfCGIncm` | integer | yes |
| `IncmFromVDATrnsf` | `IncmFromVDATrnsf` | integer | yes |
| `IncChargeableHeadCapGain` | `IncChargeableHeadCapGain` | integer | yes |
| `DeducClaimDtlsUs54D` | `DeducClaimInfo.DeducClaimDtlsUs54D[]` | array |  |
| `DateofAcquisition` | `DeducClaimInfo.DeducClaimDtlsUs54D[].DateofAcquisition` | string | yes |
| `CostofNewLandBuilding` | `DeducClaimInfo.DeducClaimDtlsUs54D[].CostofNewLandBuilding` | integer |  |
| `DateofPurchase` | `DeducClaimInfo.DeducClaimDtlsUs54D[].DateofPurchase` | string |  |
| `AmtDeposited` | `DeducClaimInfo.DeducClaimDtlsUs54D[].AmtDeposited` | integer |  |
| `DepositDate` | `DeducClaimInfo.DeducClaimDtlsUs54D[].DepositDate` | string |  |
| `AccountNo` | `DeducClaimInfo.DeducClaimDtlsUs54D[].AccountNo` | string |  |
| `IFSC` | `DeducClaimInfo.DeducClaimDtlsUs54D[].IFSC` | string |  |
| `AmtDeducted` | `DeducClaimInfo.DeducClaimDtlsUs54D[].AmtDeducted` | integer | yes |
| `DeducClaimDtlsUs54EC` | `DeducClaimInfo.DeducClaimDtlsUs54EC[]` | array |  |
| `DateofTransfer` | `DeducClaimInfo.DeducClaimDtlsUs54EC[].DateofTransfer` | string | yes |
| `AmtInvested` | `DeducClaimInfo.DeducClaimDtlsUs54EC[].AmtInvested` | integer |  |
| `DateofInvestment` | `DeducClaimInfo.DeducClaimDtlsUs54EC[].DateofInvestment` | string |  |
| `AmtDeducted` | `DeducClaimInfo.DeducClaimDtlsUs54EC[].AmtDeducted` | integer | yes |
| `DeducClaimDtlsUs54G` | `DeducClaimInfo.DeducClaimDtlsUs54G[]` | array |  |
| `DateofTransfer` | `DeducClaimInfo.DeducClaimDtlsUs54G[].DateofTransfer` | string | yes |
| `CostofNewAsset` | `DeducClaimInfo.DeducClaimDtlsUs54G[].CostofNewAsset` | integer |  |
| `DateofPurchase` | `DeducClaimInfo.DeducClaimDtlsUs54G[].DateofPurchase` | string |  |
| `AmtDeposited` | `DeducClaimInfo.DeducClaimDtlsUs54G[].AmtDeposited` | integer |  |
| `DepositDate` | `DeducClaimInfo.DeducClaimDtlsUs54G[].DepositDate` | string |  |
| `AccountNo` | `DeducClaimInfo.DeducClaimDtlsUs54G[].AccountNo` | string |  |
| `IFSC` | `DeducClaimInfo.DeducClaimDtlsUs54G[].IFSC` | string |  |
| `AmtDeducted` | `DeducClaimInfo.DeducClaimDtlsUs54G[].AmtDeducted` | integer | yes |
| `DeducClaimDtlsUs54GA` | `DeducClaimInfo.DeducClaimDtlsUs54GA[]` | array |  |
| `DateofTransfer` | `DeducClaimInfo.DeducClaimDtlsUs54GA[].DateofTransfer` | string | yes |
| `CostofNewAsset` | `DeducClaimInfo.DeducClaimDtlsUs54GA[].CostofNewAsset` | integer |  |
| `DateofPurchase` | `DeducClaimInfo.DeducClaimDtlsUs54GA[].DateofPurchase` | string |  |
| `AmtDeposited` | `DeducClaimInfo.DeducClaimDtlsUs54GA[].AmtDeposited` | integer |  |
| `DepositDate` | `DeducClaimInfo.DeducClaimDtlsUs54GA[].DepositDate` | string |  |
| `AccountNo` | `DeducClaimInfo.DeducClaimDtlsUs54GA[].AccountNo` | string |  |
| `IFSC` | `DeducClaimInfo.DeducClaimDtlsUs54GA[].IFSC` | string |  |
| `AmtDeducted` | `DeducClaimInfo.DeducClaimDtlsUs54GA[].AmtDeducted` | integer | yes |
| `TotDeductClaim` | `DeducClaimInfo.TotDeductClaim` | integer | yes |
| `StclSetoff20Per` | `CurrYrLosses.InLossSetOff.StclSetoff20Per` | integer | yes |
| `StclSetoff30Per` | `CurrYrLosses.InLossSetOff.StclSetoff30Per` | integer | yes |
| `StclSetoffAppRate` | `CurrYrLosses.InLossSetOff.StclSetoffAppRate` | integer | yes |
| `StclSetoffDTAARate` | `CurrYrLosses.InLossSetOff.StclSetoffDTAARate` | integer | yes |
| `LtclSetOff12_5Per` | `CurrYrLosses.InLossSetOff.LtclSetOff12_5Per` | integer | yes |
| `LtclSetOffDTAARate` | `CurrYrLosses.InLossSetOff.LtclSetOffDTAARate` | integer | yes |
| `CurrYearIncome` | `CurrYrLosses.InStcg20Per.CurrYearIncome` | integer | yes |
| `StclSetoff30Per` | `CurrYrLosses.InStcg20Per.StclSetoff30Per` | integer | yes |
| `StclSetoffAppRate` | `CurrYrLosses.InStcg20Per.StclSetoffAppRate` | integer | yes |
| `StclSetoffDTAARate` | `CurrYrLosses.InStcg20Per.StclSetoffDTAARate` | integer | yes |
| `CurrYrCapGain` | `CurrYrLosses.InStcg20Per.CurrYrCapGain` | integer | yes |
| `CurrYearIncome` | `CurrYrLosses.InStcg30Per.CurrYearIncome` | integer | yes |
| `StclSetoff20Per` | `CurrYrLosses.InStcg30Per.StclSetoff20Per` | integer | yes |
| `StclSetoffAppRate` | `CurrYrLosses.InStcg30Per.StclSetoffAppRate` | integer | yes |
| `StclSetoffDTAARate` | `CurrYrLosses.InStcg30Per.StclSetoffDTAARate` | integer | yes |
| `CurrYrCapGain` | `CurrYrLosses.InStcg30Per.CurrYrCapGain` | integer | yes |
| `CurrYearIncome` | `CurrYrLosses.InStcgAppRate.CurrYearIncome` | integer | yes |
| `StclSetoff20Per` | `CurrYrLosses.InStcgAppRate.StclSetoff20Per` | integer | yes |
| `StclSetoff30Per` | `CurrYrLosses.InStcgAppRate.StclSetoff30Per` | integer | yes |
| `StclSetoffDTAARate` | `CurrYrLosses.InStcgAppRate.StclSetoffDTAARate` | integer | yes |
| `CurrYrCapGain` | `CurrYrLosses.InStcgAppRate.CurrYrCapGain` | integer | yes |
| `CurrYearIncome` | `CurrYrLosses.InStcgDTAARate.CurrYearIncome` | integer | yes |
| `StclSetoff20Per` | `CurrYrLosses.InStcgDTAARate.StclSetoff20Per` | integer | yes |
| `StclSetoff30Per` | `CurrYrLosses.InStcgDTAARate.StclSetoff30Per` | integer | yes |
| `StclSetoffAppRate` | `CurrYrLosses.InStcgDTAARate.StclSetoffAppRate` | integer | yes |
| `CurrYrCapGain` | `CurrYrLosses.InStcgDTAARate.CurrYrCapGain` | integer | yes |
| `CurrYearIncome` | `CurrYrLosses.InLtcg12_5Per.CurrYearIncome` | integer | yes |
| `StclSetoff20Per` | `CurrYrLosses.InLtcg12_5Per.StclSetoff20Per` | integer | yes |
| `StclSetoff30Per` | `CurrYrLosses.InLtcg12_5Per.StclSetoff30Per` | integer | yes |
| `StclSetoffAppRate` | `CurrYrLosses.InLtcg12_5Per.StclSetoffAppRate` | integer | yes |
| `StclSetoffDTAARate` | `CurrYrLosses.InLtcg12_5Per.StclSetoffDTAARate` | integer | yes |
| `LtclSetOffDTAARate` | `CurrYrLosses.InLtcg12_5Per.LtclSetOffDTAARate` | integer | yes |
| `CurrYrCapGain` | `CurrYrLosses.InLtcg12_5Per.CurrYrCapGain` | integer | yes |
| `CurrYearIncome` | `CurrYrLosses.InLtcgDTAARate.CurrYearIncome` | integer | yes |
| `StclSetoff20Per` | `CurrYrLosses.InLtcgDTAARate.StclSetoff20Per` | integer | yes |
| `StclSetoff30Per` | `CurrYrLosses.InLtcgDTAARate.StclSetoff30Per` | integer | yes |
| `StclSetoffAppRate` | `CurrYrLosses.InLtcgDTAARate.StclSetoffAppRate` | integer | yes |
| `StclSetoffDTAARate` | `CurrYrLosses.InLtcgDTAARate.StclSetoffDTAARate` | integer | yes |
| `LtclSetOff12_5Per` | `CurrYrLosses.InLtcgDTAARate.LtclSetOff12_5Per` | integer | yes |
| `CurrYrCapGain` | `CurrYrLosses.InLtcgDTAARate.CurrYrCapGain` | integer | yes |
| `StclSetoff20Per` | `CurrYrLosses.TotLossSetOff.StclSetoff20Per` | integer | yes |
| `StclSetoff30Per` | `CurrYrLosses.TotLossSetOff.StclSetoff30Per` | integer | yes |
| `StclSetoffAppRate` | `CurrYrLosses.TotLossSetOff.StclSetoffAppRate` | integer | yes |
| `StclSetoffDTAARate` | `CurrYrLosses.TotLossSetOff.StclSetoffDTAARate` | integer | yes |
| `LtclSetOff12_5Per` | `CurrYrLosses.TotLossSetOff.LtclSetOff12_5Per` | integer | yes |
| `LtclSetOffDTAARate` | `CurrYrLosses.TotLossSetOff.LtclSetOffDTAARate` | integer | yes |
| `StclSetoff20Per` | `CurrYrLosses.LossRemainSetOff.StclSetoff20Per` | integer | yes |
| `StclSetoff30Per` | `CurrYrLosses.LossRemainSetOff.StclSetoff30Per` | integer | yes |
| `StclSetoffAppRate` | `CurrYrLosses.LossRemainSetOff.StclSetoffAppRate` | integer | yes |
| `StclSetoffDTAARate` | `CurrYrLosses.LossRemainSetOff.StclSetoffDTAARate` | integer | yes |
| `LtclSetOff12_5Per` | `CurrYrLosses.LossRemainSetOff.LtclSetOff12_5Per` | integer | yes |
| `LtclSetOffDTAARate` | `CurrYrLosses.LossRemainSetOff.LtclSetOffDTAARate` | integer | yes |
| `EditAutopoulatedDetail` | `EditAutopoulatedDetail` | string |  |
| `Upto15Of6` | `AccruOrRecOfCG.ShortTermUnder20Per.DateRange.Upto15Of6` | integer | yes |
| `Upto15Of9` | `AccruOrRecOfCG.ShortTermUnder20Per.DateRange.Upto15Of9` | integer | yes |
| `Up16Of9To15Of12` | `AccruOrRecOfCG.ShortTermUnder20Per.DateRange.Up16Of9To15Of12` | integer | yes |
| `Up16Of12To15Of3` | `AccruOrRecOfCG.ShortTermUnder20Per.DateRange.Up16Of12To15Of3` | integer | yes |
| `Up16Of3To31Of3` | `AccruOrRecOfCG.ShortTermUnder20Per.DateRange.Up16Of3To31Of3` | integer | yes |
| `Upto15Of6` | `AccruOrRecOfCG.ShortTermUnder30Per.DateRange.Upto15Of6` | integer | yes |
| `Upto15Of9` | `AccruOrRecOfCG.ShortTermUnder30Per.DateRange.Upto15Of9` | integer | yes |
| `Up16Of9To15Of12` | `AccruOrRecOfCG.ShortTermUnder30Per.DateRange.Up16Of9To15Of12` | integer | yes |
| `Up16Of12To15Of3` | `AccruOrRecOfCG.ShortTermUnder30Per.DateRange.Up16Of12To15Of3` | integer | yes |
| `Up16Of3To31Of3` | `AccruOrRecOfCG.ShortTermUnder30Per.DateRange.Up16Of3To31Of3` | integer | yes |
| `Upto15Of6` | `AccruOrRecOfCG.ShortTermUnderAppRate.DateRange.Upto15Of6` | integer | yes |
| `Upto15Of9` | `AccruOrRecOfCG.ShortTermUnderAppRate.DateRange.Upto15Of9` | integer | yes |
| `Up16Of9To15Of12` | `AccruOrRecOfCG.ShortTermUnderAppRate.DateRange.Up16Of9To15Of12` | integer | yes |
| `Up16Of12To15Of3` | `AccruOrRecOfCG.ShortTermUnderAppRate.DateRange.Up16Of12To15Of3` | integer | yes |
| `Up16Of3To31Of3` | `AccruOrRecOfCG.ShortTermUnderAppRate.DateRange.Up16Of3To31Of3` | integer | yes |
| `Upto15Of6` | `AccruOrRecOfCG.ShortTermUnderDTAARate.DateRange.Upto15Of6` | integer | yes |
| `Upto15Of9` | `AccruOrRecOfCG.ShortTermUnderDTAARate.DateRange.Upto15Of9` | integer | yes |
| `Up16Of9To15Of12` | `AccruOrRecOfCG.ShortTermUnderDTAARate.DateRange.Up16Of9To15Of12` | integer | yes |
| `Up16Of12To15Of3` | `AccruOrRecOfCG.ShortTermUnderDTAARate.DateRange.Up16Of12To15Of3` | integer | yes |
| `Up16Of3To31Of3` | `AccruOrRecOfCG.ShortTermUnderDTAARate.DateRange.Up16Of3To31Of3` | integer | yes |
| `Upto15Of6` | `AccruOrRecOfCG.LongTermUnder12_5Per.DateRange.Upto15Of6` | integer | yes |
| `Upto15Of9` | `AccruOrRecOfCG.LongTermUnder12_5Per.DateRange.Upto15Of9` | integer | yes |
| `Up16Of9To15Of12` | `AccruOrRecOfCG.LongTermUnder12_5Per.DateRange.Up16Of9To15Of12` | integer | yes |
| `Up16Of12To15Of3` | `AccruOrRecOfCG.LongTermUnder12_5Per.DateRange.Up16Of12To15Of3` | integer | yes |
| `Up16Of3To31Of3` | `AccruOrRecOfCG.LongTermUnder12_5Per.DateRange.Up16Of3To31Of3` | integer | yes |
| `Upto15Of6` | `AccruOrRecOfCG.LongTermUnderDTAARate.DateRange.Upto15Of6` | integer | yes |
| `Upto15Of9` | `AccruOrRecOfCG.LongTermUnderDTAARate.DateRange.Upto15Of9` | integer | yes |
| `Up16Of9To15Of12` | `AccruOrRecOfCG.LongTermUnderDTAARate.DateRange.Up16Of9To15Of12` | integer | yes |
| `Up16Of12To15Of3` | `AccruOrRecOfCG.LongTermUnderDTAARate.DateRange.Up16Of12To15Of3` | integer | yes |
| `Up16Of3To31Of3` | `AccruOrRecOfCG.LongTermUnderDTAARate.DateRange.Up16Of3To31Of3` | integer | yes |
| `Upto15Of6` | `AccruOrRecOfCG.VDATrnsfGainsUnder30Per.DateRange.Upto15Of6` | integer | yes |
| `Upto15Of9` | `AccruOrRecOfCG.VDATrnsfGainsUnder30Per.DateRange.Upto15Of9` | integer | yes |
| `Up16Of9To15Of12` | `AccruOrRecOfCG.VDATrnsfGainsUnder30Per.DateRange.Up16Of9To15Of12` | integer | yes |
| `Up16Of12To15Of3` | `AccruOrRecOfCG.VDATrnsfGainsUnder30Per.DateRange.Up16Of12To15Of3` | integer | yes |
| `Up16Of3To31Of3` | `AccruOrRecOfCG.VDATrnsfGainsUnder30Per.DateRange.Up16Of3To31Of3` | integer | yes |

---

## 7 · Hidden rows — not built

The dump marks these rows `H`; they are the utility's hidden non-resident heads and its internal 23-July-2024 rate-split / with-vs-without-indexation / tax-working computation rows. **None of these is built** — they are populated by the utility's own logic or apply only to non-residents/FIIs. Listed here verbatim for completeness.

| Row | Hidden row text (H — never built) |
|---|---|
| r18 | di · Deduction under section 54D(Specify details in item D below) · dii |
| r63 | ai · Where the transfer was before 23rd July 2024 · A4ai |
| r64 | aii · Where the transfer was on or after 23rd July 2024 · A4aii |
| r98 | fi · Deduction under section 54D (Specify details in item D below) · fi |
| r105 | Note : · In case , any amount is utilized out of capital gain account , please fill sl no "C" of schedule DI |
| r116 | ai · Pass Through Income/ Loss in the nature of Short Term Capital Gain, chargeable @ 15% · 8ai |
| r127 | Deemed short term capital gains on depreciable assets (6 of schedule- DCG) |
| r144 | biia · Cost of acquisition with indexation (applicable only for transfers before 23rd July 2024) · biia |
| r146 | Total Cost of improvement without indexation (Ʃbiia) · biib(a) |
| r147 | Total Cost of Improvement with indexation · biib(c) |
| r167 | a · Before 23rd July 2024 (sum of capital gains on all properties transferred before 23rd July 2024) · B1ga |
| r168 | b · On or after 23rd July 2024 (sum of capital gains on all properties transferred on or after 23rd July · B1gb |
| r177 | i · Where transfer was before 23rd July 2024 · B2ei |
| r178 | ii · Where transfer was on or after 23rd July 2024 · B2eii |
| r179 | For residents, From sale of unlisted bonds or unlisted debenture (other than capital indexed bonds i |
| r180 | a · Full value of consideration · 3a |
| r181 | b · Deductions under section 48 |
| r182 | bi · Reduction as per clause (iii) of section 48 of the Act, read with rule 8AB of the Rules · bi |
| r183 | bii · Cost of acquisition without indexation · bii |
| r184 | biii · Cost of improvement without indexation · biii |
| r185 | biv · Expenditure wholly and exclusively in connection with transfer · biv |
| r186 | bv · Total (bi + bii +biii+biv) · bv |
| r187 | c · LTCG on bonds or debenture (3a – bv) · B3c |
| r192 | ii · Cost of acquisition with indexation |
| r194 | iii · Cost of improvement with indexation |
| r198 | va · Total (bi + biia + biii) (for the purpose of computing excess as per proviso section 112(1)) (applic |
| r200 | i · Where transferred before 23rd July 2024 · B4ci |
| r201 | ii · Where transferred on or after 23rd July 2024 · B4cii |
| r202 | a · Long-term Capital Gains on assets at B4 above where transfer was before 23rd July 2024 (4a – 4va) (f · B4ca |
| r203 | d · Tax as per 112(1)(a)(ii)(A) or 112(1)(c)(ii)(A) [LTCG at 20 % with indexation] [ B4(ci)*20%] (applic · B4d |
| r204 | e · Tax as per 1st Proviso to section 112(1) [LTCG at 10 % without indexation] [B4(ca)*10%] (applicable · B4e |
| r205 | f · Excess amount that is required to be ignored as per 1st proviso to section 112(1) [B4(d) – B4(e)] (a · B4f |
| r208 | Reduction as per clause (iii) of section 48 of the Act, read with rule 8AB of the Rules |
| r209 | Long-term Capital Gains on sale of capital assets at B5 (a) · B5a |
| r210 | i · Sum of column 14 where transfer was before 23rd July 2024 · B5i |
| r211 | ii · Sum of column 14 where transfer was on or after 23rd July 2024. · B5ii |
| r214 | i · Before 23rd July 2024 - Listed Debentures · B6i |
| r215 | ii · On or after 23rd July 2024 - Other than listed Debentures · B6ii |
| r216 | ii · On or after 23rd July 2024 (Only unlisted Shares or listed Debentures) · B6iii |
| r231 | (i) where transfer was before 23rd July 2024 · Bi7ci |
| r232 | (ii) where transfer was on or after 23rd July 2024 · Bi7cii |
| r247 | (i) where transfer was before 23rd July 2024 · Bii7ci |
| r248 | (ii) where transfer was on or after 23rd July 2024 · Bii7cii |
| r263 | (i) where transfer was before 23rd July 2024 · Biii7ci |
| r264 | (ii) where transfer was on or after 23rd July 2024 · Biii7cii |
| r279 | Income from sale of securities by FII as referred to in sec. 115AD · Biv7ciii · SIT-98552 by Bindu |
| r282 | b · Reduction as per clause (iii) of section 48 of the Act, read with rule 8AB of the Rules · 8b |
| r283 | c · Long-term Capital Gains on sale of capital assets at B8 (a-b) · B8c |
| r284 | i · Sum of column 14 where transfer was before 23rd July 2024 · B8i |
| r285 | ii · Sum of column 14 where transfer was on or after 23rd July 2024 · B8ii |
| r305 | (i) where transfer was before 23rd July 2024 · B9ei |
| r306 | (ii) where transfer was on or after 23rd July 2024 · B9eii |
| r309 | Note : · In case , any amount is utilized out of capital gain account , please fill sl no "C" of schedule DI |
| r317 | i · Where deemed capital gain arose before 23rd July 2024 · 10bi |
| r318 | ii · Where deemed capital gain arose on or after 23rd July 2024 · 10bii |
| r320 | i · Where deemed capital gain arose before 23rd July 2024 · 10ci |
| r321 | ii · Where deemed capital gain arose on or after 23rd July 2024 · 10cii |
| r323 | i · Where deemed capital gain arose before 23rd July 2024 · B10i |
| r324 | ii · Where deemed capital gain arose on or after 23rd July 2024 · B10ii |
| r326 | a1(i) · Pass Through Income/ Loss in the nature of Long Term Capital Gain, chargeable @ 10% u/s 112A · 11a1(i) |
| r328 | a2(i) · Pass Through Income/ Loss in the nature of Long Term Capital Gain, chargeable @ 10% under section ot · 11a2(i) |
| r330 | b · Pass Through Income in the nature of Long Term Capital Gain, chargeable @ 20% · 11b |
| r340 | S.No · Rate · Amount · LTCG_10% · LTCG_12.5% |
| r341 | (Select) |
| r342 | (Select) |
| r375 | E · Set-off of current year capital losses with current year capital gains (excluding amounts included i |
| r376 | SI. No. · Type of Capital Gain · Gain of current year (Fill this column only if computed figure is positive) · Short term capital loss set off · Long term capital loss set off · Current year’s capital gains remaining after set off |
| r377 | Applicable rate · DTAA rates · DTAA rates |
| r378 | 9=1-2-3-4-5-6-7-8 |
| r379 | i · Loss to be set off (Fill this row if computed figure is negative) |
| r380 | ii · Short term capital gain |
| r381 | iii |
| r382 | iv · Applicable rate |
| r383 | v · DTAA rates |
| r384 | vi · Long term capital gain |
| r385 | vii |
| r386 | viii · DTAA rates |
| r387 | ix · Total loss set off (ii + iii + iv + v + vi+vii+viii) |
| r388 | x · Loss remaining after set off (i – ix) |
| r389 | E · Set-off of current year capital losses with current year capital gains (excluding amounts included i |
| r390 | SI. No. · Type of Capital Gain · Gain of current year (Fill this column only if computed figure is positive) · Short term capital loss set off · Long term capital loss set off · Current year’s capital gains remaining after set off |
| r391 | Applicable rate · DTAA rates · DTAA rates |
| r392 | 11=1-2-3-4-5-6-7-8-9-10 |
| r393 | i · Loss to be set off (Fill this row if computed figure is negative) · Column Wise · Row Wise |
| r394 | ii · Short term capital gain |
| r395 | iii |
| r396 | iv |
| r397 | v · Applicable rate · App Rates |
| r398 | vi · DTAA rates · DTAA |
| r399 | vii · Long term capital gain |
| r400 | viii |
| r401 | ix |
| r402 | x · DTAA rates · DTAA |
| r403 | xi · Total loss set off (ii + iii + iv + v + vi+vii+viii+ix+x) |
| r404 | xii · Loss remaining after set off (i – xi) |
| r422 | Short-term capital gains taxable at 15% Enter value from item 5via of schedule BFLA, if any. |
| r427 | Long- term capital gains taxable at the rate of 10% Enter value from item 5xa of schedule BFLA, if a |
| r429 | Long- term capital gains taxable at the rate of 20% Enter value from item 5xi of schedule BFLA, if a |

---

## 8 · What this means for the build

- Bind the whole schedule to the single block **`ScheduleCG`**. Part A → `ShortTermCapGain`, Part B → `LongTermCapGain`, Part C → `SumOfCGIncm` / `IncmFromVDATrnsf` / `IncChargeableHeadCapGain`, Part D → `DeducClaimInfo`, Part E → `CurrYrLosses`, Part F → `AccruOrRecOfCG`.
- Build only the **visible resident heads**: STCG A1, A2, A3(i+ii), A6, A7, A8, A9, A(A), A10; LTCG B1, B2, B3, B4, B8, B9, B10, B11, B(A), B12; plus C, D, E, F. Keep the non-resident heads (**A4, A5, B5, B6, B7**) and every `H` computation row hidden until residential status is NRI/FII — they are not built (§7).
- Reproduce the department's arithmetic exactly: the **50C** 10%-band substitution (A1aiii, B1aiii), the **MAX** for slump-sale FMV (A2aiii/B2aiii) and 50CA unquoted shares (A5/A6/B6/B8), the section-48 five-line deduction totals `bv` and the balance `= aiii − bv`, the **floor-at-zero** exemption logic (`IF(balance<0, balance, MAX(0, balance − deduction))`), the **DCG** pull for A6e, and the **112A/115AD** col-14 pulls for B4/B7.
- Each 'Sale of land or building' head repeats per property (`SaleofLandBuildDtls[]`) with a per-property buyer table (`TrnsfImmblPrprtyDtls[]`, PAN/Aadhaar mandatory when TDS u/s 194-IA) and an exemption table (`ExemptionOrDednUs54Dtls[]`). LTCG land/building also carries `AquisitCostIndex` for the indexation working; date of purchase and date of sale become mandatory once B1 figures are positive (rules A410/A411) and the sale date cannot be after 31 March (A448).
- Part D tables must prove every 54D/54EC/54G/54GA exemption claimed in A or B and total to `TotDeductClaim` (D1e = A386); the D-table amounts must equal the deductions actually claimed (A397); CGAS deposit rows require deposit date + account number + IFS code (A416/A445). ITR-5 exposes only these four deduction tables.
- Part E is an auto-populated set-off matrix netting STCG (20% / 30% / applicable / DTAA) and LTCG (12.5% / DTAA) losses against gains, editable only via `EditAutopoulatedDetail`; enforce the per-cell caps (A428–A444), the column-8 identity (A440), the row totals (A441/A442) and full set-off of loss (A444).
- Part F splits each taxable bucket across the five 234C windows (`Upto15Of6`, `Upto15Of9`, `Up16Of9To15Of12`, `Up16Of12To15Of3`, `Up16Of3To31Of3`), each row's quarter total tying back to the matching Schedule BFLA item (A399–A403, A414–A415, A426–A427) — this is the Table F ↔ BFLA reconciliation.
- DTAA columns (A9/B11 and the col-10 applicable rate) are non-resident-only, gated on `ResidentialCheck`/`ResidentialStatus1`; the applicable rate is the lower of treaty rate and IT-Act rate (A403/A404/A450), and residents are warned the claim may be disallowed (A420).
- Buy-back capital loss A(A)/B(A) is a negative figure (schema max 0), split by rate (`STL20`/`STL30`/`STLAR`; LTCG 10%/12.5%), claimable only if the buy-back income is offered under IFOS.
