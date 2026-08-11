import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * چرا این تابع لازمه؟
 * وقتی یک کامپوننت (مثلاً Button) از قبل چند کلاس Tailwind داره،
 * و شما هم موقع استفاده یک className اضافه می‌دید، این دو باید با هم
 * ترکیب بشن. اگه فقط رشته‌ها رو کنار هم بچسبونیم، گاهی دو کلاس
 * متناقض (مثلاً هم p-4 هم p-8) با هم تداخل پیدا می‌کنن.
 *
 * clsx(...)        → چند رشته/شرط رو به یک رشته‌ی کلاس تبدیل می‌کنه
 * twMerge(...)     → تداخل کلاس‌های Tailwind رو حل می‌کنه (آخری برنده می‌شه)
 *
 * مثال استفاده:
 *   cn("p-4 text-red-500", isActive && "text-blue-500")
 *   → اگه isActive=true باشه: "p-4 text-blue-500" (text-red-500 حذف می‌شه)
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
