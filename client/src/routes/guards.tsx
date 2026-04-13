import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { Loader } from '@/components/ui/Loader';
import { useAuth } from '@/context/AuthContext';

export function ProtectedRoute({
  allowedRoles,
}: {
  allowedRoles?: Array<'admin' | 'user'>;
}) {
  const { isLoading, isAuthenticated, user } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <Loader />;
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/forbidden" replace />;
  }

  return <Outlet />;
}

export function PublicOnlyRoute() {
  const { isLoading, user } = useAuth();

  if (isLoading) {
    return <Loader />;
  }

  if (user?.role === 'admin') {
    return <Navigate to="/admin" replace />;
  }

  if (user?.role === 'user') {
    return <Navigate to="/app" replace />;
  }

  return <Outlet />;
}
