import { z } from "zod";

// ============================================
// Schema برای افزودن تصویر جدید
// ============================================
export const addProductImageSchema = z.object({
  productId: z.string().cuid(),
  variantId: z.string().cuid().optional(),
  url: z.string().url(),
  altText: z.string().max(200).optional(),
  sortOrder: z.coerce.number().int().min(0).default(0),
});
export type AddProductImageInput = z.infer<typeof addProductImageSchema>;

// ============================================
// Schema برای حذف تصویر
// ============================================
export const deleteProductImageSchema = z.object({
  id: z.string().cuid(),
});
export type DeleteProductImageInput = z.infer<typeof deleteProductImageSchema>;

// ============================================
// Schema برای ویرایش تصویر
// ============================================
export const updateProductImageSchema = z.object({
  id: z.string().cuid(),
  variantId: z.string().cuid().optional(),
  altText: z.string().max(200).optional(),
  sortOrder: z.coerce.number().int().min(0).optional(),
   isDefault: z.boolean().optional(),
});
export type UpdateProductImageInput = z.infer<typeof updateProductImageSchema>;