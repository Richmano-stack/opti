"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";
import { toast } from "sonner";
import { ArrowRight, LoaderCircle, Lock } from "lucide-react";

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
    <div className={cn("w-full", className)} {...props}>
      <div className="horizon-glass rounded-[2rem] p-6 sm:p-10">
        <div className="mb-6">
          <p className="text-[10px] font-bold uppercase tracking-[0.17em] text-horizon-primary">Create an account</p>
          <h2 className="mt-3 text-2xl font-bold tracking-[-0.02em] text-horizon-ink sm:text-3xl">
            Make your best starting point reusable.
          </h2>
          <p className="mt-2 text-sm leading-6 text-horizon-muted">
            Save one master resume to your account and return to it later.
          </p>
        </div>

        <form onSubmit={handleSignUp} className="space-y-4" aria-busy={isSubmitting}>
          <div>
            <label
              htmlFor="name"
              className="mb-2 block text-xs font-bold text-horizon-ink"
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
              className="w-full rounded-full border border-white/80 bg-white/55 px-5 py-3 text-sm text-horizon-ink placeholder:text-horizon-muted/55 transition-all hover:bg-white/70 focus:border-horizon-secondary/40 focus:bg-white/80 focus:outline-none focus:ring-2 focus:ring-horizon-secondary/25"
            />
          </div>

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
              className="w-full rounded-full border border-white/80 bg-white/55 px-5 py-3 text-sm text-horizon-ink placeholder:text-horizon-muted/55 transition-all hover:bg-white/70 focus:border-horizon-secondary/40 focus:bg-white/80 focus:outline-none focus:ring-2 focus:ring-horizon-secondary/25"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-xs font-bold text-horizon-ink"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete="new-password"
              placeholder="Minimum 8 characters"
              required
              minLength={8}
              value={password}
              onChange={(event) => {
                setPassword(event.target.value);
                setPasswordMismatch(false);
              }}
              className="w-full rounded-full border border-white/80 bg-white/55 px-5 py-3 text-sm text-horizon-ink placeholder:text-horizon-muted/55 transition-all hover:bg-white/70 focus:border-horizon-secondary/40 focus:bg-white/80 focus:outline-none focus:ring-2 focus:ring-horizon-secondary/25"
            />
          </div>

          <div>
            <label
              htmlFor="confirm-password"
              className="mb-2 block text-xs font-bold text-horizon-ink"
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
              aria-invalid={passwordMismatch}
              aria-describedby={passwordMismatch ? "confirm-password-error" : undefined}
              value={confirmPassword}
              onChange={(event) => {
                setConfirmPassword(event.target.value);
                setPasswordMismatch(false);
              }}
              className="w-full rounded-full border border-white/80 bg-white/55 px-5 py-3 text-sm text-horizon-ink transition-all hover:bg-white/70 focus:border-horizon-secondary/40 focus:bg-white/80 focus:outline-none focus:ring-2 focus:ring-horizon-secondary/25 aria-invalid:border-red-500 aria-invalid:ring-2 aria-invalid:ring-red-500/20"
            />
            {passwordMismatch ? (
              <p id="confirm-password-error" role="alert" className="mt-2 text-xs font-semibold text-red-700">
                Passwords do not match.
              </p>
            ) : null}
          </div>

          <div className="pt-2">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="h-12 w-full rounded-full bg-horizon-primary text-sm font-bold text-white transition-all hover:-translate-y-0.5 hover:bg-[#8b1a00] focus-visible:ring-horizon-primary active:scale-[0.98] disabled:pointer-events-none disabled:opacity-55"
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

          <p className="pt-1 text-center text-xs text-horizon-muted">
            Already have an account?{" "}
            <Link
              href={loginHref}
              className="font-bold text-horizon-primary underline underline-offset-4"
            >
              Sign in
            </Link>
          </p>

          <p className="mt-3 flex items-center justify-center gap-1.5 border-t border-white/70 pt-4 text-center text-[11px] text-horizon-muted">
            <Lock className="size-3 shrink-0" aria-hidden="true" />
            Your credentials and saved master resume stay private
          </p>
        </form>
      </div>
    </div>
  );
}

