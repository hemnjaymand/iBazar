import { listUsersForAdminService } from "@/features/identity/services/list-users-for-admin.service";
import { UsersTable } from "@/features/identity/components/users-table";
import { Pagination } from "@/shared/ui/pagination";

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page } = await searchParams;
  
  // تبدیل و validation ایمن برای مقدار صفحه
const parsedPage = parseInt(page || "1", 10);
  const currentPage = isNaN(parsedPage) || parsedPage < 1 ? 1 : parsedPage;

 const { items, totalPages } = await listUsersForAdminService(currentPage as 1);

  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      <div className="mx-auto max-w-5xl px-4 py-8">
        <h1 className="text-xl font-bold mb-6">مدیریت کاربران</h1>
        <UsersTable users={items} />
        <Pagination currentPage={currentPage} totalPages={totalPages} basePath="/admin/users" />
      </div>
    </div>
  );
}