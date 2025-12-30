import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { username, password } = await req.json();

  const adminUsername = process.env.ADMIN_USERNAME;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminUsername || !adminPassword) {
    return NextResponse.json(
      { message: "Admin credentials not configured" },
      { status: 500 }
    );
  }

  if (username !== adminUsername || password !== adminPassword) {
    return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
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
}
