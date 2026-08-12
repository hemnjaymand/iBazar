
import type { ActivityItemDTO } from "../types/activity-item.dto";
import {
  Activity,
  AlertTriangle,
  CalendarCheck,
  Clock,
  UserPlus,
} from "lucide-react";

const ACTIVITY_CONFIG = {
  APPOINTMENT_CREATED: {
    icon: CalendarCheck,
    color: "text-blue-600 dark:text-blue-400",
    bg: "bg-blue-50 dark:bg-blue-900/30",
  },

  APPOINTMENT_CONFIRMED: {
    icon: CalendarCheck,
    color: "text-emerald-600 dark:text-emerald-400",
    bg: "bg-emerald-50 dark:bg-emerald-900/30",
  },

  APPOINTMENT_CANCELLED: {
    icon: AlertTriangle,
    color: "text-red-600 dark:text-red-400",
    bg: "bg-red-50 dark:bg-red-900/30",
  },

  USER_REGISTERED: {
    icon: UserPlus,
    color: "text-violet-600 dark:text-violet-400",
    bg: "bg-violet-50 dark:bg-violet-900/30",
  },
} as const;

const DEFAULT_ACTIVITY_CONFIG = {
  icon: Activity,
  color: "text-slate-600 dark:text-slate-400",
  bg: "bg-slate-100 dark:bg-slate-800/50",
};

function formatActivityDate(timestamp: string | Date) {
  return new Date(timestamp).toLocaleDateString("fa-IR", {
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function ActivityFeed({
  items,
}: {
  items: ActivityItemDTO[];
}) {
  if (items.length === 0) {
    return (
      <div
        className="
          flex
          min-h-[220px]
          flex-col
          items-center
          justify-center
          rounded-xl
          border
          border-dashed
          border-[var(--color-border)]
          bg-[var(--color-muted)]/20
          px-6
          text-center
        "
      >
        <div
          className="
            mb-3
            flex
            h-12
            w-12
            items-center
            justify-center
            rounded-full
            bg-[var(--color-muted)]
            text-[var(--color-muted-foreground)]
          "
        >
          <Clock className="h-5 w-5" />
        </div>

        <p className="text-sm font-semibold text-[var(--color-foreground)]">
          فعالیتی برای نمایش وجود ندارد
        </p>

        <p className="mt-1 text-xs text-[var(--color-muted-foreground)]">
          فعالیت‌های اخیر سیستم در این قسمت نمایش داده می‌شوند.
        </p>
      </div>
    );
  }

  return (
    <div className="relative">
      {items.map((item, index) => {
        const config =
          ACTIVITY_CONFIG[
            item.type as keyof typeof ACTIVITY_CONFIG
          ] ?? DEFAULT_ACTIVITY_CONFIG;

        const Icon = config.icon;
        const isLast = index === items.length - 1;

        return (
          <div
            key={item.id}
            className="group relative flex gap-4"
          >
            {/* Timeline */}
            {!isLast && (
              <div
                className="
                  absolute
                  right-5
                  top-10
                  bottom-0
                  w-px
                  bg-[var(--color-border)]
                  transition-colors
                  duration-200
                  group-hover:bg-[var(--color-primary)]/30
                "
                aria-hidden="true"
              />
            )}

            {/* Activity icon */}
            <div
              className={`
                relative
                z-10
                flex
                h-10
                w-10
                shrink-0
                items-center
                justify-center
                rounded-full
                ring-4
                ring-[var(--color-card)]
                ${config.bg}
                ${config.color}
              `}
            >
              <Icon
                className="h-[18px] w-[18px]"
                strokeWidth={2.25}
              />
            </div>

            {/* Content */}
            <div
              className={`
                min-w-0
                flex-1
                pb-7
                pt-1
                ${isLast ? "pb-1" : ""}
              `}
            >
              <div
                className="
                  rounded-xl
                  px-3
                  py-2
                  transition-colors
                  duration-200
                  group-hover:bg-[var(--color-muted)]/40
                "
              >
                <p
                  className="
                    text-sm
                    font-medium
                    leading-6
                    text-[var(--color-foreground)]
                  "
                >
                  {item.message}
                </p>

                <div
                  className="
                    mt-1.5
                    flex
                    items-center
                    gap-1.5
                    text-xs
                    text-[var(--color-muted-foreground)]
                  "
                >
                  <Clock
                    className="h-3.5 w-3.5 opacity-70"
                    aria-hidden="true"
                  />

                  <time
                    className="num"
                    dateTime={new Date(item.timestamp).toISOString()}
                  >
                    {formatActivityDate(item.timestamp)}
                  </time>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}