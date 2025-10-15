import storage from 'services/storage';
import { Navigate } from 'react-router-dom';
import { useAuth } from 'hooks/useAuth';

const PrivateRoute = ({ element, roles }: { element: JSX.Element, roles: string[] }) => {
  const token = storage.get('accessToken');
  const userData: any = storage.get("userData")

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  const userRole = JSON.parse(userData)
  if (roles && !roles.includes(userRole?.role)) {
    return <Navigate to="/404" replace />;
  }

  return element;
};

export default PrivateRoute;
