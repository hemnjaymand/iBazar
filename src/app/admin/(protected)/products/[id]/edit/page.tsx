import { notFound } from "next/navigation";

import { getProductForEditService } from "@/features/catalog/services/get-product-for-edit.service";
import { categoryRepository } from "@/features/catalog/repositories/category.repository";
import { brandRepository } from "@/features/catalog/repositories/brand.repository";
import { ProductEditForm } from "@/features/catalog/components/ProductEditForm";


interface ProductEditPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ProductEditPage({
  params,
}: ProductEditPageProps) {
  const { id } = await params;

  const [product, categories, brands] = await Promise.all([
    getProductForEditService(id),
    categoryRepository.findAll(),
    brandRepository.findAll(),
  ]);

  if (!product) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">
          ویرایش محصول
        </h1>

        <p className="mt-1 text-sm text-[var(--color-muted-foreground)]">
          اطلاعات محصول، قیمت، موجودی و وضعیت انتشار را مدیریت کنید.
        </p>
      </div>

      <ProductEditForm
        product={product}
        categories={categories}
        brands={brands}
      />
    </div>
  );
}