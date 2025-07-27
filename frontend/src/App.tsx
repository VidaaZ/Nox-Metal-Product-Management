import React, { useState } from 'react';
import LoginForm from './components/auth/LoginForm';
import RegisterForm from './components/auth/RegisterForm';
import { authAPI } from './lib/api';
import type { LoginCredentials, RegisterCredentials } from './types';
import './App.css';

function App() {
  const [currentView, setCurrentView] = useState<'welcome' | 'login' | 'register'>('welcome');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);

  const handleLogin = async (credentials: LoginCredentials) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await authAPI.login(credentials);
      setUser(response.user);
      setCurrentView('welcome');
      alert(`Welcome ${response.user.email}! Role: ${response.user.role}`);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (credentials: RegisterCredentials) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await authAPI.register(credentials);
      setUser(response.user);
      setCurrentView('welcome');
      alert(`Account created! Welcome ${response.user.email}!`);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    setCurrentView('welcome');
  };

  if (currentView === 'login') {
    return (
      <LoginForm 
        onLogin={handleLogin}
        isLoading={isLoading}
        error={error}
        onSwitchToRegister={() => setCurrentView('register')}
        onBack={() => setCurrentView('welcome')}
      />
    );
  }

  if (currentView === 'register') {
    return (
      <RegisterForm 
        onRegister={handleRegister}
        isLoading={isLoading}
        error={error}
        onSwitchToLogin={() => setCurrentView('login')}
        onBack={() => setCurrentView('welcome')}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">
          🚀 Nox Metal Product Management
        </h1>
        
        {user && (
          <div className="max-w-md mx-auto mb-8 p-4 bg-green-50 border border-green-200 rounded-lg text-center">
            <p className="text-green-800">
              Welcome, <strong>{user.email}</strong> ({user.role})!
            </p>
            <button 
              onClick={handleLogout}
              className="mt-2 btn btn-secondary"
            >
              Logout
            </button>
          </div>
        )}

        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">
              Frontend & Backend Integration Test 🎉
            </h2>
            <p className="text-gray-600 mb-6">
              Test the authentication system and API integration.
            </p>

            {!user && (
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                <button 
                  onClick={() => setCurrentView('login')}
                  className="btn btn-primary"
                >
                  Test Login
                </button>
                <button 
                  onClick={() => setCurrentView('register')}
                  className="btn btn-secondary"
                >
                  Test Register
                </button>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="font-semibold text-green-800 mb-2">✅ Completed Backend Features:</h3>
                <ul className="text-green-700 space-y-1 text-sm">
                  <li>• JWT Authentication System</li>
                  <li>• Role-based Access Control</li>
                  <li>• Product CRUD Operations</li>
                  <li>• Audit Logging</li>
                  <li>• Search, Pagination, Sorting</li>
                  <li>• Soft Delete Functionality</li>
                </ul>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-blue-800 mb-2">🚧 Frontend Progress:</h3>
                <ul className="text-blue-700 space-y-1 text-sm">
                  <li>• ✅ Login/Register Forms</li>
                  <li>• ✅ API Integration</li>
                  <li>• ⏳ Product Management UI</li>
                  <li>• ⏳ Admin Dashboard</li>
                  <li>• ⏳ Search & Filtering</li>
                  <li>• ⏳ Audit Logs Viewer</li>
                </ul>
              </div>
            </div>
            <div className="mt-8 p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">
                <strong>API Status:</strong> Backend running on <code>http://localhost:3001</code><br/>
                <strong>Frontend:</strong> React app on <code>http://localhost:5173</code>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
