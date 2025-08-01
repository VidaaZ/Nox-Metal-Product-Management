import { Types } from 'mongoose';

export interface User {
  _id: Types.ObjectId;
  email: string;
  full_name: string;
  password: string;
  role: 'admin' | 'user';
  created_at: Date;
  updated_at: Date;
}

export interface UserInput {
  email: string;
  full_name: string;
  password: string;
  role?: 'admin' | 'user';
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface Product {
  _id: Types.ObjectId;
  name: string;
  price: number;
  description?: string;
  is_deleted: boolean;
  created_by: Types.ObjectId;
  created_at: Date;
  updated_at: Date;
}

export interface ProductInput {
  name: string;
  price: number;
  description?: string;
}

export interface ProductUpdateInput extends Partial<ProductInput> {
  id: string;
}

export interface AuditLog {
  _id: Types.ObjectId;
  action: 'create' | 'update' | 'delete' | 'restore';
  user_email: string;
  product_id?: Types.ObjectId;
  product_name?: string;
  details?: string;
  timestamp: Date;
}

export interface AuthenticatedUser {
  id: string;
  email: string;
  full_name: string;
  role: 'admin' | 'user';
}

export interface ProductQuery {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: 'name' | 'price' | 'created_at';
  sortOrder?: 'asc' | 'desc';
  includeDeleted?: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
} 