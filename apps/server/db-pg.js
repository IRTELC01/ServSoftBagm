const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function initSchema() {
  const stmts = [
    `CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      username TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      twofa_secret TEXT,
      role TEXT DEFAULT 'dueno',
      created_at TIMESTAMP DEFAULT NOW()
    )`,
    `ALTER TABLE users ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'dueno'`,
    `CREATE TABLE IF NOT EXISTS invoices (
      id SERIAL PRIMARY KEY,
      customer_name TEXT,
      date TIMESTAMP DEFAULT NOW(),
      line_items_json TEXT NOT NULL,
      total REAL NOT NULL,
      payment_method TEXT,
      notes TEXT,
      created_by INTEGER REFERENCES users(id)
    )`,
    `CREATE TABLE IF NOT EXISTS transactions (
      id SERIAL PRIMARY KEY,
      type TEXT NOT NULL,
      category TEXT NOT NULL,
      amount REAL NOT NULL,
      date TIMESTAMP DEFAULT NOW(),
      reference TEXT
    )`,
    `CREATE TABLE IF NOT EXISTS user_phones (
      user_id INTEGER UNIQUE REFERENCES users(id),
      phone TEXT UNIQUE NOT NULL
    )`,
    `CREATE TABLE IF NOT EXISTS user_otps (
      user_id INTEGER REFERENCES users(id),
      code TEXT NOT NULL,
      expires_at TIMESTAMP NOT NULL
    )`,
    `CREATE TABLE IF NOT EXISTS leads (
      id SERIAL PRIMARY KEY,
      ticket_number TEXT UNIQUE,
      name TEXT NOT NULL,
      phone TEXT NOT NULL,
      address TEXT,
      service TEXT,
      requirement TEXT,
      equipment_description TEXT,
      images TEXT,
      status TEXT DEFAULT 'Recibido',
      client_notes TEXT,
      created_at TIMESTAMP DEFAULT NOW()
    )`,
    `CREATE TABLE IF NOT EXISTS lead_otps (
      id SERIAL PRIMARY KEY,
      lead_id INTEGER NOT NULL REFERENCES leads(id),
      code TEXT NOT NULL,
      expires_at TIMESTAMP NOT NULL,
      used BOOLEAN DEFAULT FALSE
    )`,
    `ALTER TABLE invoices ADD COLUMN IF NOT EXISTS address TEXT`,
    `ALTER TABLE invoices ADD COLUMN IF NOT EXISTS phone TEXT`,
    `ALTER TABLE invoices ADD COLUMN IF NOT EXISTS consecutive INTEGER`,
    `ALTER TABLE invoices ADD COLUMN IF NOT EXISTS vat_percent REAL`,
    `ALTER TABLE invoices ADD COLUMN IF NOT EXISTS vat_amount REAL`,
    `ALTER TABLE invoices ADD COLUMN IF NOT EXISTS labor_cost REAL`,
    `ALTER TABLE invoices ADD COLUMN IF NOT EXISTS subtotal REAL`,

    // Asegurar columnas de leads (por si la tabla fue creada en una versión anterior)
    `ALTER TABLE leads ADD COLUMN IF NOT EXISTS equipment_description TEXT`,
    `ALTER TABLE leads ADD COLUMN IF NOT EXISTS images TEXT`,
    `ALTER TABLE leads ADD COLUMN IF NOT EXISTS client_notes TEXT`,
    `ALTER TABLE leads ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT NOW()`,
  ];
  for (const s of stmts) {
    try { await pool.query(s); } catch {}
  }
}

function convertPlaceholders(sql) {
  let i = 0;
  return sql.replace(/\?/g, () => `$${++i}`);
}

function prepare(sql) {
  const trimmed = sql.trim();
  const isInsert = /^insert\s+into/i.test(trimmed);
  const hasReturning = /returning\s+/i.test(trimmed);
  const withReturning = isInsert && !hasReturning ? `${trimmed} RETURNING id` : trimmed;
  const text = convertPlaceholders(withReturning);
  return {
    async run(...args) {
      const res = await pool.query(text, args);
      const lastInsertRowid = (isInsert && res.rows?.[0]?.id) || undefined;
      return { lastInsertRowid, changes: res.rowCount };
    },
    async get(...args) {
      const res = await pool.query(text, args);
      return res.rows?.[0] || null;
    },
    async all(...args) {
      const res = await pool.query(text, args);
      return res.rows || [];
    },
  };
}

async function exec(sql) {
  const parts = sql.split(';').map(s => s.trim()).filter(Boolean);
  for (const p of parts) {
    await pool.query(p);
  }
}

const ready = initSchema().catch(() => {});

module.exports = {
  prepare,
  exec,
  pragma() {},
  ready,
};
