import { Navigate, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";

function PublicRoute() {

    const { auth } = useAuth();

    return auth.accessToken
        ? <Navigate to="/dashboard" replace />
        : <Outlet />;
}

export default PublicRoute;