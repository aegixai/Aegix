import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem("authenticated");
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
