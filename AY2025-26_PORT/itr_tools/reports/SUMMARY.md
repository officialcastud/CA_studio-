# ITR AY conversion — summary

| Form | From → To | Fields −/+/Δ | Rules disable/add/changed/year-only | Report |
|---|---|---|---|---|
| ITR-1 | 2026-27 → 2025-26 | 78/84/9 | 77/19/15/1 | [ITR-1_AY2026-27_to_AY2025-26.md](ITR-1_AY2026-27_to_AY2025-26.md) |
| ITR-2 | 2026-27 → 2025-26 | 57/293/24 | 128/85/70/1 | [ITR-2_AY2026-27_to_AY2025-26.md](ITR-2_AY2026-27_to_AY2025-26.md) |
| ITR-3 | 2026-27 → 2025-26 | 98/342/33 | 207/203/82/1 | [ITR-3_AY2026-27_to_AY2025-26.md](ITR-3_AY2026-27_to_AY2025-26.md) |
| ITR-4 | 2026-27 → 2025-26 | 86/96/10 | 138/77/21/3 | [ITR-4_AY2026-27_to_AY2025-26.md](ITR-4_AY2026-27_to_AY2025-26.md) |
| ITR-6 | 2026-27 → 2025-26 | no schema pair | 135/128/100/0 | [ITR-6_AY2026-27_to_AY2025-26.md](ITR-6_AY2026-27_to_AY2025-26.md) |
| ITR-7 | 2026-27 → 2025-26 | no schema pair | 55/68/70/6 | [ITR-7_AY2026-27_to_AY2025-26.md](ITR-7_AY2026-27_to_AY2025-26.md) |

ITR-6 / ITR-7: **rules-only diff** — the AY 2025-26 CBDT validation-rules PDFs (and
the ITR-6 schema-change document) were provided, but not the AY 2025-26 **schema
JSON**, so the field-level schema diff (3a REMOVE / 3b ADD / 3d CHANGE + the
`fields_ITR-{6,7}_AY2025-26.tsv` inventory) could not be computed. Drop
`ITR-6_2025_Main_V*.json` and `ITR-7_2025_Main_V*.json` in the input folder and
rerun `itr_diff.py` to fill those sections. ITR-6's intra-year schema-change
document is captured in §5 of its report.

Not provided yet: ITR-5 — drop its schema JSON + validation PDF in the input folder and rerun.
