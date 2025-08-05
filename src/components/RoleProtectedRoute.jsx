import { Navigate, useLocation } from "react-router-dom";
import { hasPermissionForRoute } from "../utils/rolesPermisos";

const RoleProtectedRoute = ({ children, userRole }) => {
  const location = useLocation();
  const hasPermission = hasPermissionForRoute(userRole, location.pathname);

  if (!hasPermission) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default RoleProtectedRoute;
