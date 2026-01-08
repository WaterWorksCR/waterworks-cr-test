import { NextRequest, NextResponse } from "next/server";
import { createAdminSession, getAdminSessionCookieName, getAdminSessionFromRequest } from "@/lib/admin-session";
import { createRequestLogger } from "@/lib/logger";

export async function POST(req: NextRequest) {
  const log = createRequestLogger(req, "admin.refresh");
  let status = 200;
  const session = await getAdminSessionFromRequest(req);
  if (!session) {
    status = 401;
    log.warn("admin.refresh.unauthorized");
    log.end(status);
    return NextResponse.json({ message: "Unauthorized" }, { status });
  }

  const maxAge = 60 * 60 * 8;
  const nextSession = await createAdminSession(session.u, maxAge);

  const response = NextResponse.json({
    message: "Session refreshed",
    expiresAt: nextSession.expiresAt,
  });
  response.cookies.set(getAdminSessionCookieName(), nextSession.token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge,
  });
  log.end(status);
  return response;
}
