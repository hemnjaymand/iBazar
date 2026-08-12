
import { getWishlistAction } from "@/features/shopping/actions/wishlist.actions";
import { WishlistGrid } from "@/features/shopping/components/wishlist-grid";
import type { WishlistItemDTO } from "@/features/shopping/types/wishlist.dto";

export default async function WishlistPage() {
  const result = await getWishlistAction();

  const wishlistItems: WishlistItemDTO[] =
    result.success ? result.data : [];

  // TODO: اتصال به Server Action واقعی حذف از علاقه‌مندی‌ها
  async function handleRemove(id: string) {
    "use server";

    console.log("حذف آیتم:", id);
  }

  return (
    <main className="min-h-screen bg-[var(--color-background)]">
      <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
        {/* =====================================================
            PAGE HEADER
        ====================================================== */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight text-[var(--color-foreground)] sm:text-3xl">
            علاقه‌مندی‌ها
          </h1>

          <div className="mt-2 flex flex-wrap items-center gap-2">
            <p className="text-sm leading-6 text-[var(--color-muted-foreground)]">
              محصولاتی که برای خرید بعدی ذخیره کرده‌اید.
            </p>

            {wishlistItems.length > 0 && (
              <span
                className="
                  inline-flex items-center
                  rounded-full
                  bg-[var(--color-muted)]
                  px-3 py-1
                  text-xs font-medium
                  text-[var(--color-muted-foreground)]
                "
              >
                {wishlistItems.length} محصول
              </span>
            )}
          </div>
        </div>

        {/* =====================================================
            EMPTY STATE
        ====================================================== */}
        {wishlistItems.length === 0 ? (
          <section
            className="
              flex min-h-[320px]
              flex-col items-center justify-center
              rounded-2xl
              border border-[var(--color-border)]
              bg-[var(--color-card)]
              px-6 py-12
              text-center
              shadow-sm
            "
          >
            {/* Heart Icon */}
            <div
              className="
                mb-5
                flex h-14 w-14
                items-center justify-center
                rounded-full
                bg-[var(--color-muted)]
                text-[var(--color-muted-foreground)]
              "
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                className="h-7 w-7"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78Z"
                />
              </svg>
            </div>

            <h2 className="text-base font-semibold text-[var(--color-foreground)]">
              لیست علاقه‌مندی‌های شما خالی است
            </h2>

            <p className="mt-2 max-w-md text-sm leading-6 text-[var(--color-muted-foreground)]">
              محصولاتی که دوست دارید را به علاقه‌مندی‌ها اضافه کنید
              تا بعداً به‌راحتی به آن‌ها دسترسی داشته باشید.
            </p>
          </section>
        ) : (
          /* ===================================================
             WISHLIST CONTENT
          ==================================================== */
          <section
            className="
              overflow-hidden
              rounded-2xl
              border border-[var(--color-border)]
              bg-[var(--color-card)]
              shadow-sm
            "
          >
            {/* Section Header */}
            <div
              className="
                flex flex-col gap-2
                border-b border-[var(--color-border)]
                px-5 py-4
                sm:flex-row
                sm:items-center
                sm:justify-between
              "
            >
              <div>
                <h2 className="text-sm font-semibold text-[var(--color-foreground)]">
                  محصولات مورد علاقه
                </h2>

                <p className="mt-1 text-xs text-[var(--color-muted-foreground)]">
                  محصولات ذخیره‌شده در لیست علاقه‌مندی‌های شما
                </p>
              </div>

              <span className="text-xs text-[var(--color-muted-foreground)]">
                {wishlistItems.length} مورد
              </span>
            </div>

            {/* Wishlist Grid */}
            <div className="p-4 sm:p-5 lg:p-6">
              <WishlistGrid
                items={wishlistItems}
                onRemove={handleRemove}
              />
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
