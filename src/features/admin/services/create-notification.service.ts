// features/system/services/create-notification.service.ts
import { toNotificationDTO } from "@/features/system/lib/notification.mapper";
import { notificationRepository } from "../repositories/notification.repository";
import { NotificationType } from "@prisma/client/enums";

export async function createNotificationService(userId: string, type: NotificationType, title: string, message: string) {
  const notification = await notificationRepository.create({ userId, type, title, message });
  return toNotificationDTO(notification);
}