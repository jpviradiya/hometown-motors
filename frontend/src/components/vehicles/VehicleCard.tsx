import React from "react";
import { Link } from "react-router-dom";
import { Fuel, Gauge, Calendar, Tag, ArrowRight, Car as CarIcon, CheckCircle2, AlertTriangle, XCircle } from "lucide-react";
import type { Vehicle } from "@/types/vehicle";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/utils/format";
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

  const formattedPrice = formatCurrency(vehicle.price);

  return (
    <Card className="group relative overflow-hidden flex flex-col justify-between rounded-2xl border border-border/70 bg-card shadow-xs hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 h-full p-0 pt-0 gap-0">
      <div>
        {/* Hero Image Container with Dark Top Gradient & Smooth Zoom */}
        <div className="relative aspect-[16/10] w-full overflow-hidden bg-muted rounded-t-2xl">
          <img
            src={vehicle.imageUrl || "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800&auto=format&fit=crop&q=60"}
            alt={`${vehicle.make} ${vehicle.model}`}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-108"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800&auto=format&fit=crop&q=60";
            }}
          />
          {/* Top Gradient Overlay for Badge Contrast */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/20 to-transparent pointer-events-none" />

          {/* Category Pill Tag Overlay with Pure White Car Icon */}
          <div className="absolute top-3 left-3 flex gap-2 z-10">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-black/60 text-white px-2.5 py-1 text-[11px] font-bold border border-white/20 backdrop-blur-md shadow-md">
              <CarIcon className="h-3.5 w-3.5 text-white" />
              <span>{vehicle.category}</span>
            </span>
          </div>

          {/* Stock Status Badge Overlay */}
          <div className="absolute top-3 right-3 z-10">
            {isOutOfStock ? (
              <Badge variant="destructive" className="shadow-md font-bold flex items-center gap-1 px-2.5 py-1">
                <XCircle className="h-3.5 w-3.5 text-white" />
                <span>Out of Stock</span>
              </Badge>
            ) : isLowStock ? (
              <Badge variant="warning" className="shadow-md font-bold flex items-center gap-1 px-2.5 py-1">
                <AlertTriangle className="h-3.5 w-3.5 text-slate-950" />
                <span>Only {vehicle.quantity} Left</span>
              </Badge>
            ) : (
              <Badge variant="success" className="shadow-md font-bold flex items-center gap-1 px-2.5 py-1">
                <CheckCircle2 className="h-3.5 w-3.5 text-white" />
                <span>In Stock ({vehicle.quantity})</span>
              </Badge>
            )}
          </div>
        </div>

        {/* Header: Brand & Model Title */}
        <CardHeader className="p-4 sm:p-5 pb-2 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold text-muted-foreground uppercase tracking-widest">
              {vehicle.make}
            </span>
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
              Starting at
            </span>
          </div>

          <div className="flex items-baseline justify-between gap-2">
            <h3 className="text-base sm:text-lg font-black tracking-tight text-foreground line-clamp-1 group-hover:text-primary transition-colors">
              {vehicle.make} {vehicle.model}
            </h3>
            <span className="text-xl sm:text-2xl font-black text-primary shrink-0 tracking-tight">
              {formattedPrice}
            </span>
          </div>
        </CardHeader>

        {/* Attribute Information Chips */}
        <CardContent className="p-4 sm:p-5 pt-1">
          <div className="grid grid-cols-3 gap-2 py-3 border-t text-xs">
            <div className="flex flex-col items-center justify-center p-2 rounded-xl bg-muted/60 text-center space-y-1 border border-border/40">
              <Calendar className="h-4 w-4 text-primary" />
              <span className="font-bold text-foreground text-[11px]">{vehicle.year}</span>
              <span className="text-[9px] text-muted-foreground uppercase font-semibold">Year</span>
            </div>

            <div className="flex flex-col items-center justify-center p-2 rounded-xl bg-muted/60 text-center space-y-1 border border-border/40">
              <Fuel className="h-4 w-4 text-primary" />
              <span className="font-bold text-foreground text-[11px] truncate max-w-full capitalize">
                {vehicle.fuelType.toLowerCase()}
              </span>
              <span className="text-[9px] text-muted-foreground uppercase font-semibold">Fuel</span>
            </div>

            <div className="flex flex-col items-center justify-center p-2 rounded-xl bg-muted/60 text-center space-y-1 border border-border/40">
              <Gauge className="h-4 w-4 text-primary" />
              <span className="font-bold text-foreground text-[11px] truncate max-w-full capitalize">
                {vehicle.transmission.toLowerCase()}
              </span>
              <span className="text-[9px] text-muted-foreground uppercase font-semibold">Gear</span>
            </div>
          </div>
        </CardContent>
      </div>

      {/* Full Width CTA Action */}
      <CardFooter className="p-4 sm:p-5 pt-0">
        <Link to={`/vehicles/${vehicle.id}`} className="w-full">
          <Button
            variant="default"
            className="w-full cursor-pointer font-bold transition-all min-h-[44px] shadow-xs group-hover:bg-primary/95 group-hover:shadow-md"
          >
            <Tag className="mr-2 h-4 w-4" />
            View Details
            <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1.5" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default VehicleCard;
