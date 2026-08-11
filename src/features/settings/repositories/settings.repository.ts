import { prisma } from "../../../../lib/prisma";



export const settingsRepository = {
  findByKey(key: string) {
    return prisma.appSetting.findUnique({
      where: {
        key,
      },
    });
  },

  findAll() {
    return prisma.appSetting.findMany({
      where: {
        isActive: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  },

  upsert(
    key: string,
    value: string,
    type: "STRING" | "IMAGE" | "BOOLEAN" | "NUMBER" | "JSON",
  ) {
    return prisma.appSetting.upsert({
      where: {
        key,
      },

      update: {
        value,
        type,
      },

      create: {
        key,
        value,
        type,
      },
    });
  },

  delete(key: string) {
    return prisma.appSetting.delete({
      where: {
        key,
      },
    });
  },
};