// src/components/AdminRoute.jsx
import { Navigate } from "react-router-dom";
import { isAuthenticated } from "../auth/auth.js";

export default function AdminRoute({ children }) {
  const isAuth = isAuthenticated();
  
  if (!isAuth) {
    return <Navigate to="/" replace />;
  }

  // Check if user has admin role
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  
  if (user.role !== 'admin') {
    // Redirect to dashboard if user is not admin
    return <Navigate to="/dashboard" replace />;
  }

  return children;
} 