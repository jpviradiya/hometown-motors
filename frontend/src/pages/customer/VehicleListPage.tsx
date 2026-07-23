import React, { useState, useEffect, useCallback } from "react";
import type { Vehicle, PaginationMeta, VehicleFilterOptions } from "@/types/vehicle";
import { getVehicles } from "@/api/vehicle.api";
import { VehicleCard } from "@/components/vehicles/VehicleCard";
import { SearchBar } from "@/components/vehicles/SearchBar";
import { VehicleFilters } from "@/components/vehicles/VehicleFilters";
import { Pagination } from "@/components/vehicles/Pagination";
import { VehicleCardSkeleton } from "@/components/common/Skeleton";
import { EmptyState } from "@/components/common/EmptyState";
import { ErrorState } from "@/components/common/ErrorState";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";

const DEFAULT_FILTERS: VehicleFilterOptions = {
  search: "",
  category: "ALL",
  fuelType: "ALL",
  transmission: "ALL",
  minPrice: undefined,
  maxPrice: undefined,
  sort: undefined,
  page: 1,
  limit: 6,
};

export const VehicleListPage: React.FC = () => {
  useDocumentTitle("Browse Vehicles");
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta>({
    page: 1,
    limit: 6,
    total: 0,
    totalPages: 1,
  });
  const [filters, setFilters] = useState<VehicleFilterOptions>(DEFAULT_FILTERS);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);

  const fetchVehicles = useCallback(async () => {
    setLoading(true);
    setError(false);

    try {
      const response = await getVehicles(filters);
      setVehicles(response.vehicles || []);
      setPagination(
        response.pagination || { page: 1, limit: 6, total: 0, totalPages: 1 }
      );
    } catch (err) {
      console.error("Error fetching vehicles:", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchVehicles();
  }, [fetchVehicles]);

  const handleSearchChange = (searchTerm: string) => {
    setFilters((prev) => ({ ...prev, search: searchTerm, page: 1 }));
  };

  const handleFilterChange = (newFilters: VehicleFilterOptions) => {
    setFilters(newFilters);
  };

  const handleResetFilters = () => {
    setFilters(DEFAULT_FILTERS);
  };

  const handlePageChange = (newPage: number) => {
    setFilters((prev) => ({ ...prev, page: newPage }));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 max-w-7xl space-y-6">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b pb-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">Vehicle Catalog</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Search and filter from our available inventory ({pagination.total} vehicles total)
            </p>
          </div>

          <div className="w-full md:w-80">
            <SearchBar value={filters.search || ""} onChange={handleSearchChange} />
          </div>
        </div>

        {/* Filters Section */}
        <VehicleFilters
          filters={filters}
          onChange={handleFilterChange}
          onReset={handleResetFilters}
        />

        {/* Results / Skeleton Loading / Error / Empty States */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <VehicleCardSkeleton key={i} />
            ))}
          </div>
        ) : error ? (
          <ErrorState
            title="Unable to load vehicles"
            message="We encountered an issue connecting to the inventory server. Please try again."
            onRetry={fetchVehicles}
          />
        ) : vehicles.length === 0 ? (
          <EmptyState
            title="No vehicles match your criteria"
            description="Try clearing your search query or broadening your filters."
            actionLabel="Reset All Filters"
            onAction={handleResetFilters}
          />
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {vehicles.map((vehicle) => (
                <VehicleCard key={vehicle.id} vehicle={vehicle} />
              ))}
            </div>

            {/* Pagination Controls */}
            <Pagination pagination={pagination} onPageChange={handlePageChange} />
          </>
        )}
      </div>
    </div>
  );
};

export default VehicleListPage;
