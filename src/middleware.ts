import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { getSessionFromHeaders } from "@/server/auth/session";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const session = await getSessionFromHeaders(request.headers);

  if (pathname.startsWith("/login") || pathname.startsWith("/signup")) {
    if (session) {
      return NextResponse.redirect(new URL("/dashboard/generator", request.url));
    }
    return NextResponse.next();
  }

  if (pathname.startsWith("/dashboard")) {
    if (!session) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  runtime: "nodejs",
  matcher: ["/dashboard/:path*", "/login", "/signup"],
};
