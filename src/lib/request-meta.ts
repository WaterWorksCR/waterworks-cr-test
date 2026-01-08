import type { NextRequest } from "next/server";

type RequestLike = Pick<NextRequest, "headers"> & { ip?: string | null };

export function getClientIp(req: RequestLike) {
  const forwardedFor = req.headers.get("x-forwarded-for");
  if (forwardedFor) {
    const first = forwardedFor.split(",")[0]?.trim();
    if (first) {
      return first;
    }
  }
  const realIp = req.headers.get("x-real-ip");
  if (realIp) {
    return realIp.trim();
  }
  if (req.ip) {
    return req.ip;
  }
  return "unknown";
}

export function getUserAgent(req: RequestLike) {
  return req.headers.get("user-agent") || "unknown";
}
