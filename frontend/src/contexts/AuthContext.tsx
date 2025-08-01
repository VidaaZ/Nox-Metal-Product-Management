import React, { createContext, useContext, useReducer, useEffect, useRef } from 'react';
import type { ReactNode } from 'react';
import type { User, LoginCredentials, RegisterCredentials } from '../types';
import { authAPI } from '../lib/api';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

type AuthAction =
  | { type: 'AUTH_START' }
  | { type: 'AUTH_SUCCESS'; payload: User }
  | { type: 'AUTH_ERROR'; payload: string }
  | { type: 'AUTH_LOGOUT' }
  | { type: 'CLEAR_ERROR' };

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'AUTH_START':
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    case 'AUTH_SUCCESS':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };
    case 'AUTH_ERROR':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload,
      };
    case 'AUTH_LOGOUT':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      };
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
}

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);
  const hasCheckedAuth = useRef(false);

 
  useEffect(() => {
    if (hasCheckedAuth.current) return;
    hasCheckedAuth.current = true;

    const checkAuth = async () => {
      const token = localStorage.getItem('auth_token');
      const storedUser = localStorage.getItem('user');

      console.log('AuthContext: Checking authentication...', { 
        hasToken: !!token, 
        hasStoredUser: !!storedUser,
        tokenLength: token?.length 
      });

      if (token && storedUser) {
        try {
          dispatch({ type: 'AUTH_START' });
          const { user } = await authAPI.getProfile();
          console.log('AuthContext: Profile check successful', user);
          dispatch({ type: 'AUTH_SUCCESS', payload: user });
        } catch (error) {
          console.error('AuthContext: Profile check failed', error);
          
          localStorage.removeItem('auth_token');
          localStorage.removeItem('user');
          dispatch({ type: 'AUTH_ERROR', payload: 'Session expired' });
        }
      } else {
        console.log('AuthContext: No token or stored user found');
        
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user');
      }
    };

    checkAuth();
  }, []);

  const login = async (credentials: LoginCredentials): Promise<void> => {
    try {
      console.log('AuthContext: Starting login for', credentials.email);
      dispatch({ type: 'AUTH_START' });
      
      const response = await authAPI.login(credentials);
      console.log('AuthContext: Login API response received', response);
      
      
      const userWithFullName = {
        ...response.user,
        full_name: response.user.full_name || response.user.email.split('@')[0]
      };
      
     
      localStorage.setItem('auth_token', response.token);
      localStorage.setItem('user', JSON.stringify(userWithFullName));
      
      console.log('AuthContext: Login successful, stored auth data');
      dispatch({ type: 'AUTH_SUCCESS', payload: userWithFullName });
    } catch (error: any) {
      console.error('AuthContext: Login error details:', error);
      
     
      let errorMessage = 'Login failed';
      
      if (error.response) {
       
        errorMessage = error.response.data?.error || `Login failed (${error.response.status})`;
      } else if (error.request) {
       
        errorMessage = 'Network error - please check your connection';
      } else {
        
        errorMessage = error.message || 'Login failed';
      }
      
      console.error('AuthContext: Login failed with message:', errorMessage);
      dispatch({ type: 'AUTH_ERROR', payload: errorMessage });
      throw error;
    }
  };

  const register = async (credentials: RegisterCredentials): Promise<void> => {
    try {
      console.log('AuthContext: Starting registration for', credentials.email);
      dispatch({ type: 'AUTH_START' });
      
      const response = await authAPI.register(credentials);
      console.log('AuthContext: Registration API response received', response);
      
    
      localStorage.setItem('auth_token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      
      console.log('AuthContext: Registration successful, stored auth data');
      dispatch({ type: 'AUTH_SUCCESS', payload: response.user });
    } catch (error: any) {
      console.error('AuthContext: Registration error details:', error);
      const errorMessage = error.response?.data?.error || 'Registration failed';
      dispatch({ type: 'AUTH_ERROR', payload: errorMessage });
      throw error;
    }
  };

  const logout = (): void => {
    console.log('AuthContext: Logging out user');
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    dispatch({ type: 'AUTH_LOGOUT' });
  };

  const clearError = (): void => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  const value: AuthContextType = {
    ...state,
    login,
    register,
    logout,
    clearError,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 