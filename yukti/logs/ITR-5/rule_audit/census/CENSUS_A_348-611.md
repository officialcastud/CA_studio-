# ITR-5 rule census — SLICE A_348-611 (Category-A serials 348-611)

Worktree: /home/user/ca-itr5/yukti (source read-only). Encoded rules live in enc_08..enc_13 (plus 348-350 in enc_07). A rule is ENCODED when its serial drives an A()/Dd() assertion, whether by a literal `A(n,` call, an array/loop serial (e.g. dtaaRate(...,serial), the `scrip(...,[451..466])` helper, the CYLA/BFLA/80G loops), or a computed serial (598+bi / 602+bi).

| serial | cat | bucket | justification (field / reason) |
|---|---|---|---|
| 348 | A | ENCODED | A(348,..) in enc_07 |
| 349 | A | ENCODED | A(349,..) in enc_07 |
| 350 | A | ENCODED | A(350,..) in enc_07 |
| 351 | A | ENCODED | A(351,..) in enc_08 |
| 352 | A | ENCODED | A(352,..) in enc_08 |
| 353 | A | ENCODED | A(353,..) in enc_08 |
| 354 | A | ENCODED | A(354,..) in enc_08 |
| 355 | A | ENCODED | A(355,..) in enc_08 |
| 356 | A | ENCODED | A(356,..) in enc_08 |
| 357 | A | ENCODED | A(357,..) in enc_08 |
| 358 | A | ENCODED | A(358,..) in enc_08 |
| 359 | A | ENCODED | A(359,..) in enc_08 |
| 360 | A | ENCODED | A(360,..) in enc_08 |
| 361 | A | ENCODED | A(361,..) in enc_08 |
| 362 | A | ENCODED | A(362,..) in enc_08 |
| 363 | A | ENCODED | A(363,..) in enc_08 |
| 364 | A | ENCODED | A(364,..) in enc_08 |
| 365 | A | ENCODED | A(365,..) in enc_08 |
| 366 | A | ENCODED | A(366,..) in enc_08 |
| 367 | A | ENCODED | A(367,..) in enc_08 |
| 368 | A | ENCODED | A(368,..) in enc_08 |
| 369 | A | ENCODED | A(369,..) in enc_08 |
| 370 | A | ENCODED | A(370,..) in enc_08 |
| 371 | A | ENCODED | A(371,..) in enc_08 |
| 372 | A | ENCODED | A(372,..) in enc_08 |
| 373 | A | ENCODED | A(373,..) in enc_08 |
| 374 | A | ENCODED | A(374,..) in enc_08 |
| 375 | A | ENCODED | A(375,..) in enc_08 |
| 376 | A | ENCODED | A(376,..) in enc_08 |
| 377 | A | ENCODED | A(377,..) in enc_08 |
| 378 | A | ENCODED | A(378,..) in enc_08 |
| 379 | A | ENCODED | A(379,..) in enc_08 |
| 380 | A | ENCODED | A(380,..) in enc_08 |
| 381 | A | ENCODED | A(381,..) in enc_08 |
| 382 | A | ENCODED | A(382,..) in enc_08 |
| 383 | A | ENCODED | A(383,..) in enc_08 |
| 384 | A | ENCODED | A(384,..) in enc_08 |
| 385 | A | ENCODED | A(385,..) in enc_08 |
| 386 | A | ENCODED | A(386,..) in enc_08 |
| 387 | A | ENCODED | A(387,..) in enc_08 |
| 388 | A | ENCODED | A(388,..) in enc_08 |
| 389 | A | OFFLINE-IMPOSSIBLE | Ei3 income row: engine-internal floored @30% rate-split (CurrYrLosses.InStcg30Per.CurrYearIncome is post-max(0)); rule text omits A3ii and adds spurious A9a/A9b reduction -> literal identity false-fires. enc_08 foot. |
| 390 | A | OFFLINE-IMPOSSIBLE | Ei4 income row: floored applicable-rate bucket (CurrYearIncome=max(0,..)); 'as reduced by A9a&A9b' clause not part of engine stApp; literal false-fires. enc_08 foot. |
| 391 | A | ENCODED | A(391,..) in enc_08 |
| 392 | A | ENCODED | A(392,..) in enc_08 |
| 393 | A | OFFLINE-IMPOSSIBLE | Eiii = duplicate of 389 (same @30% floored rate-split aggregate). enc_08 foot. |
| 394 | A | OFFLINE-IMPOSSIBLE | Eiv = duplicate of 390 (same applicable-rate floored aggregate). enc_08 foot. |
| 395 | A | ENCODED | A(395,..) in enc_08 |
| 396 | A | ENCODED | A(396,..) in enc_08 |
| 397 | A | ENCODED | A(397,..) in enc_08 |
| 398 | A | ENCODED | A(398,..) in enc_08 |
| 399 | A | ENCODED | A(399,..) in enc_08 |
| 400 | A | ENCODED | A(400,..) in enc_08 |
| 401 | A | ENCODED | A(401,..) in enc_09 |
| 402 | A | OFFLINE-IMPOSSIBLE | Table F Sl.6 ~ BFLA 5xi (LTCG @20% with indexation): that bucket is hidden for a firm/AOP/BOI; no LongTermUnder20Per Table-F row and no ScheduleBFLA.LTCG20Per field exist. enc_09 foot. |
| 403 | A | ENCODED | A(403,..) in enc_09 |
| 404 | A | ENCODED | A(404,..) in enc_09 |
| 405 | A | ENCODED | A(405,..) in enc_09 |
| 406 | A | ENCODED | A(406,..) in enc_09 |
| 407 | A | ENCODED | A(407,..) in enc_09 |
| 408 | A | ENCODED | A(408,..) in enc_09 |
| 409 | A | ENCODED | A(409,..) in enc_09 |
| 410 | A | ENCODED | A(410,..) in enc_09 |
| 411 | A | ENCODED | A(411,..) in enc_09 |
| 412 | A | ENCODED | A(412,..) in enc_09 |
| 413 | A | ENCODED | A(413,..) in enc_09 |
| 414 | A | OFFLINE-IMPOSSIBLE | Table F Sl.8 ~ Schedule SI 'CG income': duplicate of encoded 415 (Sl.8=C2); SI 115BBH VDA CG/business rate-split is engine-computed, no reproducible leaf. enc_09 foot. |
| 415 | A | ENCODED | A(415,..) in enc_09 |
| 416 | A | ENCODED | A(416,..) in enc_09 |
| 417 | A | ENCODED | A(417,..) in enc_09 |
| 418 | A | ENCODED | A(418,..) in enc_09 |
| 419 | A | ENCODED | A(419,..) in enc_09 |
| 420 | A | ENCODED | A(420,..) in enc_09 |
| 421 | A | ENCODED | A(421,..) in enc_09 |
| 422 | A | OFFLINE-IMPOSSIBLE | Ei2 = A3e+A4a+A8a+A(A)@20%: engine st20 uses A3i not A3e and floors at 0 (InStcg20Per.CurrYearIncome=max(0,..)); literal text false-fires. enc_09 foot. |
| 423 | A | OFFLINE-IMPOSSIBLE | Eii = duplicate of 422 (@20% floored rate-split). enc_09 foot. |
| 424 | A | OFFLINE-IMPOSSIBLE | Ei6 = B1g..B10+B(A)@12.5%: floored bucket (InLtcg12_5Per.CurrYearIncome=max(0,..)); literal '=' false-fires on a net LTCL bucket. enc_09 foot. |
| 425 | A | OFFLINE-IMPOSSIBLE | Evi = duplicate of 424 (@12.5% floored aggregate). enc_09 foot. |
| 426 | A | ENCODED | A(426,..) in enc_09 |
| 427 | A | ENCODED | A(427,..) in enc_09 |
| 428 | A | ENCODED | A(428,..) in enc_09 |
| 429 | A | ENCODED | A(429,..) in enc_09 |
| 430 | A | ENCODED | A(430,..) in enc_09 |
| 431 | A | ENCODED | A(431,..) in enc_09 |
| 432 | A | ENCODED | A(432,..) in enc_09 |
| 433 | A | ENCODED | A(433,..) in enc_09 |
| 434 | A | ENCODED | A(434,..) in enc_09 |
| 435 | A | ENCODED | A(435,..) in enc_09 |
| 436 | A | ENCODED | A(436,..) in enc_09 |
| 437 | A | ENCODED | A(437,..) in enc_09 |
| 438 | A | ENCODED | A(438,..) in enc_09 |
| 439 | A | ENCODED | A(439,..) in enc_09 |
| 440 | A | ENCODED | A(440,..) in enc_09 |
| 441 | A | ENCODED | A(441,..) in enc_09 |
| 442 | A | ENCODED | A(442,..) in enc_09 |
| 443 | A | ENCODED | A(443,..) in enc_09 |
| 444 | A | ENCODED | A(444,..) in enc_09 |
| 445 | A | ENCODED | A(445,..) in enc_09 |
| 446 | A | ENCODED | A(446,..) in enc_09 |
| 447 | A | OFFLINE-IMPOSSIBLE | CG B4 (SaleOfEquityShareUs112A) carries only CapgainonAssets; there is no section-48 deduction leaf at CG B4 to test (the u/s48 working lives in Schedule 112A). enc_09 foot. |
| 448 | A | ENCODED | A(448,..) in enc_09 |
| 449 | A | MISSING | A10=ST.TotalSTCG (signed, sg(A.total)) must equal A1e+A2c+A3e+A4a+A4b+A5e+A6g+A7+A8-A9a+A(A); EVERY term is an exported schema leaf (SaleofLandBuildDtls[].CapgainonAssets, SlumpSaleInStcg.CapgainonAssets, EquityMFonSTT[].CapgainonAssets, NRITransacSec48Dtl.NRItaxSTTPaid/NotPaid, NRISecur115AD.CapgainonAssets, SaleOnOtherAssets.CapgainonAssets, TotalAmtDeemedStcg, PassThrIncNatureSTCG, TotalAmtNotTaxUsDTAAStcg, CapitalLossBuyBackShares.TotalCapitalLossBuyBackShares) and the engine computes this exact sum at 70_sec_cg.js:283 -> self-contained offline identity, never encoded. |
| 450 | A | ENCODED | A(450,..) in enc_09 |
| 451 | A | ENCODED | A(451,..) in enc_10 |
| 452 | A | ENCODED | A(452,..) in enc_10 |
| 453 | A | ENCODED | A(453,..) in enc_10 |
| 454 | A | ENCODED | A(454,..) in enc_10 |
| 455 | A | ENCODED | A(455,..) in enc_10 |
| 456 | A | ENCODED | A(456,..) in enc_10 |
| 457 | A | ENCODED | A(457,..) in enc_10 |
| 458 | A | ENCODED | A(458,..) in enc_10 |
| 459 | A | ENCODED | A(459,..) in enc_10 |
| 460 | A | ENCODED | A(460,..) in enc_10 |
| 461 | A | ENCODED | A(461,..) in enc_10 |
| 462 | A | ENCODED | A(462,..) in enc_10 |
| 463 | A | ENCODED | A(463,..) in enc_10 |
| 464 | A | ENCODED | A(464,..) in enc_10 |
| 465 | A | ENCODED | A(465,..) in enc_10 |
| 466 | A | ENCODED | A(466,..) in enc_10 |
| 467 | A | ENCODED | A(467,..) in enc_10 |
| 468 | A | ENCODED | A(468,..) in enc_10 |
| 469 | A | ENCODED | A(469,..) in enc_10 |
| 470 | A | ENCODED | A(470,..) in enc_10 |
| 471 | A | ENCODED | A(471,..) in enc_10 |
| 472 | A | ENCODED | A(472,..) in enc_10 |
| 473 | A | ENCODED | A(473,..) in enc_10 |
| 474 | A | ENCODED | A(474,..) in enc_10 |
| 475 | A | ENCODED | A(475,..) in enc_10 |
| 476 | A | ENCODED | A(476,..) in enc_10 |
| 477 | A | ENCODED | A(477,..) in enc_10 |
| 478 | A | ENCODED | A(478,..) in enc_10 |
| 479 | A | OFFLINE-IMPOSSIBLE | 'NR showing income u/s 115BBF': truncated condition fragment with no assertion; 115BBF (patent royalty) is not a distinct Schedule-OS line/field in ITR-5. enc_10 foot. |
| 480 | A | ENCODED | A(480,..) in enc_10 |
| 481 | A | ENCODED | A(481,..) in enc_10 |
| 482 | A | ENCODED | A(482,..) in enc_10 |
| 483 | A | ENCODED | A(483,..) in enc_10 |
| 484 | A | ENCODED | A(484,..) in enc_10 |
| 485 | A | ENCODED | A(485,..) in enc_10 |
| 486 | A | ENCODED | A(486,..) in enc_10 |
| 487 | A | ENCODED | A(487,..) in enc_10 |
| 488 | A | ENCODED | A(488,..) in enc_10 |
| 489 | A | ENCODED | A(489,..) in enc_10 |
| 490 | A | ENCODED | A(490,..) in enc_10 |
| 491 | A | ENCODED | A(491,..) in enc_10 |
| 492 | A | ENCODED | A(492,..) in enc_10 |
| 493 | A | ENCODED | A(493,..) in enc_10 |
| 494 | A | ENCODED | A(494,..) in enc_10 |
| 495 | A | ENCODED | A(495,..) in enc_10 |
| 496 | A | OFFLINE-IMPOSSIBLE | item-10 dividend (115A(1)(a)(i)) vs 2c/2d: schema has no leaf linking an item-10 dividend category to a specific 2c/2d source-code amount (no enum->category map). enc_10 foot. |
| 497 | A | OFFLINE-IMPOSSIBLE | item-10 dividend (115AC @10%) vs 2c/2d: no enum->category leaf mapping. enc_10 foot. |
| 498 | A | OFFLINE-IMPOSSIBLE | item-10 dividend (115AD(1)(i) FII @20%) vs 2c/2d: no enum->category leaf mapping. enc_10 foot. |
| 499 | A | OFFLINE-IMPOSSIBLE | item-10 dividend (specified fund 115AD(1)(i) @10%) vs 2c/2d: no enum->category leaf mapping. enc_10 foot. |
| 500 | A | ENCODED | A(500,..) in enc_10 |
| 501 | A | ENCODED | A(501,..) in enc_11 |
| 502 | A | OFFLINE-IMPOSSIBLE | item-10 dividend (115A(1)(a)(A) @10%) vs 2c/2d: no enum->category leaf mapping (same as 496-499). enc_11 foot. |
| 503 | A | ENCODED | A(503,..) in enc_11 |
| 504 | A | ENCODED | A(504,..) in enc_11 |
| 505 | A | ENCODED | A(505,..) in enc_11 |
| 506 | A | ENCODED | A(506,..) in enc_11 |
| 507 | A | ENCODED | A(507,..) in enc_11 |
| 508 | A | ENCODED | A(508,..) in enc_11 |
| 509 | A | ENCODED | A(509,..) in enc_11 |
| 510 | A | ENCODED | A(510,..) in enc_11 |
| 511 | A | ENCODED | A(511,..) in enc_11 |
| 512 | A | ENCODED | A(512,..) in enc_11 |
| 513 | A | ENCODED | A(513,..) in enc_11 |
| 514 | A | ENCODED | A(514,..) in enc_11 |
| 515 | A | ENCODED | A(515,..) in enc_11 |
| 516 | A | ENCODED | A(516,..) in enc_11 |
| 517 | A | ENCODED | A(517,..) in enc_11 |
| 518 | A | ENCODED | A(518,..) in enc_11 |
| 519 | A | ENCODED | A(519,..) in enc_11 |
| 520 | A | ENCODED | A(520,..) in enc_11 |
| 521 | A | ENCODED | A(521,..) in enc_11 |
| 522 | A | ENCODED | A(522,..) in enc_11 |
| 523 | A | ENCODED | A(523,..) in enc_11 |
| 524 | A | ENCODED | A(524,..) in enc_11 |
| 525 | A | NA | CYLA set-off ORDERING rule (normal OS loss set off first against race-horse profit then OS-DTAA); a priority rule of the greedy set-off walk, not a static schema identity. enc_11 foot. |
| 526 | A | NA | CYLA completeness ('whole HP loss set off if income>loss'): depends on the s.71(3A) Rs.2,00,000 cap and new-regime lapse; a lawful return carries the excess to CFL, so a static equality false-fires. enc_11 foot. |
| 527 | A | ENCODED | A(527,..) in enc_11 |
| 528 | A | ENCODED | A(528,..) in enc_11 |
| 529 | A | NA | CYLA completeness ('whole business loss set off'): same greedy-walk/ordering nature as 526; not a verifiable static identity. enc_11 foot. |
| 530 | A | NA | CYLA completeness ('whole OS loss set off'): a normal OS loss not set off lawfully lapses; static equality false-fires. enc_11 foot. |
| 531 | A | ENCODED | A(531,..) in enc_11 |
| 532 | A | ENCODED | A(532,..) in enc_11 |
| 533 | A | ENCODED | A(533,..) in enc_12 |
| 534 | A | ENCODED | A(534,..) in enc_12 |
| 535 | A | ENCODED | A(535,..) in enc_12 |
| 536 | A | ENCODED | A(536,..) in enc_12 |
| 537 | A | ENCODED | A(537,..) in enc_12 |
| 538 | A | ENCODED | A(538,..) in enc_12 |
| 539 | A | ENCODED | A(539,..) in enc_12 |
| 540 | A | ENCODED | A(540,..) in enc_12 |
| 541 | A | ENCODED | A(541,..) in enc_12 |
| 542 | A | ENCODED | A(542,..) in enc_12 |
| 543 | A | ENCODED | A(543,..) in enc_12 |
| 544 | A | ENCODED | A(544,..) in enc_12 |
| 545 | A | ENCODED | A(545,..) in enc_12 |
| 546 | A | ENCODED | A(546,..) in enc_12 |
| 547 | A | ENCODED | A(547,..) in enc_12 |
| 548 | A | ENCODED | A(548,..) in enc_12 |
| 549 | A | ENCODED | A(549,..) in enc_12 |
| 550 | A | ENCODED | A(550,..) in enc_12 |
| 551 | A | ENCODED | A(551,..) in enc_12 |
| 552 | A | ENCODED | A(552,..) in enc_12 |
| 553 | A | ENCODED | A(553,..) in enc_12 |
| 554 | A | OFFLINE-IMPOSSIBLE | BFLA BF business loss/depreciation cannot set off 44BB/44BBD income: no schema flag marks a head's income as 44BB/44BBD; needs the presumptive-scheme break-up not present in the return object. enc_12 foot. |
| 555 | A | ENCODED | A(555,..) in enc_12 |
| 556 | A | ENCODED | A(556,..) in enc_12 |
| 557 | A | ENCODED | A(557,..) in enc_12 |
| 558 | A | ENCODED | A(558,..) in enc_12 |
| 559 | A | NA | Part B-TI Sl.17 flows from CFL: cross-schedule to Part B-TI (owned by the TI/TTI section); engine populates it from CFL total xxii not the rule's xix, and the Investment-Fund branch needs the sub-status enum -> literal check false-fires. enc_12 foot. |
| 560 | A | ENCODED | A(560,..) in enc_12 |
| 561 | A | ENCODED | A(561,..) in enc_12 |
| 562 | A | ENCODED | A(562,..) in enc_12 |
| 563 | A | ENCODED | A(563,..) in enc_12 |
| 564 | A | ENCODED | A(564,..) in enc_12 |
| 565 | A | ENCODED | A(565,..) in enc_12 |
| 566 | A | ENCODED | A(566,..) in enc_12 |
| 567 | A | ENCODED | A(567,..) in enc_12 |
| 568 | A | ENCODED | A(568,..) in enc_12 |
| 569 | A | ENCODED | A(569,..) in enc_12 |
| 570 | A | ENCODED | A(570,..) in enc_12 |
| 571 | A | ENCODED | A(571,..) in enc_12 |
| 572 | A | ENCODED | A(572,..) in enc_12 |
| 573 | A | ENCODED | A(573,..) in enc_12 |
| 574 | A | ENCODED | A(574,..) in enc_12 |
| 575 | A | ENCODED | A(575,..) in enc_12 |
| 576 | A | ENCODED | A(576,..) in enc_12 |
| 577 | A | ENCODED | A(577,..) in enc_12 |
| 578 | A | ENCODED | A(578,..) in enc_13 |
| 579 | A | ENCODED | A(579,..) in enc_13 |
| 580 | A | ENCODED | A(580,..) in enc_13 |
| 581 | A | ENCODED | A(581,..) in enc_13 |
| 582 | A | OFFLINE-IMPOSSIBLE | 80GGC 'if iii>0 then iv/vii/viii not required': sl.nos iv/vii/viii have no corresponding fields in the ITR-5 Schedule80GGC schema; no numeric assertion. enc_13 foot. |
| 583 | A | ENCODED | A(583,..) in enc_13 |
| 584 | A | ENCODED | A(584,..) in enc_13 |
| 585 | A | ENCODED | A(585,..) in enc_13 |
| 586 | A | ENCODED | A(586,..) in enc_13 |
| 587 | A | ENCODED | A(587,..) in enc_13 |
| 588 | A | NA | 80GGA 'if other-mode donation>0 then details required': the transaction-ref/IFSC detail fields are written by the export only when supplied, so an engine return may lawfully omit them; a presence check false-fires. enc_13 foot. |
| 589 | A | ENCODED | A(589,..) in enc_13 |
| 590 | A | ENCODED | A(590,..) in enc_13 |
| 591 | A | ENCODED | A(591,..) in enc_13 |
| 592 | A | ENCODED | A(592,..) in enc_13 |
| 593 | A | ENCODED | A(593,..) in enc_13 |
| 594 | A | ENCODED | A(594,..) in enc_13 |
| 595 | A | ENCODED | A(595,..) in enc_13 |
| 596 | A | ENCODED | A(596,..) in enc_13 |
| 597 | A | ENCODED | A(597,..) in enc_13 |
| 598 | A | ENCODED | A(598,..) in enc_13 |
| 599 | A | ENCODED | A(599,..) in enc_13 |
| 600 | A | ENCODED | A(600,..) in enc_13 |
| 601 | A | ENCODED | A(601,..) in enc_13 |
| 602 | A | ENCODED | A(602,..) in enc_13 |
| 603 | A | ENCODED | A(603,..) in enc_13 |
| 604 | A | ENCODED | A(604,..) in enc_13 |
| 605 | A | ENCODED | A(605,..) in enc_13 |
| 606 | A | ENCODED | A(606,..) in enc_13 |
| 607 | A | ENCODED | A(607,..) in enc_13 |
| 608 | A | ENCODED | A(608,..) in enc_13 |
| 609 | A | ENCODED | A(609,..) in enc_13 |
| 610 | A | ENCODED | A(610,..) in enc_13 |
| 611 | A | NA | 80G 'Transaction Reference number for UPI/Cheque/IMPS/NEFT/RTGS and/or IFSC': truncated fragment carrying no checkable assertion. enc_13 foot. |

## Counts

- ENCODED: 237
- NA: 7
- OFFLINE-IMPOSSIBLE: 19
- MISSING: 1
- TOTAL: 264

**MISSING: 449**

**Serial 449 (Schedule CG, A10 STCG) is the only MISSING rule: `A10 = A1e+A2c+A3e+A4a+A4b+A5e+A6g+A7+A8 - A9a + A(A)`. The LHS `ST.TotalSTCG` is a signed exported leaf and every RHS term is an exported ScheduleCG schema leaf; the engine computes this exact sum at forms/ITR-5/src/70_sec_cg.js:283, so it is a self-contained offline consistency check that could have been encoded but was not.**
