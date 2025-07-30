import { Request, Response } from 'express';
import { db } from '../models/database.js';
import { Product, ProductInput, ProductUpdateInput, ProductQuery, PaginatedResponse } from '../types/index.js';
import { logAuditAction } from '../utils/auditLogger.js';

export const getProducts = async (req: any, res: Response) => {
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
    
    const showDeleted = isAdmin && String(includeDeleted) === 'true';
    
    let whereClause = '';
    let searchClause = '';
    let params: any[] = [];

    // Build the WHERE clause based on showDeleted flag
    if (showDeleted) {
      // Show only deleted products
      whereClause = 'WHERE is_deleted = 1';
    } else {
      // Show only active (non-deleted) products
      whereClause = 'WHERE is_deleted = 0';
    }

    if (search) {
      searchClause = showDeleted 
        ? 'AND (name LIKE ? OR description LIKE ?)'
        : 'AND (name LIKE ? OR description LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    const orderClause = `ORDER BY ${sortBy} ${sortOrder}`;

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
};

export const getProduct = async (req: any, res: Response) => {
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
};

export const createProduct = async (req: any, res: Response) => {
  try {
    const { name, price, description }: ProductInput = req.body;

    if (!name || !price) {
      return res.status(400).json({ error: 'Name and price are required' });
    }

    if (price <= 0) {
      return res.status(400).json({ error: 'Price must be greater than 0' });
    }

    let image_url = null;
    if (req.file) {
      console.log('File uploaded:', req.file);
      image_url = `/uploads/${req.file.filename}`;
      console.log('Image URL set to:', image_url);
      
      // Check if file actually exists
      const fs = require('fs');
      const path = require('path');
      const filePath = path.join(process.cwd(), 'uploads', req.file.filename);
      console.log('Full file path:', filePath);
      console.log('File exists:', fs.existsSync(filePath));
      
      // List all files in uploads directory
      const uploadsDir = path.join(process.cwd(), 'uploads');
      if (fs.existsSync(uploadsDir)) {
        const files = fs.readdirSync(uploadsDir);
        console.log('Files in uploads directory:', files);
      }
    }

    // Get current time in Canada timezone
    const now = new Date();
    const canadaTime = new Date(now.toLocaleString("en-US", {timeZone: "America/Toronto"}));
    const timestamp = canadaTime.toISOString();

    const result = await new Promise<{ id: number }>((resolve, reject) => {
      db.run(
        'INSERT INTO products (name, price, description, image_url, created_by, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [name, price, description || null, image_url, req.user.id, timestamp, timestamp],
        function (err) {
          if (err) reject(err);
          else resolve({ id: this.lastID });
        }
      );
    });

    await logAuditAction(
      'create',
      req.user.email,
      result.id,
      name,
      'Product created'
    );

    res.status(201).json({
      message: 'Product created successfully',
      id: result.id,
      image_url
    });
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateProduct = async (req: any, res: Response) => {
  try {
    const { id } = req.params;
    const { name, price, description }: Partial<ProductInput> = req.body;

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
      return res.status(400).json({ error: 'Cannot update deleted product' });
    }

    // Update only provided fields
    const updates: string[] = [];
    const values: any[] = [];

    if (name !== undefined) {
      updates.push('name = ?');
      values.push(name);
    }
    if (price !== undefined) {
      if (price <= 0) {
        return res.status(400).json({ error: 'Price must be greater than 0' });
      }
      updates.push('price = ?');
      values.push(price);
    }
    if (description !== undefined) {
      updates.push('description = ?');
      values.push(description);
    }
    
    // Handle uploaded file
    if (req.file) {
      console.log('File uploaded in update:', req.file);
      updates.push('image_url = ?');
      values.push(`/uploads/${req.file.filename}`);
      console.log('Image URL updated to:', `/uploads/${req.file.filename}`);
      
      // Check if file actually exists
      const fs = require('fs');
      const path = require('path');
      const filePath = path.join(process.cwd(), 'uploads', req.file.filename);
      console.log('Full file path:', filePath);
      console.log('File exists:', fs.existsSync(filePath));
      
      // List all files in uploads directory
      const uploadsDir = path.join(process.cwd(), 'uploads');
      if (fs.existsSync(uploadsDir)) {
        const files = fs.readdirSync(uploadsDir);
        console.log('Files in uploads directory:', files);
      }
    }

    if (updates.length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }

    // Get current time in Canada timezone
    const now = new Date();
    const canadaTime = new Date(now.toLocaleString("en-US", {timeZone: "America/Toronto"}));
    const timestamp = canadaTime.toISOString();

    updates.push('updated_at = ?');
    values.push(timestamp);
    values.push(id);

    await new Promise<void>((resolve, reject) => {
      db.run(
        `UPDATE products SET ${updates.join(', ')} WHERE id = ?`,
        values,
        (err) => {
          if (err) reject(err);
          else resolve();
        }
      );
    });

    // Log audit action
    await logAuditAction(
      'update',
      req.user.email,
      Number(id),
      existingProduct.name,
      'Product updated'
    );

    res.json({ message: 'Product updated successfully' });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteProduct = async (req: any, res: Response) => {
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

    // Get current time in Canada timezone
    const now = new Date();
    const canadaTime = new Date(now.toLocaleString("en-US", {timeZone: "America/Toronto"}));
    const timestamp = canadaTime.toISOString();

    await new Promise<void>((resolve, reject) => {
      db.run(
        'UPDATE products SET is_deleted = 1, updated_at = ? WHERE id = ?',
        [timestamp, id],
        function (err) {
          if (err) reject(err);
          else resolve();
        }
      );
    });

    // Log audit action
    await logAuditAction(
      'delete',
      req.user.email,
      Number(id),
      existingProduct.name,
      'Product soft deleted'
    );

    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const restoreProduct = async (req: any, res: Response) => {
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

    // Get current time in Canada timezone
    const now = new Date();
    const canadaTime = new Date(now.toLocaleString("en-US", {timeZone: "America/Toronto"}));
    const timestamp = canadaTime.toISOString();

    await new Promise<void>((resolve, reject) => {
      db.run(
        'UPDATE products SET is_deleted = 0, updated_at = ? WHERE id = ?',
        [timestamp, id],
        function (err) {
          if (err) reject(err);
          else resolve();
        }
      );
    });

    // Log audit action
    await logAuditAction(
      'restore',
      req.user.email,
      Number(id),
      existingProduct.name,
      'Product restored from deleted state'
    );

    res.json({ message: 'Product restored successfully' });
  } catch (error) {
    console.error('Restore product error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}; 