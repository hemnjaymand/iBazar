import { requireAdmin } from "@/server/auth/guards";
import { PageEditorForm } from "@/features/content/components/page-editor-form";

export default async function NewPagePage() {
  await requireAdmin();
  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      <div className="mx-auto max-w-3xl px-4 py-8">
        <h1 className="text-xl font-bold mb-6">صفحه جدید</h1>
        <PageEditorForm />
      </div>
    </div>
  );
}
