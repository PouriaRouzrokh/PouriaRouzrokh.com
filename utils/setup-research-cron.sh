#!/bin/bash
# setup-research-cron.sh — Install (or re-sync) the crontab entry for research updates.
#
# Reads the schedule from utils/research-update.config.json. Re-running after
# changing the config will update the crontab to match. Safe to run repeatedly.
#
# Usage: bash utils/setup-research-cron.sh

set -euo pipefail

REPO_DIR="/home/pouria/projects/pouriarouzrokh.com"
CONFIG_FILE="$REPO_DIR/utils/research-update.config.json"
CRON_SCRIPT="$REPO_DIR/utils/update-research-cron.sh"
LOG_DIR="$REPO_DIR/logs"
CRON_LOG="$LOG_DIR/cron.log"

echo "=== Research Update Cron Setup ==="
echo ""

# --- Check prerequisites ---
echo "Checking prerequisites..."

if command -v jq &>/dev/null; then
    echo "  [OK] jq found: $(jq --version)"
else
    echo "  [FAIL] jq not found. Install with: sudo apt-get install jq"
    exit 1
fi

if command -v claude &>/dev/null; then
    echo "  [OK] Claude CLI found: $(claude --version 2>/dev/null || echo unknown)"
else
    echo "  [FAIL] Claude CLI not found. Install it first."
    exit 1
fi

if [[ -d "$REPO_DIR" ]]; then
    echo "  [OK] Repo directory exists: $REPO_DIR"
else
    echo "  [FAIL] Repo directory not found: $REPO_DIR"
    exit 1
fi

if [[ -f "$CONFIG_FILE" ]]; then
    echo "  [OK] Config exists: $CONFIG_FILE"
else
    echo "  [FAIL] Config not found: $CONFIG_FILE"
    exit 1
fi

if [[ -f "$REPO_DIR/utils/update-research-prompt.md" ]]; then
    echo "  [OK] Prompt file exists"
else
    echo "  [FAIL] Prompt file not found: $REPO_DIR/utils/update-research-prompt.md"
    exit 1
fi

if [[ -f "$CRON_SCRIPT" ]]; then
    echo "  [OK] Cron script exists"
else
    echo "  [FAIL] Cron script not found: $CRON_SCRIPT"
    exit 1
fi

if git -C "$REPO_DIR" remote -v | grep -q "git@"; then
    echo "  [OK] Git remote uses SSH"
elif git -C "$REPO_DIR" remote -v | grep -q "https://"; then
    echo "  [WARN] Git remote uses HTTPS — push may require credentials"
fi

echo ""

# --- Parse schedule from config ---
SCHEDULE=$(jq -r '.schedule' "$CONFIG_FILE")
if [[ -z "$SCHEDULE" || "$SCHEDULE" == "null" ]]; then
    echo "[FAIL] No 'schedule' field in $CONFIG_FILE"
    exit 1
fi

# Basic sanity check on cron expression (5 fields)
FIELDS=$(echo "$SCHEDULE" | awk '{print NF}')
if [[ "$FIELDS" -ne 5 ]]; then
    echo "[FAIL] Invalid cron schedule (expected 5 fields): '$SCHEDULE'"
    exit 1
fi

echo "Configuration summary:"
echo "  Schedule:     $SCHEDULE"
echo "  Model:        $(jq -r '.model' "$CONFIG_FILE")"
echo "  Cooldown:     $(jq -r '.cooldown_seconds' "$CONFIG_FILE")s"
echo "  Max runtime:  $(jq -r '.max_runtime_seconds' "$CONFIG_FILE")s"
echo "  Max retries:  $(jq -r '.max_retries' "$CONFIG_FILE")"
echo "  Log retention (success/failure): $(jq -r '.log_retention_days' "$CONFIG_FILE")d / $(jq -r '.failure_log_retention_days' "$CONFIG_FILE")d"
echo ""

mkdir -p "$LOG_DIR"

# --- Install/refresh crontab ---
CRON_CMD="$SCHEDULE bash $CRON_SCRIPT >> $CRON_LOG 2>&1"

echo "Updating crontab..."

# Remove any prior entry referencing update-research-cron.sh, then add the new one.
EXISTING=$(crontab -l 2>/dev/null || true)
NEW_CRON=$(echo "$EXISTING" | grep -vF "update-research-cron.sh" || true)
NEW_CRON=$(printf "%s\n%s\n" "$NEW_CRON" "$CRON_CMD" | grep -v '^$' || true)
echo "$NEW_CRON" | crontab -

echo "  [OK] Crontab synced"
echo ""

echo "Current crontab entry:"
crontab -l 2>/dev/null | grep "update-research" || echo "  (none — something went wrong)"
echo ""

echo "=== Setup Complete ==="
echo ""
echo "Useful commands:"
echo "  Status:       cat $LOG_DIR/STATUS.md"
echo "  History:      tail -n 20 $LOG_DIR/history.jsonl | jq ."
echo "  Latest log:   cat $LOG_DIR/latest/update.log"
echo "  Cron log:     tail -n 50 $CRON_LOG"
echo "  Force run:    bash $CRON_SCRIPT --force"
echo "  Dry run:      bash $CRON_SCRIPT --dry-run"
echo "  Edit config:  \$EDITOR $CONFIG_FILE && bash $0   # to re-sync crontab"
