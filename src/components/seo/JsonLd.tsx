"use client";

import React from "react";
import Script from "next/script";

interface JsonLdProps {
  data: Record<string, unknown>;
}

export const JsonLd: React.FC<JsonLdProps> = ({ data }) => {
  // Stable, SSR-consistent id (avoids hydration mismatch from Math.random)
  const id = React.useId();

  // Safely stringify the JSON-LD data, handling circular references
  const safeStringify = (obj: Record<string, unknown>): string => {
    // Handle circular references
    const seen = new WeakSet();
    return JSON.stringify(obj, (key, value) => {
      if (typeof value === "object" && value !== null) {
        if (seen.has(value)) {
          return undefined; // Remove circular reference
        }
        seen.add(value);
      }
      return value;
    });
  };

  return (
    <Script
      id={`json-ld-${id}`}
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: safeStringify(data) }}
      strategy="afterInteractive"
    />
  );
};
