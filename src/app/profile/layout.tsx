import { Header } from "@/app/_components/header";
import { ProfileSidebar } from "@/features/identity/components/profile-sidebar";
import { requireUser } from "@/server/auth/guards";

export default async function ProfileLayout({ children }: { children: React.ReactNode }) {
  await requireUser();

  return (
    <div className="min-h-screen">
      <Header />
      <main className="mx-auto max-w-5xl px-4 py-8 grid md:grid-cols-[220px_1fr] gap-8">
        <ProfileSidebar />
        <div>{children}</div>
      </main>
    </div>
  );
}