import { Routes, Route, Navigate } from "react-router-dom";
import HomePage from "../public-site/pages/HomePage";
import LoginPage from "../admin-site/pages/LoginPage";
import AdminLayout from "../admin-site/layouts/AdminLayout";
import ProtectedRoute from "../admin-site/components/ProtectedRoute";
import PertanianPage from "../admin-site/pages/PertanianPage";
import PeternakanPage from "../admin-site/pages/PeternakanPage";
import KonservasiPage from "../admin-site/pages/KonservasiPage";
import AkademikPage from "../admin-site/pages/AkademikPage";
import KemitraanPage from "../admin-site/pages/KemitraanPage";

const AppRoutes = () => (
  <Routes>
    {/* Public site */}
    <Route path="/" element={<HomePage />} />

    {/* Admin */}
    <Route path="/admin/login" element={<LoginPage />} />
    <Route
      path="/admin"
      element={
        <ProtectedRoute>
          <AdminLayout />
        </ProtectedRoute>
      }
    >
      <Route index element={<Navigate to="pertanian" replace />} />
      <Route path="pertanian"  element={<PertanianPage />} />
      <Route path="peternakan" element={<PeternakanPage />} />
      <Route path="konservasi" element={<KonservasiPage />} />
      <Route path="akademik"   element={<AkademikPage />} />
      <Route path="kemitraan"  element={<KemitraanPage />} />
    </Route>

    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
);

export default AppRoutes;
