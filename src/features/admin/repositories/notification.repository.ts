// features/system/repositories/notification.repository.ts
import { prisma } from "../../../../lib/prisma";

import { NotificationType } from "../../../../prisma/generated/enums";

export const notificationRepository = {
  findByUser(userId: string) {
    return prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 20,
    });
  },
  create(data: { userId: string; type: NotificationType; title: string; message: string }) {
    return prisma.notification.create({ data });
  },
  markAsRead(id: string) {
    return prisma.notification.update({ where: { id }, data: { isRead: true } });
  },
};
