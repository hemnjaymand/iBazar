import { getWishlistAction } from "@/features/shopping/actions/wishlist.actions";
import { WishlistGrid } from "@/features/shopping/components/wishlist-grid";
import type { WishlistItemDTO } from "@/features/shopping/types/wishlist.dto";

export default async function WishlistPage() {
  const result = await getWishlistAction();

  // استخراج داده‌ها یا آرایه خالی
  const wishlistItems: WishlistItemDTO[] = result.success ? result.data : [];

  // تابع حذف (Server Action)
  async function handleRemove(id: string) {
    "use server";
    // TODO: فراخوانی اکشن حذف
    console.log("حذف آیتم:", id);
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">علاقه‌مندی‌ها</h1>

      {wishlistItems.length === 0 ? (
        <p className="text-muted-foreground">
          شما هنوز محصولی به لیست علاقه‌مندی اضافه نکرده‌اید.
        </p>
      ) : (
        <WishlistGrid items={wishlistItems} onRemove={handleRemove} />
      )}
    </div>
  );
}