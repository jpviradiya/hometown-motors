import { z } from "zod";
import { quantitySchema } from "./purchase.validator";

export const restockSchema = z.object({
  quantity: quantitySchema,
});

export type RestockDto = z.infer<typeof restockSchema>;
