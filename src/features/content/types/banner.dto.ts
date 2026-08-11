// features/content/types/banner.dto.ts — نسخه‌ی تکمیل‌شده
export interface BannerDTO {
  id: string;
  title: string;
  imageUrl: string;
  linkUrl: string | null;
  placement: string;
  sortOrder: number;
}