export interface User {
  id: number;
  email: string;
  full_name: string;
  password: string;
  role: 'admin' | 'user';
  created_at: string;
  updated_at: string;
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
  id: number;
  name: string;
  price: number;
  description?: string;
  is_deleted: boolean;
  created_by: number;
  created_at: string;
  updated_at: string;
}

export interface ProductInput {
  name: string;
  price: number;
  description?: string;
}

export interface ProductUpdateInput extends Partial<ProductInput> {
  id: number;
}

export interface AuditLog {
  id: number;
  action: 'create' | 'update' | 'delete' | 'restore';
  user_email: string;
  product_id?: number;
  product_name?: string;
  details?: string;
  timestamp: string;
}

export interface AuthenticatedUser {
  id: number;
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