import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const hostname = request.headers.get("host") || "";

  // Handle ns1 and ns2 subdomains only
  if (hostname.startsWith("ns1.") || hostname.startsWith("ns2.")) {
    const mainDomain = hostname.replace(/^(ns1\.|ns2\.)/, "");
    if (hostname !== mainDomain) {
      url.hostname = mainDomain;
      return NextResponse.redirect(url, { status: 307 });
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
