import React, { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import type { Vehicle, PaginationMeta, VehicleFilterOptions } from "@/types/vehicle";
import { getVehicles, deleteVehicle } from "@/api/vehicle.api";
import { PageHeader } from "@/components/admin/PageHeader";
import { VehicleTable } from "@/components/admin/VehicleTable";
import { SearchBar } from "@/components/vehicles/SearchBar";
import { Pagination } from "@/components/vehicles/Pagination";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { ErrorState } from "@/components/common/ErrorState";
import { Button } from "@/components/ui/button";
import { RestockDialog } from "@/components/admin/RestockDialog";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";

export const VehicleManagementPage: React.FC = () => {
  const navigate = useNavigate();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  });
  const [filters, setFilters] = useState<VehicleFilterOptions>({
    search: "",
    page: 1,
    limit: 10,
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);

  // Dialog states
  const [restockItem, setRestockItem] = useState<Vehicle | null>(null);
  const [deleteItem, setDeleteItem] = useState<Vehicle | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  const fetchInventory = useCallback(async () => {
    setLoading(true);
    setError(false);

    try {
      const response = await getVehicles(filters);
      setVehicles(response.vehicles || []);
      setPagination(
        response.pagination || { page: 1, limit: 10, total: 0, totalPages: 1 }
      );
    } catch (err) {
      console.error("Failed to fetch admin vehicle inventory:", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchInventory();
  }, [fetchInventory]);

  const handleDeleteConfirm = async () => {
    if (!deleteItem) return;
    setIsDeleting(true);

    try {
      const res = await deleteVehicle(deleteItem.id);
      toast.success(res.message || `Deleted ${deleteItem.make} ${deleteItem.model}`);
      fetchInventory();
      setDeleteItem(null);
    } catch (err: any) {
      const msg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        "Failed to delete vehicle record.";
      toast.error(msg);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="Vehicle Inventory Management"
        description="View, edit, restock, or delete vehicle models from the catalog."
        action={
          <Link to="/admin/vehicles/new">
            <Button size="lg" className="cursor-pointer font-bold">
              <Plus className="mr-2 h-5 w-5" />
              Add New Vehicle
            </Button>
          </Link>
        }
      />

      {/* Search Bar & Stats */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-card p-4 rounded-xl border shadow-xs">
        <div className="w-full sm:w-80">
          <SearchBar
            value={filters.search || ""}
            onChange={(term) => setFilters((prev) => ({ ...prev, search: term, page: 1 }))}
            placeholder="Search inventory by make or model..."
          />
        </div>
        <div className="text-xs text-muted-foreground">
          Showing <span className="font-semibold text-foreground">{vehicles.length}</span> of{" "}
          <span className="font-semibold text-foreground">{pagination.total}</span> total vehicles
        </div>
      </div>

      {/* Vehicle Table View */}
      {loading ? (
        <LoadingSpinner label="Loading vehicle inventory table..." />
      ) : error ? (
        <ErrorState
          title="Inventory Unavailable"
          message="Could not load vehicle records. Please retry."
          onRetry={fetchInventory}
        />
      ) : (
        <>
          <VehicleTable
            vehicles={vehicles}
            onEdit={(v) => navigate(`/admin/vehicles/${v.id}/edit`)}
            onDelete={(v) => setDeleteItem(v)}
            onRestock={(v) => setRestockItem(v)}
          />

          <Pagination
            pagination={pagination}
            onPageChange={(page) => setFilters((prev) => ({ ...prev, page }))}
          />
        </>
      )}

      {/* Restock Dialog */}
      {restockItem && (
        <RestockDialog
          vehicle={restockItem}
          isOpen={Boolean(restockItem)}
          onClose={() => setRestockItem(null)}
          onSuccess={fetchInventory}
        />
      )}

      {/* Delete Confirmation */}
      {deleteItem && (
        <ConfirmDialog
          isOpen={Boolean(deleteItem)}
          title="Delete Vehicle Record"
          message={`Are you sure you want to delete ${deleteItem.make} ${deleteItem.model}? This action will permanently remove it from the catalog.`}
          confirmLabel="Delete Vehicle"
          variant="destructive"
          isLoading={isDeleting}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeleteItem(null)}
        />
      )}
    </div>
  );
};

export default VehicleManagementPage;
