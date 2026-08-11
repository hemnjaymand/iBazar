"use server";


import { ok, fail } from "@/shared/types/result";
import { ApplicationError } from "@/server/errors/application-error";
import { requireUser } from "@/server/auth/guards";
import { updateProfileSchema } from "../schemas/update-profile.schema";
import { updateProfileService } from "../services/update-profile.service";

export async function updateProfileAction(input: unknown) {
  const user = await requireUser();
  const parsed = updateProfileSchema.safeParse(input);
  if (!parsed.success) return fail("VALIDATION_ERROR", "اطلاعات نامعتبر است");

  try {
    const updated = await updateProfileService(user.id, parsed.data);
    return ok(updated);
  } catch (error) {
    if (error instanceof ApplicationError) return fail(error.code, error.message);
    return fail("INTERNAL_ERROR", "خطای غیرمنتظره");
  }
}