"use server";

import { z } from "zod";
import { notificationRepository } from "../repositories/notification.repository";
import { markNotificationAsReadService } from "../services/mark-notification-as-read.service";
import { toNotificationDTO } from "../lib/notification.mapper";
import { ok, fail } from "@/shared/types/result";
import { ApplicationError } from "@/server/errors/application-error";
import { requireUser } from "@/server/auth/guards";

const markAsReadSchema = z.object({ notificationId: z.string().cuid() });

export async function getNotificationsAction() {
  try {
    const user = await requireUser();
    const notifications = await notificationRepository.findByUser(user.id);
    return ok(notifications.map(toNotificationDTO));
  } catch (error) {
    if (error instanceof ApplicationError) return fail(error.code, error.message);
    return fail("INTERNAL_ERROR", "خطای غیرمنتظره");
  }
}

export async function markNotificationAsReadAction(input: unknown) {
  const parsed = markAsReadSchema.safeParse(input);
  if (!parsed.success) return fail("VALIDATION_ERROR", "اطلاعات نامعتبر است");

  try {
    await requireUser();
    await markNotificationAsReadService(parsed.data.notificationId);
    return ok(true);
  } catch (error) {
    if (error instanceof ApplicationError) return fail(error.code, error.message);
    return fail("INTERNAL_ERROR", "خطای غیرمنتظره");
  }
}
