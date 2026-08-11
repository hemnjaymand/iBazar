import { productImageRepository } from "../repositories/product-image.repository";
import type { z } from "zod";
import type { addProductImageSchema } from "../schemas/product-image.schema";

export async function addProductImageService(
  input: z.infer<typeof addProductImageSchema>,
) {
  return productImageRepository.create(input);
}
