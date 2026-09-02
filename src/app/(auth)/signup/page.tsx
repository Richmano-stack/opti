import { Suspense } from "react";

import { AuthPageShell } from "@/components/auth/auth-page-shell";
import { SignupForm } from "@/components/signup-form";
import { Skeleton } from "@/components/ui/skeleton";

function SignupFormFallback() {
  return (
    <div className="flex w-full flex-col gap-6">
      <Skeleton className="h-[520px] w-full rounded-xl" />
    </div>
  );
}

export default function SignupPage() {
  return (
    <AuthPageShell variant="signup">
      <Suspense fallback={<SignupFormFallback />}>
        <SignupForm />
      </Suspense>
    </AuthPageShell>
  );
}
