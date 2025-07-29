import { Pool } from 'pg';
import sqlite3 from 'sqlite3';

const USE_POSTGRESQL = process.env.USE_POSTGRESQL === 'true';

export interface DatabaseResult {
  rows?: any[];
  row?: any;
  rowCount?: number | null;
}

export class DatabaseService {
  private pool: Pool | null = null;
  private sqliteDb: sqlite3.Database | null = null;

  constructor() {
    if (USE_POSTGRESQL) {
      this.pool = new Pool({
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT || '5432'),
        database: process.env.DB_NAME || 'nox_metal',
        user: process.env.DB_USER || 'postgres',
        password: process.env.DB_PASSWORD || 'password',
        max: 20,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 2000,
      });
    } else {
      const dbPath = require('path').join(process.cwd(), 'database.sqlite');
      this.sqliteDb = new sqlite3.Database(dbPath);
    }
  }

  async query(sql: string, params: any[] = []): Promise<DatabaseResult> {
    if (USE_POSTGRESQL && this.pool) {
      const result = await this.pool.query(sql, params);
      return {
        rows: result.rows,
        rowCount: result.rowCount
      };
    } else if (this.sqliteDb) {
      return new Promise((resolve, reject) => {
        this.sqliteDb!.all(sql, params, (err, rows) => {
          if (err) reject(err);
          else resolve({ rows });
        });
      });
    }
    throw new Error('No database connection available');
  }

  async get(sql: string, params: any[] = []): Promise<DatabaseResult> {
    if (USE_POSTGRESQL && this.pool) {
      const result = await this.pool.query(sql, params);
      return {
        row: result.rows[0],
        rowCount: result.rowCount
      };
    } else if (this.sqliteDb) {
      return new Promise((resolve, reject) => {
        this.sqliteDb!.get(sql, params, (err, row) => {
          if (err) reject(err);
          else resolve({ row });
        });
      });
    }
    throw new Error('No database connection available');
  }

  async run(sql: string, params: any[] = []): Promise<DatabaseResult> {
    if (USE_POSTGRESQL && this.pool) {
      const result = await this.pool.query(sql, params);
      return {
        rowCount: result.rowCount
      };
    } else if (this.sqliteDb) {
      return new Promise((resolve, reject) => {
        this.sqliteDb!.run(sql, params, function(err) {
          if (err) reject(err);
          else resolve({ rowCount: this.changes });
        });
      });
    }
    throw new Error('No database connection available');
  }

  async close(): Promise<void> {
    if (USE_POSTGRESQL && this.pool) {
      await this.pool.end();
    } else if (this.sqliteDb) {
      this.sqliteDb.close();
    }
  }
}

export const dbService = new DatabaseService(); 