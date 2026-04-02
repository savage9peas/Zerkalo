import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, "orders.db");
const db = new Database(dbPath);

export function run(sql, params = []) {
  const result = db.prepare(sql).run(params);
  return { lastID: result.lastInsertRowid, changes: result.changes };
}

export function get(sql, params = []) {
  return db.prepare(sql).get(params);
}

export function all(sql, params = []) {
  return db.prepare(sql).all(params);
}

export function initDb() {
  run(`
    CREATE TABLE IF NOT EXISTS orders (
      id TEXT PRIMARY KEY,
      name TEXT,
      phone TEXT,
      email TEXT,
      pickup_id TEXT,
      pickup_address TEXT,
      amount INTEGER,
      status TEXT,
      payment_id TEXT,
      paid_at TEXT,
      created_at TEXT
    )
  `);
}
