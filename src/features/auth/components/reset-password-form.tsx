"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { toast } from "sonner";
import { ArrowRight, LoaderCircle } from "lucide-react";

import { PasswordField } from "@/features/auth/components/auth-fields";
import { authClient } from "@/server/auth/client";

type ResetPasswordPanelProps = {
  token: string | null;
  error: string | null;
};

export function ResetPasswordForm(props: Partial<ResetPasswordPanelProps> = {}) {
  if ("token" in props || "error" in props) {
    return <ResetPasswordPanel token={props.token ?? null} error={props.error ?? null} />;
  }

  return (
    <Suspense fallback={null}>
      <ResetPasswordFromSearch />
    </Suspense>
  );
}

function ResetPasswordFromSearch() {
  const searchParams = useSearchParams();
  return <ResetPasswordPanel token={searchParams.get("token")} error={searchParams.get("error")} />;
}

function ResetPasswordPanel({ token, error }: ResetPasswordPanelProps) {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordMismatch, setPasswordMismatch] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const linkIsInvalid = error === "INVALID_TOKEN" || !token;

  const savePassword = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!token) return;
    if (password !== confirmPassword) {
      setPasswordMismatch(true);
      return;
    }
    setPasswordMismatch(false);
    setIsSubmitting(true);
    const { error: resetError } = await authClient.resetPassword({
      newPassword: password,
      token,
    });
    setIsSubmitting(false);
    if (resetError) {
      toast.error(resetError.message ?? "This reset link is no longer valid.");
      return;
    }
    toast.success("Password updated. Sign in with the new password.");
    router.push("/login");
  };

  if (linkIsInvalid) {
    return (
      <div className="horizon-glass flex h-full flex-col justify-center gap-6 rounded-3xl p-6 sm:rounded-[2rem] sm:p-8 lg:p-10">
        <div role="alert">
          <p className="text-[10px] font-bold uppercase tracking-[0.17em] text-horizon-primary">Password reset</p>
          <h2 className="mt-3 text-2xl font-bold tracking-[-0.02em] text-horizon-ink sm:text-3xl">
            This link is no longer valid
          </h2>
          <p className="mt-2 text-sm leading-6 text-horizon-muted">
            Request a new reset link and open it before it expires.
          </p>
        </div>
        <Link
          href="/forgot-password"
          className="inline-flex h-12 w-full items-center justify-center rounded-full bg-horizon-primary text-sm font-bold text-white hover:bg-[#8b1a00] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-horizon-primary"
        >
          Request a new link
        </Link>
      </div>
    );
  }

  return (
    <div className="horizon-glass flex h-full flex-col justify-center gap-6 rounded-3xl p-6 sm:rounded-[2rem] sm:p-8 lg:p-10">
      <div>
        <p className="text-[10px] font-bold uppercase tracking-[0.17em] text-horizon-primary">Password reset</p>
        <h2 className="mt-3 text-2xl font-bold tracking-[-0.02em] text-horizon-ink sm:text-3xl">
          Choose a new password
        </h2>
        <p className="mt-2 text-sm leading-6 text-horizon-muted">
          This replaces the password on your account. You will sign in again afterward.
        </p>
      </div>
      <form onSubmit={savePassword} className="flex flex-col gap-4" aria-busy={isSubmitting}>
        <PasswordField
          id="password"
          label="New password"
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
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-horizon-primary text-sm font-bold text-white transition-all hover:-translate-y-0.5 hover:bg-[#8b1a00] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-horizon-primary active:scale-[0.98] disabled:pointer-events-none disabled:opacity-55"
        >
          {isSubmitting ? (
            <>
              <LoaderCircle className="size-4 animate-spin" />
              Saving password
            </>
          ) : (
            <>
              Save password
              <ArrowRight className="size-4" aria-hidden="true" />
            </>
          )}
        </button>
      </form>
    </div>
  );
}
