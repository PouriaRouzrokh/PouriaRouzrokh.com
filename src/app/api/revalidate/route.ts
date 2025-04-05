import { NextRequest, NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import { revalidateNotionCache } from "@/lib/notion";

// Set runtime to be server-side only for security
export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    // Validate the request with a secret to prevent unauthorized revalidations
    const secret = request.nextUrl.searchParams.get("secret");
    const path = request.nextUrl.searchParams.get("path") || "/blog";

    // Check if the secret is valid
    if (secret !== process.env.REVALIDATION_SECRET) {
      return NextResponse.json(
        { message: "Invalid revalidation token" },
        { status: 401 }
      );
    }

    // Clear Notion in-memory cache to force fresh data fetch
    revalidateNotionCache();

    // Revalidate specific paths
    revalidatePath(path);

    // Also revalidate the notion-data tag
    revalidateTag("notion-data");

    return NextResponse.json(
      {
        revalidated: true,
        message: `Revalidation triggered for path: ${path}`,
        date: new Date().toISOString(),
      },
      { status: 200 }
    );
  } catch (err) {
    // If there was an error, return a 500
    console.error("Error revalidating:", err);
    return NextResponse.json(
      {
        message: "Error revalidating",
        error: err instanceof Error ? err.message : String(err),
      },
      { status: 500 }
    );
  }
}

// Optional: Support GET requests for easier testing
export async function GET(request: NextRequest) {
  return POST(request);
}
