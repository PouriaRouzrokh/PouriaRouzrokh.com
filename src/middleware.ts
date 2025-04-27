import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const hostname = request.headers.get("host") || "";
  let shouldRedirect = false;

  // Handle ns1 and ns2 subdomains
  if (hostname.startsWith("ns1.") || hostname.startsWith("ns2.")) {
    const mainDomain = hostname.replace(/^(ns1\.|ns2\.)/, "");
    if (hostname !== mainDomain) {
      url.hostname = mainDomain;
      shouldRedirect = true;
    }
    if (shouldRedirect) return NextResponse.redirect(url, { status: 307 });
  }

  // Redirect HTTP to HTTPS (only if not already HTTPS)
  if (request.nextUrl.protocol === "http:") {
    url.protocol = "https:";
    if (request.nextUrl.protocol !== url.protocol) {
      return NextResponse.redirect(url, { status: 308 });
    }
  }

  // Normalize www and non-www versions (redirect www to non-www)
  if (hostname.startsWith("www.")) {
    const nonWww = hostname.replace(/^www\./, "");
    if (hostname !== nonWww) {
      url.hostname = nonWww;
      return NextResponse.redirect(url, { status: 308 });
    }
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
