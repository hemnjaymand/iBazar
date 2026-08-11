import { userRepository } from "../repositories/user.repository";
// import { toUserDTO } from "../mappers/user.mapper";
import { BusinessError } from "@/server/errors/business-error";
import { ErrorCodes } from "@/server/errors/error-codes";
import bcrypt from "bcryptjs";
import type { RegisterInput } from "../schemas/register.schema";
import { toUserResponseDTO } from "../mappers/user.mapper";

export async function createUserService(input: RegisterInput) {
  // بررسی وجود کاربر با ایمیل تکراری
  const existing = await userRepository.findByEmail(input.email);
  if (existing) {
    throw new BusinessError(
      "این ایمیل قبلاً ثبت شده است",
      ErrorCodes.EMAIL_ALREADY_EXISTS,
    );
  }

  // هش کردن رمز عبور
  const hashedPassword = await bcrypt.hash(input.password, 12);

  // ایجاد کاربر
  const user = await userRepository.create({
    name: input.name,
    email: input.email,
    passwordHash: hashedPassword,
    // role: "CUSTOMER",
  });

  return toUserResponseDTO(user);
}
