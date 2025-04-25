"use client";

import React, { useEffect, useRef } from "react";
import ReCAPTCHA from "react-google-recaptcha";

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
    console.log("[DEBUG] reCAPTCHA initialization with key:", siteKey);
    console.log("[DEBUG] Key prefix:", siteKey.substring(0, 6));
    console.log("[DEBUG] Key length:", siteKey.length);

    if (!siteKey) {
      console.error(
        "ReCAPTCHA site key is missing. Please check your environment configuration."
      );
      return;
    }

    // Execute reCAPTCHA when component mounts
    const executeReCaptcha = async () => {
      if (recaptchaRef.current) {
        try {
          const token = await recaptchaRef.current.executeAsync();
          if (token) {
            onVerify(token);
          } else {
            console.warn("ReCAPTCHA token was empty");
          }
        } catch (error) {
          console.error("ReCAPTCHA execution error:", error);
          // Try to provide a fallback empty token to prevent form blocking
          onVerify("");
        }
      }
    };

    executeReCaptcha();

    // Set timer to refresh the token every 110 seconds (tokens expire after 2 minutes)
    const refreshToken = setInterval(() => {
      executeReCaptcha();
    }, 110000);

    return () => clearInterval(refreshToken);
  }, [onVerify]);

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
