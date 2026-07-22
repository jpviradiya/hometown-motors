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
