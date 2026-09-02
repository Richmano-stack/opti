import { Suspense } from "react";

import { AuthPageShell } from "@/components/auth/auth-page-shell";
import { LoginForm } from "@/components/login-form";
import { Skeleton } from "@/components/ui/skeleton";

function LoginFormFallback() {
  return (
    <div className="flex w-full flex-col gap-6">
      <Skeleton className="h-[420px] w-full rounded-xl" />
    </div>
  );
}

export default function LoginPage() {
  return (
    <AuthPageShell variant="login">
      <Suspense fallback={<LoginFormFallback />}>
        <LoginForm />
      </Suspense>
    </AuthPageShell>
  );
}
