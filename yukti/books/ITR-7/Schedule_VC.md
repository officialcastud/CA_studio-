# The book of Schedule VC — Voluntary Contributions · ITR-7, A.Y. 2026-27

Read row by row from the utility's **VC** sheet (rows 3–28; no hidden rows) and
confirmed against the CBDT ITR-7 schema block **ScheduleVC**. This is the
**receipts side** of a charitable/religious trust or institution: the record of
**Voluntary Contributions (Donations Received)** — split Domestic (A) vs Foreign
(B), corpus vs other-than-corpus, and the carve-out of **anonymous donations
chargeable u/s 115BBC @ 30%** (D). *Voluntary Contributions (Donations Received)
— to be mandatorily filled in by all persons filing ITR-7.* Nothing here is
invented: Appendix 2 lists every schema leaf, Appendix 3 reproduces every live
row verbatim, Appendix 1 the dropdowns.

---

## 1 · Purpose and shape

Schedule VC is a fixed, single-column working (amount in column F/L, schema key
noted in column M). It has four blocks:

- **A — Domestic Contribution** (other than anonymous donations taxable u/s
  115BBC): corpus (Ai = Aia + Aib) and other-than-corpus (Aii, with its own
  breakdown iia–iid summing to the total iie), then the domestic voluntary
  contribution total Aiii = Ai + Aiie.
- **B — Foreign contribution** (other than anonymous donations taxable u/s
  115BBC): corpus (Bi = Bia + Bib), other-than-corpus (Bii), foreign
  contribution total Biii = Bi + Bii, plus a free-text purpose line (Biv).
- **C — Total Contributions** = Aiii + Biii.
- **D — Anonymous donations, chargeable u/s 115BBC** (aggregate Di, the 5%/₹1 lakh
  floor Dii, and the taxable balance Diii = Di − Dii), and **E** — anonymous
  donations **other** than those included at Diii.

The wrapper objects are `Local` (block A), `Foreign` (block B), a scalar
`TotalContribution` (C), and `AnonymousDonations` (blocks D and E).

---

## 2 · The rows → schema map

| Row | Item | Label (verbatim) | Type | Schema key |
|---|---|---|---|---|
| 4 | A | Domestic Contribution (Other than anonymous donations taxable u/s 115BBC) | header | — |
| 5 | Ai | Corpus donation (Aia +Aib) | integer (computed) | `Local.CorpusFundDonation` |
| 6 | Aia | Corpus representing donations received for the renovation or repair of places notified u/s 80G(2)(b) | integer | `Local.CorpusFundDonationUS80G2b` |
| 7 | Aib | Corpus other than above | integer | `Local.CorpusFundDonationOther80G2b` |
| 8 | ii | Other than corpus donation | header | — |
| 9 | iia | Grants Received from Government | integer | `Local.GrantsReceivedFormGovt` |
| 10 | iib | Grants Received from Companies under Corporate Social Responsibility | integer | `Local.GrantsReceivedFromCompanie` |
| 11 | iic | Other specific grants | integer | `Local.OtherSpecificGrants` |
| 12 | iid | Other Donations | integer | `Local.OtherDonation` |
| 13 | iie | Total | integer (computed) | `Local.TotalOtherThanCorpusFund` |
| 14 | iii | Voluntary contribution Domestic (Ai + Aiie) | integer (computed) | `Local.VoluntaryContribution` |
| 15 | B | Foreign contribution (Other than anonymous donations taxable u/s 115BBC) | header | — |
| 16 | Bi | Corpus donation (Bia +Bib) | integer (computed) | `Foreign.CorpusFundDonation` |
| 17 | Bia | Corpus representing donations received for the renovation or repair of places notified u/s 80G(2)(b) | integer | `Foreign.CorpusFundDonationUS80G2b` |
| 18 | Bib | Corpus other than above | integer | `Foreign.CorpusFundDonationOther80G2b` |
| 19 | ii | Other than corpus donation | integer | `Foreign.OtherThanCorpusFund` |
| 20 | iii | Foreign contribution (Bi + Bii) | integer (computed) | `Foreign.ForeignContribution` |
| 21 | iv | Specify the purpose for which foreign contribution has been received | text | `Foreign.PurposeOfContribution` |
| 23 | C | Total Contributions (Aiii + Biii) | integer (computed) | `TotalContribution` |
| 24 | D | Anonymous donations, chargeable u/s 115BBC | header | — |
| 25 | Di | Aggregate of such anonymous donations received | integer | `AnonymousDonations.AggregateAnonymousDonations` |
| 26 | Dii | 5% of total donations received at (Sl. No. C+ Di) or 1,00,000 whichever is higher | integer (computed) | `AnonymousDonations.TotalDonationsReceived` |
| 27 | Diii | Anonymous donations chargeable u/s 115BBC @ 30% (i – ii) | integer (computed) | `AnonymousDonations.AnonymousDonations115BBC` |
| 28 | E | Anonymous donations other than those included at Sl. No. Diii (Di-Diii of Schedule VC) | integer (computed) | `AnonymousDonations.AnonymousDonationsOthr115BBC` |

---

## 3 · The law and computation the section-builder must encode

**Corpus vs other-than-corpus.** A voluntary contribution made with a specific
direction that it shall form part of the corpus of the trust or institution is a
**corpus donation** (Aia/Aib for domestic, Bia/Bib for foreign). Corpus
representing donations received for the **renovation or repair of places notified
u/s 80G(2)(b)** (temples, mosques, gurudwaras, churches or other notified places)
is segregated at **Aia/Bia**; all other corpus is **Aib/Bib**. So:

- **Ai** = `Local.CorpusFundDonation` = Aia + Aib.
- **Bi** = `Foreign.CorpusFundDonation` = Bia + Bib.

**Other than corpus (domestic breakdown).** The domestic non-corpus receipts are
split into (iia) **Grants Received from Government**, (iib) **Grants Received from
Companies under Corporate Social Responsibility** (CSR), (iic) **Other specific
grants**, and (iid) **Other Donations**. Their **Total (iie)** =
`Local.TotalOtherThanCorpusFund` = iia + iib + iic + iid.

**Domestic voluntary contribution (Aiii)** = `Local.VoluntaryContribution` = Ai +
Aiie (corpus + other-than-corpus).

**Foreign side (B).** Foreign non-corpus (Bii) is a single line
`Foreign.OtherThanCorpusFund`; foreign contribution total **Biii** =
`Foreign.ForeignContribution` = Bi + Bii. Biv (`Foreign.PurposeOfContribution`)
is a free-text statement of the purpose for which foreign contribution has been
received (FCRA linkage).

**Total Contributions (C)** = `TotalContribution` = Aiii + Biii.

**Anonymous donations u/s 115BBC (block D).** Section 115BBC taxes **anonymous
donations** at a flat **30%**. Applicable to an assessee claiming exemption u/s
11 or 10(23C)(iv)/(v)/(vi)/(via)/(iiiad)/(iiiae); to be filled only by trusts
other than those covered u/s 115BBC(2) (i.e. wholly religious trusts and
religious-cum-charitable trusts are outside 115BBC except donations to any
educational/medical institution run by them). An anonymous donation is one where
the trust does not maintain a record of the identity (name and address) of the
donor.

- **Di** = `AggregateAnonymousDonations` = aggregate of such anonymous donations
  received.
- **Dii** = `TotalDonationsReceived` = the statutory floor — **5% of total
  donations received at (C + Di), or ₹1,00,000, whichever is higher**. (The
  sheet's helper cell W22 computes "5% of (C+Di)".)
- **Diii** = `AnonymousDonations115BBC` = the amount **chargeable u/s 115BBC @
  30%** = Di − Dii (the excess of anonymous donations over the floor).
- **E** = `AnonymousDonationsOthr115BBC` = anonymous donations **other than** those
  included at Diii = **Di − Diii** — the part within the floor, which is not
  taxed at 30% and instead falls to be treated as ordinary income subject to the
  11/10(23C) exemption regime.

**Cross-sheet feeds.** The taxable Diii flows into the 115BBC special-rate
computation (Schedule SI / Part B-TI). The total contributions and the
corpus/other split feed the application-of-income working in Schedule ER/EC and
the exemption schedules. Schedule AI (aggregate of income derived) is filled
**excluding** these voluntary contributions — VC and AI are complementary halves
of the receipts side.

---

## 4 · Dropdowns

Schedule VC has **no value dropdowns** — every input is a numeric amount or a
free-text purpose line. The dump reports only formula/format sources (column N
formatting and the W22 helper), all with null value lists.

---

## Appendix 1 · Dropdown values (verbatim)
```
(none — Schedule VC has no selectable dropdown lists; all inputs are integer amounts or free text)
```

---

## Appendix 2 · Every schema leaf of block ScheduleVC (full paths)
`*` = required.
```
* Local.CorpusFundDonation integer
* Local.CorpusFundDonationUS80G2b integer
* Local.CorpusFundDonationOther80G2b integer
* Local.GrantsReceivedFormGovt integer
* Local.GrantsReceivedFromCompanie integer
* Local.OtherSpecificGrants integer
* Local.OtherDonation integer
* Local.TotalOtherThanCorpusFund integer
* Local.VoluntaryContribution integer
* Foreign.CorpusFundDonation integer
* Foreign.CorpusFundDonationUS80G2b integer
* Foreign.CorpusFundDonationOther80G2b integer
* Foreign.OtherThanCorpusFund integer
* Foreign.ForeignContribution integer
  Foreign.PurposeOfContribution string
* TotalContribution integer
* AnonymousDonations.AggregateAnonymousDonations integer
* AnonymousDonations.TotalDonationsReceived integer
* AnonymousDonations.AnonymousDonations115BBC integer
* AnonymousDonations.AnonymousDonationsOthr115BBC integer
```

---

## Appendix 3 · Every live row of the sheet, verbatim
```
[C3] Schedule VC  |  [G3] Voluntary Contributions (Donations Received) (to be mandatorily filled in by all persons filing ITR-7)
[D4] A  |  [E4] Domestic Contribution (Other than anonymous donations taxable u/s 115BBC)
[E5] Ai  |  [F5] Corpus donation (Aia +Aib)  |  [M5] Ai
[E6] Aia  |  [F6] Corpus representing donations received for the renovation or repair of places notified u/s 80G(2)(b)  |  [M6] Aia
[E7] Aib  |  [F7] Corpus other than above  |  [M7] Aib
[E8] ii  |  [F8] Other than corpus donation
[E9] iia  |  [F9] Grants Received from Government  |  [M9] Aiia
[E10] iib  |  [F10] Grants Received from Companies under Corporate Social Responsibility  |  [M10] Aiib
[E11] iic  |  [F11] Other specific grants  |  [M11] Aiic
[E12] iid  |  [F12] Other Donations  |  [M12] Aiid
[E13] iie  |  [F13] Total  |  [M13] Aiie
[E14] iii  |  [F14] Voluntary contribution Domestic (Ai + Aiie)  |  [M14] Aiii
[D15] B  |  [E15] Foreign contribution (Other than anonymous donations taxable u/s 115BBC)
[E16] Bi  |  [F16] Corpus donation (Bia +Bib)  |  [M16] Bi
[E17] Bia  |  [F17] Corpus representing donations received for the renovation or repair of places notified u/s 80G(2)(b)  |  [M17] Bia
[E18] Bib  |  [F18] Corpus other than above  |  [M18] Bib
[E19] ii  |  [F19] Other than corpus donation  |  [M19] Bii
[E20] iii  |  [F20] Foreign contribution (Bi + Bii)  |  [M20] Biii
[E21] iv  |  [F21] Specify the purpose for which foreign contribution has been received
[W22] 5% of (C+Di)
[D23] C  |  [E23] Total Contributions (Aiii + Biii)  |  [M23] C
[D24] D  |  [E24] Anonymous donations, chargeable u/s 115BBC [Applicable to assessee claiming exemption u/s 11 or 10(23C)(iv) or 10(23C)(v) or 10(23C)(vi) or 10(23C)(via) or 10(23C)(iiiad) or 10(23C)(iiiae)] [to be filled only by trusts other than those covered u/s 115BBC(2)]
[E25] i  |  [F25] Aggregate of such anonymous donations received  |  [M25] Di
[E26] ii  |  [F26] 5% of total donations received at (Sl. No. C+ Di) or 1,00,000 whichever is higher  |  [M26] Dii
[E27] iii  |  [F27] Anonymous donations chargeable u/s 115BBC @ 30% (i – ii)  |  [M27] Diii
[D28] E  |  [E28] Anonymous donations other than those included at Sl. No. Diii (Di-Diii of Schedule VC)  |  [M28] E
```
