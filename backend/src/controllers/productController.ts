import { Request, Response } from 'express';
import { productService } from '../services/productService.js';
import { ProductInput, ProductQuery } from '../types/index.js';
import path from 'path';

export const getProducts = async (req: any, res: Response) => {
  try {
    const query: ProductQuery = req.query as any;
    const isAdmin = req.user?.role === 'admin';

    const response = await productService.getProducts(query, isAdmin);

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

    const product = await productService.getProduct(id, isAdmin);

    res.json(product);
  } catch (error) {
    console.error('Get product error:', error);
    if (error instanceof Error && error.message === 'Product not found') {
      return res.status(404).json({ error: 'Product not found' });
    }
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

    // Handle image upload
    let image_url: string | undefined;
    if (req.file) {
      const imageUrl = `/uploads/${req.file.filename}`; // Use relative URL
      image_url = imageUrl;
    }

    const result = await productService.createProduct(
      { name, price, description, image_url },
      req.user.id,
      req.user.email
    );

    res.status(201).json({
      message: 'Product created successfully',
      id: result.id
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

    // Handle image upload
    let image_url: string | undefined;
    if (req.file) {
      // Create the image URL based on the uploaded file
      const baseUrl = `${req.protocol}://${req.get('host')}`;
      image_url = `${baseUrl}/uploads/${req.file.filename}`;
    }

    await productService.updateProduct(
      id,
      { name, price, description, image_url },
      req.user.email
    );

    res.json({ message: 'Product updated successfully' });
  } catch (error) {
    console.error('Update product error:', error);
    if (error instanceof Error) {
      if (error.message === 'Product not found') {
        return res.status(404).json({ error: 'Product not found' });
      }
      if (error.message === 'Cannot update deleted product') {
        return res.status(400).json({ error: 'Cannot update deleted product' });
      }
      if (error.message === 'Price must be greater than 0') {
        return res.status(400).json({ error: 'Price must be greater than 0' });
      }
      if (error.message === 'No fields to update') {
        return res.status(400).json({ error: 'No fields to update' });
      }
    }
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteProduct = async (req: any, res: Response) => {
  try {
    const { id } = req.params;

    await productService.deleteProduct(id, req.user.email);

    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Delete product error:', error);
    if (error instanceof Error) {
      if (error.message === 'Product not found') {
        return res.status(404).json({ error: 'Product not found' });
      }
      if (error.message === 'Product is already deleted') {
        return res.status(400).json({ error: 'Product is already deleted' });
      }
    }
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const restoreProduct = async (req: any, res: Response) => {
  try {
    const { id } = req.params;

    await productService.restoreProduct(id, req.user.email);

    res.json({ message: 'Product restored successfully' });
  } catch (error) {
    console.error('Restore product error:', error);
    if (error instanceof Error) {
      if (error.message === 'Product not found') {
        return res.status(404).json({ error: 'Product not found' });
      }
      if (error.message === 'Product is not deleted') {
        return res.status(400).json({ error: 'Product is not deleted' });
      }
    }
    res.status(500).json({ error: 'Internal server error' });
  }
}; 