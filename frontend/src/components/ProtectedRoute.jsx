import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children, requireAuth = true }) => {
  const { user } = useAuth();
  const location = useLocation();

  // If authentication is required but user is not logged in
  if (requireAuth && !user) {
    return <Navigate to="/staff" state={{ from: location }} replace />;
  }

  // If user is logged in and trying to access login/register pages, redirect to dashboard
  if (!requireAuth && user) {
    const roleRoutes = {
      manager: "/hospital/admin",
      triage: "/staff/triage",
      doctor: "/staff/doctor",
      pharmacist: "/staff/pharmacy",
    };

    const dashboardRoute = roleRoutes[user.role] || "/staff";
    return <Navigate to={dashboardRoute} replace />;
  }

  return children;
};

export default ProtectedRoute;
