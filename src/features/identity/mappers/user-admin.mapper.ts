
import { User } from "@prisma/client";
import { UserAdminRowDTO } from "../types/user-admin-row.dto";

export function toUserAdminRowDTO(u: User): UserAdminRowDTO {
  return {
    id: u.id,
    name: u.name,
    email: u.email,
    role: u.role as "ADMIN" | "CUSTOMER",
    isActive: true,
    createdAt: u.createdAt.toISOString(),
  };
}