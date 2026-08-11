import { BusinessError } from "@/server/errors/business-error";
import { ErrorCodes } from "@/server/errors/error-codes";
import { savedAddressRepository } from "../repositories/saved-address.repository";

// ✨ تعریف صریح ساختار داده‌های ورودی برای ساخت آدرس
export interface CreateAddressInput {
  label: string;
  fullName: string;
  phone: string;
  addressLine: string;
  city: string;
  postalCode: string;
  isDefault: boolean;
}

// ✨ استفاده از Partial برای ویرایش که تمام فیلدها در آن اختیاری هستند
export type UpdateAddressInput = Partial<CreateAddressInput>;

export async function createAddressService(userId: string, data: CreateAddressInput) {
  // اگر آدرس جدید به عنوان پیش‌فرض انتخاب شده است، بقیه آدرس‌های کاربر را از حالت پیش‌فرض خارج کنیم
  if (data.isDefault) {
    await savedAddressRepository.clearDefaultForUser(userId);
  }

  return await savedAddressRepository.create(userId, data);
}

export async function updateAddressService(
  userId: string, 
  addressId: string, 
  data: UpdateAddressInput
) {
  const existing = await savedAddressRepository.findById(addressId);
  if (!existing || existing.userId !== userId) {
    throw new BusinessError("آدرس مورد نظر یافت نشد", ErrorCodes.NOT_FOUND);
  }

  if (data.isDefault) {
    await savedAddressRepository.clearDefaultForUser(userId);
  }

  return await savedAddressRepository.update(addressId, data);
}