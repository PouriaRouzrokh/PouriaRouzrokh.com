"use client";

import React, { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import ReCAPTCHA from "react-google-recaptcha";
import { submitContactForm } from "@/lib/actions/contact-form-actions";
import {
  ContactFormData,
  consultationAreas,
  contactFormSchema,
} from "@/lib/schemas/contact-form-schema";

// Add type definition for window with grecaptcha
declare global {
  interface Window {
    grecaptcha?: {
      ready: (callback: () => void) => void;
      execute: (
        siteKey: string,
        options: { action: string }
      ) => Promise<string>;
    };
  }
}

export function ContactForm() {
  const recaptchaRef = useRef<ReCAPTCHA>(null);
  const [recaptchaKey, setRecaptchaKey] = useState<string>("");
  const [recaptchaReady, setRecaptchaReady] = useState<boolean>(false);

  // Initialize reCAPTCHA key and script
  useEffect(() => {
    const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || "";
    setRecaptchaKey(siteKey);

    // Load reCAPTCHA script if not already loaded
    if (!window.grecaptcha && siteKey) {
      const script = document.createElement("script");
      script.src = `https://www.google.com/recaptcha/api.js?render=${siteKey}`;
      script.async = true;
      script.defer = true;
      script.onload = () => setRecaptchaReady(true);
      document.body.appendChild(script);
    } else {
      setRecaptchaReady(true);
    }

    return () => {
      // Clean up script when component unmounts
      const script = document.querySelector(`script[src*="recaptcha/api.js"]`);
      if (script) {
        document.body.removeChild(script);
      }
    };
  }, []);

  // Form state management with react-hook-form
  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      subject: "",
      name: "",
      email: "",
      message: "",
      requestConsultation: false,
      consultationAreas: [],
      otherConsultationArea: "",
      honeypot: "",
      recaptchaToken: "",
    },
    mode: "onChange",
  });

  // Form submission states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState<{
    success?: boolean;
    message?: string;
  } | null>(null);

  // Handle form submission
  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    setSubmitResult(null);

    // Temporary debug check - can be removed after fixing the issue
    const isDebug = window.location.search.includes("debug=true");
    if (isDebug) console.log("Form submission started", data);
    if (isDebug) console.log("ReCAPTCHA ready:", recaptchaReady);

    try {
      // Check if reCAPTCHA is ready
      if (!recaptchaReady) {
        setSubmitResult({
          success: false,
          message:
            "ReCAPTCHA is not ready yet. Please wait a moment and try again.",
        });
        setIsSubmitting(false);
        return;
      }

      // Execute reCAPTCHA and get token
      if (!recaptchaRef.current) {
        setSubmitResult({
          success: false,
          message:
            "ReCAPTCHA initialization failed. Please refresh the page and try again.",
        });
        setIsSubmitting(false);
        if (isDebug) console.log("ReCAPTCHA ref is null");
        return;
      }

      if (isDebug) console.log("Executing reCAPTCHA");

      let token;
      try {
        token = await recaptchaRef.current.executeAsync();
      } catch (recaptchaError) {
        console.error("ReCAPTCHA execution error:", recaptchaError);
        setSubmitResult({
          success: false,
          message:
            "ReCAPTCHA verification failed. Please refresh and try again.",
        });
        setIsSubmitting(false);
        return;
      }

      if (isDebug) console.log("ReCAPTCHA token:", token ? "Received" : "None");

      if (!token) {
        setSubmitResult({
          success: false,
          message: "ReCAPTCHA verification failed. Please try again.",
        });
        setIsSubmitting(false);
        return;
      }

      // Add token to form data
      const dataWithToken = {
        ...data,
        recaptchaToken: token,
      };

      if (isDebug) console.log("Submitting form with token");
      const result = await submitContactForm(dataWithToken);
      if (isDebug) console.log("Submission result:", result);
      setSubmitResult(result);

      if (result.success) {
        form.reset();
        // Reset reCAPTCHA
        recaptchaRef.current.reset();
      }
    } catch (error: unknown) {
      console.error("Form submission error:", error);
      setSubmitResult({
        success: false,
        message: "An unexpected error occurred. Please try again later.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get consultation request value for conditional rendering
  const requestsConsultation = form.watch("requestConsultation");

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Submission status message */}
      {submitResult && (
        <div
          className={cn(
            "mb-6 p-4 rounded-md text-center text-sm",
            submitResult.success
              ? "bg-green-50 text-green-800 dark:bg-green-950 dark:text-green-200"
              : "bg-red-50 text-red-800 dark:bg-red-950 dark:text-red-200"
          )}
        >
          {submitResult.message}
        </div>
      )}

      {/* Hidden reCAPTCHA component - only render when key is available and ready */}
      {recaptchaKey && recaptchaReady && (
        <div className="hidden">
          <ReCAPTCHA
            ref={recaptchaRef}
            size="invisible"
            sitekey={recaptchaKey}
          />
        </div>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Honeypot field - hidden from users, but visible to bots */}
          <div className="absolute opacity-0 pointer-events-none">
            <FormField
              control={form.control}
              name="honeypot"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Leave this empty</FormLabel>
                  <FormControl>
                    <Input {...field} tabIndex={-1} />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          {/* Subject field */}
          <FormField
            control={form.control}
            name="subject"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Subject</FormLabel>
                <FormControl>
                  <Input placeholder="What is your inquiry about?" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Name field */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Your full name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Email field */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="Your email address"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Your email will only be used to respond to your inquiry.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Message field */}
          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Message</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Provide details about your inquiry..."
                    className="min-h-[120px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Consultation request checkbox */}
          <FormField
            control={form.control}
            name="requestConsultation"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 mt-4">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Request Consultation</FormLabel>
                  <FormDescription>
                    Check this if you&apos;re interested in consulting services.
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />

          {/* Consultation information - conditional based on requestConsultation checkbox */}
          {requestsConsultation && (
            <>
              <div className="text-sm p-3 border border-amber-200 bg-amber-50 dark:border-amber-900 dark:bg-amber-950/50 rounded-md text-amber-800 dark:text-amber-300">
                <p>
                  <strong>Note:</strong> Consultation sessions are structured as
                  a minimum of one hour at $100 per hour and are subject to
                  availability. Upon review of your request, I will contact you
                  via email to coordinate a suitable time if the consultation is
                  feasible.
                </p>
              </div>

              <div className="space-y-4 p-4 bg-slate-50 dark:bg-slate-900 rounded-md">
                <div className="font-medium">Consultation Areas:</div>
                <FormField
                  control={form.control}
                  name="consultationAreas"
                  render={() => (
                    <FormItem>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {consultationAreas.map((area) => (
                          <FormField
                            key={area}
                            control={form.control}
                            name="consultationAreas"
                            render={({ field }) => {
                              return (
                                <FormItem
                                  key={area}
                                  className="flex flex-row items-start space-x-3 space-y-0"
                                >
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value?.includes(area)}
                                      onCheckedChange={(checked: boolean) => {
                                        const currentValues = field.value || [];
                                        if (checked) {
                                          field.onChange([
                                            ...currentValues,
                                            area,
                                          ]);
                                        } else {
                                          field.onChange(
                                            currentValues.filter(
                                              (value) => value !== area
                                            )
                                          );
                                        }
                                      }}
                                    />
                                  </FormControl>
                                  <FormLabel className="text-sm font-normal cursor-pointer">
                                    {area}
                                  </FormLabel>
                                </FormItem>
                              );
                            }}
                          />
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Other consultation area - conditional based on "Other" being selected */}
                {form.watch("consultationAreas")?.includes("Other") && (
                  <FormField
                    control={form.control}
                    name="otherConsultationArea"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Other Area (please specify)</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Specify other consultation area"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </div>
            </>
          )}

          <Separator className="my-6" />

          {/* Submit button */}
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Sending..." : "Send Message"}
          </Button>

          <div className="text-xs text-center text-gray-500 mt-2">
            This site is protected by reCAPTCHA and the Google
            <a
              href="https://policies.google.com/privacy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 mx-1"
            >
              Privacy Policy
            </a>{" "}
            and
            <a
              href="https://policies.google.com/terms"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 mx-1"
            >
              Terms of Service
            </a>{" "}
            apply.
          </div>
        </form>
      </Form>
    </div>
  );
}
