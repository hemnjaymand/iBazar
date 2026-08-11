import { z } from "zod";

export const shippingAddressSchema = z.object({
  fullName: z.string().min(2).max(100),
  phone: z.string().min(8).max(20),
  addressLine: z.string().min(5).max(300),
  city: z.string().min(2).max(100),
  postalCode: z.string().min(3).max(20),
});
export type ShippingAddressInput = z.infer<typeof shippingAddressSchema>;

export const createOrderSchema = z.object({
  shippingAddress: shippingAddressSchema,
  guestEmail: z.string().email().optional(),
  couponCode: z.string().optional(),
});
export type CreateOrderInput = z.infer<typeof createOrderSchema>;
