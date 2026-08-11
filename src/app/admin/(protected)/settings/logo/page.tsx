import { LogoUploader } from "@/app/_components/logo-uploader";
import { getAppSettingsService } from "@/features/admin/services/get-app-settings.service";

export default async function LogoPage() {
  const settings = await getAppSettingsService();
  const currentLogo = settings.logo_url || null;

  return (
    <div className="max-w-2xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">مدیریت لوگو</h1>
      <p className="text-sm text-muted-foreground mb-6">
        لوگوی فروشگاه را آپلود کنید. فرمت‌های مجاز: PNG, JPG, SVG (حداکثر ۲
        مگابایت).
      </p>

      <div className="bg-card border rounded-xl p-6">
        <LogoUploader currentLogo={currentLogo} />
      </div>
    </div>
  );
}
