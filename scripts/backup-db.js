/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require("fs");
const path = require("path");
const Database = require("better-sqlite3");

function parseArgs(argv) {
  const args = { keep: 14, outDir: null };
  for (let i = 2; i < argv.length; i += 1) {
    const token = argv[i];
    if (token === "--keep") {
      args.keep = Number(argv[i + 1] || args.keep);
      i += 1;
      continue;
    }
    if (token === "--out-dir") {
      args.outDir = argv[i + 1] || null;
      i += 1;
      continue;
    }
  }
  return args;
}

function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

function timestamp() {
  return new Date().toISOString().replace(/[:.]/g, "-");
}

function pruneBackups(backupDir, keep) {
  if (!Number.isFinite(keep) || keep <= 0) {
    return;
  }
  const entries = fs
    .readdirSync(backupDir)
    .filter((file) => file.endsWith(".db"))
    .map((file) => {
      const fullPath = path.join(backupDir, file);
      const stat = fs.statSync(fullPath);
      return { file, fullPath, mtimeMs: stat.mtimeMs };
    })
    .sort((a, b) => b.mtimeMs - a.mtimeMs);

  for (const entry of entries.slice(keep)) {
    fs.unlinkSync(entry.fullPath);
  }
}

async function main() {
  const args = parseArgs(process.argv);
  const dbPath = path.join(process.cwd(), "data", "app.db");
  const backupDir =
    args.outDir || path.join(process.cwd(), "data", "backups");
  ensureDir(backupDir);

  const db = new Database(dbPath, { readonly: true });
  const outputPath = path.join(backupDir, `app-${timestamp()}.db`);
  await db.backup(outputPath);
  db.close();

  pruneBackups(backupDir, args.keep);
  console.log(`Backup created: ${outputPath}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
