import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms and Conditions | Pouria Rouzrokh",
  description:
    "Terms and conditions for PRouz Assistant, a personal AI assistant operated by Pouria Rouzrokh.",
  alternates: {
    canonical: "/terms",
  },
};

export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-2">Terms and Conditions</h1>
        <p className="text-muted-foreground mb-8">
          Effective date: February 15, 2026
        </p>

        <div className="prose prose-lg dark:prose-invert">
          <h2 className="text-2xl font-semibold mb-4">Program</h2>
          <p className="mb-6">
            PRouz Assistant is a personal AI assistant that sends SMS
            notifications to the account holder, Pouria Rouzrokh. It is not a
            commercial service and is not available to the general public.
          </p>

          <h2 className="text-2xl font-semibold mb-4">Message Frequency</h2>
          <p className="mb-6">
            Message frequency varies. Typically, a few messages are sent per
            day. Message and data rates may apply.
          </p>

          <h2 className="text-2xl font-semibold mb-4">Opting Out</h2>
          <p className="mb-6">
            To stop receiving messages, reply{" "}
            <strong className="text-foreground">STOP</strong> at any time. This
            will cancel all future SMS notifications from PRouz Assistant.
          </p>

          <h2 className="text-2xl font-semibold mb-4">Getting Help</h2>
          <p className="mb-6">
            For assistance, reply{" "}
            <strong className="text-foreground">HELP</strong> to any message.
            You can also reach out via the{" "}
            <a
              href="/contact"
              className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
            >
              contact page
            </a>
            .
          </p>

          <h2 className="text-2xl font-semibold mb-4">Support</h2>
          <p>
            For questions about these terms or the PRouz Assistant program,
            please visit the{" "}
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
