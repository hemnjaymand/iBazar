
import { redirect } from "next/navigation";

import { auth } from "@/server/auth";
import { AdminSidebar } from "@/features/admin/components/admin-sidebar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/admin/login");
  }

  if ((session.user as { role?: string }).role !== "ADMIN") {
    redirect("/");
  }

  return (
    <div className="min-h-screen bg-[var(--color-background)] ">
      <AdminSidebar />

      <main className="min-h-screen lg:mr-64">
        {children}
      </main>
    </div>
  );
}

