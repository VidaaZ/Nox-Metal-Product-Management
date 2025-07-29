import express from 'express';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';
import { uploadSingle, handleUploadError } from '../middleware/upload.js';
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

router.post('/', authenticateToken, requireAdmin, uploadSingle, handleUploadError, createProduct);

router.put('/:id', authenticateToken, requireAdmin, uploadSingle, handleUploadError, updateProduct);

router.delete('/:id', authenticateToken, requireAdmin, deleteProduct);

router.patch('/:id/restore', authenticateToken, requireAdmin, restoreProduct);

export default router; 