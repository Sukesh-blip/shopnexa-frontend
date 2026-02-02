import React from "react";
import { Navigate, useLocation } from "react-router-dom";

/**
 * ProtectedRoute component to shield sensitive pages.
 * Checks for existence of token and optional role requirements.
 */
const ProtectedRoute = ({ children, requiredRole }) => {
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("userRole");
  const location = useLocation();

  if (!token) {
    // Redirect to appropriate login based on intended destination
    const loginPath = location.pathname.startsWith("/admindashboard") ? "/admin" : "/login";
    return <Navigate to={loginPath} state={{ from: location }} replace />;
  }

  if (requiredRole && userRole !== requiredRole) {
    // If user doesn't have required role, push to their respective home
    return <Navigate to={userRole === "ADMIN" ? "/admindashboard" : "/customerhome"} replace />;
  }

  return children;
};

export default ProtectedRoute;
