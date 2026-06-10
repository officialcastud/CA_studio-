"""
Audit-log envelope (Rule 3 / immutable-trail requirement).

Every mutating tool call is wrapped so it records: who (actor), what (tool + args),
when (timestamp), and outcome (result/error). Append-only JSONL. No hard deletes
anywhere in the system -- deletions are soft (archive + tombstone) and are themselves
logged events.

In production, point AUDIT_SINK at your Postgres append-only table instead of a file.
The contract (one JSON object per event) stays identical.
"""

from __future__ import annotations

import json
import functools
import threading
import datetime as _dt
from pathlib import Path
from typing import Any, Callable

# --- actor context -----------------------------------------------------------
# The agent sets this to "AI"; a CA action sets it to the CA's member id.
_ctx = threading.local()


def set_actor(actor: str) -> None:
    _ctx.actor = actor


def get_actor() -> str:
    return getattr(_ctx, "actor", "unknown")


# --- sink --------------------------------------------------------------------
_DEFAULT_LOG = Path.home() / "ca_agent_audit.jsonl"


def _now() -> str:
    return _dt.datetime.now(_dt.timezone.utc).isoformat()


def log_event(event: dict, sink: Path | None = None) -> None:
    """Append one event. Never overwrites. Swap this body for a DB insert in prod."""
    sink = sink or _DEFAULT_LOG
    event = {"ts": _now(), "actor": get_actor(), **event}
    with open(sink, "a", encoding="utf-8") as fh:
        fh.write(json.dumps(event, default=str) + "\n")


def _safe_args(args: tuple, kwargs: dict) -> dict:
    """Record args but truncate large blobs so the log stays readable."""
    def trim(v: Any) -> Any:
        s = repr(v)
        return s if len(s) <= 300 else s[:300] + f"...<{len(s)} chars>"
    return {"args": [trim(a) for a in args], "kwargs": {k: trim(v) for k, v in kwargs.items()}}


def audited(tool: str, mutating: bool = True) -> Callable:
    """Decorator: log every invocation of a tool. `mutating=False` for read-only tools."""
    def deco(fn: Callable) -> Callable:
        @functools.wraps(fn)
        def wrap(*args, **kwargs):
            base = {"tool": tool, "mutating": mutating, **_safe_args(args, kwargs)}
            try:
                result = fn(*args, **kwargs)
                log_event({**base, "status": "ok"})
                return result
            except Exception as e:  # noqa: BLE001 -- we log then re-raise
                log_event({**base, "status": "error", "error": f"{type(e).__name__}: {e}"})
                raise
        return wrap
    return deco
