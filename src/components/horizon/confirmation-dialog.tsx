import type { ReactNode } from "react";

import { ActionGroup, HorizonDialog } from "./page-composition";
import { HorizonButton } from "./index";

type ConfirmationDialogProps = {
  isOpen: boolean;
  title: ReactNode;
  description?: ReactNode;
  children?: ReactNode;
  confirmLabel: string;
  cancelLabel?: string;
  isPending?: boolean;
  destructive?: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

export function ConfirmationDialog({
  isOpen,
  title,
  description,
  children,
  confirmLabel,
  cancelLabel = "Keep editing",
  isPending = false,
  destructive = true,
  onCancel,
  onConfirm,
}: ConfirmationDialogProps) {
  return (
    <HorizonDialog
      description={description}
      footer={
        <ActionGroup className="sm:justify-end">
          <HorizonButton disabled={isPending} onClick={onCancel} tone="secondary" type="button">{cancelLabel}</HorizonButton>
          <HorizonButton aria-busy={isPending || undefined} disabled={isPending} onClick={onConfirm} tone={destructive ? "danger" : "primary"} type="button">{confirmLabel}</HorizonButton>
        </ActionGroup>
      }
      isOpen={isOpen}
      onClose={onCancel}
      title={title}
    >
      {children ?? description}
    </HorizonDialog>
  );
}
