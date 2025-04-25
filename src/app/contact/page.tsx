"use client";

import React, { useEffect } from "react";
import type { Metadata } from "next";
import { ContactForm } from "@/components/forms/ContactForm";
import { Separator } from "@/components/ui/separator";

// Define metadata for SEO
export const metadata: Metadata = {
  title: "Contact | Pouria AI",
  description:
    "Get in touch with Pouria for inquiries or consultation requests.",
  alternates: {
    canonical: "/contact",
  },
  openGraph: {
    title: "Contact Pouria",
    description:
      "Get in touch with Pouria for inquiries or consultation requests.",
    url: "/contact",
  },
};

export default function ContactPage() {
  // Log environment variable for debugging
  useEffect(() => {
    console.log(
      "NEXT_PUBLIC_RECAPTCHA_SITE_KEY:",
      process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY
    );
    console.log(
      "Key length:",
      process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY?.length
    );
  }, []);

  return (
    <div className="container max-w-4xl py-12 px-4 sm:px-6 lg:px-8">
      <div className="space-y-6">
        <div className="space-y-3">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
            Contact
          </h1>
          <p className="text-muted-foreground text-lg">
            Have a question or want to discuss a potential collaboration? Use
            the form below to get in touch.
          </p>
        </div>

        <Separator className="my-6" />

        <div className="space-y-6">
          <div className="bg-card rounded-lg border p-6 shadow-sm">
            <ContactForm />
          </div>

          <div className="mt-8 text-sm text-muted-foreground">
            <p>
              Your information is securely handled and will only be used to
              respond to your inquiry. Please allow 2-3 business days for a
              response.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
