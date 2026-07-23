import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  Car,
  Package,
  DollarSign,
  AlertTriangle,
  Plus,
  ArrowRight,
  TrendingUp,
  PieChart,
  ShoppingBag,
  PackagePlus,
} from "lucide-react";
import type { Vehicle } from "@/types/vehicle";
import { getVehicles, deleteVehicle } from "@/api/vehicle.api";
import { PageHeader } from "@/components/admin/PageHeader";
import { DashboardCard } from "@/components/admin/DashboardCard";
import { VehicleTable } from "@/components/admin/VehicleTable";
import { StatCardSkeleton, TableSkeleton } from "@/components/common/Skeleton";
import { ErrorState } from "@/components/common/ErrorState";
import { Button } from "@/components/ui/button";
import { RestockDialog } from "@/components/admin/RestockDialog";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { toast } from "sonner";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";

export const DashboardPage: React.FC = () => {
  useDocumentTitle("Dashboard");
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);

  // Modal states
  const [restockItem, setRestockItem] = useState<Vehicle | null>(null);
  const [deleteItem, setDeleteItem] = useState<Vehicle | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchDashboardData = useCallback(async () => {
    setLoading(true);
    setError(false);

    try {
      const response = await getVehicles({ limit: 100 });
      setVehicles(response.vehicles || []);
      setTotalCount(response.pagination?.total || (response.vehicles || []).length);
    } catch (err) {
      console.error("Error loading admin dashboard metrics:", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // Aggregate metrics calculation
  const totalPhysicalUnits = vehicles.reduce((sum, v) => sum + v.quantity, 0);

  const totalInventoryValue = vehicles.reduce(
    (sum, v) => sum + Number(v.price) * v.quantity,
    0
  );

  const formattedInventoryValue = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(totalInventoryValue);

  const lowStockCount = vehicles.filter((v) => v.quantity <= 3).length;

  // Category Breakdown Calculation for visual chart
  const categoryCounts: Record<string, number> = {};
  vehicles.forEach((v) => {
    categoryCounts[v.category] = (categoryCounts[v.category] || 0) + v.quantity;
  });

  const categoryEntries = Object.entries(categoryCounts).sort((a, b) => b[1] - a[1]);
  const maxCategoryUnits = Math.max(...Object.values(categoryCounts), 1);

  const handleDeleteConfirm = async () => {
    if (!deleteItem) return;
    setIsDeleting(true);

    try {
      const res = await deleteVehicle(deleteItem.id);
      toast.success(res.message || "Vehicle deleted successfully");
      fetchDashboardData();
      setDeleteItem(null);
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || "Failed to delete vehicle";
      toast.error(msg);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <PageHeader
        title="Admin Overview & Analytics"
        description="Real-time inventory statistics, category breakdown, stock alerts, and quick actions."
        action={
          <Link to="/admin/vehicles/new">
            <Button size="lg" className="cursor-pointer font-bold shadow-xs">
              <Plus className="mr-2 h-5 w-5" />
              Add New Vehicle
            </Button>
          </Link>
        }
      />

      {loading ? (
        <div className="space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <StatCardSkeleton key={i} />
            ))}
          </div>
          <TableSkeleton rows={5} />
        </div>
      ) : error ? (
        <ErrorState
          title="Dashboard Metrics Unavailable"
          message="Could not load statistics. Please verify backend connection and try again."
          onRetry={fetchDashboardData}
        />
      ) : (
        <>
          {/* Dashboard Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <DashboardCard
              title="Total Vehicles"
              value={totalCount}
              description="Active vehicle models"
              icon={Car}
              variant="default"
            />
            <DashboardCard
              title="Inventory Count"
              value={`${totalPhysicalUnits} units`}
              description="Physical stock on lot"
              icon={Package}
              variant="success"
            />
            <DashboardCard
              title="Inventory Value"
              value={formattedInventoryValue}
              description="Total asset valuation"
              icon={DollarSign}
              variant="default"
            />
            <DashboardCard
              title="Low Stock Alert"
              value={`${lowStockCount} models`}
              description="Quantity ≤ 3 units"
              icon={AlertTriangle}
              variant={lowStockCount > 0 ? "warning" : "default"}
            />
          </div>

          {/* Analytics & Quick Actions Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Category Stock Visualization */}
            <div className="lg:col-span-2 rounded-xl border bg-card p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b pb-3">
                <div className="flex items-center gap-2">
                  <PieChart className="h-5 w-5 text-primary" />
                  <h3 className="font-bold text-base">Category Inventory Breakdown</h3>
                </div>
                <span className="text-xs text-muted-foreground font-semibold">
                  {totalPhysicalUnits} Total Units
                </span>
              </div>

              <div className="space-y-3 pt-2">
                {categoryEntries.slice(0, 5).map(([cat, count]) => {
                  const percentage = Math.round((count / maxCategoryUnits) * 100);
                  return (
                    <div key={cat} className="space-y-1">
                      <div className="flex justify-between text-xs font-semibold">
                        <span className="text-foreground">{cat}</span>
                        <span className="text-muted-foreground">{count} units ({percentage}%)</span>
                      </div>
                      <div className="h-2.5 w-full rounded-full bg-muted overflow-hidden">
                        <div
                          className="h-full bg-primary transition-all duration-500 rounded-full"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Quick Action Cards */}
            <div className="rounded-xl border bg-card p-6 shadow-xs space-y-4">
              <div className="flex items-center gap-2 border-b pb-3">
                <TrendingUp className="h-5 w-5 text-primary" />
                <h3 className="font-bold text-base">Quick Actions</h3>
              </div>

              <div className="space-y-3">
                <Link to="/admin/vehicles/new" className="block">
                  <div className="flex items-center justify-between p-3 rounded-lg border bg-muted/30 hover:bg-muted transition-colors cursor-pointer group">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-md bg-primary/10 text-primary">
                        <Plus className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-foreground">Add New Vehicle</div>
                        <div className="text-[11px] text-muted-foreground">List model to catalog</div>
                      </div>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>

                <Link to="/admin/vehicles" className="block">
                  <div className="flex items-center justify-between p-3 rounded-lg border bg-muted/30 hover:bg-muted transition-colors cursor-pointer group">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-md bg-emerald-500/10 text-emerald-600">
                        <PackagePlus className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-foreground">Restock Inventory</div>
                        <div className="text-[11px] text-muted-foreground">Add stock count</div>
                      </div>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>

                <Link to="/vehicles" className="block">
                  <div className="flex items-center justify-between p-3 rounded-lg border bg-muted/30 hover:bg-muted transition-colors cursor-pointer group">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-md bg-accent text-accent-foreground">
                        <ShoppingBag className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-foreground">Customer Storefront</div>
                        <div className="text-[11px] text-muted-foreground">View public page</div>
                      </div>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              </div>
            </div>
          </div>

          {/* Quick Management Table */}
          <div className="space-y-4 pt-4">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <h2 className="text-xl font-bold tracking-tight">Recent Vehicle Inventory</h2>
                <p className="text-xs text-muted-foreground">Recent inventory entries and stock levels</p>
              </div>

              <Link to="/admin/vehicles">
                <Button variant="outline" size="sm" className="cursor-pointer font-semibold">
                  View Full Inventory
                  <ArrowRight className="ml-1.5 h-4 w-4" />
                </Button>
              </Link>
            </div>

            <VehicleTable
              vehicles={vehicles.slice(0, 5)}
              onEdit={(v) => (window.location.href = `/admin/vehicles/${v.id}/edit`)}
              onDelete={(v) => setDeleteItem(v)}
              onRestock={(v) => setRestockItem(v)}
            />
          </div>
        </>
      )}

      {/* Restock Dialog */}
      {restockItem && (
        <RestockDialog
          vehicle={restockItem}
          isOpen={Boolean(restockItem)}
          onClose={() => setRestockItem(null)}
          onSuccess={fetchDashboardData}
        />
      )}

      {/* Delete Confirmation */}
      {deleteItem && (
        <ConfirmDialog
          isOpen={Boolean(deleteItem)}
          title="Delete Vehicle Record"
          message={`Are you sure you want to delete ${deleteItem.make} ${deleteItem.model}?`}
          confirmLabel="Delete"
          variant="destructive"
          isLoading={isDeleting}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeleteItem(null)}
        />
      )}
    </div>
  );
};

export default DashboardPage;
