import { savedAddressRepository } from "../repositories/saved-address.repository";
import { BusinessError } from "@/server/errors/business-error";
import { ErrorCodes } from "@/server/errors/error-codes";

export async function deleteSavedAddressService(id: string, userId: string) {
  // ۱. پیدا کردن آدرس در دیتابیس
  const existing = await savedAddressRepository.findById(id);
  
  // ۲. چک مالکیت: کاربر فقط می‌تواند آدرس خودش را حذف کند
  if (!existing || existing.userId !== userId) {
    throw new BusinessError("آدرس یافت نشد", ErrorCodes.ADDRESS_NOT_FOUND);
  }

  // ۳. حذف نهایی آدرس
  await savedAddressRepository.delete(id);
}