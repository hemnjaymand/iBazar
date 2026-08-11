import { notificationRepository } from "../repositories/notification.repository";

export async function markNotificationAsReadService(notificationId: string) {
  return notificationRepository.markAsRead(notificationId);
}
