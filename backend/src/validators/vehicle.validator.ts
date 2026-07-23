import { z } from "zod";
import { FuelType, Transmission, VehicleCategory } from "#/lib/prisma/generated/client";

export const createVehicleSchema = z.object({
  make: z.string().trim().min(1, "Make is required"),
  model: z.string().trim().min(1, "Model is required"),
  category: z.nativeEnum(VehicleCategory),
  year: z
    .number()
    .int()
    .min(1900, "Year must be at least 1900")
    .max(new Date().getFullYear() + 1),
  fuelType: z.nativeEnum(FuelType),
  color: z.string().trim().min(1, "Color is required"),
  transmission: z.nativeEnum(Transmission),
  price: z.number().positive("Price must be greater than 0"),
  quantity: z.number().int().min(0, "Quantity cannot be negative"),
  description: z.string().trim().min(1, "Description is required"),
  imageUrl: z.string().trim().min(1, "Image URL is required"),
});

export type CreateVehicleInput = z.infer<typeof createVehicleSchema>;

export const updateVehicleSchema = z.object({
  make: z.string().trim().min(1).optional(),
  model: z.string().trim().min(1).optional(),
  category: z.nativeEnum(VehicleCategory).optional(),
  year: z
    .number()
    .int()
    .min(1886)
    .max(new Date().getFullYear() + 1)
    .optional(),
  fuelType: z.nativeEnum(FuelType).optional(),
  color: z.string().trim().min(1).optional(),
  transmission: z.nativeEnum(Transmission).optional(),
  price: z.number().positive().optional(),
  quantity: z.number().int().min(0).optional(),
  description: z.string().trim().min(1).optional(),
  imageUrl: z.string().trim().min(1).optional(),
});

export type UpdateVehicleInput = z.infer<typeof updateVehicleSchema>;