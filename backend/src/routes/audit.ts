import express from 'express';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';
import { getLogs } from '../controllers/auditController.js';

const router = express.Router();

// Get audit logs (Admin only)
router.get('/', authenticateToken, requireAdmin, getLogs);

export default router; 