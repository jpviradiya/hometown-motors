import { z } from "zod";

export const createVehicleSchema = z.object({
  make: z.string().trim().min(1, "Make is required"),

  model: z.string().trim().min(1, "Model is required"),

  category: z.enum([
    "SEDAN",
    "SUV",
    "HATCHBACK",
    "COUPE",
    "CONVERTIBLE",
    "WAGON",
    "PICKUP",
    "VAN",
  ]),

  year: z
    .number()
    .int()
    .min(1900, "Year must be at least 1900")
    .max(new Date().getFullYear() + 1),

  fuelType: z.enum(["PETROL", "DIESEL", "HYBRID", "ELECTRIC", "CNG"]),

  color: z.string().trim().min(1, "Color is required"),

  transmission: z.enum(["MANUAL", "AUTOMATIC"]),

  price: z.number().positive("Price must be greater than 0"),

  quantity: z.number().int().min(0, "Quantity cannot be negative"),

  description: z.string().trim().min(1, "Description is required"),
});

export const updateVehicleSchema = z.object({
  make: z.string().trim().min(1).optional(),
  model: z.string().trim().min(1).optional(),
  category: z.enum(["SUV", "SEDAN", "HATCHBACK", "TRUCK"]).optional(),
  year: z
    .number()
    .int()
    .min(1886)
    .max(new Date().getFullYear() + 1)
    .optional(),
  fuelType: z.enum(["PETROL", "DIESEL", "ELECTRIC", "HYBRID"]).optional(),
  color: z.string().trim().min(1).optional(),
  transmission: z.enum(["MANUAL", "AUTOMATIC"]).optional(),
  price: z.number().positive().optional(),
  quantity: z.number().int().min(0).optional(),
  description: z.string().trim().min(1).optional(),
});