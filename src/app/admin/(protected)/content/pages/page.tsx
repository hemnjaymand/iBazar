import { requireAdmin } from "@/server/auth/guards";
import { pageRepository } from "@/features/content/repositories/page.repository";
import { toPageDTO } from "@/features/content/mappers/page.mapper";
import { PagesAdminList } from "@/features/content/components/pages-admin-list";

export default async function AdminPagesListPage() {
  await requireAdmin();
  const pages = await pageRepository.findAll();

  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      <div className="mx-auto max-w-2xl px-4 py-8">
        <h1 className="text-xl font-bold mb-6">مدیریت صفحات ثابت</h1>
        <PagesAdminList pages={pages.map(toPageDTO)} />
      </div>
    </div>
  );
}
