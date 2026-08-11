import { BusinessError } from "@/server/errors/business-error";
import { ErrorCodes } from "@/server/errors/error-codes";
import { auth } from "./index";

export async function requireUser() {
  const session = await auth();
  if (!session?.user) {
    throw new BusinessError("لازم است وارد حساب شوید", ErrorCodes.UNAUTHORIZED);
  }
  return session.user;
}

export async function requireAdmin() {
  const user = await requireUser();
  // نکته: کد خطا این‌جا FORBIDDEN است، نه UNAUTHORIZED — چون کاربر
  // احراز هویت شده (لاگین کرده)، فقط سطح دسترسی کافی نداره. این تفاوت
  // معنایی مهمه: ۴۰۱ یعنی "شما رو نمی‌شناسم"، ۴۰۳ یعنی "می‌شناسمت ولی اجازه نداری".
  if ((user as { role?: string }).role !== "ADMIN") {
    throw new BusinessError("دسترسی غیرمجاز", ErrorCodes.FORBIDDEN);
  }
  return user;
}