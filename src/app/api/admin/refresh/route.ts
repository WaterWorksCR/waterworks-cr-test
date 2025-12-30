import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const isLoggedIn = req.cookies.get("isLoggedIn")?.value === "true";
  if (!isLoggedIn) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
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
  return response;
}
