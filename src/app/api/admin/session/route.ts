import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const isLoggedIn = req.cookies.get("isLoggedIn")?.value === "true";
  if (!isLoggedIn) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const expiresAt = req.cookies.get("sessionExpiresAt")?.value;
  if (!expiresAt) {
    return NextResponse.json(
      { message: "Session expiry not available" },
      { status: 400 }
    );
  }

  return NextResponse.json({ expiresAt: Number(expiresAt) });
}
