import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import type { LoginCredentials, RegisterCredentials } from '../../types';

type AuthMode = 'login' | 'register';

const AuthForm: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, register, isLoading, error } = useAuth();
  
  const [mode, setMode] = useState<AuthMode>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [credentials, setCredentials] = useState({
    email: '',
    password: '',
    role: 'user' as 'user' | 'admin'
  });

  const from = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (mode === 'login') {
        const loginData: LoginCredentials = {
          email: credentials.email,
          password: credentials.password
        };
        await login(loginData);
      } else {
        const registerData: RegisterCredentials = {
          email: credentials.email,
          password: credentials.password,
          role: credentials.role
        };
        await register(registerData);
      }
      navigate(from, { replace: true });
    } catch (error) {
      // Error handled by context
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const toggleMode = () => {
    setMode(mode === 'login' ? 'register' : 'login');
    // Clear any existing errors when switching modes
    setCredentials({
      email: '',
      password: '',
      role: 'user'
    });
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center px-4"
      style={{
        background: 'linear-gradient(135deg, #4ade80 0%, #22d3ee 100%)'
      }}
    >
      <div style={{ width: '600px' }}>
        {/* Form Card */}
        <div className="bg-white rounded-3xl shadow-lg px-20 py-12">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-medium text-teal-600">
              {mode === 'login' ? 'Login' : 'Sign Up'}
            </h1>
          </div>

          {error && (
            <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
              {error}
            </div>
          )}
          
          <div className="px-8">
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-teal-400 text-gray-700 placeholder-gray-500"
                  placeholder="Email"
                  value={credentials.email}
                  onChange={handleChange}
                  disabled={isLoading}
                />
              </div>
              
              <div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-teal-400 text-gray-700 placeholder-gray-500"
                  placeholder="Password"
                  value={credentials.password}
                  onChange={handleChange}
                  disabled={isLoading}
                  minLength={6}
                />
              </div>

              {mode === 'login' && (
                <div className="flex items-center text-sm">
                  <input
                    id="showPassword"
                    type="checkbox"
                    checked={showPassword}
                    onChange={(e) => setShowPassword(e.target.checked)}
                    className="h-4 w-4 text-teal-500 focus:ring-teal-400 border-gray-300 rounded"
                  />
                  <label htmlFor="showPassword" className="ml-2 text-gray-600">
                    Show Password
                  </label>
                </div>
              )}

              {mode === 'register' && (
                <div>
                  <select
                    id="role"
                    name="role"
                    value={credentials.role}
                    onChange={handleChange}
                    disabled={isLoading}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-teal-400 text-gray-700"
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
              )}

              <div className="pt-6">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-teal-500 hover:bg-teal-600 text-white font-semibold py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-200 disabled:opacity-50 transition-colors"
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      {mode === 'login' ? 'SIGNING IN...' : 'CREATING ACCOUNT...'}
                    </span>
                  ) : (
                    mode === 'login' ? 'SIGN IN' : 'CREATE ACCOUNT'
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Bottom Links */}
          <div className="mt-8 text-center space-y-2">
            {mode === 'login' && (
              <p className="text-sm text-gray-500">
                Forgot{' '}
                <span className="text-teal-500 hover:text-teal-600 cursor-pointer">Username</span>
                {' / '}
                <span className="text-teal-500 hover:text-teal-600 cursor-pointer">Password</span>
                ?
              </p>
            )}
            <p className="text-sm text-gray-500">
              {mode === 'login' ? "Don't have an account? " : "Already have an account? "}
              <button
                type="button"
                onClick={toggleMode}
                className="text-teal-500 hover:text-teal-600 font-medium"
              >
                {mode === 'login' ? 'Sign up' : 'Sign in'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthForm; 