// features/identity/lib/user.mapper.ts
import { User } from "@prisma/client/client";
import type { UserResponseDTO } from "../types/user-response.dto";

export function toUserResponseDTO(user: User): UserResponseDTO {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    createdAt:user.createdAt.toISOString()
  };
}