# Technical Snapshot — pouriarouzrokh.com

**Generated**: 2026-03-07
**Checkpoint**: 0 (initial)

---

## Project Summary

Personal academic portfolio and blog for Pouria Rouzrokh. Built with Next.js 16 (App Router) + React 19 on TypeScript, deployed to Vercel (sfo1 region). The site showcases research publications, portfolio projects, education, experience, achievements, and a Notion-backed blog with a contact form.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16.0.10 (App Router) |
| Runtime | React 19.2.3, TypeScript (strict mode) |
| Styling | Tailwind CSS 3.4, CSS variables (HSL), next-themes (dark mode via `.dark` class) |
| UI Primitives | Shadcn/Radix UI (12 components), Lucide icons |
| Blog CMS | Notion API (`@notionhq/client` + `notion-to-md` + `react-markdown`) |
| Forms | React Hook Form + Zod validation |
| Email | Resend API |
| Rate Limiting | Upstash Redis (sliding window per-IP 25/day, fixed window global 50/day) |
| Bot Protection | reCAPTCHA v3 (score >= 0.5) |
| Images | Cloudinary CDN |
| Hosting | Vercel (auto-deploy on push to main) |
| Research Automation | Claude Code headless + Playwright (daily cron on VPS) |

---

## Architecture

### Rendering Strategy

| Route | Strategy | Revalidation | Data Source |
|---|---|---|---|
| `/` | SSR + ISR | 3600s (1 hr) | `fs.readFileSync` (server direct) |
| `/about` | Static (build time) | Never | `fs.readFileSync` (server direct) |
| `/blog` | SSG + ISR | 10800s (3 hr) | Notion API (in-memory 5-min TTL) |
| `/blog/[slug]` | SSG + ISR | 43200s (12 hr) | Notion API (in-memory 15-min TTL) |
| `/contact` | Static shell | Never | None (Server Action) |
| `/portfolio` | Static shell | Never | Client fetch `/api/content/portfolio` |
| `/portfolio/[slug]` | Static shell + client | Never | Client fetch `/api/content/portfolio/[slug]` |
| `/research` | Static shell | Never | Client fetch `/api/research` |
| `/research/[article_id]` | Static shell + client | Never | Client fetch `/api/research/[article_id]` |
| `/privacy`, `/terms` | Fully static | Never | Hardcoded content |

### Data Fetching (Dual Strategy)

`lib/data-fetching.ts` detects `typeof window` at runtime:
- **Server**: `fs.readFileSync` from `public/content/*.json`
- **Client**: `fetch('/api/content/*')` to API routes that read the same JSON files

Every fetch function normalizes Raw JSON types to Clean domain types (e.g., `degrees[]` → `EducationItem[]`, `positions[]` → `ExperienceItem[]`).

### Type System (Two-Layer Design)

`lib/types.ts` implements a Raw/Clean split:
- **Raw types** (prefixed `Raw*`): Mirror JSON file structure, all fields optional, index signatures for unknown fields. Used only inside `data-fetching.ts`.
- **Clean domain types**: `ProfileData`, `EducationItem`, `ExperienceItem`, `AchievementItem`, `AcknowledgmentItem`, `ResearchData`, `Article`, `PortfolioItem`, `BlogPostMetadata`, `BlogPost`. Used throughout the app.

### Component Model

**Root Layout Composition**:
```
ThemeProvider (next-themes context)
  MaintenanceWrapper (polls /api/config every 30s)
    Navbar (client)
    <main> (page children)
    Footer (client)
```

No nested layouts — all routes share a single root layout.

**Component Patterns**:

| Pattern | Where Used | How It Works |
|---|---|---|
| Server-fetches-then-passes-down | Home page | Server component reads JSON, passes typed data as props to child sections |
| Self-fetching client components | Portfolio, Research | Components own their data lifecycle via `useEffect` + `fetch` |
| Parent-managed filter + callback | Blog listing | Parent holds `selectedTags` state, passes to `BlogTagFilter` as controlled component |
| Controlled form + server action | Contact | React Hook Form + Zod client-side, server action for submission (no API route) |

**Client vs Server Split**:
- **Client**: Navbar, Footer, HeroSection, ResearchList, PortfolioList, PortfolioDetail, PublicationDetail, BlogCard, BlogTagFilter, ContactForm, Markdown, all media components, SocialLinks
- **Server**: HeroBackground, EducationSection, ExperienceSection, AchievementsSection, AcknowledgmentsSection, ResearchSummarySection, SectionHeading, SectionDivider

### API Routes

**Content API** (bridges JSON files to client components):

| Endpoint | Source |
|---|---|
| `GET /api/content/profile` | `profile.json` |
| `GET /api/content/education` | `education.json` |
| `GET /api/content/experience` | `experience.json` |
| `GET /api/content/achievements` | `achievements.json` |
| `GET /api/content/acknowledgments` | `acknowledgments.json` |
| `GET /api/content/research` | `research.json` |
| `GET /api/content/portfolio` | Scans `portfolio/*.json` directory |
| `GET /api/content/portfolio/[slug]` | Individual portfolio JSON |

**Research API** (alternate path):

| Endpoint | Source |
|---|---|
| `GET /api/research` | Delegates to `getResearch()` in `data-fetching.ts` |
| `GET /api/research/[article_id]` | Fetches all research, filters by article_id (3-tier slug matching) |

**System API**:

| Endpoint | Purpose |
|---|---|
| `GET /api/config` | Returns maintenance mode status (no-store cache) |
| `POST /api/revalidate` | Secret-protected ISR + Notion cache revalidation |

### Blog Integration (Notion)

`lib/notion.ts` provides:
- `getAllPosts()` — queries Notion DB filtered to Published=true, sorted by Date desc
- `getPostBySlug(slug)` — fetches page + blocks, converts to Markdown via `notion-to-md`
- `getAllPostSlugs()` — for `generateStaticParams` at build time
- `revalidateNotionCache()` — clears both caches, called from `/api/revalidate`

**In-memory cache**: Module-level variables (not Redis). `allPostsCache` has 5-min TTL, `postCache` (Map by slug) has 15-min TTL. Both are cold after Vercel serverless cold starts.

### Contact Form Security (5 Layers)

1. **Honeypot**: Hidden field must be empty; silently returns success if filled (to not alert bots)
2. **Zod validation**: `contactFormSchema.parse()` with cross-field refinements
3. **reCAPTCHA v3**: Score >= 0.5 required in production; optional in development
4. **Rate limiting**: Upstash Redis — IP-based sliding window (25/day) + global fixed window (50/day)
5. **Spam patterns**: Regex against subject/message for common spam keywords

---

## Content Structure

### Static Content (`public/content/`)

| File | Structure | Notes |
|---|---|---|
| `profile.json` | Flat object: name, credentials, title, bio, image, social map | Core identity data |
| `education.json` | `{ degrees: [...] }` — 6 entries | 2009–2030 |
| `experience.json` | `{ positions: [...] }` — current roles | RSNA, PaxeraHealth, SIIM, Mayo Clinic |
| `achievements.json` | `{ awards: [...] }` | Multiple RSNA/SIIM awards 2021–2025 |
| `acknowledgments.json` | `{ mentors: [...] }` — 6+ mentors | Mayo Clinic, RSNA, Tehran |
| `research.json` | Complex: metrics, 83 articles, fetched_at timestamp | Auto-updated daily by Claude Code headless |

### Portfolio (`public/content/portfolio/`)

10 individual JSON files, one per project. Schema: `title`, `slug`, `description`, `abstract`, `year`, `technologies[]`, `projectTags[]`, `imageUrl`, optional URLs (github, publication, video, blog).

Projects: LatteReview, THA-AID, THA-Net, RadRotator, MBTI, Angle Calc, Subsidence Calc, THA Registry, VideoInstruct, pouriarouzrokh.com.

### Research Data

`research.json` is auto-updated via Claude Code headless + Playwright scraping Google Scholar daily at 2:00 AM UTC. The `article_id` is a computed 40-char slug from the title + 8-char MD5 hash of `title+year+first_author_lastname`.

---

## Styling

- **Tailwind CSS 3.4**: Utility-first, mobile-first (`md:`/`lg:` breakpoints)
- **Theme**: CSS custom properties (HSL) in `globals.css`, swapped by `.dark` class via `next-themes`
- **`cn()` utility**: `clsx` + `tailwind-merge` for conditional class composition
- **Font**: Inter (Google Fonts, weights 400-800)
- **Container**: Centered, 2rem padding, max-width 1400px at 2xl
- **Custom animations**: `accordion-down/up`, `fade-in-up`, `scale-in` (forwards fill)
- **Shadcn config**: Default style, neutral base color, CSS variables enabled, Lucide icons

---

## Utility Scripts (`utils/`)

| Script | Purpose |
|---|---|
| `update-research-prompt.md` | Claude Code headless instruction set for Scholar scraping |
| `update-research-cron.sh` | Cron wrapper with 22-hr cooldown, logging, `--force` via systemd-run |
| `setup-research-cron.sh` | One-time VPS cron setup |
| `toggle-maintenance.js` | Local dev maintenance mode toggle (flips `.env.local`) |
| `vercel-maintenance.mjs` | Production Vercel maintenance toggle via CLI |
| `validate_json.py` | JSON validation with detailed diagnostics |
| `fix_json.py` | Auto-fix trailing commas and pretty-print JSON |
| `collect_scripts.py` | Bundle entire codebase into single markdown file |

---

## Deployment

```
Developer push to main
  → Vercel auto-build (npm run build → .next → sfo1)

VPS cron (daily 2AM UTC)
  → claude -p update-research-prompt.md (headless, claude-opus-4-6)
  → Playwright scrapes Google Scholar
  → Updates public/content/research.json
  → git commit + push → triggers Vercel build
  → ISR revalidation via /api/revalidate (REVALIDATION_SECRET)
```

No GitHub Actions. CI/CD is Vercel-native + VPS cron.

---

## Environment Variables

| Variable | Purpose |
|---|---|
| `NOTION_SECRET`, `NOTION_DATABASE_ID` | Blog CMS |
| `RESEND_API_KEY` | Contact form email |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | Image CDN (client) |
| `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` | Image CDN (server) |
| `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN` | Rate limiting |
| `NEXT_PUBLIC_RECAPTCHA_SITE_KEY`, `RECAPTCHA_SECRET_KEY` | Bot protection |
| `CONTACT_RECIPIENT_EMAIL`, `CONTACT_FROM_EMAIL` | Contact form recipients |
| `REVALIDATION_SECRET` | ISR revalidation auth |
| `NEXT_PUBLIC_MAINTENANCE_MODE` / `MAINTENANCE_MODE` | Maintenance mode |

---

## Known Architectural Notes

1. **Redundant research API**: `/api/content/research` and `/api/research` both serve research data via different code paths.
2. **Data normalization duplication**: API routes and `data-fetching.ts` both normalize JSON shapes independently.
3. **Footer fetches profile on every mount**: Footer is a client component that calls `/api/content/profile` via `useEffect` — the home page already has this data server-side but cannot share it.
4. **PublicationDetail fetches entire dataset**: Fetches all articles then filters client-side to find one, rather than using a per-article endpoint.
5. **HeroSection title filter**: Hardcoded filter removes title segments containing "assistant professor" (business logic in component, not data layer).
6. **Maintenance mode env var inconsistency**: Local dev uses `NEXT_PUBLIC_MAINTENANCE_MODE` (client-visible), production Vercel uses `MAINTENANCE_MODE` (server-only).
7. **In-memory Notion cache**: Does not survive serverless cold starts. TTL guarantees only apply within a single function invocation lifecycle.
8. **`@ts-expect-error` in notion.ts**: Suppresses type checking on Notion API responses at lines 59 and 134.
9. **Debug `console.log` in production**: Portfolio and research detail pages/API routes have debug logging.
