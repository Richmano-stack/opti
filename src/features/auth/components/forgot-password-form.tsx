"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, LoaderCircle } from "lucide-react";

import { authInputClassName } from "@/features/auth/components/auth-fields";
import { authClient } from "@/server/auth/client";

const confirmation =
  "If an account exists for that email, we sent a link to choose a new password.";

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const requestReset = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    await authClient.requestPasswordReset({
      email,
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setIsSubmitting(false);
    setSubmitted(true);
  };

  return (
    <div className="horizon-glass flex h-full flex-col justify-center gap-6 rounded-3xl p-6 sm:rounded-[2rem] sm:p-8 lg:p-10">
      <div>
        <p className="text-[10px] font-bold uppercase tracking-[0.17em] text-horizon-primary">Password reset</p>
        <h2 className="mt-3 text-2xl font-bold tracking-[-0.02em] text-horizon-ink sm:text-3xl">
          Send a reset link
        </h2>
        <p className="mt-2 text-sm leading-6 text-horizon-muted">
          Enter the email on your account. The link opens a page where you choose a new password.
        </p>
      </div>

      {submitted ? (
        <div className="flex flex-col gap-4" role="status">
          <p className="text-sm leading-6 text-horizon-ink">{confirmation}</p>
          <Link
            href="/login"
            className="inline-flex h-12 w-full items-center justify-center rounded-full bg-horizon-primary text-sm font-bold text-white hover:bg-[#8b1a00] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-horizon-primary"
          >
            Back to sign in
          </Link>
        </div>
      ) : (
        <form onSubmit={requestReset} className="flex flex-col gap-4" aria-busy={isSubmitting}>
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
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-horizon-primary text-sm font-bold text-white transition-all hover:-translate-y-0.5 hover:bg-[#8b1a00] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-horizon-primary active:scale-[0.98] disabled:pointer-events-none disabled:opacity-55"
          >
            {isSubmitting ? (
              <>
                <LoaderCircle className="size-4 animate-spin" />
                Sending link
              </>
            ) : (
              <>
                Send reset link
                <ArrowRight className="size-4" aria-hidden="true" />
              </>
            )}
          </button>
          <p className="pt-1 text-center text-xs text-horizon-muted">
            <Link href="/login" className="font-bold text-horizon-primary underline underline-offset-4">
              Back to sign in
            </Link>
          </p>
        </form>
      )}
    </div>
  );
}
