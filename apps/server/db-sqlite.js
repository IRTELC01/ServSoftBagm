const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

const dataDir = process.env.DATA_DIR || __dirname;
try { if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true }); } catch {}
const dbPath = path.join(dataDir, 'servsoftbagm.db');
const db = new Database(dbPath);

db.pragma('journal_mode = WAL');

db.exec(`
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  twofa_secret TEXT,
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS invoices (
  id INTEGER PRIMARY KEY,
  customer_name TEXT,
  date TEXT DEFAULT (datetime('now')),
  line_items_json TEXT NOT NULL,
  total REAL NOT NULL,
  payment_method TEXT,
  notes TEXT,
  created_by INTEGER,
  FOREIGN KEY (created_by) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS transactions (
  id INTEGER PRIMARY KEY,
  type TEXT NOT NULL,
  category TEXT NOT NULL,
  amount REAL NOT NULL,
  date TEXT DEFAULT (datetime('now')),
  reference TEXT
);

CREATE TABLE IF NOT EXISTS user_phones (
  user_id INTEGER UNIQUE,
  phone TEXT UNIQUE NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS user_otps (
  user_id INTEGER,
  code TEXT NOT NULL,
  expires_at TEXT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS leads (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  ticket_number TEXT UNIQUE,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  address TEXT,
  service TEXT,
  requirement TEXT,
  equipment_description TEXT,
  images TEXT,           -- JSON array de rutas de imágenes: ["Imagen5.png", "Imagen6.png"]
  status TEXT DEFAULT 'Recibido',
  client_notes TEXT,
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS lead_otps (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  lead_id INTEGER NOT NULL,
  code TEXT NOT NULL,
  expires_at TEXT NOT NULL,
  used INTEGER DEFAULT 0,
  FOREIGN KEY (lead_id) REFERENCES leads(id)
);
`);

try { db.exec(`ALTER TABLE invoices ADD COLUMN address TEXT`); } catch {}
try { db.exec(`ALTER TABLE invoices ADD COLUMN phone TEXT`); } catch {}
try { db.exec(`ALTER TABLE invoices ADD COLUMN consecutive INTEGER`); } catch {}
try { db.exec(`ALTER TABLE invoices ADD COLUMN vat_percent REAL`); } catch {}
try { db.exec(`ALTER TABLE invoices ADD COLUMN vat_amount REAL`); } catch {}
try { db.exec(`ALTER TABLE invoices ADD COLUMN labor_cost REAL`); } catch {}
try { db.exec(`ALTER TABLE invoices ADD COLUMN subtotal REAL`); } catch {}
try { db.exec(`ALTER TABLE users ADD COLUMN role TEXT DEFAULT 'dueno'`); } catch {}

module.exports = db;
