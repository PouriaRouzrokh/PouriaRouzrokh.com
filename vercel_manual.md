# Next.js Project Setup and Deployment Guide

This guide walks through the complete process of setting up a Next.js project with TypeScript, Tailwind CSS, and Shadcn UI, connecting it to GitHub, deploying to Vercel, and configuring a custom domain.

## Prerequisites

- A GitHub account
- A Vercel account
- A domain purchased from Porkbun
- Node.js installed (v18.17 or later)
- Git installed

## 1. Initial Project Setup

### 1.1 Create Project Directory

```bash
# Create project directory with lowercase name (important for Next.js)
mkdir your-project-name
cd your-project-name
```

### 1.2 Initialize Git Repository

```bash
# Initialize git repository
git init

# Set up GitHub remote
git remote add origin git@github.com:YourUsername/YourRepository.git
```

### 1.3 Create Next.js Project

```bash
# Initialize Next.js project in current directory
npx create-next-app@latest .
```

Answer the prompts with the following recommendations:

- Use TypeScript? → Yes
- Use ESLint? → Yes
- Use Tailwind CSS? → Yes
- Use `src/` directory? → Yes
- Use App Router? → Yes
- Customize import alias? → Yes (keep default @/\*)
- Use Turbopack? → No (more stable for now)

### 1.4 Install Shadcn UI (Optional)

```bash
# Install Shadcn
npx shadcn@latest init
```

For the prompts:

- TypeScript? → Yes
- Style? → Default
- Base color? → Slate (or preference)
- Global CSS file? → app/globals.css
- CSS variables? → Yes
- Tailwind config? → tailwind.config.ts
- Components import alias? → @/components
- Utils import alias? → @/lib/utils
- React Server Components? → Yes

Install desired components:

```bash
npx shadcn@latest add button card [other-components]
```

### 1.5 Test Locally

```bash
# Start development server
npm run dev
```

Visit http://localhost:3000 to view your site.

## 2. GitHub Setup and Initial Commit

### 2.1 Create .gitignore

A `.gitignore` file should have been created by Next.js, but verify it includes:

```
node_modules/
.next/
.env
.env.local
```

### 2.2 Make Initial Commit

```bash
# Add all files
git add .

# Commit
git commit -m "Initial commit: Next.js project setup"

# Set main branch and push
git branch -M main
git push -u origin main
```

## 3. Vercel Deployment

### 3.1 Deploy to Vercel

The easiest way is through the Vercel dashboard:

1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click "Add New" → "Project"
3. Import your GitHub repository
4. Keep default settings for Next.js
5. Click "Deploy"

Alternatively, use the CLI:

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

Answer the prompts:

- Set up and deploy? → Yes
- Which scope? → Your account
- Link to existing project? → No
- Project name? → your-project-name
- Directory location? → ./
- Modify settings? → No

### 3.2 Set Up Environment Variables (If Needed)

1. Go to your project in Vercel dashboard
2. Click "Settings" → "Environment Variables"
3. Add any required environment variables
4. Redeploy if necessary

## 4. Custom Domain Setup

### 4.1 Add Domain in Vercel

1. Go to your project in Vercel dashboard
2. Click "Settings" → "Domains"
3. Enter your domain name and click "Add"
4. Select "Production" environment
5. Choose "No Redirect" if this is your primary domain

### 4.2 Configure DNS in Porkbun

1. Log in to your Porkbun account
2. Go to "Domain Management" and select your domain
3. Click on "DNS Records"
4. Add the following records:

For the root domain:

- Type: A
- Host: @ (or leave blank)
- Answer: 76.76.21.21
- TTL: Auto/3600

For www subdomain:

- Type: CNAME
- Host: www
- Answer: cname.vercel-dns.com.
- TTL: Auto/3600

For wildcard (all subdomains):

- Type: A
- Host: \*
- Answer: 76.76.21.21
- TTL: Auto/3600

Additional recommended IPv6 records:

- Type: AAAA
- Host: \*
- Answer: 2606:4700:f5::a
- TTL: Auto/3600

- Type: AAAA
- Host: \*
- Answer: 2606:4700:f5::b
- TTL: Auto/3600

- Type: AAAA
- Host: \*
- Answer: 2606:4700:f5::c
- TTL: Auto/3600

### 4.3 Verify Domain Setup

1. Return to Vercel's Domains settings
2. Wait for verification (usually within minutes)
3. Ensure all checks show green

Note: DNS changes can take up to 48 hours to fully propagate globally, but typically resolve much faster.

## 5. Making Updates to Your Site

### 5.1 Local Development Workflow

```bash
# Start local development server
npm run dev
```

Make your changes and test locally at http://localhost:3000

### 5.2 Build and Test Production Version Locally

```bash
# Build project
npm run build

# Start production server locally
npm start
```

### 5.3 Commit and Push Changes

```bash
# Stage changes
git add .

# Commit with descriptive message
git commit -m "feat: describe your changes"

# Push to GitHub
git push
```

### 5.4 Automatic Deployment

If you've configured your Vercel project with GitHub integration (default), your changes will automatically deploy when pushed to the main branch.

You can monitor the deployment status in the Vercel dashboard.

### 5.5 Manual Deployment (If Needed)

```bash
# Deploy to production
vercel --prod
```

### 5.6 Check Deployment

1. Visit your domain (e.g., yourdomain.com)
2. Verify your changes are live
3. Check the site on different devices/browsers

## 6. Troubleshooting Common Issues

### GitHub Connection Issues

- Ensure SSH keys are properly set up
- Verify remote URL is correct: `git remote -v`
- Check repository permissions

### Vercel Deployment Failures

- Check build logs in Vercel dashboard
- Verify Node.js version compatibility
- Look for syntax errors or missing dependencies

### DNS Configuration Problems

- Confirm DNS records match Vercel's recommendations
- Use DNS lookup tools like [dnschecker.org](https://dnschecker.org)
- Check for conflicting records (e.g., existing CNAME records)

### Next.js Build Errors

- Ensure compatibility with Next.js version
- Check for proper TypeScript typings
- Verify all imported components exist
