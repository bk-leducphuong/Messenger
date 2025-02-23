import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function ProtectedRoute({ children }) {
  const {user, loading, error, isAuthenticated} = useSelector((store) => store.user);

  // if (!isAuthenticated && !loading && !error) {
  //   return <Navigate to="/login" replace />;
  // }

  return children;
}