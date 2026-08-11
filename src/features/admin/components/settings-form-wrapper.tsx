"use client";

import dynamic from "next/dynamic";

// ✅ بارگذاری داینامیک با ssr: false در یک Client Component
const SettingsForm = dynamic(
  () => import("./settings-form").then((mod) => mod.SettingsForm),
  {
    ssr: false,
    loading: () => (
      <div className="text-center py-8 text-muted-foreground">
        در حال بارگذاری تنظیمات...
      </div>
    ),
  },
);

interface SettingsFormWrapperProps {
  initialValues: { siteName: string; supportEmail: string };
}

export function SettingsFormWrapper({
  initialValues,
}: SettingsFormWrapperProps) {
  return <SettingsForm initialValues={initialValues} />;
}
