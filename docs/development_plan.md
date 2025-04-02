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
2. The portfolio cards should be aesthetically different than the publication cards that come in the research section.
3. Add interactive elements and styling

### Step 2: Portfolio Listing Page

1. Implement app/portfolio/page.tsx
2. Create grid or list layout for projects
3. The listing page should show the title and badge of each project, year, and a two liner description of the project, and a "Learn More" link which should open the individual portfolio item -aka project - page.
4. Set up metadata for SEO

### Step 3: Individual Portfolio Item Page

1. Implement app/portfolio/[slug]/page.tsx
2. Create project detail layout (each project should have a title, badge (an image from claudinary), short description (two liner), long description that could be as long as an abstract of a paper or even longer, year, and project links where each link should appear as hyper link and the user should be able to provide both the link and its hyperlink)
3. Add technology tags and interactive elements
4. Set up dynamic metadata generation

### Checkpoint 6: Portfolio Section Validation

- Projects page loads and displays all projects
- Grid/list layout is responsive
- Individual project pages render correctly
- Dynamic routing based on slug functions properly
- Links to GitHub/live demo work correctly

## Phase 7: Blog Section Development with Notion CMS

### Step 1: Notion Setup & Configuration

1. Create a new Notion integration

   - Go to [https://www.notion.so/my-integrations](https://www.notion.so/my-integrations)
   - Create a new integration named "Portfolio Blog"
   - Save the Secret token for API access

2. Create a Notion database for blog posts with these properties:

   - Title (title): Post title
   - Slug (text): URL-friendly identifier
   - Date (date): Publication date
   - Tags (multi-select): Categories/tags
   - Summary (text): Brief description for listings
   - Published (checkbox): To control visibility
   - FeaturedImage (URL): Link to Cloudinary image

3. Share the database with your integration

   - Open your database in Notion
   - Click "Share" in the top right
   - Add your integration using the "Invite" menu

4. Create a few sample blog posts to test with

### Step 2: Notion API Integration

1. Install Notion API packages

   ```bash
   npm install @notionhq/client notion-to-md
   ```

2. Install Markdown rendering packages

   ```bash
   npm install react-markdown remark-gfm rehype-raw rehype-slug react-syntax-highlighter
   ```

3. Add environment variables

   - Update `.env.local` with your Notion credentials

   ```
   NOTION_SECRET=your_secret_token
   NOTION_DATABASE_ID=your_database_id
   REVALIDATION_SECRET=a_random_secret_for_revalidation
   ```

4. Create Notion API utility functions in `lib/notion.ts`

   - Implement `getAllPosts()`: Fetches all published blog posts metadata
   - Implement `getPostBySlug(slug)`: Fetches a specific post's full content
   - Implement `getAllPostSlugs()`: Gets all slugs for static path generation

5. Implement TypeScript types in `lib/types.ts`
   - Add `BlogPostMetadata` interface
   - Add `BlogPost` interface extending metadata with content

### Step 3: Media Handling Strategy

1. Set up Cloudinary for image management

   - Organize with folders: `/blog-images`, `/portfolio-images`, etc.
   - Create upload presets with automatic optimizations
   - Consider setting up eager transformations for key sizes

2. Create a media workflow document with these guidelines:

   - **Images**: Upload to Cloudinary → Use `/image` block in Notion with Cloudinary URL
   - **Videos**: Upload to YouTube → Use `/embed` block in Notion with YouTube URL
   - **GIFs**: Convert to video with Cloudinary → Embed as video
   - **Code**: Use Notion's native code blocks with language specification

3. Create helper utility in `lib/media.ts` for working with media URLs

   ```typescript
   // For responsive Cloudinary images based on screen size
   export function getResponsiveImageUrl(baseUrl, width = 800) {
     return baseUrl.replace("/upload/", `/upload/c_scale,w_${width}/`);
   }

   // For extracting YouTube video IDs
   export function getYouTubeEmbedUrl(youtubeUrl) {
     const regex =
       /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
     const match = youtubeUrl.match(regex);
     return match ? `https://www.youtube.com/embed/${match[1]}` : null;
   }
   ```

### Step 4: Create Blog Components

1. Create Markdown renderer component in `components/Markdown.tsx`

   - Implement custom rendering for all Markdown elements
   - Add syntax highlighting for code blocks
   - Support for Cloudinary images with Next.js Image component
   - Add YouTube/Vimeo video embed handling

2. Create BlogCard component in `components/sections/BlogCard.tsx`

   - Display blog post preview with image, title, date, summary
   - Style with Tailwind CSS matching site design
   - Add hover effects and transitions

3. Create custom media components

   - `components/media/YouTubeEmbed.tsx` for responsive YouTube embeds
   - `components/media/VideoPlayer.tsx` for Cloudinary video playback
   - `components/media/ImageGallery.tsx` for grouping multiple images

4. Create BlogTagFilter component in `components/sections/BlogTagFilter.tsx`
   - Implement client-side tag filtering functionality
   - Create UI for selecting/deselecting tags

### Step 4: Blog List Page

1. Implement blog listing page in `app/blog/page.tsx`

   - Fetch all published posts from Notion
   - Sort posts by date (newest first)
   - Display posts in a responsive grid using BlogCard component
   - Add SEO metadata

2. Add 'use client' components for interactivity

   - Implement client-side search functionality
   - Add tag filtering UI
   - Create sorting options (by date, popularity)

3. Add pagination or "Load More" functionality if needed

### Step 5: Individual Blog Post Page

1. Implement dynamic blog post page in `app/blog/[slug]/page.tsx`

   - Use `getStaticPaths` with `getAllPostSlugs()` to pre-generate paths
   - Fetch full post content with `getPostBySlug()`
   - Convert Notion content to Markdown
   - Render with custom Markdown component

2. Add post metadata display

   - Styled title, date, author info
   - Tag display
   - Featured image
   - Estimated reading time

3. Implement SEO optimization
   - Dynamic metadata based on post content
   - Open Graph tags for social sharing
   - Structured data for search engines

### Step 6: Revalidation & Updates

1. Create revalidation API endpoint in `app/api/revalidate/route.ts`

   - Add security measures to prevent unauthorized revalidation
   - Implement path-based revalidation

2. Set up Incremental Static Regeneration

   - Add revalidation timeframe to static pages

   ```typescript
   export const revalidate = 3600; // Revalidate every hour
   ```

3. Create Notion webhook (optional)
   - Set up a notification trigger in Notion
   - Configure to call your revalidation endpoint when content changes

### Step 7: Media Handling & Styling Integration

1. Implement YouTube video embedding

   ```typescript
   // components/media/YouTubeEmbed.tsx
   'use client';

   interface YouTubeEmbedProps {
     videoId: string;
     title?: string;
   }

   export default function YouTubeEmbed({ videoId, title = 'YouTube video' }: YouTubeEmbedProps) {
     return (
       <div className="aspect-w-16 aspect-h-9 my-8 overflow-hidden rounded-lg">
         <iframe
           src={`https://www.youtube.com/embed/${videoId}`}
           title={title}
           allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
           allowFullScreen
           className="h-full w-full"
         />
       </div>
     );
   }
   ```

2. Enhance Markdown renderer to handle embedded media

   ```typescript
   // Add to your Markdown component
   const renderNotionBlock = (block) => {
     switch (block.type) {
       case 'image':
         return (
           <Image
             src={block.image.url}
             alt={block.image.caption || ''}
             width={800}
             height={500}
             className="rounded-lg my-6"
           />
         );
       case 'video':
         if (block.video.type === 'external' &&
             (block.video.external.url.includes('youtube') ||
              block.video.external.url.includes('youtu.be'))) {
           const videoId = getYouTubeEmbedUrl(block.video.external.url);
           return <YouTubeEmbed videoId={videoId} />;
         }
         // Handle other video types
         return null;
       // Other block types
     }
   };
   ```

3. Create utility functions for media processing

   - Extract YouTube IDs from URLs
   - Transform Cloudinary URLs for responsive sizing
   - Process embedded code blocks with syntax highlighting

4. Ensure blog styling matches the rest of the site

   - Consistent typography system
   - Matching color scheme and components
   - Responsive design across breakpoints

5. Optimize for readability

   - Proper line height and paragraph spacing
   - Good contrast for text
   - Responsive font sizing

6. Add dark/light mode support
   - Style Markdown content for both themes
   - Test all components in both modes

### Step 8: Documentation & Media Guidelines

1. Create a media workflow documentation file

   - Step-by-step guide for adding images to blog posts
   - Instructions for embedding YouTube videos
   - Guidelines for optimizing images before uploading
   - Naming conventions for media files

2. Document Cloudinary setup

   - Upload presets configuration
   - Image transformation presets
   - Folder organization

3. Create a content creation checklist
   - Recommended image sizes and formats
   - Video embedding best practices
   - SEO metadata requirements
   - Accessibility considerations for media

### Checkpoint 7: Blog Section Validation

- Notion API integration works correctly
- Blog page loads and displays all published posts chronologically
- Tag filtering works correctly
- Individual blog posts render Markdown content correctly
- Media handling works properly:
  - Cloudinary images render optimized and responsive
  - YouTube videos embed correctly
  - GIFs converted to video play properly
  - Code blocks have syntax highlighting
- Dynamic routing based on slug functions properly
- Content updates in Notion appear on the site
- Performance optimization with proper caching and ISR
- Media loads efficiently without causing layout shifts
- SEO is properly implemented for both listing and individual posts
- System works in both development and production environments

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
