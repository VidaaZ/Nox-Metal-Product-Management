import bcrypt from 'bcryptjs';
import { db } from '../models/database.js';
import { generateToken } from '../utils/jwt.js';
import { User, AuthenticatedUser } from '../types/index.js';

export class AuthService {
  async register(email: string, password: string, fullName: string): Promise<{ user: User; token: string }> {
    const existingUser = await new Promise<User | undefined>((resolve, reject) => {
      db.get('SELECT * FROM users WHERE email = ?', [email], (err, row: User) => {
        if (err) reject(err);
        else resolve(row);
      });
    });

    if (existingUser) {
      throw new Error('User already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const now = new Date();
    const canadaTime = new Date(now.toLocaleString("en-US", {timeZone: "America/Toronto"}));
    const timestamp = canadaTime.toISOString();

    const result = await new Promise<{ id: number }>((resolve, reject) => {
      db.run(
        'INSERT INTO users (email, full_name, password, role, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)',
        [email, fullName, hashedPassword, 'user', timestamp, timestamp],
        function (err) {
          if (err) reject(err);
          else resolve({ id: this.lastID });
        }
      );
    });

    const user: User = {
      id: result.id,
      email,
      full_name: fullName,
      password: hashedPassword,
      role: 'user',
      created_at: timestamp,
      updated_at: timestamp
    };

    const token = generateToken(user as AuthenticatedUser);

    return { user, token };
  }

  async login(email: string, password: string): Promise<{ user: User; token: string }> {
    const user = await new Promise<User | undefined>((resolve, reject) => {
      db.get('SELECT * FROM users WHERE email = ?', [email], (err, row: User) => {
        if (err) reject(err);
        else resolve(row);
      });
    });

    if (!user) {
      throw new Error('Invalid credentials');
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      throw new Error('Invalid credentials');
    }

    const token = generateToken(user as AuthenticatedUser);

    return { user, token };
  }

  async getProfile(userId: number): Promise<User> {
    const user = await new Promise<User | undefined>((resolve, reject) => {
      db.get('SELECT id, email, full_name, password, role, created_at, updated_at FROM users WHERE id = ?', [userId], (err, row: User) => {
        if (err) reject(err);
        else resolve(row);
      });
    });

    if (!user) {
      throw new Error('User not found');
    }

    return user;
  }

  async getAllUsers(): Promise<User[]> {
    return new Promise<User[]>((resolve, reject) => {
      db.all('SELECT id, email, full_name, password, role, created_at, updated_at FROM users ORDER BY created_at DESC', (err, rows: User[]) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }
}

export const authService = new AuthService(); 