import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '../app/store';
import type { ReactNode } from 'react';

interface Props {
  children: ReactNode;
  role?: 'admin' | 'seller' | 'customer';
}

export default function ProtectedRoute({ children, role }: Props) {
  const { isAuthenticated, user } = useSelector((s: RootState) => s.auth);
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  if (role && user?.role !== role) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
