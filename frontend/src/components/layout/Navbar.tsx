import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Car, LogIn, UserPlus, LogOut, User as UserIcon, LayoutDashboard, Menu, X, Home, ShoppingBag, ArrowLeft } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isAuthPage = location.pathname === "/login" || location.pathname === "/register";
  const isAdmin = user?.role?.toLowerCase() === "admin";

  const handleLogout = () => {
    logout();
    setIsMobileMenuOpen(false);
    navigate("/");
  };

  const isNavActive = (path: string) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  // Render simplified Authentication Header on login/register pages
  if (isAuthPage) {
    return (
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur-md supports-backdrop-filter:bg-background/80 shadow-xs">
        <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          <Link to="/" className="flex items-center gap-2.5 font-black text-xl tracking-tight text-primary transition-transform hover:scale-102">
            <div className="p-2 rounded-xl bg-primary text-primary-foreground shadow-xs">
              <Car className="h-5 w-5" />
            </div>
            <span className="tracking-tight">Hometown Motors</span>
          </Link>

          <Link to="/">
            <Button variant="ghost" size="sm" className="cursor-pointer font-semibold text-xs sm:text-sm">
              <ArrowLeft className="mr-1.5 h-4 w-4" />
              Back to Home
            </Button>
          </Link>
        </div>
      </header>
    );
  }

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

        {/* Center Nav Links - Desktop */}
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

        {/* Auth Navigation - Desktop */}
        <div className="hidden md:flex items-center gap-3">
          {isAuthenticated && user ? (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full bg-muted/80 border border-border/80">
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
                className="cursor-pointer text-xs min-h-[36px]"
              >
                <LogOut className="mr-1.5 h-3.5 w-3.5" />
                Logout
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login">
                <Button variant="ghost" size="sm" className="cursor-pointer font-medium min-h-[36px]">
                  <LogIn className="mr-1.5 h-4 w-4" />
                  Log In
                </Button>
              </Link>
              <Link to="/register">
                <Button size="sm" className="cursor-pointer font-bold shadow-xs min-h-[36px]">
                  <UserPlus className="mr-1.5 h-4 w-4" />
                  Register
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Hamburger Toggle Button */}
        <div className="flex items-center gap-2 md:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="cursor-pointer min-h-[40px] min-w-[40px]"
            aria-label="Toggle Navigation Menu"
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t bg-background/98 p-4 space-y-4 shadow-xl animate-in slide-in-from-top duration-200">
          <nav className="flex flex-col space-y-2">
            <Link
              to="/"
              onClick={() => setIsMobileMenuOpen(false)}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-all min-h-[44px]",
                isNavActive("/") && !isNavActive("/vehicles")
                  ? "bg-primary text-primary-foreground"
                  : "text-foreground hover:bg-muted"
              )}
            >
              <Home className="h-4 w-4" />
              <span>Home</span>
            </Link>

            <Link
              to="/vehicles"
              onClick={() => setIsMobileMenuOpen(false)}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-all min-h-[44px]",
                isNavActive("/vehicles")
                  ? "bg-primary text-primary-foreground"
                  : "text-foreground hover:bg-muted"
              )}
            >
              <ShoppingBag className="h-4 w-4" />
              <span>Browse Vehicles</span>
            </Link>

            {isAdmin && (
              <Link
                to="/admin"
                onClick={() => setIsMobileMenuOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-all min-h-[44px]",
                  isNavActive("/admin")
                    ? "bg-primary text-primary-foreground"
                    : "text-primary bg-primary/10 hover:bg-primary/20"
                )}
              >
                <LayoutDashboard className="h-4 w-4" />
                <span>Admin Console</span>
              </Link>
            )}
          </nav>

          <div className="pt-3 border-t">
            {isAuthenticated && user ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between px-2 text-xs font-semibold text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <UserIcon className="h-4 w-4 text-primary" />
                    <span className="text-foreground font-bold truncate">
                      {user.firstName || user.name || user.email}
                    </span>
                  </div>
                  {isAdmin && <Badge variant="default">Admin</Badge>}
                </div>
                <Button
                  variant="outline"
                  onClick={handleLogout}
                  className="w-full cursor-pointer min-h-[44px] font-bold"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button variant="outline" className="w-full cursor-pointer min-h-[44px] font-semibold">
                    <LogIn className="mr-1.5 h-4 w-4" />
                    Log In
                  </Button>
                </Link>
                <Link to="/register" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button className="w-full cursor-pointer min-h-[44px] font-bold">
                    <UserPlus className="mr-1.5 h-4 w-4" />
                    Register
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
