"use server";

import { changePasswordSchema } from "../schemas/change-password.schema";
import { changePasswordService } from "../services/change-password.service";
import { ok, fail } from "@/shared/types/result";
import { ApplicationError } from "@/server/errors/application-error";
import { requireUser } from "@/server/auth/guards";

export async function changePasswordAction(input: unknown) {
  const user = await requireUser();
  const parsed = changePasswordSchema.safeParse(input);
 if (!parsed.success) return fail("VALIDATION_ERROR", parsed.error.issues[0]?.message ?? "اطلاعات نامعتبر است");
  try {
    await changePasswordService(user.id, parsed.data.currentPassword, parsed.data.newPassword);
    return ok(true);
  } catch (error) {
    if (error instanceof ApplicationError) return fail(error.code, error.message);
    return fail("INTERNAL_ERROR", "خطای غیرمنتظره");
  }
}