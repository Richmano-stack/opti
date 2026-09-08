import type { HTMLAttributes, ReactNode } from "react";
import { AlertCircle, Ban, CheckCircle2, Inbox } from "lucide-react";

import { cn } from "@/lib/utils";

import { HorizonButton, HorizonSurface } from "./index";

type StatePanelProps = Omit<HTMLAttributes<HTMLDivElement>, "title"> & {
  title: ReactNode;
  description?: ReactNode;
  icon: ReactNode;
  label: string;
  action?: ReactNode;
  tone?: "neutral" | "success" | "danger" | "blocked";
};

function StatePanel({ title, description, icon, label, action, tone = "neutral", className, ...props }: StatePanelProps) {
  const tones = {
    neutral: "bg-horizon-secondary/10 text-horizon-secondary",
    success: "bg-success-muted text-success",
    danger: "bg-red-50 text-red-700",
    blocked: "bg-horizon-tertiary/10 text-horizon-tertiary",
  };

  return (
    <HorizonSurface className={cn("flex flex-col items-center px-5 py-10 text-center sm:px-8 sm:py-12", className)} {...props}>
      <span aria-hidden="true" className={cn("inline-flex size-12 items-center justify-center rounded-full", tones[tone])}>{icon}</span>
      <p className="mt-4 text-horizon-meta font-bold uppercase tracking-[0.14em] text-horizon-muted">{label}</p>
      <h2 className="mt-2 text-horizon-heading font-bold tracking-[-0.025em] text-horizon-ink">{title}</h2>
      {description ? <div className="mt-2 max-w-lg text-horizon-body leading-6 text-horizon-muted">{description}</div> : null}
      {action ? <div className="mt-6 w-full sm:w-auto">{action}</div> : null}
    </HorizonSurface>
  );
}

type FeedbackStateProps = Omit<StatePanelProps, "icon" | "label" | "tone">;

export function EmptyState(props: FeedbackStateProps) {
  return <StatePanel icon={<Inbox className="size-6" />} label="Empty" role="status" {...props} />;
}

export function SuccessState(props: FeedbackStateProps) {
  return <StatePanel aria-live="polite" icon={<CheckCircle2 className="size-6" />} label="Success" role="status" tone="success" {...props} />;
}

export function BlockedState(props: FeedbackStateProps) {
  return <StatePanel icon={<Ban className="size-6" />} label="Setup required" role="status" tone="blocked" {...props} />;
}

type ErrorStateProps = FeedbackStateProps & {
  onRetry?: () => void;
  retryLabel?: string;
};

export function ErrorState({ onRetry, retryLabel = "Try again", action, ...props }: ErrorStateProps) {
  const retryAction = onRetry ? <HorizonButton onClick={onRetry} type="button">{retryLabel}</HorizonButton> : null;
  return <StatePanel action={action ?? retryAction} icon={<AlertCircle className="size-6" />} label="Error" role="alert" tone="danger" {...props} />;
}

export type ValidationError = {
  fieldId?: string;
  message: ReactNode;
};

export function ValidationSummary({ title = "Check the highlighted fields", errors, className, ...props }: Omit<HTMLAttributes<HTMLDivElement>, "title"> & { title?: ReactNode; errors: ValidationError[] }) {
  if (errors.length === 0) return null;
  return (
    <div className={cn("rounded-[var(--horizon-radius-control)] border border-red-200 bg-red-50 p-4 text-red-900", className)} role="alert" {...props}>
      <div className="flex items-start gap-3">
        <AlertCircle aria-hidden="true" className="mt-0.5 size-5 shrink-0" />
        <div className="min-w-0">
          <p className="text-sm font-bold">{title}</p>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-5">
            {errors.map((error, index) => (
              <li key={error.fieldId ?? index}>
                {error.fieldId ? <a className="underline underline-offset-2" href={`#${error.fieldId}`}>{error.message}</a> : error.message}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export function ValidationMessage({ className, ...props }: HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn("mt-2 text-sm font-semibold text-red-700", className)} role="alert" {...props} />;
}
