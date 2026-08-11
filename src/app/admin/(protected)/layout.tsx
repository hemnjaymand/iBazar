import { redirect } from "next/navigation";
import { auth } from "@/server/auth";
import { AdminSidebar } from "@/features/admin/components/admin-sidebar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  console.log("SESSION:",session);
  if (!session?.user) {
    redirect("/admin/login");
  }

  if ((session.user as { role?: string }).role !== "ADMIN") {
    redirect("/");
  }

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />

      <main className="flex-1">{children}</main>
    </div>
  );
}
