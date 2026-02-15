#!/bin/bash
# update-research-cron.sh — Cron wrapper for Claude Code headless research updates
#
# Usage:
#   bash utils/update-research-cron.sh          # Normal run (respects 24h cooldown)
#   bash utils/update-research-cron.sh --force  # Skip cooldown check

set -euo pipefail

# --- Configuration ---
REPO_DIR="/home/pouria/projects/pouriarouzrokh.com"
LAST_RUN_FILE="$HOME/.scholarly-update-last-run"
LOG_DIR="$HOME/logs/research-update"
COOLDOWN_SECONDS=86400  # 24 hours

# --- Setup ---
mkdir -p "$LOG_DIR"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
LOG_FILE="$LOG_DIR/update_${TIMESTAMP}.log"

log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S UTC')] $*" | tee -a "$LOG_FILE"
}

# --- Cooldown check ---
FORCE=false
if [[ "${1:-}" == "--force" ]]; then
    FORCE=true
fi

if [[ "$FORCE" == "false" && -f "$LAST_RUN_FILE" ]]; then
    LAST_RUN=$(cat "$LAST_RUN_FILE")
    NOW=$(date +%s)
    ELAPSED=$((NOW - LAST_RUN))
    if [[ $ELAPSED -lt $COOLDOWN_SECONDS ]]; then
        REMAINING=$(( (COOLDOWN_SECONDS - ELAPSED) / 3600 ))
        log "Skipping: last run was ${ELAPSED}s ago (${REMAINING}h remaining in cooldown)"
        exit 0
    fi
fi

# --- Run Claude Code headless ---
log "===== Research update started ====="
log "Repo: $REPO_DIR"
log "Force mode: $FORCE"

cd "$REPO_DIR"

# Source environment for API key (cron doesn't load profile)
if [[ -f "$HOME/.bashrc" ]]; then
    source "$HOME/.bashrc" 2>/dev/null || true
fi
if [[ -f "$HOME/.profile" ]]; then
    source "$HOME/.profile" 2>/dev/null || true
fi

# Verify API key is available
if [[ -z "${ANTHROPIC_API_KEY:-}" ]]; then
    log "ERROR: ANTHROPIC_API_KEY is not set. Add it to ~/.bashrc or ~/.profile."
    exit 1
fi

# Pull latest changes before running
log "Pulling latest changes..."
git pull --rebase >> "$LOG_FILE" 2>&1 || {
    log "WARNING: git pull failed, continuing with current state"
}

# Run Claude Code headless
log "Running Claude Code headless..."
if claude -p "$(cat utils/update-research-prompt.md)" \
    --model claude-opus-4-6 \
    --dangerously-skip-permissions >> "$LOG_FILE" 2>&1; then

    log "===== Research update completed successfully ====="
    # Update last-run timestamp only on success
    date +%s > "$LAST_RUN_FILE"
else
    EXIT_CODE=$?
    log "===== Research update FAILED (exit code: $EXIT_CODE) ====="
    exit $EXIT_CODE
fi

# Symlink latest log for easy access
ln -sf "$LOG_FILE" "$LOG_DIR/latest.log"
