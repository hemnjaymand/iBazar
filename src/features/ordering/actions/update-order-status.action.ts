"use server";

import { z } from "zod";
import { updateOrderStatusService } from "../services/update-order-status.service";
import { ok, fail } from "@/shared/types/result";
import { ApplicationError } from "@/server/errors/application-error";
import { requireAdmin } from "@/server/auth/guards";
import type { OrderStatus } from "../types/order.dto";

const updateOrderStatusSchema = z.object({
  orderId: z.string().cuid(),
  status: z.enum(["PENDING", "PAID", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED", "REFUNDED"]),
});

export async function updateOrderStatusAction(input: unknown) {
  await requireAdmin();
  
  const parsed = updateOrderStatusSchema.safeParse(input);
  if (!parsed.success) return fail("VALIDATION_ERROR", "وضعیت انتخابی نامعتبر است");

  try {
    const order = await updateOrderStatusService(
      parsed.data.orderId, 
      parsed.data.status as OrderStatus
    );
    return ok(order);
  } catch (error) {
    if (error instanceof ApplicationError) return fail(error.code, error.message);
    return fail("INTERNAL_ERROR", "خطای سرور در بروزرسانی وضعیت");
  }
}
