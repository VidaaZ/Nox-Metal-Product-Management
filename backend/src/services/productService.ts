import { Product as ProductModel, User as UserModel } from '../models/database.js';
import { Product, ProductInput, ProductQuery, PaginatedResponse } from '../types/index.js';
import { logAuditAction } from '../utils/auditLogger.js';
import { Types } from 'mongoose';

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

    const skip = (Number(page) - 1) * Number(limit);
    const showDeleted = isAdmin && String(includeDeleted) === 'true';
    
    // Build filter
    const filter: any = { is_deleted: showDeleted };

    // Add search filter
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Build sort
    const sort: any = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

    // Get total count
    const total = await ProductModel.countDocuments(filter);

    // Get products with populated creator info
    const foundProducts = await ProductModel
      .find(filter)
      .populate('created_by', 'email')
      .sort(sort)
      .skip(skip)
      .limit(Number(limit))
      .lean();

    const products: Product[] = foundProducts.map(product => ({
      _id: product._id,
      id: product._id.toString(), // Add this line
      name: product.name,
      price: product.price,
      description: product.description || undefined,
      is_deleted: product.is_deleted,
      created_by: product.created_by,
      created_at: (product as any).createdAt || new Date(),
      updated_at: (product as any).updatedAt || new Date()
    }));

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

  async getProduct(id: string, isAdmin: boolean): Promise<Product> {
    const filter: any = { _id: new Types.ObjectId(id) };
    if (!isAdmin) {
      filter.is_deleted = false;
    }

    const foundProduct = await ProductModel.findOne(filter).lean();

    if (!foundProduct) {
      throw new Error('Product not found');
    }

    const product: Product = {
      _id: foundProduct._id,
      id: foundProduct._id.toString(), // Add this line
      name: foundProduct.name,
      price: foundProduct.price,
      description: foundProduct.description || undefined,
      is_deleted: foundProduct.is_deleted,
      created_by: foundProduct.created_by,
      created_at: (foundProduct as any).createdAt || new Date(),
      updated_at: (foundProduct as any).updatedAt || new Date()
    };

    return product;
  }

  async createProduct(productData: ProductInput, userId: string, userEmail: string): Promise<{ id: string }> {
    const { name, price, description } = productData;

    if (!name || !price) {
      throw new Error('Name and price are required');
    }

    if (price <= 0) {
      throw new Error('Price must be greater than 0');
    }

    const newProduct = new ProductModel({
      name,
      price,
      description,
      created_by: new Types.ObjectId(userId),
      is_deleted: false
    });

    const savedProduct = await newProduct.save();

    await logAuditAction(
      'create',
      userEmail,
      savedProduct._id.toString(),
      name,
      'Product created'
    );

    return { id: savedProduct._id.toString() };
  }

  async updateProduct(id: string, productData: Partial<ProductInput>, userEmail: string): Promise<void> {
    const { name, price, description } = productData;

    const existingProduct = await ProductModel.findById(id);

    if (!existingProduct) {
      throw new Error('Product not found');
    }

    if (existingProduct.is_deleted) {
      throw new Error('Cannot update deleted product');
    }

    const updates: any = {};

    if (name !== undefined) {
      updates.name = name;
    }
    if (price !== undefined) {
      if (price <= 0) {
        throw new Error('Price must be greater than 0');
      }
      updates.price = price;
    }
    if (description !== undefined) {
      updates.description = description;
    }

    if (Object.keys(updates).length === 0) {
      throw new Error('No fields to update');
    }

    await ProductModel.findByIdAndUpdate(id, updates);

    await logAuditAction(
      'update',
      userEmail,
      id,
      existingProduct.name,
      'Product updated'
    );
  }

  async deleteProduct(id: string, userEmail: string): Promise<void> {
    const existingProduct = await ProductModel.findById(id);

    if (!existingProduct) {
      throw new Error('Product not found');
    }

    if (existingProduct.is_deleted) {
      throw new Error('Product is already deleted');
    }

    await ProductModel.findByIdAndUpdate(id, { is_deleted: true });

    await logAuditAction(
      'delete',
      userEmail,
      id,
      existingProduct.name,
      'Product soft deleted'
    );
  }

  async restoreProduct(id: string, userEmail: string): Promise<void> {
    const existingProduct = await ProductModel.findById(id);

    if (!existingProduct) {
      throw new Error('Product not found');
    }

    if (!existingProduct.is_deleted) {
      throw new Error('Product is not deleted');
    }

    await ProductModel.findByIdAndUpdate(id, { is_deleted: false });

    await logAuditAction(
      'restore',
      userEmail,
      id,
      existingProduct.name,
      'Product restored from deleted state'
    );
  }
}

export const productService = new ProductService();