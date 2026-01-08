import { NextRequest, NextResponse } from "next/server";
import { createRequestLogger } from "@/lib/logger";

export async function POST(req: NextRequest) {
  const log = createRequestLogger(req, "admin.logout");
  const status = 200;
  const response = NextResponse.json({ message: "Logged out" });
  response.cookies.set("isLoggedIn", "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
  response.cookies.set("sessionExpiresAt", "", {
    httpOnly: false,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
  log.end(status);
  return response;
}
