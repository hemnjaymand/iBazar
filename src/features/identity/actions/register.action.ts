"use server";

import { registerSchema, type RegisterInput } from "../schemas/register.schema";
import { ok, fail } from "@/shared/types/result";
import { ApplicationError } from "@/server/errors/application-error";
import { createUserService } from "../services/create-user.service";

export async function registerAction(input: unknown) {
  // ۱. اعتبارسنجی با Zod
  const parsed = registerSchema.safeParse(input);
  if (!parsed.success) {
    return fail("VALIDATION_ERROR", "اطلاعات نامعتبر است");
  }

  try {
    // ۲. ایجاد کاربر در دیتابیس
    const user = await createUserService(parsed.data);
    // ۳. بازگشت نتیجه موفق
    return ok(user);
  } catch (error) {
    if (error instanceof ApplicationError) {
      return fail(error.code, error.message);
    }
    return fail("INTERNAL_ERROR", "خطای غیرمنتظره");
  }
}