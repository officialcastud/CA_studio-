# ITR-5 rule census — SLICE A_1-347 (Category A, serials 1–347)

Domains: Part A General/status/audit-info (forms/ITR-5/src/70_sec_gen.js), Schedule BP / CorpScheduleBP, Schedule DPM/DOA/DEP/DCG/ESR/ICDS (70_sec_bp.js; OI feeds 70_sec_oi.js). Encoded rules live in 61_rules_enc_01..enc_08 — Part A-General serials in enc_01..enc_05; Schedule BP ladder + DPM/DOA depreciation loop in enc_06; DEP/DCG/ESR + Schedule-CG s.48 helper loops in enc_07/08. Source read-only; classification per census_brief.md.

A rule is ENCODED when its serial drives an A()/Dd() assertion — directly, via the computed serial sn=329+idx (ESR §35 rows 329–337), or via the noS48IfNoFVC(n,..) helper (CG s.48, 340–347). The DPM/DOA block loops in enc_06 drive 273–291 / 288–298 as literal A(...) calls.

| serial | cat | bucket | justification (field name / reason) |
|---|---|---|---|
| 1 | A | ENCODED | enc_01: Part A-General: if the assessee is liable for audit u/s 92E, Part A-BS and Part A-P&L cannot be blank. |
| 2 | A | ENCODED | enc_01: Part A-General: if the assessee is liable for audit u/s 44AB, Part A-BS and Part A-P&L cannot be blank. |
| 3 | A | ENCODED | enc_01: Part A-General: enter a valid (10-digit) mobile number. |
| 4 | A | ENCODED | enc_01: Part A-General: 'held unlisted equity shares during the previous year' is 'Yes' — the details of the shares must be provided. |
| 5 | A | ENCODED | enc_01: Part A-General: capacity in Verification is 'Representative assessee' — select 'Yes' for 'return filed by a representative assessee' and fil… |
| 6 | A | ENCODED | enc_01: Part A-General: select the option for 'whether the assessee is declaring income only under section 44AD/44ADA/44AE/44B/44BB/44BBA/44BBC/44BB… |
| 7 | A | ENCODED | enc_01: Part A-General: turnover band a2i is 'More than Rs.1 crore and up to Rs.10 crores' — Sl.No. a2ii (aggregate receipts in cash) cannot be blan… |
| 8 | A | ENCODED | enc_01: Part A-General: turnover band a2i is 'More than Rs.1 crore and up to Rs.10 crores' — Sl.No. a2iii (aggregate payments in cash) cannot be bla… |
| 9 | A | NA | needs Form 3CA-3CD / 3CB-3CD filing (external audit-report submission state); no schema leaf |
| 10 | A | ENCODED | enc_01: Part A-General: accounts are not maintained as per section 44AA — the 'No books of account' rows in the Balance Sheet and P&L must be filled… |
| 11 | A | ENCODED | enc_01: Part A-General: disclosure of the 'Nature of business or profession' is mandatory. |
| 12 | A | ENCODED | enc_01: Part A-General: the PAN entered at Verification must match a PAN entered in the Partners/Members/Trust information. |
| 13 | A | ENCODED | enc_01: Part A-General: the assessee is liable to maintain accounts u/s 44AA — Part A-BS and Part A-P&L must be filled. |
| 14 | A | ENCODED | enc_01: Part A-General: Status is 'Firm' — Sub-status must be 'Partnership Firm' or 'LLP' and cannot be blank. |
| 15 | A | ENCODED | enc_01: Part A-General: Status is 'AOP/BOI' — a valid Sub-status must be selected and cannot be blank. |
| 16 | A | ENCODED | enc_01: Part A-General: Status is 'Artificial Juridical Person' — Sub-status must be 'Estate of the deceased', 'Estate of the insolvent' or 'Other A… |
| 17 | A | ENCODED | enc_01: Part A-General: Status is 'Local Authority' — the Sub-status field must be left blank. |
| 18 | A | ENCODED | enc_01: Part A-General: deductions u/s 10AA / Schedule 80 / Chapter VI-A Part C (except 80JJAA and 80LA(1A)) cannot be claimed when opting for 115BA… |
| 19 | A | ENCODED | enc_01: Part A-General: sections 115BAD/115BAE can be opted only by a resident co-operative society. |
| 20 | A | ENCODED | enc_01: Part A-General: Sl.No. 2v of Part B-TI cannot be declared when Table F Sl.No. 2 (business income of the private discretionary trust) is 'No'… |
| 21 | A | ENCODED | enc_01: Part A-General: Table F Sl.No. 1 is 'Yes' — the sum of 'Percentage of share (if determinate)' must be equal to 100. |
| 22 | A | ENCODED | enc_01: Part A-General: 'Opting it now' is selected for the current-AY option u/s 115BAD — the date of filing of Form 10-IF and its acknowledgement … |
| 23 | A | ENCODED | enc_01: Part A-General: opted for the new tax regime u/s 115BAD in an earlier year — the date of filing of Form 10-IF and its acknowledgement number… |
| 24 | A | NA | needs Form 10DA filing state to allow 80JJAA (external form submission) |
| 25 | A | ENCODED | enc_01: Part A-General: Schedule 115AD is filled — 'Whether you are FII/FPI?' must be selected 'Yes'. |
| 26 | A | ENCODED | enc_01: Part A-General: filed in response to a notice u/s 139(9)/142(1)/148/153C or an order u/s 119(2)(b)/92CD — the unique/DIN number and the date… |
| 27 | A | ENCODED | enc_01: Part A-General: Status is 'AOP' with a co-operative sub-status — answer 'Have you opted for the new tax regime u/s 115BAD?'. |
| 28 | A | ENCODED | enc_01: Part A-General: A6 date of commencement of business cannot be before the date of incorporation and cannot be after the end of the financial … |
| 29 | A | ENCODED | enc_01: Part A-General: Sub-status is 'LLP'/'Partnership Firm' — the partners' details (Table A of Part A-General 2) must be filled. |
| 30 | A | ENCODED | enc_01: Part A-General: Sub-status is 'Trust filing ITR other than ITR-7' — Table F of Part A-General 2 must be filled. |
| 31 | A | ENCODED | enc_01: Part A-General: 'No' is selected at Table F Sl.No. 1 and Sl.No. 2 — Sl.No. 4 cannot be blank. |
| 32 | A | ENCODED | enc_01: Part A-General: for this sub-status, Sl.No. B and Sl.No. D of Table A (Part A-General 2) cannot be blank. |
| 33 | A | ENCODED | enc_01: Part A-General: 'Is any member of the AOP/BOI or AJP a foreign company?' is 'Yes' — Sl.No. C (percentage of share of the foreign company) ca… |
| 34 | A | ENCODED | enc_01: Part A-General: the option u/s 115BAE (d(iv)a/d(iv)b) is 'Yes' — the date of filing of Form 10-IFA and its acknowledgement number are mandat… |
| 35 | A | ENCODED | enc_22: Part A-General: the Legal Entity Identifier (LEI) details (Sl.No.Q) are required because the refund (Part B-TTI) is ₹50 crore or more. |
| 36 | A | ENCODED | enc_01: Part A-General: opting for the new tax regime u/s 115BAE — the date of formation/incorporation must be on or after 01/04/2023. |
| 37 | A | ENCODED | enc_01: Part A-General: Status is 'AOP' with a co-operative sub-status and incorporation on/after 01/04/2023 — an option must be selected at A19(div… |
| 38 | A | ENCODED | enc_01: Part A-General: the new tax regime u/s 115BAD and u/s 115BAE cannot both be selected. |
| 39 | A | NA | needs the OTHER person's ITR (their Schedule TDS declaration) — external return |
| 40 | A | NA | needs the OTHER person's ITR (their Schedule TCS declaration) — external return |
| 41 | A | ENCODED | enc_01: Part A-General: 'recognised as MSME?' is 'Yes' — the MSME registration number is mandatory. |
| 42 | A | ENCODED | enc_01: Part A-General: the assessee is liable to audit u/s 44AB — select the condition by virtue of which the audit is applicable. |
| 43 | A | ENCODED | enc_01: Part A-General: select the applicable due date for filing the return of income. |
| 44 | A | ENCODED | enc_01: Part A-General: Form 10-IFA is filed — opting for the new tax regime u/s 115BAE is mandatory. |
| 45 | A | ENCODED | enc_01: Part A-General: Sl.No. a2ii (receipts in cash) is 'More than 5%' — the assessee is liable to audit u/s 44AB. |
| 46 | A | ENCODED | enc_01: Part A-General: Sl.No. a2iii (payments in cash) is 'More than 5%' — the assessee is liable to audit u/s 44AB. |
| 47 | A | ENCODED | enc_01: Part A-General: to claim section 115BAE the date of incorporation and the date of commencement of business must be on or after 01/04/2023. |
| 48 | A | ENCODED | enc_01: Part A-General: exercising the option u/s 115BAE for AY 2026-27 at A19 div(b) — the date of filing of Form 10-IFA and its acknowledgement nu… |
| 49 | A | ENCODED | enc_01: Part A-General: 'Yes' at A19d(i)(I) (Form 10-IEA furnished for the current AY) — the date of filing (i) and the acknowledgement number (ii) … |
| 50 | A | ENCODED | enc_01: Part A-General: Form 10-IEA is filed — the details of the form (assessment year / date / acknowledgement number) must be mentioned in the re… |
| 51 | A | ENCODED | enc_02: Part A-General: the new tax regime can be opted out / withdrawn only if Form 10-IEA is filed for the current AY. |
| 52 | A | ENCODED | enc_02: Part A-General: business income is declared, so 'Do you have income from business or profession for the current AY?' cannot be 'No'. |
| 53 | A | OFFLINE-IMPOSSIBLE | 80G donee-PAN 'validity' needs external PAN/registered-donee database (PAN-match) |
| 54 | A | OFFLINE-IMPOSSIBLE | profession classification & 50/75L threshold depend on nature-of-business-code master list (code semantics not carried in schema) |
| 55 | A | ENCODED | enc_22: Schedule IF: the total of the column 'Amount of interest due or received' must equal Sl.No.14xi(b) (interest due/received from partnership f… |
| 56 | A | ENCODED | enc_02: Part A-General: due date 31 October is selected — fill Schedule IF (partner in firm) or the audit details in Part A General. |
| 57 | A | ENCODED | enc_02: Part A-General: due date 30 November is selected — fill Schedule IF (partner in firm) or the audit details in Part A General. |
| 58 | A | ENCODED | enc_02: Part A-General: due date 31 August can be selected only if you have income from business or profession. |
| 59 | A | NA | needs the original return's regime + its filing date (external/portal state) |
| 60 | A | NA | needs prior/original return's regime and filing date (external DB) |
| 61 | A | ENCODED | enc_02: Part A-General: in case of business income, the regime option at Sl.No. A19(b)(I) must be answered. |
| 62 | A | ENCODED | enc_02: Part A-General: in case of no business income, the regime option at Sl.No. A19(di)(II) must be answered. |
| 63 | A | ENCODED | enc_02: Part A-General: Form 10-IEA (earlier-AY, old regime) is 'Yes' — its acknowledgement number and assessment year are mandatory. |
| 64 | A | ENCODED | enc_02: Part A-General: Form 10-IEA filed to re-enter the new regime in an earlier year is 'Yes' — its acknowledgement number and assessment year ar… |
| 65 | A | ENCODED | enc_02: Part A-General: Form 10-IEA was not filed with the re-enter option for an earlier year — answer 'Have you furnished Form 10-IEA for re-enter… |
| 66 | A | ENCODED | enc_02: Part A-General: Form 10-IEA furnished to re-enter the new regime in the current AY — its date and acknowledgement number are mandatory. |
| 67 | A | ENCODED | enc_02: Part A-General: Form 10-IEA is not filed in the current AY to re-enter the new regime — its date/acknowledgement number must not be provided… |
| 68 | A | ENCODED | enc_02: Part A-General: answer 'Have you furnished Form 10-IEA within due date for the current AY for choosing the old tax regime?'. |
| 69 | A | ENCODED | enc_02: Part A-General: Form 10-IEA details (date and acknowledgement number) are mandatory for opting the old tax regime in the current AY. |
| 70 | A | ENCODED | enc_02: Part A-General: Form 10-IEA date/acknowledgement number should not be provided when Form 10-IEA is not filed for the current AY. |
| 71 | A | ENCODED | enc_02: Part A-General: Form 10-IEA earlier-year (old regime) details are to be provided only if that earlier-AY question is 'Yes'. |
| 72 | A | ENCODED | enc_02: Part A-General: Form 10-IEA earlier-year (re-entry into new regime) details are to be provided only if that re-entry question is 'Yes'. |
| 73 | A | ENCODED | enc_02: Part A-General: secondary address is mandatory when 'Is the secondary address same as primary address?' is 'No'. |
| 74 | A | ENCODED | enc_02: Part A-General: the secondary address should not be the same as the primary address when 'Is the secondary address same as primary address?'… |
| 75 | A | ENCODED | enc_02: Part A-General: a Form 10-IEA option is selected at Sl.No. A19(di) — business income is mandatory ('Do you have income from business or prof… |
| 76 | A | ENCODED | enc_02: Part A-General(2): 'Whether there was any change during the previous year in the partners/members' is 'Yes' — details of admitted/retired pa… |
| 77 | A | ENCODED | enc_02: Part A-General(2): answer to Sl.No. F(3) is mandatory when F(2) is 'Yes'. |
| 78 | A | ENCODED | enc_02: Part A-General(2): Sl.No. F(3) should be blank when F(2) is 'No'. |
| 79 | A | ENCODED | enc_02: Part A-General(2): answers to items (i)–(iv) of Sl.No. F(4) are mandatory when F(1) and F(2) are both 'No'. |
| 80 | A | ENCODED | enc_02: Part A-General(2): answers to items (i)–(iv) of Sl.No. F(4) should be blank when F(1) or F(2) is 'Yes'. |
| 81 | A | ENCODED | enc_02: Part A-BS: 'Sources of funds' (5) must equal 'Total application of funds' (5). |
| 82 | A | ENCODED | enc_02: Part A-BS: Sl.No. 1c (total partners'/members' fund) must equal 1a + 1bvi. |
| 83 | A | ENCODED | enc_02: Part A-BS: Sl.No. 2c (total loan funds) must equal 2aiii + 2biii. |
| 84 | A | ENCODED | enc_02: Part A-BS: Sl.No. 5 (sources of funds) must equal 1c + 2c + 3 + 4iii. |
| 85 | A | ENCODED | enc_02: Part A-BS: Sl.No. 2c (total investments) must equal 2aviii + 2bvii. |
| 86 | A | ENCODED | enc_02: Part A-BS: Sl.No. 3av (total current assets) must equal 3a(iH + iiC + iiiD + aiv). |
| 87 | A | ENCODED | enc_02: Part A-BS: Sl.No. 3e (net current assets) must equal 3c − 3diii. |
| 88 | A | ENCODED | enc_02: Part A-BS: Sl.No. 5 (total application of funds) must equal 1e + 2c + 3e + 4d. |
| 89 | A | ENCODED | enc_02: Part A-Manufacturing: Sl.No. 1Aiii (total opening inventory) must equal 1Ai + 1Aii. |
| 90 | A | ENCODED | enc_02: Part A-Manufacturing: total direct expenses (1D) must equal 1Di + 1Dii + 1Diii. |
| 91 | A | ENCODED | enc_02: Part A-Manufacturing: total factory overheads (1Evii) must equal 1Ei + 1Eii + 1Eiii + 1Eiv + 1Ev + 1Evi. |
| 92 | A | ENCODED | enc_02: Part A-Manufacturing: total debits (1F) must equal 1Aiii + B + C + D + 1Evii. |
| 93 | A | ENCODED | enc_02: Part A-Manufacturing: total closing stock (2) must equal 2i + 2ii. |
| 94 | A | ENCODED | enc_02: Part A-Manufacturing: cost of goods produced (3) must equal 1F − 2. |
| 95 | A | ENCODED | enc_02: Part A-Manufacturing: negative values are not allowed in Sl.No. 1 and Sl.No. 2. |
| 96 | A | ENCODED | enc_02: Part A-Trading: Sl.No. 4A(iii) total other operating revenues must equal the sum of the individual rows. |
| 97 | A | ENCODED | enc_02: Part A-Trading: Sl.No. 4A(iv) must equal 4A(i) + 4A(ii) + 4A(iiic). |
| 98 | A | ENCODED | enc_02: Part A-Trading: Sl.No. 4C(ix) must equal 4Ci + 4Cii + 4Ciii + 4Civ + 4Cv + 4Cvi + 4Cvii + 4Cviii. |
| 99 | A | ENCODED | enc_02: Part A-Trading: Sl.No. 4D (total revenue from operations) must equal 4A(iv) + 4B + 4C(ix). |
| 100 | A | ENCODED | enc_02: Part A-Trading: Sl.No. 9 (total direct expenses) must equal 9i + 9ii + 9iii. |
| 101 | A | ENCODED | enc_03: Part A-Trading Account: item 10 total (10xii) must equal the sum of 10i to 10xi. |
| 102 | A | ENCODED | enc_03: Part A-Trading Account: item 12 (gross profit) must equal 6 - 7 - 8 - 9 - 10xii - 11. |
| 103 | A | ENCODED | enc_03: Part A-Trading Account: a negative amount is allowed only at item 11 and/or item 12. |
| 104 | A | ENCODED | enc_03: Part A-Trading Account: item 11 must equal item 3 (cost of goods produced) of the Manufacturing Account. |
| 105 | A | ENCODED | enc_03: Part A-Trading Account: item 6 (total credits) must equal 4D + 5. |
| 106 | A | ENCODED | enc_03: Part A-Trading Account: income from intraday trading (12b) cannot exceed the intraday turnover (12a). |
| 107 | A | ENCODED | enc_03: Part A-Trading Account: income from Futures & Options (12d) cannot exceed the F&O turnover (12c). |
| 108 | A | ENCODED | enc_03: Part A-P&L: item 13 (gross profit transferred) must equal item 12 + 12b + 12d of the Trading Account. |
| 109 | A | ENCODED | enc_03: Part A-P&L: item 14xi (other income - miscellaneous) must equal the sum of its detail table, liabilities written back and interest from the … |
| 110 | A | ENCODED | enc_03: Part A-P&L: item 14xii (total other income) must equal the sum of 14i to 14x plus 14xi. |
| 111 | A | ENCODED | enc_03: Part A-P&L: item 15 (total credits to P&L) must equal item 13 + 14xii. |
| 112 | A | ENCODED | enc_03: Part A-P&L: if item 22xii(a) is 'Yes' then item 22xii(b) (compensation paid to non-residents) cannot be zero or blank. |
| 113 | A | ENCODED | enc_03: Part A-P&L: item 22xi (total employee compensation) must equal the sum of 22i to 22x. |
| 114 | A | ENCODED | enc_03: Part A-P&L: item 23v (total insurance) must equal the sum of 23i to 23iv. |
| 115 | A | ENCODED | enc_03: Part A-P&L: item 30iii (commission total) must equal 30i + 30ii. |
| 116 | A | ENCODED | enc_03: Part A-P&L: item 31iii (royalty total) must equal 31i + 31ii. |
| 117 | A | ENCODED | enc_03: Part A-P&L: item 32iii (professional/consultancy fees total) must equal 32i + 32ii. |
| 118 | A | ENCODED | enc_03: Part A-P&L: item 44x (total rates and taxes) must equal the sum of 44i to 44ix. |
| 119 | A | ENCODED | enc_03: Part A-P&L: item 47 (other expenses) must equal the sum of the other-expenses detail table. |
| 120 | A | ENCODED | enc_03: Part A-P&L: item 48iv (total bad debt) must equal 48i + 48ii + 48iii. |
| 121 | A | ENCODED | enc_03: Part A-P&L: item 51 (profit before interest, depreciation and taxes) must equal item 15 less the total of the debit heads (16 to 50). |
| 122 | A | ENCODED | enc_03: Part A-P&L: item 52iii (total interest) must equal 52ia + 52ib + 52iia + 52iib. |
| 123 | A | ENCODED | enc_03: Part A-P&L: item 54 (net profit before taxes) must equal item 51 - 52iii - 53. |
| 124 | A | ENCODED | enc_03: Part A-P&L: salary/remuneration to partners of the firm (item 46) can be claimed only by a Firm. |
| 125 | A | ENCODED | enc_03: Part A-P&L: item 57 (profit after tax) must equal item 54 - 55 - 56. |
| 126 | A | ENCODED | enc_03: Part A-P&L: item 59 (amount available for appropriation) must equal item 57 + 58. |
| 127 | A | ENCODED | enc_03: Part A-P&L: item 61 (balance carried to the partners' account) must equal item 59 - 60. |
| 128 | A | ENCODED | enc_03: Part A-P&L: item 62i (gross turnover or receipts u/s 44AD) must equal 62ia + 62ib + 62ic. |
| 129 | A | ENCODED | enc_03: Part A-P&L: item 62ii (presumptive income u/s 44AD) must equal 62iia + 62iib. |
| 130 | A | ENCODED | enc_03: Part A-P&L: item 62iia (presumptive income u/s 44AD) cannot be less than 6% of 62ia. |
| 131 | A | ENCODED | enc_03: Part A-P&L: item 62iib (presumptive income u/s 44AD) cannot be less than 8% of (62ib + 62ic). |
| 132 | A | ENCODED | enc_03: Part A-P&L: income claimed u/s 44AD at 62iib cannot be more than the gross receipts at 62ib + 62ic. |
| 133 | A | ENCODED | enc_03: Part A-P&L: income claimed u/s 44AD at 62iia cannot be more than the gross receipts at 62ia. |
| 134 | A | ENCODED | enc_03: Part A-P&L: item 63ii (presumptive income u/s 44ADA) cannot be less than 50% of 63i. |
| 135 | A | ENCODED | enc_03: Part A-P&L: a business code u/s 44AD must be selected at item 62 when income is declared at 62i and/or 62ii. |
| 136 | A | ENCODED | enc_03: Part A-P&L: the name of business must be filled when income u/s 44AD is declared at 62i and/or 62ii. |
| 137 | A | ENCODED | enc_03: Part A-P&L: a business code u/s 44ADA must be selected at item 63 when income is declared at 63i and/or 63ii. |
| 138 | A | ENCODED | enc_03: Part A-P&L: the name of profession must be filled when income u/s 44ADA is declared at 63i and/or 63ii. |
| 139 | A | ENCODED | enc_03: Part A-P&L: a business code u/s 44AE must be selected at item 64 when presumptive income u/s 44AE is declared. |
| 140 | A | ENCODED | enc_03: Part A-P&L: the name of business must be filled when the presumptive income u/s 44AE (64ii) is greater than zero. |
| 141 | A | ENCODED | enc_03: Part A-P&L: presumptive income u/s 44ADA (63ii) cannot be more than the gross receipts (63i). |
| 142 | A | ENCODED | enc_03: Schedule BP: item A35(i) (44AD) must equal item 62ii of Part A-P&L. |
| 143 | A | ENCODED | enc_03: Schedule BP: item A35(ii) (44ADA) must equal item 63ii of Part A-P&L. |
| 144 | A | ENCODED | enc_03: Schedule BP: item A35(iii) (44AE) must equal item 64iv of Part A-P&L. |
| 145 | A | ENCODED | enc_03: Part A-P&L: when the total presumptive income from goods carriage u/s 44AE (64ii) is greater than zero, the 64i goods-carriage table must be… |
| 146 | A | ENCODED | enc_03: Part A-P&L: item 64ii (total presumptive income from goods carriage u/s 44AE) must equal the total of column (5) of the 64i table. |
| 147 | A | ENCODED | enc_03: Part A-P&L: in the 64i table (44AE), the total number of months (column 4) cannot exceed 120. |
| 148 | A | ENCODED | enc_03: Part A-P&L: item 64iv (total presumptive income u/s 44AE) must equal 64ii - 64iii. |
| 149 | A | ENCODED | enc_03: (44AE table 64i): tonnage capacity cannot exceed 100 MT. |
| 150 | A | ENCODED | enc_03: (44AE): presumptive income must be at least Rs.7,500 per month where the tonnage capacity is 12 MT or less. |
| 151 | A | ENCODED | enc_04: Part A-P&L: presumptive business income u/s 44AD / 44ADA can be claimed only by a resident partnership firm. |
| 152 | A | ENCODED | enc_04: Part A-P&L: section 44AD is not applicable to general commission agents (code 09005) or professions referred in section 44AA(1) — remove tha… |
| 153 | A | ENCODED | enc_04: Part A-P&L: no-account business net profit (65(i)d) must equal gross profit (65(i)b) minus expenses (65(i)c). |
| 154 | A | ENCODED | enc_04: Part A-P&L: no-account profession net profit (65(ii)d) must equal gross profit (65(ii)b) minus expenses (65(ii)c). |
| 155 | A | ENCODED | enc_04: Part A-P&L: no-account business gross profit (65(i)b) cannot be more than gross receipts (65(i)a). |
| 156 | A | ENCODED | enc_04: Part A-P&L: no-account profession gross profit (65(ii)b) cannot be more than gross receipts (65(ii)a). |
| 157 | A | ENCODED | enc_04: Part A-P&L: no-account business gross receipts (65(i)a) must equal 65(i)a(i) + 65(i)a(ii). |
| 158 | A | ENCODED | enc_04: Part A-P&L: no-account profession gross receipts (65(ii)a) must equal 65(ii)a1 + 65(ii)a2. |
| 159 | A | ENCODED | enc_04: Part A-P&L: no-account total profit (65) must equal 65(i)d + 65(ii)d. |
| 160 | A | ENCODED | enc_04: Part A-P&L: net income from speculative activity (66iv) must equal gross profit (66ii) minus expenditure (66iii). |
| 161 | A | ENCODED | enc_04: Part A-P&L: salary/remuneration to partners at 64(iii) cannot be greater than zero unless presumptive income u/s 44AE at 64(ii) is greater t… |
| 162 | A | ENCODED | enc_04: Part A-P&L: PAN or Aadhaar is mandatory at 48(i) for each bad-debt row whose amount is filled. |
| 163 | A | ENCODED | enc_04: Part A-P&L: the registration number of each goods carriage in the 44AE table (64) must be unique. |
| 164 | A | ENCODED | enc_04: Part A-P&L: business sales/gross receipts exceed Rs.10 crore or profession gross receipts exceed Rs.50 lakh — 'liable for audit u/s 44AB' mu… |
| 165 | A | ENCODED | enc_04: Part A-P&L: 46 + 64(iii) (salary/remuneration to partners) must equal the remuneration in Part A General-2 (point E Col 9 + point A Col 6 re… |
| 166 | A | ENCODED | enc_04: Part A-P&L: total bad debt (48iv) must equal 48i + 48ii + 48iii. |
| 167 | A | ENCODED | enc_04: Part A-P&L: gross receipts u/s 44ADA (63i) must equal 63ia + 63ib + 63ic. |
| 168 | A | ENCODED | enc_04: Part A-P&L: gross receipts u/s 44ADA exceed Rs.50 lakh and cash + other-mode receipts exceed 5% of total — tax audit u/s 44AB is mandatory. |
| 169 | A | ENCODED | enc_04: Part A-P&L: gross receipts u/s 44AD exceed Rs.2 crore and cash + other-mode receipts exceed 5% of total — tax audit u/s 44AB is mandatory. |
| 170 | A | ENCODED | enc_04: Part A-P&L: gross receipts u/s 44ADA exceed Rs.75 lakh — tax audit u/s 44AB is mandatory. |
| 171 | A | ENCODED | enc_04: Part A-P&L: gross receipts u/s 44AD exceed Rs.3 crore — tax audit u/s 44AB is mandatory. |
| 172 | A | ENCODED | enc_04: Part A-P&L: bad debts 48(i) and 48(ii) must each equal the sum of the amount column of their detail tables. |
| 173 | A | ENCODED | enc_04: Part A-P&L: under section 44BBD the net profit (67ii) cannot be less than 25% of gross receipts/turnover (67i). |
| 174 | A | ENCODED | enc_04: Part A-P&L: net profit at 67(ii) cannot be more than the gross receipts/turnover at 67(i). |
| 175 | A | ENCODED | enc_04: Part A-P&L: under section 44B the net profit (67ii) cannot be less than 7.5% of gross receipts/turnover (67i). |
| 176 | A | ENCODED | enc_04: Part A-P&L: under section 44BB the net profit (67ii) cannot be less than 10% of gross receipts/turnover (67i). |
| 177 | A | ENCODED | enc_04: Part A-P&L: under section 44BBA the net profit (67ii) cannot be less than 5% of gross receipts/turnover (67i). |
| 178 | A | ENCODED | enc_04: Part A-P&L: under section 44BBC the net profit (67ii) cannot be less than 20% of gross receipts/turnover (67i). |
| 179 | A | ENCODED | enc_04: Part A-P&L: name and address are mandatory for a bad debtor with no PAN/Aadhaar where the amount exceeds Rs.1 lakh (48ii). |
| 180 | A | ENCODED | enc_04: Part A-OI: 3a (increase in profit from ICDS deviation) must equal Schedule ICDS column XI(3). |
| 181 | A | ENCODED | enc_04: Part A-OI: 3b (decrease in profit from ICDS deviation) must equal Schedule ICDS column XI(4). |
| 182 | A | ENCODED | enc_04: Part A-OI: 5f must equal the sum of 5a to 5e. |
| 183 | A | ENCODED | enc_04: Part A-OI: 6t must equal the sum of 6a to 6s. |
| 184 | A | ENCODED | enc_04: Part A-OI: 7j must equal the sum of 7a to 7i. |
| 185 | A | ENCODED | enc_04: Part A-OI: 8A.j must equal the sum of 8A.a to 8A.i. |
| 186 | A | ENCODED | enc_04: Part A-OI: 9g must equal the sum of 9a to 9f. |
| 187 | A | ENCODED | enc_04: Part A-OI: 10 total must equal the sum of 10a to 10h. |
| 188 | A | ENCODED | enc_04: Part A-OI: 11 total must equal the sum of 11a to 11h. |
| 189 | A | ENCODED | enc_04: Part A-OI: 12i (total outstanding) must equal the sum of 12a to 12h. |
| 190 | A | ENCODED | enc_04: Part A-OI: option u/s 92CE(2A) at item 17 is Yes — Schedule TPSA must be filled. |
| 191 | A | ENCODED | enc_04: Part A-OI: 13 (amounts deemed profits u/s 33AB / 33ABA / 33AC) must equal 13a + 13b + 13c. |
| 192 | A | ENCODED | enc_04: the 30% standard deduction (1g) must equal 30% of the annual value of the property owned (1f). |
| 193 | A | ENCODED | enc_04: for a co-owned property the assessee's share plus the co-owners' shares must equal 100%. |
| 194 | A | ENCODED | enc_04: for a co-owned property the annual value of the property owned (1f) must equal the assessee's percentage share of the annual value (1e). |
| 195 | A | ENCODED | enc_04: interest on borrowed capital cannot be claimed when the assessee's share of the co-owned property is zero. |
| 196 | A | ENCODED | enc_04: municipal (local) tax cannot be claimed when the gross rent received/receivable/lettable value (1a) is zero. |
| 197 | A | ENCODED | enc_04: Schedule HP: the total income from house property must equal the sum of the individual property values (1k) plus pass-through income. |
| 198 | A | ENCODED | enc_04: a let-out or deemed let-out property cannot have a zero gross rent received/receivable/lettable value (1a). |
| 199 | A | ENCODED | enc_04: the annual value (1e) must equal 1a minus 1d. |
| 200 | A | ENCODED | enc_04: the total of unrealised rent and local taxes (1d) must equal 1b + 1c. |
| 201 | A | ENCODED | enc_05: total deduction 1(i) must equal 1(g) + 1(h). |
| 202 | A | ENCODED | enc_05: income from house property 1(k) must equal 1(f) − 1(i) + 1(j). |
| 203 | A | ENCODED | enc_05: Schedule HP: pass-through income (2) must equal the net house-property income/loss shown in Schedule PTI. |
| 204 | A | ENCODED | enc_05: the PAN of a co-owner cannot be the same as the PAN of the assessee in Part A-General. |
| 205 | A | ENCODED | enc_05: the interest on borrowed capital u/s 24(b) must equal the sum of the per-loan interest rows (and 1h). |
| 206 | A | ENCODED | enc_05: details of interest on borrowed capital u/s 24(b) are mandatory to claim the deduction at 1(h). |
| 207 | A | ENCODED | enc_05: when the property is co-owned, the percentage share of the other co-owner(s) must be less than 100%. |
| 208 | A | ENCODED | enc_05: the rent which cannot be realised (1b) cannot be more than the annual lettable value / gross rent (1a). |
| 209 | A | ENCODED | enc_05: Schedule BP: A3a (income relatable to house property credited to P&L) cannot exceed the income offered in Schedule HP. |
| 210 | A | ENCODED | enc_05: Schedule BP: A3c (income relatable to other sources credited to P&L) cannot exceed the income offered in Schedule OS. |
| 211 | A | ENCODED | enc_05: Schedule BP: A5d (exempt income credited to P&L) cannot exceed the exempt income declared in Schedule EI. |
| 212 | A | ENCODED | enc_05: Schedule BP: A6 must equal A1 − 2a − 2b − 3a − 3b − 3c − 3d − 3e − 3f − 4a − 4b − 4c − 5d − 5A. |
| 213 | A | ENCODED | enc_05: Schedule BP: A9 total must equal 7a + 7b + 7c + 7d + 7e + 7f + 8a + 8b. |
| 214 | A | ENCODED | enc_05: Schedule BP: A10 must equal A6 + A9. |
| 215 | A | ENCODED | enc_05: Schedule BP: A13 must equal 10 + 11 − 12iii. |
| 216 | A | ENCODED | enc_05: Schedule BP: A26 must equal 14 + 15 + 16 + 17 + 18 + 19 + 20 + 21 + 22 + 23 + 24 + 25. |
| 217 | A | ENCODED | enc_05: Schedule BP: A33 must equal 27 + 28 + 29 + 30 + 31 + 32. |
| 218 | A | ENCODED | enc_05: Schedule BP: A14 must equal 6t (total of item 6) of Part A-OI. |
| 219 | A | ENCODED | enc_05: Schedule BP: A15 must equal 7j of Part A-OI. |
| 220 | A | ENCODED | enc_05: Schedule BP: A16 must equal 8Aj of Part A-OI. |
| 221 | A | ENCODED | enc_05: Schedule BP: A17 must equal 9g of Part A-OI. |
| 222 | A | ENCODED | enc_05: Schedule BP: A18 must equal item 11 of Part A-OI. |
| 223 | A | ENCODED | enc_05: Schedule BP: A21 total must equal the sum of 21(i) to 21(xii). |
| 224 | A | ENCODED | enc_05: Schedule BP: A24 must equal 24(a) + 24(b) + 24(c) + 24(d) + 24(e). |
| 225 | A | ENCODED | enc_05: Schedule BP: A25 must equal 3a + 4d of Part A-OI. |
| 226 | A | ENCODED | enc_05: Schedule BP: A28 must equal the total of column (4) of Schedule ESR. |
| 227 | A | ENCODED | enc_05: Schedule BP: A29 must equal 8B of Part A-OI. |
| 228 | A | ENCODED | enc_05: Schedule BP: A30 must equal item 10 of Part A-OI. |
| 229 | A | ENCODED | enc_05: Schedule BP: A32 must equal 3b + 4e of Part A-OI. |
| 230 | A | ENCODED | enc_05: Schedule BP: A34 must equal 13 + 26 − 33. |
| 231 | A | ENCODED | enc_05: Schedule BP: A35(ix) must equal the sum of 35(i) to 35(viii). |
| 232 | A | ENCODED | enc_05: Schedule BP: A36 must equal A34 + A35(ix). |
| 233 | A | ENCODED | enc_05: Schedule BP: A37 must equal 37a + 37b + 37c + 37d + 37e + 37f. |
| 234 | A | ENCODED | enc_05: Schedule BP: B42 must equal B39 + B40 − B41. |
| 235 | A | ENCODED | enc_05: Schedule BP: C46 must equal C43 + C44 − C45. |
| 236 | A | ENCODED | enc_05: Schedule BP: C48 must equal C46 − C47. |
| 237 | A | ENCODED | enc_05: Schedule BP: D (income chargeable under the head) must equal A37 + B42 + C48. |
| 238 | A | ENCODED | enc_05: Schedule BP: the presumptive sections declared at A4a must match the sections declared at A35 (44AD/44ADA/44AE/44B/44BB/44BBA/44BBC/44BBD/44… |
| 239 | A | ENCODED | enc_05: Schedule BP: depreciation debited to P&L (11) must equal item 53 of the P&L plus item 1E(vi) of the Manufacturing Account. |
| 240 | A | ENCODED | enc_05: Schedule BP: the balance income after rule 7A/7B/8 must equal 4c − (37a + 37b + 37c + 37d + 37e). |
| 241 | A | ENCODED | enc_05: Schedule BP: A5d total exempt income must equal 5a (share of income from firm) + 5b (AOP/BOI) + 5c. |
| 242 | A | ENCODED | enc_05: Schedule BP: in Table E, business income remaining after set off must equal (income of current year) − (business loss set off). |
| 243 | A | ENCODED | enc_05: Schedule BP: E(v) total loss set off must equal E(ii) + E(iii) + E(iv). |
| 244 | A | ENCODED | enc_05: Schedule BP: E(vi) loss remaining after set off must equal E(i) − E(v). |
| 245 | A | ENCODED | enc_05: Schedule BP: A8b must equal item 16 of Part A-OI. |
| 246 | A | ENCODED | enc_05: Schedule BP: the nature of the specified business (C49) must be selected when income/loss from specified business (C48) is entered. |
| 247 | A | ENCODED | enc_05: Schedule BP: B39 must equal item 2a (net profit/loss from speculative business). |
| 248 | A | ENCODED | enc_05: Schedule BP: when presumptive income u/s 44AD/44ADA/44AE (35(i)/(ii)/(iii)) is greater than zero, the balance-sheet particulars under 'Regul… |
| 249 | A | ENCODED | enc_05: Schedule BP / OS: income under section 115BBF (income from patent) can be claimed only by a resident. |
| 250 | A | ENCODED | enc_05: Schedule BP: presumptive income u/s 44AD/44ADA can be declared only by a resident partnership firm. |
| 251 | A | OFFLINE-IMPOSSIBLE | dep u/s 32(1)(i) restricted to power-sector codes 05001/06008 — nature-of-business-code master list not carried |
| 252 | A | OFFLINE-IMPOSSIBLE | A4c rule-7A/7B/8 reduction restricted to codes 1001-1003 — code master list not carried |
| 253 | A | ENCODED | enc_06: Schedule BP: A12iii (total depreciation allowable under the Income-tax Act) must equal A12i + A12ii. |
| 254 | A | ENCODED | enc_06: Schedule BP: Sl.No.23 cannot be less than the sum of Sl.No.5a to 5d of Part A-OI (amounts not credited to the P&L). |
| 255 | A | ENCODED | enc_06: Schedule BP: deduction in accordance with section 35AD(1) at Sl.No.47 cannot be claimed by an assessee opting for the new tax regime. |
| 256 | A | ENCODED | enc_06: Schedule BP: Sl.No.24(e) must be at least the absolute of the sum of the negative (col.3 − col.2) values across all sections of Schedule ESR… |
| 257 | A | ENCODED | enc_06: Schedule BP: the amount reduced at Sl.No.3b cannot be more than the income offered in Schedule CG. |
| 258 | A | OFFLINE-IMPOSSIBLE | 'income credited to P&L' bound for Sl.3/Sl.5 reductions is not a single defined schema field; clean per-item parts encoded (257 CG, 260 dividend) |
| 259 | A | ENCODED | enc_06: Schedule BP: Sl.No.3c (Other Sources) must equal 3c(i) + 3c(ii). |
| 260 | A | ENCODED | enc_06: Schedule BP: Sl.No.3c(i) plus the 5c 'Dividend income' amount cannot be more than Sl.No.14iii of Schedule Profit & Loss. |
| 261 | A | MISSING | A1 (CorpScheduleBP...pbt) must equal PARTA_PL PBT(54)+PersumptiveInc44AD.TotPersumptiveInc44AD(62ii)+PersumptiveInc44ADA.TotPersumptiveInc44ADA(63ii)+TotalPrsumptvIncUs44E(64)+NoBooksOfAccPL.NetProfit/NetProfitPrf(65)+NetIncomeFrmSpecActivity(66iv)+NonResidentPL.NetProfit(67) — all operand fields exist; self-contained BP<->P&L equality (c… |
| 262 | A | OFFLINE-IMPOSSIBLE | 37a<->4c(i) Rule-7 (partly-agricultural) relationship is not a clean deterministic identity; source rule text truncated |
| 263 | A | ENCODED | enc_06: Schedule BP: Sl.No.37b (deemed income chargeable under Rule 7A) must be at least 35% of 4c(ii). |
| 264 | A | ENCODED | enc_06: Schedule BP: Sl.No.37c (deemed income chargeable under Rule 7B(1)) must be at least 25% of 4c(iii). |
| 265 | A | ENCODED | enc_06: Schedule BP: Sl.No.37d (deemed income chargeable under Rule 7B(1A)) must be at least 40% of 4c(iv). |
| 266 | A | ENCODED | enc_06: Schedule BP: Sl.No.37e (deemed income chargeable under Rule 8) must be at least 40% of 4c(v). |
| 267 | A | ENCODED | enc_06: Schedule BP: Sl.No.3f (u/s 115BBH, net of cost of acquisition) must match the business-head total of Schedule VDA. |
| 268 | A | ENCODED | enc_06: Schedule BP: at Sl.No.5c the 'Dividend income' amount cannot be more than zero. |
| 269 | A | ENCODED | enc_06: Schedule BP: Sl.No.43 must equal Sl.No.2b of Schedule BP. |
| 270 | A | OFFLINE-IMPOSSIBLE | 'sum of revenues in P&L / Trading Account' is not a single defined schema field |
| 271 | A | ENCODED | enc_06: Schedule BP: Sl.No.19 must equal Sl.No.17 (interest disallowed u/s 23 of the MSMED Act) of Part A-OI. |
| 272 | A | ENCODED | enc_06: Schedule BP: Sl.No.2a (net profit/loss from speculative business) must equal 12b of the Trading Account plus 66(iv) of the P&L Account. |
| 273 | A | ENCODED | enc_06: : Sl.No.6 (amount at full rate) must equal MAX(0, 3 + 4 − 5). |
| 274 | A | ENCODED | enc_06: : Sl.No.9 (amount at half rate) must equal MAX(0, 7 − 8). |
| 275 | A | ENCODED | enc_06: : Sl.No.15 (total depreciation) must equal 10 + 11 + 12 + 13 + 14. |
| 276 | A | ENCODED | enc_06: : Sl.No.17 (net aggregate depreciation) must equal MAX(0, 15 − 16). |
| 277 | A | ENCODED | enc_06: : additional depreciation at Sl.No.12/13/14 cannot be claimed by an assessee opting for the new tax regime. |
| 278 | A | ENCODED | enc_06: Schedule DPM: depreciation @45% cannot be claimed by an assessee opting for taxation u/s 115BAD (new tax regime). |
| 279 | A | OFFLINE-IMPOSSIBLE | literal strict equality DPM Sl.20=5+8-3-4-7-19 false-fires on lawful continuing blocks (Sl.20 is a conditional deemed-gain input); checkable content encoded as 285/286/287 |
| 280 | A | ENCODED | enc_06: : Sl.No.10 (depreciation at full rate) does not match the depreciation rate at Sl.No.2. |
| 281 | A | ENCODED | enc_06: : Sl.No.11 (depreciation at half rate) does not match the depreciation rate at Sl.No.2. |
| 282 | A | ENCODED | enc_06: : the adjustment as per the second proviso to section 115BAC(3) (Rule 5) at Sl.No.3b cannot be claimed by a firm, LLP or co-operative societ… |
| 283 | A | ENCODED | enc_06: : Sl.No.3 must equal 3a + 3b. |
| 284 | A | ENCODED | enc_06: : Sl.No.18 (proportionate depreciation) must be out of Sl.No.17 (net aggregate depreciation). |
| 285 | A | ENCODED | enc_06: : Sl.No.20 (capital gains/loss u/s 50) cannot be less than 5+8−3−4−7−19 when the consideration exceeds the opening WDV and additions. |
| 286 | A | ENCODED | enc_06: : when Sl.No.20 (capital gains u/s 50) is other than 0, Sl.No.10-18 and 21 must be 0. |
| 287 | A | ENCODED | enc_06: : when Sl.No.20 is 0, Sl.No.21 (WDV on last day) must equal 7 − 8 + 3 + 4 − 5 − 15. |
| 288 | A | ENCODED | enc_06: : Sl.No.6 must equal MAX(0, 3 + 4 − 5). |
| 289 | A | ENCODED | enc_06: : Sl.No.9 must equal MAX(0, 7 − 8). |
| 290 | A | ENCODED | enc_06: : total depreciation must equal 10 + 11. |
| 291 | A | ENCODED | enc_06: : Sl.No.14 (net aggregate depreciation) must equal MAX(0, 12 − 13). |
| 292 | A | OFFLINE-IMPOSSIBLE | same conditional-input issue as 279 (DOA Sl.17=5+8-3-4-7-16); checkable content encoded as 296/297/298 |
| 293 | A | ENCODED | enc_06: : Sl.No.10 (depreciation at full rate) does not match the depreciation rate at Sl.No.2. |
| 294 | A | ENCODED | enc_06: : Sl.No.11 (depreciation at half rate) does not match the depreciation rate at Sl.No.2. |
| 295 | A | ENCODED | enc_06: : Sl.No.15 (proportionate depreciation) must be out of Sl.No.14 (net aggregate depreciation). |
| 296 | A | ENCODED | enc_06: : Sl.No.17 (capital gains/loss u/s 50) cannot be less than 5+8−3−4−7−16 when the consideration exceeds the opening WDV and additions. |
| 297 | A | ENCODED | enc_06: : when Sl.No.17 (capital gains u/s 50) is other than 0, Sl.No.10,11,12,13,14,15 and 18 must be 0. |
| 298 | A | ENCODED | enc_06: : when Sl.No.17 is 0, Sl.No.18 (WDV on last day) must equal 7 − 8 + 3 + 4 − 5 − 12. |
| 299 | A | ENCODED | enc_06: Schedule DEP: depreciation allowable u/s 32(1)(ii) & (iia) in Schedule BP must equal item 6 (total depreciation) of Schedule DEP. |
| 300 | A | ENCODED | enc_06: not allowed to firm, LLP and Co-operative society or if New Tax Regime has been      opted for. |
| 301 | A | ENCODED | enc_07: Schedule DEP: 2d (total depreciation on building) must equal 2a + 2b + 2c. |
| 302 | A | ENCODED | enc_07: Schedule DEP: 6 (total depreciation) must equal 1e + 2d + 3 + 4 + 5 (nil if negative). |
| 303 | A | ENCODED | enc_07: Schedule DEP: 1a (P&M @15%) must equal Sl.17i/18i of Schedule DPM. |
| 304 | A | ENCODED | enc_07: Schedule DEP: 1b (P&M @30%) must equal Sl.17ii/18ii of Schedule DPM. |
| 305 | A | ENCODED | enc_07: Schedule DEP: 1c (P&M @40%) must equal Sl.17iii/18iii of Schedule DPM. |
| 306 | A | ENCODED | enc_07: Schedule DEP: 1d (P&M @45%) must equal Sl.17iv/18iv of Schedule DPM. |
| 307 | A | ENCODED | enc_07: Schedule DEP: 2a (building @5%) must equal Sl.14ii/15ii of Schedule DOA. |
| 308 | A | ENCODED | enc_07: Schedule DEP: 2b (building @10%) must equal Sl.14iii/15iii of Schedule DOA. |
| 309 | A | ENCODED | enc_07: Schedule DEP: 2c (building @40%) must equal Sl.14iv/15iv of Schedule DOA. |
| 310 | A | ENCODED | enc_07: Schedule DEP: 3 (furniture and fittings) must equal Sl.14v/15v of Schedule DOA. |
| 311 | A | ENCODED | enc_07: Schedule DEP: 4 (intangible assets) must equal Sl.14vi/15vi of Schedule DOA. |
| 312 | A | ENCODED | enc_07: Schedule DEP: 5 (ships) must equal Sl.14vii/15vii of Schedule DOA. |
| 313 | A | ENCODED | enc_07: Schedule DCG: 1e (total plant & machinery) must equal 1a + 1b + 1c + 1d. |
| 314 | A | ENCODED | enc_07: Schedule DCG: 2d (total building) must equal 2a + 2b + 2c. |
| 315 | A | ENCODED | enc_07: Schedule DCG: 6 (total) must equal 1e + 2d + 3 + 4 + 5. |
| 316 | A | ENCODED | enc_07: Schedule DCG: 1a (block @15%) must equal Sl.20i of Schedule DPM. |
| 317 | A | ENCODED | enc_07: Schedule DCG: 1b (block @30%) must equal Sl.20ii of Schedule DPM. |
| 318 | A | ENCODED | enc_07: Schedule DCG: 1c (block @40%) must equal Sl.20iii of Schedule DPM. |
| 319 | A | ENCODED | enc_07: Schedule DCG: 1d (block @45%) must equal Sl.20iv of Schedule DPM. |
| 320 | A | ENCODED | enc_07: Schedule DCG: 2a (building @5%) must equal Sl.17ii of Schedule DOA. |
| 321 | A | ENCODED | enc_07: Schedule DCG: 2b (building @10%) must equal Sl.17iii of Schedule DOA. |
| 322 | A | ENCODED | enc_07: Schedule DCG: 2c (building @40%) must equal Sl.17iv of Schedule DOA. |
| 323 | A | ENCODED | enc_07: Schedule DCG: 3 (furniture and fittings) must equal Sl.17v of Schedule DOA. |
| 324 | A | ENCODED | enc_07: Schedule DCG: 4 (intangible assets) must equal Sl.17vi of Schedule DOA. |
| 325 | A | ENCODED | enc_07: Schedule DCG: 5 (ships) must equal Sl.17vii of Schedule DOA. |
| 326 | A | ENCODED | enc_07: Schedule CG: A6e (deemed STCG on depreciable assets) must equal Sl.6 of Schedule DCG. |
| 327 | A | ENCODED | enc_07: : the amount of deduction allowable (col 3) must equal the amount debited to profit and loss account (col 2). |
| 328 | A | ENCODED | enc_07: Schedule ESR: total (col 4) must equal the sum of rows (i + ii + iii + iv + v + vi + vii + viii + ix). |
| 329 | A | ENCODED | ENCODED via computed serial sn=329+idx in §35 ESR loop A(sn,REQ(allow,deb)) — col(3) must equal col(2) per row |
| 330 | A | ENCODED | ENCODED via computed serial sn=329+idx in §35 ESR loop A(sn,REQ(allow,deb)) — col(3) must equal col(2) per row |
| 331 | A | ENCODED | ENCODED via computed serial sn=329+idx in §35 ESR loop A(sn,REQ(allow,deb)) — col(3) must equal col(2) per row |
| 332 | A | ENCODED | ENCODED via computed serial sn=329+idx in §35 ESR loop A(sn,REQ(allow,deb)) — col(3) must equal col(2) per row |
| 333 | A | ENCODED | ENCODED via computed serial sn=329+idx in §35 ESR loop A(sn,REQ(allow,deb)) — col(3) must equal col(2) per row |
| 334 | A | ENCODED | ENCODED via computed serial sn=329+idx in §35 ESR loop A(sn,REQ(allow,deb)) — col(3) must equal col(2) per row |
| 335 | A | ENCODED | ENCODED via computed serial sn=329+idx in §35 ESR loop A(sn,REQ(allow,deb)) — col(3) must equal col(2) per row |
| 336 | A | ENCODED | ENCODED via computed serial sn=329+idx in §35 ESR loop A(sn,REQ(allow,deb)) — col(3) must equal col(2) per row |
| 337 | A | ENCODED | ENCODED via computed serial sn=329+idx in §35 ESR loop A(sn,REQ(allow,deb)) — col(3) must equal col(2) per row |
| 338 | A | ENCODED | enc_07: Schedule CG: B12 (total LTCG) must equal B1g + B2e + B3c + B4 + B5 + B6c + B7 + B8e + B9 + B10 − B11a + B(A). |
| 339 | A | ENCODED | enc_07: Schedule CG: C1 (sum of capital gain incomes) must equal 8ii + 8iii + 8iv + 8v + 8vi + 8vii of table E. |
| 340 | A | ENCODED | ENCODED via noS48IfNoFVC(340,..): if FVC=0 then s.48 deduction (bv) must be 0 [A1 land/building] |
| 341 | A | ENCODED | ENCODED via noS48IfNoFVC(341,..): if FVC=0 then s.48 deduction (bv) must be 0 [A3 equity/MF STT] |
| 342 | A | ENCODED | ENCODED via noS48IfNoFVC(342,..): if FVC=0 then s.48 deduction (bv) must be 0 [A5 FII 115AD] |
| 343 | A | ENCODED | ENCODED via noS48IfNoFVC(343,..): if FVC=0 then s.48 deduction (bv) must be 0 [A6 other assets] |
| 344 | A | ENCODED | ENCODED via noS48IfNoFVC(344,..): if FVC=0 then s.48 deduction (bv) must be 0 [B1 LTCG land/building] |
| 345 | A | ENCODED | ENCODED via noS48IfNoFVC(345,..): if FVC=0 then s.48 deduction (bv) must be 0 [B3 listed sec/ZCB 112(1)] |
| 346 | A | ENCODED | ENCODED via noS48IfNoFVC(346,..): if FVC=0 then s.48 deduction (bv) must be 0 [B6 non-resident sec 112(1)(c)] |
| 347 | A | ENCODED | ENCODED via noS48IfNoFVC(347,..): if FVC=0 then s.48 deduction (bv) must be 0 [B8 LTCG residual] |

## Counts per bucket

- ENCODED: 331
- NA: 6
- OFFLINE-IMPOSSIBLE: 9
- MISSING: 1
- TOTAL: 347

NA serials (6): 9, 24, 39, 40, 59, 60 — external form/portal/other-ITR/filing-date state.
OFFLINE-IMPOSSIBLE serials (9): 53, 54, 251, 252, 258, 262, 270, 279, 292 — external DB (PAN), nature-of-business-code master list, undefined 'revenue'/'income credited' aggregate field, non-clean Rule-7 identity, or conditional-input strict equality whose checkable content is encoded under other serials.

**MISSING: 261** — serial 261 (Schedule BP A1 = Σ P&L 54/62ii/63ii/64/65/66iv/67): every operand is a built ITR-5 schema field (PARTA_PL.DebitsToPL.DebitPlAcnt.PBT, PersumptiveInc44AD/44ADA totals, TotalPrsumptvIncUs44E, NoBooksOfAccPL.NetProfit(+Prf), NetIncomeFrmSpecActivity, NonResidentPL.NetProfit) checked against the CorpScheduleBP input A1 (pbt). This self-contained BP<->P&L consistency equality could have been encoded like its sibling checks (253/259/269/272) but was left uncoded (encoder cited caution over the 64v/65iii key mapping).
