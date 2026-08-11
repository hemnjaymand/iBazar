import { prisma } from "../../../../lib/prisma";


export const appSettingRepository = {
  findAll() {
    return prisma.appSetting.findMany();
  },
  findByKey(key: string) {
    return prisma.appSetting.findUnique({ where: { key } });
  },
  upsert(key: string, value: string) {
    return prisma.appSetting.upsert({
      where: { key },
      update: { value },
      create: { key, value },
    });
  },
};
