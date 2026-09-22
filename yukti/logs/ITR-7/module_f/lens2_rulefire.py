#!/usr/bin/env python3
"""LENS 2 — rule-firing probe. Boot the built ITR-7, inject the lawful golden
state, build the return, and for each targeted rule apply ONE violating
mutation to a deep clone of the built return, run runRules on the clone, and
record which Category-A serials fire. A rule passes LENS 2 when it is SILENT on
the lawful return (baseline) and FIRES on its targeted violation. Any rule that
does not fire on its violation is a dead/vacuous suspect; any collateral serial
that fires only because the mutation perturbed a shared input is noted.
"""
import json, pathlib
from playwright.sync_api import sync_playwright

HTML = "file://" + str(pathlib.Path("forms/ITR-7/Yukti_ITR7.html").resolve())
STATE = open("tests/ITR-7/state.js", encoding="utf-8").read()

# each test: (serial_expected, human_label, js_mutation_body over clone `c`)
TESTS = [
 (99,  "BS Total Fund A1g != sum",        "c.PARTA_BS.SourcesOfFund.OwnFund.TotalFund+=100"),
 (100, "BS Total Loan Funds A2c != sum",  "c.PARTA_BS.SourcesOfFund.LongTermBorrowings.TotalLoanFund+=100"),
 (98,  "BS Total other reserve != sum",   "c.PARTA_BS.SourcesOfFund.OwnFund.TotalOtherReserve=5"),
 (94,  "Sch J A1(7) closing != recon",    "c.ITRScheduleJ.ScheduleJ_A1.ScheduleJ_A1Dtls[0].ClosingBlc+=100"),
 (146, "Sch A D total != A12-B-C..",      "c.ScheduleA.TotAmtAppDrngPrevYr.Total+=100"),
 (147, "Sch A G allowed != D-E+F",        "c.ScheduleA.TotAmountAllowedApplication.Total+=100"),
 (143, "Sch A A12 total != sum",          "c.ScheduleA.AppTowExpTrstInst.TotalA1toA11.Total+=100"),
 (158, "VC Total C != Aiii+Biii",         "c.ScheduleVC.TotalContribution+=100"),
 (155, "VC A(iie) total != Aiia..Aiid",   "c.ScheduleVC.Local.TotalOtherThanCorpusFund+=100"),
 (165, "VC domestic corpus Ai != Aia+Aib","c.ScheduleVC.Local.CorpusFundDonation+=100"),
 (141, "Sch AI point10 total != sum",     "c.ScheduleAI.TotalofAggregateIncomes+=100"),
 (481, "PBTI 6vii total != sum",          "c.PartB_TI.TIDeductions.TotalDeductions+=100"),
 (491, "PBTI 10v total != sum",           "c.PartB_TI.TotIncNotPart7And11Abv=5"),
 (493, "PBTI 13 TI != 11-12",             "c.PartB_TI.TotalIncome+=100"),
 (494, "PBTI 15 115BBC != VC Diii",       "c.PartB_TI.DonationsUs115BBC+=100"),
 (476, "PBTI 6i applied != Sch A G",      "c.PartB_TI.TIDeductions.AmtAppliedtForCharitablePurpose+=100"),
 (115, "Sch R closing C(col2) != OWN",    "c.ITRScheduleR.ClosngBalBalSheet.OthCorpReceived+=100"),
 (3,   "PI status5 => substatus in set",  "c.PartA_GEN1.OrgFirmInfo.SubStatus='7i'"),
 (2,   "PI India mobile must be 10 dig",  "c.PartA_GEN1.OrgFirmInfo.Address.MobileNo=12345"),
 (5,   "PI regdate >= date of formation", "c.PartA_GEN1.RegApprUnderITADtls[0].RegApprovalDate='2000-01-01'"),
 (7,   "s.11 claimed => 12A furnished",   "c.PartA_GEN1.RegApprUnderITADtls=c.PartA_GEN1.RegApprUnderITADtls.filter(r=>r.SectionRegistered!=='VI')"),
 (6,   "12A in table => exsec is 11",     "c.PartA_GEN1.OrgFirmInfo.SecExemptionClaimed='23CIV'"),
 (93,  "Sch J only if s.11/10(23C)",      "c.PartA_GEN1.OrgFirmInfo.SecExemptionClaimed='13A'"),
 (152, "Sch A only if s.11/10(23C)",      "c.PartA_GEN1.OrgFirmInfo.SecExemptionClaimed='13A'"),
 (119, "Sch R only if s.11/10(23C)",      "c.PartA_GEN1.OrgFirmInfo.SecExemptionClaimed='13A'"),
 (473, "PBTI exemption => reg recorded",  "c.PartA_GEN1.RegApprUnderITADtls=[]"),
 (140, "Sch AI point9 other total != sum","c.ScheduleAI.TotalofOtherIncomes=7"),
 (167, "VC Dii = higher(5% , 1,00,000)",  "c.ScheduleVC.AnonymousDonations.TotalDonationsReceived+=100"),
 (166, "VC foreign corpus Bi != Bia+Bib", "c.ScheduleVC.Foreign=Object.assign({CorpusFundDonation:0,CorpusFundDonationUS80G2b:0,CorpusFundDonationOther80G2b:0,ForeignContribution:0,OtherThanCorpusFund:0},c.ScheduleVC.Foreign||{});c.ScheduleVC.Foreign.CorpusFundDonation=100"),
 (109, "BS total application = sources",  "c.PARTA_BS.ApplicationOfFunds.TotalApplicationOfFunds+=100"),
]

def main():
    with sync_playwright() as p:
        b = p.chromium.launch(); pg = b.new_page(viewport={"width":1400,"height":1000})
        errs=[]; pg.on("pageerror", lambda e: errs.append(str(e)))
        pg.goto(HTML); pg.wait_for_timeout(700)
        pg.evaluate("()=>{"+STATE+"\nif(typeof paint==='function')paint();}"); pg.wait_for_timeout(1500)
        # baseline
        base = pg.evaluate("()=>{const b=buildReturn();const I=Object.values(b.ITR)[0];window.__I=I;return runRules(I,S).filter(r=>r.cat==='A').map(r=>r.n);}")
        print("BASELINE Category-A fired on lawful golden:", base)
        results=[]
        for n,label,mut in TESTS:
            fired = pg.evaluate("""(args)=>{
               const [mut]=args;
               const c=JSON.parse(JSON.stringify(window.__I));
               try{ eval(mut); }catch(e){ return {err:String(e)}; }
               const r=runRules(c,S).filter(x=>x.cat==='A').map(x=>x.n);
               return {fired:r};
            }""", [mut])
            if isinstance(fired,dict) and fired.get("err"):
                results.append((n,label,"MUT-ERR",fired["err"],[])); continue
            f=fired["fired"]
            hit = n in f
            collateral=[x for x in f if x!=n]
            results.append((n,label,"FIRES" if hit else "*** DID NOT FIRE ***", "", collateral))
        b.close()
    print("\n%-6s %-34s %-20s %s"%("serial","targeted violation","result","collateral A-serials"))
    print("-"*100)
    deadish=[]
    for n,label,res,err,collat in results:
        print("A%-5s %-34s %-20s %s%s"%(n,label[:34],res,(collat if collat else ""),(" ERR:"+err if err else "")))
        if "DID NOT" in res: deadish.append(n)
    print("\nSUSPECT (did not fire on targeted violation):", deadish or "none")
    print("Baseline lawful fired:", base or "none (clean)")

if __name__=="__main__": main()
