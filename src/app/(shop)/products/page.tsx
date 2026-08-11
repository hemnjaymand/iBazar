import type { Metadata } from "next";
import { Header } from "@/app/_components/header";
import { CategorySidebar } from "@/features/catalog/components/category-sidebar";
import { buildCategoryTreeService } from "@/features/catalog/services/build-category-tree.service";
import { searchProductsService } from "@/features/catalog/services/search-products.service";
import { ProductGrid } from "@/features/shopping/components/product-grid";
import { Pagination } from "@/shared/ui/pagination";

export const metadata: Metadata = {
  title: "همه محصولات | فروشگاه اینترنتی",
};

export default async function AllProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page } = await searchParams;
  const currentPage = page ? parseInt(page, 10) : 1;

  // ✅ سرویس دقیقاً { items, totalPages, ... } برمی‌گرداند
  const [productsResult, tree] = await Promise.all([
    searchProductsService({ page: currentPage, limit: 20, isPublished: true }),
    buildCategoryTreeService(),
  ]);

  // productsResult شامل { items, totalPages, total, currentPage, limit } است

  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      <Header />
      <main className="mx-auto max-w-7xl px-4 py-8 grid grid-cols-1 md:grid-cols-[220px_1fr] gap-8">
        <aside className="hidden md:block">
          <CategorySidebar tree={tree} activeSlug={""} />
        </aside>

        <div>
          <h1 className="text-2xl font-bold mb-6">همه محصولات</h1>

          {/* ✅ پاس دادن کل آبجکت (شامل items) */}
          <ProductGrid products={productsResult} />

          {productsResult.totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={productsResult.totalPages}
              baseUrl="/products"
            />
          )}
        </div>
      </main>
    </div>
  );
}
