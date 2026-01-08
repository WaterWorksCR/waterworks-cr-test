import { NextRequest, NextResponse } from "next/server";
import { createRequestLogger } from "@/lib/logger";

export async function GET(req: NextRequest) {
  const log = createRequestLogger(req, "admin.session");
  let status = 200;
  const isLoggedIn = req.cookies.get("isLoggedIn")?.value === "true";
  if (!isLoggedIn) {
    status = 401;
    log.warn("admin.session.unauthorized");
    log.end(status);
    return NextResponse.json({ message: "Unauthorized" }, { status });
  }

  const expiresAt = req.cookies.get("sessionExpiresAt")?.value;
  if (!expiresAt) {
    status = 400;
    log.warn("admin.session.expiry_missing");
    log.end(status);
    return NextResponse.json(
      { message: "Session expiry not available" },
      { status }
    );
  }

  log.end(status);
  return NextResponse.json({ expiresAt: Number(expiresAt) });
}
