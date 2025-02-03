## 1. Project Overview

### 1.1 Objective

Create a professional portfolio website at pouria.ai showcasing academic and professional achievements.

### 1.2 Tech Stack

- Framework: Next.js 15 with App Router
- Language: TypeScript
- Styling: TailwindCSS + shadcn/ui
- Image Hosting: Cloudinary
- Deployment: Vercel

## 2. Project Structure

```
pouria-ai/
├── src/
│   ├── app/                       # Next.js pages
│   │   ├── page.tsx               # Home page
│   │   ├── layout.tsx             # Root layout
│   │   ├── research/              # Research section
│   │   │   ├── page.tsx
│   │   │   └── [doi]/page.tsx
│   │   ├── projects/
│   │   │   ├── page.tsx
│   │   │   └── [slug]/page.tsx
│   │   ├── presentations/
│   │   │   └── page.tsx
│   │   ├── blog/
│   │   │   ├── page.tsx
│   │   │   └── [slug]/page.tsx
│   │   ├── experiences/
│   │   │   └── page.tsx
│   │   ├── education/
│   │   │   └── page.tsx
│   │   ├── mentorship/
│   │   │   └── page.tsx
│   │   └── contact/
│   │       └── page.tsx
│   ├── components/                # React components
│   │   ├── layout/                # Layout components
│   │   │   ├── navbar.tsx
│   │   │   ├── footer.tsx
│   │   │   └── theme-toggle.tsx
│   │   ├── ui/                    # shadcn/ui components
│   │   └── sections/              # Page sections
│   │       ├── hero.tsx
│   │       ├── research-card.tsx
│   │       └── project-card.tsx
│   ├── lib/                       # Utilities
│   │   ├── types.ts               # TypeScript types
│   │   └── utils.ts               # Utility functions
│   └── styles/
│       └── globals.css
├── public/                        # Static assets
│   ├── content/                   # Content files
│   │   ├── research.json
│   │   ├── projects.json
│   │   └── blog/
│   │       └── [slug].mdx
│   └── images/
└── utils/                        # Python utilities
    └── scholar_scraper.py
```
