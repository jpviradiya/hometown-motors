import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Car,
  PlusCircle,
  ShoppingBag,
  ShieldCheck,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface AdminSidebarProps {
  className?: string;
  onNavigate?: () => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({ className, onNavigate }) => {
  const location = useLocation();

  const navItems = [
    {
      title: "Dashboard",
      href: "/admin",
      icon: LayoutDashboard,
      exact: true,
    },
    {
      title: "Vehicle Inventory",
      href: "/admin/vehicles",
      icon: Car,
      exact: false,
    },
    {
      title: "Add New Vehicle",
      href: "/admin/vehicles/new",
      icon: PlusCircle,
      exact: true,
    },
  ];

  const isActive = (href: string, exact: boolean) => {
    if (exact) {
      return location.pathname === href;
    }
    return location.pathname.startsWith(href);
  };

  return (
    <aside className={cn("flex flex-col h-full bg-card border-r w-64 shadow-xs", className)}>
      {/* Sidebar Header */}
      <div className="flex h-16 items-center gap-2 px-6 border-b">
        <ShieldCheck className="h-6 w-6 text-primary shrink-0" />
        <div className="flex flex-col">
          <span className="font-bold text-base tracking-tight leading-none text-foreground">
            Hometown Motors
          </span>
          <span className="text-[10px] font-semibold text-primary uppercase tracking-widest mt-0.5">
            Admin Console
          </span>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        <div className="space-y-1">
          <p className="px-3 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">
            Management
          </p>
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href, item.exact);

            return (
              <Link
                key={item.href}
                to={item.href}
                onClick={onNavigate}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group",
                  active
                    ? "bg-primary text-primary-foreground font-semibold shadow-xs"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                )}
              >
                <Icon className={cn("h-4 w-4 shrink-0", active ? "text-primary-foreground" : "text-muted-foreground group-hover:text-foreground")} />
                <span className="flex-1">{item.title}</span>
                {active && <ChevronRight className="h-4 w-4 shrink-0 text-primary-foreground/80" />}
              </Link>
            );
          })}
        </div>

        <div className="pt-4 border-t space-y-1">
          <p className="px-3 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">
            Shortcuts
          </p>
          <Link
            to="/vehicles"
            onClick={onNavigate}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-all"
          >
            <ShoppingBag className="h-4 w-4 shrink-0 text-muted-foreground" />
            <span>Customer Storefront</span>
          </Link>
        </div>
      </div>

      {/* Sidebar Footer */}
      <div className="p-4 border-t bg-muted/20">
        <div className="rounded-lg bg-card p-3 border text-xs text-muted-foreground space-y-1">
          <div className="font-semibold text-foreground">System Status</div>
          <div className="flex items-center gap-1.5 text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Backend Connected</span>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default AdminSidebar;
