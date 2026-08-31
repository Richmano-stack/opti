"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";
import { toast } from "sonner";
import { LoaderCircle, Lock } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { authClient } from "@/server/auth/client";

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/dashboard";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordMismatch, setPasswordMismatch] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSignUp = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      if (password !== confirmPassword) {
        setPasswordMismatch(true);
        return;
      }

      setPasswordMismatch(false);
      setIsSubmitting(true);

      const { error } = await authClient.signUp.email({
        email,
        password,
        name: name.trim() || (email.split("@")[0] ?? "User"),
        callbackURL: callbackUrl,
      });

      setIsSubmitting(false);

      if (error) {
        toast.error(error.message ?? "Registration failed");
        return;
      }

      toast.success("Account created  welcome!");
      router.push(callbackUrl);
      router.refresh();
    },
    [callbackUrl, confirmPassword, email, name, password, router],
  );

  const loginHref =
    callbackUrl === "/dashboard" || callbackUrl === "/"
      ? "/login"
      : `/login?callbackUrl=${encodeURIComponent(callbackUrl)}`;

  return (
    <div className={cn("w-full", className)} {...props}>
      <div className="rounded-2xl border border-slate-200/80 bg-white p-7 sm:p-8 shadow-[0_4px_24px_rgba(0,0,0,0.04)]">
        <div className="text-center mb-6">
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900">
            Create an account
          </h1>
          <p className="mt-1 text-xs text-slate-500">
            Save your master resume and tailor it for every job
          </p>
        </div>

        <form onSubmit={handleSignUp} className="space-y-3.5">
          <div>
            <label
              htmlFor="name"
              className="block text-xs font-bold text-slate-900 mb-1"
            >
              Full name
            </label>
            <input
              id="name"
              type="text"
              autoComplete="name"
              placeholder="Jane Doe"
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-[#fbfcfe] px-3.5 py-2 text-xs text-slate-800 placeholder:text-slate-400 focus:border-brand-muted focus:outline-none focus:ring-2 focus:ring-brand-muted/30 transition-all"
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-xs font-bold text-slate-900 mb-1"
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
            <label
              htmlFor="password"
              className="block text-xs font-bold text-slate-900 mb-1"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete="new-password"
              placeholder=" (min 8 chars)"
              required
              minLength={8}
              value={password}
              onChange={(event) => {
                setPassword(event.target.value);
                setPasswordMismatch(false);
              }}
              className="w-full rounded-xl border border-slate-200 bg-[#fbfcfe] px-3.5 py-2 text-xs text-slate-800 placeholder:text-slate-400 focus:border-brand-muted focus:outline-none focus:ring-2 focus:ring-brand-muted/30 transition-all"
            />
          </div>

          <div>
            <label
              htmlFor="confirm-password"
              className="block text-xs font-bold text-slate-900 mb-1"
            >
              Confirm password
            </label>
            <input
              id="confirm-password"
              type="password"
              autoComplete="new-password"
              placeholder=""
              required
              minLength={8}
              value={confirmPassword}
              onChange={(event) => {
                setConfirmPassword(event.target.value);
                setPasswordMismatch(false);
              }}
              className="w-full rounded-xl border border-slate-200 bg-[#fbfcfe] px-3.5 py-2 text-xs text-slate-800 placeholder:text-slate-400 focus:border-brand-muted focus:outline-none focus:ring-2 focus:ring-brand-muted/30 transition-all"
            />
            {passwordMismatch ? (
              <p className="mt-1 text-[11px] text-red-500 font-medium">
                Passwords do not match.
              </p>
            ) : null}
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
                  Creating account
                </>
              ) : (
                "Create Account"
              )}
            </Button>
          </div>

          <p className="text-center text-xs text-slate-500 pt-1">
            Already have an account?{" "}
            <Link
              href={loginHref}
              className="font-semibold text-brand-ink hover:text-brand-ink underline underline-offset-2"
            >
              Sign in
            </Link>
          </p>

          <p className="mt-3 flex items-center justify-center gap-1.5 text-[11px] text-slate-400 pt-3 border-t border-slate-100">
            <Lock className="size-3 text-slate-400" />
            Your documents and credentials stay private
          </p>
        </form>
      </div>
    </div>
  );
}
