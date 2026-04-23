import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user, loading } = useAuth();
  
  if (loading) return <div>Loading...</div>;
  
  console.log('ProtectedRoute - user:', user, 'allowedRoles:', allowedRoles);
  
  if (!user) {
    console.log('No user, redirect to login');
    return <Navigate to="/login" replace />;
  }
  
  if (allowedRoles.length && !allowedRoles.includes(user.role)) {
    console.log(`Role ${user.role} not allowed, redirect to unauthorized`);
    return <Navigate to="/unauthorized" replace />;
  }
  
  return children;
};

export default ProtectedRoute;