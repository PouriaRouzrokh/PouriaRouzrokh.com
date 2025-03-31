# Development Plan for pouria.ai Portfolio Website

Based on the technical specification, here's a comprehensive step-by-step plan to develop the portfolio website with clear checkpoints to ensure quality and progress tracking.

## Phase 1: Project Setup and Foundation

### Step 1: Project Initialization

1. Create a new Next.js project with TypeScript
   ```bash
   npx create-next-app@latest pouria-ai --typescript --eslint --tailwind --app --src-dir
   ```
2. Configure ESLint and Prettier for code quality
3. Set up Git repository with initial commit
4. Configure TypeScript settings in tsconfig.json for strict mode

### Step 2: Environment and Dependencies Setup

1. Install required dependencies:
   ```bash
   npm install next-themes @next/mdx @mdx-js/react @mdx-js/loader clsx tailwind-merge zod @hookform/resolvers
   ```
2. Install shadcn/ui components:
   ```bash
   npx shadcn-ui@latest init
   ```
3. Set up .env.local file structure for API keys
4. Configure next.config.mjs for Cloudinary image domains

### Step 3: Project Structure Creation

1. Create folder structure following the specification
2. Set up placeholder files in core directories
3. Configure tailwind.config.ts with custom theme colors and settings

### Checkpoint 1: Foundation Validation

- Project builds without errors
- File structure matches technical specification
- Git repository is properly initialized with initial commit
- TypeScript configuration is properly set up
- All necessary dependencies are installed

## Phase 2: Core Components and Styles

### Step 1: Layout Components

1. Develop root layout.tsx with ThemeProvider setup
2. Create Navbar.tsx component with navigation links
3. Implement Footer.tsx with site information and social links
4. Build ThemeToggle.tsx for light/dark mode switching

### Step 2: UI Component Library

1. Set up shadcn/ui component library integration
2. Create custom UI components needed for the project
3. Define global styles in globals.css

### Step 3: Content Data Types

1. Define TypeScript interfaces in lib/types.ts for all data structures:
   - Profile data
   - Research data
   - Education data
   - Experience data
   - Projects data
   - Blog post frontmatter

### Checkpoint 2: Component Library Validation

- Layout components render correctly
- Theme toggle functionality works
- Type definitions match JSON data structures
- UI components are responsive and accessible
- Style system follows design guidelines

## Phase 3: Data Management and Fetching

### Step 1: Python Script Configuration

1. Review and update scholarly_data_fetcher.py script
2. Configure output path to public/content/research.json
3. Test script execution locally
4. Set up GitHub Actions workflow for automation

### Step 2: Content Setup

1. Create initial JSON content files:
   - public/content/profile.json
   - public/content/education.json
   - public/content/experience.json
   - public/content/projects.json
2. Create sample blog MDX file in public/content/blog/

### Step 3: Data Fetching Utilities

1. Implement lib/data-fetching.ts with functions for each content type:
   - getProfile()
   - getResearch()
   - getEducation()
   - getExperience()
   - getProjects()
   - getBlogPosts() and getBlogPostBySlug()

### Checkpoint 3: Data Management Validation

- Python script successfully generates research.json
- JSON files are correctly structured and validated against types
- Data fetching utilities work correctly
- GitHub Action workflow is configured and tested

## Phase 4: Home Page Development

### Step 1: Section Components

1. Implement HeroSection.tsx
2. Develop EducationSection.tsx
3. Create ResearchSummarySection.tsx
4. Build ExperienceSection.tsx

### Step 2: Home Page Integration

1. Implement app/page.tsx
2. Integrate all section components
3. Add responsive design for different screen sizes
4. Set up metadata for SEO

### Checkpoint 4: Home Page Validation

- All sections render correctly with real data
- Page is responsive on mobile, tablet, and desktop
- Layout follows the design requirements
- Data is correctly fetched and displayed
- SEO metadata is properly configured

## Phase 5: Research Section Development

### Step 1: Research Card Component

1. Design and implement ResearchCard.tsx component
2. Add interactive elements and proper formatting

### Step 2: Research Listing Page

1. Implement app/research/page.tsx
2. Add search and sorting functionality
3. Implement pagination if needed
4. Set up metadata generation

### Step 3: Individual Publication Page

1. Implement app/research/[doi]/page.tsx
2. Create publication detail layout
3. Add BibTeX citation with copy functionality
4. Set up dynamic metadata generation

### Checkpoint 5: Research Section Validation

- Research page loads and displays all publications
- Search and sorting functions work correctly
- Individual publication pages render correctly
- Dynamic routing based on DOI functions properly
- BibTeX generation and copy feature works

## Phase 6: Portfolio Section Development

### Step 1: Portfolio Card Component

1. Design and implement PortfolioCard.tsx component
2. Add interactive elements and styling

### Step 2: Portfolio Listing Page

1. Implement app/portfolio/page.tsx
2. Create grid or list layout for projects
3. Set up metadata for SEO

### Step 3: Individual Portfolio Item Page

1. Implement app/portfolio/[slug]/page.tsx
2. Create project detail layout
3. Add technology tags and interactive elements
4. Set up dynamic metadata generation

### Checkpoint 6: Portfolio Section Validation

- Projects page loads and displays all projects
- Grid/list layout is responsive
- Individual project pages render correctly
- Dynamic routing based on slug functions properly
- Links to GitHub/live demo work correctly

## Phase 7: Blog Section Development

### Step 1: MDX Configuration

1. Set up MDX parsing utilities
2. Configure MDX components for enhanced blog posts

### Step 2: Blog Listing Page

1. Implement app/blog/page.tsx
2. Create chronological list of blog posts
3. Add tag filtering functionality
4. Set up metadata for SEO

### Step 3: Individual Blog Post Page

1. Implement app/blog/[slug]/page.tsx
2. Create blog post layout with styling
3. Add metadata and publication date formatting
4. Set up dynamic metadata generation

### Checkpoint 7: Blog Section Validation

- Blog page loads and displays all posts chronologically
- Tag filtering works correctly
- Individual blog posts render MDX content correctly
- Dynamic routing based on slug functions properly
- Code blocks and other MDX elements are styled properly

## Phase 8: Contact Form Implementation

### Step 1: Server Actions

1. Implement lib/actions.ts with contact form submission logic
2. Set up email service integration (Resend)
3. Add server-side validation with Zod

### Step 2: Contact Form Component

1. Create ContactForm.tsx as a client component
2. Implement form state management and validation
3. Add loading, success, and error states

### Step 3: Contact Page

1. Implement app/contact/page.tsx
2. Integrate ContactForm component
3. Add additional contact information if needed
4. Set up metadata for SEO

### Checkpoint 8: Contact Form Validation

- Contact form renders correctly
- Client-side validation works properly
- Server-side validation functions correctly
- Email service integration works
- User feedback (loading, success, error states) is implemented

## Phase 9: SEO and Performance Optimization

### Step 1: SEO Implementation

1. Configure root metadata in layout.tsx
2. Implement dynamic metadata for all page routes
3. Create sitemap.xml generation
4. Add robots.txt file

### Step 2: Performance Optimization

1. Implement image optimization for all Cloudinary images
2. Add lazy loading for below-the-fold content
3. Optimize component rendering and data fetching
4. Implement proper caching strategies

### Step 3: Accessibility Improvements

1. Perform accessibility audit
2. Fix any accessibility issues
3. Add proper ARIA attributes
4. Test with keyboard navigation

### Checkpoint 9: SEO and Performance Validation

- Lighthouse score exceeds 95 for performance
- All pages have proper metadata
- Sitemap.xml is generated correctly
- Accessibility score meets WCAG standards
- Images are properly optimized

## Phase 10: Testing and Deployment

### Step 1: Testing

1. Perform cross-browser testing
2. Test on different devices and screen sizes
3. Validate all interactive features
4. Check all links and navigation

### Step 2: Deployment Setup

1. Configure Vercel project settings
2. Set up environment variables in Vercel
3. Connect GitHub repository to Vercel

### Step 3: Production Deployment

1. Deploy to Vercel
2. Configure custom domain (pouria.ai)
3. Set up HTTPS and security headers
4. Test GitHub Actions for research data updates

### Checkpoint 10: Final Validation

- Website is successfully deployed to production
- Custom domain is properly configured
- All features work correctly in production
- GitHub Actions automation runs successfully
- Performance metrics meet targets in production

## Additional Recommendations

### Continuous Improvement Process

1. Set up analytics to track user behavior
2. Create a maintenance schedule for content updates
3. Plan for future feature additions

### Documentation

1. Create technical documentation for the codebase
2. Document content update procedures
3. Create a README.md with setup instructions

### Quality Assurance Checklist

For each checkpoint, verify:

- Code quality (lint errors, TypeScript issues)
- Responsive design at all breakpoints
- Accessibility compliance
- Performance metrics
- Cross-browser compatibility

## Implementation Questions to Consider

1. Would you like to add any additional sections to the home page?
2. Do you have preferences for the visual design (colors, typography, spacing)?
3. Are there any specific research metrics you'd like to highlight beyond those mentioned?
4. Would you like to implement any additional features not covered in the specification?
5. Do you have existing content that needs to be migrated?
