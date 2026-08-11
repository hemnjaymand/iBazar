import Link from "next/link";
import { listProductsForAdminService } from "@/features/catalog/services/list-products-for-admin.service";
import { ProductsTable } from "@/features/catalog/components/products-table";
import { Pagination } from "@/shared/ui/pagination";
import { Button } from "@/shared/ui/button";

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  // ۱. دریافت پارامتر صفحه از URL
  const { page } = await searchParams;
  const currentPage = page ? parseInt(page, 10) : 1;

  // ۲. دریافت داده‌ها از سرویس (حاوی items و totalPages)
  const { items, totalPages } = await listProductsForAdminService(currentPage);

  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      <div className="mx-auto max-w-6xl px-4 py-8">
        {/* هدر + دکمه افزودن محصول */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-bold">مدیریت محصولات</h1>
          <Link href="/admin/products/new">
            <Button>+ محصول جدید</Button>
          </Link>
        </div>

        {/* جدول محصولات (داده‌های تبدیل‌شده به ProductTableRow) */}
        <ProductsTable products={items} />

        {/* صفحه‌بندی */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          basePath="/admin/products"
        />
      </div>
    </div>
  );
}