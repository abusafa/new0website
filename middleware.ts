import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { defaultLocale, isLocale, LOCALE_COOKIE } from "@/lib/i18n";

const PUBLIC_FILE = /\.(.*)$/;

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/admin") ||
    pathname.startsWith("/admin/") ||
    PUBLIC_FILE.test(pathname)
  ) {
    return NextResponse.next();
  }

  const segments = pathname.split("/");
  const localeSegment = segments[1];

  if (isLocale(localeSegment)) {
    const response = NextResponse.next();
    response.cookies.set(LOCALE_COOKIE, localeSegment, { path: "/" });
    return response;
  }

  const redirectUrl = request.nextUrl.clone();
  redirectUrl.pathname = `/${defaultLocale}${pathname}`.replace(/\/+/g, "/");
  const response = NextResponse.redirect(redirectUrl);
  response.cookies.set(LOCALE_COOKIE, defaultLocale, { path: "/" });
  return response;
}

export const config = {
  matcher: "/:path*",
};
