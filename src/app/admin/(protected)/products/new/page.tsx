import { requireAdmin } from "@/server/auth/guards";
import { ProductForm } from "@/features/catalog/components/product-form";
import { categoryRepository } from "@/features/catalog/repositories/category.repository";
import { brandRepository } from "@/features/catalog/repositories/brand.repository";
import { listBrandsForSelectService } from "@/features/catalog/services/list-brands.service";

export default async function NewProductPage() {
  await requireAdmin();

  const [categories, brands] = await Promise.all([
    categoryRepository.findAll(),
    listBrandsForSelectService(),
    brandRepository.findAll(),
  ]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
      <h1 className="text-2xl font-bold mb-6 text-[var(--color-foreground)] tracking-tight">
        محصول جدید
      </h1>
      <div className="bg-[var(--color-card)] rounded-2xl border border-[var(--color-border)] p-4 sm:p-6 shadow-sm">
        <ProductForm categories={categories} brands={brands} />
      </div>
    </div>
  );
}
