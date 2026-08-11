import type { ActivityItemDTO } from "../types/activity-item.dto";
// پیشنهاد می‌کنم از lucide-react استفاده کنید که استاندارد داشبوردهای مدرن است
import { ShoppingCart, UserPlus, AlertTriangle, Clock } from "lucide-react";

// یک دیکشنری برای تنظیمات ظاهری هر نوع فعالیت
const ACTIVITY_CONFIG = {
  ORDER_PLACED: {
    icon: ShoppingCart,
    color: "text-blue-600 dark:text-blue-400",
    bg: "bg-blue-100 dark:bg-blue-900/30",
  },
  USER_REGISTERED: {
    icon: UserPlus,
    color: "text-green-600 dark:text-green-400",
    bg: "bg-green-100 dark:bg-green-900/30",
  },
  LOW_STOCK: {
    icon: AlertTriangle,
    color: "text-amber-600 dark:text-amber-400",
    bg: "bg-amber-100 dark:bg-amber-900/30",
  },
};

export function ActivityFeed({ items }: { items: ActivityItemDTO[] }) {
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-[var(--color-muted-foreground)]">
        <Clock className="w-8 h-8 mb-3 opacity-20" />
        <p className="text-sm font-medium">فعالیتی برای نمایش وجود ندارد</p>
      </div>
    );
  }

  return (
    <div className="pl-2">
      {items.map((item, index) => {
        const Config = ACTIVITY_CONFIG[item.type];
        const Icon = Config.icon;
        const isLast = index === items.length - 1;

        return (
          <div key={item.id} className="relative flex gap-4 group">
            {/* خط عمودی تایم‌لاین (برای همه آیتم‌ها جز آخری نمایش داده می‌شود) */}
            {!isLast && (
              <div className="absolute top-10 right-5 bottom-[-16px] w-[2px] bg-[var(--color-border)] group-hover:bg-[var(--color-primary)]/50 transition-colors duration-300" />
            )}

            {/* بخش آیکون دایره‌ای */}
            <div
              className={`relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full ring-4 ring-[var(--color-card)] ${Config.bg} ${Config.color}`}
            >
              <Icon size={18} strokeWidth={2.5} />
            </div>

            {/* بخش متن و تاریخ */}
            <div className="flex-1 pb-8 pt-2">
              <p className="text-sm font-semibold text-[var(--color-foreground)]">
                {item.message}
              </p>
              <p className="flex items-center gap-1.5 text-xs text-[var(--color-muted-foreground)] num mt-1.5">
                <Clock size={12} className="opacity-70" />
                {new Date(item.timestamp).toLocaleDateString("fa-IR", {
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}