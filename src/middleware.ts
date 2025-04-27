import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const hostname = request.headers.get("host") || "";

  // Handle ns1 and ns2 subdomains
  if (hostname.startsWith("ns1.") || hostname.startsWith("ns2.")) {
    // Redirect to the main domain
    const mainDomain = hostname.replace(/^(ns1\.|ns2\.)/, "");
    url.hostname = mainDomain;

    // Create a 307 temporary redirect (versus 308 permanent)
    // Using temporary in case you change DNS setup in the future
    return NextResponse.redirect(url, { status: 307 });
  }

  // Redirect HTTP to HTTPS
  if (request.nextUrl.protocol === "http:") {
    url.protocol = "https:";
    return NextResponse.redirect(url, { status: 308 }); // 308 is permanent redirect
  }

  // Normalize www and non-www versions (redirect www to non-www)
  if (hostname.startsWith("www.")) {
    url.hostname = hostname.replace(/^www\./, "");
    return NextResponse.redirect(url, { status: 308 }); // 308 is permanent redirect
  }

  return NextResponse.next();
}

// Configure matcher to run middleware on all routes
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images/ (local images folder)
     * - public/ files (public assets)
     */
    "/((?!_next/static|_next/image|favicon.ico|images/|public/).*)",
  ],
};
