"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";
import { toast } from "sonner";
import { LoaderCircle, Lock } from "lucide-react";

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
      <div className="rounded-2xl border border-slate-200/80 bg-white p-7 sm:p-8 shadow-[0_4px_24px_rgba(0,0,0,0.04)]">
        <div className="text-center mb-6">
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900">
            Welcome back
          </h1>
          <p className="mt-1 text-xs text-slate-500">
            Enter your email and password to sign in
          </p>
        </div>

        <form onSubmit={handleSignIn} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-xs font-bold text-slate-900 mb-1.5"
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
              className="w-full rounded-xl border border-slate-200 bg-[#fbfcfe] px-3.5 py-2 text-xs text-slate-800 placeholder:text-slate-400 focus:border-brand-muted focus:outline-none focus:ring-2 focus:ring-brand-muted/30 transition-all"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label
                htmlFor="password"
                className="block text-xs font-bold text-slate-900"
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
              className="w-full rounded-xl border border-slate-200 bg-[#fbfcfe] px-3.5 py-2 text-xs text-slate-800 placeholder:text-slate-400 focus:border-brand-muted focus:outline-none focus:ring-2 focus:ring-brand-muted/30 transition-all"
            />
          </div>

          <div className="pt-2">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-11 rounded-xl bg-brand-action hover:bg-brand-action-hover text-slate-900 font-semibold text-xs shadow-sm shadow-sky-200/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <LoaderCircle className="size-4 animate-spin" />
                  Signing in
                </>
              ) : (
                "Sign in"
              )}
            </Button>
          </div>

          <p className="text-center text-xs text-slate-500 pt-2">
            Don&apos;t have an account?{" "}
            <Link
              href={signupHref}
              className="font-semibold text-brand-ink hover:text-brand-ink underline underline-offset-2"
            >
              Sign up
            </Link>
          </p>

          <p className="mt-4 flex items-center justify-center gap-1.5 text-[11px] text-slate-400 pt-3 border-t border-slate-100">
            <Lock className="size-3 text-slate-400" />
            Your sign-in details are never shown publicly
          </p>
        </form>
      </div>
    </div>
  );
}
