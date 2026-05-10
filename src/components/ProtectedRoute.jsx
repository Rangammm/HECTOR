import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import LoadingSpinner from './LoadingSpinner.jsx';

export default function ProtectedRoute({ children }) {
  const { session, loading } = useAuth();

  if (loading) return <LoadingSpinner />;
  if (!session) return <Navigate to="/login" replace />;

  return children;
}
