import { z } from "zod";

// عمداً فقط "name" قابل ویرایش است — تغییر ایمیل معمولاً نیاز به یک
// فرآیند تأیید جدا (ارسال لینک تأیید به ایمیل جدید) داره که خارج از
// اسکوپ همین فاز است؛ بازکردنش بدون تأیید یک ریسک امنیتی/UX می‌سازه.
export const updateProfileSchema = z.object({
  name: z.string().min(2, "نام باید حداقل ۲ کاراکتر باشد").max(100),
});
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;