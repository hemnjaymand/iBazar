// "use server";

// import { cookies } from "next/headers";
// import { redirect } from "next/navigation";

// // در یک پروژه واقعی، این اطلاعات از دیتابیس چک می‌شود
// const ADMIN_CREDENTIALS = {
//   email: "admin@example.com",
//   password: "admin123",
// };

// export async function loginAction(formData: FormData) {
//   const email = formData.get("email") as string;
//   const password = formData.get("password") as string;

//   if (
//     email === ADMIN_CREDENTIALS.email &&
//     password === ADMIN_CREDENTIALS.password
//   ) {
//     // تنظیم کوکی برای نشست ادمین (فقط برای نمونه)
//     const cookieStore = await cookies();
//     cookieStore.set("admin_session", "true", {
//       httpOnly: true,
//       // secure: process.env.NODE_ENV === 'production',
//       maxAge: 60 * 60 * 24,
//       path: "/",
//     });
//     redirect("/admin");
//   } else {
//     // بازگشت به صفحه لاگین با خطا
//     redirect("/admin/login?error=invalid");
//   }
// }

// export async function logoutAction() {
//   const cookieStore = await cookies();
//   cookieStore.delete("admin_session");
//   redirect("/admin/login");
// }

// export async function isAdminLoggedIn() {
//   const cookieStore = await cookies();
//   return cookieStore.has("admin_session");
// }
"use server";

import { signIn, signOut } from "@/server/auth"; // مسیر فایل auth.ts خود را چک کنید
import { redirect } from "next/navigation";
import { AuthError } from "next-auth";

export async function loginAction(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: "/admin",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      redirect("/admin/login?error=invalid");
    }

    throw error;
  }
}
