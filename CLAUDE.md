# CLAUDE.md — pouriarouzrokh.com

Personal academic portfolio and blog for Pouria Rouzrokh (Next.js 16, TypeScript, Vercel).

## Where work happens

- **Develop, test and build on the Mac**, in `~/Developer/pouriarouzrokh.com`. Never build or test on the VPS: it is a small shared server that also runs his other live sites.
- **Pull before you work.** The VPS commits `public/content/research.json` to `main` every Sunday, so start with `git pull --rebase`.
- **Deploys:** Vercel builds and deploys every push to `main` (GitHub integration, Node 22). Nothing builds on the VPS. Run `scripts/deploy.sh` to ship: it refuses a dirty tree or another branch, pulls, runs lint + typecheck + build, then pushes.
- **What stays on the VPS:** the weekly research update (cron, Sundays 09:00 ET: `utils/update-research-cron.sh` runs a headless Claude with Playwright to scrape Google Scholar, commits, pushes, checks the Vercel deploy and emails on failure). The checkout `~/projects/pouriarouzrokh.com` on the VPS exists only for this job; it holds no `node_modules`. The job's scripts refuse to run on the Mac. Never run the job or `utils/update-research-prompt.md` from the Mac: that would scrape and commit a second time.

Mac commands (Node 22: `export PATH=/opt/homebrew/opt/node@22/bin:$PATH`):

```bash
npm ci                   # install (≈ 7 s)
npm run dev              # dev server
npm run lint             # ESLint (≈ 2 s)
npm run typecheck        # tsc --noEmit (≈ 2 s)
npm run build            # production build (≈ 9 s)
scripts/deploy.sh        # check and push main; Vercel deploys it
```

There is no test suite; lint, typecheck and build are the checks.

## Context Loading Instructions

To understand this project, read the documentation in this order:

### 1. Find the Latest Checkpoint

```bash
ls -d .claude/checkpoints/checkpoint-* 2>/dev/null | sort -V | tail -1
```

### 2. Read Project Context

- **If a snapshot exists** in the latest checkpoint: Read `snapshot.md` first — it contains the current technical state
- **If no snapshot exists**: Read the PRD at `.claude/checkpoints/checkpoint-0/prd.md` for project vision and requirements

### 3. Read All RFDs

Check the latest checkpoint's `rfd/` folder for Request for Development documents:

```bash
find .claude/checkpoints/checkpoint-*/rfd -name "*.md" 2>/dev/null | sort -V
```

### Priority Order

1. Latest snapshot (current state)
2. PRD (original vision)
3. Recent RFDs (feature details)

## Quick Commands

See "Where work happens" above. `.npmrc` sets `legacy-peer-deps`, so a plain `npm ci` works.

## Key Files

- `src/lib/data-fetching.ts` — Central data access layer (dual server/client strategy)
- `src/lib/types.ts` — All TypeScript interfaces (Raw/Clean two-layer design)
- `src/lib/notion.ts` — Blog integration with in-memory caching
- `src/lib/actions/contact-form-actions.ts` — Contact form server action (5-layer security)
- `src/app/layout.tsx` — Root layout composition
- `public/content/` — JSON data files
- `utils/update-research-prompt.md` — Headless agent for Scholar scraping

## Development Principles

### Multi-Agent Strategy

When a task benefits from running multiple agents, choose the right approach:

- **Subagents (default)**: Lightweight workers that report results back. Use for independent parallel tasks.
- **Agent teams**: Independent sessions with inter-agent messaging. Use only when agents need to communicate or coordinate.

### Leveraging Available Tools

Before starting any task, check what skills and MCP servers are available:

- Review available skills for specialized capabilities
- Check available MCP servers for enhanced functionality

### RFD Documentation

For significant changes (features, bug fixes, architectural changes — not one-line fixes), create or update an RFD:

- **Path**: `.claude/checkpoints/checkpoint-{N}/rfd/{N}-{feature-slug}/rfd-{YYYY-MM-DD}-{HHMM}.md`
- **Workflow**: Write question → Document plan → Implement → Update RFD with results

### Planning First

Always plan before implementation:

- Write RFD first for features requiring them
- Think through approach before coding
- Consider edge cases, error handling, testing upfront

### Package Documentation

When working with unfamiliar packages:

1. **First**: Check available MCP servers for documentation tools
2. **Second**: Search online for documentation
3. **Third**: Ask the user for clarification

### UI/Web Testing

For frontend development:

- Use Playwright for browser automation and testing, if available
- Take screenshots to verify visual changes
- Test user flows and form interactions

### Testing Requirements

Before handing off work:

- On the Mac, run `npm run lint`, `npm run typecheck` and `npm run build`
- Verify changes work as expected

## Documentation Hierarchy

```
.claude/checkpoints/
├── checkpoint-0/          # Initial state
│   ├── snapshot.md        # Technical codebase snapshot
│   └── rfd/               # Feature tracking
│       └── {N}-{slug}/    # Individual feature RFDs
└── checkpoint-N/          # Future milestones
    ├── snapshot.md
    └── rfd/
```

**Document relationships**: Snapshots (state) → RFDs (features) → CLAUDE.md (quick reference)
