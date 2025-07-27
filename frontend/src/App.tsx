import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import AuthForm from './components/auth/AuthForm';
import ProtectedRoute from './components/ProtectedRoute';
import Dashboard from './components/Dashboard';
import ProductManagement from './components/ProductManagement';
import AuditLogs from './components/AuditLogs';
import Navigation from './components/Navigation';
import './App.css';

function App() {
  const { isAuthenticated, user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {isAuthenticated && <Navigation />}
      
      <Routes>
        {/* Public routes */}
        <Route 
          path="/auth" 
          element={
            isAuthenticated ? 
            <Navigate to="/dashboard" replace /> : 
            <AuthForm />
          } 
        />
        
        {/* Protected routes */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/products" 
          element={
            <ProtectedRoute>
              <ProductManagement />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/audit-logs" 
          element={
            <ProtectedRoute requireAdmin>
              <AuditLogs />
            </ProtectedRoute>
          } 
        />
        
        {/* Backwards compatibility redirects */}
        <Route path="/login" element={<Navigate to="/auth" replace />} />
        <Route path="/register" element={<Navigate to="/auth" replace />} />
        
        {/* Default redirects */}
        <Route 
          path="/" 
          element={
            isAuthenticated ? 
            <Navigate to="/dashboard" replace /> : 
            <Navigate to="/auth" replace />
          } 
        />
        
        {/* 404 fallback */}
        <Route 
          path="*" 
          element={
            <div className="min-h-screen flex items-center justify-center">
              <div className="text-center">
                <h1 className="text-4xl font-bold text-gray-800 mb-4">404</h1>
                <p className="text-gray-600">Page not found</p>
              </div>
            </div>
          } 
        />
      </Routes>
    </div>
  );
}

export default App;
