import { AttributesTable } from "@/features/catalog/components/attributes-table";
import { listAttributesService } from "@/features/catalog/services/list-attributes.service";

export default async function AdminAttributesPage() {
  const attributes = await listAttributesService();

  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      <div className="mx-auto max-w-3xl px-4 py-8">
        <h1 className="text-xl font-bold mb-6">مدیریت ویژگی‌ها (رنگ، سایز و ...)</h1>
        <AttributesTable attributes={attributes} />
      </div>
    </div>
  );
}