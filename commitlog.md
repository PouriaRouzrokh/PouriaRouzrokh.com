# pouriarouzrokh.com Commit Log

This file tracks significant commits and changes to the project.

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
