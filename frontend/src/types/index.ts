export interface User {
  id: number;
  email: string;
  full_name: string;
  role: 'admin' | 'user';
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  full_name: string;
  password: string;
  role?: 'admin' | 'user';
}

export interface AuthResponse {
  message: string;
  user: User;
  token: string;
}

export interface Product {
  id: string; // Change from number to string
  name: string;
  price: number;
  description?: string;
  image_url?: string;
  is_deleted: boolean;
  created_by: string; // Change from number to string
  created_at: string;
  updated_at: string;
  created_by_email?: string;
}

export interface ProductInput {
  name: string;
  price: number;
  description?: string;
  image_url?: string;
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

export interface ProductsResponse {
  data: Product[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
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

export interface AuditLogsResponse {
  data: AuditLog[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ProductQuery {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: 'name' | 'price' | 'created_at';
  sortOrder?: 'asc' | 'desc';
  includeDeleted?: boolean;
}

export interface ApiError {
  error: string;
  message?: string;
} 