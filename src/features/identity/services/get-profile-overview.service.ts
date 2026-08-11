import { userRepository } from "../repositories/user.repository";
import { BusinessError } from "@/server/errors/business-error";
import { ErrorCodes } from "@/server/errors/error-codes";
import type { ProfileOverviewDTO } from "../types/profile-overview.dto";
import { prisma } from "../../../../lib/prisma";

/**
 * این سرویس هم مثل getDashboardSummaryService یک Aggregator است — از
 * دیتای Identity خودش (نام/ایمیل) به‌علاوه‌ی شمارش سفارش و Wishlist
 * استفاده می‌کنه. چون شمارش این دو صرفاً یک count ساده‌ست (نه منطق
 * کسب‌وکاری)، مستقیم Prisma استفاده شده به‌جای عبور از index.ts کامل
 * دامنه‌های دیگه — تصمیمی که برای این سطح از سادگی قابل دفاعه.
 */
export async function getProfileOverviewService(userId: string): Promise<ProfileOverviewDTO> {
  const user = await userRepository.findById(userId);
  if (!user) {
    throw new BusinessError("کاربر یافت نشد", ErrorCodes.USER_NOT_FOUND);
  }

  const [orderCount, wishlist] = await Promise.all([
    prisma.order.count({ where: { userId } }),
    prisma.wishlist.findUnique({ where: { userId }, include: { _count: { select: { items: true } } } }),
  ]);

  return {
    name: user.name,
    email: user.email,
    memberSince: user.createdAt.toISOString(),
    orderCount,
    wishlistCount: wishlist?._count.items ?? 0,
  };
}