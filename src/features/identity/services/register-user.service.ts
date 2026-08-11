// features/identity/services/register-user.service.ts
import bcrypt from "bcryptjs";
import { userRepository } from "../repositories/user.repository";
import { toUserResponseDTO } from "../lib/user.mapper";
import type { RegisterInput } from "../schemas/register.schema";
import { BusinessError } from "@/server/errors/business-error";
import { ErrorCodes } from "@/server/errors/error-codes";

export async function registerUserService(input: RegisterInput) {
  const existing = await userRepository.findByEmail(input.email);
  if (existing) {
    throw new BusinessError(
      "این ایمیل قبلاً ثبت شده است",
      ErrorCodes.EMAIL_ALREADY_EXISTS,
    );
  }

  const passwordHash = await bcrypt.hash(input.password, 10);
  const user = await userRepository.create({
    name: input.name,
    email: input.email,
    passwordHash,
  });

  return toUserResponseDTO(user);
}
