"use client";

import React, { useEffect, useRef } from "react";
import ReCAPTCHA from "react-google-recaptcha";

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
    recaptchaCallback?: () => void;
  }
}

interface ReCaptchaProps {
  onVerify: (token: string) => void;
}

/**
 * ReCaptcha component for form protection
 * @param onVerify Function called when captcha is verified with the token
 */
export function ReCaptcha({ onVerify }: ReCaptchaProps) {
  const recaptchaRef = useRef<ReCAPTCHA>(null);

  useEffect(() => {
    // Check if the site key is available
    const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || "";
    if (!siteKey) {
      console.error(
        "ReCAPTCHA site key is missing. Please check your environment configuration."
      );
      return;
    }

    // Load reCAPTCHA script directly to ensure proper domain context
    const loadRecaptchaScript = () => {
      if (typeof window.grecaptcha === "undefined") {
        // Only load script if grecaptcha is not already defined
        window.recaptchaCallback = () => {
          executeReCaptcha();
        };

        const script = document.createElement("script");
        script.src = `https://www.google.com/recaptcha/api.js?render=${siteKey}`;
        script.async = true;
        script.defer = true;
        document.head.appendChild(script);
      } else {
        executeReCaptcha();
      }
    };

    const executeReCaptcha = () => {
      if (window.grecaptcha && window.grecaptcha.ready) {
        window.grecaptcha.ready(() => {
          window
            .grecaptcha!.execute(siteKey, { action: "contact_form" })
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

    loadRecaptchaScript();

    // Set timer to refresh the token every 110 seconds (tokens expire after 2 minutes)
    const refreshToken = setInterval(() => {
      executeReCaptcha();
    }, 110000);

    return () => {
      clearInterval(refreshToken);
      // Clean up global callback
      if (window.recaptchaCallback) {
        delete window.recaptchaCallback;
      }
    };
  }, [onVerify]);

  // The hidden ReCAPTCHA component is now only for fallback compatibility
  return (
    <div className="hidden">
      <ReCAPTCHA
        ref={recaptchaRef}
        size="invisible"
        sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || ""}
      />
    </div>
  );
}
