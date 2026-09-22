# ITR-6 Module F — verification backlog (opened during 6B)

## SI-1 (verify first): Schedule-SI auto-feed vs manual — code 21 (LTCG u/s 112 @12.5%)
On the S SUDHIR test client the auto-feed (cg/os/bp siFeed) reproduces the manual SI override
head-for-head EXCEPT code 21: auto 3,500,000 vs manual 3,250,000 (+250,000). Auto is engine-derived
= max0(B1 land)+max0(B2 slump)+max0(B5 NR)+max0(B8)+max0(B9 deemed), apportioned from si112.
Net tax is identical either way (MAT 115JB floors it), so gate 7 can't discriminate.
TO VERIFY against the utility's SI sheet (books/ITR-6/SI.md row 14, named range B1GB2eB5B8B9):
does code 21 include B8/B9 deemed-gain at 12.5%? If yes -> auto is correct, switch the test client
to the auto-feed (S.si.edit off) and update figures.json gross tax 2,372,852 -> 2,338,076 (net/refund
unchanged). If no -> fix the cg siFeed code-21 sum. Also confirm the 1A vs PTI_STCG20P apportionment
(same slot total 205,000, split 156,765/48,235 auto vs 145,000/60,000 manual — both @20%, tax equal).

## SI-2: B6 non-resident LTCG SecCode is best-effort (free-text classifier in cg.js) — add a
## proper section-code dropdown to B6 so 5AB1b/5AC1c/5ADiii/21ciii is deterministic (all @12.5%,
## so tax is already correct; only the label is at risk).

## (Module F proper: leaf coverage, full rule-firing after ITR-6 rules are encoded, regime x entity
## x cap matrix, then fix-wave — mirrors ITR-5.)
