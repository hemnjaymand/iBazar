import { z } from "zod";

export const assignVariantAttributesSchema = z.object({
  variantId: z.string().cuid(),
  attributeValueIds: z.array(z.string().cuid()).min(1),
});
