# Contact Form Setup and Maintenance Guide

This document provides instructions for setting up, configuring, and maintaining the contact form for the pouria.ai portfolio website.

## Setup Instructions

### 1. Environment Variables

The contact form requires the following environment variables to be set:

```
# Contact Form
RESEND_API_KEY="your_resend_api_key"
CONTACT_RECIPIENT_EMAIL="your_email@domain.com"
CONTACT_FROM_EMAIL="noreply@yourdomain.com"
NEXT_PUBLIC_RECAPTCHA_SITE_KEY="your_recaptcha_site_key"
RECAPTCHA_SECRET_KEY="your_recaptcha_secret_key"

# Rate Limiting
UPSTASH_REDIS_REST_URL="your_upstash_redis_url"
UPSTASH_REDIS_REST_TOKEN="your_upstash_redis_token"
```

### 2. Resend Email Service

1. Create an account at [Resend.com](https://resend.com)
2. Verify ownership of your domain (pouria.ai)
3. Generate an API key in the Resend dashboard
4. Add the API key to your environment variables

### 3. Google reCAPTCHA

1. Go to the [reCAPTCHA Admin Console](https://www.google.com/recaptcha/admin)
2. Register a new site with the following settings:
   - Label: Pouria AI Contact Form
   - reCAPTCHA type: reCAPTCHA v3
   - Domains: pouria.ai (and any test domains)
3. Add the site key and secret key to your environment variables

### 4. Upstash Redis for Rate Limiting

1. Create an account at [Upstash.com](https://upstash.com)
2. Create a new Redis database
3. Under "REST API" section, copy the URL and Token
4. Add these values to your environment variables

### 5. Deploy to Production

After configuring all services, deploy the site to production:

```bash
npm run build
# Deploy using your preferred hosting platform (Vercel, Netlify, etc.)
```

## Form Configuration

### Consultation Areas

The consultation areas are defined in `src/lib/schemas/contact-form-schema.ts`.
To modify the available consultation areas:

```typescript
export const consultationAreas = [
  "Research",
  "AI Development",
  "AI Engineering",
  "US Residency and Match",
  "Research Fellowship Application",
  "Radiology AI",
  "Clinical AI",
  "Other",
] as const;
```

### Form Validation Rules

Form validation rules are defined using Zod in the same file:

- Subject: Required, max 100 characters
- Name: Required, max 100 characters
- Email: Required, valid email format
- Message: Required, min 10 characters, max 1000 characters
- Consultation Areas: Required if consultation is requested

## Security Features

The contact form includes several security features:

1. **reCAPTCHA**: Protects against bots
2. **Rate Limiting**:
   - IP-based: 5 submissions per day per IP address
   - Global: 25 submissions per day across all users
3. **Honeypot Trap**: Hidden field to catch automated submissions
4. **Spam Filtering**: Text content is checked against common spam patterns
5. **Server-side Validation**: All form data is validated on the server

## Maintenance

### Monitoring Submissions

The contact form logs successful and failed submissions to the console. In a production environment, consider setting up proper logging (e.g., to a service like Logtail, Datadog, or similar).

### Updating Spam Filters

The spam filter patterns are defined in `src/lib/actions/contact-form-actions.ts`:

```typescript
const spamPatterns = [
  /\b(viagra|cialis|casino|porn|sex|xxx)\b/i,
  /\b(loan|investment|bitcoin|crypto|make money)\b/i,
  /https?:\/\/\S+/g, // URLs are often in spam
];
```

Add new patterns as needed to filter out new types of spam.

### Adjusting Rate Limits

To adjust the rate limits, modify the following code in `src/lib/actions/contact-form-actions.ts`:

```typescript
// For IP-based rate limiting (currently 5 per day per IP)
const ipRatelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, "1d"),
  prefix: "ratelimit:ip",
});

// For global rate limiting (currently 25 per day total)
const dailyEmailLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.fixedWindow(25, "1d"),
  prefix: "ratelimit:daily",
});
```

## Troubleshooting

### Common Issues

1. **Email Delivery Failures**:

   - Check Resend dashboard for delivery issues
   - Verify the recipient email address is correct
   - Ensure your domain is properly verified in Resend

2. **reCAPTCHA Issues**:

   - Verify site and secret keys are correct
   - Check that the domain is registered with reCAPTCHA
   - Test in incognito mode to rule out browser extensions

3. **Rate Limiting Problems**:
   - Check Upstash Redis console for connection issues
   - Verify rate limit keys are being set correctly
4. **Form Validation Errors**:
   - Examine server logs for validation error details
   - Check browser console for client-side validation errors
