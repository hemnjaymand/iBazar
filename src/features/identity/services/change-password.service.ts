import bcrypt from "bcryptjs";
import { userRepository } from "../repositories/user.repository";
import { BusinessError } from "@/server/errors/business-error";
import { ErrorCodes } from "@/server/errors/error-codes";
import { prisma } from "../../../../lib/prisma";

export async function changePasswordService(
  userId: string,
  currentPassword: string,
  newPassword: string,
) {
  const user = await userRepository.findById(userId);
  if (!user) {
    throw new BusinessError("کاربر یافت نشد", ErrorCodes.USER_NOT_FOUND);
  }

  const valid = await bcrypt.compare(currentPassword, user.passwordHash);
  if (!valid) {
    throw new BusinessError(
      "رمز عبور فعلی اشتباه است",
      ErrorCodes.INVALID_CURRENT_PASSWORD,
    );
  }

  const passwordHash = await bcrypt.hash(newPassword, 10);
  await prisma.user.update({ where: { id: userId }, data: { passwordHash } });
}
