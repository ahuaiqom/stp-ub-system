import { Navigate, useLocation } from "react-router-dom";
import type { ReactNode } from "react";
import { useAuth } from "../context/AuthContext";

interface Props {
  children: ReactNode;
  requireRole?: string;
}

const ProtectedRoute = ({ children, requireRole }: Props) => {
  const { user, initializing, hasRole } = useAuth();
  const location = useLocation();

  if (initializing) {
    return (
      <div style={{ padding: 80, color: "#1A4D2E", fontWeight: 600 }}>
        Memuat sesi…
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/admin/login" state={{ from: location.pathname }} replace />;
  }

  if (requireRole && !hasRole(requireRole)) {
    return <Navigate to="/admin" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
