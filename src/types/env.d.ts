declare namespace NodeJS {
  interface ProcessEnv {
    NEXT_PUBLIC_RECAPTCHA_SITE_KEY: string;
    RECAPTCHA_SECRET_KEY: string;
    RESEND_API_KEY: string;
    UPSTASH_REDIS_REST_URL: string;
    UPSTASH_REDIS_REST_TOKEN: string;
    CONTACT_FROM_EMAIL: string;
    CONTACT_RECIPIENT_EMAIL: string;
  }
}
