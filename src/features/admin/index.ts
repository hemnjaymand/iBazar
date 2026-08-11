// Export all from admin feature

export * from './constants';
// features/system/index.ts
export { createNotificationService } from "./services/create-notification.service";
// Public API — فعلاً هیچ Feature دیگری از admin مصرف نمی‌کند (برخلاف
// بقیه‌ی دامنه‌ها، admin فقط مصرف‌کننده‌ست، نه مصرف‌شونده) — این فایل برای
// یکپارچگی ساختاری با ۷ دامنه‌ی دیگر نگه داشته می‌شود.
export { getDashboardSummaryService } from "./services/get-dashboard-summary.service";