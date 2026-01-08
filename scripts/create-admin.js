/* eslint-disable @typescript-eslint/no-require-imports */
const crypto = require("crypto");
const path = require("path");
const Database = require("better-sqlite3");

const KEY_LEN = 64;
const SCRYPT_OPTIONS = {
  N: 16384,
  r: 8,
  p: 1,
  maxmem: 64 * 1024 * 1024,
};

function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto
    .scryptSync(password, salt, KEY_LEN, SCRYPT_OPTIONS)
    .toString("hex");
  return { salt, hash };
}

function parseArgs(argv) {
  const args = { username: null, password: null, passwordStdin: false };
  for (let i = 2; i < argv.length; i += 1) {
    const token = argv[i];
    if (token === "--username") {
      args.username = argv[i + 1] || null;
      i += 1;
      continue;
    }
    if (token === "--password") {
      args.password = argv[i + 1] || null;
      i += 1;
      continue;
    }
    if (token === "--password-stdin") {
      args.passwordStdin = true;
      continue;
    }
  }
  return args;
}

async function readPasswordFromStdin() {
  const chunks = [];
  for await (const chunk of process.stdin) {
    chunks.push(chunk);
  }
  return Buffer.concat(chunks).toString("utf-8").trim();
}

async function main() {
  const args = parseArgs(process.argv);
  const username = args.username || process.env.ADMIN_USERNAME;
  const password =
    args.password ||
    process.env.ADMIN_PASSWORD ||
    (args.passwordStdin ? await readPasswordFromStdin() : null);

  if (!username || !password) {
    console.error(
      "Usage: node scripts/create-admin.js --username <name> --password <pass>\n" +
        "   or: ADMIN_USERNAME=... ADMIN_PASSWORD=... node scripts/create-admin.js\n" +
        "   or: printf \"pass\" | node scripts/create-admin.js --username <name> --password-stdin"
    );
    process.exit(1);
  }

  const dbPath = path.join(process.cwd(), "data", "app.db");
  const db = new Database(dbPath);

  db.exec(`
    CREATE TABLE IF NOT EXISTS admin_users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      salt TEXT NOT NULL,
      created_at TEXT NOT NULL
    );
  `);

  const existing = db
    .prepare("SELECT id FROM admin_users WHERE username = ?")
    .get(username);
  if (existing) {
    console.error("Admin user already exists.");
    process.exit(1);
  }

  const { salt, hash } = hashPassword(password);
  db.prepare(
    "INSERT INTO admin_users (username, password_hash, salt, created_at) VALUES (?, ?, ?, ?)"
  ).run(username, hash, salt, new Date().toISOString());

  console.log(`Admin user created: ${username}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
