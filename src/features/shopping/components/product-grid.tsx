import type  { ProductListItemDTO } from "@/features/catalog/types/product.dto";
import { ProductCard } from "./product-card";
import { PackageX } from "lucide-react"; // فرض بر استفاده از lucide-react

export function ProductGrid({ products }: { products: { items: ProductListItemDTO[] } }) {
  const items = products?.items || [];
console.log("PAGE PRODUCTS", products);
console.log(
 "GRID PRODUCTS:",
 products.items.map(p=>({
   name:p.name,
   image:p.imageUrl,
   variant:p.defaultVariant?.imageUrl
 }))
);
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4 border border-dashed border-[var(--color-border)] rounded-2xl bg-[var(--color-card)]/50">
        <PackageX className="w-16 h-16 text-[var(--color-muted-foreground)] mb-4 opacity-50" />
        <h3 className="text-lg font-bold text-[var(--color-foreground)] mb-2">محصولی یافت نشد</h3>
        <p className="text-sm text-[var(--color-muted-foreground)] text-center max-w-md">
          در حال حاضر محصولی در این دسته‌بندی برای نمایش وجود ندارد. لطفاً بعداً سر بزنید.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-5">
      {items.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}