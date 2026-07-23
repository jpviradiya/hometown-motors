import React, { useState } from "react";
import { Loader2, ShoppingBag, AlertCircle, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import type { Vehicle } from "@/types/vehicle";
import { purchaseVehicle } from "@/api/vehicle.api";
import { Button } from "@/components/ui/button";
import { QuantitySelector } from "./QuantitySelector";

interface PurchaseDialogProps {
  vehicle: Vehicle;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const PurchaseDialog: React.FC<PurchaseDialogProps> = ({
  vehicle,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [quantity, setQuantity] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const unitPrice = Number(vehicle.price);
  const totalPrice = unitPrice * quantity;

  const formattedTotalPrice = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(totalPrice);

  const handlePurchase = async () => {
    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      const response = await purchaseVehicle(vehicle.id, quantity);
      toast.success(response.message || `Successfully purchased ${quantity} ${vehicle.make} ${vehicle.model}!`);
      onSuccess();
      onClose();
    } catch (err: any) {
      const message =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        "Failed to process purchase. Please try again.";
      setErrorMsg(message);
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
      <div className="w-full max-w-lg rounded-xl border bg-card p-6 shadow-xl space-y-6">
        <div className="flex items-center justify-between border-b pb-4">
          <div className="flex items-center gap-2 font-bold text-lg">
            <ShoppingBag className="h-5 w-5 text-primary" />
            <span>Confirm Purchase</span>
          </div>
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="text-muted-foreground hover:text-foreground text-sm font-semibold cursor-pointer disabled:opacity-50"
          >
            ✕
          </button>
        </div>

        {errorMsg && (
          <div className="flex items-center gap-2 rounded-md bg-destructive/15 p-3 text-sm text-destructive border border-destructive/20">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <div className="flex items-center gap-4 p-3 rounded-lg bg-muted/40 border">
          <img
            src={vehicle.imageUrl || "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800&auto=format&fit=crop&q=60"}
            alt={`${vehicle.make} ${vehicle.model}`}
            className="h-16 w-24 object-cover rounded-md border"
          />
          <div>
            <h4 className="font-bold text-base">
              {vehicle.make} {vehicle.model} ({vehicle.year})
            </h4>
            <p className="text-xs text-muted-foreground">
              Category: {vehicle.category} • Fuel: {vehicle.fuelType}
            </p>
            <p className="text-sm font-semibold text-primary mt-1">
              ${unitPrice.toLocaleString()} / unit
            </p>
          </div>
        </div>

        <div className="space-y-4 border-y py-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Select Quantity:</span>
            <QuantitySelector
              quantity={quantity}
              maxStock={vehicle.quantity}
              onChange={setQuantity}
              disabled={isSubmitting}
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            <span className="text-sm font-bold text-foreground">Total Price:</span>
            <span className="text-xl font-extrabold text-primary">
              {formattedTotalPrice}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isSubmitting}
            className="cursor-pointer"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handlePurchase}
            disabled={isSubmitting || vehicle.quantity <= 0}
            className="cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <CheckCircle2 className="mr-2 h-4 w-4" />
                Confirm & Pay
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PurchaseDialog;
