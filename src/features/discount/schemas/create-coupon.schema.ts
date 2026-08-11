// features/coupons/schemas/create-coupon.schema.ts
import { z } from "zod";

export const createCouponSchema = z.object({
  code: z
    .string()
    .min(3)
    .max(40)
    .regex(/^[A-Z0-9]+$/, "فقط حروف بزرگ انگلیسی و عدد"),
  type: z.enum(["PERCENTAGE", "FIXED_AMOUNT"]),
  value: z.coerce.number().positive("مقدار تخفیف باید مثبت باشد"),
  minOrderAmount: z.coerce.number().positive().optional(),
  maxUsageCount: z.coerce.number().int().positive().optional(),
  expiresAt: z.string().optional(),
});

export type CreateCouponInput = z.input<typeof createCouponSchema>;
// ✅ حتماً CreateCouponOutput را export کنید
export type CreateCouponOutput = z.output<typeof createCouponSchema>;