"use server";

import { Resend } from "resend";
import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit";
import {
  ContactFormData,
  contactFormSchema,
} from "../schemas/contact-form-schema";
import { headers } from "next/headers";

// Initialize Resend client
const resend = new Resend(process.env.RESEND_API_KEY);

// Initialize Redis client for rate limiting
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL || "",
  token: process.env.UPSTASH_REDIS_REST_TOKEN || "",
});

// Create rate limiter for IP-based rate limiting (5 submissions per day)
const ipRatelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, "1d"),
  prefix: "ratelimit:ip",
});

// Create rate limiter for daily submission count (25 submissions per day)
const dailyEmailLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.fixedWindow(25, "1d"),
  prefix: "ratelimit:daily",
});

// Spam patterns to filter out
const spamPatterns = [
  /\b(viagra|cialis|casino|porn|sex|xxx)\b/i,
  /\b(loan|investment|bitcoin|crypto|make money)\b/i,
  /https?:\/\/\S+/g, // URLs are often in spam
];

// Function to check if text contains spam patterns
function containsSpam(text: string): boolean {
  return spamPatterns.some((pattern) => pattern.test(text));
}

// Format consultation areas for email
function formatConsultationAreas(data: ContactFormData): string {
  if (!data.requestConsultation || !data.consultationAreas?.length) {
    return "No consultation requested";
  }

  let areas = data.consultationAreas.join(", ");

  if (data.consultationAreas.includes("Other") && data.otherConsultationArea) {
    areas += ` (${data.otherConsultationArea})`;
  }

  return areas;
}

// Verify reCAPTCHA token
async function verifyRecaptcha(token: string, ip: string): Promise<boolean> {
  try {
    const recaptchaSecret = process.env.RECAPTCHA_SECRET_KEY;
    if (!recaptchaSecret) {
      console.error("reCAPTCHA secret key is not configured");
      return false;
    }

    const response = await fetch(
      "https://www.google.com/recaptcha/api/siteverify",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          secret: recaptchaSecret,
          response: token,
          remoteip: ip,
        }),
      }
    );

    const data = await response.json();

    if (!data.success) {
      console.error("reCAPTCHA verification failed:", data["error-codes"]);
      return false;
    }

    // For v3, check the score (0.0 is bot, 1.0 is human)
    if (data.score < 0.5) {
      console.error("reCAPTCHA score too low:", data.score);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error verifying reCAPTCHA:", error);
    return false;
  }
}

export async function submitContactForm(formData: ContactFormData) {
  // Check if honeypot field is filled (bot detection)
  if (formData.honeypot) {
    // Return success to avoid alerting bots, but don't send email
    return {
      success: true,
      message: "Your message has been sent successfully!",
    };
  }

  try {
    // Validate form data against schema
    const validatedData = contactFormSchema.parse(formData);

    // Get client IP for rate limiting
    const headersList = headers();
    const ip = headersList.get("x-forwarded-for")?.split(",")[0] || "127.0.0.1";

    // Verify reCAPTCHA
    const isRecaptchaValid = await verifyRecaptcha(
      validatedData.recaptchaToken,
      ip
    );
    if (!isRecaptchaValid) {
      return {
        success: false,
        message: "reCAPTCHA verification failed. Please try again.",
      };
    }

    // Check IP-based rate limit
    const ipRateLimit = await ipRatelimit.limit(ip);
    if (!ipRateLimit.success) {
      return {
        success: false,
        message:
          "You've reached the maximum number of submissions for today. Please try again tomorrow.",
      };
    }

    // Check daily email count limit
    const dailyLimit = await dailyEmailLimit.limit("global");
    if (!dailyLimit.success) {
      return {
        success: false,
        message:
          "We've reached our daily message limit. Please try again tomorrow.",
      };
    }

    // Check for spam content in message and subject
    if (
      containsSpam(validatedData.message) ||
      containsSpam(validatedData.subject)
    ) {
      return {
        success: false,
        message:
          "Your message appears to contain prohibited content. Please review and try again.",
      };
    }

    // Format the email content
    const emailContent = `
      <h2>New Contact Form Submission</h2>
      <p><strong>Subject:</strong> ${validatedData.subject}</p>
      <p><strong>Name:</strong> ${validatedData.name}</p>
      <p><strong>Email:</strong> ${validatedData.email}</p>
      <p><strong>Consultation:</strong> ${validatedData.requestConsultation ? "Yes" : "No"}</p>
      ${validatedData.requestConsultation ? `<p><strong>Consultation Areas:</strong> ${formatConsultationAreas(validatedData)}</p>` : ""}
      <h3>Message:</h3>
      <p>${validatedData.message.replace(/\n/g, "<br/>")}</p>
    `;

    // Send email using Resend
    const { data, error } = await resend.emails.send({
      from: `Contact Form <${process.env.CONTACT_FROM_EMAIL || "noreply@PouriaRouzrokh.com"}>`,
      to: process.env.CONTACT_RECIPIENT_EMAIL || "",
      subject: `[Contact Form] ${validatedData.subject}`,
      html: emailContent,
      replyTo: validatedData.email,
    });

    if (error) {
      console.error("Email sending error:", error);
      return {
        success: false,
        message: "Failed to send your message. Please try again later.",
      };
    }

    // Log successful submission
    console.log("Contact form submitted successfully:", {
      id: data?.id,
      email: validatedData.email,
      subject: validatedData.subject,
      date: new Date().toISOString(),
    });

    return {
      success: true,
      message:
        "Your message has been sent successfully! I'll get back to you as soon as possible.",
    };
  } catch (error) {
    if (error instanceof Error) {
      console.error("Contact form error:", error.message);
      return {
        success: false,
        message:
          "There was an error processing your submission. Please check your inputs and try again.",
      };
    }

    console.error("Unknown contact form error:", error);
    return {
      success: false,
      message: "An unexpected error occurred. Please try again later.",
    };
  }
}
