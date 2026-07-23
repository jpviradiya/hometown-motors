import React, { useState } from "react";
import { Loader2, ShoppingBag, AlertCircle, CheckCircle2, X } from "lucide-react";
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
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-2 sm:p-4 animate-in fade-in">
      <div className="w-full max-w-lg rounded-t-2xl sm:rounded-xl border bg-card p-4 sm:p-6 shadow-xl space-y-5 max-h-[90vh] overflow-y-auto animate-in slide-in-from-bottom-5 sm:slide-in-from-bottom-0">
        <div className="flex items-center justify-between border-b pb-3">
          <div className="flex items-center gap-2 font-bold text-base sm:text-lg">
            <ShoppingBag className="h-5 w-5 text-primary" />
            <span>Confirm Purchase</span>
          </div>
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="text-muted-foreground hover:text-foreground p-1 rounded-md cursor-pointer disabled:opacity-50 min-h-[36px] min-w-[36px] flex items-center justify-center"
            aria-label="Close dialog"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {errorMsg && (
          <div className="flex items-center gap-2 rounded-md bg-destructive/15 p-3 text-sm text-destructive border border-destructive/20">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <div className="flex items-center gap-3 sm:gap-4 p-3 rounded-lg bg-muted/40 border">
          <img
            src={vehicle.imageUrl || "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800&auto=format&fit=crop&q=60"}
            alt={`${vehicle.make} ${vehicle.model}`}
            className="h-16 w-20 sm:w-24 object-cover rounded-md border shrink-0 bg-muted"
          />
          <div className="min-w-0 flex-1">
            <h4 className="font-bold text-sm sm:text-base truncate">
              {vehicle.make} {vehicle.model} ({vehicle.year})
            </h4>
            <p className="text-xs text-muted-foreground truncate">
              {vehicle.category} • {vehicle.fuelType}
            </p>
            <p className="text-sm font-semibold text-primary mt-1">
              ${unitPrice.toLocaleString()} / unit
            </p>
          </div>
        </div>

        <div className="space-y-4 border-y py-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0">
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

        <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-2 sm:gap-3 pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isSubmitting}
            className="w-full sm:w-auto cursor-pointer min-h-[44px]"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handlePurchase}
            disabled={isSubmitting || vehicle.quantity <= 0}
            className="w-full sm:w-auto cursor-pointer min-h-[44px] font-bold"
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
