import { Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

function DashboardRedirect() {
  const { auth } = useAuth();
  const role = auth.user?.role;

  if (role === "admin") {
    return <Navigate to="/admin/dashboard" replace />;
  }

  if (role === "customer") {
    return <Navigate to="/customer/dashboard" replace />;
  }

  return <Navigate to="/unauthorized" replace />;
}

export default DashboardRedirect;
