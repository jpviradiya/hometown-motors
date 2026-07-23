import React from "react";
import { CarFront } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = "No vehicles found",
  description = "Try adjusting your search query or filters to find what you are looking for.",
  actionLabel,
  onAction,
}) => {
  return (
    <div className="flex min-h-[300px] flex-col items-center justify-center rounded-xl border border-dashed p-8 text-center bg-card">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted mb-4">
        <CarFront className="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold tracking-tight">{title}</h3>
      <p className="mt-2 text-sm text-muted-foreground max-w-sm">{description}</p>
      {actionLabel && onAction && (
        <Button onClick={onAction} variant="outline" className="mt-6 cursor-pointer">
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;
