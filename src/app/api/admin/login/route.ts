import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { verifyPassword } from "@/lib/admin-auth";
import { createRequestLogger, formatError } from "@/lib/logger";

export async function POST(req: NextRequest) {
  const log = createRequestLogger(req, "admin.login");
  let status = 200;
  try {
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
      return NextResponse.json({ message: "Invalid credentials" }, { status });
    }

    const response = NextResponse.json({ message: "Logged in" });
    const maxAge = 60 * 60 * 8;
    const expiresAt = Date.now() + maxAge * 1000;

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
