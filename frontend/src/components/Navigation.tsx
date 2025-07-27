import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Navigation: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <nav className="bg-white shadow-lg border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/dashboard" className="flex-shrink-0 flex items-center">
              <h1 className="text-xl font-bold text-gray-800">
                Nox Metal
              </h1>
            </Link>
            
            <div className="hidden md:block ml-10">
              <div className="flex space-x-8">
                <Link
                  to="/dashboard"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive('/dashboard')
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  Dashboard
                </Link>
                
                <Link
                  to="/products"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive('/products')
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  Products
                </Link>
                
                {user?.role === 'admin' && (
                  <Link
                    to="/audit-logs"
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive('/audit-logs')
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    Audit Logs
                  </Link>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">
                {user?.email}
              </span>
              <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                user?.role === 'admin' 
                  ? 'bg-purple-100 text-purple-800' 
                  : 'bg-green-100 text-green-800'
              }`}>
                {user?.role}
              </span>
            </div>
            
            <button
              onClick={handleLogout}
              className="bg-gray-200 text-gray-700 px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-300 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      <div className="md:hidden border-t border-gray-200">
        <div className="px-2 pt-2 pb-3 space-y-1">
          <Link
            to="/dashboard"
            className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
              isActive('/dashboard')
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            Dashboard
          </Link>
          
          <Link
            to="/products"
            className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
              isActive('/products')
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            Products
          </Link>
          
          {user?.role === 'admin' && (
            <Link
              to="/audit-logs"
              className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                isActive('/audit-logs')
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              Audit Logs
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navigation; 