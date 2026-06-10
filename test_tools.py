"""End-to-end test: exercise every tool the way the agent would via dispatch()."""
import json
from pathlib import Path
from tools import filesystem as fs
from tools.audit_log import set_actor
from tools.registry import dispatch, TOOL_SCHEMAS

# point the workspace at a temp dir for the test
fs.WORKSPACE_ROOT = Path.home() / "ca_workspace_test"
import shutil; shutil.rmtree(fs.WORKSPACE_ROOT, ignore_errors=True)
set_actor("AI")

print("=== 1. provision entity folder ===")
print(dispatch("provision_entity_folder", {"client_id": "c1", "entity_id": "acme_pvt_ltd", "fy": "FY24-25"})["subfolders"][0:2], "...")

print("\n=== 2. generate a trial-balance Excel ===")
tb_spec = {"sheets": [{
    "name": "Trial Balance",
    "rows": [["Account", "Debit", "Credit"],
             ["Cash", 500000, 0],
             ["Sales", 0, 1400000],
             ["Purchases", 900000, 0]],
    "bold_rows": [0], "number_format_cols": {1: "#,##,##0.00", 2: "#,##,##0.00"}}]}
xl_path = "clients/c1/acme_pvt_ltd/FY24-25/books/trial_balance.xlsx"
print("written:", dispatch("generate_excel", {"path": xl_path, "spec": tb_spec}))

print("\n=== 3. read it back (values + formulas) ===")
back = dispatch("read_excel", {"path": xl_path})
print("sheet:", back["sheets"][0]["name"], "| rows:", back["sheets"][0]["rows"])

print("\n=== 4. run_python with Decimal (no float) ===")
code = '''
debit = D("500000") + D("900000")
credit = D("1400000")
RESULT["total_debit"] = debit
RESULT["total_credit"] = credit
RESULT["balanced"] = debit == credit
print(f"Dr={debit} Cr={credit} balanced={debit==credit}")
'''
r = dispatch("run_python", {"code": code})
print("stdout:", r["stdout"].strip(), "| result:", r["result"])

print("\n=== 5. validate_double_entry (locked) ===")
print(dispatch("validate_double_entry", {"entries": [
    {"account": "Cash", "debit": "500000", "credit": "0"},
    {"account": "Sales", "debit": "0", "credit": "500000"}]}))
print(dispatch("validate_double_entry", {"entries": [
    {"account": "Cash", "debit": "500000", "credit": "0"},
    {"account": "Sales", "debit": "0", "credit": "499999"}]}))

print("\n=== 6. generate a Word note + read back ===")
doc_spec = {"title": "Notes to Accounts", "blocks": [
    {"type": "heading", "text": "1. Significant Accounting Policies", "level": 1},
    {"type": "para", "text": "Financial statements prepared under the accrual basis per AS."},
    {"type": "table", "header": True, "rows": [["Particulars", "FY24-25", "FY23-24"],
                                               ["Revenue", "14,00,000.00", "11,00,000.00"]]}]}
dw_path = "clients/c1/acme_pvt_ltd/FY24-25/statements/notes.docx"
print("written:", dispatch("generate_word", {"path": dw_path, "spec": doc_spec}))
wb = dispatch("read_word", {"path": dw_path})
print("paragraphs:", wb["sections"], "| table[0]:", wb["tables"][0])

print("\n=== 7. Indian number formatting ===")
from tools.doc_write import format_indian_number
print("12345678.5 ->", format_indian_number(12345678.5))

print("\n=== 8. workspace escape blocked ===")
try:
    dispatch("read_file", {"path": "../../../etc/passwd"})
except Exception as e:
    print("blocked:", type(e).__name__, "-", e)

print("\n=== schemas exposed to LiteLLM:", len(TOOL_SCHEMAS), "tools ===")
print([t["function"]["name"] for t in TOOL_SCHEMAS])
