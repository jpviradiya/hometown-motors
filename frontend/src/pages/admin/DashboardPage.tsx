import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { Car, Package, DollarSign, AlertTriangle, Plus, ArrowRight } from "lucide-react";
import type { Vehicle } from "@/types/vehicle";
import { getVehicles } from "@/api/vehicle.api";
import { PageHeader } from "@/components/admin/PageHeader";
import { DashboardCard } from "@/components/admin/DashboardCard";
import { VehicleTable } from "@/components/admin/VehicleTable";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { ErrorState } from "@/components/common/ErrorState";
import { Button } from "@/components/ui/button";
import { RestockDialog } from "@/components/admin/RestockDialog";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { deleteVehicle } from "@/api/vehicle.api";
import { toast } from "sonner";

export const DashboardPage: React.FC = () => {
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
      // Fetch catalog list with high limit for aggregate metric calculations
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
        title="Admin Dashboard"
        description="Overview of Hometown Motors inventory statistics, stock alerts, and quick actions."
        action={
          <Link to="/admin/vehicles/new">
            <Button size="lg" className="cursor-pointer font-bold">
              <Plus className="mr-2 h-5 w-5" />
              Add New Vehicle
            </Button>
          </Link>
        }
      />

      {loading ? (
        <LoadingSpinner label="Calculating inventory metrics..." />
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

          {/* Quick Management Table */}
          <div className="space-y-4 pt-4">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <h2 className="text-xl font-bold tracking-tight">Recent Vehicle Inventory</h2>
                <p className="text-xs text-muted-foreground">Recent inventory entries and stock levels</p>
              </div>

              <Link to="/admin/vehicles">
                <Button variant="outline" size="sm" className="cursor-pointer">
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
