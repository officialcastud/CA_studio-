# The book of Schedule SI — ITR-6, A.Y. 2026-27

Read row by row from the utility's **SI** sheet (`sheet46.xml`, 235 rows, 151
hidden), with the hidden-row flags, the helper columns (N, O, P, Q, R, S, T, U,
V, W, X) and the per-cell formulas, and confirmed against schema block
`ScheduleSI` and the validation-rules document (Schedule SI, serials A612–A645,
and the Part B feeds A237/A413/A748/A751/A755).

Section on screen: **si** — this sheet is the only sheet in that section, and it
backs the single block **ScheduleSI**.

> The SI sheet also physically carries a **hidden** Schedule IF fragment (rows
> 108–115: "Information regarding investment in unincorporated entities"). Those
> rows are hidden and are **not** part of Schedule SI — Schedule IF is a
> separate visible sheet (`IF`, sheet47, block `ScheduleIF`) and is booked
> there. They are logged as excluded (hidden) below and not built here.

---

## 1 · Purpose and shape

*"Sch SI — Income chargeable to Income tax at special rates."* The special-rate
schedule: one row per special-rate head that carries income, showing the
head's section code, its statutory rate, the income (from the head's own
schedule), the taxable income after the minimum-chargeable-to-tax adjustment,
and the tax thereon. Nothing on this sheet is typed by the filer — every income
figure is fed from OS, CG or BP; the only input is the override switch at the
foot.

The table columns (row 6 header):

| Col | Header | Kind | Schema |
|---|---|---|---|
| C | SPECIAL RATE (band label) | fixed | — |
| D | Sl No (`Serial no's other than Sl no 1,2 are auto filled`) | auto | — |
| E | Section/Description | fixed label | — |
| F | Section code (`Serial no's other than Sl no 1,2 are auto filled`) | fixed code | `SecCode` |
| G | Special rate (%) | fixed per head | `SplRatePercent` |
| H | Income (I) | computed, fed | `SplRateInc` |
| I | Taxable Income after adjusting for Min Chargeable to Tax | computed | *(not filed — see §5)* |
| J | Tax thereon | computed | `SplRateIncTax` |

Named ranges: `SI.SplRateInc = H7:H104`, `SI.SplRateIncCalc = I7:I104`,
`SI.SplRateIncTax = J7:J104`, `SI.SplRatePercent = G7:G92`,
`FormulaOfSI = Q7:Q118`, `THRESOLD = R6`, `AggregateIncome = Tax!N39`.

Total row (r106): `H106 = SUM(SI.SplRateInc)` → **`TotSplRateInc`**;
`I106 = SUM(SI.SplRateIncCalc)`; `J106 = SUM(SI.SplRateIncTax)` →
**`TotSplRateIncTax`**.

Override switch (r116): **"Do you want to edit the details auto-populated in
table above ?"** → `EditAutopoulatedDetail`, a Yes/No dropdown (default **No**).

**Helper columns (off-screen, right of the table):** column S is labelled
**"Available Income"** (`S6 = AggregateIncome + H9 + H13 + H15 + H17`), column T
**"Taxable SI"**, column U **"Income Adjustment"**; columns N/Q hold the
shortfall-order markers ("1st"…"4th"); columns O/P hold the ₹1,25,000 shares
(§5); columns Q/R near the foot carry the DTAA look-up (Q69 **"DTAA - Double
Taxation Avoidance Agreement From CG"**, Q70 **"Chargeable under DTAA rate"**,
R70 = `DTAAOS`); column X is a section look-up list. The Q/X columns also carry
the OS-feed key names verbatim (e.g. `ossi_5A1aiiaaP`, `ossi_5A1aiiaci`,
`ossi_PTI_5A1aiiaci`, `ossi_PTI_5AD1iDiv`, `ossi_PTI_5AD1IBd`, `ossi_PTI_5AC1b`,
`ossec_PTI_5AD1IBd`, `osDTAA_PTI_5AD1IBd`) used to pull each head's income from
Schedule OS — helper columns are rules, read them.

---

## 2 · The rows — code, rate, feed, hidden

Every live row's `F` code is a member of the `ScheduleSI.SplCodeRateTax[].SecCode`
enum (§3). "Feed" is the schedule the income (column H) is drawn from — the
brief's question. `_BE` rows are the **pre-23-July-2024 rate twins** ("before
event") and are all **hidden**; other hidden rows are older/superseded slots.

| r | Sl | F (code) | Rate % | Feed | Hidden | Label / section |
|---|---|---|---|---|---|---|
| 7 | — | `1` | 0 | IT.SI (`SI_111Inc`) | **H** | 111-Tax on accumulated balance of recognised provident fund |
| 8 | 1 | `5B` | 12.5 | **BP** (`Prof.IncOfCurYrAfterSetOffBFLosses2`) | | 115B- Profits and gains from life insurance business |
| 9 | 2a | `1A_BE` | 15 | **CG** (`STCG111A.IHLA`) | **H** | 111A-STCG on equity share/equity oriented fund chargeable to STT [before 23 Jul 2024] |
| 10 | — | `1A` | 20 | **CG** (`STCG20_a3e_a4a`) | | 111A-Short term capital gains on equity share or equity oriented fund chargeable to STT |
| 11 | 3a | `5AD1biip_BE` | 15 | **CG** (`STCG111A_STCG115AD_1_b_ii.IHLA`) | **H** | 115AD(1)(b)(ii) Proviso- STCG referred to in 111A- by FII [before 23 Jul 2024] |
| 12 | — | `5AD1biip` | 20 | **CG** (`STCG20_115AD_A3eii`) | | 115AD(1)(b)(ii) Proviso- STCG referred to in section 111A- by FII |
| 13 | 4a | `21_BE` | 20 | **CG** (`LTCGNP.IHLA`) | **H** | 112-Long term capital gains (with indexing) [before 23 Jul 2024] |
| 14 | — | `21` | 12.5 | **CG** (`B1GB2eB5B8B9_112proviso_SI`) | | 112-Long term capital gains |
| 15 | 5a | `22_BE` | 20 | **CG** (`LTCGNP_115_E_a.IHLA`) | **H** | Proviso 112(1)- LTCG (indexing) [before 23 Jul 2024] |
| 16 | — | `22` | 12.5 | **CG** (`B3c_SI`) | | 112(1) (LTCG on listed securities/ units) |
| 17 | 6a | `21ciii_BE` | 10 | **CG** (`LTCGP_112_1_c_iii.IHLA`) | **H** | 112(1)(c)(iii)- LTCG on unlisted securities, non-resident [before 23 Jul 2024] |
| 18 | — | `21ciii` | 12.5 | **CG** (`B6ci_1121ciii_SI`) | | 112(1)(c)(iii)- LTCG for non-resident on unlisted securities or other than Listed debentures |
| 19 | 7a | `2A_BE` | 10 | **CG** (`LTCGP_112A.IHLA`) | **H** | 112A- LTCG on equity shares/units …STT paid [before 23 Jul 2024] |
| 20 | — | `2A` | 12.5 | **CG** (`B4c_112_SI`) | | 112A- LTCG on equity shares/units of equity oriented fund/units of business trust on which STT is paid |
| 21 | 8a | `5AB1b_BE` | 10 | **CG** (`LTCGP_115_E_b.IHLA`) | **H** | 115AB(1)(b)- LTCG from transfer of units purchased in foreign currency [before 23 Jul 2024] |
| 22 | — | `5AB1b` | 12.5 | **CG** (`B6cii_115AB1b_SI`) | | 115AB(1)(b)- LTCG from the transfer of units purchased in foreign currency by an off-shore fund |
| 23 | — | `5A1ai` | 20 | **OS** (`ossi_5A1ai`) | | 115A(1)(a)(i)-Dividends received by foreign company chargeable u/s 115A(1)(a)(i) & clause (A) |
| 24 | — | `5A1aii` | 20 | **OS** (`ossi_5A1aii`) | | 115A(1)(a)(ii)-Interest received from govt/Indian Concerns received in Foreign Currency |
| 25 | — | `5A1aiia` | 5 | **OS** (`ossi_5A1aiia`) | | 115A(1)(a)(iia)- Interest received by non-resident from infrastructure debt fund |
| 26 | — | `5A1aiiaa` | 5 | **OS** (`ossi_5A1aiiaa`) | | 115A(1)(a)(iiaa)-Interest received by non-resident as referred in section 194LC(1) |
| 27 | — | `5A1aiiab` | 5 | **OS** (`ossi_5A1aiiab`) | | 115A(1)(a)(iiab)- Interest received by non-resident as referred in section 194LD |
| 28 | — | `5A1aiiac` | 5 | **OS** (`ossi_5A1aiiac`) | | 115A(1)(a)(iiac)- Distributed income being interest received by NR under 194LBA(2) |
| 29 | — | `5A1aiii` | 20 | **OS** (`ossi_5A1aiii`) | | 115A(1)(a)(iii)- Income in respect of units of UTI or 10(23D) purchased in Foreign Currency |
| 30 | — | `FA` | 50 | **OS** (`ossi_fa`) | | Paragraph EII of Part I of first schedule of Finance Act — royalty/technical services (old agreements) |
| 31 | — | `5A1bA` | 20 | **OS** (`ossi_5A1bA`) | | 115A(1)(b)- Income from royalty & technical Services, non-resident (agreement after 31-03-1976) |
| 32 | — | `5A1aA` | 10 | **OS** (`ossi_5A1aA`) | | 115A(1)(a)(A) Dividend received by non resident from a unit in an International Financial Services Centre |
| 33 | — | `5AC1ab` | 10 | **OS** (`ossi_5AC1ab`) | | 115AC(1)(a)- Income by way of interest from bonds purchased in foreign currency by non-residents |
| 34 | 20a | `5AC1c_BE` | 10 | **CG** (`LTCGP_115AC_1_c.IHLA`) | **H** | 115AC(1)(c)- LTCG on transfer of bonds/GDR purchased in foreign currency [before 23 Jul 2024] |
| 35 | 20b | `5AC1c` | 12.5 | **CG** (`B6ciii_115AC1_SI`) | | 115AC(1)(c)- LTCG on transfer of bonds or GDR purchased in foreign currency, non-resident |
| 36 | — | `5AD1i` | 20 | **OS** (`ossi_5AD1i`) | | 115AD(1)(i)- Income (other than dividend) received by an FII in respect of securities |
| 37 | — | `5AD1iP` | 5 | **OS** (`ossi_5AD1iP`) | | 115AD(1)(i) Proviso- Income received by an FII in respect of bonds/govt securities (194LD) |
| 38 | — | `5ADii` | 30 | **CG** (`STCG30_STCG115AD_1_ii.IHLA`) | | 115AD(1)(b)(ii)- Short term capital gains (other than 111A) by an FII |
| 39 | — | `5ADiii` | 12.5 | **CG** (`B6civ_115ADiii_SI`) | | 115AD(1)(b)(iii)- Long term capital gains (other than 112A) by an FII |
| 40 | 25a | `5ADiiiP_BE` | 10 | **CG** (`LTCG_115AD.IHLA`) | **H** | 115AD(1)(b)(iii) Proviso- NON-RESIDENTS, sale of equity/units u/s 112A [before 23 Jul 2024] |
| 41 | — | `5ADiiiP` | 12.5 | **CG** (`B7_115AD1biii_proviso_SI`) | | 115AD(1)(b)(iii) Proviso- For NON-RESIDENTS from sale of equity share/units u/s 112A |
| 42 | — | `5BB` | 30 | **OS** (`ossi_5BB`) | | 115BB- Winnings from lotteries, crosswords puzzles, races, card games, gambling or betting |
| 43 | — | `5BBJ` | 30 | **OS** (`ossi_5BBJ`) | | 115BBJ - Income by way of winnings from Online games |
| 44 | — | `5BBA` | 20 | **OS** (`ossi_5BBA`) | | 115BBA- Income Received by non-resident sportsmen or sports associations or entertainer |
| 45 | — | `5BBC` | 30 | **OS** (`ossi_5BBC`) | **H** | 115BBC-Anonymous donations |
| 46 | — | `5BBE` | 60 | **OS** (`os.Total115BE`) | | 115BBE- Tax on income under section 68, 69, 69A, 69B, 69C or 69D |
| 47 | — | `5AB1a` | 10 | **OS** (`ossi_5Ea`) | | 115AB(1)(a)-Income in respect of units purchased in foreign currency by an off-shore fund |
| 48 | — | `5BBD` | 15 | **OS** (`ossi_5BBD`) | **H** | 115BBD-Tax on dividend received by an Indian company from specified foreign company |
| 49 | — | `5BBDA` | 10 | **OS** (`ossi_5BBDA`) | **H** | 115BBDA-Tax on dividend income from domestic company exceeding Rs.10 Lakh |
| 50 | — | `5BBFXX` | 0 | *(group header)* | | 115BBF (Tax on income from patent) |
| 51 | — | `5BBF_BP` | 10 | **BP** (`sheet10.IncRecCredPL115BBF`) | | a) Income under head business or profession |
| 52 | — | `5BBF` | 10 | **OS** (`ossi_5BBE`) | | b) Income under the head Other Sources |
| 53 | — | `5BBGXX` | 0 | *(group header)* | | 115BBG-Tax on income from transfer of carbon credits |
| 54 | — | `5BBG_BP` | 10 | **BP** (`sheet10.IncRecCredPL115BBG`) | | a) Income under head business or profession |
| 55 | — | `5BBG` | 10 | **OS** (`ossi_5BBG`) | | b) Income under head other sources |
| 56 | — | `STCGDTAA` | 1 | **CG** (`stcg.IncOfCurYrAfterSetOffBFLossesDTAA`) | | STCG Chargeable at special rates in India as per DTAA |
| 57 | — | `LTCGDTAA` | 1 | **CG** (`ltcg.IncOfCurYrAfterSetOffBFLossesDTAA`) | | LTCG Chargeable at special rates in India as per DTAA |
| 58 | — | `OSDTAA` | 1 | **OS** (`OS.IncOfCurYrAfterSetOffBFLosses`) | | Income from other source Chargeable at special rates in India as per DTAA |
| 59 | 40a | `PTI_STCG15P` | 15 | **CG** (`STCGPTI15.IHLA`) | **H** | Pass Through Income in the nature of Short Term Capital Gain chargeable @ 15% |
| 60 | — | `PTI_STCG20P` | 20 | **CG** (`STCG20_A8a`) | | Pass Through Income in the nature of Short Term Capital Gain chargeable @ 20% |
| 61 | — | `PTI_30%` | 30 | **CG** (`STCGOTH.IHLA`) | | Pass Through Income in the nature of Short Term Capital Gain chargeable @ 30% |
| 62 | 42a | `PTI_LTCG10P112A` | 10 | **CG** (`LTCGP_112APTI.IHLA`) | **H** | Pass Through Income in the nature of Long Term Capital Gain chargeable @ 10% u/s 112A |
| 63 | — | `PTI_LTCG12_5P112A` | 12.5 | **CG** (`PTIB10a1_112A_SI`) | | Pass Through Income in the nature of Long Term Capital Gain chargeable @ 12.5% u/s 112A |
| 64 | 43a | `PTI_LTCG10P` | 10 | **CG** (`LTCGPTI10.IHLA`) | **H** | Pass Through Income in the nature of Long Term Capital Gain chargeable @ 10% other than section 112A |
| 65 | — | `PTI_LTCG12_5P` | 12.5 | **CG** (`PTIB10a2_112A_SI`) | | Pass Through Income in the nature of Long Term Capital Gain chargeable @ 12.5% other than section 112A |
| 66 | — | `PTI_20%` | 20 | **CG** (`LTCGPTI20.IHLA`) | **H** | Pass Through Income in the nature of Long Term Capital Gain chargeable @ 20% |
| 67 | — | `PTI_5A1ai` | 20 | **OS** (`ossi_PTI_5A1ai`) | | PTI-115A(1)(a)(i)-Dividends received by foreign company chargeable u/s 115A(1)(a)(i) |
| 68 | — | `PTI_5A1aii` | 20 | **OS** (`ossi_PTI_5A1aii`) | | PTI-115A(1)(a)(ii)-Interest received in the case of non-residents |
| 69 | — | `PTI_5A1aiia` | 5 | **OS** (`ossi_PTI_5A1aiia`) | | PTI-115A(1)(a)(iia)-Interest received by non-resident from infrastructure debt fund |
| 70 | — | `PTI_5A1aiiaa` | 5 | **OS** (`ossi_PTI_5A1aiiaa`) | | PTI - Income received by non-resident as referred in proviso to section 194LC(1) |
| 71 | — | `PTI_5A1aiiab` | 5 | **OS** (`ossi_PTI_5A1aiiab`) | | PTI-115A(1)(a)(iiab)-Income received by non-resident as referred in section 194LD |
| 72 | — | `PTI_5A1aiiac` | 5 | **OS** (`ossi_PTI_5A1aiiac`) | | PTI-115A(1)(a)(iiac)-Income received by non-resident as referred in section 194LBA |
| 73 | — | `PTI_5A1aiii` | 20 | **OS** (`ossi_PTI_5A1aiii`) | | PTI-115A(1)(a)(iii)-Income from units purchased in foreign currency, non-residents |
| 74 | — | `PTI_FA` | 50 | **OS** (`ossi_PTI_FA`) | | PTI-Paragraph EII of Part I of first schedule of Finance Act — royalty (old agreements) |
| 75 | — | `PTI_5A1aA` | 10 | **OS** (`ossi_PTI_5A1aA`) | | PTI-115A(1)(a)(A) Dividend from a unit in an International Financial Services Centre |
| 76 | — | `PTI_5A1b` | 20 | **OS** (`ossi_PTI_5A1b`) | | PTI-115A(1)(b)(A) & 115A(b)(B)- Income from royalty or Technical services, non-resident |
| 77 | — | `PTI_5AB1a` | 10 | **OS** (`ossi_PTI_5AB1a`) | | PTI-115AB(1)(a)-Income in respect of units purchased in foreign currency by an off-shore fund |
| 78 | — | `PTI_5AC1ab` | 10 | **OS** (`ossi_PTI_5AC1ab`) | | PTI-115AC(1)(a)-Income by way of interest from bonds purchased in foreign currency, non-residents |
| 79 | — | `PTI_5AD1i` | 20 | **OS** (`ossi_PTI_5AD1i`) | | PTI-115AD(1)(i)-Income (other than dividend) received by an FII in respect of securities |
| 80 | — | `PTI_5AD1iP` | 5 | **OS** (`ossi_PTI_5AD1iP`) | | PTI-115AD(1)(i) proviso-Income received by an FII in respect of bonds/govt securities (194LD) |
| 81 | — | `PTI_5BBA` | 20 | **OS** (`ossi_PTI_5BBA`) | | PTI-115BBA-Tax on non-resident sportsmen or sports associations or entertainer |
| 82 | — | `PTI_5BBC` | 30 | **OS** (`ossi_PTI_5BBC`) | **H** | PTI_5BBC-Anonymous donations |
| 83 | — | `PTI_5BBD` | 15 | **OS** (`ossi_PTI_5BBD`) | **H** | PTI_5BBD-Tax on dividend received by an Indian company from specified foreign company |
| 84 | — | `PTI_5BBF` | 10 | **OS** (`ossi_PTI_5BBF`) | | PTI-115BBF-tax on income from patent |
| 85 | — | `PTI_5BBG` | 10 | **OS** (`ossi_PTI_5BBG`) | | PTI-115BBG-Income on transfer of carbon credits |
| 86 | — | `5A1aiiaaP` | 4 | **OS** (`ossi_5A1aiiaaP`) | | 115A(1)(a)(iiaa)- Income received by non-resident as referred in proviso to section 194LC(1) |
| 87 | — | `5A1aiiaci` | 10 | **OS** (`ossi_5A1aiiaci`) | **H** | 115A(1)(a)(iiac)- Distributed income being Dividend referred to in section 194LBA |
| 88 | — | `PTI_5A1aiiaaP` | 4 | **OS** (`ossi_PTI_5A1aiiaaP`) | | PTI-115A(1)(a)(iiaa)-Income received by non-resident as referred in section 194LC(1) |
| 89 | — | `PTI_5A1aiiaci` | 10 | **OS** (`ossi_PTI_5A1aiiaci`) | **H** | PTI_115A(1)(a)(iiac)- Distributed income being Dividend referred to in section 194LBA |
| 90 | — | `5AD1iDiv` | 20 | **OS** (`ossi_5AD1iDiv`) | | 115AD(1)(i)- Income (being dividend) received by an FII in respect of securities |
| 91 | — | `PTI_5AD1iDiv` | 20 | **OS** (`ossi_PTI_5AD1iDiv`) | | PTI-Income (being dividend) received by a specified fund in respect of securities |
| 92 | — | `PTI_5BBDA` | 10 | *(no feed; H92=0)* | **H** | PTI_5BBDA-Tax on certain dividends received from domestic companies |
| 93 | — | — | — | — | **H** | *(blank helper row)* |
| 94 | — | `5AD1IBd` | 10 | **OS** (`ossi_5AD1IBd`) | | 115AD(1)(i)(B)- Income (being dividend) received by a specified fund in respect of securities |
| 95 | — | `5AD1IB` | 10 | **OS** (`ossi_5AD1IB`) | | 115AD(1)(i)(B)- Income (other than dividend) received by a specified fund in respect of securities |
| 96 | — | `PTI_5AD1IBd` | 10 | **OS** (`ossi_PTI_5AD1IBd`) | | PTI_115AD(1)(i)(B)- Income (being dividend) received by a specified fund |
| 97 | — | `PTI_5AD1IB` | 10 | **OS** (`ossi_PTI_5AD1IB`) | | PTI_115AD(1)(i)(B)- Income (other than dividend) received by a specified fund |
| 98 | — | `5AC1b` | 10 | **OS** (`ossi_5AC1b`) | | 115AC(1)(b)- Income by way of dividend from GDRs purchased in foreign currency by non-residents |
| 99 | — | `PTI_5AC1b` | 10 | **OS** (`ossi_PTI_5AC1b`) | | PTI_115AC(1)(b)-Income by way of dividend from GDRs purchased in foreign currency, non-residents |
| 100 | — | *(none)* | — | *(group header)* | | 115BBH (Income from transfer of virtual digital asset) |
| 101 | — | `5BBH_BP` *(F cell reads `PTI_5AC1b` — see §8)* | 30 | **BP** (`sheet10.IncRecCredPL115BBH`) | | a) Income under the head Business or profession |
| 102 | — | `5BBH` *(F cell reads `PTI_5AC1b` — see §8)* | 30 | **CG** (`CG.C2_TotScheduleCGFor23`) | | b) Income under the head Capital Gain |
| 103 | — | `5A1aiiaa2P` | 9 | *(other — `AC32`)* | | 115A(1)(a)(iiaa)- Income received by non-resident as referred in second proviso to section 194LC(1) |
| 104 | — | `PTI_115A(1)(a)(iiaa)` | 9 | *(other — `AC60`)* | | PTI_115A(1)(a)(iiaa)- Income received by non-resident as referred in second proviso to 194LC(1) |
| 106 | — | `Tax at Spl Rate` (Total) | — | Σ | | **Total** — `TotSplRateInc` / `TotSplRateIncTax` |

**Feed summary (the brief's question):**
- **From OS** (`ossi_*`, `os.*`, `OS.*`): rows 23–33, 36, 37, 42–49, 52, 55, 58,
  67–99 — the 115A / 115AC / 115AD-dividend / 115B family, 115BB, 115BBJ, 115BBA,
  115BBC, 115BBE, 115BBD, 115BBDA, patent-OS (52), carbon-OS (55), OS-DTAA (58),
  and every `PTI_*` other-sources twin, plus 194LC/194LBA sub-cases (86–99).
- **From CG** (`STCG*`, `LTCG*`, `B*_SI`, `A3e`/`A8a`, `CG.*`, `stcg.`/`ltcg.`):
  rows 9–22, 34, 35, 38–41, 56, 57, 59–66, and 102 (VDA-CG). The capital-gain
  heads (111A, 112, 112(1), 112(1)(c)(iii), 112A, 115AB(1)(b), 115AC(1)(c),
  115AD STCG/LTCG and its proviso), STCG/LTCG-DTAA, and all pass-through CG.
- **From BP** (`Prof.IncOf…`, `sheet10.IncRecCredPL…`): row 8 (115B life
  insurance), row 51 (115BBF patent — BP part), row 54 (115BBG carbon — BP
  part), row 101 (115BBH VDA — BP part).
- **Other:** row 7 (111 PF, from IT.SI helper — **hidden** on ITR-6); rows 103/104
  (194LC second proviso, from cells `AC32`/`AC60`).

---

## 3 · The section-code enum — `ScheduleSI.SplCodeRateTax[].SecCode` (72 codes)

| Code | Description (schema) |
|---|---|
| `1A` | 111A STCG on equity share/equity oriented fund chargeable to STT |
| `21` | 112-Long term capital gains (with indexing) |
| `22` | 112(1) (LTCG on listed securities/ units) |
| `21ciii` | 112(1)(c)(iii) LTCG for non-resident on unlisted securities or other than Listed debentures |
| `2A` | 112A LTCG on equity shares/units …on which STT is paid |
| `5A1ai` | 115A(1)(a)(i)- Dividends received by foreign company |
| `5A1aA` | 115A(1)(a)(A)- Dividend received from IFSC unit (80LA) |
| `5A1aii` | 115A(1)(a)(ii)- Interest received from govt/Indian Concerns in Foreign Currency |
| `5A1aiia` | 115A(1)(a)(iia)- Interest from Infrastructure Debt Fund |
| `5A1aiiaa` | 115A(1)(a)(iiaa)- Interest as per Sec. 194LC |
| `5A1aiiab` | 115A(1)(a)(iiab)- Interest as per Sec. 194LD |
| `5A1aiiac` | 115A(1)(a)(iiac)- Interest as per Sec. 194LBA |
| `5A1aiii` | 115A(1)(a)(iii)- Income in respect of units of UTI purchased in Foreign Currency |
| `FA` | Para E II of Part I of Ist Sch of FA - royalty or technical services - non-domestic company |
| `5A1bA` | 115A(1)(b)(A) & 115A(b)(B)- Income from royalty or Technical services, non-resident |
| `5AB1a` | 115AB(1)(a) - Income in respect of units purchased in foreign currency by an off-shore fund |
| `5AB1b` | 115AB(1)(b) - LTCG on transfer of units purchased in foreign currency |
| `5AC1ab` | 115AC(1)(a) - interest on bonds purchased in foreign currency - non-resident |
| `5AC1abD` | 115AC(1)(b) - Dividend on GDRs purchased in foreign currency - non-resident |
| `5AC1c` | 115AC(1)(c) - LTCG on transfer of bonds or GDR purchased in foreign currency - non-resident |
| `5AD1i` | 115AD(1)(i) - Income (other than dividend) received by an FII |
| `5AD1iP` | 115AD(1)(i) - Income received by an FII in respect of bonds/govt securities (194LD) |
| `5ADii` | 115AD(1)(ii) - STCG (other than 111A) by an FII |
| `5ADiii` | 115AD(1)(iii) - Long term capital gains by an FII |
| `5ADiiiP` | 115AD(1)(iii) Proviso - NON-RESIDENTS, sale of equity/units u/s 112A |
| `5AD1biip` | 115AD(1)(b)(ii)- STCG referred to in section 111A |
| `5B` | 115B - Profits and gains of life insurance business |
| `5BB` | 115BB (Winnings from lotteries, puzzles, races, games etc.) |
| `5BBJ` | 115BBJ - Income by way of winnings from Online games |
| `5BBA` | 115BBA - Tax on non-residents sportsmen or sports associations |
| `5BBE` | 115BBE - Tax on income referred to in sections 68 or 69 or 69A or 69B or 69C or 69D |
| `5BBF` | 115BBF - Tax on income from patent (Income under head other sources) |
| `5BBF_BP` | 115BBF_BP - Tax on income from patent (Income under head business or profession) |
| `5BBG` | 115BBG - Income under head other sources |
| `5BBG_BP` | 115BBG_BP - Income under head business or profession |
| `5BBH` | 115BBH - Tax on Income from Virtual Digital asset (Income under the head Capital Gains) |
| `5BBH_BP` | 115BBH_BP - Tax on Income from Virtual Digital asset (Income under the head Business or profession) |
| `DTAASTCG` | STCGDTAARate - STCG Chargeable at special rates in India as per DTAA |
| `DTAALTCG` | LTCGDTAARate - LTCG Chargeable at special rates in India as per DTAA |
| `DTAAOS` | OSDTAARate - Other source income chargeable under DTAA rates |
| `PTI_STCG20P` | Pass Through Income - Short Term Capital Gain chargeable @ 20% |
| `PTI_STCG30P` | Pass Through Income - Short Term Capital Gain chargeable @ 30% |
| `PTI_LTCG12_5P112A` | Pass Through Income - Long Term Capital Gain chargeable @ 12.5% u/s 112A |
| `PTI_LTCG12_5P` | Pass Through Income - Long Term Capital Gain chargeable @ 12.5% other than u/s 112A |
| `PTI_5A1ai` | PTI-115A(1)(a)(i)- Dividends/interest/income from units purchased in foreign currency |
| `PTI_5A1aA` | PTI-115A(1)(a)(A) Dividend from a unit in an International Financial Services Centre |
| `PTI_5A1aii` | PTI-115A(1)(a)(ii)- Interest received from govt/Indian Concerns in Foreign Currency |
| `PTI_5A1aiia` | PTI-115A(1)(a)(iia)- Interest from Infrastructure Debt Fund |
| `PTI_5A1aiiaa` | PTI-115A(1)(a)(iiaa)- Interest as per Sec. 194LC |
| `PTI_5A1aiiab` | PTI-115A(1)(a)(iiab)- Interest as per Sec. 194LD |
| `PTI_5A1aiiac` | PTI-115A(1)(a)(iiac)- Interest as per Sec. 194LBA |
| `PTI_5A1aiii` | PTI-115A(1)(a)(iii)- Income in respect of units of UTI purchased in foreign currency |
| `PTI_FA` | PTI-Paragraph EII of Part I of first schedule of Finance Act |
| `PTI_5A1bA` | PTI-115A(1)(b)(A) & 115A(b)(B)- Income from royalty or Technical services, non-resident |
| `PTI_5AB1a` | PTI-115AB(1)(a)-Income in respect of units purchased in foreign currency by an off-shore fund |
| `PTI_5AC1ab` | PTI-115AC(1)(a)- interest on bonds purchased in foreign currency - non-resident |
| `PTI_5AC1abD` | PTI-115AC(1)(b)- Dividend on GDRs purchased in foreign currency - non-resident |
| `PTI_5AD1i` | PTI-115AD(1)(i)- Income received by an FII in respect of securities |
| `PTI_5AD1iP` | PTI-115AD(1)(i)- Income received by an FII in respect of bonds/govt securities (194LD) |
| `PTI_5BBA` | PTI-115BBA - Tax on non-residents sportsmen or sports associations |
| `PTI_5BBF` | PTI-115BBF - Tax on income from patent |
| `PTI_5BBG` | PTI-115BBG - Tax on income from transfer of carbon credits |
| `5A1aiiaaP` | 115A(1)(a)(iiaa)- Income received by non-resident, proviso to section 194LC(1) |
| `5A1aiiaa2P` | 115A(1)(a)(iiaa)- Income received by non-resident, second proviso to section 194LC(1) |
| `5AD1iDiv` | 115AD(1)(i)- Income (being dividend) received by an FII in respect of securities |
| `PTI_5A1aiiaaP` | PTI-115A(1)(a)(iiaa)- Income received by non-resident, proviso to section 194LC(1) |
| `PTI_5A1aiiaa2P` | PTI_115A(1)(a)(iiaa)- Income received by non-resident, second proviso to section 194LC(1) |
| `PTI_5AD1iDiv` | PTI-115AD(1)(i)- Income (being dividend) received by an FII in respect of securities |
| `5AD1IBd` | 115AD(1)(i)(B)- Income (being dividend) received by a specified fund |
| `5AD1IB` | 115AD(1)(i)(B)- Income (other than dividend) received by a specified fund |
| `PTI_5AD1IBd` | PTI-115AD(1)(i)(B)- Income (being dividend) received by a specified fund |
| `PTI_5AD1IB` | PTI-115AD(1)(i)(B)- Income (other than dividend) received by a specified fund |

*(Enum leaf: `ScheduleSI.SplCodeRateTax[].SecCode` — 72 members.)*

### Rate enum — `ScheduleSI.SplCodeRateTax[].SplRatePercent` (12 values)

`1`, `4`, `5`, `9`, `10`, `12.5`, `15`, `20`, `25`, `30`, `50`, `60`.

*(`25` and `15` are enum-permitted but appear on this form only on hidden `_BE`
rows / pass-through-15% slots; every live row's rate is drawn from column G,
listed per row in §2.)*

### Override switch — `ScheduleSI.EditAutopoulatedDetail`

Row 116 dropdown, values **`Y`** ("Yes") / **`N`** ("No"); default **No**. (The
hidden Schedule IF fragment on this sheet also carries "(Select)" / "Yes" /
"No" audit dropdowns — not part of Schedule SI.)

---

## 4 · The tax column (J) — how tax thereon is computed

The base rule (rules doc **A617**): `J = ROUND(I × G/100, 0)` — taxable income
(column I) times the special rate — for every head **except**:

- **OS-DTAA / STCG-DTAA / LTCG-DTAA** (rows 56–58, rate shown as `1`): tax at the
  treaty rate, not `I × 1%`; column J carries the treaty-computed tax and may not
  equal income × the displayed rate. Rule **A618**: for these DTAA rows the tax
  in column (ii) cannot be null when income in column (i) > 0.
- **112A @ 12.5%** (row 20), **PTI-112A @ 12.5%** (row 63) and **115AD(1)(b)(iii)
  proviso @ 12.5%** (row 41): the first ₹1,25,000 is exempt (§5), so
  `J = ROUND(IF(I > exempt, (I − exempt) × G/100, 0), 0)`.
- Row 15 (`22_BE`, hidden) subtracts `LTCG.B3h_Excess` in its J formula.

---

## 5 · The "minimum chargeable to tax" adjustment (column I) and the ₹1,25,000

**On ITR-6 the basic-exemption shortfall adjustment is inert.** `THRESOLD`
(= `SI!R6`) is **0** for a company, so the shortfall walk in helper columns
S/T/U/V (`S13 = MAX(THRESOLD − U6, 0)`, `T13 = MAX(R13 − S13, 0)`,
`U13 = R13 − U6`, `V13 = U13 + U6`, cascading through the ordered buckets
`R13 = SUMIF(FormulaOfSI,"=1",SI.SplRateInc)` … driven by the order markers in
columns N/Q, "1st"…"4th") produces no reduction. Consequently **column I
(`Taxable Income after adjusting for Min Chargeable to Tax`) equals column H
(income) for every row** on this form. The machinery is carried over from the
individual/HUF utility (where the proviso to 111A/112/112A lets a resident set a
basic-exemption shortfall against capital gains); it is present but does nothing
here. Column I is `SI.SplRateIncCalc` and is **not a schema leaf** — only H
(`SplRateInc`) and J (`SplRateIncTax`) are filed.

**The ₹1,25,000 exemption under 112A does apply** (it is a per-provision
exemption, not the basic exemption). It is shared by the helper cells in rows
3/5/6, applied in the **tax** column:

```
P3 = MIN(125000, I20)              -> own 112A               (row 20, code 2A)
O3 = MIN(125000-P3-P5, I19)        -> 112A pre-July 10%      (row 19, hidden)
P5 = MIN(125000-P3, I63)           -> PTI-112A @12.5%        (row 63)
O5 = MIN(125000-P3-P5-O3, I62)     -> PTI-112A @10%          (row 62, hidden)
P6 = MIN(125000, I41)              -> 115AD(1)(b)(iii) prov  (row 41, code 5ADiiiP)
O6 = MIN(125000-P6, I40)           -> 115AD proviso pre-July (row 40, hidden)
```

So **one** ₹1,25,000 is applied first to the assessee's own 112A gain (row 20,
via P3) and then to the pass-through 112A gain (row 63, via P5); the FII/NR
115AD(1)(b)(iii)-proviso gain (row 41) gets its **own separate** ₹1,25,000 (P6 =
`MIN(125000, I41)`, independent of P3/P5). (This split differs from ITR-2, where
the single ₹1,25,000 is shared three-way including the 115AD proviso — noted per
rule 6: encoded from this form's own formulas.) The exemption reduces the tax
base in column J (`J20 = ROUND(IF(I20>P3,(I20-P3)*G20/100,0),0)`, and likewise
J19/J63/J62/J41/J40).

---

## 6 · Cross-sheet feeds

### In (income into column H)
| Head(s) | From |
|---|---|
| 111 (r7, hidden) | IT / Tax Calculated helper (`SI_111Inc`) |
| 115B life insurance (r8) | **BP** `Prof.IncOfCurYrAfterSetOffBFLosses2` (rule A237: fill BP Sl. 4b) |
| 111A / 115AD-STCG-proviso (r10, r12) | **CG** A3(i)/A3(ii) after Table E (rules A632, A633) |
| 112, 112(1), 112(1)(c)(iii), 112A, 115AB(1)(b), 115AC(1)(c), 115AD-STCG/LTCG & proviso (r14–41) | **CG** B1–B9 / A5e after Table E (rules A634–A641) |
| 115BB, 115BBJ (r42, r43) | **OS** Sl. 2a (rules A612, A624) |
| 115BBE (r46) | **OS** Sl. 2b (rule A613) |
| 115BBF-OS / 115BBG-OS (r52, r55) | **OS** 2d family |
| 115A/115AC/115AD-dividend family & every `PTI_*`-OS twin (r23–99) | **OS** Sl. 2d dropdown incomes (rule A630) and Sl. 2c (rule A631); non-residents pass net of DTAA (2e) |
| 115BBF-BP (r51), 115BBG-BP (r54) | **BP** Sl. 3d, 3e (rules A615, A614) |
| 115BBH-BP (r101) | **BP** Sl. 3f (rule A623) |
| 115BBH-CG (r102) | **CG** C2 (rule A413: CG Table F Sl.7 quarter break-up) |
| STCG-DTAA (r56) | **CG** Sl. A9 (rule A625) |
| LTCG-DTAA (r57) | **CG** Sl. B11 (rule A626) |
| OS-DTAA (r58) | **OS** Sl. 2e (rule A616) |

### Out
| To | What |
|---|---|
| **Schedule BFLA** | Σ Income (i) of SI must equal the BFLA line items — rules A620, A628 (5vi), A629 (5x), A619/A622 (5vii, 5iii) |
| **Part B-TI** Sl. 10 & 14 | total special income = total of SI Sl. (i) — rules A751, A748 |
| **Part B-TTI** Sl. 2b | = total of SI Col. (ii) tax — rule A755 |

---

## 7 · The rules the sheet carries (Schedule SI, from `rules.json`)

All Category A. Consistency/feed checks: **A612–A616** (115BB/115BBE/115BBG-a/
115BBF-BP/OS-DTAA match their source schedules), **A617** (tax = income × rate,
with the DTAA & 112A-12.5% exceptions), **A618** (DTAA tax not null when income
> 0), **A619/A622/A628/A629** (BFLA totals), **A620** (SI income total = sum of
line items), **A621** (tax total consistent), **A623/A624** (VDA-BP, 115BBJ),
**A625/A626** (STCG/LTCG-DTAA from CG A9/B11), **A630/A631** (2d/2c OS incomes,
resident vs non-resident DTAA netting), **A632–A645** (each CG-fed head's SI
income must not exceed its CG source slot after reducing DTAA income).
Part B feeds: **A748/A751** (Part B-TI 14/10), **A755** (Part B-TTI 2b).
Related: **A237** (115B ⇒ BP 4b), **A413** (115BBH-CG ⇒ CG Table F Sl.7).

---

## 8 · What the schema marks and mandatory

Block `ScheduleSI` (not required at root — present only when special income
exists):

```
ScheduleSI
  SplCodeRateTax[]                 array (one entry per head carrying income)
    * SecCode          string   (enum, §3)
    * SplRatePercent   number   (enum, §3 rates; = column G)
    * SplRateInc       integer  (= column H income)
    * SplRateIncTax    integer  (= column J tax)
  * TotSplRateInc      integer   (= H106)
  * TotSplRateIncTax   integer   (= J106)
  EditAutopoulatedDetail string  (enum Y/N; override switch)
```

`*` = required by the schema. On every array entry present: `SecCode`,
`SplRatePercent`, `SplRateInc`, `SplRateIncTax`. Column I
(`SI.SplRateIncCalc`, "taxable income after adjusting for min chargeable to
tax") has **no schema key** and is not filed — it is a display/compute column
only (and equals `SplRateInc` on ITR-6, §5).

---

## 9 · What repeats / what is typed

Nothing is typed. Every income figure is fed from OS/CG/BP; the rows appear for
the heads that carry income. The filer's only input is
`EditAutopoulatedDetail` (Yes/No), which unlocks the auto-populated table for
manual edit.

---

## 10 · Hidden rows (not built — rule 1)

Hidden rows on this sheet, listed with their reason:

- **`_BE` pre-23-July-2024 rate twins:** r9 (`1A_BE` 15%), r11
  (`5AD1biip_BE` 15%), r13 (`21_BE` 20%), r15 (`22_BE` 20%), r17 (`21ciii_BE`
  10%), r19 (`2A_BE` 10%), r21 (`5AB1b_BE` 10%), r34 (`5AC1c_BE` 10%), r40
  (`5ADiiiP_BE` 10%). Superseded by the post-July live rows.
- r7 (`1`, 111 accumulated PF) — hidden on ITR-6 (computed via IT.SI helper).
- r45 (`5BBC`), r48 (`5BBD`), r49 (`5BBDA`), r82 (`PTI_5BBC`), r83 (`PTI_5BBD`),
  r92 (`PTI_5BBDA`) — superseded/inactive dividend & anonymous-donation slots.
- r59 (`PTI_STCG15P` 15%), r62 (`PTI_LTCG10P112A`), r64 (`PTI_LTCG10P`), r66
  (`PTI_20%`) — pre-July pass-through rate twins.
- r87 (`5A1aiiaci`), r89 (`PTI_5A1aiiaci`) — 194LBA dividend slots, hidden.
- r93 — blank helper row.
- **r108–r115** — a hidden **Schedule IF** fragment ("Information regarding
  investment in unincorporated entities": number of firms, name/PAN/type of
  entity, 92E flag, % share, amount of share, capital balance, "(Select)"/Yes/No
  audit dropdowns). **Not part of Schedule SI** — Schedule IF is booked from its
  own visible sheet `IF` (sheet47, block `ScheduleIF`). Excluded here as hidden.

---

## 11 · Inconsistencies noted across the three sources (rule 17)

1. **Row 101/102 `F`-cell artifact.** Both the 115BBH sub-rows store the literal
   `PTI_5AC1b` in column F (a copy-paste leftover). Functionally they are
   **`5BBH_BP`** (r101, income from `sheet10.IncRecCredPL115BBH`, BP) and
   **`5BBH`** (r102, income from `CG.C2_TotScheduleCGFor23`, CG) — both codes
   exist in the SecCode enum. The filed `SecCode` must be `5BBH_BP` / `5BBH`,
   **not** the F-cell text. Build/export must map these two rows to the correct
   enum codes.
2. **Sheet F-code vs schema enum code — DTAA rows.** Sheet F reads
   `STCGDTAA` / `LTCGDTAA` / `OSDTAA` (r56–58), but the schema enum uses
   `DTAASTCG` / `DTAALTCG` / `DTAAOS` (helper `R70` also uses `DTAAOS`). Export
   must file the enum spelling.
3. **Sheet F-code vs schema enum — pass-through STCG.** Sheet F reads
   `PTI_30%` (r61) and `PTI_20%` (r66, hidden); schema enum equivalents are
   `PTI_STCG30P` and `PTI_STCG20P` (r60 already `PTI_STCG20P`).
4. **Sheet F-code vs schema enum — GDR dividend.** Sheet F reads `5AC1b` /
   `PTI_5AC1b` (r98/99); the schema enum names for "dividend on GDRs" are
   `5AC1abD` / `PTI_5AC1abD`. Confirm the mapping on export.
5. **Row 47** carries F=`5AB1a` (115AB(1)(a) off-shore fund) but its income
   formula is `ossi_5Ea`, and row 52 (F=`5BBF`, patent-OS) draws from
   `ossi_5BBE` — the OS named ranges do not line up 1:1 with the F codes; read
   the OS book's `ossi_*` map when wiring the feed, do not infer from the code.
6. Enum contains `5AC1abD`, `PTI_5AC1abD`, `PTI_STCG20P`, `PTI_STCG30P`,
   `PTI_5A1aiiaa2P` etc. whose live sheet rows use the display-code spelling
   above; the enum, not the F cell, is authoritative for the filed value.

---

## 12 · What this means for the build

1. **SI is a fully computed table** — one row per live head that carries income,
   in the sheet's order, each row = code (from the enum), rate (column G),
   income (fed from OS/CG/BP), and tax (`I × rate`, with the DTAA and 112A
   ₹1,25,000 exceptions). No manual entry except the override switch.
2. **Column I = column H on ITR-6** — `THRESOLD = 0`, so carry the min-
   chargeable machinery inert; do not reduce income for a basic-exemption
   shortfall. Only leaf H (`SplRateInc`) and J (`SplRateIncTax`) are exported.
3. **The ₹1,25,000 under 112A** — apply it in the tax computation per §5: one
   shared allowance across own-112A (r20) then PTI-112A (r63), and a **separate**
   allowance for the 115AD(1)(b)(iii) proviso (r41).
4. **Map display codes to enum codes on export** — the four mismatches in §11
   (VDA rows, DTAA rows, PTI STCG %, GDR dividend). File the enum spelling.
5. **The tax engine reads SI** — `TotSplRateIncTax` (J106) is the special-rate
   tax that Part B-TTI Sl. 2b adds to the normal-rate tax; `TotSplRateInc`
   (H106) feeds Part B-TI Sl. 10/14. Every income figure must reconcile to its
   OS/CG/BP/BFLA source (rules A612–A645).
6. **Export** — `ScheduleSI.SplCodeRateTax[]` (SecCode, SplRatePercent,
   SplRateInc, SplRateIncTax) with `TotSplRateInc`, `TotSplRateIncTax`, and
   `EditAutopoulatedDetail`; write the block only when a head carries income,
   totals present even at zero.
