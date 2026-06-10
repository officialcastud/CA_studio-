"""
Filesystem tools. All paths are confined to a workspace root so the agent can
never read or write outside it. No hard deletes -- `archive_file` soft-deletes
into _archive/ with a tombstone, and the act is logged.

Folder convention provisioned for an entity:
    clients/<client_id>/<entity_id>/<FY>/{books,statements,audit,filings,working_papers,_archive}
"""

from __future__ import annotations

import shutil
import datetime as _dt
from pathlib import Path

from .audit_log import audited, log_event

# Set this once at startup to your data root.
WORKSPACE_ROOT = Path.home() / "ca_workspace"


def _resolve(path: str) -> Path:
    """Resolve a path and guarantee it stays inside WORKSPACE_ROOT."""
    root = WORKSPACE_ROOT.resolve()
    p = (root / path).resolve() if not Path(path).is_absolute() else Path(path).resolve()
    if root not in p.parents and p != root:
        raise PermissionError(f"Path escapes workspace root: {path}")
    return p


@audited("create_folder")
def create_folder(path: str) -> str:
    p = _resolve(path)
    p.mkdir(parents=True, exist_ok=True)
    return str(p)


@audited("provision_entity_folder")
def provision_entity_folder(client_id: str, entity_id: str, fy: str) -> dict:
    """Create the standard entity folder skeleton for a financial year."""
    base = f"clients/{client_id}/{entity_id}/{fy}"
    subs = ["books", "statements", "audit", "filings", "working_papers", "_archive"]
    created = [create_folder(f"{base}/{s}") for s in subs]
    return {"base": str(_resolve(base)), "subfolders": created}


@audited("create_file")
def create_file(path: str, content: str = "") -> str:
    p = _resolve(path)
    if p.exists():
        raise FileExistsError(f"{path} exists -- use write_file to overwrite.")
    p.parent.mkdir(parents=True, exist_ok=True)
    p.write_text(content, encoding="utf-8")
    return str(p)


@audited("write_file")
def write_file(path: str, content: str) -> str:
    """Overwrite a file, snapshotting prior content to _archive first (versioning)."""
    p = _resolve(path)
    if p.exists():
        stamp = _dt.datetime.now().strftime("%Y%m%d_%H%M%S")
        snap = p.parent / "_archive" / f"{p.stem}.{stamp}{p.suffix}"
        snap.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(p, snap)
        log_event({"tool": "write_file", "action": "snapshot_prior", "snapshot": str(snap)})
    p.parent.mkdir(parents=True, exist_ok=True)
    p.write_text(content, encoding="utf-8")
    return str(p)


@audited("read_file", mutating=False)
def read_file(path: str) -> str:
    return _resolve(path).read_text(encoding="utf-8")


@audited("list_directory", mutating=False)
def list_directory(path: str = ".") -> list[str]:
    p = _resolve(path)
    return sorted(str(c.relative_to(WORKSPACE_ROOT.resolve())) for c in p.rglob("*"))


@audited("move_file")
def move_file(src: str, dst: str) -> str:
    s, d = _resolve(src), _resolve(dst)
    d.parent.mkdir(parents=True, exist_ok=True)
    shutil.move(str(s), str(d))
    return str(d)


@audited("archive_file")
def archive_file(path: str, reason: str = "") -> str:
    """Soft-delete: move into the nearest _archive/ with a timestamp + tombstone reason.
    There is deliberately no hard-delete tool."""
    p = _resolve(path)
    stamp = _dt.datetime.now().strftime("%Y%m%d_%H%M%S")
    dest = p.parent / "_archive" / f"{p.stem}.{stamp}{p.suffix}"
    dest.parent.mkdir(parents=True, exist_ok=True)
    shutil.move(str(p), str(dest))
    log_event({"tool": "archive_file", "archived_to": str(dest), "reason": reason})
    return str(dest)
