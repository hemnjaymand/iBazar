import { listBannersService } from "@/features/catalog/services/list-banners.service";
import { BannersList } from "@/features/content/components/banners-admin-list";

export default async function AdminBannersPage() {
  const banners = await listBannersService();

  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      <div className="mx-auto max-w-2xl px-4 py-8">
        <h1 className="text-xl font-bold mb-6">مدیریت بنرها</h1>
        <BannersList banners={banners} />
      </div>
    </div>
  );
}
