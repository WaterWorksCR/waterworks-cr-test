import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const isLoggedIn = req.cookies.get("isLoggedIn")?.value === "true";

  if (pathname.startsWith("/admin")) {
    if (pathname === "/admin/login") {
      if (isLoggedIn) {
        const adminUrl = req.nextUrl.clone();
        adminUrl.pathname = "/admin";
        adminUrl.search = "";
        return NextResponse.redirect(adminUrl);
      }
      return NextResponse.next();
    }

    if (!isLoggedIn) {
      const loginUrl = req.nextUrl.clone();
      loginUrl.pathname = "/admin/login";
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
