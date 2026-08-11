import { z } from "zod";

export const updateUserAdminSchema = z.object({
  id: z.string().cuid(),
  role: z.enum(["ADMIN", "CUSTOMER"]).optional(),
  isActive: z.boolean().optional(),
});
export type UpdateUserAdminInput = z.infer<typeof updateUserAdminSchema>;
