import { z } from "zod";

export const purchaseSchema = z.object({
  quantity: z.number().int().positive("Quantity must be greater than zero"),
});

export type PurchaseDto = z.infer<typeof purchaseSchema>;
