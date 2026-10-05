"use client";

import { useState } from "react";
import { Eye, EyeOff, LoaderCircle } from "lucide-react";
import { toast } from "sonner";

import { cn } from "@/lib/utils";
import { authClient } from "@/server/auth/client";

export const authInputClassName =
  "w-full rounded-full border border-white/80 bg-white/55 px-5 py-3.5 text-sm text-horizon-ink placeholder:text-horizon-muted/55 transition-all hover:bg-white/70 focus:border-horizon-secondary/40 focus:bg-white/80 focus:outline-none focus:ring-2 focus:ring-horizon-secondary/25 disabled:cursor-wait disabled:opacity-70 aria-invalid:border-red-600 aria-invalid:ring-2 aria-invalid:ring-red-600/20";

type PasswordFieldProps = {
  id: string;
  label: string;
  value: string;
  autoComplete: "current-password" | "new-password";
  placeholder?: string;
  required?: boolean;
  minLength?: number;
  disabled?: boolean;
  describedBy?: string;
  invalid?: boolean;
  onChange: (value: string) => void;
};

export function PasswordField({
  id,
  label,
  value,
  autoComplete,
  placeholder,
  required,
  minLength,
  disabled,
  describedBy,
  invalid,
  onChange,
}: PasswordFieldProps) {
  const [visible, setVisible] = useState(false);
  const toggleLabel = `${visible ? "Hide" : "Show"} ${label.toLowerCase()}`;

  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-xs font-bold text-horizon-ink">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type={visible ? "text" : "password"}
          autoComplete={autoComplete}
          placeholder={placeholder}
          required={required}
          minLength={minLength}
          disabled={disabled}
          aria-invalid={invalid || undefined}
          aria-describedby={describedBy}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className={cn(authInputClassName, "pr-12")}
        />
        <button
          type="button"
          aria-label={toggleLabel}
          aria-pressed={visible}
          disabled={disabled}
          onClick={() => setVisible((current) => !current)}
          className="absolute top-1/2 right-2 inline-flex size-8 -translate-y-1/2 items-center justify-center rounded-full text-horizon-muted hover:bg-white/80 hover:text-horizon-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-horizon-secondary disabled:pointer-events-none"
        >
          {visible ? <EyeOff aria-hidden="true" className="size-4" /> : <Eye aria-hidden="true" className="size-4" />}
        </button>
      </div>
    </div>
  );
}

export function OrDivider() {
  return (
    <div className="flex items-center gap-3" role="separator">
      <span className="h-px flex-1 bg-neutral-200 dark:bg-neutral-700" />
      <span className="text-xs font-bold tracking-[0.14em] text-neutral-800 uppercase">or</span>
      <span className="h-px flex-1 bg-neutral-200 dark:bg-neutral-700" />
    </div>
  );
}

export function GoogleContinueButton({
  callbackUrl,
  disabled,
}: {
  callbackUrl: string;
  disabled?: boolean;
}) {
  const [isPending, setIsPending] = useState(false);

  const continueWithGoogle = async () => {
    setIsPending(true);
    const { error } = await authClient.signIn.social({
      provider: "google",
      callbackURL: callbackUrl,
    });
    setIsPending(false);

    if (error) {
      toast.error(error.message ?? "Google sign-in is not available.");
    }
  };

  return (
    <button
      type="button"
      disabled={disabled || isPending}
      onClick={continueWithGoogle}
      className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-full border border-neutral-200 bg-white text-sm font-bold text-neutral-950 transition hover:bg-neutral-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-horizon-secondary disabled:pointer-events-none disabled:opacity-55 dark:border-neutral-700 dark:bg-neutral-950 dark:text-neutral-50"
    >
      {isPending ? <LoaderCircle aria-hidden="true" className="size-4 animate-spin" /> : <GoogleMark />}
      Continue with Google
    </button>
  );
}

function GoogleMark() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="size-4">
      <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.4h6.5a5.6 5.6 0 0 1-2.4 3.7v3h3.9c2.3-2.1 3.5-5.2 3.5-8.8Z" />
      <path fill="#34A853" d="M12 24c3.2 0 5.9-1 7.9-2.9l-3.9-3c-1.1.7-2.5 1.2-4 1.2-3.1 0-5.7-2.1-6.6-4.9H1.4v3.1A12 12 0 0 0 12 24Z" />
      <path fill="#FBBC05" d="M5.4 14.4A7.2 7.2 0 0 1 5 12c0-.8.1-1.6.4-2.4V6.5H1.4A12 12 0 0 0 0 12c0 1.9.5 3.8 1.4 5.5l4-3.1Z" />
      <path fill="#EA4335" d="M12 4.7c1.7 0 3.3.6 4.5 1.8l3.4-3.4C17.9 1.1 15.2 0 12 0 7.3 0 3.2 2.7 1.4 6.5l4 3.1C6.3 6.8 8.9 4.7 12 4.7Z" />
    </svg>
  );
}
