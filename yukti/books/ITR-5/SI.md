# Schedule SI — Income chargeable to Income tax at special rates

Form: **ITR-5**, A.Y. 2026-27. Sheet: **SI**. Section: `si`. Block: **ScheduleSI**.
Source: `python tools/dump.py --form ITR-5 --sheet "SI"` (rows / `--formulas` / `--dropdowns "SI"`) and `--schema ScheduleSI` / `--leaves ScheduleSI`; rules from `books/ITR-5/rules.json`; enum map from `books/ITR-5/enums.json`; validator text from `sources/ITR-5/vba_text.txt`; cell↔key map (named ranges) from `books/ITR-5/sheet_map.json`. Quoted verbatim, never from memory.

## The shape

Schedule SI is a **fixed table of special-rate income codes** (`[C3]` = **"Schedule SI"**, banner `[E3]` = **"Income chargeable to Income tax at special rates IB [Please see instruction Number-9 for section code and rate of tax]"**). It is **not** free data entry: every income figure is **auto-populated** (pulled) from Schedule OS / CG / BP / BFLA, the rate is a fixed constant per row, and the tax is system-computed. The only human control is the switch `[C107]` **"Do you want to edit the details auto-populated in table above ?"** (`[J107]` default **"No"**).

The header row `[C4]..[J4]` defines the columns:
- `[C4]` = **"SPECIAL RATE"**, `[D4]` = **"Sl. No."**
- `[E4]` = **"Section/Description"** — the section code text (col E). Named range `SI.SecCode` = `SI!$E$6:$E$104`.
- `[G4]` = **"Special rate (%)"** — the fixed rate. Named range `SI.SplRatePercent` = `SI!$G$6:$G$104`.
- `[H4]` = **"Income (i)"** — the special-rate income. Named range `SI.SplRateInc` = `SI!$H$6:$H$104`.
- `[I4]` = **"Taxable Income after adjusting for Min Chargeable to Tax"** — intermediate taxable income after the §112A/§115AD(1)(iii) exemption threshold and basic-exemption spreading. Named range `SI.SplRateIncCalc` = `SI!$I$6:$I$104` (feeds the tax; not a separate exported schema leaf).
- `[J4]` = **"System calculated tax thereon (ii)"** — the tax. Named range `SI.SplRateIncTax` = `SI!$J$6:$J$104`.

Column F carries the **section code** (e.g. `5A1ai`) that becomes the exported `SecCode`. Columns P/Q/R/S at the top (`[P3]` **"Threshold"**, `[Q3]` **"Available Income"**, `[R3]` **"Taxable SI"**, `[S3]` **"Income Adujustment"**) and rows 10–22's P..U cells run the **basic-exemption-limit spreading** against CG special rates (resident firms/AOP etc.). Column O cells run the **§112A ₹1,25,000 / ₹1,00,000 exemption** and the ₹1,25,000 §115AD threshold.

Two grand totals sit at row 105: `[H105]` **income total**, `[J105]` **tax total** (`[G105]` label = **"Tax at Spl Rate"**).

## The items

### Block `ScheduleSI` → `SplCodeRateTax[]` (array — one object per special-rate code that carries income)

Each object = `{SecCode, SplRatePercent, SplRateInc, SplRateIncTax}`. Column map: E/F → `SecCode`, G → `SplRatePercent`, H → `SplRateInc`, J → `SplRateIncTax`, I → `SplRateIncCalc` (intermediate).

**Live (built) rows.** Every row below is a non-hidden row; description is the verbatim `[E..]` text; Rate is the constant in `[G..]`; Income = the `[H..]` auto-populate formula; SecCode = `[F..]` code (mapped to schema `SecCode` enum).

| Row | Sl `[D]` | Section/Description `[E]` (verbatim) | SecCode `[F]` | Rate% `[G]` | Income `[H]` = |
|---|---|---|---|---|---|
| 7 | 2 | Income from other sources chargeable at special rates in India as per DTAA | `DTAAOS` | 1 (per treaty) | `MAX(os.IncOfCurYrAfterSetOffBFLossesDTAA,0)` |
| 8 | 3 | STCG chargeable at special rates in India as per DTAA | `DTAASTCG` | 1 (per treaty) | `MAX(stcg.IncOfCurYrAfterSetOffBFLossesDTAA,0)` |
| 9 | 3 | LTCG chargeable at special rates in India as per DTAA | `DTAALTCG` | 1 (per treaty) | `MAX(ltcg.IncOfCurYrAfterSetOffBFLossesDTAA,0)` |
| 11 | 4 | 111A - Short term capital gains on equity share or equity oriented fund chargeable to STT | `1A` | 20 | `MAX(STCG20_111A,0)` |
| 13 | 5 | 112 -Long term capital gains | `21` | 12.5 | `MAX(0,LTCG_112b)` |
| 15 | 6 | 112(1) - Long term capital gains u/s 112(1) on listed securities/ units | `21` | 12.5 | `MAX(0,LTCG_1121)` |
| 18 | 7 | 112A -LTCG on equity shares/units of equity oriented fund/units of business trust on which STT is paid | `2A` | 12.5 | `MAX(0,LTCG_112a)` |
| 20 | 8 | 115AD(1)(b)(ii)-Short term capital gains referred to in section 111A | `5AD1biip` | 20 | `MAX(0,STCG20_115AD)` — note `[N20]` = "N19 cell Fixed by Riyaz IPIP-73449" |
| 23 | 10 | 112(1)(c)(iii) -Long term capital gains on transfer of unlisted securities or other than Listed debentures in the case of non-residents | `21ciii` | 12.5 | `MAX(0,LTCG_1121c)` |
| 24 | 11 | 115A(1)(a)(i)-Dividends, interest and income from units purchase in foreign currency | `5A1ai` | 20 | `MAX(0,Source_5A1ai_OS-DTAA_5A1ai_OS)` |
| 25 | 12 | 115A(1)(a)(A)-Dividend received by non-resident (Not being company) or foreign company chargeable under proviso to section 115A(1)(a)(A) from a unit in an International Financial Services Centre, as referred in proviso to in sub-section (1A) of section 80LA | `5A1aA` | 10 | `MAX(0,Source_5A1aA_OS-DTAA_5A1aA_OS)` |
| 26 | 13 | 115A(1)(a)(ii)-Interest received from govt/Indian Concerns received in Foreign Currency | `5A1aii` | 20 | `MAX(0,Source_5A1aii_OS-DTAA_5A1aii_OS)` |
| 27 | 13 | 115A(1) (a)(iia)-Interest from Infrastructure Debt Fund | `5A1aiia` | 5 | `MAX(0,Source_5A1aiia_OS-DTAA_5A1aiia_OS)` |
| 28 | 13 | 115A(1) (a)(iiaa)-Interest as per Sec. 194LC(1) | `5A1aiiaa` | 5 | `MAX(0,Source_5A1aiiaa_OS-DTAA_5A1aiiaa_OS)` |
| 29 | 13 | 115A(1) (a)(iiab) -Interest as per Sec. 194LD | `5A1aiiab` | 5 | `MAX(0,Source_5A1aiiab_OS-DTAA_5A1aiiab_OS)` |
| 30 | 13 | 115A(1)(a)(iiac)- Distributed income being interest received by NR as referred to in sub-section (2) of section 194LBA | `5A1aiiac` | 5 | `MAX(0,Source_5A1aiiac_OS-DTAA_5A1aiiac_OS)` |
| 31 | 13 | 115A(1) (a)(iii)-Income received in respect of units of UTI purchased in Foreign Currency | `5A1aiii` | 20 | `MAX(0,Source_5A1aiii_OS-DTAA_5A1aiii_OS)` |
| 32 | 13 | 115A(1)(b)(A) & 115A(1)(b)(B)(Income from royalty or fees for technical services received from Government or Indian concern) | `5A1bA` | 20 | `MAX(0,Source_5A1b_OS-DTAA_5A1b_OS)` |
| 34 | 14 | 115AC(1)(a) Income by way of Dividend from GDRs purchased in foreign currency by non-residents - chargeable u/s 115AC | `5AC1ab` | 10 | `MAX(0,Source_5AC1ab_OS-DTAA_5AC1ab_OS)` |
| 35 | 15 | 115AD(1)(iii) -Long term capital gains by an FII | `5ADiii` | 12.5 | `MAX(0,LTCG_112)` |
| 37 | 16 | 115AC(1)(c ) -Long term capital gains arising from their transfer of bonds or GDR purchased in foreign currency in case of a non-resident | `5AC1c` | 12.5 | `MAX(0,LTCG_115ac1c)` |
| 38 | 17 | 115AD(1)(i)(A)- Income (other than dividend) received by an FII in respect of securities (other than units referred to in section115AB) | `5AD1i` | 20 | `MAX(0,Source_5AD1i_OS-DTAA_5AD1i_OS)` |
| 39 | 17 | 115AD(1)(i) -Income received by an FII in respect of bonds or government securities as per Sec 194LD | `5AD1iP` | 5 | `MAX(0,Source_5AD1iP_OS-DTAA_5AD1iP_OS)` |
| 40 | 17 | 115AD(ii) -Short term capital gains (other than on equity share or equity oriented mutual fund referred to in section 111A) by an FII | `5ADii` | 30 | `MAX(0,STCG30_STCG115AD_1_ii.IHLA)` |
| 43 | 18 | 115AD(1)(b)(iii) Proviso- For NON-RESIDENTS from sale of equity share in a company or unit of equity oriented fund or unit of a business trust on which STT is paid under section 112A | `5ADiiiP` | 12.5 | `MAX(0,LTCG_115ad)` |
| 44 | 19 | 115BB-Winnings from lotteries, puzzles, races, games etc | `5BB` | 30 | `MAX(0,Source_5BB_OS-DTAA_5BB_OS)` |
| 45 | 20 | 115BBA-Income received by non-resident sportsmen or sports associations or entertainer | `5BBA` | 20 | `MAX(0,Source_5BBA_OS-DTAA_5BBA_OS)` |
| 47 | 21 | 115BBJ-Winnings from online games | `5BBJ` | 30 | `MAX(0,Source_5BBJ_OS-DTAA_5BBJ_OS)` |
| 49 | 22 | 115BBE (Income under section 68, 69, 69A, 69B, 69C or 69D) | `5BBE` | 60 | `MAX(0,Source_5BBE_OS-DTAA_5BBE_OS)` |
| 50 | 23 | 115BBF (Income from patent) — parent (split a/b below) | `5BBF_XXX` | — | — |
| 51 | a | Income under head business or profession | `5BBF_BP` | 10 | `MAX(0,sheet10.IncRecCredPL115BBF)` |
| 52 | b | Income under head other sources | `5BBF` | 10 | `MAX(0,Source_5BBF_OS-DTAA_5BBF_OS)` |
| 53 | 24 | 115BBG (Income from transfer of carbon credits) — parent (split a/b below) | `5BBF_XXX` | — | — |
| 54 | a | Income under head business or profession | `5BBG_BP` (`[F]`=`5BBF_BP`) | 10 | `MAX(0,sheet10.IncRecCredPL115BBG)` |
| 55 | b | Income under head other sources | `5BBG` (`[F]`=`5BBF`) | 10 | `MAX(0,Source_5BBG_OS-DTAA_5BBG_OS)` |
| 56 | 25 | 115AB(1)(a)-Income in respect of units - off -shore fund | `5AB1a` | 10 | `MAX(0,Source_5AB1a_OS-DTAA_5AB1a_OS)` |
| 58 | 26 | 115AB(1)(b)-LTCG on units - off-shore fund | `5AB1b` | 12.5 | `MAX(0,LTCG_115abc)` |
| 59 | 27 | 115E(a)-Investment Income of a Non-Resident Indian | `5Ea` | 20 | `MAX(0,Source_5Ea_OS-DTAA_5Ea_OS)` |
| 61 | 28 | Pass Through Income in the nature of Short Term Capital Gain chargeable @ 20% | `PTI_STCG20P` | 20 | `MAX(0,STCG20_PTI)` |
| 62 | 29 | Pass Through Income in the nature of Short Term Capital Gain chargeable @ 30% | `PTI_STCG30P` | 30 | `MAX(0,STCGPTI30.IHLA)` |
| 64 | 30 | Pass Through Income in the nature of Long Term Capital Gain chargeable @ 12.5% u/s 112A | `PTI_LTCG12_5P112A` | 12.5 | `MAX(0,LTCG_112aPTI)` |
| 66 | 31 | Pass Through Income in the nature of Long Term Capital Gain chargeable @ 12.5% other than u/s 112A | `PTI_LTCG12_5P` | 12.5 | `MAX(0,LTCG_PTI112a)` |
| 68 | 32 | PTI_115A(1)(a)(i)-Dividends in the case of non-residents | `PTI_5A1ai` | 20 | `MAX(0,Source_5A1ai_PTI-DTAA_5A1ai_PTI)` |
| 69 | 33 | PTI_Dividend received by non-resident (Not being company) or foreign company chargeable under proviso to section 115A(1)(a)(A) from a unit in an International Financial Services Centre, as referred in proviso to in sub-section (1A) of section 80LA | `PTI_5A1aA` | 10 | `MAX(0,Source_5A1aA_PTI-DTAA_5A1aA_PTI)` |
| 70 | 34 | PTI_115A(1)(a)(ii)-Interest received in the case of non-residents | `PTI_5A1aii` | 20 | `MAX(0,Source_5A1aii_PTI-DTAA_5A1aii_PTI)` |
| 71 | 35 | PTI_115A(1)(a)(iia)-Interest received by non-resident from infrastructure debt fund | `PTI_5A1aiia` | 5 | `MAX(0,Source_5A1aiia_PTI-DTAA_5A1aiia_PTI)` |
| 72 | 35 | PTI_115A(1)(a)(iiaa)-Income received by non-resident as referred in section 194LC(1) | `PTI_5A1aiiaa` | 5 | `MAX(0,Source_5A1aiiaa_PTI-DTAA_5A1aiiaa_PTI)` |
| 73 | 35 | PTI_115A(1)(a)(iiab)-Income received by non-resident as referred in section 194LD | `PTI_5A1aiiab` | 5 | `MAX(0,Source_5A1aiiab_PTI-DTAA_5A1aiiab_PTI)` |
| 74 | 35 | PTI_115A(1)(a)(iiac)-Income received by non-resident as referred in section 194LBA | `PTI_5A1aiiac` | 5 | `MAX(0,Source_5A1aiiac_PTI-DTAA_5A1aiiac_PTI)` |
| 75 | 35 | PTI_115A(1)(a)(iii)-Income from units purchased in foreign currency in the case of non-residents | `PTI_5A1aiii` | 20 | `MAX(0,Source_5A1aiii_PTI-DTAA_5A1aiii_PTI)` |
| 76 | 35 | PTI_115A(1)(b)(A) & 115A(1)(b)(B) -Income from royalty or fees for technical services received from Government or Indian concern | `PTI_5A1bA` | 20 | `MAX(0,Source_5A1b_PTI-DTAA_5A1b_PTI)` |
| 78 | 36 | PTI_115AB(1)(a)-Income received in respect of units purchased in foreign currency by an off-shore fund | `PTI_5AB1a` | 10 | `MAX(0,Source_5AB1a_PTI-DTAA_5AB1a_PTI)` |
| 79 | 36 | PTI_115AC(1)(a)-Income by way of Interest received from bonds purchased in foreign currency | `PTI_5AC1ab` | 10 | `MAX(0,Source_5AC1ab_PTI-DTAA_5AC1ab_PTI)` |
| 80 | 36 | PTI_115AD(1)(i)-Income received by an FII in respect of securities (other than units referred to in section115AB) | `PTI_5AD1i` | 20 | `MAX(0,Source_5AD1i_PTI-DTAA_5AD1i_PTI)` |
| 81 | 36 | PTI_115AD(1)(i)-Income received by an FII in respect of bonds or government securities referred to in section 194LD | `PTI_5AD1iP` | 5 | `MAX(0,Source_5AD1iP_PTI-DTAA_5AD1iP_PTI)` |
| 82 | 36 | PTI_115BBA-Income received by non-resident sportsmen or sports associations or entertainer | `PTI_5BBA` | 20 | `MAX(0,Source_5BBA_PTI-DTAA_5BBA_PTI)`; helper `[M82]`=`5A1aiiaaP`, `[N82]`=`ossi_5A1aiiaaP` |
| 85 | 37 | PTI_115BBF-Income from patent | `PTI_5BBF` | 10 | `MAX(0,Source_5BBF_PTI-DTAA_5BBF_PTI)`; helper `[M85]`=`PTI_5A1aiiaci`, `[N85]`=`ossi_PTI_5A1aiiaci` |
| 86 | 37 | PTI_115BBG-Income on Transfer of carbon credits | `PTI_5BBG` | 10 | `MAX(0,Source_5BBG_PTI-DTAA_5BBG_PTI)`; helper `[M86]`=`5AD1iDiv`, `[N86]`=`ossi_5AD1iDiv` |
| 87 | 37 | 115A(1)(a)(iiaa)- Income received by non-resident as referred in proviso to section 194LC(1) | `5A1aiiaaP` | 4 | `MAX(0,Source_5A1aiiaaP_OS-DTAA_5A1aiiaaP_OS)`; helper `[M87]`=`PTI_5AD1iDiv`, `[N87]`=`ossi_PTI_5AD1iDiv` |
| 88 | 37 | 115A(1)(a)(iiaa) -Income received by non-resident as referred in second proviso to section 194LC(1) | `5A1aiiaaSP` | 9 | `MAX(0,Source_5A1aiiaaSP_OS-DTAA_5A1aiiaaSP_OS)` |
| 90 | 38 | PTI_115A(1)(a)(iiaa)- PTI - Income received by non-resident as referred in proviso to section 194LC(1) | `PTI_5A1aiiaaP` | 4 | `MAX(0,Source_PTI_5A1aiiaaP_PTI-DTAA_PTI_5A1aiiaaP_PTI)`; helper `[M90]`=`5AD1IB`, `[N90]`=`ossi_5AD1IB` |
| 91 | 39 | PTI - 115A(1)(a)(iiaa)- Income received by non-resident as referred in second proviso to section 194LC(1) | `PTI_5A1aiiaaSP` | 9 | `MAX(0,Source_PTI_5A1aiiaaSP_PTI-DTAA_PTI_5A1aiiaaSP_PTI)` |
| 93 | 39 | 115AD(1)(i)(A)- Income (being dividend) received by an FII in respect of securities (other than units referred to in section 115AB) - chargeable u/s 115AD(1)(i) | `5AD1iDiv` | 20 | `MAX(0,Source_5AD1iDiv_OS-DTAA_5AD1iDiv_OS)`; helper `[M93]`=`PTI_5AD1IB`, `[N93]`=`ossi_PTI_5AD1IB` |
| 94 | 39 | PTI-115AD(1)(i)(A)- Income (being dividend) received by an FII in respect of securities (other than units referred to in section 115AB) - chargeable u/s 115AD(1)(i) | `PTI_5AD1iDiv` | 20 | `MAX(0,Source_PTI_5AD1iDiv_PTI-DTAA_PTI_5AD1iDiv_PTI)` |
| 95 | 39 | 115AD(1)(i)(B)-Income (being dividend) received by a specified fund in respect of securities (other than units referred to in section 115AB) - chargeable u/s 115AD(1)(i) | `5AD1IBd` | 10 | `MAX(0,Source_5AD1IBd_OS-DTAA_5AD1IBd_OS)` |
| 96 | 39 | 115AD(1)(i)(B)- Income (other than dividend) received by a specified fund in respect of securities (other than units referred to in section 115AB) - chargeable u/s 115AD(1)(i) | `5AD1IB` | 10 | `MAX(0,Source_5AD1IB_OS-DTAA_5AD1IB_OS)` |
| 97 | 39 | PTI_115AD(1)(i)(B)- PTI- Income (being dividend) received by a specified fund in respect of securities (other than units referred to in section 115AB) - chargeable u/s 115AD(1)(i) | `PTI_5AD1IBd` | 10 | `MAX(0,Source_PTI_5AD1IBd_PTI-DTAA_PTI_5AD1IBd_PTI)` |
| 98 | 39 | PTI_115AD(1)(i)(B)- PTI- Income (other than dividend) received by a specified fund in respect of securities (other than units referred to in section 115AB) - chargeable u/s 115AD(1)(i) | `PTI_5AD1IB` | 10 | `MAX(0,Source_PTI_5AD1IB_PTI-DTAA_PTI_5AD1IB_PTI)` |
| 99 | 39 | 5AC1b - 115AC(1)(b) - Income by way of Dividend from bonds or GDRs purchased in foreign currency by non-residents - chargeable u/s 115AC | `5AC1abD` | 10 | `MAX(0,Source_5AC1b_OS-DTAA_5AC1b_OS)` |
| 100 | 39 | PTI-115AC(1)(b)- Income by way of Dividend from GDRs purchased in foreign currency by non-residents - chargeable u/s 115AC | `PTI_5AC1abD` | 10 | `MAX(0,Source_PTI_5AC1b_PTI-DTAA_PTI_5AC1b_PTI)` |
| 101 | 39 | PTI_115E(a)-Investment Income of a Non-Resident Indian | `PTI_5Ea` | 20 | `MAX(0,Source_5Ea_PTI-DTAA_5Ea_PTI)` |
| 102 | 40 | 115BBH-Income from transfer of Virtual Digital asset — parent (split a/b below) | — | — | — |
| 103 | a | Income under head business or profession | `5BBH_BP` | 30 | `MAX(0,sheet10.IncRecCredPL115BBH)` |
| 104 | b | Income under head Capital Gains | `5BBH` | 30 | `CG.IncomeVDA` |

Rows 103/104 (VDA) do **not** subtract DTAA. The parent rows 50, 53, 102 are display headers with no rate/income — only their a/b sub-rows carry codes.

### Totals (row 105 — one figure each, not part of the array)

| Cell | Field | Schema key | Formula |
|---|---|---|---|
| `[G105]` | "Tax at Spl Rate" (label) | — | — |
| `[H105]` | Total income | `TotSplRateInc` (`SI.TotSplRateInc`=`SI!$H$105`) | `SUM(SI.SplRateInc)` |
| `[I105]` | Total taxable (calc) | — | `SUM(SI.SplRateIncCalc)` |
| `[J105]` | Total tax | `TotSplRateIncTax` (`SI.TotSplRateIncTax`=`SI!$J$105`) | `SUM(SI.SplRateIncTax)` |

### Edit switch (row 107)

| Cell | Field | Schema key | Values |
|---|---|---|---|
| `[C107]` | "Do you want to edit the details auto-populated in table above ?" | `EditAutopoulatedDetail` (enum `Y`/`N`) | `[J107]` dropdown **"Yes,No"** (default **No**) |

## The rules the sheet computes (with cell references)

**Generic tax:** for most rows `[J..] = ROUND(I.. * G.. /100, 0)` (e.g. `J6`, `J10`, `J19`, `J20`, `J23`, `J33`, `J35`, `J54`, `J55`, `J59`, `J66`, `J76`, `J100`, `J101`, `J103`, `J104`). Taxable `[I..]` = `[H..]` for ordinary rows (`I10=H10`, `I18=H18`, …).

**§112A ₹1,25,000 / ₹1,00,000 exemption** (LTCG on STT-paid equity):
- `[O3] = MIN(100000, SI_Income_112A)` where `SI_Income_112A = SI!$H$17`.
- `[O17] = MIN(125000, I18)`; `[O18] = MIN(125000-O17, SI_Income_112A_PTI_12.5)` (`SI_Income_112A_PTI_12.5 = SI!$H$64`).
- `[J17] = ROUND(IF(H17>N17,(H17-N17)*G17/100,0),0)`; `[J18] = ROUND(IF(H18>O17,(H18-O17)*G18/100,0),0)`; `[J63] = ROUND(IF(H63>N18,(H63-N18)*G63/100,0),0)`; `[J64] = ROUND(IF(H64>O18,(H64-O18)*G64/100,0),0)`. i.e. the ₹1.25L free slab is consumed across the 112A pre/post-23-Jul-2024 and PTI-112A buckets before tax.

**§115AD(1)(iii)-Proviso ₹1,25,000 exemption** (NR on STT-paid units):
- `[O19] = MIN(125000, SI_Income_115AAD1V)` (`SI_Income_115AAD1V = SI!$H$43`); `[J43] = ROUND(IF(I43>O19,(I43-O19)*G43/100,0),0)`.

**§112 proviso (with/without indexing option):** `[J14] = MAX(ROUND((I14*G14/100)-LTCG.B4f_Total,0),0)` — tax at 20% reduced by the CG-computed without-index total.

**Basic-exemption-limit spreading** (resident firm/AOP/BOI unused BEL applied to special-rate CG):
- `[Q4] = MAX((hp.IncOfCurYrAfterSetOffBFLosses1 + busipofincl.…2 + busipofinclspec.…2a + busipofinclspecified.…2b + stcg.…3b + othsrcincl.…5 + rh.…6) - scv …)` (income available for BEL).
- `[R4] = Q4 - SUM(P10:P22)`; `[S4] = R4`; `THRESOLD = SI!$P$4`.
- Per-bucket: `[P10]=exmp20Inc`, `[P12]=exmp15Inc`, `[P14]=exmp10Inc`; `[Q10]=MAX(THRESOLD-S4,0)`, `[R10]=MAX(P10-Q10,0)`, `[S10]=P10-R10`, `[T10]=S10+S4`; then cascades `Q12=MAX(THRESOLD-T10,0)` … `T12=T10+S12` … `Q14=MAX(THRESOLD-T12,0)` … `T14=T12+S14`. `[U10]=SI.SI4`, `[U12]=SI.SI3`, `[U14]=SI.SI6` (write-back of taxable CG after BEL).

**Totals:** `[H105]=SUM(SI.SplRateInc)`, `[I105]=SUM(SI.SplRateIncCalc)`, `[J105]=SUM(SI.SplRateIncTax)`.

### Reconciliations (from `rules.json`, cat A — the numbering is the rule's item)

- **697** — PART B-TTI Sl.no **2b** = "total" of col (ii) "Tax thereon(ii)" of Schedule SI.
- **698 / 699** — Income in OS **2c / 2d** matches the corresponding SI section (subject to DTAA).
- **700** — OS **2a** (115BB) matches corresponding SI income (subject to DTAA).
- **701 / 702** — SI **115BBE** matches OS **2b**; SI **115BBF** (business/profession) matches BP **3d**.
- **703** — SI **115BBG** matches BP **3e**.
- **704** — SI **"Income from other sources chargeable at special rates in India as per DTAA"** = **BFLA 5(xiv)** (NR: only if TRC flag "Yes"; Resident: always).
- **705 / 706** — Tax col (ii) = taxable income × special rate, **except** OS-DTAA, 112A, PTI-112A and 115AD(1)(iii)-Proviso, STCG-DTAA, LTCG-DTAA; tax (ii) cannot be null if income (i) > 0.
- **707** — SI 115AD (STCG for FIIs, STT not paid) + PTI STCG @30% = **BFLA 5vii**.
- **708** — Total "Tax Thereon (ii)" = sum of individual line items.
- **709 / 710** — SI STCG-DTAA = **BFLA 5ix**; SI LTCG-DTAA = **BFLA 5xi**.
- **711** — SI "115BBC-Anonymous Donations" cannot be more than 0 (row is hidden anyway).
- **712** — SI **115BBH** (VDA) business/profession = **BP 3f**.
- **713 / 714 / 715** — 111A + 115AD(1)(ii)-Proviso + PTI STCG @20% = **BFLA 5vi**; the whole **12.5%** LTCG bucket (Land&Building/slump/NR shares/other assets/deemed CG/112(1)(c)(iii)/115AC(1)(c)/115AD(b)(iii)-Proviso/115AD-FII/PTI-LTCG 12.5% u/s 112A/PTI-LTCG 12.5% other) = **BFLA 5xb**.
- **716** — Each special income = corresponding head income after reducing DTAA (per §2e; NR only if TRC "Yes", Resident always).
- **717–730** — Each SI CG code ≤ the corresponding Schedule CG figure after reducing DTAA: 111A ≤ CG A3ie/A4a; 115AD(1)(b)(ii) ≤ CG A3iie; 112(1) ≤ CG B3c; 112(1)(c)(iii) ≤ CG B6ic; 112A ≤ CG B4 / 112A col 14; 115AB(1)(b) ≤ CG B6iic; 115AC(1)(c) ≤ CG B6iiic; 115AD(1)(b)(ii) ≤ CG A5e; 115AD(1)(b)(iii) ≤ CG B6ivc; 115AD(1)(b)(iii)-Proviso ≤ CG B7; PTI-STCG@20% ≤ CG A8a; PTI-STCG@30% ≤ CG A8b; PTI-LTCG@12.5% u/s112A ≤ CG B10a1; PTI-LTCG@12.5% other ≤ CG B10a2.
- **249 / 479** — §115BBF in OS/BP claimable only by a Resident.
- **415** — CG Table F "Income under head Capital Gain" of Schedule SI breakup = CG C2.

### VBA validators (`sources/ITR-5/vba_text.txt`)
- "**Income in Schedule SI is mandatory. Please fill zero if there is no value.**"
- "**System calculated tax thereon in Schedule SI is mandatory. Please fill zero if there is no value.**"
- "**115B-Profits and gains of life insurance business income in Sch SI is mandatory…**" (guards the hidden 115B row `SI_5B`).
- "**DTAA Income from CG in Sheet: SI should not be blank…**" and "**DTAA Income in Sheet: SI should be Non negative…**".

## Dropdowns (every value)

The data-entry validation cells (`G5:G6 G10:G104`, `H5 H7:H104`, `I5:I104 J7:J9`, etc.) all carry `source="0"` — i.e. **locked/greyed** (no picklist; auto-populated numeric cells). The **only real dropdown** is:

- `[J107]` — **"Yes, No"** → values: **Yes**, **No**. (Maps to `EditAutopoulatedDetail` enum `Y`/`N`.)

## What repeats and what is one figure

- **The whole grid is a fixed roster of codes**, not a user add-row list. The export block `SplCodeRateTax[]` is an **array**, but one object per *code that has non-zero income* — the utility auto-generates them from the ~90 fixed rows, it is not free-add.
- **`TotSplRateInc` (H105)** and **`TotSplRateIncTax` (J105)** are single grand-total figures.
- **`EditAutopoulatedDetail`** is a single Yes/No switch.

## Mandatory (schema `required`)

`ScheduleSI` required: **`TotSplRateInc`**, **`TotSplRateIncTax`**.
Each `SplCodeRateTax[]` object required: **`SecCode`**, **`SplRatePercent`**, **`SplRateInc`**, **`SplRateIncTax`** (all four). `EditAutopoulatedDetail` is optional.
Per VBA, both **Income (i)** and **System calculated tax thereon (ii)** are mandatory-fill-zero.

Schema leaves (`--leaves ScheduleSI`): `SplCodeRateTax[]` · `SplCodeRateTax[].SecCode` (SecCode, req) · `SplCodeRateTax[].SplRatePercent` (SplRatePercent, req) · `SplCodeRateTax[].SplRateInc` (SplRateInc, req) · `SplCodeRateTax[].SplRateIncTax` (SplRateIncTax, req) · `TotSplRateInc` (req) · `TotSplRateIncTax` (req) · `EditAutopoulatedDetail`.

`SplRatePercent` enum (12): 1, 5, 10, 15, 12.5, 20, 25, 30, 50, 60, 4, 9.
`SecCode` enum (71 codes → labels), verbatim from `enums.json`: `1`=111A (STCG on shares where STT paid); `21`=112 LTCG (with indexing); `22`=112 LTCG (without indexing); `21ciii`=112(1)(c)(iii) LTCG unlisted NR; `2A`=112A LTCG STT-paid; `5A1ai`=115A(1)(a)(i); `5AB1a`=115AB(1)(a); `5A1aA`=115A(1)(a)(A) IFSC; `5AB1b`=115AB(1)(b); `5A1aii`=115A(1)(a)(ii); `5A1aiia`=115A(1)(a)(iia) IDF; `5A1aiiaa`=115A(1)(a)(iiaa) 194LC(1); `5A1aiiaaSP`=…second proviso 194LC(1); `5A1aiiaaP`=…proviso 194LC(1); `5A1aiiab`=115A(1)(a)(iiab) 194LD; `5A1aiiac`=115A(1)(a)(iiac) 194LBA; `5A1aiii`=115A(1)(a)(iii) UTI units; `5A1bA`=115A(1)(b)(A) royalty/FTS; `5AD1IB`=115AD(1)(i)(B) other than dividend; `5AC1ab`=115AC(1)(a) interest bonds; `5AD1IBd`=115AD(1)(i)(B) dividend; `5AC1abD`=115AC(1)(b) dividend GDR; `5AC1c`=115AC(1)(c) LTCG bonds/GDR; `5AD1i`=115AD(1)(i) other than dividend FII; `5AD1iDiv`=115AD(1)(i) dividend FII; `5AD1iP`=115AD(1)(i) 194LD; `5ADii`=115AD(1)(ii) STCG FII; `5AD1biip`=115AD(1)(b)(ii) STCG 111A; `5ADiii`=115AD(1)(iii) LTCG FII; `5ADiiiP`=Proviso to 115AD(iii); `5BB`=115BB winnings; `5BBJ`=115BBJ online games; `5BBA`=115BBA NR sportsmen; `5BBH`=115BBH VDA (CG); `5BBH_BP`=115BBH VDA (BP); `5BBE`=115BBE (68/69…); `5BBF`=115BBF patent; `5BBF_BP`=115BBF patent (BP); `5BBG`=115BBG carbon credits; `5BBG_BP`=115BBG carbon credits (BP); `5Ea`=115E(a) NRI investment income; `DTAASTCG`=STCG DTAA rate; `DTAALTCG`=LTCG DTAA rate; `DTAAOS`=OS income DTAA rate; and the PTI_* mirror codes: `PTI_5AB1a`, `PTI_STCG20P`, `PTI_STCG30P`, `PTI_LTCG12_5P112A`, `PTI_LTCG12_5P`, `PTI_5A1ai`, `PTI_5A1aA`, `PTI_5A1aii`, `PTI_5A1aiia`, `PTI_5A1aiiaa`, `PTI_5A1aiiaaP`, `PTI_5A1aiiaaSP`, `PTI_5A1aiiab`, `PTI_5A1aiiac`, `PTI_5A1aiii`, `PTI_5A1bA`, `PTI_5AC1ab`, `PTI_5AC1abD`, `PTI_5AD1i`, `PTI_5AD1iDiv`, `PTI_5AD1iP`, `PTI_5BBA`, `PTI_5BBF`, `PTI_5BBG`, `PTI_5Ea`, `PTI_5AD1IBd`, `PTI_5AD1IB`.

## Hidden rows — not built (H)

These rows are hidden in the utility (`H` flag from `dump.py`). They are legacy "where transfer was before 23rd July 2024" pre-Budget-2024 variants, disabled sections, or internal helper rows. **Do not build them as items.**

| Row | Description / role |
|---|---|
| 5H | Helper: `[O5]=MIN(100000-O3-O6, SI_Income_112A_PTI)` (112A exemption spread) |
| 6H | **115B-Profits and gains of life insurance business** (`5B`, rate 12.5); `[O6]=MIN(100000-O3, SI_Income_112A_115AD)` |
| 10H | 111A STCG on equity/EOF chargeable to STT **[where transfer was before 23rd July 2024]** (`1A`) |
| 12H | 112 LTCG **(with indexing) [transfer/event before 23rd July 2024]** |
| 14H | 112proviso LTCG u/s 112(1) on listed securities/units **[proviso where transfer before 23rd July 2024]** |
| 16H | 112 proviso LTCG **(without indexing) [transfer before 23rd July 2024]** |
| 17H | 112A LTCG on equity/EOF/business-trust units STT-paid **[transfer/event before 23rd July 2024]** |
| 19H | 115AD(1)(b)(ii) STCG referred to in 111A **[before 23rd July 2024]** (`5AD1biip`) |
| 21H | 115AD(1)(iii) Proviso — NON-RESIDENTS, STT-paid units u/s 112A **[before 23rd July]** |
| 22H | 112(1)(c)(iii) LTCG unlisted securities/other than listed debentures, NR **[before 23rd July 2024]** (`21ciii`) |
| 33H | 115AC(1)(a) interest from bonds purchased in foreign currency by NR (`5A1bB`) |
| 36H | 115AC(1)(c) LTCG on bonds/GDR **[before 23rd July 2024]** (`5AC1c`) |
| 41H | 115AD(1)(iii) LTCG by an FII (`5ADiii`) |
| 42H | 115AD(1)(iii) Proviso — NON-RESIDENTS, STT-paid units u/s 112A **[before 23rd July]** |
| 46H | 115BBC-Anonymous donations (`5BBC`) — rule 711 forces = 0 |
| 48H | 115BBDA (dividend from domestic company exceeding Rs.10 lakh) (`5BBDA`) — repealed |
| 57H | 115AB(1)(b) LTCG on units off-shore fund **[before 23rd July]** (`5AB1b`) |
| 60H | PTI STCG chargeable @ 15% |
| 63H | PTI LTCG chargeable @ 10% u/s 112A |
| 65H | PTI LTCG chargeable @ 10% |
| 67H | PTI LTCG chargeable @ 20% |
| 77H | PTI_115ACA dividends from GDRs purchased in foreign currency by residents |
| 83H | PTI_115BBC-Anonymous donations |
| 84H | PTI_115BBDA-Tax on certain dividends from domestic companies |
| 89H | 115A(1)(a)(iiac) distributed income (interest) NR u/s 194LBA (`5A1aiiaci`) |
| 92H | PTI_115A(1)(a)(iiac) distributed income (dividend) 194LBA |

Helper (M/N) codes on live rows, quoted for completeness: `ossi_5A1aiiaaP`, `PTI_5A1aiiaci`, `ossi_PTI_5A1aiiaci`, `ossi_5AD1iDiv`, `PTI_5AD1iDiv`, `ossi_PTI_5AD1iDiv`, `ossi_5AD1IB`, `ossi_PTI_5AD1IB` — internal reverse-lookup keys, not schema fields.

## What this means for the build

- **Nothing on SI is keyed by hand.** Build the block as **auto-populated**: pull `SplRateInc` (col H) from OS/CG/BP/BFLA sources (each row's `Source_*_OS` − `DTAA_*_OS` / `Source_*_PTI` − `DTAA_*_PTI` / `LTCG_*` / `STCG*` / `sheet10.IncRecCredPL*` / `CG.IncomeVDA`), apply the fixed `SplRatePercent`, and compute `SplRateIncTax` per the tax formulas (`ROUND(I*G/100,0)`, with the 112A/115AD(1)(iii)-Proviso threshold exemptions and the §112 without-index reduction).
- **Emit `SplCodeRateTax[]` only for codes with income > 0**, each with all four required keys; roll up `TotSplRateInc` = Σ income and `TotSplRateIncTax` = Σ tax. Per VBA, write **0** rather than blank where a row is live but nil.
- **Enforce the exemption spreading** (₹1,25,000 for 112A / 115AD(1)(iii)-Proviso; basic-exemption-limit for resident CG via the P/Q/R/S/T/U cells) before taxing — otherwise the tax total will overstate.
- **Wire the reconciliations** so the special-rate incomes tie back to BFLA col 5 (5vi/5vii/5ix/5xb/5xi/5xiv), OS (2a/2b/2c/2d), CG (A3ie/A4a/A5e/A8a/A8b/B3c/B4/B6*/B7/B10a*), BP (3d/3e/3f) and VDA (CG.IncomeVDA); and feed `TotSplRateIncTax` into **PART B-TTI 2b**.
- **Expose the single Yes/No** `EditAutopoulatedDetail` switch (`N` default); when `Y`, the utility unlocks manual override of the auto-populated income/tax (rare — DTAA/treaty-rate cases).
- **Do not render any H row.** The pre-23-July-2024 indexing/rate variants, 115B, 115BBC, 115BBDA and the PTI-@10%/@15%/@20% legacy rows are hidden and must stay out of the built form.
