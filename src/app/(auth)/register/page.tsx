import type { Metadata } from "next";
import { AuthLayout } from "@/features/identity/components/auth-layout";
import { RegisterForm } from "@/features/identity/components/register-form";

export const metadata: Metadata = { title: "ساخت حساب کاربری" };

export default function RegisterPage() {
  return (
    <AuthLayout title="ساخت حساب" subtitle="در کمتر از یک دقیقه عضو فروشگاه شوید">
      <RegisterForm />
    </AuthLayout>
  );
}
