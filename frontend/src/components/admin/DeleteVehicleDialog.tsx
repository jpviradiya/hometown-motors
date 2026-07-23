import React, { useState } from "react";
import { Loader2, Trash2, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import type { Vehicle } from "@/types/vehicle";
import { deleteVehicle } from "@/api/vehicle.api";
import { Button } from "@/components/ui/button";

interface DeleteVehicleDialogProps {
  vehicle: Vehicle;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const DeleteVehicleDialog: React.FC<DeleteVehicleDialogProps> = ({
  vehicle,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleDelete = async () => {
    setIsDeleting(true);
    setErrorMsg(null);

    try {
      const response = await deleteVehicle(vehicle.id);
      toast.success(response.message || `Deleted ${vehicle.make} ${vehicle.model}`);
      onSuccess();
      onClose();
    } catch (err: any) {
      const message =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        "Failed to delete vehicle.";
      setErrorMsg(message);
      toast.error(message);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
      <div className="w-full max-w-md rounded-xl border bg-card p-6 shadow-xl space-y-5">
        <div className="flex items-center gap-3 text-destructive border-b pb-3">
          <div className="p-2 rounded-full bg-destructive/15">
            <Trash2 className="h-5 w-5" />
          </div>
          <h3 className="font-bold text-lg">Delete Vehicle</h3>
        </div>

        {errorMsg && (
          <div className="flex items-center gap-2 rounded-md bg-destructive/15 p-3 text-sm text-destructive border border-destructive/20">
            <AlertTriangle className="h-4 w-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <p className="text-sm text-muted-foreground leading-relaxed">
          Are you sure you want to delete{" "}
          <strong className="text-foreground">{vehicle.make} {vehicle.model} ({vehicle.year})</strong>? This action cannot be undone.
        </p>

        <div className="flex items-center justify-end gap-3 pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isDeleting}
            className="cursor-pointer"
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting}
            className="cursor-pointer"
          >
            {isDeleting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Vehicle
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DeleteVehicleDialog;
