"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";
import { toast } from "sonner";
import { ArrowRight, LoaderCircle, Lock } from "lucide-react";

import { GoogleContinueButton, OrDivider, PasswordField, authInputClassName } from "@/components/auth/auth-fields";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getSafeCallbackUrl } from "@/lib/auth/callback-url";
import { authClient } from "@/server/auth/client";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = getSafeCallbackUrl(searchParams.get("callbackUrl"));

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSignIn = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      setIsSubmitting(true);

      const { error } = await authClient.signIn.email({
        email,
        password,
        callbackURL: callbackUrl,
      });

      setIsSubmitting(false);

      if (error) {
        toast.error(error.message ?? "Sign in failed");
        return;
      }

      toast.success("Signed in successfully");
      router.push(callbackUrl);
      router.refresh();
    },
    [callbackUrl, email, password, router],
  );

  const signupHref =
    callbackUrl === "/dashboard" || callbackUrl === "/"
      ? "/signup"
      : `/signup?callbackUrl=${encodeURIComponent(callbackUrl)}`;

  return (
    <div className={cn("flex h-full min-h-0 w-full flex-col", className)} {...props}>
      <div className="horizon-glass flex h-full min-h-0 flex-col overflow-hidden rounded-[1.75rem] p-4 sm:p-6">
        <div className="mb-3 shrink-0">
          <p className="text-[10px] font-bold uppercase tracking-[0.17em] text-horizon-primary">Sign in</p>
          <h2 className="mt-1.5 text-lg font-bold tracking-[-0.02em] text-horizon-ink sm:text-xl">
            Pick up where you left off.
          </h2>
          <p className="mt-1 text-sm leading-5 text-neutral-800">
            Enter your account details to continue.
          </p>
        </div>

        <div className="shrink-0">
          <GoogleContinueButton callbackUrl={callbackUrl} disabled={isSubmitting} />
          <div className="my-3">
            <OrDivider />
          </div>
        </div>

        <form onSubmit={handleSignIn} className="flex min-h-0 flex-1 flex-col gap-2.5" aria-busy={isSubmitting}>
          <div>
            <label htmlFor="email" className="mb-1 block text-xs font-bold text-neutral-950">
              Email address
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className={authInputClassName}
            />
          </div>

          <PasswordField
            id="password"
            label="Password"
            autoComplete="current-password"
            required
            minLength={8}
            disabled={isSubmitting}
            value={password}
            onChange={setPassword}
          />

          <div className="mt-1">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="h-10 w-full rounded-full bg-horizon-primary text-sm font-bold text-white transition-all hover:bg-[#8b1a00] focus-visible:ring-horizon-primary active:scale-[0.98] disabled:pointer-events-none disabled:opacity-55"
            >
              {isSubmitting ? (
                <>
                  <LoaderCircle className="size-4 animate-spin" />
                  Signing in
                </>
              ) : (
                <>
                  Sign in
                  <ArrowRight className="size-4" aria-hidden="true" />
                </>
              )}
            </Button>
          </div>

          <p className="text-center text-sm text-neutral-800">
            Don&apos;t have an account?{" "}
            <Link href={signupHref} className="font-bold text-horizon-primary underline underline-offset-4">
              Sign up
            </Link>
          </p>

          <p className="mt-auto flex items-center justify-center gap-1.5 border-t border-neutral-200 pt-3 text-center text-xs text-neutral-800">
            <Lock className="size-3 shrink-0" aria-hidden="true" />
            Your sign-in details are never shown publicly
          </p>
        </form>
      </div>
    </div>
  );
}
