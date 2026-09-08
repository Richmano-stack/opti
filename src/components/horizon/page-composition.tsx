"use client";

import type { HTMLAttributes, ReactNode } from "react";
import { useEffect, useId, useRef } from "react";
import { FileText, X } from "lucide-react";

import { cn } from "@/lib/utils";

import { HorizonButton, HorizonDivider, HorizonSurface } from "./index";

type ContentContainerProps = HTMLAttributes<HTMLDivElement> & {
  size?: "narrow" | "default" | "wide";
};

export function ContentContainer({ className, size = "default", ...props }: ContentContainerProps) {
  const sizes = {
    narrow: "max-w-3xl",
    default: "max-w-5xl",
    wide: "max-w-7xl",
  };

  return <div className={cn("mx-auto w-full px-4 sm:px-6 lg:px-8", sizes[size], className)} {...props} />;
}

type PageHeaderProps = HTMLAttributes<HTMLElement> & {
  eyebrow?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
};

export function PageHeader({ eyebrow, title, description, actions, className, ...props }: PageHeaderProps) {
  return (
    <header className={cn("flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between", className)} {...props}>
      <div className="max-w-2xl space-y-3">
        {eyebrow ? <div>{eyebrow}</div> : null}
        <div className="space-y-2">
          <h1 className="text-horizon-title font-bold tracking-[-0.04em] text-horizon-ink sm:text-horizon-display">{title}</h1>
          {description ? <p className="max-w-xl text-horizon-body leading-6 text-horizon-muted">{description}</p> : null}
        </div>
      </div>
      {actions ? <ActionGroup className="sm:justify-end">{actions}</ActionGroup> : null}
    </header>
  );
}

type SectionHeaderProps = HTMLAttributes<HTMLDivElement> & {
  title: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
};

export function SectionHeader({ title, description, action, className, ...props }: SectionHeaderProps) {
  return (
    <div className={cn("flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between", className)} {...props}>
      <div className="space-y-1">
        <h2 className="text-horizon-heading font-bold tracking-[-0.025em] text-horizon-ink">{title}</h2>
        {description ? <p className="text-horizon-body leading-6 text-horizon-muted">{description}</p> : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}

export function ActionGroup({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("flex flex-col gap-3 sm:flex-row sm:items-center", className)} {...props} />;
}

type FormSectionProps = HTMLAttributes<HTMLElement> & {
  title: ReactNode;
  description?: ReactNode;
};

export function FormSection({ title, description, children, className, ...props }: FormSectionProps) {
  return (
    <section className={cn("space-y-5", className)} {...props}>
      <div className="space-y-1">
        <h2 className="text-horizon-heading font-bold text-horizon-ink">{title}</h2>
        {description ? <p className="text-horizon-body leading-6 text-horizon-muted">{description}</p> : null}
      </div>
      {children}
    </section>
  );
}

type DocumentPreviewCardProps = HTMLAttributes<HTMLDivElement> & {
  title: string;
  summary: string;
  metadata?: ReactNode;
  action?: ReactNode;
  preview?: ReactNode;
};

export function DocumentPreviewCard({ title, summary, metadata, action, preview, className, ...props }: DocumentPreviewCardProps) {
  return (
    <HorizonSurface className={cn("overflow-hidden", className)} {...props}>
      <div className="flex items-start justify-between gap-4 p-5 sm:p-6">
        <div className="flex min-w-0 items-start gap-3">
          <span aria-hidden="true" className="inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-horizon-primary/10 text-horizon-primary">
            <FileText className="size-5" />
          </span>
          <div className="min-w-0 space-y-1">
            <h2 className="text-horizon-heading font-bold text-horizon-ink">{title}</h2>
            <p className="text-horizon-body leading-6 text-horizon-muted">{summary}</p>
            {metadata ? <div className="pt-1 text-horizon-meta font-medium text-horizon-muted">{metadata}</div> : null}
          </div>
        </div>
        {action ? <div className="shrink-0">{action}</div> : null}
      </div>
      <HorizonDivider />
      <div className="bg-horizon-canvas/60 p-5 sm:p-6">{preview ?? <DocumentPreviewPlaceholder />}</div>
    </HorizonSurface>
  );
}

export function DocumentPreviewPlaceholder() {
  return (
    <div aria-label="Document preview" className="rounded-[calc(var(--horizon-radius-card)-0.25rem)] border border-horizon-outline/10 bg-white p-5">
      <div className="h-2.5 w-2/5 rounded-full bg-horizon-ink/15" />
      <div className="mt-5 space-y-3">
        <div className="h-2 w-full rounded-full bg-horizon-ink/10" />
        <div className="h-2 w-11/12 rounded-full bg-horizon-ink/10" />
        <div className="h-2 w-4/5 rounded-full bg-horizon-ink/10" />
      </div>
    </div>
  );
}

export function ScrollRegion({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("min-h-0 overflow-auto overscroll-contain", className)} {...props} />;
}

type HorizonDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  title: ReactNode;
  description?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  variant?: "dialog" | "sheet";
};

export function HorizonDialog({ isOpen, onClose, title, description, children, footer, variant = "dialog" }: HorizonDialogProps) {
  const dialogRef = useRef<HTMLElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const lastFocusedElementRef = useRef<HTMLElement | null>(null);
  const titleId = useId();
  const descriptionId = useId();

  useEffect(() => {
    if (!isOpen) return;
    lastFocusedElementRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    closeButtonRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
        return;
      }
      if (event.key !== "Tab") return;

      const focusableElements = dialogRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      if (!focusableElements?.length) {
        event.preventDefault();
        return;
      }
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];
      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      lastFocusedElementRef.current?.focus();
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;
  const isSheet = variant === "sheet";

  return (
    <div className="fixed inset-0 z-50 flex items-end bg-horizon-ink/40 p-0 sm:items-center sm:justify-center sm:p-6" onMouseDown={onClose}>
      <section ref={dialogRef} aria-describedby={description ? descriptionId : undefined} aria-labelledby={titleId} aria-modal="true" className={cn("flex max-h-[calc(100dvh-1rem)] w-full flex-col bg-horizon-canvas shadow-2xl", isSheet ? "rounded-t-[var(--horizon-radius-card)] sm:max-w-xl sm:rounded-[var(--horizon-radius-card)]" : "rounded-t-[var(--horizon-radius-card)] sm:max-w-2xl sm:rounded-[var(--horizon-radius-card)]")} onMouseDown={(event) => event.stopPropagation()} role="dialog">
        <div className="flex items-start justify-between gap-4 border-b border-horizon-outline/15 px-5 py-4 sm:px-6">
          <div className="space-y-1">
            <h2 id={titleId} className="text-horizon-heading font-bold text-horizon-ink">{title}</h2>
            {description ? <p id={descriptionId} className="text-horizon-body leading-6 text-horizon-muted">{description}</p> : null}
          </div>
          <HorizonButton aria-label="Close dialog" className="size-10 shrink-0 px-0" onClick={onClose} tone="quiet" type="button" ref={closeButtonRef}>
            <X aria-hidden="true" className="size-5" />
          </HorizonButton>
        </div>
        <ScrollRegion className="p-5 sm:p-6">{children}</ScrollRegion>
        {footer ? <div className="border-t border-horizon-outline/15 p-5 sm:px-6">{footer}</div> : null}
      </section>
    </div>
  );
}
