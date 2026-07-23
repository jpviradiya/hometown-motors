import React from "react";
import { Edit, PackagePlus, Trash2 } from "lucide-react";
import type { Vehicle } from "@/types/vehicle";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

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
      <div className="overflow-x-auto max-h-[600px]">
        <table className="w-full text-left text-sm border-collapse">
          <thead className="bg-muted/80 border-b text-xs uppercase font-bold text-muted-foreground sticky top-0 backdrop-blur-md z-10">
            <tr>
              <th className="px-4 py-3.5">Image</th>
              <th className="px-4 py-3.5">Make & Model</th>
              <th className="px-4 py-3.5">Category</th>
              <th className="px-4 py-3.5">Year</th>
              <th className="px-4 py-3.5">Price</th>
              <th className="px-4 py-3.5">Quantity</th>
              <th className="px-4 py-3.5 text-right">Actions</th>
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
                <tr key={vehicle.id} className="even:bg-muted/20 hover:bg-muted/50 transition-colors">
                  <td className="px-4 py-3">
                    <img
                      src={
                        vehicle.imageUrl ||
                        "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800&auto=format&fit=crop&q=60"
                      }
                      alt={`${vehicle.make} ${vehicle.model}`}
                      className="h-12 w-16 object-cover rounded-lg border shrink-0 bg-muted shadow-xs"
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
                    <div className="text-xs text-muted-foreground font-medium">
                      Color: {vehicle.color}
                    </div>
                  </td>

                  <td className="px-4 py-3">
                    <Badge variant="outline" className="font-semibold text-xs">
                      {vehicle.category}
                    </Badge>
                  </td>

                  <td className="px-4 py-3 text-muted-foreground font-medium">
                    {vehicle.year}
                  </td>

                  <td className="px-4 py-3 font-extrabold text-primary">
                    {formattedPrice}
                  </td>

                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className="font-bold">{vehicle.quantity}</span>
                      {isOutOfStock && (
                        <Badge variant="destructive">
                          Out of Stock
                        </Badge>
                      )}
                      {isLowStock && (
                        <Badge variant="warning">
                          Low Stock
                        </Badge>
                      )}
                    </div>
                  </td>

                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onRestock(vehicle)}
                        className="h-8 text-xs cursor-pointer border-emerald-500/30 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10 font-bold"
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
