import { z } from "zod";

// Array of consultation areas
export const consultationAreas = [
  "Research",
  "AI Development",
  "AI Engineering",
  "US Residency and Match",
  "Research Fellowship Application",
  "Radiology AI",
  "Clinical AI",
  "Other",
] as const;

// Type for consultation areas
export type ConsultationArea = (typeof consultationAreas)[number];

// Contact form schema with validation
export const contactFormSchema = z
  .object({
    subject: z
      .string()
      .min(1, "Subject is required")
      .max(100, "Subject must be less than 100 characters"),
    name: z
      .string()
      .min(1, "Name is required")
      .max(100, "Name must be less than 100 characters"),
    email: z
      .string()
      .min(1, "Email is required")
      .email("Please enter a valid email address"),
    message: z
      .string()
      .min(10, "Message must be at least 10 characters")
      .max(1000, "Message must be less than 1000 characters"),
    requestConsultation: z.boolean().default(false),
    consultationAreas: z.array(z.enum(consultationAreas)).optional(),
    otherConsultationArea: z.string().optional(),
    honeypot: z.string().max(0, "This field should be left empty"),
    recaptchaToken: z.string().optional(),
  })
  .refine(
    (data) => {
      // If consultation is requested, at least one area must be selected
      return (
        !data.requestConsultation ||
        (data.consultationAreas && data.consultationAreas.length > 0)
      );
    },
    {
      message: "Please select at least one consultation area",
      path: ["consultationAreas"],
    }
  );

// Type for the contact form
export type ContactFormData = z.infer<typeof contactFormSchema>;

// Type for the contact form submission response
export type ContactFormResponse = {
  success: boolean;
  message: string;
  errors?: {
    [key: string]: string[];
  };
};
