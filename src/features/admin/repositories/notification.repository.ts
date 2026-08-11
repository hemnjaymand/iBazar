// features/system/repositories/notification.repository.ts
import { NotificationType } from "@prisma/client";
import { prisma } from "../../../../lib/prisma";

<<<<<<< HEAD

=======
import { NotificationType } from "../../../../prisma/generated/enums";
>>>>>>> aa78aba651c6bd1ccf6ada401c862c3a2f38d3dc

export const notificationRepository = {
  findByUser(userId: string) {
    return prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 20,
    });
  },
  create(data: {
    userId: string;
    type: NotificationType;
    title: string;
    message: string;
  }) {
    return prisma.notification.create({ data });
  },
  markAsRead(id: string) {
    return prisma.notification.update({
      where: { id },
      data: { isRead: true },
    });
  },
};
