// src/components/PrivateRoute.jsx
import { Navigate } from "react-router-dom";
import { isAuthenticated } from "../auth/auth.js"; // Adjust the import path as necessary

export default function PrivateRoute({ children }) {
  return isAuthenticated() ? children : <Navigate to="/" replace />;
}
