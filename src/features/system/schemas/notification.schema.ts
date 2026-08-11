// features/system/schemas/notification.schema.ts
import { z } from "zod";

export const markAsReadSchema = z.object({
  notificationId: z.string().cuid(),
});