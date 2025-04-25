"use client";

import { useEffect } from "react";

// Define window interface extensions for reCAPTCHA v3
declare global {
  interface Window {
    grecaptcha?: {
      ready: (callback: () => void) => void;
      execute: (
        siteKey: string,
        options: { action: string }
      ) => Promise<string>;
    };
    PouriaRouzrokhRecaptchaLoaded?: boolean; // Using a unique name to avoid conflicts
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
    // Use unique identifier for script to avoid conflicts
    const SCRIPT_ID = "pouria-rouzrokh-recaptcha-script";

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
      // Make sure grecaptcha is defined before trying to use it
      if (window.grecaptcha && window.grecaptcha.ready) {
        window.grecaptcha.ready(() => {
          try {
            window
              .grecaptcha!.execute(siteKey, { action: "submit" })
              .then((token: string) => {
                if (token) {
                  onVerify(token);
                }
              })
              .catch((error: Error) => {
                console.error("reCAPTCHA execution error:", error);
                onVerify(""); // Pass empty token to prevent form blocking
              });
          } catch (err) {
            console.error("Error executing reCAPTCHA:", err);
            onVerify(""); // Pass empty token to prevent form blocking
          }
        });
      }
    };

    // Only load the script if it hasn't been loaded already
    if (
      !window.grecaptcha &&
      !document.getElementById(SCRIPT_ID) &&
      !window.PouriaRouzrokhRecaptchaLoaded
    ) {
      // Set a flag to prevent multiple loads
      window.PouriaRouzrokhRecaptchaLoaded = true;

      // Create and add the script with a unique ID
      const script = document.createElement("script");
      script.id = SCRIPT_ID;
      script.src = `https://www.google.com/recaptcha/api.js?render=${siteKey}`;
      script.async = true;
      script.defer = true;

      // Execute reCAPTCHA once the script is loaded
      script.onload = () => {
        // Wait a moment for grecaptcha to initialize fully
        setTimeout(() => {
          executeReCaptcha();
        }, 1000);
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

  // No need for a visible component
  return null;
}
