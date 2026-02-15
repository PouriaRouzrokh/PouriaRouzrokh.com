#!/bin/bash
# setup-research-cron.sh — One-time setup for Claude Code headless research updates
#
# Run this on the VPS to configure the cron job.
# Usage: bash utils/setup-research-cron.sh

set -euo pipefail

REPO_DIR="/home/pouria/projects/pouriarouzrokh.com"
LOG_DIR="$HOME/logs/research-update"
CRON_SCHEDULE="0 2 * * *"  # 2:00 AM UTC daily

echo "=== Research Update Cron Setup ==="
echo ""

# --- Check prerequisites ---
echo "Checking prerequisites..."

# Claude CLI
if command -v claude &>/dev/null; then
    CLAUDE_VERSION=$(claude --version 2>/dev/null || echo "unknown")
    echo "  [OK] Claude CLI found: $CLAUDE_VERSION"
else
    echo "  [FAIL] Claude CLI not found. Install it first."
    exit 1
fi

# Repo directory
if [[ -d "$REPO_DIR" ]]; then
    echo "  [OK] Repo directory exists: $REPO_DIR"
else
    echo "  [FAIL] Repo directory not found: $REPO_DIR"
    exit 1
fi

# Prompt file
if [[ -f "$REPO_DIR/utils/update-research-prompt.md" ]]; then
    echo "  [OK] Prompt file exists"
else
    echo "  [FAIL] Prompt file not found: $REPO_DIR/utils/update-research-prompt.md"
    exit 1
fi

# Cron script
if [[ -f "$REPO_DIR/utils/update-research-cron.sh" ]]; then
    echo "  [OK] Cron script exists"
else
    echo "  [FAIL] Cron script not found: $REPO_DIR/utils/update-research-cron.sh"
    exit 1
fi

# Git SSH
if git -C "$REPO_DIR" remote -v | grep -q "git@"; then
    echo "  [OK] Git remote uses SSH"
elif git -C "$REPO_DIR" remote -v | grep -q "https://"; then
    echo "  [WARN] Git remote uses HTTPS — push may require credentials"
fi

echo ""

# --- Create log directory ---
echo "Creating log directory..."
mkdir -p "$LOG_DIR"
echo "  [OK] $LOG_DIR"
echo ""

# --- Install crontab entry ---
echo "Installing crontab entry..."

CRON_CMD="$CRON_SCHEDULE cd $REPO_DIR && bash utils/update-research-cron.sh >> $LOG_DIR/cron.log 2>&1"

# Check if already installed
if crontab -l 2>/dev/null | grep -qF "update-research-cron.sh"; then
    echo "  [SKIP] Cron entry already exists. Replacing..."
    # Remove existing entry and add new one
    (crontab -l 2>/dev/null | grep -vF "update-research-cron.sh"; echo "$CRON_CMD") | crontab -
else
    # Add to existing crontab (or create new one)
    (crontab -l 2>/dev/null; echo "$CRON_CMD") | crontab -
fi

echo "  [OK] Crontab installed: $CRON_SCHEDULE (2:00 AM UTC daily)"
echo ""

# --- Verify crontab ---
echo "Current crontab:"
crontab -l 2>/dev/null | grep "update-research" || echo "  (none found — something went wrong)"
echo ""

echo "=== Setup Complete ==="
echo ""
echo "Summary:"
echo "  Schedule:  Daily at 2:00 AM UTC"
echo "  Logs:      $LOG_DIR/"
echo "  Latest:    $LOG_DIR/latest.log"
echo "  Cron log:  $LOG_DIR/cron.log"
echo ""
echo "Useful commands:"
echo "  View latest log:    cat $LOG_DIR/latest.log"
echo "  Manual run:         bash $REPO_DIR/utils/update-research-cron.sh --force"
echo "  Edit crontab:       crontab -e"
echo "  View crontab:       crontab -l"
