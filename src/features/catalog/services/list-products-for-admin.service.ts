
import { toProductListItemDTO } from "../mappers";
import { productRepository } from "../repositories/product.repository";
import { PAGINATION_DEFAULTS } from "@/config/pagination";
import type { ProductListItemDTO } from "../types";

export interface AdminProductListItem extends ProductListItemDTO {
  categoryName: string;
  price: number;
  stock: number;
}

// محصولی که همراه category از repository دریافت می‌شود
type ProductWithCategory = Awaited<
  ReturnType<typeof productRepository.findAllForAdmin>
>[number];
 

export async function listProductsForAdminService(page = 1) {
  const take = PAGINATION_DEFAULTS.pageSize;
  const skip = (page - 1) * take;


  const [products, total] = await Promise.all([
    productRepository.findAllForAdmin({
      skip,
      take,
    }),

    productRepository.countAllForAdmin(),
  ]);

const items = products.map((p) => ({
  ...toProductListItemDTO(p),
  categoryName: p.category?.name ?? "—",
}));

console.log("SERVICE ITEMS IMAGE:", items.map(item => ({
  name:item.name,
  imageUrl:item.imageUrl,
  variantImage:item.defaultVariant?.imageUrl
})));

return {
 items,
 totalPages: Math.max(1, Math.ceil(total / take)),
};

}
