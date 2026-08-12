import Image from 'next/image';
import Link from 'next/link';
import { Bell, LogIn, MapPin } from 'lucide-react';

import { AppConfig } from '@/config/app';
import { auth } from '@/server/auth';

import { buildCategoryTreeService } from '@/features/catalog/services/build-category-tree.service';
import { getLogoUrl } from '@/features/settings/services/get-store-settings.service';

import { CartBadgeLink } from './cart-badge-link';
import { MainMenu } from './main-menu';
import { MobileNav } from './mobile-nav';
import { SearchBar } from './search-bar';
import { UserMenu } from './user-menu';

export async function Header() {
  const [categories, logoUrl, session] = await Promise.all([
    buildCategoryTreeService(),
    getLogoUrl(),
    auth(),
  ]);

  const user = session?.user;

  return (
    <header className="sticky top-0 z-50 border-b border-gray-100 bg-white shadow-sm">
      {/* ==================== TOP HEADER ==================== */}
      <div className="mx-auto max-w-[1920px] px-4 lg:px-6">
        <div className="flex h-16 items-center justify-between gap-4 md:h-[72px] md:gap-8">
          {/* Logo + Desktop Search */}
          <div className="flex min-w-0 flex-1 items-center gap-5 md:max-w-4xl">
            <Link href="/" aria-label={AppConfig.name} className="shrink-0">
              <div className="relative h-8 w-28 md:h-10 md:w-32 lg:w-40">
                <Image
                  src={logoUrl}
                  alt="لوگوی فروشگاه"
                  width={120}
                  height={40}
                  style={{ height: 'auto' }} 
                  className="object-contain"
                />
              </div>
            </Link>

            {/* Desktop Search */}
            <div className="hidden min-w-0 flex-1 sm:block">
              <SearchBar />
            </div>
          </div>

          {/* Header Actions */}
          <div className="flex shrink-0 items-center gap-2 md:gap-3">
            {/* Notifications */}
            <button
              type="button"
              aria-label="اعلان‌ها"
              className="
                hidden h-10 w-10
                items-center justify-center
                rounded-lg
                text-gray-600
                transition-colors
                hover:bg-gray-50
                focus:outline-none
                focus-visible:ring-2
                focus-visible:ring-[var(--color-primary)]
                focus-visible:ring-offset-2
                md:flex
              "
            >
              <Bell className="h-5 w-5" />
            </button>

            {/* User Authentication */}
            {user ? (
              <UserMenu name={user.name} image={user.image} role={user.role} />
            ) : (
              <Link
                href="/login"
                className="
                  flex items-center gap-2
                  rounded-lg
                  border border-gray-300
                  px-3 py-1.5
                  text-xs font-semibold
                  text-gray-800
                  transition-colors
                  hover:bg-gray-50
                  focus:outline-none
                  focus-visible:ring-2
                  focus-visible:ring-[var(--color-primary)]
                  focus-visible:ring-offset-2
                  md:px-4 md:py-2 md:text-sm
                "
              >
                <LogIn className="h-4 w-4 rotate-180 text-gray-700" />
                <span>ورود | ثبت‌نام</span>
              </Link>
            )}

            {/* Divider */}
            <span className="mx-1 hidden h-6 w-px bg-gray-200 sm:block" />

            {/* Cart */}
            <div className="flex items-center justify-center p-1">
              <CartBadgeLink />
            </div>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="pb-3 sm:hidden">
          <SearchBar />
        </div>
      </div>

      {/* ==================== DESKTOP NAVIGATION ==================== */}
      <div className="hidden border-t border-gray-100 lg:block">
        <div className="mx-auto max-w-[1920px] px-6">
          <div className="flex h-10 items-center justify-between text-xs xl:text-sm">
            {/* Main Menu */}
            <nav
              aria-label="منوی اصلی"
              className="
                flex h-full
                items-center
                gap-4
                font-medium
                text-gray-600
                xl:gap-6
              "
            >
              <MainMenu categories={categories} />
            </nav>

            {/* Location */}
            <Link
              href="/address"
              className="
                flex items-center gap-2
                rounded-full
                bg-orange-50/60
                px-3 py-1
                text-xs font-medium
                text-amber-800
                transition-colors
                hover:bg-orange-100
                focus:outline-none
                focus-visible:ring-2
                focus-visible:ring-amber-500
              "
            >
              <MapPin className="h-4 w-4 text-amber-600" />
              <span>انتخاب شهر</span>
            </Link>
          </div>
        </div>
      </div>

      {/* ==================== MOBILE NAVIGATION ==================== */}
      <MobileNav categories={categories} />
    </header>
  );
}
