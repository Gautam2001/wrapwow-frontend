import { Navigate, Outlet, useLocation } from "react-router-dom";

const ProtectedRoute = ({ allowedRoles }) => {
  const loginData = sessionStorage.getItem("LoginData")
    ? JSON.parse(sessionStorage.getItem("LoginData"))
    : null;

  const accessToken = loginData?.accessToken;
  const role = loginData?.role;
  const isAuthenticated = !!accessToken;
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(role)) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
