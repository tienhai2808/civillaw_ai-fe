import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';

const PublicOnlyRoute = ({ children }) => {
  const { session, loading } = useAuthStore();

  if (loading) {
    return <div className="h-screen flex justify-center items-center">Loading...</div>;
  }

  if (session) {
    return <Navigate to="/my-profile" replace />;
  }

  return children;
};

export default PublicOnlyRoute;
