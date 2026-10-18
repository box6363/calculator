-- ====================================================================
-- CLOUDFLARE D1 DATABASE SCHEMA - WEB CALCULATOR PRO
-- Chạy lệnh: npx wrangler d1 execute webcalc-db --file=./schema.sql
-- ====================================================================

CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  stt INTEGER,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  avatar TEXT,
  plan TEXT DEFAULT 'free', -- 'free' | 'monthly' | 'yearly'
  price REAL DEFAULT 0,
  currency TEXT DEFAULT 'USD',
  payment_method TEXT,
  paypal_order_id TEXT,
  subscribed_at TEXT,
  expires_at TEXT,
  status TEXT DEFAULT 'active', -- 'active' | 'expired'
  ai_count_today INTEGER DEFAULT 0,
  ai_reset_date TEXT,
  ai_quota_remaining INTEGER DEFAULT 3,
  total_ai_queries INTEGER DEFAULT 0,
  last_login_at TEXT,
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS sessions (
  token TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  email TEXT NOT NULL,
  expires_at INTEGER NOT NULL,
  created_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS payment_records (
  id TEXT PRIMARY KEY,
  user_email TEXT NOT NULL,
  plan TEXT NOT NULL,
  amount REAL NOT NULL,
  currency TEXT DEFAULT 'USD',
  payment_method TEXT NOT NULL, -- 'paypal' | 'vietqr' | 'momo' | 'admin_grant'
  order_id TEXT,
  status TEXT DEFAULT 'pending', -- 'pending' | 'completed' | 'rejected'
  memo TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  confirmed_at TEXT
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_sessions_token ON sessions(token);
CREATE INDEX IF NOT EXISTS idx_payments_email ON payment_records(user_email);
