import React from "react";
import { Link } from "react-router-dom";
import { Fuel, Gauge, Calendar, Tag, ArrowRight } from "lucide-react";
import type { Vehicle } from "@/types/vehicle";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
  const isLowStock = vehicle.quantity > 0 && vehicle.quantity <= 3;

  const formattedPrice = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(Number(vehicle.price));

  return (
    <Card className="group overflow-hidden flex flex-col justify-between transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border border-border/60 bg-card">
      <div>
        {/* Image Container with Zoom Effect */}
        <div className="relative aspect-[16/10] w-full overflow-hidden bg-muted">
          <img
            src={vehicle.imageUrl || "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800&auto=format&fit=crop&q=60"}
            alt={`${vehicle.make} ${vehicle.model}`}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-108"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800&auto=format&fit=crop&q=60";
            }}
          />
          {/* Glassmorphism Badges */}
          <div className="absolute top-3 left-3 flex gap-2">
            <span className="inline-flex items-center rounded-full bg-background/90 px-2.5 py-0.5 text-xs font-semibold text-foreground backdrop-blur-md border shadow-xs">
              {vehicle.category}
            </span>
          </div>

          <div className="absolute top-3 right-3">
            {isOutOfStock ? (
              <Badge variant="destructive" className="backdrop-blur-md">
                Out of Stock
              </Badge>
            ) : isLowStock ? (
              <Badge variant="warning" className="backdrop-blur-md">
                Only {vehicle.quantity} Left
              </Badge>
            ) : (
              <Badge variant="success" className="backdrop-blur-md">
                {vehicle.quantity} Available
              </Badge>
            )}
          </div>
        </div>

        <CardHeader className="p-5 pb-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
              {vehicle.make}
            </span>
            <span className="text-xl font-black text-primary">{formattedPrice}</span>
          </div>
          <h3 className="text-lg font-bold tracking-tight text-foreground line-clamp-1 group-hover:text-primary transition-colors">
            {vehicle.make} {vehicle.model}
          </h3>
        </CardHeader>

        <CardContent className="p-5 pt-0">
          <div className="grid grid-cols-3 gap-2 py-3 border-y text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5 font-medium">
              <Calendar className="h-3.5 w-3.5 text-primary shrink-0" />
              <span>{vehicle.year}</span>
            </div>
            <div className="flex items-center gap-1.5 font-medium capitalize">
              <Fuel className="h-3.5 w-3.5 text-primary shrink-0" />
              <span className="truncate">{vehicle.fuelType.toLowerCase()}</span>
            </div>
            <div className="flex items-center gap-1.5 font-medium capitalize">
              <Gauge className="h-3.5 w-3.5 text-primary shrink-0" />
              <span className="truncate">{vehicle.transmission.toLowerCase()}</span>
            </div>
          </div>
        </CardContent>
      </div>

      <CardFooter className="p-5 pt-0">
        <Link to={`/vehicles/${vehicle.id}`} className="w-full">
          <Button variant="default" className="w-full cursor-pointer font-bold transition-all group-hover:bg-primary/90">
            <Tag className="mr-2 h-4 w-4" />
            View Details
            <ArrowRight className="ml-1.5 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default VehicleCard;
