import express from 'express';
import { db } from '../models/database.js';
import { authenticateToken, requireAdmin, AuthenticatedRequest } from '../middleware/auth.js';
import { Product, ProductInput, ProductUpdateInput, ProductQuery, PaginatedResponse } from '../types/index.js';
import { logAuditAction } from '../utils/auditLogger.js';

const router = express.Router();

// Get products with pagination, search, and filtering
router.get('/', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = '',
      sortBy = 'created_at',
      sortOrder = 'desc',
      includeDeleted = false
    }: ProductQuery = req.query as any;

    const offset = (Number(page) - 1) * Number(limit);
    const isAdmin = req.user?.role === 'admin';
    
    // Only admins can view deleted products
    const showDeleted = isAdmin && String(includeDeleted) === 'true';
    
    let whereClause = showDeleted ? '' : 'WHERE is_deleted = 0';
    let searchClause = '';
    let params: any[] = [];

    if (search) {
      searchClause = showDeleted 
        ? 'WHERE (name LIKE ? OR description LIKE ?)'
        : 'AND (name LIKE ? OR description LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    const orderClause = `ORDER BY ${sortBy} ${sortOrder}`;

    // Get total count
    const countQuery = `
      SELECT COUNT(*) as count FROM products 
      ${whereClause} ${searchClause}
    `;

    const total = await new Promise<number>((resolve, reject) => {
      db.get(countQuery, params, (err, row: any) => {
        if (err) reject(err);
        else resolve(row.count);
      });
    });

    // Get products
    const productsQuery = `
      SELECT p.*, u.email as created_by_email 
      FROM products p
      LEFT JOIN users u ON p.created_by = u.id
      ${whereClause} ${searchClause}
      ${orderClause}
      LIMIT ? OFFSET ?
    `;

    const products = await new Promise<Product[]>((resolve, reject) => {
      db.all(
        productsQuery,
        [...params, Number(limit), offset],
        (err, rows: Product[]) => {
          if (err) reject(err);
          else resolve(rows);
        }
      );
    });

    const response: PaginatedResponse<Product> = {
      data: products,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / Number(limit))
      }
    };

    res.json(response);
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get single product
router.get('/:id', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    const { id } = req.params;
    const isAdmin = req.user?.role === 'admin';

    const product = await new Promise<Product | undefined>((resolve, reject) => {
      const query = isAdmin 
        ? 'SELECT * FROM products WHERE id = ?'
        : 'SELECT * FROM products WHERE id = ? AND is_deleted = 0';
      
      db.get(query, [id], (err, row: Product) => {
        if (err) reject(err);
        else resolve(row);
      });
    });

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json(product);
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create product (Admin only)
router.post('/', authenticateToken, requireAdmin, async (req: AuthenticatedRequest, res) => {
  try {
    const { name, price, description, image_url }: ProductInput = req.body;

    if (!name || price === undefined) {
      return res.status(400).json({ error: 'Name and price are required' });
    }

    if (price < 0) {
      return res.status(400).json({ error: 'Price must be non-negative' });
    }

    const result = await new Promise<{ id: number }>((resolve, reject) => {
      db.run(
        'INSERT INTO products (name, price, description, image_url, created_by) VALUES (?, ?, ?, ?, ?)',
        [name, price, description || null, image_url || null, req.user!.id],
        function (err) {
          if (err) reject(err);
          else resolve({ id: this.lastID });
        }
      );
    });

    // Log audit action
    await logAuditAction(
      'create',
      req.user!.email,
      result.id,
      name,
      `Product created with price $${price}`
    );

    res.status(201).json({
      message: 'Product created successfully',
      id: result.id
    });
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update product (Admin only)
router.put('/:id', authenticateToken, requireAdmin, async (req: AuthenticatedRequest, res) => {
  try {
    const { id } = req.params;
    const { name, price, description, image_url }: ProductInput = req.body;

    // Get existing product
    const existingProduct = await new Promise<Product | undefined>((resolve, reject) => {
      db.get('SELECT * FROM products WHERE id = ?', [id], (err, row: Product) => {
        if (err) reject(err);
        else resolve(row);
      });
    });

    if (!existingProduct) {
      return res.status(404).json({ error: 'Product not found' });
    }

    if (price !== undefined && price < 0) {
      return res.status(400).json({ error: 'Price must be non-negative' });
    }

    const updates: string[] = [];
    const params: any[] = [];

    if (name !== undefined) {
      updates.push('name = ?');
      params.push(name);
    }
    if (price !== undefined) {
      updates.push('price = ?');
      params.push(price);
    }
    if (description !== undefined) {
      updates.push('description = ?');
      params.push(description);
    }
    if (image_url !== undefined) {
      updates.push('image_url = ?');
      params.push(image_url);
    }

    if (updates.length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }

    updates.push('updated_at = CURRENT_TIMESTAMP');
    params.push(id);

    await new Promise<void>((resolve, reject) => {
      db.run(
        `UPDATE products SET ${updates.join(', ')} WHERE id = ?`,
        params,
        function (err) {
          if (err) reject(err);
          else resolve();
        }
      );
    });

    // Log audit action
    const changes = [];
    if (name && name !== existingProduct.name) changes.push(`name: ${existingProduct.name} → ${name}`);
    if (price !== undefined && price !== existingProduct.price) changes.push(`price: $${existingProduct.price} → $${price}`);
    if (description !== undefined && description !== existingProduct.description) changes.push(`description updated`);
    if (image_url !== undefined && image_url !== existingProduct.image_url) changes.push(`image updated`);

    await logAuditAction(
      'update',
      req.user!.email,
      Number(id),
      name || existingProduct.name,
      `Changes: ${changes.join(', ')}`
    );

    res.json({ message: 'Product updated successfully' });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete product (Admin only) - Soft delete
router.delete('/:id', authenticateToken, requireAdmin, async (req: AuthenticatedRequest, res) => {
  try {
    const { id } = req.params;

    // Get existing product
    const existingProduct = await new Promise<Product | undefined>((resolve, reject) => {
      db.get('SELECT * FROM products WHERE id = ?', [id], (err, row: Product) => {
        if (err) reject(err);
        else resolve(row);
      });
    });

    if (!existingProduct) {
      return res.status(404).json({ error: 'Product not found' });
    }

    if (existingProduct.is_deleted) {
      return res.status(400).json({ error: 'Product is already deleted' });
    }

    await new Promise<void>((resolve, reject) => {
      db.run(
        'UPDATE products SET is_deleted = 1, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        [id],
        function (err) {
          if (err) reject(err);
          else resolve();
        }
      );
    });

    // Log audit action
    await logAuditAction(
      'delete',
      req.user!.email,
      Number(id),
      existingProduct.name,
      'Product soft deleted'
    );

    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Restore product (Admin only)
router.patch('/:id/restore', authenticateToken, requireAdmin, async (req: AuthenticatedRequest, res) => {
  try {
    const { id } = req.params;

    // Get existing product
    const existingProduct = await new Promise<Product | undefined>((resolve, reject) => {
      db.get('SELECT * FROM products WHERE id = ?', [id], (err, row: Product) => {
        if (err) reject(err);
        else resolve(row);
      });
    });

    if (!existingProduct) {
      return res.status(404).json({ error: 'Product not found' });
    }

    if (!existingProduct.is_deleted) {
      return res.status(400).json({ error: 'Product is not deleted' });
    }

    await new Promise<void>((resolve, reject) => {
      db.run(
        'UPDATE products SET is_deleted = 0, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        [id],
        function (err) {
          if (err) reject(err);
          else resolve();
        }
      );
    });

    // Log audit action
    await logAuditAction(
      'restore',
      req.user!.email,
      Number(id),
      existingProduct.name,
      'Product restored from deleted state'
    );

    res.json({ message: 'Product restored successfully' });
  } catch (error) {
    console.error('Restore product error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router; 