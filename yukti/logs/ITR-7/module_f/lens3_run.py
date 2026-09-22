#!/usr/bin/env python3
"""LENS 3 driver: run each regime/special-rate variant through the harness and
extract the emitted Part B-TI regime block, the Part B-TTI tax ladder, the
special-rate schedules, and any Category-A rule fires. Prints a per-variant
digest for hand-checking."""
import json, os, subprocess, sys

VARIANTS = [
 ("v1_1023Cvi",     "B1b · 10(23C)(vi) education institution"),
 ("v2_b3_mmr",      "B3 · MMR denial (22nd proviso 10(23C) / s.13(10))"),
 ("v3_115bbi",      "special · 115BBI specified income @30%"),
 ("v4_115td",       "special · 115TD accreted income / exit tax"),
 ("v5_b2_13A",      "B2 · political party 13A (139(4B))"),
 ("v6_b2_13B",      "B2 · electoral trust 13B"),
 ("v7_b2_1023Ciiiab","B2 · 10(23C)(iiiab) via Schedule IE-3"),
]

def g(o, path, d=None):
    for k in path.split("."):
        if isinstance(o, list):
            try: o=o[int(k)]
            except: return d
        elif isinstance(o, dict) and k in o: o=o[k]
        else: return d
    return o

def digest(vid, label):
    out = f"logs/ITR-7/module_f/variants/{vid}"
    state = f"logs/ITR-7/module_f/variants/{vid}.js"
    r = subprocess.run([sys.executable,"tools/harness/run_form.py","--form","ITR-7",
                        "--state",state,"--out",out], capture_output=True, text=True, timeout=240)
    summ = json.load(open(f"{out}/summary.json"))
    print("\n"+"="*90)
    print(f"[{vid}]  {label}")
    print("-"*90)
    print("boot_errors:", summ.get("boot_errors") or "none",
          "| page_errors:", summ.get("page_errors") or "none")
    print("checks_err :", summ.get("checks_err") or "none")
    print("figures    :", json.dumps(summ.get("figures")))
    rules = summ.get("rules", [])
    A=[x for x in rules if x.get("cat")=="A"]
    print(f"Category-A fires: {len(A)}", [x['n'] for x in A][:40])
    for x in A[:12]:
        print(f"    A{x['n']}: {x['msg'][:95]}")
    if summ.get("rules_error"): print("RULES_ERROR:", summ["rules_error"])
    if not summ.get("exported"): print("EXPORT BLOCKED:", summ.get("export_block"))
    # inspect the built return
    try:
        d=json.load(open(f"{out}/return.json")); j=d["ITR"]["ITR7"]
    except Exception as e:
        print("no return.json:", e); return
    present=[b for b in ("PartB_TI","PartB_TI2","PartB_TI3") if b in j]
    print("Part B-TI regime block emitted:", present or "NONE")
    schs=[b for b in ("Schedule115BBI","Schedule115TD","ScheduleVC","ScheduleAI","ScheduleA",
                      "SchedulePP","ScheduleET","ScheduleIE_I","ScheduleIE_II","ScheduleIE_III",
                      "ScheduleIE_IV","ITRScheduleJ","ITRScheduleR") if b in j]
    print("relevant schedules present:", schs)
    C="PartB_TTI.ComputationOfTaxLiability."
    ladder={
      "TaxPayableOnTotInc": g(j,C+"TaxPayableOnTI.TaxPayableOnTotInc"),
      "TaxAtNormalRates":   g(j,C+"TaxPayableOnTI.TaxAtNormalRatesTotal", g(j,C+"TaxPayableOnTI.TaxAtNormalRates")),
      "Tax115BBC":          g(j,C+"TaxPayableOnTI.TaxAnonymousDonation", g(j,C+"TaxPayableOnTI.DonationsTax")),
      "Tax115BBI":          g(j,C+"TaxPayableOnTI.TaxIncChargUs115BBI"),
      "TaxAtMMR":           g(j,C+"TaxPayableOnTI.TaxAtMMROrSplRate", g(j,C+"TaxPayableOnTI.TaxMaxMarginalRate")),
      "Surcharge":          g(j,C+"TotalSurcharge"),
      "EduCess":            g(j,C+"EducationCess"),
      "GrossTaxLiab":       g(j,C+"GrossTaxLiability"),
      "NetTaxLiab":         g(j,C+"NetTaxLiability"),
      "Net115TD":           g(j,"PartB_TTI.Refund.NetTaxPyblOn115TDInc"),
    }
    print("TTI ladder :", json.dumps({k:v for k,v in ladder.items() if v not in (None,)}))
    # regime-specific income fields
    if "PartB_TI3" in j:
        cc=g(j,"PartB_TI3.ComputationIncChargeable",{})
        print("  B3 ComputationIncChargeable: TotIncPrevYr=",g(cc,"TotIncPrevYr"),
              "SumTotal=",g(cc,"SumTotal"),"TotalInc=",g(cc,"TotalInc"),
              "IncChagrgSec13(MMR)=",g(cc,"IncChagrgSec13"),
              "IncNotForming.Total=",g(cc,"IncNotForming.Total"))
        print("  PartB_TTI GrossTotalIncome:", g(j,"PartB_TI3.ComputationIncChargeable.TotalInc"))
    if "PartB_TI2" in j:
        p2=j["PartB_TI2"]
        print("  B2 keys:", list(p2.keys())[:20])
        print("  B2 AggregateIncome/normalRate:", g(p2,"AggregateIncome"),
              "TotExemption10_23Cto10_47:", g(p2,"TotExemptionUs10_23Cto10_47"),
              "ExemptionUs13_B:", g(p2,"ExemptionUs13_B"),
              "IncChrgbleMaxMarginalRates:", g(p2,"IncChrgbleMaxMarginalRates"))
    if "Schedule115BBI" in j:
        print("  Schedule115BBI:", json.dumps(j["Schedule115BBI"])[:200])
        print("  PartB_TI IncChargUs115BBIIncld13:", g(j,"PartB_TI.IncChargUs115BBIIncld13"))
    if "Schedule115TD" in j:
        print("  Schedule115TD:", json.dumps(j["Schedule115TD"])[:400])

def main():
    for vid,label in VARIANTS:
        try: digest(vid,label)
        except Exception as e:
            print(f"\n[{vid}] ERROR:", e)
if __name__=="__main__": main()
