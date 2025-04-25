"use client";

import React, { useEffect, useRef } from "react";
import ReCAPTCHA from "react-google-recaptcha";

// Add type definition for window.grecaptcha
declare global {
  interface Window {
    grecaptcha: {
      ready: (callback: () => void) => void;
      execute: (
        siteKey: string,
        options: { action: string }
      ) => Promise<string>;
    };
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

    // Ensure Google reCAPTCHA API is fully loaded before executing
    const loadAndExecuteReCaptcha = () => {
      // Make sure window.grecaptcha is fully loaded and initialized
      if (
        typeof window !== "undefined" &&
        window.grecaptcha &&
        window.grecaptcha.ready
      ) {
        window.grecaptcha.ready(async () => {
          try {
            // Execute directly using the grecaptcha global to avoid iframe context issues
            const token = await window.grecaptcha.execute(siteKey, {
              action: "submit",
            });
            if (token) {
              onVerify(token);
            } else {
              console.warn("reCAPTCHA token was empty");
            }
          } catch (error) {
            console.error("reCAPTCHA execution error:", error);
            onVerify("");
          }
        });
      } else {
        // If not ready yet, wait and try again
        setTimeout(loadAndExecuteReCaptcha, 100);
      }
    };

    // Begin the execution process
    loadAndExecuteReCaptcha();

    // Set timer to refresh the token every 110 seconds (tokens expire after 2 minutes)
    const refreshToken = setInterval(() => {
      loadAndExecuteReCaptcha();
    }, 110000);

    return () => clearInterval(refreshToken);
  }, [onVerify]);

  // We still need this for initialization, but we'll use window.grecaptcha for execution
  return (
    <div>
      <ReCAPTCHA
        ref={recaptchaRef}
        size="invisible"
        badge="bottomright"
        sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || ""}
      />
    </div>
  );
}
