# PouriaRouzrokh.com

A personal website and portfolio showcasing projects, research, blog posts, and contact information. Built with modern web technologies to provide a responsive and accessible user experience.

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript
- **Styling**: Tailwind CSS, shadcn UI, Radix UI components
- **Content Management**: Notion integration, MDX support
- **Image Handling**: Cloudinary
- **Deployment**: Vercel
- **Other Integrations**: Upstash Redis (rate limiting), Resend (email), Google reCAPTCHA v3

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

## Configuration

### Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```
# reCAPTCHA v3 keys
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=your_recaptcha_site_key
RECAPTCHA_SECRET_KEY=your_recaptcha_secret_key

# Email service (Resend.com)
RESEND_API_KEY=your_resend_api_key
CONTACT_FROM_EMAIL=noreply@yourwebsite.com
CONTACT_RECIPIENT_EMAIL=you@yourwebsite.com

# Rate limiting (Upstash Redis)
UPSTASH_REDIS_REST_URL=your_upstash_redis_url
UPSTASH_REDIS_REST_TOKEN=your_upstash_redis_token
```

### reCAPTCHA v3 Setup

1. Go to the [Google reCAPTCHA Admin Console](https://www.google.com/recaptcha/admin)
2. Register a new site
3. Choose reCAPTCHA v3
4. Add your domain(s)
5. Accept the Terms of Service
6. Copy the Site Key to `NEXT_PUBLIC_RECAPTCHA_SITE_KEY`
7. Copy the Secret Key to `RECAPTCHA_SECRET_KEY`

## Deployment

The site is deployed to Vercel. Use the deploy script for a streamlined deployment process:

```bash
./deploy.sh
```

## Requirements

- Node.js 18.17.0 or higher
