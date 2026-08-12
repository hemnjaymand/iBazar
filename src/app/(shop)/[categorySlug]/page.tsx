import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Header } from "@/app/_components/header";
import { categoryRepository } from "@/features/catalog/repositories/category.repository";
import { searchProductsService } from "@/features/catalog/services/search-products.service";
import { ProductGrid } from "@/features/shopping/components/product-grid";
import { Pagination } from "@/shared/ui/pagination";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ categorySlug: string }>;
}): Promise<Metadata> {
  const { categorySlug } = await params;
  const decodedSlug = decodeURIComponent(categorySlug);
  const category = await categoryRepository.findBySlug(decodedSlug);
  
  if (!category) return {};
  return { title: `${category.name} | فروشگاه اینترنتی` };
}

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ categorySlug: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const { categorySlug } = await params;
  const { page } = await searchParams;
  const currentPage = page ? parseInt(page, 10) : 1;

  const decodedSlug = decodeURIComponent(categorySlug);
  const category = await categoryRepository.findBySlug(decodedSlug);
  
  if (!category) notFound();

  // دریافت محصولات بدون نیاز به پردازش درخت دسته‌بندی سایدبار
  const productsResult = await searchProductsService({
    categoryId: category.id,
    page: currentPage,
    limit: 20,
    isPublished: true,
  });

  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      <Header />
      
      {/* ساختار تمام‌عرض و مرتب بدون سایدبار */}
      <main className="mx-auto max-w-7xl px-4 py-8 flex flex-col gap-6">
        {/* هدر دسته‌بندی */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[var(--color-border)] gap-2">
          <h1 className="text-2xl sm:text-3xl font-black text-[var(--color-foreground)]">
            {category.name}
          </h1>
          <span className="text-sm font-medium text-[var(--color-muted-foreground)] bg-[var(--color-muted)] px-3.5 py-1.5 rounded-full w-fit">
            {productsResult.total.toLocaleString("fa-IR")} کالا
          </span>
        </div>

        {/* گرید محصولات */}
        <ProductGrid products={productsResult} />

        {/* صفحه‌بندی */}
        {productsResult.totalPages > 1 && (
          <div className="mt-8 flex justify-center">
            <Pagination
              currentPage={currentPage}
              totalPages={productsResult.totalPages}
              baseUrl={`/category/${categorySlug}`}
            />
          </div>
        )}
      </main>
    </div>
  );
}















// export async function generateMetadata({
//   params,
// }: {
//   params: Promise<{ categorySlug: string }>;
// }): Promise<Metadata> {
//   const { categorySlug } = await params;
//   const decodedSlug = decodeURIComponent(categorySlug);
//   const category = await categoryRepository.findBySlug(decodedSlug);
  
//   if (!category) return {};
//   return { 
//     title: `${category.name} | فروشگاه اینترنتی`,
//     description: `خرید جدیدترین محصولات دسته ${category.name}`,
//   };
// }

// export default async function CategoryPage({
//   params,
//   searchParams,
// }: {
//   params: Promise<{ categorySlug: string }>;
//   searchParams: Promise<{ page?: string }>;
// }) {
//   const { categorySlug } = await params;
//   const { page } = await searchParams;
//   const currentPage = page ? parseInt(page, 10) : 1;

//   const decodedSlug = decodeURIComponent(categorySlug);
//   const category = await categoryRepository.findBySlug(decodedSlug);
  
//   if (!category) notFound();

//   // دریافت محصولات دسته‌بندی فعلی
//   const productsResult = await searchProductsService({
//     categoryId: category.id,
//     page: currentPage,
//     limit: 20,
//     isPublished: true,
//   });

//   // فرض: در صورتی که findBySlug شامل جلب children باشد
//   const hasChildren = category.children && category.children.length > 0;

//   return (
//     <div className="min-h-screen bg-[var(--color-background)]">
//       <Header />
      
//       <main className="mx-auto max-w-7xl px-4 py-8 flex flex-col gap-6">
//         {/* هدر دسته‌بندی */}
//         <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[var(--color-border)] gap-2">
//           <h1 className="text-2xl sm:text-3xl font-black text-[var(--color-foreground)]">
//             {category.name}
//           </h1>
//           <span className="text-sm font-medium text-[var(--color-muted-foreground)] bg-[var(--color-muted)] px-3.5 py-1.5 rounded-full w-fit">
//             {productsResult.total.toLocaleString("fa-IR")} کالا
//           </span>
//         </div>

//         {/* نمایش زیردسته‌ها در صورت وجود */}
//         {hasChildren && (
//           <div className="rounded-xl bg-[var(--color-card)] p-4 border border-[var(--color-border)]">
//             <h2 className="text-xs font-bold text-[var(--color-muted-foreground)] mb-2">
//               زیردسته‌های {category.name}
//             </h2>
//             <CategoryShowcase categories={category.children} />
//           </div>
//         )}

//         {/* گرید محصولات */}
//         <ProductGrid products={productsResult} />

//         {/* صفحه‌بندی */}
//         {productsResult.totalPages > 1 && (
//           <div className="mt-8 flex justify-center">
//             <Pagination
//               currentPage={currentPage}
//               totalPages={productsResult.totalPages}
//               baseUrl={`/category/${categorySlug}`}
//             />
//           </div>
//         )}
//       </main>
//     </div>
//   );
// }
// توصیه مکمل: در فایل category.repository.ts خود، تابع findBySlug را درون React.cache() بپیچید تا کوئری متاداده و بدنه صفحه یکی شوند:

// TypeScript
// import { cache } from 'react';

// export const categoryRepository = {
//   findBySlug: cache(async (slug: string) => {
//     return await prisma.category.findUnique({
//       where: { slug },
//       include: { children: true } // جهت دریافت زیردسته‌ها
//     });
//   }),
// };