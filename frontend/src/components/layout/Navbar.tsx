import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Car, LogIn, UserPlus, LogOut, User as UserIcon, LayoutDashboard } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isAdmin = user?.role?.toLowerCase() === "admin";

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const isNavActive = (path: string) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur-md supports-backdrop-filter:bg-background/80 shadow-xs">
      <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2.5 font-black text-xl tracking-tight text-primary transition-transform hover:scale-102">
          <div className="p-2 rounded-xl bg-primary text-primary-foreground shadow-xs">
            <Car className="h-5 w-5" />
          </div>
          <span className="tracking-tight">Hometown Motors</span>
        </Link>

        {/* Center Nav Links */}
        <nav className="hidden md:flex items-center gap-1 text-sm font-medium">
          <Link
            to="/"
            className={cn(
              "px-3 py-2 rounded-lg transition-all",
              isNavActive("/") && !isNavActive("/vehicles")
                ? "bg-primary/10 text-primary font-bold"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
            )}
          >
            Home
          </Link>
          <Link
            to="/vehicles"
            className={cn(
              "px-3 py-2 rounded-lg transition-all",
              isNavActive("/vehicles")
                ? "bg-primary/10 text-primary font-bold"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
            )}
          >
            Browse Inventory
          </Link>
          {isAdmin && (
            <Link
              to="/admin"
              className={cn(
                "flex items-center gap-1.5 px-3 py-2 rounded-lg transition-all",
                isNavActive("/admin")
                  ? "bg-primary text-primary-foreground font-bold shadow-xs"
                  : "text-primary font-semibold hover:bg-primary/10"
              )}
            >
              <LayoutDashboard className="h-4 w-4" />
              <span>Admin Console</span>
            </Link>
          )}
        </nav>

        {/* Auth Navigation */}
        <div className="flex items-center gap-3">
          {isAuthenticated && user ? (
            <div className="flex items-center gap-3">
              {isAdmin && (
                <Link to="/admin" className="md:hidden">
                  <Badge variant="default" className="cursor-pointer">
                    Admin
                  </Badge>
                </Link>
              )}
              <div className="hidden sm:flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full bg-muted/80 border border-border/80">
                <UserIcon className="h-3.5 w-3.5 text-primary" />
                <span>{user.firstName || user.name || user.email}</span>
                {isAdmin && (
                  <Badge variant="default" className="px-1.5 py-0 text-[10px] uppercase font-bold">
                    Admin
                  </Badge>
                )}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="cursor-pointer text-xs"
              >
                <LogOut className="mr-1.5 h-3.5 w-3.5" />
                Logout
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login">
                <Button variant="ghost" size="sm" className="cursor-pointer font-medium">
                  <LogIn className="mr-1.5 h-4 w-4" />
                  Log In
                </Button>
              </Link>
              <Link to="/register">
                <Button size="sm" className="cursor-pointer font-bold shadow-xs">
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
