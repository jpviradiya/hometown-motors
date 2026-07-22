import { z } from "zod";

export const createVehicleSchema = z.object({
  make: z.string().min(1, "Make is required"),
  model: z.string(),
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
  year: z.number(),
  fuelType: z.enum(["PETROL", "DIESEL", "HYBRID", "ELECTRIC", "CNG"]),
  color: z.string(),
  transmission: z.enum(["MANUAL", "AUTOMATIC"]),
  price: z.number(),
  quantity: z.number(),
  description: z.string(),
});
