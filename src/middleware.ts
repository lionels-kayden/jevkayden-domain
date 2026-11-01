import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const host = (request.headers.get("host") || "").toLowerCase().replace(/:\d+$/, "");
  const pathname = url.pathname;

  // 1. Skip middleware for internal Next.js assets, API routes, uploads, or static files
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/uploads") ||
    pathname === "/favicon.ico" ||
    pathname === "/icon.svg" ||
    pathname === "/blog-icon.svg" ||
    /\.(svg|png|jpg|jpeg|gif|webp|css|js|ico|woff|woff2|ttf|eot)$/i.test(pathname)
  ) {
    return NextResponse.next();
  }

  // 2. Subdomain rewrite rules (preserves query params automatically via nextUrl clone)
  // cv.jevkayden.tech or cv.localhost
  if (host.startsWith("cv.")) {
    if (!pathname.startsWith("/cv")) {
      url.pathname = `/cv${pathname === "/" ? "" : pathname}`;
      return NextResponse.rewrite(url);
    }
    return NextResponse.next();
  }

  // blog.jevkayden.tech or blog.localhost
  if (host.startsWith("blog.")) {
    if (!pathname.startsWith("/blog")) {
      url.pathname = `/blog${pathname === "/" ? "" : pathname}`;
      return NextResponse.rewrite(url);
    }
    return NextResponse.next();
  }

  // admin.jevkayden.tech or admin.localhost
  if (host.startsWith("admin.")) {
    if (!pathname.startsWith("/admin")) {
      url.pathname = `/admin${pathname === "/" ? "" : pathname}`;
      return NextResponse.rewrite(url);
    }
    return NextResponse.next();
  }

  // 3. Direct path access (/cv, /blog, /admin, /admin/hub, etc.) on localhost:3000 and jevkayden.tech
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|uploads|favicon.ico|.*\\..*).*)"],
};
