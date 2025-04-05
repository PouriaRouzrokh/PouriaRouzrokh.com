import React from "react";
import Script from "next/script";

interface JsonLdProps {
  data: object;
}

export const JsonLd: React.FC<JsonLdProps> = ({ data }) => {
  return (
    <Script
      id={`json-ld-${Math.random().toString(36).substring(2, 9)}`}
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
      strategy="afterInteractive"
    />
  );
};
