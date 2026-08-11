"use server";

import { updateUserAdminSchema } from "../schemas/update-user-admin.schema";
import { updateUserAdminService } from "../services/update-user-admin.service";
import { ok, fail } from "@/shared/types/result";
import { ApplicationError } from "@/server/errors/application-error";
import { requireAdmin } from "@/server/auth/guards";

export async function updateUserAdminAction(input: unknown) {
  const admin = await requireAdmin();
  const parsed = updateUserAdminSchema.safeParse(input);
  if (!parsed.success) return fail("VALIDATION_ERROR", "اطلاعات نامعتبر است");

  try {
    const user = await updateUserAdminService(parsed.data, admin.id);
    return ok(user);
  } catch (error) {
    if (error instanceof ApplicationError)
      return fail(error.code, error.message);
    return fail("INTERNAL_ERROR", "خطای غیرمنتظره");
  }
}
