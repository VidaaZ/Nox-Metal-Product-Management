import sqlite3 from 'sqlite3';
import { Database } from 'sqlite3';
import path from 'path';

sqlite3.verbose();

const dbPath = path.join(process.cwd(), 'database.sqlite');

export const db: Database = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to SQLite database');
    initializeTables();
  }
});

function initializeTables() {
  // Users table
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      full_name TEXT NOT NULL,
      password TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('admin', 'user')),
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Add full_name column to existing users table if it doesn't exist
  db.all("PRAGMA table_info(users)", (err, rows) => {
    if (!err && rows) {
      const columns = rows as any[];
      const hasFullName = columns.some(col => col.name === 'full_name');
      if (!hasFullName) {
        db.run(`ALTER TABLE users ADD COLUMN full_name TEXT DEFAULT ''`);
        console.log('Added full_name column to users table');
      }
    }
  });

  // Products table
  db.run(`
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      price REAL NOT NULL,
      description TEXT,
      image_url TEXT,
      is_deleted BOOLEAN DEFAULT 0,
      created_by INTEGER,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (created_by) REFERENCES users (id)
    )
  `);

  // Audit logs table
  db.run(`
    CREATE TABLE IF NOT EXISTS audit_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      action TEXT NOT NULL CHECK (action IN ('create', 'update', 'delete', 'restore')),
      user_email TEXT NOT NULL,
      product_id INTEGER,
      product_name TEXT,
      details TEXT,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (product_id) REFERENCES products (id)
    )
  `);

  console.log('Database tables initialized');
}

export default db; 