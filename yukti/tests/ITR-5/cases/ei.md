# Schedule EI (ITR-5) — hand-computed case

Section `ei` — `forms/ITR-5/src/70_sec_ei.js`. Figures verified to the rupee
against the engine (`engEi`) and its export (`expEi`) with a stubbed shell
(scratchpad harness). Schema block `ScheduleEI`; only `TotalExemptInc` is
block-required.

Cell references: J4 Interest · J6/J7/J8/J9/J10 agri i–v · J38 Others (3) ·
J44 DTAA (4) · J46 Pass-through (5) · J47 Total (6). The hidden Dividend row
(J5) contributes 0.

## Case 1 — resident firm, net agri > Rs.5 lakh (land table opens)

Inputs (S.ei; residency S.pi.res = "RES"; Sch BP Sl.38 S.C.bp.a._38 = 100,000):
- 1  interest        = 12,000
- 2i  grossAgri      = 800,000
- 2ii expAgri        = 120,000
- 2iii unabAgri      = 30,000
- 2iv (auto)         = MAX(0, Sch BP Sl.38 = 100,000) = 100,000
- 2vi land[0]        = {district "Pune", pin 411001, meas 5.5, owned O, irr IRG}
- 3  others          = [{OTH / 10(2A) / 50,000}, {AGRI / 10(30) / 8,000}]
- 4  dtaa            = [{40,000 / Interest / CANADA(1) / Art 11 / OS / TRC Y}]
- 5  passThr         = 5,000

### Agri working (J9, J10)
- J9  2iv NetAgriIncRelateToRule7 = MAX(0, 100,000)                        = 100,000
- J10 2v  NetAgriIncOrOthrIncRule7 = MAX(0, 800,000 − 120,000 − 30,000 + 100,000)
                                   = MAX(0, 750,000)                        = 750,000
- needLand = 750,000 > 500,000 = true  → land table (2vi) mandatory

### Totals
- J38 Others (3)              = 50,000 + 8,000                             = 58,000
- J44 IncChrgblAsPerDTAA (4)  = 40,000                                     = 40,000
- J47 TotalExemptInc (6)      = MAX(0, 12,000 + 0(Dividend) + 750,000 + 58,000 + 40,000 + 5,000)
                              = 865,000

### Published / GTI
- S.C.ei.netAgri = 750,000  (carried to Part B-TI Sl.15 for rate purpose, > Rs.5,000)
- S.C.ei.income  = 0        (exempt income never enters Gross Total Income)

### Export (expEi) — verified verbatim keys
```
{"InterestInc":12000,"GrossAgriRecpt":800000,"ExpIncAgri":120000,
 "UnabAgriLossPrev8":30000,"NetAgriIncRelateToRule7":100000,
 "NetAgriIncOrOthrIncRule7":750000,
 "ExcNetAgriInc":{"ExcNetAgriIncDtls":[{"NameOfDistrict":"Pune","PinCode":411001,
   "MeasurementOfLand":5.5,"AgriLandOwnedFlag":"O","AgriLandIrrigatedFlag":"IRG"}]},
 "OthersInc":{"OthersIncDtls":[{"Category":"OTH","SubCategory":"10(2A)","OthAmount":50000},
   {"Category":"AGRI","SubCategory":"10(30)","OthAmount":8000}]},"Others":58000,
 "IncNotChrgblAsPerDTAA":{"IncNotChrgblAsPerDTAADtls":[{"AmountOfIncome":40000,
   "NatureOfIncome":"Interest","CountryName":"CANADA","CountryCodeExcludingIndia":"1",
   "ArticleOfDTAA":"11","HeadOfIncome":"OS","TRCFlag":"Y"}]},"IncChrgblAsPerDTAA":40000,
 "PassThrIncNotChrgblTax":5000,"TotalExemptInc":865000}
```
- PinCode exports as an integer; MeasurementOfLand keeps its decimal (5.5).
- Round-trip: export → impEi → engEi → expEi is byte-identical (rule 12). ✔

### Checks (chkEi)
- Resident with a DTAA row → one `warn` ("Sl. No. 4 is for non-residents only").
- No land error (all five land fields valid, PIN is 6 digits).

## Case 2 — empty schedule
- Every input nil → J10 = 0, J47 = 0.
- Export writes only the two computed keys: `{"NetAgriIncOrOthrIncRule7":0,"TotalExemptInc":0}`.
- S.C.ei.netAgri = 0; needLand = false (land table stays closed).

## Case 3 — agricultural loss floored (enter nil if loss)
- grossAgri 100,000; expAgri 150,000; iv = 0 → J10 = MAX(0, 100,000 − 150,000) = 0.
- Confirms the "enter nil if loss" flooring on 2v; TotalExemptInc = 0.

## Notes on faithfulness
- 2iv schema key is **`NetAgriIncRelateToRule7`** (ITR-5), not ITR-3's `AgriIncRule7and8`.
- Head-of-income enum is HP/BP/CG/OS (no Salary; BP = Business & Profession).
- Category dropdown offers the 9 utility categories (8 for residents — OTHN
  dropped); SRSC/SRST are schema-valid but the utility never surfaces them.
- Sub-Category is a dependent dropdown (74 of the 106 schema codes are
  reachable via a category; residents lose 10(4C)/10(4E) from ISI, 10(8A)
  from OTH, and the whole OTHN group). Codes/labels driven from enums.json;
  country names taken from EI.md (enums.json's country label column is scrambled).
