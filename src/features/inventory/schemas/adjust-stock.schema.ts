// features/inventory/schemas/adjust-stock.schema.ts
import { z } from "zod";

export const adjustStockSchema = z.object({
  variantId: z.string().cuid(),
  quantity: z.coerce
    .number()
    .int()
    .refine((v) => v !== 0, "مقدار نمی‌تواند صفر باشد"),
  type: z.enum(["PURCHASE_RECEIVED", "ADJUSTMENT", "DAMAGED", "RETURN"]),
  reason: z.string().max(300).optional(),
});
export type AdjustStockInput = z.infer<typeof adjustStockSchema>;
export type AdjustStockOutput = z.output<typeof adjustStockSchema>;
