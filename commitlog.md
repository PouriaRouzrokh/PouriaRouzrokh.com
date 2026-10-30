# pouriarouzrokh.com Commit Log

This file tracks significant commits and changes to the project.

### 10/30/2026 (main) — done by WatchTower (~/WatchTower), Pouria approved

- **Housekeeping (no code change):** deleted the untracked, gitignored `.env.local.backup` (April 2025) on the Mac. It held the same 11 variable names as `.env.local`, only older values, so nothing was lost. Nothing on Vercel or the VPS changed.

### 10/29/2026 (main) — done by WatchTower (~/WatchTower) under Pouria's grant G-1

- **Research update: Claude Sonnet 5.5, from the one model card**
  - Pouria: all projects "get their models from ONE model card, which must always be up to date"; and the weekly Google Scholar job moves from Opus to Sonnet.
  - `utils/research-update.config.json` `model`: `claude-opus-4-7` → `claude-sonnet-5-5`.
  - `utils/update-research-cron.sh` takes the model from pr-ra's `model-card.json` (purpose `research_update`, at `/home/pouria/projects/pr-ra/model-card.json` on the VPS) and falls back to the config's `model` when the card is missing or has no such purpose. It resolves the model again **after** its `git pull`, so a pushed change applies on the same Sunday (before, the config was read before the pull, a week late). The run log, STATUS.md and history.jsonl name the model and where it came from. Nothing else in the script changed.
  - Verified: `bash -n`; the resolver tested on the Mac against the real card, a missing, a broken and a purpose-less card; on the VPS, `claude -p --model claude-sonnet-5-5` answered "ok". RFD: `.claude/checkpoints/checkpoint-0/rfd/1-research-automation-hardening/rfd-2026-10-29-1600.md`.
  - Left: push (WatchTower), after pr-ra's deploy puts `model-card.json` on the VPS; until then the config's value (the same model) is used.

### 2/15/2026 - 13:28 (main)

- **Infra: Replace GitHub Actions with Claude Code headless cron for research updates**
  - Deleted GitHub Actions workflow, Python scholarly scraper, and old shell scripts
  - Created `utils/update-research-prompt.md` (headless prompt for Playwright-based Google Scholar scraping)
  - Created `utils/update-research-cron.sh` (cron wrapper with 24h cooldown, logging)
  - Created `utils/setup-research-cron.sh` (one-time VPS cron setup)
  - Cron installed on VPS: daily at 2:00 AM UTC
  - Logs stored in `logs/` (gitignored)
  - Fixed citation count to use Google Scholar profile metric instead of summed per-article total

### 2/15/2026 - 11:05 (main)

- **Feature: Add /privacy and /terms pages for Twilio A2P 10DLC registration**
  - Created Privacy Policy page for PRouz personal AI assistant
  - Created Terms and Conditions page with bold STOP/HELP instructions
  - Added both routes to sitemap.ts
  - RFD: .claude/checkpoints/checkpoint-0/rfd/1-privacy-terms-pages/

### 2/15/2026 - 10:45 (main)

- **Docs: Add CLAUDE.md and .claude directory structure**
  - Created CLAUDE.md at project root with project overview, architecture patterns, dev commands, styling conventions, content management pipelines, and external service documentation
  - Set up .claude/ directory with checkpoints/checkpoint-0/snapshot.md (full technical snapshot), rfd/ for future RFDs, and references/ for reference materials
  - Removed obsolete public/content/research_old.json (superseded by research.json)
