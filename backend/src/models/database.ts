import sqlite3 from 'sqlite3';


const dbPath = process.env.NODE_ENV === 'production' 
  ? '/tmp/database.sqlite' 
  : './database2.sqlite';

console.log('Database path:', dbPath);


const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to SQLite database');
  }
});


db.run('PRAGMA foreign_keys = ON');

const initializeDatabase = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    console.log('Database tables initialized');


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
    `, (err) => {
      if (err) {
        console.error('Error creating users table:', err);
        reject(err);
        return;
      }

      db.run(`
        CREATE TABLE IF NOT EXISTS products (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          price REAL NOT NULL,
          description TEXT,
          is_deleted INTEGER DEFAULT 0,
          created_by INTEGER,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (created_by) REFERENCES users (id)
        )
      `, (err) => {
        if (err) {
          console.error('Error creating products table:', err);
          reject(err);
          return;
        }

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
        `, (err) => {
          if (err) {
            console.error('Error creating audit_logs table:', err);
            reject(err);
            return;
          }

          db.all("PRAGMA table_info(users)", (err, rows: any) => {
            if (!err && rows) {
              const hasFullName = rows.some((row: any) => row.name === 'full_name');
              if (!hasFullName) {
                db.run('ALTER TABLE users ADD COLUMN full_name TEXT NOT NULL DEFAULT ""', (err) => {
                  if (err) {
                    console.error('Error adding full_name column:', err);
                    reject(err);
                  } else {
                    console.log('Added full_name column to users table');
                    resolve();
                  }
                });
              } else {
                console.log('full_name column already exists in users table');
                resolve();
              }
            } else {
              console.error('Error checking table info:', err);
              reject(err);
            }
          });
        });
      });
    });
  });
};

export { initializeDatabase };

export { db };
export default db; 