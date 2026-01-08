import { NextRequest, NextResponse } from "next/server";
import { getAdminSessionFromRequest } from "@/lib/admin-session";

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const session = await getAdminSessionFromRequest(req);
  const isLoggedIn = Boolean(session);

  if (pathname.startsWith("/admin") && !pathname.startsWith("/admin/login") && !isLoggedIn) {
    return NextResponse.redirect(new URL("/admin/login", req.url));
  }

  return NextResponse.next();
}
