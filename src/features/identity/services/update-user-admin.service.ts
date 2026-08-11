import { userRepository } from "../repositories/user.repository";
import { toUserAdminRowDTO } from "../mappers/user-admin.mapper";
import { BusinessError } from "@/server/errors/business-error";
import { ErrorCodes } from "@/server/errors/error-codes";
import type { UpdateUserAdminInput } from "../schemas/update-user-admin.schema";

/**
 * تصمیم مهم: یک ادمین نباید بتونه نقش خودش رو از ADMIN به CUSTOMER پایین
 * بیاره یا خودش رو غیرفعال کنه — این جلوی «قفل‌شدن روی پنل ادمین توسط
 * خودش» رو می‌گیره (سناریوی واقعی: آخرین ادمین به‌اشتباه خودش رو دیموت می‌کنه).
 */
export async function updateUserAdminService(
  input: UpdateUserAdminInput,
  actingAdminId: string,
) {
  if (
    input.id === actingAdminId &&
    (input.role === "CUSTOMER" || input.isActive === false)
  ) {
    throw new BusinessError(
      "نمی‌توانید نقش یا وضعیت حساب خودتان را تغییر دهید",
      ErrorCodes.CANNOT_MODIFY_SELF,
    );
  }

  const user = await userRepository.findById(input.id);
  if (!user) {
    throw new BusinessError("کاربر یافت نشد", ErrorCodes.USER_NOT_FOUND);
  }

  const updated = await userRepository.updateRoleAndStatus(input.id, {
    role: input.role,
    isActive: input.isActive,
  });

  return toUserAdminRowDTO(updated);
}
