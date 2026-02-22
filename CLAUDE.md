# CLAUDE.md — pouriarouzrokh.com

## Project Overview

Personal academic portfolio and blog for Pouria Rouzrokh. Built with **Next.js 16** (App Router) + **React 19** on **TypeScript**, deployed to **Vercel**.

The site showcases research publications, portfolio projects, education, experience, achievements, and a Notion-backed blog with a contact form.

## Development Commands

```bash
npm run dev              # Start dev server
npm run build            # Production build
npm run start            # Run production server
npm run lint             # ESLint
npm run toggle-maintenance  # Toggle maintenance mode
```

Install with `--legacy-peer-deps` (required for some dependency compatibility).

## Project Structure

```
src/
├── app/                    # Next.js App Router pages & API routes
│   ├── layout.tsx          # Root layout (Navbar, Footer, ThemeProvider)
│   ├── page.tsx            # Home (SSR, ISR 3600s)
│   ├── globals.css         # Global styles + CSS variables
│   ├── about/              # Static about page
│   ├── blog/               # Notion-backed blog (SSG + ISR)
│   ├── contact/            # Contact form (client component)
│   ├── portfolio/          # Portfolio projects (client-side fetch)
│   ├── research/           # Publications (client-side fetch)
│   └── api/                # API routes for content, research, config, revalidation
├── components/
│   ├── layout/             # Navbar, Footer, ThemeProvider, MaintenanceWrapper
│   ├── sections/           # Page section components (HeroSection, ResearchList, etc.)
│   ├── ui/                 # Shadcn/Radix UI primitives
│   ├── forms/              # ContactForm with reCAPTCHA
│   ├── media/              # YouTubeEmbed, VideoPlayer, ImageGallery
│   └── seo/                # JSON-LD structured data
├── lib/
│   ├── data-fetching.ts    # Core data layer (fs reads server-side, API fetch client-side)
│   ├── notion.ts           # Notion blog integration (with in-memory cache)
│   ├── types.ts            # All TypeScript interfaces
│   ├── media.ts            # Cloudinary URLs, YouTube embeds, reading time
│   ├── utils.ts            # cn() class merge utility
│   ├── actions/            # Server actions (contact form)
│   └── schemas/            # Zod validation schemas
└── middleware.ts           # Subdomain redirects

public/content/             # JSON data files (profile, education, experience, etc.)
public/content/portfolio/   # Individual portfolio project JSON files

utils/                      # Maintenance/data scripts (JS + Claude Code headless)
```

## Architecture Patterns

### Data Fetching (Dual Strategy)

`lib/data-fetching.ts` auto-detects environment via `typeof window`:
- **Server components** (Home, Blog): Direct `fs.readFileSync()` from `public/content/`
- **Client components** (Portfolio, Research): `fetch('/api/content/*')` which reads same JSON files

### Rendering Strategy

| Route | Rendering | Revalidation |
|-------|-----------|--------------|
| `/` (Home) | SSR | ISR 3600s (1 hr) |
| `/blog` | Server Component | In-memory 5-min TTL |
| `/blog/[slug]` | SSG + ISR | 43200s (12 hr) |
| `/portfolio`, `/research` | Client Component | On-demand |

### Component Model
- **Server components** for static/SSR pages (Home, About, Blog listing)
- **Client components** for interactive pages (Portfolio, Research, Contact)
- **No global state library** — local `useState`/`useEffect`, `ThemeProvider` context, React Hook Form
- Path alias: `@/*` maps to `./src/*`

## Styling Conventions

- **Tailwind CSS 3.4** with utility-first approach
- **CSS variables** (HSL-based) in `globals.css` for light/dark themes
- **Dark mode**: CSS class strategy (`.dark`) via `next-themes`
- **cn() utility** (`clsx` + `tailwind-merge`) for conditional class composition
- **Font**: Inter (Google Fonts, weights 400-800)
- **Responsive**: Mobile-first with `md:` / `lg:` breakpoints
- **UI primitives**: Shadcn/Radix UI components in `components/ui/`
- No CSS Modules or styled-components

## Content Management

### Static Content (JSON)
Manually maintained JSON files in `public/content/`: `profile.json`, `education.json`, `experience.json`, `achievements.json`, `acknowledgments.json`, `research.json`, and individual portfolio files in `public/content/portfolio/`.

### Blog (Notion)
Notion database → `@notionhq/client` → `notion-to-md` → `react-markdown` → UI. In-memory caching with configurable TTL. Revalidation via `/api/revalidate`.

### Research Data (Claude Code Headless + Playwright)
Google Scholar → Claude Code headless (Playwright MCP screenshots) → `public/content/research.json`. Runs daily at 2:00 AM UTC via cron on VPS. Each run creates a per-job directory under `logs/run_YYYYMMDD_HHMMSS/` with screenshots and logs (7-day retention, gitignored). Scripts: `utils/update-research-cron.sh` (cron wrapper, `--force` schedules via `systemd-run`), `utils/update-research-prompt.md` (headless prompt, screenshot-only extraction), `utils/setup-research-cron.sh` (one-time setup).

## External Services

| Service | Purpose | Env Vars |
|---------|---------|----------|
| Notion | Blog CMS | `NOTION_SECRET`, `NOTION_DATABASE_ID` |
| Resend | Contact form email | `RESEND_API_KEY` |
| Cloudinary | Image CDN | `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` |
| Upstash Redis | Rate limiting | `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN` |
| reCAPTCHA v3 | Bot protection | `NEXT_PUBLIC_RECAPTCHA_SITE_KEY`, `RECAPTCHA_SECRET_KEY` |
| Vercel | Hosting | Configured via `.vercel/project.json` |

Additional env vars: `CONTACT_EMAIL`, `REVALIDATION_SECRET`.

## Security Notes

Contact form has 5-layer protection: Zod validation, honeypot field, reCAPTCHA v3 (score >= 0.5), spam pattern regex, IP-based rate limiting (25/day per IP, 50/day global). ISR revalidation is protected by `REVALIDATION_SECRET`.

## Key Files

- `src/lib/data-fetching.ts` — Central data access layer
- `src/lib/notion.ts` — Blog integration with caching
- `src/lib/types.ts` — All TypeScript interfaces
- `src/app/layout.tsx` — Root layout composition
- `src/lib/actions/contact-form-actions.ts` — Contact form server action
- `next.config.js` — Cloudinary domains, strict mode
- `tailwind.config.ts` — Custom theme, animations, dark mode
- `components.json` — Shadcn UI configuration

## Documentation

- `.claude/checkpoints/` — Technical snapshots of the codebase
- `.claude/checkpoints/checkpoint-0/snapshot.md` — Full technical snapshot
- `.claude/checkpoints/checkpoint-0/rfd/` — Request for Discussion documents
- `.claude/references/` — Reference materials
