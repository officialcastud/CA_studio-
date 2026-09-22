# ITR-5 rule census — SLICE A_612-866 (Category-A serials 612-866)

Worktree: /home/user/ca-itr5/yukti  ·  Source read-only  ·  Rules: books/ITR-5/rules.json
Encoded rules for this slice live in forms/ITR-5/src/61_rules_enc_14 .. enc_20.
Encoding confirmed by direct A()/Dd(serial,...) calls and by helper dispatch
(PTI sub3/sub4 in enc_18; tdsBlock S.{total,claimDed,grossHead} in enc_20).
Not-encoded serials cross-checked against each enc file's 'NOT MAPPABLE' foot block
AND against the actual exported schema (70_sec_cg/os/si/loss/ded/tax/other.js).

| serial | cat | bucket | justification (schema field or reason) |
|--------|-----|--------|----------------------------------------|
| 612 | A | ENCODED | encoded in enc_14 (A/Dd(612,...) drives the assertion) |
| 613 | A | ENCODED | encoded in enc_14 (A/Dd(613,...) drives the assertion) |
| 614 | A | ENCODED | encoded in enc_14 (A/Dd(614,...) drives the assertion) |
| 615 | A | ENCODED | encoded in enc_14 (A/Dd(615,...) drives the assertion) |
| 616 | A | ENCODED | encoded in enc_14 (A/Dd(616,...) drives the assertion) |
| 617 | A | ENCODED | encoded in enc_14 (A/Dd(617,...) drives the assertion) |
| 618 | A | ENCODED | encoded in enc_14 (A/Dd(618,...) drives the assertion) |
| 619 | A | ENCODED | encoded in enc_14 (A/Dd(619,...) drives the assertion) |
| 620 | A | ENCODED | encoded in enc_14 (A/Dd(620,...) drives the assertion) |
| 621 | A | ENCODED | encoded in enc_14 (A/Dd(621,...) drives the assertion) |
| 622 | A | ENCODED | encoded in enc_14 (A/Dd(622,...) drives the assertion) |
| 623 | A | ENCODED | encoded in enc_14 (A/Dd(623,...) drives the assertion) |
| 624 | A | ENCODED | encoded in enc_14 (A/Dd(624,...) drives the assertion) |
| 625 | A | ENCODED | encoded in enc_14 (A/Dd(625,...) drives the assertion) |
| 626 | A | ENCODED | encoded in enc_14 (A/Dd(626,...) drives the assertion) |
| 627 | A | ENCODED | encoded in enc_14 (A/Dd(627,...) drives the assertion) |
| 628 | A | OFFLINE-IMPOSSIBLE | 80IB cap = derived non-spec/non-specified/non-presumptive business-income pool (BP-tableE less 44AD/ADA/AE after BFLA); no single exported leaf, allocation ambiguous -> false-fires. |
| 629 | A | OFFLINE-IMPOSSIBLE | 80IE cap = same derived business-income pool as 628; not a single exported field. |
| 630 | A | OFFLINE-IMPOSSIBLE | 80P Sl.11 cap = OS(1a+1bi+1bii)+BFLA 5(ii)/5(xiii) subject to interest/dividend in P&L; composite multi-schedule cap with P&L semantic condition, no single field. |
| 631 | A | OFFLINE-IMPOSSIBLE | Co-op-status limb already gated at encoded 653; residual '44AD income' limb needs derived presumptive pool, not a single exported field. |
| 632 | A | ENCODED | encoded in enc_14 (A/Dd(632,...) drives the assertion) |
| 633 | A | ENCODED | encoded in enc_14 (A/Dd(633,...) drives the assertion) |
| 634 | A | OFFLINE-IMPOSSIBLE | 80P(2)(e) cap = 'rental income included in GTI', a cross-schedule (ScheduleHP->PartB-TI) derived figure with no single carrying field. |
| 635 | A | OFFLINE-IMPOSSIBLE | 80P(2)(f) extent operand = interest in ScheduleOS + HP Sl.4; composite cross-schedule extent, no single checkable leaf (GTI<=20000 alone insufficient). |
| 636 | A | OFFLINE-IMPOSSIBLE | 80P(2)(a)(i-vii) cap = derived business-income pool (same as 628); no single exported field. |
| 637 | A | OFFLINE-IMPOSSIBLE | 80P(2)(b) cap = derived business-income pool (same as 628); no single exported field. |
| 638 | A | ENCODED | encoded in enc_14 (A/Dd(638,...) drives the assertion) |
| 639 | A | ENCODED | encoded in enc_14 (A/Dd(639,...) drives the assertion) |
| 640 | A | ENCODED | encoded in enc_14 (A/Dd(640,...) drives the assertion) |
| 641 | A | ENCODED | encoded in enc_14 (A/Dd(641,...) drives the assertion) |
| 642 | A | ENCODED | encoded in enc_14 (A/Dd(642,...) drives the assertion) |
| 643 | A | ENCODED | encoded in enc_14 (A/Dd(643,...) drives the assertion) |
| 644 | A | ENCODED | encoded in enc_15 (A/Dd(644,...) drives the assertion) |
| 645 | A | ENCODED | encoded in enc_15 (A/Dd(645,...) drives the assertion) |
| 646 | A | ENCODED | encoded in enc_15 (A/Dd(646,...) drives the assertion) |
| 647 | A | ENCODED | encoded in enc_15 (A/Dd(647,...) drives the assertion) |
| 648 | A | ENCODED | encoded in enc_15 (A/Dd(648,...) drives the assertion) |
| 649 | A | ENCODED | encoded in enc_15 (A/Dd(649,...) drives the assertion) |
| 650 | A | ENCODED | encoded in enc_15 (A/Dd(650,...) drives the assertion) |
| 651 | A | ENCODED | encoded in enc_15 (A/Dd(651,...) drives the assertion) |
| 652 | A | ENCODED | encoded in enc_15 (A/Dd(652,...) drives the assertion) |
| 653 | A | ENCODED | encoded in enc_15 (A/Dd(653,...) drives the assertion) |
| 654 | A | OFFLINE-IMPOSSIBLE | 'no business income' test: only proxy PartA_GEN1.FilingStatus.IncFrmBusOrProf is Y even on a business LOSS; the true post-BFLA business figure is a derived pool -> would false-fire. |
| 655 | A | OFFLINE-IMPOSSIBLE | 80-IA(2d) cap = derived non-spec/non-specified/non-presumptive business-income pool; no single exported field, allocation ambiguous. |
| 656 | A | ENCODED | encoded in enc_15 (A/Dd(656,...) drives the assertion) |
| 657 | A | OFFLINE-IMPOSSIBLE | 80JJAA(2k) cap = derived business-income pool (same as 655). |
| 658 | A | OFFLINE-IMPOSSIBLE | 80IAB(2e) cap = derived business-income pool (same as 655). |
| 659 | A | OFFLINE-IMPOSSIBLE | 80IBA(2h) cap = derived business-income pool (same as 655). |
| 660 | A | OFFLINE-IMPOSSIBLE | 80JJA(2j) cap = derived business-income pool (same as 655). |
| 661 | A | OFFLINE-IMPOSSIBLE | 80IAC(2f) cap = derived business-income pool (same as 655). |
| 662 | A | ENCODED | encoded in enc_15 (A/Dd(662,...) drives the assertion) |
| 663 | A | ENCODED | encoded in enc_15 (A/Dd(663,...) drives the assertion) |
| 664 | A | ENCODED | encoded in enc_15 (A/Dd(664,...) drives the assertion) |
| 665 | A | ENCODED | encoded in enc_15 (A/Dd(665,...) drives the assertion) |
| 666 | A | ENCODED | encoded in enc_15 (A/Dd(666,...) drives the assertion) |
| 667 | A | ENCODED | encoded in enc_15 (A/Dd(667,...) drives the assertion) |
| 668 | A | ENCODED | encoded in enc_15 (A/Dd(668,...) drives the assertion) |
| 669 | A | ENCODED | encoded in enc_15 (A/Dd(669,...) drives the assertion) |
| 670 | A | ENCODED | encoded in enc_15 (A/Dd(670,...) drives the assertion) |
| 671 | A | ENCODED | encoded in enc_15 (A/Dd(671,...) drives the assertion) |
| 672 | A | ENCODED | encoded in enc_15 (A/Dd(672,...) drives the assertion) |
| 673 | A | ENCODED | encoded in enc_15 (A/Dd(673,...) drives the assertion) |
| 674 | A | ENCODED | encoded in enc_15 (A/Dd(674,...) drives the assertion) |
| 675 | A | ENCODED | encoded in enc_15 (A/Dd(675,...) drives the assertion) |
| 676 | A | ENCODED | encoded in enc_16 (A/Dd(676,...) drives the assertion) |
| 677 | A | ENCODED | encoded in enc_16 (A/Dd(677,...) drives the assertion) |
| 678 | A | OFFLINE-IMPOSSIBLE | AMT 2a add-back = sum of system-computed VIA Part-C rows d..m subject to PartB-TI(9-10) MIN cap; the item-wise VIA d..m split feeding this MIN is not a clean exported identity -> false-fires (borderline). |
| 679 | A | ENCODED | encoded in enc_16 (A/Dd(679,...) drives the assertion) |
| 680 | A | ENCODED | encoded in enc_16 (A/Dd(680,...) drives the assertion) |
| 681 | A | ENCODED | encoded in enc_16 (A/Dd(681,...) drives the assertion) |
| 682 | A | ENCODED | encoded in enc_16 (A/Dd(682,...) drives the assertion) |
| 683 | A | NA | States the Rs.20-lakh AMT floor does NOT apply to a Firm; no violation condition exists (a Firm computing AMT below 20L is lawful) -> nothing offline-checkable. |
| 684 | A | ENCODED | encoded in enc_16 (A/Dd(684,...) drives the assertion) |
| 685 | A | ENCODED | encoded in enc_16 (A/Dd(685,...) drives the assertion) |
| 686 | A | ENCODED | encoded in enc_16 (A/Dd(686,...) drives the assertion) |
| 687 | A | ENCODED | encoded in enc_16 (A/Dd(687,...) drives the assertion) |
| 688 | A | ENCODED | encoded in enc_16 (A/Dd(688,...) drives the assertion) |
| 689 | A | ENCODED | encoded in enc_16 (A/Dd(689,...) drives the assertion) |
| 690 | A | ENCODED | encoded in enc_16 (A/Dd(690,...) drives the assertion) |
| 691 | A | ENCODED | encoded in enc_16 (A/Dd(691,...) drives the assertion) |
| 692 | A | ENCODED | encoded in enc_16 (A/Dd(692,...) drives the assertion) |
| 693 | A | ENCODED | encoded in enc_16 (A/Dd(693,...) drives the assertion) |
| 694 | A | ENCODED | encoded in enc_16 (A/Dd(694,...) drives the assertion) |
| 695 | A | ENCODED | encoded in enc_16 (A/Dd(695,...) drives the assertion) |
| 696 | A | ENCODED | encoded in enc_16 (A/Dd(696,...) drives the assertion) |
| 697 | A | ENCODED | encoded in enc_17 (A/Dd(697,...) drives the assertion) |
| 698 | A | MISSING | OS 2c per-code amount vs SI same code net of DTAA: ScheduleOS.IncOthThanOwnRaceHorse.OthersGrossDtls[].{SourceDescription,SourceAmount}, NRIDTAADtlsSchOS[].{ItemNoincl,DTAAamt} and ScheduleSI.SplCodeRateTax[].{SecCode,SplRateInc} all exported on an identity code space; DTAA counts derivable from resStatus+per-row TRC -> exact offline check. |
| 699 | A | MISSING | OS 2d PTI per-code amount vs SI same code net of DTAA: ScheduleOS.PTIOthersGrossDtls[].{SourceDescription,SourceAmount} + NRIDTAADtlsSchOS + ScheduleSI.SplCodeRateTax all exported, identity code space -> exact offline check. |
| 700 | A | MISSING | SI code 5BB income (SplCodeRateTax SecCode=5BB SplRateInc) vs ScheduleOS.IncOthThanOwnRaceHorse.LtryPzzlChrgblUs115BB; SI engine sets 5BB = OS 115BB (no DTAA) -> exact identity, both exported. |
| 701 | A | ENCODED | encoded in enc_17 (A/Dd(701,...) drives the assertion) |
| 702 | A | ENCODED | encoded in enc_17 (A/Dd(702,...) drives the assertion) |
| 703 | A | ENCODED | encoded in enc_17 (A/Dd(703,...) drives the assertion) |
| 704 | A | MISSING | SI DTAAOS income (SplCodeRateTax SecCode=DTAAOS SplRateInc) vs ScheduleBFLA.IncOSDTAA.IncBFLA.IncOfCurYrAfterSetOffBFLosses (5xiv); SI income is constructed = that BFLA col-5 leaf -> exact identity, both exported. |
| 705 | A | ENCODED | encoded in enc_17 (A/Dd(705,...) drives the assertion) |
| 706 | A | ENCODED | encoded in enc_17 (A/Dd(706,...) drives the assertion) |
| 707 | A | MISSING | SI 115AD STCG@30 + PTI STCG@30 vs ScheduleBFLA.STCG30Per.IncBFLA.IncOfCurYrAfterSetOffBFLosses (5vii); SI CG income constructed = BFLA col-5 -> exact identity, both exported. |
| 708 | A | ENCODED | encoded in enc_17 (A/Dd(708,...) drives the assertion) |
| 709 | A | MISSING | SI STCG-DTAA vs ScheduleBFLA.STCGDTAARate.IncBFLA.IncOfCurYrAfterSetOffBFLosses (5ix); exact identity by construction, both exported. |
| 710 | A | MISSING | SI LTCG-DTAA vs ScheduleBFLA.LTCGDTAARate.IncBFLA.IncOfCurYrAfterSetOffBFLosses (5xi); exact identity by construction, both exported. |
| 711 | A | OFFLINE-IMPOSSIBLE | 115BBC has no SecCode in the ScheduleSI enum (the anonymous-donations row is not built); no schema field carries the quantity -> enforced structurally by the absent enum. |
| 712 | A | ENCODED | encoded in enc_17 (A/Dd(712,...) drives the assertion) |
| 713 | A | MISSING | SI 111A + 115AD(1)(ii)Proviso + PTI STCG@20 vs ScheduleBFLA.STCG20Per.IncBFLA.IncOfCurYrAfterSetOffBFLosses (5vi); exact identity by construction, both exported. |
| 714 | A | MISSING | SI LTCG@12.5% roster vs ScheduleBFLA.LTCG12Per col-5 (5xb); SI 12.5% CG income constructed = BFLA col-5 leaf -> exact identity, both exported. |
| 715 | A | MISSING | SI special income vs OS 2d dropdown net of 2e DTAA: SplCodeRateTax[].SplRateInc = PTIOthersGrossDtls SourceAmount minus NRIDTAADtlsSchOS DTAAamt (by ItemNoincl); all exported, identity code space -> exact offline equality. |
| 716 | A | MISSING | SI special income vs OS 2c dropdown net of 2e DTAA: SplCodeRateTax[].SplRateInc = OthersGrossDtls SourceAmount minus NRIDTAADtlsSchOS DTAAamt (by ItemNoincl); all exported -> exact offline equality. |
| 717 | A | MISSING | SI 111A income <= CG A3ie (ScheduleCG.ShortTermCapGain.EquityMFonSTT[] where MFSectionCode=1A, sum CapgainonAssets) or A4a (NRITransacSec48Dtl.NRItaxSTTPaid); post-BFLA SI <= pre-BFLA CG leaf -> non-false-firing upper-bound, all exported. |
| 718 | A | MISSING | SI 115AD(1)(b)(ii)Proviso <= CG A3iie (EquityMFonSTT[] MFSectionCode=5AD1biip, CapgainonAssets); exported/derivable upper-bound check. |
| 719 | A | MISSING | SI 112(1) <= CG B3c (ScheduleCG.LongTermCapGain.Proviso112Applicable.Proviso112Applicabledtls.BalanceCG); exported single leaf -> upper-bound check. |
| 720 | A | MISSING | SI 112(1)(c)(iii) <= CG B6ic (LongTermCapGain.NRIOnSec112and115.NRIOnSec112and115Dtls[] SectionCode=21ciii, BalanceCG); exported/filterable -> upper-bound check. |
| 721 | A | MISSING | SI 112A <= CG B4 (LongTermCapGain.SaleOfEquityShareUs112A.CapgainonAssets) or Col14 Sch112A; exported single leaf -> upper-bound check. |
| 722 | A | MISSING | SI 115AB(1)(b) <= CG B6iic (NRIOnSec112and115Dtls[] SectionCode=5AB1b, BalanceCG); exported/filterable -> upper-bound check. |
| 723 | A | MISSING | SI 115AC(1)(c) <= CG B6iiic (NRIOnSec112and115Dtls[] SectionCode=5AC1c, BalanceCG); exported/filterable -> upper-bound check. |
| 724 | A | MISSING | SI 115AD(1)(b)(ii) <= CG A5e (ShortTermCapGain.NRISecur115AD.CapgainonAssets); exported single leaf -> upper-bound check. |
| 725 | A | MISSING | SI 115AD(1)(b)(iii) <= CG B6ivc (NRIOnSec112and115Dtls[] SectionCode=5ADiii, BalanceCG); exported/filterable -> upper-bound check. |
| 726 | A | MISSING | SI 115AD(1)(b)(iii)Proviso <= CG B7 (LongTermCapGain.NRISaleOfEquityShareUs112A.CapgainonAssets); exported single leaf -> upper-bound check. |
| 727 | A | MISSING | SI PTI STCG@20 <= CG A8a (ShortTermCapGain.PassThrIncNatureSTCG20Per); exported single leaf -> upper-bound check. |
| 728 | A | MISSING | SI PTI STCG@30 <= CG A8b (ShortTermCapGain.PassThrIncNatureSTCG30Per); exported single leaf -> upper-bound check. |
| 729 | A | OFFLINE-IMPOSSIBLE | CG B10a1 (PTI LTCG@12.5 u/s112A) is not exported separately: LongTermCapGain.PassThrIncNatureLTCG merges B10a1+B10a2 into one field -> the 112A sub-item cap has no carrying schema field. |
| 730 | A | OFFLINE-IMPOSSIBLE | CG B10a2 (PTI LTCG@12.5 other) is not exported separately: PassThrIncNatureLTCG merges B10a1+B10a2 -> the sub-item cap has no carrying schema field. |
| 731 | A | ENCODED | encoded in enc_17 (A/Dd(731,...) drives the assertion) |
| 732 | A | ENCODED | encoded in enc_17 (A/Dd(732,...) drives the assertion) |
| 733 | A | ENCODED | encoded in enc_17 (A/Dd(733,...) drives the assertion) |
| 734 | A | ENCODED | encoded in enc_17 (A/Dd(734,...) drives the assertion) |
| 735 | A | ENCODED | encoded in enc_17 (A/Dd(735,...) drives the assertion) |
| 736 | A | ENCODED | encoded in enc_17 (A/Dd(736,...) drives the assertion) |
| 737 | A | ENCODED | encoded in enc_17 (A/Dd(737,...) drives the assertion) |
| 738 | A | ENCODED | encoded in enc_17 (A/Dd(738,...) drives the assertion) |
| 739 | A | ENCODED | encoded in enc_17 (A/Dd(739,...) drives the assertion) |
| 740 | A | ENCODED | encoded in enc_17 (A/Dd(740,...) drives the assertion) |
| 741 | A | ENCODED | encoded in enc_17 (A/Dd(741,...) drives the assertion) |
| 742 | A | ENCODED | encoded in enc_17 (A/Dd(742,...) drives the assertion) |
| 743 | A | NA | States a Description is NOT required for non-CBDT sub-categories - a relaxation, not a violable assertion; nothing to check. |
| 744 | A | NA | 'Exempt income only for applicable sections/sub-categories' - vague applicability statement, no single enumerable field beyond encoded 740. |
| 745 | A | ENCODED | encoded in enc_18 (A/Dd(745,...) drives the assertion) |
| 746 | A | ENCODED | encoded in enc_18 (A/Dd(746,...) drives the assertion) |
| 747 | A | ENCODED | encoded in enc_18 (A/Dd(747,...) drives the assertion) |
| 748 | A | ENCODED | encoded in enc_18 (A/Dd(748,...) drives the assertion) |
| 749 | A | ENCODED | encoded in enc_18 (A/Dd(749,...) drives the assertion) |
| 750 | A | ENCODED | encoded in enc_18 (A/Dd(750,...) drives the assertion) |
| 751 | A | ENCODED | encoded in enc_18 (A/Dd(751,...) drives the assertion) |
| 752 | A | ENCODED | encoded in enc_18 (A/Dd(752,...) drives the assertion) |
| 753 | A | ENCODED | encoded in enc_18 (A/Dd(753,...) drives the assertion) |
| 754 | A | ENCODED | encoded in enc_18 (A/Dd(754,...) drives the assertion) |
| 755 | A | ENCODED | encoded in enc_18 (A/Dd(755,...) drives the assertion) |
| 756 | A | ENCODED | encoded in enc_18 (A/Dd(756,...) drives the assertion) |
| 757 | A | ENCODED | encoded in enc_18 (A/Dd(757,...) drives the assertion) |
| 758 | A | ENCODED | encoded in enc_18 (A/Dd(758,...) drives the assertion) |
| 759 | A | ENCODED | encoded in enc_18 (A/Dd(759,...) drives the assertion) |
| 760 | A | ENCODED | encoded in enc_18 (A/Dd(760,...) drives the assertion) |
| 761 | A | ENCODED | encoded in enc_18 (A/Dd(761,...) drives the assertion) |
| 762 | A | OFFLINE-IMPOSSIBLE | PartB-TTI Sr.12 (115TD net tax) leaf is never populated by the exporter (70_sec_tax.js writes no 115TD sub-block under PartB_TTI); the LHS is absent from the exported JSON -> reads 0 and false-fires. |
| 763 | A | ENCODED | encoded in enc_18 (A/Dd(763,...) drives the assertion) |
| 764 | A | ENCODED | encoded in enc_18 (A/Dd(764,...) drives the assertion) |
| 765 | A | ENCODED | encoded in enc_18 (A/Dd(765,...) drives the assertion) |
| 766 | A | ENCODED | encoded in enc_18 (A/Dd(766,...) drives the assertion) |
| 767 | A | OFFLINE-IMPOSSIBLE | FSI HP income vs HP head total (Sl.1k+3): garbled 'minimum' directionality and foreign-gross vs head-net are not a clean comparable; cross-schedule head total not cleanly derivable -> false-fires. |
| 768 | A | OFFLINE-IMPOSSIBLE | FSI business income vs (TradingAccount Sl.D + positive P&L Sl.14): garbled fragment, cross-schedule aggregation not reliably reconstructable -> false-fires. |
| 769 | A | OFFLINE-IMPOSSIBLE | FSI capital-gains income vs CG head total: reversed/garbled directionality (foreign is a subset, foreign-gross can exceed net head) -> not a clean offline assertion. |
| 770 | A | OFFLINE-IMPOSSIBLE | FSI other-sources income vs OS head total: same reversed/garbled fragment, cross-schedule head total -> false-fires. |
| 771 | A | ENCODED | encoded in enc_18 (A/Dd(771,...) drives the assertion) |
| 772 | A | ENCODED | encoded in enc_18 (A/Dd(772,...) drives the assertion) |
| 773 | A | ENCODED | encoded in enc_18 (A/Dd(773,...) drives the assertion) |
| 774 | A | ENCODED | encoded in enc_18 (A/Dd(774,...) drives the assertion) |
| 775 | A | ENCODED | encoded in enc_18 (A/Dd(775,...) drives the assertion) |
| 776 | A | ENCODED | encoded in enc_18 (A/Dd(776,...) drives the assertion) |
| 777 | A | NA | Duplicate of encoded serial 840 (Schedule FA mandatory when PartB-TTI item 17 = Yes); the assertion is already enforced, nothing left unenforced. |
| 778 | A | NA | 'Complete details of foreign assets' - completeness of FA disclosure is an AIS/portal check; no single schema field carries a violable quantity. |
| 779 | A | OFFLINE-IMPOSSIBLE | GSTIN-present => turnover mandatory: exported turnover defaults to 0, so a blank is indistinguishable from a genuine nil turnover -> presence not verifiable offline (complement 780 IS encoded). |
| 780 | A | ENCODED | encoded in enc_18 (A/Dd(780,...) drives the assertion) |
| 781 | A | ENCODED | encoded in enc_18 (A/Dd(781,...) drives the assertion) |
| 782 | A | ENCODED | encoded in enc_19 (A/Dd(782,...) drives the assertion) |
| 783 | A | ENCODED | encoded in enc_19 (A/Dd(783,...) drives the assertion) |
| 784 | A | ENCODED | encoded in enc_19 (A/Dd(784,...) drives the assertion) |
| 785 | A | ENCODED | encoded in enc_19 (A/Dd(785,...) drives the assertion) |
| 786 | A | ENCODED | encoded in enc_19 (A/Dd(786,...) drives the assertion) |
| 787 | A | ENCODED | encoded in enc_19 (A/Dd(787,...) drives the assertion) |
| 788 | A | ENCODED | encoded in enc_19 (A/Dd(788,...) drives the assertion) |
| 789 | A | ENCODED | encoded in enc_19 (A/Dd(789,...) drives the assertion) |
| 790 | A | ENCODED | encoded in enc_19 (A/Dd(790,...) drives the assertion) |
| 791 | A | ENCODED | encoded in enc_19 (A/Dd(791,...) drives the assertion) |
| 792 | A | ENCODED | encoded in enc_19 (A/Dd(792,...) drives the assertion) |
| 793 | A | ENCODED | encoded in enc_19 (A/Dd(793,...) drives the assertion) |
| 794 | A | ENCODED | encoded in enc_19 (A/Dd(794,...) drives the assertion) |
| 795 | A | ENCODED | encoded in enc_19 (A/Dd(795,...) drives the assertion) |
| 796 | A | ENCODED | encoded in enc_19 (A/Dd(796,...) drives the assertion) |
| 797 | A | ENCODED | encoded in enc_19 (A/Dd(797,...) drives the assertion) |
| 798 | A | ENCODED | encoded in enc_19 (A/Dd(798,...) drives the assertion) |
| 799 | A | ENCODED | encoded in enc_19 (A/Dd(799,...) drives the assertion) |
| 800 | A | ENCODED | encoded in enc_19 (A/Dd(800,...) drives the assertion) |
| 801 | A | ENCODED | encoded in enc_19 (A/Dd(801,...) drives the assertion) |
| 802 | A | ENCODED | encoded in enc_19 (A/Dd(802,...) drives the assertion) |
| 803 | A | ENCODED | encoded in enc_19 (A/Dd(803,...) drives the assertion) |
| 804 | A | ENCODED | encoded in enc_19 (A/Dd(804,...) drives the assertion) |
| 805 | A | ENCODED | encoded in enc_19 (A/Dd(805,...) drives the assertion) |
| 806 | A | ENCODED | encoded in enc_19 (A/Dd(806,...) drives the assertion) |
| 807 | A | ENCODED | encoded in enc_19 (A/Dd(807,...) drives the assertion) |
| 808 | A | ENCODED | encoded in enc_19 (A/Dd(808,...) drives the assertion) |
| 809 | A | ENCODED | encoded in enc_19 (A/Dd(809,...) drives the assertion) |
| 810 | A | ENCODED | encoded in enc_19 (A/Dd(810,...) drives the assertion) |
| 811 | A | ENCODED | encoded in enc_19 (A/Dd(811,...) drives the assertion) |
| 812 | A | ENCODED | encoded in enc_19 (A/Dd(812,...) drives the assertion) |
| 813 | A | ENCODED | encoded in enc_19 (A/Dd(813,...) drives the assertion) |
| 814 | A | ENCODED | encoded in enc_19 (A/Dd(814,...) drives the assertion) |
| 815 | A | ENCODED | encoded in enc_19 (A/Dd(815,...) drives the assertion) |
| 816 | A | OFFLINE-IMPOSSIBLE | PartB-TTI 115TD tax ladder (Sl.12/13/14) is not represented in this form's export (70_sec_tax.js exports no section-115TD sub-block under PartB-TTI) -> no schema field to read. |
| 817 | A | ENCODED | encoded in enc_19 (A/Dd(817,...) drives the assertion) |
| 818 | A | ENCODED | encoded in enc_19 (A/Dd(818,...) drives the assertion) |
| 819 | A | ENCODED | encoded in enc_19 (A/Dd(819,...) drives the assertion) |
| 820 | A | ENCODED | encoded in enc_19 (A/Dd(820,...) drives the assertion) |
| 821 | A | ENCODED | encoded in enc_19 (A/Dd(821,...) drives the assertion) |
| 822 | A | ENCODED | encoded in enc_19 (A/Dd(822,...) drives the assertion) |
| 823 | A | ENCODED | encoded in enc_19 (A/Dd(823,...) drives the assertion) |
| 824 | A | ENCODED | encoded in enc_20 (A/Dd(824,...) drives the assertion) |
| 825 | A | ENCODED | encoded in enc_20 (A/Dd(825,...) drives the assertion) |
| 826 | A | ENCODED | encoded in enc_20 (A/Dd(826,...) drives the assertion) |
| 827 | A | ENCODED | encoded in enc_20 (A/Dd(827,...) drives the assertion) |
| 828 | A | ENCODED | encoded in enc_20 (A/Dd(828,...) drives the assertion) |
| 829 | A | ENCODED | encoded in enc_20 (A/Dd(829,...) drives the assertion) |
| 830 | A | ENCODED | encoded in enc_20 (A/Dd(830,...) drives the assertion) |
| 831 | A | ENCODED | encoded in enc_20 (A/Dd(831,...) drives the assertion) |
| 832 | A | ENCODED | encoded in enc_20 (A/Dd(832,...) drives the assertion) |
| 833 | A | ENCODED | encoded in enc_20 (A/Dd(833,...) drives the assertion) |
| 834 | A | ENCODED | encoded in enc_20 (A/Dd(834,...) drives the assertion) |
| 835 | A | ENCODED | encoded in enc_20 (A/Dd(835,...) drives the assertion) |
| 836 | A | ENCODED | encoded in enc_20 (A/Dd(836,...) drives the assertion) |
| 837 | A | ENCODED | encoded in enc_20 (A/Dd(837,...) drives the assertion) |
| 838 | A | ENCODED | encoded in enc_20 (A/Dd(838,...) drives the assertion) |
| 839 | A | OFFLINE-IMPOSSIBLE | PartB-TTI refund block exports only RefundDue (item 12); items 13/14/15 (refund adjustments) have no schema field -> assertion not evaluable offline. |
| 840 | A | ENCODED | encoded in enc_20 (A/Dd(840,...) drives the assertion) |
| 841 | A | NA | 234-I revised-return fee (Rs.1000) depends on the actual e-filing date ('filed after 31/12/2026'), a portal submission-time value absent from the offline schema. |
| 842 | A | NA | 234-I revised-return fee (Rs.5000) depends on the actual e-filing date, a portal submission-time value absent from the offline schema. |
| 843 | A | ENCODED | encoded in enc_20 (A/Dd(843,...) drives the assertion) |
| 844 | A | ENCODED | encoded in enc_20 (A/Dd(844,...) drives the assertion) |
| 845 | A | ENCODED | encoded in enc_20 (A/Dd(845,...) drives the assertion) |
| 846 | A | ENCODED | encoded in enc_20 (A/Dd(846,...) drives the assertion) |
| 847 | A | ENCODED | encoded in enc_20 (A/Dd(847,...) drives the assertion) |
| 848 | A | ENCODED | encoded in enc_20 (A/Dd(848,...) drives the assertion) |
| 849 | A | ENCODED | encoded in enc_20 (A/Dd(849,...) drives the assertion) |
| 850 | A | NA | 'TDS claimed => corresponding income offered' needs cross-matching each TDS row to income schedules / Form 26AS / AIS; no direct schema linkage between a TDS row and its income -> portal reconciliation. |
| 851 | A | ENCODED | encoded in enc_20 (A/Dd(851,...) drives the assertion) |
| 852 | A | ENCODED | encoded in enc_20 (A/Dd(852,...) drives the assertion) |
| 853 | A | ENCODED | encoded in enc_20 (A/Dd(853,...) drives the assertion) |
| 854 | A | ENCODED | encoded in enc_20 (A/Dd(854,...) drives the assertion) |
| 855 | A | ENCODED | encoded in enc_20 (A/Dd(855,...) drives the assertion) |
| 856 | A | ENCODED | encoded in enc_20 (A/Dd(856,...) drives the assertion) |
| 857 | A | ENCODED | encoded in enc_20 (A/Dd(857,...) drives the assertion) |
| 858 | A | ENCODED | encoded in enc_20 (A/Dd(858,...) drives the assertion) |
| 859 | A | ENCODED | encoded in enc_20 (A/Dd(859,...) drives the assertion) |
| 860 | A | ENCODED | encoded in enc_20 (A/Dd(860,...) drives the assertion) |
| 861 | A | ENCODED | encoded in enc_20 (A/Dd(861,...) drives the assertion) |
| 862 | A | ENCODED | encoded in enc_20 (A/Dd(862,...) drives the assertion) |
| 863 | A | ENCODED | encoded in enc_20 (A/Dd(863,...) drives the assertion) |
| 864 | A | ENCODED | encoded in enc_20 (A/Dd(864,...) drives the assertion) |
| 865 | A | ENCODED | encoded in enc_20 (A/Dd(865,...) drives the assertion) |
| 866 | A | ENCODED | encoded in enc_20 (A/Dd(866,...) drives the assertion) |

## Counts per bucket
- ENCODED: 197
- NA: 8
- OFFLINE-IMPOSSIBLE: 27
- MISSING: 23
- TOTAL: 255

## MISSING serials
**MISSING (23): 698, 699, 700, 704, 707, 709, 710, 713, 714, 715, 716, 717, 718, 719, 720, 721, 722, 723, 724, 725, 726, 727, 728**

All MISSING are Schedule-SI cross-schedule consistency checks whose BOTH operands are
exported schema fields and whose assertion is exact / non-false-firing offline arithmetic:
- 698,699,700,715,716 : SI special-rate income vs ScheduleOS 2c/2d/2a(115BB) amounts net of
  ScheduleOS NRIDTAADtlsSchOS (by ItemNoincl) on an identity code space; SI is built = OS-DTAA.
- 704,707,709,710,713,714 : SI CG/DTAA-OS income vs ScheduleBFLA col-5 leaves
  (IncOSDTAA / STCG30Per / STCGDTAARate / LTCGDTAARate / STCG20Per / LTCG12Per
  .IncBFLA.IncOfCurYrAfterSetOffBFLosses); SI income is constructed EQUAL to these leaves.
- 717-728 : SI section-code income <= the corresponding ScheduleCG sub-item leaf
  (A3ie/A3iie via EquityMFonSTT[].MFSectionCode; B3c Proviso112; B4/B7 SaleOfEquityShareUs112A/
  NRISaleOfEquityShareUs112A; A5e NRISecur115AD; B6ic/iic/iiic/ivc via NRIOnSec112and115Dtls[]
  .SectionCode; A8a/A8b PassThrIncNatureSTCG20Per/30Per). post-BFLA SI <= pre-BFLA CG leaf, so
  the upper-bound holds without needing the DTAA reduction -> non-false-firing.

Contrast (why the neighbours are NOT missing):
- 729,730 kept OFFLINE-IMPOSSIBLE: CG B10a1/B10a2 are merged into one exported leaf
  (LongTermCapGain.PassThrIncNatureLTCG), so the individual 112A / other sub-item cap has no field.
- 711 OFFLINE-IMPOSSIBLE: 115BBC has no SecCode in the ScheduleSI enum.
