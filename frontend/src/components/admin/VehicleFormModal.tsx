import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Plus, Edit, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import type { Vehicle, VehicleCategory, FuelType, Transmission } from "@/types/vehicle";
import { createVehicle, updateVehicle } from "@/api/vehicle.api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const vehicleSchema = z.object({
  make: z.string().min(1, "Make is required"),
  model: z.string().min(1, "Model is required"),
  category: z.enum(["SEDAN", "SUV", "HATCHBACK", "COUPE", "CONVERTIBLE", "WAGON", "PICKUP", "VAN"]),
  year: z.coerce.number().min(1900, "Year must be at least 1900").max(new Date().getFullYear() + 1),
  fuelType: z.enum(["PETROL", "DIESEL", "HYBRID", "ELECTRIC", "CNG"]),
  color: z.string().min(1, "Color is required"),
  transmission: z.enum(["MANUAL", "AUTOMATIC"]),
  price: z.coerce.number().positive("Price must be greater than 0"),
  quantity: z.coerce.number().min(0, "Quantity cannot be negative"),
  description: z.string().min(1, "Description is required"),
  imageUrl: z.string().url("Please enter a valid Image URL"),
});

type VehicleFormInputs = z.infer<typeof vehicleSchema>;

interface VehicleFormModalProps {
  vehicle?: Vehicle | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const VehicleFormModal: React.FC<VehicleFormModalProps> = ({
  vehicle,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const isEditing = Boolean(vehicle);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<VehicleFormInputs>({
    resolver: zodResolver(vehicleSchema as any),
    defaultValues: {
      make: "",
      model: "",
      category: "SEDAN",
      year: new Date().getFullYear(),
      fuelType: "PETROL",
      color: "Black",
      transmission: "AUTOMATIC",
      price: 25000,
      quantity: 5,
      description: "",
      imageUrl: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800&auto=format&fit=crop&q=60",
    },
  });

  useEffect(() => {
    if (vehicle) {
      reset({
        make: vehicle.make,
        model: vehicle.model,
        category: vehicle.category as VehicleCategory,
        year: vehicle.year,
        fuelType: vehicle.fuelType as FuelType,
        color: vehicle.color,
        transmission: vehicle.transmission as Transmission,
        price: Number(vehicle.price),
        quantity: vehicle.quantity,
        description: vehicle.description || "",
        imageUrl: vehicle.imageUrl,
      });
    } else {
      reset({
        make: "",
        model: "",
        category: "SEDAN",
        year: new Date().getFullYear(),
        fuelType: "PETROL",
        color: "Black",
        transmission: "AUTOMATIC",
        price: 25000,
        quantity: 5,
        description: "",
        imageUrl: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800&auto=format&fit=crop&q=60",
      });
    }
  }, [vehicle, reset, isOpen]);

  if (!isOpen) return null;

  const onSubmit = async (data: VehicleFormInputs) => {
    setIsSubmitting(true);
    setServerError(null);

    try {
      if (isEditing && vehicle) {
        const response = await updateVehicle(vehicle.id, data);
        toast.success(response.message || "Vehicle updated successfully");
      } else {
        const response = await createVehicle(data);
        toast.success(response.message || "Vehicle created successfully");
      }
      onSuccess();
      onClose();
    } catch (err: any) {
      const errorMsg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        "Failed to save vehicle details.";
      setServerError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto animate-in fade-in">
      <div className="w-full max-w-2xl my-8 rounded-xl border bg-card p-6 shadow-xl space-y-5 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b pb-3">
          <div className="flex items-center gap-2 font-bold text-lg">
            {isEditing ? <Edit className="h-5 w-5 text-primary" /> : <Plus className="h-5 w-5 text-primary" />}
            <span>{isEditing ? "Edit Vehicle Details" : "Add New Vehicle"}</span>
          </div>
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="text-muted-foreground hover:text-foreground text-sm font-semibold cursor-pointer disabled:opacity-50"
          >
            ✕
          </button>
        </div>

        {serverError && (
          <div className="flex items-center gap-2 rounded-md bg-destructive/15 p-3 text-sm text-destructive border border-destructive/20">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{serverError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="make">Make</Label>
              <Input id="make" placeholder="e.g. Toyota" disabled={isSubmitting} {...register("make")} />
              {errors.make && <p className="text-xs text-destructive">{errors.make.message}</p>}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="model">Model</Label>
              <Input id="model" placeholder="e.g. Camry LE" disabled={isSubmitting} {...register("model")} />
              {errors.model && <p className="text-xs text-destructive">{errors.model.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="category">Category</Label>
              <select
                id="category"
                disabled={isSubmitting}
                {...register("category")}
                className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring cursor-pointer"
              >
                <option value="SEDAN">SEDAN</option>
                <option value="SUV">SUV</option>
                <option value="HATCHBACK">HATCHBACK</option>
                <option value="COUPE">COUPE</option>
                <option value="CONVERTIBLE">CONVERTIBLE</option>
                <option value="WAGON">WAGON</option>
                <option value="PICKUP">PICKUP</option>
                <option value="VAN">VAN</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="year">Year</Label>
              <Input id="year" type="number" disabled={isSubmitting} {...register("year")} />
              {errors.year && <p className="text-xs text-destructive">{errors.year.message}</p>}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="color">Color</Label>
              <Input id="color" placeholder="e.g. Silver" disabled={isSubmitting} {...register("color")} />
              {errors.color && <p className="text-xs text-destructive">{errors.color.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="fuelType">Fuel Type</Label>
              <select
                id="fuelType"
                disabled={isSubmitting}
                {...register("fuelType")}
                className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring cursor-pointer"
              >
                <option value="PETROL">PETROL</option>
                <option value="DIESEL">DIESEL</option>
                <option value="HYBRID">HYBRID</option>
                <option value="ELECTRIC">ELECTRIC</option>
                <option value="CNG">CNG</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="transmission">Transmission</Label>
              <select
                id="transmission"
                disabled={isSubmitting}
                {...register("transmission")}
                className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring cursor-pointer"
              >
                <option value="AUTOMATIC">AUTOMATIC</option>
                <option value="MANUAL">MANUAL</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="price">Price ($)</Label>
              <Input id="price" type="number" step="0.01" disabled={isSubmitting} {...register("price")} />
              {errors.price && <p className="text-xs text-destructive">{errors.price.message}</p>}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="quantity">Quantity in Stock</Label>
              <Input id="quantity" type="number" disabled={isSubmitting} {...register("quantity")} />
              {errors.quantity && <p className="text-xs text-destructive">{errors.quantity.message}</p>}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="imageUrl">Image URL</Label>
            <Input id="imageUrl" placeholder="https://..." disabled={isSubmitting} {...register("imageUrl")} />
            {errors.imageUrl && <p className="text-xs text-destructive">{errors.imageUrl.message}</p>}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="description">Description</Label>
            <textarea
              id="description"
              rows={3}
              disabled={isSubmitting}
              {...register("description")}
              className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            />
            {errors.description && <p className="text-xs text-destructive">{errors.description.message}</p>}
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting} className="cursor-pointer">
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} className="cursor-pointer">
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>{isEditing ? "Save Changes" : "Create Vehicle"}</>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VehicleFormModal;
