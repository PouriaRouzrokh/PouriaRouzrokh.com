import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | Pouria Rouzrokh",
  description:
    "Privacy policy for PRouz, a personal AI assistant operated by Pouria Rouzrokh.",
  alternates: {
    canonical: "/privacy",
  },
};

export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-2">Privacy Policy</h1>
        <p className="text-muted-foreground mb-8">
          Effective date: February 15, 2026
        </p>

        <div className="prose prose-lg dark:prose-invert">
          <h2 className="text-2xl font-semibold mb-4">Overview</h2>
          <p className="mb-6">
            PRouz is a personal AI assistant operated solely by Pouria Rouzrokh.
            It sends SMS notifications — including task reminders, schedule
            notifications, and informational alerts — to a single phone number
            owned by Pouria Rouzrokh. PRouz is not a commercial product or
            service offered to the public.
          </p>

          <h2 className="text-2xl font-semibold mb-4">Data Collection</h2>
          <p className="mb-6">
            PRouz does not collect personal data from third parties. The only
            phone number that receives messages belongs to the account holder
            (Pouria Rouzrokh). No information is gathered from external users or
            visitors.
          </p>

          <h2 className="text-2xl font-semibold mb-4">
            Data Sharing & Selling
          </h2>
          <p className="mb-6">
            No data is shared with, sold to, or disclosed to any third parties.
          </p>

          <h2 className="text-2xl font-semibold mb-4">Message Content</h2>
          <p className="mb-6">
            Messages sent by PRouz may include task reminders, schedule
            notifications, and informational alerts. All messages are intended
            for personal use by the account holder.
          </p>

          <h2 className="text-2xl font-semibold mb-4">Contact</h2>
          <p>
            If you have questions about this privacy policy, please reach out
            via the{" "}
            <a
              href="/contact"
              className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
            >
              contact page
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
