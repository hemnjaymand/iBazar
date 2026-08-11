"use server";

import { cookies } from "next/headers";
import { createOrderSchema } from "../schemas/create-order.schema";
import { createOrderService } from "../services/create-order.service";
import { ok, fail } from "@/shared/types/result";
import { ApplicationError } from "@/server/errors/application-error";
import { auth } from "@/server/auth";
import { listOrdersForAdminService } from "../services";

export async function createOrderAction(input: unknown) {
  const parsed = createOrderSchema.safeParse(input);
  if (!parsed.success) return fail("VALIDATION_ERROR", "اطلاعات نامعتبر است");

  try {
    const session = await auth();
    const cookieStore = await cookies();
    const identity = session?.user
      ? { userId: session.user.id }
      : { sessionToken: cookieStore.get("guest_cart_token")?.value };

    const result = await createOrderService(parsed.data, identity);
    return ok(result);
  } catch (error) {
    if (error instanceof ApplicationError)
      return fail(error.code, error.message);
    return fail("INTERNAL_ERROR", "خطای غیرمنتظره");
  }
}
export async function listOrdersAction(input: { page: number }) {
  try {
    const result = await listOrdersForAdminService(input.page);
    return ok(result);
  } catch (error) {
    return fail("INTERNAL_ERROR", "خطا در دریافت سفارش‌ها");
  }
}
