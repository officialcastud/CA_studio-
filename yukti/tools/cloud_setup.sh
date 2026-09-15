#!/usr/bin/env bash
# Paste this into the cloud environment's "Setup script" box (claude.ai/code → environment selector → settings).
# It runs before Claude Code starts and is cached, so it does not re-run every session.
set -e
pip install -q jsonschema playwright pymupdf pyyaml
python -m playwright install --with-deps chromium
node --version && python --version
echo "yukti cloud environment ready"
