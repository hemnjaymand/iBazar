import { prisma } from "../../../../lib/prisma";



export const savedAddressRepository = {
  findByUser(userId: string) {
    return prisma.savedAddress.findMany({ // ✅ مفرد
      where: { userId },
      orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
    });
  },
  findById(id: string) {
    return prisma.savedAddress.findUnique({ where: { id } });
  },

  create(
    userId: string,
    data: {
      label: string;
      fullName: string;
      phone: string;
      addressLine: string;
      city: string;
      postalCode: string;
      isDefault: boolean;
    },
  ) {
    return prisma.savedAddress.create({ data: { ...data, userId } });
  },

  update(
    id: string,
    data: Partial<{
      label: string;
      fullName: string;
      phone: string;
      addressLine: string;
      city: string;
      postalCode: string;
      isDefault: boolean;
    }>,
  ) {
    return prisma.savedAddress.update({ where: { id }, data });
  },

  delete(id: string) {
    return prisma.savedAddress.delete({ where: { id } });
  },

  clearDefaultForUser(userId: string) {
    return prisma.savedAddress.updateMany({
      where: { userId, isDefault: true },
      data: { isDefault: false },
    });
  },
};