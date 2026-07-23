import React from "react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface DashboardCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: LucideIcon;
  variant?: "default" | "success" | "warning" | "destructive";
}

export const DashboardCard: React.FC<DashboardCardProps> = ({
  title,
  value,
  description,
  icon: Icon,
  variant = "default",
}) => {
  const variantStyles = {
    default: {
      bg: "bg-primary/10",
      text: "text-primary",
      border: "border-border",
    },
    success: {
      bg: "bg-emerald-500/10",
      text: "text-emerald-600 dark:text-emerald-400",
      border: "border-emerald-500/20",
    },
    warning: {
      bg: "bg-amber-500/10",
      text: "text-amber-600 dark:text-amber-400",
      border: "border-amber-500/20",
    },
    destructive: {
      bg: "bg-destructive/10",
      text: "text-destructive",
      border: "border-destructive/20",
    },
  }[variant];

  return (
    <div className={cn("flex items-center gap-4 rounded-xl border bg-card p-5 shadow-xs transition-shadow hover:shadow-md", variantStyles.border)}>
      <div className={cn("p-3.5 rounded-xl shrink-0", variantStyles.bg, variantStyles.text)}>
        <Icon className="h-6 w-6" />
      </div>

      <div className="space-y-1">
        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
          {title}
        </span>
        <h3 className="text-2xl md:text-3xl font-extrabold tracking-tight text-foreground">
          {value}
        </h3>
        {description && (
          <p className="text-xs font-medium text-muted-foreground">{description}</p>
        )}
      </div>
    </div>
  );
};

export default DashboardCard;
