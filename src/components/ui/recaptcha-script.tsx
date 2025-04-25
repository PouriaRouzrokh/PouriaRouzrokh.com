"use client";

import React, { useEffect } from "react";
import Script from "next/script";

/**
 * Component to load the reCAPTCHA script properly
 * This ensures the script is loaded in the right order and context
 */
export default function ReCaptchaScript() {
  // Get the site key
  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || "";

  useEffect(() => {
    // Log if the site key is missing
    if (!siteKey) {
      console.error(
        "ReCAPTCHA site key is missing. Please check your environment configuration."
      );
    }
  }, [siteKey]);

  return (
    <>
      {/* Using Next.js Script component with strategy="afterInteractive" ensures proper loading */}
      <Script
        src={`https://www.google.com/recaptcha/api.js?render=${siteKey}`}
        strategy="afterInteractive"
        onError={(e) => {
          console.error("Error loading reCAPTCHA script:", e);
        }}
      />
    </>
  );
}
