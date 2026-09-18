#!/usr/bin/env python3
"""Assemble forms/ITR-N/Yukti_ITRN.html from the shell and the form's parts.
usage: python tools/assemble.py --form ITR-3
form parts, concatenated in order: forms/ITR-N/src/00_form.js (FORM, tables), 10_state.js, 20_engine_*.js, 30_sections_*.js, 40_export.js, 50_import.js, 60_rules.js
"""
import argparse, glob, os
def main():
    ap=argparse.ArgumentParser();ap.add_argument("--form",required=True);a=ap.parse_args()
    d=f"forms/{a.form}";parts=sorted(glob.glob(f"{d}/src/*.js"))
    if not parts:raise SystemExit(f"no parts in {d}/src")
    head=open("shell/head.html",encoding="utf-8").read();css=open("shell/shell.css",encoding="utf-8").read();body=open("shell/body.html",encoding="utf-8").read();shell=open("shell/shell.js",encoding="utf-8").read()
    js="\n".join(open(p,encoding="utf-8").read() for p in parts)
    out=f"{d}/Yukti_{a.form.replace('-','')}.html"
    open(out,"w",encoding="utf-8").write(head+"<style>"+css+"</style></head><body>"+body+"<script>\n"+js+"\n"+shell+"\n</script></body></html>")
    print("wrote",out,"from",len(parts),"parts")
if __name__=="__main__":main()
