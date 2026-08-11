import { toUserAdminRowDTO } from "../mappers/user-admin.mapper";
import { userRepository } from "../repositories/user.repository";

import { PAGINATION_DEFAULTS } from "@/config/pagination";

export async function listUsersForAdminService(
  page = PAGINATION_DEFAULTS.page,
) {
  const take = PAGINATION_DEFAULTS.pageSize;
  const skip = (page - 1) * take;

  const [users, total] = await Promise.all([
    userRepository.findAllForAdmin({ skip, take }),
    userRepository.countAll(),
  ]);

  return {
    items: users.map(toUserAdminRowDTO),
    totalPages: Math.max(1, Math.ceil(total / take)),
  };
}
