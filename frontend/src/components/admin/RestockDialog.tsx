import React, { useState } from "react";
import { Loader2, PlusCircle, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import type { Vehicle } from "@/types/vehicle";
import { restockVehicle } from "@/api/vehicle.api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface RestockDialogProps {
  vehicle: Vehicle;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const RestockDialog: React.FC<RestockDialogProps> = ({
  vehicle,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [addQuantity, setAddQuantity] = useState<number>(5);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const currentStock = vehicle.quantity;
  const newTotalStock = currentStock + (Number(addQuantity) || 0);

  const handleRestock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (addQuantity <= 0) {
      setErrorMsg("Restock quantity must be greater than 0");
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      const response = await restockVehicle(vehicle.id, addQuantity);
      toast.success(response.message || `Restocked ${addQuantity} units for ${vehicle.make} ${vehicle.model}`);
      onSuccess();
      onClose();
    } catch (err: any) {
      const message =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        "Failed to restock vehicle. Please try again.";
      setErrorMsg(message);
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
      <div className="w-full max-w-md rounded-xl border bg-card p-6 shadow-xl space-y-5">
        <div className="flex items-center justify-between border-b pb-3">
          <div className="flex items-center gap-2 font-bold text-lg">
            <PlusCircle className="h-5 w-5 text-primary" />
            <span>Restock Vehicle Inventory</span>
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

        <div className="rounded-lg bg-muted/40 p-3 border space-y-1">
          <h4 className="font-bold text-sm">
            {vehicle.make} {vehicle.model} ({vehicle.year})
          </h4>
          <p className="text-xs text-muted-foreground">
            Current Stock Level: <span className="font-bold text-foreground">{currentStock} units</span>
          </p>
        </div>

        <form onSubmit={handleRestock} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="restock-quantity">Quantity to Add</Label>
            <Input
              id="restock-quantity"
              type="number"
              min="1"
              max="1000"
              value={addQuantity}
              onChange={(e) => setAddQuantity(Math.max(1, parseInt(e.target.value) || 0))}
              disabled={isSubmitting}
              className="h-10"
              required
            />
          </div>

          <div className="rounded-md bg-primary/10 p-3 text-xs text-primary border border-primary/20 flex justify-between items-center font-medium">
            <span>New Total Stock:</span>
            <span className="font-bold text-sm">{newTotalStock} units</span>
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
            <Button type="submit" disabled={isSubmitting} className="cursor-pointer">
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Restocking...
                </>
              ) : (
                <>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Confirm Restock
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RestockDialog;
