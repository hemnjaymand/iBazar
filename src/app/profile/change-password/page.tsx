import { ChangePasswordForm } from "@/features/identity/components/change-password-form";

export default function ChangePasswordPage() {
  return (
    <div>
      <h1 className="text-xl font-bold mb-6">تغییر رمز عبور</h1>
      <ChangePasswordForm />
    </div>
  );
}