import type { Metadata } from 'next';
import { Suspense } from 'react';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { Header } from '@/app/_components/header';
import { HeroSlider } from '@/features/content/components/hero-slider';
import { CategoryShowcase } from '@/features/catalog/components/category-showcase';
import { searchProductsService } from '@/features/catalog/services/search-products.service';
import { getCategoriesForHomeService } from '@/features/catalog/services/get-categories-for-home.service';
import { getDiscountedProductsService } from '@/features/catalog/services/get-discounted-products.service';
import { IncredibleOffersSlider } from './_components/incredible-offers-slider';
import { ProductGrid } from '@/features/shopping/components/product-grid';
import { BestSellersGrid } from './_components/best-sellers-grid';
import { Footer } from './_components/footer';

export const metadata: Metadata = {
  title: 'فروشگاه اینترنتی | خرید آنلاین',
  description:
    'خرید آنلاین از بهترین برندهای روز ایران و جهان با ضمانت اصالت کالا و بهترین قیمت',
};

export default async function HomePage() {
  const [productsResult, categories, discountedProducts] = await Promise.all([
    searchProductsService({ page: 1 }),
    getCategoriesForHomeService(),
    getDiscountedProductsService(10),
  ]);

  return (
    <div className="min-h-screen bg-[var(--color-background)] pb-16">
      <Header />

      <main className="mx-auto max-w-7xl px-4 space-y-8 md:space-y-10 ">
        {/* ۱. سکشن اسلایدر اصلی */}
        <section>
          <Suspense
            fallback={
              <div className="w-full h-48 sm:h-72 md:h-[400px] bg-[var(--color-muted)] animate-pulse rounded-[var(--radius)]" />
            }
          >
            <HeroSlider />
          </Suspense>
        </section>

        {/* ۲. سکشن خرید بر اساس دسته‌بندی */}
        {categories.length > 0 && (
          <section className="rounded-[var(--radius)] p-4 md:p-6 ">
            <div className="flex items-center justify-between mb-5"></div>
            <CategoryShowcase categories={categories} />
          </section>
        )}

        {/* ۳. سکشن پیشنهاد شگفت‌انگیز */}
        {discountedProducts.length > 0 && (
          <section>
            <IncredibleOffersSlider
              title="شگفت‌انگیز"
              products={discountedProducts}
              href="/search"
            />
          </section>
        )}

        {/* ۴. سکشن محصولات منتخب */}
        <section className="bg-[var(--color-card)] rounded-[var(--radius)] p-4 md:p-6 border border-[var(--color-border)]">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-6 bg-[var(--color-primary)] rounded-full" />
              <h2 className="text-lg md:text-xl font-bold">محصولات منتخب</h2>
            </div>
            <Link
              href="/search"
              className="flex items-center gap-1 text-xs md:text-sm font-semibold text-[var(--color-primary)] hover:underline"
            >
              <span>مشاهده همه</span>
              <ChevronLeft className="w-4 h-4" />
            </Link>
          </div>
          <ProductGrid products={productsResult} />
        </section>

        {/* ۵. سکشن پرفروش‌ها */}
        <section>
          <BestSellersGrid products={productsResult.items.slice(0, 9)} />
        </section>
        <section>
          <Footer />
        </section>
      </main>
    </div>
  );
}
