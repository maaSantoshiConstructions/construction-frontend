import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Loader from '../common/Loader';

export default function ProtectedRoute({ roles, redirectTo, children }) {
  const { user, loading } = useAuth();

  if (loading) return <Loader />;

  if (!user) return <Navigate to={redirectTo || '/login'} replace />;

  if (roles && !roles.includes(user.role)) return <Navigate to="/" replace />;

  return children ? children : <Outlet />;
}
