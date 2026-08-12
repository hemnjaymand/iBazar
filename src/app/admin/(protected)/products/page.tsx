
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
  const { page } = await searchParams;

  const currentPage = page ? parseInt(page, 10) : 1;

  const { items, totalPages } =
    await listProductsForAdminService(currentPage);

  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      <div className="mx-auto max-w-6xl px-4 py-8">

        {/* عنوان صفحه */}
        <h1 className="text-right text-xl font-bold">
          مدیریت محصولات
        </h1>

        {/* دکمه افزودن محصول */}
        <div className="mt-4 flex justify-end">
          <Link href="/admin/products/new">
            <Button>
              + محصول جدید
            </Button>
          </Link>
        </div>

        {/* جدول محصولات */}
        <div className="mt-6">
          <ProductsTable products={items} />
        </div>

        {/* صفحه‌بندی */}
        <div className="mt-6">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            basePath="/admin/products"
          />
        </div>

      </div>
    </div>
  );
}

