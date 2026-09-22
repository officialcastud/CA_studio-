# The book of Schedule CG — ITR-7, A.Y. 2026-27

Read row by row from the utility's **Schedule CG** sheet (rows 3–501) and
confirmed against the CBDT ITR-7 schema block **ScheduleCG**. Nothing here is
invented; every heading, item letter and field is the department's own. This is
the single richest sheet in ITR-7 — capital gains under every head (short-term
and long-term, 111A / 112 / 112A / 115AD / VDA and the rest), the set-off matrix
and the exemption-deduction tables. A later section-builder will use **this book
as its sole input**, so every live-row label, every required schema leaf and
every dropdown value is reproduced in the appendices.

Where this book uses an "item" it is the sheet's own lettering (column R tag,
e.g. `A1e`, `B12`, `C3`) — the utility's numbering. The schema key for every
live row is given in its row; the complete leaf list is Appendix 3. **Appendix 4
reproduces every row of the sheet verbatim** (the source of every label here);
hidden rows are marked `H`.

ITR-7 is filed by trusts, institutions, political parties, colleges and the
other persons of sections 139(4A)–(4F). Its Schedule CG is nonetheless the full
company-grade schedule: the non-resident heads (A4, A5, B5, B6, B7) appear, the
land/building blocks are repeatable, and the rate buckets are the A.Y. 2026-27
set (short-term 20 % / 30 % / applicable / DTAA; long-term 12.5 % / DTAA).

---

## 1 · The shape of the schedule

Schedule CG has **six parts, A to F.**

| Part | What it is |
|---|---|
| **A** | **Short-term capital gains** — heads A1–A9, plus buy-back loss line A(A), total A10 |
| **B** | **Long-term capital gains** — heads B1–B11, plus buy-back loss line B(A), total B12 |
| **C** | **Income under the head** — C1 (from Table E), C2 (from Schedule VDA), C3 |
| **D** | **Information about deduction claimed** — one table per exemption section: 54D, 54EC, 54EE (hidden), 54G, 54GA |
| **E** | **Set-off of current-year capital losses** — the loss × gain matrix (§6). Two hidden legacy copies precede the live table. |
| **F** | **Accrual or receipt of capital gain** — the quarterly split, for interest under section 234C |

The sheet says at the top of A and B:
- **Short-term sub-items 4 and 5 are not applicable for residents** (row 4:
  "Short-term capital gain (Items 4 & 5 are not applicable for residents)").
- **Long-term sub-items 5, 6 and 7 are not applicable for residents** (row 188:
  "Long-term capital gain (LTCG) (Sub Items 5,6 &7 are not applicable for
  residents)").

**Section point:** the land/building heads carry deductions under **section
54G / 54GA** (shifting of an industrial undertaking out of an urban area / to a
SEZ) on the short-term side, and **54D / 54EC / 54G / 54GA** on the long-term
side — the `di`/`dii`/`diii`/`div` lines.

---

## 2 · Part A — Short-term capital gains, head by head

### A1 · From sale of land or building or both (rows 5–72)
*"fill up details separately for each property"* — the one **repeatable** head;
the sheet keeps a **"Number of blocks"** counter. Two blocks ship live (rows
5–26, 28–49); a third (rows 51–72) is hidden. Schema:
`ShortTermCapGain.SaleofLandBuild.SaleofLandBuildDtls[]`.

| Item | Label | Type | Schema key |
|---|---|---|---|
| — | Date of purchase/ acquisition | date DD/MM/YYYY | DateofPurchase |
| — | Date of sale/transfer | date | DateofSale |
| a i | Full value of consideration received/receivable | amount | FullConsideration |
| a ii | Value of property as per stamp valuation authority | amount | PropertyValuation |
| a iii | Full value of consideration adopted as per section 50C for the purpose of Capital Gains | computed | FullConsideration50C |
| b i | Cost of acquisition without indexation | amount | AquisitCost |
| b ii | Cost of Improvement without indexation | amount | ImproveCost |
| b iii | Expenditure wholly and exclusively in connection with transfer | amount | ExpOnTrans |
| b iv | Total (bi + bii + biii) | computed | TotalDedn |
| c | Balance (aiii – biv) | computed | Balance |
| di | Deduction under section 54G (Specify details in item D below) | amount | ExemptionOrDednUs54Dtls[].ExemptionSecCode / ExemptionAmount |
| dii | Deduction under section 54GA (Specify details in item D below) | amount | ExemptionOrDednUs54Dtls[] |
| d | Total Deduction under section 54G/54GA | computed | ExemptionGrandTotal |
| e | Short-term Capital Gains on Immovable property (1c − 1d) → **A1e** | computed | CapgainonAssets |
| f | Buyer table (see below) | table | TrnsfImmblPrprty.TrnsfImmblPrprtyDtls[] |

Row 17 (`di`, Deduction under section 54D) is **hidden**; the live deduction
lines are 54G and 54GA. `DateofPurchase` and `DateofSale` are **not required**
in the ITR-7 schema (see Appendix 3).

**f · Buyer table** (row 23 header; 3 rows shipped, addable): Sl. No. · Name of
Buyer (NameOfBuyer) · PAN of Buyer (PANofBuyer) · Aadhaar Number of Buyer(s)
(AaadhaarOfBuyer) · Percentage share (PercentageShare) · Amount (Amount) ·
Address of Property (AddressOfProperty) · State (StateCode, dropdown State) ·
Pin Code (PinCode) · Country Code (CountryCode, dropdown Country) · ZipCode.
**NOTE (row 75): "Furnishing of PAN is mandatory, if the tax is deducted under
section 194-IA or is quoted by buyer."**

### A2 · From Slump sale (rows 76–81)
Schema: `ShortTermCapGain.SlumpSaleInStcg`.

| Item | Label | Schema key |
|---|---|---|
| ai | Fair market value as per Rule 11UAE(2) | FMV11UAEii |
| aii | Fair market value as per Rule 11UAE(3) | FMV11UAEiii |
| aiii | Full value of consideration (higher of ai or aii) — computed | FullConsideration |
| b | Net worth of the under taking or division (6(e) of Form 3CEA) | NetWorthOfDivision |
| c | Short term capital gains from slump sale (2aiii − 2b) → **A2c** — computed | CapgainonAssets |

### A3 · STCG on equity share / equity-oriented MF / business-trust units, STT paid (rows 82–101)
Schema: `ShortTermCapGain.EquityMFonSTT[]` (array keyed by `MFSectionCode`), with
`EquityMFonSTTDtls`. Tag T67/T77 = "15% & 20%".

**(i)** From sale of equity share or unit of equity-oriented MF / business-trust
unit u/s 111A (rows 82–91): ia Full value of consideration (FullConsideration) ·
ib Deductions under section 48 → i Cost of acquisition without indexation
(AquisitCost), ii Cost of Improvement without indexation (ImproveCost), iii
Expenditure wholly and exclusively in connection with transfer (ExpOnTrans), iv
Total (i + ii + iii) (TotalDedn) · ic Balance (3ia − 3ibiv) (BalanceCG) · id
Loss, if any, to be ignored under section 94(7) or 94(8) (LossSec94of7Or94of8) ·
ie Short-term capital gain on equity share or equity oriented MF (STT paid)
(3ic + 3id) → **A3ie** (CapgainonAssets).

**(ii)** From sale of equity share or unit of equity-oriented MF on which STT is
paid u/s 115AD(1)(b)(ii) [for FII] (rows 92–101): same eight fields iia–iie →
**A3iie**. Same schema shape, second array element.

### A4 · For NON-RESIDENT, not being an FII — shares/debentures of an Indian company (rows 102–106)
First proviso to section 48 (forex adjustment). Schema:
`ShortTermCapGain.NRITransacSec48Dtl`.

| Item | Label | Schema key |
|---|---|---|
| a | STCG on transactions covered u/s 111A → **A4a** | NRItaxSTTPaid |
| b | STCG from sale of shares not covered in sl.no. 4a or sale of debentures → **A4b** | NRItaxSTTNotPaid |

Row 103 (a) and row 104 (ai, "Where the transfer was before 23rd July 2024") are
**hidden**; the live lines are 105 (a) and 106 (b).

### A5 · For NON-RESIDENTS — securities (other than A3) by an FII u/s 115AD (rows 107–121)
Schema: `ShortTermCapGain.NRISecur115AD`. Carries the unquoted-share working:
a(i)a Full value of consideration received/receivable in respect of unquoted
shares (FullValueConsdRecvUnqshr) · a(i)b Fair market value of unquoted shares
determined in the prescribed manner (FairMrktValueUnqshr) · a(i)c Full value of
consideration in respect of unquoted shares adopted as per section 50CA
(FullValueConsdSec50CA) · ii Full value of consideration in respect of
securities other than unquoted shares (FullValueConsdOthUnqshr) · iii Total
(ic + ii) (FullConsideration) · b Deductions under section 48 i–iv
(AquisitCost / ImproveCost / ExpOnTrans / TotalDedn) · c Balance (5aiii − biv)
(BalanceCG) · d Loss to be disallowed u/s 94(7) or 94(8) (LossSec94of7Or94of8) ·
e Short-term capital gain on sale of securities (other than those at A3 above)
by an FII (5c + 5d) → **A5e** (CapgainonAssets).

### A6 · From sale of assets other than at A1–A5 (rows 122–142)
The general short-term head. Schema: `ShortTermCapGain.SaleOnOtherAssets`. Same
unquoted-share + section-48 working as A5: a(i)a/b/c
(FullValueConsdRecvUnqshr / FairMrktValueUnqshr / FullValueConsdSec50CA), ii
other assets (FullValueConsdOthUnqshr), iii Total (FullConsideration), b
Deductions under section 48 i–iv (DeductSec48.*), c Balance (6aiii − biv)
(BalanceCG), d In case of asset (security/unit) loss to be disallowed u/s
94(7) or 94(8) (LossSec94of7Or94of8), **plus**: e Deemed short term capital gains
on depreciable assets (DeemedSTCGDeprAsset) · fi Deduction under section 54G ·
fii Deduction under section 54GA · f Total Deduction under section 54G/54GA
(ExemptionOrDednUs54) · g STCG on assets other than at A1–A5 (6c + 6d + 6e − 6f)
→ **A6g** (CapgainonAssets). Row 129 (`a` Full value of consideration) and row
138 (`fi` Deduction under section 54D) are **hidden**.

### A7 · Amount deemed to be short-term capital gains (rows 143–152)
Two parts. **a** (rows 144–149): unutilised capital gain of an earlier year kept
in a Capital Gains Account Scheme, now deemed income — table: Previous year in
which asset transferred · Section under which deduction claimed in that year
(dropdown 54G/54GA) · New asset acquired/constructed — Previous year in which
asset acquired/constructed · Amount utilised out of Capital Gains account ·
Amount not used for new asset or remained unutilized in Capital gains account
(X). Schema: `UnutilizedCg.UnutilizedCgPrvYrDtls[]` (PrvYrInWhichAsstTrnsfrd,
SectionClmd, YrInWhichAssetAcq, AmtUtilized, AmtUnutilized). Row 144 flag ("No"),
schema `UnutilizedStcgFlag`. **b** (row 151): Amount deemed to be short term
capital gains u/s 54G/54GA, other than at 'a' (`AmtDeemedStcg`). Total row 152
(Xi + Xii + Xiii + b) → **A7** (`TotalAmtDeemedStcg`).

### A8 · Pass-through income/loss in the nature of STCG (rows 154–159)
Fill up Schedule PTI. Total row 154 → **A8** (`PassThrIncNatureSTCG`). Live
rate slots: a @20% (PassThrIncNatureSTCG20Per), b @30%
(PassThrIncNatureSTCG30Per), c at applicable rates (PassThrIncNatureSTCGAppRate).
Rows 155–156 (the two @15% slots) are **hidden**.

### A9 · STCG included in A1–A8 but claimed not chargeable / at special rate under a DTAA (rows 160–168)
Table (row 161), schema `NRICgDTAA.NRIDTAADtls[]`: Sl. No. · Amount of income
(DTAAamt) · Item No. A1 to A8 above in which included (ItemNoincl, dropdown
STCG_Dropdown) · Country name, code (CountryName / CountryCodeExcludingIndia,
dropdown Country) · Article of DTAA (DTAAarticle) · Rate as per Treaty (enter
NIL, if not chargeable) (RateAsPerTreaty) · Whether Tax Residency Certificate
obtained? (TaxRescertifiedFlag, Yes/No) · Section of I.T. Act (SecITAct) · Rate
as per I.T. Act (RateAsPerITAct) · Applicable rate [lower of (6) or (9)]
(ApplicableRate). Totals: 9a Total amount of STCG claimed as not chargeable to
tax in India as per DTAA (`TotalAmtNotTaxUsDTAAStcg`), 9b Total amount of STCG
claimed as chargeable to tax at special rates in India as per DTAA
(`TotalAmtTaxUsDTAAStcg`).

### A(A) · Capital Loss on buy back of shares [Short Term 20% / 30% / Applicable rate] (rows 182–185)
*Can be claimed only if the corresponding dividend is offered in Schedule OS.*
Rate dropdown (Sl.No. / Rate / Amount), 2 rows. Schema
`CapitalLossBuyBackShares` (CapitalLossBuyBackSharesDtls[] Rate/Amount;
TotalCapitalLossBuyBackShares).

### A10 · Total Short-term Capital Gain (row 187)
`A1e + A2c + A3e + A4a + A4b + A5e + A6g + A7 + A8 − A9a + A(A)` → **A10**
(`TotalSTCG`) — computed.

---

## 3 · Part B — Long-term capital gains, head by head

### B1 · From sale of land or building or both (rows 189–217)
**Repeatable**, one block per property. Schema:
`LongTermCapGain.SaleofLandBuild.SaleofLandBuildDtls[]`. Note the
cost-of-improvement leaf is **nested** here:
`SaleofLandBuildDtls[].CostOfImprovements.ImproveCost`.

| Item | Label | Schema key |
|---|---|---|
| — | Date of purchase/ acquisition · Date of sale/transfer | DateofPurchase / DateofSale |
| a i / ii / iii | Full value of consideration · Value as per stamp valuation authority · section-50C value | FullConsideration / PropertyValuation / FullConsideration50C |
| b i | Cost of acquisition without indexation | AquisitCost |
| b ii | Cost of improvement without indexation | CostOfImprovements.ImproveCost |
| b iii | Expenditure wholly and exclusively in connection with transfer | ExpOnTrans |
| b iv | Total (bi + bii + biii) | TotalDedn |
| c | Balance (aiii − biv) | Balance |
| di | Deduction under section 54D | ExemptionOrDednUs54Dtls[] |
| dii | Deduction under section 54EC | ExemptionOrDednUs54Dtls[] |
| diii | Deduction under section 54G | ExemptionOrDednUs54Dtls[] |
| div | Deduction under section 54GA | ExemptionOrDednUs54Dtls[] |
| d | Deduction under section 54D/54EC/54G/54GA | ExemptionGrandTotal |
| e | Long-term Capital Gains on Immovable property (1c − 1d) → **B1e** | CapgainonAssets |
| f | Buyer table (as A1) | TrnsfImmblPrprty.TrnsfImmblPrprtyDtls[] |
| g | Total Long-term Capital Gains on Immovable property (ΣB1e) → **B1g** | TotalLTCGImmblPrprty |

Note row 214: "Furnishing of PAN/aadhaar is mandatory, if the tax is deducted
under section 194-IA or is quoted." Rows 215–216 (the g split "where transfer
was — Before 23rd July 2024") are **hidden**; the live total is row 217.

### B2 · From Slump sale (rows 218–226)
Schema: `LongTermCapGain.SlumpSaleInLtcgDtls.SlumpSaleInLtcg`. ai/aii
11UAE(2)/(3) (FMV11UAEii / FMV11UAEiii) · aiii Full value of consideration
(higher of ai or aii) (FullConsideration) · b Net worth of the under taking or
division (6(e) of Form 3CEA) (NetWorthOfDivision) · c Balance (2aiii − 2b)
(SlumpBalance) · d Deduction u/s 54EC (DeductionUnderSec54) · e Long term capital
gains from slump sale (2c − 2d) → **B2e** (CapgainonAssets). Row 225 (dii,
Deduction u/s 54EE) is **hidden**.

### B3 · Listed securities / zero-coupon bonds u/s 112(1) (rows 229–248)
Row 229 ("For residents, from sale of unlisted bonds or unlisted debenture") and
the whole block 229–236 is **hidden**. The live block is row 237 onward: "From
sale of listed securities (other than a unit) or zero coupon bonds as per sec
112(1)": a Full value of consideration (row 238) · b Deductions under section 48
— i Cost of acquisition with indexation (row 240, hidden) / i Cost of acquisition
without indexation (row 241), ii Cost of improvement with indexation (row 242,
hidden) / ii Cost of improvement without indexation (row 243), iii Expenditure
(row 244), iv Total (bi + bii + biii) (row 245) · c Long-term Capital Gains on
assets at B3 (3a − biv) → **B3c** (row 248). Schema:
`LongTermCapGain.Proviso112Applicable` (Proviso112SectionCode;
Proviso112Applicabledtls.FullConsideration / DeductSec48.* / BalanceCG). The
indexation working (rows 240, 242, 246–247) is hidden.

### B4 · Equity share / equity-oriented fund / business-trust units u/s 112A (rows 249–258)
Fed from **Schedule 112A**. Row 255 header "From sale of equity share in a
company or unit of equity oriented fund or unit of a business trust"; row 258
"Long Term Capital Gains on assets at B4" → **B4**. Schema:
`LongTermCapGain.SaleOfEquityShareUs112A.SaleOfEquityShareUs112AAmt`. The
before/after-23-July and 112(1) tax working (rows 249, 251–254, 256–257) is
hidden.

### B5 · NON-RESIDENTS — unlisted shares or listed debenture (rows 259–263)
LTCG computed without indexation benefit; three-way split (listed debentures
before 23 July / other before / on-or-after). Row 259 header; rows 260–262
hidden; row 263 "LTCG computed without indexation benefit on unlisted shares or
listed debentures" → **B5**. Schema: `LongTermCapGain.NRIProvisoSec48.BalanceCG`.

### B6 · NON-RESIDENTS — four sub-heads (rows 264–322)
(i) unlisted securities as per sec. 112(1)(c) (rows 264–276) → **B6ic**;
(ii) units referred in sec. 115AB (rows 279–291) → **B6iic**;
(iii) bonds or GDR as referred in sec. 115AC (rows 294–306) → **B6iiic**;
(iv) securities by FII as referred to in sec. 115AD (rows 309–321) → **B6ivc**.
Each is the full unquoted-share (Full value of consideration received/receivable
in respect of unquoted shares · Fair market value of unquoted shares · Full value
adopted as per section 50CA · Full value in respect of assets other than unquoted
shares · Total) + section-48 (Cost of acquisition / Cost of improvement /
Expenditure / Total) block, ending in Long-term Capital Gains on assets at 6
above in case of NON-RESIDENT (aiii − biv). Row 322 = total. Schema:
`LongTermCapGain.NRIOnSec112and115.NRIOnSec112and115Dtls[]` (SectionCode; the
unquoted-share fields; DeductSec48.*; BalanceCG; TotalNRIOnSec112and115).

### B7 · FII/FPI (NON-RESIDENTS) — equity u/s 112A r.w. 115AD (rows 324–327)
Row 324 header "For FII/FPI NON-RESIDENTS - From sale of equity share in a
company or unit of equity oriented fund"; row 327 "Long-Term capital gains on
sale of capital assets at B7" → **B7**. Rows 325–326 hidden. Schema:
`LongTermCapGain.NRISaleOfEquityShareUs112A.NRISaleOfEquityShareUs112AAmt`.

### B8 · From sale of assets where B1–B7 are not applicable (rows 328–345)
The general long-term head. Schema:
`LongTermCapGain.SaleofAssetNADtls.SaleofAssetNA`. Unquoted-share working (ai
a/b/c: FullValueConsdRecvUnqshr / FairMrktValueUnqshr / FullValueConsdSec50CA),
ii Full value of consideration in respect of assets other than unquoted shares
(FullValueConsdOthUnqshr), iii Total (ic + ii) (FullConsideration), b Deductions
under section 48 (DeductSec48.*), c Balance (8aiii − biv) (BalanceCG), di
Deduction under sections 54D / dii 54G / diii 54GA (ExemptionOrDednUs54Dtls[]),
d Deduction under sections 54D/54G/54GA (ExemptionGrandTotal), e Long-term
Capital Gains on assets at B8 above (8c − 8d) → **B8e** (CapgainonAssets).

### B9 · Amount deemed to be long-term capital gains (rows 346–370)
Rows 346–357 (deemed LTCG under sections 54/54B/54D/54EC/54F/54G/54GA/54GB/115F)
are **hidden**. The live block: row 358 "Amount deemed to be long-term capital
gains". **a** (rows 359–363): unutilised gain of an earlier year in a CGAS now
deemed — flag row 359 ("No", `UnutilizedLtcgFlag`); table (Previous year in which
asset transferred / Section under which deduction claimed / New asset
acquired/constructed — Previous year in which asset acquired/constructed / Amount
utilized out of Capital Gains account / Amount not used or remained unutilized
(X)) → `UnutilizedCg.UnutilizedCgPrvYrDtls[]`. **b** (row 367): Amount deemed to
be long-term capital gains, other than at 'a' (`AmtDeemedLtcg`). Total row 370
(aXi + aXii + aXiii + b) → **B9** (`TotalAmtDeemedLtcg`).

### B10 · Pass-through income/loss in the nature of LTCG (rows 371–376)
Fill up Schedule PTI. Total row 371 → **B10** (`PassThrIncNatureLTCG`). Live
slots: a1 @12.5% u/s 112A (PassThrIncNatureLTCGUs112A12_5Per), a2 @12.5% other
than u/s 112A (PassThrIncNatureLTCG12_5Per). Rows 372 (a1(i) @10% u/s 112A), 374
(a2(i) @10% other), 376 (b @20%) are **hidden**.

### B11 · LTCG in B1–B10 claimed not chargeable / at special rate under a DTAA (rows 377–385)
Table (row 378), schema `NRICgDTAA.NRIDTAADtls[]` (same ten columns as A9; Item
No. B1 to B10 above in which included; dropdown LTCG_DropDown). Totals: B11a
Total amount of LTCG claimed as not chargeable to tax in India as per DTAA
(`TotalAmtNotTaxUsDTAALtcg`), B11b Total amount of LTCG claimed as chargeable to
tax at special rates in India as per DTAA (`TotalAmtTaxUsDTAALtcg`). Rows
386–390 (the alternate DTAA table) are **hidden**.

### B(A) · Capital Loss on buy back of shares (Long Term 12.5%) (rows 391–393)
Same rule as A(A); claimable only if the respective dividend income is offered.
Schema `CapitalLossBuyBackShares.TotalCapitalLossBuyBackShares`. The rate table
(rows 392–393) is hidden; the sole dropdown value is "Loss from buy back of
'shares taxable at 12.5%'".

### B12 · Total long-term capital gain (row 396)
`B1g + B2e + B3c + B4 + B5 + B6c + B7 + B8e + B9e + B10 − B11a + B(A)` → **B12**
(`TotalLTCG`) — computed.

---

## 4 · Part C — Income under the head (rows 397–399)

| Item | Label | Schema key |
|---|---|---|
| C1 | Sum of Capital Gain Incomes 8ii + 8iii + 8iv + 8v + 8vi + 8vii of table E below | SumOfCGIncm |
| C2 | Income from transfer of Virtual Digital Assets (Item No. B of Schedule VDA) | IncmFromVDATrnsf |
| C3 | Income chargeable under the head "CAPITAL GAINS" (C1 + C2) | IncChargeableHeadCapGain |

C1 is the sum of the **remaining-after-set-off** column of Table E for each
gain-type row (ii–vii) — after the loss set-off, not before. C2 is the
capital-gain VDA total from Schedule VDA item B.

---

## 5 · Part D — Information about deduction claimed (rows 400–439)

*"In case of deduction u/s 54D/54EC/54G/54GA give following details."* One table
per section, addable, each with a Total. Every date is `DD/MM/YYYY`. Schema:
`DeducClaimInfo`.

| Section (row) | Columns | Schema |
|---|---|---|
| 54D — a (rows 402–406) | Sl. No · Date of acquisition of original asset · Cost of purchase/ construction of new land or building for industrial undertaking · Date of purchase of new land or building · Amount deposited in Capital Gains Accounts Scheme before due date · Date of Deposit · Account Number · IFS Code · Amount of deduction claimed · Total | DeducClaimDtlsUs54D[] (DateofAcquisition, CostofNewLandBuilding, DateofPurchase, AmtDeposited, DepositDate, AccountNo, IFSC, AmtDeducted) |
| 54EC — b (rows 407–411) | Sl. No · Date of transfer of original asset · Amount invested in specified/notified bonds (not exceeding fifty lakh rupees) · Date of investment · Amount of deduction claimed · Total | DeducClaimDtlsUs54EC[] (DateofTransfer, AmtInvested, DateofInvestment, AmtDeducted) |
| 54EE — e (rows 412–416, **hidden**) | Sl. No · Date of transfer of original asset · Amount invested in specified assets · Date of investment · Amount of deduction claimed · Total | (54EE branch — hidden) |
| 54G — c (rows 417–421) | Sl. No · Date of transfer of original asset from urban area · Cost and expenses incurred for purchase or construction of new asset · Date of purchase/construction of new asset in an area other than urban area · Amount deposited in Capital Gains Accounts Scheme before due date · Date of Deposit · Account Number · IFS Code · Amount of deduction claimed · Total | DeducClaimDtlsUs54G[] (DateofTransfer, CostofNewAsset, DateofPurchase, AmtDeposited, DepositDate, AccountNo, IFSC, AmtDeducted) |
| 54GA — d (rows 422–426) | Sl. No · Date of transfer of original asset from urban area · Cost and expenses incurred for purchase or construction of new asset · Date of purchase/construction of new asset in SEZ · Amount deposited in Capital Gains Accounts Scheme before due date · Date of Deposit · Account Number · IFS Code · Amount of deduction claimed · Total | DeducClaimDtlsUs54GA[] (DateofTransfer, CostofNewAsset, DateofPurchase, AmtDeposited, DepositDate, AccountNo, IFSC, AmtDeducted) |
| deemed table (rows 427–435, **hidden**) | Section (dropdown 54/54B/54D/54EC/54EE/54F/54G/54GA/54GB/115F) · Amount of Deduction · Cost of New Asset · Date of its acquisition/ construction · Amount deposited in Capital Gains Accounts Scheme before due date | (hidden) |
| 1e (row 439) | Total deduction claimed (1a + 1b + 1c + 1d) | TotDeductClaim |

---

## 6 · Part E — Set-off of current-year capital losses (the rate buckets)

**This is the part the brief flags — read it carefully.** The sheet ships THREE
copies of Table E. Two are **hidden** legacy versions: rows 440–454 and rows
456(header live)/457–472. The **live** table is the third, at rows 474–485 (its
header/edit-flag rows 456 and 486 are live). The live buckets are the A.Y.
2026-27 set.

Live header (rows 474–475): SL.No · Type of Capital Gain · Gain of current year
(Fill this column only if computed figure is positive) · **Short term capital
loss set off** (Applicable rate + DTAA rates columns, plus the 20 %/30 % columns)
· **Long term capital loss set off** (12.5 % + DTAA rates) · Current year's
capital gains remaining after set off `8=(1-2-3-4-5-6-7)`.

**The six loss columns (columns 2–7) — from the schema `CurrYrLosses` keys:**

| Loss bucket | Schema key |
|---|---|
| Short-term loss @ **20%** | StclSetoff20Per |
| Short-term loss @ **30%** | StclSetoff30Per |
| Short-term loss @ **applicable rate** | StclSetoffAppRate |
| Short-term loss @ **DTAA rate** | StclSetoffDTAARate |
| Long-term loss @ **12.5%** | LtclSetOff12_5Per |
| Long-term loss @ **DTAA rate** | LtclSetOffDTAARate |

So the ITR-7 buckets are **short-term { 20 %, 30 %, applicable rate, DTAA rate }**
and **long-term { 12.5 %, DTAA rate }**. There is **no separate 15 %, 10 % or
20 % long-term column** on the live table — those are the hidden legacy copies.

**The rows (gain types) — schema `CurrYrLosses.*`:**

| Row | Type of Capital Gain | Schema branch |
|---|---|---|
| i (477) | Capital Loss to be set off (Fill this row only if computed figure is negative) | InLossSetOff (StclSetoff20Per, StclSetoff30Per, StclSetoffAppRate, StclSetoffDTAARate, LtclSetOff12_5Per, LtclSetOffDTAARate) |
| ii (478) | Short term capital gain @ 20% | InStcg20Per (CurrYearIncome; StclSetoff30Per/AppRate/DTAARate; CurrYrCapGain) |
| iii (479) | Short term capital gain @ 30% | InStcg30Per (CurrYearIncome; StclSetoff20Per/AppRate/DTAARate; CurrYrCapGain) |
| iv (480) | Short term capital gain @ applicable rate | InStcgAppRate (CurrYearIncome; StclSetoff20Per/30Per/DTAARate; CurrYrCapGain) |
| v (481) | Short term capital gain @ DTAA rates | InStcgDTAARate (CurrYearIncome; StclSetoff20Per/30Per/AppRate; CurrYrCapGain) |
| vi (482) | Long term capital gain @ 12.5% | InLtcg12_5Per (CurrYearIncome; StclSetoff20Per/30Per/AppRate/DTAARate; LtclSetOffDTAARate; CurrYrCapGain) |
| vii (483) | Long term capital gain @ DTAA rate | InLtcgDTAARate (CurrYearIncome; StclSetoff20Per/30Per/AppRate/DTAARate; LtclSetOff12_5Per; CurrYrCapGain) |
| viii (484) | Total loss set off (ii + iii + iv + v + vi + vii) | TotLossSetOff (six per-bucket keys) |
| ix (485) | Loss remaining after set off (i − viii) | LossRemainSetOff (six per-bucket keys) |

The rule the matrix enforces: a **short-term loss** may be set against any
capital gain (short or long); a **long-term loss** only against a long-term gain;
nothing against its own slot. Row 486 carries the override switch **"Do you want
to edit the detail autopopulated above?"** (`EditAutopoulatedDetail`).

C1 (Part C) = Σ of the **CurrYrCapGain** (remaining-after-set-off) over rows
ii–vii.

---

## 7 · Part F — Accrual or receipt of capital gain (rows 489–501)

Five date columns (row 490): Upto 15/6 (i) · 16/6 to 15/9 (ii) · 16/9 to 15/12
(iii) · 16/12 to 15/3 (iv) · 16/3 to 31/3 (v). Schema:
`AccruOrRecOfCG.<bucket>.DateRange.{Upto15Of6, Up16Of6To15Of9, Up16Of9To15Of12,
Up16Of12To15Of3, Up16Of3To31Of3}`. Each row is the **post-set-off** figure. The
live rows match the Table-E buckets (the 15 %, 10 % and 20 % rows are hidden):

| Row | Rate bucket | Schema bucket |
|---|---|---|
| 491 (hidden) | Short-term @ 15% | — |
| 492 | Short-term capital gains taxable at the rate of 20% | ShortTermUnder20Per |
| 493 | Short-term capital gains taxable at the rate of 30% | ShortTermUnder30Per |
| 494 | Short-term capital gains taxable at applicable rates | ShortTermUnderAppRate |
| 495 | Short-term capital gains taxable at DTAA rates | ShortTermUnderDTAARate |
| 496 (hidden) | Long-term @ 10% | — |
| 497 | Long-term capital gains taxable at the rate of 12.5% | LongTermUnder12_5Per |
| 498 (hidden) | Long-term @ 20% | — |
| 499 | Long-term capital gains taxable at the DTAA rates | LongTermUnderDTAARate |
| 501 | Capital gains on transfer of Virtual Digital Asset taxable at the rate of 30% | VDATrnsfGainsUnder30Per |

Row 500 (hidden NOTE): "Please include the income of the specified persons
referred to in Schedule SPI while computing the income." Rows 491–492 carry stray
column-R annotations in the source ("Maramreddy Konda Reddy", "is calling you") —
reproduced verbatim in Appendix 4, ignored as content.

---

## 8 · What repeats and what is one figure

| Head | Repeatable? |
|---|---|
| A1 / B1 — land or building | **Yes, unlimited** — one block per property ("Number of blocks") |
| Buyer table inside each land block | 3 rows shipped, addable |
| A2/B2 slump sale; A3, A5, A6, B2, B3, B8 — other heads | No — one aggregate block each |
| B4 — 112A equity | fed from Schedule 112A |
| B7 — FII 112A equity | fed from Schedule 115AD proviso |
| A7a/B9a — unutilised CGAS | table, rows addable |
| A9/B11 — DTAA claims | table, rows addable |
| A(A)/B(A) — buy-back loss | 2 rows |
| Part D — each exemption section | rows addable |

Only land/building is entered property by property; every other head is a single
aggregate block.

---

## 9 · Cross-sheet feeds

**In:** B4 ← Schedule 112A; B7 ← Schedule 115AD proviso; A6e/A8/B10 ← Schedule
PTI (pass-through); C2 ← Schedule VDA item B; Table E ← the loss-adjustment
helper; Table F ← Schedule BFLA / Schedule SI (VDA @30%).
**Out:** C3 (IncChargeableHeadCapGain) → Part B-TI; the Table-E remaining figures
and the rate buckets → Schedule CYLA / BFLA → Schedule SI (special-rate tax) and
Part B; Table F → interest u/s 234C.

---

## 10 · Notes on ITR-7 specifics and source inconsistencies

- **LTCG land cost-of-improvement is nested** —
  `LongTermCapGain.SaleofLandBuild.SaleofLandBuildDtls[].CostOfImprovements.ImproveCost`
  — whereas the STCG land block keeps a flat `ImproveCost`. Booked as read.
- **112A amounts use their own leaf names**: B4 =
  `SaleOfEquityShareUs112A.SaleOfEquityShareUs112AAmt`; B7 =
  `NRISaleOfEquityShareUs112A.NRISaleOfEquityShareUs112AAmt` (not
  `CapgainonAssets`).
- `DateofPurchase` / `DateofSale` on both land blocks, and
  `InLtcgDTAARate.CurrYearIncome`, are **not** marked required in the schema.
- The live Table-E buckets (20 / 30 / app / DTAA short, 12.5 / DTAA long) differ
  from the two hidden legacy tables. The schema `CurrYrLosses` keys match the
  **live** table; the legacy tables are hidden and not built.
- Rows 491–492 contain stray annotations in column R (a name and "is calling
  you"); these are not part of the return and carry no schema key.

---

## Appendix 1 · Every dropdown on the sheet, with all its values

Reproduced verbatim from the utility's data-validation lists. The **first value
of every enumerated dropdown is `(Select)`.** Formula-driven DTAA-section
dropdowns (STCG_DTTA_Dropdown / _Res at I162:I163, LTCG_DTTA_Dropdown / _RES at
I379:I380) resolve at runtime and carry no enumerated list in the source.

### Item No. A1–A8 dropdown (A9 table, K171:K172 — STCG_Dropdown)
`(Select)` · A1e · A2c · A3ie · A3iie · A4a · A4b · A5e · A6g · A7 · A8a · A8b · A8c

### Item No. B1–B10 dropdown (B11 table, K387:K388 — LTCG_DropDown)
`(Select)` · B1e · B2e · B3e · B4ie · B5c · B6c · B7ie · B7iie · B7iiie · B7ive · B8c · B9e · B10 · B11(a)i · B11(a)(ii) · B11(b) · B11(a)(ii)

### Whether Tax Residency Certificate obtained? — Yes / No (J171:J172, M162:M163, M379:M380, J387:J388)
`(Select)` · Yes · No

### Unutilised-CGAS flag — Yes / No / Not Applicable (rows 144, 359 — P144:Q144, P359:Q359)
`(Select)` · Yes · No · Not Applicable

### Section under which deduction claimed — B9a table (I362:I363)
`(Select)` · 54D · 54G · 54GA

### Section under which deduction claimed — A7a table (I147:I149)
`(Select)` · 54G · 54GA

### Deemed-deduction section — hidden Part-D table (H428:H435)
`(Select)` · 54 · 54B · 54D · 54EC · 54EE · 54F · 54G · 54GA · 54GB · 115F

### Previous year in which asset transferred — A7a, 4-year (J147:J149)
`(Select)` · 2022-23 · 2023-24 · 2024-25 · 2025-26

### Previous year in which asset transferred — 3-year (H147:H149, H362:H363)
`(Select)` · 2022-23 · 2023-24 · 2024-25

### Previous year in which asset acquired/constructed — B9a (J362:J363)
`(Select)` · 2023-24 · 2024-25 · 2025-26

### Buy-back loss type — Short term (A(A), H184:K185)
`(Select)` · i. Loss from buy back of 'shares taxable at 20%' · ii. Loss from buy back of 'shares taxable at 30%' · iii. Loss from buy back of 'shares taxable at applicable rate'

### Buy-back loss type — Long term (B(A), I393:L393)
`(Select)` · Loss from buy back of 'shares taxable at 12.5%'

### State code (buyer table, StateCode — source "State", 38 values)
```
(Select) | 01-ANDAMAN AND NICOBAR ISLANDS | 02-ANDHRA PRADESH | 03-ARUNACHAL PRADESH | 04-ASSAM | 05-BIHAR | 06-CHANDIGARH | 07-DADRA NAGAR AND HAVELI | 08-DAMAN AND DIU | 09-DELHI | 10-GOA | 11-GUJARAT | 12-HARYANA | 13-HIMACHAL PRADESH | 14-JAMMU AND KASHMIR | 15-KARNATAKA | 16-KERALA | 17-LAKHSWADEEP | 18-MADHYA PRADESH | 19-MAHARASHTRA | 20-MANIPUR | 21-MEGHALAYA | 22-MIZORAM | 23-NAGALAND | 24-ODISHA | 25-PUDUCHERRY | 26-PUNJAB | 27-RAJASTHAN | 28-SIKKIM | 29-TAMILNADU | 30-TRIPURA | 31-UTTAR PRADESH | 32-WEST BENGAL | 33-CHHATISHGARH | 34-UTTARAKHAND | 35-JHARKHAND | 36-TELANGANA | 37-LADAKH | 99-FOREIGN
```

### Country code (buyer Country Code & DTAA Country name/code — source "Country", 251 values)
```
(Select) | 93-AFGHANISTAN | 1001-ALAND ISLANDS | 355-ALBANIA | 213-ALGERIA | 684-AMERICAN SAMOA | 376-ANDORRA | 244-ANGOLA | 1264-ANGUILLA | 1010-ANTARCTICA | 1268-ANTIGUA AND BARBUDA | 54-ARGENTINA | 374-ARMENIA | 297-ARUBA | 61-AUSTRALIA | 43-AUSTRIA | 994-AZERBAIJAN | 1242-BAHAMAS | 973-BAHRAIN | 880-BANGLADESH | 1246-BARBADOS | 375-BELARUS | 32-BELGIUM | 501-BELIZE | 229-BENIN | 1441-BERMUDA | 975-BHUTAN | 591-BOLIVIA (PLURINATIONAL STATE OF) | 1002-BONAIRE, SINT EUSTATIUS AND SABA | 387-BOSNIA AND HERZEGOVINA | 267-BOTSWANA | 1003-BOUVET ISLAND | 55-BRAZIL | 1014-BRITISH INDIAN OCEAN TERRITORY | 673-BRUNEI DARUSSALAM | 359-BULGARIA | 226-BURKINA FASO | 257-BURUNDI | 238-CABO VERDE | 855-CAMBODIA | 237-CAMEROON | 1-CANADA | 1345-CAYMAN ISLANDS | 236-CENTRAL AFRICAN REPUBLIC | 235-CHAD | 56-CHILE | 86-CHINA | 9-CHRISTMAS ISLAND | 672-COCOS (KEELING) ISLANDS | 57-COLOMBIA | 270-COMOROS | 242-CONGO | 243-CONGO (DEMOCRATIC REPUBLIC OF THE) | 682-COOK ISLANDS | 506-COSTA RICA | 225-COTE DIVOIRE | 385-CROATIA | 53-CUBA | 1015-CURACAO | 357-CYPRUS | 420-CZECHIA | 45-DENMARK | 253-DJIBOUTI | 1767-DOMINICA | 1809-DOMINICAN REPUBLIC | 593-ECUADOR | 20-EGYPT | 503-EL SALVADOR | 240-EQUATORIAL GUINEA | 291-ERITREA | 372-ESTONIA | 251-ETHIOPIA | 500-FALKLAND ISLANDS (MALVINAS) | 298-FAROE ISLANDS | 679-FIJI | 358-FINLAND | 33-FRANCE | 594-FRENCH GUIANA | 689-FRENCH POLYNESIA | 1004-FRENCH SOUTHERN TERRITORIES | 241-GABON | 220-GAMBIA | 995-GEORGIA | 49-GERMANY | 233-GHANA | 350-GIBRALTAR | 30-GREECE | 299-GREENLAND | 1473-GRENADA | 590-GUADELOUPE | 1671-GUAM | 502-GUATEMALA | 1481-GUERNSEY | 224-GUINEA | 245-GUINEA-BISSAU | 592-GUYANA | 509-HAITI | 1005-HEARD ISLAND AND MCDONALD ISLANDS | 6-HOLY SEE | 504-HONDURAS | 852-HONG KONG | 36-HUNGARY | 354-ICELAND | 91-INDIA | 62-INDONESIA | 98-IRAN (ISLAMIC REPUBLIC OF) | 964-IRAQ | 353-IRELAND | 1624-ISLE OF MAN | 972-ISRAEL | 5-ITALY | 1876-JAMAICA | 81-JAPAN | 1534-JERSEY | 962-JORDAN | 7-KAZAKHSTAN | 254-KENYA | 686-KIRIBATI | 850-KOREA (DEMOCRATIC PEOPLES REPUBLIC OF) | 82-KOREA (REPUBLIC OF) | 965-KUWAIT | 996-KYRGYZSTAN | 856-LAO PEOPLES DEMOCRATIC REPUBLIC | 371-LATVIA | 961-LEBANON | 266-LESOTHO | 231-LIBERIA | 218-LIBYA | 423-LIECHTENSTEIN | 370-LITHUANIA | 352-LUXEMBOURG | 853-MACAO | 389-MACEDONIA (THE FORMER YUGOSLAV REPUBLIC OF) | 261-MADAGASCAR | 265-MALAWI | 60-MALAYSIA | 960-MALDIVES | 223-MALI | 356-MALTA | 692-MARSHALL ISLANDS | 596-MARTINIQUE | 222-MAURITANIA | 230-MAURITIUS | 269-MAYOTTE | 52-MEXICO | 691-MICRONESIA (FEDERATED STATES OF) | 373-MOLDOVA (REPUBLIC OF) | 377-MONACO | 976-MONGOLIA | 382-MONTENEGRO | 1664-MONTSERRAT | 212-MOROCCO | 258-MOZAMBIQUE | 95-MYANMAR | 264-NAMIBIA | 674-NAURU | 977-NEPAL | 31-NETHERLANDS | 687-NEW CALEDONIA | 64-NEW ZEALAND | 505-NICARAGUA | 227-NIGER | 234-NIGERIA | 683-NIUE | 15-NORFOLK ISLAND | 1670-NORTHERN MARIANA ISLANDS | 47-NORWAY | 968-OMAN | 92-PAKISTAN | 680-PALAU | 970-PALESTINE, STATE OF | 507-PANAMA | 675-PAPUA NEW GUINEA | 595-PARAGUAY | 51-PERU | 63-PHILIPPINES | 1011-PITCAIRN | 48-POLAND | 14-PORTUGAL | 1787-PUERTO RICO | 974-QATAR | 262-REUNION | 40-ROMANIA | 8-RUSSIAN FEDERATION | 250-RWANDA | 1006-SAINT BARTHELEMY | 290-SAINT HELENA, ASCENSION AND TRISTAN DA CUNHA | 1869-SAINT KITTS AND NEVIS | 1758-SAINT LUCIA | 1007-SAINT MARTIN (FRENCH PART) | 508-SAINT PIERRE AND MIQUELON | 1784-SAINT VINCENT AND THE GRENADINES | 685-SAMOA | 378-SAN MARINO | 239-SAO TOME AND PRINCIPE | 966-SAUDI ARABIA | 221-SENEGAL | 381-SERBIA | 248-SEYCHELLES | 232-SIERRA LEONE | 65-SINGAPORE | 1721-SINT MAARTEN (DUTCH PART) | 421-SLOVAKIA | 386-SLOVENIA | 677-SOLOMON ISLANDS | 252-SOMALIA | 28-SOUTH AFRICA | 1008-SOUTH GEORGIA AND THE SOUTH SANDWICH ISLANDS | 211-SOUTH SUDAN | 35-SPAIN | 94-SRI LANKA | 249-SUDAN | 597-SURINAME | 1012-SVALBARD AND JAN MAYEN | 268-SWAZILAND | 46-SWEDEN | 41-SWITZERLAND | 963-SYRIAN ARAB REPUBLIC | 886-TAIWAN, PROVINCE OF CHINA[A] | 992-TAJIKISTAN | 255-TANZANIA, UNITED REPUBLIC OF | 66-THAILAND | 670-TIMOR-LESTE(EAST TIMOR) | 228-TOGO | 690-TOKELAU | 676-TONGA | 1868-TRINIDAD AND TOBAGO | 216-TUNISIA | 90-TURKEY | 993-TURKMENISTAN | 1649-TURKS AND CAICOS ISLANDS | 688-TUVALU | 256-UGANDA | 380-UKRAINE | 971-UNITED ARAB EMIRATES | 44-UNITED KINGDOM OF GREAT BRITAIN AND NORTHERN IRELAND | 2-UNITED STATES OF AMERICA | 1009-UNITED STATES MINOR OUTLYING ISLANDS | 598-URUGUAY | 998-UZBEKISTAN | 678-VANUATU | 58-VENEZUELA (BOLIVARIAN REPUBLIC OF) | 84-VIET NAM | 1284-VIRGIN ISLANDS (BRITISH) | 1340-VIRGIN ISLANDS (U.S.) | 681-WALLIS AND FUTUNA | 1013-WESTERN SAHARA | 967-YEMEN | 260-ZAMBIA | 263-ZIMBABWE | 9999-OTHERS
```

---

## Appendix 2 · Notes on hidden rows

Hidden rows are NOT built (constitution rule 1). The main hidden blocks: A1
block 3 (rows 51–72) and its 54D line (17, 40, 63–65); A4 detail (103–104); A6
alt full-value line and 54D line (129, 138); A8 @15% slots (153, 155–156, 169–181);
B1 g-split (215–216); B2 54EE (225); B3 residents-unlisted block and indexation
lines (229–236, 240, 242, 246–247, 249, 251–254, 256–257); B5/B6 splits
(260–262); B7 split (325–326); B9 deemed-section block (346–357, 365–366,
368–369); B10 @10%/@20% slots (372, 374, 376); B11 alternate DTAA table
(386–390); B(A) rate table (392–393); Part-D 54EE and deemed-section tables
(412–416, 427–435); the two legacy Table-E copies (440–454, 457–472); the edit
flag (472); and the 15 %/10 %/20 % Table-F rows and SPI note (491, 496, 498,
500). Each is marked `H` in Appendix 4.

---

## Appendix 3 · Every schema leaf of block ScheduleCG (full paths)

`*` = required.
```
  ShortTermCapGain.SaleofLandBuild.SaleofLandBuildDtls[] array
  ShortTermCapGain.SaleofLandBuild.SaleofLandBuildDtls[].DateofPurchase string
  ShortTermCapGain.SaleofLandBuild.SaleofLandBuildDtls[].DateofSale string
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
  LongTermCapGain.SaleofLandBuild.SaleofLandBuildDtls[].DateofPurchase string
  LongTermCapGain.SaleofLandBuild.SaleofLandBuildDtls[].DateofSale string
* LongTermCapGain.SaleofLandBuild.SaleofLandBuildDtls[].FullConsideration integer
* LongTermCapGain.SaleofLandBuild.SaleofLandBuildDtls[].PropertyValuation integer
* LongTermCapGain.SaleofLandBuild.SaleofLandBuildDtls[].FullConsideration50C integer
* LongTermCapGain.SaleofLandBuild.SaleofLandBuildDtls[].AquisitCost integer
* LongTermCapGain.SaleofLandBuild.SaleofLandBuildDtls[].CostOfImprovements.ImproveCost integer
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
* LongTermCapGain.SaleOfEquityShareUs112A.SaleOfEquityShareUs112AAmt integer
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
* LongTermCapGain.NRISaleOfEquityShareUs112A.NRISaleOfEquityShareUs112AAmt integer
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
  CurrYrLosses.InLtcgDTAARate.CurrYearIncome integer
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

## Appendix 4 · Every row of the CG sheet, verbatim

Source of every label above. `[cell] text` as the utility stores it; rows marked
`H` are hidden.
```
r   3 : [C3] Schedule CG  |  [G3] Capital Gains
r   4 : [D4] A  |  [E4] Short-term capital gain (Items 4 & 5 are not applicable for residents)
r   5 : [F5] From sale of land or building or both (fill up details separately for each property) (in case of co-
r   6 : [F6] Date of purchase/ acquisition
r   7 : [F7] Date of sale/transfer
r   8 : [F8] a  |  [G8] i  |  [H8] Full value of consideration received/receivable  |  [P8] ai
r   9 : [G9] ii  |  [H9] Value of property as per stamp valuation authority  |  [P9] aii
r  10 : [G10] iii  |  [H10] Full value of consideration adopted as per section 50C for the purpose of Capital Gains [in case (ai  |  [P10] aiii
r  11 : [F11] b  |  [G11] Deductions under section 48
r  12 : [C12] CAPITAL GAINS  |  [G12] i  |  [H12] Cost of acquisition without indexation  |  [P12] bi
r  13 : [G13] ii  |  [H13] Cost of Improvement without indexation  |  [P13] bii
r  14 : [G14] iii  |  [H14] Expenditure wholly and exclusively in connection with transfer  |  [P14] biii
r  15 : [G15] iv  |  [H15] Total (bi + bii + biii)  |  [P15] biv
r  16 : [F16] c  |  [G16] Balance (aiii – biv)  |  [P16] c
r  17H: [F17] di  |  [G17] Deduction under section 54D(Specify details in item D below)  |  [P17] di
r  18 : [F18] di  |  [G18] Deduction under section 54G(Specify details in item D below)  |  [P18] di
r  19 : [F19] dii  |  [G19] Deduction under section 54GA(Specify details in item D below)  |  [P19] dii
r  20 : [F20] d  |  [G20] Total Deduction under section 54G/54GA  |  [P20] d
r  21 : [F21] e  |  [G21] Short-term Capital Gains on Immovable property (1c - 1d)  |  [R21] A1e
r  22 : [F22] f  |  [G22] In case of transfer of immovable property please furnish following details (See Note)
r  23 : [G23] Sl. No.  |  [H23] Name of Buyer  |  [J23] PAN of Buyer  |  [L23] Aadhaar Number of Buyer(s)  |  [M23] Percentage share  |  [N23] Amount  |  [O23] Address of Property  |  [P23] State  |  [Q23] Pin Code  |  [R23] Country Code  |  [S23] ZipCode
r  24 : [P24] (Select)  |  [R24] (Select)
r  25 : [P25] (Select)  |  [R25] (Select)
r  26 : [P26] (Select)  |  [R26] (Select)
r  28 : [F28] From sale of land or building or both
r  29 : [F29] Date of purchase/ acquisition
r  30 : [F30] Date of sale/transfer
r  31 : [F31] a  |  [G31] i  |  [H31] Full value of consideration received/receivable  |  [P31] ai
r  32 : [G32] ii  |  [H32] Value of property as per stamp valuation authority  |  [P32] aii
r  33 : [G33] iii  |  [H33] Full value of consideration adopted as per section 50C for the purpose of Capital Gains [in case (ai  |  [P33] aiii
r  34 : [C34] CAPITAL GAINS  |  [F34] b  |  [G34] Deductions under section 48
r  35 : [G35] i  |  [H35] Cost of acquisition without indexation  |  [P35] bi
r  36 : [G36] ii  |  [H36] Cost of Improvement without indexation  |  [P36] bii
r  37 : [G37] iii  |  [H37] Expenditure wholly and exclusively in connection with transfer  |  [P37] biii
r  38 : [G38] iv  |  [H38] Total (bi + bii + biii)  |  [P38] biv
r  39 : [F39] c  |  [G39] Balance (aiii – biv)  |  [P39] c
r  40H: [F40] di  |  [G40] Deduction under section 54D(Specify details in item D below)  |  [P40] di
r  41 : [F41] di  |  [G41] Deduction under section 54G(Specify details in item D below)  |  [P41] di
r  42 : [F42] dii  |  [G42] Deduction under section 54GA(Specify details in item D below)  |  [P42] dii
r  43 : [F43] d  |  [G43] Total Deduction under section 54G/54GA  |  [P43] d
r  44 : [F44] e  |  [G44] Short-term Capital Gains on Immovable property (1c - 1d)  |  [R44] A1e
r  45 : [F45] f  |  [G45] In case of transfer of immovable property please furnish following details (See Note)
r  46 : [G46] Sl. No.  |  [H46] Name of Buyer  |  [J46] PAN of Buyer  |  [L46] Aadhaar Number of Buyer(s)  |  [M46] Percentage share  |  [N46] Amount  |  [O46] Address of Property  |  [P46] State  |  [Q46] Pin Code  |  [R46] Country Code  |  [S46] ZipCode
r  47 : [P47] (Select)  |  [R47] (Select)
r  48 : [P48] (Select)  |  [R48] (Select)
r  49 : [P49] (Select)  |  [R49] (Select)
r  51H: [F51] From sale of land or building or both
r  52H: [F52] Date of purchase/ acquisition
r  53H: [F53] Date of sale/transfer
r  54H: [F54] a  |  [G54] i  |  [H54] Full value of consideration received/receivable  |  [P54] ai
r  55H: [G55] ii  |  [H55] Value of property as per stamp valuation authority  |  [P55] aii
r  56H: [G56] iii  |  [H56] Full value of consideration adopted as per section 50C for the purpose of Capital Gains [in case (ai  |  [P56] aiii
r  57H: [F57] b  |  [G57] Deductions under section 48
r  58H: [C58] CAPITAL GAINS  |  [G58] i  |  [H58] Cost of acquisition without indexation  |  [P58] bi
r  59H: [G59] ii  |  [H59] Cost of Improvement without indexation  |  [P59] bii
r  60H: [G60] iii  |  [H60] Expenditure wholly and exclusively in connection with transfer  |  [P60] biii
r  61H: [G61] iv  |  [H61] Total (bi + bii + biii)  |  [P61] biv
r  62H: [F62] c  |  [G62] Balance (aiii – biv)  |  [P62] c
r  63H: [F63] di  |  [G63] Deduction under section 54D(Specify details in item D below)  |  [P63] di
r  64H: [F64] dii  |  [G64] Deduction under section 54G(Specify details in item D below)  |  [P64] dii
r  65H: [F65] diii  |  [G65] Deduction under section 54GA(Specify details in item D below)  |  [P65] diii
r  66H: [F66] d  |  [G66] Total Deduction under section 54G/54GA  |  [P66] d
r  67H: [F67] e  |  [G67] Short-term Capital Gains on Immovable property (1c - 1d)  |  [R67] A1e
r  68H: [F68] f  |  [G68] In case of transfer of immovable property please furnish following details (See Note)
r  69H: [G69] Sl. No.  |  [H69] Name of Buyer  |  [J69] PAN of Buyer  |  [L69] Aadhaar Number of Buyer(s)  |  [M69] Percentage share  |  [N69] Amount  |  [O69] Address of Property  |  [P69] State  |  [Q69] Pin Code  |  [R69] Country Code  |  [S69] ZipCode
r  70H: [P70] (Select)  |  [R70] (Select)
r  71H: [P71] (Select)  |  [R71] (Select)
r  72H: [P72] (Select)  |  [R72] (Select)
r  75 : [F75] Note 1 : Furnishing of PAN is mandatory, if the tax is deducted under section 194-IA or is quoted by
r  76 : [F76] From Slump sale
r  77 : [F77] ai  |  [G77] Fair market value as per Rule 11UAE(2)  |  [P77] 2ai
r  78 : [F78] aii  |  [G78] Fair market value as per Rule 11UAE(3)  |  [P78] 2aii
r  79 : [F79] aiii  |  [G79] Full value of consideration (higher of ai or aii)  |  [P79] 2aiii
r  80 : [F80] b  |  [G80] Net worth of the under taking or division (6(e) of Form 3CEA)  |  [P80] 2b
r  81 : [F81] c  |  [G81] Short term capital gains from slump sale (2aiii-2b)  |  [R81] A2c
r  82 : [F82] i)From sale of equity share or unit of equity oriented Mutual Fund (MF) or Unit of a business trust 
r  83 : [F83] ia  |  [G83] Full value of consideration  |  [P83] ia
r  84 : [F84] ib  |  [G84] Deductions under section 48
r  85 : [G85] i  |  [H85] Cost of acquisition without indexation  |  [P85] ibi
r  86 : [G86] ii  |  [H86] Cost of Improvement without indexation  |  [P86] ibii
r  87 : [G87] iii  |  [H87] Expenditure wholly and exclusively in connection with transfer  |  [P87] ibiii
r  88 : [G88] iv  |  [H88] Total ( i + ii + iii)  |  [P88] ibiv
r  89 : [F89] ic  |  [G89] Balance (3ia – 3ibiv)  |  [P89] ic
r  90 : [F90] id  |  [G90] Loss, if any, to be ignored under section 94(7) or 94(8) for example if asset bought/acquired within  |  [P90] id
r  91 : [F91] ie  |  [G91] Short-term capital gain on equity share or equity oriented MF (STT paid) (3ic + 3id )  |  [R91] A3ie
r  92 : [F92] (ii) From sale of equity share or unit of equity oriented Mutual Fund (MF) or unit of a business tru
r  93 : [F93] iia  |  [G93] Full value of consideration  |  [P93] iia
r  94 : [F94] iib  |  [G94] Deductions under section 48
r  95 : [G95] i  |  [H95] Cost of acquisition without indexation  |  [P95] iibi
r  96 : [G96] ii  |  [H96] Cost of Improvement without indexation  |  [P96] iibii
r  97 : [G97] iii  |  [H97] Expenditure wholly and exclusively in connection with transfer  |  [P97] iibiii
r  98 : [G98] iv  |  [H98] Total ( i + ii + iii)  |  [P98] iibiv
r  99 : [F99] iic  |  [G99] Balance (3a – 3biv)  |  [P99] iic
r 100 : [F100] iid  |  [G100] Loss to be disallowed u/s 94(7) or 94(8)- for example if asset bought/acquired within 3 months prior  |  [P100] iid
r 101 : [F101] iie  |  [G101] Short-term capital gain on equity share or equity oriented MF or unit of a business trust (STT paid)  |  [R101] A3iie
r 102 : [F102] For NON-RESIDENT, not being an FII- from sale of shares or debentures of an Indian company (to be co
r 103H: [F103] a  |  [G103] STCG on transactions covered u/s 111A  |  [R103] A4a
r 104H: [F104] ai  |  [G104] Where the transfer was before 23rd July 2024  |  [R104] A4ai
r 105 : [F105] a  |  [G105] STCG on transactions covered u/s 111A  |  [R105] A4a
r 106 : [F106] b  |  [G106] STCG from sale of shares not covered in sl.no. 4a or sale of debentures  |  [R106] A4b
r 107 : [F107] For NON-RESIDENTS- from sale of securities (other than those at A3 above) by an FII as per section 1
r 108 : [F108] a  |  [G108] i  |  [H108] In case securities sold include shares of a company other than quoted shares, enter the following de
r 109 : [H109] a  |  [I109] Full value of consideration received/receivable in respect of unquoted shares  |  [P109] 5aia
r 110 : [H110] b  |  [I110] Fair market value of unquoted shares determined in the prescribed manner  |  [P110] aib
r 111 : [H111] c  |  [I111] Full value of consideration in respect of unquoted shares adopted as per section 50CA for the purpos  |  [P111] aic
r 112 : [G112] ii  |  [H112] Full value of consideration in respect of securities other than unquoted shares  |  [P112] 5aii
r 113 : [G113] iii  |  [H113] Total (ic + ii)  |  [P113] 5aiii
r 114 : [F114] b  |  [G114] Deductions under section 48
r 115 : [G115] i  |  [H115] Cost of acquisition without indexation  |  [P115] bi
r 116 : [G116] ii  |  [H116] Cost of improvement without indexation  |  [P116] bii
r 117 : [G117] iii  |  [H117] Expenditure wholly and exclusively in connection with transfer  |  [P117] biii
r 118 : [G118] iv  |  [H118] Total (i + ii + iii)  |  [P118] biv
r 119 : [F119] c  |  [G119] Balance (5aiii – biv)  |  [P119] 5c
r 120 : [F120] d  |  [G120] Loss to be disallowed u/s 94(7) or 94(8)- for example if security bought/acquired within 3 months pr  |  [P120] 5d
r 121 : [F121] e  |  [G121] Short-term capital gain on sale of securities (other than those at A3 above) by an FII (5c +5d)  |  [R121] A5e
r 122 : [F122] From sale of assets other than at A1 or A2 or A3 or A4 or A5 above
r 123 : [F123] a  |  [G123] i  |  [H123] In case assets sold include shares of a company other than quoted shares, enter the following detail
r 124 : [H124] a  |  [I124] Full value of consideration received/receivable in respect of unquoted shares  |  [P124] 6aia
r 125 : [H125] b  |  [I125] Fair market value of unquoted shares determined in the prescribed manner  |  [P125] aib
r 126 : [H126] c  |  [I126] Full value of consideration in respect of unquoted shares adopted as per section 50CA for the purpos  |  [P126] aic
r 127 : [G127] ii  |  [H127] Full value of consideration in respect of assets other than unquoted shares  |  [P127] aii
r 128 : [G128] iii  |  [H128] Total (ic + ii)  |  [P128] aiii
r 129H: [F129] a  |  [G129] Full value of consideration  |  [P129] 6a
r 130 : [F130] b  |  [G130] Deductions under section 48
r 131 : [G131] i  |  [H131] Cost of acquisition without indexation  |  [P131] bi
r 132 : [G132] ii  |  [H132] Cost of Improvement without indexation  |  [P132] bii
r 133 : [G133] iii  |  [H133] Expenditure wholly and exclusively in connection with transfer  |  [P133] biii
r 134 : [G134] iv  |  [H134] Total (i + ii + iii)  |  [P134] biv
r 135 : [F135] c  |  [G135] Balance (6aiii – biv)  |  [P135] 6c
r 136 : [F136] d  |  [G136] In case of asset (security/unit) loss to be disallowed u/s 94(7) or 94(8)- for example if asset boug  |  [P136] 6d
r 137 : [F137] e  |  [G137] Deemed short term capital gains on depreciable assets  |  [P137] e
r 138H: [F138] fi  |  [G138] Deduction under section 54D (Specify details in item D below)  |  [P138] fi
r 139 : [F139] fi  |  [G139] Deduction under section 54G (Specify details in item D below)  |  [P139] fi
r 140 : [F140] fii  |  [G140] Deduction under section 54GA (Specify details in item D below)  |  [P140] fii
r 141 : [F141] f  |  [G141] Total Deduction under section 54G/54GA  |  [P141] 6f
r 142 : [F142] g  |  [G142] STCG on assets other than at A1 or A2 or A3 or A4 or A5 above (6c + 6d + 6e-6f)  |  [R142] A6g
r 143 : [F143] Amount deemed to be short-term capital gains
r 144 : [E144] a  |  [F144] Whether any amount of unutilized capital gain on asset transferred during the previous years shown b  |  [P144] No
r 145 : [G145] Sl.No.  |  [H145] Previous year in which asset transferred  |  [I145] Section under which deduction claimed in that year  |  [J145] New asset acquired/constructed  |  [L145] Amount not used for new asset or remained unutilized in Capital gains account (X)
r 146 : [J146] Previous year in which asset acquired/constructed  |  [K146] Amount utilised out of Capital Gains account
r 147 : [H147] (Select)  |  [I147] (Select)
r 148 : [H148] (Select)  |  [I148] (Select)
r 149 : [H149] (Select)  |  [I149] (Select)
r 151 : [E151] b  |  [F151] Amount deemed to be short term capital gains u/s 54G/54GA, other than at ‘a’  |  [P151] 7b
r 152 : [F152] Total amount deemed to be short term capital gains (Xi + Xii + Xiii + b)  |  [R152] A7
r 153H: [F153] Deemed short term capital gains on depreciable assets (6 of schedule- DCG)  |  [R153] A8
r 154 : [F154] Pass Through Income/Loss in the nature of Short Term Capital Gain, (Fill up schedule PTI) (A8a+A8b +  |  [R154] A8
r 155H: [F155] ai  |  [G155] Pass Through Income/loss in the nature of Short Term Capital Gain, chargeable @ 15%  |  [P155] 8ai
r 156H: [F156] a2  |  [G156] Pass Through Income/ Loss in the nature of Short Term Capital Gain, chargeable @ 15% other than Sect  |  [P156] 8a2
r 157 : [F157] a  |  [G157] Pass Through Income/ Loss in the nature of Short Term Capital Gain, chargeable @ 20%  |  [P157] 8a
r 158 : [F158] b  |  [G158] Pass Through Income / Loss in the nature of Short Term Capital Gain, chargeable @ 30%  |  [P158] 8b
r 159 : [F159] c  |  [G159] Pass Through Income / Loss in the nature of Short Term Capital Gain, chargeable at applicable rates  |  [P159] 8c
r 160 : [F160] Amount of STCG included in A1-A8 but claimed as not chargeable to tax or chargeable at special rates
r 161 : [G161] Sl. No. (1)  |  [H161] Amount of income (2)  |  [I161] Item No. A1 to A8 above in which included (3)  |  [J161] Country name, code (4)  |  [K161] Article of DTAA (5)  |  [L161] Rate as per Treaty (enter NIL, if not chargeable) (6)  |  [M161] Whether Tax Residency Certificate obtained? (7)  |  [N161] Section of I.T. Act (8)  |  [O161] Rate as per I.T. Act (9)  |  [P161] Applicable rate [lower of (6) or (9)] (10)
r 162 : [I162] (Select)  |  [J162] (Select)
r 163 : [I163] (Select)  |  [J163] (Select)
r 167 : [G167] a  |  [H167] Total amount of STCG claimed as not chargeable to tax in India as per DTAA  |  [R167] A9a
r 168 : [G168] b  |  [H168] Total amount of STCG claimed as chargeable to tax at special rates in India as per DTAA  |  [R168] A9b
r 169H: [F169] Amount of STCG included in A1-A7 but not chargeable to tax or chargeable at special rates in India a
r 170H: [G170] Sl.  |  [H170] Country name, code  |  [I170] Article of DTAA  |  [J170] Whether Tax Residency Certificate obtained?  |  [K170] Item no. A1 to A7 above in which included  |  [L170] Amount of STCG
r 171H: [H171] (Select)  |  [J171] (Select)
r 172H: [H172] (Select)  |  [J172] (Select)
r 174H: [G174] III  |  [H174] Total amount of STCG not chargeable to tax as per DTAA  |  [R174] A8
r 175H: [F175] Amount deemed to be short term capital gains under sections 54B/54D/54G/54GA
r 176H: [F176] i  |  [G176] Amount deemed to be short term capital gains under sections 54B  |  [P176] i
r 177H: [F177] ii  |  [G177] Amount deemed to be short term capital gains under sections 54D  |  [P177] ii
r 178H: [F178] iii  |  [G178] Amount deemed to be short term capital gains under sections 54G  |  [P178] iii
r 179H: [F179] iv  |  [G179] Amount deemed to be short term capital gains under sections 54GA  |  [P179] iv
r 180H: [F180] Total Amount deemed to be short term capital gains under sections 54B/54D/54G/54GA  |  [R180] A7
r 181H: [F181] Deemed short term capital gains on depreciable assets (6 of schedule- DCG)  |  [R181] A9
r 182 : [D182] A(A)  |  [F182] Capital Loss on buy back of shares [Short Term Capital loss @20% / 30% / Applicable rate] (can be cl  |  [R182] A(A)
r 183 : [G183] Sl.No.  |  [H183] Rate  |  [L183] Amount
r 184 : [H184] (Select)
r 185 : [H185] (Select)
r 187 : [F187] Total Short-term Capital Gain (A1e+ A2c+ A3e+ A4a+ A4b+ A5e+ A6g+A7+A8-A9a+A(A))  |  [R187] A10
r 188 : [D188] B  |  [E188] Long-term capital gain (LTCG) (Sub Items 5,6 &7 are not applicable for residents)
r 189 : [D189] Long-term Capital Gains  |  [F189] From sale of land or building or both (fill up details separately for each property) (in case of co-
r 190 : [F190] Date of purchase/ acquisition
r 191 : [F191] Date of sale/transfer
r 192 : [F192] a  |  [G192] i  |  [H192] Full value of consideration received/receivable  |  [P192] ai
r 193 : [G193] ii  |  [H193] Value of property as per stamp valuation authority  |  [P193] aii
r 194 : [G194] iii  |  [H194] Full value of consideration adopted as per section 50C for the purpose of Capital Gains [in case (ai  |  [P194] aiii
r 195 : [F195] b  |  [G195] Deductions under section 48
r 196 : [G196] bi  |  [H196] Cost of acquisition without indexation  |  [P196] bi
r 197 : [G197] bii  |  [H197] Cost of improvement without indexation  |  [P197] bii
r 198 : [G198] biii  |  [H198] Expenditure wholly and exclusively in connection with transfer  |  [P198] biii
r 199 : [G199] biv  |  [H199] Total (bi + bii + biii)  |  [P199] biv
r 200 : [F200] c  |  [G200] Balance (aiii – biv)  |  [P200] 1c
r 201 : [F201] di  |  [G201] Deduction under section 54D (Specify details in item D below)  |  [P201] di
r 202 : [F202] dii  |  [G202] Deduction under section 54EC (Specify details in item D below)  |  [P202] dii
r 203 : [F203] diii  |  [G203] Deduction under section 54G (Specify details in item D below)  |  [P203] diii
r 204 : [F204] div  |  [G204] Deduction under section 54GA (Specify details in item D below)  |  [P204] div
r 205 : [F205] d  |  [G205] Deduction under section 54D/54EC/54G/54GA (Specify details in item D below)  |  [P205] 1d
r 206 : [F206] e  |  [G206] Long-term Capital Gains on Immovable property (1c - 1d)  |  [R206] B1e
r 207 : [F207] f  |  [G207] In case of transfer of immovable property please furnish the following details (See Note)
r 208 : [G208] Sl. No.  |  [H208] Name of buyer(s)  |  [J208] Pan of Buyer(s)  |  [L208] Aadhaar Number of Buyer(s)  |  [M208] Percentage share  |  [N208] Amount  |  [O208] Address of Property  |  [P208] State  |  [Q208] Pin Code  |  [R208] Country Code  |  [S208] Zipcode
r 209 : [P209] (Select)  |  [R209] (Select)
r 210 : [P210] (Select)  |  [R210] (Select)
r 211 : [P211] (Select)  |  [R211] (Select)
r 214 : [F214] Note 1 : Furnishing of PAN/aadhaar is mandatory, if the tax is deduced under section 194-IA or is qu
r 215H: [F215] g  |  [G215] Total Long-term Capital Gains on Immovable property (ƩB1e) where transfer was
r 216H: [G216] a  |  [H216] Before 23rd July 2024 (sum of capital gains on all properties transferred before 23rd July 2024)
r 217 : [F217] g  |  [G217] Total Long-term Capital Gains on Immovable property (ƩB1e)
r 218 : [F218] From Slump sale
r 219 : [F219] ai  |  [G219] Fair market value as per Rule 11UAE(2)  |  [Q219] 2ai
r 220 : [F220] aii  |  [G220] Fair market value as per Rule 11UAE(3)  |  [Q220] 2aii
r 221 : [F221] aiii  |  [G221] Full value of consideration (higher of ai or aii)  |  [Q221] 2aiii
r 222 : [F222] b  |  [G222] Net worth of the under taking or division (6(e) of Form 3CEA)  |  [Q222] 2b
r 223 : [F223] c  |  [G223] Balance (2aiii - 2b)  |  [Q223] 2c
r 224 : [F224] d  |  [G224] Deduction u/s 54EC  |  [Q224] 2d
r 225H: [F225] dii  |  [G225] Deduction u/s 54EE (Specify details in item D below)  |  [P225] dii
r 226 : [F226] e  |  [G226] Long term capital gains from slump sale (2c-2d)  |  [R226] B2e
r 229H: [F229] For residents, from sale of unlisted bonds or unlisted debenture (other than capital indexed bonds i
r 230H: [F230] a  |  [G230] Full value of consideration  |  [P230] 3a
r 231H: [F231] b  |  [G231] Deductions under section 48
r 232H: [G232] i  |  [H232] Cost of acquisition without indexation  |  [P232] bi
r 233H: [G233] ii  |  [H233] Cost of improvement without indexation  |  [P233] bii
r 234H: [G234] iii  |  [H234] Expenditure wholly and exclusively in connection with transfer  |  [P234] biii
r 235H: [G235] iv  |  [H235] Total (bi + bii +biii)  |  [P235] biv
r 236H: [F236] c  |  [G236] LTCG on bonds or debenture(other than capital indexed bonds issued by Government(3a – biv)  |  [R236] B3c
r 237 : [F237] From sale of listed securities (other than a unit) or zero coupon bonds as per sec 112(1)
r 238 : [F238] a  |  [G238] Full value of consideration  |  [Q238] 3a
r 239 : [F239] b  |  [G239] Deductions under section 48
r 240H: [G240] i  |  [H240] Cost of acquisition with indexation  |  [P240] bi
r 241 : [G241] i  |  [H241] Cost of acquisition without indexation  |  [Q241] 3bi
r 242H: [G242] ii  |  [H242] Cost of improvement with indexation  |  [P242] bii
r 243 : [G243] ii  |  [H243] Cost of improvement without indexation  |  [Q243] 3bii
r 244 : [G244] iii  |  [H244] Expenditure wholly and exclusively in connection with transfer  |  [Q244] 3biii
r 245 : [G245] iv  |  [H245] Total (bi + bii +biii)  |  [Q245] 3biv
r 246H: [F246] d  |  [G246] Total Deduction u/s 54EE/54F  |  [P246] 4d
r 247H: [G247] biva  |  [H247] Total (bia + biia + biii) (for the purpose of computing excess as per proviso section 112(1)) (appli  |  [P247] biva
r 248 : [F248] c  |  [G248] Long-term Capital Gains on assets at B3 (3a – biv)  |  [R248] B3c
r 249H: [R249] B4ci
r 251H: [G251] ca  |  [H251] Long Term Capital Gains on assets at B4 above where transfer was before 23rd July 2024 ) (4a – biva)  |  [R251] B4ca
r 252H: [G252] d  |  [H252] Tax as per 112(1)(a)(ii)(A) or 112(1)(c)(ii)(A) [LTCG at 20 % with indexation] (applicable where tra  |  [R252] B4d
r 253H: [G253] e  |  [H253] Tax as per 1st Proviso to section 112(1) [LTCG at 10 % without indexation] [ B4(ca)*10%] (applicable  |  [R253] B4e
r 254H: [G254] f  |  [H254] Excess amount that is required to be ignored as per 1st proviso to section 112(1) [B4(d) – B4(e)] (a  |  [R254] B4f
r 255 : [F255] From sale of equity share in a company or unit of equity oriented fund or unit of a business trust o
r 256H: [F256] Long-Term capital gains on sale of capital assets at B5  |  [R256] B4
r 257H: [F257] i  |  [G257] Long-term Capital Gains on sale of capital assets at B5 above transferred before 23rd of July 2024  |  [R257] B5i
r 258 : [F258] Long Term Capital Gains on assets at B4  |  [R258] B4
r 259 : [F259] For NON-RESIDENTS- from sale of unlistef shares or listed debenture of Indian company (to be compute
r 260H: [F260] a  |  [G260] LTCG computed without indexation benefit where transfer was  |  [R260] B5
r 261H: [F261] i  |  [G261] Before 23rd July 2024 - Listed Debentures  |  [R261] 6i
r 262H: [F262] ii  |  [G262] Before 23rd July 2024 - Other than listed Debentures  |  [R262] 6ii
r 263 : [F263] LTCG computed without indexation benefit on unlisted shares or listed debentures  |  [R263] B5
r 264 : [F264] For NON-RESIDENTS- from sale of, (i) unlisted securities as per sec. 112(1)c
r 265 : [F265] ia  |  [G265] i  |  [H265] In case securities sold include shares of a company other than quoted shares, enter the following de
r 266 : [H266] a  |  [I266] Full value of consideration received/receivable in respect of unquoted shares  |  [Q266] 6ai
r 267 : [H267] b  |  [I267] Fair market value of unquoted shares determined in the prescribed manner  |  [Q267] aib
r 268 : [H268] c  |  [I268] Full value of consideration in respect of unquoted shares adopted as per section 50CA for the purpos  |  [Q268] aic
r 269 : [G269] ii  |  [H269] Full value of consideration in respect of assets other than unquoted shares  |  [Q269] aii
r 270 : [G270] iii  |  [H270] Total (ic + ii)  |  [Q270] aiii
r 271 : [F271] ib  |  [G271] Deductions under section 48
r 272 : [G272] i  |  [H272] Cost of acquisition without indexation  |  [Q272] 6bi
r 273 : [G273] ii  |  [H273] Cost of improvement without indexation  |  [Q273] bii
r 274 : [G274] iii  |  [H274] Expenditure wholly and exclusively in connection with transfer  |  [Q274] biii
r 275 : [G275] iv  |  [H275] Total (bi + bii +biii)  |  [Q275] biv
r 276 : [F276] ic  |  [G276] Long-term Capital Gains on assets at 6 above in case of NON-RESIDENT(aiii – biv)  |  [R276] B6ic
r 279 : [F279] For NON-RESIDENTS- from units referred in sec. 115AB
r 280 : [F280] iia  |  [G280] i  |  [H280] In case securities sold include shares of a company other than quoted shares, enter the following de
r 281 : [H281] a  |  [I281] Full value of consideration received/receivable in respect of unquoted shares  |  [Q281] 6iiai
r 282 : [H282] b  |  [I282] Fair market value of unquoted shares determined in the prescribed manner  |  [Q282] iiaib
r 283 : [H283] c  |  [I283] Full value of consideration in respect of unquoted shares adopted as per section 50CA for the purpos  |  [Q283] iiaic
r 284 : [G284] ii  |  [H284] Full value of consideration in respect of assets other than unquoted shares  |  [Q284] iiaii
r 285 : [F285] iia  |  [G285] iii  |  [H285] Total (ic + ii)  |  [Q285] iiaiii
r 286 : [F286] iib  |  [G286] Deductions under section 48
r 287 : [G287] i  |  [H287] Cost of acquisition without indexation  |  [Q287] bi
r 288 : [G288] ii  |  [H288] Cost of improvement without indexation  |  [Q288] bii
r 289 : [G289] iii  |  [H289] Expenditure wholly and exclusively in connection with transfer  |  [Q289] biii
r 290 : [G290] iv  |  [H290] Total (bi + bii +biii)  |  [Q290] biv
r 291 : [F291] iic  |  [G291] Long-term Capital Gains on assets at 6 above in case of NON-RESIDENT(aiii – biv)  |  [R291] B6iic
r 294 : [F294] For NON-RESIDENTS- from sale of bonds or GDR as referred in sec. 115AC
r 295 : [F295] iiia  |  [G295] i  |  [H295] In case securities sold include shares of a company other than quoted shares, enter the following de  |  [P295] i6a
r 296 : [H296] a  |  [I296] Full value of consideration received/receivable in respect of unquoted shares  |  [Q296] 6iiiai
r 297 : [H297] b  |  [I297] Fair market value of unquoted shares determined in the prescribed manner  |  [Q297] iiiaib
r 298 : [H298] c  |  [I298] Full value of consideration in respect of unquoted shares adopted as per section 50CA for the purpos  |  [Q298] iiiaic
r 299 : [G299] ii  |  [H299] Full value of consideration in respect of assets other than unquoted shares  |  [Q299] iiiaii
r 300 : [G300] iii  |  [H300] Total (ic + ii)  |  [Q300] iiiaiii
r 301 : [F301] iiib  |  [G301] Deductions under section 48
r 302 : [G302] i  |  [H302] Cost of acquisition without indexation  |  [Q302] bi
r 303 : [G303] ii  |  [H303] Cost of improvement without indexation  |  [Q303] bii
r 304 : [G304] iii  |  [H304] Expenditure wholly and exclusively in connection with transfer  |  [Q304] biii
r 305 : [G305] iv  |  [H305] Total (bi + bii +biii)  |  [Q305] biv
r 306 : [F306] iiic  |  [G306] Long-term Capital Gains on assets at 6 above in case of NON-RESIDENT(aiii – biv)  |  [R306] B6iiic
r 309 : [F309] For NON-RESIDENTS- from sale of securities by FII as referred to in sec. 115AD
r 310 : [F310] iva  |  [G310] i  |  [H310] In case securities sold include shares of a company other than quoted shares, enter the following de  |  [P310] i6a
r 311 : [H311] a  |  [I311] Full value of consideration received/receivable in respect of unquoted shares  |  [P311] 6ivai
r 312 : [H312] b  |  [I312] Fair market value of unquoted shares determined in the prescribed manner  |  [P312] iaib
r 313 : [H313] c  |  [I313] Full value of consideration in respect of unquoted shares adopted as per section 50CA for the purpos  |  [P313] ivaic
r 314 : [G314] ii  |  [H314] Full value of consideration in respect of assets other than unquoted shares  |  [P314] ivaii
r 315 : [G315] iii  |  [H315] Total (ic + ii)  |  [P315] ivaiii
r 316 : [F316] ivb  |  [G316] Deductions under section 48
r 317 : [G317] i  |  [H317] Cost of acquisition without indexation  |  [P317] bi
r 318 : [G318] ii  |  [H318] Cost of improvement without indexation  |  [P318] bii
r 319 : [G319] iii  |  [H319] Expenditure wholly and exclusively in connection with transfer  |  [P319] biii
r 320 : [G320] iv  |  [H320] Total (bi + bii +biii)  |  [P320] biv
r 321 : [F321] ivc  |  [G321] Long-term Capital Gains on assets at 6 above in case of NON-RESIDENT(aiii – biv)  |  [R321] B6ivc
r 322 : [F322] Total of Long-term Capital Gains on assets at 6 above in case of NON-RESIDENT
r 324 : [F324] For FII/FPI NON-RESIDENTS - From sale of equity share in a company or unit of equity oriented fund o
r 325H: [F325] Long-Term capital gains on sale of capital assets at B8  |  [R325] B7
r 326H: [F326] i  |  [G326] Long-term Capital Gains on sale of capital assets at B8 above transferred before 23rd July 2024  |  [R326] B8i
r 327 : [F327] Long-Term capital gains on sale of capital assets at B7  |  [R327] B7
r 328 : [F328] From sale of assets where B1 to B7 above are not applicable
r 329 : [F329] a  |  [G329] i  |  [H329] In case assets sold include shares of a company other than quoted shares, enter the following detail
r 330 : [H330] a  |  [I330] Full value of consideration received/receivable in respect of unquoted shares  |  [Q330] 8ai
r 331 : [H331] b  |  [I331] Fair market value of unquoted shares determined in the prescribed manner  |  [Q331] ib
r 332 : [H332] c  |  [I332] Full value of consideration in respect of unquoted shares adopted as per section 50CA for the purpos  |  [Q332] ic
r 333 : [G333] ii  |  [H333] Full value of consideration in respect of assets other than unquoted shares  |  [Q333] 8aii
r 334 : [G334] iii  |  [H334] Total (ic + ii)  |  [Q334] 8aiii
r 335 : [F335] b  |  [G335] Deductions under section 48
r 336 : [G336] i  |  [H336] Cost of acquisition without indexation  |  [Q336] bi
r 337 : [G337] ii  |  [H337] Cost of improvement without indexation  |  [Q337] bii
r 338 : [G338] iii  |  [H338] Expenditure wholly and exclusively in connection with transfer  |  [Q338] biii
r 339 : [G339] iv  |  [H339] Total (bi + bii +biii)  |  [Q339] biv
r 340 : [F340] c  |  [G340] Balance (8aiii – biv)  |  [Q340] 8c
r 341 : [F341] di  |  [G341] Deduction under sections 54D (Specify details in item D below)  |  [Q341] di
r 342 : [F342] dii  |  [G342] Deduction under sections 54G (Specify details in item D below)  |  [Q342] dii
r 343 : [F343] diii  |  [G343] Deduction under sections 54GA (Specify details in item D below)  |  [Q343] diii
r 344 : [F344] d  |  [G344] Deduction under sections 54D/54G/54GA (Specify details in item D below)  |  [Q344] 8d
r 345 : [F345] e  |  [G345] Long-term Capital Gains on assets at B8 above (8c-8d)  |  [R345] B8e
r 346H: [F346] i  |  [G346] Amount deemed to be LTCG under sections 54  |  [P346] i
r 347H: [F347] ii  |  [G347] Amount deemed to be LTCG under sections 54B  |  [P347] ii
r 348H: [F348] ii  |  [G348] Amount deemed to be LTCG under sections 54D  |  [P348] ii
r 349H: [F349] iii  |  [G349] Amount deemed to be LTCG under sections 54EC  |  [P349] iii
r 350H: [F350] iv  |  [G350] Amount deemed to be LTCG under sections 54F  |  [P350] iv
r 351H: [F351] ii  |  [G351] Amount deemed to be LTCG under sections 54G  |  [P351] ii
r 352H: [F352] ii  |  [G352] Amount deemed to be LTCG under sections 54GA  |  [P352] ii
r 353H: [F353] v  |  [G353] Amount deemed to be LTCG under sections 54GB  |  [P353] v
r 354H: [F354] vi  |  [G354] Amount deemed to be LTCG under sections 115F  |  [P354] vi
r 355H: [F355] Total Amount deemed to be LTCG under sections 54/54B/54D/54EC/54F/54G/54GA/54GB/115F  |  [R355] B9
r 356H: [R356] B9ei
r 357H: [R357] B8eii
r 358 : [F358] Amount deemed to be long-term capital gains
r 359 : [E359] a  |  [F359] Whether any amount of unutilized capital gain on asset transferred during the previous year shown be  |  [P359] No
r 360 : [G360] Sl.No.  |  [H360] Previous year in which asset transferred  |  [I360] Section under which deduction claimed in that year  |  [J360] New asset acquired/constructed  |  [L360] Amount not used for new asset or remained unutilized in Capital gains account (X)
r 361 : [J361] Previous year in which asset acquired/constructed  |  [K361] Amount utilized out of Capital Gains account
r 365H: [E365] b  |  [F365] Amount deemed to be long-term capital gains, other than at ‘a’ (bi+bii)  |  [P365] 10b
r 366H: [F366] i  |  [G366] Where deemed capital gain arose before 23rd July 2024  |  [P366] 10bi
r 367 : [E367] b  |  [F367] Amount deemed to be long-term capital gains, other than at ‘a’  |  [P367] 9b
r 368H: [F368] iii  |  [G368] Total Amount deemed to be long-term capital gains (Xi + Xii + Xiii + b)  |  [R368] B10
r 369H: [F369] i  |  [G369] Where deemed capital gain arose before 23rd July 2024  |  [R369] B10i
r 370 : [F370] Total Amount deemed to be long-term capital gains (aXi + aXii + aXiii + b)  |  [R370] B9
r 371 : [F371] Pass Through Income/Loss in the nature of Long Term Capital Gain,(Fill up schedule PTI) (B10a1+B10a2  |  [R371] B10
r 372H: [F372] a1(i)  |  [G372] Pass Through Income/loss in the nature of Long Term Capital Gain, chargeable @ 10% u/s. 112A  |  [P372] 11a1(i)
r 373 : [F373] a1  |  [G373] Pass Through Income/ Loss in the nature of Long-Term Capital Gain, chargeable @ 12.5% u/s 112A  |  [P373] 10a1
r 374H: [F374] a2(i)  |  [G374] Pass Through Income/loss in the nature of Long Term Capital Gain, chargeable @ 10% - under sections   |  [P374] 11a2(i)
r 375 : [F375] a2  |  [G375] Pass Through Income/ Loss in the nature of Long-Term Capital Gain, chargeable @ 12.5% other than u/s  |  [P375] 10a2
r 376H: [F376] b  |  [G376] Pass Through Income /Loss in the nature of Long Term Capital Gain, chargeable @ 20%  |  [P376] 11b
r 377 : [F377] Amount of LTCG included in items B1 to B10 but claimed as not chargeable to tax or chargeable at spe
r 378 : [G378] Sl. No. (1)  |  [H378] Amount of income (2)  |  [I378] Item No. B1 to B10 above in which included (3)  |  [J378] Country name, code (4)  |  [K378] Article of DTAA (5)  |  [L378] Rate as per Treaty (enter NIL, if not chargeable) (6)  |  [M378] Whether Tax Residency Certificate obtained? (7)  |  [N378] Section of I.T. Act (8)  |  [O378] Rate as per I.T. Act (9)  |  [P378] Applicable rate [lower of (6) or (9)] (10)
r 379 : [I379] (Select)  |  [J379] (Select)
r 380 : [I380] (Select)  |  [J380] (Select)
r 384 : [G384] a  |  [H384] Total amount of LTCG claimed as not chargeable to tax in India as per DTAA  |  [R384] B11a
r 385 : [G385] b  |  [H385] Total amount of LTCG claimed as chargeable to tax at special rates in India as per DTAA  |  [R385] B11b
r 386H: [G386] Sl.  |  [H386] Country name, code  |  [I386] Article of DTAA  |  [J386] Whether Tax Residency Certificate obtained?  |  [K386] Item B1 to B9 above in which included  |  [L386] Amount of LTCG
r 390H: [G390] III  |  [H390] Total amount of LTCG not chargeable to tax as per DTAA  |  [R390] B10
r 391 : [E391] B(A)  |  [G391] Capital Loss on buy back of shares (Long Term Capital loss @12.5%) (can be claimed only if respectiv  |  [R391] B(A)
r 392H: [H392] Sl.no.  |  [I392] Rate  |  [M392] Amount
r 393H: [I393] (Select)
r 396 : [F396] Total long term capital gain B1g + B2e + B3c + B4 + B5 + B6c + B7 + B8e + B9e + B10 - B11a + B(A)  |  [R396] B12
r 397 : [D397] C1  |  [E397] Sum of Capital Gain Incomes 8ii + 8iii + 8iv + 8v + 8vi + 8vii of table E below  |  [R397] C1
r 398 : [D398] C2  |  [E398] Income from transfer of Virtual Digital Assets (Item No. B of Schedule VDA)  |  [R398] C2
r 399 : [D399] C3  |  [E399] Income chargeable under the head “CAPITAL GAINS” (C1 + C2)  |  [R399] C3
r 400 : [D400] D  |  [E400] Information about deduction claimed
r 401 : [F401] In case of deduction u/s 54D/54EC/54G/54GA give following details
r 402 : [F402] a  |  [G402] Deduction claimed u/s 54D
r 403 : [G403] Sl. No  |  [H403] Date of acquisition of original asset  |  [I403] Cost of purchase/ construction of new land or building for industrial undertaking  |  [J403] Date of purchase of new land or building  |  [K403] Amount deposited in Capital Gains Accounts Scheme before due date  |  [L403] Date of Deposit  |  [M403] Account Number  |  [N403] IFS Code  |  [O403] Amount of deduction claimed
r 406 : [G406] Total
r 407 : [F407] b  |  [G407] Deduction claimed u/s 54EC
r 408 : [G408] Sl. No  |  [H408] Date of transfer of original asset  |  [I408] Amount invested in specified/notified bonds (not exceeding fifty lakh rupees)  |  [J408] Date of investment  |  [K408] Amount of deduction claimed
r 411 : [G411] Total
r 412H: [F412] e  |  [G412] Deduction claimed u/s 54EE
r 413H: [G413] Sl. No.  |  [H413] Date of transfer of original asset  |  [I413] Amount invested in specified assets  |  [J413] Date of investment  |  [K413] Amount of deduction claimed
r 416H: [G416] Total
r 417 : [F417] c  |  [G417] Deduction claimed u/s 54G
r 418 : [G418] Sl. No.  |  [H418] Date of transfer of original asset from urban area  |  [I418] Cost and expenses incurred for purchase or construction of new asset  |  [J418] Date of purchase/construction of new asset in an area other than urban area  |  [K418] Amount deposited in Capital Gains Accounts Scheme before due date  |  [L418] Date of Deposit  |  [M418] Account Number  |  [N418] IFS Code  |  [O418] Amount of deduction claimed
r 421 : [G421] Total
r 422 : [F422] d  |  [G422] Deduction claimed u/s 54GA
r 423 : [G423] Sl. No.  |  [H423] Date of transfer of original asset from urban area  |  [I423] Cost and expenses incurred for purchase or construction of new asset  |  [J423] Date of purchase/construction of new asset in SEZ  |  [K423] Amount deposited in Capital Gains Accounts Scheme before due date  |  [L423] Date of Deposit  |  [M423] Account Number  |  [N423] IFS Code  |  [O423] Amount of deduction claimed
r 426 : [G426] Total
r 427H: [H427] Section  |  [I427] Amount of Deduction  |  [J427] Cost of New Asset  |  [K427] Date of its acquisition/ construction  |  [L427] Amount deposited in Capital Gains Accounts Scheme before due date
r 428H: [H428] (Select)
r 429H: [H429] (Select)
r 430H: [H430] (Select)
r 431H: [H431] (Select)
r 432H: [H432] (Select)
r 433H: [H433] (Select)
r 434H: [H434] (Select)
r 435H: [H435] (Select)
r 439 : [F439] 1e  |  [G439] Total deduction claimed ) (1a + 1b + 1c + 1d )  |  [N439] 1e
r 440H: [D440] E  |  [E440] Set-off of current year capital losses with current year capital gains (excluding amounts included i
r 441H: [E441] SI. No.  |  [F441] Type of Capital Gain  |  [I441] Gain of current year (Fill this column only if computed figure is positive)  |  [J441] Short term capital loss set off  |  [N441] Long term capital loss set off  |  [Q441] Current year’s capital gains remaining after set off (9= 1-2-3-4-5-6-7-8)
r 442H: [L442] applicable rate  |  [M442] DTAA rates  |  [P442] DTAA rates
r 444H: [E444] i  |  [F444] Capital Loss to be set off (Fill this row only if computed figure is negative)
r 445H: [E445] ii  |  [F445] Short term capital gain
r 446H: [E446] ii
r 447H: [E447] iii
r 448H: [E448] iv  |  [H448] applicable rate
r 449H: [E449] v  |  [H449] DTAA rates
r 450H: [E450] vi  |  [F450] Long term capital gain
r 451H: [E451] vii
r 452H: [E452] viii  |  [H452] DTAA rates
r 453H: [E453] ix  |  [F453] Total loss set off (ii + iii + iv + v + vi + vii + viii)
r 454H: [E454] x  |  [F454] Loss remaining after set off (i – ix )
r 456 : [D456] E  |  [F456] Set-off of current year capital losses with current year capital gains (excluding amounts included i
r 457H: [E457] SL.No  |  [F457] Type of Capital Gain  |  [I457] Gain of current year (Fill this column only if computed figure is positive)  |  [J457] Short term capital loss set off  |  [O457] Long term capital loss set off
r 458H: [M458] Applicable rate  |  [N458] DTAA rates  |  [R458] DTAA rates  |  [S458] Current year’s capital gains remaining after set off (9= 1-2-3-4-5-6-7-8)
r 460H: [E460] i  |  [F460] Capital Loss to be set off (Fill this row only if computed figure is negative)  |  [X460] Column Wise
r 461H: [E461] ii  |  [F461] Short term capital gain
r 462H: [E462] iii
r 463H: [E463] iv
r 464H: [E464] v  |  [H464] Applicable rate  |  [W464] Applicable rate
r 465H: [E465] vi  |  [H465] DTAA rates  |  [W465] DTAA rates
r 466H: [E466] vii  |  [F466] Long term capital gain
r 467H: [E467] viii
r 468H: [E468] ix
r 469H: [E469] x  |  [H469] DTAA rates  |  [W469] DTAA rates
r 470H: [E470] xi  |  [F470] Total loss set off (ii + iii + iv + v + vi+vii+viii+ix+x)
r 471H: [E471] xii  |  [F471] Loss remaining after set off (i –xi )
r 472H: [D472] Do you want to edit the detail autopopulated above?
r 474 : [E474] SL.No  |  [F474] Type of Capital Gain  |  [I474] Gain of current year (Fill this column only if computed figure is positive)  |  [J474] Short term capital loss set off  |  [N474] Long term capital loss set off
r 475 : [L475] Applicable rate  |  [M475] DTAA rates  |  [O475] DTAA rates  |  [P475] Current year’s capital gains remaining after set off 8=(1-2-3-4-5-6-7)
r 477 : [E477] i  |  [F477] Capital Loss to be set off (Fill this row only if computed figure is negative)
r 478 : [E478] ii  |  [F478] Short term capital gain
r 479 : [E479] iii
r 480 : [E480] iv  |  [H480] Applicable rate
r 481 : [E481] v  |  [H481] DTAA rates
r 482 : [E482] vi  |  [F482] Long term capital gain
r 483 : [E483] vii  |  [H483] DTAA rates
r 484 : [E484] viii  |  [F484] Total loss set off (ii + iii + iv + v + vi+vii)
r 485 : [E485] ix  |  [F485] Loss remaining after set off (i –viii )
r 486 : [D486] Do you want to edit the detail autopopulated above?
r 489 : [D489] F  |  [E489] Information about accrual/receipt of capital gain
r 490 : [F490] Type of Capital gain / Date  |  [M490] Upto 15/6 (i)  |  [N490] 16/6 to 15/9 (ii)  |  [O490] 16/9 to 15/12 (iii)  |  [P490] 16/12 to 15/3 (iv)  |  [Q490] 16/3 to 31/3 (v)
r 491H: [F491] Short-term capital gains taxable at the rate of 15%  |  [R491] Maramreddy Konda Reddy
r 492 : [F492] Short-term capital gains taxable at the rate of 20%  |  [R492] is calling you
r 493 : [F493] Short-term capital gains taxable at the rate of 30%
r 494 : [F494] Short-term capital gains taxable at applicable rates
r 495 : [F495] Short-term capital gains taxable at DTAA rates
r 496H: [F496] Long- term capital gains taxable at the rate of 10%
r 497 : [F497] Long- term capital gains taxable at the rate of 12.5%
r 498H: [F498] Long- term capital gains taxable at the rate of 20%
r 499 : [F499] Long-term capital gains taxable at the DTAA rates
r 500H: [F500] Please include the income of the specified persons referred to in Schedule SPI while computing the i
r 501 : [F501] Capital gains on transfer of Virtual Digital Asset taxable at the rate of 30% Enter value from item 
```
