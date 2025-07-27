import axios from 'axios';
import type { 
  AuthResponse, 
  LoginCredentials, 
  RegisterCredentials, 
  User, 
  Product, 
  ProductInput, 
  ProductsResponse,
  ProductQuery,
  AuditLogsResponse
} from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await api.post('/auth/login', credentials);
    return response.data as AuthResponse;
  },

  register: async (credentials: RegisterCredentials): Promise<AuthResponse> => {
    const response = await api.post('/auth/register', credentials);
    return response.data as AuthResponse;
  },

  getProfile: async (): Promise<{ user: User }> => {
    const response = await api.get('/auth/profile');
    return response.data as { user: User };
  },

  refreshToken: async (): Promise<AuthResponse> => {
    const response = await api.post('/auth/refresh');
    return response.data as AuthResponse;
  },
};

// Products API
export const productsAPI = {
  getProducts: async (query: ProductQuery = {}): Promise<ProductsResponse> => {
    const response = await api.get('/products', { params: query });
    return response.data as ProductsResponse;
  },

  getProduct: async (id: number): Promise<Product> => {
    const response = await api.get(`/products/${id}`);
    return response.data as Product;
  },

  createProduct: async (product: ProductInput): Promise<{ message: string; id: number }> => {
    const response = await api.post('/products', product);
    return response.data as { message: string; id: number };
  },

  updateProduct: async (id: number, product: Partial<ProductInput>): Promise<{ message: string }> => {
    const response = await api.put(`/products/${id}`, product);
    return response.data as { message: string };
  },

  deleteProduct: async (id: number): Promise<{ message: string }> => {
    const response = await api.delete(`/products/${id}`);
    return response.data as { message: string };
  },

  restoreProduct: async (id: number): Promise<{ message: string }> => {
    const response = await api.patch(`/products/${id}/restore`);
    return response.data as { message: string };
  },
};

// Audit API
export const auditAPI = {
  getLogs: async (page: number = 1, limit: number = 20): Promise<AuditLogsResponse> => {
    const response = await api.get('/audit', { params: { page, limit } });
    return response.data as AuditLogsResponse;
  },
};

export default api; 