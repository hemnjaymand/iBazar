
import { User } from "@prisma/client";
import { UserResponseDTO } from "../types";

export function toUserResponseDTO(user: User): UserResponseDTO {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    createdAt: user.createdAt.toISOString(),
    role: user.role,
  };
}
