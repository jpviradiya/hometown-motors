import { Routes, Route } from "react-router-dom";
import LoginPage from "../pages/auth/LoginPage";
import RegisterPage from "../pages/auth/RegisterPage";
import ProtectedRoute from "./ProtectedRoute";
import AdminRoute from "./AdminRoute";
import { useAuth } from "../hooks/useAuth";
import { Button } from "../components/ui/button";

function HomePage() {
  const { user, logout, isAuthenticated } = useAuth();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-6 bg-background text-foreground">
      <div className="max-w-md w-full space-y-6 text-center">
        <h1 className="text-3xl font-bold tracking-tight">Hometown Motors</h1>
        {isAuthenticated && user ? (
          <div className="space-y-4 rounded-lg border p-6 shadow-xs bg-card">
            <p className="text-lg">
              Welcome, <span className="font-semibold">{user.firstName || user.name || user.email}</span>!
            </p>
            <p className="text-sm text-muted-foreground">
              Role: <span className="capitalize font-medium">{user.role}</span>
            </p>
            <Button onClick={logout} variant="outline" className="w-full cursor-pointer">
              Logout
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-muted-foreground">Welcome to Hometown Motors application.</p>
          </div>
        )}
      </div>
    </div>
  );
}

function AppRouter() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Public Home Route */}
      <Route path="/" element={<HomePage />} />

      {/* Protected Routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/protected" element={<HomePage />} />
      </Route>

      {/* Admin Routes */}
      <Route element={<AdminRoute />}>
        <Route path="/admin" element={<HomePage />} />
      </Route>

      {/* Fallback 404 Route */}
      <Route
        path="*"
        element={
          <div className="flex h-screen items-center justify-center">
            <h1 className="text-2xl font-bold">404 - Page Not Found</h1>
          </div>
        }
      />
    </Routes>
  );
}

export default AppRouter;
