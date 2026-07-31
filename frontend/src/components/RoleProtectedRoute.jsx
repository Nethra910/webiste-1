import { Navigate, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";

function RoleProtectedRoute({ allowedRoles = [] }) {
  const { auth } = useAuth();
  const role = auth.user?.role;

  if (!role) {
    return <Navigate to="/dashboard" replace />;
  }

  return allowedRoles.includes(role) ? (
    <Outlet />
  ) : (
    <Navigate to="/unauthorized" replace />
  );
}

export default RoleProtectedRoute;
