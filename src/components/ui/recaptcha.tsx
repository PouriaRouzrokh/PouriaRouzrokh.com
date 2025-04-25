"use client";

import { useEffect } from "react";

// Define window interface extensions for reCAPTCHA
declare global {
  interface Window {
    grecaptcha?: {
      ready: (callback: () => void) => void;
      execute: (
        siteKey: string,
        options: { action: string }
      ) => Promise<string>;
    };
    recaptchaLoaded?: boolean;
  }
}

interface ReCaptchaProps {
  onVerify: (token: string) => void;
}

/**
 * ReCaptcha component for form protection using Google reCAPTCHA v3
 * @param onVerify Function called when captcha is verified with the token
 */
export function ReCaptcha({ onVerify }: ReCaptchaProps) {
  useEffect(() => {
    // Check if the site key is available
    const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || "";
    if (!siteKey) {
      console.error(
        "ReCAPTCHA site key is missing. Please check your environment configuration."
      );
      return;
    }

    // Function to execute reCAPTCHA and get a token
    const executeReCaptcha = () => {
      if (window.grecaptcha && window.grecaptcha.ready) {
        window.grecaptcha.ready(() => {
          window
            .grecaptcha!.execute(siteKey, { action: "submit" })
            .then((token: string) => {
              if (token) {
                onVerify(token);
              }
            })
            .catch((error: Error) => {
              console.error("reCAPTCHA execution error:", error);
              onVerify("");
            });
        });
      }
    };

    // Only load the script if it hasn't been loaded already
    if (
      !window.grecaptcha &&
      !document.querySelector('script[src*="recaptcha/api.js"]')
    ) {
      // Set a flag to prevent multiple loads
      window.recaptchaLoaded = true;

      // Create and add the script
      const script = document.createElement("script");
      script.src = `https://www.google.com/recaptcha/api.js?render=${siteKey}`;
      script.async = true;
      script.defer = true;

      // Execute reCAPTCHA once the script is loaded
      script.onload = () => {
        executeReCaptcha();
      };

      document.head.appendChild(script);
    } else if (window.grecaptcha) {
      // If script is already loaded, execute reCAPTCHA
      executeReCaptcha();
    }

    // Set timer to refresh the token every 110 seconds (tokens expire after 2 minutes)
    const refreshToken = setInterval(() => {
      executeReCaptcha();
    }, 110000);

    return () => {
      clearInterval(refreshToken);
    };
  }, [onVerify]);

  // No need for a visible component anymore
  return null;
}
