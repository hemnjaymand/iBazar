import { BrandsTable } from "@/features/catalog/components/brands-table";
import { listBrandsForSelectService } from "@/features/catalog/services/list-brands.service";

export default async function AdminBrandsPage() {
  const brands = await listBrandsForSelectService();

  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      <div className="mx-auto max-w-3xl px-4 py-8">
        <h1 className="text-xl font-bold mb-6">مدیریت برندها</h1>
        <BrandsTable brands={brands} />
      </div>
    </div>
  );
}