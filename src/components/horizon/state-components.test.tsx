import type { ReactElement, ReactNode } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

import { ConfirmationDialog } from "./confirmation-dialog";
import { HorizonButton } from "./index";
import { LoadingState, SkeletonBlock } from "./loading-state";
import {
  BlockedState,
  EmptyState,
  ErrorState,
  SuccessState,
  ValidationMessage,
  ValidationSummary,
} from "./state-feedback";

type TestElementProps = {
  action?: ReactNode;
  children?: ReactNode;
  footer?: ReactNode;
  onClick?: (event: never) => void;
};

function collectElements(node: ReactNode, type: ReactElement["type"]): ReactElement<TestElementProps>[] {
  if (!node || typeof node !== "object" || !("type" in node)) return [];
  const element = node as ReactElement<TestElementProps>;
  const matches = element.type === type ? [element] : [];
  return matches.concat(
    Array.isArray(element.props.children)
      ? element.props.children.flatMap((child) => collectElements(child, type))
      : collectElements(element.props.children, type),
    collectElements(element.props.action, type),
    collectElements(element.props.footer, type),
  );
}

describe("Horizon state components", () => {
  it("renders empty, success, and blocked states with explicit status text", () => {
    const html = renderToStaticMarkup(
      <>
        <EmptyState title="No résumé yet" description="Add your source document to begin." />
        <SuccessState title="Résumé saved" description="Your changes are ready." />
        <BlockedState title="Setup required" description="Add a master résumé before tailoring." />
      </>,
    );

    expect(html).toContain("No résumé yet");
    expect(html).toContain("Résumé saved");
    expect(html).toContain("Setup required");
    expect(html).toContain('role="status"');
  });

  it("exposes errors as alerts and connects a native retry action", () => {
    const onRetry = vi.fn();
    const state = ErrorState({ title: "Generation failed", description: "Try the request again.", onRetry });
    const html = renderToStaticMarkup(state);
    const [retryButton] = collectElements(state, HorizonButton);

    expect(html).toContain('role="alert"');
    expect(html).toContain("Generation failed");
    retryButton.props.onClick?.({} as never);
    expect(onRetry).toHaveBeenCalledOnce();
  });

  it("announces loading without exposing decorative skeletons", () => {
    const html = renderToStaticMarkup(
      <LoadingState label="Loading résumé">
        <SkeletonBlock className="h-12" />
      </LoadingState>,
    );

    expect(html).toContain('aria-busy="true"');
    expect(html).toContain("Loading résumé");
    expect(html).toContain('aria-hidden="true"');
  });

  it("renders a linked validation summary and field-level message", () => {
    const html = renderToStaticMarkup(
      <>
        <ValidationSummary title="Fix 2 fields" errors={[{ fieldId: "name", message: "Enter your name." }, { message: "Résumé text is required." }]} />
        <ValidationMessage id="name-error">Enter your name.</ValidationMessage>
      </>,
    );

    expect(html).toContain('href="#name"');
    expect(html).toContain('id="name-error"');
    expect(html).toContain('role="alert"');
  });

  it("wires confirmation and cancellation to keyboard-accessible buttons", () => {
    const onCancel = vi.fn();
    const onConfirm = vi.fn();
    const dialog = ConfirmationDialog({
      isOpen: true,
      title: "Discard changes?",
      description: "Your unsaved edits will be lost.",
      confirmLabel: "Discard",
      onCancel,
      onConfirm,
    });
    const buttons = collectElements(dialog, HorizonButton);

    expect(renderToStaticMarkup(dialog)).toContain("Discard changes?");
    buttons.find((button) => button.props.children === "Keep editing")?.props.onClick?.({} as never);
    buttons.find((button) => button.props.children === "Discard")?.props.onClick?.({} as never);
    expect(onCancel).toHaveBeenCalledOnce();
    expect(onConfirm).toHaveBeenCalledOnce();
  });
});
