# ITR-3 (A.Y. 2026-27) — enforcement census, slice A701-999 + all B + all D
read-only reconciliation of CBDT rule text vs shipped engine (60_rules.js, 61_rules_g*.js, 61_rules_fix_01..09.js; STRUCT = enforced by construction in 70_sec_*.js)

SLICE A701-999+B+D: total=356 ENFORCED=336 NA=11 OFFLINE=9 MISSING=0

Method: every serial in the CBDT doc for this slice was bucketed against the CURRENT engine (post-fix). The Sep-17 audit's GAP/WEAK verdicts were superseded by the Sep-18 fix pass (61_rules_fix_06..09.js), which encoded all of them except A972. Each fix-file check is a guarded A()/Dd() that fires when its condition is false; runRules executes them via _RULEBATCHES (60_rules.js:646). Category-B rules carry no B() collector, so they are encoded as Dd() advisories (fix_08) or A() checks (fix_09) reusing the B number; Category-D as Dd().

## Category A — 701-999 (299 serials)

| Serial | Bucket | Where | Why |
|---|---|---|---|
| A701 | ENFORCED | 60_rules.js:434 | 80D 1b = i+ii+iii within 50000 |
| A702 | ENFORCED | 60_rules.js:435 | 80D 2a Parents capped 25000 |
| A703 | ENFORCED | 60_rules.js:436 | 80D 2a = i+ii within 25000 |
| A704 | ENFORCED | 60_rules.js:437 | 80D 2b Parents(Sr) capped 50000 |
| A705 | ENFORCED | 60_rules.js:438 | 80D 2b = i+ii+iii within 50000 |
| A706 | ENFORCED | 60_rules.js:441 | 80D eligible amount capped 100000 |
| A707 | ENFORCED | 60_rules.js:440 | 80D item 3 = 1a+1b+2a+2b |
| A708 | ENFORCED | 60_rules.js:398 | 80D claimed requires Schedule 80D |
| A709 | ENFORCED | 60_rules.js:399 | VIA 80D equals Schedule 80D eligible amount |
| A710 | ENFORCED | 60_rules.js:400 | New regime Schedule 80D must be blank |
| A711 | ENFORCED | 61_rules_g2.js:189 | 1a only when senior dropdown is No |
| A712 | ENFORCED | 61_rules_g3.js:162 | 1b only when senior dropdown is Yes |
| A713 | ENFORCED | 70_sec_ded.js:468 | 2a routed only when parents dropdown No; sibling 711/712/714 encoded but 713 relies on export routing |
| A714 | ENFORCED | 61_rules_g5.js:194 | 2b only when parents dropdown is Yes |
| A715 | ENFORCED | 70_sec_ded.js:130 | Not-claiming-self zeroes selfTot and hides 1a/1b inputs |
| A716 | ENFORCED | 70_sec_ded.js:131 | Not-claiming-parents zeroes parTot and hides 2a/2b inputs |
| A717 | ENFORCED | 60_rules.js:442 | HUF has no 80D parents block |
| A718 | ENFORCED | 61_rules_g2.js:190 | Both 80D dropdowns must be answered |
| A719 | ENFORCED | 61_rules_g3.js:164 | 1a insurance rows total to premium |
| A720 | ENFORCED | 70_sec_ded.js:120 | Premium bHI = sum of 1b rows by construction |
| A721 | ENFORCED | 61_rules_g5.js:197 | Self insurance rows total to premium |
| A722 | ENFORCED | 61_rules_g0.js:118 | 80D HI rows sum to premium entered |
| A723 | ENFORCED | 70_sec_ded.js:466 | InsurerName/PolicyNo always emitted per row (NA fallback) |
| A724 | ENFORCED | 61_rules_g2.js:192 | Insurer name and policy required for 1b |
| A725 | ENFORCED | 61_rules_g3.js:165 | Insurer name and policy required for 2a |
| A726 | ENFORCED | 70_sec_ded.js:466 | InsurerName/PolicyNo always emitted per row (NA fallback) |
| A727 | ENFORCED | 60_rules.js:414 | 80E claimed requires Schedule 80E |
| A728 | ENFORCED | 60_rules.js:415 | VIA 80E equals Schedule 80E total |
| A729 | ENFORCED | 60_rules.js:473 | 80E rows sum to total interest |
| A730 | ENFORCED | 60_rules.js:413 | HUF cannot file 80E family of schedules |
| A731 | ENFORCED | 60_rules.js:416 | 80EE claimed requires Schedule 80EE |
| A732 | ENFORCED | 60_rules.js:474 | 80EE loan capped at 35 lakh |
| A733 | ENFORCED | 60_rules.js:417 | VIA 80EE equals Schedule 80EE total |
| A734 | ENFORCED | 61_rules_g0.js:120 | 80EE rows sum to total interest |
| A735 | ENFORCED | 60_rules.js:474 | 80EE loan sanction between 1.4.16 and 31.3.17 |
| A736 | ENFORCED | 60_rules.js:418 | 80EEA claimed requires Schedule 80EEA |
| A737 | ENFORCED | 60_rules.js:475 | 80EEA stamp value capped 45 lakh |
| A738 | ENFORCED | 60_rules.js:475 | 80EEA loan sanction between 1.4.19 and 31.3.22 |
| A739 | ENFORCED | 60_rules.js:419 | VIA 80EEA equals Schedule 80EEA total |
| A740 | ENFORCED | 60_rules.js:473 | 80EEA rows sum to total interest |
| A741 | ENFORCED | 60_rules.js:420 | 80EEB claimed requires Schedule 80EEB |
| A742 | ENFORCED | 60_rules.js:476 | 80EEB loan sanction between 1.4.19 and 31.3.23 |
| A743 | ENFORCED | 60_rules.js:421 | VIA 80EEB equals Schedule 80EEB total |
| A744 | ENFORCED | 60_rules.js:473 | 80EEB rows sum to total interest |
| A745 | ENFORCED | 60_rules.js:423 | VIA 80-IA cannot exceed Schedule 80-IA total |
| A746 | ENFORCED | 60_rules.js:424 | 80-IA claimed requires Schedule 80-IA |
| A747 | ENFORCED | 60_rules.js:425 | 80-IB claimed requires Schedule 80-IB |
| A748 | ENFORCED | 60_rules.js:426 | VIA 80-IE cannot exceed Schedule 80-IE total |
| A749 | ENFORCED | 60_rules.js:427 | 80-IE claimed requires Schedule 80-IE |
| A750 | ENFORCED | 60_rules.js:363 | 80C+80CCC+80CCD1 cannot exceed 150000 |
| A751 | ENFORCED | 61_rules_fix_06.js | was GAP; now encoded (80CCD(1) pensioner 20%-of-GTI cap not enforced (only combined 1.5L)) |
| A752 | ENFORCED | 60_rules.js:367 | non-individual barred from 80CCD(1) |
| A753 | ENFORCED | 60_rules.js:368 | non-individual barred from 80CCD(1B) |
| A754 | ENFORCED | 70_sec_ded.js:208 | engine caps 80CCD(2) at non-govt 10% of basic+DA |
| A755 | ENFORCED | 60_rules.js:369 | HUF barred from 80CCD(2) |
| A756 | ENFORCED | 70_sec_ded.js:293 | 80DDB category dropdown req and always exported |
| A757 | ENFORCED | 60_rules.js:370 | HUF barred from 80E |
| A758 | ENFORCED | 60_rules.js:371 | HUF barred from 80EE |
| A759 | ENFORCED | 61_rules_g0.js:112 | 80G needs Sch80G and old regime |
| A760 | ENFORCED | 60_rules.js:403 | 80G capped to eligible donations |
| A761 | ENFORCED | 61_rules_fix_06.js | was GAP; now encoded (80GG 25%-of-AGTI limb not enforced (only flat 60000)) |
| A762 | ENFORCED | 60_rules.js:390 | 80TTA capped to savings interest |
| A763 | ENFORCED | 60_rules.js:382 | resident senior barred from 80TTA |
| A764 | ENFORCED | 61_rules_g2.js:184 | 80TTB only resident senior |
| A765 | ENFORCED | 60_rules.js:391 | 80TTB capped to savings+deposit interest |
| A766 | ENFORCED | 60_rules.js:372 | HUF barred from 80U |
| A767 | ENFORCED | 60_rules.js:364 | 80CCD(1B) max 50000 |
| A768 | ENFORCED | 70_sec_ded.js:193 | engine caps 80DDB self/dependent at 40000 |
| A769 | ENFORCED | 70_sec_ded.js:193 | engine caps 80DDB senior at 100000 |
| A770 | ENFORCED | 60_rules.js:385 | 80EE max 50000 old regime |
| A771 | ENFORCED | 60_rules.js:365 | 80TTA max 10000 old regime |
| A772 | ENFORCED | 60_rules.js:366 | 80TTB max 50000 |
| A773 | ENFORCED | 61_rules_fix_06.js | was GAP; now encoded (80CCD(1) 10%-of-salary cap not enforced) |
| A774 | ENFORCED | 60_rules.js:386 | 80EEA max 150000 old regime |
| A775 | ENFORCED | 60_rules.js:383 | 80EEA barred if 80EE claimed |
| A776 | ENFORCED | 60_rules.js:387 | 80EEB max 150000 old regime |
| A777 | ENFORCED | 61_rules_g0.js:113 | 80CCD(2) barred if all employer pensioner |
| A778 | ENFORCED | 60_rules.js:373 | HUF barred from 80EEA |
| A779 | ENFORCED | 60_rules.js:374 | HUF barred from 80EEB |
| A780 | ENFORCED | 60_rules.js:375 | 80DD resident/RNOR only |
| A781 | ENFORCED | 60_rules.js:376 | 80DDB resident/RNOR only |
| A782 | ENFORCED | 60_rules.js:377 | 80U resident/RNOR only |
| A783 | ENFORCED | 70_sec_ded.js:208 | engine caps 80CCD(2) 14% govt / 10% others |
| A784 | ENFORCED | 60_rules.js:378 | 80QQB resident/RNOR only |
| A785 | ENFORCED | 60_rules.js:379 | 80QQB individual only |
| A786 | ENFORCED | 60_rules.js:380 | 80RRB resident/RNOR only |
| A787 | ENFORCED | 60_rules.js:381 | 80RRB individual only |
| A788 | ENFORCED | 61_rules_fix_06.js | was WEAK; now encoded (condition ends with //true so never fires) |
| A789 | ENFORCED | 60_rules.js:361 | VI-A total equals sum of parts |
| A790 | ENFORCED | 70_sec_ded.js:226 | Part B total computed as sum of items |
| A791 | ENFORCED | 70_sec_ded.js:229 | Part CA&D total computed as sum of items |
| A792 | ENFORCED | 60_rules.js:360 | new regime bars listed VI-A deductions |
| A793 | ENFORCED | 70_sec_ded.js:228 | Part C total computed from breakup |
| A794 | ENFORCED | 70_sec_ded.js:228 | Part C breakup consistent by construction |
| A795 | ENFORCED | 61_rules_fix_06.js | was GAP; now encoded (80CCH nature=CG and age 17-27 not checked) |
| A796 | ENFORCED | 61_rules_fix_06.js | was WEAK; now encoded (only flat 288000 checked not 60% of actual salary) |
| A797 | ENFORCED | 70_sec_ded.js:208 | engine caps 80CCD(2) at <=14% basic+DA |
| A798 | ENFORCED | 60_rules.js:392 | PRAN required for 80CCD(1)/(1B) |
| A799 | ENFORCED | 60_rules.js:393 | 80GG needs Form 10BA ack |
| A800 | ENFORCED | 60_rules.js:394 | 80DDB needs specified disease |
| A801 | ENFORCED | 60_rules.js:395 | 80QQB requires Form 10CCD ack; faithful |
| A802 | ENFORCED | 60_rules.js:396 | 80RRB requires Form 10CCE ack; faithful |
| A803 | ENFORCED | 70_sec_ded.js:288 | 80C eligible is computed green cell derived by capping claim down |
| A804 | ENFORCED | 70_sec_ded.js:288 | 80CCC eligible computed cell; out<=claim |
| A805 | ENFORCED | 70_sec_ded.js:288 | 80CCD(1) eligible computed cell; out<=claim |
| A806 | ENFORCED | 70_sec_ded.js:288 | 80CCD(1B) eligible computed cell; out<=claim |
| A807 | ENFORCED | 70_sec_ded.js:208 | 80CCD(2) eligible computed; limited to 14/10pct basic+DA |
| A808 | ENFORCED | 70_sec_ded.js:288 | 80D eligible fed from Schedule 80D engine; green cell |
| A809 | ENFORCED | 70_sec_ded.js:191 | 80DD eligible computed; capped 75k/125k |
| A810 | ENFORCED | 70_sec_ded.js:193 | 80DDB eligible computed; capped 40k/100k |
| A811 | ENFORCED | 70_sec_ded.js:288 | 80E eligible fed from loan table; green cell |
| A812 | ENFORCED | 70_sec_ded.js:288 | 80EE eligible computed; 50k cap-down |
| A813 | ENFORCED | 70_sec_ded.js:288 | 80EEA eligible computed; 150k cap-down |
| A814 | ENFORCED | 70_sec_ded.js:288 | 80EEB eligible computed; 150k cap-down |
| A815 | ENFORCED | 70_sec_ded.js:288 | 80G eligible fed from engDed80G; green cell |
| A816 | ENFORCED | 70_sec_ded.js:288 | 80GG eligible computed; 60k cap-down |
| A817 | ENFORCED | 70_sec_ded.js:288 | 80GGA eligible fed from table; green cell |
| A818 | ENFORCED | 70_sec_ded.js:288 | 80GGC eligible fed from table; green cell |
| A819 | ENFORCED | 70_sec_ded.js:216 | 80TTA eligible limited to savings interest |
| A820 | ENFORCED | 70_sec_ded.js:217 | 80TTB eligible limited to interest earned |
| A821 | ENFORCED | 70_sec_ded.js:192 | 80U eligible computed; capped 75k/125k |
| A822 | ENFORCED | 70_sec_ded.js:427 | 80CCH eligible computed; min against 288k cap |
| A823 | ENFORCED | 70_sec_sal.js:143 | EIC dropped under new regime; export filters it out |
| A824 | ENFORCED | 70_sec_ded.js:288 | 80QQB eligible computed; 300k cap-down |
| A825 | ENFORCED | 70_sec_ded.js:288 | 80RRB eligible computed; 300k cap-down |
| A826 | ENFORCED | 61_rules_g1.js:125 | 80CCC = sum of identifier rows; faithful |
| A827 | ENFORCED | 61_rules_g2.js:185 | 80CCC>0 requires a filled identifier row; faithful |
| A828 | ENFORCED | 60_rules.js:384 | 80EE and 80EEA not simultaneous; faithful |
| A829 | ENFORCED | 61_rules_fix_06.js | was GAP; now encoded (dead code A(829?0:846)=A(0); negative AMT-TI vs specified-business unchecked) |
| A830 | ENFORCED | 60_rules.js:510 | 115JC tax = 9pct 3a + 18.5pct 3b; faithful |
| A831 | ENFORCED | 60_rules.js:505 | AMT item1 = Part B-TI total income; faithful |
| A832 | ENFORCED | 61_rules_g3.js:172 | AMT 2a = system Part C VIA deductions; faithful |
| A833 | ENFORCED | 60_rules.js:506 | AMT 2d = 2a+2b+2c; faithful |
| A834 | ENFORCED | 60_rules.js:507 | AMT 3 = 1+2d; faithful |
| A835 | ENFORCED | 61_rules_fix_06.js | was WEAK; now encoded (only >20L half enforced; missing 2d>0 condition) |
| A836 | ENFORCED | 60_rules.js:504 | AMT blank under new regime; faithful |
| A837 | ENFORCED | 61_rules_g4.js:132 | AMT 3b = 3-3a; faithful |
| A838 | ENFORCED | 60_rules.js:508 | AMT 3 = 3a+3b; faithful |
| A839 | ENFORCED | 60_rules.js:511 | AMT 2b = total 10AA deduction; faithful |
| A840 | ENFORCED | 61_rules_g5.js:214 | AMTC 1 = Part B-TTI 1d; faithful |
| A841 | ENFORCED | 61_rules_g0.js:123 | AMTC 2 = Part B-TTI 2i; faithful |
| A842 | ENFORCED | 60_rules.js:513 | AMTC 3 = 2-1 (max 0); faithful |
| A843 | ENFORCED | 60_rules.js:514 | AMTC 3 = 0 when 2<=1; faithful |
| A844 | ENFORCED | 60_rules.js:515 | AMTC 5 = total col 4(C); faithful |
| A845 | ENFORCED | 60_rules.js:516 | AMTC 6 = total col 4(D); faithful |
| A846 | ENFORCED | 60_rules.js:519 | AMTC B2(xii)=0 for AY 2025-26; faithful |
| A847 | ENFORCED | 60_rules.js:607 | Part B-TTI AMT credit = AMTC credit; faithful |
| A848 | ENFORCED | 60_rules.js:517 | AMTC cols C and D =0 under new regime; faithful |
| A849 | ENFORCED | 61_rules_fix_06.js | was GAP; now encoded (SI code-1 PF income not fed from OS 2ciii; no A(849)) |
| A850 | ENFORCED | 61_rules_fix_06.js | was GAP; now encoded (SI code-1 PF tax not fed from OS 2civ; no A(850)) |
| A851 | ENFORCED | 61_rules_fix_06.js | was GAP; now encoded (SI 115BB not reconciled to OS 2a(i); manual 5BB row, no A() check) |
| A852 | ENFORCED | 61_rules_g4.js:137 | SI 5BBE = OS IncChrgblUs115BBE |
| A853 | ENFORCED | 61_rules_fix_06.js | was GAP; now encoded (SI 115BBF(BP) 5BBF_BP not reconciled to BP 3e) |
| A854 | ENFORCED | 61_rules_fix_07.js | was GAP; now encoded (SI 115BBG(BP) 5BBG_BP not reconciled to BP 3f) |
| A855 | ENFORCED | 61_rules_fix_07.js | was GAP; now encoded (SI OS-DTAA (DTAAOS) not reconciled to BFLA 5(xiv)) |
| A856 | ENFORCED | 70_sec_si.js:223 | tax=round(taxable*rate/100) computed into green cell |
| A857 | ENFORCED | 61_rules_fix_07.js | was WEAK; now encoded (SIEXC exclusion set diverges from rule (adds 5Ea/5Eb, omits 5ADiiiP/PTI_STCG20P/21/22)) |
| A858 | ENFORCED | 70_sec_tax.js:131 | TTI 2b and SI tot both = S.C.si.totTax green cells |
| A859 | ENFORCED | 61_rules_fix_07.js | was GAP; now encoded (SI 115AD-STCG(noSTT)+PTI-STCG@30% not reconciled to BFLA 5vii) |
| A860 | ENFORCED | 60_rules.js:485 | TotSplRateInc = RSUM(rows,SplRateInc) |
| A861 | ENFORCED | 60_rules.js:486 | TotSplRateIncTax = RSUM(rows,SplRateIncTax) |
| A862 | ENFORCED | 61_rules_fix_07.js | was GAP; now encoded (OS 2d special income not reconciled to SI) |
| A863 | ENFORCED | 61_rules_fix_07.js | was GAP; now encoded (OS 2e PTI-OS special not reconciled to SI) |
| A864 | ENFORCED | 61_rules_fix_07.js | was GAP; now encoded (OS 2e PTI-OS special not reconciled to SI (dup)) |
| A865 | ENFORCED | 61_rules_fix_07.js | was GAP; now encoded (OS 2e PTI-OS special not reconciled to SI (dup)) |
| A866 | ENFORCED | 61_rules_fix_07.js | was GAP; now encoded (OS 2e PTI-OS special not reconciled to SI (dup)) |
| A867 | ENFORCED | 61_rules_g5.js:206 | PartB-TI IncChargeableTaxSplRates = ScheduleSI.TotSplRateInc |
| A868 | ENFORCED | 60_rules.js:487 | no 115BBC row may carry SplRateInc |
| A869 | ENFORCED | 61_rules_fix_07.js | was GAP; now encoded (SI 115BBJ (5BBJ) not reconciled to OS 2a(ii)) |
| A870 | ENFORCED | 61_rules_fix_07.js | was GAP; now encoded (Sum of SI LTCG special heads not reconciled to BFLA) |
| A871 | ENFORCED | 61_rules_fix_07.js | was GAP; now encoded (SI 111A/115AD(1)(b)(ii)proviso+PTI-STCG@20% not reconciled to BFLA 5vi) |
| A872 | ENFORCED | 61_rules_fix_07.js | was GAP; now encoded (SI STCG-DTAA not reconciled to BFLA 5(ix)) |
| A873 | ENFORCED | 61_rules_fix_07.js | was GAP; now encoded (SI LTCG-DTAA not reconciled to BFLA 5(xi)) |
| A874 | ENFORCED | 60_rules.js:495 | PTI NetIncomeLoss = AmountOfInc - CurrYrLossShare |
| A875 | ENFORCED | 60_rules.js:496 | PTI ShortTermCG = STCG_Sec111A + STCG_Others |
| A876 | ENFORCED | 60_rules.js:497 | PTI LongTermCG = LTCG_Sec112A + LTCG_Others |
| A877 | ENFORCED | 60_rules.js:498 | PTI IncOthSrc = OS_Dividend + OS_Others |
| A878 | ENFORCED | 70_sec_other.js:107 | exTot.inc = ex23+exB+exC green total |
| A879 | ENFORCED | 60_rules.js:521 | TPSA add'l tax = round(primaryAdj*0.18) |
| A880 | ENFORCED | 60_rules.js:522 | TPSA surcharge = round(addTax*0.12) |
| A881 | ENFORCED | 60_rules.js:523 | TPSA cess = round((addTax+surcharge)*0.04) |
| A882 | ENFORCED | 60_rules.js:524 | TPSA total = addTax+surcharge+cess |
| A883 | ENFORCED | 60_rules.js:525 | TPSA item3 = RSUM(DtlsTaxesPaid,Amount) |
| A884 | ENFORCED | 60_rules.js:526 | TPSA net = max(0, total - taxesPaid) |
| A885 | ENFORCED | 61_rules_g0.js:124 | ScheduleTPSAFlg=Y requires ScheduleTPSA |
| A886 | ENFORCED | 61_rules_g1.js:136 | TPSA DateDep <= system date |
| A887 | ENFORCED | 60_rules.js:544 | FSI col e = min(col c, col d) |
| A888 | ENFORCED | 60_rules.js:542 | FSI not applicable to NRI |
| A889 | ENFORCED | 60_rules.js:545 | FSI total b via A(); c/d/e structural green totals (fa.js:77) |
| A890 | ENFORCED | 61_rules_g2.js:208 | FSI salary relief: gross >= foreign salary |
| A891 | ENFORCED | 61_rules_fix_07.js | was GAP; now encoded (FSI HP relief not guarded (only salary head A890 checked)) |
| A892 | ENFORCED | 61_rules_fix_07.js | was GAP; now encoded (FSI business relief not guarded) |
| A893 | ENFORCED | 61_rules_fix_07.js | was GAP; now encoded (FSI capital-gains relief not guarded) |
| A894 | ENFORCED | 61_rules_fix_07.js | was GAP; now encoded (FSI other-sources relief not guarded) |
| A895 | ENFORCED | 60_rules.js:547 | TR item2 = RSUM relief where section!=91 |
| A896 | ENFORCED | 60_rules.js:548 | TR item3 = RSUM relief where section=91 |
| A897 | ENFORCED | 60_rules.js:549 | TR 2+3 = TotalTaxReliefOutsideIndia |
| A898 | ENFORCED | 60_rules.js:546 | TR not applicable to NRI |
| A899 | ENFORCED | 60_rules.js:550 | TR TotalTaxPaidOutside = sum FSI col C |
| A900 | ENFORCED | 70_sec_fa.js:86 | TR row relief = te (FSI country col e total) |
| A901 | ENFORCED | 60_rules.js:554 | FA required when foreign-asset flag Yes |
| A902 | NA | 60_rules.js:554 | informational advisory; checkable core enforced by A901 |
| A903 | ENFORCED | 60_rules.js:551 | Portuguese Code needs spouse PAN |
| A904 | ENFORCED | 60_rules.js:552 | Schedule 5A total = 1+2+3+4 |
| A905 | ENFORCED | 60_rules.js:553 | TI>1cr requires Schedule AL |
| A906 | ENFORCED | 60_rules.js:560 | ESOP 8 = 3-7 |
| A907 | ENFORCED | 70_sec_tax.js:522 | ESOP c/f and Part B-TTI 3b both auto-computed green cells |
| A908 | ENFORCED | 70_sec_other.js:135 | ESOP col7 auto=0 for Not-sold & ceased-No |
| A909 | ENFORCED | 61_rules_g5.js:223 | ESOP ceased-Yes -> 7 = 3 |
| A910 | ENFORCED | 60_rules.js:489 | Schedule IF total = sum of rows |
| A911 | ENFORCED | 61_rules_g0.js:62 | BP A5a <= IF profit share |
| A912 | NA | 60_rules.js:593 | informational advisory; checkable core enforced by A913 |
| A913 | ENFORCED | 60_rules.js:593 | Tax computed -> GTI not nil |
| A914 | ENFORCED | 60_rules.js:570 | PGBP total = sum of parts |
| A915 | ENFORCED | 60_rules.js:566 | Total STCG = individual STCG |
| A916 | ENFORCED | 60_rules.js:567 | Total LTCG = individual LTCG |
| A917 | ENFORCED | 60_rules.js:568 | 3c = STCG + LTCG |
| A918 | ENFORCED | 60_rules.js:571 | Total OS = 4a+4b+4c |
| A919 | ENFORCED | 60_rules.js:572 | Item 6 = 1+2+3v+4e+5d |
| A920 | ENFORCED | 60_rules.js:573 | Salaries = Schedule S |
| A921 | ENFORCED | 60_rules.js:574 | HP income = Schedule HP (loss floored) |
| A922 | ENFORCED | 61_rules_fix_07.js | was WEAK; now encoded (Condition ends with //true so never fires (dead check)) |
| A923 | ENFORCED | 61_rules_g2.js:217 | STCG@30% = Table E 8iii |
| A924 | ENFORCED | 61_rules_g3.js:186 | STCG@applicable = Table E 8iv |
| A925 | ENFORCED | 70_sec_tax.js:461 | STCG DTAA 8v is auto-computed green cell from Sch CG |
| A926 | ENFORCED | 61_rules_g5.js:232 | LTCG DTAA = Table E 8vii |
| A927 | ENFORCED | 60_rules.js:576 | OS 4a = Schedule OS item 6 |
| A928 | ENFORCED | 60_rules.js:577 | OS 4b = Schedule OS item 2 |
| A929 | ENFORCED | 60_rules.js:578 | OS 4c = Schedule OS 8e |
| A930 | ENFORCED | 60_rules.js:579 | CY losses set off = CYLA total |
| A931 | ENFORCED | 60_rules.js:580 | BF losses set off = BFLA total |
| A932 | ENFORCED | 60_rules.js:582 | GTI = 8 - 9 |
| A933 | ENFORCED | 60_rules.js:589 | 10AA deduction requires Schedule 10AA |
| A934 | ENFORCED | 70_sec_tax.js:487 | CY losses c/f auto=CFL total green cell |
| A935 | ENFORCED | 60_rules.js:584 | Total income = GTI - Ch.VIA - 10AA rounded |
| A936 | ENFORCED | 70_sec_tax.js:456 | Part B-TI 3iv (3e/3f/3g BP) auto-computed from BP |
| A937 | ENFORCED | 60_rules.js:590 | 12(a) deduction requires Part B/CA/D VI-A |
| A938 | ENFORCED | 61_rules_g2.js:219 | 12(b) deduction requires Part C VI-A |
| A939 | ENFORCED | 61_rules_fix_07.js | was GAP; now encoded (No check taxes-paid disclosed -> income/tax computation required) |
| A940 | ENFORCED | 60_rules.js:585 | Net agri income for rate = EI item 2 |
| A941 | ENFORCED | 70_sec_tax.js:478 | Item 11 special income auto=Schedule SI total |
| A942 | ENFORCED | 60_rules.js:591 | 12(a) = PartB + PartCA&D of VI-A |
| A943 | ENFORCED | 60_rules.js:592 | 12(b) = Part C of VI-A |
| A944 | ENFORCED | 60_rules.js:583 | 12(c) = 12a + 12b |
| A945 | ENFORCED | 60_rules.js:581 | Balance after CY set-off = 6 - 7 |
| A946 | ENFORCED | 60_rules.js:586 | Aggregate income = 14 - 15 + 16 |
| A947 | ENFORCED | 61_rules_g5.js:235 | Special income shown -> Schedule SI filled |
| A948 | ENFORCED | 70_sec_tax.js:454 | 3(ii) speculative auto-computed from Schedule BP |
| A949 | ENFORCED | 70_sec_tax.js:455 | 3(iii) specified business auto-computed from Schedule BP |
| A950 | ENFORCED | 61_rules_fix_08.js | was GAP; now encoded (10(10B) allowance not gated to CG/SG employee/pensioner category) |
| A951 | ENFORCED | 60_rules.js:94 | perquisite nature unique per block |
| A952 | ENFORCED | 60_rules.js:95 | profit-in-lieu nature unique per block |
| A953 | ENFORCED | 60_rules.js:92 | salary 89A equals sum of country rows |
| A954 | ENFORCED | 60_rules.js:306 | OS 89A equals sum of country rows |
| A955 | ENFORCED | 60_rules.js:587 | PartB-TI 115BBH@30% equals C2 of CG |
| A956 | ENFORCED | 60_rules.js:569 | total CG equals 3c plus 3d |
| A957 | ENFORCED | 60_rules.js:616 | old regime 87A rebate capped 12500 |
| A958 | ENFORCED | 61_rules_g3.js:187 | PartB-TI STCG20% equals 8ii Table E |
| A959 | ENFORCED | 70_sec_tax.js:463 | LTCG12.5% auto-computed from CG Table E aggregate; no A() but equal by construction |
| A960 | ENFORCED | 61_rules_g5.js:210 | tax deemed 115JC equals Sch AMT |
| A961 | ENFORCED | 61_rules_g0.js:125 | tax payments equal TDS/TCS/IT claims |
| A962 | ENFORCED | 60_rules.js:602 | total tax deemed equals tax+surcharge+cess |
| A963 | ENFORCED | 60_rules.js:599 | tax on TI equals normal+special-agri rebate |
| A964 | ENFORCED | 60_rules.js:600 | tax payable equals TaxOnTI minus 87A |
| A965 | ENFORCED | 60_rules.js:601 | gross tax liab equals tax+surcharge+cess |
| A966 | ENFORCED | 61_rules_fix_08.js | was GAP; now encoded (relief90 fed from dead S.C.trDTAA/fsi.dtaaRel (always 0); no check vs Sch TR DTAA) |
| A967 | ENFORCED | 61_rules_fix_08.js | was GAP; now encoded (relief91 fed from dead S.C.trNoDTAA/fsi.noDtaaRel (always 0); no check vs Sch TR notDTAA) |
| A968 | ENFORCED | 60_rules.js:608 | total relief equals 89+90+91 |
| A969 | ENFORCED | 60_rules.js:610 | total interest+fee equals 234A/B/C/F/I |
| A970 | ENFORCED | 60_rules.js:611 | aggregate equals net tax plus interest |
| A971 | ENFORCED | 60_rules.js:612 | total taxes paid equals adv+TDS+TCS+SAT |
| A972 | OFFLINE | 70_sec_bank.js:55 | IFSC format enforced by IFSC_RE; RBI master-DB membership needs external DB |
| A973 | ENFORCED | 60_rules.js:618 | 87A only resident/RNOR |
| A974 | ENFORCED | 60_rules.js:619 | 87A only individual |
| A975 | ENFORCED | 60_rules.js:617 | old regime res indiv TI>5L no 87A |
| A976 | ENFORCED | 60_rules.js:615 | refund equals taxes paid minus aggregate |
| A977 | ENFORCED | 60_rules.js:614 | tax payable equals aggregate minus taxes paid |
| A978 | ENFORCED | 60_rules.js:588 | deemed income 115JC equals Sl.3 Sch AMT |
| A979 | ENFORCED | 60_rules.js:604 | gross tax payable higher of 1d,2i |
| A980 | ENFORCED | 60_rules.js:606 | tax after 115JD credit equals 3a+3c-4 |
| A981 | ENFORCED | 60_rules.js:609 | net tax liability equals 5 minus 6D |
| A982 | ENFORCED | 61_rules_fix_08.js | was WEAK; now encoded (guard checks ti.Salaries>0 only; omits family-pension income) |
| A983 | ENFORCED | 60_rules.js:603 | new regime items 1a-1d nil |
| A984 | ENFORCED | 60_rules.js:621 | 3a+3b equals item 3 |
| A985 | ENFORCED | 60_rules.js:605 | item 3 equals 3a+3b |
| A986 | ENFORCED | 60_rules.js:623 | TCS equals total Sch TCS |
| A987 | ENFORCED | 60_rules.js:622 | TDS equals sum of three TDS schedule totals |
| A988 | ENFORCED | 70_sec_tax.js:138 | 87A auto-computed with marginal relief for TI>12L; cannot over-claim |
| A989 | ENFORCED | 70_sec_tax.js:135 | 87A rebate fully auto-computed per section, untypeable |
| A990 | ENFORCED | 61_rules_fix_08.js | was GAP; now encoded (234-I fee is free input, not validated to Rs.1000 for TI<=5L 139(5)) |
| A991 | ENFORCED | 61_rules_fix_08.js | was GAP; now encoded (234-I fee is free input, not validated to Rs.5000 for TI>5L 139(5)) |
| A992 | ENFORCED | 60_rules.js:536 | EI item5 equals exempt PTI |
| A993 | ENFORCED | 60_rules.js:532 | EI item6 equals 1+2v+3+4+5 |
| A994 | ENFORCED | 60_rules.js:533 | EI item2v equals i-ii-iii+iv |
| A995 | ENFORCED | 61_rules_g2.js:227 | EI 2(iv) equals Sl.38 Sch BP |
| A996 | ENFORCED | 60_rules.js:534 | net agri above 5L needs land details |
| A997 | ENFORCED | 61_rules_g3.js:194 | new regime no 10(17) exempt |
| A998 | ENFORCED | 60_rules.js:535 | EI item4 equals sum of DTAA amounts |
| A999 | ENFORCED | 60_rules.js:537 | EI item3 sub-category not repeated |

## Category B — 1-40 (40 serials)

| Serial | Bucket | Where | Why |
|---|---|---|---|
| B1 | ENFORCED | 61_rules_fix_08.js | was GAP; now Dd(1) advisory (80-IA/IAB/IB/IBA/IE claimed but no Form 10CCB presence notice; D-notice family missing it) |
| B2 | ENFORCED | 61_rules_fix_08.js | was GAP; now Dd(2) advisory (belated (139(4)) CY-loss carry-forward restriction not enforced; belated var defined but unused) |
| B3 | ENFORCED | 60_rules.js:644(Dd9) | Dd(9) requires PARTA_BS+PARTA_PL when business income >0 (stricter than 2.5L) |
| B4 | ENFORCED | 61_rules_fix_08.js | was WEAK; now Dd(4) advisory (BS/PL only via Dd(9) business-income trigger; no direct 92E flag trigger) |
| B5 | ENFORCED | 61_rules_fix_08.js | was GAP; now Dd(5) advisory (35(2AB) R&D -> Form 3CLA presence notice missing) |
| B6 | ENFORCED | 61_rules_fix_08.js | was WEAK; now Dd(6) advisory (44AB liability enforced for presumptive (A137/A138) and 1-10cr cash band (A29/A30); no plain >10cr trading trigger) |
| B7 | ENFORCED | 61_rules_fix_08.js | was GAP; now Dd(7) advisory (44AD(5) sub-8% declared income -> audit liability not checked) |
| B8 | ENFORCED | 61_rules_fix_08.js | was WEAK; now Dd(8) advisory (A104 forces presumptive 44ADA >=50%; the <50%-with-audit-info route not modelled) |
| B9 | ENFORCED | 61_rules_g5.js:22(A13) | A13 requires auditor name + audit-report date when 44AB liable and audited |
| B10 | ENFORCED | 60_rules.js:643(Dd13) | Dd(13) fires on 115BBF income -> Form 3CFA |
| B11 | OFFLINE | 60_rules.js:635 | reconciliation vs externally-filed Form (no schema field for its value); presence side enforced separately |
| B12 | ENFORCED | 60_rules.js:641(Dd10) | Dd(10) fires on 44DA income -> Form 3CE |
| B13 | OFFLINE | 60_rules.js:639 | reconciliation vs externally-filed Form (no schema field for its value); presence side enforced separately |
| B14 | OFFLINE | 60_rules.js:637 | reconciliation vs externally-filed Form (no schema field for its value); presence side enforced separately |
| B15 | OFFLINE | 60_rules.js:423 | reconciliation vs externally-filed Form (no schema field for its value); presence side enforced separately |
| B16 | OFFLINE | 60_rules.js:422 | reconciliation vs externally-filed Form (no schema field for its value); presence side enforced separately |
| B17 | OFFLINE |  | reconciliation vs externally-filed Form (no schema field for its value); presence side enforced separately |
| B18 | OFFLINE |  | reconciliation vs externally-filed Form (no schema field for its value); presence side enforced separately |
| B19 | ENFORCED | 61_rules_fix_08.js | was GAP; now Dd(19) advisory (Form 10EE for 89A relief presence notice missing from D-notice family) |
| B20 | ENFORCED | 61_rules_fix_08.js | was GAP; now Dd(20) advisory (Form 10F / TRC flag for NR treaty rate not enforced) |
| B21 | ENFORCED | 61_rules_fix_08.js | was GAP; now Dd(21) advisory (OS dividend vs dividend-reduced-from-BP cross-check not enforced (A301 is BP-internal)) |
| B22 | NA |  | Aadhaar-PAN linking verifiable only portal-side; informational |
| B23 | NA |  | Aadhaar quoting/linking portal-side; informational |
| B24 | NA |  | Nil return AIS/26AS advisory; no offline data; informational |
| B25 | ENFORCED | 61_rules_fix_08.js | was WEAK; now Dd(25) advisory (80GG capped to allowed via A816; specific 5000/month period ceiling not independently asserted) |
| B26 | ENFORCED | 70_sec_cg.js:154(STRUCT) | indexed cost of acquisition auto-computed = amt*CII(sale)/CII(acq); A445 NR guard |
| B27 | ENFORCED | 70_sec_cg.js:156(STRUCT) | indexed cost of improvement auto-computed via same idx() helper |
| B28 | NA |  | VDA TDS vs income offered is 26AS-driven; offline-impossible; informational |
| B29 | NA |  | 115BB winnings TDS vs income 26AS-driven; offline-impossible; informational |
| B30 | NA |  | race-horse TDS vs income 26AS-driven; offline-impossible; informational |
| B31 | NA |  | 115BBJ online-games TDS vs income 26AS-driven; offline-impossible; informational |
| B32 | ENFORCED | 61_rules_fix_08.js | was WEAK; now Dd(32) advisory (10IEA ack+date presence enforced (A45/A41); database match external) |
| B33 | ENFORCED | 61_rules_fix_08.js | was WEAK; now Dd(33) advisory (10IEA presence enforced (A45/A41); DB match external/CPC-side) |
| B34 | ENFORCED | 61_rules_fix_09.js | was GAP; now A(34) check (CY losses must be 0 if 139(4); belated var unused; not enforced (same hole as serial 2)) |
| B35 | ENFORCED | 61_rules_fix_09.js | was WEAK; now A(35) check (80G donee PAN mandatory (A648), not assessee's (A12), unique (A645); DB validity external) |
| B36 | ENFORCED | 60_rules.js:393(A799) | A799 requires Form 10BA acknowledgement when 80GG claimed |
| B37 | OFFLINE |  | reconciliation vs externally-filed Form (no schema field for its value); presence side enforced separately |
| B38 | ENFORCED | 60_rules.js:299(A529) | A529 caps OS 3c(i) interest at 20% of dividend income |
| B39 | ENFORCED | 61_rules_fix_09.js | was GAP; now A(39) check (Schedule IF interest total = P&L 14xi(b) not enforced (no cross-total rule)) |
| B40 | ENFORCED | 61_rules_fix_09.js | was GAP; now A(40) check (Schedule IF remuneration total = P&L 14xi(c) not enforced (no cross-total rule)) |

## Category D — 1-17 (17 serials)

| Serial | Bucket | Where | Why |
|---|---|---|---|
| D1 | ENFORCED | 60_rules.js:635(Dd1)+61_rules_fix_09.js | Form 29C AMT notice compares base 115JC tax vs gross normal (with cess) - mismatched basis, may under-fire |
| D2 | ENFORCED | 70_sec_tax.js:167(STRUCT) | Surcharge on AMT is computed untypeable cell, amtScr=0 when adjusted 115JC income <=50 lakh |
| D3 | ENFORCED | 60_rules.js:637(Dd3) | Fires when 80JJAA deduction >0 (Form 10DA) |
| D4 | ENFORCED | 61_rules_fix_09.js | was GAP; now Dd(4) (No advisory tying Chapter VI-A Part C deductions to on-time 139(1) filing) |
| D5 | ENFORCED | 60_rules.js:638(Dd5) | Fires when relief u/s 90/91 >0 (Form 67) |
| D6 | ENFORCED | 60_rules.js:639(Dd6) | Fires when Schedule10AA present or 10AA deduction >0 (Form 56F) |
| D7 | ENFORCED | 61_rules_fix_09.js | was GAP; now Dd(7) (No check that 10AA deduction requires return filed within 139(1) due date) |
| D8 | NA | 70_sec_bp.js | No 44AE tonnage/goods-carriage detail field exists; rule cannot be violated |
| D9 | ENFORCED | 60_rules.js:644(Dd9) | Fires when business income >0 without both PARTA_BS and PARTA_PL |
| D10 | ENFORCED | 60_rules.js:641(Dd10) | Fires when 44DA profit/deemed-profit >0 (Form 3CE) |
| D11 | ENFORCED | 60_rules.js:642(Dd11) | Fires when LiableSec92Eflg==Y (Form 3CEB) |
| D12 | ENFORCED | 60_rules.js:636(Dd12) | Fires when ScheduleAMT present - liable to AMT (Form 29C) |
| D13 | ENFORCED | 60_rules.js:643(Dd13) | Fires when 115BBF income >0 (Form 3CFA within due date) |
| D14 | ENFORCED | 60_rules.js:640(Dd14) | Fires when relief u/s 89 >0 (Form 10E) |
| D15 | NA | 60_rules.js | 269SU/Compliance Module is portal-side, outside the return JSON |
| D16 | ENFORCED | 61_rules_fix_09.js | was GAP; now Dd(16) (BP 4b rule-7A/7B/8 reduction not gated on business code 1001/1002/1003) |
| D17 | ENFORCED | 61_rules_fix_09.js | was GAP; now Dd(17) (Resident claiming DTAA special-rate heads not warned/blocked) |

## OFFLINE-IMPOSSIBLE (detail)

These require data outside the return JSON (an external database or a separately-filed Form whose numeric content has no schema field), so they cannot be validated by an offline utility. Where a *presence* notice for the same Form exists it is enforced separately as a Category-D Dd() notice; only the numeric reconciliation is offline-impossible.

- **A972** — IFSC format enforced by IFSC_RE; RBI master-DB membership needs external DB (70_sec_bank.js:55)
- **B11** — reconciliation vs externally-filed Form (no schema field for its value); presence side enforced separately (60_rules.js:635)
- **B13** — reconciliation vs externally-filed Form (no schema field for its value); presence side enforced separately (60_rules.js:639)
- **B14** — reconciliation vs externally-filed Form (no schema field for its value); presence side enforced separately (60_rules.js:637)
- **B15** — reconciliation vs externally-filed Form (no schema field for its value); presence side enforced separately (60_rules.js:423)
- **B16** — reconciliation vs externally-filed Form (no schema field for its value); presence side enforced separately (60_rules.js:422)
- **B17** — reconciliation vs externally-filed Form (no schema field for its value); presence side enforced separately (no schema field)
- **B18** — reconciliation vs externally-filed Form (no schema field for its value); presence side enforced separately (no schema field)
- **B37** — reconciliation vs externally-filed Form (no schema field for its value); presence side enforced separately (no schema field)

## MISSING

None. Every offline-checkable serial in this slice with an existing schema field has a live check (direct, loop, or STRUCT). MISSING is empty.

## Machine-readable
```tsv
A701	ENFORCED	60_rules.js:434
A702	ENFORCED	60_rules.js:435
A703	ENFORCED	60_rules.js:436
A704	ENFORCED	60_rules.js:437
A705	ENFORCED	60_rules.js:438
A706	ENFORCED	60_rules.js:441
A707	ENFORCED	60_rules.js:440
A708	ENFORCED	60_rules.js:398
A709	ENFORCED	60_rules.js:399
A710	ENFORCED	60_rules.js:400
A711	ENFORCED	61_rules_g2.js:189
A712	ENFORCED	61_rules_g3.js:162
A713	ENFORCED	70_sec_ded.js:468
A714	ENFORCED	61_rules_g5.js:194
A715	ENFORCED	70_sec_ded.js:130
A716	ENFORCED	70_sec_ded.js:131
A717	ENFORCED	60_rules.js:442
A718	ENFORCED	61_rules_g2.js:190
A719	ENFORCED	61_rules_g3.js:164
A720	ENFORCED	70_sec_ded.js:120
A721	ENFORCED	61_rules_g5.js:197
A722	ENFORCED	61_rules_g0.js:118
A723	ENFORCED	70_sec_ded.js:466
A724	ENFORCED	61_rules_g2.js:192
A725	ENFORCED	61_rules_g3.js:165
A726	ENFORCED	70_sec_ded.js:466
A727	ENFORCED	60_rules.js:414
A728	ENFORCED	60_rules.js:415
A729	ENFORCED	60_rules.js:473
A730	ENFORCED	60_rules.js:413
A731	ENFORCED	60_rules.js:416
A732	ENFORCED	60_rules.js:474
A733	ENFORCED	60_rules.js:417
A734	ENFORCED	61_rules_g0.js:120
A735	ENFORCED	60_rules.js:474
A736	ENFORCED	60_rules.js:418
A737	ENFORCED	60_rules.js:475
A738	ENFORCED	60_rules.js:475
A739	ENFORCED	60_rules.js:419
A740	ENFORCED	60_rules.js:473
A741	ENFORCED	60_rules.js:420
A742	ENFORCED	60_rules.js:476
A743	ENFORCED	60_rules.js:421
A744	ENFORCED	60_rules.js:473
A745	ENFORCED	60_rules.js:423
A746	ENFORCED	60_rules.js:424
A747	ENFORCED	60_rules.js:425
A748	ENFORCED	60_rules.js:426
A749	ENFORCED	60_rules.js:427
A750	ENFORCED	60_rules.js:363
A751	ENFORCED	61_rules_fix_06.js
A752	ENFORCED	60_rules.js:367
A753	ENFORCED	60_rules.js:368
A754	ENFORCED	70_sec_ded.js:208
A755	ENFORCED	60_rules.js:369
A756	ENFORCED	70_sec_ded.js:293
A757	ENFORCED	60_rules.js:370
A758	ENFORCED	60_rules.js:371
A759	ENFORCED	61_rules_g0.js:112
A760	ENFORCED	60_rules.js:403
A761	ENFORCED	61_rules_fix_06.js
A762	ENFORCED	60_rules.js:390
A763	ENFORCED	60_rules.js:382
A764	ENFORCED	61_rules_g2.js:184
A765	ENFORCED	60_rules.js:391
A766	ENFORCED	60_rules.js:372
A767	ENFORCED	60_rules.js:364
A768	ENFORCED	70_sec_ded.js:193
A769	ENFORCED	70_sec_ded.js:193
A770	ENFORCED	60_rules.js:385
A771	ENFORCED	60_rules.js:365
A772	ENFORCED	60_rules.js:366
A773	ENFORCED	61_rules_fix_06.js
A774	ENFORCED	60_rules.js:386
A775	ENFORCED	60_rules.js:383
A776	ENFORCED	60_rules.js:387
A777	ENFORCED	61_rules_g0.js:113
A778	ENFORCED	60_rules.js:373
A779	ENFORCED	60_rules.js:374
A780	ENFORCED	60_rules.js:375
A781	ENFORCED	60_rules.js:376
A782	ENFORCED	60_rules.js:377
A783	ENFORCED	70_sec_ded.js:208
A784	ENFORCED	60_rules.js:378
A785	ENFORCED	60_rules.js:379
A786	ENFORCED	60_rules.js:380
A787	ENFORCED	60_rules.js:381
A788	ENFORCED	61_rules_fix_06.js
A789	ENFORCED	60_rules.js:361
A790	ENFORCED	70_sec_ded.js:226
A791	ENFORCED	70_sec_ded.js:229
A792	ENFORCED	60_rules.js:360
A793	ENFORCED	70_sec_ded.js:228
A794	ENFORCED	70_sec_ded.js:228
A795	ENFORCED	61_rules_fix_06.js
A796	ENFORCED	61_rules_fix_06.js
A797	ENFORCED	70_sec_ded.js:208
A798	ENFORCED	60_rules.js:392
A799	ENFORCED	60_rules.js:393
A800	ENFORCED	60_rules.js:394
A801	ENFORCED	60_rules.js:395
A802	ENFORCED	60_rules.js:396
A803	ENFORCED	70_sec_ded.js:288
A804	ENFORCED	70_sec_ded.js:288
A805	ENFORCED	70_sec_ded.js:288
A806	ENFORCED	70_sec_ded.js:288
A807	ENFORCED	70_sec_ded.js:208
A808	ENFORCED	70_sec_ded.js:288
A809	ENFORCED	70_sec_ded.js:191
A810	ENFORCED	70_sec_ded.js:193
A811	ENFORCED	70_sec_ded.js:288
A812	ENFORCED	70_sec_ded.js:288
A813	ENFORCED	70_sec_ded.js:288
A814	ENFORCED	70_sec_ded.js:288
A815	ENFORCED	70_sec_ded.js:288
A816	ENFORCED	70_sec_ded.js:288
A817	ENFORCED	70_sec_ded.js:288
A818	ENFORCED	70_sec_ded.js:288
A819	ENFORCED	70_sec_ded.js:216
A820	ENFORCED	70_sec_ded.js:217
A821	ENFORCED	70_sec_ded.js:192
A822	ENFORCED	70_sec_ded.js:427
A823	ENFORCED	70_sec_sal.js:143
A824	ENFORCED	70_sec_ded.js:288
A825	ENFORCED	70_sec_ded.js:288
A826	ENFORCED	61_rules_g1.js:125
A827	ENFORCED	61_rules_g2.js:185
A828	ENFORCED	60_rules.js:384
A829	ENFORCED	61_rules_fix_06.js
A830	ENFORCED	60_rules.js:510
A831	ENFORCED	60_rules.js:505
A832	ENFORCED	61_rules_g3.js:172
A833	ENFORCED	60_rules.js:506
A834	ENFORCED	60_rules.js:507
A835	ENFORCED	61_rules_fix_06.js
A836	ENFORCED	60_rules.js:504
A837	ENFORCED	61_rules_g4.js:132
A838	ENFORCED	60_rules.js:508
A839	ENFORCED	60_rules.js:511
A840	ENFORCED	61_rules_g5.js:214
A841	ENFORCED	61_rules_g0.js:123
A842	ENFORCED	60_rules.js:513
A843	ENFORCED	60_rules.js:514
A844	ENFORCED	60_rules.js:515
A845	ENFORCED	60_rules.js:516
A846	ENFORCED	60_rules.js:519
A847	ENFORCED	60_rules.js:607
A848	ENFORCED	60_rules.js:517
A849	ENFORCED	61_rules_fix_06.js
A850	ENFORCED	61_rules_fix_06.js
A851	ENFORCED	61_rules_fix_06.js
A852	ENFORCED	61_rules_g4.js:137
A853	ENFORCED	61_rules_fix_06.js
A854	ENFORCED	61_rules_fix_07.js
A855	ENFORCED	61_rules_fix_07.js
A856	ENFORCED	70_sec_si.js:223
A857	ENFORCED	61_rules_fix_07.js
A858	ENFORCED	70_sec_tax.js:131
A859	ENFORCED	61_rules_fix_07.js
A860	ENFORCED	60_rules.js:485
A861	ENFORCED	60_rules.js:486
A862	ENFORCED	61_rules_fix_07.js
A863	ENFORCED	61_rules_fix_07.js
A864	ENFORCED	61_rules_fix_07.js
A865	ENFORCED	61_rules_fix_07.js
A866	ENFORCED	61_rules_fix_07.js
A867	ENFORCED	61_rules_g5.js:206
A868	ENFORCED	60_rules.js:487
A869	ENFORCED	61_rules_fix_07.js
A870	ENFORCED	61_rules_fix_07.js
A871	ENFORCED	61_rules_fix_07.js
A872	ENFORCED	61_rules_fix_07.js
A873	ENFORCED	61_rules_fix_07.js
A874	ENFORCED	60_rules.js:495
A875	ENFORCED	60_rules.js:496
A876	ENFORCED	60_rules.js:497
A877	ENFORCED	60_rules.js:498
A878	ENFORCED	70_sec_other.js:107
A879	ENFORCED	60_rules.js:521
A880	ENFORCED	60_rules.js:522
A881	ENFORCED	60_rules.js:523
A882	ENFORCED	60_rules.js:524
A883	ENFORCED	60_rules.js:525
A884	ENFORCED	60_rules.js:526
A885	ENFORCED	61_rules_g0.js:124
A886	ENFORCED	61_rules_g1.js:136
A887	ENFORCED	60_rules.js:544
A888	ENFORCED	60_rules.js:542
A889	ENFORCED	60_rules.js:545
A890	ENFORCED	61_rules_g2.js:208
A891	ENFORCED	61_rules_fix_07.js
A892	ENFORCED	61_rules_fix_07.js
A893	ENFORCED	61_rules_fix_07.js
A894	ENFORCED	61_rules_fix_07.js
A895	ENFORCED	60_rules.js:547
A896	ENFORCED	60_rules.js:548
A897	ENFORCED	60_rules.js:549
A898	ENFORCED	60_rules.js:546
A899	ENFORCED	60_rules.js:550
A900	ENFORCED	70_sec_fa.js:86
A901	ENFORCED	60_rules.js:554
A902	NA	60_rules.js:554
A903	ENFORCED	60_rules.js:551
A904	ENFORCED	60_rules.js:552
A905	ENFORCED	60_rules.js:553
A906	ENFORCED	60_rules.js:560
A907	ENFORCED	70_sec_tax.js:522
A908	ENFORCED	70_sec_other.js:135
A909	ENFORCED	61_rules_g5.js:223
A910	ENFORCED	60_rules.js:489
A911	ENFORCED	61_rules_g0.js:62
A912	NA	60_rules.js:593
A913	ENFORCED	60_rules.js:593
A914	ENFORCED	60_rules.js:570
A915	ENFORCED	60_rules.js:566
A916	ENFORCED	60_rules.js:567
A917	ENFORCED	60_rules.js:568
A918	ENFORCED	60_rules.js:571
A919	ENFORCED	60_rules.js:572
A920	ENFORCED	60_rules.js:573
A921	ENFORCED	60_rules.js:574
A922	ENFORCED	61_rules_fix_07.js
A923	ENFORCED	61_rules_g2.js:217
A924	ENFORCED	61_rules_g3.js:186
A925	ENFORCED	70_sec_tax.js:461
A926	ENFORCED	61_rules_g5.js:232
A927	ENFORCED	60_rules.js:576
A928	ENFORCED	60_rules.js:577
A929	ENFORCED	60_rules.js:578
A930	ENFORCED	60_rules.js:579
A931	ENFORCED	60_rules.js:580
A932	ENFORCED	60_rules.js:582
A933	ENFORCED	60_rules.js:589
A934	ENFORCED	70_sec_tax.js:487
A935	ENFORCED	60_rules.js:584
A936	ENFORCED	70_sec_tax.js:456
A937	ENFORCED	60_rules.js:590
A938	ENFORCED	61_rules_g2.js:219
A939	ENFORCED	61_rules_fix_07.js
A940	ENFORCED	60_rules.js:585
A941	ENFORCED	70_sec_tax.js:478
A942	ENFORCED	60_rules.js:591
A943	ENFORCED	60_rules.js:592
A944	ENFORCED	60_rules.js:583
A945	ENFORCED	60_rules.js:581
A946	ENFORCED	60_rules.js:586
A947	ENFORCED	61_rules_g5.js:235
A948	ENFORCED	70_sec_tax.js:454
A949	ENFORCED	70_sec_tax.js:455
A950	ENFORCED	61_rules_fix_08.js
A951	ENFORCED	60_rules.js:94
A952	ENFORCED	60_rules.js:95
A953	ENFORCED	60_rules.js:92
A954	ENFORCED	60_rules.js:306
A955	ENFORCED	60_rules.js:587
A956	ENFORCED	60_rules.js:569
A957	ENFORCED	60_rules.js:616
A958	ENFORCED	61_rules_g3.js:187
A959	ENFORCED	70_sec_tax.js:463
A960	ENFORCED	61_rules_g5.js:210
A961	ENFORCED	61_rules_g0.js:125
A962	ENFORCED	60_rules.js:602
A963	ENFORCED	60_rules.js:599
A964	ENFORCED	60_rules.js:600
A965	ENFORCED	60_rules.js:601
A966	ENFORCED	61_rules_fix_08.js
A967	ENFORCED	61_rules_fix_08.js
A968	ENFORCED	60_rules.js:608
A969	ENFORCED	60_rules.js:610
A970	ENFORCED	60_rules.js:611
A971	ENFORCED	60_rules.js:612
A972	OFFLINE	70_sec_bank.js:55
A973	ENFORCED	60_rules.js:618
A974	ENFORCED	60_rules.js:619
A975	ENFORCED	60_rules.js:617
A976	ENFORCED	60_rules.js:615
A977	ENFORCED	60_rules.js:614
A978	ENFORCED	60_rules.js:588
A979	ENFORCED	60_rules.js:604
A980	ENFORCED	60_rules.js:606
A981	ENFORCED	60_rules.js:609
A982	ENFORCED	61_rules_fix_08.js
A983	ENFORCED	60_rules.js:603
A984	ENFORCED	60_rules.js:621
A985	ENFORCED	60_rules.js:605
A986	ENFORCED	60_rules.js:623
A987	ENFORCED	60_rules.js:622
A988	ENFORCED	70_sec_tax.js:138
A989	ENFORCED	70_sec_tax.js:135
A990	ENFORCED	61_rules_fix_08.js
A991	ENFORCED	61_rules_fix_08.js
A992	ENFORCED	60_rules.js:536
A993	ENFORCED	60_rules.js:532
A994	ENFORCED	60_rules.js:533
A995	ENFORCED	61_rules_g2.js:227
A996	ENFORCED	60_rules.js:534
A997	ENFORCED	61_rules_g3.js:194
A998	ENFORCED	60_rules.js:535
A999	ENFORCED	60_rules.js:537
B1	ENFORCED	61_rules_fix_08.js
B2	ENFORCED	61_rules_fix_08.js
B3	ENFORCED	60_rules.js:644(Dd9)
B4	ENFORCED	61_rules_fix_08.js
B5	ENFORCED	61_rules_fix_08.js
B6	ENFORCED	61_rules_fix_08.js
B7	ENFORCED	61_rules_fix_08.js
B8	ENFORCED	61_rules_fix_08.js
B9	ENFORCED	61_rules_g5.js:22(A13)
B10	ENFORCED	60_rules.js:643(Dd13)
B11	OFFLINE	60_rules.js:635
B12	ENFORCED	60_rules.js:641(Dd10)
B13	OFFLINE	60_rules.js:639
B14	OFFLINE	60_rules.js:637
B15	OFFLINE	60_rules.js:423
B16	OFFLINE	60_rules.js:422
B17	OFFLINE	
B18	OFFLINE	
B19	ENFORCED	61_rules_fix_08.js
B20	ENFORCED	61_rules_fix_08.js
B21	ENFORCED	61_rules_fix_08.js
B22	NA	
B23	NA	
B24	NA	
B25	ENFORCED	61_rules_fix_08.js
B26	ENFORCED	70_sec_cg.js:154(STRUCT)
B27	ENFORCED	70_sec_cg.js:156(STRUCT)
B28	NA	
B29	NA	
B30	NA	
B31	NA	
B32	ENFORCED	61_rules_fix_08.js
B33	ENFORCED	61_rules_fix_08.js
B34	ENFORCED	61_rules_fix_09.js
B35	ENFORCED	61_rules_fix_09.js
B36	ENFORCED	60_rules.js:393(A799)
B37	OFFLINE	
B38	ENFORCED	60_rules.js:299(A529)
B39	ENFORCED	61_rules_fix_09.js
B40	ENFORCED	61_rules_fix_09.js
D1	ENFORCED	60_rules.js:635(Dd1)+61_rules_fix_09.js
D2	ENFORCED	70_sec_tax.js:167(STRUCT)
D3	ENFORCED	60_rules.js:637(Dd3)
D4	ENFORCED	61_rules_fix_09.js
D5	ENFORCED	60_rules.js:638(Dd5)
D6	ENFORCED	60_rules.js:639(Dd6)
D7	ENFORCED	61_rules_fix_09.js
D8	NA	70_sec_bp.js
D9	ENFORCED	60_rules.js:644(Dd9)
D10	ENFORCED	60_rules.js:641(Dd10)
D11	ENFORCED	60_rules.js:642(Dd11)
D12	ENFORCED	60_rules.js:636(Dd12)
D13	ENFORCED	60_rules.js:643(Dd13)
D14	ENFORCED	60_rules.js:640(Dd14)
D15	NA	60_rules.js
D16	ENFORCED	61_rules_fix_09.js
D17	ENFORCED	61_rules_fix_09.js
```
