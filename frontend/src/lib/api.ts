import axios from 'axios';
import type { 
  AuthResponse, 
  User, 
  Product, 
  PaginatedResponse, 
  AuditLog 
} from '../types';

// API base URL - use environment variable or default to localhost for development
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

console.log('API Base URL:', API_BASE_URL);
console.log('Environment:', import.meta.env.MODE);

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('Adding auth token to request:', config.url);
    } else {
      console.log('No auth token found for request:', config.url);
    }
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => {
    console.log('API Response:', response.config.url, response.status);
    return response;
  },
  (error) => {
    console.error('API Error:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
      url: error.config?.url
    });
    
    if (error.response?.status === 401) {
      console.log('Unauthorized request, clearing auth data');
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
      // Don't redirect on login errors, let the component handle it
      if (!error.config?.url?.includes('/auth/login')) {
        window.location.href = '/auth';
      }
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: async (credentials: { email: string; password: string }) => {
    const response = await api.post('/auth/login', credentials);
    return response.data as AuthResponse;
  },

  register: async (credentials: { email: string; full_name: string; password: string; role?: string }) => {
    const response = await api.post('/auth/register', credentials);
    return response.data as AuthResponse;
  },

  getProfile: async () => {
    const response = await api.get('/auth/profile');
    return response.data as { user: User };
  },
};

export const productsAPI = {
  getProducts: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    sortBy?: string;
    sortOrder?: string;
    includeDeleted?: boolean;
  }) => {
    const response = await api.get('/products', { params });
    return response.data as PaginatedResponse<Product>;
  },

  getProduct: async (id: string) => {
    const response = await api.get(`/products/${id}`);
    return response.data as Product;
  },

  createProduct: async (product: { name: string; price: number; description?: string }) => {
    const response = await api.post('/products', product);
    return response.data;
  },

  updateProduct: async (id: string, product: Partial<{ name: string; price: number; description: string }>) => {
    const response = await api.put(`/products/${id}`, product);
    return response.data;
  },

  deleteProduct: async (id: string) => {
    const response = await api.delete(`/products/${id}`);
    return response.data;
  },

  restoreProduct: async (id: string) => {
    const response = await api.patch(`/products/${id}/restore`);
    return response.data;
  },
};

export const auditAPI = {
  getLogs: async (params?: { page?: number; limit?: number }) => {
    const response = await api.get('/audit', { params });
    return response.data as PaginatedResponse<AuditLog>;
  },
};

export default api; 