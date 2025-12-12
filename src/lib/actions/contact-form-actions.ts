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

// Initialize Redis client for rate limiting (only if credentials are available)
const redis =
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
    ? new Redis({
        url: process.env.UPSTASH_REDIS_REST_URL,
        token: process.env.UPSTASH_REDIS_REST_TOKEN,
      })
    : null;

// Create rate limiter for IP-based rate limiting (5 submissions per day)
const ipRatelimit = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(25, "1d"),
      prefix: "ratelimit:ip",
    })
  : null;

// Create rate limiter for daily submission count (25 submissions per day)
const dailyEmailLimit = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.fixedWindow(50, "1d"),
      prefix: "ratelimit:daily",
    })
  : null;

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

// Validate required environment variables
function validateEnvironmentVariables(): {
  isValid: boolean;
  missingVars: string[];
} {
  const requiredVars = ["RESEND_API_KEY", "CONTACT_RECIPIENT_EMAIL"];

  const missingVars = requiredVars.filter((varName) => !process.env[varName]);

  return {
    isValid: missingVars.length === 0,
    missingVars,
  };
}

// Verify reCAPTCHA token with Google
async function verifyRecaptcha(token: string): Promise<boolean> {
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
        }).toString(),
      }
    );

    const data = await response.json();

    if (!data.success) {
      console.error("reCAPTCHA verification failed:", data["error-codes"]);
      return false;
    }

    // Google recommends checking the score for v3
    // A score of 0.5 or higher is typically considered human behavior
    if (data.score < 0.5) {
      console.warn("reCAPTCHA score too low:", data.score);
      return false;
    }

    return true;
  } catch (error) {
    console.error("reCAPTCHA verification error:", error);
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
    // Validate required environment variables
    const envValidation = validateEnvironmentVariables();
    if (!envValidation.isValid) {
      console.error(
        "Missing required environment variables:",
        envValidation.missingVars
      );
      return {
        success: false,
        message:
          "The contact form is not properly configured. Please contact the administrator.",
      };
    }

    // Validate form data against schema
    const validatedData = contactFormSchema.parse(formData);

    // Get client IP for rate limiting
    const headersList = await headers();
    const ip = headersList.get("x-forwarded-for")?.split(",")[0] || "127.0.0.1";

    // Verify reCAPTCHA
    if (validatedData.recaptchaToken) {
      const isRecaptchaValid = await verifyRecaptcha(
        validatedData.recaptchaToken
      );

      if (!isRecaptchaValid) {
        return {
          success: false,
          message: "reCAPTCHA verification failed. Please try again.",
        };
      }
    } else if (process.env.NODE_ENV === "production") {
      // In production, require reCAPTCHA token
      return {
        success: false,
        message:
          "reCAPTCHA verification failed. Please ensure JavaScript is enabled and try again.",
      };
    }

    // Check IP-based rate limit (only if Redis is available)
    if (ipRatelimit) {
      const ipRateLimit = await ipRatelimit.limit(ip);
      if (!ipRateLimit.success) {
        return {
          success: false,
          message:
            "You've reached the maximum number of submissions for today. Please try again tomorrow.",
        };
      }
    }

    // Check daily email count limit (only if Redis is available)
    if (dailyEmailLimit) {
      const dailyLimit = await dailyEmailLimit.limit("global");
      if (!dailyLimit.success) {
        return {
          success: false,
          message:
            "We've reached our daily message limit. Please try again tomorrow.",
        };
      }
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
      console.error("Contact form error:", error.message, error.stack);

      // Check for specific error types to provide better user feedback
      if (error.message.includes("RESEND_API_KEY")) {
        return {
          success: false,
          message:
            "Email service is not configured. Please contact the administrator.",
        };
      }

      if (error.message.includes("UPSTASH")) {
        return {
          success: false,
          message:
            "Rate limiting service is not configured. Please try again later.",
        };
      }

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
