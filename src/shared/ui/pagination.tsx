import { cn } from "@/shared/utils/cn"; // یا مسیر صحیح utils پروژه شما
import Link from "next/link";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  baseUrl?: string;
  basePath?: string; // ✅ پشتیبانی از basePath جهت هماهنگی با پروژه‌های Next.js
  className?: string;
}

export function Pagination({
  currentPage,
  totalPages,
  baseUrl,
  basePath,
  className,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  // ✅ تعیین مسیر نهایی از baseUrl یا basePath
  const path = baseUrl ?? basePath ?? "";

  const maxVisible = 5;
  let visiblePages: (string | number)[] = Array.from(
    { length: totalPages },
    (_, i) => i + 1,
  );

  if (totalPages > maxVisible) {
    const leftSibling = Math.max(1, currentPage - 2);
    const rightSibling = Math.min(totalPages, currentPage + 2);
    const showLeftEllipsis = leftSibling > 2;
    const showRightEllipsis = rightSibling < totalPages - 1;

    const range: (string | number)[] = [];

    if (showLeftEllipsis) {
      range.push(1, "...");
    } else {
      for (let i = 1; i < leftSibling; i++) range.push(i);
    }
    for (let i = leftSibling; i <= rightSibling; i++) range.push(i);
    if (showRightEllipsis) {
      range.push("...", totalPages);
    } else {
      for (let i = rightSibling + 1; i <= totalPages; i++) range.push(i);
    }

    visiblePages = range;
  }

  const buildUrl = (page: number) => {
    const url = new URL(path, "http://dummy");
    if (page === 1) {
      url.search = "";
    } else {
      url.searchParams.set("page", String(page));
    }
    return url.pathname + url.search;
  };

  return (
    <nav
      className={cn("flex justify-center items-center gap-1 mt-6", className)}
      aria-label="صفحه‌بندی"
    >
      {/* دکمه قبلی */}
      <Link
        href={currentPage > 1 ? buildUrl(currentPage - 1) : "#"}
        aria-disabled={currentPage <= 1}
        className={cn(
          "px-3 py-2 rounded-md border border-gray-300 text-sm transition",
          currentPage <= 1
            ? "opacity-50 pointer-events-none"
            : "hover:bg-gray-100",
        )}
      >
        قبلی
      </Link>

      {/* شماره صفحات */}
      {visiblePages.map((page, index) =>
        typeof page === "string" ? (
          <span
            key={`ellipsis-${index}`}
            className="px-3 py-2 text-sm text-gray-500"
          >
            …
          </span>
        ) : (
          <Link
            key={page}
            href={buildUrl(page)}
            className={cn(
              "px-3 py-2 rounded-md border border-gray-300 text-sm transition",
              page === currentPage
                ? "bg-blue-600 text-white border-blue-600"
                : "hover:bg-gray-100",
            )}
          >
            {page}
          </Link>
        ),
      )}

      {/* دکمه بعدی */}
      {currentPage < totalPages ? (
        <Link
          href={buildUrl(currentPage + 1)}
          className="px-3 py-2 rounded-md border border-gray-300 text-sm transition hover:bg-gray-100"
        >
          بعدی
        </Link>
      ) : (
        <span className="px-3 py-2 rounded-md border border-gray-300 text-sm opacity-50 pointer-events-none">
          بعدی
        </span>
      )}
    </nav>
  );
}