import { headers } from "next/headers";
import ClientDebug from "./client-debug";

export default function DebugEnvPage() {
  const headersList = headers();
  const host = headersList.get("host") || "localhost";

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-4">Environment Variables Debug</h1>

      <div className="bg-slate-100 p-4 rounded-md mb-4">
        <h2 className="font-semibold mb-2">reCAPTCHA Configuration (Server)</h2>
        <p>
          <strong>NEXT_PUBLIC_RECAPTCHA_SITE_KEY:</strong>{" "}
          {process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY
            ? `Set (${process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY.substring(0, 5)}...)`
            : "Not set"}
        </p>
        <p>
          <strong>RECAPTCHA_SECRET_KEY:</strong>{" "}
          {process.env.RECAPTCHA_SECRET_KEY
            ? "Set (first 5 chars hidden for security)"
            : "Not set"}
        </p>
      </div>

      <div className="bg-slate-100 p-4 rounded-md">
        <h2 className="font-semibold mb-2">Server Information</h2>
        <p>
          <strong>Host:</strong> {host}
        </p>
        <p>
          <strong>Environment:</strong> {process.env.NODE_ENV}
        </p>
      </div>

      {/* Client-side debug component */}
      <ClientDebug />
    </div>
  );
}
