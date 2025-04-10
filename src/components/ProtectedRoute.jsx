import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';

const ProtectedRoute = ({ children }) => {
  const { session, loading } = useAuthStore();
  const location = useLocation();

  if (loading) {
    return <div className="h-screen flex justify-center items-center">Loading...</div>;
  }

  if (!session) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
