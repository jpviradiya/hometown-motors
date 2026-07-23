import React from "react";
import { Link } from "react-router-dom";
import { Fuel, Gauge, Calendar, Tag } from "lucide-react";
import type { Vehicle } from "@/types/vehicle";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";

interface VehicleCardProps {
  vehicle: Vehicle;
}

export const VehicleCard: React.FC<VehicleCardProps> = ({ vehicle }) => {
  const isOutOfStock = vehicle.quantity <= 0;
  const formattedPrice = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(Number(vehicle.price));

  return (
    <Card className="group overflow-hidden flex flex-col justify-between transition-all hover:shadow-md border">
      <div>
        {/* Image Container with Fallback */}
        <div className="relative aspect-[16/10] w-full overflow-hidden bg-muted">
          <img
            src={vehicle.imageUrl || "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800&auto=format&fit=crop&q=60"}
            alt={`${vehicle.make} ${vehicle.model}`}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800&auto=format&fit=crop&q=60";
            }}
          />
          <div className="absolute top-3 left-3 flex gap-2">
            <span className="inline-flex items-center rounded-full bg-background/90 px-2.5 py-0.5 text-xs font-semibold text-foreground backdrop-blur-xs">
              {vehicle.category}
            </span>
          </div>
          <div className="absolute top-3 right-3">
            <span
              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold backdrop-blur-xs ${
                isOutOfStock
                  ? "bg-destructive/90 text-destructive-foreground"
                  : "bg-emerald-600/90 text-white"
              }`}
            >
              {isOutOfStock ? "Out of Stock" : `${vehicle.quantity} Available`}
            </span>
          </div>
        </div>

        <CardHeader className="p-4 pb-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              {vehicle.make}
            </span>
            <span className="text-lg font-bold text-primary">{formattedPrice}</span>
          </div>
          <h3 className="text-lg font-bold tracking-tight text-foreground line-clamp-1">
            {vehicle.make} {vehicle.model}
          </h3>
        </CardHeader>

        <CardContent className="p-4 pt-0">
          <div className="grid grid-cols-3 gap-2 py-3 border-y text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" />
              <span>{vehicle.year}</span>
            </div>
            <div className="flex items-center gap-1 capitalize">
              <Fuel className="h-3.5 w-3.5" />
              <span className="truncate">{vehicle.fuelType.toLowerCase()}</span>
            </div>
            <div className="flex items-center gap-1 capitalize">
              <Gauge className="h-3.5 w-3.5" />
              <span className="truncate">{vehicle.transmission.toLowerCase()}</span>
            </div>
          </div>
        </CardContent>
      </div>

      <CardFooter className="p-4 pt-0">
        <Link to={`/vehicles/${vehicle.id}`} className="w-full">
          <Button variant="default" className="w-full cursor-pointer">
            <Tag className="mr-2 h-4 w-4" />
            View Details
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default VehicleCard;
