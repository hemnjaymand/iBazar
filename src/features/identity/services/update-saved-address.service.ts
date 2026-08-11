import { savedAddressRepository } from "../repositories/saved-address.repository";
import { toSavedAddressDTO } from "../mappers/saved-address.mapper";
import { BusinessError } from "@/server/errors/business-error";
import { ErrorCodes } from "@/server/errors/error-codes";
import type { SavedAddressInput } from "../schemas/saved-address.schema";

export async function updateSavedAddressService(id: string, userId: string, input: SavedAddressInput) {
  const existing = await savedAddressRepository.findById(id);
  // چک مالکیت: کاربر فقط بتونه آدرس خودش رو ویرایش کنه، نه آدرس کاربر دیگه
  if (!existing || existing.userId !== userId) {
    throw new BusinessError("آدرس یافت نشد", ErrorCodes.ADDRESS_NOT_FOUND);
  }

  if (input.isDefault) {
    await savedAddressRepository.clearDefaultForUser(userId);
  }
  const updated = await savedAddressRepository.update(id, input);
  return toSavedAddressDTO(updated);
}