# Technical Snapshot: pouriarouzrokh.com

**Generated**: 2026-02-15
**Branch**: `main`
**Last Commit**: `53677e1` - updated research data

---

## 1. Project Overview

A **personal academic portfolio and blog website** for Pouria Rouzrokh, built with **Next.js 16.0.10** (App Router) and **React 19.2.3** on **TypeScript 5.3.3**. Deployed to **Vercel** (region: `sfo1`).

The site showcases research publications, portfolio projects, education, experience, achievements, and a Notion-backed blog with a contact form.

---

## 2. Tech Stack Summary

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16.0.10 (App Router) |
| UI Library | React 19.2.3 |
| Language | TypeScript 5.3.3 |
| Styling | Tailwind CSS 3.4.1 + CSS Variables |
| UI Components | Shadcn/Radix UI primitives |
| Icons | Lucide React 0.306.0 |
| Forms | React Hook Form 7.68.0 + Zod 3.22.4 |
| Blog CMS | Notion API (@notionhq/client 2.3.0) |
| Markdown | react-markdown 10.1.0 + remark-gfm + rehype plugins |
| Email | Resend 4.2.0 |
| Rate Limiting | Upstash Redis + @upstash/ratelimit |
| Image CDN | Cloudinary (@cloudinary/url-gen 1.21.0) |
| Bot Protection | Google reCAPTCHA v3 |
| Theming | next-themes 0.2.1 (dark/light) |
| Deployment | Vercel |
| Data Scripts | Python (scholarly library for Google Scholar) |

---

## 3. Directory Structure

```
pouriarouzrokh.com/
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── layout.tsx                # Root layout (Navbar, Footer, Providers)
│   │   ├── page.tsx                  # Home page (SSR, ISR 3600s)
│   │   ├── globals.css               # Global styles + CSS variables
│   │   ├── robots.ts                 # robots.txt generation
│   │   ├── sitemap.ts                # Dynamic XML sitemap
│   │   ├── about/page.tsx
│   │   ├── contact/page.tsx
│   │   ├── blog/
│   │   │   ├── page.tsx              # Blog listing (server component)
│   │   │   ├── ClientBlogList.tsx    # Client search/filter
│   │   │   └── [slug]/
│   │   │       ├── page.tsx          # Blog post (ISR 43200s)
│   │   │       ├── loading.tsx
│   │   │       └── not-found.tsx
│   │   ├── portfolio/
│   │   │   ├── page.tsx
│   │   │   └── [slug]/page.tsx
│   │   ├── research/
│   │   │   ├── page.tsx
│   │   │   └── [article_id]/page.tsx
│   │   └── api/
│   │       ├── content/
│   │       │   ├── profile/route.ts
│   │       │   ├── education/route.ts
│   │       │   ├── experience/route.ts
│   │       │   ├── achievements/route.ts
│   │       │   ├── acknowledgments/route.ts
│   │       │   ├── research/route.ts
│   │       │   └── portfolio/
│   │       │       ├── route.ts
│   │       │       └── [slug]/route.ts
│   │       ├── research/
│   │       │   ├── route.ts
│   │       │   └── [article_id]/route.ts
│   │       ├── config/route.ts       # Maintenance mode status
│   │       └── revalidate/route.ts   # ISR cache invalidation
│   │
│   ├── components/
│   │   ├── layout/                   # Navbar, Footer, ThemeProvider, ThemeToggle, MaintenanceWrapper
│   │   ├── sections/                 # HeroSection, EducationSection, ExperienceSection,
│   │   │                             # ResearchSummarySection, ResearchList, PublicationDetail,
│   │   │                             # PortfolioList, PortfolioDetail, AchievementsSection,
│   │   │                             # AcknowledgmentsSection, BlogCard, BlogTagFilter
│   │   ├── ui/                       # Shadcn primitives (button, card, input, badge, form,
│   │   │                             # avatar, select, separator, tooltip, portfolio-card,
│   │   │                             # research-card, section-heading, section-divider, etc.)
│   │   ├── forms/ContactForm.tsx     # Contact form with reCAPTCHA
│   │   ├── media/                    # YouTubeEmbed, VideoPlayer, ImageGallery
│   │   ├── seo/JsonLd.tsx            # Structured data
│   │   └── Markdown.tsx              # Markdown renderer with syntax highlighting
│   │
│   ├── lib/
│   │   ├── data-fetching.ts          # Core data layer (reads JSON files server-side, fetches API client-side)
│   │   ├── notion.ts                 # Notion blog integration (with in-memory cache)
│   │   ├── types.ts                  # All TypeScript interfaces
│   │   ├── media.ts                  # Cloudinary URLs, YouTube embeds, reading time
│   │   ├── utils.ts                  # cn() class utility
│   │   ├── actions/
│   │   │   └── contact-form-actions.ts  # Server action (validation, spam check, email)
│   │   └── schemas/
│   │       └── contact-form-schema.ts   # Zod validation schema
│   │
│   ├── types/                        # Custom .d.ts declarations
│   │   ├── notion-to-md.d.ts
│   │   └── react-markdown.d.ts
│   │
│   └── middleware.ts                 # Subdomain redirects (ns1.*, ns2.* -> main)
│
├── public/
│   ├── content/                      # JSON content files
│   │   ├── profile.json
│   │   ├── education.json
│   │   ├── experience.json
│   │   ├── achievements.json
│   │   ├── acknowledgments.json
│   │   ├── research.json             # Google Scholar publications
│   │   └── portfolio/                # Individual project JSON files
│   │       ├── pouriarouzrokh_com.json
│   │       ├── tha_registry.json
│   │       ├── angle_calc.json
│   │       ├── radrotator.json
│   │       ├── tha-net.json
│   │       ├── tha-aid.json
│   │       ├── mbti.json
│   │       ├── subsidence_calc.json
│   │       ├── videoinstuct.json
│   │       └── lattereview.json
│   ├── images/
│   ├── pr-logo.svg
│   ├── og-image.jpg
│   └── placeholder-profile.jpg
│
├── utils/                            # Maintenance & data scripts
│   ├── scholarly_data_fetcher.py     # Google Scholar data fetcher (Python)
│   ├── validate_json.py
│   ├── fix_json.py
│   ├── collect_scripts.py
│   ├── toggle-maintenance.js
│   └── vercel-maintenance.mjs
│
├── deploy.sh                         # Deployment automation
├── run_scholarly_update.sh           # Scheduled research data updates
├── update_research_data.sh           # Manual research update
├── git_update.sh                     # Git operations automation
│
├── next.config.js                    # Cloudinary image domains, strict mode
├── tailwind.config.ts                # Custom theme, animations, dark mode
├── tsconfig.json                     # Path alias @/* -> ./src/*
├── components.json                   # Shadcn UI config
├── vercel.json                       # Vercel deployment settings
├── pyproject.toml                    # Python deps (scholarly, httpx)
└── package.json
```

---

## 4. Page Routes & Data Fetching Strategy

| Route | Rendering | Data Source | Revalidation |
|-------|-----------|-------------|--------------|
| `/` | SSR (Server Component) | `public/content/*.json` via fs | ISR 3600s (1 hr) |
| `/about` | Server Component | Static | - |
| `/blog` | Server Component | Notion API (`getAllPosts()`) | In-memory 5-min TTL |
| `/blog/[slug]` | SSG + ISR | Notion API (`getPostBySlug()`) | 43200s (12 hr) + 15-min cache |
| `/contact` | Client Component | None (form only) | - |
| `/portfolio` | Client Component | `/api/content/portfolio` | On-demand |
| `/portfolio/[slug]` | Hybrid (server meta + client fetch) | `/api/content/portfolio/[slug]` | On-demand |
| `/research` | Client Component | `/api/research` | On-demand |
| `/research/[article_id]` | Hybrid (server meta + client fetch) | `/api/content/research` | On-demand |

### Data Flow Pattern

```
Server Components (Home, Blog)     Client Components (Portfolio, Research)
        │                                      │
        ▼                                      ▼
  fs.readFileSync()                    fetch('/api/content/*')
  from public/content/                         │
        │                                      ▼
        ▼                              API Route Handler
  Parse JSON + transform               reads same JSON files
        │                                      │
        ▼                                      ▼
  Pass as props to                     NextResponse.json()
  section components                   → state via useState
```

The `data-fetching.ts` module auto-detects environment (`typeof window`) and routes to either direct file reads (server) or API fetch calls (client).

---

## 5. Core Data Models

```typescript
// Profile
ProfileData { name, credentials, title, email, bio, shortBio, image,
  social: { X, GitHub, LinkedIn, GoogleScholar, ResearchGate, ORCID },
  skills: Array<{ category, items }> }

// Research
ResearchData { author, metrics: { citations, h_index, i10_index, cited_by_5_years },
  articles: Article[], total_articles, total_citations }

Article { title, authors[], year, journal, volume, number, pages, abstract,
  num_citations, url, article_id, doi, bibtex }

// Portfolio
PortfolioItem { title, slug, description, abstract, year, technologies[], projectTags[],
  imageUrl, videoUrl, githubUrl, liveUrl, publicationUrl, blogPostUrl }

// Blog (from Notion)
BlogPost { id, slug, title, date, summary, tags[], featuredImage, published,
  content, readingTime: { text, minutes, time, words } }

// Others: EducationItem, ExperienceItem, AchievementItem, AcknowledgmentItem
```

---

## 6. Component Architecture

### Layout Composition
```
<html lang="en">
  <body>
    <ThemeProvider>           ← next-themes (dark/light)
      <MaintenanceWrapper>   ← Polls /api/config every 30s
        <div class="min-h-screen flex flex-col">
          <Navbar />          ← Sticky, mobile hamburger, theme toggle
          <main>{children}</main>
          <Footer />          ← Social links, profile data
        </div>
      </MaintenanceWrapper>
    </ThemeProvider>
  </body>
</html>
```

### Key Components

| Component | Type | Features |
|-----------|------|----------|
| `HeroSection` | Server | Profile image, bio, social links, CTA buttons |
| `ResearchList` | Client | Search, sort (year/citations), metrics cards, grid |
| `PortfolioList` | Client | Search, tag filtering, responsive grid |
| `PublicationDetail` | Client | BibTeX copy, author formatting, metadata |
| `PortfolioDetail` | Client | YouTube embed, tech stack, external links |
| `ClientBlogList` | Client | Search, tag filter, route prefetching |
| `ContactForm` | Client | reCAPTCHA, honeypot, consultation areas, Zod validation |
| `Markdown` | Client | Syntax highlighting (Prism), YouTube embeds, GFM |
| `MaintenanceWrapper` | Client | Polls maintenance status, shows maintenance page |

### State Management
- **No global state library** (no Redux, Zustand, etc.)
- Local `useState` / `useEffect` for component state
- `ThemeProvider` context via next-themes
- URL params for dynamic routes (`[slug]`, `[article_id]`)
- React Hook Form for contact form state

---

## 7. Styling System

- **Tailwind CSS 3.4.1** with utility-first approach
- **CSS Variables** (HSL-based design tokens) in `globals.css` for light/dark themes
- **Dark mode** via CSS class strategy (`.dark`)
- **cn() utility** (clsx + tailwind-merge) for conditional class composition
- **Font**: Inter (Google Fonts, weights 400-800)
- **Animations**: `tailwindcss-animate` plugin
- **Responsive**: Mobile-first with `md:` / `lg:` breakpoints
- **No CSS Modules or styled-components**

---

## 8. External Services & Integrations

| Service | Purpose | Config |
|---------|---------|--------|
| **Notion** | Blog CMS | `NOTION_SECRET`, `NOTION_DATABASE_ID` |
| **Resend** | Contact form email | `RESEND_API_KEY` |
| **Cloudinary** | Image hosting & optimization | `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` |
| **Upstash Redis** | Rate limiting | `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN` |
| **Google reCAPTCHA v3** | Bot protection | `NEXT_PUBLIC_RECAPTCHA_SITE_KEY`, `RECAPTCHA_SECRET_KEY` |
| **Vercel** | Hosting & deployment | `.vercel/project.json` |
| **Google Scholar** (via Python) | Research publication data | `utils/scholarly_data_fetcher.py` |

---

## 9. Security Measures

- **Contact form**: 5-layer protection
  1. Zod server-side validation
  2. Honeypot field (hidden input, must be empty)
  3. reCAPTCHA v3 verification (score >= 0.5)
  4. Spam pattern detection (regex for common spam keywords)
  5. IP-based rate limiting via Upstash Redis (25/day per IP, 50/day global)
- **Middleware**: Subdomain redirect (ns1.*, ns2.* -> main domain)
- **ISR revalidation**: Protected by `REVALIDATION_SECRET` token
- **Environment variables**: Secrets in `.env.local`, template in `.env.local.example`

---

## 10. Build & Deployment

```bash
npm run dev           # Development server
npm run build         # Production build
npm run start         # Production server
npm run lint          # ESLint
npm run toggle-maintenance  # Toggle maintenance mode
```

- **Vercel Config**: Region `sfo1`, install with `--legacy-peer-deps`
- **ISR**: Home (1hr), Blog posts (12hr), on-demand via `/api/revalidate`
- **Shell scripts**: `deploy.sh`, `run_scholarly_update.sh`, `update_research_data.sh`, `git_update.sh`

---

## 11. Performance Optimizations

1. **ISR caching** on home (3600s) and blog (43200s)
2. **In-memory Notion cache** (5-min for listings, 15-min for individual posts)
3. **Cloudinary image transforms** (responsive width-based scaling)
4. **Next.js Image** component (auto WebP, lazy loading, priority for above-fold)
5. **Route prefetching** for blog posts (staggered: first 3 immediate, rest after 2s)
6. **Server/client component split** for optimal bundle size
7. **On-demand revalidation** endpoint for manual cache clearing

---

## 12. Content Population Pipeline

### Research Data
```
Google Scholar → scholarly_data_fetcher.py → research.json → data-fetching.ts → Components
```
- Python `scholarly` library fetches author metrics + publications
- Generates article IDs (URL slug + MD5 hash)
- Creates BibTeX entries
- Output stored as `public/content/research.json`

### Blog Content
```
Notion Database → @notionhq/client → notion-to-md → Markdown → react-markdown → UI
```
- Notion database with properties: Title, Slug, Date, Summary, Tags, FeaturedImage, Published
- In-memory caching with configurable TTL
- Manual cache revalidation via API endpoint

### Static Content
```
JSON files in public/content/ → data-fetching.ts → Server/Client Components
```
- Profile, education, experience, achievements, acknowledgments, portfolio
- Manually maintained JSON files

---

## 13. Key Dependencies (55 production, 11 dev)

### Production Highlights
| Package | Version | Purpose |
|---------|---------|---------|
| next | 16.0.10 | Framework |
| react | 19.2.3 | UI library |
| typescript | 5.3.3 | Type system |
| tailwindcss | 3.4.1 | Styling |
| @notionhq/client | 2.3.0 | Blog CMS |
| react-hook-form | 7.68.0 | Form management |
| zod | 3.22.4 | Schema validation |
| resend | 4.2.0 | Email service |
| @upstash/redis | 1.34.6 | Rate limiting |
| react-markdown | 10.1.0 | Markdown rendering |
| date-fns | 4.1.0 | Date formatting |
| @radix-ui/* | Various | UI primitives |
| lucide-react | 0.306.0 | Icons |

### Dev Highlights
| Package | Version | Purpose |
|---------|---------|---------|
| eslint | 8.56.0 | Linting |
| prettier | 3.2.2 | Code formatting |
| prettier-plugin-tailwindcss | 0.5.11 | Tailwind class sorting |

---

## 14. Git Status

- **Branch**: `main`
- **Pending change**: `D public/content/research_old.json` (deleted, unstaged)
- **Recent activity**: Research data updates, React/Next.js version upgrades, profile image fix, awards updates

---

## 15. Observations

### Strengths
- Clean server/client component separation
- Comprehensive security on contact form (5 layers)
- Strong SEO (JSON-LD, meta tags, sitemap, robots.txt)
- Responsive design across all breakpoints
- Well-typed data models with TypeScript interfaces
- Dual data-fetching strategy (server-side fs reads + client-side API)
- Automated research data pipeline (Python + Google Scholar)
- Maintenance mode system with polling

### Potential Improvements
- No global state management (may be needed if app scales)
- No custom hooks (reusable fetch/filter patterns could be abstracted)
- No pagination or infinite scroll for large publication/portfolio lists
- No error boundaries for client components
- Portfolio and research pages use client-side fetching (could benefit from SSR)
- No automated tests detected
- No CI/CD pipeline configuration (relies on Vercel auto-deploy)
