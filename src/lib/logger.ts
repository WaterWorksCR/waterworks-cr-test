import type { NextRequest } from "next/server";

type LogLevel = "info" | "warn" | "error";

type LogData = Record<string, unknown>;

function emit(level: LogLevel, message: string, data?: LogData) {
  const payload = {
    level,
    message,
    timestamp: new Date().toISOString(),
    ...data,
  };

  const writer =
    level === "error" ? console.error : level === "warn" ? console.warn : console.log;
  writer(JSON.stringify(payload));
}

export function formatError(error: unknown) {
  if (error instanceof Error) {
    return { message: error.message, stack: error.stack };
  }
  return { message: String(error) };
}

export function createRequestLogger(req: NextRequest, scope: string) {
  const requestId = req.headers.get("x-request-id") ?? crypto.randomUUID();
  const start = Date.now();
  const base = {
    requestId,
    scope,
    method: req.method,
    path: req.nextUrl?.pathname ?? req.url,
  };

  return {
    requestId,
    info: (message: string, data?: LogData) => emit("info", message, { ...base, ...data }),
    warn: (message: string, data?: LogData) => emit("warn", message, { ...base, ...data }),
    error: (message: string, data?: LogData) =>
      emit("error", message, { ...base, ...data }),
    end: (status: number, data?: LogData) =>
      emit("info", "request.complete", {
        ...base,
        status,
        durationMs: Date.now() - start,
        ...data,
      }),
  };
}
