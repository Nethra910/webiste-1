import { Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Unauthorized from "./pages/Unauthorized";

import ProtectedRoute from "./components/ProtectedRoute";
import RoleProtectedRoute from "./components/RoleProtectedRoute";
import PublicRoute from "./components/PublicRoute";
import PersistLogin from "./components/PersistLogin";
import DashboardRedirect from "./components/DashboardRedirect";

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route element={<PublicRoute />}>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      {/* Protected Routes */}
      <Route element={<PersistLogin />}>
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<DashboardRedirect />} />
          <Route path="/unauthorized" element={<Unauthorized />} />

          <Route element={<RoleProtectedRoute allowedRoles={["customer"]} />}>
            <Route path="/customer/dashboard" element={<Dashboard />} />
          </Route>

          <Route element={<RoleProtectedRoute allowedRoles={["admin"]} />}>
            <Route path="/admin/dashboard" element={<Dashboard />} />
          </Route>
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
