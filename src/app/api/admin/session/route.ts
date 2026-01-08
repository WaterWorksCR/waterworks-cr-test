import { NextRequest, NextResponse } from "next/server";
import { getAdminSessionFromRequest } from "@/lib/admin-session";
import { createRequestLogger } from "@/lib/logger";

export async function GET(req: NextRequest) {
  const log = createRequestLogger(req, "admin.session");
  let status = 200;
  const session = await getAdminSessionFromRequest(req);
  if (!session) {
    status = 401;
    log.warn("admin.session.unauthorized");
    log.end(status);
    return NextResponse.json({ message: "Unauthorized" }, { status });
  }

  log.end(status);
  return NextResponse.json({ expiresAt: session.exp });
}
