import express from 'express';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';
import { 
  getProducts, 
  getProduct, 
  createProduct, 
  updateProduct, 
  deleteProduct, 
  restoreProduct 
} from '../controllers/productController.js';

const router = express.Router();

router.get('/', authenticateToken, getProducts);

router.get('/:id', authenticateToken, getProduct);

router.post('/', authenticateToken, requireAdmin, createProduct);

router.put('/:id', authenticateToken, requireAdmin, updateProduct);

router.delete('/:id', authenticateToken, requireAdmin, deleteProduct);

router.patch('/:id/restore', authenticateToken, requireAdmin, restoreProduct);

export default router; 