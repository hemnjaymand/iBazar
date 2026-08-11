// features/inventory/actions/adjust-stock.action.ts
"use server";

import { revalidateTag } from "next/cache";
import { adjustStockSchema } from "../schemas/adjust-stock.schema";
import { adjustStockService } from "../services/adjust-stock.service";
import { ok, fail } from "@/shared/types/result";
import { ApplicationError } from "@/server/errors/application-error";
import { requireAdmin, requireUser} from "@/server/auth/guards"; // 👈 اضافه شدن getCurrentUser یا requireUser

export async function adjustStockAction(input: unknown) {
  // ۱. بررسی دسترسی ادمین
  await requireAdmin(); 

  // ۲. دریافت مشخصات کاربر جاری برای گرفتن id
  const user = await requireUser(); 
  if (!user) return fail("UNAUTHORIZED", "کاربر یافت نشد");

  const parsed = adjustStockSchema.safeParse(input);
  if (!parsed.success) return fail("VALIDATION_ERROR", "اطلاعات نامعتبر است");

  try {
    // ۳. ارسال user.id به لایه سرویس
    const movement = await adjustStockService(parsed.data, user.id);
    revalidateTag("inventory", "default");
    revalidateTag("products", "default");
    return ok(movement);
  } catch (error) {
    if (error instanceof ApplicationError)
      return fail(error.code, error.message);
    return fail("INTERNAL_ERROR", "خطای غیرمنتظره");
  }
}