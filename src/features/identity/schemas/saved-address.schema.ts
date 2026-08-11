import { z } from "zod";

export const savedAddressSchema = z.object({
  label: z.string().min(1).max(50),
  fullName: z.string().min(2).max(100),
  phone: z.string().min(8).max(20),
  addressLine: z.string().min(5).max(300),
  city: z.string().min(2).max(100),
  postalCode: z.string().min(3).max(20),
  // ✨ اصلاح شد: استفاده از boolean خالص به همراه مقدار پیش‌فرض
  isDefault: z.boolean().default(false),
});

export type SavedAddressInput = z.infer<typeof savedAddressSchema>;
