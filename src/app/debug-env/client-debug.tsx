"use client";

import { useEffect, useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";

export default function ClientDebug() {
  const [recaptchaLoaded, setRecaptchaLoaded] = useState(false);
  const [recaptchaError, setRecaptchaError] = useState<string | null>(null);

  useEffect(() => {
    // Log some debug info
    console.log("Client debug component mounted");
    console.log(
      "NEXT_PUBLIC_RECAPTCHA_SITE_KEY:",
      process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY ? "Set" : "Not set"
    );
  }, []);

  const handleRecaptchaLoad = () => {
    console.log("reCAPTCHA loaded successfully");
    setRecaptchaLoaded(true);
  };

  const handleRecaptchaError = () => {
    console.error("reCAPTCHA failed to load");
    setRecaptchaError("Failed to load reCAPTCHA");
  };

  return (
    <div className="mt-8">
      <h2 className="text-xl font-bold mb-4">Client-Side Environment Check</h2>

      <div className="bg-slate-100 p-4 rounded-md mb-4">
        <h3 className="font-semibold mb-2">reCAPTCHA Test</h3>
        <p className="mb-4">
          <strong>NEXT_PUBLIC_RECAPTCHA_SITE_KEY:</strong>{" "}
          {process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY ? "Set" : "Not set"}
        </p>

        <div className="mb-4">
          <p className="mb-2">reCAPTCHA Test Load:</p>
          <ReCAPTCHA
            sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || ""}
            onChange={() => {}}
            onLoad={handleRecaptchaLoad}
            onErrored={handleRecaptchaError}
          />
        </div>

        <div>
          <p>Status: {recaptchaLoaded ? "Loaded ✅" : "Not loaded"}</p>
          {recaptchaError && (
            <p className="text-red-500">Error: {recaptchaError}</p>
          )}
        </div>
      </div>
    </div>
  );
}
