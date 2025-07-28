import express from 'express';
import bcrypt from 'bcryptjs';
import { db } from '../models/database.js';
import { generateToken } from '../utils/jwt.js';
import { UserInput, LoginInput, User, AuthenticatedUser } from '../types/index.js';
import { authenticateToken, AuthenticatedRequest } from '../middleware/auth.js';

const router = express.Router();

// Get current user profile
router.get('/profile', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    const userId = req.user?.id;
    
    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    // Get user from database
    const user = await new Promise<User | undefined>((resolve, reject) => {
      db.get('SELECT * FROM users WHERE id = ?', [userId], (err, row: User) => {
        if (err) reject(err);
        else resolve(row);
      });
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const authenticatedUser: AuthenticatedUser = {
      id: user.id,
      email: user.email,
      full_name: user.full_name,
      role: user.role
    };

    res.json({ user: authenticatedUser });
  } catch (error) {
    console.error('Profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Register new user
router.post('/register', async (req, res) => {
  try {
    const { email, full_name, password, role = 'user' }: UserInput = req.body;

    if (!email || !full_name || !password) {
      return res.status(400).json({ error: 'Email, full name, and password are required' });
    }

    // Check if user already exists
    const existingUser = await new Promise<User | undefined>((resolve, reject) => {
      db.get('SELECT * FROM users WHERE email = ?', [email], (err, row: User) => {
        if (err) reject(err);
        else resolve(row);
      });
    });

    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Insert user
    const result = await new Promise<{ id: number }>((resolve, reject) => {
      db.run(
        'INSERT INTO users (email, full_name, password, role) VALUES (?, ?, ?, ?)',
        [email, full_name, hashedPassword, role],
        function (err) {
          if (err) reject(err);
          else resolve({ id: this.lastID });
        }
      );
    });

    const user: AuthenticatedUser = {
      id: result.id,
      email,
      full_name,
      role: role as 'admin' | 'user'
    };

    const token = generateToken(user);

    res.status(201).json({
      message: 'User created successfully',
      user,
      token
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Login user
router.post('/login', async (req, res) => {
  try {
    const { email, password }: LoginInput = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Find user
    const user = await new Promise<User | undefined>((resolve, reject) => {
      db.get('SELECT * FROM users WHERE email = ?', [email], (err, row: User) => {
        if (err) reject(err);
        else resolve(row);
      });
    });

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const authenticatedUser: AuthenticatedUser = {
      id: user.id,
      email: user.email,
      full_name: user.full_name,
      role: user.role
    };

    const token = generateToken(authenticatedUser);

    res.json({
      message: 'Login successful',
      user: authenticatedUser,
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router; 