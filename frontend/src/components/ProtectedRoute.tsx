import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import AccessDenied from './AccessDenied';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requireAdmin = false 
}) => {
  const { isAuthenticated, user, isLoading } = useAuth();
  const location = useLocation();

  console.log('ProtectedRoute debug:', {
    isAuthenticated,
    userRole: user?.role,
    requireAdmin,
    pathname: location.pathname
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Wait for authentication to be determined
  if (isLoading || (isAuthenticated === false && user === null)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirect to auth with the attempted location
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  if (requireAdmin && user?.role !== 'admin') {
    // Show access denied page instead of redirecting
    console.log('Access denied: User role is', user?.role, 'but admin is required');
    return <AccessDenied />;
  }

  // Debug: Log what's happening
  console.log('ProtectedRoute: Rendering component', {
    isAuthenticated,
    userRole: user?.role,
    requireAdmin,
    pathname: location.pathname
  });

  return <>{children}</>;
};

export default ProtectedRoute; 