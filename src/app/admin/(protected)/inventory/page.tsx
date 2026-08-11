import { requireAdmin } from "@/server/auth/guards";
import { inventoryRepository } from "@/features/inventory/repositories/inventory.repository";
// import { toInventoryRowDTO } from "@/features/inventory/mappers/inventory.mapper";
import { InventoryTable } from "@/features/inventory/components/inventory-table";
import { toInventoryRowDTO } from "@/features/inventory/mappers/inventory.mapper";
// import { toInventoryRowDTO } from "@/features/inventory/lib/inventory.mapper";

export default async function AdminInventoryPage() {
  await requireAdmin();
  const variants = await inventoryRepository.findAllWithStock();
  const rows = variants.map(toInventoryRowDTO);

  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <h1 className="text-xl font-bold mb-6">مدیریت موجودی</h1>
        <InventoryTable rows={rows} />
      </div>
    </div>
  );
}
