import React from "react";
import { Edit, PackagePlus, Trash2 } from "lucide-react";
import type { Vehicle } from "@/types/vehicle";
import { Button } from "@/components/ui/button";

interface VehicleTableProps {
  vehicles: Vehicle[];
  onEdit: (vehicle: Vehicle) => void;
  onDelete: (vehicle: Vehicle) => void;
  onRestock: (vehicle: Vehicle) => void;
}

export const VehicleTable: React.FC<VehicleTableProps> = ({
  vehicles,
  onEdit,
  onDelete,
  onRestock,
}) => {
  if (vehicles.length === 0) {
    return (
      <div className="text-center py-12 border rounded-xl bg-card text-muted-foreground text-sm">
        No vehicles found in inventory.
      </div>
    );
  }

  return (
    <div className="rounded-xl border bg-card overflow-hidden shadow-xs">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-muted/50 border-b text-xs uppercase font-semibold text-muted-foreground">
            <tr>
              <th className="px-4 py-3">Image</th>
              <th className="px-4 py-3">Make & Model</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Year</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Quantity</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {vehicles.map((vehicle) => {
              const formattedPrice = new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
                maximumFractionDigits: 0,
              }).format(Number(vehicle.price));

              const isOutOfStock = vehicle.quantity <= 0;
              const isLowStock = vehicle.quantity > 0 && vehicle.quantity <= 3;

              return (
                <tr key={vehicle.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3">
                    <img
                      src={
                        vehicle.imageUrl ||
                        "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800&auto=format&fit=crop&q=60"
                      }
                      alt={`${vehicle.make} ${vehicle.model}`}
                      className="h-12 w-16 object-cover rounded-md border shrink-0 bg-muted"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800&auto=format&fit=crop&q=60";
                      }}
                    />
                  </td>

                  <td className="px-4 py-3">
                    <div className="font-bold text-foreground">
                      {vehicle.make} {vehicle.model}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Color: {vehicle.color}
                    </div>
                  </td>

                  <td className="px-4 py-3">
                    <span className="inline-block rounded-md bg-muted px-2 py-0.5 text-xs font-semibold">
                      {vehicle.category}
                    </span>
                  </td>

                  <td className="px-4 py-3 text-muted-foreground font-medium">
                    {vehicle.year}
                  </td>

                  <td className="px-4 py-3 font-bold text-primary">
                    {formattedPrice}
                  </td>

                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className="font-bold">{vehicle.quantity}</span>
                      {isOutOfStock && (
                        <span className="rounded-full bg-destructive/15 text-destructive border border-destructive/20 px-2 py-0.5 text-[10px] font-bold">
                          Out of Stock
                        </span>
                      )}
                      {isLowStock && (
                        <span className="rounded-full bg-amber-500/15 text-amber-600 border border-amber-500/20 px-2 py-0.5 text-[10px] font-bold">
                          Low Stock
                        </span>
                      )}
                    </div>
                  </td>

                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onRestock(vehicle)}
                        className="h-8 text-xs cursor-pointer border-emerald-500/30 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10"
                      >
                        <PackagePlus className="mr-1 h-3.5 w-3.5" />
                        Restock
                      </Button>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEdit(vehicle)}
                        className="h-8 cursor-pointer"
                        aria-label="Edit vehicle"
                      >
                        <Edit className="h-3.5 w-3.5" />
                      </Button>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDelete(vehicle)}
                        className="h-8 text-destructive hover:text-destructive hover:bg-destructive/10 cursor-pointer"
                        aria-label="Delete vehicle"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default VehicleTable;
