import { User } from "@prisma/client";
import { prisma } from "../../../../lib/prisma";


export const userRepository = {
  findByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { email } });
  },
  findById(id: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { id } });
  },
  create(data: {
    name: string;
    email: string;
    passwordHash: string;
  }): Promise<User> {
    return prisma.user.create({ data });
  },
  update(id: string, data: { name?: string }): Promise<User> {
    return prisma.user.update({ where: { id }, data });
  },
  // برای پنل ادمین — فهرست همه‌ی کاربران با صفحه‌بندی
  findAllForAdmin(params: { skip: number; take: number }) {
    return prisma.user.findMany({
      skip: params.skip,
      take: params.take,
      orderBy: { createdAt: "desc" },
    });
  },
  countAll() {
    return prisma.user.count();
  },
  updateRoleAndStatus(
    id: string,
    data: { role?: "ADMIN" | "CUSTOMER"; isActive?: boolean },
  ) {
    return prisma.user.update({ where: { id }, data });
  },
};
