#!/bin/bash
# update-research-cron.sh — Cron wrapper for Claude Code headless research updates
#
# Usage:
#   bash utils/update-research-cron.sh              # Normal run (respects 22h cooldown)
#   bash utils/update-research-cron.sh --force      # Schedule a run in ~60s (safe from nested sessions)
#   bash utils/update-research-cron.sh --scheduled  # Internal: skip cooldown, run directly

set -euo pipefail

# --- Configuration ---
REPO_DIR="/home/pouria/projects/pouriarouzrokh.com"
SCRIPT_PATH="$REPO_DIR/utils/update-research-cron.sh"
LAST_RUN_FILE="$HOME/.scholarly-update-last-run"
LOG_DIR="$REPO_DIR/logs"
COOLDOWN_SECONDS=79200  # 22 hours — ensures daily 2AM cron always clears cooldown

# --- Parse flags ---
MODE="normal"
if [[ "${1:-}" == "--force" ]]; then
    MODE="force"
elif [[ "${1:-}" == "--scheduled" ]]; then
    MODE="scheduled"
fi

# --- Force mode: schedule via systemd-run and exit ---
if [[ "$MODE" == "force" ]]; then
    UNIT_NAME="research-update-$(date +%s)"
    echo "Scheduling research update in ~60s (unit: $UNIT_NAME)..."
    systemd-run --user --on-active=60s --unit="$UNIT_NAME" \
        bash "$SCRIPT_PATH" --scheduled
    echo "Scheduled. Monitor with: journalctl --user -u $UNIT_NAME -f"
    echo "Or check logs: tail -f $LOG_DIR/latest/update.log  (after it starts)"
    exit 0
fi

# --- Setup ---
mkdir -p "$LOG_DIR"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
JOB_DIR="$LOG_DIR/run_${TIMESTAMP}"
mkdir -p "$JOB_DIR"
LOG_FILE="$JOB_DIR/update.log"

log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S UTC')] $*" | tee -a "$LOG_FILE"
}

# --- Cleanup old runs (>7 days) ---
find "$LOG_DIR" -maxdepth 1 -name "run_*" -type d -mtime +7 -exec rm -rf {} +
find "$LOG_DIR" -maxdepth 1 -name "update_*.log" -mtime +7 -delete

# --- Cooldown check (skipped for --scheduled) ---
if [[ "$MODE" == "normal" ]]; then
    if [[ -f "$LAST_RUN_FILE" ]]; then
        LAST_RUN=$(cat "$LAST_RUN_FILE")
        NOW=$(date +%s)
        ELAPSED=$((NOW - LAST_RUN))
        if [[ $ELAPSED -lt $COOLDOWN_SECONDS ]]; then
            REMAINING=$(( (COOLDOWN_SECONDS - ELAPSED) / 3600 ))
            log "Skipping: last run was ${ELAPSED}s ago (${REMAINING}h remaining in cooldown)"
            exit 0
        fi
    fi
fi

# --- Run Claude Code headless ---
log "===== Research update started ====="
log "Repo: $REPO_DIR"
log "Job dir: $JOB_DIR"
log "Mode: $MODE"

cd "$REPO_DIR"

# Export JOB_DIR so the headless agent can use it for screenshots
export RESEARCH_JOB_DIR="$JOB_DIR"

# Ensure we're not blocked by nested session detection
unset CLAUDECODE 2>/dev/null || true

# Source environment (cron/systemd-run don't load profile)
if [[ -f "$HOME/.bashrc" ]]; then
    source "$HOME/.bashrc" 2>/dev/null || true
fi
if [[ -f "$HOME/.profile" ]]; then
    source "$HOME/.profile" 2>/dev/null || true
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

# Symlink latest run for easy access
ln -sfn "$JOB_DIR" "$LOG_DIR/latest"
