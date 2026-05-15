#!/bin/bash
# update-research-cron.sh — Cron wrapper for Claude Code headless research updates
#
# Configuration: utils/research-update.config.json
#   - schedule, model, cooldown, retries, retention, max runtime
#
# Usage:
#   bash utils/update-research-cron.sh              # Normal run (respects cooldown)
#   bash utils/update-research-cron.sh --force      # Schedule a run in ~60s via systemd-run
#   bash utils/update-research-cron.sh --scheduled  # Internal: skip cooldown, run directly
#   bash utils/update-research-cron.sh --dry-run    # Verify config + cleanup; skip headless agent
#
# Outputs:
#   logs/run_<timestamp>/update.log     # Per-run detailed log
#   logs/latest                          # Symlink to most recent run dir
#   logs/cron.log                        # Append-only audit trail (auto-truncated)
#   logs/STATUS.md                       # Last-run snapshot (timestamp, result, summary)
#   logs/history.jsonl                   # One JSON line per run, year-long audit trail

set -euo pipefail

# --- Configuration ---
REPO_DIR="/home/pouria/projects/pouriarouzrokh.com"
SCRIPT_PATH="$REPO_DIR/utils/update-research-cron.sh"
CONFIG_FILE="$REPO_DIR/utils/research-update.config.json"
LAST_RUN_FILE="$HOME/.scholarly-update-last-run"
LOG_DIR="$REPO_DIR/logs"
PLAYWRIGHT_MCP_DIR="$REPO_DIR/.playwright-mcp"
STATUS_FILE="$LOG_DIR/STATUS.md"
HISTORY_FILE="$LOG_DIR/history.jsonl"
CRON_LOG="$LOG_DIR/cron.log"

# --- Parse flags ---
MODE="normal"
case "${1:-}" in
    --force)     MODE="force" ;;
    --scheduled) MODE="scheduled" ;;
    --dry-run)   MODE="dry-run" ;;
    "")          MODE="normal" ;;
    *)           echo "Unknown flag: $1" >&2; exit 2 ;;
esac

# --- Load config ---
if ! command -v jq >/dev/null 2>&1; then
    echo "ERROR: jq is required but not installed." >&2
    exit 1
fi
if [[ ! -f "$CONFIG_FILE" ]]; then
    echo "ERROR: Config not found at $CONFIG_FILE" >&2
    exit 1
fi

MODEL=$(jq -r '.model' "$CONFIG_FILE")
COOLDOWN_SECONDS=$(jq -r '.cooldown_seconds' "$CONFIG_FILE")
MAX_RUNTIME_SECONDS=$(jq -r '.max_runtime_seconds' "$CONFIG_FILE")
MAX_RETRIES=$(jq -r '.max_retries' "$CONFIG_FILE")
RETRY_DELAY_SECONDS=$(jq -r '.retry_delay_seconds' "$CONFIG_FILE")
LOG_RETENTION_DAYS=$(jq -r '.log_retention_days' "$CONFIG_FILE")
FAILURE_LOG_RETENTION_DAYS=$(jq -r '.failure_log_retention_days' "$CONFIG_FILE")
PLAYWRIGHT_MCP_RETENTION_DAYS=$(jq -r '.playwright_mcp_retention_days' "$CONFIG_FILE")
CRON_LOG_MAX_BYTES=$(jq -r '.cron_log_max_bytes' "$CONFIG_FILE")

# --- Force mode: schedule via systemd-run and exit ---
if [[ "$MODE" == "force" ]]; then
    UNIT_NAME="research-update-$(date +%s)"
    echo "Scheduling research update in ~60s (unit: $UNIT_NAME)..."
    systemd-run --user --on-active=60s --unit="$UNIT_NAME" \
        bash "$SCRIPT_PATH" --scheduled
    echo "Scheduled. Monitor with: journalctl --user -u $UNIT_NAME -f"
    echo "Or check logs: tail -f $LOG_DIR/latest/update.log"
    exit 0
fi

# --- Setup paths ---
mkdir -p "$LOG_DIR"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
JOB_DIR="$LOG_DIR/run_${TIMESTAMP}"
mkdir -p "$JOB_DIR"
LOG_FILE="$JOB_DIR/update.log"

log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S %Z')] $*" | tee -a "$LOG_FILE"
}

# --- Cleanup: rotate cron.log if oversized ---
if [[ -f "$CRON_LOG" ]]; then
    SIZE=$(stat -c '%s' "$CRON_LOG" 2>/dev/null || echo 0)
    if [[ "$SIZE" -gt "$CRON_LOG_MAX_BYTES" ]]; then
        # Keep last half of file (preserves recent history, sheds old)
        TMP="$CRON_LOG.tmp"
        tail -c $((CRON_LOG_MAX_BYTES / 2)) "$CRON_LOG" > "$TMP" && mv "$TMP" "$CRON_LOG"
    fi
fi

# --- Cleanup: old per-run dirs (success: short retention, failures: longer) ---
# A run dir is considered "failed" if it contains a FAILED marker file.
find "$LOG_DIR" -maxdepth 1 -name "run_*" -type d -mtime "+$LOG_RETENTION_DAYS" \
    \! -exec test -f '{}/FAILED' \; \
    -exec rm -rf {} + 2>/dev/null || true
find "$LOG_DIR" -maxdepth 1 -name "run_*" -type d -mtime "+$FAILURE_LOG_RETENTION_DAYS" \
    -exec rm -rf {} + 2>/dev/null || true

# --- Cleanup: .playwright-mcp accumulation ---
if [[ -d "$PLAYWRIGHT_MCP_DIR" ]]; then
    find "$PLAYWRIGHT_MCP_DIR" -maxdepth 1 -type f \
        -mtime "+$PLAYWRIGHT_MCP_RETENTION_DAYS" -delete 2>/dev/null || true
fi

# --- Cooldown check (skipped for --scheduled and --dry-run) ---
if [[ "$MODE" == "normal" ]]; then
    if [[ -f "$LAST_RUN_FILE" ]]; then
        LAST_RUN=$(cat "$LAST_RUN_FILE")
        NOW=$(date +%s)
        ELAPSED=$((NOW - LAST_RUN))
        if [[ $ELAPSED -lt $COOLDOWN_SECONDS ]]; then
            REMAINING=$(( (COOLDOWN_SECONDS - ELAPSED) / 3600 ))
            log "Skipping: last run was ${ELAPSED}s ago (${REMAINING}h remaining in cooldown)"
            # Remove the empty run dir we created
            rmdir "$JOB_DIR" 2>/dev/null || true
            exit 0
        fi
    fi
fi

# --- Status file writer ---
write_status() {
    local result="$1"  # "success" | "failure" | "skipped"
    local summary="$2"
    cat > "$STATUS_FILE" <<EOF
# Research Update — Last Run Status

- **Time**: $(date '+%Y-%m-%d %H:%M:%S %Z')
- **Result**: $result
- **Mode**: $MODE
- **Model**: $MODEL
- **Job dir**: $JOB_DIR

## Summary

$summary

---
*This file is rewritten on every run. For audit trail see \`logs/history.jsonl\`.*
EOF
}

# --- History writer (one JSON line per run) ---
write_history() {
    local result="$1"
    local attempts="$2"
    local duration_s="$3"
    local summary="$4"
    # JSON-escape the summary
    local escaped_summary
    escaped_summary=$(printf '%s' "$summary" | jq -Rs .)
    {
        printf '{"timestamp":"%s","result":"%s","mode":"%s","model":"%s","attempts":%s,"duration_seconds":%s,"job_dir":"%s","summary":%s}\n' \
            "$(date -u '+%Y-%m-%dT%H:%M:%SZ')" \
            "$result" "$MODE" "$MODEL" "$attempts" "$duration_s" "$JOB_DIR" "$escaped_summary"
    } >> "$HISTORY_FILE"
}

# --- Auto-stash dirty working tree before pull (cleanly restore after) ---
STASH_REF=""
auto_stash() {
    cd "$REPO_DIR"
    if ! git diff-index --quiet HEAD -- || [[ -n "$(git ls-files --others --exclude-standard)" ]]; then
        STASH_LABEL="research-update-autostash-$TIMESTAMP"
        if git stash push --include-untracked -m "$STASH_LABEL" >> "$LOG_FILE" 2>&1; then
            STASH_REF="$STASH_LABEL"
            log "Auto-stashed dirty working tree as: $STASH_LABEL"
        else
            log "WARNING: auto-stash failed; continuing with dirty tree"
        fi
    fi
}
auto_unstash() {
    if [[ -z "$STASH_REF" ]]; then return 0; fi
    cd "$REPO_DIR"
    # Find the stash by message
    local stash_id
    stash_id=$(git stash list | grep -F "$STASH_REF" | head -1 | sed 's/:.*//')
    if [[ -z "$stash_id" ]]; then
        log "WARNING: auto-stash $STASH_REF not found in stash list"
        return 0
    fi
    if git stash pop "$stash_id" >> "$LOG_FILE" 2>&1; then
        log "Restored auto-stash: $STASH_REF"
    else
        log "WARNING: could not pop auto-stash $STASH_REF cleanly. Stash kept; resolve manually with: git stash list"
    fi
}

# --- Dry-run: validate config + cleanup, then exit without running the agent ---
if [[ "$MODE" == "dry-run" ]]; then
    log "===== Dry-run started ====="
    log "Config OK: model=$MODEL cooldown=${COOLDOWN_SECONDS}s retries=$MAX_RETRIES max_runtime=${MAX_RUNTIME_SECONDS}s"
    log "Retention: success=${LOG_RETENTION_DAYS}d failure=${FAILURE_LOG_RETENTION_DAYS}d playwright-mcp=${PLAYWRIGHT_MCP_RETENTION_DAYS}d"
    if [[ -d "$PLAYWRIGHT_MCP_DIR" ]]; then
        REMAINING=$(find "$PLAYWRIGHT_MCP_DIR" -maxdepth 1 -type f 2>/dev/null | wc -l)
        log ".playwright-mcp after cleanup: $REMAINING files"
    fi
    RUN_DIRS=$(find "$LOG_DIR" -maxdepth 1 -name "run_*" -type d | wc -l)
    log "Run dirs in $LOG_DIR after cleanup: $RUN_DIRS"
    write_status "dry-run" "Config and cleanup validated. No headless agent invoked."
    write_history "dry-run" 0 0 "Config and cleanup validated."
    log "===== Dry-run completed ====="
    exit 0
fi

# --- Real run ---
log "===== Research update started ====="
log "Repo: $REPO_DIR"
log "Job dir: $JOB_DIR"
log "Mode: $MODE | Model: $MODEL | Max runtime: ${MAX_RUNTIME_SECONDS}s | Max retries: $MAX_RETRIES"

cd "$REPO_DIR"
export RESEARCH_JOB_DIR="$JOB_DIR"
unset CLAUDECODE 2>/dev/null || true

# Source environment (cron/systemd-run don't load profile)
[[ -f "$HOME/.bashrc" ]] && source "$HOME/.bashrc" 2>/dev/null || true
[[ -f "$HOME/.profile" ]] && source "$HOME/.profile" 2>/dev/null || true

# Pull latest changes (with auto-stash to survive dirty trees)
auto_stash
log "Pulling latest changes..."
if git pull --rebase >> "$LOG_FILE" 2>&1; then
    log "Pull succeeded."
else
    log "WARNING: git pull failed, continuing with current state"
fi
auto_unstash

START_TS=$(date +%s)
SUMMARY=""
RESULT="failure"
ATTEMPT=0

# --- Retry loop ---
for ((i = 0; i <= MAX_RETRIES; i++)); do
    ATTEMPT=$((i + 1))
    log "Attempt $ATTEMPT of $((MAX_RETRIES + 1)): running Claude Code headless..."

    SET_E_ORIG=$-
    set +e
    timeout --signal=TERM --kill-after=30s "$MAX_RUNTIME_SECONDS" \
        claude -p "$(cat utils/update-research-prompt.md)" \
            --model "$MODEL" \
            --dangerously-skip-permissions >> "$LOG_FILE" 2>&1
    EXIT_CODE=$?
    [[ "$SET_E_ORIG" == *e* ]] && set -e

    if [[ $EXIT_CODE -eq 0 ]]; then
        RESULT="success"
        # Pull the "Final Status" block from the log if present
        SUMMARY=$(awk '/^\*\*Final Status:\*\*/,/^$/' "$LOG_FILE" | tail -n +1)
        [[ -z "$SUMMARY" ]] && SUMMARY="Run completed successfully (no Final Status block parsed)."
        log "Attempt $ATTEMPT succeeded."
        break
    fi

    if [[ $EXIT_CODE -eq 124 ]]; then
        log "Attempt $ATTEMPT timed out after ${MAX_RUNTIME_SECONDS}s (exit 124)"
    else
        log "Attempt $ATTEMPT failed with exit code $EXIT_CODE"
    fi

    if [[ $i -lt $MAX_RETRIES ]]; then
        log "Retrying in ${RETRY_DELAY_SECONDS}s..."
        sleep "$RETRY_DELAY_SECONDS"
    fi
done

END_TS=$(date +%s)
DURATION=$((END_TS - START_TS))

if [[ "$RESULT" == "success" ]]; then
    log "===== Research update completed successfully (attempts: $ATTEMPT, ${DURATION}s) ====="
    date +%s > "$LAST_RUN_FILE"
    write_status "success" "$SUMMARY"
    write_history "success" "$ATTEMPT" "$DURATION" "$SUMMARY"
    # Symlink latest run for easy access
    ln -sfn "$JOB_DIR" "$LOG_DIR/latest"
    exit 0
else
    log "===== Research update FAILED after $ATTEMPT attempts (${DURATION}s) ====="
    touch "$JOB_DIR/FAILED"
    SUMMARY="All $ATTEMPT attempt(s) failed. See $LOG_FILE for details."
    write_status "failure" "$SUMMARY"
    write_history "failure" "$ATTEMPT" "$DURATION" "$SUMMARY"
    ln -sfn "$JOB_DIR" "$LOG_DIR/latest"
    exit 1
fi
