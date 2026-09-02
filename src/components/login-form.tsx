"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";
import { toast } from "sonner";
import { ArrowRight, LoaderCircle, Lock } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { authClient } from "@/server/auth/client";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/dashboard";

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
    <div className={cn("w-full", className)} {...props}>
      <div className="horizon-glass rounded-[2rem] p-6 sm:p-10">
        <div className="mb-7">
          <p className="text-[10px] font-bold uppercase tracking-[0.17em] text-horizon-primary">Sign in</p>
          <h2 className="mt-3 text-2xl font-bold tracking-[-0.02em] text-horizon-ink sm:text-3xl">
            Pick up where you left off.
          </h2>
          <p className="mt-2 text-sm leading-6 text-horizon-muted">
            Enter your account details to continue.
          </p>
        </div>

        <form onSubmit={handleSignIn} className="space-y-5" aria-busy={isSubmitting}>
          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-xs font-bold text-horizon-ink"
            >
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
              className="w-full rounded-full border border-white/80 bg-white/55 px-5 py-3.5 text-sm text-horizon-ink placeholder:text-horizon-muted/55 transition-all hover:bg-white/70 focus:border-horizon-secondary/40 focus:bg-white/80 focus:outline-none focus:ring-2 focus:ring-horizon-secondary/25"
            />
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between">
              <label
                htmlFor="password"
                className="block text-xs font-bold text-horizon-ink"
              >
                Password
              </label>
            </div>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              placeholder=""
              required
              minLength={8}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-full border border-white/80 bg-white/55 px-5 py-3.5 text-sm text-horizon-ink transition-all hover:bg-white/70 focus:border-horizon-secondary/40 focus:bg-white/80 focus:outline-none focus:ring-2 focus:ring-horizon-secondary/25"
            />
          </div>

          <div className="pt-1">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="h-12 w-full rounded-full bg-horizon-primary text-sm font-bold text-white transition-all hover:-translate-y-0.5 hover:bg-[#8b1a00] focus-visible:ring-horizon-primary active:scale-[0.98] disabled:pointer-events-none disabled:opacity-55"
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

          <p className="pt-1 text-center text-xs text-horizon-muted">
            Don&apos;t have an account?{" "}
            <Link
              href={signupHref}
              className="font-bold text-horizon-primary underline underline-offset-4"
            >
              Sign up
            </Link>
          </p>

          <p className="mt-4 flex items-center justify-center gap-1.5 border-t border-white/70 pt-4 text-[11px] text-horizon-muted">
            <Lock className="size-3" aria-hidden="true" />
            Your sign-in details are never shown publicly
          </p>
        </form>
      </div>
    </div>
  );
}
