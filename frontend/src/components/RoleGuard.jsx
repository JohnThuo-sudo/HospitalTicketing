import { Navigate } from "react-router-dom";
const RoleGuard = ({ children, roles }) => {
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user) {
    return <Navigate to="/staff" />;
  }
  if (!roles.includes(user.role)) {
    return <Navigate to="/staff" />;
  }
  return children;
};
export default RoleGuard;
