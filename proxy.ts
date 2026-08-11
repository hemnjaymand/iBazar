// // proxy.ts (جایگزین middleware.ts در Next.js 16)
// import { NextResponse } from "next/server";
// import type { NextRequest } from "next/server";

// export function proxy(request: NextRequest) {
//   const adminSessionCookie = request.cookies.get("admin_session");
//   const isAdminLoggedIn = adminSessionCookie?.value === "true";

//   const pathname = request.nextUrl.pathname;

//   // اگر کاربر می‌خواهد وارد بخش ادمین شود (به جز صفحه لاگین) و لاگین نکرده است
//   if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
//     if (!isAdminLoggedIn) {
//       return NextResponse.redirect(new URL("/admin/login", request.url));
//     }
//   }

//   // اگر کاربر در صفحه لاگین است و از قبل احراز هویت شده، به داشبورد هدایت شود
//   if (pathname === "/admin/login" && isAdminLoggedIn) {
//     return NextResponse.redirect(new URL("/admin/dashboard", request.url));
//   }

//   return NextResponse.next();
// }

// export const config = {
//   matcher: ["/admin/:path*"],
// }; 