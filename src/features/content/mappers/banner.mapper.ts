// features/content/mappers/banner.mapper.ts — نسخه‌ی تکمیل‌شده
import type { Banner } from "@prisma/client";
import type { BannerDTO } from "../types/banner.dto";

export function toBannerDTO(b: Banner): BannerDTO {
  return { id: b.id, title: b.title, imageUrl: b.imageUrl, linkUrl: b.linkUrl, placement: b.placement, sortOrder: b.sortOrder };
}