import { listProductsForAdminService } from "@/features/catalog/services/list-products-for-admin.service";
import { ProductsTable } from "@/features/catalog/components/products-table";
import { Pagination } from "@/shared/ui/pagination";
import { toProductTableRow } from "@/features/catalog/mappers/product.mapper"; // ✅ ایمپورت درست
import type  { ProductListItemDTO } from "@/features/catalog";


export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page } = await searchParams;
  const currentPage = page ? parseInt(page, 10) : 1;

  // ۱. دریافت داده‌ها از سرویس (خروجی: { items: AdminProductListItem[], totalPages })
  const { items, totalPages } = await listProductsForAdminService(currentPage);

  // ۲. تبدیل به ProductListItemDTO[] با استفاده از as
  // چون AdminProductListItem تمام فیلدهای ProductListItemDTO را دارد
  const tableProducts = items as unknown as ProductListItemDTO[];

  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-bold">مدیریت محصولات</h1>
        </div>

        {/* ۳. پاس دادن مستقیم items به جدول */}
        <ProductsTable products={tableProducts} />

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          baseUrl="/admin/products"
        />
      </div>
    </div>
  );
}