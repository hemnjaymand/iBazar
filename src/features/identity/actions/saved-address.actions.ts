"use server";

import { savedAddressSchema } from "../schemas/saved-address.schema";
import { createSavedAddressService } from "../services/create-saved-address.service";
import { updateSavedAddressService } from "../services/update-saved-address.service";
import { ok, fail } from "@/shared/types/result";
import { ApplicationError } from "@/server/errors/application-error";
import { requireUser } from "@/server/auth/guards";
import { deleteSavedAddressService } from "../services/delete-saved-address.service";

export async function createSavedAddressAction(input: unknown) {
  const user = await requireUser();
  const parsed = savedAddressSchema.safeParse(input);
  if (!parsed.success) return fail("VALIDATION_ERROR", "اطلاعات نامعتبر است");

  try {
    const address = await createSavedAddressService(user.id, parsed.data);
    return ok(address);
  } catch (error) {
    if (error instanceof ApplicationError) return fail(error.code, error.message);
    return fail("INTERNAL_ERROR", "خطای غیرمنتظره");
  }
}

export async function updateSavedAddressAction(id: string, input: unknown) {
  const user = await requireUser();
  const parsed = savedAddressSchema.safeParse(input);
  if (!parsed.success) return fail("VALIDATION_ERROR", "اطلاعات نامعتبر است");

  try {
    const address = await updateSavedAddressService(id, user.id, parsed.data);
    return ok(address);
  } catch (error) {
    if (error instanceof ApplicationError) return fail(error.code, error.message);
    return fail("INTERNAL_ERROR", "خطای غیرمنتظره");
  }
}

export async function deleteSavedAddressAction(id: string) {
  const user = await requireUser();
  try {
    await deleteSavedAddressService(id, user.id);
    return ok(true);
  } catch (error) {
    if (error instanceof ApplicationError) return fail(error.code, error.message);
    return fail("INTERNAL_ERROR", "خطای غیرمنتظره");
  }
}

export async function getSavedAddressesAction() {
  const user = await requireUser();
  const { savedAddressRepository } = await import("../repositories/saved-address.repository");
  const { toSavedAddressDTO } = await import("../mappers/saved-address.mapper");
  const addresses = await savedAddressRepository.findByUser(user.id);
  return ok(addresses.map(toSavedAddressDTO));
}