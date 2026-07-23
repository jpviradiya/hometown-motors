import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Save } from "lucide-react";
import type { Vehicle, VehicleCategory, FuelType, Transmission, CreateVehicleInput } from "@/types/vehicle";
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

export type VehicleFormData = z.infer<typeof vehicleSchema>;

interface VehicleFormProps {
  initialData?: Vehicle | null;
  onSubmit: (data: CreateVehicleInput) => Promise<void>;
  isSubmitting: boolean;
  onCancel: () => void;
}

export const VehicleForm: React.FC<VehicleFormProps> = ({
  initialData,
  onSubmit,
  isSubmitting,
  onCancel,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<VehicleFormData>({
    resolver: zodResolver(vehicleSchema as any),
    defaultValues: {
      make: initialData?.make || "",
      model: initialData?.model || "",
      category: (initialData?.category as VehicleCategory) || "SEDAN",
      year: initialData?.year || new Date().getFullYear(),
      fuelType: (initialData?.fuelType as FuelType) || "PETROL",
      color: initialData?.color || "Silver",
      transmission: (initialData?.transmission as Transmission) || "AUTOMATIC",
      price: initialData ? Number(initialData.price) : 25000,
      quantity: initialData?.quantity ?? 5,
      description: initialData?.description || "",
      imageUrl:
        initialData?.imageUrl ||
        "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800&auto=format&fit=crop&q=60",
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-card border rounded-xl p-6 shadow-xs">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="make">Make</Label>
          <Input id="make" placeholder="e.g. Toyota" disabled={isSubmitting} {...register("make")} />
          {errors.make && <p className="text-xs text-destructive font-medium">{errors.make.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="model">Model</Label>
          <Input id="model" placeholder="e.g. Camry LE" disabled={isSubmitting} {...register("model")} />
          {errors.model && <p className="text-xs text-destructive font-medium">{errors.model.message}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="space-y-2">
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

        <div className="space-y-2">
          <Label htmlFor="year">Year</Label>
          <Input id="year" type="number" disabled={isSubmitting} {...register("year")} />
          {errors.year && <p className="text-xs text-destructive font-medium">{errors.year.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="color">Color</Label>
          <Input id="color" placeholder="e.g. Silver" disabled={isSubmitting} {...register("color")} />
          {errors.color && <p className="text-xs text-destructive font-medium">{errors.color.message}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
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

        <div className="space-y-2">
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
        <div className="space-y-2">
          <Label htmlFor="price">Price ($)</Label>
          <Input id="price" type="number" step="0.01" disabled={isSubmitting} {...register("price")} />
          {errors.price && <p className="text-xs text-destructive font-medium">{errors.price.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="quantity">Quantity in Stock</Label>
          <Input id="quantity" type="number" disabled={isSubmitting} {...register("quantity")} />
          {errors.quantity && <p className="text-xs text-destructive font-medium">{errors.quantity.message}</p>}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="imageUrl">Image URL</Label>
        <Input id="imageUrl" placeholder="https://..." disabled={isSubmitting} {...register("imageUrl")} />
        {errors.imageUrl && <p className="text-xs text-destructive font-medium">{errors.imageUrl.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <textarea
          id="description"
          rows={4}
          disabled={isSubmitting}
          {...register("description")}
          className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          placeholder="Enter a detailed description of the vehicle..."
        />
        {errors.description && <p className="text-xs text-destructive font-medium">{errors.description.message}</p>}
      </div>

      <div className="flex items-center justify-end gap-3 pt-4 border-t">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting} className="cursor-pointer">
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting} className="cursor-pointer font-bold">
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              {initialData ? "Update Vehicle" : "Save Vehicle"}
            </>
          )}
        </Button>
      </div>
    </form>
  );
};

export default VehicleForm;
