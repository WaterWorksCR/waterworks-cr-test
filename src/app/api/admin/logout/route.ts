import { NextRequest, NextResponse } from "next/server";
import { getAdminSessionCookieName } from "@/lib/admin-session";
import { createRequestLogger } from "@/lib/logger";

export async function POST(req: NextRequest) {
  const log = createRequestLogger(req, "admin.logout");
  const status = 200;
  const response = NextResponse.json({ message: "Logged out" });
  response.cookies.set(getAdminSessionCookieName(), "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
  log.end(status);
  return response;
}
