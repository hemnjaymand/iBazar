"use server";

import { updateAppSettingSchema } from "../schemas/app-setting.schema";
import { updateAppSettingService } from "../services/update-app-setting.service";
import { getAppSettingsService } from "../services/get-app-settings.service";
import { ok, fail } from "@/shared/types/result";
import { ApplicationError } from "@/server/errors/application-error";
import { requireAdmin } from "@/server/auth/guards";

export async function getAppSettingsAction() {
  try {
    await requireAdmin();
    const settings = await getAppSettingsService();
    return ok(settings);
  } catch (error) {
    if (error instanceof ApplicationError)
      return fail(error.code, error.message);
    return fail("INTERNAL_ERROR", "خطای غیرمنتظره");
  }
}

export async function updateAppSettingAction(input: unknown) {
  await requireAdmin();
  const parsed = updateAppSettingSchema.safeParse(input);
  if (!parsed.success) return fail("VALIDATION_ERROR", "اطلاعات نامعتبر است");

  try {
    await updateAppSettingService(parsed.data);
    return ok(true);
  } catch (error) {
    if (error instanceof ApplicationError)
      return fail(error.code, error.message);
    return fail("INTERNAL_ERROR", "خطای غیرمنتظره");
  }
}
