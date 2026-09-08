"use client";

import { toast } from "sonner";

import { Toaster } from "@/components/ui/sonner";

type HorizonToastOptions = {
  tone?: "success" | "error" | "info";
  title: string;
  description?: string;
};

export function showHorizonToast({ tone = "info", title, description }: HorizonToastOptions) {
  toast[tone](title, { description });
}

export function HorizonToaster() {
  return (
    <Toaster
      closeButton
      position="top-center"
      toastOptions={{
        classNames: {
          toast: "cn-toast border-horizon-outline/15 bg-white text-horizon-ink shadow-[var(--horizon-shadow-card)]",
          title: "font-bold",
          description: "text-horizon-muted",
          actionButton: "horizon-button-primary min-h-9 px-3 text-xs",
          cancelButton: "horizon-button-ghost min-h-9 px-3 text-xs",
        },
      }}
    />
  );
}
