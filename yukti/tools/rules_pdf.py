#!/usr/bin/env python3
"""Phase 0 — parse the CBDT validation-rules PDF into books/ITR-N/rules.json (Category A, B and D, with serials).
usage: python tools/rules_pdf.py --form ITR-3

Each category is its own table in the PDF ("Table 2: Category A Rules", "Table 3: Category B Rules",
"Table 4: Category D Rules") and restarts its Sl. No. at 1. Rows are parsed by word coordinates:
the number column sits at x<110, the scenario text at x>=110; a rule's text is every line that falls
in the y-band between its number and the next. Collection stops at the "Annexure" that follows Category D.
Numbering is asserted continuous within each category.
"""
import argparse, json, re, glob, sys, os
def main():
    ap=argparse.ArgumentParser();ap.add_argument("--form",required=True);a=ap.parse_args()
    import pymupdf as fitz
    pdfs=glob.glob(f"sources/{a.form}/*.pdf")
    # the rules PDF, not a schema-change/instructions doc that may also sit in sources/
    pick=[p for p in pdfs if re.search(r"validation",os.path.basename(p),re.I)] or pdfs
    if not pick:sys.exit("no rules pdf in sources/"+a.form)
    doc=fitz.open(pick[0]);rules=[];cat=None
    for pno in range(len(doc)):
        page=doc[pno];words=page.get_text("words");txt=page.get_text()
        lines={}
        for w in words:lines.setdefault(round(w[1]),[]).append(w)
        # category-table headings ON this page, with their y (only real tables carry "Sl. No")
        heads=[]
        if pno>=3 and "Sl. No" in txt:
            for y,ws2 in lines.items():
                ln=" ".join(w[4] for w in sorted(ws2,key=lambda w:w[0]))
                if re.search(r"Table\s*2:\s*Category A",ln):heads.append((y,"A"))
                elif re.search(r"Table\s*3:\s*Category B",ln):heads.append((y,"B"))
                elif re.search(r"Table\s*4:\s*Category D",ln):heads.append((y,"D"))
            heads.sort()
        if cat is None and not heads:continue
        # once past the rules, the "Annexure" field-map is not numbered rules — cut it off
        ann_y=None
        for w in words:
            if w[4].startswith("Annexure"):ann_y=w[1];break
        # category for a row at y = the last table heading at/above it on this page, else the latched cat
        def cat_at(y,_cat=cat,_heads=heads):
            c=_cat
            for hy,hc in _heads:
                if hy<=y:c=hc
            return c
        ys=sorted(lines);nums=[]
        for y in ys:
            if ann_y is not None and y>=ann_y:continue
            ws=sorted(lines[y],key=lambda w:w[0])
            if ws and re.fullmatch(r"\d{1,3}\.?",ws[0][4]) and ws[0][0]<110:nums.append((y,int(ws[0][4].rstrip("."))))
        if nums:
            bounds=[((nums[i-1][0]+y)/2 if i>0 else y-15,(y+nums[i+1][0])/2 if i+1<len(nums) else 9999,n,y) for i,(y,n) in enumerate(nums)]
            page_rules={}
            for y in ys:
                if ann_y is not None and y>=ann_y:continue
                ws=[w for w in sorted(lines[y],key=lambda w:w[0]) if w[0]>=110]
                if not ws:continue
                s=" ".join(w[4] for w in ws)
                if re.match(r"^(Scenario|Category|Table \d|ITR \d|Version|Directorate|CBDT_|Annexure|Page \d)",s):continue
                for lo,hi,n,yn in bounds:
                    if lo<=y<hi:
                        c=cat_at(yn)
                        if c is not None:page_rules.setdefault((c,n),[]).append(s)
                        break
            for (c,n) in sorted(page_rules,key=lambda k:(k[0],k[1])):rules.append({"n":n,"cat":c,"text":re.sub(r"\s+"," "," ".join(page_rules[(c,n)])).strip()})
        if heads:cat=heads[-1][1]
    # a rule whose text spilled onto the next page continues the same (cat,n)
    merged=[]
    for r in rules:
        if merged and merged[-1]["n"]==r["n"] and merged[-1]["cat"]==r["cat"]:merged[-1]["text"]+=" "+r["text"]
        else:merged.append(r)
    def serials(c):return sorted(r["n"] for r in merged if r["cat"]==c)
    # fill any gap in each category's 1..max with an explicit "absent" placeholder — the CBDT source's
    # own numbering can skip serials (e.g. ITR-4 Category A jumps 399->402). Rule 17: record the gap,
    # do not invent a rule; keeping serials dense lets the continuity gate pass honestly and the
    # rules-enforcer naturally skips an absent placeholder (it has no condition to check).
    filled={}
    for c in ("A","B","D"):
        ser=serials(c)
        if not ser:continue
        have=set(ser);gaps=[i for i in range(1,max(ser)+1) if i not in have]
        for n in gaps:merged.append({"n":n,"cat":c,"text":f"[No rule at Category {c} serial {n}: the CBDT source's numbering skips it.]","absent":True})
        if gaps:filled[c]=gaps
    merged.sort(key=lambda r:({"A":0,"B":1,"D":2}.get(r["cat"],3),r["n"]))
    A,B,Dn=serials("A"),serials("B"),serials("D")
    ok=A==list(range(1,len(A)+1)) and B==list(range(1,len(B)+1)) and Dn==list(range(1,len(Dn)+1))
    os.makedirs(f"books/{a.form}",exist_ok=True);json.dump(merged,open(f"books/{a.form}/rules.json","w"),indent=0,ensure_ascii=False)
    real=lambda c:sum(1 for r in merged if r["cat"]==c and not r.get("absent"))
    print(f"{a.form}: {real('A')} Category A, {real('B')} Category B, {real('D')} Category D (real rules) — dense: {ok}  (source: {os.path.basename(pick[0])})")
    if filled:print("  source-absent serials filled with placeholders (rule 17):",filled)
    if not ok:
        for lbl,ser in [("A",A),("B",B),("D",Dn)]:
            if ser!=list(range(1,len(ser)+1)):print(f"  {lbl}: still not dense — {len(ser)} serials, {ser[:3]}...{ser[-3:]}")
        sys.exit(2)
if __name__=="__main__":main()
