import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loader2 } from 'lucide-react';

export default function ProtectedRoute({ children, allowedRole }) {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#faf9f6] flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-orange-600" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRole && user.role !== allowedRole) {
    // If authenticated but wrong role, redirect to their correct dashboard
    if (user.role === 'customer') {
      return <Navigate to="/customer-dashboard" replace />;
    } else if (user.role === 'restaurant') {
      return <Navigate to="/restaurant-dashboard" replace />;
    }
    return <Navigate to="/" replace />;
  }

  return children;
}
