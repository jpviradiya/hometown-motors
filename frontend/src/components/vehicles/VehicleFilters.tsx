import React from "react";
import { Filter, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { VehicleFilterOptions } from "@/types/vehicle";

interface VehicleFiltersProps {
  filters: VehicleFilterOptions;
  onChange: (newFilters: VehicleFilterOptions) => void;
  onReset: () => void;
}

const CATEGORIES = [
  "ALL",
  "SEDAN",
  "SUV",
  "HATCHBACK",
  "COUPE",
  "CONVERTIBLE",
  "WAGON",
  "PICKUP",
  "VAN",
];

const FUEL_TYPES = ["ALL", "PETROL", "DIESEL", "HYBRID", "ELECTRIC", "CNG"];

const TRANSMISSIONS = ["ALL", "AUTOMATIC", "MANUAL"];

export const VehicleFilters: React.FC<VehicleFiltersProps> = ({
  filters,
  onChange,
  onReset,
}) => {
  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange({ ...filters, category: e.target.value, page: 1 });
  };

  const handleFuelTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange({ ...filters, fuelType: e.target.value, page: 1 });
  };

  const handleTransmissionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange({ ...filters, transmission: e.target.value, page: 1 });
  };

  const handleMinPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value ? Number(e.target.value) : undefined;
    onChange({ ...filters, minPrice: val, page: 1 });
  };

  const handleMaxPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value ? Number(e.target.value) : undefined;
    onChange({ ...filters, maxPrice: val, page: 1 });
  };

  const isFiltered = Boolean(
    (filters.category && filters.category !== "ALL") ||
      (filters.fuelType && filters.fuelType !== "ALL") ||
      (filters.transmission && filters.transmission !== "ALL") ||
      filters.minPrice ||
      filters.maxPrice ||
      filters.sort
  );

  return (
    <div className="rounded-xl border bg-card p-4 space-y-4 shadow-xs">
      <div className="flex items-center justify-between border-b pb-3">
        <div className="flex items-center gap-2 font-semibold text-sm">
          <Filter className="h-4 w-4 text-primary" />
          <span>Filter Vehicles</span>
        </div>
        {isFiltered && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onReset}
            className="h-8 px-2 text-xs text-muted-foreground hover:text-foreground cursor-pointer"
          >
            <RotateCcw className="mr-1 h-3.5 w-3.5" />
            Reset Filters
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
        {/* Category */}
        <div className="space-y-1.5">
          <Label htmlFor="category-select" className="text-xs">Category</Label>
          <select
            id="category-select"
            value={filters.category || "ALL"}
            onChange={handleCategoryChange}
            className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-xs shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring cursor-pointer"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat === "ALL" ? "All Categories" : cat}
              </option>
            ))}
          </select>
        </div>

        {/* Fuel Type */}
        <div className="space-y-1.5">
          <Label htmlFor="fuel-select" className="text-xs">Fuel Type</Label>
          <select
            id="fuel-select"
            value={filters.fuelType || "ALL"}
            onChange={handleFuelTypeChange}
            className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-xs shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring cursor-pointer"
          >
            {FUEL_TYPES.map((fuel) => (
              <option key={fuel} value={fuel}>
                {fuel === "ALL" ? "All Fuel Types" : fuel}
              </option>
            ))}
          </select>
        </div>

        {/* Transmission */}
        <div className="space-y-1.5">
          <Label htmlFor="transmission-select" className="text-xs">Transmission</Label>
          <select
            id="transmission-select"
            value={filters.transmission || "ALL"}
            onChange={handleTransmissionChange}
            className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-xs shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring cursor-pointer"
          >
            {TRANSMISSIONS.map((trans) => (
              <option key={trans} value={trans}>
                {trans === "ALL" ? "All Transmissions" : trans}
              </option>
            ))}
          </select>
        </div>

        {/* Min Price */}
        <div className="space-y-1.5">
          <Label htmlFor="min-price" className="text-xs">Min Price ($)</Label>
          <Input
            id="min-price"
            type="number"
            placeholder="0"
            min="0"
            value={filters.minPrice || ""}
            onChange={handleMinPriceChange}
            className="h-9 text-xs"
          />
        </div>

        {/* Max Price */}
        <div className="space-y-1.5">
          <Label htmlFor="max-price" className="text-xs">Max Price ($)</Label>
          <Input
            id="max-price"
            type="number"
            placeholder="No limit"
            min="0"
            value={filters.maxPrice || ""}
            onChange={handleMaxPriceChange}
            className="h-9 text-xs"
          />
        </div>
      </div>
    </div>
  );
};

export default VehicleFilters;
