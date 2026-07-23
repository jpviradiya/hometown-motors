import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Car, LogIn, UserPlus, LogOut, User as UserIcon, LayoutDashboard } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";

export const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const isAdmin = user?.role?.toLowerCase() === "admin";

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur-xs supports-backdrop-filter:bg-background/60">
      <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2 font-black text-xl tracking-tight text-primary">
          <Car className="h-6 w-6" />
          <span>Hometown Motors</span>
        </Link>

        {/* Center Nav Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <Link to="/" className="text-foreground/80 hover:text-foreground transition-colors">
            Home
          </Link>
          <Link to="/vehicles" className="text-foreground/80 hover:text-foreground transition-colors">
            Browse Vehicles
          </Link>
          {isAdmin && (
            <Link
              to="/admin"
              className="flex items-center gap-1 text-primary font-semibold hover:underline"
            >
              <LayoutDashboard className="h-4 w-4" />
              <span>Admin Dashboard</span>
            </Link>
          )}
        </nav>

        {/* Auth Navigation */}
        <div className="flex items-center gap-3">
          {isAuthenticated && user ? (
            <div className="flex items-center gap-3">
              {isAdmin && (
                <Link to="/admin" className="md:hidden">
                  <Button variant="outline" size="sm" className="cursor-pointer text-xs">
                    Admin
                  </Button>
                </Link>
              )}
              <div className="hidden sm:flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full bg-muted border">
                <UserIcon className="h-3.5 w-3.5 text-primary" />
                <span>{user.firstName || user.name || user.email}</span>
                {isAdmin && (
                  <span className="text-[10px] bg-primary text-primary-foreground px-1.5 py-0.5 rounded-sm uppercase">
                    Admin
                  </span>
                )}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="cursor-pointer"
              >
                <LogOut className="mr-1.5 h-4 w-4" />
                Logout
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login">
                <Button variant="ghost" size="sm" className="cursor-pointer">
                  <LogIn className="mr-1.5 h-4 w-4" />
                  Log In
                </Button>
              </Link>
              <Link to="/register">
                <Button size="sm" className="cursor-pointer">
                  <UserPlus className="mr-1.5 h-4 w-4" />
                  Register
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
