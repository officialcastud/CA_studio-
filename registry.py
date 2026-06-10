"""
Tool registry. TOOL_SCHEMAS is the list you pass to LiteLLM as `tools=` (OpenAI
function-calling format -- LiteLLM normalizes it across Groq/Llama, Claude, etc.).
`dispatch()` takes the tool name + args the model returns and calls the real function.

Agent loop sketch (LiteLLM):
    resp = litellm.completion(model=..., messages=msgs, tools=TOOL_SCHEMAS)
    for call in resp.choices[0].message.tool_calls:
        out = dispatch(call.function.name, json.loads(call.function.arguments))
        msgs.append({"role": "tool", "tool_call_id": call.id, "content": json.dumps(out)})
    # loop until no more tool_calls
"""

from __future__ import annotations

from . import filesystem as fs
from . import doc_read as dr
from . import doc_write as dw
from . import calc


def _schema(name, desc, props, required):
    return {"type": "function", "function": {
        "name": name, "description": desc,
        "parameters": {"type": "object", "properties": props, "required": required}}}


_STR = {"type": "string"}

TOOL_SCHEMAS = [
    _schema("create_folder", "Create a folder inside the workspace.",
            {"path": {**_STR, "description": "Relative path, e.g. clients/c1/e1/FY24-25/books"}},
            ["path"]),
    _schema("provision_entity_folder",
            "Create the standard entity folder skeleton (books, statements, audit, filings, working_papers, _archive) for a financial year.",
            {"client_id": _STR, "entity_id": _STR, "fy": {**_STR, "description": "e.g. FY24-25"}},
            ["client_id", "entity_id", "fy"]),
    _schema("create_file", "Create a new text file. Fails if it already exists.",
            {"path": _STR, "content": _STR}, ["path"]),
    _schema("write_file", "Overwrite a file; prior content is snapshotted to _archive first.",
            {"path": _STR, "content": _STR}, ["path", "content"]),
    _schema("read_file", "Read a text file.", {"path": _STR}, ["path"]),
    _schema("list_directory", "List everything under a folder (recursive).",
            {"path": _STR}, ["path"]),
    _schema("move_file", "Move or rename a file.", {"src": _STR, "dst": _STR}, ["src", "dst"]),
    _schema("archive_file", "Soft-delete a file into _archive with a reason. No hard delete exists.",
            {"path": _STR, "reason": _STR}, ["path"]),

    _schema("ingest_document",
            "Detect a file's type (xlsx/docx/csv/pdf) and read it into a normalized structure.",
            {"path": _STR}, ["path"]),
    _schema("read_excel", "Read an Excel file: returns rows (computed values) and formula strings per sheet.",
            {"path": _STR, "sheet": {**_STR, "description": "Optional sheet name"}}, ["path"]),
    _schema("read_word", "Read a Word file: returns paragraphs and tables.",
            {"path": _STR}, ["path"]),
    _schema("read_csv", "Read a CSV file into rows.", {"path": _STR}, ["path"]),

    _schema("generate_excel",
            "Create an Excel file from a spec (sheets, rows, number formats, bold rows, formula cells).",
            {"path": _STR, "spec": {"type": "object"}}, ["path", "spec"]),
    _schema("generate_word",
            "Create a Word file from a spec (title + blocks: heading/para/table).",
            {"path": _STR, "spec": {"type": "object"}}, ["path", "spec"]),

    _schema("run_python",
            "Execute Python for calculation. Money uses Decimal/D(). print() steps for the "
            "whiteboard; assign to RESULT dict for structured outputs. This is the ONLY way "
            "to produce numbers shown to the user.",
            {"code": _STR, "timeout_s": {"type": "integer"}}, ["code"]),
    _schema("validate_double_entry",
            "Check that a set of journal entries balances (sum debits == sum credits) before posting.",
            {"entries": {"type": "array", "items": {"type": "object"}}}, ["entries"]),
]

_IMPL = {
    "create_folder": fs.create_folder,
    "provision_entity_folder": fs.provision_entity_folder,
    "create_file": fs.create_file,
    "write_file": fs.write_file,
    "read_file": fs.read_file,
    "list_directory": fs.list_directory,
    "move_file": fs.move_file,
    "archive_file": fs.archive_file,
    "ingest_document": dr.ingest_document,
    "read_excel": dr.read_excel,
    "read_word": dr.read_word,
    "read_csv": dr.read_csv,
    "generate_excel": dw.generate_excel,
    "generate_word": dw.generate_word,
    "run_python": calc.run_python,
    "validate_double_entry": calc.validate_double_entry,
}


def dispatch(name: str, args: dict):
    if name not in _IMPL:
        raise ValueError(f"Unknown tool: {name}")
    return _IMPL[name](**args)
