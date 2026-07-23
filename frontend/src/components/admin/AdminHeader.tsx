import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, Menu, User as UserIcon, X, ShieldAlert } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { AdminSidebar } from "./AdminSidebar";

export const AdminHeader: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <>
      <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b bg-background/95 px-4 md:px-6 backdrop-blur-xs supports-backdrop-filter:bg-background/60">
        <div className="flex items-center gap-3">
          {/* Mobile Drawer Trigger */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMobileMenuOpen(true)}
            className="md:hidden cursor-pointer"
            aria-label="Open Mobile Menu"
          >
            <Menu className="h-5 w-5" />
          </Button>

          <div className="hidden md:flex items-center gap-2">
            <ShieldAlert className="h-5 w-5 text-primary" />
            <span className="font-bold text-sm text-foreground">Admin Portal</span>
          </div>
        </div>

        {/* User Profile & Logout */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full bg-muted border">
            <UserIcon className="h-3.5 w-3.5 text-primary" />
            <span className="max-w-[120px] truncate">
              {user?.firstName || user?.name || user?.email || "Admin User"}
            </span>
            <span className="text-[10px] bg-primary text-primary-foreground px-1.5 py-0.5 rounded-sm uppercase font-bold">
              ADMIN
            </span>
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
      </header>

      {/* Mobile Drawer Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs animate-in fade-in"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="relative flex w-64 max-w-xs flex-1 flex-col bg-card animate-in slide-in-from-left">
            <div className="absolute right-2 top-2 z-10">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMobileMenuOpen(false)}
                className="cursor-pointer"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            <AdminSidebar onNavigate={() => setIsMobileMenuOpen(false)} />
          </div>
        </div>
      )}
    </>
  );
};

export default AdminHeader;
