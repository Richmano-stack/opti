import { Suspense } from "react";

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
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <Suspense fallback={<LoginFormFallback />}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
