import { z } from "zod";

export const quantitySchema = z.number().int().positive("Quantity must be greater than zero");

export const purchaseSchema = z.object({
  quantity: quantitySchema,
});

export type PurchaseDto = z.infer<typeof purchaseSchema>;
