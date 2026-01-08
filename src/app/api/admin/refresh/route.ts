import { NextRequest, NextResponse } from "next/server";
import { createRequestLogger } from "@/lib/logger";

export async function POST(req: NextRequest) {
  const log = createRequestLogger(req, "admin.refresh");
  let status = 200;
  const isLoggedIn = req.cookies.get("isLoggedIn")?.value === "true";
  if (!isLoggedIn) {
    status = 401;
    log.warn("admin.refresh.unauthorized");
    log.end(status);
    return NextResponse.json({ message: "Unauthorized" }, { status });
  }

  const maxAge = 60 * 60 * 8;
  const expiresAt = Date.now() + maxAge * 1000;

  const response = NextResponse.json({ message: "Session refreshed" });
  response.cookies.set("isLoggedIn", "true", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge,
  });
  response.cookies.set("sessionExpiresAt", String(expiresAt), {
    httpOnly: false,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge,
  });
  log.end(status);
  return response;
}
