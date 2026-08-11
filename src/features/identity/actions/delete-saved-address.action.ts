"use server";

import { ok, fail } from "@/shared/types/result";
import { ApplicationError } from "@/server/errors/application-error";
import { requireUser } from "@/server/auth/guards";
import { deleteSavedAddressService } from "../services/delete-saved-address.service";

export async function deleteSavedAddressAction(id: string) {
  const user = await requireUser();
  
  try {
    await deleteSavedAddressService(id, user.id);
    return ok(true);
  } catch (error) {
    if (error instanceof ApplicationError) {
      return fail(error.code, error.message);
    }
    return fail("INTERNAL_ERROR", "خطای غیرمنتظره");
  }
}