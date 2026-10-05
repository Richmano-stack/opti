"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";
import { toast } from "sonner";
import { ArrowRight, LoaderCircle, Lock } from "lucide-react";

import { PasswordField, authInputClassName } from "@/features/auth/components/auth-fields";
import { cn } from "@/lib/utils";
import { getSafeCallbackUrl } from "@/features/auth/lib/callback-url";
import { authClient } from "@/server/auth/client";

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const searchParams = useSearchParams();
  const callbackUrl = getSafeCallbackUrl(searchParams.get("callbackUrl"));

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
      window.location.assign(callbackUrl);
    },
    [callbackUrl, confirmPassword, email, name, password],
  );

  const loginHref =
    callbackUrl === "/dashboard" || callbackUrl === "/"
      ? "/login"
      : `/login?callbackUrl=${encodeURIComponent(callbackUrl)}`;

  return (
    <div className={cn("flex h-full w-full flex-col", className)} {...props}>
      <div className="horizon-glass flex h-full flex-col justify-center gap-6 rounded-[2rem] p-6 sm:p-8 lg:p-10">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.17em] text-horizon-primary">
            Create an account
          </p>
          <h2 className="mt-3 text-2xl font-bold tracking-[-0.02em] text-horizon-ink sm:text-3xl">
            Make your best starting point reusable.
          </h2>
          <p className="mt-2 text-sm leading-6 text-horizon-muted">
            Save one master resume to your account and return to it later.
          </p>
        </div>

        <form onSubmit={handleSignUp} className="flex flex-col gap-5" aria-busy={isSubmitting}>
          <div className="grid gap-5 sm:grid-cols-2 sm:gap-4">
            <div>
              <label htmlFor="name" className="mb-2 block text-xs font-bold text-horizon-ink">
                Full name
              </label>
              <input
                id="name"
                type="text"
                autoComplete="name"
                placeholder="Jane Doe"
                value={name}
                onChange={(event) => setName(event.target.value)}
                className={authInputClassName}
              />
            </div>

            <div>
              <label htmlFor="email" className="mb-2 block text-xs font-bold text-horizon-ink">
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
          </div>

          <div className="grid gap-5 sm:grid-cols-2 sm:gap-4">
            <PasswordField
              id="password"
              label="Password"
              autoComplete="new-password"
              placeholder="Min. 8 characters"
              required
              minLength={8}
              disabled={isSubmitting}
              value={password}
              onChange={(value) => {
                setPassword(value);
                setPasswordMismatch(false);
              }}
            />

            <div>
              <PasswordField
                id="confirm-password"
                label="Confirm password"
                autoComplete="new-password"
                required
                minLength={8}
                disabled={isSubmitting}
                invalid={passwordMismatch}
                describedBy={passwordMismatch ? "confirm-password-error" : undefined}
                value={confirmPassword}
                onChange={(value) => {
                  setConfirmPassword(value);
                  setPasswordMismatch(false);
                }}
              />
              {passwordMismatch ? (
                <p id="confirm-password-error" role="alert" className="mt-1 text-xs font-semibold text-red-700">
                  Passwords do not match.
                </p>
              ) : null}
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-horizon-primary text-sm font-bold text-white transition-all hover:-translate-y-0.5 hover:bg-[#8b1a00] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-horizon-primary active:scale-[0.98] disabled:pointer-events-none disabled:opacity-55"
            >
              {isSubmitting ? (
                <>
                  <LoaderCircle className="size-4 animate-spin" />
                  Creating account
                </>
              ) : (
                <>
                  Create account
                  <ArrowRight className="size-4" aria-hidden="true" />
                </>
              )}
            </button>
          </div>

          <p className="pt-1 text-center text-xs text-horizon-muted">
            Already have an account?{" "}
            <Link
              href={loginHref}
              className="font-bold text-horizon-primary underline underline-offset-4"
            >
              Sign in
            </Link>
          </p>

          <p className="mt-2 flex items-center justify-center gap-1.5 border-t border-white/70 pt-4 text-center text-[11px] text-horizon-muted">
            <Lock className="size-3 shrink-0" aria-hidden="true" />
            Your credentials and saved master resume stay private
          </p>
        </form>
      </div>
    </div>
  );
}
