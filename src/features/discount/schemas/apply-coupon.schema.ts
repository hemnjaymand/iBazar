import { z } from "zod";

export const applyCouponSchema = z.object({
  code: z.string().min(1).max(40),
});
