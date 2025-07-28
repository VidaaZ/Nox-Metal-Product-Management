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

// Get products with pagination, search, and filtering
router.get('/', authenticateToken, getProducts);

// Get single product
router.get('/:id', authenticateToken, getProduct);

// Create new product (Admin only)
router.post('/', authenticateToken, requireAdmin, createProduct);

// Update product (Admin only)
router.put('/:id', authenticateToken, requireAdmin, updateProduct);

// Delete product (Admin only) - Soft delete
router.delete('/:id', authenticateToken, requireAdmin, deleteProduct);

// Restore product (Admin only)
router.patch('/:id/restore', authenticateToken, requireAdmin, restoreProduct);

export default router; 