import { type NextRequest, NextResponse } from "next/server";

/**
 * Next.js 16 proxy (route guard) — replaces the deprecated middleware.ts.
 *
 * Uses an optimistic cookie-presence check so that no Node.js modules
 * (Drizzle, postgres-js, better-auth db adapter) are imported here.
 * Importing those caused Turbopack's "adapterFn is not a function" crash
 * because they rely on Node.js APIs unavailable in the edge compiler.
 *
 * Fine-grained session validation (revocation, roles) is deferred to
 * Server Components and tRPC protected procedures via auth.api.getSession().
 */

const SESSION_COOKIE = "better-auth.session_token";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasSession = Boolean(request.cookies.get(SESSION_COOKIE)?.value);

  // Redirect authenticated users away from auth screens
  if (pathname.startsWith("/login") || pathname.startsWith("/signup")) {
    if (hasSession) {
      return NextResponse.redirect(new URL("/dashboard/generator", request.url));
    }
    return NextResponse.next();
  }

  // Guard all /dashboard routes
  if (pathname.startsWith("/dashboard")) {
    if (!hasSession) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/signup"],
};

