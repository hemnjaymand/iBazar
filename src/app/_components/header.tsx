import Link from "next/link";
import Image from "next/image";
import {
  MapPin,
  LogIn,
  Bell,
  User,
  LogOut,
  Package,
  Settings,
} from "lucide-react";
import { AppConfig } from "@/config/app";
import { SearchBar } from "./search-bar";
import { CartBadgeLink } from "./cart-badge-link";
import { MainMenu } from "./main-menu";
import { buildCategoryTreeService } from "@/features/catalog/services/build-category-tree.service";
import { MobileNav } from "./mobile-nav";
import { auth } from "@/server/auth";
import { getLogoUrl } from "@/features/settings/services/get-store-settings.service";

// فرض بر این است که تابع دریافت سشن کاربر در سرور موجود است
// import { auth } from "@/auth"; // تابع کمکی برای گرفتن لوگو از دیتابیس

export async function Header() {
  const categories = await buildCategoryTreeService();
  const logoUrl = await getLogoUrl();
  // دریافت اطلاعات سشن کاربر در سرور (مثال برای NextAuth یا متد مشابه شما)
  // const session = await auth();// برای تست اولیه؛ این را با سشن واقعی پروژه جایگزین کنید
  const session = await auth();

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm transition-all">
      {/* ========== هدر بالایی (لوگو، سرچ، اکشن‌ها) ========== */}
      <div className="mx-auto max-w-[1920px] px-4 lg:px-6">
        <div className="flex items-center justify-between h-16 md:h-18 gap-4 md:gap-8">
          {/* راست: لوگو + سرچ‌بار */}
          <div className="flex items-center gap-5 flex-1 max-w-4xl">
            {/* لوگو */}
            <Link href="/" className="shrink-0">
              <div className="relative w-28 md:w-32 lg:w-40 h-8 md:h-10">
                <Image
                  src={logoUrl}
                  alt={AppConfig.name}

                  width={200}
                  height={150}
                  className="align-middle"
                  priority
                  unoptimized
                />
              </div>
            </Link>

            {/* نوار جستجو */}
            <div className="flex-1 hidden sm:block">
              <SearchBar />
            </div>
          </div>

          {/* چپ: اکشن‌ها (اعلان، ورود/پروفایل، سبد خرید) */}
          <div className="flex items-center gap-2 md:gap-3 shrink-0">
            {/* اعلانات */}
            <button className="hidden md:flex items-center justify-center w-10 h-10 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors">
              <Bell className="h-5 w-5" />
            </button>
            <button className="hidden md:flex items-center justify-center w-10 h-10 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors">
              <Link href="/admin/login" className="shrink-0">
                {" "}
                admin
              </Link>
            </button>
            {/* بررسی وضعیت لاگین بودن کاربر */}
            {session?.user ? (
              /* منوی کشویی کاربر (Dropdown) پس از ورود */
              <div className="relative group">
                <button
                  type="button"
                  className="flex items-center gap-2 p-1.5 md:px-3 md:py-1.5 rounded-xl border border-gray-200 hover:bg-gray-50 transition-all"
                >
                  <div className="w-8 h-8 rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)] flex items-center justify-center font-bold text-xs overflow-hidden relative">
                    {session.user.image ? (
                      <Image
                        src={session.user.image}
                        alt={session.user.name ?? "کاربر"}
                        width={32}
                        height={32}
                        style={{ width: "auto" }}
                        className="h-8 md:h-10 object-contain"
                        priority
                        unoptimized
                      />
                    ) : (
                      <User className="w-4 h-4" />
                    )}
                  </div>
                  <span className="hidden md:inline-block text-xs font-semibold text-gray-700 max-w-[100px] truncate">
                    {session.user.name || "حساب کاربری"}
                  </span>
                </button>

                {/* پنل دراپ‌داون (نمایش با هاور یا کلیک) */}
                <div className="absolute left-0 mt-2 w-56 bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl shadow-xl py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="px-4 py-2 border-b border-[var(--color-border)] mb-1">
                    <p className="text-xs text-[var(--color-muted-foreground)]">
                      خوش آمدید،
                    </p>
                    <p className="text-sm font-bold truncate text-[var(--color-foreground)]">
                      {session.user.name || "کاربر عزیز"}
                    </p>
                  </div>

                  <Link
                    href="/profile"
                    className="flex items-center gap-2.5 px-4 py-2 text-xs text-gray-700 hover:bg-[var(--color-muted)] transition-colors"
                  >
                    <Settings className="w-4 h-4 text-gray-500" />
                    <span>پروفایل کاربری</span>
                  </Link>

                  <Link
                    href="/orders"
                    className="flex items-center gap-2.5 px-4 py-2 text-xs text-gray-700 hover:bg-[var(--color-muted)] transition-colors"
                  >
                    <Package className="w-4 h-4 text-gray-500" />
                    <span>سفارش‌های من</span>
                  </Link>

                  <div className="border-t border-[var(--color-border)] my-1" />

                  {/* دکمه خروج */}
                  <form action="" method="POST">
                    <button
                      type="submit"
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>خروج از حساب</span>
                    </button>
                  </form>
                </div>
              </div>
            ) : (
              /* دکمه ورود / ثبت‌نام در صورت عدم ورود */
              <Link
                href="/login"
                className="flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 border border-gray-300 rounded-lg text-xs md:text-sm font-semibold text-gray-800 hover:bg-gray-50 transition-colors"
              >
                <LogIn className="h-4 w-4 rotate-180 text-gray-700" />
                <span>ورود | ثبت‌نام</span>
              </Link>
            )}

            {/* خط جداکننده عمودی */}
            <span className="h-6 w-[1px] bg-gray-200 mx-1 hidden sm:block" />

            {/* سبد خرید */}
            <div className="flex items-center justify-center p-1">
              <CartBadgeLink />
            </div>
          </div>
        </div>

        {/* نوار سرچ فقط مخصوص حالت موبایل */}
        <div className="pb-3 sm:hidden">
          <SearchBar />
        </div>
      </div>

      {/* ========== هدر پایینی (منوی اصلی و آدرس) ========== */}
      <div className="hidden lg:block border-t border-gray-100 text-xs xl:text-sm">
        <div className="mx-auto max-w-[1920px] px-6">
          <div className="flex items-center justify-between h-10">
            {/* راست: منوی اصلی پویا */}
            <div className="flex items-center gap-4 xl:gap-6 text-gray-600 font-medium h-full">
              <MainMenu categories={categories} />
            </div>

            {/* چپ: انتخاب شهر / آدرس */}
            <div>
              <Link
                href="/address"
                className="flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50/60 text-amber-800 text-xs font-medium hover:bg-orange-100 transition-colors"
              >
                <MapPin className="h-4 w-4 text-amber-600" />
                <span>انتخاب شهر</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
      <MobileNav categories={categories} />
    </header>
  );
}
