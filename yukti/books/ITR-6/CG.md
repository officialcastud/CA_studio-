# The book of Schedule CG — ITR-6, A.Y. 2026-27

Read row by row from the utility's **CG** sheet (rows 3–488; 246 live rows, 197
hidden) and confirmed against the CBDT ITR-6 schema block **ScheduleCG** and the
ITR-6 validation-rules document. Nothing here is invented; every heading, item
letter and field is the department's own. This is the **company** return, so the
capital-gains heads that a company can have are live and the individual-only
provisos (indexation for immovable property, the 112A ₹1-lakh threshold) sit
where the sheet puts them.

Where this book uses an "item" it is the sheet's own lettering (column R tag,
e.g. `A1e`, `B12`, `C3`) — the utility's numbering, which the validation-rules
document keys its CG rules to. The schema key for every live row is given in its
row; the complete leaf list is Appendix 3. **Appendix 4 reproduces every live
row of the sheet verbatim** (the source of every label in this book).

---

## 1 · The shape of the schedule

Schedule CG has **six parts**, A to F.

| Part | What it is |
|---|---|
| **A** | **Short-term capital gains** — heads A1–A9, plus buy-back loss line A(A), total A10 |
| **B** | **Long-term capital gains** — heads B1–B11, plus buy-back loss line B(A), total B12 |
| **C** | **Income under the head** — C1 (from Table E), C2 (from Schedule VDA), C3 |
| **D** | **Deductions claimed against capital gains** — one table per exemption section: 54B, 54D, 54EC, 54EE, 54G, 54GA |
| **E** | **Set-off of current-year capital losses** — the loss × gain matrix (the ITR-6 rate buckets — see §6) |
| **F** | **Accrual or receipt of capital gain** — the quarterly split, for interest under 234C |

The sheet says at the top of A and B:
- **Short-term sub-items A4 and A5 are not applicable for residents** (row 4: "Items 4 & 5 are not applicable for residents") — the non-resident heads, hidden for a resident/domestic company.
- **Long-term sub-items B5, B6 and B7 are not applicable for residents** (row 164: "Sub Items 5, 6, & 7 are not applicable for residents").

**A company-specific point:** the land/building heads (A1, B1) carry deductions
under **section 54G / 54GA** (shifting of an industrial undertaking out of an
urban area / to a SEZ) — the sheet's `di`/`dii` lines — not the 54B an
individual's ITR-2 land block shows.

---

## 2 · Part A — Short-term capital gains, head by head

### A1 · From sale of land or building or both (rows 5–51)
*"fill up details separately for each property"* — the one **repeatable** head;
the sheet keeps a **"Number of blocks"** counter (`AA5`) and `Block count STCG`
(`AA4`). Schema: `ShortTermCapGain.SaleofLandBuild.SaleofLandBuildDtls[]`.

| Item | Label | Type | Schema key |
|---|---|---|---|
| — | Date of Purchase/Acquisition | date DD/MM/YYYY | DateofPurchase |
| — | Date of Sale/Transfer | date | DateofSale |
| a i | Full value of consideration received/receivable | amount | FullConsideration |
| a ii | Value of property as per stamp valuation authority | amount | PropertyValuation |
| a iii | Full value of consideration adopted as per section 50C (if aii ≤ 1.10 × ai take ai, else aii) | computed | FullConsideration50C |
| b i | Cost of acquisition without indexation | amount | AquisitCost |
| b ii | Cost of Improvement without indexation | amount | ImproveCost |
| b iii | Expenditure wholly and exclusively in connection with transfer | amount | ExpOnTrans |
| b iv | Total (bi + bii + biii) | computed | TotalDedn |
| c | Balance (aiii – biv) | computed | Balance |
| di | Deduction under section 54G (details in item D) | amount | ExemptionOrDednUs54Dtls[].ExemptionSecCode / ExemptionAmount |
| dii | Deduction under section 54GA (details in item D) | amount | ExemptionOrDednUs54Dtls[] |
| d | Total Deduction under section 54G/54GA | computed | ExemptionGrandTotal |
| e | Short-term Capital Gains on Immovable property (1c − 1d) → **A1e** | computed | CapgainonAssets |
| f | Buyer table (see below) | table | TrnsfImmblPrprty.TrnsfImmblPrprtyDtls[] |

**f · Buyer table** (row 22 header; 3 rows shipped, addable): Sl. No. · Name of buyer (NameOfBuyer) · PAN of buyer · Aadhaar No. of buyer · Percentage share (PercentageShare) · Amount (Amount) · Address of property (AddressOfProperty) · State (StateCode, dropdown 38) · Pincode · Country Code (dropdown 251) · Zip Code. **NOTE (row 51): furnishing of PAN is mandatory if tax is deducted under section 194-IA or is quoted by the buyer.**

### A2 · From Slump sale (rows 52–57)
Schema: `ShortTermCapGain.SlumpSaleInStcg`.

| Item | Label | Schema key |
|---|---|---|
| ai | Fair market value as per Rule 11UAE(2) | FMV11UAEii |
| aii | Fair market value as per Rule 11UAE(3) | FMV11UAEiii |
| aiii | Full value of consideration (higher of ai or aii) — computed | FullConsideration |
| b | Net worth of the under taking or division (6(e) of Form 3CEA) | NetWorthOfDivision |
| c | Short term capital gains from slump sale (2aiii − 2b) → **A2c** — computed | CapgainonAssets |

### A3 · Short-term Capital Gains on equity share / equity-oriented MF / business-trust units, STT paid (rows 58–77)
Schema: `ShortTermCapGain.EquityMFonSTT[]` (array keyed by `MFSectionCode`), with `EquityMFonSTTDtls`.

**(i) u/s 111A [for others]** (rows 59–67): ia Full value of consideration (FullConsideration) · ib Deductions under section 48 → i Cost of acquisition without indexation (AquisitCost), ii Cost of Improvement without indexation (ImproveCost), iii Expenditure wholly and exclusively in connection with transfer (ExpOnTrans), iv Total (i+ii+iii) (TotalDedn) · ic Balance (3ia − 3ibiv) (BalanceCG) · id Loss to be ignored under section 94(7) or 94(8) (LossSec94of7Or94of8) · ie Short-term capital gain u/s 111A → **A3ie** (CapgainonAssets). Tag T67 "15% & 20%".

**(ii) u/s 115AD(1)(b)(ii) [for FII]** (rows 68–77): same eight fields iia–iie → **A3iie**. Same schema shape, second array element.

### A4 · For NON-RESIDENT, not being an FII — shares/debentures of an Indian company (rows 78–82) — **hidden for residents**
First proviso to section 48 (forex adjustment). Schema: `ShortTermCapGain.NRITransacSec48Dtl`.

| Item | Label | Schema key |
|---|---|---|
| a | STCG on transactions covered u/s 111A → A4a | NRItaxSTTPaid |
| a i | Where the transfer was before 23rd July 2024 | (split) |
| a ii | Where the transfer was on or after 23rd July 2024 | (split) |
| b | STCG from sale of shares not covered in 4a or sale of debentures → A4b | NRItaxSTTNotPaid |

### A5 · For NON-RESIDENTS — securities (other than A3) by an FII u/s 115AD (rows 83–97) — **hidden for residents**
Schema: `ShortTermCapGain.NRISecur115AD`. Carries the unquoted-share working: a(i)a Full value of consideration for unquoted shares (FullValueConsdRecvUnqshr) · a(i)b Fair market value of unquoted shares (FairMrktValueUnqshr) · a(i)c Full value adopted u/s 50CA — higher of a or b (FullValueConsdSec50CA) · aii Full value for securities other than unquoted shares (FullValueConsdOthUnqshr) · aiii Total (ic + ii) (FullConsideration) · b section-48 deductions i–iv (AquisitCost/ImproveCost/ExpOnTrans/TotalDedn) · c Balance (5aiii − biv) (BalanceCG) · d Loss to be disallowed u/s 94(7)/94(8) (LossSec94of7Or94of8) · e Short-term capital gain (5c + 5d) → **A5e** (CapgainonAssets).

### A6 · From sale of assets other than at A1–A5 (rows 98–116)
The general short-term head. Schema: `ShortTermCapGain.SaleOnOtherAssets`. Same unquoted-share + section-48 working as A5, **plus**: e Deemed short term capital gains on depreciable assets (6 of Schedule DCG) (DeemedSTCGDeprAsset) · fi Deduction u/s 54G, fii Deduction u/s 54GA, f Total Deduction 54G/54GA (ExemptionOrDednUs54) · g STCG on other assets (6c + 6d + 6e − 6f) → **A6g** (CapgainonAssets).

### A7 · Amount deemed to be short-term capital gains (rows 117–132)
Two parts. **a** (rows 122–129): unutilised capital gain of an earlier year kept in a Capital Gains Account Scheme, now deemed income — table: Previous year in which asset transferred · Section under which deduction claimed (dropdown 54D/54G/54GA) · New asset acquired/constructed year · Amount utilised out of Capital Gains account · Amount not used / remained unutilized (X). Schema: `UnutilizedCg.UnutilizedCgPrvYrDtls[]` (PrvYrInWhichAsstTrnsfrd, SectionClmd, AmtUnutilized). Row 123 Yes/No/Not-Applicable switch. **b** (row 131): amount deemed to be STCG u/s 54D/54G/54GA other than at 'a'. Total (aXi+aXii+aXiii+b) → **A7** (`TotalAmtDeemedStcg`).

### A8 · Pass-through income/loss in the nature of STCG (rows 134–138)
Fill up Schedule PTI. Rate slots 15% (hidden), 20%, 30%, applicable rates. Total → **A8** (`PassThrIncNatureSTCG`).

### A9 · STCG included in A1–A8 but claimed not chargeable / at special rate under a DTAA (rows 139–156) — non-residents
Table (row 140), schema `NRICgDTAA.NRIDTAADtls[]`: Amount of income (DTAAamt) · Item No. A1 to A8 in which included (ItemNoincl) · Country name, code (CountryName / CountryCodeExcludingIndia, dropdown Country_Less_India) · Article of DTAA (DTAAarticle) · Rate as per Treaty (RateAsPerTreaty) · Whether Tax Residency Certificate obtained (Yes/No) · Section of I.T. Act (SecITAct) · Rate as per I.T. Act (RateAsPerITAct) · Applicable rate [lower of (6) or (9)]. Totals: 9a not chargeable (`TotalAmtNotTaxUsDTAAStcg`), 9b at special rate (`TotalAmtTaxUsDTAAStcg`, tag DR).

### A(A) · Capital Loss on buy back of shares [Short term 20%/30%/applicable] (rows 158–161)
*Can be claimed only if the corresponding dividend u/s 2(22)(f) is offered in Schedule OS.* Rate dropdown (Sl./Rate/Amount). Schema `CapitalLossBuyBackShares` (CapitalLossBuyBackSharesDtls[] Rate/Amount; TotalCapitalLossBuyBackShares).

### A10 · Total Short-term Capital Gain (row 163)
`A1e + A2c + A3e + A4a + A4b + A5e + A6g + A7 + A8 − A9a + A(A)` → **A10** (`TotalSTCG`) — computed.

---

## 3 · Part B — Long-term capital gains, head by head

### B1 · From sale of land or building or both (rows 165–201)
**Repeatable**, one block per property. Schema: `LongTermCapGain.SaleofLandBuild.SaleofLandBuildDtls[]`. Richer than A1: cost with indexation (row 173, biia — applicable only for transfers before 23rd July 2024), a cost-of-improvement table (biib: without indexation / year / with indexation; totals rows 179–180), before/after 23-July split (rows 200–201, g(a)/g(b)).

| Item | Label | Schema key |
|---|---|---|
| — | Date of Purchase/Acquisition · Date of Sale/Transfer | DateofPurchase / DateofSale |
| a i / ii / iii | Consideration · stamp value · section-50C value | FullConsideration / PropertyValuation / FullConsideration50C |
| b i | Cost of acquisition without indexation | AquisitCost |
| b iii | Expenditure wholly and exclusively in connection with transfer | ExpOnTrans |
| b iv | Total (bi + bii + biii) | TotalDedn |
| c | Balance (aiii − biv) | Balance |
| di–div | Deduction u/s 54D / 54EC / 54G / 54GA | ExemptionOrDednUs54Dtls[] |
| d | Total Deduction 54D/54EC/54G/54GA | ExemptionGrandTotal |
| e | Long-term Capital Gains on Immovable property (1c − 1d) → **B1e** | CapgainonAssets |
| f | Buyer table (as A1) | TrnsfImmblPrprty.TrnsfImmblPrprtyDtls[] |
| g | Total Long-term Capital Gains on Immovable property (ΣB1e) → **B1g** | (aggregate) |

### B2 · From Slump sale (rows 202–211)
Schema: `LongTermCapGain.SlumpSaleInLtcgDtls.SlumpSaleInLtcg`. ai/aii 11UAE(2)/(3) (FMV11UAEii/FMV11UAEiii) · aiii higher (FullConsideration) · b Net worth (NetWorthOfDivision) · c Balance (2aiii − 2b) (SlumpBalance) · d Deduction u/s 54EC (+ 54EE hidden) (DeductionUnderSec54) · e LTCG from slump sale (2c − 2d) → **B2e** (CapgainonAssets).

### B3 · Bonds / listed securities (rows 214–236)
**(i, hidden)** For residents, from sale of unlisted bonds or unlisted debenture (other than capital-indexed bonds). **(ii, live rows 224–236)** From sale of listed securities (other than a unit) or zero-coupon bonds u/s 112(1): a Full value of consideration · b Deductions u/s 48 (cost with/without indexation ia/i, improvement with/without ii, expenditure iii, total iv) · c Long Term Capital Gains on assets at B3 (3a − biv) → **B3c**. Schema: `LongTermCapGain.Proviso112Applicable` (Proviso112SectionCode; Proviso112Applicabledtls.FullConsideration / DeductSec48.* / BalanceCG). The 1st-proviso-to-112(1) working (20% with indexation vs 10% without, excess ignored) sits in the hidden rows 239–242.

### B4 · Equity share / equity-oriented fund / business-trust units u/s 112A (rows 256–259)
Fed from **Schedule 112A**, column 14. Row 257 "Long-term Capital Gains on sale of capital assets at B4 above (column 14 of Schedule 112A)" → **B4** (`LongTermCapGain.SaleOfEquityShareUs112A.CapgainonAssets`). Hidden splits (rows 258–259): sum of col 14 before / on-or-after 23rd July 2024.

### B5 · NON-RESIDENTS — unlisted shares or listed debenture (rows 260–264) — hidden
LTCG without indexation; three-way split (listed debentures before 23 July / other before / on-or-after). Schema: `LongTermCapGain.NRIProvisoSec48.BalanceCG`.

### B6 · NON-RESIDENTS — three sub-heads (rows 265–324) — hidden
(i) unlisted securities u/s 112(1)(c); (ii) units u/s 115AB; (iii) bonds/GDR u/s 115AC; (iv) securities by an FII u/s 115AD. Each is the full unquoted-share + section-48 block. Schema: `LongTermCapGain.NRIOnSec112and115.NRIOnSec112and115Dtls[]` (SectionCode; the unquoted-share and DeductSec48 fields; BalanceCG). → **B6c**.

### B7 · FII/FPI (NON-RESIDENTS) — equity u/s 112A r.w. 115AD (rows 325–328) — hidden
Fed from **Schedule 115AD(1)(b)(iii) proviso**, column 14 → **B7** (`LongTermCapGain.NRISaleOfEquityShareUs112A.CapgainonAssets`).

### B8 · From sale of assets where B1–B7 are not applicable (rows 329–348)
The general long-term head. Schema: `LongTermCapGain.SaleofAssetNADtls.SaleofAssetNA`. Unquoted-share working (ai a/b/c: FullValueConsdRecvUnqshr / FairMrktValueUnqshr / FullValueConsdSec50CA), ii other assets (FullValueConsdOthUnqshr), iii Total (FullConsideration), b section-48 deductions, c Balance (8aiii − biv) (BalanceCG), di–diii Deduction u/s 54D/54G/54GA (ExemptionOrDednUs54Dtls[]), d Total (ExemptionGrandTotal), e LTCG on assets at B8 (8c − 8d) → **B8e** (CapgainonAssets).

### B9 · Amount deemed to be long-term capital gains (rows 349–370)
As A7. **a** (rows 356–363): unutilised gain of an earlier year in a CGAS now deemed — table (PrvYrInWhichAsstTrnsfrd / SectionClmd / AmtUnutilized), Yes/No switch row 357. **b** (row 365): amount deemed to be LTCG other than at 'a', split before / on-or-after 23 July (rows 366–367). Total (aXi+aXii+aXiii+b) → **B9** (`TotalAmtDeemedLtcg`).

### B10 · Pass-through income/loss in the nature of LTCG (rows 371–376)
Fill up Schedule PTI. Slots: 10% u/s 112A (hidden), 12.5% u/s 112A, 10% under other section (hidden), 12.5% under other section, 20% (hidden). Total → **B10** (`PassThrIncNatureLTCG`).

### B11 · LTCG in B1–B10 claimed not chargeable / at special rate under a DTAA (rows 377–385) — non-residents
Table (row 378), schema `NRICgDTAA.NRIDTAADtls[]` (same nine columns as A9). Totals: B11a not chargeable (`TotalAmtNotTaxUsDTAALtcg`), B11b special rate (`TotalAmtTaxUsDTAALtcg`, tag DR).

### B(A) · Capital Loss on buy back of shares [Long Term 12.5%] (rows 386–389)
Same rule as A(A); claimable only if the dividend is offered in Schedule OS. Schema `CapitalLossBuyBackShares.TotalCapitalLossBuyBackShares`.

### B12 · Total long-term capital gain (row 391)
`B1g + B2e + B3c + B4 + B5 + B6c + B7 + B8e + B9 + B10 − B11a + B(A)` → **B12** (`TotalLTCG`) — computed.

---

## 4 · Part C — Income under the head (rows 392–394)

| Item | Label | Schema key |
|---|---|---|
| C1 | Sum of Capital Gain Incomes 8ii + 8iii + 8iv + 8v + 8vi + 8vii of table E below | SumOfCGIncm |
| C2 | Income from transfer of Virtual Digital Assets (Item No. B of Schedule VDA) | IncmFromVDATrnsf |
| C3 | Income chargeable under the head "CAPITAL GAINS" (C1 + C2) | IncChargeableHeadCapGain |

C1 is the sum of the **remaining-after-set-off** column (column 8) of Table E for
each gain-type row (ii–vii) — i.e. after the loss set-off, not before. C2 is
column B of Schedule VDA (the capital-gain VDA total).

---

## 5 · Part D — Deductions claimed against capital gains (rows 395–430)

*"In case of deduction under section 54D/54EC/54G/54GA give following details."*
One table per section, 3 rows shipped, addable, each with a Total. Every date is
`DD/MM/YYYY`. Schema: `DeducClaimInfo`.

| Section (row) | Columns | Schema |
|---|---|---|
| 54B (rows 397–401, hidden) | Sl. No · Date of transfer of original asset · Cost of new agricultural land · Date of purchase of new agricultural land · Amount deposited in Capital Gains Accounts Scheme before due date · Date of deposit · Account Number · IFS Code · Amount of deduction claimed | (54B branch) |
| 54D (rows 402–407) | Date of acquisition of original asset · Cost of purchase/construction of new land or building for industrial undertaking · Date of purchase · CGAS deposit particulars · Amount of deduction claimed | DeducClaimDtlsUs54D[] (DateofAcquisition, AmtDeducted) |
| 54EC (rows 408–412) | Date of transfer of original asset · Amount invested in specified/notified bonds (not exceeding fifty lakh rupees) · Date of investment · Amount of deduction claimed | DeducClaimDtlsUs54EC[] (DateofTransfer, AmtDeducted) |
| 54EE (rows 413–417, hidden) | Date of transfer · Amount invested in specified asset · Date of investment · CGAS particulars · Amount of deduction claimed | (54EE branch) |
| 54G (rows 418–423) | Date of transfer of original asset from urban area · Cost and expenses incurred for purchase or construction of new asset · Date of purchase/construction of new asset in an area other than urban area · CGAS deposit particulars · Amount of deduction claimed | DeducClaimDtlsUs54G[] (DateofTransfer, AmtDeducted) |
| 54GA (rows 424–429) | Date of transfer of original asset from urban area · Cost and expenses for the new asset · Date of purchase/construction of new asset in SEZ · CGAS deposit particulars · Amount of deduction claimed | DeducClaimDtlsUs54GA[] (DateofTransfer, AmtDeducted) |
| e (row 430) | Total deduction claimed (1a + 1b + 1c + 1d) | TotDeductClaim |

---

## 6 · Part E — Set-off of current-year capital losses (the rate buckets)

**This is the part the brief flags — read it carefully.** The sheet ships three
copies of Table E: two are **hidden** older-rate versions (rows 431–459, carrying
15%/10%/20% buckets); the **live** table is E at rows 460–472. Its rate buckets
are the A.Y. 2026-27 set and they are **narrower** than ITR-2's.

Header (rows 461–462): SL · Type of Capital Gain · Gain of current year (fill
only if the computed figure is positive) · **Short term capital loss set off**
(four rate columns) · **Long term capital loss set off** (two rate columns) ·
Current year's Capital Gains remaining after set-off `8 = (1−2−3−4−5−6−7)`.

**The six loss columns (columns 2–7):**

| Col | Loss bucket | Feeds from |
|---|---|---|
| 2 | Short-term loss @ **20%** (equity/MF STT — 111A "15% & 20%") | A2ie/A2iie/A3a … (STT-paid equity STCG) |
| 3 | Short-term loss @ **30%** | A4e + PTI@30 + other 30% STCG |
| 4 | Short-term loss @ **applicable rate** | A1e + A6g + A3b + A5e (residual STCG) |
| 5 | Short-term loss @ **DTAA rate** | A8b (STCG at DTAA rate) |
| 6 | Long-term loss @ **12.5%** | B1g + B2e + B3c + B5f … (all LTCG) |
| 7 | Long-term loss @ **DTAA rate** | B10b (LTCG at DTAA rate) |

So the ITR-6 buckets are: **short-term { 20%, 30%, applicable rate, DTAA rate }**
and **long-term { 12.5%, DTAA rate }**. There is **no separate 15%, 10% or 20%
long-term column** on the live table — those are the hidden legacy versions.

**The rows (gain types, rows 464–472):**

| Row | Type of Capital Gain | Schema (`CurrYrLosses.*`) |
|---|---|---|
| i (464) | Loss to be set off (fill only if figure computed is negative) → | InLossSetOff (StclSetoff20Per, StclSetoff30Per, StclSetoffAppRate, StclSetoffDTAARate, LtclSetOff12_5Per, LtclSetOffDTAARate) |
| ii (465) | Short term capital gain @ 20% | InStcg20Per (CurrYearIncome; StclSetoff30Per/AppRate/DTAARate; CurrYrCapGain) |
| iii (466) | Short term capital gain @ 30% | InStcg30Per (CurrYearIncome; StclSetoff20Per/AppRate/DTAARate; CurrYrCapGain) |
| iv (467) | Short term capital gain @ applicable rate | InStcgAppRate (CurrYearIncome; StclSetoff20Per/30Per/DTAARate; CurrYrCapGain) |
| v (468) | Short term capital gain @ DTAA rate | InStcgDTAARate (CurrYearIncome; StclSetoff20Per/30Per/AppRate; CurrYrCapGain) |
| vi (469) | Long term capital gain @ 12.5% | InLtcg12_5Per (CurrYearIncome; StclSetoff20Per/30Per/AppRate/DTAARate; LtclSetOffDTAARate; CurrYrCapGain) |
| vii (470) | Long term capital gain @ DTAA rate | InLtcgDTAARate (CurrYearIncome; StclSetoff20Per/30Per/AppRate/DTAARate; LtclSetOff12_5Per; CurrYrCapGain) |
| viii (471) | Total loss set off (ii + iii + iv + v + vi + vii) | TotLossSetOff (six per-bucket keys) |
| ix (472) | Loss remaining after set off (i − viii) | LossRemainSetOff (six per-bucket keys) |

The rule the matrix enforces: a **short-term loss** may be set against any capital
gain (short or long); a **long-term loss** only against a long-term gain; nothing
against its own slot. The set-off is driven off the `IHLA.*` helper cells (the
utility's internal loss-adjustment sheet). Row 473 carries the override switch
**"Do you want to edit the detail autopopulated above?"**; rows 474–475 note that
the A1e*/B1e* figures are the amounts computed in the respective columns.

C1 (Part C) = Σ of the **CurrYrCapGain** (remaining-after-set-off, column 8) over
rows ii–vii.

---

## 7 · Part F — Accrual or receipt of capital gain (rows 476–488)

Five date columns (row 477): Upto 15/6 · 16/6 to 15/9 · 16/9 to 15/12 · 16/12 to
15/3 · 16/3 to 31/3. Schema: `AccruOrRecOfCG.<bucket>.DateRange.{Upto15Of6,
Up16Of6To15Of9, Up16Of9To15Of12, Up16Of12To15Of3, Up16Of3To31Of3}`. Each row is
"Enter value from … of schedule BFLA" — the **post-set-off** figure. The live
rows match the Table-E buckets (the 15%, 10% and 20% rows are hidden):

| Row | Rate bucket | Schema bucket |
|---|---|---|
| 478 (hidden) | Short-term @ 15% | — |
| 479 | Short-term @ 20% (item 5vi of BFLA) | ShortTermUnder20Per |
| 480 | Short-term @ 30% (item 5vii) | ShortTermUnder30Per |
| 481 | Short-term @ applicable rates (item 5viii) | ShortTermUnderAppRate |
| 482 | Short-term @ DTAA rates (item 5ix) | ShortTermUnderDTAARate |
| 483 (hidden) | Long-term @ 10% | — |
| 484 | Long-term @ 12.5% (item 5x) | LongTermUnder12_5Per |
| 485 (hidden) | Long-term @ 20% | — |
| 486 | Long-term @ DTAA rates (item 5xi) | LongTermUnderDTAARate |
| 488 | Capital gains on transfer of Virtual Digital Asset @ 30% (from Schedule SI) | VDATrnsfGainsUnder30Per |

Row 487 (hidden NOTE): include the income of the specified persons in Schedule
SPI while computing.

---

## 8 · What repeats and what is one figure

| Head | Repeatable? |
|---|---|
| A1 / B1 — land or building | **Yes, unlimited** — one block per property ("Number of blocks") |
| Buyer table inside each land block | 3 rows shipped, addable |
| Cost-of-improvement table inside each B1 block | rows addable |
| A2/B2 slump sale; A3, A5, A6, B2, B3, B8 — other heads | No — one aggregate block each |
| B4 — 112A equity | fed from Schedule 112A (unlimited, scrip by scrip) |
| B7 — FII 112A equity | fed from Schedule 115AD(1)(b)(iii) proviso (unlimited) |
| A7a/B9a — unutilised CGAS | table, rows addable |
| A9/B11 — DTAA claims | table, rows addable |
| A(A)/B(A) — buy-back loss | 3 rows |
| Part D — each exemption section | 3 rows shipped, addable |

Only land/building is entered property by property; every other head is a single
aggregate block; per-scrip listed-equity detail lives in Schedule 112A / 115AD.

---

## 9 · Cross-sheet feeds

**In:** B4 ← Schedule 112A column 14; B7 ← Schedule 115AD(1)(b)(iii) proviso
column 14; A6e ← item 6 of Schedule DCG (deemed STCG on depreciable assets); A8 /
B10 ← Schedule PTI; C2 ← Schedule VDA item B; Table E ← the IHLA loss-adjustment
helper; Table F row 488 ← Schedule SI item for VDA @30%.
**Out:** C3 (IncChargeableHeadCapGain) → Part B-TI; the Table-E remaining figures
and the rate buckets → Schedule CYLA/BFLA → Schedule SI (special-rate tax) and
Part B; Table F → interest u/s 234C.

---

## 10 · Anything inconsistent between the three sources

- The 112A / 115AD sheet header row 4 (col 5) reads "item 5 (b)(i)(B)(2) of LTCG
  Schedule of ITR6" on 112A and "item 8(b)..." on 115AD — the two feeder sheets
  point at B4 and B8-region rows respectively; the schema keeps B4 =
  SaleOfEquityShareUs112A and B7 = NRISaleOfEquityShareUs112A. Booked as read.
- The live Table E rate buckets (20/30/app/DTAA short, 12.5/DTAA long) differ
  from the hidden legacy tables (which carry 15%/10%/20%). The schema
  `CurrYrLosses` keys match the **live** table; the legacy tables are hidden and
  not built.

---

## Appendix 1 · Every dropdown on the sheet, with all its values

Reproduced verbatim from the utility's data-validation lists (code–value form).

### Yes / No / Not Applicable (rows 123, 357)
\`(Select)\` · Yes · No · Not Applicable

### Yes / No (DTAA "Tax Residency Certificate obtained?" — rows 141–153, 379–382)
\`(Select)\` · Yes · No

### Section deemed-STCG (A7a, row 360–361): \`(Select)\` · 54D · 54G · 54GA
### Section (A7a alt, rows 126–128): \`(Select)\` · 54G · 54GA

### Previous year in which asset transferred (rows 126–128, 360–361): \`(Select)\` · 2022-23 · 2023-24 · 2024-25
### New-asset year (rows 126–128 / 360–361): \`(Select)\` · 2022-23 · 2023-24 · 2024-25 · 2025-26
### Year of acquisition/construction (rows 129, 362–363, 21 values):
\`(Select)\` · 2001-02 · 2002-03 · 2003-04 · 2004-05 · 2005-06 · 2006-07 · 2007-08 · 2008-09 · 2009-10 · 2010-11 · 2011-12 · 2012-13 · 2013-14 · 2014-15 · 2015-16 · 2016-17 · 2017-18 · 2018-19 · 2019-20 · 2020-21

### Buy-back loss type (A(A) rows 160–161):
`(Select)` · i. Loss from buy back of 'shares taxable at 20%' · ii. Loss from buy back of 'shares taxable at 30%' · iii. Loss from buy back of 'shares taxable at applicable rate'

### State code (buyer table, N/StateCode — 38 values):
```
(Select) | 01-Andaman and Nicobar islands | 02-Andhra Pradesh | 03-Arunachal Pradesh | 04-Assam | 05-Bihar | 06-Chandigarh | 07-The Dadra And Nagar Haveli And Daman And Diu | 09-Delhi | 10-Goa | 11-Gujarat | 12-Haryana | 13-Himachal Pradesh | 14-Jammu and Kashmir | 15-Karnataka | 16-Kerala | 17-Lakshadweep | 18-Madhya Pradesh | 19-Maharashtra | 20-Manipur | 21-Meghalaya | 22-Mizoram | 23-Nagaland | 24-Odisha | 25-Puducherry | 26-Punjab | 27-Rajasthan | 28-Sikkim | 29-Tamil Nadu | 30-Tripura | 31-Uttar Pradesh | 32-West Bengal | 33-Chattisgarh | 34-Uttarakhand | 35-Jharkhand | 36-Telangana | 37-Ladakh | 99-Foreign
```

### Country code (buyer Country Code — 251 values):
```
(select) | 93-AFGHANISTAN | 1001-ALAND ISLANDS | 355-ALBANIA | 213-ALGERIA | 684-AMERICAN SAMOA | 376-ANDORRA | 244-ANGOLA | 1264-ANGUILLA | 1010-ANTARCTICA | 1268-ANTIGUA AND BARBUDA | 54-ARGENTINA | 374-ARMENIA | 297-ARUBA | 61-AUSTRALIA | 43-AUSTRIA | 994-AZERBAIJAN | 1242-BAHAMAS | 973-BAHRAIN | 880-BANGLADESH | 1246-BARBADOS | 375-BELARUS | 32-BELGIUM | 501-BELIZE | 229-BENIN | 1441-BERMUDA | 975-BHUTAN | 591-BOLIVIA (PLURINATIONAL STATE OF) | 1002-BONAIRE, SINT EUSTATIUS AND SABA | 387-BOSNIA AND HERZEGOVINA | 267-BOTSWANA | 1003-BOUVET ISLAND | 55-BRAZIL | 1014-BRITISH INDIAN OCEAN TERRITORY | 673-BRUNEI DARUSSALAM | 359-BULGARIA | 226-BURKINA FASO | 257-BURUNDI | 238-CABO VERDE | 855-CAMBODIA | 237-CAMEROON | 1-CANADA | 1345-CAYMAN ISLANDS | 236-CENTRAL AFRICAN REPUBLIC | 235-CHAD | 56-CHILE | 86-CHINA | 9-CHRISTMAS ISLAND | 672-COCOS (KEELING) ISLANDS | 57-COLOMBIA | 270-COMOROS | 242-CONGO | 243-CONGO (DEMOCRATIC REPUBLIC OF THE) | 682-COOK ISLANDS | 506-COSTA RICA | 225-COTE DIVOIRE | 385-CROATIA | 53-CUBA | 1015-CURACAO | 357-CYPRUS | 420-CZECHIA | 45-DENMARK | 253-DJIBOUTI | 1767-DOMINICA | 1809-DOMINICAN REPUBLIC | 593-ECUADOR | 20-EGYPT | 503-EL SALVADOR | 240-EQUATORIAL GUINEA | 291-ERITREA | 372-ESTONIA | 251-ETHIOPIA | 500-FALKLAND ISLANDS (MALVINAS) | 298-FAROE ISLANDS | 679-FIJI | 358-FINLAND | 33-FRANCE | 594-FRENCH GUIANA | 689-FRENCH POLYNESIA | 1004-FRENCH SOUTHERN TERRITORIES | 241-GABON | 220-GAMBIA | 995-GEORGIA | 49-GERMANY | 233-GHANA | 350-GIBRALTAR | 30-GREECE | 299-GREENLAND | 1473-GRENADA | 590-GUADELOUPE | 1671-GUAM | 502-GUATEMALA | 1481-GUERNSEY | 224-GUINEA | 245-GUINEA-BISSAU | 592-GUYANA | 509-HAITI | 1005-HEARD ISLAND AND MCDONALD ISLANDS | 6-HOLY SEE | 504-HONDURAS | 852-HONG KONG | 36-HUNGARY | 354-ICELAND | 91-INDIA | 62-INDONESIA | 98-IRAN (ISLAMIC REPUBLIC OF) | 964-IRAQ | 353-IRELAND | 1624-ISLE OF MAN | 972-ISRAEL | 5-ITALY | 1876-JAMAICA | 81-JAPAN | 1534-JERSEY | 962-JORDAN | 7-KAZAKHSTAN | 254-KENYA | 686-KIRIBATI | 850-KOREA (DEMOCRATIC PEOPLES REPUBLIC OF) | 82-KOREA (REPUBLIC OF) | 965-KUWAIT | 996-KYRGYZSTAN | 856-LAO PEOPLES DEMOCRATIC REPUBLIC | 371-LATVIA | 961-LEBANON | 266-LESOTHO | 231-LIBERIA | 218-LIBYA | 423-LIECHTENSTEIN | 370-LITHUANIA | 352-LUXEMBOURG | 853-MACAO | 389-MACEDONIA (THE FORMER YUGOSLAV REPUBLIC OF) | 261-MADAGASCAR | 265-MALAWI | 60-MALAYSIA | 960-MALDIVES | 223-MALI | 356-MALTA | 692-MARSHALL ISLANDS | 596-MARTINIQUE | 222-MAURITANIA | 230-MAURITIUS | 269-MAYOTTE | 52-MEXICO | 691-MICRONESIA (FEDERATED STATES OF) | 373-MOLDOVA (REPUBLIC OF) | 377-MONACO | 976-MONGOLIA | 382-MONTENEGRO | 1664-MONTSERRAT | 212-MOROCCO | 258-MOZAMBIQUE | 95-MYANMAR | 264-NAMIBIA | 674-NAURU | 977-NEPAL | 31-NETHERLANDS | 687-NEW CALEDONIA | 64-NEW ZEALAND | 505-NICARAGUA | 227-NIGER | 234-NIGERIA | 683-NIUE | 15-NORFOLK ISLAND | 1670-NORTHERN MARIANA ISLANDS | 47-NORWAY | 968-OMAN | 92-PAKISTAN | 680-PALAU | 970-PALESTINE, STATE OF | 507-PANAMA | 675-PAPUA NEW GUINEA | 595-PARAGUAY | 51-PERU | 63-PHILIPPINES | 1011-PITCAIRN | 48-POLAND | 14-PORTUGAL | 1787-PUERTO RICO | 974-QATAR | 262-REUNION | 40-ROMANIA | 8-RUSSIAN FEDERATION | 250-RWANDA | 1006-SAINT BARTHELEMY | 290-SAINT HELENA, ASCENSION AND TRISTAN DA CUNHA | 1869-SAINT KITTS AND NEVIS | 1758-SAINT LUCIA | 1007-SAINT MARTIN (FRENCH PART) | 508-SAINT PIERRE AND MIQUELON | 1784-SAINT VINCENT AND THE GRENADINES | 685-SAMOA | 378-SAN MARINO | 239-SAO TOME AND PRINCIPE | 966-SAUDI ARABIA | 221-SENEGAL | 381-SERBIA | 248-SEYCHELLES | 232-SIERRA LEONE | 65-SINGAPORE | 1721-SINT MAARTEN (DUTCH PART) | 421-SLOVAKIA | 386-SLOVENIA | 677-SOLOMON ISLANDS | 252-SOMALIA | 28-SOUTH AFRICA | 1008-SOUTH GEORGIA AND THE SOUTH SANDWICH ISLANDS | 211-SOUTH SUDAN | 35-SPAIN | 94-SRI LANKA | 249-SUDAN | 597-SURINAME | 1012-SVALBARD AND JAN MAYEN | 268-SWAZILAND | 46-SWEDEN | 41-SWITZERLAND | 963-SYRIAN ARAB REPUBLIC | 886-TAIWAN | 992-TAJIKISTAN | 255-TANZANIA, UNITED REPUBLIC OF | 66-THAILAND | 670-TIMOR-LESTE(EAST TIMOR) | 228-TOGO | 690-TOKELAU | 676-TONGA | 1868-TRINIDAD AND TOBAGO | 216-TUNISIA | 90-TURKEY | 993-TURKMENISTAN | 1649-TURKS AND CAICOS ISLANDS | 688-TUVALU | 256-UGANDA | 380-UKRAINE | 971-UNITED ARAB EMIRATES | 44-UNITED KINGDOM OF GREAT BRITAIN AND NORTHERN IRELAND | 2-UNITED STATES OF AMERICA | 1009-UNITED STATES MINOR OUTLYING ISLANDS | 598-URUGUAY | 998-UZBEKISTAN | 678-VANUATU | 58-VENEZUELA (BOLIVARIAN REPUBLIC OF) | 84-VIET NAM | 1284-VIRGIN ISLANDS (BRITISH) | 1340-VIRGIN ISLANDS (U.S.) | 681-WALLIS AND FUTUNA | 1013-WESTERN SAHARA | 967-YEMEN | 260-ZAMBIA | 263-ZIMBABWE | 9999-OTHERS
```

### Country (excluding India) code (DTAA Country name/code — 250 values):
```
(select) | 93-AFGHANISTAN | 1001-ALAND ISLANDS | 355-ALBANIA | 213-ALGERIA | 684-AMERICAN SAMOA | 376-ANDORRA | 244-ANGOLA | 1264-ANGUILLA | 1010-ANTARCTICA | 1268-ANTIGUA AND BARBUDA | 54-ARGENTINA | 374-ARMENIA | 297-ARUBA | 61-AUSTRALIA | 43-AUSTRIA | 994-AZERBAIJAN | 1242-BAHAMAS | 973-BAHRAIN | 880-BANGLADESH | 1246-BARBADOS | 375-BELARUS | 32-BELGIUM | 501-BELIZE | 229-BENIN | 1441-BERMUDA | 975-BHUTAN | 591-BOLIVIA (PLURINATIONAL STATE OF) | 1002-BONAIRE, SINT EUSTATIUS AND SABA | 387-BOSNIA AND HERZEGOVINA | 267-BOTSWANA | 1003-BOUVET ISLAND | 55-BRAZIL | 1014-BRITISH INDIAN OCEAN TERRITORY | 673-BRUNEI DARUSSALAM | 359-BULGARIA | 226-BURKINA FASO | 257-BURUNDI | 238-CABO VERDE | 855-CAMBODIA | 237-CAMEROON | 1-CANADA | 1345-CAYMAN ISLANDS | 236-CENTRAL AFRICAN REPUBLIC | 235-CHAD | 56-CHILE | 86-CHINA | 9-CHRISTMAS ISLAND | 672-COCOS (KEELING) ISLANDS | 57-COLOMBIA | 270-COMOROS | 242-CONGO | 243-CONGO (DEMOCRATIC REPUBLIC OF THE) | 682-COOK ISLANDS | 506-COSTA RICA | 225-COTE DIVOIRE | 385-CROATIA | 53-CUBA | 1015-CURACAO | 357-CYPRUS | 420-CZECHIA | 45-DENMARK | 253-DJIBOUTI | 1767-DOMINICA | 1809-DOMINICAN REPUBLIC | 593-ECUADOR | 20-EGYPT | 503-EL SALVADOR | 240-EQUATORIAL GUINEA | 291-ERITREA | 372-ESTONIA | 251-ETHIOPIA | 500-FALKLAND ISLANDS (MALVINAS) | 298-FAROE ISLANDS | 679-FIJI | 358-FINLAND | 33-FRANCE | 594-FRENCH GUIANA | 689-FRENCH POLYNESIA | 1004-FRENCH SOUTHERN TERRITORIES | 241-GABON | 220-GAMBIA | 995-GEORGIA | 49-GERMANY | 233-GHANA | 350-GIBRALTAR | 30-GREECE | 299-GREENLAND | 1473-GRENADA | 590-GUADELOUPE | 1671-GUAM | 502-GUATEMALA | 1481-GUERNSEY | 224-GUINEA | 245-GUINEA-BISSAU | 592-GUYANA | 509-HAITI | 1005-HEARD ISLAND AND MCDONALD ISLANDS | 6-HOLY SEE | 504-HONDURAS | 852-HONG KONG | 36-HUNGARY | 354-ICELAND | 62-INDONESIA | 98-IRAN (ISLAMIC REPUBLIC OF) | 964-IRAQ | 353-IRELAND | 1624-ISLE OF MAN | 972-ISRAEL | 5-ITALY | 1876-JAMAICA | 81-JAPAN | 1534-JERSEY | 962-JORDAN | 7-KAZAKHSTAN | 254-KENYA | 686-KIRIBATI | 850-KOREA (DEMOCRATIC PEOPLES REPUBLIC OF) | 82-KOREA (REPUBLIC OF) | 965-KUWAIT | 996-KYRGYZSTAN | 856-LAO PEOPLES DEMOCRATIC REPUBLIC | 371-LATVIA | 961-LEBANON | 266-LESOTHO | 231-LIBERIA | 218-LIBYA | 423-LIECHTENSTEIN | 370-LITHUANIA | 352-LUXEMBOURG | 853-MACAO | 389-MACEDONIA (THE FORMER YUGOSLAV REPUBLIC OF) | 261-MADAGASCAR | 265-MALAWI | 60-MALAYSIA | 960-MALDIVES | 223-MALI | 356-MALTA | 692-MARSHALL ISLANDS | 596-MARTINIQUE | 222-MAURITANIA | 230-MAURITIUS | 269-MAYOTTE | 52-MEXICO | 691-MICRONESIA (FEDERATED STATES OF) | 373-MOLDOVA (REPUBLIC OF) | 377-MONACO | 976-MONGOLIA | 382-MONTENEGRO | 1664-MONTSERRAT | 212-MOROCCO | 258-MOZAMBIQUE | 95-MYANMAR | 264-NAMIBIA | 674-NAURU | 977-NEPAL | 31-NETHERLANDS | 687-NEW CALEDONIA | 64-NEW ZEALAND | 505-NICARAGUA | 227-NIGER | 234-NIGERIA | 683-NIUE | 15-NORFOLK ISLAND | 1670-NORTHERN MARIANA ISLANDS | 47-NORWAY | 968-OMAN | 92-PAKISTAN | 680-PALAU | 970-PALESTINE, STATE OF | 507-PANAMA | 675-PAPUA NEW GUINEA | 595-PARAGUAY | 51-PERU | 63-PHILIPPINES | 1011-PITCAIRN | 48-POLAND | 14-PORTUGAL | 1787-PUERTO RICO | 974-QATAR | 262-REUNION | 40-ROMANIA | 8-RUSSIAN FEDERATION | 250-RWANDA | 1006-SAINT BARTHELEMY | 290-SAINT HELENA, ASCENSION AND TRISTAN DA CUNHA | 1869-SAINT KITTS AND NEVIS | 1758-SAINT LUCIA | 1007-SAINT MARTIN (FRENCH PART) | 508-SAINT PIERRE AND MIQUELON | 1784-SAINT VINCENT AND THE GRENADINES | 685-SAMOA | 378-SAN MARINO | 239-SAO TOME AND PRINCIPE | 966-SAUDI ARABIA | 221-SENEGAL | 381-SERBIA | 248-SEYCHELLES | 232-SIERRA LEONE | 65-SINGAPORE | 1721-SINT MAARTEN (DUTCH PART) | 421-SLOVAKIA | 386-SLOVENIA | 677-SOLOMON ISLANDS | 252-SOMALIA | 28-SOUTH AFRICA | 1008-SOUTH GEORGIA AND THE SOUTH SANDWICH ISLANDS | 211-SOUTH SUDAN | 35-SPAIN | 94-SRI LANKA | 249-SUDAN | 597-SURINAME | 1012-SVALBARD AND JAN MAYEN | 268-SWAZILAND | 46-SWEDEN | 41-SWITZERLAND | 963-SYRIAN ARAB REPUBLIC | 886-TAIWAN | 992-TAJIKISTAN | 255-TANZANIA, UNITED REPUBLIC OF | 66-THAILAND | 670-TIMOR-LESTE(EAST TIMOR) | 228-TOGO | 690-TOKELAU | 676-TONGA | 1868-TRINIDAD AND TOBAGO | 216-TUNISIA | 90-TURKEY | 993-TURKMENISTAN | 1649-TURKS AND CAICOS ISLANDS | 688-TUVALU | 256-UGANDA | 380-UKRAINE | 971-UNITED ARAB EMIRATES | 44-UNITED KINGDOM OF GREAT BRITAIN AND NORTHERN IRELAND | 2-UNITED STATES OF AMERICA | 1009-UNITED STATES MINOR OUTLYING ISLANDS | 598-URUGUAY | 998-UZBEKISTAN | 678-VANUATU | 58-VENEZUELA (BOLIVARIAN REPUBLIC OF) | 84-VIET NAM | 1284-VIRGIN ISLANDS (BRITISH) | 1340-VIRGIN ISLANDS (U.S.) | 681-WALLIS AND FUTUNA | 1013-WESTERN SAHARA | 967-YEMEN | 260-ZAMBIA | 263-ZIMBABWE | 9999-OTHERS
```

---

## Appendix 2 · Notes on hidden rows

Hidden rows are NOT built (constitution rule 1). The main hidden blocks are:
A4 (rows 78–82, NR non-FII), A5 (83–97, NR FII 115AD), A7 deemed-STCG detail
(117–121), the pre-23-July split lines, B3(i) resident unlisted bonds (214–223),
B4 indexation/112A threshold working (227, 235, 239–255), B5 (260–264), B6
(265–324), B7 (325–328), the two legacy Table-E copies (431–459), and the 15%/
10%/20% Table-F rows (478, 483, 485). Each is listed as hidden in Appendix 4.

---

## Appendix 3 · Every schema leaf of block ScheduleCG (full paths)

\`*\` = required.
```
  ShortTermCapGain.SaleofLandBuild.SaleofLandBuildDtls[] array
* ShortTermCapGain.SaleofLandBuild.SaleofLandBuildDtls[].DateofPurchase string
* ShortTermCapGain.SaleofLandBuild.SaleofLandBuildDtls[].DateofSale string
* ShortTermCapGain.SaleofLandBuild.SaleofLandBuildDtls[].FullConsideration integer
* ShortTermCapGain.SaleofLandBuild.SaleofLandBuildDtls[].PropertyValuation integer
* ShortTermCapGain.SaleofLandBuild.SaleofLandBuildDtls[].FullConsideration50C integer
* ShortTermCapGain.SaleofLandBuild.SaleofLandBuildDtls[].AquisitCost integer
* ShortTermCapGain.SaleofLandBuild.SaleofLandBuildDtls[].ImproveCost integer
* ShortTermCapGain.SaleofLandBuild.SaleofLandBuildDtls[].ExpOnTrans integer
* ShortTermCapGain.SaleofLandBuild.SaleofLandBuildDtls[].TotalDedn integer
* ShortTermCapGain.SaleofLandBuild.SaleofLandBuildDtls[].Balance integer
  ShortTermCapGain.SaleofLandBuild.SaleofLandBuildDtls[].ExemptionOrDednUs54.ExemptionOrDednUs54Dtls[] array
* ShortTermCapGain.SaleofLandBuild.SaleofLandBuildDtls[].ExemptionOrDednUs54.ExemptionOrDednUs54Dtls[].ExemptionSecCode string
* ShortTermCapGain.SaleofLandBuild.SaleofLandBuildDtls[].ExemptionOrDednUs54.ExemptionOrDednUs54Dtls[].ExemptionAmount integer
* ShortTermCapGain.SaleofLandBuild.SaleofLandBuildDtls[].ExemptionOrDednUs54.ExemptionGrandTotal integer
* ShortTermCapGain.SaleofLandBuild.SaleofLandBuildDtls[].CapgainonAssets integer
  ShortTermCapGain.SaleofLandBuild.SaleofLandBuildDtls[].TrnsfImmblPrprty.TrnsfImmblPrprtyDtls[] array
* ShortTermCapGain.SaleofLandBuild.SaleofLandBuildDtls[].TrnsfImmblPrprty.TrnsfImmblPrprtyDtls[].NameOfBuyer string
  ShortTermCapGain.SaleofLandBuild.SaleofLandBuildDtls[].TrnsfImmblPrprty.TrnsfImmblPrprtyDtls[].PANofBuyer string
  ShortTermCapGain.SaleofLandBuild.SaleofLandBuildDtls[].TrnsfImmblPrprty.TrnsfImmblPrprtyDtls[].AaadhaarOfBuyer string
* ShortTermCapGain.SaleofLandBuild.SaleofLandBuildDtls[].TrnsfImmblPrprty.TrnsfImmblPrprtyDtls[].PercentageShare number
* ShortTermCapGain.SaleofLandBuild.SaleofLandBuildDtls[].TrnsfImmblPrprty.TrnsfImmblPrprtyDtls[].Amount integer
* ShortTermCapGain.SaleofLandBuild.SaleofLandBuildDtls[].TrnsfImmblPrprty.TrnsfImmblPrprtyDtls[].AddressOfProperty string
* ShortTermCapGain.SaleofLandBuild.SaleofLandBuildDtls[].TrnsfImmblPrprty.TrnsfImmblPrprtyDtls[].StateCode string
  ShortTermCapGain.SaleofLandBuild.SaleofLandBuildDtls[].TrnsfImmblPrprty.TrnsfImmblPrprtyDtls[].CountryCode string
  ShortTermCapGain.SaleofLandBuild.SaleofLandBuildDtls[].TrnsfImmblPrprty.TrnsfImmblPrprtyDtls[].PinCode integer
  ShortTermCapGain.SaleofLandBuild.SaleofLandBuildDtls[].TrnsfImmblPrprty.TrnsfImmblPrprtyDtls[].ZipCode string
* ShortTermCapGain.SlumpSaleInStcg.FMV11UAEii integer
* ShortTermCapGain.SlumpSaleInStcg.FMV11UAEiii integer
* ShortTermCapGain.SlumpSaleInStcg.FullConsideration integer
* ShortTermCapGain.SlumpSaleInStcg.NetWorthOfDivision integer
* ShortTermCapGain.SlumpSaleInStcg.CapgainonAssets integer
  ShortTermCapGain.EquityMFonSTT[] array
* ShortTermCapGain.EquityMFonSTT[].MFSectionCode string
* ShortTermCapGain.EquityMFonSTT[].EquityMFonSTTDtls.FullConsideration integer
* ShortTermCapGain.EquityMFonSTT[].EquityMFonSTTDtls.DeductSec48.AquisitCost integer
* ShortTermCapGain.EquityMFonSTT[].EquityMFonSTTDtls.DeductSec48.ImproveCost integer
* ShortTermCapGain.EquityMFonSTT[].EquityMFonSTTDtls.DeductSec48.ExpOnTrans integer
* ShortTermCapGain.EquityMFonSTT[].EquityMFonSTTDtls.DeductSec48.TotalDedn integer
* ShortTermCapGain.EquityMFonSTT[].EquityMFonSTTDtls.BalanceCG integer
* ShortTermCapGain.EquityMFonSTT[].EquityMFonSTTDtls.LossSec94of7Or94of8 integer
* ShortTermCapGain.EquityMFonSTT[].EquityMFonSTTDtls.CapgainonAssets integer
* ShortTermCapGain.NRITransacSec48Dtl.NRItaxSTTPaid integer
* ShortTermCapGain.NRITransacSec48Dtl.NRItaxSTTNotPaid integer
* ShortTermCapGain.NRISecur115AD.FullValueConsdRecvUnqshr integer
* ShortTermCapGain.NRISecur115AD.FairMrktValueUnqshr integer
* ShortTermCapGain.NRISecur115AD.FullValueConsdSec50CA integer
* ShortTermCapGain.NRISecur115AD.FullValueConsdOthUnqshr integer
* ShortTermCapGain.NRISecur115AD.FullConsideration integer
* ShortTermCapGain.NRISecur115AD.DeductSec48.AquisitCost integer
* ShortTermCapGain.NRISecur115AD.DeductSec48.ImproveCost integer
* ShortTermCapGain.NRISecur115AD.DeductSec48.ExpOnTrans integer
* ShortTermCapGain.NRISecur115AD.DeductSec48.TotalDedn integer
* ShortTermCapGain.NRISecur115AD.BalanceCG integer
* ShortTermCapGain.NRISecur115AD.LossSec94of7Or94of8 integer
* ShortTermCapGain.NRISecur115AD.CapgainonAssets integer
* ShortTermCapGain.SaleOnOtherAssets.FullValueConsdRecvUnqshr integer
* ShortTermCapGain.SaleOnOtherAssets.FairMrktValueUnqshr integer
* ShortTermCapGain.SaleOnOtherAssets.FullValueConsdSec50CA integer
* ShortTermCapGain.SaleOnOtherAssets.FullValueConsdOthUnqshr integer
* ShortTermCapGain.SaleOnOtherAssets.FullConsideration integer
* ShortTermCapGain.SaleOnOtherAssets.DeductSec48.AquisitCost integer
* ShortTermCapGain.SaleOnOtherAssets.DeductSec48.ImproveCost integer
* ShortTermCapGain.SaleOnOtherAssets.DeductSec48.ExpOnTrans integer
* ShortTermCapGain.SaleOnOtherAssets.DeductSec48.TotalDedn integer
* ShortTermCapGain.SaleOnOtherAssets.BalanceCG integer
* ShortTermCapGain.SaleOnOtherAssets.LossSec94of7Or94of8 integer
* ShortTermCapGain.SaleOnOtherAssets.DeemedSTCGDeprAsset integer
  ShortTermCapGain.SaleOnOtherAssets.ExemptionOrDednUs54.ExemptionOrDednUs54Dtls[] array
* ShortTermCapGain.SaleOnOtherAssets.ExemptionOrDednUs54.ExemptionOrDednUs54Dtls[].ExemptionSecCode string
* ShortTermCapGain.SaleOnOtherAssets.ExemptionOrDednUs54.ExemptionOrDednUs54Dtls[].ExemptionAmount integer
* ShortTermCapGain.SaleOnOtherAssets.ExemptionOrDednUs54.ExemptionGrandTotal integer
* ShortTermCapGain.SaleOnOtherAssets.CapgainonAssets integer
  ShortTermCapGain.UnutilizedStcgFlag string
  ShortTermCapGain.UnutilizedCg.UnutilizedCgPrvYrDtls[] array
* ShortTermCapGain.UnutilizedCg.UnutilizedCgPrvYrDtls[].PrvYrInWhichAsstTrnsfrd string
* ShortTermCapGain.UnutilizedCg.UnutilizedCgPrvYrDtls[].SectionClmd string
  ShortTermCapGain.UnutilizedCg.UnutilizedCgPrvYrDtls[].YrInWhichAssetAcq string
  ShortTermCapGain.UnutilizedCg.UnutilizedCgPrvYrDtls[].AmtUtilized integer
* ShortTermCapGain.UnutilizedCg.UnutilizedCgPrvYrDtls[].AmtUnutilized integer
  ShortTermCapGain.AmtDeemedStcg integer
* ShortTermCapGain.TotalAmtDeemedStcg integer
* ShortTermCapGain.PassThrIncNatureSTCG integer
  ShortTermCapGain.PassThrIncNatureSTCG20Per integer
  ShortTermCapGain.PassThrIncNatureSTCG30Per integer
  ShortTermCapGain.PassThrIncNatureSTCGAppRate integer
  ShortTermCapGain.NRICgDTAA.NRIDTAADtls[] array
* ShortTermCapGain.NRICgDTAA.NRIDTAADtls[].DTAAamt integer
* ShortTermCapGain.NRICgDTAA.NRIDTAADtls[].ItemNoincl string
* ShortTermCapGain.NRICgDTAA.NRIDTAADtls[].CountryName string
* ShortTermCapGain.NRICgDTAA.NRIDTAADtls[].CountryCodeExcludingIndia string
* ShortTermCapGain.NRICgDTAA.NRIDTAADtls[].DTAAarticle string
* ShortTermCapGain.NRICgDTAA.NRIDTAADtls[].RateAsPerTreaty number
  ShortTermCapGain.NRICgDTAA.NRIDTAADtls[].TaxRescertifiedFlag string
* ShortTermCapGain.NRICgDTAA.NRIDTAADtls[].SecITAct string
* ShortTermCapGain.NRICgDTAA.NRIDTAADtls[].RateAsPerITAct number
  ShortTermCapGain.NRICgDTAA.NRIDTAADtls[].ApplicableRate number
* ShortTermCapGain.TotalAmtNotTaxUsDTAAStcg integer
* ShortTermCapGain.TotalAmtTaxUsDTAAStcg integer
* ShortTermCapGain.CapitalLossBuyBackShares.TotalCapitalLossBuyBackShares integer
* ShortTermCapGain.CapitalLossBuyBackShares.CapitalLossBuyBackSharesDtls[] array
* ShortTermCapGain.CapitalLossBuyBackShares.CapitalLossBuyBackSharesDtls[].Rate string
* ShortTermCapGain.CapitalLossBuyBackShares.CapitalLossBuyBackSharesDtls[].Amount integer
* ShortTermCapGain.TotalSTCG integer
  LongTermCapGain.SaleofLandBuild.SaleofLandBuildDtls[] array
* LongTermCapGain.SaleofLandBuild.SaleofLandBuildDtls[].DateofPurchase string
* LongTermCapGain.SaleofLandBuild.SaleofLandBuildDtls[].DateofSale string
* LongTermCapGain.SaleofLandBuild.SaleofLandBuildDtls[].FullConsideration integer
* LongTermCapGain.SaleofLandBuild.SaleofLandBuildDtls[].PropertyValuation integer
* LongTermCapGain.SaleofLandBuild.SaleofLandBuildDtls[].FullConsideration50C integer
* LongTermCapGain.SaleofLandBuild.SaleofLandBuildDtls[].AquisitCost integer
  LongTermCapGain.SaleofLandBuild.SaleofLandBuildDtls[].ImproveCost integer
* LongTermCapGain.SaleofLandBuild.SaleofLandBuildDtls[].ExpOnTrans integer
* LongTermCapGain.SaleofLandBuild.SaleofLandBuildDtls[].TotalDedn integer
* LongTermCapGain.SaleofLandBuild.SaleofLandBuildDtls[].Balance integer
  LongTermCapGain.SaleofLandBuild.SaleofLandBuildDtls[].ExemptionOrDednUs54.ExemptionOrDednUs54Dtls[] array
* LongTermCapGain.SaleofLandBuild.SaleofLandBuildDtls[].ExemptionOrDednUs54.ExemptionOrDednUs54Dtls[].ExemptionSecCode string
* LongTermCapGain.SaleofLandBuild.SaleofLandBuildDtls[].ExemptionOrDednUs54.ExemptionOrDednUs54Dtls[].ExemptionAmount integer
* LongTermCapGain.SaleofLandBuild.SaleofLandBuildDtls[].ExemptionOrDednUs54.ExemptionGrandTotal integer
* LongTermCapGain.SaleofLandBuild.SaleofLandBuildDtls[].CapgainonAssets integer
  LongTermCapGain.SaleofLandBuild.SaleofLandBuildDtls[].TrnsfImmblPrprty.TrnsfImmblPrprtyDtls[] array
* LongTermCapGain.SaleofLandBuild.SaleofLandBuildDtls[].TrnsfImmblPrprty.TrnsfImmblPrprtyDtls[].NameOfBuyer string
  LongTermCapGain.SaleofLandBuild.SaleofLandBuildDtls[].TrnsfImmblPrprty.TrnsfImmblPrprtyDtls[].PANofBuyer string
  LongTermCapGain.SaleofLandBuild.SaleofLandBuildDtls[].TrnsfImmblPrprty.TrnsfImmblPrprtyDtls[].AaadhaarOfBuyer string
* LongTermCapGain.SaleofLandBuild.SaleofLandBuildDtls[].TrnsfImmblPrprty.TrnsfImmblPrprtyDtls[].PercentageShare number
* LongTermCapGain.SaleofLandBuild.SaleofLandBuildDtls[].TrnsfImmblPrprty.TrnsfImmblPrprtyDtls[].Amount integer
* LongTermCapGain.SaleofLandBuild.SaleofLandBuildDtls[].TrnsfImmblPrprty.TrnsfImmblPrprtyDtls[].AddressOfProperty string
* LongTermCapGain.SaleofLandBuild.SaleofLandBuildDtls[].TrnsfImmblPrprty.TrnsfImmblPrprtyDtls[].StateCode string
  LongTermCapGain.SaleofLandBuild.SaleofLandBuildDtls[].TrnsfImmblPrprty.TrnsfImmblPrprtyDtls[].CountryCode string
  LongTermCapGain.SaleofLandBuild.SaleofLandBuildDtls[].TrnsfImmblPrprty.TrnsfImmblPrprtyDtls[].PinCode integer
  LongTermCapGain.SaleofLandBuild.SaleofLandBuildDtls[].TrnsfImmblPrprty.TrnsfImmblPrprtyDtls[].ZipCode string
  LongTermCapGain.SaleofLandBuild.TotalLTCGImmblPrprty integer
* LongTermCapGain.SlumpSaleInLtcgDtls.SlumpSaleInLtcg.FMV11UAEii integer
* LongTermCapGain.SlumpSaleInLtcgDtls.SlumpSaleInLtcg.FMV11UAEiii integer
* LongTermCapGain.SlumpSaleInLtcgDtls.SlumpSaleInLtcg.FullConsideration integer
* LongTermCapGain.SlumpSaleInLtcgDtls.SlumpSaleInLtcg.NetWorthOfDivision integer
* LongTermCapGain.SlumpSaleInLtcgDtls.SlumpSaleInLtcg.SlumpBalance integer
* LongTermCapGain.SlumpSaleInLtcgDtls.SlumpSaleInLtcg.DeductionUnderSec54 integer
* LongTermCapGain.SlumpSaleInLtcgDtls.SlumpSaleInLtcg.CapgainonAssets integer
* LongTermCapGain.Proviso112Applicable.Proviso112SectionCode string
* LongTermCapGain.Proviso112Applicable.Proviso112Applicabledtls.FullConsideration integer
* LongTermCapGain.Proviso112Applicable.Proviso112Applicabledtls.DeductSec48.AquisitCost integer
* LongTermCapGain.Proviso112Applicable.Proviso112Applicabledtls.DeductSec48.ImproveCost integer
* LongTermCapGain.Proviso112Applicable.Proviso112Applicabledtls.DeductSec48.ExpOnTrans integer
* LongTermCapGain.Proviso112Applicable.Proviso112Applicabledtls.DeductSec48.TotalDedn integer
* LongTermCapGain.Proviso112Applicable.Proviso112Applicabledtls.BalanceCG integer
* LongTermCapGain.SaleOfEquityShareUs112A.CapgainonAssets integer
* LongTermCapGain.NRIProvisoSec48.BalanceCG integer
  LongTermCapGain.NRIOnSec112and115.NRIOnSec112and115Dtls[] array
* LongTermCapGain.NRIOnSec112and115.NRIOnSec112and115Dtls[].SectionCode string
* LongTermCapGain.NRIOnSec112and115.NRIOnSec112and115Dtls[].FullValueConsdRecvUnqshr integer
* LongTermCapGain.NRIOnSec112and115.NRIOnSec112and115Dtls[].FairMrktValueUnqshr integer
* LongTermCapGain.NRIOnSec112and115.NRIOnSec112and115Dtls[].FullValueConsdSec50CA integer
* LongTermCapGain.NRIOnSec112and115.NRIOnSec112and115Dtls[].FullValueConsdOthUnqshr integer
* LongTermCapGain.NRIOnSec112and115.NRIOnSec112and115Dtls[].FullConsideration integer
* LongTermCapGain.NRIOnSec112and115.NRIOnSec112and115Dtls[].DeductSec48.AquisitCost integer
* LongTermCapGain.NRIOnSec112and115.NRIOnSec112and115Dtls[].DeductSec48.ImproveCost integer
* LongTermCapGain.NRIOnSec112and115.NRIOnSec112and115Dtls[].DeductSec48.ExpOnTrans integer
* LongTermCapGain.NRIOnSec112and115.NRIOnSec112and115Dtls[].DeductSec48.TotalDedn integer
* LongTermCapGain.NRIOnSec112and115.NRIOnSec112and115Dtls[].BalanceCG integer
  LongTermCapGain.NRIOnSec112and115.TotalNRIOnSec112and115 integer
* LongTermCapGain.NRISaleOfEquityShareUs112A.CapgainonAssets integer
* LongTermCapGain.SaleofAssetNADtls.SaleofAssetNA.FullValueConsdRecvUnqshr integer
* LongTermCapGain.SaleofAssetNADtls.SaleofAssetNA.FairMrktValueUnqshr integer
* LongTermCapGain.SaleofAssetNADtls.SaleofAssetNA.FullValueConsdSec50CA integer
* LongTermCapGain.SaleofAssetNADtls.SaleofAssetNA.FullValueConsdOthUnqshr integer
* LongTermCapGain.SaleofAssetNADtls.SaleofAssetNA.FullConsideration integer
* LongTermCapGain.SaleofAssetNADtls.SaleofAssetNA.DeductSec48.AquisitCost integer
* LongTermCapGain.SaleofAssetNADtls.SaleofAssetNA.DeductSec48.ImproveCost integer
* LongTermCapGain.SaleofAssetNADtls.SaleofAssetNA.DeductSec48.ExpOnTrans integer
* LongTermCapGain.SaleofAssetNADtls.SaleofAssetNA.DeductSec48.TotalDedn integer
* LongTermCapGain.SaleofAssetNADtls.SaleofAssetNA.BalanceCG integer
  LongTermCapGain.SaleofAssetNADtls.SaleofAssetNA.ExemptionOrDednUs54.ExemptionOrDednUs54Dtls[] array
* LongTermCapGain.SaleofAssetNADtls.SaleofAssetNA.ExemptionOrDednUs54.ExemptionOrDednUs54Dtls[].ExemptionSecCode string
* LongTermCapGain.SaleofAssetNADtls.SaleofAssetNA.ExemptionOrDednUs54.ExemptionOrDednUs54Dtls[].ExemptionAmount integer
* LongTermCapGain.SaleofAssetNADtls.SaleofAssetNA.ExemptionOrDednUs54.ExemptionGrandTotal integer
* LongTermCapGain.SaleofAssetNADtls.SaleofAssetNA.CapgainonAssets integer
  LongTermCapGain.UnutilizedLtcgFlag string
  LongTermCapGain.UnutilizedCg.UnutilizedCgPrvYrDtls[] array
* LongTermCapGain.UnutilizedCg.UnutilizedCgPrvYrDtls[].PrvYrInWhichAsstTrnsfrd string
* LongTermCapGain.UnutilizedCg.UnutilizedCgPrvYrDtls[].SectionClmd string
  LongTermCapGain.UnutilizedCg.UnutilizedCgPrvYrDtls[].YrInWhichAssetAcq string
  LongTermCapGain.UnutilizedCg.UnutilizedCgPrvYrDtls[].AmtUtilized integer
* LongTermCapGain.UnutilizedCg.UnutilizedCgPrvYrDtls[].AmtUnutilized integer
  LongTermCapGain.AmtDeemedLtcg integer
* LongTermCapGain.TotalAmtDeemedLtcg integer
* LongTermCapGain.PassThrIncNatureLTCG integer
  LongTermCapGain.PassThrIncNatureLTCGUs112A12_5Per integer
  LongTermCapGain.PassThrIncNatureLTCG12_5Per integer
  LongTermCapGain.NRICgDTAA.NRIDTAADtls[] array
* LongTermCapGain.NRICgDTAA.NRIDTAADtls[].DTAAamt integer
* LongTermCapGain.NRICgDTAA.NRIDTAADtls[].ItemNoincl string
* LongTermCapGain.NRICgDTAA.NRIDTAADtls[].CountryName string
* LongTermCapGain.NRICgDTAA.NRIDTAADtls[].CountryCodeExcludingIndia string
* LongTermCapGain.NRICgDTAA.NRIDTAADtls[].DTAAarticle string
* LongTermCapGain.NRICgDTAA.NRIDTAADtls[].RateAsPerTreaty number
  LongTermCapGain.NRICgDTAA.NRIDTAADtls[].TaxRescertifiedFlag string
* LongTermCapGain.NRICgDTAA.NRIDTAADtls[].SecITAct string
* LongTermCapGain.NRICgDTAA.NRIDTAADtls[].RateAsPerITAct number
  LongTermCapGain.NRICgDTAA.NRIDTAADtls[].ApplicableRate number
* LongTermCapGain.TotalAmtNotTaxUsDTAALtcg integer
* LongTermCapGain.TotalAmtTaxUsDTAALtcg integer
* LongTermCapGain.CapitalLossBuyBackShares.TotalCapitalLossBuyBackShares integer
* LongTermCapGain.TotalLTCG integer
* SumOfCGIncm integer
* IncmFromVDATrnsf integer
* IncChargeableHeadCapGain integer
  DeducClaimInfo.DeducClaimDtlsUs54D[] array
* DeducClaimInfo.DeducClaimDtlsUs54D[].DateofAcquisition string
  DeducClaimInfo.DeducClaimDtlsUs54D[].CostofNewLandBuilding integer
  DeducClaimInfo.DeducClaimDtlsUs54D[].DateofPurchase string
  DeducClaimInfo.DeducClaimDtlsUs54D[].AmtDeposited integer
  DeducClaimInfo.DeducClaimDtlsUs54D[].DepositDate string
  DeducClaimInfo.DeducClaimDtlsUs54D[].AccountNo string
  DeducClaimInfo.DeducClaimDtlsUs54D[].IFSC string
* DeducClaimInfo.DeducClaimDtlsUs54D[].AmtDeducted integer
  DeducClaimInfo.DeducClaimDtlsUs54EC[] array
* DeducClaimInfo.DeducClaimDtlsUs54EC[].DateofTransfer string
  DeducClaimInfo.DeducClaimDtlsUs54EC[].AmtInvested integer
  DeducClaimInfo.DeducClaimDtlsUs54EC[].DateofInvestment string
* DeducClaimInfo.DeducClaimDtlsUs54EC[].AmtDeducted integer
  DeducClaimInfo.DeducClaimDtlsUs54G[] array
* DeducClaimInfo.DeducClaimDtlsUs54G[].DateofTransfer string
  DeducClaimInfo.DeducClaimDtlsUs54G[].CostofNewAsset integer
  DeducClaimInfo.DeducClaimDtlsUs54G[].DateofPurchase string
  DeducClaimInfo.DeducClaimDtlsUs54G[].AmtDeposited integer
  DeducClaimInfo.DeducClaimDtlsUs54G[].DepositDate string
  DeducClaimInfo.DeducClaimDtlsUs54G[].AccountNo string
  DeducClaimInfo.DeducClaimDtlsUs54G[].IFSC string
* DeducClaimInfo.DeducClaimDtlsUs54G[].AmtDeducted integer
  DeducClaimInfo.DeducClaimDtlsUs54GA[] array
* DeducClaimInfo.DeducClaimDtlsUs54GA[].DateofTransfer string
  DeducClaimInfo.DeducClaimDtlsUs54GA[].CostofNewAsset integer
  DeducClaimInfo.DeducClaimDtlsUs54GA[].DateofPurchase string
  DeducClaimInfo.DeducClaimDtlsUs54GA[].AmtDeposited integer
  DeducClaimInfo.DeducClaimDtlsUs54GA[].DepositDate string
  DeducClaimInfo.DeducClaimDtlsUs54GA[].AccountNo string
  DeducClaimInfo.DeducClaimDtlsUs54GA[].IFSC string
* DeducClaimInfo.DeducClaimDtlsUs54GA[].AmtDeducted integer
* DeducClaimInfo.TotDeductClaim integer
* CurrYrLosses.InLossSetOff.StclSetoff20Per integer
* CurrYrLosses.InLossSetOff.StclSetoff30Per integer
* CurrYrLosses.InLossSetOff.StclSetoffAppRate integer
* CurrYrLosses.InLossSetOff.StclSetoffDTAARate integer
* CurrYrLosses.InLossSetOff.LtclSetOff12_5Per integer
* CurrYrLosses.InLossSetOff.LtclSetOffDTAARate integer
* CurrYrLosses.InStcg20Per.CurrYearIncome integer
* CurrYrLosses.InStcg20Per.StclSetoff30Per integer
* CurrYrLosses.InStcg20Per.StclSetoffAppRate integer
* CurrYrLosses.InStcg20Per.StclSetoffDTAARate integer
* CurrYrLosses.InStcg20Per.CurrYrCapGain integer
* CurrYrLosses.InStcg30Per.CurrYearIncome integer
* CurrYrLosses.InStcg30Per.StclSetoff20Per integer
* CurrYrLosses.InStcg30Per.StclSetoffAppRate integer
* CurrYrLosses.InStcg30Per.StclSetoffDTAARate integer
* CurrYrLosses.InStcg30Per.CurrYrCapGain integer
* CurrYrLosses.InStcgAppRate.CurrYearIncome integer
* CurrYrLosses.InStcgAppRate.StclSetoff20Per integer
* CurrYrLosses.InStcgAppRate.StclSetoff30Per integer
* CurrYrLosses.InStcgAppRate.StclSetoffDTAARate integer
* CurrYrLosses.InStcgAppRate.CurrYrCapGain integer
* CurrYrLosses.InStcgDTAARate.CurrYearIncome integer
* CurrYrLosses.InStcgDTAARate.StclSetoff20Per integer
* CurrYrLosses.InStcgDTAARate.StclSetoff30Per integer
* CurrYrLosses.InStcgDTAARate.StclSetoffAppRate integer
* CurrYrLosses.InStcgDTAARate.CurrYrCapGain integer
* CurrYrLosses.InLtcg12_5Per.CurrYearIncome integer
* CurrYrLosses.InLtcg12_5Per.StclSetoff20Per integer
* CurrYrLosses.InLtcg12_5Per.StclSetoff30Per integer
* CurrYrLosses.InLtcg12_5Per.StclSetoffAppRate integer
* CurrYrLosses.InLtcg12_5Per.StclSetoffDTAARate integer
* CurrYrLosses.InLtcg12_5Per.LtclSetOffDTAARate integer
* CurrYrLosses.InLtcg12_5Per.CurrYrCapGain integer
* CurrYrLosses.InLtcgDTAARate.CurrYearIncome integer
* CurrYrLosses.InLtcgDTAARate.StclSetoff20Per integer
* CurrYrLosses.InLtcgDTAARate.StclSetoff30Per integer
* CurrYrLosses.InLtcgDTAARate.StclSetoffAppRate integer
* CurrYrLosses.InLtcgDTAARate.StclSetoffDTAARate integer
* CurrYrLosses.InLtcgDTAARate.LtclSetOff12_5Per integer
* CurrYrLosses.InLtcgDTAARate.CurrYrCapGain integer
* CurrYrLosses.TotLossSetOff.StclSetoff20Per integer
* CurrYrLosses.TotLossSetOff.StclSetoff30Per integer
* CurrYrLosses.TotLossSetOff.StclSetoffAppRate integer
* CurrYrLosses.TotLossSetOff.StclSetoffDTAARate integer
* CurrYrLosses.TotLossSetOff.LtclSetOff12_5Per integer
* CurrYrLosses.TotLossSetOff.LtclSetOffDTAARate integer
* CurrYrLosses.LossRemainSetOff.StclSetoff20Per integer
* CurrYrLosses.LossRemainSetOff.StclSetoff30Per integer
* CurrYrLosses.LossRemainSetOff.StclSetoffAppRate integer
* CurrYrLosses.LossRemainSetOff.StclSetoffDTAARate integer
* CurrYrLosses.LossRemainSetOff.LtclSetOff12_5Per integer
* CurrYrLosses.LossRemainSetOff.LtclSetOffDTAARate integer
  EditAutopoulatedDetail string
* AccruOrRecOfCG.ShortTermUnder20Per.DateRange.Upto15Of6 integer
* AccruOrRecOfCG.ShortTermUnder20Per.DateRange.Up16Of6To15Of9 integer
* AccruOrRecOfCG.ShortTermUnder20Per.DateRange.Up16Of9To15Of12 integer
* AccruOrRecOfCG.ShortTermUnder20Per.DateRange.Up16Of12To15Of3 integer
* AccruOrRecOfCG.ShortTermUnder20Per.DateRange.Up16Of3To31Of3 integer
* AccruOrRecOfCG.ShortTermUnder30Per.DateRange.Upto15Of6 integer
* AccruOrRecOfCG.ShortTermUnder30Per.DateRange.Up16Of6To15Of9 integer
* AccruOrRecOfCG.ShortTermUnder30Per.DateRange.Up16Of9To15Of12 integer
* AccruOrRecOfCG.ShortTermUnder30Per.DateRange.Up16Of12To15Of3 integer
* AccruOrRecOfCG.ShortTermUnder30Per.DateRange.Up16Of3To31Of3 integer
* AccruOrRecOfCG.ShortTermUnderAppRate.DateRange.Upto15Of6 integer
* AccruOrRecOfCG.ShortTermUnderAppRate.DateRange.Up16Of6To15Of9 integer
* AccruOrRecOfCG.ShortTermUnderAppRate.DateRange.Up16Of9To15Of12 integer
* AccruOrRecOfCG.ShortTermUnderAppRate.DateRange.Up16Of12To15Of3 integer
* AccruOrRecOfCG.ShortTermUnderAppRate.DateRange.Up16Of3To31Of3 integer
* AccruOrRecOfCG.ShortTermUnderDTAARate.DateRange.Upto15Of6 integer
* AccruOrRecOfCG.ShortTermUnderDTAARate.DateRange.Up16Of6To15Of9 integer
* AccruOrRecOfCG.ShortTermUnderDTAARate.DateRange.Up16Of9To15Of12 integer
* AccruOrRecOfCG.ShortTermUnderDTAARate.DateRange.Up16Of12To15Of3 integer
* AccruOrRecOfCG.ShortTermUnderDTAARate.DateRange.Up16Of3To31Of3 integer
* AccruOrRecOfCG.LongTermUnder12_5Per.DateRange.Upto15Of6 integer
* AccruOrRecOfCG.LongTermUnder12_5Per.DateRange.Up16Of6To15Of9 integer
* AccruOrRecOfCG.LongTermUnder12_5Per.DateRange.Up16Of9To15Of12 integer
* AccruOrRecOfCG.LongTermUnder12_5Per.DateRange.Up16Of12To15Of3 integer
* AccruOrRecOfCG.LongTermUnder12_5Per.DateRange.Up16Of3To31Of3 integer
* AccruOrRecOfCG.LongTermUnderDTAARate.DateRange.Upto15Of6 integer
* AccruOrRecOfCG.LongTermUnderDTAARate.DateRange.Up16Of6To15Of9 integer
* AccruOrRecOfCG.LongTermUnderDTAARate.DateRange.Up16Of9To15Of12 integer
* AccruOrRecOfCG.LongTermUnderDTAARate.DateRange.Up16Of12To15Of3 integer
* AccruOrRecOfCG.LongTermUnderDTAARate.DateRange.Up16Of3To31Of3 integer
* AccruOrRecOfCG.VDATrnsfGainsUnder30Per.DateRange.Upto15Of6 integer
* AccruOrRecOfCG.VDATrnsfGainsUnder30Per.DateRange.Up16Of6To15Of9 integer
* AccruOrRecOfCG.VDATrnsfGainsUnder30Per.DateRange.Up16Of9To15Of12 integer
* AccruOrRecOfCG.VDATrnsfGainsUnder30Per.DateRange.Up16Of12To15Of3 integer
* AccruOrRecOfCG.VDATrnsfGainsUnder30Per.DateRange.Up16Of3To31Of3 integer
```

---

## Appendix 4 · Every live row of the CG sheet, verbatim

Source of every label above. `[cell] text` as the utility stores it (width 100).
```
[C3] Schedule CG  |  [G3] Capital Gains
[D4] A  |  [E4] Short-term capital gain (Items 4 & 5 are not applicable for residents)  |  [AA4] Block count STCG
[F5] From sale of land or building or both(fill up details separately for each property)  |  [AA5] Number of blocks
[G6] Date of Purchase/Acquisition
[G7] Date of Sale/Transfer
[F8] a  |  [G8] i  |  [H8] Full value of consideration received/receivable  |  [P8] ai  |  [AA8] Block count LTCG
[G9] ii  |  [H9] Value of property as per stamp valuation authority  |  [P9] aii  |  [AA9] Number of blocks
[G10] iii  |  [H10] Full value of consideration adopted as per section 50C for the purpose of Capital Gains [in case (ai  |  [P10] aiii
[F11] b  |  [G11] Deductions under section 48
[G12] i  |  [H12] Cost of acquisition without indexation  |  [P12] bi
[G13] ii  |  [H13] Cost of Improvement without indexation  |  [P13] bii
[G14] iii  |  [H14] Expenditure wholly and exclusively in connection with transfer  |  [P14] biii
[G15] iv  |  [H15] Total (bi + bii + biii)  |  [P15] biv
[F16] c  |  [G16] Balance (aiii – biv)  |  [P16] 1c
[F17] di  |  [G17] Deduction under section 54G(Specify details in item D below)  |  [P17] di
[F18] dii  |  [G18] Deduction under section 54GA(Specify details in item D below)  |  [P18] dii
[F19] d  |  [G19] Total Deduction under section 54G/54GA  |  [P19] d
[F20] e  |  [G20] Short-term Capital Gains on Immovable property (1c - 1d)  |  [R20] A1e
[F21] f  |  [G21] In case of transfer of immovable property please furnish the following details (see note)
[G22] Sl. No.  |  [H22] Name of buyer  |  [I22] PAN of buyer  |  [J22] Aadhaar No. of buyer  |  [K22] Percentage share  |  [L22] Amount  |  [M22] Address of property  |  [N22] State  |  [O22] Pincode  |  [P22] Country Code  |  [Q22] Zip Code
[N23] (Select)  |  [P23] (select)
[N24] (Select)  |  [P24] (select)
[N25] (Select)  |  [P25] (select)
[F27] From sale of land or building or both(fill up details separately for each property)
[G28] Date of Purchase/Acquisition
[G29] Date of Sale/Transfer
[F30] a  |  [G30] i  |  [H30] Full value of consideration received/receivable  |  [P30] ai
[G31] ii  |  [H31] Value of property as per stamp valuation authority  |  [P31] aii
[G32] iii  |  [H32] Full value of consideration adopted as per section 50C for the purpose of Capital Gains [in case (ai  |  [P32] aiii
[F33] b  |  [G33] Deductions under section 48
[G34] i  |  [H34] Cost of acquisition without indexation  |  [P34] bi
[G35] ii  |  [H35] Cost of Improvement without indexation  |  [P35] bii
[G36] iii  |  [H36] Expenditure wholly and exclusively in connection with transfer  |  [P36] biii
[G37] iv  |  [H37] Total (bi + bii + biii)  |  [P37] biv
[F38] c  |  [G38] Balance (aiii – biv)  |  [P38] 1c
[F39] di  |  [G39] Deduction under section 54G(Specify details in item D below)  |  [P39] di
[F40] dii  |  [G40] Deduction under section 54GA(Specify details in item D below)  |  [P40] dii
[F41] d  |  [G41] Total Deduction under section 54G/54GA  |  [P41] d
[F42] e  |  [G42] Short-term Capital Gains on Immovable property (1c - 1d)  |  [R42] A1e
[F43] f  |  [G43] In case of transfer of immovable property please furnish the following details (see note)
[G44] Sl. No.  |  [H44] Name of buyer  |  [I44] PAN of buyer  |  [J44] Aadhaar No. of buyer  |  [K44] Percentage share  |  [L44] Amount  |  [M44] Address of property  |  [N44] State  |  [O44] Pincode  |  [P44] Country Code  |  [Q44] Zip Code
[N45] (Select)  |  [P45] (select)
[N46] (Select)  |  [P46] (Select)
[N47] (Select)  |  [P47] (Select)
[E51] NOTE : Furnishing of PAN is mandatory, if the tax is deduced under section 194-IA or is quoted by bu
[F52] From Slump sale
[F53] ai  |  [G53] Fair market value as per Rule 11UAE(2)  |  [P53] 2ai
[F54] aii  |  [G54] Fair market value as per Rule 11UAE(3)  |  [P54] 2aii
[F55] aiii  |  [G55] Full value of consideration (higher of ai or aii)  |  [P55] 2aiii
[F56] b  |  [G56] Net worth of the under taking or division (6(e) of Form 3CEA)  |  [P56] 2b
[F57] c  |  [G57] Short term capital gains from slump sale (2aiii-2b)  |  [R57] A2c  |  [T57] AR
[D58] Short-term Capital Gains  |  [F58] (i) From sale of equity share or unit of equity oriented Mutual Fund (MF) or unit of a business trus
[F59] ia  |  [G59] Full value of consideration  |  [P59] 3ia
[F60] ib  |  [G60] Deductions under section 48
[G61] i  |  [H61] Cost of acquisition without indexation  |  [P61] bi
[G62] ii  |  [H62] Cost of Improvement without indexation  |  [P62] bii
[G63] iii  |  [H63] Expenditure wholly and exclusively in connection with transfer  |  [P63] biii
[G64] iv  |  [H64] Total ( i + ii + iii)  |  [P64] ibiv
[F65] ic  |  [G65] Balance (3ia – 3ibiv)  |  [P65] 3ic
[F66] id  |  [G66] Loss, if any, to be ignored under section 94(7) or 94(8) for example if asset bought/acquired within  |  [P66] 3id
[F67] ie  |  [G67] Short-term capital gain on equity share or equity oriented MF (STT paid) u/s 111A [for others] (3ic   |  [R67] A3ie  |  [T67] 15% & 20%
[F68] (ii) From sale of equity share or unit of equity oriented Mutual Fund (MF) on which STT is paid u/s 
[F69] iia  |  [G69] Full value of consideration  |  [P69] 3iia
[F70] iib  |  [G70] Deductions under section 48
[G71] i  |  [H71] Cost of acquisition without indexation  |  [P71] bi
[G72] ii  |  [H72] Cost of Improvement without indexation  |  [P72] bii
[G73] iii  |  [H73] Expenditure wholly and exclusively in connection with transfer  |  [P73] biii
[G74] iv  |  [H74] Total ( i + ii + iii)  |  [P74] iibiv
[F75] iic  |  [G75] Balance (3iia – 3iibiv)  |  [P75] 3iic
[F76] iid  |  [G76] Loss, if any, to be ignored under section 94(7) or 94(8) for example if asset bought/acquired within  |  [P76] 3iid
[F77] iie  |  [G77] Short-term capital gain on equity share or equity oriented MF (STT paid) u/s 115AD(1)(b)(ii) [for Fo  |  [R77] A3iie  |  [T77] 15% & 20%
[F98] From sale of assets other than at A1 or A2 or A3 or A4 or A5 above
[F99] a(i)  |  [G99] In case assets sold include shares of a company other than quoted shares, enter the following detail
[G100] a) Full value of consideration received/receivable in respect of unquoted shares  |  [P100] ia
[G101] b) Fair market value of unquoted shares determined in the prescribed manner  |  [P101] ib
[G102] c) Full value of consideration in respect of unquoted shares adopted as per section 50CA for the pur  |  [P102] ic
[F103] ii  |  [G103] Full value of consideration in respect of assets other than unquoted shares  |  [P103] ii
[F104] iii  |  [G104] Total (ic + ii)  |  [P104] aiii
[F105] b  |  [G105] Deductions under section 48
[G106] i  |  [H106] Cost of acquisition without indexation  |  [P106] bi
[G107] ii  |  [H107] Cost of Improvement without indexation  |  [P107] bii
[G108] iii  |  [H108] Expenditure wholly and exclusively in connection with transfer  |  [P108] biii
[G109] iv  |  [H109] Total (i + ii + iii)  |  [P109] biv
[F110] c  |  [G110] Balance (6aiii – biv)  |  [P110] 6c
[F111] d  |  [G111] In case of asset (security/unit)loss to be disallowed u/s 94(7) or 94(8)- for example if asset bough  |  [P111] 6d
[F112] e  |  [G112] Deemed short term capital gains on depreciable assets (6 of schedule- DCG)  |  [P112] 6e
[F113] fi  |  [G113] Deduction under section 54G (Specify details in item Dbelow)  |  [P113] fi
[F114] fii  |  [G114] Deduction under section 54GA (Specify details in item Dbelow)  |  [P114] fii
[F115] f  |  [G115] Total Deduction under section 54G/54GA  |  [P115] 6f
[F116] g  |  [G116] STCG on assets other than at A1 or A2 or A3 or A4 or A5 above (6c + 6d+6e - 6f)  |  [R116] A6g  |  [T116] AR
[F122] Amount deemed to be short-term capital gains
[E123] a  |  [F123] Whether any amount of unutilized capital gain on asset transferred during the previous years shown b  |  [S123] Not Applicable
[G124] Sl.  |  [H124] Previous year in which asset transferred  |  [I124] Section under which deduction claimed in that year  |  [J124] New asset acquired/constructed  |  [L124] Amount not used for new asset or remained unutilized in Capital gains account (X)
[J125] Previous Year in which asset acquired/constructed  |  [K125] Amount utilised out of Capital Gains account
[F126] i
[E131] b  |  [F131] Amount deemed to be short-term capital gains u/s 54D/54G/54GA, other than at ‘a’  |  [P131] 7b
[F132] iii  |  [G132] Total Amount deemed to be short term capital gains (aXi + aXii+aXiii + b)  |  [R132] A7  |  [T132] AR
[F134] Pass Through Income/ loss in the nature of Short Term Capital Gain, (Fill up schedule PTI) (A8a + A8  |  [R134] A8
[F136] a  |  [G136] Pass Through Income/ Loss in the nature of Short Term Capital Gain, chargeable @ 20%  |  [P136] 8a
[F137] b  |  [G137] Pass Through Income/ loss in the nature of Short Term Capital Gain, chargeable @ 30%  |  [P137] 8b
[F138] c  |  [G138] Pass Through Income/ loss in the nature of Short Term Capital Gain, chargeable at applicable rates  |  [P138] 8c  |  [T138] AR
[F139] Amount of STCG included in A1-A8 but claimed as not chargeable to tax or chargeable at special rates
[H140] Sl.  |  [I140] Amount of income (2)  |  [J140] Item No. A1 to A8 above in which included (3)  |  [K140] Country name, code (4)  |  [L140] Article of DTAA (5)  |  [M140] Rate as per Treaty (enter NIL, if not chargeable) (6)  |  [N140] Whether Tax Residency Certificate obtained? (7)  |  [O140] Section of I.T. Act (8)  |  [P140] Rate as per I.T. Act (9)  |  [Q140] Applicable rate [lower of (6) or (9)] (10)
[J141] (Select)  |  [K141] (select)  |  [N141] (Select)
[J142] (Select)  |  [K142] (select)  |  [N142] (Select)
[J143] (Select)  |  [K143] (select)  |  [N143] (Select)
[J144] (Select)  |  [K144] (select)  |  [N144] (Select)
[J145] (Select)  |  [K145] (select)  |  [N145] (Select)
[J146] (Select)  |  [K146] (select)  |  [N146] (Select)
[J147] (Select)  |  [K147] (select)  |  [N147] (Select)
[J148] (Select)  |  [K148] (select)  |  [N148] (Select)
[J149] (Select)  |  [K149] (select)  |  [N149] (Select)
[J150] (Select)  |  [K150] (select)  |  [N150] (Select)
[J151] (Select)  |  [K151] (select)  |  [N151] (Select)
[J152] (Select)  |  [K152] (select)  |  [N152] (Select)
[J153] (Select)  |  [K153] (Select)  |  [N153] (Select)
[G155] 9a  |  [H155] Total amount of STCG not claimed as chargeable to tax in India as per DTAA  |  [R155] A9a
[G156] 9b  |  [H156] Total amount of STCG claimed as chargeable to tax at special rates in India as per DTAA  |  [R156] A9b  |  [T156] DR
[E158] A(A)  |  [F158] Capital Loss on buy back of shares [Short term 20% or 30% or Applicable rate] (can be claimed only i  |  [R158] A(A)
[H159] Sl.  |  [I159] Rate  |  [M159] Amount  |  [Y159] For AY 2025-26 by Sai on 04_07_2025
[I160] (Select)
[I161] (Select)
[F163] Total Short-term Capital Gain (A1e+ A2c+ A3e+ A4a+ A4b+ A5e+ A6g+A7+A8-A9a +A(A))  |  [R163] A10
[D164] B  |  [E164] Long-term capital gain (LTCG) (Sub Items 5, 6, & 7 are not applicable for residents)
[F165] From sale of land or building or both (fill up details separately for each property) (from a to f)
[G166] Date of Purchase/Acquisition
[G167] Date of Sale/Transfer
[F168] a  |  [G168] i  |  [H168] Full value of consideration received/receivable  |  [P168] ai
[G169] ii  |  [H169] Value of property as per stamp valuation authority  |  [P169] aii
[G170] iii  |  [H170] Full value of consideration adopted as per section 50C for the purpose of Capital Gains [in case (ai  |  [P170] aiii
[F171] b  |  [G171] Deductions under section 48
[G172] bi  |  [H172] Cost of acquisition without indexation  |  [P172] bi
[G181] bii  |  [H181] Cost of Improvement without indexation  |  [P181] bii
[G182] biii  |  [H182] Expenditure wholly and exclusively in connection with transfer  |  [P182] biii
[G183] biv  |  [H183] Total (bi + bii + biii)  |  [P183] biv
[F184] c  |  [G184] Balance (aiii – biv)  |  [P184] 1c
[F185] di  |  [G185] Deduction under section 54D (Specify details in item D below)  |  [P185] di
[F186] dii  |  [G186] Deduction under section 54EC (Specify details in item D below)  |  [P186] dii
[F187] diii  |  [G187] Deduction under section 54G (Specify details in item D below)  |  [P187] diii
[F188] div  |  [G188] Deduction under section 54GA (Specify details in item D below)  |  [P188] div
[F189] d  |  [G189] Total Deduction under section 54D/54EC/54G/54GA (Specify details in item D below)  |  [P189] 1d
[F190] e  |  [G190] Long-term Capital Gains on Immovable property (1c - 1d)  |  [R190] B1e
[F191] f  |  [G191] In case of transfer of immovable property please furnish - the following details (see note)
[G192] Sl. No.  |  [H192] Name of Buyer(s)  |  [I192] PAN of Buyer  |  [J192] Aadhaar of buyer(s)  |  [K192] Percentage share  |  [L192] Amount  |  [M192] Address of Property  |  [N192] State  |  [O192] Pincode  |  [P192] Country Code  |  [Q192] Zip Code
[N193] (Select)  |  [P193] (select)
[N194] (Select)  |  [P194] (Select)
[E198] Note : Furnishing of PAN/aadhaar is mandatory, if the tax is deduced under section 194-IA or is quot
[E199] g  |  [F199] Total Long-term Capital Gains on Immovable property (ƩB1e)
[C202] CAPITAL GAINS  |  [F202] From Slump sale
[F203] ai  |  [G203] Fair market value as per Rule 11UAE(2)  |  [P203] 2ai
[F204] aii  |  [G204] Fair market value as per Rule 11UAE(3)  |  [P204] 2aii
[F205] aiii  |  [G205] Full value of consideration (higher of ai or aii)  |  [P205] 2aiii
[F206] b  |  [G206] Net worth of the under taking or division (6(e) of Form 3CEA)  |  [P206] 2b
[F207] c  |  [G207] Balance (2aiii - 2b)  |  [P207] 2c
[F208] d  |  [G208] Deduction u/s 54EC  |  [P208] 2di
[F211] e  |  [G211] Long term capital gains from slump sale (2c-2d)  |  [R211] B2e
[F224] From sale of listed securities (other than a unit) or zero coupon bonds as per section 112(1)
[F225] a  |  [G225] Full value of consideration  |  [P225] 3a
[F226] b  |  [G226] Deductions under section 48
[G228] ia  |  [H228] Cost of acquisition without indexation  |  [P228] bia
[G230] ii  |  [H230] Cost of improvement without indexation  |  [P230] bii
[G231] iii  |  [H231] Expenditure wholly and exclusively in connection with transfer  |  [P231] biii
[G232] iv  |  [H232] Total (bia +biia +biii)  |  [P232] biv
[F236] c  |  [G236] Long Term Capital Gains on assets at B3 (3a – biv)  |  [R236] B3c
[F256] From sale of equity share in a company or unit of equity oriented fund or unit of a business trust o
[F257] Long-term Capital Gains on sale of capital assets at B4 above (column 14 of Schedule 112A)  |  [R257] B4
[F329] From sale of assets where B1 to B7 above are not applicable
[F330] ai  |  [G330] In case assets sold include shares of a company other than quoted shares, enter the following detail
[G331] a) Full value of consideration received/receivable in respect of unquoted shares  |  [P331] ia
[G332] b) Fair market value of unquoted shares determined in the prescribed manner  |  [P332] ib
[G333] c) Full value of consideration in respect of unquoted shares adopted as per section 50CA for the pur  |  [P333] ic
[F334] ii  |  [G334] Full value of consideration in respect of assets other than unquoted shares  |  [P334] ii
[F335] iii  |  [G335] Total (ic + ii)  |  [P335] aiii
[F336] b  |  [G336] Deductions under section 48
[G337] i  |  [H337] Cost of acquisition without indexation  |  [P337] bi
[G338] ii  |  [H338] Cost of improvement without indexation  |  [P338] bii
[G339] iii  |  [H339] Expenditure wholly and exclusively in connection with transfer  |  [P339] biii
[G340] iv  |  [H340] Total (bi + bii +biii)  |  [P340] biv
[F341] c  |  [G341] Balance (8aiii – biv)  |  [P341] 8c
[F342] di  |  [G342] Deduction under sections 54D (Specify details in item D below)  |  [P342] di
[F345] dii  |  [G345] Deduction under sections 54G (Specify details in item D below)  |  [P345] dii
[F346] diii  |  [G346] Deduction under sections 54GA (Specify details in item D below)  |  [P346] diii
[F347] d  |  [G347] Deduction under sections 54D/54G/54GA (Specify details in item D below)  |  [P347] 8d
[F348] e  |  [G348] Long-term Capital Gains on assets at B8 above (8c-8d)  |  [R348] B8e
[F356] Amount deemed to be long-term capital gains
[E357] a  |  [F357] Whether any amount of unutilized capital gain on asset transferred during the previous year shown be  |  [S357] Yes
[G358] Sl.  |  [H358] Previous year in which asset transferred  |  [I358] Section under which deduction claimed in that year  |  [J358] New asset acquired/constructed  |  [L358] Amount not used for new asset or remained unutilized in Capital gains account (X)
[J359] Previous Year in which asset acquired/constructed  |  [K359] Amount utilised out of Capital Gains account
[F360] i
[E365] b  |  [F365] Amount deemed to be long-term capital gains, other than at ‘a’  |  [P365] 9b
[F368] Total Amount deemed to be long-term capital gains (aXi+aXii+aXiii +b)  |  [R368] B9
[F371] Pass Through Income/Loss in the nature of Long Term Capital Gain,(Fill up schedule PTI) (B10a1 + B10  |  [R371] B10
[F373] a1  |  [G373] Pass Through Income/ Loss in the nature of Long Term Capital Gain, chargeable @ 12.5% u/s 112A  |  [P373] 10a1
[F375] a2  |  [G375] Pass Through Income/ Loss in the nature of Long Term Capital Gain, chargeable @ 12.5% under section   |  [P375] 10a2
[F377] Amount of LTCG included in items B1 to B10 but claimed as not chargeable to tax or chargeable at spe
[G378] Sl.  |  [H378] Amount of income (2)  |  [I378] Item No. B1 to B10 above in which included (3)  |  [J378] Country name and code (4)  |  [K378] Article of DTAA (5)  |  [L378] Rate as per Treaty (enter NIL, if not chargeable) (6)  |  [M378] Whether Tax Residency Certificate obtained? (7)  |  [N378] Section of I.T. Act (8)  |  [O378] Rate as per I.T. Act (9)  |  [P378] Applicable rate [lower of (6) or (9)] (10)
[I379] (Select)  |  [J379] (select)  |  [M379] (Select)
[I380] (Select)  |  [J380] (Select)  |  [M380] (Select)
[I381] (Select)  |  [J381] (Select)  |  [M381] (Select)
[I382] (Select)  |  [J382] (Select)  |  [M382] (Select)
[G384] a  |  [H384] Total amount of LTCG claimed as not chargeable to tax in India as per DTAA  |  [R384] B11a
[G385] b  |  [H385] Total amount of LTCG claimed as chargeable to tax at special rates in India as per DTAA  |  [R385] B11b  |  [T385] DR
[E386] B(A)  |  [F386] Capital Loss on buy back of shares [Long Term 12.5%] (can be claimed only if respective Dividend inc  |  [R386] B(A)  |  [Y386] AY 2025-26_Sadineni_08_07_2025
[F391] Total long term capital gain B1g + B2e + B3c + B4 + B5 + B6c + B7 + B8e + B9 + B10 - B11a + B(A)  |  [R391] B12
[D392] C1  |  [E392] Sum of Capital Gain Incomes 8ii + 8iii + 8iv + 8v + 8vi + 8vii of table E below  |  [R392] C1
[D393] C2  |  [E393] Income from transfer of Virtual Digital Assets (Item No. B of Schedule VDA )  |  [R393] C2
[D394] C3  |  [E394] Income chargeable under the head “CAPITAL GAINS” (C1 + C2 )  |  [R394] C3
[D395] D  |  [E395] Information about deduction claimed against Capital Gains
[F396] In case of deduction under section 54D/54EC/54G/54GA give following details
[F402] a  |  [G402] Deduction claimed under section 54D
[G403] Sl. No.  |  [H403] Date of acquisition of original asset  |  [I403] Cost of purchase/ construction of new land or building for industrial undertaking  |  [J403] Date of purchase of new land or building  |  [K403] Amount deposited in Capital Gains Accounts Scheme before due date  |  [L403] Date of deposit  |  [M403] Account Number  |  [N403] IFS Code  |  [O403] Amount of deduction claimed
[G407] Total
[F408] b  |  [G408] Deduction claimed under section 54EC
[G409] Sl. No  |  [H409] Date of transfer of original asset  |  [I409] Amount invested in specified/notified bonds (not exceeding fifty lakh rupees)  |  [J409] Date of investment  |  [K409] Amount of deduction claimed
[G412] Total
[F418] c  |  [G418] Deduction claimed under section 54G
[G419] Sl. No.  |  [H419] Date of transfer of original asset from urban area  |  [I419] Cost and expenses incurred for purchase or construction of new asset  |  [J419] Date of purchase/construction of new asset in an area other than urban area  |  [K419] Amount deposited in Capital Gains Accounts Scheme before due date  |  [L419] Date of deposit  |  [M419] Account Number  |  [N419] IFS Code  |  [O419] Amount of deduction claimed
[G423] Total
[F424] d  |  [G424] Deduction claimed under section 54GA
[G425] Sl. No.  |  [H425] Date of transfer of original asset from urban area  |  [I425] Cost and expenses incurred for purchase or construction of new asset  |  [J425] Date of purchase/construction of new asset in SEZ  |  [K425] Amount deposited in Capital Gains Accounts Scheme before due date  |  [L425] Date of deposit  |  [M425] Account Number  |  [N425] IFS Code  |  [O425] Amount of deduction claimed
[G429] Total
[F430] e  |  [G430] Total deduction claimed (1a + 1b + 1c + 1d)  |  [N430] 1e
[D460] E  |  [E460] Set-off of current year capital losses with current year capital gains (excluding amounts included i
[E461] SL  |  [F461] Type of Capital Gain  |  [I461] Gain of current year (Fill this column only if computed figure is positive)  |  [J461] Short term capital loss set off  |  [N461] Long term capital loss set off  |  [P461] Current year's Capital Gains remaining after set-off 8=(1-2-3-4-5-6-7)
[L462] Applicable rates  |  [M462] DTAA rates  |  [O462] DTAA Rates
[E464] i  |  [F464] Loss to be set off (Fill this row if figure computed is negative) --->
[E465] ii  |  [F465] Short term capital gain
[E466] iii
[E467] iv  |  [H467] applicable rate
[E468] v  |  [H468] DTAA rate
[E469] vi  |  [F469] Long term capital gain
[E470] vii  |  [H470] DTAA rate
[E471] viii  |  [F471] Total loss set off ( ii + iii + iv + v + vi + vii )
[E472] ix  |  [F472] Loss remaining after set off (i – viii)
[D473] Do you want to edit the detail autopopulated above?
[E474] The figures of STCG in this table (A1e* etc.) are the amounts of STCG computed in respective column 
[E475] The figures of LTCG in this table (B1e* etc.) are the amounts of LTCG computed in respective column 
[D476] F  |  [E476] Information about accrual/receipt of capital gain
[F477] Type of Capital gain / Date  |  [M477] Upto 15/6 (i)  |  [O477] 16/6 to 15/9 (ii)  |  [Q477] 16/9 to 15/12 (iii)  |  [S477] 16/12 to 15/3 (iv)  |  [T477] 16/3 to 31/3 (v)
[F479] Short-term capital gains taxable at the rate of 20% Enter value from item 5vi of schedule BFLA, if a
[F480] Short-term capital gains taxable at the rate of 30% Enter value from item 5vii of schedule BFLA, if 
[F481] Short-term capital gains taxable at applicable rates Enter value from item 5viii of schedule BFLA, i
[F482] Short-term capital gains taxable at DTAA rates Enter value from item 5ix of schedule BFLA, if any.
[F484] Long- term capital gains taxable at the rate of 12.5% Enter value from item 5x of schedule BFLA, if 
[F486] Long- term capital gains taxable at the rate DTAA rates Enter value from item 5xi of schedule BFLA, 
[F488] Capital gains on transfer of Virtual Digital Asset taxable at the rate of 30% Enter value from item 
```
