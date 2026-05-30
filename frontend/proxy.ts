import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const ALLOWED_EXACT = new Set(["/main", "/auth", "/favicon.ico"]);

function isAllowedPath(pathname: string): boolean {
  if (ALLOWED_EXACT.has(pathname)) {
    return true;
  }

  if (pathname.startsWith("/labs/")) {
    return true;
  }

  if (pathname.startsWith("/api/")) {
    return true;
  }

  if (pathname.startsWith("/_next/")) {
    return true;
  }

  return /\.[a-zA-Z0-9]+$/.test(pathname);
}

export function proxy(request: NextRequest): NextResponse {
  if (isAllowedPath(request.nextUrl.pathname)) {
    return NextResponse.next();
  }

  const redirectUrl = request.nextUrl.clone();
  redirectUrl.pathname = "/main";
  redirectUrl.search = "";

  return NextResponse.redirect(redirectUrl);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
