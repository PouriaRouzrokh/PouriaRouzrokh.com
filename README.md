# PouriaRouzrokh.com

A personal website and portfolio showcasing projects, research, blog posts, and contact information. Built with modern web technologies to provide a responsive and accessible user experience.

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript
- **Styling**: Tailwind CSS, shadcn UI, Radix UI components
- **Content Management**: Notion integration, MDX support
- **Image Handling**: Cloudinary
- **Deployment**: Vercel
- **Other Integrations**: Upstash Redis (rate limiting), Resend (email)

## Core Features

- 📝 **Blog** - Articles and posts with markdown support
- 💼 **Portfolio** - Showcase of projects and work
- 🔬 **Research** - Academic and technical research publications
- 📬 **Contact Form** - Get in touch with form validation and reCAPTCHA
- 🌓 **Dark/Light Mode** - Theme toggle for user preference
- 🛠️ **Maintenance Mode** - Easily toggle site maintenance status

## Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm run start

# Toggle maintenance mode
npm run toggle-maintenance
```

## Deployment

The site is deployed to Vercel. Use the deploy script for a streamlined deployment process:

```bash
./deploy.sh
```

## Requirements

- Node.js 18.17.0 or higher
