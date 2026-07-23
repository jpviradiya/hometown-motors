import React from "react";
import { cn } from "@/lib/utils";

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-muted/60", className)}
      {...props}
    />
  );
}

export function VehicleCardSkeleton() {
  return (
    <div className="rounded-xl border bg-card p-4 space-y-3">
      <Skeleton className="aspect-[16/10] w-full rounded-lg" />
      <div className="flex justify-between items-center pt-2">
        <Skeleton className="h-4 w-1/4" />
        <Skeleton className="h-5 w-1/3" />
      </div>
      <Skeleton className="h-6 w-3/4" />
      <div className="grid grid-cols-3 gap-2 py-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
      </div>
      <Skeleton className="h-9 w-full rounded-md mt-2" />
    </div>
  );
}

export function StatCardSkeleton() {
  return (
    <div className="flex items-center gap-4 rounded-xl border bg-card p-5">
      <Skeleton className="h-12 w-12 rounded-xl" />
      <div className="space-y-2 flex-1">
        <Skeleton className="h-3 w-1/2" />
        <Skeleton className="h-7 w-3/4" />
      </div>
    </div>
  );
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="rounded-xl border bg-card p-4 space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center justify-between gap-4 py-2 border-b last:border-0">
          <div className="flex items-center gap-3 w-1/3">
            <Skeleton className="h-10 w-14 rounded-md" />
            <div className="space-y-1.5 flex-1">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          </div>
          <Skeleton className="h-4 w-1/6" />
          <Skeleton className="h-4 w-1/6" />
          <Skeleton className="h-8 w-24 rounded-md" />
        </div>
      ))}
    </div>
  );
}
