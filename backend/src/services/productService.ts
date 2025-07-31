import { db } from '../models/database.js';
import { Product, ProductInput, ProductQuery, PaginatedResponse } from '../types/index.js';
import { logAuditAction } from '../utils/auditLogger.js';

export class ProductService {
  async getProducts(query: ProductQuery, isAdmin: boolean): Promise<PaginatedResponse<Product>> {
    const {
      page = 1,
      limit = 10,
      search = '',
      sortBy = 'created_at',
      sortOrder = 'desc',
      includeDeleted = false
    } = query;

    const offset = (Number(page) - 1) * Number(limit);
    const showDeleted = isAdmin && String(includeDeleted) === 'true';
    
    let whereClause = '';
    let searchClause = '';
    let params: any[] = [];

    if (showDeleted) {
      whereClause = 'WHERE is_deleted = 1';
    } else {
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

    return {
      data: products,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / Number(limit))
      }
    };
  }

  async getProduct(id: number, isAdmin: boolean): Promise<Product> {
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
      throw new Error('Product not found');
    }

    return product;
  }

  async createProduct(productData: ProductInput, userId: number, userEmail: string): Promise<{ id: number }> {
    const { name, price, description } = productData;

    if (!name || !price) {
      throw new Error('Name and price are required');
    }

    if (price <= 0) {
      throw new Error('Price must be greater than 0');
    }

    const now = new Date();
    const canadaTime = new Date(now.toLocaleString("en-US", {timeZone: "America/Toronto"}));
    const timestamp = canadaTime.toISOString();

    const result = await new Promise<{ id: number }>((resolve, reject) => {
      db.run(
        'INSERT INTO products (name, price, description, created_by, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)',
        [name, price, description || null, userId, timestamp, timestamp],
        function (err) {
          if (err) reject(err);
          else resolve({ id: this.lastID });
        }
      );
    });

    await logAuditAction(
      'create',
      userEmail,
      result.id,
      name,
      'Product created'
    );

    return result;
  }

  async updateProduct(id: number, productData: Partial<ProductInput>, userEmail: string): Promise<void> {
    const { name, price, description } = productData;

    const existingProduct = await new Promise<Product | undefined>((resolve, reject) => {
      db.get('SELECT * FROM products WHERE id = ?', [id], (err, row: Product) => {
        if (err) reject(err);
        else resolve(row);
      });
    });

    if (!existingProduct) {
      throw new Error('Product not found');
    }

    if (existingProduct.is_deleted) {
      throw new Error('Cannot update deleted product');
    }

    const updates: string[] = [];
    const values: any[] = [];

    if (name !== undefined) {
      updates.push('name = ?');
      values.push(name);
    }
    if (price !== undefined) {
      if (price <= 0) {
        throw new Error('Price must be greater than 0');
      }
      updates.push('price = ?');
      values.push(price);
    }
    if (description !== undefined) {
      updates.push('description = ?');
      values.push(description);
    }

    if (updates.length === 0) {
      throw new Error('No fields to update');
    }

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

    await logAuditAction(
      'update',
      userEmail,
      Number(id),
      existingProduct.name,
      'Product updated'
    );
  }

  async deleteProduct(id: number, userEmail: string): Promise<void> {
    const existingProduct = await new Promise<Product | undefined>((resolve, reject) => {
      db.get('SELECT * FROM products WHERE id = ?', [id], (err, row: Product) => {
        if (err) reject(err);
        else resolve(row);
      });
    });

    if (!existingProduct) {
      throw new Error('Product not found');
    }

    if (existingProduct.is_deleted) {
      throw new Error('Product is already deleted');
    }

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

    await logAuditAction(
      'delete',
      userEmail,
      Number(id),
      existingProduct.name,
      'Product soft deleted'
    );
  }

  async restoreProduct(id: number, userEmail: string): Promise<void> {
    const existingProduct = await new Promise<Product | undefined>((resolve, reject) => {
      db.get('SELECT * FROM products WHERE id = ?', [id], (err, row: Product) => {
        if (err) reject(err);
        else resolve(row);
      });
    });

    if (!existingProduct) {
      throw new Error('Product not found');
    }

    if (!existingProduct.is_deleted) {
      throw new Error('Product is not deleted');
    }

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

    await logAuditAction(
      'restore',
      userEmail,
      Number(id),
      existingProduct.name,
      'Product restored from deleted state'
    );
  }
}

export const productService = new ProductService(); 