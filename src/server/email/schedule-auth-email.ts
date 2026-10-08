import { after } from "next/server";

import { authLinkEmail, sendTransactionalEmail } from "@/server/email/send-transactional-email";

type AuthEmail =
  | { kind: "verify"; to: string; url: string }
  | { kind: "reset"; to: string; url: string }
  | { kind: "existing"; to: string };

function message(input: AuthEmail) {
  if (input.kind === "verify") {
    return {
      subject: "Verify your Opti email",
      ...authLinkEmail({
        heading: "Verify your email",
        body: "Use this link to confirm your email and open your Opti account.",
        action: "Verify email",
        url: input.url,
      }),
    };
  }
  if (input.kind === "reset") {
    return {
      subject: "Reset your Opti password",
      ...authLinkEmail({
        heading: "Choose a new password",
        body: "Use this link to set a new password. It expires in one hour.",
        action: "Reset password",
        url: input.url,
      }),
    };
  }
  return {
    subject: "Someone tried to create an Opti account",
    ...authLinkEmail({
      heading: "That email already has an account",
      body: "If this was you, sign in instead. If it was not, you can ignore this email.",
      action: "Sign in",
    }),
  };
}

function failureDetails(error: unknown): { name: string; message: string; cause?: string } {
  if (!(error instanceof Error)) return { name: "UnknownError", message: "Unknown" };
  const cause = error.cause;
  const causeCode =
    cause && typeof cause === "object" && "code" in cause && typeof cause.code === "string" ? cause.code : undefined;
  return { name: error.name, message: error.message, ...(causeCode ? { cause: causeCode } : {}) };
}

export function scheduleAuthEmail(input: AuthEmail): void {
  const email = message(input);
  after(async () => {
    try {
      await sendTransactionalEmail({ to: input.to, ...email });
      console.info("[email] Auth email accepted", { kind: input.kind });
    } catch (error: unknown) {
      console.error("[email] Failed to send auth email", { kind: input.kind, ...failureDetails(error) });
    }
  });
}
