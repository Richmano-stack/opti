"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";
import { toast } from "sonner";
import { ArrowRight, LoaderCircle, Lock } from "lucide-react";

import { GoogleContinueButton, OrDivider, PasswordField, authInputClassName } from "@/components/auth/auth-fields";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getSafeCallbackUrl } from "@/lib/auth/callback-url";
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
    <div className={cn("flex h-full min-h-0 w-full flex-col", className)} {...props}>
      <div className="horizon-glass flex h-full min-h-0 flex-col overflow-hidden rounded-[1.75rem] p-4 sm:p-5">
        <div className="mb-2.5 shrink-0">
          <p className="text-[10px] font-bold uppercase tracking-[0.17em] text-horizon-primary">Create an account</p>
          <h2 className="mt-1 text-lg font-bold tracking-[-0.02em] text-horizon-ink sm:text-xl">
            Make your best starting point reusable.
          </h2>
          <p className="mt-1 hidden text-sm leading-5 text-neutral-800 sm:block">
            Save one master resume to your account and return to it later.
          </p>
        </div>

        <div className="shrink-0">
          <GoogleContinueButton callbackUrl={callbackUrl} disabled={isSubmitting} />
          <div className="my-2.5">
            <OrDivider />
          </div>
        </div>

        <form onSubmit={handleSignUp} className="flex min-h-0 flex-1 flex-col gap-2" aria-busy={isSubmitting}>
          <div className="grid gap-2 sm:grid-cols-2">
            <div>
              <label htmlFor="name" className="mb-1 block text-xs font-bold text-neutral-950">
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
          </div>

          <div className="grid gap-2 sm:grid-cols-2">
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

          <div>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="h-10 w-full rounded-full bg-horizon-primary text-sm font-bold text-white transition-all hover:bg-[#8b1a00] focus-visible:ring-horizon-primary active:scale-[0.98] disabled:pointer-events-none disabled:opacity-55"
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
            </Button>
          </div>

          <p className="text-center text-sm text-neutral-800">
            Already have an account?{" "}
            <Link href={loginHref} className="font-bold text-horizon-primary underline underline-offset-4">
              Sign in
            </Link>
          </p>

          <p className="mt-auto flex items-center justify-center gap-1.5 border-t border-neutral-200 pt-2.5 text-center text-xs text-neutral-800">
            <Lock className="size-3 shrink-0" aria-hidden="true" />
            Your credentials and saved master resume stay private
          </p>
        </form>
      </div>
    </div>
  );
}
