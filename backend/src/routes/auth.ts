import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { getProfile, register, login } from '../controllers/authController.js';

const router = express.Router();

// Get current user profile
router.get('/profile', authenticateToken, getProfile);

// Register new user
router.post('/register', register);

// Login user
router.post('/login', login);

export default router; 