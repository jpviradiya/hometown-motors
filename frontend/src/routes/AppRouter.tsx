import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import HomePage from "../pages/customer/HomePage";
import VehicleListPage from "../pages/customer/VehicleListPage";
import VehicleDetailPage from "../pages/customer/VehicleDetailPage";
import LoginPage from "../pages/auth/LoginPage";
import RegisterPage from "../pages/auth/RegisterPage";
import ProtectedRoute from "./ProtectedRoute";
import AdminRoute from "./AdminRoute";

// Admin Module Components & Pages
import AdminLayout from "../layouts/AdminLayout";
import DashboardPage from "../pages/admin/DashboardPage";
import VehicleManagementPage from "../pages/admin/VehicleManagementPage";
import AddVehiclePage from "../pages/admin/AddVehiclePage";
import EditVehiclePage from "../pages/admin/EditVehiclePage";

function AppRouter() {
  return (
    <Routes>
      {/* Protected Admin Module Routes */}
      <Route element={<AdminRoute />}>
        <Route element={<AdminLayout />}>
          <Route path="/admin" element={<DashboardPage />} />
          <Route path="/admin/vehicles" element={<VehicleManagementPage />} />
          <Route path="/admin/vehicles/new" element={<AddVehiclePage />} />
          <Route path="/admin/vehicles/:id/edit" element={<EditVehiclePage />} />
        </Route>
      </Route>

      {/* Customer Module & Main Storefront Layout Routes */}
      <Route
        path="*"
        element={
          <div className="flex min-h-screen flex-col bg-background">
            <Navbar />
            <main className="flex-1">
              <Routes>
                {/* Public Customer Routes */}
                <Route path="/" element={<HomePage />} />
                <Route path="/vehicles" element={<VehicleListPage />} />
                <Route path="/vehicles/:id" element={<VehicleDetailPage />} />

                {/* Authentication Routes */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />

                {/* Protected Customer Routes */}
                <Route element={<ProtectedRoute />}>
                  <Route path="/protected" element={<Navigate to="/" replace />} />
                </Route>

                {/* Fallback 404 Route */}
                <Route
                  path="*"
                  element={
                    <div className="flex h-full min-h-[400px] items-center justify-center p-6 text-center">
                      <div className="space-y-2">
                        <h1 className="text-3xl font-extrabold tracking-tight">404 - Page Not Found</h1>
                        <p className="text-sm text-muted-foreground">The page you are looking for does not exist.</p>
                      </div>
                    </div>
                  }
                />
              </Routes>
            </main>
          </div>
        }
      />
    </Routes>
  );
}

export default AppRouter;
