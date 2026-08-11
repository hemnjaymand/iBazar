export interface CouponDTO {
  id: string;
  code: string;
  type: string;
  value: string;
  minOrderAmount: string | null;
  maxUsageCount: number | null;
  usedCount: number;
  expiresAt: string | null;
  isActive: boolean;
}
