import Database from "better-sqlite3";
import fs from "fs";
import path from "path";

const dataDir = path.join(process.cwd(), "data");
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.join(dataDir, "app.db");
export const db = new Database(dbPath);

db.pragma("journal_mode = WAL");

db.exec(`
  CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    service TEXT NOT NULL,
    delivery_method TEXT NOT NULL,
    address TEXT,
    details TEXT NOT NULL,
    created_at TEXT NOT NULL
  );
  CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    message TEXT NOT NULL,
    created_at TEXT NOT NULL
  );
  CREATE TABLE IF NOT EXISTS meta (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL
  );
`);

function getMeta(key: string) {
  const row = db.prepare("SELECT value FROM meta WHERE key = ?").get(key) as
    | { value: string }
    | undefined;
  return row?.value ?? null;
}

function setMeta(key: string, value: string) {
  db.prepare("INSERT OR REPLACE INTO meta (key, value) VALUES (?, ?)")
    .run(key, value);
}

function readJsonFile<T>(filePath: string): T | null {
  try {
    if (!fs.existsSync(filePath)) {
      return null;
    }
    const raw = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

function migrateJsonIfNeeded() {
  if (getMeta("json_imported") === "true") {
    return;
  }

  const ordersPath = path.join(dataDir, "orders.json");
  const messagesPath = path.join(dataDir, "messages.json");

  const orders = readJsonFile<any[]>(ordersPath) || [];
  const messages = readJsonFile<any[]>(messagesPath) || [];

  const insertOrder = db.prepare(`
    INSERT OR IGNORE INTO orders
    (id, name, email, service, delivery_method, address, details, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);
  const insertMessage = db.prepare(`
    INSERT OR IGNORE INTO messages
    (id, name, email, message, created_at)
    VALUES (?, ?, ?, ?, ?)
  `);

  for (const order of orders) {
    insertOrder.run(
      order.id ?? null,
      order.name ?? "",
      order.email ?? "",
      order.service ?? "",
      order.deliveryMethod ?? "",
      order.address ?? null,
      order.details ?? "",
      order.createdAt ?? new Date().toISOString()
    );
  }

  for (const message of messages) {
    insertMessage.run(
      message.id ?? null,
      message.name ?? "",
      message.email ?? "",
      message.message ?? "",
      message.timestamp ?? new Date().toISOString()
    );
  }

  setMeta("json_imported", "true");
}

migrateJsonIfNeeded();
