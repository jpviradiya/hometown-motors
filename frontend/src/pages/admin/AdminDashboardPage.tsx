import React, { useState, useEffect, useCallback } from "react";
import {
  Plus,
  PackagePlus,
  Edit,
  Trash2,
  AlertTriangle,
  Car,
  Package,
} from "lucide-react";
import type { Vehicle, PaginationMeta, VehicleFilterOptions } from "@/types/vehicle";
import { getVehicles } from "@/api/vehicle.api";
import { Button } from "@/components/ui/button";
import { SearchBar } from "@/components/vehicles/SearchBar";
import { Pagination } from "@/components/vehicles/Pagination";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { ErrorState } from "@/components/common/ErrorState";
import { RestockDialog } from "@/components/admin/RestockDialog";
import { VehicleFormModal } from "@/components/admin/VehicleFormModal";
import { DeleteVehicleDialog } from "@/components/admin/DeleteVehicleDialog";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";

export const AdminDashboardPage: React.FC = () => {
  useDocumentTitle("Dashboard");
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

  // Modals state
  const [restockVehicleItem, setRestockVehicleItem] = useState<Vehicle | null>(null);
  const [formVehicleItem, setFormVehicleItem] = useState<{ vehicle?: Vehicle | null; isOpen: boolean }>({
    vehicle: null,
    isOpen: false,
  });
  const [deleteVehicleItem, setDeleteVehicleItem] = useState<Vehicle | null>(null);

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
      console.error("Failed to load admin inventory:", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchInventory();
  }, [fetchInventory]);

  // Inventory stats summary
  const totalVehiclesCount = pagination.total;
  const lowStockCount = vehicles.filter((v) => v.quantity <= 3).length;
  const totalUnits = vehicles.reduce((sum, v) => sum + v.quantity, 0);

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 max-w-7xl space-y-6">
        {/* Dashboard Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b pb-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-extrabold tracking-tight">Admin Stock & Inventory</h1>
              <span className="rounded-md bg-primary/10 text-primary px-2 py-0.5 text-xs font-bold uppercase">
                Admin Mode
              </span>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Manage inventory levels, restock stock, edit vehicle details, and create new listings.
            </p>
          </div>

          <Button
            onClick={() => setFormVehicleItem({ vehicle: null, isOpen: true })}
            size="lg"
            className="cursor-pointer font-bold shrink-0"
          >
            <Plus className="mr-2 h-5 w-5" />
            Add New Vehicle
          </Button>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="flex items-center gap-4 rounded-xl border bg-card p-4 shadow-xs">
            <div className="p-3 rounded-lg bg-primary/10 text-primary">
              <Car className="h-6 w-6" />
            </div>
            <div>
              <span className="text-xs text-muted-foreground font-medium">Total Vehicle Models</span>
              <h3 className="text-2xl font-bold">{totalVehiclesCount}</h3>
            </div>
          </div>

          <div className="flex items-center gap-4 rounded-xl border bg-card p-4 shadow-xs">
            <div className="p-3 rounded-lg bg-emerald-500/10 text-emerald-600">
              <Package className="h-6 w-6" />
            </div>
            <div>
              <span className="text-xs text-muted-foreground font-medium">Total Physical Units</span>
              <h3 className="text-2xl font-bold">{totalUnits} units</h3>
            </div>
          </div>

          <div className="flex items-center gap-4 rounded-xl border bg-card p-4 shadow-xs">
            <div className="p-3 rounded-lg bg-amber-500/10 text-amber-600">
              <AlertTriangle className="h-6 w-6" />
            </div>
            <div>
              <span className="text-xs text-muted-foreground font-medium">Low / Out of Stock</span>
              <h3 className="text-2xl font-bold text-amber-600">{lowStockCount} models</h3>
            </div>
          </div>
        </div>

        {/* Inventory Search & Filters */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-card p-4 rounded-xl border">
          <div className="w-full sm:w-80">
            <SearchBar
              value={filters.search || ""}
              onChange={(term) => setFilters((prev) => ({ ...prev, search: term, page: 1 }))}
              placeholder="Search inventory by make or model..."
            />
          </div>
          <div className="text-xs text-muted-foreground">
            Showing <span className="font-semibold text-foreground">{vehicles.length}</span> of{" "}
            <span className="font-semibold text-foreground">{pagination.total}</span> vehicles
          </div>
        </div>

        {/* Inventory Data Table */}
        {loading ? (
          <LoadingSpinner label="Loading admin inventory..." />
        ) : error ? (
          <ErrorState
            title="Failed to load inventory"
            message="Could not load vehicle records. Please verify connection and retry."
            onRetry={fetchInventory}
          />
        ) : vehicles.length === 0 ? (
          <div className="text-center py-12 rounded-xl border bg-card text-muted-foreground text-sm space-y-3">
            <p>No vehicles found matching search query.</p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setFilters({ search: "", page: 1, limit: 10 })}
            >
              Clear Search
            </Button>
          </div>
        ) : (
          <div className="rounded-xl border bg-card overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-muted/50 border-b text-xs uppercase font-semibold text-muted-foreground">
                  <tr>
                    <th className="px-4 py-3">Vehicle</th>
                    <th className="px-4 py-3">Category</th>
                    <th className="px-4 py-3">Price</th>
                    <th className="px-4 py-3">Stock Quantity</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {vehicles.map((v) => {
                    const price = new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: "USD",
                      maximumFractionDigits: 0,
                    }).format(Number(v.price));

                    const isOut = v.quantity <= 0;
                    const isLow = v.quantity > 0 && v.quantity <= 3;

                    return (
                      <tr key={v.id} className="hover:bg-muted/30 transition-colors">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <img
                              src={
                                v.imageUrl ||
                                "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800&auto=format&fit=crop&q=60"
                              }
                              alt={v.make}
                              className="h-12 w-16 object-cover rounded-md border shrink-0 bg-muted"
                            />
                            <div>
                              <div className="font-bold text-foreground">
                                {v.make} {v.model}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                Year: {v.year} • Color: {v.color}
                              </div>
                            </div>
                          </div>
                        </td>

                        <td className="px-4 py-3">
                          <div className="space-y-1">
                            <span className="inline-block rounded-md bg-muted px-2 py-0.5 text-xs font-semibold">
                              {v.category}
                            </span>
                            <div className="text-xs text-muted-foreground capitalize">
                              {v.fuelType.toLowerCase()} • {v.transmission.toLowerCase()}
                            </div>
                          </div>
                        </td>

                        <td className="px-4 py-3 font-bold text-primary">{price}</td>

                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm">{v.quantity} units</span>
                            {isOut && (
                              <span className="rounded-full bg-destructive/15 text-destructive border border-destructive/20 px-2 py-0.5 text-[10px] font-bold">
                                Out of Stock
                              </span>
                            )}
                            {isLow && (
                              <span className="rounded-full bg-amber-500/15 text-amber-600 border border-amber-500/20 px-2 py-0.5 text-[10px] font-bold">
                                Low Stock
                              </span>
                            )}
                          </div>
                        </td>

                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {/* Restock Button */}
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setRestockVehicleItem(v)}
                              className="h-8 cursor-pointer border-emerald-500/30 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10"
                            >
                              <PackagePlus className="mr-1 h-3.5 w-3.5" />
                              Restock
                            </Button>

                            {/* Edit Button */}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setFormVehicleItem({ vehicle: v, isOpen: true })}
                              className="h-8 cursor-pointer"
                            >
                              <Edit className="h-3.5 w-3.5" />
                              <span className="sr-only">Edit</span>
                            </Button>

                            {/* Delete Button */}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setDeleteVehicleItem(v)}
                              className="h-8 text-destructive hover:text-destructive hover:bg-destructive/10 cursor-pointer"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                              <span className="sr-only">Delete</span>
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            <div className="p-4 border-t">
              <Pagination
                pagination={pagination}
                onPageChange={(page) => setFilters((prev) => ({ ...prev, page }))}
              />
            </div>
          </div>
        )}
      </div>

      {/* Restock Modal */}
      {restockVehicleItem && (
        <RestockDialog
          vehicle={restockVehicleItem}
          isOpen={Boolean(restockVehicleItem)}
          onClose={() => setRestockVehicleItem(null)}
          onSuccess={fetchInventory}
        />
      )}

      {/* Create / Edit Form Modal */}
      {formVehicleItem.isOpen && (
        <VehicleFormModal
          vehicle={formVehicleItem.vehicle}
          isOpen={formVehicleItem.isOpen}
          onClose={() => setFormVehicleItem({ vehicle: null, isOpen: false })}
          onSuccess={fetchInventory}
        />
      )}

      {/* Delete Confirmation Modal */}
      {deleteVehicleItem && (
        <DeleteVehicleDialog
          vehicle={deleteVehicleItem}
          isOpen={Boolean(deleteVehicleItem)}
          onClose={() => setDeleteVehicleItem(null)}
          onSuccess={fetchInventory}
        />
      )}
    </div>
  );
};

export default AdminDashboardPage;
