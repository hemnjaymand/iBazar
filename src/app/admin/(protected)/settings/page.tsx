// import dynamic from "next/dynamic";
import { requireAdmin } from "@/server/auth/guards";
import { appSettingRepository } from "@/features/admin/repositories/app-setting.repository";
import { SettingsForm } from "@/features/admin/components/settings-form";

export default async function AdminSettingsPage() {
  // ۱. بررسی دسترسی ادمین
  await requireAdmin();

  // ۲. دریافت تنظیمات از دیتابیس به شکل دیکشنری
  const settings = await appSettingRepository.findAll();
  const settingsRecord = settings.reduce<Record<string, string>>(
    (acc, setting) => {
      acc[setting.key] = setting.value;
      return acc;
    },
    {},
  );

  // ۳. ایجاد ساختار دقیق و امن مورد نیاز فرم (جلوگیری از undefined)
  const initialValues = {
    siteName: settingsRecord.siteName || "",
    supportEmail: settingsRecord.supportEmail || "",
  };

  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      <div className="mx-auto max-w-3xl px-4 py-8">
        <h1 className="text-xl font-bold mb-6">تنظیمات فروشگاه</h1>
        <div className="rounded-[var(--radius)] border border-[var(--color-border)] bg-[var(--color-card)] p-6">
          <SettingsForm initialValues={initialValues} />
        </div>
      </div>
    </div>
  );
}