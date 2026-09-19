#!/usr/bin/env python3
"""Phase 0 — unzip the government utility and write the sheet map.
usage: python tools/extract_utility.py --form ITR-3
reads  sources/ITR-3/*.xlsm   writes sources/ITR-3/utility/  and  books/ITR-3/sheet_map.json
"""
import argparse, json, os, re, sys, zipfile, glob
import xml.etree.ElementTree as ET
NS="{http://schemas.openxmlformats.org/spreadsheetml/2006/main}"
RNS="{http://schemas.openxmlformats.org/officeDocument/2006/relationships}"
def main():
    ap=argparse.ArgumentParser();ap.add_argument("--form",required=True);a=ap.parse_args()
    src=f"sources/{a.form}";out=f"{src}/utility";os.makedirs(out,exist_ok=True);os.makedirs(f"books/{a.form}",exist_ok=True)
    xl=glob.glob(f"{src}/*.xlsm")+glob.glob(f"{src}/*.xlsx")
    if not xl:sys.exit(f"no .xlsm in {src}")
    with zipfile.ZipFile(xl[0]) as z:z.extractall(out)
    wb=ET.parse(f"{out}/xl/workbook.xml").getroot()
    rels={r.get("Id"):r.get("Target") for r in ET.parse(f"{out}/xl/_rels/workbook.xml.rels").getroot()}
    sheets=[]
    for sh in wb.find(f"{NS}sheets"):
        tgt=rels[sh.get(f"{RNS}id")].split("/")[-1];p=f"{out}/xl/worksheets/{tgt}"
        rows=0;hidden_rows=0
        if os.path.exists(p):
            data=open(p,"rb").read();rows=len(re.findall(rb"<row ",data));hidden_rows=len(re.findall(rb'<row [^>]*hidden="1"',data))
        sheets.append({"name":sh.get("name"),"file":tgt,"state":sh.get("state") or "visible","rows":rows,"hidden_rows":hidden_rows})
    # named ranges — how sheets refer to each other
    names={}
    for m in re.finditer(r'<definedName name="([^"]+)"[^>]*>([^<]*)</definedName>',open(f"{out}/xl/workbook.xml",encoding="utf-8").read()):names[m.group(1)]=m.group(2)
    # VBA as searchable text
    vba=f"{out}/xl/vbaProject.bin"
    if os.path.exists(vba):
        t=re.sub(r"[^\x20-\x7e\n]"," ",open(vba,"rb").read().decode("latin1"));open(f"{src}/vba_text.txt","w").write(re.sub(r"[ \t]{2,}"," ",t))
    json.dump({"form":a.form,"utility":os.path.basename(xl[0]),"sheets":sheets,"named_ranges":names},open(f"books/{a.form}/sheet_map.json","w"),indent=1)
    vis=[s for s in sheets if s["state"]=="visible"];hid=[s for s in sheets if s["state"]!="visible"]
    print(f"{a.form}: {len(sheets)} sheets — {len(vis)} visible, {len(hid)} hidden; {len(names)} named ranges")
    for s in sheets:print(f"  {s['state']:8s} {s['name']:34s} {s['file']:12s} rows {s['rows']:>5} hidden {s['hidden_rows']:>4}")
if __name__=="__main__":main()
