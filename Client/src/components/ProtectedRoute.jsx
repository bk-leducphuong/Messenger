import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function ProtectedRoute({ children }) {
  const {user, loading, error} = useSelector((store) => store.user);

  if (!user.id) {
    return <Navigate to="/login" replace />;
  }

  return children;
}