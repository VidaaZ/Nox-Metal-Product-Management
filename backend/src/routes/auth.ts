import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { getProfile, register, login } from '../controllers/authController.js';

const router = express.Router();

router.get('/profile', authenticateToken, getProfile);

router.post('/register', register);

router.post('/login', login);

export default router; 