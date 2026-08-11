import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(2, "نام حداقل ۲ کاراکتر باید باشد").max(60),
  email: z.string().email("ایمیل نامعتبر است"),
  password: z.string().min(6, "رمز عبور حداقل ۶ کاراکتر باید باشد"),
});

export type RegisterInput = z.infer<typeof registerSchema>;
