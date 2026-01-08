import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { verifyPassword } from "@/lib/admin-auth";
import { createAdminSession, getAdminSessionCookieName } from "@/lib/admin-session";
import { createRequestLogger, formatError } from "@/lib/logger";
import { getClientIp, getUserAgent } from "@/lib/request-meta";
import { checkRateLimit, rateLimitHeaders } from "@/lib/rate-limit";
import { logSecurityEvent } from "@/lib/security-log";

const LOGIN_LIMIT = Number.parseInt(process.env.ADMIN_LOGIN_LIMIT ?? "8", 10) || 8;
const LOGIN_WINDOW_MS =
  Number.parseInt(process.env.ADMIN_LOGIN_WINDOW_MS ?? "60000", 10) || 60000;

export async function POST(req: NextRequest) {
  const log = createRequestLogger(req, "admin.login");
  let status = 200;
  try {
    const ip = getClientIp(req);
    const rate = checkRateLimit({
      key: `admin_login:${ip}`,
      limit: LOGIN_LIMIT,
      windowMs: LOGIN_WINDOW_MS,
    });
    if (!rate.allowed) {
      status = 429;
      log.warn("admin.login.rate_limited", { ip });
      logSecurityEvent({
        timestamp: new Date().toISOString(),
        event: "admin_login_rate_limited",
        ip,
        userAgent: getUserAgent(req),
        requestId: log.requestId,
      });
      return NextResponse.json(
        { message: "Too many login attempts. Try again shortly." },
        { status, headers: rateLimitHeaders(rate) }
      );
    }

    const { username, password } = await req.json();

    if (!username || !password) {
      status = 400;
      log.warn("admin.login.validation_failed");
      return NextResponse.json(
        { message: "Username and password required" },
        { status }
      );
    }

    const row = db
      .prepare(
        "SELECT password_hash as passwordHash, salt FROM admin_users WHERE username = ?"
      )
      .get(username) as { passwordHash: string; salt: string } | undefined;

    if (!row || !verifyPassword(password, row.salt, row.passwordHash)) {
      status = 401;
      log.warn("admin.login.invalid_credentials", { username });
      logSecurityEvent({
        timestamp: new Date().toISOString(),
        event: "admin_login_failed",
        ip,
        username,
        userAgent: getUserAgent(req),
        requestId: log.requestId,
      });
      return NextResponse.json({ message: "Invalid credentials" }, { status });
    }

    const maxAge = 60 * 60 * 8;
    const session = await createAdminSession(username, maxAge);
    const response = NextResponse.json({
      message: "Logged in",
      expiresAt: session.expiresAt,
    });

    response.cookies.set(getAdminSessionCookieName(), session.token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge,
    });
    logSecurityEvent({
      timestamp: new Date().toISOString(),
      event: "admin_login_success",
      ip,
      username,
      userAgent: getUserAgent(req),
      requestId: log.requestId,
    });
    return response;
  } catch (error) {
    status = 500;
    log.error("admin.login.error", { error: formatError(error) });
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status }
    );
  } finally {
    log.end(status);
  }
}
