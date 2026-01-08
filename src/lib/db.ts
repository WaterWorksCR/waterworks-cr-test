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
    phone TEXT NOT NULL,
    service TEXT NOT NULL,
    delivery_method TEXT NOT NULL,
    address TEXT,
    details TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'new',
    admin_notes TEXT NOT NULL DEFAULT '',
    created_at TEXT NOT NULL
  );
  CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    interest TEXT NOT NULL,
    site_type TEXT NOT NULL,
    message TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'new',
    admin_notes TEXT NOT NULL DEFAULT '',
    created_at TEXT NOT NULL
  );
  CREATE TABLE IF NOT EXISTS meta (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL
  );
  CREATE TABLE IF NOT EXISTS admin_users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    salt TEXT NOT NULL,
    created_at TEXT NOT NULL
  );
`);

function ensureColumn(table: string, column: string, type: string) {
  const columns = db
    .prepare(`PRAGMA table_info(${table})`)
    .all() as Array<{ name: string }>;
  if (columns.some((entry) => entry.name === column)) {
    return;
  }
  db.exec(`ALTER TABLE ${table} ADD COLUMN ${column} ${type}`);
}

ensureColumn("messages", "interest", "TEXT NOT NULL DEFAULT ''");
ensureColumn("messages", "site_type", "TEXT NOT NULL DEFAULT ''");
ensureColumn("orders", "phone", "TEXT NOT NULL DEFAULT ''");
ensureColumn("orders", "status", "TEXT NOT NULL DEFAULT 'new'");
ensureColumn("orders", "admin_notes", "TEXT NOT NULL DEFAULT ''");
ensureColumn("messages", "status", "TEXT NOT NULL DEFAULT 'new'");
ensureColumn("messages", "admin_notes", "TEXT NOT NULL DEFAULT ''");

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

type LegacyOrder = {
  id?: number;
  name?: string;
  email?: string;
  phone?: string;
  service?: string;
  deliveryMethod?: string;
  address?: string | null;
  details?: string;
  status?: string;
  adminNotes?: string;
  createdAt?: string;
};

type LegacyMessage = {
  id?: number;
  name?: string;
  email?: string;
  interest?: string;
  siteType?: string;
  message?: string;
  status?: string;
  adminNotes?: string;
  timestamp?: string;
  createdAt?: string;
};

function migrateJsonIfNeeded() {
  if (getMeta("json_imported") === "true") {
    return;
  }

  const ordersPath = path.join(dataDir, "orders.json");
  const messagesPath = path.join(dataDir, "messages.json");

  const orders = readJsonFile<LegacyOrder[]>(ordersPath) || [];
  const messages = readJsonFile<LegacyMessage[]>(messagesPath) || [];

  const insertOrder = db.prepare(`
    INSERT OR IGNORE INTO orders
    (id, name, email, phone, service, delivery_method, address, details, status, admin_notes, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  const insertMessage = db.prepare(`
    INSERT OR IGNORE INTO messages
    (id, name, email, interest, site_type, message, status, admin_notes, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  for (const order of orders) {
    insertOrder.run(
      order.id ?? null,
      order.name ?? "",
      order.email ?? "",
      order.phone ?? "",
      order.service ?? "",
      order.deliveryMethod ?? "",
      order.address ?? null,
      order.details ?? "",
      order.status ?? "new",
      order.adminNotes ?? "",
      order.createdAt ?? new Date().toISOString()
    );
  }

  for (const message of messages) {
    insertMessage.run(
      message.id ?? null,
      message.name ?? "",
      message.email ?? "",
      message.interest ?? "",
      message.siteType ?? "",
      message.message ?? "",
      message.status ?? "new",
      message.adminNotes ?? "",
      message.createdAt ?? message.timestamp ?? new Date().toISOString()
    );
  }

  setMeta("json_imported", "true");
}

migrateJsonIfNeeded();
