import fs from "fs";
import path from "path";

const logDir = path.join(process.cwd(), "data", "logs");
const logPath = path.join(logDir, "security.log");

type SecurityEvent = {
  timestamp: string;
  event: string;
  ip: string;
  username?: string;
  userAgent?: string;
  requestId?: string;
  detail?: string;
};

export function logSecurityEvent(event: SecurityEvent) {
  fs.mkdirSync(logDir, { recursive: true });
  const entry = JSON.stringify(event);
  fs.appendFileSync(logPath, `${entry}\n`);
}

export function getSecurityLogPath() {
  return logPath;
}
