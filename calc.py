"""
The calculator. ALL arithmetic the agent shows the user must come from here, not
from the model's prose. Money uses Decimal (28-digit), never float.

`run_python` executes agent-written code in a restricted namespace, captures stdout,
enforces a timeout, and returns a structured result the whiteboard can render. It also
returns any values the code places into a dict named `RESULT`, so the agent gets
machine-readable outputs, not just printed text.

SECURITY NOTE: this is a *pragmatic* restriction (no builtins like open/import by
default, no network), NOT a hardened sandbox. In production run this inside your
container/isolate boundary (the ZeroClaw-style execution boundary), not in-process.
"""

from __future__ import annotations

import io
import signal
import contextlib
from decimal import Decimal, getcontext, ROUND_HALF_UP

from .audit_log import audited

getcontext().prec = 28


class _Timeout(Exception):
    pass


def _alarm(signum, frame):  # noqa: ARG001
    raise _Timeout("Execution exceeded time limit.")


# A deliberately small, safe-ish builtin set. Extend consciously.
_SAFE_BUILTINS = {
    "abs": abs, "min": min, "max": max, "sum": sum, "round": round,
    "len": len, "range": range, "enumerate": enumerate, "zip": zip,
    "sorted": sorted, "list": list, "dict": dict, "tuple": tuple, "set": set,
    "float": float, "int": int, "str": str, "bool": bool, "print": print,
}


@audited("run_python")
def run_python(code: str, timeout_s: int = 10) -> dict:
    """Execute `code` with Decimal available. Returns stdout, RESULT dict, and status.

    The code can:
      - use Decimal / D(...) for money math
      - print() intermediate steps (captured for the whiteboard)
      - assign to a dict named RESULT to return structured values
    """
    ns = {
        "__builtins__": _SAFE_BUILTINS,
        "Decimal": Decimal,
        "D": lambda x: Decimal(str(x)),          # convenience: D("1234.50")
        "ROUND_HALF_UP": ROUND_HALF_UP,
        "RESULT": {},
    }
    buf = io.StringIO()
    old = signal.signal(signal.SIGALRM, _alarm)
    signal.alarm(timeout_s)
    try:
        with contextlib.redirect_stdout(buf):
            exec(code, ns)  # noqa: S102 -- restricted ns; isolate in prod
        return {"status": "ok", "stdout": buf.getvalue(),
                "result": {k: str(v) for k, v in ns.get("RESULT", {}).items()}}
    except _Timeout as e:
        return {"status": "timeout", "stdout": buf.getvalue(), "error": str(e)}
    except Exception as e:  # noqa: BLE001
        return {"status": "error", "stdout": buf.getvalue(),
                "error": f"{type(e).__name__}: {e}"}
    finally:
        signal.alarm(0)
        signal.signal(signal.SIGALRM, old)


# --- locked domain helper: double-entry validation (cannot be bypassed) -------
@audited("validate_double_entry", mutating=False)
def validate_double_entry(entries: list[dict]) -> dict:
    """entries: [{"account": str, "debit": "0.00", "credit": "0.00"}, ...]
    Returns balanced flag + totals. HARD requirement before any journal post."""
    dr = sum(Decimal(str(e.get("debit", 0))) for e in entries)
    cr = sum(Decimal(str(e.get("credit", 0))) for e in entries)
    balanced = dr == cr
    return {"balanced": balanced, "total_debit": str(dr), "total_credit": str(cr),
            "difference": str(dr - cr)}
