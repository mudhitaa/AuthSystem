import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Blocks unauthenticated users — redirects to /login
export const ProtectedRoute = () => {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) return <div className="flex items-center justify-center h-screen text-gray-500">Loading…</div>;
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

// Blocks authenticated users from seeing login/signup — redirects to /dashboard
export const PublicRoute = () => {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) return <div className="flex items-center justify-center h-screen text-gray-500">Loading…</div>;
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : <Outlet />;
};
