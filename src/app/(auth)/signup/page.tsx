import { Suspense } from "react";

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
    <div className="flex flex-1 items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <Suspense fallback={<SignupFormFallback />}>
          <SignupForm />
        </Suspense>
      </div>
    </div>
  );
}
