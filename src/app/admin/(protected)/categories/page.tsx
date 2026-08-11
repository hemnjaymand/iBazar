import { buildCategoryTreeService } from "@/features/catalog/services/build-category-tree.service";
import { CategoryManagementTree } from "@/features/catalog/components/category-management-tree";

export default async function AdminCategoriesPage() {
  const tree = await buildCategoryTreeService();

  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      <div className="mx-auto max-w-2xl px-4 py-8">
        <h1 className="text-xl font-bold mb-6">مدیریت دسته‌بندی‌ها</h1>
        <CategoryManagementTree tree={tree} />
      </div>
    </div>
  );
}