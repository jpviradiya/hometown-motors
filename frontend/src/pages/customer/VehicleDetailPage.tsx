import React, { useEffect, useState, useCallback } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Calendar,
  Fuel,
  Gauge,
  ShoppingBag,
  CheckCircle2,
  AlertTriangle,
  Info,
  ShieldCheck,
} from "lucide-react";
import type { Vehicle } from "@/types/vehicle";
import { getVehicleById } from "@/api/vehicle.api";
import { useAuth } from "@/hooks/useAuth";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { ErrorState } from "@/components/common/ErrorState";
import { PurchaseDialog } from "@/components/vehicles/PurchaseDialog";

export const VehicleDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);
  const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState<boolean>(false);

  useDocumentTitle(vehicle ? `${vehicle.make} ${vehicle.model}` : "Vehicle Details");

  const fetchVehicleDetails = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError(false);

    try {
      const data = await getVehicleById(id);
      setVehicle(data);
    } catch (err) {
      console.error("Failed to load vehicle details:", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchVehicleDetails();
  }, [fetchVehicleDetails]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background py-12">
        <div className="container mx-auto px-4 max-w-5xl">
          <LoadingSpinner label="Loading vehicle details..." />
        </div>
      </div>
    );
  }

  if (error || !vehicle) {
    return (
      <div className="min-h-screen bg-background py-12">
        <div className="container mx-auto px-4 max-w-5xl">
          <Link to="/vehicles" className="inline-block mb-6">
            <Button variant="ghost" className="cursor-pointer">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Vehicles
            </Button>
          </Link>
          <ErrorState
            title="Vehicle Not Found"
            message="We could not find details for the requested vehicle or it may no longer be available."
            onRetry={fetchVehicleDetails}
          />
        </div>
      </div>
    );
  }

  const isOutOfStock = vehicle.quantity <= 0;
  const formattedPrice = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(Number(vehicle.price));

  const handlePurchaseClick = () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    setIsPurchaseModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 max-w-6xl space-y-6">
        {/* Navigation back */}
        <Link to="/vehicles" className="inline-block">
          <Button variant="ghost" size="sm" className="cursor-pointer">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to All Vehicles
          </Button>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Vehicle Media Section */}
          <div className="lg:col-span-7 space-y-4">
            <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl border bg-muted shadow-md">
              <img
                src={
                  vehicle.imageUrl ||
                  "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=1200&auto=format&fit=crop&q=80"
                }
                alt={`${vehicle.make} ${vehicle.model}`}
                className="h-full w-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=1200&auto=format&fit=crop&q=80";
                }}
              />
              <div className="absolute top-4 left-4">
                <span className="inline-flex items-center rounded-full bg-background/90 px-3 py-1 text-xs font-bold text-foreground backdrop-blur-md">
                  {vehicle.category}
                </span>
              </div>
            </div>
          </div>

          {/* Vehicle Info & Purchase Actions */}
          <div className="lg:col-span-5 space-y-6">
            <div className="space-y-2 border-b pb-4">
              <span className="text-xs font-bold text-primary uppercase tracking-widest">
                {vehicle.make}
              </span>
              <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
                {vehicle.make} {vehicle.model} ({vehicle.year})
              </h1>
              <div className="flex items-center justify-between pt-2">
                <span className="text-3xl font-black text-primary">{formattedPrice}</span>
                <span
                  className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold ${
                    isOutOfStock
                      ? "bg-destructive/15 text-destructive border border-destructive/20"
                      : "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                  }`}
                >
                  {isOutOfStock ? (
                    <>
                      <AlertTriangle className="mr-1.5 h-3.5 w-3.5" />
                      Out of Stock
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="mr-1.5 h-3.5 w-3.5" />
                      {vehicle.quantity} Available in Stock
                    </>
                  )}
                </span>
              </div>
            </div>

            {/* Specifications Grid */}
            <div className="grid grid-cols-3 gap-3 rounded-xl border bg-card p-4 text-center">
              <div className="space-y-1">
                <Calendar className="h-5 w-5 mx-auto text-primary" />
                <span className="text-[11px] text-muted-foreground block">Year</span>
                <span className="text-sm font-bold">{vehicle.year}</span>
              </div>
              <div className="space-y-1 border-x px-2">
                <Fuel className="h-5 w-5 mx-auto text-primary" />
                <span className="text-[11px] text-muted-foreground block">Fuel</span>
                <span className="text-sm font-bold capitalize">{vehicle.fuelType.toLowerCase()}</span>
              </div>
              <div className="space-y-1">
                <Gauge className="h-5 w-5 mx-auto text-primary" />
                <span className="text-[11px] text-muted-foreground block">Transmission</span>
                <span className="text-sm font-bold capitalize">{vehicle.transmission.toLowerCase()}</span>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <h3 className="text-sm font-bold text-foreground flex items-center gap-1.5">
                <Info className="h-4 w-4 text-primary" />
                Description
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {vehicle.description ||
                  `Experience the ultimate performance and comfort with the ${vehicle.year} ${vehicle.make} ${vehicle.model}. Designed for smooth handling and efficiency.`}
              </p>
            </div>

            {/* Purchase Action Button */}
            <div className="pt-4 border-t space-y-3">
              <Button
                onClick={handlePurchaseClick}
                disabled={isOutOfStock}
                size="lg"
                className="w-full h-12 text-base font-bold cursor-pointer"
              >
                <ShoppingBag className="mr-2 h-5 w-5" />
                {isOutOfStock ? "Currently Out of Stock" : "Purchase Vehicle Now"}
              </Button>

              {!isAuthenticated && !isOutOfStock && (
                <p className="text-xs text-center text-muted-foreground">
                  You will be prompted to log in before completing your purchase.
                </p>
              )}

              <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground pt-2">
                <ShieldCheck className="h-4 w-4 text-emerald-600" />
                <span>Backed by Hometown Motors 100% Quality Assurance</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Purchase Confirmation Dialog */}
      {vehicle && (
        <PurchaseDialog
          vehicle={vehicle}
          isOpen={isPurchaseModalOpen}
          onClose={() => setIsPurchaseModalOpen(false)}
          onSuccess={() => {
            fetchVehicleDetails();
          }}
        />
      )}
    </div>
  );
};

export default VehicleDetailPage;
