import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Register from "../pages/Register";
import StaffLogin from "../pages/StaffLogin";
import AdminDashboard from "../pages/Admin/Dashboard";
import Ticket from "../pages/Ticket";
import ProtectedRoute from "../components/ProtectedRoute";
import RoleGuard from "../components/RoleGuard";
import CreateStaff from "../pages/Admin/CreateStaff";
import ManageStaff from "../pages/Admin/ManageStaff";
import Dashboard from "../components/Dashboard";
import Profile from "../pages/Profile";
import ErrorPage from "../components/ErrorPage";

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route
        path="/register"
        element={
          <ProtectedRoute requireAuth={false}>
            <Register />
          </ProtectedRoute>
        }
      />
      <Route
        path="/staff"
        element={
          <ProtectedRoute requireAuth={false}>
            <StaffLogin />
          </ProtectedRoute>
        }
      />

      <Route
        path="/hospital/admin"
        element={
          <ProtectedRoute>
            <RoleGuard roles={["manager"]}>
              <AdminDashboard />
            </RoleGuard>
          </ProtectedRoute>
        }
      />
      <Route
        path="/hospital/admin/create-staff"
        element={
          <ProtectedRoute>
            <RoleGuard roles={["manager"]}>
              <CreateStaff />
            </RoleGuard>
          </ProtectedRoute>
        }
      />
      <Route
        path="/hospital/admin/manage-staff"
        element={
          <ProtectedRoute>
            <RoleGuard roles={["manager"]}>
              <ManageStaff />
            </RoleGuard>
          </ProtectedRoute>
        }
      />

      <Route
        path="/staff/triage"
        element={
          <ProtectedRoute>
            <RoleGuard roles={["triage"]}>
              <Dashboard />
            </RoleGuard>
          </ProtectedRoute>
        }
      />
      <Route
        path="/staff/doctor"
        element={
          <ProtectedRoute>
            <RoleGuard roles={["doctor"]}>
              <Dashboard />
            </RoleGuard>
          </ProtectedRoute>
        }
      />
      <Route
        path="/staff/pharmacy"
        element={
          <ProtectedRoute>
            <RoleGuard roles={["pharmacist"]}>
              <Dashboard />
            </RoleGuard>
          </ProtectedRoute>
        }
      />

      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />

      <Route
        path="/staff/:role/ticket/:id"
        element={
          <ProtectedRoute>
            <Ticket />
          </ProtectedRoute>
        }
      />

      {/* Error routes */}
      <Route path="/error" element={<ErrorPage />} />
      <Route
        path="*"
        element={
          <ErrorPage
            title="Page Not Found"
            message="The page you're looking for doesn't exist."
          />
        }
      />
    </Routes>
  );
};

export default AppRouter;
