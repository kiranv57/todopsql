import React from "react";
import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const token = localStorage.getItem("token"); // Check for JWT token

  if (!token) {
    // If no token, redirect to the login page
    return <Navigate to="/signin" replace />;
  }

  return <>{children}</>; // Render the protected component
};

export default ProtectedRoute;