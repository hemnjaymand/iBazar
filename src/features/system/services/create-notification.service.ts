import { notificationRepository } from "../repositories/notification.repository";
import { toNotificationDTO } from "../lib/notification.mapper";
import type { NotificationType } from "@prisma/client";

export async function createNotificationService(userId: string, type: NotificationType, title: string, message: string) {
  const notification = await notificationRepository.create({ userId, type, title, message });
  return toNotificationDTO(notification);
}
