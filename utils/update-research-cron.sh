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
#   bash utils/update-research-cron.sh --test-alert # Send a test failure email and exit
#
# Failure alerts:
#   Any run that exits non-zero emails CONTACT_RECIPIENT_EMAIL (.env.local) through
#   Gmail SMTP, using the radar Gmail account's app password (~/projects/radar/.env).
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
ENV_FILE="$REPO_DIR/.env.local"
ALERT_ENV_FILE="/home/pouria/projects/radar/.env"

# --- Parse flags ---
MODE="normal"
case "${1:-}" in
    --force)      MODE="force" ;;
    --scheduled)  MODE="scheduled" ;;
    --dry-run)    MODE="dry-run" ;;
    --test-alert) MODE="test-alert" ;;
    "")           MODE="normal" ;;
    *)            echo "Unknown flag: $1" >&2; exit 2 ;;
esac

# --- Failure alert: email via Gmail SMTP ---
# Resend (the contact form's sender) accepts mail to this address but it is never
# delivered, so alerts go through the radar Gmail account's app password instead.
env_val() {
    sed -nE "s/^$2=[\"']?([^\"']*)[\"']?[[:space:]]*\$/\1/p" "$1" 2>/dev/null | tail -1
}
send_alert() {
    local subject="$1" body="$2"
    local user pass to out
    user=$(env_val "$ALERT_ENV_FILE" RADAR_IMAP_USER)
    pass=$(env_val "$ALERT_ENV_FILE" RADAR_IMAP_PASSWORD)
    to=$(env_val "$ENV_FILE" CONTACT_RECIPIENT_EMAIL)
    if [[ -z "$user" || -z "$pass" || -z "$to" ]]; then
        echo "[$(date '+%Y-%m-%d %H:%M:%S %Z')] WARNING: alert not sent (Gmail credentials in $ALERT_ENV_FILE or CONTACT_RECIPIENT_EMAIL in $ENV_FILE missing)"
        return 0
    fi
    out=$(ALERT_USER="$user" ALERT_PASS="$pass" ALERT_TO="$to" \
          ALERT_SUBJECT="$subject" ALERT_BODY="$body" python3 - <<'PY' 2>&1
import os, smtplib
from email.message import EmailMessage
m = EmailMessage()
m["From"] = "VPS research update <%s>" % os.environ["ALERT_USER"]
m["To"] = os.environ["ALERT_TO"]
m["Subject"] = os.environ["ALERT_SUBJECT"]
m.set_content(os.environ["ALERT_BODY"])
with smtplib.SMTP_SSL("smtp.gmail.com", 465, timeout=30) as s:
    s.login(os.environ["ALERT_USER"], os.environ["ALERT_PASS"])
    s.send_message(m)
print("sent")
PY
    ) || true
    echo "[$(date '+%Y-%m-%d %H:%M:%S %Z')] Alert email to $to: ${out##*$'\n'}"
}

# Any non-zero exit (failed attempts, failed deploy, missing config, a crash
# under `set -e`) sends one email. FAIL_REASON is set by the known failure paths.
FAIL_REASON=""
on_exit() {
    local rc=$?
    [[ $rc -eq 0 || "$MODE" == "force" ]] && return 0
    local log_tail="" hint=""
    if [[ -n "${LOG_FILE:-}" && -f "$LOG_FILE" ]]; then
        log_tail=$(tail -n 25 "$LOG_FILE")
        if grep -qiE "Failed to authenticate|not logged in|OAuth" "$LOG_FILE"; then
            hint="Claude Code is logged out on the VPS. Fix: ssh prouz, run claude, type /login, then /exit.
Re-run now with: bash $SCRIPT_PATH --force"
        fi
    fi
    send_alert "Website research update FAILED ($(date '+%Y-%m-%d'))" \
"The weekly Google Scholar update for pouriarouzrokh.com failed on the VPS (exit $rc).

${FAIL_REASON:-See the log below.}

${hint}

Log: ${LOG_FILE:-$CRON_LOG}
---
${log_tail}"
}
trap on_exit EXIT

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

# --- Test alert: send one email and exit ---
if [[ "$MODE" == "test-alert" ]]; then
    send_alert "TEST: website research update alert" \
"This is a test of the failure alert for the weekly Google Scholar update on the VPS.
If a real run fails, an email like this one arrives with the reason and the last lines of the log."
    exit 0
fi

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

# --- Verify the Vercel production deployment for a pushed commit ---
# Uses the GitHub "Vercel" commit status (no Vercel CLI auth needed).
# Returns: 0 = deploy succeeded, 1 = deploy FAILED, 2 = inconclusive (timeout / gh unavailable).
verify_deployment() {
    local sha="$1"
    local repo_slug state elapsed=0
    local timeout_s=600 interval=20

    repo_slug=$(git -C "$REPO_DIR" remote get-url origin 2>/dev/null \
        | sed -E 's#^git@github.com:##; s#^https://github.com/##; s#\.git$##')
    if [[ -z "$repo_slug" ]]; then
        log "WARNING: could not determine GitHub repo slug; skipping deploy verification"
        return 2
    fi
    if ! command -v gh >/dev/null 2>&1 || ! gh auth status >/dev/null 2>&1; then
        log "WARNING: gh CLI unavailable/unauthenticated; cannot verify deployment for ${sha:0:7}"
        return 2
    fi

    log "Verifying Vercel deployment for commit ${sha:0:7} (timeout ${timeout_s}s)..."
    while (( elapsed < timeout_s )); do
        state=$(gh api "repos/$repo_slug/commits/$sha/status" \
            --jq '([.statuses[] | select(.context=="Vercel")] | last | .state) // "pending"' \
            2>/dev/null || echo "unknown")
        case "$state" in
            success)
                log "Vercel deployment for ${sha:0:7} succeeded."
                return 0 ;;
            failure|error)
                log "ERROR: Vercel deployment for ${sha:0:7} reported state=$state"
                return 1 ;;
            *)
                sleep "$interval"; elapsed=$(( elapsed + interval )) ;;
        esac
    done
    log "WARNING: Vercel deployment for ${sha:0:7} did not reach a terminal state within ${timeout_s}s (last: ${state:-unknown})"
    return 2
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

# Pre-flight: fail fast (and alert) if Claude Code is logged out, instead of
# burning three retries on the same auth error.
if ! claude auth status 2>/dev/null | jq -e '.loggedIn == true' >/dev/null 2>&1; then
    log "ERROR: Claude Code is not logged in on this server (claude auth status)."
    FAIL_REASON="Claude Code is not logged in on the VPS, so the update could not start."
    echo "Failed to authenticate: claude auth status reports loggedIn=false" >> "$LOG_FILE"
    touch "$JOB_DIR/FAILED"
    write_status "failure" "$FAIL_REASON"
    write_history "failure" 0 0 "$FAIL_REASON"
    ln -sfn "$JOB_DIR" "$LOG_DIR/latest"
    exit 1
fi

# Pull latest changes (with auto-stash to survive dirty trees)
auto_stash
log "Pulling latest changes..."
if git pull --rebase >> "$LOG_FILE" 2>&1; then
    log "Pull succeeded."
else
    log "WARNING: git pull failed, continuing with current state"
fi
auto_unstash

# Record HEAD before the agent runs, so we can tell whether a new commit was pushed.
PRE_SHA=$(git -C "$REPO_DIR" rev-parse HEAD 2>/dev/null || echo "")

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
    # The agent exited 0 (data committed & pushed). That is NOT proof the site
    # actually deployed — verify the Vercel production deployment for the new commit.
    POST_SHA=$(git -C "$REPO_DIR" rev-parse HEAD 2>/dev/null || echo "")
    DEPLOY_NOTE=""
    if [[ -n "$POST_SHA" && "$POST_SHA" != "$PRE_SHA" ]]; then
        if verify_deployment "$POST_SHA"; then
            DEPLOY_NOTE="Vercel deployment verified (commit ${POST_SHA:0:7})."
        else
            VERIFY_RC=$?
            if [[ $VERIFY_RC -eq 1 ]]; then
                log "===== Agent succeeded but the Vercel DEPLOYMENT FAILED (commit ${POST_SHA:0:7}) ====="
                touch "$JOB_DIR/FAILED"
                SUMMARY="Data was committed & pushed (${POST_SHA:0:7}) but the Vercel production deployment FAILED. The live site is still serving the previous deployment. Investigate vercel.json / the Vercel dashboard."
                FAIL_REASON="$SUMMARY"
                write_status "failure" "$SUMMARY"
                write_history "deploy_failed" "$ATTEMPT" "$DURATION" "$SUMMARY"
                ln -sfn "$JOB_DIR" "$LOG_DIR/latest"
                exit 1
            fi
            DEPLOY_NOTE="Deployment verification inconclusive (rc=$VERIFY_RC) — confirm on the Vercel dashboard."
        fi
    else
        DEPLOY_NOTE="No new commit pushed; deployment verification skipped."
    fi
    log "===== Research update completed successfully (attempts: $ATTEMPT, ${DURATION}s) ====="
    log "$DEPLOY_NOTE"
    date +%s > "$LAST_RUN_FILE"
    write_status "success" "$SUMMARY

$DEPLOY_NOTE"
    write_history "success" "$ATTEMPT" "$DURATION" "$SUMMARY $DEPLOY_NOTE"
    # Symlink latest run for easy access
    ln -sfn "$JOB_DIR" "$LOG_DIR/latest"
    exit 0
else
    log "===== Research update FAILED after $ATTEMPT attempts (${DURATION}s) ====="
    touch "$JOB_DIR/FAILED"
    SUMMARY="All $ATTEMPT attempt(s) failed. See $LOG_FILE for details."
    FAIL_REASON="$SUMMARY"
    write_status "failure" "$SUMMARY"
    write_history "failure" "$ATTEMPT" "$DURATION" "$SUMMARY"
    ln -sfn "$JOB_DIR" "$LOG_DIR/latest"
    exit 1
fi
