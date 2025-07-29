import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pool from './database.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const initializeDatabase = async () => {
  try {
    const schemaPath = path.join(__dirname, 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');

    await pool.query(schema);
    console.log('✅ PostgreSQL database initialized successfully');

    const client = await pool.connect();
    try {
      const result = await client.query('SELECT COUNT(*) FROM users');
      console.log(`📊 Database has ${result.rows[0].count} users`);
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('❌ Error initializing database:', error);
    throw error;
  }
};

export const closeDatabase = async () => {
  await pool.end();
  console.log('🔌 Database connection closed');
}; 