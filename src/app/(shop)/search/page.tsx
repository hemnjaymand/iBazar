import type { Metadata } from "next";
import { Header } from "@/app/_components/header";
import { ProductGrid } from "@/features/shopping/components/product-grid";
import { searchProductsFulltextService } from "@/features/catalog/services/search-products-fulltext.service";

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}): Promise<Metadata> {
  const { q } = await searchParams;
  return { title: q ? `جست‌وجوی «${q}»` : "جست‌وجو" };
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const query = q?.trim() ?? "";
  const products =
    query.length > 1 ? await searchProductsFulltextService(query) : [];

  return (
    <div className="min-h-screen">
      <Header />
      <main className="mx-auto max-w-7xl px-4 py-8">
        <h1 className="text-xl font-bold mb-1">نتایج جست‌وجو</h1>
        {query && (
          <p className="text-sm text-[var(--color-muted-foreground)] mb-5">
            برای «{query}» — {products.length.toLocaleString("fa-IR")} نتیجه
            یافت شد
          </p>
        )}
        {/* اصلاح: ارسال به شکل { items: products } */}
        <ProductGrid products={{ items: products }} />
      </main>
    </div>
  );
}