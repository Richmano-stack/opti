import { AuthPageShell } from "@/features/auth/components/auth-page-shell";
import { ResetPasswordForm } from "@/features/auth/components/reset-password-form";

export default function ResetPasswordPage() {
  return (
    <AuthPageShell variant="recover">
      <ResetPasswordForm />
    </AuthPageShell>
  );
}
